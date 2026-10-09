import { STEP } from '../core/constants.js';
import { clamp, sampleLine, wrapAngle } from '../core/math.js';
import { TAKEOFF_TIPS, TURN_TIPS, targetPad } from '../core/coach.js';
import { DEFAULT_SHIP } from '../content/ships/index.js';
import { FONT } from './style.js';

// Treinador da fase que ensina (D-038): o que ele mostra na fase e na tela. Só lê o estado da partida e o que o
// fluxo do treinador decidiu (scene.coach, app/coach.js).
//   Na fase: luzes de aproximação no chão antes do objetivo (a pista que diz "freie" ou "pode vir"), o nariz-guia
//            da freada, o pedido de socorro da tripulação e o farol da base na volta.
//   Na tela: a dica da vez perto da nave, com as teclas desenhadas no teclado, o botão do propulsor pulsando no
//            celular e a lição depois do erro.
// Inspiração (D-033): o desenho ensina (Plants vs. Zombies), aviso antes do perigo (Jetpack Joyride), o
// velocímetro com o limite de pouso marcado (Crazy Gravity) e o contrato de confiança: verde sempre quer dizer
// "seguro" (Super Mario World).

const TONE = { info: '#e8f1ff', warn: '#ffb347', good: '#7dffb0' };
const PAD_COLOR = { crew: '#ff9f43', base: '#7cc4ff' };
const LAMPS = 8, LAMP_GAP = 42;

