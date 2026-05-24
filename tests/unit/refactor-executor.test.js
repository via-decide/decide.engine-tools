const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');
const { runRefactorExecutor } = require('../../tools/executors/refactor-executor.js');

let passed = 0;
let failed = 0;
function assert(label, condition) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.error(`  ✗ FAIL: ${label}`); failed++; }
}

function mkRepo() {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'refactor-exec-'));
  execSync('git init', { cwd: repo, stdio: 'ignore' });
  execSync('git config user.email "t@example.com"', { cwd: repo });
  execSync('git config user.name "T"', { cwd: repo });
  fs.mkdirSync(path.join(repo, 'src'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'src/a.js'), 'const a=1;\n');
  fs.writeFileSync(path.join(repo, 'root.txt'), 'x\n');
  execSync('git add .', { cwd: repo });
  execSync('git commit -m "seed"', { cwd: repo, stdio: 'ignore' });
  return repo;
}

console.log('\n── RefactorExecutor ──');

{
  const repo = mkRepo();
  const r = runRefactorExecutor({ target_files: ['src'], allow_repo_wide: false });
  assert('repo-wide changes blocked by default', r.status === 'FAIL');
}

{
  const repo = mkRepo();
  const r = runRefactorExecutor({
    task_id: 'r1',
    target_files: ['src'],
    formatter_command: "node -e \"require('fs').appendFileSync('src/a.js','//fmt\\n')\"",
    validation_command: 'node -e "process.exit(0)"',
  }, { cwd: repo });
  assert('only target files changed', r.status === 'PASS' && r.files_changed.every((f) => f.startsWith('src/')));
  assert('validation runs', r.validation_status === 'PASS');
  assert('report generated', fs.existsSync(path.join(repo, 'refactor_report.json')));
}

module.exports = { passed, failed };
