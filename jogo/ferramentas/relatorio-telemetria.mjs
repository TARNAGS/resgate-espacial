// Relatório da telemetria do playtest (#88, #91). Lê os eventos e o ranking do banco (Firebase) e mostra,
// por fase, onde os jogadores sofrem, como usam o propulsor e o combustível, e como o jogo roda em cada
// aparelho. Os mapas de calor (onde morrem, batem, ganham elogios e por onde voam) saem em outro comando:
// node jogo/ferramentas/mapas-telemetria.mjs
// Uso, na pasta do projeto:  node jogo/ferramentas/relatorio-telemetria.mjs [--desde 2026-10-02] [--incluir-local]

import { LEADERBOARD_URL } from '../src/config/online.js';

const since = process.argv.includes('--desde') ? process.argv[process.argv.indexOf('--desde') + 1] : '2026-10-01';
const res = await fetch(`${LEADERBOARD_URL}/telemetry.json`);
if (!res.ok) { console.error(`Não consegui ler a telemetria (${res.status}).`); process.exit(1); }
const raw = await res.text();
const days = JSON.parse(raw) || {};
const scores = (await (await fetch(`${LEADERBOARD_URL}/scores.json`)).json()) || {};
const FERNANDO = 'TARNAG';   // o nick do Fernando (CLAUDE.md do projeto, "Análise dos playtests")
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

