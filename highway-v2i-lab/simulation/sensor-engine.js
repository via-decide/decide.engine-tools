(function (global) {
  'use strict';

  const utils = global.EngineUtils || {
    clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  };

  function createSensorEngine(config) {
    const cfg = Object.assign({
      sensorDensity: 0.35,
      detectionNoise: 0.08,
      confidenceFloor: 0.55
    }, config || {});

    function tick(vehicleState, events) {
      const anomalies = vehicleState.anomalyCount || 0;
      const rawConfidence = (cfg.sensorDensity * 1.2) - (cfg.detectionNoise * 0.5) + (anomalies > 0 ? 0.2 : 0);
      const confidence = utils.clamp(rawConfidence, cfg.confidenceFloor, 0.99);
      const sensorHits = Math.max(0, Math.round((vehicleState.vehicles.length * cfg.sensorDensity) * (0.7 + Math.random() * 0.6)));

      if (anomalies > 0 && confidence > 0.6) {
        events.emit('sensor.trigger', {
          anomalies,
          confidence,
          sensorHits
        });
      }

      return {
        confidence,
        sensorHits,
        anomalyConfirmed: anomalies > 0 && confidence > 0.62
      };
    }

    function updateDensity(value) {
      cfg.sensorDensity = utils.clamp(Number(value) || cfg.sensorDensity, 0.1, 0.95);
      return cfg.sensorDensity;
    }

    return { tick, updateDensity };
  }

  global.HighwaySensorEngine = { createSensorEngine };
})(window);
