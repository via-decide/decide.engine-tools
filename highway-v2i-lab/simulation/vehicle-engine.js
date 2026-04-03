(function (global) {
  'use strict';

  const utils = global.EngineUtils || {
    clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  };

  const VEHICLE_TYPES = ['car', 'motorcycle', 'truck'];

  function createVehicle(id, index, cfg) {
    const type = VEHICLE_TYPES[index % VEHICLE_TYPES.length];
    const baseSpeed = type === 'truck' ? 24 : (type === 'motorcycle' ? 32 : cfg.initialSpeed);

    return {
      id,
      type,
      lane: index % 3,
      prevLane: index % 3,
      speed: baseSpeed + ((Math.random() - 0.5) * 6),
      prevSpeed: baseSpeed,
      position: (cfg.corridorLength / cfg.density) * index,
      heading: 0,
      communicationRange: type === 'truck' ? 250 : 220,
      messageBuffer: [],
      sensorState: { confidence: 0.5, staleTicks: 0 },
      anomaly: false,
      relayRole: false,
      leaderRole: false,
      platoonId: null,
      cooperativeBrake: false,
      adaptiveSpeedFactor: 1
    };
  }

  function createVehicleEngine(config) {
    const cfg = Object.assign({
      corridorLength: 1000,
      initialSpeed: 28,
      density: 24,
      behaviorMode: 'baseline'
    }, config || {});

    const vehicles = [];
    for (let i = 0; i < cfg.density; i += 1) {
      vehicles.push(createVehicle(`veh-${i + 1}`, i, cfg));
    }

    function applyBehaviorMode(mode) {
      const selected = mode || cfg.behaviorMode;
      cfg.behaviorMode = selected;
      vehicles.forEach((vehicle, idx) => {
        vehicle.leaderRole = false;
        vehicle.cooperativeBrake = false;
        vehicle.adaptiveSpeedFactor = 1;
        vehicle.platoonId = null;

        if (selected === 'cluster-leader-election') {
          vehicle.leaderRole = idx % 7 === 0;
        } else if (selected === 'platoon-communication') {
          vehicle.platoonId = `platoon-${Math.floor(idx / 4) + 1}`;
          vehicle.leaderRole = idx % 4 === 0;
        } else if (selected === 'cooperative-braking-signals' && vehicle.anomaly) {
          vehicle.cooperativeBrake = true;
        } else if (selected === 'adaptive-speed-coordination') {
          vehicle.adaptiveSpeedFactor = vehicle.type === 'truck' ? 0.92 : 1.05;
        } else if (selected === 'dynamic-relay-nodes') {
          vehicle.relayRole = idx % 5 === 0 || vehicle.type === 'truck';
        }
      });
      return selected;
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

    function computeTrafficWaves(speedList) {
      if (!speedList.length) return 0;
      let waves = 0;
      for (let i = 1; i < speedList.length; i += 1) {
        if (Math.abs(speedList[i] - speedList[i - 1]) > 6) waves += 1;
      }
      return Number((waves / Math.max(1, speedList.length - 1)).toFixed(3));
    }

    function tick(deltaSeconds, events) {
      const dt = Math.max(0.05, Number(deltaSeconds) || 0.1);
      let anomalyCount = 0;
      let laneChanges = 0;
      let totalSpeed = 0;
      const speeds = [];
      const activeIds = [];
      const vehicleTypes = { car: 0, motorcycle: 0, truck: 0 };
      const laneCounts = [0, 0, 0];

      vehicles.forEach((vehicle) => {
        const randomDrift = (Math.random() - 0.5) * 1.2;
        vehicle.prevSpeed = vehicle.speed;
        vehicle.speed = utils.clamp((vehicle.speed + randomDrift) * vehicle.adaptiveSpeedFactor, 14, 48);

        vehicle.prevLane = vehicle.lane;
        if (Math.random() < 0.035) {
          const laneShift = Math.random() < 0.5 ? -1 : 1;
          vehicle.lane = Math.max(0, Math.min(2, vehicle.lane + laneShift));
        }
        if (vehicle.lane !== vehicle.prevLane) laneChanges += 1;

        vehicle.position += vehicle.speed * dt;
        vehicle.heading = 0;
        if (vehicle.position > cfg.corridorLength) vehicle.position -= cfg.corridorLength;

        if (Math.random() < 0.01) vehicle.anomaly = !vehicle.anomaly;
        vehicle.sensorState.confidence = utils.clamp(vehicle.sensorState.confidence + ((Math.random() - 0.5) * 0.08), 0.25, 0.99);
        vehicle.sensorState.staleTicks = vehicle.anomaly ? 0 : (vehicle.sensorState.staleTicks + 1);
        if (vehicle.messageBuffer.length > 12) vehicle.messageBuffer.shift();

        vehicleTypes[vehicle.type] += 1;
        laneCounts[vehicle.lane] += 1;
        totalSpeed += vehicle.speed;
        speeds.push(vehicle.speed);
        if (vehicle.anomaly) {
          anomalyCount += 1;
          activeIds.push(vehicle.id);
          events.emit('vehicle.anomaly', {
            vehicleId: vehicle.id,
            lane: vehicle.lane,
            type: vehicle.type,
            position: vehicle.position,
            heading: vehicle.heading
          });
        }
      });

      const avgSpeed = totalSpeed / Math.max(1, vehicles.length);
      const densityPerKm = (vehicles.length / (cfg.corridorLength / 1000));
      const speedVariance = speeds.reduce((sum, speed) => sum + Math.pow(speed - avgSpeed, 2), 0) / Math.max(1, speeds.length);
      const trafficWaveIndex = computeTrafficWaves(speeds);
      const bottleneckLane = laneCounts.indexOf(Math.max.apply(null, laneCounts));

      return {
        vehicles,
        anomalyCount,
        activeAnomalies: activeIds,
        vehicleTypes,
        behaviorMode: cfg.behaviorMode,
        densityPerKm,
        laneChanges,
        speedVariance,
        averageSpeed: avgSpeed,
        trafficWaveIndex,
        laneCounts,
        bottleneckLane,
        trafficFlowState: avgSpeed < 22 ? 'congested' : (avgSpeed < 30 ? 'dense' : 'free-flow')
      };
    }

    function getState() {
      return vehicles;
    }

    return { tick, applyRelayClusters, applyBehaviorMode, getState };
  }

  global.HighwayVehicleEngine = { createVehicleEngine };
})(window);
