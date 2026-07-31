const DISCORD_ID = '751089335998218440';

const statusColors = {
    online: '#23a55a',
    idle: '#f0b232',
    dnd: '#f23f43',
    offline: '#80848e',
};

const statusLabels = {
    online: 'Online',
    idle: 'Zaraz wracam',
    dnd: 'Nie przeszkadzać',
    offline: 'Offline',
};

const activityTypes = {
    0: 'Gra w',
    1: 'Streamuje',
    2: 'Słucha',
    3: 'Ogląda',
    4: 'Niestandardowy',
    5: 'Konkuruje w',
};

function setDiscordPresence(data) {
    const user = data.discord_user;
    const status = data.discord_status;

    const avatar = document.getElementById('discord-avatar');
    const ext = user.avatar ? (user.avatar.startsWith('a_') ? 'gif' : 'png') : 'png';
    const hash = user.avatar || 'embed/avatars/' + (user.discriminator % 5);
    avatar.src = `https://cdn.discordapp.com/${user.avatar ? 'avatars' : 'embed'}/${user.id}/${hash}.${ext}?size=128`;

    document.getElementById('discord-name').textContent = user.global_name || user.username;
    document.getElementById('discord-username').textContent = '@' + user.username;

    const color = statusColors[status] || statusColors.offline;

    const dot = document.getElementById('discord-status-dot');
    dot.style.background = color;
    dot.style.boxShadow = `0 0 8px ${color}, 0 0 20px ${color}66`;

    document.getElementById('discord-status-text').textContent = statusLabels[status] || 'Offline';
    const badge = document.getElementById('discord-status-badge');
    const dot2 = badge.querySelector('span');
    dot2.style.background = color;
    dot2.style.boxShadow = `0 0 6px ${color}, 0 0 14px ${color}66`;

    const activityDiv = document.getElementById('discord-activity');
    const spotify = data.listening_to_spotify && data.spotify;
    const activity = data.activities && !spotify && data.activities.find(a => a.type === 0);

    if (spotify) {
        activityDiv.classList.remove('hidden');
        const iconDiv = document.getElementById('activity-icon');
        iconDiv.innerHTML = `<img src="https://i.scdn.co/image/${spotify.album_art_url.split('/').pop()}" alt="" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML=''">`;
        document.getElementById('activity-name').textContent = `Słucha ${spotify.song}`;
        document.getElementById('activity-detail').textContent = `${spotify.artist} · ${spotify.album}`;
    } else if (activity) {
        activityDiv.classList.remove('hidden');
        const iconDiv = document.getElementById('activity-icon');
        if (activity.assets && activity.assets.large_image) {
            const img = activity.assets.large_image;
            const src = img.startsWith('mp:')
                ? `https://media.discordapp.net/${img.slice(3)}`
                : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
            iconDiv.innerHTML = `<img src="${src}" alt="" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML=''">`;
        } else {
            iconDiv.innerHTML = '';
        }
        const prefix = activityTypes[activity.type] || '';
        document.getElementById('activity-name').textContent = prefix ? `${prefix} ${activity.name}` : activity.name;
        document.getElementById('activity-detail').textContent = activity.details || '';
    } else {
        activityDiv.classList.add('hidden');
    }
}

