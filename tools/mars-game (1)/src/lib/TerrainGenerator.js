/**
 * TerrainGenerator — deterministic Mars basalt metadata.
 *
 * Keeps terrain values stable by deriving every property from axial
 * coordinates. The renderer can combine this generated data with authored
 * terrain.json entries without changing the HexGrid coordinate model.
 */
(function (global) {
  'use strict';

  const DEFAULT_TERRAIN = 'basalt';

  function fract(value) {
    return value - Math.floor(value);
  }

  function hash(q, r, salt = 0) {
    const n = (q * 73856093) ^ (r * 19349663) ^ (salt * 83492791);
    return fract(Math.sin(n) * 10000);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  class TerrainGenerator {
    constructor(options = {}) {
      this.baseComplexity = Number.isFinite(options.baseComplexity) ? options.baseComplexity : 4.2;
      this.complexitySpread = Number.isFinite(options.complexitySpread) ? options.complexitySpread : 3.4;
    }

    generate(q, r, authored = {}) {
      const roughness = hash(q, r, 1);
      const hazardRoll = hash(q, r, 2);
      const apxsRoll = hash(q, r, 3);
      const energyRoll = hash(q, r, 4);

      const hazardType = hazardRoll > 0.78
        ? 'dust'
        : hazardRoll > 0.62
          ? 'thermal'
          : hazardRoll > 0.47
            ? 'rock'
            : null;

      const generated = {
        terrain: DEFAULT_TERRAIN,
        complexity: Number(clamp(this.baseComplexity + roughness * this.complexitySpread, 3.2, 8.9).toFixed(1)),
        hazardType,
        hazardFlags: hazardType ? [hazardType] : [],
        apxsContact: apxsRoll > 0.72,
        energy: Math.round(52 + energyRoll * 43),
        basaltNoise: Number(roughness.toFixed(3)),
        rems: {
          tempC: Math.round(-73 + hash(q, r, 5) * 41),
          pressureKpa: Number((0.58 + hash(q, r, 6) * 0.32).toFixed(2)),
          windMs: Number((2.2 + hash(q, r, 7) * 8.5).toFixed(1)),
          radiation: Number((0.18 + hash(q, r, 8) * 0.34).toFixed(2))
        }
      };

      return Object.assign(generated, authored || {}, {
        hazardFlags: authored && Array.isArray(authored.hazardFlags)
          ? authored.hazardFlags
          : generated.hazardFlags
      });
    }
  }

  global.TerrainGenerator = TerrainGenerator;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TerrainGenerator, hash };
  }
})(typeof window !== 'undefined' ? window : globalThis);
