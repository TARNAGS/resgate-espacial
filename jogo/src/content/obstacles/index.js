import { rock } from './rock.js';

// Catálogo de obstáculos (P-011, #60). Para criar um obstáculo novo, crie um arquivo nesta pasta
// com o mesmo formato da pedra e registre aqui. A colisão, o gerador e o piloto automático só falam com
// este contrato, e um teste confere cada obstáculo do catálogo (#119, testes/conteudo/contrato-obstaculo.test.js).
// Cada tipo tem:
//
//   type, label          o nome no catálogo e o nome no motivo da batida ("HIT A ROCK")
//   moving               true se o obstáculo se move (aí precisa de update)
//   example              opções de um nível de exemplo, usadas pelos testes
//   generate(ctx)        → lista de instâncias, a partir das opções do nível e da semente; a mesma semente
//                          gera sempre os mesmos obstáculos
//   bounds(o)            → { x1, x2 }, para só desenhar o que está na tela; cobre todo o desenho
//   hits(o, ship)        → true se a nave encostou (ship tem x, y, verts e samples)
//   validate(o, level)   → texto do problema se o cenário ficar sem solução, ou null
//   blockedAt(o, x, m)   → faixa [y1, y2] que o obstáculo ocupa em x, com folga m, ou null; é o que o
//                          piloto automático usa para planejar a melhor rota (core/autopilot.js). Precisa
//                          cobrir todo lugar em que hits acusa batida, senão o piloto prova uma rota que explode.
//                          Obstáculos móveis vão precisar de uma versão que considere o tempo.
//   draw(ctx, o, theme, t)  só desenha: nunca muda o obstáculo (#113)
//   update(o, time)      → só nos móveis; mudam de posição com o tempo da partida

export const OBSTACLES = {
  [rock.type]: rock,
};
