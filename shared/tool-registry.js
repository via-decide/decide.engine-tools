// shared/tool-registry.js
import { registerTool } from './shared/tool-storage.js';

const importableToolDirs = [
  'tools/agent-console',
  'tools/settings',
  'tools/example-tool'
];

for (const dir of importableToolDirs) {
  const tools = require(`./${dir}`);
  for (const toolId in tools) {
    if (!tools.hasOwnProperty(toolId)) continue;
    registerTool(tools[toolId]);
  }
}

module.exports = { importableToolDirs };