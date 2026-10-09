// Vídeo de apresentação: desenha cada quadro com o código do próprio jogo (renderer, abertura e partidas
// jogadas pelo piloto automático), põe as legendas e a tela final por cima, gera o som da música da abertura
// com os efeitos da partida e grava tudo num MP4 (H.264 + AAC), pelo VideoEncoder e o AudioEncoder do navegador.
// Quem abre esta página é o gravar.mjs (Chrome sem janela). O roteiro fica em roteiro.js.

import { DEFAULT_PARAMS } from '../../src/config/params.js';
import { findLevel } from '../../src/content/worlds.js';
import { DEFAULT_SHIP } from '../../src/content/ships/index.js';
import { INTRO_SONG } from '../../src/content/songs.js';
import { createEvents } from '../../src/core/events.js';
import { createMatch } from '../../src/core/match.js';
import { expertRun, expertPlans, routeInputs } from '../../src/core/autopilot.js';
import { clamp } from '../../src/core/math.js';
import { WORLD_H } from '../../src/core/constants.js';
import { createRenderer } from '../../src/render/renderer.js';
import { createIntro } from '../../src/render/intro.js';
import { Sound } from '../../src/platform/audio.js';
import { createMusic } from '../../src/platform/music.js';
import { ROTEIRO as R } from './roteiro.js';
import { muxMp4 } from './mp4.js';

const DT = 1 / 120;                 // o passo da física, igual ao laço do jogo (src/app/loop.js)
const NONE = { turn: 0, targetAngle: null, thrust: false };
const UP = { turn: 0, targetAngle: null, thrust: true };
const KEYS = { touchRotationSpeed: DEFAULT_PARAMS.keyRotationSpeed };   // planos com posto: o giro do teclado (D-023)
const FONT = '"Courier New", ui-monospace, monospace';
const W = R.width, H = R.height;

const canvas = document.getElementById('tela');
canvas.width = W * R.dpr;
canvas.height = H * R.dpr;
const ctx = canvas.getContext('2d');
// A "tela" que o desenho do jogo espera (render/view.js), com o tamanho do vídeo
const view = {
  dpr: R.dpr, cssW: W, cssH: H, scale: H / WORLD_H, play: { x: 0, w: W },
  safe: { top: 0, right: 0, bottom: 0, left: 0 }, isTouch: false, portrait: false,
};
view.viewW = view.play.w / view.scale;
const THEME = findLevel('w1-1').world.theme;

// ===== Partidas do piloto =====
function legsFor(plan, level, params) {
  if (plan === 'expert') return expertRun(level, params)?.legs;
  return expertPlans(level, params)?.[plan];
}

// Joga a rota como o playRoute dos testes: decola, voa cada trecho e espera embarcar ou abastecer
function routePilot(match, legs) {
  const m = match.state;
  const all = routeInputs(m.level, match.params(), legs);
  let leg = 0, i = -1;
  return () => {
    if (m.over || leg >= all.length) return NONE;
    if (i === -1) { i = 0; return UP; }
    if (i < all[leg].length) return all[leg][i++];
    const s = m.ship;
    if (s.state === 'boarding' || (s.pad?.refuel && s.fuel < 1)) return NONE;
    leg += 1;
    i = 0;
    return leg < all.length ? UP : NONE;
  };
}

// Para a cena da batida: a nave mira na pedra mais próxima à frente e acelera
function aimAtRock(m) {
  const s = m.ship;
  const ahead = m.level.obstacles.filter((o) => o.x > s.x - 30);
  const o = ahead.sort((a, b) => Math.hypot(a.x - s.x, a.y - s.y) - Math.hypot(b.x - s.x, b.y - s.y))[0];
  if (!o) return UP;
  return { turn: 0, targetAngle: Math.atan2(o.x - s.x, -(o.y - s.y)), thrust: true };
}

