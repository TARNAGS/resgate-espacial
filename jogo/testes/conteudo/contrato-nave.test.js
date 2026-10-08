// Contrato da nave (#122, D-034): toda nave nova é só aparência, a não ser que diga expressamente que muda o jogo.
// Nave de aparência: usa o casco e os atributos da clássica, não precisa de prova e não mexe no ranking.
// Nave que muda o jogo: casco válido, cabe em cada fase, é provada pelo piloto automático em cada fase fixa
// (D-018 valendo para cada nave) e tem ranking próprio.

import { test, testCompleto, assert, LEVELS, CHALLENGES, DEFAULT_PARAMS, generateLevel, createMatch, createEvents, rankKey, physics, step, UP } from '../lib.js';
import { SHIPS, DEFAULT_SHIP, resolveShip, shipProblems, shipFitsLevel } from '../../src/content/ships/index.js';
import { contact } from '../../src/core/collision.js';
import { sampleLine } from '../../src/core/math.js';
import { STEP } from '../../src/core/constants.js';

const FIXED = [...LEVELS, ...CHALLENGES].filter((d) => d.seed != null && d.generator.tank != null);   // fases fixas (D-021)
const gameplayShips = Object.values(SHIPS).filter((s) => s.changesGameplay);

// Naves de mentira, só para provar que as conferências funcionam
const triangle = (tip, half, base) => [{ x: 0, y: -tip }, { x: half, y: base }, { x: -half, y: base }];
const LOOK = {   // nave de aparência: só muda o desenho (asinhas dentro do casco)
  key: 'teste-aparencia', label: 'Teste',
  outline: [{ x: 0, y: -11 }, { x: 3, y: 0 }, { x: 7, y: 8 }, { x: 0, y: 5 }, { x: -7, y: 8 }, { x: -3, y: 0 }],
  nozzle: { y: 6, half: 3, flame: 7, flicker: 6 },
};
const WIDE = {   // nave que muda o jogo: mais larga
  key: 'teste-larga', changesGameplay: true,
  hull: triangle(22, 30, 12), feet: { y: 12, half: 30 }, nozzle: { y: 11, half: 8, flame: 12, flicker: 9 },
  door: { x: 0, y: 12 }, outline: triangle(22, 30, 12),
};

const keyWith = (def, ship) => rankKey(def, physics(def), { ship: ship && resolveShip(ship) });

test('#122 toda nave do catálogo cumpre o contrato; as de aparência usam o casco da clássica e não mexem no ranking', () => {
  for (const [key, ship] of Object.entries(SHIPS)) {
    assert.deepEqual(shipProblems(ship), [], `${key}: ${shipProblems(ship).join('; ')}`);
    if (ship.changesGameplay) {
      for (const def of [...LEVELS, ...CHALLENGES]) assert.equal(shipFitsLevel(ship, def), null, `${key}: ${shipFitsLevel(ship, def)}`);
    } else {
      assert.equal(resolveShip(ship).hull, DEFAULT_SHIP.hull, `${key}: nave de aparência precisa usar o casco da clássica`);
      for (const def of FIXED) assert.equal(keyWith(def, ship), keyWith(def, null), `${key}: nave de aparência mudou a chave do ranking de ${def.key}`);
    }
  }
});

test('#122 nave de aparência de teste: passa sem prova, voa com o casco da clássica e não muda a chave do ranking', () => {
  assert.deepEqual(shipProblems(LOOK), []);
  const resolved = resolveShip(LOOK);
  assert.equal(resolved.hull, DEFAULT_SHIP.hull);
  assert.equal(resolved.feet, DEFAULT_SHIP.feet);
  assert.equal(resolved.outline, LOOK.outline, 'o desenho é o dela');
  for (const def of FIXED) assert.equal(keyWith(def, LOOK), keyWith(def, null), `${def.key}: a chave mudou`);
  const match = createMatch({ def: LEVELS[0], seed: LEVELS[0].seed, getParams: () => DEFAULT_PARAMS, events: createEvents(), ship: LOOK });
  assert.equal(match.state.shipDef.hull, DEFAULT_SHIP.hull, 'a partida usa o casco da clássica');
  step(match, UP, 0.5);
  assert.equal(match.state.ship.state, 'flying');
});

