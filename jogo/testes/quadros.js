// Quadros de teste do desenho (#113 e #123): situações da partida e variações da tela, montadas numa partida de
// verdade e desenhadas na tela de mentira. Servem ao teste "o desenho só lê" e ao desenho de ouro.

import { DEFAULT_PARAMS, LEVELS, CHALLENGES, TRAINING_LEVEL, createMatch, createEvents, CLASSIC_SHIP, DT, UP, step } from './lib.js';
import { createRenderer } from '../src/render/renderer.js';
import { createFakeCanvas, createFakeView, fakeJoystick, deepCopy, deepFreeze } from './tela-de-mentira.js';

const padOf = (m, kind) => m.level.pads.find((q) => q.kind === kind);
const fly = (match, fuel) => { step(match, UP, 0.3); if (fuel !== undefined) match.state.ship.fuel = fuel; };

// Situações da partida, montadas numa partida de verdade antes de congelar
export const SITUATIONS = {
  'pousada na base': () => {},
  'voando com o propulsor aceso': (match) => step(match, UP, 0.5),
  'descendo para pousar, com o aviso de pouso': (match) => {
    const q = padOf(match.state, 'base');
    Object.assign(match.state.ship, { state: 'flying', pad: null, x: (q.x1 + q.x2) / 2, y: q.y - 40, vx: 0, vy: 30, a: 0 });
  },
  'embarcando a tripulação': (match) => {
    const q = padOf(match.state, 'crew');
    if (!q) return;
    Object.assign(match.state.ship, { state: 'boarding', pad: q, x: (q.x1 + q.x2) / 2, y: q.y - CLASSIC_SHIP.feet.y, vx: 0, vy: 0, a: 0 });
    match.state.boardingT = 0.9;
  },
  'tripulação a bordo, combustível baixo': (match) => { fly(match, 0.15); match.state.crewOnBoard = true; },
  'combustível quase no fim': (match) => fly(match, 0.05),
  'sem combustível': (match) => fly(match, 0),
  'explodindo': (match) => { fly(match); Object.assign(match.state.ship, { state: 'exploding', explodeT: 0.4 }); },
  'fim de jogo': (match) => { match.state.lives = 0; match.state.over = 'gameOver'; },
};

// Variações da tela: menu com a DEMO ao fundo, DEMO, botões e painel de ajuste, polegar no direcional, parado
export const SCENES = [
  {},
  { attract: true },
  { demo: { label: 'THRUST TO TAKE OFF', thrust: true, twin: false } },
  { buttons: [{ id: 'pause', x: 800, y: 30, r: 18 }, { id: 'tuning', label: 'T', x: 760, y: 30, r: 18 }], tuned: true },
  { joy: { cx: 90, cy: 320, x: 130, y: 300 }, thrustHeld: true },
  { idle: true },
];

// Monta o estado, congela uma cópia e entrega ao desenho. Devolve as anotações da tela de mentira.
export function drawFrozen(def, prepare, draw, { isTouch = true, scheme = 'twin', skin = 'classic' } = {}) {
  const P = { ...DEFAULT_PARAMS, touchScheme: scheme, skin };
  // A BONUS sorteia e prova cada cenário com o piloto automático; para o desenho, basta um cenário fixo
  const fixed = def.seed != null && def.generator.tank != null ? def : { ...def, seed: 1, generator: { ...def.generator, tank: 40 } };
  const match = createMatch({ def: fixed, seed: fixed.seed, getParams: () => P, events: createEvents() });
  prepare(match);
  const frozen = { state: deepFreeze(deepCopy(match.state)) };
  const params = deepFreeze({ ...match.params() });
  const fake = createFakeCanvas();
  draw(createRenderer(fake.canvas, createFakeView({ isTouch })), frozen, params);
  return fake.calls;
}

// Tudo o que o laço do jogo e os avisos pedem ao desenho, num quadro e em alguns passos seguintes
export function playFrames(renderer, match, params) {
  const s = match.state.ship;
  renderer.resetCamera(match, params);
  renderer.message('CREW ON BOARD · BACK TO BASE!', 3);
  renderer.praise('CLOSE CALL!', s.x, s.y);
  renderer.explosion(s.x, s.y);
  renderer.noFuel();
  renderer.lowFuel();
  for (let i = 0; i < 3; i++) {
    renderer.update(DT, match, params);
    for (const extra of SCENES) {
      renderer.draw(1000 + i * 16, {
        match, theme: match.state.def.world.theme, params, joy: null, joystick: fakeJoystick, thrustHeld: false,
        schemeName: 'A', idle: false, buttons: [], tuned: false, demo: null, attract: false, ...extra,
      });
    }
  }
  renderer.draw(2000, { match: null, theme: match.state.def.world.theme, params, buttons: [] });   // menu sem partida
}
