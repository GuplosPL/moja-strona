const DISCORD_ID = '751089335998218440';

function json(obj, origin) {
    return new Response(JSON.stringify(obj), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': origin || 'https://guplospl.com',
        },
    });
}

export async function onRequest(context) {
    const { env, request } = context;
    const url = new URL(request.url);
    const base = url.origin;

    const results = { timestamp: Date.now(), checks: {} };

    const [site, count] = await Promise.allSettled([
        (async () => {
            const start = Date.now();
            const res = await fetch(base + '/', { redirect: 'follow', signal: AbortSignal.timeout(8000) });
            return { status: res.ok ? 'online' : 'degraded', responseTime: Date.now() - start, httpCode: res.status };
        })(),
        (async () => {
            const start = Date.now();
            const res = await fetch(base + '/api/count', { signal: AbortSignal.timeout(8000) });
            const data = await res.json();
            return { res, responseTime: Date.now() - start, count: typeof data.count === 'number' ? data.count : null };
        })(),
    ]);

    results.checks.site = site.status === 'fulfilled' ? site.value : { status: 'offline', responseTime: null, httpCode: null };

    if (count.status === 'fulfilled') {
        const { res, responseTime, count: c } = count.value;
        const ct = res.headers.get('content-type') || '';
        results.checks.counter = { status: res.ok && typeof c === 'number' ? 'online' : 'degraded', count: c };
        results.checks.api = { status: res.ok && ct.includes('application/json') ? 'online' : 'degraded', responseTime };
    } else {
        results.checks.counter = { status: 'offline', count: null };
        results.checks.api = { status: 'offline', responseTime: null };
    }

    try {
        const historyKey = 'status_history';
        const history = JSON.parse((await env.COUNTER.get(historyKey)) || '[]');
        if (url.searchParams.get('history') === '1') {
            results.history = history;
        } else {
            history.push({
                t: results.timestamp,
                site: results.checks.site.status,
                ms: results.checks.site.responseTime,
            });
            if (history.length > 100) history.shift();
            await env.COUNTER.put(historyKey, JSON.stringify(history));
        }
    } catch (e) {}

    return json(results, base);
}
