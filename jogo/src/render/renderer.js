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

export function createRenderer(canvas, view) {
  const ctx = canvas.getContext('2d');
  const r = { camX: 0, particles: [], messages: [] };

  // ===== Câmera, partículas e mensagens =====
  // A câmera pode passar das pontas da fase para que as plataformas das pontas (base e tripulação)
  // fiquem no meio da tela, longe do polegar que controla o direcional (#50).
  function camLimits(level) {
    const centers = level.pads.map((p) => (p.x1 + p.x2) / 2);
    const lo = Math.min(0, Math.min(...centers) - view.viewW / 2);
    const hi = Math.max(level.L - view.viewW, Math.max(...centers) - view.viewW / 2);
    return [lo, Math.max(lo, hi)];
  }

  r.resetCamera = (match) => {
    r.camX = clamp(match.state.ship.x - view.viewW / 2, ...camLimits(match.state.level));
    r.particles = [];
    r.messages = [];
  };

  r.update = (dt, match, params) => {
    const s = match.state.ship;
    const look = clamp(s.vx * 0.6, -view.viewW * 0.25, view.viewW * 0.25);
    const target = clamp(s.x - view.viewW / 2 + look, ...camLimits(match.state.level));
    r.camX += (target - r.camX) * Math.min(1, dt * 4);
    for (const p of r.particles) {
      p.vy += params.gravity * 0.6 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.ang += p.spin * dt;
      p.life -= dt;
    }
    r.particles = r.particles.filter((p) => p.life > 0);
    for (const m of r.messages) m.t += dt;
    r.messages = r.messages.filter((m) => m.t < m.dur);
  };

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
    drawStars(t, match ? r.camX * view.scale : t * 12);
    if (!match) return;

    const m = match.state;
    ctx.setTransform(view.dpr * view.scale, 0, 0, view.dpr * view.scale, -r.camX * view.scale * view.dpr, 0);
    drawCave(m.level, theme);
    const approach = approachInfo(m, params);
    drawPads(m.level, t, approach);
    drawObstacles(m.level, theme, t);
    if (!m.practice) drawCrew(m, t, params);
    drawShip(m.ship, params, approach, t);
    drawParticles();

    ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    if (!m.practice) drawObjectiveArrow(m, t);
    drawHUD(m, t, params, scene);
    drawMessages(t);
    drawJoystick(scene);
    drawButtons(scene);
  };

  function drawStars(t, off) {
    for (const s of STARS) {
      const x = (((s.u * view.cssW - off * s.z) % view.cssW) + view.cssW) % view.cssW;
      const a = s.b * (0.65 + 0.35 * Math.sin(t * 2 + s.ph));
      ctx.fillStyle = `rgba(220,235,255,${a.toFixed(3)})`;
      const size = s.z > 0.5 ? 2 : 1;
      ctx.fillRect(x, s.v * view.cssH, size, size);
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

  function drawCave(lv, theme) {
    const i0 = Math.max(0, Math.floor(r.camX / STEP) - 1);
    const i1 = Math.min(lv.n - 1, Math.ceil((r.camX + view.viewW) / STEP) + 1);
    const x0 = i0 * STEP, x1 = i1 * STEP;
    ctx.fillStyle = theme.terrainFill;
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
    ctx.strokeStyle = theme.terrainGlow;
    strokeLine(lv.ceil, i0, i1, -9);
    strokeLine(lv.floor, i0, i1, 9);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = theme.terrain;
    strokeLine(lv.ceil, i0, i1, 0);
    strokeLine(lv.floor, i0, i1, 0);
    // Paredes nas pontas da fase
    ctx.fillStyle = theme.terrainFill;
    if (x0 <= 0) {
      ctx.fillRect(-view.viewW - 80, -20, view.viewW + 80, WORLD_H + 40);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, WORLD_H); ctx.stroke();
    }
    if (x1 >= lv.L - STEP) {
      ctx.fillRect(lv.L, -20, view.viewW + 80, WORLD_H + 40);
      ctx.beginPath(); ctx.moveTo(lv.L, 0); ctx.lineTo(lv.L, WORLD_H); ctx.stroke();
    }
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
      if (b.x2 < r.camX - 10 || b.x1 > r.camX + view.viewW + 10) continue;
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

  function drawObjectiveArrow(m, t) {
    const target = m.level.pads.find((p) => p.kind === (m.crewOnBoard ? 'base' : 'crew'));
    const sx = ((target.x1 + target.x2) / 2 - r.camX) * view.scale;
    if (sx >= 0 && sx <= view.cssW) return;
    const right = sx > view.cssW;
    const x = right ? view.cssW - 24 - view.safe.right : 24 + view.safe.left;
    const y = clamp(target.y * view.scale, 110, view.cssH - 50);
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
    const left = 16 + view.safe.left, top = 14 + view.safe.top;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = `700 13px ${FONT}`;
    ctx.fillStyle = '#46e0c8';
    ctx.fillText(m.practice ? 'PRACTICE' : `LEVEL ${m.def.number} · ${m.def.name}`, left, top);

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

    if (!m.practice) {
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
      ctx.fillStyle = '#e8f1ff';
      ctx.fillText(fmtTime(m.timer), view.cssW - 66 - view.safe.right, top + 6);
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.font = `11px ${FONT}`;
    ctx.fillStyle = 'rgba(127,140,163,0.85)';
    const foot = m.practice ? 'crash freely · land on the pad' : `random layout #${m.seed}`;
    ctx.fillText(scene.tuned ? `${foot} · TUNED` : foot, left, view.cssH - 10 - view.safe.bottom);
  }

  function drawMessages(t) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    r.messages.forEach((m, i) => {
      if (m.warn && Math.sin(t * 12) < -0.2) return;
      const alpha = clamp(Math.min(m.t / 0.2, (m.dur - m.t) / 0.4), 0, 1).toFixed(2);
      ctx.font = `700 ${m.warn ? 18 : 15}px ${FONT}`;
      ctx.fillStyle = m.warn ? `rgba(255,93,93,${alpha})` : `rgba(232,241,255,${alpha})`;
      ctx.fillText(m.text, view.cssW / 2, view.cssH * 0.24 + i * 26);
    });
  }

  function drawJoystick({ joy, joystick, params, idle }) {
    const R = params.joystickRadius;
    if (!joy) {
      if (!view.isTouch || !idle) return;
      // Dica discreta de onde o direcional aparece
      const c = params.joystickMode === 'fixed' ? joystick.fixedCenter() : { x: 24 + view.safe.left + R, y: view.cssH - 24 - view.safe.bottom - R };
      ctx.strokeStyle = params.joystickMode === 'fixed' ? 'rgba(255,93,93,0.45)' : 'rgba(255,93,93,0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(c.x, c.y, R, 0, Math.PI * 2);
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
