import { STEP, WORLD_H } from './constants.js';
import { DEFAULT_SHIP, shipRadius } from '../content/ships/index.js';
import { clamp, wrapAngle } from './math.js';
import { createShip, fly } from './ship.js';
import { contact, takeOff } from './collision.js';
import { OBSTACLES } from '../content/obstacles/index.js';

// Piloto automático: joga um cenário gerado com a física e as regras do jogo, de plataforma em
// plataforma. Há dois jeitos de voar, com o mesmo mapa do espaço livre e a mesma rota de partida:
//
// 1. Cauteloso (D-018 e D-023): prova que o cenário tem solução e calcula o tanque das fases.
//    - Rota: o caminho mais suave e com mais folga pelo espaço livre (programação dinâmica).
//    - Voo: segue a rota numa velocidade de cruzeiro, freia perto da plataforma e pousa devagar.
//      Gira na velocidade do teclado, a mais lenta dos controles, para a corrida valer para todos.
//    - Tenta várias velocidades de cruzeiro e fica com a corrida que gastou menos combustível.
//    Ele paira compensando a gravidade e gasta bem mais que um bom jogador.
//
// 2. Expert (D-026, #92): voa como os melhores jogadores, para medir o melhor que dá para fazer.
//    Mais abaixo, na seção "Piloto expert".
//
// Mapa do espaço livre: em cada coluna do terreno, as alturas em que a nave cabe com folga
// entre teto, chão e obstáculos.

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
// As folgas foram medidas com a nave clássica; uma nave que muda o jogo e é maior ganha a diferença de raio (#122)
function freeSpace(level, ship = DEFAULT_SHIP) {
  const extra = Math.max(0, shipRadius(ship) - shipRadius(DEFAULT_SHIP));
  const free = [];
  for (let i = 0; i < level.n; i++) {
    const x = i * STEP;
    const nb = [i - 1, i, i + 1].filter((k) => k >= 0 && k < level.n);
    const top = Math.max(...nb.map((k) => level.ceil[k])) + CLEAR_TERRAIN + extra;
    const bottom = Math.min(...nb.map((k) => level.floor[k])) - CLEAR_TERRAIN - extra;
    const blocked = [];
    for (const o of level.obstacles) {
      for (const dx of [-STEP / 2, 0, STEP / 2]) {
        const b = OBSTACLES[o.type].blockedAt?.(o, x + dx, CLEAR_OBSTACLE + extra);
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

// Rota da coluna da plataforma `a` até a da plataforma `b`: uma altura por coluna.
// Pesos: `clear` dá preferência à folga (o meio do corredor) e `climb` evita subir e descer.
// Pesos menores mudam o lado por onde a rota passa das pedras (o piloto expert tenta mais de um).
function planPath(level, free, a, b, { clear = 6, climb = 1 } = {}) {
  const dir = Math.sign(b - a);
  const cols = [];
  for (let i = a; i !== b + dir; i += dir) cols.push(i);
  const INF = Infinity;
  let cost = new Array(ROWS).fill(INF);
  const from = [];
  const start = lowestFree(free[cols[0]]);
  for (let j = 0; j < ROWS; j++) if (free[cols[0]][j]) cost[j] = clear / clearance(free[cols[0]], j) + climb * climbCost(j - start);
  for (let c = 1; c < cols.length; c++) {
    const col = free[cols[c]];
    const next = new Array(ROWS).fill(INF);
    const back = new Array(ROWS).fill(-1);
    for (let j = 0; j < ROWS; j++) {
      if (!col[j]) continue;
      const here = clear / clearance(col, j);
      for (let d = -MAX_CLIMB; d <= MAX_CLIMB; d++) {
        const k = j + d;
        if (k < 0 || k >= ROWS || cost[k] === INF) continue;
        const v = cost[k] + climb * climbCost(d) + here;
        if (v < next[j]) { next[j] = v; back[j] = k; }
      }
    }
    from.push(back);
    cost = next;
  }
  // Chegada: descer da rota até a plataforma também conta
  const end = lowestFree(free[cols[cols.length - 1]]);
  const total = cost.map((v, k) => v + climb * climbCost(end - k));
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

// Comando de um passo: o propulsor precisa dar a aceleração (ax, ay) e ainda vencer a gravidade g
// (y para baixo). A altura tem prioridade: a força para o lado fica limitada ao que a inclinação
// máxima permite sem o propulsor empurrar a nave para cima ou para baixo além do pedido. Como o dedo
// do jogador, o propulsor liga e desliga, na proporção da força pedida (ctl.pwm acumula a fração).
function command(s, ax, ay, g, p, maxTilt, ctl) {
  const up = Math.max(0, g - ay);
  const fxLim = up * Math.tan(maxTilt);
  const fx = clamp(ax - p.windX, -fxLim, fxLim);
  const want = up > 0 ? Math.atan2(fx, up) : s.a;
  const need = Math.min(1, Math.hypot(fx, up) / p.thrust);
  const aligned = Math.cos(wrapAngle(want - s.a)) > 0.95;
  ctl.pwm += need;
  let thrust = false;
  if (ctl.pwm >= 1) { ctl.pwm -= 1; thrust = aligned; }
  return { turn: 0, targetAngle: want, thrust };
}

// Um trecho: decola de uma plataforma e pousa na outra. Devolve { fuel, x }: os segundos de propulsor
// e onde a nave parou na plataforma (a partida não recentraliza a nave), ou null.
// Com `record`, guarda o comando de cada passo (para reproduzir a corrida numa partida de verdade).
function flyLeg(level, p, path, fromPad, toPad, cruise, crewOnBoard, startX = null, record = null, ship = DEFAULT_SHIP) {
  const sim = { ...p, tankSeconds: 1e9, touchRotationSpeed: p.keyRotationSpeed };
  const g = p.gravity + (crewOnBoard ? p.crewWeight : 0);
  const T = p.thrust;
  const target = (toPad.x1 + toPad.x2) / 2;
  const padTop = toPad.y - ship.feet.y;
  const s = createShip(fromPad, 1, ship);
  if (startX !== null) s.x = startX;
  takeOff(s);
  let thrustTime = 0, landing = false;
  const ctl = { pwm: 0 };
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
    const intent = command(s, ax, ay, g, p, maxTilt, ctl);
    record?.push(intent);
    fly(s, intent, sim, DT, { crewOnBoard });
    if (s.thrusting) thrustTime += DT;
    const c = contact(level, s, sim, ship);
    if (c?.crash) return null;
    if (c?.land) return c.land === toPad ? { fuel: thrustTime, x: s.x } : null;   // pousar no posto não vale
  }
  return null;
}

// Voa uma rota de plataforma em plataforma (por exemplo: base, posto, tripulação, base), sem
// abastecer no caminho. Cada trecho começa onde o anterior pousou. Devolve os trechos, ou null.
function flyRoute(level, params, free, kinds, ship = DEFAULT_SHIP) {
  const pads = kinds.map((k) => level.pads.find((q) => q.kind === k));
  if (pads.some((p) => !p)) return null;
  const col = (pad) => Math.round((pad.x1 + pad.x2) / 2 / STEP);
  const legs = [];
  let startX = null, crewOnBoard = false;
  for (let i = 0; i + 1 < pads.length; i++) {
    const from = pads[i], to = pads[i + 1];
    if (from.kind === 'crew') crewOnBoard = true;
    const path = planPath(level, free, col(from), col(to));
    if (!path) return null;
    let min = null;
    for (const v of CRUISE_SPEEDS) {
      const r = flyLeg(level, params, path, from, to, Math.min(v, params.maxSpeed * 0.9), crewOnBoard, startX, null, ship);
      if (r && (min === null || r.fuel < min.fuel)) min = { ...r, cruise: v, startX, path, from: from.kind, to: to.kind, crewOnBoard };
    }
    if (!min) return null;
    legs.push(min);
    startX = min.x;
  }
  return legs;
}

const sum = (legs) => legs.reduce((n, l) => n + l.fuel, 0);

// Melhor corrida sem abastecer (base, tripulação, base), ou null se o piloto não conseguir concluir
export function bestRun(level, params, ship = DEFAULT_SHIP) {
  if (level.obstacles.some((o) => !OBSTACLES[o.type].blockedAt)) return null;
  const legs = flyRoute(level, params, freeSpace(level, ship), ['base', 'crew', 'base'], ship);
  return legs && { thrustSeconds: sum(legs), legs };
}

// Fases com posto (D-023): os dois planos com um abastecimento, na ida ou na volta.
// tank é o menor tanque que permite os dois; full é o gasto da corrida sem abastecer.
export function refuelPlans(level, params, ship = DEFAULT_SHIP) {
  if (level.obstacles.some((o) => !OBSTACLES[o.type].blockedAt)) return null;
  const free = freeSpace(level, ship);
  const full = flyRoute(level, params, free, ['base', 'crew', 'base'], ship);
  const going = flyRoute(level, params, free, ['base', 'fuel', 'crew', 'base'], ship);
  const back = flyRoute(level, params, free, ['base', 'crew', 'fuel', 'base'], ship);
  if (!full || !going || !back) return null;
  const goingTank = Math.max(going[0].fuel, going[1].fuel + going[2].fuel);
  const backTank = Math.max(back[0].fuel + back[1].fuel, back[2].fuel);
  return { full: sum(full), tank: Math.max(goingTank, backTank), going, back };
}

// ===== Piloto expert (D-026, #92) =====
// Voa como os melhores jogadores. Nas palavras do Fernando, o mais rápido do playtest: acelera forte
// apontando para a tripulação, deixa a nave ir, vira e freia no sentido contrário na hora certa e,
// no pouso, solta os controles assim que a nave fica verde.
//   - Rota esticada: parte da rota com folga e a estica como um elástico preso nas duas plataformas,
//     sem sair do espaço livre. Quanto mais reta a rota, mais rápido dá para voar.
//   - Perfil de velocidade: o mais rápido possível em cada ponto da rota, limitado pelas curvas (a
//     altura precisa mudar a tempo), pela aceleração e pela frenagem, até parar em cima da plataforma.
//   - Voo: segue o perfil e antecipa as curvas da rota; no pouso, desce quase em queda livre e toca a
//     plataforma ainda descendo, dentro do limite de pouso.
//   - Tenta algumas rotas (por cima ou por baixo das pedras) e alguns ajustes, e fica com o trecho
//     que gastou menos combustível.
// Voar rápido gasta menos, porque a nave fica menos tempo no ar vencendo a gravidade. Nos trechos
// retos, ele gasta só o que a gravidade exige: gravidade ÷ propulsor = 44% do tempo.

const EXPERT = {
  cruise: 250,        // velocidade máxima desejada (a física limita a 260)
  accel: 90,          // aceleração horizontal planejada (unidades/s²)
  brake: 85,          // frenagem horizontal planejada
  aDown: 50,          // aceleração vertical disponível nas cristas da rota (a gravidade puxa)
  aUp: 55,            // e nos vales (o propulsor empurra)
  stencils: [4],      // janelas, em colunas, para medir as curvas da rota
  vMin: 30,           // velocidade mínima do perfil
  vStart: 40,         // velocidade logo depois de decolar
  lead: 0.35,         // segundos de antecipação do perfil (o tempo de virar a nave para frear)
  kx: 3, kp: 1.5, kv: 2.5,   // ganhos: velocidade horizontal, altura e velocidade vertical
  maxTilt: 1.3,       // inclinação máxima no voo (rad)
  landBrake: 68,      // frenagem vertical no fim da descida
  touch: 50,          // velocidade de descida ao tocar a plataforma (o limite é 65)
};

// Rotas de partida (lados das pedras) e ajustes que o piloto tenta em cada trecho
const EXPERT_ROUTES = [{}, { clear: 2 }, { clear: 1, climb: 0.4 }];
const EXPERT_TRIES = [];
for (const stencils of [[4], [2, 3, 4]]) {
  for (const margin of [4, 12]) {
    for (const cruise of [250, 215]) for (const brake of [85, 100]) EXPERT_TRIES.push({ stencils, margin, cruise, brake });
  }
}

// A nave cabe na altura y desta coluna com uma folga extra (além da do mapa do espaço livre)?
function freeAt(col, y, margin) {
  for (let j = Math.floor((y - margin) / Y_STEP); j <= Math.ceil((y + margin) / Y_STEP); j++) if (!col[j]) return false;
  return true;
}

// Rota esticada: puxa cada ponto para a reta entre os vizinhos enquanto houver espaço livre, e
// depois arredonda as quinas que sobraram
function tautPath(free, path, margin) {
  const { cols } = path;
  const ys = path.ys.slice();
  const n = ys.length;
  const fits = (i, y) => [i - 1, i, i + 1].every((k) => freeAt(free[cols[clamp(k, 0, n - 1)]], y, margin));
  for (let it = 0; it < 400; it++) {
    let moved = false;
    for (let i = 1; i < n - 1; i++) {
      const step = (ys[i - 1] + ys[i + 1]) / 2 - ys[i];
      if (Math.abs(step) < 0.05) continue;
      const f = [1, 0.5, 0.25].find((k) => fits(i, ys[i] + step * k));
      if (f) { ys[i] += step * f; moved = true; }
    }
    if (!moved) break;
  }
  for (let r = 0; r < 2; r++) {
    for (let i = 2; i < n - 2; i++) {
      const y = (ys[i - 2] + ys[i - 1] + ys[i] + ys[i + 1] + ys[i + 2]) / 5;
      if (fits(i, y)) ys[i] = y;
    }
  }
  return { cols, ys };
}

// Curva da rota (segunda derivada da altura, y para baixo) na coluna i, numa janela de k colunas
const bend = (ys, i, k) => (ys[i + k] - 2 * ys[i] + ys[i - k]) / ((k * STEP) ** 2);

// Velocidade horizontal desejada em cada coluna da rota
function speedProfile(path, o) {
  const { ys } = path;
  const n = ys.length;
  const v = new Array(n).fill(o.cruise);
  for (const k of o.stencils) {
    for (let i = k; i < n - k; i++) {
      const d2 = bend(ys, i, k);
      const a = d2 > 0 ? o.aDown : o.aUp;   // crista: a gravidade puxa; vale: o propulsor empurra
      if (Math.abs(d2) > 1e-6) v[i] = Math.min(v[i], Math.max(o.vMin, Math.sqrt(a / Math.abs(d2))));
    }
  }
  v[n - 1] = 0;
  for (let i = n - 2; i >= 0; i--) v[i] = Math.min(v[i], Math.sqrt(v[i + 1] ** 2 + 2 * o.brake * STEP));   // frear a tempo
  v[0] = Math.min(v[0], o.vStart);
  for (let i = 1; i < n; i++) v[i] = Math.min(v[i], Math.sqrt(v[i - 1] ** 2 + 2 * o.accel * STEP));       // acelerar até lá
  return v;
}

// Índice (fracionário) da coluna da rota na posição x
const pathIndex = (path, x) => clamp(Math.abs(x - path.cols[0] * STEP) / STEP, 0, path.ys.length - 1);
function profileAt(path, prof, x) {
  const f = pathIndex(path, x);
  const i = Math.min(prof.length - 2, Math.floor(f));
  return prof[i] + (prof[i + 1] - prof[i]) * (f - i);
}
function bendAt(path, x, k = 4) {
  const i = Math.round(pathIndex(path, x));
  return i - k < 0 || i + k >= path.ys.length ? 0 : bend(path.ys, i, k);
}

// Um trecho do piloto expert. Mesmo contrato do flyLeg; `rot` é a velocidade de giro usada.
function flyLegExpert(level, p, path, fromPad, toPad, o, rot, crewOnBoard, startX = null, record = null, ship = DEFAULT_SHIP) {
  const sim = { ...p, tankSeconds: 1e9, touchRotationSpeed: rot };
  const g = p.gravity + (crewOnBoard ? p.crewWeight : 0);
  const T = p.thrust;
  const target = (toPad.x1 + toPad.x2) / 2;
  const padTop = toPad.y - ship.feet.y;
  const prof = speedProfile(path, o);
  const s = createShip(fromPad, 1, ship);
  if (startX !== null) s.x = startX;
  takeOff(s);
  let thrustTime = 0, landing = false;
  const ctl = { pwm: 0 };
  for (let t = 0; t < LEG_TIMEOUT; t += DT) {
    const dx = target - s.x;
    const dist = Math.abs(dx);
    if (!landing && dist < 18 && Math.abs(s.vx) < 28) landing = true;
    let vxDes, vyDes, maxTilt, ff = 0;
    if (landing) {
      // Desce quase em queda livre e chega à plataforma ainda descendo, dentro do limite
      vxDes = clamp(dx * 2.5, -25, 25);
      vyDes = clamp(Math.sqrt(o.touch ** 2 + 2 * o.landBrake * Math.max(0, padTop - s.y - 2)), 10, 170);
      maxTilt = 0.25;
    } else {
      // Segue o perfil, olhando um pouco à frente (o tempo de virar a nave para frear)
      const lead = Math.sign(dx) * Math.abs(s.vx) * o.lead;
      vxDes = Math.sign(dx) * Math.min(profileAt(path, prof, s.x + lead), profileAt(path, prof, s.x));
      if (dist < 40) vxDes = Math.sign(dx) * Math.min(Math.abs(vxDes), dist * 1.2);
      const look = clamp(Math.abs(s.vx) * 0.35, 15, 110);
      const ahead = pathAt(path, s.x + Math.sign(dx) * look);
      const here = pathAt(path, s.x);
      vyDes = clamp((ahead.y - s.y) * o.kp + here.slope * s.vx, -o.cruise, o.cruise);
      ff = s.vx * s.vx * bendAt(path, s.x + Math.sign(dx) * Math.abs(s.vx) * 0.15);   // antecipa a curva
      maxTilt = o.maxTilt;
    }
    const ax = clamp(o.kx * (vxDes - s.vx), -T, T);
    const ay = clamp(ff + (landing ? 3.5 : o.kv) * (vyDes - s.vy), -T, T);
    const intent = command(s, ax, ay, g, p, maxTilt, ctl);
    record?.push(intent);
    fly(s, intent, sim, DT, { crewOnBoard });
    if (s.thrusting) thrustTime += DT;
    const c = contact(level, s, sim, ship);
    if (c?.crash) return null;
    if (c?.land) return c.land === toPad ? { fuel: thrustTime, x: s.x, air: t } : null;
  }
  return null;
}

// Rota de plataforma em plataforma com o piloto expert, girando na velocidade `rot`.
// `tries` troca os ajustes tentados (a DEMO voa de um jeito mais calmo, D-038).
function flyRouteExpert(level, params, free, kinds, rot, ship = DEFAULT_SHIP, tries = EXPERT_TRIES) {
  const pads = kinds.map((k) => level.pads.find((q) => q.kind === k));
  if (pads.some((q) => !q)) return null;
  const col = (pad) => Math.round((pad.x1 + pad.x2) / 2 / STEP);
  const legs = [];
  let startX = null, crewOnBoard = false;
  for (let i = 0; i + 1 < pads.length; i++) {
    const from = pads[i], to = pads[i + 1];
    if (from.kind === 'crew') crewOnBoard = true;
    let min = null;
    for (const w of EXPERT_ROUTES) {
      const base = planPath(level, free, col(from), col(to), w);
      if (!base) continue;
      const taut = new Map();
      for (const tryOpts of tries) {
        if (!taut.has(tryOpts.margin)) taut.set(tryOpts.margin, tautPath(free, base, tryOpts.margin));
        const path = taut.get(tryOpts.margin);
        const o = { ...EXPERT, ...tryOpts };
        const r = flyLegExpert(level, params, path, from, to, o, rot, crewOnBoard, startX, null, ship);
        if (r && (min === null || r.fuel < min.fuel)) min = { ...r, style: 'expert', o, rot, startX, path, from: from.kind, to: to.kind, crewOnBoard };
      }
    }
    if (!min) return null;
    legs.push(min);
    startX = min.x;
  }
  return legs;
}

// Melhor corrida sem abastecer que dá para fazer (base, tripulação, base): o limite de baixo do
// combustível, com o giro mais rápido dos controles (o do toque). Null se o piloto não concluir.
export function expertRun(level, params, ship = DEFAULT_SHIP) {
  if (level.obstacles.some((o) => !OBSTACLES[o.type].blockedAt)) return null;
  const legs = flyRouteExpert(level, params, freeSpace(level, ship), ['base', 'crew', 'base'], params.touchRotationSpeed, ship);
  return legs && { thrustSeconds: sum(legs), legs };
}

// A corrida da DEMO (D-038): a mesma pilotagem do expert, mas calma, como a Nintendo pedia nas demonstrações
// ("jogue com consideração": quem assiste tem de pensar "eu também consigo"). Voa mais devagar, freia cedo e de
// forma visível, virando a nave para trás, e pousa devagar.
const DEMO_TRIES = [
  { stencils: [4], margin: 12, cruise: 150, accel: 55, brake: 50, touch: 32, landBrake: 45, lead: 0.6 },
  { stencils: [2, 3, 4], margin: 12, cruise: 130, accel: 50, brake: 45, touch: 32, landBrake: 45, lead: 0.6 },
];
export function demoRun(level, params, ship = DEFAULT_SHIP) {
  if (level.obstacles.some((o) => !OBSTACLES[o.type].blockedAt)) return null;
  const legs = flyRouteExpert(level, params, freeSpace(level, ship), ['base', 'crew', 'base'], params.touchRotationSpeed, ship, DEMO_TRIES);
  return legs && { thrustSeconds: sum(legs), legs };
}

// Fases com posto, voando como o expert: a corrida sem abastecer (giro do toque) e os planos com
// abastecimento, que precisam valer para todos (giro do teclado, o mais lento):
//   oneTank: o tanque que permite abastecer uma vez, na ida ou na volta;
//   twoTank: o tanque que permite abastecer na ida e na volta.
export function expertPlans(level, params, ship = DEFAULT_SHIP) {
  if (level.obstacles.some((o) => !OBSTACLES[o.type].blockedAt)) return null;
  const free = freeSpace(level, ship);
  const keys = params.keyRotationSpeed;
  const full = flyRouteExpert(level, params, free, ['base', 'crew', 'base'], params.touchRotationSpeed, ship);
  const going = flyRouteExpert(level, params, free, ['base', 'fuel', 'crew', 'base'], keys, ship);
  const back = flyRouteExpert(level, params, free, ['base', 'crew', 'fuel', 'base'], keys, ship);
  const both = flyRouteExpert(level, params, free, ['base', 'fuel', 'crew', 'fuel', 'base'], keys, ship);
  if (!full || !going || !back || !both) return null;
  return {
    full: sum(full),
    oneTank: Math.max(going[0].fuel, going[1].fuel + going[2].fuel, back[0].fuel + back[1].fuel, back[2].fuel),
    twoTank: Math.max(both[0].fuel, both[1].fuel + both[2].fuel, both[3].fuel),
    fullLegs: full, going, back, both,
  };
}

// Comandos de cada trecho, passo a passo, para reproduzir a rota numa partida de verdade
export function routeInputs(level, params, legs, ship = DEFAULT_SHIP) {
  return legs.map((leg) => {
    const record = [];
    const from = level.pads.find((q) => q.kind === leg.from), to = level.pads.find((q) => q.kind === leg.to);
    if (leg.style === 'expert') flyLegExpert(level, params, leg.path, from, to, leg.o, leg.rot, leg.crewOnBoard, leg.startX, record, ship);
    else flyLeg(level, params, leg.path, from, to, Math.min(leg.cruise, params.maxSpeed * 0.9), leg.crewOnBoard, leg.startX, record, ship);
    return record;
  });
}

export const bestRunInputs = (level, params, run, ship = DEFAULT_SHIP) => routeInputs(level, params, run.legs, ship);
