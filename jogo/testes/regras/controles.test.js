// Controles

import { test, assert, PARAMS, DEFAULT_PARAMS, steer, readIntent, touchThrust, DT, p, airShip } from '../lib.js';

test('#37 setas giram para a esquerda e para a direita enquanto pressionadas', () => {
  const left = readIntent({ left: true, right: false, thrust: false }, null, PARAMS);
  const right = readIntent({ left: false, right: true, thrust: false }, null, PARAMS);
  assert.equal(left.turn, -1); assert.equal(right.turn, 1);
  const s = airShip(); steer(s, left, p(), 0.25);
  assert.ok(s.a < 0);
});

test('#37 ↑ e ← ao mesmo tempo: gira e acelera ao mesmo tempo', () => {
  const i = readIntent({ left: true, right: false, thrust: true }, null, PARAMS);
  assert.equal(i.turn, -1); assert.equal(i.thrust, true);
});

test('#38 controle B (um polegar): tocar acende o propulsor; arrastar aponta a nave', () => {
  PARAMS.touchScheme = 'hold';
  const touching = readIntent({}, { cx: 100, cy: 100, x: 100, y: 100 }, PARAMS);
  assert.equal(touching.thrust, true); assert.equal(touching.targetAngle, null);
  const right = readIntent({}, { cx: 100, cy: 100, x: 160, y: 100 }, PARAMS);
  assert.ok(Math.abs(right.targetAngle - Math.PI / 2) < 1e-9);
  const s = airShip();
  for (let t = 0; t < 1; t += DT) steer(s, right, p(), DT);
  assert.ok(Math.abs(s.a - Math.PI / 2) < 1e-6);
});

test('#38 a velocidade de giro até o dedo é um parâmetro de ajuste', () => {
  const right = readIntent({}, { cx: 0, cy: 0, x: 60, y: 0 }, PARAMS);
  const a = airShip(); steer(a, right, p(), 0.05);
  PARAMS.touchRotationSpeed = DEFAULT_PARAMS.touchRotationSpeed / 2;
  const b = airShip(); steer(b, right, p(), 0.05);
  assert.ok(Math.abs(b.a * 2 - a.a) < 1e-9);
});

test('D-022 controle A (dois polegares) é o padrão: o esquerdo só aponta; o direito acende o propulsor', () => {
  assert.equal(DEFAULT_PARAMS.touchScheme, 'twin');
  const aimOnly = readIntent({}, { cx: 0, cy: 0, x: 60, y: 0 }, PARAMS, false);
  const both = readIntent({}, { cx: 0, cy: 0, x: 60, y: 0 }, PARAMS, true);
  assert.equal(aimOnly.thrust, false); assert.ok(aimOnly.targetAngle !== null);
  assert.equal(both.thrust, true);
  assert.equal(touchThrust(PARAMS, null, true), true);
});

test('D-022 controle B (opção): encostar já acelera', () => {
  PARAMS.touchScheme = 'hold';
  assert.equal(touchThrust(PARAMS, { cx: 0, cy: 0, x: 0, y: 0 }), true);
  assert.equal(touchThrust(PARAMS, null, true), false);
});
