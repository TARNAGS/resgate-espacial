import { PARAMS } from '../config/params.js';
import { TOUCH_HINTS } from '../input/controls.js';

// Mensagens e efeitos na tela ligados aos eventos da partida: objetivo, pousos, embarque, elogios, avisos de
// combustível, batidas e vidas. O vídeo de apresentação repete parte delas (jogo/ferramentas/video/video.js).

export function connectMessages(g) {
  const { view, renderer, events, app } = g;

  // ===== Mensagens e efeitos ligados aos eventos da partida =====
  // Com o treinador ligado (D-038, app/coach.js), o objetivo e os controles vão para perto da nave, na hora
  // em que servem; a faixa do alto fica só com os avisos
  events.on('start', ({ def }) => {
    if (app.coach) return;
    if (def.training) renderer.message('TRAINING · LAND ON THE PAD', 4);
    else {
      renderer.message(def.goal, 5);   // o nome da fase já fica no painel (#97)
    }
    if (def.hint) renderer.message(view.isTouch ? TOUCH_HINTS[PARAMS.touchScheme] : 'HOLD ↑ TO THRUST · ←/→ TO ROTATE', 7);
  });
  events.on('land', ({ pad }) => {
    const m = app.match.state;
    if (m.training) renderer.message('NICE LANDING!', 2);
    else if (app.coach) return;
    else if (pad === 'base' && !m.crewOnBoard) renderer.message('REFUELED · GO GET THE CREW →', 2.5);
    else if (pad === 'fuel') renderer.message('REFUELING...', 2);
  });
  events.on('boarding', ({ lowFuel }) => {
    if (lowFuel) renderer.message('LOW FUEL! PLAN YOUR WAY BACK', 4, true);
    else if (!app.coach) renderer.message('CREW BOARDING...', 2);
  });
  events.on('crewOnBoard', () => { if (!app.coach) renderer.message('CREW ON BOARD · BACK TO BASE!', 3); });
  events.on('praise', ({ label, x, y }) => renderer.praise(`${label}!`, x, y));
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
}
