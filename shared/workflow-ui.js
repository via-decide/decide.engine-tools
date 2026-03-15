(function (global) {
  'use strict';

  const AUTOSAVE_KEY = 'viadecide.workflow-builder.draft';
  const state = { tools: [], nodes: [], edges: [], connectFrom: null, autosaveTimer: null };

  const el = (id) => document.getElementById(id);
  const uid = () => `node-${Math.random().toString(36).slice(2, 9)}`;

  function scheduleAutosave() {
    if (state.autosaveTimer) clearTimeout(state.autosaveTimer);
    state.autosaveTimer = setTimeout(() => {
      const draft = { id: el('workflow-id').value.trim() || 'untitled-workflow', nodes: state.nodes, edges: state.edges };
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(draft));
      const status = el('autosave-status');
      if (status) status.textContent = `Autosaved ${new Date().toLocaleTimeString()}`;
    }, 250);
  }

  function toolById(id) { return state.tools.find((t) => t.id === id) || null; }

  function currentWorkflow() {
    const id = el('workflow-id').value.trim() || 'untitled-workflow';
    return global.WorkflowEngine.createWorkflow(id, id, state.nodes, state.edges);
  }

  function syncPreview() {
    const wf = currentWorkflow();
    el('workflow-steps-preview').textContent = JSON.stringify({ id: wf.id, steps: wf.steps, nodes: state.nodes, edges: state.edges }, null, 2);
  }

  function syncCanvas() {
    const canvas = el('workflow-canvas');
    const nodesLayer = el('workflow-nodes');
    const edgesLayer = el('workflow-edges');

    nodesLayer.innerHTML = state.nodes.map((node) => {
      const tool = toolById(node.toolId);
      return `<div class="wf-node${state.connectFrom === node.instanceId ? ' selected' : ''}" data-instance-id="${node.instanceId}" style="left:${node.x}px;top:${node.y}px">
        <strong>${tool ? tool.name : node.toolId}</strong><small>${node.toolId}</small>
        <div class="node-actions"><button data-action="connect" type="button">Connect</button><button data-action="remove" type="button">Remove</button></div>
      </div>`;
    }).join('');

    const rect = canvas.getBoundingClientRect();
    edgesLayer.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    const byId = new Map(state.nodes.map((n) => [n.instanceId, n]));
    edgesLayer.innerHTML = `<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto"><polygon points="0 0,8 3.5,0 7" fill="#8fb6ff"></polygon></marker></defs>` + state.edges.map((edge) => {
      const from = byId.get(edge.from); const to = byId.get(edge.to);
      if (!from || !to) return '';
      return `<line x1="${from.x + 110}" y1="${from.y + 34}" x2="${to.x + 10}" y2="${to.y + 34}" marker-end="url(#arrow)"/>`;
    }).join('');

    bindNodes();
    syncPreview();
    scheduleAutosave();
  }

  function bindNodes() {
    el('workflow-nodes').querySelectorAll('.wf-node').forEach((nodeEl) => {
      const id = nodeEl.getAttribute('data-instance-id');
      nodeEl.addEventListener('pointerdown', (event) => {
        if (event.target.closest('button')) return;
        const node = state.nodes.find((item) => item.instanceId === id);
        if (!node) return;
        const startX = event.clientX; const startY = event.clientY; const ox = node.x; const oy = node.y;
        const move = (e) => { node.x = Math.max(8, ox + e.clientX - startX); node.y = Math.max(8, oy + e.clientY - startY); syncCanvas(); };
        const up = () => { global.removeEventListener('pointermove', move); global.removeEventListener('pointerup', up); };
        global.addEventListener('pointermove', move); global.addEventListener('pointerup', up);
      });

      nodeEl.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', () => {
          const action = button.getAttribute('data-action');
          if (action === 'remove') {
            state.nodes = state.nodes.filter((n) => n.instanceId !== id);
            state.edges = state.edges.filter((e) => e.from !== id && e.to !== id);
            if (state.connectFrom === id) state.connectFrom = null;
            syncCanvas();
            return;
          }
          if (!state.connectFrom) { state.connectFrom = id; syncCanvas(); return; }
          if (state.connectFrom !== id && !state.edges.some((e) => e.from === state.connectFrom && e.to === id)) {
            state.edges.push({ from: state.connectFrom, to: id });
          }
          state.connectFrom = null;
          syncCanvas();
        });
      });
    });
  }

  function renderSidebar() {
    el('tool-list').innerHTML = state.tools.map((tool) => `<button class="tool-chip" draggable="true" data-tool-id="${tool.id}" title="${tool.description || ''}"><strong>${tool.name}</strong><span>${tool.id}</span></button>`).join('');
    el('tool-list').querySelectorAll('[draggable="true"]').forEach((chip) => {
      chip.addEventListener('dragstart', (event) => event.dataTransfer.setData('text/tool-id', chip.getAttribute('data-tool-id')));
    });
  }

  function setupDrop() {
    const canvas = el('workflow-canvas');
    canvas.addEventListener('dragover', (event) => event.preventDefault());
    canvas.addEventListener('drop', (event) => {
      event.preventDefault();
      const toolId = event.dataTransfer.getData('text/tool-id');
      if (!toolId) return;
      const rect = canvas.getBoundingClientRect();
      state.nodes.push({ instanceId: uid(), toolId, x: Math.max(8, event.clientX - rect.left - 56), y: Math.max(8, event.clientY - rect.top - 24) });
      syncCanvas();
    });
  }

  function refreshSaved() {
    const workflows = global.WorkflowStorage.loadAll().sort((a, b) => a.id.localeCompare(b.id));
    el('saved-workflows').innerHTML = '<option value="">Select saved workflow</option>' + workflows.map((wf) => `<option value="${wf.id}">${wf.id}</option>`).join('');
  }

  function loadWorkflow(workflow) {
    if (!workflow) return;
    el('workflow-id').value = workflow.id || '';
    state.nodes = Array.isArray(workflow.nodes) ? workflow.nodes.map((n) => ({ ...n })) : [];
    state.edges = Array.isArray(workflow.edges) ? workflow.edges.map((e) => ({ ...e })) : [];
    state.connectFrom = null;
    syncCanvas();
  }

  function bindControls() {
    el('workflow-id').addEventListener('input', scheduleAutosave);

    el('save-workflow').addEventListener('click', () => {
      const wf = currentWorkflow();
      global.WorkflowStorage.save({ ...wf, nodes: state.nodes, edges: state.edges });
      refreshSaved();
    });

    el('load-workflow').addEventListener('click', () => {
      const selected = el('saved-workflows').value;
      if (!selected) return;
      loadWorkflow(global.WorkflowStorage.findById(selected));
    });

    el('run-workflow').addEventListener('click', () => {
      const result = global.WorkflowEngine.runWorkflow(currentWorkflow(), state.tools);
      if (!result.ok) alert(result.message);
    });

    el('clear-canvas').addEventListener('click', () => { state.nodes = []; state.edges = []; state.connectFrom = null; syncCanvas(); });

    el('export-workflow').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify({ ...currentWorkflow(), nodes: state.nodes, edges: state.edges }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${el('workflow-id').value.trim() || 'workflow'}.json`; a.click();
      URL.revokeObjectURL(url);
    });

    el('import-workflow').addEventListener('change', async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const parsed = JSON.parse(await file.text());
      loadWorkflow(parsed);
    });
  }

  function recoverDraft() {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (!raw) return;
      loadWorkflow(JSON.parse(raw));
    } catch (_error) {
      // no-op
    }
  }

  async function init() {
    if (!global.ToolRegistry || !global.WorkflowStorage || !global.WorkflowEngine) return;
    state.tools = await global.ToolRegistry.loadAll();
    renderSidebar();
    setupDrop();
    bindControls();
    refreshSaved();
    recoverDraft();
    syncCanvas();
  }

  global.WorkflowUI = { init };
})(window);
