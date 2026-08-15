/**
 * Redesign Clinics — i18n Engine v2
 * Handles language switching, DOM translation, and selector UI.
 * Zero-flash: applies saved language synchronously before first paint.
 */
(function () {
  'use strict';

  /* ─── Config ─────────────────────────────────────────── */
  var SUPPORTED = {
    en: { label: 'English',  pill: 'EN', font: '' },
    te: { label: 'తెలుగు',  pill: 'TE', font: "'Noto Sans Telugu', sans-serif" },
    hi: { label: 'हिन्दी',  pill: 'HI', font: "'Noto Sans Devanagari', sans-serif" },
    ar: { label: 'العربية', pill: 'AR', font: "'Noto Sans Arabic', sans-serif" }
  };
  var STORAGE_KEY = 'rc_lang';
  var DEFAULT_LANG = 'en';

  /* ─── Helpers ─────────────────────────────────────────── */
  function getSavedLang() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function saveLang(l) {
    try { localStorage.setItem(STORAGE_KEY, l); } catch (e) {}
  }
  function currentLang() {
    var saved = getSavedLang();
    return (saved && SUPPORTED[saved]) ? saved : DEFAULT_LANG;
  }
  function t(key, lang) {
    var dict = window.__RC_TRANSLATIONS__;
    if (!dict) return key;
    var locale = dict[lang] || dict[DEFAULT_LANG] || {};
    return locale[key] !== undefined ? locale[key] : (dict[DEFAULT_LANG] ? dict[DEFAULT_LANG][key] : key) || key;
  }

  /* ─── Apply translations to DOM ──────────────────────── */
  function applyTranslations(lang) {
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var key = el.getAttribute('data-i18n');
      var val = t(key, lang);
      el.textContent = val;
    }
    // Placeholders
    var pEls = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < pEls.length; j++) {
      var pEl = pEls[j];
      var pKey = pEl.getAttribute('data-i18n-placeholder');
      pEl.placeholder = t(pKey, lang);
    }
    // Titles / aria-labels
    var aEls = document.querySelectorAll('[data-i18n-aria]');
    for (var k = 0; k < aEls.length; k++) {
      var aEl = aEls[k];
      aEl.setAttribute('aria-label', t(aEl.getAttribute('data-i18n-aria'), lang));
    }
  }

  /* ─── Language Selector HTML ─────────────────────────── */
  var LANG_SELECTOR_HTML = [
    '<div class="lang-selector_wrap" id="rc-lang-selector-desktop" role="navigation" aria-label="Language selector">',
    '  <button class="lang-selector_toggle" id="rc-lang-toggle" aria-haspopup="listbox" aria-expanded="false" type="button">',
    '    <span class="lang-globe-icon" aria-hidden="true">',
    '      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
    '        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>',
    '        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    '      </svg>',
    '    </span>',
    '    <span class="lang-current-label" id="rc-lang-current">EN</span>',
    '    <span class="lang-chevron-icon" aria-hidden="true">',
    '      <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">',
    '        <path d="M10 10.976L14.125 6.852l1.179 1.178L10 13.334 4.697 8.03l1.178-1.178L10 10.976z"/>',
    '      </svg>',
    '    </span>',
    '  </button>',
    '  <div class="lang-selector_dropdown" id="rc-lang-dropdown" role="listbox" aria-label="Select language">',
    '    <div class="lang-dropdown_header">Language</div>',
    '    <button class="lang-option" data-lang="en" role="option" type="button">',
    '      English <span class="lang-option_pill">EN</span>',
    '    </button>',
    '    <button class="lang-option" data-lang="te" role="option" type="button">',
    '      తెలుగు <span class="lang-option_pill">TE</span>',
    '    </button>',
    '    <button class="lang-option" data-lang="hi" role="option" type="button">',
    '      हिन्दी <span class="lang-option_pill">HI</span>',
    '    </button>',
    '    <button class="lang-option" data-lang="ar" role="option" type="button">',
    '      العربية <span class="lang-option_pill">AR</span>',
    '    </button>',
    '  </div>',
    '</div>'
  ].join('\n');

  /* ─── Inject Selector into navbar ───────────────────── */
  function injectSelector() {
    // Avoid double injection
    if (document.getElementById('rc-lang-selector-desktop')) return;

    // Target: the navbar-button_wrapper before the hamburger toggle
    var wrapper = document.querySelector('.navbar-button_wrapper');
    if (!wrapper) return;

    // Create a temp container, extract the node, insert before first child
    var tmp = document.createElement('div');
    tmp.innerHTML = LANG_SELECTOR_HTML;
    var selectorNode = tmp.firstElementChild;

    // Insert before the first child of navbar-button_wrapper
    wrapper.insertBefore(selectorNode, wrapper.firstChild);

    // Wire up toggle button
    var toggle = document.getElementById('rc-lang-toggle');
    var dropdown = document.getElementById('rc-lang-dropdown');

    if (!toggle || !dropdown) return;

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.contains('is-open');
      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    // Language option buttons
    var options = dropdown.querySelectorAll('.lang-option');
    for (var i = 0; i < options.length; i++) {
      options[i].addEventListener('click', function () {
        var lang = this.getAttribute('data-lang');
        setLanguage(lang);
        closeDropdown();
      });
    }

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!document.getElementById('rc-lang-selector-desktop').contains(e.target)) {
        closeDropdown();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDropdown();
    });
  }

  function openDropdown() {
    var toggle = document.getElementById('rc-lang-toggle');
    var dropdown = document.getElementById('rc-lang-dropdown');
    if (!toggle || !dropdown) return;
    toggle.setAttribute('aria-expanded', 'true');
    dropdown.classList.add('is-open');
  }

  function closeDropdown() {
    var toggle = document.getElementById('rc-lang-toggle');
    var dropdown = document.getElementById('rc-lang-dropdown');
    if (!toggle || !dropdown) return;
    toggle.setAttribute('aria-expanded', 'false');
    dropdown.classList.remove('is-open');
  }

  /* ─── Update selector UI to reflect active lang ─────── */
  function updateSelectorUI(lang) {
    var currentLabel = document.getElementById('rc-lang-current');
    if (currentLabel) {
      currentLabel.textContent = SUPPORTED[lang] ? SUPPORTED[lang].pill : lang.toUpperCase();
    }

    // Mark active option
    var options = document.querySelectorAll('.lang-option');
    for (var i = 0; i < options.length; i++) {
      var optLang = options[i].getAttribute('data-lang');
      if (optLang === lang) {
        options[i].classList.add('is-active');
        options[i].setAttribute('aria-selected', 'true');
      } else {
        options[i].classList.remove('is-active');
        options[i].setAttribute('aria-selected', 'false');
      }
    }
  }

  /* ─── Set language ───────────────────────────────────── */
  function setLanguage(lang) {
    if (!SUPPORTED[lang]) lang = DEFAULT_LANG;
    saveLang(lang);

    // Update html lang attribute
    document.documentElement.setAttribute('lang', lang);

    // Apply translations
    applyTranslations(lang);

    // Update selector UI
    updateSelectorUI(lang);

    // Dispatch event for other scripts to hook into
    try {
      window.dispatchEvent(new CustomEvent('rc:langchange', { detail: { lang: lang } }));
    } catch (e) {}
  }

  /* ─── Initialize ─────────────────────────────────────── */
  function init() {
    var lang = currentLang();

    // Apply translations immediately (before DOMContentLoaded if called in <head>)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        injectSelector();
        applyTranslations(lang);
        updateSelectorUI(lang);
      });
    } else {
      injectSelector();
      applyTranslations(lang);
      updateSelectorUI(lang);
    }
  }

  // Expose API
  window.rcI18n = {
    setLanguage: setLanguage,
    currentLang: currentLang,
    t: t
  };

  init();
})();
