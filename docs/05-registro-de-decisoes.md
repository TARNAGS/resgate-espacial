# Registro de Decisões — Resgate Espacial

| Campo | Valor |
|---|---|
| Documento | 05 — Registro de decisões |
| Última atualização | 01/10/2026 |
| Responsável | Fernando Nunes (Product Manager) |

Cada decisão relevante de produto fica registrada aqui, com o contexto e o motivo. Assim ela não é rediscutida sem necessidade e pode ser revista quando o contexto mudar.

## Resumo

| ID | Decisão | Data | Status |
|---|---|---|---|
| D-001 | Sem login e sem contas | 28/09/2026 | Aceita |
| D-002 | Distribuição como PWA, fora das lojas | 28/09/2026 | Aceita |
| D-003 | Gratuito, sem anúncios e sem compras | 28/09/2026 | Aceita |
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
| D-014 | Fases geradas aleatoriamente (procedurais) | 01/10/2026 | Aceita |
| D-015 | Menu com Jogar, Configurações e mapa de progresso | 01/10/2026 | Aceita |
| D-016 | Quadro com duas trilhas: descoberta e entrega | 01/10/2026 | Aceita |
| D-017 | Repositório e quadro privados; o jogo só fica no ar nas janelas de teste | 01/10/2026 | Aceita |

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

## D-003 — Gratuito, sem anúncios e sem compras

**Contexto.** Projeto de portfólio e aprendizado.

**Decisão.** O jogo é gratuito, sem anúncios e sem compras dentro do jogo.

**Consequências.** O custo de operação precisa ser zero: hospedagem gratuita e nenhum serviço pago.

**Revisitar se** o projeto deixar de ser apenas portfólio.

## D-004 — Apenas um jogador

**Contexto.** O jogo original era para um jogador, e a graça está no desafio individual de pilotagem.

**Decisão.** Apenas um jogador, contra o cenário.

**Consequências.** Não há servidor de jogo: tudo roda no aparelho, inclusive sem internet.

**Revisitar se** surgir interesse em algo competitivo, como ranking de tempo, que dependeria de servidor (ver D-001).

## D-005 — Identidade própria, inspirada no gênero

**Contexto.** O jogo original não foi identificado. De todo modo, regras e mecânicas de jogo não são protegidas por direito autoral no Brasil (Lei 9.610/1998, art. 8º, II); já nome (como marca), arte, personagens e músicas podem ser.

**Decisão.** Nome, arte e sons próprios, inspirados no gênero, sem copiar nenhum jogo específico.

**Consequências.** "Resgate Espacial" é um codinome; o nome final é a decisão pendente P-003.

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

## Decisões pendentes

| ID | Pergunta | Quando decidir | Observação |
|---|---|---|---|
| P-003 | Qual será o nome final do jogo? | Antes do lançamento | Cartão [#54](https://github.com/TARNAGS/resgate-espacial/issues/54) |
| P-006 | Como funciona a pontuação? | Antes de construir a tela de resultado | Já definido: sem limite de tempo; resgate mais rápido faz mais pontos. Com cenários aleatórios (D-014), comparar tempos de cenários diferentes pode ser injusto. Perguntas no [documento 02, seção 8](02-regras-do-jogo.md#8-tempo-e-pontuação). Cartão [#53](https://github.com/TARNAGS/resgate-espacial/issues/53) |
| P-009 | Como o jogo ensina a jogar: há um tutorial, e a fase 1 é aleatória ou fixa e desenhada à mão? | Antes do M2 | No protótipo 01, ela é aleatória, com regras bem fáceis. Ampliada em 01/10/2026 com a pergunta do Fernando sobre ter um tutorial. Cartão [#48](https://github.com/TARNAGS/resgate-espacial/issues/48) |
| P-010 | Ao tentar de novo depois de perder as 3 vidas, o cenário se repete ou muda? | Antes do M2 | No protótipo 01, "Try again" repete o mesmo cenário. Cartão [#49](https://github.com/TARNAGS/resgate-espacial/issues/49) |
| P-008 | Qual ferramenta de medição anônima usar, e que eventos medir? | No M2, antes de construir a medição (E-17) | Precisa ser gratuita, dispensar cookies e aceitar eventos personalizados ([PRD, seção 7](03-prd.md#7-medição)). O Fernando revisa a lista de eventos. Cartão [#56](https://github.com/TARNAGS/resgate-espacial/issues/56) |
| P-011 | Que obstáculos o jogo tem, e como ele se organiza em mundos e fases? | Antes de construir o gerador de fases (E-09) | Os documentos usam "fase" e "nível" como sinônimos, e "mundo" ainda não existe. Afeta D-009 e D-015. Cartão [#60](https://github.com/TARNAGS/resgate-espacial/issues/60) |
| P-012 | Haverá modificadores de jogo e de fase (gravidade, vento, escuridão etc.)? | Antes de construir o gerador de fases (E-09) | Afeta a pontuação (P-006) e o mapa de progresso. Cartão [#61](https://github.com/TARNAGS/resgate-espacial/issues/61) |
| P-013 | Quem é o jogador ideal do jogo (ICP)? | Antes dos testes com pessoas ([#43](https://github.com/TARNAGS/resgate-espacial/issues/43)) | Aprofunda a persona primária da Visão (seção 4). Cartão [#59](https://github.com/TARNAGS/resgate-espacial/issues/59) |
| P-014 | O jogo continua gratuito e fora das lojas? | Antes do lançamento | Cobrar ou ir para as lojas reabre D-002, D-003, D-012 e D-013. Cartão [#63](https://github.com/TARNAGS/resgate-espacial/issues/63) |
| P-015 | Como receber dinheiro, e é preciso CNPJ? | Só se a P-014 decidir cobrar ou aceitar doações | Cartão [#64](https://github.com/TARNAGS/resgate-espacial/issues/64) |
| P-016 | O que o jogo guarda, e onde: só no aparelho ou também num servidor? | Antes de construir o progresso salvo (E-14) | Hoje tudo fica no aparelho; um servidor reabre D-001, D-003 e D-004. Cartão [#62](https://github.com/TARNAGS/resgate-espacial/issues/62) |

## Modelo para novas decisões

```markdown
## D-00X — Título curto da decisão

**Contexto.** O que levou à decisão.

**Opções consideradas.** Quais caminhos existiam, com prós e contras.

**Decisão.** O que foi decidido.

**Consequências.** O que muda por causa dela, inclusive o que se perde.

**Revisitar se** o que precisaria mudar para reabrir a discussão.
```
