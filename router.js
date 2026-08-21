const importableToolDirs = require('./importable-tool-dirs.json');
const { registerTool } = require('./shared/tool-storage.js');

const routeMap = {};

for (const dir of importableToolDirs) {
  try {
    const tools = require(`./${dir}`);
    for (const toolId in tools) {
      if (!tools.hasOwnProperty(toolId)) continue;
      registerTool(tools[toolId]);
      routeMap[toolId] = `/${dir}/${toolId}`;
    }
  } catch (error) {
    console.error(`Failed to load tools from directory ${dir}:`, error);
  }
}

module.exports = { routeMap };