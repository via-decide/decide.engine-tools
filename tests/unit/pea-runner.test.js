const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const {
  runPeaTask,
  ensureSafeRelative,
} = require('../../tools/engine/pea-runner.js');

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

function makeSourceRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pea-source-'));
  const repo = path.join(root, 'via-decide', 'decide.engine-tools');
  fs.mkdirSync(repo, { recursive: true });
  execSync('git init', { cwd: repo, stdio: 'ignore' });
  execSync('git config user.email "test@example.com"', { cwd: repo });
  execSync('git config user.name "Test User"', { cwd: repo });
  fs.writeFileSync(path.join(repo, 'README.md'), 'seed\n');
  fs.mkdirSync(path.join(repo, 'tools/engine'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'tools/engine/source.js'), 'module.exports = 1;\n');
  execSync('git add .', { cwd: repo });
  execSync('git commit -m "chore(engine): seed"', { cwd: repo, stdio: 'ignore' });
  return repo;
}

console.log('\n── PEARunner ──');

assert('rejects relative path escape', ensureSafeRelative('../escape') === false);
assert('rejects absolute path', ensureSafeRelative('/tmp/escape') === false);
assert('accepts safe relative path', ensureSafeRelative('tools/engine/file.js') === true);

{
  const sourceRepo = makeSourceRepo();
  const parentMarker = path.join(sourceRepo, 'PARENT_MARKER.txt');
  fs.writeFileSync(parentMarker, 'parent\n');
  execSync('git add PARENT_MARKER.txt', { cwd: sourceRepo });
  execSync('git commit -m "chore(engine): parent marker"', { cwd: sourceRepo, stdio: 'ignore' });

  const outRoot = path.join(path.dirname(sourceRepo), 'cloned_repos');
  const result = runPeaTask({
    repo: 'via-decide/decide.engine-tools',
    taskId: 'pea-task-1',
    sourceRepoPath: sourceRepo,
    parentCwd: sourceRepo,
    outputRoot: outRoot,
    executorCommand: 'node -e "require(\'fs\').writeFileSync(\'task-output.txt\',\'ok\\n\')"',
    validationCommand: 'node -e "process.exit(0)"',
    commitMessage: 'chore(engine): apply partitioned task result',
  });

  const isolatedTaskDir = path.join(outRoot, 'via-decide/decide.engine-tools', 'pea-task-1');
  const isolatedGit = path.join(isolatedTaskDir, '.git');
  const manifestPath = path.join(isolatedTaskDir, 'execution_manifest.json');

  assert('task runs in isolated cwd', result.cwd_isolated === true);
  assert('independent git exists in isolated directory', fs.existsSync(isolatedGit));
  assert('manifest is written', fs.existsSync(manifestPath));

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert('manifest flags pea enabled', manifest.pea_enabled === true);
  assert('manifest flags cwd isolated', manifest.cwd_isolated === true);
  assert('validated task commit created', manifest.commit_created === true);

  const parentStatus = execSync('git status --porcelain', { cwd: sourceRepo, encoding: 'utf8' }).trim();
  assert('parent repo receives zero writes', parentStatus === '');

  const isoLog = execSync('git log --oneline -1', { cwd: isolatedTaskDir, encoding: 'utf8' });
  assert('isolated repo has local commit', /apply partitioned task result/.test(isoLog));
}

module.exports = { passed, failed };
