(function (global) {
  const RUN_STATE_KEY = 'viadecide.workflow-builder.run-state';

  function buildStepOrder(nodes, edges) {
    if (!nodes.length) return [];

    if (!edges.length) {
      return nodes
        .slice()
        .sort((a, b) => a.x - b.x || a.y - b.y)
        .map((node) => node.toolId);
    }

    const adjacency = new Map();
    const inDegree = new Map();

    nodes.forEach((node) => {
      adjacency.set(node.instanceId, []);
      inDegree.set(node.instanceId, 0);
    });

    edges.forEach((edge) => {
      if (!adjacency.has(edge.from) || !adjacency.has(edge.to)) return;
      if (edge.from === edge.to) return;
      adjacency.get(edge.from).push(edge.to);
      inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
    });

    const queue = nodes
      .filter((node) => (inDegree.get(node.instanceId) || 0) === 0)
      .sort((a, b) => a.x - b.x || a.y - b.y)
      .map((node) => node.instanceId);

    const orderedInstanceIds = [];
    while (queue.length) {
      const current = queue.shift();
      orderedInstanceIds.push(current);
      const next = adjacency.get(current) || [];
      next.forEach((id) => {
        const d = (inDegree.get(id) || 0) - 1;
        inDegree.set(id, d);
        if (d === 0) queue.push(id);
      });
    }

    if (orderedInstanceIds.length !== nodes.length) {
      return nodes
        .slice()
        .sort((a, b) => a.x - b.x || a.y - b.y)
        .map((node) => node.toolId);
    }

    const byInstance = new Map(nodes.map((node) => [node.instanceId, node]));
    return orderedInstanceIds.map((id) => byInstance.get(id).toolId);
  }

  function createWorkflow(id, name, nodes, edges) {
    const steps = buildStepOrder(nodes, edges);
    return {
      id,
      name,
      createdAt: new Date().toISOString(),
      steps,
      nodes,
      edges
    };
  }

  function setRunState(runState) {
    localStorage.setItem(RUN_STATE_KEY, JSON.stringify(runState));
  }

  function getRunState() {
    try {
      const raw = localStorage.getItem(RUN_STATE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function clearRunState() {
    localStorage.removeItem(RUN_STATE_KEY);
  }

  function resolveToolMap(allTools) {
    return new Map((allTools || []).map((tool) => [tool.id, tool]));
  }

  function nextStepFrom(runState, currentToolId) {
    if (!runState || !Array.isArray(runState.steps)) return null;
    const index = runState.steps.indexOf(currentToolId);
    if (index === -1) return null;
    if (index >= runState.steps.length - 1) return null;
    return {
      currentIndex: index,
      nextToolId: runState.steps[index + 1]
    };
  }

  function runWorkflow(workflow, allTools) {
    if (!workflow || !Array.isArray(workflow.steps) || workflow.steps.length === 0) {
      return { ok: false, message: 'Workflow has no steps.' };
    }

    const byId = resolveToolMap(allTools);
    const byId = new Map(allTools.map((tool) => [tool.id, tool]));
    const firstTool = byId.get(workflow.steps[0]);
    if (!firstTool || !firstTool.entry) {
      return { ok: false, message: 'First step tool entry not found.' };
    }

    const runState = {
      workflowId: workflow.id,
      startedAt: new Date().toISOString(),
      steps: workflow.steps,
      currentIndex: 0
    };
    setRunState(runState);
    localStorage.setItem('viadecide.workflow-builder.run-state', JSON.stringify(runState));

    for (let i = 0; i < workflow.steps.length - 1; i += 1) {
      const fromToolId = workflow.steps[i];
      const toToolId = workflow.steps[i + 1];
      if (global.ToolBridge && typeof global.ToolBridge.sendContext === 'function') {
        global.ToolBridge.sendContext(fromToolId, toToolId, {
          workflowId: workflow.id,
          currentStepIndex: i,
          nextToolId: toToolId,
          steps: workflow.steps
        });
      }
    }

    global.location.href = firstTool.entry;
    return { ok: true, message: 'Workflow started.' };
  }

  function openNextToolFromCurrent(currentToolId, allTools) {
    const runState = getRunState();
    const next = nextStepFrom(runState, currentToolId);
    if (!next) {
      return { ok: false, message: 'No next step found for current tool.' };
    }

    const byId = resolveToolMap(allTools);
    const target = byId.get(next.nextToolId);
    if (!target || !target.entry) {
      return { ok: false, message: 'Next tool entry not found.' };
    }

    setRunState({ ...runState, currentIndex: next.currentIndex + 1 });
    global.location.href = target.entry;
    return { ok: true, message: `Opening ${next.nextToolId}.` };
  }

  global.WorkflowEngine = {
    buildStepOrder,
    createWorkflow,
    runWorkflow,
    getRunState,
    clearRunState,
    openNextToolFromCurrent
  global.WorkflowEngine = {
    buildStepOrder,
    createWorkflow,
    runWorkflow
  };
})(window);
