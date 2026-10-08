// Gerador de fases

import { test, testCompleto, assert, LEVELS, CHALLENGES, generateLevel, validateLevel } from '../lib.js';

test('D-014 a mesma semente gera o mesmo cenário; outra semente gera outro', () => {
  const a = generateLevel(LEVELS[1], 42), b = generateLevel(LEVELS[1], 42), c = generateLevel(LEVELS[1], 43);
  assert.deepEqual(a.floor, b.floor); assert.deepEqual(a.obstacles, b.obstacles);
  assert.notDeepEqual(a.floor, c.floor);
});

for (const def of [...LEVELS, ...CHALLENGES]) {
  testCompleto(`${def.key} 500 cenários aleatórios têm solução (corredor, plataformas planas, passagem nas pedras)`, () => {
    for (let seed = 1; seed <= 500; seed++) {
      const lv = generateLevel(def, seed * 7919);
      const problems = validateLevel(lv);
      assert.deepEqual(problems, [], `seed ${seed * 7919}: ${problems[0]}`);
      const want = def.generator.obstacles.find((o) => o.type === 'rock')?.count ?? 0;
      assert.ok(lv.obstacles.length >= want * 0.7, `seed ${seed * 7919}: poucas pedras (${lv.obstacles.length})`);
    }
  });
}
