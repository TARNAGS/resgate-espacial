// Diagramas do benchmark do Temple Run: a pista (esquema visto de cima), a perseguição (dois tipos de erro)
// e a linha do tempo do produto. Conceitos redesenhados a partir das falas dos criadores e da Temple Run Wiki.
// Uso: node diagramas.js [pasta de saída]  → SVG claros, para virar PNG. A página de leitura importa as mesmas funções com cores do tema.
const fs = require('fs');
const path = require('path');

const CLARO = { fundo: '#fcfcfb', tinta: '#111827', suave: '#4e5a6e', linha: '#d5dbe5', serie: '#2a6fd0', destaque: '#d9581f', painel: '#f2f4f8', fonte: 'Verdana, Arial, sans-serif' };
const TEMA = { fundo: 'var(--surface)', tinta: 'var(--fg)', suave: 'var(--muted)', linha: 'var(--line)', serie: 'var(--serie)', destaque: 'var(--destaque)', painel: 'var(--bg)', fonte: 'var(--body)' };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const txt = (P, x, y, t, o = {}) => `<text x="${x}" y="${y}" fill="${o.cor || P.tinta}" font-family="${P.fonte}" font-size="${o.tam || 13}"${o.peso ? ` font-weight="${o.peso}"` : ''}${o.ancora ? ` text-anchor="${o.ancora}"` : ''}>${esc(t)}</text>`;

// 1. A pista vista de cima: trilho com curvas de 90°, e o gesto que cada trecho pede
function pista(P) {
  const W = 960, H = 440;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Esquema da pista vista de cima: um caminho com curvas de 90 graus e um cruzamento em T, com o gesto que cada trecho pede"><rect width="${W}" height="${H}" fill="${P.fundo}"/>`;
  s += txt(P, 40, 30, 'A pista, vista de cima (esquema)', { peso: 'bold', tam: 15 }) + txt(P, 40, 50, 'um caminho só, sempre em frente, com curvas de 90°; cada trecho pede um gesto', { cor: P.suave, tam: 12 });
  const w = 34; // largura do caminho
  const caminho = [[60, 300], [380, 300], [380, 120], [700, 120], [700, 300], [900, 300]];
  const d = 'M' + caminho.map((p) => p.join(' ')).join(' L');
  s += `<path d="${d}" fill="none" stroke="${P.linha}" stroke-width="${w}" stroke-linejoin="miter"/>`;
  s += `<path d="${d}" fill="none" stroke="${P.painel}" stroke-width="${w - 6}" stroke-linejoin="miter"/>`;
  // ramo do T que termina em queda
  s += `<path d="M380 120 L380 80" stroke="${P.linha}" stroke-width="${w}"/><path d="M380 120 L380 82" stroke="${P.painel}" stroke-width="${w - 6}"/>`;
  s += `<path d="M700 120 L760 120" stroke="${P.linha}" stroke-width="${w}"/><path d="M700 120 L758 120" stroke="${P.painel}" stroke-width="${w - 6}"/>`;
  const marca = (x, y, cor, rot, nota, dx = 0, dy = -26, anc = 'middle') => {
    s += `<circle cx="${x}" cy="${y}" r="7" fill="${cor}"/>` + txt(P, x + dx, y + dy, rot, { peso: 'bold', tam: 12, ancora: anc }) + txt(P, x + dx, y + dy + 15, nota, { cor: P.suave, tam: 11, ancora: anc });
  };
  // início e perseguidores
  s += txt(P, 60, 345, '▶ início: o ídolo é roubado e os perseguidores saem atrás', { tam: 12 });
  marca(150, 300, P.serie, '↑ pular', 'raiz: tropeço');
  marca(290, 300, P.destaque, '↓ deslizar', 'arco: morte');
  marca(380, 300, P.serie, '← → virar', 'curva de 90°', 46, 10, 'start');
  for (let x = 440; x <= 540; x += 20) s += `<circle cx="${x}" cy="${111}" r="3.5" fill="${P.serie}" fill-opacity="0.7"/>`;
  s += txt(P, 495, 96, 'inclinar: moedas de lado', { cor: P.suave, tam: 11, ancora: 'middle' });
  marca(600, 120, P.destaque, '↑ pular', 'buraco ou água: morte', 0, 32);
  marca(700, 120, P.serie, 'cruzamento em T', 'escolher um lado', -6, -26, 'end');
  marca(800, 300, P.destaque, '↑ ou ↓', 'fogo: o gesto certo', 0, 32);
  s += txt(P, 40, H - 36, 'Azul: erro pequeno ou escolha (tropeçar deixa os perseguidores mais perto). Laranja: erro grande (a corrida acaba).', { tam: 12 });
  s += txt(P, 40, H - 12, 'Esquema, sem escala. A partir do protótipo descrito por Keith Shepherd (GDC 2014) e da Temple Run Wiki.', { cor: P.suave, tam: 11 });
  return s + '</svg>';
}

