// Quando mostrar o patch note (#126): só para quem já jogava uma versão anterior, uma vez por versão.
//
// save.build é a última versão que o jogador abriu e viu por inteiro: ela só muda para a versão nova quando a
// linha é fechada (SKIP ou PLAY), ou quando não há linha para mostrar. Assim, quem fechar o jogo sem ver a linha
// a vê de novo na próxima vez. Saves de antes do patch note não têm build: se já há progresso, o jogador vinha
// de uma versão anterior. Quem abre o jogo pela primeira vez não vê: não existe "o que mudou" para ele.

export const patchNoteKey = (build) => `patch-${build}`;   // fica em save.seen, que o perfil online também guarda

export function patchNoteFor(save, build, notes) {
  const text = notes[build];
  if (!text || save.seen?.[patchNoteKey(build)]) return null;
  const playedBefore = save.build ? save.build !== build : Object.keys(save.levels || {}).length > 0;
  return playedBefore ? text : null;
}
