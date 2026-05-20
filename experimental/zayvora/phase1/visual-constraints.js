function monochrome(value, threshold = 127) {
  return value >= threshold ? 255 : 0;
}

function bayerDither(value, x, y) {
  const bayer2x2 = [
    [0, 2],
    [3, 1]
  ];
  const threshold = (bayer2x2[y % 2][x % 2] + 0.5) * 64;
  return value >= threshold ? 255 : 0;
}

function tileGrid(width, height, tileSize, tileFn) {
  const cols = Math.ceil(width / tileSize);
  const rows = Math.ceil(height / tileSize);
  const tiles = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      tiles.push({
        x,
        y,
        value: tileFn ? tileFn(x, y) : 0
      });
    }
  }

  return { cols, rows, tileSize, tiles };
}

function scanlineMask(y, intensity = 0.25) {
  return y % 2 === 0 ? 1 : Math.max(0, 1 - intensity);
}

module.exports = {
  monochrome,
  bayerDither,
  tileGrid,
  scanlineMask
};
