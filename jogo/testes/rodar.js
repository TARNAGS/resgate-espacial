// Testes automáticos das regras do jogo, sem navegador. Uso: node jogo/testes/rodar.js
// Cada bloco cita a história (#) ou a regra que verifica.

import assert from 'node:assert/strict';
import { PARAMS, DEFAULT_PARAMS, setParams, resetParams, changedParams } from '../src/config/params.js';
import { LEVELS, PRACTICE_LEVEL } from '../src/content/worlds.js';
import { effectiveParams } from '../src/content/modifiers.js';
import { generateLevel, validateLevel } from '../src/core/generator.js';
import { createShip, fly, steer } from '../src/core/ship.js';
import { createMatch } from '../src/core/match.js';
import { createEvents } from '../src/core/events.js';
import { readIntent } from '../src/input/controls.js';
import { emptySave } from '../src/platform/storage.js';
import { isUnlocked, defaultLevel, recordCompletion, levelState } from '../src/core/progress.js';
import { SHIP } from '../src/core/constants.js';

const results = [];
function test(name, fn) {
  try { resetParams(); fn(); results.push([true, name]); } catch (e) { results.push([false, name, e]); }
}

const DT = 1 / 120;
const NONE = { turn: 0, targetAngle: null, thrust: false };
const UP = { turn: 0, targetAngle: null, thrust: true };
const p = () => effectiveParams(PARAMS, LEVELS[0]);
const airShip = () => ({ ...createShip({ x1: 0, x2: 0, y: 300 }, 1), state: 'flying' });
function run(s, input, seconds, params = p()) {
  for (let t = 0; t < seconds; t += DT) fly(s, input, params, DT);
}

// ===== Física da nave =====
test('#32 sem propulsor, a nave cai cada vez mais rápido', () => {
  const s = airShip();
  run(s, NONE, 0.5); const v1 = s.vy;
  run(s, NONE, 0.5); const v2 = s.vy;
  assert.ok(v1 > 0 && v2 > v1);
});

test('#32 a gravidade vem do parâmetro de ajuste', () => {
  const a = airShip(); run(a, NONE, 1);
  PARAMS.gravity = DEFAULT_PARAMS.gravity * 2;
  const b = airShip(); run(b, NONE, 1);
  assert.ok(b.vy > a.vy * 1.9);
});

test('#33 apontando para cima, o propulsor faz a nave subir vencendo a gravidade', () => {
  const s = airShip(); run(s, UP, 1);
  assert.ok(s.vy < 0 && s.y < 300 && s.thrusting);
});

test('#33 inclinada para a direita, vai para cima e para a direita', () => {
  const s = airShip(); s.a = 0.5; run(s, UP, 1);
  assert.ok(s.vx > 0 && s.vy < 0);
});

test('#33 acionando e soltando em sequência, a nave flutua na mesma altura', () => {
  const s = airShip(); s.y = 300;
  for (let t = 0; t < 6; t += DT) fly(s, s.vy > 0 ? UP : NONE, p(), DT);
  assert.ok(Math.abs(s.y - 300) < 15, `y=${s.y.toFixed(1)}`);
});

test('#34 com o propulsor desligado, a nave mantém o embalo para o lado enquanto cai', () => {
  const s = airShip(); s.vx = 80; run(s, NONE, 1);
  assert.ok(Math.abs(s.vx - 80) < 1e-9 && s.vy > 0 && s.x > 70);
});

test('#34 propulsor para o lado oposto desacelera antes de mudar de direção', () => {
  const s = airShip(); s.vx = 80; s.a = -Math.PI / 2;
  const seen = [];
  for (let t = 0; t < 2; t += DT) { fly(s, UP, p(), DT); seen.push(s.vx); }
  const firstNeg = seen.findIndex((v) => v < 0);
  assert.ok(firstNeg > 0 && seen[firstNeg - 1] < 80 && seen[firstNeg - 1] >= 0);
});

