# Resgate Espacial — instruções para o Claude Code

> Valem em qualquer máquina (Mac e Windows). As regras gerais do Fernando ficam no CLAUDE.md compartilhado do `context-directory`; aqui ficam só as deste projeto.

## O que é este projeto

Projeto de treino de Product Management e peça de portfólio do Fernando: recriar um jogo de nave 2D da juventude (gravidade, combustível, resgate de tripulação) como um PWA gratuito, levado da ideia ao lançamento. O Claude atua como parceiro de PM: organiza o processo, faz as perguntas, rascunha e constrói. **As decisões de produto são do Fernando.**

"Resgate Espacial" é um codinome; o nome final é a pendência P-003.

## Antes de retomar

Leia o [diário de bordo](docs/06-diario-de-bordo.md). A seção "Onde paramos" diz o marco atual e os próximos passos.

## Onde está cada coisa

| O quê | Onde |
|---|---|
| Visão, regras do jogo, PRD, roadmap e decisões | `docs/01` a `docs/05` |
| O que foi feito e onde paramos | `docs/06-diario-de-bordo.md` |
| Protótipos descartáveis | `prototipos/`; o 01 roda com `node prototipos/servir.js` em http://localhost:8080 |
| Backlog (iniciativas, épicos, histórias e tarefas) | Issues do GitHub, ligadas por sub-issues, com os marcos M0 a M3 |
| Quadro kanban | GitHub Project "Resgate Espacial — Backlog": https://github.com/users/TARNAGS/projects/1 |
| Modelos de issue | `.github/ISSUE_TEMPLATE/` |
| Abrir o protótipo pelo navegador do Claude Code | `.claude/launch.json`, configuração "prototipo" |

## Como trabalhamos

- Um documento por vez. Cada regra é marcada como **Definido**, **Proposta** ou **Em aberto**, e o Fernando valida as propostas.
- Toda decisão relevante vai para `docs/05-registro-de-decisoes.md` como D-xxx, com contexto, opções, consequências e "revisitar se". Perguntas ainda abertas viram pendências P-xxx.
- Os documentos aprovados estão em v1.x; qualquer mudança entra no histórico de versões do próprio documento.
- Antes de afirmar algo sobre plataforma (iOS, navegadores, GitHub), conferir numa fonte primária (MDN, WebKit, documentação oficial) e citar a fonte.
- Documentação em português. **Textos do jogo em inglês** (D-007). No código, nomes em inglês e comentários em português.

## Quadro e issues

- Ao começar um item, mover o cartão para "Em andamento". Ao terminar, fechar a issue: a automação do quadro move o cartão para "Concluído".
- Item novo no quadro cai sozinho no "Backlog"; só vai para "Pronto" quando não tiver dependência aberta.
- Histórias só para os próximos marcos (Roadmap, seção 5). As dos marcos seguintes são escritas quando eles se aproximarem.
- Tarefa (decisão ou trabalho técnico) não é história de usuário: usar a etiqueta `tarefa`.
- O `gh` precisa do escopo `project` para mexer no quadro; `gh auth status` mostra os escopos. Para pedir o escopo, rodar `gh auth refresh -h github.com -s project` em segundo plano e passar ao Fernando o código e o link https://github.com/login/device.

## Git

- O repositório é **público** (D-012). Os commits usam o e-mail noreply do GitHub. Conferir com `git config user.email`; se não for `332717587+TARNAGS@users.noreply.github.com`, configurar antes do primeiro commit.
- O histórico foi reescrito em 01/10/2026 para tirar o e-mail pessoal. Cópias do repositório feitas antes disso precisam ser baixadas de novo.
- Antes de cada commit, conferir que não vai junto nenhum segredo nem o e-mail pessoal.

## Tecnologia

- JavaScript puro com Canvas, sem framework e sem etapa de build (D-011).
- Hospedagem no GitHub Pages, em `tarnags.github.io/resgate-espacial` (D-013): como o jogo roda nesse subcaminho, manifesto e service worker precisam usar caminhos relativos.
- Prioridade para o iPhone (D-008). As limitações do iPhone para PWAs estão no PRD, seção 6.
- Os parâmetros de ajuste da física ficam num lugar só (`PARAMS`, no topo do `game.js` do protótipo).
- Fases geradas a partir de uma semente (D-014): a mesma semente gera sempre o mesmo cenário, e todo cenário gerado precisa ter solução.
