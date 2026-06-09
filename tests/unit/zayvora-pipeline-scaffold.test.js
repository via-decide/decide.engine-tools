/**
 * Unit tests for scripts/scaffold/zayvora-pipeline.js
 */

const path = require('path');
const os = require('os');
const fs = require('fs');

const {
  getRepoBlueprints,
  scaffold,
  parseArgs,
} = require('../../scripts/scaffold/zayvora-pipeline.js');

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed += 1;
  } else {
    console.error(`  ✗ FAIL: ${label}`);
    failed += 1;
  }
}

console.log('\n── ZayvoraPipelineScaffold ──');

const blueprints = getRepoBlueprints();
assert('contains five target repositories', Object.keys(blueprints).length === 5);
assert('sim lab blueprint has corridor module', Boolean(blueprints['zayvora-sim-lab'].files['simulations/corridor_simulation.py']));
assert('highway repo blueprint has dashboard connector', Boolean(blueprints['zayvora-highway-v2i'].files['backend/pipeline_connector.py']));

const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'zayvora-pipeline-'));
const result = scaffold(tmpBase, { overwrite: false });

const createdCount = result.filter((item) => item.changed).length;
assert('initial scaffold writes files', createdCount > 0);
assert(
  'writes protocol router file',
  fs.existsSync(path.join(tmpBase, 'zayvora-protocol-lab/protocol/v2i_message_router.py'))
);

const secondPass = scaffold(tmpBase, { overwrite: false });
assert(
  'second scaffold skips existing files when overwrite is false',
  secondPass.every((item) => item.changed === false)
);

const parsed = parseArgs(['node', 'script.js', '--dry-run', '--overwrite']);
assert('parseArgs detects dry-run', parsed.dryRun === true);
assert('parseArgs detects overwrite', parsed.overwrite === true);

module.exports = { passed, failed };
