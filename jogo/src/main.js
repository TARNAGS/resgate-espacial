import { PARAMS } from './config/params.js';
import { LEVELS, WORLDS, PRACTICE_LEVEL, findLevel } from './content/worlds.js';
import { createEvents } from './core/events.js';
import { createMatch } from './core/match.js';
import { randomSeed } from './core/rng.js';
import { defaultLevel, recordCompletion, nextLevel } from './core/progress.js';
import { SCORING } from './core/scoring.js';
import { Sound, connectSound } from './platform/audio.js';
import { loadSave, writeSave, emptySave } from './platform/storage.js';
import { createKeyboard } from './input/keyboard.js';
import { createJoystick } from './input/joystick.js';
import { readIntent, TOUCH_HINTS, SCHEME_NAMES } from './input/controls.js';
import { createView } from './render/view.js';
import { createRenderer } from './render/renderer.js';
import { createScreens } from './ui/screens.js';
import { renderMap } from './ui/map.js';
import { createTuning } from './ui/tuning.js';

// Resgate Espacial — ponto de entrada. Liga as partes: regras (core), conteúdo (content),
// controles (input), desenho (render), telas (ui) e aparelho (platform).

const canvas = document.getElementById('game');
const view = createView(canvas, document.getElementById('safe-probe'));
const renderer = createRenderer(canvas, view);
const events = createEvents();
connectSound(events);

const app = {
  screen: 'menu',      // 'menu' | 'settings' | 'game'
  match: null,
  paused: false,
  thumbHintShown: false,   // a dica do polegar aparece uma vez por partida
  selected: LEVELS[0],
  save: emptySave(),
};

const click = () => Sound.click();
const screens = createScreens({ onClick: click });
const isPlaying = () => app.screen === 'game' && app.match && !app.match.state.over;
const isIdle = () => isPlaying() && !app.paused && !tuning.open;

const keyboard = createKeyboard({
  isPlaying,
  onPause: () => togglePause(),
  onTuning: () => { tuning.enable(); tuning.toggle(); },
  onAnyKey: () => Sound.unlock(),
});

// Botões desenhados no Canvas durante a partida
function hudButtons() {
  const top = 30 + view.safe.top, right = view.cssW - 34 - view.safe.right;
  const list = [{ id: 'pause', x: right, y: top, r: 20 }];
  if (tuning.enabled) list.push({ id: 'tuning', label: 'T', x: right - 50, y: top, r: 16 });
  return list;
}

const joystick = createJoystick(canvas, {
  params: PARAMS,
  view,
  isActive: () => app.screen === 'game',
  onAnyTouch: () => Sound.unlock(),
  onPress(p) {
    const hit = hudButtons().find((b) => Math.hypot(p.x - b.x, p.y - b.y) <= b.r + 8);
    if (hit?.id === 'pause') togglePause();
    if (hit?.id === 'tuning') tuning.toggle();
    return Boolean(hit) || !isIdle();
  },
});

const tuning = await createTuning({
  panel: document.getElementById('tuning'),
  onOpenChange(open) {
    keyboard.reset();
    joystick.reset();
    if (open && isPlaying() && app.paused) screens.hideOverlay();
    if (!open && isPlaying() && app.paused) showPause();
  },
  onPractice: () => startLevel(PRACTICE_LEVEL),
});

// Esquema do toque pelo endereço, para comparar sem abrir o painel (#44): ?control=a ou c
const CONTROL_FROM_URL = { a: 'hold', c: 'twin' }[(new URLSearchParams(location.search).get('control') || '').toLowerCase()];
if (CONTROL_FROM_URL) PARAMS.touchScheme = CONTROL_FROM_URL;

// ===== Mensagens e efeitos ligados aos eventos da partida =====
events.on('start', ({ def }) => {
  if (def.practice) renderer.message('PRACTICE · LAND ON THE PAD', 4);
  else {
    renderer.message(`LEVEL ${def.number} · ${def.name}`, 3);
    renderer.message(def.goal, 5);
  }
  if (def.hint) renderer.message(view.isTouch ? TOUCH_HINTS[PARAMS.touchScheme] : 'HOLD ↑ TO THRUST · ←/→ TO ROTATE', 7);
});
events.on('land', ({ pad }) => {
  const m = app.match.state;
  if (m.practice) renderer.message('NICE LANDING!', 2);
  else if (pad === 'base' && !m.crewOnBoard) renderer.message('REFUELED · GO GET THE CREW →', 2.5);
  else if (pad === 'fuel') renderer.message('REFUELING...', 2);
});
events.on('boarding', ({ lowFuel }) => {
  if (lowFuel) renderer.message('LOW FUEL! PLAN YOUR WAY BACK', 4, true);
  else renderer.message('CREW BOARDING...', 2);
});
events.on('crewOnBoard', () => renderer.message('CREW ON BOARD · BACK TO BASE!', 3));
events.on('outOfFuel', () => renderer.message('OUT OF FUEL', 2, true));
events.on('crash', ({ reason, x, y }) => {
  renderer.explosion(x, y);
  renderer.message(reason, 2, true);
});
events.on('respawn', ({ lives }) => {
  if (!app.match.state.practice) renderer.message(`${lives} ${lives === 1 ? 'LIFE' : 'LIVES'} LEFT`, 2);
});
events.on('complete', ({ def, run }) => {
  Sound.setThrust(false);
  const { isBest, prevBest } = recordCompletion(app.save, def.key, run);
  writeSave(app.save);
  const next = nextLevel(def.key);
  const buttons = [];
  if (next) buttons.push(['NEXT LEVEL', () => startLevel(next), true]);
  buttons.push(['PLAY AGAIN', () => startLevel(def), !next]);
  buttons.push(['MENU', toMenu]);
  const best = isBest ? 'NEW BEST!' : `best ${SCORING.format(prevBest)}`;
  screens.overlay('RESCUE COMPLETE', `Time ${SCORING.format(run)} · ${best} · The next run builds a new layout.`, buttons);
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
  app.match = createMatch({ def, seed, getParams: () => PARAMS, events });
  view.layout(PARAMS);
  app.paused = false;
  app.thumbHintShown = false;
  renderer.resetCamera(app.match);
  if (!def.practice) app.selected = def;
  showScreen('game');
  screens.hideOverlay();
  events.emit('start', { def, seed });
}

function showPause() {
  const { def, seed } = app.match.state;
  const buttons = [['RESUME', () => togglePause(false), true]];
  if (!def.practice) buttons.push(['RESTART', () => startLevel(def, seed)]);
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
  app.match = null;
  app.selected = defaultLevel(app.save);
  showScreen('menu');
}

// ===== Menu e configurações =====
function updateSoundButton() {
  screens.el('btn-sound').textContent = `SOUND: ${Sound.enabled ? 'ON' : 'OFF'}`;
}

// Esquema do toque (#44): A, B ou C, salvo no aparelho; o endereço (?control=) tem prioridade
const SCHEMES = ['hold', 'twin'];
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

screens.el('btn-play').addEventListener('click', () => { Sound.unlock(); click(); startLevel(app.selected); });
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
});

