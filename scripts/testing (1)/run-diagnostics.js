const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../');
const registryFile = path.join(rootDir, 'shared', 'tool-registry.js');
const commandRouterFile = path.join(rootDir, 'shared', 'commandRouter.js');

try {
  let failedCount = 0;
  let passedCount = 0;
  
  const registryStr = fs.readFileSync(registryFile, 'utf8');
  const routerStr = fs.readFileSync(commandRouterFile, 'utf8');
  
  // Extract tools paths array
  const importableMatch = registryStr.match(/const importableToolDirs = \[([\s\S]*?)\];/);
  if (!importableMatch) {
    throw new Error("Could not find importableToolDirs array in tool-registry.js");
  }

  // Parse strings and remove quotes
  const rawArrayStr = importableMatch[1];
  const toolPaths = rawArrayStr.split(',')
    .map(line => line.trim().replace(/['"]/g, ''))
    .filter(line => line.startsWith('tools/'));

  console.log(`\n🔍 Found ${toolPaths.length} tools registered. Proceeding with diagnostic sweep...\n`);

  for (const toolDir of toolPaths) {
    const absPath = path.join(rootDir, toolDir);
    const htmlPath = path.join(absPath, 'index.html');
    const jsPath = path.join(absPath, 'tool.js');
    const configPath = path.join(absPath, 'config.json');

    const issues = [];

    // 1. Files existence check
    if (!fs.existsSync(htmlPath)) issues.push('Missing index.html');
    if (!fs.existsSync(jsPath)) issues.push('Missing tool.js');

    // 2. Config validation
    if (!fs.existsSync(configPath)) {
      issues.push('Missing config.json');
    } else {
      try {
        const configJson = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (!configJson.id) issues.push('config.json missing "id"');
        if (!configJson.tags || !Array.isArray(configJson.tags)) issues.push('config.json missing valid "tags" array');
        if (!configJson.inputs || !Array.isArray(configJson.inputs)) issues.push('config.json missing valid "inputs" array');
      } catch(e) {
        issues.push('config.json is invalid JSON');
      }
    }

    // 3. Command Router Mapping
    // Since some tools use a sub-path or directory matching, we check if toolDir string resides in commandRouter.js
    // Alternatively, verify the specific identifier maps to the index.html path.
    // The requirement is "The tool is properly mapped in shared/commandRouter.js"
    const entryRoute = `${toolDir}/index.html`;
    if (!routerStr.includes(toolDir) && !routerStr.includes(entryRoute)) {
      issues.push(`Not mapped in shared/commandRouter.js (Expected substring match for '${toolDir}')`);
    }

    if (issues.length) {
      console.log(`[ FAIL ] ${toolDir.padEnd(45, ' ')} -> ${issues.join(' | ')}`);
      failedCount++;
    } else {
      console.log(`[ PASS ] ${toolDir}`);
      passedCount++;
    }
  }

  console.log(`\n✅ DIAGNOSTIC COMPLETE // PASSED: ${passedCount} | FAILED: ${failedCount}`);

} catch (err) {
  console.error("DIAGNOSTICS ENCOUNTERED FATAL ERROR:", err);
  process.exit(1);
}
