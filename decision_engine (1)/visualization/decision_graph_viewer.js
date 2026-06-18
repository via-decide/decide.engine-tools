(function (global) {
  'use strict';

  class DecisionGraphViewer {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
    }

    render(nodes, edges) {
      if (!this.container) return;
      const nodeHtml = nodes.map((n) => `<li><strong>${n.id}</strong>: ${n.label}</li>`).join('');
      const edgeHtml = edges.map((e) => `<li>${e.from} → ${e.to}</li>`).join('');
      this.container.innerHTML = `
        <h3>Decision Graph</h3>
        <div><h4>Nodes</h4><ul>${nodeHtml}</ul></div>
        <div><h4>Edges</h4><ul>${edgeHtml}</ul></div>
      `;
    }
  }

  global.DecisionGraphViewer = DecisionGraphViewer;
})(window);

// Example usage:
// const viewer = new DecisionGraphViewer('graph');
// viewer.render([{id: 'n1', label: 'Collect Evidence'}], [{from: 'n1', to: 'n2'}]);
