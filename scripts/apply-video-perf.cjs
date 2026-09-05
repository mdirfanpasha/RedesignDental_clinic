const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

console.log('Original length:', html.length);

// 1. Drone video: preload="metadata" -> preload="none"
if (html.includes('id="clinicDroneVideo"')) {
    html = html.replace(
        /(<video id="clinicDroneVideo"[^>]*?)preload="metadata"/,
        '$1preload="none"'
    );
    console.log('Updated clinicDroneVideo preload to none');
}

// 2. Facility video: preload="metadata" -> preload="none"
if (html.includes('id="clinicFacilityVideo"')) {
    html = html.replace(
        /(<video id="clinicFacilityVideo"[^>]*?)preload="metadata"/,
        '$1preload="none"'
    );
    console.log('Updated clinicFacilityVideo preload to none');
}

// 3. Testimonial videos t1, t2, t3, t4:
// Replace src="assets/video/t*.mp4" ... preload="metadata" with data-src="assets/video/t*.mp4" ... preload="none"
['t1', 't2', 't3', 't4'].forEach(id => {
    const pattern = new RegExp(
        `(<video class="hybrid-card_video"\\s+)src="(assets\\/video\\/${id}\\.mp4)"([\\s\\S]*?)preload="metadata"`,
        'g'
    );
    if (pattern.test(html)) {
        html = html.replace(pattern, `$1data-src="$2"$3preload="none"`);
        console.log(`Updated testimonial video ${id} to lazy data-src`);
    } else {
        console.log(`Pattern not matched for ${id}`);
    }
});

// 4. YouTube iframes: add loading="lazy" if not present
['yt-player-1', 'yt-player-2', 'yt-player-3'].forEach(ytId => {
    const ytRegex = new RegExp(`(<iframe id="${ytId}"[\\s\\S]*?)(style=)`, 'g');
    if (html.includes(`id="${ytId}"`) && !html.includes(`id="${ytId}" loading="lazy"`)) {
        html = html.replace(ytRegex, '$1loading="lazy"\n                                        $2');
        console.log(`Added loading="lazy" to ${ytId}`);
    }
});

// 5. Replace the inline script block at bottom of index.html
const oldScriptStart = "// 1. All Website Videos: Autoplay + Default Muted Controller";
const oldScriptEnd = "requestAnimationFrame(updateAwardsCenterZoom);\r\n                }\r\n            }\r\n        })();";
const oldScriptEndLF = "requestAnimationFrame(updateAwardsCenterZoom);\n                }\n            }\n        })();";

