import crypto from 'crypto';

export function stableSerialize(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'string') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableSerialize(v)).join(',')}]`;
  if (value instanceof Uint8Array) return `{"__type":"Uint8Array","data":[${Array.from(value).join(',')}]}`;
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    const body = keys.map((k) => `${JSON.stringify(k)}:${stableSerialize(obj[k])}`).join(',');
    return `{${body}}`;
  }
  return JSON.stringify(String(value));
}

export function generateStateHash(state: unknown): string {
  const serialized = stableSerialize(state);
  return crypto.createHash('sha256').update(serialized).digest('hex');
}
