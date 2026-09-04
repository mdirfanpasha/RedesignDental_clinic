const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function updateFile(relativePath, replacements) {
  const filePath = path.join(rootDir, relativePath);
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;

  for (const { target, replacement } of replacements) {
    if (content.includes(target)) {
      content = content.replace(target, replacement);
      count++;
      console.log(`[${relativePath}] Replaced: ${target.slice(0, 40)}...`);
    } else {
      console.warn(`[${relativePath}] WARNING: Target not found: ${target.slice(0, 40)}...`);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[${relativePath}] Successfully applied ${count} updates.\n`);
}

// 1. Update index.html
updateFile('index.html', [
  {
    target: '<h1 hero-text-split=""\n                                        style="transform: none; opacity: 1;"',
    replacement: '<h1 style="transform: none; opacity: 1;"'
  },
  {
    target: '<h1 hero-text-split=""\r\n                                        style="transform: none; opacity: 1;"',
    replacement: '<h1 style="transform: none; opacity: 1;"'
  },
  {
    target: 'aria-label="Watch Dr. Suhail - Meet Dr. Suhail A. Syed - Interactive video card. Click or hover to watch video introduction."',
    replacement: 'aria-label="▶ Watch Dr. Suhail - Meet Dr. Suhail A. Syed - Interactive video card. Click or hover to watch video introduction."'
  },
  {
    target: 'aria-label="@redesign.dental.clinics - Follow Redesign Dental Clinics on Instagram"',
    replacement: 'aria-label="@redesign.dental.clinics • Follow Us on Instagram"'
  }
]);

// 2. Update doctors.html
updateFile('doctors.html', [
  {
    target: 'aria-label="Meet Dr. Suhail A. Syed - Interactive video card. Click or hover to watch video introduction."',
    replacement: 'aria-label="▶ Watch Dr. Suhail - Meet Dr. Suhail A. Syed - Interactive video card. Click or hover to watch video introduction."'
  }
]);

// 3. Update assets/js/i18n.js
const i18nPath = path.join(rootDir, 'assets/js/i18n.js');
let i18nContent = fs.readFileSync(i18nPath, 'utf8');

const target1 = '\'<button type="button" class="lang-selector_toggle" id="\' + idPrefix + \'toggle" aria-haspopup="true" aria-expanded="false" aria-label="Select Language">\' +';
const repl1 = '\'<button type="button" class="lang-selector_toggle" id="\' + idPrefix + \'toggle" aria-haspopup="true" aria-expanded="false" aria-label="\' + currentMeta.nativeName + \' - Select Language">\' +';

if (i18nContent.includes(target1)) {
  i18nContent = i18nContent.replace(target1, repl1);
  console.log('[assets/js/i18n.js] Updated createLanguageSelectorElement aria-label');
}

const target2 = `    document.querySelectorAll('.lang-current-label').forEach(function (span) {
      span.textContent = meta.nativeName;
    });`;

const repl2 = `    document.querySelectorAll('.lang-current-label').forEach(function (span) {
      span.textContent = meta.nativeName;
    });
    document.querySelectorAll('.lang-selector_toggle').forEach(function (btn) {
      btn.setAttribute('aria-label', meta.nativeName + ' - Select Language');
    });`;

if (i18nContent.includes(target2)) {
  i18nContent = i18nContent.replace(target2, repl2);
  console.log('[assets/js/i18n.js] Updated updateSelectorUI aria-label');
} else {
  // Check CRLF version
  const target2CRLF = target2.replace(/\n/g, '\r\n');
  const repl2CRLF = repl2.replace(/\n/g, '\r\n');
  if (i18nContent.includes(target2CRLF)) {
    i18nContent = i18nContent.replace(target2CRLF, repl2CRLF);
    console.log('[assets/js/i18n.js] Updated updateSelectorUI aria-label (CRLF)');
  }
}

fs.writeFileSync(i18nPath, i18nContent, 'utf8');
console.log('[assets/js/i18n.js] Finished.\n');
