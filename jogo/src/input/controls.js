// Junta teclado e toque numa intenção só, que é o que a física entende (core/ship.js).
// Se as duas formas forem usadas ao mesmo tempo, o giro do teclado tem prioridade.

// Quando o toque aciona o propulsor, conforme o esquema escolhido (PARAMS.touchScheme, #44)
export function touchThrust(params, joy, thrustHeld = false) {
  if (params.touchScheme === 'twin') return thrustHeld;
  return Boolean(joy);   // 'hold': encostar o dedo já acelera
}

export function readIntent(keys, joy, params, thrustHeld = false) {
  let turn = 0;
  if (keys.left) turn -= 1;
  if (keys.right) turn += 1;
  let targetAngle = null;
  if (joy) {
    const dx = joy.x - joy.cx, dy = joy.y - joy.cy;
    if (Math.hypot(dx, dy) > params.joystickDeadzone) targetAngle = Math.atan2(dx, -dy);
  }
  return { turn, targetAngle, thrust: Boolean(keys.thrust) || touchThrust(params, joy, thrustHeld) };
}

// Textos de ajuda de cada esquema (em inglês, D-007)
export const TOUCH_HINTS = {
  hold: 'TOUCH AND HOLD TO THRUST · DRAG TO STEER',
  twin: 'LEFT THUMB: AIM · RIGHT THUMB: THRUST',
};

export const SCHEME_NAMES = { hold: 'A', twin: 'C' };