test('#33 o combustível acaba e o propulsor para de funcionar', () => {
  const s = airShip(); s.fuel = 0.01; run(s, UP, 1);
  assert.equal(s.fuel, 0); assert.equal(s.thrusting, false);
});

// ===== Controles =====
test('#37 setas giram para a esquerda e para a direita enquanto pressionadas', () => {
  const left = readIntent({ left: true, right: false, thrust: false }, null, PARAMS);
  const right = readIntent({ left: false, right: true, thrust: false }, null, PARAMS);
  assert.equal(left.turn, -1); assert.equal(right.turn, 1);
  const s = airShip(); steer(s, left, p(), 0.25);
  assert.ok(s.a < 0);
});

test('#37 ↑ e ← ao mesmo tempo: gira e acelera ao mesmo tempo', () => {
  const i = readIntent({ left: true, right: false, thrust: true }, null, PARAMS);
  assert.equal(i.turn, -1); assert.equal(i.thrust, true);
});

test('#38 tocar no direcional acende o propulsor; arrastar aponta a nave', () => {
  const touching = readIntent({}, { cx: 100, cy: 100, x: 100, y: 100 }, PARAMS);
  assert.equal(touching.thrust, true); assert.equal(touching.targetAngle, null);
  const right = readIntent({}, { cx: 100, cy: 100, x: 160, y: 100 }, PARAMS);
  assert.ok(Math.abs(right.targetAngle - Math.PI / 2) < 1e-9);
  const s = airShip();
  for (let t = 0; t < 1; t += DT) steer(s, right, p(), DT);
  assert.ok(Math.abs(s.a - Math.PI / 2) < 1e-6);
});

test('#38 a velocidade de giro até o dedo é um parâmetro de ajuste', () => {
  const right = readIntent({}, { cx: 0, cy: 0, x: 60, y: 0 }, PARAMS);
  const a = airShip(); steer(a, right, p(), 0.05);
  PARAMS.touchRotationSpeed = DEFAULT_PARAMS.touchRotationSpeed / 2;
  const b = airShip(); steer(b, right, p(), 0.05);
  assert.ok(Math.abs(b.a * 2 - a.a) < 1e-9);
});

// ===== Parâmetros e modificadores =====
test('#36 mudar um parâmetro muda o jogo sem outra alteração', () => {
  setParams({ thrust: 200, bogus: 1, gravity: 'x' });
  assert.equal(effectiveParams(PARAMS, LEVELS[0]).thrust, 200);
  assert.deepEqual(changedParams(), { thrust: 200 });
});

test('modificadores alteram a física e tipos desconhecidos dão erro', () => {
  const def = { ...LEVELS[0], modifiers: [{ type: 'gravity', scale: 0.5 }, { type: 'wind', force: 10 }, { type: 'tank', scale: 2 }] };
  const e = effectiveParams(PARAMS, def);
  assert.equal(e.gravity, PARAMS.gravity / 2); assert.equal(e.windX, 10); assert.equal(e.tankSeconds, 80);
  assert.throws(() => effectiveParams(PARAMS, { ...def, modifiers: [{ type: 'nope' }] }));
  const s = airShip(); run(s, NONE, 1, e);
  assert.ok(s.vx > 0);
});

// ===== Gerador de fases =====
test('D-014 a mesma semente gera o mesmo cenário; outra semente gera outro', () => {
  const a = generateLevel(LEVELS[1], 42), b = generateLevel(LEVELS[1], 42), c = generateLevel(LEVELS[1], 43);
  assert.deepEqual(a.floor, b.floor); assert.deepEqual(a.obstacles, b.obstacles);
  assert.notDeepEqual(a.floor, c.floor);
});

