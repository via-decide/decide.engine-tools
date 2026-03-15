(function (global) {
  'use strict';

  const RUN_STATE_KEY = 'viadecide.workflow-builder.run-state';

  function buildStepOrder(nodes, edges) {
    if (!nodes.length) return [];

    const adjacency = new Map();
    const inDegree = new Map();
    nodes.forEach((node) => {
      adjacency.set(node.instanceId, []);
      inDegree.set(node.instanceId, 0);
    });

    (edges || []).forEach((edge) => {
      if (!adjacency.has(edge.from) || !adjacency.has(edge.to) || edge.from === edge.to) return;
      adjacency.get(edge.from).push(edge.to);
      inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
    });

    const queue = nodes
      .filter((node) => (inDegree.get(node.instanceId) || 0) === 0)
      .sort((a, b) => a.x - b.x || a.y - b.y)
      .map((node) => node.instanceId);

    const order = [];
    while (queue.length) {
      const current = queue.shift();
      order.push(current);
      (adjacency.get(current) || []).forEach((nextId) => {
        const remaining = (inDegree.get(nextId) || 0) - 1;
        inDegree.set(nextId, remaining);
        if (remaining === 0) queue.push(nextId);
      });
    }

    const byInstanceId = new Map(nodes.map((node) => [node.instanceId, node]));
    const fallback = nodes.slice().sort((a, b) => a.x - b.x || a.y - b.y).map((node) => node.instanceId);
    return (order.length === nodes.length ? order : fallback).map((instanceId) => byInstanceId.get(instanceId));
  }

  function createWorkflow(id, name, nodes, edges) {
    const orderedNodes = buildStepOrder(nodes, edges);
    return {
      id,
      name,
      createdAt: new Date().toISOString(),
      steps: orderedNodes.map((node) => ({
        instanceId: node.instanceId,
        toolId: node.toolId,
        nodeType: node.nodeType || 'tool',
        config: node.config || {}
      })),
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
      return raw ? JSON.parse(raw) : null;
    } catch (_error) {
      return null;
    }
  }

  function clearRunState() {
    localStorage.removeItem(RUN_STATE_KEY);
  }

  function createExecutors() {
    return {
      tool: (step, context) => ({ ok: true, message: `Tool step queued: ${step.toolId}`, context }),
      transform: (step, context) => ({ ok: true, message: `Transform executed for ${step.toolId || step.instanceId}`, context }),
      decision: (step, context) => ({ ok: true, message: `Decision checkpoint for ${step.toolId || step.instanceId}`, context }),
      io: (step, context) => ({ ok: true, message: `I/O node processed: ${step.toolId || step.instanceId}`, context })
    };
  }

  function runWorkflow(workflow, allTools, options = {}) {
    if (!workflow || !Array.isArray(workflow.steps) || workflow.steps.length === 0) {
      return { ok: false, message: 'Workflow has no steps.' };
    }

    const toolMap = new Map((allTools || []).map((tool) => [tool.id, tool]));
    const executors = createExecutors();
    const logs = [];
    let activeContext = { workflowId: workflow.id };

    workflow.steps.forEach((step, index) => {
      const executor = executors[step.nodeType] || executors.tool;
      const result = executor(step, activeContext);
      logs.push({ index, step, result });
      activeContext = { ...activeContext, lastStep: step.instanceId, lastToolId: step.toolId };
    });

    const firstStep = workflow.steps[0];
    const firstTool = toolMap.get(firstStep.toolId);
    const shouldNavigate = options.navigate !== false;

    setRunState({
      workflowId: workflow.id,
      startedAt: new Date().toISOString(),
      currentIndex: 0,
      steps: workflow.steps
    });

    if (shouldNavigate && firstTool && firstTool.entry) {
      global.location.href = firstTool.entry;
    }

    return {
      ok: true,
      message: shouldNavigate ? 'Workflow started.' : 'Workflow executed in preview mode.',
      logs,
      firstTool: firstTool || null
    };
  }

  global.WorkflowEngine = {
    buildStepOrder,
    createWorkflow,
    runWorkflow,
    getRunState,
    clearRunState
  };
})(window);
