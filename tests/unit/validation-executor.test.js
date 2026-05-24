const fs = require('fs');
const os = require('os');
const path = require('path');
const { runValidationExecutor } = require('../../tools/executors/validation-executor.js');

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

console.log('\n── ValidationExecutor ──');

{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'validation-exec-pass-'));
  const result = runValidationExecutor({
    task_id: 'val-pass',
    repo: 'via-decide/decide.engine-tools',
    mode: 'validate',
    validation_command: 'node -e "process.stdout.write(\'ok\\n\')"',
    timeout_ms: 10000,
  }, { cwd: tmp });

  assert('command executes', result.exit_code === 0);
  assert('stdout captured', result.stdout.includes('ok'));
  assert('PASS only when exit code is 0', result.status === 'PASS');
  assert('validation_result.json generated', fs.existsSync(path.join(tmp, 'validation_result.json')));
}

{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'validation-exec-fail-'));
  const result = runValidationExecutor({
    task_id: 'val-fail',
    repo: 'via-decide/decide.engine-tools',
    mode: 'validate',
    validation_command: 'node -e "process.stderr.write(\'err\\n\');process.exit(2)"',
    timeout_ms: 10000,
  }, { cwd: tmp });

  assert('stderr captured', result.stderr.includes('err'));
  assert('FAIL when exit code is non-zero', result.status === 'FAIL' && result.exit_code === 2);
  assert('never commits directly', result.commit_hash === null);
}

{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'validation-exec-timeout-'));
  const result = runValidationExecutor({
    task_id: 'val-timeout',
    repo: 'via-decide/decide.engine-tools',
    mode: 'validate',
    validation_command: 'node -e "setTimeout(()=>process.exit(0), 1000)"',
    timeout_ms: 25,
  }, { cwd: tmp });

  assert('timeout handled', result.timed_out === true);
  assert('timeout is deterministic FAIL', result.status === 'FAIL');
}

module.exports = { passed, failed };
