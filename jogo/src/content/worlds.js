// Conteúdo do jogo: mundos e níveis. Criar ou mudar uma fase é editar esta tabela, sem mexer na lógica.
//
// A diferença entre mundo e fase ainda está em aberto (P-011, #60). Por enquanto, os 3 níveis do MVP
// (D-009) ficam num mundo só. Cada mundo tem visual próprio (theme) e pode ter modificadores próprios;
// cada nível define as regras do gerador e o cenário muda a cada partida (D-014).
//
// Campos do nível:
//   key        identificador salvo no aparelho; nunca mudar depois de publicado
//   name, goal textos do jogo (em inglês, D-007)
//   hint       dicas de controle na tela (o tutorial ainda está em aberto, P-009)
//   generator  regras do cenário: comprimento, corredor mínimo, relevo, posto e obstacles (lista com as
//              opções de cada tipo do catálogo, content/obstacles). Tanque, em segundos de propulsor:
//              - fase com posto: refuelMargin, a folga sobre o melhor plano com um abastecimento (D-023)
//              - fase sem posto: tankSeconds, o mínimo (o gerador aumenta se a melhor corrida pedir)
//   modifiers  lista de modificadores (content/modifiers.js); vazia até P-012 ser decidida

const SPACE_THEME = {
  sky: ['#0b1020', '#03040a'],
  rockFill: '#2a2140',
  rock: '#c08cff',
  terrainFill: '#121a29',
  terrain: '#46e0c8',
  terrainGlow: 'rgba(70,224,200,0.16)',
};

export const WORLDS = [
  {
    key: 'w1',
    name: 'WORLD 1',
    theme: SPACE_THEME,
    modifiers: [],
    levels: [
      {
        key: 'w1-1',
        seed: 101,                 // cenário fixo, igual para todos (D-021)
        name: 'FIRST FLIGHT',
        goal: 'Take off, fly to the crew and bring them back.',
        hint: true,
        generator: { length: 1800, minGap: 225, roughness: 60, fuelStation: false, tankSeconds: 40, obstacles: [] },
        modifiers: [],
      },
      {
        key: 'w1-2',
        seed: 202,
        name: 'ROCK FIELD',
        goal: 'Rocks ahead. Touching anything explodes the ship.',
        generator: { length: 2600, minGap: 185, roughness: 95, fuelStation: false, tankSeconds: 40, obstacles: [{ type: 'rock', count: 9, passGap: 95 }] },
        modifiers: [],
      },
      {
        key: 'w1-3',
        seed: 303,
        name: 'LONG HAUL',
        goal: 'Too far for one tank: refuel once, on the way there or back.',
        generator: { length: 3800, minGap: 165, roughness: 110, fuelStation: true, refuelMargin: 0.08, obstacles: [{ type: 'rock', count: 12, passGap: 85 }] },
        modifiers: [],
      },
    ],
  },
];

// Cenário de treino, TRAINING (#35): chão, paredes e uma plataforma, sem tripulação e sem fim de jogo.
// Serve para o testador treinar decolar e pousar, e para calibrar com o painel de ajuste (#42).
export const TRAINING = {
  key: 'training',
  name: 'TRAINING',
  goal: 'Take off, fly around and land back on the pad.',
  hint: true,
  training: true,
  generator: { kind: 'training', length: 1400, tankSeconds: 40, obstacles: [] },
  modifiers: [],
};

// Desafios: fases fora da sequência, sempre liberadas no mapa.
// PRACTICE é a fase mais difícil do jogo, para testar os controles e levar o jogo ao limite.
export const CHALLENGES = [
  {
    key: 'practice',
    seed: 293233524,          // a primeira semente fixa com caminho provado (a 404 foi trocada pelo gerador)
    name: 'PRACTICE',
    goal: 'The hardest run in the game. Plan your one refuel well.',
    challenge: true,
    generator: {
      length: 4400, minGap: 125, roughness: 135, fuelStation: true, refuelMargin: 0.05,
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
].map((level) => ({ ...level, world: WORLDS[0], number: null }));

// Todos os níveis na ordem do jogo, cada um com o mundo a que pertence e o número para mostrar
export const LEVELS = WORLDS.flatMap((world) =>
  world.levels.map((level) => ({ ...level, world, modifiers: [...world.modifiers, ...level.modifiers] })),
).map((level, i) => ({ ...level, number: i + 1 }));

export const TRAINING_LEVEL = { ...TRAINING, world: WORLDS[0], number: 0 };

export const findLevel = (key) => (key === TRAINING.key ? TRAINING_LEVEL : [...LEVELS, ...CHALLENGES].find((l) => l.key === key));
