const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

let htmlOccurrences = [];
lines.forEach((l, i) => {
  if (l.includes('droneMuteBtn') && l.includes('<button')) {
    htmlOccurrences.push({ line: i+1, text: l.trim().slice(0, 80) });
  }
});

console.log('droneMuteBtn <button> HTML occurrences:', htmlOccurrences.length);
htmlOccurrences.forEach(o => console.log('  Line', o.line, ':', o.text));

// Check context around each one
htmlOccurrences.forEach(o => {
  const start = Math.max(0, o.line - 5);
  const end = Math.min(lines.length, o.line + 3);
  console.log('\n--- Context around line', o.line, '---');
  for (let i = start; i < end; i++) {
    console.log((i+1) + ': ' + lines[i].trim().slice(0, 100));
  }
});
