import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, '..', 'assets', 'i18n');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const localesDir = path.join(__dirname, 'locales');

function loadLocale(file) {
  const raw = fs.readFileSync(path.join(localesDir, file), 'utf-8');
  const jsonStr = raw.replace(/^\s*module\.exports\s*=\s*/, '').replace(/;\s*$/, '');
  return JSON.parse(jsonStr);
}

const enData = loadLocale('en.js');
const teData = loadLocale('te.js');
const hiData = loadLocale('hi.js');
const arData = loadLocale('ar.js');

console.log('Writing translation files...');
fs.writeFileSync(path.join(outDir, 'en.json'), JSON.stringify(enData, null, 2), 'utf-8');
fs.writeFileSync(path.join(outDir, 'te.json'), JSON.stringify(teData, null, 2), 'utf-8');
fs.writeFileSync(path.join(outDir, 'hi.json'), JSON.stringify(hiData, null, 2), 'utf-8');
fs.writeFileSync(path.join(outDir, 'ar.json'), JSON.stringify(arData, null, 2), 'utf-8');

// Bundle into JavaScript file for instant zero-flash sync loading
const bundleJs = `/**
 * Redesign Clinics — Complete Multilingual Dictionary Bundle
 * Embedded for instantaneous zero-flash loading across static HTML pages.
 */
window.__RC_TRANSLATIONS__ = {
  en: ${JSON.stringify(enData)},
  te: ${JSON.stringify(teData)},
  hi: ${JSON.stringify(hiData)},
  ar: ${JSON.stringify(arData)}
};
`;

fs.writeFileSync(path.join(outDir, 'translations.js'), bundleJs, 'utf-8');
console.log('✓ Successfully created en.json, te.json, hi.json, ar.json, and translations.js');
