import { clamp } from '../core/math.js';
import { FONT } from './style.js';
import { stars, drawStranded, drawCall, drawLaunch } from './intro-art.js';

// Abertura (Regras do jogo, seção 10.1; #76): telas com imagem e texto antes da primeira fase.
// Não é um filme e não conta uma história longa: o jogo não tem enredo.
//   Tela 1: a tripulação em apuros, presa longe de casa
//   Tela 2: o chamado para o resgate, na base
//   Tela 3: a nave decola e a tela escurece até a primeira fase
// A música é o relógio da abertura (content/songs.js, INTRO_SONG): cada tela começa num compasso
// da música, e a tela escurece junto com o acorde final. Sem som, um relógio próprio segue o mesmo
// ritmo. Tocar completa o texto; tocar de novo pula para a próxima tela (a música pula junto, na
// batida seguinte). SKIP para a música e vai direto para a fase. Textos em inglês (D-007).
// Os desenhos de cada tela ficam em intro-art.js (#123).

const TYPE_SPEED = 32;     // letras por segundo
const STEPS = 16;          // passos por compasso, como na música

const SCENES = [
  { draw: drawStranded, lines: ['One day, a crew got stranded far from home.'] },
  { draw: drawCall, lines: ['You are the one sent to bring them back.', 'Good luck.'] },
  { draw: drawLaunch, lines: [] },
];

export function createIntro(canvas, view, { song, music }) {
  const ctx = canvas.getContext('2d');
  const stepDur = 60 / song.bpm / 4;
  const starts = song.scenes.map((bar) => bar * STEPS);        // passo em que cada tela começa
  const total = song.bars.length * STEPS;
  const fadeFrom = song.fadeFromBar * STEPS;
  const it = { active: false, pos: 0, scene: 0, t: 0, typed: 0, completed: [], onDone: null, smoke: [] };

  it.start = ({ onDone }) => {
    Object.assign(it, { active: true, pos: 0, scene: 0, t: 0, typed: 0, completed: [], onDone, smoke: [] });
  };

  function finish() {
    if (!it.active) return;
    it.active = false;
    it.onDone?.();
  }

  const totalChars = (i = it.scene) => SCENES[i].lines.reduce((n, l) => n + l.length, 0);

  // Toque ou tecla: completa o texto; se já está completo, pula para a próxima tela
  it.next = () => {
    if (!it.active || it.scene >= SCENES.length - 1) return;
    if (it.typed < totalChars()) { it.completed[it.scene] = true; return; }
    const target = starts[it.scene + 1];
    if (music.playing) music.jumpTo(target);
    else it.pos = target;
  };

  // SKIP: a música para na hora e a fase começa
  it.skip = () => {
    music.stop(0.15);
    finish();
  };

  it.update = (dt) => {
    if (!it.active) return;
    it.pos = music.playing ? music.position() : it.pos + dt / stepDur;
    let scene = 0;
    starts.forEach((st, i) => { if (it.pos >= st) scene = i; });
    if (scene !== it.scene) it.smoke = [];
    it.scene = scene;
    it.t = (it.pos - starts[scene]) * stepDur;              // segundos desde o começo da tela
    it.typed = it.completed[scene] ? totalChars() : Math.min(totalChars(), it.t * TYPE_SPEED);
    if (it.pos >= total) finish();
  };

  it.draw = (now) => {
    const t = now / 1000;
    const W = view.cssW, H = view.cssH;
    ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0b1020');
    g.addColorStop(1, '#03040a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    stars(ctx, W, H, t);
    // Cena desenhada num quadro de 800 x 450, centralizado e escalado para a tela
    const k = Math.min(W / 800, H / 450);
    ctx.save();
    ctx.translate((W - 800 * k) / 2, (H - 450 * k) / 2);
    ctx.scale(k, k);
    SCENES[it.scene].draw(ctx, it, t);
    ctx.restore();
    drawText(ctx, it, W, H, t);
    // Fade para a fase, junto com o acorde final da música
    const fade = clamp((it.pos - fadeFrom) / (total - fadeFrom), 0, 1);
    if (fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${fade.toFixed(3)})`;
      ctx.fillRect(0, 0, W, H);
    }
  };

  function drawText(c, state, W, H, t) {
    const sc = SCENES[state.scene];
    if (!sc.lines.length) return;
    const size = clamp(Math.round(H * 0.05), 14, 24);
    c.font = `700 ${size}px ${FONT}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    let left = Math.floor(state.typed);
    sc.lines.forEach((line, i) => {
      const shown = line.slice(0, Math.max(0, left));
      left -= line.length;
      const y = H * 0.8 + i * size * 1.5 - view.safe.bottom * 0.5;
      c.fillStyle = 'rgba(0,0,0,0.55)';
      if (shown) c.fillRect(W / 2 - c.measureText(line).width / 2 - 12, y - size * 0.8, c.measureText(line).width + 24, size * 1.6);
      c.fillStyle = i === sc.lines.length - 1 && sc.lines.length > 1 ? '#46e0c8' : '#e8f1ff';
      c.fillText(shown, W / 2, y);
    });
    if (state.typed >= totalChars() && Math.sin(t * 4) > 0) {
      c.font = `11px ${FONT}`;
      c.fillStyle = 'rgba(127,140,163,0.9)';
      c.fillText(view.isTouch ? 'TAP TO CONTINUE' : 'PRESS ANY KEY', W / 2, H - 16 - view.safe.bottom);
    }
  }

  return it;
}

