# Benchmark de Level Design — Resgate Espacial

| Campo | Valor |
|---|---|
| Documento | 10 — Benchmark de level design |
| Versão | 0.7 |
| Data | 08/10/2026 |
| Status | Em construção |
| Responsável | Fernando Nunes (Product Manager) |

O que os jogos de referência fazem com fases, obstáculos, dificuldade e ritmo, para inspirar (sem copiar, D-005) as fases e os mundos do Resgate Espacial. Decisão do Fernando em 05/10/2026 ([D-032](05-registro-de-decisoes.md#d-032--os-jogos-de-nave-com-gravidade-viram-benchmark-de-level-design)): os jogos de nave com gravidade achados na busca pelo jogo original ([#52](https://github.com/TARNAGS/resgate-espacial/issues/52)) ficam lado a lado com os casuais de celular do ICP ([D-028](05-registro-de-decisoes.md#d-026-a-d-029--decisões-da-primeira-análise-do-playtest), [#99](https://github.com/TARNAGS/resgate-espacial/issues/99)).

## 1. Para que serve

- Dar repertório para o catálogo de obstáculos (P-011, [#60](https://github.com/TARNAGS/resgate-espacial/issues/60)), os modificadores (P-012, [#61](https://github.com/TARNAGS/resgate-espacial/issues/61)) e a curva de dificuldade de cada mundo ([documento 08](08-design-de-mundos.md)).
- Duas famílias de referência: **(a)** os jogos de nave com gravidade, a começar pelo original; **(b)** os casuais de celular do ICP.
- Nada aqui é decisão. As ideias são **Proposta**, e o Fernando decide.

| Benchmark | Documento | Status |
|---|---|---|
| **Guia dos benchmarks: comece por aqui** | [benchmark/README.md](benchmark/README.md): os estudos lidos juntos, com insights, divergências, validações e decisões pendentes; página de leitura em [claude.ai/artifact/TSGis8FXKTXWWgdQUJH9ar](https://claude.ai/artifact/TSGis8FXKTXWWgdQUJH9ar) (privada) e a cópia [benchmark/pagina-de-leitura.html](benchmark/pagina-de-leitura.html) | Pronto (v1.0) |
| Crazy Gravity (1996), o jogo original | [benchmark/crazy-gravity.md](benchmark/crazy-gravity.md): as 18 fases mapeadas, com imagens | Pronto (v1.1) |
| Página de leitura do Crazy Gravity, para inspiração | [claude.ai/artifact/UfYWNwM15P6jd2YPDnReh4](https://claude.ai/artifact/UfYWNwM15P6jd2YPDnReh4) (privada, fixada na barra lateral) e a cópia [benchmark/crazy-gravity/pagina-de-leitura.html](benchmark/crazy-gravity/pagina-de-leitura.html) | Publicada |
| GraviTron (2006) e Gravitron 2 (2008), a origem do resgate de pessoas | [benchmark/gravitron.md](benchmark/gravitron.md): regras do 2 lidas no código, 22 fases do 2 e 23 do 1 mapeadas, com imagens ([#106](https://github.com/TARNAGS/resgate-espacial/issues/106)) | Pronto (v1.0) |
| Página de leitura dos Gravitron | [claude.ai/artifact/8yu4nX63Xoix8VneHU59bv](https://claude.ai/artifact/8yu4nX63Xoix8VneHU59bv) (privada) e a cópia [benchmark/gravitron/pagina-de-leitura.html](benchmark/gravitron/pagina-de-leitura.html) | Publicada |
| Outros jogos de nave com gravidade | Seção 3 deste documento | Pronto (resumo) |
| Jetpack Joyride (2011), o primeiro casual do ICP | [benchmark/jetpack-joyride.md](benchmark/jetpack-joyride.md): como um jogo infinito funciona, contado pelo criador ([#107](https://github.com/TARNAGS/resgate-espacial/issues/107)) | Pronto (v1.0) |
| Página de leitura do Jetpack Joyride | [claude.ai/artifact/TjsQe83tBnQbYzsddenUcb](https://claude.ai/artifact/TjsQe83tBnQbYzsddenUcb) (privada) e a cópia [benchmark/jetpack-joyride/pagina-de-leitura.html](benchmark/jetpack-joyride/pagina-de-leitura.html) | Publicada |
| Temple Run (2011), o segundo casual do ICP | [benchmark/temple-run.md](benchmark/temple-run.md): a corrida infinita em 3D, com perseguição, e a comparação com o Jetpack Joyride ([#108](https://github.com/TARNAGS/resgate-espacial/issues/108)) | Pronto (v1.0) |
| Página de leitura do Temple Run | [claude.ai/artifact/DatT92pPFFCnnDwG3vLoBZ](https://claude.ai/artifact/DatT92pPFFCnnDwG3vLoBZ) (privada) e a cópia [benchmark/temple-run/pagina-de-leitura.html](benchmark/temple-run/pagina-de-leitura.html) | Publicada |
| Geometry Dash (2013), o casual mais próximo do nosso jogo | [benchmark/geometry-dash.md](benchmark/geometry-dash.md): a curva das 22 fases oficiais, o mundo de 10 fases curtas (Geometry Dash World), checkpoints e ranking, a comunidade e o modelo grátis + pago ([#127](https://github.com/TARNAGS/resgate-espacial/issues/127)) | Pronto (v1.0) |
| Página de leitura do Geometry Dash | [claude.ai/artifact/Y7Y1rAykSbfkfXuaJdSXRC](https://claude.ai/artifact/Y7Y1rAykSbfkfXuaJdSXRC) (privada) e a cópia [benchmark/geometry-dash/pagina-de-leitura.html](benchmark/geometry-dash/pagina-de-leitura.html) | Publicada |
| Outros casuais do ICP (Subway Surfers, Candy Crush Saga, Plants vs. Zombies) | Seção 4 deste documento | A pesquisar ([#99](https://github.com/TARNAGS/resgate-espacial/issues/99)) |

## 2. O jogo original: Crazy Gravity (1996)

O jogo da juventude do Fernando é o **Crazy Gravity**, de Axel Meierhöfer (XLM Software, Alemanha), versão 2.0E de setembro de 1996, para Windows 95. Ele o reconheceu na lista de candidatos em 05/10/2026. O benchmark completo, com as 18 fases, está em [benchmark/crazy-gravity.md](benchmark/crazy-gravity.md).

### 2.1 Como a memória do Fernando bate com o jogo

| Lembrança (kickoff e #52) | No Crazy Gravity |
|---|---|
| Nave pequena, com gravidade e propulsor | Nave que só acelera para a frente e gira; a gravidade puxa sempre para baixo |
| Combustível limitado e postos no meio da fase | Postos verde e branco; cada pouso puxa um barril, que "some para dentro da nave" |
| Sair da base e voltar | Base amarela e rosa: a fase começa e termina nela |
| Tripulantes que entram na nave | O jogo leva **contêineres de carga**, que também "somem para dentro da nave". Os resgatados que andam até a nave vêm do **Gravitron 2** (seção 3.1) |
| Revista, CD ou disquete | Shareware de cópia livre "em CD-ROM e em disquete" |
| Menu com outros jogos | Coletânea "10 Tons of Games: Mega Collection 1" (1997, 106 jogos) |
| Limitado, poucas fases, como uma demo | A versão shareware tinha só 3 fases |

**Conclusão:** a memória misturou dois jogos. O original é o Crazy Gravity, e o resgate de pessoas veio do Gravitron 2 (2008). O Fernando confirmou em 05/10/2026: "o jogo que realmente inspirou foi o Crazy Gravity".

### 2.2 Direitos hoje (item 2 do #52)

- O autor mantém o site da XLM Software ([xlmsoft.de](https://www.xlmsoft.de/)), e o Crazy Gravity continua na página de downloads, junto com Mad Robots e Dr. Harrison.
- Em 2009, ele **autorizou** um fã a usar os gráficos e os sons do jogo num remake para PSP (Crazy Gravity Portable). Ele é localizável e já foi receptivo a homenagens.
- Existe outro jogo chamado **Crazy Gravity**, de 2021 (JM Neto Game Dev; Steam, PlayStation, Switch e Xbox), sem relação com o original: é um jogo de plataforma em que um astronauta inverte a gravidade. Mais um motivo para o nosso nome ser outro.

### 2.3 Comparação com o Resgate Espacial (item 3 do #52)

| Elemento | Crazy Gravity | Resgate Espacial | Parecido? |
|---|---|---|---|
| Mecânica: girar e acelerar contra a gravidade | Sim | Sim | Igual, mas mecânica não é protegida por direito autoral (Lei 9.610/1998, art. 8º, II) |
| Base de onde sai e para onde volta | Sim | Sim | Parecido, e é regra de jogo |
| Combustível e postos | Plataforma verde e branca, um barril por pouso | Posto no meio do caminho que enche o tanque | Parecido na ideia, diferente na forma |
| O que se leva | Contêineres de carga, um por vez, várias viagens | Três tripulantes, numa viagem só | Diferente |
| Nave | Ônibus espacial prateado, desenhado | Triângulo minimalista | Diferente |
| Fase | Labirinto de cavernas, com chaves, portões, ventiladores, ímãs, canhões e hastes | Corredor da esquerda para a direita, com pedras e, em proposta, obstáculos móveis; sem inimigos que atiram | Diferente |
| Nome | Crazy Gravity | Codinome; o nome final é a P-003 ([#54](https://github.com/TARNAGS/resgate-espacial/issues/54)) | Diferente |
| Arte e som | 256 cores, MIDI ou CD de áudio | 16 bits minimalista, chiptune próprio | Diferente |

**Leitura:** o risco de plágio é baixo. O que é parecido é regra e mecânica, que não são protegidas; nome, arte, sons, desenho das fases e código são nossos. A D-005 continua valendo: inspirar-se nas ideias de obstáculo e de ritmo é normal; copiar o desenho de uma fase, os gráficos ou os sons não. Isto é orientação geral, não parecer jurídico. Se o jogo for vendido ([#98](https://github.com/TARNAGS/resgate-espacial/issues/98)), vale consultar um advogado de propriedade intelectual. A busca de marca no INPI (item 4 do #52) segue com a escolha do nome, na [#54](https://github.com/TARNAGS/resgate-espacial/issues/54).

## 3. Outros jogos de nave com gravidade

### 3.1 A outra metade da memória: GraviTron e Gravitron 2

| | GraviTron (2006) | Gravitron 2 (2008) |
|---|---|---|
| Autor | Dark Castle Software | Dark Castle Software |
| Plataforma | Windows, gratuito | Windows: US$ 5 no site do autor e no Steam, com demo de 5 fases |
| Objetivo da fase | Destruir os reatores do setor | Destruir todos os reatores e fugir para o espaço em 60 segundos, antes de o planeta explodir |
| Resgate | Space-men andam pela superfície; resgatá-los dá pontos | Cientistas andam pela plataforma; quando a nave pousa nela, **eles andam até a nave**. Cada um conserta 15 de energia e vale pontos. É opcional |
| Combustível | Itens de combustível nas plataformas | Tanque gasto pelo motor e pelo escudo; o posto abastece quem paira ou pousa perto |
| Tamanho | 23 fases de campanha, 3 de multijogador e o editor GravED | Mais de 40 fases na campanha principal e 14 na extra (v1.8) |

O benchmark completo, com as regras do Gravitron 2 lidas no código e 45 fases mapeadas, está em [benchmark/gravitron.md](benchmark/gravitron.md) (D-033, [#106](https://github.com/TARNAGS/resgate-espacial/issues/106)).

**Lição de design:** nos Gravitron, o resgate é missão secundária, e a recompensa é útil (conserto e pontos); no Resgate Espacial, ele é o objetivo da fase. Os tripulantes andando até a nave pousada são a imagem que ficou na memória do Fernando.

### 3.2 O gênero ("cave flyers")

| Jogo | Ano e plataforma | Objetivo da fase | Ideia de level design |
|---|---|---|---|
| Gravitar (Atari) | 1982, arcade; no PC na coletânea Atari Arcade Hits 2 (2000) | Destruir bunkers em vários planetas | Cada planeta com gravidade própria e um menu de planetas, que se parece com os nossos mundos |
| Thrust | 1986; no PC: Thrust Deluxe (2000) e Thrust de Peter Ekberg (2001) | Pegar uma cápsula com raio trator e levá-la para o alto | 6 fases que voltam com gravidade invertida e paredes invisíveis: modificadores (P-012) |
| Oids | 1987, Atari ST e Mac | Destruir a prisão, pousar perto e levar os androides até a nave-mãe | Os androides correm até a nave, como os nossos tripulantes |
| Space Taxi e seus clones | 1984 (C64); Ugh! (DOS, 1992, em disquetes de revista); Mars Taxi (Windows, 1997 e 2001) | Levar passageiros de uma plataforma a outra | Plataformas numeradas e posto de gasolina pago; cada fase, uma tela com tema |
| Sub-Terrania | 1994, Mega Drive | Missões em cavernas, com combustível a reabastecer | Missões diferentes por fase |
| TerraFire | 1997, DOS (shareware) | Levar ogivas com raio trator até a superfície | Túneis de vento, paredes de fogo e lagos subterrâneos; 27 missões em 5 mundos; demo com 8 fases |
| Super Transball 2 | 2002, Windows, gratuito | Achar a esfera e levá-la ao alto da fase | Canhões, tanques, portas e lasers; 26 fases em 3 pacotes |
| Back to the Moon | 1997, DOS, gratuito | Pousar em plataformas para resgatar mineiros | Mais obstáculos e mais bônus a cada fase |

## 4. Os casuais de celular do ICP (D-028)

Jetpack Joyride, Subway Surfers, Candy Crush Saga, Plants vs. Zombies e Temple Run, e, desde a revisão do Lean Canvas de 07/10/2026, o Geometry Dash. A pesquisa está no cartão [#99](https://github.com/TARNAGS/resgate-espacial/issues/99). Cada jogo responde às mesmas perguntas feitas ao Crazy Gravity, para comparar lado a lado. O Fernando, em 06/10/2026: os jogos de nave com gravidade são muito parecidos com o que ele pensa em level design (artefatos de gameplay, obstáculos, incremento de fase); os modernos são inspiração menos direta, mas ajudam a entender como jogos infinitos funcionam.

| Pergunta de level design | O que olhar nos casuais | Jetpack Joyride ([benchmark](benchmark/jetpack-joyride.md), [#107](https://github.com/TARNAGS/resgate-espacial/issues/107)) | Temple Run ([benchmark](benchmark/temple-run.md), [#108](https://github.com/TARNAGS/resgate-espacial/issues/108)) | Geometry Dash ([benchmark](benchmark/geometry-dash.md), [#127](https://github.com/TARNAGS/resgate-espacial/issues/127)) |
|---|---|---|---|---|
| Como a fase é organizada | Fases fixas e numeradas (Candy Crush, Plants vs. Zombies) ou corrida sem fim (Jetpack Joyride, Subway Surfers, Temple Run) | Sem fases: uma corrida sem fim, montada na hora por intervalos (entre um mínimo e um máximo) com probabilidades por tipo de objeto | Sem fases: um caminho único gerado na hora, com curvas de 90°; no 2, mapas temáticos | Fases fixas e numeradas, de 82 a 102 s, cada uma com uma música; no Geometry Dash World, 10 fases curtas em 2 mundos de 5 |
| Como a dificuldade sobe | Rampa, serrote, fases de respiro, fases-chefe | Com a distância; os veículos quebram a intensidade em serrote | Com a velocidade, que cresce com a distância; perseguidores sempre atrás | Rampa de uma estrela por fase nas 12 primeiras; depois, em pares: uma fase que apresenta a mecânica e um Demon que cobra |
| Como um elemento novo é apresentado | Fase dedicada, primeira aparição segura, combinação depois | Avisos antes do perigo; câmera lenta, tela limpa e trilhas de moedas para cada veículo; missões que pedem para experimentar | Cada obstáculo pede um gesto que se entende pela forma; testado com pessoas sem nenhuma explicação | Em trecho amplo e calmo; às vezes primeiro como ajuda e depois como armadilha; uma frase na tela só depois de duas batidas |
| Metas por fase | Estrelas, missões, recordes | Três missões ao mesmo tempo (1 a 3 estrelas), recorde de distância e ranking dos amigos | 56 objetivos que aumentam o multiplicador (no 2, três por vez e níveis), recorde e ranking | Concluir (estrelas), recorde de % ("New Best!"), três moedas secretas; na Torre, terminar abaixo de um tempo |
| Duração de uma fase | Quanto cabe numa fila de 2 minutos | A "jogada do intervalo comercial" | De 30 segundos a alguns minutos | 27 a 37 s no World; 82 a 102 s nas principais; metas de 70 a 280 s nas fases de plataforma, com checkpoints |
| O que faz voltar | Recordes, colecionáveis, eventos | Missões que se renovam, níveis e insígnias, loja, roleta, desafio diário, eventos, bônus ao voltar | Multiplicador, melhorias de poderes, personagens, amigos; no 2, desafios diários com sequência, mapas novos e eventos | Mais de 150 milhões de fases da comunidade, fase do dia e demon da semana, missões, baús, ícones |

## 5. Primeiras lições (Proposta)

As ideias detalhadas, com a ligação a cada decisão e pendência, estão no [benchmark do Crazy Gravity, seção 9](benchmark/crazy-gravity.md#9-o-que-levar-para-o-resgate-espacial). Em resumo:

1. **Ritmo em serrote:** em cada mundo de 10 fases, um respiro no meio e uma fase-chefe no fim.
2. **Uma ideia por fase**, que dá para descrever numa frase.
3. **Forças em vez de inimigos:** vento que empurra, campo que puxa e redemoinho que gira a nave são o catálogo mais natural para a P-011, sem quebrar a regra "sem inimigos que atiram".
4. **Ensinar pela estrutura:** circuitos de mão única e recompensas dentro do perigo ensinam sem texto, combinando com a D-031.
5. **Validações:** a DEMO das primeiras fases (D-031) e o recorde por fase (D-024) já existiam no jogo original.
6. **Escala:** o Crazy Gravity tem fases de vários minutos; o nosso jogador quer partidas curtas (D-028). Levar as ideias, não o tamanho.

Dos Gravitron ([benchmark, seção 11](benchmark/gravitron.md#11-o-que-levar-para-o-resgate-espacial)):

7. **Os tripulantes andam até a nave** quando ela pousa: deixa claro o que é o resgate e dá um segundo de tensão no pouso.
8. **A volta como clímax:** uma fuga cronometrada depois do objetivo, em fases especiais ou como modificador.
9. **Terreno que gira e que anda, e perigos com ritmo** (lasers e jatos que ligam e desligam): confirmam a lista de obstáculos móveis da P-011, sem tiro.
10. **Primeira experiência:** a fase 1 com tudo à vista confirma a D-031, mas o Gravitron 2 precisou acrescentar instruções depois do lançamento, e a campanha difícil selecionada por padrão espantou jogadores. Medir se a DEMO basta.
11. **Placar em servidor próprio morre:** no lançamento, preferir os rankings das plataformas (P-019).

Do Jetpack Joyride ([benchmark, seção 12](benchmark/jetpack-joyride.md#12-o-que-levar-para-o-resgate-espacial)):

12. **O placar fica puro:** o ranking de cada fase continua só tempo; estrelas, missões e moedas, se vierem, ficam fora dele.
13. **O custo de perder em três partes** (tempo perdido, custo emocional, atrito para recomeçar): revisar o fim de corrida com essas lentes.
14. **Três missões que se renovam**, de durações diferentes: metas que fazem voltar sem mexer no ranking; os elogios que já temos viram missões.
15. **O serrote dentro da fase:** os pousos no posto e na tripulação são os nossos momentos de alívio; não encher uma fase sem eles.
16. **Intervalos entre um mínimo e um máximo** para a BONUS e fases geradas: o piloto automático garante que é possível; o mínimo regula se é justo.

Do Temple Run ([benchmark, seção 14](benchmark/temple-run.md#14-o-que-levar-para-o-resgate-espacial)):

17. **Dois tipos de erro:** um toque leve vira susto e só o segundo, ou uma batida forte, explode a nave; candidato a modificador ou modo mais fácil, junto com o "casco" dos Gravitron.
18. **Controle feito para o aparelho:** o fracasso anterior da Imangi veio de dois controles virtuais; testar o nosso com quem nunca viu o jogo, sem explicar.
19. **Um motivo para seguir em frente:** em fases especiais, uma ameaça visível que avança, sem inimigo que atira.
20. **O progresso no placar é o oposto do Jetpack Joyride:** o multiplicador do Temple Run mistura progresso (e, no 2, compras) com habilidade; reforça o ranking por tempo puro.
21. **Regras do mundo:** poucos "mandamentos" de identidade, no documento 08, que todo mundo do jogo respeita.

Do Geometry Dash ([benchmark, seção 15](benchmark/geometry-dash.md#15-o-que-levar-para-o-resgate-espacial)):

22. **Checkpoint como parte da fase, com o relógio correndo:** a resposta da Torre para a fase grande; o ranking continua sendo o tempo total (D-024), e um botão recomeça do zero.
23. **Treino que não vale:** o modo prática tem checkpoints livres, nenhuma recompensa e uma música própria; atende quem ainda aprende sem mexer em quem disputa tempo.
24. **Progresso parcial à vista:** porcentagem e "New Best!" transformam a derrota em progresso; uma frase de dica só aparece depois de duas batidas no mesmo ponto.
25. **O par "apresenta e cobra":** a mecânica estreia numa fase mais fácil, em espaço amplo, e a fase-chefe combina; o Geometry Dash World confirma o mundo de 10 fases curtas com uma novidade cada.
26. **Anúncio nunca entre mortes:** o Lite mostra anúncio a cada algumas mortes; num jogo de muitas mortes, é o pior momento.
27. **Fases fixas vendem dificuldade:** dos casuais estudados, é o único com fases fixas, o único que separa treino de conclusão e o único pago; a vida longa veio da comunidade.

## 6. Como a busca do jogo original foi feita

| Data | O que aconteceu |
|---|---|
| 28/09/2026 | Kickoff: o Fernando descreve o jogo da juventude, sem lembrar o nome |
| 01/10/2026 | Cartão [#52](https://github.com/TARNAGS/resgate-espacial/issues/52): achar o jogo e avaliar o risco de plágio |
| 04/10/2026 | Novas pistas: revista com CD ou disquete, menu com vários jogos, talvez uma demo |
| 05/10/2026 | Pesquisa do Claude: lista de 54 jogos do gênero na MobyGames, cerca de 3.400 jogos Flash do Flashpoint, texto digitalizado de 33 edições da revista CD Expert e de um CD de 1996, fórum Adrenaline. Saíram 8 candidatos, com vídeos; o Fernando reconheceu o Crazy Gravity (e o Gravitron 2) |
| 05/10/2026 | O manual original, lido no Internet Archive, confirmou as pistas: 3 fases na versão shareware, cópia livre em CD e disquete, barris que entram na nave |
| 06/10/2026 | O Claude decifrou os arquivos de fase e mapeou as 18 fases ([benchmark/crazy-gravity.md](benchmark/crazy-gravity.md)) |

**Lição de processo:** a memória tinha misturado dois jogos. Mostrar candidatos com vídeo funcionou melhor do que pedir mais detalhes.

### 6.1 Os candidatos mostrados ao Fernando (05/10/2026)

A lista que levou ao reconhecimento, na ordem em que foi apresentada (da mais provável para a menos provável, pelas pistas da época). Os links levam a buscas de vídeo no YouTube.

| # | Candidato | O que batia | O que não batia | Resultado |
|---|---|---|---|---|
| 1 | GraviTron (Dark Castle Software, Windows, 2006, gratuito) | Nave pequena que gira, gravidade, fase com rolagem, astronautas que andam e são resgatados com um pouso perto | Objetivo principal era destruir reatores | Não era ([vídeos](https://www.youtube.com/results?search_query=GraviTron+2006+Dark+Castle+Software)) |
| 2 | Gravitron 2 (Dark Castle Software, Windows, 2008) | Cientistas resgatados ao pousar, células de combustível, demo com poucas fases | Gráfico neon, mais moderno | **Jogado pelo Fernando; é a origem do resgate de pessoas na memória** ([vídeos](https://www.youtube.com/results?search_query=Gravitron+2+gameplay)) |
| 3 | Oids (FTL Games, Atari ST e Mac, 1987) | Nave triangular, gravidade, combustível, bonequinhos que correm para dentro da nave | Sem versão para PC na época | Não era ([vídeos](https://www.youtube.com/results?search_query=Oids+Atari+ST+gameplay)) |
| 4 | Gravitar na coletânea Atari Arcade Hits 2 (PC, 2000) | Nave triangular minúscula, gravidade, combustível, escolha num menu com outros jogos | Sem resgate | Não era ([vídeos](https://www.youtube.com/results?search_query=Gravitar+arcade+gameplay)) |
| 5 | Crazy Gravity (XLM Software, Windows, 1996) | Gravidade, combustível, carga levada de volta à base | Leva caixas, não pessoas | **É o jogo original** ([vídeos](https://www.youtube.com/results?search_query=Crazy+Gravity+1996+Windows)) |
| 6 | Mars Taxi (Windows, 1997 e 2001) e Ugh! (DOS, 1992) | Passageiros que andam até a nave, posto de gasolina | São táxis, sem ida e volta à base | Não era |
| 7 | Back to the Moon (DOS, 1997, gratuito) | Pousar em plataformas para resgatar mineiros, combustível | Estilo Lunar Lander | Não era |
| 8 | Thrust para PC (Thrust Deluxe, 2000; Super Transball 2, 2002) | Nave triangular, combustível, cavernas | Carrega uma bola, não pessoas | Não era |
| — | Jogos Flash Rocket Rescue (2DPlay, 2007) e planetX (Terry Paton, 2005) | Resgate de astronautas com gravidade | Jogos de navegador, com menos pistas batendo | Citados à parte, não eram |

### 6.2 Onde a busca procurou

| Fonte | O que foi feito | Resultado |
|---|---|---|
| Buscas na web, em inglês e português | Pedidos do tipo "qual é o nome deste jogo", listas de "cave flyers", sites de abandonware | Levantou os candidatos da seção 6.1 |
| MobyGames, gênero "Cave-flyers and Thrust variants" | Lista completa (54 jogos), lida por uma cópia arquivada, porque o site pede verificação anti-robô | Filtro dos jogos de PC de 1990 a 2008 |
| Flashpoint (acervo de jogos Flash e Java) | Busca de uns 3.400 jogos cuja descrição fala em combustível, gravidade, propulsor ou resgate | Rocket Rescue e planetX |
| Revista CD Expert (Internet Archive) | Texto digitalizado de 33 edições, buscando "gravidade", "combustível", "nave" e "resgate" | Só o Lander e o Espace Explore; o jogo não estava |
| Revista do CD-ROM Especial Games (1996) | Texto digitalizado do CD de shareware brasileiro | Não estava |
| CD "600 Jogos para Windows" (CD Expert) | Tentativa de listar o conteúdo da imagem do CD | O Internet Archive não conseguiu abrir a imagem |
| Fórum Adrenaline, tópico de jogos esquecidos | Pedidos parecidos | Um pedido de outro jogo (com nave-mãe) |
| Reddit (r/tipofmyjoystick e r/tipofmytongue) | Tentativa de busca | Bloqueado para scripts e para o navegador do app |
| Internet Archive, Crazy Gravity v2.0 | Manual do jogo e do editor, depois do reconhecimento | Confirmou todas as pistas e deu os arquivos das 18 fases |

## 7. Fontes

- [Internet Archive: Crazy Gravity v2.0](https://archive.org/details/CrazyGravity_1020) (jogo, ajuda e fases)
- [MobyGames: Crazy Gravity](https://www.mobygames.com/game/41247/crazy-gravity/) e [gênero cave flyer](https://www.mobygames.com/group/6133/genre-cave-flyers-and-thrust-variants/)
- [XLM Software](https://www.xlmsoft.de/) e [GameBrew: Crazy Gravity Portable](https://www.gamebrew.org/wiki/Crazy_Gravity_Portable_PSP)
- [Gravitron 2 no Steam](https://store.steampowered.com/app/21300)
- [Oids (Wikipedia)](https://en.wikipedia.org/wiki/Oids), [Thrust Deluxe (Home of the Underdogs)](https://www.homeoftheunderdogs.net/game.php?id=3258), [TerraFire (Wikipedia)](https://en.wikipedia.org/wiki/TerraFire), [Super Transball 2](https://manpages.org/supertransball2/6), [Mars Taxi (MobyGames)](https://www.mobygames.com/game/5298/mars-taxi/), [Back to the Moon](https://www.dosgamesarchive.com/download/back-to-the-moon), [Atari Arcade Hits 2](https://www.arcade-history.com/game/82941/atari-arcade-hits-2)
- [Lei 9.610/1998](https://www.planalto.gov.br/ccivil_03/leis/l9610.htm), art. 8º, II

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 0.1 | 06/10/2026 | Primeira versão: o jogo original identificado (Crazy Gravity), a comparação com o nosso, o Gravitron e o gênero; espaço para os casuais da #99 |
| 0.2 | 06/10/2026 | Registro completo da busca (candidatos mostrados e fontes procuradas) e a página de leitura do Crazy Gravity |
| 0.3 | 06/10/2026 | Benchmark do GraviTron e do Gravitron 2 ([benchmark/gravitron.md](benchmark/gravitron.md), [#106](https://github.com/TARNAGS/resgate-espacial/issues/106)), com a página de leitura; seção 3.1 corrigida com o que o código mostrou; lições 7 a 11 |
| 0.4 | 06/10/2026 | Benchmark do Jetpack Joyride ([benchmark/jetpack-joyride.md](benchmark/jetpack-joyride.md), [#107](https://github.com/TARNAGS/resgate-espacial/issues/107)), com a página de leitura; seção 4 com a coluna do Jetpack Joyride e a observação do Fernando; lições 12 a 16 |
| 0.5 | 06/10/2026 | Benchmark do Temple Run ([benchmark/temple-run.md](benchmark/temple-run.md), [#108](https://github.com/TARNAGS/resgate-espacial/issues/108)), com a página de leitura; coluna do Temple Run na seção 4; lições 17 a 21 |
| 0.6 | 06/10/2026 | O [guia dos benchmarks](benchmark/README.md), com a página de leitura, entra no topo da tabela de estudos |
| 0.7 | 08/10/2026 | Benchmark do Geometry Dash ([benchmark/geometry-dash.md](benchmark/geometry-dash.md), [#127](https://github.com/TARNAGS/resgate-espacial/issues/127)), com a página de leitura; coluna do Geometry Dash na seção 4; lições 22 a 27 |
