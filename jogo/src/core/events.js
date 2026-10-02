// Canal de eventos da partida. As regras avisam o que aconteceu (pousou, explodiu, concluiu)
// e quem precisa reagir se inscreve: som, mensagens na tela, pontuação e, depois, medição (E-17).

export function createEvents() {
  const handlers = new Map();
  return {
    on(name, fn) {
      if (!handlers.has(name)) handlers.set(name, new Set());
      handlers.get(name).add(fn);
      return () => handlers.get(name).delete(fn);
    },
    emit(name, payload = {}) {
      for (const fn of handlers.get(name) || []) fn(payload);
      for (const fn of handlers.get('*') || []) fn({ name, ...payload });
    },
  };
}
