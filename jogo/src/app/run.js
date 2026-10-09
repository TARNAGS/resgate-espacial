import { PARAMS } from '../config/params.js';
import { writeSave } from '../platform/storage.js';
import { cameraZoomFor } from '../render/view.js';
import { createFrameStats, createRunTracker } from '../platform/telemetry.js';
import { late } from './kit.js';

// Telemetria de cada tentativa (#88, #91, D-025 e D-029): começo, pousos, batidas, elogios, trajetória e fim,
// e o envio da fila quando o jogador sai do app.

export function createRunTelemetry(g) {
  const { view, renderer, events, telemetry, app, tuning } = g;
  const [pushProfile] = late(g, 'pushProfile');

  const attempts = {};        // tentativas por fase nesta sessão
  events.on('praise', ({ kind, x, y }) => {
    const r = app.run;
    if (!r) return;
    r.praise[kind] = (r.praise[kind] || 0) + 1;
    telemetry.track('praise', { level: r.level, attempt: r.attempt, kind, x: Math.round(x), y: Math.round(y) });
  });
  const deg = (a) => Math.round((a * 180) / Math.PI);
  // Cada pouso (#91, D-029): plataforma, combustível que sobrou, propulsor e tempo do trecho, e o impacto
  events.on('land', ({ pad, impact }) => {
    const r = app.run;
    if (!r) return;
    if (pad === 'fuel') r.refuels += 1;
    const m = app.match.state;
    telemetry.track('land', {
      level: r.level, attempt: r.attempt, pad, fuel: m.ship.fuel, crew: m.crewOnBoard, timer: m.timer,
      ...r.tracker.land(), vx: impact.vx, vy: impact.vy, angle: deg(impact.angle),
    });
  });
  events.on('crash', ({ reason, x, y, vx, vy, a }) => {
    const r = app.run;
    if (!r) return;
    r.crashes += 1;
    r.tracker.land();   // o trecho acaba na batida
    const m = app.match.state;
    telemetry.track('crash', {
      level: r.level, attempt: r.attempt, reason, x: Math.round(x), y: Math.round(y), crew: m.crewOnBoard, timer: m.timer,
      vx, vy, angle: deg(a), fuel: m.ship.fuel,
      // a previsão de pouso estava verde no último quadro? (só quando a nave descia para uma plataforma)
      ...(renderer.approach?.landing ? { green: renderer.approach.safe } : {}),
    });
  });
  events.on('complete', ({ run }) => endRun('complete', { time: run.time, livesLost: run.livesLost, fuelLeft: run.fuelLeft, perfect: run.perfectRun }));
  events.on('gameOver', () => endRun('gameover'));

  function startRun(def, m, genMs) {
    if (def.training) { app.run = null; return; }
    attempts[def.key] = (attempts[def.key] || 0) + 1;
    app.run = {
      level: def.key, attempt: attempts[def.key], t0: performance.now(),
      crashes: 0, refuels: 0, praise: {}, frames: createFrameStats(), tracker: createRunTracker(),
    };
    telemetry.track('level_start', {
      level: def.key, seed: m.level.seed, attempt: app.run.attempt, genMs, tank: m.level.tankSeconds, control: app.ranControl,
      w: window.innerWidth, h: window.innerHeight,   // a tela durante a fase, não só ao carregar o jogo
      zoom: Number(cameraZoomFor(view, PARAMS).toFixed(2)), near: PARAMS.cameraNear,   // a câmera usada (D-037)
    });
  }

  // Fim de uma tentativa: concluiu, perdeu as vidas ou desistiu. Resume a partida num evento só.
  function endRun(outcome, extra = {}) {
    const r = app.run;
    if (!r) return;
    app.run = null;
    const m = app.match?.state;
    const praise = Object.fromEntries(Object.entries(r.praise).map(([k, n]) => [`p_${k}`, n]));
    telemetry.track('level_end', {
      level: r.level, attempt: r.attempt, outcome, durS: (performance.now() - r.t0) / 1000,
      timer: m?.timer ?? 0, crashes: r.crashes, refuels: r.refuels, control: app.ranControl,
      crew: m?.crewOnBoard ?? false, tuned: tuning.isTuned(), ...r.frames.summary(), ...r.tracker.summary(), ...praise, ...extra,
    });
    // A trajetória da tentativa, em pedaços curtos (#91, D-029)
    r.tracker.pathChunks().forEach((p, i) => telemetry.track('path', { level: r.level, attempt: r.attempt, i, p }));
    telemetry.flush();
    // Elogios do jogador, somados no perfil (#102); o perfil vai para o banco depois do resultado da fase
    for (const [kind, n] of Object.entries(r.praise)) app.save.praise[kind] = (app.save.praise[kind] || 0) + n;
    writeSave(app.save);
    pushProfile();
  }

  // Saiu do app (o jogo pausa): registra e envia a fila; a tentativa continua se ele voltar
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    if (app.run) telemetry.track('hidden', { level: app.run.level, attempt: app.run.attempt, timer: app.match?.state.timer ?? 0 });
    telemetry.flush({ keepalive: true });
  });
  // Fechou o app no meio da fase: a tentativa termina como "fechou" (#91)
  window.addEventListener('pagehide', () => { endRun('close'); telemetry.flush({ keepalive: true }); });

  return { startRun, endRun };
}
