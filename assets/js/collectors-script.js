/* ============================================================
   collectors-script.js
   Handles: nav eye tracking, bubble physics simulation,
   click animation + sparks, company card population,
   dropdown sync.
   ============================================================ */

// ── Company data ───────────────────────────────────────────
// Edit name, description (HTML string), facts, and sources
// to swap in real content. Labels appear inside bubbles.

const COMPANIES = [
    {
        id: 0, label: 'Search\nGiant',
        name: 'Search Giant Inc.',
        description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
        facts: [
            'Processes over <strong>8.5 billion</strong> search queries per day',
            'Collects data from <em>over 70 different tracking products</em>',
            'Advertising revenue accounts for <strong>79%</strong> of total income',
            'Operates across <strong>190+</strong> countries and territories',
        ],
        sources: [{ text: 'Lorem Ipsum Source Placeholder One', href: '#' }, { text: 'Lorem Ipsum Source Placeholder Two', href: '#' }],
    },
    {
        id: 1, label: 'Social\nNetwork',
        name: 'Social Network Corp.',
        description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
        facts: [
            'Tracks users across <strong>millions</strong> of third-party websites',
            'Holds over <strong>52,000</strong> data attributes per user on average',
            'Earns roughly <strong>$50</strong> per user per year from ad targeting',
            'Retains deleted data for up to <strong>90 days</strong>',
        ],
        sources: [{ text: 'Lorem Ipsum Source Placeholder One', href: '#' }, { text: 'Lorem Ipsum Source Placeholder Two', href: '#' }],
    },
    {
        id: 2, label: 'Device\nMaker',
        name: 'Device Maker Ltd.',
        description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
        facts: [
            'Collects telemetry from <strong>over 1 billion</strong> active devices',
            'Each device generates up to <strong>6,000</strong> data events per day',
            'Health and biometric data synced to proprietary cloud servers',
            'Location data accurate to within <strong>20 metres</strong>',
        ],
        sources: [{ text: 'Lorem Ipsum Source Placeholder One', href: '#' }, { text: 'Lorem Ipsum Source Placeholder Two', href: '#' }],
    },
    {
        id: 3, label: 'Ad\nBroker',
        name: 'Ad Broker Group',
        description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
        facts: [
            'Operates the world\'s largest <strong>real-time bidding</strong> exchange',
            'Ad auctions complete in under <strong>100 milliseconds</strong>',
            'Tracking pixels on <strong>76%</strong> of all top-visited websites',
            'User profiles updated in <strong>near real-time</strong>',
        ],
        sources: [{ text: 'Lorem Ipsum Source Placeholder One', href: '#' }, { text: 'Lorem Ipsum Source Placeholder Two', href: '#' }],
    },
    {
        id: 4, label: 'Cloud\nProvider',
        name: 'Cloud Provider Inc.',
        description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
        facts: [
            'Hosts data for <strong>millions</strong> of businesses and governments',
            'Over <strong>1 million</strong> active enterprise customers',
            'Stores an estimated <em>multiple exabytes</em> of user-adjacent data',
            'Data centres consume as much power as <strong>mid-sized cities</strong>',
        ],
        sources: [{ text: 'Lorem Ipsum Source Placeholder One', href: '#' }, { text: 'Lorem Ipsum Source Placeholder Two', href: '#' }],
    },
    {
        id: 5, label: 'E-\nCommerce',
        name: 'E-Commerce Holdings',
        description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
        facts: [
            'Tracks every click, hover, and pause on its platform',
            'Purchase history retained <strong>indefinitely</strong> for targeting',
            'Over <strong>300 million</strong> active customer accounts globally',
            'Patented a system to predict purchases <em>before they are made</em>',
        ],
        sources: [{ text: 'Lorem Ipsum Source Placeholder One', href: '#' }, { text: 'Lorem Ipsum Source Placeholder Two', href: '#' }],
    },
    {
        id: 6, label: 'Stream\nService',
        name: 'Stream Service LLC',
        description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
        facts: [
            'Monitors play time, pause frequency, and skipped content',
            'Viewing data drives <strong>content production decisions</strong>',
            'Over <strong>230 million</strong> subscriber accounts globally',
            'Viewing history builds detailed <em>psychological profiles</em>',
        ],
        sources: [{ text: 'Lorem Ipsum Source Placeholder One', href: '#' }, { text: 'Lorem Ipsum Source Placeholder Two', href: '#' }],
    },
    {
        id: 7, label: 'Mobile\nOS',
        name: 'Mobile OS Corp.',
        description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
        facts: [
            'Default OS on <strong>72%</strong> of all smartphones worldwide',
            'Logs app usage, location, and call metadata by default',
            'Over <strong>3 billion</strong> active devices on the platform',
            'App permissions enabled data collection from <strong>thousands of apps</strong>',
        ],
        sources: [{ text: 'Lorem Ipsum Source Placeholder One', href: '#' }, { text: 'Lorem Ipsum Source Placeholder Two', href: '#' }],
    },
    {
        id: 8, label: 'Data\nBroker',
        name: 'Data Broker Co.',
        description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
        facts: [
            'Holds profiles on <strong>over 2 billion</strong> individuals worldwide',
            'Sells data to <strong>governments, insurers, and advertisers</strong>',
            'Aggregates from <strong>thousands</strong> of sources including public records',
            'Most individuals have <strong>no legal right</strong> to remove their data',
        ],
        sources: [{ text: 'Lorem Ipsum Source Placeholder One', href: '#' }, { text: 'Lorem Ipsum Source Placeholder Two', href: '#' }],
    },
    {
        id: 9, label: 'Smart\nHome',
        name: 'Smart Home Systems',
        description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
        facts: [
            'Always-on microphones capture audio <em>even when not triggered</em>',
            'Video footage shared with <strong>law enforcement</strong> without warrants in some cases',
            'Devices sold at a loss — <strong>data is the product</strong>',
            'Maps the interior layouts of <strong>millions of homes</strong>',
        ],
        sources: [{ text: 'Lorem Ipsum Source Placeholder One', href: '#' }, { text: 'Lorem Ipsum Source Placeholder Two', href: '#' }],
    },
    {
        id: 10, label: 'Finance\nApp',
        name: 'Finance App Inc.',
        description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
        facts: [
            'Collects full transaction history including <strong>merchant names and amounts</strong>',
            'Spending patterns sold to <strong>hedge funds</strong> for market intelligence',
            'Over <strong>400 million</strong> active accounts globally',
            'Data used to model <em>creditworthiness without consent</em>',
        ],
        sources: [{ text: 'Lorem Ipsum Source Placeholder One', href: '#' }, { text: 'Lorem Ipsum Source Placeholder Two', href: '#' }],
    },
    {
        id: 11, label: 'AI\nPlatform',
        name: 'AI Platform Labs',
        description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
        facts: [
            'All conversations retained and used for <strong>model training</strong>',
            'Proprietary training data used without consent from <strong>millions of authors</strong>',
            'Memory features store personal disclosures <strong>indefinitely</strong>',
            'Generates <em>psychological inferences</em> from conversation patterns',
        ],
        sources: [{ text: 'Lorem Ipsum Source Placeholder One', href: '#' }, { text: 'Lorem Ipsum Source Placeholder Two', href: '#' }],
    },
];

