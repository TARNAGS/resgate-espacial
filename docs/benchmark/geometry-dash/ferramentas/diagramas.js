// Diagramas do benchmark do Geometry Dash: a curva das 22 fases oficiais, o Geometry Dash World (10 fases em 2 mundos),
// checkpoints e ranking, o funil do grátis para o pago e a linha do tempo das fases oficiais.
// Tudo redesenhado a partir dos números de ../fases.json (Geometry Dash Wiki) e das falas do criador; nenhuma captura de tela.
// Uso: node diagramas.js [pasta de saída]  → SVG claros, para virar PNG. A página de leitura importa as mesmas funções com cores do tema.
const fs = require('fs');
const path = require('path');
const F = require('../fases.json');

const CLARO = { fundo: '#fcfcfb', tinta: '#111827', suave: '#4e5a6e', linha: '#d5dbe5', serie: '#2a6fd0', destaque: '#d9581f', ok: '#2e8b57', painel: '#f2f4f8', cinza: '#9aa3b2', fonte: 'Verdana, Arial, sans-serif' };
const TEMA = { fundo: 'var(--surface)', tinta: 'var(--fg)', suave: 'var(--muted)', linha: 'var(--line)', serie: 'var(--serie)', destaque: 'var(--destaque)', ok: 'var(--ok)', painel: 'var(--bg)', cinza: 'var(--cinza)', fonte: 'var(--body)' };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const txt = (P, x, y, t, o = {}) => `<text x="${x}" y="${y}" fill="${o.cor || P.tinta}" font-family="${P.fonte}" font-size="${o.tam || 13}"${o.peso ? ` font-weight="${o.peso}"` : ''}${o.ancora ? ` text-anchor="${o.ancora}"` : ''}${o.rot ? ` transform="rotate(${o.rot} ${x} ${y})"` : ''}>${esc(t)}</text>`;
const abre = (W, H, P, rotulo) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(rotulo)}"><rect width="${W}" height="${H}" fill="${P.fundo}"/>`;
const titulo = (P, t, sub) => txt(P, 40, 30, t, { peso: 'bold', tam: 15 }) + txt(P, 40, 50, sub, { cor: P.suave, tam: 12 });
// quebra um texto em linhas de até n caracteres
const quebra = (t, n) => { const out = []; let l = ''; for (const p of t.split(' ')) { if ((l + ' ' + p).trim().length > n) { out.push(l.trim()); l = p; } else l += ' ' + p; } if (l.trim()) out.push(l.trim()); return out; };

