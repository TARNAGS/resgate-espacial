'use strict';

/* Resgate Espacial — protótipo 01 (descartável).
   Objetivo: ver a cara do jogo e sentir o controle antes do M1.
   JavaScript puro com Canvas (D-011); textos do jogo em inglês (D-007). */

// ===== Parâmetros de ajuste (Regras do jogo, seção 13) =====
const PARAMS = {
  gravity: 55,              // puxa a nave para baixo (unidades/s²)
  thrust: 125,              // força do propulsor (~2,3 vezes a gravidade)
  keyRotationSpeed: 210,    // giro no teclado (graus/s)
  touchRotationSpeed: 480,  // giro até a direção do dedo (graus/s)
  maxSpeed: 260,            // velocidade máxima (unidades/s)
  landingMaxVy: 65,         // descida máxima para pousar (unidades/s)
  landingMaxVx: 45,         // deslize lateral máximo para pousar
  landingMaxAngle: 20,      // inclinação máxima no pouso (graus)
  refuelPerSecond: 0.6,     // fração do tanque abastecida por segundo
  boardingSeconds: 2,       // duração do embarque
  lowFuel: 0.2,             // abaixo disso, aviso de combustível baixo
  lives: 3,
  joystickRadius: 56,       // raio do direcional (px de tela)
  joystickDeadzone: 10,     // abaixo disso, o arrasto não muda a direção
};

// Cada nível define as regras do gerador; o cenário muda a cada partida (fases procedurais).
const LEVELS = [
  { id: 1, name: 'FIRST FLIGHT', goal: 'Take off, fly to the crew and bring them back.', length: 1800, minGap: 250, roughness: 45, rocks: 0, passGap: 0, fuelStation: false, tankSeconds: 40 },
  { id: 2, name: 'ROCK FIELD', goal: 'Rocks ahead. Touching anything explodes the ship.', length: 2600, minGap: 200, roughness: 85, rocks: 7, passGap: 105, fuelStation: false, tankSeconds: 40 },
  { id: 3, name: 'LONG HAUL', goal: 'Too far for one tank: land on the fuel station.', length: 3800, minGap: 180, roughness: 100, rocks: 10, passGap: 95, fuelStation: true, tankSeconds: 26 },
];

const WORLD_H = 600;   // altura do mundo; a tela sempre mostra a altura inteira
const STEP = 20;       // distância entre pontos do terreno
const SHIP_TIP = 11, SHIP_BASE = 8, SHIP_HALF = 7;   // triângulo do tamanho de um cursor
const SAVE_KEY = 'resgate-espacial:prototipo-01';

// ===== Utilidades =====
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rad = (d) => (d * Math.PI) / 180;

function wrapAngle(a) {
  while (a > Math.PI) a -= 2 * Math.PI;
  while (a < -Math.PI) a += 2 * Math.PI;
  return a;
}

function fmtTime(t) {
  const m = Math.floor(t / 60);
  return `${String(m).padStart(2, '0')}:${(t - m * 60).toFixed(1).padStart(4, '0')}`;
}

// Gerador de números aleatórios com semente: a mesma semente sempre gera o mesmo cenário
function mulberry32(seed) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sample(arr, x) {
  const f = clamp(x / STEP, 0, arr.length - 1);
  const i = Math.floor(f);
  return i + 1 < arr.length ? lerp(arr[i], arr[i + 1], f - i) : arr[i];
}

function pointInPoly(p, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a.y > p.y) !== (b.y > p.y) && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

// ===== Geração procedural da fase =====
function generateLevel(def, seed) {
  const rnd = mulberry32(seed);
  const L = def.length;
  const n = Math.floor(L / STEP) + 1;
  const makeWaves = () => [1, 2, 3, 5].map((k) => ({
    amp: (def.roughness * (0.45 + rnd() * 0.8)) / k,
    freq: (0.0011 + rnd() * 0.0021) * k,
    phase: rnd() * Math.PI * 2,
  }));
  const floorWaves = makeWaves();
  const ceilWaves = makeWaves();
  const wave = (ws, x) => ws.reduce((s, w) => s + w.amp * Math.sin(x * w.freq + w.phase), 0);

  const floor = new Array(n);
  const ceil = new Array(n);
  for (let i = 0; i < n; i++) {
    const x = i * STEP;
    let f = Math.min(WORLD_H - 125 + wave(floorWaves, x), WORLD_H - 24);
    let c = Math.max(115 + wave(ceilWaves, x), 24);
    if (f - c < def.minGap) {        // garante o corredor mínimo
      const mid = (f + c) / 2;
      f = Math.min(mid + def.minGap / 2, WORLD_H - 24);
      c = Math.max(f - def.minGap, 24);
      if (f - c < def.minGap) f = c + def.minGap;
    }
    floor[i] = f;
    ceil[i] = c;
  }

  // Plataformas: o chão fica plano no pad e se funde aos poucos com o terreno
  const pads = [];
  function addPad(kind, cx, width) {
    const half = width / 2, core = half + STEP, blend = 60, headroom = 170;
    const y = clamp(floor[clamp(Math.round(cx / STEP), 0, n - 1)], headroom + 40, WORLD_H - 40);
    for (let i = 0; i < n; i++) {
      const d = Math.abs(i * STEP - cx);
      if (d > core + blend) continue;
      const w = d <= core ? 1 : 1 - (d - core) / blend;   // plano um pouco além da borda do pad
      const k = w * w * (3 - 2 * w);
      floor[i] = lerp(floor[i], y, k);
      ceil[i] = Math.min(ceil[i], lerp(ceil[i], y - headroom, k));
      if (floor[i] - ceil[i] < def.minGap) ceil[i] = floor[i] - def.minGap;
    }
    pads.push({ kind, x1: cx - half, x2: cx + half, y, refuel: kind !== 'crew' });
  }
  addPad('base', 130, 120);
  if (def.fuelStation) addPad('fuel', L / 2, 110);
  addPad('crew', L - 150, 120);

  // Pedras flutuantes, sempre deixando passagem
  const rocks = [];
  const busy = pads.map((p) => [p.x1 - 140, p.x2 + 140]);
  for (let tries = 0; rocks.length < def.rocks && tries < 600; tries++) {
    const r = 15 + rnd() * 19;
    const x = 300 + rnd() * (L - 600);
    if (busy.some(([a, b]) => x + r > a && x - r < b)) continue;
    if (rocks.some((o) => Math.abs(o.x - x) < 170)) continue;
    let top = -Infinity, bottom = Infinity;
    for (let xx = x - r; xx <= x + r; xx += STEP / 2) {
      top = Math.max(top, sample(ceil, xx));
      bottom = Math.min(bottom, sample(floor, xx));
    }
    const yMin = top + r + 10, yMax = bottom - r - 10;
    if (yMax <= yMin) continue;
    const y = yMin + rnd() * (yMax - yMin);
    if (Math.max(y - r - top, bottom - (y + r)) < def.passGap) continue;
    const pts = [];
    for (let j = 0; j < 7; j++) {
      const a = (j / 7) * Math.PI * 2 + rnd() * 0.5;
      const rr = r * (0.72 + rnd() * 0.38);
      pts.push({ x: x + Math.cos(a) * rr, y: y + Math.sin(a) * rr });
    }
    rocks.push({ x, y, r, pts });
  }

  return { def, seed, L, n, floor, ceil, pads, rocks };
}

