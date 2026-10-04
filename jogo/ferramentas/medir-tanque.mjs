// Números para decidir o tanque das fases com posto (D-026, #92 e #93). Voa cada fase com o piloto
// expert, que voa como os melhores jogadores, com o posto no meio e mais perto da tripulação, e mostra
// a janela do tanque: abaixo da corrida sem abastecer (ninguém termina sem o posto) e acima do que é
// preciso entre um abastecimento e outro.
// Uso, na pasta do projeto:  node jogo/ferramentas/medir-tanque.mjs [posições do posto, ex.: hoje,0.65,0.75]

import { DEFAULT_PARAMS } from '../src/config/params.js';
import { LEVELS, CHALLENGES } from '../src/content/worlds.js';
import { effectiveParams } from '../src/content/modifiers.js';
import { generateLevel } from '../src/core/generator.js';
import { expertPlans } from '../src/core/autopilot.js';

// Melhores corridas sem abastecer medidas no playtest de 02/10/2026 (documento 09), em segundos de propulsor
const HUMANS = { 'w1-3': 22.6, practice: 25.1 };
// "hoje" é o cenário da fase como está (posto no meio da fase); um número é a fração do caminho
const positions = (process.argv[2] || 'hoje,0.75').split(',').map((x) => (x === 'hoje' ? null : Number(x)));
const pct = (a, b) => `${Math.round((a / b) * 100)}%`;
const f = (x) => x.toFixed(1).padStart(5);
const label = (at) => (at == null ? 'hoje' : `${Math.round(at * 100)}%`);

console.log('\nTANQUE DAS FASES COM POSTO · piloto expert (segundos de propulsor)\n');
console.log('Fase       Posto  Sem abastecer  Melhor humano  1 abastecimento  2 abastecimentos  Janela (1 abast. → sem abastecer)');
for (const def of [...LEVELS, ...CHALLENGES].filter((d) => d.generator.fuelStation && d.seed != null)) {
  for (const at of positions) {
    const variant = at == null ? def : { ...def, generator: { ...def.generator, fuelAt: at } };
    const level = generateLevel(variant, def.seed, null);   // só o cenário, com o posto na posição pedida
    const plans = expertPlans(level, effectiveParams({ ...DEFAULT_PARAMS }, def));
    if (!plans) { console.log(`${def.key.padEnd(10)} ${label(at).padEnd(6)} o piloto não concluiu`); continue; }
    const human = HUMANS[def.key];
    console.log(`${def.key.padEnd(10)} ${label(at).padEnd(6)} ${f(plans.full)}          ${human ? f(human) : '    —'}          ${f(plans.oneTank)} (${pct(plans.oneTank, plans.full)})     ${f(plans.twoTank)} (${pct(plans.twoTank, plans.full)})      ${f(plans.oneTank)} a ${f(plans.full)}: sobra ${pct(plans.full - plans.oneTank, plans.oneTank)}`);
  }
}
console.log('\nSobra: quanto o tanque pode ser maior que o plano com 1 abastecimento antes de deixar alguém terminar sem abastecer.');
console.log('"hoje" é a fase como está, com o posto no meio. Mudar o posto de lugar também muda onde as pedras caem.\n');
