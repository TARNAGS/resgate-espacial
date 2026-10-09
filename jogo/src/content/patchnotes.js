// Patch note (#126): uma linha, em inglês (D-007), com o que mudou em cada versão, para quem já jogava antes.
// A chave é a versão do jogo (BUILD, em platform/telemetry.js); versão sem linha não mostra nada.
// Ao subir a versão para uma rodada de playtest, escreva a linha dela aqui e passe o texto ao Fernando
// (janela de teste, passo 0, no CLAUDE.md). No máximo PATCH_NOTE_MAX caracteres, para caber numa linha no iPhone.

export const PATCH_NOTE_MAX = 60;

export const PATCH_NOTES = {
  '2026-10-07a': 'NEW: closer camera, fuel warnings, DEMO, messages up top',
  '2026-10-09a': 'NEW: sharper graphics, closer camera, fuel warnings, DEMO',   // rodada 2 (09 a 12/10/2026)
  '2026-10-09b': 'NEW: level 1 flight tips, calmer DEMO',   // D-038; aprovado pelo Fernando, rodada 2 em andamento
};
