# Modelo de Negócio (Lean Canvas) — Resgate Espacial

| Campo | Valor |
|---|---|
| Documento | 13 — Modelo de negócio (Lean Canvas) |
| Versão | 0.1 |
| Data | 07/10/2026 |
| Status | Em revisão (P1 a P4 fechados; parou no C1) |
| Responsável | Fernando Nunes (Product Manager) |

Em 07/10/2026, o Fernando pediu para revisar as decisões do projeto "by the book", com as matrizes da disciplina de produto: o **Lean Canvas** (Ash Maurya, *Running Lean*) e os seus três riscos, **produto, cliente e mercado**. Este documento guarda a revisão, bloco a bloco, e o que cada bloco decidiu.

O **Business Model Canvas** (Osterwalder) descreve um negócio que já existe: parceiros, atividades, recursos e relacionamento. Ele fica para o M4, quando Apple, Google, a rede de anúncios e o Firebase forem parceiros de verdade.

## 1. Como ler

### 1.1 A ordem da revisão

O Lean Canvas é revisado na ordem dos riscos, como no diagrama do *Running Lean*:

| Risco | Pergunta | Blocos, na ordem |
|---|---|---|
| **Produto** | Estou construindo a coisa certa? | P1 Problema → P2 Solução → P3 Proposta de valor → P4 Métricas-chave |
| **Cliente** | Tenho um caminho até quem vai jogar? | C1 Segmentos → C2 Early adopters → C3 e C4 Canais |
| **Mercado** | Isso se sustenta como negócio? | M1 Alternativas existentes → M2 e M3 Receita → M4 Custos |

A **vantagem injusta** fica fora da sequência; pode ficar vazia no começo.

### 1.2 Status de cada item

- **Definido:** fechado na revisão com o Fernando.
- **Proposta:** sugestão do Claude, esperando decisão.
- **Em aberto:** pergunta sem resposta.

As decisões desta revisão só viram D-xxx no fim (seção 7), todas juntas.

### 1.3 Um canvas por segmento

Este é o canvas do **jogador**. O avaliador de portfólio é outro segmento, com outro problema e outro canal; ganha um canvas curto no fim da revisão (Proposta, em aberto).

## 2. Andamento da revisão

| Bloco | Status | Data |
|---|---|---|
| P1 Problema | Definido | 07/10/2026 |
| P2 Solução | Definido | 07/10/2026 |
| P3 Proposta de valor | Definido | 07/10/2026 |
| P4 Métricas-chave | Definido | 07/10/2026 |
| C1 Segmentos | **Em aberto: 4 perguntas (seção 4.1)** | — |
| C2 Early adopters | A revisar | — |
| C3 e C4 Canais | A revisar | — |
| M1 Alternativas existentes | A revisar | — |
| M2 e M3 Receita | A revisar (os anúncios já foram decididos na revisão do P1) | — |
| M4 Custos | A revisar | — |
| Vantagem injusta | A revisar | — |
| Canvas do avaliador de portfólio | A revisar | — |

**Diagnóstico de partida (07/10/2026):** antes da revisão, só a solução tinha evidência, e só de 6 amigos. Canais e early adopters estavam vazios, a receita estava em aberto (P-014), e o épico da abstração das naves (E-26) já construía em cima de uma loja de itens que ninguém tinha decidido. O projeto tinha atacado sobretudo a viabilidade técnica ("conseguimos construir?"), o risco que já estava mais baixo.

## 3. Risco de produto

### 3.1 P1 Problema (Definido)

Nenhum documento do projeto tinha uma seção de problema: o projeto foi direto para a solução. Os problemas abaixo são do segmento definido pelo Fernando em 07/10: **adolescentes e jovens com muito tempo de tela que gostam de jogos casuais** (detalhes na seção 4.1).

| # | Problema, como o jogador falaria | Papel | Evidência |
|---|---|---|---|
| 1 | "Quero passar fases difíceis e criativas e sentir que fiquei bom nisso" | O centro: a diversão de passar a fase. A dificuldade é o diferencial | Playtest 1: 5 de 6 concluíram o primeiro resgate; o nível 3 pediu de 3 a 6 tentativas a todos |
| 2 | "Tenho muito tempo de tela e quero algo que me desafie, não só rolar o feed" | O momento de jogo | Hipótese |
| 3 | "Quero bater o tempo dos outros" | Amplificador: tira mais jogo de quem já gosta, mas não é o centro | Playtest 1: 120 de 128 recomeços logo depois de uma morte (mediana de 0,9 s); ranking aberto 33 vezes. Inflado pelo contexto de amigos |

