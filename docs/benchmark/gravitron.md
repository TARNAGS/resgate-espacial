# Benchmark de Level Design e Gameplay: GraviTron (2006) e Gravitron 2 (2008)

| Campo | Valor |
|---|---|
| Documento | Benchmark de level design e gameplay — GraviTron e Gravitron 2 |
| Versão | 1.0 |
| Data | 06/10/2026 |
| Status | Referência |
| Responsável | Fernando Nunes (Product Manager) |

Na busca do jogo original ([#52](https://github.com/TARNAGS/resgate-espacial/issues/52)), o Fernando percebeu que a memória dele tinha misturado dois jogos. O Crazy Gravity deu a nave, o combustível e a ida e volta à base ([benchmark](crazy-gravity.md)); o **resgate de pessoas**, que é o objetivo das nossas fases, veio do **Gravitron 2**, que ele jogou. Este documento abre os dois jogos da série, da Dark Castle Software: regras, elementos, fases, curva de dificuldade, o que os jogadores diziam e o que pode inspirar o Resgate Espacial ([D-032](../05-registro-de-decisoes.md#d-032--os-jogos-de-nave-com-gravidade-viram-benchmark-de-level-design); cartão [#106](https://github.com/TARNAGS/resgate-espacial/issues/106)). É o primeiro discovery feito com a skill `discovery-de-jogos` (D-033).

> **Página de leitura:** a mesma análise, com os mapas, publicada em [claude.ai/artifact/8yu4nX63Xoix8VneHU59bv](https://claude.ai/artifact/8yu4nX63Xoix8VneHU59bv) (privada) e guardada aqui em [`gravitron/pagina-de-leitura.html`](gravitron/pagina-de-leitura.html), que abre direto no navegador.

> **Sobre as imagens.** Os mapas **não são capturas de tela**. O Claude leu os arquivos de fase dos dois jogos e redesenhou cada fase como mapa esquemático, com uma cor por função. Os jogos, as fases, a arte e os sons são da Dark Castle Software. Usamos para estudar ideias, sem copiar desenho de fase, arte ou som (D-005).

## Sumário

1. [Resumo em uma página](#1-resumo-em-uma-página)
2. [Como o Gravitron 2 funciona](#2-como-o-gravitron-2-funciona)
3. [O que mudou do GraviTron para o Gravitron 2](#3-o-que-mudou-do-gravitron-para-o-gravitron-2)
4. [Catálogo do que uma fase pode ter](#4-catálogo-do-que-uma-fase-pode-ter)
5. [A curva de dificuldade](#5-a-curva-de-dificuldade)
6. [Fase a fase: Gravitron 2](#6-fase-a-fase-gravitron-2)
7. [Fase a fase: GraviTron](#7-fase-a-fase-gravitron)
8. [Padrões de design](#8-padrões-de-design)
9. [Onde estava a diversão e onde estava a dificuldade](#9-onde-estava-a-diversão-e-onde-estava-a-dificuldade)
10. [O que os jogadores diziam](#10-o-que-os-jogadores-diziam)
11. [O que levar para o Resgate Espacial](#11-o-que-levar-para-o-resgate-espacial)
12. [Como este material foi feito](#12-como-este-material-foi-feito)
13. [Fontes](#13-fontes)

## 1. Resumo em uma página

| Item | GraviTron (2006) | Gravitron 2 (2008) |
|---|---|---|
| Proposta | Pilotar uma nave vetorial por planetas e cavernas, contra a gravidade, destruir os reatores de cada setor, pegar combustível e resgatar os "space-men" | O mesmo, mais intenso: destruir todos os reatores e **fugir para o espaço em 60 segundos**, antes de o planeta explodir. Resgatar cientistas é missão secundária |
| Autor | Dark Castle Software: um estúdio de uma pessoa só, programador de C++, ligado ao grupo Blackened Interactive. O autor diz que se inspirou no Thrust Extreme e em clássicos como Thrust, Gravitar e Oids | O mesmo |
| Distribuição e modelo de negócio | **Gratuito.** Lançado em 23/12/2006 | **Pago: US$ 5** no site do autor e, a partir de 31/08/2008, no Steam (hoje R$ 8,49). **Demo grátis com 5 fases.** Expansões "grátis para sempre": a versão 1.8 trouxe uma campanha extra |
| Tamanho | Cerca de 30 mapas segundo o autor; o pacote tem 23 de campanha, 3 de multijogador e 1 de teste. Editor de fases (GravED) incluído | "Mais de 40 fases" na campanha principal e 14 na extra (cerca de 60 no total), mais uma fase de instruções |
| Onde estava a diversão | Pilotar com inércia, atirar, planejar a ordem dos reatores e resgatar quem está pelo caminho | A mesma, mais a **fuga cronometrada** no fim, o **pouso em qualquer superfície plana** e terreno que **gira e anda** |
| Onde estava a dificuldade | Torres por toda parte, enxames de inimigos no ar, campos de força, combustível | Torres, tanques, minas, mísseis, lasers que matam na hora, jatos que empurram, o relógio da fuga e o quique nas paredes |
| Oponentes | Sim: torres e inimigos voadores | Sim: torres, tanques, pulgas que saltam, varredores que soltam minas, mísseis e "landers" que sequestram cientistas |
| Recepção | Pouca crítica registrada; notícias de 2008 lembram dele como o jogo grátis que levou ao 2 | 27 de 32 avaliações positivas no Steam (84%); GamesRadar deu 3,5 de 5 |

**As 22 fases do Gravitron 2 que temos, somadas** (8 da campanha principal e 14 da extra): 73 reatores, 98 cientistas, 74 postos de combustível, 25 checkpoints, 1.123 torres, 161 tanques, 76 inimigos voadores, 106 minas, 92 mísseis, 174 lasers, 6 jatos, 39 blocos destrutíveis, 65 partes do terreno que giram e 34 que andam.

**As 23 fases de campanha do GraviTron, somadas:** 47 reatores, 115 space-men, 57 combustíveis, 949 torres e outros inimigos presos ao chão, 348 inimigos ou objetos no ar, 142 campos de força, 36 botões, 67 partes que giram e 32 que andam.

## 2. Como o Gravitron 2 funciona

Tudo nesta seção vem do código-fonte do Gravitron 2, que o próprio autor publicou em 2012, e das páginas "How to Play" e do registro de atualizações do site dele. O jogo roda em passos de 0,02 segundo (50 por segundo).

### 2.1 Controles e física

| Regra | Como é |
|---|---|
| Comandos | Girar para a esquerda e para a direita, acelerar para a frente, atirar e ligar um **escudo**. Dá para jogar com mouse, teclado ou controle, todos configuráveis; o autor recomenda o mouse |
| Física | A gravidade puxa para baixo; o motor empurra para onde a ponta aponta, com cinco vezes a força da gravidade. O ar freia a nave aos poucos (a velocidade cai 1,15% a cada passo) |
| Giro | Rápido: 7° por passo no teclado, ou o quanto o mouse mexer |
| Mundo | O mapa **dá a volta** na horizontal: quem sai por um lado entra pelo outro, como no Gravitar. A nave nasce no espaço, acima do terreno, e desce |

### 2.2 Combustível, energia e pouso

| Regra | Como é |
|---|---|
| Combustível | Tanque de 300. O motor gasta o tanque inteiro em 48 segundos de aceleração contínua; o escudo, em 40 |
| Posto (fuel pod) | Basta **pairar ou pousar perto** (até 100 unidades): o combustível passa sozinho, em partículas, até a nave. Cada posto tem 100 de combustível e pode ser destruído a tiro |
| Energia | Barra de 100. Bater numa parede **não mata**: a nave **quica** e perde energia proporcional à velocidade da batida. Um tiro inimigo tira 30. Esmagada entre partes que se movem, ou atingida por um laser, ela explode na hora. Sem combustível, qualquer dano mata |
| Pouso | Em **qualquer superfície plana**, inclusive paredes e teto, desde que a nave esteja alinhada (até uns 11° de diferença) e as duas pernas encostem. **A velocidade não importa.** Desalinhada, a nave quica e perde energia |
| Saída de emergência | Subir para o espaço antes de destruir os reatores aborta a missão: a fase recomeça com combustível e energia cheios |

### 2.3 Objetivo, resgate e fim da fase

| Regra | Como é |
|---|---|
| Objetivo | Destruir todos os reatores do setor. Cada reator aguenta 5 tiros e **se recupera** se a nave parar de atirar |
| Fuga | Destruído o último reator, toca uma sirene, a tela treme e um relógio conta **60 segundos**. A nave precisa subir até o espaço antes de o planeta explodir |
| Cientistas | Ficam andando de um lado para o outro na plataforma deles. Quando a nave **pousa na mesma plataforma**, eles **andam até ela**, mais depressa, e embarcam. Cada resgate conserta 15 de energia e vale 250 pontos (mais 100 no fim da fase). O resgate é **opcional**: "não é preciso resgatar os cientistas para terminar o jogo" |
| Ameaça ao resgate | O "lander", que existe no código, procura um cientista, voa até ele e o transforma num mutante, que passa a atacar |
| Vidas e checkpoints | 3 vidas e uma a mais a cada 20.000 pontos. Desde a versão 1.2, checkpoints espalhados pela fase guardam o estado: ao morrer, a nave volta ao último checkpoint, com os reatores e cientistas já resolvidos |

### 2.4 Pontuação

| Item | Pontos |
|---|---|
| Reator | 1.000 |
| Cientista | 250 na hora e mais 100 no fim da fase |
| Inimigos | De 50 (torre azul) a 300 (varredor); árvores valem 15 |
| **Relógio de bônus** | Começa em 1.000 × o número da fase (até 10.000) e cai 25 pontos por segundo. O que sobrar entra no total: "quem é rápido ganha mais pontos". A versão 1.2 baixou o relógio das 10 primeiras fases |
| Fim da fase | Soma o bônus que sobrou, o combustível × 10, a energia × 10 e os cientistas × 100 |
| Recordes | Placar online, consultado de dentro do jogo. O servidor saiu do ar, e hoje ele não funciona |

### 2.5 Ensino e extras do produto

| Recurso | Como é |
|---|---|
| Fase de instruções | Acrescentada na versão 1.7: uma "vitrine" com cada elemento numa plataforma (reator, cientistas, combustível, checkpoint). Mais um vídeo tutorial no site |
| Demo | 5 fases grátis, as primeiras da campanha |
| Campanhas | "Standard", a original, e "OfficialPack1", a extra da versão 1.8. A extra vinha **selecionada por padrão** no menu, o que confundia quem começava (seção 10) |
| Modo arcade de mesa | "Cocktail mode", com tela invertida para fliperamas de mesa |
| Steam | 10 conquistas, exclusivas da versão do Steam |

## 3. O que mudou do GraviTron para o Gravitron 2

| Tema | GraviTron (2006) | Gravitron 2 (2008) |
|---|---|---|
| Preço | Grátis | US$ 5, com demo de 5 fases |
| Quem se resgata | Space-men andando pela superfície, por pontos | Cientistas que, além dos pontos, **consertam a nave** |
| Fim da fase | Destruir os reatores do setor | Destruir os reatores e **fugir em 60 segundos** |
| Progresso | **Senha por fase** (EASY1, EASY2, PARTY, SMOKE…), como no Crazy Gravity | Checkpoints dentro da fase (v1.2) e progresso salvo |
| Multijogador | Deathmatch, com 3 mapas próprios | Não tem |
| Editor | GravED, junto com o jogo; o autor pedia mapas aos jogadores | O código do editor foi publicado em 2012 |
| Fases com tema | O terreno desenha um castelo (CASTLE), engrenagens (CLOCKWORK), andaimes de mina (EXCAVATION) | Formas mais geométricas: anéis, cruzes, labirintos quadrados |
| Elementos novos | — | Lasers com tempo, jatos que empurram, blocos destrutíveis, minas, mísseis, pulgas, varredores e landers |

**Registro de atualizações do Gravitron 2 (o que o autor ajustou depois do lançamento):** v1.2 trouxe checkpoints, menos consumo de combustível e do escudo, cientistas mais espertos e relógio de bônus menor nas 10 primeiras fases; v1.5, escudo e tiro com a nave pousada; v1.7, a página de instruções, a opção de pular telas, postos de combustível mais fortes e a correção de um bug de morte instantânea ao bater na parede; v1.8, a campanha extra. **Leitura:** quase tudo o que mudou depois do lançamento deixou o jogo mais fácil ou mais claro.

## 4. Catálogo do que uma fase pode ter

![Legenda dos mapas](gravitron/legenda.png)

### 4.1 Gravitron 2 (tipos do código)

| Elemento | O que faz | Nas 22 fases |
|---|---|---|
| Terreno | Segmentos de reta em neon, com uma cor em cada ponta | 6.167 segmentos |
| Reator | Objetivo: 5 tiros para destruir, e se recupera se a nave parar de atirar | 73 |
| Cientista | Anda pela plataforma; corre até a nave pousada nela | 98 |
| Posto de combustível | Abastece quem paira ou pousa perto; pode ser destruído | 74 |
| Checkpoint | Ponto de volta depois de morrer | 25 |
| Torre azul, vermelha e supertorre | Fixas no terreno; atiram quando a nave está a menos de 500 unidades, a cada 3 ou 4 segundos. A vermelha atira três tiros em leque | 1.076 azuis, 44 vermelhas e 3 supertorres |
| Tanque | Anda pelo chão e atira | 161 |
| Mina | Fica no ar, balançando devagar para os lados | 106 |
| Míssil | Parado até a nave passar na frente dele, a menos de 300 unidades; então dispara em linha reta | 92 |
| Pulga e varredor | A pulga salta na direção da nave e atira; o varredor voa e solta minas | 72 pulgas e 4 varredores |
| Laser | Feixe que **mata na hora**; liga e desliga num ritmo próprio, e pode ser acionado por um botão | 174 |
| Jato | Empurra a nave numa direção e derruba quem está pousado; liga e desliga | 6 |
| Botão | Atirar nele liga ou desliga um laser, um jato ou uma plataforma | 10 |
| Blocos | Paredes que se destroem a tiro | 39 |
| Parte que gira | Um pedaço do terreno (com o que estiver nele) gira sem parar ou até um ângulo, com pausa e volta | 65 |
| Parte que anda | Um pedaço do terreno vai e volta entre dois pontos: elevadores, plataformas, gaiolas | 34 |
| Gatilho | Área invisível que dispara um evento quando a nave entra | 1 |
| Árvore | Decoração; vale 15 pontos | 67 |

### 4.2 GraviTron (tipos deduzidos)

O código do GraviTron se perdeu (o autor conta isso no site), então o significado de cada tipo foi deduzido pela posição nos mapas e comparado com o Gravitron 2 (seção 12).

| Elemento | Como foi identificado | Confiança | Nas 23 fases |
|---|---|---|---|
| Reator | Um a quatro por fase, no fundo das cavernas, em todas as fases | Alta | 47 |
| Space-man | Em grupos de 2 a 4, sempre em pisos planos | Alta | 115 |
| Combustível | Um a cinco por fase, em plataformas, perto das rotas | Alta | 57 |
| Torre | Presa a qualquer parede, apontando para o espaço livre | Alta (tipo 0); média (tipos 7 e 8) | 949 |
| Campo de força | Emissores em pares, frente a frente, com o nome do botão que os desliga | Alta | 142 |
| Botão, parte que gira, parte que anda, ponto de destino, gatilho | Registros com nome e ligação entre si, iguais aos do Gravitron 2 | Alta | 36, 67, 32, 64 e 9 |
| Árvore | Dezenas, só na superfície | Média | 112 |
| Inimigos ou objetos no ar | Quatro tipos que nunca encostam no terreno; formam enxames perto dos reatores | Média: não dá para dizer qual é inimigo e qual é obstáculo | 348 |
| Outros objetos no chão | Quatro tipos raros, sem padrão claro | Baixa | 126 |
| Itens do multijogador | Seis tipos que só aparecem nos 3 mapas de deathmatch | Média | 3 mapas |

## 5. A curva de dificuldade

### 5.1 Gravitron 2

![Perigos e mecanismos por fase no Gravitron 2](gravitron/curva-gravitron2.png)

| Campanha e fase | Nome | Tamanho (unidades) | Reatores | Cientistas | Combustível | Checkpoints | Torres | Tanques | No ar* | Lasers | Jatos | Gira / anda | Profundidade** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Principal 1 | Ediruma 5 | 1104×120 | 1 | 2 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 / 0 | 0 |
| Principal 2 | Goruwabi | 1384×504 | 1 | 3 | 1 | 1 | 3 | 0 | 0 | 0 | 0 | 0 / 0 | 440 |
| Principal 3 | Wojunew | 1072×920 | 1 | 2 | 1 | 0 | 4 | 1 | 0 | 1 | 0 | 0 / 1 | 528 |
| Principal 4 | Quintus | 1120×720 | 1 | 3 | 2 | 1 | 9 | 0 | 0 | 1 | 0 | 1 / 0 | 376 |
| Principal 5 | Kyaomh | 2040×752 | 1 | 3 | 1 | 1 | 3 | 0 | 0 | 3 | 0 | 0 / 1 | 744 |
| Principal 10 | Ebayano | 1200×984 | 1 | 2 | 1 | 1 | 5 | 3 | 0 | 0 | 0 | 0 / 0 | 848 |
| Principal (?) | Alece | 1512×776 | 1 | 2 | 1 | 0 | 23 | 4 | 0 | 2 | 0 | 1 / 0 | 656 |
| Principal (?) | Vesea | 1976×2008 | 3 | 6 | 2 | 1 | 21 | 4 | 2 | 4 | 0 | 0 / 3 | 1936 |
| Extra 1 | Vlea-Ealiu | 1312×336 | 1 | 3 | 2 | 0 | 8 | 1 | 0 | 0 | 2 | 0 / 0 | 112 |
| Extra 2 | Inui | 1024×768 | 2 | 3 | 1 | 0 | 16 | 3 | 0 | 3 | 0 | 0 / 1 | 664 |
| Extra 3 | Uworu | 1832×1856 | 2 | 2 | 1 | 1 | 43 | 1 | 3 | 0 | 0 | 0 / 1 | 1744 |
| Extra 4 | Eizyia | 3080×720 | 1 | 4 | 1 | 1 | 18 | 6 | 4 | 0 | 0 | 1 / 0 | 572 |
| Extra 5 | Sewari | 2400×1972 | 2 | 1 | 1 | 0 | 12 | 14 | 0 | 2 | 0 | 0 / 1 | 1912 |
| Extra 6 | Aomaic II | 1592×4768 | 3 | 2 | 1 | 1 | 33 | 8 | 39 | 0 | 4 | 5 / 2 | 4360 |
| Extra 7 | Tethia | 1860×1888 | 2 | 3 | 2 | 1 | 19 | 10 | 2 | 42 | 0 | 1 / 2 | 1848 |
| Extra 8 | Asylum | 3808×2696 | 3 | 10 | 5 | 3 | 160 | 10 | 24 | 5 | 0 | 2 / 17 | 2600 |
| Extra 9 | Tuvip | 2040×4582 | 3 | 8 | 4 | 1 | 52 | 2 | 27 | 15 | 0 | 6 / 4 | 2684 |
| Extra 10 | Ura 4 | 2776×2236 | 2 | 7 | 6 | 2 | 70 | 7 | 18 | 5 | 0 | 8 / 0 | 1740 |
| Extra 11 | Gohine | 2832×2712 | 3 | 8 | 6 | 2 | 137 | 31 | 27 | 2 | 0 | 3 / 0 | 2600 |
| Extra 12 | Zebes | 2344×2348 | 4 | 3 | 1 | 1 | 99 | 0 | 44 | 12 | 0 | 21 / 0 | 1956 |
| Extra 13 | Garajida | 5024×6040 | 32 | 12 | 17 | 4 | 271 | 21 | 47 | 19 | 0 | 15 / 1 | 5856 |
| Extra 14 | Suon X | 4672×3584 | 3 | 9 | 16 | 3 | 116 | 35 | 37 | 58 | 0 | 1 / 0 | 2104 |

\* **No ar:** pulgas, varredores, minas e mísseis. \*\* **Profundidade:** distância vertical entre o ponto mais alto do terreno e o reator mais fundo. Mede o tamanho da descida e, portanto, da fuga. A nave tem cerca de 28 unidades de largura. Alece e Vesea são da campanha principal, mas a posição delas na sequência não está nos arquivos.

**O que a curva mostra:**

- **Rampa suave no começo, uma novidade por fase.** Fase 1: terreno aberto, sem caverna. Fase 2: a primeira descida. Fase 3: o primeiro laser e a primeira plataforma que anda. Fase 4: uma caverna que gira. Fase 5: três lasers em sequência. Os perigos sobem de 1 para 3, 7 e 11, e a fase 5 baixa para 7: o primeiro respiro.
- **A campanha extra é um serrote em outra escala.** Começa onde a principal termina (11 perigos) e tem picos nas fases 8 (Asylum, 221), 11 (Gohine, 238) e 13 (Garajida, 374), com respiros depois de cada um (9, 12 e 14).
- **Cada fase grande tem uma "ideia mecânica".** Labirinto que gira inteiro (Suon X), planeta que gira inteiro (Garajida), floresta de blocos destrutíveis (Gohine), teia de lasers (Zebes, Tethia).
- **A profundidade cresce mais do que a largura.** As fases ficam mais fundas, e a fuga de 60 segundos fica mais apertada: na Garajida, o reator mais fundo está a 5.856 unidades do topo do terreno.

### 5.2 GraviTron

A ordem original das fases não está nos arquivos. As senhas EASY1 e EASY2 indicam as duas primeiras; as outras estão na tabela em ordem de quantidade de objetos, que é uma ordem nossa.

| # | Nome | Senha | Número* | Tamanho | Reatores | Space-men | Combustível | Torres | No ar | Campos de força | Gira / anda |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | CAENTHAE | EASY1 | 20 | 1088×280 | 1 | 2 | 1 | 3 | 0 | 0 | 0 / 0 |
| 2 | KRIAR | EASY2 | 20 | 1080×408 | 1 | 4 | 1 | 3 | 0 | 2 | 0 / 0 |
| 3 | YCARON | SEKME | 20 | 1440×352 | 2 | 4 | 2 | 7 | 8 | 4 | 0 / 0 |
| 4 | KEWURUI | SMOKE | 30 | 1992×696 | 3 | 2 | 2 | 13 | 4 | 0 | 0 / 1 |
| 5 | JUKIRI | OMEGA | 30 | 1784×600 | 2 | 3 | 2 | 12 | 4 | 4 | 1 / 0 |
| 6 | ABOTEMU | PARTY | 15 | 1704×528 | 1 | 7 | 0 | 19 | 2 | 2 | 1 / 0 |
| 7 | IGEA PRIME | ASE55 | 40 | 1680×856 | 2 | 5 | 3 | 19 | 8 | 2 | 1 / 0 |
| 8 | EOPPON 8 | SPICE | 15 | 2144×496 | 1 | 4 | 1 | 24 | 12 | 2 | 0 / 0 |
| 9 | KLENDARTH | CROSS | 40 | 1808×912 | 1 | 7 | 4 | 32 | 11 | 11 | 2 / 0 |
| 10 | EXCAVATION | DEEP | 40 | 2912×1216 | 2 | 5 | 5 | 30 | 11 | 19 | 2 / 0 |
| 11 | CLOCKWORK | PUNKY | 45 | 1160×936 | 3 | 10 | 4 | 31 | 12 | 6 | 4 / 0 |
| 12 | CHRONOK | UHOHS | 30 | 1664×1048 | 1 | 4 | 2 | 42 | 22 | 6 | 4 / 0 |
| 13 | CASTLE | PALAS | 30 | 2176×2760 | 3 | 3 | 1 | 54 | 13 | 8 | 4 / 0 |
| 14 | UNDECIMUS | BACCA | 30 | 3096×2088 | 1 | 2 | 2 | 70 | 0 | 6 | 6 / 1 |
| 15 | KA-HU ALPHA | RAISE | 60 | 2528×1880 | 2 | 4 | 3 | 45 | 0 | 12 | 2 / 9 |
| 16 | BERG | ICICL | 15 | 2552×1400 | 3 | 13 | 3 | 25 | 14 | 6 | 0 / 0 |
| 17 | QUARTUS | BRICK | 35 | 3320×2864 | 2 | 8 | 2 | 55 | 48 | 2 | 1 / 1 |
| 18 | ARACHON | SISSY | 20 | 1952×1816 | 4 | 5 | 2 | 67 | 12 | 7 | 7 / 7 |
| 19 | ANDROS | BAMBI | 30 | 3232×2448 | 3 | 4 | 4 | 75 | 35 | 17 | 1 / 0 |
| 20 | LECEROA | SLERP | 90 | 3680×2696 | 1 | 8 | 4 | 98 | 1 | 6 | 12 / 3 |
| 21 | FIVIUM | ROTOR | 50 | 1968×1744 | 3 | 5 | 5 | 93 | 26 | 0 | 6 / 3 |
| 22 | TERTIUS | WHEEL | 60 | 2320×2024 | 2 | 4 | 2 | 77 | 46 | 16 | 2 / 1 |
| 23 | SIGMA | RASEL | 30 | 2168×3352 | 3 | 2 | 2 | 55 | 59 | 4 | 11 / 6 |

\* **Número:** cada fase guarda um número de 15 a 90, junto do nome e da senha. Ele cresce com o tamanho em várias fases (a maior, LECEROA, tem 90), e pode ser o tempo de fuga ou o do bônus. Não foi confirmado.

**O que a tabela mostra:** as duas primeiras fases são pequenas e quase vazias, como no Gravitron 2. Depois, a mesma linguagem do 2 já está aqui: torres em todas as paredes, enxames perto dos reatores, campos de força ligados a botões e muito terreno que gira.

## 6. Fase a fase: Gravitron 2

Cada mapa mostra a fase inteira. A nave nasce no espaço, acima do terreno, e a fase termina quando ela volta para lá depois de destruir os reatores.

### 6.1 Campanha principal (as fases que temos)

#### Fase 1 — Ediruma 5

![Gravitron 2, fase 1](gravitron/g2-principal-01-ediruma-5.png)

- **Objetivo e rota:** um terreno aberto, sem caverna, com o reator no alto de um morro, dois cientistas no vale, um posto e uma torre.
- **Desafio:** só pilotar, pousar para resgatar, atirar no reator e subir.
- **Ideia de design:** a primeira fase põe os quatro elementos do jogo à vista, cada um numa parte do terreno.

#### Fase 2 — Goruwabi

![Gravitron 2, fase 2](gravitron/g2-principal-02-goruwabi.png)

- **Objetivo e rota:** um poço desce até o reator, com dois cientistas no fundo; o posto e um checkpoint ficam na superfície.
- **Desafio:** a primeira descida, com duas torres nas paredes do poço. A fuga é subir pelo mesmo caminho.
- **Ideia de design:** o primeiro "ir e voltar" vertical, que é o desenho básico de todas as fases seguintes.

#### Fase 3 — Wojunew

![Gravitron 2, fase 3](gravitron/g2-principal-03-wojunew.png)

- **Objetivo e rota:** o reator fica numa câmara lateral, atrás de um laser vertical; o combustível está numa plataforma que sobe e desce.
- **Desafio:** atravessar o laser na hora em que ele desliga e lidar com o primeiro tanque.
- **Ideia de design:** duas novidades com tempo (laser e elevador), apresentadas sem pressa, numa fase pequena.

#### Fase 4 — Quintus

![Gravitron 2, fase 4](gravitron/g2-principal-04-quintus.png)

- **Objetivo e rota:** a caverna central inteira **gira** em volta do reator, levando junto torres e um laser.
- **Desafio:** entrar e pousar num terreno que se move.
- **Ideia de design:** uma mecânica nova que muda o jeito de pilotar, na quarta fase.

#### Fase 5 — Kyaomh

![Gravitron 2, fase 5](gravitron/g2-principal-05-kyaomh.png)

- **Objetivo e rota:** um corredor com três lasers em sequência leva ao reator; três cientistas espalhados pela superfície.
- **Desafio:** ritmo: passar pelos três lasers no tempo certo, na ida e na fuga.
- **Ideia de design:** repetir o laser da fase 3 em série transforma um elemento conhecido num trecho com identidade. É também a última fase da demo.

#### Fase 10 — Ebayano

![Gravitron 2, fase 10](gravitron/g2-principal-10-ebayano.png)

- **Objetivo e rota:** um poço em zigue-zague desce até o reator, com dois cientistas no meio do caminho.
- **Desafio:** três tanques patrulham os patamares, e a fuga é uma subida longa.
- **Ideia de design:** a dificuldade vem da distância e da patrulha, e não de um elemento novo.

#### Alece (posição desconhecida)

![Gravitron 2, Alece](gravitron/g2-principal-alece.png)

- **Objetivo e rota:** um anel giratório no meio do mapa, com torres e um cientista dentro; o reator fica na caverna da direita, atrás de um laser.
- **Desafio:** 23 torres e quatro tanques. O botão que controla o laser fica dentro do anel que gira.
- **Ideia de design:** o "interruptor" está num lugar difícil, e a recompensa (o cientista) fica no mesmo lugar.

#### Vesea (posição desconhecida)

![Gravitron 2, Vesea](gravitron/g2-principal-vesea.png)

- **Objetivo e rota:** três reatores no fundo; três grandes blocos de terreno sobem e descem em poços verticais, como elevadores.
- **Desafio:** fileiras de torres no teto dos corredores, pares de lasers e dois mísseis na superfície.
- **Ideia de design:** o terreno que anda muda o caminho a cada momento: o mesmo poço está aberto ou fechado conforme o elevador.

### 6.2 Campanha extra (OfficialPack1)

| Fase | Mapa | Destaque |
|---|---|---|
| 1 — Vlea-Ealiu | ![](gravitron/g2-extra-01-vlea-ealiu.png) | O reator fica numa ilha flutuante, protegido por **dois jatos** que empurram a nave para baixo. Um jato serve de escudo |
| 2 — Inui | ![](gravitron/g2-extra-02-inui.png) | Dois reatores em dois poços separados; os cientistas ficam no fundo de um deles, ao lado de um laser |
| 3 — Uworu | ![](gravitron/g2-extra-03-uworu.png) | Os dois reatores ficam numa **gaiola que anda**, forrada de torres por dentro, atrás de uma parede de blocos destrutíveis |
| 4 — Eizyia | ![](gravitron/g2-extra-04-eizyia.png) | Superfície longa, com torres no alto de pilares e pulgas; um túnel leva a um tambor giratório com tanques, e o reator fica atrás dele |
| 5 — Sewari | ![](gravitron/g2-extra-05-sewari.png) | Um poço aberto; no fundo, uma gaiola que sobe e desce com dois reatores e 14 tanques. **O alvo se move** |
| 6 — Aomaic II | ![](gravitron/g2-extra-06-aomaic-ii.png) | Um poço de 4.768 unidades de altura, com minas, pulgas, jatos de lado e ilhas giratórias; os cientistas estão numa delas |
| 7 — Tethia | ![](gravitron/g2-extra-07-tethia.png) | **Labirinto de lasers:** 42 deles forrando os túneis e uma caverna giratória com lasers dentro. Ilhas que andam no céu levam cientistas |
| 8 — Asylum | ![](gravitron/g2-extra-08-asylum.png) | Fortaleza simétrica com 17 caixas de torres que andam e 160 torres; os três reatores ficam numa gaiola giratória no fundo. Primeiro grande pico |
| 9 — Tuvip | ![](gravitron/g2-extra-09-tuvip.png) | Três **anéis giratórios**, cada um com um reator e minas por dentro; uma cerca de 15 lasers e elevadores longos |
| 10 — Ura 4 | ![](gravitron/g2-extra-10-ura-4.png) | Cinco discos enormes que giram, encaixados; lasers girando dentro deles e cientistas presos lá dentro |
| 11 — Gohine | ![](gravitron/g2-extra-11-gohine.png) | O miolo do mapa é uma **floresta de blocos destrutíveis**, abertos a tiro; 137 torres, 31 tanques e um campo de minas |
| 12 — Zebes | ![](gravitron/g2-extra-12-zebes.png) | Uma teia de lasers cruzados com minas, e um anel de 16 casulos de torres girando em volta de quatro reatores |
| 13 — Garajida | ![](gravitron/g2-extra-13-garajida.png) | **O planeta inteiro gira.** Oito cruzes giratórias carregam 32 reatores. A maior fase: 5.024×6.040 e 1.172 segmentos |
| 14 — Suon X | ![](gravitron/g2-extra-14-suon-x.png) | Um labirinto quadrado dentro de uma peça que gira, com 58 lasers nos corredores e os reatores num núcleo guardado por lasers |

### 6.3 Fase de instruções

![Gravitron 2, fase de instruções](gravitron/g2-instruction.png)

Uma fase-vitrine, sem perigo: cada elemento numa plataforma, de cima para baixo (reator, cientistas, combustível e checkpoint com árvores). Entrou na versão 1.7, depois do lançamento.

## 7. Fase a fase: GraviTron

| # | Mapa | Destaque |
|---|---|---|
| 1 — CAENTHAE (EASY1) | ![](gravitron/g1-01-caenthae.png) | Um vale aberto: reator no fundo, dois space-men numa encosta, um combustível e três torres |
| 2 — KRIAR (EASY2) | ![](gravitron/g1-02-kriar.png) | A primeira caverna, fechada por um **campo de força** que se desliga com um botão; os space-men estão no fundo, junto do reator |
| 3 — YCARON | ![](gravitron/g1-03-ycaron.png) | Duas câmaras, um reator em cada, com enxames no ar e campos de força entre elas |
| 4 — KEWURUI | ![](gravitron/g1-04-kewurui.png) | Uma caverna em U com três reatores e uma estrutura em forma de foguete que se move |
| 5 — JUKIRI | ![](gravitron/g1-05-jukiri.png) | Uma plataforma que gira na entrada e quatro botões para os campos de força |
| 6 — ABOTEMU | ![](gravitron/g1-06-abotemu.png) | Um anel giratório com torres e um space-man dentro; sete space-men espalhados e nenhum combustível |
| 7 — IGEA PRIME | ![](gravitron/g1-07-igea-prime.png) | Duas cavernas, cada uma com um reator no fundo e um enxame no meio |
| 8 — EOPPON 8 | ![](gravitron/g1-08-eoppon-8.png) | Superfície com 19 árvores; caverna em serpentina com objetos flutuantes e um campo de força com botão |
| 9 — KLENDARTH | ![](gravitron/g1-09-klendarth.png) | Um portão giratório no meio, três campos de força em sequência e um leque de três lasers saindo de um ponto |
| 10 — EXCAVATION | ![](gravitron/g1-10-excavation.png) | Andaimes de mina: um poço central com oito campos de força em escada e um anel giratório |
| 11 — CLOCKWORK | ![](gravitron/g1-11-clockwork.png) | **Engrenagens:** duas rodas giratórias empilhadas e uma ampulheta cheia de inimigos sobre o reator; dez space-men |
| 12 — CHRONOK | ![](gravitron/g1-12-chronok.png) | Uma torre com três caixas giratórias de torres; o reator fica no alto, cercado por 22 inimigos no ar |
| 13 — CASTLE | ![](gravitron/g1-13-castle.png) | **O terreno desenha um castelo.** Um túnel com quatro campos de força leva às masmorras, com três reatores em rodas giratórias |
| 14 — UNDECIMUS | ![](gravitron/g1-14-undecimus.png) | Uma bússola gigante que gira, com o reator no centro, e uma "balança" giratória cheia de torres |
| 15 — KA-HU ALPHA | ![](gravitron/g1-15-ka-hu-alpha.png) | **Torres que sobem e descem** (nove plataformas que andam), um corredor com seis campos de força e dois reatores em berços giratórios |
| 16 — BERG | ![](gravitron/g1-16-berg.png) | Uma montanha com 47 árvores e cavernas com 13 space-men e três reatores |
| 17 — QUARTUS | ![](gravitron/g1-17-quartus.png) | Um poço vertical com uma coluna de 48 inimigos no ar; um anel giratório com dois reatores e um laser atravessado |
| 18 — ARACHON | ![](gravitron/g1-18-arachon.png) | Quatro reatores, cada um dentro de uma pequena caixa giratória de torres; elevadores e plataformas giratórias |
| 19 — ANDROS | ![](gravitron/g1-19-andros.png) | Uma roda gigante com a caverna dentro (a mesma ideia da fase 4 do Gravitron 2), três reatores e 17 campos de força |
| 20 — LECEROA | ![](gravitron/g1-20-leceroa.png) | A maior fase: quatro rodas de torres, uma coluna de seis casulos giratórios e um disco giratório com o reator |
| 21 — FIVIUM | ![](gravitron/g1-21-fivium.png) | Três grandes rodas giratórias encostadas, cada uma com um reator no centro |
| 22 — TERTIUS | ![](gravitron/g1-22-tertius.png) | Uma roda gigante de dois anéis com dois reatores, e um corredor de inimigos no ar |
| 23 — SIGMA | ![](gravitron/g1-23-sigma.png) | Onze discos giratórios, um enxame de inimigos dentro de um disco e estruturas em forma de foguete |

Os três mapas de deathmatch (DEADZONE, ICECAVES e VAULT) têm só pontos de partida e itens de multijogador, e ficaram fora das imagens.

## 8. Padrões de design

| # | Padrão | Onde aparece |
|---|---|---|
| 1 | **Uma ideia por fase**, apresentada numa fase pequena e depois repetida em escala | Gravitron 2, fases 1 a 5: terreno, poço, laser e elevador, caverna que gira, lasers em série |
| 2 | **Primeira fase com tudo à vista:** cada elemento num pedaço do terreno, sem caverna | Gravitron 2, fase 1; GraviTron, CAENTHAE; a fase de instruções |
| 3 | **Ida e volta vertical:** descer até o objetivo e fugir subindo pelo mesmo caminho | Quase todas as fases dos dois jogos |
| 4 | **Fuga cronometrada** depois do objetivo: a volta vira o clímax | Gravitron 2, todas as fases |
| 5 | **Resgate opcional, com recompensa útil:** os cientistas consertam a nave e dão pontos | Gravitron 2 |
| 6 | **Recompensa dentro do perigo:** cientistas e botões dentro de anéis que giram, de gaiolas que andam ou ao lado de lasers | Alece, Inui, Tethia, Ura 4 |
| 7 | **Terreno que se move** como mecânica principal: gira (anéis, discos, cruzes) ou anda (elevadores, gaiolas) | 65 partes que giram e 34 que andam no 2; 67 e 32 no 1 |
| 8 | **Perigo com ritmo:** lasers e jatos que ligam e desligam, minas que balançam | Kyaomh, Tethia, Zebes, Vlea-Ealiu |
| 9 | **O alvo se move:** reatores dentro de gaiolas ou cruzes que andam ou giram | Sewari, Uworu, Garajida |
| 10 | **Repetição em série** de um elemento, formando um trecho com identidade | Três lasers seguidos (Kyaomh), cerca de 15 lasers (Tuvip), corredor de campos de força (KA-HU ALPHA) |
| 11 | **Fase com tema no próprio desenho do terreno** | GraviTron: CASTLE, CLOCKWORK, EXCAVATION |
| 12 | **Serrote:** pico, respiro e pico maior | Campanha extra: picos nas fases 8, 11 e 13 |
| 13 | **Pontos premiam a pressa e a economia:** relógio de bônus, combustível e energia que sobram | Gravitron 2 |

## 9. Onde estava a diversão e onde estava a dificuldade

| Onde estava a diversão | Onde estava a dificuldade |
|---|---|
| **O quique:** bater na parede não mata; a GamesRadar diz que o quique deixa o jogo divertido e tira o tédio de pousar a velocidade quase zero | **O mesmo quique, em corredores:** jogadores reclamam que, atingida num corredor estreito, a nave quica de parede em parede e perde o controle |
| **A fuga de 60 segundos:** a sirene, a tela tremendo e sair do planeta no último segundo | **Lasers que matam na hora**, num jogo em que quase todo o resto só tira energia |
| **Pousar em qualquer lugar plano**, até no teto, para resgatar | **Controles:** a reclamação mais comum é o esquema de controle, com o mouse sensível demais e o teclado pouco confortável |
| **Uma curva "suave, mas firme"**, que segundo a GamesRadar segurou o resenhista a manhã inteira | **A campanha extra selecionada por padrão:** quem começava por ela achava o jogo difícil demais |
| **Fases curtas para jogar aos poucos:** um jogador conta que volta ao jogo há anos, 10 minutos por vez, e vibra quando passa da fase em que estava travado | **Combustível e escudo** dividem o mesmo tanque: usar o escudo para se proteger acelera a falta de combustível |
| **Variedade:** cada fase traz uma estrutura diferente (anéis, cruzes, labirintos, elevadores) | **Fases enormes no fim** da campanha extra, com centenas de inimigos |

**Sinais de que o autor achou o jogo difícil demais:** quase todas as atualizações facilitaram (checkpoints, menos consumo, postos mais fortes, relógio menor no começo), e a página de instruções só veio na versão 1.7.

## 10. O que os jogadores diziam

| Fonte | O que diz |
|---|---|
| Steam (32 avaliações, de 2010 a 2026) | 27 positivas e 5 negativas (84%). Os elogios: nível de desafio, desenho das fases, visual neon "atemporal", a fuga no fim, o preço. As críticas: controles (mouse sensível, teclado), quique forte demais nos corredores, lasers que matam na hora, placar online fora do ar, uma arma só |
| GamesRadar | Nota 3,5 de 5. A ideia é simples e muito usada, mas executada de um jeito mais divertido do que deveria; o quique e a curva de dificuldade seguraram o resenhista. Pede ajuste de sensibilidade do mouse |
| VidaExtra (Espanha, 2008) | Lembra o GraviTron como o jogo grátis, inspirado no Thrust Xtreme, de destruir reatores e resgatar civis. Acha que o 2 muda pouco (barra de energia, um mapa na tela e muito mais fases) e lamenta que tenha deixado de ser grátis |
| O próprio autor | Diz que o GraviTron é "muito divertido" e que gosta do estilo de arte; tirou o jogo do ar em 2010 por alarmes de antivírus, que ele atribui a erro, e o recolocou a pedido dos jogadores |

**O que gostavam:** o desafio justo, que faz o jogador sentir que pode melhorar; a fuga; a variedade das fases; o visual vetorial; jogar 10 minutos e voltar depois. Um jogador o compara a uma mistura de Gravitar, Choplifter e Asteroids.

**O que não gostavam:** os controles, mais do que qualquer outra coisa; o quique descontrolado; o laser que mata na hora; o placar online que morreu com o servidor. Três das cinco avaliações negativas são de quem jogou menos de meia hora, e duas delas reclamam do controle.

## 11. O que levar para o Resgate Espacial

Tudo aqui é **Proposta** para o Fernando decidir. Inspirar, nunca copiar (D-005, D-033): as ideias vão para o nosso jogo traduzidas para fases curtas, horizontais e sem tiros.

| Ideia dos Gravitron | Como poderia entrar no nosso jogo | Ligado a |
|---|---|---|
| **Os tripulantes andam até a nave** quando ela pousa na plataforma deles | Hoje os três embarcam ao pousar. Eles poderiam **sair andando até a nave**, um a um: deixa claro o que é o resgate e dá um segundo de tensão no pouso | Regras, seção 6 (tripulação); D-031 (a DEMO mostra o objetivo) |
| Resgate que **conserta a nave** ou vale pontos | Tripulantes extras, opcionais, fora da rota principal, que valem pontos ou uma estrela | P-006 (pontuação, [#53](https://github.com/TARNAGS/resgate-espacial/issues/53)); replay alto (Visão) |
| **Fuga cronometrada** depois do objetivo | Em fases especiais, a volta para a base vira uma corrida contra o relógio (tempestade, a plataforma desabando) | P-012 (modificadores, [#61](https://github.com/TARNAGS/resgate-espacial/issues/61)); P-018 (Nightmare, [#79](https://github.com/TARNAGS/resgate-espacial/issues/79)) |
| Uma ameaça que **vem buscar a tripulação** (o lander) | Pressa no resgate sem inimigo que atira: um prazo para chegar à tripulação | P-011 ([#60](https://github.com/TARNAGS/resgate-espacial/issues/60)); "sem inimigos que atiram" (regras, seção 9) |
| **Terreno que gira e que anda** | É a nossa lista de obstáculos móveis em proposta (satélites que giram, barreiras que sobem e descem). Os Gravitron mostram que dá para fazer uma fase inteira em volta de uma peça que gira | P-011; regras, seção 9 |
| **Lasers e jatos que ligam e desligam** | Barreiras com ritmo, e jatos que empurram a nave (o "vento solar" do benchmark do Crazy Gravity), agora com ciclo de liga e desliga | P-011, P-012 |
| Botões que **se acionam com tiro** | Não serve: não temos tiro. A versão nossa: **pousar num botão** ou passar por uma área (os gatilhos do Gravitron 2) | P-011 |
| **Combustível por proximidade:** pairar perto do posto já abastece | Alternativa ao pouso no posto: abastecer exige ficar parado no ar, o que também é habilidade | D-023, D-026 ([#93](https://github.com/TARNAGS/resgate-espacial/issues/93)) |
| **Bater não mata:** a nave quica e perde energia | Um modo ou modificador "casco reforçado" para o jogador casual: encostar tira energia, em vez de explodir. O quique precisa ser fraco para não virar caos em corredores (a crítica mais repetida depois dos controles) | D-027 (pouso mantido); D-028 (ICP); P-012 |
| **Relógio de bônus que encolhe**, mais combustível e energia que sobram | Referência para a pontuação: tempo mais recursos que sobraram. O relógio cresce com o tamanho da fase, para comparar fases diferentes | P-006 ([#53](https://github.com/TARNAGS/resgate-espacial/issues/53)) |
| **Uma novidade por fase**, apresentada pequena e depois repetida em série | Confirma o padrão do Crazy Gravity: cada fase do mundo com uma frase de destaque, e a novidade nova primeiro numa fase curta | Documento 08 (curva de cada mundo) |
| **Fase 1 com tudo à vista** e fase de instruções em forma de vitrine | Validação da D-031: o original começa assim. Atenção: o Gravitron 2 precisou **acrescentar** uma página de instruções na versão 1.7. Vale medir, no próximo playtest, se a DEMO basta | D-031 ([#104](https://github.com/TARNAGS/resgate-espacial/issues/104)) |
| **Checkpoints** acrescentados depois do lançamento | Validação dos nossos pontos de retorno (base e plataforma da tripulação). Se as fases crescerem, o retorno no meio do caminho volta à mesa | Regras, seção 7.1 |
| **Placar online num servidor próprio**, que morreu | Para o lançamento, preferir os rankings das plataformas (Game Center e Google Play Games), que não dependem de manter um servidor | P-019 ([#101](https://github.com/TARNAGS/resgate-espacial/issues/101)); [#98](https://github.com/TARNAGS/resgate-espacial/issues/98) |
| **Modelo de negócio:** o 1 grátis, o 2 por US$ 5 com demo de 5 fases e expansões grátis | Mais um caso do modelo "lite": algumas fases grátis e o resto pago, com conteúdo novo grátis para quem comprou | P-014 ([#98](https://github.com/TARNAGS/resgate-espacial/issues/98)) |
| A campanha difícil **selecionada por padrão** espantou jogadores | Lição de primeira experiência: o padrão do menu precisa ser o caminho mais fácil | D-028; D-031 |
| **Controle é a maior reclamação** | Validação do tempo que investimos no controle de toque e no teste comparativo | D-006, D-022 |

**Validações** (o que já decidimos e os Gravitron confirmam): ranking por fase (D-024) e fases fixas que permitem comparar tempos (D-021), com o placar online; ensinar mostrando, com a fase 1 aberta (D-031); pontos de retorno (regras, seção 7.1); o controle como maior risco do produto (D-006).

**Diferença importante:** os Gravitron são jogos de **tiro**: as fases são cheias de torres, e o objetivo é destruir. O nosso não tem tiro nem inimigos que atiram (regras, seção 9), e as fases são corredores curtos da esquerda para a direita, para partidas de 2 minutos (D-028). As ideias de resgate, de fuga, de terreno que se move e de perigo com ritmo valem para nós; o combate e o tamanho das fases finais não.

## 12. Como este material foi feito

1. **Fontes dos dados:** o site do autor, preservado no Internet Archive, tinha quatro arquivos: o GraviTron completo (`GraviTron.zip`), o código-fonte do Gravitron 2, que o próprio autor publicou em 2012 (`Gravitron2_Src.zip`), a atualização 1.8 com a campanha extra (`Gravitron2_Patch_v18.zip`) e a demo (`Gravitron2_demo_v17.zip`). O Fernando autorizou cada download. Só arquivos de dados e de código-fonte foram lidos: **nenhum programa dos jogos foi executado nem descompilado**. Do GraviTron, só os arquivos de fase foram extraídos, e o resto foi apagado na hora, porque o próprio autor conta que antivírus apontaram adware nele em 2010. Os arquivos originais não entram no repositório.
2. **Formato do Gravitron 2:** lido exatamente como o código faz (`Engine::LoadMap`): segmentos de terreno de 56 bytes, objetos com tipo, posição e rotação (alguns com campos a mais), pontos de destino, partes que giram, partes que andam e gatilhos. Todas as 23 fases fecham exatamente no fim do arquivo.
3. **Formato do GraviTron:** o código se perdeu, então o formato foi deduzido dos próprios arquivos. Segmentos de 40 bytes, objetos de 16 a 78 bytes conforme o tipo, e um rodapé com nome, senha e um número. Um programa testou combinações de tamanho por tipo até as 26 fases fecharem exatamente com o mesmo rodapé de 42 bytes. O significado de cada tipo veio da posição nos mapas (seção 4.2).
4. **Regras do Gravitron 2:** lidas no código: física, combustível, pouso, dano, resgate, reatores, fuga, pontuação e cada inimigo. O jogo desloca o mapa para pôr 1.000 unidades de espaço acima do terreno (`SectorGrid.cpp`): a nave nasce 600 acima do ponto mais alto e a fase termina perto de 990 acima.
5. **Licença:** a licença da demo do Gravitron 2 proíbe engenharia reversa do software. Nenhum programa foi aberto: lemos arquivos de dados, com o formato do código que o próprio autor tornou público. Os mapas são redesenhos esquemáticos, com crédito, para estudo. É orientação geral, não parecer jurídico.
6. **O que é aproximado:** a ordem das fases do GraviTron (só as duas primeiras são conhecidas, pelas senhas EASY1 e EASY2); o significado dos tipos do GraviTron com confiança média ou baixa; a função do número de cada fase do GraviTron; a posição de Alece e Vesea na campanha principal. As 40 fases da campanha principal do Gravitron 2 só vêm no jogo pago, e não foram estudadas além das 8 que temos.
7. **Ferramentas:** [`gravitron/ferramentas/`](gravitron/ferramentas/README.md), com a especificação dos dois formatos e o passo a passo para regenerar tudo. Os números de cada fase estão em [`gravitron/fases.json`](gravitron/fases.json).

### Onde a busca procurou

| Fonte | O que foi feito | Resultado |
|---|---|---|
| Buscas na web | Nome dos jogos, autor, resenhas | Steam, GamesRadar, Giant Bomb, VidaExtra e TIGSource |
| Steam | Página da loja e as 32 avaliações, lidas pela interface pública de avaliações | Data, preço, recursos e a opinião dos jogadores |
| GamesRadar | Resenha completa | Nota 3,5 de 5 e a leitura do quique e da curva |
| Giant Bomb e TIGSource | Tentativa de leitura | Bloqueados para scripts (erro 403); o TIGSource não tem cópia arquivada |
| VidaExtra | Notícia de lançamento do 2 | Preço na Europa e a comparação com o 1 |
| Site do autor (Internet Archive) | Lista de todas as páginas e arquivos arquivados; leitura das páginas do GraviTron, do Gravitron 2, de "How to Play", do registro de atualizações, do Gravitron X e da apresentação do estúdio | Regras, histórico de versões, e os quatro arquivos de dados |
| Blog do autor (Internet Archive) | 16 posts lidos | Nenhum fala dos Gravitron |
| Steam, outro "Gravitron" (2026) | Conferência | Jogo de plataforma sem relação, de outro autor, lançado em 06/08/2026 |

## 13. Fontes

- Site do autor, preservado no Internet Archive: [GraviTron (2007)](http://web.archive.org/web/20070110075610/http://xout.blackened-interactive.com:80/Gravitron.html), [GraviTron (2010)](http://web.archive.org/web/20100219164530/http://xout.blackened-interactive.com:80/Gravitron/Gravitron.html), [Gravitron 2](http://web.archive.org/web/20100206044246/http://xout.blackened-interactive.com:80/Gravitron2/Gravitron2.html), [How to Play](http://web.archive.org/web/20080915082740/http://xout.blackened-interactive.com:80/Gravitron2/HowToPlay.html), [registro de atualizações](http://web.archive.org/web/20081004171834/http://xout.blackened-interactive.com:80/Gravitron2/G2UpdateLog.txt), [Gravitron X](http://web.archive.org/web/20090116210309/http://xout.blackened-interactive.com:80/GravitronX/GravitronX.html) e [Dark Castle Software](http://web.archive.org/web/20100124230914/http://xout.blackened-interactive.com:80/Home/Home.html)
- Arquivos lidos (Internet Archive): [GraviTron.zip](http://web.archive.org/web/20140823183211/http://xout.blackened-interactive.com/Gravitron/GraviTron.zip), [Gravitron2_Src.zip](http://web.archive.org/web/20120204071245/http://xout.blackened-interactive.com/Gravitron2/Gravitron2_Src.zip), [Gravitron2_Patch_v18.zip](http://web.archive.org/web/20120207094927/http://xout.blackened-interactive.com/dump/new/Gravitron2_Patch_v18.zip) e [Gravitron2_demo_v17.zip](http://web.archive.org/web/20120204072953/http://xout.blackened-interactive.com/dump/new/Gravitron2_demo_v17.zip)
- [Gravitron 2 no Steam](https://store.steampowered.com/app/21300/Gravitron_2/) e as [avaliações dos jogadores](https://store.steampowered.com/appreviews/21300?json=1&language=all&filter=all&num_per_page=100&purchase_type=all)
- [GamesRadar: Gravitron 2 review](https://www.gamesradar.com/gravitron-2-review/)
- [VidaExtra: 'Gravitron 2' ya se encuentra disponible](https://www.vidaextra.com/pc/gravitron-2-ya-se-encuentra-disponible)
- [Giant Bomb: Gravitron 2](https://www.giantbomb.com/gravitron-2/3030-23996/) (bloqueado para leitura automática)
- Vídeos: [busca no YouTube](https://www.youtube.com/results?search_query=Gravitron+2+gameplay) e [o vídeo de jogo indicado numa avaliação do Steam](https://www.youtube.com/watch?v=LvNd2aMsEP0) (não assistidos pelo Claude)

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 1.0 | 06/10/2026 | Primeira versão: regras do Gravitron 2 lidas no código, 22 fases do 2 e 23 do 1 mapeadas a partir dos arquivos, curva, padrões, recepção e propostas |
