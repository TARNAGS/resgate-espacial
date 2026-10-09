import { PARAMS } from './config/params.js';
import { LEVELS, TRAINING_LEVEL, findLevel } from './content/worlds.js';
import { createEvents } from './core/events.js';
import { defaultLevel } from './core/progress.js';
import { Sound, connectSound } from './platform/audio.js';
import { loadSave, emptySave } from './platform/storage.js';
import { createKeyboard } from './input/keyboard.js';
import { createJoystick } from './input/joystick.js';
import { createView } from './render/view.js';
import { createRenderer } from './render/renderer.js';
import { createIntro } from './render/intro.js';
import { createScreens } from './ui/screens.js';
import { createTuning } from './ui/tuning.js';
import { createMusic } from './platform/music.js';
import { createTelemetry, deviceKind } from './platform/telemetry.js';
import { INTRO_SONG } from './content/songs.js';
import { connectMessages } from './app/messages.js';
import { createRunTelemetry } from './app/run.js';
import { createPlay } from './app/play.js';
import { createSettings } from './app/settings.js';
import { createIntroFlow } from './app/intro-flow.js';
import { createDemo } from './app/demo.js';
import { createPatchNote } from './app/patch-note.js';
import { createRanking } from './app/ranking.js';
import { connectDevice } from './app/device.js';
import { createLoop } from './app/loop.js';

// Resgate Espacial — ponto de entrada. Cria as peças (tela, desenho, eventos, telas, controles e som) e liga os
// fluxos do jogo, que ficam em app/ (#125): mensagens, telemetria da tentativa, partida, configurações, abertura,
// DEMO, patch note, ranking, aparelho e o laço principal. Os fluxos se falam pelo kit `g` (app/kit.js).

const canvas = document.getElementById('game');
const view = createView(canvas, document.getElementById('safe-probe'));
const renderer = createRenderer(canvas, view);
const events = createEvents();
connectSound(events);

// ===== Telemetria do playtest (#88, D-025) =====
const telemetry = createTelemetry({ getNick: () => app.save?.nick || null });

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

// O kit: as peças que os fluxos compartilham. Cada fluxo acrescenta as funções dele.
const g = { canvas, view, renderer, events, telemetry, app, screens, click, isPlaying, isIdle };

const keyboard = createKeyboard({
  isPlaying,
  onPause: () => g.togglePause(),
  onTuning: () => { tuning.enable(); tuning.toggle(); },
  onAnyKey: () => Sound.unlock(),
});

const joystick = createJoystick(canvas, {
  params: PARAMS,
  view,
  isActive: () => app.screen === 'game',
  onAnyTouch: () => Sound.unlock(),
  onPress(p) {
    const hit = g.hudButtons().find((b) => Math.hypot(p.x - b.x, p.y - b.y) <= b.r + 8);
    if (hit?.id === 'pause') g.togglePause();
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
    if (!open && isPlaying() && app.paused) g.showPause();
  },
  onTraining: () => g.startLevel(TRAINING_LEVEL),
});

// ===== Abertura (#76) =====
const music = createMusic();
const intro = createIntro(canvas, view, { song: INTRO_SONG, music });
Object.assign(g, { keyboard, joystick, tuning, music, intro });

// ===== Fluxos (#125) =====
// A ordem conta para quem escuta o mesmo evento: as mensagens antes da telemetria, a telemetria antes do resultado.
connectMessages(g);
Object.assign(g, createRunTelemetry(g));
Object.assign(g, createPlay(g));
Object.assign(g, createSettings(g));
Object.assign(g, createIntroFlow(g));
Object.assign(g, createDemo(g));
Object.assign(g, createPatchNote(g));
Object.assign(g, createRanking(g));
Object.assign(g, connectDevice(g));
Object.assign(g, createLoop(g));

// ===== Início =====
app.save = await loadSave();
g.applySavedSettings();
g.updateNickButton();
g.leaderboard.flush();
g.syncProfile();   // perfil do nick salvo neste aparelho (#102)
telemetry.track('session', {
  host: location.hostname,   // separa os testes locais (localhost) das partidas dos jogadores
  device: deviceKind(), touch: view.isTouch, w: window.innerWidth, h: window.innerHeight,
  dpr: window.devicePixelRatio || 1, control: PARAMS.touchScheme, sound: Sound.enabled,
  loadMs: Math.round(performance.now()), installed: window.matchMedia('(display-mode: standalone)').matches,
});
g.showPatchNote();
telemetry.flush();
setInterval(() => telemetry.flush(), 20000);
window.addEventListener('online', () => { telemetry.flush(); g.syncProfile(); });
window.addEventListener('online', () => g.leaderboard.flush());   // a internet voltou: envia a fila
view.resize();
app.selected = defaultLevel(app.save);
g.showScreen('menu');
g.checkOrientation();
window.addEventListener('resize', () => { view.resize(); g.checkOrientation(); });
requestAnimationFrame(g.loop);

// Atalho para testes, só com o painel de ajuste liberado: ?level=w1-2, ?level=training ou ?level=practice
const start = new URLSearchParams(location.search).get('level');
if (start && tuning.enabled && findLevel(start)) g.startLevel(findLevel(start));

// Acesso para testes automáticos no navegador. `kit` traz todos os fluxos; com o navegador escondido, o laço não roda
// sozinho, e dá para chamar kit.loop(performance.now()) quadro a quadro
window.__game = {
  app, PARAMS, LEVELS, startLevel: g.startLevel, events, keyboard, joystick, renderer, intro, playIntro: g.playIntro, music,
  leaderboard: g.leaderboard, rankOf: g.rankOf, telemetry, kit: g,
};

g.openIntroFromUrl();
