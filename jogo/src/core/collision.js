import { STEP } from './constants.js';
import { DEFAULT_SHIP } from '../content/ships/index.js';
import { sampleLine } from './math.js';
import { shipVerts, shipSamples, landingCheck } from './ship.js';
import { OBSTACLES } from '../content/obstacles/index.js';

// Contato da nave com a fase (Regras do jogo, seções 3.3 e 7.2). Uma função só, usada pela partida
// e pelo piloto automático, para os dois seguirem exatamente as mesmas regras.
// Devolve:
//   null                  sem contato, ou só raspou subindo de uma plataforma
//   { crash: 'MOTIVO' }   explodiu
//   { land: pad }         pousou com segurança nessa plataforma

export function contact(level, s, p, def = DEFAULT_SHIP) {
  const verts = shipVerts(s, def);
  const samples = shipSamples(verts);
  const onFloor = [];
  for (const pt of samples) {
    if (pt.x <= 0 || pt.x >= level.L) return { crash: 'HIT THE WALL' };
    if (pt.y <= sampleLine(level.ceil, pt.x, STEP)) return { crash: 'HIT THE CEILING' };
    if (pt.y >= sampleLine(level.floor, pt.x, STEP)) onFloor.push(pt);
  }
  const body = { x: s.x, y: s.y, verts, samples };
  for (const o of level.obstacles) {
    if (OBSTACLES[o.type].hits(o, body)) return { crash: `HIT A ${OBSTACLES[o.type].label.toUpperCase()}` };
  }
  if (!onFloor.length) return null;
  const pad = level.pads.find((q) => onFloor.every((c) => c.x >= q.x1 - p.padMargin && c.x <= q.x2 + p.padMargin));
  if (!pad) return { crash: 'TOUCHED THE GROUND' };
  if (s.vy < 0) return null;   // subindo de uma plataforma: só raspou, não é pouso nem batida
  const bad = landingCheck(s, p);
  if (bad === 'tilted') return { crash: 'LANDED TILTED' };
  if (bad === 'fast') return { crash: 'LANDED TOO FAST' };
  return { land: pad };
}

// Deixa a nave parada e reta em cima da plataforma, com os pés na plataforma
export function settle(s, pad, def = DEFAULT_SHIP) {
  Object.assign(s, { state: 'landed', pad, vx: 0, vy: 0, a: 0, y: pad.y - def.feet.y, thrusting: false });
}

// Decolagem: o primeiro impulso que tira a nave da plataforma
export function takeOff(s) {
  s.state = 'flying';
  s.pad = null;
  s.y -= 2;
  s.vy = -25;
}
