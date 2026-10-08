// Fichas de ouro (#114): corridas que denunciam qualquer mudança de regra.
//
// Cada cenário joga uma partida de verdade, com os parâmetros padrão, e anota a ficha do que aconteceu: a ordem
// dos eventos (com o passo de física em que cada um saiu), o fim, o cronômetro, o combustível, as vidas e onde
// a nave parou. As fichas ficam em ouro/fichas/. Se uma regra mudar, alguma ficha deixa de bater.
//
// Dois tipos de corrida:
//   - rotas do piloto automático em cada fase fixa (D-018 e D-026). Também mudam se o piloto automático mudar;
//   - corridas montadas para bater de cada jeito previsto nas regras (teto, chão, pedra, pouso torto ou rápido,
//     combustível no fim e fim de jogo). Não dependem do piloto automático.

import { DEFAULT_PARAMS, TRAINING_LEVEL, findLevel, createMatch, createEvents, expertRun, routeInputs, DT, NONE, UP } from '../lib.js';
import { refuelPlans } from '../../src/core/autopilot.js';
import { sampleLine } from '../../src/core/math.js';
import { STEP } from '../../src/core/constants.js';
import { DEFAULT_SHIP as CLASSIC_SHIP } from '../../src/content/ships/index.js';

const KEYS_TURN = { touchRotationSpeed: DEFAULT_PARAMS.keyRotationSpeed };   // planos com posto: o giro do teclado (D-023)

// Números com 3 casas, sem a definição da fase (grande e igual em todo evento)
function clean(value) {
  if (typeof value === 'number') return Math.round(value * 1000) / 1000;
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) if (k !== 'def' && k !== 'name' && typeof v !== 'function') out[k] = clean(v);
    return out;
  }
  return value;
}

function play(def, adjust = {}) {
  const params = { ...DEFAULT_PARAMS, ...adjust };
  const events = createEvents();
  const run = { step: 0, events: [] };
  events.on('*', (e) => run.events.push([run.step, e.name, clean(e)]));
  run.match = createMatch({ def, seed: def.seed ?? 1, getParams: () => params, events });
  run.tick = (input) => { run.match.update(DT, input); run.step += 1; };
  return run;
}

// Rota do piloto, como o playRoute dos testes: decola, voa cada trecho e espera abastecer ou embarcar
function flyLegs(run, legs) {
  const m = run.match.state;
  for (const inputs of routeInputs(m.level, run.match.params(), legs)) {
    run.tick(UP);
    for (const input of inputs) run.tick(input);
    if (m.over) return;
    for (let i = 0; i < 900 && (m.ship.state === 'boarding' || (m.ship.pad?.refuel && m.ship.fuel < 1)); i++) run.tick(NONE);
  }
}

// Comandos em trechos: [[comando, segundos], ...]
function script(run, parts) {
  for (const [input, seconds] of parts) for (let t = 0; t < seconds; t += DT) run.tick(input);
}

const padCenter = (q) => (q.x1 + q.x2) / 2;
function placeShip(run, fields) {
  Object.assign(run.match.state.ship, { state: 'flying', pad: null, vx: 0, vy: 0, a: 0, ...fields });
}

const expert = (key) => ({
  id: `${key}-expert`,
  name: `${key} · piloto expert, sem abastecer, girando como no toque`,
  def: findLevel(key),
  go(run) { flyLegs(run, expertRun(run.match.state.level, run.match.params()).legs); },
});
const refuel = (key, plan) => ({
  id: `${key}-abastece-${plan === 'going' ? 'na-ida' : 'na-volta'}`,
  name: `${key} · piloto cauteloso, abastecendo ${plan === 'going' ? 'na ida' : 'na volta'}, girando como no teclado`,
  def: findLevel(key),
  adjust: KEYS_TURN,
  go(run) { flyLegs(run, refuelPlans(run.match.state.level, run.match.params())[plan]); },
});

