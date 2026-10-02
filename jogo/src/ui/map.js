import { mulberry32 } from '../core/rng.js';
import { WORLDS, LEVELS, CHALLENGES } from '../content/worlds.js';
import { levelState, levelProgress } from '../core/progress.js';
import { SCORING } from '../core/scoring.js';
import { modifierLabels } from '../content/modifiers.js';

// Mapa de progresso (D-015): um planeta por nível, com o estado, o melhor resultado e os resgates.
// Cresce sozinho com os níveis de content/worlds.js; o "?" indica que vêm mais. Depois dele ficam os
// desafios (CHALLENGES), sempre liberados e fora da sequência.

const GAP = 140;

export function renderMap(container, info, { save, selected, onSelect }) {
  const pos = LEVELS.map((_, i) => ({ x: 70 + i * GAP, y: i % 2 ? 62 : 112 }));
  const soon = { x: 70 + LEVELS.length * GAP, y: LEVELS.length % 2 ? 66 : 116 };
  const challengePos = CHALLENGES.map((_, i) => ({ x: soon.x + GAP * (i + 1) + 20, y: 88 }));
  const width = (challengePos.length ? challengePos[challengePos.length - 1].x : soon.x) + 70;
  let svg = `<svg viewBox="0 0 ${width} 175" role="group">`;
  const starRnd = mulberry32(7);
  for (let i = 0; i < Math.round(width / 14); i++) {
    svg += `<circle class="map-star" cx="${(starRnd() * width).toFixed(1)}" cy="${(starRnd() * 175).toFixed(1)}" r="${(0.5 + starRnd()).toFixed(2)}" opacity="${(0.2 + starRnd() * 0.6).toFixed(2)}"/>`;
  }
  svg += `<path class="map-path" d="M ${[...pos, soon].map((p) => `${p.x} ${p.y}`).join(' L ')}"/>`;
  if (WORLDS.length > 1) {
    let i = 0;
    for (const w of WORLDS) {
      svg += `<text class="world" x="${pos[i].x - 22}" y="16">${w.name}</text>`;
      i += w.levels.length;
    }
  }
  LEVELS.forEach((lv, i) => {
    const p = pos[i];
    const st = levelState(save, lv);
    const prog = levelProgress(save, lv.key);
    const label = st === 'done' ? 'completed' : st === 'open' ? 'available' : 'locked';
    svg += `<g class="node ${st}" data-level="${lv.key}" tabindex="${st === 'locked' ? -1 : 0}" role="button" aria-label="Level ${lv.number}, ${lv.name}, ${label}">`;
    if (lv.key === selected.key) svg += `<circle class="ring" cx="${p.x}" cy="${p.y}" r="31"/>`;
    svg += `<circle class="planet" cx="${p.x}" cy="${p.y}" r="22"/>`;
    svg += `<text class="num" x="${p.x}" y="${p.y + 6}">${st === 'done' ? '✓' : st === 'locked' ? '·' : lv.number}</text>`;
    svg += `<text class="label" x="${p.x}" y="${p.y + 45}">${lv.number}. ${lv.name}</text>`;
    if (st === 'done') svg += `<text class="best" x="${p.x}" y="${p.y + 59}">BEST ${SCORING.format(prog.best)} · ×${prog.rescues}</text>`;
    else if (st === 'locked') svg += `<text class="best locked-text" x="${p.x}" y="${p.y + 59}">LOCKED</text>`;
    svg += '</g>';
  });
  svg += `<g class="node soon"><circle class="planet" cx="${soon.x}" cy="${soon.y}" r="22"/><text class="num" x="${soon.x}" y="${soon.y + 6}">?</text><text class="label" x="${soon.x}" y="${soon.y + 45}">MORE SOON</text></g>`;
  CHALLENGES.forEach((lv, i) => {
    const p = challengePos[i];
    const prog = levelProgress(save, lv.key);
    const done = prog.completed;
    svg += `<g class="node challenge${done ? ' done' : ''}" data-level="${lv.key}" tabindex="0" role="button" aria-label="Challenge ${lv.name}${done ? ', completed' : ''}">`;
    if (lv.key === selected.key) svg += `<circle class="ring" cx="${p.x}" cy="${p.y}" r="31"/>`;
    svg += `<circle class="planet" cx="${p.x}" cy="${p.y}" r="22"/>`;
    svg += `<text class="num" x="${p.x}" y="${p.y + 6}">★</text>`;
    svg += `<text class="label" x="${p.x}" y="${p.y + 45}">${lv.name}</text>`;
    if (done) svg += `<text class="best" x="${p.x}" y="${p.y + 59}">BEST ${SCORING.format(prog.best)} · ×${prog.rescues}</text>`;
    else svg += `<text class="best challenge-text" x="${p.x}" y="${p.y + 59}">${lv.random ? 'RANDOM' : 'HARDEST'}</text>`;
    svg += '</g>';
  });
  svg += '</svg>';
  container.innerHTML = svg;
  container.querySelectorAll('.node[data-level]').forEach((node) => {
    const pick = () => {
      const lv = [...LEVELS, ...CHALLENGES].find((l) => l.key === node.dataset.level);
      if (levelState(save, lv) !== 'locked') onSelect(lv);
    };
    node.addEventListener('click', pick);
    node.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
  });
  const mods = modifierLabels(selected);
  const title = selected.challenge ? `CHALLENGE · ${selected.name}` : `LEVEL ${selected.number} · ${selected.name}`;
  info.textContent = `${title} — ${selected.goal}${mods.length ? ` [${mods.join(' · ')}]` : ''}`;
}
