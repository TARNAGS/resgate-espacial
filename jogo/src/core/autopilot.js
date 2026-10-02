import { STEP, SHIP, WORLD_H } from './constants.js';
import { clamp, wrapAngle } from './math.js';
import { createShip, fly } from './ship.js';
import { contact, takeOff } from './collision.js';
import { OBSTACLES } from '../content/obstacles/index.js';

// Piloto automático: joga um cenário gerado com a física e as regras do jogo, da base até a
// tripulação e de volta, sem abastecer. Serve para duas coisas (D-018):
//   1. provar que o cenário tem um caminho que conclui a fase sem abastecer;
//   2. medir quanto combustível a melhor corrida gasta, para calcular o tamanho do tanque.
//
// Como ele voa:
//   - Mapa do espaço livre: em cada coluna do terreno, as alturas em que a nave cabe com folga
//     entre teto, chão e obstáculos.
//   - Rota: o caminho mais suave e com mais folga por esse espaço (programação dinâmica).
//   - Voo: segue a rota numa velocidade de cruzeiro, freia perto da plataforma e pousa devagar.
//     Gira na velocidade do teclado, a mais lenta dos controles, para a corrida valer para todos.
//   - Tenta várias velocidades de cruzeiro e fica com a corrida que gastou menos combustível.

const DT = 1 / 120;                      // o mesmo passo de física do jogo
const Y_STEP = 6;                        // grade vertical da rota
const ROWS = Math.floor(WORLD_H / Y_STEP) + 1;
const CLEAR_TERRAIN = 24;                // folga do centro da nave até teto e chão
const CLEAR_OBSTACLE = 22;               // folga do centro da nave até um obstáculo
const MAX_CLIMB = 4;                     // linhas da grade que a rota pode subir ou descer por coluna
const CRUISE_SPEEDS = [90, 120, 150, 180, 210, 240];
const BRAKE = 70;                        // desaceleração horizontal usada para frear (unidades/s²)
const LAND_BRAKE = 40;                   // desaceleração vertical no fim da descida
const LEG_TIMEOUT = 120;                 // segundos

// Espaço livre: free[i][j] diz se a altura j*Y_STEP cabe a nave na coluna i
function freeSpace(level) {
  const free = [];
  for (let i = 0; i < level.n; i++) {
    const x = i * STEP;
    const nb = [i - 1, i, i + 1].filter((k) => k >= 0 && k < level.n);
    const top = Math.max(...nb.map((k) => level.ceil[k])) + CLEAR_TERRAIN;
    const bottom = Math.min(...nb.map((k) => level.floor[k])) - CLEAR_TERRAIN;
    const blocked = [];
    for (const o of level.obstacles) {
      for (const dx of [-STEP / 2, 0, STEP / 2]) {
        const b = OBSTACLES[o.type].blockedAt?.(o, x + dx, CLEAR_OBSTACLE);
        if (b) blocked.push(b);
      }
    }
    const col = new Array(ROWS);
    for (let j = 0; j < ROWS; j++) {
      const y = j * Y_STEP;
      col[j] = y >= top && y <= bottom && !blocked.some(([a, b]) => y >= a && y <= b);
    }
    free.push(col);
  }
  return free;
}

// Distância (em linhas) até a altura bloqueada mais próxima na mesma coluna, até 5
function clearance(col, j) {
  for (let d = 1; d <= 5; d++) if (!col[j - d] || !col[j + d]) return d;
  return 5;
}

// Custo de mudar de altura: subir gasta mais combustível que descer
const climbCost = (d) => (d < 0 ? -2 * d : d) + 0.5 * d * d;

// Linha livre mais baixa (perto do chão) de uma coluna: a altura de quem acabou de decolar
const lowestFree = (col) => { for (let j = col.length - 1; j >= 0; j--) if (col[j]) return j; return -1; };

