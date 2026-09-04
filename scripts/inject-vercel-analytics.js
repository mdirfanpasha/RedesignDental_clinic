import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const snippet = `    <!-- Vercel Web Analytics -->
    <script>
      window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    </script>
    <script defer src="/_vercel/insights/script.js"></script>
    <!-- Vercel Speed Insights -->
    <script>
      window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
    </script>
    <script defer src="/_vercel/speed-insights/script.js"></script>
`;

function findHtmlFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (item === 'node_modules' || item === '.git' || item === '.vercel') continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(findHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const htmlFiles = findHtmlFiles(rootDir);
console.log(`Found ${htmlFiles.length} HTML files to inspect.`);

let updatedCount = 0;
let alreadyPresent = 0;

for (const filePath of htmlFiles) {
  const content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes('/_vercel/insights/script.js')) {
    alreadyPresent++;
    continue;
  }

  let newContent = null;

  // Option 1: Right after Google tag block
  const gtagMatch = content.match(/gtag\('config',\s*['"][^'"]+['"]\);\s*<\/script>/i);
  if (gtagMatch) {
    const insertIdx = gtagMatch.index + gtagMatch[0].length;
    newContent = content.slice(0, insertIdx) + '\n' + snippet + content.slice(insertIdx);
  } else {
    // Option 2: Right after <head>
    const headMatch = content.match(/<head[^>]*>/i);
    if (headMatch) {
      const insertIdx = headMatch.index + headMatch[0].length;
      newContent = content.slice(0, insertIdx) + '\n' + snippet + content.slice(insertIdx);
    }
  }

  if (newContent) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    updatedCount++;
  } else {
    console.warn(`Could not find <head> or gtag block in: ${path.relative(rootDir, filePath)}`);
  }
}

console.log(`Successfully injected Vercel Analytics into ${updatedCount} files.`);
console.log(`${alreadyPresent} files already had Vercel Analytics.`);
