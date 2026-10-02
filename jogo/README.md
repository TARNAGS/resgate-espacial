# Jogo

O jogo de verdade, construído a partir do [protótipo 01](../prototipos/README.md). JavaScript puro com Canvas, em módulos do navegador, sem framework e sem etapa de build (D-011).

## Como rodar

Na pasta do projeto:

- Jogo: `node jogo/servir.js` e abrir http://localhost:8081. No celular, no mesmo Wi-Fi: `http://<IP do computador>:8081`.
- Testes automáticos: `node jogo/testes/rodar.js`. Eles conferem os critérios de aceite das histórias do M1, as regras do documento 02 e 500 cenários aleatórios de cada nível.

Os módulos do navegador não abrem com dois cliques no `index.html` (`file://`): o jogo precisa de um servidor, como o `servir.js`.

## Onde está cada coisa

| Pasta | O que tem | Muda quando |
|---|---|---|
| `src/config/params.js` | Parâmetros de ajuste: gravidade, propulsor, giro, pouso, direcional | A calibragem do teste muda a sensação |
| `src/content/worlds.js` | Mundos e níveis: nome, objetivo, regras do gerador, modificadores | Uma fase nova é definida (P-011) |
| `src/content/obstacles/` | Catálogo de obstáculos; um arquivo por tipo | Um obstáculo novo é definido (P-011) |
| `src/content/modifiers.js` | Modificadores: gravidade, tanque, vento e nave mais pesada na volta | Os modificadores são decididos (P-012) |
| `src/core/` | Regras: física da nave, contato e pouso, partida, gerador, pontuação e progresso | Uma regra do documento 02 muda |
| `src/core/ranking.js`, `src/platform/leaderboard.js` e `src/ui/ranking.js` | Nickname e ranking por fase (#87): regras, banco (no aparelho e online) e tela | O banco online ou as regras do ranking mudam |
| `src/config/online.js` | Endereço do banco online do ranking (Firebase); vazio = ranking só no aparelho | O banco é criado ou trocado |
| `src/core/praise.js` | Detecta manobras difíceis e avisa o elogio (#81): fininho, freada no limite, pouso perfeito e corrida perfeita | Os critérios dos elogios mudam |
| `src/core/autopilot.js` | Piloto automático que joga cada cenário gerado e prova a melhor corrida sem abastecer (D-018) | A física ou um obstáculo novo mudam |
| `src/core/scoring.js` | Pontuação: hoje só o tempo | P-006 é decidida |
| `src/platform/storage.js` | O que fica salvo no aparelho e onde | P-016 é decidida, ou o jogo vai para as lojas (#65) |
| `src/platform/audio.js` | Efeitos sonoros | A pesquisa de som no iPhone (#57) volta |
| `src/platform/music.js` e `src/content/songs.js` | Motor de música chiptune (Web Audio, sem arquivos) e as partituras | Uma música nova ou mudança na da abertura |
| `src/input/` | Teclado, direcional virtual e a junção dos dois | A variante final do direcional é escolhida (#44) |
| `src/render/` | Desenho no Canvas | A identidade visual chega (E-19) |
| `src/ui/` | Menu, mapa de progresso, avisos e painel de ajuste | — |
| `testes/` | Testes automáticos | Junto com cada mudança de regra |

As regras (`core`) não tocam no navegador: avisam o que aconteceu por eventos (pousou, explodiu, concluiu), e o som, as mensagens e a pontuação reagem. A medição (E-17) vai se ligar aos mesmos eventos.

## Caminho provado e abastecer obrigatório (D-018 e D-023)

Ao gerar um cenário, o piloto automático joga a fase inteira, ida e volta, sem abastecer, e fica com a corrida que gastou menos combustível. Com isso:

- **Fase com posto** (`fuelStation: true`): o piloto também voa as rotas com o posto (abastecendo na ida ou na volta). O tanque é o maior desses dois planos mais `refuelMargin` (por exemplo, 0.08 = 8%) e precisa ser menor que a corrida sem abastecer (D-023): é obrigatório abastecer uma vez.
- **Fase sem posto:** o tanque é `tankSeconds` ou a melhor corrida mais 25%, o que for maior.
- Se o piloto não conseguir concluir um cenário, o gerador troca a semente. Toda fase jogada tem caminho provado.

Os testes reproduzem a melhor corrida numa partida de verdade, com o tanque real, e conferem que ela conclui sem abastecer e com a sobra esperada.

## Como criar uma fase

Acrescente um nível em `src/content/worlds.js`. Exemplo:

```js
{
  key: 'w1-4',                     // nunca mudar depois de publicado: é a chave do progresso salvo
  name: 'NARROW PASS',
  goal: 'Squeeze through the tunnels.',
  generator: { length: 3400, minGap: 140, roughness: 90, fuelStation: true, bestRunMargin: 0.05,
               obstacles: [{ type: 'rock', count: 6, passGap: 80 }] },
  modifiers: [{ type: 'gravity', scale: 1.3 }],
}
```

O mapa de progresso cresce sozinho. Rode os testes: eles geram 500 cenários do nível novo e conferem que todos têm solução, e o piloto automático prova a melhor corrida de uma amostra deles.

Desafios fora da sequência, sempre liberados no mapa, ficam em `CHALLENGES`, no mesmo arquivo. O primeiro é a **PRACTICE**, a fase mais difícil do jogo.

## Como criar um obstáculo

Copie `src/content/obstacles/rock.js`, mude o comportamento e registre em `src/content/obstacles/index.js`. Um obstáculo móvel implementa `update(o, time)`; a partida chama essa função a cada passo.

## Ferramentas de teste

- **Painel de ajuste (#42):** abrir o jogo com `?tuning`, ou tocar 5 vezes no subtítulo do menu, ou apertar a tecla `` ` ``. Durante a partida, o botão **T** abre o painel. Os valores mudam na hora, ficam salvos no aparelho e podem ser copiados.
- **Treino (#35):** no painel, TRAINING. Chão, paredes e uma plataforma, sem tripulação e sem perder vidas.
- **Atalho de nível:** com o painel liberado, `?level=w1-3`, `?level=training`, `?level=practice` ou `?level=bonus` abre direto a fase.
- **Fases fixas (D-021):** cada fase da sequência e a PRACTICE têm `seed` em `src/content/worlds.js`; a BONUS tem `random: true`.
- **Abertura (#76):** aparece sozinha no primeiro PLAY; para rever, Settings → WATCH INTRO, ou abra o jogo com `?intro` (pede um toque antes, para liberar o som). SKIP (ou Esc) pula e para a música. A música é o relógio da abertura: as telas começam nos compassos de `INTRO_SONG.scenes`. O desenho fica em `src/render/intro.js`.
- **Controle de toque (#44):** Settings → Touch control alterna entre A, o padrão (dois polegares: o esquerdo aponta e o direito acelera; a câmera mantém a nave longe dos polegares, D-022), e B (um polegar: tocar acelera e arrastar aponta), e a escolha fica salva no aparelho. Também dá para abrir com `?control=a` ou `?control=b`. Os botões do C só aparecem em telas de toque; no PC, o C funciona com o mouse apontando e ↑ ou Espaço no propulsor.
