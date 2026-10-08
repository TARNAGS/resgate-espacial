// Desafios: fases fora da sequência, sempre liberadas no mapa. Os campos estão explicados em content/worlds.js.
// PRACTICE é a fase mais difícil do jogo, para testar os controles e levar o jogo ao limite.

export const CHALLENGE_LEVELS = [
  {
    key: 'practice',
    seed: 293233524,          // a primeira semente fixa com caminho provado (a 404 foi trocada pelo gerador)
    name: 'PRACTICE',
    goal: 'The hardest run in the game. Plan your one refuel well.',
    challenge: true,
    generator: {
      length: 4400, minGap: 125, roughness: 135, fuelStation: true, refuelMargin: 0.05, tank: 32.71,
      obstacles: [{ type: 'rock', count: 26, passGap: 56, spacing: 105 }],
    },
    modifiers: [],
  },
  // BONUS (D-021): a única fase sorteada a cada partida, para o replay infinito; recorde separado
  {
    key: 'bonus',
    name: 'BONUS',
    goal: 'A brand-new random layout every run.',
    challenge: true,
    random: true,
    generator: {
      length: 3200, minGap: 170, roughness: 105, fuelStation: true, refuelMargin: 0.08,
      obstacles: [{ type: 'rock', count: 11, passGap: 85 }],
    },
    modifiers: [],
  },
];
