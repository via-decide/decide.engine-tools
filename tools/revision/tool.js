const { registerTool } = require('../shared/tool-storage');

module.exports = {
  id: 'revision',
  name: 'Original Engineering Candidate Product Revision R0.1',
  description: 'Create the first Original Engineering Candidate Product Revision R0.1 from an ENGINEERING_CANDIDATE_READY Lab transfer, establishing the canonical engineering product record.',
  category: 'Core Tools',
  audience: 'Engineering Team',
  inputs: [
    { name: 'engineer', type: 'string' },
    { name: 'revision_id', type: 'string' }
  ],
  outputs: [
    { name: 'canonical_record', type: 'object' }
  ],
  tags: ['Original Engineering Candidate Product Revision R0.1']
};