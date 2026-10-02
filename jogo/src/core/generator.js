import { WORLD_H, STEP } from './constants.js';
import { clamp, lerp, sampleLine } from './math.js';
import { mulberry32 } from './rng.js';
import { OBSTACLES } from '../content/obstacles/index.js';
import { bestRun } from './autopilot.js';

// Gerador de fases (D-014): o nível define as regras, a semente define o cenário.
// Mesma semente, mesmo cenário; todo cenário gerado precisa ter solução (validateLevel).
//
// Regra do melhor caminho (D-018): com os parâmetros da física, o gerador também joga o cenário
// com o piloto automático (core/autopilot.js), sem abastecer. Se o piloto não conseguir concluir,
// a semente é trocada até sair um cenário com caminho provado. O tanque sai da melhor corrida:
//   - fase com posto: o tanque é a melhor corrida mais uma folga pequena (bestRunMargin), então
//     quem faz a corrida perfeita conclui sem abastecer e chega quase sem combustível;
//   - fase sem posto: o tanque do nível, ou a melhor corrida mais 25%, o que for maior.

const MAX_ATTEMPTS = 25;
const nextSeed = (s) => (Math.imul(s ^ 0x5bd1e995, 2654435761) >>> 0) % 1000000000;

export function generateLevel(def, seed, params = null) {
  if (!params || def.generator.kind === 'training') return buildLayout(def, seed);
  let s = seed;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const level = buildLayout(def, s);
    const run = bestRun(level, params);
    if (run) {
      level.bestRun = run;
      level.tankSeconds = tankFor(def.generator, run.thrustSeconds);
      return level;
    }
    s = nextSeed(s);
  }
  // Nenhum cenário provado (não deve acontecer; os testes vigiam): fica com o primeiro
  return buildLayout(def, seed);
}

function tankFor(g, best) {
  if (g.fuelStation) return best * (1 + (g.bestRunMargin ?? 0.05));
  return Math.max(g.tankSeconds ?? 40, best * 1.25);
}

// Terreno, plataformas e obstáculos de uma semente
function buildLayout(def, seed) {
  const g = def.generator;
  const rnd = mulberry32(seed);
  const L = g.length;
  const n = Math.floor(L / STEP) + 1;
  const floor = new Array(n);
  const ceil = new Array(n);
  const pads = [];

  if (g.kind === 'training') {
    floor.fill(WORLD_H - 90);
    ceil.fill(40);
    pads.push({ kind: 'base', x1: L / 2 - 70, x2: L / 2 + 70, y: WORLD_H - 90, refuel: true });
    return finish({ def, seed, L, n, floor, ceil, pads, rnd, g });
  }

  const makeWaves = () => [1, 2, 3, 5].map((k) => ({
    amp: (g.roughness * (0.45 + rnd() * 0.8)) / k,
    freq: (0.0011 + rnd() * 0.0021) * k,
    phase: rnd() * Math.PI * 2,
  }));
  const floorWaves = makeWaves();
  const ceilWaves = makeWaves();
  const wave = (ws, x) => ws.reduce((s, w) => s + w.amp * Math.sin(x * w.freq + w.phase), 0);

  for (let i = 0; i < n; i++) {
    const x = i * STEP;
    let f = Math.min(WORLD_H - 125 + wave(floorWaves, x), WORLD_H - 24);
    let c = Math.max(115 + wave(ceilWaves, x), 24);
    if (f - c < g.minGap) {        // garante o corredor mínimo
      const mid = (f + c) / 2;
      f = Math.min(mid + g.minGap / 2, WORLD_H - 24);
      c = Math.max(f - g.minGap, 24);
      if (f - c < g.minGap) f = c + g.minGap;
    }
    floor[i] = f;
    ceil[i] = c;
  }

  // Plataformas: o chão fica plano no pad e se funde aos poucos com o terreno
  function addPad(kind, cx, width) {
    const half = width / 2, core = half + STEP, blend = 60, headroom = 170;
    const y = clamp(floor[clamp(Math.round(cx / STEP), 0, n - 1)], headroom + 40, WORLD_H - 40);
    for (let i = 0; i < n; i++) {
      const d = Math.abs(i * STEP - cx);
      if (d > core + blend) continue;
      const w = d <= core ? 1 : 1 - (d - core) / blend;
      const k = w * w * (3 - 2 * w);
      floor[i] = lerp(floor[i], y, k);
      ceil[i] = Math.min(ceil[i], lerp(ceil[i], y - headroom, k));
      if (floor[i] - ceil[i] < g.minGap) ceil[i] = floor[i] - g.minGap;
    }
    pads.push({ kind, x1: cx - half, x2: cx + half, y, refuel: kind !== 'crew' });
  }
  addPad('base', 130, 120);
  if (g.fuelStation) addPad('fuel', L / 2, 110);
  addPad('crew', L - 150, 120);

  return finish({ def, seed, L, n, floor, ceil, pads, rnd, g });
}

// Pontos mais baixos do teto e mais altos do chão num trecho: o espaço livre ali
function terrainQueries(floor, ceil) {
  return {
    top(x1, x2) {
      let y = -Infinity;
      for (let x = x1; x <= x2; x += STEP / 2) y = Math.max(y, sampleLine(ceil, x, STEP));
      return y;
    },
    bottom(x1, x2) {
      let y = Infinity;
      for (let x = x1; x <= x2; x += STEP / 2) y = Math.min(y, sampleLine(floor, x, STEP));
      return y;
    },
  };
}

function finish({ def, seed, L, n, floor, ceil, pads, rnd, g }) {
  const q = terrainQueries(floor, ceil);
  const busy = pads.map((p) => [p.x1 - 140, p.x2 + 140]);
  const obstacles = [];
  for (const spec of g.obstacles || []) {
    const kind = OBSTACLES[spec.type];
    if (!kind) throw new Error(`Unknown obstacle: ${spec.type}`);
    obstacles.push(...kind.generate({ spec, rnd, length: L, busy, ...q }));
  }
  return { def, seed, L, n, floor, ceil, pads, obstacles, ...q };
}

// Confere se o cenário tem solução. Devolve a lista de problemas (vazia = tudo certo).
export function validateLevel(level) {
  const problems = [];
  const g = level.def.generator;
  if (g.kind !== 'training') {
    for (let i = 0; i < level.n; i++) {
      if (level.floor[i] - level.ceil[i] < g.minGap - 0.5) problems.push(`corridor too narrow at x=${i * STEP}`);
    }
  }
  for (const p of level.pads) {
    for (let x = p.x1; x <= p.x2; x += STEP / 2) {
      if (Math.abs(sampleLine(level.floor, x, STEP) - p.y) > 0.5) { problems.push(`${p.kind} pad not flat`); break; }
    }
  }
  for (const o of level.obstacles) {
    const msg = OBSTACLES[o.type].validate?.(o, level);
    if (msg) problems.push(msg);
  }
  return problems;
}
