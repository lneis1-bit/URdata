/* ============================================================
   now-what-script.js
   Handles: nav eye tracking, typing animation, puzzle piece
   hover/click/shift-out, SVG shape draw-in animation,
   content population from data array.
   ============================================================ */

// ── Category data ──────────────────────────────────────────
// Edit name, subsections[].title and subsections[].desc for
// real content. desc supports basic HTML (<strong>, <em>).

const CATEGORIES = [
    {
        id:   0,
        name: 'Desktops & Laptops',
        subsections: [
            {
                title: 'Secure Your Browser',
                desc: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>',
            },
            {
                title: 'Encrypt Your Drive',
                desc: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation.</p>',
            },
            {
                title: 'Audit Your Software',
                desc: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco.</p>',
            },
        ],
    },
    {
        id:   1,
        name: 'Mobile Devices',
        subsections: [
            {
                title: 'Review App Permissions',
                desc: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</p>',
            },
            {
                title: 'Limit Location Access',
                desc: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation.</p>',
            },
            {
                title: 'Use Encrypted Messaging',
                desc: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco.</p>',
            },
        ],
    },
    {
        id:   2,
        name: 'Unconventional Devices',
        subsections: [
            {
                title: 'Smart Home Hygiene',
                desc: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</p>',
            },
            {
                title: 'Vehicle Data Settings',
                desc: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation.</p>',
            },
            {
                title: 'Wearables & Health Devices',
                desc: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco.</p>',
            },
        ],
    },
    {
        id:   3,
        name: 'Information & Outreach',
        subsections: [
            {
                title: 'Know Your Rights',
                desc: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</p>',
            },
            {
                title: 'Talk About It',
                desc: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation.</p>',
            },
            {
                title: 'Support Privacy Advocates',
                desc: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco.</p>',
            },
        ],
    },
    {
        id:   4,
        name: 'The Internet',
        subsections: [
            {
                title: 'Use a VPN',
                desc: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</p>',
            },
            {
                title: 'Block Trackers',
                desc: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation.</p>',
            },
            {
                title: 'Manage Your Data Footprint',
                desc: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco.</p>',
            },
        ],
    },
];

// ── DOM references ─────────────────────────────────────────

const navEyeSvg    = document.getElementById('nav-eye-svg');
const navPupil     = document.getElementById('nav-pupil');
const navHighlight = document.getElementById('nav-highlight');

const puzzleIntro  = document.getElementById('puzzle-intro');
const puzzleArena  = document.getElementById('puzzle-arena');
const puzzleSvg    = document.getElementById('puzzle-svg');
const puzzleTitle  = document.getElementById('puzzle-title');

const contentSection = document.getElementById('content-section');
const placeholder    = document.getElementById('content-placeholder');
const contentCard    = document.getElementById('content-card');
const scrollTopBtn   = document.getElementById('scroll-top-btn');
const backToTop      = document.getElementById('back-to-top');

// ── State ──────────────────────────────────────────────────

let selectedId   = null;
let transitioning = false;

// Shift vectors: each piece moves away from puzzle centre when selected
const SHIFTS = [
    { x: -26, y:  0  },   // piece 0 — left
    { x: -18, y:  18 },   // piece 1 — lower-left
    { x:   0, y:  26 },   // piece 2 — down
    { x:  18, y:  18 },   // piece 3 — lower-right
    { x:  26, y:   0 },   // piece 4 — right
];

// ── Nav eye tracking ───────────────────────────────────────

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

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

// ── Page load ──────────────────────────────────────────────

window.addEventListener('load', () => {
    requestAnimationFrame(() => {
        puzzleIntro.classList.add('visible');
        setTimeout(() => typeText(puzzleTitle, puzzleTitle.dataset.text || 'Now What?', 80), 200);
    });
    setTimeout(() => puzzleArena.classList.add('visible'), 500);
    setupPieces();
});

// ── Card setup ─────────────────────────────────────────────

function setupPieces() {
    const cards = document.querySelectorAll('.piece-card');
    cards.forEach(card => {
        const id = parseInt(card.dataset.id);
        card.addEventListener('click', () => {
            if (transitioning) return;
            selectPiece(id);
        });
    });
}

// ── Select a card ──────────────────────────────────────────

function selectPiece(id) {
    if (id === selectedId) {
        contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }

    transitioning = true;
    const cards = Array.from(document.querySelectorAll('.piece-card'));

    // Deselect previous
    if (selectedId !== null) {
        cards[selectedId].classList.remove('selected');
    }

    selectedId = id;
    cards[id].classList.add('selected');

    // Dim all others
    cards.forEach((c, i) => {
        c.classList.toggle('dimmed', i !== id);
    });

    setTimeout(() => {
        showContent(id);
        contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        transitioning = false;
    }, 300);
}

// ── Show content card ──────────────────────────────────────

function showContent(id) {
    placeholder.style.display = 'none';

    contentCard.classList.remove('visible');
    contentCard.style.display = 'block';

    populateContent(id, contentCard);

    requestAnimationFrame(() => requestAnimationFrame(() => {
        contentCard.classList.add('visible');
    }));
}

// ── Populate card ──────────────────────────────────────────

function populateContent(id, el) {
    const cat = CATEGORIES[id];
    el.innerHTML = `
        <p class="content-category">${cat.name}</p>
        ${cat.subsections.map((sub, i) => `
            ${i > 0 ? '<hr class="section-divider"/>' : ''}
            <div class="subsection">
                <h3 class="subsection-title">${sub.title}</h3>
                ${sub.desc}
            </div>
        `).join('')}
    `;
}

// ── SVG shape draw-in animation ────────────────────────────

function animateShape(container) {
    const paths = container.querySelectorAll('.animate-path');
    paths.forEach((path, i) => {
        const len = path.getTotalLength ? path.getTotalLength() : 600;
        path.style.strokeDasharray  = len;
        path.style.strokeDashoffset = len;
        path.style.transition       = 'none';
        // Force reflow before starting transition
        path.getBoundingClientRect();
        path.style.transition = `stroke-dashoffset 0.75s ease ${i * 0.08}s`;
        path.style.strokeDashoffset = '0';
    });
}

// ── Scroll: back-to-top ────────────────────────────────────

window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
scrollTopBtn.addEventListener('click', scrollToTop);
backToTop.addEventListener('click',    scrollToTop);
