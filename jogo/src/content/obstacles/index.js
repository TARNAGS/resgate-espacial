import { rock } from './rock.js';

// Catálogo de obstáculos (P-011, #60). Para criar um obstáculo novo, crie um arquivo nesta pasta
// com o mesmo formato da pedra e registre aqui. Cada tipo responde:
//
//   generate(ctx)        → lista de instâncias, a partir das opções do nível e da semente
//   bounds(o)            → { x1, x2 }, para só desenhar o que está na tela
//   hits(o, ship)        → true se a nave encostou (ship tem x, y, verts e samples)
//   draw(ctx, o, theme, t)
//   update(o, time)      → opcional; obstáculos móveis mudam de posição com o tempo da partida
//   validate(o, level)   → opcional; texto do problema se o cenário ficar sem solução, ou null

export const OBSTACLES = {
  [rock.type]: rock,
};