console.log(`\nTELEMETRIA DO PLAYTEST · desde ${since} · ${events.length} eventos · banco: ${(raw.length / 1024).toFixed(0)} KB de telemetria (acompanhar o plano gratuito no console do Firebase)\n`);
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
// Jogador de cada sessão (o primeiro nick visto nela), para contar por pessoa
const nickOf = {};
for (const e of events) if (e.nick && !nickOf[e.sid]) nickOf[e.sid] = e.nick;
console.log('\nFASES  ("recomeçou ou saiu" quase sempre é recomeçar logo depois de morrer, para não estragar o tempo)');
for (const [level, list] of Object.entries(by(ends, 'level'))) {
  const done = list.filter((e) => e.outcome === 'complete');
  const over = list.filter((e) => e.outcome === 'gameover');
  const quit = list.filter((e) => ['quit', 'restart', 'menu', 'switch', 'close'].includes(e.outcome));
  const lvCrashes = crashes.filter((e) => e.level === level);
  const genMs = median(starts.filter((e) => e.level === level).map((e) => e.genMs));
  // Desde a versão 2026-10-04a, sair se divide em recomeçar, voltar ao menu, trocar de fase e fechar o app
  const split = count(quit.map((e) => e.outcome)).map(([k, n]) => `${{ quit: 'saiu (versão antiga)', restart: 'recomeçou', menu: 'menu', switch: 'trocou de fase', close: 'fechou o app' }[k] || k} ×${n}`).join(' · ');
  console.log(`\n  ${level}: ${list.length} tentativas · concluídas ${pct(done.length, list.length)} · fim de jogo ${pct(over.length, list.length)} · recomeçou ou saiu ${pct(quit.length, list.length)} (${quit.filter((e) => e.crashes).length} depois de morrer${split ? `; ${split}` : ''})`);
  // Por jogador: quantas tentativas até a primeira conclusão, e quem ainda não concluiu
  const firstWin = [];
  let stuck = 0;
  for (const mine of Object.values(by(list.map((e) => ({ ...e, who: nickOf[e.sid] || e.sid })), 'who'))) {
    const i = mine.sort((a, b) => a.t - b.t).findIndex((e) => e.outcome === 'complete');
    if (i >= 0) firstWin.push(i + 1); else stuck += 1;
  }
  console.log(`    jogadores: ${firstWin.length + stuck} · concluíram ${firstWin.length} · tentativas até a 1ª conclusão: ${firstWin.sort((a, b) => a - b).join(', ') || '—'}${stuck ? ` · ainda sem concluir: ${stuck}` : ''}`);
  console.log(`    tempo das concluídas: mediano ${fmt(median(done.map((e) => e.time)))} s · melhor ${fmt(Math.min(...done.map((e) => e.time).filter(Number.isFinite)))} s`);
  console.log(`    mortes por tentativa: ${fmt(avg(list.map((e) => e.crashes)))} · abastecimentos por conclusão: ${fmt(avg(done.map((e) => e.refuels)))} · corridas perfeitas: ${done.filter((e) => e.perfect).length}`);
  if (starts.some((e) => e.level === level && e.tank < 40) || done.some((e) => e.refuels)) {
    const noFuel = done.filter((e) => !e.refuels);
    console.log(`    concluídas sem abastecer (D-023, P-020): ${noFuel.length} · sem morrer: ${noFuel.filter((e) => !e.livesLost).length}`);
  }
  console.log(`    motivos das mortes: ${count(lvCrashes.map((e) => e.reason)).map(([k, n]) => `${k} ×${n}`).join(' · ') || '—'}`);
  // Propulsor (#91): toques, segundos aceso e o maior tempo voando solto, nas tentativas medidas
  const measured = list.filter((e) => Number.isFinite(e.presses));
  if (measured.length) {
    console.log(`    propulsor (${measured.length} tentativas medidas): toques medianos ${fmt(median(measured.map((e) => e.presses)), 0)} · aceso ${fmt(median(measured.map((e) => e.thrustS)))} s · maior voo solto ${fmt(median(measured.map((e) => e.maxCoastS)))} s · nas concluídas, aceso ${fmt(median(done.filter((e) => Number.isFinite(e.thrustS)).map((e) => e.thrustS)))} s`);
  }
  // Combustível por trecho (D-026): o propulsor gasto até cada pouso, por plataforma
  const lands = events.filter((e) => e.ev === 'land' && e.level === level);
  if (lands.length) {
    const legs = Object.entries(by(lands, 'pad')).map(([pad, ls]) => `até ${pad === 'crew' ? 'a tripulação' : pad === 'fuel' ? 'o posto' : 'a base'}: ${fmt(median(ls.map((e) => e.legThrustS)))} s (melhor ${fmt(Math.min(...ls.map((e) => e.legThrustS)))} s, ${ls.length} pousos)`);
    console.log(`    propulsor por trecho (mediano): ${legs.join(' · ')} · descida no pouso: ${fmt(median(lands.map((e) => e.vy)), 0)} (limite 65)`);
  }
  const fatal = lvCrashes.filter((e) => e.reason === 'LANDED TOO FAST' || e.reason === 'LANDED TILTED');
  if (fatal.some((e) => Number.isFinite(e.vy))) {
    const withGreen = fatal.filter((e) => typeof e.green === 'boolean');
    console.log(`    pousos fatais: descida mediana ${fmt(median(fatal.map((e) => e.vy)), 0)} · deslize ${fmt(median(fatal.map((e) => Math.abs(e.vx))), 0)} · inclinação ${fmt(median(fatal.map((e) => Math.abs(e.angle))), 0)}° · previsão verde antes da batida: ${withGreen.filter((e) => e.green).length} de ${withGreen.length}`);
  }
  const zones = count(lvCrashes.map((e) => `${Math.floor(e.x / 400) * 400}-${Math.floor(e.x / 400) * 400 + 400}`)).slice(0, 4);
  console.log(`    onde morrem (posição x): ${zones.map(([k, n]) => `${k} ×${n}`).join(' · ') || '—'}`);
  const praise = ['closeCall', 'greatSave', 'perfectLanding', 'perfectRun'].map((k) => [k, list.reduce((s, e) => s + (e[`p_${k}`] || 0), 0)]).filter(([, n]) => n);
  console.log(`    elogios: ${praise.map(([k, n]) => `${k} ×${n}`).join(' · ') || '—'} · abrir a fase: ${fmt(genMs, 0)} ms`);
}

// Performance por aparelho (junta o aparelho da sessão com as partidas dela)
const deviceOf = Object.fromEntries(sessions.map((e) => [e.sid, e.device]));
console.log('\nPERFORMANCE (quadros por segundo durante as fases; até a versão 2026-10-02b, o pior quadro era cortado em 100 ms)');
for (const [device, list] of Object.entries(by(ends.map((e) => ({ ...e, device: deviceOf[e.sid] || '?' })), 'device'))) {
  console.log(`  ${device}: ${fmt(avg(list.map((e) => e.fps)), 0)} fps em média · engasgos ${fmt(avg(list.map((e) => e.jankPct)))}% dos quadros · pior quadro ${Math.max(...list.map((e) => e.worstMs || 0))} ms`);
}

