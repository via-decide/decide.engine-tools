'use strict';

function createStateRegistry(initialState, options = {}) {
  const seed = initialState && typeof initialState === 'object' ? initialState : {};
  const defaultTtlMs = Number.isFinite(options.defaultTtlMs) && options.defaultTtlMs > 0 ? options.defaultTtlMs : 5 * 60 * 1000;
  const maxEntries = Number.isFinite(options.maxEntries) && options.maxEntries > 0 ? Math.floor(options.maxEntries) : 1000;
  const store = new Map();
  const metrics = { evictionCount: 0 };

  function emitLog(event, payload) {
    if (typeof options.onEvent === 'function') options.onEvent(event, payload);
  }

  function evictOldest(overflowBy) {
    let remaining = overflowBy;
    while (remaining > 0 && store.size > 0) {
      const oldestKey = store.keys().next().value;
      store.delete(oldestKey);
      metrics.evictionCount += 1;
      emitLog('state_evicted', { key: oldestKey, reason: 'max_entries', state_registry_size: store.size, state_eviction_count: metrics.evictionCount });
      remaining -= 1;
    }
  }

  function set(entityId, value) {
    if (store.has(entityId)) store.delete(entityId);
    store.set(entityId, { value, createdAt: Date.now() });
    if (store.size > maxEntries) evictOldest(store.size - maxEntries);
    emitLog('state_created', { key: entityId, state_registry_size: store.size, state_eviction_count: metrics.evictionCount });
    return value;
  }

  function get(entityId) {
    return store.has(entityId) ? store.get(entityId).value : null;
  }

  function del(entityId) {
    const removed = store.delete(entityId);
    if (removed) emitLog('state_deleted', { key: entityId, state_registry_size: store.size, state_eviction_count: metrics.evictionCount });
    return removed;
  }

  function cleanupExpired(ttlMs = defaultTtlMs) {
    const effectiveTtlMs = Number.isFinite(ttlMs) && ttlMs >= 0 ? ttlMs : defaultTtlMs;
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now - entry.createdAt >= effectiveTtlMs) del(key);
    }
    return store.size;
  }

  function size() {
    return store.size;
  }

  Object.entries(seed).forEach(([key, value]) => set(key, value));

  return {
    get,
    set,
    has(entityId) {
      return store.has(entityId);
    },
    delete: del,
    cleanupExpired,
    size
  };
}

module.exports = { createStateRegistry };
