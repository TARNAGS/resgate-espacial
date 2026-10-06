// Gera a página de leitura do benchmark do GraviTron e do Gravitron 2 (saida/pagina-de-leitura.html),
// a partir de fases.json. As imagens são referenciadas pelo nome e ficam na mesma pasta da página.
// Uso: node montar-pagina.js [pasta de saída]
const fs = require('fs');
const path = require('path');
const OUT = path.resolve(process.argv[2] || path.join(__dirname, 'saida'));
const d = JSON.parse(fs.readFileSync(path.join(OUT, 'fases.json')));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const n = (v) => Number(v).toLocaleString('pt-BR');

// Textos de cada fase (os mesmos do documento gravitron.md)
const G2_TXT = {
  'Ediruma 5': ['Terreno aberto, sem caverna: reator no alto de um morro, dois cientistas no vale, um posto e uma torre.', 'Só pilotar, pousar para resgatar, atirar no reator e subir.', 'A primeira fase põe os quatro elementos do jogo à vista, cada um numa parte do terreno.'],
  Goruwabi: ['Um poço desce até o reator, com dois cientistas no fundo; o posto e um checkpoint ficam na superfície.', 'A primeira descida, com duas torres nas paredes do poço. A fuga é subir pelo mesmo caminho.', 'O primeiro "ir e voltar" vertical, o desenho básico de todas as fases seguintes.'],
  Wojunew: ['O reator fica numa câmara lateral, atrás de um laser vertical; o combustível está numa plataforma que sobe e desce.', 'Atravessar o laser na hora em que ele desliga e lidar com o primeiro tanque.', 'Duas novidades com tempo (laser e elevador), apresentadas sem pressa, numa fase pequena.'],
  Quintus: ['A caverna central inteira gira em volta do reator, levando junto torres e um laser.', 'Entrar e pousar num terreno que se move.', 'Uma mecânica nova, que muda o jeito de pilotar, logo na quarta fase.'],
  Kyaomh: ['Um corredor com três lasers em sequência leva ao reator; três cientistas espalhados pela superfície.', 'Ritmo: passar pelos três lasers no tempo certo, na ida e na fuga.', 'Repetir o laser da fase 3 em série cria um trecho com identidade. É a última fase da demo.'],
  Ebayano: ['Um poço em zigue-zague desce até o reator, com dois cientistas no meio do caminho.', 'Três tanques patrulham os patamares, e a fuga é uma subida longa.', 'A dificuldade vem da distância e da patrulha, sem elemento novo.'],
  Alece: ['Um anel giratório no meio do mapa, com torres e um cientista dentro; o reator fica na caverna da direita, atrás de um laser.', '23 torres e quatro tanques. O botão que controla o laser fica dentro do anel que gira.', 'O interruptor está num lugar difícil, e a recompensa (o cientista) fica no mesmo lugar.'],
  Vesea: ['Três reatores no fundo; três grandes blocos de terreno sobem e descem em poços verticais, como elevadores.', 'Fileiras de torres no teto dos corredores, pares de lasers e dois mísseis na superfície.', 'O terreno que anda muda o caminho: o mesmo poço está aberto ou fechado conforme o elevador.'],
};
const G2_EXTRA = {
  'Vlea-Ealiu': 'O reator fica numa ilha flutuante, protegido por dois jatos que empurram a nave para baixo. Um jato serve de escudo.',
  Inui: 'Dois reatores em dois poços separados; os cientistas ficam no fundo de um deles, ao lado de um laser.',
  Uworu: 'Os dois reatores ficam numa gaiola que anda, forrada de torres por dentro, atrás de uma parede de blocos destrutíveis.',
  Eizyia: 'Superfície longa, com torres no alto de pilares e pulgas; um túnel leva a um tambor giratório com tanques, e o reator fica atrás dele.',
  Sewari: 'Um poço aberto; no fundo, uma gaiola que sobe e desce com dois reatores e 14 tanques. O alvo se move.',
  'Aomaic II': 'Um poço de 4.768 unidades de altura, com minas, pulgas, jatos de lado e ilhas giratórias; os cientistas estão numa delas.',
  Tethia: 'Labirinto de lasers: 42 deles forrando os túneis e uma caverna giratória com lasers dentro. Ilhas que andam no céu levam cientistas.',
  Asylum: 'Fortaleza simétrica com 17 caixas de torres que andam e 160 torres; os três reatores ficam numa gaiola giratória no fundo. Primeiro grande pico.',
  Tuvip: 'Três anéis giratórios, cada um com um reator e minas por dentro; uma cerca de 15 lasers e elevadores longos.',
  'Ura 4': 'Cinco discos enormes que giram, encaixados; lasers girando dentro deles e cientistas presos lá dentro.',
  Gohine: 'O miolo do mapa é uma floresta de blocos destrutíveis, abertos a tiro; 137 torres, 31 tanques e um campo de minas.',
  Zebes: 'Uma teia de lasers cruzados com minas, e um anel de 16 casulos de torres girando em volta de quatro reatores.',
  Garajida: 'O planeta inteiro gira. Oito cruzes giratórias carregam 32 reatores. A maior fase: 5.024 × 6.040 e 1.172 segmentos.',
  'Suon X': 'Um labirinto quadrado dentro de uma peça que gira, com 58 lasers nos corredores e os reatores num núcleo guardado por lasers.',
};
const G1_TXT = {
  CAENTHAE: 'Um vale aberto: reator no fundo, dois space-men numa encosta, um combustível e três torres.',
  KRIAR: 'A primeira caverna, fechada por um campo de força que se desliga com um botão; os space-men estão no fundo, junto do reator.',
  YCARON: 'Duas câmaras, um reator em cada, com enxames no ar e campos de força entre elas.',
  KEWURUI: 'Uma caverna em U com três reatores e uma estrutura em forma de foguete que se move.',
  JUKIRI: 'Uma plataforma que gira na entrada e quatro botões para os campos de força.',
  ABOTEMU: 'Um anel giratório com torres e um space-man dentro; sete space-men espalhados e nenhum combustível.',
  'IGEA PRIME': 'Duas cavernas, cada uma com um reator no fundo e um enxame no meio.',
  'EOPPON 8': 'Superfície com 19 árvores; caverna em serpentina com objetos flutuantes e um campo de força com botão.',
  KLENDARTH: 'Um portão giratório no meio, três campos de força em sequência e um leque de três lasers saindo de um ponto.',
  EXCAVATION: 'Andaimes de mina: um poço central com oito campos de força em escada e um anel giratório.',
  CLOCKWORK: 'Engrenagens: duas rodas giratórias empilhadas e uma ampulheta cheia de inimigos sobre o reator; dez space-men.',
  CHRONOK: 'Uma torre com três caixas giratórias de torres; o reator fica no alto, cercado por 22 inimigos no ar.',
  CASTLE: 'O terreno desenha um castelo. Um túnel com quatro campos de força leva às masmorras, com três reatores em rodas giratórias.',
  UNDECIMUS: 'Uma bússola gigante que gira, com o reator no centro, e uma balança giratória cheia de torres.',
  'KA-HU ALPHA': 'Torres que sobem e descem, um corredor com seis campos de força e dois reatores em berços giratórios.',
  BERG: 'Uma montanha com 47 árvores e cavernas com 13 space-men e três reatores.',
  QUARTUS: 'Um poço vertical com uma coluna de 48 inimigos no ar; um anel giratório com dois reatores e um laser atravessado.',
  ARACHON: 'Quatro reatores, cada um dentro de uma pequena caixa giratória de torres; elevadores e plataformas giratórias.',
  ANDROS: 'Uma roda gigante com a caverna dentro (a ideia da fase 4 do Gravitron 2), três reatores e 17 campos de força.',
  LECEROA: 'A maior fase: quatro rodas de torres, uma coluna de seis casulos giratórios e um disco giratório com o reator.',
  FIVIUM: 'Três grandes rodas giratórias encostadas, cada uma com um reator no centro.',
  TERTIUS: 'Uma roda gigante de dois anéis com dois reatores, e um corredor de inimigos no ar.',
  SIGMA: 'Onze discos giratórios, um enxame de inimigos dentro de um disco e estruturas em forma de foguete.',
};

