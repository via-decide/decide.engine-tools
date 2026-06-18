const fs = require('fs');
const os = require('os');
const path = require('path');
const { runPackageExecutor } = require('../../tools/executors/package-executor.js');

let passed = 0;
let failed = 0;
function assert(label, condition) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.error(`  ✗ FAIL: ${label}`); failed++; }
}

console.log('\n── PackageExecutor ──');

{
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'pkg-exec-'));
  fs.writeFileSync(path.join(repo, 'package-lock.json'), '{}\n');

  const res = runPackageExecutor({
    task_id: 'p1',
    build_command: 'node -e "process.exit(0)"',
    test_command: 'node -e "process.exit(0)"',
  }, { cwd: repo });

  assert('package manager detected', res.package_manager === 'npm');
  assert('build command runs', res.build.status === 'PASS');
  assert('test command runs', res.test.status === 'PASS');
  assert('report generated', fs.existsSync(path.join(repo, 'package_report.json')));
}

{
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'pkg-exec-fail-'));
  fs.writeFileSync(path.join(repo, 'package-lock.json'), '{}\n');

  const res = runPackageExecutor({
    task_id: 'p2',
    build_command: 'node -e "process.exit(1)"',
    test_command: 'node -e "process.exit(0)"',
  }, { cwd: repo });

  assert('failures prevent local commit', res.status === 'FAIL' && res.commit_allowed === false);
}

module.exports = { passed, failed };
