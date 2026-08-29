class DeterministicNormalizer {
  // existing implementation
}

class HashUtil {
  // existing implementation
}

class StorageAdapter {
  get(key) {
    if (this._storage.has(key)) {
      return this._storage.get(key);
    } else {
      throw new Error(`Key not found: ${key}`);
    }
  }

  set(key, value) {
    this._storage.set(key, value);
  }

  delete(key) {
    if (this._storage.has(key)) {
      this._storage.delete(key);
    } else {
      throw new Error(`Key not found: ${key}`);
    }
  }
}