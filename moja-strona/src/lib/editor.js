const state = {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    temperature: 0,
    vignette: 0,
    grain: 0,
    blur: 0,
    sepia: 0,
    sharpen: 0,
    flipH: false,
    flipV: false,
};

const presets = {
    natural: { brightness: 0, contrast: 0, saturation: 0, temperature: 0, vignette: 0, grain: 0, blur: 0, sepia: 0, sharpen: 0 },
    warm: { brightness: 5, contrast: 0, saturation: 5, temperature: 30, vignette: 0, grain: 0, blur: 0, sepia: 0, sharpen: 0 },
    cool: { brightness: 0, contrast: 5, saturation: 0, temperature: -30, vignette: 0, grain: 0, blur: 0, sepia: 0, sharpen: 0 },
    vivid: { brightness: 5, contrast: 20, saturation: 30, temperature: 0, vignette: 0, grain: 0, blur: 0, sepia: 0, sharpen: 0 },
    film: { brightness: 0, contrast: 15, saturation: -15, temperature: 10, vignette: 40, grain: 25, blur: 0, sepia: 5, sharpen: 5 },
    soft: { brightness: 10, contrast: -10, saturation: 0, temperature: 5, vignette: 15, grain: 0, blur: 2, sepia: 0, sharpen: 0 },
};

function cssFilter() {
    const parts = [];
    const b = (state.brightness + 100) / 100;
    const c = (state.contrast + 100) / 100;
    const s = (state.saturation + 100) / 100;
    if (b !== 1) parts.push(`brightness(${b})`);
    if (c !== 1) parts.push(`contrast(${c})`);
    if (s !== 1) parts.push(`saturate(${s})`);
    if (state.sepia > 0) parts.push(`sepia(${state.sepia / 100})`);
    if (state.blur > 0) parts.push(`blur(${state.blur * 0.3}px)`);
    return parts.join(' ');
}

function applyTemperature(cctx, w, h) {
    const t = state.temperature;
    if (t === 0) return;
    const img = cctx.getImageData(0, 0, w, h);
    const d = img.data;
    const amt = (Math.abs(t) / 100) * 50;
    for (let i = 0; i < d.length; i += 4) {
        if (t > 0) {
            d[i] = Math.min(255, d[i] + amt);
            d[i + 2] = Math.max(0, d[i + 2] - amt);
        } else {
            d[i] = Math.max(0, d[i] - amt);
            d[i + 2] = Math.min(255, d[i + 2] + amt);
        }
    }
    cctx.putImageData(img, 0, 0);
}

function applySharpen(cctx, w, h) {
    const a = state.sharpen / 100;
    if (a === 0) return;
    const img = cctx.getImageData(0, 0, w, h);
    const src = img.data;
    const out = new Uint8ClampedArray(src);
    const k = a * 0.8;
    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            for (let ch = 0; ch < 3; ch++) {
                const i = (y * w + x) * 4 + ch;
                const v =
                    -k * src[((y - 1) * w + x) * 4 + ch] +
                    -k * src[(y * w + x - 1) * 4 + ch] +
                    (1 + 4 * k) * src[i] +
                    -k * src[(y * w + x + 1) * 4 + ch] +
                    -k * src[((y + 1) * w + x) * 4 + ch];
                out[i] = v;
            }
        }
    }
    for (let i = 0; i < src.length; i += 4) {
        src[i] = out[i];
        src[i + 1] = out[i + 1];
        src[i + 2] = out[i + 2];
    }
    cctx.putImageData(img, 0, 0);
}

let grainPattern = null;
function getGrainPattern() {
    if (grainPattern) return grainPattern;
    const t = document.createElement('canvas');
    t.width = 256;
    t.height = 256;
    const tc = t.getContext('2d');
    const id = tc.createImageData(256, 256);
    const gd = id.data;
    for (let i = 0; i < gd.length; i += 4) {
        const v = 128 + (Math.random() * 255 - 128) * 0.9;
        gd[i] = v;
        gd[i + 1] = v;
        gd[i + 2] = v;
        gd[i + 3] = 255;
    }
    tc.putImageData(id, 0, 0);
    grainPattern = tc.createPattern(t, 'repeat');
    return grainPattern;
}

