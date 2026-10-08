import { WORLD_H, STEP } from '../core/constants.js';
import { OBSTACLES } from '../content/obstacles/index.js';

// Caverna (teto e chão), barreiras nas pontas da fase e obstáculos.

export function createCave({ ctx, r, viewW }) {
  // Altura do terreno no ponto i. Fora da fase (i < 0 ou i >= n), o terreno continua só como
  // cenário, a partir da altura da ponta, com um relevo suave e fixo (sem colisão).
  function terrainAt(arr, i) {
    if (i >= 0 && i < arr.length) return arr[i];
    const edge = i < 0 ? arr[0] : arr[arr.length - 1];
    const k = i < 0 ? -i : i - arr.length + 1;
    const fade = Math.min(1, k / 6);   // começa igual à ponta e ganha relevo aos poucos
    return edge + fade * (16 * Math.sin(k * 0.33) + 9 * Math.sin(k * 0.87 + 1.3));
  }

  function strokeLine(arr, i0, i1, dy) {
    ctx.beginPath();
    for (let i = i0; i <= i1; i++) {
      if (i === i0) ctx.moveTo(i * STEP, terrainAt(arr, i) + dy);
      else ctx.lineTo(i * STEP, terrainAt(arr, i) + dy);
    }
    ctx.stroke();
  }

  function fillTerrain(arr, i0, i1, edgeY) {
    ctx.beginPath();
    ctx.moveTo(i0 * STEP, edgeY);
    for (let i = i0; i <= i1; i++) ctx.lineTo(i * STEP, terrainAt(arr, i));
    ctx.lineTo(i1 * STEP, edgeY);
    ctx.closePath();
    ctx.fill();
  }

  function drawCave(lv, theme, t) {
    const i0 = Math.floor(r.camX / STEP) - 1;
    const i1 = Math.ceil((r.camX + viewW()) / STEP) + 1;
    ctx.fillStyle = theme.terrainFill;
    fillTerrain(lv.ceil, i0, i1, -20);
    fillTerrain(lv.floor, i0, i1, WORLD_H + 20);
    ctx.lineJoin = 'round';
    // Dentro da fase: contorno forte. Fora: o mesmo terreno, apagado, como fundo.
    const inside = [Math.max(0, i0), Math.min(lv.n - 1, i1)];
    const parts = [[i0, Math.min(i1, 0), 0.32], [inside[0], inside[1], 1], [Math.max(i0, lv.n - 1), i1, 0.32]];
    for (const [a, b, alpha] of parts) {
      if (b <= a) continue;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 2;
      ctx.strokeStyle = theme.terrainGlow;
      strokeLine(lv.ceil, a, b, -9);
      strokeLine(lv.floor, a, b, 9);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = theme.terrain;
      strokeLine(lv.ceil, a, b, 0);
      strokeLine(lv.floor, a, b, 0);
    }
    ctx.globalAlpha = 1;
    // Fora da fase, um véu escurece o cenário; na ponta, uma barreira de energia marca o limite
    ctx.fillStyle = 'rgba(3,5,10,0.45)';
    if (r.camX < 0) ctx.fillRect(r.camX - 10, -20, -r.camX + 10, WORLD_H + 40);
    if (r.camX + viewW() > lv.L) ctx.fillRect(lv.L, -20, r.camX + viewW() - lv.L + 10, WORLD_H + 40);
    if (i0 <= 0) drawBarrier(0, lv.ceil[0], lv.floor[0], theme, t);
    if (i1 >= lv.n - 1) drawBarrier(lv.L, lv.ceil[lv.n - 1], lv.floor[lv.n - 1], theme, t);
  }

  // Barreira de energia: linha tracejada que corre devagar, com brilho suave
  function drawBarrier(x, top, bottom, theme, t) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.strokeStyle = theme.terrainGlow;
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
    ctx.strokeStyle = theme.terrain;
    ctx.globalAlpha = 0.55 + 0.25 * Math.sin(t * 2);
    ctx.lineWidth = 1.5;
    ctx.setLineDash([10, 8]);
    ctx.lineDashOffset = -t * 18;
    ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
    ctx.restore();
  }

  function drawObstacles(lv, theme, t) {
    for (const o of lv.obstacles) {
      const kind = OBSTACLES[o.type];
      const b = kind.bounds(o);
      if (b.x2 < r.camX - 10 || b.x1 > r.camX + viewW() + 10) continue;
      kind.draw(ctx, o, theme, t);
    }
  }

  return { drawCave, drawObstacles };
}
