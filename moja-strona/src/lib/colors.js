import { translations, getLang } from './i18n.js';

export function initColors() {
    const grid = document.getElementById('colors-grid');
    const makesBar = document.getElementById('makes-bar');
    const searchInput = document.getElementById('search-input');
    const emptyMsg = document.getElementById('empty-msg');
    if (!grid || !makesBar || !searchInput || !emptyMsg) return;
    const T = () => translations[getLang()] || translations.pl;

    let allColors = [];
    let allMakes = {};
    let currentMake = null;
    let searchQuery = '';

    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    let pendingBatch = null;
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && pendingBatch) {
            const fn = pendingBatch;
            pendingBatch = null;
            fn();
        }
    }, { rootMargin: '600px' });
    grid.appendChild(sentinel);

    function hslColor(c) {
        const h = Math.round(c.h * 360);
        const s = Math.round(c.s * 100);
        const l = Math.round(c.b * 100);
        return 'hsl(' + h + ',' + s + '%,' + l + '%)';
    }

    function makeCard(c) {
        const card = document.createElement('div');
        card.className = 'rounded-2xl border p-4';
        card.style.cssText = 'background: var(--card); border-color: var(--card-border);';
        const sw = document.createElement('div');
        sw.className = 'swatch rounded-lg h-16 mb-3';
        sw.style.background = hslColor(c);
        card.appendChild(sw);
        const title = document.createElement('h2');
        title.className = 'text-sm font-bold mb-0.5';
        title.style.cssText = 'color: var(--text-bright);';
        title.textContent = c.n;
        card.appendChild(title);
        const sub = document.createElement('p');
        sub.className = 'text-xs mb-3';
        sub.style.cssText = 'color: var(--muted);';
        sub.textContent = c.m + ' · ' + c.t;
        card.appendChild(sub);
        const hslText = document.createElement('p');
        hslText.className = 'text-[11px] font-mono';
        hslText.style.cssText = 'color: var(--muted-2);';
        hslText.textContent = 'H ' + c.h.toFixed(2) + (c.hs === 'L' ? ' L' : ' R') + '  ·  S ' + c.s.toFixed(2) + (c.ss === 'L' ? ' L' : ' R') + '  ·  B ' + c.b.toFixed(2) + (c.bs === 'L' ? ' L' : ' R');
        card.appendChild(hslText);
        return card;
    }

    function render() {
        grid.innerHTML = '';
        grid.appendChild(sentinel);
        pendingBatch = null;
        observer.unobserve(sentinel);
        if (!currentMake && !searchQuery) {
            emptyMsg.textContent = T()['colors-pick'];
            emptyMsg.classList.remove('hidden');
            return;
        }
        let list = allColors;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            list = list.filter(c => c.n.toLowerCase().includes(q) || c.m.toLowerCase().includes(q) || c.t.toLowerCase().includes(q));
        } else if (currentMake) {
            list = list.filter(c => c.m === currentMake);
        }
        if (list.length === 0) {
            emptyMsg.textContent = T()['colors-empty'];
            emptyMsg.classList.remove('hidden');
            return;
        }
        emptyMsg.classList.add('hidden');
        const BATCH = 120;
        let index = 0;
        const nextBatch = () => {
            const doc = document.createDocumentFragment();
            const end = Math.min(index + BATCH, list.length);
            for (; index < end; index++) doc.appendChild(makeCard(list[index]));
            grid.insertBefore(doc, sentinel);
            pendingBatch = index < list.length ? nextBatch : null;
            if (pendingBatch) observer.observe(sentinel);
            else observer.unobserve(sentinel);
        };
        pendingBatch = nextBatch;
        nextBatch();
    }

    function buildTabs() {
        makesBar.innerHTML = '';
        const sorted = Object.keys(allMakes).sort((a, b) => a.localeCompare(b));
        sorted.forEach(m => {
            const btn = document.createElement('button');
            btn.className = 'make-tab';
            btn.textContent = m;
            btn.addEventListener('click', () => {
                currentMake = currentMake === m ? null : m;
                document.querySelectorAll('.make-tab').forEach(b => b.classList.toggle('active', b === btn && currentMake === m));
                render();
            });
            makesBar.appendChild(btn);
        });
    }

    fetch('/narzedzia/kolory.json')
        .then(r => r.json())
        .then(data => {
            allColors = data.colors;
            allMakes = data.makes;
            buildTabs();
            render();
        })
        .catch(() => {
            emptyMsg.textContent = T()['colors-error'] || 'Nie udało się wczytać kolorów';
            emptyMsg.classList.remove('hidden');
        });

    let searchTimer = null;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            searchQuery = searchInput.value.trim();
            currentMake = null;
            document.querySelectorAll('.make-tab').forEach(b => b.classList.remove('active'));
            render();
        }, 400);
    });

    window.addEventListener('langchange', render);
}
