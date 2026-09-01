/**
 * api/contact.js
 * Hardened Production Endpoint for Contact Form Enquiries
 * 
 * Security Pipeline:
 * 1. HTTP Method Check (POST only -> 405)
 * 2. Content-Type Check (application/json -> 400)
 * 3. Rate Limiting Check (5 requests / 15 min per IP -> 429)
 * 4. Honeypot & Bot Timing Check
 * 5. Zod Schema Validation & Input Sanitization
 * 6. Server-Side Google reCAPTCHA v3 Verification
 * 7. 60s Sliding-Window Duplicate Deduplication
 * 8. Safe Persistence & Notification
 * 9. Sanitized Response
 */

import { contactPayloadSchema } from '../lib/security/schemas.js';
import { sanitizeText, maskPhone, maskName } from '../lib/security/sanitize.js';
import { formRateLimiter } from '../lib/security/rateLimiter.js';
import { verifyRecaptcha } from '../lib/verifyRecaptcha.js';
import { generateReferenceId, checkDuplicateSubmission, saveBookingRecord, updateNotificationStatus } from '../lib/storage/bookings.js';
import { sendCallbackWhatsAppNotification } from '../lib/notifications/whatsapp.js';

export default async function handler(req, res) {
  // 1. HTTP Method Enforcement
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // 2. Content-Type Enforcement
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('application/json')) {
    return res.status(400).json({ success: false, error: 'Invalid Content-Type. Expected application/json' });
  }

  // 3. Rate Limiting (5 requests per 15 minutes per IP)
  const rateLimit = formRateLimiter.check(req);
  res.setHeader('X-RateLimit-Limit', '5');
  res.setHeader('X-RateLimit-Remaining', String(rateLimit.remaining));
  res.setHeader('X-RateLimit-Reset', String(rateLimit.resetTime));

  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.resetTime));
    return res.status(429).json({
      success: false,
      error: 'Too many requests. For your security, please wait a few minutes before trying again.'
    });
  }

  try {
    const rawBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    // 4. Honeypot & Bot Timing Defense
    if (rawBody.clinic_hp || rawBody.website_hp) {
      console.warn('[Security Alert] Honeypot triggered on contact form');
      return res.status(400).json({ success: false, error: 'Submission rejected' });
    }

    if (rawBody._timer && typeof rawBody._timer === 'number') {
      const durationMs = Date.now() - rawBody._timer;
      if (durationMs < 1200) {
        console.warn('[Security Alert] Automated bot timing detected on contact form');
        return res.status(400).json({ success: false, error: 'Submission rejected' });
      }
    }

    // 5. Zod Schema Validation
    const parseResult = contactPayloadSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || 'Invalid input data';
      return res.status(400).json({ success: false, error: firstError });
    }

    const validData = parseResult.data;
    const remoteIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';

    // Sanitize validated fields
    const cleanName = sanitizeText(validData.name, 100);
    const cleanPhone = sanitizeText(validData.phone, 20);
    const cleanEmail = sanitizeText(validData.email || '', 150);
    const cleanSubject = sanitizeText(validData.subject || 'General Enquiry', 150);
    const cleanMessage = sanitizeText(validData.message || '', 2000);

    // 6. Server-Side Google reCAPTCHA Verification
    const captchaResult = await verifyRecaptcha(validData.token, remoteIp);
    if (!captchaResult.success) {
      return res.status(400).json({
        success: false,
        error: captchaResult.error || 'Security verification failed. Please refresh and try again.'
      });
    }

    // 7. Duplicate Submission Check (60s sliding window)
    const duplicate = checkDuplicateSubmission({ type: 'contact', name: cleanName, phone: cleanPhone });
    if (duplicate) {
      return res.status(200).json({
        success: true,
        referenceId: duplicate.referenceId,
        isDuplicate: true,
        message: 'Your message has already been received. Our team will contact you shortly.'
      });
    }

    // 8. Save Record (Save-Before-Send)
    const referenceId = generateReferenceId('contact');
    const contactRecord = {
      referenceId,
      type: 'contact',
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      reason: cleanSubject,
      message: cleanMessage,
      ip: remoteIp,
      whatsappStatus: 'pending'
    };

    saveBookingRecord(contactRecord);
    console.log(`[Contact API] Message received (${referenceId}) from ${maskName(cleanName)} (${maskPhone(cleanPhone)})`);

    // 9. Automatic WhatsApp Notification to Clinic/Doctor
    try {
      const waResult = await sendCallbackWhatsAppNotification(contactRecord);
      const status = waResult.success ? 'sent' : 'failed';
      updateNotificationStatus(referenceId, status, waResult.results);
    } catch (waErr) {
      console.error('[Contact API] Notification dispatch error');
      updateNotificationStatus(referenceId, 'failed', [{ error: 'Notification delivery failed' }]);
    }

    // 10. Sanitized Success Response
    return res.status(200).json({
      success: true,
      referenceId: referenceId,
      message: 'Thank you for reaching out. Your enquiry has been received and our team will get in touch shortly.'
    });

  } catch (err) {
    console.error('[Contact API Error] Unhandled exception occurred');
    return res.status(500).json({
      success: false,
      error: 'Unable to process your message right now. Please try again or contact our clinic directly.'
    });
  }
}
