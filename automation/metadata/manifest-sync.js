const fs = require('fs');
const path = require('path');

const repoPath = path.resolve(__dirname, '../..');
const manifestPath = path.join(repoPath, 'tools-manifest.json');
const toolsDir = path.join(repoPath, 'tools');

const excludeDirs = ['node_modules', '.git', '.vercel', 'artifacts', 'vault', 'backups', 'shared', 'packages', 'automation'];

async function syncManifest() {
  console.log('[Manifest Sync] Initiating auto-discovery of tools...');
  const entries = [];

  // Helper to walk tools directory
  async function walk(dir) {
    const list = await fs.promises.readdir(dir, { withFileTypes: true });
    
    // Check if current directory has a config.json and index.html (this is a tool)
    const hasConfig = list.some(e => e.name === 'config.json' && e.isFile());
    const hasHtml = list.some(e => e.name === 'index.html' && e.isFile());

    if (hasConfig && hasHtml) {
      const relDir = path.relative(repoPath, dir);
      const configPath = path.join(dir, 'config.json');
      try {
        const configText = await fs.promises.readFile(configPath, 'utf8');
        const config = JSON.parse(configText);

        const entry = {
          toolDir: relDir,
          metaPath: path.join(relDir, 'config.json')
        };

        // Copy optional indexing details if present in the config
        if (config.id) entry.id = config.id;
        if (config.name) entry.name = config.name;
        if (config.title) entry.title = config.title;
        if (config.path) entry.path = config.path;
        if (config.tags) entry.tags = config.tags;
        if (config.tier) entry.tier = config.tier;
        if (config.icon) entry.icon = config.icon;
        if (config.pullable !== undefined) entry.pullable = config.pullable;
        if (config.sparks !== undefined) entry.sparks = config.sparks;

        entries.push(entry);
      } catch (err) {
        console.warn(`[Manifest Sync] Warning: failed parsing config at ${configPath}:`, err.message);
      }
      return; // Do not recurse inside a discovered tool directory
    }

    // Otherwise, recurse directories
    for (const entry of list) {
      if (entry.isDirectory()) {
        if (excludeDirs.includes(entry.name)) continue;
        await walk(path.join(dir, entry.name));
      }
    }
  }

  // Walk the tools folder
  if (fs.existsSync(toolsDir)) {
    await walk(toolsDir);
  }

  // Sort entries by toolDir for clean git diffs
  entries.sort((a, b) => a.toolDir.localeCompare(b.toolDir));

  // Build manifest output
  const manifest = {
    generatedAt: new Date().toISOString(),
    entries
  };

  await fs.promises.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`[Manifest Sync] Completed successfully. Registered ${entries.length} tools inside tools-manifest.json.`);
}

if (require.main === module) {
  syncManifest().catch(err => {
    console.error('[Manifest Sync] Fatal synchronization error:', err);
    process.exit(1);
  });
}

module.exports = syncManifest;
