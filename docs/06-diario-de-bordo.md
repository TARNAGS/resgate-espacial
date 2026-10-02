# Diário de Bordo — Resgate Espacial

| Campo | Valor |
|---|---|
| Documento | 06 — Diário de bordo |
| Última atualização | 02/10/2026 |
| Responsável | Fernando Nunes (Product Manager) |

Registro do que foi feito em cada sessão de trabalho, das decisões tomadas e de onde o projeto parou. É o ponto de partida para retomar o trabalho, em qualquer máquina.

## Onde paramos (02/10/2026, fim do dia)

- **Objetivo do projeto:** portfólio, aprendizado e negócio. O jogo será publicado na App Store e no Google Play (D-019). Cobrar pelo jogo, vender itens ou os dois está em aberto ([#63](https://github.com/TARNAGS/resgate-espacial/issues/63) e [#78](https://github.com/TARNAGS/resgate-espacial/issues/78)). A pesquisa técnica das lojas é a [#65](https://github.com/TARNAGS/resgate-espacial/issues/65), com o Claude.
- **Big picture** ([Visão, seção 8.3](01-visao-do-produto.md#83-big-picture-o-jogo-depois-do-mvp)): sem enredo, replay alto, mundos de 10 fases com visual próprio (D-020, [documento 08](08-design-de-mundos.md)), abertura em três telas e loja de itens. O MVP continua com 3 fases. No roadmap, os marcos M4 (lojas) e M5 (mundos e loja) estão em proposta, esperando a aprovação do Fernando.
- **Marcos:** M0 só falta a retrospectiva ([#45](https://github.com/TARNAGS/resgate-espacial/issues/45)). M1 em andamento: física, propulsor, embalo, parâmetros, teclado e direcional concluídos (#32 a #34 e #36 a #38). Em revisão, aguardando o Fernando conferir: treino ([#35](https://github.com/TARNAGS/resgate-espacial/issues/35)), área do direcional ([#39](https://github.com/TARNAGS/resgate-espacial/issues/39)), toque sem zoom ([#40](https://github.com/TARNAGS/resgate-espacial/issues/40)), roteiro de teste ([#41](https://github.com/TARNAGS/resgate-espacial/issues/41)) e painel de ajuste ([#42](https://github.com/TARNAGS/resgate-espacial/issues/42)).
- **O jogo** fica em [`jogo/`](../jogo/README.md), construído a partir do protótipo 01 (#51). Já tem:
  - níveis 1 a 3 e o desafio PRACTICE, a fase mais difícil (#68);
  - a regra do melhor caminho, com um piloto automático que prova a corrida sem abastecer de cada cenário (D-018, #67);
  - aviso de pouso que nunca fica verde num pouso que vai explodir;
  - dois controles de toque para comparar: A, tocar e segurar, e C, dois polegares, com a câmera mantendo a nave longe dos dedos (o B foi descartado);
  - treino (TRAINING), painel de ajuste escondido e 50 testes automáticos.
- **Como testar:** no PC, `node jogo/servir.js` e http://localhost:8081; no iPhone, no mesmo Wi-Fi, `http://<IP do computador>:8081`. Um beta tester de fora precisa de um endereço público: as opções (janela de teste, Netlify ou Cloudflare Pages, túnel) foram apresentadas, e o Fernando preferiu deixar para depois.
- **Repositório e quadro privados (D-017).**
- **Pendências abertas:** P-003 (nome final), P-006 (pontuação), P-008 (medição), P-009 (tutorial), P-010 (tentar de novo repete o cenário?), P-011 (obstáculos, mundo e fase), P-012 (modificadores), P-013 (ICP), P-014 (pago, loja ou os dois), P-015 (como receber e CNPJ), P-016 (o que o jogo guarda) e P-017 (o que a loja vende). Cada uma tem um cartão na coluna "A investigar".

### Próximos passos

1. **Novos testes do Fernando** com o que existe hoje: controles A e C, aviso de pouso, PRACTICE e a regra do melhor caminho (sobrou combustível demais ou de menos na corrida perfeita?). Conferir também os cartões em revisão (#35, #40, #41 e #42).
2. Escolher a velocidade de giro no toque ([#66](https://github.com/TARNAGS/resgate-espacial/issues/66)) e, depois do teste com pessoas, o controle final, A ou C ([#44](https://github.com/TARNAGS/resgate-espacial/issues/44)).
3. Retrospectiva do M0 ([#45](https://github.com/TARNAGS/resgate-espacial/issues/45)).
4. Testes com 3 a 5 pessoas ([#43](https://github.com/TARNAGS/resgate-espacial/issues/43)), com o roteiro do documento 07. Para quem está fora de casa, escolher como publicar o jogo (janela de teste ou hospedagem que publica só a pasta `jogo/`).
5. Descobertas da coluna "A investigar", na ordem do quadro: pagamento e lojas (#63 e #65), ICP (#59) e risco de plágio (#52) primeiro.
6. O Fernando aprova ou ajusta o big picture: marcos M4 e M5 do Roadmap (versão 1.4), princípios novos da Visão (versão 1.2) e o documento 08 (versão 0.1).

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

## Aprendizados de produto

- Separar o objetivo do projeto (portfólio) do objetivo do produto (o jogador), com uma regra de desempate: quando os dois brigam, o jogador vence.
- Uma decisão muda outras em cascata. Virar PWA eliminou as regras da App Store; tornar o repositório público liberou a hospedagem gratuita.
- Escrever as regras antes do código pega problemas cedo. Exemplos: a nave que ficaria presa sem combustível e o ponto de retorno que daria vitória automática.
- O protótipo do M1 funciona como portão: se o controle não for divertido, não se constroem fases.
- Histórias só para os próximos marcos, e tarefa não é história.
- Um protótipo rápido e descartável alinha a visão antes de investir na construção.
- Privacidade também é requisito: antes de abrir o repositório, o e-mail pessoal foi tirado de todo o histórico.
- Descoberta e entrega são trilhas diferentes. Separar as duas mostrou que boa parte do M1 (testes com pessoas e escolha do direcional) é pergunta a responder, e não código a escrever.
