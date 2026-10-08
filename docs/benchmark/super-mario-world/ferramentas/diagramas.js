// Diagramas do benchmark do Super Mario World (como o jogo ensina): onde o jogo fala, o primeiro mundo,
// os quatro tempos de uma fase, as redes de segurança e a ajuda depois do erro na série.
// Redesenhados a partir de ../fases.json (Super Mario Wiki) e das entrevistas Iwata Asks; nenhuma captura de tela.
// Uso: node diagramas.js [pasta de saída]  → SVG claros, para virar PNG. A página de leitura importa as mesmas funções com cores do tema.
const fs = require('fs');
const path = require('path');
const F = require('../fases.json');

const CLARO = { fundo: '#fcfcfb', tinta: '#111827', suave: '#4e5a6e', linha: '#d5dbe5', serie: '#2a6fd0', destaque: '#d9581f', ok: '#2e8b57', painel: '#f2f4f8', cinza: '#9aa3b2', fonte: 'Verdana, Arial, sans-serif' };
const TEMA = { fundo: 'var(--surface)', tinta: 'var(--fg)', suave: 'var(--muted)', linha: 'var(--line)', serie: 'var(--serie)', destaque: 'var(--destaque)', ok: 'var(--ok)', painel: 'var(--bg)', cinza: 'var(--cinza)', fonte: 'var(--body)' };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const txt = (P, x, y, t, o = {}) => `<text x="${x}" y="${y}" fill="${o.cor || P.tinta}" font-family="${P.fonte}" font-size="${o.tam || 13}"${o.peso ? ` font-weight="${o.peso}"` : ''}${o.ancora ? ` text-anchor="${o.ancora}"` : ''}>${esc(t)}</text>`;
const abre = (W, H, P, rotulo) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(rotulo)}"><rect width="${W}" height="${H}" fill="${P.fundo}"/>`;
const titulo = (P, t, sub) => txt(P, 40, 30, t, { peso: 'bold', tam: 15 }) + txt(P, 40, 50, sub, { cor: P.suave, tam: 12 });
const quebra = (t, n) => { const out = []; let l = ''; for (const p of t.split(' ')) { if ((l + ' ' + p).trim().length > n) { out.push(l.trim()); l = p; } else l += ' ' + p; } if (l.trim()) out.push(l.trim()); return out; };
const balao = (P, x, y, cor) => `<path d="M${x - 7} ${y - 6} h14 a3 3 0 0 1 3 3 v7 a3 3 0 0 1 -3 3 h-8 l-4 4 v-4 h-2 a3 3 0 0 1 -3 -3 v-7 a3 3 0 0 1 3 -3 z" fill="${cor}"/>`;

