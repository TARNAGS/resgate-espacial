// Gera a página de leitura do benchmark do Temple Run (saida/pagina-de-leitura.html).
// Os diagramas entram em SVG embutido, com as cores do tema. Uso: node montar-pagina.js [pasta de saída]
const fs = require('fs');
const path = require('path');
const D = require('./diagramas.js');
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

const levar = [
  ['Dois tipos de erro: o tropeço avisa, o segundo mata', 'Raspar de leve vira um susto (a nave balança, um aviso); só a segunda batida em poucos segundos, ou uma batida forte, explode. Candidato a modificador ou modo mais fácil, junto com o "casco" dos Gravitron.', 'D-027, D-028, P-012'],
  ['Controle feito para o aparelho', 'O fracasso anterior da Imangi veio de dois controles virtuais. Testar o nosso controle com quem nunca viu o jogo, sem explicar nada.', 'D-006, D-022, #44'],
  ['Testar sem explicar', 'Valida o nosso roteiro de teste: o melhor sinal é a pessoa não querer devolver o celular.', 'Documentos 07 e 09'],
  ['Um motivo para seguir em frente', 'Em fases especiais, uma ameaça visível que avança (tempestade, água subindo), sem inimigo que atira.', 'P-012, P-018 (#79)'],
  ['Progresso que entra no placar', 'O contrário do Jetpack Joyride, e mostra o risco: somar progresso ou compras ao ranking deixa de medir habilidade. Reforça o tempo puro.', 'D-024, P-006, P-017'],
  ['Grátis sem barreira, 1% pagando', 'Jogo inteiro sem pagar e lucro pelo volume: mais um caso para a pesquisa de lojas e dinheiro.', 'P-014 (#98), D-003'],
  ['Mapas temáticos abertos por tempo limitado', 'Os nossos mundos podem entrar como novidade, com período grátis; cobrar ou não por mundo vai para a #98.', 'D-020, documento 08'],
  ['Continuação reescrita para crescer', 'Valida o "conteúdo é dado, não código" do nosso jogo.', 'D-011'],
  ['Regras do mundo ("mandamentos")', 'Escrever no documento 08 poucas regras de identidade que todo mundo do jogo respeita.', 'Documento 08, D-005'],
  ['Desafios diários com sequência', 'Para depois do MVP: um desafio do dia, ligado ao "desafio do dia com a mesma semente" da P-019.', 'P-019 (#101)'],
];

