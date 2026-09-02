/**
 * Redesign Clinics — Unified Appointment & Callback Booking System
 * High-performance vanilla JavaScript modal & CTA handler with Google reCAPTCHA.
 */

(function () {
  'use strict';

  // Google reCAPTCHA v3 Implementation
  var RecaptchaWidget = (function () {
    var isScriptLoading = false;
    var loadCallbacks = [];

    function getSiteKey() {
      return window.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LdkaZQtAAAAAlkSLA78ABt5Xeo0EgbfLbeqHZWu';
    }

    function loadRecaptchaScript(callback) {
      var siteKey = getSiteKey();
      if (window.grecaptcha && typeof window.grecaptcha.execute === 'function') {
        if (callback) callback();
        return;
      }

      if (callback) loadCallbacks.push(callback);

      if (isScriptLoading) return;

      var existingScript = document.querySelector('script[src*="recaptcha/api.js"]');
      if (!existingScript) {
        isScriptLoading = true;
        var script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?render=' + encodeURIComponent(siteKey);
        script.async = true;
        script.defer = true;
        script.onload = function () {
          isScriptLoading = false;
          if (window.grecaptcha && window.grecaptcha.ready) {
            window.grecaptcha.ready(function () {
              while (loadCallbacks.length > 0) {
                var cb = loadCallbacks.shift();
                try { cb(); } catch (e) { console.warn(e); }
              }
            });
          }
        };
        script.onerror = function () {
          isScriptLoading = false;
          console.warn('Google reCAPTCHA v3 failed to load.');
          while (loadCallbacks.length > 0) {
            var cb = loadCallbacks.shift();
            try { cb(new Error('Failed to load reCAPTCHA script')); } catch (e) {}
          }
        };
        document.head.appendChild(script);
      } else {
        var checkInterval = setInterval(function () {
          if (window.grecaptcha && typeof window.grecaptcha.execute === 'function') {
            clearInterval(checkInterval);
            while (loadCallbacks.length > 0) {
              var cb = loadCallbacks.shift();
              try { cb(); } catch (e) {}
            }
          }
        }, 50);
      }
    }

    function execute(action) {
      return new Promise(function (resolve, reject) {
        var siteKey = getSiteKey();
        // 5-second safety timeout so button never stays stuck
        var timedOut = false;
        var timeout = setTimeout(function () {
          timedOut = true;
          resolve('__timeout__');
        }, 5000);
        loadRecaptchaScript(function (err) {
          if (timedOut) return;
          if (err) {
            clearTimeout(timeout);
            return resolve('__error__');
          }
          if (!window.grecaptcha || typeof window.grecaptcha.execute !== 'function') {
            clearTimeout(timeout);
            return resolve('__unavailable__');
          }
          try {
            window.grecaptcha.ready(function () {
              if (timedOut) return;
              window.grecaptcha.execute(siteKey, { action: action || 'submit' })
                .then(function (token) {
                  clearTimeout(timeout);
                  if (!timedOut) resolve(token);
                })
                .catch(function () {
                  clearTimeout(timeout);
                  if (!timedOut) resolve('__error__');
                });
            });
          } catch (e) {
            clearTimeout(timeout);
            resolve('__error__');
          }
        });
      });
    }

    // Modern v3 UI Indicator: replaces broken v2 checkbox boxes with sleek, trustworthy reCAPTCHA v3 shield badge
    function render(containerId, options) {
      var container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
      if (!container) return;
      container.innerHTML = [
        '<div class="rc-v3-badge-container">',
        '  <div class="rc-v3-badge-icon">',
        '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        '      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',
        '      <path d="m9 12 2 2 4-4"></path>',
        '    </svg>',
        '  </div>',
        '  <div class="rc-v3-badge-text">',
        '    <span class="rc-v3-badge-title">Protected by Google reCAPTCHA v3</span>',
        '    <span class="rc-v3-badge-sub">Automated frictionless spam & abuse protection</span>',
        '  </div>',
        '</div>'
      ].join('');
      // Preload script in background so execute() on submit is instant
      loadRecaptchaScript();
      if (options && options.onRendered) options.onRendered();
    }

    function reset(containerId) {
      var container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
      if (container) {
        render(container);
      }
    }

    return {
      loadScript: loadRecaptchaScript,
      execute: execute,
      getToken: execute,
      render: render,
      reset: reset,
      getSiteKey: getSiteKey
    };
  })();

  window.RecaptchaWidget = RecaptchaWidget;

  function showCaptchaError(prefix, msg) {
    var errEl = document.getElementById(prefix + '-captcha-error');
    if (errEl) {
      errEl.textContent = msg;
      errEl.style.display = 'block';
    }
  }

  function hideCaptchaError(prefix) {
    var errEl = document.getElementById(prefix + '-captcha-error');
    if (errEl) {
      errEl.style.display = 'none';
      errEl.textContent = '';
    }
  }

  // Inject Booking Modals HTML if not present
  function initBookingModals() {
    if (document.getElementById('rc-appointment-modal')) return;

    var modalContainer = document.createElement('div');
    modalContainer.id = 'rc-booking-modals-root';
    modalContainer.innerHTML = `
      <!-- ===== APPOINTMENT MODAL ===== -->
      <div id="rc-appointment-modal" class="rc-modal-overlay" aria-hidden="true" role="dialog" aria-modal="true">
        <div class="rc-modal-card">
          <button type="button" class="rc-modal-close" aria-label="Close modal" data-i18n-aria="common.close">&times;</button>
          
          <div id="rc-apt-form-view">
            <div class="rc-modal-header">
              <div class="rc-modal-badge">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 0C6.4 3.2 8.8 5.6 12 6C8.8 6.4 6.4 8.8 6 12C5.6 8.8 3.2 6.4 0 6C3.2 5.6 5.6 3.2 6 0Z" fill="currentColor"></path>
                </svg>
                <span data-i18n="common.brand">Redesign Clinics</span>
              </div>
              <h3 class="rc-modal-title" data-i18n="booking.modalTitle">Book Your Dental Appointment</h3>
              <p class="rc-modal-sub" data-i18n="booking.modalSubtitle">Choose your preferred date and time. Our team will confirm your visit shortly.</p>
            </div>

            <form id="rc-appointment-form" novalidate>
              <!-- Anti-Spam Honeypot -->
              <input type="text" name="clinic_hp" id="rc-apt-hp" style="display:none!important; position:absolute; left:-9999px;" tabindex="-1" autocomplete="off" />
              <div class="rc-form-group">
                <label class="rc-form-label" for="rc-apt-name" data-i18n="booking.fullNameLabel">Full Name *</label>
                <input type="text" id="rc-apt-name" class="rc-form-input" placeholder="Your Full Name" data-i18n-placeholder="booking.fullNamePlaceholder" required />
              </div>

              <div class="rc-form-group">
                <label class="rc-form-label" for="rc-apt-phone" data-i18n="booking.phoneLabel">Phone Number *</label>
                <input type="tel" id="rc-apt-phone" class="rc-form-input" placeholder="10-Digit Mobile Number" data-i18n-placeholder="booking.phonePlaceholder" required />
              </div>

              <div class="rc-form-group">
                <label class="rc-form-label" for="rc-apt-email"><span data-i18n="booking.emailLabel">Email Address</span> <span>(<span data-i18n="common.optional">Optional</span>)</span></label>
                <input type="email" id="rc-apt-email" class="rc-form-input" placeholder="Your Email (Optional)" data-i18n-placeholder="booking.emailPlaceholder" />
              </div>

              <div class="rc-form-group">
                <label class="rc-form-label" for="rc-apt-reason"><span data-i18n="booking.reasonLabel">Reason for Appointment (Optional)</span></label>
                <select id="rc-apt-reason" class="rc-form-select">
                  <option value="" data-i18n="booking.reasonSelect">Select Reason (Optional)</option>
                  <option value="General" data-i18n="booking.reasonGeneral">General</option>
                  <option value="Emergency" data-i18n="booking.reasonEmergency">Emergency</option>
                  <option value="Implants" data-i18n="booking.reasonImplants">Implants</option>
                  <option value="Custom Message" data-i18n="booking.reasonCustom">Custom Message</option>
                </select>
                <div id="rc-apt-custom-group" style="display: none; margin-top: 10px;">
                  <label class="rc-form-label" for="rc-apt-custom-msg"><span data-i18n="booking.customMsgLabel">Tell us more (Optional)</span></label>
                  <textarea id="rc-apt-custom-msg" class="rc-form-textarea" placeholder="Describe your reason for contacting us (Optional)" data-i18n-placeholder="booking.customMsgPlaceholder"></textarea>
                </div>
              </div>

              <div class="rc-form-group">
                <label class="rc-form-label" for="rc-apt-date" data-i18n="booking.dateLabel">Preferred Date *</label>
                <input type="date" id="rc-apt-date" class="rc-form-input" required />
              </div>

              <div class="rc-form-group">
                <label class="rc-form-label" for="rc-apt-time-input" data-i18n="booking.timeLabel">Preferred Time Slot *</label>
                <select id="rc-apt-time-input" class="rc-form-select" required>
                  <option value="10:00 AM IST">10:00 AM</option>
                  <option value="11:30 AM IST">11:30 AM</option>
                  <option value="01:00 PM IST">01:00 PM</option>
                  <option value="02:30 PM IST">02:30 PM</option>
                  <option value="04:00 PM IST">04:00 PM</option>
                  <option value="05:30 PM IST">05:30 PM</option>
                  <option value="07:00 PM IST">07:00 PM</option>
                </select>
              </div>

              <!-- Google reCAPTCHA Widget -->
              <div class="rc-form-group rc-recaptcha-group">
                <div id="rc-apt-recaptcha-container" class="rc-recaptcha-box"></div>
                <div id="rc-apt-captcha-error" class="rc-captcha-error-msg" style="display: none;"></div>
              </div>

              <button type="submit" id="rc-apt-submit-btn" class="rc-submit-btn">
                <span data-i18n="booking.submitBtn">Confirm Appointment Request</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div class="rc-form-note" data-i18n="booking.recaptchaNotice">Protected by Google reCAPTCHA. We respect your privacy.</div>
            </form>
          </div>

          <div id="rc-apt-success-view" class="rc-success-box" style="display: none;">
            <div class="rc-success-icon">✓</div>
            <h4 class="rc-success-title" data-i18n="booking.successTitle">Appointment Request Received!</h4>
            <p class="rc-success-msg" id="rc-apt-success-text" data-i18n="booking.successMessage">
              Thank you! We have received your booking request. Our team will contact you shortly to confirm your appointment.
            </p>
            <a id="rc-apt-wa-link" href="#" target="_blank" rel="noopener noreferrer" class="rc-whatsapp-btn">
              <span data-i18n="common.whatsappUs">Open Instant WhatsApp Confirmation</span>
            </a>
            <button type="button" class="rc-submit-btn rc-done-btn" style="margin-top: 10px; background: #64748b;" data-i18n="common.done">Done</button>
          </div>
        </div>
      </div>

      <!-- ===== CALLBACK MODAL ===== -->
      <div id="rc-callback-modal" class="rc-modal-overlay" aria-hidden="true" role="dialog" aria-modal="true">
        <div class="rc-modal-card">
          <button type="button" class="rc-modal-close" aria-label="Close modal" data-i18n-aria="common.close">&times;</button>
          
          <div id="rc-cb-form-view">
            <div class="rc-modal-header">
              <div class="rc-modal-badge">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 0C6.4 3.2 8.8 5.6 12 6C8.8 6.4 6.4 8.8 6 12C5.6 8.8 3.2 6.4 0 6C3.2 5.6 5.6 3.2 6 0Z" fill="currentColor"></path>
                </svg>
                <span data-i18n="common.brand">Redesign Clinics</span>
              </div>
              <h3 class="rc-modal-title" data-i18n="callback.modalTitle">Request a Fast Callback</h3>
              <p class="rc-modal-sub" data-i18n="callback.modalSubtitle">Leave your details and a senior dental specialist will call you back within 15 minutes.</p>
            </div>

            <form id="rc-callback-form" novalidate>
              <!-- Anti-Spam Honeypot -->
              <input type="text" name="clinic_hp" id="rc-call-hp" style="display:none!important; position:absolute; left:-9999px;" tabindex="-1" autocomplete="off" />
              <div class="rc-form-group">
                <label class="rc-form-label" for="rc-cb-name" data-i18n="booking.fullNameLabel">Full Name *</label>
                <input type="text" id="rc-cb-name" class="rc-form-input" placeholder="Your Full Name" data-i18n-placeholder="booking.fullNamePlaceholder" required />
              </div>

              <div class="rc-form-group">
                <label class="rc-form-label" for="rc-cb-phone" data-i18n="booking.phoneLabel">Phone Number *</label>
                <input type="tel" id="rc-cb-phone" class="rc-form-input" placeholder="10-Digit Mobile Number" data-i18n-placeholder="booking.phonePlaceholder" required />
              </div>

              <!-- Google reCAPTCHA Widget -->
              <div class="rc-form-group rc-recaptcha-group">
                <div id="rc-cb-recaptcha-container" class="rc-recaptcha-box"></div>
                <div id="rc-cb-captcha-error" class="rc-captcha-error-msg" style="display: none;"></div>
              </div>

              <button type="submit" id="rc-cb-submit-btn" class="rc-submit-btn">
                <span data-i18n="callback.submitBtn">Request Callback Now</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </form>
          </div>

          <div id="rc-cb-success-view" class="rc-success-box" style="display: none;">
            <div class="rc-success-icon">✓</div>
            <h4 class="rc-success-title" data-i18n="callback.successTitle">Callback Request Received!</h4>
            <p class="rc-success-msg" id="rc-cb-success-text" data-i18n="callback.successMessage">
              Thank you! Our front desk team will call you back shortly during your preferred time window.
            </p>
            <button type="button" class="rc-submit-btn rc-done-btn" data-i18n="common.done">Done</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalContainer);

    function updateSlotsForDate(dateStr) {
      if (!dateStr) return;
      var selectedDate = new Date(dateStr + 'T00:00:00');
      var day = selectedDate.getDay(); // 0 = Sunday
      var select = document.getElementById('rc-apt-time-input');
      if (!select) return;

      var slots = [];
      if (day === 0) { // Sunday (10:00 AM - 2:00 PM IST)
        slots = ['10:00 AM IST', '11:00 AM IST', '12:00 PM IST', '01:00 PM IST'];
      } else { // Monday - Saturday (10:00 AM - 8:00 PM IST)
        slots = ['10:00 AM IST', '11:30 AM IST', '01:00 PM IST', '02:30 PM IST', '04:00 PM IST', '05:30 PM IST', '07:00 PM IST'];
      }

      select.innerHTML = slots.map(function (s) {
        return '<option value="' + s + '">' + s.replace(' IST', '') + '</option>';
      }).join('');

      select.value = slots[0];
    }

    // Set Date input min to today
    var dateInput = document.getElementById('rc-apt-date');
    if (dateInput) {
      var today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      dateInput.value = today;

      dateInput.addEventListener('change', function () {
        updateSlotsForDate(dateInput.value);
      });
      updateSlotsForDate(dateInput.value);
    }

    var reasonSelect = document.getElementById('rc-apt-reason');
    var customGroup = document.getElementById('rc-apt-custom-group');
    var customMsg = document.getElementById('rc-apt-custom-msg');
    if (reasonSelect && customGroup) {
      reasonSelect.addEventListener('change', function () {
        if (reasonSelect.value === 'Custom Message') {
          customGroup.style.display = 'block';
        } else {
          customGroup.style.display = 'none';
          if (customMsg) customMsg.value = '';
        }
      });
    }

    // Close buttons & overlay handlers
    document.querySelectorAll('.rc-modal-overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeAllModals();
      });
    });

    document.querySelectorAll('.rc-modal-close, .rc-done-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeAllModals();
      });
    });

    // Handle Forms
    document.getElementById('rc-appointment-form').addEventListener('submit', handleAppointmentSubmit);
    document.getElementById('rc-callback-form').addEventListener('submit', handleCallbackSubmit);
  }

  var activeTrigger = null;

  function renderAptRecaptcha() {
    if (window.RecaptchaWidget) {
      window.RecaptchaWidget.render('rc-apt-recaptcha-container');
    }
  }

  function renderCbRecaptcha() {
    if (window.RecaptchaWidget) {
      window.RecaptchaWidget.render('rc-cb-recaptcha-container');
    }
  }

  function openAppointmentModal(triggerEl) {
    if (window.location.pathname !== '/appointment' && !window.location.pathname.endsWith('/appointment.html')) {
      window.location.href = '/appointment';
      return;
    }
    initBookingModals();
    activeTrigger = triggerEl || null;
    closeAllModals();
    hideCaptchaError('rc-apt');

    var modal = document.getElementById('rc-appointment-modal');
    if (window.i18n) window.i18n.translateDOM(modal);
    var reasonSelect = document.getElementById('rc-apt-reason');
    var customGroup = document.getElementById('rc-apt-custom-group');
    var customMsg = document.getElementById('rc-apt-custom-msg');
    if (reasonSelect) reasonSelect.value = '';
    if (customGroup) customGroup.style.display = 'none';
    if (customMsg) customMsg.value = '';
    document.getElementById('rc-apt-form-view').style.display = 'block';
    document.getElementById('rc-apt-success-view').style.display = 'none';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('rc-modal-open');

    renderAptRecaptcha();
  }

  function openCallbackModal(triggerEl) {
    initBookingModals();
    activeTrigger = triggerEl || null;
    closeAllModals();
    hideCaptchaError('rc-cb');

    var modal = document.getElementById('rc-callback-modal');
    if (window.i18n) window.i18n.translateDOM(modal);
    document.getElementById('rc-cb-form-view').style.display = 'block';
    document.getElementById('rc-cb-success-view').style.display = 'none';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('rc-modal-open');

    renderCbRecaptcha();
  }

  window.addEventListener('rcLanguageChanged', function () {
    var root = document.getElementById('rc-booking-modals-root');
    if (root && window.i18n) window.i18n.translateDOM(root);
    var floatRoot = document.getElementById('rc-floating-actions-root');
    if (floatRoot && window.i18n) window.i18n.translateDOM(floatRoot);
  });

  function closeAllModals() {
    document.querySelectorAll('.rc-modal-overlay').forEach(function (m) {
      m.classList.remove('is-open');
      m.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
    document.body.classList.remove('rc-modal-open');
    if (activeTrigger && typeof activeTrigger.focus === 'function') {
      activeTrigger.focus();
      activeTrigger = null;
    }
  }

  // Handle ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllModals();
  });

  // Track form open time for bot defense
  var _formOpenTime = Date.now();

  // Temporary WhatsApp Appointment & Callback Redirection Helper
  function triggerWhatsAppAppointment(formData) {
    if (window.RedesignWhatsApp && typeof window.RedesignWhatsApp.openWhatsApp === 'function') {
      var msg = window.RedesignWhatsApp.buildAppointmentMessage(formData);
      window.RedesignWhatsApp.openWhatsApp(msg);
    } else {
      var cleanNumber = '917780245307';
      var lines = [
        'Hello Redesign Dental Clinics 👋',
        '',
        'I would like to book a dental appointment.',
        '',
        '📋 PATIENT DETAILS',
        '',
        '👤 Name: ' + (formData.name || 'Not provided'),
        '',
        '📱 Mobile Number: ' + (formData.phone || 'Not provided')
      ];
      if (formData.email) lines.push('', '📧 Email: ' + formData.email);
      if (formData.date) lines.push('', '📅 Preferred Date: ' + formData.date);
      if (formData.time) lines.push('', '⏰ Preferred Time: ' + formData.time);
      if (formData.reason || formData.service) lines.push('', '🦷 Service Required: ' + (formData.reason || formData.service));
      if (formData.customMsg || formData.additional) lines.push('', '💬 Additional Concern:', (formData.customMsg || formData.additional));
      lines.push('', 'Please confirm my appointment availability.', '', 'Thank you!');

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
  }

  function triggerWhatsAppCallback(formData) {
    if (window.RedesignWhatsApp && typeof window.RedesignWhatsApp.openWhatsApp === 'function') {
      var msg = window.RedesignWhatsApp.buildCallbackMessage(formData);
      window.RedesignWhatsApp.openWhatsApp(msg);
    } else {
      var cleanNumber = '917780245307';
      var lines = [
        'Hello Redesign Dental Clinics 👋',
        '',
        'I would like to request a callback.',
        '',
        '📋 MY DETAILS',
        '',
        '👤 Name: ' + (formData.name || 'Not provided'),
        '',
        '📱 Mobile Number: ' + (formData.phone || 'Not provided'),
        '',
        'Please contact me regarding a dental consultation.',
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
  }

  // Appointment Submission with Server-Side Google reCAPTCHA v3 & WhatsApp Integration
  function handleAppointmentSubmit(e) {
    e.preventDefault();
    hideCaptchaError('rc-apt');

    var hpInput = document.getElementById('rc-apt-hp');
    var hpValue = hpInput ? hpInput.value.trim() : '';

    var name = document.getElementById('rc-apt-name').value.trim();
    var phone = document.getElementById('rc-apt-phone').value.trim();
    var email = document.getElementById('rc-apt-email').value.trim();
    var reason = document.getElementById('rc-apt-reason') ? document.getElementById('rc-apt-reason').value : '';
    var customMsg = document.getElementById('rc-apt-custom-msg') ? document.getElementById('rc-apt-custom-msg').value.trim() : '';
    var date = document.getElementById('rc-apt-date').value;
    var time = document.getElementById('rc-apt-time-input').value;

    if (!name || !phone || !date || !time) {
      showCaptchaError('rc-apt', 'Please fill in all required fields (Name, Phone, Date, Time).');
      return;
    }

    var formData = {
      name: name,
      phone: phone,
      email: email,
      reason: reason,
      customMsg: customMsg,
      date: date,
      time: time
    };

    var btn = document.getElementById('rc-apt-submit-btn');
    var btnSpan = btn ? btn.querySelector('span') : null;
    var originalBtnText = btnSpan ? btnSpan.textContent : 'Confirm Appointment Request';
    if (btn) {
      btn.disabled = true;
      if (btnSpan) btnSpan.textContent = 'Opening WhatsApp...';
    }

    // Trigger WhatsApp Redirection
    triggerWhatsAppAppointment(formData);

    RecaptchaWidget.execute('appointment_booking')
      .then(function (token) {
        return fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            phone: phone,
            email: email,
            reason: reason,
            customMsg: customMsg,
            date: date,
            time: time,
            token: token,
            clinic_hp: hpValue,
            _timer: _formOpenTime
          })
        });
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (btn) { btn.disabled = false; if (btnSpan) btnSpan.textContent = originalBtnText; }

        if (data.success) {
          document.getElementById('rc-apt-form-view').style.display = 'none';
          document.getElementById('rc-apt-success-view').style.display = 'block';

          var refHtml = data.referenceId ? ' <span style="font-size:0.85em; opacity:0.85;">(Ref: ' + escapeHtml(data.referenceId) + ')</span>' : '';
          document.getElementById('rc-apt-success-text').innerHTML =
            'Thank you, <strong>' + escapeHtml(name) + '</strong>!' + refHtml + '<br/>We have received your appointment request for <strong>' + escapeHtml(date) + ' at ' + escapeHtml(time) + '</strong>. Our team will contact you at <strong>' + escapeHtml(phone) + '</strong> to confirm the details.';

          // Clear patient inputs for privacy protection
          var form = document.getElementById('rc-appointment-form');
          if (form) form.reset();
        } else {
          showCaptchaError('rc-apt', data.error || 'Unable to process your appointment request right now. Please try again.');
        }
      })
      .catch(function () {
        if (btn) { btn.disabled = false; if (btnSpan) btnSpan.textContent = originalBtnText; }
        // Keep success view active as WhatsApp was launched
        document.getElementById('rc-apt-form-view').style.display = 'none';
        document.getElementById('rc-apt-success-view').style.display = 'block';
      });
  }

  // Callback Submission with Server-Side Google reCAPTCHA v3 & WhatsApp Integration
  function handleCallbackSubmit(e) {
    e.preventDefault();
    hideCaptchaError('rc-cb');

    var hpInput = document.getElementById('rc-call-hp');
    var hpValue = hpInput ? hpInput.value.trim() : '';

    var name = document.getElementById('rc-cb-name').value.trim();
    var phone = document.getElementById('rc-cb-phone').value.trim();
    var prefTimeEl = document.getElementById('rc-cb-pref-time');
    var prefTime = prefTimeEl ? prefTimeEl.value : '';

    if (!name || !phone) {
      showCaptchaError('rc-cb', 'Please fill in your Name and Phone Number.');
      return;
    }

    var formData = {
      name: name,
      phone: phone,
      preferredTime: prefTime
    };

    var btn = document.getElementById('rc-cb-submit-btn');
    var btnSpan = btn ? btn.querySelector('span') : null;
    var originalBtnText = btnSpan ? btnSpan.textContent : 'Request Callback Now';
    if (btn) {
      btn.disabled = true;
      if (btnSpan) btnSpan.textContent = 'Opening WhatsApp...';
    }

    // Trigger WhatsApp Redirection
    triggerWhatsAppCallback(formData);

    RecaptchaWidget.execute('callback_request')
      .then(function (token) {
        return fetch('/api/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            phone: phone,
            preferredTime: prefTime,
            token: token,
            clinic_hp: hpValue,
            _timer: _formOpenTime
          })
        });
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (btn) { btn.disabled = false; if (btnSpan) btnSpan.textContent = originalBtnText; }

        if (data.success) {
          document.getElementById('rc-cb-form-view').style.display = 'none';
          document.getElementById('rc-cb-success-view').style.display = 'block';

          var refHtml = data.referenceId ? ' <span style="font-size:0.85em; opacity:0.85;">(Ref: ' + escapeHtml(data.referenceId) + ')</span>' : '';
          document.getElementById('rc-cb-success-text').innerHTML =
            'Thank you, <strong>' + escapeHtml(name) + '</strong>!' + refHtml + '<br/>We have received your callback request. Our front desk team will call you back shortly at <strong>' + escapeHtml(phone) + '</strong>.';

          // Clear patient inputs for privacy protection
          var form = document.getElementById('rc-callback-form');
          if (form) form.reset();
        } else {
          showCaptchaError('rc-cb', data.error || 'Unable to process your callback request right now. Please try again.');
        }
      })
      .catch(function () {
        if (btn) { btn.disabled = false; if (btnSpan) btnSpan.textContent = originalBtnText; }
        // Keep success view active as WhatsApp was launched
        document.getElementById('rc-cb-form-view').style.display = 'none';
        document.getElementById('rc-cb-success-view').style.display = 'block';
      });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  // Intercept all CTAs dynamically across the document
  document.addEventListener('click', function (e) {
    var target = e.target.closest('a, button');
    if (!target) return;

    // Do NOT intercept clicks originating inside the chatbot UI unless it is an explicit chatbot CTA (.sh-cta-btn)
    if (target.closest('#sh-chat-widget')) {
      if (!target.classList.contains('sh-cta-btn')) {
        return;
      }
    }

    // Do NOT open modal when submitting an inline form (like the hero lead form)
    if (target.getAttribute('type') === 'submit' || target.closest('form')) {
      return;
    }

    var href = target.getAttribute('href') || '';
    var text = (target.textContent || '').trim().toLowerCase();

    // Check Callback CTAs first
    if (
      href === '#callback' ||
      href === '#call' ||
      text.indexOf('make a call') !== -1 ||
      text.indexOf('make call') !== -1 ||
      text.indexOf('book a call') !== -1 ||
      text.indexOf('request a call') !== -1 ||
      text.indexOf('call back') !== -1 ||
      text.indexOf('get a callback') !== -1 ||
      text.indexOf('request callback') !== -1 ||
      text.indexOf('request a callback') !== -1 ||
      text.indexOf('call now') !== -1 ||
      text.indexOf('call us') !== -1
    ) {
      e.preventDefault();
      openCallbackModal(target);
      return;
    }

    // Check Appointment CTAs
    if (
      href === '#book' ||
      href === '#appointment' ||
      text.indexOf('book appointment') !== -1 ||
      text.indexOf('book an appointment') !== -1 ||
      text.indexOf('book a visit') !== -1 ||
      text.indexOf('schedule appointment') !== -1 ||
      text.indexOf('get appointment') !== -1 ||
      text.indexOf('book now') !== -1 ||
      (text.indexOf('appointment') !== -1 && target.classList.contains('button_primary'))
    ) {
      e.preventDefault();
      if (window.location.pathname !== '/appointment' && !window.location.pathname.endsWith('/appointment.html')) {
        window.location.href = '/appointment';
      } else {
        openAppointmentModal(target);
      }
      return;
    }
  });

  // Expose Global API
  window.RedesignBooking = {
    openAppointmentModal: openAppointmentModal,
    openCallbackModal: openCallbackModal,
    closeBookingModal: closeAllModals
  };

  function loadChatbotScript() {
    if (window.DrSuhailChatbot || document.getElementById('rc-suhail-chatbot-script')) return;
    var script = document.createElement('script');
    script.id = 'rc-suhail-chatbot-script';
    script.src = '/assets/js/dr-suhail-chatbot.js';
    script.defer = true;
    document.body.appendChild(script);
  }

  function initFloatingActionButtons() {
    if (document.getElementById('rc-floating-actions-root')) return;
    loadChatbotScript();

    var container = document.createElement('div');
    container.id = 'rc-floating-actions-root';
    container.className = 'rc-floating-actions';
    container.innerHTML = `
      <button type="button" class="rc-float-btn rc-float-doc" id="rc-float-doctor-btn" aria-label="Ask Dr. Suhail's Assistant" title="Need help? Ask Dr. Suhail">
        <span class="rc-float-doc-label sh-doc-tooltip">Need help? Ask Dr. Suhail</span>
        <div class="rc-float-doc-wrap">
          <img src="/assets/img/dr-suhail-floating-icon.png" onerror="this.onerror=null;this.src='/assets/img/suhail_icon-removebg-preview.png'" alt="Dr. Suhail's Virtual Assistant" class="rc-float-doc-img" />
        </div>
      </button>
      <a href="https://wa.me/917780245307?text=Hi%20Redesign%20Dental%20Clinics%2C%20I%20would%20like%20to%20book%20an%20appointment" target="_blank" rel="noopener noreferrer" class="rc-float-btn rc-float-wa" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
        <span>WhatsApp Us</span>
      </a>
      <a href="https://www.instagram.com/redesign.dental.clinics/" target="_blank" rel="noopener noreferrer" class="rc-float-btn rc-float-ig" aria-label="Follow on Instagram">
        <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        <span>Instagram</span>
      </a>
    `;
    document.body.appendChild(container);

    // Toggle Dr. Suhail Chatbot when doctor icon is clicked
    var docBtn = container.querySelector('#rc-float-doctor-btn');
    if (docBtn) {
      docBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.DrSuhailChatbot) {
          window.DrSuhailChatbot.toggle(docBtn);
        }
      });
    }

    if (window.i18n) {
      window.i18n.translateDOM(container);
    }
  }

  function initTestimonialAutoRotation() {
    var slider = document.querySelector('.testimonial_slider');
    if (!slider) return;

    var intervalId = null;
    var delay = 4000; // 4 seconds interval
    var isHovered = false;

    function advanceSlide() {
      if (isHovered) return;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      var rightArrow = slider.querySelector('.w-slider-arrow-right');
      if (rightArrow) {
        rightArrow.click();
      }
    }

    function startRotation() {
      stopRotation();
      intervalId = setInterval(advanceSlide, delay);
    }

    function stopRotation() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    slider.addEventListener('mouseenter', function () {
      isHovered = true;
      stopRotation();
    });

    slider.addEventListener('mouseleave', function () {
      isHovered = false;
      startRotation();
    });

    slider.addEventListener('click', function (e) {
      if (e.target.closest('.w-slider-arrow-left, .w-slider-arrow-right, .w-slider-dot, .w-slider-nav')) {
        startRotation();
      }
    });

    startRotation();
  }

  function initContactForm() {
    var formView = document.getElementById('rc-contact-form-view');
    var form = document.getElementById('rc-contact-form');
    if (!form) return;

    if (window.RecaptchaWidget) {
      window.RecaptchaWidget.render('rc-contact-recaptcha');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var errBox = document.getElementById('rc-contact-error');
      if (errBox) errBox.style.display = 'none';

      var nameInput = document.getElementById('rc-contact-name');
      var phoneInput = document.getElementById('rc-contact-phone');
      var emailInput = document.getElementById('rc-contact-email');
      var subjectInput = document.getElementById('rc-contact-subject');
      var msgInput = document.getElementById('rc-contact-message');

      var name = nameInput ? nameInput.value.trim() : '';
      var phone = phoneInput ? phoneInput.value.trim() : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var subject = subjectInput ? subjectInput.value.trim() : 'General Enquiry';
      var messageText = msgInput ? msgInput.value.trim() : '';

      if (!name || !phone) {
        showCaptchaError('rc-contact', 'Please fill in your name and phone number.');
        return;
      }

      var formData = {
        name: name,
        phone: phone,
        email: email,
        service: subject,
        additional: messageText
      };

      var btn = form.querySelector('button[type="submit"]');
      var btnSpan = btn ? btn.querySelector('span') : null;
      var originalBtnText = btnSpan ? btnSpan.textContent : 'Send Message';
      if (btn) {
        btn.disabled = true;
        if (btnSpan) btnSpan.textContent = 'Opening WhatsApp...';
      }

      // Trigger WhatsApp Redirection
      triggerWhatsAppAppointment(formData);

      RecaptchaWidget.execute('contact_form')
        .then(function (token) {
          var hpInput = document.getElementById('rc-contact-hp');
          var hpVal = hpInput ? hpInput.value.trim() : '';

          return fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: name,
              phone: phone,
              email: email,
              subject: subject,
              message: messageText,
              token: token,
              clinic_hp: hpVal,
              _timer: _formOpenTime
            })
          });
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (btn) { btn.disabled = false; if (btnSpan) btnSpan.textContent = originalBtnText; }

          if (data.success) {
            if (formView) formView.style.display = 'none';
            var successView = document.getElementById('rc-contact-success-view');
            if (successView) successView.style.display = 'block';

            var refHtml = data.referenceId ? ' <span style="font-size:0.85em; opacity:0.85;">(Ref: ' + escapeHtml(data.referenceId) + ')</span>' : '';
            var successText = document.getElementById('rc-contact-success-text');
            if (successText) {
              successText.innerHTML = 'Thank you, <strong>' + escapeHtml(name) + '</strong>!' + refHtml + '<br/>We have received your enquiry regarding <strong>' + escapeHtml(subject) + '</strong>. Our team will review your message and get back to you shortly.';
            }

            // Reset form for privacy
            if (form) form.reset();
          } else {
            showCaptchaError('rc-contact', data.error || 'Unable to submit your message right now. Please try again.');
          }
        })
        .catch(function () {
          if (btn) { btn.disabled = false; if (btnSpan) btnSpan.textContent = originalBtnText; }
          if (formView) formView.style.display = 'none';
          var successView = document.getElementById('rc-contact-success-view');
          if (successView) successView.style.display = 'block';
        });
    });
  }

  function initDropdownNavigation() {
    document.querySelectorAll('.rc-nav-dropdown').forEach(function (dropdown) {
      var toggle = dropdown.querySelector('.navbar-dropdown_toggle');
      if (!toggle) return;

      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = dropdown.classList.contains('is-open');
        document.querySelectorAll('.rc-nav-dropdown').forEach(function (d) {
          d.classList.remove('is-open');
          var t = d.querySelector('.navbar-dropdown_toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          dropdown.classList.add('is-open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.rc-nav-dropdown')) {
        document.querySelectorAll('.rc-nav-dropdown').forEach(function (d) {
          d.classList.remove('is-open');
          var toggle = d.querySelector('.navbar-dropdown_toggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
      }
    });

    document.querySelectorAll('.rc-dropdown-link').forEach(function (link) {
      link.addEventListener('click', function () {
        document.querySelectorAll('.rc-nav-dropdown').forEach(function (d) {
          d.classList.remove('is-open');
        });
        var navMenu = document.querySelector('.navbar_menu.w-nav-menu');
        var navButton = document.querySelector('.navbar-toggler-button.w-nav-button');
        if (navMenu && (navMenu.classList.contains('w--nav-menu-open') || navMenu.style.display !== 'none')) {
          if (navButton) navButton.click();
        }
      });
    });
  }

  // Proactively init on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initBookingModals();
      initFloatingActionButtons();
      initTestimonialAutoRotation();
      initContactForm();
      initDropdownNavigation();
    });
  } else {
    initBookingModals();
    initFloatingActionButtons();
    initTestimonialAutoRotation();
    initContactForm();
    initDropdownNavigation();
  }
})();
