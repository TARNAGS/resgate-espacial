import { classic } from './classic.js';

// Catálogo de naves (E-26, #121 e #122). A forma da nave fica num lugar só: a física, o contato, o pouso, a
// previsão do pouso, o piloto automático, os elogios e o desenho leem a definição daqui. Cada nave tem:
//
//   key, label        o nome no catálogo
//   changesGameplay   true só para a nave que muda o jogo (D-034); sem a marca, é nave de aparência
//   hull              casco: o polígono que bate, em coordenadas da nave (ponta para cima, y para baixo)
//   feet              { y, half }: a linha de baixo, que precisa estar sobre a plataforma no pouso
//   nozzle            { y, half, flame, flicker }: de onde sai a chama e o tamanho dela
//   door              { x, y }: para onde a tripulação corre no embarque
//   outline           o contorno desenhado; fica perto do casco (testes/regras/nave.test.js)
//   modifiers         só na nave que muda o jogo: atributos próprios, como em content/modifiers.js
//
// Regra da D-034: toda nave nova é só aparência, a não ser que diga `changesGameplay: true`.
//   Nave de aparência: usa o casco, os pés e os atributos da clássica e muda só o desenho (outline, nozzle,
//     door). Não precisa de prova e não mexe no ranking. resolveShip garante isso mesmo que ela tente mudar.
//   Nave que muda o jogo: pode ter casco e atributos próprios; precisa caber em cada fase e ser provada pelo
//     piloto automático em cada fase fixa (testes/conteudo/contrato-nave.test.js), e tem ranking próprio.

export const SHIPS = {
  [classic.key]: classic,
};

export const DEFAULT_SHIP = classic;

// Raio da nave: a maior distância de um ponto do casco ao centro de giro. Como a nave gira, é o que ela ocupa.
export const shipRadius = (ship) => Math.max(...ship.hull.map((v) => Math.hypot(v.x, v.y)));

// A nave que a partida usa. Nave de aparência recebe o casco, os pés e os atributos da clássica e não
// consegue defini-los: a aparência nunca muda o que bate (D-034).
export function resolveShip(ship = DEFAULT_SHIP) {
  if (ship.changesGameplay || ship === DEFAULT_SHIP) return ship;
  return {
    ...DEFAULT_SHIP, ...ship,
    hull: DEFAULT_SHIP.hull, feet: DEFAULT_SHIP.feet, modifiers: [], changesGameplay: false,
  };
}

const sameShape = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Duas bordas se cruzam (sem contar as pontas que dividem)?
function crosses(p1, p2, p3, p4) {
  const d = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const d1 = d(p3, p4, p1), d2 = d(p3, p4, p2), d3 = d(p1, p2, p3), d4 = d(p1, p2, p4);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
}

// Problemas de uma definição de nave, ou lista vazia. Vale para qualquer nave do catálogo.
export function shipProblems(ship) {
  const out = [];
  if (!ship.key) out.push('sem key');
  if (!ship.changesGameplay && ship !== DEFAULT_SHIP) {
    if (ship.hull && !sameShape(ship.hull, DEFAULT_SHIP.hull)) out.push('nave de aparência com casco próprio: só a nave marcada com changesGameplay pode (D-034)');
    if (ship.feet && !sameShape(ship.feet, DEFAULT_SHIP.feet)) out.push('nave de aparência com pés próprios: só a nave marcada com changesGameplay pode (D-034)');
    if (ship.modifiers?.length) out.push('nave de aparência com atributos próprios: só a nave marcada com changesGameplay pode (D-034)');
    return out;
  }
  const hull = ship.hull || [];
  if (hull.length < 3) return [...out, 'o casco precisa de pelo menos 3 vértices'];
  let area = 0;
  for (let i = 0; i < hull.length; i++) {
    const a = hull[i], b = hull[(i + 1) % hull.length];
    area += a.x * b.y - b.x * a.y;
  }
  if (Math.abs(area) < 1) out.push('o casco não tem área');
  for (let i = 0; i < hull.length; i++) {
    for (let j = i + 2; j < hull.length; j++) {
      if (i === 0 && j === hull.length - 1) continue;   // bordas vizinhas pelo fechamento
      if (crosses(hull[i], hull[(i + 1) % hull.length], hull[j], hull[(j + 1) % hull.length])) out.push(`o casco tem bordas que se cruzam (${i} e ${j})`);
    }
  }
  const base = Math.max(...hull.map((v) => v.y));
  if (!ship.feet || ship.feet.y !== base) out.push('os pés precisam estar na base do casco');
  if (!(ship.feet?.half > 0)) out.push('os pés precisam de largura');
  if (!ship.nozzle || !(ship.nozzle.y > 0 && ship.nozzle.y <= base)) out.push('o bocal precisa ficar atrás, perto da base');
  if (!ship.door || Math.abs(ship.door.y - base) > 1) out.push('a porta precisa ficar na base');
  return out;
}

// A nave cabe nesta fase? Ela gira, então ocupa um círculo do tamanho do raio. Devolve o problema, ou null.
export function shipFitsLevel(ship, levelDef) {
  const size = 2 * shipRadius(ship);
  const g = levelDef.generator;
  if (size >= g.minGap) return `${levelDef.key}: a nave (${size.toFixed(0)}) não cabe no corredor mínimo (${g.minGap})`;
  for (const o of g.obstacles || []) {
    if (o.passGap != null && size >= o.passGap) return `${levelDef.key}: a nave (${size.toFixed(0)}) não passa ao lado dos obstáculos (${o.passGap})`;
  }
  return null;
}
