/**
 * Redesign Dental Clinics — Dedicated Appointment Booking Page Engine
 * Handles 30-minute time slot selection, inline auto-open calendar, validation & WhatsApp integration.
 */

(function () {
  'use strict';

  // ── Centralized 30-Minute Time Slot Configuration (10:00 AM to 8:00 PM) ──
  var APPOINTMENT_TIME_SLOTS = [
    { id: 'slot-1000', label: '10:00 AM – 10:30 AM' },
    { id: 'slot-1030', label: '10:30 AM – 11:00 AM' },
    { id: 'slot-1100', label: '11:00 AM – 11:30 AM' },
    { id: 'slot-1130', label: '11:30 AM – 12:00 PM' },
    { id: 'slot-1200', label: '12:00 PM – 12:30 PM' },
    { id: 'slot-1230', label: '12:30 PM – 01:00 PM' },
    { id: 'slot-1300', label: '01:00 PM – 01:30 PM' },
    { id: 'slot-1330', label: '01:30 PM – 02:00 PM' },
    { id: 'slot-1400', label: '02:00 PM – 02:30 PM' },
    { id: 'slot-1430', label: '02:30 PM – 03:00 PM' },
    { id: 'slot-1500', label: '03:00 PM – 03:30 PM' },
    { id: 'slot-1530', label: '03:30 PM – 04:00 PM' },
    { id: 'slot-1600', label: '04:00 PM – 04:30 PM' },
    { id: 'slot-1630', label: '04:30 PM – 05:00 PM' },
    { id: 'slot-1700', label: '05:00 PM – 05:30 PM' },
    { id: 'slot-1730', label: '05:30 PM – 06:00 PM' },
    { id: 'slot-1800', label: '06:00 PM – 06:30 PM' },
    { id: 'slot-1830', label: '06:30 PM – 07:00 PM' },
    { id: 'slot-1900', label: '07:00 PM – 07:30 PM' },
    { id: 'slot-1930', label: '07:30 PM – 08:00 PM' }
  ];

  var selectedTimeSlot = null;
  var currentCalDate = new Date();
  var selectedDateStr = currentCalDate.toISOString().split('T')[0];
  var selectedDoctor = null;

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


  function parseQueryParams() {
    try {
      var params = new URLSearchParams(window.location.search);
      var doc = params.get('doctor');
      var srv = params.get('service');
      
      var doctorMap = {
        'dr-suhail': { name: 'Dr. Suhail A. Syed', service: 'Periodontics & Gum Care' },
        'dr-harika': { name: 'Dr. Harika Choudhary', service: 'Endodontics (Root Canal Treatment)' },
        'dr-mousa': { name: 'Dr. Mousa Jeelani', service: 'Preventive & General Dentistry' },
        'orthodontist': { name: 'Dr. Bilal Ahmed Afaq', service: 'Orthodontics (Braces / Aligners)' },
        'dr-bilal': { name: 'Dr. Bilal Ahmed Afaq', service: 'Orthodontics (Braces / Aligners)' },
        'endodontist': { name: 'Dr. Ahmed Ali Khan', service: 'Endodontics (Root Canal Treatment)' },
        'dr-ahmed': { name: 'Dr. Ahmed Ali Khan', service: 'Endodontics (Root Canal Treatment)' },
        'prosthodontist': { name: 'Dr. Nooruddin Talha', service: 'Restorative Dentistry (Crowns / Bridges)' },
        'dr-talha': { name: 'Dr. Nooruddin Talha', service: 'Restorative Dentistry (Crowns / Bridges)' },
        'dr-lipika': { name: 'Dr. Lipika', service: 'Restorative Dentistry (Crowns / Bridges)' }
      };

      var serviceEl = document.getElementById('apt-page-service');
      if (doc && doctorMap[doc]) {
        selectedDoctor = doctorMap[doc].name;
        if (serviceEl) {
          var targetService = doctorMap[doc].service;
          for (var i = 0; i < serviceEl.options.length; i++) {
            if (serviceEl.options[i].text.includes(targetService) || serviceEl.options[i].value.includes(targetService)) {
              serviceEl.selectedIndex = i;
              break;
            }
          }
        }
      } else if (srv && serviceEl) {
        for (var j = 0; j < serviceEl.options.length; j++) {
          if (serviceEl.options[j].text.toLowerCase().includes(srv.toLowerCase()) || serviceEl.options[j].value.toLowerCase().includes(srv.toLowerCase())) {
            serviceEl.selectedIndex = j;
            break;
          }
        }
      }
    } catch (e) {}
  }

  function initAppointmentPage() {
    var form = document.getElementById('dedicated-appointment-form');
    if (!form) return;

    parseQueryParams();
    initInlineCalendar();
    renderTimeSlots();
    initReasonToggle();
    initFormSubmission(form);
  }

  // ── Inline Open Calendar Engine (Open by default) ──────────────────────────
  function initInlineCalendar() {
    var hiddenInput = document.getElementById('apt-page-date');
    if (hiddenInput) hiddenInput.value = selectedDateStr;

    var summaryEl = document.getElementById('apt-page-selected-date-summary');
    if (summaryEl) {
      var dateObj = new Date(selectedDateStr + 'T00:00:00');
      summaryEl.textContent = 'Selected Date: ' + dateObj.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    }

    renderCalendarMonth(currentCalDate.getFullYear(), currentCalDate.getMonth());
  }

  function renderCalendarMonth(year, month) {
    var calContainer = document.getElementById('apt-inline-calendar-wrap');
    if (!calContainer) return;

    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    var firstDay = new Date(year, month, 1);
    var lastDay = new Date(year, month + 1, 0);
    var totalDays = lastDay.getDate();

    var startDay = (firstDay.getDay() + 6) % 7; // Monday = 0

    var todayObj = new Date();
    var todayStr = todayObj.toISOString().split('T')[0];
    var monthTitle = monthNames[month];

    var html = `
      <div class="inline-cal-header">
        <button type="button" class="inline-cal-nav-btn" id="cal-prev-month" aria-label="Previous Month">‹</button>
        <div class="inline-cal-title">${monthTitle} ${year}</div>
        <button type="button" class="inline-cal-nav-btn" id="cal-next-month" aria-label="Next Month">›</button>
      </div>
      <div class="inline-cal-days-header">
        ${dayHeaders.map(function(h) { return `<div class="cal-day-name">${h}</div>`; }).join('')}
      </div>
      <div class="inline-cal-dates-grid">
    `;

    for (var i = 0; i < startDay; i++) {
      html += `<div class="cal-date-cell is-empty"></div>`;
    }

    for (var d = 1; d <= totalDays; d++) {
      var mStr = String(month + 1).padStart(2, '0');
      var dPadded = String(d).padStart(2, '0');
      var dStr = year + '-' + mStr + '-' + dPadded;

      var isPast = dStr < todayStr;
      var isToday = dStr === todayStr;
      var isSelected = dStr === selectedDateStr;

      var classes = ['cal-date-cell'];
      if (isPast) classes.push('is-past');
      if (isToday) classes.push('is-today');
      if (isSelected) classes.push('is-selected');

      var disAttr = isPast ? 'disabled' : '';

      html += `
        <button type="button" class="${classes.join(' ')}" data-date="${dStr}" ${disAttr}>
          ${d}
        </button>
      `;
    }

    html += `</div>`;
    calContainer.innerHTML = html;

    // Month Navigation
    var prevBtn = calContainer.querySelector('#cal-prev-month');
    var nextBtn = calContainer.querySelector('#cal-next-month');

    if (prevBtn) {
      prevBtn.onclick = function (e) {
        e.preventDefault();
        var prevM = new Date(year, month - 1, 1);
        if (prevM.getFullYear() < todayObj.getFullYear() || (prevM.getFullYear() === todayObj.getFullYear() && prevM.getMonth() < todayObj.getMonth())) {
          return;
        }
        currentCalDate = prevM;
        renderCalendarMonth(currentCalDate.getFullYear(), currentCalDate.getMonth());
      };
    }

    if (nextBtn) {
      nextBtn.onclick = function (e) {
        e.preventDefault();
        currentCalDate = new Date(year, month + 1, 1);
        renderCalendarMonth(currentCalDate.getFullYear(), currentCalDate.getMonth());
      };
    }

    // Date Cell Selection
    calContainer.querySelectorAll('.cal-date-cell:not(.is-past):not(.is-empty)').forEach(function (btn) {
      btn.onclick = function (e) {
        e.preventDefault();
        selectedDateStr = btn.getAttribute('data-date');
        calContainer.querySelectorAll('.cal-date-cell').forEach(function (c) { c.classList.remove('is-selected'); });
        btn.classList.add('is-selected');

        var hiddenInput = document.getElementById('apt-page-date');
        if (hiddenInput) hiddenInput.value = selectedDateStr;

        var summaryEl = document.getElementById('apt-page-selected-date-summary');
        if (summaryEl) {
          var dateObj = new Date(selectedDateStr + 'T00:00:00');
          summaryEl.textContent = 'Selected Date: ' + dateObj.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
        }

        // Hide validation error if active
        var errorBox = document.getElementById('apt-page-error-box');
        if (errorBox) errorBox.style.display = 'none';
      };
    });
  }

  // ── 30-Minute Time Slot Pill Grid ──────────────────────────────────────────
  function renderTimeSlots() {
    var container = document.getElementById('apt-page-time-slots');
    if (!container) return;

    var html = APPOINTMENT_TIME_SLOTS.map(function (slot) {
      return `
        <button type="button" class="apt-time-slot-btn" data-slot-id="${slot.id}" data-slot-label="${slot.label}">
          <span class="slot-check-icon">✓</span>
          <span class="slot-label">${slot.label}</span>
        </button>
      `;
    }).join('');

    container.innerHTML = html;

    container.querySelectorAll('.apt-time-slot-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        container.querySelectorAll('.apt-time-slot-btn').forEach(function (b) {
          b.classList.remove('is-selected');
        });
        btn.classList.add('is-selected');
        selectedTimeSlot = btn.getAttribute('data-slot-label');

        var errorBox = document.getElementById('apt-page-error-box');
        if (errorBox) errorBox.style.display = 'none';
      });
    });
  }

  // ── Optional Reason Custom Message Toggle ──────────────────────────────────
  function initReasonToggle() {
    var reasonSelect = document.getElementById('apt-page-reason');
    var customGroup = document.getElementById('apt-page-custom-group');
    if (!reasonSelect || !customGroup) return;

    reasonSelect.addEventListener('change', function () {
      if (reasonSelect.value === 'Custom Message') {
        customGroup.style.display = 'block';
      } else {
        customGroup.style.display = 'none';
      }
    });
  }

  // ── Form Submission & Temporary WhatsApp Integration ───────────────────────
  function initFormSubmission(form) {
    var errorBox = document.getElementById('apt-page-error-box');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (errorBox) {
        errorBox.style.display = 'none';
        errorBox.textContent = '';
      }

      var name = (document.getElementById('apt-page-name').value || '').trim();
      var phone = (document.getElementById('apt-page-phone').value || '').trim();
      var email = (document.getElementById('apt-page-email').value || '').trim();
      var service = (document.getElementById('apt-page-service').value || '').trim();
      var dateVal = selectedDateStr || (document.getElementById('apt-page-date') ? document.getElementById('apt-page-date').value : '');
      var reason = (document.getElementById('apt-page-reason').value || '').trim();
      var customMsg = (document.getElementById('apt-page-custom-msg') ? document.getElementById('apt-page-custom-msg').value : '').trim();

      // 1. Name validation
      if (!name) {
        showError(t('apt.errName', 'Please enter your full name.'));
        document.getElementById('apt-page-name').focus();
        return;
      }

      // 2. Phone validation
      if (!phone || phone.replace(/\D/g, '').length < 10) {
        showError(t('apt.errPhone', 'Please enter a valid 10-digit mobile number.'));
        document.getElementById('apt-page-phone').focus();
        return;
      }

      // 3. Date validation
      if (!dateVal) {
        showError(t('apt.errDate', 'Please select an appointment date.'));
        return;
      }

      // 4. Time slot validation
      if (!selectedTimeSlot) {
        showError(t('apt.errSlot', 'Please select a preferred 30-minute time slot.'));
        var slotsContainer = document.getElementById('apt-page-time-slots');
        if (slotsContainer) slotsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Format Pretty Date
      var dateObj = new Date(dateVal + 'T00:00:00');
      var dateStr = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : dateVal;

      var formData = {
        name: name,
        phone: phone,
        email: email || 'Not provided',
        service: service || 'Not specified (General Consultation)',
        doctor: selectedDoctor,
        date: dateStr,
        timeSlot: selectedTimeSlot,
        reason: (reason === 'Custom Message' && customMsg ? customMsg : (reason || 'Not provided')),
        additionalMsg: customMsg && reason !== 'Custom Message' ? customMsg : 'Not provided'
      };

      // Launch Predefined WhatsApp Message
      triggerWhatsAppAppointment(formData);

      // Show On-Page Success View
      var formView = document.getElementById('apt-page-form-view');
      var successView = document.getElementById('apt-page-success-view');
      if (formView && successView) {
        formView.style.display = 'none';
        successView.style.display = 'block';
        var successText = document.getElementById('apt-page-success-text');
        if (successText) {
          var serviceDetails = service ? ' for <strong>' + escapeHtml(service) + '</strong>' : '';
          successText.innerHTML = 'Thank you, <strong>' + escapeHtml(name) + '</strong>!<br/>Your appointment request' + serviceDetails + ' on <strong>' + escapeHtml(dateStr) + ' (' + escapeHtml(selectedTimeSlot) + ')</strong> has been prepared and opened in WhatsApp for confirmation by Redesign Dental Clinics.';
        }
      }
    });

    function showError(msg) {
      if (errorBox) {
        errorBox.textContent = msg;
        errorBox.style.display = 'block';
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  function triggerWhatsAppAppointment(data) {
    if (window.RedesignWhatsApp && typeof window.RedesignWhatsApp.openWhatsApp === 'function') {
      var msg = window.RedesignWhatsApp.buildAppointmentMessage(data);
      window.RedesignWhatsApp.openWhatsApp(msg);
      return;
    }

    var rawNumber = (window.whatsappConfig && window.whatsappConfig.clinicNumber)
      ? String(window.whatsappConfig.clinicNumber)
      : '8179738737';
    var cleanNumber = rawNumber.replace(/\D/g, '');
    if (cleanNumber.length === 10) cleanNumber = '91' + cleanNumber;
    if (!cleanNumber) cleanNumber = '918179738737';

    var lines = [
      'Hello Redesign Dental Clinics 👋',
      '',
      'I would like to request a dental appointment.',
      '',
      '📋 PATIENT DETAILS',
      '',
      '👤 Name: ' + data.name,
      '',
      '📱 Mobile Number: ' + data.phone,
      '',
      '📧 Email: ' + data.email,
      '',
      '📅 Preferred Date: ' + data.date,
      '',
      '⏰ Preferred Time:',
      data.timeSlot,
      '',
      (data.doctor ? ('👨‍⚕️ Preferred Doctor: ' + data.doctor + '\n\n') : '') +
      '🦷 Service Required:',
      data.service,
      '',
      '📌 Reason for Appointment:',
      data.reason,
      '',
      '💬 Additional Concern:',
      data.additionalMsg,
      '',
      'Please let me know about the availability of my preferred appointment slot.',
      '',
      'Thank you!'
    ];

    var url = 'https://wa.me/' + cleanNumber + '?text=' + encodeURIComponent(lines.join('\n'));
    try {
      var win = window.open(url, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = url;
      }
    } catch (err) {
      window.location.href = url;
    }
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppointmentPage);
  } else {
    initAppointmentPage();
  }
})();
