// Nave como dado (#121): um formato só, em content/ships/. A nave que o jogador vê é a nave que bate.

import { test, assert, createShip } from '../lib.js';
import { SHIPS, DEFAULT_SHIP } from '../../src/content/ships/index.js';
import { shipVerts, shipSamples } from '../../src/core/ship.js';
import { pointInPoly } from '../../src/core/math.js';

// Distância de um ponto ao contorno de um polígono (0 se estiver dentro)
function distToPoly(pt, poly) {
  if (pointInPoly(pt, poly)) return 0;
  let best = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const dx = b.x - a.x, dy = b.y - a.y;
    const t = Math.max(0, Math.min(1, ((pt.x - a.x) * dx + (pt.y - a.y) * dy) / (dx * dx + dy * dy)));
    best = Math.min(best, Math.hypot(pt.x - (a.x + t * dx), pt.y - (a.y + t * dy)));
  }
  return best;
}

// Pontos ao longo das bordas de um polígono
const along = (poly, n = 20) => poly.flatMap((a, i) => {
  const b = poly[(i + 1) % poly.length];
  return Array.from({ length: n }, (_, k) => ({ x: a.x + ((b.x - a.x) * k) / n, y: a.y + ((b.y - a.y) * k) / n }));
});

test('#121 o formato da nave fica num lugar só: a nave clássica é a nave padrão (D-034)', () => {
  assert.equal(DEFAULT_SHIP, SHIPS.classic);
  for (const [id, ship] of Object.entries(SHIPS)) {
    assert.equal(ship.key, id, `${id}: a key não bate com o catálogo`);
    assert.ok(ship.hull.length >= 3, `${id}: o casco precisa de pelo menos 3 vértices`);
    for (const campo of ['feet', 'nozzle', 'door', 'outline']) assert.ok(ship[campo], `${id}: falta ${campo}`);
  }
});

test('#121 a física usa o casco da definição: os vértices e o ponto de contato seguem a nave', () => {
  const pad = { x1: 100, x2: 200, y: 400, kind: 'base' };
  const s = createShip(pad, 1);
  assert.equal(s.y, pad.y - DEFAULT_SHIP.feet.y, 'a nave nasce com os pés na plataforma');
  const verts = shipVerts(s);
  assert.equal(verts.length, DEFAULT_SHIP.hull.length);
  verts.forEach((v, i) => {
    assert.equal(v.x, s.x + DEFAULT_SHIP.hull[i].x);
    assert.equal(v.y, s.y + DEFAULT_SHIP.hull[i].y);
  });
  assert.equal(shipSamples(verts).length, DEFAULT_SHIP.hull.length * 4, 'quatro pontos de contato por borda do casco');
});

test('#121 o contorno desenhado fica perto do casco: a nave que o jogador vê é a nave que bate', () => {
  for (const [id, ship] of Object.entries(SHIPS)) {
    // O que o jogador vê não passa do casco: senão a nave "passa por dentro" de uma pedra sem explodir
    const fora = Math.max(...along(ship.outline).map((pt) => distToPoly(pt, ship.hull)));
    assert.ok(fora <= 3, `${id}: o desenho passa ${fora.toFixed(1)} do casco (máximo 3)`);
    // E o casco não fica muito além do desenho: senão o jogador vê "explodi sem encostar".
    // Na clássica, o entalhe de baixo deixa até 3,5 de casco sem desenho, no centro da base.
    const semDesenho = Math.max(...along(ship.hull).map((pt) => distToPoly(pt, ship.outline)));
    assert.ok(semDesenho <= 4, `${id}: há casco a ${semDesenho.toFixed(1)} do desenho (máximo 4)`);
    // Pés, bocal e porta ficam na base do casco
    const base = Math.max(...ship.hull.map((v) => v.y));
    assert.equal(ship.feet.y, base, `${id}: os pés precisam estar na base do casco`);
    assert.ok(ship.nozzle.y <= base && ship.nozzle.y > 0, `${id}: o bocal fica atrás, perto da base`);
    assert.ok(Math.abs(ship.door.y - base) <= 1, `${id}: a porta fica na base`);
  }
});
