import { verifyRecaptcha } from '../lib/verifyRecaptcha.js';
import { captchaRateLimiter } from '../lib/security/rateLimiter.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Rate Limiting (25 requests per 15 min per IP)
  const rateLimit = captchaRateLimiter.check(req);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.resetTime));
    return res.status(429).json({ success: false, error: 'Too many verification attempts. Please try again later.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const token = body.token;
    const remoteIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;

    const result = await verifyRecaptcha(token, remoteIp);

    if (result.success) {
      return res.status(200).json({ success: true, message: 'reCAPTCHA verified successfully' });
    } else {
      return res.status(400).json({ success: false, error: result.error || 'reCAPTCHA verification failed' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Internal server error during verification' });
  }
}
