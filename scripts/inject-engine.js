/**
 * Inject rc-i18n-engine.js script tag into all pages that already have translations.js
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..');
const PAGES = ['index.html','about.html','service.html','gallery.html','blog.html','contact.html'];
const ENGINE_SRC = 'assets/i18n/rc-i18n-engine.js';
const TRANSLATIONS_SRC = 'assets/i18n/translations.js';

let injected = 0;
let skipped = 0;

for (const page of PAGES) {
  const filePath = path.join(DIR, page);
  if (!fs.existsSync(filePath)) { console.log(`SKIP (not found): ${page}`); skipped++; continue; }

  let html = fs.readFileSync(filePath, 'utf8');

  // Already injected?
  if (html.includes(ENGINE_SRC)) {
    console.log(`SKIP (already injected): ${page}`);
    skipped++;
    continue;
  }

  // Find translations.js script tag and inject engine immediately after
  const marker = `<script src="${TRANSLATIONS_SRC}"></script>`;
  if (!html.includes(marker)) {
    console.log(`SKIP (no translations.js found): ${page}`);
    skipped++;
    continue;
  }

  const engineTag = `<script src="${ENGINE_SRC}"></script>`;
  html = html.replace(marker, `${marker}\n        ${engineTag}`);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✓ Injected engine into: ${page}`);
  injected++;
}

console.log(`\nDone: ${injected} pages updated, ${skipped} skipped.`);
