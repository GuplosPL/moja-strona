export const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

export function particleColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--particle').trim() || '#ffffff';
}

export function initParticles() {
    if (typeof window.tsParticles === 'undefined') return;
    try {
        const color = particleColor();
        window.tsParticles.load('particles-js', {
            fpsLimit: 30,
            particles: {
                number: { value: 35, density: { enable: true } },
                color: { value: color },
                opacity: { value: 0.25, random: true },
                size: { value: 2, random: true },
                move: { enable: true, speed: 0.4, direction: 'none', random: true },
                links: { enable: true, distance: 160, color: color, opacity: 0.08, width: 1 },
            },
            interactivity: { events: { onHover: { enable: true, mode: 'grab' } }, modes: { grab: { distance: 150, links: { opacity: 0.12 } } } },
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

export function initSparkle() {
    if (isTouch) return;
    document.addEventListener('click', e => {
        const color = particleColor();
        for (let i = 0; i < 14; i++) {
            const dot = document.createElement('div');
            const size = 4 + Math.random() * 6;
            const angle = Math.random() * 360;
            const dist = 40 + Math.random() * 80;
            dot.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;border-radius:50%;background:${color};pointer-events:none;z-index:9999;transition:all 0.6s cubic-bezier(0,.8,.5,1);opacity:1;`;
            document.body.appendChild(dot);
            requestAnimationFrame(() => {
                dot.style.transform = `translate(${Math.cos(angle) * dist}px,${Math.sin(angle) * dist}px)`;
                dot.style.opacity = '0';
            });
            setTimeout(() => dot.remove(), 700);
        }
    });
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
    if (!isTouch) initParticles();
    initSparkle();
    initSnow();
}