// Abertura e ranking
const intros = events.filter((e) => e.ev === 'intro');
const skipped = intros.filter((e) => e.skipped);
console.log(`\nABERTURA: ${intros.length} vistas · puladas ${pct(skipped.length, intros.length)} · em que tela pulam: ${count(skipped.map((e) => `tela ${e.scene}`)).map(([k, n]) => `${k} ×${n}`).join(' · ') || '—'}`);
console.log(`RANKING aberto ${events.filter((e) => e.ev === 'ranking_open').length} vezes · saídas do app no meio da fase: ${events.filter((e) => e.ev === 'hidden').length}`);
const demos = events.filter((e) => e.ev === 'demo');
const attract = events.filter((e) => e.ev === 'attract');
if (demos.length || attract.length) {
  console.log(`DEMO (#104): ${demos.length} vistas · puladas ${pct(demos.filter((e) => e.skipped).length, demos.length)} · segundo mediano em que pulam ${fmt(median(demos.filter((e) => e.skipped).map((e) => e.at)))} · ${count(demos.map((e) => e.source)).map(([k, n]) => `${k} ×${n}`).join(' · ')}`);
  console.log(`ATTRACT MODE (#105): começou ${attract.filter((e) => e.action === 'start').length} vezes · interrompido por um toque ${attract.filter((e) => e.action === 'stop').length} vezes`);
}
// Treinador da fase que ensina (D-038): quem jogou com ele, se concluiu, e que dicas e lições apareceram
const coached = events.filter((e) => e.ev === 'level_end' && e.coach && e.outcome !== 'menu');
const hints = events.filter((e) => e.ev === 'hint');
if (coached.length || hints.length) {
  const tips = {};
  for (const e of coached) for (const [k, n] of Object.entries(e)) if (k.startsWith('c_')) tips[k.slice(2)] = (tips[k.slice(2)] || 0) + n;
  const players = new Set(coached.map((e) => e.nick).filter(Boolean));
  const finished = new Set(coached.filter((e) => e.outcome === 'complete').map((e) => e.nick));
  console.log(`TREINADOR (D-038): ${coached.length} tentativas com ele · ${players.size} jogadores, ${finished.size} concluíram · concluídas ${pct(coached.filter((e) => e.outcome === 'complete').length, coached.length)}`);
  console.log(`  lições depois do erro: ${count(hints.map((e) => e.kind)).map(([k, n]) => `${k} ×${n}`).join(' · ') || '—'}`);
  console.log(`  dicas mostradas: ${Object.entries(tips).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ×${n}`).join(' · ') || '—'}`);
}
const patch = events.filter((e) => e.ev === 'patch_note');
if (patch.length) {
  const by = (action) => patch.filter((e) => e.action === action).length;
  console.log(`PATCH NOTE (#126): apareceu ${by('show')} vezes · fechado no SKIP ${by('skip')} · no PLAY ${by('play')} · versões: ${count(patch.map((e) => e.build)).map(([k, n]) => `${k} ×${n}`).join(' · ')}`);
}

// Ranking (sempre junto da telemetria): os tempos de cada fase, com o Fernando destacado
console.log('\nRANKING DE CADA FASE (chave · nick · tempo · controle)');
for (const [key, entries] of Object.entries(scores)) {
  if (key.startsWith('teste')) continue;
  const rows = Object.entries(entries).map(([nick, e]) => ({ nick, ...e })).filter((e) => Number.isFinite(e.time)).sort((a, b) => a.time - b.time);
  console.log(`  ${key}: ${rows.map((e, i) => `${i + 1}º ${e.nick}${e.nick === FERNANDO ? ' (Fernando)' : ''} ${fmt(e.time)} s ${e.control || ''}`.trim()).join(' · ')}`);
  const best = rows.find((e) => e.nick === FERNANDO);
  if (best) {
    const run = events.find((e) => e.ev === 'level_end' && e.outcome === 'complete' && e.nick === FERNANDO && key.startsWith(`${e.level}_`) && Math.abs(e.time - best.time) < 0.05);
    if (run) console.log(`    corrida do Fernando: ${run.refuels} abastecimento(s) · sobrou ${pct(run.fuelLeft, 1)} do tanque · ${run.livesLost} vida(s) perdida(s)${rows[0].nick === FERNANDO ? ' · É O MAIS RÁPIDO: perguntar a ele o que achou' : ''}`);
  }
}
console.log('');
