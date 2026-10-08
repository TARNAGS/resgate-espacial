import { mulberry32 } from '../core/rng.js';

// Céu de estrelas, com um leve paralaxe que acompanha a câmera.
// Céu com semente fixa (#123): as estrelas ficam no mesmo lugar a cada abertura, e o desenho de ouro consegue compará-las
const starRand = mulberry32(1123);
const STARS = Array.from({ length: 140 }, () => ({
  u: starRand(), v: starRand(), z: 0.15 + starRand() * 0.5, b: 0.3 + starRand() * 0.7, ph: starRand() * 6.28,
}));

export function createSky({ ctx, view }) {
  function drawStars(t, off) {
    for (const s of STARS) {
      const x = (((s.u * view.cssW - off * s.z) % view.cssW) + view.cssW) % view.cssW;
      const a = s.b * (0.65 + 0.35 * Math.sin(t * 2 + s.ph));
      ctx.fillStyle = `rgba(220,235,255,${a.toFixed(3)})`;
      const size = s.z > 0.5 ? 2 : 1;
      ctx.fillRect(x, s.v * view.cssH, size, size);
    }
  }

  return { drawStars };
}