const newScript = `// Ambient Video Controller: IntersectionObserver for Clinic & Drone Videos
            var droneVid = document.getElementById('clinicDroneVideo');
            var droneBtn = document.getElementById('droneVideoPlayBtn');
            var facilityVid = document.getElementById('clinicFacilityVideo');

            [droneVid, facilityVid].forEach(function (v) {
                if (!v) return;
                v.muted = true;
                v.volume = 0;
                v.setAttribute('muted', '');
                v.setAttribute('playsinline', '');
            });

            if ('IntersectionObserver' in window) {
                var ambientVideoObserver = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        var v = entry.target;
                        if (entry.isIntersecting) {
                            if (v.paused) {
                                var p = v.play();
                                if (p !== undefined) p.catch(function () {});
                            }
                        } else {
                            if (!v.paused) {
                                v.pause();
                            }
                        }
                    });
                }, { threshold: 0.2 });

                if (droneVid) ambientVideoObserver.observe(droneVid);
                if (facilityVid) ambientVideoObserver.observe(facilityVid);
            }

            // Drone Video Overlay Play/Pause Button
            if (droneVid && droneBtn) {
                droneBtn.addEventListener('click', function () {
                    if (droneVid.paused) {
                        droneVid.play();
                    } else {
                        droneVid.pause();
                    }
                });
                droneVid.addEventListener('play', function () {
                    droneBtn.style.opacity = '0';
                    droneBtn.style.pointerEvents = 'none';
                });
                droneVid.addEventListener('pause', function () {
                    droneBtn.style.opacity = '1';
                    droneBtn.style.pointerEvents = 'auto';
                });
            }

            // (Why Choose Us & FAQ Accordions managed by assets/js/accordions.js)

            // 4. Interactive Before & After Comparison Sliders
            var baSliders = document.querySelectorAll('.transformation_slider');
            baSliders.forEach(function (slider) {
                var range = slider.querySelector('.transformation_range-input');
                if (!range) return;

                function updateSliderPos(val) {
                    slider.style.setProperty('--pos', val + '%');
                }

                range.addEventListener('input', function () {
                    updateSliderPos(this.value);
                });

                var isDragging = false;

                function handlePointerMove(e) {
                    var rect = slider.getBoundingClientRect();
                    var clientX = e.clientX;
                    if (e.touches && e.touches.length > 0) {
                        clientX = e.touches[0].clientX;
                    }
                    var x = clientX - rect.left;
                    var pct = (x / rect.width) * 100;
                    pct = Math.max(0, Math.min(100, pct));
                    updateSliderPos(pct.toFixed(2));
                    range.value = pct;
                }

                slider.addEventListener('pointerdown', function (e) {
                    isDragging = true;
                    try { slider.setPointerCapture(e.pointerId); } catch (_) { }
                    handlePointerMove(e);
                });

                slider.addEventListener('pointermove', function (e) {
                    if (isDragging) {
                        handlePointerMove(e);
                    }
                });

                slider.addEventListener('pointerup', function (e) {
                    isDragging = false;
                    try { slider.releasePointerCapture(e.pointerId); } catch (_) { }
                });

                slider.addEventListener('pointercancel', function (e) {
                    isDragging = false;
                });
            });

            // 3. Awards Horizontal Scrolling Center Zoom Pop-Out Effect (Observer-Guarded rAF)
            var awardsContainer = document.querySelector('.awards_marquee-container');
            if (awardsContainer) {
                var awardCards = awardsContainer.querySelectorAll('.award_card');
                var isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                if (awardCards.length > 0 && !isReducedMotion) {
                    var isAwardsVisible = false;
                    var awardsRafId = null;

                    function updateAwardsCenterZoom() {
                        if (!isAwardsVisible) return;
                        var containerRect = awardsContainer.getBoundingClientRect();
                        var containerCenter = containerRect.left + containerRect.width / 2;
                        var maxDistance = Math.min(380, containerRect.width * 0.46);

                        for (var i = 0; i < awardCards.length; i++) {
                            var card = awardCards[i];
                            var cardRect = card.getBoundingClientRect();

                            // Skip elements far outside container
                            if (cardRect.right < containerRect.left - 100 || cardRect.left > containerRect.right + 100) {
                                card.style.transform = 'scale(1) translateY(0)';
                                card.style.zIndex = '1';
                                continue;
                            }

                            var cardCenter = cardRect.left + cardRect.width / 2;
                            var distance = Math.abs(containerCenter - cardCenter);

                            if (distance < maxDistance) {
                                var normalized = distance / maxDistance;
                                var factor = Math.pow(Math.cos(normalized * Math.PI * 0.5), 2);
                                var scale = 1.0 + (0.28 * factor);
                                var translateY = -8 * factor;
                                card.style.transform = 'scale(' + scale.toFixed(4) + ') translateY(' + translateY.toFixed(1) + 'px)';
                                card.style.zIndex = factor > 0.05 ? '25' : '1';
                                card.style.boxShadow = factor > 0.05
                                    ? '0 ' + (14 + factor * 26).toFixed(0) + 'px ' + (28 + factor * 32).toFixed(0) + 'px rgba(15, 118, 110, ' + (0.08 + factor * 0.22).toFixed(2) + '), 0 4px 18px rgba(5, 38, 42, 0.08)'
                                    : '0 10px 30px rgba(0,0,0,0.04)';
                                card.style.borderColor = factor > 0.12 ? 'rgba(15, 118, 110, 0.45)' : '#edf2f4';
                            } else {
                                card.style.transform = 'scale(1) translateY(0)';
                                card.style.zIndex = '1';
                                card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.04)';
                                card.style.borderColor = '#edf2f4';
                            }
                        }
                        awardsRafId = requestAnimationFrame(updateAwardsCenterZoom);
                    }

                    if ('IntersectionObserver' in window) {
                        var awardsObserver = new IntersectionObserver(function (entries) {
                            entries.forEach(function (entry) {
                                isAwardsVisible = entry.isIntersecting;
                                if (isAwardsVisible) {
                                    cancelAnimationFrame(awardsRafId);
                                    awardsRafId = requestAnimationFrame(updateAwardsCenterZoom);
                                } else {
                                    cancelAnimationFrame(awardsRafId);
                                }
                            });
                        }, { threshold: 0.05 });
                        awardsObserver.observe(awardsContainer);
                    } else {
                        isAwardsVisible = true;
                        awardsRafId = requestAnimationFrame(updateAwardsCenterZoom);
                    }
                }
            }
        })();`;

if (html.includes(oldScriptStart)) {
    const startIndex = html.indexOf(oldScriptStart);
    const endTarget = html.indexOf("})();\r\n    </script>\r\n    <script src=\"assets/js/story-slider.js", startIndex);
    const endTargetLF = html.indexOf("})();\n    </script>\n    <script src=\"assets/js/story-slider.js", startIndex);
    const endIndex = endTarget !== -1 ? endTarget + 5 : (endTargetLF !== -1 ? endTargetLF + 5 : -1);

    if (startIndex !== -1 && endIndex !== -1) {
        html = html.substring(0, startIndex) + newScript + html.substring(endIndex);
        console.log('Successfully replaced video and awards inline script block!');
    } else {
        console.log('Failed to find end of script block:', { startIndex, endTarget, endTargetLF });
    }
} else {
    console.log('oldScriptStart not found!');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Updated index.html successfully!');