**O que saiu do problema:**
- **Anúncios:** "os casuais estão cheios de anúncio" era uma característica da nossa solução disfarçada de problema. Os anúncios viraram modelo de receita (seção 5.2).
- **Saudade dos jogos de PC dos anos 2000:** é o único problema com evidência de desconhecidos (comentários no MyAbandonware sobre o Crazy Gravity), mas o fã retrô deixou de ser alvo. O Fernando: ele é um "acerto por consequência".
- **"Fila":** o playtest aconteceu à noite (19h30 às 0h10), mais sofá do que fila. O problema 2 fala de tempo de tela livre, sem amarrar a um lugar.

**Duração da fase (Definido):** sem meta fixa. O Fernando: "a fase levará o tempo que criarmos para levar. Nem que tenhamos que desenvolver checkpoints. Vamos testar esses modelos." Fases maiores, inspiradas no Crazy Gravity, estão no plano. Isso revisa o princípio 3 da Visão ("partidas curtas").

### 3.2 P2 Solução (Definido)

Nas palavras do Fernando: "um jogo de nave, com gravidade, que desafia o jogador na medida certa para a diversão. Que apresenta fases criativas e estimulantes. Que apresenta uma dificuldade divertida de se aprender e ficar bom."

| Problema | Solução | O que foi testado |
|---|---|---|
| 1. Passar fases difíceis e criativas | Fases desenhadas à mão, iguais para todos (D-021), com dificuldade em serrote e obstáculos que ensinam, organizadas em mundos (D-020). Fases maiores, com checkpoints a testar | Só os níveis 1 a 3, que são pequenos. A fase grande, a aposta principal, não existe ainda |
| 2. Tempo de tela livre | Do toque ao voo em segundos: sem cadastro, carregamento de cerca de 1 s e continuar de onde parou. A BONUS sorteada para quando o jogador quer variar | Carregamento: 1,1 s no iPhone, 1,4 s no Android |
| 3. Bater o tempo dos outros | Ranking por fase, com cenário igual para todos e proteção contra trapaça antes do lançamento (D-036) | Ranking, só com amigos. A proteção não foi construída |