// Rota da coluna da plataforma `a` até a da plataforma `b`: uma altura por coluna
function planPath(level, free, a, b) {
  const dir = Math.sign(b - a);
  const cols = [];
  for (let i = a; i !== b + dir; i += dir) cols.push(i);
  const INF = Infinity;
  let cost = new Array(ROWS).fill(INF);
  const from = [];
  const start = lowestFree(free[cols[0]]);
  for (let j = 0; j < ROWS; j++) if (free[cols[0]][j]) cost[j] = 6 / clearance(free[cols[0]], j) + climbCost(j - start);
  for (let c = 1; c < cols.length; c++) {
    const col = free[cols[c]];
    const next = new Array(ROWS).fill(INF);
    const back = new Array(ROWS).fill(-1);
    for (let j = 0; j < ROWS; j++) {
      if (!col[j]) continue;
      const here = 6 / clearance(col, j);
      for (let d = -MAX_CLIMB; d <= MAX_CLIMB; d++) {
        const k = j + d;
        if (k < 0 || k >= ROWS || cost[k] === INF) continue;
        const v = cost[k] + climbCost(d) + here;
        if (v < next[j]) { next[j] = v; back[j] = k; }
      }
    }
    from.push(back);
    cost = next;
  }
  // Chegada: descer da rota até a plataforma também conta
  const end = lowestFree(free[cols[cols.length - 1]]);
  const total = cost.map((v, k) => v + climbCost(end - k));
  let j = total.indexOf(Math.min(...total));
  if (total[j] === INF) return null;
  const rows = [j];
  for (let c = from.length - 1; c >= 0; c--) { j = from[c][j]; rows.push(j); }
  rows.reverse();
  // Suaviza a rota onde a suavização não encosta em nada
  const ys = rows.map((r) => r * Y_STEP);
  const smooth = ys.map((y, c) => {
    const win = ys.slice(Math.max(0, c - 3), c + 4);
    const avg = win.reduce((s, v) => s + v, 0) / win.length;
    return free[cols[c]][Math.round(avg / Y_STEP)] ? avg : y;
  });
  return { cols, ys: smooth };
}

// Altura e inclinação da rota numa posição x
function pathAt(path, x) {
  const { cols, ys } = path;
  const lo = Math.min(cols[0], cols[cols.length - 1]) * STEP;
  const hi = Math.max(cols[0], cols[cols.length - 1]) * STEP;
  const xc = clamp(x, lo, hi);
  const f = Math.abs(xc - cols[0] * STEP) / STEP;
  const i = Math.min(ys.length - 2, Math.floor(f));
  const t = f - i;
  const y = ys[i] + (ys[i + 1] - ys[i]) * t;
  const slope = ((ys[i + 1] - ys[i]) / STEP) * Math.sign(cols[cols.length - 1] - cols[0]);
  return { y, slope };
}

