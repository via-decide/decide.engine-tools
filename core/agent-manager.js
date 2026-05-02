'use strict';

const { createPluginSystem } = require('./plugin-system');
const { createRuntime } = require('./runtime');
const { createAgentContext } = require('./agent-context');

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
    const invocationKey = `${agentId}:${flowId}`;
    const ensureTickSucceeded = (report, phase) => {
      if (report && report.failed > 0) {
        const firstError = Array.isArray(report.errors) && report.errors.length ? report.errors[0] : null;
        const message = firstError && firstError.message
          ? firstError.message
          : `Scheduled ${phase} task failed.`;
        throw new Error(message);
      }
    };
    const emitTransition = (eventType, spanId) => {
      const transition = this.runtime.stateMachine.transition(invocationKey, { type: eventType });
      this.trace.event(spanId, 'state.transition', transition);
      return transition;
    };
    const ctx = createAgentContext({
      stateManager: this.runtime.stateManager,
      trace: this.trace,
      runtime: this.runtime,
      agentId,
      flowId,
      meta: { startedAt: Date.now(), input: input === undefined ? null : input }
    });

    let result;
    try {
      const initSpanId = this.trace.startSpan(flowId, { name: 'agent.init', parentId: rootSpanId });
      emitTransition('initialize', initSpanId);
      this.runtime.scheduler.schedule({ id: `agent:init:${agentId}`, run: () => agent.init(ctx) });
      const initReport = this.runtime.step();
      ensureTickSucceeded(initReport, 'init');
      this.trace.endSpan(initSpanId, { agentId });

      const runSpanId = this.trace.startSpan(flowId, { name: 'agent.lifecycle.run', parentId: rootSpanId });
      emitTransition('start', runSpanId);
      this.runtime.scheduler.schedule({ id: `agent:run:${agentId}`, run: () => { result = agent.run(ctx, input); } });
      const runReport = this.runtime.step();
      if (runReport.failed > 0) {
        if (this.runtime.stateMachine.canTransition(invocationKey, { type: 'fail' })) {
          this.trace.event(runSpanId, 'state.transition', this.runtime.stateMachine.transition(invocationKey, { type: 'fail' }));
        }
        ensureTickSucceeded(runReport, 'run');
      }
      emitTransition('complete', runSpanId);
      this.trace.endSpan(runSpanId, { agentId });
    } catch (error) {
      if (this.runtime.stateMachine.canTransition(invocationKey, { type: 'fail' })) {
        const failTransition = this.runtime.stateMachine.transition(invocationKey, { type: 'fail' });
        this.trace.event(rootSpanId, 'state.transition', failTransition);
      }
      error.flowId = flowId;
      this.trace.fail(rootSpanId, error, { agentId, phase: 'execution' });
      this.trace.endFlow(flowId, { failed: true, agentId, error: error.message });
      throw error;
    } finally {
      const disposeSpanId = this.trace.startSpan(flowId, { name: 'agent.dispose', parentId: rootSpanId });
      try {
        this.runtime.scheduler.schedule({ id: `agent:dispose:${agentId}`, run: () => agent.dispose(ctx) });
        const disposeReport = this.runtime.step();
        ensureTickSucceeded(disposeReport, 'dispose');
        this.trace.endSpan(disposeSpanId, { agentId });
      } catch (disposeError) {
        this.trace.fail(disposeSpanId, disposeError, { agentId, phase: 'dispose' });
      }
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
