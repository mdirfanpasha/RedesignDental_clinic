/**
 * scripts/sync-navbar.cjs
 * 
 * Synchronizes the canonical single-source-of-truth Navbar component across all HTML files
 * in the repository, ensuring 100% markup consistency, locked desktop DOM order,
 * overlay dropdowns, and mobile responsiveness.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const CANONICAL_NAVBAR_HTML = `        <!-- ===== CANONICAL SINGLE SOURCE OF TRUTH NAVBAR ===== -->
        <div data-collapse="medium" data-animation="default" data-duration="400" fs-scrolldisable-element="smart-nav" data-easing="ease" data-easing2="ease" role="banner" class="navbar_wrap w-nav">
            <div class="navbar_container">
                <a href="/" class="navbar_logo w-nav-brand">
                    <img loading="eager" src="/assets/img/redesign-dental-clinics-logo-white.png" alt="Redesign Dental Clinics" class="logo_image"/>
                </a>
                <div class="navbar-content_wrap">
                    <nav role="navigation" class="navbar_menu w-nav-menu">
                        <a href="/" class="navbar_link w-inline-block"><div data-i18n="nav.home">Home</div></a>
                        <!-- ABOUT US DROPDOWN -->
                        <div class="navbar_dropdown w-dropdown rc-nav-dropdown" data-dropdown-type="about">
                            <div class="navbar-dropdown_toggle_group">
                                <a href="/about" class="navbar_link rc-nav-parent-link"><span data-i18n="nav.about">About Us</span></a>
                                <button type="button" class="rc-dropdown-arrow-btn" aria-label="Toggle About Us menu" aria-expanded="false">
                                    <span class="dropdown_chevron">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 20 20" fill="none" vector-effect="non-scaling-stroke" preserveAspectRatio="none">
                                            <path d="M9.99991 10.9763L14.1247 6.85156L15.3032 8.03007L9.99991 13.3334L4.69666 8.03007L5.87516 6.85156L9.99991 10.9763Z" fill="currentColor"></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                            <nav class="navbar-dropdown_list w-dropdown-list rc-dropdown-menu">
                                <div class="rc-dropdown-inner">
                                    <a href="/about" class="rc-dropdown-link" data-i18n="nav.aboutRedesign">About Redesign</a>
                                    <a href="/#doctor-profile" class="rc-dropdown-link" data-i18n="nav.aboutDrSuhail">About Dr. Suhail</a>
                                    <a href="/doctors" class="rc-dropdown-link" data-i18n="nav.ourDoctors">Our Doctors</a>
                                </div>
                            </nav>
                        </div>
                        <!-- SERVICES DROPDOWN -->
                        <div class="navbar_dropdown w-dropdown rc-nav-dropdown" data-dropdown-type="services">
                            <div class="navbar-dropdown_toggle_group">
                                <a href="/services" class="navbar_link rc-nav-parent-link"><span data-i18n="nav.services">Services</span></a>
                                <button type="button" class="rc-dropdown-arrow-btn" aria-label="Toggle Services menu" aria-expanded="false">
                                    <span class="dropdown_chevron">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 20 20" fill="none" vector-effect="non-scaling-stroke" preserveAspectRatio="none">
                                            <path d="M9.99991 10.9763L14.1247 6.85156L15.3032 8.03007L9.99991 13.3334L4.69666 8.03007L5.87516 6.85156L9.99991 10.9763Z" fill="currentColor"></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                            <nav class="navbar-dropdown_list w-dropdown-list rc-dropdown-menu">
                                <div class="rc-dropdown-inner">
                                    <a href="/services#orthodontics" class="rc-dropdown-link" data-i18n="services.cat.orthodontics">Orthodontics</a>
                                    <a href="/services#endodontics" class="rc-dropdown-link" data-i18n="services.cat.endodontics">Endodontics</a>
                                    <a href="/services#preventive-general" class="rc-dropdown-link" data-i18n="services.cat.preventive">Preventive &amp; General</a>
                                    <a href="/services#cosmetic-dentistry" class="rc-dropdown-link" data-i18n="services.cat.cosmetic">Cosmetic Dentistry</a>
                                    <a href="/services#restorative-dentistry" class="rc-dropdown-link" data-i18n="services.cat.restorative">Restorative Dentistry</a>
                                    <a href="/services#oral-surgery" class="rc-dropdown-link" data-i18n="services.cat.surgery">Oral Surgery</a>
                                    <a href="/services#gum-care-periodontics" class="rc-dropdown-link" data-i18n="services.cat.periodontics">Gum Care / Periodontics</a>
                                    <a href="/services#advanced-dentistry" class="rc-dropdown-link" data-i18n="services.cat.advanced">Advanced Dentistry</a>
                                    <a href="/services#pediatric-care" class="rc-dropdown-link" data-i18n="services.cat.pediatric">Pediatric Care</a>
                                    <a href="/services#emergency-care" class="rc-dropdown-link" data-i18n="services.cat.emergency">Emergency Care</a>
                                </div>
                            </nav>
                        </div>
                        <a href="/gallery" class="navbar_link w-inline-block"><div data-i18n="nav.gallery">Gallery</div></a>
                        <a href="/blog" class="navbar_link w-inline-block"><div data-i18n="nav.blog">Blog</div></a>
                        <a href="/contact" class="navbar_link w-inline-block"><div data-i18n="nav.contact">Contact</div></a>
                        <!-- PAGES DROPDOWN -->
                        <div class="navbar_dropdown w-dropdown rc-nav-dropdown" data-dropdown-type="pages">
                            <div class="navbar-dropdown_toggle_group">
                                <span class="navbar_link rc-nav-parent-link"><span data-i18n="nav.pages">Pages</span></span>
                                <button type="button" class="rc-dropdown-arrow-btn" aria-label="Toggle Pages menu" aria-expanded="false">
                                    <span class="dropdown_chevron">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 20 20" fill="none" vector-effect="non-scaling-stroke" preserveAspectRatio="none">
                                            <path d="M9.99991 10.9763L14.1247 6.85156L15.3032 8.03007L9.99991 13.3334L4.69666 8.03007L5.87516 6.85156L9.99991 10.9763Z" fill="currentColor"></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                            <nav class="navbar-dropdown_list w-dropdown-list rc-dropdown-menu is-pages-dropdown">
                                <div class="rc-dropdown-pages-wrapper">
                                    <div class="navbar-dropdown_column">
                                        <a href="/" class="rc-dropdown-link" data-i18n="nav.home">Home</a>
                                        <a href="/about" class="rc-dropdown-link" data-i18n="nav.about">About Us</a>
                                        <a href="/services" class="rc-dropdown-link" data-i18n="nav.services">Services</a>
                                        <a href="/blog" class="rc-dropdown-link" data-i18n="nav.blogs">Blogs</a>
                                    </div>
                                    <div class="navbar-dropdown_column">
                                        <a href="/contact" class="rc-dropdown-link" data-i18n="nav.contactUs">Contact Us</a>
                                        <a href="/privacy" class="rc-dropdown-link" data-i18n="nav.privacy">Privacy Policy</a>
                                        <a href="/terms" class="rc-dropdown-link" data-i18n="nav.terms">Terms &amp; Conditions</a>
                                        <a href="/cookies" class="rc-dropdown-link" data-i18n="nav.cookies">Cookies</a>
                                    </div>
                                </div>
                                <div class="navbar-dropdown_bottom">
                                    <p class="dropdown-info_text" data-i18n="nav.copyright">&copy; 2026 Redesign Dental Clinics</p>
                                    <div class="navbar-dropdown_social">
                                        <a aria-label="facebook" href="https://www.facebook.com/RedesignDental" target="_blank" rel="noopener noreferrer" class="dropdown-social_icon-item w-inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 16 24" fill="none" class="social_icon is-facebook">
                                                <path d="M12.2558 5.33333H8.92242C8.30875 5.33333 7.81131 5.8308 7.81131 6.44444V9.77778H12.2558C12.3821 9.77498 12.502 9.83378 12.5771 9.93544C12.6522 10.0371 12.6733 10.1689 12.6335 10.2889L11.8113 12.7333C11.7355 12.9577 11.5259 13.1093 11.2891 13.1111H7.81131V21.4444C7.81131 21.7512 7.56253 22 7.25575 22H4.47798C4.17116 22 3.92242 21.7512 3.92242 21.4444V13.1111H2.25575C1.94893 13.1111 1.7002 12.8623 1.7002 12.5556V10.3333C1.7002 10.0266 1.94893 9.77778 2.25575 9.77778H3.92242V6.44444C3.92242 3.98984 5.9123 2 8.36687 2H12.2558C12.5625 2 12.8113 2.24873 12.8113 2.55556V4.77778C12.8113 5.0846 12.5625 5.33333 12.2558 5.33333Z" fill="currentColor"></path>
                                            </svg>
                                        </a>
                                        <a aria-label="instagram" href="https://www.instagram.com/redesign.dental.clinics/" target="_blank" rel="noopener noreferrer" class="dropdown-social_icon-item w-inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 26 24" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M17.8194 2H8.93056C5.86231 2 3.375 4.48731 3.375 7.55556V16.4444C3.375 19.5127 5.86231 22 8.93056 22H17.8194C20.8876 22 23.375 19.5127 23.375 16.4444V7.55556C23.375 4.48731 20.8876 2 17.8194 2ZM21.4305 16.4444C21.4244 18.4362 19.8112 20.0494 17.8194 20.0556H8.93056C6.93873 20.0494 5.32555 18.4362 5.31945 16.4444V7.55556C5.32555 5.56372 6.93873 3.95054 8.93056 3.94444H17.8194C19.8112 3.95054 21.4244 5.56372 21.4305 7.55556V16.4444ZM18.6527 7.83333C19.2664 7.83333 19.7638 7.33587 19.7638 6.72222C19.7638 6.10858 19.2664 5.61111 18.6527 5.61111C18.0391 5.61111 17.5416 6.10858 17.5416 6.72222C17.5416 7.33587 18.0391 7.83333 18.6527 7.83333ZM13.375 7C10.6136 7 8.375 9.23858 8.375 12C8.375 14.7614 10.6136 17 13.375 17C16.1364 17 18.375 14.7614 18.375 12C18.378 10.673 17.8521 9.39952 16.9137 8.4612C15.9754 7.52288 14.702 6.99704 13.375 7ZM10.3194 12C10.3194 13.6876 11.6874 15.0556 13.375 15.0556C15.0625 15.0556 16.4305 13.6876 16.4305 12C16.4305 10.3124 15.0625 8.94444 13.375 8.94444C11.6874 8.94444 10.3194 10.3124 10.3194 12Z" fill="currentColor"></path>
                                            </svg>
                                        </a>
                                        <a aria-label="youtube" href="https://www.youtube.com/channel/UCA1C9H8oWZomVPiV2GjEOaQ" target="_blank" rel="noopener noreferrer" class="dropdown-social_icon-item w-inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"></path>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </nav>
                        </div>
                        <!-- Dedicated Mobile Drawer CTA button -->
                        <div class="rc-mobile-menu-cta">
                            <a href="/booking" class="button_primary w-inline-block">
                                <div class="button_inner">
                                    <div class="button-text_wrap">
                                        <div class="button_text" data-i18n="nav.getAppointment">Get Appointment</div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </nav>
                    <div class="navbar-button_wrapper">
                        <div class="navbar_button hide-mobile">
                            <div class="button-container">
                                <a href="/booking" class="button_primary w-inline-block">
                                    <div class="button_inner">
                                        <div class="button-text_wrap">
                                            <div class="button_text" data-i18n="nav.getAppointment">Get Appointment</div>
                                        </div>
                                        <div class="button-icon_group">
                                            <div class="button-icon_wrap">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 12 12" fill="none">
                                                    <path d="M4.70139 0.75L10.5303 0.750201L10.5303 6.55165M0.530334 10.75L10.2896 0.990932" stroke="currentColor" stroke-width="1.5"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div class="navbar-toggler-button w-nav-button" aria-label="menu" role="button" tabindex="0" aria-controls="w-nav-overlay-0" aria-haspopup="menu" aria-expanded="false">
                            <div class="navbar-toggle_icon">
                                <div class="navbar-toggler_bar_top"></div>
                                <div class="navbar-toggler_bar-middle"><div class="navbar-toggler_bar-middle_inner"></div></div>
                                <div class="navbar_toggler-bar-bottom"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

function getAllHtmlFiles() {
  const files = [];

  // Root files
  const rootEntries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
  for (const entry of rootEntries) {
    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(path.join(ROOT_DIR, entry.name));
    }
  }

  // Services files
  const servicesDir = path.join(ROOT_DIR, 'services');
  if (fs.existsSync(servicesDir)) {
    const sEntries = fs.readdirSync(servicesDir, { withFileTypes: true });
    for (const entry of sEntries) {
      if (entry.isFile() && entry.name.endsWith('.html')) {
        files.push(path.join(servicesDir, entry.name));
      }
    }
  }

  // Blog files
  const blogDir = path.join(ROOT_DIR, 'blog');
  if (fs.existsSync(blogDir)) {
    const bEntries = fs.readdirSync(blogDir, { withFileTypes: true });
    for (const entry of bEntries) {
      if (entry.isFile() && entry.name.endsWith('.html')) {
        files.push(path.join(blogDir, entry.name));
      }
    }
  }

  return files;
}

function syncFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Regex to match existing navbar_wrap block:
  // Starts with navbar_wrap div and finds matching closing tags
  const startIdx = content.indexOf('class="navbar_wrap');
  if (startIdx !== -1) {
    // Find the opening <div before class="navbar_wrap
    const openTagIdx = content.lastIndexOf('<div', startIdx);
    
    // Find where the navbar block starts (include comment if right before)
    let blockStart = openTagIdx;
    const preText = content.substring(Math.max(0, openTagIdx - 150), openTagIdx);
    const commentMatch = preText.match(/<!--[\s\S]*?(?:NAVBAR|Navigation)[\s\S]*?-->\s*$/i);
    if (commentMatch) {
      blockStart = openTagIdx - commentMatch[0].length;
    }

    // Now find the closing </div> of navbar_wrap by counting nested div tags
    let depth = 0;
    let pos = openTagIdx;
    let blockEnd = -1;

    while (pos < content.length) {
      const nextOpen = content.indexOf('<div', pos);
      const nextClose = content.indexOf('</div>', pos);

      if (nextClose === -1) break;

      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        pos = nextOpen + 4;
      } else {
        depth--;
        pos = nextClose + 6;
        if (depth === 0) {
          blockEnd = pos;
          break;
        }
      }
    }

    if (blockEnd !== -1) {
      content = content.substring(0, blockStart) + CANONICAL_NAVBAR_HTML.trim() + content.substring(blockEnd);
      changed = true;
    }
  } else if (content.includes('class="legal-nav"')) {
    // For legal pages like privacy.html, terms.html, cookies.html, licenses.html
    const legalNavRegex = /<(?:div|nav)[^>]*class="legal-nav"[\s\S]*?<\/(?:div|nav)>/i;
    content = content.replace(legalNavRegex, CANONICAL_NAVBAR_HTML.trim());
    changed = true;
  } else if (filePath.endsWith('404.html')) {
    // For 404.html, insert the navbar right after <body>
    const bodyOpenRegex = /<body[^>]*>/i;
    content = content.replace(bodyOpenRegex, '$&\n' + CANONICAL_NAVBAR_HTML.trim());
    changed = true;
  }

  // Ensure /assets/css/booking-system.css is included in <head>
  if (!content.includes('booking-system.css')) {
    content = content.replace(
      '</head>',
      '    <link rel="stylesheet" href="/assets/css/booking-system.css" type="text/css"/>\n</head>'
    );
    changed = true;
  }

  // Ensure /assets/js/navbar-dropdowns.js is included before </body>
  if (!content.includes('navbar-dropdowns.js')) {
    content = content.replace(
      '</body>',
      '    <script src="/assets/js/navbar-dropdowns.js"></script>\n</body>'
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function verifyFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const hasNavbarWrap = content.includes('class="navbar_wrap');
  const hasAboutDropdown = content.includes('data-dropdown-type="about"');
  const hasServicesDropdown = content.includes('data-dropdown-type="services"');
  const hasPagesDropdown = content.includes('data-dropdown-type="pages"');
  const hasOrthodontics = content.includes('/services#orthodontics');
  const hasBookingCss = content.includes('booking-system.css');
  const hasNavbarJs = content.includes('navbar-dropdowns.js');

  return {
    file: path.relative(ROOT_DIR, filePath),
    valid: hasNavbarWrap && hasAboutDropdown && hasServicesDropdown && hasPagesDropdown && hasOrthodontics && hasBookingCss && hasNavbarJs,
    details: {
      hasNavbarWrap,
      hasAboutDropdown,
      hasServicesDropdown,
      hasPagesDropdown,
      hasOrthodontics,
      hasBookingCss,
      hasNavbarJs
    }
  };
}

// CLI Execution
const isVerifyOnly = process.argv.includes('--verify');
const files = getAllHtmlFiles();

console.log(`Found ${files.length} HTML files.`);

if (isVerifyOnly) {
  let passed = 0;
  let failed = 0;
  for (const f of files) {
    const res = verifyFile(f);
    if (res.valid) {
      passed++;
    } else {
      failed++;
      console.warn(`[FAIL] ${res.file}:`, res.details);
    }
  }
  console.log(`Verification: ${passed} passed, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
} else {
  let updated = 0;
  for (const f of files) {
    if (syncFile(f)) {
      updated++;
    }
  }
  console.log(`Synced canonical navbar to ${updated} files.`);
}