// 1. A curva: estrelas de cada fase oficial, com a atualização em que entrou
function curva(P) {
  const W = 960, H = 470, x0 = 70, x1 = 930, y0 = 92, y1 = 360, max = 16;
  const fases = F.principais, n = fases.length, passo = (x1 - x0) / n, larg = passo * 0.62;
  const y = (v) => y1 - (v / max) * (y1 - y0);
  let s = abre(W, H, P, 'Gráfico de barras: estrelas de cada uma das 22 fases oficiais, que sobem de 1 a 12 nas fases 1 a 12 e depois alternam entre fases que apresentam uma mecânica e fases Demon');
  s += titulo(P, 'A curva das 22 fases oficiais', 'estrelas de cada fase (acompanham a dificuldade); faixas = atualização em que a fase entrou no jogo');
  // faixas das atualizações
  let i = 0, alterna = false;
  while (i < n) {
    const v = fases[i].entrou.versao; let j = i; while (j < n && fases[j].entrou.versao === v) j++;
    if (alterna) s += `<rect x="${x0 + i * passo}" y="${y0 - 14}" width="${(j - i) * passo}" height="${y1 - y0 + 14}" fill="${P.painel}"/>`;
    s += txt(P, x0 + ((i + j) / 2) * passo, y1 + 46, v, { cor: P.suave, tam: 11, ancora: 'middle' });
    alterna = !alterna; i = j;
  }
  s += txt(P, x0 - 8, y1 + 46, 'versão', { cor: P.suave, tam: 11, ancora: 'end' });
  for (const v of [0, 5, 10, 15]) s += `<line x1="${x0}" y1="${y(v)}" x2="${x1}" y2="${y(v)}" stroke="${P.linha}" stroke-width="1"/>` + txt(P, x0 - 8, y(v) + 4, v, { cor: P.suave, tam: 11, ancora: 'end' });
  fases.forEach((f, k) => {
    const cx = x0 + (k + 0.5) * passo, cor = f.dificuldade === 'Demon' ? P.destaque : f.trazMecanicaNova ? P.serie : P.cinza;
    s += `<g><title>${f.n}. ${esc(f.nome)}: ${f.dificuldade}, ${f.estrelas} estrelas, ${f.segundos} s. Novidade: ${esc(f.novidade)}</title><rect x="${cx - larg / 2}" y="${y(f.estrelas)}" width="${larg}" height="${y1 - y(f.estrelas)}" fill="${cor}" rx="2"/></g>`;
    s += txt(P, cx, y1 + 18, f.n, { tam: 11, ancora: 'middle' });
    if (f.trancadaPorMoedas) s += txt(P, cx, y(f.estrelas) - 6, `${f.trancadaPorMoedas} moedas`, { cor: P.destaque, tam: 10, ancora: 'middle' });
  });
  s += txt(P, x0 + 6.2 * passo, y(12) - 22, 'fases 1 a 12: uma estrela a mais por fase', { cor: P.suave, tam: 11, ancora: 'middle' });
  s += `<line x1="${x0 + 0.5 * passo}" y1="${y(1) - 4}" x2="${x0 + 11.5 * passo}" y2="${y(12) - 4}" stroke="${P.suave}" stroke-width="1" stroke-dasharray="4 4"/>`;
  s += txt(P, x0 + 17.5 * passo, y0 - 22, 'depois: a fase que apresenta e o Demon que cobra', { cor: P.suave, tam: 11, ancora: 'middle' });
  // legenda
  const ly = H - 40;
  s += `<rect x="40" y="${ly - 10}" width="12" height="12" fill="${P.serie}"/>` + txt(P, 58, ly, 'apresenta uma mecânica nova', { tam: 12 });
  s += `<rect x="270" y="${ly - 10}" width="12" height="12" fill="${P.cinza}"/>` + txt(P, 288, ly, 'sem novidade', { tam: 12 });
  s += `<rect x="400" y="${ly - 10}" width="12" height="12" fill="${P.destaque}"/>` + txt(P, 418, ly, 'Demon (aberta com moedas secretas)', { tam: 12 });
  s += txt(P, 40, H - 14, 'Dados: Geometry Dash Wiki, página "Main Levels" (consulta em 08/10/2026). Geometry Dash © RobTop Games; redesenho para estudo.', { cor: P.suave, tam: 11 });
  return s + '</svg>';
}

