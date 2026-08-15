import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const i18nDir = path.join(__dirname, '..', 'assets', 'i18n');

const locales = ['en', 'te', 'hi', 'ar'];
const dictionaries = {};

console.log('🔍 Starting i18n Translation Validation...\n');

let hasError = false;

// 1. Load all locale files
for (const loc of locales) {
  const filePath = path.join(i18nDir, `${loc}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing locale file: ${filePath}`);
    hasError = true;
    continue;
  }
  try {
    dictionaries[loc] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`✓ Loaded ${loc}.json (${Object.keys(dictionaries[loc]).length} keys)`);
  } catch (err) {
    console.error(`❌ Failed to parse JSON in ${filePath}:`, err.message);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}

const enKeys = Object.keys(dictionaries['en']);
console.log(`\n📊 Reference base locale (en) has ${enKeys.length} keys.\n`);

// 2. Validate key parity and non-empty values for every target locale
for (const loc of locales) {
  if (loc === 'en') continue;

  const currentDict = dictionaries[loc];
  const currentKeys = new Set(Object.keys(currentDict));
  const missingKeys = [];
  const emptyKeys = [];

  for (const key of enKeys) {
    if (!currentKeys.has(key)) {
      missingKeys.push(key);
    } else {
      const val = currentDict[key];
      if (val === null || val === undefined || (typeof val === 'string' && val.trim() === '')) {
        emptyKeys.push(key);
      }
    }
  }

  const extraKeys = Object.keys(currentDict).filter(k => !dictionaries['en'].hasOwnProperty(k));

  if (missingKeys.length > 0) {
    console.error(`❌ [${loc}.json] Missing ${missingKeys.length} keys!`);
    console.error(`   Sample missing:`, missingKeys.slice(0, 10));
    hasError = true;
  }

  if (emptyKeys.length > 0) {
    console.error(`❌ [${loc}.json] Has ${emptyKeys.length} empty translation values!`);
    console.error(`   Sample empty:`, emptyKeys.slice(0, 10));
    hasError = true;
  }

  if (extraKeys.length > 0) {
    console.warn(`⚠️  [${loc}.json] Has ${extraKeys.length} extra keys not in en.json:`, extraKeys.slice(0, 5));
  }

  if (missingKeys.length === 0 && emptyKeys.length === 0) {
    console.log(`✓ [${loc}.json] 100% key parity & coverage verified.`);
  }
}

if (hasError) {
  console.error('\n❌ i18n validation FAILED! Please fix missing or empty translations.\n');
  process.exit(1);
} else {
  console.log('\n🎉 i18n validation PASSED! All 4 languages have 100% key parity and complete coverage.\n');
}
