import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const fontTags = `        <link href="https://fonts.googleapis.com" rel="preconnect"/>
        <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@300;400;500;600;700&family=Noto+Sans+Telugu:wght@300;400;500;600;700&family=Sora:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>`;

const i18nScripts = `        <!-- Multilingual Engine -->
        <script src="assets/i18n/translations.js"></script>
        <script src="assets/js/i18n.js"></script>`;

const htmlFiles = [
  'index.html',
  'about.html',
  'service.html',
  'gallery.html',
  'blog.html',
  'contact.html',
  'privacy.html',
  'terms.html',
  'cookies.html',
  'licenses.html',
  '404.html'
];

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Ensure i18n scripts are in <head>
  if (!content.includes('assets/i18n/translations.js')) {
    if (content.includes('</head>')) {
      content = content.replace('</head>', `${i18nScripts}\n</head>`);
    }
  }

  // 2. Ensure Google Fonts with Telugu, Hindi, Arabic are present
  if (!content.includes('Noto+Sans+Telugu')) {
    content = content.replace(/<link[^>]*fonts\.googleapis\.com[^>]*>/i, fontTags);
  }

  // 3. Global Navbar tags
  content = content.replace(/<a href="\/" aria-current="page" class="navbar_link w-inline-block w--current">\s*<div>Home<\/div>/g, '<a href="/" aria-current="page" class="navbar_link w-inline-block w--current"><div data-i18n="nav.home">Home</div>');
  content = content.replace(/<a href="\/" class="navbar_link w-inline-block">\s*<div>Home<\/div>/g, '<a href="/" class="navbar_link w-inline-block"><div data-i18n="nav.home">Home</div>');
  
  content = content.replace(/<a href="\/about"([^>]*)>\s*<div>About Us<\/div>/g, '<a href="/about"$1><div data-i18n="nav.about">About Us</div>');
  content = content.replace(/<a href="\/services"([^>]*)>\s*<div>Services<\/div>/g, '<a href="/services"$1><div data-i18n="nav.services">Services</div>');
  content = content.replace(/<a href="\/gallery"([^>]*)>\s*<div>Gallery<\/div>/g, '<a href="/gallery"$1><div data-i18n="nav.gallery">Gallery</div>');
  content = content.replace(/<a href="\/blog"([^>]*)>\s*<div>Blog<\/div>/g, '<a href="/blog"$1><div data-i18n="nav.blog">Blog</div>');
  content = content.replace(/<a href="\/contact"([^>]*)>\s*<div>Contact<\/div>/g, '<a href="/contact"$1><div data-i18n="nav.contact">Contact</div>');
  content = content.replace(/<div class="navbar-dropdown_toggle w-dropdown-toggle">\s*<div>Pages<\/div>/g, '<div class="navbar-dropdown_toggle w-dropdown-toggle"><div data-i18n="nav.pages">Pages</div>');
  
  content = content.replace(/<div class="button_text">Get Appointment<\/div>/g, '<div class="button_text" data-i18n="nav.getAppointment">Get Appointment</div>');
  content = content.replace(/<p class="dropdown-info_text">\s*&copy; 2026 Redesign Clinics\s*<\/p>/g, '<p class="dropdown-info_text" data-i18n="nav.copyright">&copy; 2026 Redesign Clinics</p>');

  // Pages dropdown items
  content = content.replace(/<a href="\/about" data-animation="text-flip"([^>]*)>\s*<div>About Us<\/div>/g, '<a href="/about" data-animation="text-flip"$1><div data-i18n="nav.about">About Us</div>');
  content = content.replace(/<a href="\/services" data-animation="text-flip"([^>]*)>\s*<div>Services<\/div>/g, '<a href="/services" data-animation="text-flip"$1><div data-i18n="nav.services">Services</div>');
  content = content.replace(/<a href="\/blog" data-animation="text-flip"([^>]*)>\s*<div>Blogs<\/div>/g, '<a href="/blog" data-animation="text-flip"$1><div data-i18n="nav.blogs">Blogs</div>');
  content = content.replace(/<a href="\/contact" data-animation="text-flip"([^>]*)>\s*<div>Contact Us<\/div>/g, '<a href="/contact" data-animation="text-flip"$1><div data-i18n="nav.contactUs">Contact Us</div>');
  content = content.replace(/<a href="\/privacy" data-animation="text-flip"([^>]*)>\s*<div>Privacy Policy<\/div>/g, '<a href="/privacy" data-animation="text-flip"$1><div data-i18n="nav.privacy">Privacy Policy</div>');
  content = content.replace(/<a href="\/terms" data-animation="text-flip"([^>]*)>\s*<div>Terms &amp; Conditions<\/div>/g, '<a href="/terms" data-animation="text-flip"$1><div data-i18n="nav.terms">Terms &amp; Conditions</div>');
  content = content.replace(/<a href="\/cookies" data-animation="text-flip"([^>]*)>\s*<div>Cookies<\/div>/g, '<a href="/cookies" data-animation="text-flip"$1><div data-i18n="nav.cookies">Cookies</div>');

  // Footer Tags
  content = content.replace(/<div class="footer_copyright-text">\s*&copy;\s*2026\s*Redesign Clinics\. All rights reserved\.\s*<\/div>/gi, '<div class="footer_copyright-text" data-i18n="footer.copyright">&copy; 2026 Redesign Clinics. All rights reserved.</div>');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✓ Processed ${file}`);
});
