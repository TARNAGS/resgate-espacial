import { clamp } from '../core/math.js';
import { DEFAULT_SHIP } from '../content/ships/index.js';

// Nave, chama do propulsor, halo do pouso e os destroços da explosão.

export function createShip({ ctx, r }) {
  function drawShip(s, params, approach, t, def = DEFAULT_SHIP) {
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
    if (s.thrusting) r.skin.flame(ctx, def.nozzle);   // sinal visual do propulsor aceso (#33)
    // A skin desenha a nave sobre o casco da partida (#124); verde só com o pouso garantido
    r.skin.ship(ctx, def, Boolean(approach?.landing && approach.safe));
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

  return { drawShip, drawParticles };
}
