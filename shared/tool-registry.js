(function (global) {
  const tools = [
    'promptalchemy',
    'script-generator',
    'spec-builder',
    'code-generator',
    'code-reviewer',
    'tool-router',
    'export-studio',
    'template-vault'
  ];

  function getTools() {
    return tools.slice();
  }

  function isRegistered(id) {
    return tools.includes(id);
  }

  global.ToolRegistry = { getTools, isRegistered };
})(window);
