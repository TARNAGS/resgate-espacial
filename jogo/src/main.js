import { PARAMS, DEFAULT_PARAMS, setParams } from './config/params.js';
import { LEVELS, WORLDS, CHALLENGES, TRAINING_LEVEL, findLevel } from './content/worlds.js';
import { createEvents } from './core/events.js';
import { createMatch } from './core/match.js';
import { createDemoPilot, DEMO_LABELS, DEMO_SPEED } from './core/demo.js';
import { randomSeed } from './core/rng.js';
import { defaultLevel, recordCompletion, nextLevel } from './core/progress.js';
import { SCORING } from './core/scoring.js';
import { Sound, connectSound } from './platform/audio.js';
import { loadSave, writeSave, emptySave } from './platform/storage.js';
import { createKeyboard } from './input/keyboard.js';
import { createJoystick } from './input/joystick.js';
import { readIntent, TOUCH_HINTS, SCHEME_NAMES } from './input/controls.js';
import { createView, cameraZoomFor } from './render/view.js';
import { createRenderer } from './render/renderer.js';
import { createScreens } from './ui/screens.js';
import { renderMap } from './ui/map.js';
import { createTuning } from './ui/tuning.js';
import { createIntro } from './render/intro.js';
import { createMusic } from './platform/music.js';
import { createLeaderboard } from './platform/leaderboard.js';
import { createProfileSync, mergeIntoSave } from './platform/profile.js';
import { rankKey, normalizeNick, validNick } from './core/ranking.js';
import { createRankingScreen } from './ui/ranking.js';
import { createTelemetry, createFrameStats, createRunTracker, deviceKind, BUILD } from './platform/telemetry.js';
import { INTRO_SONG } from './content/songs.js';
import { PATCH_NOTES } from './content/patchnotes.js';
import { patchNoteFor, patchNoteKey } from './core/patchnote.js';

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
  screen: 'menu',      // 'menu' | 'settings' | 'game' | 'intro' | 'demo'
  match: null,
  demo: null,          // a DEMO na tela (#104)
  attract: null,       // a DEMO passando atrás do menu parado (#105)
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
// Zoom fixo para testar (#95): ?zoom=1.3 (de 1 a 1.6). Muda quanto se vê à frente, então a corrida sai do ranking (D-037)
const ZOOM_FROM_URL = Number(new URLSearchParams(location.search).get('zoom'));
if (ZOOM_FROM_URL >= 1 && ZOOM_FROM_URL <= 1.6) PARAMS.cameraZoomFixed = ZOOM_FROM_URL;
// Skin pelo endereço (#124): ?skin=hitbox mostra as formas que batem. Só a aparência muda, e a corrida vale no ranking
const SKIN_FROM_URL = (new URLSearchParams(location.search).get('skin') || '').toLowerCase();
if (SKIN_FROM_URL) setParams({ skin: SKIN_FROM_URL });

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

// Câmera (D-037): o zoom se adapta à tela, e o jogador pode aproximar (nunca afastar), salvo no aparelho
const CAMERA_NAMES = ['AUTO', 'CLOSE', 'CLOSER'];
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
  closePatchNote('play');
  const lv = app.selected;
  withNick(() => {
    if (app.save.seen?.intro) startWithDemo(lv);
    else playIntro(() => startWithDemo(lv));
  });
});

// ===== DEMO (#104) e attract mode (#105), D-031 =====
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
  if (app.screen !== 'menu' || document.hidden || patchNote) { stopAttract(false); return; }
  menuIdle += elapsed;
  if (!app.attract && menuIdle > ATTRACT_IDLE) {
    app.attract = createDemoRun();
    if (app.attract) telemetry.track('attract', { action: 'start' });
  }
  if (app.attract && stepDemo(app.attract, elapsed)) app.attract = createDemoRun();   // recomeça
}

