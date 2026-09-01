/**
 * hybrid-testimonials-carousel.js
 * Manages the continuous hybrid testimonial carousel with front-facing video cards.
 * 
 * Features:
 * - Direct video testimonial on front for the first 4 cards (ABDRABALREDHA, ALMAZNI MOHAMMED, JUMAAH TAHAAR, NASSER ABDULWAHAB)
 * - Click video / Play button to play/pause with animated overlay
 * - Unmute/Mute button with intelligent single-audio policy
 * - Flip to review text with "Review" button & flip back with "Back to Video"
 * - Multi-card responsive continuous sliding carousel (desktop 3 cards, tablet 2, mobile 1)
 * - Auto-slide pause during video playback and card interaction
 * - Touch swipe & arrow navigation
 */

(function () {
  'use strict';

  var AUTOPLAY_INTERVAL = 6000;

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
    var activePlayingVideo = null;

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
            v.volume = 0;
            v.setAttribute('muted', '');
          } catch (e) {}

          var card = v.closest('.hybrid-card_inner');
          if (card) {
            card.classList.remove('is-playing');
            var playBtn = card.querySelector('.video-play-btn');
            if (playBtn) {
              var playSpan = playBtn.querySelector('span');
              if (playSpan) playSpan.textContent = 'Play';
            }
            var soundBtn = card.querySelector('.video-sound-btn');
            if (soundBtn) {
              soundBtn.classList.remove('is-unmuted');
              var soundSpan = soundBtn.querySelector('span');
              if (soundSpan) soundSpan.textContent = 'Unmute';
            }
          }
        }
      });
      if (!exceptVideo) {
        activePlayingVideo = null;
      }
    }

    // Flip all cards back to front
    function flipAllBack(exceptCard) {
      slides.forEach(function (slide) {
        var inner = slide.querySelector('.hybrid-card_inner');
        if (inner && inner !== exceptCard) {
          inner.classList.remove('is-flipped');
        }
      });
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

      // On slide change, stop other playing videos
      stopAllVideos();

      // Transform calculation
      var gap = 24;
      var slideWidth = slides[0].offsetWidth;
      track.style.transform = 'translateX(-' + (currentIndex * (slideWidth + gap)) + 'px)';

      updateDots();
    }

    // Attach card handlers
    slides.forEach(function (slide) {
      var inner = slide.querySelector('.hybrid-card_inner');
      if (!inner) return;

      var front = inner.querySelector('.hybrid-card_front');
      var back = inner.querySelector('.hybrid-card_back');
      var video = inner.querySelector('video');
      var playBtn = inner.querySelector('.video-play-btn');
      var soundBtn = inner.querySelector('.video-sound-btn');
      var flipToReviewBtn = inner.querySelector('.card-flip-btn');
      var backToVideoBtns = inner.querySelectorAll('.card-flip-close-btn');

      if (video) {
        function togglePlay() {
          if (video.paused) {
            stopAllVideos(video);
            activePlayingVideo = video;
            pauseAutoPlay();

            video.play().then(function () {
              inner.classList.add('is-playing');
              if (playBtn) {
                var s = playBtn.querySelector('span');
                if (s) s.textContent = 'Pause';
              }
            }).catch(function () {
              video.muted = true;
              video.play().then(function () {
                inner.classList.add('is-playing');
              }).catch(function () {});
            });
          } else {
            video.pause();
            inner.classList.remove('is-playing');
            if (playBtn) {
              var s = playBtn.querySelector('span');
              if (s) s.textContent = 'Play';
            }
            activePlayingVideo = null;
          }
        }

        // Click on video container to toggle play
        var videoContainer = inner.querySelector('.hybrid-card_video-container');
        if (videoContainer) {
          videoContainer.addEventListener('click', function (e) {
            e.stopPropagation();
            togglePlay();
          });
        }

        if (playBtn) {
          playBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            togglePlay();
          });
        }

        // Mute/Unmute sound toggle
        if (soundBtn) {
          soundBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();

            var currentlyMuted = video.muted;

            if (currentlyMuted) {
              // UNMUTE
              stopAllVideos(video);
              video.removeAttribute('muted');
              video.muted = false;
              video.defaultMuted = false;
              video.volume = 1.0;

              if (video.paused) {
                video.play().catch(function () {
                  video.muted = true;
                  soundBtn.classList.remove('is-unmuted');
                  var span = soundBtn.querySelector('span');
                  if (span) span.textContent = 'Unmute';
                });
              }

              inner.classList.add('is-playing');
              soundBtn.classList.add('is-unmuted');
              var span = soundBtn.querySelector('span');
              if (span) span.textContent = 'Mute';
              if (playBtn) {
                var ps = playBtn.querySelector('span');
                if (ps) ps.textContent = 'Pause';
              }
              activePlayingVideo = video;
              pauseAutoPlay();
            } else {
              // MUTE
              video.muted = true;
              video.setAttribute('muted', '');
              video.volume = 0;
              soundBtn.classList.remove('is-unmuted');
              var span = soundBtn.querySelector('span');
              if (span) span.textContent = 'Unmute';
            }
          });
        }

        video.addEventListener('ended', function () {
          inner.classList.remove('is-playing');
          if (playBtn) {
            var s = playBtn.querySelector('span');
            if (s) s.textContent = 'Play';
          }
          activePlayingVideo = null;
          startAutoPlay();
        });
      }

      // Flip to video from written review text (Front -> Back)
      if (flipToReviewBtn) {
        flipToReviewBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          stopAllVideos(video);
          flipAllBack(inner);
          inner.classList.add('is-flipped');
          if (video) {
            activePlayingVideo = video;
            pauseAutoPlay();
            video.play().then(function () {
              inner.classList.add('is-playing');
              if (playBtn) {
                var s = playBtn.querySelector('span');
                if (s) s.textContent = 'Pause';
              }
            }).catch(function () {
              video.muted = true;
              video.play().then(function () {
                inner.classList.add('is-playing');
                if (playBtn) {
                  var s = playBtn.querySelector('span');
                  if (s) s.textContent = 'Pause';
                }
              }).catch(function () {});
            });
          }
        });
      }

      // Also allow clicking anywhere on front text card to flip if it's flip enabled
      if (front && inner.classList.contains('is-flip-enabled')) {
        front.addEventListener('click', function (e) {
          if (e.target.closest('button') || e.target.closest('a')) return;
          stopAllVideos(video);
          flipAllBack(inner);
          inner.classList.add('is-flipped');
          if (video) {
            activePlayingVideo = video;
            pauseAutoPlay();
            video.play().then(function () {
              inner.classList.add('is-playing');
              if (playBtn) {
                var s = playBtn.querySelector('span');
                if (s) s.textContent = 'Pause';
              }
            }).catch(function () {
              video.muted = true;
              video.play().then(function () {
                inner.classList.add('is-playing');
                if (playBtn) {
                  var s = playBtn.querySelector('span');
                  if (s) s.textContent = 'Pause';
                }
              }).catch(function () {});
            });
          }
        });
      }

      // Back to written review from video (Back -> Front)
      if (backToVideoBtns && backToVideoBtns.length > 0) {
        backToVideoBtns.forEach(function (btn) {
          btn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (video) {
              video.pause();
              inner.classList.remove('is-playing');
              if (playBtn) {
                var s = playBtn.querySelector('span');
                if (s) s.textContent = 'Play';
              }
              activePlayingVideo = null;
            }
            inner.classList.remove('is-flipped');
          });
        });
      }

      // Keyboard accessibility (Enter / Space)
      slide.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.tagName !== 'BUTTON') {
            e.preventDefault();
            if (video) togglePlay();
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
        if (!activePlayingVideo) {
          goToSlide(currentIndex + 1);
        }
      }, AUTOPLAY_INTERVAL);
    }

    function pauseAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    }

    container.addEventListener('mouseenter', pauseAutoPlay);
    container.addEventListener('mouseleave', function () {
      if (!activePlayingVideo) startAutoPlay();
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
