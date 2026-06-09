'use strict';

const examplePlugin = {
  id: 'example-plugin',
  name: 'Example Plugin',
  version: '1.0.0',
  init(ctx) {
    ctx.log('init', { pluginId: ctx.pluginId });
  },
  execute(ctx, input) {
    ctx.log('execute', { input });
    return {
      echoedInput: input,
      pluginId: ctx.pluginId
    };
  },
  dispose(ctx) {
    ctx.log('dispose', { pluginId: ctx.pluginId });
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = examplePlugin;
}
