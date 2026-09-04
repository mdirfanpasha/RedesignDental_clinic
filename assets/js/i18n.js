/**
 * Redesign Clinics — Complete Multilingual Language System
 * Supports: English (en, default), Telugu (te), Hindi (hi), Arabic (ar)
 * Features: Instant translation, LTR-preserving Arabic rendering, zero flash, persistent preference.
 */

(function () {
  'use strict';

  var SUPPORTED_LANGUAGES = {
    en: { name: 'English', nativeName: 'English', pill: 'EN' },
    te: { name: 'Telugu',  nativeName: 'తెలుగు', pill: 'TE' },
    hi: { name: 'Hindi',   nativeName: 'हिन्दी', pill: 'HI' },
    ar: { name: 'Arabic',  nativeName: 'العربية', pill: 'AR' }
  };

  var DEFAULT_LANG = 'en';

  // 1. Language State Management (localStorage + cookie)
  function getSavedLanguage() {
    try {
      var local = localStorage.getItem('rc_lang');
      if (local && SUPPORTED_LANGUAGES[local]) return local;
    } catch (e) {}

    var match = document.cookie.match(/(^|;)\s*rc_lang=([^;]+)/);
    if (match && SUPPORTED_LANGUAGES[match[2]]) return match[2];

    return DEFAULT_LANG;
  }

  function saveLanguage(lang) {
    if (!SUPPORTED_LANGUAGES[lang]) return;
    try {
      localStorage.setItem('rc_lang', lang);
    } catch (e) {}
    document.cookie = 'rc_lang=' + lang + '; path=/; max-age=31536000; SameSite=Lax';
  }

  var currentLang = getSavedLanguage();

  // 2. Translation Lookup Function
  function t(key, params) {
    var translations = window.__RC_TRANSLATIONS__ || {};
    var dict = translations[currentLang] || translations[DEFAULT_LANG] || {};
    var text = dict[key];

    if (text === undefined || text === null) {
      // Fallback to English
      var fallbackDict = translations[DEFAULT_LANG] || {};
      text = fallbackDict[key];
    }

    if (text === undefined || text === null) {
      return key; // return key if untranslated
    }

    if (params && typeof params === 'object') {
      Object.keys(params).forEach(function (p) {
        text = text.replace(new RegExp('\\{' + p + '\\}', 'g'), params[p]);
      });
    }

    return text;
  }

  // 3. DOM Translator
  function translateDOM(root) {
    var container = root || document;

    // Translate Text & Inner Content
    var textNodes = container.querySelectorAll('[data-i18n]');
    textNodes.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!key) return;
      var translation = t(key);
      if (translation !== key) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.value = translation;
        } else {
          el.textContent = translation;
        }
      }
    });

    // Translate Placeholders
    var placeholderNodes = container.querySelectorAll('[data-i18n-placeholder]');
    placeholderNodes.forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.setAttribute('placeholder', t(key));
      }
    });

    // Translate Titles
    var titleNodes = container.querySelectorAll('[data-i18n-title]');
    titleNodes.forEach(function (el) {
      var key = el.getAttribute('data-i18n-title');
      if (key) {
        el.setAttribute('title', t(key));
      }
    });

    // Translate Alt text
    var altNodes = container.querySelectorAll('[data-i18n-alt]');
    altNodes.forEach(function (el) {
      var key = el.getAttribute('data-i18n-alt');
      if (key) {
        el.setAttribute('alt', t(key));
      }
    });

    // Translate Aria labels
    var ariaNodes = container.querySelectorAll('[data-i18n-aria]');
    ariaNodes.forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      if (key) {
        el.setAttribute('aria-label', t(key));
      }
    });

    // Update <html lang="..."> and body classes
    document.documentElement.lang = currentLang;
    document.documentElement.classList.remove('lang-en', 'lang-te', 'lang-hi', 'lang-ar');
    document.documentElement.classList.add('lang-' + currentLang);
    // Explicitly maintain LTR layout even for Arabic
    document.documentElement.dir = 'ltr';
    document.body.dir = 'ltr';

    // Update Selector UI labels
    updateSelectorUI();
  }

  // 4. Set Language Method
  function setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES[lang]) return;
    currentLang = lang;
    saveLanguage(lang);
    translateDOM();

    // Close any open language dropdowns
    document.querySelectorAll('.lang-selector_dropdown.is-open').forEach(function (d) {
      d.classList.remove('is-open');
    });

    // Dispatch global event for custom components (booking modal, search filters, etc.)
    window.dispatchEvent(new CustomEvent('rcLanguageChanged', { detail: { lang: lang } }));
  }

  // 5. Build Language Selector HTML
  function createLanguageSelectorElement(isMobile) {
    var idPrefix = isMobile ? 'rc-lang-mobile-' : 'rc-lang-';
    var wrap = document.createElement('div');
    wrap.className = 'lang-selector_wrap' + (isMobile ? ' is-mobile' : '');
    wrap.id = idPrefix + 'wrap';

    var currentMeta = SUPPORTED_LANGUAGES[currentLang] || SUPPORTED_LANGUAGES[DEFAULT_LANG];

    var optionsHTML = Object.keys(SUPPORTED_LANGUAGES).map(function (code) {
      var item = SUPPORTED_LANGUAGES[code];
      var isActive = code === currentLang;
      return '<button type="button" class="lang-option' + (isActive ? ' is-active' : '') + '" data-lang="' + code + '" role="menuitem">' +
        '<span class="lang-option_name">' + item.nativeName + '</span>' +
        '<span class="lang-option_pill">' + item.pill + '</span>' +
        '</button>';
    }).join('');

    wrap.innerHTML =
      '<button type="button" class="lang-selector_toggle" id="' + idPrefix + 'toggle" aria-haspopup="true" aria-expanded="false" aria-label="' + currentMeta.nativeName + ' - Select Language">' +
        '<span class="lang-globe-icon">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<circle cx="12" cy="12" r="10"></circle>' +
            '<line x1="2" y1="12" x2="22" y2="12"></line>' +
            '<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>' +
          '</svg>' +
        '</span>' +
        '<span class="lang-current-label">' + currentMeta.nativeName + '</span>' +
        '<span class="lang-chevron-icon">' +
          '<svg width="10" height="10" viewBox="0 0 20 20" fill="none">' +
            '<path d="M9.99991 10.9763L14.1247 6.85156L15.3032 8.03007L9.99991 13.3334L4.69666 8.03007L5.87516 6.85156L9.99991 10.9763Z" fill="currentColor"></path>' +
          '</svg>' +
        '</span>' +
      '</button>' +
      '<div class="lang-selector_dropdown" id="' + idPrefix + 'dropdown" role="menu">' +
        '<div class="lang-dropdown_header">' + t('nav.language') + '</div>' +
        optionsHTML +
      '</div>';

    // Event Listeners for Dropdown Toggle
    var toggleBtn = wrap.querySelector('.lang-selector_toggle');
    var dropdown = wrap.querySelector('.lang-selector_dropdown');

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.contains('is-open');
      // Close all other dropdowns
      document.querySelectorAll('.lang-selector_dropdown.is-open').forEach(function (d) {
        d.classList.remove('is-open');
      });
      if (!isOpen) {
        dropdown.classList.add('is-open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      } else {
        dropdown.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Option Click Handlers
    wrap.querySelectorAll('.lang-option').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var selectedLang = btn.getAttribute('data-lang');
        setLanguage(selectedLang);
      });
    });

    return wrap;
  }

  function updateSelectorUI() {
    var meta = SUPPORTED_LANGUAGES[currentLang] || SUPPORTED_LANGUAGES[DEFAULT_LANG];
    document.querySelectorAll('.lang-current-label').forEach(function (span) {
      span.textContent = meta.nativeName;
    });
    document.querySelectorAll('.lang-selector_toggle').forEach(function (btn) {
      btn.setAttribute('aria-label', meta.nativeName + ' - Select Language');
    });
    document.querySelectorAll('.lang-dropdown_header').forEach(function (head) {
      head.textContent = t('nav.language');
    });
    document.querySelectorAll('.lang-option').forEach(function (btn) {
      var code = btn.getAttribute('data-lang');
      if (code === currentLang) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });
  }

  // 6. Mount Selectors into Header & Navigation
  function mountLanguageSelectors() {
    // 1. Desktop Navbar insertion (inside .navbar-button_wrapper before appointment button)
    var btnWrappers = document.querySelectorAll('.navbar-button_wrapper');
    btnWrappers.forEach(function (wrapper) {
      if (!wrapper.querySelector('.lang-selector_wrap:not(.is-mobile)')) {
        var desktopSelector = createLanguageSelectorElement(false);
        var firstChild = wrapper.firstChild;
        wrapper.insertBefore(desktopSelector, firstChild);
      }
    });

    // 2. Mobile Menu insertion (inside .navbar_menu as a dedicated footer item)
    var menus = document.querySelectorAll('.navbar_menu');
    menus.forEach(function (menu) {
      if (!menu.querySelector('.lang-selector_wrap.is-mobile')) {
        var mobileSelector = createLanguageSelectorElement(true);
        menu.appendChild(mobileSelector);
      }
    });
  }

  // Global Close on Click Outside & ESC key
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.lang-selector_wrap')) {
      document.querySelectorAll('.lang-selector_dropdown.is-open').forEach(function (d) {
        d.classList.remove('is-open');
      });
      document.querySelectorAll('.lang-selector_toggle').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
      });
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.lang-selector_dropdown.is-open').forEach(function (d) {
        d.classList.remove('is-open');
      });
    }
  });

  // 7. Initialize immediately & on DOM load
  function init() {
    mountLanguageSelectors();
    translateDOM();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose Public API
  window.i18n = {
    getLanguage: function () { return currentLang; },
    setLanguage: setLanguage,
    t: t,
    translateDOM: translateDOM,
    SUPPORTED_LANGUAGES: SUPPORTED_LANGUAGES
  };

})();
