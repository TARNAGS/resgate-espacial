// Ranking por nickname (#87)

import { test, assert, DEFAULT_PARAMS, LEVELS, rankKey, normalizeNick, validNick, createLeaderboard, memoryStorage } from '../lib.js';

// Banco online de mentira, no formato do Firebase (GET e PUT em <caminho>.json)
function fakeServer({ down = false } = {}) {
  const db = {};
  const srv = {
    db, down,
    fetch: async (url, opts = {}) => {
      if (srv.down) throw new Error('sem rede');
      const path = url.replace('https://db.test/', '').replace(/\.json$/, '').split('/');
      if (opts.method === 'PUT') {
        let node = db;
        for (const k of path.slice(0, -1)) node = node[k] ??= {};
        node[path.at(-1)] = JSON.parse(opts.body);
        return { ok: true, json: async () => null };
      }
      let node = db;
      for (const k of path) node = node?.[k];
      return { ok: true, json: async () => node ?? null };
    },
  };
  return srv;
}

test('#87 nickname: 3 a 12 letras ou números, sem diferença entre maiúsculas e minúsculas', () => {
  assert.equal(normalizeNick('  fer_13 '), 'FER_13');
  assert.equal(normalizeNick('Fer Nando!'), 'FERNANDO');
  assert.equal(normalizeNick('abcdefghijklmnop'), 'ABCDEFGHIJKL');
  assert.ok(validNick('Fer')); assert.ok(!validNick('Fe')); assert.ok(!validNick('!!'));
});

test('#87 a chave do ranking muda quando a fase muda, e não muda à toa', () => {
  const lv = LEVELS[2];
  assert.equal(rankKey(lv, DEFAULT_PARAMS), rankKey(lv, { ...DEFAULT_PARAMS }));
  assert.notEqual(rankKey(lv, DEFAULT_PARAMS), rankKey({ ...lv, seed: lv.seed + 1 }, DEFAULT_PARAMS));
  assert.notEqual(rankKey(lv, DEFAULT_PARAMS), rankKey({ ...lv, generator: { ...lv.generator, minGap: 1 } }, DEFAULT_PARAMS));
  assert.notEqual(rankKey(lv, DEFAULT_PARAMS), rankKey(lv, { ...DEFAULT_PARAMS, gravity: 60 }));
  assert.equal(rankKey(lv, DEFAULT_PARAMS), rankKey(lv, { ...DEFAULT_PARAMS, touchScheme: 'hold' }));  // o controle não muda a fase
  assert.match(rankKey(lv, DEFAULT_PARAMS), /^[A-Za-z0-9_-]+$/);   // seguro como caminho no banco
});

test('#87 só um tempo melhor substitui o do mesmo nick; o ranking vem do mais rápido ao mais lento', async () => {
  const srv = fakeServer();
  const lb = createLeaderboard({ url: 'https://db.test', storage: memoryStorage(), fetchFn: srv.fetch });
  assert.equal((await lb.submit({ key: 'k', nick: 'ANA', time: 40, control: 'twin' })).improved, true);
  assert.equal((await lb.submit({ key: 'k', nick: 'ANA', time: 45, control: 'twin' })).improved, false);
  await lb.submit({ key: 'k', nick: 'BRUNO', time: 38, control: 'hold' });
  assert.equal((await lb.submit({ key: 'k', nick: 'ANA', time: 36, control: 'twin' })).improved, true);
  const { online, list } = await lb.top('k');
  assert.equal(online, true);
  assert.deepEqual(list.map((r) => [r.nick, r.time]), [['ANA', 36], ['BRUNO', 38]]);
});

test('#87 o mesmo nick em outro aparelho atualiza a mesma linha do ranking', async () => {
  const srv = fakeServer();
  const phone = createLeaderboard({ url: 'https://db.test', storage: memoryStorage(), fetchFn: srv.fetch });
  const pc = createLeaderboard({ url: 'https://db.test', storage: memoryStorage(), fetchFn: srv.fetch });
  await phone.submit({ key: 'k', nick: 'ANA', time: 50 });
  assert.equal((await pc.submit({ key: 'k', nick: 'ANA', time: 55 })).improved, false);   // o banco já tem 50
  await pc.submit({ key: 'k', nick: 'ANA', time: 42 });
  const { list } = await phone.top('k');
  assert.deepEqual(list.map((r) => [r.nick, r.time]), [['ANA', 42]]);
});

test('#87 sem rede: o tempo fica no aparelho e numa fila, e vai para o banco quando a rede volta', async () => {
  const srv = fakeServer({ down: true });
  const lb = createLeaderboard({ url: 'https://db.test', storage: memoryStorage(), fetchFn: srv.fetch });
  const r = await lb.submit({ key: 'k', nick: 'ANA', time: 40 });
  assert.equal(r.queued, true);
  assert.equal((await lb.top('k')).online, false);
  srv.down = false;
  assert.equal(await lb.flush(), 1);
  assert.equal(srv.db.scores.k.ANA.time, 40);
});

test('#87 o banco recusou (outro aparelho já tem um tempo melhor): não fica tentando de novo', async () => {
  const lb = createLeaderboard({ url: 'https://db.test', storage: memoryStorage(), fetchFn: async (url, opts = {}) => (opts.method === 'PUT' ? { ok: false, status: 401, json: async () => null } : { ok: true, status: 200, json: async () => null }) });
  const r = await lb.submit({ key: 'k', nick: 'ANA', time: 40 });
  assert.equal(r.online, true); assert.equal(r.improved, false); assert.ok(!r.queued);
  assert.equal(await lb.flush(), 0);
});

test('#87 sem banco configurado, o ranking fica só no aparelho', async () => {
  const lb = createLeaderboard({ url: '', storage: memoryStorage() });   // url vazia: sem banco
  await lb.submit({ key: 'k', nick: 'ANA', time: 40 });
  const { online, list } = await lb.top('k');
  assert.equal(lb.online, false); assert.equal(online, false); assert.equal(list[0].nick, 'ANA');
});
