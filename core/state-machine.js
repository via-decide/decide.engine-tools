'use strict';

const { createStateRegistry } = require('./state-registry');

function createStateMachine(definition) {
  if (!definition || !Array.isArray(definition.states) || !definition.transitions || !definition.initialState) {
    throw new Error('Invalid state machine definition');
  }

  const states = new Set(definition.states);
  const registry = createStateRegistry();

  function ensureState(state) {
    if (!states.has(state)) throw new Error(`Unknown state: ${state}`);
  }

  ensureState(definition.initialState);
  Object.keys(definition.transitions).forEach((from) => {
    ensureState(from);
    const events = definition.transitions[from] || {};
    Object.keys(events).forEach((eventName) => ensureState(events[eventName]));
  });

  function getState(entityId) {
    return registry.get(entityId) || definition.initialState;
  }

  function canTransition(entityId, event) {
    const current = getState(entityId);
    const map = definition.transitions[current] || {};
    return Object.prototype.hasOwnProperty.call(map, event.type);
  }

  function transition(entityId, event) {
    const current = getState(entityId);
    const map = definition.transitions[current] || {};
    if (!Object.prototype.hasOwnProperty.call(map, event.type)) {
      throw new Error(`Invalid transition: ${current} --${event.type}--> ?`);
    }
    const next = map[event.type];
    registry.set(entityId, next);
    return { entityId, event: event.type, from: current, to: next };
  }

  return { transition, getState, canTransition };
}

module.exports = { createStateMachine };
