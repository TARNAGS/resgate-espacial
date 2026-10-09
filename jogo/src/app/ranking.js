import { PARAMS, DEFAULT_PARAMS } from '../config/params.js';
import { LEVELS, CHALLENGES } from '../content/worlds.js';
import { defaultLevel } from '../core/progress.js';
import { Sound } from '../platform/audio.js';
import { writeSave } from '../platform/storage.js';
import { createLeaderboard } from '../platform/leaderboard.js';
import { createProfileSync, mergeIntoSave } from '../platform/profile.js';
import { rankKey, normalizeNick, validNick } from '../core/ranking.js';
import { createRankingScreen } from '../ui/ranking.js';
import { late } from './kit.js';
import { SCHEMES } from './settings.js';

// Nickname, ranking online (#87) e perfil do jogador no banco (#102, D-029).

export function createRanking(g) {
  const { telemetry, app, screens, click, tuning } = g;
  const [showScreen, drawMap, toMenu, updateSoundButton, updateControlButton] = late(g, 'showScreen', 'drawMap', 'toMenu', 'updateSoundButton', 'updateControlButton');

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
      if (!g.controlFromUrl && SCHEMES.includes(app.save.settings.touchScheme)) PARAMS.touchScheme = app.save.settings.touchScheme;
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

  return { leaderboard, syncProfile, pushProfile, rankOf, withNick, askNick, updateNickButton, submitRanking };
}
