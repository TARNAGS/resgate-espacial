// Tela de mentira (#113): um canvas que aceita qualquer comando de desenho e anota o que recebeu, para testar o
// desenho no Node, sem navegador. As anotações também servem para comparar o desenho antes e depois de uma
// mudança (#121, #123 e #124).

import { WORLD_H } from '../src/core/constants.js';

export function createFakeCanvas({ width = 844, height = 390 } = {}) {
  const calls = [];
  const props = {};
  const gradient = { addColorStop: () => {} };
  const ctx = new Proxy(props, {
    get(target, name) {
      if (name in target) return target[name];
      if (name === 'measureText') return (text) => ({ width: String(text).length * 8 });
      return (...args) => {
        calls.push([name, args]);
        if (name === 'createLinearGradient' || name === 'createRadialGradient' || name === 'createPattern') return gradient;
        return undefined;
      };
    },
    set(target, name, value) {
      target[name] = value;
      calls.push([name, value]);
      return true;
    },
  });
  return { canvas: { width, height, style: {}, getContext: () => ctx }, ctx, calls };
}

// O mesmo formato de render/view.js, com o tamanho de um iPhone deitado
export function createFakeView({ cssW = 844, cssH = 390, isTouch = true } = {}) {
  const scale = cssH / WORLD_H;
  return {
    dpr: 1, cssW, cssH, scale, viewW: cssW / scale,
    play: { x: 0, w: cssW },
    safe: { top: 0, right: 0, bottom: 0, left: 0 },
    isTouch, portrait: false,
  };
}

// O direcional, só com o que o desenho pergunta a ele
export const fakeJoystick = {
  thrustButton: () => ({ x: 780, y: 320, r: 50 }),
  fixedCenter: () => ({ x: 90, y: 320 }),
};

// Cópia profunda que mantém as funções (a fase gerada tem algumas) e as referências repetidas
// (a nave pousada aponta para uma das plataformas da fase)
export function deepCopy(obj, seen = new Map()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (seen.has(obj)) return seen.get(obj);
  const out = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  seen.set(obj, out);
  for (const [key, value] of Object.entries(obj)) out[key] = deepCopy(value, seen);
  return out;
}

// Congela um objeto e tudo o que está dentro dele: qualquer tentativa de escrever vira erro
export function deepFreeze(obj, seen = new Set()) {
  if (obj === null || typeof obj !== 'object' || seen.has(obj)) return obj;
  seen.add(obj);
  for (const value of Object.values(obj)) deepFreeze(value, seen);
  return Object.freeze(obj);
}
