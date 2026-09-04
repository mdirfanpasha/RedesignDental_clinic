/**
 * Redesign Dental Clinics - Services Carousel Controller
 * Enables smooth horizontal scrolling, next/prev navigation, touch swipe & mouse drag.
 */
(function () {
    function initServicesCarousel() {
        const wrap = document.querySelector('.section_service .service_wrap');
        if (!wrap) return;

        const prevBtn = document.querySelector('.service-nav-btn.is-prev');
        const nextBtn = document.querySelector('.service-nav-btn.is-next');

        function getCardWidth() {
            const card = wrap.querySelector('.service_item-wrap');
            if (card) {
                const style = window.getComputedStyle(card);
                const gap = parseFloat(style.marginRight) || 32;
                return card.offsetWidth + gap;
            }
            return wrap.clientWidth * 0.9;
        }

        function scrollCarousel(delta) {
            const maxScroll = Math.max(0, wrap.scrollWidth - wrap.clientWidth);
            const current = wrap.scrollLeft;
            const clamped = Math.max(0, Math.min(maxScroll, current + delta));

            try {
                wrap.scrollBy({ left: delta, behavior: 'smooth' });
            } catch (e) {}

            // Immediate fallback for environments where smooth scrolling does not execute (headless or reduced motion)
            if (wrap.scrollLeft === current) {
                wrap.scrollTo({ left: clamped, behavior: 'instant' });
            }

            updateNavState();
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function (e) {
                e.preventDefault();
                scrollCarousel(-getCardWidth());
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function (e) {
                e.preventDefault();
                scrollCarousel(getCardWidth());
            });
        }

        function updateNavState() {
            if (!prevBtn || !nextBtn) return;
            const maxScroll = wrap.scrollWidth - wrap.clientWidth - 15;
            const isStart = wrap.scrollLeft <= 15;
            const isEnd = wrap.scrollLeft >= maxScroll;

            prevBtn.disabled = isStart;
            prevBtn.style.opacity = isStart ? '0.35' : '1';
            prevBtn.style.pointerEvents = isStart ? 'none' : 'auto';

            nextBtn.disabled = isEnd;
            nextBtn.style.opacity = isEnd ? '0.35' : '1';
            nextBtn.style.pointerEvents = isEnd ? 'none' : 'auto';
        }

        wrap.addEventListener('scroll', updateNavState, { passive: true });
        window.addEventListener('resize', updateNavState, { passive: true });
        updateNavState();

        // Mouse drag-to-scroll for desktop
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        wrap.addEventListener('mousedown', function (e) {
            if (e.target.closest('a, button, input, textarea')) return;
            isDown = true;
            startX = e.pageX - wrap.offsetLeft;
            scrollLeft = wrap.scrollLeft;
            wrap.style.cursor = 'grabbing';
        });

        window.addEventListener('mouseup', function () {
            if (!isDown) return;
            isDown = false;
            wrap.style.cursor = 'grab';
            updateNavState();
        });

        wrap.addEventListener('mousemove', function (e) {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - wrap.offsetLeft;
            const walk = (x - startX) * 1.5;
            wrap.scrollLeft = scrollLeft - walk;
            updateNavState();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initServicesCarousel);
    } else {
        initServicesCarousel();
    }
})();
