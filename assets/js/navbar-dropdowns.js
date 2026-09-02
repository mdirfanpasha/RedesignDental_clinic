/**
 * Redesign Dental Clinics — Professional Navbar Dropdown Engine
 * 
 * - Hover behavior with 300ms close delay on desktop (>= 992px).
 * - Clicking main text ("About Us" / "Services") navigates directly to /about and /services.
 * - Clicking the arrow button toggles the dropdown overlay without shifting the navbar.
 * - Invisible bridge prevents cursor dead zones between button and menu.
 * - Fully isolated from Webflow to eliminate layout jumping or reversing.
 * - Mobile responsive accordion submenus with smooth expand/collapse.
 * - Full accessibility: ESC key, aria-expanded, outside click to close.
 */

(function () {
  'use strict';

  var closeTimers = {};
  var HEADER_OFFSET = 95;

  function initNavbarDropdowns() {
    var dropdowns = document.querySelectorAll('.rc-nav-dropdown');

    dropdowns.forEach(function (dd, index) {
      var timerId = 'rc_dd_' + index;
      var arrowBtn = dd.querySelector('.rc-dropdown-arrow-btn');
      var parentLink = dd.querySelector('.rc-nav-parent-link');
      var listMenu = dd.querySelector('.rc-dropdown-menu');

      // ── Helper: Open Dropdown ──────────────────────────────────────────────
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

      // ── Helper: Schedule 300ms Close Delay (Desktop Hover) ─────────────────
      function scheduleCloseMenu() {
        if (closeTimers[timerId]) clearTimeout(closeTimers[timerId]);
        closeTimers[timerId] = setTimeout(function () {
          closeMenuImmediately(dd, timerId);
        }, 300);
      }

      // ── Helper: Close Dropdown Immediately ────────────────────────────────
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

            // In-page smooth scroll if already on homepage targeting #doctor-profile
            if (isHomePage && (href === '/#doctor-profile' || href === '#doctor-profile')) {
              var docEl = document.getElementById('doctor-profile');
              if (docEl) {
                e.preventDefault();
                closeMenuImmediately(dd, timerId);
                var docTop = docEl.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({ top: docTop - HEADER_OFFSET, behavior: 'smooth' });
                try { history.pushState(null, null, '#doctor-profile'); } catch (err) {}
                closeMobileNav();
                return;
              }
            }

            // In-page smooth scroll if on /services targeting #category
            var isServicesPage = (currentPath === '/services' || currentPath === '/services.html');
            if (isServicesPage && href.startsWith('/services#')) {
              var sTargetId = href.split('#')[1];
              var sTargetEl = document.getElementById(sTargetId);
              if (sTargetEl) {
                e.preventDefault();
                closeMenuImmediately(dd, timerId);
                var sTargetTop = sTargetEl.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({ top: sTargetTop - HEADER_OFFSET, behavior: 'smooth' });
                try { history.pushState(null, null, '#' + sTargetId); } catch (err) {}
                closeMobileNav();
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

    // Helper: Close mobile navigation menu if open
    function closeMobileNav() {
      var mobileNavMenu = document.querySelector('.w-nav-menu');
      var mobileToggle = document.querySelector('.w-nav-button');
      if (mobileNavMenu && mobileNavMenu.classList.contains('w--open')) {
        if (mobileToggle) {
          try { mobileToggle.click(); } catch (err) {}
        }
      }
    }

    // ── CLICK OUTSIDE TO CLOSE ───────────────────────────────────────────────
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.rc-nav-dropdown')) {
        dropdowns.forEach(function (dd, index) {
          dd.classList.remove('is-open');
          var arrowBtn = dd.querySelector('.rc-dropdown-arrow-btn');
          if (arrowBtn) arrowBtn.setAttribute('aria-expanded', 'false');
        });
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
      }
    });
  }

  // ── CROSS-PAGE HASH ARRIVAL SCROLL OFFSET ──────────────────────────────────
  function handleInitialHashScroll() {
    if (window.location.hash) {
      setTimeout(function () {
        var targetElem = document.querySelector(window.location.hash);
        if (targetElem) {
          var elemPos = targetElem.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elemPos - HEADER_OFFSET,
            behavior: 'smooth'
          });
        }
      }, 250);
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