- **Próximo teste do bloco (Definido):** um protótipo de fase grande, jogado com e sem checkpoint, no próximo playtest.
- **Em aberto, para quando a fase grande for desenhada:** como checkpoint e ranking convivem (por exemplo, só vale a corrida sem morte, ou o tempo continua correndo depois do checkpoint). Passar antes pelos estudos (D-033); o benchmark do Geometry Dash ([#127](https://github.com/TARNAGS/resgate-espacial/issues/127)) traz como ele separa o treino com checkpoints da conclusão que vale.
- **Fora do P2 (Definido):** as naves e os cosméticos do épico E-26, o modo Nightmare e a loja de itens não respondem a nenhum dos três problemas. São apostas de receita ou de retenção, discutidas no M2. A estética e o som retrô ficam na proposta de valor e na identidade visual.

### 3.3 P3 Proposta de valor (Definido)

A proposta anterior ("Abra o jogo e, em segundos, você está pilotando: partidas curtas [...] com o charme dos jogos de PC dos anos 2000. Sem cadastro e sem anúncios.") caiu: "partidas curtas" e "sem anúncios" mudaram, e "anos 2000" fala com o fã retrô, não com o adolescente. O Fernando escolheu misturar dois caminhos: o domínio (A) e o humor (C).

| Onde | Texto | Status |
|---|---|---|
| Proposta de valor | "Fácil de pegar, difícil de dominar. A gravidade sempre vence… até você ficar bom." | Definido |
| Subtítulo na loja (até 30 caracteres) | *Easy to fly. Hard to master.* (28 caracteres) | Proposta (padrão). Alternativa: *Easy to fly. Hard to land.* (26), fiel ao playtest, em que pousar foi a maior dificuldade |
| Gancho dos vídeos e do jogo | *Gravity always wins. Until you get good.* | Definido |
| Conceito em uma linha | "Geometry Dash, só que pilotando uma nave contra a gravidade" | Proposta, a confirmar com o benchmark ([#127](https://github.com/TARNAGS/resgate-espacial/issues/127)) |

- **Diferença que a proposta precisa carregar:** os casuais que esse público joga (Subway Surfers, Temple Run, Jetpack Joyride) são de correr e desviar. No nosso, você pilota.
- **Condição:** "fácil de pegar" é uma promessa, e quem a cumpre são a DEMO (D-031) e o nível 1. No playtest, aprender o propulsor foi a maior barreira (D-027). Por isso a ativação é métrica-chave (seção 3.4).
- **Como testar:** mostrar as versões a pessoas do segmento e ver qual elas repetem com as próprias palavras; nas lojas, os experimentos de página da Apple e do Google.

### 3.4 P4 Métricas-chave (Definido)

**North Star (Definido):** **jogadores que concluem pelo menos uma fase nova na semana.** Junta o problema 1 (passar fases) com a retenção (voltar na semana). Não sobe quando alguém repete a mesma fase e não cai quando as fases ficam maiores. Substitui "resgates concluídos", que sobe com um único jogador repetindo a mesma fase e cairia com as fases maiores.

**Funil (Definido):**

| Etapa | Métrica | O que testa | Hoje |
|---|---|---|---|
| Aquisição | Jogadores novos por canal | O bloco de canais (C3) | Todos vieram do grupo de amigos |
| Ativação | % que conclui a primeira fase na primeira sessão | A promessa "fácil de pegar" | 5 de 6 |
| Retenção | % que volta no dia seguinte (D1) e uma semana depois (D7) | Se o jogo entrega valor e se o anúncio terá audiência | Os amigos pararam no domingo (D7 = 0), mas com 3 fases o conteúdo acabou: número não é justo |
| Receita | % que aceita o anúncio recompensado | O M2, sem forçar ninguém | Não existe |
| Indicação | Jogadores que chegaram por convite ou compartilhamento | Se o problema 3 puxa gente nova | Não existe |

**Limites de proteção (Definido)**, que não podem piorar:
- tempo até controlar a nave;
- jogadores que saem do jogo logo depois de um anúncio (mede a regra do anúncio respeitoso);
- 60 quadros por segundo nos aparelhos testados.

**Saem (Definido):** "3 ou mais partidas na primeira sessão" (com recomeço em 0,9 s, deu 100% sem dizer nada) e "sessões pelo app instalado" (media o PWA, e o jogo vai para as lojas).

**Metas com número (Definido):** só depois da primeira rodada com desconhecidos, que dá a linha de base.

## 4. Risco de cliente

### 4.1 C1 Segmentos (Em aberto)

**Definido pelo Fernando (07/10):** o alvo são **adolescentes e jovens com muito tempo de tela que gostam de jogos casuais**. O fã retrô dos anos 2000 é um acerto por consequência. Isso revisa a D-028.

Com anúncios, o jogador usa e o anunciante paga, pela rede de anúncios. Como não vamos vender anúncio direto, a rede entra como parceira, e o segmento do canvas é o jogador.

**Três perguntas para o segmento ser encontrável:**

| Pergunta | Por que importa | Opções |
|---|---|---|
| Idade | Menores de 18 no Brasil estão sob o ECA Digital (seção 5.2). Menores de 13 trazem regras mais duras nas lojas e nos EUA (COPPA; programa Famílias do Google Play) | A) 13 a 17 no centro; B) 16 a 24 no centro (menos regulado, anúncio paga mais); C) 13 a 24, sem menores de 13 |
| Onde | Define o canal, o idioma das lojas e dos vídeos e a plataforma | Brasil primeiro; global em inglês; Brasil primeiro e global depois |
| Aparelho | No Brasil, cerca de 3 em cada 4 celulares são Android (StatCounter, 2026: de 75% a 79%). Nos EUA, 87% dos adolescentes têm iPhone (Piper Sandler, outubro de 2025) | Se Brasil, o Android sai junto com o iPhone (revisa a D-008); se EUA, "iPhone primeiro" se mantém |

**Recomendação do Claude (Proposta):** idade C, com o centro descoberto nos testes; Brasil primeiro, porque é onde o Fernando alcança adolescentes de verdade, pela rede dele e por vídeos em português; Android junto com o iPhone no lançamento (a conta do Google custa US$ 25, uma vez). O jogo continua em inglês (D-007), mas a página da loja, os vídeos e a voz bem-humorada teriam de estar em português.

**Alerta:** toda a evidência de P1 a P4 veio de 6 amigos adultos, da idade do Fernando. Para o segmento novo, tudo vale como hipótese. A próxima rodada precisa de jogadores do segmento, e, com menores: autorização dos pais, nickname sem nome real e revisitar o que a D-029 grava no perfil ligado ao nick (o mínimo, e nunca para anúncio).

**ICP revisado (Proposta para a D-028):**

> O adolescente ou jovem com muito tempo de tela, que joga casuais no celular e gosta de desafio: quer passar fases difíceis e criativas, ficar bom nisso e, de vez em quando, bater o tempo dos outros. O fã retrô dos anos 2000 é um acerto por consequência.

**Perguntas em aberto para fechar o C1 (a revisão recomeça aqui):**
1. Qual faixa etária: A, B ou C?
2. Brasil primeiro ou global?
3. Se Brasil: o Android sai junto com o iPhone, revisando a D-008?
4. O canvas do avaliador de portfólio fica separado e curto, para o fim da revisão?

### 4.2 C2 Early adopters (a revisar)

Estado antes da revisão: vazio. Os 6 amigos não contam como early adopters. O candidato anterior, o fã retrô de 30 a 40 anos, deixou de ser alvo (seção 3.1).

### 4.3 C3 e C4 Canais (a revisar)

Estado antes da revisão: vazio. Hoje, o grupo de amigos; 0 de 23 sessões pelo app instalado. Ideias não testadas: loja (busca), vídeo curto, comunidades. É o bloco que decide o modelo com anúncios, porque o anúncio depende de volume.

## 5. Risco de mercado

### 5.1 M1 Alternativas existentes (a revisar)

Estado antes da revisão: os casuais de referência são todos grátis, e o concorrente real do tempo livre é o feed das redes sociais.

### 5.2 M2 e M3 Receita (a revisar; anúncios decididos)

**Decidido na revisão do P1 (07/10):**

| Item | Status |
|---|---|
| **Modelo com anúncios**, "sem ser tóxico ou excessivo", "na medida do necessário para sustentar o jogo". O Fernando: "não teremos muito para onde correr" | Definido. Revisa a D-003 (sem anúncios), o princípio 5 da Visão e a proposta de valor |
| **Regra do anúncio respeitoso:** todo anúncio se fecha com facilidade. Esperar um tempo antes de poder fechar é aceitável, mas o botão de fechar precisa ser fácil de alcançar e visível | Definido. Quem desenha o botão é a rede de anúncios; a regra vira critério para escolher a rede e o formato, com limite de frequência e teste num aparelho real |
| **Anúncio para ganhar vidas ao abrir o jogo** (ideia do Fernando) | Definido como ideia. Se é sempre uma oferta opcional (anúncio recompensado) ou não: em aberto. No playtest, quem disputa tempo recomeça na primeira morte; quem quer passar a fase (o jogador travado no nível 1 teve 30 dos 54 fins de jogo) é quem aceitaria |
| **Anúncio como obstáculo** ("o anúncio vai te matar") | Excluído pelo Fernando: anunciantes raramente aceitam que a marca mate o jogador, e não se controla o que aparece no espaço |

**Restrições do ECA Digital** (Lei 15.211/2025, em vigor desde 17/03/2026), segundo as fontes consultadas, sem análise jurídica:
- proíbe usar perfil de comportamento de menores para direcionar publicidade: para esse público, só anúncio não personalizado, que costuma pagar menos;
- proíbe caixas de recompensa (loot boxes) em jogos que menores provavelmente acessam: a loja de itens (P-017) só pode vender itens escolhidos, nada sorteado;
- os decretos citam como design manipulativo as notificações com urgência fabricada e as recompensas imprevisíveis;
- fiscalização da ANPD, com multas de até R$ 50 milhões. Antes do lançamento, ler o texto oficial.

**Em aberto para a revisão do M2:** cobrar pelo jogo ou não (P-014); loja de itens (P-017), que o épico E-26 já pressupõe; o modelo do Geometry Dash (Lite grátis com anúncios e versão completa paga) como referência ([#127](https://github.com/TARNAGS/resgate-espacial/issues/127)); o Crazy Gravity era shareware (3 fases grátis, versão completa paga), e o MVP também tem 3 fases (D-009); anúncio não personalizado para todos (Proposta: mais simples e alinhado com "não tóxico").

### 5.3 M4 Custos (a revisar)

Estado antes da revisão: conta de desenvolvedor da Apple (US$ 99 por ano) e do Google (US$ 25, uma vez); taxa das lojas de 15% para pequenos desenvolvedores; Firebase (grátis até escalar); CNPJ (P-015); as horas do Fernando. Sem conta de ponto de equilíbrio. Exemplo, no modelo pago: a US$ 1,99 por venda, tirando 15%, sobram cerca de US$ 1,69, e são precisas umas 59 vendas por ano só para pagar a conta da Apple.

## 6. Vantagem injusta (a revisar)

Estado antes da revisão: nenhuma, e tudo bem nesta fase.

## 7. Decisões a registrar no fim da revisão

| O que muda | Revisa | Status |
|---|---|---|
| Anúncios entram no modelo, sem ser tóxicos nem excessivos | D-003, princípio 5 e proposta de valor da Visão | Definido |
| Regra do anúncio respeitoso (fechar fácil, botão visível) | Novo | Definido |
| Anúncio como obstáculo, descartado | Novo | Definido |
| Segmento-alvo: adolescentes e jovens com muito tempo de tela; fã retrô como acerto por consequência | D-028 | Definido em parte (faltam as perguntas da seção 4.1) |
| Duração da fase sem meta fixa; fases maiores, com checkpoints a testar | Princípio 3 da Visão | Definido |
| Proposta de valor nova | Visão, seção 5 | Definido |
| North Star nova, funil com D1 e D7, limites de proteção e metas depois da linha de base | Visão, seção 6 | Definido |
| Protótipo de fase grande com e sem checkpoint no próximo playtest | Novo | Definido |
| E-26, Nightmare e loja tratados como apostas de receita (M2), fora da solução | Novo | Definido |
| A H1 ("sem instalar nada pela loja") contradiz a D-019 | Visão, seção 3 | A reescrever |
| Android junto com o iPhone | D-008 | Depende do C1 |

## 8. Próximo passo

Retomar no **C1** (as 4 perguntas da seção 4.1). Depois: C2, C3 e C4, M1, M2 e M3, M4, vantagem injusta e o canvas do avaliador de portfólio. No fim, registrar as decisões da seção 7 e atualizar a Visão.

## 9. Fontes

- Ash Maurya, *Running Lean* (Lean Canvas e os riscos de produto, cliente e mercado); Alexander Osterwalder, *Business Model Generation* (Business Model Canvas).
- ECA Digital: [Demarest, entrada em vigor em 17/03/2026](https://www.demarest.com.br/eca-digital-entrada-em-vigor-em-17-de-marco-de-2026/); [Mayer Brown, obrigações para empresas](https://www.mayerbrown.com/pt/insights/publications/2026/04/enforcement-of-brazils-eca-digital-introduces-new-obligations-for-companies); [Agência Gov, as regras de proteção](https://agenciagov.ebc.com.br/noticias/202608/eca-digital-conheca-as-regras-de-protecao-de-criancas-e-adolescentes-no-ambiente-online); [Canaltech, a lei e os jogos](https://canaltech.com.br/games/lei-felca-estreia-causando-alvoroco-e-ja-mexe-com-lol-fortnite-e-gta/).
- Plataformas: [StatCounter, sistemas de celular no Brasil](https://gs.statcounter.com/os-market-share/mobile-tablet/brazil); [Piper Sandler via Apple World Today, 87% dos adolescentes dos EUA com iPhone](https://appleworld.today/2025/10/survey-eighty-seven-percent-of-teens-report-they-own-an-iphone/).
- Evidências do projeto: [documento 09](09-resultados-dos-playtests.md) (playtest 1), [benchmark do Crazy Gravity](benchmark/crazy-gravity.md) (distribuição shareware e recepção), [registro de decisões](05-registro-de-decisoes.md).

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 0.1 | 07/10/2026 | Revisão iniciada com o Fernando: P1 a P4 fechados (problema, solução, proposta de valor e métricas); anúncios decididos; C1 em aberto, com 4 perguntas |
