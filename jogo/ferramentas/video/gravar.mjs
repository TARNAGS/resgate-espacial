// Grava o vídeo de apresentação do jogo (roteiro em roteiro.js). Abre o Chrome (ou o Edge) sem janela,
// desenha cada quadro com o código do jogo e salva o MP4 em jogo/ferramentas/saida/ (fora do Git).
//
//   node jogo/ferramentas/video/gravar.mjs                  os dois vídeos: inglês e português
//   node jogo/ferramentas/video/gravar.mjs --lingua en      só um
//   node jogo/ferramentas/video/gravar.mjs --fotos 1,4.5,9  só fotos (PNG) desses segundos, para conferir o roteiro
//
// Funciona no Windows e no Mac (precisa do Chrome ou do Edge instalado; outro caminho: variável CHROME).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openPage } from './chrome.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const jogo = path.resolve(here, '../..');
const saida = path.resolve(here, '../saida');
fs.mkdirSync(saida, { recursive: true });

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : null; };
const langs = opt('lingua') ? [opt('lingua')] : ['en', 'pt'];
const fotos = opt('fotos');

const page = await openPage(jogo, 'ferramentas/video/index.html', { log: (m) => console.log('  [página]', m) });
try {
  if (fotos) {
    const times = fotos.split(',').map(Number);
    for (const lang of langs) {
      const shots = await page.evaluate(`window.fotos(${JSON.stringify({ lang, times })})`);
      for (const [t, url] of Object.entries(shots)) {
        const file = path.join(saida, `video-foto-${lang}-${String(t).replace('.', '_')}s.png`);
        fs.writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'));
        console.log('foto', path.relative(process.cwd(), file));
      }
    }
  } else {
    for (const lang of langs) {
      const info = await page.evaluate(`window.gravar(${JSON.stringify({ lang })})`);
      const parts = [];
      const size = 2 ** 21;
      for (let i = 0; i * size < info.bytes; i++) parts.push(Buffer.from(await page.evaluate(`window.pedaco(${i}, ${size})`), 'base64'));
      const file = path.join(saida, `resgate-espacial-video-${lang}.mp4`);
      fs.writeFileSync(file, Buffer.concat(parts));
      const { soundList, ...rest } = info;
      console.log(`\n${path.relative(process.cwd(), file)} · ${(info.bytes / 1e6).toFixed(1)} MB`);
      console.log(rest);
      if (args.includes('--sons')) console.log(soundList.join('\n'));
      // Confere o arquivo como um player: abre, pula para a batida e decodifica o som
      const check = await page.evaluate(`window.conferir('../saida/${path.basename(file)}')`);
      const shot = path.join(saida, `video-conferencia-${lang}.png`);
      fs.writeFileSync(shot, Buffer.from(check.frame.split(',')[1], 'base64'));
      delete check.frame;
      console.log('conferência no player do Chrome:', check);
    }
  }
} finally {
  await page.close();
}
