const fs = require('fs');
const path = require('path');

const repoPath = path.resolve(__dirname, '../..');
const toolsDir = path.join(repoPath, 'tools');
const appsDir = path.join(repoPath, 'apps');

const mappings = {
  'remixer': [
    'idea-remixer', 'ai-tool-generator', 'code-generator', 
    'script-generator', 'workflow-template-gallery'
  ],
  'oracle': [
    'researchers', 'scenario-planner', 'revenue-forecaster', 
    'promptalchemy', 'prompt-compare', 'output-evaluator'
  ],
  'matrix': [
    'decision-matrix', 'system', 'tool-router', 
    'tool-search-discovery', 'task-splitter', 'coders'
  ],
  'studyos': [
    'education', 'context-packager', 'spec-builder', 
    'repo-improvement-brief', 'code-reviewer'
  ]
};

async function migrate() {
  console.log('[Migration] Starting horizontal scope consolidation...');
  
  for (const [appName, tools] of Object.entries(mappings)) {
    const targetDir = path.join(appsDir, appName);
    
    // Ensure app directory exists
    if (!fs.existsSync(targetDir)) {
      await fs.promises.mkdir(targetDir, { recursive: true });
    }

    for (const tool of tools) {
      const src = path.join(toolsDir, tool);
      const dest = path.join(targetDir, tool);
      
      if (fs.existsSync(src)) {
        await fs.promises.rename(src, dest);
        console.log(`Moved: tools/${tool} -> apps/${appName}/${tool}`);
      } else {
        console.log(`Skipped (not found): tools/${tool}`);
      }
    }
  }
  console.log('[Migration] Consolidation complete.');
}

migrate().catch(console.error);
