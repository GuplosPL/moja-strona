import { store } from './store.js';

let currentTheme = store.get('theme') || 'oled';
if (currentTheme !== 'dark' && currentTheme !== 'oled') currentTheme = 'oled';

export function getTheme() { return currentTheme; }

let onThemeChange = null;
export function setOnThemeChange(fn) { onThemeChange = fn; }

function applyTheme(t, save = true) {
    currentTheme = t;
    document.documentElement.setAttribute('data-theme', t);
    if (save) store.set('theme', t);
    document.querySelectorAll('.theme-check').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll(`[data-theme-opt="${t}"]`).forEach(opt => {
        const check = opt.querySelector('.theme-check');
        if (check) check.classList.remove('hidden');
    });
    if (onThemeChange) onThemeChange();
}

export function initTheme() {
    const themeBtns = [document.getElementById('theme-btn'), document.getElementById('theme-btn-mobile')].filter(Boolean);
    const themeMenus = [document.getElementById('theme-menu'), document.getElementById('theme-menu-mobile')].filter(Boolean);

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
}
