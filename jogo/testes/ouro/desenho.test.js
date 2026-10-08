// Desenho de ouro (#123): reorganizar o desenho não muda a tela.
// Cada quadro de teste vira uma impressão digital dos comandos de desenho (quantos são e um resumo deles). Dividir o
// renderer em peças, trocar a skin "classic" de lugar ou mover uma função tem de dar exatamente os mesmos comandos.
// Mudou o desenho de propósito? Rode `node jogo/testes/rodar.js --atualizar-ouro`: as impressões são regravadas e o
// desenho completo de cada quadro fica em jogo/ferramentas/saida/desenho/ (fora do Git), para comparar com `diff`.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { testCompleto, assert, LEVELS, CHALLENGES, TRAINING_LEVEL } from '../lib.js';
import { SITUATIONS, drawFrozen, playFrames } from '../quadros.js';
import { mulberry32 } from '../../src/core/rng.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = join(HERE, 'desenho.json');
const OUT = join(HERE, '..', '..', 'ferramentas', 'saida', 'desenho');
const UPDATE = process.argv.includes('--atualizar-ouro');
const DEVICES = { 'toque A': { isTouch: true, scheme: 'twin' }, 'toque B': { isTouch: true, scheme: 'hold' }, teclado: { isTouch: false } };

// Desenha todos os quadros com os sorteios da chama, das faíscas e da explosão fixados por semente
export function drawingPrints(seed = 123) {
  const prints = {}, logs = {};
  for (const def of [...LEVELS, ...CHALLENGES, TRAINING_LEVEL]) {
    for (const [situation, prepare] of Object.entries(SITUATIONS)) {
      for (const [device, opts] of Object.entries(DEVICES)) {
        const name = `${def.key} · ${situation} · ${device}`;
        const real = Math.random;
        Math.random = mulberry32(seed);
        let calls;
        try { calls = drawFrozen(def, prepare, playFrames, opts); } finally { Math.random = real; }
        const log = calls.map((c) => JSON.stringify(c)).join('\n');
        prints[name] = `${calls.length}:${createHash('sha1').update(log).digest('hex').slice(0, 16)}`;
        logs[name] = log;
      }
    }
  }
  return { prints, logs };
}

function saveLogs(logs, dir) {
  mkdirSync(dir, { recursive: true });
  for (const [name, log] of Object.entries(logs)) writeFileSync(join(dir, `${name.replace(/[^\w-]+/g, '_')}.txt`), log);
}

testCompleto('#123 desenho de ouro: os comandos de desenho de cada quadro de teste não mudam', () => {
  const { prints, logs } = drawingPrints();
  if (UPDATE) {
    writeFileSync(FILE, `${JSON.stringify(prints, null, 1)}\n`);
    saveLogs(logs, join(OUT, 'antes'));
    return;
  }
  assert.ok(existsSync(FILE), 'o desenho de ouro (desenho.json) não existe: rode o teste com --atualizar-ouro');
  const before = JSON.parse(readFileSync(FILE, 'utf8'));
  const changed = Object.keys({ ...before, ...prints }).filter((name) => before[name] !== prints[name]);
  if (changed.length) saveLogs(Object.fromEntries(changed.map((name) => [name, logs[name] ?? ''])), join(OUT, 'agora'));
  assert.equal(changed.length, 0, `${changed.length} quadros mudaram, por exemplo:\n  ${changed.slice(0, 5).join('\n  ')}\n` +
    'O desenho de agora ficou em jogo/ferramentas/saida/desenho/agora/. Se foi de propósito, regrave com --atualizar-ouro.');
});

testCompleto('#123 o alarme do desenho funciona: com outra semente, a chama e as faíscas mudam e as impressões também', () => {
  const { prints } = drawingPrints();
  const { prints: other } = drawingPrints(124);
  const changed = Object.keys(prints).filter((name) => prints[name] !== other[name]);
  assert.ok(changed.some((name) => name.includes('propulsor aceso')), 'a chama mudou e as impressões continuaram iguais');
});
