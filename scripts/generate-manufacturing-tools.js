import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const seedsPath = '/Users/dharamdaxini/Downloads/gn8r_bot/data/manufacturing_seeds.jsonl';
  const outBase = path.resolve(__dirname, '..', 'apps', 'manufacturing');
  
  await fs.mkdir(outBase, { recursive: true });

  const content = await fs.readFile(seedsPath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  
  let count = 0;

  for (const [idx, line] of lines.entries()) {
    try {
      const seed = JSON.parse(line);
      const toolId = `mfg-seed-${idx}`;
      const toolDir = path.join(outBase, toolId);
      
      await fs.mkdir(toolDir, { recursive: true });

      // Create config.json
      const config = {
        id: toolId,
        name: `Mfg Task ${idx}: ${seed.metadata?.domain || 'Task'}`,
        title: seed.task.slice(0, 50),
        description: seed.task,
        category: 'manufacturing',
        tags: [
          'manufacturing',
          'ssd-loop',
          'gn8r-seeded',
          ...(seed.metadata?.domain ? [seed.metadata.domain.replace(/\W+/g, '-').toLowerCase()] : [])
        ],
        entry: `apps/manufacturing/${toolId}/index.html`
      };
      await fs.writeFile(path.join(toolDir, 'config.json'), JSON.stringify(config, null, 2));

      // Create basic index.html
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${config.name}</title>
  <link rel="stylesheet" href="../../../_ux-patterns.css">
</head>
<body>
  <div class="tool-container">
    <h1>${config.name}</h1>
    <p class="description">${config.description}</p>
    <div id="app"></div>
  </div>
  <script type="module" src="tool.js"></script>
</body>
</html>`;
      await fs.writeFile(path.join(toolDir, 'index.html'), html);

      // Create tool.js
      const js = `// Scaffolded tool logic for ${toolId}
export function init() {
  console.log("Tool initialized: ${toolId}");
  // The actual implementation will be driven by the GN8R loop.
}

init();`;
      await fs.writeFile(path.join(toolDir, 'tool.js'), js);

      count++;
    } catch (e) {
      console.error(`Failed to scaffold tool for line ${idx}:`, e.message);
    }
  }

  console.log(`Successfully scaffolded ${count} manufacturing tools in ${outBase}`);
}

main().catch(console.error);
