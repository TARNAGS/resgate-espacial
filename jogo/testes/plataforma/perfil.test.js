// Perfil do jogador no banco (#102, D-029)

import { test, assert, LEVELS, createProfileSync, mergeIntoSave, profileUpdate, emptySave, isUnlocked, recordCompletion, p } from '../lib.js';

// Banco simulado com as regras do perfil: só aceita progresso que cresce
function fakeProfileDb() {
  const players = {};
  const grows = (cur, next, path) => {
    if (path.startsWith('levels/')) {
      if (cur && cur.completed && !next.completed) return false;
      if (cur && next.rescues < cur.rescues) return false;
      if (cur && cur.best !== undefined && (next.best === undefined || next.best > cur.best)) return false;
      return true;
    }
    if (path.startsWith('praise/')) return cur === undefined || next >= cur;
    if (path.startsWith('seen/')) return next === true;
    return true;
  };
  const get = (obj, path) => path.split('/').reduce((o, k) => o?.[k], obj);
  const set = (obj, path, v) => { const ks = path.split('/'); const last = ks.pop(); ks.reduce((o, k) => (o[k] ??= {}), obj)[last] = v; };
  return {
    players,
    async fetchFn(url, opts = {}) {
      const nick = url.match(/players\/([^.]+)\.json/)[1];
      if (!opts.method) return { ok: true, status: 200, json: async () => players[nick] ?? null };
      const update = JSON.parse(opts.body);
      const me = players[nick] ?? {};
      if (!Object.entries(update).every(([p, v]) => grows(get(me, p), v, p))) return { ok: false, status: 401 };
      for (const [p, v] of Object.entries(update)) set(me, p, v);
      players[nick] = me;
      return { ok: true, status: 200 };
    },
  };
}
const withRun = (save, key, time) => { const s = structuredClone(save); recordCompletion(s, key, { time }); return s; };

test('#102 perfil: o mesmo nick em outro aparelho continua de onde parou (fases, melhor tempo, telas vistas e elogios)', async () => {
  const db = fakeProfileDb();
  const sync = createProfileSync({ url: 'https://exemplo.test', fetchFn: db.fetchFn });
  let a = withRun({ ...emptySave(), nick: 'PILOTO' }, 'w1-1', 30);
  a.seen.intro = true; a.praise.closeCall = 2; a.settings.touchScheme = 'hold';
  assert.equal(await sync.push('PILOTO', a), 'ok');
  // aparelho novo, sem progresso: traz tudo, inclusive as configurações
  const b = mergeIntoSave({ ...emptySave(), nick: 'PILOTO' }, await sync.pull('PILOTO'));
  assert.equal(b.levels['w1-1'].completed, true); assert.equal(b.levels['w1-1'].best.time, 30);
  assert.equal(b.seen.intro, true); assert.equal(b.praise.closeCall, 2); assert.equal(b.settings.touchScheme, 'hold');
  assert.equal(isUnlocked(b, LEVELS[1]), true);
  // o aparelho B melhora o tempo e conclui o nível 2; o A recebe sem perder nada
  const b2 = withRun(withRun(b, 'w1-1', 25), 'w1-2', 40);
  assert.equal(await sync.push('PILOTO', b2), 'ok');
  a = mergeIntoSave(a, await sync.pull('PILOTO'));
  assert.equal(a.levels['w1-1'].best.time, 25); assert.equal(a.levels['w1-1'].rescues, 2);
  assert.equal(a.levels['w1-2'].completed, true);
  assert.equal(a.settings.touchScheme, 'hold', 'num aparelho com progresso, as configurações do aparelho valem');
});

test('#102 perfil: juntar fica sempre com o melhor de cada um, e o banco recusa progresso que volta atrás', async () => {
  const db = fakeProfileDb();
  const sync = createProfileSync({ url: 'https://exemplo.test', fetchFn: db.fetchFn });
  const good = withRun(withRun({ ...emptySave() }, 'w1-1', 30), 'w1-1', 28);
  good.praise.greatSave = 5;
  await sync.push('PILOTO', good);
  const worse = withRun({ ...emptySave() }, 'w1-1', 35);
  assert.equal(await sync.push('PILOTO', worse), 'refused', 'tempo pior e menos resgates sem juntar antes');
  const merged = mergeIntoSave(worse, await sync.pull('PILOTO'));
  assert.equal(merged.levels['w1-1'].best.time, 28); assert.equal(merged.levels['w1-1'].rescues, 2); assert.equal(merged.praise.greatSave, 5);
  assert.equal(await sync.push('PILOTO', merged), 'ok');
  assert.deepEqual(profileUpdate(merged)['levels/w1-1'], { completed: true, rescues: 2, best: 28 });
});

test('#102 perfil: sem internet ou sem banco, nada quebra e o progresso fica no aparelho', async () => {
  const offline = createProfileSync({ url: 'https://exemplo.test', fetchFn: async () => { throw new Error('sem rede'); } });
  assert.equal(await offline.pull('PILOTO'), null);
  assert.equal(await offline.push('PILOTO', emptySave()), 'offline');
  const none = createProfileSync({ url: '' });
  assert.equal(none.online, false);
  assert.equal(await none.push('PILOTO', emptySave()), 'offline');
  const save = withRun({ ...emptySave() }, 'w1-1', 30);
  assert.deepEqual(mergeIntoSave(save, null), save);
});
