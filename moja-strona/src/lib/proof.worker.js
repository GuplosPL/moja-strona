self.onmessage = async function (e) {
    const ts = e.data;
    for (let nonce = 0; nonce < 100000; nonce++) {
        const data = new TextEncoder().encode(`${ts}:${nonce}`);
        const hash = await crypto.subtle.digest('SHA-256', data);
        const hex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
        if (hex.startsWith('000')) {
            self.postMessage(`${ts}:${nonce}`);
            return;
        }
    }
    self.postMessage('');
};
