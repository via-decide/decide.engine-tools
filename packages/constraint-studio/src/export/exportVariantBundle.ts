import fs from 'fs';

export function exportVariantBundle(file: string, payload: unknown) {
  fs.writeFileSync(file, JSON.stringify(payload, null, 2));
  return file;
}
