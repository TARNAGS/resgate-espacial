// Caminho provado (D-018) e abastecer obrigatório (D-023)

import { testCompleto, assert, PARAMS, LEVELS, CHALLENGES, generateLevel, createMatch, createEvents, physics, playRoute } from '../lib.js';

const ALL = [...LEVELS, ...CHALLENGES];

for (const def of ALL) {
  testCompleto(`D-018 ${def.key}: todo cenário gerado tem caminho provado pelo piloto automático`, () => {
    for (let k = 1; k <= 8; k++) {
      const lv = generateLevel(def, k * 7907, physics(def));
      if (def.generator.fuelStation) {
        assert.ok(lv.refuelPlans, `semente ${k * 7907}: sem plano com abastecimento`);
        assert.ok(lv.tankSeconds >= lv.refuelPlans.tank, 'tanque menor que o plano com um abastecimento');
        assert.ok(lv.tankSeconds < lv.refuelPlans.full, 'D-023: deu para concluir sem abastecer');
      } else {
        assert.ok(lv.bestRun && lv.tankSeconds >= lv.bestRun.thrustSeconds, `semente ${k * 7907}: sem corrida provada`);
      }
      // Tentar de novo com a semente final repete o mesmo cenário e o mesmo tanque
      const again = generateLevel(def, lv.seed, physics(def));
      assert.equal(again.seed, lv.seed); assert.equal(again.tankSeconds, lv.tankSeconds);
    }
  });
}


for (const def of ALL.filter((d) => d.generator.fuelStation)) {
  for (const plan of ['going', 'back']) {
    testCompleto(`D-023 ${def.key}: abastecendo uma vez ${plan === 'going' ? 'na ida' : 'na volta'}, a partida conclui com PERFECT RUN`, () => {
      PARAMS.touchRotationSpeed = PARAMS.keyRotationSpeed;   // o piloto gira na velocidade do teclado
      for (const seed of [11, 222]) {
        const events = createEvents();
        const log = [];
        events.on('*', (e) => log.push(e));
        const match = createMatch({ def, seed, getParams: () => PARAMS, events });
        playRoute(match, match.state.level.refuelPlans[plan]);
        const m = match.state;
        assert.equal(m.over, 'complete', `semente ${seed}: não concluiu (${log.find((e) => e.name === 'crash')?.reason ?? 'sem batida'})`);
        assert.equal(m.stationLandings, 1);
        assert.equal(log.find((e) => e.name === 'complete').run.perfectRun, true);
        assert.ok(log.some((e) => e.name === 'praise' && e.kind === 'perfectRun'));
      }
    });
  }
}

testCompleto('#87 fases fixas: o cenário e o tanque gravados são os mesmos que o piloto automático prova (iguais em todo navegador)', () => {
  for (const def of [...LEVELS, ...CHALLENGES].filter((d) => d.seed != null)) {
    const fast = generateLevel(def, def.seed, physics(def));                     // o que o jogo usa
    const proven = generateLevel(def, def.seed, physics(def), { prove: true });  // com o piloto
    assert.equal(proven.seed, def.seed, `${def.key}: a semente fixa não tem caminho provado`);
    assert.deepEqual(fast.floor, proven.floor, `${def.key}: chão diferente`);
    assert.deepEqual(fast.obstacles, proven.obstacles, `${def.key}: pedras diferentes`);
    assert.ok(Math.abs(fast.tankSeconds - proven.tankSeconds) < 0.01, `${def.key}: tanque gravado ${fast.tankSeconds}, provado ${proven.tankSeconds.toFixed(2)}; atualize generator.tank`);
    if (def.generator.fuelStation) assert.ok(fast.tankSeconds < proven.refuelPlans.full, `${def.key}: D-023 quebrada`);
  }
});
