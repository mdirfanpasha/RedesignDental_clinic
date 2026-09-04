const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { minify } = require('terser');

const rootDir = path.resolve(__dirname, '..');

async function run() {
  console.log('--- Minifying CSS Assets ---');
  const cssFiles = [
    { src: 'assets/css/lumora.css', dest: 'assets/css/lumora.min.css' },
    { src: 'assets/css/booking-system.css', dest: 'assets/css/booking-system.min.css' },
    { src: 'assets/css/dr-suhail-chatbot.css', dest: 'assets/css/dr-suhail-chatbot.min.css' }
  ];

  const cleanCss = new CleanCSS({
    level: {
      1: { all: true },
      2: { restructureRules: true }
    }
  });

  for (const { src, dest } of cssFiles) {
    const srcPath = path.join(rootDir, src);
    const destPath = path.join(rootDir, dest);
    if (!fs.existsSync(srcPath)) {
      console.warn(`File not found: ${srcPath}`);
      continue;
    }
    const content = fs.readFileSync(srcPath, 'utf8');
    const result = cleanCss.minify(content);
    if (result.errors.length) {
      console.error(`Errors minifying ${src}:`, result.errors);
      continue;
    }
    fs.writeFileSync(destPath, result.styles, 'utf8');
    const origSize = (Buffer.byteLength(content, 'utf8') / 1024).toFixed(1);
    const minSize = (Buffer.byteLength(result.styles, 'utf8') / 1024).toFixed(1);
    console.log(`CSS: ${src} (${origSize} KB) -> ${dest} (${minSize} KB)`);
  }

  console.log('\n--- Minifying JS Assets ---');
  const jsFiles = [
    { src: 'assets/i18n/translations.js', dest: 'assets/i18n/translations.min.js' }
  ];

  for (const { src, dest } of jsFiles) {
    const srcPath = path.join(rootDir, src);
    const destPath = path.join(rootDir, dest);
    if (!fs.existsSync(srcPath)) {
      console.warn(`File not found: ${srcPath}`);
      continue;
    }
    const content = fs.readFileSync(srcPath, 'utf8');
    const result = await minify(content, {
      compress: {
        drop_console: false,
        drop_debugger: true
      },
      mangle: false // Preserve variable names so window.RE_TRANSLATIONS etc are safe
    });
    if (result.error) {
      console.error(`Error minifying ${src}:`, result.error);
      continue;
    }
    fs.writeFileSync(destPath, result.code, 'utf8');
    const origSize = (Buffer.byteLength(content, 'utf8') / 1024).toFixed(1);
    const minSize = (Buffer.byteLength(result.code, 'utf8') / 1024).toFixed(1);
    console.log(`JS: ${src} (${origSize} KB) -> ${dest} (${minSize} KB)`);
  }

  console.log('\nMinification complete.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
