# Ferramentas do benchmark do Geometry Dash

Scripts que geram os diagramas e a página de leitura do [benchmark](../../geometry-dash.md). Rodam com Node, sem dependências. Nenhum arquivo do jogo é usado: os números vêm de [`../fases.json`](../fases.json), montado a partir da Geometry Dash Wiki (páginas "Main Levels", "Geometry Dash World", "Dashlands", "Toxic Factory", "Tower" e as de cada fase da Torre e dos spin-offs, lidas pela interface de dados da wiki em 08/10/2026). A coluna "novidade" de cada fase é um resumo traduzido do texto da wiki.

| Arquivo | O que faz |
|---|---|
| `diagramas.js` | Desenha os cinco diagramas: a curva das 22 fases oficiais, o Geometry Dash World (10 fases em 2 mundos), checkpoints e ranking, o funil do grátis para o pago e a linha do tempo das fases oficiais. Rodado sozinho, grava SVG claros em `saida/`; a página de leitura usa as mesmas funções com as cores do tema |
| `fotografar.ps1` | Converte os SVG de `saida/` em PNG com o Edge sem janela (Windows) |
| `montar-pagina.js` | Gera `saida/pagina-de-leitura.html`, com os diagramas embutidos em SVG e a tabela das fases tirada do `fases.json` |

## Como regenerar

1. `node diagramas.js`
2. No Windows: `powershell -ExecutionPolicy Bypass -File fotografar.ps1` (no Mac, o mesmo com o Chrome sem janela)
3. `node montar-pagina.js`
4. Copie `saida/*.png` e `saida/pagina-de-leitura.html` para a pasta de cima.

## Como o `fases.json` foi montado

As páginas da wiki foram lidas com `https://geometry-dash.fandom.com/api.php?action=parse&page=<Página>&prop=wikitext&redirects=1&format=json`. Da página "Main Levels" saíram, para cada fase, a dificuldade, as estrelas, os modos, a duração ("takes N seconds to complete"), o mínimo de pulos, a dificuldade antes da atualização 1.9 e as dicas que aparecem na tela. A atualização em que cada fase entrou vem do log de atualizações do iOS, no artigo "Geometry Dash" da wiki. Para atualizar, refaça a leitura e confira se a wiki mudou algum número.
