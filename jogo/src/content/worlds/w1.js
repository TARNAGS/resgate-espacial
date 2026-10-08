// Mundo 1 (#118: um arquivo por mundo). Os campos de cada fase estão explicados em content/worlds.js.
// Os 3 níveis do MVP (D-009) ficam aqui, com cenário fixo (D-021). Design do mundo: docs/mundos/.

export const W1 = {
  key: 'w1',
  name: 'WORLD 1',
  theme: {
    sky: ['#0b1020', '#03040a'],
    rockFill: '#2a2140',
    rock: '#c08cff',
    terrainFill: '#121a29',
    terrain: '#46e0c8',
    terrainGlow: 'rgba(70,224,200,0.16)',
  },
  modifiers: [],
  levels: [
    {
      key: 'w1-1',
      seed: 101,                 // cenário fixo, igual para todos (D-021)
      name: 'FIRST FLIGHT',
      goal: 'Take off, fly to the crew and bring them back.',
      hint: true,
      generator: { length: 1800, minGap: 225, roughness: 60, fuelStation: false, tankSeconds: 40, tank: 40, obstacles: [] },
      modifiers: [],
    },
    {
      key: 'w1-2',
      seed: 202,
      name: 'ROCK FIELD',
      goal: 'Rocks ahead. Touching anything explodes the ship.',
      generator: { length: 2600, minGap: 185, roughness: 95, fuelStation: false, tankSeconds: 40, tank: 40, obstacles: [{ type: 'rock', count: 9, passGap: 95 }] },
      modifiers: [],
    },
    {
      key: 'w1-3',
      seed: 303,
      name: 'LONG HAUL',
      goal: 'Too far for one tank: refuel once, on the way there or back.',
      generator: { length: 3800, minGap: 165, roughness: 110, fuelStation: true, refuelMargin: 0.08, tank: 33.43, obstacles: [{ type: 'rock', count: 12, passGap: 85 }] },
      modifiers: [],
    },
  ],
};
