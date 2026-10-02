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
//              - fase com posto: bestRunMargin, a folga sobre a melhor corrida sem abastecer (D-018)
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
        name: 'FIRST FLIGHT',
        goal: 'Take off, fly to the crew and bring them back.',
        hint: true,
        generator: { length: 1800, minGap: 250, roughness: 45, fuelStation: false, tankSeconds: 40, obstacles: [] },
        modifiers: [],
      },
      {
        key: 'w1-2',
        name: 'ROCK FIELD',
        goal: 'Rocks ahead. Touching anything explodes the ship.',
        generator: { length: 2600, minGap: 200, roughness: 85, fuelStation: false, tankSeconds: 40, obstacles: [{ type: 'rock', count: 7, passGap: 105 }] },
        modifiers: [],
      },
      {
        key: 'w1-3',
        name: 'LONG HAUL',
        goal: 'Land on the fuel station, or fly a perfect run and skip it.',
        generator: { length: 3800, minGap: 180, roughness: 100, fuelStation: true, bestRunMargin: 0.06, obstacles: [{ type: 'rock', count: 10, passGap: 95 }] },
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
    name: 'PRACTICE',
    goal: 'The hardest run in the game. A perfect pilot never needs the fuel station.',
    challenge: true,
    generator: {
      length: 4400, minGap: 140, roughness: 130, fuelStation: true, bestRunMargin: 0.04,
      obstacles: [{ type: 'rock', count: 22, passGap: 64, spacing: 115 }],
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
