const fs = require('fs');
const path = require('path');

function registerTool(toolConfig) {
  const toolRegistryPath = path.join(__dirname, '../tool-registry.json');
  let toolRegistry;

  try {
    if (fs.existsSync(toolRegistryPath)) {
      toolRegistry = JSON.parse(fs.readFileSync(toolRegistryPath));
    } else {
      toolRegistry = [];
    }
  } catch (error) {
    console.error('Error reading tool registry:', error);
    return;
  }

  const existingToolIndex = toolRegistry.findIndex((tool) => tool.id === toolConfig.id);

  if (existingToolIndex !== -1) {
    console.log(`Tool ${toolConfig.name} already registered.`);
    return;
  }

  toolRegistry.push(toolConfig);
  fs.writeFileSync(toolRegistryPath, JSON.stringify(toolRegistry, null, 2));

  const sharedToolRegistryPath = path.join(__dirname, '../shared/tool-registry.json');
  let sharedToolRegistry;

  try {
    if (fs.existsSync(sharedToolRegistryPath)) {
      sharedToolRegistry = require('./shared/tool-registry.json');
    } else {
      sharedToolRegistry = { importableToolDirs: [] };
    }
  } catch (error) {
    console.error('Error reading shared tool registry:', error);
    return;
  }

  const importableToolDirs = sharedToolRegistry.importableToolDirs || [];
  if (!importableToolDirs.includes(`tools/${toolConfig.id}`)) {
    importableToolDirs.push(`tools/${toolConfig.id}`);
    fs.writeFileSync(sharedToolRegistryPath, JSON.stringify({ ...sharedToolRegistry, importableToolDirs }, null, 2));
  }

  console.log(`Tool ${toolConfig.name} registered successfully.`);
}

module.exports = {
  registerTool
};