function applyGrain(cctx, w, h) {
    cctx.save();
    cctx.globalAlpha = (state.grain / 100) * 0.6;
    cctx.globalCompositeOperation = 'overlay';
    cctx.fillStyle = getGrainPattern();
    cctx.fillRect(0, 0, w, h);
    cctx.restore();
}

export function initEditor() {
    const fileInput = document.getElementById('editor-file');
    const dropZone = document.getElementById('editor-drop');
    const browseBtn = document.getElementById('editor-browse');
    const canvas = document.getElementById('editor-canvas');
    if (!canvas || !fileInput) return;
    const ctx = canvas.getContext('2d');
    const emptyBox = document.getElementById('editor-empty');
    const editorBox = document.getElementById('editor-box');
    const fileNameEl = document.getElementById('editor-filename');
    const exportBtn = document.getElementById('editor-export');
    const resetBtn = document.getElementById('editor-reset');
    const beforeBtn = document.getElementById('editor-before');
    const previewWrap = document.getElementById('editor-preview-wrap');
    const flipHBtn = document.getElementById('editor-flip-h');
    const flipVBtn = document.getElementById('editor-flip-v');
    const cropBtn = document.getElementById('editor-crop');
    const cropOverlay = document.getElementById('crop-overlay');
    const cropBox = document.getElementById('crop-box');
    const cropApply = document.getElementById('crop-apply');
    const cropCancel = document.getElementById('crop-cancel');
    const formatSelect = document.getElementById('editor-format');
    const qualitySlider = document.getElementById('editor-quality');
    const qualityValue = document.getElementById('editor-quality-value');

    const originalImg = new Image();
    let currentSrc = null;
    let currentFileName = 'edytor-obrazow.png';
    let cropRegion = null;

    function loadFromSrc(src) {
        currentSrc = src;
        originalImg.onload = () => {
            cropRegion = null;
            canvas.width = originalImg.naturalWidth;
            canvas.height = originalImg.naturalHeight;
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
            render();
        };
        originalImg.src = src;
    }

    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = () => {
            emptyBox.classList.add('hidden');
            editorBox.classList.remove('hidden');
            fileNameEl.textContent = file.name;
            currentFileName = file.name;
            loadFromSrc(reader.result);
        };
        reader.readAsDataURL(file);
    }

    function render() {
        if (!currentSrc) return;
        const w = canvas.width;
        const h = canvas.height;
        const cctx = canvas.getContext('2d');
        cctx.clearRect(0, 0, w, h);
        const sx = cropRegion ? cropRegion.x : 0;
        const sy = cropRegion ? cropRegion.y : 0;
        const sw = cropRegion ? cropRegion.w : originalImg.naturalWidth;
        const sh = cropRegion ? cropRegion.h : originalImg.naturalHeight;
        cctx.save();
        if (state.flipH) {
            cctx.translate(w, 0);
            cctx.scale(-1, 1);
        }
        if (state.flipV) {
            cctx.translate(0, h);
            cctx.scale(1, -1);
        }
        cctx.filter = cssFilter();
        cctx.drawImage(originalImg, sx, sy, sw, sh, 0, 0, w, h);
        cctx.filter = 'none';
        cctx.restore();
        applyTemperature(cctx, w, h);
        applySharpen(cctx, w, h);

        if (state.vignette > 0) {
            const g = cctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
            g.addColorStop(0, 'rgba(0,0,0,0)');
            g.addColorStop(1, `rgba(0,0,0,${state.vignette / 100 * 1.0})`);
            cctx.fillStyle = g;
            cctx.fillRect(0, 0, w, h);
        }
        if (state.grain > 0) {
            applyGrain(cctx, w, h);
        }
    }

    function updateSlider(id, key, onChange) {
        const el = document.getElementById(id);
        el.addEventListener('input', () => {
            state[key] = parseInt(el.value, 10);
            const valEl = document.getElementById(id + '-value');
            if (valEl) valEl.textContent = el.value;
            if (onChange) onChange();
            else if (currentSrc) render();
        });
    }

    updateSlider('editor-brightness', 'brightness');
    updateSlider('editor-contrast', 'contrast');
    updateSlider('editor-saturation', 'saturation');
    updateSlider('editor-temperature', 'temperature');
    updateSlider('editor-vignette', 'vignette');
    updateSlider('editor-grain', 'grain');
    updateSlider('editor-blur', 'blur');
    updateSlider('editor-sepia', 'sepia');
    updateSlider('editor-sharpen', 'sharpen');

    function syncSliders() {
        Object.keys(state).forEach(key => {
            const el = document.getElementById('editor-' + key);
            if (el) el.value = state[key];
            const valEl = document.getElementById('editor-' + key + '-value');
            if (valEl) valEl.textContent = state[key];
        });
    }

    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.preset;
            if (!presets[name]) return;
            Object.assign(state, presets[name]);
            syncSliders();
            if (currentSrc) render();
        });
    });

    resetBtn.addEventListener('click', () => {
        Object.assign(state, presets.natural);
        cropRegion = null;
        syncSliders();
        if (currentSrc) render();
    });

    if (flipHBtn) flipHBtn.addEventListener('click', () => {
        state.flipH = !state.flipH;
        if (currentSrc) render();
    });
    if (flipVBtn) flipVBtn.addEventListener('click', () => {
        state.flipV = !state.flipV;
        if (currentSrc) render();
    });

    if (beforeBtn) {
        beforeBtn.addEventListener('pointerdown', () => {
            if (!currentSrc) return;
            const cctx = canvas.getContext('2d');
            cctx.clearRect(0, 0, canvas.width, canvas.height);
            cctx.filter = 'none';
            cctx.drawImage(originalImg, 0, 0, canvas.width, canvas.height);
        });
        beforeBtn.addEventListener('pointerup', () => {
            if (!currentSrc) return;
            render();
        });
        beforeBtn.addEventListener('pointerleave', () => {
            if (!currentSrc) return;
            render();
        });
    }

    if (cropBtn && cropOverlay && cropBox) {
        cropBtn.addEventListener('click', () => {
            if (!currentSrc) return;
            cropOverlay.classList.remove('hidden');
            cropBox.style.left = '10%';
            cropBox.style.top = '10%';
            cropBox.style.width = '80%';
            cropBox.style.height = '80%';
        });
        cropCancel.addEventListener('click', () => {
            cropOverlay.classList.add('hidden');
        });
        cropApply.addEventListener('click', () => {
            const ov = cropOverlay.getBoundingClientRect();
            const bx = cropBox.getBoundingClientRect();
            const sx = originalImg.naturalWidth / ov.width;
            const sy = originalImg.naturalHeight / ov.height;
            cropRegion = {
                x: (bx.left - ov.left) * sx,
                y: (bx.top - ov.top) * sy,
                w: bx.width * sx,
                h: bx.height * sy,
            };
            cropOverlay.classList.add('hidden');
            canvas.width = Math.round(cropRegion.w);
            canvas.height = Math.round(cropRegion.h);
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
            render();
        });

        let cropDrag = null;
        function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
        function updateCropRect(e) {
            const ow = cropOverlay.clientWidth;
            const oh = cropOverlay.clientHeight;
            const dx = e.clientX - cropDrag.startX;
            const dy = e.clientY - cropDrag.startY;
            let r = Object.assign({}, cropDrag.rect);
            const min = Math.max(20, ow * 0.05);
            if (cropDrag.mode === 'move') {
                r.x = clamp(r.x + dx, 0, ow - r.w);
                r.y = clamp(r.y + dy, 0, oh - r.h);
            } else {
                if (cropDrag.mode.includes('e')) r.w = clamp(r.w + dx, min, ow - r.x);
                if (cropDrag.mode.includes('s')) r.h = clamp(r.h + dy, min, oh - r.y);
                if (cropDrag.mode.includes('w')) {
                    const nw = clamp(r.w - dx, min, r.x + r.w);
                    r.x += r.w - nw;
                    r.w = nw;
                }
                if (cropDrag.mode.includes('n')) {
                    const nh = clamp(r.h - dy, min, r.y + r.h);
                    r.y += r.h - nh;
                    r.h = nh;
                }
            }
            cropBox.style.left = r.x + 'px';
            cropBox.style.top = r.y + 'px';
            cropBox.style.width = r.w + 'px';
            cropBox.style.height = r.h + 'px';
        }
        cropBox.addEventListener('pointerdown', e => {
            if (e.target !== cropBox) return;
            const rect = cropBox.getBoundingClientRect();
            const ov = cropOverlay.getBoundingClientRect();
            cropDrag = {
                mode: 'move',
                startX: e.clientX,
                startY: e.clientY,
                rect: { x: rect.left - ov.left, y: rect.top - ov.top, w: rect.width, h: rect.height },
            };
            cropBox.setPointerCapture(e.pointerId);
            e.preventDefault();
        });
        cropBox.addEventListener('pointermove', e => {
            if (!cropDrag || cropDrag.mode !== 'move') return;
            updateCropRect(e);
        });
        document.querySelectorAll('.crop-handle').forEach(h => {
            h.addEventListener('pointerdown', e => {
                const rect = cropBox.getBoundingClientRect();
                const ov = cropOverlay.getBoundingClientRect();
                cropDrag = {
                    mode: h.dataset.h,
                    startX: e.clientX,
                    startY: e.clientY,
                    rect: { x: rect.left - ov.left, y: rect.top - ov.top, w: rect.width, h: rect.height },
                };
                h.setPointerCapture(e.pointerId);
                e.preventDefault();
                e.stopPropagation();
            });
            h.addEventListener('pointermove', e => {
                if (!cropDrag) return;
                updateCropRect(e);
            });
        });
        ['pointerup', 'pointercancel'].forEach(ev => {
            cropBox.addEventListener(ev, () => { cropDrag = null; });
            document.querySelectorAll('.crop-handle').forEach(h => h.addEventListener(ev, () => { cropDrag = null; }));
        });
    }

    fileInput.addEventListener('change', e => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    if (browseBtn) browseBtn.addEventListener('click', () => fileInput.click());

    ['dragover', 'dragenter'].forEach(ev => {
        dropZone.addEventListener(ev, e => {
            e.preventDefault();
            dropZone.classList.add('drag');
        });
    });
    ['dragleave', 'drop'].forEach(ev => {
        dropZone.addEventListener(ev, e => {
            e.preventDefault();
            dropZone.classList.remove('drag');
        });
    });
    dropZone.addEventListener('drop', e => {
        const files = e.dataTransfer.files;
        if (files.length) handleFile(files[0]);
    });

    exportBtn.addEventListener('click', () => {
        if (!currentSrc) return;
        render();
        const base = currentFileName.replace(/\.[^.]+$/, '');
        const fmt = formatSelect ? formatSelect.value : 'png';
        const q = qualitySlider ? parseInt(qualitySlider.value, 10) / 100 : 0.92;
        let dataUrl;
        if (fmt === 'png') {
            dataUrl = canvas.toDataURL('image/png');
        } else {
            const t = document.createElement('canvas');
            t.width = canvas.width;
            t.height = canvas.height;
            const tc = t.getContext('2d');
            tc.fillStyle = '#fff';
            tc.fillRect(0, 0, t.width, t.height);
            tc.drawImage(canvas, 0, 0);
            dataUrl = t.toDataURL(`image/${fmt}`, q);
        }
        const a = document.createElement('a');
        a.download = `${base} - guplospl.com.${fmt === 'jpeg' ? 'jpg' : fmt}`;
        a.href = dataUrl;
        a.click();
    });

    if (qualitySlider && qualityValue) {
        qualitySlider.addEventListener('input', () => {
            qualityValue.textContent = qualitySlider.value;
        });
    }
}
