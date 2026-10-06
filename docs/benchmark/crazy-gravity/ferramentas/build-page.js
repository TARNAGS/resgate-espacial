// Gera a página de leitura do benchmark do Crazy Gravity (saida/pagina-de-leitura.html)
const fs = require('fs');
const d = JSON.parse(fs.readFileSync((process.argv[2] || 'saida') + '/fases.json'));

const fases = {
  1: { tag: 'shareware · fácil', rota: 'A base fica no alto, à esquerda; a carga (2 contêineres) e o posto (5 barris), embaixo. Dois portões de mão única formam um <strong>circuito</strong>: desce pelo poço do meio e volta subindo pelo poço da direita.', desafio: 'Aprender a decolar, voar e pousar. Com o porão de uma carga, são duas viagens. Três canhões verticais e um par de hastes entre a carga e o posto.', ideia: 'O circuito de mão única ensina a rota sem nenhum texto.' },
  2: { tag: 'shareware · média', rota: 'Corredor horizontal de 110 campos com a base no meio. Três cargas à esquerda e uma à direita; a chave amarela perto da base e a vermelha na ponta direita.', desafio: 'As cargas da esquerda ficam atrás de portões trancados, e a de baixo pede as duas chaves. É preciso cruzar o mapa inteiro, ida e volta, antes de começar a entregar.', ideia: 'Base no meio, chave numa ponta e carga na outra transformam um corredor simples numa viagem longa.' },
  3: { tag: 'shareware · difícil', rota: 'Caverna grande (65×55) com três cargas espalhadas, chaves verde e amarela embaixo e o posto no canto inferior esquerdo.', desafio: 'A fase mais densa até aqui: 10 canhões, 8 pares de hastes, ventiladores, ímãs, correntes de ar e um portão que pede as duas chaves. Primeira vida e primeiro turbo.', ideia: 'A versão de teste terminava com uma vitrine de tudo o que o jogo completo tinha.' },
  4: { tag: 'simétrica', rota: 'Fase simétrica, com a base no centro alto; chave azul à esquerda e amarela à direita; uma carga no meio e duas embaixo.', desafio: 'Os dois postos ficam nos cantos de baixo, atrás de portões que pedem as duas chaves. Sem as chaves, o combustível fica longe.', ideia: 'Depois do pico da fase 3, uma fase curta e legível. A simetria deixa a rota óbvia.' },
  5: { tag: 'corredor', rota: 'Corredor horizontal com a base à esquerda e as três cargas no alto da ponta direita. Três chaves: verde perto da base, vermelha no meio e amarela no fim.', desafio: 'A chave verde fica embaixo de uma fileira de 4 ímãs que puxam a nave para cima, e a vermelha fica entre ventiladores que sopram para baixo. Os portões trancados seguem a ordem do caminho.', ideia: 'A recompensa fica dentro da área do perigo, e pousar ali é o quebra-cabeça.' },
  6: { tag: 'respiro', rota: 'Caverna aberta em volta de uma ilha central. Base embaixo, no meio; 2 cargas em cada ponta; posto de 10 barris no alto.', desafio: 'Nenhum obstáculo, só dois portões trancados (vermelha e azul) e quatro viagens longas. O teste é pilotar e administrar o combustível.', ideia: 'Uma fase de respiro no meio da sequência, que muda o tipo de desafio em vez de só baixar a dificuldade.' },
  7: { tag: 'porão extra', rota: 'Base no alto, no centro, e 7 cargas em plataformas de 2 e 3 contêineres. Há dois extras de porão.', desafio: 'Pegar os porões muda a estratégia: com mais lugar, são menos viagens. Uma coluna de ventiladores à esquerda, ímãs ao lado da carga do alto à direita e 6 portões de mão única fazendo circuitos.', ideia: 'Um upgrade opcional que recompensa quem planeja.' },
  8: { tag: 'caça às chaves', rota: 'Corredor horizontal com a base à esquerda e as duas cargas no fim. Três portões em sequência: o primeiro pede a chave verde; o segundo, verde e amarela; o terceiro, vermelha, verde e amarela.', desafio: 'Não há obstáculos. É uma caça às chaves em cadeia: cada portão aberto dá acesso à próxima chave.', ideia: 'A própria estrutura ensina a ordem certa.' },
  9: { tag: '4 chaves', rota: 'A base no centro e cinco cargas espalhadas pelos cantos. É a primeira fase com as quatro chaves e com dois postos.', desafio: 'Escolher a ordem: que chave pegar, que carga buscar e quando abastecer. Ventiladores em colunas, um ímã e uma corrente de ar.', ideia: 'Base no centro como "hub", com braços para todos os lados.' },
  10: { tag: 'portão-mestre', rota: 'Base no centro, seis cargas, quatro chaves e dois postos.', desafio: '11 canhões, o maior número do jogo, incluindo um cruzamento de tiros à esquerda. O primeiro portão que pede as quatro chaves fica colado à base.', ideia: 'Um portão-mestre perto do começo, visível desde o início, que só abre no fim.' },
  11: { tag: 'forças laterais', rota: 'A base fica embaixo, à direita; quatro cargas e o posto no canto inferior esquerdo. É a fase com mais espaço aberto (61%).', desafio: 'No mesmo poço, ímãs puxam para a direita e ventiladores sopram para a esquerda, ao lado de portões de mão única. Mais três ímãs puxam para baixo perto de uma carga.', ideia: 'Com espaço livre, o desafio vem das forças, e não das paredes.' },
  12: { tag: 'trecho de hastes', rota: 'Base no centro, sete cargas, quatro chaves, um porão e uma vida.', desafio: 'Um corredor com 4 pares de hastes em sequência no alto, hastes em cruz embaixo, pares de correntes de ar e canhões em dupla.', ideia: 'Repetir o mesmo obstáculo em série cria um trecho com identidade própria.' },
  13: { tag: 'vertical', rota: 'Fase vertical (45×70): a base fica no alto, e as cargas, no fundo dos dois poços.', desafio: 'No poço da direita, um canhão atira de cima a baixo pela altura inteira, e é preciso descer no ritmo dos tiros. No da esquerda, colunas de ventiladores sopram para cima e ímãs puxam para o lado, bem em cima da vida extra.', ideia: 'Mudar a orientação muda o jogo: descer contra o vento e subir com carga são desafios diferentes.' },
  14: { tag: 'fase-chefe', rota: 'A maior fase (100×51): base no centro, oito cargas em quatro pontas (duas em cada), três postos com 27 barris e seis extras.', desafio: 'Oito portões trancados, vários pedindo três ou quatro chaves; um corredor de 6 pares de hastes; uma "caixa" de quatro canhões cruzando tiros, com ventiladores no meio. É o maior voo do jogo.', ideia: 'A fase-chefe junta tudo o que o jogador aprendeu e dá recursos à altura: porões, vidas e muito combustível.' },
  15: { tag: 'combustível curto', rota: 'Corredor horizontal curto, com as duas cargas na ponta direita e, no meio, um portão que pede as chaves vermelha e amarela.', desafio: 'Um único posto com só 3 barris, o menor do jogo, no meio de ventiladores, ímãs e correntes de ar.', ideia: 'Depois da fase-chefe, uma fase curta, mas com o combustível apertado.' },
  16: { tag: 'vertical', rota: 'Fase vertical, com a base no alto e as cargas embaixo; a chave azul, no fundo, abre o caminho da direita.', desafio: 'Canhões horizontais varrem os corredores, um deles logo acima da base, e ventiladores sopram para baixo no poço da esquerda.', ideia: 'O perigo começa já na saída da base.' },
  17: { tag: 'diagonais', rota: 'Túneis em diagonal. A base fica embaixo, à esquerda; quatro cargas e quatro chaves espalhadas. A carga mais distante fica a 135 campos da base, a maior distância do jogo.', desafio: 'Sete portões trancados com combinações diferentes (azul e amarela; verde; vermelha e verde) e um "liquidificador" de ventiladores e ímãs que alternam cima e baixo.', ideia: 'Túneis diagonais exigem voar inclinado o tempo todo, um uso novo da mesma física.' },
  18: { tag: 'final simétrico', rota: 'Fase simétrica: a base no centro, as quatro chaves nos quatro cantos e as quatro cargas atrás de portões que pedem todas as chaves.', desafio: 'Primeiro todas as chaves, depois todas as cargas. Um misturador de ímãs e ventiladores logo acima da base, canhões longos nas laterais e três vidas extras.', ideia: 'A prova final tem uma estrutura clara (coletar, abrir e entregar), e a dificuldade está na execução.' },
};

