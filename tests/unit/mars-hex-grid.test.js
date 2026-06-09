/**
 * Unit tests for tools/mars-game/src/lib/HexGrid.js.
 * Covers coordinate math needed by the Task 2 rover controller.
 */

const { HexGrid } = require('../../tools/mars-game/src/lib/HexGrid.js');
const { TerrainGenerator } = require('../../tools/mars-game/src/lib/TerrainGenerator.js');

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${label}`);
    failed++;
  }
}

console.log('\n── Mars HexGrid ──');

const grid = new HexGrid({
  radius: 2,
  hexSize: 50,
  centerX: 320,
  centerY: 240,
  terrainGenerator: new TerrainGenerator()
});

console.log('\ncoordinate conversion');
for (const hex of grid.getAllHexes()) {
  const pixel = grid.axialToPixel(hex.q, hex.r);
  const axial = grid.pixelToAxial(pixel.x, pixel.y);
  assert(`round trip ${hex.q},${hex.r}`, axial.q === hex.q && axial.r === hex.r);
}

console.log('\nneighbors and distance');
assert('interior center hex has exactly 6 neighbors', grid.getNeighbors(0, 0).length === 6);
assert('edge hex has fewer than 6 neighbors', grid.getNeighbors(2, 0).length < 6);
assert('distance from center to center is 0', grid.distance(0, 0, 0, 0) === 0);
assert('distance from 0,0 to 2,-1 is 2', grid.distance(0, 0, 2, -1) === 2);
assert('distance is symmetric', grid.distance(-1, 1, 2, -1) === grid.distance(2, -1, -1, 1));

console.log('\npan and zoom consistency');
const centerBefore = grid.axialToPixel(0, 0);
grid.pan(25, -10);
const centerAfterPan = grid.axialToPixel(0, 0);
assert('pan updates center x/y consistently', centerAfterPan.x === centerBefore.x + 25 && centerAfterPan.y === centerBefore.y - 10);

const originHexBeforeZoom = grid.getHexAtPixel(centerAfterPan.x, centerAfterPan.y);
grid.zoom(1.25, centerAfterPan.x, centerAfterPan.y);
const originHexAfterZoom = grid.getHexAtPixel(centerAfterPan.x, centerAfterPan.y);
assert('zoom keeps origin hex stable under cursor', originHexBeforeZoom && originHexAfterZoom && originHexBeforeZoom.key() === originHexAfterZoom.key());
assert('zoom changes hex size', grid.hexSize === 62.5);

console.log('\ngrid generation');
const taskOneGrid = new HexGrid({ radius: 1, terrainGenerator: new TerrainGenerator() });
assert('radius 1 Task 1 grid creates 7 visible hexes', taskOneGrid.getAllHexes().length === 7);
assert('terrain generator supports decimal complexity values', taskOneGrid.getAllHexes().some((hex) => Number.isFinite(hex.complexity) && !Number.isInteger(hex.complexity)));
assert('terrain generator stores complexity at one-decimal precision', taskOneGrid.getAllHexes().every((hex) => Number.isFinite(hex.complexity) && Number.isInteger(hex.complexity * 10)));

module.exports = { passed, failed };
