// Partida

import { test, assert, PARAMS, DEFAULT_PARAMS, LEVELS, TRAINING_LEVEL, landingForecast, createMatch, createEvents, CLASSIC_SHIP, mulberry32, DT, NONE, UP, p, airShip, step } from '../lib.js';

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
  Object.assign(m.ship, { state: 'flying', pad: null, x: (pad.x1 + pad.x2) / 2, y: pad.y - CLASSIC_SHIP.feet.y - 1, vx: 0, vy, a });
}

test('#35 treino: encostar devagar na plataforma deixa a nave pousada', () => {
  const { match, m } = newMatch(TRAINING_LEVEL);
  step(match, UP, 0.2); assert.equal(m.ship.state, 'flying');
  hover(m, 'base', 20); step(match, NONE, 0.1);
  assert.equal(m.ship.state, 'landed');
});

test('#35 treino: encostar rápido demais explode e reaparece pousada na plataforma, sem perder vida', () => {
  const { match, m, log } = newMatch(TRAINING_LEVEL);
  hover(m, 'base', PARAMS.landingMaxVy + 30); step(match, NONE, 0.1);
  assert.equal(m.ship.state, 'exploding');
  assert.ok(log.some((e) => e.name === 'crash' && e.reason === 'LANDED TOO FAST'));
  step(match, NONE, 1.5);
  assert.equal(m.ship.state, 'landed'); assert.equal(m.ship.pad.kind, 'base'); assert.equal(m.lives, PARAMS.lives);
});

test('#35 treino: encostar fora da plataforma explode', () => {
  const { match, m, log } = newMatch(TRAINING_LEVEL);
  Object.assign(m.ship, { state: 'flying', pad: null, x: 200, y: m.level.floor[10] - CLASSIC_SHIP.feet.y - 1, vy: 10 });
  step(match, NONE, 0.1);
  assert.ok(log.some((e) => e.name === 'crash' && e.reason === 'TOUCHED THE GROUND'));
});

test('#35 o limite de velocidade de pouso é um parâmetro de ajuste', () => {
  PARAMS.landingMaxVy = 200;
  const { match, m } = newMatch(TRAINING_LEVEL);
  hover(m, 'base', 150); step(match, NONE, 0.05);
  assert.equal(m.ship.state, 'landed');
});

test('#50 pousar com a nave um pouco além da borda da plataforma ainda conta (padMargin)', () => {
  const { match, m } = newMatch(TRAINING_LEVEL);
  const pad = m.level.pads[0];
  hover(m, 'base'); m.ship.x = pad.x2 - CLASSIC_SHIP.feet.half + PARAMS.padMargin - 1;   // a ponta da asa passa da borda
  step(match, NONE, 0.1);
  assert.equal(m.ship.state, 'landed');
});

test('#50 passar da folga da borda explode', () => {
  const { match, m, log } = newMatch(TRAINING_LEVEL);
  const pad = m.level.pads[0];
  hover(m, 'base'); m.ship.x = pad.x2 - CLASSIC_SHIP.feet.half + PARAMS.padMargin + 4; step(match, NONE, 0.1);
  assert.ok(log.some((e) => e.name === 'crash'));
});

test('#50 o giro no toque ficou um pouco mais lento que no protótipo (480 °/s)', () => {
  assert.ok(DEFAULT_PARAMS.touchRotationSpeed < 480 && DEFAULT_PARAMS.touchRotationSpeed >= 380);
});

test('#50 aviso de pouso: subindo da base não é pouso (sem verde nem halo)', () => {
  const s = airShip(); s.vy = -25;
  assert.equal(landingForecast(s, p(), { x1: 260, x2: 340, y: 400 }), null);
});

test('#50 aviso de pouso: descer abaixo do limite agora, mas longe da plataforma, não é verde', () => {
  const s = airShip(); s.vy = PARAMS.landingMaxVy - 5; s.y = 400 - CLASSIC_SHIP.feet.y - 100;
  assert.equal(landingForecast(s, p(), { x1: s.x - 60, x2: s.x + 60, y: 400 }), false);
});

test('#50 aviso de pouso: deslizando para fora da plataforma, não é verde', () => {
  const s = airShip(); s.vy = 10; s.vx = 40; s.y = 400 - CLASSIC_SHIP.feet.y - 120;
  assert.equal(landingForecast(s, p(), { x1: s.x - 60, x2: s.x + 30, y: 400 }), false);
});

