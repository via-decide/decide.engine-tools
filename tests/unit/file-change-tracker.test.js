const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const { trackFileChanges, parseStatus } = require('../../tools/engine/file-change-tracker.js');

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

function setupRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'change-tracker-'));
  execSync('git init', { cwd: root, stdio: 'ignore' });
  execSync('git config user.email "test@example.com"', { cwd: root });
  execSync('git config user.name "Test User"', { cwd: root });

  fs.mkdirSync(path.join(root, 'tools/engine'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });

  fs.writeFileSync(path.join(root, 'tools/engine/existing.js'), 'base\n');
  fs.writeFileSync(path.join(root, 'docs/old.md'), 'old\n');

  execSync('git add .', { cwd: root });
  execSync('git commit -m "chore(engine): seed"', { cwd: root, stdio: 'ignore' });
  return root;
}

console.log('\n── FileChangeTracker ──');

{
  const repo = setupRepo();
  const before = parseStatus(execSync('git status --porcelain', { cwd: repo, encoding: 'utf8' }));

  fs.writeFileSync(path.join(repo, 'tools/engine/existing.js'), 'changed\n');
  fs.writeFileSync(path.join(repo, 'tools/engine/new.js'), 'new\n');
  fs.unlinkSync(path.join(repo, 'docs/old.md'));

  execSync('git add -A', { cwd: repo });

  const after = parseStatus(execSync('git status --porcelain', { cwd: repo, encoding: 'utf8' }));

  const report = trackFileChanges({
    cwd: repo,
    allowedTargetPaths: ['tools/engine'],
    beforeSnapshot: before,
    afterSnapshot: after,
    reportFile: 'file_change_report.json',
  });

  assert('before/after snapshots captured', Object.keys(report.before_snapshot).length >= 0 && Object.keys(report.after_snapshot).length > 0);
  assert('changed files attributed to task', report.changed_files.includes('tools/engine/existing.js') && report.changed_files.includes('tools/engine/new.js'));
  assert('created files detected', report.created_files.includes('tools/engine/new.js'));
  assert('deleted files detected', report.deleted_files.includes('docs/old.md'));
  assert('out-of-scope file writes detected', report.out_of_scope_files.includes('docs/old.md'));
  assert('report generated', fs.existsSync(path.join(repo, 'file_change_report.json')));
  assert('report fails when out-of-scope writes exist', report.ok === false);
}

module.exports = { passed, failed };
