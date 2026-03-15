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

  function loadAgentWorkflow(agentWorkflow) {
    if (!agentWorkflow) return;
    el('workflow-id').value = agentWorkflow.id || 'agent-workflow';
    state.nodes = Array.isArray(agentWorkflow.nodes) ? agentWorkflow.nodes.map((n) => ({ ...n })) : [];
    state.edges = Array.isArray(agentWorkflow.edges) ? agentWorkflow.edges.map((e) => ({ ...e })) : [];
    state.connectFrom = null;
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
        nodeType: 'tool',
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
      const result = global.WorkflowEngine.runWorkflow(workflow, state.tools, { navigate: false });
      if (!result.ok) {
        alert(result.message);
        return;
      }
      syncPreview({ message: result.message, logs: result.logs });
    });

    el('clear-canvas').addEventListener('click', () => {
      state.nodes = [];
      state.edges = [];
      state.connectFrom = null;
      syncCanvas();
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

    el('build-agent-workflow')?.addEventListener('click', () => {
      if (!global.AgentLayer) {
        alert('Agent layer is unavailable.');
        return;
      }
      const taskPrompt = el('agent-task-prompt')?.value.trim() || '';
      if (!taskPrompt) {
        alert('Enter an agent task prompt first.');
        return;
      }
      const plan = global.AgentLayer.createAgentWorkflow('Agent Workspace Plan', taskPrompt, state.tools);
      loadAgentWorkflow(plan);
      syncPreview({ message: 'Agent workflow generated.', selectedTools: plan.selectedTools?.map((tool) => tool.id) || [] });
    });

    el('run-agent-workflow')?.addEventListener('click', () => {
      if (!global.AgentLayer) {
        alert('Agent layer is unavailable.');
        return;
      }
      const taskPrompt = el('agent-task-prompt')?.value.trim() || '';
      if (!taskPrompt) {
        alert('Enter an agent task prompt first.');
        return;
      }
      const plan = global.AgentLayer.createAgentWorkflow('Agent Workspace Plan', taskPrompt, state.tools);
      loadAgentWorkflow(plan);
      const result = global.AgentLayer.runAgentTask(plan, state.tools, { navigate: false });
      if (!result.ok) {
        alert(result.message);
        return;
      }
      syncPreview({ message: result.message, logs: result.logs, selectedTools: plan.selectedTools?.map((tool) => tool.id) || [] });
    });

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

  async function init() {
    if (!global.ToolRegistry || !global.WorkflowStorage || !global.WorkflowEngine) return;
    state.tools = await global.ToolRegistry.loadAll();
    renderSidebar();
    setupCanvasDrop();
    bindControls();
    refreshSavedList();
    restoreDraft();
    syncCanvas();
  }

  global.WorkflowUI = { init, NODE_TYPES };
})(window);
