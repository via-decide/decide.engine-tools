import type { ArchiveIndexEntry } from '../indexing/indexExperiment';

export function searchByTag(entries: ArchiveIndexEntry[], tag: string) {
  return entries.filter((e) => e.tags.includes(tag));
}

export function searchByConstraint(entries: ArchiveIndexEntry[], constraint: string) {
  return entries.filter((e) => e.constraints.includes(constraint));
}

export function searchByText(entries: ArchiveIndexEntry[], query: string) {
  const q = query.toLowerCase();
  return entries.filter((e) => e.noteSnippet.toLowerCase().includes(q));
}
