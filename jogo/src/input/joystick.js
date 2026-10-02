// Direcional virtual (D-006; Regras do jogo, seção 4.2; #38 e #39).
// Tocar aciona o propulsor; arrastar aponta a ponta da nave para a direção do dedo.
// Duas variantes, escolhidas em PARAMS.joystickMode, para o teste do M1 comparar (#44):
//   'follow': o direcional aparece onde o polegar tocar, dentro da área da esquerda (joystickArea)
//   'fixed':  o direcional fica fixo no canto inferior esquerdo

export function createJoystick(canvas, { params, view, isActive, onPress, onAnyTouch }) {
  let joy = null;

  const fixedCenter = () => ({
    x: 24 + view.safe.left + params.joystickRadius,
    y: view.cssH - 24 - view.safe.bottom - params.joystickRadius,
  });

  function localPoint(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  canvas.addEventListener('pointerdown', (e) => {
    onAnyTouch?.();
    if (!isActive()) return;
    e.preventDefault();
    const p = localPoint(e);
    if (onPress?.(p)) return;   // o toque foi num botão da tela (pausa, ajuste)
    if (joy) return;
    let center;
    if (params.joystickMode === 'fixed') {
      const c = fixedCenter();
      if (Math.hypot(p.x - c.x, p.y - c.y) > params.joystickRadius * 1.8) return;
      center = c;
    } else {
      if (p.x > view.cssW * params.joystickArea) return;
      center = p;
    }
    joy = { id: e.pointerId, cx: center.x, cy: center.y, x: p.x, y: p.y };
    try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* nada */ }
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!joy || e.pointerId !== joy.id) return;
    const p = localPoint(e);
    joy.x = p.x;
    joy.y = p.y;
  });

  const end = (e) => { if (joy && e.pointerId === joy.id) joy = null; };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  return {
    get state() { return joy; },
    fixedCenter,
    reset() { joy = null; },
  };
}