test('#122 nave de aparência que tenta ter casco, pés ou atributos próprios é pega, e mesmo assim voa com o casco da clássica', () => {
  const cheat = { ...LOOK, key: 'teste-trapaca', hull: triangle(6, 3, 4) };
  assert.ok(shipProblems(cheat).some((p) => p.includes('casco próprio')), 'o casco próprio passou sem aviso');
  assert.ok(shipProblems({ ...LOOK, feet: { y: 4, half: 2 } }).some((p) => p.includes('pés próprios')));
  assert.ok(shipProblems({ ...LOOK, modifiers: [{ type: 'tank', scale: 2 }] }).some((p) => p.includes('atributos próprios')));
  assert.equal(resolveShip(cheat).hull, DEFAULT_SHIP.hull, 'a aparência nunca muda o que bate');
  assert.deepEqual(resolveShip({ ...LOOK, modifiers: [{ type: 'tank', scale: 2 }] }).modifiers, []);
});

test('#122 o contrato pega casco inválido: bordas que se cruzam, bocal na frente, pés fora da base', () => {
  const bad = (changes) => shipProblems({ ...WIDE, ...changes });
  assert.ok(bad({ hull: [{ x: -10, y: -10 }, { x: 10, y: 10 }, { x: 10, y: -10 }, { x: -10, y: 10 }] }).some((p) => p.includes('se cruzam')));
  assert.ok(bad({ nozzle: { y: -5, half: 3, flame: 5, flicker: 5 } }).some((p) => p.includes('bocal')));
  assert.ok(bad({ feet: { y: 5, half: 30 } }).some((p) => p.includes('pés')));
  assert.ok(bad({ hull: [{ x: 0, y: 0 }, { x: 5, y: 5 }] }).some((p) => p.includes('3 vértices')));
  assert.deepEqual(shipProblems(WIDE), [], 'a nave larga de teste é válida');
});

test('#122 nave que muda o jogo, mais larga: não passa ao lado das pedras da PRACTICE e tem ranking próprio', () => {
  assert.match(shipFitsLevel(WIDE, CHALLENGES.find((d) => d.key === 'practice')), /não passa ao lado dos obstáculos/);
  assert.equal(shipFitsLevel(WIDE, LEVELS[0]), null);
  for (const def of FIXED) assert.notEqual(keyWith(def, WIDE), keyWith(def, null), `${def.key}: os tempos da nave larga se misturariam com os da clássica`);
});

test('#122 o contato usa o casco da nave da partida: a larga bate no teto onde a clássica passa', () => {
  const match = createMatch({ def: LEVELS[0], seed: LEVELS[0].seed, getParams: () => DEFAULT_PARAMS, events: createEvents() });
  const level = match.state.level, p = match.params();
  const x = level.L * 0.3, ceil = sampleLine(level.ceil, x, STEP);
  const s = { x, y: ceil + 16, vx: 0, vy: 0, a: 0 };   // a ponta da clássica fica a 5 do teto; a da larga, 6 acima dele
  assert.equal(contact(level, s, p), null, 'a clássica não devia encostar');
  assert.equal(contact(level, s, p, resolveShip(WIDE))?.crash, 'HIT THE CEILING');
});

testCompleto('#122 a prova pelo piloto pega o que a conta simples não pega: a nave larga cabe no nível 3, mas não conclui o cenário fixo', () => {
  const w1 = LEVELS[0], w3 = LEVELS[2];
  assert.equal(shipFitsLevel(WIDE, w3), null, 'pela conta simples, a nave larga cabe no nível 3');
  const ok = generateLevel(w1, w1.seed, physics(w1), { prove: true, ship: WIDE });
  assert.equal(ok.seed, w1.seed, 'nível 1: o piloto devia provar o cenário fixo com a nave larga');
  const failed = generateLevel(w3, w3.seed, physics(w3), { prove: true, ship: WIDE });
  assert.notEqual(failed.seed, w3.seed, 'nível 3: o piloto concluiu o cenário fixo com a nave larga, e o teste esperava que não');
});

testCompleto(`#122 D-018 para cada nave que muda o jogo: o piloto prova cada fase fixa com ela (${gameplayShips.length} no catálogo hoje)`, () => {
  for (const ship of gameplayShips) {
    for (const def of FIXED) {
      const lv = generateLevel(def, def.seed, physics(def), { prove: true, ship });
      assert.equal(lv.seed, def.seed, `${ship.key} · ${def.key}: o piloto não concluiu o cenário fixo com esta nave`);
      assert.ok(lv.bestRun || lv.refuelPlans, `${ship.key} · ${def.key}: sem caminho provado`);
    }
  }
});
