import { FONT } from './style.js';

// Controles na tela: direcional, botão do propulsor, botões redondos (pausa e T) e o selo da DEMO.

export function createControls({ ctx, view, r }) {
  // DEMO (#104): selo "DEMO" o tempo todo, o rótulo da vez no alto e, sem o controle de dois polegares, as teclas
  // acendendo junto com o piloto: o ↑ com a chama e, no teclado, o ← e o → quando a nave gira (D-038)
  function drawDemo({ label, thrust, turn = 0, twin }, t) {
    const top = 14 + view.safe.top;
    const right = view.cssW - 16 - view.safe.right;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'right';
    ctx.font = `700 13px ${FONT}`;
    ctx.fillStyle = Math.sin(t * 4) > -0.6 ? 'rgba(255,209,102,0.95)' : 'rgba(255,209,102,0.55)';
    ctx.fillText('● DEMO', right - 104, top + 8);   // à esquerda do botão SKIP
    // O rótulo do gesto, maior e sobre um fundo escuro, para ser lido sem esforço
    ctx.textAlign = 'center';
    ctx.font = `700 16px ${FONT}`;
    const cx = view.play.x + view.play.w / 2, w = ctx.measureText(label).width + 28;
    ctx.fillStyle = 'rgba(5,8,16,0.8)';
    ctx.fillRect(cx - w / 2, top + 24, w, 28);
    ctx.fillStyle = 'rgba(232,241,255,0.97)';
    ctx.fillText(label, cx, top + 30);
    if (twin) return;
    const y = view.cssH - 46 - view.safe.bottom;
    const keys = view.isTouch ? [['↑', thrust]] : [['←', turn < 0], ['↑', thrust], ['→', turn > 0]];
    keys.forEach(([glyph, lit], i) => drawGhostKey(right - 30 - (keys.length - 1 - i) * 52, y, glyph, lit));
  }

  function drawGhostKey(x, y, glyph, lit) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = lit ? 'rgba(255,159,67,0.95)' : 'rgba(255,159,67,0.4)';
    ctx.fillStyle = lit ? 'rgba(255,159,67,0.3)' : 'rgba(255,159,67,0.05)';
    ctx.beginPath();
    ctx.rect(x - 22, y - 22, 44, 44);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = lit ? 'rgba(255,209,102,1)' : 'rgba(255,209,102,0.5)';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = `700 20px ${FONT}`;
    ctx.fillText(glyph, x, y);
  }

  // Direcional e, no esquema de dois polegares, o botão do propulsor (#44)
  // Os controles ficam por cima da fase (#96). Se a nave passar por baixo de um deles, ele fica
  // transparente, para a nave nunca sumir embaixo do polegar.
  function overShip(match, x, y, radius) {
    const s = match?.state.ship;
    if (!s || s.state === 'exploding') return false;
    const p = r.toScreen(s.x, s.y);
    return Math.hypot(p.x - x, p.y - y) < radius + 28;
  }

  function drawJoystick({ joy, joystick, params, idle, thrustHeld, match }) {
    const R = params.joystickRadius;
    const twin = view.isTouch && params.touchScheme === 'twin';
    if (twin) {
      const b = joystick.thrustButton();
      ctx.save();
      if (overShip(match, b.x, b.y, b.r)) ctx.globalAlpha = 0.3;
      drawThrustButton(b, thrustHeld);
      ctx.restore();
    }
    const c = joy ? { x: joy.cx, y: joy.cy } : joystick?.fixedCenter();
    ctx.save();
    if (c && overShip(match, c.x, c.y, R)) ctx.globalAlpha = 0.3;
    drawStick(joy, joystick, params, idle, twin, R);
    ctx.restore();
  }

  function drawStick(joy, joystick, params, idle, twin, R) {
    if (!joy) {
      if (!view.isTouch || !(idle || twin)) return;
      // Dica discreta de onde o direcional aparece; nas colunas do C, do mesmo tamanho do botão
      const c = joystick.fixedCenter();
      ctx.strokeStyle = params.joystickMode === 'fixed' || twin ? 'rgba(255,93,93,0.45)' : 'rgba(255,93,93,0.25)';
      ctx.lineWidth = twin ? 3 : 2;
      ctx.beginPath();
      ctx.arc(c.x, c.y, twin ? R * 0.9 : R, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }
    let dx = joy.x - joy.cx, dy = joy.y - joy.cy;
    const d = Math.hypot(dx, dy);
    if (d > R) { dx *= R / d; dy *= R / d; }   // a bola acompanha o dedo até a borda do anel
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(255,93,93,0.9)';
    ctx.beginPath();
    ctx.arc(joy.cx, joy.cy, R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(232,241,255,0.85)';
    ctx.beginPath();
    ctx.arc(joy.cx + dx, joy.cy + dy, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawThrustButton(b, pressed) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = pressed ? 'rgba(255,159,67,0.95)' : 'rgba(255,159,67,0.4)';
    ctx.fillStyle = pressed ? 'rgba(255,159,67,0.25)' : 'rgba(255,159,67,0.06)';
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Chama estilizada no meio do botão
    const k = b.r / 50;
    ctx.fillStyle = pressed ? 'rgba(255,209,102,0.95)' : 'rgba(255,209,102,0.45)';
    ctx.beginPath();
    ctx.moveTo(b.x, b.y - 18 * k);
    ctx.quadraticCurveTo(b.x + 13 * k, b.y + 2 * k, b.x, b.y + 16 * k);
    ctx.quadraticCurveTo(b.x - 13 * k, b.y + 2 * k, b.x, b.y - 18 * k);
    ctx.fill();
  }

  function drawButtons({ buttons }) {
    for (const b of buttons) {
      ctx.strokeStyle = 'rgba(232,241,255,0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(232,241,255,0.9)';
      if (b.id === 'pause') {
        ctx.fillRect(b.x - 6, b.y - 7, 4, 14);
        ctx.fillRect(b.x + 2, b.y - 7, 4, 14);
      } else {
        ctx.font = `700 13px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.label, b.x, b.y + 1);
      }
    }
  }

  return { drawJoystick, drawButtons, drawDemo };
}
