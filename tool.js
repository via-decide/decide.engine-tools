const storage = require('../shared/tool-storage');

function createCanonicalEngineeringProductRecord() {
  const record = {
    version: '0.1',
    description: 'Original Engineering Candidate Product Revision R0.1',
    requirements: [
      "Preserve existing code; prefer additive changes.",
      "Implement the smallest safe change set for the stated goal."
    ],
    materials: [],
    process_definition: [
      { name: 'Read README.md and AGENTS.md before editing.', completed: true },
      { name: 'Audit architecture before coding. Summarize current behavior.', completed: false },
      { name: 'Preserve unrelated working code. Prefer additive modular changes.', completed: false }
    ],
    research_provenance: [],
    evidence_references: [],
    known_limitations: [],
    open_claims: []
  };
  
  storage.save('canonical_engineering_product_record.json', record);
}

function createImmutableRevision() {
  const revision = {
    version: '0.1',
    description: 'Original Engineering Candidate Product Revision R0.1',
    changes: [
      { name: 'Preserve existing code; prefer additive changes.', completed: true },
      { name: 'Implement the smallest safe change set for the stated goal.', completed: false }
    ],
    controlled_artifacts: [],
    verification_gates: []
  };
  
  storage.save('immutable_revision.json', revision);
}

module.exports = {
  createCanonicalEngineeringProductRecord,
  createImmutableRevision
};