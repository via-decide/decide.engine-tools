(function (global) {
  'use strict';

  const RUN_KEY = 'viadecide.agent-runtime.last-run';

  function run(agent, tools, options) {
    return global.WorkflowEngine.runWorkflow(agent, tools, options);
  }

  function runSequentially(agent, tools, context = {}) {
    const toolMap = new Map((tools || []).map((tool) => [tool.id, tool]));
    const logs = [];
    let activeContext = { ...context, agentId: agent.id };

    (agent.steps || []).forEach((step, index) => {
      const tool = toolMap.get(step.toolId) || null;
      const output = {
        stepId: step.id,
        toolId: step.toolId,
        action: step.action || 'execute',
        message: tool ? `Executed ${tool.name}` : `Executed ${step.toolId}`
      };
      logs.push({ index, step, output, timestamp: new Date().toISOString() });
      activeContext = { ...activeContext, lastOutput: output };
    });

    const payload = {
      ok: true,
      message: `Executed ${logs.length} step(s).`,
      logs,
      context: activeContext
    };

    localStorage.setItem(RUN_KEY, JSON.stringify(payload));
    return payload;
  }

  function getLastRun() {
    try {
      const raw = localStorage.getItem(RUN_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_error) {
      return null;
    }
  }

  global.AgentRuntime = { run, runSequentially, getLastRun };
})(window);
