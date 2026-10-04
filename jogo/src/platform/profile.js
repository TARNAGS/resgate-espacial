import { LEADERBOARD_URL } from '../config/online.js';

// Perfil do jogador no banco online (#102, D-029): progresso de cada fase, configurações, telas já
// vistas e elogios, ligados ao nick. Quem troca de aparelho (ou limpa o navegador) continua de onde
// parou digitando o mesmo nick, e o PM acompanha a evolução de cada jogador.
//   - O aparelho continua sendo a fonte: o perfil online é uma cópia, juntada com a do aparelho.
//   - Só cresce: as regras do banco recusam progresso menor (fase concluída que volta atrás, tempo
//     pior, menos resgates ou elogios). Juntar dois perfis fica sempre com o melhor de cada um.
//   - Sem internet, ou enquanto as regras do banco não liberarem o perfil, tudo segue no aparelho.
// Formato no banco: players/<NICK> = { levels: { <fase>: { completed, rescues, best } },
//                                      settings: { sound, control }, seen: { <tela>: true }, praise: { <elogio>: n } }

const hasProgress = (save) => Object.keys(save.levels || {}).length > 0;

// Junta o perfil do banco ao save do aparelho (sem mexer no original) e devolve o save novo.
// As configurações do banco só valem num aparelho sem progresso (o aparelho novo de quem já jogava).
export function mergeIntoSave(save, profile) {
  if (!profile) return save;
  const out = { ...save, levels: { ...save.levels }, seen: { ...save.seen }, praise: { ...save.praise }, settings: { ...save.settings } };
  for (const [key, remote] of Object.entries(profile.levels || {})) {
    const local = out.levels[key] || { completed: false, best: undefined, rescues: 0 };
    const remoteBest = Number.isFinite(remote.best) ? remote.best : undefined;
    const keepLocal = local.best !== undefined && (remoteBest === undefined || local.best.time <= remoteBest);
    out.levels[key] = {
      completed: Boolean(local.completed || remote.completed),
      rescues: Math.max(local.rescues || 0, remote.rescues || 0),
      best: keepLocal ? local.best : remoteBest !== undefined ? { time: remoteBest } : undefined,
    };
  }
  for (const [screen, seen] of Object.entries(profile.seen || {})) if (seen) out.seen[screen] = true;
  for (const [kind, n] of Object.entries(profile.praise || {})) out.praise[kind] = Math.max(out.praise[kind] || 0, n || 0);
  if (!hasProgress(save) && profile.settings) {
    if (typeof profile.settings.sound === 'boolean') out.settings.sound = profile.settings.sound;
    if (typeof profile.settings.control === 'string') out.settings.touchScheme = profile.settings.control;
  }
  return out;
}

// O que vai para o banco, em caminhos separados (cada um conferido pelas regras do banco)
export function profileUpdate(save) {
  const update = {};
  for (const [key, lv] of Object.entries(save.levels || {})) {
    update[`levels/${key}`] = { completed: Boolean(lv.completed), rescues: lv.rescues || 0, ...(lv.best ? { best: lv.best.time } : {}) };
  }
  for (const [screen, seen] of Object.entries(save.seen || {})) if (seen) update[`seen/${screen}`] = true;
  for (const [kind, n] of Object.entries(save.praise || {})) update[`praise/${kind}`] = n;
  update.settings = { sound: save.settings?.sound !== false, ...(save.settings?.touchScheme ? { control: save.settings.touchScheme } : {}) };
  return update;
}

export function createProfileSync({ url = LEADERBOARD_URL, fetchFn = (...a) => fetch(...a) } = {}) {
  const base = (url || '').replace(/\/+$/, '');
  return {
    online: Boolean(base),
    // Busca o perfil do nick no banco; null se não houver, ou se o banco estiver fora do ar
    async pull(nick) {
      if (!base || !nick) return null;
      try {
        const r = await fetchFn(`${base}/players/${nick}.json`);
        return r.ok ? await r.json() : null;
      } catch (_) { return null; }
    },
    // Envia o perfil. Devolve 'ok', 'refused' (as regras recusaram) ou 'offline'
    async push(nick, save) {
      if (!base || !nick) return 'offline';
      try {
        const r = await fetchFn(`${base}/players/${nick}.json`, { method: 'PATCH', body: JSON.stringify(profileUpdate(save)) });
        if (r.status === 401) return 'refused';
        return r.ok ? 'ok' : 'offline';
      } catch (_) { return 'offline'; }
    },
  };
}
