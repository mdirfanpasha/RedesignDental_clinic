const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const OLD_VERCEL = 'redesign-tau-five.vercel.app';
const NEW_VERCEL = 'redesign-93m5heyb3-redesigndental.vercel.app';
const CANONICAL = 'www.redesigndentalclinics.com';

// Files that reference the old Vercel URL
const filesToUpdate = execSync('git grep -rl "' + OLD_VERCEL + '"', { cwd: rootDir })
  .toString().trim().split('\n').filter(Boolean);

console.log(`Found ${filesToUpdate.length} files with old Vercel URL:`);
filesToUpdate.forEach(f => console.log(' -', f));
console.log('');

let totalReplacements = 0;

filesToUpdate.forEach(relPath => {
  const filePath = path.join(rootDir, relPath);
  let content = fs.readFileSync(filePath, 'utf8');
  const before = (content.match(new RegExp(OLD_VERCEL.replace(/\./g, '\\.'), 'g')) || []).length;
  
  // Replace old Vercel URL with new Vercel URL
  content = content.split(OLD_VERCEL).join(NEW_VERCEL);
  
  fs.writeFileSync(filePath, content, 'utf8');
  totalReplacements += before;
  console.log(`[${relPath}] Replaced ${before} occurrence(s)`);
});

console.log(`\nTotal replacements: ${totalReplacements}`);

// Also update robots.txt canonical domain if needed
const robotsPath = path.join(rootDir, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  let robots = fs.readFileSync(robotsPath, 'utf8');
  console.log('\nrobots.txt contents:');
  console.log(robots);
}

// Check sitemap.xml for canonical domain
const sitemapPath = path.join(rootDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const hasCanonical = sitemap.includes(CANONICAL);
  const hasOldVercel = sitemap.includes(OLD_VERCEL);
  const hasNewVercel = sitemap.includes(NEW_VERCEL);
  console.log('\nsitemap.xml:');
  console.log('  Has canonical (redesigndentalclinics.com):', hasCanonical);
  console.log('  Has OLD vercel:', hasOldVercel);
  console.log('  Has NEW vercel:', hasNewVercel);
}

console.log('\nDone!');