for (const def of LEVELS) {
  test(`${def.key} 500 cenários aleatórios têm solução (corredor, plataformas planas, passagem nas pedras)`, () => {
    for (let seed = 1; seed <= 500; seed++) {
      const lv = generateLevel(def, seed * 7919);
      const problems = validateLevel(lv);
      assert.deepEqual(problems, [], `seed ${seed * 7919}: ${problems[0]}`);
      const want = def.generator.obstacles.find((o) => o.type === 'rock')?.count ?? 0;
      assert.ok(lv.obstacles.length >= want * 0.7, `seed ${seed * 7919}: poucas pedras (${lv.obstacles.length})`);
    }
  });
}

// ===== Partida =====
function newMatch(def, seed = 1) {
  const events = createEvents();
  const log = [];
  events.on('*', (e) => log.push(e));
  const match = createMatch({ def, seed, getParams: () => PARAMS, events });
  return { match, log, m: match.state };
}
// Coloca a nave logo acima de uma plataforma, descendo devagar
function hover(m, kind, vy = 20, a = 0) {
  const pad = m.level.pads.find((q) => q.kind === kind);
  Object.assign(m.ship, { state: 'flying', pad: null, x: (pad.x1 + pad.x2) / 2, y: pad.y - SHIP.base - 1, vx: 0, vy, a });
}
const step = (match, input, seconds) => { for (let t = 0; t < seconds; t += DT) match.update(DT, input); };

test('#35 treino: encostar devagar na plataforma deixa a nave pousada', () => {
  const { match, m } = newMatch(PRACTICE_LEVEL);
  step(match, UP, 0.2); assert.equal(m.ship.state, 'flying');
  hover(m, 'base', 20); step(match, NONE, 0.1);
  assert.equal(m.ship.state, 'landed');
});

test('#35 treino: encostar rápido demais explode e reaparece pousada na plataforma, sem perder vida', () => {
  const { match, m, log } = newMatch(PRACTICE_LEVEL);
  hover(m, 'base', PARAMS.landingMaxVy + 30); step(match, NONE, 0.1);
  assert.equal(m.ship.state, 'exploding');
  assert.ok(log.some((e) => e.name === 'crash' && e.reason === 'LANDED TOO FAST'));
  step(match, NONE, 1.5);
  assert.equal(m.ship.state, 'landed'); assert.equal(m.ship.pad.kind, 'base'); assert.equal(m.lives, PARAMS.lives);
});

test('#35 treino: encostar fora da plataforma explode', () => {
  const { match, m, log } = newMatch(PRACTICE_LEVEL);
  Object.assign(m.ship, { state: 'flying', pad: null, x: 200, y: m.level.floor[10] - SHIP.base - 1, vy: 10 });
  step(match, NONE, 0.1);
  assert.ok(log.some((e) => e.name === 'crash' && e.reason === 'TOUCHED THE GROUND'));
});

test('#35 o limite de velocidade de pouso é um parâmetro de ajuste', () => {
  PARAMS.landingMaxVy = 200;
  const { match, m } = newMatch(PRACTICE_LEVEL);
  hover(m, 'base', 150); step(match, NONE, 0.05);
  assert.equal(m.ship.state, 'landed');
});

test('Regras 3.3 pousar inclinado demais explode', () => {
  const { match, m, log } = newMatch(PRACTICE_LEVEL);
  hover(m, 'base', 20, 0.6); step(match, NONE, 0.1);
  assert.ok(log.some((e) => e.name === 'crash' && e.reason === 'LANDED TILTED'));
});

test('Regras 2 e 7 resgate completo: embarque, volta, conclusão e tempo', () => {
  const { match, m, log } = newMatch(LEVELS[0], 5);
  step(match, UP, 0.3);
  hover(m, 'crew'); step(match, NONE, 0.05);
  assert.equal(m.ship.state, 'boarding');
  step(match, UP, PARAMS.boardingSeconds + 0.1);   // controles travados durante o embarque
  assert.equal(m.crewOnBoard, true);
  assert.equal(log.filter((e) => e.name === 'boardStep').length, 3);
  step(match, UP, 0.2);
  hover(m, 'base'); step(match, NONE, 0.05);
  const done = log.find((e) => e.name === 'complete');
  assert.ok(done && m.over === 'complete');
  assert.ok(done.run.time > 0 && done.run.livesLost === 0 && done.run.fuelLeft > 0);
});

