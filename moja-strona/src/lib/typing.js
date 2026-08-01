import { setTypingActive } from './i18n.js';

function typeText(el, text, speed = 50) {
    setTypingActive(true);
    el.textContent = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            setTypingActive(false);
        }
    }
    type();
}

export function initTyping() {
    const heroTagline = document.querySelector('[data-i18n="hero-tagline"]');
    const hero = document.getElementById('hero');
    if (!heroTagline || !hero) return;
    const taglineText = heroTagline.textContent;
    const heroCheck = setInterval(() => {
        if (hero.classList.contains('visible')) {
            clearInterval(heroCheck);
            setTimeout(() => typeText(heroTagline, taglineText, 45), 400);
        }
    }, 100);
}