// 2. O Geometry Dash World: 10 fases curtas em 2 mundos de 5, uma novidade por fase
function mundo(P) {
  const W = 960, H = 460, bx = 40, bw = 168, gap = 7, bh = 118;
  let s = abre(W, H, P, 'Os dois mundos do Geometry Dash World, com cinco fases cada; cada fase dura de 27 a 37 segundos e apresenta uma novidade');
  s += titulo(P, 'Geometry Dash World: um mundo de 10 fases curtas', 'jogadas em sequência; cada fase dura cerca de 30 segundos e apresenta uma coisa só');
  const linhas = [['Dashlands', 0, 82], ['Toxic Factory', 5, 82 + bh + 64]];
  for (const [nome, ini, top] of linhas) {
    s += txt(P, bx, top, nome, { peso: 'bold', tam: 13 }) + txt(P, bx + 120, top, ini === 0 ? 'mundo 1' : 'mundo 2', { cor: P.suave, tam: 11 });
    for (let k = 0; k < 5; k++) {
      const f = F.world[ini + k], x = bx + k * (bw + gap), yb = top + 12;
      s += `<g><title>${f.n}. ${esc(f.nome)}: ${f.segundos} s, ${f.estrelas} estrelas. Novidade: ${esc(f.novidade)}</title><rect x="${x}" y="${yb}" width="${bw}" height="${bh}" rx="6" fill="${P.painel}" stroke="${P.linha}"/></g>`;
      s += txt(P, x + 10, yb + 22, `${f.n}. ${f.nome}`, { peso: 'bold', tam: 12 });
      const barra = (bw - 20) * (f.segundos / 40);
      s += `<rect x="${x + 10}" y="${yb + 34}" width="${bw - 20}" height="8" rx="4" fill="${P.linha}"/><rect x="${x + 10}" y="${yb + 34}" width="${barra}" height="8" rx="4" fill="${P.serie}"/>`;
      s += txt(P, x + 10, yb + 58, `${f.segundos} s`, { cor: P.suave, tam: 11 });
      quebra('Novo: ' + f.novidade, 24).slice(0, 3).forEach((l, i) => { s += txt(P, x + 10, yb + 78 + i * 15, l, { tam: 11 }); });
      if (k < 4) s += txt(P, x + bw + gap / 2, yb + bh / 2 + 4, '›', { cor: P.suave, tam: 14, ancora: 'middle' });
    }
  }
  s += txt(P, 40, H - 32, 'Barra: duração de uma corrida perfeita (escala até 40 s). As fases do jogo principal duram de 82 a 102 s.', { tam: 12 });
  s += txt(P, 40, H - 12, 'Dados: Geometry Dash Wiki, páginas "Geometry Dash World", "Dashlands" e "Toxic Factory". Geometry Dash © RobTop Games; redesenho para estudo.', { cor: P.suave, tam: 11 });
  return s + '</svg>';
}

