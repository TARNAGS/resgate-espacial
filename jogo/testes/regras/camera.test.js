// Zoom da câmera que se adapta à tela (#95, D-037)

import { test, assert, DEFAULT_PARAMS } from '../lib.js';
import { cameraZoomFor, ZOOM_MAX } from '../../src/render/view.js';
import { WORLD_H } from '../../src/core/constants.js';
import { createFakeView } from '../tela-de-mentira.js';

// Telas deitadas, em px de CSS
const PHONES = {
  'iPhone SE': [667, 375], 'iPhone 13 mini': [812, 375], 'iPhone 14/15': [844, 390],
  'iPhone 15 Pro Max': [932, 430], 'Android 20:9': [800, 360], iPad: [1180, 820],
};
const viewOf = ([w, h]) => createFakeView({ cssW: w, cssH: h });
const zoomOf = (name, params = {}) => cameraZoomFor(viewOf(PHONES[name]), { ...DEFAULT_PARAMS, ...params });
const ahead = (name, params) => { const [w, h] = PHONES[name]; return (w * WORLD_H) / (h * zoomOf(name, params)); };   // unidades à frente

test('D-037 zoom automático: 1,15 nas telas compridas e até 1 nas mais quadradas', () => {
  for (const name of ['iPhone 13 mini', 'iPhone 14/15', 'iPhone 15 Pro Max', 'Android 20:9']) assert.equal(zoomOf(name), ZOOM_MAX, name);
  assert.equal(zoomOf('iPhone SE'), 1);
  assert.equal(zoomOf('iPad'), 1);
  for (const name of Object.keys(PHONES)) assert.ok(zoomOf(name) >= 1 && zoomOf(name) <= ZOOM_MAX, name);
});

test('D-037 zoom automático: todo celular vê quase o mesmo trecho à frente que o iPhone 14 (o iPhone SE, 95%)', () => {
  const ref = ahead('iPhone 14/15');
  for (const name of ['iPhone SE', 'iPhone 13 mini', 'iPhone 15 Pro Max', 'Android 20:9']) {
    assert.ok(ahead(name) >= ref * 0.94, `${name}: vê ${Math.round((ahead(name) / ref) * 100)}% do trecho`);
  }
});

test('D-037 configurações: CLOSE e CLOSER só aproximam, nunca mostram mais da fase; o zoom de teste fixa o valor', () => {
  for (const name of Object.keys(PHONES)) {
    assert.ok(zoomOf(name, { cameraNear: 1 }) > zoomOf(name) && zoomOf(name, { cameraNear: 2 }) > zoomOf(name, { cameraNear: 1 }), name);
  }
  assert.equal(zoomOf('iPhone SE', { cameraZoomFixed: 1.3 }), 1.3);
  assert.equal(zoomOf('iPhone 14/15', { cameraZoomFixed: 1, cameraNear: 2 }), 1, 'o zoom de teste vale por cima da escolha do jogador');
});
