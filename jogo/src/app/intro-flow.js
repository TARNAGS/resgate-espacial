import { Sound } from '../platform/audio.js';
import { writeSave } from '../platform/storage.js';
import { INTRO_SONG } from '../content/songs.js';
import { late } from './kit.js';

// Abertura (#76) e o PLAY do menu: no primeiro PLAY, a abertura vem antes da fase.

export function createIntroFlow(g) {
  const { telemetry, app, screens, click, joystick, music, intro } = g;
  const [startLevel, startWithDemo, closePatchNote, withNick] = late(g, 'startLevel', 'startWithDemo', 'closePatchNote', 'withNick');

  // Mostra a abertura e, no fim (ou no SKIP), segue para `then`. A música é o relógio da abertura:
  // as telas trocam com ela, e o fade final leva para a fase junto com o último acorde.
  function playIntro(then) {
    app.screen = 'intro';
    screens.show('intro');
    joystick.reset();
    music.play(INTRO_SONG);
    intro.start({
      onDone() {
        if (intro.pos >= 96) telemetry.track('intro', { skipped: false });
        music.stop(0.3);
        app.save.seen = { ...app.save.seen, intro: true };
        writeSave(app.save);
        then();
      },
    });
  }

  screens.el('intro').addEventListener('click', () => intro.next());
  screens.el('btn-skip').addEventListener('click', (e) => {
    e.stopPropagation();
    click();
    telemetry.track('intro', { skipped: true, scene: intro.scene + 1 });
    intro.skip();
  });
  window.addEventListener('keydown', (e) => {
    if (app.screen !== 'intro') return;
    e.preventDefault();
    if (e.code === 'Escape') intro.skip();
    else intro.next();
  });

  // No primeiro PLAY, a abertura vem antes da fase; depois, só pelo botão em Settings
  screens.el('btn-play').addEventListener('click', () => {
    Sound.unlock();
    click();
    closePatchNote('play');
    const lv = app.selected;
    withNick(() => {
      if (app.save.seen?.intro) startWithDemo(lv);
      else playIntro(() => startWithDemo(lv));
    });
  });

  // Rever a abertura: a experiência inteira, terminando na fase escolhida no mapa
  screens.el('btn-intro').addEventListener('click', () => {
    Sound.unlock();
    click();
    const lv = app.selected;
    playIntro(() => startLevel(lv));
  });

  // ?intro no endereço abre direto na abertura, para testar. O navegador só libera o som depois de
  // um toque, então a primeira tela pede o toque (TAP TO START) e aí a abertura começa com música.
  function openIntroFromUrl() {
    if (new URLSearchParams(location.search).has('intro')) {
      const lv = app.selected;
      screens.overlay('INTRO', 'Turn the sound on (and the silent switch off on iPhone).', [
        ['TAP TO START', () => { Sound.unlock(); screens.hideOverlay(); withNick(() => playIntro(() => startLevel(lv))); }, true],
      ]);
    }
  }

  return { playIntro, openIntroFromUrl };
}
