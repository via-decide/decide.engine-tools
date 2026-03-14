const goalInput = document.getElementById('goal');
const scopeInput = document.getElementById('scope');
const deadlineInput = document.getElementById('deadline');
const output = document.getElementById('output');

function createTaskPlan(goal, scope, deadline) {
  const steps = [
    ['Clarify objective', 'Capture success criteria and non-goals.', 'none'],
    ['Audit current state', 'Review existing files, routing, and registry links.', 'Clarify objective'],
    ['Draft implementation', 'Propose additive changes with low blast radius.', 'Audit current state'],
    ['Implement in slices', 'Create/modify one component at a time and verify.', 'Draft implementation'],
    ['Validate behavior', 'Run path and content checks to ensure no regressions.', 'Implement in slices'],
    ['Prepare handoff', 'Summarize outputs, risks, and next actions.', 'Validate behavior']
  ];

  const taskLines = steps.map((step, index) => {
    const [title, action, dependsOn] = step;
    return [
      `### Task ${index + 1}: ${title}`,
      `- Action: ${action}`,
      `- Depends on: ${dependsOn}`,
      '- Owner: Simba agent / maintainer',
      '- Done when: Deliverable is committed and reviewed.'
    ].join('\n');
  });

  return [
    '# Task Split Plan',
    '',
    '## Goal',
    goal || '(missing goal)',
    '',
    '## Scope',
    scope || '(missing scope)',
    '',
    '## Timeline',
    deadline || '(not provided)',
    '',
    '## Subtasks',
    ...taskLines,
    '',
    '## Completion Checklist',
    '- [ ] New artifacts added safely',
    '- [ ] Existing behavior preserved',
    '- [ ] Registry and navigation validated',
    '- [ ] Output packaged for downstream tool usage'
  ].join('\n');
}

function splitTasks() {
  const payload = {
    goal: goalInput.value.trim(),
    scope: scopeInput.value.trim(),
    deadline: deadlineInput.value.trim()
  };

  output.textContent = createTaskPlan(payload.goal, payload.scope, payload.deadline);
  ToolStorage.write('task-splitter.draft', { ...payload, output: output.textContent });
}

document.getElementById('generate').addEventListener('click', splitTasks);
document.getElementById('copy').addEventListener('click', () => navigator.clipboard.writeText(output.textContent));
document.getElementById('download').addEventListener('click', () => {
  const blob = new Blob([output.textContent], { type: 'text/markdown' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'task-splitter-output.md';
  link.click();
});

const saved = ToolStorage.read('task-splitter.draft', null);
if (saved) {
  goalInput.value = saved.goal || '';
  scopeInput.value = saved.scope || '';
  deadlineInput.value = saved.deadline || '';
  output.textContent = saved.output || '';
}
