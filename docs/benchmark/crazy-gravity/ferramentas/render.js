// Desenha mapas esquemáticos (SVG) das fases do Crazy Gravity a partir dos arquivos .CGL
// e gera um resumo em JSON. Uso: node render.js <pasta de saída>
const fs = require('fs');
const path = require('path');
const P = require('./parse.js');

const OUT = process.argv[2] || 'saida';
fs.mkdirSync(OUT, { recursive: true });

const F = 32;   // tamanho de um campo, em pixels
const U = 4;    // unidade da régua do editor (8 por campo)

const COLORS = {
  bg: '#0d1322', gray: '#6b7383', brick: '#5a6170', grid: '#1a2236',
  base: '#ffd23f', baseStripe: '#ff6fb5', fuel: '#22c55e', freight: '#ef4444',
  extra: '#3b82f6', keyPad: '#1f1f1f',
  fan: '#38bdf8', magnet: '#e879f9', current: '#4ade80', currentCcw: '#f472b6',
  cannon: '#fb923c', rod: '#facc15', oneway: '#60a5fa', locked: '#f87171', text: '#f8fafc',
};
const KEY_COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#facc15']; // vermelha, verde, azul, amarela
const KEY_NAMES = ['vermelha', 'verde', 'azul', 'amarela'];
// bits dos portões trancados: 0x10 amarela, 0x20 azul, 0x40 verde, 0x80 vermelha
const LOCK_BITS = [[0x80, 0], [0x40, 1], [0x20, 2], [0x10, 3]];
const EXTRA_NAMES = { 5: 'TURBO', 6: 'VIDA', 7: 'PORÃO' };
const DIR = ['baixo', 'cima', 'esquerda', 'direita'];

const u16 = (b, o) => b.readUInt16LE(o);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function records(buf, size) {
  const n = buf.readUInt32LE(0);
  const r = [];
  for (let i = 0; i < n; i++) r.push(buf.slice(4 + i * size, 4 + (i + 1) * size));
  return r;
}

// Ventilador, ímã e corrente de ar: registro de 38 bytes
function field38(b) {
  return {
    flags: b[0], dir: b[0] & 15, hi: b[0] >> 4,
    x: u16(b, 2), y: u16(b, 4),
    body: [u16(b, 10), u16(b, 12), u16(b, 14), u16(b, 16)],
    area: [u16(b, 30), u16(b, 32), u16(b, 34), u16(b, 36)],
  };
}
function cannon(b) {
  const v = []; for (let j = 7; j < 51; j += 2) v.push(u16(b, j));
  return { dir: b[0], rate: u16(b, 3), speed: b.readInt8(6), from: [v[0], v[1]], to: [v[2], v[3]], rect: v.slice(18, 22) };
}
function rod(b) {
  return { horizontal: b[0] === 1, gap: u16(b, 2), minSpeed: b[4], maxSpeed: b[5], rect: [u16(b, 16), u16(b, 18), u16(b, 20), u16(b, 22)] };
}
function gate(b) {
  const v = []; for (let j = 1; j < 65; j += 2) v.push(u16(b, j));
  return { flags: b[0], rect: v.slice(24, 28), act: v.slice(28, 32) };
}

function level(n) {
  const file = `LEVEL${String(n).padStart(2, '0')}.CGL`;
  const L = P.load(file);
  const { W, H, c } = L;
  const pieces = P.pieces(L).out;
  const lv = P.lvin(L);
  const pl = P.platforms(L);
  const fans = records(c.VENT, 38).map(field38);
  const magnets = records(c.MAGN, 38).map(field38);
  const currents = records(c.DIST, 38).map(field38);
  const cannons = records(c.CANO, 51).map(cannon);
  const rods = records(c.PIPE, 24).map(rod);
  const oneway = records(c.ONEW, 65).map(gate);
  const locked = records(c.BARR, 65).map(gate);
  return { n, W, H, c, pieces, lv, pl, fans, magnets, currents, cannons, rods, oneway, locked };
}

