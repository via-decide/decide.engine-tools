'use strict';

const { createScheduler } = require('./scheduler');
const { createStateManager } = require('./state-manager');

class Runtime {
  constructor(options = {}) {
    this.tickRate = Number.isFinite(options.tickRate) && options.tickRate > 0 ? options.tickRate : 60;
    this.tickIntervalMs = Math.floor(1000 / this.tickRate);
    this.scheduler = options.scheduler || createScheduler({ logger: (entry) => this.logs.push(entry) });
    this.stateManager = options.stateManager || createStateManager(options.initialState || {});
    this.timer = null;
    this.isRunning = false;
    this.tick = 0;
    this.logs = [];
  }

  _runOneTick() {
    const report = this.scheduler.runTick({ state: this.stateManager.snapshot() });
    this.stateManager.set('lastTick', this.tick);
    this.stateManager.set('lastReport', report);
    this.logs.push({ type: 'runtime:tick', tick: this.tick, report });
    this.tick += 1;
    return report;
  }

  start() {
    if (this.isRunning) return false;
    this.isRunning = true;
    this.timer = setInterval(() => this._runOneTick(), this.tickIntervalMs);
    return true;
  }

  stop() {
    if (!this.isRunning) return false;
    clearInterval(this.timer);
    this.timer = null;
    this.isRunning = false;
    return true;
  }

  step() {
    return this._runOneTick();
  }

  getState() {
    return {
      runtime: {
        isRunning: this.isRunning,
        tick: this.tick,
        tickRate: this.tickRate,
        tickIntervalMs: this.tickIntervalMs,
        logs: this.logs.slice()
      },
      state: this.stateManager.snapshot()
    };
  }
}

module.exports = {
  Runtime,
  createRuntime: (options) => new Runtime(options)
};
