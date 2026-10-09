import { LEADERBOARD_URL } from '../config/online.js';

// Telemetria do playtest (#88, D-025): o que acontece nas partidas, para melhorar as fases e a
// performance. Vai para o mesmo banco do ranking (Firebase), em telemetry/<dia>/<id>.
//
//   - Eventos pequenos e planos: só números, sim/não e textos curtos. Sem dados do aparelho além
//     do tipo (iPhone, Android, PC), do tamanho da tela e do controle usado.
//   - Junto vai o nickname, que o jogador escolheu sabendo que é o ID dele (aviso na tela de nick).
//   - Os eventos ficam numa fila no aparelho e vão em lotes (um pedido por lote). Sem internet,
//     esperam; a fila tem limite, para não crescer sem fim.
//   - Sem banco configurado (LEADERBOARD_URL vazio), nada sai do aparelho.

export const BUILD = '2026-10-09a';       // versão do jogo, para separar os dados por versão; também é a chave do patch note (#126)
const QUEUE_KEY = 'resgate-espacial:telemetry';
const MAX_QUEUE = 400;
const BATCH = 40;

function browserStorage() {
  try { return window.localStorage; } catch (_) { return null; }
}

// Só valores planos e curtos (o banco recusa o resto)
export function cleanFields(data) {
  const out = {};
  for (const [k, v] of Object.entries(data || {})) {
    if (!/^[A-Za-z0-9_]{1,24}$/.test(k)) continue;
    if (typeof v === 'number' && Number.isFinite(v)) out[k] = Math.round(v * 1000) / 1000;
    else if (typeof v === 'boolean') out[k] = v;
    else if (typeof v === 'string') out[k] = v.slice(0, 80);
  }
  return out;
}

export const dayOf = (t) => new Date(t).toISOString().slice(0, 10);

export function createTelemetry({
  url = LEADERBOARD_URL, storage = browserStorage(), fetchFn = (...a) => fetch(...a),
  now = () => Date.now(), random = Math.random, getNick = () => null,
} = {}) {
  const base = (url || '').replace(/\/+$/, '');
  const read = () => { try { return JSON.parse(storage?.getItem(QUEUE_KEY)) || []; } catch (_) { return []; } };
  const save = () => { try { storage?.setItem(QUEUE_KEY, JSON.stringify(queue)); } catch (_) { /* sem armazenamento */ } };
  let queue = read();
  let counter = 0;
  let sending = false;
  const newId = () => `${now().toString(36)}${(counter++).toString(36)}${Math.floor(random() * 36 ** 4).toString(36)}`.slice(0, 24);
  const sid = newId();   // sessão: uma por abertura do jogo

  const t = {
    sid,
    enabled: Boolean(base),

    track(ev, data = {}) {
      if (!base) return;
      const nick = getNick();
      const e = { ev, t: now(), sid, v: BUILD, ...(nick ? { nick } : {}), ...cleanFields(data) };
      queue.push([dayOf(e.t), newId(), e]);
      if (queue.length > MAX_QUEUE) queue = queue.slice(-MAX_QUEUE);
      save();
      if (queue.length >= BATCH) t.flush();
    },

    // Envia a fila em lotes, um pedido por dia de evento (PATCH grava vários de uma vez)
    async flush({ keepalive = false } = {}) {
      if (!base || sending || !queue.length) return 0;
      sending = true;
      let sent = 0;
      try {
        const batch = queue.slice(0, BATCH);
        const byDay = {};
        for (const [day, id, e] of batch) (byDay[day] ??= {})[id] = e;
        const send = (day, events) => fetchFn(`${base}/telemetry/${day}.json`, { method: 'PATCH', body: JSON.stringify(events), keepalive });
        for (const [day, events] of Object.entries(byDay)) {
          const r = await send(day, events);
          if (!r.ok && r.status !== 401) throw new Error(`telemetria: ${r.status}`);
          // 401: o banco recusou o lote. Um evento recusado derruba o lote inteiro, então reenvia um a um
          // e descarta só o que o banco recusar, sem travar a fila nem perder os outros (#91)
          if (r.status === 401 && Object.keys(events).length > 1) {
            for (const [id, e] of Object.entries(events)) {
              const one = await send(day, { [id]: e });
              if (!one.ok && one.status !== 401) throw new Error(`telemetria: ${one.status}`);
              if (one.status === 401) console.warn('telemetria recusada pelo banco:', e.ev, Object.keys(e).join(','));
              queue = queue.filter(([d, qid]) => d !== day || qid !== id);
              sent += 1;
            }
            continue;
          }
          const ids = new Set(Object.keys(events));
          queue = queue.filter(([d, id]) => d !== day || !ids.has(id));
          sent += ids.size;
        }
      } catch (_) {
        /* sem rede: tenta de novo depois */
      } finally {
        save();
        sending = false;
      }
      return sent;
    },

    get pending() { return queue.length; },
  };
  return t;
}

