/**
 * Redesign Dental Clinics — Central WhatsApp Configuration & Helper Module
 * Target WhatsApp Number: 8179738737 (International: +91 8179738737, Clean: 918179738737)
 */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '918179738737';
  var DISPLAY_NUMBER = '+91 81797-38737';

  window.whatsappConfig = {
    clinicNumber: WHATSAPP_NUMBER,
    rawNumber: '8179738737',
    displayNumber: DISPLAY_NUMBER,
    internationalNumber: '+91 8179738737'
  };

  window.CLINIC_WHATSAPP_NUMBER = WHATSAPP_NUMBER;

  function sanitizeInput(str) {
    if (str === null || str === undefined) return '';
    return String(str).trim();
  }

  function buildAppointmentMessage(data) {
    var name = sanitizeInput(data.name);
    var phone = sanitizeInput(data.phone);
    var email = sanitizeInput(data.email);
    var date = sanitizeInput(data.date);
    var time = sanitizeInput(data.timeSlot || data.time);
    var doctor = sanitizeInput(data.doctor);
    var service = sanitizeInput(data.service || data.reason);
    var reason = sanitizeInput(data.reason);
    var additional = sanitizeInput(data.additionalMsg || data.additional || data.customMsg || data.notes);

    var lines = [
      'Hello Redesign Dental Clinics 👋',
      '',
      'I would like to request a dental appointment.',
      '',
      '📋 PATIENT DETAILS',
      '',
      '👤 Name: ' + (name || 'Not provided'),
      '',
      '📱 Mobile Number: ' + (phone || 'Not provided')
    ];

    if (email && email !== 'Not provided') {
      lines.push('', '📧 Email: ' + email);
    }

    if (date) {
      lines.push('', '📅 Preferred Date: ' + date);
    }

    if (time) {
      lines.push('', '⏰ Preferred Time: ' + time);
    }

    if (doctor) {
      lines.push('', '👨‍⚕️ Preferred Doctor: ' + doctor);
    }

    if (service) {
      lines.push('', '🦷 Service Required: ' + service);
    }

    if (reason && reason !== service && reason !== 'Not provided') {
      lines.push('', '📌 Reason: ' + reason);
    }

    if (additional && additional !== 'Not provided') {
      lines.push('', '💬 Additional Concern: ' + additional);
    }

    lines.push(
      '',
      'Please let me know about the availability of my preferred appointment slot.',
      '',
      'Thank you!'
    );

    return lines.join('\n');
  }

  function buildCallbackMessage(data) {
    var name = sanitizeInput(data.name);
    var phone = sanitizeInput(data.phone);

    var lines = [
      'Hello Redesign Dental Clinics 👋',
      '',
      'I would like to request a callback.',
      '',
      '📋 MY DETAILS',
      '',
      '👤 Name: ' + (name || 'Not provided'),
      '',
      '📱 Mobile Number: ' + (phone || 'Not provided'),
      '',
      'Please contact me regarding a dental consultation.',
      '',
      'Thank you!'
    ];

    return lines.join('\n');
  }

  function generateWhatsAppUrl(messageText) {
    var encodedMessage = encodeURIComponent(messageText || '');
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodedMessage;
  }

  function openWhatsApp(messageText) {
    var url = generateWhatsAppUrl(messageText);
    try {
      var win = window.open(url, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = url;
      }
    } catch (e) {
      window.location.href = url;
    }
  }

  window.RedesignWhatsApp = {
    config: window.whatsappConfig,
    buildAppointmentMessage: buildAppointmentMessage,
    buildCallbackMessage: buildCallbackMessage,
    generateWhatsAppUrl: generateWhatsAppUrl,
    openWhatsApp: openWhatsApp
  };
})();