// ===== Patch note (#126) =====
// Uma linha no alto do menu com o que mudou na versão, para quem já jogava. Fecha no SKIP ou no PLAY e
// não volta naquela versão; as regras de quando aparece ficam em core/patchnote.js.
let patchNote = null;   // o texto na tela, enquanto o jogador não fecha
function showPatchNote() {
  patchNote = patchNoteFor(app.save, BUILD, PATCH_NOTES);
  screens.patchNote(patchNote);
  if (patchNote) telemetry.track('patch_note', { action: 'show', build: BUILD });
  else if (app.save.build !== BUILD) { app.save.build = BUILD; writeSave(app.save); }
}
function closePatchNote(action) {
  if (!patchNote) return;
  patchNote = null;
  screens.patchNote(null);
  app.save.seen[patchNoteKey(BUILD)] = true;
  app.save.build = BUILD;
  writeSave(app.save);
  pushProfile();
  telemetry.track('patch_note', { action, build: BUILD });
}
screens.el('btn-patch-skip').addEventListener('click', () => { click(); closePatchNote('skip'); });

// ===== Nickname e ranking (#87) =====
// O nick é o ID do jogador no ranking. Fica salvo no aparelho; quem limpar os dados ou trocar de
// aparelho digita o mesmo nick e continua atualizando as mesmas linhas do ranking.
// Rodando localmente (testes no computador), o ranking fica só no aparelho, para testes nunca
// entrarem no ranking real dos jogadores. ?online no endereço liga o banco mesmo assim.
const LOCAL_HOST = /^(localhost|127.0.0.1)$/.test(location.hostname);
const leaderboard = createLeaderboard(LOCAL_HOST && !new URLSearchParams(location.search).has('online') ? { url: '' } : {});

// Perfil do jogador no banco (#102, D-029): progresso, configurações, telas vistas e elogios, ligados ao
// nick. Como o ranking, fica fora do banco real nos testes no computador (?online liga).
const profileSync = createProfileSync(LOCAL_HOST && !new URLSearchParams(location.search).has('online') ? { url: '' } : {});
async function syncProfile() {
  const nick = app.save.nick;
  if (!nick || !profileSync.online) return;
  const remote = await profileSync.pull(nick);
  if (remote && app.save.nick === nick) {
    app.save = mergeIntoSave(app.save, remote);
    writeSave(app.save);
    Sound.enabled = app.save.settings.sound !== false;
    updateSoundButton();
    if (!CONTROL_FROM_URL && SCHEMES.includes(app.save.settings.touchScheme)) PARAMS.touchScheme = app.save.settings.touchScheme;
    updateControlButton();
    if (app.screen === 'menu') { app.selected = defaultLevel(app.save); drawMap(); }
  }
  await profileSync.push(nick, app.save);
}
const pushProfile = () => { if (app.save.nick) setTimeout(() => profileSync.push(app.save.nick, app.save), 0); };
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
  syncProfile();   // traz o progresso desse nick de outro aparelho e envia o deste
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

// ===== Início =====
app.save = await loadSave();
Sound.enabled = app.save.settings.sound !== false;
updateSoundButton();
if (!CONTROL_FROM_URL && SCHEMES.includes(app.save.settings.touchScheme)) PARAMS.touchScheme = app.save.settings.touchScheme;
updateControlButton();
if (CAMERA_NAMES[app.save.settings.cameraNear]) PARAMS.cameraNear = app.save.settings.cameraNear;
updateCameraButton();
updateNickButton();
leaderboard.flush();
syncProfile();   // perfil do nick salvo neste aparelho (#102)
telemetry.track('session', {
  host: location.hostname,   // separa os testes locais (localhost) das partidas dos jogadores
  device: deviceKind(), touch: view.isTouch, w: window.innerWidth, h: window.innerHeight,
  dpr: window.devicePixelRatio || 1, control: PARAMS.touchScheme, sound: Sound.enabled,
  loadMs: Math.round(performance.now()), installed: window.matchMedia('(display-mode: standalone)').matches,
});
showPatchNote();
telemetry.flush();
setInterval(() => telemetry.flush(), 20000);
// Saiu do app (o jogo pausa): registra e envia a fila; a tentativa continua se ele voltar
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) return;
  if (app.run) telemetry.track('hidden', { level: app.run.level, attempt: app.run.attempt, timer: app.match?.state.timer ?? 0 });
  telemetry.flush({ keepalive: true });
});
// Fechou o app no meio da fase: a tentativa termina como "fechou" (#91)
window.addEventListener('pagehide', () => { endRun('close'); telemetry.flush({ keepalive: true }); });
window.addEventListener('online', () => { telemetry.flush(); syncProfile(); });
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