// As mensagens e os efeitos da partida, ligados como em src/app/messages.js (o vídeo não abre o jogo inteiro)
function wireMessages(events, renderer, match) {
  events.on('land', ({ pad }) => {
    if (pad === 'base' && !match.state.crewOnBoard) renderer.message('REFUELED · GO GET THE CREW →', 2.5);
    else if (pad === 'fuel') renderer.message('REFUELING...', 2);
  });
  events.on('boarding', ({ lowFuel }) => {
    if (lowFuel) renderer.message('LOW FUEL! PLAN YOUR WAY BACK', 4, true);
    else renderer.message('CREW BOARDING...', 2);
  });
  events.on('crewOnBoard', () => renderer.message('CREW ON BOARD · BACK TO BASE!', 3));
  events.on('praise', ({ label, x, y }) => renderer.praise(`${label}!`, x, y));
  events.on('lowFuel', ({ level }) => { if (level === 'low') renderer.lowFuel(); });
  events.on('crash', ({ reason, x, y }) => { renderer.explosion(x, y); renderer.message(reason, 2, true); });
  events.on('respawn', ({ lives }) => renderer.message(`${lives} ${lives === 1 ? 'LIFE' : 'LIVES'} LEFT`, 2));
}

const SOUND_EVENTS = ['land', 'crash', 'boardStep', 'lowFuelAtCrew', 'praise'];

function createClip(scene, audio) {
  const def = findLevel(scene.level);
  const P = { ...DEFAULT_PARAMS, ...(scene.plan === 'expert' ? {} : KEYS), cameraZoomFixed: scene.zoom ?? R.zoom };
  const events = createEvents();
  const match = createMatch({ def, seed: def.seed, getParams: () => P, events });
  const renderer = createRenderer(canvas, view);
  wireMessages(events, renderer, match);
  const legs = legsFor(scene.plan, match.state.level, match.params());
  if (!legs) throw new Error(`${scene.level}: o piloto não achou a rota ${scene.plan}`);
  const pilot = routePilot(match, legs);
  const clip = { match, renderer, steps: 0, videoT: null };
  // Os sons só valem dentro do trecho que aparece no vídeo
  for (const name of SOUND_EVENTS) events.on(name, (e) => { if (clip.videoT != null) audio.sounds.push({ t: clip.videoT, name, e }); });
  renderer.resetCamera(match, match.params());
  clip.advanceTo = (runT, videoT) => {
    const target = Math.round(runT / DT);
    while (clip.steps < target) {
      const t = clip.steps * DT;
      clip.videoT = t >= scene.at ? videoT : null;
      const input = scene.crashAt != null && t >= scene.crashAt ? aimAtRock(match.state) : pilot();
      match.update(DT, input);
      renderer.update(DT, match, match.params());
      clip.steps += 1;
    }
  };
  return clip;
}

// ===== Desenho por cima: legendas, tela final e escurecimento =====
function drawCaption(text, t0, t1, t, y) {
  if (t < t0 || t > t1) return;
  const a = clamp(Math.min((t - t0) / 0.15, (t1 - t) / 0.15), 0, 1);
  const rise = (1 - clamp((t - t0) / 0.2, 0, 1)) * 10;
  const size = 30;
  ctx.save();
  ctx.setTransform(R.dpr, 0, 0, R.dpr, 0, 0);
  ctx.globalAlpha = a;
  ctx.font = `700 ${size}px ${FONT}`;
  ctx.letterSpacing = '2px';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const w = ctx.measureText(text).width;
  ctx.fillStyle = 'rgba(3,5,10,0.62)';
  ctx.fillRect(W / 2 - w / 2 - 18, y + rise - size * 0.85, w + 36, size * 1.7);
  ctx.fillStyle = '#e8f1ff';
  ctx.shadowColor = 'rgba(70,224,200,0.45)';
  ctx.shadowBlur = 10;
  ctx.fillText(text, W / 2, y + rise);
  ctx.restore();
}

function drawShipIcon(x, y, scale, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  const n = DEFAULT_SHIP.nozzle;
  ctx.fillStyle = Math.sin(t * 50) > 0 ? '#ffd166' : '#ff9f43';
  ctx.beginPath();
  ctx.moveTo(-n.half, n.y);
  ctx.lineTo(n.half, n.y);
  ctx.lineTo(0, n.y + n.flame + (Math.sin(t * 37) * 0.5 + 0.5) * n.flicker);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  DEFAULT_SHIP.outline.forEach((v, i) => (i ? ctx.lineTo(v.x, v.y) : ctx.moveTo(v.x, v.y)));
  ctx.closePath();
  ctx.fillStyle = '#eef6ff';
  ctx.fill();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = '#0b0f17';
  ctx.stroke();
  ctx.restore();
}

