/**
 * lib/security/rateLimiter.js
 * In-Memory Sliding-Window IP Rate Limiter
 * 
 * Protects sensitive endpoints (Appointments, Callbacks, Contact, CAPTCHA verification)
 * against brute-force, automated spam, and Denial of Service (DoS) attacks.
 */

class RateLimiter {
  /**
   * @param {Object} options
   * @param {number} options.windowMs - Time window in milliseconds (default: 15 minutes = 900,000ms)
   * @param {number} options.max - Maximum allowed requests per IP within the window (default: 5)
   * @param {string} [options.name] - Identifier for logging
   */
  constructor({ windowMs = 15 * 60 * 1000, max = 5, name = 'default' } = {}) {
    this.windowMs = windowMs;
    this.max = max;
    this.name = name;
    this.hits = new Map();

    // Auto cleanup stale records every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000).unref();
  }

  /**
   * Normalizes client IP from request headers or socket.
   * @param {Object} req 
   * @returns {string} Clean client IP
   */
  getClientIp(req) {
    if (!req) return '127.0.0.1';
    const forwarded = req.headers?.['x-forwarded-for'];
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    const realIp = req.headers?.['x-real-ip'];
    if (realIp) return realIp.trim();
    return req.socket?.remoteAddress || req.connection?.remoteAddress || '127.0.0.1';
  }

  /**
   * Checks if an IP is allowed to make a request.
   * @param {string|Object} ipOrReq - Client IP or request object
   * @returns {{ allowed: boolean, remaining: number, resetTime: number, total: number }}
   */
  check(ipOrReq) {
    const ip = typeof ipOrReq === 'string' ? ipOrReq : this.getClientIp(ipOrReq);
    const now = Date.now();
    const timestamps = this.hits.get(ip) || [];

    // Filter timestamps within the current sliding window
    const validTimestamps = timestamps.filter(ts => now - ts < this.windowMs);

    if (validTimestamps.length >= this.max) {
      const oldest = validTimestamps[0];
      const resetTime = Math.ceil((oldest + this.windowMs - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        resetTime: Math.max(1, resetTime),
        total: validTimestamps.length
      };
    }

    validTimestamps.push(now);
    this.hits.set(ip, validTimestamps);

    return {
      allowed: true,
      remaining: this.max - validTimestamps.length,
      resetTime: Math.ceil(this.windowMs / 1000),
      total: validTimestamps.length
    };
  }

  /**
   * Cleans up expired entries from memory.
   */
  cleanup() {
    const now = Date.now();
    for (const [ip, timestamps] of this.hits.entries()) {
      const valid = timestamps.filter(ts => now - ts < this.windowMs);
      if (valid.length === 0) {
        this.hits.delete(ip);
      } else {
        this.hits.set(ip, valid);
      }
    }
  }

  /**
   * Resets rate limit for a specific IP (useful for testing).
   * @param {string} ip 
   */
  reset(ip) {
    if (ip) {
      this.hits.delete(ip);
    } else {
      this.hits.clear();
    }
  }
}

// Pre-configured rate limiters
// 1. Strict form submission limiter: 5 submissions per 15 minutes per IP
export const formRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  name: 'forms'
});

// 2. CAPTCHA verification limiter: 25 calls per 15 minutes per IP
export const captchaRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 25,
  name: 'captcha'
});

// 3. General API limiter: 60 calls per minute per IP
export const generalApiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  max: 60,
  name: 'general_api'
});
