// Chrome sem janela, controlado pelo protocolo do DevTools (sem dependências: o WebSocket já vem no Node 22+).
// Serve uma pasta por HTTP local, abre uma página dela e devolve uma função para rodar código na página.
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.mp4': 'video/mp4' };

const CANDIDATES = {
  win32: [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ],
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ],
  linux: ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'],
};

export function findBrowser() {
  const found = (CANDIDATES[process.platform] || []).find((p) => fs.existsSync(p));
  if (!found) throw new Error('Não achei o Chrome nem o Edge. Instale um deles ou passe o caminho em CHROME.');
  return process.env.CHROME || found;
}

function serve(root) {
  const server = http.createServer((req, res) => {
    let url = decodeURIComponent(req.url.split('?')[0]);
    if (url.endsWith('/')) url += 'index.html';
    const file = path.normalize(path.join(root, url));
    if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    });
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

export async function openPage(root, page, { log = () => {} } = {}) {
  const server = await serve(path.resolve(root));
  const port = server.address().port;
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'video-chrome-'));
  const chrome = spawn(findBrowser(), [
    '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--autoplay-policy=no-user-gesture-required',
    '--hide-scrollbars', '--mute-audio', 'about:blank',
  ], { stdio: 'ignore' });
  // O Chrome escreve a porta do DevTools num arquivo do perfil
  const portFile = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 200 && !fs.existsSync(portFile); i++) await new Promise((r) => setTimeout(r, 50));
  let text = '';
  for (let i = 0; i < 50 && text.split('\n').length < 2; i++) { text = fs.readFileSync(portFile, 'utf8'); await new Promise((r) => setTimeout(r, 20)); }
  const [devPort, wsPath] = text.trim().split('\n');
  const ws = new WebSocket(`ws://127.0.0.1:${devPort}${wsPath}`);
  await new Promise((ok, fail) => { ws.onopen = ok; ws.onerror = fail; });
  let id = 0;
  const waiting = new Map();
  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.id && waiting.has(data.id)) {
      const { ok, fail } = waiting.get(data.id);
      waiting.delete(data.id);
      if (data.error) fail(new Error(data.error.message)); else ok(data.result);
    } else if (data.method === 'Runtime.consoleAPICalled') {
      log(data.params.args.map((a) => a.value ?? a.description).join(' '));
    } else if (data.method === 'Runtime.exceptionThrown') {
      log('ERRO NA PÁGINA: ' + (data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text));
    }
  };
  const send = (method, params = {}, sessionId) => new Promise((ok, fail) => {
    id += 1;
    waiting.set(id, { ok, fail });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Runtime.enable', {}, sessionId);
  await send('Page.enable', {}, sessionId);
  await send('Page.navigate', { url: `http://127.0.0.1:${port}/${page}` }, sessionId);
  // Espera a página avisar que está pronta (window.pronto = true)
  for (let i = 0; i < 400; i++) {
    const r = await send('Runtime.evaluate', { expression: 'window.pronto === true', returnByValue: true }, sessionId);
    if (r.result.value) break;
    await new Promise((res) => setTimeout(res, 50));
  }
  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, sessionId);
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const close = async () => {
    try { await send('Browser.close'); } catch (_) { /* já fechou */ }
    ws.close();
    server.close();
    await new Promise((r) => setTimeout(r, 300));
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (_) { /* o Windows às vezes segura o perfil */ }
    chrome.kill();
  };
  return { evaluate, close };
}
