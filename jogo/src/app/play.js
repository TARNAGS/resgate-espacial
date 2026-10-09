import { PARAMS } from '../config/params.js';
import { createMatch } from '../core/match.js';
import { randomSeed } from '../core/rng.js';
import { defaultLevel, recordCompletion, nextLevel } from '../core/progress.js';
import { SCORING } from '../core/scoring.js';
import { Sound } from '../platform/audio.js';
import { writeSave } from '../platform/storage.js';
import { renderMap } from '../ui/map.js';
import { late } from './kit.js';

// A partida e as telas em volta dela: começar uma fase, pausar, resultado (concluiu ou perdeu), voltar ao menu,
// os botões na tela durante a fase e a dica do polegar.

export function createPlay(g) {
  const { view, renderer, events, app, screens, click, isPlaying, keyboard, joystick, tuning } = g;
  const [startRun, endRun, submitRanking] = late(g, 'startRun', 'endRun', 'submitRanking');

  // Botões desenhados no Canvas durante a partida
  function hudButtons() {
    const top = 30 + view.safe.top, right = view.cssW - 34 - view.safe.right;
    const list = [{ id: 'pause', x: right, y: top, r: 20 }];
    if (tuning.enabled) list.push({ id: 'tuning', label: 'T', x: right - 50, y: top, r: 16 });
    return list;
  }

  // Resultado da fase
  events.on('complete', ({ def, run }) => {
    Sound.setThrust(false);
    submitRanking(def, run);
    const { isBest, prevBest } = recordCompletion(app.save, def.key, run);
    writeSave(app.save);
    const next = nextLevel(def.key);
    const buttons = [];
    if (next) buttons.push(['NEXT LEVEL', () => startLevel(next), true]);
    buttons.push(['PLAY AGAIN', () => startLevel(def), !next]);
    buttons.push(['MENU', toMenu]);
    const best = isBest ? 'NEW BEST!' : `best ${SCORING.format(prevBest)}`;
    const perfect = run.perfectRun ? 'PERFECT RUN: one refuel, no lives lost! · ' : '';
    const newLayout = def.random ? ' · The next run builds a new layout.' : '';
    screens.overlay('RESCUE COMPLETE', `${perfect}Time ${SCORING.format(run)} · ${best}${newLayout}`, buttons);
  });
  events.on('gameOver', ({ def, seed }) => {
    Sound.setThrust(false);
    screens.overlay('GAME OVER', 'No lives left. Try the same layout again or go back to the map.', [
      ['TRY AGAIN', () => startLevel(def, seed), true],
      ['MENU', toMenu],
    ]);
  });

  // ===== Fluxo =====
  function showScreen(name) {
    app.screen = name;
    screens.show(name);
    if (name === 'menu') drawMap();
    joystick.reset();
    keyboard.reset();
    Sound.setThrust(false);
  }

  function drawMap() {
    renderMap(screens.el('map'), screens.el('level-info'), {
      save: app.save,
      selected: app.selected,
      onSelect(lv) { click(); app.selected = lv; drawMap(); },
    });
  }

  function startLevel(def, seed = randomSeed()) {
    // Se uma fase estava em andamento, ela termina como recomeço (a mesma fase) ou troca de fase (#91)
    endRun(app.run?.level === def.key ? 'restart' : 'switch');
    app.ranControl = view.isTouch ? PARAMS.touchScheme : 'keys';
    if (def.seed != null) seed = def.seed;   // fases fixas: o mesmo cenário para todos (D-021)
    const t0 = performance.now();
    app.match = createMatch({ def, seed, getParams: () => PARAMS, events });
    startRun(def, app.match.state, Math.round(performance.now() - t0));
    app.paused = false;
    app.thumbHintShown = false;
    renderer.resetCamera(app.match, app.match.params());
    if (!def.training) app.selected = def;
    showScreen('game');
    screens.hideOverlay();
    events.emit('start', { def, seed });
  }

  function showPause() {
    const { def, seed } = app.match.state;
    const buttons = [['RESUME', () => togglePause(false), true]];
    if (!def.training) buttons.push(['RESTART', () => startLevel(def, seed)]);
    buttons.push(['MENU', toMenu]);
    screens.overlay('PAUSED', '', buttons);
  }

  function togglePause(force) {
    if (!isPlaying()) return;
    app.paused = force ?? !app.paused;
    joystick.reset();
    Sound.setThrust(false);
    if (app.paused) showPause();
    else { screens.hideOverlay(); tuning.toggle(false); }
  }

  function toMenu() {
    endRun('menu');
    app.match = null;
    app.selected = defaultLevel(app.save);
    showScreen('menu');
  }

  // Dica do polegar (#50): no celular, se o dedo do direcional estiver em cima da plataforma
  // para onde a nave vai, ensina que dá para tocar em qualquer lugar da tela.
  function checkThumbHint(m) {
    const joy = joystick.state;
    if (app.thumbHintShown || !joy || m.ship.state !== 'flying' || PARAMS.joystickMode !== 'follow') return;
    const target = m.level.pads.find((p) => p.kind === (m.training ? 'base' : m.crewOnBoard ? 'base' : 'crew'));
    const { x: sx, y: sy } = renderer.toScreen((target.x1 + target.x2) / 2, target.y);
    const covered = Math.abs(joy.cx - sx) < (target.x2 - target.x1) * renderer.scale() / 2 + PARAMS.joystickRadius
      && Math.abs(joy.cy - sy) < PARAMS.joystickRadius + 40;
    if (covered) {
      app.thumbHintShown = true;
      renderer.message(PARAMS.touchScheme === 'twin' ? 'TIP: AIM FROM ANYWHERE ON THE LEFT HALF' : 'TIP: YOUR THUMB WORKS ANYWHERE ON SCREEN', 4);
      renderer.message('LIFT IT AND TOUCH AWAY FROM THE PAD', 4);
    }
  }

  return { hudButtons, showScreen, drawMap, startLevel, showPause, togglePause, toMenu, checkThumbHint };
}
