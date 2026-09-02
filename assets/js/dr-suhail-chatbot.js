/**
 * Dr. Suhail's Virtual Dental Assistant Chatbot
 * Redesign Dental Clinics - Specialist Dental Care
 * 
 * Future-AI Ready, Modular Predefined Assistant Engine
 */

(function () {
  'use strict';

  // ─── Predefined Knowledge Base (24 Clinical & Clinic Questions) ────────────
  var SUHAIL_CHAT_DATA = [
    {
      id: 'book-appointment',
      category: 'Appointments',
      isInitial: true,
      question: 'How can I book an appointment?',
      answer: 'Booking an appointment is easy. You can use our appointment form and our team will contact you to confirm your preferred date and time.',
      keywords: ['book', 'appointment', 'schedule', 'visit', 'consultation', 'reserve', 'timing', 'slot', 'booking'],
      ctas: [
        { label: 'Book Appointment', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'request-callback',
      category: 'Appointments',
      isInitial: true,
      question: 'Can I request a callback?',
      answer: 'Absolutely. Please submit your name and mobile number through our callback form, and our team will contact you as soon as possible.',
      keywords: ['callback', 'call back', 'call me', 'phone', 'contact me', 'reach out', 'ring'],
      ctas: [
        { label: 'Request Callback', action: 'open_callback', style: 'is-primary', icon: 'phone' }
      ]
    },
    {
      id: 'dental-services',
      category: 'Services',
      isInitial: true,
      question: 'What dental services do you provide?',
      answer: 'Redesign Dental Clinics provides comprehensive dental care, including preventive dentistry, cosmetic dentistry, dental implants, root canal treatments, orthodontic care, smile makeovers and other advanced dental treatments.',
      keywords: ['services', 'treatments', 'procedures', 'provide', 'offer', 'options', 'care', 'dental care'],
      ctas: [
        { label: 'Explore Services', action: 'explore_services', style: 'is-primary', icon: 'arrow' }
      ]
    },
    {
      id: 'dental-implants',
      category: 'Treatments',
      isInitial: true,
      question: 'Do you provide dental implants?',
      answer: 'Yes. We provide advanced dental implant solutions designed to restore missing teeth and improve both function and appearance. A consultation is recommended so our dental team can assess your individual needs.',
      keywords: ['implant', 'implants', 'missing tooth', 'missing teeth', 'titanium', 'zirconia', 'all-on-4', 'fixed teeth'],
      ctas: [
        { label: 'Book Implant Consultation', action: 'open_appointment', payload: { reason: 'Implants' }, style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'dental-emergency',
      category: 'Support',
      isInitial: true,
      question: 'I have a dental emergency',
      answer: 'If you are experiencing severe dental pain, significant bleeding, swelling or a dental injury, please contact the clinic as soon as possible so our team can guide you.',
      keywords: ['emergency', 'urgent', 'bleeding', 'swelling', 'broken tooth', 'injury', 'severe', 'acute', 'trauma'],
      ctas: [
        { label: 'Call Clinic', action: 'call_clinic', style: 'is-call', icon: 'phone' },
        { label: 'Book Urgent Appointment', action: 'open_appointment', payload: { reason: 'Emergency' }, style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'tooth-pain',
      category: 'Treatments',
      isInitial: false,
      question: 'I have severe tooth pain',
      answer: 'Tooth pain can have different causes, and an examination is the best way to identify the problem. If the pain is severe or persistent, we recommend contacting our dental team for an appointment.',
      keywords: ['pain', 'tooth pain', 'toothache', 'ache', 'hurts', 'throbbing', 'sensitivity', 'sore'],
      ctas: [
        { label: 'Book Consultation', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'root-canal',
      category: 'Treatments',
      isInitial: false,
      question: 'Do you provide root canal treatment?',
      answer: 'Yes. Root canal treatment may be recommended when the inner part of a tooth is affected by infection or damage. Our dental team can evaluate your condition and explain the most suitable treatment options.',
      keywords: ['root canal', 'rct', 'endodontic', 'infection', 'pulp', 'nerve', 'decay', 'abscess'],
      ctas: [
        { label: 'Book Consultation', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'teeth-cleaning',
      category: 'Services',
      isInitial: false,
      question: 'Do you provide teeth cleaning?',
      answer: 'Yes. Professional dental cleaning can help maintain oral hygiene by removing plaque and tartar that regular brushing may not completely remove.',
      keywords: ['cleaning', 'scaling', 'polishing', 'plaque', 'tartar', 'hygiene', 'stains', 'clean'],
      ctas: [
        { label: 'Book Cleaning Appointment', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'cosmetic-dentistry',
      category: 'Services',
      isInitial: false,
      question: 'Do you provide cosmetic dentistry?',
      answer: 'Yes. We provide cosmetic dental solutions designed to improve the appearance of your smile. Available options may include smile enhancement and other aesthetic dental treatments depending on your individual needs.',
      keywords: ['cosmetic', 'aesthetic', 'veneers', 'laminates', 'bonding', 'appearance', 'smile aesthetics'],
      ctas: [
        { label: 'Explore Cosmetic Dentistry', action: 'explore_services', style: 'is-primary', icon: 'arrow' }
      ]
    },
    {
      id: 'smile-makeover',
      category: 'Treatments',
      isInitial: false,
      question: 'Can I get a smile makeover?',
      answer: 'Yes. A smile makeover is personalised based on your teeth, facial features and aesthetic goals. Our dental team can evaluate your smile and discuss suitable treatment options.',
      keywords: ['smile makeover', 'smile design', 'hollywood smile', 'transformation', 'makeover', 'perfect smile'],
      ctas: [
        { label: 'Book Smile Consultation', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'teeth-whitening',
      category: 'Treatments',
      isInitial: false,
      question: 'Do you offer teeth whitening?',
      answer: 'Professional teeth whitening options may be available depending on your dental condition. A consultation helps us recommend the safest and most suitable approach for you.',
      keywords: ['whitening', 'teeth whitening', 'bleaching', 'brighten', 'yellow teeth', 'stains', 'sparkle'],
      ctas: [
        { label: 'Ask About Whitening', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'braces-aligners',
      category: 'Treatments',
      isInitial: false,
      question: 'Do you provide braces or aligners?',
      answer: 'Orthodontic treatment options depend on your dental alignment and treatment goals. Our dental team can evaluate your teeth and discuss suitable orthodontic options.',
      keywords: ['braces', 'aligners', 'invisalign', 'clear aligners', 'teeth straightening', 'orthodontics', 'crooked teeth', 'gap'],
      ctas: [
        { label: 'Book Orthodontic Consultation', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'treatment-cost',
      category: 'Clinic Info',
      isInitial: true,
      question: 'How much does dental treatment cost?',
      answer: 'Treatment costs vary depending on your dental condition and the treatment required. After a consultation and examination, our team can provide more accurate information about the recommended treatment and costs.',
      keywords: ['cost', 'price', 'fee', 'charge', 'expensive', 'pricing', 'estimate', 'rate', 'how much'],
      ctas: [
        { label: 'Request Consultation', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'payment-options',
      category: 'Clinic Info',
      isInitial: false,
      question: 'What payment options are available?',
      answer: 'Our team can provide information about the available payment options when you contact or visit the clinic. Please speak with our team for the most accurate details.',
      keywords: ['payment', 'pay', 'emi', 'credit card', 'debit card', 'upi', 'cash', 'options'],
      ctas: [
        { label: 'Contact Clinic', action: 'view_contact', style: 'is-primary', icon: 'arrow' }
      ]
    },
    {
      id: 'clinic-location',
      category: 'Clinic Info',
      isInitial: true,
      question: 'Where is the clinic located?',
      answer: 'You can find our clinic address and contact details on the Contact section of our website. Our team will also be happy to help you with directions.',
      keywords: ['location', 'where', 'address', 'directions', 'map', 'banjara hills', 'hyderabad', 'place'],
      ctas: [
        { label: 'View Location', action: 'view_contact', style: 'is-primary', icon: 'arrow' }
      ]
    },
    {
      id: 'clinic-timings',
      category: 'Clinic Info',
      isInitial: false,
      question: 'What are the clinic timings?',
      answer: 'Our clinic timings are available on the Contact section of the website. Please check the latest timings there or contact our team before visiting.',
      keywords: ['timings', 'hours', 'open', 'closing', 'working hours', 'sunday', 'schedule', 'time'],
      ctas: [
        { label: 'View Contact Details', action: 'view_contact', style: 'is-primary', icon: 'arrow' }
      ]
    },
    {
      id: 'insurance',
      category: 'Clinic Info',
      isInitial: false,
      question: 'Do you accept dental insurance?',
      answer: 'Insurance and coverage availability can depend on your provider and treatment. Please contact our clinic team with your insurance details so we can guide you with the most accurate information.',
      keywords: ['insurance', 'coverage', 'mediclaim', 'reimbursement', 'tpa', 'policy', 'cashless'],
      ctas: [
        { label: 'Contact Our Team', action: 'open_callback', style: 'is-primary', icon: 'phone' }
      ]
    },
    {
      id: 'child-dentistry',
      category: 'Services',
      isInitial: false,
      question: 'Do you treat children?',
      answer: "Our dental team can guide you regarding dental care options for children. Please contact us to discuss your child's dental needs and schedule a consultation if appropriate.",
      keywords: ['children', 'child', 'kids', 'pediatric', 'pediatric dentistry', 'baby teeth', 'toddler'],
      ctas: [
        { label: 'Book Consultation', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'first-visit',
      category: 'Appointments',
      isInitial: false,
      question: 'What should I expect during my first visit?',
      answer: 'During your first visit, our dental team will understand your concerns, review your dental condition and discuss suitable next steps. Depending on your needs, an examination and treatment planning may be recommended.',
      keywords: ['first visit', 'new patient', 'first time', 'expect', 'checkup', 'initial visit', 'consultation'],
      ctas: [
        { label: 'Book First Visit', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'whatsapp-support',
      category: 'Support',
      isInitial: true,
      question: 'Can I contact you on WhatsApp?',
      answer: 'Yes. You can contact our team on WhatsApp for appointment enquiries and general clinic information.',
      keywords: ['whatsapp', 'chat', 'message', 'text', 'online chat', 'support'],
      ctas: [
        { label: 'Chat on WhatsApp', action: 'whatsapp_chat', style: 'is-whatsapp', icon: 'whatsapp' }
      ]
    },
    {
      id: 'talk-to-doctor',
      category: 'Appointments',
      isInitial: false,
      question: 'Can I speak with a doctor?',
      answer: 'Our team can help you arrange an appropriate consultation with one of our dental professionals. The doctor can better guide you after understanding your dental concerns.',
      keywords: ['speak with doctor', 'doctor', 'talk to doctor', 'dentist', 'surgeon', 'specialist', 'dr suhail'],
      ctas: [
        { label: 'Book Consultation', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'before-and-after',
      category: 'Clinic Info',
      isInitial: false,
      question: 'Can I see treatment results?',
      answer: 'You can explore our website gallery and treatment-related sections to learn more about our clinic and dental work. Your treatment plan will always depend on your individual dental condition.',
      keywords: ['results', 'before and after', 'gallery', 'photos', 'cases', 'pictures', 'portfolio', 'smile photos'],
      ctas: [
        { label: 'View Gallery', action: 'view_gallery', style: 'is-primary', icon: 'arrow' }
      ]
    },
    {
      id: 'dental-anxiety',
      category: 'Support',
      isInitial: false,
      question: "I'm nervous about dental treatment",
      answer: "You're not alone. Many people feel nervous about visiting the dentist. Please let our team know about your concerns so we can help make your visit as comfortable and reassuring as possible.",
      keywords: ['nervous', 'scared', 'fear', 'anxiety', 'pain', 'afraid', 'phobia', 'comfortable', 'gentle'],
      ctas: [
        { label: 'Book a Consultation', action: 'open_appointment', style: 'is-primary', icon: 'calendar' }
      ]
    },
    {
      id: 'talk-to-team',
      category: 'Support',
      isInitial: false,
      question: 'I want to talk to your team',
      answer: 'Our team would be happy to help you with appointments, general enquiries and clinic information.',
      keywords: ['talk', 'team', 'staff', 'front desk', 'reception', 'call', 'talk to team'],
      ctas: [
        { label: 'Call Clinic', action: 'call_clinic', style: 'is-call', icon: 'phone' },
        { label: 'WhatsApp Us', action: 'whatsapp_chat', style: 'is-whatsapp', icon: 'whatsapp' }
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

  var WELCOME_TEXT = "Hello! 👋\n\nI'm Dr. Suhail's virtual dental assistant.\n\nI can help you with appointments, treatments, dental services, emergencies and general clinic information.\n\nHow can I help you today?";
  var FOLLOW_UP_TEXT = "What else can I help you with?";
  var DOCTOR_AVATAR_SRC = '/assets/img/dr-suhail-floating-icon.png';
  var DOCTOR_AVATAR_FALLBACK = '/assets/img/suhail_icon-removebg-preview.png';
  var CLINIC_PHONE = '+917780245307';
  var WA_URL = 'https://wa.me/917780245307?text=Hi%20Redesign%20Dental%20Clinics%2C%20I%20would%20like%20to%20enquire%20about%20dental%20treatments';
  var SESSION_STORAGE_KEY = 'redesign_suhail_chat_session_v1';

  // ─── SVG Icons Helper ───────────────────────────────────────────────────────
  var ICONS = {
    close: '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
    reset: '<svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',
    search: '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
    calendar: '<svg viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24"><path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/></svg>'
  };

  // ─── Future-AI Ready Query Dispatcher ───────────────────────────────────────
  var ChatDispatcher = {
    /**
     * Resolves a question by direct ID or semantic keyword search
     * Architecture supports replacing this promise with a remote fetch('/api/chat') in the future.
     */
    processQuery: function (queryOrId) {
      return new Promise(function (resolve) {
        var trimmed = String(queryOrId || '').trim().toLowerCase();

        // 1. Direct ID match
        var directMatch = SUHAIL_CHAT_DATA.find(function (q) {
          return q.id.toLowerCase() === trimmed;
        });
        if (directMatch) {
          return resolve(directMatch);
        }

        // 2. Direct Question Text Match
        var textMatch = SUHAIL_CHAT_DATA.find(function (q) {
          return q.question.toLowerCase() === trimmed;
        });
        if (textMatch) {
          return resolve(textMatch);
        }

        // 3. Keyword / Weighted search match
        var bestScore = 0;
        var bestMatch = null;

        SUHAIL_CHAT_DATA.forEach(function (q) {
          var score = 0;
          var qText = q.question.toLowerCase();
          
          if (qText.indexOf(trimmed) !== -1) score += 10;
          
          q.keywords.forEach(function (kw) {
            if (trimmed.indexOf(kw.toLowerCase()) !== -1) score += 5;
            if (kw.toLowerCase().indexOf(trimmed) !== -1) score += 3;
          });

          if (score > bestScore) {
            bestScore = score;
            bestMatch = q;
          }
        });

        if (bestMatch && bestScore > 0) {
          return resolve(bestMatch);
        }

        // Fallback default
        return resolve({
          id: 'general-enquiry',
          question: queryOrId,
          answer: "Our team would be happy to assist you with any questions regarding dental care, appointments, or clinic services. Please let us know how we can best support you.",
          ctas: [
            { label: 'Book Appointment', action: 'open_appointment', style: 'is-primary', icon: 'calendar' },
            { label: 'Request Callback', action: 'open_callback', style: 'is-secondary', icon: 'phone' }
          ]
        });
      });
    },

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

  // ─── Session History Storage ────────────────────────────────────────────────
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

        <div class="sh-chat-body" id="sh-chat-body" aria-live="polite">
          <!-- Messages dynamically injected here -->
        </div>

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

      // Backdrop click (closes chat on mobile)
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

      // Multilingual Instant Re-render on Language Change
      window.addEventListener('rcLanguageChanged', function () {
        if (self.widgetEl) {
          self.startOver(false);
          // Update placeholder and buttons
          if (self.searchInput) {
            self.searchInput.placeholder = t('chatbot.searchPlaceholder', 'Search for a question...');
          }
          var headerTitle = self.widgetEl.querySelector('.sh-header-title');
          if (headerTitle) headerTitle.textContent = t('chatbot.title', "Dr. Suhail's Assistant");
          var headerSubtitle = self.widgetEl.querySelector('.sh-header-subtitle');
          if (headerSubtitle) headerSubtitle.textContent = t('chatbot.subtitle', "Your Dental Care Assistant");
        }
      });
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
        time: this.getCurrentTimeString(),
        showDiscovery: true
      };

      this.messages.push(welcomeMsg);
      this.appendMessageDOM(welcomeMsg, true);
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
      this.activeTriggerBtn = triggerEl || null;
      this.isOpenState = true;
      this.widgetEl.classList.add('is-active');
      if (this.backdropEl) this.backdropEl.classList.add('is-active');
      this.widgetEl.setAttribute('aria-modal', 'true');

      this.scrollToBottom();

      // Focus search input on desktop
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
          <div class="sh-search-empty">No direct matches found. Try keywords like <em>implants, pain, cleaning, appointment, cost</em></div>
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

      // Bind search items
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
      var qKey = 'chatbot.q.' + qObj.id.replace(/-/g, '_');
      var aKey = 'chatbot.a.' + qObj.id.replace(/-/g, '_');
      var localizedQuestion = t(qKey, qObj.question);
      var localizedAnswer = t(aKey, qObj.answer);

      // 1. Render User message bubble
      var userMsg = {
        id: 'msg_' + Date.now(),
        sender: 'user',
        text: localizedQuestion,
        time: this.getCurrentTimeString()
      };
      this.messages.push(userMsg);
      this.appendMessageDOM(userMsg);
      this.scrollToBottom();

      // 2. Show Typing Indicator
      this.showTypingIndicator();

      // 3. Process with realistic assistant typing delay (650-850ms)
      setTimeout(function () {
        self.hideTypingIndicator();

        var assistantMsg = {
          id: 'msg_' + (Date.now() + 1),
          sender: 'assistant',
          text: localizedAnswer,
          ctas: qObj.ctas,
          time: self.getCurrentTimeString(),
          showFollowUp: true
        };

        self.messages.push(assistantMsg);
        self.appendMessageDOM(assistantMsg);
        self.saveCurrentSession();
        var rowEl = document.getElementById(assistantMsg.id);
        if (rowEl && self.bodyEl) {
          setTimeout(function () {
            var targetTop = rowEl.offsetTop - 12;
            self.bodyEl.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
          }, 60);
        } else {
          self.scrollToBottom();
        }
        self.isProcessing = false;
      }, 750);
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
            <span class="sh-typing-text">${t('chatbot.typing', "Dr. Suhail's Assistant is typing...")}</span>
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
      this.messages.forEach(function (msg, idx) {
        var isLast = idx === self.messages.length - 1;
        self.appendMessageDOM(msg, isLast);
      });
      this.scrollToBottom();
    },

    appendMessageDOM: function (msg, isLatest) {
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
            var labelText = cta.label;
            if (cta.action === 'open_appointment') labelText = t('chatbot.btn.bookAppointment', cta.label);
            else if (cta.action === 'open_callback') labelText = t('chatbot.btn.requestCallback', cta.label);
            else if (cta.action === 'call_clinic') labelText = t('chatbot.btn.callClinic', cta.label);
            else if (cta.action === 'whatsapp_chat') labelText = t('chatbot.btn.chatWhatsApp', cta.label);
            else if (cta.action === 'explore_services') labelText = t('chatbot.btn.exploreServices', cta.label);

            ctaHtml += `
              <button type="button" class="sh-cta-btn ${cta.style || 'is-primary'}" data-action="${cta.action}"${payloadAttr}>
                ${iconHtml}
                <span>${labelText}</span>
              </button>
            `;
          });
          ctaHtml += '</div>';
        }

        var discoveryHtml = '';
        if (msg.showDiscovery || msg.showFollowUp) {
          discoveryHtml = this.buildDiscoveryChipsHTML(msg.showFollowUp);
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
            ${discoveryHtml}
          </div>
        `;
      }

      this.bodyEl.appendChild(row);
      this.bindMessageActions(row);
    },

    buildDiscoveryChipsHTML: function (isFollowUp) {
      var initialQuestions = SUHAIL_CHAT_DATA.filter(function (q) {
        return q.isInitial;
      });

      var label = isFollowUp ? t('chatbot.btn.askAnother', FOLLOW_UP_TEXT) : t('chatbot.cat.all', 'Frequently Asked Questions:');

      var chipsHtml = initialQuestions.map(function (q) {
        var qText = t('chatbot.q.' + q.id.replace(/-/g, '_'), q.question);
        return `
          <button type="button" class="sh-chip-btn" data-question-id="${q.id}">
            <span>${qText}</span>
          </button>
        `;
      }).join('');

      // Group all 24 questions by category for the expanded panel
      var categories = [
        { name: 'Appointments', key: 'chatbot.cat.appointments' },
        { name: 'Services', key: 'chatbot.cat.services' },
        { name: 'Treatments', key: 'chatbot.cat.treatments' },
        { name: 'Clinic Info', key: 'chatbot.cat.clinic' },
        { name: 'Support', key: 'chatbot.cat.support' }
      ];

      var categoryGroupsHtml = categories.map(function (catObj) {
        var items = SUHAIL_CHAT_DATA.filter(function (q) {
          return q.category === catObj.name;
        });
        if (items.length === 0) return '';
        var itemsHtml = items.map(function (q) {
          var qText = t('chatbot.q.' + q.id.replace(/-/g, '_'), q.question);
          return `
            <button type="button" class="sh-chip-btn" data-question-id="${q.id}">
              <span>${qText}</span>
            </button>
          `;
        }).join('');

        return `
          <div class="sh-category-group">
            <div class="sh-category-title">${t(catObj.key, catObj.name)}</div>
            <div class="sh-discovery-chips">${itemsHtml}</div>
          </div>
        `;
      }).join('');

      return `
        <div class="sh-discovery-container">
          <div class="sh-discovery-label">
            <span>${label}</span>
          </div>
          <div class="sh-discovery-chips">
            ${chipsHtml}
          </div>
          <button type="button" class="sh-view-all-btn" aria-expanded="false">
            <span>${t('common.viewAll', 'View all questions (24)')}</span>
            ${ICONS.chevronDown}
          </button>
          <div class="sh-all-questions-panel">
            ${categoryGroupsHtml}
          </div>
        </div>
      `;
    },

    bindMessageActions: function (containerEl) {
      var self = this;

      // Question Chips
      containerEl.querySelectorAll('.sh-chip-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var qId = btn.getAttribute('data-question-id');
          self.selectQuestion(qId);
        });
      });

      // View all toggle
      var viewAllBtn = containerEl.querySelector('.sh-view-all-btn');
      var allPanel = containerEl.querySelector('.sh-all-questions-panel');
      if (viewAllBtn && allPanel) {
        viewAllBtn.addEventListener('click', function () {
          var isExpanded = allPanel.classList.toggle('is-visible');
          viewAllBtn.classList.toggle('is-open', isExpanded);
          viewAllBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
          var textSpan = viewAllBtn.querySelector('span');
          if (textSpan) {
            textSpan.textContent = isExpanded ? 'Hide all questions' : 'View all questions (24)';
          }
          self.scrollToBottom();
        });
      }

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

        case 'view_gallery':
          if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '') {
            var galEl = document.getElementById('gallery') || document.querySelector('.section_gallery');
            if (galEl) {
              galEl.scrollIntoView({ behavior: 'smooth' });
              break;
            }
          }
          window.location.href = '/gallery';
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
          self.bodyEl.scrollTop = self.bodyEl.scrollHeight;
        }
      }, 50);
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
