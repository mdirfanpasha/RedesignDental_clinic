/**
 * lib/notifications/whatsapp.js
 * Meta WhatsApp Business Cloud API Integration Service
 * 
 * Automatically sends WhatsApp notifications to the clinic/doctor when a patient
 * submits an Appointment or Callback request.
 * 
 * Complies with official Meta WhatsApp Business Platform specifications.
 */

/**
 * Normalizes phone numbers safely.
 * Handles Indian numbers (10 digits -> 91XXXXXXXXXX) and international numbers.
 * 
 * @param {string} phone 
 * @returns {string} Clean numeric phone string with country code (e.g. "917780245307")
 */
export function normalizePhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') return '';
  
  // Remove all non-digits except a leading +
  let cleaned = phone.trim().replace(/[^\d+]/g, '');
  
  // If starts with +, remove + for WhatsApp API format
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  
  // Remove leading 0 if present
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }
  
  // If 10-digit number (standard Indian mobile without country code), prepend 91
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    cleaned = '91' + cleaned;
  }
  
  return cleaned;
}

/**
 * Gets configured notification recipient numbers for the clinic.
 * Supports primary number (WHATSAPP_NOTIFY_NUMBER) or multiple numbers (WHATSAPP_NOTIFY_NUMBERS).
 * 
 * @returns {string[]} List of recipient phone numbers with country codes
 */
export function getNotifyRecipients() {
  const recipients = [];
  
  // Primary recipient
  const primary = process.env.WHATSAPP_NOTIFY_NUMBER || '918639055447';
  if (primary) {
    const norm = normalizePhoneNumber(primary);
    if (norm && !recipients.includes(norm)) recipients.push(norm);
  }
  
  // Multiple recipients if configured (comma-separated or JSON array)
  const multiple = process.env.WHATSAPP_NOTIFY_NUMBERS;
  if (multiple) {
    try {
      if (multiple.startsWith('[')) {
        const arr = JSON.parse(multiple);
        arr.forEach(num => {
          const norm = normalizePhoneNumber(String(num));
          if (norm && !recipients.includes(norm)) recipients.push(norm);
        });
      } else {
        multiple.split(',').forEach(num => {
          const norm = normalizePhoneNumber(num.trim());
          if (norm && !recipients.includes(norm)) recipients.push(norm);
        });
      }
    } catch (e) {
      console.warn('[WhatsApp] Failed to parse WHATSAPP_NOTIFY_NUMBERS config:', e.message);
    }
  }
  
  return recipients.length > 0 ? recipients : ['918639055447'];
}

/**
 * Core function to send a message via Meta WhatsApp Business Cloud API.
 * 
 * @param {Object} params
 * @param {string} params.to - Recipient phone number with country code
 * @param {string} [params.text] - Plain text message body
 * @param {Object} [params.template] - Meta approved template payload if required
 * @returns {Promise<{ success: boolean, messageId?: string, status: string, error?: string }>}
 */