const mapa = (arq, alt) => `<a class="map" href="${arq}.png" target="_blank" rel="noopener"><img src="${arq}.png" alt="${esc(alt)}" loading="lazy"></a>`;
const g2 = d.gravitron2;
const principal = g2.filter((f) => f.campanha === 'principal');
const extra = g2.filter((f) => f.campanha === 'extra');
const instr = g2.find((f) => f.campanha === 'instruções');
const perigos = (f) => f.torres + f.tanques + f.voadores + f.minas + f.misseis + f.lasers;
const mecs = (f) => f.jatos + f.blocos + f.botoes + f.giram + f.andam;

// Gráfico em SVG embutido, com as cores do tema
function grafico() {
  const W = 960, H = 330, base = 270, topo = 40, ph = base - topo;
  const paineis = [
    { t: 'Campanha principal', x0: 44, x1: 330, max: 40, passo: 10, f: principal.filter((x) => x.n) },
    { t: 'Campanha extra', x0: 392, x1: 948, max: 400, passo: 100, f: extra },
  ];
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Perigos e mecanismos por fase no Gravitron 2, em dois painéis com escalas diferentes">`;
  for (const p of paineis) {
    const y = (v) => base - (Math.min(v, p.max * 1.05) / p.max) * ph;
    s += `<text x="${p.x0}" y="22" class="ptitle">${p.t}</text>`;
    for (let v = 0; v <= p.max; v += p.passo) s += `<line x1="${p.x0}" x2="${p.x1}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${p.x0 - 6}" y="${y(v) + 4}" class="tick" text-anchor="end">${v}</text>`;
    const bw = (p.x1 - p.x0) / p.f.length;
    p.f.forEach((f, i) => {
      const a = perigos(f), b = mecs(f), x = p.x0 + i * bw + bw * 0.2, w = bw * 0.6, tot = a + b;
      s += `<g class="bar"><title>Fase ${f.n} (${esc(f.nome)}): ${a} perigos e ${b} mecanismos</title>`;
      s += `<rect x="${x}" y="${y(a)}" width="${w}" height="${base - y(a)}" class="s1"/>`;
      if (b) s += `<rect x="${x}" y="${y(tot)}" width="${w}" height="${y(a) - y(tot)}" class="s2"/>`;
      s += `<text x="${x + w / 2}" y="${y(tot) - 5}" class="peak" text-anchor="middle">${tot}</text>`;
      s += `<text x="${x + w / 2}" y="${base + 16}" class="tick" text-anchor="middle">${f.n}</text></g>`;
    });
    s += `<line x1="${p.x0}" x2="${p.x1}" y1="${base}" y2="${base}" class="axis"/>`;
  }
  s += `<text x="187" y="${H - 10}" class="tick" text-anchor="middle">fase (1 a 5 = demo)</text><text x="670" y="${H - 10}" class="tick" text-anchor="middle">fase (ordem do pacote)</text>`;
  return s + '</svg>';
}

