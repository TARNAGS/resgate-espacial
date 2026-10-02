# Roteiro de teste do controle

> Status: **Proposta** (02/10/2026). Tarefa [#41](https://github.com/TARNAGS/resgate-espacial/issues/41). Serve para os testes com 3 a 5 pessoas ([#43](https://github.com/TARNAGS/resgate-espacial/issues/43)) e para a escolha do direcional ([#44](https://github.com/TARNAGS/resgate-espacial/issues/44)).

O roteiro é igual para todos os testadores, para que os resultados possam ser comparados.

## 1. Objetivo

Responder a pergunta do M1: **pilotar a nave é divertido?** Sensação de gravidade, força do propulsor, giro, tamanho da nave e tolerância do pouso.

**Critério de aprovação do M1:** pelo menos 4 de 5 testadores aprovam a sensação (pergunta 1 do fim do teste, nota 4 ou 5).

## 2. Antes do teste

- Jogo aberto no iPhone do testador, ou num iPhone emprestado, com a tela na horizontal. O endereço depende da janela de teste (D-017, ver o `CLAUDE.md` do projeto). Na rede de casa, use `node jogo/servir.js` e `http://<IP do computador>:8081`.
- Painel de ajuste liberado no aparelho: abrir o jogo com `?tuning` no fim do endereço, ou tocar 5 vezes no subtítulo do menu. Durante a partida, o botão **T** abre o painel.
- Progresso zerado: Settings → Reset progress.
- Som ligado e volume médio.
- Uma folha de registro por testador (seção 6).

## 3. O que dizer ao testador

> "É um jogo de nave com gravidade. Quero ver como você se vira sozinho, então vou falar o mínimo. Pense em voz alta: diga o que está tentando fazer e o que está sentindo. Não existe resposta errada; se algo for difícil, o problema é do jogo, não seu."

Não explicar os controles. As dicas que aparecem na tela fazem parte do teste.

## 4. Tarefas

| # | Tarefa | Onde | Limite | O que anotar |
|---|---|---|---|---|
| 1 | "Decole e pouse de volta na plataforma." | Treino (painel → PRACTICE) | 3 min | Tempo até o primeiro pouso; número de explosões |
| 2 | "Resgate a tripulação e volte para a base." | Nível 1, pelo menu | 5 min | Concluiu? Tempo; vidas perdidas; onde explodiu |
| 3 | "Agora a fase 2." | Nível 2 | 5 min | Igual à tarefa 2 |
| 4 | Repetir a tarefa 1 com o direcional fixo no canto | Painel → Joystick: fixed → PRACTICE | 3 min | Igual à tarefa 1; qual preferiu |

Se a tarefa passar do limite, agradecer e seguir para a próxima. Alternar a ordem das variantes do direcional entre testadores (metade começa pelo fixo) para que o aprendizado não favoreça a segunda.

## 5. O que observar

- Onde o polegar fica e se ele sai da tela ou cobre a nave.
- Se o testador entende sozinho que precisa segurar para acionar o propulsor e arrastar para girar.
- Reações espontâneas: frustração, risada, "de novo!", "isso é injusto".
- Explosões que o testador não entende (por exemplo, "eu estava devagar!").
- Se a página rola, dá zoom ou abre algum menu ao tocar (não deveria: #40).

## 6. Folha de registro

| Campo | Testador |
|---|---|
| Nome ou apelido, idade e se joga no celular | |
| Tarefa 1: tempo até o primeiro pouso / explosões | |
| Tarefa 2: concluiu? tempo / vidas perdidas | |
| Tarefa 3: concluiu? tempo / vidas perdidas | |
| Tarefa 4: tempo até o primeiro pouso / explosões | |
| Direcional preferido: onde o polegar toca ou fixo | |
| Observações | |

## 7. Perguntas do fim

1. De 1 a 5, quanto você gostou de pilotar a nave? *(critério do M1: 4 ou 5)*
2. A nave pareceu pesada demais, leve demais ou na medida?
3. O pouso foi fácil demais, difícil demais ou na medida?
4. O que mais irritou?
5. Você jogaria de novo? Por quê?
6. Qual direcional você prefere, e por quê?

## 8. Depois do teste

- Se algum ajuste foi feito no painel durante o teste, tocar em **COPY VALUES** e colar o resultado no comentário da issue: assim o Claude passa os valores para `jogo/src/config/params.js`.
- Registrar cada folha como comentário na [#43](https://github.com/TARNAGS/resgate-espacial/issues/43). Com 3 a 5 folhas, a [#44](https://github.com/TARNAGS/resgate-espacial/issues/44) vai para "Para conversar".