// ── DOM references ─────────────────────────────────────────

const navEyeSvg    = document.getElementById('nav-eye-svg');
const navPupil     = document.getElementById('nav-pupil');
const navHighlight = document.getElementById('nav-highlight');

const arena        = document.getElementById('bubble-arena');
const detailSection = document.getElementById('detail-section');
const placeholder   = document.getElementById('detail-placeholder');
const companyCard   = document.getElementById('company-card');
const cardContent   = document.getElementById('card-content');

const dropdownToggle = document.getElementById('dropdown-toggle');
const dropdownMenu   = document.getElementById('dropdown-menu');
const scrollTopBtn   = document.getElementById('scroll-top-btn');
const backToTop      = document.getElementById('back-to-top');

// ── Utilities ──────────────────────────────────────────────

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

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

// ── Physics state ──────────────────────────────────────────

let bubbles    = [];
let arenaW     = 0;
let arenaH     = 0;
let selectedId = null;
let animating  = false;

// Mouse position in arena-local coordinates (starts off-screen)
let mouseX = -9999;
let mouseY = -9999;

const REPULSE_RADIUS   = 210;  // px — how far cursor influence reaches
const REPULSE_STRENGTH = 0.13; // velocity added per frame at closest point
const SPEED_CAP_MULT   = 3.2;  // max speed as multiple of baseSpeed
const SPEED_DECAY      = 0.025; // fraction corrected back toward baseSpeed per frame
const FLASH_FRAMES     = 16;   // frames the collision flash stays on (~0.27s at 60fps)

