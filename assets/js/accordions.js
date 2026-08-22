/**
 * Redesign Dental Clinics — Accordion & FAQ Hover-to-Expand Interaction Controller
 * 
 * Features:
 * - Desktop: Smooth hover-to-expand with debounce/flicker-prevention
 * - Mobile & Touch Devices: Tap/click to expand/collapse
 * - Keyboard Accessibility: Enter/Space/Focus support with ARIA attributes
 * - Natural Height: Uses scrollHeight dynamically so multi-lingual text (English, Telugu, Hindi, Arabic) never clips
 * - Single Active Item: Closes previous item smoothly when moving to a new item
 * - Lightweight: Vanilla JS, zero external dependencies
 */

(function () {
  'use strict';

  function initAccordionGroup(containerSelector, itemSelector, contentSelector) {
    var containers = document.querySelectorAll(containerSelector);
    if (!containers || !containers.length) return;

    // Check if device supports hover with fine pointer (mouse/trackpad)
    function isHoverCapable() {
      if (window.matchMedia) {
        var hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
        return hoverQuery.matches;
      }
      return !('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }

    containers.forEach(function (container) {
      // Avoid duplicate initialization
      if (container.dataset.accordionInit === 'true') return;
      container.dataset.accordionInit = 'true';

      var items = container.querySelectorAll(itemSelector);
      if (!items || !items.length) return;

      var activeItem = null;
      var hoverTimeout = null;

      function setItemExpansion(item, isExpand) {
        var content = item.querySelector(contentSelector);
        if (!content) return;

        if (isExpand) {
          // Set natural scrollHeight so content is never clipped
          var naturalHeight = content.scrollHeight;
          content.style.maxHeight = (naturalHeight > 0 ? naturalHeight : 350) + 'px';
          content.style.opacity = '1';
        } else {
          content.style.maxHeight = '0px';
          content.style.opacity = '0';
        }
      }

      function setActiveItem(targetItem, animate) {
        if (activeItem === targetItem && targetItem !== null) {
          // If already active, refresh its height (useful after translation switch or resize)
          setItemExpansion(targetItem, true);
          return;
        }

        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var isTarget = (item === targetItem);

          item.classList.toggle('w--current', isTarget);
          item.classList.toggle('is-active', isTarget);
          item.setAttribute('aria-expanded', isTarget ? 'true' : 'false');
          setItemExpansion(item, isTarget);

          // If inside Webflow tabs, synchronize the associated tab pane
          var tabAttr = item.getAttribute('data-w-tab');
          if (tabAttr) {
            var tabsParent = item.closest('.w-tabs');
            if (tabsParent) {
              var targetPane = tabsParent.querySelector('.w-tab-pane[data-w-tab="' + tabAttr + '"]');
              if (targetPane) {
                var allPanes = tabsParent.querySelectorAll('.w-tab-pane');
                for (var p = 0; p < allPanes.length; p++) {
                  allPanes[p].classList.toggle('w--tab-active', allPanes[p] === targetPane);
                }
              }
            }
          }
        }

        activeItem = targetItem;
      }

      // Initial state: identify default open item
      var initialItem = container.querySelector(itemSelector + '.w--current') ||
                         container.querySelector(itemSelector + '.is-first') ||
                         items[0];

      // Setup accessibility attributes and IDs
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var isInit = (item === initialItem);
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-expanded', isInit ? 'true' : 'false');

        var content = item.querySelector(contentSelector);
        if (content) {
          if (!content.id) {
            content.id = 'accordion-body-' + Math.random().toString(36).substr(2, 9);
          }
          item.setAttribute('aria-controls', content.id);
        }
      }

      // Set initial open item
      setActiveItem(initialItem, false);

      // Event handlers for each accordion item
      items.forEach(function (item) {
        // 1. Desktop Hover: enter triggers smooth expansion
        item.addEventListener('mouseenter', function () {
          if (!isHoverCapable()) return;
          clearTimeout(hoverTimeout);
          // Very slight debounce (25ms) prevents flickering during rapid sweeps
          hoverTimeout = setTimeout(function () {
            setActiveItem(item, true);
          }, 25);
        });

        // 2. Mouseover fallback for nested elements
        item.addEventListener('mouseover', function () {
          if (!isHoverCapable()) return;
          if (activeItem !== item) {
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(function () {
              setActiveItem(item, true);
            }, 25);
          }
        });

        // Cancel pending switch if cursor leaves before delay expires
        item.addEventListener('mouseleave', function () {
          clearTimeout(hoverTimeout);
        });

        // 3. Click / Tap handler
        item.addEventListener('click', function (e) {
          e.preventDefault();
          clearTimeout(hoverTimeout);

          if (!isHoverCapable()) {
            // Mobile / Touch behavior: tap toggles or expands
            if (activeItem === item) {
              // Tapping the open item toggles it closed
              setActiveItem(null, true);
            } else {
              setActiveItem(item, true);
            }
          } else {
            // Desktop click: guarantees item is open
            setActiveItem(item, true);
          }
        });

        // 4. Keyboard Accessibility (Enter & Space)
        item.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            clearTimeout(hoverTimeout);
            if (activeItem === item) {
              setActiveItem(null, true);
            } else {
              setActiveItem(item, true);
            }
          }
        });

        // 5. Focus for keyboard tab navigation
        item.addEventListener('focus', function () {
          setActiveItem(item, true);
        });
      });

      // Window resize & Language change listeners to update natural scrollHeight
      function refreshActiveHeight() {
        if (activeItem) {
          setItemExpansion(activeItem, true);
        }
      }

      window.addEventListener('resize', refreshActiveHeight);
      window.addEventListener('rcLanguageChanged', function () {
        setTimeout(refreshActiveHeight, 60);
      });
    });
  }

  function initAllAccordions() {
    // 1. Why Choose Us Accordion
    initAccordionGroup(
      '.tabs_accordion, .tabs-accordion_menu',
      '.tabs-accordion_item',
      '.tabs-accordion_info'
    );

    // 2. FAQ Accordion
    initAccordionGroup(
      '.faq_tabs, .faq-tabs_menu',
      '.faq_item',
      '.faq_description'
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAccordions);
  } else {
    initAllAccordions();
  }

  // Safety trigger after full window load
  window.addEventListener('load', initAllAccordions);
})();
