# Visão do Produto — Resgate Espacial

> "Resgate Espacial" é um **codinome**. O nome final do jogo é uma decisão pendente (P-003 no [registro de decisões](05-registro-de-decisoes.md)).

| Campo | Valor |
|---|---|
| Documento | 01 — Visão do produto |
| Versão | 1.1 |
| Data | 01/10/2026 |
| Status | Aprovado |
| Responsável | Fernando Nunes (Product Manager) |

## 1. Resumo

Um jogo 2D de nave com gravidade. O jogador pilota um pequeno triângulo para resgatar tripulantes deixados no espaço: sai da base, à esquerda, atravessa obstáculos até a tripulação, à direita, recolhe as pessoas e volta, administrando o combustível e pousando para abastecer no caminho.

O jogo roda no navegador e pode ser instalado no celular (iOS e Android) direto do site: sem loja, sem cadastro e de graça.

## 2. Por que este projeto existe

O projeto tem dois objetivos, e eles não devem ser confundidos:

1. **Objetivo do projeto (portfólio e aprendizado):** demonstrar, em um produto pequeno e real, o ciclo completo de gestão de produto (descoberta, documentação, backlog, construção e lançamento) e aprender a construir com apoio de IA no caminho.
2. **Objetivo do produto (para o jogador):** recriar a sensação dos jogos de nave com gravidade da época das revistas de jogos de PC dos anos 2000: o desafio de dosar o propulsor contra o peso da nave para ir do ponto A ao ponto B e voltar.

Quando os dois entrarem em conflito, o jogador vence. Um jogo ruim não é um bom portfólio.

## 3. Oportunidade (hipóteses)

Não houve pesquisa de mercado. As afirmações abaixo são **hipóteses** para orientar decisões, não fatos validados.

| Hipótese | Como vamos saber |
|---|---|
| **H1.** Quem jogou jogos desse gênero gostaria de revisitá-los no celular, sem instalar nada pela loja. | Jogadores de fora do círculo próximo instalam o jogo e voltam a jogar |
| **H2.** Dosar o propulsor contra a gravidade é divertido o bastante para sustentar partidas curtas e repetidas, mesmo sem enredo ou gráficos elaborados. | Uma parte relevante dos jogadores inicia 3 ou mais partidas na primeira sessão |
| **H3.** Quem avalia um portfólio se engaja mais com um produto que consegue usar em segundos do que com documentos isolados. | Feedback de pessoas de produto que avaliarem o projeto |

## 4. Para quem

| Persona | Quem é | O que precisa | O que isso exige do produto |
|---|---|---|---|
| **Nostálgico** (primária) | Adulto que jogava jogos de PC nos anos 2000 | Partidas curtas no celular, controle preciso, clima retrô | Controle fiel à sensação original, inclusive na tela de toque |
| **Avaliador de portfólio** (secundária) | Recrutador ou gestor de produto que abre o link do portfólio | Ver o jogo funcionando e entender o processo por trás em poucos minutos | Jogar a partir do link em segundos; um README que conte a história do projeto |

## 5. Proposta de valor

> Toque no link e, em segundos, você está pilotando: partidas curtas de controle fino contra a gravidade, com o charme dos jogos de PC dos anos 2000. Grátis, sem cadastro e sem anúncios.

## 6. Objetivos e métricas

### 6.1 Métrica principal (North Star)

**Resgates concluídos:** quantas vezes um jogador completa o ciclo inteiro, saindo da base, recolhendo a tripulação e voltando em segurança. Quem conclui um resgate viveu a experiência completa do jogo; por isso essa é a métrica que melhor representa o valor entregue.

### 6.2 Métricas de apoio

| Objetivo | Métrica | Meta inicial (hipótese) |
|---|---|---|
| Acesso sem atrito | Tempo entre abrir o link e controlar a nave | Até 10 segundos no celular com 4G |
| Ativação | % de novos jogadores que concluem o primeiro resgate | 50% ou mais |
| Diversão (H2) | % de jogadores que iniciam 3 ou mais partidas na primeira sessão | 40% ou mais |
| Instalação (H1) | % de sessões abertas pelo app instalado | Acompanhar, sem meta |

As metas serão revistas após as primeiras semanas de uso real. A medição será anônima, sem dados pessoais; os detalhes ficam no PRD.

### 6.3 Objetivos do projeto

| Objetivo | Como saberemos que foi atingido |
|---|---|
| Publicar o jogo | Endereço público no ar e instalação testada no iPhone (MVP) e no Android (etapa seguinte, D-008) |
| Mostrar o processo de produto | Documentos base publicados e backlog rastreável no GitHub (iniciativa → épico → história), com critérios de aceite em todas as histórias |
| Aprender a construir com IA | Uma retrospectiva registrada ao fim de cada entrega |

## 7. Princípios

Regras de desempate para as decisões de produto:

