import { Sound } from './audio.js';
import { CHORDS } from '../content/songs.js';

// Motor de música chiptune, sintetizada com Web Audio, sem arquivos de áudio. Estilo 16 bits:
// ondas de pulso (12,5%, 25% e 50%), baixo em onda triangular, bateria de ruído e um eco curto,
// como nos consoles daquela época. A partitura fica em content/songs.js.
//
// Uso: play(song) começa a seção 0; goTo(i) troca de seção (no próximo compasso, ou na próxima
// batida com { quantize: 'beat' }); stop(fade) para. Respeita o som desligado em Settings.

const STEPS = 16;          // passos por compasso
const LOOKAHEAD = 0.15;    // quanto tempo à frente as notas são agendadas (s)

export function createMusic() {
  let ctx = null, out = null, waves = null, noise = null;
  let song = null, events = null, sec = 0, bar = 0, step = 0, nextTime = 0;
  let pending = null, timer = null, stepDur = 0.13;

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

  // Transforma a partitura de uma seção numa grade [compasso][passo] de funções que tocam
  function compile(s) {
    const grid = Array.from({ length: s.chords.length }, () => Array.from({ length: STEPS }, () => []));
    const at = (b, st, fn) => grid[b][st].push(fn);
    const sd = () => stepDur;
    s.chords.forEach((name, b) => {
      const ch = CHORDS[name];
      // baixo
      const bass = s.bass[b];
      if (bass === 'pulse') {
        at(b, 0, (t) => note('tri', ch.bass, t, sd() * 6, 0.22));
        at(b, 10, (t) => note('tri', ch.bass, t, sd() * 2, 0.18));
        at(b, 12, (t) => note('tri', ch.bass + 7, t, sd() * 4, 0.16));
      } else if (bass === 'drive') {
        for (let st = 0; st < STEPS; st += 2) at(b, st, (t) => note('tri', ch.bass + (st % 4 ? 12 : 0), t, sd() * 1.7, 0.22));
      } else if (bass === 'hit') {
        at(b, 2, (t) => note('tri', ch.bass, t, sd() * 14, 0.26));
      }
      // arpejo
      const arp = s.arp[b];
      if (arp === 'slow') {
        [0, 1, 2, 3, 2, 1, 2, 1].forEach((k, i) => at(b, i * 2, (t) => note('p12', ch.arp[k], t, sd() * 1.8, 0.05)));
      } else if (arp === 'fast') {
        for (let st = 0; st < STEPS; st++) at(b, st, (t) => note('p25', ch.arp[st % 4] + 12, t, sd() * 0.9, 0.028));
      } else if (arp === 'stab') {
        ch.arp.forEach((m) => at(b, 2, (t) => note('p25', m + 12, t, sd() * 14, 0.035)));
      }
      // bateria
      const dr = s.drums[b];
      if (dr === 'pulse') {
        at(b, 0, (t) => hit('k', t, 0.6));
        at(b, 10, (t) => hit('k', t, 0.4));
      } else if (dr === 'beat' || dr === 'crash') {
        if (dr === 'crash') at(b, 0, (t) => hit('c', t));
        [0, 8].forEach((st) => at(b, st, (t) => hit('k', t)));
        [4, 12].forEach((st) => at(b, st, (t) => hit('s', t)));
        for (let st = 0; st < STEPS; st += 2) at(b, st, (t) => hit(st === 14 ? 'o' : 'h', t));
      } else if (dr === 'roll') {
        at(b, 0, (t) => hit('k', t));
        for (let st = 0; st < STEPS; st++) at(b, st, (t) => hit('s', t, 0.35 + 0.65 * (st / STEPS)));
      } else if (dr === 'end') {
        at(b, 2, (t) => { hit('k', t); hit('c', t); });
      }
    });
    for (const [b, st, m, len] of s.lead) at(b, st, (t) => note(s.leadWave, m, t, sd() * len, 0.085));
    for (const [b, st, m, len] of s.harmony || []) at(b, st, (t) => note('p25', m, t, sd() * len, 0.05));
    return grid;
  }

  function enterSection(i) {
    sec = i;
    bar = 0;
    step = 0;
    pending = null;
  }

  function tick() {
    if (!song) return;
    while (nextTime < ctx.currentTime + LOOKAHEAD) {
      if (pending !== null && step % (pending.quantize === 'beat' ? 4 : STEPS) === 0) enterSection(pending.section);
      for (const fn of events[sec][bar][step]) fn(nextTime);
      nextTime += stepDur;
      step += 1;
      if (step === STEPS) {
        step = 0;
        bar += 1;
        if (bar === events[sec].length) {
          if (song.sections[sec].loop) bar = 0;
          else { finish(); return; }
        }
      }
    }
  }

  function finish() {
    clearInterval(timer);
    timer = null;
    song = null;
  }

  return {
    play(s) {
      if (!Sound.enabled || !setup()) return;
      if (timer) finish();
      song = s;
      stepDur = 60 / s.bpm / 4;
      events = s.sections.map(compile);
      enterSection(0);
      out.gain.cancelScheduledValues(ctx.currentTime);
      out.gain.setValueAtTime(0.55, ctx.currentTime);
      nextTime = ctx.currentTime + 0.06;
      timer = setInterval(tick, 25);
      tick();
    },
    goTo(section, { quantize = 'bar' } = {}) {
      if (!song || section === sec || pending?.section === section) return;
      pending = { section, quantize };
    },
    stop(fade = 0.6) {
      if (!ctx || !out) return;
      out.gain.setTargetAtTime(0, ctx.currentTime, fade / 4);
      setTimeout(() => { if (!timer) return; finish(); }, fade * 1000 + 50);
    },
    get playing() { return Boolean(timer); },
    get section() { return sec; },
  };
}
