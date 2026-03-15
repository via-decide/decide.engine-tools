(function (global) {
  'use strict';

  const state = {
    tools: [],
    filteredTools: [],
    activeToolId: null,
    ui: null
  };

  function routeToToolId(url) {
    const params = new URL(url, global.location.origin).searchParams;
    return params.get('tool') || '';
  }

  function setStatus(message) {
    if (state.ui?.state) state.ui.state.textContent = message;
  }

  function renderList() {
    if (!state.ui?.list) return;

    state.ui.list.innerHTML = state.filteredTools
      .map((tool) => `<button class="tool-item${tool.id === state.activeToolId ? ' active' : ''}" type="button" data-tool-id="${tool.id}">
          <strong>${tool.name}</strong>
          <span>${tool.category}</span>
        </button>`)
      .join('') || '<p class="muted">No tools match your filters.</p>';
  }

  function applyFilters() {
    const search = (state.ui?.search?.value || '').trim().toLowerCase();
    const category = state.ui?.category?.value || 'all';

    state.filteredTools = state.tools.filter((tool) => {
      const byCategory = category === 'all' || tool.category === category;
      const haystack = `${tool.name} ${tool.description} ${(tool.tags || []).join(' ')}`.toLowerCase();
      const bySearch = !search || haystack.includes(search);
      return byCategory && bySearch;
    });

    renderList();
  }

  async function loadTool(toolId, { pushHistory = true } = {}) {
    const tool = state.tools.find((item) => item.id === toolId);
    if (!tool) {
      setStatus(`Tool "${toolId}" was not found in the registry.`);
      return;
    }

    state.activeToolId = tool.id;
    state.ui.frame.src = tool.entry;
    setStatus(`Loaded ${tool.name}.`);
    renderList();

    if (pushHistory) {
      const url = new URL(global.location.href);
      url.searchParams.set('tool', tool.id);
      global.history.pushState({ toolId: tool.id }, '', url);
    }
  }

  function bindEvents() {
    state.ui.list.addEventListener('click', (event) => {
      const button = event.target.closest('[data-tool-id]');
      if (!button) return;
      loadTool(button.getAttribute('data-tool-id'));
    });

    state.ui.nav.addEventListener('click', (event) => {
      const button = event.target.closest('[data-tool-id]');
      if (!button) return;
      loadTool(button.getAttribute('data-tool-id'));
    });

    state.ui.search.addEventListener('input', applyFilters);
    state.ui.category.addEventListener('change', applyFilters);

    global.addEventListener('popstate', () => {
      const id = routeToToolId(global.location.href);
      if (id) loadTool(id, { pushHistory: false });
    });
  }

  async function init() {
    if (!global.ToolRegistry?.loadAll || !global.PlatformLayout?.renderLayout) return;

    state.tools = await global.ToolRegistry.loadAll();
    const navItems = state.tools.slice(0, 8);
    state.ui = global.PlatformLayout.renderLayout({
      mount: document.getElementById('app'),
      title: 'decide.engine connected tools',
      navItems
    });

    const categories = Array.from(new Set(state.tools.map((tool) => tool.category))).sort();
    state.ui.category.insertAdjacentHTML('beforeend', categories.map((cat) => `<option value="${cat}">${cat}</option>`).join(''));

    state.filteredTools = state.tools.slice();
    renderList();
    bindEvents();

    const fromRoute = routeToToolId(global.location.href);
    if (fromRoute) {
      loadTool(fromRoute, { pushHistory: false });
      return;
    }

    if (state.tools.length) {
      loadTool(state.tools[0].id, { pushHistory: false });
    }
  }

  global.Router = { init, loadTool };
})(window);
