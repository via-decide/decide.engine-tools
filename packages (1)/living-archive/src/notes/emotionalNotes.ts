export type EmotionalNote = {
  experimentId: string;
  feels: string[];
  problems: string[];
  interesting: string[];
  raw?: string;
  timestamp?: number;
};

export function buildEmotionalMarkdown(note: EmotionalNote) {
  const ts = note.timestamp ?? Date.now();
  return `# Experiment Notes\n\nTimestamp: ${ts}\n\nFeels:\n${note.feels.map((f) => `- ${f}`).join('\n')}\n\nProblems:\n${note.problems.map((p) => `- ${p}`).join('\n')}\n\nInteresting:\n${note.interesting.map((i) => `- ${i}`).join('\n')}\n\n${note.raw || ''}`;
}
