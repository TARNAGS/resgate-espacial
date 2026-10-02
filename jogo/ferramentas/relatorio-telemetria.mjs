// Relatório da telemetria do playtest (#88). Lê os eventos do banco (Firebase) e mostra, por fase,
// onde os jogadores sofrem, e como o jogo roda em cada aparelho.
// Uso, na pasta do projeto:  node jogo/ferramentas/relatorio-telemetria.mjs [--desde 2026-10-02] [--incluir-local]

import { LEADERBOARD_URL } from '../src/config/online.js';

const since = process.argv.includes('--desde') ? process.argv[process.argv.indexOf('--desde') + 1] : '2026-10-01';
const res = await fetch(`${LEADERBOARD_URL}/telemetry.json`);
if (!res.ok) { console.error(`Não consegui ler a telemetria (${res.status}).`); process.exit(1); }
const days = (await res.json()) || {};
const all = Object.entries(days)
  .filter(([day]) => day >= since)
  .flatMap(([, evs]) => Object.values(evs))
  .filter((e) => e.ev !== 'test')
  .sort((a, b) => a.t - b.t);
// Sessões de teste local (localhost) ficam de fora, a não ser com --incluir-local
const localSids = new Set(all.filter((e) => e.ev === 'session' && /^(localhost|127.0.0.1)$/.test(e.host || '')).map((e) => e.sid));
const events = process.argv.includes('--incluir-local') ? all : all.filter((e) => !localSids.has(e.sid));

const by = (list, key) => list.reduce((m, e) => ((m[e[key]] ??= []).push(e), m), {});
const median = (xs) => { const s = xs.filter(Number.isFinite).sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : null; };
const avg = (xs) => { const s = xs.filter(Number.isFinite); return s.length ? s.reduce((a, b) => a + b, 0) / s.length : null; };
const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : '—');
const fmt = (x, d = 1) => (x == null ? '—' : Number(x).toFixed(d));
const count = (xs) => Object.entries(xs.reduce((m, x) => ((m[x] = (m[x] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1]);

console.log(`\nTELEMETRIA DO PLAYTEST · desde ${since} · ${events.length} eventos\n`);
if (!events.length) { console.log('Ainda não há eventos.'); process.exit(0); }

// Sessões e aparelhos
const sessions = events.filter((e) => e.ev === 'session');
const players = new Set(events.map((e) => e.nick).filter(Boolean));
console.log(`Sessões: ${sessions.length} · jogadores (nicks): ${players.size} (${[...players].join(', ') || '—'})`);
for (const [device, list] of Object.entries(by(sessions, 'device'))) {
  console.log(`  ${device}: ${list.length} sessões · carregamento mediano ${fmt(median(list.map((e) => e.loadMs)), 0)} ms · controles ${count(list.map((e) => e.control)).map(([k, n]) => `${k}×${n}`).join(' ')}`);
}

// Fases
const ends = events.filter((e) => e.ev === 'level_end');
const starts = events.filter((e) => e.ev === 'level_start');
const crashes = events.filter((e) => e.ev === 'crash');
console.log('\nFASES');
for (const [level, list] of Object.entries(by(ends, 'level'))) {
  const done = list.filter((e) => e.outcome === 'complete');
  const over = list.filter((e) => e.outcome === 'gameover');
  const quit = list.filter((e) => e.outcome === 'quit');
  const lvCrashes = crashes.filter((e) => e.level === level);
  const genMs = median(starts.filter((e) => e.level === level).map((e) => e.genMs));
  console.log(`\n  ${level}: ${list.length} tentativas · concluídas ${pct(done.length, list.length)} · fim de jogo ${pct(over.length, list.length)} · desistências ${pct(quit.length, list.length)}`);
  console.log(`    tempo das concluídas: mediano ${fmt(median(done.map((e) => e.time)))} s · melhor ${fmt(Math.min(...done.map((e) => e.time).filter(Number.isFinite)))} s`);
  console.log(`    mortes por tentativa: ${fmt(avg(list.map((e) => e.crashes)))} · abastecimentos por conclusão: ${fmt(avg(done.map((e) => e.refuels)))} · corridas perfeitas: ${done.filter((e) => e.perfect).length}`);
  console.log(`    motivos das mortes: ${count(lvCrashes.map((e) => e.reason)).map(([k, n]) => `${k} ×${n}`).join(' · ') || '—'}`);
  const zones = count(lvCrashes.map((e) => `${Math.floor(e.x / 400) * 400}-${Math.floor(e.x / 400) * 400 + 400}`)).slice(0, 4);
  console.log(`    onde morrem (posição x): ${zones.map(([k, n]) => `${k} ×${n}`).join(' · ') || '—'}`);
  const praise = ['closeCall', 'greatSave', 'perfectLanding', 'perfectRun'].map((k) => [k, list.reduce((s, e) => s + (e[`p_${k}`] || 0), 0)]).filter(([, n]) => n);
  console.log(`    elogios: ${praise.map(([k, n]) => `${k} ×${n}`).join(' · ') || '—'} · abrir a fase: ${fmt(genMs, 0)} ms`);
}

// Performance por aparelho (junta o aparelho da sessão com as partidas dela)
const deviceOf = Object.fromEntries(sessions.map((e) => [e.sid, e.device]));
console.log('\nPERFORMANCE (quadros por segundo durante as fases)');
for (const [device, list] of Object.entries(by(ends.map((e) => ({ ...e, device: deviceOf[e.sid] || '?' })), 'device'))) {
  console.log(`  ${device}: ${fmt(avg(list.map((e) => e.fps)), 0)} fps em média · engasgos ${fmt(avg(list.map((e) => e.jankPct)))}% dos quadros · pior quadro ${Math.max(...list.map((e) => e.worstMs || 0))} ms`);
}

// Abertura e ranking
const intros = events.filter((e) => e.ev === 'intro');
const skipped = intros.filter((e) => e.skipped);
console.log(`\nABERTURA: ${intros.length} vistas · puladas ${pct(skipped.length, intros.length)} · em que tela pulam: ${count(skipped.map((e) => `tela ${e.scene}`)).map(([k, n]) => `${k} ×${n}`).join(' · ') || '—'}`);
console.log(`RANKING aberto ${events.filter((e) => e.ev === 'ranking_open').length} vezes · saídas do app no meio da fase: ${events.filter((e) => e.ev === 'hidden').length}\n`);
