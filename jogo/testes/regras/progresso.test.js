// Progresso

import { test, assert, LEVELS, findLevel, emptySave, isUnlocked, defaultLevel, recordCompletion, levelState, nextLevel } from '../lib.js';

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

test('desafios ficam sempre liberados e não têm "próximo nível"', () => {
  const save = emptySave();
  const practice = findLevel('practice');
  assert.ok(isUnlocked(save, practice));
  assert.equal(nextLevel('practice'), null);
  assert.equal(nextLevel(LEVELS[0].key).key, LEVELS[1].key);
});
