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
const MAX_BODY_SIZE = 50 * 1024; // 50 KB max request body to prevent DoS

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

// ─── Global HTTP Security Headers ──────────────────────────────────────────
function setSecurityHeaders(res) {
  // Prevent clickjacking by restricting framing
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Permissions Policy (restrict sensitive hardware APIs)
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // Cross-Origin Opener Policy
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  // X-XSS-Protection legacy defense
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // HSTS in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://ajax.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "media-src 'self' data: blob:",
    "frame-src 'self' https://www.google.com/ https://www.youtube.com/ https://www.youtube-nocookie.com/ https://maps.google.com/",
    "connect-src 'self' https://www.google.com/recaptcha/ https://graph.facebook.com/",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
  res.setHeader('Content-Security-Policy', csp);
}

// ─── Clean URL → HTML file mapping ─────────────────────────────────────────
const CLEAN_ROUTES = {
  '/':          'index.html',
  '/about':     'about.html',
  '/doctors':   'doctors.html',
  '/services':  'services.html',
  '/gallery':   'gallery.html',
  '/contact':   'contact.html',
  '/blog':      'blog.html',
  '/booking':   'booking.html',
  '/privacy':   'privacy.html',
  '/terms':     'terms.html',
  '/cookies':   'cookies.html',
  '/licenses':  'licenses.html',
};

// ─── Legacy .html & Duplicate Route 301 Redirects ──────────────────────────
const HTML_REDIRECTS = {
  '/index.html':    '/',
  '/about.html':    '/about',
  '/service.html':  '/services',
  '/service':       '/services',
  '/services.html': '/services',
  '/gallery.html':  '/gallery',
  '/contact.html':  '/contact',
  '/blog.html':     '/blog',
  '/booking.html':  '/booking',
  '/privacy.html':  '/privacy',
  '/terms.html':    '/terms',
  '/cookies.html':  '/cookies',
  '/licenses.html': '/licenses',
  '/doctors.html':  '/doctors',
  '/doctors.htm':   '/doctors',
  '/index.htm':     '/',
  '/about.htm':     '/about',
  '/services.htm':  '/services',
  '/service.htm':   '/services',
};

// ─── Helper: safely read JSON body with size limits ───────────────────────
function parseJsonBody(req, maxBytes = MAX_BODY_SIZE) {
  return new Promise((resolve, reject) => {
    let body = '';
    let bytesReceived = 0;

    req.on('data', chunk => {
      bytesReceived += chunk.length;
      if (bytesReceived > maxBytes) {
        req.destroy();
        const err = new Error('Payload Too Large');
        err.statusCode = 413;
        reject(err);
        return;
      }
      body += chunk;
    });

    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (e) {
        const err = new Error('Invalid JSON Payload');
        err.statusCode = 400;
        reject(err);
      }
    });

    req.on('error', err => {
      reject(err);
    });
  });
}

