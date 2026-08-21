const importableToolDirs = [
  'tools/workspace',
  'tools/studyos',
  'tools/tools',
  'tools/agent-console',
  'tools/settings'
];

function route(toolId) {
  const toolPath = `./${toolId}/index.html`;
  return toolPath;
}

module.exports = { importableToolDirs, route };