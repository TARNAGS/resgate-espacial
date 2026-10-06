// Gera a página de leitura do benchmark do Jetpack Joyride (saida/pagina-de-leitura.html).
// Os diagramas entram em SVG embutido, com as cores do tema (claro e escuro). Uso: node montar-pagina.js [pasta de saída]
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

const levar = [
  ['O placar fica puro: só a distância, sem multiplicador', 'Manter o ranking de cada fase como tempo puro. Estrelas, missões e moedas, se vierem, ficam fora dele.', 'D-024, P-006 (#53)'],
  ['O custo de perder em três partes', 'Revisar o fim de corrida: o que o jogador conseguiu, um próximo passo à vista e tentar de novo com um toque.', 'Documento 09, D-031'],
  ['Três missões que se renovam, com estrelas', 'Metas paralelas que fazem voltar sem mexer no ranking. Os elogios que já existem (CLOSE CALL, PERFECT LANDING…) viram missões naturais.', 'P-006, #81, replay alto'],
  ['Missões que apresentam funções', 'Quando houver loja ou modificadores, uma missão pode apresentá-los, sem tutorial.', 'P-017 (#78), D-031'],
  ['Serrote de intensidade', 'O nosso desenho já tem um: voo tenso, pouso no posto ou na tripulação, voo de novo. Os pousos são os nossos "veículos".', 'Documento 08, P-011, D-023'],
  ['Intervalos entre um mínimo e um máximo', 'Para a BONUS e fases geradas. O piloto automático garante que dá; o mínimo regula se é justo.', 'D-021, D-018, P-011'],
  ['Injustiça pequena e proposital', 'Continuar provando que todo trecho é possível, aceitar sustos e usar os mapas de calor para achar onde muita gente morre igual.', 'D-018, #91'],
  ['Troca de controle com transição', 'Se um item ou modificador mudar o controle: câmera lenta, tela limpa e uma trilha que ensina.', 'P-012 (#61), P-017'],
  ['Moedas que desenham o caminho', 'Uma trilha visual que sugere a rota nas primeiras fases, ensinando sem texto.', 'D-031, documento 08'],
  ['Um modo sem fim', 'Para depois: resgates em sequência numa corrida contínua, com o tanque como relógio.', 'Visão, D-020, P-012'],
  ['Loja que mexe no desempenho', 'Mostra o risco da P-017: o recorde passa a depender do que se comprou. Loja só visual mantém o ranking justo.', 'P-017, D-024'],
  ['Anúncios viraram a maior reclamação', 'Valida o "sem anúncios" da D-003.', 'D-003, P-014 (#98)'],
  ['Grátis rendeu mais do que pago (2011)', 'Mais um caso para a pesquisa de lojas e dinheiro.', 'P-014 (#98)'],
];

