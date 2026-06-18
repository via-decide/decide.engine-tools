const fs = require('fs');
const path = require('path');

const sharedDir = path.join(__dirname, '../shared');
const outputMap = path.join(__dirname, '../.via-metadata.d.ts');

const files = fs.readdirSync(sharedDir).filter(f => f.endsWith('.js'));
let metaOutput = '// GENERATED VIA METADATA MAP\n';

for (const file of files) {
  const content = fs.readFileSync(path.join(sharedDir, file), 'utf8');
  metaOutput += `\ndeclare module 'shared/${file}' {\n`;

  const classes = [...content.matchAll(/class\s+([A-Za-z0-9_]+)/g)].map(m => m[1]);
  classes.forEach(c => metaOutput += `  class ${c} {}\n`);

  const funcs = [...content.matchAll(/(?:async\s+)?function\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)/g)];
  funcs.forEach(m => metaOutput += `  function ${m[1]}(${m[2]}): any;\n`);

  const attributes = [...content.matchAll(/(?:const|let|var)\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*=>/g)];
  attributes.forEach(m => metaOutput += `  function ${m[1]}(${m[2]}): any;\n`);

  const events = [...content.matchAll(/new CustomEvent\(['"]([^'"]+)['"]/g)].map(m => m[1]);
  [...new Set(events)].forEach(e => metaOutput += `  // Dispatches CustomEvent: '${e}'\n`);

  metaOutput += `}\n`;
}

fs.writeFileSync(outputMap, metaOutput);
console.log(`Generated metadata map at ${outputMap}`);
