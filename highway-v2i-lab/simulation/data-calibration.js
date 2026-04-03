(function (global) {
  'use strict';

  const WEATHER_SPEED_FACTOR = {
    clear: 1,
    cloudy: 0.96,
    rain: 0.84,
    'heavy-rain': 0.72,
    fog: 0.8
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function buildRoadCondition(weather) {
    if (weather === 'heavy-rain') return 'wet-critical';
    if (weather === 'rain') return 'wet';
    if (weather === 'fog') return 'low-visibility';
    return 'dry';
  }

  function createCalibrationSystem(config) {
    const cfg = Object.assign({
      vehiclesPerMinute: 38,
      truckRatio: 0.18,
      carRatio: 0.68,
      motorcycleRatio: 0.14,
      weather: 'clear',
      timeOfDay: 'midday',
      trafficDensity: 0.56,
      speedLimitKmh: 100
    }, config || {});

    function normalizeRatios(input) {
      const base = {
        truckRatio: Math.max(0, Number(input.truckRatio) || 0),
        carRatio: Math.max(0, Number(input.carRatio) || 0),
        motorcycleRatio: Math.max(0, Number(input.motorcycleRatio) || 0)
      };
      const sum = base.truckRatio + base.carRatio + base.motorcycleRatio;
      if (sum <= 0) return { truckRatio: 0.18, carRatio: 0.68, motorcycleRatio: 0.14 };
      return {
        truckRatio: base.truckRatio / sum,
        carRatio: base.carRatio / sum,
        motorcycleRatio: base.motorcycleRatio / sum
      };
    }

    function update(next) {
      const merged = Object.assign({}, cfg, next || {});
      const normalized = normalizeRatios(merged);
      cfg.vehiclesPerMinute = clamp(Number(merged.vehiclesPerMinute) || 38, 5, 180);
      cfg.truckRatio = normalized.truckRatio;
      cfg.carRatio = normalized.carRatio;
      cfg.motorcycleRatio = normalized.motorcycleRatio;
      cfg.weather = merged.weather || cfg.weather;
      cfg.timeOfDay = merged.timeOfDay || cfg.timeOfDay;
      cfg.trafficDensity = clamp(Number(merged.trafficDensity) || cfg.trafficDensity, 0.1, 1);
      cfg.speedLimitKmh = clamp(Number(merged.speedLimitKmh) || cfg.speedLimitKmh, 30, 140);
      return snapshot();
    }

    function generateStream(minutes, override) {
      const active = update(override || {});
      const rows = [];
      const totalMinutes = Math.max(1, Number(minutes) || 30);
      for (let i = 0; i < totalMinutes; i += 1) {
        const dayFactor = active.timeOfDay === 'peak' ? 1.22 : (active.timeOfDay === 'night' ? 0.74 : 1);
        const noise = 0.84 + (Math.random() * 0.34);
        const vehicleCount = Math.max(0, Math.round(active.vehiclesPerMinute * dayFactor * active.trafficDensity * noise));
        const weatherFactor = WEATHER_SPEED_FACTOR[active.weather] || 1;
        const avgSpeed = clamp((active.speedLimitKmh * weatherFactor) - (active.trafficDensity * 22) + ((Math.random() - 0.5) * 8), 18, active.speedLimitKmh);

        rows.push({
          timestamp: new Date(Date.now() + (i * 60000)).toISOString(),
          vehicleCount,
          avgSpeed: Number(avgSpeed.toFixed(2)),
          weather: active.weather,
          roadCondition: buildRoadCondition(active.weather)
        });
      }
      return rows;
    }

    function influenceFromDataset(dataset) {
      const rows = Array.isArray(dataset) ? dataset : [];
      if (!rows.length) {
        return {
          spawnRatePerSecond: Number((cfg.vehiclesPerMinute / 60).toFixed(3)),
          trafficDensity: cfg.trafficDensity,
          speedLimitKmh: cfg.speedLimitKmh,
          weather: cfg.weather,
          roadCondition: buildRoadCondition(cfg.weather)
        };
      }

      const avgVehicleCount = rows.reduce((sum, row) => sum + (Number(row.vehicleCount) || 0), 0) / rows.length;
      const avgSpeed = rows.reduce((sum, row) => sum + (Number(row.avgSpeed) || 0), 0) / rows.length;
      const weather = rows[rows.length - 1].weather || cfg.weather;

      return {
        spawnRatePerSecond: Number((avgVehicleCount / 60).toFixed(3)),
        trafficDensity: clamp(avgVehicleCount / 80, 0.1, 1),
        speedLimitKmh: clamp(avgSpeed, 25, 140),
        weather,
        roadCondition: buildRoadCondition(weather)
      };
    }

    function snapshot() {
      return {
        vehiclesPerMinute: cfg.vehiclesPerMinute,
        truckRatio: Number(cfg.truckRatio.toFixed(3)),
        carRatio: Number(cfg.carRatio.toFixed(3)),
        motorcycleRatio: Number(cfg.motorcycleRatio.toFixed(3)),
        weather: cfg.weather,
        timeOfDay: cfg.timeOfDay,
        trafficDensity: Number(cfg.trafficDensity.toFixed(3)),
        speedLimitKmh: cfg.speedLimitKmh
      };
    }

    return {
      update,
      snapshot,
      generateStream,
      influenceFromDataset
    };
  }

  global.HighwayDataCalibration = { createCalibrationSystem };
})(window);
