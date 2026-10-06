// Desenha cada fase do GraviTron e do Gravitron 2 como mapa esquemático (SVG), a legenda,
// e grava os números de todas as fases em fases.json. Uso: node desenhar.js [pasta de saída]
const fs = require('fs');
const path = require('path');
const G1 = require('./ler-gravitron1.js');
const G2 = require('./ler-gravitron2.js');

const OUT = path.resolve(process.argv[2] || path.join(__dirname, 'saida'));
fs.mkdirSync(OUT, { recursive: true });

const COR = {
  fundo: '#0d1322', terreno: '#8b93a3', texto: '#f8fafc', textoFraco: '#94a3b8', espaco: '#334155',
  reator: '#ef4444', tripulante: '#facc15', combustivel: '#22c55e', torre: '#fb923c', noAr: '#e879f9',
  laser: '#f472b6', jato: '#38bdf8', mecanismo: '#60a5fa', checkpoint: '#f8fafc', bloco: '#5a6170',
  arvore: '#475569', outro: '#cbd5e1',
};

// Ordem das fases. Gravitron 2: as 5 primeiras da campanha principal vêm da demo (Standard.rota),
// a 10 vem do registro de atualizações (v1.8: "Fixed broken stage 10 Ebanayo"); Alece e Vesea são da
// campanha principal, em posição desconhecida. A campanha extra segue OfficialPack1.rota.
const G2_FASES = [
  { nome: 'Ediruma 5', campanha: 'principal', n: 1 }, { nome: 'Goruwabi', campanha: 'principal', n: 2 },
  { nome: 'Wojunew', campanha: 'principal', n: 3 }, { nome: 'Quintus', campanha: 'principal', n: 4 },
  { nome: 'Kyaomh', campanha: 'principal', n: 5 }, { nome: 'Ebayano', campanha: 'principal', n: 10 },
  { nome: 'Alece', campanha: 'principal', n: null }, { nome: 'Vesea', campanha: 'principal', n: null },
  ...['Vlea-Ealiu', 'Inui', 'Uworu', 'Eizyia', 'Sewari', 'Aomaic II', 'Tethia', 'Asylum', 'Tuvip', 'Ura 4', 'Gohine', 'Zebes', 'Garajida', 'Suon X']
    .map((nome, i) => ({ nome, campanha: 'extra', n: i + 1 })),
  { nome: 'Instruction', campanha: 'instruções', n: null },
];

