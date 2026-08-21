const { registerTool } = require('../shared/tool-storage.js');

const tool = {
  id: 'example',
  name: 'Example Tool',
  description: 'This is an example tool.',
  category: 'Tools',
  audience: ['developers', 'researchers'],
  inputs: [],
  outputs: [],
  tags: []
};

registerTool(tool);