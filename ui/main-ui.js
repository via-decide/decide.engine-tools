import { headerMarkup, footerMarkup, orbMarkup } from './shell-parts.js';
import { renderSection as renderHero } from './sections/hero.js';
import { renderSection as renderCreators } from './sections/creators.js';
import { renderSection as renderBuilders } from './sections/builders.js';
import { renderSection as renderResearch } from './sections/research.js';
import { renderSection as renderBusiness } from './sections/business.js';
import { renderSection as renderOrchard } from './sections/orchard.js';
import { renderSection as renderGames } from './sections/games.js';
import { renderSection as renderMars } from './sections/mars.js';
import { renderSection as renderMission } from './sections/mission.js';
import { renderSection as renderAllTools } from './sections/all-tools.js';

const app = document.getElementById('app');
const header = document.getElementById('shell-header');
const footer = document.getElementById('shell-footer');

if (header) header.innerHTML = headerMarkup;
if (footer) footer.innerHTML = footerMarkup;
document.body.insertAdjacentHTML('beforeend', orbMarkup);

const sections = [
  renderHero,
  renderCreators,
  renderBuilders,
  renderResearch,
  renderBusiness,
  renderOrchard,
  renderGames,
  renderMars,
  renderMission,
  renderAllTools
];

sections.forEach((renderSection, index) => {
  renderSection(app);
  if (index < sections.length - 1) {
    app.insertAdjacentHTML('beforeend', '<div class="div"></div>');
  }
});

const CAT = {
  creators: 'c-creators',
  coders: 'c-coders',
  researchers: 'c-researchers',
  operators: 'c-operators',
  business: 'c-business',
  education: 'c-education',
  system: 'c-system',
  misc: 'c-misc'
};

const ICON = {
  creators: '✏️',
  coders: '💻',
  researchers: '🔬',
  operators: '📊',
  business: '📊',
  education: '📚',
  system: '⚙️',
  misc: '🍃'
};

const LABEL = {
  creators: 'Creators',
  coders: 'Builders',
  researchers: 'Research',
  operators: 'Business',
  business: 'Business',
  education: 'Students',
  system: 'System',
  misc: 'Other'
};

let tools = [];
let activeTab = 'all';

function isGeneral(tool) {
  return !tool.isEngineTool
    && tool.category !== 'simulations'
    && tool.category !== 'engine'
    && tool.entry
    && !tool.entry.includes('tools/engine/');
}

function renderAll() {
  const grid = document.getElementById('all-grid');
  if (!grid) return;

  const show = tools.filter((tool) => isGeneral(tool) && (activeTab === 'all' || tool.category === activeTab));

  if (!show.length) {
    grid.innerHTML = '<div class="empty">No tools here yet.</div>';
    return;
  }

  grid.innerHTML = show
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((tool) => {
      const chipClass = CAT[tool.category] || 'c-misc';
      const icon = ICON[tool.category] || '🍃';
      const label = LABEL[tool.category] || tool.category;

      return `<a class="card" href="${tool.entry}">
        <div class="card-top"><span class="chip ${chipClass}">${label}</span><span class="card-icon">${icon}</span></div>
        <h3>${tool.name}</h3>
        <p>${tool.description || 'Standalone browser tool.'}</p>
        <span class="card-link">Open</span>
      </a>`;
    })
    .join('');
}

document.getElementById('tab-row')?.addEventListener('click', (event) => {
  const tab = event.target.closest('.tab');
  if (!tab) return;

  document.querySelectorAll('.tab').forEach((node) => node.classList.remove('on'));
  tab.classList.add('on');
  activeTab = tab.dataset.c;
  renderAll();
});

await import('../shared/tool-registry.js');

try {
  if (window.ToolRegistry?.loadAll) {
    tools = await window.ToolRegistry.loadAll();
    const countEl = document.querySelector('.hstat-n');
    if (countEl) {
      countEl.textContent = tools.filter(t => !t.isEngineTool).length;
      const userTools = tools.filter(t => !t.isEngineTool);
      countEl.textContent = userTools.length;
    }
    renderAll();
  }
} catch (error) {
  console.warn('Registry:', error);
}

await import('../router.js');


