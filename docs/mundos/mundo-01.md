# Mundo 01 — WORLD 1 (nome provisório)

| Campo | Valor |
|---|---|
| Mundo | 01 |
| Versão | 0.1 |
| Data | 02/10/2026 |
| Status | Rascunho |

Rascunho feito a partir do que já existe no jogo (`jogo/src/content/worlds.js`). O que está no jogo aparece como **Definido**; o resto, como **Proposta** ou **Em aberto**. O modelo deste documento está no [documento 08](../08-design-de-mundos.md).

## 1. Identidade

| Item | Conteúdo | Status |
|---|---|---|
| Nome | WORLD 1 (provisório; o nome final do jogo é a P-003) | Em aberto |
| Conceito em uma frase | Uma caverna no espaço, de contornos verde-água, com pedras roxas flutuando no caminho | Definido (é o visual do jogo hoje) |
| Onde se passa | Caverna espacial genérica, sem planeta definido | Proposta |
| Referências visuais | Ainda não reunidas | Em aberto ([#55](https://github.com/TARNAGS/resgate-espacial/issues/55)) |

## 2. Paleta

| Elemento | Cor | Status |
|---|---|---|
| Céu (topo → base) | `#0b1020` → `#03040a` | Definido |
| Terreno | `#121a29` | Definido |
| Contorno do terreno | `#46e0c8`, com brilho suave | Definido |
| Pedras | Preenchimento `#2a2140`, contorno `#c08cff` | Definido |
| Estrelas ao fundo | Branco azulado, piscando de leve | Definido |
| Plataformas | Base `#7cc4ff`, posto `#ffd166`, tripulação `#ff9f43` (iguais em todos os mundos, documento 08, princípio 2) | Definido no jogo; regra geral em Proposta |

## 3. Cenário

| Item | Conteúdo | Status |
|---|---|---|
| Forma do terreno | Teto e chão ondulados, com corredor mínimo garantido; o relevo fica mais acidentado a cada fase | Definido |
| Além das pontas da fase | A caverna continua apagada, com uma barreira de energia tracejada no limite | Definido |
| Elementos de fundo | Só estrelas | Definido; outros elementos em aberto |

## 4. Física e modificadores

| Item | Conteúdo | Status |
|---|---|---|
| Gravidade | A padrão do jogo (55) | Definido |
| Modificadores | Nenhum | Definido para o MVP; mundos seguintes dependem da P-012 |

## 5. Obstáculos

| Item | Conteúdo | Status |
|---|---|---|
| Obstáculos | Pedras flutuantes, sempre com passagem ao lado | Definido |
| Novidade do mundo | Aprender a voar: decolar, pousar, desviar e administrar o combustível | Proposta |
| Fase 5 | Primeiro obstáculo móvel (documento 02, seção 10) | Proposta; depende da P-011 |

## 6. Curva das 10 fases

As fases 1 a 3 são as do MVP (D-009) e já estão no jogo. As fases 4 e 5 vêm da curva do documento 02 (seção 10) e estão no E-12 (M3). As fases 6 a 10 estão em aberto (E-23, M5 — proposta).

| Fase | Nome | Novidade | Regras do gerador | Status |
|---|---|---|---|---|
| 1 | FIRST FLIGHT | Decolar e pousar, sem obstáculos, com dicas na tela | Cenário fixo (semente 101, D-021); 1.800 de comprimento, corredor 225, relevo 60, sem posto, tanque 40 s | Definido |
| 2 | ROCK FIELD | Obstáculos fixos simples | Cenário fixo (semente 202); 2.600, corredor 185, relevo 95, 9 pedras com 95 de passagem, tanque 40 s | Definido |
| 3 | LONG HAUL | Distância que obriga a abastecer uma vez, na ida ou na volta (D-023) | Cenário fixo (semente 303); 3.800, corredor 165, relevo 110, posto, 12 pedras com 85 de passagem, tanque do melhor plano com um abastecimento + 8% | Definido |
| 4 | — | Passagens estreitas e túneis | — | Proposta (E-12) |
| 5 | — | Primeiro obstáculo móvel | — | Proposta (E-12; P-011) |
| 6 a 10 | — | — | — | Em aberto (E-23) |

## 7. Som e música

| Item | Conteúdo | Status |
|---|---|---|
| Efeitos | Propulsor, pouso, explosão, embarque, vitória e aviso de combustível, sintetizados | Definido |
| Música | Nenhuma | Em aberto |

## 8. Pendências

- Nome do mundo e referências visuais (#55, E-19).
- Fases 4 a 10: o que cada uma apresenta de novo (P-011 e E-12/E-23).
- Música, se houver.

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 0.1 | 02/10/2026 | Rascunho a partir do que já está no jogo |