// ===== Som (Web Audio; começa só depois da primeira interação) =====
const Sound = {
  ctx: null,
  enabled: true,
  thrustGain: null,
  unlock() {
    try {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
    } catch (_) { /* sem som neste navegador */ }
  },
  tone(freq, dur, type = 'square', vol = 0.05, slide = 0) {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  },
  noise(dur, vol = 0.15) {
    if (!this.enabled || !this.ctx) return;
    const len = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource();
    const g = this.ctx.createGain();
    g.gain.value = vol;
    src.buffer = buf;
    src.connect(g).connect(this.ctx.destination);
    src.start();
  },
  setThrust(on) {
    if (!this.ctx) return;
    if (!this.thrustGain) {
      const len = this.ctx.sampleRate;
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 420;
      this.thrustGain = this.ctx.createGain();
      this.thrustGain.gain.value = 0;
      src.connect(filter).connect(this.thrustGain).connect(this.ctx.destination);
      src.start();
    }
    const target = on && this.enabled ? 0.09 : 0;
    this.thrustGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.03);
  },
  land() { this.tone(660, 0.08); setTimeout(() => this.tone(880, 0.1, 'square', 0.04), 70); },
  crash() { this.noise(0.6, 0.2); this.tone(160, 0.5, 'sawtooth', 0.06, -110); },
  board(i) { this.tone(520 + i * 160, 0.09, 'square', 0.05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, 0.14, 'square', 0.05), i * 110)); },
  warn() { this.tone(300, 0.16, 'square', 0.05); setTimeout(() => this.tone(300, 0.16, 'square', 0.05), 220); },
  click() { this.tone(900, 0.04, 'square', 0.03); },
};

// ===== Progresso salvo no aparelho =====
let progress = { unlocked: 1, completed: {}, best: {}, rescues: {}, sound: true };

function loadProgress() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) progress = Object.assign(progress, JSON.parse(raw));
  } catch (_) { /* sem armazenamento: o progresso vale só nesta sessão */ }
}

function saveProgress() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(progress)); } catch (_) { /* idem */ }
}

// ===== Estado do jogo =====
const G = {
  screen: 'menu',
  paused: false,
  over: null,          // 'complete' | 'gameover'
  level: null,
  ship: null,
  lives: PARAMS.lives,
  crewOnBoard: false,
  checkpointFuel: 1,   // combustível que a nave tinha ao chegar na tripulação
  boardingT: 0,
  outOfFuelT: 0,
  timer: 0,
  timerOn: false,
  camX: 0,
  particles: [],
  messages: [],
};

const keys = { left: false, right: false, thrust: false };
let joy = null;
let selectedLevel = 1;

// ===== Tela e Canvas =====
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const probe = document.getElementById('safe-probe');
let dpr = 1, cssW = 0, cssH = 0, scale = 1, viewW = 0;
let safe = { top: 0, right: 0, bottom: 0, left: 0 };
const isTouch = window.matchMedia('(pointer: coarse)').matches;

function resize() {
  dpr = Math.min(2, window.devicePixelRatio || 1);
  cssW = window.innerWidth;
  cssH = window.innerHeight;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  scale = cssH / WORLD_H;
  viewW = cssW / scale;
  const cs = getComputedStyle(probe);
  safe = {
    top: parseFloat(cs.paddingTop) || 0,
    right: parseFloat(cs.paddingRight) || 0,
    bottom: parseFloat(cs.paddingBottom) || 0,
    left: parseFloat(cs.paddingLeft) || 0,
  };
}

// ===== Telas (HTML) =====
const el = (id) => document.getElementById(id);
const menuEl = el('menu'), settingsEl = el('settings'), overlayEl = el('overlay'), rotateEl = el('rotate');

function showScreen(name) {
  G.screen = name;
  menuEl.classList.toggle('hidden', name !== 'menu');
  settingsEl.classList.toggle('hidden', name !== 'settings');
  if (name !== 'game') hideOverlay();
  if (name === 'menu') renderMap();
  joy = null;
  Sound.setThrust(false);
}

function showOverlay(title, text, buttons) {
  el('ov-title').textContent = title;
  el('ov-text').textContent = text;
  const box = el('ov-buttons');
  box.innerHTML = '';
  buttons.forEach(([label, fn, primary]) => {
    const b = document.createElement('button');
    b.className = `btn${primary ? ' primary' : ''}`;
    b.textContent = label;
    b.onclick = () => { Sound.click(); fn(); };
    box.appendChild(b);
  });
  overlayEl.classList.remove('hidden');
}

