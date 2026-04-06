(function (global) {
  function mountKnowledgeGraph(root) {
    if (!root) return;
    root.innerHTML = '<div class="text-sm text-[var(--muted)]">Knowledge graph visualization is ready for topic links.</div>';
  }

  global.KnowledgeGraph = { mount: mountKnowledgeGraph };
})(window);
