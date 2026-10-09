import { PARAMS } from '../config/params.js';
import { WORLDS } from '../content/worlds.js';
import { DEMO_LABELS } from '../core/demo.js';
import { Sound } from '../platform/audio.js';
import { readIntent, SCHEME_NAMES } from '../input/controls.js';
import { late } from './kit.js';

// Laço principal (passo fixo de física): atualiza a partida, a DEMO e o attract mode e desenha o quadro.

export const DT = 1 / 120;   // passo fixo da física

export function createLoop(g) {
  const { view, renderer, app, isIdle, keyboard, joystick, tuning, intro } = g;
  const [hudButtons, checkThumbHint, stepDemo, ghostJoy, endDemo, updateAttract] = late(g, 'hudButtons', 'checkThumbHint', 'stepDemo', 'ghostJoy', 'endDemo', 'updateAttract');

  // ===== Laço principal (passo fixo de física) =====
  let last = performance.now();
  let acc = 0;

  function loop(now) {
    const raw = (now - last) / 1000;              // o quadro de verdade, para medir engasgos (#91)
    const elapsed = Math.min(0.1, raw);
    last = now;
    const m = app.match;
    if (app.screen === 'game' && m && !app.paused && !tuning.open) {
      const p = m.params();
      acc += elapsed;
      while (acc >= DT) {
        const intent = readIntent(keyboard.keys, joystick.state, p, joystick.thrustHeld);
        m.update(DT, intent);
        app.run?.tracker.step(DT, m.state.ship, intent.thrust);
        renderer.update(DT, m, p);
        acc -= DT;
      }
      Sound.setThrust(m.state.ship.thrusting);
      app.run?.frames.add(raw);
      if (keyboard.keys.left || keyboard.keys.right || keyboard.keys.thrust) app.ranControl = 'keys';
      checkThumbHint(m.state);
    } else {
      acc = 0;
    }
    if (app.screen === 'intro') {
      intro.update(elapsed);
      intro.draw(now);
      requestAnimationFrame(loop);
      return;
    }
    if (app.screen === 'demo' && app.demo && stepDemo(app.demo, elapsed)) endDemo(false);
    updateAttract(elapsed);
    const demo = app.screen === 'demo' ? app.demo : null;
    const shown = app.screen === 'game' ? m : (demo || app.attract)?.match ?? null;
    const ghost = demo?.pilot.input;
    renderer.draw(now, {
      match: shown,
      theme: WORLDS[0].theme,
      params: shown ? shown.params() : PARAMS,
      joy: ghost ? ghostJoy(ghost) : joystick.state,
      joystick,
      thrustHeld: ghost ? ghost.thrust : joystick.thrustHeld,
      schemeName: SCHEME_NAMES[PARAMS.touchScheme],
      idle: isIdle(),
      buttons: app.screen === 'game' ? hudButtons() : [],
      tuned: tuning.isTuned(),
      demo: demo && { label: DEMO_LABELS[demo.pilot.label], thrust: ghost.thrust, twin: view.isTouch && PARAMS.touchScheme === 'twin' },
      attract: Boolean(app.attract) && app.screen === 'menu',
    });
    requestAnimationFrame(loop);
  }

  return { loop };
}
