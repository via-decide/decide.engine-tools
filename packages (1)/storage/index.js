(function (global) {
  'use strict';

  let hasStorage = false;
  let memStore = {};
  const PREFIX = 'viadecide.';

  try {
    const testKey = '__storage_test__';
    global.localStorage.setItem(testKey, testKey);
    global.localStorage.removeItem(testKey);
    hasStorage = true;
  } catch (e) {
    console.warn('[Platform Storage] localStorage is unavailable (possibly blocked by browser privacy options). Falling back to memory-based storage.');
  }

  function resolveKey(key) {
    return key.startsWith(PREFIX) ? key : PREFIX + key;
  }

  function setItem(key, value) {
    const fullKey = resolveKey(key);
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    
    if (hasStorage) {
      try {
        global.localStorage.setItem(fullKey, serialized);
        return true;
      } catch (err) {
        console.error('[Platform Storage] Set failed on localStorage:', err.message);
      }
    }
    memStore[fullKey] = serialized;
    return true;
  }

  function getItem(key) {
    const fullKey = resolveKey(key);
    let val = null;
    
    if (hasStorage) {
      try {
        val = global.localStorage.getItem(fullKey);
      } catch (err) {
        console.error('[Platform Storage] Get failed on localStorage:', err.message);
      }
    }
    
    // If not found in localStorage or localStorage failed, read memory store
    if (val === null && memStore[fullKey] !== undefined) {
      val = memStore[fullKey];
    }
    
    return val;
  }

  function getJSON(key, defaultValue = {}) {
    const val = getItem(key);
    if (val === null) return defaultValue;
    try {
      return JSON.parse(val);
    } catch (err) {
      console.warn(`[Platform Storage] Failed parsing JSON for key "${key}":`, err.message);
      return { raw: val };
    }
  }

  function removeItem(key) {
    const fullKey = resolveKey(key);
    if (hasStorage) {
      try {
        global.localStorage.removeItem(fullKey);
      } catch (err) {
        console.error('[Platform Storage] Remove failed on localStorage:', err.message);
      }
    }
    delete memStore[fullKey];
    return true;
  }

  function keys() {
    const allKeys = new Set();
    if (hasStorage) {
      try {
        for (let i = 0; i < global.localStorage.length; i++) {
          const k = global.localStorage.key(i);
          if (k && k.startsWith(PREFIX)) {
            allKeys.add(k.substring(PREFIX.length));
          }
        }
      } catch (err) {
        console.error('[Platform Storage] Keys query failed on localStorage:', err.message);
      }
    }
    
    for (const k of Object.keys(memStore)) {
      if (k.startsWith(PREFIX)) {
        allKeys.add(k.substring(PREFIX.length));
      }
    }
    
    return Array.from(allKeys);
  }

  global.PlatformStorage = {
    setItem,
    getItem,
    getJSON,
    removeItem,
    keys,
    isPersistent: () => hasStorage
  };
})(typeof window !== 'undefined' ? window : global);