// Um trecho: decola de uma plataforma e pousa na outra. Devolve { fuel, x }: os segundos de propulsor
// e onde a nave parou na plataforma (a partida não recentraliza a nave), ou null.
// Com `record`, guarda o comando de cada passo (para reproduzir a corrida numa partida de verdade).
function flyLeg(level, p, path, fromPad, toPad, cruise, crewOnBoard, startX = null, record = null) {
  const sim = { ...p, tankSeconds: 1e9, touchRotationSpeed: p.keyRotationSpeed };
  const g = p.gravity + (crewOnBoard ? p.crewWeight : 0);
  const T = p.thrust;
  const target = (toPad.x1 + toPad.x2) / 2;
  const padTop = toPad.y - SHIP.base;
  const s = createShip(fromPad, 1);
  if (startX !== null) s.x = startX;
  takeOff(s);
  let thrustTime = 0, pwm = 0, landing = false;
  for (let t = 0; t < LEG_TIMEOUT; t += DT) {
    const dx = target - s.x;
    const dist = Math.abs(dx);
    // Pouso: em cima da plataforma e quase parado, desce devagar e reto
    if (!landing && dist < 14 && Math.abs(s.vx) < 22) landing = true;
    let vxDes, vyDes, maxTilt;
    if (landing) {
      // Desce quase em queda livre e só freia no fim, como faria um bom piloto
      vxDes = clamp(dx * 2, -18, 18);
      vyDes = clamp(Math.sqrt(2 * LAND_BRAKE * Math.max(0, padTop - s.y - 3)), 12, 150);
      maxTilt = 0.25;
    } else {
      // Cruzeiro: velocidade constante, freando a tempo de parar em cima da plataforma
      vxDes = Math.sign(dx) * Math.min(cruise, Math.sqrt(2 * BRAKE * dist));
      const look = clamp(Math.abs(s.vx) * 0.35, 15, 110);
      const ahead = pathAt(path, s.x + Math.sign(dx) * look);
      const here = pathAt(path, s.x);
      vyDes = clamp((ahead.y - s.y) * 2.2 + here.slope * s.vx, -cruise, cruise);
      maxTilt = 1.2;
    }
    const ax = clamp(2.5 * (vxDes - s.vx), -T, T);
    const ay = clamp(3.5 * (vyDes - s.vy), -T, T);
    // Aceleração que o propulsor precisa dar (y para baixo; a gravidade puxa para baixo)
    // A altura tem prioridade: a força para o lado fica limitada ao que a inclinação máxima
    // permite sem o propulsor empurrar a nave para cima ou para baixo além do pedido
    const up = Math.max(0, g - ay);
    const fxLim = up * Math.tan(maxTilt);
    const fx = clamp(ax - p.windX, -fxLim, fxLim);
    const want = up > 0 ? Math.atan2(fx, up) : s.a;
    const need = Math.min(1, Math.hypot(fx, up) / T);
    const aligned = Math.cos(wrapAngle(want - s.a)) > 0.95;
    pwm += need;
    let thrust = false;
    if (pwm >= 1) { pwm -= 1; thrust = aligned; }
    const intent = { turn: 0, targetAngle: want, thrust };
    record?.push(intent);
    fly(s, intent, sim, DT, { crewOnBoard });
    if (s.thrusting) thrustTime += DT;
    const c = contact(level, s, sim);
    if (c?.crash) return null;
    if (c?.land) return c.land === toPad ? { fuel: thrustTime, x: s.x } : null;   // pousar no posto não vale
  }
  return null;
}

// Melhor corrida sem abastecer, ou null se o piloto não conseguir concluir
export function bestRun(level, params) {
  const base = level.pads.find((q) => q.kind === 'base');
  const crew = level.pads.find((q) => q.kind === 'crew');
  if (!base || !crew) return null;
  if (level.obstacles.some((o) => !OBSTACLES[o.type].blockedAt)) return null;
  const free = freeSpace(level);
  const col = (pad) => Math.round((pad.x1 + pad.x2) / 2 / STEP);
  const there = planPath(level, free, col(base), col(crew));
  const back = planPath(level, free, col(crew), col(base));
  if (!there || !back) return null;
  const best = (path, from, to, crewOnBoard, startX) => {
    let min = null;
    for (const v of CRUISE_SPEEDS) {
      const r = flyLeg(level, params, path, from, to, Math.min(v, params.maxSpeed * 0.9), crewOnBoard, startX);
      if (r && (min === null || r.fuel < min.fuel)) min = { ...r, cruise: v, startX, path };
    }
    return min;
  };
  const go = best(there, base, crew, false, null);
  if (!go) return null;
  const ret = best(back, crew, base, true, go.x);   // a volta começa onde a ida pousou
  if (!ret) return null;
  return { thrustSeconds: go.fuel + ret.fuel, legs: [go, ret] };
}

// Comandos da melhor corrida, passo a passo, para cada trecho (ida e volta)
export function bestRunInputs(level, params, run) {
  const base = level.pads.find((q) => q.kind === 'base');
  const crew = level.pads.find((q) => q.kind === 'crew');
  const legs = [[base, crew, false], [crew, base, true]];
  return run.legs.map((leg, i) => {
    const record = [];
    const [from, to, crewOnBoard] = legs[i];
    flyLeg(level, params, leg.path, from, to, Math.min(leg.cruise, params.maxSpeed * 0.9), crewOnBoard, leg.startX, record);
    return record;
  });
}
