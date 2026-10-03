# Diário de Bordo — Resgate Espacial

| Campo | Valor |
|---|---|
| Documento | 06 — Diário de bordo |
| Última atualização | 03/10/2026 |
| Responsável | Fernando Nunes (Product Manager) |

Registro do que foi feito em cada sessão de trabalho, das decisões tomadas e de onde o projeto parou. É o ponto de partida para retomar o trabalho, em qualquer máquina.

## Onde paramos (03/10/2026, fim do dia)

- ⚠️ **Janela de teste ABERTA:** o repositório está público para amigos do Fernando testarem em https://tarnags.github.io/resgate-espacial/jogo/. Fechar ao fim do teste (passo 5 da janela de teste, no `CLAUDE.md`) e tirar este aviso.
- **Objetivo:** portfólio, aprendizado e negócio. O jogo será publicado na App Store e no Google Play (D-019); cobrar ou não segue em aberto (P-014, [#63](https://github.com/TARNAGS/resgate-espacial/issues/63); loja de itens, P-017, [#78](https://github.com/TARNAGS/resgate-espacial/issues/78)).
- **Marcos:** M0 só falta a retrospectiva ([#45](https://github.com/TARNAGS/resgate-espacial/issues/45)). M1 em testes com amigos. Big picture em proposta: M4 (lojas) e M5 (mundos e loja).
- **O jogo (`jogo/`):**
  - níveis 1 a 3 com **cenário fixo** (D-021) e mais difíceis; desafios **PRACTICE** (a mais difícil) e **BONUS** (sorteada a cada partida);
  - nas fases com posto, **abastecer uma vez é obrigatório** (D-023), provado por um piloto automático;
  - controle principal de **dois polegares (A)**, com o de um polegar (B) como opção (D-022);
  - **abertura** em três telas com **música chiptune** sincronizada, que dá para pular;
  - **elogios** discretos para manobras difíceis (CLOSE CALL, GREAT SAVE, PERFECT LANDING, PERFECT RUN);
  - **nickname e ranking online** por fase (D-024) e **telemetria das partidas** no Firebase (D-025), com relatório no terminal;
  - **primeiro playtest medido** (6 amigos, 229 tentativas): resultados no [documento 09](09-resultados-dos-playtests.md);
  - aviso de pouso, treino (TRAINING), painel de ajuste escondido e **75 testes automáticos**.
- **Documentos:** Visão 1.3, Regras 1.5, PRD 1.6, Roadmap 1.5, Decisões até a D-025, documento 07 (roteiro de teste), 08 (design de mundos, com o rascunho do Mundo 1) e 09 (resultados dos playtests).
- **Pendências abertas:** P-003 (nome), P-006 (pontuação), P-008 (medição), P-009 (tutorial), P-011 (obstáculos), P-012 (modificadores), P-013 (ICP), P-014 (cobrar ou não), P-015 (CNPJ), P-016 (o que o jogo guarda), P-017 (loja), P-018 (modo Nightmare, [#79](https://github.com/TARNAGS/resgate-espacial/issues/79)), P-019 (ranking, [#80](https://github.com/TARNAGS/resgate-espacial/issues/80)), P-020 (abastecer obrigatório, [#89](https://github.com/TARNAGS/resgate-espacial/issues/89)) e P-021 (pouso na tripulação e nível 1, [#90](https://github.com/TARNAGS/resgate-espacial/issues/90)). P-020 e P-021 estão em "Para conversar"; as outras, em "A investigar".

### Próximos passos

1. **Decidir P-020 e P-021** (cartões [#89](https://github.com/TARNAGS/resgate-espacial/issues/89) e [#90](https://github.com/TARNAGS/resgate-espacial/issues/90), em "Para conversar"), com os dados do [documento 09](09-resultados-dos-playtests.md). Se as duas mexerem nas fases, fazer as mudanças juntas, para o ranking recomeçar uma vez só.
2. **Apagar a linha de teste CLAUDETEST do ranking real** (só o Fernando pode, pelo console do Firebase): Realtime Database → Dados → `scores` → `w1-2_1wyelcg` → `CLAUDETEST` → lixeira. Se quiser, também `scores/teste_abc1` e `telemetry/1999-01-01`.
3. Melhorar a medição para a próxima rodada ([#91](https://github.com/TARNAGS/resgate-espacial/issues/91), Claude).
4. **O Fernando conta o retorno completo do teste com amigos** e testa as mudanças de hoje no iPhone: cartões em "Em revisão" ([#35](https://github.com/TARNAGS/resgate-espacial/issues/35), [#39](https://github.com/TARNAGS/resgate-espacial/issues/39), [#40](https://github.com/TARNAGS/resgate-espacial/issues/40), [#41](https://github.com/TARNAGS/resgate-espacial/issues/41), [#42](https://github.com/TARNAGS/resgate-espacial/issues/42), [#66](https://github.com/TARNAGS/resgate-espacial/issues/66), [#76](https://github.com/TARNAGS/resgate-espacial/issues/76), [#81](https://github.com/TARNAGS/resgate-espacial/issues/81) e [#82](https://github.com/TARNAGS/resgate-espacial/issues/82) a [#88](https://github.com/TARNAGS/resgate-espacial/issues/88)).
5. **Fechar o repositório** quando o teste acabar.
6. Retrospectiva do M0 ([#45](https://github.com/TARNAGS/resgate-espacial/issues/45)).
7. Decisões do Fernando: Nightmare ([#79](https://github.com/TARNAGS/resgate-espacial/issues/79)), ranking ([#80](https://github.com/TARNAGS/resgate-espacial/issues/80)), loja ([#78](https://github.com/TARNAGS/resgate-espacial/issues/78)) e cobrar ou não ([#63](https://github.com/TARNAGS/resgate-espacial/issues/63)).
8. Pesquisa do Claude sobre as lojas ([#65](https://github.com/TARNAGS/resgate-espacial/issues/65)): empacotamento, revisão da Apple, compras dentro do app e rankings do Game Center e do Google Play Games.

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

## Aprendizados de produto

- Separar o objetivo do projeto (portfólio) do objetivo do produto (o jogador), com uma regra de desempate: quando os dois brigam, o jogador vence.
- Uma decisão muda outras em cascata. Virar PWA eliminou as regras da App Store; tornar o repositório público liberou a hospedagem gratuita.
- Escrever as regras antes do código pega problemas cedo. Exemplos: a nave que ficaria presa sem combustível e o ponto de retorno que daria vitória automática.
- O protótipo do M1 funciona como portão: se o controle não for divertido, não se constroem fases.
- Histórias só para os próximos marcos, e tarefa não é história.
- Um protótipo rápido e descartável alinha a visão antes de investir na construção.
- Privacidade também é requisito: antes de abrir o repositório, o e-mail pessoal foi tirado de todo o histórico.
- Medir mostra o que ninguém conta: os amigos não falaram que pulavam o posto nem que recomeçavam a cada morte, mas os dados mostraram as duas coisas na primeira noite. E uma regra provada por um piloto automático só vale se o piloto jogar tão bem quanto as pessoas.
- Descoberta e entrega são trilhas diferentes. Separar as duas mostrou que boa parte do M1 (testes com pessoas e escolha do direcional) é pergunta a responder, e não código a escrever.
