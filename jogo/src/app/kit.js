// O kit dos fluxos (#125): o main.js cria as peças (tela, desenho, eventos, telas, controles...) e as põe num
// objeto só, e cada fluxo acrescenta as funções dele. Um fluxo chama as funções dos outros por aqui, na hora da
// chamada, porque eles se chamam uns aos outros (a partida chama o ranking, que chama o menu...).

// Funções de outros fluxos, resolvidas só quando forem chamadas
export const late = (g, ...names) => names.map((name) => (...args) => g[name](...args));
