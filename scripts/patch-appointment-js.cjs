const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const aptJsPath = path.join(rootDir, 'assets', 'js', 'appointment-page.js');
let code = fs.readFileSync(aptJsPath, 'utf8');

// Helper to translate safely
const helperCode = `
  // ── i18n Safe Helper ──
  function t(key, fallback) {
    if (window.i18n && typeof window.i18n.t === 'function') {
      var res = window.i18n.t(key);
      if (res && res !== key) return res;
    }
    return fallback;
  }

  function getCurrentLang() {
    if (window.i18n && typeof window.i18n.getLanguage === 'function') {
      return window.i18n.getLanguage();
    }
    return 'en';
  }

  function getLocalizedDayHeaders(lang) {
    var dayMap = {
      en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      te: ['సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని', 'ఆది'],
      hi: ['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'],
      ar: ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد']
    };
    return dayMap[lang] || dayMap.en;
  }

  function getLocalizedMonthName(year, month, lang) {
    var d = new Date(year, month, 1);
    var localeMap = { en: 'en-US', te: 'te-IN', hi: 'hi-IN', ar: 'ar-SA' };
    try {
      return d.toLocaleDateString(localeMap[lang] || 'en-US', { month: 'long' });
    } catch(e) {
      var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return monthNames[month];
    }
  }

  function updateSelectedDateSummary() {
    var summaryEl = document.getElementById('apt-page-selected-date-summary');
    if (!summaryEl || !selectedDateStr) return;
    var dateObj = new Date(selectedDateStr + 'T00:00:00');
    var lang = getCurrentLang();
    var prefix = t('apt.selectedDatePrefix', 'Selected Date: ');
    var localeMap = { en: 'en-GB', te: 'te-IN', hi: 'hi-IN', ar: 'ar-SA' };
    var formatted = dateObj.toLocaleDateString(localeMap[lang] || 'en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    summaryEl.textContent = prefix + formatted;
  }
`;

// Insert helperCode right after 'var selectedDoctor = null;'
code = code.replace(
  'var selectedDoctor = null;',
  'var selectedDoctor = null;\n' + helperCode
);

// Replace summaryEl update in initInlineCalendar
code = code.replace(
  `    var summaryEl = document.getElementById('apt-page-selected-date-summary');
    if (summaryEl) {
      var dateObj = new Date(selectedDateStr + 'T00:00:00');
      summaryEl.textContent = 'Selected Date: ' + dateObj.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    }`,
  `    updateSelectedDateSummary();`
);

// Replace summaryEl update in Date Cell Selection onclick
code = code.replace(
  `        var summaryEl = document.getElementById('apt-page-selected-date-summary');
        if (summaryEl) {
          var dateObj = new Date(selectedDateStr + 'T00:00:00');
          summaryEl.textContent = 'Selected Date: ' + dateObj.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
        }`,
  `        updateSelectedDateSummary();`
);

// Replace monthNames & dayHeaders in renderCalendarMonth
code = code.replace(
  `    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];`,
  `    var lang = getCurrentLang();
    var monthTitle = getLocalizedMonthName(year, month, lang);
    var dayHeaders = getLocalizedDayHeaders(lang);`
);

// Replace <div class="inline-cal-title">${monthNames[month]} ${year}</div>
code = code.replace(
  `<div class="inline-cal-title">\${monthNames[month]} \${year}</div>`,
  `<div class="inline-cal-title">\${monthTitle} \${year}</div>`
);

// Replace validation error messages with localized versions
code = code.replace(
  `showError('Please enter your full name.');`,
  `showError(t('apt.errName', 'Please enter your full name.'));`
);

code = code.replace(
  `showError('Please enter a valid 10-digit mobile number.');`,
  `showError(t('apt.errPhone', 'Please enter a valid 10-digit mobile number.'));`
);

code = code.replace(
  `showError('Please select your preferred appointment date.');`,
  `showError(t('apt.errDate', 'Please select an appointment date.'));`
);

code = code.replace(
  `showError('Please select your preferred appointment time.');`,
  `showError(t('apt.errSlot', 'Please select a preferred 30-minute time slot.'));`
);

// Add language change listener in initAppointmentPage
code = code.replace(
  `    initFormSubmission(form);
  }`,
  `    initFormSubmission(form);

    window.addEventListener('rcLanguageChanged', function () {
      renderCalendarMonth(currentCalDate.getFullYear(), currentCalDate.getMonth());
      updateSelectedDateSummary();
    });
  }`
);

fs.writeFileSync(aptJsPath, code, 'utf8');
console.log('✓ Successfully patched assets/js/appointment-page.js with i18n support');
