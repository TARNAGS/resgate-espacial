// Contrato da fase e do mundo (#117): com 100 fases, um erro de digitação numa fase tem de ser pego aqui, com uma
// mensagem que diz a fase e o campo, e não por um jogador. O contrato também está no documento 12.

import { readFileSync } from 'node:fs';
import { test, assert, readSources } from '../lib.js';
import { WORLDS, CHALLENGES, TRAINING } from '../../src/content/worlds.js';
import { OBSTACLES } from '../../src/content/obstacles/index.js';
import { MODIFIERS } from '../../src/content/modifiers.js';

const PUBLISHED = JSON.parse(readFileSync(new URL('./chaves-publicadas.json', import.meta.url), 'utf8')).fases;
const KEY = /^[a-z0-9-]{1,24}$/;                 // a mesma regra do perfil online para a chave de uma fase
const ENGLISH = /^[\x20-\x7E]+$/;                // textos do jogo em inglês (D-007): sem acentos
const NAME_MAX = 16;                             // cabe no painel: "LEVEL 12 · NAME"
const GOAL_MAX = 70;                             // cabe na faixa de mensagens do alto (#97)

// As cores que o desenho pede ao tema do mundo, tiradas do próprio código (theme.sky, theme.rock...)
function themeColorsUsed(sources) {
  const used = new Set();
  for (const [file, code] of Object.entries(sources)) {
    if (!file.startsWith('render/') && !file.startsWith('content/')) continue;
    for (const [, color] of code.matchAll(/\btheme\.(\w+)/g)) used.add(color);
  }
  return [...used];
}

const isNumber = (v) => typeof v === 'number' && Number.isFinite(v);

function checkLevel(level, where, problems) {
  const say = (field, text) => problems.push(`${where} "${level.key ?? '?'}", campo ${field}: ${text}`);
  if (typeof level.key !== 'string' || !KEY.test(level.key)) say('key', 'só letras minúsculas, números e "-", até 24');
  for (const [field, max] of [['name', NAME_MAX], ['goal', GOAL_MAX]]) {
    const text = level[field];
    if (typeof text !== 'string' || !text) say(field, 'falta o texto');
    else if (!ENGLISH.test(text)) say(field, `"${text}" tem acento ou símbolo: os textos do jogo são em inglês (D-007)`);
    else if (text.length > max) say(field, `${text.length} caracteres, o máximo é ${max}`);
  }
  const g = level.generator;
  if (!g || typeof g !== 'object') { say('generator', 'falta'); return; }
  if (!isNumber(g.length) || g.length <= 0) say('generator.length', 'precisa ser um número maior que zero');
  if (g.kind !== 'training') {
    for (const field of ['minGap', 'roughness']) if (!isNumber(g[field])) say(`generator.${field}`, 'precisa ser um número');
    if (typeof g.fuelStation !== 'boolean') say('generator.fuelStation', 'precisa ser true ou false');
    // Fases fixas (D-021): semente e tanque gravados, para o cenário e o tanque serem iguais em todo aparelho
    if (level.random) {
      if (level.seed != null) say('seed', 'fase sorteada (random) não tem semente fixa');
    } else {
      if (!Number.isInteger(level.seed)) say('seed', 'fase da sequência precisa de semente fixa (D-021)');
      if (!isNumber(g.tank)) say('generator.tank', 'fase fixa precisa do tanque gravado (rode a bateria completa: o teste das fases fixas diz o valor)');
    }
  }
  if (!Array.isArray(g.obstacles)) say('generator.obstacles', 'precisa ser uma lista (pode ser vazia)');
  else for (const o of g.obstacles) {
    if (!OBSTACLES[o.type]) say('generator.obstacles', `tipo "${o.type}" não existe no catálogo (content/obstacles)`);
    if (!isNumber(o.count) || o.count < 0) say('generator.obstacles', `"${o.type}" precisa de count`);
  }
  checkModifiers(level.modifiers, (text) => say('modifiers', text));
}

