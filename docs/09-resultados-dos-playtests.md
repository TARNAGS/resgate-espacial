# Resultados dos Playtests — Resgate Espacial

| Campo | Valor |
|---|---|
| Documento | 09 — Resultados dos playtests |
| Versão | 0.1 |
| Data | 03/10/2026 |
| Status | Contínuo |
| Responsável | Fernando Nunes (Product Manager) |

O que cada rodada de testes com pessoas mostrou, com os números da telemetria (D-025) e o que fazer com eles. Cada rodada ganha uma seção. Os dados ficam no Firebase do projeto; o resumo de qualquer período sai com:

```
node jogo/ferramentas/relatorio-telemetria.mjs --desde AAAA-MM-DD
```

Este documento não traz nicknames: os jogadores aparecem só como números, porque o repositório pode estar público.

## Playtest 1 — amigos, 02/10/2026 (primeira rodada com telemetria)

### Amostra

- **6 jogadores**, amigos do Fernando, convidados pelo grupo de playtest, com nickname e ranking online (D-024).
- **23 sessões**, numa noite só (19h30 às 0h10), no endereço público. Aparelhos: 3 jogadores no iPhone, 2 no Android e 1 no PC.
- **229 tentativas de fase, 305 mortes, 47 resgates concluídos** e cerca de **2 horas de jogo** somadas (de 7 a 31 minutos por jogador).
- Versão do jogo: `2026-10-02b` (níveis 1 a 3 fixos, PRACTICE, BONUS, controle A como padrão, abastecer obrigatório, ranking).
- Sessões de teste no computador (localhost) ficaram de fora.

**Cuidado ao ler:** são 6 amigos, motivados, numa noite. Os números apontam direções, não dão certezas.

### Métricas da Visão (seção 6)

| Métrica | Meta (hipótese) | Resultado | Leitura |
|---|---|---|---|
| Resgates concluídos (North Star) | — | 47 | — |
| Ativação: concluem o primeiro resgate | 50% ou mais | 5 de 6 (83%) | Acima da meta, mas um jogador ficou travado no nível 1 (veja o achado 3) |
| Diversão (H2): 3 ou mais partidas na primeira sessão | 40% ou mais | 6 de 6 (100%) | Muito acima; o ranking ajuda (achado 4) |
| Instalação (H1): sessões pelo app instalado | Acompanhar | 0 de 23 | Ninguém instalou na Tela de Início |
| Acesso: do link ao controle da nave | Até 10 s | Não medido direto | O jogo carrega em cerca de 1 s; o resto depende do nick e da abertura |

### Funil por fase

| Fase | Tentativas | Jogadores | Concluíram | Tentativas até a 1ª conclusão, por jogador | Tempo mediano | Melhor tempo | Mortes por tentativa |
|---|---|---|---|---|---|---|---|
| Nível 1 | 114 | 6 | 5 de 6 | 1, 1, 2, 3, 5 (um não concluiu em 30) | 22,1 s | 19,8 s | 1,4 |
| Nível 2 | 38 | 5 | 5 de 5 | 1, 1, 2, 3, 10 | 32,7 s | 29,2 s | 0,9 |
| Nível 3 | 44 | 5 | 5 de 5 | 3, 4, 5, 6, 6 | 45,6 s | 40,3 s | 1,4 |
| PRACTICE | 26 | 4 | 3 de 4 | 1, 1, 18 (um não concluiu em 6) | 51,2 s | 48,5 s | 1,4 |
| BONUS (sorteada) | 7 | 4 | 3 de 4 | 1, 2, 2 (um não concluiu em 1) | 76,5 s | 40,9 s | 1,7 |

O nível 3 é o que mais pede tentativas a todos (de 3 a 6), o que combina com ele ser o último do Mundo 1. O nível 1, que deveria ser o mais fácil, é o único que travou alguém.

### Achado 1 — Abastecer obrigatório (D-023) não segura os jogadores reais

- **Nível 3:** 5 das 9 conclusões não passaram no posto; 3 delas **sem morrer**, terminando com 28% a 32% do tanque. O melhor tempo da fase (40,3 s) foi sem abastecer.
- **PRACTICE:** 2 das 3 conclusões sem abastecer, uma delas sem morrer (23% do tanque no fim).
- **Por quê:** só a base e o posto abastecem; a plataforma da tripulação não. Então essas pessoas realmente voaram a fase inteira com um tanque. O tanque é calculado pelo piloto automático (D-018 e D-023), e as pessoas voam bem mais econômico que ele: fazem arcos, em vez de pairar perto do chão.

