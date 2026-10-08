# Jogo

O jogo de verdade, construído a partir do [protótipo 01](../prototipos/README.md). JavaScript puro com Canvas, em módulos do navegador, sem framework e sem etapa de build (D-011).

## Como rodar

Na pasta do projeto:

- Jogo: `node jogo/servir.js` e abrir http://localhost:8081. No celular, no mesmo Wi-Fi: `http://<IP do computador>:8081`.
- Relatório da telemetria do playtest (#88): `node jogo/ferramentas/relatorio-telemetria.mjs`, com `--desde AAAA-MM-DD` para um período e `--incluir-local` para ver também os testes no computador.
- Testes automáticos:
  - `node jogo/testes/rodar.js --rapido` a cada mudança (uns 3 s): regras do documento 02, camadas, desenho e fichas de ouro;
  - `node jogo/testes/rodar.js` antes de cada commit e antes de publicar: também os 500 cenários aleatórios de cada nível e o piloto automático provando cada fase, que crescem com o número de fases;
  - `node jogo/testes/rodar.js --atualizar-ouro`: regrava as fichas de ouro, só quando uma regra mudou de propósito. A diferença das fichas aparece no commit;
  - `node jogo/testes/rodar.js "#94"`: só os testes com esse texto no nome.

Antes de mudar o jogo, veja o [mapa de impacto](../docs/12-arquitetura-do-jogo.md): o que cada mudança afeta e o que conferir.

Rodando em `localhost`, o ranking fica só no computador, para os testes não entrarem no ranking real dos jogadores; `http://localhost:8081/?online` liga o banco mesmo assim.

Os módulos do navegador não abrem com dois cliques no `index.html` (`file://`): o jogo precisa de um servidor, como o `servir.js`.

## Onde está cada coisa

| Pasta | O que tem | Muda quando |
|---|---|---|
| `src/config/params.js` | Parâmetros de ajuste: gravidade, propulsor, giro, pouso, direcional | A calibragem do teste muda a sensação |
| `src/content/worlds.js` e `src/content/worlds/` | Mundos e níveis, um arquivo por mundo (mais os desafios e o treino): nome, objetivo, regras do gerador, modificadores. O `worlds.js` junta tudo e explica os campos | Uma fase nova é definida (P-011) |
| `src/content/patchnotes.js` | A linha do patch note de cada versão (#126) | A versão sobe para uma rodada de playtest |
| `src/content/obstacles/` | Catálogo de obstáculos; um arquivo por tipo | Um obstáculo novo é definido (P-011) |
| `src/content/modifiers.js` | Modificadores: gravidade, tanque, vento e nave mais pesada na volta | Os modificadores são decididos (P-012) |
| `src/core/` | Regras: física da nave, contato e pouso, partida, gerador, pontuação e progresso | Uma regra do documento 02 muda |
| `src/core/ranking.js`, `src/platform/leaderboard.js` e `src/ui/ranking.js` | Nickname e ranking por fase (#87): regras, banco (no aparelho e online) e tela | O banco online ou as regras do ranking mudam |
| `src/config/online.js` | Endereço do banco online do ranking (Firebase `resgate-espacial`) e o resumo das regras do banco; vazio = ranking só no aparelho | O banco é trocado |
| `src/platform/telemetry.js` | Telemetria do playtest (#88, D-025): fila de eventos no aparelho, envio em lotes ao Firebase e medidor de quadros por segundo | Um evento novo é medido, ou a P-008 é decidida para o lançamento |
| `ferramentas/relatorio-telemetria.mjs` | Relatório da telemetria no terminal: por fase (tentativas, conclusões, mortes e onde), por aparelho (quadros por segundo) e a abertura | Um evento novo precisa aparecer no relatório |
| `src/core/praise.js` | Detecta manobras difíceis e avisa o elogio (#81): fininho, freada no limite, pouso perfeito e corrida perfeita | Os critérios dos elogios mudam |
| `src/core/autopilot.js` | Piloto automático com dois jeitos de voar: o cauteloso, que prova cada cenário e calcula o tanque (D-018), e o expert, que voa como os melhores jogadores e mede o melhor que dá para fazer (D-026) | A física ou um obstáculo novo mudam |
| `src/core/scoring.js` | Pontuação: hoje só o tempo | P-006 é decidida |
| `src/platform/storage.js` | O que fica salvo no aparelho e onde | P-016 é decidida, ou o jogo vai para as lojas (#65) |
| `src/platform/audio.js` | Efeitos sonoros | A pesquisa de som no iPhone (#57) volta |
| `src/platform/music.js` e `src/content/songs.js` | Motor de música chiptune (Web Audio, sem arquivos) e as partituras | Uma música nova ou mudança na da abertura |
| `src/input/` | Teclado, direcional virtual e a junção dos dois | A variante final do direcional é escolhida (#44) |
| `src/render/` | Desenho no Canvas | A identidade visual chega (E-19) |
| `src/ui/` | Menu, mapa de progresso, avisos e painel de ajuste | — |
| `testes/` | Testes automáticos, por assunto: `regras/`, `conteudo/`, `plataforma/`, `arquitetura/` (camadas e desenho só lê) e `ouro/` (fichas de ouro); `rodar.js` roda tudo, e `lib.js` tem as peças comuns | Junto com cada mudança de regra |
| `firebase/regras.json` | Cópia completa das regras publicadas no banco (ranking, telemetria e perfil) | As regras do banco mudam: colar o texto inteiro no console |

As regras (`core`) não tocam no navegador: avisam o que aconteceu por eventos (pousou, explodiu, concluiu), e o som, as mensagens e a pontuação reagem. A medição (E-17) vai se ligar aos mesmos eventos.

## Caminho provado e abastecer obrigatório (D-018 e D-023)

Ao gerar um cenário, o piloto automático joga a fase inteira, ida e volta, sem abastecer, e fica com a corrida que gastou menos combustível. Com isso:

- **Fase com posto** (`fuelStation: true`): o piloto também voa as rotas com o posto (abastecendo na ida ou na volta). O tanque é o maior desses dois planos mais `refuelMargin` (por exemplo, 0.08 = 8%) e precisa ser menor que a corrida sem abastecer (D-023): é obrigatório abastecer uma vez.
- **Fase sem posto:** o tanque é `tankSeconds` ou a melhor corrida mais 25%, o que for maior.
- Se o piloto não conseguir concluir um cenário, o gerador troca a semente. Toda fase jogada tem caminho provado.
- **Piloto expert** (D-026): voa como os melhores jogadores (acelera forte, deixa a nave ir, freia forte e deixa cair no pouso) e mede o melhor que dá para fazer. Para ver os números do tanque das fases com posto, inclusive com o posto em outro lugar (`fuelAt`): `node jogo/ferramentas/medir-tanque.mjs hoje,0.75`. Por enquanto, o tanque continua saindo do piloto cauteloso (#93).

Os testes reproduzem a melhor corrida numa partida de verdade, com o tanque real, e conferem que ela conclui sem abastecer e com a sobra esperada.

## Como criar uma fase

Cada mundo tem um arquivo em `src/content/worlds/` (#118); `src/content/worlds.js` junta os mundos na ordem do jogo e explica cada campo. Para uma fase nova, acrescente um nível no arquivo do mundo (por exemplo, `w1.js`). Exemplo:

```js
{
  key: 'w1-4',                     // nunca mudar depois de publicado: é a chave do progresso salvo
  seed: 401,                       // cenário fixo, igual para todos (D-021)
  name: 'NARROW PASS',
  goal: 'Squeeze through the tunnels.',
  generator: { length: 3400, minGap: 140, roughness: 90, fuelStation: true, refuelMargin: 0.05, tank: 0,
               obstacles: [{ type: 'rock', count: 6, passGap: 80 }] },
  modifiers: [{ type: 'gravity', scale: 1.3 }],
}
```

O mapa de progresso cresce sozinho. Depois, rode os testes:
- **bateria rápida:** o contrato da fase (#117) aponta campo faltando ou errado, dizendo a fase e o campo;
- **bateria completa:** gera 500 cenários do nível novo e confere que todos têm solução, o piloto automático prova a melhor corrida, e o teste das fases fixas diz o tanque (`tank`) a gravar no lugar do 0.

Quando a fase chegar aos jogadores, acrescente a chave dela em `testes/conteudo/chaves-publicadas.json`.

Um mundo novo é um arquivo novo em `src/content/worlds/`, com as cores do tema (o contrato confere todas as que o desenho usa), e uma linha em `WORLDS`, em `src/content/worlds.js`.

Desafios fora da sequência, sempre liberados no mapa, ficam em `src/content/worlds/challenges.js`. O primeiro é a **PRACTICE**, a fase mais difícil do jogo.

## Como criar um obstáculo

Copie `src/content/obstacles/rock.js`, com o `example` (um nível de exemplo), mude o comportamento e registre em `src/content/obstacles/index.js`, onde o contrato está explicado. O teste do contrato (#119) confere sozinho o obstáculo novo:
- as funções do contrato;
- o mesmo sorteio com a mesma semente;
- a passagem;
- a colisão;
- a faixa que o piloto automático evita;
- os limites do desenho.

Um obstáculo móvel implementa `update(o, time)`; a partida chama essa função a cada passo.

## Ferramentas de teste

- **Painel de ajuste (#42):** abrir o jogo com `?tuning`, ou tocar 5 vezes no subtítulo do menu, ou apertar a tecla `` ` ``. Durante a partida, o botão **T** abre o painel. Os valores mudam na hora, ficam salvos no aparelho e podem ser copiados.
- **Treino (#35):** no painel, TRAINING. Chão, paredes e uma plataforma, sem tripulação e sem perder vidas.
- **Atalho de nível:** com o painel liberado, `?level=w1-3`, `?level=training`, `?level=practice` ou `?level=bonus` abre direto a fase.
- **Fases fixas (D-021):** cada fase da sequência e a PRACTICE têm `seed` em `src/content/worlds.js`; a BONUS tem `random: true`.
- **Abertura (#76):** aparece sozinha no primeiro PLAY; para rever, Settings → WATCH INTRO, ou abra o jogo com `?intro` (pede um toque antes, para liberar o som). SKIP (ou Esc) pula e para a música. A música é o relógio da abertura: as telas começam nos compassos de `INTRO_SONG.scenes`. O desenho fica em `src/render/intro.js`.
- **Controle de toque (#44):** Settings → Touch control alterna entre A, o padrão (dois polegares: o esquerdo aponta e o direito acelera; a câmera mantém a nave longe dos polegares, D-022), e B (um polegar: tocar acelera e arrastar aponta), e a escolha fica salva no aparelho. Também dá para abrir com `?control=a` ou `?control=b`. Os botões do C só aparecem em telas de toque; no PC, o C funciona com o mouse apontando e ↑ ou Espaço no propulsor.
- **Câmera (#95, D-037):** o zoom se adapta à tela (1,15 nas telas compridas, até 1 nas mais quadradas, como o iPhone SE), e o jogador pode aproximar em Settings → CAMERA (AUTO, CLOSE ou CLOSER), salvo no aparelho. Para testar um valor fixo, use `?zoom=1.3` ou o "Camera zoom" do painel (0 = automático). Um valor fixo tira a corrida do ranking, porque ver mais da fase muda a dificuldade. As regras ficam em `src/render/view.js`.
- **Patch note (#126):** uma linha no alto do menu com o que mudou na versão, com SKIP.
  - O texto de cada versão fica em `src/content/patchnotes.js`, com a chave igual ao `BUILD` de `src/platform/telemetry.js`.
  - Aparece só para quem já jogava uma versão anterior, uma vez por versão, e o PLAY também fecha. As regras de quando aparece ficam em `src/core/patchnote.js`.
  - Para ver de novo no computador, no console do navegador:
    ```js
    s = JSON.parse(localStorage['resgate-espacial:save']); s.build = 'old'; s.seen = {}; localStorage['resgate-espacial:save'] = JSON.stringify(s)
    ```
    Depois, recarregue a página.
