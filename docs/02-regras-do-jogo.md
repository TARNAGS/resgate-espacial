# Regras do Jogo — Resgate Espacial

| Campo | Valor |
|---|---|
| Documento | 02 — Regras do jogo |
| Versão | 1.2 |
| Data | 02/10/2026 |
| Status | Aprovado; pendentes: pontuação (P-006), fase 1 fixa ou aleatória (P-009) e repetição do cenário (P-010) |
| Responsável | Fernando Nunes (Product Manager) |

Este documento descreve **como o jogo funciona**. O que o produto precisa ter em volta do jogo (instalação, salvamento, medição) fica no [PRD](03-prd.md).

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
| O jogador gira a nave para a esquerda e para a direita (no teclado, com as setas) | Definido |
| A nave tem inércia: continua se movendo na direção em que estava até a gravidade ou o propulsor mudarem isso | Proposta |
| O propulsor vence a gravidade com folga, para que a nave suba ao segurar e desça ao soltar | Proposta |

### 3.2 Combustível

| Regra | Status |
|---|---|
| O combustível é limitado e é reabastecido nos postos e na base | Definido |
| Só o propulsor gasta combustível; girar não gasta | Proposta |
| Pousada num lugar que abastece, a nave enche o tanque em poucos segundos, com a barra subindo na tela | Proposta |

