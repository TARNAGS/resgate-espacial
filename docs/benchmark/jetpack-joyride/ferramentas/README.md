# Ferramentas do benchmark do Jetpack Joyride

Scripts que geram os diagramas e a página de leitura do [benchmark](../../jetpack-joyride.md). Rodam com Node, sem dependências. Nenhum arquivo do jogo é usado: os diagramas foram redesenhados a partir dos slides de Luke Muscat (GDC 2012) e da Jetpack Joyride Wiki.

| Arquivo | O que faz |
|---|---|
| `diagramas.js` | Desenha os quatro diagramas (curva de intensidade, sistema de intervalos, laços entre corridas e estrelas por nível). Rodado sozinho, grava SVG claros em `saida/`; a página de leitura usa as mesmas funções com as cores do tema |
| `fotografar.ps1` | Converte os SVG de `saida/` em PNG com o Edge sem janela (Windows) |
| `montar-pagina.js` | Gera `saida/pagina-de-leitura.html`, com os diagramas embutidos em SVG |

## Como regenerar

1. `node diagramas.js`
2. No Windows: `powershell -ExecutionPolicy Bypass -File fotografar.ps1` (no Mac, o mesmo com o Chrome sem janela)
3. `node montar-pagina.js`
4. Copie `saida/*.png` e `saida/pagina-de-leitura.html` para a pasta de cima.

As cores dos diagramas foram conferidas com o validador de paletas da skill de gráficos, nos temas claro e escuro.
