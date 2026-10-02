import { SHIP } from './constants.js';
import { clamp, lerp, rad, wrapAngle } from './math.js';

// Física da nave (Regras do jogo, seção 3.1). Funções puras: recebem a nave, a intenção do
// jogador e os parâmetros, e não dependem do navegador, para poderem ser testadas sozinhas.
//
// Intenção do jogador (input/controls.js):
//   turn         -1, 0 ou 1: girar no teclado
//   targetAngle  ângulo para onde o dedo aponta (direcional), ou null
//   thrust       propulsor acionado

export function createShip(pad, fuel) {
  return {
    x: (pad.x1 + pad.x2) / 2, y: pad.y - SHIP.base, vx: 0, vy: 0, a: 0,
    state: 'landed', pad, fuel, thrusting: false, explodeT: 0, resetCrew: false,
  };
}

// Ângulo 0 = ponta para cima; positivo = sentido horário
export function steer(s, input, p, dt) {
  if (input.turn) {
    s.a += input.turn * rad(p.keyRotationSpeed) * dt;
  } else if (input.targetAngle != null) {
    const maxStep = rad(p.touchRotationSpeed) * dt;
    s.a += clamp(wrapAngle(input.targetAngle - s.a), -maxStep, maxStep);
  }
  s.a = wrapAngle(s.a);
}

// Um passo de voo: propulsor (#33), gravidade (#32) e embalo (#34). Devolve true se o combustível acabou agora.
export function fly(s, input, p, dt, { crewOnBoard = false } = {}) {
  steer(s, input, p, dt);
  let ranOut = false;
  s.thrusting = Boolean(input.thrust) && s.fuel > 0;
  if (s.thrusting) {
    s.vx += Math.sin(s.a) * p.thrust * dt;
    s.vy -= Math.cos(s.a) * p.thrust * dt;
    s.fuel = Math.max(0, s.fuel - dt / p.tankSeconds);
    ranOut = s.fuel === 0;
  }
  s.vy += (p.gravity + (crewOnBoard ? p.crewWeight : 0)) * dt;
  s.vx += p.windX * dt;
  const sp = Math.hypot(s.vx, s.vy);
  if (sp > p.maxSpeed) {
    s.vx *= p.maxSpeed / sp;
    s.vy *= p.maxSpeed / sp;
  }
  // Sem atrito: a velocidade só muda pela gravidade, pelo propulsor e pelos modificadores
  s.x += s.vx * dt;
  s.y += s.vy * dt;
  return ranOut;
}

export function shipVerts(s) {
  const c = Math.cos(s.a), sn = Math.sin(s.a);
  const tf = (lx, ly) => ({ x: s.x + lx * c - ly * sn, y: s.y + lx * sn + ly * c });
  return [tf(0, -SHIP.tip), tf(SHIP.half, SHIP.base), tf(-SHIP.half, SHIP.base)];
}

// Pontos ao longo das bordas do triângulo, usados para detectar contato
export function shipSamples(verts) {
  const out = [];
  for (let i = 0; i < 3; i++) {
    const a = verts[i], b = verts[(i + 1) % 3];
    for (let k = 0; k < 4; k++) out.push({ x: lerp(a.x, b.x, k / 4), y: lerp(a.y, b.y, k / 4) });
  }
  return out;
}

// Pouso seguro (Regras do jogo, seção 3.3): devagar, sem deslizar e quase reto
export function landingCheck(s, p) {
  if (Math.abs(s.a) > rad(p.landingMaxAngle)) return 'tilted';
  if (s.vy > p.landingMaxVy || Math.abs(s.vx) > p.landingMaxVx) return 'fast';
  return null;
}

export const landingSafe = (s, p) => landingCheck(s, p) === null;

// Previsão do pouso (aviso de pouso, #50): a nave está descendo para a plataforma e, se o jogador
// não fizer mais nada, toca nela devagar, reta e ainda em cima dela? Considera a gravidade e o
// deslize até o toque, porque a nave continua acelerando: estar abaixo do limite agora não basta.
export function landingForecast(s, p, pad, { crewOnBoard = false } = {}) {
  if (s.vy <= 0) return null;   // subindo ou parada: não é pouso
  const g = p.gravity + (crewOnBoard ? p.crewWeight : 0);
  const h = Math.max(0, pad.y - (s.y + SHIP.base));
  const vyAtTouch = Math.sqrt(s.vy * s.vy + 2 * g * h);
  const t = (vyAtTouch - s.vy) / g;
  const x = s.x + s.vx * t + (p.windX * t * t) / 2;
  const onPad = x - SHIP.half >= pad.x1 - p.padMargin && x + SHIP.half <= pad.x2 + p.padMargin;
  return onPad && landingCheck({ ...s, vy: vyAtTouch }, p) === null;
}