function fetchPresence() {
    fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}?_=${Date.now()}`)
        .then(r => r.json())
        .then(res => {
            if (res.data) setDiscordPresence(res.data);
        })
        .catch(() => {});
}

fetchPresence();
setInterval(fetchPresence, 10000);

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            const targetPos = target.getBoundingClientRect().top + window.scrollY - 80;
            smoothScroll(targetPos, 900);
        }
    });
});

function smoothScroll(targetY, duration = 800) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp - 30;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 1.6);
        window.scrollTo(0, startY + diff * ease);
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

(function moveNewFirst() {
    const grid = document.querySelector('#gallery .grid');
    if (!grid) return;
    const newItems = grid.querySelectorAll('.gallery-item[data-new]');
    for (let i = newItems.length - 1; i >= 0; i--) {
        grid.insertBefore(newItems[i], grid.firstChild);
    }
})();

const galleryItems = [...document.querySelectorAll('.gallery-item')];
let currentIndex = 0;
let lastThumb = null;
let navTimeout = null;

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
    animateLightbox(item, item.querySelector('img').src);
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

        const newSrc = item.querySelector('img').src;
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
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

// Scroll animations
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in:not(#hero)').forEach(el => observer.observe(el));
setTimeout(() => document.getElementById('hero').classList.add('visible'), 200);

// Language
const translations = {
    pl: {
        'nav-about': 'O mnie', 'nav-gallery': 'Galeria', 'nav-faq': 'FAQ', 'nav-contact': 'Kontakt',
        'hero-tagline': 'Virtual Photographer, Cinematographer & Editor',
        'hero-cta': 'Zobacz prace', 'hero-write': 'Napisz',
        'about-title': 'O mnie', 'about-text': 'Tutaj informacje beda o mnie',
        'stat-photos': 'zdjęć',
        'gallery-title': 'Galeria', 'gallery-count': '8 zdjęć', 'new-badge': 'Ostatnio przesłane',
        'contact-title': 'Kontakt', 'contact-discord': 'Discord – Guplos PL', 'contact-email-copy': 'Skopiowano!', 'footer-visits': 'odwiedzin',
        'theme-dark': 'Czarny',
    },
    en: {
        'nav-about': 'About', 'nav-gallery': 'Gallery', 'nav-faq': 'FAQ', 'nav-contact': 'Contact',
        'hero-tagline': 'Virtual Photographer, Cinematographer & Editor',
        'hero-cta': 'View work', 'hero-write': 'Write',
        'about-title': 'About', 'about-text': 'Information about me will be here',
        'stat-photos': 'photos',
        'gallery-title': 'Gallery', 'gallery-count': '8 photos', 'new-badge': 'Recently uploaded',
        'contact-title': 'Contact', 'contact-discord': 'Discord – Guplos PL', 'contact-email-copy': 'Copied!', 'footer-visits': 'visits',
        'theme-dark': 'Dark',
    }
};
let currentLang = localStorage.getItem('lang') || (navigator.language.startsWith('pl') ? 'pl' : 'en');
const langToggle = document.getElementById('lang-toggle');
const langToggleMobile = document.getElementById('lang-toggle-mobile');

// Theme switcher
const themeBtns = [document.getElementById('theme-btn'), document.getElementById('theme-btn-mobile')].filter(Boolean);
const themeMenus = [document.getElementById('theme-menu'), document.getElementById('theme-menu-mobile')].filter(Boolean);
let currentTheme = localStorage.getItem('theme') || 'oled';
if (currentTheme !== 'dark' && currentTheme !== 'oled') currentTheme = 'oled';
function applyTheme(t, save = true) {
    currentTheme = t;
    document.documentElement.setAttribute('data-theme', t);
    if (save) localStorage.setItem('theme', t);
    themeMenus.forEach(m => m.querySelectorAll('.theme-check').forEach(c => c.classList.add('hidden')));
    themeMenus.forEach(m => {
        const opt = m.querySelector(`[data-theme-opt="${t}"]`);
        if (opt) opt.querySelector('.theme-check').classList.remove('hidden');
    });
    if (typeof initParticles === 'function' && !window.matchMedia('(hover: none), (pointer: coarse)').matches) initParticles();
}
themeBtns.forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation();
    const menu = btn.id === 'theme-btn' ? themeMenus[0] : themeMenus[1];
    themeMenus.forEach(m => { if (m !== menu) m.classList.add('hidden'); });
    menu.classList.toggle('hidden');
}));
themeMenus.forEach(menu => menu.querySelectorAll('[data-theme-opt]').forEach(opt => {
    opt.addEventListener('click', e => {
        e.stopPropagation();
        applyTheme(opt.dataset.themeOpt);
        menu.classList.add('hidden');
    });
}));
document.addEventListener('click', () => themeMenus.forEach(m => m.classList.add('hidden')));
applyTheme(currentTheme, false);

const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.querySelector('.mobile-menu-wrap');
menuBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.contains('grid-rows-[1fr]');
    mobileMenu.classList.toggle('grid-rows-[1fr]', !open);
    menuBtn.classList.toggle('active', !open);
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('grid-rows-[1fr]');
    menuBtn.classList.remove('active');
}));
function toggleLang() {
    currentLang = currentLang === 'pl' ? 'en' : 'pl';
    applyLang();
}
function applyLang() {
    document.documentElement.lang = currentLang;
    const label = currentLang === 'pl' ? 'EN' : 'PL';
    if (langToggle) langToggle.textContent = label;
    if (langToggleMobile) langToggleMobile.textContent = label;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[currentLang] && translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    localStorage.setItem('lang', currentLang);
}
if (langToggle) langToggle.addEventListener('click', toggleLang);
if (langToggleMobile) langToggleMobile.addEventListener('click', toggleLang);
applyLang();

// Email copy
document.getElementById('email-btn').addEventListener('click', function() {
    navigator.clipboard.writeText('kolanop987@gmail.com');
    this.textContent = translations[currentLang]['contact-email-copy'] || 'Skopiowano!';
    setTimeout(() => { this.textContent = 'kolanop987@gmail.com'; }, 2000);
});

// Progress bar
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
});

// Typing effect
function typeText(el, text, speed = 50) {
    el.textContent = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}
const heroTagline = document.querySelector('[data-i18n="hero-tagline"]');
const taglineText = heroTagline.textContent;
const heroCheck = setInterval(() => {
    if (document.getElementById('hero').classList.contains('visible')) {
        clearInterval(heroCheck);
        setTimeout(() => typeText(heroTagline, taglineText, 45), 400);
    }
}, 100);

// Particles
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
function initParticles() {
    if (typeof tsParticles === 'undefined') return;
    try {
        const color = getComputedStyle(document.documentElement).getPropertyValue('--particle').trim() || '#ffffff';
        tsParticles.load('particles-js', {
            fpsLimit: 60,
            particles: {
                number: { value: 40, density: { enable: true } },
                color: { value: color },
                opacity: { value: 0.25, random: true },
                size: { value: 2, random: true },
                move: { enable: true, speed: 0.4, direction: 'none', random: true },
                links: { enable: true, distance: 150, color: color, opacity: 0.08, width: 1 },
            },
            interactivity: { events: { onHover: { enable: true, mode: 'grab' } }, modes: { grab: { distance: 150, links: { opacity: 0.15 } } } },
            background: { color: 'transparent' },
        });
    } catch (e) {}
}
if (!isTouch) initParticles();

// Visit counter
const counterEl = document.getElementById('visit-count');
const visited = localStorage.getItem('visited');
const action = visited ? '' : '?action=increment';

async function getProof() {
    const ts = Date.now();
    for (let nonce = 0; nonce < 500000; nonce++) {
        const data = new TextEncoder().encode(`${ts}:${nonce}`);
        const hash = await crypto.subtle.digest('SHA-256', data);
        const hex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
        if (hex.startsWith('000')) return `${ts}:${nonce}`;
    }
    return '';
}

async function loadCount() {
    const headers = {};
    if (action) headers['x-proof'] = await getProof();
    fetch('/api/count' + action, { headers })
        .then(r => r.json())
        .then(data => {
            if (counterEl) counterEl.textContent = data.count;
            if (!visited) localStorage.setItem('visited', '1');
        })
        .catch(() => {});
}
loadCount();

// Smooth anchor highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
            });
        }
    });
}, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });
sections.forEach(s => sectionObserver.observe(s));

// 3D tilt
if (!isTouch) document.querySelectorAll('.gallery-item').forEach(item => {
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

// Click sparkle
if (!isTouch) document.addEventListener('click', e => {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--particle').trim() || '#ffffff';
    const colors = [color, color, color, color, color, color];
    for (let i = 0; i < 14; i++) {
        const dot = document.createElement('div');
        const size = 4 + Math.random() * 6;
        const angle = Math.random() * 360;
        const dist = 40 + Math.random() * 80;
        dot.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;border-radius:50%;background:${colors[Math.floor(Math.random() * colors.length)]};pointer-events:none;z-index:9999;transition:all 0.6s cubic-bezier(0,.8,.5,1);opacity:1;`;
        document.body.appendChild(dot);
        requestAnimationFrame(() => {
            dot.style.transform = `translate(${Math.cos(angle) * dist}px,${Math.sin(angle) * dist}px)`;
            dot.style.opacity = '0';
        });
        setTimeout(() => dot.remove(), 700);
    }
});


