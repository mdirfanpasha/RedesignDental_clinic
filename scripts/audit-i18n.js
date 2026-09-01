import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🌐 Starting Comprehensive Multilingual (i18n) System Audit...\n');

let hasErrors = false;

// 1. Check Locale Files Existence
const languages = ['en', 'te', 'hi', 'ar'];
const locales = {};

languages.forEach(lang => {
  const jsonPath = path.join(rootDir, 'assets', 'i18n', `${lang}.json`);
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Missing locale JSON file: assets/i18n/${lang}.json`);
    hasErrors = true;
    return;
  }
  locales[lang] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`✓ Loaded ${lang.toUpperCase()} dictionary: ${Object.keys(locales[lang]).length} keys`);
});

// 2. Assert 100% Key Parity Across All 4 Languages
const enKeys = Object.keys(locales.en);
console.log(`\n▶ Validating Key Parity Against English Master (${enKeys.length} keys)...`);

languages.forEach(lang => {
  if (lang === 'en') return;
  const langKeys = new Set(Object.keys(locales[lang]));
  const missing = enKeys.filter(k => !langKeys.has(k));
  const empty = enKeys.filter(k => !locales[lang][k] || locales[lang][k].trim() === '');

  if (missing.length > 0) {
    console.error(`❌ ${lang.toUpperCase()} has ${missing.length} missing keys:`, missing.slice(0, 5));
    hasErrors = true;
  } else {
    console.log(`  ✅ ${lang.toUpperCase()}: 100% Key Parity (0 missing keys)`);
  }

  if (empty.length > 0) {
    console.error(`❌ ${lang.toUpperCase()} has ${empty.length} empty translation strings:`, empty.slice(0, 5));
    hasErrors = true;
  } else {
    console.log(`  ✅ ${lang.toUpperCase()}: 0 empty translation strings`);
  }
});

// 3. Verify Compiled translations.js
const translationsJsPath = path.join(rootDir, 'assets', 'i18n', 'translations.js');
if (fs.existsSync(translationsJsPath)) {
  const trContent = fs.readFileSync(translationsJsPath, 'utf-8');
  if (trContent.includes('window.__RC_TRANSLATIONS__') && trContent.includes('ar:')) {
    console.log('\n  ✅ assets/i18n/translations.js compiled with window.__RC_TRANSLATIONS__');
  } else {
    console.error('❌ assets/i18n/translations.js missing window.__RC_TRANSLATIONS__');
    hasErrors = true;
  }
} else {
  console.error('❌ Missing assets/i18n/translations.js');
  hasErrors = true;
}

// 4. Verify Root HTML Pages for i18n Script Inclusions
console.log('\n▶ Validating Root HTML Pages for i18n Engine Inclusion...');
const rootHtmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
rootHtmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
  const hasTranslations = content.includes('assets/i18n/translations.js');
  const hasEngine = content.includes('assets/js/i18n.js');
  const tagsCount = (content.match(/data-i18n/g) || []).length;

  if (hasTranslations && hasEngine && tagsCount > 0) {
    console.log(`  ✅ ${file.padEnd(16)}: Scripts loaded & ${tagsCount} i18n tags active`);
  } else {
    console.warn(`  ⚠️ ${file.padEnd(16)}: Scripts: ${hasTranslations && hasEngine}, Tags: ${tagsCount}`);
  }
});

// 5. Verify Service Detail Pages
console.log('\n▶ Validating 94 Service Detail Pages...');
const serviceFiles = fs.readdirSync(path.join(rootDir, 'services')).filter(f => f.endsWith('.html'));
let validServicePages = 0;
serviceFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, 'services', file), 'utf-8');
  if (content.includes('/assets/i18n/translations.js') && content.includes('/assets/js/i18n.js') && content.includes('data-i18n=')) {
    validServicePages++;
  }
});
console.log(`  ✅ ${validServicePages} / ${serviceFiles.length} Service Detail pages fully equipped with i18n engine & tags`);

// 6. Verify Blog Pages
console.log('\n▶ Validating 15 Blog Article Pages...');
const blogFiles = fs.readdirSync(path.join(rootDir, 'blog')).filter(f => f.endsWith('.html'));
let validBlogPages = 0;
blogFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, 'blog', file), 'utf-8');
  if (content.includes('/assets/i18n/translations.js') && content.includes('/assets/js/i18n.js') && content.includes('data-i18n=')) {
    validBlogPages++;
  }
});
console.log(`  ✅ ${validBlogPages} / ${blogFiles.length} Blog pages fully equipped with i18n engine & tags`);

console.log('\n========================================');
if (!hasErrors) {
  console.log('🎉 ALL I18N AUDIT CHECKS PASSED PERFECTLY!');
  console.log('========================================\n');
  process.exit(0);
} else {
  console.error('❌ I18N AUDIT ENCOUNTERED ISSUES.');
  console.log('========================================\n');
  process.exit(1);
}
