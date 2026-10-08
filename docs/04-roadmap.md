# Roadmap — Resgate Espacial

| Campo | Valor |
|---|---|
| Documento | 04 — Roadmap |
| Versão | 1.8 |
| Data | 07/10/2026 |
| Status | Aprovado |
| Responsável | Fernando Nunes (Product Manager) |

O roadmap organiza **em que ordem** o produto vai ser construído. Não há data-alvo ([D-010](05-registro-de-decisoes.md#d-010--sem-data-alvo-planejamento-por-marcos)): o projeto avança por marcos, e cada marco só termina quando cumpre o seu critério de saída.

O backlog está no GitHub: [issues](https://github.com/TARNAGS/resgate-espacial/issues), [marcos](https://github.com/TARNAGS/resgate-espacial/milestones) e [quadro kanban](https://github.com/users/TARNAGS/projects/1). Os IDs das tabelas abaixo levam à issue correspondente.

## 1. Visão geral

```mermaid
flowchart LR
    M0["M0 · Fundação"] --> M1["M1 · Protótipo de controle"] --> M2["M2 · MVP (3 fases)"] --> M3["M3 · V1"] --> M4["M4 · Lojas (proposta)"] --> M5["M5 · Mundos e loja (proposta)"] --> D["Depois"]
```

| Marco | Objetivo | O que entra | Critério de saída |
|---|---|---|---|
| **M0 — Fundação** | Conseguir testar qualquer coisa no iPhone | Decisões de tecnologia, visibilidade do repositório e hospedagem; publicação automática | O endereço do jogo abre no iPhone, e cada envio ao GitHub atualiza o que está publicado |
| **M1 — Protótipo de controle** | Validar o maior risco: o controle é divertido no iPhone? | Física da nave, teclado, direcional virtual e um cenário de teste com uma plataforma | Pelo menos 4 de 5 testadores decolam, voam e pousam em poucos minutos e aprovam a sensação (meta proposta); parâmetros de ajuste calibrados |
| **M2 — MVP** | Lançar o ciclo completo do jogo e começar a medir | Níveis 1 a 3 com cenário fixo (D-009 e D-021), desafios PRACTICE e BONUS, menu com mapa de progresso (D-015), requisitos MVP do PRD, pontuação, nome final e medição | Checklist de lançamento do PRD (seção 8) completo e jogo divulgado no portfólio |
| **M3 — V1** | Mais conteúdo e mais aparelhos, guiados pelos dados | Níveis 4 e 5, Android e ajustes a partir das métricas | Níveis 4 e 5 no ar, instalação testada num Android e metas da Visão revistas com dados reais |
| **M4 — Lojas** (proposta) | Levar o jogo aos celulares pelas lojas (D-019) | Empacotar o jogo como app, contas de desenvolvedor, revisão da Apple e do Google, com o conteúdo da V1. Cobrar ou não já decidido (P-014) | Jogo aprovado e disponível na App Store e no Google Play |
| **M5 — Mundos e loja** (proposta) | O big picture: replay alto, muitas fases e o teste do negócio | Mundo 1 completo (fases 6 a 10), documento de design de cada mundo (D-020), abertura em telas, loja de itens e moedas (P-017) | Mundo 1 com 10 fases e loja no ar nas lojas |
| **Depois** | Guardar ideias sem compromisso | Mundos seguintes e ideias do documento 02, seção 15 | — |

**Por que lojas antes de mundos e loja (proposta):** publicar cedo, com pouco conteúdo, testa o caminho até as lojas (empacotamento e revisão, o maior risco técnico da [#65](https://github.com/TARNAGS/resgate-espacial/issues/65)) antes de investir em mundos. E a loja de itens depende do sistema de compras das lojas. A alternativa é publicar só quando o Mundo 1 estiver completo; essa ordem é decisão do Fernando.

**Se o M1 reprovar o controle, o projeto não avança para as fases.** Primeiro testa-se a variante do direcional (D-006); se ainda assim não ficar divertido, o design do controle é revisto. Falhar no protótipo é barato; falhar depois de construir as fases, não.

## 2. Iniciativas

| ID | Iniciativa | Objetivo da Visão que atende | Marcos |
|---|---|---|---|
| [I-01](https://github.com/TARNAGS/resgate-espacial/issues/1) | Fundação técnica | Publicar o jogo (seção 6.3) e crescer sem quebrar as regras (seção 8.3) | M0, M2 e M3 |
| [I-02](https://github.com/TARNAGS/resgate-espacial/issues/2) | Provar a diversão do controle | Princípio "o controle é o produto" e maior risco do produto (seção 10) | M1 |
| [I-03](https://github.com/TARNAGS/resgate-espacial/issues/3) | Jogo completo: do voo ao resgate | North Star: resgates concluídos (seção 6.1) | M2 e M3 |
| [I-04](https://github.com/TARNAGS/resgate-espacial/issues/4) | Instalável e confiável no celular | Acesso sem atrito e instalação (seção 6.2) | M2 e M3 |
| [I-05](https://github.com/TARNAGS/resgate-espacial/issues/5) | Aprender com os jogadores | Métricas e hipóteses H1 a H3 (seções 3 e 6) | M2 e M3 |
| [I-06](https://github.com/TARNAGS/resgate-espacial/issues/6) | Portfólio: contar a história | Mostrar o processo de produto (seção 6.3) | M2 |
| [I-07](https://github.com/TARNAGS/resgate-espacial/issues/69) | Publicar nas lojas e testar o negócio | Publicar o jogo e testar o negócio (seções 2, 6.3 e 8.3) | M4 e M5 |
| [I-08](https://github.com/TARNAGS/resgate-espacial/issues/70) | Mais jogo: mundos, abertura e conteúdo | Princípios "sem enredo" e "replay alto" (seções 7 e 8.3) | M5 |

## 3. Épicos

### I-01 — Fundação técnica (M0, M2 e M3)

| ID | Épico | O que inclui | Referências |
|---|---|---|---|
| [E-01](https://github.com/TARNAGS/resgate-espacial/issues/7) | Decisões técnicas de base | Escolher a tecnologia, a visibilidade do repositório e a hospedagem, e registrar como decisões | P-004, P-001, P-005 |
| [E-02](https://github.com/TARNAGS/resgate-espacial/issues/8) | Esqueleto publicado | Estrutura do código e publicação automática por HTTPS a cada envio ao GitHub, abrindo no iPhone | RNF-07, RNF-08 |
| [E-26](https://github.com/TARNAGS/resgate-espacial/issues/110) | Abstração (M2 e M3) | Deixar o jogo pronto para 10 mundos, 100 fases, skins, naves diferentes e evoluções sem quebrar as regras básicas: mapa de impacto, testes que vigiam as regras, contratos de fase, obstáculo, evento e parâmetros, nave como dado, skins e o código dividido em peças. Nenhuma tarefa muda o jogo para o jogador | Pedido do Fernando (07/10/2026); D-018, D-021; P-017 |

### I-02 — Provar a diversão do controle (M1)

| ID | Épico | O que inclui | Referências |
|---|---|---|---|
| [E-03](https://github.com/TARNAGS/resgate-espacial/issues/9) | Física da nave | Gravidade, propulsor, inércia e giro, com os parâmetros de ajuste num único lugar, e um cenário de teste com uma plataforma | Doc 02, seções 3.1 e 13; RNF-12 |
| [E-04](https://github.com/TARNAGS/resgate-espacial/issues/10) | Controle por teclado | Setas para girar e tecla do propulsor | Doc 02, seção 4.1 |
| [E-05](https://github.com/TARNAGS/resgate-espacial/issues/11) | Direcional virtual | Tocar aciona o propulsor, arrastar aponta a direção; tocar e arrastar não rola nem dá zoom na página | Doc 02, seção 4.2; D-006; RNF-10 |
| [E-06](https://github.com/TARNAGS/resgate-espacial/issues/12) | Teste com jogadores e calibragem | Roteiro de teste, 3 a 5 testes no iPhone, ajuste dos parâmetros e decisão sobre a variante do direcional | Doc 02, seção 13 |

### I-03 — Jogo completo: do voo ao resgate (M2 e M3)

| ID | Épico | O que inclui | Referências |
|---|---|---|---|
| [E-07](https://github.com/TARNAGS/resgate-espacial/issues/13) | Voo, pouso e combustível | Plataformas, regras de pouso, colisões, consumo e abastecimento | Doc 02, seções 3, 5 e 7.2 |
| [E-08](https://github.com/TARNAGS/resgate-espacial/issues/14) | Resgate, vidas e pontos de retorno | Embarque da tripulação, vidas, pontos de retorno, aviso de combustível baixo e fim de jogo | Doc 02, seções 6 e 7 |
| [E-09](https://github.com/TARNAGS/resgate-espacial/issues/15) | Gerador de fases e níveis 1 a 3 | Gerador aleatório de cenários com solução garantida, regras dos níveis 1 a 3, câmera e liberação dos níveis em sequência | Doc 02, seção 10; D-009, D-014; RF-17 |
| [E-10](https://github.com/TARNAGS/resgate-espacial/issues/16) | Telas, interface e som | Menu com mapa de progresso e configurações, pausa, resultado, fim de jogo, "Sobre", indicadores da partida e efeitos sonoros, com os textos em inglês | RF-02 a RF-08, RF-12 a RF-14; RNF-11; D-015 |
| [E-11](https://github.com/TARNAGS/resgate-espacial/issues/17) | Pontuação | Fechar o sistema de pontuação e mostrá-lo no resultado e no mapa de progresso | P-006; doc 02, seção 8 |
| [E-12](https://github.com/TARNAGS/resgate-espacial/issues/18) | Níveis 4 e 5 (M3) | Regras do gerador para túneis, passagens estreitas e o primeiro obstáculo móvel | Doc 02, seções 9 e 10 |

### I-04 — Instalável e confiável no celular (M2 e M3)

| ID | Épico | O que inclui | Referências |
|---|---|---|---|
| [E-13](https://github.com/TARNAGS/resgate-espacial/issues/19) | App instalável no iPhone | Manifesto, ícone, abertura sem as barras do navegador e passo a passo de instalação | RF-10; PRD, seção 6 |
| [E-14](https://github.com/TARNAGS/resgate-espacial/issues/20) | Sem internet e progresso salvo | Funcionamento sem conexão, progresso guardado no aparelho e pedido de armazenamento persistente | RF-09, RNF-03 |
| [E-15](https://github.com/TARNAGS/resgate-espacial/issues/21) | Tela e desempenho no iPhone | Aviso para girar, áreas seguras, carregamento e fluidez | RF-11; RNF-01, RNF-02, RNF-04, RNF-09 |
| [E-16](https://github.com/TARNAGS/resgate-espacial/issues/22) | Android (M3) | Testes em aparelho real e botão "Instalar" | RF-16, RNF-05; D-008 |

### I-05 — Aprender com os jogadores (M2 e M3)

| ID | Épico | O que inclui | Referências |
|---|---|---|---|
| [E-17](https://github.com/TARNAGS/resgate-espacial/issues/23) | Medição anônima (M2) | Escolher a ferramenta e implementar os eventos, sem dados pessoais | P-008; PRD, seção 7; RF-15, RNF-06 |
| [E-18](https://github.com/TARNAGS/resgate-espacial/issues/24) | Leitura dos dados e ajustes (M3) | Revisar as metas da Visão com dados reais e ajustar as fases onde os jogadores mais perdem vidas | Visão, seção 6.2 |

### I-06 — Portfólio: contar a história (M2)

| ID | Épico | O que inclui | Referências |
|---|---|---|---|
| [E-19](https://github.com/TARNAGS/resgate-espacial/issues/25) | Identidade do jogo | Nome final, ícone e arte próprios | P-003; D-005 |
| [E-20](https://github.com/TARNAGS/resgate-espacial/issues/26) | Estudo de caso | README contando a história do projeto, com decisões, métricas e aprendizados; abertura do repositório, se ainda for privado | P-001; Visão, seção 6.3 |

### I-07 — Publicar nas lojas e testar o negócio (M4 e M5)

| ID | Épico | O que inclui | Referências |
|---|---|---|---|
| [E-24](https://github.com/TARNAGS/resgate-espacial/issues/74) | Loja de itens e moedas (M5) | Loja no menu, itens cosméticos e de jogo, dinheiro real e moedas do jogo, sem "pague para ganhar" | P-014, P-017; RF-19, RF-20 |
| [E-25](https://github.com/TARNAGS/resgate-espacial/issues/75) | Publicação na App Store e no Google Play (M4) | Empacotamento, contas, revisão das lojas, compras dentro do app e restauração de compras sem login | D-019; [#65](https://github.com/TARNAGS/resgate-espacial/issues/65); RF-21 |

### I-08 — Mais jogo: mundos, abertura e conteúdo (M5)

| ID | Épico | O que inclui | Referências |
|---|---|---|---|
| [E-21](https://github.com/TARNAGS/resgate-espacial/issues/71) | Abertura em telas | Três telas antes da primeira fase, que dá para pular e rever | Doc 02, seção 10.1; RF-18 |
| [E-22](https://github.com/TARNAGS/resgate-espacial/issues/72) | Design dos mundos | Um documento de design por mundo, no modelo do documento 08 | D-020; documento 08 |
| [E-23](https://github.com/TARNAGS/resgate-espacial/issues/73) | Mundos com 10 fases | Fases 6 a 10 do Mundo 1 (4 e 5 estão no E-12), mundos seguintes e mapa de progresso agrupado por mundo | D-020; RF-22 |

## 4. Decisões pendentes por marco

| Antes de | Decidir | ID |
|---|---|---|
| Começar o M0 | Tecnologia, visibilidade do repositório e hospedagem: todas decididas em 01/10/2026 (D-011, D-012 e D-013) | — |
| Construir as telas de resultado (M2) | Sistema de pontuação | P-006 |
| Construir a medição (M2) | Ferramenta de medição anônima | P-008 |
| Lançar o MVP (M2) | Nome final do jogo | P-003 |
| Publicar nas lojas (M4) | Jogo pago, gratuito com loja, ou os dois; como empacotar e o risco de recusa | P-014; [#65](https://github.com/TARNAGS/resgate-espacial/issues/65) |
| Publicar nas lojas (M4) | Ranking justo: que proteção contra trapaça e se o ranking é da loja, nosso ou os dois | P-019 e P-023; [#101](https://github.com/TARNAGS/resgate-espacial/issues/101) e [#109](https://github.com/TARNAGS/resgate-espacial/issues/109) |
| Construir a loja (M5) | O que a loja vende, com que moeda e a regra de itens justos | P-017 |
| Fechar o M5 | Quantos mundos no lançamento e a novidade de cada um | P-011 |

A hospedagem deixou de ser um detalhe do fim do projeto: para testar o controle no iPhone (M1), o protótipo precisa estar publicado num endereço. Por isso as pendências P-001 e P-005 subiram para o M0.

## 5. Como o roadmap vira backlog

- Cada iniciativa e cada épico é uma issue no GitHub. Os épicos são sub-issues das iniciativas, e as histórias e tarefas são sub-issues dos épicos.
- Os marcos são *milestones* do GitHub.
- Além de histórias, o backlog tem **tarefas**: trabalho técnico, decisões e atividades de produto que habilitam as histórias, mas não são percebidas pelo jogador (ex.: decidir a hospedagem).
- **Histórias só para os próximos marcos.** Só o M0 e o M1 têm histórias e tarefas escritas. As dos marcos seguintes são escritas quando eles se aproximarem, já com o que o protótipo ensinar. Escrever tudo agora seria detalhar suposições que o M1 ainda pode mudar.
- **Exceção registrada em 02/10/2026:** para guardar o big picture, o M5 já tem a história da abertura ([#76](https://github.com/TARNAGS/resgate-espacial/issues/76)) e a descoberta da loja ([#78](https://github.com/TARNAGS/resgate-espacial/issues/78)). Elas serão revistas quando o M5 se aproximar.
- Ao fim de cada marco, uma retrospectiva curta: o que funcionou, o que não funcionou e o que foi aprendido construindo com IA.

## 6. Riscos do plano

| Risco | Severidade | Mitigação |
|---|---|---|
| Sem prazo, o projeto se arrastar ou parar no meio | Média | Marcos pequenos, cada um com uma entrega que dá para mostrar; o protótipo do M1 já é jogável |
| O protótipo reprovar o controle | Média | Falha barata, antes das fases; variante do direcional (D-006) e revisão do design |
| O escopo crescer | Média | O MVP continua com 3 fases (D-009); o big picture tem marcos próprios (M4 e M5) e só começa depois da V1; ideia nova entra em "Depois" |

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 0.1 | 28/09/2026 | Primeira versão: MVP com 3 fases (D-009) e sem data-alvo (D-010) |
| 1.0 | 28/09/2026 | Aprovado pelo Fernando. Backlog criado no GitHub e ligado às tabelas. O requisito RNF-10 (tocar sem rolar nem dar zoom) passou do E-15 (M2) para o E-05 (M1), porque sem ele o teste do direcional no iPhone ficaria comprometido |
| 1.1 | 01/10/2026 | Tecnologia decidida: JavaScript puro com Canvas (D-011) |
| 1.2 | 01/10/2026 | Repositório e quadro públicos (D-012) e hospedagem no GitHub Pages (D-013): as decisões do M0 estão fechadas |
| 1.3 | 01/10/2026 | Fases geradas aleatoriamente (D-014) e menu com mapa de progresso (D-015): E-09 vira "Gerador de fases e níveis 1 a 3", E-12 vira "Níveis 4 e 5" e E-10 inclui o menu com mapa |
| 1.4 | 02/10/2026 | Big picture do Fernando: marcos M4 (lojas) e M5 (mundos e loja) em proposta, iniciativas I-07 e I-08 e épicos E-21 a E-25. Publicação nas lojas decidida (D-019) e mundos com 10 fases (D-020). O MVP continua com 3 fases |
| 1.5 | 02/10/2026 | M2 com cenários fixos (D-021) e os desafios PRACTICE e BONUS |
| 1.6 | 07/10/2026 | Seção 4: ranking justo antes de publicar nas lojas e degrau 1 do anticheat antes da próxima rodada de playtest (P-019 e P-023, documento 11) |
| 1.7 | 07/10/2026 | Épico E-26 · Abstração na I-01, que passa a cobrir também M2 e M3: 15 tarefas em cinco ondas, da mais barata à mais cara |
| 1.8 | 07/10/2026 | Seção 4: o degrau 1 do anticheat saiu das decisões da próxima rodada de playtest (D-036, não agora) |
