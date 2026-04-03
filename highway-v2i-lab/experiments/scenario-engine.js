(function (global) {
  'use strict';

  const PRESETS = {
    'heavy rain': {
      eventType: 'weather',
      duration: 60,
      parameters: { speedFactor: 0.72, weather: 'heavy-rain' }
    },
    'traffic accident': {
      eventType: 'incident',
      duration: 45,
      parameters: { blockedLane: 1, congestionBoost: 0.18 }
    },
    'sensor failure': {
      eventType: 'infrastructure',
      duration: 35,
      parameters: { sensorConfidenceDrop: 0.35, latencyPenalty: 10 }
    },
    'festival traffic spike': {
      eventType: 'demand',
      duration: 80,
      parameters: { densityMultiplier: 1.4, spawnRateBoost: 0.4 }
    },
    'ambulance emergency': {
      eventType: 'emergency',
      duration: 30,
      parameters: { emergencyVehicle: true, priorityRouting: true, emergencyLane: 2 }
    }
  };

  function createScenarioEngine() {
    const timeline = [];

    function normalizeScenario(input, index) {
      const given = input || {};
      const preset = PRESETS[given.name] || {};
      return {
        name: given.name || `scenario-${index + 1}`,
        triggerTime: Math.max(0, Number(given.triggerTime) || 0),
        eventType: given.eventType || preset.eventType || 'custom',
        duration: Math.max(5, Number(given.duration) || preset.duration || 30),
        parameters: Object.assign({}, preset.parameters || {}, given.parameters || {})
      };
    }

    function loadScenarios(scenarios) {
      timeline.length = 0;
      (Array.isArray(scenarios) ? scenarios : []).forEach((entry, idx) => {
        timeline.push(normalizeScenario(entry, idx));
      });
      timeline.sort((a, b) => a.triggerTime - b.triggerTime);
      return timeline.slice();
    }

    function activeScenarios(elapsedTicks) {
      return timeline.filter((scenario) => (
        elapsedTicks >= scenario.triggerTime
        && elapsedTicks <= (scenario.triggerTime + scenario.duration)
      ));
    }

    function applyEffects(base, elapsedTicks) {
      const active = activeScenarios(elapsedTicks);
      const effects = {
        speedFactor: 1,
        blockedLane: null,
        congestionBoost: 0,
        sensorConfidenceDrop: 0,
        latencyPenalty: 0,
        densityMultiplier: 1,
        spawnRateBoost: 0,
        emergencyVehicle: false,
        priorityRouting: false,
        emergencyLane: null,
        weather: base.weather || 'clear'
      };

      active.forEach((scenario) => {
        const params = scenario.parameters || {};
        if (params.speedFactor != null) effects.speedFactor = Math.min(effects.speedFactor, Number(params.speedFactor));
        if (params.blockedLane != null) effects.blockedLane = Number(params.blockedLane);
        if (params.congestionBoost != null) effects.congestionBoost += Number(params.congestionBoost);
        if (params.sensorConfidenceDrop != null) effects.sensorConfidenceDrop += Number(params.sensorConfidenceDrop);
        if (params.latencyPenalty != null) effects.latencyPenalty += Number(params.latencyPenalty);
        if (params.densityMultiplier != null) effects.densityMultiplier *= Number(params.densityMultiplier);
        if (params.spawnRateBoost != null) effects.spawnRateBoost += Number(params.spawnRateBoost);
        if (params.emergencyVehicle) effects.emergencyVehicle = true;
        if (params.priorityRouting) effects.priorityRouting = true;
        if (params.emergencyLane != null) effects.emergencyLane = Number(params.emergencyLane);
        if (params.weather) effects.weather = params.weather;
      });

      return { active, effects };
    }

    return {
      loadScenarios,
      activeScenarios,
      applyEffects,
      presets: Object.assign({}, PRESETS)
    };
  }

  global.HighwayScenarioEngine = { createScenarioEngine };
})(window);
