(function (global) {
  'use strict';

  const CAT = {
    creators: 'c-creators', coders: 'c-coders', researchers: 'c-researchers', operators: 'c-operators',
    business: 'c-business', education: 'c-education', system: 'c-system', misc: 'c-misc',
    games: 'c-misc', simulations: 'c-system', engine: 'c-system'
  };

  const ICON = {
    creators: '✏️', coders: '💻', researchers: '🔬', operators: '📊', business: '📊', education: '📚',
    system: '⚙️', misc: '🍃', games: '🎮', simulations: '🌳', engine: '🌱'
  };

  const LABEL = {
    creators: 'Creators', coders: 'Builders', researchers: 'Research', operators: 'Business', business: 'Business',
    education: 'Students', system: 'System', misc: 'Other', games: 'Games', simulations: 'Simulation', engine: 'Engine'
  };

  const state = {
    tools: [],
    category: 'all',
    search: '',
    sortAlpha: true,
    includeEngineTools: false, /* always false — backend tools hidden from UI */
    filtered: [],
    renderCursor: 0,
    renderBatch: 20,
    renderFrame: null
  };

  const els = {
    grid: document.getElementById('all-grid'),
    tabs: document.getElementById('tab-row'),
    sortToggle: document.getElementById('sort-alpha-toggle'),
    includeEngineToggle: document.getElementById('include-engine-toggle'),
    featuredCount: document.getElementById('featured-count'),
    search: document.getElementById('tool-search-input'),
    categorySelect: document.getElementById('tool-category-select')
  };

  function normalizeEntry(entry) {
    return String(entry || '').trim().toLowerCase();
  }

  function isVisibleTool(tool) {
    /* Always hide backend/engine/template tools from the main UI */
    if (tool.isEngineTool) return false;
    const entry = normalizeEntry(tool.entry);
    if (entry.includes('tools/engine/')) return false;
    /* Hide system-only tools (wallet, execution console, llm router, etc.) */
    if (tool.category === 'system') return false;
    return true;
  }

  function clearGrid() {
    if (!els.grid) return;
    els.grid.innerHTML = '';
  }

  function createToolCard(tool) {
    const card = document.createElement('a');
    card.className = 'card';
    card.href = tool.entry;

    const category = tool.category || 'misc';
    const chipClass = CAT[category] || 'c-misc';
    const icon = ICON[category] || '🍃';
    const label = LABEL[category] || category;

    card.innerHTML = `
      <div class="card-top"><span class="chip ${chipClass}">${label}</span><span class="card-icon">${icon}</span></div>
      <h3>${tool.name}</h3>
      <p>${tool.description || 'Standalone browser tool.'}</p>
      <span class="card-link">Open</span>
    `;

    return card;
  }

  function matchesSearch(tool) {
    if (!state.search) return true;
    const text = `${tool.name} ${tool.description || ''} ${(tool.tags || []).join(' ')}`.toLowerCase();
    return text.includes(state.search);
  }

  function getVisibleTools() {
    const filteredByVisibility = state.tools.filter(isVisibleTool);
    const tabCategory = state.category;

    const fromTab = filteredByVisibility.filter((tool) => {
      if (tabCategory === 'all') return true;
      return String(tool.category || '').toLowerCase() === tabCategory;
    });

    const selectCategory = els.categorySelect?.value || 'all';
    const fromSelect = fromTab.filter((tool) => {
      if (selectCategory === 'all') return true;
      return String(tool.category || '').toLowerCase() === selectCategory;
    });

    const bySearch = fromSelect.filter(matchesSearch);
    if (!state.sortAlpha) return bySearch;
    return bySearch.slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  function appendNextBatch() {
    if (!els.grid) return;
    if (state.renderCursor >= state.filtered.length) {
      state.renderFrame = null;
      return;
    }

    const fragment = document.createDocumentFragment();
    const end = Math.min(state.renderCursor + state.renderBatch, state.filtered.length);
    for (let index = state.renderCursor; index < end; index += 1) {
      fragment.appendChild(createToolCard(state.filtered[index]));
    }

    state.renderCursor = end;
    els.grid.appendChild(fragment);

    if (state.renderCursor < state.filtered.length) {
      state.renderFrame = requestAnimationFrame(appendNextBatch);
    } else {
      state.renderFrame = null;
    }
  }

  function renderTools() {
    if (!els.grid) return;
    if (state.renderFrame) cancelAnimationFrame(state.renderFrame);

    clearGrid();
    state.filtered = getVisibleTools();
    state.renderCursor = 0;

    if (!state.filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'No tools match this filter yet.';
      els.grid.appendChild(empty);
      return;
    }

    state.renderFrame = requestAnimationFrame(appendNextBatch);
  }

  function syncControls() {
    els.sortToggle?.setAttribute('aria-pressed', String(state.sortAlpha));
    if (els.sortToggle) els.sortToggle.textContent = state.sortAlpha ? 'Sort: A → Z' : 'Sort: Registry';

    if (els.featuredCount) {
      const count = (global.ToolUiUtils?.getFeaturedTools(state.tools) || []).filter(isVisibleTool).length;
      els.featuredCount.textContent = `${count} featured`;
    }
  }

  function populateCategoryView() {
    if (!els.categorySelect) return;
    const categories = Array.from(new Set(state.tools.map((tool) => tool.category).filter(Boolean))).sort();
    els.categorySelect.innerHTML = '<option value="all">All categories</option>' + categories
      .map((cat) => `<option value="${String(cat).toLowerCase()}">${LABEL[cat] || cat}</option>`)
      .join('');
  }

  function bindEvents() {
    els.tabs?.addEventListener('click', (event) => {
      const tab = event.target.closest('.tab');
      if (!tab) return;

      document.querySelectorAll('#tab-row .tab').forEach((button) => button.classList.remove('on'));
      tab.classList.add('on');
      state.category = String(tab.dataset.c || 'all').toLowerCase();
      renderTools();
    });

    els.sortToggle?.addEventListener('click', () => {
      state.sortAlpha = !state.sortAlpha;
      syncControls();
      renderTools();
    });

    els.includeEngineToggle?.addEventListener('change', () => {
      state.includeEngineTools = Boolean(els.includeEngineToggle.checked);
      syncControls();
      renderTools();
    });

    els.search?.addEventListener('input', () => {
      state.search = String(els.search.value || '').trim().toLowerCase();
      renderTools();
    });

    els.categorySelect?.addEventListener('change', renderTools);
  }

  async function init() {
    if (!global.ToolRegistry?.loadAll || !els.grid) return;

    try {
      state.tools = await global.ToolRegistry.loadAll();
      global.ToolUiUtils?.setTools(state.tools);
      populateCategoryView();
      bindEvents();
      syncControls();
      renderTools();
    } catch (error) {
      console.warn('Registry:', error);
    }
  }

  init();
})(window);
