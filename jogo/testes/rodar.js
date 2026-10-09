// Testes automáticos do jogo, sem navegador. Cada arquivo cita a história (#) ou a regra que verifica.
//
// Uso, na pasta do projeto:
//   node jogo/testes/rodar.js                    todos: antes de cada commit que mexe no jogo e antes de publicar
//   node jogo/testes/rodar.js --rapido           só os rápidos, a cada mudança (os completos crescem com o número de fases)
//   node jogo/testes/rodar.js --atualizar-ouro   regrava as fichas de ouro, só quando uma regra mudou de propósito (#114)
//   node jogo/testes/rodar.js <texto>            só os testes com esse texto no nome (por exemplo: #94)

import { tasks, resetParams } from './lib.js';

import './regras/fisica.test.js';
import './regras/nave.test.js';
import './regras/controles.test.js';
import './regras/parametros.test.js';
import './regras/partida.test.js';
import './regras/progresso.test.js';
import './regras/elogios.test.js';
import './regras/patch-note.test.js';
import './regras/cadeia-e-ranking.test.js';
import './regras/camera.test.js';
import './regras/treinador.test.js';
import './conteudo/gerador.test.js';
import './conteudo/caminho-provado.test.js';
import './conteudo/piloto-expert.test.js';
import './conteudo/demo-e-fases.test.js';
import './conteudo/contrato-fase.test.js';
import './conteudo/contrato-obstaculo.test.js';
import './conteudo/contrato-nave.test.js';
import './conteudo/contrato-skin.test.js';
import './plataforma/musica.test.js';
import './plataforma/ranking.test.js';
import './plataforma/perfil.test.js';
import './plataforma/telemetria.test.js';
import './plataforma/som.test.js';
import './arquitetura/camadas.test.js';
import './arquitetura/desenho-so-le.test.js';
import './arquitetura/eventos.test.js';
import './ouro/ouro.test.js';
import './ouro/desenho.test.js';

const args = process.argv.slice(2);
const rapido = args.includes('--rapido');
const filtro = args.find((a) => !a.startsWith('--'));

const t0 = performance.now();
const results = [];
let skipped = 0;
for (const [name, fn, completo] of tasks) {
  if ((rapido && completo) || (filtro && !name.includes(filtro))) { skipped += 1; continue; }
  try { resetParams(); await fn(); results.push([true, name]); } catch (e) { results.push([false, name, e]); }
}
const failed = results.filter((r) => !r[0]);
for (const [ok, name, err] of results) {
  console.log(`${ok ? '✓' : '✗'} ${name}`);
  if (!ok) console.log(`    ${err.message.split('\n').join('\n    ')}`);
}
const seconds = ((performance.now() - t0) / 1000).toFixed(1);
const fora = skipped ? ` (${skipped} ${rapido ? 'completos' : 'fora do filtro'} ficaram de fora)` : '';
console.log(`\n${results.length - failed.length} de ${results.length} testes passaram em ${seconds} s${fora}.`);
process.exit(failed.length ? 1 : 0);
