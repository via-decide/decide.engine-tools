(function (global) {
  'use strict';

  const utils = global.EngineUtils || {
    clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  };

  function createSensorEngine(config) {
    const cfg = Object.assign({
      sensorDensity: 0.35,
      detectionNoise: 0.08,
      confidenceFloor: 0.55,
      drainageAngle: 22,
      selfCleaningFactor: 0.7,
      cameraAngle: 38,
      sensorAngle: 34,
      sensorPlacement: 0.5
    }, config || {});

    const infrastructure = {
      roadSurfaceWear: 0.14,
      potholeIndex: 0.06,
      sensorFailureRate: 0.03,
      cameraMalfunctionRate: 0.02,
      networkDowntime: 0.01
    };

    function tick(vehicleState, events) {
      const anomalies = vehicleState.anomalyCount || 0;
      const flowPenalty = vehicleState.trafficFlowState === 'congested' ? 0.08 : (vehicleState.trafficFlowState === 'dense' ? 0.03 : 0);
      const angleCoverageBonus = utils.clamp(((cfg.sensorAngle + cfg.cameraAngle) / 120) - 0.45, -0.08, 0.24);
      const placementBonus = utils.clamp(Math.abs(cfg.sensorPlacement - 0.5) < 0.22 ? 0.06 : -0.05, -0.08, 0.08);
      const rawConfidence = (cfg.sensorDensity * 1.2) - (cfg.detectionNoise * 0.5) - flowPenalty + angleCoverageBonus + placementBonus + (anomalies > 0 ? 0.2 : 0);
      const confidence = utils.clamp(rawConfidence, cfg.confidenceFloor, 0.99);
      const sensorHits = Math.max(0, Math.round((vehicleState.vehicles.length * cfg.sensorDensity) * (0.7 + Math.random() * 0.6)));

      infrastructure.roadSurfaceWear = utils.clamp(infrastructure.roadSurfaceWear + (Math.random() * 0.004), 0, 1);
      infrastructure.potholeIndex = utils.clamp(infrastructure.potholeIndex + (Math.random() * 0.0035), 0, 1);
      infrastructure.sensorFailureRate = utils.clamp(infrastructure.sensorFailureRate + (Math.random() - 0.45) * 0.01, 0.01, 0.5);
      infrastructure.cameraMalfunctionRate = utils.clamp(infrastructure.cameraMalfunctionRate + (Math.random() - 0.45) * 0.008, 0.005, 0.4);
      infrastructure.networkDowntime = utils.clamp(infrastructure.networkDowntime + (Math.random() - 0.5) * 0.01, 0.001, 0.35);

      const healthScore = utils.clamp(100 - (
        infrastructure.roadSurfaceWear * 25 +
        infrastructure.potholeIndex * 22 +
        infrastructure.sensorFailureRate * 20 +
        infrastructure.cameraMalfunctionRate * 16 +
        infrastructure.networkDowntime * 17
      ), 0, 100);

      const repairPriorityScore = utils.clamp(100 - healthScore + (vehicleState.densityPerKm || 0) * 0.35 + anomalies * 4, 0, 100);
      const maintenancePredictionHrs = Math.max(2, Math.round((100 - repairPriorityScore) * 0.9));

      if (anomalies > 0 && confidence > 0.6) {
        events.emit('sensor.trigger', {
          anomalies,
          confidence,
          sensorHits
        });
      }

      if (healthScore < 70 || infrastructure.networkDowntime > 0.12) {
        events.emit('infrastructure.alert', {
          healthScore,
          repairPriorityScore,
          maintenancePredictionHrs,
          networkDowntime: infrastructure.networkDowntime
        });
      }

      return {
        confidence,
        sensorHits,
        anomalyConfirmed: anomalies > 0 && confidence > 0.62,
        health: {
          score: healthScore,
          repairPriorityScore,
          maintenancePredictionHrs,
          roadSurfaceWear: infrastructure.roadSurfaceWear,
          potholeIndex: infrastructure.potholeIndex,
          sensorFailureRate: infrastructure.sensorFailureRate,
          cameraMalfunctionRate: infrastructure.cameraMalfunctionRate,
          networkDowntime: infrastructure.networkDowntime
        },
        drainageSensor: {
          angle: cfg.drainageAngle,
          selfCleaningFactor: cfg.selfCleaningFactor,
          cloggingRisk: utils.clamp(1 - (cfg.selfCleaningFactor * (cfg.drainageAngle / 40)), 0.05, 0.9)
        },
        cameraSystem: {
          cameraAngle: cfg.cameraAngle,
          sensorAngle: cfg.sensorAngle,
          sensorPlacement: cfg.sensorPlacement
        }
      };
    }

    function updateDensity(value) {
      cfg.sensorDensity = utils.clamp(Number(value) || cfg.sensorDensity, 0.1, 0.95);
      return cfg.sensorDensity;
    }

    function updateInfrastructureConfig(genome) {
      cfg.sensorDensity = utils.clamp(Number(genome.sensorDensity) || cfg.sensorDensity, 0.1, 0.95);
      cfg.drainageAngle = utils.clamp(Number(genome.drainSlope) * 10, 10, 60);
      cfg.selfCleaningFactor = utils.clamp(0.45 + ((Number(genome.drainSlope) || 2.4) / 10), 0.45, 0.96);
      cfg.cameraAngle = utils.clamp(Number(genome.cameraAngle) || cfg.cameraAngle, 10, 85);
      cfg.sensorAngle = utils.clamp(Number(genome.sensorAngle) || cfg.sensorAngle, 5, 85);
      cfg.sensorPlacement = utils.clamp(Number(genome.sensorPlacement) || cfg.sensorPlacement, 0, 1);
      return {
        sensorDensity: cfg.sensorDensity,
        drainageAngle: cfg.drainageAngle,
        selfCleaningFactor: cfg.selfCleaningFactor,
        cameraAngle: cfg.cameraAngle,
        sensorAngle: cfg.sensorAngle,
        sensorPlacement: cfg.sensorPlacement
      };
    }

    return { tick, updateDensity, updateInfrastructureConfig };
  }

  global.HighwaySensorEngine = { createSensorEngine };
})(window);
