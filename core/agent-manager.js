'use strict';

const { createPluginSystem } = require('./plugin-system');
const { createRuntime } = require('./runtime');
const { createAgentContext } = require('./agent-context');

function getLifecycleTaskError(report, expectedTaskId, fallbackMessage) {
  if (!report || !Array.isArray(report.errors)) return null;
  const matchingError = report.errors.find((error) => error && error.taskId === expectedTaskId);
  if (!matchingError) return null;
  return new Error(matchingError.message || fallbackMessage);
}

class AgentManager {
  constructor(options = {}) {
    this.runtime = options.runtime || createRuntime(options.runtimeOptions || {});
    this.trace = options.traceEngine || this.runtime.trace;
    this.pluginSystem = options.pluginSystem || createPluginSystem({ traceEngine: this.trace });
    this.agents = new Map();
  }

  registerAgent(agent) {
    const required = ['id', 'name', 'version', 'init', 'run', 'dispose'];
    const missing = required.filter((key) => agent == null || agent[key] == null);
    if (missing.length) throw new Error(`Agent missing required fields: ${missing.join(', ')}`);
    ['init', 'run', 'dispose'].forEach((hook) => {
      if (typeof agent[hook] !== 'function') throw new Error(`Agent lifecycle hook must be a function: ${hook}`);
    });

    const adapterPlugin = {
      id: `agent:${agent.id}`,
      name: agent.name,
      version: agent.version,
      init() {},
      execute() { return null; },
      dispose() {}
    };
    this.pluginSystem.registerPlugin(adapterPlugin);
    this.agents.set(agent.id, Object.freeze({ ...agent }));
    return agent.id;
  }

  listAgents() {
    return Array.from(this.agents.values()).map((agent) => ({ id: agent.id, name: agent.name, version: agent.version }));
  }

  getAgent(agentId) {
    return this.agents.get(agentId) || null;
  }

  runAgent(agentId, input) {
    const agent = this.getAgent(agentId);
    if (!agent) throw new Error(`Unknown agent: ${agentId}`);

    const flowId = this.trace.startFlow({ source: 'agent-manager', agentId });
    const rootSpanId = this.trace.startSpan(flowId, { name: 'agent.run' });
    const ctx = createAgentContext({
      stateManager: this.runtime.stateManager,
      trace: this.trace,
      runtime: this.runtime,
      agentId,
      flowId,
      meta: { startedAt: Date.now(), input: input === undefined ? null : input }
    });

    let result;
    let runFailed = false;
    let runError = null;
    try {
      const initSpanId = this.trace.startSpan(flowId, { name: 'agent.init', parentId: rootSpanId });
      this.runtime.scheduler.schedule({ id: `agent:init:${agentId}`, run: () => agent.init(ctx) });
      const initTaskId = `agent:init:${agentId}`;
      const initReport = this.runtime.step();
      const initError = getLifecycleTaskError(initReport, initTaskId, 'Agent init failed during scheduled task execution.');
      if (initError) throw initError;
      this.trace.endSpan(initSpanId, { agentId });

      const runSpanId = this.trace.startSpan(flowId, { name: 'agent.lifecycle.run', parentId: rootSpanId });
      const runTaskId = `agent:run:${agentId}`;
      this.runtime.scheduler.schedule({ id: runTaskId, run: () => { result = agent.run(ctx, input); } });
      const runReport = this.runtime.step();
      const runErrorFromReport = getLifecycleTaskError(runReport, runTaskId, 'Agent run failed during scheduled task execution.');
      if (runErrorFromReport) throw runErrorFromReport;
      this.trace.endSpan(runSpanId, { agentId });
    } catch (error) {
      runFailed = true;
      runError = error;
    } finally {
      const disposeSpanId = this.trace.startSpan(flowId, { name: 'agent.dispose', parentId: rootSpanId });
      try {
        const disposeTaskId = `agent:dispose:${agentId}`;
        this.runtime.scheduler.schedule({ id: disposeTaskId, run: () => agent.dispose(ctx) });
        const disposeReport = this.runtime.step();
        const disposeErrorFromReport = getLifecycleTaskError(disposeReport, disposeTaskId, 'Agent dispose failed during scheduled task execution.');
        if (disposeErrorFromReport) throw disposeErrorFromReport;
        this.trace.endSpan(disposeSpanId, { agentId });
      } catch (disposeError) {
        runFailed = true;
        runError = runError || disposeError;
        this.trace.fail(disposeSpanId, disposeError, { agentId, phase: 'dispose' });
      }
    }

    if (runFailed) {
      this.trace.fail(rootSpanId, runError, { agentId, phase: 'execution' });
      this.trace.endFlow(flowId, { failed: true, agentId, error: runError.message });
      throw runError;
    }

    this.trace.endSpan(rootSpanId, { agentId });
    this.trace.endFlow(flowId, { failed: false, agentId });
    return { result, flowId, trace: this.trace.getFlow(flowId) };
  }
}

module.exports = {
  AgentManager,
  createAgentManager: (options) => new AgentManager(options)
};
