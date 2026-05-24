import type { ArchiveIndexEntry } from '../indexing/indexExperiment';

function pickRandom<T>(arr: T[], limit: number) {
  const copy = [...arr];
  const out: T[] = [];
  while (copy.length && out.length < limit) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

export function randomForgotten(entries: ArchiveIndexEntry[], olderThanMs: number, limit = 3) {
  const threshold = Date.now() - olderThanMs;
  return pickRandom(entries.filter((e) => e.timestamp < threshold), limit);
}
