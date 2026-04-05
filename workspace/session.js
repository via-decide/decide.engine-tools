(function (global) {
  'use strict';

  const STORAGE_KEY = 'workspace.json';

  function readSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_error) {
      return null;
    }
  }

  function saveSession(payload) {
    const base = {
      updatedAt: new Date().toISOString(),
      progress: payload.progress || '',
      toolContext: payload.toolContext || ''
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(base));
    return base;
  }

  function restoreInto(progressSelector, contextSelector) {
    const data = readSession();
    if (!data) return null;
    const progressNode = document.querySelector(progressSelector);
    const contextNode = document.querySelector(contextSelector);
    if (progressNode) progressNode.value = data.progress || '';
    if (contextNode) contextNode.value = data.toolContext || '';
    return data;
  }

  global.WorkspaceSession = { readSession, saveSession, restoreInto };
})(window);
