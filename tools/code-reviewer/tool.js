const code = document.getElementById('code');
const focus = document.getElementById('focus');
const output = document.getElementById('output');

function runReview() {
  const source = code.value;
  const lines = source.split('\n').length;
  const notes = [];

  if (!source.trim()) {
    output.textContent = 'Add code to review.';
    return;
  }

  if (!source.includes('aria-') && focus.value === 'accessibility') {
    notes.push('- Consider adding ARIA labels for interactive elements.');
  }
  if (source.includes('var ')) {
    notes.push('- Prefer const/let over var for clearer scope control.');
  }
  if (source.length > 1800) {
    notes.push('- Large snippet detected; split into smaller functions/components.');
  }
  if (!source.includes('function') && source.includes('=>') === false) {
    notes.push('- Extract repeated logic into named functions.');
  }

  output.textContent = [
    '# Code Review',
    '',
    `Focus: ${focus.value}`,
    `Line count: ${lines}`,
    '',
    '## Suggestions',
    ...(notes.length ? notes : ['- Looks clean; add tests or manual validation notes.'])
  ].join('\n');

  ToolStorage.write('code-reviewer.draft', {
    code: source,
    focus: focus.value,
    output: output.textContent
  });
}

document.getElementById('review').addEventListener('click', runReview);
document.getElementById('copy').addEventListener('click', () => navigator.clipboard.writeText(output.textContent));
document.getElementById('download').addEventListener('click', () => {
  const blob = new Blob([output.textContent], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'code-review.txt';
  link.click();
});

const saved = ToolStorage.read('code-reviewer.draft', null);
if (saved) {
  code.value = saved.code || '';
  focus.value = saved.focus || 'quality';
  output.textContent = saved.output || '';
}
