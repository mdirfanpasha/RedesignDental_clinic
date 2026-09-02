/**
 * Redesign Dental Clinics — Refined Navigation Dropdown Engine
 * - Unified dropdown toggle: Clicking anywhere on "About Us" or "Services" toggles the menu open/closed.
 * - Prevents abrupt page navigation or navbar flickering on toggle click.
 * - Smooth desktop hover with 250ms close delay.
 * - Precise in-page and cross-page smooth scroll handling with fixed header offset.
 * - Full accessibility: Keyboard Enter/Space/Escape, aria-expanded states, click outside to close.
 */

(function () {
  'use strict';

  var closeTimers = {};
  var HEADER_OFFSET = 95; // Offset in pixels for fixed navbar

  function initNavbarDropdowns() {
    var dropdowns = document.querySelectorAll('.rc-nav-dropdown');

    dropdowns.forEach(function (dd, index) {
      var timerId = 'rc_dd_' + index;
      var toggleBtn = dd.querySelector('.rc-dropdown-toggle-btn') || dd.querySelector('.navbar-dropdown_toggle_group') || dd.querySelector('.rc-dropdown-arrow-btn');
      var listMenu = dd.querySelector('.rc-dropdown-menu');

      // ── Helper: Open Dropdown Menu ─────────────────────────────────────────
      function openMenu() {
        if (closeTimers[timerId]) {
          clearTimeout(closeTimers[timerId]);
          closeTimers[timerId] = null;
        }

        // Close other open dropdowns for clean single-menu UX
        dropdowns.forEach(function (other, otherIdx) {
          if (other !== dd) {
            closeMenuImmediately(other, 'rc_dd_' + otherIdx);
          }
        });

        dd.classList.add('is-open', 'w--open');
        if (listMenu) listMenu.classList.add('w--open');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
      }

      // ── Helper: Schedule Close Delay (Desktop Hover) ───────────────────────
      function scheduleCloseMenu() {
        if (closeTimers[timerId]) clearTimeout(closeTimers[timerId]);
        closeTimers[timerId] = setTimeout(function () {
          closeMenuImmediately(dd, timerId);
        }, 250);
      }

      // ── Helper: Close Dropdown Immediately ────────────────────────────────
      function closeMenuImmediately(targetDd, tId) {
        if (closeTimers[tId]) {
          clearTimeout(closeTimers[tId]);
          closeTimers[tId] = null;
        }
        targetDd.classList.remove('is-open', 'w--open');
        var targetList = targetDd.querySelector('.rc-dropdown-menu');
        var targetToggle = targetDd.querySelector('.rc-dropdown-toggle-btn') || targetDd.querySelector('.navbar-dropdown_toggle_group');
        if (targetList) targetList.classList.remove('w--open');
        if (targetToggle) targetToggle.setAttribute('aria-expanded', 'false');
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

      // ── TOGGLE CLICK & KEYBOARD HANDLERS ───────────────────────────────────
      if (toggleBtn) {
        toggleBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();

          var isOpen = dd.classList.contains('is-open') || dd.classList.contains('w--open');
          if (isOpen) {
            closeMenuImmediately(dd, timerId);
          } else {
            openMenu();
          }
        });

        toggleBtn.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            var isOpen = dd.classList.contains('is-open') || dd.classList.contains('w--open');
            if (isOpen) {
              closeMenuImmediately(dd, timerId);
            } else {
              openMenu();
            }
          }
        });
      }

      // ── SUBMENU ITEM CLICK & SMART SCROLL HANDLER ──────────────────────────
      if (listMenu) {
        listMenu.querySelectorAll('a').forEach(function (link) {
          link.addEventListener('click', function (e) {
            var href = link.getAttribute('href') || '';
            var currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
            if (currentPath === '') currentPath = '/';

            var isHomePage = (currentPath === '/' || currentPath === '');

            // Check if link targets homepage section while already on homepage
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

            if (isHomePage && (href === '/#our-story' || href === '#our-story')) {
              var storyEl = document.getElementById('our-story');
              if (storyEl) {
                e.preventDefault();
                closeMenuImmediately(dd, timerId);
                var storyTop = storyEl.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({ top: storyTop - HEADER_OFFSET, behavior: 'smooth' });
                try { history.pushState(null, null, '#our-story'); } catch (err) {}
                closeMobileNav();
                return;
              }
            }

            // Check if on /about and target is on /about
            var isAboutPage = (currentPath === '/about' || currentPath === '/about.html');
            if (isAboutPage && href.startsWith('/about#')) {
              var targetId = href.split('#')[1];
              var targetEl = document.getElementById(targetId);
              if (targetEl) {
                e.preventDefault();
                closeMenuImmediately(dd, timerId);
                var targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({ top: targetTop - HEADER_OFFSET, behavior: 'smooth' });
                try { history.pushState(null, null, '#' + targetId); } catch (err) {}
                closeMobileNav();
                return;
              }
            }

            // Check if on /services and target is on /services
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

            closeMenuImmediately(dd, timerId);
            closeMobileNav();
          });
        });
      }
    });

    // Helper: Close mobile navigation drawer if open
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
          dd.classList.remove('is-open', 'w--open');
          var listMenu = dd.querySelector('.rc-dropdown-menu');
          var toggleBtn = dd.querySelector('.rc-dropdown-toggle-btn') || dd.querySelector('.navbar-dropdown_toggle_group');
          if (listMenu) listMenu.classList.remove('w--open');
          if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // ── ESCAPE KEY TO CLOSE ──────────────────────────────────────────────────
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        dropdowns.forEach(function (dd) {
          dd.classList.remove('is-open', 'w--open');
          var listMenu = dd.querySelector('.rc-dropdown-menu');
          var toggleBtn = dd.querySelector('.rc-dropdown-toggle-btn') || dd.querySelector('.navbar-dropdown_toggle_group');
          if (listMenu) listMenu.classList.remove('w--open');
          if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // ── CROSS-PAGE HASH ARRIVAL SMOOTH SCROLL ──────────────────────────────────
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
      }, 300);
    }
  }

  // Auto-initialize on DOM ready
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