1. **O controle é o produto.** A sensação de dosar o propulsor contra a gravidade é o que precisa ficar perfeito. Se funciona no teclado mas não no toque, não está pronto.
2. **Do link ao jogo em segundos.** Sem cadastro, sem loja, sem carregamento longo.
3. **Partidas curtas.** Uma fase se joga em poucos minutos.
4. **Retrô e simples.** Estética 16 bits minimalista (a nave é um triângulo, a tripulação são traços), viável para uma pessoa construir.
5. **Grátis e respeitoso.** Sem anúncios, sem compras, sem coleta de dados pessoais.

## 8. Escopo

### 8.1 O que o produto inclui

- **Núcleo do jogo:** nave com gravidade e propulsor, combustível limitado, pousos para abastecer, resgate da tripulação, volta à base e obstáculos entre o ponto A e o ponto B.
- **Fases:** níveis com dificuldade crescente. O cenário de cada fase é gerado aleatoriamente a cada partida, para o replay ser infinito (D-014), e um menu com mapa de progresso mostra a evolução do jogador (D-015).
- **Plataformas:** navegador (computador e celular) e instalação como app (PWA), com o iPhone como prioridade e o Android numa etapa seguinte (D-008). Controles de teclado e de toque, com direcional virtual (D-006).
- **Idioma:** jogo em inglês (D-007).
- **Progresso:** salvo no próprio aparelho.

As regras detalhadas ficam no documento 02 (Regras do jogo) e os requisitos, no 03 (PRD).

### 8.2 Fora de escopo

| Item | Motivo |
|---|---|
| Login e contas | Não há dado pessoal nem outro ativo a proteger (D-001) |
| App Store e Google Play | A instalação pelo site atende ao objetivo (D-002) |
| Anúncios e compras | Projeto gratuito de portfólio (D-003) |
| Multiplayer | Jogo para um jogador (D-004) |
| Ranking online e sincronização entre aparelhos | Exigiriam servidor e identificação do jogador |
| Nome, arte e sons de jogos existentes | Identidade própria (D-005) |

## 9. Premissas e restrições

- **Custo zero:** hospedagem e ferramentas gratuitas.
- **Equipe de uma pessoa:** Fernando, construindo com apoio de IA (Claude Code).
- **Sem servidor:** tudo roda no aparelho do jogador.
- **Ritmo de projeto paralelo:** o planejamento considera horas vagas, não dedicação integral.

## 10. Riscos principais

| Risco | Severidade | Mitigação |
|---|---|---|
| O controle por toque não reproduzir a sensação do teclado | Alta | Prototipar o direcional virtual (D-006) no iPhone antes de construir as fases |
| No iPhone, a instalação é manual (Compartilhar → Adicionar à Tela de Início), sem aviso automático | Média | Ensinar a instalar dentro do jogo; testar em iPhone real |
| Escopo crescer (editor de fases, ranking, novas mecânicas) | Média | MVP fechado no roadmap e decisões registradas |
| Desempenho ruim em celulares mais simples | Média | Gráficos simples e teste em aparelho de entrada |
| Perda do progresso se o jogador limpar os dados do navegador | Baixa | Aceitável no MVP; avisar o jogador |

## 11. Referências do gênero

O jogo original que inspirou o projeto não foi identificado. Estes clássicos são do mesmo gênero e servem de referência:

| Jogo | Ano | O que observar |
|---|---|---|
| Lunar Lander (Atari) | 1979 | Pouso suave com combustível limitado |
| Choplifter (Brøderbund) | 1982 | Reféns que correm até o veículo; ida e volta até a base |
| Gravitar (Atari) | 1982 | Gravidade e gestão de combustível |
| Space Taxi (Muse Software) | 1984 | Passageiros que embarcam andando; plataformas de pouso e de abastecimento |
| Thrust (Superior Software) | 1986 | Inércia e controle fino do propulsor |
| Oids (FTL Games) | 1987 | Resgate de pessoas com gravidade e combustível |

## 12. Próximos passos

A documentação base está completa e aprovada. O que vem a seguir está no [Roadmap](04-roadmap.md) e no [quadro kanban](https://github.com/users/TARNAGS/projects/1).

## 13. Glossário

| Termo | Significado |
|---|---|
| Base | Ponto de partida e de chegada de cada fase, à esquerda |
| Tripulação | Pessoas a resgatar, à espera no fim da fase, à direita |
| Posto de abastecimento | Plataforma no meio da fase onde a nave pousa para recuperar combustível |
| Propulsor | Motor da nave; empurra enquanto a tecla ou o toque estiver pressionado |
| Resgate | Ciclo completo: sair da base, recolher a tripulação e voltar |
| PWA | *Progressive Web App*: site que pode ser instalado no celular como um app, sem passar pela loja |
| MVP | Produto mínimo viável: a menor versão que já entrega o valor principal |
| North Star | Métrica principal, que representa o valor entregue ao usuário |

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 0.1 | 28/09/2026 | Primeira versão, a partir do kickoff |
| 0.2 | 28/09/2026 | Inclui iPhone primeiro (D-008), jogo em inglês (D-007) e direcional virtual (D-006) |
| 1.0 | 01/10/2026 | Aprovado pelo Fernando como versão de referência |
| 1.1 | 01/10/2026 | Escopo inclui fases geradas aleatoriamente (D-014) e menu com mapa de progresso (D-015) |
