# Guia dos benchmarks: achados, insights e decisões

| Campo | Valor |
|---|---|
| Documento | Guia de leitura dos benchmarks |
| Versão | 1.3 |
| Data | 08/10/2026 |
| Status | Referência |
| Responsável | Fernando Nunes (Product Manager) |

Este guia junta num lugar só tudo o que foi estudado de 05 a 08/10/2026: seis estudos de jogos (Crazy Gravity, GraviTron e Gravitron 2, Jetpack Joyride, Temple Run, Geometry Dash e Super Mario World), a skill que automatiza o método e a regra que manda consultar os estudos antes de construir (D-033). Ele cruza os jogos, mostra onde concordam e onde divergem e lista o que espera decisão. Os detalhes e as fontes ficam no documento de cada jogo.

> **Página de leitura:** https://claude.ai/artifact/TSGis8FXKTXWWgdQUJH9ar (privada), com links para as seis páginas dos estudos; cópia em [pagina-de-leitura.html](pagina-de-leitura.html).

Tudo o que está em "o que isso sugere para nós" é **Proposta**: interpretação para o Fernando decidir, não decisão.

## Sumário

1. [Por onde começar](#1-por-onde-começar)
2. [Duas famílias, duas perguntas](#2-duas-famílias-duas-perguntas)
3. [O que foi produzido](#3-o-que-foi-produzido)
4. [Insights: o que os jogos ensinam juntos](#4-insights-o-que-os-jogos-ensinam-juntos)
5. [Onde os estudos discordam](#5-onde-os-estudos-discordam)
6. [O que já tínhamos decidido e os estudos confirmam](#6-o-que-já-tínhamos-decidido-e-os-estudos-confirmam)
7. [Decisões que esperam o Fernando](#7-decisões-que-esperam-o-fernando)
8. [Lacunas e grau de confiança](#8-lacunas-e-grau-de-confiança)
9. [O que falta estudar](#9-o-que-falta-estudar)
10. [Como os estudos foram feitos](#10-como-os-estudos-foram-feitos)
11. [Linha do tempo](#11-linha-do-tempo)

## 1. Por onde começar

| Tempo disponível | O que ler |
|---|---|
| 5 minutos | As seções 4 (insights) e 7 (decisões) deste guia |
| 20 minutos | As seis páginas de leitura, nesta ordem: Crazy Gravity, Gravitron, Jetpack Joyride, Temple Run, Geometry Dash e Super Mario World (links na seção 3) |
| Para decidir um cartão | A seção "O que levar para o Resgate Espacial" do benchmark do jogo e o último comentário do cartão |
| Antes de construir algo | A skill `discovery-de-jogos`, no modo consulta rápida (D-033), que começa por este guia e pelo [documento 10](../10-benchmark-de-level-design.md) |

## 2. Duas famílias, duas perguntas

O Fernando, em 06/10/2026, depois do estudo dos Gravitron: os jogos de nave com gravidade "são muito semelhantes ao que eu penso enquanto level design: possibilidades de artefatos para gameplay, obstáculos e incrementos de fase"; os modernos são inspiração menos direta, "mas dá para entender um pouco sobre como jogos 'infinitos' funcionam".

Daí a divisão de trabalho entre os estudos:

| Família | Jogos estudados | Pergunta que responde |
|---|---|---|
| Jogos de nave com gravidade (D-032) | Crazy Gravity (1996), GraviTron (2006), Gravitron 2 (2008) | **Level design:** que obstáculos e objetos uma fase pode ter, como a dificuldade sobe de fase em fase, como uma novidade é apresentada |
| Casuais de celular do ICP (D-028) | Jetpack Joyride (2011), Temple Run (2011), Geometry Dash (2013) | **Produto:** como o jogador aprende, quanto custa perder, o que faz voltar, como a pontuação e o negócio funcionam |

O **Geometry Dash** fica entre as duas famílias: é um casual de celular do público-alvo, mas tem fases fixas e numeradas e uma curva de dificuldade medida fase a fase, como os jogos de nave. Entrou na lista na revisão do Lean Canvas (07/10/2026), quando o problema central do jogador virou "passar fases difíceis e criativas e sentir que fiquei bom nisso".

O **Super Mario World** (1990) não é de nenhuma das duas famílias: é uma **referência de método**, pedida pelo Fernando em 08/10/2026 para entender como um jogo ensina sem tutorial. Responde a uma pergunta só, a da D-031: como o jogador aprende jogando.

## 3. O que foi produzido

### 3.1 Os estudos

| Jogo | Por que foi estudado | Documento | Página de leitura | Imagens | Cartão |
|---|---|---|---|---|---|
| **Crazy Gravity** (1996) | O jogo original da memória do Fernando; ele só tinha jogado as 3 fases de teste | [crazy-gravity.md](crazy-gravity.md): as 18 fases lidas dos arquivos do jogo, catálogo, curva e recepção | [UfYWNwM15P6jd2YPDnReh4](https://claude.ai/artifact/UfYWNwM15P6jd2YPDnReh4) (fixada na barra lateral) | 20: as 18 fases, a curva e a legenda | [#52](https://github.com/TARNAGS/resgate-espacial/issues/52) (fechado) |
| **GraviTron** (2006) e **Gravitron 2** (2008) | A origem do resgate de pessoas, a outra metade da memória | [gravitron.md](gravitron.md): regras do 2 lidas no código que o autor publicou; 22 fases do 2 e 23 do 1 mapeadas | [8yu4nX63Xoix8VneHU59bv](https://claude.ai/artifact/8yu4nX63Xoix8VneHU59bv) | 48: 46 mapas (com a fase de instruções), a curva e a legenda | [#106](https://github.com/TARNAGS/resgate-espacial/issues/106) |
| **Jetpack Joyride** (2011) | O primeiro casual do ICP: como um jogo infinito funciona | [jetpack-joyride.md](jetpack-joyride.md): contado pelo criador (vídeo de 2023 e slides da GDC 2012) | [TjsQe83tBnQbYzsddenUcb](https://claude.ai/artifact/TjsQe83tBnQbYzsddenUcb) | 4 diagramas | [#107](https://github.com/TARNAGS/resgate-espacial/issues/107) |
| **Temple Run** (2011) | O segundo casual: a corrida infinita com perseguição, comparada ao Jetpack Joyride | [temple-run.md](temple-run.md): contado pelos criadores (GDC 2014, entrevistas dos 10 anos) | [DatT92pPFFCnnDwG3vLoBZ](https://claude.ai/artifact/DatT92pPFFCnnDwG3vLoBZ) | 3 diagramas | [#108](https://github.com/TARNAGS/resgate-espacial/issues/108) |
| **Geometry Dash** (2013) | O casual mais próximo do nosso: dificuldade com fases fixas, checkpoints e ranking, modelo grátis + pago | [geometry-dash.md](geometry-dash.md): o criador (entrevistas, 231 respostas em duas AMAs, guia de avaliação de fases) e as 22 fases oficiais pela wiki | [Y7Y1rAykSbfkfXuaJdSXRC](https://claude.ai/artifact/Y7Y1rAykSbfkfXuaJdSXRC) | 5 diagramas: a curva, o mundo de 10 fases, checkpoints, o funil e a linha do tempo | [#127](https://github.com/TARNAGS/resgate-espacial/issues/127) |
| **Super Mario World** (1990) | Referência de como ensinar sem tutorial, a pedido do Fernando | [super-mario-world.md](super-mario-world.md): a equipe contando como construiu (sete entrevistas Iwata Asks lidas inteiras), os 31 textos do jogo classificados, o primeiro mundo aula por aula e as lições de design do Super Mario Maker 2 | [7LSubtYDh5iEywjTtB8hP3](https://claude.ai/artifact/7LSubtYDh5iEywjTtB8hP3) | 5 diagramas: onde o jogo fala, o primeiro mundo, os quatro tempos, as camadas de erro e a ajuda depois do erro | [#128](https://github.com/TARNAGS/resgate-espacial/issues/128) |
| **Candy Crush Saga** (2012), **Plants vs. Zombies** (2009) e **Subway Surfers** (2012) | Os três casuais do ICP que faltavam (D-028): mapa longo, metas por fase e o que faz voltar | [casuais-do-icp.md](casuais-do-icp.md): comparativo, com 110 fases do Candy Crush pela wiki, o molde dos mundos do Plants vs. Zombies, a palestra do criador e as entrevistas da King e da SYBO | — (comparativo, sem página própria) | — | [#99](https://github.com/TARNAGS/resgate-espacial/issues/99) |

As páginas de leitura ficam em claude.ai/artifact/ seguido do código da tabela, todas privadas. Cada pasta tem uma cópia da página (`pagina-de-leitura.html`) e as ferramentas que geram as imagens (`ferramentas/`, com um README de como regenerar). Os arquivos originais dos jogos ficam fora do Git.

### 3.2 O que mudou no resto do projeto

- **[Documento 10](../10-benchmark-de-level-design.md)** (benchmark de level design), da versão 0.1 à 0.8: a tabela de estudos, a seção 3.1 corrigida pelo que o código do Gravitron 2 mostrou, a tabela que compara os casuais (seção 4) e 33 lições numeradas (seção 5).
- **[D-033](../05-registro-de-decisoes.md#d-033--antes-de-construir-passar-pelos-estudos-inspirar-nunca-copiar)**: antes de construir uma mecânica, fase, obstáculo ou regra, passar pelos estudos e validar; inspirar, nunca copiar; o Fernando orienta o que é criado. Entrou também no `CLAUDE.md` do projeto.
- **[Diário de bordo](../06-diario-de-bordo.md)**: uma entrada por estudo e os próximos passos.
- **Quadro:** os cartões #106, #107, #108, #127 e #128 estão em "Para conversar", com Quem = Fernando, cada um com resposta, evidências, recomendação e o que ficou em aberto.

### 3.3 A skill `discovery-de-jogos`

- **O que é:** o método do estudo do Crazy Gravity transformado em instruções que o Claude segue sozinho, a pedido do Fernando em 06/10/2026.
- **Onde fica:** `context-directory/setup/claude-global/skills/discovery-de-jogos/` (`SKILL.md` e `modelo.md`). Vale no Mac e no Windows.
- **Como usar:** pedir "estude o <jogo>" ou digitar `/discovery-de-jogos`.
- **Três tamanhos:** completo (como os seis estudos), comparativo (vários jogos lado a lado) e consulta rápida (antes de construir, D-033).
- **Como melhorou com o uso:** o estudo dos Gravitron trouxe a leitura de formatos de arquivo e o arquivo da internet (Wayback); o do Jetpack Joyride, a variante "jogo infinito" do modelo; o do Temple Run, a seção de comparação com outro jogo do gênero e dicas para ler transcrições de vídeos; o do Geometry Dash, ler as respostas do criador em AMAs do Reddit por um arquivo público (Arctic Shift), já que o Reddit recusa scripts; o do Super Mario World, ler as entrevistas Iwata Asks inteiras pelo texto que cada página do site oficial traz embutido.

## 4. Insights: o que os jogos ensinam juntos

Cada insight junta evidências de mais de um jogo. As fontes estão no documento de cada jogo.

### 4.1 O controle é o produto, e o maior risco

- **Temple Run:** nasceu de um fracasso. O jogo anterior do estúdio usava dois controles virtuais, e a maioria das pessoas não entendia como jogar. O protótipo seguinte, de um dia, controlava o personagem só com gestos.
- **Jetpack Joyride:** um botão só. O protótipo de um dia serviu só para acertar o equilíbrio entre flutuar e responder.
- **Gravitron 2:** o controle é a reclamação mais comum no Steam.
- **Crazy Gravity:** a inércia "bem simulada" é o centro da diversão, segundo a crítica.

**O que isso sugere para nós:** confirma a D-006, a D-022 e o M1 como portão. O próximo passo é barato: testar o controle com quem nunca viu o jogo, sem explicar nada ([#44](https://github.com/TARNAGS/resgate-espacial/issues/44), documento 07).

### 4.2 Ensinar sem texto funciona, mas precisa ser medido

- **Crazy Gravity:** a fase 1 é um circuito de mão única, e a versão de teste mostrava as fases 1 a 3 numa demonstração.
- **Gravitron 2:** a fase 1 mostra tudo à vista. Mesmo assim, o autor acrescentou uma página de instruções na versão 1.7, e a campanha difícil, selecionada por padrão, espantou jogadores.
- **Jetpack Joyride:** avisos antes do perigo e trilhas de moedas em forma de seta, acrescentadas porque, no primeiro grande teste, as pessoas morriam logo depois de entrar num veículo, quando o controle muda.
- **Temple Run:** a forma do obstáculo diz o gesto. O teste era entregar o celular sem explicar nada.
- **Super Mario World:** sem tutorial, mas com texto: 19 dicas opcionais, cada uma um passo antes de onde serve, 11 delas no primeiro mundo. Na reedição de 2001, a Nintendo acrescentou dicas ao começo. Vinte anos depois, a mesma equipe passou a oferecer ajuda depois de 8 vidas perdidas numa fase.
- **Geometry Dash:** sem tutorial, mas com uma frase na tela depois de duas batidas no primeiro obstáculo das fases 1 e 3. Mesmo assim, a Common Sense Media critica a curva íngreme e a falta de tutorial, e jogadores ficam semanas presos nas fases 6 e 7.

**O que isso sugere para nós:** a DEMO e o attract mode (D-031) estão do lado certo. O risco é achar que bastam; a dica mínima do Geometry Dash e a ajuda calibrada da Nintendo, só depois do erro, são meios-termos a testar no nível 1 (insight 4.14). Vale medir no próximo playtest se quem vê a DEMO entende "ir, resgatar e voltar", e garantir que o padrão de qualquer menu seja o caminho mais fácil.

### 4.3 Placar: os dois casuais fizeram escolhas opostas

- **Jetpack Joyride:** só a distância, de propósito. O criador recusou um multiplicador para que o jogador pudesse se comparar com os amigos.
- **Temple Run:** distância e moedas, vezes um multiplicador que cresce com os objetivos cumpridos (e, no Temple Run 2, também com compras).
- **Crazy Gravity:** os 3 melhores tempos de cada fase.
- **Gravitron 2:** pontos que premiam pressa e economia; o placar online morreu junto com o servidor do autor.
- **Geometry Dash:** nas fases clássicas a tela anda sozinha, então o que se mede é concluir e até onde se chegou (%); nas fases de plataforma, em que o jogador controla a velocidade, o ranking é o **tempo total**. O ranking global soma estrelas e só mostra jogadores aprovados por moderadores, por causa de trapaça.

**O que isso sugere para nós:** o ranking por tempo (D-024) fica de pé, agora com um contraexemplo claro. Estrelas e missões, se vierem, ficam fora do ranking. No lançamento, os rankings das plataformas evitam o destino do placar do Gravitron 2 (P-019).

### 4.4 Intensidade constante cansa: o serrote aparece em toda escala

- **Entre fases:** no Crazy Gravity, picos nas fases 3, 14 e 18 e respiros nas 4, 6 e 8; na campanha extra do Gravitron 2, picos nas fases 8, 11 e 13.
- **Dentro da corrida:** a primeira versão do Jetpack Joyride foi chamada de "chata" pela empresa inteira. O problema era a intensidade sempre no alto. Os veículos criaram o serrote, e o criador considera essa a decisão mais importante do jogo.
- **No Temple Run:** a velocidade sobe sem parar, e o tropeço é um pico curto de tensão.
- **No Geometry Dash:** rampa nas 12 primeiras fases e, depois, pares: uma fase que apresenta uma mecânica num nível mais baixo e um Demon que cobra tudo.

**O que isso sugere para nós:** já temos um serrote natural (voo tenso, pouso no posto ou na tripulação, voo de novo); os pousos são os nossos "veículos". Em cada mundo, um respiro por volta da fase 5 e uma fase-chefe na 10 (documento 08). E não encher uma fase de obstáculos sem um ponto de alívio.

**Reforço dos casuais (09/10, [comparativo](casuais-do-icp.md)):** no Plants vs. Zombies, a fase 5 de cada mundo é um respiro com outra regra, e a 10 é especial; no Candy Crush, os picos de dificuldade vêm isolados no meio de fases fáceis, e o jogo avisa no mapa.

### 4.5 Quanto custa errar é uma decisão de design

- **Erro fatal:** no Crazy Gravity, encostar explode a nave e a carga volta para a origem; no Jetpack Joyride, um golpe acaba a corrida; no nosso jogo, hoje, também.
- **Erro com perdão:** no Gravitron, bater faz a nave quicar e perder energia. É divertido, mas vira caos em corredores, e o laser que mata na hora é criticado justamente por destoar. No Temple Run, há dois tipos de erro: o tropeço avisa, e o segundo tropeço logo depois, ou um erro grande, encerra a corrida.
- **O custo em três partes** (Jetpack Joyride): tempo perdido, custo emocional e atrito para recomeçar, cada um atacado de um jeito.
- **Erro em camadas** (Super Mario World): o poder absorve o golpe, a reserva cai sozinha, o Yoshi foge e volta, o portão do meio ainda dá um cogumelo, e o jogo sobra em vidas.
- **Erro fatal, mas barato** (Geometry Dash): bater volta ao 0%, mas o recomeço é automático e instantâneo, a porcentagem e o "New Best!" mostram o progresso, e a moeda da loja é paga pelo recorde de %, mesmo sem concluir.

**O que isso sugere para nós:** o atrito já é baixo: no primeiro playtest, quem disputava tempo recomeçava com mediana de 0,9 segundo (documento 09). Falta olhar o custo emocional, ou seja, o que a tela de fim mostra. E o "casco" do Gravitron ou o "tropeço" do Temple Run podem virar um modificador ou um modo mais fácil para o jogador casual (D-028), sem mexer no modo padrão.

### 4.6 Pressão sem tiro: repertório de sobra

- **Crazy Gravity:** o adversário é a caverna: ventiladores, ímãs, correntes de ar e hastes que abrem e fecham.
- **Gravitron 2:** a fuga de 60 segundos depois do objetivo e o "lander" que vem sequestrar os cientistas.
- **Temple Run:** os perseguidores nunca atacam com armas; os macacos existem para responder "por que o personagem não para?".
- **Jetpack Joyride:** os mísseis, o que mais se aproxima de um inimigo que atira.

**O que isso sugere para nós:** a regra "sem inimigos que atiram" não empobrece o jogo. Forças (vento, campo, redemoinho), perigos com ritmo (lasers e jatos que ligam e desligam), terreno que gira e anda e ameaças que avançam (tempestade, água subindo, fuga cronometrada) cobrem o catálogo de obstáculos (P-011) e os modificadores (P-012).

### 4.7 Uma ideia por fase, apresentada pequena e depois repetida

- **Crazy Gravity:** cada fase tem um destaque que cabe numa frase (o porão, a cadeia de chaves, a fase vertical), e os obstáculos aparecem em série, formando trechos com identidade.
- **Gravitron 2:** as fases 1 a 5 trazem uma novidade cada (terreno aberto, primeiro poço, laser e elevador, caverna que gira, três lasers seguidos).
- **Jetpack Joyride:** cada veículo entra com câmera lenta, tela limpa e uma trilha que ensina.
- **Super Mario World e a Nintendo:** a fase de uma ideia em quatro tempos (apresentar, desenvolver, surpreender, concluir), formalizada por Koichi Hayashida em 2012; no Super Mario World, uma ou duas ideias por fase no primeiro mundo, sempre com segunda chance.
- **Geometry Dash:** 19 das 22 fases apresentam uma mecânica, em trecho amplo e calmo; no Geometry Dash World, um mundo de 10 fases de cerca de 30 s, cada uma com uma novidade só.

**O que isso sugere para nós:** no documento 08, cada fase do mundo ganha uma frase de destaque; a novidade aparece primeiro numa fase curta e segura e só depois é combinada com outras.

**Reforço dos casuais (09/10):** o Candy Crush apresenta uma novidade a cada 3 ou 4 fases nas 80 primeiras e só combina depois; o Plants vs. Zombies dá uma planta e apresenta um zumbi por vez, e começa com uma linha só no gramado.

### 4.8 A mecânica primeiro, o tema depois, e o conteúdo feito para crescer

- **Temple Run:** o templo nasceu das paredes de caixas do protótipo. O Temple Run 2 foi reescrito do zero para poder crescer sem mexer no que as pessoas gostavam.
- **Jetpack Joyride:** a loja e o conteúdo foram pensados para receber atualizações (13 nos dois primeiros anos).
- **Crazy Gravity e GraviTron:** editores de fases que estenderam a vida dos jogos.

**O que isso sugere para nós:** valida o caminho seguido (controle antes da arte, no M1; conteúdo como dado, na D-011). O editor de fases fica como ideia para depois do lançamento.

### 4.9 Times minúsculos fizeram estes jogos

- **Crazy Gravity:** uma pessoa (Axel Meierhöfer).
- **GraviTron e Gravitron 2:** um estúdio de uma pessoa só.
- **Temple Run:** três pessoas, em cerca de cinco meses.
- **Geometry Dash:** uma pessoa, quatro meses em meio período, e ainda sozinha doze anos depois.
- **Jetpack Joyride:** o núcleo citado nos créditos é pequeno (o criador, um programador, uma pessoa na arte e o músico); o jogo levou dez meses dentro da Halfbrick.

**O que isso sugere para nós:** a "squad de uma pessoa e uma máquina" não é uma escala estranha para este gênero. A diferença está no tempo disponível, já que o Resgate Espacial é um projeto paralelo. Bom ângulo para o portfólio.

### 4.10 Negócio: grátis sem barreira venceu em 2011; demo com fases era o modelo do PC

- **Crazy Gravity:** shareware com 3 fases de teste (fácil, média e difícil) e US$ 30 pela versão completa.
- **Gravitron:** o 1 grátis; o 2 por US$ 5, com demo de 5 fases e expansões grátis.
- **Jetpack Joyride:** lançado pago, ficou grátis em dezembro de 2011 e passou a render mais. Hoje, os anúncios são a reclamação mais comum nas lojas.
- **Temple Run:** lançado a US$ 0,99, ficou grátis "por um fim de semana", passou a render mais e nunca mais voltou a ser pago. Chegou ao 1º lugar sem marketing, com 1% dos jogadores pagando.
- **Geometry Dash:** o contrário: pago (US$ 1,99, hoje US$ 3,99), sem anúncios e sem compras, com um Lite grátis com anúncios que leva ao pago. O criador explica: subir no ranking dos pagos exigia menos downloads. Mas os anúncios do Lite aparecem entre mortes, o pior momento.

**O que isso sugere para nós:** insumo direto para a pesquisa de preço e lojas (P-014, [#98](https://github.com/TARNAGS/resgate-espacial/issues/98)). Dois modelos estão na mesa: o "lite" (algumas fases grátis mostrando a curva inteira e o resto pago, que o Geometry Dash leva ao limite com dois aplicativos) e o grátis com compras opcionais. Desde 07/10/2026, os anúncios entram no modelo (documento 13); o Geometry Dash mostra onde não pô-los. Os casos de 2011 são do começo da App Store; se ainda valem em 2026 é pergunta para a #98. As reclamações de anúncios do Jetpack Joyride reforçam o "sem anúncios" (D-003).

### 4.11 Diagnosticar o retorno antes de reagir

- **Jetpack Joyride:** diante do "chato", o criador passou semanas acrescentando poderes (o diagnóstico errado) até perceber que o problema era a intensidade constante.
- **Gravitron 2:** quase todas as atualizações depois do lançamento deixaram o jogo mais fácil ou mais claro, sinal de que o autor calibrou difícil demais para quem chegava.
- **Super Mario 3D Land:** um testador travado recusou voar por cima do trecho; queria jogá-lo. Daí veio uma ajuda que deixa continuar jogando.
- **No nosso projeto:** a D-027 já ensinou isso. As mortes no pouso pareciam um problema de pouso, e o problema era entender o propulsor.

**O que isso sugere para nós:** ao ler o próximo playtest, perguntar o que a pessoa quis dizer antes de construir a resposta.

### 4.12 Cada jogo tem um momento que fica na memória

- **Gravitron 2:** os cientistas andando até a nave pousada, a imagem que ficou na memória do Fernando por anos, e a fuga de 60 segundos.
- **Crazy Gravity:** jogadores procuraram o jogo por 20 anos depois de jogar uma demo de revista.
- **Jetpack Joyride:** os veículos. **Temple Run:** a fuga com os macacos atrás.

**O que isso sugere para nós (interpretação):** o momento marcante de cada jogo nasce da mecânica principal. No Geometry Dash, é passar uma fase depois de centenas de tentativas, com a música junto. O nosso candidato é o pouso do resgate, com os tripulantes andando até a nave (proposta 1 da #106). É pequeno de construir e reforça a DEMO.

### 4.13 Checkpoint não precisa estragar o ranking

- **Geometry Dash, fase clássica:** a conclusão que vale é sem morrer; o treino com checkpoints existe à parte, não dá recompensa e tem outra música.
- **Geometry Dash, fase de plataforma:** os checkpoints são desenhados na fase e valem; o ranking é o tempo total, com o relógio correndo nas mortes (inferido), e um botão recomeça do zero.
- **Gravitron 2:** checkpoints acrescentados na versão 1.2.
- **Super Mario World:** um portão do meio por fase, de propósito: para Miyamoto, repetir os trechos fáceis dá prazer e faz o jogador melhorar. A Nintendo ensina a pô-lo logo antes do trecho que vai pedir muitas tentativas.
- **No nosso playtest:** quem disputava tempo recomeçava logo depois da primeira morte (mediana de 0,9 s), e a base e a plataforma da tripulação já funcionam como pontos de retorno.

**O que isso sugere para nós:** a fase grande pode ter checkpoints sem mexer no ranking por tempo puro (D-024): o tempo corre direto, e quem quer o recorde recomeça do zero. O treino com checkpoints livres, que não vale, atende quem ainda aprende.

### 4.14 Ajuda só depois do erro, na hora certa

- **Super Mario World (1990):** nenhuma ajuda depois do erro; só dicas fixas e opcionais.
- **New Super Mario Bros. Wii (2009):** o Super Guide (o computador joga a fase) aparece depois de 8 vidas perdidas. No menu, Miyamoto recusou; depois de 3, ele mesmo se irritou; discutiram 5 e 10.
- **Super Mario 3D Land (2011):** ajuda depois de 5 e de 10; Tezuka pediu 5 "confiando no instinto de jogador".
- **Geometry Dash (2013):** uma frase depois de 2 batidas.
- **Orgulho:** medalhas para quem termina sem ver a ajuda; a demonstração gravada sem truques, para quem vê pensar que também consegue.

**O que isso sugere para nós:** a D-031 ("sem oferta de ajuda") fica na companhia do Super Mario World, mas a mesma equipe mudou de ideia com números testados. Testar uma oferta opcional depois de N mortes no mesmo ponto, com N medido no playtest, e uma DEMO mais modesta. Como a nossa física é menos intuitiva que o pulo do Mario, talvez precisemos de mais ajuda, não de menos.

**Reforço dos casuais (09/10):** a sétima técnica do criador do Plants vs. Zombies é a mensagem que se adapta: a dica aparece só quando o jogador erra, com no máximo oito palavras na tela.

### 4.15 Diversão e dificuldade se medem separadas

A King mede a diversão de cada fase pelo tempo até passar e pelo tempo até abandonar, e a dificuldade pelo perfil de quem joga (vitórias, derrotas e tentativas). As 100 fases menos divertidas são consertadas sempre, e isso aumentou o engajamento. A fase 65, a mais difícil do lançamento, foi a que mais vendeu e a que mais fez gente desistir; a versão mais fácil segurou os jogadores por mais tempo. Conclusões dela: fases difíceis demais "nunca compensam" no longo prazo, e quanto mais longa a fase, menor a chance de ser divertida ([comparativo, seção 2.3](casuais-do-icp.md)).

**O que isso sugere para nós:** a telemetria já mede tentativas e mortes ([#91](https://github.com/TARNAGS/resgate-espacial/issues/91)); falta olhar o tempo até passar e o tempo até abandonar por fase, e fazer da lista das fases menos divertidas um passo de cada rodada de playtest (P-008, [#56](https://github.com/TARNAGS/resgate-espacial/issues/56)).

### 4.16 Um molde para o mundo de 10 fases

O Plants vs. Zombies repete o mesmo ritmo em cada mundo de 10 fases: novidades nas primeiras, um respiro com regra diferente na 5, um pouco de história na 9 e uma fase especial na 10, que entrega a peça do mundo seguinte. Cada mundo muda uma regra do cenário. O Candy Crush faz parecido por episódio: a novidade entra na fase de abertura. É a resposta mais concreta, entre os estudos, para o design dos nossos mundos (D-020, documento 08).

## 5. Onde os estudos discordam

| Tema | De um lado | Do outro | Onde estamos |
|---|---|---|---|
| Placar | Só a distância (Jetpack Joyride) | Multiplicador com progresso e compras (Temple Run) | Tempo puro por fase (D-024) |
| Justiça | Caminho provado pelo piloto automático (a nossa D-018) | Um trecho mais difícil, de propósito, de vez em quando (Jetpack Joyride) | Proposta: continuar provando e usar os mapas de calor para achar trechos onde muita gente morre do mesmo jeito ([#91](https://github.com/TARNAGS/resgate-espacial/issues/91)) |
| Erro | Fatal (Crazy Gravity, Jetpack Joyride, o nosso hoje) | Com perdão (o quique do Gravitron, o tropeço do Temple Run) | Fatal no modo padrão; perdão como modificador (Proposta, P-012) |
| Tamanho da fase | Fases longas, com chaves e várias viagens (Crazy Gravity); fases enormes no fim (Gravitron) | Corridas de 30 segundos a poucos minutos (Jetpack Joyride, Temple Run) | Partidas curtas (D-028): levar as ideias, não a escala |
| Fases | Desenhadas à mão e fixas (Crazy Gravity, Gravitron) | Geradas na hora (Jetpack Joyride, Temple Run) | Fixas (D-021); a BONUS sorteada poderia usar intervalos entre um mínimo e um máximo (Proposta) |
| Cobrança | Pago, com demo de algumas fases (Crazy Gravity, Gravitron 2); pago sem anúncios + Lite grátis com anúncios (Geometry Dash) | Grátis com compras (Jetpack Joyride, Temple Run) | Anúncios decididos na revisão do Lean Canvas (documento 13); cobrar ou não segue em aberto (P-014, #98) |
| Checkpoints | Nenhum na corrida que vale; treino à parte (Geometry Dash, fase clássica); um só por fase, porque repetir o fácil dá prazer (Super Mario World) | Checkpoints fixos que valem, com o tempo correndo (Geometry Dash, fase de plataforma; Gravitron 2) | Pontos de retorno na base e na tripulação; a fase grande está em aberto (documento 13, seção 3.2) |
| Ajuda depois do erro | Nenhuma (a nossa D-031; Super Mario World) | Uma frase depois de duas batidas (Geometry Dash); o Super Guide depois de 8 vidas (New Super Mario Bros. Wii) | Sem oferta de ajuda (D-031); a oferta depois do erro é Proposta da #127 e da #128 |

## 6. O que já tínhamos decidido e os estudos confirmam

| Decisão nossa | Quem confirma |
|---|---|
| Controle como maior risco, testado e comparado (D-006, D-022) | Crazy Gravity, Gravitron, Jetpack Joyride e Temple Run (seção 4.1) |
| Fases fixas para comparar tempos e ranking por fase (D-021, D-024) | Crazy Gravity (3 melhores tempos por fase), Gravitron (placar online), Jetpack Joyride (placar puro), Geometry Dash (fases fixas; ranking por tempo nas fases de plataforma) |
| Mundos de 10 fases, com uma novidade por fase (D-020) | Geometry Dash World (10 fases de cerca de 30 s, em 2 mundos de 5, uma novidade cada); Plants vs. Zombies (5 mundos de 10, com o mesmo molde em cada um) |
| Aparência separada das regras e do ranking (D-034, D-035) | Geometry Dash (ícones só cosméticos, ganhos jogando) |
| Sem tutorial: DEMO e attract mode (D-031) | Crazy Gravity (demonstração das fases 1 a 3), Gravitron 2 (fase 1 com tudo à vista), Temple Run (testar sem explicar), Geometry Dash (sem tutorial), Super Mario World (sem tutorial, com dicas opcionais no lugar); com o alerta das instruções acrescentadas no Gravitron 2, da dica mínima do Geometry Dash e da ajuda depois do erro que a Nintendo acrescentou em 2009 |
| Partidas curtas para o jogador casual (D-028) | Jetpack Joyride (a "jogada do intervalo comercial"), Gravitron (um jogador que volta há anos, 10 minutos por vez), Temple Run (30 segundos a minutos) |
| Sem anúncios (D-003), revista na revisão do Lean Canvas: anúncios entram, sem ser tóxicos (documento 13) | Jetpack Joyride (anúncios são a maior reclamação hoje) e Geometry Dash (o Lite põe anúncio entre mortes) mostram onde o anúncio incomoda |
| Conteúdo como dado (D-011) | Temple Run 2 (reescrito para crescer), Jetpack Joyride (loja feita para atualizações) |
| Teste com pessoas cedo e sempre (documentos 07 e 09) | Jetpack Joyride (a empresa inteira jogando, com versão nova a cada duas semanas), Temple Run (entregar o celular sem explicar) |
| Pontos de retorno na fase (regras, seção 7.1) | Gravitron 2 (checkpoints acrescentados na versão 1.2) |
| Ler o dado com contexto (D-027) | Jetpack Joyride ("chato" não queria dizer "falta conteúdo") |

## 7. Decisões que esperam o Fernando

Os seis cartões estão em "Para conversar". Cada um tem quatro recomendações.

| Cartão | Recomendação | Ligado a |
|---|---|---|
| [#106](https://github.com/TARNAGS/resgate-espacial/issues/106) Gravitron | 1. Tripulantes que andam até a nave quando ela pousa (levar para o MVP, como história) | Regras, seção 6; D-031 |
| | 2. Terreno que gira e que anda, e lasers e jatos que ligam e desligam, no catálogo de obstáculos | P-011 ([#60](https://github.com/TARNAGS/resgate-espacial/issues/60)) |
| | 3. Fuga cronometrada na volta, como modificador ou fase especial | P-012 ([#61](https://github.com/TARNAGS/resgate-espacial/issues/61)), [#79](https://github.com/TARNAGS/resgate-espacial/issues/79) |
| | 4. No lançamento, rankings do Game Center e do Google Play Games | P-019 ([#101](https://github.com/TARNAGS/resgate-espacial/issues/101)) |
| [#107](https://github.com/TARNAGS/resgate-espacial/issues/107) Jetpack Joyride | 1. Placar puro: ranking só com tempo | D-024; P-006 ([#53](https://github.com/TARNAGS/resgate-espacial/issues/53)) |
| | 2. Revisar a tela de fim com as três lentes do custo de perder | Documento 09; D-031 |
| | 3. Três missões que se renovam, com os elogios que já existem (depois do MVP) | P-006; [#81](https://github.com/TARNAGS/resgate-espacial/issues/81) |
| | 4. Intervalos entre um mínimo e um máximo para a BONUS | D-018; D-021 |
| [#108](https://github.com/TARNAGS/resgate-espacial/issues/108) Temple Run | 1. Dois tipos de erro como modificador ou modo mais fácil | P-012; D-027; D-028 |
| | 2. Testar o controle com quem nunca viu o jogo, sem explicar, no próximo playtest | D-022; [#44](https://github.com/TARNAGS/resgate-espacial/issues/44); documento 07 |
| | 3. Escrever as "regras do mundo" no documento 08 | Documento 08; D-005 |
| | 4. Manter o ranking por tempo puro (a mesma da #107, item 1) | D-024; P-006 |
| [#127](https://github.com/TARNAGS/resgate-espacial/issues/127) Geometry Dash | 1. Fase grande com checkpoints que valem, relógio correndo e botão de recomeçar do zero | Documento 13, seção 3.2; D-024; P-006 |
| | 2. Treino com checkpoints livres que não vale (o TRAINING ampliado) e o progresso parcial à vista | D-031; P-009; documento 09, achado 4 |
| | 3. Anúncio nunca entre mortes, só em pausas naturais ou por escolha | Documento 13, seção 5.2; P-014 |
| | 4. Uma fase da semana, igual para todos, como motor da North Star | Documento 13, seção 3.4; P-019 |
| [#128](https://github.com/TARNAGS/resgate-espacial/issues/128) Super Mario World | 1. Oferecer ajuda opcional só depois de N mortes no mesmo ponto, com N medido no playtest (revisa a D-031) | D-031; P-009; #127 |
| | 2. No nível 1, dicas presas ao lugar (um passo antes de onde servem) e um começo em que o jogador vive o propulsor de qualquer jeito | D-031; D-027; #97; mundo 1 |
| | 3. Uma DEMO mais modesta, no ritmo de um jogador comum | D-031; #104; #92 |
| | 4. Refazer o nível 1 por último, depois das fases 4 a 10, e testar com quem nunca jogou, em silêncio | Mundo 1; documento 07; #44 |
| [#99](https://github.com/TARNAGS/resgate-espacial/issues/99) Casuais (Candy Crush, Plants vs. Zombies, Subway Surfers) | 1. Molde do mundo de 10 fases: novidades nas primeiras, respiro com outra regra na 5, fase especial na 10, e cada mundo mudando uma regra do cenário | D-020; documento 08; P-012 |
| | 2. Estrelas: a primeira é concluir; a segunda e a terceira, um tempo de mestre | P-006 ([#53](https://github.com/TARNAGS/resgate-espacial/issues/53)); D-024 |
| | 3. Medir por fase o tempo até passar e o tempo até abandonar, e consertar as fases menos divertidas a cada rodada | P-008 ([#56](https://github.com/TARNAGS/resgate-espacial/issues/56)); [#91](https://github.com/TARNAGS/resgate-espacial/issues/91) |
| | 4. Dica só depois do erro, com até 8 palavras (reforça a [#128](https://github.com/TARNAGS/resgate-espacial/issues/128)) | D-031 |
| Crazy Gravity (sem cartão) | Ritmo em serrote em cada mundo, uma ideia por fase, forças em vez de inimigos, ensinar pela estrutura | Documento 10, lições 1 a 6; documento 08 |

**Se for decidir só três agora** (recomendação do Claude):

1. **Testar o controle sem explicar no próximo playtest** (#108, item 2): custa pouco e ataca o maior risco do produto.
2. **Tripulantes que andam até a nave** (#106, item 1): é pequeno, deixa claro o objetivo da fase e pode virar o momento marcante do jogo (seção 4.12).
3. **Registrar o ranking como tempo puro** (#107, item 1, e #108, item 4): fecha uma parte da P-006 com dois exemplos opostos.

**Da #128, a primeira:** testar no próximo playtest uma ajuda opcional depois de N mortes no mesmo ponto, porque toca a decisão de ensino (D-031) e o jogador travado no nível 1.

**Construído em 09/10/2026 ([D-038](../05-registro-de-decisoes.md)):** depois do retorno da rodada 2, o Fernando pediu as melhorias do nível 1. Entraram as recomendações 1 a 3 da #128 (ajuda depois do erro, com a lição a partir da segunda batida igual e o WATCH HOW a partir do segundo fim de jogo; dicas presas ao lugar e à hora; DEMO modesta) e a 4 da #99 (dica só depois do erro, com até 8 palavras). A 4 da #128 (refazer o desenho do nível 1 por último) continua de pé.

**Da #127, a primeira:** o modelo de checkpoints da fase grande (item 1), porque o protótipo de fase grande é o próximo teste definido na revisão do Lean Canvas, e ele mantém o ranking por tempo puro.

**Da #99, a primeira:** o molde do mundo de 10 fases (item 1), porque o design dos mundos (documento 08) é a próxima construção de conteúdo, e o molde já traz o respiro e a fase especial testados num jogo de 50 fases.

## 8. Lacunas e grau de confiança

| Estudo | O que é sólido | O que é aproximado ou faltou |
|---|---|---|
| Crazy Gravity | As 18 fases, lidas dos arquivos do jogo; o manual original | Pouca crítica da época além da nota da PC Player (80%) |
| Gravitron | As regras do Gravitron 2, lidas no código que o autor publicou em 2012 | Só 8 das mais de 40 fases da campanha principal (as outras vêm só no jogo pago); no GraviTron, o código se perdeu, e a ordem das fases e alguns objetos foram deduzidos |
| Jetpack Joyride | As falas do criador (vídeo de 2023 e slides da GDC 2012) | A transcrição da palestra da GDC não carregou; os números da wiki são da versão atual, que mudou muito desde 2011 |
| Super Mario World | A equipe contando como fez (sete entrevistas Iwata Asks lidas inteiras); os 31 textos do jogo pela wiki | A transcrição do vídeo da Eurogamer não carregou; quase tudo o que os criadores dizem sobre ensinar fala do Super Mario Bros. e dos jogos seguintes, não do Super Mario World; os quatro tempos aplicados ao Super Mario World são leitura nossa |
| Temple Run | As falas dos criadores (GDC 2014, Vice 2021, TechCrunch 2012) | A transcrição da entrevista da Shacknews falhou; GameSpot, Wired, Polygon e VentureBeat estavam bloqueadas ou fora do ar; o dado de público majoritariamente feminino vem só do título de uma matéria da The Verge (2014) |
| Geometry Dash | As 22 fases oficiais e o World, pela wiki; as falas do criador (Cult of Mac, Game Developer, 231 respostas nas AMAs) | O relógio das fases de plataforma correr nas mortes é inferido; o momento dos anúncios do Lite vem de resenhas que não batem; o lucro vem da imprensa sueca; a idade do público, de sinais indiretos; acusações recentes sobre a comunidade, nas avaliações do Steam, não apareceram na imprensa |
| Casuais (comparativo) | As 110 fases do Candy Crush pela wiki; o molde dos mundos do Plants vs. Zombies pela wiki; a palestra da King na GDC 2024 | A dificuldade do Candy Crush é a nota dos fãs; as técnicas do Plants vs. Zombies vêm de notas sobre a palestra; nenhuma duração foi medida; as entrevistas da SYBO são relatos |

Em todos: nenhum programa de jogo foi executado, os arquivos de jogo foram baixados só com a permissão do Fernando (no Geometry Dash, nenhum), e as imagens são redesenhos com crédito, não capturas de tela.

## 9. O que falta estudar

Os cinco casuais do ICP estão estudados: Jetpack Joyride, Temple Run e, no comparativo de 09/10/2026, Candy Crush Saga, Plants vs. Zombies e Subway Surfers ([#99](https://github.com/TARNAGS/resgate-espacial/issues/99)).

**Para aprofundar, se o Fernando quiser:** o estudo completo do Plants vs. Zombies (as 50 fases, mundo a mundo), que é o que mais ensina para o design dos nossos mundos.

## 10. Como os estudos foram feitos

1. **Pergunta:** cada estudo começa pela pergunta que responde e pelo cartão ou pendência a que se liga.
2. **Fontes primárias primeiro:** arquivos de fase e código publicado (Crazy Gravity e Gravitron), falas e slides dos criadores (Jetpack Joyride e Temple Run), manuais, o arquivo da internet (Wayback Machine), avaliações do Steam, wikis dos jogadores e lojas.
3. **Mapear e medir:** fases redesenhadas a partir dos dados, números somados por fase, curvas de dificuldade e diagramas de conceito.
4. **Propor com ligação:** cada ideia vira Proposta ligada a uma decisão (D-xxx), pendência (P-xxx) ou cartão, com as validações e a "diferença importante" (o que não vale para nós).
5. **Entregar:** documento, página de leitura, comentário no cartão, diário, documento 10 e commit.
6. **Regras:** inspirar, nunca copiar (D-005, D-033); pedir permissão antes de baixar arquivos; nunca executar programas de jogos; os originais ficam fora do Git.

## 11. Linha do tempo

| Data | O que aconteceu |
|---|---|
| 05/10/2026 | Busca profunda do jogo original (#52): o Fernando reconhece o Crazy Gravity e percebe que a memória misturou dois jogos. Decide usar os achados como benchmark de level design (D-032) |
| 06/10/2026 | As 18 fases do Crazy Gravity mapeadas; a página de leitura é guardada para inspiração, fixada na barra lateral |
| 06/10/2026 | O método vira a skill `discovery-de-jogos`, e entra a regra de consultar os estudos antes de construir (D-033) |
| 06/10/2026 | Estudo do GraviTron e do Gravitron 2 (#106) |
| 06/10/2026 | Estudo do Jetpack Joyride (#107), depois da observação do Fernando sobre as duas famílias de jogos |
| 06/10/2026 | Estudo do Temple Run (#108), com a comparação lado a lado com o Jetpack Joyride |
| 06/10/2026 | Este guia, a pedido do Fernando: "documente tudo, todos os achados e artifacts criados, para que eu consiga ler depois e ter insights" |
| 07/10/2026 | Na revisão do Lean Canvas, o Geometry Dash entra na lista (#127) |
| 08/10/2026 | Estudo do Geometry Dash (#127): a curva das 22 fases, o mundo de 10 fases, checkpoints e ranking, o modelo grátis + pago; insight 4.13 neste guia |
| 08/10/2026 | Estudo do Super Mario World (#128), a pedido do Fernando: como o jogo ensina sem tutorial; insight 4.14 neste guia |
| 09/10/2026 | Comparativo dos três casuais que faltavam ([#99](https://github.com/TARNAGS/resgate-espacial/issues/99)): Candy Crush Saga, Plants vs. Zombies e Subway Surfers; insights 4.15 e 4.16 neste guia |

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 1.0 | 06/10/2026 | Primeira versão: os quatro estudos, a skill, 12 insights, divergências, validações, decisões pendentes, lacunas e o que falta estudar |
| 1.3 | 09/10/2026 | O comparativo dos casuais entra ([#99](https://github.com/TARNAGS/resgate-espacial/issues/99)): tabela de estudos, reforços nos insights 4.4, 4.7 e 4.14, os insights 4.15 (diversão e dificuldade medidas separadas) e 4.16 (o molde do mundo de 10 fases), as recomendações, a lacuna e o que falta estudar |
| 1.2 | 08/10/2026 | O Super Mario World entra como sexto estudo (referência de método): tabelas, evidências em seis insights, o insight 4.14 (ajuda só depois do erro), divergências, validações, as recomendações da #128 e lacunas |
| 1.1 | 08/10/2026 | O Geometry Dash entra como quinto estudo: tabelas, evidências em oito insights, o insight 4.13 (checkpoint e ranking), três divergências, validações, as recomendações da #127, lacunas e a ordem do que falta estudar |
