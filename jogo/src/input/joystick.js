// Direcional virtual (D-006; Regras do jogo, seção 4.2; #38 e #39).
// Arrastar aponta a ponta da nave para a direção do dedo. Quando o propulsor acende depende do
// esquema do toque (PARAMS.touchScheme, ver input/controls.js).
// Duas variantes de posição, escolhidas em PARAMS.joystickMode, para o teste do M1 comparar (#44):
//   'follow': o direcional aparece onde o polegar tocar, dentro da área da esquerda (joystickArea)
//   'fixed':  o direcional fica fixo no canto inferior esquerdo
// No esquema de dois polegares ('twin'), a metade direita da tela é o botão do propulsor.
// Os controles ficam por cima da fase; a câmera mantém a nave longe deles (render/renderer.js).

export function createJoystick(canvas, { params, view, isActive, onPress, onAnyTouch }) {
  let joy = null;          // dedo que aponta a nave
  let thrustId = null;     // dedo no botão do propulsor (só no esquema 'twin')

  const twin = () => params.touchScheme === 'twin';

  // Centro de um controle num canto de baixo da tela
  function corner(side) {
    const R = params.joystickRadius;
    const y = view.cssH - 24 - view.safe.bottom - R;
    return side === 'left' ? { x: 24 + view.safe.left + R, y } : { x: view.cssW - 24 - view.safe.right - R * 0.9, y };
  }

  const fixedCenter = () => corner('left');

  // Botão do propulsor (esquema 'twin')
  const thrustButton = () => ({ ...corner('right'), r: params.joystickRadius * 0.9 });

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
    if (twin() && p.x >= view.cssW / 2) {
      // Metade direita inteira vale como botão, para o polegar não precisar acertar o desenho
      if (thrustId === null) thrustId = e.pointerId;
    } else {
      if (joy) return;
      let center;
      if (params.joystickMode === 'fixed') {
        const c = fixedCenter();
        if (Math.hypot(p.x - c.x, p.y - c.y) > params.joystickRadius * 1.8) return;
        center = c;
      } else {
        const area = twin() ? Math.min(params.joystickArea, 0.5) : params.joystickArea;
        if (p.x > view.cssW * area) return;
        center = p;
      }
      joy = { id: e.pointerId, cx: center.x, cy: center.y, x: p.x, y: p.y };
    }
    try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* nada */ }
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!joy || e.pointerId !== joy.id) return;
    const p = localPoint(e);
    joy.x = p.x;
    joy.y = p.y;
  });

  const end = (e) => {
    if (joy && e.pointerId === joy.id) joy = null;
    if (e.pointerId === thrustId) thrustId = null;
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  return {
    get state() { return joy; },
    get thrustHeld() { return thrustId !== null; },
    fixedCenter,
    thrustButton,
    reset() { joy = null; thrustId = null; },
  };
}