// ─── Helper: serve a file with Range support & Path Traversal Prevention ───
function serveFile(req, res, filePath) {
  // Path Traversal Security Check: Ensure requested path stays strictly within __dirname
  const safeResolvedPath = path.resolve(filePath);
  if (!safeResolvedPath.startsWith(path.resolve(__dirname))) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  fs.stat(safeResolvedPath, (err, stats) => {
    if (err || !stats.isFile()) {
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

    const ext = path.extname(safeResolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const range = req ? req.headers?.range : null;

    if (range && stats.size > 0) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(safeResolvedPath, { start, end });
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
      fs.createReadStream(safeResolvedPath).pipe(res);
    }
  });
}

const server = http.createServer(async (req, res) => {
  // Set Global Security Headers
  setSecurityHeaders(res);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Helper to wrap Node http res with status().json()
  function wrapResponse(nodeRes) {
    nodeRes.status = function (statusCode) {
      this.statusCode = statusCode;
      return this;
    };
    nodeRes.json = function (data) {
      if (!this.headersSent) {
        this.setHeader('Content-Type', 'application/json');
      }
      this.end(JSON.stringify(data));
      return this;
    };
    return nodeRes;
  }

  // ── Handle Booking / Appointments / Callback / Contact API Routes ────────
  if (req.url.startsWith('/api/appointments')) {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json', 'Allow': 'POST' });
      res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
      return;
    }
    try {
      req.body = await parseJsonBody(req);
      const { default: handler } = await import('./api/appointments.js');
      await handler(req, wrapResponse(res));
    } catch (err) {
      const code = err.statusCode || 500;
      res.writeHead(code, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message || 'Unable to process request' }));
    }
    return;
  }

  if (req.url.startsWith('/api/callback')) {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json', 'Allow': 'POST' });
      res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
      return;
    }
    try {
      req.body = await parseJsonBody(req);
      const { default: handler } = await import('./api/callback.js');
      await handler(req, wrapResponse(res));
    } catch (err) {
      const code = err.statusCode || 500;
      res.writeHead(code, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message || 'Unable to process request' }));
    }
    return;
  }

  if (req.url.startsWith('/api/contact')) {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json', 'Allow': 'POST' });
      res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
      return;
    }
    try {
      req.body = await parseJsonBody(req);
      const { default: handler } = await import('./api/contact.js');
      await handler(req, wrapResponse(res));
    } catch (err) {
      const code = err.statusCode || 500;
      res.writeHead(code, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message || 'Unable to process request' }));
    }
    return;
  }

  if (req.url.startsWith('/api/booking')) {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json', 'Allow': 'POST' });
      res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
      return;
    }
    try {
      req.body = await parseJsonBody(req);
      const { default: handler } = await import('./api/booking.js');
      await handler(req, wrapResponse(res));
    } catch (err) {
      const code = err.statusCode || 500;
      res.writeHead(code, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message || 'Unable to process request' }));
    }
    return;
  }

  // ── Handle reCAPTCHA / Turnstile Verification API Routes ─────────────────
  if (req.url === '/api/verify-recaptcha' || req.url === '/api/verify-turnstile') {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json', 'Allow': 'POST' });
      res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
      return;
    }
    try {
      req.body = await parseJsonBody(req);
      const { default: handler } = await import('./api/verify-recaptcha.js');
      await handler(req, wrapResponse(res));
    } catch (err) {
      const code = err.statusCode || 500;
      res.writeHead(code, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message || 'Verification failed' }));
    }
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
  if (urlPath.startsWith('/blog/') && (urlPath.endsWith('.html') || urlPath.endsWith('.htm'))) {
    const cleanBlog = urlPath.replace(/\.html?$/i, '');
    res.writeHead(301, { Location: cleanBlog });
    res.end();
    return;
  }
  if (urlPath.startsWith('/services/') && (urlPath.endsWith('.html') || urlPath.endsWith('.htm'))) {
    const cleanService = urlPath.replace(/\.html?$/i, '');
    res.writeHead(301, { Location: cleanService });
    res.end();
    return;
  }

  // ── Step 2: Serve clean routes → mapped HTML files ────────────────────────
  const normalizedPath = urlPath.length > 1 ? urlPath.replace(/\/$/, '') : urlPath;

  if (CLEAN_ROUTES[normalizedPath]) {
    const filePath = path.join(__dirname, CLEAN_ROUTES[normalizedPath]);
    serveFile(req, res, filePath);
    return;
  }

  // Check for dynamic /blog/:slug route
  if (normalizedPath.startsWith('/blog/')) {
    const slug = normalizedPath.slice(6);
    const blogFilePath = path.join(__dirname, 'blog', `${slug}.html`);
    if (fs.existsSync(blogFilePath) && fs.statSync(blogFilePath).isFile()) {
      serveFile(req, res, blogFilePath);
      return;
    }
  }

  // Check for dynamic /services/:slug route
  if (normalizedPath.startsWith('/services/')) {
    const slug = normalizedPath.slice(10);
    const serviceFilePath = path.join(__dirname, 'services', `${slug}.html`);
    if (fs.existsSync(serviceFilePath) && fs.statSync(serviceFilePath).isFile()) {
      serveFile(req, res, serviceFilePath);
      return;
    }
  }

  // ── Step 3: Serve static assets (CSS, JS, images, fonts, etc.) ───────────
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
  console.log(`[Security Hardened] Redesign Clinics server running at http://localhost:${PORT}`);
  console.log('Clean URL routing & HTTP Security Headers active.');
});
