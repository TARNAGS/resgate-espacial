import { fmtTime } from '../core/math.js';

// Tela de ranking (#87): uma aba por fase (níveis, PRACTICE e BONUS), com os melhores tempos de
// cada nickname, do mais rápido ao mais lento. O nick de quem está jogando fica destacado.

const CONTROL_LABEL = { twin: 'A', hold: 'B', keys: 'KB' };

export function createRankingScreen({ el, leaderboard, levels, keyOf, getNick, onClick }) {
  let current = levels[0];
  let request = 0;

  function tabs() {
    const box = el('rank-tabs');
    box.innerHTML = '';
    for (const lv of levels) {
      const b = document.createElement('button');
      b.className = `btn${lv.key === current.key ? ' active' : ''}`;
      b.textContent = lv.number ? `${lv.number}` : lv.name;
      b.title = lv.name;
      b.onclick = () => { onClick(); show(lv); };
      box.appendChild(b);
    }
  }

  async function show(lv = current) {
    current = lv;
    tabs();
    const id = ++request;
    const list = el('rank-list');
    list.innerHTML = '';
    el('rank-status').textContent = `${lv.number ? `LEVEL ${lv.number} · ` : ''}${lv.name} · loading...`;
    const { online, list: rows } = await leaderboard.top(keyOf(lv));
    if (id !== request) return;   // o jogador já trocou de aba
    const where = online ? 'online ranking' : leaderboard.online ? 'offline: showing this device only' : 'this device only (online ranking not set up yet)';
    el('rank-status').textContent = `${lv.number ? `LEVEL ${lv.number} · ` : ''}${lv.name} · ${where}`;
    const me = getNick();
    if (!rows.length) {
      const li = document.createElement('li');
      li.textContent = 'No times yet. Be the first!';
      list.appendChild(li);
      return;
    }
    rows.slice(0, 10).forEach((r, i) => {
      const li = document.createElement('li');
      if (r.nick === me) li.className = 'me';
      for (const [cls, text] of [['pos', `${i + 1}.`], ['nick', r.nick], ['time', fmtTime(r.time)], ['ctrl', CONTROL_LABEL[r.control] || '']]) {
        const span = document.createElement('span');
        span.className = cls;
        span.textContent = text;
        li.appendChild(span);
      }
      list.appendChild(li);
    });
    // Se o jogador não está entre os 10, mostra a posição dele no fim
    const pos = rows.findIndex((r) => r.nick === me);
    if (pos >= 10) {
      const li = document.createElement('li');
      li.className = 'me';
      li.textContent = `${pos + 1}. ${me} ${fmtTime(rows[pos].time)}`;
      list.appendChild(li);
    }
  }

  return { show, select(lv) { current = lv; } };
}
