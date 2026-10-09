import { demoRun, routeInputs } from './autopilot.js';

// DEMO (#104, D-031): antes de jogar, o próprio jogo mostra uma corrida do nível 1, para o jogador ver o objetivo
// (ir até o SOS, pousar, embarcar, voltar e pousar na base) e a dinâmica do propulsor: acelerar, soltar e deixar a
// gravidade agir, virar para trás para frear. Não é um vídeo: é uma partida de verdade, com os comandos do piloto,
// então acompanha qualquer mudança na fase. O mesmo roteiro serve para o attract mode do menu (#105).
//
// Desde a D-038 (playtest de 09/10/2026: a DEMO era pulada em 1,3 s, e quem a viu inteira ainda não entendeu como
// frear), ela é modesta, como a Nintendo pedia: o piloto voa calmo, a corrida passa mais devagar e cada rótulo diz
// o gesto que está acontecendo naquela hora.

const NONE = { turn: 0, targetAngle: null, thrust: false };
const UP = { turn: 0, targetAngle: null, thrust: true };

export const DEMO_SPEED = 1.5;   // a corrida passa um pouco acelerada, mas dá para ler cada gesto

// Rótulos, um por vez, com no máximo oito palavras na tela (D-031): o gesto da vez
export const DEMO_LABELS = [
  'HOLD THRUST TO TAKE OFF',
  'FLY TO THE SOS',
  'TAP THRUST: GRAVITY PULLS YOU DOWN',
  'TURN BACK AND THRUST TO BRAKE',
  'LAND SOFTLY ON THE SOS',
  'THE CREW RUNS ON BOARD',
  'BRING THEM BACK TO BASE',
  'LAND SOFTLY ON THE BASE',
];
const L = { takeoff: 0, fly: 1, gravity: 2, brake: 3, landSos: 4, boarding: 5, goBase: 6, landBase: 7 };
const HOLD = 1.8;   // segundos de jogo que um rótulo fica antes de dar lugar a outro gesto (para dar tempo de ler)
const STEP_DT = 1 / 120;   // o passo de física do jogo: next() é chamado uma vez por passo
const NEAR = 150;   // distância da plataforma em que a nave já está chegando para pousar

// Pilota uma partida: a cada passo, next() devolve o comando, como se fosse o jogador.
// Devolve null se o piloto não conseguir concluir a fase.
export function createDemoPilot(match) {
  const m = match.state;
  const run = demoRun(m.level, match.params());
  if (!run) return null;
  const legs = routeInputs(m.level, match.params(), run.legs);
  const padX = (kind) => { const q = m.level.pads.find((p) => p.kind === kind); return (q.x1 + q.x2) / 2; };
  const crewX = padX('crew'), baseX = padX('base');
  let leg = 0, i = 0, phase = 'takeoff', last = NONE;
  let label = L.takeoff, labelT = 0, t = 0, legT = 0;

  // O gesto da vez, pelo que a nave está fazendo (e não pelo comando de um passo: o piloto liga e desliga o
  // propulsor como um dedo). No cruzeiro da ida, depois do objetivo, o rótulo explica esse toque: o propulsor
  // segura a nave no ar, e a gravidade puxa para baixo quando ele solta.
  function gesture() {
    const s = m.ship;
    if (s.state === 'boarding') return L.boarding;
    if (s.state === 'landed') return m.crewOnBoard && s.pad.kind !== 'base' ? L.goBase : L.takeoff;
    if (Math.abs(s.x - (m.crewOnBoard ? baseX : crewX)) < NEAR) return m.crewOnBoard ? L.landBase : L.landSos;
    if (Math.sin(s.a) * s.vx < 0 && Math.abs(s.a) > 0.4 && Math.abs(s.vx) > 30) return L.brake;   // nariz para trás
    if (m.crewOnBoard) return L.goBase;
    return legT < 3 ? L.fly : L.gravity;
  }

  function updateLabel() {
    labelT += STEP_DT;
    const next = gesture();
    // Embarque e decolagem com a tripulação trocam na hora; o resto espera o rótulo da vez ser lido
    const urgent = next === L.boarding || (label === L.boarding && next === L.goBase);
    if (next !== label && (labelT >= HOLD || urgent)) { label = next; labelT = 0; }
  }

  return {
    get done() { return Boolean(m.over) || leg >= legs.length; },
    get input() { return last; },   // o último comando, para desenhar os polegares e as teclas fantasmas
    get label() { return label; },
    next() {
      t += STEP_DT;
      legT = m.ship.state === 'flying' ? legT + STEP_DT : 0;
      updateLabel();
      if (this.done) return (last = NONE);
      const s = m.ship;
      if (phase === 'takeoff') {
        // Na primeira decolagem, a nave espera um pouco na base: dá tempo de ler o primeiro rótulo
        if (leg === 0 && t < 0.9) return (last = NONE);
        phase = 'fly'; i = 0; return (last = UP);
      }
      if (phase === 'fly' && i < legs[leg].length) return (last = legs[leg][i++]);
      phase = 'wait';
      // Pousou: espera o embarque (ou o abastecimento) antes de decolar para o próximo trecho
      if (s.state === 'boarding' || (s.pad?.refuel && s.fuel < 1)) return (last = NONE);
      leg += 1;
      phase = 'takeoff';
      return (last = NONE);
    },
  };
}
