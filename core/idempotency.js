class StorageAdapter {
  constructor() {
    this.storage = {};
  }

  get(key) {
    return this.storage[key];
  }

  set(key, value) {
    if (typeof key !== 'string' || typeof value !== 'string') {
      throw new Error('Key and value must be strings.');
    }
    this.storage[key] = value;
  }
}

module.exports = new StorageAdapter();