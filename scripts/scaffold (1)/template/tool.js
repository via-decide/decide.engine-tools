class {{TOOL_NAME}}Tool {
  constructor(rootEl) {
    this.root = rootEl || document.getElementById('app');
    this.render();
  }
  render() {
    this.root.innerHTML = `<h2>Welcome to {{TOOL_NAME}}</h2><button id="run-btn">Run</button>`;
    this.root.querySelector('#run-btn').addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('via:tool:run', { detail: { toolId: '{{TOOL_NAME}}' }}));
    });
  }
}
new {{TOOL_NAME}}Tool();
