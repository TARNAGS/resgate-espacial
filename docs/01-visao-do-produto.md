# Visão do Produto — Resgate Espacial

> "Resgate Espacial" é um **codinome**. O nome final do jogo é uma decisão pendente (P-003 no [registro de decisões](05-registro-de-decisoes.md)).

| Campo | Valor |
|---|---|
| Documento | 01 — Visão do produto |
| Versão | 1.2 |
| Data | 02/10/2026 |
| Status | Aprovado |
| Responsável | Fernando Nunes (Product Manager) |

## 1. Resumo

Um jogo 2D de nave com gravidade. O jogador pilota um pequeno triângulo para resgatar tripulantes deixados no espaço: sai da base, à esquerda, atravessa obstáculos até a tripulação, à direita, recolhe as pessoas e volta, administrando o combustível e pousando para abastecer no caminho.

O MVP roda no navegador e no celular, sem cadastro. Depois dele, o jogo será publicado na App Store e no Google Play (D-019), e pode passar a ser vendido ou ter uma loja de itens (P-014 e P-017).

## 2. Por que este projeto existe

O projeto tem três objetivos, e eles não devem ser confundidos:

1. **Objetivo do projeto (portfólio e aprendizado):** demonstrar, em um produto real, o ciclo completo de gestão de produto (descoberta, documentação, backlog, construção e lançamento) e aprender a construir com apoio de IA no caminho.
2. **Objetivo do produto (para o jogador):** recriar a sensação dos jogos de nave com gravidade da época das revistas de jogos de PC dos anos 2000: o desafio de dosar o propulsor contra o peso da nave para ir do ponto A ao ponto B e voltar.
3. **Objetivo de negócio (desde 02/10/2026):** as pessoas se divertiram nos primeiros testes, e o Fernando viu oportunidade de receita. O projeto vai até publicar o jogo nas lojas e testar se há quem pague, pelo jogo ou por itens cosméticos (D-019).

Quando eles entrarem em conflito, o jogador vence. Um jogo ruim não é um bom portfólio, nem um bom negócio.

## 3. Oportunidade (hipóteses)

Não houve pesquisa de mercado. As afirmações abaixo são **hipóteses** para orientar decisões, não fatos validados.

| Hipótese | Como vamos saber |
|---|---|
| **H1.** Quem jogou jogos desse gênero gostaria de revisitá-los no celular, sem instalar nada pela loja. | Jogadores de fora do círculo próximo instalam o jogo e voltam a jogar |
| **H2.** Dosar o propulsor contra a gravidade é divertido o bastante para sustentar partidas curtas e repetidas, mesmo sem enredo ou gráficos elaborados. | Uma parte relevante dos jogadores inicia 3 ou mais partidas na primeira sessão |
| **H3.** Quem avalia um portfólio se engaja mais com um produto que consegue usar em segundos do que com documentos isolados. | Feedback de pessoas de produto que avaliarem o projeto |
| **H4.** Jogadores pagam pelo jogo, por itens cosméticos, ou pelos dois. Indício: nos primeiros testes, as pessoas se divertiram. | Vendas nas lojas depois da publicação (M4 e M5); o modelo de cobrança é a P-014 |
| **H5.** Cenários sorteados e muitas fases, organizadas em mundos, sustentam o replay por semanas, sem precisar de enredo. | Jogadores voltam em dias diferentes; fases rejogadas depois de concluídas |

## 4. Para quem

| Persona | Quem é | O que precisa | O que isso exige do produto |
|---|---|---|---|
| **Nostálgico** (primária) | Adulto que jogava jogos de PC nos anos 2000 | Partidas curtas no celular, controle preciso, clima retrô | Controle fiel à sensação original, inclusive na tela de toque |
| **Avaliador de portfólio** (secundária) | Recrutador ou gestor de produto que abre o link do portfólio | Ver o jogo funcionando e entender o processo por trás em poucos minutos | Jogar a partir do link em segundos; um README que conte a história do projeto |

## 5. Proposta de valor

> Abra o jogo e, em segundos, você está pilotando: partidas curtas de controle fino contra a gravidade, com o charme dos jogos de PC dos anos 2000. Sem cadastro e sem anúncios.

Até a versão 1.1, a proposta dizia "grátis". Cobrar pelo jogo ou por itens está em aberto (P-014 e P-017).

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
| Publicar o jogo | MVP: endereço público no ar e testado no iPhone. Depois: jogo aprovado na App Store e no Google Play (D-019) |
| Testar o negócio | Modelo de cobrança decidido (P-014) e primeiras vendas medidas nas lojas |
| Mostrar o processo de produto | Documentos base publicados e backlog rastreável no GitHub (iniciativa → épico → história), com critérios de aceite em todas as histórias |
| Aprender a construir com IA | Uma retrospectiva registrada ao fim de cada entrega |

## 7. Princípios

Regras de desempate para as decisões de produto:

