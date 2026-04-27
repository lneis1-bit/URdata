/* ============================================================
   so-what-script.js
   Handles: nav eye tracking, typing animation, SVG gear ring
   builder, SVG connection paths, gear spin via
   IntersectionObserver, data stream particle animation.
   ============================================================ */

const SVG_NS = 'http://www.w3.org/2000/svg';

// ── DOM references ─────────────────────────────────────────

const navEyeSvg    = document.getElementById('nav-eye-svg');
const navPupil     = document.getElementById('nav-pupil');
const navHighlight = document.getElementById('nav-highlight');

const introEl    = document.getElementById('page-intro');
const introTitle = document.getElementById('intro-title');

const canvasWrap = document.getElementById('node-canvas-wrap');
const svgEl      = document.getElementById('connections-svg');

const backToTop    = document.getElementById('back-to-top');
const scrollTopBtn = document.getElementById('scroll-top-btn');

const NODE_IDS = [
    'node-0', 'node-1', 'node-2', 'node-3', 'node-4',
    'node-5', 'node-6', 'node-7', 'node-8', 'node-9',
];

// ── Utilities ──────────────────────────────────────────────

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

const GLYPHS = 'abcdefghijklmnopqrstuvwxyz0123456789!@#%&*$xyzpqr';
function randChar() { return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]; }
function garble(len) { return Array.from({ length: len }, randChar).join(''); }

// ── Nav eye tracking ───────────────────────────────────────

function screenToSVG(svg, sx, sy) {
    const pt = svg.createSVGPoint();
    pt.x = sx; pt.y = sy;
    try { return pt.matrixTransform(svg.getScreenCTM().inverse()); }
    catch { return { x: 0, y: 0 }; }
}

document.addEventListener('mousemove', (e) => {
    if (!navEyeSvg) return;
    const p     = screenToSVG(navEyeSvg, e.clientX, e.clientY);
    const cx    = 60, cy = 30;
    const dx    = p.x - cx, dy = p.y - cy;
    const angle = Math.atan2(dy, dx);
    const off   = clamp(Math.sqrt(dx * dx + dy * dy) * 0.16, 0, 8);
    const px    = cx + Math.cos(angle) * off;
    const py    = cy + Math.sin(angle) * off;
    navPupil.setAttribute('cx', px);
    navPupil.setAttribute('cy', py);
    navHighlight.setAttribute('cx', px + Math.cos(angle) * 3.5);
    navHighlight.setAttribute('cy', py + Math.sin(angle) * 3.5);
});

// ── Typing animation ───────────────────────────────────────

function typeText(el, text, speed, onDone) {
    el.textContent = '';
    el.classList.add('typing-active');
    let i = 0;
    const tick = setInterval(() => {
        el.textContent = text.slice(0, ++i);
        if (i >= text.length) {
            clearInterval(tick);
            setTimeout(() => {
                el.classList.remove('typing-active');
                if (onDone) onDone();
            }, 1400);
        }
    }, speed);
}

// ── Page load sequence ─────────────────────────────────────

window.addEventListener('load', () => {
    requestAnimationFrame(() => {
        introEl.classList.add('visible');
        setTimeout(() => typeText(introTitle, introTitle.dataset.text || 'So What?', 82), 200);
    });

    const masterGroup = document.getElementById('master-group');
    const masterNode  = document.getElementById('node-0');
    setTimeout(() => {
        masterGroup.classList.add('visible');
        masterNode.classList.add('spinning');
    }, 480);

    // Build gear rings first (they affect layout), then connections
    setTimeout(() => {
        buildGearRings();
        buildConnections();
    }, 650);
});

// ── Build SVG gear rings around each node ──────────────────
//
// Each ring is a standalone <svg> element inserted inside the
// node div. A dashed-circle stroke creates the tick pattern.
// CSS animation rotates the SVG around its own center, which
// coincides with the node center.