function drawTitle(lang, t, renderer, now) {
  renderer.draw(now, { match: null, theme: THEME });   // o céu e as estrelas do jogo
  ctx.save();
  ctx.setTransform(R.dpr, 0, 0, R.dpr, 0, 0);
  // A nave desce do alto, freando, e fica pairando sobre o nome
  const down = 1 - Math.pow(1 - clamp(t / 0.8, 0, 1), 3);
  drawShipIcon(W / 2, -40 + down * (H * 0.2 + 40) + Math.sin(t * 2.2) * 3, 2.6, t);
  // O nome entra com o acorde final: um clarão rápido e um leve ajuste de escala
  const k = clamp((t - 0.05) / 0.3, 0, 1);
  const scale = 1.12 - 0.12 * (1 - Math.pow(1 - k, 3));
  ctx.globalAlpha = k;
  ctx.translate(W / 2, H * 0.47);
  ctx.scale(scale, scale);
  ctx.font = `700 70px ${FONT}`;
  ctx.letterSpacing = '8px';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  R.title.name.forEach((line, i) => {
    const y = (i - 0.5) * 76;
    ctx.fillStyle = '#1d6b62';
    ctx.fillText(line, 4, y + 4);
    ctx.shadowColor = 'rgba(70,224,200,0.6)';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#e8f1ff';
    ctx.fillText(line, 0, y);
    ctx.shadowBlur = 0;
  });
  ctx.restore();
  // Mote e gancho do ranking, um depois do outro
  const [tagline, hook] = R.title[lang];
  ctx.save();
  ctx.setTransform(R.dpr, 0, 0, R.dpr, 0, 0);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = clamp((t - 0.45) / 0.3, 0, 1);
  ctx.font = `700 26px ${FONT}`;
  ctx.letterSpacing = '4px';
  ctx.fillStyle = '#46e0c8';
  ctx.fillText(tagline, W / 2, H * 0.47 + 112);
  ctx.globalAlpha = clamp((t - 0.9) / 0.3, 0, 1);
  ctx.font = `700 17px ${FONT}`;
  ctx.letterSpacing = '1px';
  ctx.fillStyle = 'rgba(232,241,255,0.85)';
  ctx.fillText(hook, W / 2, H * 0.47 + 150);
  ctx.restore();
  // Clarão do acorde
  const flash = clamp(1 - (t - 0.05) / 0.35, 0, 1) * (t >= 0.05 ? 0.35 : 0);
  if (flash > 0) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = `rgba(232,241,255,${flash.toFixed(3)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
}

function drawFade(t) {
  const [a, b] = R.fadeOut;
  const k = clamp((t - a) / (b - a), 0, 1);
  if (k <= 0) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = `rgba(0,0,0,${k.toFixed(3)})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

// ===== Quadro a quadro =====
// Desenha o vídeo inteiro, em ordem, e chama onFrame depois de cada quadro. Devolve os sons para a mistura.
async function runFrames(lang, onFrame) {
  const audio = { sounds: [], thrust: [] };
  const frames = Math.round(R.duration * R.fps);
  const intro = createIntro(canvas, view, { song: INTRO_SONG, music: { playing: false } });
  const stepDur = 60 / INTRO_SONG.bpm / 4;
  const titleRenderer = createRenderer(canvas, view);
  let current = null, clip = null;
  let lastThrust = false;
  for (let i = 0; i < frames; i++) {
    const t = i / R.fps;
    const now = 1000 + t * 1000;
    const scene = R.scenes.find((s) => t >= s.from && t < s.to) || R.scenes[R.scenes.length - 1];
    if (scene !== current) {
      current = scene;
      clip = null;
      if (scene.kind === 'stranded') intro.start({ onDone() {} });
      if (scene.kind === 'play') {
        clip = createClip(scene, audio);
        clip.advanceTo(scene.at, null);   // avança a partida até o trecho, sem som
      }
    }
    const local = t - scene.from;
    let thrust = false;
    if (scene.kind === 'stranded') {
      Object.assign(intro, { scene: 0, t: local, pos: local / stepDur, typed: 0 });
      intro.draw(now);
    } else if (scene.kind === 'play') {
      clip.advanceTo(scene.at + local * (scene.speed ?? 1), t);
      const m = clip.match;
      clip.renderer.draw(now, {
        match: m, theme: THEME, params: m.params(), joy: null, joystick: null, thrustHeld: false, schemeName: 'A',
        idle: false, buttons: [], tuned: false, demo: null, attract: false,
      });
      thrust = m.state.ship.thrusting;
    } else {
      drawTitle(lang, local, titleRenderer, now);
    }
    if (thrust !== lastThrust) { audio.thrust.push({ t, on: thrust }); lastThrust = thrust; }
    const y = scene.kind === 'stranded' ? H * 0.84 : H * 0.27;
    for (const [t0, t1, text] of R.captions[lang]) drawCaption(text, t0, t1, t, y);
    drawFade(t);
    await onFrame(i, t);
  }
  if (lastThrust) audio.thrust.push({ t: R.duration, on: false });
  return audio;
}

// ===== Som =====
// A música da abertura e os efeitos do jogo, tocados por platform/audio.js e platform/music.js num
// OfflineAudioContext: o "relógio" do áudio é trocado pelo tempo do vídeo, para cada som cair no seu quadro.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function renderAudio(audio) {
  const rate = 48000;
  const off = new OfflineAudioContext(2, Math.ceil(rate * R.duration), rate);
  const master = off.createGain();
  master.connect(off.destination);
  const bus = (vol) => { const g = off.createGain(); g.gain.value = vol; g.connect(master); return g; };
  const musicBus = bus(R.mix.music), fxBus = bus(R.mix.effects);
  const clock = { t: 0 };
  const proxy = (destination) => new Proxy(off, {
    get(target, prop) {
      if (prop === 'currentTime') return clock.t;
      if (prop === 'destination') return destination;
      if (prop === 'createBufferSource') {
        // sons que começam "agora" (start sem tempo) começam no tempo do vídeo
        return () => { const n = target.createBufferSource(); const start = n.start.bind(n); n.start = (when, ...rest) => start(when ?? clock.t, ...rest); return n; };
      }
      const v = Reflect.get(target, prop, target);
      return typeof v === 'function' ? v.bind(target) : v;
    },
  });
  // Música: a partitura inteira é agendada de uma vez, com o relógio adiantado
  Sound.enabled = true;
  Sound.ctx = proxy(musicBus);
  const music = createMusic();
  music.play({ ...INTRO_SONG, fadeFromBar: null });
  clock.t = 1e6;
  await sleep(150);
  // Efeitos: cada um no seu tempo; os atrasos internos (setTimeout) viram tempo do vídeo
  Sound.ctx = proxy(fxBus);
  Sound.thrustGain = null;
  const at = (t, fn) => {
    const real = globalThis.setTimeout;
    globalThis.setTimeout = (f, ms = 0) => { const saved = clock.t; clock.t = t + ms / 1000; f(); clock.t = saved; return 0; };
    try { clock.t = t; fn(); } finally { globalThis.setTimeout = real; }
  };
  at(0, () => Sound.setThrust(false));
  const play = {
    land: () => Sound.land(), crash: () => Sound.crash(), boardStep: (e) => Sound.board(e.index),
    lowFuelAtCrew: () => Sound.warn(), praise: (e) => Sound.praise(e.kind),
  };
  for (const s of audio.sounds) at(s.t, () => play[s.name](s.e));
  for (const s of audio.thrust) at(s.t, () => Sound.setThrust(s.on));
  const [fa, fb] = R.fadeOut;
  master.gain.setValueAtTime(1, fa);
  master.gain.linearRampToValueAtTime(0.0001, fb);
  const buffer = await off.startRendering();
  // Normaliza o pico em -1 dB
  const chans = [buffer.getChannelData(0), buffer.getChannelData(1)];
  let peak = 0;
  for (const c of chans) for (let i = 0; i < c.length; i++) peak = Math.max(peak, Math.abs(c[i]));
  const gain = peak > 0 ? 0.89 / peak : 1;
  let sum = 0;
  for (const c of chans) for (let i = 0; i < c.length; i++) { c[i] *= gain; sum += c[i] * c[i]; }
  const rms = Math.sqrt(sum / (chans[0].length * 2));
  return { buffer, peakBefore: peak, rmsDb: 20 * Math.log10(rms) };
}