1. **O controle é o produto.** A sensação de dosar o propulsor contra a gravidade é o que precisa ficar perfeito. Se funciona no teclado mas não no toque, não está pronto.
2. **Do toque ao jogo em segundos.** Sem cadastro e sem carregamento longo.
3. **Partidas curtas.** Uma fase se joga em poucos minutos.
4. **Retrô e simples.** Estética 16 bits minimalista (a nave é um triângulo, a tripulação são traços), viável para uma pessoa construir.
5. **Respeitoso.** Sem anúncios e sem coleta de dados pessoais. Se houver compras, comprar não dá vantagem injusta nem bloqueia a diversão (Proposta; P-017).
6. **Sem enredo.** Não é um jogo de "lore". A história cabe em duas telas: uma tripulação ficou presa, e você vai buscá-la.
7. **Replay alto.** Cenários sorteados a cada partida (D-014), muitas fases organizadas em mundos (D-020) e desafios como a PRACTICE.

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
| Anúncios | Continuam fora (D-003, revista pela D-019) |
| Lojas de aplicativos e compras **no MVP** | O MVP é testado pelo site; lojas e loja de itens vêm depois (seção 8.3) |
| Multiplayer | Jogo para um jogador (D-004) |
| Ranking online e sincronização entre aparelhos **no MVP** | Exigiriam servidor e identificação do jogador. Depois do MVP, o ranking está em estudo (P-019), possivelmente pelos rankings do Game Center e do Google Play Games |
| Nome, arte e sons de jogos existentes | Identidade própria (D-005) |

### 8.3 Big picture: o jogo depois do MVP

O MVP continua com 3 fases (D-009). A visão de longo prazo, descrita pelo Fernando em 02/10/2026:

| Elemento | O que é | Status |
|---|---|---|
| **Lojas** | O jogo publicado na App Store e no Google Play | Definido (D-019) |
| **Mundos** | Vários mundos, cada um com 10 fases e identidade visual própria, com um documento de design por mundo ([documento 08](08-design-de-mundos.md)) | Definido (D-020); quantos mundos, em aberto |
| **Muitas fases e replay alto** | Fases geradas a partir de regras (D-014) tornam barato ter muitas fases; desafios fora da sequência, como a PRACTICE | Definido |
| **Abertura** | Antes da primeira fase, telas com imagem e texto (não um filme): a tripulação em apuros, o chamado para o resgate e um fade para a fase 1 | Proposta ([documento 02](02-regras-do-jogo.md), seção 10.1) |
| **Loja de itens** | Loja no menu, com itens cosméticos e modificadores de jogo e de nave, comprados com dinheiro real ou com moedas do jogo | Em aberto (P-017) |
| **Cobrança** | Jogo pago, gratuito com loja de itens, ou os dois | Em aberto (P-014) |
| **Modo Nightmare** | Modo mais difícil: morrer não devolve o combustível | Em aberto (P-018) |
| **Ranking de tempos** | Comparar os tempos de cada fase, para quem for mais rápido | Em aberto (P-019) |

A ordem em que isso entra está no [Roadmap](04-roadmap.md) (M4 e M5, em proposta).

## 9. Premissas e restrições

- **Custo zero até a publicação nas lojas:** hospedagem e ferramentas gratuitas. As contas de desenvolvedor das lojas são pagas (D-019).
- **Equipe de uma pessoa:** Fernando, construindo com apoio de IA (Claude Code).
- **Sem servidor:** tudo roda no aparelho do jogador.
- **Ritmo de projeto paralelo:** o planejamento considera horas vagas, não dedicação integral.

## 10. Riscos principais

| Risco | Severidade | Mitigação |
|---|---|---|
| O controle por toque não reproduzir a sensação do teclado | Alta | Prototipar o direcional virtual (D-006) no iPhone antes de construir as fases |
| No iPhone, a instalação é manual (Compartilhar → Adicionar à Tela de Início), sem aviso automático | Média | Ensinar a instalar dentro do jogo; testar em iPhone real |
| Escopo crescer (mundos, loja, editor de fases, ranking, novas mecânicas) | Média | MVP fechado em 3 fases (D-009); o big picture tem marcos próprios no roadmap |
| A Apple recusar um app feito em tecnologia web | Média | Pesquisa antes de publicar ([#65](https://github.com/TARNAGS/resgate-espacial/issues/65)) |
| A loja de itens virar "pague para ganhar" e afastar os jogadores | Média | Regra de itens justos antes de construir a loja (P-017) |
| Custo de arte de cada mundo alto demais para uma pessoa | Média | Estética minimalista; modelo único de documento de mundo (documento 08) |
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
| Mundo | Conjunto de 10 fases com identidade visual própria (D-020) |
| Desafio | Fase fora da sequência dos mundos, sempre liberada, como a PRACTICE |
| Abertura | Telas com imagem e texto antes da primeira fase |
| Loja de itens | Loja no menu para comprar itens cosméticos ou de jogo (P-017) |
| Moeda do jogo | Dinheiro de dentro do jogo, ganho jogando ou comprado (P-017) |
| North Star | Métrica principal, que representa o valor entregue ao usuário |

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 0.1 | 28/09/2026 | Primeira versão, a partir do kickoff |
| 0.2 | 28/09/2026 | Inclui iPhone primeiro (D-008), jogo em inglês (D-007) e direcional virtual (D-006) |
| 1.0 | 01/10/2026 | Aprovado pelo Fernando como versão de referência |
| 1.1 | 01/10/2026 | Escopo inclui fases geradas aleatoriamente (D-014) e menu com mapa de progresso (D-015) |
| 1.2 | 02/10/2026 | Objetivo de negócio e publicação nas lojas (D-019); big picture com mundos de 10 fases (D-020), abertura, loja de itens e cobrança em aberto (P-014 e P-017); princípios "sem enredo" e "replay alto"; hipóteses H4 e H5. O MVP continua com 3 fases |