// Portões vêm em metades; as metades de um mesmo portão têm a mesma área de ativação
function groupGates(list) {
  const g = new Map();
  for (const x of list) {
    const k = x.act.join(',');
    if (!g.has(k)) g.set(k, { act: x.act, parts: [], flags: 0 });
    const e = g.get(k); e.parts.push(x.rect); e.flags |= x.flags;
  }
  return [...g.values()].map((e) => {
    const xs = e.parts.flatMap((r) => [r[0], r[0] + r[2]]);
    const ys = e.parts.flatMap((r) => [r[1], r[1] + r[3]]);
    return { ...e, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)] };
  });
}

// Grade de passagem (campo vazio = livre) e distância em campos por busca em largura
function passGrid(Lv) {
  const { W, H, c } = Lv;
  const g = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) g[i] = c.SOIN[i] === 0 ? 1 : 0;
  return g;
}
function bfs(Lv, g, sx, sy) {
  const { W, H } = Lv;
  const d = new Int32Array(W * H).fill(-1);
  const q = [];
  const start = sy * W + sx;
  if (sx < 0 || sy < 0 || sx >= W || sy >= H) return d;
  d[start] = 0; q.push(start);
  for (let h = 0; h < q.length; h++) {
    const i = q[h]; const x = i % W; const y = (i / W) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const j = ny * W + nx; if (!g[j] || d[j] >= 0) continue; d[j] = d[i] + 1; q.push(j);
    }
  }
  return d;
}
// Campo livre logo acima do centro da plataforma
function padCell(Lv, g, p) {
  const { W } = Lv;
  const cx = Math.floor((p.rect[0] + p.rect[2] / 2) / F);
  for (let cy = Math.floor(p.rect[1] / F) - 1; cy >= 0; cy--) if (g[cy * W + cx]) return [cx, cy];
  return [cx, Math.floor(p.rect[1] / F) - 1];
}

function stats(Lv) {
  const freightPads = Lv.pl.filter((p) => p.type === 4);
  const g = passGrid(Lv);
  const base = Lv.pl.find((p) => p.type === 1);
  const [bx, by] = padCell(Lv, g, base);
  const dist = bfs(Lv, g, bx, by);
  const at = (p) => { const [x, y] = padCell(Lv, g, p); return dist[y * Lv.W + x]; };
  let trips = 0, flight = 0, unreachable = 0, farthest = 0;
  for (const p of freightPads) {
    const d = at(p);
    if (d < 0) { unreachable++; continue; }
    trips += p.items.length; flight += 2 * d * p.items.length; farthest = Math.max(farthest, d);
  }
  const fuelPads = Lv.pl.filter((p) => p.type === 3);
  const keys = Lv.pl.filter((p) => p.type === 2).map((p) => p.hi);
  const extras = Lv.pl.filter((p) => p.type === 5).flatMap((p) => p.items.map((i) => EXTRA_NAMES[i.t] || `extra ${i.t}`));
  const lockedGates = groupGates(Lv.locked);
  const maxKeys = Math.max(0, ...lockedGates.map((x) => LOCK_BITS.filter(([b]) => x.flags & b).length));
  const open = Lv.c.SOIN.slice(0, Lv.W * Lv.H).filter((v) => v === 0).length;
  return {
    fase: Lv.n, senha: Lv.lv.pw || '(primeira fase)', campos: `${Lv.W}×${Lv.H}`, pixels: `${Lv.W * F}×${Lv.H * F}`,
    areaAberta: Math.round((100 * open) / (Lv.W * Lv.H)),
    cargas: freightPads.reduce((s, p) => s + p.items.length, 0), plataformasDeCarga: freightPads.length,
    postos: fuelPads.length, barris: fuelPads.reduce((s, p) => s + p.items.length, 0),
    chaves: keys.map((k) => KEY_NAMES[k]), extras,
    ventiladores: Lv.fans.length, imas: Lv.magnets.length, correntes: Lv.currents.length,
    canhoes: Lv.cannons.length, hastes: Lv.rods.length,
    portoesMaoUnica: groupGates(Lv.oneway).length, portoesTrancados: lockedGates.length, maxChavesPorPortao: maxKeys,
    viagens: trips, cargaMaisLonge: farthest, vooEstimado: flight, cargasSemCaminhoDireto: unreachable,
  };
}

