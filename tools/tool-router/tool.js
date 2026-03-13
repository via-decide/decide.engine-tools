const artifact = document.getElementById('artifact');
const goal = document.getElementById('goal');
const output = document.getElementById('output');

const suggestedByArtifact = {
  idea: ['promptalchemy', 'spec-builder'],
  prompt: ['script-generator', 'code-generator'],
  spec: ['code-generator', 'template-vault'],
  code: ['code-reviewer', 'export-studio']
};

function suggest() {
  const type = artifact.value;
  const picks = (suggestedByArtifact[type] || []).filter((id) => ToolRegistry.isRegistered(id));
  const objective = goal.value.trim() || 'Move to the next implementation step';

  output.textContent = [
    '# Next Tool Suggestion',
    '',
    `Current artifact: ${type}`,
    `Goal: ${objective}`,
    '',
    '## Suggested Tools',
    ...picks.map((id, idx) => `${idx + 1}. ${id}`),
    '',
    'Note: This is static sequencing only. Category routing will be added later.'
  ].join('\n');

  ToolStorage.write('tool-router.draft', {
    artifact: type,
    goal: objective,
    output: output.textContent
  });
}

document.getElementById('suggest').addEventListener('click', suggest);
document.getElementById('copy').addEventListener('click', () => navigator.clipboard.writeText(output.textContent));
document.getElementById('download').addEventListener('click', () => {
  const blob = new Blob([output.textContent], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'tool-router-suggestion.txt';
  link.click();
});

const saved = ToolStorage.read('tool-router.draft', null);
if (saved) {
  artifact.value = saved.artifact || 'idea';
  goal.value = saved.goal || '';
  output.textContent = saved.output || '';
}