document.getElementById('share-btn').addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({ title: 'Guplos PL', url: window.location.href });
    } else {
        navigator.clipboard.writeText(window.location.href);
        const btn = document.getElementById('share-btn');
        const orig = btn.innerHTML;
        btn.innerHTML = 'Skopiowano link!';
        setTimeout(() => btn.innerHTML = orig, 2000);
    }
});

// Snowflakes
(function() {
    const now = new Date();
    if (now.getMonth() !== 11) return;
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9990;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let W, H;
    const reduce = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const COUNT = reduce ? 25 : 55;
    const flakes = [];
    function rand(a, b) { return a + Math.random() * (b - a); }
    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function makeFlake(init) {
        return {
            x: rand(0, W),
            y: init ? rand(0, H) : rand(-20, -5),
            r: rand(1.5, 4.5),
            vy: rand(0.5, 1.8),
            vx: rand(-0.4, 0.4),
            sway: rand(0, Math.PI * 2),
            swaySpeed: rand(0.01, 0.03),
            swayAmp: rand(10, 35),
            o: rand(0.3, 0.9)
        };
    }
    function init() {
        resize();
        flakes.length = 0;
        for (let i = 0; i < COUNT; i++) flakes.push(makeFlake(true));
    }
    let last = 0;
    function tick(t) {
        const dt = Math.min((t - last) / 16.67, 3) || 1;
        last = t;
        ctx.clearRect(0, 0, W, H);
        for (const f of flakes) {
            f.sway += f.swaySpeed * dt;
            f.y += f.vy * dt;
            f.x += f.vx * dt + Math.sin(f.sway) * f.swayAmp * 0.02 * dt;
            if (f.y > H + 10) Object.assign(f, makeFlake(false));
            if (f.x > W + 10) f.x = -10;
            if (f.x < -10) f.x = W + 10;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,' + f.o + ')';
            ctx.fill();
        }
        requestAnimationFrame(tick);
    }
    window.addEventListener('resize', init);
    init();
    requestAnimationFrame(tick);
})();

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

console.log(
    '%c   ____ _   _ ____  ____   ___   ____   ____    _    \n  / ___| | | |  _ \\|  _ \\ / _ \\ |___ \\ / ___|  / \\   \n | |  _| | | | |_) | |_) | | | |  __) | |  _  / _ \\  \n | |_| | |_| |  __/|  __/| |_| | / __/| |_| |/ ___ \\ \n  \\____|\\___/|_|   |_|    \\___/ |_____|\\____/_/   \\_\\\n\n%cGUPLOS PL\n%cFotografia, Cinematografia & Edycja',
    'color: #5865F2; font-size: 12px; font-weight: bold;',
    'color: #ffffff; font-size: 14px; font-weight: bold;',
    'color: #8e9297; font-size: 12px;'
);

