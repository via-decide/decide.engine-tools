(function (global) {
  async function saveNote(content) {
    if (typeof fetch === 'function') {
      // Placeholder adapter for local note endpoint if available.
      try {
        await fetch('./notes/', { method: 'POST', body: content });
      } catch (_) {}
    }
    localStorage.setItem('studyos_research_note', content);
  }

  function mountNotesEditor(root) {
    if (!root) return;
    root.innerHTML = `
      <textarea id="research-notes-text" class="os-input" style="min-height:220px" placeholder="# Research notes"></textarea>
      <div class="mt-3 flex gap-2">
        <button id="copy-summary-to-notes" class="os-btn-ghost">Copy Research Output</button>
        <button id="save-research-notes" class="os-btn">Save Notes</button>
      </div>
    `;

    const textarea = root.querySelector('#research-notes-text');
    textarea.value = localStorage.getItem('studyos_research_note') || '';
    root.querySelector('#save-research-notes').addEventListener('click', () => saveNote(textarea.value));
  }

  global.NotesEditor = { mount: mountNotesEditor, saveNote };
})(window);
