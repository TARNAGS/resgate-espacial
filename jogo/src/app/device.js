import { Sound } from '../platform/audio.js';
import { late } from './kit.js';

// O aparelho: toque sem rolar nem dar zoom, pausa automática ao sair do app e o aviso para girar o celular.

export function connectDevice(g) {
  const { canvas, view, app, screens, isPlaying, keyboard, joystick } = g;
  const [togglePause] = late(g, 'togglePause');

  // ===== Toque sem rolar, sem zoom e sem menu (#40) =====
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  for (const type of ['gesturestart', 'gesturechange', 'gestureend', 'dblclick']) {
    document.addEventListener(type, (e) => e.preventDefault(), { passive: false });
  }
  document.addEventListener('touchmove', (e) => {
    // Só deixa rolar dentro das telas em HTML (menu baixo no celular); nunca no jogo
    if (!e.target.closest('.screen, .tuning')) e.preventDefault();
  }, { passive: false });

  // ===== Pausa automática e orientação =====
  window.addEventListener('blur', () => { keyboard.reset(); joystick.reset(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isPlaying() && !app.paused) togglePause(true);
    if (!document.hidden) Sound.wake();   // voltou ao jogo: retoma o som, se o navegador deixar (#103)
  });

  function checkOrientation() {
    screens.rotate(view.portrait);
    if (view.portrait && isPlaying() && !app.paused) togglePause(true);
  }

  return { checkOrientation };
}
