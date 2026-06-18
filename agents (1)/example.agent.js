'use strict';

module.exports = {
  id: 'example',
  name: 'Example Agent',
  version: '1.0.0',
  init(ctx) {
    ctx.state.set('initCount', (ctx.state.get('initCount') || 0) + 1);
  },
  run(ctx, input) {
    const runCount = (ctx.state.get('runCount') || 0) + 1;
    ctx.state.set('runCount', runCount);
    return {
      echoedInput: input,
      runCount,
      agentId: ctx.meta.agentId
    };
  },
  dispose(ctx) {
    ctx.state.set('lastDisposedAt', Date.now());
  }
};
