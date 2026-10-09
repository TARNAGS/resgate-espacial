import { clamp } from '../core/math.js';
import { cameraZoomFor } from './view.js';
import { resolveSkin } from './skins/index.js';
import { createCamera } from './camera.js';
import { createSky } from './sky.js';
import { createCave } from './cave.js';
import { createPads } from './pads.js';
import { createCrew } from './crew.js';
import { createShip } from './ship.js';
import { createMessages } from './messages.js';
import { createControls } from './controls.js';
import { createHud, LOW_FUEL_FLASH } from './hud.js';
import { createCoachArt } from './coach.js';

// Desenho do jogo no Canvas. Lê o estado da partida e nunca o altera.
// Cada camada fica numa peça própria (#123); aqui ficam só o estado do desenho (câmera, partículas e mensagens)
// e a ordem das camadas no quadro.

export function createRenderer(canvas, view) {
  const ctx = canvas.getContext('2d');
  const r = { camX: 0, camY: 0, zoom: 1, particles: [], messages: [], noFuelT: 0, lowFuelT: 0, skin: resolveSkin() };

  const cam = createCamera(r, view);
  const { viewW, camLimits, camYTarget, keepShipVisible } = cam;
  const kit = { ctx, view, r, ...cam };
  const { drawStars } = createSky(kit);
  const { drawCave, drawObstacles } = createCave(kit);
  const { approachInfo, drawPads } = createPads(kit);
  const { drawCrew } = createCrew(kit);
  const { drawShip, drawParticles } = createShip(kit);
  const { drawObjectiveArrow, drawHUD } = createHud(kit);
  const { drawMessages, drawPraise, drawNoFuel } = createMessages(kit);
  const { drawJoystick, drawButtons, drawDemo } = createControls(kit);
  const { drawCoachWorld, drawCoachScreen } = createCoachArt(kit);

  // ===== Partículas e mensagens =====
  r.resetCamera = (match, params) => {
    r.zoom = cameraZoomFor(view, params);
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
    r.zoom = cameraZoomFor(view, params);
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
    r.skin = resolveSkin(params?.skin);   // a skin escolhida (#124): só a aparência muda
    const theme = r.skin.theme(match ? match.state.def.world.theme : scene.theme);
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
    if (scene.coach) drawCoachWorld(m, scene.coach, t);   // o treinador da fase que ensina (D-038)
    drawShip(m.ship, params, approach, t, m.shipDef);
    drawParticles();
    ctx.restore();

    ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    if (scene.attract) {
      // Attract mode (#105): a corrida passa escurecida atrás do menu, sem painel nem controles
      ctx.fillStyle = 'rgba(3,5,10,0.62)';
      ctx.fillRect(0, 0, view.cssW, view.cssH);
      return;
    }
    if (!m.training) drawObjectiveArrow(m, t, params, Boolean(scene.coach));
    drawHUD(m, t, params, scene);
    drawMessages(t, m.ship, scene);
    if (scene.coach) drawCoachScreen(m, scene.coach, t, scene);
    drawPraise();
    drawNoFuel(m.ship, t);
    drawJoystick(scene);
    drawButtons(scene);
    if (scene.demo) drawDemo(scene.demo, t);
  };

  return r;
}
