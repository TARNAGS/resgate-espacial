import { writeSave } from '../platform/storage.js';
import { BUILD } from '../platform/telemetry.js';
import { PATCH_NOTES } from '../content/patchnotes.js';
import { patchNoteFor, patchNoteKey } from '../core/patchnote.js';
import { late } from './kit.js';

// Patch note (#126): uma linha no alto do menu com o que mudou na versão.

export function createPatchNote(g) {
  const { telemetry, app, screens, click } = g;
  const [pushProfile] = late(g, 'pushProfile');

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
  const patchNoteShown = () => Boolean(patchNote);

  return { showPatchNote, closePatchNote, patchNoteShown };
}