export function createCoachArt({ ctx, view, r }) {
  // ===== Na fase (coordenadas do mundo) =====

  // Luzes de aproximação: uma fileira no chão, do lado de onde a nave vem, correndo na direção da plataforma.
  // Vermelhas piscando: freie já. Verdes: o pouso está bom. Na cor da plataforma: o caminho.
  function drawApproachLights(m, tip, t) {
    const pad = targetPad(m);
    const s = m.ship;
    const side = s.x < pad.x1 ? -1 : s.x > pad.x2 ? 1 : s.x < (pad.x1 + pad.x2) / 2 ? -1 : 1;
    const danger = tip?.id === 'brake';
    const good = tip?.id === 'landOk' || tip?.id === 'braking';
    const color = danger ? '#ff5d5d' : good ? '#7dffb0' : PAD_COLOR[pad.kind];
    const run = Math.floor(t * 7) % (LAMPS + 2);
    for (let i = 0; i < LAMPS; i++) {
      const x = side < 0 ? pad.x1 - 26 - i * LAMP_GAP : pad.x2 + 26 + i * LAMP_GAP;
      if (x < 12 || x > m.level.L - 12) continue;
      const y = sampleLine(m.level.floor, x, STEP);
      const lit = danger ? Math.sin(t * 12) > -0.2 : run === LAMPS - 1 - i || good;
      ctx.fillStyle = lit ? color : '#333a4a';
      ctx.fillRect(x - 3, y - 6, 6, 6);
    }
  }

  // Farol da base na volta: uma coluna de luz e uma seta que quica sobre ela
  function drawBaseBeacon(m, t) {
    const pad = m.level.pads.find((p) => p.kind === 'base');
    const pulse = 0.09 + 0.06 * Math.sin(t * 4);
    const g = ctx.createLinearGradient(0, pad.y - 240, 0, pad.y);
    g.addColorStop(0, 'rgba(124,196,255,0)');
    g.addColorStop(1, `rgba(124,196,255,${pulse.toFixed(3)})`);
    ctx.fillStyle = g;
    ctx.fillRect(pad.x1, pad.y - 240, pad.x2 - pad.x1, 240);
    const cx = (pad.x1 + pad.x2) / 2, y = pad.y - 58 - Math.abs(Math.sin(t * 4)) * 8;
    ctx.fillStyle = '#7cc4ff';
    ctx.beginPath();
    ctx.moveTo(cx - 9, y - 8); ctx.lineTo(cx + 9, y - 8); ctx.lineTo(cx, y + 4);
    ctx.closePath();
    ctx.fill();
  }

  // A tripulação pede socorro enquanto espera
  function drawHelp(m, t) {
    if (m.crewOnBoard || m.ship.state === 'boarding' || Math.sin(t * 5) < -0.5) return;
    const pad = m.level.pads.find((p) => p.kind === 'crew');
    const x = pad.x2 - 27, y = pad.y - 44;
    ctx.font = `700 10px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,224,184,0.95)';
    roundRect(x - 20, y - 8, 40, 16, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 8); ctx.lineTo(x + 2, y + 8); ctx.lineTo(x - 3, y + 14);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#2b1a0a';
    ctx.fillText('HELP!', x, y + 1);
  }

  // Nariz-guia da freada: o contorno da nave, maior, apontando para onde o nariz tem de ir, e uma seta nessa direção
  function drawBrakeNose(m, tip) {
    const s = m.ship;
    const hull = (m.shipDef ?? DEFAULT_SHIP).hull;
    const color = tip.id === 'braking' ? 'rgba(125,255,176,0.95)' : 'rgba(255,179,71,0.95)';
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(tip.nose);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.setLineDash([4, 3]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    hull.forEach((v, i) => (i ? ctx.lineTo(v.x * 1.7, v.y * 1.7) : ctx.moveTo(v.x * 1.7, v.y * 1.7)));
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -26); ctx.lineTo(0, -46);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -54); ctx.lineTo(-7, -44); ctx.lineTo(7, -44);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawCoachWorld(m, coach, t) {
    if (m.ship.state === 'exploding' || m.over || !targetPad(m)) return;
    drawApproachLights(m, coach.tip, t);
    if (m.crewOnBoard) drawBaseBeacon(m, t);
    drawHelp(m, t);
    if (coach.tip?.nose != null) drawBrakeNose(m, coach.tip);
  }

  // ===== Na tela =====

  function roundRect(x, y, w, h, rad) {
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  }

  // Uma tecla desenhada; acesa quando o jogador aperta
  const KEY = 24;
  function drawKey(x, y, label, lit, color) {
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = lit ? color : 'rgba(232,241,255,0.7)';
    ctx.fillStyle = lit ? 'rgba(255,179,71,0.3)' : 'rgba(232,241,255,0.08)';
    roundRect(x, y, KEY, KEY, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = lit ? color : '#e8f1ff';
    ctx.font = `700 14px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + KEY / 2, y + KEY / 2 + 1);
  }

  // As teclas que a dica pede: decolar (↑, e ← → para virar) ou frear (a seta do giro e o ↑)
  function keyRow(tip, m) {
    if (tip.id === 'takeoff') return [['↑', 'thrust', 'FLY'], null, ['←', 'left'], ['→', 'right', 'TURN']];
    if (tip.id === 'brake' || tip.id === 'braking') {
      const turn = Math.sign(wrapAngle(tip.nose - m.ship.a));
      return [turn < 0 ? ['←', 'left'] : ['→', 'right'], ['↑', 'thrust']];
    }
    if (tip.id === 'landSlow') return [['↑', 'thrust']];
    return [];
  }

  function tipText(tip, scene) {
    if (tip.id !== 'takeoff' || !view.isTouch) return tip.text;
    return TAKEOFF_TIPS[scene.params?.touchScheme] ?? tip.text;
  }

  // A dica da vez: um quadro pequeno perto da nave, acima dela (ou abaixo, se ela estiver no alto)
  function drawTip(m, coach, t, scene) {
    const tip = coach.tip;
    const s = m.ship;
    if (!tip || s.state === 'exploding') return;
    const color = TONE[tip.tone];
    const text = tip.dir ? (tip.dir > 0 ? `${tipText(tip, scene)} →` : `← ${tipText(tip, scene)}`) : tipText(tip, scene);
    const sub = tip.id === 'takeoff' && view.isTouch ? TURN_TIPS[scene.params?.touchScheme] : null;
    const keys = view.isTouch ? [] : keyRow(tip, m);
    ctx.font = `700 13px ${FONT}`;
    const w = Math.max(ctx.measureText(text).width, sub ? ctx.measureText(sub).width : 0, keys.length * (KEY + 8) + 60) + 20;
    const h = 24 + (sub ? 16 : 0) + (keys.length ? KEY + 8 : 0);
    const p = r.toScreen(s.x, s.y);
    const left = view.play.x + 8, right = view.play.x + view.play.w - 8;
    const x = clamp(p.x - w / 2, left, Math.max(left, right - w));
    const top = 86 + view.safe.top;
    let y = p.y - 58 - h;   // acima do letreiro da plataforma
    if (y < top) y = p.y + 30;
    const fade = clamp(coach.tipT / 0.15, 0, 1);
    const blink = tip.tone === 'warn' && Math.sin(t * 10) < -0.5;
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.fillStyle = 'rgba(5,8,16,0.82)';
    roundRect(x, y, w, h, 6);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = blink ? 'rgba(232,241,255,0.55)' : color;
    ctx.fillText(text, x + w / 2, y + 13);
    if (sub) {
      ctx.font = `700 11px ${FONT}`;
      ctx.fillStyle = 'rgba(232,241,255,0.8)';
      ctx.fillText(sub, x + w / 2, y + 29);
    }
    if (keys.length) drawKeys(keys, x + w / 2, y + 24, scene.keys || {}, color);
    ctx.restore();
  }

  // Fileira de teclas, centrada; cada tecla pode ter uma legenda à direita
  function drawKeys(keys, cx, y, pressed, color) {
    ctx.font = `700 10px ${FONT}`;
    const widths = keys.map((k) => (k ? KEY + 6 + (k[2] ? ctx.measureText(k[2]).width + 6 : 0) : 14));
    let x = cx - widths.reduce((a, b) => a + b, 0) / 2;
    keys.forEach((k, i) => {
      if (k) {
        drawKey(x, y, k[0], Boolean(pressed[k[1]]), color);
        if (k[2]) {
          ctx.font = `700 10px ${FONT}`;
          ctx.textAlign = 'left';
          ctx.fillStyle = 'rgba(232,241,255,0.85)';
          ctx.fillText(k[2], x + KEY + 5, y + KEY / 2 + 1);
        }
      }
      x += widths[i];
    });
  }

  // No celular, na decolagem: o botão do propulsor (dois polegares) pulsa
  function drawThrustPulse(scene, t) {
    if (!view.isTouch || scene.params?.touchScheme !== 'twin' || !scene.joystick?.thrustButton) return;
    const b = scene.joystick.thrustButton();
    const k = (t * 1.6) % 1;
    ctx.lineWidth = 3;
    ctx.strokeStyle = `rgba(255,209,102,${(0.9 * (1 - k)).toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r + 6 + k * 22, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Lição depois do erro: uma linha no alto da fase, que some sozinha
  function drawLesson(m, coach) {
    if (!coach.lesson) return;
    const top = 92 + view.safe.top;
    const cx = view.play.x + view.play.w / 2;
    ctx.font = `700 14px ${FONT}`;
    const text = coach.lesson;
    const w = ctx.measureText(text).width + 28, h = 30;
    const p = r.toScreen(m.ship.x, m.ship.y);
    const under = Math.abs(p.x - cx) < w / 2 + 20 && p.y > top - 20 && p.y < top + h + 20;
    const age = 5 - coach.lessonT;
    const alpha = clamp(Math.min(age / 0.25, coach.lessonT / 0.5), 0, 1) * (under ? 0.3 : 1);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(5,8,16,0.85)';
    roundRect(cx - w / 2, top, w, h, 6);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffb347';
    ctx.stroke();
    ctx.fillStyle = '#ffd166';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, cx, top + h / 2 + 1);
    ctx.restore();
  }

  function drawCoachScreen(m, coach, t, scene) {
    if (m.over) return;
    if (coach.tip?.id === 'takeoff') drawThrustPulse(scene, t);
    drawTip(m, coach, t, scene);
    drawLesson(m, coach);
  }

  return { drawCoachWorld, drawCoachScreen };
}
