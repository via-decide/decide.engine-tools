const idea = document.getElementById('idea');
const users = document.getElementById('users');
const constraints = document.getElementById('constraints');
const output = document.getElementById('output');

function buildSpec() {
  const value = {
    idea: idea.value.trim(),
    users: users.value.trim(),
    constraints: constraints.value.trim()
  };

  output.textContent = [
    '# Product Specification',
    '',
    '## Problem Statement',
    value.idea || '(missing idea)',
    '',
    '## Target Users',
    value.users || '(missing target users)',
    '',
    '## Functional Requirements',
    '- Core input form for idea capture',
    '- Structured output generation',
    '- Export support (copy/download)',
    '',
    '## Non-Functional Requirements',
    value.constraints || '- Keep implementation simple and standalone',
    '',
    '## Acceptance Criteria',
    '- Tool runs from index.html with no build step',
    '- Output is deterministic enough for handoff',
    '- User can export result'
  ].join('\n');

  ToolStorage.write('spec-builder.draft', { ...value, output: output.textContent });
}

document.getElementById('generate').addEventListener('click', buildSpec);
document.getElementById('copy').addEventListener('click', () => navigator.clipboard.writeText(output.textContent));
document.getElementById('download').addEventListener('click', () => {
  const blob = new Blob([output.textContent], { type: 'text/markdown' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'spec-builder-output.md';
  link.click();
});

const saved = ToolStorage.read('spec-builder.draft', null);
if (saved) {
  idea.value = saved.idea || '';
  users.value = saved.users || '';
  constraints.value = saved.constraints || '';
  output.textContent = saved.output || '';
}
