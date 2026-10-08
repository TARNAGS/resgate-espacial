// Contrato da skin (#124): vale para toda skin do catálogo (render/skins/). Uma skin muda só a aparência: desenha
// todos os obstáculos, não define o casco, fica perto dele e não mexe no ranking (D-034 e D-035).

import { test, assert, DEFAULT_PARAMS, VIEW_ONLY, LEVELS, rankKey } from '../lib.js';
import { PARAM_KIND, TUNABLE } from '../../src/config/params.js';
import { OBSTACLES } from '../../src/content/obstacles/index.js';
import { SHIPS, resolveShip } from '../../src/content/ships/index.js';
import { pointInPoly } from '../../src/core/math.js';
import { SKINS, DEFAULT_SKIN, SHIP_MARGIN, resolveSkin } from '../../src/render/skins/index.js';
import { createFakeCanvas } from '../tela-de-mentira.js';

// Distância de um ponto ao polígono: 0 dentro dele, senão até a borda mais próxima
function distanceToPoly(p, poly) {
  if (pointInPoly(p, poly)) return 0;
  let best = Infinity;
  poly.forEach((a, i) => {
    const b = poly[(i + 1) % poly.length];
    const dx = b.x - a.x, dy = b.y - a.y;
    const k = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
    best = Math.min(best, Math.hypot(p.x - (a.x + k * dx), p.y - (a.y + k * dy)));
  });
  return best;
}

// Pontos de tudo o que a skin desenhou da nave (cantos dos traços e a borda dos arcos)
function drawnPoints(calls) {
  const pts = [];
  for (const [name, args] of calls) {
    if (['moveTo', 'lineTo'].includes(name)) pts.push({ x: args[0], y: args[1] });
    if (name === 'quadraticCurveTo') pts.push({ x: args[0], y: args[1] }, { x: args[2], y: args[3] });
    if (name === 'arc') for (let a = 0; a < 6.28; a += 0.5) pts.push({ x: args[0] + Math.cos(a) * args[2], y: args[1] + Math.sin(a) * args[2] });
  }
  return pts;
}

test('#124 toda skin tem nome, cores do mundo, nave, chama e o desenho de todos os obstáculos', () => {
  assert.equal(DEFAULT_SKIN.key, 'classic');
  for (const [key, raw] of Object.entries(SKINS)) {
    assert.equal(raw.key, key, `a skin "${key}" precisa ter key igual à chave do catálogo`);
    assert.ok(raw.label, `${key}: falta o label`);
    const skin = resolveSkin(key);
    for (const fn of ['theme', 'ship', 'flame']) assert.equal(typeof skin[fn], 'function', `${key}: falta ${fn}`);
    for (const type of Object.keys(OBSTACLES)) {
      assert.equal(typeof DEFAULT_SKIN.obstacles[type], 'function', `a classic precisa desenhar o obstáculo "${type}": ela completa as outras skins`);
      assert.equal(typeof skin.obstacles[type], 'function', `${key}: não desenha o obstáculo "${type}"`);
    }
    const theme = skin.theme(LEVELS[0].world.theme);
    for (const color of ['sky', 'terrain', 'terrainFill', 'terrainGlow', 'rock', 'rockFill']) assert.ok(theme[color], `${key}: as cores do mundo perderam "${color}"`);
  }
});

test('#124 a skin não define a nave: o casco, os pés e os atributos vêm de content/ships', () => {
  for (const [key, skin] of Object.entries(SKINS)) {
    for (const field of ['hull', 'feet', 'outline', 'nozzle', 'door', 'modifiers', 'changesGameplay']) {
      assert.ok(!(field in skin), `${key}: a skin não pode ter "${field}"; a forma da nave fica em content/ships (D-034)`);
    }
  }
});

test(`#124 o desenho da nave fica a no máximo ${SHIP_MARGIN} do casco, em toda skin e toda nave`, () => {
  for (const key of Object.keys(SKINS)) {
    for (const ship of Object.values(SHIPS).map((s) => resolveShip(s))) {
      for (const safe of [false, true]) {
        const { ctx, calls } = createFakeCanvas();
        resolveSkin(key).ship(ctx, ship, safe);
        const pts = drawnPoints(calls);
        assert.ok(pts.length >= 3, `${key} · ${ship.key}: a skin quase não desenhou a nave`);
        const far = pts.find((p) => distanceToPoly(p, ship.hull) > SHIP_MARGIN);
        assert.ok(!far, `${key} · ${ship.key}: o desenho passa ${far && distanceToPoly(far, ship.hull).toFixed(1)} do casco em (${far?.x}, ${far?.y}); a nave pareceria passar por dentro de uma pedra`);
      }
    }
  }
});

test('#124 o alarme da folga funciona: uma nave com asas compridas é pega', () => {
  const { ctx, calls } = createFakeCanvas();
  const wings = { ...DEFAULT_SKIN, ship: (c) => { c.moveTo(0, -11); c.lineTo(14, 8); c.lineTo(-14, 8); } };
  wings.ship(ctx);
  assert.ok(drawnPoints(calls).some((p) => distanceToPoly(p, SHIPS.classic.hull) > SHIP_MARGIN));
});

test('#124 trocar a skin não muda a chave do ranking nem tira a corrida do ranking', () => {
  assert.equal(PARAM_KIND.skin, 'imagem');
  assert.ok(VIEW_ONLY.includes('skin'), 'a skin precisa estar em VIEW_ONLY, senão o painel de ajuste tiraria a corrida do ranking');
  for (const key of Object.keys(SKINS)) {
    for (const def of LEVELS) assert.equal(rankKey(def, { ...DEFAULT_PARAMS, skin: key }), rankKey(def, DEFAULT_PARAMS), `${key} · ${def.key}`);
  }
});

test('#124 o painel de ajuste oferece exatamente as skins do catálogo', () => {
  const options = TUNABLE.find((item) => item.key === 'skin').options.map((o) => (Array.isArray(o) ? o[0] : o));
  assert.deepEqual(options.sort(), Object.keys(SKINS).sort());
  assert.ok(DEFAULT_PARAMS.skin in SKINS);
});
