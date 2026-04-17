(function (global) {
  'use strict';

  class World {
    constructor(map) {
      this.map = map;
      this.buildings = [];
      this.missions = [];
      this.generateWorld();
      this.generateMissions();
    }

    generateWorld() {
      this.map.regions.forEach((region) => {
        const regionOriginX = region.x * this.map.regionSize;
        const regionOriginY = region.y * this.map.regionSize;
        region.cityBlocks.forEach((block) => {
          const roadInset = block.size * 0.2;
          this.buildings.push({
            id: `${region.id}-${block.id}`,
            regionId: region.id,
            x: regionOriginX + block.x * block.size + roadInset,
            y: regionOriginY + block.y * block.size + roadInset,
            w: block.size * 0.6,
            h: block.size * 0.6,
            locked: !block.buildingUnlocked
          });
        });
      });
    }

    generateMissions() {
      this.map.regions.forEach((region, index) => {
        this.missions.push({
          id: `mission-${region.id}`,
          title: `Secure ${region.id}`,
          regionId: region.id,
          threshold: 1 + (index % 3),
          completed: region.missionCleared
        });
      });
    }

    collides(x, y, radius) {
      return this.buildings.some((building) => {
        if (building.locked) return false;
        const withinX = x + radius > building.x && x - radius < building.x + building.w;
        const withinY = y + radius > building.y && y - radius < building.y + building.h;
        return withinX && withinY;
      });
    }

    update(player) {
      const region = this.map.getRegionByWorldPos(player.x, player.y);
      if (!region) return null;

      if (!region.discovered) {
        region.discovered = true;
      }

      const mission = this.missions.find((entry) => entry.regionId === region.id);
      if (mission && !mission.completed) {
        mission.threshold -= 0.007;
        if (mission.threshold <= 0) {
          mission.completed = true;
          region.missionCleared = true;
          player.grantMissionReward();
          this.map.unlockAdjacentRegions(region);

          this.buildings
            .filter((building) => building.regionId === region.id)
            .forEach((building, idx) => {
              if (idx % 2 === 0) {
                building.locked = false;
              }
            });
        }
      }

      return {
        region,
        mission,
        unlockedRegions: this.map.regions.filter((entry) => entry.unlocked).length
      };
    }
  }

  global.World = World;
})(window);
