(function (global) {
  'use strict';

  function createEntityManager() {
    let nextId = 1;
    const entities = new Set();

    return {
      spawn() {
        const id = `e${nextId++}`;
        entities.add(id);
        return id;
      },
      destroy(entityId) {
        entities.delete(entityId);
      },
      list() {
        return Array.from(entities);
      },
      clear() {
        entities.clear();
        nextId = 1;
      }
    };
  }

  global.EntityManager = { createEntityManager };
})(window);
