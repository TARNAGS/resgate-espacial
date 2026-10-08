// Contrato dos eventos da partida (#116).
// A lista fica em core/events.js. Nos testes, o canal de eventos é estrito (lib.js): toda partida dos testes,
// inclusive as fichas de ouro, confere o nome e os campos de cada evento avisado. Aqui, a leitura do código
// confere quem avisa e quem escuta, inclusive o main.js e o som, que não rodam nos testes.

import { test, assert, readSources } from '../lib.js';
import { EVENTS, checkEvent } from '../../src/core/events.js';

const semComentarios = (codigo) => codigo.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

// { emit: { nome: ['arquivo', ...] }, on: { ... } }
function usosDosEventos(arquivos) {
  const usos = { emit: {}, on: {} };
  for (const [arquivo, codigo] of Object.entries(arquivos)) {
    if (arquivo === 'core/events.js') continue;
    for (const [, tipo, nome] of semComentarios(codigo).matchAll(/\bevents\.(emit|on)\(\s*'([^']+)'/g)) {
      if (nome !== '*') (usos[tipo][nome] ??= []).push(arquivo);
    }
  }
  return usos;
}

test('#116 eventos: quem avisa e quem escuta usa só eventos do contrato, e todo evento do contrato é avisado', () => {
  const usos = usosDosEventos(readSources());
  const problemas = [];
  for (const tipo of ['emit', 'on']) {
    for (const [nome, arquivos] of Object.entries(usos[tipo])) {
      if (!EVENTS[nome]) problemas.push(`${arquivos.join(', ')} ${tipo === 'emit' ? 'avisa' : 'escuta'} "${nome}", que não está no contrato (core/events.js)`);
    }
  }
  for (const nome of Object.keys(EVENTS)) if (!usos.emit[nome]) problemas.push(`"${nome}" está no contrato, mas ninguém avisa`);
  assert.equal(problemas.length, 0, `\n${problemas.join('\n')}`);
  assert.ok(Object.keys(usos.on).length >= 10, 'a leitura do código não achou quem escuta os eventos');
});

test('#116 eventos: o alarme funciona (evento fora do contrato, campo faltando ou sobrando)', () => {
  assert.doesNotThrow(() => checkEvent('refuel', { pad: 'fuel' }));
  assert.throws(() => checkEvent('refueled', { pad: 'fuel' }), /não está no contrato/);
  assert.throws(() => checkEvent('crash', { reason: 'HIT THE WALL' }), /promete/);
  assert.throws(() => checkEvent('refuel', { pad: 'fuel', amount: 1 }), /promete/);
  const usos = usosDosEventos({ 'ui/hud.js': "events.on('landed', () => {});" });
  assert.deepEqual(Object.keys(usos.on), ['landed']);
  assert.equal(EVENTS.landed, undefined, 'um nome errado ("landed" em vez de "land") seria apontado');
});
