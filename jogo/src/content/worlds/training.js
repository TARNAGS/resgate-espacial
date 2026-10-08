// Cenário de treino, TRAINING (#35): chão, paredes e uma plataforma, sem tripulação e sem fim de jogo.
// Serve para o testador treinar decolar e pousar, e para calibrar com o painel de ajuste (#42).

export const TRAINING = {
  key: 'training',
  name: 'TRAINING',
  goal: 'Take off, fly around and land back on the pad.',
  hint: true,
  training: true,
  generator: { kind: 'training', length: 1400, tankSeconds: 40, obstacles: [] },
  modifiers: [],
};
