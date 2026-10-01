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
- **Pendências abertas:** P-003 (nome final), P-006 (pontuação), P-008 (ferramenta de medição), P-009 (fase 1 aleatória ou fixa) e P-010 (tentar de novo repete o cenário?).

### Próximos passos

1. O Fernando joga o protótipo no iPhone, o que fecha a [#31](https://github.com/TARNAGS/resgate-espacial/issues/31), e dá retorno sobre a sensação: gravidade, propulsor, giro, tamanho da nave e tolerância do pouso.
2. Responder P-009 e P-010.
3. Decidir se o protótipo 01 vira a base do M1. A recomendação é que sim, porque ele já tem a física, os parâmetros centralizados e o direcional.
4. Com a [#31](https://github.com/TARNAGS/resgate-espacial/issues/31) aprovada, fazer a retrospectiva do M0 ([#45](https://github.com/TARNAGS/resgate-espacial/issues/45)) e fechar o marco.
5. M1: roteiro de teste ([#41](https://github.com/TARNAGS/resgate-espacial/issues/41)), testes com 3 a 5 pessoas ([#43](https://github.com/TARNAGS/resgate-espacial/issues/43)), calibragem ([#36](https://github.com/TARNAGS/resgate-espacial/issues/36) e [#42](https://github.com/TARNAGS/resgate-espacial/issues/42)) e variante final do direcional ([#44](https://github.com/TARNAGS/resgate-espacial/issues/44)).

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

## Aprendizados de produto

- Separar o objetivo do projeto (portfólio) do objetivo do produto (o jogador), com uma regra de desempate: quando os dois brigam, o jogador vence.
- Uma decisão muda outras em cascata. Virar PWA eliminou as regras da App Store; tornar o repositório público liberou a hospedagem gratuita.
- Escrever as regras antes do código pega problemas cedo. Exemplos: a nave que ficaria presa sem combustível e o ponto de retorno que daria vitória automática.
- O protótipo do M1 funciona como portão: se o controle não for divertido, não se constroem fases.
- Histórias só para os próximos marcos, e tarefa não é história.
- Um protótipo rápido e descartável alinha a visão antes de investir na construção.
- Privacidade também é requisito: antes de abrir o repositório, o e-mail pessoal foi tirado de todo o histórico.
