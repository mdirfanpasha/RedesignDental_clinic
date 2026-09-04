const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const aptHtmlPath = path.join(rootDir, 'appointment.html');
const aptJsPath = path.join(rootDir, 'assets', 'js', 'appointment-page.js');

// 1. UPDATE appointment.html
let html = fs.readFileSync(aptHtmlPath, 'utf8');

// A. Add Multilingual fonts and i18n scripts in <head>
const oldHeadFonts = `<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />`;

const newHeadFontsAndScripts = `<!-- Multilingual & Brand Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@300;400;500;600;700&family=Noto+Sans+Telugu:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

    <!-- Multilingual i18n Engine (Zero Flash) -->
    <script src="/assets/i18n/translations.js"></script>
    <script src="/assets/js/i18n.js"></script>`;

if (html.includes(oldHeadFonts)) {
  html = html.replace(oldHeadFonts, newHeadFontsAndScripts);
  console.log('✓ Replaced fonts and injected i18n scripts in head');
} else {
  console.log('⚠️ Could not find exact oldHeadFonts string');
}

// B. Add CSS for Navbar visibility & contrast before </head>
const navbarCss = `
    <style>
        /* High-contrast signature dark navbar for appointment page */
        .navbar_wrap {
            background: rgba(2, 20, 23, 0.96) !important;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(13, 148, 136, 0.25) !important;
            position: sticky !important;
            top: 0 !important;
            z-index: 1000 !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
        }

        .navbar_link {
            color: #f1f5f9 !important;
            font-weight: 500;
            transition: color 0.25s ease;
        }

        .navbar_link:hover,
        .navbar_link.w--current {
            color: #2dd4bf !important;
        }

        .navbar-dropdown_toggle_group .rc-nav-parent-link {
            color: #f1f5f9 !important;
        }

        .navbar-dropdown_toggle_group .rc-dropdown-arrow-btn {
            color: #f1f5f9 !important;
        }

        .navbar-dropdown_toggle_group:hover .rc-nav-parent-link,
        .navbar-dropdown_toggle_group:hover .rc-dropdown-arrow-btn {
            color: #2dd4bf !important;
        }

        .navbar-dropdown_list.w-dropdown-list,
        .rc-dropdown-menu {
            background: #05262a !important;
            border: 1px solid rgba(13, 148, 136, 0.3) !important;
        }

        .rc-dropdown-link {
            color: #e2e8f0 !important;
        }

        .rc-dropdown-link:hover {
            color: #2dd4bf !important;
            background: rgba(13, 148, 136, 0.12) !important;
        }

        .section_appointment-page {
            padding-top: 36px;
        }
    </style>
</head>`;

if (!html.includes('.navbar_wrap {')) {
  html = html.replace('</head>', navbarCss);
  console.log('✓ Injected navbar contrast CSS');
}

// C. Add data-i18n attributes to appointment hero & form elements
html = html.replace(
  `<span>✦ Specialist Dental Appointment</span>`,
  `<span data-i18n="apt.pill">✦ Specialist Dental Appointment</span>`
);

html = html.replace(
  `<h1 class="apt-page-title">Book Your Appointment</h1>`,
  `<h1 class="apt-page-title" data-i18n="apt.title">Book Your Appointment</h1>`
);

html = html.replace(
  `<p class="apt-page-subtitle">\n                                Choose your preferred date and time, share your details, and request an appointment with Redesign Dental Clinics.\n                            </p>`,
  `<p class="apt-page-subtitle" data-i18n="apt.subtitle">Choose your preferred date and time, share your details, and request an appointment with Redesign Dental Clinics.</p>`
);

html = html.replace(
  `<h2 style="font-size: 1.4rem; font-weight: 700; color: #0f172a; margin-bottom: 24px; letter-spacing: -0.01em;">Select Date, Time &amp; Details</h2>`,
  `<h2 style="font-size: 1.4rem; font-weight: 700; color: #0f172a; margin-bottom: 24px; letter-spacing: -0.01em;" data-i18n="apt.cardTitle">Select Date, Time &amp; Details</h2>`
);

