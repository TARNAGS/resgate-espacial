// Músicas do jogo, como partitura. O motor que toca fica em platform/music.js.
//
// Uma música é uma sequência de compassos de 16 passos (semicolcheias). Cada compasso tem dois
// acordes, um por metade. As notas são números MIDI (60 = dó central). Uma nota da melodia é
// [compasso, passo, nota, duração em passos].
//
// Acompanhamento gerado a partir dos acordes, por compasso:
//   bass   'pulse' (batida grave espaçada), 'drive' (colcheias em oitavas), 'hit' (uma nota longa)
//   arp    'slow' (arpejo em colcheias), 'fast' (arpejo em semicolcheias), 'stab' (acorde inteiro)
//   drums  'pulse', 'beat', 'roll' (meia batida e rufar de caixa), 'end' (golpe final com prato)
//   lead   onda da melodia naquele compasso: 'p25' (mais suave) ou 'p50' (mais cheia)

export const CHORDS = {
  Am: { arp: [57, 60, 64, 69], bass: 45 },
  F: { arp: [53, 57, 60, 65], bass: 41 },
  Dm: { arp: [50, 53, 57, 62], bass: 38 },
  E: { arp: [52, 56, 59, 64], bass: 40 },
  G: { arp: [55, 59, 62, 67], bass: 43 },
  C: { arp: [60, 64, 67, 72], bass: 36 },
};

// Abertura (#76): aventura, mistério e, no fim, a sensação de "vamos lá!".
// A música é o relógio da abertura: 6 compassos a 120 bpm (12 segundos), 2 por tela.
//   Compassos 0 e 1: tela 1, mistério em lá menor (Am, F, Dm, E; o mi maior cria suspense)
//   Compassos 2 e 3: tela 2, a aventura começa (F, G, E, Am), com bateria
//   Compassos 4 e 5: tela 3, a decolagem: subida rápida com rufar de caixa e o acorde final
//                    em dó maior, enquanto a tela e a música escurecem até a fase
export const INTRO_SONG = {
  bpm: 120,
  scenes: [0, 2, 4],     // compasso em que cada tela começa
  fadeFromBar: 5,        // no último compasso, a tela e a música escurecem juntas
  bars: [
    { chords: ['Am', 'F'], bass: 'pulse', arp: 'slow', drums: 'pulse', lead: 'p25' },
    { chords: ['Dm', 'E'], bass: 'pulse', arp: 'slow', drums: 'pulse', lead: 'p25' },
    { chords: ['F', 'G'], bass: 'drive', arp: 'fast', drums: 'beat', lead: 'p50' },
    { chords: ['E', 'Am'], bass: 'drive', arp: 'fast', drums: 'beat', lead: 'p50' },
    { chords: ['F', 'G'], bass: 'drive', arp: 'fast', drums: 'roll', lead: 'p50' },
    { chords: ['C', 'C'], bass: 'hit', arp: 'stab', drums: 'end', lead: 'p50' },
  ],
  lead: [
    // mistério
    [0, 0, 76, 4], [0, 4, 74, 2], [0, 6, 72, 2], [0, 8, 69, 6], [0, 14, 72, 2],
    [1, 0, 74, 4], [1, 4, 77, 4], [1, 8, 68, 4], [1, 12, 71, 2], [1, 14, 76, 2],
    // o chamado
    [2, 0, 77, 2], [2, 2, 81, 4], [2, 6, 79, 2], [2, 8, 79, 2], [2, 10, 83, 4], [2, 14, 81, 2],
    [3, 0, 80, 4], [3, 4, 83, 4], [3, 8, 84, 8],
    // vamos lá: fanfarra e subida em semicolcheias até o dó agudo
    [4, 0, 77, 2], [4, 2, 81, 2], [4, 4, 84, 4],
    [4, 8, 67, 1], [4, 9, 69, 1], [4, 10, 71, 1], [4, 11, 72, 1], [4, 12, 74, 1], [4, 13, 76, 1], [4, 14, 77, 1], [4, 15, 79, 1],
    [5, 0, 84, 16],
  ],
  // vozes extras no acorde final, para soar cheio
  harmony: [[5, 0, 76, 16], [5, 0, 79, 16]],
};
