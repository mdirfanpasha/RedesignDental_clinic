/**
 * Reusable Google reCAPTCHA v3 Helper for Booking Forms (TypeScript)
 */

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY?: string;
    RecaptchaWidget?: any;
  }
}

export interface RecaptchaWidgetOptions {
  onRendered?: () => void;
}

let isScriptLoading = false;
const loadCallbacks: Array<(err?: Error) => void> = [];

export function getSiteKey(): string {
  if (typeof window !== 'undefined' && window.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    return window.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  }
  return '6LdkaZQtAAAAAlkSLA78ABt5Xeo0EgbfLbeqHZWu';
}

export function loadRecaptchaScript(callback?: (err?: Error) => void): void {
  if (typeof window === 'undefined') return;

  const siteKey = getSiteKey();
  if (window.grecaptcha && typeof window.grecaptcha.execute === 'function') {
    if (callback) callback();
    return;
  }

  if (callback) loadCallbacks.push(callback);

  if (isScriptLoading) return;

  const existingScript = document.querySelector('script[src*="recaptcha/api.js"]');
  if (!existingScript) {
    isScriptLoading = true;
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      isScriptLoading = false;
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          while (loadCallbacks.length > 0) {
            const cb = loadCallbacks.shift();
            try { cb?.(); } catch (e) { console.warn(e); }
          }
        });
      }
    };
    script.onerror = () => {
      isScriptLoading = false;
      console.warn('Google reCAPTCHA v3 failed to load.');
      while (loadCallbacks.length > 0) {
        const cb = loadCallbacks.shift();
        try { cb?.(new Error('Failed to load reCAPTCHA script')); } catch (e) {}
      }
    };
    document.head.appendChild(script);
  } else {
    const checkInterval = setInterval(() => {
      if (window.grecaptcha && typeof window.grecaptcha.execute === 'function') {
        clearInterval(checkInterval);
        while (loadCallbacks.length > 0) {
          const cb = loadCallbacks.shift();
          try { cb?.(); } catch (e) {}
        }
      }
    }, 50);
  }
}

export function getRecaptchaToken(action: string = 'submit'): Promise<string> {
  return new Promise((resolve, reject) => {
    const siteKey = getSiteKey();
    loadRecaptchaScript((err) => {
      if (err) return reject(err);
      if (!window.grecaptcha || typeof window.grecaptcha.execute !== 'function') {
        return reject(new Error('Google reCAPTCHA is not available'));
      }
      try {
        window.grecaptcha.ready(() => {
          window.grecaptcha!.execute(siteKey, { action })
            .then((token: string) => resolve(token))
            .catch((error: any) => reject(error));
        });
      } catch (e) {
        reject(e);
      }
    });
  });
}

export function renderRecaptchaWidget(
  containerId: string | HTMLElement,
  options: RecaptchaWidgetOptions = {}
): void {
  if (typeof window === 'undefined') return;

  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
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

export function resetRecaptchaWidget(containerId: string | HTMLElement): void {
  if (typeof window === 'undefined') return;
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (container) {
    renderRecaptchaWidget(container);
  }
}
