/**
 * Server-side Google reCAPTCHA v3 Verification Helper (TypeScript)
 */

export interface RecaptchaVerifyResult {
  success: boolean;
  score?: number;
  action?: string;
  error?: string;
  data?: any;
}

export async function verifyRecaptcha(
  token: string,
  remoteIp?: string
): Promise<RecaptchaVerifyResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LdkaZQtAAAAAN1Rv3rzeOLVDW-UBaQorE1VgReS';

  if (!token || typeof token !== 'string' || !token.trim()) {
    return {
      success: false,
      error: 'Missing CAPTCHA token'
    };
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
        ? data['error-codes'].join(', ')
        : 'reCAPTCHA verification failed';
      return {
        success: false,
        error: errorCodes,
        data: data
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: 'reCAPTCHA service verification error: ' + (err.message || 'Connection failed')
    };
  }
}
