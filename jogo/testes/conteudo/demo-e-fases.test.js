// DEMO (#104, D-031; modesta desde a D-038)

import { test, assert, PARAMS, resetParams, LEVELS, findLevel, createDemoPilot, DEMO_LABELS, DEMO_SPEED, createMatch, createEvents, DT } from '../lib.js';

// Joga a DEMO inteira e devolve a partida, os rótulos na ordem em que apareceram e quanto cada um ficou na tela
function playDemo() {
  resetParams();
  const def = LEVELS[0];
  const match = createMatch({ def, seed: def.seed, getParams: () => PARAMS, events: createEvents() });
  const pilot = createDemoPilot(match);
  const labels = [], shown = [];
  let steps = 0, maxVx = 0;
  while (!pilot.done && steps < 120 * 90) {
    match.update(DT, pilot.next());
    maxVx = Math.max(maxVx, Math.abs(match.state.ship.vx));
    if (labels[labels.length - 1] !== pilot.label) { labels.push(pilot.label); shown.push(0); }
    shown[shown.length - 1] += DT / DEMO_SPEED;
    steps += 1;
  }
  return { match, labels, shown, steps, maxVx };
}

test('D-038 a DEMO joga o nível 1 inteiro numa partida de verdade, com cada gesto na ordem: decolar, ir, frear, pousar, embarcar e voltar', () => {
  const { match, labels } = playDemo();
  assert.equal(match.state.over, 'complete');
  const L = (text) => DEMO_LABELS.findIndex((l) => l.startsWith(text));
  const order = ['HOLD THRUST', 'FLY TO THE SOS', 'TAP THRUST', 'TURN BACK', 'LAND SOFTLY ON THE SOS', 'THE CREW', 'BRING THEM BACK', 'LAND SOFTLY ON THE BASE'].map(L);
  // cada gesto aparece, na ordem (a freada aparece de novo na volta)
  let at = -1;
  for (const label of order) {
    const i = labels.indexOf(label, at + 1);
    assert.ok(i > at, `o rótulo "${DEMO_LABELS[label]}" não apareceu depois do anterior: ${labels.map((l) => DEMO_LABELS[l]).join(' › ')}`);
    at = i;
  }
});

test('D-038 a DEMO é modesta: voa calma, passa em até 25 s na tela e cada rótulo fica tempo para ser lido', () => {
  const { steps, shown, maxVx } = playDemo();
  const seconds = steps * DT / DEMO_SPEED;
  assert.ok(seconds > 12 && seconds < 25, `a DEMO dura ${seconds.toFixed(1)} s na tela`);
  assert.ok(maxVx < 180, `o piloto da DEMO passou de ${maxVx.toFixed(0)} de velocidade: tem de voar como alguém que está aprendendo`);
  assert.ok(shown.every((s) => s > 1), `um rótulo ficou menos de 1 s na tela: ${shown.map((s) => s.toFixed(1)).join(', ')}`);
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
