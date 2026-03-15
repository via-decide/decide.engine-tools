#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const TOOLS_DIR = path.join(REPO_ROOT, 'tools');
const MANIFEST_PATH = path.join(REPO_ROOT, 'tools-manifest.json');

async function findConfigPaths(dir, results = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await findConfigPaths(fullPath, results);
      continue;
    }

    if (entry.isFile() && entry.name === 'config.json') {
      results.push(fullPath);
    }
  }

  return results;
}

function toPosixRelative(fullPath) {
  return path.relative(REPO_ROOT, fullPath).split(path.sep).join('/');
}

async function generateManifest() {
  const configPaths = await findConfigPaths(TOOLS_DIR);
  configPaths.sort((a, b) => toPosixRelative(a).localeCompare(toPosixRelative(b)));

  const entries = configPaths.map((configPath) => {
    const metaPath = toPosixRelative(configPath);
    return {
      toolDir: metaPath.slice(0, -'/config.json'.length),
      metaPath
    };
  });

  const manifest = {
    generatedAt: new Date().toISOString(),
    entries
  };

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${entries.length} tool entries to ${toPosixRelative(MANIFEST_PATH)}`);
}

generateManifest().catch((error) => {
  console.error('Failed to generate tools manifest:', error);
  process.exitCode = 1;
});
