import { store } from './store.js';

export function initCounter() {
    const counterEl = document.getElementById('visit-count');
    if (!counterEl) return;
    const visited = store.get('visited');
    const action = visited ? '' : '?action=increment';

    async function getProof() {
        const ts = Date.now();
        for (let nonce = 0; nonce < 500000; nonce++) {
            const data = new TextEncoder().encode(`${ts}:${nonce}`);
            const hash = await crypto.subtle.digest('SHA-256', data);
            const hex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
            if (hex.startsWith('000')) return `${ts}:${nonce}`;
        }
        return '';
    }

    async function loadCount() {
        const headers = {};
        if (action) headers['x-proof'] = await getProof();
        fetch('/api/count' + action, { headers })
            .then(r => r.json())
            .then(data => {
                if (counterEl) counterEl.textContent = data.count;
                if (!visited) store.set('visited', '1');
            })
            .catch(() => {});
    }
    loadCount();
}
