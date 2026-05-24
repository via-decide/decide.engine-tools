const { execSync } = require('child_process');
const path = require('path');
const { routeToolTask } = require('../../tools/engine/tool-task-router.js');

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

console.log('\n── ToolTaskRouter ──');

const expected = {
  generate: 'generator executor',
  refactor: 'refactor executor',
  debug: 'debug executor',
  validate: 'validation executor',
  test: 'test executor',
  document: 'doc executor',
  package: 'package executor',
  security_scan: 'security executor',
};

Object.entries(expected).forEach(([mode, executor]) => {
  const res = routeToolTask({ task_id: 't-1', mode, files_changed: ['b.js', 'a.js'], commit_hash: 'abc123' });
  assert(`routes ${mode} correctly`, res.status === 'PASS' && res.executor === executor && JSON.stringify(res.files_changed) === JSON.stringify(['a.js', 'b.js']));
});

{
  const res = routeToolTask({ task_id: 't-2', mode: 'deploy_prepare' });
  assert('unknown mode fails safely', res.status === 'FAIL' && res.executor === 'unknown' && res.commit_hash === null && Array.isArray(res.files_changed) && res.files_changed.length === 0);
}

{
  const root = path.join(__dirname, '../..');
  const payload = JSON.stringify({ task_id: 't-3', mode: 'test', files_changed: ['z.js', 'a.js'], commit_hash: null });
  const cmd = `node tools/engine/tool-task-router.js ${JSON.stringify(payload)}`;
  const out1 = execSync(cmd, { cwd: root, encoding: 'utf8' });
  const out2 = execSync(cmd, { cwd: root, encoding: 'utf8' });
  assert('output JSON stable', out1 === out2 && JSON.parse(out1).status === 'PASS');
}

module.exports = { passed, failed };
