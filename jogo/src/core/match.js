import { SHIP, STEP } from './constants.js';
import { sampleLine } from './math.js';
import { generateLevel } from './generator.js';
import { createShip, fly, shipVerts, shipSamples, landingCheck } from './ship.js';
import { effectiveParams } from '../content/modifiers.js';
import { OBSTACLES } from '../content/obstacles/index.js';

// Regras de uma partida (Regras do jogo, seções 2 a 7): plataformas, combustível, embarque,
// vidas e pontos de retorno. Não desenha nada e não toca som: avisa pelo canal de eventos.
//
// Eventos (start sai de quem cria a partida): takeoff, land, crash, outOfFuel, boarding, boardStep, crewOnBoard,
//          lowFuelAtCrew, refuel, respawn, complete, gameOver

export function createMatch({ def, seed, getParams, events }) {
  const level = generateLevel(def, seed);
  const practice = Boolean(def.practice);
  const params = () => effectiveParams(getParams(), def);
  const m = {
    def, seed, level, practice,
    lives: params().lives,
    livesLost: 0,
    crewOnBoard: false,
    checkpointFuel: 1,   // combustível que a nave tinha ao chegar na tripulação
    boardingT: 0,
    outOfFuelT: 0,
    timer: 0,            // cronômetro da fase: começa na primeira decolagem
    timerOn: false,
    time: 0,             // tempo da partida, para obstáculos móveis
    over: null,          // 'complete' | 'gameOver'
    ship: null,
  };

  function spawnAt(kind, fuel) {
    const pad = level.pads.find((p) => p.kind === kind);
    m.ship = createShip(pad, fuel);
    m.outOfFuelT = 0;
  }

  function explode(reason, resetCrew = false) {
    const s = m.ship;
    s.state = 'exploding';
    s.explodeT = 0;
    s.thrusting = false;
    s.resetCrew = resetCrew;
    m.outOfFuelT = 0;
    if (!practice) { m.lives -= 1; m.livesLost += 1; }
    events.emit('crash', { reason, x: s.x, y: s.y, lives: m.lives });
  }

  function updateLanded(s, p, dt, input) {
    s.thrusting = false;
    if (s.pad.refuel && s.fuel < 1) {
      s.fuel = Math.min(1, s.fuel + p.refuelPerSecond * dt);
      if (s.fuel === 1) events.emit('refuel', { pad: s.pad.kind });
    }
    if (!s.pad.refuel && s.fuel <= 0) {
      // Sem combustível numa plataforma que não abastece: explode e volta à base sem a tripulação
      m.outOfFuelT += dt;
      if (m.outOfFuelT > 1.2) {
        events.emit('outOfFuel', { landed: true });
        explode('OUT OF FUEL', true);
      }
      return;
    }
    if (input.thrust) {
      s.state = 'flying';
      s.pad = null;
      s.y -= 2;
      s.vy = -25;
      if (!m.timerOn && !practice) m.timerOn = true;
      events.emit('takeoff');
    }
  }

  function updateBoarding(s, p, dt) {
    s.thrusting = false;
    const prev = m.boardingT;
    m.boardingT += dt;
    for (let i = 0; i < 3; i++) {
      const t = 0.45 * i + 0.7;
      if (prev < t && m.boardingT >= t) events.emit('boardStep', { index: i });
    }
    if (m.boardingT >= p.boardingSeconds) {
      m.crewOnBoard = true;
      m.checkpointFuel = s.fuel;
      s.state = 'landed';
      events.emit('crewOnBoard');
    }
  }

  function checkCollisions(s, p) {
    const verts = shipVerts(s);
    const samples = shipSamples(verts);
    const onFloor = [];
    for (const pt of samples) {
      if (pt.x <= 0 || pt.x >= level.L) return explode('HIT THE WALL');
      if (pt.y <= sampleLine(level.ceil, pt.x, STEP)) return explode('HIT THE CEILING');
      if (pt.y >= sampleLine(level.floor, pt.x, STEP)) onFloor.push(pt);
    }
    const body = { x: s.x, y: s.y, verts, samples };
    for (const o of level.obstacles) {
      if (OBSTACLES[o.type].hits(o, body)) return explode(`HIT A ${OBSTACLES[o.type].label.toUpperCase()}`);
    }
    if (onFloor.length) tryLanding(s, p, onFloor);
  }

  function tryLanding(s, p, contacts) {
    const pad = level.pads.find((q) => contacts.every((c) => c.x >= q.x1 && c.x <= q.x2));
    if (!pad) return explode('TOUCHED THE GROUND');
    if (s.vy < 0) return;   // subindo de uma plataforma: só raspou, não é pouso nem batida
    const bad = landingCheck(s, p);
    if (bad === 'tilted') return explode('LANDED TILTED');
    if (bad === 'fast') return explode('LANDED TOO FAST');
    const impact = { vx: s.vx, vy: s.vy, angle: s.a };
    Object.assign(s, { state: 'landed', pad, vx: 0, vy: 0, a: 0, y: pad.y - SHIP.base, thrusting: false });
    events.emit('land', { pad: pad.kind, impact });
    if (pad.kind === 'crew' && !m.crewOnBoard) {
      s.state = 'boarding';
      m.boardingT = 0;
      const lowFuel = s.fuel < p.lowFuel;
      if (lowFuel) events.emit('lowFuelAtCrew', { fuel: s.fuel });
      events.emit('boarding', { lowFuel });
    } else if (pad.kind === 'base' && m.crewOnBoard) {
      complete();
    }
  }

  function updateExploding(s, dt) {
    s.explodeT += dt;
    if (s.explodeT < 1.4) return;
    if (m.lives <= 0) {
      m.over = 'gameOver';
      m.timerOn = false;
      events.emit('gameOver', { def, seed });
      return;
    }
    // Pontos de retorno (Regras do jogo, seção 7.1)
    if (s.resetCrew) m.crewOnBoard = false;
    if (m.crewOnBoard) spawnAt('crew', m.checkpointFuel);
    else spawnAt('base', 1);
    events.emit('respawn', { lives: m.lives, at: m.ship.pad.kind });
  }

  function complete() {
    m.over = 'complete';
    m.timerOn = false;
    events.emit('complete', {
      def, seed,
      run: { time: Number(m.timer.toFixed(1)), livesLost: m.livesLost, fuelLeft: m.ship.fuel },
    });
  }

  spawnAt('base', 1);

  return {
    state: m,
    params,
    update(dt, input) {
      if (m.over) return;
      const p = params();
      m.time += dt;
      if (m.timerOn) m.timer += dt;
      for (const o of level.obstacles) OBSTACLES[o.type].update?.(o, m.time);
      const s = m.ship;
      if (s.state === 'landed') updateLanded(s, p, dt, input);
      else if (s.state === 'boarding') updateBoarding(s, p, dt);
      else if (s.state === 'exploding') updateExploding(s, dt);
      else if (s.state === 'flying') {
        if (fly(s, input, p, dt, { crewOnBoard: m.crewOnBoard })) events.emit('outOfFuel', { landed: false });
        checkCollisions(s, p);
      }
    },
  };
}
