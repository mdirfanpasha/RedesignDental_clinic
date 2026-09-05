/**
 * scripts/sync-footer.cjs
 * 
 * Synchronizes the canonical single-source-of-truth Master Footer component
 * across all HTML files in the repository (excluding index.html which is the reference).
 * Ensures 100% markup, content, styling, responsive behavior, and functionality consistency.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const FOOTER_COMPONENT_PATH = path.join(ROOT_DIR, 'components', 'footer.html');

if (!fs.existsSync(FOOTER_COMPONENT_PATH)) {
  console.error('Error: components/footer.html not found!');
  process.exit(1);
}

const CANONICAL_FOOTER_RAW = fs.readFileSync(FOOTER_COMPONENT_PATH, 'utf8').trim();

function getAllHtmlFiles() {
  const files = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // Skip ignored directories
        if (!['node_modules', '.git', '.vercel', 'scratch'].includes(entry.name)) {
          walk(fullPath);
        }
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        files.push(fullPath);
      }
    }
  }

  walk(ROOT_DIR);
  return files;
}

function syncFile(filePath) {
  const relPath = path.relative(ROOT_DIR, filePath);

  // CRITICAL RULE: DO NOT CHANGE index.html footer
  if (relPath === 'index.html') {
    return { status: 'skipped', reason: 'index.html is the design reference' };
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // 1. Locate existing <footer> ... </footer> block
  const footerStart = content.indexOf('<footer');
  if (footerStart === -1) {
    return { status: 'error', reason: 'No <footer tag found' };
  }

  const footerEnd = content.indexOf('</footer>', footerStart);
  if (footerEnd === -1) {
    return { status: 'error', reason: 'No </footer> tag found' };
  }

  const fullFooterEnd = footerEnd + '</footer>'.length;

  // Check for comment immediately preceding <footer (up to 150 chars back)
  const preText = content.substring(Math.max(0, footerStart - 150), footerStart);
  const commentMatch = preText.match(/<!--[\s\S]*?(?:footer|FOOTER|Footer)[\s\S]*?-->\s*$/i);
  let replaceStart = footerStart;
  if (commentMatch) {
    replaceStart = footerStart - commentMatch[0].length;
  }

  content = content.substring(0, replaceStart) + CANONICAL_FOOTER_RAW + content.substring(fullFooterEnd);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return { status: 'updated' };
  }

  return { status: 'unchanged' };
}

function main() {
  console.log('--- SYNCING CANONICAL MASTER FOOTER ACROSS ALL PAGES ---');
  const files = getAllHtmlFiles();
  let updatedCount = 0;
  let unchangedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const rel = path.relative(ROOT_DIR, file);
    try {
      const result = syncFile(file);
      if (result.status === 'updated') {
        updatedCount++;
      } else if (result.status === 'unchanged') {
        unchangedCount++;
      } else if (result.status === 'skipped') {
        skippedCount++;
        console.log(`[SKIPPED] ${rel} (${result.reason})`);
      } else if (result.status === 'error') {
        errorCount++;
        console.error(`[ERROR] ${rel}: ${result.reason}`);
      }
    } catch (err) {
      errorCount++;
      console.error(`[ERROR] ${rel}: ${err.message}`);
    }
  }

  console.log('-------------------------------------------------------');
  console.log(`Sync Complete:`);
  console.log(`  Updated:   ${updatedCount}`);
  console.log(`  Unchanged: ${unchangedCount}`);
  console.log(`  Skipped:   ${skippedCount}`);
  console.log(`  Errors:    ${errorCount}`);
  console.log(`  Total:     ${files.length}`);
  console.log('-------------------------------------------------------');

  if (errorCount > 0) {
    process.exit(1);
  }
}

main();
