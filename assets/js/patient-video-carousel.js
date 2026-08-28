/**
 * patient-video-carousel.js
 * Manages the Featured Patient Video Experience carousel with YouTube IFrame Player API.
 * Ensures that whenever a video slide transition happens:
 *   - The previously active video is immediately paused and muted.
 *   - All inactive videos remain paused and muted.
 *   - The newly active video starts muted.
 *   - Only ONE video can ever be audible at any given time.
 */
(function () {
  'use strict';

  function initCarousel() {
    var carousel = document.querySelector('.patient-video-carousel');
    if (!carousel) return;

    var track = carousel.querySelector('.patient-video-track');
    var slides = Array.from(carousel.querySelectorAll('.patient-video-slide'));
    var iframes = Array.from(carousel.querySelectorAll('.patient-video-slide iframe'));
    var prevBtn = carousel.querySelector('.patient-video-arrow.prev');
    var nextBtn = carousel.querySelector('.patient-video-arrow.next');
    var dots = Array.from(carousel.querySelectorAll('.patient-video-dot'));

    var totalVideos = slides.length; // 3
    var currentIndex = 0;
    var ytPlayers = {};

    // Safe pause & mute for a specific index (via YT API + postMessage fallback)
    function stopAndMuteVideo(idx) {
      // 1. YouTube Player API method
      if (ytPlayers[idx]) {
        try {
          ytPlayers[idx].pauseVideo();
          ytPlayers[idx].mute();
        } catch (e) {}
      }

      // 2. Direct postMessage fallback (guaranteed to work across origins without API load delay)
      var iframe = iframes[idx];
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
        } catch (e) {}
      }
    }

    // Ensure inactive videos are paused & muted, and active is muted by default
    function handleSlideAudioChange(oldIndex, newIndex) {
      // Mute and pause old video immediately
      if (typeof oldIndex === 'number' && oldIndex !== newIndex) {
        stopAndMuteVideo(oldIndex);
      }

      // Mute all other videos to guarantee no background audio
      slides.forEach(function (_, idx) {
        if (idx !== newIndex) {
          stopAndMuteVideo(idx);
        }
      });

      // Ensure newly active video is in muted state
      if (ytPlayers[newIndex]) {
        try { ytPlayers[newIndex].mute(); } catch (e) {}
      }
      var newIframe = iframes[newIndex];
      if (newIframe && newIframe.contentWindow) {
        try {
          newIframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
        } catch (e) {}
      }
    }

    function goToSlide(index) {
      var oldIndex = currentIndex;
      currentIndex = (index + totalVideos) % totalVideos;

      // Slide transition
      if (track) {
        track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
      }

      // Update dots (active dot expands to 28px #0D9488, inactive are 10px white-35)
      dots.forEach(function (dot, idx) {
        if (idx === currentIndex) {
          dot.classList.add('active');
          dot.style.width = '28px';
          dot.style.background = '#0D9488';
        } else {
          dot.classList.remove('active');
          dot.style.width = '10px';
          dot.style.background = 'rgba(255, 255, 255, 0.35)';
        }
      });

      // Handle audio: Pause & Mute previous, prepare new
      handleSlideAudioChange(oldIndex, currentIndex);
    }

    // Initialize YouTube IFrame API
    function initYTPlayers() {
      iframes.forEach(function (iframe, idx) {
        if (iframe.id && window.YT && window.YT.Player) {
          try {
            ytPlayers[idx] = new window.YT.Player(iframe.id, {
              events: {
                onReady: function (e) {
                  try { e.target.mute(); } catch (err) {}
                }
              }
            });
          } catch (err) {}
        }
      });
    }

    if (window.YT && window.YT.Player) {
      initYTPlayers();
    } else {
      var prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () {
        if (typeof prevCallback === 'function') prevCallback();
        initYTPlayers();
      };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        var firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(tag, firstScript);
      }
    }

    // Button navigation
    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        goToSlide(currentIndex + 1);
      });
    }

    // Dot navigation
    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function (e) {
        e.preventDefault();
        goToSlide(idx);
      });
    });

    // Touch / Swipe Navigation on mobile
    var startX = 0;
    var endX = 0;
    var frame = carousel.querySelector('.patient-video-frame');

    if (frame) {
      frame.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
      }, { passive: true });

      frame.addEventListener('touchend', function (e) {
        endX = e.changedTouches[0].clientX;
        var diffX = startX - endX;
        if (Math.abs(diffX) > 45) {
          if (diffX > 0) {
            goToSlide(currentIndex + 1);
          } else {
            goToSlide(currentIndex - 1);
          }
        }
      }, { passive: true });
    }

    // Arrow hover styles
    var arrows = [prevBtn, nextBtn].filter(Boolean);
    arrows.forEach(function (btn) {
      btn.addEventListener('mouseenter', function () {
        btn.style.background = '#0D9488';
        btn.style.borderColor = '#0D9488';
        btn.style.transform = 'translateY(-50%) scale(1.08)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.background = 'rgba(5, 38, 42, 0.75)';
        btn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        btn.style.transform = 'translateY(-50%) scale(1)';
      });
    });

    // Initialize first slide in muted state
    goToSlide(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }
})();
