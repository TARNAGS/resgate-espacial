// Teclado (Regras do jogo, seção 4.1; #37): ← e → giram, ↑ aciona o propulsor.
// A e D giram, W e Espaço também acionam o propulsor. P ou Esc pausam.

const KEYMAP = {
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  ArrowUp: 'thrust', KeyW: 'thrust', Space: 'thrust',
};

export function createKeyboard({ isPlaying, onPause, onTuning, onAnyKey }) {
  const keys = { left: false, right: false, thrust: false };

  window.addEventListener('keydown', (e) => {
    onAnyKey?.();
    const k = KEYMAP[e.code];
    if (k && isPlaying()) {
      keys[k] = true;
      e.preventDefault();
    }
    if ((e.code === 'KeyP' || e.code === 'Escape') && isPlaying()) onPause();
    if (e.code === 'Backquote') onTuning?.();
  });

  window.addEventListener('keyup', (e) => {
    const k = KEYMAP[e.code];
    if (k) keys[k] = false;
  });

  return {
    keys,
    reset() { keys.left = keys.right = keys.thrust = false; },
  };
}
