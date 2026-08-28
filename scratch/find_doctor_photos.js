const fs = require('fs');
const path = require('path');

function scan(dir) {
  const list = fs.readdirSync(dir);
  for (const f of list) {
    if (['node_modules', '.git', '.system_generated', 'brain'].includes(f)) continue;
    const p = path.join(dir, f);
    const s = fs.statSync(p);
    if (s.isDirectory()) {
      scan(p);
    } else if (/\.(html|js|css|json|php)$/i.test(f)) {
      const text = fs.readFileSync(p, 'utf8');
      const lines = text.split('\n');
      lines.forEach((line, idx) => {
        if (/suhail|doctor|dr-|dr_/i.test(line) && /\.(jpg|jpeg|png|webp|svg)/i.test(line)) {
          console.log(`${p}:${idx + 1} => ${line.trim().slice(0, 140)}`);
        }
      });
    }
  }
}

scan('.');
