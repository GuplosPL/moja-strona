export function initShare() {
    const shareBtn = document.getElementById('share-btn');
    if (!shareBtn) return;
    shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({ title: 'Guplos PL', url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            const orig = shareBtn.innerHTML;
            shareBtn.innerHTML = 'Skopiowano link!';
            setTimeout(() => shareBtn.innerHTML = orig, 2000);
        }
    });
}