// 3. Checkpoints e ranking: três jeitos de recomeçar, e o que vale em cada um
function checkpoints(P) {
  const W = 960, H = 500, xa = 110, xb = 520, linhas = [
    { t: 'Fase clássica, modo normal', y: 110, pontos: [], morte: 0.47, volta: 0, vale: ['Vale: estrelas, moedas e o recorde de %', 'Ranking da fase: %, depois moedas,', 'depois tempo'], cor: P.serie },
    { t: 'Modo prática (qualquer fase clássica)', y: 230, pontos: [0.14, 0.27, 0.4], morte: 0.47, volta: 0.4, vale: ['Não vale: sem estrelas; moedas viram enfeite', 'Progresso guardado à parte', 'Música própria, em loop: é treino'], cor: P.cinza },
    { t: 'Fase de plataforma (a Torre, 2023)', y: 350, pontos: [0.3, 0.62], morte: 0.47, volta: 0.3, vale: ['Vale: os checkpoints são parte da fase', 'Ranking por tempo total da corrida', '3ª moeda: terminar abaixo de um tempo'], cor: P.ok, relogio: true },
  ];
  let s = abre(W, H, P, 'Três esquemas de fase: no modo normal, bater volta ao começo; no modo prática, volta ao último checkpoint mas não vale nada; na fase de plataforma, os checkpoints fazem parte da fase e o tempo total vai para o ranking');
  s += titulo(P, 'Checkpoints e ranking: o treino separado da conclusão que vale', 'onde o ícone reaparece depois de bater, e o que conta em cada caso (esquema)');
  for (const L of linhas) {
    const X = (p) => xa + p * (xb - xa);
    s += txt(P, 40, L.y - 30, L.t, { peso: 'bold', tam: 13 });
    s += `<line x1="${xa}" y1="${L.y}" x2="${xb}" y2="${L.y}" stroke="${P.linha}" stroke-width="10" stroke-linecap="round"/>`;
    s += txt(P, xa - 14, L.y + 5, 'início', { cor: P.suave, tam: 11, ancora: 'end' }) + txt(P, xb + 14, L.y + 5, 'fim', { cor: P.suave, tam: 11 });
    for (const p of L.pontos) s += `<path d="M${X(p)} ${L.y - 13} l7 7 l-7 7 l-7 -7 z" fill="${P.ok}"/>`;
    s += `<path d="M${X(L.morte) - 7} ${L.y - 7} l14 14 M${X(L.morte) + 7} ${L.y - 7} l-14 14" stroke="${P.destaque}" stroke-width="3"/>`;
    const xv = X(L.volta);
    s += `<path d="M${X(L.morte)} ${L.y + 16} C${X(L.morte)} ${L.y + 40} ${xv} ${L.y + 40} ${xv} ${L.y + 18}" fill="none" stroke="${P.destaque}" stroke-width="1.5" stroke-dasharray="4 3"/><path d="M${xv - 4} ${L.y + 24} l4 -7 l4 7" fill="none" stroke="${P.destaque}" stroke-width="1.5"/>`;
    s += txt(P, (X(L.morte) + xv) / 2, L.y + 48, L.volta === 0 ? 'bateu: volta ao 0%' : 'bateu: volta ao último checkpoint', { cor: P.destaque, tam: 11, ancora: 'middle' });
    if (L.relogio) s += `<circle cx="${xa + 268}" cy="${L.y - 34}" r="7" fill="none" stroke="${P.tinta}" stroke-width="1.5"/><path d="M${xa + 268} ${L.y - 38} v4 h3" stroke="${P.tinta}" stroke-width="1.5" fill="none"/>` + txt(P, xa + 280, L.y - 30, 'relógio corre direto, mortes incluídas (inferido)', { cor: P.suave, tam: 11 });
    L.vale.forEach((v, i) => { s += txt(P, 590, L.y - 12 + i * 17, v, { tam: 12, cor: i === 0 ? L.cor === P.cinza ? P.suave : P.tinta : P.tinta, peso: i === 0 ? 'bold' : null }); });
  }
  s += `<path d="M47 ${H - 58} l7 7 l-7 7 l-7 -7 z" fill="${P.ok}"/>` + txt(P, 62, H - 46, 'checkpoint', { tam: 12 });
  s += `<path d="M160 ${H - 58} l12 12 M172 ${H - 58} l-12 12" stroke="${P.destaque}" stroke-width="3"/>` + txt(P, 180, H - 46, 'batida', { tam: 12 });
  s += txt(P, 260, H - 46, 'A prática é opcional: liga-se no menu de pausa. Nas fases de plataforma ela não existe,', { tam: 12 }) + txt(P, 260, H - 30, 'porque os checkpoints já estão na fase.', { tam: 12 });
  s += txt(P, 40, H - 12, 'Esquema, sem escala. A partir da Geometry Dash Wiki ("Practice Mode", "Pause Menu", "Leaderboards", "Tower", "The Tower").', { cor: P.suave, tam: 11 });
  return s + '</svg>';
}

