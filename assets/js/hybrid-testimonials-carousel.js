/**
 * hybrid-testimonials-carousel.js
 * Manages the continuous hybrid testimonial carousel with 3D flip video cards.
 * 
 * Features:
 * - 3D Flip for first 4 items to reveal portrait 9:16 authentic patient videos
 * - Desktop: 3-second hover countdown OR click/tap to flip
 * - Mobile/Tablet: Tap to flip
 * - Multi-card responsive continuous sliding carousel
 * - Intelligent single-audio management (all other videos pause + mute on slide change)
 * - Auto-slide pause during video viewing
 */

(function () {
  'use strict';

  var HOVER_FLIP_DELAY = 3000;
  var AUTOPLAY_INTERVAL = 5000;

  function initHybridCarousel() {
    var section = document.querySelector('.section_testimonial.is-home');
    if (!section) return;

    var container = section.querySelector('.hybrid-testimonial_slider');
    if (!container) return;

    var viewport = container.querySelector('.hybrid-testimonial_viewport');
    var track = container.querySelector('.hybrid-testimonial_track');
    var prevBtn = container.querySelector('.hybrid-testimonial_arrow.prev');
    var nextBtn = container.querySelector('.hybrid-testimonial_arrow.next');
    var dotsWrap = container.querySelector('.hybrid-testimonial_dots');

    if (!track) return;

    var slides = Array.from(track.children);
    var totalSlides = slides.length; // 10
    var currentIndex = 0;
    var autoPlayTimer = null;
    var isUserInteractingWithVideo = false;

    // Responsive visible count
    function getVisibleCount() {
      var width = window.innerWidth;
      if (width >= 1100) return 3;
      if (width >= 768) return 2;
      return 1;
    }

    function getMaxIndex() {
      var visible = getVisibleCount();
      return Math.max(0, totalSlides - visible);
    }

    // Stop and mute all testimonial videos
    function stopAllVideos(exceptVideo) {
      var videos = track.querySelectorAll('video');
      videos.forEach(function (v) {
        if (v !== exceptVideo) {
          try {
            v.pause();
            v.muted = true;
            v.currentTime = 0;
          } catch (e) {}
          // Reset UI sound icon
          var card = v.closest('.hybrid-card_inner');
          if (card) {
            var soundBtn = card.querySelector('.video-sound-btn');
            if (soundBtn) {
              soundBtn.classList.remove('is-unmuted');
            }
          }
        }
      });
    }

    // Flip all cards back to front
    function flipAllBack(exceptCard) {
      slides.forEach(function (slide) {
        var inner = slide.querySelector('.hybrid-card_inner');
        if (inner && inner !== exceptCard) {
          inner.classList.remove('is-flipped');
          var timerBar = slide.querySelector('.hover-timer-bar');
          if (timerBar) timerBar.style.width = '0%';
        }
      });
      isUserInteractingWithVideo = false;
    }

    // Render navigation dots
    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      var maxIdx = getMaxIndex();

      for (var i = 0; i <= maxIdx; i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'hybrid-testimonial_dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to testimonial slide ' + (i + 1));
        dot.dataset.index = i;
        (function (idx) {
          dot.addEventListener('click', function () {
            goToSlide(idx);
          });
        })(i);
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsWrap) return;
      var dots = dotsWrap.querySelectorAll('.hybrid-testimonial_dot');
      dots.forEach(function (d, i) {
        if (i === currentIndex) {
          d.classList.add('active');
        } else {
          d.classList.remove('active');
        }
      });
    }

    // Move to slide
    function goToSlide(index) {
      var maxIdx = getMaxIndex();
      if (index < 0) index = maxIdx;
      if (index > maxIdx) index = 0;

      currentIndex = index;

      // On slide change, stop all videos and reset flipped cards
      stopAllVideos();
      flipAllBack();

      // Transform calculation
      var visible = getVisibleCount();
      var gap = 24;
      var slideWidthPct = 100 / visible;
      var offset = currentIndex * (slideWidthPct);

      track.style.transform = 'translateX(-' + (currentIndex * (100 / visible + (gap / track.offsetWidth) * 100 * (visible > 1 ? 1 : 0))) + '%)';
      // Safe fallback using CSS calc on child width
      var slideWidth = slides[0].offsetWidth;
      track.style.transform = 'translateX(-' + (currentIndex * (slideWidth + gap)) + 'px)';

      updateDots();
    }

    // Attach card flip handlers for video-type cards
    slides.forEach(function (slide) {
      var inner = slide.querySelector('.hybrid-card_inner.is-flip-enabled');
      if (!inner) return;

      var front = inner.querySelector('.hybrid-card_front');
      var back = inner.querySelector('.hybrid-card_back');
      var video = back ? back.querySelector('video') : null;
      var closeBtn = back ? back.querySelector('.card-flip-close-btn') : null;
      var playBtn = back ? back.querySelector('.video-play-btn') : null;
      var soundBtn = back ? back.querySelector('.video-sound-btn') : null;
      var timerBar = front ? front.querySelector('.hover-timer-bar') : null;

      var hoverTimer = null;
      var startTime = 0;
      var animFrame = null;

      function flipToVideo() {
        if (inner.classList.contains('is-flipped')) return;
        stopAllVideos();
        flipAllBack(inner);

        inner.classList.add('is-flipped');
        isUserInteractingWithVideo = true;
        pauseAutoPlay();

        if (timerBar) timerBar.style.width = '0%';

        if (video) {
          video.muted = true;
          video.playsInline = true;
          video.currentTime = 0;
          var p = video.play();
          if (p !== undefined) {
            p.catch(function () {
              video.muted = true;
              video.play().catch(function () {});
            });
          }
        }
      }

      function flipToText() {
        if (!inner.classList.contains('is-flipped')) return;
        inner.classList.remove('is-flipped');
        isUserInteractingWithVideo = false;

        if (video) {
          try {
            video.pause();
            video.muted = true;
            video.currentTime = 0;
          } catch (e) {}
        }
        if (soundBtn) soundBtn.classList.remove('is-unmuted');
        startAutoPlay();
      }

      if (video) {
        video.addEventListener('ended', function () {
          flipToText();
        });
      }

      // Close button on video side
      if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          flipToText();
        });
      }

      // Play/Pause toggle
      if (playBtn && video) {
        playBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          if (video.paused) {
            video.play();
            playBtn.classList.remove('is-paused');
          } else {
            video.pause();
            playBtn.classList.add('is-paused');
          }
        });
      }

      // Mute/Unmute sound toggle
      if (soundBtn && video) {
        soundBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          if (video.muted) {
            stopAllVideos(video); // Mute all other videos
            video.muted = false;
            soundBtn.classList.add('is-unmuted');
          } else {
            video.muted = true;
            soundBtn.classList.remove('is-unmuted');
          }
        });
      }

      // Click to flip on front
      if (front) {
        front.addEventListener('click', function (e) {
          // If not clicking interactive link
          if (e.target.tagName !== 'A') {
            flipToVideo();
          }
        });

        // Desktop 3-second hover timer
        front.addEventListener('mouseenter', function () {
          if (window.innerWidth < 1024 || inner.classList.contains('is-flipped')) return;
          startTime = Date.now();

          function updateTimer() {
            var elapsed = Date.now() - startTime;
            var pct = Math.min(100, (elapsed / HOVER_FLIP_DELAY) * 100);
            if (timerBar) timerBar.style.width = pct + '%';

            if (elapsed >= HOVER_FLIP_DELAY) {
              flipToVideo();
            } else {
              animFrame = requestAnimationFrame(updateTimer);
            }
          }
          animFrame = requestAnimationFrame(updateTimer);
        });

        front.addEventListener('mouseleave', function () {
          if (animFrame) cancelAnimationFrame(animFrame);
          if (timerBar) timerBar.style.width = '0%';
        });
      }

      // Keyboard accessibility (Enter / Space)
      slide.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (inner.classList.contains('is-flipped')) {
            flipToText();
          } else {
            flipToVideo();
          }
        }
      });
    });

    // Carousel buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goToSlide(currentIndex + 1);
      });
    }

    // Touch / Swipe Navigation
    var startX = 0;
    var isDragging = false;

    viewport.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    viewport.addEventListener('touchend', function (e) {
      if (!isDragging) return;
      isDragging = false;
      var endX = e.changedTouches[0].clientX;
      var diffX = startX - endX;

      if (Math.abs(diffX) > 40) {
        if (diffX > 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
      }
    }, { passive: true });

    // Auto-play management
    function startAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(function () {
        if (!isUserInteractingWithVideo) {
          goToSlide(currentIndex + 1);
        }
      }, AUTOPLAY_INTERVAL);
    }

    function pauseAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    }

    container.addEventListener('mouseenter', pauseAutoPlay);
    container.addEventListener('mouseleave', function () {
      if (!isUserInteractingWithVideo) startAutoPlay();
    });

    // Window resize handler
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        renderDots();
        goToSlide(Math.min(currentIndex, getMaxIndex()));
      }, 150);
    });

    // Initialize
    renderDots();
    goToSlide(0);
    startAutoPlay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHybridCarousel);
  } else {
    initHybridCarousel();
  }
})();
