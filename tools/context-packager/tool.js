const taskInput = document.getElementById('task');
const constraintsInput = document.getElementById('constraints');
const artifactsInput = document.getElementById('artifacts');
const output = document.getElementById('output');

function toBulletLines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `- ${line}`);
}

function generatePackage() {
  const task = taskInput.value.trim();
  const constraints = constraintsInput.value.trim();
  const artifacts = artifactsInput.value.trim();

  output.textContent = [
    '# Context Package',
    '',
    '## Mission',
    task || '(missing task)',
    '',
    '## Constraints',
    ...(constraints ? toBulletLines(constraints) : ['- (none provided)']),
    '',
    '## Artifacts',
    ...(artifacts ? toBulletLines(artifacts) : ['- (none provided)']),
    '',
    '## Handoff Contract',
    '- Preserve existing behavior unless explicitly scoped.',
    '- Prefer additive changes over rewrites.',
    '- Return clear validation evidence and unresolved risks.',
    '',
    '## Suggested Next Tool',
    '- task-splitter (if execution plan is missing)',
    '- output-evaluator (if quality scoring is needed)'
  ].join('\n');

  ToolStorage.write('context-packager.draft', {
    task,
    constraints,
    artifacts,
    output: output.textContent
  });
}

document.getElementById('generate').addEventListener('click', generatePackage);
document.getElementById('copy').addEventListener('click', () => navigator.clipboard.writeText(output.textContent));
document.getElementById('download').addEventListener('click', () => {
  const blob = new Blob([output.textContent], { type: 'text/markdown' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'context-package.md';
  link.click();
});

const saved = ToolStorage.read('context-packager.draft', null);
if (saved) {
  taskInput.value = saved.task || '';
  constraintsInput.value = saved.constraints || '';
  artifactsInput.value = saved.artifacts || '';
  output.textContent = saved.output || '';
}
