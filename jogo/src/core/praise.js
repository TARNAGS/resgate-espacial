import { STEP } from './constants.js';
import { clamp, rad, sampleLine } from './math.js';
import { shipVerts, shipSamples } from './ship.js';

// Elogios para manobras difíceis (#81, ideia do Fernando). Só detecta e avisa pelo canal de
// eventos ('praise'); o desenho e o som ficam com quem ouve. Para não virar enfeite constante,
// há um intervalo mínimo entre elogios (praiseCooldown).
//
//   closeCall     passou "tirando um fininho" de uma pedra ou do terreno, rápido, sem bater
//   greatSave     vinha rápido e ia bater em menos de meio segundo, mas desviou ou freou a tempo
//   perfectLanding pousou quase parado e quase reto
//   perfectRun    concluiu uma fase com posto com um só abastecimento e sem perder vidas (D-023)

const LABELS = {
  closeCall: 'CLOSE CALL',
  greatSave: 'GREAT SAVE',
  perfectLanding: 'PERFECT LANDING',
  perfectRun: 'PERFECT RUN',
};
export const praiseLabel = (kind) => LABELS[kind];

// Distância de um ponto a um segmento
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const k = clamp(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1), 0, 1);
  return Math.hypot(px - (ax + k * dx), py - (ay + k * dy));
}

export function createPraise({ level, events }) {
  const nearPad = (x) => level.pads.some((q) => x > q.x1 - 60 && x < q.x2 + 60);
  let cooldown = 0;
  let armedRocks = new Set();       // pedras que a nave está passando raspando
  let armedTerrain = false;         // nave raspando o teto ou o chão
  let danger = null;                // { t } quando a nave ia bater
  let thrustSinceDanger = false;
  let clearFor = 0;
  let time = 0;

  function praise(kind, s) {
    if (cooldown > 0) return;
    cooldown = 1;                   // valor real definido em update, pelo parâmetro
    events.emit('praise', { kind, label: LABELS[kind], x: s.x, y: s.y });
  }

  // A nave bateria em menos de `horizon` segundos se nada mudasse? (balística, sem propulsor)
  function headingToCrash(s, p, horizon) {
    const g = p.gravity;
    for (let t = 0.05; t <= horizon; t += 0.05) {
      const x = s.x + s.vx * t + 0.5 * p.windX * t * t;
      const y = s.y + s.vy * t + 0.5 * g * t * t;
      if (x <= 8 || x >= level.L - 8) return true;
      if (y - 8 <= sampleLine(level.ceil, x, STEP)) return true;
      if (y + 8 >= sampleLine(level.floor, x, STEP) && !nearPad(x)) return true;
      for (const o of level.obstacles) {
        if (o.r && Math.hypot(x - o.x, y - o.y) < o.r + 8) return true;
      }
    }
    return false;
  }

  return {
    // Chamado a cada passo de voo, depois das colisões, se a nave continua inteira
    update(s, p, dt) {
      time += dt;
      if (cooldown > 0) cooldown = Math.max(0, cooldown - dt / p.praiseCooldown);
      const speed = Math.hypot(s.vx, s.vy);
      const verts = shipVerts(s);
      const samples = shipSamples(verts);

      // Fininho no terreno (longe das plataformas, onde chegar perto do chão é normal)
      let terrainGap = Infinity;
      for (const pt of samples) {
        terrainGap = Math.min(terrainGap, pt.y - sampleLine(level.ceil, pt.x, STEP), sampleLine(level.floor, pt.x, STEP) - pt.y);
      }
      if (!nearPad(s.x) && terrainGap < p.praiseNear && speed >= p.praiseMinSpeed) armedTerrain = true;
      if (armedTerrain && terrainGap > p.praiseNear * 2.5) {
        armedTerrain = false;
        praise('closeCall', s);
      }

      // Fininho nas pedras: distância das bordas da nave às bordas da pedra
      for (let i = 0; i < level.obstacles.length; i++) {
        const o = level.obstacles[i];
        if (!o.pts || Math.abs(o.x - s.x) > o.r + 60 || Math.abs(o.y - s.y) > o.r + 60) {
          if (armedRocks.has(i)) { armedRocks.delete(i); praise('closeCall', s); }
          continue;
        }
        let gap = Infinity;
        for (const pt of samples) {
          for (let k = 0; k < o.pts.length; k++) {
            const a = o.pts[k], b = o.pts[(k + 1) % o.pts.length];
            gap = Math.min(gap, segDist(pt.x, pt.y, a.x, a.y, b.x, b.y));
          }
        }
        if (gap < p.praiseNear && speed >= p.praiseMinSpeed) armedRocks.add(i);
        else if (armedRocks.has(i) && gap > p.praiseNear * 2.5) { armedRocks.delete(i); praise('closeCall', s); }
      }

      // Freada no limite: estava rápido indo para uma batida e o jogador agiu a tempo
      const heading = speed >= p.praiseSaveSpeed && headingToCrash(s, p, p.praiseSaveHorizon);
      if (heading) { danger = { t: time }; clearFor = 0; thrustSinceDanger = false; }
      if (danger) {
        if (s.thrusting) thrustSinceDanger = true;
        clearFor = heading ? 0 : clearFor + dt;
        if (clearFor >= 0.3) {
          if (thrustSinceDanger) praise('greatSave', s);
          danger = null;
        } else if (time - danger.t > 2) danger = null;
      }
    },

    onLand(impact, s, p) {
      if (impact.vy <= p.landingMaxVy * 0.35 && Math.abs(impact.vx) <= 8 && Math.abs(impact.angle) <= rad(4)) {
        praise('perfectLanding', s);
      }
    },

    // A nave explodiu: nada do que estava armado vale mais
    reset() {
      armedRocks = new Set();
      armedTerrain = false;
      danger = null;
    },

    perfectRun(s) {
      cooldown = 0;
      praise('perfectRun', s);
    },
  };
}
