/**
 * directory/search.js
 * Layer 1 — Search + Filter UI for Kutch Digital Map
 */

(function() {
    let allBusinesses = [];
    let state = {
        query: '',
        category: 'all',
        ward: 'all',
        ondcOnly: false,
        sortBy: 'verified'
    };

    // --- DOM INJECTION (HUD & FILTERS) ---

    function injectUI() {
        const filterSection = document.querySelector('.filter-bar');
        if (!filterSection) return;

        filterSection.innerHTML = `
            <div class="search-wrap" style="width: 100%; margin-bottom: 20px; display: flex; gap: 10px;">
                <input type="text" id="vd-search" placeholder="🔍 Search [name], [ward] or [keyword] in Kutch..." 
                       style="flex-grow: 1; padding: 12px 16px; background: var(--surface2); border: 1px solid var(--border); color: #fff; font-family: var(--sans); border-radius: 4px;">
            </div>

            <div class="pill-reel-wrap" style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
                <div class="pill-reel category-reel" style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;">
                    <button class="filter-pill active" data-type="category" data-value="all">All Categories</button>
                    <button class="filter-pill" data-type="category" data-value="food">Food</button>
                    <button class="filter-pill" data-type="category" data-value="retail">Retail</button>
                    <button class="filter-pill" data-type="category" data-value="services">Services</button>
                    <button class="filter-pill" data-type="category" data-value="manufacturing">Manufacturing</button>
                    <button class="filter-pill" data-type="category" data-value="other">Other</button>
                </div>
                <div class="pill-reel ward-reel" style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;">
                    <button class="filter-pill active" data-type="ward" data-value="all">All Kutch</button>
                    <button class="filter-pill" data-type="ward" data-value="Bhuj">Bhuj</button>
                    <button class="filter-pill" data-type="ward" data-value="Mundra">Mundra</button>
                    <button class="filter-pill" data-type="ward" data-value="Anjar">Anjar</button>
                    <button class="filter-pill" data-type="ward" data-value="Gandhidham">Gandhidham</button>
                    <button class="filter-pill" data-type="ward" data-value="Mandvi">Mandvi</button>
                </div>
                <div class="pill-reel toggle-reel" style="display: flex; gap: 8px;">
                    <button class="filter-pill ondc-pill" data-type="ondc" data-value="toggle">⚡ ONDC Network <span id="ondc-count">(0)</span></button>
                </div>
            </div>

            <style>
                .pill-reel-wrap { margin-top: 10px; }
                .filter-pill { 
                    font-family: var(--mono); font-size: 11px; padding: 6px 14px; 
                    border: 1px solid var(--border); background: var(--surface); color: var(--muted); 
                    cursor: pointer; border-radius: 20px; transition: 0.2s; white-space: nowrap;
                }
                .filter-pill.active { background: var(--accent); color: #000; border-color: var(--accent); }
                .ondc-pill.active { background: #FF6B00; color: #fff; border-color: #FF6B00; }
                .pill-reel::-webkit-scrollbar { display: none; }
                
                .badge-verified { background: #4ade80; color: #000; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
                .badge-ondc { background: #FF6B00; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }
                
                .claim-cta-btn { 
                    width: 100%; padding: 12px; background: var(--surface2); color: var(--muted); 
                    border: 1px dashed var(--border); font-family: var(--mono); font-size: 11px;
                    cursor: pointer; transition: 0.3s; margin-top: 15px; border-radius: 4px; border: 1px dashed var(--border);
                }
                .claim-cta-btn:hover { border-color: var(--accent); color: var(--accent); background: rgba(245, 166, 35, 0.05); }
            </style>
        `;

        const nav = document.querySelector('nav');
        if (nav) {
            const h = document.getElementById('vd-directory-hud');
            if (!h) {
                const hud = document.createElement('div');
                hud.id = 'vd-directory-hud';
                hud.style.cssText = "font-family: var(--mono); font-size: 11px; display: flex; gap: 15px; margin-left: auto;";
                hud.innerHTML = `
                    <span style="color: var(--green);">✓ <span id="stat-verified">0</span> Verified</span>
                    <span style="color: #FF6B00;">⚡ <span id="stat-ondc">0</span> ONDC</span>
                `;
                nav.appendChild(hud);
            }
        }

        bindEvents();
    }

    async function loadData() {
        if (!window.firebase) {
            setTimeout(loadData, 500);
            return;
        }

        const db = firebase.firestore();
        try {
            const snapshot = await db.collection('businesses').get();
            allBusinesses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            updateHUDStats();
            render();
        } catch (err) {
            console.error("Search Layer: Error", err);
            // Scan DOM if Firestore empty for transition
            const cards = Array.from(document.querySelectorAll('.dir-card'));
            if (cards.length > 0) {
               allBusinesses = cards.map((c, i) => ({
                   id: 'dom-' + i,
                   name: c.querySelector('.dir-card-name')?.innerText,
                   category: c.dataset.category,
                   ward: c.querySelector('.dir-card-loc')?.innerText.split(',').pop().trim() || 'Kutch',
                   address: c.querySelector('.dir-card-loc')?.innerText,
                   verified: false
               }));
            }
            render();
        }
    }

    function render() {
        const grid = document.querySelector('.directory-grid');
        if (!grid) return;

        const filtered = allBusinesses.filter(biz => {
            const matchesQuery = !state.query || 
                                (biz.name || "").toLowerCase().includes(state.query) || 
                                (biz.ward || "").toLowerCase().includes(state.query);
            const matchesCat = state.category === 'all' || (biz.category || "").toLowerCase() === state.category;
            const matchesWard = state.ward === 'all' || (biz.ward || "").includes(state.ward);
            const matchesONDC = !state.ondcOnly || biz.ondc === true;
            return matchesQuery && matchesCat && matchesWard && matchesONDC;
        });

        grid.innerHTML = filtered.map(biz => renderCard(biz)).join('');
        updateHUDStats(filtered);
    }

    function renderCard(biz) {
        const isVerified = biz.verified || biz.claimed;
        const isOnONDC = biz.ondc === true;
        const slug = biz.slug || biz.id; // Fallback to ID if no slug

        return `
            <div class="dir-card" style="display: flex; flex-direction: column;">
                <div class="dir-card-top">
                    <div class="dir-avatar" style="background: var(--surface2); border: 1px solid var(--border);">
                        ${getEmoji(biz.category)}
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                        ${isVerified ? '<span class="badge-verified">✓ VERIFIED</span>' : ''}
                        ${isOnONDC ? `
                            <a href="${biz.ondcCatalogueURL || '#'}" target="_blank" class="badge-ondc">⚡ ONDC ↗</a>
                        ` : ''}
                    </div>
                </div>
                <div class="dir-card-name" style="margin-top: 15px;">${biz.name}</div>
                <div class="dir-card-loc" style="font-size: 13px; color: var(--muted); margin-top: 10px;">
                    📍 ${biz.address || 'Kutch'}
                </div>
                
                <div style="flex-grow: 1; margin-top: 15px; font-size: 14px; color: #b9b6ac; line-height:1.4;">
                    ${biz.description || ''}
                </div>

                ${!biz.claimed ? `
                    <button class="claim-cta-btn" onclick="window._VD_CLAIM.open('${biz.id}')">Claim Listing →</button>
                ` : `
                    <div style="margin-top: 20px; font-family: var(--mono); font-size: 10px; color: var(--green); border-top: 1px solid var(--border); padding-top: 10px;">
                        Verified Listing ✓
                    </div>
                `}

                <div class="dir-card-footer" style="padding-top: 20px; margin-top: 20px; border-top: 1px solid var(--border);">
                    <div class="dir-card-actions" style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(biz.name + ' ' + (biz.address || ''))}" target="_blank" class="dir-website-btn" style="flex-grow: 1; text-align: center; font-size: 10px;">DIRECTIONS</a>
                        <button onclick="window._VD_SEARCH.share('${biz.name}', '${slug}')" class="dir-website-btn" style="padding: 8px 10px;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                        </button>
                        <a href="./sites/${slug}.html" class="dir-website-btn btn-visit" style="flex-grow: 1; text-align: center; font-size: 10px;">VIEW SITE →</a>
                    </div>
                </div>
            </div>
        `;
    }

    function shareBiz(title, slug) {
        const url = window.location.origin + window.location.pathname.replace('index.html', '') + 'sites/' + slug + '.html';
        if (navigator.share) {
            navigator.share({
                title: title + ' | Kutch Digital Map',
                url: url
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard!'));
        }
    }

    function getEmoji(cat) {
        const lower = (cat || "").toLowerCase();
        if (lower.includes('salon')) return '✂️';
        if (lower.includes('account') || lower.includes('ca')) return '📊';
        if (lower.includes('event') || lower.includes('photo')) return '📸';
        if (lower.includes('tech') || lower.includes('it')) return '💻';
        if (lower.includes('pg') || lower.includes('hostel')) return '🏠';
        if (lower.includes('food')) return '🍲';
        if (lower.includes('retail')) return '🛍️';
        return '🏪';
    }

    function updateHUDStats(currentSet = allBusinesses) {
        const verified = currentSet.filter(b => b.verified || b.claimed).length;
        const ondc = currentSet.filter(b => b.ondc).length;

        const vEl = document.getElementById('stat-verified');
        const oEl = document.getElementById('stat-ondc');
        const ocEl = document.getElementById('ondc-count');

        if (vEl) vEl.innerText = verified;
        if (oEl) oEl.innerText = ondc;
        if (ocEl) ocEl.innerText = `(${ondc})`;
    }

    function bindEvents() {
        const search = document.getElementById('vd-search');
        if (search) {
            search.addEventListener('input', (e) => {
                state.query = e.target.value.toLowerCase();
                render();
            });
        }

        document.querySelectorAll('.filter-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                const type = pill.dataset.type;
                const val = pill.dataset.value;

                if (type === 'ondc') {
                    state.ondcOnly = !state.ondcOnly;
                    pill.classList.toggle('active', state.ondcOnly);
                    render();
                    return;
                }

                document.querySelectorAll(`.filter-pill[data-type="${type}"]`).forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                state[type] = val;
                render();
            });
        });
    }

    // Export share function
    window._VD_SEARCH = { share: shareBiz };

    document.addEventListener('DOMContentLoaded', () => {
        injectUI();
        loadData();
    });

})();