// Categorias de função. Gravitron 2: tipos do código (ED_Entity.h). GraviTron: deduzidos pela posição (README).
const CAT_G2 = {
  0: 'torre', 1: 'torre', 24: 'torre', 2: 'tanque', 3: 'combustivel', 4: 'tripulante', 5: 'reator', 6: 'botao', 7: 'laser',
  8: 'arvore', 9: 'arvore', 10: 'arvore', 11: 'arvore', 12: 'arvore', 13: 'arvore', 14: 'checkpoint', 15: 'jato', 16: 'bloco',
  17: 'mina', 18: 'missil', 19: 'voador', 20: 'voador', 21: 'voador', 22: 'voador', 23: 'voador',
};
const CAT_G1 = {
  0: 'torre', 7: 'torre', 8: 'torre', 1: 'laser', 2: 'botao', 4: 'combustivel', 5: 'tripulante', 6: 'reator', 12: 'arvore',
  3: 'voador', 9: 'voador', 13: 'voador', 14: 'voador', 15: 'outro', 16: 'outro', 17: 'outro', 20: 'outro',
  10: 'gira', 11: 'gatilho', 18: 'anda', 19: 'alvo', 21: 'mp', 22: 'mp', 23: 'mp', 24: 'mp', 25: 'mp', 26: 'mp',
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const rad = (g) => (g * Math.PI) / 180;
// Direção para onde o objeto "olha": rotação 0 = para cima (o y cresce para baixo)
const frente = (rot) => [Math.cos(rad(rot - 90)), Math.sin(rad(rot - 90))];

// Raio até a primeira parede, para desenhar lasers e campos de força
function raio(m, x, y, d, max = 3000) {
  let melhor = max;
  for (const l of m.linhas) {
    const [x1, y1] = l.s, [x2, y2] = l.e;
    const ex = x2 - x1, ey = y2 - y1, den = d[0] * ey - d[1] * ex;
    if (Math.abs(den) < 1e-9) continue;
    const t = ((x1 - x) * ey - (y1 - y) * ex) / den;
    const u = ((x1 - x) * d[1] - (y1 - y) * d[0]) / den;
    if (t > 6 && u >= 0 && u <= 1 && t < melhor) melhor = t;
  }
  return melhor;
}

function limites(m) {
  const xs = m.linhas.flatMap((l) => [l.s[0], l.e[0]]), ys = m.linhas.flatMap((l) => [l.s[1], l.e[1]]);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
}

function contar(m) {
  const cat = m.jogo === 2 ? CAT_G2 : CAT_G1;
  const c = {};
  for (const e of m.objetos) { const k = cat[e.t] || 'outro'; c[k] = (c[k] || 0) + 1; }
  if (m.jogo === 2) { c.gira = m.giram.length; c.anda = m.andam.length; c.gatilho = m.gatilhos.length; }
  return c;
}

function medir(m) {
  const L = limites(m), c = contar(m);
  const cat = m.jogo === 2 ? CAT_G2 : CAT_G1;
  const reatores = m.objetos.filter((e) => cat[e.t] === 'reator');
  const prof = reatores.length ? Math.max(...reatores.map((e) => e.y)) - L.y0 : 0;
  const perigo = (c.torre || 0) + (c.tanque || 0) + (c.voador || 0) + (c.mina || 0) + (c.missil || 0) + (c.laser || 0);
  return {
    largura: Math.round(L.x1 - L.x0), altura: Math.round(L.y1 - L.y0), linhas: m.linhas.length,
    reatores: c.reator || 0, tripulantes: c.tripulante || 0, combustivel: c.combustivel || 0, checkpoints: c.checkpoint || 0,
    torres: c.torre || 0, tanques: c.tanque || 0, voadores: c.voador || 0, minas: c.mina || 0, misseis: c.missil || 0,
    lasers: c.laser || 0, jatos: c.jato || 0, blocos: c.bloco || 0, botoes: c.botao || 0, giram: c.gira || 0, andam: c.anda || 0,
    gatilhos: c.gatilho || 0, arvores: c.arvore || 0, outros: c.outro || 0, perigos: perigo,
    profundidade: Math.round(prof),
  };
}

// Símbolos, em unidades da fase (k = unidades por pixel da imagem)
function simbolo(m, e, cat, k) {
  const s = (px) => px * k, [fx, fy] = frente(e.rot), x = e.x, y = e.y;
  const tri = (cor, r) => {
    const px = -fy, py = fx;
    return `<polygon points="${x + fx * s(r)},${y + fy * s(r)} ${x - fx * s(r * 0.4) + px * s(r * 0.8)},${y - fy * s(r * 0.4) + py * s(r * 0.8)} ${x - fx * s(r * 0.4) - px * s(r * 0.8)},${y - fy * s(r * 0.4) - py * s(r * 0.8)}" fill="${cor}"/>`;
  };
  switch (cat) {
    case 'reator': return `<rect x="${x - s(8)}" y="${y - s(8)}" width="${s(16)}" height="${s(16)}" fill="${COR.reator}"/><path d="M${x - s(5)} ${y - s(5)}L${x + s(5)} ${y + s(5)}M${x + s(5)} ${y - s(5)}L${x - s(5)} ${y + s(5)}" stroke="${COR.fundo}" stroke-width="${s(2.5)}"/>`;
    case 'tripulante': return `<circle cx="${x}" cy="${y - s(4)}" r="${s(4.5)}" fill="${COR.tripulante}"/>`;
    case 'combustivel': return `<polygon points="${x},${y - s(8)} ${x + s(6)},${y} ${x},${y + s(8)} ${x - s(6)},${y}" fill="${COR.combustivel}"/>`;
    case 'torre': return tri(COR.torre, 7);
    case 'tanque': return `<rect x="${x - s(7)}" y="${y - s(5)}" width="${s(14)}" height="${s(8)}" rx="${s(2)}" fill="${COR.torre}"/>`;
    case 'voador': return `<circle cx="${x}" cy="${y}" r="${s(5)}" fill="none" stroke="${COR.noAr}" stroke-width="${s(2.2)}"/>`;
    case 'mina': return `<path d="M${x - s(5)} ${y - s(5)}L${x + s(5)} ${y + s(5)}M${x + s(5)} ${y - s(5)}L${x - s(5)} ${y + s(5)}" stroke="${COR.noAr}" stroke-width="${s(2.2)}"/>`;
    case 'missil': return tri(COR.noAr, 7);
    case 'laser': {
      const d = raio(m, x, y, [fx, fy], m.jogo === 1 ? 600 : 3000);
      return `<line x1="${x}" y1="${y}" x2="${x + fx * d}" y2="${y + fy * d}" stroke="${COR.laser}" stroke-width="${s(2)}" stroke-dasharray="${s(6)} ${s(4)}"/><rect x="${x - s(4)}" y="${y - s(4)}" width="${s(8)}" height="${s(8)}" fill="${COR.laser}"/>`;
    }
    case 'jato': {
      const d = 100;
      return `<line x1="${x}" y1="${y}" x2="${x + fx * d}" y2="${y + fy * d}" stroke="${COR.jato}" stroke-width="${s(3)}"/>${tri(COR.jato, 6).replace(/points="([^"]+)"/, (_, p) => `points="${p.split(' ').map((q) => q.split(',').map(Number)).map(([a, b2]) => `${a + fx * d},${b2 + fy * d}`).join(' ')}"`)}`;
    }
    case 'botao': return `<circle cx="${x}" cy="${y}" r="${s(4.5)}" fill="${COR.mecanismo}"/>`;
    case 'checkpoint': return `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - s(14)}" stroke="${COR.checkpoint}" stroke-width="${s(1.6)}"/><polygon points="${x},${y - s(14)} ${x + s(9)},${y - s(10.5)} ${x},${y - s(7)}" fill="${COR.checkpoint}"/>`;
    case 'bloco': return `<rect x="${x - e.w}" y="${y - e.h}" width="${2 * e.w}" height="${2 * e.h}" fill="${COR.bloco}" stroke="${COR.terreno}" stroke-width="${s(1)}"/>`;
    case 'arvore': return `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - s(9)}" stroke="${COR.arvore}" stroke-width="${s(2)}"/>`;
    case 'gira': return `<circle cx="${x}" cy="${y}" r="${e.raio || s(30)}" fill="none" stroke="${COR.mecanismo}" stroke-width="${s(1.6)}" stroke-dasharray="${s(5)} ${s(4)}"/><circle cx="${x}" cy="${y}" r="${s(2.5)}" fill="${COR.mecanismo}"/>`;
    case 'anda': return `<rect x="${x - s(10)}" y="${y - s(4)}" width="${s(20)}" height="${s(8)}" fill="none" stroke="${COR.mecanismo}" stroke-width="${s(1.6)}" stroke-dasharray="${s(4)} ${s(3)}"/>`;
    case 'gatilho': case 'alvo': case 'mp': return '';
    default: return `<rect x="${x - s(3.5)}" y="${y - s(3.5)}" width="${s(7)}" height="${s(7)}" fill="${COR.outro}"/>`;
  }
}

function svg(m, titulo) {
  const L = limites(m), pad = 60;
  // No Gravitron 2, o jogo põe 1000 unidades de espaço acima do ponto mais alto do terreno (SectorGrid.cpp):
  // a nave nasce 600 acima dele, na borda esquerda, e a fase termina a cerca de 990 acima. O quadro mostra só uma faixa.
  const x0 = L.x0 - pad, y0 = L.y0 - pad - (m.jogo === 2 ? 110 : 40);
  const w = L.x1 - x0 + pad, h = L.y1 - y0 + pad;
  const larg = Math.round(Math.min(1800, Math.max(900, w * 0.5))), k = w / larg;
  const cat = m.jogo === 2 ? CAT_G2 : CAT_G1;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} ${w} ${h}" width="${larg}" height="${Math.round(h / k)}">`;
  s += `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${COR.fundo}"/>`;
  if (m.jogo === 2) {
    const yt = L.y0 - 70;
    s += `<polygon points="${L.x0},${yt - k * 9} ${L.x0 + k * 7},${yt + k * 7} ${L.x0 - k * 7},${yt + k * 7}" fill="none" stroke="${COR.texto}" stroke-width="${k * 2}"/>`;
    s += `<text x="${L.x0 + k * 14}" y="${yt + k * 5}" fill="${COR.textoFraco}" font-family="Arial" font-size="${k * 13}">início: a nave desce do espaço (600 acima) · fim: subir uns 990 acima, sem reatores</text>`;
  }
  // Andam (Gravitron 2): caixa na posição inicial e trilha até o destino
  if (m.jogo === 2) {
    for (const a of m.andam) {
      const fim = m.alvos.find((t) => t.nome === a.fim), ini = m.alvos.find((t) => t.nome === a.inicio);
      if (ini && fim) s += `<line x1="${ini.x}" y1="${ini.y}" x2="${fim.x}" y2="${fim.y}" stroke="${COR.mecanismo}" stroke-width="${k * 1.4}" stroke-dasharray="${k * 3} ${k * 4}"/>`;
      s += `<rect x="${a.x - a.w}" y="${a.y - a.h}" width="${2 * a.w}" height="${2 * a.h}" fill="none" stroke="${COR.mecanismo}" stroke-width="${k * 1.8}" stroke-dasharray="${k * 6} ${k * 4}"/>`;
    }
    for (const g of m.giram) s += simbolo(m, { ...g, rot: 0 }, 'gira', k);
  }
  for (const l of m.linhas) s += `<line x1="${l.s[0]}" y1="${l.s[1]}" x2="${l.e[0]}" y2="${l.e[1]}" stroke="${COR.terreno}" stroke-width="${k * 2}" stroke-linecap="round"/>`;
  const ordem = ['arvore', 'bloco', 'laser', 'jato', 'gira', 'anda', 'outro', 'botao', 'checkpoint', 'torre', 'tanque', 'voador', 'mina', 'missil', 'combustivel', 'tripulante', 'reator'];
  for (const c of ordem) for (const e of m.objetos) if ((cat[e.t] || 'outro') === c) s += simbolo(m, e, c, k);
  s +=`<text x="${x0 + k * 14}" y="${y0 + k * 26}" fill="${COR.texto}" font-family="Arial" font-size="${k * 20}" font-weight="bold">${esc(titulo)}</text>`;
  s += `<text x="${x0 + k * 14}" y="${y0 + h - k * 12}" fill="${COR.textoFraco}" font-family="Arial" font-size="${k * 12}">Mapa esquemático redesenhado a partir dos dados da fase. ${m.jogo === 2 ? 'Gravitron 2' : 'GraviTron'} © Dark Castle Software.</text>`;
  return s + '</svg>';
}

