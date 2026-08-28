/**
 * story-slider.js
 * High-performance, responsive multi-card carousel engine for the Our Story section.
 */
(function () {
  'use strict';

  function initStorySlider(slider) {
    var viewport = slider.querySelector('.story-slider_viewport') || slider.querySelector('.story-slider_mask') || slider.querySelector('.w-slider-mask');
    if (!viewport) return;

    var track = slider.querySelector('.story-slider_track');
    var slides = Array.from(slider.querySelectorAll('.story-slider_slide, .w-slide'));
    
    if (slides.length === 0) return;

    // If track doesn't exist yet, wrap slides in track
    if (!track) {
      track = document.createElement('div');
      track.className = 'story-slider_track';
      slides.forEach(function(s) { track.appendChild(s); });
      viewport.appendChild(track);
    }

    var totalSlides = slides.length;
    var currentIndex = 0;
    var autoplayTimer = null;
    var isDragging = false;
    var startX = 0;
    var currentTranslate = 0;
    var prevTranslate = 0;
    var animationID = 0;

    // Controls
    var prevBtn = slider.querySelector('.story-slider_arrow-btn.prev, .story-slider_arrow-wrap.w-slider-arrow-left');
    var nextBtn = slider.querySelector('.story-slider_arrow-btn.next, .story-slider_arrow-wrap.w-slider-arrow-right');
    var dotsContainer = slider.querySelector('.story-slider_dots-wrap, .slide-nav');

    function getVisibleCount() {
      var w = window.innerWidth;
      if (w <= 767) return 1;
      if (w <= 1100) return 2;
      return 3;
    }

    function getMaxIndex() {
      var visible = getVisibleCount();
      return Math.max(0, totalSlides - visible);
    }

    function getSlideStep() {
      if (slides.length === 0) return 0;
      var slideWidth = slides[0].getBoundingClientRect().width;
      var gap = 24;
      if (slides.length > 1) {
        var rect0 = slides[0].getBoundingClientRect();
        var rect1 = slides[1].getBoundingClientRect();
        gap = Math.max(0, rect1.left - rect0.right);
      }
      return slideWidth + gap;
    }

    function setPositionByIndex() {
      var maxIdx = getMaxIndex();
      if (currentIndex > maxIdx) currentIndex = maxIdx;
      if (currentIndex < 0) currentIndex = 0;

      var step = getSlideStep();
      currentTranslate = -(currentIndex * step);
      prevTranslate = currentTranslate;
      setSliderPosition();
      updateControls();
    }

    function setSliderPosition() {
      track.style.transform = 'translateX(' + currentTranslate + 'px)';
    }

    function updateControls() {
      var maxIdx = getMaxIndex();
      
      // Update arrows
      if (prevBtn) {
        if (currentIndex <= 0) {
          prevBtn.setAttribute('disabled', 'true');
          prevBtn.classList.add('is-disabled');
        } else {
          prevBtn.removeAttribute('disabled');
          prevBtn.classList.remove('is-disabled');
        }
      }

      if (nextBtn) {
        if (currentIndex >= maxIdx) {
          nextBtn.setAttribute('disabled', 'true');
          nextBtn.classList.add('is-disabled');
        } else {
          nextBtn.removeAttribute('disabled');
          nextBtn.classList.remove('is-disabled');
        }
      }

      // Update dots
      if (dotsContainer) {
        var dots = dotsContainer.querySelectorAll('.story-slider_dot');
        dots.forEach(function(dot, idx) {
          if (idx === currentIndex) {
            dot.classList.add('is-active');
            dot.setAttribute('aria-current', 'true');
          } else {
            dot.classList.remove('is-active');
            dot.removeAttribute('aria-current');
          }
        });
      }
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      var maxIdx = getMaxIndex();
      var numDots = maxIdx + 1;

      if (numDots <= 1) {
        dotsContainer.style.display = 'none';
        return;
      }
      dotsContainer.style.display = 'flex';

      for (var i = 0; i <= maxIdx; i++) {
        (function(index) {
          var dot = document.createElement('button');
          dot.className = 'story-slider_dot' + (index === currentIndex ? ' is-active' : '');
          dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
          dot.type = 'button';
          dot.addEventListener('click', function(e) {
            e.preventDefault();
            goTo(index);
            resetAutoplay();
          });
          dotsContainer.appendChild(dot);
        })(i);
      }
    }

    function goTo(index) {
      var maxIdx = getMaxIndex();
      currentIndex = Math.max(0, Math.min(index, maxIdx));
      track.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1)';
      setPositionByIndex();
    }

    function next() {
      var maxIdx = getMaxIndex();
      if (currentIndex < maxIdx) {
        goTo(currentIndex + 1);
      } else {
        goTo(0); // loop back to start
      }
    }

    function prev() {
      if (currentIndex > 0) {
        goTo(currentIndex - 1);
      } else {
        var maxIdx = getMaxIndex();
        goTo(maxIdx);
      }
    }

    // Arrow Event Listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        prev();
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        next();
        resetAutoplay();
      });
    }

    // Touch & Mouse Drag
    function touchStart(e) {
      isDragging = true;
      startX = getPositionX(e);
      track.style.transition = 'none';
      animationID = requestAnimationFrame(animation);
      clearInterval(autoplayTimer);
    }

    function touchMove(e) {
      if (!isDragging) return;
      var currentX = getPositionX(e);
      var diff = currentX - startX;
      currentTranslate = prevTranslate + diff;
    }

    function touchEnd() {
      if (!isDragging) return;
      isDragging = false;
      cancelAnimationFrame(animationID);
      var movedBy = currentTranslate - prevTranslate;

      track.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1)';

      if (movedBy < -40) {
        var maxIdx = getMaxIndex();
        if (currentIndex < maxIdx) {
          currentIndex += 1;
        } else {
          currentIndex = 0;
        }
      } else if (movedBy > 40) {
        if (currentIndex > 0) {
          currentIndex -= 1;
        } else {
          var maxIdx = getMaxIndex();
          currentIndex = maxIdx;
        }
      }

      setPositionByIndex();
      startAutoplay();
    }

    function getPositionX(e) {
      return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    function animation() {
      setSliderPosition();
      if (isDragging) requestAnimationFrame(animation);
    }

    viewport.addEventListener('touchstart', touchStart, { passive: true });
    viewport.addEventListener('touchmove', touchMove, { passive: true });
    viewport.addEventListener('touchend', touchEnd);

    // Mouse drag
    viewport.addEventListener('mousedown', touchStart);
    window.addEventListener('mousemove', touchMove);
    window.addEventListener('mouseup', function() {
      if (isDragging) touchEnd();
    });

    // Autoplay
    var autoplay = slider.getAttribute('data-autoplay') !== 'false';
    var delay = parseInt(slider.getAttribute('data-delay'), 10) || 4500;

    function startAutoplay() {
      if (!autoplay) return;
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(function() {
        next();
      }, delay);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    slider.addEventListener('mouseenter', function() { clearInterval(autoplayTimer); });
    slider.addEventListener('mouseleave', function() { startAutoplay(); });

    // Resize Handler
    var resizeTimer;
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        buildDots();
        goTo(currentIndex);
      }, 100);
    }

    window.addEventListener('resize', handleResize);

    // Initialize
    buildDots();
    goTo(0);
    startAutoplay();
  }

  function init() {
    var sliders = document.querySelectorAll('.story_slider, .our-story_element');
    sliders.forEach(function(slider) {
      initStorySlider(slider);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
