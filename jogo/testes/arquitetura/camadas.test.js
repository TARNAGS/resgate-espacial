// Direção das camadas (#112): as regras nunca conhecem a tela.
// Lê o que cada arquivo de jogo/src importa e confere a tabela de camadas do documento 12. Quem quebrar a regra,
// mesmo sem querer, vê este teste falhar com o arquivo e a regra quebrada.

import { posix } from 'node:path';
import { test, assert, readSources } from '../lib.js';

// Quem pode importar quem. A camada é a primeira pasta dentro de jogo/src; o main.js liga tudo e ninguém o importa.
const PERMITIDO = {
  config: ['config'],
  content: ['content', 'core', 'config'],
  core: ['core', 'content', 'config'],
  render: ['render', 'core', 'content', 'config'],
  input: ['input', 'core', 'config'],
  platform: ['platform', 'core', 'content', 'config'],
  ui: ['ui', 'core', 'content', 'config', 'platform'],
  app: ['app', 'config', 'content', 'core', 'render', 'input', 'platform', 'ui'],   // os fluxos (#125): só o main.js os importa
};
const NOME = {
  config: 'os números de ajuste', content: 'o conteúdo', core: 'as regras', render: 'o desenho',
  input: 'os controles', platform: 'os serviços do aparelho', ui: 'as telas', app: 'os fluxos', main: 'o main.js',
};
// Regras, conteúdo e números rodam também no Node (testes e piloto automático): não podem tocar no navegador
const SEM_NAVEGADOR = ['core', 'content', 'config'];
const NAVEGADOR = /\b(window|document|localStorage|sessionStorage|navigator|requestAnimationFrame|location|fetch)\b/;

const camada = (arquivo) => (arquivo.includes('/') ? arquivo.split('/')[0] : 'main');
const semComentarios = (codigo) => codigo.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

// Recebe { 'core/ship.js': 'código', ... } e devolve a lista de problemas, em português
function verificarCamadas(arquivos) {
  const problemas = [];
  for (const [arquivo, codigo] of Object.entries(arquivos)) {
    const de = camada(arquivo);
    if (de !== 'main' && !PERMITIDO[de]) {
      problemas.push(`${arquivo}: a pasta "${de}" não está na tabela de camadas (documento 12 e este teste)`);
      continue;
    }
    const limpo = semComentarios(codigo);
    // import ... from '...', export ... from '...', import '...' e import('...')
    for (const [, alvo] of limpo.matchAll(/(?:\bfrom|\bimport\(?)\s*['"]([^'"]+)['"]/g)) {
      if (!alvo.startsWith('.')) continue;   // o jogo não usa pacotes de fora
      const destino = posix.normalize(posix.join(posix.dirname(arquivo), alvo));
      const para = camada(destino);
      if (para === 'main') problemas.push(`${arquivo} importa main.js: ninguém importa o main.js, que só liga as peças`);
      else if (de !== 'main' && !PERMITIDO[de].includes(para)) {
        problemas.push(`${arquivo} importa ${destino}: ${NOME[de]} (${de}) não podem conhecer ${NOME[para]} (${para})`);
      }
    }
    const usa = SEM_NAVEGADOR.includes(de) && limpo.match(NAVEGADOR);
    if (usa) problemas.push(`${arquivo} usa "${usa[1]}": ${NOME[de]} (${de}) não tocam no navegador, porque rodam também nos testes e no piloto automático`);
  }
  return problemas;
}

test('#112 camadas: cada parte do jogo só importa o que a tabela permite, e as regras não tocam no navegador', () => {
  const arquivos = readSources();
  assert.ok(Object.keys(arquivos).length > 30, 'não achou os arquivos de jogo/src');
  const problemas = verificarCamadas(arquivos);
  assert.equal(problemas.length, 0, `\n${problemas.join('\n')}`);
});

test('#112 camadas: o alarme funciona (desenho dentro das regras, navegador nas regras, main.js importado, pasta nova)', () => {
  const problemas = verificarCamadas({
    'core/novo.js': "import { createRenderer } from '../render/renderer.js';\nconst largura = window.innerWidth;",
    'render/hud.js': "import { app } from '../main.js';",
    'efeitos/brilho.js': "export const brilho = 1;",
    'ui/menu.js': "import { PARAMS } from '../config/params.js';   // permitido",
    'core/ok.js': "// window aparece só neste comentário\nimport { clamp } from './math.js';",
  });
  assert.equal(problemas.length, 4, problemas.join('\n'));
  assert.match(problemas[0], /as regras \(core\) não podem conhecer o desenho \(render\)/);
  assert.match(problemas[1], /não tocam no navegador/);
  assert.match(problemas[2], /ninguém importa o main\.js/);
  assert.match(problemas[3], /não está na tabela de camadas/);
});
