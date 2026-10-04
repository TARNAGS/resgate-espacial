import { PARAMS, DEFAULT_PARAMS } from './config/params.js';
import { LEVELS, WORLDS, CHALLENGES, TRAINING_LEVEL, findLevel } from './content/worlds.js';
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
import { createIntro } from './render/intro.js';
import { createMusic } from './platform/music.js';
import { createLeaderboard } from './platform/leaderboard.js';
import { rankKey, normalizeNick, validNick } from './core/ranking.js';
import { createRankingScreen } from './ui/ranking.js';
import { createTelemetry, createFrameStats, deviceKind } from './platform/telemetry.js';
import { INTRO_SONG } from './content/songs.js';

// Resgate Espacial — ponto de entrada. Liga as partes: regras (core), conteúdo (content),
// controles (input), desenho (render), telas (ui) e aparelho (platform).

const canvas = document.getElementById('game');
const view = createView(canvas, document.getElementById('safe-probe'));
const renderer = createRenderer(canvas, view);
const events = createEvents();
connectSound(events);

// ===== Telemetria do playtest (#88, D-025) =====
const telemetry = createTelemetry({ getNick: () => app.save?.nick || null });
const attempts = {};        // tentativas por fase nesta sessão

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
  onTraining: () => startLevel(TRAINING_LEVEL),
});

// Esquema do toque pelo endereço (D-022): ?control=a (dois polegares) ou b (um polegar)
const CONTROL_FROM_URL = { a: 'twin', b: 'hold' }[(new URLSearchParams(location.search).get('control') || '').toLowerCase()];
if (CONTROL_FROM_URL) PARAMS.touchScheme = CONTROL_FROM_URL;
// Câmera mais próxima para testar (#95): ?zoom=1.3 (de 1 a 1.6)
const ZOOM_FROM_URL = Number(new URLSearchParams(location.search).get('zoom'));
if (ZOOM_FROM_URL >= 1 && ZOOM_FROM_URL <= 1.6) PARAMS.cameraZoom = ZOOM_FROM_URL;

// ===== Mensagens e efeitos ligados aos eventos da partida =====
events.on('start', ({ def }) => {
  if (def.training) renderer.message('TRAINING · LAND ON THE PAD', 4);
  else {
    renderer.message(def.goal, 5);   // o nome da fase já fica no painel (#97)
  }
  if (def.hint) renderer.message(view.isTouch ? TOUCH_HINTS[PARAMS.touchScheme] : 'HOLD ↑ TO THRUST · ←/→ TO ROTATE', 7);
});
events.on('land', ({ pad }) => {
  const m = app.match.state;
  if (m.training) renderer.message('NICE LANDING!', 2);
  else if (pad === 'base' && !m.crewOnBoard) renderer.message('REFUELED · GO GET THE CREW →', 2.5);
  else if (pad === 'fuel') renderer.message('REFUELING...', 2);
});
events.on('boarding', ({ lowFuel }) => {
  if (lowFuel) renderer.message('LOW FUEL! PLAN YOUR WAY BACK', 4, true);
  else renderer.message('CREW BOARDING...', 2);
});
events.on('crewOnBoard', () => renderer.message('CREW ON BOARD · BACK TO BASE!', 3));
events.on('praise', ({ kind, label, x, y }) => {
  renderer.praise(`${label}!`, x, y);
  if (app.run) app.run.praise[kind] = (app.run.praise[kind] || 0) + 1;
});
events.on('land', ({ pad }) => { if (app.run && pad === 'fuel') app.run.refuels += 1; });
events.on('crash', ({ reason, x, y }) => {
  const r = app.run;
  if (!r) return;
  r.crashes += 1;
  const m = app.match.state;
  telemetry.track('crash', { level: r.level, attempt: r.attempt, reason, x: Math.round(x), y: Math.round(y), crew: m.crewOnBoard, timer: m.timer });
});
events.on('complete', ({ run }) => endRun('complete', { time: run.time, livesLost: run.livesLost, fuelLeft: run.fuelLeft, perfect: run.perfectRun }));
events.on('gameOver', () => endRun('gameover'));
// Avisos de combustível (#94): pequenos, sem cobrir a fase. A nave sem combustível só para de impulsionar.
events.on('outOfFuel', ({ landed }) => { if (!landed) renderer.noFuel(); });
events.on('noFuel', ({ landed }) => renderer.noFuel(landed ? (app.match?.params().noFuelLandedSeconds ?? 2) : 1.6));
events.on('lowFuel', ({ level }) => { if (level === 'low') renderer.lowFuel(); });
events.on('crash', ({ reason, x, y }) => {
  renderer.explosion(x, y);
  renderer.message(reason, 2, true);
});
events.on('respawn', ({ lives }) => {
  if (!app.match.state.training) renderer.message(`${lives} ${lives === 1 ? 'LIFE' : 'LIVES'} LEFT`, 2);
});
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

