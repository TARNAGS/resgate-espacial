# Ferramentas do benchmark do Super Mario World

Scripts que geram os diagramas e a página de leitura do [benchmark](../../super-mario-world.md). Rodam com Node, sem dependências. Nenhum arquivo do jogo é usado: os dados vêm de [`../fases.json`](../fases.json), montado a partir da Super Mario Wiki (a lista de textos do jogo, "Tourist Tips", e as páginas das fases do primeiro mundo, lidas pela interface de dados da wiki em 08/10/2026) e das entrevistas Iwata Asks. Os resumos em português das dicas e a classificação de cada mensagem (dica de jogo ou história) são do Claude.

| Arquivo | O que faz |
|---|---|
| `diagramas.js` | Desenha os cinco diagramas: onde o jogo fala (mensagens por mundo), o primeiro mundo como sequência de aulas, os quatro tempos de uma fase, as camadas de rede de segurança e a ajuda depois do erro na série. Rodado sozinho, grava SVG claros em `saida/`; a página de leitura usa as mesmas funções com as cores do tema |
| `fotografar.ps1` | Converte os SVG de `saida/` em PNG com o Edge sem janela (Windows) |
| `montar-pagina.js` | Gera `saida/pagina-de-leitura.html`, com os diagramas embutidos em SVG e as tabelas tiradas do `fases.json` |

## Como regenerar

1. `node diagramas.js`
2. No Windows: `powershell -ExecutionPolicy Bypass -File fotografar.ps1` (no Mac, o mesmo com o Chrome sem janela)
3. `node montar-pagina.js`
4. Copie `saida/*.png` e `saida/pagina-de-leitura.html` para a pasta de cima.

## Como os dados foram montados

A página "Tourist Tips" da Super Mario Wiki traz, numa tabela, todos os textos do jogo (versão de Super Nintendo e reedição de Game Boy Advance) com a fase e o momento em que aparecem. Ela foi lida com `https://www.mariowiki.com/api.php?action=parse&page=Tourist_Tips&prop=wikitext&format=json`; as 31 mensagens da versão de Super Nintendo foram classificadas à mão em dica de jogo (19) ou história (12) e associadas ao mundo. As entrevistas Iwata Asks trazem o texto completo de todas as partes dentro de cada página do site oficial (no bloco de dados `__NEXT_DATA__`), o que permite ler cada entrevista inteira.
