// Treinador da fase que ensina (D-038): as dicas perto da nave, as lições depois do erro e a DEMO modesta.
// As batidas usadas aqui são as do playtest de 09/10/2026 (documento 09), sem os nicks.

import { test, assert, PARAMS, resetParams, LEVELS, createMatch, createEvents, createShip, fly, DT, UP, step, airShip } from '../lib.js';
import { TIPS, LESSONS, TAKEOFF_TIPS, TURN_TIPS, COACH, coachTip, crashLesson, brakeNeed, landingAdvice, targetPad } from '../../src/core/coach.js';
import { rad, wrapAngle } from '../../src/core/math.js';

const level1 = () => {
  resetParams();
  const def = LEVELS[0];
  return createMatch({ def, seed: def.seed, getParams: () => PARAMS, events: createEvents() });
};
const freshMem = () => ({ flew: false, airT: 0, heldFor: 0, coastFor: 0, coasted: false });
const words = (t) => t.split(' ').length;

test('D-038 o nível 1 é a fase que ensina, e só ele', () => {
  assert.deepEqual(LEVELS.filter((l) => l.hint).map((l) => l.key), ['w1-1']);
});

test('D-038 todos os textos do treinador são curtos (até 8 palavras) e em inglês', () => {
  const all = [...Object.values(TIPS), ...Object.values(LESSONS), ...Object.values(TAKEOFF_TIPS), ...Object.values(TURN_TIPS)];
  for (const text of all) {
    assert.ok(words(text) <= 8, `"${text}" tem ${words(text)} palavras`);
    assert.ok(/^[\x20-\x7E]+$/.test(text), `"${text}" não está em inglês sem acentos (D-007)`);
  }
});

test('D-038 a lição depois do erro sai do motivo e do jeito da batida (batidas reais do playtest de 09/10)', () => {
  const p = level1().params();
  const crash = (reason, deg, vx, vy) => crashLesson({ reason, a: rad(deg), vx, vy }, p);
  assert.equal(crash('LANDED TILTED', 75, 54, 65), 'tilt');         // decolou girando e caiu de lado perto da base
  assert.equal(crash('TOUCHED THE GROUND', 131, 233, 115), 'tilt');
  assert.equal(crash('HIT THE WALL', 67, 249, 73), 'brake');        // passou do SOS e bateu na parede do fim
  assert.equal(crash('LANDED TOO FAST', -7, 247, 81), 'brake');     // chegou ao SOS na velocidade máxima
  assert.equal(crash('TOUCHED THE GROUND', 5, 180, 91), 'brake');
  assert.equal(crash('HIT THE CEILING', 0, 0, -208), 'gravity');    // segurou o propulsor até o teto
  assert.equal(crash('LANDED TILTED', 30, 10, 40), 'level');
  assert.equal(crash('TOUCHED THE GROUND', 0, 10, 120), 'fall');
  assert.equal(crash('TOUCHED THE GROUND', 3, -33, 53), 'ground');
  assert.equal(crash('HIT A ROCK', 0, 200, 0), null);
  assert.equal(crash('OUT OF FUEL', 0, 0, 0), null);
});

test('D-038 dica de frear: aparece chegando rápido ao SOS ou a uma parede, e não voando devagar', () => {
  const m = level1().state;
  const p = level1().params();
  const crew = targetPad(m);
  const ship = (x, vx) => ({ ...airShip(), x, y: 300, vx, vy: 0, a: rad(90 * Math.sign(vx)) });
  assert.equal(brakeNeed(ship(600, 250), p, m.level, crew), null, 'longe do SOS ainda dá para acelerar');
  const near = brakeNeed(ship(1250, 250), p, m.level, crew);
  assert.ok(near, 'a 400 do SOS, a 250, já tem de frear');
  assert.ok(near.angle < -rad(50) && near.angle > -rad(75), 'indo para a direita, o nariz aponta para trás, à esquerda, uns 64°');
  assert.equal(brakeNeed(ship(1250, 60), p, m.level, crew), null, 'devagar não precisa');
  const away = brakeNeed(ship(220, -200), p, m.level, crew);
  assert.ok(away && away.angle > 0, 'voltando para a parede do começo, rápido: frear com o nariz para a direita');
});

