// Diagramas do benchmark do Jetpack Joyride. Não há mapas de fase num jogo infinito: os desenhos mostram conceitos
// (curva de intensidade, sistema de intervalos, laços entre corridas) e um dado (estrelas por nível).
// Os conceitos foram redesenhados a partir dos slides de Luke Muscat (GDC 2012); os números de nível vêm da wiki dos jogadores.
// Uso: node diagramas.js [pasta de saída]  → SVG claros, para virar PNG. A página de leitura importa as mesmas funções com cores do tema.
const fs = require('fs');
const path = require('path');

const CLARO = {
  fundo: '#fcfcfb', tinta: '#111827', suave: '#4e5a6e', linha: '#d5dbe5', serie: '#2a6fd0', destaque: '#d9581f', painel: '#f2f4f8',
  fonte: 'Verdana, Arial, sans-serif',
};
const TEMA = {
  fundo: 'var(--surface)', tinta: 'var(--fg)', suave: 'var(--muted)', linha: 'var(--line)', serie: 'var(--serie)', destaque: 'var(--destaque)', painel: 'var(--bg)',
  fonte: 'var(--body)',
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const txt = (P, x, y, t, o = {}) => `<text x="${x}" y="${y}" fill="${o.cor || P.tinta}" font-family="${P.fonte}" font-size="${o.tam || 13}"${o.peso ? ` font-weight="${o.peso}"` : ''}${o.ancora ? ` text-anchor="${o.ancora}"` : ''}>${esc(t)}</text>`;

// 1. Curva de intensidade: antes (rampa e platô) e depois (serrote dos veículos)
function intensidade(P) {
  const W = 960, H = 340;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Intensidade ao longo da corrida: na primeira versão ela sobe e fica no alto; na versão lançada os veículos a derrubam e ela volta a subir"><rect width="${W}" height="${H}" fill="${P.fundo}"/>`;
  const painel = (x0, titulo, sub, d, notas) => {
    const y0 = 70, w = 420, h = 200;
    s += txt(P, x0, 30, titulo, { peso: 'bold', tam: 15 }) + txt(P, x0, 50, sub, { cor: P.suave, tam: 12 });
    s += `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 + h}" stroke="${P.suave}" stroke-width="1.5"/><line x1="${x0}" y1="${y0 + h}" x2="${x0 + w}" y2="${y0 + h}" stroke="${P.suave}" stroke-width="1.5"/>`;
    s += `<text x="${x0 - 12}" y="${y0 + h / 2}" fill="${P.suave}" font-family="${P.fonte}" font-size="12" text-anchor="middle" transform="rotate(-90 ${x0 - 12} ${y0 + h / 2})">intensidade</text>`;
    s += txt(P, x0 + w, y0 + h + 20, 'tempo da corrida →', { cor: P.suave, tam: 12, ancora: 'end' });
    s += `<path d="${d(x0, y0, w, h)}" fill="none" stroke="${P.destaque}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
    for (const [nx, ny, t, anc] of notas(x0, y0, w, h)) s += txt(P, nx, ny, t, { tam: 12, ancora: anc || 'middle' });
  };
  painel(50, 'Natal de 2010: "chato"', 'sobe e fica no alto, sempre a um golpe da morte',
    (x, y, w, h) => `M${x + 4} ${y + h - 30} C${x + 60} ${y + h - 90} ${x + 100} ${y + 40} ${x + 150} ${y + 32} L${x + w - 6} ${y + 26}`,
    (x, y, w) => [[x + 280, y + 16, 'platô: nenhum momento de alívio']]);
  painel(510, 'Versão lançada: os veículos criam o serrote', 'pegar um veículo derruba a intensidade; perdê-lo devolve',
    (x, y, w, h) => `M${x + 4} ${y + h - 40} C${x + 40} ${y + h - 100} ${x + 70} ${y + 40} ${x + 120} ${y + 32} L${x + 150} ${y + 30} L${x + 152} ${y + h - 30} C${x + 190} ${y + h - 50} ${x + 215} ${y + h - 70} ${x + 236} ${y + h - 80} L${x + 238} ${y + 30} L${x + 330} ${y + 30} L${x + 332} ${y + h - 30} C${x + 360} ${y + h - 50} ${x + 390} ${y + h - 64} ${x + w - 6} ${y + h - 74}`,
    (x, y, w, h) => [[x + 152, y + h - 12, 'pega veículo'], [x + 236, y + 18, 'perde o veículo'], [x + 332, y + h - 12, 'pega outro']]);
  s += txt(P, 50, H - 14, 'Conceitual, sem escala. Redesenhado a partir dos slides de Luke Muscat, "Depth in Simplicity: The Making of Jetpack Joyride" (GDC 2012).', { cor: P.suave, tam: 11 });
  return s + '</svg>';
}

// 2. Sistema de intervalos e o medidor de reação
function intervalos(P) {
  const W = 960, H = 430;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Três jeitos de espaçar obstáculos: regular, totalmente aleatório e aleatório entre um mínimo e um máximo; abaixo, como o intervalo mínimo muda a reação do jogador"><rect width="${W}" height="${H}" fill="${P.fundo}"/>`;
  const fila = (y, titulo, sub, xs) => {
    s += txt(P, 40, y - 8, titulo, { peso: 'bold', tam: 14 }) + txt(P, 40, y + 10, sub, { cor: P.suave, tam: 12 });
    s += `<line x1="330" y1="${y + 6}" x2="920" y2="${y + 6}" stroke="${P.linha}" stroke-width="2"/>`;
    for (const x of xs) s += `<rect x="${x - 5}" y="${y - 22}" width="10" height="28" rx="2" fill="${P.serie}"/>`;
  };
  fila(60, 'Regular', 'previsível: vira rotina', [360, 460, 560, 660, 760, 860]);
  fila(130, 'Totalmente aleatório', 'amontoa ou some: às vezes impossível', [360, 520, 610, 830, 846]);
  fila(200, 'Aleatório entre mínimo e máximo', 'variado e justo: é o que o jogo usa', [360, 450, 590, 650, 770, 900]);
  s += `<path d="M590 168 v-6 h60 v6" fill="none" stroke="${P.tinta}" stroke-width="1.5"/>` + txt(P, 620, 156, 'mínimo', { tam: 11, ancora: 'middle' });
  s += `<path d="M450 168 v-6 h140 v6" fill="none" stroke="${P.tinta}" stroke-width="1.5"/>` + txt(P, 520, 156, 'máximo', { tam: 11, ancora: 'middle' });
  // medidor de reação
  const y = 290, x0 = 40, w = 880;
  s += txt(P, x0, y - 28, 'O medidor de reação: o intervalo mínimo decide onde o jogo cai nesta faixa', { peso: 'bold', tam: 14 });
  const n = 7; const rot = ['"impossível!"', '"não fui rápido"', '"ufa, consegui"', '"toma essa"', '"fácil"', '', '"bocejo"'];
  for (let i = 0; i < n; i++) {
    const op = i <= 1 ? 0.95 : i === 2 ? 0.7 : i === 3 ? 0.5 : 0.25;
    s += `<rect x="${x0 + (i * w) / n + 1}" y="${y}" width="${w / n - 2}" height="22" fill="${i <= 2 ? P.destaque : P.serie}" fill-opacity="${op}"/>`;
    if (rot[i]) s += txt(P, x0 + (i * w) / n + w / n / 2, y + 44, rot[i], { tam: 12, ancora: 'middle' });
  }
  s += txt(P, x0, y + 78, '← intervalo mínimo curto demais: o jogador culpa o jogo e desiste', { cor: P.suave, tam: 12 });
  s += txt(P, x0 + w, y + 78, 'intervalo longo demais: tédio →', { cor: P.suave, tam: 12, ancora: 'end' });
  s += txt(P, x0, y + 104, 'O jogo mira o meio da faixa, mas deixa escapar um "não fui rápido" de vez em quando: o jogador divide a culpa com o jogo.', { tam: 12 });
  s += txt(P, x0, H - 10, 'Conceitual. Redesenhado a partir dos slides de Luke Muscat (GDC 2012) e do vídeo "How I designed Jetpack Joyride" (2023).', { cor: P.suave, tam: 11 });
  return s + '</svg>';
}

// 3. Os laços: a corrida, a morte e o que acontece entre uma corrida e outra
function lacos(P) {
  const W = 960, H = 440;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Laço curto: corrida, batida, roleta final, resultados e missões, jogar de novo com um toque. Laço longo: missões dão estrelas, estrelas sobem de nível, níveis dão moedas, moedas vão para a loja"><rect width="${W}" height="${H}" fill="${P.fundo}"/>`;
  s += `<defs><marker id="seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${P.suave}"/></marker></defs>`;
  const caixa = (x, y, w, h, t1, t2, forte) => {
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${P.painel}" stroke="${forte ? P.destaque : P.linha}" stroke-width="${forte ? 2 : 1.5}"/>`;
    s += txt(P, x + w / 2, y + 24, t1, { peso: 'bold', tam: 13, ancora: 'middle' });
    if (t2) t2.split('|').forEach((l, i) => { s += txt(P, x + w / 2, y + 44 + i * 16, l, { cor: P.suave, tam: 11, ancora: 'middle' }); });
  };
  const seta = (x1, y1, x2, y2) => { s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${P.suave}" stroke-width="1.8" marker-end="url(#seta)"/>`; };
  s += txt(P, 40, 30, 'Laço curto: uma corrida (segundos a minutos)', { peso: 'bold', tam: 15 });
  caixa(40, 50, 160, 82, 'Corrida', '1 botão|desviar e pegar moedas', true);
  caixa(240, 50, 160, 82, 'Batida', 'o corpo rola e|ainda pega moedas');
  caixa(440, 50, 160, 82, 'Roleta final', 'fichas viram prêmios|(reviver, empurrão)');
  caixa(640, 50, 160, 82, 'Resultados', 'distância, recorde,|missões cumpridas');
  seta(200, 91, 238, 91); seta(400, 91, 438, 91); seta(600, 91, 638, 91);
  s += `<path d="M800 91 h40 v70 h-720 v-28" fill="none" stroke="${P.destaque}" stroke-width="2" marker-end="url(#seta)"/>`;
  s += txt(P, 480, 178, 'jogar de novo: 1 toque, sem menus', { tam: 12, ancora: 'middle', peso: 'bold' });
  s += txt(P, 40, 230, 'Laço longo: entre as corridas (dias e semanas)', { peso: 'bold', tam: 15 });
  caixa(40, 250, 160, 98, 'Missões', '3 ativas ao mesmo tempo|nova entra quando|uma termina');
  caixa(240, 250, 160, 98, 'Estrelas', '1 a 3 por missão|"batem" na tela');
  caixa(440, 250, 160, 98, 'Nível', '15 níveis; no fim,|uma insígnia (125)|e tudo recomeça');
  caixa(640, 250, 160, 98, 'Moedas e loja', 'visual, utilidades,|gadgets, veículos');
  seta(200, 299, 238, 299); seta(400, 299, 438, 299); seta(600, 299, 638, 299);
  s += `<path d="M720 348 v34 h-640 v-34" fill="none" stroke="${P.suave}" stroke-width="1.6" marker-end="url(#seta)"/>`;
  s += txt(P, 400, 400, 'algumas missões pedem para comprar algo na loja: é assim que o jogo apresenta a loja', { cor: P.suave, tam: 12, ancora: 'middle' });
  s += txt(P, 822, 262, 'Ao redor:', { peso: 'bold', tam: 12 });
  ['desafio diário', 'eventos', 'bônus ao voltar', 'ranking'].forEach((t, i) => { s += txt(P, 822, 282 + i * 18, '· ' + t, { cor: P.suave, tam: 12 }); });
  s += txt(P, 40, H - 12, 'Montado a partir do jogo atual (wiki dos jogadores) e do relato do criador. Esquema, não captura de tela.', { cor: P.suave, tam: 11 });
  return s + '</svg>';
}

// 4. Estrelas pedidas por nível (dado da wiki; uma série, um eixo)
const NIVEIS = [
  ['Beginner', 3], ['Learner', 3], ['Rookie', 3], ['Novice', 5], ['Amateur', 5], ['Graduate', 7], ['Skilled', 7], ['Experienced', 7],
  ['Professional', 9], ['Hotshot', 9], ['Expert', 11], ['Wizard', 11], ['Ninja', 11], ['Super Star', 13], ['Barry', 13],
];
function niveis(P) {
  const W = 960, H = 330, x0 = 60, x1 = 930, base = 260, topo = 60, max = 14;
  const y = (v) => base - (v / max) * (base - topo);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Estrelas pedidas para subir cada um dos 15 níveis: de 3 no começo a 13 no fim"><rect width="${W}" height="${H}" fill="${P.fundo}"/>`;
  s += txt(P, x0, 30, 'Estrelas pedidas para subir de nível', { peso: 'bold', tam: 15 }) + txt(P, x0, 48, '117 estrelas no total para os 15 níveis; cada nível também paga 400 moedas × o número do nível', { cor: P.suave, tam: 12 });
  for (const v of [0, 5, 10]) s += `<line x1="${x0}" x2="${x1}" y1="${y(v)}" y2="${y(v)}" stroke="${P.linha}"/>` + txt(P, x0 - 8, y(v) + 4, String(v), { cor: P.suave, tam: 11, ancora: 'end' });
  const bw = (x1 - x0) / NIVEIS.length;
  NIVEIS.forEach(([nome, v], i) => {
    const x = x0 + i * bw + bw * 0.22, w = bw * 0.56, top = y(v), r = 4;
    s += `<g><title>Nível ${i + 1} (${nome}): ${v} estrelas, ${400 * (i + 1)} moedas</title><path d="M${x} ${base} V${top + r} q0 -${r} ${r} -${r} h${w - 2 * r} q${r} 0 ${r} ${r} V${base} z" fill="${P.serie}"/></g>`;
    if (i === 0 || NIVEIS[i - 1][1] !== v) s += txt(P, x + w / 2, top - 6, String(v), { tam: 11, ancora: 'middle', peso: 'bold' });
    s += txt(P, x + w / 2, base + 18, String(i + 1), { cor: P.suave, tam: 11, ancora: 'middle' });
  });
  s += `<line x1="${x0}" x2="${x1}" y1="${base}" y2="${base}" stroke="${P.suave}"/>`;
  s += txt(P, (x0 + x1) / 2, base + 40, 'nível (1 = Beginner … 15 = Barry; depois, insígnia e recomeço)', { cor: P.suave, tam: 12, ancora: 'middle' });
  s += txt(P, x0, H - 10, 'Fonte: Jetpack Joyride Wiki, página "Rank" (consultada em 06/10/2026).', { cor: P.suave, tam: 11 });
  return s + '</svg>';
}

module.exports = { intensidade, intervalos, lacos, niveis, NIVEIS, CLARO, TEMA };

if (require.main === module) {
  const OUT = path.resolve(process.argv[2] || path.join(__dirname, 'saida'));
  fs.mkdirSync(OUT, { recursive: true });
  for (const [nome, f] of Object.entries({ 'curva-intensidade': intensidade, intervalos, lacos, niveis })) fs.writeFileSync(path.join(OUT, nome + '.svg'), f(CLARO));
  console.log('Diagramas em', OUT);
}
