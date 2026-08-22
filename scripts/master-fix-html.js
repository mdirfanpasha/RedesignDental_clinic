import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const htmlFiles = [
  'index.html',
  'services.html',
  'service.html',
  'gallery.html',
  'about.html',
  'blog.html',
  'contact.html',
  'privacy.html',
  'terms.html',
  'cookies.html',
  'licenses.html',
  '404.html'
];

htmlFiles.forEach(fileName => {
  const filePath = path.join(rootDir, fileName);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Fix legal & other <title> tags to be strictly plain text
  content = content.replace(/<title>[\s\S]*?Privacy Policy[\s\S]*?<\/title>/i, '<title>Privacy Policy | Redesign Dental Clinics</title>');
  content = content.replace(/<title>[\s\S]*?Terms &amp; Conditions[\s\S]*?<\/title>/i, '<title>Terms & Conditions | Redesign Dental Clinics</title>');
  content = content.replace(/<title>[\s\S]*?Terms & Conditions[\s\S]*?<\/title>/i, '<title>Terms & Conditions | Redesign Dental Clinics</title>');
  content = content.replace(/<title>[\s\S]*?Cookie Policy[\s\S]*?<\/title>/i, '<title>Cookie Policy | Redesign Dental Clinics</title>');
  content = content.replace(/<title>[\s\S]*?Licenses &amp; Registrations[\s\S]*?<\/title>/i, '<title>Licenses & Registrations | Redesign Dental Clinics</title>');
  content = content.replace(/<title>[\s\S]*?Licenses & Registrations[\s\S]*?<\/title>/i, '<title>Licenses & Registrations | Redesign Dental Clinics</title>');
  content = content.replace(/<title>[\s\S]*?Dental Services Directory[\s\S]*?<\/title>/i, '<title>Dental Services Directory | Redesign Dental Clinics</title>');
  content = content.replace(/<title>[\s\S]*?404[\s\S]*?<\/title>/i, '<title>404 - Page Not Found | Redesign Dental Clinics</title>');

  // Strip any remaining <span ...> or tags inside <title>
  content = content.replace(/<title>(.*?)<\/title>/gi, (match, inner) => {
    const cleanText = inner.replace(/<[^>]+>/g, '').trim();
    return `<title>${cleanText}</title>`;
  });

  // 2. Fix 7 Mi -> 7 Min stat in index.html and others
  content = content.replace(/<div class="our-story_item-info_number">7 Mi<\/div>/g, '<div class="our-story_item-info_number">7 Min</div>');

  // 3. Replace all variations of old brand names
  content = content.replace(/Redesign Clinics/g, 'Redesign Dental Clinics');
  content = content.replace(/REDESIGN CLINICS/g, 'REDESIGN DENTAL CLINICS');
  content = content.replace(/Lumora Dental/g, 'Redesign Dental Clinics');
  content = content.replace(/Crafted by RapidXAI\./g, '');
  content = content.replace(/RapidXAI/g, 'Redesign Dental Clinics');
  content = content.replace(/Shreyas Raj/g, 'Redesign Dental Clinics');

  // Replace standalone 'Redesign Dental' not followed by 'Clinics'
  content = content.replace(/\bRedesign Dental\b(?! Clinics)/g, 'Redesign Dental Clinics');

  // 4. Standardize emails to redesigndental@gmail.com
  content = content.replace(/mailto:care@redesigndentalclinics\.com/g, 'mailto:redesigndental@gmail.com');
  content = content.replace(/mailto:hello@redesigndentalclinics\.com/g, 'mailto:redesigndental@gmail.com');
  content = content.replace(/mailto:redesigndentalclinics@gmail\.com/g, 'mailto:redesigndental@gmail.com');
  content = content.replace(/care@redesigndentalclinics\.com/g, 'redesigndental@gmail.com');
  content = content.replace(/hello@redesigndentalclinics\.com/g, 'redesigndental@gmail.com');
  content = content.replace(/redesigndentalclinics@gmail\.com/g, 'redesigndental@gmail.com');

  // 5. Standardize mobile phone links
  content = content.replace(/tel:\+91\s*7780245307/g, 'tel:+917780245307');
  content = content.replace(/tel:7780245307/g, 'tel:+917780245307');
  content = content.replace(/tel:917780245307/g, 'tel:+917780245307');

  // 6. Fix Dr. Mohammed mentions in HTML to Dr. Suhail
  content = content.replace(/Dr\. Mohammed/g, 'Dr. Suhail');

  // 7. Standardize logo alt text
  content = content.replace(/alt="Redesign Clinics logo"/g, 'alt="Redesign Dental Clinics logo"');
  content = content.replace(/alt="Lumora logo"/g, 'alt="Redesign Dental Clinics logo"');
  content = content.replace(/alt="Lumora"/g, 'alt="Redesign Dental Clinics"');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✓ Processed and standardized ${fileName}`);
});

// Also keep service.html and services.html in sync
const servicesSrc = path.join(rootDir, 'services.html');
const serviceDst = path.join(rootDir, 'service.html');
if (fs.existsSync(servicesSrc)) {
  fs.copyFileSync(servicesSrc, serviceDst);
  console.log('✓ Synced service.html with services.html');
}
