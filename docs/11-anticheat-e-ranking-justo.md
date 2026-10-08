# Anticheat e Ranking Justo — Resgate Espacial

| Campo | Valor |
|---|---|
| Documento | 11 — Anticheat e ranking justo |
| Versão | 0.3 |
| Data | 07/10/2026 |
| Status | Degrau 1 recusado para os playtests (D-036); o resto fica para antes do lançamento |
| Responsável | Fernando Nunes (Product Manager) |
| Cartão | [#109](https://github.com/TARNAGS/resgate-espacial/issues/109) |

Pergunta do Fernando em 07/10/2026: se o jogo for lançado online e com ranking, pessoas podem usar trapaça para bater os recordes. Como funcionam os anticheats para jogos como o nosso?

Este documento junta a pesquisa (com fontes no fim), olha o nosso ranking de hoje e propõe um caminho em degraus. **Nada aqui é decisão**: tudo é **Proposta**, e o Fernando decide. Continua a P-019 e a história do ranking justo ([#101](https://github.com/TARNAGS/resgate-espacial/issues/101)).

**Onde mais está registrado:** pendência P-023 no [registro de decisões](05-registro-de-decisoes.md) (com a P-019 atualizada); risco na seção 9 do [PRD](03-prd.md); pendências por marco no [Roadmap](04-roadmap.md), seção 4; o fantasma nas [Regras do jogo](02-regras-do-jogo.md), seção 15; cartões [#109](https://github.com/TARNAGS/resgate-espacial/issues/109) (esta pesquisa), [#101](https://github.com/TARNAGS/resgate-espacial/issues/101) (ranking justo no lançamento) e [#98](https://github.com/TARNAGS/resgate-espacial/issues/98) (lojas e dinheiro).

## 1. Resumo em um minuto

- **A regra de ouro de todo anticheat: nunca confiar no que o aparelho do jogador diz.** Hoje o nosso jogo diz ao banco "fiz em 23,4 s", e o banco acredita, desde que o número seja razoável.
- Para um jogo como o nosso (um jogador, contra o relógio, fase fixa), o anticheat **não é um programa no celular** do jogador. É **conferir a corrida no servidor**: o jogo manda os comandos que o jogador fez (o *replay*), o servidor joga a fase de novo com esses comandos e confere se chega ao mesmo tempo. É o que fazem jogos como o Open Hexagon.
- **Estamos em ótima posição para isso:** a física já anda em passos fixos de 1/120 s, as fases do ranking têm semente fixa (D-021) e o piloto automático já joga as fases inteiras nos testes, sem tela. Falta deixar a matemática idêntica em todos os aparelhos (seção 6.3).
- **Nenhuma camada pega tudo.** Um robô ou um jogo em câmera lenta produzem corridas "verdadeiras". Por isso todo mundo combina camadas: replay, limites do possível, identidade e **olho humano no topo do ranking**.
- **Recomendação:** três degraus. Um barato já para os playtests (piso de tempo e dono do nick), a conferência por replay antes do lançamento e, no lançamento, identidade da loja e revisão do top 10 (seção 8).

## 2. O problema em linguagem simples

Um ranking online é uma lista num servidor. Para entrar nela, o jogo do jogador manda uma mensagem: "o jogador TARNAG fez a fase 1 em 23,4 s". Quem quer trapacear tem três caminhos:

| Caminho | Como | Exemplo no nosso jogo |
|---|---|---|
| **Mentir o resultado** | Mandar ao servidor um tempo que não aconteceu, sem nem jogar | Enviar "fase 1 em 5 s" direto para o banco |
| **Mudar o jogo** | Jogar de verdade, mas com o jogo alterado: gravidade menor, nave mais rápida, câmera lenta | Gravidade mais fraca; jogo rodando devagar para ter mais tempo de reagir |
| **Deixar um robô jogar** | Um programa joga por você, com precisão que nenhum humano tem | O nosso próprio piloto automático já faz isso |

Há um quarto problema, que não é trapaça no jogo mas estraga o ranking: **usar o nome de outra pessoa**.

Cada camada de anticheat fecha um ou mais desses caminhos. Nenhuma fecha todos.

## 3. Os tipos de anticheat

| Tipo | Como funciona | Quem usa | Serve para nós? |
|---|---|---|---|
| **Anticheat no aparelho, no núcleo do sistema** (kernel) | Um programa com acesso total ao computador procura trapaças na memória e nos arquivos | Valorant (Vanguard), Fortnite (Easy Anti-Cheat): tiro competitivo no PC | **Não.** É invasivo, caro e impossível num navegador ou num iPhone |
| **Proteção do app no celular** | Detecta root ou jailbreak, esconde o código, protege a memória contra editores como o GameGuardian | Jogos grandes de celular, com ferramentas pagas (Guardsquare, Talsec) | **Agora não.** Sobe o custo da trapaça, mas nunca é definitivo |
| **Servidor que roda o jogo** (autoritativo) | O jogo inteiro acontece no servidor; o aparelho só manda comandos e desenha | Jogos multijogador em tempo real | **Não.** Somos um jogo de um jogador; seria caro e deixaria o controle atrasado |
| **Conferência da corrida por replay** | O aparelho joga normalmente e, no fim, manda os comandos; o servidor refaz a corrida e confere | Open Hexagon, AntGame, jogos de corrida contra o relógio | **Sim. É o centro da proposta** |
| **Limites do possível** | O servidor recusa resultados impossíveis (tempo menor que o mínimo, pontuação acima do máximo) | Game Center (faixa de pontuação), Google Play Games | **Sim.** Barato; pega a mentira grosseira |
| **Identidade** | Só uma conta de verdade grava no ranking; o pedido precisa vir do app oficial | Game Center, Google Play Games, Firebase Auth e App Check | **Sim.** Protege o nick e dificulta scripts |
| **Olho humano e estatística** | Moderadores e análises olham o topo do ranking e o que parece estranho | speedrun.com, Trackmania, a ferramenta da Apple para o top 100 | **Sim**, no topo do ranking, onde a trapaça se concentra |

O ponto em comum das fontes: **o servidor decide, nunca o aparelho**. A verificação feita dentro do jogo pode ser pulada por quem alterou o jogo.

## 4. Como outros jogos fazem

### 4.1 Open Hexagon: replay, semente e relógio do servidor

O caso mais parecido com o nosso: jogo de reflexo, um jogador, ranking online, obstáculos gerados por semente. Segundo o relato do criador (Vittorio Romeo) na GIGAZINE:

- No fim da partida, o jogo não manda a pontuação: manda um **replay** com os comandos do jogador, a semente dos obstáculos, a fase e o nome. O arquivo é pequeno porque guarda só o que é preciso para refazer a partida.
- O **servidor roda o replay** e confere o resultado. Mudou o padrão dos obstáculos ou a velocidade do jogo? O servidor recusa.
- O jogo avisa o servidor no **começo** e no **fim** da partida, e o servidor mede a duração **com o relógio dele**. Isso pega quem deixa o jogo mais lento para jogar melhor.
- Uma brecha apareceu: ajustes "só visuais" (giro e cores do fundo) não mudavam o replay e davam vantagem. A correção foi fazer esses ajustes entrarem na semente.
- Quem foi pego teve a conta da Steam banida do ranking para sempre.
- O próprio criador diz que a proteção não é perfeita: forjar um replay à mão continua possível, só muito mais difícil.

### 4.2 Trackmania: câmera lenta com replays "verdadeiros"

O Trackmania é o maior jogo de corrida contra o relógio com ranking. Duas lições:

- **O caso Riolu (2021).** Investigadores da comunidade (o youtuber Wirtual e o programador donadigo) mostraram que jogadores do topo usavam **câmera lenta**: o jogo rodava devagar, a pessoa tinha mais tempo para reagir, e o replay saía perfeito, porque os comandos eram reais. A prova veio da **análise dos comandos**: o volante mudava rápido demais para um humano em tempo normal. O jogador principal tinha recordes trapaceados ao longo de mais de uma década e foi banido.
- **Falso positivo.** Uma varredura automática da Nadeo (a empresa do jogo) apagou recordes legítimos, incluindo um recorde mundial. A equipe pediu replays e vídeos aos jogadores e disse que talvez não conseguisse devolver os tempos.

Para nós: **replay válido não quer dizer jogada humana**, e **apagar automaticamente é perigoso**. Melhor esconder, revisar e guardar o replay como defesa.

### 4.3 Game Center e Google Play Games: identidade sim, conferência não

- No **Game Center**, quem manda a pontuação é o próprio jogo, no aparelho. A Apple oferece uma **faixa de pontuação** (mínimo e máximo) por ranking, conferida no servidor dela, e uma tela no App Store Connect para ver o **top 100**, apagar pontuações falsas, **bloquear jogadores** e restaurar o que foi removido nos últimos 30 dias. Isso nasceu em 2013, quando os rankings de muitos jogos de iPhone estavam tomados por pontuações falsas.
- No **Google Play Games**, o anúncio de 2014 criou a **proteção contra adulteração**, que esconde sozinha as pontuações suspeitas. O Google não diz como decide o que é suspeito, e não achei documentação atual confirmando que funciona igual hoje.
- **O que eles resolvem:** o nome. A conta da loja é a identidade, sem login nosso (D-001). **O que não resolvem:** o tempo. Não refazem a corrida; só recusam o absurdo e deixam a limpeza manual com o desenvolvedor.

Isso ajusta a recomendação 4 do benchmark dos Gravitron ([#106](https://github.com/TARNAGS/resgate-espacial/issues/106)), que apontava os rankings das lojas para o lançamento: eles cuidam bem do nome, mas o tempo continua precisando de conferência nossa.

### 4.4 speedrun.com: prova em vídeo e moderadores

- Cada jogo tem moderadores voluntários que assistem aos vídeos das corridas antes de elas entrarem no ranking. A espera costuma ser de uma a duas semanas.
- Muitos rankings só exigem vídeo **abaixo de um tempo**: corridas comuns entram com menos exigência, as do topo precisam de prova. Uma corrida aprovada ainda pode ser removida depois.

Para nós: o esforço de conferência pode ser **proporcional à posição no ranking**. Só o topo precisa de olho humano.

### 4.5 Jogos de navegador: o erro mais comum

Os relatos se repetem: o jogo valida tudo no navegador e manda o resultado; alguém abre as ferramentas do navegador, copia o pedido de envio, troca o número e manda de novo. Foi o que aconteceu com o jogo de navegador "Center This Div". **Qualquer coisa que roda no navegador pode ser lida e alterada pelo jogador.**

## 5. O nosso jogo hoje

### 5.1 O que já temos de bom

- As **regras do banco** (Firebase) só aceitam o formato certo, um tempo entre 0 e 3.600 s, um nick válido e só um tempo **melhor** que o anterior. Ninguém consegue **apagar** nada.
- A **chave de cada ranking** muda sozinha quando a fase ou a física mudam (`jogo/src/core/ranking.js`): tempos de versões diferentes não se misturam.
- Com o **painel de ajuste** mexido, o tempo não vai para o ranking.
- **Física em passo fixo** de 1/120 s (`jogo/src/main.js`, laço principal), **semente fixa** nas fases do ranking (D-021) e o **piloto automático**, que joga as fases sem tela nos testes. São justamente os ingredientes da conferência por replay.

### 5.2 As portas abertas

Pela leitura do código (nada disso foi testado no banco de verdade). Está escrito sem passo a passo de propósito: o repositório fica público durante as janelas de teste (D-017).

| Porta | O que permite | Esforço para quem trapaceia |
|---|---|---|
| **O banco aceita qualquer tempo razoável** | Gravar um tempo que não aconteceu, sem jogar. O endereço do banco precisa estar no jogo, então é público | Minutos, para quem conhece o básico de programação |
| **O nick não tem dono** | Gravar um tempo com o nick de outra pessoa (desde que seja melhor que o dela) | O mesmo |
| **O jogo fica aberto no console do navegador** | O objeto `window.__game` dá acesso ao envio do ranking e aos parâmetros da física | Minutos, para quem sabe abrir as ferramentas do navegador |
| **Câmera lenta "de graça"** | O laço limita cada quadro a 0,1 s de física. Se o aparelho for forçado a rodar a menos de 10 quadros por segundo, o jogo anda mais devagar que o relógio, mas o cronômetro conta só o tempo do jogo. É o mesmo truque do caso Riolu | Baixo, num computador |
| **Telemetria e perfil sem conferência** | Mandar eventos falsos ou progresso falso | Baixo. Não muda o ranking, mas suja a análise dos playtests |

**Conclusão:** para 6 amigos testando, está bom, e é o risco que a D-024 aceitou. **Para o lançamento, não está pronto.** Isso já estava previsto na própria D-024 e na #101; agora temos o mapa do que falta.

## 6. A técnica que mais combina conosco: conferir a corrida pelo replay

### 6.1 Como funciona

```
 APARELHO DO JOGADOR                           SERVIDOR
 ───────────────────                           ────────
 1. Começa a fase  ─── "vou jogar a w1-1" ──▶  anota a hora (relógio dele)
                   ◀── bilhete da corrida ───
 2. Joga. A cada passo de física (1/120 s),
    anota o comando: direção e propulsor
 3. Termina ─── bilhete + comandos + tempo ──▶ 4. Roda a mesma física, sem tela,
                                                  com os mesmos comandos
                                               5. Confere: terminou a fase?
                                                  Deu o mesmo tempo?
                                                  A duração real bate?
                   ◀──── entrou / recusado ─── 6. Só o que passou entra no ranking
```

O replay é pequeno: os comandos mudam pouco de um passo para o outro, então basta guardar **só as mudanças**. Estimativa: poucos KB por corrida.

### 6.2 Por que é a mais indicada para nós

- Fecha a **mentira do resultado**: sem comandos que levem àquele tempo, não entra.
- Fecha o **jogo alterado**: o servidor usa a física oficial, então gravidade mais fraca no aparelho produz uma corrida que, no servidor, bate na parede.
- Não mexe no aparelho do jogador, não pede permissão nenhuma e funciona igual no navegador, no iPhone e no Android.
- **O mesmo replay vira produto:** é a base do **"fantasma"** do melhor tempo (já está nas "ideias para depois" das [Regras do jogo](02-regras-do-jogo.md), seção 15): correr contra o próprio recorde ou contra o primeiro do ranking, como no Trackmania. Também permite assistir à corrida do recordista. Antes de construir, o fantasma passaria pelos estudos (D-033).

### 6.3 O que precisa mudar no jogo antes

1. **Matemática idêntica em todos os aparelhos.** Soma, subtração, multiplicação, divisão e raiz quadrada dão o mesmo resultado em qualquer navegador. Já **seno, cosseno, `atan2` e `hypot` podem diferir no último dígito** entre o Safari do iPhone e o Chrome ou o Node, porque a especificação do JavaScript deixa a precisão a cargo de cada navegador. Numa corrida de milhares de passos, a diferença cresce, e o servidor chegaria a outro resultado. Hoje a física da nave usa seno e cosseno a cada passo (`jogo/src/core/ship.js`), e o gerador de terreno usa seno (`jogo/src/core/generator.js`). **Solução:** funções próprias, feitas só com as operações exatas, e um teste que roda a mesma corrida no Node e no Safari e compara o resultado.
2. **Comandos arredondados.** A direção do direcional hoje é um número com muitas casas. Ela passaria a ser arredondada (por exemplo, a 1/4.096 de volta) **no próprio jogo**, para o replay ser exatamente o que foi jogado. A diferença é imperceptível para quem joga.
3. **Gravar os comandos durante a fase**, junto com as pausas.
4. **Onde a conferência roda.** Duas opções:
   - **Na hora, numa Cloud Function do Firebase.** O tempo só entra no ranking depois de conferido. Exige o **plano Blaze** (pago por uso, com cartão cadastrado e uma cota gratuita; o Firebase avisa que o Cloud Functions pode gerar uma pequena cobrança mesmo dentro dela).
   - **Depois, por um script nosso.** O jogo grava o tempo e o replay; o ranking mostra o tempo como "a conferir"; um script (algo como `node jogo/ferramentas/validar-ranking.mjs`) refaz as corridas do topo e marca as aprovadas. Continua no plano gratuito, mas não é instantâneo e depende de alguém rodar o script. Para o tamanho do jogo no começo, é suficiente.

## 7. O que o replay não pega, e como cobrir

| Brecha | Por que passa | Como cobrir |
|---|---|---|
| **Robô** | Um programa gera comandos perfeitos, e o replay é verdadeiro. O nosso piloto automático faz isso | **Piso de tempo** por fase, a partir do piloto expert ([#92](https://github.com/TARNAGS/resgate-espacial/issues/92)): tempo muito abaixo do melhor do piloto é suspeito. **Padrão dos comandos**: humano tem reação, hesitação e imprecisão. **Olho humano** no top 10. Humanos podem bater o piloto, então isso **marca para revisão**, não recusa sozinho |
| **Câmera lenta** | Os comandos são reais, só que feitos com mais tempo | Comparar a **duração real** (relógio do servidor, do bilhete ao envio) com o tempo do jogo, descontando as pausas. Corrida com muitos quadros "engasgados" (a telemetria já mede isso, [#91](https://github.com/TARNAGS/resgate-espacial/issues/91)) não vale para o ranking, ou vai para revisão |
| **Nick de outra pessoa** | O replay não diz quem jogou | Identidade (seção 7.1) |
| **Falso positivo** | Uma regra errada pode recusar uma corrida legítima, como no Trackmania | Nunca apagar sozinho: **esconder, revisar, decidir**. Guardar o replay para o jogador se defender |

### 7.1 Proteger o nick sem login (D-001)

- **Login anônimo do Firebase.** Invisível para o jogador: o aparelho ganha uma identidade secreta na primeira vez, e as regras do banco dizem "este nick pertence a esta identidade". Ninguém mais grava com ele. Está no plano gratuito (até 3.000 usuários ativos por dia e 50 mil por mês, nos limites atuais). Ponto fraco: quem apagar os dados do navegador ou trocar de aparelho perde o nick, a não ser que exista um jeito de recuperar.
- **Conta da loja** (Game Center e Google Play Games), no lançamento: a identidade que o jogador já tem, sem login nosso.
- **App Check do Firebase**: confirma que o pedido veio do nosso app (App Attest no iPhone, Play Integrity no Android, reCAPTCHA Enterprise na web), e não de um script. **Não confere o tempo**: o próprio Firebase diz que ele evita alguns abusos, não todos. É uma camada a mais, não a solução.

## 8. Recomendação em degraus (para você decidir)

### Degrau 1: já, nos playtests (barato, cerca de um dia de trabalho)

1. **Piso de tempo por fase** nas regras do banco: uma lista `limits/<fase>/min`, gravada por nós a partir do piloto expert com folga (por exemplo, 80% do melhor tempo dele). Abaixo disso, o banco recusa.
2. **Dono do nick** com o login anônimo do Firebase.
3. **Esconder `window.__game`** fora do modo de ajuste. Não impede quem sabe, mas tira a porta da frente.
4. **Corrida com engasgo** (quadros acima de 0,1 s) não vai para o ranking; o jogador vê um aviso.

### Degrau 2: antes do lançamento (M4, dentro da [#101](https://github.com/TARNAGS/resgate-espacial/issues/101))

1. **Matemática idêntica** em todos os aparelhos e **comandos arredondados** (seção 6.3).
2. **Replay gravado e enviado** com o tempo, com o bilhete e o relógio do servidor.
3. **Conferência**: começar pelo script (gratuito); passar para a Cloud Function se o ranking crescer.
4. O ranking mostra **só os tempos conferidos**.

### Degrau 3: no lançamento

1. **Identidade da loja** e **App Check**.
2. **Revisão humana do top 10** de cada fase, assistindo ao replay. É pouco trabalho e é onde a trapaça se concentra.
3. **Botão de denunciar** um tempo, e uma regra pública: tempo suspeito fica escondido, é revisado e, se for trapaça, o nick é banido.

### O que eu não recomendo

- **Anticheat dentro do aparelho** (núcleo do sistema, ofuscação paga): custo e invasão desproporcionais para um jogo casual. No iPhone, o próprio sistema já isola os apps; trapacear lá exige jailbreak, coisa de uma minoria.
- **Confiar só no ranking da loja**: ele resolve o nome, não o tempo.
- **A versão web (GitHub Pages) gravando no ranking oficial sem replay.** É a porta mais fácil de abrir; se ela existir no lançamento, precisa passar pela mesma conferência ou ter ranking separado.

## 9. Perguntas para você

1. **Quanto o ranking importa no lançamento?** Se ele for o centro da diversão (D-021), o degrau 2 é obrigatório antes de publicar. Se for um extra, dá para lançar com o degrau 1 e a revisão manual do topo.
2. **Fazemos o degrau 1 agora**, nos playtests, ou só depois? **Respondida em 07/10/2026: não agora (D-036).** O anticheat inteiro fica para antes do lançamento.
3. **Ranking da loja, nosso, ou os dois?** (liga com a [#98](https://github.com/TARNAGS/resgate-espacial/issues/98), item 4)
4. **Aceita o plano Blaze** (cartão cadastrado, cobrança por uso) para conferir na hora, ou começamos pela conferência gratuita por script?
5. **O fantasma entra como ideia de produto?** Ele usa o mesmo replay e daria um motivo a mais para o investimento.

## 10. Glossário

| Termo | O que é |
|---|---|
| **Anticheat** | Tudo o que impede ou detecta trapaça num jogo |
| **Replay** | A gravação dos comandos do jogador, que permite refazer a partida igualzinha |
| **Determinismo** | Os mesmos comandos, na mesma fase, dão sempre o mesmo resultado, em qualquer aparelho |
| **Semente** | O número que gera a fase. Mesma semente, mesma fase (D-014, D-021) |
| **Passo fixo** | A física avança sempre em fatias iguais de tempo (no nosso jogo, 1/120 s), seja o aparelho rápido ou lento |
| **Servidor autoritativo** | Quando é o servidor que roda o jogo, e o aparelho só manda comandos |
| **Robô (bot) ou TAS** | Programa que joga sozinho, ou corrida montada comando a comando com ajuda de ferramentas |
| **Câmera lenta (slowdown)** | Rodar o jogo mais devagar para ter mais tempo de reagir |
| **Kernel** | O núcleo do sistema operacional. Anticheat de kernel tem acesso a tudo no computador |
| **App Check** | Serviço do Firebase que confirma que o pedido veio do app oficial |
| **Falso positivo** | Quando o anticheat acusa quem não trapaceou |

## 11. Fontes

Consultadas em 07/10/2026. As fontes oficiais (Apple, Google, Firebase) aparecem primeiro em cada tema; relatos de desenvolvedores e da imprensa vêm depois.

**Rankings das lojas**
- Apple, App Store Connect: [gerenciar pontuações e jogadores](https://developer.apple.com/help/app-store-connect/configure-game-center/manage-scores-and-players) e [configurar rankings](https://developer.apple.com/help/app-store-connect/configure-game-center/configure-leaderboards/) (faixa de pontuação)
- Apple, WWDC 2013, sessão 306: [índice da sessão](https://nonstrict.eu/wwdcindex/wwdc2013/306/) (faixa mínima e máxima e remoção de pontuações)
- Engadget, 29/10/2013: [desenvolvedores passam a apagar pontuações falsas do Game Center](https://www.engadget.com/2013-10-29-devs-gain-ability-to-delete-fake-scores-from-game-center-leaderb.html)
- Android Developers Blog, 19/12/2014: [proteção contra adulteração nos rankings do Google Play Games](https://android-developers.googleblog.com/2014/12/google-play-game-services-ends-year.html)

**Firebase**
- [App Check](https://firebase.google.com/docs/app-check) e [ativar a exigência do App Check](https://firebase.google.cn/docs/app-check/enable-enforcement)
- [Planos de preço (Spark e Blaze)](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans) e [limites do Authentication](https://firebase.google.com/docs/auth/limits)
- [Referência das regras do Realtime Database](https://firebase.google.com/docs/reference/security/database)

**Conferência por replay e casos**
- GIGAZINE, 10/11/2021: [como o Open Hexagon impede pontuações ilegais](https://gigazine.net/gsc_news/en/20211110-open-hexagon-against-cheet) (relato de Vittorio Romeo, o criador)
- AntGame, código aberto: [github.com/Cuzzo01/antgame.io](https://github.com/Cuzzo01/antgame.io) (semente emitida pelo servidor e corrida refeita)
- BugNet: [como corrigir trapaça e pontuações falsas no ranking](https://bugnet.io/blog/how-to-fix-leaderboard-cheating-and-fake-scores) e [replay que falha por simulação não determinística](https://bugnet.io/blog/how-to-fix-replay-verification-failing-from-nondeterministic-simulation)
- RAXXO: [o anticheat do jogo de navegador "Center This Div"](https://raxxo.shop/blogs/lab/how-i-built-an-anti-cheat-system-for-a-css-game)

**Trackmania**
- [Wikipédia: Wirtual](https://en.wikipedia.org/wiki/Wirtual) e GGRecon: [o maior streamer de Trackmania foi pego trapaceando?](https://www.ggrecon.com/articles/did-the-biggest-trackmania-streamer-get-caught-cheating) (caso Riolu, 2021)
- Nadeo, fórum oficial: [varredura que apagou corridas legítimas](https://devtrackers.gg/trackmania/p/b1c5ba74-false-positive-runs-wiped-out)
- Trackmania, documentação: [como denunciar um jogador](https://doc.trackmania.com/general/how-to-report-player/) e [ajustes depois do lançamento](https://www.trackmania.com/news/1110) (validação de recordes, 2020)

**speedrun.com**
- [Regras de moderação](https://speedrun.com/knowledgebase/moderation-rules) e um exemplo de exigência de vídeo por tempo: [Donkey Kong Country](https://www.speedrun.com/ru-RU/dkc/forums/b2dmy)

**Matemática idêntica em todos os aparelhos**
- es-discuss: [precisão das funções especiais no ES6](https://esdiscuss.org/topic/es6-accuracy-of-special-functions)
- WebKit: [diferenças de `Math.sin` entre navegadores](https://bugs.webkit.org/show_bug.cgi?id=114852)
- Rapier (motor de física): [determinismo em JavaScript](https://rapier.rs/docs/user_guides/javascript/determinism)
- Rune: [tornando o JavaScript determinístico](https://developers.rune.ai/blog/making-js-deterministic-for-fun-and-glory/)
- Relato de desenvolvedor: [simulação diverge entre motores por causa de seno e cosseno](https://codeberg.org/perplexdotgg/bounce/issues/8)

**Anticheat no aparelho**
- secret.club: [por que anticheats usam o núcleo do sistema](https://secret.club/2020/04/17/kernel-anticheats.html)
- arXiv: [anticheat no servidor e no aparelho](https://arxiv.org/pdf/2409.14830v2)
- Guardsquare: [adulteração de memória em jogos de celular](https://guardsquare.com/blog/cheating-easy-how-prevent-mobile-game-memory-tampering) e Talsec: [GameGuardian](https://docs.talsec.app/appsec-articles/articles/preventing-piracy-and-cheating-in-games-a-guide-to-countering-gameguardian-with-talsec) (empresas que vendem proteção)

**Limites da pesquisa**
- Não achei documentação oficial da Nadeo sobre como o Trackmania confere os recordes hoje; o que está aqui vem da comunidade e do fórum.
- A proteção do Google Play Games vem de um anúncio de 2014; falta confirmar como funciona hoje (fica para a [#98](https://github.com/TARNAGS/resgate-espacial/issues/98)).
- O relato original do criador do Open Hexagon não abriu (o endereço hoje mostra outro texto); usamos o resumo da GIGAZINE.
- As portas abertas da seção 5.2 vêm da leitura do código, sem teste no banco de verdade, para não sujar o ranking dos playtesters.

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 0.1 | 07/10/2026 | Primeira versão: tipos de anticheat, casos (Open Hexagon, Trackmania, lojas, speedrun.com), as portas abertas do nosso ranking, a conferência por replay e a recomendação em três degraus ([#109](https://github.com/TARNAGS/resgate-espacial/issues/109)) |
| 0.2 | 07/10/2026 | Registrado nos outros documentos (P-023, risco no PRD, Roadmap e Regras do jogo) e nos cartões #101 e #98; nota sobre o repositório público na seção 5.2 |
| 0.3 | 07/10/2026 | Pergunta 2 respondida pelo Fernando: o degrau 1 não entra nos playtests (D-036). As perguntas 1, 3, 4 e 5 ficam para antes do lançamento |
