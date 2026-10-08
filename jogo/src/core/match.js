import { generateLevel } from './generator.js';
import { createShip, fly } from './ship.js';
import { resolveShip } from '../content/ships/index.js';
import { contact, settle, takeOff } from './collision.js';
import { effectiveParams } from '../content/modifiers.js';
import { OBSTACLES } from '../content/obstacles/index.js';
import { createPraise } from './praise.js';

// Regras de uma partida (Regras do jogo, seções 2 a 7): plataformas, combustível, embarque,
// vidas e pontos de retorno. Não desenha nada e não toca som: avisa pelo canal de eventos.
//
// Eventos (start sai de quem cria a partida): takeoff, land, crash, outOfFuel, boarding, boardStep, crewOnBoard,
//          lowFuelAtCrew, refuel, respawn, complete, gameOver, praise (elogio, #81),
//          lowFuel ({ level: 'low' | 'critical' }: o combustível passou de 20% ou de 10% em voo, #94),
//          noFuel (apertou o propulsor sem combustível, ou pousou sem combustível onde não abastece, #94)

export function createMatch({ def, seed, getParams, events, ship }) {
  // A nave da partida (#122): a clássica, ou outra do catálogo. Nave de aparência usa o casco da clássica (D-034).
  const shipDef = resolveShip(ship);
  // O gerador pode trocar a semente, se o cenário sorteado não tiver um caminho provado (D-018)
  const level = generateLevel(def, seed, effectiveParams(getParams(), def, null, { ship: shipDef }), { ship: shipDef });
  seed = level.seed;
  const training = Boolean(def.training);   // treino: sem vidas, sem cronômetro e sem tripulação
  const params = () => effectiveParams(getParams(), def, level, { ship: shipDef });
  const m = {
    def, seed, level, training,
    shipDef,             // a definição da nave (content/ships/), lida pelo desenho
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
    stationLandings: 0,  // pousos no posto (a corrida perfeita abastece uma vez só, D-023)
    fuelWarned: { low: false, critical: false },   // avisos de combustível já dados (#94)
    thrustHeld: false,   // o jogador já estava apertando o propulsor no passo anterior
  };
  const praise = createPraise({ level, events, ship: shipDef });

  function spawnAt(kind, fuel) {
    const pad = level.pads.find((p) => p.kind === kind);
    m.ship = createShip(pad, fuel, shipDef);
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
    praise.reset();
    events.emit('crash', { reason, x: s.x, y: s.y, vx: s.vx, vy: s.vy, a: s.a, lives: m.lives });
  }

  function updateLanded(s, p, dt, input) {
    s.thrusting = false;
    if (s.pad.refuel && s.fuel < 1) {
      s.fuel = Math.min(1, s.fuel + p.refuelPerSecond * dt);
      if (s.fuel === 1) events.emit('refuel', { pad: s.pad.kind });
    }
    if (!s.pad.refuel && s.fuel <= 0) {
      // Sem combustível numa plataforma que não abastece: avisa NO FUEL e, depois de alguns segundos,
      // explode e volta à base sem a tripulação (#94)
      if (m.outOfFuelT === 0) events.emit('noFuel', { landed: true });
      m.outOfFuelT += dt;
      if (m.outOfFuelT > p.noFuelLandedSeconds) {
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

  // Avisos de combustível baixo (#94): um aviso a cada vez que o tanque passa de 20% e de 10% em voo.
  // Ao abastecer acima do limite, o aviso volta a valer.
  function warnFuel(s, p) {
    for (const [level, limit] of [['low', p.lowFuel], ['critical', p.criticalFuel]]) {
      if (s.fuel > limit) m.fuelWarned[level] = false;
      else if (!m.fuelWarned[level] && s.fuel > 0) { m.fuelWarned[level] = true; events.emit('lowFuel', { level }); }
    }
  }

  function checkCollisions(s, p) {
    const c = contact(level, s, p, shipDef);
    if (!c) return;
    if (c.crash) return explode(c.crash);
    const pad = c.land;
    const impact = { vx: s.vx, vy: s.vy, angle: s.a };
    settle(s, pad, shipDef);
    if (pad.kind === 'fuel') m.stationLandings += 1;
    events.emit('land', { pad: pad.kind, impact });
    praise.onLand(impact, s, p);
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
    // Corrida perfeita: fase com posto concluída com um só abastecimento e sem perder vidas (D-023)
    const perfectRun = Boolean(def.generator.fuelStation) && m.stationLandings === 1 && m.livesLost === 0;
    if (perfectRun) praise.perfectRun(m.ship);
    events.emit('complete', {
      def, seed,
      run: { time: Number(m.timer.toFixed(1)), livesLost: m.livesLost, fuelLeft: m.ship.fuel, perfectRun },
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
      const pressed = Boolean(input.thrust) && !m.thrustHeld;   // acabou de apertar o propulsor
      m.thrustHeld = Boolean(input.thrust);
      for (const o of level.obstacles) OBSTACLES[o.type].update?.(o, m.time);
      const s = m.ship;
      if (s.state === 'landed') updateLanded(s, p, dt, input);
      else if (s.state === 'boarding') updateBoarding(s, p, dt);
      else if (s.state === 'exploding') updateExploding(s, dt);
      else if (s.state === 'flying') {
        // Apertou o propulsor sem combustível: o aviso NO FUEL aparece de novo (#94)
        if (pressed && s.fuel <= 0) events.emit('noFuel', { landed: false });
        if (fly(s, input, p, dt, { crewOnBoard: m.crewOnBoard })) events.emit('outOfFuel', { landed: false });
        warnFuel(s, p);
        checkCollisions(s, p);
        if (s.state === 'flying') praise.update(s, p, dt);
      }
    },
  };
}
