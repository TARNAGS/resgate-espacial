# Design de Mundos — Resgate Espacial

| Campo | Valor |
|---|---|
| Documento | 08 — Design de mundos |
| Versão | 0.1 |
| Data | 02/10/2026 |
| Status | Proposta |
| Responsável | Fernando Nunes (Product Manager) |

Este documento diz o que é um mundo, traz o modelo para documentar cada um e lista os mundos do jogo. Cada mundo tem o seu próprio documento, na pasta [`mundos/`](mundos/). As regras gerais do jogo continuam no [documento 02](02-regras-do-jogo.md).

## 1. Para que serve

O jogo é organizado em mundos de 10 fases, cada um com identidade visual própria ([D-020](05-registro-de-decisoes.md#d-020--big-picture-mundos-com-10-fases-cada-um-com-identidade-visual-própria)). Um documento por mundo garante que:

- o visual e as novidades de cada mundo sejam pensados antes de construir;
- a curva de dificuldade das 10 fases seja planejada de uma vez;
- arte, regras do gerador e som do mesmo mundo fiquem coerentes entre si.

O MVP tem só as fases 1 a 3 do Mundo 1 (D-009). Os mundos completos fazem parte do big picture (Roadmap, M5 — proposta).

## 2. O que é um mundo

| Regra | Status |
|---|---|
| Um mundo é um conjunto de 10 fases com identidade visual própria (D-020) | Definido |
| Uma fase (ou nível) é um conjunto de regras do gerador. O cenário é sorteado a cada partida (D-014) | Definido |
| O jogo não tem enredo: cada mundo tem um nome e um visual, não uma história | Definido |
| Desafios fora da sequência, como a PRACTICE, ficam fora dos mundos | Definido |
| Cada mundo apresenta pelo menos uma novidade de jogo: um obstáculo novo ou um modificador | Proposta |
| A gravidade pode mudar de um mundo para outro (ideia registrada no documento 02, seção 15) | Proposta; depende da P-012 |
| Concluir a fase 10 de um mundo libera a fase 1 do próximo | Proposta |
| Quantos mundos o jogo terá no lançamento nas lojas | Em aberto |

## 3. Princípios de design dos mundos

Propostas, para o Fernando validar:

1. **Legível antes de bonito.** A nave, as plataformas e os obstáculos precisam se destacar do fundo em qualquer mundo, inclusive numa tela pequena sob o sol.
2. **Plataformas iguais em todos os mundos.** Base (azul), posto (amarelo) e tripulação (laranja) mantêm as cores, para o jogador reconhecê-las sem pensar. O que muda é o resto do cenário.
3. **Poucas cores.** Cada mundo usa uma paleta curta (céu, terreno, brilho do terreno e obstáculos), no estilo 16 bits minimalista do jogo.
4. **Nada depende só de cor.** Avisos e estados também mudam de forma ou de movimento (PRD, RNF-11).
5. **Uma novidade por vez.** Cada mundo apresenta a sua novidade aos poucos, nas primeiras fases, antes de combiná-la com o que o jogador já conhece.

## 4. Modelo de documento de mundo

Copie o bloco abaixo para `mundos/mundo-NN.md` e preencha. Marque cada item como **Definido**, **Proposta** ou **Em aberto**.

```markdown
# Mundo NN — NOME (em inglês)

| Campo | Valor |
|---|---|
| Mundo | NN |
| Versão | 0.1 |
| Status | Rascunho |

## 1. Identidade
- Conceito em uma frase:
- Onde se passa (planeta, lua, estação, nebulosa...):
- Referências visuais (links ou imagens):

## 2. Paleta
| Elemento | Cor | Observação |
|---|---|---|
| Céu (topo → base) | | |
| Terreno | | |
| Contorno do terreno | | |
| Obstáculos | | |
| Detalhes de fundo | | |

## 3. Cenário
- Forma do terreno (relevo suave, picos, túneis...):
- Elementos de fundo:

## 4. Física e modificadores
- Gravidade (igual à padrão ou diferente):
- Modificadores do mundo (vento, escuridão...):

## 5. Obstáculos
- Obstáculos que aparecem:
- Novidade deste mundo:

## 6. Curva das 10 fases
| Fase | Nome | Novidade | Regras do gerador (comprimento, corredor, relevo, posto, obstáculos) |
|---|---|---|---|
| 1 | | | |
| ... | | | |
| 10 | | | |

## 7. Som e música
-

## 8. Pendências
-

## Histórico de versões
| Versão | Data | O que mudou |
|---|---|---|
```

## 5. Lista de mundos

| Mundo | Nome | Conceito | Documento | Status |
|---|---|---|---|---|
| 1 | WORLD 1 (provisório) | Caverna no espaço, com pedras flutuantes | [mundo-01.md](mundos/mundo-01.md) | Rascunho, com as fases 1 a 3 do MVP já no jogo |
| 2 em diante | — | — | — | Em aberto |

## 6. Como um mundo vira jogo

- O visual (`theme`) e as regras de cada fase ficam em `jogo/src/content/worlds.js`. Criar um mundo é acrescentar uma entrada lá, sem mexer na lógica do jogo.
- Obstáculos novos entram no catálogo `jogo/src/content/obstacles/`, e modificadores, em `jogo/src/content/modifiers.js`.
- Os testes automáticos geram centenas de cenários de cada fase nova e conferem que todos têm solução. O piloto automático prova a melhor corrida sem abastecer (D-018).
- Obstáculos móveis vão exigir uma versão do piloto automático que leve o tempo em conta.

## 7. Pendências

| ID | Pergunta | Cartão |
|---|---|---|
| P-011 | Catálogo de obstáculos e a novidade de cada mundo | [#60](https://github.com/TARNAGS/resgate-espacial/issues/60) |
| P-012 | Modificadores de jogo e de fase (inclusive gravidade por mundo) | [#61](https://github.com/TARNAGS/resgate-espacial/issues/61) |
| — | Referências visuais e identidade do jogo | [#55](https://github.com/TARNAGS/resgate-espacial/issues/55) e E-19 |
| — | Quantos mundos no lançamento nas lojas | A decidir no M5 |

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 0.1 | 02/10/2026 | Primeira versão, a partir do big picture do Fernando (D-020): o que é um mundo, princípios, modelo de documento e lista de mundos |
