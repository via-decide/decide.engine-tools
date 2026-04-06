(function (global) {
  'use strict';

  const state = {
    query: '',
    results: [],
    selectedDoc: null,
    debounceTimer: null
  };

  function renderSearchResults(results) {
    const container = document.getElementById('nex-search-results');
    if (!container) return;
    container.innerHTML = (results || []).map((item, index) => {
      const snippet = item.text || item.passage || item.content || 'No snippet';
      return `<button class="w-full text-left border border-[var(--border)] rounded p-2" data-doc-open="${item.doc_id || item.id || ''}" data-result-index="${index}">${snippet.slice(0, 220)}</button>`;
    }).join('') || '<p class="text-sm text-[var(--muted)]">No results yet.</p>';

    container.querySelectorAll('[data-result-index]').forEach((button) => {
      button.addEventListener('click', async () => {
        const idx = Number(button.dataset.resultIndex || 0);
        const item = state.results[idx] || {};
        const docId = button.dataset.docOpen || item.doc_id || item.id;
        if (!docId) return;
        const documentData = await global.NexClient.getDocument(docId);
        state.selectedDoc = documentData;
        global.DocumentViewer.render(document.getElementById('document-viewer-panel'), documentData, state.query);
      });
    });
  }

  function renderSummary(summaryData) {
    const target = document.getElementById('summary-content');
    if (!target) return;
    target.innerHTML = `
      <p class="text-sm mb-3">${summaryData.summary || 'No summary generated.'}</p>
      <ul class="list-disc pl-5 text-sm space-y-1">${(summaryData.bullet_points || []).map((point) => `<li>${point}</li>`).join('')}</ul>
      <p class="text-xs mt-3 text-[var(--muted)]">Sources: ${(summaryData.sources || []).join(', ') || 'N/A'}</p>
    `;
  }

  async function runSearch(query) {
    const normalized = String(query || '').trim();
    state.query = normalized;
    if (!normalized) {
      renderSearchResults([]);
      renderSummary({ summary: '', bullet_points: [], sources: [] });
      return;
    }

    const searchPayload = await global.NexClient.searchCorpus(normalized);
    state.results = (searchPayload.results || searchPayload.passages || []).slice(0, 10);
    renderSearchResults(state.results);

    const summary = await global.SummaryEngine.generateSummary(state.results, normalized);
    renderSummary(summary);

    const sourcePayload = await global.NexClient.getSources(normalized);
    const sources = sourcePayload.sources || sourcePayload.results || [];
    global.SourceExplorer.render(document.getElementById('sources-explorer-panel'), sources);

    if (state.results.length > 0) {
      const first = state.results[0];
      const docId = first.doc_id || first.id;
      if (docId) {
        const doc = await global.NexClient.getDocument(docId);
        global.DocumentViewer.render(document.getElementById('document-viewer-panel'), doc, normalized);
      }
    }
  }

  function initWorkspaceTab() {
    const researchRoot = document.getElementById('research-workspace-root');
    if (!researchRoot || !global.ResearchWorkspace) return;

    global.ResearchWorkspace.mount(researchRoot);
    global.CorpusSearchPanel.mount(document.getElementById('corpus-search-panel'), (value) => {
      clearTimeout(state.debounceTimer);
      state.debounceTimer = setTimeout(() => runSearch(value), 300);
    });
    global.NotesEditor.mount(document.getElementById('notes-editor-panel'));
    global.NexChat.mount(document.getElementById('research-chat-panel'));
    global.KnowledgeGraph.mount(document.getElementById('knowledge-graph-panel'));

    const copyBtn = document.getElementById('copy-summary-to-notes');
    const notesArea = document.getElementById('research-notes-text');
    copyBtn?.addEventListener('click', () => {
      const summaryText = document.getElementById('summary-content')?.innerText || '';
      notesArea.value = `${notesArea.value}\n\n${summaryText}`.trim();
    });
  }

  function initSourcesTab() {
    const sourceTab = document.getElementById('sources');
    if (!sourceTab) return;
    const mount = document.getElementById('sources-tab-mount');
    if (mount && !mount.dataset.ready) {
      mount.dataset.ready = 'true';
      mount.innerHTML = '<div class="os-card"><h3>Sources Explorer</h3><div id="sources-tab-content" class="space-y-2 text-sm text-[var(--muted)]">Search the corpus from Research tab to load sources.</div></div>';
    }
  }

  function initNotesTab() {
    const notesMount = document.getElementById('notes-tab-mount');
    if (!notesMount || notesMount.dataset.ready) return;
    notesMount.dataset.ready = 'true';
    global.NotesEditor.mount(notesMount);
  }

  async function initCorpusStatsTab() {
    const statsMount = document.getElementById('corpus-stats-mount');
    if (!statsMount || statsMount.dataset.ready) return;
    statsMount.dataset.ready = 'true';
    await global.CorpusDashboard.render(statsMount);
  }

  function init() {
    initWorkspaceTab();
    initSourcesTab();
    initNotesTab();
    initCorpusStatsTab();
  }

  global.StudyOSResearchApp = { init, runSearch };
})(window);
