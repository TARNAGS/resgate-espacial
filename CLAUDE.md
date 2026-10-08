# Resgate Espacial — instruções para o Claude Code

> Valem em qualquer máquina (Mac e Windows). As regras gerais do Fernando ficam no CLAUDE.md compartilhado do `context-directory`; aqui ficam só as deste projeto.

## O que é este projeto

Projeto de treino de Product Management, peça de portfólio e, desde 02/10/2026, aposta de negócio do Fernando: recriar um jogo de nave 2D da juventude (gravidade, combustível, resgate de tripulação), levado da ideia até a publicação na App Store e no Google Play (D-019). O MVP tem 3 fases e roda no navegador; o big picture (mundos de 10 fases, abertura, loja de itens) está na Visão, seção 8.3. O Claude atua como parceiro de PM: organiza o processo, faz as perguntas, rascunha e constrói. **As decisões de produto são do Fernando.**

"Resgate Espacial" é um codinome; o nome final é a pendência P-003.

## Antes de retomar

Leia o [diário de bordo](docs/06-diario-de-bordo.md). A seção "Onde paramos" diz o marco atual e os próximos passos.

## Onde está cada coisa

| O quê | Onde |
|---|---|
| Visão, regras do jogo, PRD, roadmap e decisões | `docs/01` a `docs/05` |
| Design de cada mundo (modelo e documentos) | `docs/08-design-de-mundos.md` e `docs/mundos/` |
| O que foi feito e onde paramos | `docs/06-diario-de-bordo.md` |
| O jogo (código, testes e como criar fases e obstáculos) | `jogo/` e [`jogo/README.md`](jogo/README.md); roda com `node jogo/servir.js` em http://localhost:8081 e os testes com `node jogo/testes/rodar.js` (`--rapido` durante o trabalho); telemetria do playtest com `node jogo/ferramentas/relatorio-telemetria.mjs` (traz o ranking junto) e mapas de calor com `node jogo/ferramentas/mapas-telemetria.mjs` (salva em `jogo/ferramentas/saida/`, fora do Git) |
| Roteiro de teste com pessoas | `docs/07-roteiro-de-teste-do-controle.md` |
| Resultados dos playtests (análise da telemetria, sem nicknames) | `docs/09-resultados-dos-playtests.md` |
| Protótipos descartáveis | `prototipos/`; o 01 roda com `node prototipos/servir.js` em http://localhost:8080 |
| Backlog (iniciativas, épicos, histórias, tarefas e descobertas) | Issues do GitHub, ligadas por sub-issues, com os marcos M0 a M3 |
| Quadro kanban | GitHub Project "Resgate Espacial — Produto": https://github.com/users/TARNAGS/projects/1 |
| Modelos de issue | `.github/ISSUE_TEMPLATE/` |
| Abrir o jogo ou o protótipo pelo navegador do Claude Code | `.claude/launch.json`, configurações "jogo" e "prototipo" |
| Arquitetura do jogo e mapa de impacto (camadas, o que cada mudança afeta, acoplamentos e guardas automáticas) | `docs/12-arquitetura-do-jogo.md` ([#111](https://github.com/TARNAGS/resgate-espacial/issues/111)) |
| Anticheat e ranking justo (tipos de anticheat, casos, portas abertas do ranking e proposta em degraus) | `docs/11-anticheat-e-ranking-justo.md` ([#109](https://github.com/TARNAGS/resgate-espacial/issues/109)) |
| Modelo de negócio (Lean Canvas revisado com o Fernando: problema, solução, proposta de valor, métricas, segmentos, canais, receita e custos) | `docs/13-modelo-de-negocio.md` |
| Benchmarks de jogos de referência | `docs/benchmark/README.md` (guia: os estudos lidos juntos, insights e decisões pendentes; comece por ele), `docs/10-benchmark-de-level-design.md` (índice e lições) e `docs/benchmark/`; todo discovery novo segue a skill global `discovery-de-jogos` (fica no `context-directory`, em `setup/claude-global/skills/`) |

## Como trabalhamos

- Um documento por vez. Cada regra é marcada como **Definido**, **Proposta** ou **Em aberto**, e o Fernando valida as propostas.
- Toda decisão relevante vai para `docs/05-registro-de-decisoes.md` como D-xxx, com contexto, opções, consequências e "revisitar se". Perguntas ainda abertas viram pendências P-xxx.
- Os documentos aprovados estão em v1.x; qualquer mudança entra no histórico de versões do próprio documento.
- Antes de afirmar algo sobre plataforma (iOS, navegadores, GitHub), conferir numa fonte primária (MDN, WebKit, documentação oficial) e citar a fonte.
- **Antes de construir (D-033):** ao criar ou mudar uma mecânica, fase, obstáculo ou regra de gameplay, passar pelos estudos de level design e gameplay (documento 10 e `docs/benchmark/`), validar a ideia contra eles e dizer de onde veio a inspiração. **Inspirar, nunca copiar** (D-005), e o Fernando orienta o que é criado. O passo a passo está na skill `discovery-de-jogos`, seção "Antes de construir".
- Documentação em português. **Textos do jogo em inglês** (D-007). No código, nomes em inglês e comentários em português.

## Análise dos playtests

- **Sempre analisar o ranking** (`scores/` no Firebase) junto com a telemetria. O ranking mostra quem foi mais rápido e com que controle; a telemetria mostra como (abastecimentos, combustível que sobrou, mortes).
- **O nick do Fernando é TARNAG.** Se ele aparecer como o mais rápido, ou numa corrida que chame a atenção, identificar as corridas dele e perguntar o que ele achou: ele é um dos playtesters e explica o que os números não mostram.
- Nos documentos versionados, não escrever o nick dos outros playtesters (o repositório abre nas janelas de teste).

## Portfólio de PM

O projeto é a peça de portfólio do Fernando como Product Manager. A narrativa (decisões, orientações, métricas, viradas de rumo e citações dele, escrita para uma IA montar o estudo de caso) fica **fora deste repositório**, no `context-directory` privado: `me/14-Portfolio-de-Produto/resgate-espacial.md`. Ela é alimentada a cada "boa noite" (regra no CLAUDE.md global). Ao tomar ou registrar uma decisão importante aqui, lembrar que ela vai para lá no fechamento do dia.

## Quadro e issues

O quadro tem duas trilhas (D-016):

- **Descoberta:** Caixa de entrada → A investigar → Investigando → Para conversar.
- **Entrega:** Backlog → Pronto → Em andamento → Em revisão → Concluído.

O campo "Quem" (Fernando ou Claude) diz com quem o cartão está.

- **No começo de cada sessão, olhar primeiro a coluna "Para conversar".** Os achados estão num comentário da issue. Da conversa sai uma decisão (D-xxx), histórias ou tarefas no Backlog, ou o descarte. A pesquisa é fechada e gera os itens novos; o bug segue no mesmo cartão até ser corrigido.
- "Para conversar" exige um comentário com a pergunta respondida, as evidências, a recomendação (quando for uma decisão) e o que ficou em aberto. Se faltar algo, perguntar ao Fernando antes de seguir.
- "Investigando" tem no máximo 2 cartões.
- Todo item novo cai sozinho na "Caixa de entrada". Ao criar pelo `gh` um item que já está claro (história ou tarefa de construção), mover direto para o "Backlog". Do Backlog, só vai para "Pronto" quando não tiver dependência aberta.
- Pergunta a responder antes de construir (pesquisa, decisão, teste com pessoas) é `descoberta`, não `tarefa`. Bug usa a etiqueta `bug` e o modelo Bug.
- Ao começar um item, mover o cartão para "Em andamento" (ou "Investigando", na descoberta). Ao terminar, fechar a issue: a automação do quadro move o cartão para "Concluído".
- Histórias só para os próximos marcos (Roadmap, seção 5). As dos marcos seguintes são escritas quando eles se aproximarem.
- Tarefa (trabalho técnico ou atividade de produto) não é história de usuário: usar a etiqueta `tarefa`.
- O `gh` precisa do escopo `project` para mexer no quadro; `gh auth status` mostra os escopos. Para pedir o escopo, rodar `gh auth refresh -h github.com -s project` em segundo plano e passar ao Fernando o código e o link https://github.com/login/device.

## Git

- O repositório e o quadro são **privados** (D-017). O repositório só é aberto durante as janelas de teste (ver abaixo); o quadro fica privado até o lançamento.
- Os commits usam o e-mail noreply do GitHub, porque o repositório abre nas janelas de teste. Conferir com `git config user.email`; se não for `332717587+TARNAGS@users.noreply.github.com`, configurar antes do primeiro commit.
- O histórico foi reescrito em 01/10/2026 para tirar o e-mail pessoal. Cópias do repositório feitas antes disso precisam ser baixadas de novo.
- Antes de cada commit, conferir que não vai junto nenhum segredo nem o e-mail pessoal.

## Janela de teste (D-017)

No plano gratuito, o GitHub Pages só publica repositórios públicos. Para o Fernando testar o jogo publicado:

0. **Antes de abrir uma rodada com outras pessoas:**
   - combinar com o Fernando o começo e o fim. Uma rodada com amigos dura um fim de semana (documento 09, "Como a rodada terminou");
   - deixar pronta a linha de patch note da versão ([#126](https://github.com/TARNAGS/resgate-espacial/issues/126)), com o texto aprovado pelo Fernando;
   - acrescentar as chaves das fases novas em `jogo/testes/conteudo/chaves-publicadas.json` (#117);
   - não enviar ao GitHub, enquanto a janela estiver aberta, documentos que expliquem as fraquezas do ranking (o documento 11, por exemplo).
1. Avisar que, enquanto a janela estiver aberta, qualquer pessoa vê e pode copiar o repositório inteiro.
2. Abrir: `gh repo edit TARNAGS/resgate-espacial --visibility public --accept-visibility-change-consequences`.
3. Reativar o Pages, que é apagado quando o repositório fecha: `gh api -X POST repos/TARNAGS/resgate-espacial/pages -f "source[branch]=main" -f "source[path]=/"`. Depois do primeiro build, forçar HTTPS: `gh api -X PUT repos/TARNAGS/resgate-espacial/pages -F https_enforced=true`.
4. Conferir que https://tarnags.github.io/resgate-espacial/prototipos/01/ responde, e passar o link.
5. No fim do teste, fechar: `gh repo edit TARNAGS/resgate-espacial --visibility private --accept-visibility-change-consequences`. Conferir que o link volta a dar 404. Depois, registrar no documento 09 como a rodada terminou (sessões por dia, a partir da telemetria) e tirar o aviso de janela aberta do diário de bordo.

Fora das janelas, o protótipo roda na rede de casa. Rodar `node prototipos/servir.js` e, no iPhone, no mesmo Wi-Fi, abrir `http://<IP do computador>:8080/01/`. Para achar o IP: `ipconfig` no Windows, `ipconfig getifaddr en0` no Mac. O Windows pode pedir para liberar o Node no firewall. Sem HTTPS, não dá para instalar como app.

## Tecnologia

- JavaScript puro com Canvas, sem framework e sem etapa de build (D-011).
- Hospedagem no GitHub Pages, em `tarnags.github.io/resgate-espacial` (D-013), só durante as janelas de teste (D-017). Como o jogo roda nesse subcaminho, manifesto e service worker precisam usar caminhos relativos.
- Prioridade para o iPhone (D-008). As limitações do iPhone para PWAs estão no PRD, seção 6.
- Os parâmetros de ajuste da física ficam num lugar só: `jogo/src/config/params.js`.
- **Regras do banco (Firebase):** `jogo/firebase/regras.json` é a cópia fiel do que está publicado (ranking, telemetria e perfil, desde 07/10/2026). Para mudar:
  1. o Claude edita o arquivo;
  2. o Fernando cola o texto **inteiro** no console do Firebase (Ctrl+A, Ctrl+V) e publica;
  3. o Claude confere pelo terminal com leituras e gravações que precisam ser recusadas.

  Nunca colar só um pedaço: a lista é uma só, e o que faltar fica fechado. Publicar regras e apagar dados do banco são ações do Fernando.
- Conteúdo é dado, não código: mundos e níveis em `jogo/src/content/worlds/` (um arquivo por mundo, juntados por `worlds.js`), obstáculos em `jogo/src/content/obstacles/`, modificadores em `jogo/src/content/modifiers.js`. Cada um tem contrato conferido por teste (documento 12, seção 1).
- **Antes de mudar o jogo, consultar o mapa de impacto** (documento 12, seção 3): o que muda junto e o que conferir. Quem criar um acoplamento novo acrescenta a linha no mapa (épico E-26).
- Testes: `node jogo/testes/rodar.js --rapido` a cada mudança (uns 3 s); `node jogo/testes/rodar.js` (todos) antes de cada commit que mexe no jogo. Regra nova ou mudada ganha teste.
- **Fichas de ouro (#114):** se uma regra mudou de propósito, regravar com `node jogo/testes/rodar.js --atualizar-ouro` e mostrar ao Fernando a diferença das fichas (`jogo/testes/ouro/fichas/`). Nunca regravar só para o teste passar sem entender por que a ficha mudou.
- Fases geradas a partir de uma semente (D-014): a mesma semente gera sempre o mesmo cenário, e todo cenário precisa ter solução. As fases da sequência e a PRACTICE usam semente fixa (D-021); só a BONUS sorteia.
- Caminho provado (D-018) e abastecer obrigatório (D-023): o piloto automático (`jogo/src/core/autopilot.js`) joga cada cenário; nas fases com posto, o tanque permite concluir abastecendo uma vez (na ida ou na volta), mas não sem abastecer. Mudou a física, um obstáculo ou o contato? Rodar os testes, que reproduzem essas rotas numa partida de verdade.
- Piloto expert (D-026, #92): no mesmo arquivo, voa como os melhores jogadores e mede o melhor que dá para fazer; os números do tanque saem de `node jogo/ferramentas/medir-tanque.mjs`. O tanque das fases ainda vem do piloto cauteloso, até a #93.