async function encodeAudio(buffer) {
  const samples = [];
  let asc = null;
  const encoder = new AudioEncoder({
    output(chunk, meta) {
      const d = meta?.decoderConfig?.description;
      if (d && !asc) asc = ArrayBuffer.isView(d) ? new Uint8Array(d.buffer, d.byteOffset, d.byteLength).slice() : new Uint8Array(d);
      const data = new Uint8Array(chunk.byteLength);
      chunk.copyTo(data);
      samples.push({ data, duration: Math.round(((chunk.duration ?? (1024 / 48000) * 1e6) * buffer.sampleRate) / 1e6) || 1024 });
    },
    error(e) { throw e; },
  });
  const bitrate = 192000;
  encoder.configure({ codec: 'mp4a.40.2', sampleRate: buffer.sampleRate, numberOfChannels: 2, bitrate });
  const L = buffer.getChannelData(0), Rt = buffer.getChannelData(1);
  for (let i = 0; i < L.length; i += 1024) {
    const n = Math.min(1024, L.length - i);
    const data = new Float32Array(n * 2);
    data.set(L.subarray(i, i + n), 0);
    data.set(Rt.subarray(i, i + n), n);
    const ad = new AudioData({ format: 'f32-planar', sampleRate: buffer.sampleRate, numberOfFrames: n, numberOfChannels: 2, timestamp: Math.round((i / buffer.sampleRate) * 1e6), data });
    encoder.encode(ad);
    ad.close();
  }
  await encoder.flush();
  encoder.close();
  return { sampleRate: buffer.sampleRate, channels: 2, asc: asc || new Uint8Array([0x11, 0x90]), bitrate, samples };
}

