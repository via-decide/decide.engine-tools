const fs = require('fs');
const path = require('path');

function saveArtifact(artifactName, artifactData) {
  const filePath = path.join(__dirname, `${artifactName}.json`);
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(artifactData, null, 2));
  } catch (error) {
    console.error(`Error saving artifact ${artifactName}:`, error);
    throw error;
  }
}

module.exports = { saveArtifact };