| Fase | Tanque | Piloto: corrida sem abastecer | Piloto: maior trecho com 1 abastecimento | Jogadores: corrida inteira sem abastecer e sem morrer |
|---|---|---|---|---|
| Nível 1 | 40 s | 15,8 s | — | 12,0 a 20,6 s |
| Nível 2 | 40 s | 23,9 s | — | 16,9 a 22,8 s |
| Nível 3 | 33,4 s | 39,4 s | 31,0 s | 22,6 a 24,1 s |
| PRACTICE | 32,7 s | 43,2 s | 31,2 s | 25,1 s |

Os melhores jogadores fazem a fase **inteira** com menos combustível do que o piloto precisa para **um trecho** abastecendo. Com o piloto atual, não existe tanque que deixe a fase possível para ele abastecendo e impossível para essas pessoas sem abastecer. **Decisão do Fernando:** P-020, [#89](https://github.com/TARNAGS/resgate-espacial/issues/89).

### Achado 2 — Pousar na tripulação é a maior dificuldade do jogo

| Fase | Mortes | Onde mais morrem | Motivos principais |
|---|---|---|---|
| Nível 1 | 160 | Perto da plataforma da tripulação: 105 (66%) | tocou o chão 55, pousou torto 35, rápido demais 30, parede 28, teto 12 |
| Nível 2 | 34 | Perto da tripulação: 12 (35%); pedras entre x 400 e 1000 | pedra 13, tocou o chão 10 |
| Nível 3 | 62 | Perto da tripulação: 18 (29%); pedras pelo caminho | pedra 21, teto 11, rápido demais 10, tocou o chão 8, parede 7, torto 5 |
| PRACTICE | 37 | Trecho estreito de x 800 a 2000, antes do posto | tocou o chão 27, pedra 8 |
| BONUS | 12 | Espalhadas (cenário sorteado) | pedra 5 |

- Em todas as fases fixas, a plataforma da tripulação fica a **150 px da parede do fim**, e quem chega rápido bate nela: 22 mortes na parede do fim no nível 1, 4 no nível 2 e 6 no nível 3.
- Das 90 mortes por pouso (torto ou rápido), **72 foram na tripulação ou no posto** e 18 na volta à base, já com a tripulação.
- Morrer chegando na base com a tripulação a bordo, a segundos do fim, aconteceu 23 vezes (15 no nível 1).

### Achado 3 — Um jogador ficou travado no nível 1

- 30 partidas, todas até o fim de jogo (nunca recomeçou no meio), 91 mortes e 31 minutos, sem conseguir embarcar a tripulação **nenhuma vez**.
- Mortes: tocou o chão 41, pousou torto 18, parede 15, teto 12, rápido demais 5; 43 delas na área da tripulação.
- Experimentou os dois controles (A em 27 partidas, B em 3) e abriu o ranking 10 vezes: estava interessado, não desistiu, mas o jogo não o ensinou a pousar.
- Os outros 5 passaram do nível 1 em 1 a 5 tentativas. **Decisão do Fernando:** P-021, [#90](https://github.com/TARNAGS/resgate-espacial/issues/90); conversa com P-009 (como o jogo ensina, [#48](https://github.com/TARNAGS/resgate-espacial/issues/48)).

### Achado 4 — Com o ranking, quem disputa tempo joga com uma vida só

- 128 tentativas terminaram com o jogador recomeçando ou saindo; **120 delas logo depois de uma morte**, com mediana de **0,9 s** entre a morte e o recomeço (112 em até 3 s). Em 116, o jogador tinha morrido uma vez só.
- Ou seja: morreu, o tempo ficou ruim para o ranking, recomeça na hora. As 3 vidas quase não importam para esses jogadores.
- Dos 54 fins de jogo, 30 foram do jogador travado no nível 1.
- **Leitura:** o ranking virou o motor do replay (achado 6), e o jogo tem dois públicos já no playtest: quem corre contra o tempo e quem ainda aprende a pousar. Conversa com a pontuação (P-006, [#53](https://github.com/TARNAGS/resgate-espacial/issues/53)) e com o modo Nightmare (P-018).
- **Atenção na leitura do relatório:** "desistência" quase sempre quer dizer "recomeçou depois de morrer".

### Achado 5 — Performance: sem problema

| Aparelho | Sessões | Carregamento (mediana) | Quadros por segundo | Engasgos (quadros acima de 33 ms) | Quadros longos |
|---|---|---|---|---|---|
| iPhone | 11 | 1,1 s | 60 | 0,1% | 37 de 99 tentativas tiveram algum quadro de 34 a 99 ms; 1 com 100 ms ou mais |
| Android | 9 | 1,4 s | 60 | 0,0% | 8 de 123 tentativas tiveram um quadro de 100 ms ou mais |
| PC | 3 | 0,9 s | 180 (monitor de 180 Hz) | 0% | — |

- As fases fixas abrem em 1 a 6 ms; a BONUS, que roda o piloto automático no aparelho, em 87 ms.
- **Leitura:** o jogo roda liso nos celulares testados. O Firebase não deixa o jogo mais rápido (ele roda inteiro no aparelho); ele mostra que não há o que acelerar agora. Os quadros longos são raros e isolados; o "pior quadro" é cortado em 100 ms pelo laço do jogo, então não dá para saber o tamanho real desses poucos casos ([#91](https://github.com/TARNAGS/resgate-espacial/issues/91)).

### Achado 6 — Ranking engaja; instalação e abertura, sem sinal

- **Ranking aberto 33 vezes**, por 5 dos 6 jogadores; 4 deles abriram de 3 a 10 vezes.
- **Ninguém instalou** o jogo na Tela de Início (0 de 23 sessões); **ninguém desligou o som**.
- **Controles:** o A (dois polegares) foi usado em 217 das 229 tentativas; o B em 5 e o teclado em 7.
- **Abertura:** só 2 registros (vista até o fim, sem pular), porque quase todos já tinham visto a abertura antes da telemetria. Sem conclusão ainda.
- **Saídas do app no meio de uma fase:** 12 (7 no nível 1); 7 tentativas nunca terminaram (o app foi fechado).

### Achado 7 — Elogios: PERFECT LANDING quase nunca aparece

| Elogio | Vezes |
|---|---|
| GREAT SAVE | 52 |
| CLOSE CALL | 20 |
| PERFECT RUN | 4 |
| PERFECT LANDING | 1 |

Um PERFECT LANDING em 229 tentativas indica um critério estrito demais para ser um reforço (#81). Para ajustar com dados, falta registrar a velocidade e a inclinação dos pousos ([#91](https://github.com/TARNAGS/resgate-espacial/issues/91)).

### Limites da medição desta rodada

- 6 jogadores, uma noite: amostra pequena e enviesada (amigos).
- O evento de fim de tentativa não separa RESTART, voltar ao menu e fechar o app (tudo é "quit").
- O pior quadro é cortado em 100 ms.
- A tela é registrada ao carregar o jogo, muitas vezes ainda na vertical, e não durante a fase.
- As mortes no pouso não guardam a velocidade e a inclinação.

Tudo isso está na tarefa [#91](https://github.com/TARNAGS/resgate-espacial/issues/91).

### O que decidir e o que observar no próximo playtest

| Assunto | Cartão | O que observar depois da mudança |
|---|---|---|
| Abastecer obrigatório (D-023) | P-020, [#89](https://github.com/TARNAGS/resgate-espacial/issues/89) | Conclusões sem abastecer no nível 3 e na PRACTICE: devem ir a zero |
| Pouso na tripulação e nível 1 | P-021, [#90](https://github.com/TARNAGS/resgate-espacial/issues/90) | Mortes perto da tripulação no nível 1 (hoje 66%) e jogadores que não passam do nível 1 (hoje 1 de 6) |
| Recomeço rápido e uma vida só | P-006, [#53](https://github.com/TARNAGS/resgate-espacial/issues/53) | Recomeços logo depois de morrer (hoje 120 de 128) |
| Medição | [#91](https://github.com/TARNAGS/resgate-espacial/issues/91) | — |

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 0.1 | 03/10/2026 | Primeira versão, com o playtest de 02/10/2026 |
