const fs = require('fs');
const path = require('path');

module.exports = {
  saveArtifact: async (artifactName, artifactData) => {
    const artifactsDir = path.join(__dirname, '../artifacts');
    if (!fs.existsSync(artifactsDir)) {
      try {
        await fs.promises.mkdir(artifactsDir);
      } catch (err) {
        console.error(`Failed to create directory: ${err}`);
        throw err;
      }
    }
    try {
      await fs.promises.writeFile(path.join(artifactsDir, `${artifactName}.json`), JSON.stringify(artifactData));
    } catch (err) {
      console.error(`Failed to write file: ${err}`);
      throw err;
    }
  },
};