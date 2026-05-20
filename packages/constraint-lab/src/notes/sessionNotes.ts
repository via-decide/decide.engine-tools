export type SessionNote = {
  experimentId: string;
  timestamp: number;
  tags: string[];
  note: string;
  emotionalResponse?: string;
};

export function createSessionNote(input: Omit<SessionNote, 'timestamp'> & { timestamp?: number }): SessionNote {
  return {
    ...input,
    timestamp: input.timestamp ?? Date.now()
  };
}

export function toMarkdown(note: SessionNote): string {
  return `# ${note.experimentId}\n\n- timestamp: ${note.timestamp}\n- tags: ${note.tags.join(', ')}\n\n${note.note}\n\n${note.emotionalResponse || ''}`;
}
