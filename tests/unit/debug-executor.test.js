const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');
const { runDebugExecutor } = require('../../tools/executors/debug-executor.js');

let passed = 0;
let failed = 0;
function assert(label, condition) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.error(`  ✗ FAIL: ${label}`); failed++; }
}

function mkRepo() {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'debug-exec-'));
  execSync('git init', { cwd: repo, stdio: 'ignore' });
  execSync('git config user.email "t@example.com"', { cwd: repo });
  execSync('git config user.name "T"', { cwd: repo });
  fs.mkdirSync(path.join(repo, 'src'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'src/app.js'), 'module.exports = function(){ return 1; };\n');
  execSync('git add .', { cwd: repo });
  execSync('git commit -m "seed"', { cwd: repo, stdio: 'ignore' });
  return repo;
}

console.log('\n── DebugExecutor ──');

{
  const repo = mkRepo();
  const r = runDebugExecutor({
    task_id: 'd1',
    bug_report: 'App returns 1 instead of 2',
    root_cause: 'Incorrect constant in return statement.',
    target_files: ['src'],
    reproduction_command: 'node -e "if(require(\'./src/app.js\')()!==2) process.exit(1)"',
    apply_fix_command: "node -e \"const fs=require('fs');const p='src/app.js';fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace('return 1','return 2'));\"",
    validation_command: 'node -e "if(require(\'./src/app.js\')()===2) process.exit(0); process.exit(1)"',
  }, { cwd: repo });

  assert('bug reproduction command supported', r.reproduction.status === 'FAIL');
  assert('minimal changed files', r.changed_files.length === 1 && r.changed_files[0] === 'src/app.js');
  assert('validation confirms fix', r.validation.status === 'PASS' && r.status === 'PASS');
  assert('report includes root cause and changed files', !!r.root_cause && Array.isArray(r.changed_files));
  assert('debug_report.json generated', fs.existsSync(path.join(repo, 'debug_report.json')));
}

module.exports = { passed, failed };
