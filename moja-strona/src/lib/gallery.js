import { store } from './store.js';
import { getLang } from './i18n.js';
import { isTouch } from './effects.js';

export function initGallery() {
    const grid = document.querySelector('#gallery .grid');
    if (!grid) return;

    (function moveNewFirst() {
        const newItems = grid.querySelectorAll('.gallery-item[data-new]');
        for (let i = newItems.length - 1; i >= 0; i--) {
            grid.insertBefore(newItems[i], grid.firstChild);
        }
    })();

    const galleryItems = [...grid.querySelectorAll('.gallery-item')];
    const galleryCountEl = document.querySelector('[data-i18n="gallery-count"]');
    if (galleryCountEl) galleryCountEl.textContent = galleryItems.length + ' ' + (getLang() === 'en' ? 'photos' : 'zdjęć');
    let currentIndex = 0;
    let lastThumb = null;
    let navTimeout = null;

    function positionWatermark() {
        const lbImg = document.getElementById('lightbox-img');
        const wm = document.getElementById('lb-watermark');
        if (lbImg.naturalWidth === 0) return;
        const aspectRatio = lbImg.naturalWidth / lbImg.naturalHeight;
        const maxW = window.innerWidth * 0.9;
        const maxH = window.innerHeight * 0.9;
        let finalW, finalH;
        if (aspectRatio > maxW / maxH) {
            finalW = maxW;
            finalH = maxW / aspectRatio;
        } else {
            finalH = maxH;
            finalW = maxH * aspectRatio;
        }
        const finalLeft = (window.innerWidth - finalW) / 2;
        const finalTop = (window.innerHeight - finalH) / 2;
        wm.style.left = (finalLeft + 20) + 'px';
        wm.style.top = (finalTop + finalH - 38) + 'px';
    }

    function animateLightbox(item, src) {
        const thumb = item.querySelector('img');
        const rect = item.getBoundingClientRect();
        const lbImg = document.getElementById('lightbox-img');
        const lb = document.getElementById('lightbox');
        const bg = document.getElementById('lightbox-bg');

        lbImg.src = src;
        lbImg.onload = function() {
            const aspectRatio = lbImg.naturalWidth / lbImg.naturalHeight;
            const maxW = window.innerWidth * 0.9;
            const maxH = window.innerHeight * 0.9;
            let finalW, finalH;
            if (aspectRatio > maxW / maxH) {
                finalW = maxW;
                finalH = maxW / aspectRatio;
            } else {
                finalH = maxH;
                finalW = maxH * aspectRatio;
            }
            const finalLeft = (window.innerWidth - finalW) / 2;
            const finalTop = (window.innerHeight - finalH) / 2;

            Object.assign(lbImg.style, {
                top: rect.top + 'px',
                left: rect.left + 'px',
                width: rect.width + 'px',
                height: rect.height + 'px',
                transform: 'none', objectFit: 'cover',
                borderRadius: '12px', maxWidth: 'none', maxHeight: 'none',
                opacity: '1', visibility: 'visible',
            });

            lb.classList.remove('pointer-events-none');
            bg.classList.remove('opacity-0');
            document.querySelector('.close-btn').style.opacity = '1';
            document.getElementById('lb-prev').style.opacity = '1';
            document.getElementById('lb-next').style.opacity = '1';
            lbImg.offsetHeight;

            Object.assign(lbImg.style, {
                top: finalTop + 'px', left: finalLeft + 'px',
                width: finalW + 'px', height: finalH + 'px',
                objectFit: 'contain', borderRadius: '16px',
            });

            const wm = document.getElementById('lb-watermark');
            wm.style.transform = 'none';
            positionWatermark();
            wm.style.opacity = '0.7';
        };
    }

    function openLightbox(item) {
        currentIndex = galleryItems.indexOf(item);
        lastThumb = item;
        const full = item.querySelector('img').dataset.full;
        animateLightbox(item, full || item.querySelector('img').src);
        preloadNearby();
    }

    function preloadNearby() {
        if (!galleryItems.length) return;
        [currentIndex - 1, currentIndex + 1].forEach(idx => {
            const item = galleryItems[(idx + galleryItems.length) % galleryItems.length];
            const full = item.querySelector('img').dataset.full;
            if (full) { const img = new Image(); img.src = full; }
        });
    }

    function navigateLightbox(dir) {
        const lbImg = document.getElementById('lightbox-img');
        const wm = document.getElementById('lb-watermark');
        const slideOut = dir > 0 ? '80px' : '-80px';

        if (navTimeout) clearTimeout(navTimeout);

        lbImg.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
        lbImg.style.transform = `translateX(${slideOut}) scale(0.92)`;
        lbImg.style.filter = 'blur(6px)';
        lbImg.style.opacity = '0';
        wm.style.transform = `translateX(${slideOut}) scale(0.92)`;
        wm.style.opacity = '0';

        navTimeout = setTimeout(() => {
            currentIndex += dir;
            if (currentIndex < 0) currentIndex = galleryItems.length - 1;
            if (currentIndex >= galleryItems.length) currentIndex = 0;
            const item = galleryItems[currentIndex];
            lastThumb = item;

            const imgEl = item.querySelector('img');
            const newSrc = imgEl.dataset.full || imgEl.src;
            preloadNearby();
            const slideIn = () => {
                lbImg.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
                lbImg.style.transform = 'translateX(0) scale(1)';
                lbImg.style.filter = 'blur(0px)';
                lbImg.style.opacity = '1';
                wm.style.transform = 'translateX(0) scale(1)';
                wm.style.opacity = '0.7';
                positionWatermark();
            };

            lbImg.src = newSrc;
            if (lbImg.complete) {
                slideIn();
            } else {
                lbImg.onload = slideIn;
            }
        }, 260);
    }

    function closeLightbox() {
        const lbImg = document.getElementById('lightbox-img');
        const bg = document.getElementById('lightbox-bg');
        const lb = document.getElementById('lightbox');
        const closeBtn = document.querySelector('.close-btn');

        if (navTimeout) clearTimeout(navTimeout);

        bg.classList.add('opacity-0');
        closeBtn.style.opacity = '0';
        document.getElementById('lb-prev').style.opacity = '0';
        document.getElementById('lb-next').style.opacity = '0';
        document.getElementById('lb-watermark').style.opacity = '0';

        if (lastThumb) {
            const rect = lastThumb.getBoundingClientRect();
            Object.assign(lbImg.style, {
                top: rect.top + 'px', left: rect.left + 'px',
                width: rect.width + 'px', height: rect.height + 'px',
                objectFit: 'cover', borderRadius: '12px', opacity: '0',
            });
            const wm = document.getElementById('lb-watermark');
            wm.style.left = (rect.left + 20) + 'px';
            wm.style.top = (rect.top + rect.height - 38) + 'px';
            setTimeout(() => { wm.style.opacity = '0'; }, 250);
            setTimeout(() => {
                lb.classList.add('pointer-events-none');
                lbImg.style.visibility = 'hidden';
            }, 400);
        } else {
            lbImg.style.opacity = '0';
            setTimeout(() => {
                lb.classList.add('pointer-events-none');
                lbImg.style.visibility = 'hidden';
            }, 300);
        }
    }

    galleryItems.forEach(item => item.addEventListener('click', () => openLightbox(item)));
    document.getElementById('lightbox-bg').addEventListener('click', closeLightbox);
    document.querySelector('.close-btn').addEventListener('click', closeLightbox);
    document.getElementById('lb-prev').addEventListener('click', e => { e.stopPropagation(); navigateLightbox(-1); });
    document.getElementById('lb-next').addEventListener('click', e => { e.stopPropagation(); navigateLightbox(1); });
    document.addEventListener('keydown', e => {
        const lightboxOpen = !document.getElementById('lightbox').classList.contains('pointer-events-none');
        if (e.key === 'Escape' && lightboxOpen) closeLightbox();
        if (e.key === 'ArrowLeft' && lightboxOpen) navigateLightbox(-1);
        if (e.key === 'ArrowRight' && lightboxOpen) navigateLightbox(1);
    });

    if (!isTouch) galleryItems.forEach(item => {
        item.addEventListener('mousemove', e => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            item.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${y * -12}deg)`;
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
            item.style.transition = 'transform 0.4s ease-out';
            setTimeout(() => item.style.transition = '', 400);
        });
    });
}
