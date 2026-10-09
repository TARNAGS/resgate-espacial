import { clamp, fmtTime } from '../core/math.js';
import { FONT } from './style.js';

// Painel da partida: fase, combustível e seus avisos, vidas, tripulação, cronômetro, rodapé e a seta do objetivo.
export const LOW_FUEL_FLASH = 1.1;   // segundos do aviso amarelo de combustível baixo (#94)

export function createHud({ ctx, view, r, twinControls }) {
  // Seta na borda da faixa da fase, apontando para o objetivo quando ele está fora da tela.
  // Na fase que ensina (D-038), maior: é o caminho que o jogador novo procura.
  function drawObjectiveArrow(m, t, params, big = false) {
    const target = m.level.pads.find((p) => p.kind === (m.crewOnBoard ? 'base' : 'crew'));
    const sx = r.toScreen((target.x1 + target.x2) / 2, 0).x;
    const playRight = view.play.x + view.play.w;
    if (sx >= view.play.x && sx <= playRight) return;
    const right = sx > playRight;
    const k = big ? 1.7 : 1;
    const x = right ? playRight - 24 * k - view.safe.right : view.play.x + 24 * k + view.safe.left;
    // No controle A (dois polegares), a seta da direita fica acima do botão do propulsor
    const bottom = right && twinControls(params) ? view.cssH - 70 - params.joystickRadius * 1.8 - view.safe.bottom : view.cssH - 50;
    const y = clamp(r.toScreen(0, target.y).y, 110, Math.max(110, bottom));
    const pulse = (0.6 + 0.4 * Math.sin(t * 5)).toFixed(2);
    ctx.fillStyle = m.crewOnBoard ? `rgba(124,196,255,${pulse})` : `rgba(255,159,67,${pulse})`;
    ctx.beginPath();
    if (right) { ctx.moveTo(x + 10 * k, y); ctx.lineTo(x - 6 * k, y - 10 * k); ctx.lineTo(x - 6 * k, y + 10 * k); }
    else { ctx.moveTo(x - 10 * k, y); ctx.lineTo(x + 6 * k, y - 10 * k); ctx.lineTo(x + 6 * k, y + 10 * k); }
    ctx.closePath();
    ctx.fill();
    ctx.font = `700 ${big ? 12 : 10}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(m.crewOnBoard ? 'BASE' : 'SOS', x, y + 14 * k);   // o mesmo nome da plataforma (D-038)
  }

  function drawHUD(m, t, params, scene) {
    const s = m.ship;
    const left = Math.max(view.play.x, view.safe.left) + 16, top = 14 + view.safe.top;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = `700 13px ${FONT}`;
    ctx.fillStyle = '#46e0c8';
    ctx.fillText(m.training ? 'TRAINING' : m.def.challenge ? `CHALLENGE · ${m.def.name}` : `LEVEL ${m.def.number} · ${m.def.name}`, left, top);

    ctx.fillStyle = '#e8f1ff';
    ctx.fillText('FUEL', left, top + 22);
    const bx = left + 52, by = top + 23, bw = 130;
    ctx.strokeStyle = '#e8f1ff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx, by, bw, 11);
    const low = s.fuel < params.lowFuel;
    if (!(low && Math.sin(t * 10) < 0)) {
      ctx.fillStyle = s.fuel > 0.5 ? '#46e0c8' : low ? '#ff5d5d' : '#ffd166';
      ctx.fillRect(bx + 2, by + 2, (bw - 4) * s.fuel, 7);
    }
    drawFuelWarning(s, t, params, bx + bw + 12, by + 6);

    if (!m.training) {
      ctx.fillStyle = '#e8f1ff';
      ctx.fillText('LIVES', left, top + 42);
      for (let i = 0; i < params.lives; i++) {
        const x = bx + 8 + i * 18, y = top + 49;
        ctx.beginPath();
        ctx.moveTo(x, y - 7);
        ctx.lineTo(x + 5, y + 6);
        ctx.lineTo(x, y + 3);
        ctx.lineTo(x - 5, y + 6);
        ctx.closePath();
        ctx.fillStyle = i < m.lives ? '#e8f1ff' : '#2a3348';
        ctx.fill();
      }
      ctx.fillStyle = m.crewOnBoard ? '#7dffb0' : '#ff9f43';
      ctx.fillText(m.crewOnBoard ? 'CREW: ON BOARD' : 'CREW: WAITING', left, top + 62);

      ctx.textAlign = 'right';
      ctx.font = `700 16px ${FONT}`;
      ctx.fillStyle = scene.demo ? 'rgba(0,0,0,0)' : '#e8f1ff';   // na DEMO, o lugar é do selo
      // o cronômetro fica à esquerda dos botões da tela (pausa e, nas sessões de teste, o T)
      ctx.fillText(fmtTime(m.timer), Math.min(view.cssW - 22 - 48 * scene.buttons.length - view.safe.right, view.play.x + view.play.w - 14), top + 6);
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.font = `11px ${FONT}`;
    ctx.fillStyle = 'rgba(127,140,163,0.85)';
    let foot = m.training ? 'crash freely · land on the pad' : m.def.random ? `random layout #${m.seed}` : '';
    if (view.isTouch) foot += ` · control ${scene.schemeName}`;
    if (scene.tuned) foot += ' · TUNED';
    ctx.fillText(foot, left, view.cssH - 10 - view.safe.bottom);
  }

  // Ao lado da barra: aos 20%, LOW FUEL amarelo, rápido e sutil; abaixo de 10%, vermelho piscando
  function drawFuelWarning(s, t, params, x, y) {
    const critical = s.state === 'flying' && s.fuel > 0 && s.fuel <= params.criticalFuel;
    let color;
    if (critical) {
      if (Math.sin(t * 9) < -0.1) return;
      color = 'rgba(255,93,93,1)';
    } else if (r.lowFuelT > 0) {
      const age = LOW_FUEL_FLASH - r.lowFuelT;
      color = `rgba(255,209,102,${(clamp(Math.min(age / 0.15, r.lowFuelT / 0.4), 0, 1) * 0.75).toFixed(2)})`;
    } else return;
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${critical ? 13 : 11}px ${FONT}`;
    ctx.fillStyle = color;
    ctx.fillText(critical ? 'LOW FUEL!' : 'LOW FUEL', x, y);
    ctx.restore();
  }

  return { drawObjectiveArrow, drawHUD };
}
