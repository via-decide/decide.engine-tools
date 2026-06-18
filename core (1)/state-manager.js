'use strict';

function clone(value) {
  if (value === null || value === undefined) return value;
  return JSON.parse(JSON.stringify(value));
}

class StateManager {
  constructor(initialState = {}) {
    this.state = Object.assign(Object.create(null), clone(initialState) || {});
  }

  get(key) {
    return clone(this.state[key]);
  }

  set(key, value) {
    this.state[key] = clone(value);
    return this.get(key);
  }

  snapshot() {
    return clone(this.state);
  }
}

module.exports = {
  StateManager,
  createStateManager: (initialState) => new StateManager(initialState)
};
