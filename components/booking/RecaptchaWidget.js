/**
 * Reusable Google reCAPTCHA v3 Helper for Booking Forms
 * Handles dynamic script insertion with render=SITE_KEY, token execution, and UI trust badges.
 */

(function (global) {
  'use strict';

  var isScriptLoading = false;
  var loadCallbacks = [];

  function getSiteKey() {
    return (typeof window !== 'undefined' && window.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) || '6LdkaZQtAAAAAlkSLA78ABt5Xeo0EgbfLbeqHZWu';
  }

  function loadRecaptchaScript(callback) {
    var siteKey = getSiteKey();
    if (typeof window !== 'undefined' && window.grecaptcha && typeof window.grecaptcha.execute === 'function') {
      if (callback) callback();
      return;
    }

    if (callback) loadCallbacks.push(callback);

    if (isScriptLoading) return;

    if (typeof document === 'undefined') return;

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
        console.warn('Google reCAPTCHA v3 script failed to load.');
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
      loadRecaptchaScript(function (err) {
        if (err) return reject(err);
        if (!window.grecaptcha || typeof window.grecaptcha.execute !== 'function') {
          return reject(new Error('Google reCAPTCHA is not available'));
        }
        try {
          window.grecaptcha.ready(function () {
            window.grecaptcha.execute(siteKey, { action: action || 'submit' })
              .then(function (token) {
                resolve(token);
              })
              .catch(function (error) {
                reject(error);
              });
          });
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  function renderWidget(containerId, options) {
    if (typeof document === 'undefined') return;
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

    loadRecaptchaScript();
    if (options && options.onRendered) options.onRendered();
  }

  function resetWidget(containerId) {
    if (typeof document === 'undefined') return;
    var container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (container) {
      renderWidget(container);
    }
  }

  global.RecaptchaWidget = {
    loadScript: loadRecaptchaScript,
    execute: execute,
    getToken: execute,
    render: renderWidget,
    reset: resetWidget,
    getSiteKey: getSiteKey
  };
})(typeof window !== 'undefined' ? window : this);
