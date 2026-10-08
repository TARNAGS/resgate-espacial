import { landingSafe, landingForecast } from '../core/ship.js';
import { FONT } from './style.js';

// Plataformas (base, posto e tripulação) e o aviso de pouso nas luzes delas.
const PAD_COLORS = { base: ['#7cc4ff', '#e8f1ff'], fuel: ['#ffd166', '#2b2b2b'], crew: ['#ff9f43', '#2b1a0a'] };
const PAD_LABELS = { base: 'BASE', fuel: 'FUEL', crew: 'SOS' };

export function createPads({ ctx }) {
  // Aviso de pouso (#50). Perto de uma plataforma, as luzes dela dizem se dá para pousar.
  // Descendo (landing), o verde usa a previsão da velocidade no toque, para nunca ficar verde e explodir.
  function approachInfo(m, params) {
    const s = m.ship;
    if (s.state !== 'flying') return null;
    const pad = m.level.pads.find((p) => s.x >= p.x1 - 30 && s.x <= p.x2 + 30 && p.y - s.y > 0 && p.y - s.y < 170);
    if (!pad) return null;
    const forecast = landingForecast(s, params, pad, { crewOnBoard: m.crewOnBoard, def: m.shipDef });
    const landing = forecast !== null;
    return { pad, landing, safe: landing ? forecast : landingSafe(s, params) };
  }

  function drawPads(lv, t, approach) {
    ctx.font = `700 11px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const blink = Math.sin(t * 4) > 0;
    for (const p of lv.pads) {
      const colors = PAD_COLORS[p.kind];
      for (let x = p.x1, k = 0; x < p.x2; x += 12, k++) {
        ctx.fillStyle = colors[k % 2];
        ctx.fillRect(x, p.y, Math.min(12, p.x2 - x), 6);
      }
      ctx.fillStyle = '#2a3348';
      ctx.fillRect(p.x1 + 6, p.y + 6, 4, 18);
      ctx.fillRect(p.x2 - 10, p.y + 6, 4, 18);
      const near = approach?.pad === p;
      ctx.fillStyle = near ? (approach.safe ? '#7dffb0' : '#ff5d5d') : blink ? colors[0] : '#333a4a';
      const lamp = near ? 7 : 4;
      ctx.fillRect(p.x1 - lamp / 2, p.y - lamp, lamp, lamp);
      ctx.fillRect(p.x2 - lamp / 2, p.y - lamp, lamp, lamp);
      ctx.fillStyle = colors[0];
      ctx.fillText(PAD_LABELS[p.kind], (p.x1 + p.x2) / 2, p.y - 32);
      if (p.kind === 'base') {
        ctx.strokeStyle = '#7cc4ff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(p.x1 - 34, p.y - 30, 26, 30);
        ctx.beginPath(); ctx.moveTo(p.x1 - 21, p.y - 30); ctx.lineTo(p.x1 - 21, p.y - 44); ctx.stroke();
        ctx.fillStyle = blink ? '#ff5d5d' : '#5a2a2a';
        ctx.fillRect(p.x1 - 23, p.y - 47, 4, 4);
      } else if (p.kind === 'fuel') {
        ctx.fillStyle = '#ffd166';
        ctx.fillRect(p.x2 + 6, p.y - 20, 12, 20);
        ctx.fillStyle = '#2b2b2b';
        ctx.fillRect(p.x2 + 8, p.y - 17, 8, 5);
      } else {
        ctx.strokeStyle = '#ff9f43';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(p.x2 + 10, p.y); ctx.lineTo(p.x2 + 10, p.y - 36); ctx.stroke();
        ctx.fillStyle = '#ff9f43';
        const wave = Math.sin(t * 6) * 2;
        ctx.beginPath();
        ctx.moveTo(p.x2 + 10, p.y - 36);
        ctx.lineTo(p.x2 + 26, p.y - 32 + wave);
        ctx.lineTo(p.x2 + 10, p.y - 27);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  return { approachInfo, drawPads };
}