// Medidas de uma tentativa, passo a passo (#91, D-029): uso do propulsor, combustível de cada trecho
// e a trajetória da nave. A trajetória vai em pedaços curtos, porque o banco só aceita textos curtos.
const PATH_EVERY = 0.5;          // segundos entre dois pontos da trajetória
const PATH_PER_CHUNK = 11;       // pontos por evento (7 caracteres cada, até 80 por texto)
const b36 = (n, width) => Math.max(0, Math.min(36 ** width - 1, Math.round(n))).toString(36).padStart(width, '0');
// Um ponto: x (3 caracteres), y (2) e combustível em % (2), em base 36
export const encodePoint = (s) => b36(s.x, 3) + b36(s.y, 2) + b36(s.fuel * 100, 2);
export function decodePath(text) {
  const out = [];
  for (let i = 0; i + 7 <= text.length; i += 7) {
    out.push({ x: parseInt(text.slice(i, i + 3), 36), y: parseInt(text.slice(i + 3, i + 5), 36), fuel: parseInt(text.slice(i + 5, i + 7), 36) / 100 });
  }
  return out;
}

export function createRunTracker() {
  let thrustS = 0, presses = 0, coast = 0, maxCoast = 0, held = false;
  let legThrust = 0, legT = 0, sampleT = 0;
  const points = [];
  return {
    // Um passo de física: a nave depois do passo e se o jogador estava apertando o propulsor
    step(dt, ship, thrustInput) {
      if (thrustInput && !held) presses += 1;
      held = Boolean(thrustInput);
      if (ship.state !== 'flying') return;
      legT += dt;
      if (ship.thrusting) { thrustS += dt; legThrust += dt; coast = 0; } else { coast += dt; maxCoast = Math.max(maxCoast, coast); }
      sampleT += dt;
      if (sampleT >= PATH_EVERY) { sampleT -= PATH_EVERY; points.push(encodePoint(ship)); }
    },
    // Pousou: devolve o propulsor e o tempo do trecho, e começa outro
    land() {
      const leg = { legThrustS: legThrust, legS: legT };
      legThrust = 0; legT = 0; coast = 0;
      return leg;
    },
    summary: () => ({ thrustS, presses, maxCoastS: maxCoast }),
    pathChunks() {
      const out = [];
      for (let i = 0; i < points.length; i += PATH_PER_CHUNK) out.push(points.slice(i, i + PATH_PER_CHUNK).join(''));
      return out;
    },
  };
}

// Medidor de quadros: quantos quadros por segundo, quantos engasgos (quadros acima de 33 ms, que o
// jogador percebe) e o pior quadro. Só conta enquanto a fase está rodando.
export function createFrameStats() {
  let frames = 0, total = 0, janks = 0, worst = 0;
  return {
    add(seconds) {
      if (!(seconds > 0) || seconds > 1) return;   // ignora pausas e a volta de outra aba
      frames += 1;
      total += seconds;
      if (seconds > 1 / 30) janks += 1;
      worst = Math.max(worst, seconds);
    },
    summary() {
      return {
        fps: frames && total ? Math.round(frames / total) : 0,
        jankPct: frames ? Math.round((janks / frames) * 1000) / 10 : 0,
        worstMs: Math.round(worst * 1000),
      };
    },
  };
}

// Tipo de aparelho, sem identificar a pessoa
export function deviceKind(ua = navigator.userAgent) {
  if (/iPhone|iPod/.test(ua)) return 'iphone';
  if (/iPad|Macintosh.*Mobile/.test(ua)) return 'ipad';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}
