// Import necessary modules
const { registerTool } = require('../shared/tool-storage');

// Function to handle tool registration
function handleToolRegistration(toolData) {
  try {
    // Validate tool data using a schema (not shown here for brevity)
    if (!toolData || typeof toolData !== 'object') {
      throw new Error('Invalid tool data');
    }

    // Register the tool
    registerTool(toolData);
    console.log(`Tool registered successfully: ${toolData.name}`);
  } catch (error) {
    console.error('Error registering tool:', error.message);
  }
}

// Example usage of handleToolRegistration function
const newTool = {
  id: 'new-tool-1',
  name: 'New Tool',
  description: 'A new tool for the manufacturing process.',
  category: 'Manufacturing',
  audience: 'Engineers',
  inputs: ['input1', 'input2'],
  outputs: ['output1'],
  tags: ['tool', 'manufacturing']
};

handleToolRegistration(newTool);