'use strict';

class Scheduler {
  constructor(options = {}) {
    this.queue = [];
    this.sequence = 0;
    this.tick = 0;
    this.logger = typeof options.logger === 'function' ? options.logger : () => {};
  }

  schedule(task) {
    if (!task || typeof task.run !== 'function') {
      throw new Error('Scheduler.schedule(task) requires a task object with run(context).');
    }

    const normalized = {
      id: typeof task.id === 'string' ? task.id : `task-${this.sequence + 1}`,
      priority: Number.isFinite(task.priority) ? task.priority : 0,
      run: task.run,
      meta: task.meta || null,
      _seq: this.sequence
    };

    this.sequence += 1;
    this.queue.push(normalized);
    return normalized.id;
  }

  runTick(context = {}) {
    const currentTick = this.tick;
    this.tick += 1;

    const tasks = this.queue
      .slice()
      .sort((a, b) => (b.priority - a.priority) || a.id.localeCompare(b.id) || (a._seq - b._seq));

    this.queue.length = 0;

    const report = {
      tick: currentTick,
      executed: 0,
      failed: 0,
      errors: []
    };

    for (const task of tasks) {
      const trace = context.trace || null;
      const flowId = context.flowId || null;
      const parentSpanId = context.parentSpanId || null;
      const taskSpanId = trace && flowId ? trace.startSpan(flowId, { name: `scheduler.task:${task.id}`, parentId: parentSpanId }) : null;

      try {
        task.run({ ...context, tick: currentTick, taskId: task.id, taskSpanId });
        report.executed += 1;
        if (trace && taskSpanId) trace.endSpan(taskSpanId, { taskId: task.id });
      } catch (error) {
        report.failed += 1;
        report.errors.push({ taskId: task.id, message: error && error.message ? error.message : String(error) });
        if (trace && taskSpanId) trace.fail(taskSpanId, error, { taskId: task.id });
      }
    }

    this.logger({ type: 'scheduler:tick', report });
    return report;
  }
}

module.exports = {
  Scheduler,
  createScheduler: (options) => new Scheduler(options)
};
