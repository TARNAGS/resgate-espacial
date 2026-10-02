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

// Junta os parâmetros de ajuste, o tanque e os modificadores do nível num objeto só, que é o que a
// física usa a cada passo. O tanque vem do cenário gerado (regra do melhor caminho, D-018), quando
// houver, ou do nível. Um modificador de tanque age por cima disso.
export function effectiveParams(base, levelDef, level = null) {
  const p = { ...base, tankSeconds: level?.tankSeconds ?? levelDef.generator.tankSeconds ?? 40, windX: 0, crewWeight: 0 };
  for (const m of levelDef.modifiers || []) {
    const kind = MODIFIERS[m.type];
    if (!kind) throw new Error(`Unknown modifier: ${m.type}`);
    kind.apply(p, m);
  }
  return p;
}

export const modifierLabels = (levelDef) => (levelDef.modifiers || []).map((m) => MODIFIERS[m.type].label(m));