// Full Name Label & Input
html = html.replace(
  `<label class="rc-form-label" for="apt-page-name" style="color:#0f172a; font-weight:700;">Full Name *</label>`,
  `<label class="rc-form-label" for="apt-page-name" style="color:#0f172a; font-weight:700;"><span data-i18n="booking.fullNameLabel">Full Name</span> *</label>`
);
html = html.replace(
  `id="apt-page-name" class="rc-form-input" placeholder="Enter your full name"`,
  `id="apt-page-name" class="rc-form-input" placeholder="Enter your full name" data-i18n-placeholder="booking.fullNamePlaceholder"`
);

// Mobile Phone Label & Input
html = html.replace(
  `<label class="rc-form-label" for="apt-page-phone" style="color:#0f172a; font-weight:700;">Mobile Number *</label>`,
  `<label class="rc-form-label" for="apt-page-phone" style="color:#0f172a; font-weight:700;"><span data-i18n="booking.phoneLabel">Mobile Number</span> *</label>`
);
html = html.replace(
  `id="apt-page-phone" class="rc-form-input" placeholder="10-Digit Mobile Number"`,
  `id="apt-page-phone" class="rc-form-input" placeholder="10-Digit Mobile Number" data-i18n-placeholder="booking.phonePlaceholder"`
);

// Email Label & Input
html = html.replace(
  `<label class="rc-form-label" for="apt-page-email" style="color:#0f172a; font-weight:700;">Email Address <span style="color:#64748b; font-weight:normal;">(Optional)</span></label>`,
  `<label class="rc-form-label" for="apt-page-email" style="color:#0f172a; font-weight:700;"><span data-i18n="booking.emailLabel">Email Address</span> <span style="color:#64748b; font-weight:normal;">(Optional)</span></label>`
);
html = html.replace(
  `id="apt-page-email" class="rc-form-input" placeholder="your.email@example.com (Optional)"`,
  `id="apt-page-email" class="rc-form-input" placeholder="your.email@example.com (Optional)" data-i18n-placeholder="booking.emailPlaceholder"`
);

// Dental Service Label & Select Options
html = html.replace(
  `<label class="rc-form-label" for="apt-page-service" style="color:#0f172a; font-weight:700;">Dental Service <span style="color:#64748b; font-weight:normal;">(Optional)</span></label>`,
  `<label class="rc-form-label" for="apt-page-service" style="color:#0f172a; font-weight:700;"><span data-i18n="apt.serviceLabel">Dental Service</span> <span style="color:#64748b; font-weight:normal;">(Optional)</span></label>`
);
html = html.replace(
  `<option value="">-- Select Dental Service (Optional) --</option>`,
  `<option value="" data-i18n="apt.selectService">-- Select Dental Service (Optional) --</option>`
);
html = html.replace(
  `<option value="Orthodontics (Braces / Aligners)">1. Orthodontics (Braces / Clear Aligners)</option>`,
  `<option value="Orthodontics (Braces / Aligners)" data-i18n="apt.srv.ortho">1. Orthodontics (Braces / Clear Aligners)</option>`
);
html = html.replace(
  `<option value="Endodontics (Root Canal Treatment)">2. Endodontics (Root Canal Treatment)</option>`,
  `<option value="Endodontics (Root Canal Treatment)" data-i18n="apt.srv.endo">2. Endodontics (Root Canal Treatment)</option>`
);
html = html.replace(
  `<option value="Preventive & General Dentistry">3. Preventive &amp; General Dentistry</option>`,
  `<option value="Preventive & General Dentistry" data-i18n="apt.srv.prev">3. Preventive &amp; General Dentistry</option>`
);
html = html.replace(
  `<option value="Cosmetic Dentistry & Smile Makeover">4. Cosmetic Dentistry &amp; Smile Makeover</option>`,
  `<option value="Cosmetic Dentistry & Smile Makeover" data-i18n="apt.srv.cosmetic">4. Cosmetic Dentistry &amp; Smile Makeover</option>`
);
html = html.replace(
  `<option value="Restorative Dentistry (Crowns / Bridges)">5. Restorative Dentistry (Crowns / Bridges)</option>`,
  `<option value="Restorative Dentistry (Crowns / Bridges)" data-i18n="apt.srv.resto">5. Restorative Dentistry (Crowns / Bridges)</option>`
);
html = html.replace(
  `<option value="Oral Surgery & Tooth Extraction">6. Oral Surgery &amp; Tooth Extractions</option>`,
  `<option value="Oral Surgery & Tooth Extraction" data-i18n="apt.srv.surgery">6. Oral Surgery &amp; Tooth Extractions</option>`
);
html = html.replace(
  `<option value="Periodontics & Gum Care">7. Periodontics &amp; Gum Care</option>`,
  `<option value="Periodontics & Gum Care" data-i18n="apt.srv.perio">7. Periodontics &amp; Gum Care</option>`
);
html = html.replace(
  `<option value="Advanced Laser Dentistry">8. Advanced Laser Dentistry</option>`,
  `<option value="Advanced Laser Dentistry" data-i18n="apt.srv.laser">8. Advanced Laser Dentistry</option>`
);
html = html.replace(
  `<option value="Pediatric Dental Care">9. Pediatric Dental Care</option>`,
  `<option value="Pediatric Dental Care" data-i18n="apt.srv.pedia">9. Pediatric Dental Care</option>`
);
html = html.replace(
  `<option value="Emergency Dental Care">10. Emergency Dental Care</option>`,
  `<option value="Emergency Dental Care" data-i18n="apt.srv.emergency">10. Emergency Dental Care</option>`
);
html = html.replace(
  `<option value="General Consultation">General Dental Consultation</option>`,
  `<option value="General Consultation" data-i18n="apt.srv.consult">General Dental Consultation</option>`
);