// ── Build bubble DOM elements ──────────────────────────────

function createBubble(company) {
    const wrap = document.createElement('div');
    wrap.className   = 'bubble';
    wrap.dataset.id  = company.id;

    const body = document.createElement('div');
    body.className = 'bubble-body';

    const label = document.createElement('span');
    label.className   = 'bubble-label';
    label.textContent = company.label;

    body.appendChild(label);
    wrap.appendChild(body);
    return wrap;
}

// ── Grid-based initial placement (no overlaps) ────────────

function placeInitial(radius) {
    const COLS = 4;
    const ROWS = Math.ceil(bubbles.length / COLS);
    const cellW = arenaW / COLS;
    const cellH = arenaH / ROWS;

    bubbles.forEach((b, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const jx  = (Math.random() - 0.5) * cellW * 0.22;
        const jy  = (Math.random() - 0.5) * cellH * 0.22;
        b.x = clamp(cellW * (col + 0.5) + jx, radius, arenaW - radius);
        b.y = clamp(cellH * (row + 0.5) + jy, radius, arenaH - radius);
    });
}

// ── Collision flash ────────────────────────────────────────

function flashBubble(b) {
    if (b.flashTimer > 0) return; // already flashing, don't restart
    b.flashTimer = FLASH_FRAMES;
    b.el.querySelector('.bubble-body').classList.add('flash');
}

// ── Boundary collision ─────────────────────────────────────

function checkBounds(b) {
    const r = b.radius;
    let hit = false;
    if (b.x - r < 0)       { b.x = r;          b.vx =  Math.abs(b.vx); hit = true; }
    if (b.x + r > arenaW)  { b.x = arenaW - r; b.vx = -Math.abs(b.vx); hit = true; }
    if (b.y - r < 0)       { b.y = r;          b.vy =  Math.abs(b.vy); hit = true; }
    if (b.y + r > arenaH)  { b.y = arenaH - r; b.vy = -Math.abs(b.vy); hit = true; }
    if (hit) flashBubble(b);
}

// ── Circle-circle elastic collision ───────────────────────

function resolveCollision(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distSq = dx * dx + dy * dy;
    const minDist = a.radius + b.radius;

    if (distSq >= minDist * minDist || distSq === 0) return;

    const dist = Math.sqrt(distSq);
    const nx = dx / dist;
    const ny = dy / dist;

    // Push circles apart so they don't overlap
    const overlap = (minDist - dist) * 0.5;
    a.x -= nx * overlap;
    a.y -= ny * overlap;
    b.x += nx * overlap;
    b.y += ny * overlap;

    // Reflect velocity components along collision normal (equal mass)
    const dvx = a.vx - b.vx;
    const dvy = a.vy - b.vy;
    const dot = dvx * nx + dvy * ny;
    if (dot <= 0) return; // already separating

    a.vx -= dot * nx;
    a.vy -= dot * ny;
    b.vx += dot * nx;
    b.vy += dot * ny;

    flashBubble(a);
    flashBubble(b);

    // Preserve each bubble's intended speed (counters float drift)
    [a, b].forEach(bubble => {
        const s = Math.sqrt(bubble.vx * bubble.vx + bubble.vy * bubble.vy);
        if (s > 0) {
            const scale = bubble.baseSpeed / s;
            bubble.vx *= scale;
            bubble.vy *= scale;
        }
    });
}

// ── Animation loop ─────────────────────────────────────────

