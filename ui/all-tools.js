(function (global) {
  'use strict';

  const CAT = {
    creators: 'c-creators',
    coders: 'c-coders',
    researchers: 'c-researchers',
    operators: 'c-operators',
    business: 'c-business',
    education: 'c-education',
    system: 'c-system',
    misc: 'c-misc',
    games: 'c-misc',
    simulations: 'c-system'
  };

  const ICON = {
    creators: '✏️',
    coders: '💻',
    researchers: '🔬',
    operators: '📊',
    business: '📊',
    education: '📚',
    system: '⚙️',
    misc: '🍃',
    games: '🎮',
    simulations: '🌳'
  };

  const LABEL = {
    creators: 'Creators',
    coders: 'Builders',
    researchers: 'Research',
    operators: 'Business',
    business: 'Business',
    education: 'Students',
    system: 'System',
    misc: 'Other',
    games: 'Games',
    simulations: 'Simulation'
  };

  const state = {
    tools: [],
    category: 'all',
    sortAlpha: true,
    includeEngineTools: false,
    filtered: [],
    renderCursor: 0,
    renderBatch: 18,
    renderFrame: null
  };

  const els = {
    grid: document.getElementById('all-grid'),
    tabs: document.getElementById('tab-row'),
    sortToggle: document.getElementById('sort-alpha-toggle'),
    includeEngineToggle: document.getElementById('include-engine-toggle'),
    featuredCount: document.getElementById('featured-count')
  };

  function normalizeEntry(entry) {
    if (!entry) return '';
    return String(entry).trim().toLowerCase();
  }

  function isVisibleTool(tool) {
    if (state.includeEngineTools) return true;
    if (tool.isEngineTool) return false;
    const entry = normalizeEntry(tool.entry);
    return !entry.includes('tools/engine/');
  }

  function clearGrid() {
    if (!els.grid) return;
    while (els.grid.firstChild) {
      els.grid.removeChild(els.grid.firstChild);
    }
  }

  function createToolCard(tool) {
    const card = document.createElement('a');
    card.className = 'card';
    card.href = tool.entry;

    const category = tool.category || 'misc';
    const chipClass = CAT[category] || 'c-misc';
    const icon = ICON[category] || '🍃';
    const label = LABEL[category] || category;

    const top = document.createElement('div');
    top.className = 'card-top';

    const chip = document.createElement('span');
    chip.className = `chip ${chipClass}`;
    chip.textContent = label;

    const iconNode = document.createElement('span');
    iconNode.className = 'card-icon';
    iconNode.textContent = icon;

    const title = document.createElement('h3');
    title.textContent = tool.name;

    const description = document.createElement('p');
    description.textContent = tool.description || 'Standalone browser tool.';

    const action = document.createElement('span');
    action.className = 'card-link';
    action.textContent = 'Open';

    top.append(chip, iconNode);
    card.append(top, title, description, action);
    return card;
  }

  function appendNextBatch() {
    if (!els.grid) return;
    if (state.renderCursor >= state.filtered.length) {
      state.renderFrame = null;
      return;
    }

    const fragment = document.createDocumentFragment();
    const end = Math.min(state.renderCursor + state.renderBatch, state.filtered.length);

    for (let idx = state.renderCursor; idx < end; idx += 1) {
      fragment.appendChild(createToolCard(state.filtered[idx]));
    }

    state.renderCursor = end;
    els.grid.appendChild(fragment);

    if (state.renderCursor < state.filtered.length) {
      state.renderFrame = requestAnimationFrame(appendNextBatch);
    } else {
      state.renderFrame = null;
    }
  }

  function getVisibleTools() {
    const byVisibility = state.tools.filter(isVisibleTool);
    const byCategory = global.ToolUiUtils.getToolsByCategory(state.category, byVisibility);

    if (!state.sortAlpha) return byCategory;
    return byCategory.slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  function renderTools() {
    if (!els.grid) return;

    if (state.renderFrame) {
      cancelAnimationFrame(state.renderFrame);
      state.renderFrame = null;
    }

    clearGrid();
    state.filtered = getVisibleTools();
    state.renderCursor = 0;

    if (!state.filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'No tools here yet.';
      els.grid.appendChild(empty);
      return;
    }

    state.renderFrame = requestAnimationFrame(appendNextBatch);
  }

  function syncControls() {
    if (els.sortToggle) {
      els.sortToggle.setAttribute('aria-pressed', String(state.sortAlpha));
      els.sortToggle.textContent = state.sortAlpha ? 'Sort: A → Z' : 'Sort: Registry';
    }

    if (els.featuredCount) {
      const featured = global.ToolUiUtils.getFeaturedTools(state.tools).filter(isVisibleTool);
      els.featuredCount.textContent = `${featured.length} featured`;
    }
  }

  function bindEvents() {
    els.tabs?.addEventListener('click', (event) => {
      const tab = event.target.closest('.tab');
      if (!tab) return;
      const nextCategory = tab.dataset.c || 'all';
      if (nextCategory === state.category) return;

      document.querySelectorAll('#tab-row .tab').forEach((button) => button.classList.remove('on'));
      tab.classList.add('on');
      state.category = nextCategory;
      renderTools();
    });

    els.sortToggle?.addEventListener('click', () => {
      state.sortAlpha = !state.sortAlpha;
      syncControls();
      renderTools();
    });

    els.includeEngineToggle?.addEventListener('change', () => {
      state.includeEngineTools = Boolean(els.includeEngineToggle.checked);
      renderTools();
      syncControls();
    });
  }

  async function init() {
    if (!global.ToolRegistry?.loadAll || !global.ToolUiUtils || !els.grid) return;
    try {
      state.tools = await global.ToolRegistry.loadAll();
      global.ToolUiUtils.setTools(state.tools);
      bindEvents();
      syncControls();
      renderTools();
    } catch (error) {
      console.warn('Registry:', error);
    }
  }

  init();
})(window);