// 2. A perseguição: dois tipos de erro
function perseguicao(P) {
  const W = 960, H = 330, x0 = 70, x1 = 920, y0 = 70, y1 = 250;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Distância entre o explorador e os perseguidores ao longo da corrida: um tropeço os aproxima, um segundo tropeço logo depois encerra a corrida"><rect width="${W}" height="${H}" fill="${P.fundo}"/>`;
  s += txt(P, 40, 30, 'A perseguição: o tropeço é um aviso, o segundo é o fim', { peso: 'bold', tam: 15 }) + txt(P, 40, 50, 'distância entre o explorador e os perseguidores ao longo da corrida (conceitual)', { cor: P.suave, tam: 12 });
  s += `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" stroke="${P.suave}" stroke-width="1.5"/><line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}" stroke="${P.suave}" stroke-width="1.5"/>`;
  s += `<text x="${x0 - 14}" y="${(y0 + y1) / 2}" fill="${P.suave}" font-family="${P.fonte}" font-size="12" text-anchor="middle" transform="rotate(-90 ${x0 - 14} ${(y0 + y1) / 2})">folga</text>`;
  s += txt(P, x1, y1 + 20, 'tempo da corrida →', { cor: P.suave, tam: 12, ancora: 'end' });
  s += `<line x1="${x0}" y1="${y1 - 26}" x2="${x1}" y2="${y1 - 26}" stroke="${P.destaque}" stroke-width="1" stroke-dasharray="4 4"/>` + txt(P, x1, y1 - 32, 'perto: aparecem na tela', { cor: P.suave, tam: 11, ancora: 'end' });
  const d = `M${x0} ${y1 - 30} C${x0 + 60} ${y1 - 120} ${x0 + 90} ${y0 + 20} ${x0 + 150} ${y0 + 14} L${x0 + 330} ${y0 + 14} L${x0 + 334} ${y1 - 30} C${x0 + 400} ${y1 - 40} ${x0 + 430} ${y0 + 30} ${x0 + 520} ${y0 + 14} L${x0 + 640} ${y0 + 14} L${x0 + 644} ${y1 - 30} L${x0 + 700} ${y1 - 36} L${x0 + 704} ${y1}`;
  s += `<path d="${d}" fill="none" stroke="${P.serie}" stroke-width="3" stroke-linejoin="round"/>`;
  s += txt(P, x0 + 10, y1 - 40, 'roubo do ídolo', { tam: 11 });
  s += txt(P, x0 + 334, y1 - 48, 'tropeço', { tam: 12, peso: 'bold', ancora: 'middle' });
  s += txt(P, x0 + 585, y0 + 52, 'sem tropeçar,', { cor: P.suave, tam: 11, ancora: 'middle' }) + txt(P, x0 + 585, y0 + 66, 'eles ficam para trás', { cor: P.suave, tam: 11, ancora: 'middle' });
  s += txt(P, x0 + 644, y1 - 48, 'tropeço', { tam: 12, peso: 'bold', ancora: 'middle' }) + txt(P, x0 + 716, y1 - 8, 'outro logo depois: pego', { tam: 12, peso: 'bold', ancora: 'start', cor: P.destaque });
  s += `<circle cx="${x0 + 704}" cy="${y1}" r="6" fill="${P.destaque}"/>`;
  s += txt(P, 40, H - 30, 'Obstáculos grandes (muros, buracos, fogo, água) acabam a corrida na hora. Os pequenos (raízes, beiradas) só fazem tropeçar.', { tam: 12 });
  s += txt(P, 40, H - 10, 'Conceitual, sem escala. A partir da Temple Run Wiki (páginas "Creatures and enemies" e "List of obstacles").', { cor: P.suave, tam: 11 });
  return s + '</svg>';
}

