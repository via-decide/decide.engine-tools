const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');
const { validateTaskManifest } = require('../../tools/engine/validate-task-manifest.js');

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${label}`);
    failed++;
  }
}

console.log('\n── ValidateTaskManifest ──');

const validManifest = {
  task_id: 'task-123',
  repo: 'via-decide/decide.engine-tools',
  mode: 'validate',
  target_files: ['tools/engine/validate-task-manifest.js'],
  validation_command: 'npm test',
  commit_policy: {
    on_validation_pass: 'commit',
    on_validation_fail: 'no_commit',
    commit_message: 'chore(engine): validate manifest',
  },
  expected_outputs: ['execution_manifest.json'],
  pass_criteria: ['valid manifests pass'],
};

{
  const res = validateTaskManifest(validManifest);
  assert('valid manifests pass', res.valid === true && res.errors.length === 0);
}

{
  const broken = { ...validManifest };
  delete broken.task_id;
  const res = validateTaskManifest(broken);
  assert('missing required fields fail', res.valid === false && res.errors.some((e) => e.path === '$.task_id' && e.code === 'missing_required'));
}

{
  const invalidMode = { ...validManifest, mode: 'ship' };
  const res = validateTaskManifest(invalidMode);
  assert('invalid mode fails', res.valid === false && res.errors.some((e) => e.path === '$.mode' && e.code === 'invalid_enum'));
}

{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'manifest-cli-'));
  const manifestPath = path.join(tmp, 'task.json');
  fs.writeFileSync(manifestPath, JSON.stringify(validManifest, null, 2));
  const cmd = `node tools/engine/validate-task-manifest.js ${JSON.stringify(manifestPath)}`;
  const out1 = execSync(cmd, { cwd: path.join(__dirname, '../..'), encoding: 'utf8' });
  const out2 = execSync(cmd, { cwd: path.join(__dirname, '../..'), encoding: 'utf8' });
  assert('validation output is deterministic JSON', out1 === out2 && JSON.parse(out1).valid === true);
}

module.exports = { passed, failed };
