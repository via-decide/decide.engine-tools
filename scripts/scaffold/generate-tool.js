const fs = require('fs');
const path = require('path');

const toolPath = process.argv[2];
if (!toolPath) {
  console.error("Usage: node generate-tool.js <category>/<tool-name>");
  process.exit(1);
}

const parts = toolPath.split('/');
const category = parts.length > 1 ? parts[0] : 'misc';
const name = parts[parts.length - 1];

const targetDir = path.join(__dirname, '../../tools', category, name);
const templateDir = path.join(__dirname, 'template');
fs.mkdirSync(targetDir, { recursive: true });

['index.html', 'tool.js', 'config.json'].forEach(file => {
  let content = fs.readFileSync(path.join(templateDir, file), 'utf8');
  content = content.replace(/{{TOOL_NAME}}/g, name);
  fs.writeFileSync(path.join(targetDir, file), content);
});

const registryPath = path.join(__dirname, '../../shared/tool-registry.js');
let registryStr = fs.readFileSync(registryPath, 'utf8');
const entryPoint = `'tools/${category}/${name}'`;

if(!registryStr.includes(entryPoint)) {
  registryStr = registryStr.replace(/const importableToolDirs = \[([\s\S]*?)\];/, (match, p1) => {
    const trimmed = p1.trimEnd();
    const postfix = trimmed.endsWith(',') ? '' : ',';
    return `const importableToolDirs = [\n${p1.replace(/\n$/, '')}${postfix}\n    ${entryPoint}\n  ];`;
  });
  fs.writeFileSync(registryPath, registryStr);
  console.log(`Updated tool-registry.js with ${entryPoint}`);
}

console.log(`Successfully scaffolded ${name} at ${targetDir}`);
