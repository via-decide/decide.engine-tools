const fs = require('fs');
const path = require('./tool-storage');

function registerTool(toolId) {
  const toolsDir = path.join(__dirname, '../tools');
  const toolPath = path.join(toolsDir, `${toolId}`);
  
  if (!fs.existsSync(toolPath)) {
    throw new Error(`Tool directory ${toolPath} not found`);
  }
  
  const configPath = path.join(toolPath, 'config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file ${configPath} not found`);
  }
  
  try {
    const toolData = require(configPath);
    toolStorage.saveArtifact('registered_tool', { id: toolId, data: toolData });
  } catch (error) {
    throw new Error(`Error loading config file for tool ${toolId}: ${error.message}`);
  }
}

module.exports = { registerTool };