/**
 * Redesign Dental Clinics — Accordion & FAQ Hover-to-Expand Interaction Controller
 * 
 * Requirements:
 * - Desktop: Instant expansion on the VERY FIRST hover over any item, with NO prior click required.
 * - Mobile & Touch Devices: Tap/click to expand/collapse.
 * - Natural Height: Dynamically calculated so multi-lingual text never clips.
 * - Single Active Item: Smoothly closes previously open item when moving to a new item.
 * - Accessibility: ARIA attributes and keyboard Enter/Space support.
 * - Independent: Every item works independently from page load onwards.
 *
 * Architecture:
 * - Webflow's native .w-tabs system is DISABLED on our accordion containers
 *   because it fights hover logic by resetting classes and inline styles.
 * - All expand/collapse state is managed entirely by this script.
 */

(function () {
  'use strict';

  // Track whether the last user interaction was touch-based
  var isTouchUser = false;

  window.addEventListener('touchstart', function () {
    isTouchUser = true;
  }, { passive: true, capture: true });

  window.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch') {
      isTouchUser = true;
    } else {
      isTouchUser = false;
    }
  }, { passive: true, capture: true });

  window.addEventListener('mousemove', function () {
    isTouchUser = false;
  }, { passive: true, capture: true });


  function initAccordionGroup(containerSelector, itemSelector, contentSelector) {
    var container = document.querySelector(containerSelector);
    if (!container) return;

    // Avoid duplicate initialization on the same container
    if (container.dataset.accordionInit === 'true') return;
    container.dataset.accordionInit = 'true';

    var items = Array.prototype.slice.call(container.querySelectorAll(itemSelector));
    if (!items || !items.length) return;

    // ===================================================================
    // CRITICAL: Neutralize Webflow's native .w-tabs system.
    //
    // Webflow's runtime JS finds all .w-tabs containers and attaches its
    // own click handlers to .w-tab-link children. Those handlers call IX2
    // animations that set inline styles (max-height, opacity, transform)
    // which OVERRIDE our hover-based expansion.
    //
    // By removing these marker classes, Webflow's tab system ignores our
    // accordion elements entirely, giving us full control.
    // ===================================================================
    container.classList.remove('w-tabs');

    var tabMenu = container.querySelector('.w-tab-menu');
    if (tabMenu) tabMenu.classList.remove('w-tab-menu');

    var tabContent = container.querySelector('.w-tab-content');
    if (tabContent) tabContent.style.display = 'none';

    items.forEach(function (item) {
      item.classList.remove('w-tab-link');
    });

    // Clear ALL Webflow-injected inline styles on content elements.
    // Webflow IX2 sets inline max-height/opacity/transform during init,
    // which override our CSS rules. By clearing them, our CSS transitions
    // and JS-set styles take effect cleanly.
    items.forEach(function (item) {
      var content = item.querySelector(contentSelector);
      if (content) {
        content.removeAttribute('style');
      }
      // Also clear any inline styles on the item itself (IX2 may set transforms)
      // But preserve display/layout properties by only clearing animation props
      item.style.removeProperty('opacity');
      item.style.removeProperty('transform');
      item.style.removeProperty('max-height');
    });

    var activeItem = null;

    function setItemExpansion(item, isExpand) {
      var content = item.querySelector(contentSelector);
      if (!content) return;

      if (isExpand) {
        var naturalHeight = content.scrollHeight;
        content.style.maxHeight = (naturalHeight > 0 ? naturalHeight : 500) + 'px';
        content.style.opacity = '1';
      } else {
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
      }
    }

    function setActiveItem(targetItem) {
      if (!targetItem) return;

      if (activeItem === targetItem) {
        // Refresh height (useful after resize or language switch)
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
      }

      activeItem = targetItem;
    }

    function closeActiveItem() {
      if (activeItem) {
        activeItem.classList.remove('w--current', 'is-active');
        activeItem.setAttribute('aria-expanded', 'false');
        setItemExpansion(activeItem, false);
        activeItem = null;
      }
    }

    // Identify default open item on initial mount
    var initialItem = container.querySelector(itemSelector + '.w--current') ||
                      container.querySelector(itemSelector + '.is-first') ||
                      items[0];

    // Setup accessibility attributes
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var isInit = (item === initialItem);
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-expanded', isInit ? 'true' : 'false');

      var content = item.querySelector(contentSelector);
      if (content) {
        if (!content.id) {
          content.id = 'acc-' + Math.random().toString(36).substr(2, 9);
        }
        item.setAttribute('aria-controls', content.id);
      }
    }

    // Set initial open item
    setActiveItem(initialItem);

    // ===================================================================
    // EVENT HANDLERS
    // ===================================================================
    items.forEach(function (item) {

      // 1. Pointer Enter — fires for mouse, pen, and touch
      item.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'touch') return; // Touch users get tap instead
        setActiveItem(item);
      });

      // 2. Mouse Enter — standard desktop hover (fallback for older browsers)
      item.addEventListener('mouseenter', function () {
        if (isTouchUser) return;
        setActiveItem(item);
      });

      // 3. Mouseover — catches when cursor is already over element on render
      item.addEventListener('mouseover', function () {
        if (isTouchUser) return;
        if (activeItem !== item) {
          setActiveItem(item);
        }
      });

      // 4. Click / Tap — mobile toggle and desktop click guarantee
      item.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent any residual Webflow handlers

        if (isTouchUser && activeItem === item) {
          closeActiveItem();
        } else {
          setActiveItem(item);
        }
      });

      // 5. Keyboard: Enter & Space
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (activeItem === item) {
            closeActiveItem();
          } else {
            setActiveItem(item);
          }
        }
      });

      // 6. Focus for keyboard tab navigation
      item.addEventListener('focus', function () {
        setActiveItem(item);
      });
    });

    // Window resize & Language change listeners to refresh natural scrollHeight
    function refreshActiveHeight() {
      if (activeItem) {
        setItemExpansion(activeItem, true);
      }
    }

    window.addEventListener('resize', refreshActiveHeight);
    window.addEventListener('rcLanguageChanged', function () {
      setTimeout(refreshActiveHeight, 60);
    });
  }


  function initAllAccordions() {
    // 1. Why Choose Us Accordion
    //    Container: .tabs_accordion  (fallback: .tabs-accordion_menu)
    var whyUsSelector = document.querySelector('.tabs_accordion')
      ? '.tabs_accordion'
      : (document.querySelector('.tabs-accordion_menu') ? '.tabs-accordion_menu' : null);
    if (whyUsSelector) {
      initAccordionGroup(whyUsSelector, '.tabs-accordion_item', '.tabs-accordion_info');
    }

    // 2. FAQ Accordion
    //    Container: .faq_tabs  (fallback: .faq-tabs_menu)
    var faqSelector = document.querySelector('.faq_tabs')
      ? '.faq_tabs'
      : (document.querySelector('.faq-tabs_menu') ? '.faq-tabs_menu' : null);
    if (faqSelector) {
      initAccordionGroup(faqSelector, '.faq_item', '.faq_description');
    }
  }

  // Run as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAccordions);
  } else {
    initAllAccordions();
  }

  // Safety: re-run after full window load in case Webflow's late init reset things.
  // The duplicate-init guard (dataset.accordionInit) ensures we don't double-bind,
  // but we DO need to re-neutralize Webflow if it ran between DOMContentLoaded and load.
  window.addEventListener('load', function () {
    // Give Webflow's IX2 engine 200ms to finish its post-load animations,
    // then re-assert our state.
    setTimeout(function () {
      var containers = document.querySelectorAll('[data-accordion-init="true"]');
      containers.forEach(function (container) {
        // Re-neutralize in case Webflow re-added classes
        container.classList.remove('w-tabs');
        var menu = container.querySelector('.w-tab-menu');
        if (menu) menu.classList.remove('w-tab-menu');

        // Re-clear any IX2 inline styles on content elements
        var infoEls = container.querySelectorAll('.tabs-accordion_info, .faq_description');
        infoEls.forEach(function (el) {
          // Only touch non-active items (active items have our JS-set maxHeight)
          var parent = el.closest('.tabs-accordion_item, .faq_item');
          if (parent && !parent.classList.contains('is-active')) {
            el.style.maxHeight = '0px';
            el.style.opacity = '0';
          }
        });
      });
    }, 200);
  });
})();
