// Ranking por fase e por nickname (#87). Regras puras, sem rede e sem navegador.

import { PARAM_KIND } from '../config/params.js';

// Nickname: de 3 a 12 letras, números ou "_", em maiúsculas. Maiúsculas e minúsculas não fazem
// diferença ("Fer" e "FER" são o mesmo jogador), e o nick serve de chave no banco online.
export const normalizeNick = (s) => String(s || '').trim().toUpperCase().replace(/[^A-Z0-9_]/g, '').slice(0, 12);
export const validNick = (s) => normalizeNick(s).length >= 3;

// Chave do ranking (#120): entra tudo o que muda o jogo, sem lista escrita à mão.
// Os 7 primeiros parâmetros sempre entraram (#87). Os outros parâmetros de jogo (PARAM_KIND) só entram na conta
// quando ficam diferentes do valor que tinham quando passaram a contar, para as chaves de hoje não mudarem.
const ALWAYS = ['gravity', 'thrust', 'maxSpeed', 'landingMaxVy', 'landingMaxVx', 'landingMaxAngle', 'padMargin'];
const SINCE = { keyRotationSpeed: 210, touchRotationSpeed: 420, refuelPerSecond: 0.6, boardingSeconds: 2, lives: 3 };   // 07/10/2026

// Versão das regras: subir quando o código de uma regra mudar de propósito (colisão, pouso, cronômetro) e o
// ranking precisar recomeçar. As fichas de ouro (#114) que mudarem lembram de subir. A versão 1 não entra na conta.
export const RULES_VERSION = 1;

function hash(text) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = (Math.imul(h, 33) ^ text.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

export const rankedParams = () => Object.keys(PARAM_KIND).filter((k) => PARAM_KIND[k] === 'jogo');
export const rankBaseline = (k) => SINCE[k];

// Chave do ranking de uma fase. Muda sozinha quando o jogo da fase muda (semente, regras do gerador, física,
// modificadores, nave que muda o jogo, evoluções de atributos, modo ou versão das regras), para tempos de
// versões diferentes nunca se misturarem. Aparência nunca muda a chave (D-034, D-035).
export function rankKey(def, physics, { ship = null, upgrades = [], mode = null, rulesVersion = RULES_VERSION } = {}) {
  const p = Object.fromEntries(ALWAYS.map((k) => [k, physics[k]]));
  for (const k of rankedParams()) if (!ALWAYS.includes(k) && physics[k] !== SINCE[k]) p[k] = physics[k];
  const more = {};
  if (def.modifiers?.length) more.mods = def.modifiers;
  if (ship?.changesGameplay) more.ship = ship.key;
  const attributes = upgrades.filter((u) => u.modifiers?.length).map((u) => u.key);
  if (attributes.length) more.upgrades = attributes;
  if (mode) more.mode = mode.key;
  if (rulesVersion > 1) more.rules = rulesVersion;
  return `${def.key}_${hash(JSON.stringify({ seed: def.seed ?? 'random', g: def.generator, p, ...more }))}`;
}

// Lista ordenada do mais rápido para o mais lento, a partir de { NICK: { time, control, at } }
export const sortRanking = (entries) => Object.entries(entries || {})
  .map(([nick, e]) => ({ nick, ...e }))
  .filter((e) => Number.isFinite(e.time))
  .sort((a, b) => a.time - b.time || a.at - b.at);
