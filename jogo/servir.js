// Servidor local mínimo para abrir o jogo no navegador (Mac e Windows).
// Uso, na pasta do projeto: node jogo/servir.js  →  http://localhost:8081
// No celular, no mesmo Wi-Fi: http://<IP do computador>:8081
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.dirname(fileURLToPath(import.meta.url));
const porta = Number(process.env.PORT) || 8081;
const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (url.endsWith('/')) url += 'index.html';
  const arquivo = path.normalize(path.join(raiz, url));
  if (!arquivo.startsWith(raiz)) {
    res.writeHead(403);
    return res.end();
  }
  fs.readFile(arquivo, (erro, dados) => {
    if (erro) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Não encontrado');
    }
    res.writeHead(200, { 'Content-Type': tipos[path.extname(arquivo)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(dados);
  });
}).listen(porta, () => console.log(`Jogo em http://localhost:${porta}`));
