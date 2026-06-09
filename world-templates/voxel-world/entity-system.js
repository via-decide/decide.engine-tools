(function (global) {
  'use strict';

  function randomCell(terrain, index) {
    const mapSize = terrain.mapSize || 1;
    const x = (index * 7) % mapSize;
    const y = (index * 11) % mapSize;
    return terrain.grid[y][x];
  }

  function spawnStarterEntities(terrain) {
    const entities = [];

    for (let i = 0; i < 6; i += 1) {
      const cell = randomCell(terrain, i + 1);
      entities.push({ id: `animal-${i}`, type: 'animal', x: cell.x, y: cell.y, energy: 100 });
    }

    for (let i = 0; i < 12; i += 1) {
      const cell = randomCell(terrain, i + 13);
      entities.push({ id: `resource-${i}`, type: 'resource', x: cell.x, y: cell.y, kind: i % 2 ? 'wood' : 'stone' });
    }

    entities.push({ id: 'structure-0', type: 'structure', x: 4, y: 4, kind: 'camp' });
    return entities;
  }

  function updateEntities(entities, terrain, tick) {
    let lastEvent = '';
    const updated = entities.map((entity) => {
      if (entity.type !== 'animal') return entity;

      const dx = tick % 2 === 0 ? 1 : -1;
      const nextX = (entity.x + dx + terrain.mapSize) % terrain.mapSize;
      const nextCell = terrain.grid[entity.y][nextX];
      if (!nextCell.walkable) return entity;

      return {
        ...entity,
        x: nextX,
        energy: Math.max(0, entity.energy - 0.4)
      };
    });

    if (tick % 5 === 0) {
      lastEvent = 'Animals migrated to a nearby chunk.';
    }

    return { entities: updated, lastEvent };
  }

  global.VoxelWorldEntities = {
    spawnStarterEntities,
    updateEntities
  };
})(window);
