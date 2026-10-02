import { fmtTime } from './math.js';

// Pontuação (Regras do jogo, seção 8). Só uma regra está definida: quem conclui o resgate mais rápido
// faz mais pontos. O resto (estrelas, combustível, vidas) é a P-006 (#53).
// Toda partida concluída guarda tempo, vidas perdidas e combustível que sobrou, para que a regra
// final possa usar esses dados sem mudar o que já está salvo no aparelho.

export const SCORING = {
  id: 'time-v1',
  score: (run) => run.time,
  isBetter: (a, b) => b === undefined || a.time < b.time,
  format: (run) => fmtTime(run.time),
};
