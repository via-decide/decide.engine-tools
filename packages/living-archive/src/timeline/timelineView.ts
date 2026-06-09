export type TimelineRecord = { id: string; timestamp: number; tags?: string[] };

export function weekKey(timestamp: number) {
  const d = new Date(timestamp);
  const year = d.getUTCFullYear();
  const start = Date.UTC(year, 0, 1);
  const day = Math.floor((timestamp - start) / 86400000);
  const week = Math.floor(day / 7) + 1;
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export function buildTimeline(records: TimelineRecord[]) {
  const map: Record<string, TimelineRecord[]> = {};
  for (const rec of records) {
    const key = weekKey(rec.timestamp);
    map[key] = map[key] || [];
    map[key].push(rec);
  }
  return map;
}
