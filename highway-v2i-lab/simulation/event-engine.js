(function (global) {
  'use strict';

  function createEventEngine() {
    const listeners = {};
    const telemetry = [];

    function on(type, handler) {
      if (!listeners[type]) listeners[type] = [];
      listeners[type].push(handler);
      return () => {
        listeners[type] = (listeners[type] || []).filter((item) => item !== handler);
      };
    }

    function emit(type, payload) {
      const event = {
        type,
        payload: payload || {},
        ts: Date.now()
      };
      telemetry.push(event);
      if (telemetry.length > 2500) telemetry.shift();
      (listeners[type] || []).forEach((handler) => {
        try { handler(event); } catch (error) { /* no-op */ }
      });
      return event;
    }

    function snapshotTelemetry(limit) {
      const max = Number(limit) || 200;
      return telemetry.slice(-max);
    }

    return { on, emit, snapshotTelemetry };
  }

  global.HighwayEventEngine = { createEventEngine };
})(window);
