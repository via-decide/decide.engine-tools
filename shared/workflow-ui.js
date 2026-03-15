(function (global) {
  'use strict';

  const DRAFT_KEY = 'viadecide.workflow-builder.draft';
  const NODE_TYPES = ['tool', 'transform', 'decision', 'io'];
  const state = { tools: [], nodes: [], edges: [], connectFrom: null, autosaveTimer: null };

  const el = (id) => document.getElementById(id);
  const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

  function toolById(id) {
    return state.tools.find((tool) => tool.id === id) || null;
  }

  function setAutosaveStatus(text) {
    const node = el('autosave-status');
    if (node) node.textContent = text;
  }

  function scheduleAutosave() {
    clearTimeout(state.autosaveTimer);
    state.autosaveTimer = setTimeout(() => {
      const draft = {
        id: el('workflow-id').value.trim() || 'untitled-workflow',
        nodes: state.nodes,
        edges: state.edges
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setAutosaveStatus(`Autosaved at ${new Date().toLocaleTimeString()}`);
    }, 250);
  }

  function currentWorkflow() {
    const id = el('workflow-id').value.trim() || 'untitled-workflow';
    return global.WorkflowEngine.createWorkflow(id, id, state.nodes, state.edges);
  }

  function syncPreview(extra = null) {
    const output = {
      workflow: currentWorkflow(),
      runtime: extra
    };
    el('workflow-steps-preview').textContent = JSON.stringify(output, null, 2);
  }

  }

  function scheduleAutosave() {
    clearTimeout(state.autosaveTimer);
    state.autosaveTimer = setTimeout(() => {
      const draft = {
        id: el('workflow-id').value.trim() || 'untitled-workflow',
        nodes: state.nodes,
        edges: state.edges
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setAutosaveStatus(`Autosaved at ${new Date().toLocaleTimeString()}`);
    }, 250);
  }

  function currentWorkflow() {
    const id = el('workflow-id').value.trim() || 'untitled-workflow';
    return global.WorkflowEngine.createWorkflow(id, id, state.nodes, state.edges);
  }

  function syncPreview(extra = null) {
    const output = {
      workflow: currentWorkflow(),
      runtime: extra
    };
    el('workflow-steps-preview').textContent = JSON.stringify(output, null, 2);
  }

  function uniqueEdgePush(from, to) {
    if (from === to) return;
    if (state.edges.some((edge) => edge.from === from && edge.to === to)) return;
    state.edges.push({ from, to });
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

    list.querySelectorAll('.tool-chip').forEach((chip) => {
      chip.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/tool-id', chip.getAttribute('data-tool-id'));
      });
    });
  }

  function bindNodeEvents() {
    const nodesLayer = el('workflow-nodes');

    nodesLayer.querySelectorAll('.wf-node').forEach((nodeEl) => {
      const instanceId = nodeEl.getAttribute('data-instance-id');

      nodeEl.addEventListener('pointerdown', (event) => {
        if (event.target.tagName === 'BUTTON' || event.target.tagName === 'SELECT') return;
        const node = state.nodes.find((n) => n.instanceId === instanceId);
      nodeEl.addEventListener('pointerdown', (event) => {
        if (event.target.tagName === 'BUTTON' || event.target.tagName === 'SELECT') return;
        const node = state.nodes.find((n) => n.instanceId === instanceId);
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

      const typeSelect = nodeEl.querySelector('select[data-action="node-type"]');
      typeSelect?.addEventListener('change', () => {
        const node = state.nodes.find((n) => n.instanceId === instanceId);
        if (!node) return;
        node.nodeType = typeSelect.value;
        syncCanvas();
      });

      const typeSelect = nodeEl.querySelector('select[data-action="node-type"]');
      typeSelect?.addEventListener('change', () => {
        const node = state.nodes.find((n) => n.instanceId === instanceId);
        if (!node) return;
        node.nodeType = typeSelect.value;
        syncCanvas();
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

  function syncCanvas() {
    const canvas = el('workflow-canvas');
    const edgesLayer = el('workflow-edges');
    const nodesLayer = el('workflow-nodes');

    nodesLayer.innerHTML = state.nodes.map((node) => {
      const tool = toolById(node.toolId);
      const typeOptions = NODE_TYPES
        .map((type) => `<option value="${type}"${node.nodeType === type ? ' selected' : ''}>${type}</option>`)
        .join('');
      return `
        <div class="wf-node${state.connectFrom === node.instanceId ? ' selected' : ''}" data-instance-id="${node.instanceId}" style="left:${node.x}px; top:${node.y}px;" tabindex="0" role="button">
          <strong>${tool ? tool.name : node.toolId}</strong>
          <small>${node.toolId}</small>
          <select data-action="node-type" aria-label="Node type">${typeOptions}</select>
          <div class="node-actions">
            <button data-action="connect" type="button">Connect</button>
            <button data-action="remove" type="button">Remove</button>
          </div>
        </div>
      `;
    }).join('');

    const rect = canvas.getBoundingClientRect();
    edgesLayer.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    edgesLayer.innerHTML = '<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto"><polygon points="0 0, 8 3.5, 0 7" fill="#8fb6ff"></polygon></marker></defs>' + state.edges.map((edge) => {
      const a = state.nodes.find((node) => node.instanceId === edge.from);
      const b = state.nodes.find((node) => node.instanceId === edge.to);
      if (!a || !b) return '';
      return `<line x1="${a.x + 110}" y1="${a.y + 34}" x2="${b.x + 10}" y2="${b.y + 34}" marker-end="url(#arrow)" />`;
    }).join('');

    bindNodeEvents();
    syncPreview();
    scheduleAutosave();
  }

  function loadWorkflow(workflow) {
    state.nodes = Array.isArray(workflow.nodes) ? workflow.nodes.map((n) => ({ nodeType: 'tool', ...n })) : [];
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
      state.nodes.push({
        instanceId: uid('node'),
        toolId,
        nodeType: 'tool',
        x: Math.max(8, event.clientX - rect.left - 56),
        y: Math.max(8, event.clientY - rect.top - 24)
      });
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

  function exportWorkflow() {
    const workflow = currentWorkflow();
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${workflow.id}.json`;
    link.click();
    URL.revokeObjectURL(href);
  }

  function exportWorkflow() {
    const workflow = currentWorkflow();
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${workflow.id}.json`;
    link.click();
    URL.revokeObjectURL(href);
  }

  function bindControls() {
    el('workflow-id').addEventListener('input', scheduleAutosave);

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
      const workflow = currentWorkflow();
      const check = ensureRunnable(workflow);
      if (!check.ok) {
        alert(check.message);
        return;
      }
      const result = global.WorkflowEngine.runWorkflow(workflow, state.tools, { navigate: false });
      if (!result.ok) {
        alert(result.message);
        return;
      }
      syncPreview({ message: result.message, logs: result.logs });
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

    el('export-workflow')?.addEventListener('click', exportWorkflow);
    el('import-workflow')?.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        loadWorkflow(parsed);
      } catch (_error) {
        alert('Invalid workflow JSON file.');
      }
      event.target.value = '';
    });

    el('export-workflow')?.addEventListener('click', exportWorkflow);
    el('import-workflow')?.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        loadWorkflow(parsed);
      } catch (_error) {
        alert('Invalid workflow JSON file.');
      }
      event.target.value = '';
    });

    el('workflow-id')?.addEventListener('input', scheduleAutosave);
  }

  function restoreDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.nodes)) return;
      loadWorkflow(parsed);
      setAutosaveStatus('Restored draft from local storage.');
    } catch (_error) {
      // no-op
    }
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
    refreshSavedList();
    restoreDraft();
    refreshSaved();
    recoverDraft();
    syncCanvas();
  }

  global.WorkflowUI = { init, NODE_TYPES };
})(window);