const pad = (n) => String(n).padStart(2, '0');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const fuelBy = { 4: '3 + 3', 9: '3 + 5', 10: '5 + 5', 12: '9 + 3', 14: '10 + 7 + 10', 16: '8 + 5', 18: '7 + 10' };

// gráfico (SVG inline, com cores dos tokens)
function chart() {
  const W = 720, H = 300, m = { l: 36, r: 8, t: 16, b: 34 };
  const pw = W - m.l - m.r, ph = H - m.t - m.b, max = 55, bw = pw / d.length;
  const y = (v) => m.t + ph - (v / max) * ph;
  const o = [`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Obstáculos e portões em cada uma das 18 fases">`];
  for (let v = 0; v <= 50; v += 10) o.push(`<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}"/><text class="tick" x="${m.l - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`);
  d.forEach((x, i) => {
    const ob = x.ventiladores + x.imas + x.correntes + x.canhoes + x.hastes, pt = x.portoesMaoUnica + x.portoesTrancados;
    const bx = m.l + i * bw + bw * 0.2, w = bw * 0.6;
    o.push(`<g class="bar"><title>Fase ${x.fase}: ${ob} obstáculos e ${pt} portões</title><rect class="hit" x="${m.l + i * bw}" y="${m.t}" width="${bw}" height="${ph}"/>`);
    if (ob) o.push(`<rect class="s1" x="${bx}" y="${y(ob)}" width="${w}" height="${y(0) - y(ob)}"/>`);
    o.push(`<path class="s2" d="M${bx} ${y(ob) - 2}V${y(ob + pt) + 4}q0 -4 4 -4h${w - 8}q4 0 4 4V${y(ob) - 2}z"/>`);
    if ([3, 6, 8, 14, 18].includes(x.fase)) o.push(`<text class="peak" x="${bx + w / 2}" y="${y(ob + pt) - 6}" text-anchor="middle">${ob + pt}</text>`);
    o.push(`<text class="tick" x="${bx + w / 2}" y="${H - 14}" text-anchor="middle">${x.fase}</text></g>`);
  });
  o.push(`<line class="axis" x1="${m.l}" x2="${W - m.r}" y1="${y(0)}" y2="${y(0)}"/></svg>`);
  return o.join('');
}