export async function sendWhatsAppMessage({ to, text, template }) {
  const enabled = process.env.WHATSAPP_ENABLED !== 'false';
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const apiVersion = process.env.WHATSAPP_API_VERSION || 'v20.0';

  const recipient = normalizePhoneNumber(to);
  if (!recipient) {
    return { success: false, status: 'invalid_recipient', error: 'Invalid recipient phone number' };
  }

  // Development / Mock mode when credentials are not configured or WHATSAPP_ENABLED=false
  if (!enabled || !accessToken || !phoneNumberId) {
    const mockId = `MOCK-WA-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    console.log(`[WhatsApp Mock] Notification simulated for ${recipient}:`);
    console.log(text || JSON.stringify(template, null, 2));
    return {
      success: true,
      messageId: mockId,
      status: 'simulated_dev_mode',
      note: 'To send live messages, configure WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in environment variables.'
    };
  }

  // Build Meta Cloud API payload
  let payload;
  if (template) {
    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipient,
      type: 'template',
      template: template
    };
  } else {
    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipient,
      type: 'text',
      text: {
        preview_url: false,
        body: text
      }
    };
  }

  const endpoint = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s safety timeout

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const data = await response.json();

    if (response.ok && data.messages && data.messages.length > 0) {
      const messageId = data.messages[0].id;
      return {
        success: true,
        messageId: messageId,
        status: 'sent'
      };
    } else {
      const errorMsg = data.error ? (data.error.message || JSON.stringify(data.error)) : 'Unknown Meta API error';
      console.error('[WhatsApp Error] Meta API response failed:', errorMsg);
      return {
        success: false,
        status: 'failed',
        error: errorMsg
      };
    }
  } catch (err) {
    const isTimeout = err.name === 'AbortError';
    const errorMsg = isTimeout ? 'Meta WhatsApp API request timed out (10s)' : err.message;
    console.error('[WhatsApp Network Error]:', errorMsg);
    return {
      success: false,
      status: 'failed',
      error: errorMsg
    };
  }
}

/**
 * Sends automatic WhatsApp notification for a new APPOINTMENT booking request.
 * 
 * @param {Object} appointmentData
 * @param {string} appointmentData.referenceId - Unique booking ID (e.g. RDC-APPT-20260828-1234)
 * @param {string} appointmentData.name - Patient Full Name
 * @param {string} appointmentData.phone - Patient Phone
 * @param {string} [appointmentData.email] - Patient Email
 * @param {string} [appointmentData.reason] - Appointment reason
 * @param {string} [appointmentData.customMsg] - Additional patient message
 * @param {string} appointmentData.date - Preferred date (YYYY-MM-DD)
 * @param {string} appointmentData.time - Preferred time slot (e.g. 10:00 AM IST)
 * @returns {Promise<{ success: boolean, results: Array }>}
 */
export async function sendAppointmentWhatsAppNotification(appointmentData) {
  const recipients = getNotifyRecipients();

  // Format reason string
  let reasonText = appointmentData.reason || 'General Consultation';
  if (appointmentData.reason === 'Custom Message' && appointmentData.customMsg) {
    reasonText = `Custom: ${appointmentData.customMsg}`;
  } else if (!appointmentData.reason) {
    reasonText = 'Not specified';
  }

  const patientEmail = appointmentData.email ? appointmentData.email : 'Not provided';
  const bookingDate = appointmentData.date || 'To be scheduled';
  const bookingTime = appointmentData.time || 'To be scheduled';

  // Professional notification message body
  const messageBody = [
    '🦷 *NEW APPOINTMENT REQUEST*',
    '',
    `*Reference:* ${appointmentData.referenceId}`,
    `*Patient:* ${appointmentData.name}`,
    `*Phone:* ${appointmentData.phone}`,
    `*Email:* ${patientEmail}`,
    `*Reason:* ${reasonText}`,
    `*Date:* ${bookingDate}`,
    `*Time:* ${bookingTime}`,
    '',
    'Please review and contact the patient to confirm availability.',
    '',
    '_Redesign Dental Clinics — Banjara Hills, Hyderabad_'
  ].join('\n');

  const results = [];
  for (const recipient of recipients) {
    // Step 1: Send hello_world template to open the conversation window
    const templateResult = await sendWhatsAppMessage({
      to: recipient,
      template: {
        name: 'hello_world',
        language: { code: 'en_US' }
      }
    });
    console.log(`[WhatsApp] Template sent to ${recipient}:`, JSON.stringify(templateResult));

    // Step 2: Send the actual booking details as a text message
    const textResult = await sendWhatsAppMessage({
      to: recipient,
      text: messageBody
    });
    console.log(`[WhatsApp] Appointment details sent to ${recipient}:`, JSON.stringify(textResult));

    results.push({ recipient, template: templateResult, details: textResult, success: textResult.success || templateResult.success });
  }

  const overallSuccess = results.some(r => r.success);
  return {
    success: overallSuccess,
    results: results
  };
}

/**
 * Sends automatic WhatsApp notification for a new CALLBACK request.
 * 
 * @param {Object} callbackData
 * @param {string} callbackData.referenceId - Unique request ID (e.g. RDC-CALL-20260828-1234)
 * @param {string} callbackData.name - Patient Full Name
 * @param {string} callbackData.phone - Patient Phone
 * @param {string} [callbackData.email] - Patient Email
 * @param {string} [callbackData.reason] - Subject / Reason if provided
 * @param {string} [callbackData.preferredTime] - Preferred callback window if provided
 * @param {string} [callbackData.message] - Additional enquiry message if provided
 * @returns {Promise<{ success: boolean, results: Array }>}
 */
export async function sendCallbackWhatsAppNotification(callbackData) {
  const recipients = getNotifyRecipients();

  const patientEmail = callbackData.email ? callbackData.email : 'Not provided';
  const reasonText = callbackData.reason || callbackData.subject || 'General Dental Enquiry';
  const callbackTime = callbackData.preferredTime || 'As soon as possible';

  const messageBody = [
    '📞 *NEW CALLBACK REQUEST*',
    '',
    `*Reference:* ${callbackData.referenceId}`,
    `*Patient:* ${callbackData.name}`,
    `*Phone:* ${callbackData.phone}`,
    `*Email:* ${patientEmail}`,
    `*Reason:* ${reasonText}`,
    `*Preferred Callback:* ${callbackTime}`,
    callbackData.message ? `*Message:* ${callbackData.message}` : '',
    '',
    'Please contact the patient as soon as possible.',
    '',
    '_Redesign Dental Clinics — Banjara Hills, Hyderabad_'
  ].filter(Boolean).join('\n');

  const results = [];
  for (const recipient of recipients) {
    // Step 1: Send hello_world template to open the conversation window
    const templateResult = await sendWhatsAppMessage({
      to: recipient,
      template: {
        name: 'hello_world',
        language: { code: 'en_US' }
      }
    });
    console.log(`[WhatsApp] Template sent to ${recipient}:`, JSON.stringify(templateResult));

    // Step 2: Send the actual callback details as a text message
    const textResult = await sendWhatsAppMessage({
      to: recipient,
      text: messageBody
    });
    console.log(`[WhatsApp] Callback details sent to ${recipient}:`, JSON.stringify(textResult));

    results.push({ recipient, template: templateResult, details: textResult, success: textResult.success || templateResult.success });
  }

  const overallSuccess = results.some(r => r.success);
  return {
    success: overallSuccess,
    results: results
  };
}
