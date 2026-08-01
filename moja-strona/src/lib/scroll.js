export function smoothScroll(targetY, duration = 800) {
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

export function initSmoothAnchors() {
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
}

export function initProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = total > 0 ? (window.scrollY / total) * 100 + '%' : '0%';
            ticking = false;
        });
    });
}

export function initReveal({ hero = false } = {}) {
    const selector = hero ? '.fade-in:not(#hero)' : '.fade-in';
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: hero ? 0.15 : 0.2 });
    document.querySelectorAll(selector).forEach(el => observer.observe(el));
    if (hero) setTimeout(() => document.getElementById('hero')?.classList.add('visible'), 200);
}

export function initSectionHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    if (!sections.length) return;
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });
    sections.forEach(s => sectionObserver.observe(s));
}