function hideOverlay() { overlayEl.classList.add('hidden'); }

function defaultLevel() {
  const open = LEVELS.filter((l) => l.id <= progress.unlocked);
  const next = open.find((l) => !progress.completed[l.id]);
  return (next || open[open.length - 1]).id;
}

function levelState(lv) {
  if (progress.completed[lv.id]) return 'done';
  return lv.id <= progress.unlocked ? 'open' : 'locked';
}

// Mapa de progresso: um planeta por nível; o "?" indica que vêm mais níveis
function renderMap() {
  const pos = [{ x: 70, y: 112 }, { x: 210, y: 62 }, { x: 350, y: 116 }, { x: 490, y: 66 }];
  let svg = '<svg viewBox="0 0 560 175" role="group">';
  const starRnd = mulberry32(7);
  for (let i = 0; i < 40; i++) {
    svg += `<circle class="map-star" cx="${(starRnd() * 560).toFixed(1)}" cy="${(starRnd() * 175).toFixed(1)}" r="${(0.5 + starRnd()).toFixed(2)}" opacity="${(0.2 + starRnd() * 0.6).toFixed(2)}"/>`;
  }
  svg += `<path class="map-path" d="M ${pos.map((p) => `${p.x} ${p.y}`).join(' L ')}"/>`;
  LEVELS.forEach((lv, i) => {
    const p = pos[i];
    const st = levelState(lv);
    const sel = lv.id === selectedLevel;
    const runs = progress.rescues[lv.id] || 0;
    svg += `<g class="node ${st}" data-level="${lv.id}" tabindex="${st === 'locked' ? -1 : 0}" role="button" aria-label="Level ${lv.id}, ${lv.name}, ${st === 'done' ? 'completed' : st === 'open' ? 'available' : 'locked'}">`;
    if (sel) svg += `<circle class="ring" cx="${p.x}" cy="${p.y}" r="31"/>`;
    svg += `<circle class="planet" cx="${p.x}" cy="${p.y}" r="22"/>`;
    svg += `<text class="num" x="${p.x}" y="${p.y + 6}">${st === 'done' ? '✓' : st === 'locked' ? '·' : lv.id}</text>`;
    svg += `<text class="label" x="${p.x}" y="${p.y + 45}">${lv.id}. ${lv.name}</text>`;
    if (st === 'done') {
      svg += `<text class="best" x="${p.x}" y="${p.y + 59}">BEST ${fmtTime(progress.best[lv.id])} · ×${runs}</text>`;
    } else if (st === 'locked') {
      svg += `<text class="best" x="${p.x}" y="${p.y + 59}" style="fill:#566079">LOCKED</text>`;
    }
    svg += '</g>';
  });
  const s = pos[3];
  svg += `<g class="node soon"><circle class="planet" cx="${s.x}" cy="${s.y}" r="22"/><text class="num" x="${s.x}" y="${s.y + 6}">?</text><text class="label" x="${s.x}" y="${s.y + 45}">MORE SOON</text></g>`;
  svg += '</svg>';
  el('map').innerHTML = svg;
  el('map').querySelectorAll('.node[data-level]').forEach((node) => {
    const pick = () => {
      const id = Number(node.dataset.level);
      if (levelState(LEVELS[id - 1]) === 'locked') return;
      Sound.click();
      selectedLevel = id;
      renderMap();
    };
    node.addEventListener('click', pick);
    node.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
  });
  const lv = LEVELS[selectedLevel - 1];
  el('level-info').textContent = `LEVEL ${lv.id} · ${lv.name} — ${lv.goal}`;
}

// ===== Fluxo da partida =====
function startLevel(id, seed) {
  const def = LEVELS.find((l) => l.id === id);
  G.level = generateLevel(def, seed ?? Math.floor(Math.random() * 1e9));
  G.lives = PARAMS.lives;
  G.crewOnBoard = false;
  G.checkpointFuel = 1;
  G.timer = 0;
  G.timerOn = false;
  G.particles = [];
  G.messages = [];
  G.over = null;
  G.paused = false;
  G.outOfFuelT = 0;
  spawnAt('base', 1);
  showScreen('game');
  message(`LEVEL ${def.id} · ${def.name}`, 3);
  message(def.goal, 5);
  if (def.id === 1) message(isTouch ? 'TOUCH AND HOLD TO THRUST · DRAG TO STEER' : 'HOLD ↑ TO THRUST · ←/→ TO ROTATE', 7);
}

function spawnAt(kind, fuel) {
  const pad = G.level.pads.find((p) => p.kind === kind);
  G.ship = {
    x: (pad.x1 + pad.x2) / 2, y: pad.y - SHIP_BASE, vx: 0, vy: 0, a: 0,
    state: 'landed', pad, fuel, thrusting: false, explodeT: 0, resetCrew: false,
  };
  G.outOfFuelT = 0;
  G.camX = clamp(G.ship.x - viewW / 2, 0, Math.max(0, G.level.L - viewW));
}

function message(text, dur = 2.5, warn = false) {
  G.messages.push({ text, t: 0, dur, warn });
  if (G.messages.length > 3) G.messages.shift();
}

function togglePause(force) {
  if (G.screen !== 'game' || G.over) return;
  G.paused = force ?? !G.paused;
  joy = null;
  Sound.setThrust(false);
  if (G.paused) {
    const { def, seed } = G.level;
    showOverlay('PAUSED', '', [
      ['RESUME', () => togglePause(false), true],
      ['RESTART', () => startLevel(def.id, seed)],
      ['MENU', toMenu],
    ]);
  } else {
    hideOverlay();
  }
}

function toMenu() {
  selectedLevel = defaultLevel();
  showScreen('menu');
}

