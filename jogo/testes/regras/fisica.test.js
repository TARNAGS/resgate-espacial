// Física da nave

import { test, assert, PARAMS, DEFAULT_PARAMS, fly, DT, NONE, UP, p, airShip, run } from '../lib.js';

test('#32 sem propulsor, a nave cai cada vez mais rápido', () => {
  const s = airShip();
  run(s, NONE, 0.5); const v1 = s.vy;
  run(s, NONE, 0.5); const v2 = s.vy;
  assert.ok(v1 > 0 && v2 > v1);
});

test('#32 a gravidade vem do parâmetro de ajuste', () => {
  const a = airShip(); run(a, NONE, 1);
  PARAMS.gravity = DEFAULT_PARAMS.gravity * 2;
  const b = airShip(); run(b, NONE, 1);
  assert.ok(b.vy > a.vy * 1.9);
});

test('#33 apontando para cima, o propulsor faz a nave subir vencendo a gravidade', () => {
  const s = airShip(); run(s, UP, 1);
  assert.ok(s.vy < 0 && s.y < 300 && s.thrusting);
});

test('#33 inclinada para a direita, vai para cima e para a direita', () => {
  const s = airShip(); s.a = 0.5; run(s, UP, 1);
  assert.ok(s.vx > 0 && s.vy < 0);
});

test('#33 acionando e soltando em sequência, a nave flutua na mesma altura', () => {
  const s = airShip(); s.y = 300;
  for (let t = 0; t < 6; t += DT) fly(s, s.vy > 0 ? UP : NONE, p(), DT);
  assert.ok(Math.abs(s.y - 300) < 15, `y=${s.y.toFixed(1)}`);
});

test('#34 com o propulsor desligado, a nave mantém o embalo para o lado enquanto cai', () => {
  const s = airShip(); s.vx = 80; run(s, NONE, 1);
  assert.ok(Math.abs(s.vx - 80) < 1e-9 && s.vy > 0 && s.x > 70);
});

test('#34 propulsor para o lado oposto desacelera antes de mudar de direção', () => {
  const s = airShip(); s.vx = 80; s.a = -Math.PI / 2;
  const seen = [];
  for (let t = 0; t < 2; t += DT) { fly(s, UP, p(), DT); seen.push(s.vx); }
  const firstNeg = seen.findIndex((v) => v < 0);
  assert.ok(firstNeg > 0 && seen[firstNeg - 1] < 80 && seen[firstNeg - 1] >= 0);
});

test('#33 o combustível acaba e o propulsor para de funcionar', () => {
  const s = airShip(); s.fuel = 0.01; run(s, UP, 1);
  assert.equal(s.fuel, 0); assert.equal(s.thrusting, false);
});
