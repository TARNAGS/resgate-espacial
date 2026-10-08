// Fichas de ouro (#114): as regras básicas não mudam sem querer.
// Mudou uma regra de propósito? Rode `node jogo/testes/rodar.js --atualizar-ouro` e confira a diferença das fichas
// no commit: ela mostra exatamente o que a mudança fez com as corridas.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, assert, DEFAULT_PARAMS } from '../lib.js';
import { SCENARIOS, sheetOf, formatSheet, differences } from './cenarios.js';

const DIR = join(dirname(fileURLToPath(import.meta.url)), 'fichas');
const UPDATE = process.argv.includes('--atualizar-ouro');
const fileOf = (scenario) => join(DIR, `${scenario.id}.json`);

for (const scenario of SCENARIOS) {
  test(`#114 ficha de ouro: ${scenario.name}`, () => {
    const now = sheetOf(scenario);
    if (UPDATE) {
      mkdirSync(DIR, { recursive: true });
      writeFileSync(fileOf(scenario), formatSheet(now));
      return;
    }
    assert.ok(existsSync(fileOf(scenario)), `a ficha ${scenario.id}.json não existe: rode o teste com --atualizar-ouro`);
    const before = JSON.parse(readFileSync(fileOf(scenario), 'utf8'));
    const diff = differences(before, now);
    assert.equal(diff.length, 0, `a corrida mudou:\n  ${diff.join('\n  ')}\nSe foi de propósito, regrave com --atualizar-ouro e confira a diferença no commit.`);
  });
}

test('#114 o alarme funciona: com a gravidade 1 unidade maior, as fichas deixam de bater', () => {
  for (const id of ['bate-no-teto', 'w1-1-expert']) {
    const scenario = SCENARIOS.find((s) => s.id === id);
    const before = JSON.parse(readFileSync(fileOf(scenario), 'utf8'));
    const diff = differences(before, sheetOf(scenario, { gravity: DEFAULT_PARAMS.gravity + 1 }));
    assert.ok(diff.length > 0, `${id}: a gravidade mudou e a ficha continuou igual`);
  }
});
