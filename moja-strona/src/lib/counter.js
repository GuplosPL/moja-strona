import { store } from './store.js';

export function initCounter() {
    const counterEl = document.getElementById('visit-count');
    if (!counterEl) return;
    const visited = store.get('visited');
    const declined = store.get('cookie-consent') === 'declined';
    const action = visited || declined ? '' : '?action=increment';

    function getProof() {
        return new Promise(resolve => {
            const ts = Date.now();
            const worker = new Worker(new URL('./proof.worker.js', import.meta.url), { type: 'module' });
            worker.onmessage = e => {
                worker.terminate();
                resolve(e.data);
            };
            worker.onerror = () => {
                worker.terminate();
                resolve('');
            };
            worker.postMessage(ts);
        });
    }

    async function loadCount() {
        const headers = {};
        if (action) headers['x-proof'] = await getProof();
        fetch('/api/count' + action, { headers })
            .then(r => r.json())
            .then(data => {
                if (counterEl) counterEl.textContent = data.count;
                if (!visited && data.incremented) store.set('visited', '1');
            })
            .catch(() => {});
    }
    loadCount();
}
