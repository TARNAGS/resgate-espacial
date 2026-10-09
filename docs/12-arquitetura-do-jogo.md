# Arquitetura do Jogo e Mapa de Impacto — Resgate Espacial

| Campo | Valor |
|---|---|
| Documento | 12 — Arquitetura do jogo e mapa de impacto |
| Versão | 0.8 |
| Data | 08/10/2026 |
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
| `app` | Os fluxos do jogo ([#125](https://github.com/TARNAGS/resgate-espacial/issues/125)): partida, mensagens, telemetria da tentativa, configurações, abertura, DEMO e attract mode, patch note, nickname e ranking, aparelho e o laço principal | Todas as camadas, menos o `main.js` | Só o `main.js` importa os fluxos |
| `main.js` | Cria as peças e liga os fluxos | Tudo | Ninguém importa o `main.js` |

Regras, conteúdo e números também rodam no Node, nos testes e no piloto automático. Por isso **não tocam no navegador** (`window`, `document`, `localStorage`, `fetch`...).

**Peças do desenho** ([#123](https://github.com/TARNAGS/resgate-espacial/issues/123)): o `render/renderer.js` só guarda o estado do desenho (câmera, partículas, mensagens e avisos) e põe as camadas na ordem do quadro. Cada camada é uma peça pequena, criada com o mesmo kit (`ctx`, a tela, o estado do desenho e as medidas da câmera):

| Peça | O que desenha |
|---|---|
| `camera.js` | Não desenha: escala, o que cabe na tela, limites da câmera e a regra de manter a nave longe dos polegares |
| `sky.js` | Céu de estrelas (semente fixa, para o desenho de ouro) |
| `cave.js` | Teto e chão, barreiras nas pontas da fase e obstáculos |
| `pads.js` | Plataformas e o aviso de pouso nas luzes delas |
| `crew.js` | Tripulação acenando e correndo no embarque |
| `ship.js` | Nave, chama, halo do pouso e destroços da explosão |
| `hud.js` | Painel: fase, combustível e avisos, vidas, tripulação, cronômetro, rodapé e a seta do objetivo |
| `messages.js` | Mensagens no alto, elogios e NO FUEL |
| `controls.js` | Direcional, botão do propulsor, botões redondos e o selo da DEMO |
| `skins/` | As skins ([#124](https://github.com/TARNAGS/resgate-espacial/issues/124)): como desenhar a nave, a chama, cada obstáculo e as cores do mundo. A `classic` é o visual de sempre; a `hitbox` mostra as formas que batem |
| `style.js` | A fonte comum |
| `intro.js` e `intro-art.js` | A abertura: o controle das telas e da música, e os desenhos de cada tela |

**Fluxos do jogo** ([#125](https://github.com/TARNAGS/resgate-espacial/issues/125)): o `main.js` só cria as peças (tela, desenho, eventos, telas, controles, som e telemetria) e liga os fluxos, que ficam em `app/`. Os fluxos se chamam uns aos outros (a partida chama o ranking, que chama o menu...), então falam por um objeto só, o **kit** `g` (`app/kit.js`): cada fluxo recebe o kit, acrescenta as funções dele, e as dos outros são procuradas só na hora da chamada.

| Fluxo | O que faz |
|---|---|
| `messages.js` | Mensagens e efeitos na tela ligados aos eventos da partida (objetivo, pousos, embarque, elogios, avisos de combustível, batidas e vidas) |
| `run.js` | Telemetria de cada tentativa: começo, pousos, batidas, elogios, trajetória, fim e o envio da fila ao sair do app |
| `play.js` | A partida: começar uma fase, pausar, resultado, voltar ao menu, botões na tela e a dica do polegar |
| `settings.js` | Configurações (som, controle, câmera, apagar o progresso), o painel de ajuste escondido e os parâmetros pelo endereço |
| `intro-flow.js` | A abertura e o PLAY do menu (no primeiro PLAY, a abertura vem antes) |
| `demo.js` | DEMO e attract mode |
| `patch-note.js` | A linha do patch note no menu |
| `ranking.js` | Nickname, ranking e perfil no banco |
| `device.js` | Toque sem rolar, pausa ao sair do app e o aviso para girar o celular |
| `loop.js` | O laço principal: passo fixo da física, DEMO, attract mode e o desenho de cada quadro |

A ordem em que o `main.js` liga os fluxos conta para quem escuta o mesmo evento: as mensagens antes da telemetria, e a telemetria antes do resultado.

A tabela é conferida por um teste ([#112](https://github.com/TARNAGS/resgate-espacial/issues/112), `jogo/testes/arquitetura/camadas.test.js`). Uma pasta nova precisa entrar na tabela do teste e nesta seção.

**Como as camadas conversam:**
- **Eventos:** a partida avisa o que aconteceu (pousou, explodiu, abasteceu, concluiu), e quem precisa reage (som, mensagens, elogios, telemetria). As regras não chamam o som; o som escuta as regras. A lista dos eventos é um contrato (tabela abaixo).
- **Contratos:** cada peça de conteúdo segue um formato conferido por teste.
  - **Obstáculo** ([#119](https://github.com/TARNAGS/resgate-espacial/issues/119)): responde às mesmas perguntas (`generate`, `bounds`, `hits`, `validate`, `blockedAt`, mais um `example`; lista em `content/obstacles/index.js`). O desenho saiu do obstáculo e foi para as skins ([#124](https://github.com/TARNAGS/resgate-espacial/issues/124)). A colisão, o gerador e o piloto automático só falam com o contrato e não sabem o que é uma pedra.
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
| `start` | def, seed | `app/play.js` | mensagens do início da fase (objetivo e dicas) |
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
| **Aparência** | Cores dos mundos, skins da nave, do propulsor e dos obstáculos, formatos de nave de aparência (D-034), evoluções só visuais (D-035) | Mudar à vontade, sem nunca alterar uma regra | O desenho só lê ([#113](https://github.com/TARNAGS/resgate-espacial/issues/113)). A skin não define o casco ([#124](https://github.com/TARNAGS/resgate-espacial/issues/124)) | Desde a [#124](https://github.com/TARNAGS/resgate-espacial/issues/124), a aparência é uma skin (`render/skins/`): trocar de skin não muda o que bate nem o ranking, e a nave que a skin desenha fica a até 3 unidades do casco |
| **Conteúdo** | Mundos, fases, obstáculos, naves que mudam o jogo, evoluções de atributos | Entrar sem mexer no motor, seguindo o contrato | Contratos conferidos por teste ([#116](https://github.com/TARNAGS/resgate-espacial/issues/116) a [#120](https://github.com/TARNAGS/resgate-espacial/issues/120), [#122](https://github.com/TARNAGS/resgate-espacial/issues/122)) | Fase e mundo, evento, obstáculo e parâmetros têm contrato conferido desde 07/10/2026. Falta o da nave ([#121](https://github.com/TARNAGS/resgate-espacial/issues/121), [#122](https://github.com/TARNAGS/resgate-espacial/issues/122)) |
| **Regra** | Física, colisão, pouso, combustível, cronômetro, vidas | Mudar pouco e de propósito | Fichas de ouro ([#114](https://github.com/TARNAGS/resgate-espacial/issues/114)) e testes das regras do documento 02 | As fichas existem desde 07/10/2026 |

### 2.1 Nave de aparência e nave que muda o jogo (D-034, [#122](https://github.com/TARNAGS/resgate-espacial/issues/122))

Toda nave fica em `jogo/src/content/ships/`. A regra da D-034 vira código e teste:

| | Nave de aparência (o padrão) | Nave que muda o jogo |
|---|---|---|
| Como se marca | Nada: toda nave é de aparência, a não ser que diga o contrário | `changesGameplay: true` na definição |
| O que pode mudar | Só o desenho: contorno, chama (bocal) e para onde a tripulação corre (porta) | Também o casco, os pés e os atributos (`modifiers`) |
| Casco e atributos | Os da clássica, sempre: `resolveShip` os impõe mesmo que a definição tente outros, e o contrato acusa a tentativa | Os dela; o contrato confere que o casco é válido (pelo menos 3 vértices, com área, sem bordas que se cruzam), que os pés e a porta ficam na base e que o bocal fica atrás |
| Prova | Nenhuma | Cabe em cada fase (o diâmetro dela, que gira, menor que o corredor mínimo e que a passagem ao lado das pedras) **e** o piloto automático conclui cada fase fixa com ela, no cenário fixo (D-018 para cada nave) |
| Ranking | Não mexe: a chave é a mesma da clássica | Ranking próprio: a chave inclui a nave |
| Tanque das fases fixas | O de sempre | Hoje, o mesmo da clássica. Recalcular o tanque para cada configuração é a pendência P-024 |

**Por que as duas provas:** a conta do tamanho é rápida, mas não basta. Uma nave de teste com o triplo do tamanho da clássica (65 de diâmetro contra 22) passa na conta do nível 3, cuja passagem ao lado das pedras mede 85, mas o piloto automático não consegue concluir o cenário fixo do nível 3 com ela. O teste do contrato registra exatamente isso.

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
| Formato ou tamanho da nave | `content/ships/` (a nave clássica, em `classic.js`): casco, pés, bocal, porta e contorno desenhado | Colisão, pouso, previsão de pouso, piloto automático, elogios, desenho da nave, da chama e da tripulação: todos leem a mesma definição desde a [#121](https://github.com/TARNAGS/resgate-espacial/issues/121) | Fichas de ouro; teste da nave (`regras/nave.test.js`), que confere que o contorno desenhado fica perto do casco | Hoje, não sozinho. Pela D-034, só a nave que muda o jogo deve mexer no ranking ([#122](https://github.com/TARNAGS/resgate-espacial/issues/122)) |
| Regra de contato ou de batida (código) | `core/collision.js` | A partida e o piloto automático, que usam a mesma função | Fichas de batida e de rotas; caminho provado (D-018) | **Não sozinho**: mudar código de regra não muda a chave. Para recomeçar, suba `RULES_VERSION` em `core/ranking.js`; a ficha de ouro que mudou lembra |
| Obstáculo novo | `content/obstacles/` e `index.js` | Gerador, colisão, piloto automático (`blockedAt`) e desenho (`draw`) | Contrato do obstáculo ([#119](https://github.com/TARNAGS/resgate-espacial/issues/119)); 500 cenários; caminho provado | Só nas fases que o usam (as regras do gerador mudam) |
| Contrato da skin ([#124](https://github.com/TARNAGS/resgate-espacial/issues/124)) | Skin sem nave, chama ou cores; skin que não desenha um obstáculo do catálogo; skin que tenta definir o casco; nave desenhada a mais de 3 unidades do casco (com o alarme conferido); skin que muda a chave do ranking ou tira a corrida do ranking; painel com skins diferentes do catálogo | `conteudo/contrato-skin.test.js` | Rápida |
| Regras do gerador de uma fase (comprimento, corredor, pedras) | `content/worlds/` | O cenário, o tanque provado e o `tank` gravado | Bateria completa; atualizar `tank` se o teste pedir | Sim, sozinho |
| Semente de uma fase fixa | `content/worlds/` | O cenário inteiro e o tanque | Atualizar `tank`; fichas de ouro | Sim, sozinho |
| Tanque (`tank`, `refuelMargin`, `fuelAt`) | `content/worlds/` | Abastecer é preciso ou não (D-023, D-026) | Teste das fases fixas; fichas de ouro | Sim, sozinho |
| Modificador numa fase ou mundo | `content/worlds/` e `content/modifiers.js` | A física daquela fase | Testes de modificadores; fichas, se a fase tiver ficha | Sim, sozinho (desde a [#120](https://github.com/TARNAGS/resgate-espacial/issues/120)) |
| Chave de uma fase (`key`) | `content/worlds/` | O progresso salvo no aparelho e no perfil online; o ranking | **Nunca mudar depois de publicada** ([#117](https://github.com/TARNAGS/resgate-espacial/issues/117)) | Sim, e o progresso dos jogadores se perde |
| Cores do mundo (`theme`) | `content/worlds/` | Só o desenho | Teste do desenho ([#113](https://github.com/TARNAGS/resgate-espacial/issues/113)) | Não |
| Skin nova ou mudada (nave, chama, obstáculos, cores) | `render/skins/` e as opções do parâmetro `skin` em `config/params.js` | Só o desenho | Contrato da skin ([#124](https://github.com/TARNAGS/resgate-espacial/issues/124)) e o desenho só lê; se mudou a `classic`, o desenho de ouro (regravar de propósito) | Não (D-034 e D-035) |
| Zoom da câmera (D-037) | `render/view.js` (`cameraZoomFor`) e `config/params.js` | **Quanto se vê à frente, e isso muda a dificuldade:** o automático se adapta à tela, o jogador só aproxima, e o zoom fixo de teste tira a corrida do ranking | Testes da câmera (`regras/camera.test.js`); conferir no iPhone e numa tela de iPhone SE | Não, mas o zoom fixo de teste tira a corrida do ranking |
| Controles na tela, modo da câmera | `config/params.js` (`VIEW_ONLY`), `render/`, `input/` | A imagem e o controle | Conferir no iPhone | Não |
| Textos do jogo | `app/` (mensagens e telas), `content/worlds/` | As telas | Inglês (D-007); cabe na tela do iPhone deitado | Não |
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
| **Formato da nave em dois lugares** | A colisão usava um triângulo; o desenho tinha o seu, com um entalhe embaixo e a chama na mão | **Resolvido** ([#121](https://github.com/TARNAGS/resgate-espacial/issues/121)): uma definição só, em `content/ships/`; o entalhe ficou como contorno desenhado, dentro do casco, e um teste confere a folga |
| **Chave do ranking incompleta** | A lista de física da chave era escrita à mão | **Resolvido** ([#120](https://github.com/TARNAGS/resgate-espacial/issues/120)): a chave se monta sozinha. Um parâmetro novo de jogo entra em `SINCE` (`core/ranking.js`) com o valor do dia, e um teste lembra |
| **Mudança de código de regra não recomeça o ranking** | A chave olha os números e a fase, não o código | **Resolvido** ([#120](https://github.com/TARNAGS/resgate-espacial/issues/120)): subir `RULES_VERSION` quando uma regra mudar de propósito |
| **Piloto automático e regras andam juntos** | O piloto usa as mesmas funções da partida | Mudou a física ou o contato? O piloto, o tanque e as fichas mudam juntos |
| **Desenho do obstáculo junto das regras dele** | `draw` mora em `content/obstacles/rock.js` | [#124](https://github.com/TARNAGS/resgate-espacial/issues/124): o desenho vai para a skin |
| **Vídeo de apresentação usa as peças do jogo** | `jogo/ferramentas/video/` desenha com o renderer e a abertura, toca a música e os efeitos de `platform/` e joga as fases com o piloto. Para isso, lê alguns detalhes por dentro (os campos da abertura e o `Sound.ctx`) e repete parte das mensagens da partida, que ficam em `app/messages.js` (sem o objetivo e as dicas do início, de propósito) | Mexeu no desenho, na abertura, no som, nas mensagens ou no piloto? `node jogo/ferramentas/video/gravar.mjs --fotos 1,5,9` e olhar as fotos. Mudou uma mensagem em `app/messages.js`? Ver se o vídeo precisa da mesma mudança |
| **Fluxos ligados pelo kit** ([#125](https://github.com/TARNAGS/resgate-espacial/issues/125)) | Os fluxos de `app/` se chamam uns aos outros pelo kit `g`, procurando a função só na hora da chamada. Um nome errado só aparece quando aquela função roda, e os fluxos rodam só no navegador, fora dos testes do Node | Mexeu em `app/`? Rodar no navegador o roteiro menu → fase → pausa → resultado → ranking → DEMO → abertura → configurações. Com o navegador escondido, o laço não roda sozinho: `window.__game.kit.loop(t)` avança um quadro |

## 5. Guardas automáticas

Testes que tocam o alarme quando algo muda sem querer. Ficam em `jogo/testes/`, divididos por assunto (`regras/`, `conteudo/`, `plataforma/`, `arquitetura/` e `ouro/`).

| Guarda | O que pega | Onde | Bateria |
|---|---|---|---|
| Camadas ([#112](https://github.com/TARNAGS/resgate-espacial/issues/112)) | Regra que importa o desenho, regra que usa o navegador, alguém importando o `main.js`, pasta nova sem regra | `arquitetura/camadas.test.js` | Rápida |
| O desenho só lê ([#113](https://github.com/TARNAGS/resgate-espacial/issues/113)) | Desenho que escreve no estado da partida, em todas as fases, situações e controles | `arquitetura/desenho-so-le.test.js` | Rápida |
| Desenho de ouro ([#123](https://github.com/TARNAGS/resgate-espacial/issues/123)) | Desenho que muda sem querer: os comandos de desenho de 162 quadros (todas as fases, 9 situações, 3 controles) viram impressões digitais, com os sorteios da chama e das faíscas fixados. Mudou de propósito? `--atualizar-ouro`; o desenho completo de cada quadro fica em `jogo/ferramentas/saida/desenho/` para comparar | `ouro/desenho.test.js` e `ouro/desenho.json` | Completa |
| Fichas de ouro ([#114](https://github.com/TARNAGS/resgate-espacial/issues/114)) | Qualquer mudança nas regras: 8 rotas do piloto e 9 corridas montadas para bater ou pousar | `ouro/` | Rápida |
| Contrato dos eventos ([#116](https://github.com/TARNAGS/resgate-espacial/issues/116)) | Evento fora da lista ou com campos diferentes, em todos os testes; quem avisa ou escuta um nome errado | `arquitetura/eventos.test.js` e o canal estrito de `lib.js` | Rápida |
| Contrato da fase e do mundo ([#117](https://github.com/TARNAGS/resgate-espacial/issues/117)) | Campo faltando, chave repetida ou publicada que sumiu, semente ou tanque faltando, obstáculo ou modificador que não existe, cor do tema faltando, texto fora do inglês ou grande demais | `conteudo/contrato-fase.test.js` e `conteudo/chaves-publicadas.json` | Rápida |
| Nave ([#121](https://github.com/TARNAGS/resgate-espacial/issues/121)) | Desenho da nave que passa do casco, ou casco que fica longe do desenho; pés, bocal ou porta fora da base | `regras/nave.test.js` | Rápida |
| Contrato da nave ([#122](https://github.com/TARNAGS/resgate-espacial/issues/122)) | Nave de aparência com casco, pés ou atributos próprios; casco inválido; nave que muda o jogo e não cabe numa fase, que o piloto não prova no cenário fixo ou que divide o ranking com a clássica | `conteudo/contrato-nave.test.js` | Rápida (a prova pelo piloto, completa) |
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
| 0.8 | 09/10/2026 | Onda 5, última tarefa ([#125](https://github.com/TARNAGS/resgate-espacial/issues/125)): o `main.js` dividido em fluxos na pasta `app/`, camada nova na tabela da seção 1 e no teste, o kit dos fluxos, e os acoplamentos do vídeo e dos fluxos atualizados |
| 0.7 | 08/10/2026 | Onda 5, segunda tarefa ([#124](https://github.com/TARNAGS/resgate-espacial/issues/124)): camada de skins, com a `classic` e a `hitbox`; o desenho dos obstáculos saiu do conteúdo; contrato da skin e linha nova no mapa de impacto |
| 0.6 | 08/10/2026 | Onda 5, primeira tarefa ([#123](https://github.com/TARNAGS/resgate-espacial/issues/123)): o desenho dividido em peças (tabela na seção 1), a abertura separada dos desenhos dela e a guarda do desenho de ouro |
| 0.5 | 08/10/2026 | Acoplamento novo: o vídeo de apresentação (`jogo/ferramentas/video/`) usa o desenho, a abertura, o som e o piloto do jogo |
| 0.4 | 08/10/2026 | Onda 4, segunda tarefa ([#122](https://github.com/TARNAGS/resgate-espacial/issues/122)): seção 2.1 (nave de aparência e nave que muda o jogo), guardas da nave e do contrato da nave |
| 0.3 | 08/10/2026 | Onda 4, primeira tarefa ([#121](https://github.com/TARNAGS/resgate-espacial/issues/121)): o formato da nave vira dado, em `content/ships/`; mapa de impacto e acoplamentos atualizados |
| 0.2 | 07/10/2026 | Onda 3 da abstração ([#116](https://github.com/TARNAGS/resgate-espacial/issues/116) a [#120](https://github.com/TARNAGS/resgate-espacial/issues/120)): tabela dos eventos, contratos da fase, do obstáculo e dos parâmetros, cadeia de parâmetros, chave do ranking que se monta sozinha, um arquivo por mundo e as guardas novas |
