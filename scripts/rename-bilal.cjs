const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const OLD = 'Asaq';
const NEW = 'Afaq';

const files = [
  'assets/js/appointment-page.js',
  'assets/js/doctors-data.js',
  'booking.html',
  'data/doctors.ts',
  'doctors.html'
];

let total = 0;
files.forEach(rel => {
  const fp = path.join(rootDir, rel);
  let content = fs.readFileSync(fp, 'utf8');
  const count = (content.split(OLD)).length - 1;
  if (count > 0) {
    content = content.split(OLD).join(NEW);
    fs.writeFileSync(fp, content, 'utf8');
    console.log(`✅ [${rel}] — replaced ${count} occurrence(s)`);
    total += count;
  } else {
    console.log(`⚠️  [${rel}] — no occurrences found`);
  }
});

console.log(`\nTotal: ${total} replacements done.`);
console.log('\nVerifying — searching for remaining "Asaq":');
files.forEach(rel => {
  const content = fs.readFileSync(path.join(rootDir, rel), 'utf8');
  const remaining = (content.match(/Asaq/g) || []).length;
  if (remaining > 0) console.log(`  ❌ ${rel}: still has ${remaining}`);
  else console.log(`  ✅ ${rel}: clean`);
});
