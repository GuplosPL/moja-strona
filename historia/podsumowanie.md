Historia prac nad projektem "moja-strona"
==========================================
Data: 2026-07-30
Użytkownik: Guplos PL

1. Inicjalizacja projektu Cloudflare Pages
   - Stworzenie struktury: index.html, style.css, script.js, wrangler.toml
   - Instalacja Tailwind CSS i konfiguracja
   - Pierwszy deploy na Cloudflare Pages

2. Portfolio fotograficzne (wersja 1)
   - Ciemny motyw z galerią zdjęć i lightboxem
   - Efekty glassmorphism i animowane bloby

3. Portfolio w stylu Discord/guns.lol
   - Czcionka Inter, paleta #5865F2 (blurple)
   - Integracja Discord przez Lanyard API (status, avatar, aktywność)
   - Polski tekst statusów (Zaraz wracam, Nie przeszkadzać)
   - Obsługa Spotify i gier

4. Zmiany wizualne
   - Tło ze zdjęcia z blur + dark overlay
   - Zmiana nazwy na #GOODDAYS i Guplos PL
   - Neonowy glow na tekstach
   - Neonowa poświata na kropkach statusu
   - Próby z efektami świetlnymi (usunięte)

5. Konfiguracja
   - Folder pliki zdjeciowe na zdjęcia
   - Odświeżanie statusu co 10 sekund
   - Płynne przewijanie do sekcji

6. 2026-07-30 - Responsywność i animacje
   - Animacje fade-in przy scrollowaniu sekcji
   - Przycisk "Na górę" w stylu Discord (blurple, rounded-full)
   - Ikony social media: Instagram (#E4405F), TikTok (biały), Spotify (#1DB954) z neonową poświatą
   - Naprawa błędu z crashowaniem skryptu przez brak elementu discord-name

Pliki w projekcie:
- index.html - główna strona
- style.css - wygenerowany Tailwind CSS
- input.css - źródło Tailwinda
- script.js - logika (Discord API, lightbox, smooth scroll)
- wrangler.toml - konfiguracja Cloudflare
- tailwind.config.js - konfiguracja Tailwinda
- package.json - zależności
- tlo.png - zdjęcie w tle
- opencode.json - konfiguracja opencode (pusta)

7. 2026-07-30 - Dalsze poprawki
   - Przycisk "Na górę": powiększony i naprawiony (potem usunięty na życzenie)
   - Ikony social media: powiększone (w-16 h-16, svg 28px), większy odstęp (gap: 10px)
   - Sekcja kontakt: dodany przycisk Discord (link do profilu), email kopiuje do schowka
   - Poprawki tekstu: "Tutaj informacje beda o mnie", statystyki (zdjęć, cinematics, collabs)
   - Stopka: Guplos PL zamiast "Twoje Imię"
   - Efekt fade-in: dodany scale(0.95) + blur(4px) (scale+blur+fade)
   - Hero section: animacja blur na starcie (bez scale/translate)
   - Zmiana tagline: "Photographer, Cinematographer & Editor"
   - Scroll-to-top button: całkowicie usunięty

8. 2026-07-30 - Nowe funkcje
   - Dark mode toggle (przycisk moon/sun w navie) – usunięty na życzenie
   - Language switcher PL/EN (przycisk w navie, podmiana stringów)
   - Lightbox z animacją powiększania (zoom + fade)
   - Naprawa lightboxa – obrazek znika po zamknięciu
   - Neon glow na tytułach sekcji i statystykach
   - Typing effect w hero (tagline pisze się po wejściu)
   - Particles tła (tsParticles – białe kropki z połączeniami)
   - Pasek postępu (progress bar u góry)
   - Lazy loading z skeletonem – dodany i usunięty
   - Licznik odwiedzin (Cloudflare KV + Pages Function)
   - Smooth page reveal (cała strona pojawia się z blur+scale)
   - Parallax na tle i blobach – dodany i usunięty
   - Scroll do góry po odświeżeniu (history.scrollRestoration)
   - Scrollbar ukryty (CSS)
   - Smooth anchor highlight – podświetlanie aktywnej sekcji w navie
   - Nowe zdjęcia (1-4.png) w galerii, proporcja 21:9, 2 kolumny

9. 2026-07-30 - Plik pomysłów
   - Utworzono "potencjalne do zrobienia" z listą przyszłych funkcji

Link do strony: https://moja-strona-yi0.pages.dev

10. 2026-07-30 - Optymalizacje i nowe funkcje
    - Grid galerii zmieniony na lg:grid-cols-2 (zamiast 3)
    - Strzałki nawigacji w lightboxie (prev/next) z klawiszami ← →
    - Animacja zmiany zdjęć w lightboxie (slide-out + blur → slide-in)
    - Przycisk Udostępnij (Web Share API, fallback kopiowanie linku)
    - Tooltipy przy ikonach social media (Instagram, TikTok, Spotify)
    - Custom cursor (strzałka jak Windows, biała, gładka) – dodany i usunięty
    - #GOODDAYS jako link do YouTube (https://www.youtube.com/watch?v=0BdlKkvjEgA)
    - Usunięty easter egg (Konami code)

11. 2026-07-30 - ASCII art w konsoli + pomysły
    - Dodany ASCII art #GOODDAYS w DevTools (F12 → Console)
    - Zapisano nowe pomysły: watermark, sprzęt, Spotify live, motyw sezonowy, dynamiczne tagi, zegar analogowy, szyfrowana sekcja, skin/theme selector, kolaboracje, status Discord w title, smart quotes, tryb offline
    - Plik "potencjalne do zrobienia" rozszerzony o kilkanaście pozycji

12. 2026-07-30 - Ochrona licznika + status
    - Anti-spambot: User-Agent filter, rate limiting (30 min/IP), proof-of-work SHA-256
    - Strona /status – status strony, licznika i Discorda z historią (wykres) i auto-odświeżaniem
    - Link "Status" w stopce

13. 2026-07-30 - Poprawki
    - Tytuł karty zmieniony na "Guplos PL", opisy meta na "Portfolio"
    - Kursor Windowsowy – dodany i usunięty
    - Przycisk "Napisz" otwiera Discorda bezpośrednio
    - ASCII art zmieniony na GUPLOS PL (naprawiony błąd z backtickiem)

14. 2026-07-30 - Watermark
    - Watermark "Guplos PL #GOODDAYS" w lightboxie (70%, 16px)
    - Śledzi zdjęcie przy zamykaniu i przy zmianie strzałkami

15. 2026-07-30 - Nowe zdjęcia + FAQ
    - Dodane zdjęcia 5, 6, 7 do galerii (7 zdjęć, PL/EN)
    - Osobna strona /faq – accordion, ten sam styl, smaczki (particles, sparkle, progress bar, PL/EN)
    - Link FAQ w nawigacji, sitemap zaktualizowany
