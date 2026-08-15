/**
 * Reusable Turnstile Widget Helper for Booking Forms
 * Handles dynamic script insertion, explicit rendering, token callbacks, and widget resetting.
 */

(function (global) {
  'use strict';

  function loadTurnstileScript(callback) {
    if (window.turnstile && typeof window.turnstile.render === 'function') {
      if (callback) callback();
      return;
    }

    var existingScript = document.querySelector('script[src*="turnstile/v0/api.js"]');
    if (!existingScript) {
      window.onloadTurnstileCallback = function () {
        if (callback) callback();
      };
      var script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback&render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    var checkInterval = setInterval(function () {
      if (window.turnstile && typeof window.turnstile.render === 'function') {
        clearInterval(checkInterval);
        if (callback) callback();
      }
    }, 50);
  }

  function getSiteKey() {
    return window.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';
  }

  function renderWidget(containerId, options) {
    options = options || {};
    var container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return null;

    container.innerHTML = '';

    loadTurnstileScript(function () {
      if (!window.turnstile || typeof window.turnstile.render !== 'function') return;

      var siteKey = getSiteKey();
      try {
        var widgetId = window.turnstile.render(container, {
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
        console.error('Turnstile render error:', e);
      }
    });
  }

  function resetWidget(containerId) {
    var container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    var widgetId = container.getAttribute('data-widget-id');
    if (window.turnstile && widgetId !== null && widgetId !== undefined) {
      try {
        window.turnstile.reset(widgetId);
      } catch (e) {
        renderWidget(containerId);
      }
    }
  }

  global.TurnstileWidget = {
    loadScript: loadTurnstileScript,
    render: renderWidget,
    reset: resetWidget,
    getSiteKey: getSiteKey
  };
})(typeof window !== 'undefined' ? window : this);