function buildGearRings() {
    // Remove any previously built rings (for resize rebuilds)
    document.querySelectorAll('.node-ring-svg').forEach(el => el.remove());

    NODE_IDS.forEach(id => {
        const nodeEl = document.getElementById(id);
        if (!nodeEl) return;

        const isMaster = id === 'node-0';
        const diameter = nodeEl.offsetWidth;
        const radius   = diameter / 2;

        // How far the ring extends outside the node border
        const overhang = 22;
        const svgSize  = diameter + overhang * 2;
        const cx       = svgSize / 2;
        const cy       = svgSize / 2;

        // ── SVG element ──────────────────────────────────────
        const ringsvg = document.createElementNS(SVG_NS, 'svg');
        ringsvg.classList.add('node-ring-svg');
        ringsvg.setAttribute('viewBox', `0 0 ${svgSize} ${svgSize}`);
        ringsvg.setAttribute('xmlns',   'http://www.w3.org/2000/svg');
        // Position so that SVG center == node center
        ringsvg.style.width    = svgSize + 'px';
        ringsvg.style.height   = svgSize + 'px';
        ringsvg.style.top      = -overhang + 'px';
        ringsvg.style.left     = -overhang + 'px';
        ringsvg.style.zIndex   = '0';

        // ── Glow filter for the tick ring ────────────────────
        const defs   = document.createElementNS(SVG_NS, 'defs');
        const filtId = `gear-glow-${id}`;
        defs.innerHTML = `
            <filter id="${filtId}" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
                <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>`;
        ringsvg.appendChild(defs);

        // ── Outer dashed ring — the gear "teeth" ─────────────
        // stroke-dasharray creates evenly spaced ticks.
        // Dash length and gap are tuned so ~30–40 ticks appear.
        const outerR  = radius + overhang * 0.55;
        const circ    = 2 * Math.PI * outerR;
        // Aim for ~36 ticks: period = circ/36
        const period  = circ / 36;
        const dash    = period * 0.38;   // 38% filled
        const gap     = period - dash;

        const outerRing = document.createElementNS(SVG_NS, 'circle');
        outerRing.setAttribute('cx', cx);
        outerRing.setAttribute('cy', cy);
        outerRing.setAttribute('r',  outerR);
        outerRing.setAttribute('fill',            'none');
        outerRing.setAttribute('stroke',          isMaster
            ? 'rgba(185, 130, 255, 0.92)'
            : 'rgba(155, 80, 255, 0.85)');
        outerRing.setAttribute('stroke-width',    isMaster ? '5.5' : '4.5');
        outerRing.setAttribute('stroke-dasharray', `${dash.toFixed(2)} ${gap.toFixed(2)}`);
        outerRing.setAttribute('stroke-linecap',  'round');
        outerRing.setAttribute('filter',          `url(#${filtId})`);
        ringsvg.appendChild(outerRing);

        // ── Thin solid ring just at the node border ───────────
        // Adds a crisp "gear base" line the ticks sit on top of.
        const baseRing = document.createElementNS(SVG_NS, 'circle');
        baseRing.setAttribute('cx', cx);
        baseRing.setAttribute('cy', cy);
        baseRing.setAttribute('r',  radius);
        baseRing.setAttribute('fill',         'none');
        baseRing.setAttribute('stroke',       isMaster
            ? 'rgba(160, 100, 255, 0.55)'
            : 'rgba(122, 48, 255, 0.45)');
        baseRing.setAttribute('stroke-width', isMaster ? '2.5' : '2');
        ringsvg.appendChild(baseRing);

        // ── Second inner accent ring (circuit-board depth) ────
        const innerAccR = radius - 22;
        if (innerAccR > 0) {
            const innerAcc = document.createElementNS(SVG_NS, 'circle');
            innerAcc.setAttribute('cx', cx);
            innerAcc.setAttribute('cy', cy);
            innerAcc.setAttribute('r',  innerAccR);
            innerAcc.setAttribute('fill',         'none');
            innerAcc.setAttribute('stroke',       'rgba(100, 40, 200, 0.22)');
            innerAcc.setAttribute('stroke-width', '1');
            ringsvg.appendChild(innerAcc);
        }

        nodeEl.appendChild(ringsvg);
    });
}

// ── Connection data ────────────────────────────────────────

const connections  = [];
const allParticles = [];

function docPos(el) {
    const r = el.getBoundingClientRect();
    return {
        top:    r.top    + window.scrollY,
        bottom: r.bottom + window.scrollY,
        left:   r.left   + window.scrollX,
        cx:     r.left   + window.scrollX + r.width  / 2,
        cy:     r.top    + window.scrollY + r.height / 2,
        width:  r.width,
        height: r.height,
    };
}

// ── Build SVG connecting paths (always fully visible) ──────

