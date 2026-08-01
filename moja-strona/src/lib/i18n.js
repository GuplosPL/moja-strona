import { store } from './store.js';

export const translations = {
    pl: {
        // shared nav
        'nav-about': 'O mnie',
        'nav-gallery': 'Galeria',
        'nav-faq': 'FAQ',
        'nav-home': 'Strona główna',
        'tools-colors': 'Kolory producentów',
        'theme-dark': 'Czarny',
        // index
        'hero-tagline': 'Virtual Photographer, Cinematographer & Editor',
        'hero-cta': 'Zobacz prace',
        'hero-write': 'Napisz',
        'about-title': 'O mnie',
        'about-text': 'Tutaj informacje beda o mnie',
        'stat-photos': 'zdjęć',
        'gallery-title': 'Galeria',
        'gallery-count': '8 zdjęć',
        'new-badge': 'Ostatnio przesłane',
        'contact-title': 'Kontakt',
        'contact-discord': 'Discord – Guplos PL',
        'contact-email-copy': 'Skopiowano!',
        'footer-visits': 'odwiedzin',
        // faq
        'faq-title': 'FAQ',
        'faq-sub': 'Często zadawane pytania',
        'gear-title': 'Sprzęt',
        'gear-parts': 'Podzespoły',
        'gear-cpu': 'Procesor',
        'gear-gpu': 'Karta graficzna',
        'gear-ram': 'Pamięć RAM',
        'gear-disk1': 'Dysk 1',
        'gear-disk2': 'Dysk 2',
        'gear-mon1': 'Monitor główny',
        'gear-mon2': 'Monitor drugi',
        'q1': 'Czym się zajmujesz?',
        'a1': 'Zajmuję sie virtualna fotografią w grach takich jak Forza Horizon 6, lecz nie tylko robie tam zdjecia ale również cinematics videos.',
        'q2': 'Jak mogę się z Tobą skontaktować?',
        'a2': 'Najszybciej przez Discorda – guplospl, albo przez social media: Instagram i TikTok.',
        'q3': 'Jakiego sprzętu używasz?',
        'a3': 'Lista mojego sprzętu znajduje się powyżej w sekcji Sprzęt.',
        'q4': 'Czy mogę wykorzystać Twoje zdjęcia?',
        'a4': 'Bez zgody nie – jeśli chcesz je wykorzystać, napisz do mnie i ustalimy warunki.',
        // kolory
        'colors-title': 'Kolory producentów',
        'colors-search': 'Szukaj koloru…',
        'colors-empty': 'Brak wyników',
        'colors-pick': 'Wybierz markę lub wpisz szukany kolor, aby zobaczyć kolory',
    },
    en: {
        // shared nav
        'nav-about': 'About',
        'nav-gallery': 'Gallery',
        'nav-faq': 'FAQ',
        'nav-home': 'Home',
        'tools-colors': 'Producer colors',
        'theme-dark': 'Dark',
        // index
        'hero-tagline': 'Virtual Photographer, Cinematographer & Editor',
        'hero-cta': 'View work',
        'hero-write': 'Write',
        'about-title': 'About',
        'about-text': 'Information about me will be here',
        'stat-photos': 'photos',
        'gallery-title': 'Gallery',
        'gallery-count': '8 photos',
        'new-badge': 'Recently uploaded',
        'contact-title': 'Contact',
        'contact-discord': 'Discord – Guplos PL',
        'contact-email-copy': 'Copied!',
        'footer-visits': 'visits',
        // faq
        'faq-title': 'FAQ',
        'faq-sub': 'Frequently asked questions',
        'gear-title': 'Gear',
        'gear-parts': 'Components',
        'gear-cpu': 'Processor',
        'gear-gpu': 'Graphics card',
        'gear-ram': 'RAM',
        'gear-disk1': 'Disk 1',
        'gear-disk2': 'Disk 2',
        'gear-mon1': 'Main monitor',
        'gear-mon2': 'Second monitor',
        'q1': 'What do you do?',
        'a1': 'I do virtual photography in games such as Forza Horizon 6, but not only that - I also make cinematics videos there.',
        'q2': 'How can I contact you?',
        'a2': 'Fastest via Discord – guplospl, or through social media: Instagram and TikTok.',
        'q3': 'What gear do you use?',
        'a3': 'My gear list is in the Gear section above.',
        'q4': 'Can I use your photos?',
        'a4': 'Not without permission – if you want to use them, message me and we will settle the terms.',
        // kolory
        'colors-title': 'Producer colors',
        'colors-search': 'Search color…',
        'colors-empty': 'No results',
        'colors-pick': 'Choose a brand or type a color to see results',
    }
};

let currentLang = store.get('lang') || (navigator.language.startsWith('pl') ? 'pl' : 'en');
export function getLang() { return currentLang; }

let typingActive = false;
export function setTypingActive(v) { typingActive = v; }

export function applyLang() {
    document.documentElement.lang = currentLang;
    const label = currentLang === 'pl' ? 'EN' : 'PL';
    const langToggle = document.getElementById('lang-toggle');
    const langToggleMobile = document.getElementById('lang-toggle-mobile');
    if (langToggle) langToggle.textContent = label;
    if (langToggleMobile) langToggleMobile.textContent = label;
    const t = translations[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        if (el.dataset.i18n === 'hero-tagline' && typingActive) return;
        const key = el.dataset.i18n;
        if (t[key]) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (t[key]) el.setAttribute('placeholder', t[key]);
    });
    store.set('lang', currentLang);
}

export function toggleLang() {
    currentLang = currentLang === 'pl' ? 'en' : 'pl';
    applyLang();
}

export function initLang() {
    const langToggle = document.getElementById('lang-toggle');
    const langToggleMobile = document.getElementById('lang-toggle-mobile');
    if (langToggle) langToggle.addEventListener('click', toggleLang);
    if (langToggleMobile) langToggleMobile.addEventListener('click', toggleLang);
    applyLang();
}