function faseCard(x) {
  const f = fases[x.fase];
  const ob = x.ventiladores + x.imas + x.correntes + x.canhoes + x.hastes;
  const items = [
    ['Tamanho', `${x.campos} campos`],
    ['Cargas', x.cargas],
    ['Combustível', `${x.postos} ${x.postos > 1 ? 'postos' : 'posto'}, ${fuelBy[x.fase] || x.barris} barris`],
    ['Chaves', x.chaves.length ? x.chaves.join(', ') : 'nenhuma'],
    ['Obstáculos', `${ob} <span class="sub">(${x.ventiladores} vent., ${x.imas} ímãs, ${x.correntes} corr., ${x.canhoes} canhões, ${x.hastes} hastes)</span>`],
    ['Portões', `${x.portoesMaoUnica} de mão única, ${x.portoesTrancados} trancados`],
    ['Extras', x.extras.length ? x.extras.map((e) => e.toLowerCase()).join(', ') : 'nenhum'],
  ];
  return `<section class="fase" id="fase-${x.fase}">
  <header class="fase-head"><span class="fase-num">${pad(x.fase)}</span><div><h3>${x.fase === 1 ? 'Sem senha' : esc(x.senha)}</h3><span class="fase-tag">${f.tag}</span></div></header>
  <a class="map" href="fase-${pad(x.fase)}.png" target="_blank" rel="noopener"><img src="fase-${pad(x.fase)}.png" alt="Mapa esquemático da fase ${x.fase} do Crazy Gravity"></a>
  <div class="fase-body">
    <dl class="ficha">${items.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
    <div class="notes"><p><b>Objetivo e rota.</b> ${f.rota}</p><p><b>Desafio.</b> ${f.desafio}</p><p class="idea"><b>Ideia de design.</b> ${f.ideia}</p></div>
  </div>
</section>`;
}

const tableRows = d.map((x) => `<tr><td>${x.fase}</td><td class="mono">${x.fase === 1 ? '—' : x.senha}</td><td>${x.campos}</td><td>${x.cargas}</td><td>${x.barris}</td><td>${x.chaves.length}</td><td>${x.ventiladores}</td><td>${x.imas}</td><td>${x.correntes}</td><td>${x.canhoes}</td><td>${x.hastes}</td><td>${x.portoesMaoUnica}</td><td>${x.portoesTrancados}</td><td>${x.vooEstimado.toLocaleString('pt-BR')}</td></tr>`).join('');

