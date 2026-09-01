import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to inject i18n scripts in <head> if missing
function ensureI18nScriptsInHead(html) {
  if (!html.includes('assets/i18n/translations.js')) {
    html = html.replace('</head>', '    <!-- Multilingual i18n Engine -->\n    <script src="assets/i18n/translations.js"></script>\n    <script src="assets/js/i18n.js"></script>\n</head>');
  }
  return html;
}

// 1. Tag INDEX.HTML
function tagIndexHtml() {
  const filePath = path.join(rootDir, 'index.html');
  let content = fs.readFileSync(filePath, 'utf-8');
  content = ensureI18nScriptsInHead(content);

  const replacements = [
    // Navbar
    ['>Home</div>', ' data-i18n="nav.home">Home</div>'],
    ['>About Us</div>', ' data-i18n="nav.about">About Us</div>'],
    ['>Services</div>', ' data-i18n="nav.services">Services</div>'],
    ['>Gallery</div>', ' data-i18n="nav.gallery">Gallery</div>'],
    ['>Blog</div>', ' data-i18n="nav.blog">Blog</div>'],
    ['>Contact</div>', ' data-i18n="nav.contact">Contact</div>'],
    ['>Pages</div>', ' data-i18n="nav.pages">Pages</div>'],
    ['>Blogs</div>', ' data-i18n="nav.blogs">Blogs</div>'],
    ['>Contact Us</div>', ' data-i18n="nav.contactUs">Contact Us</div>'],
    ['>Privacy Policy</div>', ' data-i18n="nav.privacy">Privacy Policy</div>'],
    ['>Terms &amp; Conditions</div>', ' data-i18n="nav.terms">Terms & Conditions</div>'],
    ['>Cookies</div>', ' data-i18n="nav.cookies">Cookies</div>'],
    ['>Book Appointment</div>', ' data-i18n="nav.bookAppointment">Book Appointment</div>'],

    // Hero
    ['Trusted Dental Care for Every Generation</h1>', '<span data-i18n="hero.title">Trusted Dental Care for Every Generation</span></h1>'],
    ['We combine modern technology with heartfelt service to ensure every generation.</p>', '<span data-i18n="hero.subtitle">From preventive care to advanced dental implants and full-mouth rehabilitation, our specialist-led clinic brings together clinical precision and gentle patient comfort.</span></p>'],
    ['>15+</div>', ' data-i18n="hero.stat1.number">15+</div>'],
    ['>Years of Clinical Excellence</div>', ' data-i18n="hero.stat1.label">Years of Clinical Excellence</div>'],
    ['>25,000+</div>', ' data-i18n="hero.stat2.number">25,000+</div>'],
    ['>Happy Smiles Restored</div>', ' data-i18n="hero.stat2.label">Happy Smiles Restored</div>'],
    ['>99%</div>', ' data-i18n="hero.stat3.number">99%</div>'],
    ['>Patient Satisfaction</div>', ' data-i18n="hero.stat3.label">Patient Satisfaction</div>'],
    ['>Book a visit</div>', ' data-i18n="hero.leadForm.title">Book a Consultation</div>'],
    ['>Book a Consultation</div>', ' data-i18n="hero.leadForm.title">Book a Consultation</div>'],
    ['>Get a callback within 10 minutes</div>', ' data-i18n="hero.leadForm.subtitle">Get a callback from our senior dental specialist within 15 minutes.</div>'],
    ['>Get a callback within 15 minutes</div>', ' data-i18n="hero.leadForm.subtitle">Get a callback from our senior dental specialist within 15 minutes.</div>'],
    ['>Request a callback</button>', ' data-i18n="hero.leadForm.submit">Request Callback Now</button>'],
    ['>Request Callback Now</button>', ' data-i18n="hero.leadForm.submit">Request Callback Now</button>'],

    // Story Section
    ['>WHO WE ARE</div>', ' data-i18n="story.badge">WHO WE ARE</div>'],
    ['Decades of Dental Excellence, Compassionate Care</h2>', '<span data-i18n="story.title">Decades of Dental Excellence, Compassionate Care</span></h2>'],
    ['>Digital Precision</div>', ' data-i18n="story.feature1.title">Digital Precision</div>'],
    ['>Painless Treatment</div>', ' data-i18n="story.feature2.title">Painless Treatment</div>'],
    ['>Strict Sterilization</div>', ' data-i18n="story.feature3.title">Strict Sterilization</div>'],

    // Awards Section
    ['>EXCELLENCE &amp; TRUST</div>', ' data-i18n="awards.badge">EXCELLENCE & TRUST</div>'],
    ['Recognized for Clinical Standards and Patient Trust</h2>', '<span data-i18n="awards.title">Recognized for Clinical Standards and Patient Trust</span></h2>'],

    // Services Section
    ['>OUR SERVICES</div>', ' data-i18n="services.badge">OUR SERVICES</div>'],
    ['Comprehensive Dental Care, Designed Around You</h2>', '<span data-i18n="services.title">Comprehensive Dental Care, Designed Around You</span></h2>'],

    // Doctor Section
    ['>CHIEF SURGEON</div>', ' data-i18n="doctor.badge">CHIEF DENTAL SURGEON</div>'],
    ['>CHIEF DENTAL SURGEON</div>', ' data-i18n="doctor.badge">CHIEF DENTAL SURGEON</div>'],
    ['Meet Dr. Suhail A. Syed, BDS, MDS</h2>', '<span data-i18n="doctor.title">Meet Dr. Suhail A. Syed, BDS, MDS</span></h2>'],
    ['>Chief Dental Surgeon | Periodontics &amp; Implantology</div>', ' data-i18n="doctor.designation">Chief Dental Surgeon | Periodontics & Implantology</div>'],

    // Why Redesign
    ['>WHY REDESIGN CLINICS</div>', ' data-i18n="why.badge">WHY REDESIGN DENTAL CLINICS</div>'],
    ['>WHY REDESIGN DENTAL CLINICS</div>', ' data-i18n="why.badge">WHY REDESIGN DENTAL CLINICS</div>'],
    ['Experience Dental Care With a Higher Standard</h2>', '<span data-i18n="why.title">Experience Dental Care With a Higher Standard</span></h2>'],

    // Testimonials
    ['>PATIENT EXPERIENCES</div>', ' data-i18n="testimonials.badge">PATIENT EXPERIENCES</div>'],
    ['Stories of Restored Smiles and Genuine Trust</h2>', '<span data-i18n="testimonials.title">Stories of Restored Smiles and Genuine Trust</span></h2>'],

    // Blog
    ['>DENTAL HEALTH JOURNAL</div>', ' data-i18n="blog.badge">DENTAL HEALTH JOURNAL</div>'],
    ['Evidence-Based Dental Health Insights</h2>', '<span data-i18n="blog.heroTitle">Evidence-Based Dental Health Insights</span></h2>'],

    // Footer
    ['>Quick Links</div>', ' data-i18n="footer.quickLinks">Quick Links</div>'],
    ['>Treatments</div>', ' data-i18n="footer.treatments">Treatments</div>'],
    ['>Contact Information</div>', ' data-i18n="footer.contactInfo">Contact Information</div>']
  ];

  replacements.forEach(([from, to]) => {
    content = content.split(from).join(to);
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('✓ Master tagged index.html');
}

// 2. Tag ABOUT.HTML
function tagAboutHtml() {
  const filePath = path.join(rootDir, 'about.html');
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  content = ensureI18nScriptsInHead(content);

  const replacements = [
    ['>Home</div>', ' data-i18n="nav.home">Home</div>'],
    ['>About Us</div>', ' data-i18n="nav.about">About Us</div>'],
    ['>Services</div>', ' data-i18n="nav.services">Services</div>'],
    ['>Gallery</div>', ' data-i18n="nav.gallery">Gallery</div>'],
    ['>Blog</div>', ' data-i18n="nav.blog">Blog</div>'],
    ['>Contact</div>', ' data-i18n="nav.contact">Contact</div>'],
    ['>Book Appointment</div>', ' data-i18n="nav.bookAppointment">Book Appointment</div>'],
    ['>WHO WE ARE</div>', ' data-i18n="story.badge">WHO WE ARE</div>'],
    ['>EXCELLENCE &amp; TRUST</div>', ' data-i18n="awards.badge">EXCELLENCE & TRUST</div>'],
    ['>Quick Links</div>', ' data-i18n="footer.quickLinks">Quick Links</div>'],
    ['>Treatments</div>', ' data-i18n="footer.treatments">Treatments</div>'],
    ['>Contact Information</div>', ' data-i18n="footer.contactInfo">Contact Information</div>']
  ];

  replacements.forEach(([from, to]) => {
    content = content.split(from).join(to);
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('✓ Master tagged about.html');
}

// 3. Tag DOCTORS.HTML
function tagDoctorsHtml() {
  const filePath = path.join(rootDir, 'doctors.html');
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  content = ensureI18nScriptsInHead(content);

  const replacements = [
    ['>Home</div>', ' data-i18n="nav.home">Home</div>'],
    ['>About Us</div>', ' data-i18n="nav.about">About Us</div>'],
    ['>Services</div>', ' data-i18n="nav.services">Services</div>'],
    ['>Gallery</div>', ' data-i18n="nav.gallery">Gallery</div>'],
    ['>Blog</div>', ' data-i18n="nav.blog">Blog</div>'],
    ['>Contact</div>', ' data-i18n="nav.contact">Contact</div>'],
    ['>Book Appointment</div>', ' data-i18n="nav.bookAppointment">Book Appointment</div>'],
    ['>Quick Links</div>', ' data-i18n="footer.quickLinks">Quick Links</div>'],
    ['>Treatments</div>', ' data-i18n="footer.treatments">Treatments</div>'],
    ['>Contact Information</div>', ' data-i18n="footer.contactInfo">Contact Information</div>']
  ];

  replacements.forEach(([from, to]) => {
    content = content.split(from).join(to);
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('✓ Master tagged doctors.html');
}

// 4. Tag SERVICES.HTML & SERVICE.HTML
function tagServicesHtml() {
  ['services.html', 'service.html'].forEach(fn => {
    const filePath = path.join(rootDir, fn);
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf-8');
    content = ensureI18nScriptsInHead(content);

    const replacements = [
      ['>Home</div>', ' data-i18n="nav.home">Home</div>'],
      ['>About Us</div>', ' data-i18n="nav.about">About Us</div>'],
      ['>Services</div>', ' data-i18n="nav.services">Services</div>'],
      ['>Gallery</div>', ' data-i18n="nav.gallery">Gallery</div>'],
      ['>Blog</div>', ' data-i18n="nav.blog">Blog</div>'],
      ['>Contact</div>', ' data-i18n="nav.contact">Contact</div>'],
      ['>Book Appointment</div>', ' data-i18n="nav.bookAppointment">Book Appointment</div>'],
      ['>OUR SERVICES</div>', ' data-i18n="services.badge">OUR SERVICES</div>'],
      ['Comprehensive Dental Care, Designed Around You</h2>', '<span data-i18n="services.title">Comprehensive Dental Care, Designed Around You</span></h2>'],
      ['>Quick Links</div>', ' data-i18n="footer.quickLinks">Quick Links</div>'],
      ['>Treatments</div>', ' data-i18n="footer.treatments">Treatments</div>'],
      ['>Contact Information</div>', ' data-i18n="footer.contactInfo">Contact Information</div>']
    ];

    replacements.forEach(([from, to]) => {
      content = content.split(from).join(to);
    });

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Master tagged ${fn}`);
  });
}

// 5. Tag CONTACT.HTML
function tagContactHtml() {
  const filePath = path.join(rootDir, 'contact.html');
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  content = ensureI18nScriptsInHead(content);

  const replacements = [
    ['>Home</div>', ' data-i18n="nav.home">Home</div>'],
    ['>About Us</div>', ' data-i18n="nav.about">About Us</div>'],
    ['>Services</div>', ' data-i18n="nav.services">Services</div>'],
    ['>Gallery</div>', ' data-i18n="nav.gallery">Gallery</div>'],
    ['>Blog</div>', ' data-i18n="nav.blog">Blog</div>'],
    ['>Contact</div>', ' data-i18n="nav.contact">Contact</div>'],
    ['>Book Appointment</div>', ' data-i18n="nav.bookAppointment">Book Appointment</div>'],
    ['>GET IN TOUCH</div>', ' data-i18n="contact.badge">✦ GET IN TOUCH</div>'],
    ['>✦ GET IN TOUCH</div>', ' data-i18n="contact.badge">✦ GET IN TOUCH</div>'],
    ['Schedule Your Visit at Redesign Dental Clinics</h1>', '<span data-i18n="contact.heroTitle">Schedule Your Visit at Redesign Dental Clinics</span></h1>'],
    ['>Send Us a Message</h3>', ' data-i18n="contact.form.title">Send Us a Message</h3>'],
    ['>Full Name *</label>', '<span data-i18n="contact.form.nameLabel">Full Name</span> *</label>'],
    ['>Mobile Number *</label>', '<span data-i18n="contact.form.phoneLabel">Mobile Number</span> *</label>'],
    ['>Email Address</label>', '<span data-i18n="contact.form.emailLabel">Email Address</span></label>'],
    ['>Subject / Treatment of Interest</label>', '<span data-i18n="contact.form.subjectLabel">Subject / Treatment of Interest</span></label>'],
    ['>Your Message *</label>', '<span data-i18n="contact.form.messageLabel">Your Message</span> *</label>'],
    ['>Send Message</span>', ' data-i18n="contact.form.submit">Send Message</span>'],
    ['>Clinic Information</h3>', ' data-i18n="contact.clinicDetails">Clinic Information</h3>'],
    ['>Clinic Address</div>', ' data-i18n="contact.addressLabel">Clinic Address</div>'],
    ['>Phone Support</div>', ' data-i18n="contact.phoneLabel">Phone Support</div>'],
    ['>Email Enquiries</div>', ' data-i18n="contact.emailLabel">Email Enquiries</div>'],
    ['>Working Hours</div>', ' data-i18n="contact.hoursLabel">Working Hours</div>'],
    ['>Quick Links</div>', ' data-i18n="footer.quickLinks">Quick Links</div>'],
    ['>Treatments</div>', ' data-i18n="footer.treatments">Treatments</div>'],
    ['>Contact Information</div>', ' data-i18n="footer.contactInfo">Contact Information</div>']
  ];

  replacements.forEach(([from, to]) => {
    content = content.split(from).join(to);
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('✓ Master tagged contact.html');
}

// 6. Tag BOOKING.HTML
function tagBookingHtml() {
  const filePath = path.join(rootDir, 'booking.html');
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  content = ensureI18nScriptsInHead(content);

  const replacements = [
    ['>Home</div>', ' data-i18n="nav.home">Home</div>'],
    ['>About Us</div>', ' data-i18n="nav.about">About Us</div>'],
    ['>Services</div>', ' data-i18n="nav.services">Services</div>'],
    ['>Gallery</div>', ' data-i18n="nav.gallery">Gallery</div>'],
    ['>Blog</div>', ' data-i18n="nav.blog">Blog</div>'],
    ['>Contact</div>', ' data-i18n="nav.contact">Contact</div>'],
    ['>Book Appointment</div>', ' data-i18n="nav.bookAppointment">Book Appointment</div>'],
    ['Book Your Dental Appointment</h1>', '<span data-i18n="booking.modalTitle">Book Your Dental Appointment</span></h1>'],
    ['>Confirm Appointment Request</span>', ' data-i18n="booking.submitBtn">Confirm Appointment Request</span>'],
    ['>Quick Links</div>', ' data-i18n="footer.quickLinks">Quick Links</div>'],
    ['>Treatments</div>', ' data-i18n="footer.treatments">Treatments</div>'],
    ['>Contact Information</div>', ' data-i18n="footer.contactInfo">Contact Information</div>']
  ];

  replacements.forEach(([from, to]) => {
    content = content.split(from).join(to);
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('✓ Master tagged booking.html');
}

// 7. Tag GALLERY.HTML, BLOG.HTML, LEGAL PAGES, 404
function tagRemainingPages() {
  const pages = ['gallery.html', 'blog.html', 'privacy.html', 'terms.html', 'cookies.html', 'licenses.html', '404.html'];
  pages.forEach(fn => {
    const filePath = path.join(rootDir, fn);
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf-8');
    content = ensureI18nScriptsInHead(content);

    const replacements = [
      ['>Home</div>', ' data-i18n="nav.home">Home</div>'],
      ['>About Us</div>', ' data-i18n="nav.about">About Us</div>'],
      ['>Services</div>', ' data-i18n="nav.services">Services</div>'],
      ['>Gallery</div>', ' data-i18n="nav.gallery">Gallery</div>'],
      ['>Blog</div>', ' data-i18n="nav.blog">Blog</div>'],
      ['>Contact</div>', ' data-i18n="nav.contact">Contact</div>'],
      ['>Book Appointment</div>', ' data-i18n="nav.bookAppointment">Book Appointment</div>'],
      ['>Quick Links</div>', ' data-i18n="footer.quickLinks">Quick Links</div>'],
      ['>Treatments</div>', ' data-i18n="footer.treatments">Treatments</div>'],
      ['>Contact Information</div>', ' data-i18n="footer.contactInfo">Contact Information</div>'],
      ['&larr; Back to home</a>', '<span data-i18n="common.backToHome">&larr; Back to home</span></a>'],
      ['Back to home</a>', '<span data-i18n="notFound.homeBtn">Return to Home Page</span></a>'],
      ['<h1>Licenses</h1>', '<h1 data-i18n="legal.licensesTitle">Licenses</h1>'],
      ['<h1>Privacy Policy</h1>', '<h1 data-i18n="legal.privacyTitle">Privacy Policy</h1>'],
      ['<h1>Terms &amp; Conditions</h1>', '<h1 data-i18n="legal.termsTitle">Terms & Conditions</h1>'],
      ['<h1>Terms & Conditions</h1>', '<h1 data-i18n="legal.termsTitle">Terms & Conditions</h1>'],
      ['<h1>Cookie Policy</h1>', '<h1 data-i18n="legal.cookiesTitle">Cookie Policy</h1>'],
      ['<h1>Cookies</h1>', '<h1 data-i18n="legal.cookiesTitle">Cookie Policy</h1>'],
      ['<h1>404</h1>', '<h1 data-i18n="notFound.title">404 - Page Not Found</h1>'],
      ["<p>We couldn't find that page.</p>", '<p data-i18n="notFound.desc">The page you are looking for might have been moved, renamed, or is temporarily unavailable.</p>']
    ];

    replacements.forEach(([from, to]) => {
      content = content.split(from).join(to);
    });

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Master tagged ${fn}`);
  });
}

tagIndexHtml();
tagAboutHtml();
tagDoctorsHtml();
tagServicesHtml();
tagContactHtml();
tagBookingHtml();
tagRemainingPages();
console.log('🎉 Finished master tagging of all root HTML pages!');
