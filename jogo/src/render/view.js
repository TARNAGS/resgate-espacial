import { WORLD_H } from '../core/constants.js';

// Tamanho da tela e áreas seguras (entalhe e barra do iPhone). Com zoom 1, a tela mostra a altura
// inteira do mundo; a largura visível depende do aparelho. A fase aparece na faixa `play`,
// que hoje é a tela toda.

// Zoom da câmera (#95, D-037). Automático: 1,15 nas telas compridas (a maioria dos celulares) e menos, até 1, nas
// mais quadradas (iPhone SE, iPad), para todo aparelho ver quase o mesmo trecho da fase à frente. O zoom muda a
// dificuldade (quanto se vê à frente), então o jogador só pode aproximar nas configurações (cameraNear), nunca
// afastar. O painel de ajuste e o ?zoom= fixam um valor de teste (cameraZoomFixed, de 1 a 1,6), e a corrida sai do ranking.
export const ZOOM_MAX = 1.15;
export const CAMERA_NEAR = [1, 1.1, 1.2];                   // AUTO, CLOSE, CLOSER nas configurações
const AHEAD = 1129;   // unidades de fase à frente que um iPhone 14 deitado (844 × 390) vê com 1,15

export function cameraZoomFor(view, params) {
  if (params.cameraZoomFixed > 0) return params.cameraZoomFixed;
  const auto = Math.min(ZOOM_MAX, Math.max(1, (view.play.w * WORLD_H) / (view.cssH * AHEAD)));
  return auto * (CAMERA_NEAR[params.cameraNear] ?? 1);
}

export function createView(canvas, probe) {
  const view = {
    dpr: 1, cssW: 0, cssH: 0, scale: 1, viewW: 0,
    play: { x: 0, w: 0 },
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
      view.play = { x: 0, w: view.cssW };
      view.viewW = view.play.w / view.scale;
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
