// Modificadores: mudam o jeito de jogar sem precisar de obstáculo novo (P-012, #61).
// Quais existem, onde aparecem e se o jogador escolhe ainda está em aberto. Por isso nenhum
// nível usa modificador por enquanto: aqui fica só o mecanismo, com tipos que a física já entende.
//
// Num nível (content/worlds.js), um modificador é escrito assim:
//   modifiers: [{ type: 'gravity', scale: 0.6 }, { type: 'wind', force: 20 }]

export const MODIFIERS = {
  // Gravidade mais forte ou mais fraca (ideia registrada: gravidade diferente em cada planeta)
  gravity: {
    label: (m) => (m.scale < 1 ? 'LOW GRAVITY' : 'HEAVY GRAVITY'),
    apply: (p, m) => { p.gravity *= m.scale; },
  },
  // Tanque maior ou menor
  tank: {
    label: (m) => (m.scale < 1 ? 'SMALL TANK' : 'BIG TANK'),
    apply: (p, m) => { p.tankSeconds *= m.scale; },
  },
  // Vento ou corrente que empurra a nave para o lado (unidades/s²; positivo = para a direita)
  wind: {
    label: (m) => (m.force > 0 ? 'WIND →' : '← WIND'),
    apply: (p, m) => { p.windX += m.force; },
  },
  // Nave mais pesada com a tripulação a bordo
  heavyCrew: {
    label: () => 'HEAVY RETURN',
    apply: (p, m) => { p.crewWeight = m.extraGravity; },
  },
};

// Cadeia de parâmetros (#120): os números de ajuste passam por camadas, sempre nesta ordem, e cada camada
// aplica os seus modificadores por cima da anterior. Hoje só "mundo e fase" é usada; as outras são os pontos
// de encaixe para naves que mudam o jogo (D-034), evoluções de atributos (D-035) e modos de jogo (P-018).
export const PARAM_LAYERS = ['nave', 'evoluções', 'mundo e fase', 'modo'];

export function paramLayers(levelDef, { ship = null, upgrades = [], mode = null } = {}) {
  return [
    ['nave', ship?.changesGameplay ? ship.modifiers ?? [] : []],   // nave de aparência não muda nada (D-034)
    ['evoluções', upgrades.flatMap((u) => u.modifiers ?? [])],     // evolução só visual não tem modificadores (D-035)
    ['mundo e fase', levelDef.modifiers || []],                    // os do mundo vêm antes dos da fase (worlds.js)
    ['modo', mode?.modifiers ?? []],
  ];
}

// Junta os parâmetros de ajuste, o tanque e os modificadores de todas as camadas num objeto só, que é o que a
// física usa a cada passo. O tanque vem do cenário gerado (regra do melhor caminho, D-018), quando
// houver, ou do nível. Um modificador de tanque age por cima disso.
export function effectiveParams(base, levelDef, level = null, extras = {}) {
  const p = { ...base, tankSeconds: level?.tankSeconds ?? levelDef.generator.tankSeconds ?? 40, windX: 0, crewWeight: 0 };
  for (const [, modifiers] of paramLayers(levelDef, extras)) {
    for (const m of modifiers) {
      const kind = MODIFIERS[m.type];
      if (!kind) throw new Error(`Unknown modifier: ${m.type}`);
      kind.apply(p, m);
    }
  }
  return p;
}

export const modifierLabels = (levelDef) => (levelDef.modifiers || []).map((m) => MODIFIERS[m.type].label(m));
