# Ferramentas do benchmark do Crazy Gravity

Scripts que leem os arquivos de fase do Crazy Gravity (1996) e geram os mapas, os números e a página de leitura do [benchmark](../../crazy-gravity.md). Rodam com Node, sem dependências. Os arquivos do jogo original **não ficam no repositório** (`.gitignore`): são do autor, Axel Meierhöfer (XLM Software).

| Arquivo | O que faz |
|---|---|
| `parse.js` | Lê um arquivo `.CGL` e separa os blocos; extrai os pedaços de terreno, as plataformas e as informações da fase |
| `render.js` | Desenha cada fase como mapa esquemático (SVG), a legenda, e grava os números de todas as fases em `fases.json` |
| `chart.js` | Gera o gráfico "Elementos por fase" (SVG) a partir de `fases.json` |
| `build-page.js` | Gera a página de leitura (`pagina-de-leitura.html`) a partir de `fases.json`, com os textos de cada fase |

## Como regenerar tudo

1. Baixe a versão shareware 2.0E no Internet Archive: [archive.org/details/CrazyGravity_1020](https://archive.org/details/CrazyGravity_1020), arquivo `CRZGVTY.ZIP`. Copie `LEVEL01.CGL` a `LEVEL18.CGL` para esta pasta. Só os arquivos de fase são necessários; nenhum programa do jogo precisa ser executado.
2. Mapas e números: `node render.js saida` (cria `saida/fase-01.svg` a `fase-18.svg`, `legenda.svg` e `fases.json`).
3. Gráfico: `node chart.js saida` (cria `saida/curva.svg` e `curva.html`).
4. Imagens PNG: abra cada SVG num navegador e salve, ou use o modo sem janela do navegador. No Windows, com o Edge: `msedge --headless=new --hide-scrollbars --window-size=1800,780 --screenshot=fase-01.png file:///.../fase-01.html`, com uma página HTML simples que mostra o SVG na largura desejada (a maior medida de cada fase limitada a 1.800 pixels). No Mac, o mesmo com o Chrome.
5. Página de leitura: copie os PNG para `saida/` e rode `node build-page.js saida` (cria `saida/pagina-de-leitura.html`).

Os resultados prontos estão na pasta de cima: `fase-01.png` a `fase-18.png`, `legenda.png`, `curva.png`, `fases.json` e `pagina-de-leitura.html` (a mesma página publicada em claude.ai, link no benchmark).

## O formato dos arquivos de fase (CGL1)

Decifrado pelo Claude em 06/10/2026, com a ajuda do jogo (`GRAVITY.HLP`) e do editor de fases (`CGLEDIT.HLP`). Números em little-endian. Unidades: o **campo** tem 32×32 pixels; a régua do editor tem 8 **unidades** por campo (1 unidade = 4 pixels).

O arquivo começa com `CGL1` e segue em blocos, cada um aberto por uma etiqueta de 4 letras. Os blocos de objetos começam com a quantidade (u32), seguida dos registros, e às vezes terminam com a marca `E1 D2 C3 B4`.

| Bloco | Conteúdo |
|---|---|
| `SIZE` | Largura e altura da fase em campos (u32, u32). Mínimo 20×20 |
| `SOIN` | Um byte por campo, linha a linha: bit 7 = campo totalmente coberto; bits 0 a 6 = quantos pedaços de terreno há no campo. Termina com `E1 D2 C3 B4` |
| `SOBS` | Os pedaços de terreno, na mesma ordem dos campos, 4 bytes cada (ver abaixo) |
| `VENT` | Ventiladores, 38 bytes cada |
| `MAGN` | Ímãs, 38 bytes cada |
| `DIST` | Geradores de corrente de ar, 38 bytes cada |
| `CANO` | Canhões, 51 bytes cada |
| `PIPE` | Pares de hastes, 24 bytes cada |
| `ONEW` | Portões de mão única, 65 bytes cada |
| `BARR` | Portões trancados, 65 bytes cada |
| `LPTS` | Plataformas de pouso, 52 bytes cada |
| `LVIN` | Informações da fase |

### Pedaço de terreno (`SOBS`, 4 bytes)

| Byte | Significado |
|---|---|
| 0 | Posição dentro do campo: 4 bits altos = x, 4 bits baixos = y (em unidades, de 0 a 7) |
| 1 | Tamanho: 4 bits altos = largura, 4 bits baixos = altura (em unidades). Pedaços que passam da borda do campo são cortados no desenho; o campo vizinho guarda a outra parte |
| 2 e 3 | Gráfico. Com byte 2 = 0 e tamanho 8×8, é um **tijolo colorido** de campo inteiro (byte 3 = código do tijolo, de 0x3C a 0x64); nos outros casos, um pedaço de **pedra cinza** (8×8, 6×6 ou 4×4 no editor). Os códigos de gráfico não foram decifrados em detalhe |

Conferência: na fase 1, os campos somam 2.375 pedaços, e o bloco `SOBS` tem exatamente 2.375 × 4 bytes, mais a marca final.

### Ventilador, ímã e corrente de ar (38 bytes)

| Bytes | Significado |
|---|---|
| 0 | 4 bits baixos = direção (0 baixo, 1 cima, 2 esquerda, 3 direita); 4 bits altos = variação (no ventilador, a versão com ou sem grade; na corrente, provavelmente o sentido do giro; não confirmado) |
| 2–5 | Posição (x, y em pixels) |
| 6–9 | Alcance e gráfico (no ventilador, o alcance fica nos bytes 6–7; no ímã, nos bytes 8–9) |
| 10–17 | Corpo do objeto (x, y, largura, altura) |
| 30–37 | **Área de efeito** (x, y, largura, altura): é a que os mapas desenham |

### Canhão (51 bytes)

| Bytes | Significado |
|---|---|
| 0 | Direção |
| 3–4 | Cadência: quadros entre um tiro e outro (de 15 a 180 nas fases) |
| 6 | Velocidade da bola (com sinal = sentido); zero em alguns canhões horizontais, não decifrado |
| 7–14 | Trajetória: ponto de saída (x, y) e ponto final (x, y) |
| 43–50 | Retângulo que contém o canhão inteiro |

### Par de hastes (24 bytes)

| Bytes | Significado |
|---|---|
| 0 | 0 = vertical, 1 = horizontal |
| 2–3 | Vão entre as hastes (de 20 a 200 pixels nas fases) |
| 4–13 | Velocidades e opções (vão fixo ou variável, "muda de velocidade com frequência"); não separados um a um |
| 16–23 | Retângulo do par (x, y, largura, altura) |

### Portões (`ONEW` e `BARR`, 65 bytes)

| Bytes | Significado |
|---|---|
| 0 | Nos trancados, 4 bits altos = chaves exigidas: 0x80 vermelha, 0x40 verde, 0x20 azul, 0x10 amarela. 4 bits baixos = lado e sentido |
| u16 a partir do byte 1, índices 24–27 | Retângulo da metade do portão (x, y, largura, altura) |
| u16 a partir do byte 1, índices 28–31 | Área onde a nave abre o portão |

Um portão costuma ter duas metades, que compartilham a mesma área de ativação; os mapas juntam as metades numa caixa só. A seta do portão de mão única vai da área de ativação para o portão.

### Plataforma (`LPTS`, 52 bytes)

| Bytes | Significado |
|---|---|
| 0 | 4 bits baixos = tipo: 1 base, 2 chave, 3 combustível, 4 carga, 5 extra. 4 bits altos = cor da chave (0 vermelha, 1 verde, 2 azul, 3 amarela) ou as setas da base |
| 1–4 | Posição (x, y em pixels) |
| 5 | Largura em campos (a plataforma desenhada tem 32 × largura − 16 pixels) |
| 6–11 | Cores e gráfico da plataforma |
| 13 | Quantidade de itens (até 10) |
| 14–23 | Posição horizontal de cada item, em pixels a partir da borda esquerda |
| 24–33 | Posição vertical de cada item (0x10 = embaixo, 0 = empilhado em cima, 8 = chave) |
| 34–43 | Tipo de cada item: cargas 1 a 4 (os 4 visuais de contêiner); extras 5, 6 e 7 |
| 44–51 | Retângulo da plataforma (x, y, largura, altura) |

Extras: o **7 é o porão** (aparece nas fases com plataformas de 2 e 3 cargas). O 5 e o 6 foram lidos como **turbo** e **vida**, pela ordem em que o manual os cita; não confirmado.

### Informações da fase (`LVIN`)

| Campo | Significado |
|---|---|
| u32 inicial | Padrão de fundo (0 a 4) |
| Texto | Senha da fase (8 letras); a primeira fase não tem |
| Texto | Arquivo da próxima fase (`Level02.cgl`...) ; a última não tem |
| u32 final | Combustível inicial (6000 = tanque cheio, em todas as fases) |

Conferência: as senhas lidas batem com as listas publicadas (HYACINTH, MERIDIAN, KICKBACK, INTERVAL, YEARLING, AMBROSIA, POSITRON, CLAVICLE, DAFFODIL, DICTATOR, BLACKOUT, LABURNUM, ZUCCHINI, EYEGLASS, FRIPPERY, GUARDIAN, NUISANCE).

## `fases.json`

Um registro por fase: senha, tamanho, porcentagem de área aberta, cargas, postos e barris, chaves, extras, quantidade de cada obstáculo, portões (agrupados por metade), maior número de chaves exigidas por um portão, viagens, distância da carga mais longe e "voo estimado" (soma das idas e voltas entre a base e cada carga, uma por viagem, pelo caminho livre mais curto em campos, ignorando portões e obstáculos), além da cadência dos canhões, do vão das hastes e da direção de ventiladores e ímãs.
