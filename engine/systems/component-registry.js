(function (global) {
  'use strict';

  function createComponentRegistry() {
    const buckets = {};

    function ensure(type) {
      if (!buckets[type]) buckets[type] = new Map();
      return buckets[type];
    }

    return {
      attach(entityId, type, value) {
        ensure(type).set(entityId, value);
      },
      get(entityId, type) {
        const bucket = buckets[type];
        return bucket ? bucket.get(entityId) : undefined;
      },
      remove(entityId, type) {
        const bucket = buckets[type];
        if (bucket) bucket.delete(entityId);
      },
      entities(type) {
        const bucket = buckets[type];
        return bucket ? Array.from(bucket.keys()) : [];
      },
      clear() {
        Object.keys(buckets).forEach((type) => buckets[type].clear());
      }
    };
  }

  global.ComponentRegistry = { createComponentRegistry };
})(window);