const html = `<title>Temple Run Benchmark</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
<style>
/* Layout: coluna de leitura de 46rem, diagramas em largura cheia; mesma família das páginas de benchmark, com o dourado do ídolo e o verde da selva */
:root {
  --bg: #f3f4ef; --surface: #fdfdf9; --fg: #141711; --muted: #555b4c; --line: #d8dccd;
  --accent: #2f6b3a; --gold: #9a6a08; --serie: #2a6fd0; --destaque: #d9581f;
  --display: "Barlow Condensed", "Arial Narrow", "Roboto Condensed", sans-serif;
  --body: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, Consolas, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #0c0e0a; --surface: #171a14; --fg: #e8ebe1; --muted: #a2a995; --line: #2c3226;
  --accent: #86d394; --gold: #e3b54d; --serie: #4f8fe8; --destaque: #de6a28; color-scheme: dark; } }
:root[data-theme="dark"] {
  --bg: #0c0e0a; --surface: #171a14; --fg: #e8ebe1; --muted: #a2a995; --line: #2c3226;
  --accent: #86d394; --gold: #e3b54d; --serie: #4f8fe8; --destaque: #de6a28; color-scheme: dark; }
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
  <span class="eyebrow">Benchmark de gameplay e estrutura · Resgate Espacial · 06/10/2026</span>
  <h1>Temple <span>Run</span></h1>
  <p class="lede">O jogo que levou a corrida infinita para o 3D, feito por três pessoas em cerca de cinco meses: como o controle nasceu de um fracasso, por que alguém está sempre atrás de você, os dois tipos de erro e como um preço de 99 centavos virou 2 bilhões de downloads.</p>
  <div class="facts"><span><b>2011</b> · Imangi Studios</span><span><b>3</b> pessoas</span><span><b>4</b> gestos</span><span><b>1%</b> pagava (2012)</span><span><b>2 bi</b> de downloads (2021)</span></div>
</header>
  <nav aria-label="Seções" class="chips"><a href="#nasceu">Como nasceu</a><a href="#pista">A pista</a><a href="#erro">Dois tipos de erro</a><a href="#laco">Entre corridas</a><a href="#tr2">Temple Run 2</a><a href="#negocio">Negócio</a><a href="#versus">× Jetpack Joyride</a><a href="#levar">O que levar</a></nav>

  <h2 id="nasceu">Como o jogo nasceu</h2>
  <p>Contado por Keith Shepherd, mostrando os três protótipos na GDC 2014, e pelos criadores nos 10 anos do jogo:</p>
  <ol class="steps">
    <li><b>O fracasso anterior:</b> o Max Adventure levou um ano, usava dois controles virtuais e quase ninguém entendia como jogar. Pergunta seguinte: como controlar um personagem 3D sem controle virtual?</li>
    <li><b>Um dia:</b> o personagem andando sem parar numa cidade, virando com gestos. Bater era morrer. Já era gostoso.</li>
    <li><b>Uma semana:</b> um labirinto infinito de caixas, só com curvas de 90° e câmera atrás (a câmera de cima dava tontura). Ficava mais rápido com o tempo, e isso bastava.</li>
    <li><b>O tema nasceu da mecânica:</b> as paredes de caixas pareciam a Muralha da China, e veio o templo.</li>
    <li><b>Por que correr?</b> Alguém tinha que estar atrás: primeiro alienígenas provisórios, depois os macacos demoníacos. Natalia achou assustadores e foi contra; depois admitiu que eles davam urgência e adrenalina.</li>
    <li><b>Testar sem explicar:</b> entregar o jogo a alguém sem dizer nada. Com o Temple Run, ninguém queria devolver o celular.</li>
  </ol>

  <h2 id="pista">A pista e a pressão</h2>
  <p>Quatro gestos: deslizar para os lados vira 90°, para cima pula, para baixo desliza, e inclinar o aparelho leva o personagem para um lado. Cada obstáculo pede um gesto que se entende pela forma. A pressão vem da velocidade, que sobe com a distância, e dos perseguidores, sempre atrás.</p>
</div>
<div class="wide">${fig(D.pista(D.TEMA))}</div>
<div class="wrap">
  <h2 id="erro">Dois tipos de erro</h2>
  <p>Um erro pequeno (uma raiz baixa, uma beirada) faz o personagem <b>tropeçar</b>, e os perseguidores aparecem logo atrás: é um aviso. Se ele tropeçar de novo logo em seguida, é pego. Um erro grande (muro, fogo, buraco, água, curva perdida) acaba a corrida na hora.</p>
</div>
<div class="wide">${fig(D.perseguicao(D.TEMA))}</div>
<div class="wrap">
  <p class="key">É uma segunda chance curta e tensa, sem barra de vida: o erro pequeno vira susto em vez de derrota.</p>

  <h2 id="laco">O laço entre corridas</h2>
  <ul class="points">
    <li><b>56 objetivos</b>, ligados às conquistas do Game Center; cada um soma +1 ao <b>multiplicador da pontuação</b>. O progresso entra no placar.</li>
    <li><b>Moedas</b> compram e melhoram os poderes (ímã, invencibilidade, impulso, moedas extras) e personagens.</li>
    <li><b>Recorde e amigos:</b> a competição na escola foi o motor da divulgação.</li>
  </ul>

  <h2 id="tr2">O Temple Run 2: o que mudou</h2>
  <p>Reescrito do zero, porque o primeiro não tinha sido feito para crescer, e sem mexer no que as pessoas gostavam: o mesmo controle e a mesma sensação.</p>
  ${tabela(null, [
    ['Pista', 'Curvas mais fechadas, tirolesas, trilhos de mina, cachoeiras, jatos de fogo; mais rápido'],
    ['Perseguidor', 'Um macaco gigante no lugar dos três'],
    ['Continuar', '"Salve-me" com gemas, dobrando o preço a cada vez; a primeira pode ser por anúncio'],
    ['Objetivos', 'Três por vez, formando níveis com recompensas'],
    ['Desafios', 'Diários com sequência (no 5º dia seguido, um baú), semanais e globais'],
    ['Mapas', '22 ambientes acrescentados ao longo dos anos; grátis por um tempo, depois 500 gemas'],
  ])}

  <h2 id="negocio">Negócio e operação</h2>
  <p>Lançado a US$ 0,99, já com compras. Entrou no top 100 e começou a cair. Seis semanas depois, ficou grátis "por um fim de semana": subiu ao 3º lugar dos grátis, passou a render mais do que pago e, ao cair de novo, parou perto do 100º lugar ainda ganhando mais. Ficou grátis. Sem marketing, chegou ao 1º lugar grátis e em receita no Ano-Novo de 2012, com 7 milhões de jogadores por dia e só 1% pagando. A tese da cofundadora: sem barreira para baixar e dá para jogar tudo sem pagar.</p>
</div>
<div class="wide">${fig(D.linhaDoTempo(D.TEMA))}</div>
<div class="wrap">
  <h2 id="versus">Temple Run × Jetpack Joyride</h2>
  ${tabela(['Tema', 'Temple Run', 'Jetpack Joyride'], [
    ['Controle', 'Quatro gestos e inclinação', 'Um botão'],
    ['Por que correr', 'Perseguidores atrás', 'Nenhuma ameaça atrás'],
    ['Erro', 'Tropeço avisa; o grande mata', 'Um golpe mata; o veículo é uma vida a mais'],
    ['Pontuação', 'Distância e moedas × multiplicador', 'Só a distância, de propósito'],
    ['Entre corridas', '56 objetivos (no 2, três por vez)', 'Três missões que se renovam'],
    ['Equipe e tempo', '3 pessoas, ~5 meses', 'Time da Halfbrick, 10 meses'],
  ])}

  <h2 id="levar">O que levar para o Resgate Espacial</h2>
  <p>Tudo aqui é <b>Proposta</b> para o Fernando decidir. Inspirar, nunca copiar: as ideias que viajam bem são de controle, de erro, de pressão e de produto.</p>
  ${tabela(['Ideia', 'Como poderia entrar', 'Ligado a'], levar.map(([a, b, c]) => [esc(a), esc(b), mono(c)]))}
  <p class="note"><b>Validações:</b> testar com pessoas sem explicar (documento 07); protótipo de controle antes da arte (M1); conteúdo como dado (D-011); fases curtas (D-028). <b>Diferença importante:</b> o Temple Run é uma corrida 3D sem fim, com quatro gestos; o nosso é uma nave 2D com fases fixas, ida e volta e pouso. O templo, os macacos e a pista são a identidade dele.</p>

  <h2>Como este material foi feito</h2>
  <p>A base são os criadores: a entrevista em vídeo de Keith Shepherd na GDC 2014, lida pela transcrição; as entrevistas dos 10 anos (Vice, 2021) e a de Natalia Luckyanova à TechCrunch (2012). Os números do jogo vêm da wiki dos jogadores e das lojas. Nenhum arquivo do jogo foi aberto. O documento completo, com as fontes, está em ${mono('docs/benchmark/temple-run.md')}.</p>
  <footer>Temple Run © Imangi Studios. Diagramas redesenhados para estudo, a partir das falas dos criadores e da Temple Run Wiki. Benchmark feito para o Resgate Espacial em 06/10/2026.</footer>
</div>
`;
fs.writeFileSync(path.join(OUT, 'pagina-de-leitura.html'), html);
console.log('Página gerada:', path.join(OUT, 'pagina-de-leitura.html'), Math.round(html.length / 1024) + ' KB');
