import { LEVELS } from '../content/worlds.js';
import { SCORING } from './scoring.js';

// Progresso do jogador: o que já concluiu, o melhor resultado e quantos resgates fez em cada nível.
// O que fica liberado é calculado, não salvo: concluir um nível libera o próximo (Regras, seção 10).

export const levelProgress = (save, key) => save.levels[key] || { completed: false, best: undefined, rescues: 0 };

export function isUnlocked(save, level) {
  if (level.challenge) return true;   // desafios ficam sempre liberados
  const i = LEVELS.findIndex((l) => l.key === level.key);
  return i <= 0 || levelProgress(save, LEVELS[i - 1].key).completed;
}

export function levelState(save, level) {
  if (levelProgress(save, level.key).completed) return 'done';
  return isUnlocked(save, level) ? 'open' : 'locked';
}

// Próximo nível a jogar: o primeiro liberado e ainda não concluído; se todos foram, o último
export function defaultLevel(save) {
  const open = LEVELS.filter((l) => isUnlocked(save, l));
  return open.find((l) => !levelProgress(save, l.key).completed) || open[open.length - 1];
}

export function recordCompletion(save, key, run) {
  const prev = levelProgress(save, key);
  const isBest = SCORING.isBetter(run, prev.best);
  save.levels[key] = { completed: true, best: isBest ? run : prev.best, rescues: prev.rescues + 1 };
  return { isBest, prevBest: prev.best };
}

export function nextLevel(key) {
  const i = LEVELS.findIndex((l) => l.key === key);
  return i >= 0 ? LEVELS[i + 1] || null : null;   // desafios não têm "próximo nível"
}
