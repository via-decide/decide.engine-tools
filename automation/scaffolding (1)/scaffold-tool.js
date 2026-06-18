const fs = require('fs');
const path = require('path');
const syncManifest = require('../metadata/manifest-sync');

const repoPath = path.resolve(__dirname, '../..');

async function scaffold() {
  const args = process.argv.slice(2);
  let toolName = '';
  let category = 'misc';

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--name' || args[i] === '-n') && args[i + 1]) {
      toolName = args[i + 1];
      i++;
    } else if ((args[i] === '--category' || args[i] === '-c') && args[i + 1]) {
      category = args[i + 1].toLowerCase();
      i++;
    }
  }

  if (!toolName) {
    console.error('Error: Please specify the tool name using --name "Tool Name"');
    process.exit(1);
  }

  const slug = toolName.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-')         // replace spaces with hyphens
    .replace(/-+/g, '-');         // remove duplicate hyphens

  // Calculate target directory
  const relativeToolDir = category === 'root' 
    ? slug 
    : path.join('tools', category, slug);
  const targetDir = path.join(repoPath, relativeToolDir);

  if (fs.existsSync(targetDir)) {
    console.error(`Error: Tool directory already exists at ${targetDir}`);
    process.exit(1);
  }

  // Calculate path prefix to reach repository root (for stylesheets and scripts imports)
  const depth = category === 'root' ? 0 : 2; // e.g. tools/category/slug has depth 2 from root directory (excluding tools/)
  const depthPrefix = '../'.repeat(depth + 1);

  console.log(`[Scaffolder] Creating tool workspace at: ${relativeToolDir}`);
  await fs.promises.mkdir(targetDir, { recursive: true });

  // 1. config.json
  const config = {
    id: slug,
    name: toolName,
    title: toolName,
    description: `A platform-native ${toolName} tool.`,
    category: category,
    tags: ['platform', 'scaffolded'],
    icon: '🛠️',
    pullable: true,
    sparks: true,
    path: path.join(relativeToolDir, 'index.html')
  };
  await fs.promises.writeFile(
    path.join(targetDir, 'config.json'),
    JSON.stringify(config, null, 2),
    'utf8'
  );

  // 2. index.html
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>vd: ${toolName}</title>
    <!-- CSS Design Tokens Package -->
    <link rel="stylesheet" href="${depthPrefix}packages/ui/design-tokens.css">
    <style>
        body {
            font-family: var(--font-sans);
            background: linear-gradient(135deg, var(--void), #0f1419);
            color: var(--text);
            padding: 40px 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .header {
            margin-bottom: 30px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 20px;
        }
        .header h1 {
            font-size: 2.2rem;
            background: linear-gradient(135deg, var(--saffron), var(--blue));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 id="tool-title">${toolName}</h1>
            <p style="color: var(--text-dim); margin-top: 8px;">Scaffolded platform tool connected to storage and exports</p>
        </div>

        <div class="cyber-card" style="margin-bottom: 20px;">
            <h2 style="color: var(--saffron); margin-bottom: 15px;">💾 Workspace Storage</h2>
            <div style="margin-bottom: 16px;">
                <input type="text" id="storage-input" class="cyber-input" style="width: 100%;" placeholder="Type data to persist...">
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="cyber-btn cyber-btn-primary" id="save-btn">Save State</button>
                <button class="cyber-btn" id="load-btn">Load State</button>
            </div>
        </div>

        <div class="cyber-card">
            <h2 style="color: var(--blue); margin-bottom: 15px;">📊 Export Data</h2>
            <button class="cyber-btn cyber-btn-secondary" id="export-btn">Download CSV Report</button>
        </div>
    </div>

    <!-- Platform Modules -->
    <script src="${depthPrefix}packages/storage/index.js"></script>
    <script src="${depthPrefix}packages/exports/csv.js"></script>
    <!-- Tool logic script -->
    <script src="tool.js"></script>
</body>
</html>
`;
  await fs.promises.writeFile(path.join(targetDir, 'index.html'), htmlContent, 'utf8');

  // 3. tool.js
  const jsContent = `(function (global) {
  'use strict';

  const STORAGE_KEY = 'vd:tool:${slug}:state';

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('storage-input');
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');
    const exportBtn = document.getElementById('export-btn');

    // Load saved value
    if (global.PlatformStorage) {
      const saved = global.PlatformStorage.getItem(STORAGE_KEY);
      if (saved) input.value = saved;
    }

    // Save triggers
    saveBtn.addEventListener('click', () => {
      if (global.PlatformStorage) {
        global.PlatformStorage.setItem(STORAGE_KEY, input.value);
        alert('State saved successfully!');
      }
    });

    loadBtn.addEventListener('click', () => {
      if (global.PlatformStorage) {
        const saved = global.PlatformStorage.getItem(STORAGE_KEY);
        input.value = saved || '';
        alert('State loaded!');
      }
    });

    // CSV Exporter triggers
    exportBtn.addEventListener('click', () => {
      if (global.CSVExporter) {
        const headers = 'Timestamp,Variable,Value\\n';
        const data = \`\${new Date().toISOString()},\${slug},\${input.value}\`;
        global.CSVExporter.download('\${slug}-report.csv', headers + data);
      }
    });
  });
})(typeof window !== 'undefined' ? window : global);
`;
  await fs.promises.writeFile(path.join(targetDir, 'tool.js'), jsContent, 'utf8');

  console.log(`[Scaffolder] Tool template generated at: ${relativeToolDir}`);
  
  // Auto-sync into manifest catalog
  await syncManifest();
}

if (require.main === module) {
  scaffold().catch(err => {
    console.error('[Scaffolder] Scaffolding runtime error:', err);
    process.exit(1);
  });
}
