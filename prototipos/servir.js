// Servidor local mínimo para abrir os protótipos no navegador (Mac e Windows).
// Uso, na pasta do projeto: node prototipos/servir.js  →  http://localhost:8080/01/
const http = require('http');
const fs = require('fs');
const path = require('path');

const raiz = __dirname;
const porta = Number(process.env.PORT) || 8080;
const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.md': 'text/plain; charset=utf-8',
};

http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/') {
    res.writeHead(302, { Location: '/01/' });
    return res.end();
  }
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
}).listen(porta, () => console.log(`Protótipos em http://localhost:${porta}/01/`));
