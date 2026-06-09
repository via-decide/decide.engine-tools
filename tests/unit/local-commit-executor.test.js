const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const {
  executeLocalCommit,
  buildCommitMessage,
} = require('../../tools/engine/local-commit-executor.js');

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

function makeRepo(name = 'decide.engine-tools') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'local-commit-'));
  const repo = path.join(root, 'via-decide', name);
  fs.mkdirSync(repo, { recursive: true });
  execSync('git init', { cwd: repo, stdio: 'ignore' });
  execSync('git config user.email "test@example.com"', { cwd: repo });
  execSync('git config user.name "Test User"', { cwd: repo });
  execSync('git remote add origin https://github.com/via-decide/decide.engine-tools.git', { cwd: repo });
  fs.writeFileSync(path.join(repo, 'README.md'), 'seed\n');
  execSync('git add README.md', { cwd: repo });
  execSync('git commit -m "chore(engine): seed"', { cwd: repo, stdio: 'ignore' });
  return repo;
}

console.log('\n── LocalCommitExecutor ──');

assert('commit message deterministic format', buildCommitMessage('fix', 'engine', 'update executor') === 'fix(engine): update executor');

{
  const repo = makeRepo();
  const taskFile = 'tools/engine/local-commit-executor.js';
  fs.mkdirSync(path.join(repo, 'tools/engine'), { recursive: true });
  fs.writeFileSync(path.join(repo, taskFile), 'module.exports = 1;\n');

  const result = executeLocalCommit({
    cwd: repo,
    taskFiles: [taskFile],
    validationCommand: 'node -e "process.exit(1)"',
    type: 'fix',
    scope: 'engine',
    summary: 'test fail validation',
    outputFile: 'local_commit_result.json',
  });

  assert('validation fail prevents commit', result.validation_passed === false && result.committed === false);
  const log = execSync('git log --oneline -1', { cwd: repo, encoding: 'utf8' });
  assert('head commit unchanged on validation fail', /chore\(engine\): seed/.test(log));
}

{
  const repo = makeRepo();
  fs.mkdirSync(path.join(repo, 'tools/engine'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'tools/engine/local-commit-executor.js'), 'module.exports = 1;\n');
  fs.mkdirSync(path.join(repo, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'docs/ignore.md'), 'ignore\n');

  const result = executeLocalCommit({
    cwd: repo,
    taskFiles: ['tools/engine/local-commit-executor.js'],
    validationCommand: 'node -e "process.exit(0)"',
    type: 'feat',
    scope: 'engine',
    summary: 'add local executor',
    outputFile: 'local_commit_result.json',
  });

  assert('validation pass creates commit', result.validation_passed === true && result.committed === true && !!result.commit_sha);
  const staged = execSync('git show --name-only --pretty="" HEAD', { cwd: repo, encoding: 'utf8' });
  assert('stages only task files for commit', staged.includes('tools/engine/local-commit-executor.js') && !staged.includes('docs/ignore.md'));
}

{
  const badRepo = makeRepo('not-decide');
  fs.mkdirSync(path.join(badRepo, 'tools/engine'), { recursive: true });
  fs.writeFileSync(path.join(badRepo, 'tools/engine/local-commit-executor.js'), 'module.exports = 1;\n');

  const result = executeLocalCommit({
    cwd: badRepo,
    taskFiles: ['tools/engine/local-commit-executor.js'],
    validationCommand: 'node -e "process.exit(0)"',
  });

  assert('refuses when outside expected repository', result.in_expected_repo === false && result.committed === false);
}

module.exports = { passed, failed };