// 1. Onde o jogo fala: mensagens por mundo
const MUNDOS = ['Yoshi\'s Island', 'Donut Plains', 'Vanilla Dome', 'Twin Bridges', 'Forest of Illusion', 'Chocolate Island', 'Valley of Bowser', 'Star World', 'Special Zone'];
function dicas(P) {
  const W = 960, H = 420, x0 = 90, x1 = 920, y0 = 92, y1 = 300, max = 12;
  const jogo = Array(9).fill(0), hist = Array(9).fill(0);
  for (const d of F.dicas) { if (!d.mundo) continue; (d.tipo === 'jogo' ? jogo : hist)[d.mundo - 1]++; }
  const passo = (x1 - x0) / 9, larg = passo * 0.3, y = (v) => y1 - (v / max) * (y1 - y0);
  let s = abre(W, H, P, 'Gráfico de barras: dicas de jogo e textos de história por mundo; 11 das 19 dicas de jogo ficam no primeiro mundo, e os mundos 3 a 8 não têm nenhuma');
  s += titulo(P, 'Onde o jogo fala', 'mensagens da versão de Super Nintendo, por mundo: dica de jogo (azul) e texto de história (cinza)');
  for (const v of [0, 4, 8, 12]) s += `<line x1="${x0}" y1="${y(v)}" x2="${x1}" y2="${y(v)}" stroke="${P.linha}" stroke-width="1"/>` + txt(P, x0 - 8, y(v) + 4, v, { cor: P.suave, tam: 11, ancora: 'end' });
  MUNDOS.forEach((m, i) => {
    const cx = x0 + (i + 0.5) * passo;
    if (jogo[i]) s += `<g><title>${esc(m)}: ${jogo[i]} dicas de jogo</title><rect x="${cx - larg - 2}" y="${y(jogo[i])}" width="${larg}" height="${y1 - y(jogo[i])}" fill="${P.serie}" rx="2"/></g>` + txt(P, cx - larg / 2 - 2, y(jogo[i]) - 6, jogo[i], { tam: 11, ancora: 'middle', peso: 'bold' });
    if (hist[i]) s += `<g><title>${esc(m)}: ${hist[i]} textos de história</title><rect x="${cx + 2}" y="${y(hist[i])}" width="${larg}" height="${y1 - y(hist[i])}" fill="${P.cinza}" rx="2"/></g>` + txt(P, cx + larg / 2 + 2, y(hist[i]) - 6, hist[i], { tam: 11, ancora: 'middle', cor: P.suave });
    txt(P, 0, 0, '');
    s += txt(P, cx, y1 + 18, `${i + 1}`, { tam: 12, ancora: 'middle', peso: 'bold' });
    quebra(m, 12).forEach((l, k) => { s += txt(P, cx, y1 + 33 + k * 13, l, { tam: 10, ancora: 'middle', cor: P.suave }); });
  });
  s += `<rect x="${x0 + 2 * passo + 4}" y="${y(9) - 18}" width="${5 * passo - 8}" height="40" fill="${P.painel}"/>` + txt(P, x0 + 4.5 * passo, y(9) - 2, 'do mundo 3 em diante, só 2 dicas de jogo (no 6 e no 9);', { cor: P.suave, tam: 11, ancora: 'middle' }) + txt(P, x0 + 4.5 * passo, y(9) + 14, 'o resto é a história contada no fim de cada castelo', { cor: P.suave, tam: 11, ancora: 'middle' });
  s += txt(P, 40, H - 32, 'Mais uma dica aparece em todos os palácios dos botões. Todas as dicas são opcionais: só aparecem se Mario bater no bloco de mensagem.', { tam: 12 });
  s += txt(P, 40, H - 12, 'Dados: Super Mario Wiki, página "Tourist Tips" (consulta em 08/10/2026). Super Mario World © Nintendo; redesenho para estudo.', { cor: P.suave, tam: 11 });
  return s + '</svg>';
}

