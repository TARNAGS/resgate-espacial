# Protótipos

Protótipos **descartáveis**, feitos para ver e sentir o jogo antes de construir de verdade. Não são a arquitetura final.

## 01 — Primeira visualização (01/10/2026)

Objetivo: ver a cara do jogo e sentir o controle já com as regras novas: fases geradas aleatoriamente (D-014) e menu com mapa de progresso (D-015).

**Como abrir:** na pasta do projeto, rode `node prototipos/servir.js` e abra `http://localhost:8080` no navegador. Use a janela na horizontal.

**Controles:**

- Teclado: ← e → giram a nave, ↑ (ou W, ou Espaço) aciona o propulsor, P ou Esc pausa.
- Toque ou mouse: tocar e segurar aciona o propulsor; arrastar aponta a nave (direcional virtual, D-006).

**O que já tem:**

- Menu com Jogar, Configurações (som e apagar progresso) e mapa de progresso com os níveis 1 a 3.
- Cenário novo a cada partida, gerado a partir de uma semente; "Try again" repete o mesmo cenário.
- Física da nave (gravidade, propulsor, inércia e giro), com os parâmetros de ajuste num lugar só (`PARAMS`, no topo do `game.js`).
- Regras do documento 02: pouso com limite de velocidade e de inclinação, explosão ao encostar no cenário, combustível com abastecimento na base e no posto, embarque da tripulação, três vidas, pontos de retorno e aviso forte de combustível baixo.
- HUD com combustível, vidas, tripulação e tempo; seta para o objetivo; pausa; progresso e recordes salvos no aparelho.

**O que ainda não tem:** nome e arte finais, pontuação (P-006), instalação no celular, funcionamento sem internet e medição.
