const router = require('../shared/router');
const toolRegistry = require('../shared/tool-registry');

router.registerRoute('original_engineering_candidate_product_revision_r0_1', '/tools/OriginalEngineeringCandidateProductRevisionR0.1/index.html');

function registerTool() {
  const toolId = 'original_engineering_candidate_product_revision_r0_1';
  
  try {
    toolRegistry.registerTool(toolId);
    console.log(`Tool ${toolId} registered successfully`);
  } catch (error) {
    console.error(`Error registering tool ${toolId}:`, error.message);
  }
}

module.exports = { registerTool };