import { PARAMS, TUNABLE, VIEW_ONLY, setParams, resetParams, changedParams } from '../config/params.js';
import { loadTuning, writeTuning } from '../platform/storage.js';

// Painel de ajuste para as sessões de teste (#42). Fica escondido de quem joga normalmente.
// Como liberar neste aparelho (uma vez basta; desliga em "HIDE PANEL"):
//   - tocar 5 vezes seguidas no subtítulo do menu, ou
//   - abrir o jogo com ?tuning no fim do endereço, ou
//   - apertar a tecla ` (crase) no computador.
// Depois de liberado, aparece um botão "T" na partida, ao lado da pausa.
// Os valores mudam na hora e ficam salvos no aparelho; "COPY VALUES" copia o que mudou,
// para levar a calibragem para config/params.js.

export async function createTuning({ panel, onOpenChange, onTraining }) {
  const stored = await loadTuning();
  setParams(stored.values);
  const t = { enabled: stored.enabled || new URLSearchParams(location.search).has('tuning'), open: false };
  const persist = () => writeTuning({ enabled: t.enabled, values: changedParams() });
  if (t.enabled) persist();

  function build() {
    panel.innerHTML = '';
    const head = document.createElement('div');
    head.className = 'tuning-head';
    head.innerHTML = '<strong>TUNING</strong><span>changes apply right away</span>';
    panel.appendChild(head);
    for (const item of TUNABLE) {
      const row = document.createElement('label');
      row.className = 'tuning-row';
      const name = document.createElement('span');
      name.textContent = item.label;
      const value = document.createElement('output');
      let input;
      if (item.options) {
        input = document.createElement('select');
        for (const o of item.options) {
          const [v, label] = Array.isArray(o) ? o : [o, o];
          input.add(new Option(label, v, false, PARAMS[item.key] === v));
        }
        value.textContent = '';
      } else {
        input = document.createElement('input');
        Object.assign(input, { type: 'range', min: item.min, max: item.max, step: item.step, value: PARAMS[item.key] });
        value.textContent = PARAMS[item.key];
      }
      input.addEventListener('input', () => {
        const v = item.options ? input.value : Number(input.value);
        PARAMS[item.key] = v;
        if (!item.options) value.textContent = v;
        persist();
      });
      row.append(name, input, value);
      panel.appendChild(row);
    }
    const buttons = document.createElement('div');
    buttons.className = 'tuning-buttons';
    const add = (label, fn) => {
      const b = document.createElement('button');
      b.className = 'btn small';
      b.textContent = label;
      b.onclick = fn;
      buttons.appendChild(b);
      return b;
    };
    add('CLOSE', () => t.toggle(false));
    add('TRAINING', () => { t.toggle(false); onTraining(); });
    add('RESET', () => { resetParams(); persist(); build(); });
    const copy = add('COPY VALUES', async () => {
      const text = JSON.stringify(changedParams(), null, 2);
      try { await navigator.clipboard.writeText(text); copy.textContent = 'COPIED'; } catch (_) { prompt('Copy:', text); }
      setTimeout(() => { copy.textContent = 'COPY VALUES'; }, 1500);
    });
    add('HIDE PANEL', () => { t.enabled = false; persist(); t.toggle(false); });
    panel.appendChild(buttons);
  }

  t.enable = () => { t.enabled = true; persist(); };
  t.toggle = (force) => {
    if (!t.enabled) return;
    t.open = force ?? !t.open;
    if (t.open) build();
    panel.classList.toggle('hidden', !t.open);
    onOpenChange(t.open);
  };
  // O esquema do toque aparece à parte no rodapé ("control A/B/C"); não conta como ajuste
  t.isTuned = () => Object.keys(changedParams()).some((k) => !VIEW_ONLY.includes(k));
  return t;
}