function checkModifiers(list, say) {
  if (!Array.isArray(list)) { say('precisa ser uma lista (pode ser vazia)'); return; }
  for (const m of list) if (!MODIFIERS[m.type]) say(`tipo "${m.type}" não existe (content/modifiers.js)`);
}

// Devolve a lista de problemas do conteúdo, em português; vazia se estiver tudo certo
function checkContent({ worlds, challenges, training, published, colors }) {
  const problems = [];
  const keys = new Map();
  const all = [
    ...worlds.flatMap((w) => (w.levels || []).map((level) => [level, `fase do mundo "${w.key}"`])),
    ...challenges.map((level) => [level, 'desafio']),
    [training, 'treino'],
  ];
  for (const w of worlds) {
    const say = (field, text) => problems.push(`mundo "${w.key ?? '?'}", campo ${field}: ${text}`);
    if (typeof w.key !== 'string' || !w.key) say('key', 'falta');
    if (typeof w.name !== 'string' || !ENGLISH.test(w.name || '')) say('name', 'falta, ou não está em inglês');
    if (!Array.isArray(w.levels) || !w.levels.length) say('levels', 'o mundo precisa de pelo menos uma fase');
    for (const color of colors) if (typeof w.theme?.[color] === 'undefined') say(`theme.${color}`, 'falta a cor, e o desenho usa');
    checkModifiers(w.modifiers, (text) => say('modifiers', text));
  }
  for (const [level, where] of all) {
    checkLevel(level, where, problems);
    if (keys.has(level.key)) problems.push(`${where} "${level.key}", campo key: repetida (também em ${keys.get(level.key)})`);
    keys.set(level.key, where);
  }
  for (const key of published) {
    if (!keys.has(key)) problems.push(`fase publicada "${key}" sumiu: a chave é o progresso salvo dos jogadores e nunca muda (chaves-publicadas.json)`);
  }
  return problems;
}

const real = () => ({ worlds: WORLDS, challenges: CHALLENGES, training: TRAINING, published: PUBLISHED, colors: themeColorsUsed(readSources()) });

test('#117 contrato da fase e do mundo: todos os mundos, fases, desafios e o treino estão completos', () => {
  const content = real();
  assert.ok(content.colors.length >= 5, `achou poucas cores do tema no código (${content.colors.join(', ')})`);
  const problems = checkContent(content);
  assert.equal(problems.length, 0, `\n${problems.join('\n')}`);
});

test('#117 contrato da fase: o alarme aponta a fase e o campo de cada erro', () => {
  const content = real();
  const world = structuredClone({ ...WORLDS[0], levels: WORLDS[0].levels.map(({ world, ...l }) => l) });
  const [first, second, third] = world.levels;
  first.generator.obstacles = [{ type: 'rok', count: 3 }];      // obstáculo com o nome errado
  second.key = 'w1-1';                                           // chave repetida (e a w1-2 publicada some)
  delete third.seed;                                             // fase fixa sem semente
  first.goal = 'Pouse na plataforma e volte à base';             // texto em português (a regra reconhece pelos acentos)
  delete world.theme.terrainGlow;                                // cor que o desenho usa
  world.modifiers = [{ type: 'gravidade', scale: 2 }];           // modificador que não existe
  const problems = checkContent({ ...content, worlds: [world] });
  const expect = [
    /fase do mundo "w1" "w1-1", campo generator\.obstacles: tipo "rok"/,
    /"w1-1", campo key: repetida/,
    /"w1-3", campo seed: fase da sequência precisa de semente fixa/,
    /"w1-1", campo goal: .*inglês/,
    /mundo "w1", campo theme\.terrainGlow/,
    /mundo "w1", campo modifiers: tipo "gravidade"/,
    /fase publicada "w1-2" sumiu/,
  ];
  for (const re of expect) assert.ok(problems.some((p) => re.test(p)), `faltou o aviso ${re}\n${problems.join('\n')}`);
});