// 3. Linha do tempo do produto (marcos; sem eixo de valor, porque os números variam de milhares a bilhões)
const MARCOS = [
  ['mar/2011', 'Protótipo na GDC', '1 mês de trabalho; ainda sem tema final'],
  ['04/08/2011', 'Lançado a US$ 0,99', 'com compras dentro do jogo; entra no top 100 e cai'],
  ['set/2011', 'Grátis "por um fim de semana"', 'sobe ao 3º lugar dos grátis e ganha mais do que pago'],
  ['jan/2012', 'Nº 1 grátis e em receita', '20 milhões de downloads, 7 milhões por dia, 1% paga'],
  ['ago/2012', '100 milhões de downloads', 'um ano depois do lançamento'],
  ['16/01/2013', 'Temple Run 2', '20 milhões de downloads em 4 dias'],
  ['jun/2014', '1 bilhão (os dois jogos)', ''],
  ['2021', '2 bilhões', '10 anos do jogo'],
];
function linhaDoTempo(P) {
  // Lista vertical: os textos não cabem lado a lado numa linha horizontal
  const W = 960, linha = 40, topo = 82, H = topo + MARCOS.length * linha + 30, xd = 140, xl = 165, xt = 188;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Linha do tempo do Temple Run, do protótipo de 2011 aos 2 bilhões de downloads em 2021"><rect width="${W}" height="${H}" fill="${P.fundo}"/>`;
  s += txt(P, 40, 30, 'Do protótipo aos bilhões', { peso: 'bold', tam: 15 }) + txt(P, 40, 50, 'marcos do Temple Run; em laranja, a virada para grátis', { cor: P.suave, tam: 12 });
  s += `<line x1="${xl}" y1="${topo - 12}" x2="${xl}" y2="${topo + (MARCOS.length - 1) * linha + 12}" stroke="${P.linha}" stroke-width="2"/>`;
  MARCOS.forEach(([data, t, nota], i) => {
    const y = topo + i * linha, cor = i === 2 ? P.destaque : P.serie;
    s += `<g><title>${esc(data)}: ${esc(t)}${nota ? ' (' + esc(nota) + ')' : ''}</title><circle cx="${xl}" cy="${y}" r="${i === 2 ? 8 : 6}" fill="${cor}"/></g>`;
    s += txt(P, xd, y + 4, data, { cor: P.suave, tam: 12, ancora: 'end' });
    s += txt(P, xt, y + 4, t, { peso: 'bold', tam: 13 });
    if (nota) s += txt(P, 470, y + 4, nota, { cor: P.suave, tam: 12 });
  });
  s += txt(P, 40, H - 10, 'Fontes: Keith Shepherd (TouchArcade, GDC 2014), TechCrunch (2012), Wikipédia, Vice (2021).', { cor: P.suave, tam: 11 });
  return s + '</svg>';
}

module.exports = { pista, perseguicao, linhaDoTempo, MARCOS, CLARO, TEMA };

if (require.main === module) {
  const OUT = path.resolve(process.argv[2] || path.join(__dirname, 'saida'));
  fs.mkdirSync(OUT, { recursive: true });
  for (const [nome, f] of Object.entries({ pista, perseguicao, 'linha-do-tempo': linhaDoTempo })) fs.writeFileSync(path.join(OUT, nome + '.svg'), f(CLARO));
  console.log('Diagramas em', OUT);
}
