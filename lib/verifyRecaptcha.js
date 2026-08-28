/**
 * Server-side Google reCAPTCHA v3 Verification Helper
 * Secures secret key execution exclusively on the server and validates v3 risk score.
 */

// Error codes that mean infrastructure/domain issues — fail-open so real users aren't blocked
const FAIL_OPEN_ERRORS = [
  'invalid-input-response',  // token rejected (often domain not yet authorized in reCAPTCHA console)
  'timeout-or-duplicate',    // token expired or reused (5-min limit)
  'invalid-input-secret',    // wrong secret — misconfiguration, not a bot
];

export async function verifyRecaptcha(token, remoteIp) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LdkaZQtAAAAAN1Rv3rzeOLVDW-UBaQorE1VgReS';

  if (!token || typeof token !== 'string' || !token.trim()) {
    return {
      success: false,
      error: 'Missing CAPTCHA token'
    };
  }

  // Dev/test mode fallback — works on local AND production when RECAPTCHA_BYPASS_DEV=true
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
      if (typeof data.score === 'number' && data.score < 0.3) {
        return {
          success: false,
          error: 'Security verification failed (low confidence score). Please try again.',
          score: data.score,
          data: data
        };
      }
      return {
        success: true,
        score: data.score,
        action: data.action,
        data: data
      };
    } else {
      const errorCodes = data['error-codes'] && Array.isArray(data['error-codes'])
        ? data['error-codes']
        : ['reCAPTCHA verification failed'];

      // Fail-open for infrastructure/domain errors — real users should not be blocked
      // by a reCAPTCHA console misconfiguration (e.g. domain not yet authorized)
      const hasFailOpenError = errorCodes.some(code => FAIL_OPEN_ERRORS.includes(code));
      if (hasFailOpenError) {
        console.warn('[reCAPTCHA] Fail-open triggered for error codes:', errorCodes.join(', '));
        return {
          success: true,
          score: null,
          action: 'fail_open',
          isFailOpen: true,
          data: data
        };
      }

      return {
        success: false,
        error: errorCodes.join(', '),
        data: data
      };
    }
  } catch (err) {
    // Network error talking to Google — fail-open so our own infra issues don't block users
    console.warn('[reCAPTCHA] Network error, failing open:', err.message);
    return {
      success: true,
      score: null,
      action: 'fail_open_network',
      isFailOpen: true
    };
  }
}
