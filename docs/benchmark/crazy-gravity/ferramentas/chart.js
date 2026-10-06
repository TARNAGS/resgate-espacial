// Gráfico de barras empilhadas: obstáculos e portões por fase (PNG para o documento)
const fs = require('fs');
const d = JSON.parse(fs.readFileSync((process.argv[2] || 'saida') + '/fases.json'));
const W = 1200, H = 520, m = { l: 64, r: 24, t: 70, b: 64 };
const pw = W - m.l - m.r, ph = H - m.t - m.b;
const rows = d.map((x) => ({ f: x.fase, o: x.ventiladores + x.imas + x.correntes + x.canhoes + x.hastes, p: x.portoesMaoUnica + x.portoesTrancados }));
const max = 55; const bw = pw / rows.length; const y = (v) => m.t + ph - (v / max) * ph;
const C = { surface: '#fcfcfb', t1: '#0b0b0b', t2: '#52514e', grid: '#e4e3df', s1: '#2a78d6', s2: '#eb6834' };
const o = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Verdana, Arial, sans-serif"><rect width="${W}" height="${H}" fill="${C.surface}"/>`];
o.push(`<text x="${m.l}" y="30" font-size="20" font-weight="bold" fill="${C.t1}">Elementos por fase no Crazy Gravity</text>`);
o.push(`<rect x="${m.l}" y="44" width="14" height="14" rx="3" fill="${C.s1}"/><text x="${m.l + 20}" y="56" font-size="14" fill="${C.t2}">Obstáculos (ventiladores, ímãs, correntes, canhões, hastes)</text>`);
o.push(`<rect x="${m.l + 470}" y="44" width="14" height="14" rx="3" fill="${C.s2}"/><text x="${m.l + 490}" y="56" font-size="14" fill="${C.t2}">Portões (mão única e trancados)</text>`);
for (let v = 0; v <= 50; v += 10) { o.push(`<line x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}" stroke="${C.grid}"/><text x="${m.l - 10}" y="${y(v) + 5}" font-size="13" fill="${C.t2}" text-anchor="end">${v}</text>`); }
rows.forEach((r, i) => {
  const x = m.l + i * bw + bw * 0.18, w = bw * 0.64;
  if (r.o) o.push(`<rect x="${x}" y="${y(r.o)}" width="${w}" height="${y(0) - y(r.o)}" fill="${C.s1}"/>`);
  if (r.p) o.push(`<path d="M${x} ${y(r.o) - 2}V${y(r.o + r.p) + 4}q0 -4 4 -4h${w - 8}q4 0 4 4V${y(r.o) - 2}z" fill="${C.s2}"/>`);
  o.push(`<text x="${x + w / 2}" y="${y(0) + 22}" font-size="14" fill="${C.t2}" text-anchor="middle">${r.f}</text>`);
  if ([3, 6, 8, 14, 18].includes(r.f)) o.push(`<text x="${x + w / 2}" y="${y(r.o + r.p) - 10}" font-size="14" font-weight="bold" fill="${C.t1}" text-anchor="middle">${r.o + r.p}</text>`);
});
o.push(`<line x1="${m.l}" x2="${W - m.r}" y1="${y(0)}" y2="${y(0)}" stroke="${C.t2}"/>`);
o.push(`<text x="${m.l + pw / 2}" y="${H - 14}" font-size="14" fill="${C.t2}" text-anchor="middle">Fase (1 a 3 = as fases da versão shareware)</text>`);
o.push('</svg>');
fs.writeFileSync((process.argv[2] || 'saida') + '/curva.svg', o.join('\n'));
fs.writeFileSync((process.argv[2] || 'saida') + '/curva.html', '<!doctype html><html><body style="margin:0"><img src="curva.svg" style="width:1200px;display:block"></body></html>');
console.log(rows.map((r) => r.f + ':' + r.o + '+' + r.p).join(' '));
