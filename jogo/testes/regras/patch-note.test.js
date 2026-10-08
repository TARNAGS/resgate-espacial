// Patch note (#126)

import { test, assert, emptySave } from '../lib.js';
import { PATCH_NOTES, PATCH_NOTE_MAX } from '../../src/content/patchnotes.js';
import { patchNoteFor, patchNoteKey } from '../../src/core/patchnote.js';

const NOTES = { v2: 'NEW: something', v3: 'NEW: more things' };
const played = (build) => ({ ...emptySave(), build });

test('#126 patch note: aparece para quem jogava a versão anterior, uma vez por versão', () => {
  assert.equal(patchNoteFor(played('v1'), 'v2', NOTES), 'NEW: something');
  const closed = { ...played('v2'), seen: { [patchNoteKey('v2')]: true } };
  assert.equal(patchNoteFor(closed, 'v2', NOTES), null, 'depois de fechada, a linha não volta');
  assert.equal(patchNoteFor(closed, 'v3', NOTES), 'NEW: more things', 'na versão seguinte, a linha nova aparece');
});

test('#126 patch note: quem abre o jogo pela primeira vez não vê; quem jogava antes do patch note existir, vê', () => {
  assert.equal(patchNoteFor(emptySave(), 'v2', NOTES), null);
  const oldSave = { ...emptySave(), build: undefined, levels: { 'w1-1': { completed: true, rescues: 1 } } };
  assert.equal(patchNoteFor(oldSave, 'v2', NOTES), 'NEW: something');
});

test('#126 patch note: fechou o jogo sem fechar a linha? Ela aparece de novo; versão sem linha não mostra nada', () => {
  // save.build só passa para a versão nova quando a linha é fechada
  assert.equal(patchNoteFor(played('v1'), 'v2', NOTES), 'NEW: something');
  assert.equal(patchNoteFor(played('v1'), 'v9', NOTES), null);
});

test('#126 patch note: cada linha cabe numa linha do iPhone e está em inglês (D-007)', () => {
  for (const [build, text] of Object.entries(PATCH_NOTES)) {
    assert.ok(text.length <= PATCH_NOTE_MAX, `${build}: ${text.length} caracteres (máximo ${PATCH_NOTE_MAX})`);
    assert.match(text, /^[\x20-\x7E]+$/, `${build}: só letras sem acento, como os outros textos do jogo`);
  }
  assert.match(patchNoteKey('2026-10-07a'), /^[A-Za-z0-9_-]{1,24}$/, 'a chave cabe na regra de telas vistas do perfil online');
});
