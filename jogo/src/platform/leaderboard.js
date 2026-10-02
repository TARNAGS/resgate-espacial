import { LEADERBOARD_URL } from '../config/online.js';
import { sortRanking } from '../core/ranking.js';

// Ranking por fase e por nickname (#87). Guarda o melhor tempo de cada nick em cada fase.
//   - Sempre guarda no aparelho (vale sem internet).
//   - Com LEADERBOARD_URL (config/online.js), também guarda no banco online, compartilhado entre os
//     jogadores. Só escreve quando o tempo é melhor que o do mesmo nick lá. Se a rede falhar, o
//     envio fica numa fila e é tentado de novo depois (flush).
// Formato no banco: scores/<chave da fase>/<NICK> = { time, control, at }

const LOCAL_KEY = 'resgate-espacial:ranking';
const PENDING_KEY = 'resgate-espacial:ranking-pending';

function browserStorage() {
  try { return window.localStorage; } catch (_) { return null; }
}

export function createLeaderboard({ url = LEADERBOARD_URL, storage = browserStorage(), fetchFn = (...a) => fetch(...a) } = {}) {
  const base = (url || '').replace(/\/+$/, '');
  const read = (k, fallback) => { try { return JSON.parse(storage?.getItem(k)) ?? fallback; } catch (_) { return fallback; } };
  const write = (k, v) => { try { storage?.setItem(k, JSON.stringify(v)); } catch (_) { /* sem armazenamento */ } };

  async function remoteGet(path) {
    const r = await fetchFn(`${base}/${path}.json`);
    if (!r.ok) throw new Error(`ranking: ${r.status}`);
    return r.json();
  }
  async function remotePut(path, value) {
    const r = await fetchFn(`${base}/${path}.json`, { method: 'PUT', body: JSON.stringify(value) });
    if (!r.ok) throw new Error(`ranking: ${r.status}`);
  }

  // Envia ao banco online só se for melhor que o tempo que já está lá
  async function sendIfBetter({ key, nick, entry }) {
    const current = await remoteGet(`scores/${key}/${nick}`);
    if (current && current.time <= entry.time) return false;
    await remotePut(`scores/${key}/${nick}`, entry);
    return true;
  }

  return {
    online: Boolean(base),

    async submit({ key, nick, time, control }) {
      const entry = { time, control, at: Date.now() };
      const all = read(LOCAL_KEY, {});
      const mine = all[key]?.[nick];
      const improved = !mine || time < mine.time;
      if (improved) { all[key] = { ...all[key], [nick]: entry }; write(LOCAL_KEY, all); }
      if (!base) return { improved, online: false };
      try {
        return { improved: await sendIfBetter({ key, nick, entry }), online: true };
      } catch (_) {
        write(PENDING_KEY, [...read(PENDING_KEY, []), { key, nick, entry }]);
        return { improved, online: false, queued: true };
      }
    },

    // Ranking de uma fase: do banco online, se houver e responder; senão, do aparelho
    async top(key) {
      if (base) {
        try { return { online: true, list: sortRanking(await remoteGet(`scores/${key}`)) }; }
        catch (_) { /* sem rede: cai no aparelho */ }
      }
      return { online: false, list: sortRanking(read(LOCAL_KEY, {})[key]) };
    },

    // Tenta de novo os envios que falharam por falta de rede
    async flush() {
      if (!base) return 0;
      const pending = read(PENDING_KEY, []);
      const left = [];
      for (const p of pending) {
        try { await sendIfBetter(p); } catch (_) { left.push(p); }
      }
      write(PENDING_KEY, left);
      return pending.length - left.length;
    },
  };
}
