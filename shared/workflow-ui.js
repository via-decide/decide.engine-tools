(function (global) {
  const state = {
    tools: [],
    nodes: [],
    edges: [],
    connectFrom: null
  };

  function uid(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function el(id) {
    return document.getElementById(id);
  }

  function renderSidebar() {
    const list = el('tool-list');
    list.innerHTML = state.tools
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((tool) => `
        <button class="tool-chip" draggable="true" data-tool-id="${tool.id}" title="${tool.description || ''}">
          <strong>${tool.name}</strong>
          <span>${tool.id}</span>
        </button>
      `)
      .join('');

    list.querySelectorAll('[draggable="true"]').forEach((chip) => {
      chip.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/tool-id', chip.getAttribute('data-tool-id'));
      });
    });
  }

  function toolById(id) {
    return state.tools.find((tool) => tool.id === id) || null;
  }

  function uniqueEdgePush(from, to) {
    if (from === to) return;
    const exists = state.edges.some((e) => e.from === from && e.to === to);
    if (!exists) state.edges.push({ from, to });
  }

  function syncCanvas() {
    const canvas = el('workflow-canvas');
    const edgesLayer = el('workflow-edges');
    const nodesLayer = el('workflow-nodes');

    nodesLayer.innerHTML = state.nodes.map((node) => {
      const tool = toolById(node.toolId);
      return `
        <div class="wf-node${state.connectFrom === node.instanceId ? ' selected' : ''}" data-instance-id="${node.instanceId}" style="left:${node.x}px; top:${node.y}px;" tabindex="0" role="button" aria-label="Workflow node ${tool ? tool.name : node.toolId}">
          <strong>${tool ? tool.name : node.toolId}</strong>
          <small>${node.toolId}</small>
          <div class="node-actions">
            <button data-action="connect" type="button">Connect</button>
            <button data-action="remove" type="button">Remove</button>
          </div>
        </div>
      `;
    }).join('');

    const rect = canvas.getBoundingClientRect();
    edgesLayer.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);

    const byId = new Map(state.nodes.map((node) => [node.instanceId, node]));
    edgesLayer.innerHTML = state.edges.map((edge) => {
      const a = byId.get(edge.from);
      const b = byId.get(edge.to);
      if (!a || !b) return '';
      return `<line x1="${a.x + 110}" y1="${a.y + 34}" x2="${b.x + 10}" y2="${b.y + 34}" marker-end="url(#arrow)" />`;
    }).join('');

    bindNodeEvents();
    syncStepsPreview();
  }

  function bindNodeEvents() {
    const nodesLayer = el('workflow-nodes');

    nodesLayer.querySelectorAll('.wf-node').forEach((nodeEl) => {
      const instanceId = nodeEl.getAttribute('data-instance-id');

      nodeEl.addEventListener('pointerdown', (event) => {
        if (event.target.tagName === 'BUTTON') return;
        const node = state.nodes.find((n) => n.instanceId === instanceId);
        if (!node) return;
        const startX = event.clientX;
        const startY = event.clientY;
        const originX = node.x;
        const originY = node.y;

        const onMove = (moveEvent) => {
          node.x = Math.max(8, originX + (moveEvent.clientX - startX));
          node.y = Math.max(8, originY + (moveEvent.clientY - startY));
          syncCanvas();
        };

        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
      });

      nodeEl.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', () => {
          const action = button.getAttribute('data-action');
          if (action === 'remove') {
            state.nodes = state.nodes.filter((n) => n.instanceId !== instanceId);
            state.edges = state.edges.filter((e) => e.from !== instanceId && e.to !== instanceId);
            if (state.connectFrom === instanceId) state.connectFrom = null;
            syncCanvas();
            return;
          }

          if (action === 'connect') {
            if (!state.connectFrom) {
              state.connectFrom = instanceId;
              syncCanvas();
              return;
            }

            if (state.connectFrom === instanceId) {
              state.connectFrom = null;
              syncCanvas();
              return;
            }

            uniqueEdgePush(state.connectFrom, instanceId);
            state.connectFrom = null;
            syncCanvas();
          }
        });
      });
    });
  }

  function currentWorkflow() {
    const id = el('workflow-id').value.trim() || 'untitled-workflow';
    return global.WorkflowEngine.createWorkflow(id, id, state.nodes, state.edges);
  }

  function syncStepsPreview() {
    const output = el('workflow-steps-preview');
    const workflow = currentWorkflow();
    output.textContent = JSON.stringify({ id: workflow.id, steps: workflow.steps }, null, 2);
  }

  function loadWorkflow(workflow) {
    state.nodes = Array.isArray(workflow.nodes) ? workflow.nodes.map((n) => ({ ...n })) : [];
    state.edges = Array.isArray(workflow.edges) ? workflow.edges.map((e) => ({ ...e })) : [];
    state.connectFrom = null;
    el('workflow-id').value = workflow.id || '';
    syncCanvas();
  }

  function refreshSavedList() {
    const select = el('saved-workflows');
    const items = global.WorkflowStorage.loadAll();
    select.innerHTML = '<option value="">Select saved workflow</option>' + items
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((workflow) => `<option value="${workflow.id}">${workflow.id}</option>`)
      .join('');
  }

  function setupCanvasDrop() {
    const canvas = el('workflow-canvas');
    canvas.addEventListener('dragover', (event) => event.preventDefault());
    canvas.addEventListener('drop', (event) => {
      event.preventDefault();
      const toolId = event.dataTransfer.getData('text/tool-id');
      if (!toolId) return;
      const rect = canvas.getBoundingClientRect();
      state.nodes.push({
        instanceId: uid('node'),
        toolId,
        x: Math.max(8, event.clientX - rect.left - 56),
        y: Math.max(8, event.clientY - rect.top - 24)
      });
      syncCanvas();
    });
  }

  function ensureRunnable(workflow) {
    if (!workflow.steps.length) {
      return { ok: false, message: 'Add at least one tool node before saving or running.' };
    }
    return { ok: true };
  }

  function bindControls() {
    el('save-workflow').addEventListener('click', () => {
      const id = el('workflow-id').value.trim();
      if (!id) {
        alert('Enter a workflow id before saving.');
        return;
      }
      const workflow = currentWorkflow();
      const check = ensureRunnable(workflow);
      if (!check.ok) {
        alert(check.message);
        return;
      }
      global.WorkflowStorage.save(workflow);
      refreshSavedList();
    });

    el('load-workflow').addEventListener('click', () => {
      const id = el('saved-workflows').value;
      if (!id) return;
      const workflow = global.WorkflowStorage.findById(id);
      if (workflow) loadWorkflow(workflow);
    });

    el('run-workflow').addEventListener('click', () => {
      const workflow = currentWorkflow();
      const check = ensureRunnable(workflow);
      if (!check.ok) {
        alert(check.message);
        return;
      }
      const result = global.WorkflowEngine.runWorkflow(workflow, state.tools);
      if (!result.ok) alert(result.message);
    });

    el('clear-canvas').addEventListener('click', () => {
      state.nodes = [];
      state.edges = [];
      state.connectFrom = null;
      syncCanvas();
    });
  }

  async function init() {
    if (!global.ToolRegistry || !global.WorkflowStorage || !global.WorkflowEngine) return;
    state.tools = await global.ToolRegistry.loadAll();
    renderSidebar();
    setupCanvasDrop();
    bindControls();
    refreshSavedList();
    syncCanvas();
  }

  global.WorkflowUI = { init };
})(window);
