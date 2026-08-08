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
    function updateGalleryCount() {
        if (galleryCountEl) galleryCountEl.textContent = galleryItems.length + ' ' + (getLang() === 'en' ? 'photos' : 'zdjęć');
    }
    updateGalleryCount();
    window.addEventListener('langchange', updateGalleryCount);
    let currentIndex = 0;
    let lastThumb = null;
    let navTimeout = null;

    function positionWatermark() {
        const lbImg = document.getElementById('lightbox-img');
        const wm = document.getElementById('lb-watermark');
        if (lbImg.naturalWidth === 0) return;
        const final = getFinalRect();
        wm.style.left = (final.left + 20) + 'px';
        wm.style.top = (final.top + final.h - 38) + 'px';
    }

    function getFinalRect() {
        const lbImg = document.getElementById('lightbox-img');
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
        return {
            w: finalW, h: finalH,
            left: (window.innerWidth - finalW) / 2,
            top: (window.innerHeight - finalH) / 2,
        };
    }

    function animateLightbox(item, src) {
        const rect = item.getBoundingClientRect();
        const lbImg = document.getElementById('lightbox-img');
        const lb = document.getElementById('lightbox');
        const bg = document.getElementById('lightbox-bg');

        lbImg.src = src;
        lbImg.onload = function() {
            const final = getFinalRect();
            lbImg.style.width = final.w + 'px';
            lbImg.style.height = final.h + 'px';
            lbImg.style.left = final.left + 'px';
            lbImg.style.top = final.top + 'px';
            lbImg.style.maxWidth = 'none';
            lbImg.style.maxHeight = 'none';
            lbImg.style.objectFit = 'contain';
            lbImg.style.borderRadius = '16px';
            lbImg.style.transformOrigin = '0 0';
            lbImg.style.willChange = 'transform, opacity';
            lbImg.style.transition = 'none';
            lbImg.style.transform = `translate(${rect.left - final.left}px, ${rect.top - final.top}px) scale(${rect.width / final.w}, ${rect.height / final.h})`;
            lbImg.style.opacity = '1';
            lbImg.style.visibility = 'visible';
            lb.classList.remove('pointer-events-none');
            bg.classList.remove('opacity-0');
            document.querySelector('.close-btn').style.opacity = '1';
            document.getElementById('lb-prev').style.opacity = '1';
            document.getElementById('lb-next').style.opacity = '1';

            lbImg.offsetHeight;

            lbImg.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            lbImg.style.transform = 'translate(0, 0) scale(1, 1)';

            const wm = document.getElementById('lb-watermark');
            wm.style.transform = 'translate(0, 0) scale(1, 1)';
            wm.style.transformOrigin = '0 0';
            wm.style.opacity = '0.7';
            positionWatermark();
        };
    }

    function preloadNearby() {
        if (!galleryItems.length) return;
        [currentIndex - 1, currentIndex + 1].forEach(idx => {
            const item = galleryItems[(idx + galleryItems.length) % galleryItems.length];
            const src = item.querySelector('img').src;
            const img = new Image();
            img.decode = img.decode || null;
            if (img.decode) { img.src = src; img.decode().catch(() => {}); }
            else { img.src = src; }
        });
    }

    function openLightbox(item) {
        currentIndex = galleryItems.indexOf(item);
        lastThumb = item;
        animateLightbox(item, item.querySelector('img').src);
        preloadNearby();
    }

    function navigateLightbox(dir) {
        const lbImg = document.getElementById('lightbox-img');
        const wm = document.getElementById('lb-watermark');
        const slideOut = dir > 0 ? '60px' : '-60px';

        if (navTimeout) clearTimeout(navTimeout);

        lbImg.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease';
        lbImg.style.transform = `translateX(${slideOut})`;
        lbImg.style.opacity = '0';
        wm.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease';
        wm.style.transform = `translateX(${slideOut})`;
        wm.style.opacity = '0';

        navTimeout = setTimeout(() => {
            currentIndex += dir;
            if (currentIndex < 0) currentIndex = galleryItems.length - 1;
            if (currentIndex >= galleryItems.length) currentIndex = 0;
            const item = galleryItems[currentIndex];
            lastThumb = item;

            const newSrc = item.querySelector('img').src;
            const slideIn = () => {
                lbImg.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease';
                lbImg.style.transform = 'translateX(0)';
                lbImg.style.opacity = '1';
                wm.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease';
                wm.style.transform = 'translateX(0)';
                wm.style.opacity = '0.7';
                positionWatermark();
            };

            lbImg.src = newSrc;
            preloadNearby();
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
            const final = getFinalRect();
            lbImg.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease';
            lbImg.style.transform = `translate(${rect.left - final.left}px, ${rect.top - final.top}px) scale(${rect.width / final.w}, ${rect.height / final.h})`;
            lbImg.style.opacity = '0';
            const wm = document.getElementById('lb-watermark');
            setTimeout(() => { wm.style.opacity = '0'; }, 250);
            setTimeout(() => {
                lb.classList.add('pointer-events-none');
                lbImg.style.visibility = 'hidden';
                lbImg.style.willChange = 'auto';
            }, 400);
        } else {
            lbImg.style.transition = 'opacity 0.3s ease';
            lbImg.style.opacity = '0';
            setTimeout(() => {
                lb.classList.add('pointer-events-none');
                lbImg.style.visibility = 'hidden';
                lbImg.style.willChange = 'auto';
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
