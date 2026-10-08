// Parâmetros e modificadores

import { test, assert, PARAMS, DEFAULT_PARAMS, VIEW_ONLY, setParams, resetParams, changedParams, LEVELS, effectiveParams, NONE, airShip, run } from '../lib.js';

test('#44 um controle removido e ainda salvo no aparelho volta para o padrão', () => {
  setParams({ touchScheme: 'aim' });
  assert.equal(PARAMS.touchScheme, 'twin');
  setParams({ touchScheme: 'hold' });
  assert.equal(PARAMS.touchScheme, 'hold');
});

test('#36 mudar um parâmetro muda o jogo sem outra alteração', () => {
  setParams({ thrust: 200, bogus: 1, gravity: 'x' });
  assert.equal(effectiveParams(PARAMS, LEVELS[0]).thrust, 200);
  assert.deepEqual(changedParams(), { thrust: 200 });
});

test('modificadores alteram a física e tipos desconhecidos dão erro', () => {
  const def = { ...LEVELS[0], modifiers: [{ type: 'gravity', scale: 0.5 }, { type: 'wind', force: 10 }, { type: 'tank', scale: 2 }] };
  const e = effectiveParams(PARAMS, def);
  assert.equal(e.gravity, PARAMS.gravity / 2); assert.equal(e.windX, 10); assert.equal(e.tankSeconds, 80);
  assert.throws(() => effectiveParams(PARAMS, { ...def, modifiers: [{ type: 'nope' }] }));
  const s = airShip(); run(s, NONE, 1, e);
  assert.ok(s.vx > 0);
});

test('#95 #96 D-037 câmera: aproximar nas configurações e o modo não tiram do ranking; o zoom fixo de teste tira', () => {
  setParams({ cameraNear: 2, cameraMode: 'stage' });
  assert.equal(PARAMS.cameraNear, 2); assert.equal(PARAMS.cameraMode, 'stage');
  setParams({ cameraMode: 'zoomzoom' });
  assert.equal(PARAMS.cameraMode, 'stage');
  assert.ok(Object.keys(changedParams()).every((k) => VIEW_ONLY.includes(k)), 'aproximar a câmera não deve tirar o tempo do ranking');
  setParams({ cameraZoomFixed: 1 });
  assert.ok(!VIEW_ONLY.includes('cameraZoomFixed') && 'cameraZoomFixed' in changedParams(), 'zoom fixo (ver mais da fase) tira a corrida do ranking');
  assert.equal(DEFAULT_PARAMS.cameraZoomFixed, 0, 'o padrão é o zoom automático');
  assert.equal(DEFAULT_PARAMS.cameraNear, 0); assert.equal(DEFAULT_PARAMS.cameraMode, 'thumbs');
  resetParams();
});
