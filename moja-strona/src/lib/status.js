import { translations, getLang } from './i18n.js';
import { MAINTENANCE, MAINTENANCE_ETA } from './maintenance.js';

export function initStatus() {
    const colors = {
        online: '#23a55a',
        degraded: '#f0b232',
        offline: '#da373c',
    };
    const T = () => translations[getLang()] || translations.pl;

    function setDot(id, status, pulse) {
        const dot = document.getElementById(id);
        const color = colors[status] || '#4e5058';
        dot.style.background = color;
        dot.style.boxShadow = '0 0 8px ' + color;
        if (pulse) dot.animate(
            [{ opacity: 0.3, transform: 'scale(0.8)' }, { opacity: 1, transform: 'scale(1.25)' }, { opacity: 1, transform: 'scale(1)' }],
            { duration: 500, easing: 'ease-out' }
        );
    }

    function latencyColor(ms) {
        if (ms == null) return 'var(--muted)';
        if (ms < 100) return colors.online;
        if (ms < 300) return colors.degraded;
        return colors.offline;
    }

    function setMs(id, ms) {
        const el = document.getElementById(id);
        el.textContent = ms != null ? ms + ' ' + T()['status-ms'] : '—';
        el.style.color = latencyColor(ms);
    }

    function overall(history) {
        const card = document.getElementById('overall-card');
        const icon = document.getElementById('overall-icon');
        const title = document.getElementById('overall-title');
        const sub = document.getElementById('overall-sub');

        if (!history || history.length === 0) {
            title.textContent = T()['status-all-operational'];
            sub.textContent = new Date().toLocaleString(document.documentElement.lang === 'en' ? 'en-US' : 'pl-PL');
            card.style.borderColor = colors.online;
            icon.style.background = colors.online;
            icon.style.boxShadow = '0 0 20px ' + colors.online;
            return;
        }

        const last = history[history.length - 1];
        let worst = 'online';
        if (document.getElementById('site-dot').style.background === colors.offline ||
            document.getElementById('api-dot').style.background === colors.offline ||
            document.getElementById('counter-dot').style.background === colors.offline) worst = 'offline';
        else if (last.site === 'degraded' ||
            document.getElementById('site-dot').style.background === colors.degraded ||
            document.getElementById('api-dot').style.background === colors.degraded ||
            document.getElementById('counter-dot').style.background === colors.degraded) worst = 'degraded';

        const c = colors[worst];
        title.textContent = worst === 'online' ? T()['status-all-operational'] : worst === 'degraded' ? T()['status-degraded'] : T()['status-offline'];
        sub.textContent = new Date().toLocaleString(document.documentElement.lang === 'en' ? 'en-US' : 'pl-PL');
        card.style.borderColor = c;
        icon.style.background = c;
        icon.style.boxShadow = '0 0 20px ' + c;
    }

    function drawChart(history) {
        const svg = document.getElementById('chart');
        const empty = document.getElementById('chart-empty');
        svg.innerHTML = '';
        if (!history || history.length === 0) {
            svg.classList.add('hidden');
            empty.classList.remove('hidden');
            return;
        }
        svg.classList.remove('hidden');
        empty.classList.add('hidden');

        const last = history.slice(-100);
        const W = 600, H = 80, PAD = 4;
        const maxMs = Math.max(...last.map(e => e.ms || 80), 80);
        const pts = last.map((e, i) => {
            const x = PAD + (i / Math.max(1, last.length - 1)) * (W - 2 * PAD);
            const h = e.site === 'online' ? Math.max(8, (e.ms || 0) / maxMs * (H - 2 * PAD)) : 4;
            const y = H - PAD - h;
            return [x, y, e];
        });

        const ns = 'http://www.w3.org/2000/svg';
        const area = document.createElementNS(ns, 'path');
        area.setAttribute('d', 'M' + pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('') + 'L' + (W - PAD) + ',' + (H - PAD) + 'L' + PAD + ',' + (H - PAD) + 'Z');
        area.setAttribute('fill', 'url(#chart-grad)');
        svg.appendChild(area);

        pts.forEach(p => {
            const rect = document.createElementNS(ns, 'rect');
            rect.setAttribute('x', p[0] - 1.5);
            rect.setAttribute('y', p[1]);
            rect.setAttribute('width', 3);
            rect.setAttribute('height', Math.max(4, H - PAD - p[1]));
            rect.setAttribute('rx', 1.5);
            rect.setAttribute('fill', colors[p[2].site] || '#4e5058');
            rect.setAttribute('opacity', '0.9');
            const label = new Date(p[2].t).toLocaleString(document.documentElement.lang === 'en' ? 'en-US' : 'pl-PL') + ' · ' + (p[2].ms ? p[2].ms + ' ms' : (T()['status-offline']));
            const el = rect;
            el.addEventListener('mouseenter', () => {
                el.setAttribute('opacity', '1');
                el.setAttribute('width', '8');
                el.setAttribute('x', p[0] - 4);
            });
            el.addEventListener('mouseleave', () => {
                el.setAttribute('opacity', '0.9');
                el.setAttribute('width', '3');
                el.setAttribute('x', p[0] - 1.5);
            });
            svg.appendChild(rect);
        });
    }

    function setMaintenance() {
        const dot = document.getElementById('maintenance-dot');
        const detail = document.getElementById('maintenance-detail');
        const eta = document.getElementById('maintenance-eta');
        if (MAINTENANCE) {
            setDot('maintenance-dot', 'degraded', true);
            detail.textContent = T()['maintenance-text'];
            eta.textContent = T()['maintenance-eta'] + ' ' + MAINTENANCE_ETA;
        } else {
            dot.style.background = colors.online;
            dot.style.boxShadow = '0 0 8px ' + colors.online;
            detail.textContent = T()['status-all-operational'];
            eta.textContent = '';
        }
    }

    let lastData = null;
    let lastHistory = null;

    async function loadStatus() {
        try {
            const res = await fetch('/api/status', { cache: 'no-store' });
            const data = await res.json();
            lastData = data;
            renderStatus(data);
        } catch (e) {
            document.getElementById('last-check').textContent = T()['status-error'];
        }
    }

    function renderStatus(data) {
        const site = data.checks.site;
        setDot('site-dot', site.status, true);
        setMs('site-ms', site.responseTime);
        document.getElementById('site-detail').textContent =
            (site.status === 'online' ? T()['status-online'] : site.status) + (site.httpCode ? ' · HTTP ' + site.httpCode : '');

        const api = data.checks.api;
        setDot('api-dot', api.status, true);
        setMs('api-ms', api.responseTime);
        document.getElementById('api-detail').textContent =
            (api.status === 'online' ? T()['status-online'] : api.status);

        const counter = data.checks.counter;
        setDot('counter-dot', counter.status, true);
        document.getElementById('counter-num').textContent = counter.count !== null ? counter.count : '—';
        document.getElementById('counter-detail').textContent =
            (counter.status === 'online' ? T()['status-online'] : counter.status);

        document.getElementById('last-check').textContent =
            T()['status-last-check'] + ': ' + new Date(data.timestamp).toLocaleString(document.documentElement.lang === 'en' ? 'en-US' : 'pl-PL');
    }

    let historyLoaded = false;
    async function loadHistory() {
        if (historyLoaded) return;
        historyLoaded = true;
        try {
            const res = await fetch('/api/status?history=1', { cache: 'no-store' });
            const data = await res.json();
            if (data.history) {
                lastHistory = data.history;
                renderHistory(data.history);
            }
        } catch (e) {}
    }

    function renderHistory(history) {
        drawChart(history);
        const online = history.filter(e => e.site === 'online').length;
        const pct = Math.round(online / history.length * 100);
        document.getElementById('overall-uptime').textContent = pct + '%';
        document.getElementById('overall-uptime').style.color = colors.online;
        const avg = Math.round(history.filter(e => e.ms).reduce((s, e) => s + e.ms, 0) / Math.max(1, history.filter(e => e.ms).length));
        document.getElementById('avg-ms').textContent = avg + ' ' + T()['status-ms'];
        document.getElementById('checks-count').textContent = history.length;
        overall(history);
    }

    function rerenderLang() {
        setMaintenance();
        if (lastData) renderStatus(lastData);
        if (lastHistory) renderHistory(lastHistory);
    }

    document.getElementById('refresh-btn').addEventListener('click', () => {
        historyLoaded = false;
        loadStatus();
        loadHistory();
    });

    window.addEventListener('langchange', rerenderLang);

    loadStatus();
    loadHistory();
    setMaintenance();
    setInterval(loadStatus, 60000);
    document.getElementById('year').textContent = new Date().getFullYear();
}
