import { WORLD_H } from '../core/constants.js';

// Tamanho da tela e áreas seguras (entalhe e barra do iPhone). A tela sempre mostra a altura
// inteira do mundo; a largura visível depende do aparelho.

export function createView(canvas, probe) {
  const view = {
    dpr: 1, cssW: 0, cssH: 0, scale: 1, viewW: 0,
    safe: { top: 0, right: 0, bottom: 0, left: 0 },
    isTouch: window.matchMedia('(pointer: coarse)').matches,
    resize() {
      view.dpr = Math.min(2, window.devicePixelRatio || 1);
      view.cssW = window.innerWidth;
      view.cssH = window.innerHeight;
      canvas.width = Math.round(view.cssW * view.dpr);
      canvas.height = Math.round(view.cssH * view.dpr);
      canvas.style.width = `${view.cssW}px`;
      canvas.style.height = `${view.cssH}px`;
      view.scale = view.cssH / WORLD_H;
      view.viewW = view.cssW / view.scale;
      const cs = getComputedStyle(probe);
      view.safe = {
        top: parseFloat(cs.paddingTop) || 0,
        right: parseFloat(cs.paddingRight) || 0,
        bottom: parseFloat(cs.paddingBottom) || 0,
        left: parseFloat(cs.paddingLeft) || 0,
      };
    },
    get portrait() { return view.isTouch && view.cssH > view.cssW; },
  };
  return view;
}