// 4. O funil: os jogos grátis com anúncios levam ao completo pago
function funil(P) {
  const W = 960, H = 430;
  let s = abre(W, H, P, 'Esquema do modelo de negócio: três jogos grátis com anúncios (Lite, World e os spin-offs) levam o jogador ao Geometry Dash completo, pago, sem anúncios e com o editor');
  s += titulo(P, 'Do grátis com anúncios para o pago sem anúncios', 'o modelo que o criador diz ter sido uma das chaves do sucesso (AMA no Reddit, 2024)');
  const caixa = (x, y, w, h, t, linhas, cor) => {
    let r = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${P.painel}" stroke="${cor}" stroke-width="2"/>` + txt(P, x + 14, y + 24, t, { peso: 'bold', tam: 13 });
    linhas.forEach((l, i) => { r += txt(P, x + 14, y + 46 + i * 17, l, { tam: 12, cor: i === linhas.length - 1 ? P.suave : P.tinta }); });
    return r;
  };
  s += caixa(40, 76, 360, 108, 'Geometry Dash Lite (grátis, set/2013)', ['Começou com 1 fase; hoje tem 21 das 22 e a Torre', 'Anúncios entre tentativas; baús por anúncio', 'Sem editor e sem busca de fases da comunidade', 'Google Play: mais de 500 milhões de instalações'], P.serie);
  s += caixa(40, 196, 360, 92, 'Geometry Dash World (grátis, dez/2016)', ['10 fases curtas em 2 mundos, com anúncios', 'Fase do dia e demon da semana depois de terminar', 'Google Play: mais de 100 milhões de instalações'], P.serie);
  s += caixa(40, 300, 360, 76, 'Meltdown (2015) e SubZero (2017), grátis', ['3 fases cada, com anúncios; lançados em dezembro,', 'nos intervalos entre as atualizações grandes'], P.serie);
  s += caixa(560, 150, 360, 150, 'Geometry Dash (pago)', ['US$ 3,99 nas lojas de celular; US$ 4,99 no Steam', 'Sem anúncios e sem compras dentro do jogo', 'Editor de fases e milhões de fases da comunidade', 'A loja do iPhone: "não coleta dados"', 'Google Play: mais de 10 milhões de instalações'], P.destaque);
  for (const yy of [130, 242, 338]) s += `<path d="M404 ${yy} C470 ${yy} 490 225 552 225" fill="none" stroke="${P.suave}" stroke-width="1.5"/>`;
  s += `<path d="M546 220 l8 5 l-8 5" fill="none" stroke="${P.suave}" stroke-width="1.5"/>`;
  s += txt(P, 478, 140, 'botão', { cor: P.suave, tam: 11, ancora: 'middle' }) + txt(P, 478, 154, '"versão completa"', { cor: P.suave, tam: 11, ancora: 'middle' });
  s += txt(P, 560, 330, 'Por que pago + grátis, segundo o criador: subir no ranking dos', { tam: 12 });
  s += txt(P, 560, 347, 'pagos pede menos downloads do que no dos grátis, e o grátis', { tam: 12 });
  s += txt(P, 560, 364, 'rende anúncios enquanto manda gente para o pago.', { tam: 12 });
  s += txt(P, 40, H - 12, 'Preços e instalações consultados em 08/10/2026 (App Store, Google Play, Steam). Geometry Dash © RobTop Games; esquema para estudo.', { cor: P.suave, tam: 11 });
  return s + '</svg>';
}

