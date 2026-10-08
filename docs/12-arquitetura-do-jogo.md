# Arquitetura do Jogo e Mapa de Impacto — Resgate Espacial

| Campo | Valor |
|---|---|
| Documento | 12 — Arquitetura do jogo e mapa de impacto |
| Versão | 0.2 |
| Data | 07/10/2026 |
| Status | Em revisão (o Fernando aprova) |
| Responsável | Fernando Nunes (Product Manager) |
| Cartões | [#111](https://github.com/TARNAGS/resgate-espacial/issues/111), no épico E-26 · Abstração ([#110](https://github.com/TARNAGS/resgate-espacial/issues/110)) |

Para que serve: saber até onde uma mudança no jogo chega **sem reler o código todo**. Antes de mexer na nave, na gravidade, na colisão, numa fase ou no visual, procure a linha na tabela da seção 3.

O princípio do épico da abstração:

> **Regra é sagrada, aparência é livre, conteúdo é dado.**

## Sumário

1. [As camadas do jogo](#1-as-camadas-do-jogo)
2. [Três tipos de mudança](#2-três-tipos-de-mudança)
3. [Mapa de impacto: "se eu mudar X"](#3-mapa-de-impacto-se-eu-mudar-x)
4. [Acoplamentos que já conhecemos](#4-acoplamentos-que-já-conhecemos)
5. [Guardas automáticas](#5-guardas-automáticas)
6. [Como usar este documento](#6-como-usar-este-documento)

## 1. As camadas do jogo

O código do jogo fica em `jogo/src`, e cada pasta é uma camada. A regra de direção: **as regras nunca conhecem a tela.** As peças de baixo não sabem que as de cima existem, então dá para mudar o desenho, as telas e o som sem encostar nas regras.

| Camada | O que tem | Pode usar | Nunca usa |
|---|---|---|---|
| `config` | Números de ajuste (gravidade, propulsor, pouso, controles, câmera) e o endereço do banco | — | Nada |
| `content` | Mundos e fases, obstáculos, modificadores e músicas | `core`, `config` | Desenho, telas, controles, aparelho, navegador |
| `core` | Regras: física da nave, contato e pouso, partida, gerador, piloto automático, elogios, progresso, pontuação e regras do ranking | `content`, `config` | Desenho, telas, controles, aparelho, navegador |
| `render` | Desenho no Canvas: caverna, nave, obstáculos, painel, mensagens e controles na tela | `core`, `content`, `config`, **só lendo** | Telas, controles, aparelho. Nunca muda o estado da partida |
| `input` | Teclado, direcional e a junção dos dois | `core`, `config` | Desenho, telas, aparelho |
| `platform` | Som, música, o que fica salvo, banco online (ranking e perfil) e telemetria | `core`, `content`, `config` | Desenho, telas, controles |
| `ui` | Menu, mapa de progresso, painel de ajuste e tela do ranking | `core`, `content`, `config`, `platform` | Desenho do jogo, controles |
| `main.js` | Liga todas as peças: telas, laço do jogo, DEMO, nick | Tudo | Ninguém importa o `main.js` |

Regras, conteúdo e números também rodam no Node, nos testes e no piloto automático. Por isso **não tocam no navegador** (`window`, `document`, `localStorage`, `fetch`...).

A tabela é conferida por um teste ([#112](https://github.com/TARNAGS/resgate-espacial/issues/112), `jogo/testes/arquitetura/camadas.test.js`). Uma pasta nova precisa entrar na tabela do teste e nesta seção.

**Como as camadas conversam:**
- **Eventos:** a partida avisa o que aconteceu (pousou, explodiu, abasteceu, concluiu), e quem precisa reage (som, mensagens, elogios, telemetria). As regras não chamam o som; o som escuta as regras. A lista dos eventos é um contrato (tabela abaixo).
- **Contratos:** cada peça de conteúdo segue um formato conferido por teste.
  - **Obstáculo** ([#119](https://github.com/TARNAGS/resgate-espacial/issues/119)): responde às mesmas perguntas (`generate`, `bounds`, `hits`, `validate`, `blockedAt`, `draw`, mais um `example`; lista em `content/obstacles/index.js`). A colisão, o gerador e o piloto automático só falam com o contrato e não sabem o que é uma pedra.
  - **Fase e mundo** ([#117](https://github.com/TARNAGS/resgate-espacial/issues/117)): os campos explicados em `content/worlds.js`, um arquivo por mundo em `content/worlds/` ([#118](https://github.com/TARNAGS/resgate-espacial/issues/118)).
  - **Parâmetros** ([#120](https://github.com/TARNAGS/resgate-espacial/issues/120)): cada número diz se muda o **jogo**, só um **aviso** ou só a **imagem** (`PARAM_KIND` em `config/params.js`).
- **Estado:** a física atualiza a nave (`x`, `y`, `a`, `fuel`, `thrusting`...), e o desenho só lê. A chama do propulsor depende só de `thrusting`.

**Cadeia de parâmetros** ([#120](https://github.com/TARNAGS/resgate-espacial/issues/120), `content/modifiers.js`): os números de ajuste passam por camadas, sempre nesta ordem, e a de depois vale por cima: **nave → evoluções → mundo e fase → modo**. Hoje só "mundo e fase" é usada. As outras são os pontos de encaixe:
- **nave:** só a nave que muda o jogo entra (D-034);
- **evoluções:** só as de atributos (D-035);
- **modo:** os modos de jogo, como o Nightmare (P-018).

**Eventos da partida** ([#116](https://github.com/TARNAGS/resgate-espacial/issues/116), contrato em `core/events.js`). Nos testes, avisar um evento fora da lista, ou com campos diferentes, é erro. Um teste lê o código e confere quem avisa e quem escuta.

| Evento | Campos | Quem avisa | Quem escuta |
|---|---|---|---|
| `start` | def, seed | main.js | mensagens do início da fase (objetivo e dicas) |
| `takeoff` | — | partida | ninguém no jogo, hoje (as fichas de ouro registram) |
| `land` | pad, impact | partida | mensagens, som, telemetria |
| `crash` | reason, x, y, vx, vy, a, lives | partida | mensagens, explosão, som, telemetria |
| `refuel` | pad | partida | ninguém no jogo, hoje (as fichas de ouro registram) |
| `boarding` | lowFuel | partida | mensagens |
| `boardStep` | index | partida | som |
| `crewOnBoard` | — | partida | mensagens |
| `lowFuelAtCrew` | fuel | partida | som |
| `lowFuel` | level | partida | aviso LOW FUEL |
| `noFuel` | landed | partida | aviso NO FUEL |
| `outOfFuel` | landed | partida | aviso NO FUEL |
| `respawn` | lives, at | partida | mensagens |
| `complete` | def, seed, run | partida | resultado, ranking, progresso, som |
| `gameOver` | def, seed | partida | tela de fim de jogo |
| `praise` | kind, label, x, y | elogios | mensagem do elogio, som, telemetria |

## 2. Três tipos de mudança

| Tipo | Exemplos | Pode | Quem garante | Hoje |
|---|---|---|---|---|
| **Aparência** | Cores dos mundos, skins da nave, do propulsor e dos obstáculos, formatos de nave de aparência (D-034), evoluções só visuais (D-035) | Mudar à vontade, sem nunca alterar uma regra | O desenho só lê ([#113](https://github.com/TARNAGS/resgate-espacial/issues/113)). A skin não define o casco ([#124](https://github.com/TARNAGS/resgate-espacial/issues/124)) | Ainda não há camada de skins: o desenho de cada obstáculo mora com as regras dele, e o formato da nave está em dois lugares ([#121](https://github.com/TARNAGS/resgate-espacial/issues/121)) |
| **Conteúdo** | Mundos, fases, obstáculos, naves que mudam o jogo, evoluções de atributos | Entrar sem mexer no motor, seguindo o contrato | Contratos conferidos por teste ([#116](https://github.com/TARNAGS/resgate-espacial/issues/116) a [#120](https://github.com/TARNAGS/resgate-espacial/issues/120), [#122](https://github.com/TARNAGS/resgate-espacial/issues/122)) | Fase e mundo, evento, obstáculo e parâmetros têm contrato conferido desde 07/10/2026. Falta o da nave ([#121](https://github.com/TARNAGS/resgate-espacial/issues/121), [#122](https://github.com/TARNAGS/resgate-espacial/issues/122)) |
| **Regra** | Física, colisão, pouso, combustível, cronômetro, vidas | Mudar pouco e de propósito | Fichas de ouro ([#114](https://github.com/TARNAGS/resgate-espacial/issues/114)) e testes das regras do documento 02 | As fichas existem desde 07/10/2026 |

## 3. Mapa de impacto: "se eu mudar X"

A coluna do ranking diz se a chave do ranking da fase muda **sozinha**, recomeçando o ranking. Desde a [#120](https://github.com/TARNAGS/resgate-espacial/issues/120), a chave se monta sozinha (`core/ranking.js`) com:
- a semente da fase e as regras do gerador;
- todos os números marcados como **jogo** em `PARAM_KIND`: física, pouso, giro, embarque, abastecimento e vidas;
- os modificadores da fase e do mundo;
- a nave que muda o jogo, as evoluções de atributos e o modo;
- a versão das regras (`RULES_VERSION`).

As chaves de antes não mudaram.

| Se eu mudar... | Onde fica | O que muda junto | O que conferir | O ranking recomeça? |
|---|---|---|---|---|
| Gravidade, propulsor ou velocidade máxima | `config/params.js` | A física da nave; o tanque provado das fases (D-018, D-023) e o valor `tank` gravado nas fases fixas; o piloto automático; a previsão de pouso; os elogios | Bateria completa: o teste das fases fixas avisa o tanque desatualizado. As fichas de ouro mudam: regravar de propósito | Sim, sozinho |
| Limites de pouso (descida, deslize, inclinação, folga da borda) | `config/params.js` | Pouso e batida; o aviso verde de pouso; o piloto automático | Fichas de ouro; testes de pouso | Sim, sozinho |
| Velocidade de giro (teclado ou toque) | `config/params.js` | O controle; o piloto automático, que prova as rotas com o giro do teclado | Fichas de ouro; testes do piloto expert | Sim, sozinho (desde a [#120](https://github.com/TARNAGS/resgate-espacial/issues/120)) |
| Tempo de embarque ou velocidade de abastecer | `config/params.js` | O cronômetro: os dois acontecem com ele rodando | Fichas de ouro | Sim, sozinho (desde a [#120](https://github.com/TARNAGS/resgate-espacial/issues/120)) |
| Formato ou tamanho da nave | `core/constants.js` (`SHIP`) **e** `render/renderer.js` (`drawShip`) | Colisão, pouso, previsão de pouso, piloto automático, elogios, desenho da nave, da chama e da tripulação | Mudar os dois lugares juntos até a [#121](https://github.com/TARNAGS/resgate-espacial/issues/121); fichas de ouro | Hoje, não sozinho. Pela D-034, só a nave que muda o jogo deve mexer no ranking |
| Regra de contato ou de batida (código) | `core/collision.js` | A partida e o piloto automático, que usam a mesma função | Fichas de batida e de rotas; caminho provado (D-018) | **Não sozinho**: mudar código de regra não muda a chave. Para recomeçar, suba `RULES_VERSION` em `core/ranking.js`; a ficha de ouro que mudou lembra |
| Obstáculo novo | `content/obstacles/` e `index.js` | Gerador, colisão, piloto automático (`blockedAt`) e desenho (`draw`) | Contrato do obstáculo ([#119](https://github.com/TARNAGS/resgate-espacial/issues/119)); 500 cenários; caminho provado | Só nas fases que o usam (as regras do gerador mudam) |
| Regras do gerador de uma fase (comprimento, corredor, pedras) | `content/worlds/` | O cenário, o tanque provado e o `tank` gravado | Bateria completa; atualizar `tank` se o teste pedir | Sim, sozinho |
| Semente de uma fase fixa | `content/worlds/` | O cenário inteiro e o tanque | Atualizar `tank`; fichas de ouro | Sim, sozinho |
| Tanque (`tank`, `refuelMargin`, `fuelAt`) | `content/worlds/` | Abastecer é preciso ou não (D-023, D-026) | Teste das fases fixas; fichas de ouro | Sim, sozinho |
| Modificador numa fase ou mundo | `content/worlds/` e `content/modifiers.js` | A física daquela fase | Testes de modificadores; fichas, se a fase tiver ficha | Sim, sozinho (desde a [#120](https://github.com/TARNAGS/resgate-espacial/issues/120)) |
| Chave de uma fase (`key`) | `content/worlds/` | O progresso salvo no aparelho e no perfil online; o ranking | **Nunca mudar depois de publicada** ([#117](https://github.com/TARNAGS/resgate-espacial/issues/117)) | Sim, e o progresso dos jogadores se perde |
| Cores do mundo (`theme`) | `content/worlds/` | Só o desenho | Teste do desenho ([#113](https://github.com/TARNAGS/resgate-espacial/issues/113)) | Não |
| Zoom da câmera (D-037) | `render/view.js` (`cameraZoomFor`) e `config/params.js` | **Quanto se vê à frente, e isso muda a dificuldade:** o automático se adapta à tela, o jogador só aproxima, e o zoom fixo de teste tira a corrida do ranking | Testes da câmera (`regras/camera.test.js`); conferir no iPhone e numa tela de iPhone SE | Não, mas o zoom fixo de teste tira a corrida do ranking |
| Controles na tela, modo da câmera | `config/params.js` (`VIEW_ONLY`), `render/`, `input/` | A imagem e o controle | Conferir no iPhone | Não |
| Textos do jogo | `main.js`, `content/worlds/` | As telas | Inglês (D-007); cabe na tela do iPhone deitado | Não |
| Sons e músicas | `platform/audio.js`, `platform/music.js`, `content/songs.js` | Reagem aos eventos | Teste da música; ouvir no iPhone | Não |
| Nome ou campos de um evento da partida | `core/match.js` | Som, mensagens, elogios e telemetria, que podem parar **em silêncio** | Fichas de ouro; contrato dos eventos ([#116](https://github.com/TARNAGS/resgate-espacial/issues/116)) | Não |
| Regras do banco online | `jogo/firebase/regras.json` e `config/online.js` | Ranking, perfil e telemetria | Colar o texto **inteiro** no console; o Claude confere pelo terminal (`CLAUDE.md`) | Não |

## 4. Acoplamentos que já conhecemos

São ligações de propósito ou pontos frágeis. Cada um tem dono:

| Acoplamento | Por que existe | O que fazer |
|---|---|---|
| **Física → tanque → ranking** | O tanque de cada fase sai do piloto automático voando com a física atual (D-018, D-023, D-026) | Mudou a física? Rodar a bateria completa, atualizar `tank` e saber que o ranking recomeça |
| **Tanque gravado nas fases fixas** | O jogo não roda o piloto no aparelho, para o cenário e o tanque serem iguais em todo navegador | O teste das fases fixas avisa quando o valor gravado ficou velho |
| **Chave da fase = progresso salvo** | O aparelho e o perfil online guardam o progresso pela chave | Chave publicada nunca muda ([#117](https://github.com/TARNAGS/resgate-espacial/issues/117)) |
| **Formato da nave em dois lugares** | A colisão usa um triângulo; o desenho tem o seu, com um entalhe embaixo e a chama na mão | [#121](https://github.com/TARNAGS/resgate-espacial/issues/121): um formato único |
| **Chave do ranking incompleta** | A lista de física da chave era escrita à mão | **Resolvido** ([#120](https://github.com/TARNAGS/resgate-espacial/issues/120)): a chave se monta sozinha. Um parâmetro novo de jogo entra em `SINCE` (`core/ranking.js`) com o valor do dia, e um teste lembra |
| **Mudança de código de regra não recomeça o ranking** | A chave olha os números e a fase, não o código | **Resolvido** ([#120](https://github.com/TARNAGS/resgate-espacial/issues/120)): subir `RULES_VERSION` quando uma regra mudar de propósito |
| **Piloto automático e regras andam juntos** | O piloto usa as mesmas funções da partida | Mudou a física ou o contato? O piloto, o tanque e as fichas mudam juntos |
| **Desenho do obstáculo junto das regras dele** | `draw` mora em `content/obstacles/rock.js` | [#124](https://github.com/TARNAGS/resgate-espacial/issues/124): o desenho vai para a skin |
| **`main.js` e `renderer.js` grandes** | Cresceram com cada tela e cada aviso (751 e 685 linhas) | [#123](https://github.com/TARNAGS/resgate-espacial/issues/123) e [#125](https://github.com/TARNAGS/resgate-espacial/issues/125) |

## 5. Guardas automáticas

Testes que tocam o alarme quando algo muda sem querer. Ficam em `jogo/testes/`, divididos por assunto (`regras/`, `conteudo/`, `plataforma/`, `arquitetura/` e `ouro/`).

| Guarda | O que pega | Onde | Bateria |
|---|---|---|---|
| Camadas ([#112](https://github.com/TARNAGS/resgate-espacial/issues/112)) | Regra que importa o desenho, regra que usa o navegador, alguém importando o `main.js`, pasta nova sem regra | `arquitetura/camadas.test.js` | Rápida |
| O desenho só lê ([#113](https://github.com/TARNAGS/resgate-espacial/issues/113)) | Desenho que escreve no estado da partida, em todas as fases, situações e controles | `arquitetura/desenho-so-le.test.js` | Rápida |
| Fichas de ouro ([#114](https://github.com/TARNAGS/resgate-espacial/issues/114)) | Qualquer mudança nas regras: 8 rotas do piloto e 9 corridas montadas para bater ou pousar | `ouro/` | Rápida |
| Contrato dos eventos ([#116](https://github.com/TARNAGS/resgate-espacial/issues/116)) | Evento fora da lista ou com campos diferentes, em todos os testes; quem avisa ou escuta um nome errado | `arquitetura/eventos.test.js` e o canal estrito de `lib.js` | Rápida |
| Contrato da fase e do mundo ([#117](https://github.com/TARNAGS/resgate-espacial/issues/117)) | Campo faltando, chave repetida ou publicada que sumiu, semente ou tanque faltando, obstáculo ou modificador que não existe, cor do tema faltando, texto fora do inglês ou grande demais | `conteudo/contrato-fase.test.js` e `conteudo/chaves-publicadas.json` | Rápida |
| Contrato do obstáculo ([#119](https://github.com/TARNAGS/resgate-espacial/issues/119)) | Função faltando, sorteio que muda com a mesma semente, obstáculo sem passagem, colisão que não bate, piloto que não desvia de onde bate, desenho maior que os limites | `conteudo/contrato-obstaculo.test.js` | Rápida |
| Parâmetros e ranking ([#120](https://github.com/TARNAGS/resgate-espacial/issues/120)) | Parâmetro sem classificação, ordem das camadas, chave que não muda quando o jogo muda (ou que muda por aparência), chave de hoje que mudou | `regras/cadeia-e-ranking.test.js` | Rápida |
| Regras do documento 02 | Física, controles, pouso, combustível, vidas, resgate, progresso, elogios | `regras/` | Rápida |
| Cenários e caminho provado (D-014, D-018, D-023) | Fase sem solução, tanque errado, abastecer que deixou de ser preciso | `conteudo/` | Completa |
| Fases fixas ([#87](https://github.com/TARNAGS/resgate-espacial/issues/87)) | Tanque gravado desatualizado | `conteudo/caminho-provado.test.js` | Completa |

**Comandos**, na pasta do projeto:
- `node jogo/testes/rodar.js --rapido`: a cada mudança. Leva uns 3 segundos.
- `node jogo/testes/rodar.js`: antes de cada commit que mexe no jogo e antes de publicar. Os testes completos crescem com o número de fases.
- `node jogo/testes/rodar.js --atualizar-ouro`: só quando uma regra mudou de propósito. Regrava as fichas, e a diferença aparece no commit.
- `node jogo/testes/rodar.js "#94"`: só os testes com esse texto no nome.

## 6. Como usar este documento

1. **Antes de mudar o jogo**, ache a linha na seção 3 e veja o que muda junto e o que conferir.
2. **Mudou uma regra de propósito?**
   - regrave as fichas de ouro e confira a diferença;
   - lembre que o ranking pode recomeçar;
   - registre a mudança no documento 02 e, se for uma decisão, no registro de decisões.
3. **Criou um acoplamento novo** (uma peça que passa a depender de outra)? Acrescente uma linha na seção 3 ou 4.
4. **Pasta nova em `jogo/src`?** Ela entra na tabela da seção 1 e na tabela do teste das camadas.

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 0.1 | 07/10/2026 | Primeira versão ([#111](https://github.com/TARNAGS/resgate-espacial/issues/111)): camadas, três tipos de mudança, mapa de impacto, acoplamentos e guardas automáticas, junto com as tarefas [#112](https://github.com/TARNAGS/resgate-espacial/issues/112) a [#115](https://github.com/TARNAGS/resgate-espacial/issues/115) |
| 0.2 | 07/10/2026 | Onda 3 da abstração ([#116](https://github.com/TARNAGS/resgate-espacial/issues/116) a [#120](https://github.com/TARNAGS/resgate-espacial/issues/120)): tabela dos eventos, contratos da fase, do obstáculo e dos parâmetros, cadeia de parâmetros, chave do ranking que se monta sozinha, um arquivo por mundo e as guardas novas |