// ── SEARCH ORB ──────────────────────────────────────────────
(function initSearch() {
  const orbBtn  = document.getElementById('orb-btn');
  const overlay = document.getElementById('search-overlay');
  const input   = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const closeBtn= document.getElementById('search-close');
  if (!orbBtn) return;

  const EMPTY_MSG = '<div style="padding:20px;text-align:center;color:#5a4e47;font-size:14px;">Type to search 44+ tools...</div>';

  function openSearch() {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    results.innerHTML = EMPTY_MSG;
    setTimeout(() => input.focus(), 80);
  }
  function closeSearch() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    input.value = '';
    results.innerHTML = '';
  }

  orbBtn.addEventListener('click', openSearch);
  closeBtn.addEventListener('click', closeSearch);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSearch(); });
  orbBtn.addEventListener('mouseenter', () => { orbBtn.style.transform = 'scale(1.1)'; });
  orbBtn.addEventListener('mouseleave', () => { orbBtn.style.transform = 'scale(1)'; });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      overlay.style.display === 'flex' ? closeSearch() : openSearch();
    }
    if (e.key === 'Escape' && overlay.style.display === 'flex') closeSearch();
  });

  input.addEventListener('input', function() {
    const q = this.value.trim().toLowerCase();
    if (!q) { results.innerHTML = EMPTY_MSG; return; }
    const allTools = typeof tools !== 'undefined' ? tools : [];
    const matches = allTools.filter(t =>
      t.name.toLowerCase().includes(q) ||
      (t.description || '').toLowerCase().includes(q) ||
      (t.tags || []).some(tag => tag.toLowerCase().includes(q))
    );
    if (!matches.length) {
      results.innerHTML = '<div style="padding:20px;text-align:center;color:#5a4e47;font-size:14px;">No tools found.</div>';
      return;
    }
    results.innerHTML = matches.slice(0, 12).map(t => `
      <a href="${t.entry}"
        style="display:flex;align-items:center;gap:14px;padding:12px 14px;
               border-radius:8px;text-decoration:none;color:#f0e4d0;
               border:1px solid transparent;margin-bottom:4px;
               transition:background .12s,border-color .12s;"
        onmouseover="this.style.background='#2d2623';this.style.borderColor='#4f3e36'"
        onmouseout="this.style.background='';this.style.borderColor='transparent'"
        onclick="(function(){overlay.style.display='none';document.body.style.overflow=''})()">
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;font-size:14px;">${t.name}</div>
          <div style="font-size:12px;color:#8a7568;margin-top:2px;
                      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${t.description || ''}
          </div>
        </div>
        <span style="font-size:11px;color:#5a4e47;background:#1a1614;
                     border:1px solid #3a2e28;padding:2px 8px;border-radius:4px;
                     white-space:nowrap;flex-shrink:0;">${t.category || ''}</span>
      </a>`).join('');
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const first = results.querySelector('a');
      if (first) { closeSearch(); window.location.href = first.href; }
    }
  });
})();
// ── END SEARCH ORB ──────────────────────────────────────────
// ── SEARCH ORB ────────────────────────────────────────────
const orbBtn      = document.getElementById('orb-btn');
const overlay     = document.getElementById('search-overlay');
const searchInput = document.getElementById('search-input');
const searchRes   = document.getElementById('search-results');
const closeBtn    = document.getElementById('search-close');

function openSearch() {
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => searchInput.focus(), 80);
}
function closeSearch() {
  overlay.style.display = 'none';
  document.body.style.overflow = '';
  searchInput.value = '';
  searchRes.innerHTML = '';
}
window.closeSearch = closeSearch;

orbBtn.addEventListener('click', openSearch);
closeBtn.addEventListener('click', closeSearch);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSearch(); });

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    overlay.style.display === 'flex' ? closeSearch() : openSearch();
  }
  if (e.key === 'Escape' && overlay.style.display === 'flex') closeSearch();
});

orbBtn.addEventListener('mouseenter', () => orbBtn.style.transform = 'scale(1.1)');
orbBtn.addEventListener('mouseleave', () => orbBtn.style.transform = 'scale(1)');

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { searchRes.innerHTML = '<div style="padding:20px;text-align:center;color:#5a4e47;font-size:14px;">Type to search tools...</div>'; return; }
  const matches = tools.filter(t =>
    t.name.toLowerCase().includes(q) ||
    (t.description || '').toLowerCase().includes(q) ||
    (t.tags || []).some(tag => tag.toLowerCase().includes(q))
  );
  if (!matches.length) {
    searchRes.innerHTML = '<div style="padding:20px;text-align:center;color:#5a4e47;font-size:14px;">No tools found.</div>';
    return;
  }
  searchRes.innerHTML = matches.slice(0, 12).map(t => `
    <a href="${t.entry}" onclick="closeSearch()"
      style="display:flex;align-items:center;gap:14px;padding:12px 14px;
             border-radius:8px;text-decoration:none;color:#f0e4d0;
             border:1px solid transparent;margin-bottom:4px;transition:all .15s;"
      onmouseover="this.style.background='#2d2623';this.style.borderColor='#4f3e36'"
      onmouseout="this.style.background='';this.style.borderColor='transparent'">
      <div style="flex:1;min-width:0;">
        <div style="font-weight:700;font-size:14px;">${t.name}</div>
        <div style="font-size:12px;color:#8a7568;margin-top:2px;
                    overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          ${t.description || ''}
        </div>
      </div>
      <span style="font-size:11px;color:#5a4e47;background:#1a1614;
                   border:1px solid #3a2e28;padding:2px 8px;border-radius:4px;
                   white-space:nowrap;">${t.category || ''}</span>
    </a>`).join('');
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const first = searchRes.querySelector('a');
    if (first) { closeSearch(); window.location.href = first.href; }
  }
});
// ── END SEARCH ────────────────────────────────────────────