function startRun(def, m, genMs) {
  if (def.training) { app.run = null; return; }
  attempts[def.key] = (attempts[def.key] || 0) + 1;
  app.run = {
    level: def.key, attempt: attempts[def.key], t0: performance.now(),
    crashes: 0, refuels: 0, praise: {}, frames: createFrameStats(),
  };
  telemetry.track('level_start', { level: def.key, seed: m.level.seed, attempt: app.run.attempt, genMs, tank: m.level.tankSeconds, control: app.ranControl });
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
    crew: m?.crewOnBoard ?? false, tuned: tuning.isTuned(), ...r.frames.summary(), ...praise, ...extra,
  });
  telemetry.flush();
}

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
  endRun('quit');   // se uma fase estava em andamento (recomeçar, próxima fase), ela conta como desistência
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
  endRun('quit');
  app.match = null;
  app.selected = defaultLevel(app.save);
  showScreen('menu');
}

// ===== Menu e configurações =====
function updateSoundButton() {
  screens.el('btn-sound').textContent = `SOUND: ${Sound.enabled ? 'ON' : 'OFF'}`;
  // No iPhone e no iPad, o modo silencioso também cala o jogo (D-030): avisa, para ninguém achar que o som quebrou
  screens.el('sound-help').classList.toggle('hidden', !['iphone', 'ipad'].includes(deviceKind()));
}

// Esquema do toque (#44): A, B ou C, salvo no aparelho; o endereço (?control=) tem prioridade
const SCHEMES = ['twin', 'hold'];
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

// ===== Abertura (#76) =====
const music = createMusic();
const intro = createIntro(canvas, view, { song: INTRO_SONG, music });

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
  const lv = app.selected;
  withNick(() => {
    if (app.save.seen?.intro) startLevel(lv);
    else playIntro(() => startLevel(lv));
  });
});

// ===== Nickname e ranking (#87) =====
// O nick é o ID do jogador no ranking. Fica salvo no aparelho; quem limpar os dados ou trocar de
// aparelho digita o mesmo nick e continua atualizando as mesmas linhas do ranking.
// Rodando localmente (testes no computador), o ranking fica só no aparelho, para testes nunca
// entrarem no ranking real dos jogadores. ?online no endereço liga o banco mesmo assim.
const LOCAL_HOST = /^(localhost|127.0.0.1)$/.test(location.hostname);
const leaderboard = createLeaderboard(LOCAL_HOST && !new URLSearchParams(location.search).has('online') ? { url: '' } : {});
const rankOf = (lv) => rankKey(lv, DEFAULT_PARAMS);
const RANKED = [...LEVELS, ...CHALLENGES];
const rankingScreen = createRankingScreen({
  el: screens.el, leaderboard, levels: RANKED, keyOf: rankOf, getNick: () => app.save.nick, onClick: click,
});
let afterNick = null;
let nickBack = null;

// back: para onde o BACK leva (o menu, se veio do PLAY; Settings, se veio de lá)
function askNick(then, back = toMenu) {
  afterNick = then;
  nickBack = back;
  app.screen = 'nick';
  screens.show('nick');
  const input = screens.el('nick-input');
  input.value = app.save.nick || '';
  screens.el('nick-error').textContent = '';
  setTimeout(() => input.focus(), 50);
}

function withNick(then) {
  if (app.save.nick) then();
  else askNick(then);
}

function confirmNick() {
  const input = screens.el('nick-input');
  if (!validNick(input.value)) {
    screens.el('nick-error').textContent = 'Use 3 to 12 letters or numbers.';
    return;
  }
  click();
  app.save.nick = normalizeNick(input.value);
  writeSave(app.save);
  updateNickButton();
  input.blur();
  const then = afterNick;
  afterNick = null;
  then?.();
}

function updateNickButton() {
  screens.el('btn-nickname').textContent = `PILOT: ${app.save.nick || '—'}`;
}