test('#50 aviso de pouso: sempre que fica verde, soltar os controles termina em pouso', () => {
  const r = mulberry32(2026);
  const rnd = (a, b) => a + r() * (b - a);
  let greens = 0;
  for (let i = 0; i < 2000; i++) {
    const { match, m, log } = newMatch(TRAINING_LEVEL);
    const pad = m.level.pads[0];
    Object.assign(m.ship, { state: 'flying', pad: null, x: rnd(pad.x1 + 10, pad.x2 - 10), y: pad.y - CLASSIC_SHIP.feet.y - rnd(1, 160), vx: rnd(-60, 60), vy: rnd(1, 90), a: rnd(-0.45, 0.45) });
    const green = landingForecast(m.ship, match.params(), pad);
    if (!green) continue;
    greens += 1;
    step(match, NONE, 3);
    assert.ok(!log.some((e) => e.name === 'crash'), `verde mas explodiu: ${JSON.stringify(log.find((e) => e.name === 'crash'))}`);
  }
  assert.ok(greens > 100, `poucos casos verdes sorteados (${greens})`);
});

test('Regras 3.3 pousar inclinado demais explode', () => {
  const { match, m, log } = newMatch(TRAINING_LEVEL);
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

test('Regras 7.1 e #94 sem combustível na plataforma da tripulação: avisa NO FUEL, explode depois de 2 s, volta à base e perde o resgate', () => {
  const { match, m, log } = newMatch(LEVELS[0], 5);
  hover(m, 'crew'); step(match, NONE, 0.05);
  step(match, NONE, PARAMS.boardingSeconds + 0.1);
  m.ship.fuel = 0;
  step(match, NONE, PARAMS.noFuelLandedSeconds - 0.1);
  assert.ok(log.some((e) => e.name === 'noFuel' && e.landed), 'avisou NO FUEL');
  assert.ok(!log.some((e) => e.name === 'crash'), 'explodiu antes do aviso terminar');
  step(match, NONE, 2);
  assert.ok(log.some((e) => e.name === 'crash' && e.reason === 'OUT OF FUEL'));
  assert.equal(m.ship.pad.kind, 'base'); assert.equal(m.crewOnBoard, false); assert.equal(m.ship.fuel, 1);
});

// Gasta combustível com o propulsor aceso, segurando a nave parada no ar (sem bater no teto)
function burn(match, seconds) {
  for (let t = 0; t < seconds; t += DT) { match.update(DT, UP); Object.assign(match.state.ship, { x: 600, y: 200, vx: 0, vy: 0, a: 0 }); }
}

test('#94 em voo: avisa aos 20% e aos 10%, uma vez cada; sem combustível, para de impulsionar e não explode por isso', () => {
  const { match, m, log } = newMatch(LEVELS[0], 5);
  Object.assign(m.ship, { state: 'flying', pad: null, x: 600, y: 200, vx: 0, vy: 0, a: 0, fuel: 0.25 });
  const tank = match.params().tankSeconds;
  const count = (name, level) => log.filter((e) => e.name === name && (level === undefined || e.level === level)).length;
  burn(match, 0.07 * tank);                         // 25% → 18%
  assert.equal(count('lowFuel', 'low'), 1); assert.equal(count('lowFuel', 'critical'), 0);
  burn(match, 0.1 * tank);                          // → 8%
  assert.equal(count('lowFuel', 'low'), 1); assert.equal(count('lowFuel', 'critical'), 1);
  burn(match, 0.1 * tank);                          // acaba
  assert.equal(count('outOfFuel'), 1);
  assert.equal(m.ship.fuel, 0);
  Object.assign(m.ship, { y: 200, vy: 0 });
  step(match, UP, 0.2);
  assert.ok(m.ship.vy > 0, 'apertando sem combustível, a nave cai');
  assert.ok(!log.some((e) => e.name === 'crash'), 'ficar sem combustível no ar não explode');
});

test('#94 apertar o propulsor sem combustível avisa NO FUEL de novo, a cada toque', () => {
  const { match, m, log } = newMatch(LEVELS[0], 5);
  Object.assign(m.ship, { state: 'flying', pad: null, x: 600, y: 150, vx: 0, vy: 0, a: 0, fuel: 0 });
  step(match, UP, 0.1); step(match, NONE, 0.1); step(match, UP, 0.1);
  assert.equal(log.filter((e) => e.name === 'noFuel' && !e.landed).length, 2);
});

test('#94 depois de abastecer acima de 20%, o aviso vale de novo', () => {
  const { match, m, log } = newMatch(LEVELS[0], 5);
  Object.assign(m.ship, { state: 'flying', pad: null, x: 600, y: 200, vx: 0, vy: 0, a: 0, fuel: 0.21 });
  const tank = match.params().tankSeconds;
  burn(match, 0.02 * tank);
  m.ship.fuel = 0.5;                                // como se tivesse abastecido
  burn(match, 0.31 * tank);
  assert.equal(log.filter((e) => e.name === 'lowFuel' && e.level === 'low').length, 2);
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
