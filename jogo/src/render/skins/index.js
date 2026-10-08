import { classic } from './classic.js';
import { hitbox } from './hitbox.js';

// Catálogo de skins (#124). Uma skin muda só a aparência: nunca uma regra, nunca o que bate e nunca o ranking
// (D-034 e D-035). Para criar uma skin, crie um arquivo nesta pasta com o mesmo formato da classic, registre aqui
// e acrescente a chave nas opções do parâmetro `skin` (config/params.js). Um teste confere cada skin do catálogo
// (testes/conteudo/contrato-skin.test.js). Cada skin tem:
//
//   key, label                   o nome no catálogo e no painel de ajuste
//   theme(theme)                 → as cores do mundo que a skin usa (recebe as do mundo; a classic devolve as mesmas)
//   ship(ctx, ship, landingSafe)  desenha a nave em coordenadas da nave. Recebe a nave da partida (casco, contorno,
//                                bocal) e não consegue defini-la: o casco vem de content/ships/. O desenho fica a
//                                no máximo SHIP_MARGIN do casco, para a nave que o jogador vê ser a nave que bate
//   flame(ctx, nozzle)           desenha a chama a partir do bocal da nave
//   obstacles: { <tipo>(ctx, o, theme, t) }   um desenho por tipo de obstáculo; fica dentro de bounds(o)
//
// A skin só desenha: nunca muda a partida (#113). O que faltar numa skin, a classic completa.

export const SKINS = {
  [classic.key]: classic,
  [hitbox.key]: hitbox,
};

export const DEFAULT_SKIN = classic;

// Folga máxima entre o desenho da nave e o casco, em unidades do mundo. Sem ela, uma nave desenhada com asas
// compridas passaria "por dentro" de uma pedra sem explodir, e o jogador acharia que é defeito.
export const SHIP_MARGIN = 3;

const resolved = new Map();

// A skin em uso, completada pela classic. Chave desconhecida vira a classic.
export function resolveSkin(key) {
  const skin = SKINS[key] ?? DEFAULT_SKIN;
  if (skin === DEFAULT_SKIN) return skin;
  if (!resolved.has(skin)) resolved.set(skin, { ...DEFAULT_SKIN, ...skin, obstacles: { ...DEFAULT_SKIN.obstacles, ...skin.obstacles } });
  return resolved.get(skin);
}
