/**
 * Redesign Dental Clinics — Refined Navigation Dropdown Engine
 * - Smooth desktop hover with 300ms close delay (prevents accidental closing).
 * - Separate parent page links (/about, /services) vs chevron arrow dropdown toggle buttons.
 * - Mobile responsive accordion submenus with smooth height/opacity transitions.
 * - Accessibility: Keyboard Escape, aria-expanded state, click outside to close.
 */

(function () {
  'use strict';

  var closeTimers = {};

  function initNavbarDropdowns() {
    var dropdowns = document.querySelectorAll('.rc-nav-dropdown');

    dropdowns.forEach(function (dd, index) {
      var timerId = 'rc_dd_' + index;
      var arrowBtn = dd.querySelector('.rc-dropdown-arrow-btn');
      var parentLink = dd.querySelector('.rc-nav-parent-link');
      var listMenu = dd.querySelector('.rc-dropdown-menu');

      // ── Helper: Open Dropdown Menu ─────────────────────────────────────────
      function openMenu() {
        if (closeTimers[timerId]) {
          clearTimeout(closeTimers[timerId]);
          closeTimers[timerId] = null;
        }

        // Close other open dropdowns first for clean UX
        dropdowns.forEach(function (other, otherIdx) {
          if (other !== dd) {
            closeMenuImmediately(other, 'rc_dd_' + otherIdx);
          }
        });

        dd.classList.add('is-open', 'w--open');
        if (listMenu) listMenu.classList.add('w--open');
        if (arrowBtn) arrowBtn.setAttribute('aria-expanded', 'true');
      }

      // ── Helper: Schedule 300ms Close Delay (Desktop Hover) ─────────────────
      function scheduleCloseMenu() {
        if (closeTimers[timerId]) clearTimeout(closeTimers[timerId]);
        closeTimers[timerId] = setTimeout(function () {
          closeMenuImmediately(dd, timerId);
        }, 300); // 300ms smooth delay
      }

      // ── Helper: Close Dropdown Immediately ────────────────────────────────
      function closeMenuImmediately(targetDd, tId) {
        if (closeTimers[tId]) {
          clearTimeout(closeTimers[tId]);
          closeTimers[tId] = null;
        }
        targetDd.classList.remove('is-open', 'w--open');
        var targetList = targetDd.querySelector('.rc-dropdown-menu');
        var targetArrow = targetDd.querySelector('.rc-dropdown-arrow-btn');
        if (targetList) targetList.classList.remove('w--open');
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

      // If mouse re-enters listMenu directly
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

      // ── SEPARATE CHEVRON ARROW TOGGLE (Desktop Click & Mobile Tap) ──────────
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

      // ── SUBMENU ITEM CLICK HANDLER ─────────────────────────────────────────
      if (listMenu) {
        listMenu.querySelectorAll('a').forEach(function (link) {
          link.addEventListener('click', function () {
            closeMenuImmediately(dd, timerId);

            // On mobile view, close the overall hamburger navbar menu after selection
            var mobileNavMenu = document.querySelector('.w-nav-menu');
            var mobileToggle = document.querySelector('.w-nav-button');
            if (mobileNavMenu && mobileNavMenu.classList.contains('w--open')) {
              if (mobileToggle) {
                try { mobileToggle.click(); } catch (err) {}
              }
            }
          });
        });
      }
    });

    // ── CLICK OUTSIDE TO CLOSE ───────────────────────────────────────────────
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.rc-nav-dropdown')) {
        dropdowns.forEach(function (dd, index) {
          dd.classList.remove('is-open', 'w--open');
          var listMenu = dd.querySelector('.rc-dropdown-menu');
          var arrowBtn = dd.querySelector('.rc-dropdown-arrow-btn');
          if (listMenu) listMenu.classList.remove('w--open');
          if (arrowBtn) arrowBtn.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // ── ESCAPE KEY TO CLOSE ──────────────────────────────────────────────────
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        dropdowns.forEach(function (dd) {
          dd.classList.remove('is-open', 'w--open');
          var listMenu = dd.querySelector('.rc-dropdown-menu');
          var arrowBtn = dd.querySelector('.rc-dropdown-arrow-btn');
          if (listMenu) listMenu.classList.remove('w--open');
          if (arrowBtn) arrowBtn.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbarDropdowns);
  } else {
    initNavbarDropdowns();
  }
})();