function tick() {
    bubbles.forEach(b => {
        // Cursor repulsion — push gently away from mouse
        const dx   = b.x - mouseX;
        const dy   = b.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPULSE_RADIUS && dist > 0) {
            const strength = REPULSE_STRENGTH * (1 - dist / REPULSE_RADIUS);
            b.vx += (dx / dist) * strength;
            b.vy += (dy / dist) * strength;
        }

        // Gradually decay speed back toward baseSpeed
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (speed > 0) {
            const capped  = Math.min(speed, b.baseSpeed * SPEED_CAP_MULT);
            const target  = b.baseSpeed + (capped - b.baseSpeed) * (1 - SPEED_DECAY);
            const newSpeed = speed > b.baseSpeed
                ? Math.max(b.baseSpeed, speed - (speed - b.baseSpeed) * SPEED_DECAY)
                : speed;
            b.vx = (b.vx / speed) * newSpeed;
            b.vy = (b.vy / speed) * newSpeed;
        }

        b.x += b.vx;
        b.y += b.vy;
        checkBounds(b);

        // Flash timer countdown
        if (b.flashTimer > 0) {
            b.flashTimer--;
            if (b.flashTimer === 0) {
                b.el.querySelector('.bubble-body').classList.remove('flash');
            }
        }
    });

    // Resolve all pairwise collisions
    for (let i = 0; i < bubbles.length; i++) {
        for (let j = i + 1; j < bubbles.length; j++) {
            resolveCollision(bubbles[i], bubbles[j]);
        }
    }

    // Apply positions via GPU-composited transform
    bubbles.forEach(b => {
        b.el.style.transform = `translate(${b.x - b.radius}px, ${b.y - b.radius}px)`;
    });

    requestAnimationFrame(tick);
}

// ── Spark particle burst ───────────────────────────────────

function spawnSparks(bubble) {
    const body = bubble.el.querySelector('.bubble-body');
    const rect = body.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;

    const count = 16;
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI + (Math.random() - 0.5) * 0.4;
        const dist  = 55 + Math.random() * 55;
        const dx    = Math.cos(angle) * dist;
        const dy    = Math.sin(angle) * dist;
        const size  = 3 + Math.random() * 3.5;
        const dur   = 0.42 + Math.random() * 0.22;

        const p = document.createElement('div');
        p.className = 'spark';
        p.style.cssText = `
            width: ${size}px; height: ${size}px;
            left: ${cx}px; top: ${cy}px;
            background: rgba(${180 + Math.random() * 50|0}, ${90 + Math.random() * 60|0}, 255, 0.95);
            box-shadow: 0 0 6px rgba(160, 96, 255, 0.85);
            transition: transform ${dur}s ease-out, opacity ${dur}s ease-out;
        `;
        document.body.appendChild(p);

        // Double rAF ensures initial style renders before transition fires
        requestAnimationFrame(() => requestAnimationFrame(() => {
            p.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
            p.style.opacity   = '0';
        }));

        setTimeout(() => p.remove(), (dur + 0.1) * 1000);
    }
}

// ── Select a company ───────────────────────────────────────
// animate: true  → swell + sparks + auto-scroll (bubble click)
// animate: false → soft highlight + populate (dropdown)

function selectCompany(id, animate) {
    if (animating && animate) return;

    // Deselect previous
    if (selectedId !== null) {
        bubbles[selectedId].el.querySelector('.bubble-body').classList.remove('selected');
        updateDropdownActive(-1);
    }

    selectedId = id;
    const bubble = bubbles[id];
    const body   = bubble.el.querySelector('.bubble-body');

    // Mark selection on bubble
    body.classList.add('selected');
    updateDropdownActive(id);

    if (animate) {
        animating = true;

        // Dim all others
        bubbles.forEach(b => {
            if (b.id !== id) b.el.querySelector('.bubble-body').classList.add('dimmed');
        });

        // Swell
        body.classList.add('swelling');

        // Sparks at swell peak
        setTimeout(() => spawnSparks(bubble), 300);

        // Remove swell + undim
        setTimeout(() => {
            body.classList.remove('swelling');
            bubbles.forEach(b => b.el.querySelector('.bubble-body').classList.remove('dimmed'));
        }, 620);

        // Populate card + scroll
        setTimeout(() => {
            populateCard(id);
            detailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            animating = false;
        }, 700);

    } else {
        populateCard(id);
    }
}

// ── Populate company card ──────────────────────────────────

function populateCard(id) {
    const company = COMPANIES[id];

    // Hide placeholder
    placeholder.style.opacity = '0';
    setTimeout(() => { placeholder.style.display = 'none'; }, 280);

    // If card already visible, fade content out before swapping
    if (companyCard.classList.contains('visible')) {
        cardContent.classList.add('fading');
        setTimeout(() => {
            renderCard(company);
            cardContent.classList.remove('fading');
        }, 210);
    } else {
        renderCard(company);
        // Small delay so opacity:0 → 1 transition is visible
        requestAnimationFrame(() => requestAnimationFrame(() => {
            companyCard.classList.add('visible');
        }));
    }
}

