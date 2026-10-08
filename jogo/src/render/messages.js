import { clamp } from '../core/math.js';
import { FONT } from './style.js';

// Textos sobre a partida: mensagens no alto da tela, elogios e o NO FUEL perto da nave.

export function createMessages({ ctx, view, r }) {
  // NO FUEL: pisca logo acima da nave enquanto o aviso durar
  function drawNoFuel(s, t) {
    if (r.noFuelT <= 0 || s.state === 'exploding' || Math.sin(t * 12) < -0.2) return;
    const { x: sx, y } = r.toScreen(s.x, s.y);
    const sy = y - 22;
    ctx.font = `700 12px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,93,93,0.95)';
    ctx.fillText('NO FUEL', clamp(sx, 60, view.cssW - 60), clamp(sy, 24, view.cssH - 24));
  }

  function drawPraise() {
    const p = r.praiseText;
    if (!p) return;
    const alpha = clamp(Math.min(p.t / 0.12, (1.3 - p.t) / 0.4), 0, 1) * 0.9;
    const { x: sx, y } = r.toScreen(p.x, p.y);
    const sy = y - 22 - p.t * 18;
    ctx.font = `700 12px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(125,255,176,${alpha.toFixed(2)})`;
    ctx.fillText(p.text, clamp(sx, 60, view.cssW - 60), clamp(sy, 24, view.cssH - 24));
  }

  // Quebra um texto em linhas que caibam na largura
  function wrap(text, width) {
    const lines = [];
    let line = '';
    for (const word of text.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(next).width > width) { lines.push(line); line = word; } else line = next;
    }
    if (line) lines.push(line);
    return lines;
  }

  // Mensagens da partida (#97): numa faixa pequena no alto da tela, entre o painel da esquerda
  // (fase, combustível e seus avisos) e o cronômetro, nunca no meio da fase. No máximo as duas mais
  // novas. Se a nave passar por baixo delas, ficam quase transparentes, para não esconder nada.
  function drawMessages(t, ship, scene) {
    const shown = r.messages.slice(-2).reverse();
    if (!shown.length) return;
    const left = Math.max(view.play.x, view.safe.left) + 16, top = 14 + view.safe.top;
    const timerLeft = Math.min(view.cssW - 22 - 48 * scene.buttons.length - view.safe.right, view.play.x + view.play.w - 14) - 80;
    let x1 = left + 270;                               // depois da barra de combustível e do aviso dela
    if (timerLeft - x1 < 220) x1 = left + 190;         // tela estreita: só depois do nome da fase
    const width = Math.max(140, timerLeft - x1);
    const cx = x1 + width / 2;
    const { x: sx, y: sy } = ship ? r.toScreen(ship.x, ship.y) : { x: -1e9, y: -1e9 };
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    let y = top + 1;
    for (const m of shown) {
      ctx.font = `700 ${m.warn ? 12 : 11}px ${FONT}`;
      const lines = wrap(m.text, width);
      const h = lines.length * 14;
      const under = Math.abs(sx - cx) < width / 2 + 24 && sy > y - 24 && sy < y + h + 24;
      const blink = m.warn && Math.sin(t * 12) < -0.2;
      const alpha = clamp(Math.min(m.t / 0.2, (m.dur - m.t) / 0.4), 0, 1) * (under ? 0.25 : 1);
      if (!blink) {
        ctx.fillStyle = m.warn ? `rgba(255,93,93,${alpha.toFixed(2)})` : `rgba(232,241,255,${(alpha * 0.9).toFixed(2)})`;
        lines.forEach((line, i) => ctx.fillText(line, cx, y + i * 14));
      }
      y += h + 4;
    }
  }

  return { drawMessages, drawPraise, drawNoFuel };
}