export const SCENARIOS = [
  expert('w1-1'), expert('w1-2'), expert('w1-3'), expert('practice'),
  refuel('w1-3', 'going'), refuel('w1-3', 'back'), refuel('practice', 'going'), refuel('practice', 'back'),
  {
    id: 'bate-no-teto',
    name: 'nível 1 · sobe reto da base até bater no teto',
    def: findLevel('w1-1'),
    go(run) { script(run, [[UP, 4]]); },
  },
  {
    id: 'encosta-no-chao',
    name: 'nível 1 · desce devagar no meio da fase, longe das plataformas',
    def: findLevel('w1-1'),
    go(run) {
      const lv = run.match.state.level;
      const x = lv.L / 2;
      placeShip(run, { x, y: sampleLine(lv.floor, x, STEP) - CLASSIC_SHIP.feet.y - 30, vy: 20 });
      script(run, [[NONE, 3]]);
    },
  },
  {
    id: 'bate-na-parede',
    name: 'nível 1 · vai de lado contra a parede do começo da fase',
    def: findLevel('w1-1'),
    go(run) {
      const q = run.match.state.level.pads.find((p) => p.kind === 'base');
      placeShip(run, { x: 40, y: q.y - 120, vx: -60 });
      script(run, [[NONE, 2]]);
    },
  },
  {
    id: 'encosta-na-pedra',
    name: 'nível 2 · vai de lado contra a primeira pedra',
    def: findLevel('w1-2'),
    go(run) {
      const rock = run.match.state.level.obstacles[0];
      placeShip(run, { x: rock.x - rock.r - 25, y: rock.y, vx: 80 });
      script(run, [[NONE, 2]]);
    },
  },
  {
    id: 'pousa-torto',
    name: 'treino · desce devagar na plataforma, inclinada demais',
    def: TRAINING_LEVEL,
    go(run) {
      const q = run.match.state.level.pads[0];
      placeShip(run, { x: padCenter(q), y: q.y - CLASSIC_SHIP.feet.y - 20, vy: 25, a: 0.45 });
      script(run, [[NONE, 2]]);
    },
  },
  {
    id: 'pousa-rapido',
    name: 'treino · desce reta na plataforma, rápido demais',
    def: TRAINING_LEVEL,
    go(run) {
      const q = run.match.state.level.pads[0];
      placeShip(run, { x: padCenter(q), y: q.y - CLASSIC_SHIP.feet.y - 20, vy: 110 });
      script(run, [[NONE, 2]]);
    },
  },
  {
    id: 'pousa-certo-no-treino',
    name: 'treino · desce devagar e reta: pousa, sem perder nada',
    def: TRAINING_LEVEL,
    go(run) {
      const q = run.match.state.level.pads[0];
      placeShip(run, { x: padCenter(q), y: q.y - CLASSIC_SHIP.feet.y - 20, vy: 25 });
      script(run, [[NONE, 2]]);
    },
  },
  {
    id: 'sem-combustivel-no-ar',
    name: 'nível 1 · combustível acaba subindo; a nave cai sem propulsor',
    def: findLevel('w1-1'),
    go(run) {
      run.match.state.ship.fuel = 0.03;
      script(run, [[UP, 3], [NONE, 4]]);
    },
  },
  {
    id: 'tres-batidas-fim-de-jogo',
    name: 'nível 1 · bate no teto três vezes seguidas: fim de jogo',
    def: findLevel('w1-1'),
    go(run) { script(run, [[UP, 25]]); },
  },
];

// Joga o cenário e devolve a ficha. adjust muda os parâmetros (o teste do alarme usa para mudar a gravidade).
export function sheetOf(scenario, adjust = {}) {
  const run = play(scenario.def, { ...scenario.adjust, ...adjust });
  scenario.go(run);
  const m = run.match.state;
  const s = m.ship;
  return {
    cenario: scenario.name,
    fase: scenario.def.key,
    semente: m.seed,
    fim: m.over ?? s.state,
    passos: run.step,
    cronometro: clean(m.timer),
    combustivel: clean(s.fuel),
    vidas: m.lives,
    nave: clean({ x: s.x, y: s.y, vx: s.vx, vy: s.vy, a: s.a }),
    eventos: run.events,
  };
}

// Uma ficha por arquivo, um evento por linha, para a diferença aparecer limpa no commit
export function formatSheet(sheet) {
  const { eventos, ...rest } = sheet;
  const head = JSON.stringify(rest, null, 2).slice(0, -2);
  return `${head},\n  "eventos": [\n${eventos.map((e) => `    ${JSON.stringify(e)}`).join(',\n')}\n  ]\n}\n`;
}

// O que mudou entre a ficha gravada e a de agora, em português; vazio se forem iguais
export function differences(before, now) {
  const out = [];
  for (const key of ['fim', 'semente', 'passos', 'cronometro', 'combustivel', 'vidas']) {
    if (before[key] !== now[key]) out.push(`${key}: ${before[key]} → ${now[key]}`);
  }
  const ship = (n) => `x ${n.x}, y ${n.y}, vx ${n.vx}, vy ${n.vy}, ângulo ${n.a}`;
  if (JSON.stringify(before.nave) !== JSON.stringify(now.nave)) out.push(`nave no fim: ${ship(before.nave)} → ${ship(now.nave)}`);
  const event = (e) => (e ? `passo ${e[0]}, ${e[1]} ${JSON.stringify(e[2])}` : 'nenhum');
  const i = before.eventos.findIndex((e, k) => JSON.stringify(e) !== JSON.stringify(now.eventos[k]));
  const first = i >= 0 ? i : (now.eventos.length > before.eventos.length ? before.eventos.length : -1);
  if (first >= 0) out.push(`evento nº ${first + 1}: ${event(before.eventos[first])} → ${event(now.eventos[first])}`);
  if (before.eventos.length !== now.eventos.length) out.push(`eventos: ${before.eventos.length} → ${now.eventos.length}`);
  return out;
}
