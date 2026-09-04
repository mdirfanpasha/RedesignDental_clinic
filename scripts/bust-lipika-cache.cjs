const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Update doctors.html - add cache-busting to doctor-05.webp
let doctorsHtml = fs.readFileSync(path.join(rootDir, 'doctors.html'), 'utf8');
doctorsHtml = doctorsHtml.replace(
  /src="assets\/img\/doctors\/doctor-05\.webp(\?v=[^"]+)?"/g,
  'src="assets/img/doctors/doctor-05.webp?v=20260904b"'
);
fs.writeFileSync(path.join(rootDir, 'doctors.html'), doctorsHtml, 'utf8');
console.log('Updated doctors.html cache-buster');

// 2. Also update index.html if it has the reference
let indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
if (indexHtml.includes('doctor-05.webp')) {
  indexHtml = indexHtml.replace(
    /src="assets\/img\/doctors\/doctor-05\.webp(\?v=[^"]+)?"/g,
    'src="assets/img/doctors/doctor-05.webp?v=20260904b"'
  );
  fs.writeFileSync(path.join(rootDir, 'index.html'), indexHtml, 'utf8');
  console.log('Updated index.html cache-buster');
}

// 3. Also overwrite the WebP file again with a slightly different file to force new mtime
const sharp = require('sharp');
const src = path.join('C:/Users/Mohammed irfan pasha/OneDrive/Pictures', 'WhatsApp Image 2026-09-04 at 9.02.56 PM (1).jpeg');
const destWebp = path.join(rootDir, 'assets/img/doctors/doctor-05.webp');
const destJpg = path.join(rootDir, 'assets/img/doctors/doctor-05.jpg');

Promise.all([
  sharp(src).resize(880, 1280, { fit: 'cover', position: 'top' }).webp({ quality: 86 }).toFile(destWebp),
  sharp(src).resize(880, 1280, { fit: 'cover', position: 'top' }).jpeg({ quality: 90 }).toFile(destJpg),
]).then(([w, j]) => {
  console.log('WebP re-saved:', w.size, 'bytes at', new Date().toISOString());
  console.log('JPG re-saved:', j.size, 'bytes');
  console.log('\nDone! Open http://127.0.0.1:8000/doctors in an Incognito/Private window to see the change.');
}).catch(e => console.error(e));