function arrow(x1, y1, x2, y2, color, w, dash) {
  const a = Math.atan2(y2 - y1, x2 - x1); const s = w * 4;
  const p1 = [x2 - s * Math.cos(a - 0.45), y2 - s * Math.sin(a - 0.45)];
  const p2 = [x2 - s * Math.cos(a + 0.45), y2 - s * Math.sin(a + 0.45)];
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}"${dash ? ` stroke-dasharray="${w * 3} ${w * 2}"` : ''}/>`
    + `<polygon points="${x2},${y2} ${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}" fill="${color}"/>`;
}
const DV = [[0, 1], [0, -1], [-1, 0], [1, 0]];

function svg(Lv) {
  const { W, H } = Lv; const PW = W * F, PH = H * F;
  const fs1 = Math.max(26, Math.round(PW / 90));
  const out = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PW} ${PH}" width="${PW}" height="${PH}" font-family="Verdana, Arial, sans-serif">`);
  out.push(`<rect width="${PW}" height="${PH}" fill="${COLORS.bg}"/>`);
  // grade a cada 5 campos
  let grid = '';
  for (let x = 5; x < W; x += 5) grid += `M${x * F} 0V${PH}`;
  for (let y = 5; y < H; y += 5) grid += `M0 ${y * F}H${PW}`;
  out.push(`<path d="${grid}" stroke="${COLORS.grid}" stroke-width="2"/>`);
  // terreno
  let gray = '', brick = '';
  for (const p of Lv.pieces) {
    const [b0, b1, b2] = p.b;
    const x0 = b0 >> 4, y0 = b0 & 15; let w = b1 >> 4, h = b1 & 15;
    w = Math.min(w, 8 - x0); h = Math.min(h, 8 - y0); if (w <= 0 || h <= 0) continue;
    const seg = `M${p.fx * F + x0 * U} ${p.fy * F + y0 * U}h${w * U}v${h * U}h${-w * U}z`;
    if (b2 === 0 && w === 8 && h === 8) brick += seg; else gray += seg;
  }
  // campos marcados como cheios sem pedaços: tijolo inteiro
  for (let i = 0; i < W * H; i++) if (Lv.c.SOIN[i] === 0x80) brick += `M${(i % W) * F} ${((i / W) | 0) * F}h${F}v${F}h${-F}z`;
  out.push(`<path d="${brick}" fill="${COLORS.brick}"/>`);
  out.push(`<path d="${gray}" fill="${COLORS.gray}"/>`);

  // áreas de efeito (por baixo dos objetos)
  for (const f of Lv.fans) out.push(`<rect x="${f.area[0]}" y="${f.area[1]}" width="${f.area[2]}" height="${f.area[3]}" fill="${COLORS.fan}" fill-opacity="0.16" stroke="${COLORS.fan}" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="8 6"/>`);
  for (const m of Lv.magnets) out.push(`<rect x="${m.area[0]}" y="${m.area[1]}" width="${m.area[2]}" height="${m.area[3]}" fill="${COLORS.magnet}" fill-opacity="0.16" stroke="${COLORS.magnet}" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="8 6"/>`);
  for (const d of Lv.currents) {
    const col = d.hi ? COLORS.currentCcw : COLORS.current;
    out.push(`<rect x="${d.area[0]}" y="${d.area[1]}" width="${d.area[2]}" height="${d.area[3]}" fill="${col}" fill-opacity="0.18" stroke="${col}" stroke-opacity="0.6" stroke-width="2" stroke-dasharray="8 6"/>`);
  }
  // portões: área de ativação
  for (const gt of [...groupGates(Lv.oneway), ...groupGates(Lv.locked)]) out.push(`<rect x="${gt.act[0]}" y="${gt.act[1]}" width="${gt.act[2]}" height="${gt.act[3]}" fill="none" stroke="#cbd5e1" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="4 6"/>`);

  // ventiladores, ímãs e correntes
  const labels = [];
  for (const f of Lv.fans) {
    out.push(`<rect x="${f.body[0]}" y="${f.body[1]}" width="${f.body[2]}" height="${f.body[3]}" fill="${COLORS.fan}"/>`);
    const cx = f.area[0] + f.area[2] / 2, cy = f.area[1] + f.area[3] / 2; const [dx, dy] = DV[f.dir] || [0, 0];
    const L2 = Math.min(f.area[2], f.area[3], 120) / 2 + 30;
    out.push(arrow(cx - dx * L2, cy - dy * L2, cx + dx * L2, cy + dy * L2, COLORS.fan, 6));
  }
  for (const m of Lv.magnets) {
    out.push(`<rect x="${m.body[0]}" y="${m.body[1]}" width="${m.body[2]}" height="${m.body[3]}" fill="${COLORS.magnet}"/>`);
    const cx = m.area[0] + m.area[2] / 2, cy = m.area[1] + m.area[3] / 2; const [dx, dy] = DV[m.dir] || [0, 0];
    const L2 = Math.min(Math.max(m.area[2], m.area[3]), 160) / 2;
    out.push(arrow(cx + dx * L2, cy + dy * L2, cx - dx * L2, cy - dy * L2, COLORS.magnet, 6)); // puxa para o ímã
  }
  for (const d of Lv.currents) {
    const col = d.hi ? COLORS.currentCcw : COLORS.current;
    out.push(`<rect x="${d.body[0]}" y="${d.body[1]}" width="${d.body[2]}" height="${d.body[3]}" fill="${col}"/>`);
    const cx = d.area[0] + d.area[2] / 2, cy = d.area[1] + d.area[3] / 2;
    out.push(`<text x="${cx}" y="${cy + fs1 * 0.6}" fill="${col}" font-size="${fs1 * 1.8}" text-anchor="middle">⟳</text>`);
  }
  // canhões e trajetória do tiro
  for (const k of Lv.cannons) {
    out.push(`<rect x="${k.rect[0]}" y="${k.rect[1]}" width="${k.rect[2]}" height="${k.rect[3]}" fill="none" stroke="${COLORS.cannon}" stroke-width="2" stroke-opacity="0.5"/>`);
    out.push(arrow(k.from[0], k.from[1], k.to[0], k.to[1], COLORS.cannon, 5, true));
    out.push(`<circle cx="${k.from[0]}" cy="${k.from[1]}" r="14" fill="${COLORS.cannon}"/>`);
  }
  // hastes móveis
  for (const r of Lv.rods) {
    const [x, y, w, h] = r.rect;
    out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${COLORS.rod}" fill-opacity="0.25" stroke="${COLORS.rod}" stroke-width="3"/>`);
    if (r.horizontal) { const m = y + h / 2; out.push(`<line x1="${x}" y1="${m}" x2="${x + (w - r.gap) / 2}" y2="${m}" stroke="${COLORS.rod}" stroke-width="10"/><line x1="${x + (w + r.gap) / 2}" y1="${m}" x2="${x + w}" y2="${m}" stroke="${COLORS.rod}" stroke-width="10"/>`); }
    else { const m = x + w / 2; out.push(`<line x1="${m}" y1="${y}" x2="${m}" y2="${y + (h - r.gap) / 2}" stroke="${COLORS.rod}" stroke-width="10"/><line x1="${m}" y1="${y + (h + r.gap) / 2}" x2="${m}" y2="${y + h}" stroke="${COLORS.rod}" stroke-width="10"/>`); }
  }
  // portões de mão única: seta da área de ativação para o portão
  for (const gt of groupGates(Lv.oneway)) {
    const [x, y, w, h] = gt.box;
    out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${COLORS.oneway}" fill-opacity="0.85" stroke="#fff" stroke-width="3"/>`);
    const ax = gt.act[0] + gt.act[2] / 2, ay = gt.act[1] + gt.act[3] / 2, gx = x + w / 2, gy = y + h / 2;
    let dx = gx - ax, dy = gy - ay; if (Math.abs(dx) > Math.abs(dy)) dy = 0; else dx = 0; const len = Math.hypot(dx, dy) || 1; const s = 70;
    out.push(arrow(gx - (dx / len) * s, gy - (dy / len) * s, gx + (dx / len) * s, gy + (dy / len) * s, '#ffffff', 6));
  }
  // portões trancados, com as chaves exigidas
  for (const gt of groupGates(Lv.locked)) {
    const [x, y, w, h] = gt.box;
    out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${COLORS.locked}" fill-opacity="0.85" stroke="#fff" stroke-width="3"/>`);
    const need = LOCK_BITS.filter(([b]) => gt.flags & b).map(([, k]) => k);
    need.forEach((k, i) => out.push(`<circle cx="${x + w / 2 + (i - (need.length - 1) / 2) * 30}" cy="${y + h / 2}" r="12" fill="${KEY_COLORS[k]}" stroke="#000" stroke-width="3"/>`));
  }

  // plataformas e itens
  for (const p of Lv.pl) {
    const [x, y, w, h] = p.rect;
    const col = { 1: COLORS.base, 2: COLORS.keyPad, 3: COLORS.fuel, 4: COLORS.freight, 5: COLORS.extra }[p.type];
    out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}" stroke="#fff" stroke-width="2"/>`);
    if (p.type === 1) out.push(`<rect x="${x}" y="${y + h - 8}" width="${w}" height="8" fill="${COLORS.baseStripe}"/>`);
    let label = '';
    if (p.type === 1) {
      label = 'BASE';
      const sx = x + w / 2; out.push(`<polygon points="${sx},${y - 44} ${sx - 14},${y - 4} ${sx + 14},${y - 4}" fill="#e2e8f0"/>`);
    }
    if (p.type === 3) { label = `COMBUSTÍVEL ×${p.items.length}`; for (const it of p.items) out.push(`<rect x="${p.x + 8 + it.x}" y="${y - (it.v ? 16 : 32)}" width="14" height="16" rx="3" fill="${COLORS.fuel}" stroke="#064e3b" stroke-width="2"/>`); }
    if (p.type === 4) { label = `CARGA ×${p.items.length}`; for (const it of p.items) out.push(`<rect x="${p.x + 8 + it.x}" y="${y - (it.v ? 16 : 32)}" width="16" height="16" fill="${COLORS.freight}" stroke="#fff" stroke-width="2"/>`); }
    if (p.type === 2) { label = `CHAVE ${KEY_NAMES[p.hi].toUpperCase()}`; for (const it of p.items) out.push(`<circle cx="${Math.min(x + w - 14, Math.max(x + 14, p.x + it.x))}" cy="${y - 14}" r="11" fill="${KEY_COLORS[p.hi]}" stroke="#fff" stroke-width="3"/>`); }
    if (p.type === 5) { label = p.items.map((i) => EXTRA_NAMES[i.t] || 'EXTRA').join(' '); out.push(`<circle cx="${x + w / 2}" cy="${y - 16}" r="13" fill="${COLORS.extra}" stroke="#fff" stroke-width="3"/>`); }
    const tc = p.type === 2 ? KEY_COLORS[p.hi] : col;
    labels.push(`<text x="${x + w / 2}" y="${y + h + fs1 + 4}" fill="${tc}" font-size="${fs1}" font-weight="bold" text-anchor="middle" stroke="#000" stroke-width="5" paint-order="stroke">${esc(label)}</text>`);
  }
  out.push(...labels);
  out.push(`<text x="16" y="${fs1 * 1.6}" fill="${COLORS.text}" font-size="${fs1 * 1.4}" font-weight="bold" stroke="#000" stroke-width="6" paint-order="stroke">Fase ${Lv.n}</text>`);
  out.push('</svg>');
  return out.join('\n');
}

