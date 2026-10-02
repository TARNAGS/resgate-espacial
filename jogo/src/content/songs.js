// Músicas do jogo, como partitura. O motor que toca fica em platform/music.js.
//
// Cada música tem seções. Cada compasso tem 16 passos (semicolcheias). As notas são números MIDI
// (60 = dó central). Uma nota da melodia é [compasso, passo, nota, duração em passos].
//
// Acompanhamento gerado a partir dos acordes, por compasso:
//   bass   'pulse' (batida grave espaçada), 'drive' (colcheias em oitavas), 'hit' (uma nota longa)
//   arp    'slow' (arpejo em colcheias), 'fast' (arpejo em semicolcheias), 'stab' (acorde final)
//   drums  'none', 'pulse', 'beat', 'roll' (rufar de caixa), 'crash' (prato + batida), 'end' (golpe final)

export const CHORDS = {
  Am: { arp: [57, 60, 64, 69], bass: 45 },
  F: { arp: [53, 57, 60, 65], bass: 41 },
  Dm: { arp: [50, 53, 57, 62], bass: 38 },
  E: { arp: [52, 56, 59, 64], bass: 40 },
  G: { arp: [55, 59, 62, 67], bass: 43 },
  C: { arp: [60, 64, 67, 72], bass: 36 },
};

// Abertura (#76): aventura, mistério e, no fim, a sensação de "vamos lá!".
// Lá menor, com a dominante maior (mi maior) para o suspense, e o final em dó maior.
export const INTRO_SONG = {
  bpm: 116,
  sections: [
    {
      name: 'mystery',             // tela 1: a tripulação presa
      loop: true,
      chords: ['Am', 'F', 'Dm', 'E'],
      leadWave: 'p25',
      bass: ['pulse', 'pulse', 'pulse', 'pulse'],
      arp: ['slow', 'slow', 'slow', 'slow'],
      drums: ['pulse', 'pulse', 'pulse', 'pulse'],
      lead: [
        [0, 8, 76, 4], [0, 12, 74, 2], [0, 14, 72, 2],
        [1, 0, 69, 12], [1, 12, 72, 4],
        [2, 0, 74, 4], [2, 4, 77, 4], [2, 8, 76, 4], [2, 12, 74, 4],
        [3, 0, 68, 8], [3, 8, 71, 4], [3, 12, 76, 4],
      ],
    },
    {
      name: 'call',                // tela 2: o chamado para o resgate
      loop: true,
      chords: ['F', 'G', 'E', 'Am'],
      leadWave: 'p50',
      bass: ['drive', 'drive', 'drive', 'drive'],
      arp: ['fast', 'fast', 'fast', 'fast'],
      drums: ['beat', 'beat', 'beat', 'beat'],
      lead: [
        [0, 0, 72, 2], [0, 2, 77, 2], [0, 4, 81, 6], [0, 10, 79, 2], [0, 12, 77, 4],
        [1, 0, 79, 6], [1, 6, 74, 2], [1, 8, 79, 2], [1, 10, 83, 6],
        [2, 0, 80, 4], [2, 4, 83, 4], [2, 8, 88, 6], [2, 14, 86, 2],
        [3, 0, 84, 4], [3, 4, 83, 2], [3, 6, 81, 10],
      ],
    },
    {
      name: 'go',                  // tela 3: a decolagem, "vamos lá!"
      loop: false,
      chords: ['F', 'G', 'C', 'C'],
      leadWave: 'p50',
      bass: ['drive', 'drive', 'drive', 'hit'],
      arp: ['fast', 'fast', 'fast', 'stab'],
      drums: ['beat', 'roll', 'crash', 'end'],
      lead: [
        [0, 0, 77, 4], [0, 4, 81, 4], [0, 8, 84, 6], [0, 14, 81, 2],
        // subida em semicolcheias até o dó agudo
        [1, 0, 67, 2], [1, 2, 69, 2], [1, 4, 71, 2], [1, 6, 72, 2], [1, 8, 74, 2], [1, 10, 76, 2], [1, 12, 77, 2], [1, 14, 79, 2],
        [2, 0, 84, 6], [2, 6, 79, 2], [2, 8, 84, 4], [2, 12, 88, 4],
        [3, 0, 79, 2], [3, 2, 84, 14],
      ],
      // segunda voz no final, uma terça abaixo, para o acorde soar cheio
      harmony: [[2, 0, 76, 6], [2, 8, 76, 4], [2, 12, 84, 4], [3, 2, 76, 14]],
    },
  ],
};
