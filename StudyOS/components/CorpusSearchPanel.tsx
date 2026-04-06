(function (global) {
  function mountCorpusSearchPanel(root, onSearch) {
    if (!root) return;
    root.innerHTML = `
      <div class="os-card">
        <h3>Corpus Search</h3>
        <input id="nex-search-input" class="os-input" placeholder="Search Nex corpus" />
        <div id="nex-search-results" class="mt-4 space-y-2 text-sm"></div>
      </div>
    `;

    const input = root.querySelector('#nex-search-input');
    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => onSearch(input.value), 300);
    });
  }

  global.CorpusSearchPanel = { mount: mountCorpusSearchPanel };
})(window);
