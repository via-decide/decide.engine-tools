const textInput = document.getElementById('text');
const criteriaInput = document.getElementById('criteria');
const output = document.getElementById('output');

function boundedScore(value) {
  return Math.max(1, Math.min(5, value));
}

function computeScores(text, criteria) {
  const length = text.length;
  const sentenceCount = text.split(/[.!?]\s/).filter(Boolean).length;
  const bulletCount = (text.match(/^- /gm) || []).length;
  const actionWords = (text.match(/\b(build|create|run|validate|ship|review|measure|update)\b/gi) || []).length;
  const uniqueWords = new Set(text.toLowerCase().split(/\W+/).filter(Boolean));

  const clarity = boundedScore(Math.round(sentenceCount / 4) + (bulletCount > 1 ? 1 : 0));
  const completeness = boundedScore(Math.round(length / 220) + (criteria ? 1 : 0));
  const novelty = boundedScore(Math.round(uniqueWords.size / 120) + 1);
  const actionability = boundedScore(Math.round(actionWords / 3) + (bulletCount > 2 ? 1 : 0));

  return { clarity, completeness, novelty, actionability };
}

function evaluate() {
  const text = textInput.value.trim();
  const criteria = criteriaInput.value.trim();

  if (!text) {
    output.textContent = 'Please provide output text to evaluate.';
    return;
  }

  const scores = computeScores(text, criteria);
  const total = scores.clarity + scores.completeness + scores.novelty + scores.actionability;

  output.textContent = [
    '# Output Evaluation',
    '',
    `- Clarity: ${scores.clarity}/5`,
    `- Completeness: ${scores.completeness}/5`,
    `- Novelty: ${scores.novelty}/5`,
    `- Actionability: ${scores.actionability}/5`,
    `- Total: ${total}/20`,
    '',
    '## Interpretation',
    total >= 16 ? 'Strong output. Ready for downstream execution with minor polishing.' : 'Output needs refinement before reliable downstream execution.',
    '',
    '## Improvement Suggestions',
    '- Add explicit success criteria and constraints.',
    '- Improve structure with sections or bullet lists.',
    '- Add concrete next actions and owners.'
  ].join('\n');

  ToolStorage.write('output-evaluator.draft', {
    text,
    criteria,
    output: output.textContent
  });
}

document.getElementById('evaluate').addEventListener('click', evaluate);
document.getElementById('copy').addEventListener('click', () => navigator.clipboard.writeText(output.textContent));
document.getElementById('download').addEventListener('click', () => {
  const blob = new Blob([output.textContent], { type: 'text/markdown' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'output-evaluator-report.md';
  link.click();
});

const saved = ToolStorage.read('output-evaluator.draft', null);
if (saved) {
  textInput.value = saved.text || '';
  criteriaInput.value = saved.criteria || '';
  output.textContent = saved.output || '';
}
