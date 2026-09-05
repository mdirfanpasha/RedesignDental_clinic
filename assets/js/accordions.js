/**
 * Redesign Dental Clinics — Accordion & FAQ Hover-to-Expand Interaction Controller
 * 
 * Requirements:
 * - Desktop: Instant expansion on the VERY FIRST hover over any item, with NO prior click required.
 * - Full Text & Content Visibility: Inner text/content containers are ALWAYS forced to opacity 1,
 *   visible, and transform none when expanded so text is never hidden by Webflow IX2.
 * - Mobile & Touch Devices: Tap/click to expand/collapse cleanly.
 * - Natural Height: Dynamically calculated so multi-lingual text never clips.
 * - Single Active Item: Smoothly closes previously open item when moving to a new item.
 * - Accessibility: ARIA attributes and keyboard Enter/Space support.
 * - Independent: Every item works independently from page load onwards.
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

  // Helper to recursively remove Webflow-injected animation styles
  function cleanWebflowStyles(el) {
    if (!el) return;
    el.style.removeProperty('opacity');
    el.style.removeProperty('transform');
    el.style.removeProperty('max-height');
    el.style.removeProperty('height');
    var descendants = el.querySelectorAll('*');
    for (var i = 0; i < descendants.length; i++) {
      var d = descendants[i];
      d.style.removeProperty('opacity');
      d.style.removeProperty('transform');
      d.style.removeProperty('max-height');
      d.style.removeProperty('height');
      if (d.style.display === 'none') {
        d.style.removeProperty('display');
      }
    }
  }

  function initAccordionGroup(containerSelector, itemSelector, contentSelector) {
    var container = document.querySelector(containerSelector);
    if (!container) return;

    // Avoid duplicate initialization on the same container
    if (container.dataset.accordionInit === 'true') return;
    container.dataset.accordionInit = 'true';

    var items = Array.prototype.slice.call(container.querySelectorAll(itemSelector));
    if (!items || !items.length) return;

    // ===================================================================
    // CRITICAL: Neutralize Webflow's native .w-tabs runtime
    // ===================================================================
    container.classList.remove('w-tabs');

    var tabMenu = container.querySelector('.w-tab-menu');
    if (tabMenu) tabMenu.classList.remove('w-tab-menu');

    var tabContent = container.querySelector('.w-tab-content');
    if (tabContent) tabContent.style.display = 'none';

    items.forEach(function (item) {
      item.classList.remove('w-tab-link');
      cleanWebflowStyles(item);
    });

    var activeItem = null;

    function setItemExpansion(item, isExpand) {
      var content = item.querySelector(contentSelector);
      if (!content) return;

      var inners = content.querySelectorAll('.tabs-accordion_info-inner, .faq-description_inner, p, div, span');
      var faqIcon = item.querySelector('.faq-header_icon-wrap');
      var tabsIcon = item.querySelector('.tabs-accordion_header-icon');
      var faqTitle = item.querySelector('.faq-header_title');
      var tabsTitle = item.querySelector('.tabs-accordion_header-title');
      var faqLines = item.querySelectorAll('.faq-header_icon-line');

      if (isExpand) {
        // 1. Force all inner text & containers to be fully visible and unscaled
        for (var j = 0; j < inners.length; j++) {
          inners[j].style.setProperty('opacity', '1', 'important');
          inners[j].style.setProperty('visibility', 'visible', 'important');
          inners[j].style.setProperty('transform', 'none', 'important');
          if (inners[j].style.display === 'none') {
            inners[j].style.removeProperty('display');
          }
        }

        // 2. Measure natural scrollHeight and expand
        var naturalHeight = content.scrollHeight;
        content.style.maxHeight = (naturalHeight > 0 ? (naturalHeight + 40) : 600) + 'px';
        content.style.setProperty('opacity', '1', 'important');
        content.style.setProperty('visibility', 'visible', 'important');

        // 3. Rotate and highlight icon
        if (faqIcon) {
          faqIcon.style.transform = 'rotate(45deg)';
        }
        if (tabsIcon) {
          tabsIcon.style.transform = 'rotate(45deg)';
          tabsIcon.style.color = '#0f766e';
        }
        for (var l = 0; l < faqLines.length; l++) {
          faqLines[l].style.backgroundColor = '#0f766e';
        }
        if (faqTitle) faqTitle.style.color = '#05262a';
        if (tabsTitle) tabsTitle.style.color = '#05262a';
      } else {
        // Collapse
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
        for (var k = 0; k < inners.length; k++) {
          inners[k].style.opacity = '0';
        }

        // Reset icon and title
        if (faqIcon) {
          faqIcon.style.transform = 'rotate(0deg)';
        }
        if (tabsIcon) {
          tabsIcon.style.transform = 'rotate(0deg)';
          tabsIcon.style.removeProperty('color');
        }
        for (var m = 0; m < faqLines.length; m++) {
          faqLines[m].style.removeProperty('background-color');
        }
        if (faqTitle) faqTitle.style.removeProperty('color');
        if (tabsTitle) tabsTitle.style.removeProperty('color');
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
    // EVENT HANDLERS (First hover guaranteed)
    // ===================================================================
    items.forEach(function (item) {

      // 1. Pointer Enter — fires for mouse, pen, and touch
      item.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'touch') return;
        setActiveItem(item);
      });

      // 2. Mouse Enter — standard desktop hover
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
        e.stopPropagation();

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
    var whyUsSelector = document.querySelector('.tabs_accordion')
      ? '.tabs_accordion'
      : (document.querySelector('.tabs-accordion_menu') ? '.tabs-accordion_menu' : null);
    if (whyUsSelector) {
      initAccordionGroup(whyUsSelector, '.tabs-accordion_item', '.tabs-accordion_info');
    }

    // 2. FAQ Accordion
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

  // Re-verify after full window load in case Webflow's late init reset things
  window.addEventListener('load', function () {
    setTimeout(function () {
      var containers = document.querySelectorAll('[data-accordion-init="true"]');
      containers.forEach(function (container) {
        container.classList.remove('w-tabs');
        var menu = container.querySelector('.w-tab-menu');
        if (menu) menu.classList.remove('w-tab-menu');

        var activeEl = container.querySelector('.tabs-accordion_item.is-active, .faq_item.is-active');
        if (activeEl) {
          var activeContent = activeEl.querySelector('.tabs-accordion_info, .faq_description');
          if (activeContent) {
            var naturalH = activeContent.scrollHeight;
            activeContent.style.maxHeight = (naturalH > 0 ? (naturalH + 40) : 600) + 'px';
            activeContent.style.setProperty('opacity', '1', 'important');
            activeContent.style.setProperty('visibility', 'visible', 'important');
            var inners = activeContent.querySelectorAll('.tabs-accordion_info-inner, .faq-description_inner, p');
            for (var i = 0; i < inners.length; i++) {
              inners[i].style.setProperty('opacity', '1', 'important');
              inners[i].style.setProperty('visibility', 'visible', 'important');
              inners[i].style.setProperty('transform', 'none', 'important');
            }
          }
        }
      });
    }, 150);
  });
})();
