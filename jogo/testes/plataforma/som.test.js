// Som (#103, D-030)

import { test, assert, Sound } from '../lib.js';

test('#103 o som volta depois de uma interrupção do iPhone (interrupted) e antes do primeiro toque (suspended)', () => {
  const calls = [];
  for (const state of ['interrupted', 'suspended', 'running', 'closed']) {
    Sound.ctx = { state, resume: () => { calls.push(state); return Promise.resolve(); } };
    Sound.wake();
  }
  Sound.ctx = null;
  assert.deepEqual(calls, ['interrupted', 'suspended']);
});
