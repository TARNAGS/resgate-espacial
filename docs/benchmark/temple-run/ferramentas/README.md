# Ferramentas do benchmark do Temple Run

Scripts que geram os diagramas e a página de leitura do [benchmark](../../temple-run.md). Rodam com Node, sem dependências. Nenhum arquivo do jogo é usado: os diagramas foram redesenhados a partir das falas dos criadores (Keith Shepherd na GDC 2014; entrevistas dos 10 anos) e da Temple Run Wiki.

| Arquivo | O que faz |
|---|---|
| `diagramas.js` | Desenha os três diagramas (a pista vista de cima, a perseguição com os dois tipos de erro e a linha do tempo). Rodado sozinho, grava SVG claros em `saida/`; a página de leitura usa as mesmas funções com as cores do tema |
| `fotografar.ps1` | Converte os SVG de `saida/` em PNG com o Edge sem janela (Windows) |
| `montar-pagina.js` | Gera `saida/pagina-de-leitura.html`, com os diagramas embutidos em SVG |

## Como regenerar

1. `node diagramas.js`
2. No Windows: `powershell -ExecutionPolicy Bypass -File fotografar.ps1` (no Mac, o mesmo com o Chrome sem janela)
3. `node montar-pagina.js`
4. Copie `saida/*.png` e `saida/pagina-de-leitura.html` para a pasta de cima.
