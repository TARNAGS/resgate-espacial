import { generateLevel } from './generator.js';
import { createShip, fly } from './ship.js';
import { contact, settle, takeOff } from './collision.js';
import { effectiveParams } from '../content/modifiers.js';
import { OBSTACLES } from '../content/obstacles/index.js';

// Regras de uma partida (Regras do jogo, seções 2 a 7): plataformas, combustível, embarque,
// vidas e pontos de retorno. Não desenha nada e não toca som: avisa pelo canal de eventos.
//
// Eventos (start sai de quem cria a partida): takeoff, land, crash, outOfFuel, boarding, boardStep, crewOnBoard,
//          lowFuelAtCrew, refuel, respawn, complete, gameOver

export function createMatch({ def, seed, getParams, events }) {
  // O gerador pode trocar a semente, se o cenário sorteado não tiver um caminho provado (D-018)
  const level = generateLevel(def, seed, effectiveParams(getParams(), def));
  seed = level.seed;
  const training = Boolean(def.training);   // treino: sem vidas, sem cronômetro e sem tripulação
  const params = () => effectiveParams(getParams(), def, level);
  const m = {
    def, seed, level, training,
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
    if (!training) { m.lives -= 1; m.livesLost += 1; }
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
      takeOff(s);
      if (!m.timerOn && !training) m.timerOn = true;
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
    const c = contact(level, s, p);
    if (!c) return;
    if (c.crash) return explode(c.crash);
    const pad = c.land;
    const impact = { vx: s.vx, vy: s.vy, angle: s.a };
    settle(s, pad);
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