function completeLevel() {
  G.over = 'complete';
  G.timerOn = false;
  Sound.setThrust(false);
  const id = G.level.def.id;
  const prevBest = progress.best[id];
  const isBest = prevBest === undefined || G.timer < prevBest;
  if (isBest) progress.best[id] = Number(G.timer.toFixed(1));
  progress.completed[id] = true;
  progress.rescues[id] = (progress.rescues[id] || 0) + 1;
  progress.unlocked = Math.max(progress.unlocked, Math.min(id + 1, LEVELS.length));
  saveProgress();
  Sound.win();
  const buttons = [];
  if (id < LEVELS.length) buttons.push(['NEXT LEVEL', () => startLevel(id + 1), true]);
  buttons.push(['PLAY AGAIN', () => startLevel(id), id >= LEVELS.length]);
  buttons.push(['MENU', toMenu]);
  showOverlay('RESCUE COMPLETE', `Time ${fmtTime(G.timer)} · ${isBest ? 'NEW BEST!' : `best ${fmtTime(prevBest)}`} · The next run builds a new layout.`, buttons);
}

function gameOver() {
  G.over = 'gameover';
  G.timerOn = false;
  Sound.setThrust(false);
  const { def, seed } = G.level;
  showOverlay('GAME OVER', 'No lives left. Try the same layout again or go back to the map.', [
    ['TRY AGAIN', () => startLevel(def.id, seed), true],
    ['MENU', toMenu],
  ]);
}

// ===== Física e regras =====
function shipVerts(s) {
  const c = Math.cos(s.a), sn = Math.sin(s.a);
  const tf = (lx, ly) => ({ x: s.x + lx * c - ly * sn, y: s.y + lx * sn + ly * c });
  return [tf(0, -SHIP_TIP), tf(SHIP_HALF, SHIP_BASE), tf(-SHIP_HALF, SHIP_BASE)];
}

function shipSamples(v) {
  const out = [];
  for (let i = 0; i < 3; i++) {
    const a = v[i], b = v[(i + 1) % 3];
    for (let k = 0; k < 4; k++) out.push({ x: lerp(a.x, b.x, k / 4), y: lerp(a.y, b.y, k / 4) });
  }
  return out;
}

function landingSafe(s) {
  return s.vy <= PARAMS.landingMaxVy && Math.abs(s.vx) <= PARAMS.landingMaxVx && Math.abs(s.a) <= rad(PARAMS.landingMaxAngle);
}

function update(dt) {
  updateParticles(dt);
  if (G.over) return;
  for (const m of G.messages) m.t += dt;
  G.messages = G.messages.filter((m) => m.t < m.dur);
  if (G.timerOn) G.timer += dt;
  const s = G.ship;
  const thrustInput = keys.thrust || Boolean(joy);
  if (s.state === 'landed') updateLanded(s, dt, thrustInput);
  else if (s.state === 'boarding') updateBoarding(s, dt);
  else if (s.state === 'flying') updateFlying(s, dt, thrustInput);
  else if (s.state === 'exploding') updateExploding(s, dt);
  Sound.setThrust(s.thrusting && !G.paused);
  updateCamera(dt);
}

function updateLanded(s, dt, thrustInput) {
  s.thrusting = false;
  if (s.pad.refuel) s.fuel = Math.min(1, s.fuel + PARAMS.refuelPerSecond * dt);
  if (!s.pad.refuel && s.fuel <= 0) {
    // Sem combustível numa plataforma que não abastece: explode e volta à base sem a tripulação
    G.outOfFuelT += dt;
    if (G.outOfFuelT > 1.2) {
      message('OUT OF FUEL', 2.5, true);
      explode(true, null);
    }
    return;
  }
  if (thrustInput) {
    s.state = 'flying';
    s.pad = null;
    s.y -= 2;
    s.vy = -25;
    G.timerOn = true;
  }
}

function updateBoarding(s, dt) {
  s.thrusting = false;
  const prev = G.boardingT;
  G.boardingT += dt;
  for (let i = 0; i < 3; i++) {
    const t = 0.45 * i + 0.7;
    if (prev < t && G.boardingT >= t) Sound.board(i);
  }
  if (G.boardingT >= PARAMS.boardingSeconds) {
    G.crewOnBoard = true;
    G.checkpointFuel = s.fuel;
    s.state = 'landed';
    message('CREW ON BOARD · BACK TO BASE!', 3);
  }
}

function updateFlying(s, dt, thrustInput) {
  let turn = 0;
  if (keys.left) turn -= 1;
  if (keys.right) turn += 1;
  if (turn) {
    s.a += turn * rad(PARAMS.keyRotationSpeed) * dt;
  } else if (joy) {
    const dx = joy.x - joy.cx, dy = joy.y - joy.cy;
    if (Math.hypot(dx, dy) > PARAMS.joystickDeadzone) {
      const target = Math.atan2(dx, -dy);   // 0 = para cima; positivo = sentido horário
      const maxStep = rad(PARAMS.touchRotationSpeed) * dt;
      s.a += clamp(wrapAngle(target - s.a), -maxStep, maxStep);
    }
  }
  s.a = wrapAngle(s.a);

  s.thrusting = thrustInput && s.fuel > 0;
  if (s.thrusting) {
    s.vx += Math.sin(s.a) * PARAMS.thrust * dt;
    s.vy -= Math.cos(s.a) * PARAMS.thrust * dt;
    s.fuel = Math.max(0, s.fuel - dt / G.level.def.tankSeconds);
    if (s.fuel === 0) message('OUT OF FUEL', 2, true);
  }
  s.vy += PARAMS.gravity * dt;
  const sp = Math.hypot(s.vx, s.vy);
  if (sp > PARAMS.maxSpeed) {
    s.vx *= PARAMS.maxSpeed / sp;
    s.vy *= PARAMS.maxSpeed / sp;
  }
  s.x += s.vx * dt;
  s.y += s.vy * dt;
  checkCollisions(s);
}

