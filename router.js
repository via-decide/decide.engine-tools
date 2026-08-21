const toolStorage = require('../shared/tool-storage.js');

// Registering the new tool.
toolStorage.registerTool(require('./tools/tool1'));

// Tool registration map.
const toolRegistry = {
  'tool1': '/tools/tool1/index.html'
};

module.exports = {
  getToolPath(toolId) {
    return toolRegistry[toolId];
  }
};