import { headerMarkup, footerMarkup } from './shell-parts.js';
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
    if (countEl) countEl.textContent = tools.filter((t) => !t.isEngineTool).length;
    renderAll();
  }
} catch (error) {
  console.warn('Registry:', error);
}

await import('../router.js');
