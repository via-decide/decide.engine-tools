(function (global) {
  function escapeRegExp(text) {
    return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlight(content, query) {
    if (!query) return content;
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'ig');
    return String(content || '').replace(regex, '<mark>$1</mark>');
  }

  function renderDocument(root, documentData, query) {
    if (!root) return;
    const metadata = documentData && documentData.metadata ? documentData.metadata : {};
    const chunks = Array.isArray(documentData && documentData.chunks) ? documentData.chunks : [];

    root.innerHTML = `
      <div class="text-xs text-[var(--muted)] mb-2">
        <div><strong>book_title:</strong> ${metadata.book_title || 'Unknown'}</div>
        <div><strong>chapter:</strong> ${metadata.chapter || 'Unknown'}</div>
        <div><strong>corpus_path:</strong> ${metadata.corpus_path || 'Unknown'}</div>
      </div>
      <div style="max-height:260px;overflow:auto;" class="space-y-2">
        ${chunks.map((chunk) => `<p class="text-sm leading-relaxed">${highlight(chunk.text || chunk, query)}</p>`).join('') || '<p class="text-sm text-[var(--muted)]">Open a result to load document chunks.</p>'}
      </div>
    `;
  }

  global.DocumentViewer = { render: renderDocument };
})(window);
