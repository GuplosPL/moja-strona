export function initFaq() {
    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-toggle').addEventListener('click', () => {
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });
}
