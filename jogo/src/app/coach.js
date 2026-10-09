import { COACH, LESSONS, coachTip, crashLesson } from '../core/coach.js';
import { levelProgress } from '../core/progress.js';

// Treinador da fase que ensina (D-038): guarda a memória de cada tentativa, escolhe a dica perto da nave a cada
// quadro, dá a lição depois do erro e oferece a DEMO no fim de jogo. As regras de cada dica ficam em core/coach.js;
// o desenho, em render/coach.js.
//
// Vale só na fase marcada com `hint` (o nível 1) e só até o jogador concluí-la pela primeira vez: quem já sabe jogar
// não vê nada. Para ver de novo num aparelho que já concluiu: ?coach no endereço.

const MIN_TIP = 0.6;     // segundos mínimos de uma dica na tela, para não piscar
const LESSON_SECONDS = 5;

export function createCoach(g) {
  const { app, events, telemetry } = g;
  const forced = new URLSearchParams(location.search).has('coach');
  const lessonCounts = {};   // batidas de cada tipo, por fase, nesta sessão (contam entre tentativas)
  const gameOvers = {};      // fins de jogo por fase, nesta sessão

  const isOn = (def) => Boolean(def?.hint) && !def.training && (forced || !levelProgress(app.save, def.key).completed);

  // Chamado pela partida antes do evento start, para as mensagens do início já saberem se o treinador está ligado
  function startCoach(def) {
    app.coach = isOn(def) ? {
      key: def.key, tip: null, tipT: 0, lesson: null, lessonT: 0, pending: null,
      mem: { flew: false, airT: 0, heldFor: 0, coastFor: 0, coasted: false },
      seen: {},   // dicas mostradas nesta tentativa, para o resumo da telemetria
    } : null;
  }

  events.on('takeoff', () => {
    const c = app.coach;
    if (c) { c.mem.flew = true; c.mem.airT = 0; }
  });
  events.on('crash', (crash) => {
    const c = app.coach;
    if (!c) return;
    const lesson = crashLesson(crash, app.match.params());
    if (!lesson) return;
    const counts = (lessonCounts[c.key] ??= {});
    counts[lesson] = (counts[lesson] || 0) + 1;
    if (counts[lesson] >= COACH.lessonAfter) c.pending = lesson;
  });
  // A lição aparece quando a nave volta, sem botão de OK (Plants vs. Zombies), e some sozinha
  events.on('respawn', () => {
    const c = app.coach;
    if (!c?.pending) return;
    showLesson(c, c.pending);
    c.pending = null;
  });

  function showLesson(c, lesson) {
    c.lesson = lesson;
    c.lessonT = LESSON_SECONDS;
    const r = app.run;
    telemetry.track('hint', { level: c.key, attempt: r?.attempt ?? 0, kind: lesson, n: lessonCounts[c.key]?.[lesson] ?? 0 });
  }

  // A cada passo da física: a memória da tentativa (decolou, segurou o propulsor, voou solto)
  function stepCoach(dt, ship, thrust) {
    const c = app.coach;
    if (!c) return;
    const mem = c.mem;
    if (ship.state === 'flying') {
      mem.airT += dt;
      mem.heldFor = thrust ? mem.heldFor + dt : 0;
      mem.coastFor = thrust ? 0 : mem.coastFor + dt;
      if (mem.coastFor >= COACH.coastToLearn) mem.coasted = true;
    } else {
      mem.heldFor = 0;
      mem.coastFor = 0;
    }
  }

  // A cada quadro: a dica da vez, com um tempo mínimo na tela; alerta troca na hora
  function updateCoach(elapsed, m) {
    const c = app.coach;
    if (!c) return;
    c.lessonT = Math.max(0, c.lessonT - elapsed);
    if (!c.lessonT) c.lesson = null;
    c.tipT += elapsed;
    c.mem.braking = c.tip?.id === 'brake' || c.tip?.id === 'braking';
    const next = coachTip(m, app.match.params(), c.mem);
    const same = next?.id === c.tip?.id;
    if (same) { c.tip = next; return; }
    if (c.tipT < MIN_TIP && next?.tone !== 'warn' && c.tip) return;
    c.tip = next;
    c.tipT = 0;
    if (next) c.seen[next.id] = (c.seen[next.id] || 0) + 1;
  }

  // O que o desenho precisa saber (só leitura)
  function coachScene() {
    const c = app.coach;
    if (!c) return null;
    return { tip: c.tip, tipT: c.tipT, lesson: c.lesson && LESSONS[c.lesson], lessonT: c.lessonT };
  }

  // Fim de jogo na fase que ensina: a lição mais repetida vai para a tela, e a partir do segundo fim de jogo,
  // a DEMO vira um botão (opcional; a Nintendo só oferece ajuda depois do erro)
  function coachGameOver() {
    const c = app.coach;
    if (!c) return null;
    gameOvers[c.key] = (gameOvers[c.key] || 0) + 1;
    const counts = Object.entries(lessonCounts[c.key] || {}).sort((a, b) => b[1] - a[1]);
    const top = counts.find(([, n]) => n >= COACH.lessonAfter)?.[0];
    return { lesson: top ? LESSONS[top] : null, offerDemo: gameOvers[c.key] >= COACH.demoAfterGameOvers };
  }

  // Resumo para a telemetria do fim da tentativa: o treinador estava ligado e quantas vezes cada dica apareceu
  function coachSummary() {
    const c = app.coach;
    if (!c) return {};
    return { coach: true, ...Object.fromEntries(Object.entries(c.seen).map(([k, n]) => [`c_${k}`, n])) };
  }

  return { startCoach, stepCoach, updateCoach, coachScene, coachGameOver, coachSummary };
}
