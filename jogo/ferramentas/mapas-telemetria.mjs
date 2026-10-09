// Mapas de calor do playtest (#91, D-029): para cada fase de cenário fixo, desenha o cenário e, por cima,
// onde os jogadores morreram (por motivo), onde ganharam elogios e por onde voaram (trajetórias).
// Gera uma página HTML, fora do repositório (jogo/ferramentas/saida/, ignorada pelo Git).
// Uso, na pasta do projeto:  node jogo/ferramentas/mapas-telemetria.mjs [--desde 2026-10-04] [--incluir-local] [--nick NOME]
// Depois, abrir o arquivo: no Mac, open jogo/ferramentas/saida/mapas.html; no Windows, start "" jogo\ferramentas\saida\mapas.html

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LEADERBOARD_URL } from '../src/config/online.js';
import { LEVELS, CHALLENGES } from '../src/content/worlds.js';
import { generateLevel } from '../src/core/generator.js';
import { STEP, WORLD_H } from '../src/core/constants.js';
import { decodePath } from '../src/platform/telemetry.js';

const arg = (name, fallback) => (process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : fallback);
const since = arg('--desde', '2026-10-01');
const res = await fetch(`${LEADERBOARD_URL}/telemetry.json`);
if (!res.ok) { console.error(`Não consegui ler a telemetria (${res.status}).`); process.exit(1); }
const all = Object.entries((await res.json()) || {})
  .filter(([day]) => day >= since)
  .flatMap(([, evs]) => Object.values(evs))
  .filter((e) => e.ev !== 'test');
const localSids = new Set(all.filter((e) => e.ev === 'session' && /^(localhost|127.0.0.1)$/.test(e.host || '')).map((e) => e.sid));
const nick = arg('--nick', null)?.toUpperCase();   // só as sessões em que esse nick jogou
const nickSids = new Set(all.filter((e) => nick && e.nick === nick).map((e) => e.sid));
const events = (process.argv.includes('--incluir-local') ? all : all.filter((e) => !localSids.has(e.sid)))
  .filter((e) => !nick || nickSids.has(e.sid));

const COLORS = { 'HIT A ROCK': '#c08cff', 'TOUCHED THE GROUND': '#ff9f43', 'LANDED TOO FAST': '#ff5d5d', 'LANDED TILTED': '#ff5d9e', 'HIT THE WALL': '#ffd166', 'HIT THE CEILING': '#7cc4ff', 'OUT OF FUEL': '#e8f1ff' };
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function levelSvg(def) {
  const level = generateLevel(def, def.seed, null);
  const W = level.L, H = WORLD_H;
  const line = (arr) => arr.map((y, i) => `${i * STEP},${y.toFixed(0)}`).join(' ');
  const parts = [];
  parts.push(`<polygon points="0,0 ${line(level.ceil)} ${W},0" fill="#121a29" stroke="#46e0c8" stroke-width="3"/>`);
  parts.push(`<polygon points="0,${H} ${line(level.floor)} ${W},${H}" fill="#121a29" stroke="#46e0c8" stroke-width="3"/>`);
  for (const o of level.obstacles) if (o.pts) parts.push(`<polygon points="${o.pts.map((q) => `${q.x.toFixed(0)},${q.y.toFixed(0)}`).join(' ')}" fill="#2a2140" stroke="#c08cff" stroke-width="2"/>`);
  for (const p of level.pads) parts.push(`<rect x="${p.x1}" y="${p.y - 4}" width="${p.x2 - p.x1}" height="8" fill="${{ base: '#7cc4ff', fuel: '#ffd166', crew: '#ff9f43' }[p.kind]}"/>`);

  // Trajetórias: uma linha por tentativa (os pedaços na ordem); saltos grandes são renascimentos
  const paths = Object.values(events.filter((e) => e.ev === 'path' && e.level === def.key)
    .reduce((m, e) => ((m[`${e.sid}:${e.attempt}`] ??= []).push(e), m), {}));
  for (const chunks of paths) {
    const pts = chunks.sort((a, b) => a.i - b.i).flatMap((c) => decodePath(c.p));
    let seg = [];
    const flush = () => { if (seg.length > 1) parts.push(`<polyline points="${seg.map((q) => `${q.x},${q.y}`).join(' ')}" fill="none" stroke="#7cc4ff" stroke-opacity="0.18" stroke-width="3"/>`); seg = []; };
    for (const q of pts) { if (seg.length && Math.hypot(q.x - seg[seg.length - 1].x, q.y - seg[seg.length - 1].y) > 250) flush(); seg.push(q); }
    flush();
  }
  const crashes = events.filter((e) => e.ev === 'crash' && e.level === def.key && Number.isFinite(e.x));
  for (const c of crashes) parts.push(`<circle cx="${c.x}" cy="${c.y}" r="11" fill="${COLORS[c.reason] || '#ffffff'}" fill-opacity="0.55"><title>${esc(c.reason)}</title></circle>`);
  const praise = events.filter((e) => e.ev === 'praise' && e.level === def.key && Number.isFinite(e.x));
  for (const p of praise) parts.push(`<circle cx="${p.x}" cy="${p.y}" r="9" fill="none" stroke="#7dffb0" stroke-width="3"><title>${esc(p.kind)}</title></circle>`);

  const reasons = Object.entries(crashes.reduce((m, c) => ((m[c.reason] = (m[c.reason] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1]);
  const legend = reasons.map(([r, n]) => `<span><i style="background:${COLORS[r] || '#fff'}"></i>${esc(r)} ×${n}</span>`).join('');
  return `<section><h2>${esc(def.name)} <small>${esc(def.key)} · ${paths.length} trajetórias · ${crashes.length} mortes · ${praise.length} elogios</small></h2>
<div class="legend">${legend}<span><i class="ring"></i>elogio</span><span><i class="line"></i>trajetória</span></div>
<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMinYMin meet">${parts.join('')}</svg></section>`;
}

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mapas do playtest</title>
<style>
  body { margin: 0; padding: 16px; background: #05070d; color: #e8f1ff; font: 14px/1.4 -apple-system, system-ui, sans-serif; }
  h1 { font-size: 20px; } h2 { font-size: 16px; margin: 24px 0 6px; } small { color: #9fb0c8; font-weight: 400; }
  svg { width: 100%; height: auto; background: #0b1020; border-radius: 8px; }
  .legend { display: flex; flex-wrap: wrap; gap: 6px 14px; margin-bottom: 6px; color: #9fb0c8; font-size: 12px; }
  .legend i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; vertical-align: -1px; }
  .legend i.ring { border: 2px solid #7dffb0; width: 7px; height: 7px; }
  .legend i.line { background: #7cc4ff; border-radius: 0; height: 3px; vertical-align: 3px; }
</style></head><body>
<h1>Mapas do playtest <small>desde ${esc(since)}${nick ? ` · ${esc(nick)}` : ''} · ${events.length} eventos</small></h1>
<p><small>Bolinhas: onde morreram, pela cor do motivo. Anéis verdes: elogios. Linhas azuis: por onde voaram (as trajetórias existem a partir da versão 2026-10-04a).</small></p>
${[...LEVELS, ...CHALLENGES].filter((d) => d.seed != null).map(levelSvg).join('\n')}
</body></html>`;

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), 'saida', nick ? `mapas-${nick.toLowerCase()}.html` : 'mapas.html');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`Mapas salvos em ${path.relative(process.cwd(), out)}`);
