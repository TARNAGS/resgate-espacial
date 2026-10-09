import { PARAMS } from '../config/params.js';
import { LEVELS } from '../content/worlds.js';
import { createEvents } from '../core/events.js';
import { createMatch } from '../core/match.js';
import { createDemoPilot, DEMO_SPEED } from '../core/demo.js';
import { Sound } from '../platform/audio.js';
import { writeSave } from '../platform/storage.js';
import { late } from './kit.js';
import { DT } from './loop.js';

// DEMO (#104) e attract mode (#105), D-031: o nível 1 jogado pelo piloto expert, na tela ou atrás do menu parado.

export function createDemo(g) {
  const { view, renderer, telemetry, app, screens, click, keyboard, joystick } = g;
  const [startLevel, toMenu, patchNoteShown] = late(g, 'startLevel', 'toMenu', 'patchNoteShown');

  // Uma partida do nível 1 jogada pelo piloto expert. Na DEMO, ela ocupa a tela, com o selo, os rótulos
  // e os polegares fantasmas; no attract mode, passa escurecida atrás do menu parado.
  function createDemoRun() {
    const def = LEVELS[0];
    const match = createMatch({ def, seed: def.seed, getParams: () => PARAMS, events: createEvents() });
    const pilot = createDemoPilot(match);
    if (!pilot) return null;
    renderer.resetCamera(match, match.params());
    return { match, pilot, t: 0, acc: 0, endT: 0 };
  }

  // Avança a corrida, acelerada; devolve true quando ela acabou (com uma pausa curta no fim)
  function stepDemo(run, elapsed) {
    const p = run.match.params();
    run.acc += elapsed * DEMO_SPEED;
    while (run.acc >= DT) {
      run.match.update(DT, run.pilot.next());
      renderer.update(DT, run.match, p);
      run.acc -= DT;
    }
    run.t += elapsed;
    if (run.pilot.done) run.endT += elapsed;
    return run.endT > 0.8;
  }

  // Polegar fantasma do direcional (controle A): aponta para onde o piloto está apontando
  function ghostJoy(input) {
    if (!view.isTouch || PARAMS.touchScheme !== 'twin' || input.targetAngle == null) return null;
    const c = joystick.fixedCenter();
    const R = PARAMS.joystickRadius * 0.7;
    return { cx: c.x, cy: c.y, x: c.x + Math.sin(input.targetAngle) * R, y: c.y - Math.cos(input.targetAngle) * R };
  }

  function playDemo(source, then) {
    stopAttract(false);
    const run = createDemoRun();
    if (!run) { then(); return; }
    app.demo = { ...run, source, then };
    app.screen = 'demo';
    screens.show('demo');
    joystick.reset();
    keyboard.reset();
    Sound.setThrust(false);
  }

  function endDemo(skipped) {
    const d = app.demo;
    if (!d) return;
    app.demo = null;
    telemetry.track('demo', { source: d.source, skipped, at: d.t });
    app.save.seen = { ...app.save.seen, demo: true };
    writeSave(app.save);
    d.then();
  }

  // A primeira partida do nível 1 vem depois da DEMO; as outras, direto
  function startWithDemo(lv) {
    if (lv.key === LEVELS[0].key && !app.save.seen?.demo) playDemo('auto', () => startLevel(lv));
    else startLevel(lv);
  }

  screens.el('demo').addEventListener('click', () => { click(); endDemo(true); });
  screens.el('btn-demo').addEventListener('click', () => { Sound.unlock(); click(); playDemo('button', toMenu); });
  window.addEventListener('keydown', (e) => {
    if (app.screen !== 'demo') return;
    e.preventDefault();
    endDemo(true);
  });

  // Attract mode: com o menu parado por alguns segundos, a DEMO passa ao fundo, como nos arcades.
  // Qualquer toque ou tecla devolve o menu na hora, e esse toque não aciona botão nenhum.
  const ATTRACT_IDLE = 8;
  let menuIdle = 0;
  let swallowClickUntil = 0;
  function stopAttract(interrupted) {
    menuIdle = 0;
    if (!app.attract) return;
    if (interrupted) telemetry.track('attract', { action: 'stop', at: app.attract.t });
    app.attract = null;
  }
  window.addEventListener('pointerdown', (e) => {
    menuIdle = 0;
    if (!app.attract) return;
    stopAttract(true);
    e.preventDefault();
    e.stopPropagation();
    swallowClickUntil = performance.now() + 700;
  }, { capture: true });
  window.addEventListener('click', (e) => {
    if (performance.now() > swallowClickUntil) return;
    swallowClickUntil = 0;
    e.preventDefault();
    e.stopPropagation();
  }, { capture: true });
  window.addEventListener('keydown', (e) => {
    menuIdle = 0;
    if (!app.attract) return;
    stopAttract(true);
    e.preventDefault();
    e.stopImmediatePropagation();
  }, { capture: true });

  function updateAttract(elapsed) {
    // Com o patch note na tela, a DEMO espera ele ser fechado (#126)
    if (app.screen !== 'menu' || document.hidden || patchNoteShown()) { stopAttract(false); return; }
    menuIdle += elapsed;
    if (!app.attract && menuIdle > ATTRACT_IDLE) {
      app.attract = createDemoRun();
      if (app.attract) telemetry.track('attract', { action: 'start' });
    }
    if (app.attract && stepDemo(app.attract, elapsed)) app.attract = createDemoRun();   // recomeça
  }

  return { stepDemo, ghostJoy, playDemo, endDemo, startWithDemo, updateAttract, stopAttract };
}
