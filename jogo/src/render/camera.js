import { WORLD_H } from '../core/constants.js';
import { clamp } from '../core/math.js';

// Câmera: escala, o que cabe na tela e para onde ela anda, com os polegares e as pontas da fase em mente.

export function createCamera(r, view) {
  // Escala e tamanho visível do mundo com o zoom da câmera (#95). Com zoom 1, a tela mostra a altura
  // inteira da fase e a câmera só anda para os lados; acima de 1, ela também segue a nave na vertical.
  r.scale = () => view.scale * r.zoom;
  const viewW = () => view.play.w / r.scale();
  const viewH = () => view.cssH / r.scale();
  r.toScreen = (x, y) => ({ x: view.play.x + (x - r.camX) * r.scale(), y: (y - r.camY) * r.scale() });

  // Limites da câmera. Padrão ('thumbs', #50): a câmera pode passar das pontas da fase para que as
  // plataformas das pontas (base e tripulação) fiquem no meio da tela, longe dos polegares. Na opção
  // 'stage' (#96), ela para nas pontas da fase, e os controles ficam por cima dela.
  function camLimits(level, params) {
    if (params.cameraMode !== 'thumbs') return [0, Math.max(0, level.L - viewW())];
    const centers = level.pads.map((p) => (p.x1 + p.x2) / 2);
    const lo = Math.min(0, Math.min(...centers) - viewW() / 2);
    const hi = Math.max(level.L - viewW(), Math.max(...centers) - viewW() / 2);
    return [lo, Math.max(lo, hi)];
  }

  const camYTarget = (s) => clamp(s.y - viewH() / 2, 0, Math.max(0, WORLD_H - viewH()));

  const twinControls = (params) => view.isTouch && params.touchScheme === 'twin';

  // No controle A (dois polegares, D-022), os polegares ficam por cima dos cantos de baixo. A nave nunca pode ficar
  // embaixo deles (#44): a câmera a mantém na faixa da tela entre os dois controles, mesmo que
  // para isso precise mostrar um pouco além das pontas da fase.
  function keepShipVisible(s, params) {
    if (!twinControls(params) || params.cameraMode !== 'thumbs') return;
    const R = params.joystickRadius;
    const minX = view.safe.left + 24 + 2 * R + 16;
    const maxX = view.cssW - view.safe.right - 24 - 1.8 * R - 16;
    if (maxX - minX < 40) return;   // tela estreita demais para a regra
    r.camX = clamp(r.camX, s.x - maxX / r.scale(), s.x - minX / r.scale());
  }

  return { viewW, viewH, camLimits, camYTarget, twinControls, keepShipVisible };
}