test('D-038 o aviso de frear chega a tempo: quem obedece chega ao SOS devagar, sem bater na parede', () => {
  const match = level1();
  const m = match.state, p = match.params();
  const crew = targetPad(m);
  // A nave vem na velocidade máxima, de lado; o "jogador" só reage ao aviso: gira no teclado até o nariz-guia e acelera
  const s = { ...createShip(m.level.pads[0], 1), state: 'flying', x: 400, y: 250, vx: 250, vy: 0, a: rad(90) };
  let warnedAt = null, braking = false, atPad = null;
  for (let t = 0; t < 15 && s.x < crew.x1; t += DT) {
    const need = brakeNeed(s, p, m.level, crew, { braking });
    braking = Boolean(need);
    let input = { turn: 0, targetAngle: null, thrust: false };
    if (need) {
      warnedAt ??= s.x;
      const d = wrapAngle(need.angle - s.a);
      input = { turn: Math.abs(d) > 0.05 ? Math.sign(d) : 0, targetAngle: null, thrust: Math.abs(d) < rad(30) };
    }
    fly(s, input, { ...p, tankSeconds: 1e9 }, DT);
    s.vy = 0;   // a altura não importa aqui: só a freada
    if (s.x >= crew.x1) atPad = s.vx;
  }
  assert.ok(warnedAt !== null && warnedAt < crew.x1 - 300, `o aviso veio tarde, em x=${warnedAt}`);
  assert.ok(atPad !== null, 'a nave parou antes de chegar ao SOS');
  assert.ok(atPad <= COACH.brakeMinSpeed + 5, `chegou ao SOS a ${atPad.toFixed(0)}: rápido demais para pousar`);
});

test('D-038 dica de pouso: diz o que vai dar errado no toque, e "pode deixar" quando está bom', () => {
  const m = level1().state;
  const p = level1().params();
  const crew = targetPad(m);
  const cx = (crew.x1 + crew.x2) / 2;
  const over = (o) => ({ ...airShip(), x: cx, y: crew.y - 30, vx: 0, vy: 20, a: 0, ...o });
  assert.equal(landingAdvice(over({}), p, crew), 'landOk');
  assert.equal(landingAdvice(over({ vy: 150 }), p, crew), 'landSlow');
  assert.equal(landingAdvice(over({ a: rad(30) }), p, crew), 'landLevel');
  assert.equal(landingAdvice(over({ vx: 80 }), p, crew), 'landSlide');
  assert.equal(landingAdvice(over({ x: crew.x2 + 40 }), p, crew), 'landAim');
  assert.equal(landingAdvice(over({ vy: -30 }), p, crew), null, 'subindo não é pouso');
  assert.equal(landingAdvice(over({ x: cx - 400 }), p, crew), null, 'longe da plataforma não é pouso');
});

test('D-038 a dica acompanha a fase: decolar, ir ao SOS, embarcar e voltar para a base', () => {
  const match = level1();
  const m = match.state, p = match.params();
  const mem = freshMem();
  assert.equal(coachTip(m, p, mem).id, 'takeoff');
  step(match, UP, 0.3);
  mem.flew = true; mem.airT = 0.3;
  const go = coachTip(m, p, mem);
  assert.equal(go.id, 'goSos');
  assert.equal(go.dir, 1, 'o SOS fica à direita da base');
  mem.airT = COACH.goalSeconds + 1;
  assert.equal(coachTip(m, p, mem), null, 'voando tranquilo, sem dica');
  // Pousada no SOS: embarque e, depois, a volta
  const crew = targetPad(m);
  Object.assign(m.ship, { state: 'boarding', pad: crew, x: (crew.x1 + crew.x2) / 2, vx: 0, vy: 0, a: 0 });
  assert.equal(coachTip(m, p, mem).id, 'boarding');
  m.crewOnBoard = true;
  m.ship.state = 'landed';
  const back = coachTip(m, p, mem);
  assert.equal(back.id, 'goBase');
  assert.equal(back.dir, -1, 'a base fica à esquerda');
  // Voltou à base sem a tripulação: lembra onde ela está
  const fresh = level1();
  Object.assign(mem, { flew: true });
  assert.equal(coachTip(fresh.state, p, mem).id, 'crewAtSos');
});

test('D-038 a dica da gravidade aparece para quem segura o propulsor subindo, até a pessoa voar solto uma vez', () => {
  const match = level1();
  const m = match.state, p = match.params();
  step(match, UP, 1);
  Object.assign(m.ship, { vy: -80, vx: 0, x: 600 });
  const mem = { ...freshMem(), flew: true, airT: 10, heldFor: 2 };
  assert.equal(coachTip(m, p, mem).id, 'gravity');
  assert.equal(coachTip(m, p, { ...mem, coasted: true }), null);
  assert.equal(coachTip(m, p, { ...mem, heldFor: 0.5 }), null);
});