// ===== O que o gravar.mjs chama =====
let result = null;

window.gravar = async ({ lang = 'en', bitrate = 8e6 } = {}) => {
  const t0 = performance.now();
  const width = W * R.dpr, height = H * R.dpr;
  const timescale = 15360;
  const frameDur = timescale / R.fps;
  const chunks = [];
  let avcC = null;
  const encoder = new VideoEncoder({
    output(chunk, meta) {
      const d = meta?.decoderConfig?.description;
      if (d && !avcC) avcC = ArrayBuffer.isView(d) ? new Uint8Array(d.buffer, d.byteOffset, d.byteLength).slice() : new Uint8Array(d);
      const data = new Uint8Array(chunk.byteLength);
      chunk.copyTo(data);
      chunks.push({ data, ts: chunk.timestamp, key: chunk.type === 'key' });
    },
    error(e) { throw e; },
  });
  // H.264 High, nível 4.2: o nível que comporta 1080p a 60 quadros por segundo
  encoder.configure({ codec: 'avc1.64002A', width, height, bitrate, framerate: R.fps, avc: { format: 'avc' }, latencyMode: 'quality' });
  const audio = await runFrames(lang, async (i) => {
    const frame = new VideoFrame(canvas, { timestamp: Math.round((i * 1e6) / R.fps), duration: Math.round(1e6 / R.fps) });
    encoder.encode(frame, { keyFrame: i % (R.fps * 2) === 0 });
    frame.close();
    while (encoder.encodeQueueSize > 6) await new Promise((r) => encoder.addEventListener('dequeue', r, { once: true }));
  });
  await encoder.flush();
  encoder.close();
  for (let i = 1; i < chunks.length; i++) if (chunks[i].ts <= chunks[i - 1].ts) throw new Error('quadros fora de ordem: o MP4 precisaria de ctts');
  const tVideo = performance.now();
  const mix = await renderAudio(audio);
  const aac = await encodeAudio(mix.buffer);
  const bytes = muxMp4({
    video: { width, height, timescale, avcC, samples: chunks.map((c) => ({ data: c.data, duration: frameDur, key: c.key })) },
    audio: aac,
  });
  result = bytes;
  return {
    bytes: bytes.length, frames: chunks.length, keyframes: chunks.filter((c) => c.key).length,
    audioChunks: aac.samples.length, sounds: audio.sounds.length, thrustChanges: audio.thrust.length,
    peakBefore: Number(mix.peakBefore.toFixed(3)), rmsDb: Number(mix.rmsDb.toFixed(1)),
    seconds: { video: Math.round(tVideo - t0) / 1000, total: Math.round(performance.now() - t0) / 1000 },
    soundList: audio.sounds.map((s) => `${s.t.toFixed(2)} ${s.name}${s.e?.kind ? ' ' + s.e.kind : ''}${s.e?.reason ? ' ' + s.e.reason : ''}`),
  };
};