// 5. Linha do tempo: fases oficiais ao longo dos anos e picos de jogadores no Steam
function linhaDoTempo(P) {
  const W = 960, H = 400, x0 = 70, x1 = 920, y0 = 80, y1 = 290, t0 = 2013.5, t1 = 2026.9;
  const ano = (d) => { const [dd, mm, aa] = d.split('/').map(Number); return aa + (mm - 1) / 12 + (dd - 1) / 365; };
  const X = (t) => x0 + ((t - t0) / (t1 - t0)) * (x1 - x0), Y = (v) => y1 - (v / 24) * (y1 - y0);
  let s = abre(W, H, P, 'Linha do tempo: as fases oficiais crescem de 7 em 2013 para 18 no fim de 2014 e quase param depois; o jogo passou mais de seis anos sem fase nova e, mesmo assim, bateu recordes de jogadores no Steam em 2023 e 2026');
  s += titulo(P, 'Uma fase por mês no primeiro ano, depois a comunidade', 'quantidade de fases oficiais no jogo completo e picos de jogadores ao mesmo tempo no Steam');
  for (let a = 2014; a <= 2026; a += 2) s += `<line x1="${X(a)}" y1="${y0}" x2="${X(a)}" y2="${y1}" stroke="${P.linha}" stroke-width="1"/>` + txt(P, X(a), y1 + 18, a, { cor: P.suave, tam: 11, ancora: 'middle' });
  for (const v of [0, 10, 20]) s += txt(P, x0 - 8, Y(v) + 4, v, { cor: P.suave, tam: 11, ancora: 'end' });
  let d = '', prev = null;
  for (const u of F.atualizacoes) { const x = X(ano(u.data)), y = Y(u.fases); d += prev === null ? `M${x} ${y}` : ` L${x} ${prev} L${x} ${y}`; prev = y; }
  d += ` L${X(t1)} ${prev}`;
  s += `<path d="${d}" fill="none" stroke="${P.serie}" stroke-width="3"/>`;
  for (const u of F.atualizacoes) s += `<g><title>${u.versao} (${u.data}): ${u.fases} fases oficiais${u.extra ? ' ' + esc(u.extra) : ''}</title><circle cx="${X(ano(u.data))}" cy="${Y(u.fases)}" r="4" fill="${P.serie}"/></g>`;
  s += txt(P, X(ano('13/08/2013')) + 8, Y(7) + 18, '1.0: 7 fases', { tam: 11 });
  s += txt(P, X(ano('09/11/2014')) - 6, Y(18) - 8, '1.9: 18', { tam: 11, ancora: 'end' });
  s += txt(P, X(ano('26/08/2015')) + 6, Y(20) - 10, '2.0: 20', { tam: 11 }) + txt(P, X(ano('18/01/2017')) + 6, Y(21) - 10, '2.1: 21', { tam: 11 });
  s += txt(P, X(ano('19/12/2023')) - 6, Y(22) - 10, '2.2: 22 + Torre', { tam: 11, ancora: 'end' });
  s += `<rect x="${X(ano('18/01/2017'))}" y="${Y(21) + 8}" width="${X(ano('19/12/2023')) - X(ano('18/01/2017'))}" height="22" fill="${P.painel}"/>` + txt(P, (X(ano('18/01/2017')) + X(ano('19/12/2023'))) / 2, Y(21) + 23, 'quase 7 anos sem fase oficial nova', { cor: P.suave, tam: 11, ancora: 'middle' });
  const picos = [['18/01/2017', '9 mil'], ['01/06/2021', '15 mil'], ['01/06/2022', '16 mil'], ['21/12/2023', '88 mil'], ['20/12/2025', '92 mil'], ['10/01/2026', '100 mil']];
  s += txt(P, x0, y1 + 42, 'Pico no Steam:', { peso: 'bold', tam: 12 });
  picos.forEach(([dt, v], i) => { const x = X(ano(dt)), anc = i === 4 ? 'end' : i === 5 ? 'start' : 'middle'; s += `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y1 + 28}" stroke="${P.destaque}" stroke-width="1" stroke-dasharray="2 2"/>` + txt(P, x + (i === 4 ? -2 : i === 5 ? 2 : 0), y1 + 42, v, { cor: P.destaque, tam: 11, ancora: anc }); });
  s += txt(P, 40, H - 12, 'Fases: log de atualizações do iOS na Geometry Dash Wiki. Picos: Wikipédia, a partir de PC Gamer (2023), iXBT Games (2025) e TheGamer (2026).', { cor: P.suave, tam: 11 });
  return s + '</svg>';
}

module.exports = { curva, mundo, checkpoints, funil, linhaDoTempo, CLARO, TEMA };

if (require.main === module) {
  const OUT = path.resolve(process.argv[2] || path.join(__dirname, 'saida'));
  fs.mkdirSync(OUT, { recursive: true });
  for (const [nome, f] of Object.entries({ curva, mundo, checkpoints, funil, 'linha-do-tempo': linhaDoTempo })) fs.writeFileSync(path.join(OUT, nome + '.svg'), f(CLARO));
  console.log('Diagramas em', OUT);
}