function legend() {
  const items = [
    ['rect', COLORS.base, 'Base: começa e termina aqui; entregar todas as cargas'],
    ['rect', COLORS.freight, 'Plataforma de carga (cada quadrado = 1 contêiner)'],
    ['rect', COLORS.fuel, 'Posto de combustível (cada barril = 1 pouso)'],
    ['key', KEY_COLORS[0], 'Plataforma de chave (cor da chave)'],
    ['rect', COLORS.extra, 'Extra: TURBO, VIDA ou PORÃO (carga a mais)'],
    ['area', COLORS.fan, 'Ventilador e área onde empurra (seta = sentido)'],
    ['area', COLORS.magnet, 'Ímã e área onde puxa (seta = para o ímã)'],
    ['area', COLORS.current, 'Corrente de ar: gira a nave (verde ou rosa = sentido)'],
    ['line', COLORS.cannon, 'Canhão e trajetória das bolas de fogo'],
    ['rod', COLORS.rod, 'Par de hastes móveis (o vão abre e fecha)'],
    ['rect', COLORS.oneway, 'Portão de mão única (seta = único sentido)'],
    ['rect', COLORS.locked, 'Portão trancado (bolinhas = chaves exigidas)'],
    ['dash', '#cbd5e1', 'Área onde a nave abre o portão'],
    ['rect', COLORS.gray, 'Rocha (pedras cinzas)'],
    ['rect', COLORS.brick, 'Rocha (tijolos)'],
  ];
  const lh = 34, w = 760, h = items.length * lh + 20;
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Verdana, Arial, sans-serif"><rect width="${w}" height="${h}" fill="${COLORS.bg}" rx="10"/>`];
  items.forEach(([k, c, t], i) => {
    const y = 14 + i * lh;
    if (k === 'rect') o.push(`<rect x="16" y="${y + 4}" width="44" height="18" fill="${c}" stroke="#fff" stroke-width="1.5"/>`);
    if (k === 'key') o.push(`<rect x="16" y="${y + 4}" width="44" height="18" fill="${COLORS.keyPad}" stroke="#fff" stroke-width="1.5"/><circle cx="38" cy="${y}" r="7" fill="${c}"/>`);
    if (k === 'area') o.push(`<rect x="16" y="${y}" width="44" height="26" fill="${c}" fill-opacity="0.2" stroke="${c}" stroke-dasharray="5 4"/><rect x="16" y="${y}" width="8" height="26" fill="${c}"/>`);
    if (k === 'line') o.push(`<circle cx="22" cy="${y + 13}" r="7" fill="${c}"/><line x1="30" y1="${y + 13}" x2="60" y2="${y + 13}" stroke="${c}" stroke-width="4" stroke-dasharray="7 5"/>`);
    if (k === 'rod') o.push(`<rect x="16" y="${y + 2}" width="44" height="22" fill="${c}" fill-opacity="0.25" stroke="${c}"/><line x1="16" y1="${y + 13}" x2="32" y2="${y + 13}" stroke="${c}" stroke-width="6"/><line x1="44" y1="${y + 13}" x2="60" y2="${y + 13}" stroke="${c}" stroke-width="6"/>`);
    if (k === 'dash') o.push(`<rect x="16" y="${y + 2}" width="44" height="22" fill="none" stroke="${c}" stroke-dasharray="4 4"/>`);
    o.push(`<text x="76" y="${y + 19}" fill="${COLORS.text}" font-size="17">${esc(t)}</text>`);
  });
  o.push('</svg>');
  return o.join('\n');
}

