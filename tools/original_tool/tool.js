const config = require('./config.json');

function registerTool(toolConfig) {
  try {
    const toolStorage = require('../shared/tool-storage');
    toolStorage.registerTool(toolConfig);
  } catch (error) {
    console.error('Error registering tool:', error);
  }
}

registerTool(config);