function legenda() {
  const itens = [
    ['reator', 'Reator: destruir todos para abrir a fuga'], ['tripulante', 'Tripulante (cientista ou space-man): resgate opcional'],
    ['combustivel', 'Combustível'], ['torre', 'Torre ou inimigo preso ao chão (aponta para onde atira)'],
    ['tanque', 'Tanque que anda pelo chão'], ['voador', 'Inimigo que voa ou objeto solto no ar'], ['mina', 'Mina'],
    ['missil', 'Míssil (dispara quando a nave passa perto)'], ['laser', 'Laser ou campo de força: mata na hora'],
    ['jato', 'Jato que empurra a nave'], ['botao', 'Botão: liga ou desliga laser, jato ou plataforma'],
    ['gira', 'Pedaço do terreno que gira'], ['anda', 'Plataforma que anda (tracejado: trilha)'], ['checkpoint', 'Checkpoint'],
    ['bloco', 'Blocos que se destroem a tiro'], ['arvore', 'Árvore (decoração, vale pontos)'], ['outro', 'GraviTron: objeto no chão não identificado'],
  ];
  const k = 1, lh = 34, W = 640, H = 30 + itens.length * lh;
  const m = { jogo: 2, linhas: [] };
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="${COR.fundo}"/>`;
  itens.forEach(([c, t], i) => {
    const y = 30 + i * lh;
    const e = c === 'bloco' ? { x: 30, y, rot: 0, w: 12, h: 8 } : c === 'gira' ? { x: 30, y, rot: 0, raio: 12 } : { x: 30, y: c === 'tripulante' ? y + 4 : c === 'checkpoint' ? y + 7 : y, rot: 0 };
    s += c === 'laser' ? `<line x1="22" y1="${y}" x2="52" y2="${y}" stroke="${COR.laser}" stroke-width="2" stroke-dasharray="6 4"/><rect x="18" y="${y - 4}" width="8" height="8" fill="${COR.laser}"/>`
      : c === 'jato' ? `<line x1="18" y1="${y}" x2="44" y2="${y}" stroke="${COR.jato}" stroke-width="3"/><polygon points="52,${y} 42,${y - 5} 42,${y + 5}" fill="${COR.jato}"/>`
        : simbolo(m, e, c, k);
    s += `<text x="66" y="${y + 5}" fill="${COR.texto}" font-family="Arial" font-size="15">${esc(t)}</text>`;
  });
  return s + '</svg>';
}

// ---- execução ----
const dados = { geradoEm: new Date().toISOString().slice(0, 10), gravitron2: [], gravitron1: [] };

for (const f of G2_FASES) {
  const m = G2.ler(f.nome);
  const slug = 'g2-' + (f.campanha === 'principal' ? 'principal-' + (f.n ? String(f.n).padStart(2, '0') + '-' : '') : f.campanha === 'extra' ? 'extra-' + String(f.n).padStart(2, '0') + '-' : '') + f.nome.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const titulo = f.campanha === 'instruções' ? 'Gravitron 2 · fase de instruções' : `Gravitron 2 · campanha ${f.campanha}, fase ${f.n || '?'} — ${f.nome}`;
  fs.writeFileSync(path.join(OUT, slug + '.svg'), svg(m, titulo));
  const tipos = {}; m.objetos.forEach((e) => { tipos[e.t] = (tipos[e.t] || 0) + 1; });
  dados.gravitron2.push({ ...f, arquivo: slug, ...medir(m), tiposBrutos: tipos });
}

const g1Arquivos = fs.readdirSync(G1.DIR).filter((a) => a.endsWith('.map') && a !== 'TEST.map');
const g1 = g1Arquivos.map((a) => ({ a, m: G1.ler(a) }));
const mp = new Set(['DEADZONE.map', 'ICECAVES.map', 'VAULT.map']); // rodízio do modo deathmatch (DM_Rosta.txt)
const campanha = g1.filter((x) => !mp.has(x.a)).map((x) => ({ ...x, med: medir(x.m) }));
// Ordem: EASY1 e EASY2 primeiro (pelas senhas); as outras pela quantidade de objetos (a ordem original não está nos arquivos)
const peso = (x) => (x.m.senha === 'EASY1' ? -2 : x.m.senha === 'EASY2' ? -1 : x.m.objetos.length);
campanha.sort((a, b) => peso(a) - peso(b));
campanha.forEach((x, i) => {
  const slug = 'g1-' + String(i + 1).padStart(2, '0') + '-' + x.m.nome.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  fs.writeFileSync(path.join(OUT, slug + '.svg'), svg(x.m, `GraviTron · ${x.m.nome} (senha ${x.m.senha})`));
  const tipos = {}; x.m.objetos.forEach((e) => { tipos[e.t] = (tipos[e.t] || 0) + 1; });
  dados.gravitron1.push({ ordem: i + 1, nome: x.m.nome, senha: x.m.senha, numero: x.m.numero, arquivo: slug, ...x.med, tiposBrutos: tipos });
});
dados.gravitron1Multijogador = g1.filter((x) => mp.has(x.a)).map((x) => ({ nome: x.m.nome, ...medir(x.m) }));

fs.writeFileSync(path.join(OUT, 'legenda.svg'), legenda());
fs.writeFileSync(path.join(OUT, 'fases.json'), JSON.stringify(dados, null, 2));
console.log(`Gravitron 2: ${dados.gravitron2.length} fases; GraviTron: ${dados.gravitron1.length} fases da campanha e ${dados.gravitron1Multijogador.length} de multijogador. Saída em ${OUT}`);
