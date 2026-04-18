const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || '0.0.0.0';
const ROOT = __dirname;

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp'
};

function getLanUrls(port) {
  const interfaces = os.networkInterfaces();
  const urls = [];

  for (const entries of Object.values(interfaces)) {
    for (const entry of entries || []) {
      if (entry.family === 'IPv4' && !entry.internal) {
        urls.push(`http://${entry.address}:${port}`);
      }
    }
  }

  return urls;
}

function safeJoin(baseDir, requestPath) {
  const targetPath = path.resolve(baseDir, '.' + requestPath);
  if (!targetPath.startsWith(baseDir)) {
    return null;
  }
  return targetPath;
}

function resolveFilePath(requestPath) {
  const normalizedPath = requestPath === '/' ? '/index.html' : requestPath;
  const candidates = [normalizedPath];

  if (!path.extname(normalizedPath)) {
    candidates.push(`${normalizedPath}.html`);
    candidates.push(path.posix.join(normalizedPath, 'index.html'));
  }

  for (const candidate of candidates) {
    const filePath = safeJoin(ROOT, decodeURIComponent(candidate));
    if (!filePath) {
      continue;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return filePath;
    }
  }

  return null;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const filePath = resolveFilePath(url.pathname);

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = contentTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('500 Internal Server Error');
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=300'
    });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`RegiSmart demo server running on http://localhost:${PORT}`);

  const lanUrls = getLanUrls(PORT);
  if (lanUrls.length) {
    console.log('Open from other devices on the same network:');
    for (const url of lanUrls) {
      console.log(`  ${url}`);
    }
  }
});