test('Regras 7.1 depois de chegar à tripulação, explodir faz reaparecer nela com o combustível da chegada', () => {
  const { match, m } = newMatch(LEVELS[0], 5);
  m.ship.fuel = 0.6; hover(m, 'crew'); step(match, NONE, 0.05);
  step(match, NONE, PARAMS.boardingSeconds + 0.1);
  const arrival = m.checkpointFuel;
  step(match, UP, 0.5);
  Object.assign(m.ship, { y: 2 });                  // bate no teto
  step(match, NONE, 1.6);
  assert.equal(m.ship.pad.kind, 'crew'); assert.equal(m.ship.fuel, arrival); assert.equal(m.crewOnBoard, true);
  assert.equal(m.lives, PARAMS.lives - 1);
});

test('Regras 7.1 sem combustível na plataforma da tripulação: explode, volta à base e perde o resgate', () => {
  const { match, m, log } = newMatch(LEVELS[0], 5);
  hover(m, 'crew'); step(match, NONE, 0.05);
  step(match, NONE, PARAMS.boardingSeconds + 0.1);
  m.ship.fuel = 0;
  step(match, NONE, 3);
  assert.ok(log.some((e) => e.name === 'crash' && e.reason === 'OUT OF FUEL'));
  assert.equal(m.ship.pad.kind, 'base'); assert.equal(m.crewOnBoard, false); assert.equal(m.ship.fuel, 1);
});

test('Regras 7 ao perder a terceira vida é fim de jogo', () => {
  const { match, m, log } = newMatch(LEVELS[0], 5);
  for (let i = 0; i < PARAMS.lives; i++) {
    step(match, UP, 0.3);
    m.ship.y = 2;
    step(match, NONE, 1.6);
  }
  assert.equal(m.over, 'gameOver'); assert.ok(log.some((e) => e.name === 'gameOver'));
});

test('Regras 7.1 aviso forte ao pousar na tripulação com pouco combustível', () => {
  const { match, m, log } = newMatch(LEVELS[0], 5);
  m.ship.fuel = PARAMS.lowFuel / 2; hover(m, 'crew'); step(match, NONE, 0.05);
  assert.ok(log.some((e) => e.name === 'lowFuelAtCrew'));
  assert.ok(log.some((e) => e.name === 'boarding' && e.lowFuel));
});

// ===== Progresso =====
test('Regras 10 concluir um nível libera o próximo; o melhor tempo fica salvo', () => {
  const save = emptySave();
  assert.ok(isUnlocked(save, LEVELS[0])); assert.ok(!isUnlocked(save, LEVELS[1]));
  recordCompletion(save, LEVELS[0].key, { time: 50, livesLost: 1, fuelLeft: 0.3 });
  assert.ok(isUnlocked(save, LEVELS[1])); assert.equal(defaultLevel(save).key, LEVELS[1].key);
  assert.equal(levelState(save, LEVELS[0]), 'done');
  assert.equal(recordCompletion(save, LEVELS[0].key, { time: 60 }).isBest, false);
  assert.equal(recordCompletion(save, LEVELS[0].key, { time: 40 }).isBest, true);
  assert.equal(save.levels[LEVELS[0].key].best.time, 40); assert.equal(save.levels[LEVELS[0].key].rescues, 3);
});

// ===== Resultado =====
const failed = results.filter((r) => !r[0]);
for (const [ok, name, err] of results) {
  console.log(`${ok ? '✓' : '✗'} ${name}`);
  if (!ok) console.log(`    ${err.message.split('\n').join('\n    ')}`);
}
console.log(`\n${results.length - failed.length} de ${results.length} testes passaram.`);
process.exit(failed.length ? 1 : 0);
