import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

function tagFile(fileName, replacements) {
  const filePath = path.join(rootDir, fileName);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');

  replacements.forEach(([pattern, replacement]) => {
    if (typeof pattern === 'string') {
      content = content.split(pattern).join(replacement);
    } else {
      content = content.replace(pattern, replacement);
    }
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✓ Tagged i18n in ${fileName}`);
}

// 1. INDEX.HTML
tagFile('index.html', [
  // Hero
  ['class="hero-text-split">Trusted Dental Care for Every Generation</h1>', 'class="hero-text-split" data-i18n="hero.title">Trusted Dental Care for Every Generation</h1>'],
  ['class="home-hero_para">We combine modern technology with heartfelt service to ensure every generation.</p>', 'class="home-hero_para" data-i18n="hero.subtitle">We combine modern technology with heartfelt service to ensure every generation.</p>'],
  ['<div class="button_text">Book Appointment</div>', '<div class="button_text" data-i18n="nav.bookAppointment">Book Appointment</div>'],
  ['<div class="lead-form_title">Book a visit</div>', '<div class="lead-form_title" data-i18n="hero.leadForm.title">Book a Consultation</div>'],
  ['<div class="lead-form_sub">Get a callback within 10 minutes</div>', '<div class="lead-form_sub" data-i18n="hero.leadForm.subtitle">Get a callback within 15 minutes</div>'],
  ['placeholder="Your name"', 'placeholder="Your Full Name" data-i18n-placeholder="hero.leadForm.namePlaceholder"'],
  ['placeholder="Phone number"', 'placeholder="10-Digit Mobile Number" data-i18n-placeholder="hero.leadForm.phonePlaceholder"'],
  ['<button class="lead-form_btn" type="submit">Request a callback</button>', '<button class="lead-form_btn" type="submit" data-i18n="hero.leadForm.submit">Request Callback Now</button>'],
  ['<div class="lead-form_note">No spam. A real person calls you back, fast.</div>', '<div class="lead-form_note" data-i18n="booking.recaptchaNotice">Protected by Google reCAPTCHA. We respect your privacy.</div>'],
  
  // Drone Section
  ['<div>OUR CLINIC</div>', '<div data-i18n="drone.badge">OUR CLINIC</div>'],
  ['Redesign Clinics, <span class="text-highlighted">Banjara Hills</span>', '<span data-i18n="drone.title">Redesign Clinics, Banjara Hills</span>'],
  ['A modern dental care destination in Banjara Hills, Hyderabad.', '<span data-i18n="drone.subtitle">A modern dental care destination in Banjara Hills, Hyderabad.</span>'],
  ['Conveniently located on Road No. 1, Banjara Hills with dedicated valet parking and complete accessibility.', '<span data-i18n="drone.directionsText">Conveniently located on Road No. 1, Banjara Hills with dedicated valet parking and complete accessibility.</span>'],
  
  // Story Section
  ['<div>WHO WE ARE</div>', '<div data-i18n="story.badge">WHO WE ARE</div>'],
  ['<div>EXCELLENCE &amp; TRUST</div>', '<div data-i18n="awards.badge">EXCELLENCE & TRUST</div>'],
  ['<div>OUR SERVICES</div>', '<div data-i18n="services.badge">OUR SERVICES</div>'],
  ['<div>WHY REDESIGN CLINICS</div>', '<div data-i18n="why.badge">WHY REDESIGN CLINICS</div>'],
  ['<div>CLINIC TOUR</div>', '<div data-i18n="clinicVideo.badge">CLINIC TOUR</div>'],
  ['<div>PATIENT EXPERIENCES</div>', '<div data-i18n="testimonials.badge">PATIENT EXPERIENCES</div>'],
  ['<div>DENTAL HEALTH JOURNAL</div>', '<div data-i18n="blog.badge">DENTAL HEALTH JOURNAL</div>'],
  
  // Doctor Section
  ['<div>CHIEF SURGEON</div>', '<div data-i18n="doctor.badge">CHIEF SURGEON</div>'],
  
  // Footer
  ['<div>Quick Links</div>', '<div data-i18n="footer.quickLinks">Quick Links</div>'],
  ['<div>Treatments</div>', '<div data-i18n="footer.treatments">Treatments</div>'],
  ['<div>Contact Information</div>', '<div data-i18n="footer.contactInfo">Contact Information</div>']
]);

// 2. ABOUT.HTML
tagFile('about.html', [
  ['<div>WHO WE ARE</div>', '<div data-i18n="story.badge">WHO WE ARE</div>'],
  ['<div>OUR STORY</div>', '<div data-i18n="story.badge">OUR STORY</div>'],
  ['<div>OUR TEAM</div>', '<div data-i18n="team.badge">OUR TEAM</div>'],
  ['<div>EXCELLENCE &amp; TRUST</div>', '<div data-i18n="awards.badge">EXCELLENCE & TRUST</div>'],
  ['<div>Quick Links</div>', '<div data-i18n="footer.quickLinks">Quick Links</div>'],
  ['<div>Treatments</div>', '<div data-i18n="footer.treatments">Treatments</div>'],
  ['<div>Contact Information</div>', '<div data-i18n="footer.contactInfo">Contact Information</div>']
]);

// 3. SERVICE.HTML
tagFile('service.html', [
  ['<div>OUR SERVICES</div>', '<div data-i18n="services.badge">OUR SERVICES</div>'],
  ['placeholder="Search dental treatments (e.g., Root Canal, Whitening, Implants)..."', 'placeholder="Search dental treatments (e.g., Root Canal, Whitening, Implants)..." data-i18n-placeholder="services.searchPlaceholder"'],
  ['<div>Quick Links</div>', '<div data-i18n="footer.quickLinks">Quick Links</div>'],
  ['<div>Treatments</div>', '<div data-i18n="footer.treatments">Treatments</div>'],
  ['<div>Contact Information</div>', '<div data-i18n="footer.contactInfo">Contact Information</div>']
]);

// 4. GALLERY.HTML
tagFile('gallery.html', [
  ['<div>PATIENT STORIES</div>', '<div data-i18n="gallery.badge">PATIENT STORIES</div>'],
  ['Happy Patients, Beautiful Smiles', '<span data-i18n="gallery.heroTitle">Happy Patients, Beautiful Smiles</span>'],
  ['Smiles That Speak For Themselves', '<span data-i18n="gallery.introTitle">Smiles That Speak For Themselves</span>'],
  ['<div>All Photos (51)</div>', '<div data-i18n="gallery.filter.all">All Photos (51)</div>'],
  ['<div>Happy Patients</div>', '<div data-i18n="gallery.filter.happy">Happy Patients</div>'],
  ['<div>Patient Smiles</div>', '<div data-i18n="gallery.filter.smiles">Patient Smiles</div>'],
  ['<div>Patient Care</div>', '<div data-i18n="gallery.filter.care">Patient Care</div>'],
  ['<div>Clinic Moments</div>', '<div data-i18n="gallery.filter.clinic">Clinic Moments</div>'],
  ['<div>Quick Links</div>', '<div data-i18n="footer.quickLinks">Quick Links</div>'],
  ['<div>Treatments</div>', '<div data-i18n="footer.treatments">Treatments</div>'],
  ['<div>Contact Information</div>', '<div data-i18n="footer.contactInfo">Contact Information</div>']
]);

// 5. BLOG.HTML
tagFile('blog.html', [
  ['<div>DENTAL HEALTH JOURNAL</div>', '<div data-i18n="blog.badge">DENTAL HEALTH JOURNAL</div>'],
  ['placeholder="Search articles (e.g. Root Canal, Teeth Whitening, Oral Hygiene)..."', 'placeholder="Search articles (e.g. Root Canal, Teeth Whitening, Oral Hygiene)..." data-i18n-placeholder="blog.searchPlaceholder"'],
  ['<div>Quick Links</div>', '<div data-i18n="footer.quickLinks">Quick Links</div>'],
  ['<div>Treatments</div>', '<div data-i18n="footer.treatments">Treatments</div>'],
  ['<div>Contact Information</div>', '<div data-i18n="footer.contactInfo">Contact Information</div>']
]);

// 6. CONTACT.HTML
tagFile('contact.html', [
  ['<div>GET IN TOUCH</div>', '<div data-i18n="contact.badge">GET IN TOUCH</div>'],
  ['placeholder="Enter your full name"', 'placeholder="Enter your full name" data-i18n-placeholder="contact.form.namePlaceholder"'],
  ['placeholder="10-digit mobile number"', 'placeholder="10-digit mobile number" data-i18n-placeholder="contact.form.phonePlaceholder"'],
  ['placeholder="name@example.com"', 'placeholder="name@example.com" data-i18n-placeholder="contact.form.emailPlaceholder"'],
  ['placeholder="e.g., Consultation for Dental Implants"', 'placeholder="e.g., Consultation for Dental Implants" data-i18n-placeholder="contact.form.subjectPlaceholder"'],
  ['placeholder="Tell us how we can help you..."', 'placeholder="Tell us how we can help you..." data-i18n-placeholder="contact.form.messagePlaceholder"'],
  ['<div>Quick Links</div>', '<div data-i18n="footer.quickLinks">Quick Links</div>'],
  ['<div>Treatments</div>', '<div data-i18n="footer.treatments">Treatments</div>'],
  ['<div>Contact Information</div>', '<div data-i18n="footer.contactInfo">Contact Information</div>']
]);

// 7. LEGAL & UTILITY
tagFile('privacy.html', [
  ['Privacy Policy', '<span data-i18n="legal.privacyTitle">Privacy Policy</span>'],
  ['<div>Quick Links</div>', '<div data-i18n="footer.quickLinks">Quick Links</div>'],
  ['<div>Treatments</div>', '<div data-i18n="footer.treatments">Treatments</div>'],
  ['<div>Contact Information</div>', '<div data-i18n="footer.contactInfo">Contact Information</div>']
]);
tagFile('terms.html', [
  ['Terms &amp; Conditions', '<span data-i18n="legal.termsTitle">Terms & Conditions</span>'],
  ['<div>Quick Links</div>', '<div data-i18n="footer.quickLinks">Quick Links</div>'],
  ['<div>Treatments</div>', '<div data-i18n="footer.treatments">Treatments</div>'],
  ['<div>Contact Information</div>', '<div data-i18n="footer.contactInfo">Contact Information</div>']
]);
tagFile('cookies.html', [
  ['Cookies', '<span data-i18n="legal.cookiesTitle">Cookies</span>'],
  ['<div>Quick Links</div>', '<div data-i18n="footer.quickLinks">Quick Links</div>'],
  ['<div>Treatments</div>', '<div data-i18n="footer.treatments">Treatments</div>'],
  ['<div>Contact Information</div>', '<div data-i18n="footer.contactInfo">Contact Information</div>']
]);
tagFile('404.html', [
  ['404 - Page Not Found', '<span data-i18n="notFound.title">404 - Page Not Found</span>'],
  ['Back to Home', '<span data-i18n="notFound.homeBtn">Back to Home</span>']
]);
