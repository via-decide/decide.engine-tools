'use strict';

function createStateRegistry(initialState) {
  const seed = initialState && typeof initialState === 'object' ? initialState : {};
  const store = new Map(Object.entries(seed));

  return {
    get(entityId) {
      return store.has(entityId) ? store.get(entityId) : null;
    },
    set(entityId, state) {
      store.set(entityId, state);
      return state;
    },
    has(entityId) {
      return store.has(entityId);
    }
  };
}

module.exports = { createStateRegistry };
