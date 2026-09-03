/**
 * Redesign Dental Clinics — Unified Navbar Engine
 * 
 * - Stable single-source-of-truth navbar controller
 * - Desktop (>= 992px): Absolute overlay with 250ms hover delay. Never participates in flex flow.
 * - Mobile (<= 991px): Smooth accordion drawer. Mutual exclusive submenu expansion.
 * - In-page smooth scroll with 105px header offset for all hash targets.
 * - Cross-page hash arrival scroll offset handling.
 * - Full accessibility: ESC key, aria-expanded, outside click to close.
 * - Hides floating actions when mobile menu drawer is open.
 */

(function () {
  'use strict';

  var closeTimers = {};
  var HEADER_OFFSET = 105;

  function initNavbarDropdowns() {
    var dropdowns = document.querySelectorAll('.rc-nav-dropdown');

    dropdowns.forEach(function (dd, index) {
      var timerId = 'rc_dd_' + index;
      var arrowBtn = dd.querySelector('.rc-dropdown-arrow-btn');
      var listMenu = dd.querySelector('.rc-dropdown-menu');

      function openMenu() {
        if (closeTimers[timerId]) {
          clearTimeout(closeTimers[timerId]);
          closeTimers[timerId] = null;
        }

        // Close other dropdowns
        dropdowns.forEach(function (other, otherIdx) {
          if (other !== dd) {
            closeMenuImmediately(other, 'rc_dd_' + otherIdx);
          }
        });

        dd.classList.add('is-open');
        if (arrowBtn) arrowBtn.setAttribute('aria-expanded', 'true');
      }

      function scheduleCloseMenu() {
        if (closeTimers[timerId]) clearTimeout(closeTimers[timerId]);
        closeTimers[timerId] = setTimeout(function () {
          closeMenuImmediately(dd, timerId);
        }, 250);
      }

      function closeMenuImmediately(targetDd, tId) {
        if (closeTimers[tId]) {
          clearTimeout(closeTimers[tId]);
          closeTimers[tId] = null;
        }
        targetDd.classList.remove('is-open');
        var targetArrow = targetDd.querySelector('.rc-dropdown-arrow-btn');
        if (targetArrow) targetArrow.setAttribute('aria-expanded', 'false');
      }

      // ── DESKTOP HOVER LISTENERS (>= 992px) ─────────────────────────────────
      dd.addEventListener('mouseenter', function () {
        if (window.innerWidth >= 992) {
          openMenu();
        }
      });

      dd.addEventListener('mouseleave', function () {
        if (window.innerWidth >= 992) {
          scheduleCloseMenu();
        }
      });

      if (listMenu) {
        listMenu.addEventListener('mouseenter', function () {
          if (window.innerWidth >= 992) {
            openMenu();
          }
        });

        listMenu.addEventListener('mouseleave', function () {
          if (window.innerWidth >= 992) {
            scheduleCloseMenu();
          }
        });
      }

      // ── ARROW TOGGLE BUTTON (Desktop & Mobile Click) ───────────────────────
      if (arrowBtn) {
        arrowBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();

          var isOpen = dd.classList.contains('is-open');
          if (isOpen) {
            closeMenuImmediately(dd, timerId);
          } else {
            openMenu();
          }
        });
      }

      // ── SUBMENU LINK CLICKS & IN-PAGE SMOOTH SCROLL ─────────────────────────
      if (listMenu) {
        listMenu.querySelectorAll('a').forEach(function (link) {
          link.addEventListener('click', function (e) {
            var href = link.getAttribute('href') || '';
            var currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
            if (currentPath === '') currentPath = '/';

            var isHomePage = (currentPath === '/' || currentPath === '');
            var isServicesPage = (currentPath === '/services' || currentPath === '/services.html');

            // In-page smooth scroll if on homepage targeting #doctor-profile
            if (isHomePage && (href === '/#doctor-profile' || href === '#doctor-profile')) {
              var docEl = document.getElementById('doctor-profile');
              if (docEl) {
                e.preventDefault();
                closeMenuImmediately(dd, timerId);
                closeMobileNav();
                var docTop = docEl.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({ top: docTop - HEADER_OFFSET, behavior: 'smooth' });
                try { history.pushState(null, null, '#doctor-profile'); } catch (err) {}
                return;
              }
            }

            // In-page smooth scroll if on /services targeting #category
            if (isServicesPage && href.startsWith('/services#')) {
              var sTargetId = href.split('#')[1];
              var sTargetEl = document.getElementById(sTargetId);
              if (sTargetEl) {
                e.preventDefault();
                closeMenuImmediately(dd, timerId);
                closeMobileNav();
                var sTargetTop = sTargetEl.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({ top: sTargetTop - HEADER_OFFSET, behavior: 'smooth' });
                try { history.pushState(null, null, '#' + sTargetId); } catch (err) {}
                return;
              }
            }

            // Normal navigation for other links
            closeMenuImmediately(dd, timerId);
            closeMobileNav();
          });
        });
      }
    });

    // ── MOBILE MENU TOGGLER & BODY CLASS ─────────────────────────────────────
    var mobileToggle = document.querySelector('.navbar-toggler-button');
    var mobileNavMenu = document.querySelector('.navbar_menu');

    if (mobileToggle && mobileNavMenu) {
      mobileToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = mobileNavMenu.classList.contains('w--open');
        if (isOpen) {
          // Close
          mobileNavMenu.classList.remove('w--open');
          mobileToggle.classList.remove('w--open');
          mobileToggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('rc-menu-open');
        } else {
          // Open
          mobileNavMenu.classList.add('w--open');
          mobileToggle.classList.add('w--open');
          mobileToggle.setAttribute('aria-expanded', 'true');
          document.body.classList.add('rc-menu-open');
        }
      });
    }

    // Helper: Close mobile navigation menu if open
    function closeMobileNav() {
      if (mobileNavMenu) {
        mobileNavMenu.classList.remove('w--open');
      }
      if (mobileToggle) {
        mobileToggle.classList.remove('w--open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
      document.body.classList.remove('rc-menu-open');
    }

    // ── CLICK OUTSIDE TO CLOSE DROPDOWNS & MOBILE MENU ───────────────────────
    document.addEventListener('click', function (e) {
      // Close desktop dropdowns when clicking outside
      if (!e.target.closest('.rc-nav-dropdown')) {
        dropdowns.forEach(function (dd, index) {
          dd.classList.remove('is-open');
          var arrowBtn = dd.querySelector('.rc-dropdown-arrow-btn');
          if (arrowBtn) arrowBtn.setAttribute('aria-expanded', 'false');
        });
      }
      // Close mobile menu when clicking outside the navbar entirely
      if (!e.target.closest('.navbar_wrap')) {
        closeMobileNav();
      }
    });

    // ── ESCAPE KEY TO CLOSE ──────────────────────────────────────────────────
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        dropdowns.forEach(function (dd) {
          dd.classList.remove('is-open');
          var arrowBtn = dd.querySelector('.rc-dropdown-arrow-btn');
          if (arrowBtn) arrowBtn.setAttribute('aria-expanded', 'false');
        });
        closeMobileNav();
      }
    });
  }

  // ── CROSS-PAGE HASH ARRIVAL SCROLL OFFSET ──────────────────────────────────
  function handleInitialHashScroll() {
    if (window.location.hash) {
      function attemptScroll(retries) {
        var targetElem = document.querySelector(window.location.hash);
        if (targetElem) {
          var elemPos = targetElem.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elemPos - HEADER_OFFSET,
            behavior: 'smooth'
          });
        } else if (retries > 0) {
          setTimeout(function () { attemptScroll(retries - 1); }, 150);
        }
      }
      setTimeout(function () { attemptScroll(5); }, 200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initNavbarDropdowns();
      handleInitialHashScroll();
    });
  } else {
    initNavbarDropdowns();
    handleInitialHashScroll();
  }
})();
