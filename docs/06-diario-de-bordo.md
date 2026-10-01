# Diário de Bordo — Resgate Espacial

| Campo | Valor |
|---|---|
| Documento | 06 — Diário de bordo |
| Última atualização | 01/10/2026 |
| Responsável | Fernando Nunes (Product Manager) |

Registro do que foi feito em cada sessão de trabalho, das decisões tomadas e de onde o projeto parou. É o ponto de partida para retomar o trabalho, em qualquer máquina.

## Onde paramos (01/10/2026)

- **Marco atual: M0 — Fundação, quase concluído.** As três decisões do M0 estão tomadas (D-011, D-012 e D-013), e o jogo é publicado sozinho no GitHub Pages a cada envio ([#30](https://github.com/TARNAGS/resgate-espacial/issues/30), concluída). Falta o Fernando abrir no iPhone ([#31](https://github.com/TARNAGS/resgate-espacial/issues/31), em revisão) e a retrospectiva do M0 ([#45](https://github.com/TARNAGS/resgate-espacial/issues/45)).
- **Protótipo 01 pronto e publicado** em https://tarnags.github.io/resgate-espacial/prototipos/01/ ([`prototipos/`](../prototipos/README.md)): menu com mapa de progresso, fases geradas aleatoriamente, física da nave, direcional virtual e todas as regras do documento 02. A primeira reação do Fernando foi de muita empolgação com o resultado.
- **Pendências abertas:** P-003 (nome final), P-006 (pontuação), P-008 (ferramenta de medição), P-009 (tutorial e fase 1), P-010 (tentar de novo repete o cenário?), P-011 (obstáculos, mundo e fase), P-012 (modificadores), P-013 (ICP), P-014 (preço e publicação), P-015 (como receber dinheiro e CNPJ) e P-016 (o que o jogo guarda e onde). Cada uma tem um cartão de descoberta no quadro.
- **Quadro com trilha de descoberta (D-016).** O que o Fernando precisa pesquisar e trazer pronto está na coluna "A investigar", em ordem de prioridade, e na visualização "Minha fila". A coluna "Para conversar" é a primeira coisa a olhar em cada sessão.

### Próximos passos

1. O Fernando adiciona as pesquisas que já tem em mente na Caixa de entrada, com o modelo Descoberta.
2. O Fernando joga o protótipo no iPhone, o que fecha a [#31](https://github.com/TARNAGS/resgate-espacial/issues/31), e responde a [#50](https://github.com/TARNAGS/resgate-espacial/issues/50): sensação de gravidade, propulsor, giro, tamanho da nave e tolerância do pouso.
3. Decisões rápidas do Fernando: protótipo 01 como base do M1 ([#51](https://github.com/TARNAGS/resgate-espacial/issues/51); a recomendação é que sim), P-009 ([#48](https://github.com/TARNAGS/resgate-espacial/issues/48)) e P-010 ([#49](https://github.com/TARNAGS/resgate-espacial/issues/49)).
4. Com a [#31](https://github.com/TARNAGS/resgate-espacial/issues/31) aprovada, fazer a retrospectiva do M0 ([#45](https://github.com/TARNAGS/resgate-espacial/issues/45)) e fechar o marco.
5. M1: roteiro de teste ([#41](https://github.com/TARNAGS/resgate-espacial/issues/41)), testes com 3 a 5 pessoas ([#43](https://github.com/TARNAGS/resgate-espacial/issues/43)), calibragem ([#36](https://github.com/TARNAGS/resgate-espacial/issues/36) e [#42](https://github.com/TARNAGS/resgate-espacial/issues/42)) e variante final do direcional ([#44](https://github.com/TARNAGS/resgate-espacial/issues/44)).
6. Pesquisas do Claude, para quando o M2 se aproximar: ferramenta de medição ([#56](https://github.com/TARNAGS/resgate-espacial/issues/56)) e som no iPhone ([#57](https://github.com/TARNAGS/resgate-espacial/issues/57)).

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

## Aprendizados de produto

- Separar o objetivo do projeto (portfólio) do objetivo do produto (o jogador), com uma regra de desempate: quando os dois brigam, o jogador vence.
- Uma decisão muda outras em cascata. Virar PWA eliminou as regras da App Store; tornar o repositório público liberou a hospedagem gratuita.
- Escrever as regras antes do código pega problemas cedo. Exemplos: a nave que ficaria presa sem combustível e o ponto de retorno que daria vitória automática.
- O protótipo do M1 funciona como portão: se o controle não for divertido, não se constroem fases.
- Histórias só para os próximos marcos, e tarefa não é história.
- Um protótipo rápido e descartável alinha a visão antes de investir na construção.
- Privacidade também é requisito: antes de abrir o repositório, o e-mail pessoal foi tirado de todo o histórico.
- Descoberta e entrega são trilhas diferentes. Separar as duas mostrou que boa parte do M1 (testes com pessoas e escolha do direcional) é pergunta a responder, e não código a escrever.
