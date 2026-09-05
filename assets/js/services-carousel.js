/**
 * Redesign Dental Clinics - Smooth Horizontal Services Carousel Engine
 * 
 * Features:
 * - Continuous, buttery-smooth horizontal sliding animation via requestAnimationFrame & GPU transform
 * - Seamless infinite looping using cloned service cards without jumps or flickers
 * - Controlled, clamped mouse wheel & trackpad scrolling with gentle normalized sensitivity
 * - Prevents runaway acceleration, duplicate listeners, or jumping through multiple cards
 * - Interactive Next / Prev navigation with smooth ease-to-card transitions
 * - Pause on hover / focus, resume on mouseleave / blur
 * - Touch swipe & mouse drag-to-scroll support with seamless velocity handoff
 * - Strictly zero layout shifts or vertical height expansion (maintains the white space fix)
 * - Window resize & document visibility handling
 */
(function () {
  'use strict';

  function initServicesCarousel() {
    var wrap = document.querySelector('.section_service .service_wrap');
    if (!wrap) return;

    // Guard: ensure event listeners and clones are attached only once
    if (wrap._carouselInitted) return;
    wrap._carouselInitted = true;

    var track = wrap.querySelector('.scroll_track');
    var serviceList = wrap.querySelector('.service_list');
    if (!track || !serviceList) return;

    var prevBtn = document.querySelector('.service-nav-btn.is-prev');
    var nextBtn = document.querySelector('.service-nav-btn.is-next');

    // Get original cards
    var originalCards = Array.from(serviceList.querySelectorAll('.service_item-wrap:not(.is-cloned)'));
    if (originalCards.length === 0) return;

    // Clean up any previously appended clones (e.g. if re-initialized)
    var existingClones = serviceList.querySelectorAll('.service_item-wrap.is-cloned');
    existingClones.forEach(function (c) { c.remove(); });

    // Duplicate cards horizontally once for seamless infinite looping
    originalCards.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.classList.add('is-cloned');
      clone.setAttribute('aria-hidden', 'true');
      // Strip IDs from clone to avoid duplicate DOM IDs
      var withIds = clone.querySelectorAll('[id]');
      withIds.forEach(function (el) { el.removeAttribute('id'); });
      serviceList.appendChild(clone);
    });

    // Configuration & State
    var SPEED = 45; // Pixels per second (steady, gentle, readable glide)
    var currentX = 0;
    var targetX = 0;
    var singleSetWidth = 0;
    var isPaused = false;
    var isDragging = false;
    var isNavigating = false;
    var isMouseOverWrap = false;
    var isWheelActive = false;
    var wheelIdleTimer = null;
    var lastTime = 0;
    var dragStartX = 0;
    var dragStartTranslate = 0;
    var dragDistance = 0;
    var animFrameId = null;

    function measure() {
      if (originalCards.length < 1) return;
      var allCards = Array.from(serviceList.children);
      var firstOriginal = originalCards[0];
      var firstClone = allCards[originalCards.length];

      if (firstOriginal && firstClone) {
        singleSetWidth = firstClone.offsetLeft - firstOriginal.offsetLeft;
      }

      // Fallback if offsetLeft measurement isn't ready
      if (!singleSetWidth || singleSetWidth <= 0) {
        var total = 0;
        originalCards.forEach(function (c) {
          var style = window.getComputedStyle(c);
          var mr = parseFloat(style.marginRight) || 0;
          total += c.offsetWidth + mr;
        });
        singleSetWidth = total;
      }
    }

    // Initial measurement
    measure();
    window.addEventListener('load', measure);

    function getCardStep() {
      if (originalCards.length > 1) {
        var step = originalCards[1].offsetLeft - originalCards[0].offsetLeft;
        if (step > 0) return step;
      }
      if (originalCards.length > 0) {
        return originalCards[0].offsetWidth + 32;
      }
      return wrap.clientWidth * 0.9;
    }

    function applyTransform(x) {
      track.style.transform = 'translate3d(' + (-x) + 'px, 0, 0)';
    }

    function normalizeX(x) {
      if (singleSetWidth <= 0) return x;
      return ((x % singleSetWidth) + singleSetWidth) % singleSetWidth;
    }

    // Main 60/120fps Animation Loop
    function tick(time) {
      if (!lastTime) lastTime = time;
      var dt = (time - lastTime) / 1000;
      lastTime = time;

      // Avoid huge jump if tab was backgrounded
      if (dt > 0.1) dt = 0.1;

      if (singleSetWidth <= 0) {
        measure();
      }

      if (!isDragging) {
        if (isNavigating) {
          // Smooth spring ease toward targetX
          var diff = targetX - currentX;
          if (Math.abs(diff) < 0.4) {
            currentX = targetX;
            isNavigating = false;
          } else {
            // Silky smooth damping factor
            currentX += diff * 0.10;
          }
        } else if (!isPaused) {
          // Continuous smooth auto-glide when not manually navigating or paused
          currentX += SPEED * dt;
        }

        // Seamless wrap check
        if (singleSetWidth > 0) {
          if (currentX >= singleSetWidth) {
            currentX -= singleSetWidth;
            if (isNavigating) targetX -= singleSetWidth;
          } else if (currentX < 0) {
            currentX += singleSetWidth;
            if (isNavigating) targetX += singleSetWidth;
          }
        }

        applyTransform(currentX);
      }

      animFrameId = requestAnimationFrame(tick);
    }

    animFrameId = requestAnimationFrame(tick);

    // Prev / Next Navigation
    function advance(delta) {
      measure();
      if (singleSetWidth <= 0) return;

      currentX = normalizeX(currentX);
      targetX = currentX + delta;
      isNavigating = true;
    }

    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.style.opacity = '1';
      nextBtn.style.pointerEvents = 'auto';
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        advance(getCardStep());
      });
    }

    if (prevBtn) {
      prevBtn.disabled = false;
      prevBtn.style.opacity = '1';
      prevBtn.style.pointerEvents = 'auto';
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        advance(-getCardStep());
      });
    }

    // Controlled Mouse Wheel & Trackpad Scroll Handling
    // ONLY intercept genuinely horizontal swipe gestures (deltaX dominant).
    // Vertical mouse wheel / trackpad scroll ALWAYS passes through to normal page scrolling.
    wrap.addEventListener('wheel', function (e) {
      // Don't intercept pinch-zoom (ctrl + wheel)
      if (e.ctrlKey) return;

      var absX = Math.abs(e.deltaX);
      var absY = Math.abs(e.deltaY);

      // Ignore trivial noise
      if (absX < 0.5 && absY < 0.5) return;

      // ONLY intercept horizontal swipe gestures (trackpad horizontal scroll).
      // If vertical scroll is dominant or equal, let the page scroll normally.
      if (absX <= absY) return;

      // We have a genuinely horizontal swipe — handle it for the carousel
      var rawDelta = e.deltaX;

      // Normalize delta mode across browsers and input types
      var modeMultiplier = 1;
      if (e.deltaMode === 1) modeMultiplier = 20; // Lines
      else if (e.deltaMode === 2) modeMultiplier = 300; // Pages

      var normalized = rawDelta * modeMultiplier;

      // Clamp delta per individual event: prevents fast flicks from generating gigantic jumps
      var clamped = Math.max(-50, Math.min(50, normalized));

      // Controlled sensitivity multiplier: reduces speed for precise, buttery control
      var delta = clamped * 0.35;

      // Only prevent default for genuine horizontal swipe to stop horizontal page scroll
      e.preventDefault();

      measure();
      if (singleSetWidth <= 0) return;

      currentX = normalizeX(currentX);

      // Start easing from current position if not currently navigating
      if (!isNavigating) {
        targetX = currentX;
      }

      targetX += delta;

      // Limit queue ahead so fast continuous wheeling cannot queue more than 0.75 of a card width
      var cardStep = getCardStep();
      var maxAhead = cardStep * 0.75;
      if (targetX - currentX > maxAhead) targetX = currentX + maxAhead;
      if (targetX - currentX < -maxAhead) targetX = currentX - maxAhead;

      isNavigating = true;
      isWheelActive = true;
      isPaused = true;

      // Smooth idle resumption
      clearTimeout(wheelIdleTimer);
      wheelIdleTimer = setTimeout(function () {
        isWheelActive = false;
        if (!isMouseOverWrap) {
          isPaused = false;
        }
      }, 350);
    }, { passive: false });

    // Hover & Focus Pause Handling
    wrap.addEventListener('mouseenter', function () {
      isMouseOverWrap = true;
      isPaused = true;
    });

    wrap.addEventListener('mouseleave', function () {
      isMouseOverWrap = false;
      if (!isDragging && !isWheelActive) {
        isPaused = false;
      }
    });

    wrap.addEventListener('focusin', function () { isPaused = true; });
    wrap.addEventListener('focusout', function () {
      if (!isDragging && !isWheelActive && !isMouseOverWrap) {
        isPaused = false;
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener('mouseenter', function () { isPaused = true; });
      prevBtn.addEventListener('mouseleave', function () { if (!isDragging && !isMouseOverWrap) isPaused = false; });
    }
    if (nextBtn) {
      nextBtn.addEventListener('mouseenter', function () { isPaused = true; });
      nextBtn.addEventListener('mouseleave', function () { if (!isDragging && !isMouseOverWrap) isPaused = false; });
    }

    // Mouse Drag Support
    wrap.addEventListener('mousedown', function (e) {
      if (e.target.closest('button, a, input, textarea')) return;
      isDragging = true;
      isPaused = true;
      isNavigating = false;
      dragStartX = e.pageX;
      dragStartTranslate = currentX;
      dragDistance = 0;
      wrap.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var walk = e.pageX - dragStartX;
      dragDistance += Math.abs(walk);
      currentX = dragStartTranslate - walk;
      currentX = normalizeX(currentX);
      applyTransform(currentX);
    });

    window.addEventListener('mouseup', function () {
      if (!isDragging) return;
      isDragging = false;
      wrap.style.cursor = 'grab';
      if (!isMouseOverWrap) {
        isPaused = false;
      }
    });

    // Touch Swipe Support
    wrap.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      isDragging = true;
      isPaused = true;
      isNavigating = false;
      dragStartX = e.touches[0].clientX;
      dragStartTranslate = currentX;
      dragDistance = 0;
    }, { passive: true });

    wrap.addEventListener('touchmove', function (e) {
      if (!isDragging || e.touches.length !== 1) return;
      var walk = e.touches[0].clientX - dragStartX;
      dragDistance += Math.abs(walk);
      currentX = dragStartTranslate - walk;
      currentX = normalizeX(currentX);
      applyTransform(currentX);
    }, { passive: true });

    wrap.addEventListener('touchend', function () {
      if (!isDragging) return;
      isDragging = false;
      if (!isMouseOverWrap) {
        isPaused = false;
      }
    });

    wrap.addEventListener('touchcancel', function () {
      if (!isDragging) return;
      isDragging = false;
      if (!isMouseOverWrap) {
        isPaused = false;
      }
    });

    // Prevent accidental link clicks after dragging
    wrap.addEventListener('click', function (e) {
      if (dragDistance > 10) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // Responsive Resize & Re-measurement
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        measure();
        currentX = normalizeX(currentX);
        applyTransform(currentX);
      }, 100);
    });

    // Handle Tab Visibility
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        lastTime = 0;
      } else {
        lastTime = performance.now();
        measure();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServicesCarousel);
  } else {
    initServicesCarousel();
  }
})();
