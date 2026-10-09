// Coleta uma amostra das fases do Candy Crush Saga pela interface de dados do wiki dos fãs (candycrush.fandom.com).
// Não abre o jogo: lê o que os fãs publicaram (tipo, jogadas, metas de estrela, dificuldade, novidades).
// Uso, na pasta do projeto: node docs/benchmark/casuais-do-icp/ferramentas/candy-crush.mjs  →  grava ../candy-crush.json
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://candycrush.fandom.com/api.php';
const RANGES = [[1, 80], [1001, 1015], [5001, 5015]];   // os primeiros episódios, onde o jogo ensina, e duas amostras adiante
const DIFF = ['Very_easy', 'Easy', 'Somewhat_easy', 'Medium', 'Somewhat_hard', 'Hard', 'Very_hard', 'Insanely_hard', 'Nearly_impossible'];
const NOT_EPISODE = /^(Levels_with|Levels$|Reality|Hexagon|Episode_finales|World_finales|Jelly|Ingredients|Candy_Order|Moves|Timed|Mixed|Rainbow)/;

async function level(n) {
  const url = `${API}?action=parse&page=Level_${n}&prop=wikitext|categories&redirects=1&format=json`;
  const j = await (await fetch(url, { headers: { 'User-Agent': 'resgate-espacial-benchmark/1.0' } })).json();
  if (!j.parse) return { n, missing: true };
  const w = j.parse.wikitext['*'];
  const cats = j.parse.categories.map((c) => c['*']);
  const box = (w.match(/\{\{Infobox level([\s\S]*?)\n\}\}/) || [])[1] || '';
  const field = (k) => {
    const line = box.split('\n').find((l) => l.replace(/\s/g, '').startsWith(`|${k}=`));
    return line ? line.slice(line.indexOf('=') + 1).trim() : '';
  };
  const stars = ((w.match(/\{\{Stars\|([\d,]+)\|([\d,]+)\|([\d,]+)/) || []).slice(1)).map((x) => Number(x.replace(/,/g, '')));
  const types = [['jelly', 'jelly'], ['ingredients', 'ingredients'], ['orders', 'order'], ['time', 'timed']].filter(([k]) => field(k)).map(([, t]) => t);
  const difficulty = DIFF.find((d) => cats.includes(`${d}_levels`));
  const episode = cats.find((c) => c.endsWith('_levels') && !NOT_EPISODE.test(c) && !DIFF.some((d) => c === `${d}_levels`));
  return {
    n,
    episode: episode ? episode.replace(/_levels$/, '').replace(/_/g, ' ') : null,
    types: types.length ? types : ['score'],
    moves: Number(field('moves')) || null,
    time: Number(field('time').replace(/\D/g, '')) || null,
    colors: field('preferred').replace(/\D/g, '').length || null,
    spaces: Number(field('spaces')) || null,
    stars,
    difficulty: difficulty ? difficulty.replace(/_/g, ' ') : null,
    newThing: cats.includes('Levels_with_new_things'),
    finale: cats.includes('Episode_finales'),
    blockers: field('blockers').replace(/\{\{Blocker\||\}\}/g, '').split('|').filter(Boolean),
  };
}

const out = [];
for (const [a, b] of RANGES) for (let n = a; n <= b; n++) out.push(await level(n));
const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'candy-crush.json');
writeFileSync(file, `${JSON.stringify({ fonte: 'candycrush.fandom.com (wiki dos fãs), consultado em 09/10/2026', fases: out }, null, 1)}\n`);
for (const l of out) {
  if (l.missing) { console.log(`${l.n}\t(sem página)`); continue; }
  console.log([l.n, l.episode ?? '', l.types.join('+'), l.moves ?? `${l.time}s`, l.colors ?? '', l.difficulty ?? '', l.newThing ? 'NOVIDADE' : '', l.finale ? 'FIM' : '', l.blockers.slice(0, 2).join(',')].join('\t'));
}
