const DISCORD_ID = '751089335998218440';

export async function onRequest(context) {
    const { env, request } = context;
    const url = new URL(request.url);
    const base = url.origin;

    const results = { timestamp: Date.now(), checks: {} };

    try {
        const start = Date.now();
        const res = await fetch(base + '/', { redirect: 'follow', signal: AbortSignal.timeout(8000) });
        results.checks.site = {
            status: res.ok ? 'online' : 'degraded',
            responseTime: Date.now() - start,
            httpCode: res.status,
        };
    } catch (e) {
        results.checks.site = { status: 'offline', responseTime: null, httpCode: null };
    }

    try {
        const res = await fetch(base + '/api/count', { signal: AbortSignal.timeout(8000) });
        const data = await res.json();
        results.checks.counter = {
            status: res.ok && typeof data.count === 'number' ? 'online' : 'degraded',
            count: typeof data.count === 'number' ? data.count : null,
        };
    } catch (e) {
        results.checks.counter = { status: 'offline', count: null };
    }

    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`, { signal: AbortSignal.timeout(8000) });
        const data = await res.json();
        const ok = res.ok && data.success && data.data;
        results.checks.discord = {
            status: ok ? 'online' : 'degraded',
            discordStatus: ok ? data.data.discord_status : null,
        };
    } catch (e) {
        results.checks.discord = { status: 'offline', discordStatus: null };
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

    return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
}
