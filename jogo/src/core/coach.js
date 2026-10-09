import { DEFAULT_SHIP } from '../content/ships/index.js';
import { clamp, rad, wrapAngle } from './math.js';
import { landingCheck } from './ship.js';

// Treinador da fase que ensina (D-038): decide, a cada momento, que dica curta mostrar perto da nave e que lição
// dar depois de uma batida. Não desenha nem conta nada: recebe o estado da partida e devolve a dica, para poder ser
// testado no Node. Quem mostra é o desenho (render/coach.js), e quem guarda a memória da tentativa é o fluxo
// (app/coach.js).
//
// De onde veio cada ideia (documento 10 e docs/benchmark, D-033):
//   - dica curta, no lugar e na hora em que a dúvida aparece, com até 8 palavras: Super Mario World (blocos de
//     mensagem um passo antes) e Plants vs. Zombies (no máximo oito palavras, sem botão de OK);
//   - lição só depois do erro, a partir da segunda batida do mesmo tipo: Geometry Dash (uma frase depois de duas
//     batidas) e a Nintendo (ajuda calibrada depois do erro);
//   - frear virando a nave para o lado contrário e não inclinar mais de 45° no começo: o manual do Crazy Gravity;
//   - aviso antes do perigo: Jetpack Joyride.

// Dicas ao vivo, perto da nave. Textos do jogo em inglês (D-007), até 8 palavras.
export const TIPS = {
  takeoff: 'HOLD THRUST TO FLY',
  goSos: 'FLY TO THE SOS',
  crewAtSos: 'THE CREW IS WAITING AT THE SOS',
  gravity: 'LET GO: GRAVITY PULLS YOU DOWN',
  brake: 'TOO FAST! TURN BACK AND THRUST',
  braking: 'GOOD! KEEP THRUSTING TO BRAKE',
  landAim: 'LINE UP OVER THE PAD',
  landLevel: 'STRAIGHTEN THE SHIP TO LAND',
  landSlide: 'STOP SLIDING: SMALL PUSH BACK',
  landSlow: 'TAP THRUST TO LAND SOFTLY',
  landOk: 'GOOD! LET IT TOUCH DOWN',
  boarding: 'THE CREW IS BOARDING',
  goBase: 'CREW ON BOARD! BACK TO BASE',
};

// A decolagem muda com o controle: teclado (keys), dois polegares (twin, D-022) ou um polegar (hold)
export const TAKEOFF_TIPS = { keys: 'HOLD THRUST TO FLY', twin: 'HOLD THE RIGHT BUTTON TO FLY', hold: 'TOUCH AND HOLD TO FLY' };
export const TURN_TIPS = { keys: 'TURN THE SHIP', twin: 'LEFT THUMB AIMS THE NOSE', hold: 'DRAG TO AIM THE NOSE' };

// O tom de cada dica: informação, alerta ou acerto
export const TIP_TONE = {
  takeoff: 'info', goSos: 'info', crewAtSos: 'info', boarding: 'info', goBase: 'good',
  gravity: 'warn', brake: 'warn', landAim: 'warn', landLevel: 'warn', landSlide: 'warn', landSlow: 'warn',
  braking: 'good', landOk: 'good',
};

// Lições depois do erro, escolhidas pelo motivo da batida
export const LESSONS = {
  brake: 'TOO FAST: TURN BACK AND THRUST TO BRAKE',
  fall: 'FALLING FAST: HOLD THRUST TO SLOW DOWN',
  tilt: 'TILT LESS: KEEP THE NOSE MOSTLY UP',
  level: 'STRAIGHTEN THE SHIP BEFORE TOUCHING DOWN',
  gravity: 'LET GO: GRAVITY PULLS YOU DOWN',
  ground: 'ONLY THE PADS ARE SAFE TO TOUCH',
};

export const COACH = {
  lessonAfter: 2,        // a lição aparece a partir da segunda batida do mesmo tipo (Geometry Dash)
  demoAfterGameOvers: 2, // a oferta da DEMO no fim de jogo aparece a partir do segundo (Nintendo: depois do erro)
  holdForGravity: 1.6,   // segundos de propulsor seguido, subindo, para lembrar que soltar faz descer
  coastToLearn: 0.8,     // segundos sem propulsor, voando, para considerar a gravidade aprendida
  goalSeconds: 3.5,      // quanto tempo depois de decolar o objetivo fica perto da nave
  brakeMinSpeed: 60,     // abaixo disso não há o que frear: a dica do pouso cuida do resto
  brakeKeep: 150,        // folga a mais para continuar freando depois do aviso, para a dica não piscar
  brakeTiltDeg: 64,      // nariz para trás, segurando a altura: acos(gravidade ÷ propulsor), arredondado
  maxTiltDeg: 45,        // "não inclinar mais de 45° no começo" (manual do Crazy Gravity)
  fastSideways: 110,     // batida com mais deslize do que isso: faltou frear
};

// Para onde a nave tem de ir agora: a tripulação, ou a base com a tripulação a bordo
export const targetPad = (m) => m.level.pads.find((p) => p.kind === (m.crewOnBoard ? 'base' : 'crew'));
const centerOf = (pad) => (pad.x1 + pad.x2) / 2;

