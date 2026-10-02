# PRD — Resgate Espacial

> Documento 03 da série: [Visão](01-visao-do-produto.md) (por quê) → [Regras do jogo](02-regras-do-jogo.md) (como se joga) → **PRD** (o que o produto precisa ter) → Roadmap (quando).

| Campo | Valor |
|---|---|
| Documento | 03 — PRD (requisitos do produto) |
| Versão | 1.4 |
| Data | 02/10/2026 |
| Status | Aprovado |
| Responsável | Fernando Nunes (Product Manager) |

## 1. Objetivo

Definir o que o produto precisa ter em volta do jogo para cumprir a Visão: jogar pelo link, instalar no iPhone sem loja, funcionar sem internet, guardar o progresso no aparelho e medir o uso sem coletar dados pessoais. As regras do jogo em si estão no documento 02.

## 2. Contexto

Decisões que moldam os requisitos ([registro de decisões](05-registro-de-decisoes.md)):

| Decisão | O que implica para o produto |
|---|---|
| D-001 Sem login | Progresso guardado no aparelho; nenhum servidor de contas |
| D-002 PWA, fora das lojas (substituída pela D-019) | No MVP, o jogo continua pelo navegador e precisa funcionar sem internet |
| D-019 Publicação nas lojas | Depois do MVP, o jogo vai para a App Store e o Google Play (RF-21) |
| D-003 Gratuito (revista pela D-019) | MVP gratuito, com ferramentas sem custo; cobrar depois está em aberto (P-014 e P-017) |
| D-020 Mundos com 10 fases | O mapa de progresso agrupa as fases por mundo, cada um com visual próprio (RF-22) |
| D-004 Um jogador | Tudo roda no aparelho |
| D-006 Direcional virtual | Controle por toque com um polegar só |
| D-007 Jogo em inglês | Todos os textos do jogo em inglês |
| D-008 iPhone primeiro | As limitações do iPhone viram requisitos do MVP ([seção 6](#6-particularidades-do-iphone)) |

## 3. Jornadas principais

### J1 — Avaliador abre o link no iPhone (primeira visita)

```
Toca no link → abre no Safari → celular na vertical: aviso "gire o celular" → tela de abertura → Jogar
→ fase 1, com dicas → primeiro resgate → resultado → convite para instalar → "Sobre o projeto" → GitHub
```

Meta: do toque no link até controlar a nave em até 10 segundos (Visão, seção 6.2). O convite para instalar só aparece depois do primeiro resgate, para não atrapalhar a primeira partida.

### J2 — Nostálgico instala e volta a jogar

```
Segue o passo a passo → adiciona à Tela de Início → abre pelo ícone, sem as barras do navegador
→ continua da última fase liberada → joga mesmo sem internet
```

### J3 — Jogador no computador

```
Abre o link → joga com o teclado → o progresso fica salvo naquele navegador
```

## 4. Requisitos funcionais

### 4.1 Mapa de telas

```
Menu, com o mapa de progresso
  ─┬─ Jogar ──► Fase ─┬─► Resultado ──► Próxima fase / Jogar de novo / Menu
   │                  ├─► Pausa ──► Continuar / Recomeçar / Menu / Som
   │                  └─► Fim de jogo ──► Tentar de novo / Menu
   ├─ Configurações ──► Som / Apagar progresso
   ├─ Como instalar (só no iPhone, fora do app instalado)
   └─ Sobre o projeto

Em qualquer tela, com o celular na vertical: aviso "gire o celular"
```

### 4.2 Requisitos

Prioridade: **MVP** (entra na primeira versão pública) ou **Depois** (etapas seguintes). O corte final é feito no Roadmap.

| ID | Requisito | Prioridade | Critério de aceite |
|---|---|---|---|
| RF-01 | Jogar direto pelo link, sem cadastro e sem instalar | MVP | Abrir o endereço leva à tela de abertura; nenhuma etapa pede dados do jogador |
| RF-02 | Menu com Jogar, Configurações, mapa de progresso, Como instalar (quando fizer sentido) e Sobre (D-015) | MVP | "Jogar" leva ao nível escolhido no mapa; por padrão, o primeiro ainda não concluído |
| RF-03 | Jogo conforme as regras do documento 02 | MVP | Todas as regras marcadas como Definido funcionam |
| RF-04 | Controles de teclado e direcional virtual (documento 02, seção 4) | MVP | Dá para concluir todas as fases com cada um dos controles |
| RF-05 | Mapa de progresso (D-015) | MVP | Mostra os níveis concluídos, disponíveis e bloqueados, com o melhor resultado e o número de resgates de cada um; tocar num nível disponível o escolhe para jogar |
| RF-06 | Pausa | MVP | Pausa pelo botão ou por P/Esc, e sozinha quando o jogador sai do app; opções: continuar, recomeçar a fase, voltar ao menu, ligar ou desligar o som |
| RF-07 | Tela de resultado da fase | MVP | Mostra o tempo e a pontuação (P-006); opções: próxima fase, jogar de novo, menu |
| RF-08 | Tela de fim de jogo | MVP | Opções: tentar de novo (a fase recomeça) e voltar ao menu |
| RF-09 | Progresso salvo no aparelho | MVP | Fases liberadas, melhores resultados e preferência de som continuam lá depois de fechar e reabrir o jogo, sem o jogador precisar salvar nada |
| RF-10 | Como instalar no iPhone | MVP | No Safari, mostra o passo a passo de instalação; dentro do app instalado, não aparece; o convite só surge depois do primeiro resgate ou pelo menu |
| RF-11 | Aviso para girar o celular | MVP | Com o celular na vertical, o jogo pausa e pede para girar; na horizontal, o aviso some |
| RF-12 | Som | MVP | Efeitos do documento 02 (seção 12); o som começa depois do primeiro toque e a escolha de ligar ou desligar é lembrada |
| RF-13 | Textos em inglês | MVP | Nenhum texto em português dentro do jogo (D-007) |
| RF-14 | Sobre o projeto | MVP | Créditos, link para o repositório do projeto e explicação do que é medido ([seção 7](#7-medição)) |
| RF-15 | Medição anônima de uso | MVP | Os eventos da seção 7 chegam à ferramenta de medição, sem dados pessoais |
| RF-16 | Botão "Instalar" no Android e no computador, usando o convite do navegador | Depois | Nos navegadores que oferecem o convite (como o Chrome), o botão instala o jogo (D-008) |
| RF-17 | Fases geradas aleatoriamente (D-014) | MVP | Cada partida gera um cenário novo, seguindo as regras do nível; todo cenário gerado tem solução; a mesma semente gera sempre o mesmo cenário |
| RF-18 | Abertura em telas antes da primeira fase ([documento 02, seção 10.1](02-regras-do-jogo.md#101-abertura--proposta-depois-do-mvp)) | Depois | Na primeira vez, três telas: tripulação em apuros, o chamado para o resgate e um fade para a fase 1; dá para pular e rever pelo menu |
| RF-19 | Loja de itens no menu (P-017) | Depois | O jogador vê os itens, o preço (dinheiro real ou moedas) e o que já comprou; um item comprado continua com ele depois de fechar o jogo |
| RF-20 | Moedas do jogo (P-017) | Depois | O jogador ganha moedas jogando, conforme a regra da P-017, e vê o saldo no menu |
| RF-21 | Publicação na App Store e no Google Play (D-019) | Depois | O jogo instala pelas duas lojas; as compras, quando existirem, usam o sistema de compras de cada loja e podem ser restauradas sem login (a confirmar na [#65](https://github.com/TARNAGS/resgate-espacial/issues/65)) |
| RF-22 | Mundos com 10 fases (D-020) | Depois | O mapa de progresso mostra os mundos, cada um com as suas 10 fases e o seu visual; concluir a fase 10 libera o próximo mundo |

## 5. Requisitos não funcionais

| ID | Requisito | Prioridade | Critério de aceite |
|---|---|---|---|
| RNF-01 | Carregamento rápido | MVP | Do toque no link até controlar a nave em até 10 segundos, no celular com 4G |
| RNF-02 | Animação fluida | MVP | 60 quadros por segundo no iPhone de teste, sem travadas perceptíveis |
| RNF-03 | Funciona sem internet | MVP | Depois de aberto uma vez, o jogo abre e funciona completo sem conexão (em PWAs, isso é feito por um *service worker*) |
| RNF-04 | Compatibilidade no MVP | MVP | iPhone com a versão atual do iOS e a anterior (hoje, 27 e 26), no Safari e instalado; no computador, versões atuais de Chrome, Safari, Edge e Firefox |
| RNF-05 | Compatibilidade com Android | Depois | Chrome no Android, testado em aparelho real (D-008) |
| RNF-06 | Privacidade | MVP | Nenhum dado pessoal coletado; nenhum cookie; nada que identifique a pessoa ou o aparelho sai do aparelho |
| RNF-07 | Custo zero | MVP | Hospedagem e ferramentas gratuitas (D-003) |
| RNF-08 | Segurança | MVP | Site servido por HTTPS; nenhum segredo (chave, token) no código |
| RNF-09 | Áreas seguras da tela | MVP | Na horizontal, nada importante fica sob o entalhe ou a Dynamic Island, e o direcional fica longe das bordas, para o polegar não acionar gestos do sistema |
| RNF-10 | Toque sem efeitos do navegador | MVP | Durante o jogo, tocar e arrastar não rola a página, não dá zoom, não seleciona texto e não abre menu de toque longo |
| RNF-11 | Acessibilidade básica | MVP | Nenhuma informação depende só de cor (ex.: o indicador de pouso também muda de forma); textos legíveis; som desligável; pausa a qualquer momento |
| RNF-12 | Fácil de ajustar | MVP | Os parâmetros de ajuste (documento 02, seção 13) e os textos (D-007) ficam num único lugar do código; mudar um valor não exige mexer na lógica do jogo |

## 6. Particularidades do iPhone

Com o iPhone como prioridade (D-008), estas limitações dos web apps no iOS viram requisitos do MVP. Levantamento feito em 28/09/2026; cada item deve ser confirmado no protótipo, na versão atual do iOS.

| Limitação | O que significa para o jogo | Resposta no produto |
|---|---|---|
| O Safari não oferece convite automático de instalação, como o Chrome faz | Ninguém vai instalar se o jogo não ensinar | Passo a passo dentro do jogo (RF-10) |
| No iOS 26, a instalação passou a ser: menu (…) → Compartilhar → Adicionar à Tela de Início, com a opção "Open as Web App" | O passo a passo depende da versão do iOS | Validar as instruções na versão atual do iOS antes do lançamento |
| O iPhone não permite travar a orientação da tela, nem por código nem pelo manifesto do app, segundo os dados do MDN. Há relatos de desenvolvedores em sentido contrário para apps instalados | Não dá para garantir a tela na horizontal | Aviso para girar o celular (RF-11); confirmar o comportamento no protótipo |
| A tela cheia por código só funciona no iPad, não no iPhone | No Safari, as barras do navegador ocupam parte da tela | Layout que funciona com as barras; instalado, o jogo abre sem elas |
| No Safari, o WebKit apaga os dados de sites sem interação do usuário. Em 2020, o prazo anunciado foi de 7 dias de uso do Safari. Apps da Tela de Início têm contador próprio, e o WebKit diz não esperar que os dados deles sejam apagados | Quem joga só pelo Safari pode perder o progresso | Convidar para instalar e pedir armazenamento persistente, que o Safari concede com mais facilidade a apps da Tela de Início |
| O som só pode começar depois de uma interação do jogador (regra dos navegadores em geral) | Efeitos antes do primeiro toque não tocam | O áudio começa no primeiro toque (RF-12) |

**Conclusão:** instalar o jogo resolve dois desses problemas (tela cheia e segurança do progresso). Por isso o convite para instalar é requisito do MVP, e não enfeite.

**Fontes (consultadas em 28/09/2026):**

- Convite de instalação: dados de compatibilidade do MDN para [BeforeInstallPromptEvent](https://github.com/mdn/browser-compat-data/blob/main/api/BeforeInstallPromptEvent.json) (Safari: sem suporte).
- Orientação: dados de compatibilidade do MDN para [ScreenOrientation.lock()](https://github.com/mdn/browser-compat-data/blob/main/api/ScreenOrientation.json) e para o [membro orientation do manifesto](https://github.com/mdn/browser-compat-data/blob/main/manifests/webapp/orientation.json) (Safari e iOS: sem suporte).
- Tela cheia: [Can I use — Fullscreen API](https://caniuse.com/fullscreen) (iOS Safari: suporte parcial, só no iPad) e dados do MDN para [display: standalone](https://github.com/mdn/browser-compat-data/blob/main/manifests/webapp/display.json) (iOS 11.3 em diante).
- Armazenamento: WebKit, [Full Third-Party Cookie Blocking and More](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/) (24/03/2020) e [Updates to Storage Policy](https://webkit.org/blog/14403/updates-to-storage-policy/) (10/08/2023, Safari 17).
- Instalação no iOS 26: [MacRumors](https://www.macrumors.com/how-to/save-safari-bookmark-web-app-iphone-home-screen/) (20/08/2025, fonte secundária).
- Som: [MDN — Autoplay guide for media and Web Audio APIs](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay).

## 7. Medição

Objetivo: acompanhar as métricas da Visão (seção 6) sem identificar ninguém.

**Regras:**

- Sem cookies e sem nenhum identificador do jogador ou do aparelho enviado para fora do aparelho.
- Só contagens de eventos, com poucas propriedades (fase, tempo, causa).
- Eventos de "primeira vez" disparam uma única vez por aparelho, controlados por uma marcação guardada no próprio aparelho. Assim dá para calcular a ativação (primeiros resgates ÷ primeiras partidas) sem saber quem é quem.
- A ferramenta será escolhida na pendência P-008: precisa ser gratuita, dispensar cookies e aceitar eventos personalizados.

| Evento | Quando dispara | Propriedades | Alimenta |
|---|---|---|---|
| `app_open` | Ao abrir o jogo | Instalado (sim ou não) | Instalação (H1) |
| `level_start` | Ao começar uma fase | Fase | Volume de partidas |
| `rescue_completed` | Ao concluir uma fase | Fase, tempo, vidas perdidas | North Star: resgates concluídos |
| `life_lost` | Ao explodir | Fase, causa (batida, pouso, sem combustível) | Onde o jogo está difícil demais |
| `game_over` | Ao perder a terceira vida | Fase | Fases que precisam de ajuste |
| `first_level_start` | Na primeira partida do aparelho | — | Ativação (denominador) |
| `first_rescue` | No primeiro resgate do aparelho | — | Ativação (numerador) |
| `third_match_first_session` | Ao iniciar a terceira partida da primeira sessão | — | Diversão (H2) |
| `install_help_opened` | Ao abrir o passo a passo de instalação | — | Interesse em instalar |

O tempo entre o link e o controle da nave (RNF-01) é medido em teste, não pela ferramenta.

## 8. Critérios de aceite do lançamento

- [ ] No iPhone, o jogo abre pelo link no Safari e dá para jogar sem instalar.
- [ ] Instalado na Tela de Início, abre sem as barras do navegador.
- [ ] Depois de aberto uma vez, funciona sem internet.
- [ ] O progresso continua depois de fechar e reabrir o jogo.
- [ ] Com o celular na vertical, aparece o aviso para girar.
- [ ] Todas as regras marcadas como Definido no documento 02 funcionam no teclado e no direcional.
- [ ] Do toque no link até controlar a nave em até 10 segundos, no 4G.
- [ ] Animação fluida no iPhone de teste.
- [ ] Todos os textos do jogo em inglês.
- [ ] Nenhum dado pessoal coletado, e a tela "Sobre" explica o que é medido.
- [ ] Os eventos de medição chegam à ferramenta escolhida.

## 9. Riscos e mitigações

| Risco | Severidade | Mitigação |
|---|---|---|
| Quem joga só pelo Safari perder o progresso depois de dias sem jogar | Média | Convite para instalar depois do primeiro resgate; pedir armazenamento persistente |
| As barras do Safari (sem instalar) roubarem espaço da tela na horizontal | Média | Layout que funciona com as barras; incentivar a instalação |
| O polegar acionar gestos do sistema (voltar, ir para o início) sem querer | Média | Direcional longe das bordas; testar no iPhone |
| O iOS mudar o comportamento dos web apps numa atualização | Baixa | Revisar a seção 6 a cada versão nova do iOS |
| A ferramenta de medição gratuita mudar limites ou regras | Baixa | Medição isolada num único ponto do código, fácil de trocar |

## 10. Fora do escopo

- Login, contas, ranking online e sincronização entre aparelhos (D-001).
- Publicação na App Store e no Google Play **no MVP**: vem depois (D-019; RF-21).
- Compras **no MVP**: a loja de itens e a cobrança vêm depois (RF-19 e RF-20; P-014 e P-017).
- Anúncios (D-003, revista pela D-019).
- Multiplayer (D-004).
- Testes e ajustes para Android nesta etapa (D-008).
- Idiomas além do inglês (D-007).

## 11. Pendências

| ID | Pergunta | Impacto neste documento |
|---|---|---|
| P-003 | Qual será o nome final do jogo? | Tela de abertura, ícone e nome na Tela de Início |
| P-006 | Como funciona a pontuação? | Telas de resultado e de seleção de fases (RF-05 e RF-07) |
| P-008 | Qual ferramenta de medição anônima usar? | RF-15 e seção 7 |
| P-014 | O jogo será pago, gratuito com loja de itens, ou os dois? | RF-19 a RF-21 |
| P-017 | O que a loja vende, com que moeda, e como evitar vantagem injusta? | RF-19 e RF-20 |

## 12. Próximos passos

Os próximos passos estão no [Roadmap](04-roadmap.md) e no [quadro kanban](https://github.com/users/TARNAGS/projects/1). As decisões em aberto que afetam este documento estão na seção 11.

## 13. Glossário

| Termo | Significado |
|---|---|
| Web app / PWA | Site que pode ser instalado na Tela de Início e abre como um app |
| Modo standalone | Jeito como o web app instalado abre: sem as barras do navegador |
| Service worker | Parte do site que guarda os arquivos no aparelho e permite abrir e jogar sem internet |
| Armazenamento persistente | Pedido ao navegador para não apagar os dados do site quando precisar liberar espaço |
| Área segura | Parte da tela livre do entalhe, da Dynamic Island e do indicador de início do iPhone |
| Quadros por segundo | Quantas imagens o jogo desenha por segundo; 60 é a referência de animação fluida |
| Evento | Registro anônimo de algo que aconteceu no jogo (ex.: resgate concluído), usado nas métricas |
| ITP | *Intelligent Tracking Prevention*: sistema de privacidade do Safari que limita e apaga dados de sites |

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| 0.1 | 28/09/2026 | Primeira versão |
| 0.2 | 28/09/2026 | Pendência P-007 resolvida: MVP com as fases 1 a 3 (D-009) |
| 1.0 | 01/10/2026 | Aprovado pelo Fernando como versão de referência |
| 1.1 | 01/10/2026 | Pendência P-004 resolvida: JavaScript puro com Canvas (D-011) |
| 1.2 | 01/10/2026 | Pendências P-001 e P-005 resolvidas: repositório público (D-012) e hospedagem no GitHub Pages (D-013) |
| 1.3 | 01/10/2026 | Fases geradas aleatoriamente (D-014, novo RF-17) e menu com mapa de progresso (D-015, RF-02 e RF-05 revistos) |
| 1.4 | 02/10/2026 | Big picture com prioridade "Depois": abertura (RF-18), loja de itens (RF-19), moedas (RF-20), publicação nas lojas (RF-21, D-019) e mundos com 10 fases (RF-22, D-020). O MVP não muda |