function buildConnections() {
    const defs = svgEl.querySelector('defs');
    while (svgEl.lastChild && svgEl.lastChild !== defs) {
        svgEl.removeChild(svgEl.lastChild);
    }
    allParticles.forEach(p => { p.dot.remove(); p.label.remove(); });
    allParticles.length = 0;
    connections.length  = 0;

    const cW = canvasWrap.offsetWidth;
    const cH = canvasWrap.offsetHeight;
    svgEl.setAttribute('width',   cW);
    svgEl.setAttribute('height',  cH);
    svgEl.setAttribute('viewBox', `0 0 ${cW} ${cH}`);

    const wrapPos = docPos(canvasWrap);

    const nodes = NODE_IDS.map(id => {
        const el = document.getElementById(id);
        if (!el) return null;
        const p = docPos(el);
        return {
            cx:     p.cx     - wrapPos.left,
            cy:     p.cy     - wrapPos.top,
            top:    p.top    - wrapPos.top,
            bottom: p.bottom - wrapPos.top,
        };
    });

    for (let i = 0; i < nodes.length - 1; i++) {
        const from = nodes[i];
        const to   = nodes[i + 1];
        if (!from || !to) continue;

        const fx = from.cx, fy = from.bottom;
        const tx = to.cx,   ty = to.top;
        const dy = ty - fy;
        const d  = `M ${fx},${fy} C ${fx},${fy + dy * 0.5} ${tx},${ty - dy * 0.5} ${tx},${ty}`;

        // Glow layer
        const glowPath = document.createElementNS(SVG_NS, 'path');
        glowPath.setAttribute('d', d);
        glowPath.setAttribute('fill', 'none');
        glowPath.setAttribute('stroke', 'rgba(100, 40, 220, 0.32)');
        glowPath.setAttribute('stroke-width', '7');
        glowPath.setAttribute('filter', 'url(#path-glow)');
        svgEl.appendChild(glowPath);

        // Main path
        const path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'rgba(130, 55, 255, 0.62)');
        path.setAttribute('stroke-width', '1.8');
        path.setAttribute('stroke-linecap', 'round');
        svgEl.appendChild(path);

        connections.push({ pathEl: path, totalLength: path.getTotalLength(), particles: [] });
    }

    connections.forEach(conn => spawnParticles(conn));
}

// ── IntersectionObserver: node entrance + gear spin ────────

const nodeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const nodeEl = entry.target;
        const group  = nodeEl.closest('.node-group');
        if (group) group.classList.add('visible');
        nodeEl.classList.add('spinning', 'active');
    });
}, { threshold: 0.15 });

for (let i = 1; i < NODE_IDS.length; i++) {
    const el = document.getElementById(NODE_IDS[i]);
    if (el) nodeObserver.observe(el);
}

// ── Data stream particles ──────────────────────────────────

class Particle {
    constructor(conn) {
        this.pathEl = conn.pathEl;
        this.len    = conn.totalLength;
        this.t      = Math.random();
        this.speed  = 0.00055 + Math.random() * 0.00045;
        this.glyphs = garble(8);
        this.timer  = 0;
        this.rate   = Math.floor(Math.random() * 22) + 14;

        this.dot = document.createElementNS(SVG_NS, 'circle');
        this.dot.setAttribute('r', '2.5');
        this.dot.setAttribute('fill', 'rgba(160, 96, 255, 0.92)');
        this.dot.setAttribute('filter', 'url(#dot-glow)');

        this.label = document.createElementNS(SVG_NS, 'text');
        this.label.setAttribute('font-family', '"Share Tech Mono", monospace');
        this.label.setAttribute('font-size', '7');
        this.label.setAttribute('fill', 'rgba(200, 165, 255, 0.50)');
        this.label.textContent = this.glyphs;

        svgEl.appendChild(this.dot);
        svgEl.appendChild(this.label);
    }

    update() {
        this.t += this.speed;
        if (this.t >= 1) this.t = 0;
        const pos = this.pathEl.getPointAtLength(this.t * this.len);
        this.dot.setAttribute('cx', pos.x);
        this.dot.setAttribute('cy', pos.y);
        this.label.setAttribute('x', pos.x + 5);
        this.label.setAttribute('y', pos.y + 2.5);
        if (++this.timer >= this.rate) {
            this.glyphs = garble(8);
            this.label.textContent = this.glyphs;
            this.timer = 0;
        }
    }
}

function spawnParticles(conn) {
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
        const p = new Particle(conn);
        p.t = i / count;
        conn.particles.push(p);
        allParticles.push(p);
    }
}

function animLoop() {
    allParticles.forEach(p => p.update());
    requestAnimationFrame(animLoop);
}
requestAnimationFrame(animLoop);

// ── Scroll: back-to-top visibility ────────────────────────

window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

// ── Resize: rebuild everything ─────────────────────────────

let resizeTimer = null;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        buildGearRings();
        buildConnections();
    }, 220);
});

// ── Back-to-top ────────────────────────────────────────────

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
scrollTopBtn.addEventListener('click', scrollToTop);
backToTop.addEventListener('click',    scrollToTop);
