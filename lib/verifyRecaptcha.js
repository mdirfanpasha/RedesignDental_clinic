/**
 * Server-side Google reCAPTCHA Verification Helper
 * Secures secret key execution exclusively on the server.
 */

export async function verifyRecaptcha(token, remoteIp) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LeJ8IUtAAAAADF_Rq1_DioL2GwXakHhQQ7xZcs-';

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
      return {
        success: true,
        data: data
      };
    } else {
      return {
        success: false,
        error: 'reCAPTCHA verification failed',
        data: data
      };
    }
  } catch (err) {
    return {
      success: false,
      error: 'reCAPTCHA service verification error'
    };
  }
}
