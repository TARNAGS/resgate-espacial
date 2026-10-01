# Resgate Espacial

> Codinome. O nome final do jogo ainda será definido.

Jogo 2D de nave com gravidade: pilote um pequeno triângulo, dose o propulsor contra o peso da nave, atravesse os obstáculos, resgate a tripulação perdida no espaço e volte para a base antes de o combustível acabar.

**Status:** documentação base aprovada em 01/10/2026 e backlog montado. Marco atual: M0 (fundação técnica). O jogo ainda não começou a ser construído.

## Sobre o projeto

Projeto de portfólio de gestão de produto: um produto real, pequeno e jogável, levado da ideia ao lançamento, com documentação, backlog e construção com apoio de IA (Claude Code).

- **Plataformas:** navegador e celular, instalável direto do site, sem loja. iPhone primeiro; Android numa etapa seguinte.
- **Idioma do jogo:** inglês.
- **Modelo:** gratuito, sem cadastro e sem anúncios.
- **Tecnologia:** JavaScript puro com Canvas, sem framework.
- **Fases:** geradas aleatoriamente a cada partida, para o replay ser infinito, com um mapa de progresso no menu.

## Documentação

| # | Documento | Pergunta que responde | Status |
|---|---|---|---|
| 01 | [Visão do produto](docs/01-visao-do-produto.md) | O quê, para quem, por quê e como saber se deu certo | Aprovado |
| 02 | [Regras do jogo](docs/02-regras-do-jogo.md) | Como se joga | Aprovado (falta a pontuação) |
| 03 | [PRD](docs/03-prd.md) | O que o produto precisa ter | Aprovado |
| 04 | [Roadmap](docs/04-roadmap.md) | Em que ordem o produto é construído | Aprovado |
| 05 | [Registro de decisões](docs/05-registro-de-decisoes.md) | Por que escolhemos X e não Y | Contínuo |
| 06 | [Diário de bordo](docs/06-diario-de-bordo.md) | O que foi feito em cada sessão e onde o projeto parou | Contínuo |

## Como o trabalho é organizado

O [roadmap](docs/04-roadmap.md) avança por marcos, do M0 (fundação) ao M3 (V1), sem data-alvo. O trabalho se divide em **iniciativas**, que se dividem em **épicos**, que se dividem em **histórias de usuário**, **tarefas** e **descobertas**. Tudo fica nas [issues](https://github.com/TARNAGS/resgate-espacial/issues) do GitHub, organizado por [marcos](https://github.com/TARNAGS/resgate-espacial/milestones) e acompanhado no [quadro kanban](https://github.com/users/TARNAGS/projects/1).

O quadro tem duas trilhas ([D-016](docs/05-registro-de-decisoes.md#d-016--quadro-com-duas-trilhas-descoberta-e-entrega)):

- **Descoberta:** Caixa de entrada, A investigar, Investigando e Para conversar. É onde se responde o que precisa ser entendido antes de construir: regras e sensação do jogo, formato, estrutura das fases, bugs a reproduzir.
- **Entrega:** Backlog, Pronto, Em andamento, Em revisão e Concluído. É onde se constrói o que já está claro.

- **Pronta para começar:** a história está no formato "Como / Quero / Para", tem critérios de aceite verificáveis, está ligada a um épico e tem marco definido.
- **Pronta de verdade:** os critérios de aceite foram atendidos, o resultado foi testado no iPhone (e no computador, quando fizer sentido), está publicado, e a documentação foi atualizada se alguma regra mudou.

Novas issues seguem os modelos de história, tarefa, épico, iniciativa, descoberta e bug, disponíveis ao criar uma issue.

## Como jogar

O [protótipo 01](prototipos/README.md) está publicado e roda no navegador do computador e do celular: **https://tarnags.github.io/resgate-espacial/prototipos/01/** (no celular, use a tela na horizontal).

Para rodar no próprio computador, na pasta do projeto, rode `node prototipos/servir.js` e abra `http://localhost:8080`.
