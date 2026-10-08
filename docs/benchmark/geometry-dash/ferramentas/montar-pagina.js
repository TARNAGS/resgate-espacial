// Gera a página de leitura do benchmark do Geometry Dash (saida/pagina-de-leitura.html).
// Os diagramas entram em SVG embutido, com as cores do tema; a tabela das fases sai de ../fases.json.
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
const tabela = (cab, linhas, cls = '') => `<div class="table-wrap"><table${cls ? ` class="${cls}"` : ''}>${cab ? `<thead><tr>${cab.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>` : ''}<tbody>${linhas.map((l) => `<tr>${l.map((c, i) => (i === 0 && !cab ? `<th>${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`;
const mono = (t) => `<span class="mono">${esc(t)}</span>`;
const total = F.principais.reduce((a, f) => a + f.segundos, 0);

const fases = F.principais.map((f) => [
  `<span class="num">${f.n}</span>`,
  esc(f.nome),
  `<span class="dif dif-${f.dificuldade.toLowerCase()}">${f.dificuldade}</span>${f.trancadaPorMoedas ? ` <span class="small">${f.trancadaPorMoedas} moedas</span>` : ''}`,
  `<span class="num">${f.estrelas}</span>`,
  `<span class="num">${f.segundos} s</span>`,
  esc(f.novidade),
  mono(f.entrou.versao),
]);

const levar = [
  ['Checkpoint como parte da fase, com o relógio correndo (a Torre)', 'Para a fase grande: checkpoints fixos, desenhados na fase, valem na corrida; o tempo corre direto, então morrer custa o tempo de voltar; o ranking continua sendo o tempo total; um botão "recomeçar do zero" para quem disputa tempo. É o que a fase já faz com a base e a plataforma da tripulação.', 'Fase grande (doc. 13), D-024, P-006'],
  ['Treino que não vale (modo prática)', 'O TRAINING vira "praticar esta fase": pontos de retorno onde o jogador quiser, sem ranking, sem elogios e com um sinal claro de treino. Atende quem ainda aprende a pousar sem mexer em quem disputa tempo.', 'Doc. 09 achado 4, D-031, P-009'],
  ['Progresso parcial à vista', 'Mostrar, na morte, até onde o jogador chegou e guardar a melhor marca de cada fase. A derrota vira progresso, principalmente para quem está travado.', 'P-006, ativação, D-027'],
  ['Dica de uma linha só depois de errar', 'Testar no nível 1 uma frase curta sobre o propulsor depois de duas mortes no mesmo ponto. Contradiz em parte a D-031; o jogador travado teve 30 dos 54 fins de jogo.', 'D-031, D-027, P-009'],
  ['Um mundo de 10 fases curtas, uma novidade por fase', 'Confirma o desenho do Mundo 1: fases de 30 a 40 s, cada uma com uma coisa só.', 'D-020, doc. 08'],
  ['O par "apresenta e cobra"', 'Cada obstáculo novo estreia numa fase fácil, em espaço amplo; a fase-chefe combina os do mundo. Nunca estrear um obstáculo na fase-chefe.', 'Doc. 08, P-011'],
  ['Ajuda que vira armadilha', 'O mesmo objeto duas vezes: primeiro ajuda (uma corrente de ar que leva ao posto), depois contra (empurrando para a parede).', 'P-011, P-012'],
  ['Metas opcionais por fase (as três moedas)', 'Três metas fora do ranking: caminho escondido, terminar sem abastecer, terminar abaixo de um tempo. Os elogios atuais são candidatos.', 'P-006, #81'],
  ['Uma fase nova por semana', 'A North Star é concluir uma fase nova na semana. Uma fase da semana com semente fixa e ranking próprio é o motor mais direto dela.', 'Doc. 13, P-019, D-021'],
  ['Anúncio nunca entre uma morte e outra', 'O Lite mostra anúncio a cada algumas mortes, o pior momento num jogo em que se morre muito. Anúncio só em pausas naturais ou por escolha.', 'Doc. 13 (5.2), P-014'],
  ['Pago + grátis em dois aplicativos', 'Referência para a #98, com ressalva: o argumento (subir no ranking dos pagos) é de 2013 a 2015, e o próprio criador diz que hoje é mais difícil.', 'P-014, P-015'],
  ['Cosméticos que só se ganham jogando', 'Cores e formas da nave por fases, metas e conquistas, sem compra e sem sorteio pago.', 'P-017, D-034, D-035'],
  ['Ranking que precisa de guarda', 'Top 100 com aprovação de moderadores, congelado 4 anos por trapaça; recordes da Demonlist só com vídeo. Reforça proteger o ranking antes do lançamento.', 'P-023, D-036, doc. 11'],
  ['A dificuldade vira vídeo', 'A "raiva" fez criadores de conteúdo mostrarem o jogo. Um replay ou "fantasma" fácil de compartilhar é a nossa versão.', 'Canais (doc. 13), doc. 11'],
  ['Menos luz piscando, salvamento que não se perde', 'As duas reclamações sérias e evitáveis das avaliações. Uma opção de menos efeitos e o perfil online que já existe.', 'D-029, #102'],
  ['"Geometry Dash, só que pilotando uma nave"', 'Vale como frase interna: o modo nave dele é um botão contra a gravidade, e o público é o nosso. A diretriz 2.3.7 da App Store proíbe citar outros apps no subtítulo; na loja, só textos próprios.', 'Doc. 13 (3.3), P-003'],
];

const html = `<title>Geometry Dash Benchmark</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
<style>
/* Layout: coluna de leitura de 46rem, diagramas e a tabela das fases em largura cheia; mesma família das páginas de benchmark, com o amarelo das estrelas e o azul da série */
:root {
  --bg: #f2f3f5; --surface: #fcfcfd; --fg: #11141a; --muted: #4f5767; --line: #d5d9e1;
  --accent: #2357b0; --gold: #946c00; --serie: #2a6fd0; --destaque: #d9581f; --ok: #2e8b57; --cinza: #9aa3b2;
  --display: "Barlow Condensed", "Arial Narrow", "Roboto Condensed", sans-serif;
  --body: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, Consolas, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #0b0d12; --surface: #151922; --fg: #e7eaf0; --muted: #a0a8b8; --line: #2a303c;
  --accent: #7fb0ff; --gold: #f0c64a; --serie: #4f8fe8; --destaque: #e46c2c; --ok: #48b07a; --cinza: #6b7484; color-scheme: dark; } }
:root[data-theme="dark"] {
  --bg: #0b0d12; --surface: #151922; --fg: #e7eaf0; --muted: #a0a8b8; --line: #2a303c;
  --accent: #7fb0ff; --gold: #f0c64a; --serie: #4f8fe8; --destaque: #e46c2c; --ok: #48b07a; --cinza: #6b7484; color-scheme: dark; }
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
.num { font-variant-numeric: tabular-nums; white-space: nowrap; }
.small { font-size: 0.8em; color: var(--muted); white-space: nowrap; }
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
table.fases { min-width: 46rem; }
.dif { font-family: var(--mono); font-size: 0.78rem; padding: 0.05rem 0.35rem; border-radius: 3px; border: 1px solid var(--line); white-space: nowrap; }
.dif-demon { color: var(--destaque); border-color: var(--destaque); }
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
  <span class="eyebrow">Benchmark de dificuldade e estrutura · Resgate Espacial · 08/10/2026</span>
  <h1>Geometry <span>Dash</span></h1>
  <p class="lede">Um botão, fases fixas de 90 segundos e uma morte que volta ao começo. Como um sueco sozinho fez da dificuldade um produto que segura adolescentes há doze anos: a curva das 22 fases, o mundo de 10 fases curtas, o treino que não vale, os checkpoints que valem e o grátis que leva ao pago.</p>
  <div class="facts"><span><b>2013</b> · RobTop Games</span><span><b>1</b> pessoa</span><span><b>22</b> fases oficiais</span><span><b>${Math.round(total / 60)} min</b> de corrida perfeita</span><span><b>150 mi+</b> fases da comunidade</span><span><b>100 mil</b> no Steam (jan/2026)</span></div>
</header>
  <nav aria-label="Seções" class="chips"><a href="#nasceu">Como nasceu</a><a href="#funciona">Como funciona</a><a href="#curva">A curva</a><a href="#world">O mundo de 10 fases</a><a href="#checkpoints">Checkpoints e ranking</a><a href="#comunidade">Comunidade</a><a href="#negocio">Negócio</a><a href="#versus">× os outros casuais</a><a href="#levar">O que levar</a></nav>

  <h2 id="nasceu">Como o jogo nasceu</h2>
  <p>Contado pelo próprio Robert "RobTop" Topala: entrevista à Cult of Mac (2014), um texto dele no Game Developer (2015) e 231 respostas em duas sessões de perguntas no Reddit (2022 e 2024).</p>
  <ol class="steps">
    <li><b>Fracassos pequenos antes:</b> um jogo em Flash enquanto estudava engenharia civil, um jogo grande demais que nunca saiu e quebra-cabeças para celular que tiveram downloads, mas renderam pouco e não faziam ninguém voltar.</li>
    <li><b>Um cubo que pulava e batia:</b> sem plano detalhado, quatro meses de trabalho em meio período, iterando "até o jogo parecer certo". Inspirações declaradas: The Impossible Game, Bit.Trip Runner e Super Meat Boy.</li>
    <li><b>O lançamento afundou</b> (US$ 1,99, sem marketing). Voltou devagar, por boca a boca, até o 1º lugar dos pagos menos de um ano depois.</li>
    <li><b>Uma fase nova por mês</b> no primeiro ano, cada uma com uma mecânica nova: de 7 fases em agosto de 2013 a 18 em novembro de 2014.</li>
    <li><b>O que ele diz que deu certo:</b> o pago com uma versão Lite grátis, o editor com compartilhamento fácil, músicas e arte personalizáveis, nada atrás de pagamento e um jogo base difícil, que fez criadores de conteúdo mostrarem o jogo. "E uma boa dose de sorte."</li>
  </ol>

  <h2 id="funciona">Como o jogo funciona</h2>
  <p>O ícone avança sozinho, e a fase é sincronizada com uma música. Um toque faz tudo, mas o que ele faz muda com o <b>modo</b>: o cubo pula, a <b>nave</b> sobe enquanto se segura e cai quando se solta, a bola inverte a gravidade, e assim até oito modos. Encostou num perigo, a fase volta ao 0%, e o ícone reaparece sozinho, sem tela nem botão, com o contador de tentativas à vista.</p>
  ${tabela(null, [
    ['Progresso parcial', 'Barra e porcentagem; "New Best!" ao bater mais longe do que nunca'],
    ['Recompensas', 'Estrelas ao concluir; três moedas secretas por fase; orbs pagos pela porcentagem alcançada (80% pelo recorde, 20% na conclusão)'],
    ['Ensino', 'Sem tutorial. Uma frase na tela só depois de duas batidas no primeiro obstáculo, nas fases 1 e 3'],
    ['Portão', 'As três fases Demon só abrem com 10, 20 e 30 moedas secretas'],
  ])}
</div>

<div class="wrap"><h2 id="curva">A curva das 22 fases oficiais</h2>
  <p>Uma rampa perfeita nas 12 primeiras (uma estrela a mais por fase) e, depois, um serrote em pares: cada atualização traz uma fase que <b>apresenta</b> uma mecânica num nível mais baixo e um Demon que <b>cobra</b> tudo junto. A novidade nunca estreia no Demon. Todas as fases duram de 82 a 102 segundos: a dificuldade sobe pela densidade e pela precisão, não pelo tamanho.</p>
</div>
<div class="wide">${fig(D.curva(D.TEMA))}
${tabela(['#', 'Fase', 'Dificuldade', 'Estrelas', 'Duração', 'Novidade', 'Versão'], fases, 'fases')}</div>
<div class="wrap">
  <p class="key">19 das 22 fases apresentam uma mecânica. A primeira fase sem novidade, Base After Base, é chamada de "esquecível" pela comunidade; as duas seguintes são o primeiro grande salto de dificuldade e ainda travam jogadores.</p>

  <h2 id="world">Um mundo de 10 fases curtas</h2>
  <p>O spin-off grátis <b>Geometry Dash World</b> (2016) tem 10 fases jogadas em sequência, em 2 mundos de 5. Cada uma dura cerca de 30 segundos e apresenta uma coisa só. É o formato mais próximo dos nossos mundos de 10 fases.</p>
</div>
<div class="wide">${fig(D.mundo(D.TEMA))}</div>
<div class="wrap">
  <h2 id="checkpoints">Checkpoints e ranking</h2>
  <p>A pergunta aberta da fase grande. O Geometry Dash tem três respostas, uma para cada tipo de fase:</p>
</div>
<div class="wide">${fig(D.checkpoints(D.TEMA))}</div>
<div class="wrap">
  <ul class="points">
    <li><b>Fase clássica:</b> a conclusão que vale é a corrida sem morrer. O ranking da fase ordena pela porcentagem, depois pelas moedas, depois pelo tempo.</li>
    <li><b>Modo prática:</b> checkpoints livres (o jogo põe sozinho, se o jogador quiser), progresso à parte, nenhuma recompensa e uma música própria em loop, para não haver dúvida de que é treino.</li>
    <li><b>Fase de plataforma (a Torre, 2023):</b> os checkpoints são desenhados na fase e valem; não existe modo prática; o ranking é pelo tempo total, e a terceira moeda pede terminar abaixo de um tempo. Pelo que tudo indica, o relógio corre desde o começo, mortes incluídas, e há um botão para recomeçar sem checkpoints.</li>
  </ul>
  <p class="key">O nosso jogo já funciona como a fase de plataforma: a base e a plataforma da tripulação são pontos de retorno, o tempo corre direto e, no playtest, quem disputava tempo recomeçava logo depois da primeira morte. A fase grande pode seguir esse caminho sem mexer no ranking por tempo puro.</p>

  <h2 id="comunidade">O laço entre fases e a comunidade</h2>
  <ul class="points">
    <li><b>Mais de 150 milhões de fases da comunidade.</b> Para publicar, é preciso concluir a fase no modo normal. O próprio criador escolhe as que ganham estrelas e destaque, procurando fases que se leem bem na primeira vez.</li>
    <li><b>Fase do dia e demon da semana,</b> escolhidas por ele; algumas fases do dia foram trocadas por serem difíceis demais.</li>
    <li><b>Missões a cada 8 horas, baús</b> a cada 3 h 45 e a cada 24 h, caminhos com prêmios a cada 100 estrelas.</li>
    <li><b>Ranking global por estrelas</b> (progresso, não velocidade). O Top 100 só mostra jogadores aprovados por moderadores e ficou congelado de 2017 a 2021 por causa de trapaça. A lista dos Demons mais difíceis só aceita recorde com vídeo.</li>
  </ul>

  <h2 id="negocio">Negócio e operação</h2>
  <p>Dois aplicativos. O completo é pago (hoje US$ 3,99 no celular e US$ 4,99 no Steam), sem anúncios e sem compras; na App Store, declara não coletar dados. O Lite é grátis, com anúncios: começou com uma fase e hoje tem quase todas, mas não tem o editor. O motivo, segundo o criador: subir no ranking dos pagos exigia muito menos downloads do que no dos grátis, e o Lite rendia anúncios enquanto mandava gente para o pago. Ele reconhece que hoje é mais difícil, porque as lojas destacam escolhas de editores antes dos rankings.</p>
</div>
<div class="wide">${fig(D.funil(D.TEMA))}</div>
<div class="wrap">
  ${tabela(['Dado', 'Valor'], [
    ['Downloads', '20 milhões (jun/2014); quase 80 milhões (fev/2015); 242 milhões estimados (2018)'],
    ['Receita nas lojas', 'US$ 21 milhões brutos até set/2018, só vendas (Sensor Tower)'],
    ['Lucro da empresa', '75,2 milhões de coroas suecas em 2018 e 313 milhões em quatro anos (Breakit, 2019)'],
    ['Steam', '648.898 avaliações, 93% positivas; recorde de 100 mil jogadores simultâneos em jan/2026'],
    ['Google Play', 'Lite: 500 milhões+ de instalações; World: 100 milhões+; completo: 10 milhões+'],
  ])}
  <p>Os anúncios do Lite aparecem a cada algumas mortes, segundo resenhas, e o botão de pular demora a aparecer. Num jogo em que se morre a cada poucos segundos, é o momento mais incômodo possível.</p>
</div>
<div class="wide">${fig(D.linhaDoTempo(D.TEMA))}</div>
<div class="wrap">
  <p>Depois do primeiro ano, as atualizações cresceram e espaçaram: a 2.2 levou quase sete anos ("feature creep", nas palavras do criador). Mesmo sem fase oficial nova, os picos de jogadores subiram, porque a comunidade segurou o jogo.</p>

  <h2 id="versus">× os outros casuais do ICP</h2>
  ${tabela(['Tema', 'Geometry Dash', 'Jetpack Joyride', 'Temple Run'], [
    ['Fases', '<b>Fixas e numeradas</b>', 'Corrida sem fim', 'Corrida sem fim'],
    ['Erro', 'Volta ao 0%', 'Um golpe mata', 'Tropeço avisa; o segundo mata'],
    ['Treino', '<b>Prática com checkpoints, que não vale</b>', 'Não tem', 'Não tem'],
    ['Como se mede', 'Concluir; recorde de %; estrelas', 'Só a distância', 'Distância e moedas × multiplicador'],
    ['Por que voltar', 'Fases novas da comunidade, todo dia', 'Missões que se renovam', 'Objetivos e melhorias'],
    ['Negócio', '<b>Pago sem anúncios + grátis com anúncios</b>', 'Grátis com anúncios e compras', 'Grátis com compras'],
    ['Quem fez', '1 pessoa, 4 meses em meio período', 'Time da Halfbrick, 10 meses', '3 pessoas, cerca de 5 meses'],
  ])}
  <p>Dos três, é o único que vende dificuldade com fases fixas, como o nosso; o único que separa treino de conclusão; e o único pago.</p>

  <h2 id="levar">O que levar para o Resgate Espacial</h2>
  <p>Tudo aqui é <b>Proposta</b> para o Fernando decidir. Inspirar, nunca copiar: as ideias são de estrutura, de custo do erro e de produto. Fases, músicas, nomes e arte são a identidade do Geometry Dash.</p>
  ${tabela(['Ideia', 'Como poderia entrar', 'Ligado a'], levar.map(([a, b, c]) => [esc(a), esc(b), mono(c)]))}
  <p class="note"><b>Validações:</b> fases fixas e iguais para todos (D-021); recomeço quase instantâneo (os nossos jogadores já recomeçavam em 0,9 s); uma novidade por fase; mundos de 10 fases (D-020); sem tutorial (D-031), com o alerta da dica mínima; aparência separada do ranking (D-034, D-035); um desenvolvedor só fez tudo; fases de durações diferentes convivem. <b>Diferença importante:</b> no Geometry Dash clássico a tela anda sozinha, então todos levam o mesmo tempo, e o tempo não serve de placar; no nosso, o jogador controla a velocidade, e o tempo é a medida natural de habilidade. A dificuldade dele é ritmo e memória; a nossa é física, combustível, ida e volta e pouso. E a vida longa dele vem do editor e da comunidade, um investimento que, para nós, fica para depois do lançamento.</p>

  <h2>Como este material foi feito</h2>
  <p>A base é o criador (Cult of Mac, Game Developer, as duas AMAs no Reddit e o guia oficial de avaliação de fases) e a Geometry Dash Wiki, pela interface de dados, para os números de cada fase. Lojas, Steam, Common Sense Media e imprensa completam. Nenhum arquivo do jogo foi baixado ou aberto. O que foi inferido (o relógio das fases de plataforma, por exemplo) está marcado no documento completo, com as fontes, em ${mono('docs/benchmark/geometry-dash.md')}.</p>
  <footer>Geometry Dash © RobTop Games. Gráficos e esquemas redesenhados para estudo, a partir da Geometry Dash Wiki e das falas do criador. Benchmark feito para o Resgate Espacial em 08/10/2026.</footer>
</div>
`;
fs.writeFileSync(path.join(OUT, 'pagina-de-leitura.html'), html);
console.log('Página gerada:', path.join(OUT, 'pagina-de-leitura.html'), Math.round(html.length / 1024) + ' KB');
