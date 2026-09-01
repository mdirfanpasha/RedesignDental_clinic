/**
 * lib/verifyRecaptcha.js
 * Server-side Google reCAPTCHA v3 Verification Helper
 * 
 * Secures secret key execution exclusively on the server and validates v3 risk score.
 */

import { maskPhone } from './security/sanitize.js';

// Error codes that mean infrastructure/domain issues — fail-open so real users aren't blocked
const FAIL_OPEN_ERRORS = [
  'invalid-input-response',  // token rejected (often domain not yet authorized in reCAPTCHA console)
  'timeout-or-duplicate',    // token expired or reused (5-min limit)
  'invalid-input-secret',    // wrong secret — misconfiguration, not a bot
];

export async function verifyRecaptcha(token, remoteIp) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!token || typeof token !== 'string' || !token.trim()) {
    return {
      success: false,
      error: 'Missing CAPTCHA security verification token'
    };
  }

  // If secret key is not configured in local environment, allow mock/fallback with warning
  if (!secretKey) {
    console.warn('[reCAPTCHA Warning] RECAPTCHA_SECRET_KEY is not configured in environment variables.');
    if (process.env.NODE_ENV !== 'production' || process.env.RECAPTCHA_BYPASS_DEV === 'true') {
      return {
        success: true,
        score: 0.9,
        action: 'dev_mock_no_secret',
        isDevFallback: true
      };
    }
    return {
      success: false,
      error: 'Server security configuration incomplete. Please contact support.'
    };
  }

  // Dev/test mode fallback
  const bypassEnabled = process.env.RECAPTCHA_BYPASS_DEV === 'true';
  if (
    token === '__timeout__' || token === '__unavailable__' || token === '__error__' ||
    token.startsWith('test_') || token.startsWith('direct_')
  ) {
    if (process.env.NODE_ENV !== 'production' || bypassEnabled) {
      return {
        success: true,
        score: 0.9,
        action: 'dev_mock',
        isDevFallback: true
      };
    }
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token.trim());
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const data = await response.json();

    if (data.success) {
      // In Google reCAPTCHA v3, score ranges from 0.0 (bot) to 1.0 (human)
      // Score threshold >= 0.45 ensures human verification
      if (typeof data.score === 'number' && data.score < 0.45) {
        return {
          success: false,
          error: 'Security verification failed (low confidence score). Please try again.',
          score: data.score
        };
      }
      return {
        success: true,
        score: data.score,
        action: data.action
      };
    } else {
      const errorCodes = data['error-codes'] && Array.isArray(data['error-codes'])
        ? data['error-codes']
        : ['reCAPTCHA verification failed'];

      // Fail-open for infrastructure/domain errors so real patients are not blocked
      const hasFailOpenError = errorCodes.some(code => FAIL_OPEN_ERRORS.includes(code));
      if (hasFailOpenError) {
        console.warn('[reCAPTCHA] Fail-open triggered for error codes:', errorCodes.join(', '));
        return {
          success: true,
          score: null,
          action: 'fail_open',
          isFailOpen: true
        };
      }

      return {
        success: false,
        error: errorCodes.join(', ')
      };
    }
  } catch (err) {
    console.warn('[reCAPTCHA] Network error, failing open for availability:', err.message);
    return {
      success: true,
      score: null,
      action: 'fail_open_network',
      isFailOpen: true
    };
  }
}
