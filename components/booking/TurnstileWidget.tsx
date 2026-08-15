/**
 * Reusable Turnstile Widget Helper for Booking Forms (TypeScript)
 */

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string;
    TurnstileWidget?: any;
  }
}

export interface TurnstileWidgetOptions {
  theme?: 'light' | 'dark' | 'auto';
  onSuccess?: (token: string) => void;
  onExpire?: () => void;
  onError?: (error?: any) => void;
  onRendered?: (widgetId: string) => void;
}

export function getSiteKey(): string {
  if (typeof window !== 'undefined' && window.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    return window.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  }
  return '1x00000000000000000000AA';
}

export function loadTurnstileScript(callback?: () => void): void {
  if (typeof window === 'undefined') return;

  if (window.turnstile) {
    if (callback) callback();
    return;
  }

  if (document.querySelector('script[src*="turnstile/v0/api.js"]')) {
    const checkInterval = setInterval(() => {
      if (window.turnstile) {
        clearInterval(checkInterval);
        if (callback) callback();
      }
    }, 100);
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  script.async = true;
  script.defer = true;
  script.onload = () => {
    if (callback) callback();
  };
  document.head.appendChild(script);
}

export function renderTurnstileWidget(
  containerId: string | HTMLElement,
  options: TurnstileWidgetOptions = {}
): void {
  if (typeof window === 'undefined') return;

  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  container.innerHTML = '';

  loadTurnstileScript(() => {
    if (!window.turnstile) return;

    const siteKey = getSiteKey();
    const widgetId = window.turnstile.render(container, {
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
  });
}

export function resetTurnstileWidget(containerId: string | HTMLElement): void {
  if (typeof window === 'undefined') return;

  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  const widgetId = container.getAttribute('data-widget-id');
  if (window.turnstile && widgetId !== null && widgetId !== undefined) {
    try {
      window.turnstile.reset(widgetId);
    } catch (e) {
      renderTurnstileWidget(containerId);
    }
  }
}
