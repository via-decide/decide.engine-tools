(function (global) {
  'use strict';

  const utils = global.EngineUtils || {
    clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  };

  const VEHICLE_TYPES = ['car', 'motorcycle', 'truck'];
  const DRIVER_TYPES = ['aggressive', 'normal', 'cautious'];

  const DRIVER_PROFILE = {
    aggressive: { accel: 4.2, braking: 6.4, desiredHeadway: 1.1, laneChangeBias: 0.07, maxFactor: 1.08, reactionTime: 0.7 },
    normal: { accel: 3.1, braking: 5.5, desiredHeadway: 1.6, laneChangeBias: 0.04, maxFactor: 1.0, reactionTime: 1.1 },
    cautious: { accel: 2.3, braking: 4.8, desiredHeadway: 2.2, laneChangeBias: 0.02, maxFactor: 0.92, reactionTime: 1.5 }
  };

  function typeFor(index, ratios) {
    const r = (index % 1000) / 1000;
    const carCutoff = ratios.carRatio;
    const truckCutoff = carCutoff + ratios.truckRatio;
    if (r < carCutoff) return 'car';
    if (r < truckCutoff) return 'truck';
    return 'motorcycle';
  }

  function createVehicle(id, index, cfg) {
    const ratios = cfg.typeRatios || { truckRatio: 0.18, carRatio: 0.68, motorcycleRatio: 0.14 };
    const type = typeFor(index, ratios);
    const driverType = DRIVER_TYPES[index % DRIVER_TYPES.length];
    const profile = DRIVER_PROFILE[driverType];
    const baseSpeed = type === 'truck' ? 23 : (type === 'motorcycle' ? 30 : cfg.initialSpeed);
    const maxSpeed = type === 'truck' ? 31 : (type === 'motorcycle' ? 42 : 37);

    return {
      id,
      type,
      lane: index % 3,
      prevLane: index % 3,
      speed: utils.clamp(baseSpeed + ((Math.random() - 0.5) * 3), 0, maxSpeed),
      prevSpeed: baseSpeed,
      acceleration: 0,
      maxSpeed: maxSpeed * profile.maxFactor,
      brakingDistance: 14 + (index % 7) * 2,
      reactionTime: profile.reactionTime,
      driverType,
      position: (cfg.corridorLength / Math.max(1, cfg.density)) * index,
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
      behaviorMode: 'baseline',
      maxVehicles: 1000,
      typeRatios: { truckRatio: 0.18, carRatio: 0.68, motorcycleRatio: 0.14 },
      speedLimitKmh: 100
    }, config || {});

    const vehicles = [];

    function ensureDensity(targetDensity) {
      const target = Math.max(4, Math.min(cfg.maxVehicles, Number(targetDensity) || cfg.density));
      cfg.density = target;
      while (vehicles.length < target) {
        const idx = vehicles.length;
        vehicles.push(createVehicle(`veh-${idx + 1}`, idx, cfg));
      }
      if (vehicles.length > target) vehicles.length = target;
      return vehicles.length;
    }

    ensureDensity(cfg.density);

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

    function updateCalibration(calibration) {
      if (!calibration) return;
      if (calibration.trafficDensity != null) {
        const targetDensity = Math.round(cfg.maxVehicles * Number(calibration.trafficDensity));
        ensureDensity(targetDensity);
      }
      if (calibration.speedLimitKmh != null) {
        cfg.speedLimitKmh = Number(calibration.speedLimitKmh);
      }
      if (calibration.typeRatios) cfg.typeRatios = calibration.typeRatios;
    }

    function computeTrafficWaves(speedList) {
      if (!speedList.length) return 0;
      let waves = 0;
      for (let i = 1; i < speedList.length; i += 1) {
        if (Math.abs(speedList[i] - speedList[i - 1]) > 6) waves += 1;
      }
      return Number((waves / Math.max(1, speedList.length - 1)).toFixed(3));
    }

    function nearestAheadByLane(laneBuckets, lane, position) {
      const laneList = laneBuckets[lane] || [];
      let nearest = null;
      let minGap = Number.POSITIVE_INFINITY;
      for (let i = 0; i < laneList.length; i += 1) {
        const candidate = laneList[i];
        if (candidate.position <= position) continue;
        const gap = candidate.position - position;
        if (gap < minGap) {
          minGap = gap;
          nearest = candidate;
        }
      }
      return { vehicle: nearest, gap: minGap };
    }

    function tick(deltaSeconds, events, external) {
      const dt = Math.max(0.05, Number(deltaSeconds) || 0.1);
      const ext = Object.assign({ scenarioEffects: {}, calibration: null }, external || {});
      if (ext.calibration) updateCalibration(ext.calibration);

      let anomalyCount = 0;
      let laneChanges = 0;
      let totalSpeed = 0;
      const speeds = [];
      const activeIds = [];
      const vehicleTypes = { car: 0, motorcycle: 0, truck: 0 };
      const laneCounts = [0, 0, 0];
      const emergencyActive = Boolean(ext.scenarioEffects && ext.scenarioEffects.emergencyVehicle);
      const blockedLane = ext.scenarioEffects && ext.scenarioEffects.blockedLane != null ? Number(ext.scenarioEffects.blockedLane) : null;
      const speedFactor = utils.clamp((ext.scenarioEffects && ext.scenarioEffects.speedFactor) || 1, 0.4, 1);

      const laneBuckets = [[], [], []];
      vehicles.forEach((vehicle) => {
        laneBuckets[vehicle.lane].push(vehicle);
      });
      laneBuckets.forEach((lane) => lane.sort((a, b) => a.position - b.position));

      vehicles.forEach((vehicle, idx) => {
        const profile = DRIVER_PROFILE[vehicle.driverType] || DRIVER_PROFILE.normal;
        vehicle.prevSpeed = vehicle.speed;
        const ahead = nearestAheadByLane(laneBuckets, vehicle.lane, vehicle.position);
        const headway = profile.desiredHeadway + vehicle.reactionTime;
        const desiredGap = Math.max(vehicle.brakingDistance, vehicle.speed * headway);
        const gap = ahead.vehicle ? ahead.gap : Number.POSITIVE_INFINITY;

        let targetAcceleration = profile.accel;
        if (gap < desiredGap) {
          const brakingIntensity = (desiredGap - gap) / Math.max(1, desiredGap);
          targetAcceleration = -profile.braking * brakingIntensity;
        }
        if (emergencyActive && vehicle.type !== 'truck') {
          targetAcceleration -= 0.8;
        }

        const allowedSpeed = (cfg.speedLimitKmh / 3.6) * speedFactor;
        const adjustedMax = Math.min(vehicle.maxSpeed, allowedSpeed) * vehicle.adaptiveSpeedFactor;
        vehicle.acceleration = utils.clamp(targetAcceleration, -7, 4.6);
        vehicle.speed = utils.clamp(vehicle.speed + (vehicle.acceleration * dt), 0, adjustedMax);

        vehicle.prevLane = vehicle.lane;
        const laneChangeChance = profile.laneChangeBias + (gap < desiredGap ? 0.04 : 0);
        const congestionPressure = gap < desiredGap * 0.75;
        if (Math.random() < laneChangeChance && congestionPressure) {
          const laneShift = Math.random() < 0.5 ? -1 : 1;
          const candidateLane = Math.max(0, Math.min(2, vehicle.lane + laneShift));
          if (blockedLane == null || candidateLane !== blockedLane) vehicle.lane = candidateLane;
        }
        if (blockedLane != null && vehicle.lane === blockedLane) {
          vehicle.lane = Math.max(0, Math.min(2, blockedLane + (idx % 2 ? -1 : 1)));
        }
        if (emergencyActive && ext.scenarioEffects && ext.scenarioEffects.emergencyLane != null && vehicle.type !== 'truck') {
          const eLane = Number(ext.scenarioEffects.emergencyLane);
          if (vehicle.lane === eLane) {
            vehicle.lane = eLane > 0 ? eLane - 1 : eLane + 1;
          }
        }
        if (vehicle.lane !== vehicle.prevLane) laneChanges += 1;

        vehicle.position += vehicle.speed * dt;
        if (vehicle.position > cfg.corridorLength) vehicle.position -= cfg.corridorLength;

        if (Math.random() < 0.01) vehicle.anomaly = !vehicle.anomaly;
        vehicle.sensorState.confidence = utils.clamp(vehicle.sensorState.confidence + ((Math.random() - 0.5) * 0.08), 0.2, 0.99);
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
        trafficFlowState: avgSpeed < 18 ? 'congested' : (avgSpeed < 27 ? 'dense' : 'free-flow')
      };
    }

    function getState() {
      return vehicles;
    }

    return { tick, applyRelayClusters, applyBehaviorMode, getState, updateCalibration, ensureDensity };
  }

  global.HighwayVehicleEngine = { createVehicleEngine };
})(window);