screens.el('btn-nick-ok').addEventListener('click', confirmNick);
screens.el('btn-nick-back').addEventListener('click', () => { click(); screens.el('nick-input').blur(); (nickBack || toMenu)(); });
screens.el('nick-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); confirmNick(); } });
screens.el('btn-nickname').addEventListener('click', () => { click(); askNick(() => showScreen('settings'), () => showScreen('settings')); });
screens.el('btn-ranking').addEventListener('click', () => {
  Sound.unlock();
  click();
  showScreen('ranking');
  leaderboard.flush();   // reenvia tempos que ficaram na fila sem internet
  telemetry.track('ranking_open', {});
  rankingScreen.show(RANKED.find((l) => l.key === app.selected.key) || RANKED[0]);
});
screens.el('btn-rank-back').addEventListener('click', () => { click(); toMenu(); });

// Ao concluir uma fase, o tempo vai para o ranking se for o melhor daquele nick naquela fase
async function submitRanking(def, run) {
  if (def.training || !app.save.nick) return;
  // O aviso só vai para a tela de resultado desta fase (a rede pode demorar e o jogador já ter seguido)
  const ov = screens.el('ov-text');
  const shown = ov.textContent;
  const note = (text) => { if (ov.textContent === shown && !screens.el('overlay').classList.contains('hidden')) ov.textContent += ` · ${text}`; };
  if (tuning.isTuned()) { note('Ranking off: tuning panel values changed'); return; }
  const r = await leaderboard.submit({ key: rankOf(def), nick: app.save.nick, time: run.time, control: app.ranControl });
  if (r.improved) note(r.online ? 'NEW BEST on the online ranking!' : r.queued ? 'New best saved; it goes online when the connection comes back' : 'New best on the ranking!');
}
// Rever a abertura: a experiência inteira, terminando na fase escolhida no mapa
screens.el('btn-intro').addEventListener('click', () => {
  Sound.unlock();
  click();
  const lv = app.selected;
  playIntro(() => startLevel(lv));
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

// ===== Laço principal (passo fixo de física) =====
const DT = 1 / 120;
let last = performance.now();
let acc = 0;

function loop(now) {
  const elapsed = Math.min(0.1, (now - last) / 1000);
  last = now;
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
    app.run?.frames.add(elapsed);
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
updateNickButton();
leaderboard.flush();
telemetry.track('session', {
  host: location.hostname,   // separa os testes locais (localhost) das partidas dos jogadores
  device: deviceKind(), touch: view.isTouch, w: window.innerWidth, h: window.innerHeight,
  dpr: window.devicePixelRatio || 1, control: PARAMS.touchScheme, sound: Sound.enabled,
  loadMs: Math.round(performance.now()), installed: window.matchMedia('(display-mode: standalone)').matches,
});
telemetry.flush();
setInterval(() => telemetry.flush(), 20000);
// Saiu do app (o jogo pausa): registra e envia a fila; a tentativa continua se ele voltar
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) return;
  if (app.run) telemetry.track('hidden', { level: app.run.level, attempt: app.run.attempt, timer: app.match?.state.timer ?? 0 });
  telemetry.flush({ keepalive: true });
});
window.addEventListener('online', () => telemetry.flush());
window.addEventListener('online', () => leaderboard.flush());   // a internet voltou: envia a fila
view.resize();
app.selected = defaultLevel(app.save);
showScreen('menu');
checkOrientation();
window.addEventListener('resize', () => { view.resize(); checkOrientation(); });
requestAnimationFrame(loop);

// Atalho para testes, só com o painel de ajuste liberado: ?level=w1-2, ?level=training ou ?level=practice
const start = new URLSearchParams(location.search).get('level');
if (start && tuning.enabled && findLevel(start)) startLevel(findLevel(start));

// Acesso para testes automáticos no navegador
window.__game = { app, PARAMS, LEVELS, startLevel, events, keyboard, joystick, renderer, intro, playIntro, music, leaderboard, rankOf, telemetry };

// ?intro no endereço abre direto na abertura, para testar. O navegador só libera o som depois de
// um toque, então a primeira tela pede o toque (TAP TO START) e aí a abertura começa com música.
if (new URLSearchParams(location.search).has('intro')) {
  const lv = app.selected;
  screens.overlay('INTRO', 'Turn the sound on (and the silent switch off on iPhone).', [
    ['TAP TO START', () => { Sound.unlock(); screens.hideOverlay(); withNick(() => playIntro(() => startLevel(lv))); }, true],
  ]);
}