function renderCard(company) {
    cardContent.innerHTML = `
        <div class="card-header-line" style="margin-bottom:0.5rem;">
            <h2 class="company-name">${company.name}</h2>
        </div>
        <hr class="card-divider" />
        <section class="card-section">
            <h3 class="section-label">About</h3>
            ${company.description}
        </section>
        <hr class="card-divider" />
        <section class="card-section">
            <h3 class="section-label">Key Facts</h3>
            <ul class="facts-list">
                ${company.facts.map(f => `<li>${f}</li>`).join('')}
            </ul>
        </section>
        <hr class="card-divider" />
        <section class="card-section">
            <h3 class="section-label">Sources</h3>
            <ul class="sources-list">
                ${company.sources.map(s => `<li><a href="${s.href}" class="source-link">${s.text}</a></li>`).join('')}
            </ul>
        </section>
    `;
}

// ── Dropdown ───────────────────────────────────────────────

function buildDropdown() {
    COMPANIES.forEach(c => {
        const li = document.createElement('li');
        const a  = document.createElement('a');
        a.href        = '#';
        a.textContent = c.name;
        a.dataset.id  = c.id;
        a.addEventListener('click', e => {
            e.preventDefault();
            dropdownMenu.classList.remove('open');
            dropdownToggle.setAttribute('aria-expanded', 'false');
            selectCompany(c.id, false);
            detailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        li.appendChild(a);
        dropdownMenu.appendChild(li);
    });
}

function updateDropdownActive(id) {
    dropdownMenu.querySelectorAll('a').forEach(a => {
        a.classList.toggle('active', parseInt(a.dataset.id) === id);
    });
}

dropdownToggle.addEventListener('click', () => {
    const open = dropdownMenu.classList.contains('open');
    dropdownMenu.classList.toggle('open', !open);
    dropdownToggle.setAttribute('aria-expanded', String(!open));
});

document.addEventListener('click', e => {
    if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
    }
});

// ── Initialise ─────────────────────────────────────────────

function init() {
    arenaW = arena.offsetWidth;
    arenaH = arena.offsetHeight;

    // Create bubble objects and DOM elements
    COMPANIES.forEach(company => {
        const el = createBubble(company);
        arena.appendChild(el);

        const speed = 1.4 + Math.random() * 0.9;
        const angle = Math.random() * 2 * Math.PI;

        bubbles.push({
            id:        company.id,
            el,
            x: 0, y: 0,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            baseSpeed:  speed,
            radius:     0, // set after first render
            flashTimer: 0,
        });
    });

    // Read actual rendered radius from DOM
    const sampleBody = arena.querySelector('.bubble-body');
    const radius     = sampleBody ? sampleBody.offsetWidth / 2 : 54;
    bubbles.forEach(b => { b.radius = radius; });

    // Place bubbles in a grid with light jitter
    placeInitial(radius);

    // Apply initial positions
    bubbles.forEach(b => {
        b.el.style.transform = `translate(${b.x - radius}px, ${b.y - radius}px)`;
    });

    // Stagger bubble fade-in
    bubbles.forEach((b, i) => {
        setTimeout(() => {
            b.el.querySelector('.bubble-body').style.opacity = '1';
        }, 150 + i * 55);
    });

    // Wire up click handlers
    bubbles.forEach(b => {
        b.el.addEventListener('click', () => selectCompany(b.id, true));
    });

    // Track mouse in arena-local coords for cursor repulsion
    arena.addEventListener('mousemove', e => {
        const rect = arena.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    arena.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

    // Build dropdown from same data
    buildDropdown();

    // Start physics loop
    requestAnimationFrame(tick);
}

// ── Resize handler ─────────────────────────────────────────

let resizeTimer = null;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        arenaW = arena.offsetWidth;
        arenaH = arena.offsetHeight;
        // Clamp any out-of-bounds bubbles
        bubbles.forEach(b => checkBounds(b));
    }, 200);
});

// ── Scroll: back-to-top ────────────────────────────────────

window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
scrollTopBtn.addEventListener('click', scrollToTop);
backToTop.addEventListener('click',    scrollToTop);

// ── Boot ───────────────────────────────────────────────────

window.addEventListener('load', init);
