import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4173;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.mjs': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = parsedUrl.pathname;

  // Root / returns 404 per GitHub Pages subpath rule
  if (!pathname.startsWith('/everthread')) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found (Only /everthread/ subpath is hosted)');
    return;
  }

  // Strip /everthread prefix
  let relativePath = pathname.slice('/everthread'.length);
  if (relativePath === '' || relativePath === '/') {
    relativePath = '/index.html';
  }

  const filePath = path.join(DIST_DIR, relativePath);

  // Check if file exists and is inside DIST_DIR
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // Return dist/404.html with status 404 (GitHub Pages SPA fallback behavior)
    const fallback404 = path.join(DIST_DIR, '404.html');
    if (fs.existsSync(fallback404)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      fs.createReadStream(fallback404).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Pages emulation server running at http://127.0.0.1:${PORT}/everthread/`);
});

export default server;