function checkCollisions(s) {
  const lv = G.level;
  const verts = shipVerts(s);
  const pts = shipSamples(verts);
  const onFloor = [];
  for (const p of pts) {
    if (p.x <= 0 || p.x >= lv.L) return explode(false, 'HIT THE WALL');
    if (p.y <= sample(lv.ceil, p.x)) return explode(false, 'HIT THE CEILING');
    if (p.y >= sample(lv.floor, p.x)) onFloor.push(p);
  }
  for (const r of lv.rocks) {
    if (Math.abs(r.x - s.x) > r.r + 16 || Math.abs(r.y - s.y) > r.r + 16) continue;
    if (pts.some((p) => pointInPoly(p, r.pts)) || r.pts.some((q) => pointInPoly(q, verts))) {
      return explode(false, 'HIT A ROCK');
    }
  }
  if (onFloor.length) tryLanding(s, onFloor);
}

function tryLanding(s, contacts) {
  const pad = G.level.pads.find((p) => contacts.every((c) => c.x >= p.x1 && c.x <= p.x2));
  if (!pad) return explode(false, 'TOUCHED THE GROUND');
  if (s.vy < 0) return;   // subindo de uma plataforma: só raspou, não é pouso nem batida
  if (Math.abs(s.a) > rad(PARAMS.landingMaxAngle)) return explode(false, 'LANDED TILTED');
  if (s.vy > PARAMS.landingMaxVy || Math.abs(s.vx) > PARAMS.landingMaxVx) return explode(false, 'LANDED TOO FAST');
  s.state = 'landed';
  s.pad = pad;
  s.vx = 0;
  s.vy = 0;
  s.a = 0;
  s.y = pad.y - SHIP_BASE;
  s.thrusting = false;
  Sound.land();
  if (pad.kind === 'crew' && !G.crewOnBoard) {
    s.state = 'boarding';
    G.boardingT = 0;
    if (s.fuel < PARAMS.lowFuel) {
      message('LOW FUEL! PLAN YOUR WAY BACK', 4, true);
      Sound.warn();
    } else {
      message('CREW BOARDING...', 2);
    }
  } else if (pad.kind === 'base' && G.crewOnBoard) {
    completeLevel();
  } else if (pad.kind === 'base') {
    message('REFUELED · GO GET THE CREW →', 2.5);
  } else if (pad.kind === 'fuel') {
    message('REFUELING...', 2);
  }
}

function explode(resetCrew, reason) {
  const s = G.ship;
  s.state = 'exploding';
  s.explodeT = 0;
  s.thrusting = false;
  s.resetCrew = resetCrew;
  G.lives -= 1;
  G.outOfFuelT = 0;
  spawnExplosion(s.x, s.y);
  Sound.crash();
  if (reason) message(reason, 2, true);
}

function updateExploding(s, dt) {
  s.explodeT += dt;
  if (s.explodeT < 1.4) return;
  if (G.lives <= 0) return gameOver();
  // Pontos de retorno (Regras do jogo, seção 7.1)
  if (s.resetCrew) G.crewOnBoard = false;
  if (G.crewOnBoard) spawnAt('crew', G.checkpointFuel);
  else spawnAt('base', 1);
  message(`${G.lives} ${G.lives === 1 ? 'LIFE' : 'LIVES'} LEFT`, 2);
}

function updateCamera(dt) {
  const s = G.ship;
  const look = clamp(s.vx * 0.6, -viewW * 0.25, viewW * 0.25);
  const target = clamp(s.x - viewW / 2 + look, 0, Math.max(0, G.level.L - viewW));
  G.camX += (target - G.camX) * Math.min(1, dt * 4);
}

function spawnExplosion(x, y) {
  for (let i = 0; i < 28; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 40 + Math.random() * 160;
    G.particles.push({
      x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      life: 1.1 + Math.random() * 0.6, ang: Math.random() * 6.28,
      spin: (Math.random() - 0.5) * 12, len: 3 + Math.random() * 6,
    });
  }
}

function updateParticles(dt) {
  for (const p of G.particles) {
    p.vy += PARAMS.gravity * 0.6 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.ang += p.spin * dt;
    p.life -= dt;
  }
  G.particles = G.particles.filter((p) => p.life > 0);
}

// ===== Desenho =====
const STARS = Array.from({ length: 140 }, () => ({
  u: Math.random(), v: Math.random(), z: 0.15 + Math.random() * 0.5, b: 0.3 + Math.random() * 0.7, ph: Math.random() * 6.28,
}));
const FONT = '"Courier New", ui-monospace, monospace';

function render(now) {
  const t = now / 1000;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const g = ctx.createLinearGradient(0, 0, 0, cssH);
  g.addColorStop(0, '#0b1020');
  g.addColorStop(1, '#03040a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, cssW, cssH);
  drawStars(t);
  if (G.screen !== 'game' || !G.level) return;

  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, -G.camX * scale * dpr, 0);
  drawCave();
  drawPads(t);
  drawRocks();
  drawCrew(t);
  drawShip();
  drawParticles();

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawObjectiveArrow(t);
  drawHUD(t);
  drawMessages(t);
  drawJoystick();
  drawPauseButton();
}

function drawStars(t) {
  const off = G.screen === 'game' ? G.camX * scale : t * 12;
  for (const s of STARS) {
    const x = (((s.u * cssW - off * s.z) % cssW) + cssW) % cssW;
    const a = s.b * (0.65 + 0.35 * Math.sin(t * 2 + s.ph));
    ctx.fillStyle = `rgba(220,235,255,${a.toFixed(3)})`;
    const size = s.z > 0.5 ? 2 : 1;
    ctx.fillRect(x, s.v * cssH, size, size);
  }
}

function strokeLine(arr, i0, i1, dy) {
  ctx.beginPath();
  for (let i = i0; i <= i1; i++) {
    if (i === i0) ctx.moveTo(i * STEP, arr[i] + dy);
    else ctx.lineTo(i * STEP, arr[i] + dy);
  }
  ctx.stroke();
}

