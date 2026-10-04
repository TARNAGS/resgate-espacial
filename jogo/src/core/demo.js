import { expertRun, routeInputs } from './autopilot.js';

// DEMO (#104, D-031): antes de jogar, o próprio jogo mostra uma corrida do nível 1 jogada pelo piloto
// expert, para o jogador ver o objetivo (ir até o SOS, pousar, embarcar, voltar e pousar na base) e a
// dinâmica do propulsor: acelerar, soltar e deixar a gravidade agir. Não é um vídeo: é uma partida de
// verdade, com os comandos do piloto, então acompanha qualquer mudança na fase. O mesmo roteiro serve
// para o attract mode do menu (#105).

const NONE = { turn: 0, targetAngle: null, thrust: false };
const UP = { turn: 0, targetAngle: null, thrust: true };

export const DEMO_SPEED = 2.5;   // a corrida passa acelerada: uns 10 segundos no nível 1

// Rótulos, um por vez, com no máximo oito palavras na tela (D-031)
export const DEMO_LABELS = ['1 · FLY TO THE SOS', '2 · LAND SOFTLY', '3 · BRING THEM HOME'];

// Pilota uma partida: a cada passo, next() devolve o comando, como se fosse o jogador.
// Devolve null se o piloto não conseguir concluir a fase.
export function createDemoPilot(match) {
  const m = match.state;
  const run = expertRun(m.level, match.params());
  if (!run) return null;
  const legs = routeInputs(m.level, match.params(), run.legs);
  const crew = m.level.pads.find((q) => q.kind === 'crew');
  const crewX = (crew.x1 + crew.x2) / 2;
  let leg = 0, i = 0, phase = 'takeoff', last = NONE;
  return {
    get done() { return Boolean(m.over) || leg >= legs.length; },
    get input() { return last; },   // o último comando, para desenhar os polegares fantasmas
    // Qual rótulo mostrar: indo para o SOS, pousando nele, ou voltando com a tripulação
    get label() {
      if (m.crewOnBoard) return 2;
      return Math.abs(m.ship.x - crewX) < 260 ? 1 : 0;
    },
    next() {
      if (this.done) return (last = NONE);
      const s = m.ship;
      if (phase === 'takeoff') { phase = 'fly'; i = 0; return (last = UP); }
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
