// Lê um arquivo de fase do Gravitron 2 (.map), no formato do código-fonte que o autor publicou em 2012
// (Engine::LoadMap, em Engine.cpp). Números em little-endian; "bool" ocupa 1 byte; nomes têm 16 bytes.
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'originais', 'g2');

const str = (b, o, l) => b.slice(o, o + l).toString('latin1').replace(/\0[\s\S]*$/, '');

function ler(nome) {
  const b = fs.readFileSync(path.join(DIR, nome + '.map'));
  let o = 0;
  const I = () => { const v = b.readInt32LE(o); o += 4; return v; };
  const F = () => { const v = b.readFloatLE(o); o += 4; return v; };
  const S = () => { const v = str(b, o, 16); o += 16; return v; };
  const B = () => b[o++];

  // Terreno: segmentos de reta ("beams"), com início, fim, cor de cada ponta, direção e normal
  const linhas = [];
  for (let i = 0, n = I(); i < n; i++) {
    linhas.push({ s: [F(), F()], e: [F(), F()], corS: [F(), F(), F()], corE: [F(), F(), F()], dir: [F(), F()], normal: [F(), F()] });
  }
  // Objetos: tipo, posição e rotação; alguns tipos têm campos a mais
  const objetos = [];
  for (let i = 0, n = I(); i < n; i++) {
    const e = { t: I(), x: F(), y: F(), rot: F() };
    if (e.t === 6) e.aciona = S();                       // botão
    if (e.t === 7 || e.t === 15) {                       // laser e jato
      e.aciona = S(); e.ligado = F(); e.desligado = F();
      if (e.t === 7) e.espera = F();
      e.comecaLigado = B();
    }
    if (e.t === 16) { e.w = F(); e.h = F(); }            // blocos
    objetos.push(e);
  }
  const alvos = [];
  for (let i = 0, n = I(); i < n; i++) alvos.push({ x: F(), y: F(), nome: S() });
  const giram = [];
  for (let i = 0, n = I(); i < n; i++) {
    giram.push({ x: F(), y: F(), raio: F(), nome: S(), alvo: S(), aciona: S(), maxRot: I(), porTick: F(), espera: F(), volta: B(), comecaLigado: B() });
  }
  const andam = [];
  for (let i = 0, n = I(); i < n; i++) {
    andam.push({ x: F(), y: F(), w: F(), h: F(), nome: S(), inicio: S(), fim: S(), aciona: S(), tempo: F(), espera: F(), esperaInicial: F(), comecaLigado: B() });
  }
  const gatilhos = [];
  for (let i = 0, n = I(); i < n; i++) gatilhos.push({ x: F(), y: F(), w: F(), h: F(), aciona: S(), umaVez: B() });

  if (o !== b.length) throw new Error(`${nome}: sobraram ${b.length - o} bytes`);
  return { jogo: 2, nome, linhas, objetos, alvos, giram, andam, gatilhos };
}

module.exports = { ler, DIR };
