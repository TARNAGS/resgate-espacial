# Ferramentas do benchmark do GraviTron e do Gravitron 2

Scripts que leem os arquivos de fase dos dois jogos e geram os mapas, os números e o gráfico do [benchmark](../../gravitron.md). Rodam com Node, sem dependências. Os arquivos dos jogos **não ficam no repositório** (`.gitignore`): são do autor, a Dark Castle Software.

| Arquivo | O que faz |
|---|---|
| `ler-gravitron2.js` | Lê uma fase do Gravitron 2 (`.map`), no formato do código-fonte publicado pelo autor |
| `ler-gravitron1.js` | Lê uma fase do GraviTron (`.map`), no formato deduzido dos próprios arquivos (abaixo) |
| `desenhar.js` | Desenha cada fase como mapa esquemático (SVG), a legenda, e grava os números de todas as fases em `fases.json` |
| `grafico.js` | Gera o gráfico "Perigos e mecanismos por fase no Gravitron 2" (SVG) a partir de `fases.json` |
| `fotografar.ps1` | Converte cada SVG em PNG com o Edge sem janela (Windows) |
| `montar-pagina.js` | Gera a página de leitura (`pagina-de-leitura.html`) a partir de `fases.json` |

## Como regenerar tudo

1. **Baixar os arquivos** (cópias do site do autor no Internet Archive). Só os arquivos de fase são necessários; nenhum programa dos jogos precisa ser executado.
   - GraviTron: [GraviTron.zip](http://web.archive.org/web/20140823183211id_/http://xout.blackened-interactive.com/Gravitron/GraviTron.zip). Copie `GraviTron/Data/Maps/*` para `originais/g1/`. **Não execute nada desse pacote:** em 2010, antivírus apontaram adware nele (o autor diz que nunca pôs).
   - Gravitron 2, campanha extra e fases corrigidas: [Gravitron2_Patch_v18.zip](http://web.archive.org/web/20120207094927id_/http://xout.blackened-interactive.com/dump/new/Gravitron2_Patch_v18.zip). Copie `Data/Maps/*` para `originais/g2/`.
   - Gravitron 2, demo: [Gravitron2_demo_v17.zip](http://web.archive.org/web/20120204072953id_/http://xout.blackened-interactive.com/dump/new/Gravitron2_demo_v17.zip). Copie `Gravitron2/Data/Maps/*` para `originais/g2/`.
   - Código-fonte do Gravitron 2, para conferir o formato e as regras: [Gravitron2_Src.zip](http://web.archive.org/web/20120204071245id_/http://xout.blackened-interactive.com/Gravitron2/Gravitron2_Src.zip). Fica fora do repositório.
2. Mapas, legenda e números: `node desenhar.js` (cria `saida/*.svg` e `saida/fases.json`).
3. Gráfico: `node grafico.js` (cria `saida/curva-gravitron2.svg`).
4. Imagens PNG: no Windows, `powershell -ExecutionPolicy Bypass -File fotografar.ps1`. No Git Bash, chamar o Edge direto não grava a imagem; pelo PowerShell (`Start-Process ... -Wait`) funciona. No Mac, o mesmo com o Chrome sem janela.
5. Página de leitura: `node montar-pagina.js` (cria `saida/pagina-de-leitura.html`, que usa os PNG da pasta de cima).
6. Copie `saida/*.png`, `saida/fases.json` e `saida/pagina-de-leitura.html` para a pasta de cima.

## Formato das fases do Gravitron 2

Tirado de `Engine::LoadMap` (Engine.cpp) e de `ED_Entity.h`, no código que o autor publicou em 2012. Números em little-endian, `float` de 4 bytes, `bool` de 1 byte, nomes de 16 bytes. Todas as 23 fases lidas fecham exatamente no fim do arquivo.

| Bloco | Conteúdo |
|---|---|
| Terreno | `int` quantidade; cada segmento tem 56 bytes: início (x, y), fim (x, y), cor do início (r, g, b), cor do fim (r, g, b), direção (x, y) e normal (x, y) |
| Objetos | `int` quantidade; cada um: `int` tipo, posição (x, y), `float` rotação. O botão (6) tem mais um nome; o laser (7) e o jato (15) têm nome, tempo ligado, tempo desligado, espera inicial (só o laser) e `bool` começa ligado; os blocos (16) têm meia largura e meia altura |
| Pontos de destino | `int` quantidade; cada um: posição e nome |
| Partes que giram | `int` quantidade; cada uma: centro, raio, nome, alvo, o que aciona, `int` rotação máxima, `float` giro por passo, `float` pausa, `bool` volta, `bool` começa ligada |
| Partes que andam | `int` quantidade; cada uma: centro, meia largura, meia altura, nome, destino inicial, destino final, o que aciona, tempo do trajeto, pausa, espera inicial, `bool` começa ligada |
| Gatilhos | `int` quantidade; cada um: centro, meia largura, meia altura, o que aciona, `bool` uma vez só |

Tipos de objeto: 0 torre azul, 1 torre vermelha, 2 tanque, 3 posto de combustível, 4 cientista, 5 reator, 6 botão, 7 laser, 8 a 13 árvores, 14 checkpoint, 15 jato, 16 blocos, 17 mina, 18 míssil, 19 lander, 20 pulga, 21 drone, 22 varredor, 23 spiker, 24 supertorre, 25 estação. Os tipos 21, 23 e 25 não são criados pelo jogo (`ClassFactory`).

**Posição no jogo:** o jogo desloca o mapa para que o canto de cima, à esquerda, fique 1.000 unidades abaixo do topo do mundo (`SectorGrid::ConstructGrid`). A nave nasce em (0, 400) do mundo, ou seja, 600 unidades acima do ponto mais alto do terreno, na borda esquerda, e a fase termina quando ela sobe acima de y = 10 do mundo (cerca de 990 acima do terreno). O mundo dá a volta na horizontal.

**Ordem das fases:** `Standard.rota` (na demo) lista as 5 primeiras da campanha principal; `OfficialPack1.rota` (no patch) lista as 14 da campanha extra. Os arquivos `.rotb` guardam o MD5 da lista correspondente.

## Formato das fases do GraviTron

O código do GraviTron se perdeu. O formato foi deduzido dos arquivos, em 06/10/2026, com a ajuda do formato do Gravitron 2:

| Bloco | Conteúdo |
|---|---|
| Cabeçalho | `int` quantidade de segmentos; `int` quantidade de objetos |
| Terreno | 40 bytes por segmento: início (x, y), cor (r, g, b), fim (x, y), cor (r, g, b) |
| Objetos | Todos começam com `int` tipo, `float` rotação, posição (x, y), 16 bytes no total. Alguns tipos têm campos a mais (tabela abaixo) |
| Rodapé | 42 bytes: nome da fase (32), senha (6, ex.: EASY1) e um `int` de 15 a 90, de função não confirmada |

| Tipo | Tamanho | Campos a mais | Significado (pela posição nos mapas) |
|---|---|---|---|
| 1 | 60 | nome, nome do par, `int`, 2 `float` | Emissor de campo de força (em pares) |
| 2 | 32 | nome | Botão |
| 3 | 20 | `int` (47 a 127) | Objeto no ar (não identificado) |
| 10 | 44 | nome, `float` giro por passo, `int` rotação máxima, `int` raio | Parte que gira |
| 11 | 36 | nome, `int` tamanho | Gatilho |
| 18 | 78 | nome, destino inicial, destino final, `int`, `float` velocidade, `float` pausa, 2 `bool` | Parte que anda |
| 19 | 32 | nome | Ponto de destino |
| Os demais (0, 4 a 9, 12 a 17, 20 a 26) | 16 | — | 0, 7 e 8 torres; 4 combustível; 5 space-man; 6 reator; 9, 13 e 14 objetos no ar; 12 árvore; 15, 16, 17 e 20 objetos no chão não identificados; 21 a 26 itens do multijogador |

**Como os tamanhos foram achados:** um programa testou, para cada tipo, tamanhos de 16 a 96 bytes, até as 26 fases (sem a de teste) terminarem exatamente no rodapé de 42 bytes. Uma única combinação serviu para todas. O arquivo `TEST.map`, de teste, usa uma variação antiga e foi deixado de fora.

**Como os significados foram achados:** os tipos com nome (botão, parte que gira, parte que anda, destino, gatilho, campo de força) têm a mesma estrutura do Gravitron 2. Os outros foram desenhados com o número do tipo ao lado e classificados pela posição: presos ao terreno ou soltos no ar, sozinhos ou em grupos, perto ou longe do reator. Reator, space-man, combustível e torre têm confiança alta; o resto, média ou baixa. O pacote tem os desenhos vetoriais dos objetos (`Data/Objects/*.obj`: BlueTurret, GreenTurret, RedTurret, RotatingTurret, BlueTank, Seeker, Wasp, Ufo, Boulder, Volcano, DepthCharge, MedPak, Battery, Beacon e outros), mas a ligação entre número e objeto estava no programa, que não foi aberto.

**Fases de multijogador:** DEADZONE, ICECAVES e VAULT (lista em `DM_Rosta.txt`).
