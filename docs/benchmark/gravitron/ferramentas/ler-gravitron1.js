// Lê um arquivo de fase do GraviTron (2006). O código do jogo se perdeu (o autor conta isso no site),
// então o formato foi deduzido dos próprios arquivos, comparando com o do Gravitron 2. Ver README.md.
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'originais', 'g1');

// Tamanho de cada registro de objeto, em bytes, por tipo. Todos começam com tipo, rotação, x e y (16 bytes).
const TAMANHO = {
  0: 16, 1: 60, 2: 32, 3: 20, 4: 16, 5: 16, 6: 16, 7: 16, 8: 16, 9: 16, 10: 44, 11: 36, 12: 16, 13: 16,
  14: 16, 15: 16, 16: 16, 17: 16, 18: 78, 19: 32, 20: 16, 21: 16, 22: 16, 23: 16, 24: 16, 25: 16, 26: 16,
};

const str = (b, o, l) => b.slice(o, o + l).toString('latin1').replace(/\0[\s\S]*$/, '');

function ler(arquivo) {
  const b = fs.readFileSync(path.join(DIR, arquivo));
  const nLinhas = b.readInt32LE(0);
  const nObjetos = b.readInt32LE(4);
  let o = 8;
  // Terreno: 40 bytes por segmento (início, cor, fim, cor)
  const linhas = [];
  for (let i = 0; i < nLinhas; i++, o += 40) {
    linhas.push({ s: [b.readFloatLE(o), b.readFloatLE(o + 4)], corS: [b.readFloatLE(o + 8), b.readFloatLE(o + 12), b.readFloatLE(o + 16)], e: [b.readFloatLE(o + 20), b.readFloatLE(o + 24)], corE: [b.readFloatLE(o + 28), b.readFloatLE(o + 32), b.readFloatLE(o + 36)] });
  }
  const objetos = [];
  for (let k = 0; k < nObjetos; k++) {
    const t = b.readInt32LE(o);
    if (!(t in TAMANHO)) throw new Error(`${arquivo}: tipo desconhecido ${t} no objeto ${k}`);
    const e = { t, rot: b.readFloatLE(o + 4), x: b.readFloatLE(o + 8), y: b.readFloatLE(o + 12) };
    if (t === 1) { e.nome = str(b, o + 16, 16); e.par = str(b, o + 32, 16); }   // campo de força: nome e o que o desliga
    if (t === 2 || t === 19) e.nome = str(b, o + 16, 16);                         // botão e ponto de destino
    if (t === 3) e.valor = b.readInt32LE(o + 16);
    if (t === 10) { e.nome = str(b, o + 16, 16); e.porTick = b.readFloatLE(o + 32); e.maxRot = b.readInt32LE(o + 36); e.raio = b.readInt32LE(o + 40); }
    if (t === 11) { e.nome = str(b, o + 16, 16); e.tamanho = b.readInt32LE(o + 32); }
    if (t === 18) { e.nome = str(b, o + 16, 16); e.inicio = str(b, o + 32, 16); e.fim = str(b, o + 48, 16); e.tamanho = b.readInt32LE(o + 64); e.velocidade = b.readFloatLE(o + 68); e.espera = b.readFloatLE(o + 72); }
    objetos.push(e);
    o += TAMANHO[t];
  }
  // Rodapé de 42 bytes: nome da fase (32), senha (6) e um número por fase (função não confirmada)
  if (b.length - o !== 42) throw new Error(`${arquivo}: rodapé com ${b.length - o} bytes, esperado 42`);
  return { jogo: 1, arquivo, nome: str(b, o, 32), senha: str(b, o + 32, 6), numero: b.readInt32LE(o + 38), linhas, objetos };
}

module.exports = { ler, DIR, TAMANHO };