// Reason for Appointment
html = html.replace(
  `<label class="rc-form-label" for="apt-page-reason" style="color:#0f172a; font-weight:700;">Reason for Appointment <span style="color:#64748b; font-weight:normal;">(Optional)</span></label>`,
  `<label class="rc-form-label" for="apt-page-reason" style="color:#0f172a; font-weight:700;"><span data-i18n="booking.reasonLabel">Reason for Appointment</span> <span style="color:#64748b; font-weight:normal;">(Optional)</span></label>`
);
html = html.replace(
  `<option value="">Select Reason (Optional)</option>`,
  `<option value="" data-i18n="booking.reasonSelect">Select Reason (Optional)</option>`
);
html = html.replace(
  `<option value="General">General</option>`,
  `<option value="General" data-i18n="booking.reasonGeneral">General</option>`
);
html = html.replace(
  `<option value="Emergency">Emergency</option>`,
  `<option value="Emergency" data-i18n="booking.reasonEmergency">Emergency</option>`
);
html = html.replace(
  `<option value="Implants">Implants</option>`,
  `<option value="Implants" data-i18n="booking.reasonImplants">Implants</option>`
);
html = html.replace(
  `<option value="Custom Message">Custom Message</option>`,
  `<option value="Custom Message" data-i18n="booking.reasonCustom">Custom Message</option>`
);

// Custom message
html = html.replace(
  `<label class="rc-form-label" for="apt-page-custom-msg" style="color:#0f172a; font-weight:700;">Tell us more <span style="color:#64748b; font-weight:normal;">(Optional)</span></label>`,
  `<label class="rc-form-label" for="apt-page-custom-msg" style="color:#0f172a; font-weight:700;"><span data-i18n="booking.customMsgLabel">Tell us more</span> <span style="color:#64748b; font-weight:normal;">(Optional)</span></label>`
);
html = html.replace(
  `id="apt-page-custom-msg" class="rc-form-textarea" placeholder="Describe your specific concern or question (Optional)"`,
  `id="apt-page-custom-msg" class="rc-form-textarea" placeholder="Describe your specific concern or question (Optional)" data-i18n-placeholder="booking.customMsgPlaceholder"`
);

// Date & Time slot labels
html = html.replace(
  `<label class="rc-form-label" style="color:#0f172a; font-weight:700;">Select Preferred Appointment Date *</label>`,
  `<label class="rc-form-label" style="color:#0f172a; font-weight:700;" data-i18n="apt.selectDate">Select Preferred Appointment Date *</label>`
);
html = html.replace(
  `<label class="rc-form-label" style="color:#0f172a; font-weight:700;">Select Preferred 30-Minute Time Slot *</label>`,
  `<label class="rc-form-label" style="color:#0f172a; font-weight:700;" data-i18n="apt.selectSlot">Select Preferred 30-Minute Time Slot *</label>`
);

// Submit button & note
html = html.replace(
  `<span>Request Appointment via WhatsApp</span>`,
  `<span data-i18n="apt.submitWhatsApp">Request Appointment via WhatsApp</span>`
);
html = html.replace(
  `Your appointment request will be prepared and sent to Redesign Dental Clinics for confirmation.`,
  `<span data-i18n="apt.submitNote">Your appointment request will be prepared and sent to Redesign Dental Clinics for confirmation.</span>`
);

