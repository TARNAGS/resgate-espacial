// Telemetria do playtest (#88)

import { test, assert, createTelemetry, cleanFields, createFrameStats, createRunTracker, encodePoint, decodePath, DT, p, run, memoryStorage } from '../lib.js';

function fakeTelemetryServer() {
  const srv = { db: {}, down: false, calls: 0 };
  srv.fetch = async (url, opts = {}) => {
    srv.calls += 1;
    if (srv.down) throw new Error('sem rede');
    const day = url.match(/telemetry\/([^/]+)\.json$/)[1];
    const body = JSON.parse(opts.body);
    for (const [id, e] of Object.entries(body)) {
      if (!/^[a-z0-9]{6,24}$/.test(id) || srv.db[day]?.[id]) return { ok: false, status: 401 };   // como as regras do banco
      if (Object.values(e).some((v) => typeof v === 'object')) return { ok: false, status: 401 };
    }
    srv.db[day] = { ...srv.db[day], ...body };
    return { ok: true, status: 200 };
  };
  return srv;
}

test('#88 telemetria: eventos vão em lote, com sessão, versão e nick, e saem da fila', async () => {
  const srv = fakeTelemetryServer();
  const tel = createTelemetry({ url: 'https://db.test', storage: memoryStorage(), fetchFn: srv.fetch, getNick: () => 'ANA' });
  tel.track('level_start', { level: 'w1-1', attempt: 1 });
  tel.track('crash', { level: 'w1-1', reason: 'HIT A ROCK', x: 812.4 });
  assert.equal(tel.pending, 2);
  assert.equal(await tel.flush(), 2);
  assert.equal(tel.pending, 0);
  assert.equal(srv.calls, 1);                              // um pedido para os dois eventos
  const events = Object.values(Object.values(srv.db)[0]);
  assert.equal(events.length, 2);
  for (const e of events) { assert.equal(e.nick, 'ANA'); assert.equal(e.sid, tel.sid); assert.ok(e.v && e.t); }
  assert.ok(Object.keys(Object.values(srv.db)[0]).every((id) => /^[a-z0-9]{6,24}$/.test(id)));
});

test('#88 telemetria: só valores planos e curtos vão para o banco', () => {
  const c = cleanFields({ n: 1.23456, b: true, s: 'x'.repeat(200), o: { a: 1 }, arr: [1], f: () => 1, 'bad key': 1, nan: NaN });
  assert.deepEqual(Object.keys(c).sort(), ['b', 'n', 's']);
  assert.equal(c.n, 1.235); assert.equal(c.s.length, 80);
});

test('#88 telemetria: sem internet, os eventos esperam na fila e saem quando a rede volta', async () => {
  const srv = fakeTelemetryServer();
  srv.down = true;
  const storage = memoryStorage();
  const tel = createTelemetry({ url: 'https://db.test', storage, fetchFn: srv.fetch });
  tel.track('session', { device: 'iphone' });
  assert.equal(await tel.flush(), 0);
  assert.equal(tel.pending, 1);
  // o jogo foi fechado e aberto de novo: a fila continua no aparelho
  const again = createTelemetry({ url: 'https://db.test', storage, fetchFn: srv.fetch });
  srv.down = false;
  assert.equal(await again.flush(), 1);
  assert.equal(again.pending, 0);
});

test('#88 telemetria: sem banco configurado, nada sai do aparelho', async () => {
  let called = false;
  const tel = createTelemetry({ url: '', storage: memoryStorage(), fetchFn: async () => { called = true; } });
  tel.track('session', {});
  assert.equal(await tel.flush(), 0);
  assert.equal(called, false); assert.equal(tel.pending, 0);
});

test('#88 medidor de quadros: quadros por segundo, engasgos e o pior quadro', () => {
  const fs = createFrameStats();
  for (let i = 0; i < 59; i++) fs.add(1 / 60);
  fs.add(0.05);          // um engasgo de 50 ms
  fs.add(5);             // volta de outra aba: ignorado
  const s = fs.summary();
  assert.ok(s.fps >= 55 && s.fps <= 60, `fps ${s.fps}`);
  assert.equal(s.worstMs, 50);
  assert.ok(Math.abs(s.jankPct - 1.7) < 0.1, `engasgos ${s.jankPct}%`);
});

test('#91 telemetria: se o banco recusar um lote, reenvia um a um e perde só o evento recusado', async () => {
  const stored = {};
  const fetchFn = async (url, { body }) => {
    const events = JSON.parse(body);
    if (Object.values(events).some((e) => e.ev === 'ruim')) return { ok: false, status: 401 };
    Object.assign(stored, events);
    return { ok: true, status: 200 };
  };
  const warn = console.warn; console.warn = () => {};
  const tel = createTelemetry({ url: 'https://exemplo.test', storage: null, fetchFn, now: () => Date.UTC(2026, 9, 4) });
  tel.track('session', {}); tel.track('ruim', {}); tel.track('level_start', {});
  await tel.flush();
  console.warn = warn;
  assert.deepEqual(Object.values(stored).map((e) => e.ev).sort(), ['level_start', 'session']);
  assert.equal(tel.pending, 0);
});

test('#91 medidor da tentativa: toques no propulsor, propulsor por trecho e o maior tempo voando solto', () => {
  const tr = createRunTracker();
  const ship = { state: 'flying', x: 500, y: 300, fuel: 0.8, thrusting: false };
  const run = (secs, thrust) => { for (let t = 0; t < secs - 1e-9; t += DT) { ship.thrusting = thrust; tr.step(DT, ship, thrust); } };
  run(1, true); run(2, false); run(0.5, true); run(0.5, false);
  const leg = tr.land();
  assert.ok(Math.abs(leg.legThrustS - 1.5) < 0.02 && Math.abs(leg.legS - 4) < 0.02);
  const sum = tr.summary();
  assert.equal(sum.presses, 2);
  assert.ok(Math.abs(sum.maxCoastS - 2) < 0.02 && Math.abs(sum.thrustS - 1.5) < 0.02);
  assert.equal(tr.land().legThrustS, 0, 'o trecho seguinte começa do zero');
});

test('#91 trajetória: pontos a cada 0,5 s, em textos de até 80 caracteres que voltam ao original', () => {
  const tr = createRunTracker();
  const ship = { state: 'flying', x: 0, y: 450, fuel: 1, thrusting: false };
  for (let t = 0; t < 30; t += DT) { ship.x = 4400 * (t / 30); ship.fuel = 1 - t / 30; tr.step(DT, ship, false); }
  const chunks = tr.pathChunks();
  assert.ok(chunks.length >= 5 && chunks.every((c) => c.length <= 80 && cleanFields({ p: c }).p === c));
  const pts = chunks.flatMap(decodePath);
  assert.ok(pts.length >= 59 && pts.length <= 61);
  assert.ok(pts.every((q, i) => i === 0 || q.x >= pts[i - 1].x));
  assert.deepEqual(decodePath(encodePoint({ x: 4321, y: 588, fuel: 0.37 })), [{ x: 4321, y: 588, fuel: 0.37 }]);
});