function drawCave() {
  const lv = G.level;
  const i0 = Math.max(0, Math.floor(G.camX / STEP) - 1);
  const i1 = Math.min(lv.n - 1, Math.ceil((G.camX + viewW) / STEP) + 1);
  const x0 = i0 * STEP, x1 = i1 * STEP;
  ctx.fillStyle = '#121a29';
  ctx.beginPath();
  ctx.moveTo(x0, -20);
  for (let i = i0; i <= i1; i++) ctx.lineTo(i * STEP, lv.ceil[i]);
  ctx.lineTo(x1, -20);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x0, WORLD_H + 20);
  for (let i = i0; i <= i1; i++) ctx.lineTo(i * STEP, lv.floor[i]);
  ctx.lineTo(x1, WORLD_H + 20);
  ctx.closePath();
  ctx.fill();
  ctx.lineJoin = 'round';
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(70,224,200,0.16)';
  strokeLine(lv.ceil, i0, i1, -9);
  strokeLine(lv.floor, i0, i1, 9);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#46e0c8';
  strokeLine(lv.ceil, i0, i1, 0);
  strokeLine(lv.floor, i0, i1, 0);
  ctx.fillStyle = '#121a29';
  if (x0 <= 0) {
    ctx.fillRect(-80, -20, 80, WORLD_H + 40);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, WORLD_H); ctx.stroke();
  }
  if (x1 >= lv.L - STEP) {
    ctx.fillRect(lv.L, -20, 80, WORLD_H + 40);
    ctx.beginPath(); ctx.moveTo(lv.L, 0); ctx.lineTo(lv.L, WORLD_H); ctx.stroke();
  }
}

function drawPads(t) {
  ctx.font = `700 11px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const blink = Math.sin(t * 4) > 0;
  for (const p of G.level.pads) {
    const colors = { base: ['#7cc4ff', '#e8f1ff'], fuel: ['#ffd166', '#2b2b2b'], crew: ['#ff9f43', '#2b1a0a'] }[p.kind];
    for (let x = p.x1, k = 0; x < p.x2; x += 12, k++) {
      ctx.fillStyle = colors[k % 2];
      ctx.fillRect(x, p.y, Math.min(12, p.x2 - x), 6);
    }
    ctx.fillStyle = '#2a3348';
    ctx.fillRect(p.x1 + 6, p.y + 6, 4, 18);
    ctx.fillRect(p.x2 - 10, p.y + 6, 4, 18);
    ctx.fillStyle = blink ? colors[0] : '#333a4a';
    ctx.fillRect(p.x1 - 2, p.y - 4, 4, 4);
    ctx.fillRect(p.x2 - 2, p.y - 4, 4, 4);
    ctx.fillStyle = colors[0];
    ctx.fillText({ base: 'BASE', fuel: 'FUEL', crew: 'SOS' }[p.kind], (p.x1 + p.x2) / 2, p.y - 32);
    if (p.kind === 'base') {
      ctx.strokeStyle = '#7cc4ff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(p.x1 - 34, p.y - 30, 26, 30);
      ctx.beginPath(); ctx.moveTo(p.x1 - 21, p.y - 30); ctx.lineTo(p.x1 - 21, p.y - 44); ctx.stroke();
      ctx.fillStyle = blink ? '#ff5d5d' : '#5a2a2a';
      ctx.fillRect(p.x1 - 23, p.y - 47, 4, 4);
    } else if (p.kind === 'fuel') {
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(p.x2 + 6, p.y - 20, 12, 20);
      ctx.fillStyle = '#2b2b2b';
      ctx.fillRect(p.x2 + 8, p.y - 17, 8, 5);
    } else {
      ctx.strokeStyle = '#ff9f43';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(p.x2 + 10, p.y); ctx.lineTo(p.x2 + 10, p.y - 36); ctx.stroke();
      ctx.fillStyle = '#ff9f43';
      const wave = Math.sin(t * 6) * 2;
      ctx.beginPath();
      ctx.moveTo(p.x2 + 10, p.y - 36);
      ctx.lineTo(p.x2 + 26, p.y - 32 + wave);
      ctx.lineTo(p.x2 + 10, p.y - 27);
      ctx.closePath();
      ctx.fill();
    }
  }
}

function drawRocks() {
  ctx.lineWidth = 2;
  for (const r of G.level.rocks) {
    if (r.x + r.r < G.camX - 10 || r.x - r.r > G.camX + viewW + 10) continue;
    ctx.beginPath();
    r.pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    ctx.fillStyle = '#2a2140';
    ctx.fill();
    ctx.strokeStyle = '#c08cff';
    ctx.stroke();
  }
}

// Tripulação: traços que acenam e depois correm para dentro do triângulo
function drawCrew(t) {
  if (G.crewOnBoard) return;
  const p = G.level.pads.find((q) => q.kind === 'crew');
  const s = G.ship;
  ctx.strokeStyle = '#ffe0b8';
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 3; i++) {
    const hx = p.x2 - 16 - i * 11, hy = p.y;
    let x = hx, y = hy, running = false;
    if (s.state === 'boarding') {
      const k = clamp((G.boardingT - i * 0.45) / 0.7, 0, 1);
      if (k >= 1) continue;
      x = lerp(hx, s.x, k);
      y = lerp(hy, s.y + SHIP_BASE, k);
      running = k > 0;
    }
    const leg = running ? Math.sin(t * 22 + i) * 2.5 : 2;
    const arm = !running && Math.sin(t * 3 + i * 1.7) > 0.2 ? -5 : 1;
    ctx.beginPath();
    ctx.moveTo(x + 2.2, y - 12);
    ctx.arc(x, y - 12, 2.2, 0, Math.PI * 2);
    ctx.moveTo(x, y - 9.5); ctx.lineTo(x, y - 4);
    ctx.moveTo(x, y - 4); ctx.lineTo(x - leg, y);
    ctx.moveTo(x, y - 4); ctx.lineTo(x + leg, y);
    ctx.moveTo(x, y - 8); ctx.lineTo(x + 3.5, y - 8 + arm);
    ctx.stroke();
  }
}

function drawShip() {
  const s = G.ship;
  if (s.state === 'exploding') return;
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.rotate(s.a);
  if (s.thrusting) {
    ctx.fillStyle = Math.random() > 0.5 ? '#ffd166' : '#ff9f43';
    ctx.beginPath();
    ctx.moveTo(-4, SHIP_BASE - 1);
    ctx.lineTo(4, SHIP_BASE - 1);
    ctx.lineTo(0, SHIP_BASE + 8 + Math.random() * 9);
    ctx.closePath();
    ctx.fill();
  }
  ctx.beginPath();
  ctx.moveTo(0, -SHIP_TIP);
  ctx.lineTo(SHIP_HALF, SHIP_BASE);
  ctx.lineTo(0, SHIP_BASE - 4);
  ctx.lineTo(-SHIP_HALF, SHIP_BASE);
  ctx.closePath();
  ctx.fillStyle = s.state === 'flying' && landingSafe(s) ? '#7dffb0' : '#eef6ff';
  ctx.fill();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = '#0b0f17';
  ctx.stroke();
  ctx.restore();
}

function drawParticles() {
  ctx.lineWidth = 1.6;
  for (const p of G.particles) {
    ctx.strokeStyle = `rgba(255,${Math.floor(150 + Math.random() * 90)},90,${clamp(p.life, 0, 1).toFixed(2)})`;
    const dx = (Math.cos(p.ang) * p.len) / 2, dy = (Math.sin(p.ang) * p.len) / 2;
    ctx.beginPath();
    ctx.moveTo(p.x - dx, p.y - dy);
    ctx.lineTo(p.x + dx, p.y + dy);
    ctx.stroke();
  }
}

function drawObjectiveArrow(t) {
  const target = G.level.pads.find((p) => p.kind === (G.crewOnBoard ? 'base' : 'crew'));
  const sx = ((target.x1 + target.x2) / 2 - G.camX) * scale;
  if (sx >= 0 && sx <= cssW) return;
  const right = sx > cssW;
  const x = right ? cssW - 24 - safe.right : 24 + safe.left;
  const y = clamp(target.y * scale, 110, cssH - 50);
  const pulse = (0.6 + 0.4 * Math.sin(t * 5)).toFixed(2);
  ctx.fillStyle = G.crewOnBoard ? `rgba(124,196,255,${pulse})` : `rgba(255,159,67,${pulse})`;
  ctx.beginPath();
  if (right) { ctx.moveTo(x + 10, y); ctx.lineTo(x - 6, y - 10); ctx.lineTo(x - 6, y + 10); }
  else { ctx.moveTo(x - 10, y); ctx.lineTo(x + 6, y - 10); ctx.lineTo(x + 6, y + 10); }
  ctx.closePath();
  ctx.fill();
  ctx.font = `700 10px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(G.crewOnBoard ? 'BASE' : 'CREW', x, y + 14);
}