const fichaG2 = (f) => `<dl class="ficha">
  <div><dt>Tamanho</dt><dd>${n(f.largura)} × ${n(f.altura)}</dd></div>
  <div><dt>Reatores · cientistas</dt><dd>${f.reatores} · ${f.tripulantes}</dd></div>
  <div><dt>Combustível · checkpoints</dt><dd>${f.combustivel} · ${f.checkpoints}</dd></div>
  <div><dt>Torres · tanques</dt><dd>${f.torres} · ${f.tanques}</dd></div>
  <div><dt>Lasers · no ar</dt><dd>${f.lasers} · ${f.voadores + f.minas + f.misseis}</dd></div>
  <div><dt>Gira · anda</dt><dd>${f.giram} · ${f.andam}</dd></div>
  <div><dt>Profundidade</dt><dd>${n(f.profundidade)}</dd></div>
</dl>`;

const fasesPrincipal = principal.map((f) => {
  const [obj, des, ideia] = G2_TXT[f.nome];
  const num = f.n ? String(f.n).padStart(2, '0') : '?';
  return `<article class="fase" id="g2-${f.arquivo}">
  <div class="fase-head"><span class="fase-num">${num}</span><h3>${esc(f.nome)}</h3>${f.n ? (f.n <= 5 ? '<span class="fase-tag">demo</span>' : '') : '<span class="fase-tag">posição desconhecida</span>'}</div>
  ${mapa(f.arquivo, `Mapa esquemático da fase ${f.nome} do Gravitron 2`)}
  <div class="fase-body">${fichaG2(f)}<div class="notes"><p><b>Objetivo e rota.</b> ${esc(obj)}</p><p><b>Desafio.</b> ${esc(des)}</p><p class="idea"><b>Ideia de design.</b> ${esc(ideia)}</p></div></div>
</article>`;
}).join('\n');

const fasesExtra = extra.map((f) => `<article class="mini" id="g2-${f.arquivo}">
  <div class="fase-head"><span class="fase-num">${String(f.n).padStart(2, '0')}</span><h3>${esc(f.nome)}</h3><span class="fase-tag">${perigos(f)} perigos · ${f.reatores} reator${f.reatores > 1 ? 'es' : ''}</span></div>
  ${mapa(f.arquivo, `Mapa esquemático da fase ${f.nome} do Gravitron 2`)}
  <p class="idea">${esc(G2_EXTRA[f.nome])}</p>
</article>`).join('\n');

const fasesG1 = d.gravitron1.map((f) => `<figure class="g1">
  ${mapa(f.arquivo, `Mapa esquemático da fase ${f.nome} do GraviTron`)}
  <figcaption><span class="mono">${String(f.ordem).padStart(2, '0')} · ${esc(f.nome)} · senha ${esc(f.senha)}</span><br>${esc(G1_TXT[f.nome])}</figcaption>
</figure>`).join('\n');

const tabelaG1 = d.gravitron1.map((f) => `<tr><td>${f.ordem}</td><td>${esc(f.nome)}</td><td class="mono">${esc(f.senha)}</td><td>${f.reatores}</td><td>${f.tripulantes}</td><td>${f.combustivel}</td><td>${f.torres}</td><td>${f.voadores}</td><td>${f.lasers}</td><td>${f.giram} / ${f.andam}</td></tr>`).join('');

