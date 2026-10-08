// Gera a página de leitura do benchmark do Super Mario World (saida/pagina-de-leitura.html).
// Os diagramas entram em SVG embutido, com as cores do tema; as tabelas saem de ../fases.json.
// Uso: node montar-pagina.js [pasta de saída]
const fs = require('fs');
const path = require('path');
const D = require('./diagramas.js');
const F = require('../fases.json');
const OUT = path.resolve(process.argv[2] || path.join(__dirname, 'saida'));
fs.mkdirSync(OUT, { recursive: true });
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
// Atributos SVG com var(--...) não são confiáveis em todo navegador: viram um atributo style em cada elemento
const temaParaStyle = (svg) => svg.replace(/<(\w+)([^<>]*?)(\/?)>/g, (tag, nome, attrs, fecha) => {
  const css = [];
  const resto = attrs.replace(/\s(fill|stroke|font-family)="(var\([^"]+\))"/g, (_, p, v) => { css.push(`${p}:${v}`); return ''; });
  return css.length ? `<${nome}${resto} style="${css.join(';')}"${fecha}>` : tag;
});
const fig = (svg, legenda) => `<figure class="diagram"><div class="svg-wrap">${temaParaStyle(svg.replace(/ width="\d+" height="\d+"/, ''))}</div>${legenda ? `<figcaption>${legenda}</figcaption>` : ''}</figure>`;
const tabela = (cab, linhas) => `<div class="table-wrap"><table>${cab ? `<thead><tr>${cab.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>` : ''}<tbody>${linhas.map((l) => `<tr>${l.map((c, i) => (i === 0 && !cab ? `<th>${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`;
const mono = (t) => `<span class="mono">${esc(t)}</span>`;
const nJogo = F.dicas.filter((d) => d.tipo === 'jogo').length;
const nMundo1 = F.dicas.filter((d) => d.tipo === 'jogo' && d.mundo === 1).length;

const primeiro = F.primeiroMundo.map((f) => [esc(f.fase) + (f.obrigatoria || f.fase === "Yoshi's House" ? '' : ' <span class="small">opcional</span>'), esc(f.apresenta), esc(f.comoEnsina), esc(f.redeDeSeguranca)]);

const levar = [
  ['A fase que ensina é feita por último', 'Quando o Mundo 1 tiver as fases 4 a 10, refazer o nível 1 por último, a partir delas e do que os iniciantes mostrarem no playtest, puxando o mais fácil para o começo.', 'Mundo 1, doc. 08, doc. 07'],
  ['Segunda chance de viver a novidade', 'Desenhar o começo do nível 1 para que o jogador viva "segurar sobe, soltar desce" de qualquer jeito, como o cogumelo que volta do cano: um primeiro trecho largo e alto em que só dá para avançar flutuando, sem como bater.', 'D-027, P-009'],
  ['Dica opcional, um passo antes da necessidade', 'Trocar as dicas fixas do nível 1 por dicas presas ao lugar (a do pouso perto da tripulação, a do combustível perto do posto), que somem nas fases seguintes. Medir quem lê.', 'D-031, #97'],
  ['Ajuda só depois do erro, com hora calibrada', 'Revisitar o "sem oferta de ajuda": oferecer o TRAINING ou a DEMO da fase depois de N mortes no mesmo ponto, com N medido no playtest; e uma marca de orgulho para quem termina sem ajuda.', 'D-031, P-009, #127'],
  ['Ajuda que deixa continuar jogando', 'Se vier ajuda, que ajude a passar o trecho, não a pulá-lo: um tanque extra ou um escudo de um toque, fora do ranking.', 'P-012, D-024'],
  ['Demonstração modesta', 'A DEMO de hoje voa como um bom jogador. A Nintendo fez o contrário de propósito: ritmo calmo, sem truques, para quem vê pensar que também consegue.', 'D-031, #104, #92'],
  ['Um lugar seguro para brincar', 'No começo de um mundo com obstáculo novo, um trecho sem risco para experimentar, ou o TRAINING virando esse lugar.', 'P-011, P-012'],
  ['Contrato de confiança', 'Um sinal visual que sempre quer dizer "seguro por aqui" e nunca engana; nenhuma pedra logo depois de um ponto de alívio. Escrever nas regras do mundo.', 'Doc. 08, D-018'],
  ['Um ponto de retorno, logo antes do trecho difícil', 'Na fase grande, um checkpoint (não vários) antes do trecho que pede mais tentativas, com um pequeno presente ao passar.', 'Doc. 13, #127'],
  ['O jogo diz que o segredo existe, não onde está', 'Nas fases maiores, uma rota ou saída opcional, marcada no mapa do mundo quando existe.', 'Doc. 08, D-020'],
  ['Ajuda que se conquista', 'Uma fase opcional por mundo que deixa as outras mais fáceis (por exemplo, abre um posto extra), em vez de ajuda comprada.', 'P-012, P-017'],
  ['Testar com quem não joga, olhando o rosto', 'No próximo playtest, observar em silêncio quem nunca viu o jogo no nível 1, anotar onde hesita e perguntar onde ficou confuso.', 'Doc. 07, #44'],
];

const html = `<title>Super Mario World Benchmark</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
<style>
/* Layout: coluna de leitura de 46rem, diagramas e tabelas largas em 64rem; mesma família das páginas de benchmark, com o vermelho do boné e o verde da ilha */
:root {
  --bg: #f4f3ef; --surface: #fdfcf9; --fg: #15130f; --muted: #57534a; --line: #dcd8cc;
  --accent: #2f6b3a; --gold: #b3261e; --serie: #2a6fd0; --destaque: #d9581f; --ok: #2e8b57; --cinza: #9aa3b2;
  --display: "Barlow Condensed", "Arial Narrow", "Roboto Condensed", sans-serif;
  --body: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, Consolas, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #0d0c0a; --surface: #181613; --fg: #ece9e1; --muted: #a8a294; --line: #2f2c26;
  --accent: #86d394; --gold: #f2726a; --serie: #4f8fe8; --destaque: #e46c2c; --ok: #48b07a; --cinza: #6b7484; color-scheme: dark; } }
:root[data-theme="dark"] {
  --bg: #0d0c0a; --surface: #181613; --fg: #ece9e1; --muted: #a8a294; --line: #2f2c26;
  --accent: #86d394; --gold: #f2726a; --serie: #4f8fe8; --destaque: #e46c2c; --ok: #48b07a; --cinza: #6b7484; color-scheme: dark; }
* { box-sizing: border-box; }
body { background: var(--bg); color: var(--fg); font-family: var(--body); font-size: 1rem; line-height: 1.6; padding-inline: 16px; padding-block: 0 4rem; }
.wrap { max-width: 46rem; margin-inline: auto; }
.wide { max-width: 64rem; margin-inline: auto; }
h1, h2, h3 { font-family: var(--display); text-wrap: balance; line-height: 1.05; margin: 0; letter-spacing: 0.01em; }
h2 { font-size: clamp(1.9rem, 4vw, 2.4rem); margin-block: 3.5rem 0.75rem; }
h3 { font-size: 1.4rem; margin-block: 1.8rem 0.5rem; }
p { margin: 0 0 0.9rem; }
a { color: var(--accent); }
a:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.mono { font-family: var(--mono); font-size: 0.85em; }
.small { font-size: 0.78em; color: var(--muted); white-space: nowrap; font-family: var(--mono); }
.eyebrow { font-family: var(--mono); font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
header.hero { padding-block: 3rem 1.5rem; display: grid; gap: 1rem; }
.hero h1 { font-size: clamp(3rem, 10vw, 6rem); font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; }
.hero h1 span { color: var(--gold); }
.lede { font-size: 1.15rem; color: var(--muted); max-width: 40rem; }
.facts { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; font-family: var(--mono); font-size: 0.85rem; color: var(--muted); font-variant-numeric: tabular-nums; }
.facts b { color: var(--fg); font-weight: 500; }
.chips { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-block: 1rem; }
.chips a { font-family: var(--mono); font-size: 0.8rem; text-decoration: none; color: var(--fg); border: 1px solid var(--line); background: var(--surface); padding: 0.15rem 0.45rem; border-radius: 4px; }
.chips a:hover { border-color: var(--accent); color: var(--accent); }
.diagram { margin: 1rem 0 1.5rem; }
.svg-wrap { background: var(--surface); border: 1px solid var(--line); border-radius: 6px; overflow-x: auto; padding: 0.5rem; }
.svg-wrap svg { display: block; width: 100%; min-width: 40rem; height: auto; }
figcaption { font-size: 0.85rem; color: var(--muted); margin-top: 0.5rem; }
.table-wrap { overflow-x: auto; margin-block: 1rem 1.5rem; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); }
table { border-collapse: collapse; width: 100%; font-size: 0.9rem; font-variant-numeric: tabular-nums; }
th, td { text-align: left; padding: 0.55rem 0.7rem; border-bottom: 1px solid var(--line); vertical-align: top; }
th { font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); font-weight: 500; }
tbody th { min-width: 8rem; }
tr:last-child td, tr:last-child th { border-bottom: 0; }
ol.steps { list-style: none; padding: 0; margin: 1rem 0; display: grid; gap: 0.6rem; counter-reset: s; }
ol.steps li { background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 0.7rem 0.9rem 0.7rem 3rem; position: relative; counter-increment: s; }
ol.steps li::before { content: counter(s); position: absolute; left: 0.9rem; top: 0.55rem; font-family: var(--display); font-weight: 700; font-size: 1.5rem; color: var(--gold); }
ul.points { padding-left: 1.2rem; margin: 0 0 1rem; } .points li { margin-bottom: 0.45rem; }
.key { border-left: 3px solid var(--gold); padding: 0.2rem 0 0.2rem 0.9rem; margin: 1rem 0; }
.note { font-size: 0.9rem; color: var(--muted); background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 0.8rem 1rem; }
footer { margin-top: 4rem; font-size: 0.85rem; color: var(--muted); }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
</style>

<div class="wrap">
<header class="hero">
  <span class="eyebrow">Benchmark de ensino pelas fases · Resgate Espacial · 08/10/2026</span>
  <h1>Super Mario <span>World</span></h1>
  <p class="lede">Sem tutorial, sem apresentação: o jogo te larga no mapa e você aprende jogando. Como isso funciona fase a fase, como a Nintendo construiu, onde o jogo fala (pouco, e só quando você pede) e o que a mesma equipe mudou vinte anos depois.</p>
  <div class="facts"><span><b>1990</b> · Nintendo</span><span><b>73</b> fases, <b>96</b> saídas</span><span><b>${nJogo}</b> dicas de jogo, todas opcionais</span><span><b>${nMundo1}</b> delas no 1º mundo</span><span><b>8</b> vidas até a ajuda (2009)</span></div>
</header>
  <nav aria-label="Seções" class="chips"><a href="#premissa">A premissa</a><a href="#construido">Como foi construído</a><a href="#primeiro">O primeiro mundo</a><a href="#erro">Errar custa pouco</a><a href="#curiosidade">Curiosidade</a><a href="#depois">O que mudou depois</a><a href="#principios">Princípios</a><a href="#levar">O que levar</a></nav>

  <h2 id="premissa">O jogo fala pouco, e só quando você pede</h2>
  <p>Não há tutorial nem tela de instruções: uma única tela diz que a princesa sumiu, e o jogador cai no mapa com dois caminhos abertos. Mas o jogo tem texto. São ${F.dicas.length} mensagens; ${nJogo} são dicas de jogo, e todas são <b>opcionais</b>: só aparecem se Mario bater num bloco de mensagem. Cada uma fica <b>um passo antes do lugar onde serve</b>: a de jogar o casco para cima, logo antes de um casco; a do pulo giratório, do lado do bloco do Yoshi.</p>
</div>
<div class="wide">${fig(D.dicas(D.TEMA))}</div>
<div class="wrap">
  <p class="key">O texto se concentra no começo e some: ${nMundo1} das ${nJogo} dicas estão no primeiro mundo, e do mundo 3 em diante só há mais 2. Na reedição de 2001, a Nintendo acrescentou dicas ao começo, explicando até o botão de pulo.</p>

  <h2 id="construido">Como foi construído</h2>
  <p>Contado pela própria equipe nas entrevistas Iwata Asks (2009 a 2011): Miyamoto, Tezuka, Nakago, Konno e Eguchi, os mesmos do Super Mario World.</p>
  <ol class="steps">
    <li><b>A fase que ensina é a última a ser feita.</b> As fases divertidas vêm primeiro; quando iniciantes as acham difíceis demais, o fácil é puxado para o começo. A 1-1 do Super Mario Bros. foi a última fase feita e ajustada até o fim.</li>
    <li><b>Desenhar pensando em quem erra.</b> No papel, simulando a jogada. O cogumelo da 1-1 volta ao bater no cano para que o jogador o pegue de qualquer jeito; no Super Mario World, quem perde o primeiro Yoshi tem outro bloco mais à frente.</li>
    <li><b>Um contrato de confiança.</b> Moedas no ar dizem "pode pular"; a equipe repetia que não se pode trair a expectativa do jogador. No 3D Land, Tezuka mandou tirar inimigos postos logo depois de um pulo ou de uma moeda.</li>
    <li><b>Ir para a direita alivia.</b> Para Eguchi, diretor das fases do Super Mario World, saber que o objetivo está à direita deixa o jogador começar sem pensar demais.</li>
    <li><b>Testar com quem não joga.</b> É o teste com iniciantes que move as fases de lugar; relatórios de funcionários pouco acostumados a jogar dão confiança à equipe.</li>
  </ol>
</div>
<div class="wide">${fig(D.quatroTempos(D.TEMA))}</div>
<div class="wrap">
  <h2 id="primeiro">O primeiro mundo, aula por aula</h2>
  <p>Yoshi's Island não tem saída secreta. Cada fase apresenta uma ou duas ideias, tem uma ou duas dicas opcionais e uma rede de segurança. O caminho opcional (a primeira fase e o palácio amarelo) deixa o resto do jogo mais fácil.</p>
</div>
<div class="wide">${fig(D.primeiroMundo(D.TEMA))}
${tabela(['Fase', 'O que apresenta', 'Como ensina', 'Rede de segurança'], primeiro)}</div>
<div class="wrap">
  <p>Depois do castelo, a Donut Plains 1 entrega a capa, oferece uma sala com 500 moedas para treinar o voo sem risco e, no fim, avisa que fases com ponto vermelho no mapa têm uma segunda saída.</p>

  <h2 id="erro">Errar custa pouco, em camadas</h2>
</div>
<div class="wide">${fig(D.redes(D.TEMA))}</div>
<div class="wrap">
  <p>O portão do meio é um só por fase. Miyamoto explica: repetir os trechos fáceis dá prazer e faz o jogador melhorar; jogar sempre no limite pode ser excitante, mas não é gostoso. E o portão ainda dá um presente: passar por ele pequeno transforma Mario em grande.</p>

  <h2 id="curiosidade">A curiosidade como motor</h2>
  <ul class="points">
    <li><b>96 saídas em 73 fases.</b> 24 fases têm uma segunda saída escondida; o mapa marca essas fases com um ponto vermelho.</li>
    <li><b>O jogo diz que o segredo existe, não onde está:</b> "fases com ponto vermelho têm duas saídas", "existem cinco entradas para o Star World", "consegue achar a saída?".</li>
    <li><b>O difícil é opcional:</b> a Special Zone, sem portões do meio, só se abre a quem acha os segredos; o prêmio é mudar a estação do mapa.</li>
    <li><b>A ajuda se conquista:</b> os palácios dos botões são fases opcionais que enchem blocos com cogumelos e plataformas pelo jogo todo.</li>
  </ul>

  <h2 id="depois">O que a Nintendo mudou depois</h2>
  <p>O Super Mario World não oferece ajuda depois do erro. A mesma equipe, vinte anos depois, manteve o "sem tutorial" e acrescentou ajuda <b>só depois de errar</b>, com a hora calibrada em teste.</p>
</div>
<div class="wide">${fig(D.ajuda(D.TEMA))}</div>
<div class="wrap">
  <ul class="points">
    <li><b>No menu, não:</b> Miyamoto recusou oferecer a solução antes de o jogador tentar.</li>
    <li><b>Depois de 3 erros, ainda é cedo:</b> ajuda que chega enquanto a pessoa está determinada ofende; quando ela está quase chorando, é bem-vinda. Ficou 8; no 3D Land, Tezuka pediu 5.</li>
    <li><b>Orgulho como contrapeso:</b> medalhas para quem termina sem ver a ajuda.</li>
    <li><b>Ajuda que deixa jogar:</b> um testador travado não quis voar por cima do trecho; queria jogá-lo. Daí veio a folha de invencibilidade.</li>
    <li><b>Demonstração modesta:</b> os vídeos de ajuda foram gravados sem corrida e sem truques. A regra: "jogue com consideração", para quem vê pensar que também consegue.</li>
  </ul>

  <h2 id="principios">Os princípios que a Nintendo publicou</h2>
  <p>No Super Mario Maker 2, a Nintendo ensina o público a criar fases. As lições sobre ensinar e errar:</p>
  ${tabela(['Princípio', 'Em uma frase'], [
    ['Mostrar o próximo passo', 'O jogador não sabe que há uma plataforma fora da tela; mostre sempre para onde ir'],
    ['Moedas guiam', 'O jogador vai atrás delas; use isso, sem exagero'],
    ['Dar uma segunda chance', 'Quem erra precisa de uma saída sem ter de recomeçar'],
    ['Não prender o jogador', 'Nada de lugar de onde não se sai depois de perder um poder'],
    ['Ponto de retorno no lugar certo', 'Logo depois de um trecho difícil, ou logo antes de um que vai pedir muitas tentativas'],
    ['Surpresa com tempo de reagir', 'Surpreender é bom se dá tempo de reagir'],
    ['Tratar o jogador com justiça', '"Difícil, mas justo": a lição mais importante'],
    ['Ritmo com respiro', 'Trechos vazios dão contraste'],
    ['Assistir outra pessoa jogar', 'Pergunte onde ficou confusa e observe o rosto'],
  ])}

  <h2 id="levar">O que levar para o Resgate Espacial</h2>
  <p>Tudo aqui é <b>Proposta</b> para o Fernando decidir. Inspirar, nunca copiar: as ideias são de método e de dinâmica, não de fases, personagens ou textos.</p>
  ${tabela(['Ideia', 'Como poderia entrar', 'Ligado a'], levar.map(([a, b, c]) => [esc(a), esc(b), mono(c)]))}
  <p class="note"><b>Validações:</b> sem tutorial (D-031); uma novidade por fase; caminho sempre justo (D-018); mundos em sequência (D-020); fases fixas que se aprendem repetindo (D-021); testar com pessoas. <b>Onde contradiz:</b> a D-031 diz "sem oferta de ajuda"; o Super Mario World concorda, mas a mesma equipe mudou de ideia em 2009, com números testados. <b>Diferença importante:</b> o Mario ensinou um gesto que o público já conhecia (correr e pular) num controle de botões; o nosso ensina uma física menos intuitiva (propulsor, inércia, combustível) numa tela de toque. Talvez precisemos de mais ajuda do que o Mario, não de menos.</p>

  <h2>Como este material foi feito</h2>
  <p>A base são sete entrevistas Iwata Asks lidas por inteiro, a entrevista oficial de 2017, a de Koichi Hayashida (2012) e as lições do Super Mario Maker 2. Os dados do jogo, inclusive a lista completa de textos, vêm da Super Mario Wiki. A transcrição do vídeo da Eurogamer não carregou; nenhum arquivo do jogo foi aberto. O documento completo, com as fontes e o que é leitura nossa, está em ${mono('docs/benchmark/super-mario-world.md')}.</p>
  <footer>Super Mario World © Nintendo. Gráficos e esquemas redesenhados para estudo, a partir da Super Mario Wiki e das entrevistas oficiais. Benchmark feito para o Resgate Espacial em 08/10/2026.</footer>
</div>
`;
fs.writeFileSync(path.join(OUT, 'pagina-de-leitura.html'), html);
console.log('Página gerada:', path.join(OUT, 'pagina-de-leitura.html'), Math.round(html.length / 1024) + ' KB');
