import { WORLD_H, STEP, SHIP } from '../core/constants.js';
import { clamp, lerp, fmtTime } from '../core/math.js';
import { landingSafe, landingForecast } from '../core/ship.js';
import { OBSTACLES } from '../content/obstacles/index.js';

// Desenho do jogo no Canvas. Lê o estado da partida e nunca o altera.

const FONT = '"Courier New", ui-monospace, monospace';
const STARS = Array.from({ length: 140 }, () => ({
  u: Math.random(), v: Math.random(), z: 0.15 + Math.random() * 0.5, b: 0.3 + Math.random() * 0.7, ph: Math.random() * 6.28,
}));
const PAD_COLORS = { base: ['#7cc4ff', '#e8f1ff'], fuel: ['#ffd166', '#2b2b2b'], crew: ['#ff9f43', '#2b1a0a'] };
const PAD_LABELS = { base: 'BASE', fuel: 'FUEL', crew: 'SOS' };
const LOW_FUEL_FLASH = 1.1;   // segundos do aviso amarelo de combustível baixo (#94)

export function createRenderer(canvas, view) {
  const ctx = canvas.getContext('2d');
  const r = { camX: 0, camY: 0, zoom: 1, particles: [], messages: [], noFuelT: 0, lowFuelT: 0 };

  // Escala e tamanho visível do mundo com o zoom da câmera (#95). Com zoom 1, a tela mostra a altura
  // inteira da fase e a câmera só anda para os lados; acima de 1, ela também segue a nave na vertical.
  r.scale = () => view.scale * r.zoom;
  const viewW = () => view.play.w / r.scale();
  const viewH = () => view.cssH / r.scale();
  r.toScreen = (x, y) => ({ x: view.play.x + (x - r.camX) * r.scale(), y: (y - r.camY) * r.scale() });

  // ===== Câmera, partículas e mensagens =====
  // Limites da câmera. Padrão ('thumbs', #50): a câmera pode passar das pontas da fase para que as
  // plataformas das pontas (base e tripulação) fiquem no meio da tela, longe dos polegares. Na opção
  // 'stage' (#96), ela para nas pontas da fase, e os controles ficam por cima dela.
  function camLimits(level, params) {
    if (params.cameraMode !== 'thumbs') return [0, Math.max(0, level.L - viewW())];
    const centers = level.pads.map((p) => (p.x1 + p.x2) / 2);
    const lo = Math.min(0, Math.min(...centers) - viewW() / 2);
    const hi = Math.max(level.L - viewW(), Math.max(...centers) - viewW() / 2);
    return [lo, Math.max(lo, hi)];
  }
  const camYTarget = (s) => clamp(s.y - viewH() / 2, 0, Math.max(0, WORLD_H - viewH()));

  const twinControls = (params) => view.isTouch && params.touchScheme === 'twin';

  // No controle A (dois polegares, D-022), os polegares ficam por cima dos cantos de baixo. A nave nunca pode ficar
  // embaixo deles (#44): a câmera a mantém na faixa da tela entre os dois controles, mesmo que
  // para isso precise mostrar um pouco além das pontas da fase.
  function keepShipVisible(s, params) {
    if (!twinControls(params) || params.cameraMode !== 'thumbs') return;
    const R = params.joystickRadius;
    const minX = view.safe.left + 24 + 2 * R + 16;
    const maxX = view.cssW - view.safe.right - 24 - 1.8 * R - 16;
    if (maxX - minX < 40) return;   // tela estreita demais para a regra
    r.camX = clamp(r.camX, s.x - maxX / r.scale(), s.x - minX / r.scale());
  }

  r.resetCamera = (match, params) => {
    r.zoom = params.cameraZoom ?? 1;
    r.camX = clamp(match.state.ship.x - viewW() / 2, ...camLimits(match.state.level, params));
    r.camY = camYTarget(match.state.ship);
    keepShipVisible(match.state.ship, params);
    r.particles = [];
    r.messages = [];
    r.praiseText = null;
    r.noFuelT = 0;
    r.lowFuelT = 0;
  };

  r.update = (dt, match, params) => {
    const s = match.state.ship;
    r.zoom = params.cameraZoom ?? 1;
    const look = clamp(s.vx * 0.6, -viewW() * 0.25, viewW() * 0.25);
    const target = clamp(s.x - viewW() / 2 + look, ...camLimits(match.state.level, params));
    r.camX += (target - r.camX) * Math.min(1, dt * 4);
    r.camY += (camYTarget(s) - r.camY) * Math.min(1, dt * 4);
    keepShipVisible(s, params);
    for (const p of r.particles) {
      p.vy += params.gravity * 0.6 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.ang += p.spin * dt;
      p.life -= dt;
    }
    r.particles = r.particles.filter((p) => p.life > 0);
    if (r.praiseText) { r.praiseText.t += dt; if (r.praiseText.t > 1.3) r.praiseText = null; }
    for (const m of r.messages) m.t += dt;
    r.messages = r.messages.filter((m) => m.t < m.dur);
    r.noFuelT = Math.max(0, r.noFuelT - dt);
    r.lowFuelT = Math.max(0, r.lowFuelT - dt);
  };

  // Avisos de combustível (#94). NO FUEL: pequeno, piscando perto da nave, como os elogios.
  // LOW FUEL: ao lado da barra de combustível, fora da frente da nave e das plataformas.
  r.noFuel = (seconds = 1.6) => { r.noFuelT = Math.max(r.noFuelT, seconds); };
  r.lowFuel = () => { r.lowFuelT = LOW_FUEL_FLASH; };

  // Elogio (#81): texto pequeno que nasce perto da nave, sobe um pouco e some. Um de cada vez.
  r.praise = (text, x, y) => { r.praiseText = { text, x, y, t: 0 }; };

  r.message = (text, dur = 2.5, warn = false) => {
    r.messages.push({ text, t: 0, dur, warn });
    if (r.messages.length > 3) r.messages.shift();
  };

  r.explosion = (x, y) => {
    for (let i = 0; i < 28; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 40 + Math.random() * 160;
      r.particles.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 1.1 + Math.random() * 0.6, ang: Math.random() * 6.28,
        spin: (Math.random() - 0.5) * 12, len: 3 + Math.random() * 6,
      });
    }
  };

  // ===== Quadro inteiro =====
  r.draw = (now, scene) => {
    const t = now / 1000;
    const { match, params } = scene;
    const theme = (match ? match.state.def.world.theme : scene.theme);
    ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    const g = ctx.createLinearGradient(0, 0, 0, view.cssH);
    g.addColorStop(0, theme.sky[0]);
    g.addColorStop(1, theme.sky[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, view.cssW, view.cssH);
    drawStars(t, match ? r.camX * r.scale() : t * 12);
    if (!match) return;

    const m = match.state;
    ctx.save();
    ctx.beginPath();
    ctx.rect(view.play.x, 0, view.play.w, view.cssH);   // a fase só aparece na faixa dela
    ctx.clip();
    ctx.setTransform(view.dpr * r.scale(), 0, 0, view.dpr * r.scale(), (view.play.x - r.camX * r.scale()) * view.dpr, -r.camY * r.scale() * view.dpr);
    drawCave(m.level, theme, t);
    const approach = approachInfo(m, params);
    r.approach = approach;   // a telemetria usa: a previsão de pouso estava verde? (#91)
    drawPads(m.level, t, approach);
    drawObstacles(m.level, theme, t);
    if (!m.training) drawCrew(m, t, params);
    drawShip(m.ship, params, approach, t);
    drawParticles();
    ctx.restore();

    ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    if (scene.attract) {
      // Attract mode (#105): a corrida passa escurecida atrás do menu, sem painel nem controles
      ctx.fillStyle = 'rgba(3,5,10,0.62)';
      ctx.fillRect(0, 0, view.cssW, view.cssH);
      return;
    }
    if (!m.training) drawObjectiveArrow(m, t, params);
    drawHUD(m, t, params, scene);
    drawMessages(t, m.ship, scene);
    drawPraise();
    drawNoFuel(m.ship, t);
    drawJoystick(scene);
    drawButtons(scene);
    if (scene.demo) drawDemo(scene.demo, t);
  };

  // DEMO (#104): selo "DEMO" o tempo todo, o rótulo da vez na faixa do alto e, sem o controle de dois
  // polegares, a tecla do propulsor acendendo junto com a chama
  function drawDemo({ label, thrust, twin }, t) {
    const top = 14 + view.safe.top;
    const right = view.cssW - 16 - view.safe.right;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'right';
    ctx.font = `700 13px ${FONT}`;
    ctx.fillStyle = Math.sin(t * 4) > -0.6 ? 'rgba(255,209,102,0.95)' : 'rgba(255,209,102,0.55)';
    ctx.fillText('● DEMO', right - 104, top + 8);   // à esquerda do botão SKIP
    ctx.textAlign = 'center';
    ctx.font = `700 14px ${FONT}`;
    ctx.fillStyle = 'rgba(232,241,255,0.95)';
    ctx.fillText(label, view.play.x + view.play.w / 2, top + 30);
    if (twin) return;
    const x = right - 30, y = view.cssH - 46 - view.safe.bottom;
    ctx.lineWidth = 2;
    ctx.strokeStyle = thrust ? 'rgba(255,159,67,0.95)' : 'rgba(255,159,67,0.4)';
    ctx.fillStyle = thrust ? 'rgba(255,159,67,0.3)' : 'rgba(255,159,67,0.05)';
    ctx.beginPath();
    ctx.rect(x - 22, y - 22, 44, 44);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = thrust ? 'rgba(255,209,102,1)' : 'rgba(255,209,102,0.5)';
    ctx.textBaseline = 'middle';
    ctx.font = `700 20px ${FONT}`;
    ctx.fillText('↑', x, y);
  }

  function drawStars(t, off) {
    for (const s of STARS) {
      const x = (((s.u * view.cssW - off * s.z) % view.cssW) + view.cssW) % view.cssW;
      const a = s.b * (0.65 + 0.35 * Math.sin(t * 2 + s.ph));
      ctx.fillStyle = `rgba(220,235,255,${a.toFixed(3)})`;
      const size = s.z > 0.5 ? 2 : 1;
      ctx.fillRect(x, s.v * view.cssH, size, size);
    }
  }

  // Altura do terreno no ponto i. Fora da fase (i < 0 ou i >= n), o terreno continua só como
  // cenário, a partir da altura da ponta, com um relevo suave e fixo (sem colisão).
  function terrainAt(arr, i) {
    if (i >= 0 && i < arr.length) return arr[i];
    const edge = i < 0 ? arr[0] : arr[arr.length - 1];
    const k = i < 0 ? -i : i - arr.length + 1;
    const fade = Math.min(1, k / 6);   // começa igual à ponta e ganha relevo aos poucos
    return edge + fade * (16 * Math.sin(k * 0.33) + 9 * Math.sin(k * 0.87 + 1.3));
  }

  function strokeLine(arr, i0, i1, dy) {
    ctx.beginPath();
    for (let i = i0; i <= i1; i++) {
      if (i === i0) ctx.moveTo(i * STEP, terrainAt(arr, i) + dy);
      else ctx.lineTo(i * STEP, terrainAt(arr, i) + dy);
    }
    ctx.stroke();
  }

  function fillTerrain(arr, i0, i1, edgeY) {
    ctx.beginPath();
    ctx.moveTo(i0 * STEP, edgeY);
    for (let i = i0; i <= i1; i++) ctx.lineTo(i * STEP, terrainAt(arr, i));
    ctx.lineTo(i1 * STEP, edgeY);
    ctx.closePath();
    ctx.fill();
  }

  function drawCave(lv, theme, t) {
    const i0 = Math.floor(r.camX / STEP) - 1;
    const i1 = Math.ceil((r.camX + viewW()) / STEP) + 1;
    ctx.fillStyle = theme.terrainFill;
    fillTerrain(lv.ceil, i0, i1, -20);
    fillTerrain(lv.floor, i0, i1, WORLD_H + 20);
    ctx.lineJoin = 'round';
    // Dentro da fase: contorno forte. Fora: o mesmo terreno, apagado, como fundo.
    const inside = [Math.max(0, i0), Math.min(lv.n - 1, i1)];
    const parts = [[i0, Math.min(i1, 0), 0.32], [inside[0], inside[1], 1], [Math.max(i0, lv.n - 1), i1, 0.32]];
    for (const [a, b, alpha] of parts) {
      if (b <= a) continue;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 2;
      ctx.strokeStyle = theme.terrainGlow;
      strokeLine(lv.ceil, a, b, -9);
      strokeLine(lv.floor, a, b, 9);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = theme.terrain;
      strokeLine(lv.ceil, a, b, 0);
      strokeLine(lv.floor, a, b, 0);
    }
    ctx.globalAlpha = 1;
    // Fora da fase, um véu escurece o cenário; na ponta, uma barreira de energia marca o limite
    ctx.fillStyle = 'rgba(3,5,10,0.45)';
    if (r.camX < 0) ctx.fillRect(r.camX - 10, -20, -r.camX + 10, WORLD_H + 40);
    if (r.camX + viewW() > lv.L) ctx.fillRect(lv.L, -20, r.camX + viewW() - lv.L + 10, WORLD_H + 40);
    if (i0 <= 0) drawBarrier(0, lv.ceil[0], lv.floor[0], theme, t);
    if (i1 >= lv.n - 1) drawBarrier(lv.L, lv.ceil[lv.n - 1], lv.floor[lv.n - 1], theme, t);
  }

  // Barreira de energia: linha tracejada que corre devagar, com brilho suave
  function drawBarrier(x, top, bottom, theme, t) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.strokeStyle = theme.terrainGlow;
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
    ctx.strokeStyle = theme.terrain;
    ctx.globalAlpha = 0.55 + 0.25 * Math.sin(t * 2);
    ctx.lineWidth = 1.5;
    ctx.setLineDash([10, 8]);
    ctx.lineDashOffset = -t * 18;
    ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
    ctx.restore();
  }

  // Aviso de pouso (#50). Perto de uma plataforma, as luzes dela dizem se dá para pousar.
  // Descendo (landing), o verde usa a previsão da velocidade no toque, para nunca ficar verde e explodir.
  function approachInfo(m, params) {
    const s = m.ship;
    if (s.state !== 'flying') return null;
    const pad = m.level.pads.find((p) => s.x >= p.x1 - 30 && s.x <= p.x2 + 30 && p.y - s.y > 0 && p.y - s.y < 170);
    if (!pad) return null;
    const forecast = landingForecast(s, params, pad, { crewOnBoard: m.crewOnBoard });
    const landing = forecast !== null;
    return { pad, landing, safe: landing ? forecast : landingSafe(s, params) };
  }

  function drawPads(lv, t, approach) {
    ctx.font = `700 11px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const blink = Math.sin(t * 4) > 0;
    for (const p of lv.pads) {
      const colors = PAD_COLORS[p.kind];
      for (let x = p.x1, k = 0; x < p.x2; x += 12, k++) {
        ctx.fillStyle = colors[k % 2];
        ctx.fillRect(x, p.y, Math.min(12, p.x2 - x), 6);
      }
      ctx.fillStyle = '#2a3348';
      ctx.fillRect(p.x1 + 6, p.y + 6, 4, 18);
      ctx.fillRect(p.x2 - 10, p.y + 6, 4, 18);
      const near = approach?.pad === p;
      ctx.fillStyle = near ? (approach.safe ? '#7dffb0' : '#ff5d5d') : blink ? colors[0] : '#333a4a';
      const lamp = near ? 7 : 4;
      ctx.fillRect(p.x1 - lamp / 2, p.y - lamp, lamp, lamp);
      ctx.fillRect(p.x2 - lamp / 2, p.y - lamp, lamp, lamp);
      ctx.fillStyle = colors[0];
      ctx.fillText(PAD_LABELS[p.kind], (p.x1 + p.x2) / 2, p.y - 32);
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

  function drawObstacles(lv, theme, t) {
    for (const o of lv.obstacles) {
      const kind = OBSTACLES[o.type];
      const b = kind.bounds(o);
      if (b.x2 < r.camX - 10 || b.x1 > r.camX + viewW() + 10) continue;
      kind.draw(ctx, o, theme, t);
    }
  }

  // Tripulação: traços que acenam e depois correm para dentro do triângulo
  function drawCrew(m, t, params) {
    if (m.crewOnBoard) return;
    const p = m.level.pads.find((q) => q.kind === 'crew');
    const s = m.ship;
    ctx.strokeStyle = '#ffe0b8';
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 3; i++) {
      const hx = p.x2 - 16 - i * 11, hy = p.y;
      let x = hx, y = hy, running = false;
      if (s.state === 'boarding') {
        const k = clamp((m.boardingT - i * 0.45) / 0.7, 0, 1);
        if (k >= 1) continue;
        x = lerp(hx, s.x, k);
        y = lerp(hy, s.y + SHIP.base, k);
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

  function drawShip(s, params, approach, t) {
    if (s.state === 'exploding') return;
    if (approach?.landing) {
      // Halo quase imperceptível, só na descida para a plataforma: uma sugestão, não um aviso
      const alpha = (0.16 + 0.06 * Math.sin(t * 3)).toFixed(2);
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = approach.safe ? `rgba(125,255,176,${alpha})` : `rgba(255,93,93,${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 17, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.a);
    if (s.thrusting) {   // sinal visual do propulsor aceso (#33)
      ctx.fillStyle = Math.random() > 0.5 ? '#ffd166' : '#ff9f43';
      ctx.beginPath();
      ctx.moveTo(-4, SHIP.base - 1);
      ctx.lineTo(4, SHIP.base - 1);
      ctx.lineTo(0, SHIP.base + 8 + Math.random() * 9);
      ctx.closePath();
      ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(0, -SHIP.tip);
    ctx.lineTo(SHIP.half, SHIP.base);
    ctx.lineTo(0, SHIP.base - 4);
    ctx.lineTo(-SHIP.half, SHIP.base);
    ctx.closePath();
    // Verde só descendo para uma plataforma, com velocidade e inclinação que garantem o pouso
    ctx.fillStyle = approach?.landing && approach.safe ? '#7dffb0' : '#eef6ff';
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#0b0f17';
    ctx.stroke();
    ctx.restore();
  }

  function drawParticles() {
    ctx.lineWidth = 1.6;
    for (const p of r.particles) {
      ctx.strokeStyle = `rgba(255,${Math.floor(150 + Math.random() * 90)},90,${clamp(p.life, 0, 1).toFixed(2)})`;
      const dx = (Math.cos(p.ang) * p.len) / 2, dy = (Math.sin(p.ang) * p.len) / 2;
      ctx.beginPath();
      ctx.moveTo(p.x - dx, p.y - dy);
      ctx.lineTo(p.x + dx, p.y + dy);
      ctx.stroke();
    }
  }

  // Seta na borda da faixa da fase, apontando para o objetivo quando ele está fora da tela
  function drawObjectiveArrow(m, t, params) {
    const target = m.level.pads.find((p) => p.kind === (m.crewOnBoard ? 'base' : 'crew'));
    const sx = r.toScreen((target.x1 + target.x2) / 2, 0).x;
    const playRight = view.play.x + view.play.w;
    if (sx >= view.play.x && sx <= playRight) return;
    const right = sx > playRight;
    const x = right ? playRight - 24 - view.safe.right : view.play.x + 24 + view.safe.left;
    // No controle A (dois polegares), a seta da direita fica acima do botão do propulsor
    const bottom = right && twinControls(params) ? view.cssH - 70 - params.joystickRadius * 1.8 - view.safe.bottom : view.cssH - 50;
    const y = clamp(r.toScreen(0, target.y).y, 110, Math.max(110, bottom));
    const pulse = (0.6 + 0.4 * Math.sin(t * 5)).toFixed(2);
    ctx.fillStyle = m.crewOnBoard ? `rgba(124,196,255,${pulse})` : `rgba(255,159,67,${pulse})`;
    ctx.beginPath();
    if (right) { ctx.moveTo(x + 10, y); ctx.lineTo(x - 6, y - 10); ctx.lineTo(x - 6, y + 10); }
    else { ctx.moveTo(x - 10, y); ctx.lineTo(x + 6, y - 10); ctx.lineTo(x + 6, y + 10); }
    ctx.closePath();
    ctx.fill();
    ctx.font = `700 10px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(m.crewOnBoard ? 'BASE' : 'CREW', x, y + 14);
  }

  function drawHUD(m, t, params, scene) {
    const s = m.ship;
    const left = Math.max(view.play.x, view.safe.left) + 16, top = 14 + view.safe.top;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = `700 13px ${FONT}`;
    ctx.fillStyle = '#46e0c8';
    ctx.fillText(m.training ? 'TRAINING' : m.def.challenge ? `CHALLENGE · ${m.def.name}` : `LEVEL ${m.def.number} · ${m.def.name}`, left, top);

    ctx.fillStyle = '#e8f1ff';
    ctx.fillText('FUEL', left, top + 22);
    const bx = left + 52, by = top + 23, bw = 130;
    ctx.strokeStyle = '#e8f1ff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx, by, bw, 11);
    const low = s.fuel < params.lowFuel;
    if (!(low && Math.sin(t * 10) < 0)) {
      ctx.fillStyle = s.fuel > 0.5 ? '#46e0c8' : low ? '#ff5d5d' : '#ffd166';
      ctx.fillRect(bx + 2, by + 2, (bw - 4) * s.fuel, 7);
    }
    drawFuelWarning(s, t, params, bx + bw + 12, by + 6);

    if (!m.training) {
      ctx.fillStyle = '#e8f1ff';
      ctx.fillText('LIVES', left, top + 42);
      for (let i = 0; i < params.lives; i++) {
        const x = bx + 8 + i * 18, y = top + 49;
        ctx.beginPath();
        ctx.moveTo(x, y - 7);
        ctx.lineTo(x + 5, y + 6);
        ctx.lineTo(x, y + 3);
        ctx.lineTo(x - 5, y + 6);
        ctx.closePath();
        ctx.fillStyle = i < m.lives ? '#e8f1ff' : '#2a3348';
        ctx.fill();
      }
      ctx.fillStyle = m.crewOnBoard ? '#7dffb0' : '#ff9f43';
      ctx.fillText(m.crewOnBoard ? 'CREW: ON BOARD' : 'CREW: WAITING', left, top + 62);

      ctx.textAlign = 'right';
      ctx.font = `700 16px ${FONT}`;
      ctx.fillStyle = scene.demo ? 'rgba(0,0,0,0)' : '#e8f1ff';   // na DEMO, o lugar é do selo
      // o cronômetro fica à esquerda dos botões da tela (pausa e, nas sessões de teste, o T)
      ctx.fillText(fmtTime(m.timer), Math.min(view.cssW - 22 - 48 * scene.buttons.length - view.safe.right, view.play.x + view.play.w - 14), top + 6);
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.font = `11px ${FONT}`;
    ctx.fillStyle = 'rgba(127,140,163,0.85)';
    let foot = m.training ? 'crash freely · land on the pad' : m.def.random ? `random layout #${m.seed}` : '';
    if (view.isTouch) foot += ` · control ${scene.schemeName}`;
    if (scene.tuned) foot += ' · TUNED';
    ctx.fillText(foot, left, view.cssH - 10 - view.safe.bottom);
  }

  // Ao lado da barra: aos 20%, LOW FUEL amarelo, rápido e sutil; abaixo de 10%, vermelho piscando
  function drawFuelWarning(s, t, params, x, y) {
    const critical = s.state === 'flying' && s.fuel > 0 && s.fuel <= params.criticalFuel;
    let color;
    if (critical) {
      if (Math.sin(t * 9) < -0.1) return;
      color = 'rgba(255,93,93,1)';
    } else if (r.lowFuelT > 0) {
      const age = LOW_FUEL_FLASH - r.lowFuelT;
      color = `rgba(255,209,102,${(clamp(Math.min(age / 0.15, r.lowFuelT / 0.4), 0, 1) * 0.75).toFixed(2)})`;
    } else return;
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${critical ? 13 : 11}px ${FONT}`;
    ctx.fillStyle = color;
    ctx.fillText(critical ? 'LOW FUEL!' : 'LOW FUEL', x, y);
    ctx.restore();
  }

  // NO FUEL: pisca logo acima da nave enquanto o aviso durar
  function drawNoFuel(s, t) {
    if (r.noFuelT <= 0 || s.state === 'exploding' || Math.sin(t * 12) < -0.2) return;
    const { x: sx, y } = r.toScreen(s.x, s.y);
    const sy = y - 22;
    ctx.font = `700 12px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,93,93,0.95)';
    ctx.fillText('NO FUEL', clamp(sx, 60, view.cssW - 60), clamp(sy, 24, view.cssH - 24));
  }

  function drawPraise() {
    const p = r.praiseText;
    if (!p) return;
    const alpha = clamp(Math.min(p.t / 0.12, (1.3 - p.t) / 0.4), 0, 1) * 0.9;
    const { x: sx, y } = r.toScreen(p.x, p.y);
    const sy = y - 22 - p.t * 18;
    ctx.font = `700 12px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(125,255,176,${alpha.toFixed(2)})`;
    ctx.fillText(p.text, clamp(sx, 60, view.cssW - 60), clamp(sy, 24, view.cssH - 24));
  }

  // Quebra um texto em linhas que caibam na largura
  function wrap(text, width) {
    const lines = [];
    let line = '';
    for (const word of text.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(next).width > width) { lines.push(line); line = word; } else line = next;
    }
    if (line) lines.push(line);
    return lines;
  }

  // Mensagens da partida (#97): numa faixa pequena no alto da tela, entre o painel da esquerda
  // (fase, combustível e seus avisos) e o cronômetro, nunca no meio da fase. No máximo as duas mais
  // novas. Se a nave passar por baixo delas, ficam quase transparentes, para não esconder nada.
  function drawMessages(t, ship, scene) {
    const shown = r.messages.slice(-2).reverse();
    if (!shown.length) return;
    const left = Math.max(view.play.x, view.safe.left) + 16, top = 14 + view.safe.top;
    const timerLeft = Math.min(view.cssW - 22 - 48 * scene.buttons.length - view.safe.right, view.play.x + view.play.w - 14) - 80;
    let x1 = left + 270;                               // depois da barra de combustível e do aviso dela
    if (timerLeft - x1 < 220) x1 = left + 190;         // tela estreita: só depois do nome da fase
    const width = Math.max(140, timerLeft - x1);
    const cx = x1 + width / 2;
    const { x: sx, y: sy } = ship ? r.toScreen(ship.x, ship.y) : { x: -1e9, y: -1e9 };
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    let y = top + 1;
    for (const m of shown) {
      ctx.font = `700 ${m.warn ? 12 : 11}px ${FONT}`;
      const lines = wrap(m.text, width);
      const h = lines.length * 14;
      const under = Math.abs(sx - cx) < width / 2 + 24 && sy > y - 24 && sy < y + h + 24;
      const blink = m.warn && Math.sin(t * 12) < -0.2;
      const alpha = clamp(Math.min(m.t / 0.2, (m.dur - m.t) / 0.4), 0, 1) * (under ? 0.25 : 1);
      if (!blink) {
        ctx.fillStyle = m.warn ? `rgba(255,93,93,${alpha.toFixed(2)})` : `rgba(232,241,255,${(alpha * 0.9).toFixed(2)})`;
        lines.forEach((line, i) => ctx.fillText(line, cx, y + i * 14));
      }
      y += h + 4;
    }
  }

  // Direcional e, no esquema de dois polegares, o botão do propulsor (#44)
  // Os controles ficam por cima da fase (#96). Se a nave passar por baixo de um deles, ele fica
  // transparente, para a nave nunca sumir embaixo do polegar.
  function overShip(match, x, y, radius) {
    const s = match?.state.ship;
    if (!s || s.state === 'exploding') return false;
    const p = r.toScreen(s.x, s.y);
    return Math.hypot(p.x - x, p.y - y) < radius + 28;
  }

  function drawJoystick({ joy, joystick, params, idle, thrustHeld, match }) {
    const R = params.joystickRadius;
    const twin = view.isTouch && params.touchScheme === 'twin';
    if (twin) {
      const b = joystick.thrustButton();
      ctx.save();
      if (overShip(match, b.x, b.y, b.r)) ctx.globalAlpha = 0.3;
      drawThrustButton(b, thrustHeld);
      ctx.restore();
    }
    const c = joy ? { x: joy.cx, y: joy.cy } : joystick?.fixedCenter();
    ctx.save();
    if (c && overShip(match, c.x, c.y, R)) ctx.globalAlpha = 0.3;
    drawStick(joy, joystick, params, idle, twin, R);
    ctx.restore();
  }

  function drawStick(joy, joystick, params, idle, twin, R) {
    if (!joy) {
      if (!view.isTouch || !(idle || twin)) return;
      // Dica discreta de onde o direcional aparece; nas colunas do C, do mesmo tamanho do botão
      const c = joystick.fixedCenter();
      ctx.strokeStyle = params.joystickMode === 'fixed' || twin ? 'rgba(255,93,93,0.45)' : 'rgba(255,93,93,0.25)';
      ctx.lineWidth = twin ? 3 : 2;
      ctx.beginPath();
      ctx.arc(c.x, c.y, twin ? R * 0.9 : R, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }
    let dx = joy.x - joy.cx, dy = joy.y - joy.cy;
    const d = Math.hypot(dx, dy);
    if (d > R) { dx *= R / d; dy *= R / d; }   // a bola acompanha o dedo até a borda do anel
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

  function drawThrustButton(b, pressed) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = pressed ? 'rgba(255,159,67,0.95)' : 'rgba(255,159,67,0.4)';
    ctx.fillStyle = pressed ? 'rgba(255,159,67,0.25)' : 'rgba(255,159,67,0.06)';
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Chama estilizada no meio do botão
    const k = b.r / 50;
    ctx.fillStyle = pressed ? 'rgba(255,209,102,0.95)' : 'rgba(255,209,102,0.45)';
    ctx.beginPath();
    ctx.moveTo(b.x, b.y - 18 * k);
    ctx.quadraticCurveTo(b.x + 13 * k, b.y + 2 * k, b.x, b.y + 16 * k);
    ctx.quadraticCurveTo(b.x - 13 * k, b.y + 2 * k, b.x, b.y - 18 * k);
    ctx.fill();
  }

  function drawButtons({ buttons }) {
    for (const b of buttons) {
      ctx.strokeStyle = 'rgba(232,241,255,0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(232,241,255,0.9)';
      if (b.id === 'pause') {
        ctx.fillRect(b.x - 6, b.y - 7, 4, 14);
        ctx.fillRect(b.x + 2, b.y - 7, 4, 14);
      } else {
        ctx.font = `700 13px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.label, b.x, b.y + 1);
      }
    }
  }

  return r;
}