const all = [];
for (let n = 1; n <= 18; n++) {
  const Lv = level(n);
  fs.writeFileSync(path.join(OUT, `fase-${String(n).padStart(2, '0')}.svg`), svg(Lv));
  all.push(stats(Lv));
  all[all.length - 1].detalhes = {
    canhoes: Lv.cannons.map((k) => ({ cadencia: k.rate, velocidade: Math.abs(k.speed) })),
    hastes: Lv.rods.map((r) => ({ vao: r.gap, horizontal: r.horizontal })),
    ventiladores: Lv.fans.map((f) => DIR[f.dir]), imas: Lv.magnets.map((m) => DIR[m.dir]),
  };
}
fs.writeFileSync(path.join(OUT, 'legenda.svg'), legend());
fs.writeFileSync(path.join(OUT, 'fases.json'), JSON.stringify(all, null, 1));
console.log(all.map((s) => [s.fase, s.senha, s.campos, s.areaAberta + '%', 'cargas', s.cargas, 'postos', s.postos, 'barris', s.barris, 'chaves', s.chaves.length, 'V', s.ventiladores, 'M', s.imas, 'D', s.correntes, 'C', s.canhoes, 'H', s.hastes, 'P1', s.portoesMaoUnica, 'PT', s.portoesTrancados, 'maxK', s.maxChavesPorPortao, 'extras', s.extras.join('/'), 'voo', s.vooEstimado, 'longe', s.cargaMaisLonge, 'sem', s.cargasSemCaminhoDireto].join(' ')).join('\n'));
