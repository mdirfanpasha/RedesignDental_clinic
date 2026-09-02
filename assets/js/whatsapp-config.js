/**
 * Redesign Dental Clinics — Temporary WhatsApp Appointment & Lead Generation System
 * Centralized Configuration and Utility Module
 */

(function () {
  'use strict';

  var whatsappConfig = {
    clinicNumber: '917780245307',
    clinicName: 'Redesign Dental Clinics'
  };

  // Expose configuration globally
  window.whatsappConfig = whatsappConfig;
  window.CLINIC_WHATSAPP_NUMBER = whatsappConfig.clinicNumber;

  /**
   * Helper function to sanitize user input strings for safety
   */
  function sanitizeInput(str) {
    if (str === null || str === undefined) return '';
    return String(str).trim();
  }

  /**
   * Format Appointment Booking WhatsApp Message
   */
  function buildAppointmentMessage(data) {
    var name = sanitizeInput(data.name);
    var phone = sanitizeInput(data.phone);
    var email = sanitizeInput(data.email);
    var date = sanitizeInput(data.date);
    var time = sanitizeInput(data.time);
    var service = sanitizeInput(data.service || data.reason);
    var additional = sanitizeInput(data.additional || data.customMsg || data.notes || data.message);

    var lines = [
      'Hello Redesign Dental Clinics 👋',
      '',
      'I would like to book a dental appointment.',
      '',
      '📋 PATIENT DETAILS',
      '',
      '👤 Name: ' + (name || 'Not provided'),
      '',
      '📱 Mobile Number: ' + (phone || 'Not provided')
    ];

    if (email) {
      lines.push('');
      lines.push('📧 Email: ' + email);
    }

    if (date) {
      lines.push('');
      lines.push('📅 Preferred Date: ' + date);
    }

    if (time) {
      lines.push('');
      lines.push('⏰ Preferred Time: ' + time);
    }

    if (service) {
      lines.push('');
      lines.push('🦷 Service Required: ' + service);
    }

    if (additional) {
      lines.push('');
      lines.push('💬 Additional Concern:');
      lines.push(additional);
    }

    lines.push('');
    lines.push('Please confirm my appointment availability.');
    lines.push('');
    lines.push('Thank you!');

    return lines.join('\n');
  }

  /**
   * Format Callback Request WhatsApp Message
   */
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

  /**
   * Generate clean WhatsApp click-to-chat URL
   */
  function generateWhatsAppUrl(messageText) {
    var cleanNumber = String(window.whatsappConfig.clinicNumber || '917780245307').replace(/\D/g, '');
    var encodedMessage = encodeURIComponent(messageText);
    return 'https://wa.me/' + cleanNumber + '?text=' + encodedMessage;
  }

  /**
   * Open WhatsApp automatically with pre-filled message
   */
  function openWhatsApp(messageText, fallbackContainer) {
    var url = generateWhatsAppUrl(messageText);

    try {
      // Attempt window.open first
      var win = window.open(url, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        // Fallback for pop-up blockers or mobile browsers
        window.location.href = url;
      }
    } catch (e) {
      try {
        window.location.href = url;
      } catch (err) {
        if (fallbackContainer) {
          fallbackContainer.innerHTML = 'Unable to open WhatsApp automatically. Please try again or contact Redesign Dental Clinics directly.';
          fallbackContainer.style.display = 'block';
        } else {
          alert('Unable to open WhatsApp automatically. Please try again or contact Redesign Dental Clinics directly.');
        }
      }
    }
  }

  // Expose utility object globally
  window.RedesignWhatsApp = {
    config: whatsappConfig,
    buildAppointmentMessage: buildAppointmentMessage,
    buildCallbackMessage: buildCallbackMessage,
    generateWhatsAppUrl: generateWhatsAppUrl,
    openWhatsApp: openWhatsApp
  };

})();
