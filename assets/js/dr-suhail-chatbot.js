/**
 * Dr. Suhail's Virtual Dental Assistant Chatbot
 * Redesign Dental Clinics - Specialist Dental Care
 * 
 * Modular Predefined Assistant Engine with Dedicated Quick Questions & Smooth Message Scrolling
 */

(function () {
  'use strict';

  // ─── Predefined Knowledge Base (Full Predefined Questions Set) ────────────
  var SUHAIL_CHAT_DATA = [
    {
      id: 'book-appointment',
      question: 'How can I book an appointment?',
      answer: "You can book an appointment by using the 'Book Appointment' button on the website. Fill in your details and preferred appointment information, and our clinic team will assist you with the booking.",
      keywords: ['book', 'appointment', 'schedule', 'visit', 'consultation', 'reserve', 'timing', 'slot', 'booking'],
      ctas: [
        { label: 'Book an Appointment', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'dental-services',
      question: 'What dental services do you provide?',
      answer: 'Redesign Dental Clinics provides comprehensive specialist dental care, including Orthodontics, Endodontics, Dental Implants, Preventive & General Dentistry, Cosmetic Dentistry, Restorative Dentistry, Oral Surgery, Periodontics & Gum Care, Advanced Laser Dentistry, Pediatric Care, and Emergency Dental Care.',
      keywords: ['services', 'treatments', 'procedures', 'provide', 'offer', 'options', 'care', 'dental care'],
      ctas: [
        { label: 'Explore Services', action: 'explore_services', style: 'is-primary', icon: 'arrow' }
      ]
    },
    {
      id: 'clinic-location',
      question: 'Where is Redesign Dental Clinics located?',
      answer: 'Redesign Dental Clinics is located at Road No. 1, Banjara Hills, Hyderabad (6th Floor, Reliance Classic Enclave). We have dedicated valet parking and complete patient accessibility.',
      keywords: ['location', 'where', 'address', 'directions', 'map', 'banjara hills', 'hyderabad', 'place'],
      ctas: [
        { label: 'View Location & Directions', action: 'view_contact', style: 'is-primary', icon: 'arrow' }
      ]
    },
    {
      id: 'working-hours',
      question: 'What are your working hours?',
      answer: 'Our clinic is open Monday through Friday from 10:00 AM to 8:00 PM IST, and Sunday from 10:00 AM to 2:00 PM IST.',
      keywords: ['timings', 'hours', 'open', 'closing', 'working hours', 'sunday', 'schedule', 'time'],
      ctas: [
        { label: 'View Contact Details', action: 'view_contact', style: 'is-primary', icon: 'arrow' }
      ]
    },
    {
      id: 'contact-clinic',
      question: 'How can I contact the clinic?',
      answer: 'You can reach us by phone at +91 7780-245-307, landline 040-66772333, email redesigndental@gmail.com, or through WhatsApp.',
      keywords: ['contact', 'phone', 'call', 'email', 'reach out', 'number', 'landline'],
      ctas: [
        { label: 'Call Clinic', action: 'call_clinic', style: 'is-call', icon: 'phone' },
        { label: 'WhatsApp Us', action: 'whatsapp_chat', style: 'is-whatsapp', icon: 'whatsapp' }
      ]
    },
    {
      id: 'dental-implants',
      question: 'Do you provide dental implants?',
      answer: 'Yes! We specialize in single-tooth, multi-tooth, and full-arch (All-on-4) permanent dental implants using advanced 3D CBCT guided surgical technology.',
      keywords: ['implant', 'implants', 'missing tooth', 'missing teeth', 'titanium', 'zirconia', 'all-on-4', 'fixed teeth'],
      ctas: [
        { label: 'Book Implant Consultation', action: 'open_appointment', payload: { reason: 'Implants' }, style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'root-canal',
      question: 'Do you provide root canal treatment?',
      answer: 'Yes! We provide single-visit pain-free root canal treatment using rotary endodontics, digital apex locators, and microscopic precision.',
      keywords: ['root canal', 'rct', 'endodontic', 'infection', 'pulp', 'nerve', 'decay', 'abscess'],
      ctas: [
        { label: 'Book Consultation', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'cosmetic-dentistry',
      question: 'Do you provide cosmetic dentistry?',
      answer: 'Yes! We offer porcelain veneers, composite bonding, teeth reshaping, gum contouring, and comprehensive digital smile makeovers.',
      keywords: ['cosmetic', 'aesthetic', 'veneers', 'laminates', 'bonding', 'appearance', 'smile aesthetics'],
      ctas: [
        { label: 'Explore Cosmetic Dentistry', action: 'explore_services', style: 'is-primary', icon: 'arrow' }
      ]
    },
    {
      id: 'teeth-whitening',
      question: 'Do you provide teeth whitening?',
      answer: 'Yes! We offer in-office LED laser whitening that brightens teeth up to 8 shades in a single 45-minute appointment.',
      keywords: ['whitening', 'teeth whitening', 'bleaching', 'brighten', 'yellow teeth', 'stains', 'sparkle'],
      ctas: [
        { label: 'Book Whitening Session', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'child-dentistry',
      question: 'Do you treat children?',
      answer: 'Yes! Our pediatric dental care covers routine checkups, fissure sealants, fluoride therapy, pulpotomies, and protective mouthguards in a friendly, gentle environment.',
      keywords: ['children', 'child', 'kids', 'pediatric', 'pediatric dentistry', 'baby teeth', 'toddler'],
      ctas: [
        { label: 'Book Pediatric Visit', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'dental-emergency',
      question: 'Do you handle dental emergencies?',
      answer: 'Yes! We provide priority same-day emergency dental care for acute toothaches, dental trauma, swelling, or broken restorations.',
      keywords: ['emergency', 'urgent', 'bleeding', 'swelling', 'broken tooth', 'injury', 'severe', 'acute', 'trauma'],
      ctas: [
        { label: 'Call Emergency Support', action: 'call_clinic', style: 'is-call', icon: 'phone' },
        { label: 'Book Urgent Visit', action: 'open_appointment', payload: { reason: 'Emergency' }, style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'gum-treatment',
      question: 'Do you provide gum treatment?',
      answer: 'Yes! Dr. Suhail A. Syed is a specialist Periodontist (BDS, MDS). We provide scaling and root planing, laser gum therapy (LANAP), gum grafting, and periodontal pocket reduction.',
      keywords: ['gum', 'gums', 'periodontal', 'periodontics', 'bleeding gums', 'receding', 'scaling'],
      ctas: [
        { label: 'Book Gum Consultation', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'orthodontic-treatment',
      question: 'Do you provide orthodontic treatment?',
      answer: 'Yes! We provide traditional metal braces, ceramic tooth-colored braces, clear aligners, bite correction, and teeth alignment treatments.',
      keywords: ['orthodontics', 'braces', 'aligners', 'invisalign', 'clear aligners', 'teeth straightening', 'bite correction'],
      ctas: [
        { label: 'Explore Orthodontics', action: 'explore_services', style: 'is-primary', icon: 'arrow' }
      ]
    },
    {
      id: 'doctor-consultation',
      question: 'Can I consult the doctor before treatment?',
      answer: 'Absolutely! We conduct thorough initial diagnostic consultations, including digital X-rays and 3D intraoral scans, to answer all your questions before starting any treatment.',
      keywords: ['consult', 'consultation', 'doctor', 'speak', 'before treatment', 'first time', 'evaluate'],
      ctas: [
        { label: 'Book Consultation', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'appointment-info',
      question: 'What information do I need to provide for an appointment?',
      answer: 'You only need to provide your full name, 10-digit mobile number, preferred date and time, and the reason for your visit.',
      keywords: ['information', 'details', 'requirements', 'need', 'provide', 'booking info'],
      ctas: [
        { label: 'Book Appointment', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'full-mouth-rehab',
      question: 'Do you provide full mouth rehabilitation?',
      answer: "Yes! Under Dr. Suhail's lead, our multi-specialty team performs complete functional and aesthetic full mouth reconstructions combining implants, crowns, and bite realignment.",
      keywords: ['full mouth', 'rehabilitation', 'reconstruction', 'worn teeth', 'broken teeth', 'full arch'],
      ctas: [
        { label: 'Book Rehabilitation Consultation', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'who-is-dr-suhail',
      question: 'Who is Dr. Suhail?',
      answer: 'Dr. Suhail A. Syed (BDS, MDS - Periodontics, Fellow AAID USA) is our Chief Dental Surgeon with over 20 years of clinical experience in periodontics, implantology, and full mouth rehabilitation.',
      keywords: ['suhail', 'dr suhail', 'who is', 'qualification', 'experience', 'doctor info', 'surgeon'],
      ctas: [
        { label: 'View Doctors Page', action: 'view_doctors', style: 'is-primary', icon: 'arrow' }
      ]
    },
    {
      id: 'about-doctors',
      question: 'How can I learn more about the doctors?',
      answer: "You can view complete doctor profiles, qualifications, and specialties on our dedicated 'Our Doctors' page.",
      keywords: ['doctors', 'team', 'dentists', 'specialists', 'learn more', 'profiles'],
      ctas: [
        { label: 'View Our Doctors', action: 'view_doctors', style: 'is-primary', icon: 'arrow' }
      ]
    }
  ];

  function t(key, fallback) {
    if (window.i18n && typeof window.i18n.t === 'function') {
      var val = window.i18n.t(key);
      if (val && val !== key) return val;
    }
    return fallback || key;
  }

  var WELCOME_TEXT = "Hi! 👋 I'm the Redesign Clinics virtual assistant.\n\nHow can I help you today?";
  var DOCTOR_AVATAR_SRC = '/assets/img/dr-suhail-floating-icon.png';
  var DOCTOR_AVATAR_FALLBACK = '/assets/img/suhail_icon-removebg-preview.png';
  var CLINIC_PHONE = '+917780245307';
  var WA_URL = 'https://wa.me/917780245307?text=Hi%20Redesign%20Dental%20Clinics%2C%20I%20would%20like%20to%20enquire%20about%20dental%20treatments';
  var SESSION_STORAGE_KEY = 'redesign_suhail_chat_session_v2';

  // ─── SVG Icons Helper ───────────────────────────────────────────────────────
  var ICONS = {
    close: '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
    reset: '<svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',
    search: '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
    calendar: '<svg viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>'
  };

  // ─── Query Dispatcher ───────────────────────────────────────────────────────
  var ChatDispatcher = {
    searchQuestions: function (keyword) {
      var query = String(keyword || '').trim().toLowerCase();
      if (!query) return [];

      return SUHAIL_CHAT_DATA.filter(function (q) {
        if (q.question.toLowerCase().indexOf(query) !== -1) return true;
        return q.keywords.some(function (kw) {
          return kw.toLowerCase().indexOf(query) !== -1 || query.indexOf(kw.toLowerCase()) !== -1;
        });
      });
    }
  };

  // ─── Session Storage ────────────────────────────────────────────────────────
  var ChatSession = {
    load: function () {
      try {
        var raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch (err) {
        console.warn('[DrSuhailChatbot] Session load error:', err);
      }
      return null;
    },

    save: function (data) {
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        console.warn('[DrSuhailChatbot] Session save error:', err);
      }
    },

    clear: function () {
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch (err) {}
    }
  };

  // ─── Dr. Suhail Chatbot UI Controller ───────────────────────────────────────
  var DrSuhailChatbot = {
    widgetEl: null,
    backdropEl: null,
    bodyEl: null,
    footerEl: null,
    searchInput: null,
    searchResults: null,
    isOpenState: false,
    isProcessing: false,
    activeTriggerBtn: null,
    messages: [],

    init: function () {
      if (document.getElementById('sh-chat-widget')) {
        this.widgetEl = document.getElementById('sh-chat-widget');
        return;
      }

      this.buildDOM();
      this.bindEvents();
      this.renderQuickQuestionsArea();
      this.restoreSessionOrWelcome();
    },

    buildDOM: function () {
      // 1. Backdrop
      var backdrop = document.createElement('div');
      backdrop.className = 'sh-chat-backdrop';
      backdrop.id = 'sh-chat-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdrop);
      this.backdropEl = backdrop;

      // 2. Widget container
      var widget = document.createElement('div');
      widget.className = 'sh-chat-widget';
      widget.id = 'sh-chat-widget';
      widget.setAttribute('role', 'dialog');
      widget.setAttribute('aria-label', "Dr. Suhail's Virtual Assistant");
      widget.setAttribute('aria-modal', 'false');

      widget.innerHTML = `
        <div class="sh-chat-header">
          <div class="sh-header-profile">
            <div class="sh-avatar-wrapper">
              <img src="${DOCTOR_AVATAR_SRC}" onerror="this.onerror=null;this.src='${DOCTOR_AVATAR_FALLBACK}'" alt="Dr. Suhail" class="sh-avatar-img" />
            </div>
            <div class="sh-header-info">
              <h3 class="sh-header-title">Dr. Suhail's Assistant</h3>
              <p class="sh-header-subtitle">Your Dental Care Assistant</p>
              <div class="sh-header-status">
                <span class="sh-status-dot"></span>
                <span>Online</span>
              </div>
            </div>
          </div>
          <div class="sh-header-actions">
            <button type="button" class="sh-header-btn sh-header-reset-btn" id="sh-start-over-header-btn" title="Start Over" aria-label="Start Conversation Over">
              ${ICONS.reset}
              <span>Reset</span>
            </button>
            <button type="button" class="sh-header-btn" id="sh-close-chat-btn" title="Close Assistant" aria-label="Close Dr. Suhail's Assistant">
              ${ICONS.close}
            </button>
          </div>
        </div>

        <!-- 1. MESSAGES CONTAINER (Scrolls independently) -->
        <div class="sh-chat-body" id="sh-chat-body" aria-live="polite">
          <!-- Messages dynamically injected here -->
        </div>

        <!-- 2. DEDICATED QUICK QUESTIONS AREA (Fixed at bottom above footer) -->
        <div class="sh-quick-questions-area" id="sh-quick-questions-area">
          <div class="sh-qq-header">Quick Questions</div>
          <div class="sh-qq-list" id="sh-qq-initial-list"></div>
          <button type="button" class="sh-see-more-btn" id="sh-see-more-btn" aria-expanded="false">
            <span>See More Questions</span>
            <span class="sh-see-more-icon">${ICONS.chevronDown}</span>
          </button>
          <div class="sh-qq-expanded-panel" id="sh-qq-expanded-panel" style="display: none;"></div>
        </div>

        <!-- 3. CHAT FOOTER (Search bar & branding) -->
        <div class="sh-chat-footer">
          <div class="sh-search-results" id="sh-search-results" role="listbox" aria-label="Matching questions"></div>
          <div class="sh-search-wrap">
            <span class="sh-search-icon">${ICONS.search}</span>
            <input type="text" class="sh-search-input" id="sh-search-input" placeholder="Search for a question..." aria-label="Search for a dental question" autocomplete="off" />
            <button type="button" class="sh-search-clear" id="sh-search-clear" aria-label="Clear search">
              ${ICONS.close}
            </button>
          </div>
          <div class="sh-footer-meta">
            <span>Redesign Dental Clinics</span>
            <button type="button" class="sh-start-over-link" id="sh-start-over-footer-btn">↻ Start Over</button>
          </div>
        </div>
      `;

      document.body.appendChild(widget);
      this.widgetEl = widget;
      this.bodyEl = widget.querySelector('#sh-chat-body');
      this.footerEl = widget.querySelector('.sh-chat-footer');
      this.searchInput = widget.querySelector('#sh-search-input');
      this.searchResults = widget.querySelector('#sh-search-results');
    },

    bindEvents: function () {
      var self = this;

      // Close button
      var closeBtn = this.widgetEl.querySelector('#sh-close-chat-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
          e.preventDefault();
          self.close();
        });
      }

      // Backdrop click
      if (this.backdropEl) {
        this.backdropEl.addEventListener('click', function () {
          self.close();
        });
      }

      // Reset buttons
      var resetHeaderBtn = this.widgetEl.querySelector('#sh-start-over-header-btn');
      var resetFooterBtn = this.widgetEl.querySelector('#sh-start-over-footer-btn');
      var handleReset = function (e) {
        e.preventDefault();
        self.startOver();
      };
      if (resetHeaderBtn) resetHeaderBtn.addEventListener('click', handleReset);
      if (resetFooterBtn) resetFooterBtn.addEventListener('click', handleReset);

      // Search input filtering
      if (this.searchInput) {
        this.searchInput.addEventListener('input', function () {
          var val = self.searchInput.value;
          self.handleSearchInput(val);
        });

        this.searchInput.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') {
            self.clearSearch();
          }
        });
      }

      var clearSearchBtn = this.widgetEl.querySelector('#sh-search-clear');
      if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function () {
          self.clearSearch();
        });
      }

      // Global ESC key to close
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && self.isOpenState) {
          self.close();
        }
      });
    },

    renderQuickQuestionsArea: function () {
      var initialListEl = this.widgetEl.querySelector('#sh-qq-initial-list');
      var expandedPanelEl = this.widgetEl.querySelector('#sh-qq-expanded-panel');
      var seeMoreBtn = this.widgetEl.querySelector('#sh-see-more-btn');

      if (!initialListEl || !expandedPanelEl) return;

      var self = this;

      // Top 3 Initial Questions
      var top3Ids = ['book-appointment', 'dental-services', 'clinic-location'];
      var top3Questions = top3Ids.map(function (id) {
        return SUHAIL_CHAT_DATA.find(function (q) { return q.id === id; });
      }).filter(Boolean);

      var top3Html = top3Questions.map(function (q) {
        return `
          <button type="button" class="sh-qq-btn" data-question-id="${q.id}">
            <span>${q.question}</span>
          </button>
        `;
      }).join('');

      initialListEl.innerHTML = top3Html;

      // Remaining Predefined Questions
      var remainingQuestions = SUHAIL_CHAT_DATA.filter(function (q) {
        return top3Ids.indexOf(q.id) === -1;
      });

      var remainingHtml = remainingQuestions.map(function (q) {
        return `
          <button type="button" class="sh-qq-btn" data-question-id="${q.id}">
            <span>${q.question}</span>
          </button>
        `;
      }).join('');

      expandedPanelEl.innerHTML = remainingHtml;

      // Bind click on all quick question buttons
      this.widgetEl.querySelectorAll('.sh-qq-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var qId = btn.getAttribute('data-question-id');
          self.selectQuestion(qId);
        });
      });

      // Toggle See More / Show Less
      if (seeMoreBtn) {
        seeMoreBtn.onclick = function (e) {
          e.preventDefault();
          var isExpanded = expandedPanelEl.style.display !== 'none';
          if (!isExpanded) {
            expandedPanelEl.style.display = 'flex';
            seeMoreBtn.classList.add('is-expanded');
            seeMoreBtn.setAttribute('aria-expanded', 'true');
            seeMoreBtn.querySelector('span').textContent = 'Show Less';
          } else {
            expandedPanelEl.style.display = 'none';
            seeMoreBtn.classList.remove('is-expanded');
            seeMoreBtn.setAttribute('aria-expanded', 'false');
            seeMoreBtn.querySelector('span').textContent = 'See More Questions';
          }
        };
      }
    },

    restoreSessionOrWelcome: function () {
      var saved = ChatSession.load();
      if (saved && Array.isArray(saved.messages) && saved.messages.length > 0) {
        this.messages = saved.messages;
        this.renderAllMessages();
      } else {
        this.startOver(false);
      }
    },

    startOver: function (triggerScroll) {
      ChatSession.clear();
      this.messages = [];
      this.clearSearch();
      this.bodyEl.innerHTML = '';

      // Push Welcome Message
      var welcomeMsg = {
        id: 'msg_' + Date.now(),
        sender: 'assistant',
        text: WELCOME_TEXT,
        time: this.getCurrentTimeString()
      };

      this.messages.push(welcomeMsg);
      this.appendMessageDOM(welcomeMsg);
      this.saveCurrentSession();

      if (triggerScroll !== false) {
        this.scrollToBottom();
      }
    },

    saveCurrentSession: function () {
      ChatSession.save({
        messages: this.messages
      });
    },

    toggle: function (triggerEl) {
      if (this.isOpenState) {
        this.close();
      } else {
        this.open(triggerEl);
      }
    },

    open: function (triggerEl) {
      if (this.isOpenState) return;
      this.activeTriggerBtn = triggerEl || document.getElementById('rc-float-doctor-btn') || null;
      this.isOpenState = true;
      this.widgetEl.classList.add('is-active');
      if (this.backdropEl) this.backdropEl.classList.add('is-active');
      this.widgetEl.setAttribute('aria-modal', 'true');
      document.body.classList.add('sh-chat-open');
      if (this.activeTriggerBtn) {
        this.activeTriggerBtn.classList.add('is-active');
      }

      this.scrollToBottom();

      if (window.innerWidth > 768 && this.searchInput) {
        setTimeout(function () {
          DrSuhailChatbot.searchInput.focus();
        }, 200);
      }
    },

    close: function () {
      if (!this.isOpenState) return;
      this.isOpenState = false;
      this.widgetEl.classList.remove('is-active');
      if (this.backdropEl) this.backdropEl.classList.remove('is-active');
      this.widgetEl.setAttribute('aria-modal', 'false');
      document.body.classList.remove('sh-chat-open');
      if (this.activeTriggerBtn) {
        this.activeTriggerBtn.classList.remove('is-active');
      }
      this.clearSearch();

      if (this.activeTriggerBtn && typeof this.activeTriggerBtn.focus === 'function') {
        this.activeTriggerBtn.focus();
        this.activeTriggerBtn = null;
      }
    },

    handleSearchInput: function (keyword) {
      var query = keyword.trim();
      var clearBtn = this.widgetEl.querySelector('#sh-search-clear');

      if (!query) {
        this.searchResults.classList.remove('is-active');
        this.searchResults.innerHTML = '';
        if (clearBtn) clearBtn.classList.remove('is-visible');
        return;
      }

      if (clearBtn) clearBtn.classList.add('is-visible');

      var matches = ChatDispatcher.searchQuestions(query);
      if (matches.length === 0) {
        this.searchResults.innerHTML = `
          <div class="sh-search-empty">No direct matches found. Try keywords like <em>implants, pain, cleaning, appointment, services</em></div>
        `;
        this.searchResults.classList.add('is-active');
        return;
      }

      var html = matches.slice(0, 5).map(function (item) {
        return `
          <button type="button" class="sh-search-item" data-question-id="${item.id}">
            ${item.question}
          </button>
        `;
      }).join('');

      this.searchResults.innerHTML = html;
      this.searchResults.classList.add('is-active');

      var self = this;
      this.searchResults.querySelectorAll('.sh-search-item').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var qId = btn.getAttribute('data-question-id');
          self.selectQuestion(qId);
          self.clearSearch();
        });
      });
    },

    clearSearch: function () {
      if (this.searchInput) this.searchInput.value = '';
      if (this.searchResults) {
        this.searchResults.classList.remove('is-active');
        this.searchResults.innerHTML = '';
      }
      var clearBtn = this.widgetEl.querySelector('#sh-search-clear');
      if (clearBtn) clearBtn.classList.remove('is-visible');
    },

    selectQuestion: function (questionId) {
      if (this.isProcessing) return;
      var self = this;

      var qObj = SUHAIL_CHAT_DATA.find(function (q) {
        return q.id === questionId;
      });
      if (!qObj) return;

      this.isProcessing = true;

      // 1. Append User Message Bubble to scrollable messages area
      var userMsg = {
        id: 'msg_' + Date.now(),
        sender: 'user',
        text: qObj.question,
        time: this.getCurrentTimeString()
      };
      this.messages.push(userMsg);
      this.appendMessageDOM(userMsg);
      this.scrollToBottom();

      // 2. Show Typing Indicator inside messages area
      this.showTypingIndicator();

      // 3. Process Assistant Response
      setTimeout(function () {
        self.hideTypingIndicator();

        var assistantMsg = {
          id: 'msg_' + (Date.now() + 1),
          sender: 'assistant',
          text: qObj.answer,
          ctas: qObj.ctas,
          time: self.getCurrentTimeString()
        };

        self.messages.push(assistantMsg);
        self.appendMessageDOM(assistantMsg);
        self.saveCurrentSession();

        // 4. Smoothly scroll ONLY the chatbot message area to the latest response
        self.scrollToBottom();
        self.isProcessing = false;
      }, 700);
    },

    showTypingIndicator: function () {
      this.hideTypingIndicator();
      var row = document.createElement('div');
      row.className = 'sh-message-row is-assistant';
      row.id = 'sh-typing-row';
      row.innerHTML = `
        <div class="sh-msg-avatar">
          <img src="${DOCTOR_AVATAR_SRC}" onerror="this.onerror=null;this.src='${DOCTOR_AVATAR_FALLBACK}'" alt="Dr. Suhail" />
        </div>
        <div class="sh-msg-content-wrap">
          <div class="sh-typing-indicator" aria-label="Dr. Suhail's Assistant is typing">
            <span class="sh-typing-dot"></span>
            <span class="sh-typing-dot"></span>
            <span class="sh-typing-dot"></span>
            <span class="sh-typing-text">Dr. Suhail's Assistant is typing...</span>
          </div>
        </div>
      `;
      this.bodyEl.appendChild(row);
      this.scrollToBottom();
    },

    hideTypingIndicator: function () {
      var row = document.getElementById('sh-typing-row');
      if (row) row.remove();
    },

    renderAllMessages: function () {
      var self = this;
      this.bodyEl.innerHTML = '';
      this.messages.forEach(function (msg) {
        self.appendMessageDOM(msg);
      });
      this.scrollToBottom();
    },

    appendMessageDOM: function (msg) {
      var row = document.createElement('div');
      row.className = 'sh-message-row ' + (msg.sender === 'user' ? 'is-user' : 'is-assistant');
      row.id = msg.id;

      var formattedText = this.formatParagraphs(msg.text);

      if (msg.sender === 'user') {
        row.innerHTML = `
          <div class="sh-msg-content-wrap">
            <div class="sh-msg-bubble">
              ${formattedText}
            </div>
            <span class="sh-msg-time">${msg.time || ''}</span>
          </div>
        `;
      } else {
        var ctaHtml = '';
        if (msg.ctas && msg.ctas.length > 0) {
          ctaHtml = '<div class="sh-cta-group">';
          msg.ctas.forEach(function (cta) {
            var iconHtml = ICONS[cta.icon] || '';
            var payloadAttr = cta.payload ? ' data-payload=\'' + JSON.stringify(cta.payload) + '\'' : '';

            ctaHtml += `
              <button type="button" class="sh-cta-btn ${cta.style || 'is-primary'}" data-action="${cta.action}"${payloadAttr}>
                ${iconHtml}
                <span>${cta.label}</span>
              </button>
            `;
          });
          ctaHtml += '</div>';
        }

        row.innerHTML = `
          <div class="sh-msg-avatar">
            <img src="${DOCTOR_AVATAR_SRC}" onerror="this.onerror=null;this.src='${DOCTOR_AVATAR_FALLBACK}'" alt="Dr. Suhail" />
          </div>
          <div class="sh-msg-content-wrap">
            <div class="sh-msg-bubble">
              ${formattedText}
              ${ctaHtml}
            </div>
            <span class="sh-msg-time">${msg.time || ''}</span>
          </div>
        `;
      }

      this.bodyEl.appendChild(row);
      this.bindMessageActions(row);
    },

    bindMessageActions: function (containerEl) {
      var self = this;

      // CTAs
      containerEl.querySelectorAll('.sh-cta-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var action = btn.getAttribute('data-action');
          var payloadRaw = btn.getAttribute('data-payload');
          var payload = null;
          if (payloadRaw) {
            try { payload = JSON.parse(payloadRaw); } catch (e) {}
          }
          self.executeCtaAction(action, payload);
        });
      });
    },

    executeCtaAction: function (action, payload) {
      switch (action) {
        case 'open_appointment':
          if (window.RedesignBooking && typeof window.RedesignBooking.openAppointmentModal === 'function') {
            window.RedesignBooking.openAppointmentModal();
            if (payload && payload.reason) {
              var select = document.getElementById('rc-apt-reason');
              if (select) {
                select.value = payload.reason;
                select.dispatchEvent(new Event('change'));
              }
            }
          } else {
            window.location.href = '/booking';
          }
          break;

        case 'open_callback':
          if (window.RedesignBooking && typeof window.RedesignBooking.openCallbackModal === 'function') {
            window.RedesignBooking.openCallbackModal();
          } else {
            window.location.href = '/contact';
          }
          break;

        case 'explore_services':
          if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '') {
            var srvEl = document.getElementById('services') || document.querySelector('.section_services');
            if (srvEl) {
              srvEl.scrollIntoView({ behavior: 'smooth' });
              break;
            }
          }
          window.location.href = '/services';
          break;

        case 'call_clinic':
          window.location.href = 'tel:' + CLINIC_PHONE;
          break;

        case 'whatsapp_chat':
          window.open(WA_URL, '_blank', 'noopener,noreferrer');
          break;

        case 'view_doctors':
          window.location.href = '/doctors';
          break;

        case 'view_contact':
          if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '') {
            var conEl = document.getElementById('contact') || document.querySelector('.section_contact');
            if (conEl) {
              conEl.scrollIntoView({ behavior: 'smooth' });
              break;
            }
          }
          window.location.href = '/contact';
          break;

        default:
          console.log('[DrSuhailChatbot] Unknown CTA action:', action);
      }
    },

    scrollToBottom: function () {
      var self = this;
      setTimeout(function () {
        if (self.bodyEl) {
          self.bodyEl.scrollTo({ top: self.bodyEl.scrollHeight, behavior: 'smooth' });
        }
      }, 60);
    },

    formatParagraphs: function (text) {
      if (!text) return '';
      return text.split('\n\n').map(function (p) {
        var trimmed = p.trim();
        return trimmed ? '<p>' + escapeHtml(trimmed) + '</p>' : '';
      }).join('');
    },

    getCurrentTimeString: function () {
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      return hours + ':' + minutes + ' ' + ampm;
    }
  };

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  // Expose Global Namespace
  window.DrSuhailChatbot = DrSuhailChatbot;

  // Auto-init when document is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      DrSuhailChatbot.init();
    });
  } else {
    DrSuhailChatbot.init();
  }
})();