// 2. O primeiro mundo: o mapa como sequência de aulas
function primeiroMundo(P) {
  const W = 960, H = 470, bw = 196, bh = 132;
  const M = Object.fromEntries(F.primeiroMundo.map((f) => [f.fase, f]));
  const pos = {
    "Yoshi's House": [40, 150], "Yoshi's Island 1": [276, 74], 'Yellow Switch Palace': [512, 74],
    "Yoshi's Island 2": [276, 268], "Yoshi's Island 3": [512, 268], "Yoshi's Island 4": [748, 268], "#1 Iggy's Castle": [748, 74],
  };
  const curto = {
    "Yoshi's House": 'Partida no mapa: dois caminhos abertos; a casa é opcional',
    "Yoshi's Island 1": 'Rex, caixa de item extra, jogar o casco para cima',
    'Yellow Switch Palace': 'Sala sem inimigos para brincar com o P Switch; o botão facilita 21 fases',
    "Yoshi's Island 2": 'Yoshi, pulo giratório e o portão do meio da fase',
    "Yoshi's Island 3": 'Plataformas que se movem, Dragon Coins, pulo alto',
    "Yoshi's Island 4": 'Água que empurra para trás, ilhas que afundam',
    "#1 Iggy's Castle": 'Grade para escalar, lava e o primeiro chefe',
  };
  const rede = {
    "Yoshi's House": 'pista, se voltar com o Yoshi', "Yoshi's Island 1": 'dois cogumelos no caminho', 'Yellow Switch Palace': 'ajuda conquistada',
    "Yoshi's Island 2": 'outro bloco com o Yoshi', "Yoshi's Island 3": 'vida extra por 30 moedas', "Yoshi's Island 4": 'Fire Flower logo no começo', "#1 Iggy's Castle": 'Fire Flower no meio da sala',
  };
  let s = abre(W, H, P, 'Esquema do primeiro mundo do Super Mario World: da casa do Yoshi, um caminho opcional leva ao palácio amarelo e o principal passa pelas fases 2, 3 e 4 até o castelo do Iggy; cada fase apresenta poucas coisas e tem uma rede de segurança');
  s += titulo(P, 'O primeiro mundo como uma sequência de aulas', 'Yoshi\'s Island: o que cada fase apresenta, quantas dicas opcionais tem e a sua rede de segurança (esquema do mapa)');
  const centro = (k, dx = 0.5, dy = 0.5) => [pos[k][0] + bw * dx, pos[k][1] + bh * dy];
  const liga = (a, b, opcional) => { const [x1, y1] = centro(a, a === "Yoshi's House" ? 1 : 1, 0.5), [x2, y2] = centro(b, 0, 0.5); s += `<path d="M${x1} ${y1} C${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}" fill="none" stroke="${opcional ? P.cinza : P.serie}" stroke-width="3"${opcional ? ' stroke-dasharray="6 5"' : ''}/>`; };
  liga("Yoshi's House", "Yoshi's Island 1", true); liga("Yoshi's Island 1", 'Yellow Switch Palace', true);
  liga("Yoshi's House", "Yoshi's Island 2", false); liga("Yoshi's Island 2", "Yoshi's Island 3", false); liga("Yoshi's Island 3", "Yoshi's Island 4", false);
  s += `<path d="M${pos["Yoshi's Island 4"][0] + bw / 2} ${pos["Yoshi's Island 4"][1]} V${pos["#1 Iggy's Castle"][1] + bh}" stroke="${P.serie}" stroke-width="3"/>`;
  for (const [k, [x, y]] of Object.entries(pos)) {
    const f = M[k], opcional = !f.obrigatoria && k !== "Yoshi's House";
    s += `<g><title>${esc(k)}: ${esc(f.comoEnsina)}</title><rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="8" fill="${P.painel}" stroke="${opcional ? P.cinza : P.serie}" stroke-width="2"${opcional ? ' stroke-dasharray="6 4"' : ''}/></g>`;
    s += txt(P, x + 12, y + 22, k, { peso: 'bold', tam: 12 });
    quebra(curto[k], 27).slice(0, 3).forEach((l, i) => { s += txt(P, x + 12, y + 42 + i * 15, l, { tam: 11 }); });
    for (let i = 0; i < f.dicas; i++) s += balao(P, x + bw - 18 - i * 22, y + 18, P.serie);
    s += `<circle cx="${x + 18}" cy="${y + bh - 18}" r="6" fill="${P.ok}"/>` + txt(P, x + 30, y + bh - 14, rede[k], { tam: 10, cor: P.suave });
  }
  s += txt(P, 748 + bw / 2, 60, '→ Donut Plains', { tam: 11, ancora: 'middle', cor: P.suave });
  const ly = H - 40;
  s += balao(P, 48, ly - 2, P.serie) + txt(P, 62, ly + 2, 'dica opcional (bloco de mensagem)', { tam: 11 });
  s += `<circle cx="296" cy="${ly - 2}" r="6" fill="${P.ok}"/>` + txt(P, 308, ly + 2, 'rede de segurança', { tam: 11 });
  s += `<line x1="440" y1="${ly - 2}" x2="476" y2="${ly - 2}" stroke="${P.cinza}" stroke-width="3" stroke-dasharray="6 5"/>` + txt(P, 484, ly + 2, 'caminho opcional', { tam: 11 });
  s += `<line x1="610" y1="${ly - 2}" x2="646" y2="${ly - 2}" stroke="${P.serie}" stroke-width="3"/>` + txt(P, 654, ly + 2, 'caminho obrigatório', { tam: 11 });
  s += txt(P, 40, H - 12, 'Esquema, sem a forma real do mapa. Dados: Super Mario Wiki (páginas de cada fase e "Tourist Tips"). Super Mario World © Nintendo.', { cor: P.suave, tam: 11 });
  return s + '</svg>';
}

