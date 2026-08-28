const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/assets\/img\/[^\s\"\'\>\)]+/g) || [];
  const docMatches = matches.filter(m => /suhail|team-image-1|doctor|hero/i.test(m));
  if (docMatches.length) console.log(f, '=>', [...new Set(docMatches)]);
});
