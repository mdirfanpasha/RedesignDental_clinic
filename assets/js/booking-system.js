/**
 * assets/js/booking-system.js
 * Universal Redirection and Booking Navigation Handler
 */
(function () {
  'use strict';

  // Global RedesignBooking API for modal/page transitions across the site
  window.RedesignBooking = {
    openAppointmentModal: function (serviceReason) {
      if (serviceReason) {
        window.location.href = '/appointment?service=' + encodeURIComponent(serviceReason);
      } else {
        window.location.href = '/appointment';
      }
    },
    openCallbackModal: function () {
      window.location.href = '/appointment';
    }
  };

  // Intercept any legacy or hash-based booking clicks and smoothly route to /appointment
  function handleBookingLinkClick(e) {
    var link = e.target.closest('a, button');
    if (!link) return;

    var href = link.getAttribute('href');

    // Direct routing for all #book, /contact#book, #appointment, /booking, or /booking?...
    if (href === '#book' || href === '/contact#book' || href === '#appointment' || href === '/booking' || (href && href.startsWith('/booking'))) {
      e.preventDefault();
      var targetUrl = '/appointment';
      if (href.includes('?')) {
        targetUrl += '?' + href.split('?')[1];
      }
      window.location.href = targetUrl;
      return;
    }

    // If an anchor text or aria-label specifically says "Get Appointment", "Book Appointment" or "Book Consultation" and points to /contact or #
    if (href) {
      var text = (link.textContent || '').trim().toLowerCase();
      var aria = (link.getAttribute('aria-label') || '').toLowerCase();
      var isBookText = text.includes('get appointment') || text.includes('book appointment') || text.includes('book consultation') || 
                       text.includes('book online') || aria.includes('get appointment') || aria.includes('book appointment') || aria.includes('book consultation');
      if (isBookText && (href === '/contact' || href.startsWith('/contact#') || href === '#' || href === '/booking' || href.startsWith('/booking?'))) {
        e.preventDefault();
        var targetUrl = '/appointment';
        if (href.includes('?')) {
          targetUrl += '?' + href.split('?')[1];
        }
        window.location.href = targetUrl;
        return;
      }
    }
  }

  document.addEventListener('click', handleBookingLinkClick, true);
})();
