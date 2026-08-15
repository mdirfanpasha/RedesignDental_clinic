/**
 * Server-side Cloudflare Turnstile Verification Helper
 * Secures secret key execution exclusively on the server.
 */

export async function verifyTurnstile(token, remoteIp) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';

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

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
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
        error: 'Turnstile verification failed',
        data: data
      };
    }
  } catch (err) {
    return {
      success: false,
      error: 'Turnstile service verification error'
    };
  }
}