function drawHUD(t) {
  const s = G.ship;
  const left = 16 + safe.left, top = 14 + safe.top;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = `700 13px ${FONT}`;
  ctx.fillStyle = '#46e0c8';
  ctx.fillText(`LEVEL ${G.level.def.id} · ${G.level.def.name}`, left, top);

  ctx.fillStyle = '#e8f1ff';
  ctx.fillText('FUEL', left, top + 22);
  const bx = left + 52, by = top + 23, bw = 130;
  ctx.strokeStyle = '#e8f1ff';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(bx, by, bw, 11);
  const low = s.fuel < PARAMS.lowFuel;
  if (!(low && Math.sin(t * 10) < 0)) {
    ctx.fillStyle = s.fuel > 0.5 ? '#46e0c8' : low ? '#ff5d5d' : '#ffd166';
    ctx.fillRect(bx + 2, by + 2, (bw - 4) * s.fuel, 7);
  }

  ctx.fillStyle = '#e8f1ff';
  ctx.fillText('LIVES', left, top + 42);
  for (let i = 0; i < PARAMS.lives; i++) {
    const x = bx + 8 + i * 18, y = top + 49;
    ctx.beginPath();
    ctx.moveTo(x, y - 7);
    ctx.lineTo(x + 5, y + 6);
    ctx.lineTo(x, y + 3);
    ctx.lineTo(x - 5, y + 6);
    ctx.closePath();
    ctx.fillStyle = i < G.lives ? '#e8f1ff' : '#2a3348';
    ctx.fill();
  }

  ctx.fillStyle = G.crewOnBoard ? '#7dffb0' : '#ff9f43';
  ctx.fillText(G.crewOnBoard ? 'CREW: ON BOARD' : 'CREW: WAITING', left, top + 62);

  ctx.textAlign = 'right';
  ctx.font = `700 16px ${FONT}`;
  ctx.fillStyle = '#e8f1ff';
  ctx.fillText(fmtTime(G.timer), cssW - 66 - safe.right, top + 6);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.font = `11px ${FONT}`;
  ctx.fillStyle = 'rgba(127,140,163,0.85)';
  ctx.fillText(`random layout #${G.level.seed}`, left, cssH - 10 - safe.bottom);
}

function drawMessages(t) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  G.messages.forEach((m, i) => {
    if (m.warn && Math.sin(t * 12) < -0.2) return;
    const alpha = clamp(Math.min(m.t / 0.2, (m.dur - m.t) / 0.4), 0, 1).toFixed(2);
    ctx.font = `700 ${m.warn ? 18 : 15}px ${FONT}`;
    ctx.fillStyle = m.warn ? `rgba(255,93,93,${alpha})` : `rgba(232,241,255,${alpha})`;
    ctx.fillText(m.text, cssW / 2, cssH * 0.24 + i * 26);
  });
}

