const shared = require('../shared/shared');
const storage = require('./tool-storage');

function registerEngineer(tool_name) {
  const toolConfig = {
    id: `original_engineering_candidate_product_revision_r0_1`,
    name: 'Original Engineering Candidate Product Revision R0.1',
    description: 'Register the original engineering candidate product revision.',
    category: 'Core Tools',
    audience: 'Engineers',
    inputs: ['tool_name'],
    outputs: [{ type: 'object', properties: { registration_status: { type: 'string' } } }],
    tags: ['registration']
  };

  storage.registerTool(toolConfig);
}

module.exports = {
  registerEngineer
};