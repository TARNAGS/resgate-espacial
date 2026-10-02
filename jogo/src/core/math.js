// Utilidades de matemática e geometria, sem dependência do navegador.

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const rad = (d) => (d * Math.PI) / 180;

export function wrapAngle(a) {
  while (a > Math.PI) a -= 2 * Math.PI;
  while (a < -Math.PI) a += 2 * Math.PI;
  return a;
}

export function fmtTime(t) {
  const m = Math.floor(t / 60);
  return `${String(m).padStart(2, '0')}:${(t - m * 60).toFixed(1).padStart(4, '0')}`;
}

// Altura de uma linha de terreno (pontos a cada `step` unidades) na posição x
export function sampleLine(arr, x, step) {
  const f = clamp(x / step, 0, arr.length - 1);
  const i = Math.floor(f);
  return i + 1 < arr.length ? lerp(arr[i], arr[i + 1], f - i) : arr[i];
}

export function pointInPoly(p, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a.y > p.y) !== (b.y > p.y) && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}
