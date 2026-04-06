(function (global) {
  function mountResearchWorkspace(root) {
    if (!root) return;
    root.innerHTML = `
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <aside class="xl:col-span-3 space-y-4">
          <div id="topic-navigation" class="os-card"><h3>Topic Navigation</h3></div>
          <div id="saved-queries" class="os-card"><h3>Saved Queries</h3></div>
          <div id="knowledge-graph-panel" class="os-card"><h3>Knowledge Graph</h3></div>
        </aside>
        <section class="xl:col-span-5 space-y-4">
          <div id="corpus-search-panel"></div>
          <div id="summary-output" class="os-card"><h3>AI Summary</h3><div id="summary-content"></div></div>
          <div id="research-chat-panel" class="os-card"><h3>Research Chat</h3></div>
        </section>
        <aside class="xl:col-span-4 space-y-4">
          <div id="document-viewer-panel" class="os-card"><h3>Document Viewer</h3></div>
          <div id="sources-explorer-panel" class="os-card"><h3>Sources Explorer</h3></div>
          <div id="notes-editor-panel" class="os-card"><h3>Research Notes</h3></div>
        </aside>
      </div>
    `;
  }

  global.ResearchWorkspace = { mount: mountResearchWorkspace };
})(window);
