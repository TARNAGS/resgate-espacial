// Conteúdo do jogo: mundos e níveis. Criar ou mudar uma fase é editar os dados, sem mexer na lógica.
// Cada mundo fica num arquivo em content/worlds/ (#118), para mexer no mundo 7 sem arriscar o mundo 2.
// Este arquivo junta os mundos na ordem do jogo, mais os desafios e o treino, e é por ele que o resto do jogo lê.
//
// A diferença entre mundo e fase ainda está em aberto (P-011, #60). Cada mundo tem visual próprio (theme) e pode
// ter modificadores próprios; cada nível define as regras do gerador (D-014). O contrato é conferido pelos testes
// (#117, testes/conteudo/contrato-fase.test.js) e está no documento 12.
//
// Campos do nível:
//   key        identificador salvo no aparelho; nunca mudar depois de publicado (testes/conteudo/chaves-publicadas.json)
//   name, goal textos do jogo (em inglês, D-007)
//   hint       a fase que ensina (D-038): com ela, o treinador (app/coach.js) mostra dicas perto da nave e lições
//              depois do erro até o jogador concluir a fase pela primeira vez
//   seed       semente fixa, igual para todos (D-021); só a BONUS (random: true) sorteia
//   generator  regras do cenário: comprimento, corredor mínimo, relevo, posto e obstacles (lista com as
//              opções de cada tipo do catálogo, content/obstacles). Tanque, em segundos de propulsor:
//              - fase com posto: refuelMargin, a folga sobre o melhor plano com um abastecimento (D-023)
//              fuelAt (opcional): onde fica o posto, como fração do caminho da base até a tripulação;
//              sem ele, o posto fica no meio da fase
//              - fase sem posto: tankSeconds, o mínimo (o gerador aumenta se a melhor corrida pedir)
//              tank (fases fixas): o tanque já calculado pelo piloto automático para a semente fixa.
//              O jogo usa este valor sem rodar o piloto no aparelho, para o cenário e o tanque serem
//              idênticos em todos os navegadores (o ranking depende disso). Os testes conferem o valor.
//   modifiers  lista de modificadores (content/modifiers.js); vazia até P-012 ser decidida

import { W1 } from './worlds/w1.js';
import { CHALLENGE_LEVELS } from './worlds/challenges.js';
import { TRAINING } from './worlds/training.js';

// Mundos na ordem do jogo. Um mundo novo: um arquivo em content/worlds/ e uma linha aqui.
export const WORLDS = [W1];

export { TRAINING };

export const CHALLENGES = CHALLENGE_LEVELS.map((level) => ({ ...level, world: WORLDS[0], number: null }));

// Todos os níveis na ordem do jogo, cada um com o mundo a que pertence e o número para mostrar
export const LEVELS = WORLDS.flatMap((world) =>
  world.levels.map((level) => ({ ...level, world, modifiers: [...world.modifiers, ...level.modifiers] })),
).map((level, i) => ({ ...level, number: i + 1 }));

export const TRAINING_LEVEL = { ...TRAINING, world: WORLDS[0], number: 0 };

export const findLevel = (key) => (key === TRAINING.key ? TRAINING_LEVEL : [...LEVELS, ...CHALLENGES].find((l) => l.key === key));
