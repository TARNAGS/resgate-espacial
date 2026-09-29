# Registro de Decisões — Resgate Espacial

| Campo | Valor |
|---|---|
| Documento | 05 — Registro de decisões |
| Última atualização | 28/09/2026 |
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

## Decisões pendentes

| ID | Pergunta | Quando decidir | Observação |
|---|---|---|---|
| P-001 | O repositório será público ou privado? | Antes de divulgar no portfólio | Portfólio pede visibilidade; no plano gratuito do GitHub, o GitHub Pages só publica repositórios públicos |
| P-003 | Qual será o nome final do jogo? | Antes do lançamento | — |
| P-004 | Com que tecnologia construir? | Depois do PRD | Decisão técnica guiada pelos requisitos |
| P-005 | Onde hospedar o jogo? | Junto com P-001 | Precisa ser gratuito (D-003) |
| P-006 | Como funciona a pontuação? | Antes de construir a tela de resultado | Já definido: sem limite de tempo; resgate mais rápido faz mais pontos. Perguntas no [documento 02, seção 8](02-regras-do-jogo.md#8-tempo-e-pontuação) |
| P-007 | Quantas fases entram no MVP? | No documento 04, Roadmap | A curva de 5 fases está definida no documento 02, seção 10 |
| P-008 | Qual ferramenta de medição anônima usar? | Junto com P-004 | Precisa ser gratuita, dispensar cookies e aceitar eventos personalizados ([PRD, seção 7](03-prd.md#7-medição)) |

## Modelo para novas decisões

```markdown
## D-00X — Título curto da decisão

**Contexto.** O que levou à decisão.

**Opções consideradas.** Quais caminhos existiam, com prós e contras.

**Decisão.** O que foi decidido.

**Consequências.** O que muda por causa dela, inclusive o que se perde.

**Revisitar se** o que precisaria mudar para reabrir a discussão.
```