const levar = [
  ['Os tripulantes andam até a nave quando ela pousa na plataforma deles', 'Hoje os três embarcam ao pousar. Eles poderiam sair andando até a nave, um a um: deixa claro o que é o resgate e dá um segundo de tensão no pouso.', 'Regras, seção 6; D-031'],
  ['Resgate que conserta a nave ou vale pontos', 'Tripulantes extras, opcionais, fora da rota principal, que valem pontos ou uma estrela.', 'P-006 (#53)'],
  ['Fuga cronometrada depois do objetivo', 'Em fases especiais, a volta para a base vira uma corrida contra o relógio.', 'P-012 (#61), P-018 (#79)'],
  ['Uma ameaça que vem buscar a tripulação', 'Pressa no resgate sem inimigo que atira: um prazo para chegar à tripulação.', 'P-011 (#60)'],
  ['Terreno que gira e que anda', 'É a nossa lista de obstáculos móveis em proposta. Os Gravitron mostram uma fase inteira em volta de uma peça que gira.', 'P-011; regras, seção 9'],
  ['Lasers e jatos que ligam e desligam', 'Barreiras com ritmo, e jatos que empurram a nave, com ciclo de liga e desliga.', 'P-011, P-012'],
  ['Botões acionados com tiro', 'Não serve, porque não temos tiro. A versão nossa: pousar num botão ou passar por uma área.', 'P-011'],
  ['Pairar perto do posto já abastece', 'Alternativa ao pouso no posto: abastecer exige ficar parado no ar.', 'D-023, D-026 (#93)'],
  ['Bater não mata: a nave quica e perde energia', 'Um modo "casco reforçado" para o jogador casual, com quique fraco para não virar caos nos corredores.', 'D-027, D-028, P-012'],
  ['Relógio de bônus que encolhe, mais o que sobrou', 'Referência para a pontuação: tempo mais recursos. O relógio cresce com o tamanho da fase.', 'P-006 (#53)'],
  ['Uma novidade por fase, pequena e depois em série', 'Confirma o padrão do Crazy Gravity para a curva de cada mundo.', 'Documento 08'],
  ['Fase 1 com tudo à vista; instruções acrescentadas depois', 'Valida a D-031, com um alerta: o Gravitron 2 precisou pôr uma página de instruções na v1.7. Medir se a DEMO basta.', 'D-031 (#104)'],
  ['Placar num servidor próprio, que morreu', 'Para o lançamento, preferir os rankings do Game Center e do Google Play Games.', 'P-019 (#101), #98'],
  ['O 1 grátis, o 2 por US$ 5, demo de 5 fases, expansões grátis', 'Mais um caso do modelo lite: algumas fases grátis e o resto pago.', 'P-014 (#98)'],
  ['A campanha difícil selecionada por padrão', 'O padrão do menu precisa ser o caminho mais fácil.', 'D-028, D-031'],
  ['O controle é a maior reclamação', 'Valida o tempo investido no controle de toque.', 'D-006, D-022'],
].map(([a, b, c]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td><td class="mono">${esc(c)}</td></tr>`).join('');

const t = (k) => g2.filter((f) => f.campanha !== 'instruções').reduce((s, f) => s + f[k], 0);

const html = `<title>Gravitron 1 e 2</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
<style>
/* Layout: coluna de leitura de 46rem com mapas em largura cheia; mesma família da página do Crazy Gravity, com o neon vetorial dos Gravitron como destaque */
:root {
  --bg: #f2f4f8; --surface: #ffffff; --fg: #111827; --muted: #4e5a6e; --line: #d5dbe5;
  --accent: #0e7490; --neon: #a21caf; --map: #0d1322;
  --reator: #c9302c; --trip: #a16207; --comb: #16884a;
  --s1: #d9581f; --s2: #2a6fd0;
  --display: "Barlow Condensed", "Arial Narrow", "Roboto Condensed", sans-serif;
  --body: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, Consolas, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #090d16; --surface: #101827; --fg: #e6ebf3; --muted: #9aa7bc; --line: #222f46;
  --accent: #5fd4ee; --neon: #e879f9; --map: #0d1322;
  --reator: #ff6b66; --trip: #facc15; --comb: #3fd081;
  --s1: #f0782f; --s2: #4f8fe8; color-scheme: dark; } }
:root[data-theme="dark"] {
  --bg: #090d16; --surface: #101827; --fg: #e6ebf3; --muted: #9aa7bc; --line: #222f46;
  --accent: #5fd4ee; --neon: #e879f9; --map: #0d1322;
  --reator: #ff6b66; --trip: #facc15; --comb: #3fd081;
  --s1: #f0782f; --s2: #4f8fe8; color-scheme: dark; }
* { box-sizing: border-box; }
body { background: var(--bg); color: var(--fg); font-family: var(--body); font-size: 1rem; line-height: 1.6; padding-inline: 16px; padding-block: 0 4rem; }
.wrap { max-width: 46rem; margin-inline: auto; }
.wide { max-width: 64rem; margin-inline: auto; }
h1, h2, h3 { font-family: var(--display); text-wrap: balance; line-height: 1.05; margin: 0; letter-spacing: 0.01em; }
h2 { font-size: clamp(1.9rem, 4vw, 2.4rem); margin-block: 3.5rem 0.75rem; }
h2 + .sub { margin-top: -0.4rem; }
p { margin: 0 0 0.9rem; }
a { color: var(--accent); }
a:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.eyebrow { font-family: var(--mono); font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
.mono { font-family: var(--mono); font-size: 0.85em; }
header.hero { padding-block: 3rem 1.5rem; display: grid; gap: 1rem; }
.hero h1 { font-size: clamp(3.2rem, 11vw, 6.5rem); font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; }
.hero h1 span { color: var(--neon); }
.lede { font-size: 1.15rem; color: var(--muted); max-width: 40rem; }
.facts { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; font-family: var(--mono); font-size: 0.85rem; color: var(--muted); font-variant-numeric: tabular-nums; }
.facts b { color: var(--fg); font-weight: 500; }
.map { display: block; background: var(--map); border-radius: 6px; overflow: hidden; border: 1px solid var(--line); }
.map img { display: block; width: 100%; height: auto; }
figcaption, .caption { font-size: 0.85rem; color: var(--muted); margin-top: 0.5rem; }
.chips { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-block: 1rem; }
.chips a { font-family: var(--mono); font-size: 0.8rem; text-decoration: none; color: var(--fg); border: 1px solid var(--line); background: var(--surface); padding: 0.15rem 0.45rem; border-radius: 4px; }
.chips a:hover { border-color: var(--accent); color: var(--accent); }
.table-wrap { overflow-x: auto; margin-block: 1rem 1.5rem; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); }
table { border-collapse: collapse; width: 100%; font-size: 0.9rem; font-variant-numeric: tabular-nums; }
th, td { text-align: left; padding: 0.55rem 0.7rem; border-bottom: 1px solid var(--line); vertical-align: top; }
th { font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); font-weight: 500; }
thead th { white-space: nowrap; }
tr:last-child td { border-bottom: 0; }
.num td:nth-child(n+4) { text-align: right; }
.chart-box { background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 1rem; margin-block: 1rem; overflow-x: auto; }
.legend { display: flex; flex-wrap: wrap; gap: 0.4rem 1.2rem; font-size: 0.85rem; color: var(--muted); margin-bottom: 0.5rem; }
.legend i { display: inline-block; width: 0.8rem; height: 0.8rem; border-radius: 2px; margin-right: 0.4rem; vertical-align: -0.05rem; }
.chart { width: 100%; min-width: 34rem; height: auto; display: block; }
.chart .grid { stroke: var(--line); } .chart .axis { stroke: var(--muted); }
.chart .tick { fill: var(--muted); font: 11px var(--mono); } .chart .peak { fill: var(--fg); font: 600 11px var(--mono); }
.chart .ptitle { fill: var(--fg); font: 600 13px var(--body); }
.chart .s1 { fill: var(--s1); } .chart .s2 { fill: var(--s2); }
.chart .bar:hover rect { opacity: 0.8; }
ul.points { padding-left: 1.2rem; margin: 0 0 1rem; } ul.points li { margin-bottom: 0.45rem; }
.fase { margin-block: 2.75rem; display: grid; gap: 0.9rem; }
.fase-head { display: flex; align-items: baseline; flex-wrap: wrap; gap: 0.4rem 0.9rem; }
.fase-num { font-family: var(--display); font-weight: 700; font-size: 2.6rem; line-height: 1; color: var(--muted); font-variant-numeric: tabular-nums; }
.fase-head h3 { font-size: 1.8rem; }
.fase-tag { font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--neon); }
.fase-body { display: grid; grid-template-columns: minmax(0, 14rem) minmax(0, 1fr); gap: 1.5rem; }
.ficha { margin: 0; display: grid; gap: 0.45rem; align-content: start; font-size: 0.88rem; }
.ficha div { display: grid; gap: 0.05rem; border-bottom: 1px solid var(--line); padding-bottom: 0.4rem; }
.ficha dt { font-family: var(--mono); font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.ficha dd { margin: 0; font-variant-numeric: tabular-nums; }
.notes { min-width: 0; }
.idea { border-left: 3px solid var(--neon); padding-left: 0.8rem; }
.mini { margin-block: 2.25rem; display: grid; gap: 0.7rem; }
.mini .fase-num { font-size: 2rem; } .mini h3 { font-size: 1.5rem; }
.g1grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr)); gap: 1.4rem 1.2rem; margin-block: 1.2rem; }
.g1 { margin: 0; min-width: 0; }
.g1 figcaption { font-size: 0.85rem; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.two > div { min-width: 0; background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 1rem 1.1rem; }
.two h3 { font-size: 1.35rem; margin-bottom: 0.5rem; }
.two ul { padding-left: 1.1rem; margin: 0; } .two li { margin-bottom: 0.5rem; }
.rescue { background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 1.1rem 1.2rem; display: grid; gap: 0.6rem; }
.rescue ol { margin: 0; padding-left: 1.3rem; } .rescue li { margin-bottom: 0.35rem; }
.note { font-size: 0.9rem; color: var(--muted); background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 0.8rem 1rem; }
footer { margin-top: 4rem; font-size: 0.85rem; color: var(--muted); }
@media (max-width: 640px) { .fase-body, .two { grid-template-columns: 1fr; } .fase-num { font-size: 2.1rem; } }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
</style>

<div class="wrap">
<header class="hero">
  <span class="eyebrow">Benchmark de level design e gameplay · Resgate Espacial · 06/10/2026</span>
  <h1>Gravi<span>tron</span> 1 e 2</h1>
  <p class="lede">A outra metade da memória: o jogo de onde vem o resgate de pessoas. Os dois Gravitron abertos por inteiro, com 22 fases do Gravitron 2 e 23 do GraviTron lidas direto dos arquivos e redesenhadas como mapas, e as regras tiradas do código que o próprio autor publicou.</p>
  <div class="facts"><span><b>2006</b> grátis · <b>2008</b> US$ 5</span><span><b>Dark Castle Software</b></span><span><b>${t('reatores')}</b> reatores</span><span><b>${t('tripulantes')}</b> cientistas</span><span><b>${n(t('torres'))}</b> torres</span><span><b>${t('lasers')}</b> lasers</span><span><b>${t('giram') + t('andam')}</b> partes que giram ou andam</span></div>
</header>
</div>
<div class="wide">${mapa('g2-principal-04-quintus', 'Mapa esquemático da fase 4 do Gravitron 2, com a caverna que gira')}</div>
<div class="wrap">
  <p class="caption">Gravitron 2, fase 4 (Quintus): a caverna inteira gira em volta do reator, a tracejado. Os mapas não são capturas de tela: são redesenhos esquemáticos, feitos a partir dos arquivos de fase, com uma cor por função. Toque num mapa para abrir em tamanho cheio.</p>
  <figure style="margin:1rem 0 0">${mapa('legenda', 'Legenda dos mapas: cor e símbolo de cada elemento')}<figcaption>Legenda dos mapas.</figcaption></figure>

  <nav aria-label="Seções" class="chips"><a href="#resumo">Resumo</a><a href="#resgate">O resgate</a><a href="#regras">Regras</a><a href="#mudou">1 → 2</a><a href="#curva">Curva</a><a href="#principal">Campanha principal</a><a href="#extra">Campanha extra</a><a href="#g1">GraviTron</a><a href="#padroes">Padrões</a><a href="#jogadores">Jogadores</a><a href="#levar">O que levar</a></nav>

  <h2 id="resumo">Em uma página</h2>
  <div class="table-wrap"><table>
    <thead><tr><th></th><th>GraviTron (2006)</th><th>Gravitron 2 (2008)</th></tr></thead>
    <tbody>
    <tr><th>Proposta</th><td>Destruir os reatores de cada setor, pegar combustível e resgatar os space-men</td><td>Destruir todos os reatores e fugir para o espaço em 60 segundos; resgatar cientistas é opcional</td></tr>
    <tr><th>Negócio</th><td>Grátis</td><td>US$ 5, com demo de 5 fases e expansões grátis; no Steam desde 31/08/2008</td></tr>
    <tr><th>Tamanho</th><td>23 fases de campanha, 3 de multijogador e o editor GravED</td><td>Mais de 40 fases na campanha principal e 14 na extra</td></tr>
    <tr><th>Diversão</th><td>Pilotar com inércia, atirar, planejar a ordem dos reatores</td><td>A fuga cronometrada, pousar em qualquer superfície plana, terreno que gira e anda</td></tr>
    <tr><th>Dificuldade</th><td>Torres em todas as paredes, enxames no ar, campos de força</td><td>Lasers que matam na hora, o relógio da fuga, o quique nos corredores, os controles</td></tr>
    <tr><th>Recepção</th><td>Pouca crítica registrada</td><td>27 de 32 avaliações positivas no Steam (84%); 3,5 de 5 na GamesRadar</td></tr>
    </tbody></table></div>

  <h2 id="resgate">O resgate, em detalhe</h2>
  <div class="rescue">
    <p>É a parte que ficou na memória do Fernando. No Gravitron 2, do jeito que o código faz:</p>
    <ol>
      <li>Os cientistas ficam andando de um lado para o outro na plataforma deles, e mudam de direção sozinhos de tempos em tempos.</li>
      <li>Quando a nave <b>pousa na mesma plataforma</b>, eles se viram para ela e <b>andam até a nave</b>, mais depressa.</li>
      <li>Ao chegar perto, embarcam: cada um conserta 15 de energia da nave e vale 250 pontos, e mais 100 no fim da fase.</li>
      <li>O resgate é <b>opcional</b>: o objetivo da fase são os reatores. Dá para terminar sem resgatar ninguém.</li>
      <li>No código existe um inimigo, o lander, que procura um cientista, voa até ele e o transforma num mutante.</li>
    </ol>
    <p>No GraviTron, os space-men andam pela superfície e o resgate vale pontos.</p>
  </div>

  <h2 id="regras">Como o Gravitron 2 funciona</h2>
  <ul class="points">
    <li><b>Física:</b> a gravidade puxa para baixo e o motor empurra com cinco vezes essa força; o ar freia a nave aos poucos. O mapa dá a volta na horizontal, e a nave nasce no espaço, acima do terreno.</li>
    <li><b>Combustível:</b> tanque de 300, que o motor gasta em 48 segundos de aceleração contínua. O escudo gasta do mesmo tanque. Para abastecer, basta <b>pairar ou pousar perto</b> de um posto.</li>
    <li><b>Batidas:</b> bater na parede <b>não mata</b>: a nave quica e perde energia proporcional à velocidade. Laser, esmagamento e qualquer dano sem combustível matam na hora.</li>
    <li><b>Pouso:</b> em qualquer superfície plana, até no teto, se a nave estiver alinhada. <b>A velocidade não importa.</b></li>
    <li><b>Fim da fase:</b> destruído o último reator (5 tiros, e ele se recupera se você parar de atirar), toca a sirene e começam <b>60 segundos</b> para subir até o espaço.</li>
    <li><b>Pontos:</b> um relógio de bônus começa em 1.000 × o número da fase e cai 25 por segundo; no fim, somam-se o bônus, o combustível e a energia que sobraram e os cientistas. 3 vidas, mais uma a cada 20.000 pontos; checkpoints desde a v1.2.</li>
  </ul>

  <h2 id="mudou">Do GraviTron para o Gravitron 2</h2>
  <div class="table-wrap"><table><tbody>
    <tr><th>Resgate</th><td>Space-men por pontos → cientistas que também consertam a nave</td></tr>
    <tr><th>Fim da fase</th><td>Destruir os reatores → destruir e fugir em 60 segundos</td></tr>
    <tr><th>Progresso</th><td>Senha por fase (EASY1, PARTY, SMOKE…) → checkpoints dentro da fase</td></tr>
    <tr><th>Elementos novos</th><td>Lasers com tempo, jatos, blocos destrutíveis, minas, mísseis, pulgas, varredores e landers</td></tr>
    <tr><th>Depois do lançamento</th><td>Checkpoints, menos consumo, postos mais fortes, relógio menor no começo e uma página de instruções: quase tudo facilitou ou esclareceu o jogo</td></tr>
  </tbody></table></div>

  <h2 id="curva">A curva do Gravitron 2</h2>
  <div class="chart-box">
    <div class="legend"><span><i style="background:var(--s1)"></i>Perigos (torres, tanques, no ar, lasers)</span><span><i style="background:var(--s2)"></i>Mecanismos (jatos, blocos, botões, partes que giram ou andam)</span></div>
    ${grafico()}
  </div>
  <p class="caption">As escalas dos dois painéis são diferentes (até 40 e até 400). Passe o mouse ou toque numa barra para ver o nome da fase.</p>
  <ul class="points">
    <li><b>Rampa suave, uma novidade por fase:</b> terreno aberto, primeira descida, laser e elevador, caverna que gira, três lasers seguidos. Os perigos sobem de 1 para 3, 7 e 11, e a fase 5 baixa para 7.</li>
    <li><b>A campanha extra é um serrote em outra escala:</b> picos nas fases 8, 11 e 13, com respiros depois de cada um.</li>
    <li><b>As fases ficam mais fundas do que largas</b>, e a fuga de 60 segundos fica mais apertada.</li>
  </ul>

  <h2 id="principal">Campanha principal</h2>
  <p class="sub">As 5 fases da demo, a fase 10 e duas outras da campanha (Alece e Vesea), cuja posição não está nos arquivos. As outras ficam só no jogo pago.</p>
</div>
<div class="wide">
${fasesPrincipal}
</div>
<div class="wrap">
  <h2 id="extra">Campanha extra</h2>
  <p class="sub">As 14 fases da atualização 1.8 (OfficialPack1), na ordem do pacote.</p>
</div>
<div class="wide">
${fasesExtra}
<article class="mini" id="g2-instrucoes"><div class="fase-head"><h3>Fase de instruções</h3><span class="fase-tag">v1.7</span></div>${mapa(instr.arquivo, 'Mapa esquemático da fase de instruções do Gravitron 2')}<p class="idea">Uma vitrine, sem perigo: cada elemento numa plataforma (reator, cientistas, combustível e checkpoint). Entrou depois do lançamento.</p></article>
</div>
<div class="wrap">
  <h2 id="g1">GraviTron (2006)</h2>
  <p>A ordem original não está nos arquivos: as senhas EASY1 e EASY2 indicam as duas primeiras, e as outras estão em ordem de quantidade de objetos. O código do jogo se perdeu, então o significado de alguns objetos foi deduzido pela posição: reatores, space-men, combustível e torres com segurança; os objetos no ar e alguns do chão, não.</p>
  <div class="table-wrap"><table class="num"><thead><tr><th>#</th><th>Fase</th><th>Senha</th><th>Reatores</th><th>Space-men</th><th>Comb.</th><th>Torres</th><th>No ar</th><th>Campos</th><th>Gira / anda</th></tr></thead><tbody>${tabelaG1}</tbody></table></div>
</div>
<div class="wide"><div class="g1grid">
${fasesG1}
</div></div>
<div class="wrap">
  <h2 id="padroes">Padrões de design</h2>
  <ul class="points">
    <li><b>Uma ideia por fase</b>, apresentada pequena e depois repetida em escala.</li>
    <li><b>Primeira fase com tudo à vista</b>, cada elemento num pedaço do terreno.</li>
    <li><b>Ida e volta vertical:</b> descer até o objetivo e fugir subindo.</li>
    <li><b>Fuga cronometrada</b> depois do objetivo: a volta vira o clímax.</li>
    <li><b>Resgate opcional com recompensa útil</b> (conserto e pontos).</li>
    <li><b>Recompensa dentro do perigo:</b> cientistas e botões dentro de anéis que giram ou ao lado de lasers.</li>
    <li><b>Terreno que se move</b> como mecânica principal, e <b>o alvo que se move</b> (reatores em gaiolas e cruzes).</li>
    <li><b>Perigo com ritmo:</b> lasers e jatos que ligam e desligam.</li>
    <li><b>Fase com tema no desenho do terreno</b> (castelo, relógio, mina), no GraviTron.</li>
    <li><b>Serrote:</b> pico, respiro e pico maior.</li>
  </ul>

  <h2>Diversão e dificuldade</h2>
  <div class="two">
    <div><h3>Onde estava a diversão</h3><ul><li>O quique: bater não mata, e a GamesRadar diz que isso deixa o jogo divertido.</li><li>A fuga de 60 segundos, com sirene e tela tremendo.</li><li>Pousar em qualquer lugar plano para resgatar.</li><li>Uma curva suave, mas firme.</li><li>Fases para jogar 10 minutos por vez e voltar depois.</li></ul></div>
    <div><h3>Onde estava a dificuldade</h3><ul><li>O mesmo quique, nos corredores: a nave bate de parede em parede.</li><li>Lasers que matam na hora.</li><li>Controles: mouse sensível demais, teclado pouco confortável.</li><li>A campanha extra, mais difícil, selecionada por padrão.</li><li>Escudo e motor no mesmo tanque.</li></ul></div>
  </div>

  <h2 id="jogadores">O que os jogadores diziam</h2>
  <ul class="points">
    <li><b>Steam:</b> 27 de 32 avaliações positivas, de 2010 a 2026. Elogiam o desafio justo, o desenho das fases, o visual neon e a fuga; criticam os controles, o quique nos corredores, o laser que mata na hora e o placar online fora do ar.</li>
    <li><b>GamesRadar:</b> 3,5 de 5. Uma ideia muito usada, executada de um jeito mais divertido do que deveria; o preço de US$ 5 é justo.</li>
    <li><b>VidaExtra (2008):</b> lembra o GraviTron como o jogo grátis que levou ao 2, e acha que o 2 muda pouco além de mais fases, da barra de energia e do mapa na tela.</li>
  </ul>

  <h2 id="levar">O que levar para o Resgate Espacial</h2>
  <p>Tudo aqui é <b>Proposta</b> para o Fernando decidir. Inspirar, nunca copiar: as ideias entram traduzidas para fases curtas, horizontais e sem tiros.</p>
  <div class="table-wrap"><table><thead><tr><th>Ideia dos Gravitron</th><th>Como poderia entrar</th><th>Ligado a</th></tr></thead><tbody>${levar}</tbody></table></div>
  <p class="note"><b>Diferença importante:</b> os Gravitron são jogos de tiro, com fases cheias de torres e o objetivo de destruir. O nosso não tem tiro, e as fases são corredores curtos da esquerda para a direita, para partidas de 2 minutos. Valem as ideias de resgate, de fuga, de terreno que se move e de perigo com ritmo; o combate e o tamanho das fases finais não.</p>

  <h2>Como este material foi feito</h2>
  <p>O site do autor está preservado no Internet Archive, com o GraviTron completo, a demo e a atualização 1.8 do Gravitron 2 e o código-fonte do 2, publicado pelo próprio autor em 2012. Só arquivos de dados e de código foram lidos: nenhum programa foi executado ou descompilado. O formato do Gravitron 2 vem do código; o do GraviTron foi deduzido dos arquivos, até as 26 fases fecharem exatamente. O documento completo, com a especificação dos formatos e as fontes, está no repositório, em <span class="mono">docs/benchmark/gravitron.md</span>.</p>
  <footer>GraviTron e Gravitron 2 © Dark Castle Software. Mapas esquemáticos redesenhados para estudo, sem copiar desenho de fase, arte ou som. Benchmark feito para o Resgate Espacial em 06/10/2026.</footer>
</div>
`;
fs.writeFileSync(path.join(OUT, 'pagina-de-leitura.html'), html);
console.log('Página gerada:', path.join(OUT, 'pagina-de-leitura.html'), Math.round(html.length / 1024) + ' KB');
