import { PARAMS, setParams } from '../config/params.js';
import { Sound } from '../platform/audio.js';
import { writeSave, emptySave } from '../platform/storage.js';
import { TOUCH_HINTS, SCHEME_NAMES } from '../input/controls.js';
import { deviceKind } from '../platform/telemetry.js';
import { late } from './kit.js';

// Configurações: som, controle de toque, câmera, apagar o progresso, o painel de ajuste escondido e os
// parâmetros pelo endereço (?control=, ?zoom=, ?skin=).

export const SCHEMES = ['twin', 'hold'];
export const CAMERA_NAMES = ['AUTO', 'CLOSE', 'CLOSER'];

export function createSettings(g) {
  const { app, screens, click, tuning } = g;
  const [showScreen, toMenu] = late(g, 'showScreen', 'toMenu');

  // Esquema do toque pelo endereço (D-022): ?control=a (dois polegares) ou b (um polegar)
  const CONTROL_FROM_URL = { a: 'twin', b: 'hold' }[(new URLSearchParams(location.search).get('control') || '').toLowerCase()];
  if (CONTROL_FROM_URL) PARAMS.touchScheme = CONTROL_FROM_URL;
  g.controlFromUrl = CONTROL_FROM_URL;
  // Zoom fixo para testar (#95): ?zoom=1.3 (de 1 a 1.6). Muda quanto se vê à frente, então a corrida sai do ranking (D-037)
  const ZOOM_FROM_URL = Number(new URLSearchParams(location.search).get('zoom'));
  if (ZOOM_FROM_URL >= 1 && ZOOM_FROM_URL <= 1.6) PARAMS.cameraZoomFixed = ZOOM_FROM_URL;
  // Skin pelo endereço (#124): ?skin=hitbox mostra as formas que batem. Só a aparência muda, e a corrida vale no ranking
  const SKIN_FROM_URL = (new URLSearchParams(location.search).get('skin') || '').toLowerCase();
  if (SKIN_FROM_URL) setParams({ skin: SKIN_FROM_URL });

  function updateSoundButton() {
    screens.el('btn-sound').textContent = `SOUND: ${Sound.enabled ? 'ON' : 'OFF'}`;
    // No iPhone e no iPad, o modo silencioso também cala o jogo (D-030): avisa, para ninguém achar que o som quebrou
    screens.el('sound-help').classList.toggle('hidden', !['iphone', 'ipad'].includes(deviceKind()));
  }

  // Esquema do toque (#44): A, B ou C, salvo no aparelho; o endereço (?control=) tem prioridade
  function updateControlButton() {
    screens.el('btn-control').textContent = `TOUCH CONTROL: ${SCHEME_NAMES[PARAMS.touchScheme]}`;
    screens.el('control-help').textContent = `TOUCH · ${TOUCH_HINTS[PARAMS.touchScheme].toLowerCase()}`;
  }
  screens.el('btn-control').addEventListener('click', () => {
    click();
    PARAMS.touchScheme = SCHEMES[(SCHEMES.indexOf(PARAMS.touchScheme) + 1) % SCHEMES.length];
    app.save.settings.touchScheme = PARAMS.touchScheme;
    writeSave(app.save);
    updateControlButton();
  });

  // Câmera (D-037): o zoom se adapta à tela, e o jogador pode aproximar (nunca afastar), salvo no aparelho
  function updateCameraButton() {
    screens.el('btn-camera').textContent = `CAMERA: ${CAMERA_NAMES[PARAMS.cameraNear]}`;
  }
  screens.el('btn-camera').addEventListener('click', () => {
    click();
    PARAMS.cameraNear = (PARAMS.cameraNear + 1) % CAMERA_NAMES.length;
    app.save.settings.cameraNear = PARAMS.cameraNear;
    writeSave(app.save);
    updateCameraButton();
  });

  screens.el('btn-settings').addEventListener('click', () => { Sound.unlock(); click(); showScreen('settings'); });
  screens.el('btn-back').addEventListener('click', () => { click(); toMenu(); });
  screens.el('btn-sound').addEventListener('click', () => {
    Sound.unlock();
    Sound.enabled = !Sound.enabled;
    app.save.settings.sound = Sound.enabled;
    writeSave(app.save);
    updateSoundButton();
    click();
  });

  let resetArmed = false;
  screens.el('btn-reset').addEventListener('click', () => {
    click();
    const btn = screens.el('btn-reset');
    if (!resetArmed) {
      resetArmed = true;
      btn.textContent = 'TAP AGAIN TO CONFIRM';
      setTimeout(() => { resetArmed = false; btn.textContent = 'RESET PROGRESS'; }, 3000);
      return;
    }
    resetArmed = false;
    app.save = { ...emptySave(), settings: app.save.settings };
    writeSave(app.save);
    btn.textContent = 'PROGRESS RESET';
    setTimeout(() => { btn.textContent = 'RESET PROGRESS'; }, 1500);
  });

  // Gesto escondido que libera o painel de ajuste: 5 toques seguidos no subtítulo
  let secretTaps = 0, secretTimer = 0;
  screens.el('subtitle').addEventListener('click', () => {
    secretTaps += 1;
    clearTimeout(secretTimer);
    secretTimer = setTimeout(() => { secretTaps = 0; }, 1500);
    if (secretTaps >= 5) {
      secretTaps = 0;
      tuning.enable();
      screens.el('subtitle').textContent = 'tuning panel unlocked · press T in game';
    }
  });

  // Configurações salvas no aparelho; o controle pelo endereço (?control=) tem prioridade
  function applySavedSettings() {
    Sound.enabled = app.save.settings.sound !== false;
    updateSoundButton();
    if (!CONTROL_FROM_URL && SCHEMES.includes(app.save.settings.touchScheme)) PARAMS.touchScheme = app.save.settings.touchScheme;
    updateControlButton();
    if (CAMERA_NAMES[app.save.settings.cameraNear]) PARAMS.cameraNear = app.save.settings.cameraNear;
    updateCameraButton();
  }

  return { updateSoundButton, updateControlButton, applySavedSettings };
}
