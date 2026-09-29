# Roadmap — Resgate Espacial

| Campo | Valor |
|---|---|
| Documento | 04 — Roadmap |
| Versão | 0.1 |
| Data | 28/09/2026 |
| Status | Rascunho, em revisão |
| Responsável | Fernando Nunes (Product Manager) |

O roadmap organiza **em que ordem** o produto vai ser construído. Não há data-alvo ([D-010](05-registro-de-decisoes.md#d-010--sem-data-alvo-planejamento-por-marcos)): o projeto avança por marcos, e cada marco só termina quando cumpre o seu critério de saída.

## 1. Visão geral

```mermaid
flowchart LR
    M0["M0 · Fundação"] --> M1["M1 · Protótipo de controle"] --> M2["M2 · MVP (3 fases)"] --> M3["M3 · V1"] --> D["Depois"]
```

| Marco | Objetivo | O que entra | Critério de saída |
|---|---|---|---|
| **M0 — Fundação** | Conseguir testar qualquer coisa no iPhone | Decisões de tecnologia, visibilidade do repositório e hospedagem; publicação automática | O endereço do jogo abre no iPhone, e cada envio ao GitHub atualiza o que está publicado |
| **M1 — Protótipo de controle** | Validar o maior risco: o controle é divertido no iPhone? | Física da nave, teclado, direcional virtual e um cenário de teste com uma plataforma | Pelo menos 4 de 5 testadores decolam, voam e pousam em poucos minutos e aprovam a sensação (meta proposta); parâmetros de ajuste calibrados |
| **M2 — MVP** | Lançar o ciclo completo do jogo e começar a medir | Fases 1 a 3 (D-009), requisitos MVP do PRD, pontuação, nome final e medição | Checklist de lançamento do PRD (seção 8) completo e jogo divulgado no portfólio |
| **M3 — V1** | Mais conteúdo e mais aparelhos, guiados pelos dados | Fases 4 e 5, Android e ajustes a partir das métricas | Fases 4 e 5 no ar, instalação testada num Android e metas da Visão revistas com dados reais |
| **Depois** | Guardar ideias sem compromisso | Ideias do documento 02, seção 15 | — |

**Se o M1 reprovar o controle, o projeto não avança para as fases.** Primeiro testa-se a variante do direcional (D-006); se ainda assim não ficar divertido, o design do controle é revisto. Falhar no protótipo é barato; falhar depois de construir as fases, não.

## 2. Iniciativas

| ID | Iniciativa | Objetivo da Visão que atende | Marcos |
|---|---|---|---|
| I-01 | Fundação técnica | Publicar o jogo (seção 6.3) | M0 |
| I-02 | Provar a diversão do controle | Princípio "o controle é o produto" e maior risco do produto (seção 10) | M1 |
| I-03 | Jogo completo: do voo ao resgate | North Star: resgates concluídos (seção 6.1) | M2 e M3 |
| I-04 | Instalável e confiável no celular | Acesso sem atrito e instalação (seção 6.2) | M2 e M3 |
| I-05 | Aprender com os jogadores | Métricas e hipóteses H1 a H3 (seções 3 e 6) | M2 e M3 |
| I-06 | Portfólio: contar a história | Mostrar o processo de produto (seção 6.3) | M2 |

## 3. Épicos

### I-01 — Fundação técnica (M0)

| ID | Épico | O que inclui | Referências |
|---|---|---|---|
| E-01 | Decisões técnicas de base | Escolher a tecnologia, a visibilidade do repositório e a hospedagem, e registrar como decisões | P-004, P-001, P-005 |
| E-02 | Esqueleto publicado | Estrutura do código e publicação automática por HTTPS a cada envio ao GitHub, abrindo no iPhone | RNF-07, RNF-08 |

### I-02 — Provar a diversão do controle (M1)

| ID | Épico | O que inclui | Referências |
|---|---|---|---|
| E-03 | Física da nave | Gravidade, propulsor, inércia e giro, com os parâmetros de ajuste num único lugar | Doc 02, seção 3.1; RNF-12 |
| E-04 | Controle por teclado | Setas para girar e tecla do propulsor | Doc 02, seção 4.1 |
| E-05 | Direcional virtual | Tocar aciona o propulsor, arrastar aponta a direção | Doc 02, seção 4.2; D-006 |
| E-06 | Teste com jogadores e calibragem | Roteiro de teste, 3 a 5 testes no iPhone, ajuste dos parâmetros e decisão sobre a variante do direcional | Doc 02, seção 13 |

### I-03 — Jogo completo: do voo ao resgate (M2 e M3)

| ID | Épico | O que inclui | Referências |
|---|---|---|---|
| E-07 | Voo, pouso e combustível | Plataformas, regras de pouso, colisões, consumo e abastecimento | Doc 02, seções 3, 5 e 7.2 |
| E-08 | Resgate, vidas e pontos de retorno | Embarque da tripulação, vidas, pontos de retorno, aviso de combustível baixo e fim de jogo | Doc 02, seções 6 e 7 |
| E-09 | Fases 1 a 3 | Desenho das três primeiras fases, câmera e liberação das fases em sequência | Doc 02, seção 10; D-009 |
| E-10 | Telas, interface e som | Abertura, seleção de fases, pausa, resultado, fim de jogo, "Sobre", indicadores da partida e efeitos sonoros, com os textos em inglês | RF-02 a RF-08, RF-12 a RF-14; RNF-11 |
| E-11 | Pontuação | Fechar o sistema de pontuação e mostrá-lo no resultado e na seleção de fases | P-006; doc 02, seção 8 |
| E-12 | Fases 4 e 5 (M3) | Túneis, passagens estreitas e o primeiro obstáculo móvel | Doc 02, seções 9 e 10 |

### I-04 — Instalável e confiável no celular (M2 e M3)

| ID | Épico | O que inclui | Referências |
|---|---|---|---|
| E-13 | App instalável no iPhone | Manifesto, ícone, abertura sem as barras do navegador e passo a passo de instalação | RF-10; PRD, seção 6 |
| E-14 | Sem internet e progresso salvo | Funcionamento sem conexão, progresso guardado no aparelho e pedido de armazenamento persistente | RF-09, RNF-03 |
| E-15 | Tela, toque e desempenho no iPhone | Aviso para girar, áreas seguras, toque sem efeitos do navegador, carregamento e fluidez | RF-11; RNF-01, RNF-02, RNF-04, RNF-09, RNF-10 |
| E-16 | Android (M3) | Testes em aparelho real e botão "Instalar" | RF-16, RNF-05; D-008 |

### I-05 — Aprender com os jogadores (M2 e M3)

| ID | Épico | O que inclui | Referências |
|---|---|---|---|
| E-17 | Medição anônima (M2) | Escolher a ferramenta e implementar os eventos, sem dados pessoais | P-008; PRD, seção 7; RF-15, RNF-06 |
| E-18 | Leitura dos dados e ajustes (M3) | Revisar as metas da Visão com dados reais e ajustar as fases onde os jogadores mais perdem vidas | Visão, seção 6.2 |

### I-06 — Portfólio: contar a história (M2)

| ID | Épico | O que inclui | Referências |
|---|---|---|---|
| E-19 | Identidade do jogo | Nome final, ícone e arte próprios | P-003; D-005 |
| E-20 | Estudo de caso | README contando a história do projeto, com decisões, métricas e aprendizados; abertura do repositório, se ainda for privado | P-001; Visão, seção 6.3 |

## 4. Decisões pendentes por marco

| Antes de | Decidir | ID |
|---|---|---|
| Começar o M0 | Tecnologia, visibilidade do repositório e hospedagem | P-004, P-001, P-005 |
| Construir as telas de resultado (M2) | Sistema de pontuação | P-006 |
| Construir a medição (M2) | Ferramenta de medição anônima | P-008 |
| Lançar o MVP (M2) | Nome final do jogo | P-003 |

A hospedagem deixou de ser um detalhe do fim do projeto: para testar o controle no iPhone (M1), o protótipo precisa estar publicado num endereço. Por isso as pendências P-001 e P-005 subiram para o M0.

## 5. Como o roadmap vira backlog

- Cada iniciativa e cada épico vira uma issue no GitHub. Os épicos ficam como sub-issues das iniciativas, e as histórias, como sub-issues dos épicos.
- Os marcos viram *milestones* do GitHub.
- **Histórias só para os próximos marcos.** Agora são escritas as histórias do M0 e do M1. As dos marcos seguintes são escritas quando eles se aproximarem, já com o que o protótipo ensinar. Escrever tudo agora seria detalhar suposições que o M1 ainda pode mudar.
- Ao fim de cada marco, uma retrospectiva curta: o que funcionou, o que não funcionou e o que foi aprendido construindo com IA.

## 6. Riscos do plano

| Risco | Severidade | Mitigação |
|---|---|---|
| Sem prazo, o projeto se arrastar ou parar no meio | Média | Marcos pequenos, cada um com uma entrega que dá para mostrar; o protótipo do M1 já é jogável |
| O protótipo reprovar o controle | Média | Falha barata, antes das fases; variante do direcional (D-006) e revisão do design |
| O escopo crescer | Média | Fases 4 e 5 e as ideias já estão fora do MVP; ideia nova entra em "Depois" |

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 0.1 | 28/09/2026 | Primeira versão: MVP com 3 fases (D-009) e sem data-alvo (D-010) |
