// DEMO (#104, D-031)

import { test, assert, PARAMS, resetParams, LEVELS, findLevel, createDemoPilot, DEMO_LABELS, DEMO_SPEED, createMatch, createEvents, DT } from '../lib.js';

test('#104 a DEMO joga o nível 1 inteiro numa partida de verdade, em uns 10 segundos, com os três rótulos em ordem', () => {
  resetParams();
  const def = LEVELS[0];
  const match = createMatch({ def, seed: def.seed, getParams: () => PARAMS, events: createEvents() });
  const pilot = createDemoPilot(match);
  const labels = [];
  let steps = 0;
  while (!pilot.done && steps < 120 * 60) {
    match.update(DT, pilot.next());
    if (labels[labels.length - 1] !== pilot.label) labels.push(pilot.label);
    steps += 1;
  }
  assert.equal(match.state.over, 'complete');
  assert.deepEqual(labels, [0, 1, 2]);
  const seconds = steps * DT / DEMO_SPEED;
  assert.ok(seconds > 6 && seconds < 14, `a DEMO dura ${seconds.toFixed(1)} s na tela`);
  assert.ok(DEMO_LABELS.every((l) => l.split(' ').length <= 8), 'no máximo oito palavras na tela');
});

test('D-021 as fases da sequência e a PRACTICE têm cenário fixo; só a BONUS é sorteada', () => {
  for (const def of [...LEVELS, findLevel('practice')]) assert.ok(Number.isInteger(def.seed), def.key);
  const bonus = findLevel('bonus');
  assert.ok(bonus && bonus.random && bonus.seed == null && bonus.challenge);
});

test('PRACTICE é a fase mais difícil: corredor mais estreito, mais pedras e menos espaço para passar', () => {
  const practice = findLevel('practice');
  for (const def of LEVELS) {
    assert.ok(practice.generator.minGap < def.generator.minGap);
    const rocks = (d) => d.generator.obstacles.find((o) => o.type === 'rock') ?? { count: 0, passGap: Infinity };
    assert.ok(rocks(practice).count > rocks(def).count);
    assert.ok(rocks(practice).passGap < rocks(def).passGap);
  }
});
