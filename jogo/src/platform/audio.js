// Efeitos sonoros sintetizados com Web Audio (Regras do jogo, seção 12). O som só começa depois
// da primeira interação do jogador (unlock). O que o iPhone exige ainda vai ser pesquisado (#57).

export const Sound = {
  ctx: null,
  enabled: true,
  thrustGain: null,

  unlock() {
    try {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
    } catch (_) { /* sem som neste navegador */ }
  },

  tone(freq, dur, type = 'square', vol = 0.05, slide = 0) {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  },

  noise(dur, vol = 0.15) {
    if (!this.enabled || !this.ctx) return;
    const len = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource();
    const g = this.ctx.createGain();
    g.gain.value = vol;
    src.buffer = buf;
    src.connect(g).connect(this.ctx.destination);
    src.start();
  },

  setThrust(on) {
    if (!this.ctx) return;
    if (!this.thrustGain) {
      const len = this.ctx.sampleRate;
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 420;
      this.thrustGain = this.ctx.createGain();
      this.thrustGain.gain.value = 0;
      src.connect(filter).connect(this.thrustGain).connect(this.ctx.destination);
      src.start();
    }
    const target = on && this.enabled ? 0.09 : 0;
    this.thrustGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.03);
  },

  land() { this.tone(660, 0.08); setTimeout(() => this.tone(880, 0.1, 'square', 0.04), 70); },
  crash() { this.noise(0.6, 0.2); this.tone(160, 0.5, 'sawtooth', 0.06, -110); },
  board(i) { this.tone(520 + i * 160, 0.09, 'square', 0.05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, 0.14, 'square', 0.05), i * 110)); },
  warn() { this.tone(300, 0.16, 'square', 0.05); setTimeout(() => this.tone(300, 0.16, 'square', 0.05), 220); },
  click() { this.tone(900, 0.04, 'square', 0.03); },
  // Elogio (#81): uma nota só, curta e baixa, diferente para cada manobra
  praise(kind) {
    const f = { closeCall: 1047, greatSave: 1319, perfectLanding: 784, perfectRun: 1568 }[kind] || 1047;
    this.tone(f, 0.14, 'triangle', 0.045);
  },
};

// Liga os sons aos eventos da partida
export function connectSound(events) {
  events.on('land', () => Sound.land());
  events.on('crash', () => Sound.crash());
  events.on('boardStep', ({ index }) => Sound.board(index));
  events.on('complete', () => Sound.win());
  events.on('lowFuelAtCrew', () => Sound.warn());
  events.on('praise', ({ kind }) => Sound.praise(kind));
}