const html = `<title>Jetpack Joyride Benchmark</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
<style>
/* Layout: coluna de leitura de 46rem, diagramas em largura cheia; mesma família das páginas do Crazy Gravity e dos Gravitron, com o laranja de alerta do laboratório como destaque */
:root {
  --bg: #f4f3f0; --surface: #fffefb; --fg: #16130f; --muted: #5b5449; --line: #ddd7cc;
  --accent: #a33f0c; --hot: #d9581f; --serie: #2a6fd0; --destaque: #d9581f;
  --display: "Barlow Condensed", "Arial Narrow", "Roboto Condensed", sans-serif;
  --body: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, Consolas, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #0e0d0b; --surface: #1a1815; --fg: #ece7de; --muted: #a79f92; --line: #322e28;
  --accent: #ff9a5c; --hot: #de6a28; --serie: #4f8fe8; --destaque: #de6a28; color-scheme: dark; } }
:root[data-theme="dark"] {
  --bg: #0e0d0b; --surface: #1a1815; --fg: #ece7de; --muted: #a79f92; --line: #322e28;
  --accent: #ff9a5c; --hot: #de6a28; --serie: #4f8fe8; --destaque: #de6a28; color-scheme: dark; }
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
.eyebrow { font-family: var(--mono); font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
header.hero { padding-block: 3rem 1.5rem; display: grid; gap: 1rem; }
.hero h1 { font-size: clamp(3rem, 10vw, 6rem); font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; }
.hero h1 span { color: var(--hot); }
.lede { font-size: 1.15rem; color: var(--muted); max-width: 40rem; }
.facts { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; font-family: var(--mono); font-size: 0.85rem; color: var(--muted); font-variant-numeric: tabular-nums; }
.facts b { color: var(--fg); font-weight: 500; }
.chips { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-block: 1rem; }
.chips a { font-family: var(--mono); font-size: 0.8rem; text-decoration: none; color: var(--fg); border: 1px solid var(--line); background: var(--surface); padding: 0.15rem 0.45rem; border-radius: 4px; }
.chips a:hover { border-color: var(--accent); color: var(--accent); }
.diagram { margin: 1rem 0 1.5rem; }
.svg-wrap { background: var(--surface); border: 1px solid var(--line); border-radius: 6px; overflow-x: auto; padding: 0.5rem; }
.svg-wrap svg { display: block; width: 100%; min-width: 40rem; height: auto; }
figcaption, .caption { font-size: 0.85rem; color: var(--muted); margin-top: 0.5rem; }
.table-wrap { overflow-x: auto; margin-block: 1rem 1.5rem; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); }
table { border-collapse: collapse; width: 100%; font-size: 0.9rem; font-variant-numeric: tabular-nums; }
th, td { text-align: left; padding: 0.55rem 0.7rem; border-bottom: 1px solid var(--line); vertical-align: top; }
th { font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); font-weight: 500; }
tbody th { min-width: 8rem; }
tr:last-child td, tr:last-child th { border-bottom: 0; }
ul.points, ol.points { padding-left: 1.2rem; margin: 0 0 1rem; } .points li { margin-bottom: 0.45rem; }
.key { border-left: 3px solid var(--hot); padding: 0.2rem 0 0.2rem 0.9rem; margin: 1rem 0; }
.three { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.8rem; margin: 1rem 0; }
.three > div { background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 0.9rem 1rem; min-width: 0; }
.three h3 { margin: 0 0 0.4rem; font-size: 1.3rem; }
.three p { margin: 0; font-size: 0.92rem; }
.note { font-size: 0.9rem; color: var(--muted); background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 0.8rem 1rem; }
footer { margin-top: 4rem; font-size: 0.85rem; color: var(--muted); }
@media (max-width: 640px) { .three { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
</style>

<div class="wrap">
<header class="hero">
  <span class="eyebrow">Benchmark de gameplay e estrutura · Resgate Espacial · 06/10/2026</span>
  <h1>Jetpack <span>Joyride</span></h1>
  <p class="lede">Como funciona um jogo infinito, contado pelo próprio criador: como a corrida é montada, por que a primeira versão era chata, como perder virou parte da diversão e o que faz o jogador voltar.</p>
  <div class="facts"><span><b>2011</b> · Halfbrick Studios</span><span><b>1</b> botão</span><span><b>10</b> meses de desenvolvimento</span><span><b>3</b> missões ao mesmo tempo</span><span><b>100 mi+</b> downloads na Google Play</span></div>
</header>
  <nav aria-label="Seções" class="chips"><a href="#resumo">Resumo</a><a href="#corrida">A corrida</a><a href="#ritmo">O ritmo</a><a href="#perder">Perder</a><a href="#laco">Entre corridas</a><a href="#negocio">Negócio</a><a href="#perguntas">Perguntas do doc. 10</a><a href="#levar">O que levar</a></nav>

  <h2 id="resumo">Em uma página</h2>
  ${tabela(null, [
    ['Proposta', 'Um personagem com mochila a jato atravessa um laboratório sem fim. Segurar sobe, soltar cai; a meta é ir o mais longe possível.'],
    ['Autor', 'Halfbrick Studios (Austrália); design de Luke Muscat, o criador do Fruit Ninja. iOS em 01/09/2011.'],
    ['Negócio', 'Lançado pago; grátis com compras desde dezembro de 2011 (770 mil downloads no primeiro dia). Hoje também tem anúncios.'],
    ['Diversão', 'Um botão, física afinada, veículos absurdos, morrer com graça e sempre uma missão por perto.'],
    ['Dificuldade', 'Encostar em qualquer obstáculo acaba a corrida; com a distância, tudo fica mais denso e rápido.'],
    ['Recepção', 'Metacritic 90; Apple Design Award 2012; 4,7 na App Store com 103 mil avaliações.'],
  ])}

  <h2 id="corrida">Como a corrida é montada</h2>
  <p>Tudo é colocado pelo mesmo sistema: a corrida é uma sequência de espaços, e cada tipo de objeto (campos elétricos, moedas, lasers, mísseis, fichas, veículos) tem uma probabilidade de ocupar o próximo. A distância até o próximo objeto é sorteada entre um mínimo e um máximo.</p>
</div>
<div class="wide">${fig(D.intervalos(D.TEMA), 'Três jeitos de espaçar obstáculos, e o "medidor de reação" que o criador usa para regular o intervalo mínimo.')}</div>
<div class="wrap">
  <p class="key"><b>Injustiça pequena e proposital.</b> De vez em quando o jogo cria um trecho mais difícil do que o normal, nunca impossível. É de propósito: o jogador pode dividir a culpa com o jogo, em vez de sentir que errou sozinho.</p>
  ${tabela(['Obstáculo', 'O que faz', 'Com a distância'], [
    ['Campo elétrico', 'Barras paradas ou girando, em grupos; o mais comum', 'Mais densos e mais longos'],
    ['Míssil', 'Aviso na borda por 1 a 2 s; às vezes uma rajada de 5 a 10', 'Aviso mais curto, míssil mais rápido'],
    ['Laser', 'Carrega 1,5 s e cobre a tela na horizontal; vem sozinho', 'Mais rápidos; somem depois de uns 6 km'],
  ])}

  <h2 id="ritmo">O ritmo: por que a primeira versão era chata</h2>
  <p>No Natal de 2010, a empresa inteira jogou a primeira versão e disse que era chata. O criador primeiro achou que faltava variedade e acrescentou poderes; não adiantou. O problema era a <b>intensidade sempre igual</b>: a corrida esquentava e ficava no alto, sempre a um golpe da morte. Três corações e a tela vermelha dos jogos de tiro também não resolveram. Os <b>veículos</b> resolveram: pegar um derruba a tensão (o jogo desacelera, limpa a tela e dá uma vida a mais), perder devolve.</p>
</div>
<div class="wide">${fig(D.intensidade(D.TEMA), 'O criador considera os veículos a decisão mais importante para o sucesso do jogo.')}</div>
<div class="wrap">
  <p>Cada troca de controle ganhou uma transição (câmera lenta, explosão que limpa a tela e trilhas de moedas em seta que ensinam o veículo), porque, no primeiro grande teste, as pessoas morriam logo depois de trocar.</p>

  <h2 id="perder">O custo de perder</h2>
  <p>Num jogo infinito não dá para vencer, só ir mais longe. Então perder tem que ser divertido. Os slides da GDC dividem o custo de perder em três:</p>
  <div class="three">
    <div><h3>Tempo perdido</h3><p>Corridas curtas: a "jogada do intervalo comercial" era um pilar desde o começo.</p></div>
    <div><h3>Custo emocional</h3><p>A morte "se dissolve": o corpo rola e pega moedas, vem a roleta, e os resultados mostram o que deu certo.</p></div>
    <div><h3>Atrito para recomeçar</h3><p>Um toque, sem menus, para a próxima corrida.</p></div>
  </div>
  <p>Na FailCon de 2012, o criador resumiu: recompense a derrota, tenha sempre um próximo passo (as missões aparecem logo depois da morte) e diminua a barreira para tentar de novo.</p>

  <h2 id="laco">O laço entre corridas</h2>
</div>
<div class="wide">${fig(D.lacos(D.TEMA))}</div>
<div class="wrap">
  <h3>Missões: três testes até acertar</h3>
  <ol class="points">
    <li><b>Três por dia</b> (fácil, média, difícil): quem começava depois dos amigos nunca os alcançava.</li>
    <li><b>Duas, cumprir uma ou outra</b>: virou trabalho repetitivo.</li>
    <li><b>Três que se renovam</b>: quando uma termina, outra entra. O jogador quase nunca trava e pode cumprir várias na mesma corrida. Ficou.</li>
  </ol>
  <p>A recompensa virou estrelas que "batem" na tela. O criador recusou multiplicar a pontuação: o placar tinha que ser só a distância, para comparar com os amigos. As missões duram de 30 segundos a mais de 30 minutos, e há 44 tipos; algumas pedem para comprar algo na loja, e é assim que o jogo a apresenta.</p>
</div>
<div class="wide">${fig(D.niveis(D.TEMA), 'No fim do nível 15, uma insígnia (125 combinações) e as missões recomeçam.')}</div>
<div class="wrap">
  <h2 id="negocio">Negócio e operação</h2>
  <ul class="points">
    <li><b>Pago → grátis:</b> mais de 1 milhão de downloads pagos; grátis no fim de 2011, mais de 13 milhões até fevereiro de 2012. A Halfbrick disse que passou a ganhar mais grátis do que pago.</li>
    <li><b>O que vende:</b> moedas, o dobrador de moedas e a terceira vaga de gadget (US$ 4,99 cada), gadgets e reviver, que mudam o desempenho; roupas e mochilas só visuais.</li>
    <li><b>Anúncios:</b> hoje, com recompensa e entre corridas; é a crítica mais comum nas avaliações recentes.</li>
    <li><b>Processo:</b> protótipo em um dia, enviado à empresa inteira com um chocolate para o maior placar; atualizações a cada duas semanas com o retorno dos colegas; 13 atualizações nos dois primeiros anos.</li>
  </ul>

  <h2 id="perguntas">As perguntas do documento 10</h2>
  ${tabela(['Pergunta', 'No Jetpack Joyride'], [
    ['Como a fase é organizada', 'Sem fases: uma corrida sem fim, montada na hora por intervalos com probabilidades'],
    ['Como a dificuldade sobe', 'Com a distância; os veículos quebram a intensidade em serrote'],
    ['Como um elemento novo é apresentado', 'Avisos antes do perigo; transição com câmera lenta e trilhas de moedas; missões'],
    ['Metas por fase', 'Três missões ao mesmo tempo, recorde e ranking dos amigos'],
    ['Duração', 'A "jogada do intervalo comercial"'],
    ['O que faz voltar', 'Missões, níveis e insígnias, loja, roleta, desafio diário, eventos, bônus ao voltar'],
  ])}

  <h2 id="levar">O que levar para o Resgate Espacial</h2>
  <p>Tudo aqui é <b>Proposta</b> para o Fernando decidir. Inspirar, nunca copiar: as ideias que viajam bem são de estrutura, não de conteúdo.</p>
  ${tabela(['Ideia', 'Como poderia entrar', 'Ligado a'], levar.map(([a, b, c]) => [esc(a), esc(b), `<span style="font-family:var(--mono);font-size:0.85em">${esc(c)}</span>`]))}
  <p class="note"><b>Validações:</b> física e controle primeiro (o nosso M1); testar com gente cedo e sempre (os nossos playtests); ler o feedback com cuidado ("chato" queria dizer intensidade sempre igual, não falta de conteúdo); partidas curtas (o nosso ICP). <b>Diferença importante:</b> o Jetpack Joyride não tem fases nem fim; o nosso tem fases fixas, ranking por fase e um objetivo. O laboratório, os campos elétricos e os veículos são a identidade dele.</p>

  <h2>Como este material foi feito</h2>
  <p>A base é o próprio criador: o vídeo "How I designed Jetpack Joyride" (2023), lido pela transcrição, e os slides da palestra da GDC 2012, com texto e imagens lidos um a um. Os números do jogo vêm da wiki dos jogadores e das lojas; a história do negócio, de matérias de 2012. Nenhum arquivo do jogo foi aberto. O documento completo, com as fontes, está no repositório, em <span style="font-family:var(--mono);font-size:0.85em">docs/benchmark/jetpack-joyride.md</span>.</p>
  <footer>Jetpack Joyride © Halfbrick Studios. Diagramas redesenhados para estudo, a partir dos slides de Luke Muscat (GDC 2012) e da Jetpack Joyride Wiki. Benchmark feito para o Resgate Espacial em 06/10/2026.</footer>
</div>
`;
fs.writeFileSync(path.join(OUT, 'pagina-de-leitura.html'), html);
console.log('Página gerada:', path.join(OUT, 'pagina-de-leitura.html'), Math.round(html.length / 1024) + ' KB');
