import { pointInPoly } from '../../core/math.js';

// Pedra flutuante: fixa, explode a nave ao encostar. O gerador sempre deixa passagem ao lado.
// Opções no nível: { type: 'rock', count: 7, passGap: 105, spacing: 170 }
//   count    quantas pedras, no máximo
//   passGap  espaço mínimo livre acima ou abaixo de cada pedra
//   spacing  distância mínima entre pedras (padrão 170)

export const rock = {
  type: 'rock',
  label: 'Rock',
  moving: false,

  generate({ spec, rnd, length, busy, top, bottom }) {
    const out = [];
    for (let tries = 0; out.length < spec.count && tries < 600; tries++) {
      const r = 15 + rnd() * 19;
      const x = 300 + rnd() * (length - 600);
      if (busy.some(([a, b]) => x + r > a && x - r < b)) continue;
      if (out.some((o) => Math.abs(o.x - x) < (spec.spacing ?? 170))) continue;
      const ceilY = top(x - r, x + r), floorY = bottom(x - r, x + r);
      const yMin = ceilY + r + 10, yMax = floorY - r - 10;
      if (yMax <= yMin) continue;
      const y = yMin + rnd() * (yMax - yMin);
      if (Math.max(y - r - ceilY, floorY - (y + r)) < spec.passGap) continue;
      const pts = [];
      for (let j = 0; j < 7; j++) {
        const a = (j / 7) * Math.PI * 2 + rnd() * 0.5;
        const rr = r * (0.72 + rnd() * 0.38);
        pts.push({ x: x + Math.cos(a) * rr, y: y + Math.sin(a) * rr });
      }
      out.push({ type: 'rock', x, y, r, pts, passGap: spec.passGap });
      busy.push([x - r, x + r]);
    }
    return out;
  },

  bounds: (o) => ({ x1: o.x - o.r, x2: o.x + o.r }),

  // Faixa vertical que a pedra ocupa na posição x, com folga (para o piloto automático).
  // As pontas da pedra chegam a 1,1 vez o raio.
  blockedAt(o, x, margin) {
    const R = o.r * 1.1 + margin;
    const dx = x - o.x;
    if (Math.abs(dx) >= R) return null;
    const h = Math.sqrt(R * R - dx * dx);
    return [o.y - h, o.y + h];
  },

  hits(o, ship) {
    if (Math.abs(o.x - ship.x) > o.r + 16 || Math.abs(o.y - ship.y) > o.r + 16) return false;
    return ship.samples.some((p) => pointInPoly(p, o.pts)) || o.pts.some((q) => pointInPoly(q, ship.verts));
  },

  // Todo cenário gerado precisa ter solução: sobra passagem acima ou abaixo da pedra
  validate(o, { top, bottom }) {
    const ceilY = top(o.x - o.r, o.x + o.r), floorY = bottom(o.x - o.r, o.x + o.r);
    const gap = Math.max(o.y - o.r - ceilY, floorY - (o.y + o.r));
    return gap >= o.passGap ? null : `rock at x=${o.x.toFixed(0)} leaves only ${gap.toFixed(0)}`;
  },

  draw(ctx, o, theme) {
    ctx.lineWidth = 2;
    ctx.beginPath();
    o.pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    ctx.fillStyle = theme.rockFill;
    ctx.fill();
    ctx.strokeStyle = theme.rock;
    ctx.stroke();
  },
};
