export function initStatus() {
    const colors = {
        online: '#23a55a',
        degraded: '#f0b232',
        offline: '#da373c',
    };

    function setDot(id, status) {
        const dot = document.getElementById(id);
        const color = colors[status] || '#4e5058';
        dot.style.background = color;
        dot.style.boxShadow = '0 0 8px ' + color;
    }

    function drawChart(history) {
        const chart = document.getElementById('chart');
        chart.innerHTML = '';
        if (!history || history.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'w-full h-full flex items-center justify-center text-xs'; empty.style.color = 'var(--muted-2)';
            empty.textContent = 'Brak danych historycznych';
            chart.appendChild(empty);
            return;
        }
        const last = history.slice(-50);
        last.forEach(entry => {
            const bar = document.createElement('div');
            const h = entry.site === 'online' ? Math.max(8, 60 - entry.ms / 20) : 6;
            bar.style.width = '4px';
            bar.style.height = h + 'px';
            bar.style.flex = 'none';
            bar.style.borderRadius = '2px';
            bar.style.background = colors[entry.site] || '#4e5058';
            bar.title = new Date(entry.t).toLocaleString('pl-PL') + ' · ' + (entry.ms ? entry.ms + ' ms' : 'offline');
            chart.appendChild(bar);
        });
    }

    async function loadStatus() {
        try {
            const res = await fetch('/api/status', { cache: 'no-store' });
            const data = await res.json();

            const site = data.checks.site;
            setDot('site-dot', site.status);
            document.getElementById('site-ms').textContent = site.responseTime ? site.responseTime + ' ms' : '—';

            const api = data.checks.api;
            setDot('api-dot', api.status);
            document.getElementById('api-ms').textContent = api.responseTime ? api.responseTime + ' ms' : '—';

            const counter = data.checks.counter;
            setDot('counter-dot', counter.status);
            document.getElementById('counter-num').textContent = counter.count !== null ? counter.count : '—';

            document.getElementById('last-check').textContent = 'Ostatnie sprawdzenie: ' + new Date(data.timestamp).toLocaleString('pl-PL');
        } catch (e) {
            document.getElementById('last-check').textContent = 'Błąd sprawdzania';
        }
    }

    let historyLoaded = false;
    async function loadHistory() {
        if (historyLoaded) return;
        historyLoaded = true;
        try {
            const res = await fetch('/api/status?history=1', { cache: 'no-store' });
            const data = await res.json();
            if (data.history) drawChart(data.history);
        } catch (e) {}
    }

    document.getElementById('refresh-btn').addEventListener('click', () => {
        historyLoaded = false;
        loadStatus();
        loadHistory();
    });

    loadStatus();
    loadHistory();
    setInterval(loadStatus, 60000);
    document.getElementById('year').textContent = new Date().getFullYear();
}
