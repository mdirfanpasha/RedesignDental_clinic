/**
 * api/appointments.js
 * Vercel Serverless Function & Local Endpoint for Appointment Booking
 * 
 * Flow:
 * 1. Validate HTTP POST & payload fields
 * 2. Verify Google reCAPTCHA v3 token on server
 * 3. Check duplicate submission (anti-spam / double-click protection)
 * 4. Save booking record (Safe Save-Before-Send)
 * 5. Dispatch automatic WhatsApp notification to clinic/doctor
 * 6. Return confirmed success response to client
 */

import { verifyRecaptcha } from '../lib/verifyRecaptcha.js';
import { generateReferenceId, checkDuplicateSubmission, saveBookingRecord, updateNotificationStatus } from '../lib/storage/bookings.js';
import { sendAppointmentWhatsAppNotification } from '../lib/notifications/whatsapp.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { name, phone, email, reason, customMsg, date, time, token } = body;
    const remoteIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;

    // 1. Validate Required Fields
    const trimmedName = (name || '').trim();
    const trimmedPhone = (phone || '').trim();
    const trimmedDate = (date || '').trim();
    const trimmedTime = (time || '').trim();

    if (!trimmedName || trimmedName.length < 2) {
      return res.status(400).json({ success: false, error: 'Please provide a valid full name.' });
    }
    if (!trimmedPhone || trimmedPhone.replace(/\D/g, '').length < 7) {
      return res.status(400).json({ success: false, error: 'Please provide a valid contact phone number.' });
    }
    if (!trimmedDate || !trimmedTime) {
      return res.status(400).json({ success: false, error: 'Please select your preferred appointment date and time.' });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    // 2. Server-side CAPTCHA Verification
    const captchaResult = await verifyRecaptcha(token, remoteIp);
    if (!captchaResult.success) {
      return res.status(400).json({
        success: false,
        error: captchaResult.error || 'Security verification failed. Please refresh and try again.'
      });
    }

    // 3. Duplicate Submission Check (60s sliding window)
    const duplicate = checkDuplicateSubmission({ type: 'appointment', name: trimmedName, phone: trimmedPhone });
    if (duplicate) {
      return res.status(200).json({
        success: true,
        referenceId: duplicate.referenceId,
        isDuplicate: true,
        message: 'Your appointment request has already been received. Our team will contact you shortly.'
      });
    }

    // 4. Save Booking Record (Save-Before-Send)
    const referenceId = generateReferenceId('appointment');
    const appointmentRecord = {
      referenceId,
      type: 'appointment',
      name: trimmedName,
      phone: trimmedPhone,
      email: (email || '').trim(),
      reason: reason || 'General',
      customMsg: (customMsg || '').trim(),
      date: trimmedDate,
      time: trimmedTime,
      ip: remoteIp || '',
      whatsappStatus: 'pending'
    };

    saveBookingRecord(appointmentRecord);

    // 5. Automatic WhatsApp Notification to Clinic/Doctor
    try {
      const waResult = await sendAppointmentWhatsAppNotification(appointmentRecord);
      const status = waResult.success ? 'sent' : 'failed';
      updateNotificationStatus(referenceId, status, waResult.results);
    } catch (waErr) {
      console.error('[Appointments API] WhatsApp notification exception:', waErr.message);
      updateNotificationStatus(referenceId, 'failed', [{ error: waErr.message }]);
      // Note: Do NOT fail the booking if WhatsApp fails. The booking is safely stored.
    }

    // 6. Return Success Response
    return res.status(200).json({
      success: true,
      referenceId: referenceId,
      message: 'Your appointment request has been received. Our team will contact you shortly to confirm the details.'
    });

  } catch (err) {
    console.error('[Appointments API Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to process your appointment request right now. Please try again or call our clinic directly.'
    });
  }
}
