// Junta teclado e direcional numa intenção só, que é o que a física entende (core/ship.js).
// Se as duas formas forem usadas ao mesmo tempo, o giro do teclado tem prioridade.

export function readIntent(keys, joy, params) {
  let turn = 0;
  if (keys.left) turn -= 1;
  if (keys.right) turn += 1;
  let targetAngle = null;
  if (joy) {
    const dx = joy.x - joy.cx, dy = joy.y - joy.cy;
    if (Math.hypot(dx, dy) > params.joystickDeadzone) targetAngle = Math.atan2(dx, -dy);
  }
  return { turn, targetAngle, thrust: keys.thrust || Boolean(joy) };
}
