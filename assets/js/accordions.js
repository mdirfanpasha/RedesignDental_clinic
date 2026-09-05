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
 */

(function () {
  'use strict';

  // Track whether the last user interaction was touch
  var isTouchUser = false;
  window.addEventListener('touchstart', function () {
    isTouchUser = true;
  }, { passive: true, capture: true });

  window.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch') {
      isTouchUser = true;
    } else if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
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

        // Synchronize Webflow tab pane if present
        var tabAttr = item.getAttribute('data-w-tab');
        if (tabAttr && isTarget) {
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

    // Identify default open item on initial mount
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
          content.id = 'acc-' + Math.random().toString(36).substr(2, 9);
        }
        item.setAttribute('aria-controls', content.id);
      }
    }

    // Set initial open item
    setActiveItem(initialItem);

    // Event handlers for each accordion item
    items.forEach(function (item) {
      // 1. Instant Pointer Enter (Desktop Mouse / Trackpad / Stylus)
      item.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'touch') return;
        setActiveItem(item);
      });

      // 2. Direct Mouse Enter (Standard Desktop Hover)
      item.addEventListener('mouseenter', function () {
        if (isTouchUser) return;
        setActiveItem(item);
      });

      // 3. Mouseover (Fallback when cursor is already over element on render)
      item.addEventListener('mouseover', function () {
        if (isTouchUser) return;
        if (activeItem !== item) {
          setActiveItem(item);
        }
      });

      // 4. Click / Tap (Handles mobile taps and desktop clicks)
      item.addEventListener('click', function (e) {
        e.preventDefault();

        if (isTouchUser && activeItem === item) {
          // On mobile, tapping the active item toggles it closed
          item.classList.remove('w--current', 'is-active');
          item.setAttribute('aria-expanded', 'false');
          setItemExpansion(item, false);
          activeItem = null;
        } else {
          setActiveItem(item);
        }
      });

      // 5. Keyboard Accessibility (Enter & Space)
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (activeItem === item) {
            item.classList.remove('w--current', 'is-active');
            item.setAttribute('aria-expanded', 'false');
            setItemExpansion(item, false);
            activeItem = null;
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
    var whyUsSelector = document.querySelector('.tabs_accordion') ? '.tabs_accordion' : '.tabs-accordion_menu';
    initAccordionGroup(
      whyUsSelector,
      '.tabs-accordion_item',
      '.tabs-accordion_info'
    );

    // 2. FAQ Accordion
    var faqSelector = document.querySelector('.faq_tabs') ? '.faq_tabs' : '.faq-tabs_menu';
    initAccordionGroup(
      faqSelector,
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
