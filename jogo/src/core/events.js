// Canal de eventos da partida. As regras avisam o que aconteceu (pousou, explodiu, concluiu)
// e quem precisa reagir se inscreve: som, mensagens na tela, elogios e telemetria.

// Contrato dos eventos (#116): cada evento e os campos que ele leva. Quem reage depende destes nomes, e um
// evento renomeado sem atualizar quem escuta faria o som ou a telemetria pararem em silêncio. Por isso a lista
// fica num lugar só, e os testes conferem que ninguém avisa nem escuta um evento fora dela (documento 12).
export const EVENTS = {
  start: ['def', 'seed'],                                   // quem cria a partida avisa (main.js)
  takeoff: [],
  land: ['pad', 'impact'],                                  // impact: { vx, vy, angle } no toque
  crash: ['reason', 'x', 'y', 'vx', 'vy', 'a', 'lives'],
  refuel: ['pad'],                                          // o tanque encheu
  boarding: ['lowFuel'],                                    // pousou na tripulação
  boardStep: ['index'],                                     // um tripulante entrou (0, 1, 2)
  crewOnBoard: [],
  lowFuelAtCrew: ['fuel'],
  lowFuel: ['level'],                                       // 'low' (20%) ou 'critical' (10%), em voo (#94)
  noFuel: ['landed'],                                       // apertou o propulsor sem combustível, ou pousou sem (#94)
  outOfFuel: ['landed'],
  respawn: ['lives', 'at'],
  complete: ['def', 'seed', 'run'],                         // run: { time, livesLost, fuelLeft, perfectRun }
  gameOver: ['def', 'seed'],
  praise: ['kind', 'label', 'x', 'y'],                      // elogio (#81)
};

// strict (nos testes): avisar um evento fora da lista, ou com campos diferentes dos prometidos, vira erro.
// No jogo fica desligado, para um engano nunca derrubar a partida de quem está jogando.
export function createEvents({ strict = false } = {}) {
  const handlers = new Map();
  return {
    on(name, fn) {
      if (!handlers.has(name)) handlers.set(name, new Set());
      handlers.get(name).add(fn);
      return () => handlers.get(name).delete(fn);
    },
    emit(name, payload = {}) {
      if (strict) checkEvent(name, payload);
      for (const fn of handlers.get(name) || []) fn(payload);
      for (const fn of handlers.get('*') || []) fn({ name, ...payload });
    },
  };
}

export function checkEvent(name, payload) {
  const fields = EVENTS[name];
  if (!fields) throw new Error(`evento "${name}" não está no contrato (core/events.js)`);
  const sent = Object.keys(payload).sort().join(', ');
  const promised = [...fields].sort().join(', ');
  if (sent !== promised) throw new Error(`evento "${name}" levou [${sent}], mas o contrato promete [${promised}]`);
}
