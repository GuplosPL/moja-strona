async function sha256Hex(str) {
    const data = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function json(obj) {
    return new Response(JSON.stringify(obj), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
}

export async function onRequest(context) {
    const { env, request } = context;
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const key = 'count';
    const ua = request.headers.get('user-agent') || '';

    const current = parseInt(await env.COUNTER.get(key), 10) || 0;

    if (/bot|crawler|spider|scrape|scrapy|curl|wget|python|go-http|headless|axios|java|httpclient|node-fetch/i.test(ua)) {
        return json({ count: current });
    }

    if (action === 'increment') {
        const ip = request.headers.get('cf-connecting-ip') || 'unknown';
        const rateKey = `rl:${ip}`;
        const last = parseInt(await env.COUNTER.get(rateKey), 10) || 0;
        if (Date.now() - last < 1800000) {
            return json({ count: current });
        }

        const proof = request.headers.get('x-proof') || '';
        const [tsStr, nonce] = proof.split(':');
        const ts = parseInt(tsStr, 10);
        if (!ts || !nonce || isNaN(ts) || Math.abs(Date.now() - ts) > 120000) {
            return json({ count: current });
        }
        const hash = await sha256Hex(`${ts}:${nonce}`);
        if (!hash.startsWith('000')) {
            return json({ count: current });
        }

        await env.COUNTER.put(rateKey, String(Date.now()));
        const count = current + 1;
        await env.COUNTER.put(key, String(count));
        return json({ count });
    }

    return json({ count: current });
}
