(function (global) {
  'use strict';

  const utils = global.EngineUtils || {
    clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  };

  function createVehicleEngine(config) {
    const cfg = Object.assign({
      corridorLength: 1000,
      initialSpeed: 28,
      density: 24
    }, config || {});

    const vehicles = [];
    for (let i = 0; i < cfg.density; i += 1) {
      vehicles.push({
        id: `veh-${i + 1}`,
        lane: i % 3,
        speed: cfg.initialSpeed + ((Math.random() - 0.5) * 6),
        position: (cfg.corridorLength / cfg.density) * i,
        anomaly: false,
        relayRole: false
      });
    }

    function tick(deltaSeconds, events) {
      const dt = Math.max(0.05, Number(deltaSeconds) || 0.1);
      let anomalyCount = 0;
      const activeIds = [];
      vehicles.forEach((vehicle) => {
        const randomDrift = (Math.random() - 0.5) * 1.2;
        vehicle.speed = utils.clamp(vehicle.speed + randomDrift, 16, 45);
        vehicle.position += vehicle.speed * dt;
        if (vehicle.position > cfg.corridorLength) vehicle.position -= cfg.corridorLength;

        if (Math.random() < 0.01) vehicle.anomaly = !vehicle.anomaly;
        if (vehicle.anomaly) {
          anomalyCount += 1;
          activeIds.push(vehicle.id);
          events.emit('vehicle.anomaly', { vehicleId: vehicle.id, lane: vehicle.lane, position: vehicle.position });
        }
      });

      return {
        vehicles,
        anomalyCount,
        activeAnomalies: activeIds
      };
    }

    function applyRelayClusters(clusterSize) {
      const size = Math.max(2, Number(clusterSize) || 4);
      let active = 0;
      for (let i = 0; i < vehicles.length; i += 1) {
        const inCluster = (i % size) === 0;
        vehicles[i].relayRole = inCluster;
        if (inCluster) active += 1;
      }
      return active;
    }

    function getState() {
      return vehicles;
    }

    return { tick, applyRelayClusters, getState };
  }

  global.HighwayVehicleEngine = { createVehicleEngine };
})(window);
