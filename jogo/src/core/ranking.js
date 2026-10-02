// Ranking por fase e por nickname (#87). Regras puras, sem rede e sem navegador.

// Nickname: de 3 a 12 letras, números ou "_", em maiúsculas. Maiúsculas e minúsculas não fazem
// diferença ("Fer" e "FER" são o mesmo jogador), e o nick serve de chave no banco online.
export const normalizeNick = (s) => String(s || '').trim().toUpperCase().replace(/[^A-Z0-9_]/g, '').slice(0, 12);
export const validNick = (s) => normalizeNick(s).length >= 3;

// Física que muda a dificuldade: se um destes valores padrão mudar, os tempos antigos deixam de valer
const PHYSICS = ['gravity', 'thrust', 'maxSpeed', 'landingMaxVy', 'landingMaxVx', 'landingMaxAngle', 'padMargin'];

function hash(text) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = (Math.imul(h, 33) ^ text.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

// Chave do ranking de uma fase. Muda sozinha quando a fase muda (semente, regras do gerador ou
// física padrão), para tempos de versões diferentes da fase nunca se misturarem.
export function rankKey(def, physics) {
  const p = Object.fromEntries(PHYSICS.map((k) => [k, physics[k]]));
  return `${def.key}_${hash(JSON.stringify({ seed: def.seed ?? 'random', g: def.generator, p }))}`;
}

// Lista ordenada do mais rápido para o mais lento, a partir de { NICK: { time, control, at } }
export const sortRanking = (entries) => Object.entries(entries || {})
  .map(([nick, e]) => ({ nick, ...e }))
  .filter((e) => Number.isFinite(e.time))
  .sort((a, b) => a.time - b.time || a.at - b.at);
