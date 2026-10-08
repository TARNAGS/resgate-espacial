// O desenho só lê (#113): desenhar nunca muda o estado da partida.
// Com skins de nave, de propulsor e de obstáculos, muita gente vai mexer no desenho. Um desenho que escreve no
// estado mudaria a regra sem ninguém ver. Aqui o estado fica congelado: qualquer escrita vira erro.

import { test, assert, LEVELS, CHALLENGES, TRAINING_LEVEL } from '../lib.js';
import { SITUATIONS, drawFrozen, playFrames } from '../quadros.js';
import { SKINS } from '../../src/render/skins/index.js';

test('#113 o desenho só lê: em todas as fases, situações e skins (#124), desenhar não muda o estado da partida', () => {
  for (const def of [...LEVELS, ...CHALLENGES, TRAINING_LEVEL]) for (const skin of Object.keys(SKINS)) {
    for (const [name, prepare] of Object.entries(SITUATIONS)) {
      for (const device of [{ isTouch: true, scheme: 'twin' }, { isTouch: true, scheme: 'hold' }, { isTouch: false }]) {
        let calls;
        try {
          calls = drawFrozen(def, prepare, playFrames, { ...device, skin });
        } catch (e) {
          assert.fail(`${def.key} · ${skin} · ${name}${device.isTouch ? ` · toque ${device.scheme}` : ' · teclado'}: o desenho tentou mudar o estado (${e.message})`);
        }
        assert.ok(calls.length > 200, `${def.key} · ${name}: a tela de mentira quase não recebeu desenho (${calls.length} comandos)`);
      }
    }
  }
});

test('#113 o alarme funciona: um desenho que muda a posição da nave é pego', () => {
  const bad = (renderer, match) => { match.state.ship.x += 1; };
  assert.throws(() => drawFrozen(LEVELS[0], SITUATIONS['voando com o propulsor aceso'], bad), /read only|not extensible|Cannot assign/);
});
