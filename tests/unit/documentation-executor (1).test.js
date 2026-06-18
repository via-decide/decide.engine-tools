const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');
const { runDocumentationExecutor } = require('../../tools/executors/documentation-executor.js');

let passed = 0;
let failed = 0;
function assert(label, condition) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.error(`  ✗ FAIL: ${label}`); failed++; }
}

function mkRepo() {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-exec-'));
  execSync('git init', { cwd: repo, stdio: 'ignore' });
  execSync('git config user.email "t@example.com"', { cwd: repo });
  execSync('git config user.name "T"', { cwd: repo });
  fs.writeFileSync(path.join(repo, 'index.js'), 'console.log(1);\n');
  execSync('git add .', { cwd: repo });
  execSync('git commit -m "seed"', { cwd: repo, stdio: 'ignore' });
  return repo;
}

console.log('\n── DocumentationExecutor ──');

{
  const repo = mkRepo();
  const res = runDocumentationExecutor({
    task_id: 'doc1',
    docs: [
      { doc_type: 'README', file_path: 'README.md', title: 'Project', body: 'Overview' },
      { doc_type: 'API_DOCS', file_path: 'docs/api.md', title: 'API', body: 'Endpoints' },
      { doc_type: 'TASK_REPORT', file_path: 'reports/task.md', title: 'Task', body: 'Details' },
      { doc_type: 'ARCHITECTURE_NOTES', file_path: 'docs/arch.md', title: 'Arch', body: 'Notes' },
    ],
    markdown_link_validation_command: 'node -e "process.exit(0)"',
  }, { cwd: repo });

  assert('docs generated', res.status === 'PASS' && res.generated_docs.length === 4);
  assert('code files untouched', Array.isArray(res.code_files_touched) && res.code_files_touched.length === 0);
  assert('markdown valid', res.markdown_validation_status === 'PASS');
  assert('report generated', fs.existsSync(path.join(repo, 'documentation_report.json')));
}

module.exports = { passed, failed };
