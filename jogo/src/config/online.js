// Endereço do banco online do ranking (#87, D-024): Firebase Realtime Database do projeto
// "resgate-espacial", na conta do Fernando, criado em 02/10/2026. Vazio: o ranking fica só no aparelho.
//
// O endereço não é segredo (o navegador precisa dele). Quem protege os dados são as regras do banco,
// publicadas no console do Firebase: qualquer um pode LER o ranking; só dá para GRAVAR em
// scores/<fase>/<NICK> um tempo válido (número entre 0 e 3600, com "at" e, opcionalmente, "control"),
// de um nick válido (3 a 12 letras maiúsculas, números ou "_"), e só se for melhor que o anterior.
// Apagar é proibido. O perfil de cada jogador (#102) fica em players/<NICK>, com as regras de
// jogo/firebase/regras-players.json: só aceita progresso que cresce, e apagar também é proibido.
// Ainda assim, quem souber o endereço pode mandar um tempo falso: serve para um
// grupo pequeno de playtesters, não para o lançamento (P-019).
export const LEADERBOARD_URL = 'https://resgate-espacial-default-rtdb.firebaseio.com';
