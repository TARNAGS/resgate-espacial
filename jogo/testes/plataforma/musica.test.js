// Música

import { test, assert, INTRO_SONG, CHORDS } from '../lib.js';

test('#76 a partitura da abertura é válida: acordes conhecidos, notas dentro dos compassos', () => {
  const bars = INTRO_SONG.bars.length;
  for (const bar of INTRO_SONG.bars) {
    assert.equal(bar.chords.length, 2);
    for (const c of bar.chords) assert.ok(CHORDS[c], `acorde desconhecido: ${c}`);
  }
  for (const [b, st, m, len] of [...INTRO_SONG.lead, ...INTRO_SONG.harmony]) {
    assert.ok(b >= 0 && b < bars && st >= 0 && st < 16 && len > 0 && st + len <= 16, `nota fora do compasso: ${[b, st, m, len]}`);
    assert.ok(m >= 36 && m <= 96, `nota fora da extensão (${m})`);
  }
});

test('#76 a música cabe na abertura: 12 segundos, uma tela a cada 2 compassos, fade no último e final em dó maior', () => {
  const barSeconds = (60 / INTRO_SONG.bpm) * 4;
  assert.equal(INTRO_SONG.bars.length * barSeconds, 12);
  assert.deepEqual(INTRO_SONG.scenes, [0, 2, 4]);                       // três telas, na ordem
  assert.equal(INTRO_SONG.fadeFromBar, INTRO_SONG.bars.length - 1);     // fade no último compasso
  assert.deepEqual(INTRO_SONG.bars.at(-1).chords, ['C', 'C']);          // "vamos lá!" em dó maior
});
