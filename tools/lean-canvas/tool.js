const { generateCanvas } = require('./shared/canvas-utils');

function buildLeanCanvas() {
  try {
    const canvasData = generateCanvas();
    return canvasData;
  } catch (error) {
    console.error('Error building Lean Canvas:', error);
    throw new Error('Failed to build Lean Canvas');
  }
}

module.exports = {
  buildLeanCanvas,
};