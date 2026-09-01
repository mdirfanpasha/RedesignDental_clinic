import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load locales
const en = JSON.parse(fs.readFileSync(path.join(rootDir, 'assets', 'i18n', 'en.json'), 'utf-8'));
const te = JSON.parse(fs.readFileSync(path.join(rootDir, 'assets', 'i18n', 'te.json'), 'utf-8'));
const hi = JSON.parse(fs.readFileSync(path.join(rootDir, 'assets', 'i18n', 'hi.json'), 'utf-8'));
const ar = JSON.parse(fs.readFileSync(path.join(rootDir, 'assets', 'i18n', 'ar.json'), 'utf-8'));

console.log('=== I18N DICTIONARY AUDIT ===');
console.log(`EN Keys: ${Object.keys(en).length}`);
console.log(`TE Keys: ${Object.keys(te).length}`);
console.log(`HI Keys: ${Object.keys(hi).length}`);
console.log(`AR Keys: ${Object.keys(ar).length}`);

// Check key parity
const enKeys = new Set(Object.keys(en));
const teKeys = new Set(Object.keys(te));
const hiKeys = new Set(Object.keys(hi));
const arKeys = new Set(Object.keys(ar));

const missingInTe = [...enKeys].filter(k => !teKeys.has(k));
const missingInHi = [...enKeys].filter(k => !hiKeys.has(k));
const missingInAr = [...enKeys].filter(k => !arKeys.has(k));

console.log(`Missing in TE: ${missingInTe.length}`);
console.log(`Missing in HI: ${missingInHi.length}`);
console.log(`Missing in AR: ${missingInAr.length}`);

// Check HTML files for data-i18n coverage
function scanHtml(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const dataI18nMatches = (content.match(/data-i18n="([^"]+)"/g) || []).map(m => m.match(/data-i18n="([^"]+)"/)[1]);
  const missingKeys = dataI18nMatches.filter(k => !enKeys.has(k));
  return {
    file: path.relative(rootDir, filePath),
    taggedCount: dataI18nMatches.length,
    missingFromDict: missingKeys
  };
}

console.log('\n=== ROOT HTML SCAN ===');
const rootHtmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
rootHtmlFiles.forEach(f => {
  const res = scanHtml(path.join(rootDir, f));
  console.log(`${res.file.padEnd(20)}: ${res.taggedCount} tags, ${res.missingFromDict.length} missing keys`);
});

console.log('\n=== SERVICES SAMPLE SCAN ===');
const serviceFiles = fs.readdirSync(path.join(rootDir, 'services')).filter(f => f.endsWith('.html')).slice(0, 5);
serviceFiles.forEach(f => {
  const res = scanHtml(path.join(rootDir, 'services', f));
  console.log(`${res.file.padEnd(35)}: ${res.taggedCount} tags, ${res.missingFromDict.length} missing keys`);
});

console.log('\n=== BLOG SAMPLE SCAN ===');
const blogFiles = fs.readdirSync(path.join(rootDir, 'blog')).filter(f => f.endsWith('.html')).slice(0, 5);
blogFiles.forEach(f => {
  const res = scanHtml(path.join(rootDir, 'blog', f));
  console.log(`${res.file.padEnd(35)}: ${res.taggedCount} tags, ${res.missingFromDict.length} missing keys`);
});
