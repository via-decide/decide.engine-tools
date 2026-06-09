const FORBIDDEN_TERMS = [
  'score',
  'coherence %',
  'rank',
  'ranking',
  'optimize taste',
  'identity percentage',
  'beauty ranking',
  'iconicness'
];

function sanitizeText(text) {
  let output = String(text || '');
  for (const term of FORBIDDEN_TERMS) {
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig');
    output = output.replace(re, '[redacted]');
  }
  return output;
}

function buildReflectionPrompt(payload) {
  const experiment = payload.experiment || {};
  const observations = (payload.observations || []).map(sanitizeText);
  const notes = sanitizeText(payload.notes || experiment.notes || '');

  return {
    mode: 'reflection-only',
    experiment: {
      id: experiment.id,
      name: experiment.name,
      category: experiment.category,
      constraint: experiment.constraint,
      tags: experiment.tags || []
    },
    artifacts: payload.artifacts || {},
    prompts: [
      'Why does this feel intentional or unintentional?',
      'What contradictions are present in interaction, timing, or rendering?',
      'Which historical systems resemble this behavior and why?'
    ],
    notes,
    observations
  };
}

module.exports = {
  FORBIDDEN_TERMS,
  sanitizeText,
  buildReflectionPrompt
};
