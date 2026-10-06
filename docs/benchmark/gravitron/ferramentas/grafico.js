// Gráfico da curva do Gravitron 2: perigos e mecanismos por fase, um painel por campanha (escalas diferentes).
// Uso: node grafico.js [pasta de saída]  (lê fases.json gerado por desenhar.js)
const fs = require('fs');
const path = require('path');
const OUT = path.resolve(process.argv[2] || path.join(__dirname, 'saida'));
const d = JSON.parse(fs.readFileSync(path.join(OUT, 'fases.json')));

const C = { surface: '#fcfcfb', t1: '#0b0b0b', t2: '#52514e', grid: '#e4e3df', s1: '#eb6834', s2: '#2a78d6' };
const W = 1200, H = 560, topo = 96, base = 470;
const ph = base - topo;
const perigos = (f) => f.torres + f.tanques + f.voadores + f.minas + f.misseis + f.lasers;
const mecanismos = (f) => f.jatos + f.blocos + f.botoes + f.giram + f.andam;

const paineis = [
  { titulo: 'Campanha principal (fases conhecidas)', x0: 64, x1: 420, max: 40, passo: 10, fases: d.gravitron2.filter((f) => f.campanha === 'principal' && f.n).map((f) => ({ r: String(f.n), f })) },
  { titulo: 'Campanha extra (OfficialPack1, v1.8)', x0: 500, x1: 1176, max: 450, passo: 100, fases: d.gravitron2.filter((f) => f.campanha === 'extra').map((f) => ({ r: String(f.n), f })) },
];

const o = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Verdana, Arial, sans-serif"><rect width="${W}" height="${H}" fill="${C.surface}"/>`];
o.push(`<text x="64" y="32" font-size="20" font-weight="bold" fill="${C.t1}">Perigos e mecanismos por fase no Gravitron 2</text>`);
o.push(`<rect x="64" y="48" width="14" height="14" rx="3" fill="${C.s1}"/><text x="84" y="60" font-size="14" fill="${C.t2}">Perigos (torres, tanques, voadores, minas, mísseis, lasers)</text>`);
o.push(`<rect x="560" y="48" width="14" height="14" rx="3" fill="${C.s2}"/><text x="580" y="60" font-size="14" fill="${C.t2}">Mecanismos (jatos, blocos, botões, partes que giram ou andam)</text>`);

for (const p of paineis) {
  const y = (v) => base - (v / p.max) * ph;
  o.push(`<text x="${p.x0}" y="${topo - 12}" font-size="14" font-weight="bold" fill="${C.t1}">${p.titulo}</text>`);
  for (let v = 0; v <= p.max; v += p.passo) o.push(`<line x1="${p.x0}" x2="${p.x1}" y1="${y(v)}" y2="${y(v)}" stroke="${C.grid}"/><text x="${p.x0 - 8}" y="${y(v) + 5}" font-size="12" fill="${C.t2}" text-anchor="end">${v}</text>`);
  const bw = (p.x1 - p.x0) / p.fases.length;
  p.fases.forEach(({ r, f }, i) => {
    const a = perigos(f), b = mecanismos(f), x = p.x0 + i * bw + bw * 0.18, w = bw * 0.64;
    if (a) o.push(`<rect x="${x}" y="${y(a)}" width="${w}" height="${y(0) - y(a)}" fill="${C.s1}"/>`);
    if (b) o.push(`<rect x="${x}" y="${y(a + b)}" width="${w}" height="${y(a) - y(a + b)}" fill="${C.s2}" stroke="${C.surface}" stroke-width="1"/>`);
    o.push(`<text x="${x + w / 2}" y="${y(a + b) - 6}" font-size="11" fill="${C.t1}" text-anchor="middle">${a + b}</text>`);
    o.push(`<text x="${x + w / 2}" y="${base + 20}" font-size="13" fill="${C.t2}" text-anchor="middle">${r}</text>`);
  });
  o.push(`<line x1="${p.x0}" x2="${p.x1}" y1="${base}" y2="${base}" stroke="${C.t2}"/>`);
}
o.push(`<text x="242" y="${base + 50}" font-size="13" fill="${C.t2}" text-anchor="middle">Fase (1 a 5 = demo; 10 = registro de atualizações)</text>`);
o.push(`<text x="838" y="${base + 50}" font-size="13" fill="${C.t2}" text-anchor="middle">Fase (ordem de OfficialPack1.rota)</text>`);
o.push(`<text x="64" y="${H - 12}" font-size="12" fill="${C.t2}">Atenção: as escalas dos dois painéis são diferentes (até 40 e até 450).</text>`);
o.push('</svg>');
fs.writeFileSync(path.join(OUT, 'curva-gravitron2.svg'), o.join('\n'));
console.log(paineis.map((p) => p.fases.map(({ r, f }) => `${r}:${perigos(f)}+${mecanismos(f)}`).join(' ')).join(' | '));
