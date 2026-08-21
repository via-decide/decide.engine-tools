const { registerTool } = require('../shared/tool-storage.js');

const tool = {
  id: 'example-tool',
  name: 'Example Tool',
  description: 'A sample tool to demonstrate the system.',
};

registerTool(tool);