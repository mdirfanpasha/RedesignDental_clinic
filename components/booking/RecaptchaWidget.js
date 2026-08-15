/**
 * Reusable Google reCAPTCHA Widget Helper for Booking Forms
 * Handles dynamic script insertion, explicit rendering, token callbacks, and widget resetting.
 */

(function (global) {
  'use strict';

  function loadRecaptchaScript(callback) {
    if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
      if (callback) callback();
      return;
    }

    var existingScript = document.querySelector('script[src*="recaptcha/api.js"]');
    if (!existingScript) {
      window.onloadRecaptchaCallback = function () {
        if (callback) callback();
      };
      var script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?onload=onloadRecaptchaCallback&render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    var checkInterval = setInterval(function () {
      if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        clearInterval(checkInterval);
        if (callback) callback();
      }
    }, 50);
  }

  function getSiteKey() {
    return window.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeJ8IUtAAAAAExYajJHCjhaksT0ipqyEP3F3pId';
  }

  function renderWidget(containerId, options) {
    options = options || {};
    var container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return null;

    loadRecaptchaScript(function () {
      if (!window.grecaptcha || typeof window.grecaptcha.render !== 'function') return;

      var existingWidgetId = container.getAttribute('data-widget-id');
      if (existingWidgetId !== null && existingWidgetId !== undefined && existingWidgetId !== '') {
        try {
          window.grecaptcha.reset(existingWidgetId);
          return;
        } catch (e) {
          container.innerHTML = '';
          container.removeAttribute('data-widget-id');
        }
      }

      container.innerHTML = '';
      var siteKey = getSiteKey();
      try {
        var widgetId = window.grecaptcha.render(container, {
          sitekey: siteKey,
          theme: options.theme || 'light',
          callback: function (token) {
            if (options.onSuccess) options.onSuccess(token);
          },
          'expired-callback': function () {
            if (options.onExpire) options.onExpire();
          },
          'error-callback': function (err) {
            if (options.onError) options.onError(err);
          }
        });

        container.setAttribute('data-widget-id', widgetId);
        if (options.onRendered) options.onRendered(widgetId);
      } catch (e) {
        console.warn('reCAPTCHA render note:', e);
      }
    });
  }

  function resetWidget(containerId) {
    var container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    var widgetId = container.getAttribute('data-widget-id');
    if (window.grecaptcha && widgetId !== null && widgetId !== undefined) {
      try {
        window.grecaptcha.reset(widgetId);
      } catch (e) {
        container.removeAttribute('data-widget-id');
        renderWidget(containerId);
      }
    }
  }

  global.RecaptchaWidget = {
    loadScript: loadRecaptchaScript,
    render: renderWidget,
    reset: resetWidget,
    getSiteKey: getSiteKey
  };
})(typeof window !== 'undefined' ? window : this);
