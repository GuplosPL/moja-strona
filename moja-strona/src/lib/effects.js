export const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

export function particleColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--particle').trim() || '#ffffff';
}

export function initParticles() {
    if (typeof window.tsParticles === 'undefined') return;
    try {
        const color = particleColor();
        window.tsParticles.load('particles-js', {
            fpsLimit: 20,
            particles: {
                number: { value: 20, density: { enable: true } },
                color: { value: color },
                opacity: { value: 0.18, random: true },
                size: { value: 1.5, random: true },
                move: { enable: true, speed: 0.25, direction: 'none', random: true },
                links: { enable: false },
            },
            interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } },
            background: { color: 'transparent' },
        });
        window.tsParticles.pause('particles-js');
        document.addEventListener('visibilitychange', () => {
            if (typeof window.tsParticles === 'undefined') return;
            if (document.hidden) {
                window.tsParticles.pause('particles-js');
            } else {
                window.tsParticles.play('particles-js');
            }
        });
    } catch (e) {}
}

export function initSnow() {
    const now = new Date();
    if (now.getMonth() !== 11) return;
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9990;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let W, H;
    const reduce = isTouch;
    const COUNT = reduce ? 25 : 55;
    const flakes = [];
    function rand(a, b) { return a + Math.random() * (b - a); }
    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function makeFlake(init) {
        return {
            x: rand(0, W),
            y: init ? rand(0, H) : rand(-20, -5),
            r: rand(1.5, 4.5),
            vy: rand(0.5, 1.8),
            vx: rand(-0.4, 0.4),
            sway: rand(0, Math.PI * 2),
            swaySpeed: rand(0.01, 0.03),
            swayAmp: rand(10, 35),
            o: rand(0.3, 0.9)
        };
    }
    function init() {
        resize();
        flakes.length = 0;
        for (let i = 0; i < COUNT; i++) flakes.push(makeFlake(true));
    }
    let last = 0;
    function tick(t) {
        const dt = Math.min((t - last) / 16.67, 3) || 1;
        last = t;
        ctx.clearRect(0, 0, W, H);
        for (const f of flakes) {
            f.sway += f.swaySpeed * dt;
            f.y += f.vy * dt;
            f.x += f.vx * dt + Math.sin(f.sway) * f.swayAmp * 0.02 * dt;
            if (f.y > H + 10) Object.assign(f, makeFlake(false));
            if (f.x > W + 10) f.x = -10;
            if (f.x < -10) f.x = W + 10;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,' + f.o + ')';
            ctx.fill();
        }
        requestAnimationFrame(tick);
    }
    window.addEventListener('resize', init);
    init();
    requestAnimationFrame(tick);
}

export function initEffects() {
    const el = document.getElementById('particles-js');
    if (!isTouch && el && el.dataset.enabled === 'true') initParticles();
    initSnow();
}
