// Contrato do obstáculo (#119): vale para todo obstáculo do catálogo. O próximo obstáculo do jogo (P-011, #60;
// os móveis do E-12) entra só com um arquivo novo e já nasce com estas conferências.

import { test, assert, LEVELS, generateLevel, mulberry32 } from '../lib.js';
import { OBSTACLES } from '../../src/content/obstacles/index.js';
import { rock } from '../../src/content/obstacles/rock.js';
import { createShip, shipVerts, shipSamples } from '../../src/core/ship.js';
import { createFakeCanvas } from '../tela-de-mentira.js';
import { SKINS, resolveSkin } from '../../src/render/skins/index.js';

const FUNCTIONS = ['generate', 'bounds', 'hits', 'validate', 'blockedAt'];   // o desenho fica nas skins (#124)
const SEEDS = [1, 2, 3, 4, 5, 6, 7, 8];
const BASE = { ...LEVELS[1], generator: { ...LEVELS[1].generator, obstacles: [] } };   // o relevo do nível 2, sem pedras
const THEME = LEVELS[0].world.theme;

// A nave com o centro em (x, y), do jeito que a colisão a entrega ao obstáculo
function shipAt(x, y, a = 0) {
  const s = { ...createShip({ x1: x, x2: x, y: 0 }, 1), x, y, a };
  const verts = shipVerts(s);
  return { x, y, verts, samples: shipSamples(verts) };
}
const REACH = Math.max(...shipAt(0, 0).verts.map((v) => Math.hypot(v.x, v.y)));   // da nave até a ponta mais longe

// Instâncias do obstáculo em vários relevos, geradas como o gerador faz (generator.js, finish)
function instances(kind, seed) {
  const lv = generateLevel(BASE, seed);
  const ctx = { spec: kind.example, rnd: mulberry32(seed * 31), length: lv.L, busy: lv.pads.map((p) => [p.x1 - 140, p.x2 + 140]), top: lv.top, bottom: lv.bottom };
  return { lv, list: kind.generate(ctx), again: () => kind.generate({ ...ctx, rnd: mulberry32(seed * 31), busy: lv.pads.map((p) => [p.x1 - 140, p.x2 + 140]) }) };
}

// X de tudo o que o desenho do obstáculo pôs na tela de mentira
function drawnXs(kind, o) {
  const { ctx, calls } = createFakeCanvas();
  for (const key of Object.keys(SKINS)) { const skin = resolveSkin(key); skin.obstacles[kind.type](ctx, o, skin.theme(THEME), 0); }   // todas as skins (#124)
  const xs = [];
  for (const [name, args] of calls) {
    if (['moveTo', 'lineTo', 'fillRect', 'strokeRect', 'rect'].includes(name)) xs.push(args[0]);
    if (['fillRect', 'strokeRect', 'rect'].includes(name)) xs.push(args[0] + args[2]);
    if (name === 'arc' || name === 'ellipse') xs.push(args[0] - args[2], args[0] + args[2]);
    if (name === 'quadraticCurveTo') xs.push(args[0], args[2]);
    if (name === 'bezierCurveTo') xs.push(args[0], args[2], args[4]);
  }
  return xs;
}

// Devolve os problemas do obstáculo, em português; vazio se ele cumprir o contrato
function checkObstacle(key, kind) {
  const problems = [];
  const say = (text) => problems.push(`obstáculo "${key}": ${text}`);
  if (kind.type !== key) say(`type é "${kind.type}", mas o catálogo o registra como "${key}"`);
  if (typeof kind.label !== 'string' || !kind.label) say('falta o label (aparece no motivo da batida: "HIT A ...")');
  if (typeof kind.moving !== 'boolean') say('moving precisa ser true ou false');
  if (kind.example?.type !== key) say('falta example: as opções de um nível de exemplo, usadas nos testes');
  for (const fn of FUNCTIONS) if (typeof kind[fn] !== 'function') say(`falta a função ${fn}`);
  if (kind.moving && typeof kind.update !== 'function') say('obstáculo móvel precisa da função update(o, time)');
  if (problems.length) return problems;

  let total = 0;
  for (const seed of SEEDS) {
    const { lv, list, again } = instances(kind, seed);
    total += list.length;
    if (JSON.stringify(again()) !== JSON.stringify(list)) { say(`a mesma semente (${seed}) gerou obstáculos diferentes`); break; }
    for (const o of list.slice(0, 3)) {
      const msg = kind.validate(o, lv);
      if (msg) { say(`não passou na própria conferência de passagem: ${msg}`); continue; }
      const b = kind.bounds(o);
      const cx = (b.x1 + b.x2) / 2;
      const band = kind.blockedAt(o, cx, 0);
      if (!band) { say('blockedAt no meio do obstáculo não devolveu nada'); continue; }
      const cy = (band[0] + band[1]) / 2;
      if (!kind.hits(o, shipAt(cx, cy))) say(`a nave no centro do obstáculo (x ${cx.toFixed(0)}) não bate`);
      if (kind.hits(o, shipAt(cx + 1000, cy))) say('a nave longe do obstáculo bate');
      // Toda posição em que a nave bate tem de estar na faixa que o piloto automático evita
      let miss = null;
      for (let x = b.x1 - 30; x <= b.x2 + 30 && !miss; x += 3) {
        for (let y = cy - 150; y <= cy + 150 && !miss; y += 3) {
          for (const a of [0, Math.PI / 2]) {
            if (!kind.hits(o, shipAt(x, y, a))) continue;
            const f = kind.blockedAt(o, x, REACH);
            if (!f || y < f[0] || y > f[1]) { miss = `x ${x.toFixed(0)}, y ${y.toFixed(0)}`; break; }
          }
        }
      }
      if (miss) say(`a nave bate em ${miss}, fora da faixa do blockedAt: o piloto automático provaria uma rota que explode`);
      const xs = drawnXs(kind, o);
      if (xs.some((x) => x < b.x1 - 1 || x > b.x2 + 1)) say(`o desenho passa dos limites (bounds): o obstáculo sumiria da tela antes de sair dela`);
    }
    if (problems.length) break;
  }
  if (!total) say('não gerou nenhum obstáculo com o example');
  return [...new Set(problems)];
}

test('#119 contrato do obstáculo: todo obstáculo do catálogo cumpre o contrato', () => {
  assert.ok(Object.keys(OBSTACLES).length >= 1);
  const problems = Object.entries(OBSTACLES).flatMap(([key, kind]) => checkObstacle(key, kind));
  assert.equal(problems.length, 0, `\n${problems.join('\n')}`);
});

test('#119 contrato do obstáculo: o alarme pega cada tipo de erro, um obstáculo quebrado de cada vez', () => {
  const broken = {
    'falta a função hits': { ...rock, hits: undefined },
    'gerou obstáculos diferentes': { ...rock, generate: (ctx) => rock.generate({ ...ctx, rnd: Math.random }) },
    'própria conferência de passagem': { ...rock, validate: () => 'sem passagem' },
    'não bate': { ...rock, hits: () => false },
    'fora da faixa do blockedAt': { ...rock, blockedAt: (o, x, m) => rock.blockedAt(o, x, m - o.r * 0.6) },
    'passa dos limites': { ...rock, bounds: (o) => ({ x1: o.x - o.r * 0.5, x2: o.x + o.r * 0.5 }) },
  };
  for (const [expected, kind] of Object.entries(broken)) {
    const problems = checkObstacle('rock', kind);
    assert.ok(problems.some((p) => p.includes(expected)), `"${expected}" não foi apontado:\n${problems.join('\n') || '(nenhum problema)'}`);
  }
});
