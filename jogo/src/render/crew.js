import { clamp, lerp } from '../core/math.js';
import { DEFAULT_SHIP } from '../content/ships/index.js';

// Tripulação esperando na plataforma e correndo para a nave no embarque.

export function createCrew({ ctx }) {
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
        const door = (m.shipDef ?? DEFAULT_SHIP).door;
        x = lerp(hx, s.x + door.x, k);
        y = lerp(hy, s.y + door.y, k);
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

  return { drawCrew };
}
