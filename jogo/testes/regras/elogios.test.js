// Elogios (#81)

import { test, assert, PARAMS, TRAINING_LEVEL, effectiveParams, generateLevel, createPraise, createShip, createEvents, DT, p } from '../lib.js';

// Cenário de treino (chão plano, sem pedras) com uma pedra redonda posta à mão
function praiseRig() {
  const level = generateLevel(TRAINING_LEVEL, 1);
  const r = 20;
  const pts = Array.from({ length: 7 }, (_, j) => ({ x: 400 + Math.cos((j / 7) * Math.PI * 2) * r, y: 300 + Math.sin((j / 7) * Math.PI * 2) * r }));
  level.obstacles = [{ type: 'rock', x: 400, y: 300, r, pts, passGap: 0 }];
  const events = createEvents();
  const log = [];
  events.on('praise', (e) => log.push(e.kind));
  return { level, praise: createPraise({ level, events }), log, p: effectiveParams(PARAMS, TRAINING_LEVEL, level) };
}
// Nave passando em linha reta, sem física, na altura y
function passBy(rig, y, speed = 140) {
  const s = { ...createShip(rig.level.pads[0], 1), state: 'flying', x: 250, y, vx: speed, vy: 0, a: Math.PI / 2 };
  for (let t = 0; t < 2; t += DT) { s.x += s.vx * DT; rig.praise.update(s, rig.p, DT); }
}

test('#81 passar raspando numa pedra, rápido, elogia "CLOSE CALL"', () => {
  const rig = praiseRig();
  passBy(rig, 300 - 20 - 7 - 3);       // borda de baixo da nave a ~3 unidades da pedra
  assert.deepEqual(rig.log, ['closeCall']);
});

test('#81 passar longe da pedra, ou devagar, não elogia', () => {
  const far = praiseRig(); passBy(far, 300 - 20 - 7 - 25);
  const slow = praiseRig(); passBy(slow, 300 - 20 - 7 - 3, 30);
  assert.deepEqual(far.log, []); assert.deepEqual(slow.log, []);
});

test('#81 vinha rápido para a parede e freou a tempo: "GREAT SAVE"', () => {
  const rig = praiseRig();
  const s = { ...createShip(rig.level.pads[0], 1), state: 'flying', x: rig.level.L - 90, y: 300, vx: 210, vy: 0, a: -Math.PI / 2 };
  for (let t = 0; t < 1.5; t += DT) {
    s.thrusting = s.vx > -40;
    if (s.thrusting) s.vx -= 600 * DT;   // freada forte para a esquerda
    s.x += s.vx * DT;
    assert.ok(s.x < rig.level.L - 8, 'bateu na parede');
    rig.praise.update(s, rig.p, DT);
  }
  assert.deepEqual(rig.log, ['greatSave']);
});

test('#81 pouso perfeito elogia; pouso comum, não', () => {
  const rig = praiseRig();
  const s = createShip(rig.level.pads[0], 1);
  rig.praise.onLand({ vx: 0, vy: PARAMS.landingMaxVy * 0.6, angle: 0 }, s, rig.p);
  assert.deepEqual(rig.log, []);
  rig.praise.onLand({ vx: 2, vy: 12, angle: 0.02 }, s, rig.p);
  assert.deepEqual(rig.log, ['perfectLanding']);
});

test('#81 elogios são discretos: dois fininhos seguidos dão um elogio só', () => {
  const rig = praiseRig();
  const s = { ...createShip(rig.level.pads[0], 1), state: 'flying', x: 250, y: 300 - 30, vx: 140, vy: 0, a: Math.PI / 2 };
  for (let t = 0; t < 2; t += DT) { s.x += s.vx * DT; rig.praise.update(s, rig.p, DT); }
  rig.praise.onLand({ vx: 0, vy: 5, angle: 0 }, s, rig.p);   // logo depois: ainda no intervalo
  assert.deepEqual(rig.log, ['closeCall']);
});
