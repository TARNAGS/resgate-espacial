import { WORLD_H } from '../core/constants.js';

// Tamanho da tela e áreas seguras (entalhe e barra do iPhone). A tela sempre mostra a altura
// inteira do mundo; a largura visível depende do aparelho.
//
// A fase aparece na faixa `play`. Normalmente ela ocupa a tela toda. No controle de dois polegares
// (C, #44), cada lado ganha uma coluna de controle, e a fase fica no meio, sem polegar em cima (#50).

export function createView(canvas, probe) {
  const view = {
    dpr: 1, cssW: 0, cssH: 0, scale: 1, viewW: 0,
    play: { x: 0, w: 0 },
    safe: { top: 0, right: 0, bottom: 0, left: 0 },
    isTouch: window.matchMedia('(pointer: coarse)').matches,
    params: null,
    resize() {
      view.dpr = Math.min(2, window.devicePixelRatio || 1);
      view.cssW = window.innerWidth;
      view.cssH = window.innerHeight;
      canvas.width = Math.round(view.cssW * view.dpr);
      canvas.height = Math.round(view.cssH * view.dpr);
      canvas.style.width = `${view.cssW}px`;
      canvas.style.height = `${view.cssH}px`;
      view.scale = view.cssH / WORLD_H;
      const cs = getComputedStyle(probe);
      view.safe = {
        top: parseFloat(cs.paddingTop) || 0,
        right: parseFloat(cs.paddingRight) || 0,
        bottom: parseFloat(cs.paddingBottom) || 0,
        left: parseFloat(cs.paddingLeft) || 0,
      };
      if (view.params) view.layout(view.params);
    },
    // Recalcula a faixa da fase conforme o controle escolhido
    layout(params) {
      view.params = params;
      const twin = view.isTouch && params.touchScheme === 'twin';
      // Largura de cada coluna: o botão do polegar e uma folga, somados à área segura daquele lado
      const panel = Math.round(params.joystickRadius * 1.8 + 24);
      const left = twin ? view.safe.left + panel : 0;
      const right = twin ? view.safe.right + panel : 0;
      view.play = { x: left, w: view.cssW - left - right };
      view.viewW = view.play.w / view.scale;
    },
    get sidePanels() { return view.play.x > 0; },
    get portrait() { return view.isTouch && view.cssH > view.cssW; },
  };
  return view;
}
