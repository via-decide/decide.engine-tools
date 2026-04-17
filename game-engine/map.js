(function (global) {
  'use strict';

  const LAYERS = ['world', 'city', 'building'];

  class GameMap {
    constructor(config = {}) {
      this.regionSize = config.regionSize || 800;
      this.regionsWide = config.regionsWide || 8;
      this.regionsHigh = config.regionsHigh || 8;
      this.totalWidth = this.regionsWide * this.regionSize;
      this.totalHeight = this.regionsHigh * this.regionSize;
      this.layers = LAYERS;

      this.regions = [];
      for (let y = 0; y < this.regionsHigh; y += 1) {
        for (let x = 0; x < this.regionsWide; x += 1) {
          this.regions.push({
            id: `region-${x}-${y}`,
            x,
            y,
            discovered: x === 0 && y === 0,
            unlocked: x === 0 && y === 0,
            missionCleared: x === 0 && y === 0,
            cityBlocks: this.createCityBlocks(x, y)
          });
        }
      }
    }

    createCityBlocks(regionX, regionY) {
      const blocks = [];
      const rows = 6;
      const cols = 6;
      const blockSize = this.regionSize / rows;

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          blocks.push({
            id: `block-${regionX}-${regionY}-${x}-${y}`,
            x,
            y,
            size: blockSize,
            buildingUnlocked: x === 0 && y === 0
          });
        }
      }
      return blocks;
    }

    getRegionByWorldPos(x, y) {
      const rx = Math.floor(x / this.regionSize);
      const ry = Math.floor(y / this.regionSize);
      return this.regions.find((region) => region.x === rx && region.y === ry) || null;
    }

    getLayerName(zoomLevel) {
      return this.layers[Math.max(0, Math.min(zoomLevel, this.layers.length - 1))];
    }

    unlockAdjacentRegions(region) {
      if (!region) return;
      const offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      offsets.forEach(([dx, dy]) => {
        const next = this.regions.find((entry) => entry.x === region.x + dx && entry.y === region.y + dy);
        if (next && !next.unlocked) {
          next.unlocked = true;
        }
      });
    }
  }

  global.GameMap = GameMap;
})(window);
