# Registro de Decisões — Resgate Espacial

| Campo | Valor |
|---|---|
| Documento | 05 — Registro de decisões |
| Última atualização | 07/10/2026 |
| Responsável | Fernando Nunes (Product Manager) |

Cada decisão relevante de produto fica registrada aqui, com o contexto e o motivo. Assim ela não é rediscutida sem necessidade e pode ser revista quando o contexto mudar.

## Resumo

| ID | Decisão | Data | Status |
|---|---|---|---|
| D-001 | Sem login e sem contas | 28/09/2026 | Aceita |
| D-002 | Distribuição como PWA, fora das lojas | 28/09/2026 | Substituída pela D-019 |
| D-003 | Gratuito, sem anúncios e sem compras | 28/09/2026 | Revista pela D-019: cobrar ou não está em aberto (P-014); sem anúncios continua |
| D-004 | Apenas um jogador | 28/09/2026 | Aceita |
| D-005 | Identidade própria, inspirada no gênero | 28/09/2026 | Aceita |
| D-006 | Controle por toque: direcional virtual | 28/09/2026 | Aceita |
| D-007 | Jogo em inglês | 28/09/2026 | Aceita |
| D-008 | iPhone primeiro | 28/09/2026 | Aceita |
| D-009 | MVP com 3 fases | 28/09/2026 | Aceita |
| D-010 | Sem data-alvo: planejamento por marcos | 28/09/2026 | Aceita |
| D-011 | Tecnologia: JavaScript puro com Canvas | 01/10/2026 | Aceita |
| D-012 | Repositório e quadro públicos, sem expor o e-mail pessoal | 01/10/2026 | Visibilidade substituída pela D-017; o e-mail noreply continua |
| D-013 | Hospedagem: GitHub Pages | 01/10/2026 | Aceita, só nas janelas de teste (D-017) |
| D-014 | Fases geradas aleatoriamente (procedurais) | 01/10/2026 | Revista pela D-021: só a fase BONUS continua sorteada |
| D-015 | Menu com Jogar, Configurações e mapa de progresso | 01/10/2026 | Aceita |
| D-016 | Quadro com duas trilhas: descoberta e entrega | 01/10/2026 | Aceita |
| D-017 | Repositório e quadro privados; o jogo só fica no ar nas janelas de teste | 01/10/2026 | Aceita |
| D-018 | Regra do melhor caminho: toda fase com posto pode ser concluída sem abastecer | 02/10/2026 | Revista pela D-023: abastecer passa a ser obrigatório uma vez |
| D-019 | O jogo será publicado na App Store e no Google Play | 02/10/2026 | Aceita |
| D-020 | Big picture: mundos com 10 fases, cada um com identidade visual própria | 02/10/2026 | Aceita; o MVP segue com 3 fases (D-009) |
| D-021 | Fases com cenário fixo, iguais para todos; só a fase BONUS é sorteada | 02/10/2026 | Aceita; construída ([#84](https://github.com/TARNAGS/resgate-espacial/issues/84) e [#86](https://github.com/TARNAGS/resgate-espacial/issues/86)) |
| D-022 | Controle principal: dois polegares (novo A); o de um polegar vira a opção B | 02/10/2026 | Aceita; construída ([#82](https://github.com/TARNAGS/resgate-espacial/issues/82)) |
| D-024 | Ranking de tempos por fase, com nickname como ID do jogador | 02/10/2026 | Aceita; construída e online ([#87](https://github.com/TARNAGS/resgate-espacial/issues/87)) |
| D-025 | Telemetria das partidas no playtest, no mesmo banco do ranking, com o nickname | 02/10/2026 | Aceita; construída e online ([#88](https://github.com/TARNAGS/resgate-espacial/issues/88)) |
| D-023 | Nas fases com posto, abastecer pelo menos uma vez é obrigatório | 02/10/2026 | Construída ([#83](https://github.com/TARNAGS/resgate-espacial/issues/83)); revista pela D-026: nenhuma regra obriga, o tanque é que faz o posto ser necessário |
| D-026 | O posto é uma salvação, não uma obrigação: tanque calculado por um piloto que voa como os melhores jogadores | 04/10/2026 | Aceita; a construir ([#92](https://github.com/TARNAGS/resgate-espacial/issues/92) e [#93](https://github.com/TARNAGS/resgate-espacial/issues/93)) |
| D-027 | As regras de pouso ficam como estão; o que trava é entender o propulsor | 04/10/2026 | Aceita; o ensino do propulsor vai para a P-009 ([#48](https://github.com/TARNAGS/resgate-espacial/issues/48)) |
| D-028 | ICP: o jogador casual de celular, com o fã da estética retrô dos anos 2000; os grandes casuais viram benchmark | 04/10/2026 | Aceita; benchmark em [#98](https://github.com/TARNAGS/resgate-espacial/issues/98) e [#99](https://github.com/TARNAGS/resgate-espacial/issues/99) |
| D-029 | Salvar no banco online tudo o que der para medir: perfil do jogador ligado ao nick e medição ampliada | 04/10/2026 | Aceita; a construir ([#102](https://github.com/TARNAGS/resgate-espacial/issues/102) e [#91](https://github.com/TARNAGS/resgate-espacial/issues/91)) |
| D-030 | O jogo respeita a chave de silencioso do iPhone e deixa a música do jogador tocar junto | 04/10/2026 | Aceita; aviso em Settings em [#103](https://github.com/TARNAGS/resgate-espacial/issues/103) |
| D-031 | Sem tutorial: uma DEMO jogada pelo próprio jogo antes da primeira partida e attract mode no menu | 04/10/2026 | Aceita; a construir ([#104](https://github.com/TARNAGS/resgate-espacial/issues/104) e [#105](https://github.com/TARNAGS/resgate-espacial/issues/105)) |
| D-032 | Os jogos de nave com gravidade, a começar pelo Crazy Gravity (o jogo original), viram benchmark de level design, ao lado dos casuais do ICP | 05/10/2026 | Aceita; [documento 10](10-benchmark-de-level-design.md) e [benchmark do Crazy Gravity](benchmark/crazy-gravity.md) |
| D-033 | Antes de construir, passar pelos estudos de level design e gameplay e validar; inspirar, nunca copiar; o Fernando orienta a criação | 06/10/2026 | Aceita; skill `discovery-de-jogos` |
| D-034 | Nave nova é só aparência (casco e atributos da clássica, sem mexer no ranking), a não ser que se diga expressamente que ela muda o jogo | 07/10/2026 | Aceita; épico E-26 ([#110](https://github.com/TARNAGS/resgate-espacial/issues/110)) |
| D-035 | Evolução da nave que muda atributos muda o jogo e mexe no ranking; evolução só visual não mexe | 07/10/2026 | Aceita; como os tempos aparecem no ranking é a P-024 |
| D-036 | Anticheat só antes do lançamento: o degrau 1 não entra nos playtests | 07/10/2026 | Aceita; o resto da P-023 fica para antes do M4 |
| D-037 | Zoom da câmera que se adapta à tela (1,15 nas telas compridas, até 1 nas mais quadradas); o jogador pode aproximar nas configurações | 07/10/2026 | Aceita; [#95](https://github.com/TARNAGS/resgate-espacial/issues/95) |

## D-001 — Sem login e sem contas

**Contexto.** A ideia inicial previa login com conta Google "para dar segurança ao acessar o app".

**Análise.** Segurança serve para proteger algum ativo: dados pessoais, dinheiro, conteúdo privado ou partidas contra outras pessoas. Este jogo não tem nenhum deles. Um login traria custos sem benefício para o jogador:

- servidor e serviço de autenticação para manter;
- um passo a mais antes da primeira partida, contra o princípio "do link ao jogo em segundos";
- tratamento de dado pessoal (o e-mail), com as obrigações da LGPD.

**Decisão.** O jogo não tem login. O progresso fica salvo no próprio aparelho.

**Consequências.** O progresso não passa de um aparelho para outro e se perde se o jogador limpar os dados do navegador.

**Revisitar se** entrarem no escopo ranking online ou sincronização entre aparelhos.

## D-002 — Distribuição como PWA, fora das lojas

**Contexto.** O objetivo é jogar de graça no navegador e no celular (iOS e Android). Estar nas lojas não é necessário.

**Opções consideradas.**

| Opção | A favor | Contra |
|---|---|---|
| Apps nas lojas (App Store e Google Play) | Presença nas lojas | Taxas de desenvolvedor (valores de referência: Apple, US$ 99 por ano; Google, US$ 25 uma única vez), revisão de cada versão, versões separadas por plataforma |
| **PWA (site instalável)** | Um único código para todas as plataformas; grátis; instala pela tela de início | No iPhone, a instalação é manual; alguns recursos do aparelho são limitados |
| Só site | O mais simples | Não vira app no celular |

**Decisão.** PWA.

**Consequências.**

- As regras de revisão das lojas deixam de se aplicar. Exemplos: a exigência da Apple de oferecer uma opção de login com foco em privacidade (como "Entrar com a Apple") quando o app usa login social, e a de permitir excluir a conta de dentro do app.
- Como o jogo "vira app", o jogador espera que ele funcione sem internet depois de instalado. Isso vira requisito no PRD.
- No iPhone, o próprio jogo precisa ensinar a instalar (Compartilhar → Adicionar à Tela de Início).

**Revisitar se** houver interesse em estar nas lojas. Um PWA pode ser empacotado como app depois.

**Substituída pela [D-019](#d-019--o-jogo-será-publicado-na-app-store-e-no-google-play) em 02/10/2026.**

## D-003 — Gratuito, sem anúncios e sem compras

**Contexto.** Projeto de portfólio e aprendizado.

**Decisão.** O jogo é gratuito, sem anúncios e sem compras dentro do jogo.

**Consequências.** O custo de operação precisa ser zero: hospedagem gratuita e nenhum serviço pago.

**Revisitar se** o projeto deixar de ser apenas portfólio.

**Revista pela [D-019](#d-019--o-jogo-será-publicado-na-app-store-e-no-google-play) em 02/10/2026:** o projeto deixou de ser só portfólio. Cobrar pelo jogo, vender itens ou os dois está em aberto (P-014 e P-017). "Sem anúncios" continua valendo.

## D-004 — Apenas um jogador

**Contexto.** O jogo original era para um jogador, e a graça está no desafio individual de pilotagem.

**Decisão.** Apenas um jogador, contra o cenário.

**Consequências.** Não há servidor de jogo: tudo roda no aparelho, inclusive sem internet.

**Revisitar se** surgir interesse em algo competitivo, como ranking de tempo, que dependeria de servidor (ver D-001).

## D-005 — Identidade própria, inspirada no gênero

**Contexto.** O jogo original não foi identificado. De todo modo, regras e mecânicas de jogo não são protegidas por direito autoral no Brasil (Lei 9.610/1998, art. 8º, II); já nome (como marca), arte, personagens e músicas podem ser.

**Decisão.** Nome, arte e sons próprios, inspirados no gênero, sem copiar nenhum jogo específico.

**Consequências.** "Resgate Espacial" é um codinome; o nome final é a decisão pendente P-003.

**Atualização (05/10/2026).** O jogo original foi identificado: **Crazy Gravity** (1996), de Axel Meierhöfer (XLM Software). A comparação no [documento 10, seção 2.3](10-benchmark-de-level-design.md#23-comparação-com-o-resgate-espacial-item-3-do-52) mostra que o parecido é mecânica e regra; nome, arte e sons continuam próprios, e esta decisão continua valendo.

## D-006 — Controle por toque: direcional virtual

**Contexto.** O controle no celular é o maior risco do produto (Visão, seção 10). No teclado, as setas giram a nave e o propulsor é acionado à parte; no celular não existem teclas. Esta decisão resolve a pendência P-002.

**Opções consideradas.**

| Opção | Como funciona | A favor | Contra |
|---|---|---|---|
| A. Botões na tela | Dois botões de girar e um de propulsor | Mesma lógica do teclado | Sem resposta tátil, o dedo escorrega do botão |
| B. Direcional + botão de propulsor | Um polegar aponta a direção, o outro aciona o propulsor | Precisão | Exige os dois polegares |
| C. Inclinar o celular | Inclinar gira a nave; tocar aciona o propulsor | Tela livre | Impreciso; no iPhone, exige autorizar o sensor de movimento |
| **D. Direcional único** | Tocar aciona o propulsor; arrastar indica a direção | Um polegar só; padrão conhecido de jogos de celular | Não dá para girar sem acelerar |

**Decisão.** Opção D, proposta pelo Fernando: um direcional virtual (anel com uma bola no centro). Tocar aciona o propulsor, arrastar indica para onde a ponta da nave deve apontar e soltar desliga o propulsor. No teclado, nada muda.

**Consequências.**

- No toque, "girar" vira "apontar": a nave vira para a direção do dedo, na velocidade calibrada no protótipo.
- Não dá para girar sem acelerar. Se a nave virar rápido para a direção do dedo, isso quase não faz falta; o protótipo vai mostrar.
- O toque pode ficar mais fácil ou mais difícil que o teclado. Como não há ranking online (D-001), jogadores de aparelhos diferentes não competem entre si, e isso não é problema.
- O outro polegar fica livre, por exemplo para a pausa.

**Revisitar se** no protótipo fizer falta girar sem acelerar. A variante a testar é uma pequena zona no centro do direcional que só aponta, sem acionar o propulsor.

## D-007 — Jogo em inglês

**Contexto.** O jogo é peça de portfólio. Em inglês, ele pode ser jogado e avaliado também por quem não fala português.

**Decisão.** Todos os textos do jogo (menus, dicas, avisos e instruções de instalação) ficam em inglês. A documentação do projeto continua em português.

**Consequências.**

- O nome final do jogo (P-003) precisa funcionar em inglês; "Resgate Espacial" segue só como codinome.
- Os documentos descrevem os textos em português; a redação final em inglês é feita na construção.

**Revisitar se** surgir interesse em outros idiomas. Manter os textos separados do código deixa a tradução simples depois (ver PRD).

## D-008 — iPhone primeiro

**Contexto.** O iPhone é o aparelho disponível para testes, e o Fernando pediu para priorizar o iOS. Como PWA, o mesmo código roda no Android, mas cada plataforma tem particularidades que só aparecem no teste em aparelho real.

**Decisão.** O MVP é testado e ajustado no iPhone (no Safari e instalado na tela de início) e no navegador do computador. Testar e ajustar para Android fica para uma etapa seguinte.

**Consequências.**

- O objetivo da Visão "instalação testada em um iPhone e em um Android" passa a ter duas etapas: iPhone no MVP, Android depois.
- As limitações do iPhone para PWAs viram requisitos do MVP (PRD, seção 6).
- O jogo provavelmente já vai funcionar no Android, mas sem garantia até ser testado.

**Revisitar se** surgir acesso fácil a um Android para testes.

## D-009 — MVP com 3 fases

**Contexto.** A curva de dificuldade tem 5 fases (documento 02, seção 10). Esta decisão resolve a pendência P-007.

**Opções consideradas.**

| Opção | A favor | Contra |
|---|---|---|
| **3 fases** | Já cobre o ciclo inteiro: voar, pousar, abastecer, resgatar e voltar; lança antes | Sem túneis nem obstáculo móvel no lançamento |
| 5 fases | Curva completa | Lançamento mais demorado; o obstáculo móvel tende a ser a parte mais trabalhosa das fases |

**Decisão.** O MVP tem as fases 1 a 3. As fases 4 e 5 entram na V1.

**Consequências.**

- O avaliador de portfólio, que joga poucos minutos, dificilmente passaria da fase 2; as fases 4 e 5 não mudariam a primeira impressão.
- Obstáculos móveis ficam fora do MVP.

**Revisitar se** os dados do MVP mostrarem jogadores concluindo as 3 fases e voltando para jogar mais.

## D-010 — Sem data-alvo: planejamento por marcos

**Contexto.** Projeto paralelo, feito em horas vagas, sem compromisso externo de data.

**Decisão.** O roadmap não tem datas. O projeto avança por marcos em sequência, cada um com um critério de saída ([Roadmap](04-roadmap.md)).

**Consequências.** Sem pressão de prazo, o risco é o projeto se arrastar. Para compensar, os marcos são pequenos e cada um termina numa entrega que dá para mostrar.

**Revisitar se** surgir uma data importante, como uma apresentação ou entrevista em que o jogo seria mostrado.

## D-011 — Tecnologia: JavaScript puro com Canvas

**Contexto.** Esta decisão resolve a pendência P-004 ([tarefa #27](https://github.com/TARNAGS/resgate-espacial/issues/27)). O jogo é visualmente simples, no estilo dos jogos 2D de nave dos anos 2000 que vinham em CD de revista de PC, e a física também é simples: gravidade, propulsor, inércia e colisão. O maior risco do produto é a sensação do controle.

**Opções consideradas.**

| Opção | A favor | Contra |
|---|---|---|
| **A. JavaScript puro com Canvas** | Controle total da física; só o código do jogo para baixar; o formato mais seguro para construir com IA, o mesmo do repositório `jogos` | Câmera, colisão, telas, som e direcional precisam ser escritos do zero |
| B. Phaser 4 | Câmera, cenas, som e toque prontos | Cerca de 345 KB a mais; a física simples não gira a colisão com a nave; a versão 4 é recente |
| C. Godot 4 (exportação web) | Motor completo, com editor de fases | Cerca de 5 a 9 MB para baixar; boa parte do trabalho fica no editor, fora do alcance do Claude Code |

A análise completa, com as fontes, está na [tarefa #27](https://github.com/TARNAGS/resgate-espacial/issues/27).

**Decisão.** A: JavaScript puro com Canvas, sem framework.

**Por quê.** O Fernando gosta da ideia de componentes prontos, mas construir do zero faz parte do aprendizado. O jogo não é complexo, e a estética de jogo de nave de CD de revista dos anos 2000 dispensa os recursos gráficos de um framework.

**Consequências.**

- Câmera, colisão, telas, som e direcional virtual serão escritos por nós; isso entra nas histórias do M1 e do M2.
- O download fica pequeno, a favor do RNF-01.
- A física fica explícita, com os parâmetros de ajuste num lugar só (RNF-12).
- O jogo pode ser publicado como arquivos estáticos, sem etapa de build.

**Revisitar se** o protótipo do M1 mostrar que a física própria está dando trabalho demais. Trocar para o Phaser no fim do M1 ainda é barato, porque só existirá o protótipo.

## D-012 — Repositório e quadro públicos, sem expor o e-mail pessoal

**Contexto.** Esta decisão resolve a pendência P-001 ([tarefa #28](https://github.com/TARNAGS/resgate-espacial/issues/28)). O projeto é peça de portfólio, e o processo (documentos, decisões e quadro) é a parte mais forte dele. Cada commit do Git guarda o e-mail de quem o fez; num repositório público, esse e-mail fica visível no histórico.

**Opções consideradas.**

| Opção | A favor | Contra |
|---|---|---|
| **Público agora** | Mostra o processo desde o começo; libera o GitHub Pages no plano gratuito | Tudo o que está no histórico fica visível |
| Privado até o MVP | Nada fica exposto antes do lançamento | Hospedagem num serviço externo, com conta nova, ou GitHub Pro, que é pago (contraria a D-003) |

**Decisão.** Repositório e quadro públicos desde 01/10/2026. Antes de abrir, o histórico foi reescrito para trocar o e-mail pessoal pelo e-mail noreply do GitHub em todos os commits, e o repositório passou a usar o noreply nos commits novos.

**Consequências.**

- Qualquer pessoa vê os documentos, as decisões, as issues e o quadro.
- A reescrita mudou os identificadores dos commits; quem já tinha uma cópia do repositório precisa baixá-lo de novo.
- Em cada máquina, o repositório precisa estar configurado com o e-mail noreply antes do primeiro commit.

**Revisitar se** surgir algo que não deva ser público. Nesse caso, sai o conteúdo, não o repositório inteiro.

## D-013 — Hospedagem: GitHub Pages

**Contexto.** Esta decisão resolve a pendência P-005 ([tarefa #29](https://github.com/TARNAGS/resgate-espacial/issues/29)). Com o repositório público (D-012), o GitHub Pages fica disponível no plano gratuito, e o jogo é feito só de arquivos estáticos (D-011).

**Opções consideradas.** GitHub Pages, que é gratuito, fica na mesma plataforma e já serve por HTTPS; ou serviços externos como Cloudflare Pages e Netlify, que exigiriam conta nova e mais uma ferramenta.

**Decisão.** GitHub Pages, publicando a cada envio para a branch main ([tarefa #30](https://github.com/TARNAGS/resgate-espacial/issues/30)).

**Consequências.**

- Custo zero e nenhuma conta nova (D-003).
- HTTPS incluso, que o jogo precisa para funcionar sem internet (RNF-03 e RNF-08).
- Até haver nome final (P-003), o endereço será `tarnags.github.io/resgate-espacial`. Como o jogo roda nesse subcaminho, o manifesto e o service worker precisam usar caminhos relativos.

**Revisitar se** o jogo precisar de algo que o GitHub Pages não ofereça.

## D-014 — Fases geradas aleatoriamente (procedurais)

**Contexto.** Regra definida pelo Fernando em 01/10/2026: as fases são geradas aleatoriamente, para que o replay seja infinito.

**Decisão.** O cenário de cada fase é gerado por um algoritmo a cada partida. Cada nível define as regras do gerador (comprimento, largura mínima do corredor, quantidade de pedras, posto de abastecimento e tamanho do tanque), e o cenário em si muda sempre. O MVP continua com 3 níveis (D-009).

**Consequências.**

- O "desenho de fases" vira "regras do gerador": em vez de desenhar cada fase, define-se o que cada nível pode gerar.
- Todo cenário gerado precisa ter solução: corredor mínimo, passagem ao lado de toda pedra e combustível suficiente. O protótipo 01 já confere isso em centenas de cenários.
- Cada cenário nasce de uma semente, e a mesma semente gera o mesmo cenário. Isso permite repetir uma partida.
- O recorde de um nível passa a comparar cenários diferentes, o que afeta a pontuação (P-006).

**Revisitar se** os testes mostrarem cenários repetitivos ou injustos. Nesse caso, a saída é misturar cenários gerados com trechos desenhados à mão.

## D-015 — Menu com Jogar, Configurações e mapa de progresso

**Contexto.** Regra definida pelo Fernando em 01/10/2026: antes de jogar, um menu com Jogar e Configurações, em que o jogador vê um mapa com a evolução dos níveis que já jogou.

**Decisão.** A tela de abertura é um menu com Jogar, Configurações e um mapa de progresso. O mapa mostra um planeta por nível, com o estado (concluído, disponível ou bloqueado), o melhor tempo e quantos resgates o jogador já fez ali. Tocar num nível disponível o escolhe para jogar.

**Consequências.**

- O mapa substitui a seleção de fases (PRD, RF-05).
- O mapa cresce junto com o número de níveis. No MVP, mostra 3 e sinaliza que virão mais.
- As configurações do MVP são som e apagar o progresso.

## D-016 — Quadro com duas trilhas: descoberta e entrega

**Contexto.** Pedido do Fernando em 01/10/2026. O quadro só tinha colunas de entrega (Backlog a Concluído), mas muita coisa precisa ser entendida antes de virar trabalho: regras e sensação do jogo, formato, estrutura das fases, bugs a reproduzir. A squad é uma pessoa e uma máquina, e parte dessas perguntas o Fernando responde sozinho, fora das sessões. Ele precisava ver no quadro o que tem para pesquisar e trazer pronto.

**Opções consideradas.**

| Opção | A favor | Contra |
|---|---|---|
| **Duas trilhas no mesmo quadro** | O fluxo inteiro num lugar só, da ideia ao Concluído; visualizações separam as trilhas quando preciso | O quadro completo fica com 9 colunas |
| Um quadro só para descoberta | Separação total | Duas ferramentas para acompanhar; a passagem da descoberta para a entrega fica invisível |
| Só uma etiqueta "pesquisa" no quadro atual | Nenhuma mudança de colunas | Não mostra em que etapa cada pesquisa está |

**Decisão.** Duas trilhas no mesmo GitHub Project, renomeado para "Resgate Espacial — Produto":

- **Descoberta:** Caixa de entrada → A investigar → Investigando (no máximo 2 cartões) → Para conversar.
- **Entrega:** Backlog → Pronto → Em andamento → Em revisão → Concluído, como antes.

Junto com as trilhas, entraram:

- **Campo "Quem"**, com Fernando ou Claude, para separar o que cada um pesquisa ou constrói.
- **Visualizações** Descoberta, Entrega e Minha fila. Minha fila mostra o que está com o Fernando.
- **Etiqueta `descoberta`** e os modelos de issue Descoberta e Bug.
- **Critério de "Para conversar":** o cartão só entra nessa coluna com um comentário que traga a pergunta respondida, as evidências, a recomendação, quando for uma decisão, e o que ficou em aberto.

**Consequências.**

- Todo item novo entra na Caixa de entrada, e não mais no Backlog. A opção que a automação "Item added to project" usa passou a se chamar Caixa de entrada.
- Os modelos de issue adicionam a issue ao quadro sozinhos (chave `projects`).
- A pesquisa é fechada quando vira decisão, histórias ou descarte. O bug segue no mesmo cartão, da reprodução até a correção.
- Parte do M1 é descoberta, e não entrega: o teste com pessoas (#43) e a variante do direcional (#44) passaram a ter a etiqueta `descoberta`, assim como P-009 (#48) e P-010 (#49).
- No começo de cada sessão, o Claude olha primeiro a coluna "Para conversar".

**Revisitar se** a Caixa de entrada virar um depósito sem triagem, ou se cartões ficarem parados em "Investigando" por mais de uma semana.

## D-017 — Repositório e quadro privados; o jogo só fica no ar nas janelas de teste

**Contexto.** Pedido do Fernando em 01/10/2026, depois do primeiro teste no iPhone: ele não quer que vejam o que está sendo construído. Os cartões de descoberta já incluíam ideias de preço e de como receber dinheiro (P-014 e P-015). Até ali, ninguém tinha visitado nem copiado o repositório: 0 forks, 0 estrelas, 0 visitas e 0 clones nas estatísticas do GitHub.

**Opções consideradas.**

| Opção | A favor | Contra |
|---|---|---|
| Manter público (D-012) | Jogo sempre no ar; processo visível para o portfólio | Ideias, decisões e planos de negócio expostos |
| **Privado, aberto só nas janelas de teste** | Processo fechado quase o tempo todo; custo zero; mesma hospedagem | Durante a janela, tudo fica visível; abrir e fechar é manual |
| Privado, com hospedagem externa (Cloudflare Pages ou Netlify) | Jogo sempre no ar sem abrir o repositório | Conta nova e mais uma ferramenta |
| Privado, com GitHub Pro | Jogo sempre no ar pelo GitHub Pages | Plano pago (contraria a D-003) |

**Decisão.** Repositório e quadro privados desde 01/10/2026. Para um teste com o jogo publicado, o repositório é aberto e o GitHub Pages é reativado; no fim do teste, o repositório volta a ser privado. O quadro fica privado o tempo todo, até o lançamento.

**Consequências.**

- No plano gratuito, o GitHub só publica sites de repositórios públicos. Fechado o repositório, o jogo sai do ar e a configuração do GitHub Pages é apagada ([documentação do GitHub](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility)). Cada janela de teste reativa o Pages.
- Durante a janela, qualquer pessoa pode ver e copiar o repositório inteiro, com documentos e histórico. Uma cópia feita nesse período não pode ser desfeita.
- Quem joga sempre consegue ler o código do jogo, porque o navegador baixa o JavaScript. Fechar o repositório esconde o processo, não o código do jogo publicado.
- Fora das janelas, o protótipo roda na rede de casa: o servidor do protótipo aceita aparelhos no mesmo Wi-Fi. Sem HTTPS, não dá para instalar como app.
- Os commits continuam com o e-mail noreply (D-012), porque o repositório volta a abrir em cada janela.
- O estudo de caso (E-20) abre o repositório e o quadro no lançamento, como já previsto.

**Revisitar se** as janelas de teste ficarem frequentes (aí a hospedagem externa compensa) ou quando a P-014 (preço e publicação) for decidida.

## D-018 — Regra do melhor caminho: toda fase com posto pode ser concluída sem abastecer

**Contexto.** Regra de jogo definida pelo Fernando em 02/10/2026: em toda fase que tem posto de abastecimento, quem faz a melhor corrida possível precisa conseguir concluir sem abastecer, e chegar ao fim quase sem combustível, com a sensação de ser um piloto muito bom. Até ali, o tanque era um número fixo por nível (26 segundos de propulsor no nível 3) e ninguém sabia se dava para concluir sem o posto. Medido depois, a melhor corrida do nível 3 gasta em média 31 segundos: quase nenhum cenário era possível sem abastecer.

**Opções consideradas.**

| Opção | A favor | Contra |
|---|---|---|
| Tanque fixo por nível, ajustado à mão | Simples | Cada cenário é sorteado (D-014): um número só não garante a regra em nenhum deles |
| Tanque estimado por fórmula (distância, gravidade) | Rápido | Não prova que o caminho existe; pedras e corredor mudam tudo |
| **Piloto automático joga cada cenário gerado e o tanque sai da melhor corrida dele** | A regra vira prova: a corrida foi jogada com a física e as regras do jogo | O tanque depende de quão bem o piloto voa; um jogador melhor que ele chega com um pouco mais de combustível |

**Decisão.** Ao gerar um cenário, o jogo roda um piloto automático ([`jogo/src/core/autopilot.js`](../jogo/src/core/autopilot.js)) que vai da base até a tripulação e volta, sem abastecer, em várias velocidades de cruzeiro, e fica com a corrida que gastou menos combustível. Ele gira na velocidade do teclado, a mais lenta dos controles, para a corrida valer para todos.

- **Fase com posto:** o tanque é a melhor corrida mais uma folga pequena (`bestRunMargin`: 6% no nível 3 e 4% na PRACTICE). Quem repete a melhor corrida chega com cerca de 4% a 6% do tanque.
- **Fase sem posto:** o tanque do nível ou a melhor corrida mais 25%, o que for maior.
- **Cenário sem caminho provado:** se o piloto não conseguir concluir, o gerador troca a semente até sair um cenário que ele conclua. "Tentar de novo" repete o mesmo cenário.

**Consequências.**

- Toda fase gerada tem um caminho que conclui sem abastecer, provado jogando. Um teste automático grava a melhor corrida e a reproduz numa partida de verdade, com o tanque real.
- O tanque do nível 3 ficou maior (cerca de 32 segundos, contra 26): quem abastece no posto tem mais folga do que antes.
- Gerar um cenário passou a levar de 15 a 150 milissegundos no computador, por causa do piloto.
- Obstáculos móveis, quando existirem (P-011), vão precisar de um piloto que leve o tempo em conta.

**Revisitar se** os testes mostrarem que bons jogadores chegam com muito combustível (o piloto está fraco; diminuir a folga ou melhorar o piloto) ou que ninguém consegue concluir sem abastecer (a folga está curta).

## D-019 — O jogo será publicado na App Store e no Google Play

**Contexto.** Em 02/10/2026, depois dos primeiros testes, o Fernando contou que as pessoas se divertiram jogando e que ele viu oportunidade de negócio, tanto na venda de itens numa loja dentro do jogo quanto na venda do próprio jogo. Nas palavras dele: "meu projeto vai até publicar e botar nos celulares". Até ali, a D-002 mantinha o jogo fora das lojas, e a D-003 o mantinha gratuito e sem compras.

**Opções consideradas.**

| Opção | A favor | Contra |
|---|---|---|
| Continuar só como PWA (D-002) | Custo zero, um código só, sem revisão das lojas | Sem as lojas, não há como vender o jogo nem itens pelos meios que os jogadores de celular usam; no iPhone, a instalação é manual |
| **Publicar na App Store e no Google Play** | O jogo chega aos celulares pelo caminho normal; abre a possibilidade de cobrar | Contas de desenvolvedor pagas, revisão de cada versão e regras das lojas para compras dentro do app |

**Decisão.** O jogo será publicado na App Store e no Google Play. Se ele será pago, gratuito com loja de itens, ou os dois, continua em aberto (P-014 e P-017).

**Consequências.**

- Substitui a D-002. Revê a D-003: cobrar passa a ser possível, e "sem anúncios" continua valendo.
- O MVP não muda: 3 fases (D-009), testado pelo site. A publicação nas lojas vira um marco próprio, depois da V1 (Roadmap, M4 — proposta).
- A premissa de custo zero deixa de valer: as contas de desenvolvedor são pagas (valores de referência da D-002: Apple, US$ 99 por ano; Google, US$ 25 uma única vez; confirmar na [#65](https://github.com/TARNAGS/resgate-espacial/issues/65)).
- Como empacotar o jogo, feito em JavaScript com Canvas (D-011), o risco de a Apple recusar um app feito em web e as regras de compras dentro do app são a pesquisa [#65](https://github.com/TARNAGS/resgate-espacial/issues/65).
- Sem login (D-001), compras e moedas ficam ligadas ao aparelho e à conta da loja. Como restaurar compras e o que acontece ao trocar de celular entram na #65 e na P-016.
- O site continua servindo para testes, nas janelas da D-017.

**Revisitar se** a #65 mostrar que publicar exige mudanças grandes demais na tecnologia (D-011), ou se o custo das contas não se justificar antes de haver jogadores.

## D-020 — Big picture: mundos com 10 fases, cada um com identidade visual própria

**Contexto.** Em 02/10/2026, o Fernando descreveu o jogo de longo prazo: sem enredo ("não é um jogo para ter lore"), com fator de replay alto e grande quantidade de fases, organizadas em vários mundos de 10 fases, cada um com características visuais próprias. Ele também pediu um documento de design para cada mundo. Até ali, os documentos usavam "fase" e "nível" como sinônimos, e "mundo" não existia (P-011).

**Opções consideradas.**

| Opção | A favor | Contra |
|---|---|---|
| Uma sequência única de fases | Simples | Pouca variedade visual; difícil mostrar progresso em dezenas de fases |
| **Mundos com 10 fases, cada um com identidade visual própria** | Variedade e marcos claros de progresso; cada mundo apresenta novidades; combina com fases geradas a partir de regras (D-014), que barateiam ter muitas fases | Cada mundo pede arte, regras do gerador e um documento de design |

**Decisão.** O jogo se organiza em mundos. Cada mundo tem 10 fases e identidade visual própria (paleta, cenário e obstáculos), descrita num documento de design ([documento 08](08-design-de-mundos.md)). As 3 fases do MVP (D-009) são as fases 1 a 3 do Mundo 1. Quantos mundos o jogo terá no lançamento nas lojas fica em aberto.

**Consequências.**

- Responde a parte "mundo e fase" da P-011: mundo é o conjunto de 10 fases com visual próprio; fase (ou nível) é um conjunto de regras do gerador dentro do mundo. O catálogo de obstáculos continua em aberto.
- O E-12 (níveis 4 e 5, M3) passa a ser parte do Mundo 1; as fases 6 a 10 e os mundos seguintes ficam no E-23 (M5 — proposta).
- O mapa de progresso vai precisar agrupar as fases por mundo. O código já tem mundos com tema visual próprio (`jogo/src/content/worlds.js`).
- Desafios fora da sequência, como a PRACTICE, continuam existindo à parte.

**Revisitar se** os testes mostrarem que 10 fases por mundo ficam repetitivas, ou que o custo de arte de cada mundo é alto demais para uma pessoa.

## D-021, D-022 e D-023 — Mudanças depois do teste com amigos

**Contexto.** Em 02/10/2026, depois de amigos testarem o jogo publicado, o Fernando trouxe três mudanças. Os créditos dele estavam no fim, então elas foram registradas como decisões e histórias, para construir depois.

**D-021 — Fases com cenário fixo.** Os jogadores gostaram de comparar tempos entre eles, num ranking de quem foi mais rápido. Com cenário sorteado (D-014), os tempos não são comparáveis. **Decisão:** os níveis da sequência e a PRACTICE passam a ter um cenário fixo, o mesmo para todos. Uma fase nova, **BONUS**, continua sorteada a cada partida, para o replay infinito. Consequências: revê a D-014; resolve a P-010 (tentar de novo repete o cenário); abre caminho para o ranking (P-019). Histórias [#84](https://github.com/TARNAGS/resgate-espacial/issues/84) e [#86](https://github.com/TARNAGS/resgate-espacial/issues/86).

**D-022 — Controle principal de dois polegares.** No teste, o controle de dois polegares (até então "C") foi o preferido. **Decisão:** ele passa a se chamar **A** e é o padrão; o de um polegar (até então "A") vira a opção **B**. Consequências: fecha a escolha da variante do direcional (#44); o jogo ficou mais fácil, e a dificuldade das fases sobe ([#85](https://github.com/TARNAGS/resgate-espacial/issues/85)). História [#82](https://github.com/TARNAGS/resgate-espacial/issues/82).

**D-023 — Abastecer pelo menos uma vez.** "Pelos testes, ficou fácil não precisar abastecer." **Decisão:** em fases com posto, concluir sem abastecer fica impossível, e concluir abastecendo uma vez, na ida ou na volta, fica possível. O tanque continua calculado pelo piloto automático. Consequências: revê a D-018; o elogio PERFECT RUN passa a ser "um só abastecimento e nenhuma vida perdida". História [#83](https://github.com/TARNAGS/resgate-espacial/issues/83).

**Revisitar se** os próximos testes mostrarem que o ranking não importa tanto quanto o replay (D-021), ou que abastecer obrigatório deixou o jogo chato (D-023).

**Atualização (03/10/2026).** A telemetria do primeiro playtest (D-025) mostrou que a D-023 não se sustenta com jogadores reais: no nível 3, 5 das 9 conclusões não abasteceram (3 sem morrer), e o melhor tempo foi sem abastecer. As pessoas voam bem mais econômico que o piloto automático que calcula o tanque. Como garantir a regra, ou se ela muda, é a P-020 ([#89](https://github.com/TARNAGS/resgate-espacial/issues/89)). Detalhes no [documento 09](09-resultados-dos-playtests.md).

## D-024 — Ranking de tempos por fase, com nickname

**Contexto.** Com até 10 playtesters (hoje, uns 6), o Fernando quer um ranking de cada fase, para quem for mais rápido. Os jogadores já gostavam de comparar tempos (D-021).

**Decisão.** Depois do PLAY e antes da abertura, o jogador digita um **nickname**, que é o ID dele no ranking (sem senha). Cada fase (níveis 1 a 3, PRACTICE e BONUS) tem um ranking com o melhor tempo de cada nick; só um tempo melhor substitui o anterior. O ranking fica no menu, no botão RANKING. Para ser compartilhado entre os jogadores, os tempos vão para um banco online simples (**Firebase Realtime Database**, plano gratuito); sem ele, cada aparelho tem o seu ranking.

**Consequências.**

- Revê, para o protótipo, a D-001 (sem login): o nick é uma identificação leve, sem senha e sem dado pessoal.
- Precisa de um serviço externo, criado pelo Fernando; o endereço fica em `jogo/src/config/online.js`.
- Riscos aceitos para um grupo pequeno: qualquer um pode usar o nick de outro e mandar um tempo falso. Para o lançamento, a P-019 continua valendo (rankings do Game Center e do Google Play Games, ou um servidor que valide).
- A chave de cada ranking inclui a semente, as regras do gerador e a física padrão: se a fase mudar, começa um ranking novo.
- Com o painel de ajuste alterado, o tempo não vai para o ranking.

**Revisitar se** o grupo de testes crescer além de amigos, ou no lançamento nas lojas (P-019).

## D-025 — Telemetria das partidas no playtest

**Contexto.** Com o banco do ranking no ar (D-024), o Fernando pediu para guardar informações que ajudem a melhorar o jogo e a experiência: o que acontece em cada partida e em cada fase do protótipo. Até aqui, o retorno vinha só do que os amigos contavam.

**Decisão.** Durante o playtest, o jogo registra as partidas no mesmo Firebase, em `telemetry/<dia>/<id>`:

- **sessão:** tipo de aparelho (iPhone, iPad, Android ou PC), tela, controle, som, tempo de carregamento e se está instalado;
- **cada tentativa de fase:** resultado (concluiu, fim de jogo ou desistiu), mortes, abastecimentos, elogios, tempo, vidas, combustível que sobrou e, de performance, quadros por segundo, engasgos e o pior quadro;
- **cada morte:** motivo e posição, para achar os trechos difíceis demais;
- **abertura** (pulou e em que tela), **ranking aberto** e **saída do app** no meio de uma fase.

Os eventos levam o **nickname**, e a tela do nick avisa que, no playtest, essas informações são salvas online. Um relatório no terminal resume tudo por fase e por aparelho (`node jogo/ferramentas/relatorio-telemetria.mjs`).

**Consequências.**

- É uma exceção de playtest à RNF-06 (nada que identifique a pessoa sai do aparelho): o nick vai junto, com aviso, para um grupo de amigos. Nada além disso identifica o jogador ou o aparelho.
- Responde a P-008 para o playtest (ferramenta: o próprio Firebase, sem cookies e sem Google Analytics). Para o lançamento, a P-008 continua aberta: a medição precisa ser anônima.
- O Firebase não deixa o jogo mais rápido (o jogo roda no aparelho); ele mede a performance para sabermos onde melhorar.
- O banco só aceita eventos novos, planos e curtos; não dá para apagar nem reescrever. Qualquer pessoa com o endereço pode ler a telemetria (como o ranking), e é por isso que ela não guarda nada além do nick.
- Testes no computador (localhost) não entram no ranking real e ficam fora do relatório.

**Revisitar se** o grupo de testes crescer além de amigos, e antes do lançamento nas lojas (P-008, RNF-06).

## D-026 a D-029 — Decisões da primeira análise do playtest

**Contexto.** A telemetria do primeiro playtest (D-025, [documento 09](09-resultados-dos-playtests.md)) levantou duas perguntas para o Fernando: a P-020 (abastecer obrigatório não segurou os jogadores reais, [#89](https://github.com/TARNAGS/resgate-espacial/issues/89)) e a P-021 (o pouso na tripulação parecia a maior dificuldade, e um jogador travou no nível 1, [#90](https://github.com/TARNAGS/resgate-espacial/issues/90)). Em 04/10/2026, com o ranking ao lado, ficou claro que as corridas sem abastecer mais rápidas do nível 3 e da PRACTICE eram do próprio Fernando (nick TARNAG).

**D-026 — O posto é uma salvação, não uma obrigação.** O Fernando explicou por que não precisou abastecer: a física deixa economizar combustível. Você acende o propulsor e deixa a gravidade levar a nave, sem acender de novo. "Isso é uma das partes fodas do jogo e é parte da diversão." O piloto automático voa pairando e gasta muito mais que as pessoas (39,4 s de propulsor no nível 3, contra 22,6 s da melhor corrida), então o tanque calculado por ele ficou grande demais.

| Opção (da P-020) | Resultado |
|---|---|
| **A. Piloto mais econômico e tanques recalculados** | **Escolhida** |
| B. Tanque calibrado só pelos jogadores | Fica como fonte de dados para a folga, não como regra |
| C. Posto como parada obrigatória | Descartada: nenhuma regra deve obrigar a abastecer |
| D. Aceitar abastecer opcional | Descartada: o posto precisa fazer falta |

**Decisão.** Nenhuma regra obriga a pousar no posto. O posto deve ser um alívio: "graças a Deus tem esse posto aqui, senão eu não conseguiria terminar a fase". Para isso:

1. o piloto automático aprende a voar como os melhores jogadores, combinando propulsor e gravidade ([#92](https://github.com/TARNAGS/resgate-espacial/issues/92));
2. o tanque de cada fase com posto fica abaixo da corrida sem abastecer desse piloto, para que nem quem voa perfeito termine sem abastecer, e acima do que é preciso entre um abastecimento e outro, com folga para quem não voa perfeito ([#93](https://github.com/TARNAGS/resgate-espacial/issues/93)).

**Consequências.**

- Revê a D-023: a fase continua pedindo o posto, mas pela física do tanque, não por uma regra. O que o #83 construiu (rotas com posto provadas pelo piloto) continua valendo.
- A D-018 muda de papel: o piloto deixa de ser só uma prova de que a fase tem solução e passa a medir o melhor que dá para fazer.
- Os rankings do nível 3, da PRACTICE e da BONUS recomeçam quando o tanque mudar.
- Com o posto no meio do caminho, quem abastece uma vez ainda faz de 72% a 79% da rota com um tanque. Por isso, a janela entre "sem abastecer não dá" e "abastecendo dá" é estreita. A posição do posto e as duas folgas ficam para o Fernando decidir na [#93](https://github.com/TARNAGS/resgate-espacial/issues/93).
- A telemetria passa a medir o combustível de cada trecho ([#91](https://github.com/TARNAGS/resgate-espacial/issues/91)), para calibrar a folga com dados de jogadores.

**D-027 — As regras de pouso ficam como estão.** O Fernando assistiu ao jogador que travou no nível 1. O problema não era o pouso, e sim entender a dinâmica do jogo: quando soltar e quando apertar o propulsor. O halo, as luzes da plataforma, o tamanho e a tolerância quando a nave pousa meio fora, meio dentro estão adequados. **Decisão:** as opções da P-021 que mexiam no pouso (afastar a plataforma da parede do fim e nível 1 mais tolerante) estão descartadas. Ensinar a dinâmica do propulsor vai para a P-009 ([#48](https://github.com/TARNAGS/resgate-espacial/issues/48)), com as ideias de dica e de oferecer o TRAINING.

**D-028 — Jogador ideal (ICP) e núcleo do jogo.** Resposta do Fernando à P-013 ([#59](https://github.com/TARNAGS/resgate-espacial/issues/59)), depois do teste com 6 pessoas ([#43](https://github.com/TARNAGS/resgate-espacial/issues/43)):

- **ICP:** antes de tudo, o **jogador casual de celular**, que joga na fila ou para passar o tempo e se diverte tentando passar as fases. É o mesmo público de **Jetpack Joyride, Subway Surfers, Candy Crush Saga, Plants vs. Zombies e Temple Run**.
- **Dentro dele, o fã da estética retrô:** adultos de 30 a 40 anos, que jogavam nos anos 2000, e jovens de 15 a 25, que gostam da estética retrô.
- **Núcleo do jogo**, nas palavras do Fernando: "o desafio pessoal de passar a fase, controlar a nave, ficar proficiente na experiência de controlar a nave e tentar melhorar isso para jogar mais e mais rápido e bater o tempo dos outros".

**Consequências:** a Visão (seção 4) passa a ter o casual como persona primária. Os 5 jogos viram benchmark: funcionalidades, fases e funções em [#99](https://github.com/TARNAGS/resgate-espacial/issues/99); modelo de negócio e formas de ganhar dinheiro em [#98](https://github.com/TARNAGS/resgate-espacial/issues/98); como ensinam a jogar na [#48](https://github.com/TARNAGS/resgate-espacial/issues/48). Reforça as fases fixas (D-021) e o ranking (D-024): fases procedurais atrapalhariam a disputa de tempo.

**Revisitar a D-028 se** os dados do próximo playtest ou do benchmark mostrarem um público diferente do esperado.

**D-029 — Salvar no banco tudo o que der para medir.** Resposta do Fernando à P-022 ([#100](https://github.com/TARNAGS/resgate-espacial/issues/100)): "tudo o que servir para coleta de dados, inclusive locais onde o jogador mais morreu, mais bateu, elogios... tudo que der para medir". **Decisão:** o Firebase passa a guardar, além do ranking e da telemetria, o **perfil de cada jogador** ligado ao nick (progresso, configurações, telas vistas e elogios), que só pode crescer, como o ranking ([#102](https://github.com/TARNAGS/resgate-espacial/issues/102)). A telemetria passa a medir também a trajetória de cada tentativa, o uso do propulsor, cada pouso e os elogios com posição, e o relatório desenha mapas de calor por fase ([#91](https://github.com/TARNAGS/resgate-espacial/issues/91)). **Consequências:** quem trocar de aparelho continua de onde parou digitando o mesmo nick; continua só o nick, sem dado pessoal (D-025); quem digitar o nick de outra pessoa vê o progresso dela (risco aceito, como na D-024); o volume no banco precisa ser acompanhado no plano gratuito. **Revisitar** antes do lançamento (P-008, medição anônima, e [#101](https://github.com/TARNAGS/resgate-espacial/issues/101)).

**Revisitar a D-026 e a D-027 se** o próximo playtest mostrar conclusões sem abastecer no nível 3 ou na PRACTICE (o piloto ainda está atrás dos jogadores), queda na taxa de conclusão (a folga ficou curta), ou mortes no pouso que persistam depois de o jogo ensinar o propulsor (D-027).

## D-030 e D-031 — Som no iPhone e como o jogo ensina

**Contexto.** Duas pesquisas do Claude em 04/10/2026, pedidas pelo Fernando: o que o iPhone exige para o som ([#57](https://github.com/TARNAGS/resgate-espacial/issues/57)) e como os jogos de referência do ICP ensinam a jogar ([#48](https://github.com/TARNAGS/resgate-espacial/issues/48), P-009). Os achados, com fontes, estão nos comentários dos dois cartões.

**D-030 — Respeitar o silencioso e misturar com a música do jogador.** No iPhone, o Web Audio usa a sessão `ambient`, que a chave de silencioso e o bloqueio de tela calam, e que deixa o áudio de outros apps tocar junto (MDN; Apple, AVAudioSession). Opções: respeitar e misturar (como hoje), tocar sempre (`playback`, que para a música do jogador) ou deixar o jogador escolher. **Decisão:** respeitar e misturar, com uma linha em Settings avisando que o silencioso também cala o jogo. **Consequências:** combina com o casual que joga na fila ouvindo música (D-028); no app das lojas, é preciso pedir a categoria `ambient`, porque a padrão do iPhone interrompe a música de outros apps ([#98](https://github.com/TARNAGS/resgate-espacial/issues/98)). Achado junto: depois de uma ligação ou da Siri, o áudio fica `interrupted` e o jogo não o retomava ([#103](https://github.com/TARNAGS/resgate-espacial/issues/103)).

**D-031 — Sem tutorial: DEMO e attract mode.** Nenhum dos 5 jogos de referência usa tela de instruções; todos deixam o objetivo óbvio desde a primeira imagem e ensinam no momento certo, com poucas palavras. No playtest, o que faltou foi entender o objetivo e a dinâmica do propulsor (D-027). **Decisão:**

- antes da primeira partida, uma **DEMO** de uns 10 segundos, jogada pelo piloto automático no nível 1, com três rótulos curtos e um polegar fantasma no propulsor; dá para pular, e ela fica num botão DEMO no mapa ([#104](https://github.com/TARNAGS/resgate-espacial/issues/104));
- **attract mode** já no MVP: com o menu parado, a DEMO passa ao fundo, como nos arcades ([#105](https://github.com/TARNAGS/resgate-espacial/issues/105));
- **sem oferta de ajuda** depois de fins de jogo seguidos (nem DEMO, nem TRAINING).

**Consequências:** resolve a P-009; a DEMO depende do piloto econômico ([#92](https://github.com/TARNAGS/resgate-espacial/issues/92)), para voar como um bom jogador; as mensagens do início da fase podem encolher ([#97](https://github.com/TARNAGS/resgate-espacial/issues/97)).

**Revisitar se** o próximo playtest mostrar jogadores que ainda não entendem o objetivo depois da DEMO (D-031), ou reclamações de som (D-030).

## D-032 — Os jogos de nave com gravidade viram benchmark de level design

**Contexto.** Em 05/10/2026, a pesquisa do Claude no cartão [#52](https://github.com/TARNAGS/resgate-espacial/issues/52) trouxe 8 candidatos com vídeos, e o Fernando reconheceu o jogo original: o **Crazy Gravity** (1996). A memória dele tinha misturado esse jogo com o **Gravitron 2** (2008), de onde vem o resgate de pessoas. O Fernando nunca tinha jogado além das 3 fases da versão shareware.

**Opções consideradas.** Registrar só o nome do jogo e fechar o cartão; ou estudar o original e os parecidos a fundo, como referência de level design.

**Decisão.** Nas palavras do Fernando: "Documente todos esses achados porque vamos usá-los para benchmark de level design ao lado dos jogos que citei de mobile". E, sobre o original: "faça uma leitura das fases, objetivos, obstáculos, desafios [...] catalogue as informações de level design com imagens para que eu consiga ver e me inspirar". Os jogos de nave com gravidade, a começar pelo Crazy Gravity, viram benchmark de level design, lado a lado com os casuais do ICP (D-028).

**Consequências.** Novo [documento 10](10-benchmark-de-level-design.md), com o índice do benchmark, e o [benchmark do Crazy Gravity](benchmark/crazy-gravity.md), com as 18 fases mapeadas a partir dos arquivos do jogo. Ele alimenta o catálogo de obstáculos (P-011), os modificadores (P-012) e a curva de cada mundo (documento 08). A pesquisa dos casuais ([#99](https://github.com/TARNAGS/resgate-espacial/issues/99)) passa a responder também às perguntas de level design do documento 10, seção 4. A D-005 continua valendo: inspirar-se nas ideias, sem copiar desenho de fase, arte ou som.

**Revisitar se** o benchmark começar a puxar o jogo para fases longas de labirinto, contra as partidas curtas do ICP (D-028).

## D-033 — Antes de construir, passar pelos estudos; inspirar, nunca copiar

**Contexto.** Em 06/10/2026, depois do benchmark do Crazy Gravity (D-032), o Fernando pediu para transformar o método de discovery numa skill do Claude Code, a `discovery-de-jogos`, para que todo estudo novo de jogo (começando pelos casuais do ICP, [#99](https://github.com/TARNAGS/resgate-espacial/issues/99)) siga o mesmo modelo. Faltava dizer quando os estudos são usados.

**Opções consideradas.**

| Opção | A favor | Contra |
|---|---|---|
| Consultar os estudos só quando o Fernando pedir | Construção mais rápida | Os estudos ficam na gaveta, e as ideias se repetem ou contradizem o que já se aprendeu |
| **Consultar sempre antes de construir** | Cada mecânica, fase ou obstáculo nasce com repertório e com as informações conferidas | Mais um passo antes de construir algo novo |

**Decisão.** Nas palavras do Fernando: "sempre que for construir algo passe pelos nossos estudos de level design e gameplay e valide informações". E: "nunca copie informações, a ideia é se inspirar; vou orientar também a criação daquilo que quero a partir dos discoveries".

- Antes de construir ou mudar uma mecânica, fase, obstáculo ou regra de gameplay, o Claude lê os estudos que tratam do tema (documento 10 e `docs/benchmark/`) e confere a ideia contra eles: o que os jogos de referência confirmam e o que contradizem.
- Diz de onde veio cada inspiração. Se os estudos não cobrem o tema, diz isso e oferece uma consulta rápida, em vez de supor.
- **Inspirar, nunca copiar:** desenho de fase, arte, som, nomes, textos e combinações de elementos dos jogos de referência não são transplantados. A ideia é traduzida para o nosso jogo (D-005).
- **O Fernando orienta a criação:** os estudos dão repertório e opções; o que entra no jogo é o que ele decide.

**Consequências.** A skill `discovery-de-jogos`, que fica no `context-directory` (`setup/claude-global/skills/`) e vale nas duas máquinas, guarda o método do discovery e o passo "Antes de construir". A regra também está no `CLAUDE.md` do projeto. Correção de bug que não muda o design não precisa da consulta.

**Revisitar se** a consulta virar burocracia em mudanças pequenas, ou se os estudos começarem a puxar o jogo para perto demais do original.

## D-034 — Nave nova é só aparência, a não ser que se diga que muda o jogo

**Contexto.** Em 07/10/2026, o Fernando pediu o épico E-26 · Abstração ([#110](https://github.com/TARNAGS/resgate-espacial/issues/110)). O objetivo é que o jogo chegue a 10 mundos, 100 fases, skins e formatos de nave diferentes sem quebrar as regras básicas. Ficou a pergunta: uma nave com outro formato muda o que bate (o casco), os atributos e o ranking, ou só o visual? A resposta muda o custo de cada nave nova. Uma nave que muda o jogo precisa provar todas as fases com o piloto automático (D-018 e D-023), e os tempos dela não podem se misturar com os da nave clássica.

**Opções consideradas.**

| Opção | A favor | Contra |
|---|---|---|
| Toda nave muda o jogo (casco e atributos próprios) | Mais variedade de jogo | Cada nave prova todas as fases e separa o ranking; risco de vantagem comprada na loja (P-017) |
| **Nave é só aparência por padrão; a que muda o jogo é declarada** | Naves e skins novas sem risco para as regras nem para o ranking, com a porta aberta para naves de jogo | Uma nave desenhada muito diferente do casco pode enganar o olho |
| Toda nave é sempre só aparência | O mais simples | Fecha a porta para naves com jogo diferente |

**Decisão.** Nas palavras do Fernando: "Uma nave com formato diferente é só aparência. A não ser que a gente diga expressamente que a nave nova muda o jogo." E: "Como as mudanças nas naves são cosméticas, não interferem no ranking, a não ser que seja uma nave que muda o jogo."

- **Nave de aparência (o padrão):** usa o casco e os atributos da nave clássica, muda só o desenho e não mexe no ranking.
- **Nave que muda o jogo:** precisa ser marcada como tal. Só ela pode ter casco ou atributos próprios. Ela prova cada fase com o piloto automático, e os tempos dela não se misturam com os da nave clássica no ranking.

**Consequências.**

- **No E-26:**
  - a definição da nave ganha uma marca "muda o jogo", desligada por padrão ([#122](https://github.com/TARNAGS/resgate-espacial/issues/122));
  - a nave clássica vira o casco padrão ([#121](https://github.com/TARNAGS/resgate-espacial/issues/121));
  - a skin recebe o casco e não consegue mudá-lo ([#124](https://github.com/TARNAGS/resgate-espacial/issues/124));
  - a chave do ranking só muda com uma nave que muda o jogo ([#120](https://github.com/TARNAGS/resgate-espacial/issues/120)).
- **Pega:** como o casco é o mesmo, o desenho de uma nave de aparência precisa ficar perto dele. Uma nave desenhada com asas compridas passaria "por dentro" de uma pedra sem explodir, e o jogador acharia que é defeito. **Proposta:** o desenho fica dentro de uma folga de cerca de 3 pixels em volta do casco padrão, conferida por teste ([#124](https://github.com/TARNAGS/resgate-espacial/issues/124)).
- Responde, para as naves, parte da P-017: uma nave de aparência nunca dá vantagem, então pode ser vendida sem afetar recordes.
- **Em aberto:** como uma nave que muda o jogo aparece no ranking (P-024). As evoluções da nave seguem a mesma regra (D-035).

**Revisitar se** a loja (P-017) precisar vender naves que mudam o jogo, ou se os jogadores sentirem que as naves de aparência não batem onde parecem.

## D-035 — Evolução que muda atributos muda o jogo; evolução só visual, não

**Contexto.** Depois da D-034, faltava a outra pergunta do épico E-26 ([#110](https://github.com/TARNAGS/resgate-espacial/issues/110)): as evoluções da nave contam no ranking? Elas podem ser melhorias que o jogador ganha ao avançar ou compra na loja (P-017). A cadeia de parâmetros da [#120](https://github.com/TARNAGS/resgate-espacial/issues/120) já reserva uma camada para elas.

**Opções consideradas.** O Claude propôs separar a evolução pelo que ela muda, seguindo a D-034.

| Opção | A favor | Contra |
|---|---|---|
| Nenhuma evolução mexe no ranking | Simples | Quem tem mais propulsor bate o recorde de quem não tem: vantagem ganha ou comprada |
| **Evolução de atributos muda o jogo; evolução visual não** | A mesma regra das naves (D-034); o ranking só compara corridas feitas com o mesmo jogo | Mais configurações para o ranking tratar (P-024) |

**Decisão.** O Fernando aprovou a proposta ("Siga com isso"):

- uma evolução que muda atributos (mais propulsor, tanque maior) muda o jogo por natureza, então mexe no ranking;
- uma evolução só visual não mexe.

Juntas, a D-034 e a D-035 dão a regra geral: **o que muda só a aparência nunca mexe no ranking; o que muda o jogo sempre mexe.**

**Consequências.**

- **Na [#120](https://github.com/TARNAGS/resgate-espacial/issues/120):** a camada "evoluções" da cadeia de parâmetros entra na chave do ranking quando muda um atributo. A evolução visual fica na camada de aparência (skins, [#124](https://github.com/TARNAGS/resgate-espacial/issues/124)) e nunca entra na chave.
- **Pega:** uma evolução de atributos também mexe no tanque provado (D-018 e D-023). Com mais propulsor ou tanque maior, o abastecimento que hoje é obrigatório pode deixar de fazer falta. O tanque das fases continua calculado com a nave base. Quando as evoluções forem desenhadas, é preciso decidir se a fase recalcula o tanque para cada configuração ou se facilitar é justamente o papel da evolução. Isso entrou na P-024.
- Como os tempos de uma configuração que muda o jogo aparecem no ranking virou a P-024.

**Revisitar se** as evoluções forem desenhadas só como progresso, sem ranking, ou se o ranking ficar dividido em configurações demais.

## D-036 — Anticheat só antes do lançamento; os playtests seguem sem proteção

**Contexto.** A pesquisa de anticheat ([#109](https://github.com/TARNAGS/resgate-espacial/issues/109), [documento 11](11-anticheat-e-ranking-justo.md)) propôs três degraus de proteção para o ranking (P-023). Ficou a pergunta: o degrau 1 entra já, antes da próxima rodada de playtest? Ele tem quatro partes e custa cerca de um dia de trabalho:
- piso de tempo por fase;
- dono do nick, com o login anônimo do Firebase;
- esconder a porta de depuração;
- tirar do ranking a corrida com engasgo.

**Opções consideradas.**

| Opção | A favor | Contra |
|---|---|---|
| Degrau 1 inteiro agora | O ranking dos playtests já fica protegido contra o básico | Um dia de trabalho antes de uma rodada com amigos de confiança |
| Só o piso de tempo | O mais barato | Protege pouco: o nick continua sem dono |
| **Não agora** | O tempo vai para o que já está priorizado (abstração, tanque, patch note) | O ranking dos playtests continua aceitando tempo falso de quem souber o endereço do banco |

**Decisão.** O Fernando, na revisão das filas de 07/10/2026: "Não agora". Os playtests seguem com amigos de confiança, sem proteção contra trapaça. O anticheat inteiro fica para antes do lançamento (M4), dentro da [#101](https://github.com/TARNAGS/resgate-espacial/issues/101).

**Consequências.**

- **Risco baixo:** o repositório é privado fora das janelas de teste, e os jogadores são conhecidos.
- **Continua em aberto na P-023, para antes do M4:**
  - quanto o ranking importa no lançamento;
  - se o ranking é da loja, nosso ou os dois ([#98](https://github.com/TARNAGS/resgate-espacial/issues/98));
  - se usamos o plano Blaze ou a conferência por script;
  - se o "fantasma" do melhor tempo entra como ideia de produto.
- **O trabalho não se perde:** as fichas de ouro da abstração ([#114](https://github.com/TARNAGS/resgate-espacial/issues/114)) usam o mesmo formato de corrida gravada que o degrau 2 vai precisar.

**Revisitar se** aparecer um tempo suspeito no ranking dos playtests, ou se uma rodada for aberta a desconhecidos.

## D-037 — Zoom da câmera que se adapta à tela; o jogador pode aproximar

**Contexto.** A câmera mostrava a altura inteira da fase. O Fernando achou a câmera um pouco distante no playtest de 04/10 ([#95](https://github.com/TARNAGS/resgate-espacial/issues/95)) e, em 07/10, testou no iPhone os zooms 1,15, 1,3 e 1,45.

Nas palavras dele:
- **1,15** "é a melhor, porque você consegue ver a fase, se programar para antecipar batidas e construir rota para chegar mais rápido. Apesar do gráfico ficar muito pequeno no celular".
- **1,3 e 1,45** "ficam ligeiramente grandes, cortando o topo da tela, e alguns obstáculos se tornam inesperados por conta de você só conseguir avistá-los quando está rápido ou perto demais. Isso atrapalha a gameplay e se torna punitivista demais".

Ele perguntou se o zoom podia se adaptar a celulares de tela menor. As contas do Claude mostraram que, deitados, os celulares têm alturas parecidas, então a nave fica quase do mesmo tamanho em todos (13 a 16 px). O que muda é o **formato**: telas mais "quadradas" veem menos da fase à frente. Com 1,15 fixo, o iPhone SE veria 82% do trecho de um iPhone 14, e o iPad, 67%.

**Opções consideradas.**

| Opção | A favor | Contra |
|---|---|---|
| 1,15 fixo para todos | Simples | No iPhone SE, 18% menos à frente; no iPad, 33% menos |
| **Zoom que se adapta ao formato da tela** | Todo celular vê quase o mesmo trecho à frente (o iPhone SE, 95%) | No iPhone SE, a nave fica um pouco menor (12 px em vez de 14) |

E, sobre o ajuste: o jogador muda o zoom ou o jogo escolhe? Como o zoom muda quanto se vê à frente, ele muda a dificuldade, e quem vê mais leva vantagem no ranking.

**Decisão.** O Fernando escolheu:
- **o zoom se adapta à tela:** 1,15 nas telas compridas (a maioria dos celulares) e até 1 nas mais quadradas;
- **o jogador pode mudar o zoom nas configurações.**

**Proposta do Claude, já construída e para o Fernando validar:** nas configurações, o jogador só **aproxima** (CAMERA: AUTO, CLOSE ou CLOSER). Isso resolve o conforto de quem acha os desenhos pequenos sem dar a ninguém a vantagem de ver mais da fase. O zoom fixo de teste (painel de ajuste ou `?zoom=`) tira a corrida do ranking.

**Consequências.**

- **Câmera e dificuldade:** a câmera deixa de ser tratada como "só imagem". Ver mais à frente muda a dificuldade, e o ranking depende disso.
- **No código:**
  - regra do zoom em `render/view.js`;
  - escolha do jogador em `cameraNear`, salva no aparelho, fora do perfil online;
  - ajuste de teste renomeado para `cameraZoomFixed`, então zooms antigos salvos pelo painel deixam de valer sozinhos;
  - telemetria: o início de cada fase passa a registrar o zoom usado;
  - configurações em duas colunas em tela baixa, para caber o botão novo.
- **Ainda falta:** no iPad, a tela 4:3 continua vendo menos à frente (76%). Se o jogo for para tablets, isso volta à mesa.
- **Para medir no próximo playtest:** mortes e tempos por formato de tela, para ver se as telas mais quadradas ainda saem perdendo.

**Revisitar se** jogadores de telas pequenas ou quadradas morrerem bem mais que os outros, ou se muita gente escolher CLOSER (sinal de que os desenhos estão pequenos demais para todos).

## Decisões pendentes

| ID | Pergunta | Quando decidir | Observação |
|---|---|---|---|
| P-003 | Qual será o nome final do jogo? | Antes do lançamento | Cartão [#54](https://github.com/TARNAGS/resgate-espacial/issues/54) |
| P-006 | Como funciona a pontuação? | Antes de construir a tela de resultado | Já definido: sem limite de tempo; resgate mais rápido faz mais pontos. Com cenários aleatórios (D-014), comparar tempos de cenários diferentes pode ser injusto. Perguntas no [documento 02, seção 8](02-regras-do-jogo.md#8-tempo-e-pontuação). Cartão [#53](https://github.com/TARNAGS/resgate-espacial/issues/53) |
| P-009 | Como o jogo ensina a jogar: há um tutorial, e a fase 1 é aleatória ou fixa e desenhada à mão? Resolvida pela D-031 (04/10/2026): sem tutorial; DEMO antes da primeira partida e attract mode. | Antes do M2 | No protótipo 01, ela é aleatória, com regras bem fáceis. Ampliada em 01/10/2026 com a pergunta do Fernando sobre ter um tutorial e em 04/10/2026 com o ensino da dinâmica do propulsor, quando soltar e quando apertar (D-027). Direção do Fernando (04/10/2026): sem tutorial, porque o jogo é simples e intuitivo; o que falta é mostrar o objetivo (ir até o fim, resgatar, voltar e pousar), talvez com uma corrida gravada antes de jogar. Cartão [#48](https://github.com/TARNAGS/resgate-espacial/issues/48) |
| P-010 | Ao tentar de novo depois de perder as 3 vidas, o cenário se repete ou muda? Resolvida pela D-021: as fases fixas repetem sempre o mesmo cenário (na BONUS, "Try again" também repete). | Antes do M2 | No protótipo 01, "Try again" repete o mesmo cenário. Cartão [#49](https://github.com/TARNAGS/resgate-espacial/issues/49) |
| P-008 | Qual ferramenta de medição anônima usar, e que eventos medir? Para o playtest, respondida pela D-025 (Firebase, com o nick); para o lançamento, continua em aberto. | No M2, antes de construir a medição (E-17) | Precisa ser gratuita, dispensar cookies e aceitar eventos personalizados ([PRD, seção 7](03-prd.md#7-medição)). O Fernando revisa a lista de eventos. Cartão [#56](https://github.com/TARNAGS/resgate-espacial/issues/56) |
| P-011 | Que obstáculos o jogo tem, e como ele se organiza em mundos e fases? | Antes de construir o gerador de fases (E-09) | A parte "mundo e fase" foi respondida pela D-020 (mundos com 10 fases). Falta o catálogo de obstáculos e o que cada mundo apresenta de novo. Cartão [#60](https://github.com/TARNAGS/resgate-espacial/issues/60) |
| P-012 | Haverá modificadores de jogo e de fase (gravidade, vento, escuridão etc.)? | Antes de construir o gerador de fases (E-09) | Afeta a pontuação (P-006) e o mapa de progresso. Cartão [#61](https://github.com/TARNAGS/resgate-espacial/issues/61) |
| P-013 | Quem é o jogador ideal do jogo (ICP)? Resolvida pela D-028 (04/10/2026). | Antes dos testes com pessoas ([#43](https://github.com/TARNAGS/resgate-espacial/issues/43)) | Aprofunda a persona primária da Visão (seção 4). Cartão [#59](https://github.com/TARNAGS/resgate-espacial/issues/59) |
| P-014 | O jogo será pago, gratuito com loja de itens, ou os dois? | Antes da publicação nas lojas (M4) | Ir para as lojas já foi decidido (D-019); falta decidir se e como cobrar: download pago, loja de itens e cosméticos, ou os dois. Desde 04/10/2026, na pesquisa única de lojas e dinheiro, cartão [#98](https://github.com/TARNAGS/resgate-espacial/issues/98) (substitui a #63 e a #65) |
| P-018 | Como funciona o modo Nightmare, em que morrer não devolve o combustível? | Antes de construir o modo (M5) | Ideia do Fernando depois do teste com um amigo (02/10/2026). A nave reaparece pousada na base, que abastece: o modo precisa dizer se base e posto continuam abastecendo. Conversa com P-012 (modificadores) e P-017 (loja). Cartão [#79](https://github.com/TARNAGS/resgate-espacial/issues/79) |
| P-019 | Como funciona um ranking de tempos por fase? Para os playtesters, resolvida pela D-024 (nickname e banco simples); para o lançamento, continua em aberto. | Antes da publicação nas lojas (M4) | Ideia do Fernando depois do teste com um amigo. Ranking entre jogadores esbarra em D-001 (sem login) e no cenário sorteado (D-014); saídas: rankings do Game Center e do Google Play Games e um desafio do dia com a mesma semente para todos. Para o lançamento: história [#101](https://github.com/TARNAGS/resgate-espacial/issues/101), que depende da pesquisa [#98](https://github.com/TARNAGS/resgate-espacial/issues/98) (a #80 foi encerrada em 04/10/2026). Pesquisa de anticheat em 07/10/2026 ([documento 11](11-anticheat-e-ranking-justo.md), [#109](https://github.com/TARNAGS/resgate-espacial/issues/109)): os rankings das lojas resolvem o nome, mas não conferem o tempo; a proteção contra trapaça virou a P-023 |
| P-023 | Que proteção contra trapaça o ranking terá, e quando? Proposta do Claude em três degraus: (1) já nos playtests, piso de tempo por fase e dono do nick (login anônimo do Firebase); (2) antes do lançamento, conferir a corrida pelo replay; (3) no lançamento, identidade da loja, App Check, revisão humana do top 10 e botão de denúncia. | Antes da publicação nas lojas (M4). O degrau 1 nos playtests foi recusado pela D-036 (07/10/2026) | Pergunta do Fernando (07/10/2026): pessoas podem usar trapaça para bater os recordes. Pesquisa e as cinco perguntas a responder no [documento 11](11-anticheat-e-ranking-justo.md), seção 9. Cartão [#109](https://github.com/TARNAGS/resgate-espacial/issues/109). Liga com a P-019 ([#101](https://github.com/TARNAGS/resgate-espacial/issues/101)) e a pesquisa de lojas ([#98](https://github.com/TARNAGS/resgate-espacial/issues/98), item 4). O mesmo replay daria o "fantasma" do melhor tempo |
| P-020 | Abastecer obrigatório (D-023) não segura os jogadores reais: como garantir, ou a regra muda? Resolvida pela D-026 (04/10/2026): piloto mais econômico e tanque recalculado, sem regra que obrigue. | Antes da próxima rodada de playtest | Opções: piloto mais econômico e tanques recalculados, tanque calibrado pelos jogadores, posto como parada obrigatória, ou aceitar abastecer opcional. Mudar a fase recomeça o ranking dela. Dados no [documento 09](09-resultados-dos-playtests.md). Cartão [#89](https://github.com/TARNAGS/resgate-espacial/issues/89) |
| P-021 | O pouso na tripulação é a maior dificuldade e o nível 1 travou um jogador: o que mudar? Resolvida pela D-027 (04/10/2026): o pouso fica como está; ensinar o propulsor vai para a P-009. | Antes da próxima rodada de playtest | Opções: afastar a plataforma da parede do fim, nível 1 mais tolerante, dica depois de mortes no pouso e oferecer o TRAINING. Conversa com P-009. Cartão [#90](https://github.com/TARNAGS/resgate-espacial/issues/90) |
| P-017 | O que a loja de itens vende, com que moeda, e como evitar vantagem injusta? | Antes de construir a loja (E-24) | Ideia do Fernando: itens de jogo e de nave, com dinheiro real ou moedas do jogo. Itens que facilitem o jogo afetam recordes e a regra do melhor caminho (D-018). Para as naves e as evoluções, a D-034 e a D-035 (07/10/2026) respondem em parte: o que muda só a aparência não mexe no ranking; uma nave marcada como "muda o jogo" ou uma evolução de atributos mexe (P-024). Cartão [#78](https://github.com/TARNAGS/resgate-espacial/issues/78) |
| P-024 | Como os tempos de uma nave ou evolução que muda o jogo (D-034 e D-035) aparecem no ranking? | Antes de construir a primeira nave de jogo ou evolução de atributos (E-24, M5) | Opções: um ranking para cada configuração; ranking só com a nave base (com evolução, a corrida não entra); ou evoluções valendo só fora do ranking. Também decidir se o tanque provado (D-018 e D-023) é recalculado para cada configuração. Liga com a P-017 ([#78](https://github.com/TARNAGS/resgate-espacial/issues/78)) e a P-019 ([#101](https://github.com/TARNAGS/resgate-espacial/issues/101)). A [#120](https://github.com/TARNAGS/resgate-espacial/issues/120) serve para qualquer resposta |
| P-015 | Como receber dinheiro, e é preciso CNPJ? | Só se a P-014 decidir cobrar ou aceitar doações | Cartão [#64](https://github.com/TARNAGS/resgate-espacial/issues/64) |
| P-022 | Que informações do jogador o jogo salva no banco online (Firebase), além do ranking e da telemetria, e como protegê-las sem login? Resolvida pela D-029 (04/10/2026). | Antes do próximo playtest | Pedido do Fernando (04/10/2026): "quero que salve informações no banco de dados que temos". Recomendação do Claude: progresso de cada fase ligado ao nick, com regras que só deixam o progresso crescer. Cartão [#100](https://github.com/TARNAGS/resgate-espacial/issues/100) |
| P-016 | O que o jogo guarda, e onde: só no aparelho ou também num servidor? Respondida em parte pela arquitetura (progresso no aparelho; ranking e telemetria no Firebase); o que falta virou a P-022. | Antes de construir o progresso salvo (E-14) | Hoje tudo fica no aparelho; um servidor reabre D-001, D-003 e D-004. Cartão [#62](https://github.com/TARNAGS/resgate-espacial/issues/62) |

## Modelo para novas decisões

```markdown
## D-00X — Título curto da decisão

**Contexto.** O que levou à decisão.

**Opções consideradas.** Quais caminhos existiam, com prós e contras.

**Decisão.** O que foi decidido.

**Consequências.** O que muda por causa dela, inclusive o que se perde.

**Revisitar se** o que precisaria mudar para reabrir a discussão.
```
