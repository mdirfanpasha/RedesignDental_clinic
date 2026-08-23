/**
 * Redesign Dental Clinics — Dr. Suhail Profile 3D Video Flip Component
 * 
 * Interactivity:
 * - Desktop: 3-second hover delay (HOVER_FLIP_DELAY = 3000) OR instant click/tap
 * - Mobile/Tablet: Instant tap/click
 * - Keyboard: Enter or Space
 * - Autoplay: Starts muted on flip
 * - Return: Close button, back click, or auto-return when video ends (with short delay)
 * - State protection: isFlipping lock prevents double flips and loop transitions
 */

(function () {
  'use strict';

  var HOVER_FLIP_DELAY = 3000;
  var hoverTimer = null;
  var isFlipped = false;
  var isFlipping = false;
  var isTouchDevice = false;

  // Detect touch device
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    isTouchDevice = true;
  }

  function initDoctorFlip() {
    var card = document.getElementById('doctor-flip-card');
    var video = document.getElementById('dr-suhail-flip-video');
    var closeBtn = document.getElementById('doctor-flip-close-btn');
    var playBtn = document.getElementById('doc-video-play-btn');
    var soundBtn = document.getElementById('doc-video-sound-btn');
    var soundText = document.getElementById('doc-video-sound-text');
    var progressBar = document.getElementById('doctor-video-progress-fill');
    var timerBar = document.getElementById('doctor-hover-timer-bar');

    if (!card || !video) return;

    // Flip to Video
    function flipToVideo() {
      if (isFlipped || isFlipping) return;
      isFlipping = true;
      clearHoverTimer();

      card.classList.add('is-flipped');
      card.setAttribute('aria-expanded', 'true');
      var backFace = document.getElementById('doctor-flip-back');
      var frontFace = document.getElementById('doctor-flip-front');
      if (backFace) backFace.setAttribute('aria-hidden', 'false');
      if (frontFace) frontFace.setAttribute('aria-hidden', 'true');

      // Video playback setup
      video.muted = true;
      video.playsInline = true;
      video.currentTime = 0;

      // Play video as flip animation executes
      var playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(function () {
          video.muted = true;
          video.play().catch(function () {});
        });
      }

      updatePlayPauseUI(true);
      updateSoundUI(true);

      setTimeout(function () {
        isFlipped = true;
        isFlipping = false;
      }, 900);
    }

    // Flip back to Doctor Photo
    function flipToPhoto() {
      if (!isFlipped || isFlipping) return;
      isFlipping = true;

      // Pause and reset video
      try {
        video.pause();
        video.currentTime = 0;
      } catch (e) {}

      card.classList.remove('is-flipped');
      card.setAttribute('aria-expanded', 'false');
      var backFace = document.getElementById('doctor-flip-back');
      var frontFace = document.getElementById('doctor-flip-front');
      if (backFace) backFace.setAttribute('aria-hidden', 'true');
      if (frontFace) frontFace.setAttribute('aria-hidden', 'false');

      setTimeout(function () {
        isFlipped = false;
        isFlipping = false;
      }, 900);
    }

    function clearHoverTimer() {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
      card.classList.remove('is-hovering');
      if (timerBar) {
        timerBar.style.transition = 'none';
        timerBar.style.width = '0%';
      }
    }

    function startHoverTimer() {
      if (isFlipped || isFlipping || isTouchDevice) return;
      clearHoverTimer();

      card.classList.add('is-hovering');
      if (timerBar) {
        // Trigger CSS transition
        timerBar.style.transition = 'width ' + HOVER_FLIP_DELAY + 'ms linear';
        timerBar.style.width = '100%';
      }

      hoverTimer = setTimeout(function () {
        flipToVideo();
      }, HOVER_FLIP_DELAY);
    }

    // Hover listeners (desktop only)
    card.addEventListener('mouseenter', function () {
      if (!isTouchDevice && !isFlipped) {
        startHoverTimer();
      }
    });

    card.addEventListener('mouseleave', function () {
      if (!isFlipped) {
        clearHoverTimer();
      }
    });

    // Card click: If front face clicked -> flip to video
    card.addEventListener('click', function (e) {
      // If clicking interactive control on back face, ignore
      if (e.target.closest('#doctor-flip-close-btn') || 
          e.target.closest('#doc-video-play-btn') || 
          e.target.closest('#doc-video-sound-btn')) {
        return;
      }

      if (!isFlipped) {
        flipToVideo();
      }
    });

    // Keyboard support (Enter / Space)
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        if (!isFlipped) {
          e.preventDefault();
          flipToVideo();
        }
      } else if (e.key === 'Escape' && isFlipped) {
        e.preventDefault();
        flipToPhoto();
      }
    });

    // Close button click
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        flipToPhoto();
      });
    }

    // Video Ended Listener -> smooth flip back after short pause
    video.addEventListener('ended', function () {
      setTimeout(function () {
        if (isFlipped) {
          flipToPhoto();
        }
      }, 1200);
    });

    // Time Update -> progress bar
    video.addEventListener('timeupdate', function () {
      if (progressBar && video.duration) {
        var pct = (video.currentTime / video.duration) * 100;
        progressBar.style.width = pct + '%';
      }
    });

    // Play / Pause Toggle
    function updatePlayPauseUI(isPlaying) {
      var iconPause = playBtn?.querySelector('.icon-pause');
      var iconPlay = playBtn?.querySelector('.icon-play');
      if (iconPause && iconPlay) {
        iconPause.style.display = isPlaying ? 'block' : 'none';
        iconPlay.style.display = isPlaying ? 'none' : 'block';
      }
    }

    if (playBtn) {
      playBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (video.paused) {
          video.play();
          updatePlayPauseUI(true);
        } else {
          video.pause();
          updatePlayPauseUI(false);
        }
      });
    }

    video.addEventListener('play', function () { updatePlayPauseUI(true); });
    video.addEventListener('pause', function () { updatePlayPauseUI(false); });

    // Sound (Unmute / Mute) Toggle
    function updateSoundUI(isMuted) {
      var iconMuted = soundBtn ? soundBtn.querySelector('.icon-muted') : null;
      var iconUnmuted = soundBtn ? soundBtn.querySelector('.icon-unmuted') : null;
      if (iconMuted && iconUnmuted) {
        iconMuted.style.display = isMuted ? 'block' : 'none';
        iconUnmuted.style.display = isMuted ? 'none' : 'block';
      }
      if (soundText) {
        var key = isMuted ? 'doctor.unmuteVideo' : 'doctor.muteVideo';
        soundText.setAttribute('data-i18n', key);
        if (window.i18n && typeof window.i18n.t === 'function') {
          soundText.textContent = window.i18n.t(key);
        } else {
          soundText.textContent = isMuted ? 'Unmute' : 'Mute';
        }
      }
    }

    if (soundBtn) {
      soundBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        
        var willBeMuted = !video.muted;
        video.muted = willBeMuted;
        video.defaultMuted = willBeMuted;
        
        if (willBeMuted) {
          video.setAttribute('muted', '');
        } else {
          video.removeAttribute('muted');
          video.volume = 1.0;
          var p = video.play();
          if (p !== undefined) {
            p.catch(function () {});
          }
        }
        updateSoundUI(willBeMuted);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDoctorFlip);
  } else {
    initDoctorFlip();
  }
})();
