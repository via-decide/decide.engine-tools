(function (global) {
  'use strict';

  let cachedTools = [];

  function normalizeCategory(category) {
    if (!category) return 'all';
    return String(category).trim().toLowerCase();
  }

  function setTools(tools) {
    cachedTools = Array.isArray(tools) ? tools.slice() : [];
    return cachedTools;
  }

  function getTools() {
    return cachedTools.slice();
  }

  function getToolsByCategory(category, tools = cachedTools) {
    const normalized = normalizeCategory(category);
    const source = Array.isArray(tools) ? tools : [];
    if (normalized === 'all') return source.slice();
    return source.filter((tool) => normalizeCategory(tool.category) === normalized);
  }

  function getFeaturedTools(tools = cachedTools) {
    const source = Array.isArray(tools) ? tools : [];
    return source.filter((tool) => Boolean(tool.featured));
  }

  global.ToolUiUtils = {
    setTools,
    getTools,
    getToolsByCategory,
    getFeaturedTools
  };
})(window);
