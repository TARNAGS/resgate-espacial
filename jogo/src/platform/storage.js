// O que o jogo guarda no aparelho. Onde guardar ainda está em aberto (P-016, #62), e nas lojas
// o armazenamento pode mudar (#65). Por isso o resto do jogo só fala com estas funções, e a troca
// do localStorage por outro meio fica restrita a este arquivo. Elas já são assíncronas por isso.
//
// O formato tem versão: ao mudar a estrutura, aumentar SAVE_VERSION e converter o antigo em migrate().

const SAVE_KEY = 'resgate-espacial:save';
const TUNING_KEY = 'resgate-espacial:tuning';
const SAVE_VERSION = 1;

export const emptySave = () => ({ version: SAVE_VERSION, levels: {}, settings: { sound: true } });

function migrate(data) {
  if (!data || typeof data !== 'object' || data.version !== SAVE_VERSION) return emptySave();
  return { ...emptySave(), ...data, settings: { ...emptySave().settings, ...data.settings } };
}

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }   // sem armazenamento: vale só nesta sessão
}

function write(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch (_) { /* idem */ }
}

export async function loadSave() { return migrate(read(SAVE_KEY)); }
export async function writeSave(save) { write(SAVE_KEY, save); }

// Painel de ajuste (#42), guardado à parte porque não é progresso do jogador:
// { enabled: o painel foi liberado neste aparelho, values: parâmetros alterados }
export async function loadTuning() { return { enabled: false, values: {}, ...read(TUNING_KEY) }; }
export async function writeTuning(t) {
  write(TUNING_KEY, t.enabled || Object.keys(t.values).length ? t : null);
}
