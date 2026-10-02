import { Sound } from './audio.js';
import { CHORDS } from '../content/songs.js';

// Motor de música chiptune, sintetizada com Web Audio, sem arquivos de áudio. Estilo 16 bits:
// ondas de pulso (12,5%, 25% e 50%), baixo em onda triangular, bateria de ruído e um eco curto,
// como nos consoles daquela época. A partitura fica em content/songs.js.
//
//   play(song)        toca a música do começo ao fim, uma vez
//   position()        em que passo da música estamos agora (pelo relógio do áudio), ou null
//   jumpTo(step)      pula para outro ponto, na próxima batida (para acompanhar um toque na tela)
//   stop(fade)        para, com um fade curto
// Com o som desligado em Settings, não toca nada, e quem usa a música cai no próprio relógio.

const STEPS = 16;          // passos por compasso
const LOOKAHEAD = 0.15;    // quanto tempo à frente as notas são agendadas (s)
const VOLUME = 0.55;

export function createMusic() {
  let ctx = null, out = null, waves = null, noise = null;
  let song = null, grid = null, total = 0, stepDur = 0.125;
  let at = 0, nextTime = 0, pendingJump = null, timer = null;
  let segments = [];         // [{ time, step }]: a partir de `time`, a música está no passo `step`

  function setup() {
    ctx = Sound.ctx;
    if (!ctx) return false;
    if (out) return true;
    out = ctx.createGain();
    const tone = ctx.createBiquadFilter();       // tira o chiado agudo, como os chips de 16 bits
    tone.type = 'lowpass';
    tone.frequency.value = 5200;
    const echo = ctx.createDelay(1);
    echo.delayTime.value = 0.21;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.28;
    const wet = ctx.createGain();
    wet.gain.value = 0.22;
    out.connect(tone).connect(ctx.destination);
    tone.connect(echo);
    echo.connect(feedback).connect(echo);
    echo.connect(wet).connect(ctx.destination);
    waves = { p50: pulse(0.5), p25: pulse(0.25), p12: pulse(0.125) };
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return true;
  }

  // Onda de pulso com o ciclo de trabalho `duty`, por série de Fourier
  function pulse(duty) {
    const n = 40;
    const real = new Float32Array(n), imag = new Float32Array(n);
    for (let k = 1; k < n; k++) real[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * duty);
    return ctx.createPeriodicWave(real, imag);
  }

  const freq = (midi) => 440 * 2 ** ((midi - 69) / 12);

  function note(wave, midi, t, dur, vol) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    if (wave === 'tri') o.type = 'triangle';
    else o.setPeriodicWave(waves[wave]);
    const f = freq(midi);
    o.frequency.setValueAtTime(f, t);
    if (wave === 'p50' && dur > 0.35) {          // vibrato nas notas longas da melodia
      const lfo = ctx.createOscillator();
      const depth = ctx.createGain();
      lfo.frequency.value = 5.5;
      depth.gain.setValueAtTime(0, t);
      depth.gain.linearRampToValueAtTime(f * 0.007, t + 0.3);
      lfo.connect(depth).connect(o.frequency);
      lfo.start(t);
      lfo.stop(t + dur + 0.2);
    }
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.setTargetAtTime(vol * 0.7, t + 0.02, 0.1);
    g.gain.setTargetAtTime(0, t + dur * 0.92, 0.03);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + dur + 0.3);
  }

  function hit(kind, t, vol = 1) {
    if (kind === 'k') {                          // bumbo: seno com o tom caindo
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(150, t);
      o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
      g.gain.setValueAtTime(0.5 * vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.connect(g).connect(out);
      o.start(t); o.stop(t + 0.2);
      return;
    }
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = noise;
    const len = { s: 0.12, h: 0.03, o: 0.12, c: 1.4 }[kind];
    f.type = kind === 's' ? 'bandpass' : 'highpass';
    f.frequency.value = { s: 1800, h: 7500, o: 6500, c: 4500 }[kind];
    const v = { s: 0.32, h: 0.07, o: 0.08, c: 0.16 }[kind] * vol;
    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + len);
    src.connect(f).connect(g).connect(out);
    src.start(t, Math.random() * 0.5);
    src.stop(t + len + 0.05);
    if (kind === 's') note('tri', 55, t, 0.06, 0.12);   // corpo da caixa
  }

  // Transforma a partitura numa lista de passos, cada um com as funções que tocam nele
  function compile(s) {
    const steps = Array.from({ length: s.bars.length * STEPS }, () => []);
    const add = (b, st, fn) => steps[b * STEPS + st].push(fn);
    const sd = () => stepDur;
    s.bars.forEach((bar, b) => {
      const chordAt = (st) => CHORDS[bar.chords[st < 8 ? 0 : 1]];
      // baixo
      if (bar.bass === 'pulse') {
        for (const h of [0, 8]) add(b, h, (t) => note('tri', chordAt(h).bass, t, sd() * 5, 0.22));
      } else if (bar.bass === 'drive') {
        for (let st = 0; st < STEPS; st += 2) add(b, st, (t) => note('tri', chordAt(st).bass + (st % 4 ? 12 : 0), t, sd() * 1.7, 0.22));
      } else if (bar.bass === 'hit') {
        add(b, 0, (t) => note('tri', chordAt(0).bass, t, sd() * 16, 0.26));
      }
      // arpejo
      if (bar.arp === 'slow') {
        for (let st = 0; st < STEPS; st += 2) add(b, st, (t) => note('p12', chordAt(st).arp[(st / 2) % 4], t, sd() * 1.8, 0.05));
      } else if (bar.arp === 'fast') {
        for (let st = 0; st < STEPS; st++) add(b, st, (t) => note('p25', chordAt(st).arp[st % 4] + 12, t, sd() * 0.9, 0.028));
      } else if (bar.arp === 'stab') {
        chordAt(0).arp.forEach((m) => add(b, 0, (t) => note('p25', m + 12, t, sd() * 16, 0.035)));
      }
      // bateria
      if (bar.drums === 'pulse') {
        add(b, 0, (t) => hit('k', t, 0.6));
        add(b, 8, (t) => hit('k', t, 0.45));
      } else if (bar.drums === 'beat') {
        [0, 8].forEach((st) => add(b, st, (t) => hit('k', t)));
        [4, 12].forEach((st) => add(b, st, (t) => hit('s', t)));
        for (let st = 0; st < STEPS; st += 2) add(b, st, (t) => hit(st === 14 ? 'o' : 'h', t));
      } else if (bar.drums === 'roll') {
        add(b, 0, (t) => hit('k', t));
        add(b, 4, (t) => hit('s', t));
        [0, 2, 4, 6].forEach((st) => add(b, st, (t) => hit('h', t)));
        add(b, 8, (t) => hit('k', t));
        for (let st = 8; st < STEPS; st++) add(b, st, (t) => hit('s', t, 0.35 + 0.65 * ((st - 8) / 8)));
      } else if (bar.drums === 'end') {
        add(b, 0, (t) => { hit('k', t); hit('c', t); });
      }
    });
    for (const [b, st, m, len] of s.lead) add(b, st, (t) => note(s.bars[b].lead, m, t, sd() * len, 0.085));
    for (const [b, st, m, len] of s.harmony || []) add(b, st, (t) => note('p25', m, t, sd() * len, 0.05));
    // Fade no último trecho: a música escurece junto com a tela
    if (s.fadeFromBar != null) {
      add(s.fadeFromBar, 4, (t) => {
        const end = (s.bars.length - s.fadeFromBar) * STEPS - 4;
        out.gain.setTargetAtTime(0.0001, t, (end * stepDur) / 4);
      });
    }
    return steps;
  }

  function tick() {
    if (!song) return;
    while (nextTime < ctx.currentTime + LOOKAHEAD) {
      if (pendingJump !== null && at % 4 === 0) {           // pulo na próxima batida
        at = pendingJump;
        pendingJump = null;
        segments.push({ time: nextTime, step: at });
      }
      if (at >= total) { stopScheduling(); return; }
      for (const fn of grid[at]) fn(nextTime);
      nextTime += stepDur;
      at += 1;
    }
  }

  function stopScheduling() {
    clearInterval(timer);
    timer = null;
  }

  return {
    play(s) {
      if (!Sound.enabled || !setup()) return false;
      stopScheduling();
      song = s;
      stepDur = 60 / s.bpm / 4;
      grid = compile(s);
      total = grid.length;
      at = 0;
      pendingJump = null;
      nextTime = ctx.currentTime + 0.06;
      segments = [{ time: nextTime, step: 0 }];
      out.gain.cancelScheduledValues(ctx.currentTime);
      out.gain.setValueAtTime(VOLUME, ctx.currentTime);
      timer = setInterval(tick, 25);
      tick();
      return true;
    },
    position() {
      if (!song) return null;
      const now = ctx.currentTime;
      let seg = segments[0];
      for (const sg of segments) if (sg.time <= now) seg = sg;
      return Math.min(total, Math.max(0, seg.step + (now - seg.time) / stepDur));
    },
    jumpTo(step) {
      if (!song || step <= at) return;
      pendingJump = step;
    },
    stop(fade = 0.2) {
      stopScheduling();
      song = null;
      if (!ctx || !out) return;
      out.gain.cancelScheduledValues(ctx.currentTime);
      out.gain.setValueAtTime(out.gain.value, ctx.currentTime);
      out.gain.setTargetAtTime(0, ctx.currentTime, fade / 4);
    },
    get playing() { return Boolean(song); },
    get stepDur() { return stepDur; },
  };
}