// Confere o arquivo gravado como um player faria: abre no <video>, pula para um quadro e decodifica o som
window.conferir = async (url) => {
  const video = document.createElement('video');
  video.muted = true;
  video.preload = 'auto';
  const bytes = await (await fetch(url)).arrayBuffer();
  video.src = URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' }));   // pela memória, para poder pular
  await new Promise((ok, fail) => { video.onloadeddata = ok; video.onerror = () => fail(new Error(`o navegador não abriu o vídeo: ${video.error?.message}`)); });
  const out = { duration: Number(video.duration.toFixed(3)), width: video.videoWidth, height: video.videoHeight };
  // Toca a partir de 8,4 s e captura o primeiro quadro mostrado depois de 8,55 s (o player decodifica de verdade)
  video.style.cssText = 'position:fixed;left:0;top:0;width:480px;height:270px';
  document.body.appendChild(video);
  video.currentTime = 8.4;
  await new Promise((ok) => { video.onseeked = ok; });
  await video.play();
  await new Promise((ok) => {
    const next = (_, meta) => { if (meta.mediaTime >= 8.55) ok(); else video.requestVideoFrameCallback(next); };
    video.requestVideoFrameCallback(next);
  });
  video.pause();
  out.seekedTo = Number(video.currentTime.toFixed(3));
  const c = document.createElement('canvas');
  c.width = 960;
  c.height = 540;
  c.getContext('2d').drawImage(video, 0, 0, c.width, c.height);
  out.frame = c.toDataURL('image/png');
  video.remove();
  const decoded = await new OfflineAudioContext(2, 48000, 48000).decodeAudioData(bytes.slice(0));
  const data = decoded.getChannelData(0);
  // Volume a cada meio segundo, para ver a música e os efeitos nos lugares certos
  const env = [];
  for (let s = 0; s < data.length; s += decoded.sampleRate / 2) {
    let sum = 0;
    const end = Math.min(data.length, s + decoded.sampleRate / 2);
    for (let i = s; i < end; i++) sum += data[i] * data[i];
    env.push(Math.round(10 * Math.log10(sum / (end - s) + 1e-12)));
  }
  out.audio = { duration: Number(decoded.duration.toFixed(3)), channels: decoded.numberOfChannels, sampleRate: decoded.sampleRate, dbPorMeioSegundo: env.join(' ') };
  return out;
};

// Fotos de quadros escolhidos, para conferir o roteiro sem gravar o vídeo
window.fotos = async ({ lang = 'en', times = [] } = {}) => {
  const want = new Map(times.map((t) => [Math.round(t * R.fps), t]));
  const out = {};
  const last = Math.max(...want.keys());
  await runFrames(lang, async (i) => {
    if (want.has(i)) out[want.get(i)] = canvas.toDataURL('image/png');
    if (i >= last) throw Object.assign(new Error('fim'), { done: true });
  }).catch((e) => { if (!e.done) throw e; });
  return out;
};

// Entrega o resultado em pedaços (o protocolo do DevTools não gosta de mensagens enormes)
window.pedaco = (i, size = 2 ** 21) => {
  const part = result.subarray(i * size, (i + 1) * size);
  let s = '';
  for (let k = 0; k < part.length; k += 0x8000) s += String.fromCharCode.apply(null, part.subarray(k, k + 0x8000));
  return btoa(s);
};

window.pronto = true;
