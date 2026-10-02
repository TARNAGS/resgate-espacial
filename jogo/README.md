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
| `src/core/` | Regras: física da nave, partida, gerador, pontuação e progresso | Uma regra do documento 02 muda |
| `src/core/scoring.js` | Pontuação: hoje só o tempo | P-006 é decidida |
| `src/platform/storage.js` | O que fica salvo no aparelho e onde | P-016 é decidida, ou o jogo vai para as lojas (#65) |
| `src/platform/audio.js` | Efeitos sonoros | A pesquisa de som no iPhone (#57) volta |
| `src/input/` | Teclado, direcional virtual e a junção dos dois | A variante final do direcional é escolhida (#44) |
| `src/render/` | Desenho no Canvas | A identidade visual chega (E-19) |
| `src/ui/` | Menu, mapa de progresso, avisos e painel de ajuste | — |
| `testes/` | Testes automáticos | Junto com cada mudança de regra |

As regras (`core`) não tocam no navegador: avisam o que aconteceu por eventos (pousou, explodiu, concluiu), e o som, as mensagens e a pontuação reagem. A medição (E-17) vai se ligar aos mesmos eventos.

## Como criar uma fase

Acrescente um nível em `src/content/worlds.js`. Exemplo:

```js
{
  key: 'w1-4',                     // nunca mudar depois de publicado: é a chave do progresso salvo
  name: 'NARROW PASS',
  goal: 'Squeeze through the tunnels.',
  generator: { length: 3400, minGap: 140, roughness: 90, fuelStation: true, tankSeconds: 30,
               obstacles: [{ type: 'rock', count: 6, passGap: 80 }] },
  modifiers: [{ type: 'gravity', scale: 1.3 }],
}
```

O mapa de progresso cresce sozinho. Rode os testes: eles geram 500 cenários do nível novo e conferem que todos têm solução.

## Como criar um obstáculo

Copie `src/content/obstacles/rock.js`, mude o comportamento e registre em `src/content/obstacles/index.js`. Um obstáculo móvel implementa `update(o, time)`; a partida chama essa função a cada passo.

## Ferramentas de teste

- **Painel de ajuste (#42):** abrir o jogo com `?tuning`, ou tocar 5 vezes no subtítulo do menu, ou apertar a tecla `` ` ``. Durante a partida, o botão **T** abre o painel. Os valores mudam na hora, ficam salvos no aparelho e podem ser copiados.
- **Treino (#35):** no painel, PRACTICE. Chão, paredes e uma plataforma, sem tripulação e sem perder vidas.
- **Atalho de nível:** com o painel liberado, `?level=w1-3` ou `?level=practice` abre direto a fase.
- **Controle de toque (#44):** Settings → Touch control alterna entre A (tocar e segurar) e C (dois polegares: o esquerdo aponta e o direito acelera; a câmera mantém a nave longe dos polegares), e a escolha fica salva no aparelho. Também dá para abrir com `?control=a` ou `?control=c`. Os botões do C só aparecem em telas de toque; no PC, o C funciona com o mouse apontando e ↑ ou Espaço no propulsor.
