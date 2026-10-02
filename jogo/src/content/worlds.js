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
//   generator  regras do cenário: comprimento, corredor mínimo, relevo, posto e tanque (segundos de propulsor)
//              e obstacles, uma lista com as opções de cada tipo do catálogo (content/obstacles)
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
        goal: 'Too far for one tank: land on the fuel station.',
        generator: { length: 3800, minGap: 180, roughness: 100, fuelStation: true, tankSeconds: 26, obstacles: [{ type: 'rock', count: 10, passGap: 95 }] },
        modifiers: [],
      },
    ],
  },
];

// Cenário de treino (#35): chão, paredes e uma plataforma, sem tripulação e sem fim de jogo.
// Serve para o testador treinar decolar e pousar, e para calibrar com o painel de ajuste (#42).
export const PRACTICE = {
  key: 'practice',
  name: 'PRACTICE',
  goal: 'Take off, fly around and land back on the pad.',
  hint: true,
  practice: true,
  generator: { kind: 'practice', length: 1400, tankSeconds: 40, obstacles: [] },
  modifiers: [],
};

// Todos os níveis na ordem do jogo, cada um com o mundo a que pertence e o número para mostrar
export const LEVELS = WORLDS.flatMap((world) =>
  world.levels.map((level) => ({ ...level, world, modifiers: [...world.modifiers, ...level.modifiers] })),
).map((level, i) => ({ ...level, number: i + 1 }));

export const PRACTICE_LEVEL = { ...PRACTICE, world: WORLDS[0], number: 0 };

export const findLevel = (key) => (key === PRACTICE.key ? PRACTICE_LEVEL : LEVELS.find((l) => l.key === key));
