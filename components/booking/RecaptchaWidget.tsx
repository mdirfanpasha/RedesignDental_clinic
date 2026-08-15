/**
 * Reusable Google reCAPTCHA Widget Helper for Booking Forms (TypeScript)
 */

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
    };
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY?: string;
    RecaptchaWidget?: any;
    onloadRecaptchaCallback?: () => void;
  }
}

export interface RecaptchaWidgetOptions {
  theme?: 'light' | 'dark';
  onSuccess?: (token: string) => void;
  onExpire?: () => void;
  onError?: (error?: any) => void;
  onRendered?: (widgetId: string) => void;
}

export function getSiteKey(): string {
  if (typeof window !== 'undefined' && window.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    return window.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  }
  return '6LeJ8IUtAAAAAExYajJHCjhaksT0ipqyEP3F3pId';
}

export function loadRecaptchaScript(callback?: () => void): void {
  if (typeof window === 'undefined') return;

  if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
    if (callback) callback();
    return;
  }

  const existingScript = document.querySelector('script[src*="recaptcha/api.js"]');
  if (!existingScript) {
    window.onloadRecaptchaCallback = () => {
      if (callback) callback();
    };
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onloadRecaptchaCallback&render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  const checkInterval = setInterval(() => {
    if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
      clearInterval(checkInterval);
      if (callback) callback();
    }
  }, 50);
}

export function renderRecaptchaWidget(
  containerId: string | HTMLElement,
  options: RecaptchaWidgetOptions = {}
): void {
  if (typeof window === 'undefined') return;

  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  container.innerHTML = '';

  loadRecaptchaScript(() => {
    if (!window.grecaptcha || typeof window.grecaptcha.render !== 'function') return;

    const siteKey = getSiteKey();
    try {
      const widgetId = window.grecaptcha.render(container, {
        sitekey: siteKey,
        theme: options.theme || 'light',
        callback: (token: string) => {
          if (options.onSuccess) options.onSuccess(token);
        },
        'expired-callback': () => {
          if (options.onExpire) options.onExpire();
        },
        'error-callback': (err: any) => {
          if (options.onError) options.onError(err);
        }
      });

      container.setAttribute('data-widget-id', widgetId);
      if (options.onRendered) options.onRendered(widgetId);
    } catch (e) {
      console.error('reCAPTCHA render error:', e);
    }
  });
}

export function resetRecaptchaWidget(containerId: string | HTMLElement): void {
  if (typeof window === 'undefined') return;

  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  const widgetId = container.getAttribute('data-widget-id');
  if (window.grecaptcha && widgetId !== null && widgetId !== undefined) {
    try {
      window.grecaptcha.reset(widgetId);
    } catch (e) {
      renderRecaptchaWidget(containerId);
    }
  }
}
