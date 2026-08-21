const fs = require('fs');
const path = require('path');

function createSeedFile(toolId, toolName, description, category, audience) {
  const seedData = [
    { task: 'Adherence to Instructions', constraints: 'No deviations without explicit user approval.' },
    { task: 'Mandatory Clarification', constraints: 'Immediately ask if instructions are ambiguous or incomplete.' },
    { task: 'Proposal First', constraints: 'Always propose optimizations or fixes before implementing them.' }
  ];

  const seedFileContent = JSON.stringify(seedData, null, 2);
  fs.writeFileSync(path.join(__dirname, '../generated_seeds.jsonl'), seedFileContent);

  return {
    output: `Seed file created for ${toolId}: generated_seeds.jsonl`
  };
}

module.exports = createSeedFile;