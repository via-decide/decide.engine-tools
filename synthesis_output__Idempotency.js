class Idempotency {
  constructor() {
    this.data = {};
  }

  set(key, value) {
    this.data[key] = value;
  }

  get(key) {
    return this.data[key];
  }

  clear() {
    // Clear the data object to reset all stored values
    this.data = {};
  }
}

module.exports = Idempotency;