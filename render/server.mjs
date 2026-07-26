// Minimal static file server for the design project directory.
// The reel is rendered from a real HTTP origin (never file://) so the
// Claude Design runtime's relative fetches of .jsx / .css / img behave
// exactly as they do in the design tool.

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.jsx': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.md': 'text/markdown; charset=utf-8',
};

export async function startServer(root, port = 0) {
  const rootAbs = path.resolve(root);

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const rel = decodeURIComponent(url.pathname).replace(/^\/+/, '');
      const target = path.resolve(rootAbs, rel);
      // Never serve outside the project root.
      if (target !== rootAbs && !target.startsWith(rootAbs + path.sep)) {
        res.writeHead(403).end('forbidden');
        return;
      }
      const stat = await fs.stat(target);
      const file = stat.isDirectory() ? path.join(target, 'index.html') : target;
      const body = await fs.readFile(file);
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Content-Length': body.length,
        'Cache-Control': 'no-store',
      }).end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });

  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  const { port: actual } = server.address();
  return {
    origin: `http://127.0.0.1:${actual}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}