// Success view
html = html.replace(
  `<h3 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 12px;">Appointment Request Prepared!</h3>`,
  `<h3 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 12px;" data-i18n="apt.successTitle">Appointment Request Prepared!</h3>`
);
html = html.replace(
  `<div class="button_text">Return to Homepage</div>`,
  `<div class="button_text" data-i18n="apt.returnHome">Return to Homepage</div>`
);

// How booking works section
html = html.replace(
  `<h2 style="font-size: 1.8rem; font-weight: 800; color: #0f172a; margin-bottom: 12px; letter-spacing: normal !important;">How Booking Works</h2>`,
  `<h2 style="font-size: 1.8rem; font-weight: 800; color: #0f172a; margin-bottom: 12px; letter-spacing: normal !important;" data-i18n="apt.howItWorksTitle">How Booking Works</h2>`
);
html = html.replace(
  `<p style="font-size: 1rem; color: #475569; max-width: 600px; margin: 0 auto 40px auto; letter-spacing: normal !important;">\n                                A seamless, transparent 3-step appointment experience designed for your convenience.\n                            </p>`,
  `<p style="font-size: 1rem; color: #475569; max-width: 600px; margin: 0 auto 40px auto; letter-spacing: normal !important;" data-i18n="apt.howItWorksSubtitle">A seamless, transparent 3-step appointment experience designed for your convenience.</p>`
);

html = html.replace(
  `<div style="font-size: 18px; font-weight: 800; color: #0d9488; margin-bottom: 10px; letter-spacing: 0.05em !important;">STEP 1</div>`,
  `<div style="font-size: 18px; font-weight: 800; color: #0d9488; margin-bottom: 10px; letter-spacing: 0.05em !important;" data-i18n="apt.step1Tag">STEP 1</div>`
);
html = html.replace(
  `<h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px; letter-spacing: normal !important;">Select Slot &amp; Details</h3>`,
  `<h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px; letter-spacing: normal !important;" data-i18n="apt.step1Title">Select Slot &amp; Details</h3>`
);
html = html.replace(
  `Pick your required dental service, preferred date on the open calendar, and exact 30-minute time slot.`,
  `<span data-i18n="apt.step1Desc">Pick your required dental service, preferred date on the open calendar, and exact 30-minute time slot.</span>`
);

html = html.replace(
  `<div style="font-size: 18px; font-weight: 800; color: #0d9488; margin-bottom: 10px; letter-spacing: 0.05em !important;">STEP 2</div>`,
  `<div style="font-size: 18px; font-weight: 800; color: #0d9488; margin-bottom: 10px; letter-spacing: 0.05em !important;" data-i18n="apt.step2Tag">STEP 2</div>`
);
html = html.replace(
  `<h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px; letter-spacing: normal !important;">WhatsApp Confirmation</h3>`,
  `<h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px; letter-spacing: normal !important;" data-i18n="apt.step2Title">WhatsApp Confirmation</h3>`
);
html = html.replace(
  `Your request opens in WhatsApp pre-filled with all details. Simply press Send.`,
  `<span data-i18n="apt.step2Desc">Your request opens in WhatsApp pre-filled with all details. Simply press Send.</span>`
);

html = html.replace(
  `<div style="font-size: 18px; font-weight: 800; color: #0d9488; margin-bottom: 10px; letter-spacing: 0.05em !important;">STEP 3</div>`,
  `<div style="font-size: 18px; font-weight: 800; color: #0d9488; margin-bottom: 10px; letter-spacing: 0.05em !important;" data-i18n="apt.step3Tag">STEP 3</div>`
);
html = html.replace(
  `<h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px; letter-spacing: normal !important;">Visit Clinic</h3>`,
  `<h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px; letter-spacing: normal !important;" data-i18n="apt.step3Title">Visit Clinic</h3>`
);
html = html.replace(
  `Receive fast confirmation from our front desk and visit us at Banjara Hills Road No. 1.`,
  `<span data-i18n="apt.step3Desc">Receive fast confirmation from our front desk and visit us at Banjara Hills Road No. 1.</span>`
);

fs.writeFileSync(aptHtmlPath, html, 'utf8');
console.log('✓ Successfully written appointment.html with i18n tags and navbar CSS');
