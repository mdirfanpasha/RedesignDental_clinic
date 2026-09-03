import fs from 'fs';
import path from 'path';

const gtagSnippet = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-FMNL8XFZ4N"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-FMNL8XFZ4N');
</script>`;

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === '.vercel') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

function processFiles(dryRun = true) {
  const files = getAllHtmlFiles('.');
  console.log(`Found ${files.length} HTML files.`);

  let updatedCount = 0;
  let skippedCount = 0;
  let alreadyHasTagCount = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // Check if tag is already present
    if (content.includes('G-FMNL8XFZ4N')) {
      console.log(`[SKIP - Already Present] ${file}`);
      alreadyHasTagCount++;
      continue;
    }

    if (!content.includes('<head>')) {
      console.warn(`[WARNING - No <head>] ${file}`);
      skippedCount++;
      continue;
    }

    const eol = content.includes('\r\n') ? '\r\n' : '\n';
    const tagFormatted = gtagSnippet.replace(/\r?\n/g, eol);

    // Replace immediately after <head>
    const newContent = content.replace(/<head>[ \t]*(\r?\n)?/i, `<head>${eol}${tagFormatted}${eol}`);

    if (dryRun) {
      if (updatedCount < 3) {
        console.log(`\n--- PREVIEW for ${file} ---`);
        const previewLines = newContent.split(/\r?\n/).slice(0, 16);
        console.log(previewLines.join('\n'));
      }
    } else {
      fs.writeFileSync(file, newContent, 'utf8');
    }
    updatedCount++;
  }

  console.log(`\nSummary:`);
  console.log(`Total HTML files: ${files.length}`);
  console.log(`Updated: ${updatedCount}`);
  console.log(`Already had tag: ${alreadyHasTagCount}`);
  console.log(`Skipped (no <head>): ${skippedCount}`);
}

const isDryRun = process.argv.includes('--dry-run');
processFiles(isDryRun);
