import { classic } from './classic.js';

// Catálogo de naves (E-26, #121). A forma da nave fica num lugar só: a física, o contato, o pouso, a previsão
// do pouso, o piloto automático, os elogios e o desenho leem a definição daqui. Cada nave tem:
//
//   id, label   o nome no catálogo
//   hull        casco: o polígono que bate, em coordenadas da nave (ponta para cima, y para baixo)
//   feet        { y, half }: a linha de baixo, que precisa estar sobre a plataforma no pouso
//   nozzle      { y, half, flame, flicker }: de onde sai a chama e o tamanho dela
//   door        { x, y }: para onde a tripulação corre no embarque
//   outline     o contorno desenhado; fica dentro de uma folga pequena em volta do casco (teste em
//               testes/regras/nave.test.js)
//
// Pela D-034, a nave clássica é o casco padrão. Uma nave que mude o casco ou os atributos muda o jogo e
// precisa ser marcada assim (#122).

export const SHIPS = {
  [classic.id]: classic,
};

export const DEFAULT_SHIP = classic;
