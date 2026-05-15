const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT       = 3000;
const ROOT       = __dirname;
const PHOTOS_DIR = path.join(ROOT, 'photos');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg']);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg':  'image/svg+xml',
};

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://localhost:${PORT}`).pathname;

  // Dynamically build manifest on every request — no script needed
  if (pathname === '/manifest.json') {
    const photos = fs.readdirSync(PHOTOS_DIR)
      .filter(f => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort()
      .map(f => `photos/${f}`);
    res.writeHead(200, { 'Content-Type': MIME['.json'] });
    res.end(JSON.stringify(photos));
    return;
  }

  // Resolve file path and guard against directory traversal
  const filePath = path.normalize(
    path.join(ROOT, pathname === '/' ? 'index.html' : pathname)
  );
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Gallery running at http://localhost:${PORT}`);
});
