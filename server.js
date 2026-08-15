import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyRecaptcha } from './lib/verifyRecaptcha.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local or .env if present
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const parts = trimmed.split('=');
          const key = parts[0].trim();
          const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
    }
  }
}

loadEnv();

const PORT = process.env.PORT || 8000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.ogg': 'video/ogg',
  '.m4v': 'video/mp4',
};

// ─── Clean URL → HTML file mapping ─────────────────────────────────────────
// Maps every clean public route to its corresponding .html file on disk.
const CLEAN_ROUTES = {
  '/':          'index.html',
  '/about':     'about.html',
  '/services':  'service.html',
  '/gallery':   'gallery.html',
  '/contact':   'contact.html',
  '/blog':      'blog.html',
  '/privacy':   'privacy.html',
  '/terms':     'terms.html',
  '/cookies':   'cookies.html',
  '/licenses':  'licenses.html',
};

// ─── Legacy .html Redirects ────────────────────────────────────────────────
const HTML_REDIRECTS = {
  '/index.html':    '/',
  '/about.html':    '/about',
  '/service.html':  '/services',
  '/gallery.html':  '/gallery',
  '/contact.html':  '/contact',
  '/blog.html':     '/blog',
  '/privacy.html':  '/privacy',
  '/terms.html':    '/terms',
  '/cookies.html':  '/cookies',
  '/licenses.html': '/licenses',
  // Also handle common variants
  '/index.htm':     '/',
  '/about.htm':     '/about',
  '/services.html': '/services',  // In case anyone links to services.html
  '/services.htm':  '/services',
};

// ─── Helper: serve a file with Range support ───────────────────────────────
function serveFile(req, res, filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Serve 404 page
      const notFoundPath = path.join(__dirname, '404.html');
      fs.stat(notFoundPath, (e2, s2) => {
        if (!e2 && s2.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          fs.createReadStream(notFoundPath).pipe(res);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 Not Found</h1>');
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const range = req ? req.headers?.range : null;

    if (range && stats.size > 0) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stats.size,
        'Accept-Ranges': 'bytes',
        'Content-Type': contentType
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
}

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ── Handle reCAPTCHA / Turnstile Verification API Routes ─────────────────
  if ((req.url === '/api/verify-recaptcha' || req.url === '/api/verify-turnstile') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const token = parsed.token;
        const remoteIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;

        const result = await verifyRecaptcha(token, remoteIp);

        if (result.success) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'reCAPTCHA verified successfully' }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: result.error || 'reCAPTCHA verification failed' }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Internal server error' }));
      }
    });
    return;
  }

  // ── Parse URL (strip query string, normalize, decode) ─────────────────────
  let rawPath = req.url.split('?')[0];
  try {
    rawPath = decodeURIComponent(rawPath);
  } catch (e) {}
  const urlPath = path.posix.normalize(rawPath).replace(/^(\.\.\/)+/, '') || '/';

  // ── Step 1: 301 redirect legacy .html URLs → clean routes ─────────────────
  if (HTML_REDIRECTS[urlPath]) {
    res.writeHead(301, { Location: HTML_REDIRECTS[urlPath] });
    res.end();
    return;
  }

  // ── Step 2: Serve clean routes → mapped HTML files ────────────────────────
  // Strip trailing slash for matching (except root)
  const normalizedPath = urlPath.length > 1 ? urlPath.replace(/\/$/, '') : urlPath;

  if (CLEAN_ROUTES[normalizedPath]) {
    const filePath = path.join(__dirname, CLEAN_ROUTES[normalizedPath]);
    serveFile(req, res, filePath);
    return;
  }

  // ── Step 3: Serve static assets (CSS, JS, images, fonts, etc.) ───────────
  // Anything with a file extension that is NOT .html/.htm is served directly.
  const ext = path.extname(urlPath).toLowerCase();
  if (ext && ext !== '.html' && ext !== '.htm') {
    const assetPath = path.join(__dirname, urlPath);
    serveFile(req, res, assetPath);
    return;
  }

  // ── Step 4: 404 ───────────────────────────────────────────────────────────
  const notFoundPath = path.join(__dirname, '404.html');
  fs.stat(notFoundPath, (err, stats) => {
    if (!err && stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(notFoundPath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Redesign Clinics server running at http://localhost:${PORT}`);
  console.log('Clean URL routing active:');
  Object.entries(CLEAN_ROUTES).forEach(([route, file]) => {
    console.log(`  ${route.padEnd(12)} → ${file}`);
  });
});
