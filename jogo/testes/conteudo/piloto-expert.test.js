// Piloto expert (D-026, #92)

import { test, testCompleto, assert, PARAMS, resetParams, LEVELS, findLevel, generateLevel, expertRun, expertPlans, createMatch, createEvents, p, run, physics, playRoute } from '../lib.js';

// Melhores corridas sem abastecer medidas no playtest de 02/10/2026 (documento 09), em segundos de propulsor
const BEST_HUMAN = { 'w1-3': 22.6, practice: 25.1 };

testCompleto('#92 piloto expert gasta no máximo o que gastou a melhor corrida medida (nível 3: 22,6 s; PRACTICE: 25,1 s)', () => {
  for (const [key, human] of Object.entries(BEST_HUMAN)) {
    const def = findLevel(key);
    const run = expertRun(generateLevel(def, def.seed, null), physics(def));
    assert.ok(run, `${key}: o piloto expert não concluiu`);
    assert.ok(run.thrustSeconds <= human, `${key}: ${run.thrustSeconds.toFixed(1)} s, mais que os ${human} s da melhor corrida`);
  }
});

testCompleto('#92 a corrida do piloto expert conclui numa partida de verdade, girando na velocidade do toque', () => {
  resetParams();
  for (const def of [LEVELS[0], LEVELS[2]]) {
    const match = createMatch({ def, seed: def.seed, getParams: () => PARAMS, events: createEvents() });
    const run = expertRun(match.state.level, match.params());
    playRoute(match, run.legs);
    assert.equal(match.state.over, 'complete', `${def.key}: não concluiu`);
    assert.equal(match.state.stationLandings, 0);
  }
});

testCompleto('#92 planos do piloto expert: abastecer ajuda, e o plano com um abastecimento conclui girando no teclado', () => {
  const def = LEVELS[2];
  const plans = expertPlans(generateLevel(def, def.seed, null), physics(def));
  assert.ok(plans.twoTank < plans.oneTank && plans.oneTank < plans.full);
  PARAMS.touchRotationSpeed = PARAMS.keyRotationSpeed;   // os planos com abastecimento valem para todos os controles
  const match = createMatch({ def, seed: def.seed, getParams: () => PARAMS, events: createEvents() });
  playRoute(match, plans.going);
  assert.equal(match.state.over, 'complete');
  assert.equal(match.state.stationLandings, 1);
  resetParams();
});

testCompleto('#92 a mesma fase dá sempre a mesma corrida do piloto expert', () => {
  const def = findLevel('practice');
  const a = expertRun(generateLevel(def, def.seed, null), physics(def));
  const b = expertRun(generateLevel(def, def.seed, null), physics(def));
  assert.equal(a.thrustSeconds, b.thrustSeconds);
});

test('#92 fuelAt muda o posto de lugar; sem ele, o posto continua no meio da fase', () => {
  const def = LEVELS[2];
  const fuelX = (lv) => { const q = lv.pads.find((p) => p.kind === 'fuel'); return (q.x1 + q.x2) / 2; };
  assert.equal(fuelX(generateLevel(def, def.seed, null)), def.generator.length / 2);
  const moved = generateLevel({ ...def, generator: { ...def.generator, fuelAt: 0.75 } }, def.seed, null);
  assert.equal(fuelX(moved), 130 + 0.75 * (def.generator.length - 150 - 130));
});
