# Diário de Bordo — Resgate Espacial

| Campo | Valor |
|---|---|
| Documento | 06 — Diário de bordo |
| Última atualização | 08/10/2026 |
| Responsável | Fernando Nunes (Product Manager) |

Registro do que foi feito em cada sessão de trabalho, das decisões tomadas e de onde o projeto parou. É o ponto de partida para retomar o trabalho, em qualquer máquina.

## Onde paramos (08/10/2026)

- **Primeiro, no próximo "bom dia": retomar a revisão do Lean Canvas no C1** ([documento 13](13-modelo-de-negocio.md), seção 4.1). P1 a P4 foram fechados em 07/10; o C1 espera 4 respostas do Fernando (faixa etária, Brasil ou global, Android junto com o iPhone e o canvas do portfólio). As decisões da revisão só viram D-xxx no fim (documento 13, seção 7); até lá, o que a revisão mudou (anúncios, público, proposta de valor e métricas) vale mais do que a Visão 1.5.
- **Janela de teste fechada (07/10):** o repositório está privado e o site, fora do ar. A rodada 1 durou de 02 a 04/10 ([documento 09](09-resultados-dos-playtests.md), "Como a rodada terminou"). Para a próxima, seguir a janela de teste do `CLAUDE.md`, a partir do passo 0.
- **Objetivo:** portfólio, aprendizado e negócio. O jogo será publicado na App Store e no Google Play (D-019); cobrar ou não segue em aberto (P-014, na pesquisa de lojas e dinheiro [#98](https://github.com/TARNAGS/resgate-espacial/issues/98); loja de itens, P-017, [#78](https://github.com/TARNAGS/resgate-espacial/issues/78)).
- **Público (D-028):** o jogador casual de celular, o mesmo de Jetpack Joyride, Subway Surfers, Candy Crush Saga, Plants vs. Zombies e Temple Run, com o fã da estética retrô dentro dele. Esses jogos viram benchmark ([#98](https://github.com/TARNAGS/resgate-espacial/issues/98) e [#99](https://github.com/TARNAGS/resgate-espacial/issues/99)).
- **Marcos:** M0 só falta a retrospectiva ([#45](https://github.com/TARNAGS/resgate-espacial/issues/45)). M1: critério de saída atendido em 04/10 (5 de 6 concluíram o nível 1, e o Fernando aprovou a sensação; [#43](https://github.com/TARNAGS/resgate-espacial/issues/43) fechado). Big picture em proposta: M4 (lojas) e M5 (mundos e loja).
- **O jogo (`jogo/`):**
  - níveis 1 a 3 com **cenário fixo** (D-021) e mais difíceis; desafios **PRACTICE** (a mais difícil) e **BONUS** (sorteada a cada partida);
  - nas fases com posto, o tanque pede **um abastecimento** (D-023), mas os melhores jogadores terminam sem ele; a D-026 recalcula o tanque com um piloto mais econômico ([#92](https://github.com/TARNAGS/resgate-espacial/issues/92) e [#93](https://github.com/TARNAGS/resgate-espacial/issues/93));
  - controle principal de **dois polegares (A)**, com o de um polegar (B) como opção (D-022);
  - **abertura** em três telas com **música chiptune** sincronizada, que dá para pular;
  - **elogios** discretos para manobras difíceis (CLOSE CALL, GREAT SAVE, PERFECT LANDING, PERFECT RUN);
  - **nickname e ranking online** por fase (D-024) e **telemetria das partidas** no Firebase (D-025), com relatório no terminal;
  - **primeiro playtest medido** (6 amigos, 229 tentativas): resultados no [documento 09](09-resultados-dos-playtests.md);
  - aviso de pouso, treino (TRAINING), painel de ajuste escondido e **75 testes automáticos**.
- **Jogo original identificado (05/10):** o **Crazy Gravity** (1996), de Axel Meierhöfer; a memória do Fernando o misturou com o Gravitron 2 (2008). Virou benchmark de level design (D-032).
- **Discovery e construção (06/10, D-033):** todo estudo de jogo segue a skill `discovery-de-jogos`, e tudo o que for construído passa antes pelos estudos de level design e gameplay. Inspirar, nunca copiar; o Fernando orienta a criação.
- **Gravitron 1 e 2 estudados (06/10, [#106](https://github.com/TARNAGS/resgate-espacial/issues/106)):** a origem do resgate de pessoas. Regras do Gravitron 2 lidas no código que o autor publicou, 22 fases do 2 e 23 do 1 mapeadas ([benchmark](benchmark/gravitron.md), [página de leitura](https://claude.ai/artifact/8yu4nX63Xoix8VneHU59bv)). Primeiro uso da skill.
- **Jetpack Joyride estudado (06/10, [#107](https://github.com/TARNAGS/resgate-espacial/issues/107), parte da [#99](https://github.com/TARNAGS/resgate-espacial/issues/99)):** como um jogo infinito funciona, contado pelo criador ([benchmark](benchmark/jetpack-joyride.md), [página de leitura](https://claude.ai/artifact/TjsQe83tBnQbYzsddenUcb)).
- **Temple Run estudado (06/10, [#108](https://github.com/TARNAGS/resgate-espacial/issues/108), parte da [#99](https://github.com/TARNAGS/resgate-espacial/issues/99)):** a corrida infinita em 3D, com perseguição, contada pelos criadores, e comparada ao Jetpack Joyride ([benchmark](benchmark/temple-run.md), [página de leitura](https://claude.ai/artifact/DatT92pPFFCnnDwG3vLoBZ)). Faltam Subway Surfers, Candy Crush Saga e Plants vs. Zombies.
- **Geometry Dash estudado (08/10, [#127](https://github.com/TARNAGS/resgate-espacial/issues/127), em "Para conversar"):** o casual mais próximo do nosso jogo, com fases fixas. A curva das 22 fases, o mundo de 10 fases curtas (Geometry Dash World), como ele separa o treino com checkpoints da conclusão que vale e o modelo grátis com anúncios + pago ([benchmark](benchmark/geometry-dash.md), [página de leitura](https://claude.ai/artifact/Y7Y1rAykSbfkfXuaJdSXRC)). Responde a pergunta aberta da fase grande (documento 13, seção 3.2).
- **Guia dos benchmarks (06/10, v1.1 em 08/10):** os quatro estudos lidos juntos, com 12 insights, divergências, validações, as decisões pendentes e três para decidir primeiro ([benchmark/README.md](benchmark/README.md), [página de leitura](https://claude.ai/artifact/TSGis8FXKTXWWgdQUJH9ar)). É a porta de entrada para tudo o que foi estudado.
- **Anticheat (07/10, [#109](https://github.com/TARNAGS/resgate-espacial/issues/109), em "Para conversar"):** como proteger o ranking contra trapaça, com casos reais (Open Hexagon, Trackmania, lojas, speedrun.com), as portas abertas do nosso ranking hoje e uma proposta em três degraus, centrada em conferir a corrida pelo replay ([documento 11](11-anticheat-e-ranking-justo.md)).
- **Épico E-26 · Abstração (07/10, [#110](https://github.com/TARNAGS/resgate-espacial/issues/110), no Backlog):** preparar o jogo para 10 mundos, 100 fases, skins, naves diferentes e evoluções sem quebrar as regras básicas. São 15 tarefas ([#111](https://github.com/TARNAGS/resgate-espacial/issues/111) a [#125](https://github.com/TARNAGS/resgate-espacial/issues/125)) em cinco ondas, da mais barata à mais cara: mapa de impacto, guardas automáticas, contratos, nave como dado e aparência separada das regras.
- **Documentos:** Visão 1.5, Regras 1.7, PRD 1.7, Roadmap 1.8, Decisões até a D-037 (pendências até a P-024), documento 07 (roteiro de teste), 08 (design de mundos, com o rascunho do Mundo 1), 09 (resultados dos playtests, v0.3), 10 (benchmark de level design, v0.7, com o [guia dos benchmarks](benchmark/README.md), as [18 fases do Crazy Gravity](benchmark/crazy-gravity.md), as [45 dos Gravitron](benchmark/gravitron.md), o [Jetpack Joyride](benchmark/jetpack-joyride.md), o [Temple Run](benchmark/temple-run.md) e o [Geometry Dash](benchmark/geometry-dash.md)) e 11 ([anticheat e ranking justo](11-anticheat-e-ranking-justo.md), v0.3).
- **Pendências abertas:** P-003 (nome), P-006 (pontuação), P-008 (medição), P-011 (obstáculos), P-012 (modificadores), P-014 (cobrar ou não, [#98](https://github.com/TARNAGS/resgate-espacial/issues/98)), P-015 (CNPJ), P-017 (loja), P-018 (modo Nightmare, [#79](https://github.com/TARNAGS/resgate-espacial/issues/79)), P-019 (ranking no lançamento, [#101](https://github.com/TARNAGS/resgate-espacial/issues/101)), P-023 (anticheat, [#109](https://github.com/TARNAGS/resgate-espacial/issues/109)), P-024 (como naves e evoluções que mudam o jogo aparecem no ranking). Decididas em 04/10: P-009 (D-031), P-013 (D-028), P-020 (D-026), P-021 (D-027) e P-022 (D-029); P-016 respondida em parte pela arquitetura.

### Próximos passos

Priorizados em 07/10/2026, a pedido do Fernando, a partir do quadro, deste diário, do registro de decisões, do Git e das sessões abertas no app. A ordem segue esta lógica:
1. primeiro, o que é risco e se resolve em minutos;
2. depois, o gargalo (a fila "Em revisão");
3. por fim, o que destrava a próxima construção e a próxima rodada de playtest.

A janela de teste foi fechada em 07/10.

**Resolvido em 07/10**

- **Fila "Em revisão" esvaziada** (revisão com o Fernando):
  - 22 cartões aprovados e fechados;
  - os épicos do M0 e do M1 (E-02 a E-06) fechados;
  - ficaram [#95](https://github.com/TARNAGS/resgate-espacial/issues/95) (escolher o zoom) e [#102](https://github.com/TARNAGS/resgate-espacial/issues/102) (perfil), que precisam do teste no iPhone.
- **Anticheat: não agora** (D-036). O degrau 1 não entra nos playtests; o resto da P-023 fica para antes do lançamento. [#109](https://github.com/TARNAGS/resgate-espacial/issues/109) fechada.
- **Benchmarks** ([#106](https://github.com/TARNAGS/resgate-espacial/issues/106) a [#108](https://github.com/TARNAGS/resgate-espacial/issues/108)): continuam em "Para conversar". O Fernando quer ler os estudos antes de decidir.

- **Regra do perfil publicada** pelo Fernando no console do Firebase, conferida pelo Claude pelo terminal: o perfil pode ser lido, gravações inválidas e apagar são recusados, e o ranking e a telemetria continuam funcionando. A cópia completa das regras está em `jogo/firebase/regras.json`. O progresso da rodada 1 que ainda estiver nos aparelhos sobe quando cada jogador abrir o jogo de novo (decisão do Fernando: o que se perdeu da rodada 1 pode ficar de fora).
- **Linhas de teste do banco ficam onde estão** (decisão do Fernando): o CLAUDETEST continua no ranking do nível 2, e `scores/teste_abc1` e `telemetry/1999-01-01` também ficam. "É só um teste do jogo que estamos criando."
- **Trabalho de 07/10 enviado ao GitHub** (commit 25489f9) e o portfólio no `context-directory` (e36fe2b).

**Esperando o Fernando** (a fila "Em revisão" tem 3 cartões em 07/10, todos com ele)

1. **Teste rápido no iPhone** (Fernando, cerca de 10 minutos, em http://192.168.15.159:8081, o endereço do Wi-Fi do computador):
   - [#126](https://github.com/TARNAGS/resgate-espacial/issues/126): aprovar o texto do patch note ("NEW: closer camera, fuel warnings, DEMO, messages up top") e ver a faixa no menu;
   - câmera (D-037): conferir o zoom automático e o Settings → CAMERA, e validar a proposta de o jogador só poder aproximar;
   - [#102](https://github.com/TARNAGS/resgate-espacial/issues/102): jogar com um nick, limpar os dados do Safari (ou usar outro aparelho), digitar o mesmo nick e ver o progresso voltar.
2. **Ler e aprovar o mapa de impacto** ([#111](https://github.com/TARNAGS/resgate-espacial/issues/111), [documento 12](12-arquitetura-do-jogo.md)): o que cada mudança no jogo afeta, o que conferir e quando o ranking recomeça.
3. **Retrospectivas do M0** ([#45](https://github.com/TARNAGS/resgate-espacial/issues/45)) **e do M1** ([#46](https://github.com/TARNAGS/resgate-espacial/issues/46)). Os épicos dos dois marcos já foram fechados; o Claude pode rascunhar as retros a partir deste diário, para o Fernando ajustar.
4. **Benchmarks em "Para conversar"** ([#106](https://github.com/TARNAGS/resgate-espacial/issues/106) a [#108](https://github.com/TARNAGS/resgate-espacial/issues/108) e [#127](https://github.com/TARNAGS/resgate-espacial/issues/127)): o Fernando lê o [guia dos benchmarks](benchmark/README.md) (ou a [página de leitura](https://claude.ai/artifact/TSGis8FXKTXWWgdQUJH9ar)) e decide as recomendações. O Claude pergunta de novo depois. Da #127, a primeira é o modelo de checkpoints da fase grande, que destrava o protótipo de fase grande.

**Próxima construção**

5. **Fernando decide o tanque** ([#93](https://github.com/TARNAGS/resgate-espacial/issues/93)), com os números do piloto expert ([#92](https://github.com/TARNAGS/resgate-espacial/issues/92)). Depois, o Claude constrói. As fichas de ouro mostram o que mudou, e os rankings do nível 3, da PRACTICE e da BONUS recomeçam.
6. **Abstração, ondas 4 e 5** (Claude, M3): formato único da nave ([#121](https://github.com/TARNAGS/resgate-espacial/issues/121)), conferência de naves novas ([#122](https://github.com/TARNAGS/resgate-espacial/issues/122)), desenho em peças ([#123](https://github.com/TARNAGS/resgate-espacial/issues/123)), skins ([#124](https://github.com/TARNAGS/resgate-espacial/issues/124)) e o `main.js` em fluxos ([#125](https://github.com/TARNAGS/resgate-espacial/issues/125)). As ondas 1 a 3 ficaram prontas em 07/10.

**Próxima rodada de playtest**

7. **Patch note** ([#126](https://github.com/TARNAGS/resgate-espacial/issues/126)): construído em 07/10; falta o Fernando aprovar o texto (passo 1).
8. **Rodada de playtest** num fim de semana combinado, seguindo a janela de teste do `CLAUDE.md` a partir do passo 0. Usa a telemetria nova ([#91](https://github.com/TARNAGS/resgate-espacial/issues/91)). Relatório com `node jogo/ferramentas/relatorio-telemetria.mjs` e mapas de calor com `node jogo/ferramentas/mapas-telemetria.mjs`.

**Caminho para fechar o MVP (M2)**, pelo checklist do PRD (seção 8)

9. **Decisões do Fernando:**
    - pontuação ([#53](https://github.com/TARNAGS/resgate-espacial/issues/53), P-006); o "ranking por tempo puro" dos benchmarks (passo 4) pode resolver;
    - nome final ([#54](https://github.com/TARNAGS/resgate-espacial/issues/54), P-003);
    - referências visuais para a arte ([#55](https://github.com/TARNAGS/resgate-espacial/issues/55)).
10. **Claude:**
    - ferramenta de medição ([#56](https://github.com/TARNAGS/resgate-espacial/issues/56), P-008);
    - escrever as histórias de app instalável (E-13) e sem internet (E-14), que ainda não existem (hoje o jogo não tem manifesto nem service worker).

**Conteúdo (M3 em diante)**

11. **Fernando:** obstáculos ([#60](https://github.com/TARNAGS/resgate-espacial/issues/60), P-011) e modificadores ([#61](https://github.com/TARNAGS/resgate-espacial/issues/61), P-012), com as ideias do [benchmark do Crazy Gravity](benchmark/crazy-gravity.md), seção 9. Eles destravam os níveis 4 e 5 (E-12).
12. **Claude:** benchmark dos casuais que faltam ([#99](https://github.com/TARNAGS/resgate-espacial/issues/99)): Candy Crush Saga e Plants vs. Zombies primeiro (mapa longo e metas em estrelas, o que o Geometry Dash não respondeu), depois o Subway Surfers.

**Depois (M4 e M5)**

13. Lojas e dinheiro ([#98](https://github.com/TARNAGS/resgate-espacial/issues/98), Claude); loja ([#78](https://github.com/TARNAGS/resgate-espacial/issues/78)), Nightmare ([#79](https://github.com/TARNAGS/resgate-espacial/issues/79)), CNPJ ([#64](https://github.com/TARNAGS/resgate-espacial/issues/64)), a P-024 e o ranking justo no lançamento ([#101](https://github.com/TARNAGS/resgate-espacial/issues/101)).

## Sessões

### 28/09/2026 — Kickoff, documentação base e backlog

- **Kickoff.** O jogo da juventude: uma nave triangular, do tamanho de um cursor de mouse, com gravidade e propulsor, combustível limitado e postos para abastecer; sair da base, à esquerda, resgatar três tripulantes, à direita, e voltar. Objetivo do projeto: treino de PM e portfólio. Um jogador, gratuito, sem lojas.
- **Decisões D-001 a D-010:** sem login; PWA fora das lojas; gratuito, sem anúncios; um jogador; identidade própria; direcional virtual (ideia do Fernando); jogo em inglês; iPhone primeiro; MVP com 3 fases; sem data-alvo.
- **Documentos:** Visão, Regras do jogo, PRD (com pesquisa das limitações do iPhone para PWAs, em fontes oficiais) e Roadmap com os marcos M0 a M3.
- **Backlog no GitHub:** 6 iniciativas, 20 épicos e 18 histórias e tarefas do M0 e do M1, mais 2 retrospectivas, com etiquetas, marcos e modelos de issue.

### 30/09/2026 — Sincronização

- Primeira tentativa de liberar a permissão de Projects no `gh`. Pelo terminal do app não funcionou, porque esse terminal não enxerga o login do `gh`.

### 01/10/2026 — Quadro kanban, decisões do M0 e protótipo 01

- **Permissão de Projects liberada**, com a autorização feita no navegador pelo código de dispositivo do GitHub.
- **Quadro kanban criado.** Colunas: Backlog, Pronto, Em andamento, Em revisão e Concluído. Visualizações: Kanban, Backlog completo e Estrutura. Automações do GitHub: item novo entra no Backlog, issue fechada vai para Concluído.
- **Documentos aprovados:** Visão, Regras do jogo e PRD passaram a v1.0; o Roadmap já estava aprovado.
- **Decisões do M0:**
  - D-011: tecnologia, JavaScript puro com Canvas.
  - D-012: repositório e quadro públicos, sem expor o e-mail pessoal. O histórico foi reescrito com o e-mail noreply do GitHub.
  - D-013: hospedagem no GitHub Pages.
- **Regras novas do Fernando:** fases geradas aleatoriamente, para o replay ser infinito (D-014), e menu com mapa de progresso (D-015). Delas saíram as pendências P-009 e P-010.
- **Protótipo 01 construído e testado.** As regras de pouso, batidas, vidas e pontos de retorno foram simuladas por código. 900 cenários aleatórios foram conferidos: corredor mínimo, plataformas planas e passagem ao lado das pedras.
- **Protótipo publicado no GitHub Pages**, que publica sozinho a cada envio para a main, por HTTPS. O menu foi ajustado para caber no celular na horizontal; na vertical, o jogo pede para girar o celular.
- **E-mail:** a conta do GitHub passou a recusar envios com o e-mail pessoal, e todos os commits passaram a usar o e-mail noreply.

### 01/10/2026 — Trilha de descoberta no quadro

- **Pedido do Fernando:** o quadro só cobria backlog e desenvolvimento. Faltava um lugar para ver o que ele precisa pesquisar sozinho e trazer pronto, sem explorar junto nas sessões.
- **Quadro com duas trilhas (D-016)**, renomeado para "Resgate Espacial — Produto":
  - Descoberta: Caixa de entrada, A investigar, Investigando (no máximo 2) e Para conversar.
  - Entrega: as colunas de antes.
  - Campo "Quem", com Fernando ou Claude.
  - Visualizações novas: Descoberta, Entrega e Minha fila.
  - Item novo agora cai na Caixa de entrada.
- **Modelos de issue Descoberta e Bug**, com a etiqueta `descoberta`. Todos os modelos adicionam a issue ao quadro sozinhos.
- **Oito cartões de descoberta novos**, com o que o Claude precisa que o Fernando responda e as próprias dúvidas do Claude:
  - Sensação do protótipo ([#50](https://github.com/TARNAGS/resgate-espacial/issues/50)).
  - Protótipo como base do M1 ([#51](https://github.com/TARNAGS/resgate-espacial/issues/51)).
  - Nome do jogo original ([#52](https://github.com/TARNAGS/resgate-espacial/issues/52)).
  - Pontuação, P-006 ([#53](https://github.com/TARNAGS/resgate-espacial/issues/53)).
  - Nome final, P-003 ([#54](https://github.com/TARNAGS/resgate-espacial/issues/54)).
  - Referências visuais ([#55](https://github.com/TARNAGS/resgate-espacial/issues/55)).
  - Ferramenta de medição, P-008 ([#56](https://github.com/TARNAGS/resgate-espacial/issues/56)).
  - Som no iPhone ([#57](https://github.com/TARNAGS/resgate-espacial/issues/57)).
- **Cartões existentes que eram descoberta:** #43, #44, #48 e #49 trocaram a etiqueta `tarefa` por `descoberta`.
- **Reflexões do Fernando depois do primeiro teste**, viradas em cartões de descoberta:
  - Enriquecem cartões que já existiam: tutorial vai para o [#48](https://github.com/TARNAGS/resgate-espacial/issues/48), que virou "como o jogo ensina a jogar"; risco de plágio vai para o [#52](https://github.com/TARNAGS/resgate-espacial/issues/52); eventos de medição vão para o [#56](https://github.com/TARNAGS/resgate-espacial/issues/56).
  - Cartões novos: ICP ([#59](https://github.com/TARNAGS/resgate-espacial/issues/59), P-013), obstáculos, mundo e fase ([#60](https://github.com/TARNAGS/resgate-espacial/issues/60), P-011), modificadores ([#61](https://github.com/TARNAGS/resgate-espacial/issues/61), P-012), o que o jogo guarda ([#62](https://github.com/TARNAGS/resgate-espacial/issues/62), P-016), preço e publicação ([#63](https://github.com/TARNAGS/resgate-espacial/issues/63), P-014) e como receber dinheiro e CNPJ ([#64](https://github.com/TARNAGS/resgate-espacial/issues/64), P-015).
  - O modelo Descoberta ganhou o tema "Negócio (público, preço e jurídico)".
  - Um catch: cobrar pelo jogo reabre quatro decisões de uma vez (D-002, D-003, D-012 e D-013). Com o repositório público e o jogo no GitHub Pages, qualquer pessoa joga de graça pelo link.
- **Primeiro teste no iPhone:** o Fernando achou bom e tem retorno para trazer. A [#31](https://github.com/TARNAGS/resgate-espacial/issues/31) foi fechada.
- **Repositório e quadro voltaram a ser privados (D-017)**, a pedido do Fernando, para ninguém ver o que está sendo construído. Até ali, ninguém tinha visitado nem copiado o repositório. No plano gratuito, o GitHub Pages só publica repositórios públicos, então o jogo saiu do ar. O repositório é aberto só nas janelas de teste.


### 02/10/2026 — Novo objetivo e quadro em ordem de prioridade

- **Novo objetivo do Fernando:** os testes engajaram e as pessoas gostaram. O jogo continua como portfólio, mas a ideia é avançar até onde der, inclusive publicar na App Store e no Google Play e ganhar dinheiro com ele, seja com compras dentro do jogo, seja com a venda do jogo. O modelo de cobrança ainda está em aberto. Isso foi registrado no [#63](https://github.com/TARNAGS/resgate-espacial/issues/63) e vai revisar o D-002 (fora das lojas) e o D-003 (gratuito).
- **Cartão novo, com o Claude:** como levar o jogo às lojas ([#65](https://github.com/TARNAGS/resgate-espacial/issues/65)): empacotamento, regras da Apple para apps feitos em web, contas de desenvolvedor e compras dentro do app.
- **Quadro reordenado de cima para baixo por prioridade**, nas colunas "A investigar" e "Backlog". Critério: primeiro o que destrava a construção (fechar o M0 e o M1), depois as decisões que mudam a base técnica por causa das lojas e da cobrança (P-014, #65, ICP e risco de plágio), depois as regras do jogo do M2 e, por fim, o que só precisa estar pronto perto do lançamento (CNPJ, nome, arte e medição). No Backlog, as histórias do M1 vêm antes dos épicos, e o épico do Android (E-16) subiu para antes dos níveis 4 e 5 (E-12).

### 02/10/2026 — Jogo de verdade e histórias do M1

- **Pedido do Fernando:** construir tudo do Backlog que não precisa de conversa, deixando o jogo pronto para as fases que ainda serão definidas.
- **Pasta [`jogo/`](../jogo/README.md)**, construída a partir do protótipo 01, mas separada em módulos: regras, conteúdo, controles, desenho, telas e aparelho. O protótipo continua em [`prototipos/`](../prototipos/README.md), como referência.
- **Conteúdo virou dado:** mundos e níveis numa tabela, catálogo de obstáculos (por enquanto, só a pedra) e modificadores (gravidade, tanque, vento e nave mais pesada na volta), ainda sem uso em nenhum nível até P-011 e P-012 serem decididas.
- **Pronto para o que está em aberto:** a pontuação (P-006) está num arquivo só e cada partida já guarda tempo, vidas perdidas e combustível; o armazenamento (P-016 e lojas) também está num arquivo só e tem versão; as regras avisam o que acontece por eventos, que a medição (E-17) vai usar.
- **Histórias e tarefas do M1:** gravidade (#32), propulsor (#33), embalo (#34), cenário de treino (#35), parâmetros num lugar só (#36), teclado (#37), direcional (#38), direcional onde o polegar tocar, na metade esquerda (#39), toque sem rolar nem dar zoom (#40), roteiro de teste (#41, documento 07) e painel de ajuste escondido (#42). O direcional fixo no canto também existe, como variante para o teste (#44).
- **29 testes automáticos**, com os critérios de aceite e as regras do documento 02, e 1.500 cenários aleatórios conferidos (500 por nível). Conferido no navegador do Claude Code, no tamanho de computador e de celular na horizontal.
- **Correção:** o título do menu aparecia colado no celular (RESGATEESPACIAL), um defeito que já existia no protótipo.

### 02/10/2026 — Retorno do primeiro teste no iPhone (#50)

- **Ficou como está:** gravidade, força do propulsor (inclusive a freada apontando para o lado oposto) e tempo de abastecimento. Abastecer não pode ficar lento, porque a velocidade para concluir a fase é o desafio de quem joga muito.
- **Giro no toque:** 480 → 420 °/s, um pouco mais lento só no celular. A escolha final entre 3 opções virou a história [#66](https://github.com/TARNAGS/resgate-espacial/issues/66).
- **Pouso no celular:** folga de 8 unidades além da borda da plataforma (parâmetro novo, `padMargin`).
- **Aviso de pouso mais evidente:** perto de uma plataforma, a nave ganha um halo e as luzes da plataforma acendem, verdes quando dá para pousar e vermelhas quando a nave está rápida ou inclinada demais.
- **Dedo em cima da plataforma:** a câmera agora passa das pontas da fase, para a base e a tripulação ficarem no meio da tela, longe do polegar. O direcional volta a aceitar toque na tela inteira, como no protótipo testado; a #39 propunha só a metade esquerda. Quando o polegar cobre a plataforma de destino, o jogo ensina uma vez que dá para tocar em qualquer lugar.
- **Regras do jogo v1.2:** folga na borda da plataforma e área do direcional na seção 13.
- **Ajuste do aviso de pouso, depois de um teste do Fernando:**
  - O halo e a nave verde aparecem só na descida para uma plataforma, não mais na decolagem. As luzes da plataforma, aprovadas, ficaram como estavam.
  - O halo ficou quase imperceptível (fino, transparente e pulsando devagar): uma sugestão, não um aviso obrigatório.
  - O verde agora é uma promessa. Antes, ele olhava a velocidade do momento, mas a gravidade continuava acelerando a nave até o toque, então dava para ficar verde e explodir. Agora ele prevê a velocidade e o ponto de toque se o jogador soltar os controles. Um teste com 2.000 descidas sorteadas confere que nenhum verde termina em explosão.
- **Pontas da fase mais bonitas:** além da base e da tripulação, a caverna continua só como cenário, apagada e sem colisão, e uma barreira de energia tracejada marca o limite. Antes era um bloco liso e vazio. O cronômetro também saiu de baixo do botão T do painel de ajuste.
- **Gravidade no PC e no celular:** o valor é o mesmo (55). A diferença de sensação vem do controle: no toque, o mesmo dedo aponta e acelera, então não dá para virar a nave sem acionar o propulsor. As opções foram levadas ao Fernando.
- **Três controles de toque para comparar (#44):** A, tocar e segurar (o original); B, mirar antes de acelerar (arrasto curto só aponta e o propulsor acende ao passar da linha tracejada do anel); C, dois polegares (esquerdo aponta, direito acelera, com um botão desenhado no canto). Troca em Settings → Touch control ou pelo endereço (`?control=b`). O roteiro de teste ganhou a tarefa 5 e a pergunta 7.
- **Retorno dos controles:** o Fernando gostou do A e do C e descartou o B, porque o propulsor demorava a responder entre tocar e arrastar. O B saiu do jogo; um B que tenha ficado salvo no aparelho volta sozinho para o A.
- **C com colunas laterais:** no C, o polegar direito ficava em cima da fase. Agora a fase ocupa a faixa central e cada lado ganha uma coluna de controle (AIM e THRUST), num painel escuro com marcas discretas, como uma cabine. O HUD, as mensagens e a seta do objetivo ficam dentro da faixa da fase. O preço é ver menos da fase na largura: num celular de 740 pontos, a faixa fica com cerca de 490.
- **C de volta à tela cheia:** com as colunas, a fase ficou pequena demais. O Fernando definiu a regra: o botão pode ficar por cima da fase, mas a nave nunca pode ir para baixo do dedo. As colunas saíram, os botões ficam transparentes por cima da fase, e a câmera mantém a nave na faixa da tela entre os dois polegares, mesmo que precise mostrar um pouco além das pontas da fase.
- **Regra do melhor caminho (D-018), definida pelo Fernando:** em toda fase com posto, a melhor corrida conclui sem abastecer e chega quase sem combustível. Para isso existe um **piloto automático** que joga cada cenário gerado com a física e as regras do jogo (mapa do espaço livre, rota mais suave e com folga, voo em várias velocidades de cruzeiro) e fica com a corrida mais econômica. O tanque é essa corrida mais uma folga pequena (6% no nível 3, 4% na PRACTICE). Se o piloto não conclui, o gerador troca a semente. Achado no caminho: com o tanque antigo de 26 segundos, quase nenhum cenário do nível 3 dava para fazer sem abastecer (a melhor corrida gastava cerca de 31).
- **PRACTICE, a fase mais difícil do jogo:** desafio fora da sequência, sempre liberado no mapa (planeta vermelho). Corredor de 140, 22 pedras com 64 de passagem e posto no meio. O treino simples de decolar e pousar, que se chamava PRACTICE, virou **TRAINING**.
- **50 testes automáticos**, entre eles a reprodução da melhor corrida numa partida de verdade, com o tanque real: conclui sem abastecer e sobra o esperado (cerca de 5,7% no nível 3 e 3,8% na PRACTICE).
- **Regularização:** cartões validados pelo Fernando fechados (#32 a #34, #36 a #38 e #51), cartões novos para a D-018 (#67) e a PRACTICE (#68), e "Onde paramos" reescrito.

### 02/10/2026 — Big picture do jogo

- **O que o Fernando trouxe:**
  - O jogo não tem enredo, mas precisa de replay alto e muitas fases.
  - Vários mundos de 10 fases, cada um com visual próprio e um documento de design.
  - Loja de itens no menu, com modificadores de jogo e de nave, comprados com dinheiro real ou com moedas do jogo.
  - Abertura em três telas antes da primeira fase.
  - O jogo vai ser publicado nas lojas; ainda não decidiu se vai cobrar.
  - O MVP continua com 3 fases: tudo isso é o big picture.
- **Decisões:**
  - D-019: publicar na App Store e no Google Play. Substitui a D-002 e revê a D-003 ("sem anúncios" continua).
  - D-020: mundos de 10 fases com identidade visual própria. Responde a parte "mundo e fase" da P-011.
- **Pendência nova:** P-017, o que a loja vende, com que moeda e como evitar "pague para ganhar" ([#78](https://github.com/TARNAGS/resgate-espacial/issues/78)). A P-014 passou a ser só "cobrar ou não".
- **Documentos:**
  - Visão 1.2: objetivo de negócio, princípios "sem enredo" e "replay alto", hipóteses H4 e H5, seção 8.3 de big picture.
  - Regras 1.4: mundos, curva do Mundo 1 e abertura na seção 10.1.
  - PRD 1.4: RF-18 a RF-22, todos com prioridade "Depois".
  - Roadmap 1.4: M4 e M5 em proposta.
  - Documento novo, o 08 (Design de mundos), com o modelo e o rascunho do Mundo 1.
- **Backlog:**
  - Marcos M4 e M5.
  - Iniciativas I-07 (#69) e I-08 (#70).
  - Épicos E-21 a E-25 (#71 a #75).
  - História da abertura (#76), tarefa do design de mundos (#77, concluída) e descoberta da loja (#78).
  - A pesquisa das lojas (#65) virou sub-issue do E-25.
- **Catches levados ao Fernando:**
  - Itens que facilitam o jogo afetam os recordes e a regra do melhor caminho, que calcula o tanque com a nave básica.
  - Sem login, moedas e compras ficam no aparelho.
  - A ordem "lojas antes de mundos" é uma proposta, e a decisão é dele.

### 02/10/2026 — Prévia da abertura (#76)

- **Pedido do Fernando:** ver a abertura funcionando, e ela precisa poder ser pulada.
- **Construída** em `jogo/src/render/intro.js`, desenhada no Canvas no estilo do jogo, com arte provisória:
  - tela 1: a nave da tripulação cravada no chão, com fumaça e faíscas, a tripulação em apuros, uma bandeira de SOS e um SOS em código Morse baixinho;
  - tela 2: a base, a nave do jogador e o sinal de socorro chegando na antena;
  - tela 3: a nave decola e a tela escurece até a fase.
- **Como funciona:** os textos aparecem letra por letra; tocar completa o texto ou avança; SKIP (ou Esc) pula tudo. Ela aparece sozinha só no primeiro PLAY e pode ser revista em Settings → WATCH INTRO, ou com `?intro` no endereço.
- **Na regra (documento 02, seção 10.1):** "dá para pular" passou a Definido; o resto segue em Proposta.
- **Música da abertura**, a pedido do Fernando (aventura, mistério e, no fim, "vamos lá!"):
  - chiptune de estilo 16 bits, sintetizada no navegador, sem arquivos de áudio: ondas de pulso, baixo em onda triangular, bateria de ruído e eco curto;
  - três partes que acompanham as telas: mistério em lá menor (Am, F, Dm, E), aventura com bateria (F, G, E, Am) e o final em dó maior (F, G, C), com subida rápida, rufar de caixa e prato;
  - o SKIP pula direto para o final, que termina sozinho uns 8 segundos depois;
  - o motor fica em `jogo/src/platform/music.js` e a partitura em `jogo/src/content/songs.js`, para dar para ajustar notas e acordes sem mexer no motor.
- **Ajuste depois do teste do Fernando:** a música estava longa, não acompanhava as telas e continuava depois do SKIP.
  - Agora a música é o **relógio da abertura**: uma peça única de 12 segundos (6 compassos a 120 bpm), 2 compassos por tela. A tela troca quando a música troca de parte.
  - No último compasso, a tela e a música escurecem juntas, e a fase começa quando a música acaba.
  - Tocar completa o texto; tocar de novo pula de tela, e a música pula junto, na batida seguinte.
  - O SKIP para a música na hora.
  - Os bipes de SOS em Morse saíram, porque competiam com a música.
  - Link de teste direto: `?intro` abre uma tela "TAP TO START" (o navegador só libera o som depois de um toque) e, em seguida, a abertura, terminando na fase.

### 02/10/2026 — Teste com um amigo e duas ideias novas

- **Janela de teste aberta** para um amigo do Fernando jogar em https://tarnags.github.io/resgate-espacial/jogo/. O Fernando vai contar o retorno depois.
- **Ideias que vieram do teste**, registradas como descobertas para o Fernando detalhar:
  - **Modo Nightmare (P-018, [#79](https://github.com/TARNAGS/resgate-espacial/issues/79)):** morrer não devolve o combustível. Catch: a nave reaparece pousada na base, que abastece; o modo precisa dizer o que acontece com a base e o posto.
  - **Elogios na tela ([#81](https://github.com/TARNAGS/resgate-espacial/issues/81), história no E-10, M2):** "CLOSE CALL!" ao passar raspando de um obstáculo, "GREAT SAVE!" ao frear no limite antes de bater, além de pouso perfeito e corrida perfeita. Critérios em Proposta; falta decidir se o elogio também dá pontos ou moedas. **Construído no mesmo dia**, a pedido do Fernando, discreto (texto pequeno verde perto da nave, que sobe e some) e com uma nota só por elogio (`jogo/src/core/praise.js`). A corrida perfeita também aparece na tela de resultado. Limites no painel de ajuste ("Praise: ...").
  - **Ranking de tempos (P-019, [#80](https://github.com/TARNAGS/resgate-espacial/issues/80)):** catches: sem login nem servidor (D-001), cenários sorteados tornam tempos incomparáveis (D-014) e tempos falsos são fáceis de mandar. Saídas propostas: rankings do Game Center e do Google Play Games, e um desafio do dia com a mesma semente para todos.

### 02/10/2026 — Decisões do teste com amigos, para construir depois

- **Contexto:** os créditos do Fernando estavam acabando; tudo foi registrado como decisão e história, sem construir.
- **D-021:** fases com cenário fixo, iguais para todos (os jogadores gostaram de comparar tempos); fase **BONUS** nova, sorteada a cada partida.
- **D-022:** o controle de dois polegares vira o principal (**A**); o de um polegar vira a opção **B**. Fecha a #44.
- **D-023:** nas fases com posto, abastecer pelo menos uma vez é obrigatório (na ida ou na volta). Revê a D-018.
- **Dificuldade:** com o controle novo, o jogo ficou mais fácil; subir um pouco os níveis 1 a 3 e mais a PRACTICE.
- **Histórias em "Pronto", com o Claude, nesta ordem:** [#82](https://github.com/TARNAGS/resgate-espacial/issues/82) controle, [#83](https://github.com/TARNAGS/resgate-espacial/issues/83) abastecer obrigatório, [#84](https://github.com/TARNAGS/resgate-espacial/issues/84) fases fixas, [#85](https://github.com/TARNAGS/resgate-espacial/issues/85) dificuldade (depende das três anteriores) e [#86](https://github.com/TARNAGS/resgate-espacial/issues/86) fase BONUS.
- **Documentos 01 a 04 ainda não foram atualizados** com essas decisões; cada história lista o que atualizar.

### 02/10/2026 — Construção das decisões do teste com amigos

- **[#82](https://github.com/TARNAGS/resgate-espacial/issues/82) Controle (D-022):** o de dois polegares virou o **A**, padrão; o de um polegar virou o **B**, opção. Quem já tinha escolhido continua com o mesmo controle. `?control=a` e `?control=b` seguem os nomes novos.
- **[#83](https://github.com/TARNAGS/resgate-espacial/issues/83) Abastecer obrigatório (D-023):** o piloto automático agora voa também as rotas com o posto (base, posto, tripulação, base, e base, tripulação, posto, base). O tanque é o maior dos dois planos com um abastecimento, mais 8% (5% na PRACTICE), e precisa ser menor que a corrida sem abastecer; senão, o gerador troca o cenário. Sem abastecer, o nível 3 gastaria 118% do tanque e a PRACTICE 132%. PERFECT RUN agora é "um abastecimento e nenhuma vida perdida".
- **[#84](https://github.com/TARNAGS/resgate-espacial/issues/84) Fases fixas (D-021):** níveis 1 a 3 com as sementes 101, 202 e 303, e a PRACTICE com a primeira semente com caminho provado. Saíram os textos de "cenário novo a cada partida".
- **[#85](https://github.com/TARNAGS/resgate-espacial/issues/85) Dificuldade:** níveis 1 a 3 um pouco mais difíceis (corredores menores, mais relevo, mais pedras, menos espaço para passar). A PRACTICE ficou bem mais difícil: corredor de 125, 26 pedras e 56 de passagem.
- **[#86](https://github.com/TARNAGS/resgate-espacial/issues/86) BONUS (D-021):** quinta fase, sorteada a cada partida, com posto e recorde separado, no mapa ao lado da PRACTICE.
- **62 testes automáticos**, incluindo a reprodução numa partida de verdade dos dois planos com um abastecimento (na ida e na volta), nas fases com posto.
- Os cartões foram para "Em revisão": falta o Fernando jogar e aprovar a dificuldade nova.

### 02/10/2026 — Sincronização e documentação

- Documentos revistos com as decisões do dia: Visão 1.3, PRD 1.5, Roadmap 1.5, `CLAUDE.md` e README do projeto. "Onde paramos" reescrito.
- A arte de divulgação para os playtesters (`resgate-espacial-playtest.jpg`) tinha entrado sem querer no commit 48f0a98 (o `git add -A` pegou o arquivo). Como não tem nada sensível, ficou no repositório, movida para a pasta `divulgacao/`.

### 02/10/2026 — Nickname e ranking ([#87](https://github.com/TARNAGS/resgate-espacial/issues/87), D-024)

- **Pedido do Fernando:** com até 10 playtesters, um nickname antes da abertura, salvo como ID do jogador, e um ranking de todas as fases no menu, sempre atualizado quando o jogador fizer um tempo melhor, inclusive voltando com o mesmo nick.
- **Construído:** tela PILOT NAME depois do PLAY (ou ao trocar em Settings → PILOT), botão RANKING no menu com abas por fase, os 10 melhores, o nick de quem joga destacado e o controle usado. Só um tempo melhor substitui o anterior. 68 testes, com um banco online simulado: mesmo nick em dois aparelhos, fila sem rede.
- **Falta o banco online:** sem ele, cada aparelho tem o seu ranking. Proposta: Firebase Realtime Database (gratuito), criado pelo Fernando; o endereço vai em `jogo/src/config/online.js`.
- **O que pode quebrar o ranking**, levado ao Fernando: sem banco, nada é compartilhado; sem senha, dá para usar o nick de outro; tempos falsos são possíveis; mudar a fase começa um ranking novo (de propósito); painel de ajuste alterado não envia tempo; a BONUS é sorteada, então mede sorte também; controles diferentes no mesmo ranking.

### 02/10/2026 — Ranking online ligado

- **Firebase criado** a pedido do Fernando, com o Claude conduzindo e o Fernando entrando só com o login do Google e aceitando os termos: projeto `resgate-espacial`, **sem Google Analytics** e sem o programa de desenvolvedores (as opções que compartilham menos dados), Realtime Database em us-central1, no plano gratuito.
- **Banco:** https://resgate-espacial-default-rtdb.firebaseio.com, ligado em `jogo/src/config/online.js`.
- **Regras do banco** (em vez do "modo de teste", que expira em 30 dias): qualquer um lê o ranking; só dá para gravar em `scores/<fase>/<NICK>` um tempo válido, de nick válido, e só se for melhor que o anterior; apagar é proibido; o resto do banco fica fechado.
- **Testado pelo terminal e pelo navegador:** ler, gravar, tempo pior recusado, tempo melhor aceito, nick inválido e campo estranho recusados, apagar recusado. O jogo agora entende a recusa do banco como "não era melhor" e não fica tentando de novo.
- **Dados de teste:** duas entradas (TESTE e BROWSER) ficaram numa fase falsa, `scores/teste_abc1`, que não aparece no jogo. Não foram apagadas porque apagar dados é com o Fernando (pelo console do Firebase, aba Dados), e as regras proíbem apagar pela internet.
- 69 testes automáticos.

### 02/10/2026 — Revisão do ranking antes dos playtesters

- **Bug evitado:** as fases fixas rodavam o piloto automático no aparelho de cada jogador para calcular o tanque. Navegadores diferentes (Safari e Chrome) podem arredondar seno e cosseno de jeitos levemente diferentes, e numa simulação longa isso poderia mudar o tanque ou até trocar o cenário num aparelho e não no outro, misturando tempos de fases diferentes no mesmo ranking. **Correção:** o tanque das fases fixas foi calculado uma vez e gravado (`generator.tank`, em `jogo/src/content/worlds.js`); o jogo não roda mais o piloto nelas (a fase abre em 2 ms). Um teste confere que o cenário rápido é idêntico ao provado pelo piloto. Só a BONUS, sorteada, ainda roda o piloto no aparelho.
- **Fila sem internet:** os tempos também são reenviados quando a internet volta e ao abrir o RANKING (antes, só ao reabrir o jogo).
- **Aviso NEW BEST** só aparece na tela de resultado da fase certa, mesmo se a rede demorar.
- **Tela de nickname** com BACK (volta ao menu ou a Settings).
- **Chaves dos rankings** (mudam se a fase mudar): w1-1_1ariu3i, w1-2_1wyelcg, w1-3_a8xzz6, além da PRACTICE e da BONUS.
- 70 testes. Conferido no site público: ranking online, vazio, pronto para os playtesters.

### 02/10/2026 — Telemetria das partidas ([#88](https://github.com/TARNAGS/resgate-espacial/issues/88), D-025)

- **Pedido do Fernando:** com o Firebase no ar, guardar o que ajuda a melhorar o jogo e registrar as partidas e as fases do protótipo.
- **O que o Firebase faz e o que não faz:** o jogo roda inteiro no aparelho, então o banco não o deixa mais rápido. Ele serve para **medir**: quadros por segundo, engasgos e o pior quadro em cada tentativa, tempo de carregamento e tempo para abrir a fase, por tipo de aparelho.
- **Construído:** fila de eventos no aparelho, envio em lotes (um pedido a cada 40 eventos, a cada 20 s, ao fim de cada tentativa e ao sair do app), com a fila guardada sem internet. Eventos de sessão, início e fim de cada tentativa, cada morte (motivo e posição), abertura (pulou e em que tela), ranking aberto e saída no meio da fase.
- **Aviso na tela do nick:** no playtest, o nick, os tempos e como cada partida acontece são salvos online.
- **Regras do banco** ampliadas: em `telemetry`, só entram eventos novos, planos e com os campos certos; reescrever, apagar e ler a raiz do banco continuam proibidos. Conferido pelo terminal.
- **Relatório** no terminal, por fase: tentativas, % de conclusão, fim de jogo e desistência, tempo mediano e melhor, mortes por tentativa, abastecimentos, corridas perfeitas, motivos e trechos das mortes e elogios; por aparelho: quadros por segundo e engasgos; e quantos pulam a abertura e em que tela.
- **Bug pego no teste:** o teste de ponta a ponta no computador gravou um tempo de teste (CLAUDETEST, 47,3 s no nível 2) no ranking real. O Claude não apaga dados; o Fernando apaga pelo console. Para não repetir, o jogo rodando em `localhost` não manda tempos ao ranking real (`?online` liga, se precisar), e o relatório ignora as sessões locais.
- 75 testes automáticos.

### 03/10/2026 — Primeira análise do playtest com telemetria

- **Pergunta do Fernando:** deu para medir algo com os eventos das partidas novas? **Sim:** 840 eventos de 6 jogadores, 23 sessões e 229 tentativas, numa noite (02/10, 19h30 às 0h10). Análise completa no novo [documento 09](09-resultados-dos-playtests.md), sem nicknames (o repositório está público).
- **Métricas da Visão:** 47 resgates concluídos; ativação 5 de 6 (meta: 50%); 3 ou mais partidas na primeira sessão, 6 de 6 (meta: 40%); ninguém instalou na Tela de Início.
- **Achados:**
  1. **A D-023 não segura jogadores reais:** no nível 3, 5 das 9 conclusões não abasteceram (3 sem morrer) e o melhor tempo foi sem abastecer. As pessoas fazem a fase inteira com uns 23 s de propulsor; o piloto automático que calcula o tanque precisa de 39 s (31 s só para um trecho abastecendo). Vira a P-020 ([#89](https://github.com/TARNAGS/resgate-espacial/issues/89)).
  2. **Pousar na tripulação é a maior dificuldade:** 66% das mortes do nível 1 são perto da plataforma da tripulação, que fica a 150 px da parede do fim (22 mortes na parede).
  3. **Um jogador travou no nível 1:** 30 partidas, 91 mortes e 31 minutos sem embarcar a tripulação nenhuma vez. Com o achado 2, vira a P-021 ([#90](https://github.com/TARNAGS/resgate-espacial/issues/90)).
  4. **Com o ranking, quem disputa tempo joga com uma vida só:** 120 recomeços logo depois de morrer, com mediana de 0,9 s.
  5. **Performance sem problema:** 60 quadros por segundo no iPhone e no Android, engasgos perto de 0%, carregamento de 1 a 1,4 s.
  6. Ranking aberto 33 vezes; o controle A em 217 das 229 tentativas; PERFECT LANDING apareceu 1 vez só (critério estrito demais).
- **Correção durante a análise:** a primeira conta do nível 1 (56% das mortes na tripulação) usou o total errado de mortes; o número certo, com a área de até 200 px da plataforma, é 66%.
- **Relatório melhorado:** separa o recomeço depois de morrer, mostra tentativas até a primeira conclusão por jogador e as conclusões sem abastecer.
- **Cartões novos:** P-020 ([#89](https://github.com/TARNAGS/resgate-espacial/issues/89)) e P-021 ([#90](https://github.com/TARNAGS/resgate-espacial/issues/90)) em "Para conversar", para o Fernando; tarefa de medição ([#91](https://github.com/TARNAGS/resgate-espacial/issues/91)) no Backlog, para o Claude.

### 04/10/2026 — Decisões do playtest (D-026 a D-028) e revisão da raia "Para conversar"

- **Mac sincronizado com o Windows:** e-mail noreply nos commits, projeto clonado e `gh` com o escopo `project`.
- **Ranking analisado com a telemetria:** TARNAG (o Fernando) é o 1º nos níveis 1 a 3 e na PRACTICE. As duas corridas sem abastecer que derrubaram a D-023 são dele: nível 3 em 40,3 s, com 32% do tanque no fim (22,6 s de propulsor), e PRACTICE em 48,5 s, com 23% no fim (25,1 s).
- **P-020 → D-026:** a física deixa economizar combustível, acendendo o propulsor e deixando a gravidade levar a nave, e isso é parte da diversão. Nenhuma regra obriga a abastecer; o posto tem que ser uma salvação. O piloto automático vai aprender a voar assim ([#92](https://github.com/TARNAGS/resgate-espacial/issues/92)), e o tanque vai ser recalculado ([#93](https://github.com/TARNAGS/resgate-espacial/issues/93)).
- **Achado da conta dos trechos:** com o posto no meio, quem abastece uma vez ainda faz de 72% a 79% da rota com um tanque (abastecendo na ida e na volta, de 44% a 56%). A janela para o tanque fica estreita; a posição do posto e as folgas são perguntas para o Fernando na #93.
- **P-021 → D-027:** o Fernando assistiu ao jogador que travou e viu que o problema era entender quando soltar e quando apertar o propulsor, não o pouso. As regras de pouso ficam como estão; o ensino do propulsor foi para a P-009 ([#48](https://github.com/TARNAGS/resgate-espacial/issues/48)).
- **Cartões:** #89 e #90 fechados com as decisões; #92 em "Pronto" e #93 no "Backlog", com o Claude; #91 ganhou o combustível por trecho e o ranking no relatório; comentários na #48 e na #83.
- **CLAUDETEST:** continua no ranking do nível 2. O Claude não apaga dados; o Fernando apaga pelo console do Firebase.
- `CLAUDE.md` do projeto: nova seção "Análise dos playtests" (sempre olhar o ranking; o nick do Fernando é TARNAG).
- **Como voa o mais rápido (TARNAG):** acelera forte apontando para a tripulação, deixa a nave ir, vira e freia no sentido contrário; no pouso, toques curtos e solta tudo quando a nave fica verde. "Não me importei com o combustível": ele ficou irrelevante. Isso virou o jeito de voar do piloto novo ([#92](https://github.com/TARNAGS/resgate-espacial/issues/92)) e o aviso NO FUEL perto da nave ([#94](https://github.com/TARNAGS/resgate-espacial/issues/94)).
- **Raia "Para conversar" revisada com as respostas do Fernando nos cartões:**
  - [#43](https://github.com/TARNAGS/resgate-espacial/issues/43) teste com 6 pessoas: divertido, replay alto e apelo casual; o ranking faz diferença; a abertura funcionou. **Critério de saída do M1 atendido.** Saíram [#97](https://github.com/TARNAGS/resgate-espacial/issues/97) (mensagens na frente do voo), [#95](https://github.com/TARNAGS/resgate-espacial/issues/95) (câmera mais próxima) e [#96](https://github.com/TARNAGS/resgate-espacial/issues/96) (direcional por cima da fase). Fechado.
  - [#59](https://github.com/TARNAGS/resgate-espacial/issues/59) ICP → **D-028**: o casual de celular, com o fã do retrô dentro dele; Jetpack Joyride, Subway Surfers, Candy Crush Saga, Plants vs. Zombies e Temple Run viram benchmark ([#99](https://github.com/TARNAGS/resgate-espacial/issues/99)). Visão 1.4. Fechado.
  - [#49](https://github.com/TARNAGS/resgate-espacial/issues/49) já resolvida pela D-021; o Fernando resumiu o núcleo do jogo (dominar a nave e bater tempos), registrado na D-028. Fechado.
  - [#63](https://github.com/TARNAGS/resgate-espacial/issues/63) e [#65](https://github.com/TARNAGS/resgate-espacial/issues/65) juntadas numa pesquisa só de lojas e dinheiro, com sugestão para cada resposta: [#98](https://github.com/TARNAGS/resgate-espacial/issues/98). Fechados.
  - [#62](https://github.com/TARNAGS/resgate-espacial/issues/62): a arquitetura respondeu a maior parte; o pedido "salvar no banco que temos" virou a P-022 ([#100](https://github.com/TARNAGS/resgate-espacial/issues/100), em "Para conversar", com recomendação). Fechado.
  - [#80](https://github.com/TARNAGS/resgate-espacial/issues/80): respondida para o playtest pela D-024; o ranking do lançamento virou a história [#101](https://github.com/TARNAGS/resgate-espacial/issues/101) (M4). Fechado.
  - [#48](https://github.com/TARNAGS/resgate-espacial/issues/48): sem tutorial; a ideia é uma corrida gravada antes de jogar, para mostrar o objetivo. O Claude pesquisa os jogos de referência. Voltou para "A investigar".
  - [#52](https://github.com/TARNAGS/resgate-espacial/issues/52): o Fernando não lembra o nome do jogo (revista dos anos 2000, CD ou disquete, menu com vários jogos, talvez uma demo). O Claude pesquisa. Voltou para "A investigar".
  - [#57](https://github.com/TARNAGS/resgate-espacial/issues/57): o jogo já tem som e música; o Claude confere o iPhone com fontes. Voltou para "A investigar".
- **Respostas do Fernando às perguntas finais:** o posto será decidido vendo os números (a [#92](https://github.com/TARNAGS/resgate-espacial/issues/92) mede o posto no meio e a 75%); sem combustível na tripulação, o NO FUEL pisca uns 2 s e depois a nave explode ([#94](https://github.com/TARNAGS/resgate-espacial/issues/94)); o LOW FUEL será decidido por um mockup (duas imagens com o desenho real do jogo, mostradas no chat). Escolha: dois avisos, um LOW FUEL amarelo rápido e sutil aos 20% e um vermelho piscando, mais incisivo, aos 10%, sem atrapalhar a visão da fase e da plataforma ([#94](https://github.com/TARNAGS/resgate-espacial/issues/94)); P-022 → **D-029**, salvar no banco tudo o que der para medir ([#102](https://github.com/TARNAGS/resgate-espacial/issues/102) e [#91](https://github.com/TARNAGS/resgate-espacial/issues/91); [#100](https://github.com/TARNAGS/resgate-espacial/issues/100) fechado).

- **Pesquisas feitas, a pedido do Fernando ("primeiro as pesquisas"):**
  - [#57](https://github.com/TARNAGS/resgate-espacial/issues/57) som no iPhone: o som só começa depois de um toque, o que o jogo já respeita; a chave de silencioso cala o jogo por padrão (sessão `ambient`, fontes da MDN e da Apple); falha encontrada no retorno depois de ligação ou Siri (estado `interrupted`) → tarefa [#103](https://github.com/TARNAGS/resgate-espacial/issues/103). Decisão do silencioso com o Fernando.
  - [#48](https://github.com/TARNAGS/resgate-espacial/issues/48) como ensinar: nenhum dos 5 jogos de referência usa tela de instruções; todos deixam o objetivo óbvio na primeira imagem e ensinam no momento certo, com poucas palavras (Plants vs. Zombies: no máximo oito palavras na tela). Proposta: a DEMO, uma corrida gravada pelo piloto automático, como o attract mode dos arcades.

- **Decisões das pesquisas:** **D-030**, respeitar o silencioso do iPhone e misturar com a música do jogador, com aviso em Settings ([#103](https://github.com/TARNAGS/resgate-espacial/issues/103); [#57](https://github.com/TARNAGS/resgate-espacial/issues/57) fechado). **D-031**, sem tutorial: DEMO antes da primeira partida e no mapa ([#104](https://github.com/TARNAGS/resgate-espacial/issues/104)), attract mode já no MVP ([#105](https://github.com/TARNAGS/resgate-espacial/issues/105)) e nenhuma oferta de ajuda depois de fins de jogo seguidos ([#48](https://github.com/TARNAGS/resgate-espacial/issues/48) fechado, P-009 resolvida). Regras do jogo 1.6.

### 04/10/2026 — Construção das melhorias (versão 2026-10-04a)

O Fernando pediu "pode codar todas as melhorias". Construído, testado (92 testes, 17 novos) e conferido no navegador, em tamanho de celular:

- **Piloto expert** ([#92](https://github.com/TARNAGS/resgate-espacial/issues/92), D-026): voa como o TARNAG, acelerando forte, deixando a nave ir, freando forte e deixando cair no pouso. Sem abastecer, gasta **20,8 s** no nível 3 (o TARNAG gastou 22,6 s; o piloto cauteloso, 39,4 s) e **24,5 s** na PRACTICE (TARNAG: 25,1 s). Passou no critério do cartão, mas não na meta de ficar 10% abaixo. A ferramenta `medir-tanque.mjs` mostra a janela do tanque: com o posto no meio, sobra uns 25%; com o posto a 75% do caminho, uns 40%. O tanque ainda sai do piloto cauteloso, até a [#93](https://github.com/TARNAGS/resgate-espacial/issues/93).
- **Avisos de combustível** ([#94](https://github.com/TARNAGS/resgate-espacial/issues/94)): LOW FUEL amarelo e sutil aos 20%, LOW FUEL! vermelho piscando abaixo de 10%, os dois ao lado da barra; NO FUEL pequeno acima da nave. Pousada sem combustível na tripulação, a nave avisa por 2 s antes de explodir.
- **Som** ([#103](https://github.com/TARNAGS/resgate-espacial/issues/103), D-030): volta depois de ligação ou Siri (estado `interrupted`); aviso do modo silencioso em Settings, só no iPhone e no iPad.
- **Mensagens** ([#97](https://github.com/TARNAGS/resgate-espacial/issues/97)): numa faixa no alto, no máximo duas, transparentes se a nave passar por baixo; saiu a mensagem repetida com o nome da fase.
- **Câmera e controles** ([#96](https://github.com/TARNAGS/resgate-espacial/issues/96) e [#95](https://github.com/TARNAGS/resgate-espacial/issues/95)): a câmera para nas pontas da fase, os controles ficam por cima dela e ficam transparentes sobre a nave, e a câmera antiga continua no painel de ajuste para comparar. Zoom de 1 a 1,6 no painel ou com `?zoom=`. Mudar a câmera não tira o tempo do ranking.
- **DEMO** ([#104](https://github.com/TARNAGS/resgate-espacial/issues/104)) e **attract mode** ([#105](https://github.com/TARNAGS/resgate-espacial/issues/105), D-031): o nível 1 jogado pelo piloto expert, 2,5 vezes mais rápido, com rótulos e polegares fantasmas, antes da primeira partida e no botão DEMO; o menu parado por 8 s passa a DEMO ao fundo, e o toque que interrompe não aciona botão.
- **Telemetria** ([#91](https://github.com/TARNAGS/resgate-espacial/issues/91), D-029): propulsor, combustível e tempo de cada trecho, cada pouso, batidas com velocidade e ângulo, elogios com posição, trajetória, pior quadro real e tela da fase. Saídas separadas em recomeçar, menu, trocar de fase e fechar. Um lote recusado pelo banco não leva mais os eventos válidos junto (isso aconteceu num teste local). O relatório traz o ranking com o Fernando destacado, e `mapas-telemetria.mjs` desenha os mapas de calor.
- **Perfil do jogador** ([#102](https://github.com/TARNAGS/resgate-espacial/issues/102), D-029): progresso, configurações, telas vistas e elogios em `players/<NICK>`, sempre ficando com o melhor de cada aparelho. Falta o Fernando publicar a regra do banco.
- **Câmera, revisto no mesmo dia:** testando o zoom, o Fernando viu os controles sobre a nave e a plataforma. Voltou o esquema anterior, com uma área ao lado da fase para os controles no início e no fim; a câmera "controles por cima" ficou só como opção no painel, e a [#96](https://github.com/TARNAGS/resgate-espacial/issues/96) foi fechada como descartada.
- **No ar:** com a janela de teste aberta, o GitHub Pages publica cada envio; os amigos passam a jogar esta versão. Os rankings não mudaram, porque nenhuma fase mudou.

### 05/10 e 06/10/2026 — O jogo original e o benchmark de level design (D-032)

- **Busca do jogo original ([#52](https://github.com/TARNAGS/resgate-espacial/issues/52)):** o Claude varreu a lista do gênero na MobyGames (54 jogos), uns 3.400 jogos Flash do Flashpoint, o texto digitalizado de 33 edições da revista CD Expert e de um CD de 1996 e o fórum Adrenaline, e trouxe 8 candidatos com vídeos. O Fernando reconheceu: "acredito que minha memória tenha misturado as coisas. Eu acho que joguei o Gravitron 2 de 2008 e o Crazy Gravity, mas o jogo que realmente inspirou foi o Crazy Gravity!"
- **Confirmação:** o manual original, no Internet Archive, bate com as pistas: versão shareware com 3 fases (fácil, média e difícil), cópia livre em CD-ROM e disquete, barris e cargas que "somem para dentro da nave". O jogo saiu na coletânea "10 Tons of Games: Mega Collection 1" (1997), com 106 jogos num menu.
- **Direitos:** o autor, Axel Meierhöfer (XLM Software), ainda mantém o site com o jogo e autorizou um remake de fã em 2009. A comparação com o nosso jogo (documento 10, seção 2.3) dá risco de plágio baixo: o parecido é mecânica e regra. A busca no INPI segue com o nome, na [#54](https://github.com/TARNAGS/resgate-espacial/issues/54).
- **D-032:** o Fernando pediu para documentar tudo como benchmark de level design, ao lado dos casuais do ICP, e para mapear as fases do Crazy Gravity com imagens, porque nunca tinha jogado além das 3 da versão de teste.
- **As 18 fases mapeadas:** o Claude decifrou o formato dos arquivos de fase (CGL1) e redesenhou cada fase como mapa esquemático, com uma cor por função, sem executar o jogo. Somadas, as fases têm 75 cargas, 162 barris, 45 chaves, 84 canhões, 73 ventiladores, 48 ímãs, 26 correntes de ar, 51 pares de hastes e 128 portões. A curva é em serrote: picos nas fases 3, 14 e 18 e respiros sem obstáculos na 6 e na 8.
- **Recepção:** 80% na PC Player; 8,43/10 (44 votos) na Home of the Underdogs; jogadores que procuraram o jogo por 20 anos depois de uma demo em CD de revista, como o Fernando.
- **Documentos:** novo [documento 10](10-benchmark-de-level-design.md) (v0.2, com o registro completo da busca: candidatos mostrados e fontes procuradas) e [benchmark do Crazy Gravity](benchmark/crazy-gravity.md) (v1.1, com as imagens em `docs/benchmark/crazy-gravity/`); Visão 1.5 (referências do gênero); D-005 atualizada; D-032. Os arquivos do jogo original não entram no repositório (`.gitignore`).
- **Página de leitura, guardada para inspiração:** a análise com os 18 mapas foi publicada em [claude.ai/artifact/UfYWNwM15P6jd2YPDnReh4](https://claude.ai/artifact/UfYWNwM15P6jd2YPDnReh4) (privada, fixada na barra lateral do Fernando) e guardada no repositório em `docs/benchmark/crazy-gravity/pagina-de-leitura.html`. Ficaram também os números de cada fase (`fases.json`) e as ferramentas, com a especificação do formato de fase e o passo a passo para regenerar tudo (`docs/benchmark/crazy-gravity/ferramentas/README.md`). O Fernando pediu para guardar tudo para usar de inspiração depois.

### 06/10/2026 — Skill de discovery e consulta antes de construir (D-033)

- **Pedido do Fernando:** transformar o método do benchmark do Crazy Gravity em algo automático. Virou a skill global **`discovery-de-jogos`** do Claude Code, que fica no `context-directory` (`setup/claude-global/skills/`) e vale no Mac e no Windows. Ela tem três tamanhos: discovery completo de um jogo, comparativo de vários (o caso da [#99](https://github.com/TARNAGS/resgate-espacial/issues/99)) e consulta rápida, e um modelo de documento com as seções do benchmark do Crazy Gravity.
- **D-033:** "sempre que for construir algo passe pelos nossos estudos de level design e gameplay e valide informações", mas "nunca copie informações, a ideia é se inspirar". A skill ganhou a seção "Antes de construir", e a regra entrou no `CLAUDE.md` do projeto.
- **Próximo teste da skill:** a pesquisa dos casuais do ICP ([#99](https://github.com/TARNAGS/resgate-espacial/issues/99)).

### 06/10/2026 — Benchmark do GraviTron e do Gravitron 2 ([#106](https://github.com/TARNAGS/resgate-espacial/issues/106))

- **Pedido do Fernando:** "estude agora o gravitron 1 e 2". Primeiro discovery completo com a skill `discovery-de-jogos`.
- **Fontes:** o site do autor (Dark Castle Software), preservado no Internet Archive, tinha o GraviTron completo, a demo e a atualização 1.8 do Gravitron 2 e o **código-fonte do Gravitron 2**, que o próprio autor publicou em 2012. O Fernando autorizou cada download. Nada foi executado; do GraviTron, que antivírus já apontaram por adware, só os arquivos de fase foram extraídos. Mais a página do Steam, as 32 avaliações, a GamesRadar e a VidaExtra.
- **Achados principais:** no Gravitron 2, os cientistas **andam até a nave** quando ela pousa na plataforma deles, consertam a nave e valem pontos, mas o resgate é opcional; destruir os reatores dispara **60 segundos de fuga**; bater na parede faz a nave quicar e perder energia, em vez de explodir; o pouso vale em qualquer superfície plana, com a nave alinhada, sem limite de velocidade. A campanha principal sobe uma novidade por fase (terreno, poço, laser e elevador, caverna que gira, lasers em série), e a extra é um serrote em escala muito maior.
- **Formatos:** o do Gravitron 2 veio do código; o do GraviTron, cujo código se perdeu, foi deduzido dos arquivos, até as 26 fases fecharem exatamente. Os significados de alguns objetos do GraviTron ficaram com confiança média ou baixa.
- **Licença:** a demo do Gravitron 2 proíbe engenharia reversa do software. Nenhum programa foi aberto; o documento registra isso.
- **Documentos:** [benchmark/gravitron.md](benchmark/gravitron.md) (v1.0), com 48 imagens, `fases.json` e as ferramentas em `docs/benchmark/gravitron/ferramentas/`; documento 10 v0.3; página de leitura publicada em [claude.ai/artifact/8yu4nX63Xoix8VneHU59bv](https://claude.ai/artifact/8yu4nX63Xoix8VneHU59bv) (privada). O cartão [#106](https://github.com/TARNAGS/resgate-espacial/issues/106) foi para "Para conversar".
- **O que a skill aprendeu:** pedir o ok de cada download antes, ler a licença do jogo, procurar o código-fonte publicado pelo autor (vale mais do que decifrar arquivos) e, no Windows, gerar as imagens pelo PowerShell.

### 06/10/2026 — Benchmark do Jetpack Joyride ([#107](https://github.com/TARNAGS/resgate-espacial/issues/107))

- **O que o Fernando disse:** os Gravitron "são muito semelhantes ao que eu penso enquanto level design": possibilidades de artefatos para gameplay, obstáculos e incrementos de fase. Os jogos modernos são inspiração menos direta, mas "dá para entender um pouco sobre como jogos infinitos funcionam". Pediu o estudo do Jetpack Joyride.
- **Fontes:** o vídeo do próprio criador, Luke Muscat ("How I designed Jetpack Joyride", 2023), lido pela transcrição no navegador do app; os slides da palestra dele na GDC 2012, com texto e imagens; a wiki dos jogadores; as lojas; matérias de 2012. Nenhum arquivo do jogo foi aberto.
- **Achados principais:** a corrida é montada por um **sistema de intervalos** (cada tipo de objeto tem uma probabilidade de ocupar o próximo espaço, a uma distância sorteada entre um mínimo e um máximo); a primeira versão foi chamada de **"chata"** porque a intensidade ficava sempre no alto, e os **veículos** criaram o serrote; perder tem **três custos** (tempo, emoção e atrito para recomeçar), e o jogo reduz cada um; as **três missões que se renovam** levaram três meses e três testes; o placar é **só a distância**, para comparar com os amigos.
- **Documentos:** [benchmark/jetpack-joyride.md](benchmark/jetpack-joyride.md) (v1.0), com quatro diagramas e as ferramentas em `docs/benchmark/jetpack-joyride/ferramentas/`; documento 10 v0.4, com a coluna do Jetpack Joyride nas perguntas da seção 4; página de leitura em [claude.ai/artifact/TjsQe83tBnQbYzsddenUcb](https://claude.ai/artifact/TjsQe83tBnQbYzsddenUcb) (privada). O cartão [#107](https://github.com/TARNAGS/resgate-espacial/issues/107) foi para "Para conversar".
- **O que a skill aprendeu:** em jogo comercial atual, não abrir arquivos do jogo; a melhor fonte é o criador falando (vídeos e palestras); a transcrição do YouTube sai pelo navegador do app; os slides de palestras da GDC costumam estar publicados em PDF.

### 06/10/2026 — Benchmark do Temple Run ([#108](https://github.com/TARNAGS/resgate-espacial/issues/108))

- **Pedido do Fernando:** "Estude agora o temple run". Terceiro uso da skill `discovery-de-jogos`; a skill passou a aparecer sozinha na lista desta sessão.
- **Fontes:** a entrevista em vídeo de Keith Shepherd na GDC 2014, mostrando os três protótipos (transcrição lida no navegador do app); as entrevistas dos 10 anos (Vice, 2021) e a de Natalia Luckyanova à TechCrunch (2012); a wiki dos jogadores; Wikipédia; TouchArcade; lojas. Nenhum arquivo do jogo foi aberto.
- **Achados principais:** o controle por gestos nasceu do fracasso de um jogo com dois controles virtuais; o tema do templo nasceu das paredes de caixas do protótipo; os macacos existem para dar um **motivo para correr**; há **dois tipos de erro** (o tropeço traz os perseguidores para perto, o segundo tropeço ou um erro grande encerram); a pontuação soma um **multiplicador** que cresce com os objetivos, o contrário do placar puro do Jetpack Joyride; o jogo virou grátis "por um fim de semana", ficou grátis e chegou ao 1º lugar sem marketing, com 1% pagando.
- **Documentos:** [benchmark/temple-run.md](benchmark/temple-run.md) (v1.0), com três diagramas e as ferramentas em `docs/benchmark/temple-run/ferramentas/`; documento 10 v0.5, com a coluna do Temple Run nas perguntas da seção 4; página de leitura em [claude.ai/artifact/DatT92pPFFCnnDwG3vLoBZ](https://claude.ai/artifact/DatT92pPFFCnnDwG3vLoBZ) (privada). O cartão [#108](https://github.com/TARNAGS/resgate-espacial/issues/108) foi para "Para conversar".
- **O que a skill aprendeu:** a transcrição do YouTube às vezes não carrega; abrir uma aba nova por vídeo ajuda, e depois de duas tentativas vale seguir com as outras fontes. Comparar com o benchmark anterior do mesmo gênero (seção "× Jetpack Joyride") mostra as escolhas de design com mais clareza.

### 06/10/2026 — Guia dos benchmarks

- **Pedido do Fernando:** "Documente tudo, todos os achados e artifacts criados para que eu consiga ler depois e ter insights."
- **O que foi feito:** [benchmark/README.md](benchmark/README.md) (v1.0), o guia de leitura de todos os estudos: por onde começar, as duas famílias de jogos e a pergunta de cada uma, o mapa de tudo o que foi produzido (documentos, páginas, imagens, ferramentas, cartões e a skill), 12 insights que cruzam os quatro jogos, onde os estudos discordam, o que eles confirmam nas nossas decisões, as 12 recomendações dos cartões #106 a #108 com três para decidir primeiro, as lacunas de cada estudo e a ordem sugerida para os que faltam. Página de leitura em [claude.ai/artifact/TSGis8FXKTXWWgdQUJH9ar](https://claude.ai/artifact/TSGis8FXKTXWWgdQUJH9ar) (privada), com links para as quatro páginas; cópia em `docs/benchmark/pagina-de-leitura.html`. O documento 10 (v0.6) aponta para o guia.
- **Insights principais:** o controle é o maior risco nos quatro jogos; ensinar sem texto funciona, mas precisa ser medido (o Gravitron 2 acrescentou instruções depois do lançamento); os dois casuais fizeram escolhas opostas no placar, o que reforça o tempo puro; o serrote de intensidade aparece entre fases e dentro da corrida; o "casco" do Gravitron e o "tropeço" do Temple Run apontam o mesmo modificador; os quatro jogos foram feitos por times de uma a poucas pessoas.

### 07/10/2026 — Anticheat ([#109](https://github.com/TARNAGS/resgate-espacial/issues/109))

- **Pergunta do Fernando:** lançando o jogo online e com ranking, pessoas podem usar trapaça para bater os recordes; como funcionam os anticheats para jogos como o nosso?
- **O que foi feito:** pesquisa na internet e [documento 11](11-anticheat-e-ranking-justo.md) (v0.1): os tipos de anticheat e quais servem para nós, os casos do Open Hexagon (replay, semente e relógio do servidor), do Trackmania (câmera lenta com replays válidos e falso positivo), do Game Center e do Google Play Games (resolvem o nome, não o tempo) e do speedrun.com, as portas abertas do nosso ranking pela leitura do código, a conferência por replay e uma recomendação em três degraus, com cinco perguntas para o Fernando. Cartão [#109](https://github.com/TARNAGS/resgate-espacial/issues/109), com os achados, em "Para conversar".
- **Achados principais:** a física em passo fixo, a semente fixa e o piloto automático já são a base da conferência por replay; falta deixar seno e cosseno idênticos entre o Safari e o Node e arredondar os comandos. O limite de 0,1 s por quadro do laço principal permite câmera lenta. O mesmo replay daria o "fantasma" do melhor tempo.
- **Registro** (pedido do Fernando: "Documente isso tudo"): pendência nova P-023 (proteção contra trapaça, em três degraus) e P-019 atualizada no registro de decisões; risco "trapaça no ranking" no PRD (1.7); pendências por marco no Roadmap (1.6); o fantasma ligado ao replay nas Regras do jogo (1.7); documento 11 no README e no `CLAUDE.md`; comentários nas [#101](https://github.com/TARNAGS/resgate-espacial/issues/101) e [#98](https://github.com/TARNAGS/resgate-espacial/issues/98) com o que a pesquisa muda nelas; e o portfólio de PM no `context-directory`.

### 07/10/2026 — Épico da abstração ([#110](https://github.com/TARNAGS/resgate-espacial/issues/110))

- **Pergunta do Fernando**, depois de conversar com a esposa: com o jogo crescendo, não dá para reler o código todo a cada mudança. Como quebrar o monólito em partes (abstração) para que mexer na nave, na gravidade ou na colisão não quebre o que aparece na tela?
- **Leitura do código:** o jogo já é dividido por responsabilidade (`config`, `content`, `core`, `render`, `input`, `ui`, `platform`). As regras não importam o desenho nem a tela (conferido). Os obstáculos já têm um contrato, e a partida avisa por eventos.
- **Pegas encontrados:**
  - o formato da nave está em 15 linhas de 4 arquivos, e o desenho já difere do triângulo da colisão;
  - a chave do ranking deixa de fora `boardingSeconds`, `refuelPerSecond`, o giro e os modificadores. Mudar esses valores mudaria os tempos sem recomeçar o ranking (ainda não aconteceu);
  - o `main.js` (751 linhas) e o `renderer.js` (685) viraram mini-monólitos;
  - os testes levam 9 s com 6 fases e crescem a cada fase.
- **O que foi feito:** a pedido do Fernando ("quando esse jogo tiver 10 mundos, com 100 fases, skins (...) as regras básicas não podem quebrar"), o épico E-26 · Abstração na I-01, com 15 tarefas ([#111](https://github.com/TARNAGS/resgate-espacial/issues/111) a [#125](https://github.com/TARNAGS/resgate-espacial/issues/125)), da mais barata à mais cara, em cinco ondas. Princípio: regra é sagrada, aparência é livre, conteúdo é dado. Ondas 1 a 3 no M2, ondas 4 e 5 no M3; tudo no Backlog, com o Claude. Roadmap 1.7.
- **Decisão D-034** (resposta do Fernando à primeira pergunta do épico): nave nova é só aparência, com o casco e os atributos da clássica, e não mexe no ranking, a não ser que se diga expressamente que ela muda o jogo. O épico e as tarefas [#120](https://github.com/TARNAGS/resgate-espacial/issues/120), [#121](https://github.com/TARNAGS/resgate-espacial/issues/121), [#122](https://github.com/TARNAGS/resgate-espacial/issues/122) e [#124](https://github.com/TARNAGS/resgate-espacial/issues/124) foram atualizados. A P-017 foi respondida em parte, com um comentário na [#78](https://github.com/TARNAGS/resgate-espacial/issues/78). Pega registrado: o desenho de uma nave de aparência precisa ficar perto do casco (proposta: folga de cerca de 3 pixels), senão ela passa "por dentro" das pedras.
- **Decisão D-035** (o Fernando aprovou a proposta: "Siga com isso"): evolução que muda atributos (mais propulsor, tanque maior) muda o jogo e mexe no ranking; evolução só visual não mexe. A regra geral fica: o que muda só a aparência nunca mexe no ranking; o que muda o jogo sempre mexe. Pendência nova P-024: como esses tempos aparecem no ranking, e se o tanque provado é recalculado para cada configuração (com tanque maior, o abastecimento obrigatório pode deixar de fazer falta). Atualizados o épico, as tarefas [#120](https://github.com/TARNAGS/resgate-espacial/issues/120) e [#124](https://github.com/TARNAGS/resgate-espacial/issues/124) e a [#78](https://github.com/TARNAGS/resgate-espacial/issues/78).

### 07/10/2026 — Priorização das frentes

- **Pedido do Fernando:** com várias conversas abertas e frentes evoluindo aos poucos, ler tudo o que está pendente e em andamento e priorizar.
- **Leitura:** o quadro (os cartões fora de "Concluído"), este diário, o registro de decisões, o checklist de lançamento do PRD, o Git dos dois repositórios, a telemetria desde 05/10 e as sessões abertas no app.
- **Achados:**
  - **Janela de teste aberta há 5 dias,** com pouco uso: 11 sessões de 3 jogadores desde 05/10.
  - **Trabalho só neste computador:** 8 arquivos do Resgate Espacial e o portfólio no `context-directory` não foram enviados ao GitHub.
  - **Fila "Em revisão" parada:** 23 cartões esperam o Fernando, e mais o [#66](https://github.com/TARNAGS/resgate-espacial/issues/66) em "Pronto".
  - **MVP ainda sem começar:** o app instalável (E-13) e o funcionamento sem internet (E-14) não têm histórias, e o jogo ainda não tem manifesto nem service worker.
- **O que foi feito:** a lista "Próximos passos" foi reescrita em ordem de prioridade (agora, revisão, construção, playtest, MVP, conteúdo, depois).

### 07/10/2026 — Janela de teste fechada e fim da rodada 1

- **Pergunta do Fernando:** ainda tem alguém jogando? A telemetria respondeu que não.
  - Os amigos jogaram pela última vez no domingo, 04/10; depois disso, só o Fernando jogou (05/10).
  - As 8 sessões seguintes têm só a abertura do jogo, provavelmente da aba deixada aberta no navegador.
  - A versão `2026-10-04a` quase não foi jogada pelos amigos.
- **O que foi feito:**
  - **Janela de teste fechada:** repositório privado, o link do jogo dá 404, e a configuração do Pages foi apagada pelo GitHub.
  - **Documento 09 (v0.3):** seção "Como a rodada terminou", com as sessões por dia, sem nicks.
  - **`CLAUDE.md`:** a janela de teste ganhou o passo 0 (combinar começo e fim, patch note, não enviar documentos sobre as fraquezas do ranking com o repositório aberto) e o registro da rodada ao fechar.
- **História nova:** a [#126](https://github.com/TARNAGS/resgate-espacial/issues/126), pedida pelo Fernando para a próxima rodada. É um patch note de uma linha com o que mudou na versão, com botão SKIP (Backlog, M2, dentro do E-10).
- **Achado:** a regra do perfil online ([#102](https://github.com/TARNAGS/resgate-espacial/issues/102)) não estava publicada; o banco recusava `players`. Nada se perdeu: o progresso fica no aparelho e sobe depois da publicação.
- **Pedido do Fernando que voltou para ele:** apagar o CLAUDETEST e publicar a regra do perfil. Apagar dados para sempre e mudar regras de segurança do banco são ações que o Claude não faz pelo console. Ficaram como os passos 1 e 2, com o caminho exato, e o Claude confere pelo terminal depois.

### 07/10/2026 — Revisão do Lean Canvas (P1 a P4)

- **Pedido do Fernando:** revisar as decisões "by the book" com o Business Model Canvas e o Lean Canvas, e conversar sobre os riscos de produto, cliente e mercado; depois, "traga cada um e vamos conversar para revisar", bloco a bloco.
- **Diagnóstico de partida:** só a solução tinha evidência (6 amigos); canais e early adopters vazios; receita em aberto (P-014), com o E-26 já pressupondo uma loja de itens.
- **Fechados:**
  - **P1 Problema:** público-alvo passa a ser adolescentes e jovens com muito tempo de tela que gostam de casuais (o fã retrô vira "acerto por consequência"). Problemas: passar fases difíceis e criativas e ficar bom (o centro); tempo de tela livre; bater o tempo dos outros (amplificador). Fase sem duração fixa, com fases maiores inspiradas no Crazy Gravity e checkpoints a testar.
  - **Anúncios entram**, sem ser tóxicos nem excessivos, e todo anúncio se fecha com facilidade. O anúncio como obstáculo foi descartado. A pesquisa do ECA Digital (em vigor desde 17/03/2026) mostrou o que muda para menores: anúncio sem perfil e loja sem nada sorteado.
  - **P2 Solução:** uma solução por problema; o próximo teste é um protótipo de fase grande com e sem checkpoint; E-26, Nightmare e loja saem da solução e vão para o M2.
  - **P3 Proposta de valor:** "Fácil de pegar, difícil de dominar. A gravidade sempre vence… até você ficar bom."
  - **P4 Métricas:** North Star nova (jogadores que concluem pelo menos uma fase nova na semana), funil com D1 e D7, limites de proteção e metas só depois da linha de base.
- **Cartão novo:** benchmark do Geometry Dash ([#127](https://github.com/TARNAGS/resgate-espacial/issues/127)), sub-issue da [#99](https://github.com/TARNAGS/resgate-espacial/issues/99), em "A investigar", com o Claude.
- **Parou no C1**, com 4 perguntas ([documento 13](13-modelo-de-negocio.md), seção 4.1).
- **Documentos:** documento 13 criado (v0.1, em revisão), README e `CLAUDE.md`.

### 07/10/2026 — Regra do perfil publicada e revisão das filas

- **Regra do perfil ([#102](https://github.com/TARNAGS/resgate-espacial/issues/102)):**
  - o Fernando colou as regras do console, e o Claude devolveu o texto completo, com o bloco `players` acrescentado;
  - o Fernando publicou, e o Claude conferiu pelo terminal, só com leituras e gravações que precisam ser recusadas;
  - a cópia completa das regras publicadas passou a ser `jogo/firebase/regras.json`, que substitui o `regras-players.json`, e o `CLAUDE.md` diz como mudar.
- **Linhas de teste do banco:** ficam (decisão do Fernando: "é só um teste do jogo").
- **Revisão das filas, com perguntas de múltipla escolha** (pedido do Fernando: "tudo que depender de informação minha me envie com o AskUserQuestion"):
  - 22 cartões aprovados e fechados, com um comentário em cada;
  - os épicos E-02 a E-06 fechados;
  - o zoom ([#95](https://github.com/TARNAGS/resgate-espacial/issues/95)) e o perfil ([#102](https://github.com/TARNAGS/resgate-espacial/issues/102)) esperam o teste no iPhone.
- **Para conversar:**
  - anticheat: o degrau 1 não entra agora (D-036), e [#109](https://github.com/TARNAGS/resgate-espacial/issues/109) foi fechada;
  - benchmarks: o Fernando não marcou recomendações e preferiu ler os estudos antes, então [#106](https://github.com/TARNAGS/resgate-espacial/issues/106) a [#108](https://github.com/TARNAGS/resgate-espacial/issues/108) continuam na coluna.
- **Documentos:** registro de decisões (D-036, P-023), Roadmap 1.8, documento 11 v0.3 e este diário.

### 07/10/2026 — Abstração, ondas 1 a 3, e patch note

- **Pedido do Fernando:** "existe alguma tarefa para ser codada? Se sim, code."
- **Ondas 1 e 2** ([#111](https://github.com/TARNAGS/resgate-espacial/issues/111) a [#115](https://github.com/TARNAGS/resgate-espacial/issues/115)):
  - mapa de impacto ([documento 12](12-arquitetura-do-jogo.md), em revisão com o Fernando);
  - teste das camadas;
  - teste de que o desenho só lê, com uma "tela de mentira" que roda no Node;
  - 17 fichas de ouro: 8 rotas do piloto e 9 corridas montadas para bater ou pousar. Com a gravidade de 55 para 56, de propósito, 17 de 18 falharam com mensagens legíveis;
  - o `testes/rodar.js` dividido em arquivos por assunto, com `--rapido` (uns 3 s) e `--atualizar-ouro`.
- **Onda 3** ([#116](https://github.com/TARNAGS/resgate-espacial/issues/116) a [#120](https://github.com/TARNAGS/resgate-espacial/issues/120)):
  - contrato dos eventos, com o canal estrito em todos os testes;
  - contrato da fase e do mundo, com a lista de chaves publicadas;
  - um arquivo por mundo em `content/worlds/`, com o conteúdo idêntico byte a byte;
  - contrato do obstáculo;
  - cadeia de parâmetros em camadas (nave → evoluções → mundo e fase → modo) e a chave do ranking montada sozinha, com `RULES_VERSION`. As cinco chaves de hoje não mudaram.
- **Patch note** ([#126](https://github.com/TARNAGS/resgate-espacial/issues/126), em revisão): faixa no alto do menu, com SKIP, uma vez por versão, só para quem já jogava; o attract mode espera. Versão do jogo `2026-10-07a`. Conferido no navegador do Claude.
- **Defeitos encontrados no caminho:**
  - os limites da pedra eram menores que o desenho (corrigido; só afeta o desenho);
  - `takeoff` e `refuel` não têm quem escute;
  - o exemplo de fase no README usava um campo antigo.
- **Testes:** a bateria completa tem 129 testes (uns 12 s); a rápida, 108 (uns 3 s). Nenhuma regra do jogo mudou.

### 07/10/2026 — Câmera que se adapta à tela (D-037)

- **O servidor do jogo parou** quando o app bateu o limite de uso, e o link do iPhone deixou de abrir. O Claude religou. O endereço certo agora é o do Wi-Fi (192.168.15.159), porque o do cabo (.82) não responde mais.
- **Teste do Fernando:** 1,15 é o melhor zoom (ver a fase e antecipar); 1,3 e 1,45 escondem obstáculos e ficam "punitivistas demais". Ele perguntou se o zoom podia se adaptar à tela.
- **Contas:** deitados, os celulares têm alturas parecidas e a nave fica quase do mesmo tamanho em todos. O que muda é o formato: com 1,15 fixo, o iPhone SE veria 82% do trecho à frente, e o iPad, 67%.
- **Decisão D-037** ([#95](https://github.com/TARNAGS/resgate-espacial/issues/95) fechada): o zoom se adapta à tela (1,15 até 1), e o jogador pode mudar nas configurações. Proposta construída para ele validar: CAMERA AUTO/CLOSE/CLOSER só aproxima. O zoom fixo de teste tira a corrida do ranking.
- **Pega encontrado no teste:** um zoom salvo pelo painel de ajuste passava por cima do automático e tirava as corridas do ranking. O ajuste foi renomeado (`cameraZoomFixed`), e valores antigos deixam de valer sozinhos.
- **Também:** configurações em duas colunas em tela baixa (cabem no iPhone SE), a linha do teclado só aparece com teclado, a telemetria registra o zoom e o texto do patch note passou a citar a câmera. 132 testes passando.

### 08/10/2026 — Benchmark do Geometry Dash ([#127](https://github.com/TARNAGS/resgate-espacial/issues/127))

- **Pedido do Fernando:** "Comece o discovery do Geometry Dash". O cartão tinha nascido na revisão do Lean Canvas (07/10), com a pergunta da fase grande: como checkpoint e ranking convivem. Quarto uso da skill `discovery-de-jogos`.
- **Fontes:** o criador (entrevista à Cult of Mac, 2014; texto dele no Game Developer, 2015; 231 respostas nas duas AMAs do Reddit, lidas pelo Arctic Shift porque o Reddit recusa scripts; o guia oficial de avaliação de fases); a Geometry Dash Wiki pela interface de dados (as 22 fases oficiais, o World, a Torre, o Lite, o modo prática e o ranking); Steam, lojas, Common Sense Media, Sensor Tower e imprensa. Nenhum arquivo do jogo foi baixado ou aberto.
- **Achados principais:**
  - 22 fases de 82 a 102 s, 19 com mecânica nova; rampa de uma estrela por fase nas 12 primeiras e, depois, o par "apresenta e cobra" (uma fase mais baixa com a mecânica, um Demon que combina tudo);
  - o Geometry Dash World é um mundo de 10 fases de cerca de 30 s, cada uma com uma novidade, o formato do nosso Mundo 1;
  - três respostas para checkpoints: a corrida que vale é sem morrer; o modo prática não vale e tem outra música; nas fases de plataforma, os checkpoints valem e o ranking é o tempo total, com o relógio correndo nas mortes (inferido). O nosso jogo já funciona como a fase de plataforma;
  - morte fatal, mas barata: recomeço automático, porcentagem e "New Best!", moeda paga pelo progresso;
  - modelo pago sem anúncios + Lite grátis com anúncios, escolhido para subir no ranking dos pagos; os anúncios do Lite aparecem entre mortes;
  - uma pessoa fez o jogo, e ainda faz; a comunidade segurou o jogo por quase 7 anos sem fase oficial nova, até o recorde de 100 mil jogadores no Steam em jan/2026.
- **Pega encontrado:** o conceito "Geometry Dash, só que pilotando uma nave" serve como frase interna, mas a diretriz 2.3.7 da App Store proíbe citar outros apps no subtítulo da loja.
- **Documentos:** [benchmark/geometry-dash.md](benchmark/geometry-dash.md) (v1.0), com cinco diagramas, `fases.json` e as ferramentas em `docs/benchmark/geometry-dash/ferramentas/`; página de leitura em [claude.ai/artifact/Y7Y1rAykSbfkfXuaJdSXRC](https://claude.ai/artifact/Y7Y1rAykSbfkfXuaJdSXRC) (privada); documento 10 v0.7 (coluna do Geometry Dash na seção 4 e lições 22 a 27); guia dos benchmarks v1.1, com o insight 4.13 (checkpoint não precisa estragar o ranking), republicado no mesmo link. O cartão [#127](https://github.com/TARNAGS/resgate-espacial/issues/127) foi para "Para conversar", com quatro recomendações.
- **O que a skill aprendeu:** quando o criador responde perguntas no Reddit e o Reddit recusa scripts, o arquivo público Arctic Shift traz as respostas dele com as perguntas (busca por autor e data; a busca por texto esgota o tempo).

## Aprendizados de produto

- Separar o objetivo do projeto (portfólio) do objetivo do produto (o jogador), com uma regra de desempate: quando os dois brigam, o jogador vence.
- Uma decisão muda outras em cascata. Virar PWA eliminou as regras da App Store; tornar o repositório público liberou a hospedagem gratuita.
- Escrever as regras antes do código pega problemas cedo. Exemplos: a nave que ficaria presa sem combustível e o ponto de retorno que daria vitória automática.
- O protótipo do M1 funciona como portão: se o controle não for divertido, não se constroem fases.
- Histórias só para os próximos marcos, e tarefa não é história.
- Um protótipo rápido e descartável alinha a visão antes de investir na construção.
- Privacidade também é requisito: antes de abrir o repositório, o e-mail pessoal foi tirado de todo o histórico.
- Medir mostra o que ninguém conta: os amigos não falaram que pulavam o posto nem que recomeçavam a cada morte, mas os dados mostraram as duas coisas na primeira noite. E uma regra provada por um piloto automático só vale se o piloto jogar tão bem quanto as pessoas.
- O ranking explica a telemetria: as corridas que derrubaram a regra do posto eram do próprio PM. Perguntar a quem jogou mostrou a causa (propulsor com gravidade) que os números sozinhos não davam.
- A memória de um usuário mistura referências: o Fernando lembrava de um jogo que era dois. Mostrar candidatos concretos, com vídeo, destravou o reconhecimento melhor do que pedir mais detalhes.
- Descoberta e entrega são trilhas diferentes. Separar as duas mostrou que boa parte do M1 (testes com pessoas e escolha do direcional) é pergunta a responder, e não código a escrever.
- Ler os benchmarks juntos rende mais do que ler um por um: o placar puro do Jetpack Joyride só aparece como escolha ao lado do multiplicador do Temple Run, e dois jogos diferentes (Gravitron e Temple Run) apontaram o mesmo modificador de erro com perdão.
- Pensar no abuso antes de lançar: o ranking que motivou os jogadores (D-021) é também a parte mais fácil de trapacear. E a salvaguarda pode virar recurso: o replay que confere o ranking é a mesma base do "fantasma" do melhor tempo.
- Uma rodada de playtest com amigos dura um fim de semana: 48 sessões de sexta a domingo e, depois, nenhuma partida. Combinar o começo e o fim, avisar o que mudou e fechar a janela no fim. Deixar a janela aberta "para o caso de alguém jogar" só expôs o repositório por mais três dias.
- Contrato conferido por teste acha defeito que ninguém procurava: o teste do obstáculo achou, na primeira rodada, a pedra com limites menores que o desenho. Escrever o contrato antes do segundo obstáculo saiu mais barato do que descobrir o problema com 10 tipos de obstáculo.
- O teste do PM mostrou o que a classificação técnica escondia: a câmera estava marcada como "só imagem", mas quanto se vê à frente muda a dificuldade e o ranking. Testar sentindo o jogo achou a regra que faltava.
