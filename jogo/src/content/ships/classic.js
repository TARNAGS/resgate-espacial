// A nave clássica: o triângulo do tamanho de um cursor (Regras do jogo, seção 12).
// Pela D-034, ela é o casco padrão: toda nave de aparência usa este casco e estes atributos.
//
// Coordenadas da nave: origem no centro de giro, ponta para cima, y crescendo para baixo, em unidades do mundo.

export const classic = {
  id: 'classic',
  label: 'Classic',

  // Casco: o que bate. A física de contato, os obstáculos e os elogios leem estes vértices.
  hull: [
    { x: 0, y: -11 },   // ponta
    { x: 7, y: 8 },     // canto de baixo, à direita
    { x: -7, y: 8 },    // canto de baixo, à esquerda
  ],

  // Pés: a linha de baixo, que precisa estar sobre a plataforma no pouso (y abaixo do centro e meia largura)
  feet: { y: 8, half: 7 },

  // Bocal: de onde sai a chama do propulsor (y da boca e meia largura); a chama mede `flame` mais um sorteio
  nozzle: { y: 7, half: 4, flame: 9, flicker: 9 },

  // Porta: para onde a tripulação corre no embarque
  door: { x: 0, y: 8 },

  // Contorno desenhado: o que o jogador vê. Tem um entalhe embaixo, mas fica dentro do casco
  // (um teste confere a folga, para a nave que o jogador vê ser a nave que bate).
  outline: [
    { x: 0, y: -11 },
    { x: 7, y: 8 },
    { x: 0, y: 4 },
    { x: -7, y: 8 },
  ],
};