const html = `<title>Crazy Gravity Benchmark</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
<style>
/* Layout: coluna de leitura de 46rem com os mapas das fases em largura cheia, como fichas de um manual de 1996 */
:root {
  --bg: #f3f5f9; --surface: #ffffff; --fg: #121826; --muted: #4f5b70; --line: #d6dce6;
  --accent: #1d5bbf; --map: #0d1322;
  --base: #b88600; --fuel: #16884a; --freight: #c9302c; --extra: #2a66d6;
  --s1: #2a78d6; --s2: #eb6834;
  --display: "Barlow Condensed", "Arial Narrow", "Roboto Condensed", sans-serif;
  --body: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, Consolas, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #0a0f18; --surface: #111a29; --fg: #e7ecf4; --muted: #9ba8bd; --line: #233048;
  --accent: #82b2ff; --map: #0d1322;
  --base: #ffd23f; --fuel: #3fd081; --freight: #ff6b66; --extra: #74a6ff;
  --s1: #3987e5; --s2: #d95926; color-scheme: dark; } }
:root[data-theme="dark"] {
  --bg: #0a0f18; --surface: #111a29; --fg: #e7ecf4; --muted: #9ba8bd; --line: #233048;
  --accent: #82b2ff; --map: #0d1322;
  --base: #ffd23f; --fuel: #3fd081; --freight: #ff6b66; --extra: #74a6ff;
  --s1: #3987e5; --s2: #d95926; color-scheme: dark; }
* { box-sizing: border-box; }
body { background: var(--bg); color: var(--fg); font-family: var(--body); font-size: 1rem; line-height: 1.6; padding-inline: 16px; padding-block: 0 4rem; }
.wrap { max-width: 46rem; margin-inline: auto; }
.wide { max-width: 64rem; margin-inline: auto; }
h1, h2, h3 { font-family: var(--display); text-wrap: balance; line-height: 1.05; margin: 0; letter-spacing: 0.01em; }
h2 { font-size: clamp(1.9rem, 4vw, 2.4rem); margin-block: 3.5rem 0.75rem; }
p { margin: 0 0 0.9rem; }
a { color: var(--accent); }
a:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.eyebrow { font-family: var(--mono); font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
.mono { font-family: var(--mono); }
header.hero { padding-block: 3rem 1.5rem; display: grid; gap: 1rem; }
.hero h1 { font-size: clamp(3.2rem, 11vw, 6.5rem); font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; }
.hero h1 span { color: var(--base); }
.lede { font-size: 1.15rem; color: var(--muted); max-width: 40rem; }
.facts { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; font-family: var(--mono); font-size: 0.85rem; color: var(--muted); font-variant-numeric: tabular-nums; }
.facts b { color: var(--fg); font-weight: 500; }
.map { display: block; background: var(--map); border-radius: 6px; overflow: hidden; border: 1px solid var(--line); }
.map img { display: block; width: 100%; height: auto; }
.hero-map { margin-top: 0.5rem; }
figcaption, .caption { font-size: 0.85rem; color: var(--muted); margin-top: 0.5rem; }
.chips { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-block: 1rem; }
.chips a { font-family: var(--mono); font-size: 0.8rem; text-decoration: none; color: var(--fg); border: 1px solid var(--line); background: var(--surface); padding: 0.15rem 0.4rem; border-radius: 4px; font-variant-numeric: tabular-nums; }
.chips a:hover { border-color: var(--accent); color: var(--accent); }
.toc { columns: 2 14rem; margin: 0; padding-left: 1.2rem; color: var(--muted); }
.table-wrap { overflow-x: auto; margin-block: 1rem 1.5rem; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); }
table { border-collapse: collapse; width: 100%; font-size: 0.9rem; font-variant-numeric: tabular-nums; }
th, td { text-align: left; padding: 0.55rem 0.7rem; border-bottom: 1px solid var(--line); vertical-align: top; }
th { font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); font-weight: 500; white-space: nowrap; }
tr:last-child td { border-bottom: 0; }
td:has(> .swatch) { white-space: nowrap; }
.num-table td:not(:nth-child(2)) { text-align: right; } .num-table th:not(:nth-child(2)) { text-align: right; }
.swatch { display: inline-block; width: 0.85rem; height: 0.85rem; border-radius: 2px; vertical-align: -0.1rem; margin-right: 0.45rem; }
.sw-base { background: var(--base); } .sw-fuel { background: var(--fuel); } .sw-freight { background: var(--freight); } .sw-extra { background: var(--extra); } .sw-key { background: var(--fg); }
.chart-box { background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 1rem; margin-block: 1rem; }
.legend { display: flex; flex-wrap: wrap; gap: 0.4rem 1.2rem; font-size: 0.85rem; color: var(--muted); margin-bottom: 0.5rem; }
.legend i { display: inline-block; width: 0.8rem; height: 0.8rem; border-radius: 2px; margin-right: 0.4rem; vertical-align: -0.05rem; }
.chart { width: 100%; height: auto; display: block; }
.chart .grid { stroke: var(--line); } .chart .axis { stroke: var(--muted); }
.chart .tick { fill: var(--muted); font: 11px var(--mono); } .chart .peak { fill: var(--fg); font: 600 12px var(--mono); }
.chart .s1 { fill: var(--s1); } .chart .s2 { fill: var(--s2); } .chart .hit { fill: transparent; }
.chart .bar:hover .s1, .chart .bar:hover .s2 { opacity: 0.8; }
ul.points { padding-left: 1.2rem; margin: 0 0 1rem; } ul.points li { margin-bottom: 0.4rem; }
.fase { margin-block: 2.75rem; display: grid; gap: 0.9rem; }
.fase-head { display: flex; align-items: baseline; gap: 0.9rem; }
.fase-num { font-family: var(--display); font-weight: 700; font-size: 2.8rem; line-height: 1; color: var(--muted); font-variant-numeric: tabular-nums; }
.fase-head h3 { font-size: 1.9rem; font-family: var(--mono); font-weight: 500; letter-spacing: 0.06em; }
.fase-tag { font-family: var(--mono); font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--base); }
.fase-body { display: grid; grid-template-columns: minmax(0, 15rem) minmax(0, 1fr); gap: 1.5rem; }
.ficha { margin: 0; display: grid; gap: 0.45rem; align-content: start; font-size: 0.88rem; }
.ficha div { display: grid; gap: 0.05rem; border-bottom: 1px solid var(--line); padding-bottom: 0.4rem; }
.ficha dt { font-family: var(--mono); font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.ficha dd { margin: 0; font-variant-numeric: tabular-nums; }
.ficha .sub { color: var(--muted); font-size: 0.8rem; }
.notes { min-width: 0; }
.notes .idea { border-left: 3px solid var(--base); padding-left: 0.8rem; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.two > div { min-width: 0; background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 1rem 1.1rem; }
.two h3 { font-size: 1.35rem; margin-bottom: 0.5rem; }
.two ul { padding-left: 1.1rem; margin: 0; } .two li { margin-bottom: 0.5rem; }
blockquote { margin: 1rem 0; padding: 0.2rem 0 0.2rem 1rem; border-left: 3px solid var(--line); color: var(--muted); }
.note { font-size: 0.9rem; color: var(--muted); background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 0.8rem 1rem; }
footer { margin-top: 4rem; font-size: 0.85rem; color: var(--muted); }
@media (max-width: 640px) { .fase-body, .two { grid-template-columns: 1fr; } .fase-num { font-size: 2.2rem; } }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
</style>

<div class="wrap">
<header class="hero">
  <span class="eyebrow">Benchmark de level design · Resgate Espacial · 06/10/2026</span>
  <h1>Crazy <span>Gravity</span></h1>
  <p class="lede">O jogo que inspirou o Resgate Espacial, aberto por inteiro: as 18 fases da versão completa, que você nunca viu, lidas direto dos arquivos do jogo e redesenhadas como mapas, com o que cada fase pede, onde estava a graça e o que dá para levar para o nosso jogo.</p>
  <div class="facts"><span><b>1996</b> · Windows 95</span><span><b>Axel Meierhöfer</b> · XLM Software</span><span><b>18</b> fases</span><span><b>75</b> cargas</span><span><b>162</b> barris</span><span><b>45</b> chaves</span><span><b>128</b> portões</span></div>
</header>
</div>
<div class="wide"><a class="map hero-map" href="fase-01.png" target="_blank" rel="noopener"><img src="fase-01.png" alt="Mapa esquemático da fase 1 do Crazy Gravity"></a></div>
<div class="wrap">
  <p class="caption">Fase 1, a primeira da versão shareware. Os mapas não são capturas de tela: o Claude decifrou o formato dos arquivos de fase e redesenhou cada uma com uma cor por função. Toque num mapa para abrir em tamanho cheio.</p>

  <nav aria-label="Fases" class="chips">${d.map((x) => `<a href="#fase-${x.fase}">${pad(x.fase)}</a>`).join('')}</nav>

  <h2>Em uma página</h2>
  <div class="table-wrap"><table><tbody>
    <tr><th>Proposta</th><td>Pilotar uma nave por cavernas, com gravidade e inércia, buscar contêineres de carga e levar todos de volta à base, sem bater em nada e sem deixar o combustível acabar.</td></tr>
    <tr><th>Versão de teste</th><td>Shareware com 3 fases (fácil, média e difícil) por 30 dias; a versão completa custava US$ 30. A licença liberava cópias "em CD-ROM e em disquete", e o jogo saiu na coletânea <i>10 Tons of Games: Mega Collection 1</i> (1997), com 106 jogos num menu. Por isso você o conheceu numa revista, sem passar da fase 3.</td></tr>
    <tr><th>Diversão</th><td>Dominar a nave, pousar com precisão, planejar a rota e resolver os "quebra-cabeças físicos" para chegar à carga.</td></tr>
    <tr><th>Dificuldade</th><td>Encostar em qualquer coisa explode a nave; o pouso tem limite de velocidade; o combustível acaba; ventiladores, ímãs e correntes mexem na física; canhões e hastes pedem tempo certo; o porão leva uma carga por vez.</td></tr>
    <tr><th>Oponentes</th><td>Não há inimigos que se movem ou perseguem. O adversário é a caverna: canhões fixos, hastes que abrem e fecham e forças que empurram, puxam ou giram a nave.</td></tr>
    <tr><th>Recepção</th><td>80% na revista alemã PC Player; 8,43/10 (44 votos) na Home of the Underdogs; 5/5 no MyAbandonware.</td></tr>
  </tbody></table></div>

  <h2>Como o jogo funcionava</h2>
  <ul class="points">
    <li><b>Controles:</b> seta para cima liga o motor; esquerda e direita giram a nave. Shift reduz o giro para 33%, para mirar o pouso.</li>
    <li><b>Física:</b> a gravidade puxa sempre para baixo, e a nave só acelera para onde a ponta aponta. O manual ensina a não inclinar mais de 45° no começo e a frear girando a nave para o lado contrário.</li>
    <li><b>Pouso:</b> velocidade horizontal e vertical abaixo de um limite, mostrado por marcas amarelas num velocímetro de ponteiros; acima disso, a nave se despedaça.</li>
    <li><b>Vidas:</b> 5 por fase. Ao morrer, as cargas a bordo voltam para a plataforma de origem; chaves, porões e turbo ficam.</li>
    <li><b>Combustível:</b> começa cheio. Cada pouso num posto puxa <b>um barril</b>; para pegar outro, é preciso decolar um instante e pousar de novo.</li>
    <li><b>Progresso:</b> cada fase concluída dá a senha da próxima; os 3 melhores tempos de cada fase ficam guardados.</li>
    <li><b>Dificuldade:</b> 5 níveis que mexem em parâmetros visíveis (gravidade, motor, resistência do ar, consumo, força de ventiladores e ímãs, velocidade de pouso), todos ajustáveis um a um.</li>
    <li><b>Ensino:</b> um modo demonstração em que o próprio jogo pilota as fases 1 a 3. Também havia editor de fases e trapaças (vidas infinitas, todas as chaves, muito combustível).</li>
  </ul>

  <h2>O que uma fase pode ter</h2>
  <p>Cada plataforma tem uma cor que diz a função, sem nenhum texto.</p>
  <div class="table-wrap"><table><thead><tr><th>Plataforma</th><th>O que oferece</th><th>Nas 18 fases</th></tr></thead><tbody>
    <tr><td><span class="swatch sw-base"></span>Base</td><td>Começa e termina aqui; entregar todas as cargas conclui a fase</td><td>18</td></tr>
    <tr><td><span class="swatch sw-freight"></span>Carga</td><td>Até 10 contêineres por plataforma, levados um por vez</td><td>75 cargas</td></tr>
    <tr><td><span class="swatch sw-fuel"></span>Combustível</td><td>Até 10 barris; um por pouso</td><td>26 postos, 162 barris</td></tr>
    <tr><td><span class="swatch sw-key"></span>Chave</td><td>Vermelha, verde, azul ou amarela; abre portões trancados</td><td>45</td></tr>
    <tr><td><span class="swatch sw-extra"></span>Extra</td><td>Turbo (2× empuxo, 5× consumo), vida extra ou porão (mais um lugar para carga)</td><td>20</td></tr>
  </tbody></table></div>
  <div class="table-wrap"><table><thead><tr><th>Obstáculo</th><th>O que faz</th><th>Nas 18 fases</th></tr></thead><tbody>
    <tr><td>Ventilador</td><td>Empurra a nave numa direção, dentro de uma faixa; com grade na frente, é mais fraco</td><td>73</td></tr>
    <tr><td>Ímã</td><td>Puxa a nave na direção dele</td><td>48</td></tr>
    <tr><td>Corrente de ar</td><td>Gira a nave (verde no sentido horário, rosa no anti-horário); o manual diz que é "muito perigosa"</td><td>26</td></tr>
    <tr><td>Canhão</td><td>Bolas de fogo numa direção fixa, com cadência de 15 a 180 quadros entre tiros</td><td>84</td></tr>
    <tr><td>Par de hastes</td><td>Barras que avançam uma contra a outra; o vão (20 a 200 px) pode ser fixo ou abrir e fechar, e algumas mudam de velocidade sem aviso</td><td>51</td></tr>
    <tr><td>Portão de mão única</td><td>Abre só do lado da seta e fecha depois que a nave passa</td><td>77</td></tr>
    <tr><td>Portão trancado</td><td>Lâmpadas coloridas mostram as chaves exigidas (de 1 a 4)</td><td>51</td></tr>
  </tbody></table></div>
  <figure style="margin:0"><a class="map" href="legenda.png" target="_blank" rel="noopener" style="max-width:38rem"><img src="legenda.png" alt="Legenda dos mapas: cores de plataformas e obstáculos"></a><figcaption>Legenda dos mapas.</figcaption></figure>

  <h2>A curva de dificuldade</h2>
  <p>A dificuldade não sobe em rampa: sobe e desce em serrote. A fase 3, a última da versão de teste, é um pico; a 6 e a 8 quase não têm obstáculos; a 14 é a fase-chefe; a 18 fecha o jogo. Cada novidade entra uma de cada vez: chaves na fase 2, ímãs e correntes na 3, o porão na 7, as quatro chaves na 9 e o portão das quatro chaves na 10.</p>
  <div class="chart-box">
    <div class="legend"><span><i style="background:var(--s1)"></i>Obstáculos (ventiladores, ímãs, correntes, canhões, hastes)</span><span><i style="background:var(--s2)"></i>Portões (mão única e trancados)</span></div>
    ${chart()}
  </div>
  <div class="table-wrap"><table class="num-table"><thead><tr><th>Fase</th><th>Senha</th><th>Campos</th><th>Cargas</th><th>Barris</th><th>Chaves</th><th>Vent.</th><th>Ímãs</th><th>Corr.</th><th>Canhões</th><th>Hastes</th><th>Mão única</th><th>Trancados</th><th>Voo*</th></tr></thead><tbody>${tableRows}</tbody></table></div>
  <p class="caption">* Voo estimado: soma, em campos, das idas e voltas entre a base e cada carga, uma carga por viagem, pelo caminho livre mais curto, ignorando portões e obstáculos. Serve só para comparar o tamanho das fases.</p>

  <h2>Fase a fase</h2>
  <p>Cada mapa mostra a fase inteira; a grade fina marca blocos de 5 campos. Na tela do jogo, só uma parte da caverna aparecia, e a câmera rolava.</p>
</div>
<div class="wide">
${d.map(faseCard).join('\n')}
</div>
<div class="wrap">
  <h2>Padrões de design</h2>
  <ul class="points">
    <li><b>Uma ideia por fase.</b> Cada fase tem um destaque que cabe numa frase: o porão (7), a cadeia de chaves (8), a fase vertical (13).</li>
    <li><b>Ensinar sem texto.</b> O circuito de mão única da fase 1, a cadeia de portões da 8 e a demonstração das fases 1 a 3.</li>
    <li><b>Ritmo em serrote</b>, com picos nas fases 3, 14 e 18 e respiros na 4, 6 e 8. O respiro muda o desafio (mais voo, mais planejamento) em vez de só baixar a dificuldade.</li>
    <li><b>Cor = função</b> em plataformas e portões.</li>
    <li><b>Chaves como fechaduras da rota</b>, que obrigam a visitar a fase inteira e criam uma ordem.</li>
    <li><b>Mão única para criar circuitos</b> e impedir atalhos na volta.</li>
    <li><b>Recompensa dentro do perigo:</b> chave sob ímãs (5), vida sob ímãs (13).</li>
    <li><b>Repetição em série</b> de um obstáculo, formando um trecho com identidade: corredores de hastes (12 e 14), colunas de ventiladores (7, 13 e 16).</li>
    <li><b>Upgrades opcionais dentro da fase</b> (porão, turbo, vida), ganhos jogando.</li>
    <li><b>Base no centro</b> nas fases grandes (9, 10, 12, 14 e 18) e <b>simetria</b> para a leitura (4 e 18).</li>
    <li><b>Formato variado:</b> corredores horizontais, poços verticais, caverna aberta e túneis diagonais.</li>
    <li><b>Amostra com fácil, média e difícil:</b> a versão de teste mostrava a curva inteira em 3 fases.</li>
  </ul>

  <h2>Diversão e dificuldade</h2>
  <div class="two">
    <div><h3>Onde estava a diversão</h3><ul>
      <li>Dominar a nave: a inércia "bem simulada" faz cada melhora de pilotagem aparecer na hora.</li>
      <li>O pouso perfeito em cima da plataforma, uma pequena vitória a cada parada.</li>
      <li>Planejar a ordem das cargas, das chaves e dos postos.</li>
      <li>Os quebra-cabeças físicos: como chegar à carga contra vento, ímã ou corrente.</li>
      <li>Uma novidade em cada fase.</li>
      <li>O recorde de cada fase, que convida a jogar de novo.</li>
    </ul></div>
    <div><h3>Onde estava a dificuldade</h3><ul>
      <li>Erro fatal: encostar em qualquer coisa explode a nave, e a carga volta para a origem.</li>
      <li>O limite de velocidade no pouso.</li>
      <li>Combustível barril por barril.</li>
      <li>Forças que mudam o voo justamente perto de plataformas e chaves.</li>
      <li>Tempo certo para passar por canhões e hastes.</li>
      <li>Fases longas, com até 8 cargas e portões que pedem 3 ou 4 chaves. O próprio autor previu a frustração: senhas, trapaças e a dica de baixar a gravidade "se tudo isso parecer difícil demais".</li>
    </ul></div>
  </div>

  <h2>O que os jogadores diziam</h2>
  <ul class="points">
    <li><b>PC Player</b> (revista alemã): 80%.</li>
    <li><b>Home of the Underdogs:</b> 8,43/10 em 44 votos. A resenha elogia a inércia bem simulada, os quebra-cabeças físicos para chegar à carga e a mistura de reflexos, raciocínio e planejamento.</li>
    <li><b>MyAbandonware:</b> 5/5. Um jogador procurou o jogo por 20 anos depois de jogar a demo num CD de revista; outro jogou em 2002, no primeiro computador da família, e "sempre quis jogar de novo". A sua história se repete por aí.</li>
    <li><b>Internet Archive:</b> 4 estrelas, pelo "ambiente muito bom nos anos 90"; a única queixa é que a cópia preservada perdeu a música.</li>
    <li><b>Remake para PSP</b> (2009): um fã refez o jogo com <b>autorização do autor</b> para usar os gráficos e sons e ficou em 3º num concurso. Os leitores elogiaram o visual, e um achou a jogabilidade "um pouco pobre".</li>
  </ul>
  <p class="note">Críticas negativas quase não existem nas fontes. O que aparece é a música faltando na cópia preservada e, pelo próprio manual, a dificuldade alta, compensada com senhas, trapaças e física ajustável.</p>

  <h2>O que levar para o nosso jogo</h2>
  <p>Tudo aqui é proposta para você decidir. O detalhe, com cada pendência ligada, está no documento do repositório.</p>
  <div class="table-wrap"><table><thead><tr><th>Do Crazy Gravity</th><th>No Resgate Espacial</th></tr></thead><tbody>
    <tr><td>Ritmo em serrote</td><td>Em cada mundo de 10 fases, um respiro no meio e uma fase-chefe no fim</td></tr>
    <tr><td>Ventilador, ímã e corrente de ar</td><td>Vento solar que empurra, campo gravitacional que puxa, redemoinho que gira: o catálogo de obstáculos (P-011) sem quebrar a regra "sem inimigos que atiram"</td></tr>
    <tr><td>Hastes com vão que abre e fecha</td><td>É a nossa "barreira que sobe e desce", com vão fixo ou variável</td></tr>
    <tr><td>Canhões</td><td>Contrariam a nossa regra; uma versão ambiental seria um jato de gás ou um meteoro periódico</td></tr>
    <tr><td>Portões de mão única</td><td>Ida por um caminho e volta por outro, sem atalho</td></tr>
    <tr><td>Chaves e portões trancados</td><td>Com cuidado: alongam a fase, e o nosso jogador quer partidas curtas (D-028)</td></tr>
    <tr><td>Combustível por barril</td><td>Uma alternativa ao posto que enche o tanque (D-026, #93)</td></tr>
    <tr><td>Porão, turbo e vida dentro da fase</td><td>Referência de itens justos, ganhos jogando (P-017)</td></tr>
    <tr><td>Demonstração das fases 1 a 3</td><td>O original já fazia a nossa DEMO (D-031)</td></tr>
    <tr><td>Recorde por fase</td><td>Confirma o ranking por fase (D-024)</td></tr>
    <tr><td>Dificuldade feita de parâmetros físicos</td><td>Modificadores (P-012) e o modo Nightmare (P-018)</td></tr>
    <tr><td>Versão de teste com 3 fases</td><td>Modelo "lite": algumas fases grátis, mostrando a curva inteira (P-014)</td></tr>
  </tbody></table></div>
  <blockquote>A diferença que importa: o Crazy Gravity é um labirinto de vários minutos por fase. O nosso é um corredor da esquerda para a direita, para partidas curtas no celular. As ideias de obstáculo e de ritmo servem; a escala das fases, não.</blockquote>

  <h2>Como isto foi feito</h2>
  <p>A versão shareware 2.0E, preservada no Internet Archive, traz os arquivos das 18 fases, mesmo que só 3 fossem jogáveis. O Claude decifrou o formato (mapa de campos de 32 pixels, pedaços de pedra, ventiladores, ímãs, correntes, canhões, hastes, portões, plataformas e a senha de cada fase), conferiu as senhas com as listas publicadas e redesenhou as fases. Só arquivos de dados foram baixados; o jogo não foi executado. Os extras de código 5 e 6 foram lidos como turbo e vida pela ordem do manual.</p>
  <p>No repositório: <span class="mono">docs/benchmark/crazy-gravity.md</span> e <span class="mono">docs/10-benchmark-de-level-design.md</span> (decisão D-032).</p>

  <footer>
    <p>Fontes: <a href="https://archive.org/details/CrazyGravity_1020">Internet Archive</a> · <a href="https://www.mobygames.com/game/41247/crazy-gravity/">MobyGames</a> · <a href="https://www.homeoftheunderdogs.net/game.php?id=3046">Home of the Underdogs</a> · <a href="https://www.myabandonware.com/game/crazy-gravity-gxb">MyAbandonware</a> · <a href="https://www.gamebrew.org/wiki/Crazy_Gravity_Portable_PSP">GameBrew</a> · <a href="https://www.xlmsoft.de/">XLM Software</a> · vídeos: <a href="https://www.youtube.com/watch?v=OiyixQzxA9s">análise de 1996</a>, <a href="https://www.youtube.com/watch?v=V6cVQdGJ3vw">retrospectiva</a>, <a href="https://www.youtube.com/watch?v=FfReSNKQM7o">gravação de 1997</a>.</p>
    <p>Crazy Gravity © Axel Meierhöfer / XLM Software. Mapas esquemáticos redesenhados para estudo.</p>
  </footer>
</div>
`;
fs.writeFileSync((process.argv[2] || 'saida') + '/pagina-de-leitura.html', html);
console.log('ok', html.length);