function drawJoystick() {
  const R = PARAMS.joystickRadius;
  if (!joy) {
    if (isTouch && !G.over && !G.paused) {
      ctx.strokeStyle = 'rgba(255,93,93,0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(70 + safe.left, cssH - 80 - safe.bottom, R, 0, Math.PI * 2);
      ctx.stroke();
    }
    return;
  }
  let dx = joy.x - joy.cx, dy = joy.y - joy.cy;
  const d = Math.hypot(dx, dy);
  if (d > R) { dx *= R / d; dy *= R / d; }
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(255,93,93,0.9)';
  ctx.beginPath();
  ctx.arc(joy.cx, joy.cy, R, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(232,241,255,0.85)';
  ctx.beginPath();
  ctx.arc(joy.cx + dx, joy.cy + dy, 18, 0, Math.PI * 2);
  ctx.fill();
}

function pauseButton() {
  return { x: cssW - 34 - safe.right, y: 30 + safe.top, r: 20 };
}

function drawPauseButton() {
  const b = pauseButton();
  ctx.strokeStyle = 'rgba(232,241,255,0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(232,241,255,0.9)';
  ctx.fillRect(b.x - 6, b.y - 7, 4, 14);
  ctx.fillRect(b.x + 2, b.y - 7, 4, 14);
}

// ===== Entrada: teclado e direcional virtual =====
const KEYMAP = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowUp: 'thrust', KeyW: 'thrust', Space: 'thrust' };

window.addEventListener('keydown', (e) => {
  Sound.unlock();
  const k = KEYMAP[e.code];
  if (k && G.screen === 'game') {
    keys[k] = true;
    e.preventDefault();
  }
  if ((e.code === 'KeyP' || e.code === 'Escape') && G.screen === 'game') togglePause();
});

window.addEventListener('keyup', (e) => {
  const k = KEYMAP[e.code];
  if (k) keys[k] = false;
});

window.addEventListener('blur', () => {
  keys.left = keys.right = keys.thrust = false;
  joy = null;
});

function localPoint(e) {
  const r = canvas.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}

// Tocar aciona o propulsor; arrastar aponta a nave (D-006)
canvas.addEventListener('pointerdown', (e) => {
  Sound.unlock();
  if (G.screen !== 'game') return;
  e.preventDefault();
  const p = localPoint(e);
  const b = pauseButton();
  if (Math.hypot(p.x - b.x, p.y - b.y) <= b.r + 8) {
    togglePause();
    return;
  }
  if (G.paused || G.over || joy) return;
  joy = { id: e.pointerId, cx: p.x, cy: p.y, x: p.x, y: p.y };
  try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* nada */ }
});

canvas.addEventListener('pointermove', (e) => {
  if (!joy || e.pointerId !== joy.id) return;
  const p = localPoint(e);
  joy.x = p.x;
  joy.y = p.y;
});

const endJoy = (e) => { if (joy && e.pointerId === joy.id) joy = null; };
canvas.addEventListener('pointerup', endJoy);
canvas.addEventListener('pointercancel', endJoy);
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('gesturestart', (e) => e.preventDefault());

// Pausa sozinha ao sair do app; pede para girar o celular na vertical
document.addEventListener('visibilitychange', () => {
  if (document.hidden && G.screen === 'game' && !G.over && !G.paused) togglePause(true);
});

function checkOrientation() {
  const portrait = isTouch && window.innerHeight > window.innerWidth;
  rotateEl.classList.toggle('hidden', !portrait);
  if (portrait && G.screen === 'game' && !G.over && !G.paused) togglePause(true);
}

// ===== Menu e configurações =====
function updateSoundButton() {
  el('btn-sound').textContent = `SOUND: ${Sound.enabled ? 'ON' : 'OFF'}`;
}

el('btn-play').addEventListener('click', () => { Sound.unlock(); Sound.click(); startLevel(selectedLevel); });
el('btn-settings').addEventListener('click', () => { Sound.unlock(); Sound.click(); showScreen('settings'); });
el('btn-back').addEventListener('click', () => { Sound.click(); toMenu(); });
el('btn-sound').addEventListener('click', () => {
  Sound.unlock();
  Sound.enabled = !Sound.enabled;
  progress.sound = Sound.enabled;
  saveProgress();
  updateSoundButton();
  Sound.click();
});

let resetArmed = false;
el('btn-reset').addEventListener('click', () => {
  Sound.click();
  const btn = el('btn-reset');
  if (!resetArmed) {
    resetArmed = true;
    btn.textContent = 'TAP AGAIN TO CONFIRM';
    setTimeout(() => { resetArmed = false; btn.textContent = 'RESET PROGRESS'; }, 3000);
    return;
  }
  resetArmed = false;
  progress = { unlocked: 1, completed: {}, best: {}, rescues: {}, sound: Sound.enabled };
  saveProgress();
  btn.textContent = 'PROGRESS RESET';
  setTimeout(() => { btn.textContent = 'RESET PROGRESS'; }, 1500);
});

// ===== Laço principal (passo fixo de física) =====
const DT = 1 / 120;
let last = performance.now();
let acc = 0;

function loop(now) {
  const elapsed = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (G.screen === 'game' && !G.paused && G.level) {
    acc += elapsed;
    while (acc >= DT) {
      update(DT);
      acc -= DT;
    }
  } else {
    acc = 0;
  }
  render(now);
  requestAnimationFrame(loop);
}

// ===== Início =====
loadProgress();
Sound.enabled = progress.sound !== false;
updateSoundButton();
resize();
selectedLevel = defaultLevel();
showScreen('menu');
checkOrientation();
window.addEventListener('resize', () => { resize(); checkOrientation(); });
requestAnimationFrame(loop);

// Acesso para testes no navegador (só no protótipo)
window.__rs = { G, PARAMS, LEVELS, keys, startLevel, generateLevel };
