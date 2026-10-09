# Benchmark comparativo: Candy Crush Saga, Plants vs. Zombies e Subway Surfers

| Campo | Valor |
|---|---|
| Documento | Benchmark comparativo dos casuais do ICP — Candy Crush Saga, Plants vs. Zombies e Subway Surfers |
| Versão | 1.0 |
| Data | 09/10/2026 |
| Status | Referência (em construção: os jogos entram um por vez) |
| Responsável | Fernando Nunes (Product Manager) |
| Cartão | [#99](https://github.com/TARNAGS/resgate-espacial/issues/99), que fecha os cinco casuais da D-028 (Jetpack Joyride e Temple Run já estudados em [#107](https://github.com/TARNAGS/resgate-espacial/issues/107) e [#108](https://github.com/TARNAGS/resgate-espacial/issues/108)) |

**Pergunta:** o que os três casuais que faltavam fazem com fases, progressão e o que faz voltar que o nosso jogo pode aproveitar, em especial o **mapa longo com metas por fase**, que o Geometry Dash não respondeu: mundos de 10 fases (D-020), mapa de progresso (D-015), pontuação (P-006) e medição (P-008).

**Tamanho:** comparativo, pela skill `discovery-de-jogos` (os casuais do #99): uma seção por jogo e uma tabela lado a lado com as perguntas do documento 10, seção 4. Cada jogo pode ganhar um estudo completo depois, se o Fernando pedir.

**Atenção a uma decisão que mudou:** o cartão #99 lista "sem anúncios (D-003)" em "o que não copiar". A revisão do Lean Canvas (documento 13, 07/10/2026) colocou anúncios no jogo, "sem ser tóxico ou excessivo" e sempre fáceis de fechar. Este estudo usa a regra nova.

## Sumário

1. [Resumo](#1-resumo)
2. [Candy Crush Saga](#2-candy-crush-saga)
3. [Plants vs. Zombies](#3-plants-vs-zombies)
4. [Subway Surfers](#4-subway-surfers)
5. [Lado a lado](#5-lado-a-lado)
6. [O que levar para o Resgate Espacial](#6-o-que-levar-para-o-resgate-espacial)
7. [Como este material foi feito](#7-como-este-material-foi-feito)
8. [Fontes](#8-fontes)

## 1. Resumo

| Item | Candy Crush Saga |
|---|---|
| Proposta | Combinar três doces iguais para cumprir a meta da fase em poucas jogadas |
| Autor | King (Suécia), 2012; estudada a versão de celular, pelo wiki dos fãs consultado em 09/10/2026 |
| Modelo de negócio | Grátis, com compras: vidas, jogadas extras e reforços (boosters) |
| Tamanho | **23.525 fases** em mais de 270 episódios; os dois primeiros com 10 fases, os outros com 15 |
| Onde estava a diversão | Uma meta clara por fase, cumprida em 15 a 33 jogadas, e um elemento novo a cada 4 fases no começo |
| Onde estava a dificuldade | Picos isolados no meio de fases fáceis, avisados no mapa; adiante, fases "quase impossíveis" |
| Lição principal | A King mede diversão e dificuldade separadas, conserta sempre as 100 fases menos divertidas e concluiu que "fases difíceis demais nunca compensam" |

## 2. Candy Crush Saga

### 2.1 Como funciona

- **Fase:** um tabuleiro fixo, com uma meta e um limite de jogadas (ou de tempo, nas antigas). Quatro tipos de meta: pedido (juntar X doces ou elementos), geleia (limpar as casas com geleia), ingredientes (levar ingredientes até a base) e pontos. Desde a fase 9, a mesma fase pode juntar duas metas.
- **Estrelas:** três metas de pontos por fase. A primeira estrela é passar; a segunda e a terceira pedem muito mais. Na fase 1: 5.120, 47.233 e 92.400 pontos, ou seja, 9 e 18 vezes a primeira. Passar é para todos; as três estrelas são para quem quer dominar.
- **Mapa:** uma trilha única de fases numeradas, dividida em episódios com nome e tema. Os dois primeiros episódios têm 10 fases; todos os outros, 15. Segundo o wiki, o elemento novo de cada episódio entra na fase de abertura.
- **Vidas:** até 5; cada derrota ou desistência gasta uma, e uma volta a cada 30 minutos. Sem vidas, não dá para jogar. O wiki dos fãs chama as vidas de "provavelmente o elemento mais odiado do jogo".

### 2.2 Fases e curva (amostra de 110 fases)

Amostra: as fases 1 a 80 (seis episódios, onde o jogo ensina) e duas amostras adiante (1001 a 1015 e 5001 a 5015). Dados em [`casuais-do-icp/candy-crush.json`](casuais-do-icp/candy-crush.json), coletados por [`ferramentas/candy-crush.mjs`](casuais-do-icp/ferramentas/candy-crush.mjs). A dificuldade é a nota dada pelos fãs no wiki, não um número da King.

| Trecho | Dificuldade (nota dos fãs) | Jogadas por fase | Novidades | Tipos de meta |
|---|---|---|---|---|
| Fases 1 a 80 | 48 muito fáceis, 23 fáceis ou quase, 5 médias, 3 difíceis ou quase | 15 a 33 (média 25,5) | **21** (uma a cada 3,8 fases) | Pedido 24, geleia 25, ingredientes 17, duas metas 14 |
| Fases 1001 a 1015 | Misturadas: 5 fáceis ou quase, 3 médias, 5 difíceis ou mais | 15 a 26 (média 17,8) | 0 | Geleia 7, ingredientes 5, pedido 3 |
| Fases 5001 a 5015 | 3 "quase impossíveis", 3 muito difíceis, 5 difíceis ou quase, nenhuma fácil | 15 a 30 (média 21,3) | 0 | Misturadas, 5 com duas metas |

**O que a curva mostra:**
- **Rampa muito suave no começo:** as 25 primeiras fases são todas "muito fáceis". A primeira "difícil" é a 46.
- **Serrote dentro do episódio:** os picos aparecem sozinhos no meio de fases fáceis (46, 59 e 72), e não no fim do episódio.
- **O jogo avisa no mapa:** o wiki marca rótulos de dificuldade que o jogo mostra antes da fase ("Super hard", "Nightmarishly hard", "Extremely hard", "Legendary"). Na amostra, 16 das 110 fases têm um deles.
- **Ensino em ritmo fixo:** as novidades caem a cada 3 ou 4 fases nas 80 primeiras e param depois. Adiante, o jogo só combina o que já ensinou, e fica mais curto em jogadas.

### 2.3 Como a King mede e conserta as fases

Palestra na GDC de março de 2024, de Jan Wedekind (insights) e Xavier Guardiola (ciência de dados), relatada pelo mobilegamer.biz:
- **Diversão e dificuldade são medidas separadas**, porque "andam inevitavelmente juntas". A diversão vem de duas medidas: o tempo até o jogador abandonar e o tempo até passar. Fase difícil pode ser divertida, e fase fácil pode ser chata.
- **A habilidade do jogador entra na conta:** vitórias, derrotas e tentativas por fase formam um perfil, e a dificuldade da fase é pesada por esse perfil.
- **As 100 fases menos divertidas são consertadas sempre**, num ciclo contínuo, e isso deu "um aumento muito significativo" de engajamento.
- **Duração:** "quanto mais longa a fase, menor a chance de ser divertida", e o tamanho máximo recomendado depende da dificuldade.
- **A fase 65:** era para ser a última do jogo e ficou difícil demais. Virou a fase que mais vendeu e a que mais fez gente desistir. Num teste A/B longo, a versão mais fácil segurou os jogadores por mais tempo. Conclusões dos palestrantes: fases difíceis demais "nunca compensam, ao menos no longo prazo", e "a retenção sempre vence".
- **Robôs que imitam pessoas:** a King testa as fases antes de lançar com um robô treinado para escolher a jogada que uma pessoa escolheria, e não a melhor. Segundo uma entrevista de Sahar Asadi (fonte secundária, números da própria empresa), ele cortou 95% dos ajustes manuais.

### 2.4 O que faz voltar e o que não copiar

- **Volta:** a próxima fase sempre à vista no mapa, a novidade de cada episódio, as estrelas que faltam e os eventos (alguns pedem para não perder nenhuma fase).
- **Não copiar:** as vidas que bloqueiam o jogo para vender recarga. Vão contra a diversão gratuita de passar a fase (proposta de valor do documento 13) e são o elemento mais odiado do jogo. E as fases "quase impossíveis" feitas para vender jogadas: a própria King mostrou que elas cobram em jogadores.

## 3. Plants vs. Zombies

### 3.1 Como funciona

- **Proposta:** defender a casa plantando plantas em linhas de um gramado, contra zumbis que andam da direita para a esquerda. O sol, que cai do céu e nasce dos girassóis, paga as plantas.
- **Autor:** PopCap Games, 2009 (computador), depois em celulares. Criador: George Fan. Estudado o modo Aventura do jogo original, pelo wiki dos fãs consultado em 09/10/2026.
- **Modelo de negócio:** jogo pago no lançamento. A versão grátis para celular (Plants vs. Zombies FREE) veio depois.
- **Tamanho:** o modo Aventura tem **50 fases em 5 mundos de 10** (Dia, Noite, Piscina, Neblina e Telhado). Depois dele, abrem minijogos, quebra-cabeças e um modo de sobrevivência.

### 3.2 O molde de cada mundo de 10 fases

Cada mundo segue o mesmo ritmo (wiki, página "Adventure Mode"):

| Fase do mundo | O que acontece |
|---|---|
| 1, 2, 3, 5, 6, 7 e 8 | Uma planta nova no fim da fase |
| 1, 3, 6 e 8 | Um zumbi novo aparece |
| 4 | Um item no fim (no Dia, a pá) |
| 5 | **Fase bônus:** um minijogo com regra diferente (no Dia, o boliche de nozes) |
| 9 | Um bilhete dos zumbis (o pouco de história que o jogo tem) |
| 10 | **Fase de esteira:** não tem sol, as plantas chegam numa esteira; no fim, a planta que o próximo mundo pede |
| 50 (5-10) | O chefe, Dr. Zomboss, e os créditos |

**Cada mundo muda uma regra do gramado:** a Noite tira o sol do céu (pede cogumelos), a Piscina põe água em duas das seis linhas, a Neblina esconde parte da tela, e o Telhado inclina o terreno (pede vasos e plantas que arremessam).

**O primeiro mundo ensina reduzindo o tabuleiro:** a fase 1-1 tem uma linha só, a 1-2 e a 1-3 têm três. A variedade de zumbis cresce de um tipo na 1-1 para quatro na 1-6. As "bandeiras" (as ondas grandes) começam em zero na 1-1, passam a uma e chegam a duas na 1-7.

**Segunda volta mais difícil:** quem termina a Aventura pode jogar de novo. As fases ganham uma bandeira a mais, os zumbis perigosos aparecem mais, e o Crazy Dave fixa três plantas sorteadas que o jogador não pode trocar.

### 3.3 Como o criador ensinou a jogar

Palestra de George Fan na GDC de 2012, "How I Got My Mom to Play Through Plants vs. Zombies" (resumida por notas de quem assistiu; vídeo nas fontes). As dez técnicas:

1. **O tutorial se mistura ao jogo:** ninguém percebe que está num tutorial.
2. **Fazer, não ler:** a pá passou por quatro versões até o boliche de nozes ensinar a coisa certa.
3. **Espalhar as mecânicas:** uma ferramenta nova a cada umas 5 fases; na primeira visita à loja, só dá para comprar um item. "Deixe o jogador brincar com os brinquedos antes de dar outros."
4. **Fazer o jogador agir uma vez:** o primeiro girassol custa o sol que o jogador tem, e o botão acende.
5. **Poucas palavras:** no máximo oito palavras na tela de cada vez.
6. **Mensagem que não interrompe:** o aviso fica na tela sem um botão de OK.
7. **Mensagem que se adapta:** a dica aparece só quando o jogador erra (por exemplo, depois que uma planta morre).
8. **Sem barulho:** o jogo original não tinha pop-up de conquista no meio da fase.
9. **O desenho ensina:** o bico da ervilheira, a porta que protege o zumbi e os espinhos dizem o que cada um faz.
10. **Usar o que a pessoa já sabe:** plantas não andam, zumbis são lentos, ímãs puxam metal, e os nomes dizem a função.

### 3.4 O que faz voltar e o que não copiar

- **Volta:** uma planta nova quase toda fase (é a recompensa e é o próximo brinquedo), o mundo novo com regra nova, os minijogos e a segunda volta mais difícil.
- **Não copiar:** a história com personagens (o nosso jogo não tem enredo; a abertura é curta, documento 02, seção 10.1). A loja e as moedas ficam para a P-017 ([#78](https://github.com/TARNAGS/resgate-espacial/issues/78)).

## 4. Subway Surfers

*Em andamento.*

## 5. Lado a lado

*Em andamento: entra quando os três jogos estiverem prontos.*

## 6. O que levar para o Resgate Espacial

*Em andamento: as propostas do Candy Crush já estão na seção 2 e entram aqui, com as dos outros dois, no fim.*

## 7. Como este material foi feito

- **Plants vs. Zombies:** sem abrir o jogo. O molde dos mundos vem do wiki dos fãs; as dez técnicas, de notas sobre a palestra do criador (fonte secundária, conferida com a lista que a GDC anunciou: "10 técnicas para ensinar mecânicas"). A duração de uma fase não foi medida.
- **Candy Crush Saga:** sem abrir o jogo. As fases vêm do wiki dos fãs pela interface de dados (`api.php`), lidas por um script que grava `candy-crush.json`. A dificuldade é a nota dos fãs, e os rótulos do mapa vêm das categorias do wiki. A duração de uma fase (uns 2 minutos para 25 jogadas) é estimativa, não medida.

### Onde a busca procurou

| Fonte | O que foi feito | Resultado |
|---|---|---|
| Wiki dos fãs do Plants vs. Zombies (plantsvszombies.fandom.com, `api.php`) | Páginas "Adventure Mode" e o modelo da lista de fases | Ok: o ritmo de cada mundo, as linhas do primeiro mundo e as bandeiras |
| Busca da palestra de George Fan (GDC 2012) | Notas de quem assistiu e o vídeo | Ok pelas notas; o vídeo não foi lido (o Claude não assiste vídeo) |
| Wiki dos fãs do Candy Crush (candycrush.fandom.com, `api.php`) | 110 fases lidas (tipo, jogadas, estrelas, dificuldade, novidades, rótulos) e as páginas Lives, Episodes e o total de fases | Ok |
| mobilegamer.biz, 27/03/2024 | Relato da palestra da King na GDC 2024 | Ok |
| Página da sessão na agenda da GDC ("Sugary Statistics") | Resumo oficial da palestra | Bloqueada (403) |
| Busca sobre robôs de teste da King | Entrevistas de Sahar Asadi e palestras de 2016 | Só fontes secundárias; números marcados como da própria empresa |

## 8. Fontes

- Wiki dos fãs do Plants vs. Zombies: https://plantsvszombies.fandom.com/wiki/Adventure_Mode e o modelo "Adventure Mode levels", consultados em 09/10/2026.
- George Fan, "How I Got My Mom to Play Through Plants vs. Zombies", GDC 2012. Vídeo: https://www.youtube.com/watch?v=fbzhHSexzpY. Notas: https://notes.hamatti.org/Sources/Talks/How-I-got-my-mom-to-play-through-Plants-vs.-Zombies
- Wiki dos fãs do Candy Crush: https://candycrush.fandom.com (fases 1 a 80, 1001 a 1015 e 5001 a 5015; páginas Lives e Episodes), consultado em 09/10/2026.
- Neil Long, "How King defines a 'good' Candy Crush Saga level – and constantly prunes the bad ones", mobilegamer.biz, 27/03/2024: https://mobilegamer.biz/how-king-defines-a-good-candy-crush-saga-level-and-why-it-constantly-prunes-the-bad-ones/
- GDC 2024, "Sugary Statistics: What We Have Learned About Candy Crush Content After 10 Years and Over 15,000 Levels" (Jan Wedekind e Xavier Guardiola): https://www.gdcvault.com/play/1034392/Sugary-Statistics-What-We-Have
- "How AI helped King Studio develop 13,755 levels for Candy Crush Saga", neurohive.io (entrevista de Sahar Asadi, fonte secundária): https://neurohive.io/en/ai-apps/how-ai-helped-king-studio-develop-13-755-levels-for-candy-crush-saga/

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 1.0 | 09/10/2026 | Primeira versão, em construção: Candy Crush Saga e Plants vs. Zombies |