// Frear (dor 3 do playtest de 09/10): a nave chega rápido demais à plataforma ou a uma parede?
// Conta o tempo de virar a nave para trás no giro do teclado (o mais lento) e a frenagem que o propulsor dá
// segurando a altura. Devolve null se não há o que frear, ou { angle }: para onde apontar o nariz.
// `braking`: o aviso já está na tela; ele continua com uma folga maior, para não ligar e desligar a cada freada.
export function brakeNeed(s, p, level, target, { crewOnBoard = false, braking = false } = {}) {
  const speed = Math.abs(s.vx);
  if (s.state !== 'flying' || speed < COACH.brakeMinSpeed) return null;
  const dir = Math.sign(s.vx);
  const g = p.gravity + (crewOnBoard ? p.crewWeight : 0);
  const angle = -dir * Math.acos(clamp(g / p.thrust, 0, 1));
  const decel = 0.75 * Math.sqrt(Math.max(0, p.thrust ** 2 - g ** 2));   // folga: ninguém freia no ângulo perfeito
  const turn = Math.abs(wrapAngle(angle - s.a)) / rad(p.keyRotationSpeed);
  const stop = speed * (turn + 0.25) + (speed * speed) / (2 * decel);
  const dx = centerOf(target) - s.x;
  const toward = Math.sign(dx) === dir;
  const room = toward ? Math.abs(dx) : dir > 0 ? level.L - s.x : s.x;   // passou da plataforma: a parede
  return stop > room - 30 - (braking ? COACH.brakeKeep : 0) ? { angle } : null;
}

// Pouso (dor 4): a nave está descendo para a plataforma do objetivo? Se o jogador não fizer mais nada, o que dá
// errado no toque? A conta é a mesma da previsão de pouso (core/ship.js, landingForecast), separando o motivo.
export function landingAdvice(s, p, pad, { crewOnBoard = false, def = DEFAULT_SHIP } = {}) {
  if (s.state !== 'flying' || s.vy <= 0) return null;
  const half = (pad.x2 - pad.x1) / 2;
  if (Math.abs(s.x - centerOf(pad)) > half + 60 || pad.y - s.y > 220 || pad.y < s.y) return null;
  const g = p.gravity + (crewOnBoard ? p.crewWeight : 0);
  const h = Math.max(0, pad.y - (s.y + def.feet.y));
  const vyAtTouch = Math.sqrt(s.vy * s.vy + 2 * g * h);
  const t = (vyAtTouch - s.vy) / g;
  const x = s.x + s.vx * t + (p.windX * t * t) / 2;
  const onPad = x - def.feet.half >= pad.x1 - p.padMargin && x + def.feet.half <= pad.x2 + p.padMargin;
  const check = landingCheck({ ...s, vy: vyAtTouch }, p);
  if (check === 'tilted') return 'landLevel';
  if (Math.abs(s.vx) > p.landingMaxVx) return 'landSlide';
  if (!onPad) return 'landAim';
  if (check === 'fast') return 'landSlow';
  return 'landOk';
}

// A dica da vez. `mem` é a memória da tentativa (app/coach.js):
//   flew       já decolou nesta tentativa       airT      segundos desde a última decolagem
//   heldFor    segundos de propulsor seguido     coasted   já voou solto (a gravidade foi aprendida)
//   braking    a dica de frear está na tela
// Devolve { id, text, tone, dir } (dir: -1 ou 1, para onde fica o objetivo) ou { id, ..., nose } (frear), ou null.
export function coachTip(m, p, mem) {
  const s = m.ship;
  if (!s || s.state === 'exploding' || m.over) return null;
  const target = targetPad(m);
  if (!target) return null;   // fase sem tripulação (o treino): não há objetivo a ensinar
  const dir = Math.sign(centerOf(target) - s.x) || 1;
  const tip = (id, extra = {}) => ({ id, text: TIPS[id], tone: TIP_TONE[id], ...extra });
  if (s.state === 'boarding') return tip('boarding');
  if (s.state === 'landed') {
    if (m.crewOnBoard) return s.pad.kind === 'base' ? null : tip('goBase', { dir });
    if (s.pad.kind === 'base') return mem.flew ? tip('crewAtSos', { dir }) : tip('takeoff');
    return null;
  }
  const opts = { crewOnBoard: m.crewOnBoard, def: m.shipDef };
  const advice = landingAdvice(s, p, target, opts);
  if (advice) return tip(advice);
  const brake = brakeNeed(s, p, m.level, target, { ...opts, braking: Boolean(mem.braking) });
  if (brake) {
    const aligned = s.thrusting && Math.abs(wrapAngle(brake.angle - s.a)) < rad(25);
    return tip(aligned ? 'braking' : 'brake', { nose: brake.angle });
  }
  if (!mem.coasted && mem.heldFor > COACH.holdForGravity && s.vy < -40) return tip('gravity');
  if (mem.airT < COACH.goalSeconds) return tip(m.crewOnBoard ? 'goBase' : 'goSos', { dir });
  return null;
}

// Lição depois de uma batida: o que faltou, pelo motivo e pelo jeito da batida. Null quando não há lição a dar
// (pedra, combustível).
export function crashLesson({ reason, vx, vy, a }, p) {
  if (reason === 'HIT THE CEILING') return 'gravity';
  if (!['TOUCHED THE GROUND', 'LANDED TILTED', 'LANDED TOO FAST', 'HIT THE WALL'].includes(reason)) return null;
  if (reason !== 'HIT THE WALL' && Math.abs(wrapAngle(a)) > rad(COACH.maxTiltDeg)) return 'tilt';
  if (Math.abs(vx) >= COACH.fastSideways || reason === 'HIT THE WALL') return 'brake';
  if (reason === 'LANDED TILTED') return 'level';
  if (vy > p.landingMaxVy) return 'fall';
  if (reason === 'LANDED TOO FAST') return 'brake';   // tocou deslizando de lado
  return 'ground';
}
