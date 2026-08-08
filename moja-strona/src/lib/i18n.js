import { store } from './store.js';

export const translations = {
    pl: {
        // shared nav
        'nav-about': 'O mnie',
        'nav-gallery': 'Galeria',
        'nav-faq': 'FAQ',
        'nav-home': 'Strona główna',
        'nav-collabs': 'Współprace',
        'tools-nav': 'Narzędzia',
        'tools-colors': 'Kolory Producentów',
        'tools-editor': 'Edytor Obrazów',
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
        // cookie
        'cookie-text': 'Ta strona używa plików cookie i localStorage do zapamiętywania Twoich preferencji (motyw, język) oraz zliczania odwiedzin. Klikając „Akceptuję" zgadzasz się na ich użycie.',
        'cookie-accept': 'Akceptuję',
        'cookie-decline': 'Odrzuć',
        // maintenance
        'maintenance-title': 'Przerwa techniczna',
        'maintenance-text': 'Strona jest chwilowo niedostępna z powodu przerwy technicznej. Pracujemy nad przywróceniem usług — sprawdź status strony, aby śledzić postęp prac.',
        'maintenance-status': 'Sprawdź status strony',
        // status
        'status-title': 'Status',
        'status-all-operational': 'Wszystkie systemy działają',
        'status-degraded': 'Częściowe problemy',
        'status-offline': 'Systemy niedostępne',
        'status-checking': 'Sprawdzanie…',
        'status-last-check': 'Ostatnie sprawdzenie',
        'status-refresh': 'Odśwież teraz',
        'status-back': 'Wróć',
        'status-site': 'Strona główna',
        'status-api': 'API',
        'status-counter': 'Licznik odwiedzin',
        'status-discord': 'Discord',
        'status-online': 'Działa',
        'status-ms': 'ms',
        'status-uptime': 'Uptime',
        'status-avg-latency': 'Śr. odpowiedź',
        'status-uptime-check': 'Sprawdź uptime',
        'status-no-history': 'Brak danych historycznych',
        'status-checks': 'kontroli',
        'status-error': 'Błąd sprawdzania',
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
        // wspolprace
        'collabs-title': 'Współprace',
        'collabs-sub': 'Współprace i polecenia',
        'collabs-desc': 'Chcesz się tutaj znaleźć? Napisz do mnie! — wkrótce pojawią się tutaj więcej współprac i poleceń!',
        'ig-badge': 'Partner',
        'ig-title': 'Instant Gaming',
        'ig-desc': 'Kupuję i polecam gry w dobrej cenie. Korzystając z mojego linku wspierasz moją twórczość bez dopłacania niczego — to nic Cię nie kosztuje, a pomaga mi w tworzeniu lepszych treści!',
        'ig-benefits': 'Dlaczego warto?',
        'ig-b1': 'Legalne klucze w atrakcyjnych cenach',
        'ig-b2': 'Szeroki wybór gier i DLC',
        'ig-b3': 'Wspierasz mnie zupełnie za darmo',
        'ig-cta': 'Sprawdź gry na Instant Gaming',
        'ig-link': 'instant-gaming.com',
        // wumpus
        'wumpus-featured': 'Wyróżnione',
        'wumpus-badge': 'Serwer Discord',
        'wumpus-title': 'Wumpus Central',
        'wumpus-desc': 'Fanowskie źródło danych, przecieków, trackerów i wiadomości o platformie Discord stworzonej przez Discord Inc. – nie jesteśmy jednak w żaden sposób powiązani z Discord Inc. Celem serwera jest dystrybucja treści na Discordzie i rozwijanie zainteresowania Discordem wśród jego użytkowników. Staramy się nie być źródłem udostępnianych treści, ale społecznością stworzoną dla użytkowników potrzebujących pomocy z Discordem i odpowiednim miejscem dla osób, do których kierujemy nasze działania.',
        'wumpus-join': 'Dołącz do serwera',
        'wumpus-github': 'GitHub',
        'wumpus-x': 'X (Twitter)',
        // vertex
        'vertex-featured': 'Wyróżnione',
        'vertex-badge': 'Serwer Discord',
        'vertex-title': 'VERTEX',
        'vertex-desc': 'Vertex to tworzona przez Hydrę społeczność dla pasjonatów wirtualnej motoryzacji, montażystów, fotografów i twórców wideo. Serwer powstał z myślą o wzajemnej inspiracji, rozwijaniu umiejętności oraz nawiązywaniu współpracy w niesprzyjającym bezdusznej masówce, wspierającym środowisku.',
        'vertex-discord': 'Dołącz do serwera',
        'vertex-tiktok': 'TikTok',
        // kolory
        'colors-title': 'Kolory Producentów',
        'colors-search': 'Szukaj koloru…',
        'colors-empty': 'Brak wyników',
        'colors-pick': 'Wybierz markę lub wpisz szukany kolor, aby zobaczyć kolory',
        // edytor
        'editor-title': 'Edytor Obrazów',
        'editor-upload': 'Wybierz zdjęcie lub przeciągnij je tutaj',
        'editor-browse': 'Przeglądaj',
        'editor-drop': 'Przeciągnij i upuść zdjęcie',
        'editor-upload-hint': 'PNG, JPG lub WEBP',
        'editor-export': 'Pobierz',
        'editor-reset': 'Resetuj',
        'editor-before': 'Przed',
        'editor-presets': 'Presety',
        'editor-brightness': 'Jasność',
        'editor-contrast': 'Kontrast',
        'editor-saturation': 'Nasycenie',
        'editor-temperature': 'Temperatura',
        'editor-vignette': 'Winieta',
        'editor-grain': 'Ziarno',
        'editor-blur': 'Rozmycie',
        'editor-sepia': 'Sepia',
        'editor-sharpen': 'Ostrość',
        'editor-zoom': 'Zoom',
        'editor-flip': 'Odbicie lustrzane',
        'editor-flip-h': 'Poziomo',
        'editor-flip-v': 'Pionowo',
        'editor-crop': 'Kadruj',
        'editor-crop-apply': 'Zastosuj',
        'editor-crop-cancel': 'Anuluj',
        'editor-format': 'Format',
        'editor-quality': 'Jakość',
        'editor-none': 'Brak',
    },
    en: {
        // shared nav
        'nav-about': 'About',
        'nav-gallery': 'Gallery',
        'nav-faq': 'FAQ',
        'nav-home': 'Home',
        'nav-collabs': 'Collaborations',
        'tools-nav': 'Tools',
        'tools-colors': 'Producer colors',
        'tools-editor': 'Image Editor',
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
        // cookie
        'cookie-text': 'This site uses cookies and localStorage to remember your preferences (theme, language) and to count visits. By clicking "Accept" you agree to their use.',
        'cookie-accept': 'Accept',
        'cookie-decline': 'Decline',
        // maintenance
        'maintenance-title': 'Maintenance break',
        'maintenance-text': 'The website is temporarily unavailable due to a maintenance break. We are working on restoring services — check the website status to track progress.',
        'maintenance-status': 'Check website status',
        // status
        'status-title': 'Status',
        'status-all-operational': 'All systems operational',
        'status-degraded': 'Partial issues',
        'status-offline': 'Systems unavailable',
        'status-checking': 'Checking…',
        'status-last-check': 'Last checked',
        'status-refresh': 'Refresh now',
        'status-back': 'Back',
        'status-site': 'Website',
        'status-api': 'API',
        'status-counter': 'Visit counter',
        'status-discord': 'Discord',
        'status-online': 'Operational',
        'status-ms': 'ms',
        'status-uptime': 'Uptime',
        'status-avg-latency': 'Avg. latency',
        'status-uptime-check': 'Check uptime',
        'status-no-history': 'No history data',
        'status-checks': 'checks',
        'status-error': 'Check error',
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
        // collabs
        'collabs-title': 'Collaborations',
        'collabs-sub': 'Collaborations and recommendations',
        'collabs-desc': 'Want to be here? Write to me! — more collaborations and recommendations will appear here soon!',
        'ig-badge': 'Partner',
        'ig-title': 'Instant Gaming',
        'ig-desc': 'I buy and recommend games at great prices. Using my link supports my work at no extra cost to you — it costs you nothing and helps me create better content!',
        'ig-benefits': 'Why is it worth it?',
        'ig-b1': 'Legal keys at great prices',
        'ig-b2': 'Wide selection of games and DLC',
        'ig-b3': 'Support me completely free',
        'ig-cta': 'Check out games on Instant Gaming',
        'ig-link': 'instant-gaming.com',
        // wumpus
        'wumpus-featured': 'Featured',
        'wumpus-badge': 'Discord Server',
        'wumpus-title': 'Wumpus Central',
        'wumpus-desc': 'A fan-made source of data, leaks, trackers and news about the Discord platform created by Discord Inc. – however, we are in no way affiliated with Discord Inc. The purpose of this server is to distribute content on Discord and grow interest in Discord among its users. We strive not to be a source of the shared content, but a community created for users who need help with Discord and the right place for the people we target our activities at.',
        'wumpus-join': 'Join the server',
        'wumpus-github': 'GitHub',
        'wumpus-x': 'X (Twitter)',
        // vertex
        'vertex-featured': 'Featured',
        'vertex-badge': 'Discord Server',
        'vertex-title': 'VERTEX',
        'vertex-desc': 'Vertex is a community created by Hydra for enthusiasts of virtual motorsports, editors, photographers and video creators. The server was built around mutual inspiration, developing skills and networking in a supportive environment far from the soulless crowd.',
        'vertex-discord': 'Join the server',
        'vertex-tiktok': 'TikTok',
        // kolory
        'colors-title': 'Producer colors',
        'colors-search': 'Search color…',
        'colors-empty': 'No results',
        'colors-pick': 'Choose a brand or type a color to see results',
        // edytor
        'editor-title': 'Image Editor',
        'editor-upload': 'Choose an image or drop it here',
        'editor-browse': 'Browse',
        'editor-drop': 'Drop an image here',
        'editor-upload-hint': 'PNG, JPG or WEBP',
        'editor-export': 'Download',
        'editor-reset': 'Reset',
        'editor-before': 'Before',
        'editor-presets': 'Presets',
        'editor-brightness': 'Brightness',
        'editor-contrast': 'Contrast',
        'editor-saturation': 'Saturation',
        'editor-temperature': 'Temperature',
        'editor-vignette': 'Vignette',
        'editor-grain': 'Grain',
        'editor-blur': 'Blur',
        'editor-sepia': 'Sepia',
        'editor-sharpen': 'Sharpen',
        'editor-zoom': 'Zoom',
        'editor-flip': 'Mirror',
        'editor-flip-h': 'Horizontal',
        'editor-flip-v': 'Vertical',
        'editor-crop': 'Crop',
        'editor-crop-apply': 'Apply',
        'editor-crop-cancel': 'Cancel',
        'editor-format': 'Format',
        'editor-quality': 'Quality',
        'editor-none': 'None',
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
