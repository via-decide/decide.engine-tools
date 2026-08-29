// Import necessary modules
const { createEnvelope, sendContext, receiveContext, peekContext, openTool } = require('../shared/tool-bridge');

// Define a map to hold tool routes
const toolRoutes = {
  'swot-analyzer': '/tools/swot-analyzer',
  // Add more tools here with their respective paths
};

// Function to handle navigation between tools
function navigateTo(toolId) {
  if (toolRoutes[toolId]) {
    openTool(toolRoutes[toolId]);
  } else {
    console.error(`Tool ID ${toolId} not found`);
  }
}

// Example usage: Navigate to the SWOT Analyzer tool
navigateTo('swot-analyzer');