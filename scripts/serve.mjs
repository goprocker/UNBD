import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', 'dist');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  let target = resolve(root, relative);

  if (!target.startsWith(root)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  try {
    let details = await stat(target);
    if (details.isDirectory()) {
      target = resolve(target, 'index.html');
      details = await stat(target);
    }
    if (!details.isFile()) throw new Error('Not a file');
    response.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream' });
    createReadStream(target).pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
});

server.listen(port, '127.0.0.1', () => console.log(`UNBD preview: http://127.0.0.1:${port}`));
