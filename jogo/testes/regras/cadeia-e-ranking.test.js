// Cadeia de parâmetros em camadas e chave do ranking que se monta sozinha (#120; D-034 e D-035)

import { test, assert, DEFAULT_PARAMS, VIEW_ONLY, LEVELS, CHALLENGES, effectiveParams, rankKey } from '../lib.js';
import { PARAM_KIND } from '../../src/config/params.js';
import { PARAM_LAYERS } from '../../src/content/modifiers.js';
import { rankedParams, rankBaseline } from '../../src/core/ranking.js';

// As chaves do ranking em 07/10/2026, as mesmas do banco online: nenhuma mudança da #120 pode recomeçar um ranking
const KEYS_TODAY = { 'w1-1': 'w1-1_1ariu3i', 'w1-2': 'w1-2_1wyelcg', 'w1-3': 'w1-3_a8xzz6', practice: 'practice_3nezo', bonus: 'bonus_1vf02kv' };
const level = LEVELS[1];
const keyWith = (changes = {}, extras = {}, def = level) => rankKey(def, { ...DEFAULT_PARAMS, ...changes }, extras);

test('#120 cadeia de parâmetros: camadas com nome, sempre na mesma ordem (a de depois vale por cima)', () => {
  assert.deepEqual(PARAM_LAYERS, ['nave', 'evoluções', 'mundo e fase', 'modo']);
  const heavy = (extraGravity) => [{ type: 'heavyCrew', extraGravity }];   // modificador que troca o valor
  const def = { ...level, modifiers: heavy(20) };
  const gameShip = { key: 'tank', changesGameplay: true, modifiers: heavy(10) };
  assert.equal(effectiveParams(DEFAULT_PARAMS, def, null, { ship: gameShip }).crewWeight, 20, 'a fase vem depois da nave');
  assert.equal(effectiveParams(DEFAULT_PARAMS, def, null, { ship: gameShip, mode: { key: 'nightmare', modifiers: heavy(30) } }).crewWeight, 30, 'o modo vem por último');
  assert.equal(effectiveParams(DEFAULT_PARAMS, level, null, { upgrades: [{ key: 'fuel+', modifiers: [{ type: 'tank', scale: 1.5 }] }] }).tankSeconds, 60, 'evolução de atributos muda o jogo (D-035)');
  const cosmetic = { key: 'red', changesGameplay: false, modifiers: heavy(99) };
  assert.equal(effectiveParams(DEFAULT_PARAMS, level, null, { ship: cosmetic }).crewWeight, 0, 'nave de aparência não muda nada (D-034)');
});

test('#120 cada parâmetro diz o que muda: jogo, aviso ou imagem', () => {
  for (const k of Object.keys(DEFAULT_PARAMS)) {
    assert.ok(['jogo', 'aviso', 'imagem'].includes(PARAM_KIND[k]), `"${k}" precisa ser marcado em PARAM_KIND (config/params.js)`);
  }
  for (const k of VIEW_ONLY) assert.equal(PARAM_KIND[k], 'imagem', `"${k}" está em VIEW_ONLY e precisa ser "imagem"`);
  for (const k of rankedParams()) {
    assert.ok(['gravity', 'thrust', 'maxSpeed', 'landingMaxVy', 'landingMaxVx', 'landingMaxAngle', 'padMargin'].includes(k) || rankBaseline(k) !== undefined,
      `"${k}" passou a contar no ranking: registre o valor de hoje em SINCE (core/ranking.js), para as chaves de hoje não mudarem`);
  }
});

test('#120 chave do ranking: as chaves de hoje continuam as mesmas (nenhum ranking recomeça)', () => {
  for (const def of [...LEVELS, ...CHALLENGES]) assert.equal(rankKey(def, DEFAULT_PARAMS), KEYS_TODAY[def.key], def.key);
});

test('#120 chave do ranking: muda com cada parâmetro de jogo e com modificadores; não muda com aviso nem imagem', () => {
  const today = keyWith();
  for (const [k, kind] of Object.entries(PARAM_KIND)) {
    const v = DEFAULT_PARAMS[k];
    const other = typeof v === 'number' ? v * 1.1 + 1 : typeof v === 'string' ? `${v}x` : !v;
    const changed = keyWith({ [k]: other }) !== today;
    assert.equal(changed, kind === 'jogo', `"${k}" (${kind}): ${changed ? 'mudou' : 'não mudou'} a chave`);
  }
  assert.notEqual(keyWith({}, {}, { ...level, modifiers: [{ type: 'gravity', scale: 1.3 }] }), today, 'modificador na fase muda a chave');
});

test('#120 chave do ranking: aparência nunca muda; nave que muda o jogo, evolução de atributos, modo e versão das regras mudam', () => {
  const today = keyWith();
  assert.equal(keyWith({}, { ship: { key: 'red', changesGameplay: false } }), today, 'nave de aparência (D-034)');
  assert.equal(keyWith({}, { upgrades: [{ key: 'gold-trail' }] }), today, 'evolução só visual (D-035)');
  assert.notEqual(keyWith({}, { ship: { key: 'tank', changesGameplay: true, modifiers: [] } }), today, 'nave que muda o jogo (D-034)');
  assert.notEqual(keyWith({}, { upgrades: [{ key: 'fuel+', modifiers: [{ type: 'tank', scale: 1.5 }] }] }), today, 'evolução de atributos (D-035)');
  assert.notEqual(keyWith({}, { mode: { key: 'nightmare' } }), today, 'modo de jogo (P-018)');
  assert.notEqual(keyWith({}, { rulesVersion: 2 }), today, 'versão das regras');
});