// 3. Os quatro tempos de uma fase
function quatroTempos(P) {
  const W = 960, H = 380, bw = 205, bh = 170, gap = 18, y = 80;
  const T = [
    ['1. Apresentar', 'A ideia nova aparece num lugar seguro, sem pressa e sem castigo', P.ok],
    ['2. Desenvolver', 'A mesma ideia volta, num arranjo um pouco mais difícil', P.serie],
    ['3. Reviravolta', 'A ideia é usada de um jeito inesperado: a surpresa que o Miyamoto pede para planejar', P.destaque],
    ['4. Concluir', 'O jogador mostra que domina a ideia, e a fase termina', P.serie],
  ];
  let s = abre(W, H, P, 'Quatro caixas em sequência: apresentar a ideia num lugar seguro, desenvolver com mais dificuldade, uma reviravolta inesperada e a conclusão em que o jogador mostra domínio');
  s += titulo(P, 'Os quatro tempos de uma fase', 'como a Nintendo descreve a fase de uma ideia só (Koichi Hayashida, 2012, a partir do Miyamoto e dos quadrinhos de quatro quadros)');
  T.forEach(([t, d, cor], i) => {
    const x = 40 + i * (bw + gap);
    s += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="8" fill="${P.painel}" stroke="${cor}" stroke-width="2"/>`;
    s += `<rect x="${x}" y="${y}" width="${bw}" height="8" rx="4" fill="${cor}"/>`;
    s += txt(P, x + 14, y + 36, t, { peso: 'bold', tam: 14 });
    quebra(d, 26).forEach((l, k) => { s += txt(P, x + 14, y + 62 + k * 17, l, { tam: 12 }); });
    if (i < 3) s += txt(P, x + bw + gap / 2, y + bh / 2 + 6, '›', { tam: 22, ancora: 'middle', cor: P.suave });
  });
  s += txt(P, 40, y + bh + 36, 'No Super Mario World (leitura nossa, não dos criadores): a Donut Plains 1 entrega a capa por inimigos que a deixam cair, oferece uma sala', { tam: 12 });
  s += txt(P, 40, y + bh + 54, 'com 500 moedas para treinar o voo e, no fim, avisa que fases com ponto vermelho têm uma segunda saída, que o voo ajuda a achar.', { tam: 12 });
  s += txt(P, 40, H - 12, 'Fontes: Game Developer, "The secret to Mario level design" (13/04/2012); Super Mario Wiki, "Donut Plains 1". Esquema conceitual.', { cor: P.suave, tam: 11 });
  return s + '</svg>';
}

// 4. As redes de segurança: errar custa pouco, em camadas
function redes(P) {
  const W = 960, H = 470;
  const C = [
    ['Levou um golpe', 'O cogumelo, a flor ou a capa absorvem o golpe: Mario só encolhe', 'power-up'],
    ['Encolheu', 'O item guardado na caixa do alto cai sozinho na tela', 'reserva'],
    ['Montado no Yoshi', 'Um golpe derruba o Yoshi, que foge; dá para alcançá-lo de novo', 'Yoshi'],
    ['Perdeu uma vida', 'Volta ao mapa e recomeça a fase, ou do portão do meio, que ainda transforma Mario pequeno em grande', 'meio da fase'],
    ['Perdeu todas', 'Continua do último ponto em que o jogo salvou (por exemplo, depois de um palácio) com 5 vidas novas', 'continue'],
    ['Travou numa fase', 'Os palácios dos botões enchem blocos com cogumelos e plataformas em dezenas de fases; vidas extras sobram', 'ajuda conquistada'],
  ];
  let s = abre(W, H, P, 'Seis camadas de rede de segurança no Super Mario World, do golpe que só encolhe Mario até a ajuda conquistada nos palácios dos botões');
  s += titulo(P, 'Errar custa pouco, em camadas', 'o que acontece em cada nível de erro no Super Mario World (esquema)');
  C.forEach(([q, o, rot], i) => {
    const y = 76 + i * 58, x = 40 + i * 18, w = 880 - i * 36;
    s += `<rect x="${x}" y="${y}" width="${w}" height="48" rx="6" fill="${P.painel}" stroke="${i < 3 ? P.ok : i < 5 ? P.serie : P.destaque}" stroke-width="2"/>`;
    s += txt(P, x + 14, y + 20, q, { peso: 'bold', tam: 12 }) + txt(P, x + 14, y + 37, o, { tam: 12 });
    s += txt(P, x + w - 12, y + 20, rot, { tam: 11, cor: P.suave, ancora: 'end' });
  });
  s += txt(P, 40, H - 32, 'O que não existe: nenhuma oferta de ajuda depois de errar muitas vezes. Isso só chegou à série em 2009 (seção 7 do documento).', { tam: 12 });
  s += txt(P, 40, H - 12, 'Fonte: Super Mario Wiki ("Super Mario World", "Midway Gate", "Switch Palace"). Super Mario World © Nintendo; esquema para estudo.', { cor: P.suave, tam: 11 });
  return s + '</svg>';
}

// 5. Ajuda depois do erro: quando cada jogo oferece ajuda
function ajuda(P) {
  const W = 960, H = 400, x0 = 300, x1 = 900, max = 16, y0 = 92;
  const X = (v) => x0 + (v / max) * (x1 - x0);
  const L = [
    ['Super Mario World (1990)', [], 'nenhuma: só dicas fixas e opcionais', P.cinza],
    ['New Super Mario Bros. Wii (2009)', [[8, 'Super Guide']], 'testaram no menu, 3, 5 e 10; ficou 8', P.serie],
    ['Super Mario 3D Land (2011)', [[5, 'folha invencível'], [10, 'P-Wing']], 'planejado 8 e 16; Tezuka pediu 5', P.serie],
    ['Geometry Dash (2013)', [[2, 'uma frase']], 'só nas fases 1 e 3', P.serie],
    ['Resgate Espacial hoje', [], 'nenhuma oferta de ajuda (D-031)', P.destaque],
  ];
  let s = abre(W, H, P, 'Gráfico: depois de quantos erros cada jogo oferece ajuda; o Super Mario World e o Resgate Espacial não oferecem, o New Super Mario Bros. Wii oferece depois de 8 vidas, o Super Mario 3D Land depois de 5 e de 10, o Geometry Dash depois de 2 batidas');
  s += titulo(P, 'Ajuda só depois do erro', 'depois de quantas vidas perdidas na mesma fase cada jogo oferece ajuda');
  for (const v of [0, 2, 4, 6, 8, 10, 12, 14, 16]) s += `<line x1="${X(v)}" y1="${y0 - 10}" x2="${X(v)}" y2="${y0 + L.length * 52 - 20}" stroke="${P.linha}" stroke-width="1"/>` + txt(P, X(v), y0 + L.length * 52 - 4, v, { cor: P.suave, tam: 11, ancora: 'middle' });
  s += txt(P, x1, y0 + L.length * 52 + 12, 'vidas perdidas →', { cor: P.suave, tam: 11, ancora: 'end' });
  L.forEach(([j, pts, nota, cor], i) => {
    const y = y0 + i * 52;
    s += txt(P, 40, y + 5, j, { peso: 'bold', tam: 12 }) + txt(P, 40, y + 21, nota, { tam: 11, cor: P.suave });
    s += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${P.linha}" stroke-width="6" stroke-linecap="round"/>`;
    if (!pts.length) s += txt(P, x0 + 10, y - 9, 'nunca oferece', { tam: 11, cor });
    for (const [v, r] of pts) s += `<circle cx="${X(v)}" cy="${y}" r="8" fill="${cor}"/>` + txt(P, X(v), y - 14, r, { tam: 11, ancora: 'middle' });
  });
  s += txt(P, 40, H - 12, 'Fontes: Iwata Asks (New Super Mario Bros. Wii, 2009; Super Mario 3D Land, 2011); Geometry Dash Wiki; registro de decisões do projeto (D-031).', { cor: P.suave, tam: 11 });
  return s + '</svg>';
}

module.exports = { dicas, primeiroMundo, quatroTempos, redes, ajuda, CLARO, TEMA };

if (require.main === module) {
  const OUT = path.resolve(process.argv[2] || path.join(__dirname, 'saida'));
  fs.mkdirSync(OUT, { recursive: true });
  for (const [nome, f] of Object.entries({ dicas, 'primeiro-mundo': primeiroMundo, 'quatro-tempos': quatroTempos, redes, ajuda })) fs.writeFileSync(path.join(OUT, nome + '.svg'), f(CLARO));
  console.log('Diagramas em', OUT);
}