function checkOrientation() {
  screens.rotate(view.portrait);
  if (view.portrait && isPlaying() && !app.paused) togglePause(true);
}

// Dica do polegar (#50): no celular, se o dedo do direcional estiver em cima da plataforma
// para onde a nave vai, ensina que dá para tocar em qualquer lugar da tela.
function checkThumbHint(m) {
  const joy = joystick.state;
  if (app.thumbHintShown || !joy || m.ship.state !== 'flying' || PARAMS.joystickMode !== 'follow') return;
  const target = m.level.pads.find((p) => p.kind === (m.practice ? 'base' : m.crewOnBoard ? 'base' : 'crew'));
  const sx = view.play.x + ((target.x1 + target.x2) / 2 - renderer.camX) * view.scale;
  const sy = target.y * view.scale;
  const covered = Math.abs(joy.cx - sx) < (target.x2 - target.x1) * view.scale / 2 + PARAMS.joystickRadius
    && Math.abs(joy.cy - sy) < PARAMS.joystickRadius + 40;
  if (covered) {
    app.thumbHintShown = true;
    renderer.message(PARAMS.touchScheme === 'twin' ? 'TIP: AIM FROM ANYWHERE ON THE LEFT HALF' : 'TIP: YOUR THUMB WORKS ANYWHERE ON SCREEN', 4);
    renderer.message('LIFT IT AND TOUCH AWAY FROM THE PAD', 4);
  }
}

// ===== Laço principal (passo fixo de física) =====
const DT = 1 / 120;
let last = performance.now();
let acc = 0;

function loop(now) {
  const elapsed = Math.min(0.1, (now - last) / 1000);
  last = now;
  view.layout(PARAMS);   // o controle pode mudar pelo painel ou em Settings
  const m = app.match;
  if (app.screen === 'game' && m && !app.paused && !tuning.open) {
    const p = m.params();
    acc += elapsed;
    while (acc >= DT) {
      m.update(DT, readIntent(keyboard.keys, joystick.state, p, joystick.thrustHeld));
      renderer.update(DT, m, p);
      acc -= DT;
    }
    Sound.setThrust(m.state.ship.thrusting);
    checkThumbHint(m.state);
  } else {
    acc = 0;
  }
  renderer.draw(now, {
    match: app.screen === 'game' ? m : null,
    theme: WORLDS[0].theme,
    params: m ? m.params() : PARAMS,
    joy: joystick.state,
    joystick,
    thrustHeld: joystick.thrustHeld,
    schemeName: SCHEME_NAMES[PARAMS.touchScheme],
    idle: isIdle(),
    buttons: app.screen === 'game' ? hudButtons() : [],
    tuned: tuning.isTuned(),
  });
  requestAnimationFrame(loop);
}

// ===== Início =====
app.save = await loadSave();
Sound.enabled = app.save.settings.sound !== false;
updateSoundButton();
if (!CONTROL_FROM_URL && SCHEMES.includes(app.save.settings.touchScheme)) PARAMS.touchScheme = app.save.settings.touchScheme;
updateControlButton();
view.layout(PARAMS);
view.resize();
app.selected = defaultLevel(app.save);
showScreen('menu');
checkOrientation();
window.addEventListener('resize', () => { view.resize(); checkOrientation(); });
requestAnimationFrame(loop);

// Atalho para testes, só com o painel de ajuste liberado: ?level=w1-2 ou ?level=practice
const start = new URLSearchParams(location.search).get('level');
if (start && tuning.enabled && findLevel(start)) startLevel(findLevel(start));

// Acesso para testes automáticos no navegador
window.__game = { app, PARAMS, LEVELS, startLevel, events, keyboard, joystick, renderer };
