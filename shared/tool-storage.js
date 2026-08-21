const tools = [];

function registerTool(tool) {
  if (!tool || typeof tool !== 'object') {
    throw new Error('Invalid tool provided');
  }
  tools.push(tool);
}

module.exports = { registerTool };