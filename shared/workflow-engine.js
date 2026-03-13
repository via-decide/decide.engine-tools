(function (global) {
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

  function runWorkflow(workflow, allTools) {
    if (!workflow || !Array.isArray(workflow.steps) || workflow.steps.length === 0) {
      return { ok: false, message: 'Workflow has no steps.' };
    }

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

  global.WorkflowEngine = {
    buildStepOrder,
    createWorkflow,
    runWorkflow
  };
})(window);
