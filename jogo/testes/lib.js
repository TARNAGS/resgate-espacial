// Peças comuns aos testes: o registro dos testes, os módulos do jogo e os ajudantes usados em mais de um arquivo.
// Os testes rodam pelo rodar.js, um de cada vez, na ordem dos arquivos.

import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PARAMS, DEFAULT_PARAMS, VIEW_ONLY, setParams, resetParams, changedParams } from '../src/config/params.js';
import { LEVELS, CHALLENGES, TRAINING_LEVEL, findLevel } from '../src/content/worlds.js';
import { effectiveParams } from '../src/content/modifiers.js';
import { generateLevel, validateLevel } from '../src/core/generator.js';
import { routeInputs, expertRun, expertPlans } from '../src/core/autopilot.js';
import { createDemoPilot, DEMO_LABELS, DEMO_SPEED } from '../src/core/demo.js';
import { INTRO_SONG, CHORDS } from '../src/content/songs.js';
import { createPraise } from '../src/core/praise.js';
import { rankKey, normalizeNick, validNick } from '../src/core/ranking.js';
import { createLeaderboard } from '../src/platform/leaderboard.js';
import { createProfileSync, mergeIntoSave, profileUpdate } from '../src/platform/profile.js';
import { createTelemetry, cleanFields, createFrameStats, createRunTracker, encodePoint, decodePath } from '../src/platform/telemetry.js';
import { createShip, fly, steer, landingForecast } from '../src/core/ship.js';
import { createMatch } from '../src/core/match.js';
import { Sound } from '../src/platform/audio.js';
import { createEvents as createEventsLoose } from '../src/core/events.js';
import { readIntent, touchThrust } from '../src/input/controls.js';
import { emptySave } from '../src/platform/storage.js';
import { isUnlocked, defaultLevel, recordCompletion, levelState, nextLevel } from '../src/core/progress.js';
import { DEFAULT_SHIP as CLASSIC_SHIP } from '../src/content/ships/index.js';
import { mulberry32 } from '../src/core/rng.js';

export { assert, PARAMS, DEFAULT_PARAMS, VIEW_ONLY, setParams, resetParams, changedParams, LEVELS, CHALLENGES, TRAINING_LEVEL, findLevel, effectiveParams, generateLevel, validateLevel, routeInputs, expertRun, expertPlans, createDemoPilot, DEMO_LABELS, DEMO_SPEED, INTRO_SONG, CHORDS, createPraise, rankKey, normalizeNick, validNick, createLeaderboard, createProfileSync, mergeIntoSave, profileUpdate, createTelemetry, cleanFields, createFrameStats, createRunTracker, encodePoint, decodePath, createShip, fly, steer, landingForecast, createMatch, Sound, readIntent, touchThrust, emptySave, isUnlocked, defaultLevel, recordCompletion, levelState, nextLevel, CLASSIC_SHIP, mulberry32 };

// Nos testes, o canal de eventos é sempre estrito (#116): toda partida dos testes confere o contrato dos eventos
export const createEvents = (options = {}) => createEventsLoose({ strict: true, ...options });

// O código de jogo/src, como { 'core/ship.js': 'código' }, para os testes que leem o código (#112, #116)
const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '../src');
export function readSources(folder = SRC, out = {}) {
  for (const item of readdirSync(folder, { withFileTypes: true })) {
    const path = join(folder, item.name);
    if (item.isDirectory()) readSources(path, out);
    else if (item.name.endsWith('.js')) out[relative(SRC, path).split('\\').join('/')] = readFileSync(path, 'utf8');
  }
  return out;
}

export const tasks = [];
// completo: o teste cresce com o número de fases (cenários sorteados, piloto automático) e fica fora do --rapido
export function test(name, fn, { completo = false } = {}) { tasks.push([name, fn, completo]); }
export const testCompleto = (name, fn) => test(name, fn, { completo: true });

export const DT = 1 / 120;
export const NONE = { turn: 0, targetAngle: null, thrust: false };
export const UP = { turn: 0, targetAngle: null, thrust: true };
export const p = () => effectiveParams(PARAMS, LEVELS[0]);
export const airShip = () => ({ ...createShip({ x1: 0, x2: 0, y: 300 }, 1), state: 'flying' });
export function run(s, input, seconds, params = p()) {
  for (let t = 0; t < seconds; t += DT) fly(s, input, params, DT);
}

export const step = (match, input, seconds) => { for (let t = 0; t < seconds; t += DT) match.update(DT, input); };

export const physics = (def) => effectiveParams({ ...DEFAULT_PARAMS }, def);

// Joga uma rota do piloto numa partida de verdade: decola, voa cada trecho e, ao pousar,
// espera abastecer (posto) ou embarcar (tripulação) antes de decolar de novo
export function playRoute(match, legs) {
  const m = match.state;
  const UP_ = { turn: 0, targetAngle: null, thrust: true };
  for (const inputs of routeInputs(m.level, match.params(), legs)) {
    match.update(DT, UP_);
    for (const input of inputs) match.update(DT, input);
    if (m.over) return;
    for (let i = 0; i < 900 && (m.ship.state === 'boarding' || (m.ship.pad?.refuel && m.ship.fuel < 1)); i++) match.update(DT, NONE);
  }
}

export function memoryStorage() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
}
