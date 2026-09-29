# Regras do Jogo — Resgate Espacial

| Campo | Valor |
|---|---|
| Documento | 02 — Regras do jogo |
| Versão | 0.1 |
| Data | 28/09/2026 |
| Status | Rascunho, em revisão |
| Responsável | Fernando Nunes (Product Manager) |

Este documento descreve **como o jogo funciona**. O que o produto precisa ter em volta do jogo (instalação, salvamento, medição) fica no PRD.

**Como ler as marcações:**

- **Definido:** regra já decidida.
- **Proposta:** sugestão para preencher uma lacuna; vale até ser revisada.
- **Em aberto:** ainda precisa ser pensado; tem um ID na lista de [decisões pendentes](05-registro-de-decisoes.md#decisões-pendentes).

## 1. O jogo em uma frase

Pilotar uma pequena nave triangular, sob gravidade, da base (à esquerda) até três tripulantes à espera (à direita) e de volta, sem encostar em nada e sem deixar o combustível acabar.

## 2. Fluxo de uma fase

```
Base (A) → voo com obstáculos → [posto: abastecer] → plataforma da tripulação (B): embarque
         → voo de volta → [posto: abastecer] → pouso na base = RESGATE CONCLUÍDO
```

| # | Etapa | Status |
|---|---|---|
| 1 | A fase começa com a nave pousada na base | Definido |
| 2 | O tanque começa cheio | Proposta |
| 3 | O jogador decola e atravessa os obstáculos até a plataforma da tripulação | Definido |
| 4 | Se precisar, pousa num posto no meio do caminho para abastecer | Definido |
| 5 | Ao pousar na plataforma da tripulação, os três tripulantes embarcam | Definido |
| 6 | O jogador faz o caminho de volta e pousa na base: resgate concluído | Definido |

## 3. A nave

### 3.1 Movimento

| Regra | Status |
|---|---|
| A gravidade puxa a nave para baixo o tempo todo | Definido |
| O propulsor empurra a nave na direção para onde a ponta do triângulo aponta, enquanto estiver acionado. Acionar e soltar em sequência permite dosar a subida e "flutuar" | Definido |
| As setas giram a nave para a esquerda e para a direita | Definido |
| A nave tem inércia: continua se movendo na direção em que estava até a gravidade ou o propulsor mudarem isso | Proposta |
| O propulsor vence a gravidade com folga, para que a nave suba ao segurar e desça ao soltar | Proposta |

### 3.2 Combustível

| Regra | Status |
|---|---|
| O combustível é limitado e é reabastecido nos postos | Definido |
| Só o propulsor gasta combustível; girar não gasta | Proposta |
| Pousada num posto, a nave abastece até encher o tanque, em poucos segundos, com a barra subindo na tela | Proposta |

O que acontece quando o combustível acaba está na [seção 7](#7-vidas-derrota-e-vitória).

### 3.3 Pouso

| Regra | Status |
|---|---|
| É preciso chegar devagar e controlar a descida, mas o pouso é tolerante e não exige precisão extrema | Definido |
| O pouso é válido quando três condições são atendidas: a nave está sobre uma plataforma, a velocidade está abaixo do limite e a inclinação está dentro da tolerância (ex.: até 20° fora da vertical) | Proposta |
| Um indicador visual mostra quando a velocidade está boa para pousar (ex.: a nave muda de cor), para o jogador aprender o pouso sem frustração | Proposta |

## 4. Controles

### 4.1 Teclado

| Tecla | Ação | Status |
|---|---|---|
| ← e → | Girar a nave para a esquerda e para a direita | Definido |
| ↑ | Acionar o propulsor, enquanto estiver pressionada | Proposta |
| A e D / W ou Espaço | Alternativas para girar / para o propulsor | Proposta |
| P ou Esc | Pausar | Proposta |

### 4.2 Toque (celular) — Em aberto (P-002)

Esta é a decisão de maior risco do produto ([Visão, seção 10](01-visao-do-produto.md#10-riscos-principais)): a graça do original está em apertar e soltar a tecla, e no celular não existe tecla. Em qualquer opção, é obrigatório conseguir **girar e acionar o propulsor ao mesmo tempo**, com dois dedos.

| Critério | A. Botões na tela | B. Direcional + propulsor | C. Inclinar o celular |
|---|---|---|---|
| Como funciona | Dois botões à esquerda (girar para cada lado) e um botão grande à direita (propulsor) | O polegar esquerdo aponta uma direção num direcional virtual e a nave vira para lá; o direito aciona o propulsor | Inclinar o celular gira a nave; tocar e segurar a tela aciona o propulsor |
| Fidelidade ao original | Alta: mesma lógica do teclado | Média: "girar" vira "apontar" | Baixa |
| Precisão em passagens estreitas | Média: sem resposta tátil, o dedo pode escorregar do botão | Alta | Baixa |
| Facilidade de aprender | Alta | Alta | Média |
| Esforço para construir | Baixo | Médio: exige calibrar a sensibilidade do direcional | Médio: no iPhone, o jogador precisa autorizar o uso do sensor de movimento |

**Recomendação:** começar pela opção A no protótipo de controle, porque ela preserva a sensação do original (princípio "o controle é o produto") e é a mais simples de construir. Testar com 3 a 5 pessoas. Se os dedos escorregarem dos botões ou o giro ficar lento demais para as passagens, testar a opção B. A opção C fica fora do MVP.

## 5. Plataformas

| Plataforma | Onde fica | O que acontece ao pousar | Status |
|---|---|---|---|
| Base | Início da fase, à esquerda (ponto A) | Com a tripulação a bordo, conclui o resgate | Definido |
| Base | — | Também abastece, caso o jogador precise voltar | Proposta |
| Posto de abastecimento | No meio do caminho | Enche o tanque | Definido |
| Plataforma da tripulação | Fim da fase, à direita (ponto B) | Os três tripulantes embarcam | Definido |
| Plataforma da tripulação | — | Não abastece: planejar o combustível da volta faz parte do desafio | Proposta |

## 6. Tripulação

| Regra | Status |
|---|---|
| Sempre três tripulantes por fase | Definido |
| A tripulação é figurativa: mostra o objetivo da fase, mas não cria dificuldade. Não há limite de lugares e o resgate é feito numa viagem só | Definido |
| O embarque tem a estética do original: traços que "correm" para dentro do triângulo | Definido |
| O embarque começa sozinho quando a nave pousa na plataforma e dura cerca de 2 segundos, com os controles travados até terminar | Proposta |

## 7. Vidas, derrota e vitória

| Regra | Status |
|---|---|
| A nave tem três vidas | Definido |
| As vidas valem por fase: cada fase começa com três | Proposta |
| Ao perder uma vida, a nave reaparece pousada na última plataforma em que pousou (o ponto de retorno), com o tanque cheio. Se a tripulação já tinha embarcado, continua a bordo | Proposta |
| Ao perder a terceira vida, é fim de jogo e a fase recomeça do início | Proposta |

| Situação | Resultado | Status |
|---|---|---|
| Pousar na base com a tripulação a bordo | Fase concluída | Definido |
| Encostar em parede ou obstáculo | Explode e perde uma vida | Definido |
| Pousar rápido demais | Explode e perde uma vida | Definido |
| Tocar o chão fora de uma plataforma, mesmo devagar | Explode e perde uma vida | Proposta |
| Pousar inclinado demais | Explode e perde uma vida | Proposta |
| O combustível acabar em voo | O propulsor para de funcionar e a nave cai | Proposta |
| O combustível acabar com a nave pousada fora de um posto | A nave não conseguiria decolar; para o jogador não ficar preso, o jogo avisa e ele perde uma vida | Proposta |
| Perder a terceira vida | Fim de jogo; a fase recomeça | Proposta |

## 8. Tempo e pontuação

| Regra | Status |
|---|---|
| Não há limite de tempo para concluir a fase | Definido |
| Quem conclui o resgate mais rápido faz mais pontos | Definido |
| O sistema de pontuação ainda será pensado (P-006) | Em aberto |

Perguntas a responder para fechar a pontuação:

1. Além da velocidade, a pontuação premia mais alguma coisa, como combustível que sobrou ou vidas não perdidas?
2. O resultado aparece em pontos, em estrelas (de 1 a 3) ou só como tempo?
3. O melhor resultado de cada fase fica salvo no aparelho, como recorde?
4. Perder uma vida custa pontos, além do tempo perdido?

## 9. Obstáculos

| Tipo | Exemplos | Status |
|---|---|---|
| Fixos | Paredes e terreno, passagens estreitas, buracos para atravessar, túneis | Definido |
| Móveis | Desafios com estética interplanetária | Definido |
| Móveis (exemplos) | Asteroides que cruzam o caminho, satélites que giram, barreiras que sobem e descem, portões que abrem e fecham | Proposta |
| Inimigos que atiram | Não existem | Definido |

## 10. Fases e progressão

| Regra | Status |
|---|---|
| Toda fase vai da base, à esquerda, até a tripulação, à direita, e volta | Definido |
| A fase é mais larga que a tela, e a câmera acompanha a nave | Proposta |
| No celular, o jogo é jogado com a tela na horizontal | Proposta |
| As fases são liberadas em sequência: concluir uma libera a próxima | Proposta |
| Cada fase apresenta uma novidade, e a primeira funciona como tutorial (curva sugerida abaixo) | Proposta |
| A quantidade de fases do MVP é definida no Roadmap (P-007) | Em aberto |

Curva de dificuldade sugerida:

| Fase | Novidade |
|---|---|
| 1 | Decolar e pousar, sem obstáculos, com dicas na tela |
| 2 | Obstáculos fixos simples |
| 3 | Distância que obriga a abastecer no posto |
| 4 | Passagens estreitas e túneis |
| 5 | Primeiro obstáculo móvel |

## 11. Interface durante o jogo — Proposta

| Elemento | Para quê |
|---|---|
| Barra de combustível | Mostrar quanto resta; pisca quando está acabando |
| Vidas | Três pequenos triângulos |
| Situação da tripulação | "Aguardando" na ida, "a bordo" na volta |
| Cronômetro | Tempo da fase, que define a pontuação |
| Seta de direção | Apontar para o objetivo (tripulação ou base) quando ele está fora da tela |
| Botão de pausa | Pausar no celular; no teclado, P ou Esc |

O jogo também pausa sozinho quando o jogador sai do app ou recebe uma ligação.

## 12. Estética e som

| Regra | Status |
|---|---|
| Estética 16 bits minimalista: a nave é um triângulo do tamanho de um cursor de mouse e os tripulantes são traços | Definido |
| Cenários com estética interplanetária | Definido |
| Efeitos sonoros simples: propulsor, explosão, embarque e abastecimento | Proposta |

## 13. Parâmetros de ajuste

São os números que definem a "sensação" do jogo. Eles serão calibrados no protótipo de controle, testando com pessoas, e não decididos no papel.

| Parâmetro | O que controla | Ponto de partida |
|---|---|---|
| Gravidade | Quão rápido a nave cai ao soltar o propulsor | Calibrar no protótipo |
| Força do propulsor | Quanto a nave acelera ao acionar | Vencer a gravidade com folga (ex.: 2 vezes mais forte) |
| Velocidade de giro | Quão rápido a nave vira | Calibrar no protótipo |
| Velocidade máxima de pouso | Limite para pousar sem explodir | Tolerante: o pouso "não é tão delicado" |
| Inclinação máxima de pouso | Quanto a nave pode estar torta ao pousar | Ex.: 20° |
| Tanque e consumo | Quanto tempo de propulsor cabe num tanque cheio | Varia por fase |
| Duração do embarque | Tempo da animação da tripulação | Cerca de 2 segundos |

## 14. Pontos em aberto

| ID | Pergunta | Onde |
|---|---|---|
| P-002 | Como funciona o controle por toque? | Seção 4.2 |
| P-006 | Como funciona a pontuação? | Seção 8 |
| P-007 | Quantas fases terá o MVP? | Roadmap |

## 15. Ideias para depois

Registradas para não se perderem. **Não são compromisso**: só entram se o Roadmap decidir.

- Gravidade diferente em cada planeta.
- Suporte a controle de videogame (gamepad).
- "Fantasma" do melhor tempo, para o jogador competir contra si mesmo.
- Compartilhar o recorde com um link ou uma imagem.

## 16. Glossário

| Termo | Significado |
|---|---|
| Inércia | Tendência da nave de continuar se movendo na mesma direção e velocidade |
| Ponto de retorno | Plataforma onde a nave reaparece depois de perder uma vida |
| Parâmetros de ajuste | Números que controlam a sensação do jogo (gravidade, força do propulsor etc.) e são calibrados em teste |
| Protótipo de controle | Versão mínima só com a nave e o controle, para testar a sensação antes de construir as fases |
