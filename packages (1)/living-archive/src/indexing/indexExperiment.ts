import fs from 'fs';
import path from 'path';

export type ArchiveIndexEntry = {
  id: string;
  timestamp: number;
  tags: string[];
  constraints: string[];
  noteSnippet: string;
  metadataPath: string;
  replayPath: string;
};

export class ExperimentIndexer {
  constructor(private readonly archiveRoot: string) {}

  private indexPath() {
    return path.join(this.archiveRoot, 'index.json');
  }

  readIndex(): ArchiveIndexEntry[] {
    if (!fs.existsSync(this.indexPath())) return [];
    return JSON.parse(fs.readFileSync(this.indexPath(), 'utf8'));
  }

  append(entry: ArchiveIndexEntry) {
    const index = this.readIndex();
    index.push(entry);
    fs.writeFileSync(this.indexPath(), JSON.stringify(index, null, 2));
  }
}
