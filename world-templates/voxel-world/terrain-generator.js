(function (global) {
  'use strict';

  function seededNoise(seed, x, y) {
    const val = Math.sin((x * 127.1) + (y * 311.7) + (seed * 0.0001)) * 43758.5453;
    return val - Math.floor(val);
  }

  function resolveBiome(height, noise) {
    if (height < 0.26) return 'river';
    if (height > 0.74) return 'hills';
    if (noise > 0.58) return 'forest';
    return 'plains';
  }

  function generateTerrain(options = {}) {
    const chunkSize = Number(options.chunkSize || 16);
    const mapSize = Number(options.mapSize || 48);
    const seed = Number(options.seed || 1337);
    const grid = [];
    const chunks = [];

    for (let y = 0; y < mapSize; y += 1) {
      const row = [];
      for (let x = 0; x < mapSize; x += 1) {
        const height = seededNoise(seed, x, y);
        const biome = resolveBiome(height, seededNoise(seed + 99, x, y));
        row.push({ x, y, height, biome, walkable: biome !== 'river' });
      }
      grid.push(row);
    }

    for (let y = 0; y < mapSize; y += chunkSize) {
      for (let x = 0; x < mapSize; x += chunkSize) {
        chunks.push({
          id: `chunk-${x}-${y}`,
          x,
          y,
          width: Math.min(chunkSize, mapSize - x),
          height: Math.min(chunkSize, mapSize - y)
        });
      }
    }

    return { seed, mapSize, chunkSize, grid, chunks };
  }

  global.VoxelWorldTerrain = {
    generateTerrain,
    resolveBiome
  };
})(window);