O que acontece quando o combustível acaba está na [seção 7](#7-vidas-derrota-e-vitória).

### 3.3 Pouso

| Regra | Status |
|---|---|
| É preciso chegar devagar e controlar a descida, mas o pouso é tolerante e não exige precisão extrema | Definido |
| O pouso é válido quando três condições são atendidas: a nave está sobre uma plataforma, a velocidade está abaixo do limite e a inclinação está dentro da tolerância (ex.: até 20° fora da vertical) | Proposta |
| Um indicador visual mostra quando a velocidade está boa para pousar (ex.: a nave muda de cor), para o jogador aprender o pouso sem frustração | Proposta |

## 4. Controles

### 4.1 Teclado (computador)

| Tecla | Ação | Status |
|---|---|---|
| ← e → | Girar a nave para a esquerda e para a direita | Definido |
| ↑ | Acionar o propulsor, enquanto estiver pressionada | Proposta |
| A e D / W ou Espaço | Alternativas para girar / para o propulsor | Proposta |
| P ou Esc | Pausar | Proposta |

### 4.2 Toque (celular)

O controle por toque é um **direcional virtual**: um anel com uma bola no centro, que o polegar puxa, como em muitos jogos de celular. Decisão registrada em [D-006](05-registro-de-decisoes.md#d-006--controle-por-toque-direcional-virtual).

| Regra | Status |
|---|---|
| Tocar no direcional aciona o propulsor; soltar desliga | Definido |
| Arrastar a bola indica a direção: a ponta da nave vira para onde o dedo aponta | Definido |
| Um único polegar controla a nave inteira | Definido |
| O botão de pausa fica num canto superior, longe do direcional | Proposta |
| O direcional aparece onde o polegar tocar, na metade esquerda da tela, em vez de ficar fixo num canto | Proposta (testar no protótipo) |

**A validar no protótipo:** com esse controle, **não dá para girar a nave sem acelerar**, porque tocar já aciona o propulsor. No teclado, o jogador pode girar primeiro e acelerar depois. Se a nave virar rápido para a direção do dedo, isso quase não faz falta. Se fizer, a variante a testar é uma pequena zona no centro do direcional que só aponta, sem acionar o propulsor.

## 5. Plataformas

Todas as regras desta seção estão definidas.

| Plataforma | Onde fica | O que acontece ao pousar | Abastece? | É ponto de retorno? |
|---|---|---|---|---|
| Base | Início da fase, à esquerda (ponto A) | Com a tripulação a bordo, conclui o resgate | Sim | Sim |
| Posto de abastecimento | No meio do caminho | Enche o tanque | Sim | Não |
| Plataforma da tripulação | Fim da fase, à direita (ponto B) | Os três tripulantes embarcam | Não: planejar o combustível da volta faz parte do desafio | Sim, depois que a nave chega nela |

## 6. Tripulação

Todas as regras desta seção estão definidas.

- Sempre três tripulantes por fase.
- A tripulação é figurativa: mostra o objetivo da fase, mas não cria dificuldade. Não há limite de lugares e o resgate é feito numa viagem só.
- O embarque tem a estética do original: traços que "correm" para dentro do triângulo.
- O embarque começa sozinho quando a nave pousa na plataforma e dura cerca de 2 segundos, com os controles travados até terminar.

## 7. Vidas, derrota e vitória

| Regra | Status |
|---|---|
| A nave tem três vidas por fase: cada fase começa com três | Definido |
| Toda explosão custa uma vida, e a nave reaparece num ponto de retorno (seção 7.1) | Definido |
| Ao perder a terceira vida, é fim de jogo e a fase recomeça do início | Definido |

### 7.1 Onde a nave reaparece

A fase tem dois pontos de retorno: a base e a plataforma da tripulação. Os postos de abastecimento **não** são pontos de retorno.

| Quando a nave explode | Onde reaparece | Combustível | Tripulação | Status |
|---|---|---|---|---|
| Na ida, antes de chegar à plataforma da tripulação, mesmo que já esteja perto dela | Na base, no início da fase | Cheio (a base abastece) | Continua aguardando | Definido |
| Depois de chegar à plataforma da tripulação: na própria plataforma ou na volta | Na plataforma da tripulação | O mesmo que tinha ao chegar lá | Continua a bordo | Definido |
| Quando fica sem combustível para decolar, pousada numa plataforma que não abastece | Na base, no início da fase | Cheio (a base abastece) | Volta a aguardar na plataforma: o resgate é perdido | Definido |

**Efeito colateral aceito (Definido):** como o ponto de retorno na plataforma guarda o combustível da chegada, quem chegar lá com muito pouco pode perder as vidas seguidas na volta, até o fim de jogo. O efeito foi aceito, porque planejar o combustível da volta faz parte do desafio. Para o jogador perceber o risco a tempo, o jogo mostra um **aviso forte de combustível baixo** quando a nave pousa na plataforma da tripulação com pouco combustível.

### 7.2 Situações e resultados

| Situação | Resultado | Status |
|---|---|---|
| Pousar na base com a tripulação a bordo | Fase concluída | Definido |
| Encostar em parede ou obstáculo | Explode | Definido |
| Pousar rápido demais | Explode | Definido |
| Tocar o chão fora de uma plataforma, mesmo devagar | Explode | Definido |
| Ficar sem combustível para decolar, pousada numa plataforma que não abastece | Explode | Definido |
| Pousar inclinado demais | Explode | Proposta |
| O combustível acabar em voo | O propulsor para de funcionar e a nave cai | Proposta |

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
| No celular, o jogo é jogado com a tela na horizontal | Definido |
| Cada fase apresenta uma novidade, e a primeira funciona como tutorial (curva abaixo) | Definido |
| A fase é mais larga que a tela, e a câmera acompanha a nave | Proposta |
| As fases são liberadas em sequência: concluir uma libera a próxima | Proposta |
| O MVP tem as fases 1 a 3; as fases 4 e 5 entram na V1 (D-009) | Definido |
| O cenário de cada fase é gerado aleatoriamente a cada partida, para o replay ser infinito (D-014) | Definido |
| Cada nível define as regras do gerador: comprimento, largura mínima do corredor, quantidade de pedras, posto de abastecimento e tamanho do tanque | Proposta |
| Todo cenário gerado tem solução: corredor mínimo, passagem ao lado de toda pedra e combustível suficiente | Proposta |
| A fase 1 (tutorial) é aleatória ou fixa (P-009); ao tentar de novo, o cenário se repete ou muda (P-010) | Em aberto |

Curva de dificuldade:

| Fase | Novidade |
|---|---|
| 1 | Decolar e pousar, sem obstáculos, com dicas na tela |
| 2 | Obstáculos fixos simples |
| 3 | Distância que obriga a abastecer no posto |
| 4 | Passagens estreitas e túneis |
| 5 | Primeiro obstáculo móvel |

## 11. Interface durante o jogo — Proposta

Os textos do jogo são em inglês ([D-007](05-registro-de-decisoes.md#d-007--jogo-em-inglês)); aqui eles estão descritos em português.

| Elemento | Para quê |
|---|---|
| Barra de combustível | Mostrar quanto resta; pisca quando está acabando. O aviso forte ao pousar na plataforma da tripulação com pouco combustível já está definido (seção 7.1) |
| Vidas | Três pequenos triângulos |
| Situação da tripulação | Aguardando (na ida) ou a bordo (na volta) |
| Cronômetro | Tempo da fase, que define a pontuação |
| Seta de direção | Apontar para o objetivo (tripulação ou base) quando ele está fora da tela |
| Botão de pausa | Pausar no celular; no teclado, P ou Esc |

O jogo também pausa sozinho quando o jogador sai do app ou recebe uma ligação.

**Definido (D-015):** antes da partida, o jogador vê um menu com Jogar, Configurações e um mapa de progresso dos níveis, com o estado de cada um, o melhor tempo e o número de resgates.

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
| Velocidade de giro no teclado | Quão rápido a nave vira ao segurar a seta | Calibrar no protótipo |
| Velocidade de giro no toque | Quão rápido a nave vira para a direção do dedo: na hora ou aos poucos | Calibrar no protótipo |
| Direcional | Posição (fixa ou onde o polegar tocar), área da tela que aceita o toque e tamanho | Onde o polegar tocar, na tela inteira (#50); variante final na #44 |
| Velocidade máxima de pouso | Limite para pousar sem explodir | Tolerante: o pouso "não é tão delicado" |
| Inclinação máxima de pouso | Quanto a nave pode estar torta ao pousar | Ex.: 20° |
| Folga na borda da plataforma | Quanto a nave pode passar da borda da plataforma e ainda pousar | 8 unidades, pouco menos que meia nave (#50) |
| Tanque e consumo | Quanto tempo de propulsor cabe num tanque cheio | Varia por fase |
| Combustível baixo | A partir de quanto o jogo avisa que o combustível está acabando | Calibrar no protótipo (ex.: 20% do tanque) |
| Duração do embarque | Tempo da animação da tripulação | Cerca de 2 segundos |

## 14. Pontos em aberto

| ID | Pergunta | Onde |
|---|---|---|
| P-006 | Como funciona a pontuação? | Seção 8 |
| P-009 | A fase 1 (tutorial) é aleatória ou fixa? | Seção 10 |
| P-010 | Ao tentar de novo, o cenário se repete ou muda? | Seção 10 |

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
| Direcional virtual | Controle desenhado na tela: um anel com uma bola que o polegar arrasta |
| Parâmetros de ajuste | Números que controlam a sensação do jogo (gravidade, força do propulsor etc.) e são calibrados em teste |
| Protótipo de controle | Versão mínima só com a nave e o controle, para testar a sensação antes de construir as fases |

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 0.1 | 28/09/2026 | Primeira versão, a partir do kickoff |
| 0.2 | 28/09/2026 | Pontos de retorno definidos pelo Fernando; controle por toque definido (direcional virtual); propostas de vidas, abastecimento, embarque, colisão, tela na horizontal e curva de fases aprovadas |
| 0.3 | 28/09/2026 | Efeito colateral do ponto de retorno aceito, com aviso forte de combustível baixo na plataforma da tripulação; MVP com as fases 1 a 3 (D-009) |
| 1.0 | 01/10/2026 | Aprovado pelo Fernando como versão de referência; a pontuação (P-006) segue em aberto |
| 1.1 | 01/10/2026 | Fases geradas aleatoriamente (D-014) e menu com mapa de progresso (D-015); novas pendências P-009 e P-010 |
| 1.2 | 02/10/2026 | Retorno do primeiro teste no iPhone (#50): parâmetro novo de folga na borda da plataforma e direcional aceitando toque na tela inteira |
