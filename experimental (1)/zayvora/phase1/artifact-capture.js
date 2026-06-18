const fs = require('fs');
const path = require('path');

function ensureArtifactDirs(baseDir) {
  const roots = ['screenshots', 'clips', 'gifs', 'audio', 'comparisons'];
  const artifactsRoot = path.join(baseDir, 'artifacts');
  for (const folder of roots) {
    fs.mkdirSync(path.join(artifactsRoot, folder), { recursive: true });
  }
  return artifactsRoot;
}

function captureScreenshot({ baseDir, experimentId, frame, pngBuffer }) {
  const artifactsRoot = ensureArtifactDirs(baseDir);
  const filename = `${experimentId}-f${String(frame).padStart(6, '0')}.png`;
  const filePath = path.join(artifactsRoot, 'screenshots', filename);
  fs.writeFileSync(filePath, pngBuffer);
  return filePath;
}

module.exports = { ensureArtifactDirs, captureScreenshot };
