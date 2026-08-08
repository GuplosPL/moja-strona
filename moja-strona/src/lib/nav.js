export function initNav() {
    const toolsBtn = document.getElementById('tools-btn');
    const toolsMenu = document.getElementById('tools-menu');
    if (toolsBtn && toolsMenu) {
        toolsBtn.addEventListener('click', e => {
            e.stopPropagation();
            toolsMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', () => toolsMenu.classList.add('hidden'));
    }

    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu-wrap');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const open = mobileMenu.classList.contains('open');
            mobileMenu.classList.toggle('open', !open);
            menuBtn.classList.toggle('active', !open);
        });
        mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuBtn.classList.remove('active');
        }));
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuBtn.classList.remove('active');
        });
    }
}
