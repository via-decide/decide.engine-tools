const fs = require('fs');
const os = require('os');
const path = require('path');
const { runGeneratorExecutor } = require('../../tools/executors/generator-executor.js');

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.error(`  ✗ FAIL: ${label}`); failed++; }
}

console.log('\n── GeneratorExecutor ──');

const templates = [
  ['html_tool', 'gen/tool.html'],
  ['node_cli', 'gen/cli.js'],
  ['python_cli', 'gen/cli.py'],
  ['json_schema', 'gen/schema.json'],
  ['markdown_doc', 'gen/readme.md'],
];

for (const [template, output] of templates) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-exec-'));
  const res = runGeneratorExecutor({
    task_id: 't1', template, output_file: output, target_name: 'Sample', target_paths: ['gen'], allow_overwrite: false,
  }, { cwd: tmp });
  assert(`${template} generates valid file`, res.status === 'PASS' && fs.existsSync(path.join(tmp, output)));
}

{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-overwrite-'));
  const f = path.join(tmp, 'gen/existing.md');
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, 'old\n');
  const res = runGeneratorExecutor({
    task_id: 't2', template: 'markdown_doc', output_file: 'gen/existing.md', target_name: 'Doc', target_paths: ['gen'], allow_overwrite: false,
  }, { cwd: tmp });
  assert('overwrite protection works', res.status === 'FAIL');
}

{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-scope-'));
  const res = runGeneratorExecutor({
    task_id: 't3', template: 'node_cli', output_file: '../escape.js', target_name: 'Esc', target_paths: ['gen'], allow_overwrite: true,
  }, { cwd: tmp });
  assert('files remain inside target paths', res.status === 'FAIL');
}

{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-report-'));
  const res1 = runGeneratorExecutor({
    task_id: 't4', template: 'json_schema', output_file: 'gen/schema.json', target_name: 'Schema', target_paths: ['gen'], allow_overwrite: true,
  }, { cwd: tmp, outputFile: 'generator_result.json' });
  const out1 = fs.readFileSync(path.join(tmp, 'generator_result.json'), 'utf8');
  const res2 = runGeneratorExecutor({
    task_id: 't4', template: 'json_schema', output_file: 'gen/schema.json', target_name: 'Schema', target_paths: ['gen'], allow_overwrite: true,
  }, { cwd: tmp, outputFile: 'generator_result.json' });
  const out2 = fs.readFileSync(path.join(tmp, 'generator_result.json'), 'utf8');
  assert('deterministic output report created', res1.status === 'PASS' && res2.status === 'PASS' && out1 === out2);
}

module.exports = { passed, failed };
