const fs = require('fs');
const path = require('path');

const VALID_CATEGORIES = new Set(['visual', 'audio', 'interaction', 'timing', 'rendering']);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function defaultArtifacts() {
  return {
    screenshots: [],
    videos: [],
    audio: []
  };
}

function slugify(value) {
  return String(value || 'experiment').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 48) || 'experiment';
}

function createExperimentId(name, createdAt = Date.now()) {
  return `exp-${createdAt}-${slugify(name)}`;
}

function normalizeExperiment(input) {
  const now = Date.now();
  const createdAt = Number.isFinite(input.createdAt) ? input.createdAt : now;
  const experiment = {
    id: input.id || createExperimentId(input.name, createdAt),
    name: input.name || 'Untitled Experiment',
    category: input.category,
    constraint: input.constraint || '',
    description: input.description || '',
    createdAt,
    tags: Array.isArray(input.tags) ? input.tags : [],
    artifacts: {
      ...defaultArtifacts(),
      ...(input.artifacts || {})
    },
    notes: input.notes || '',
    emotionalResponse: input.emotionalResponse || '',
    observations: Array.isArray(input.observations) ? input.observations : []
  };

  if (!VALID_CATEGORIES.has(experiment.category)) {
    throw new Error(`Invalid category: ${experiment.category}`);
  }

  return experiment;
}

class ExperimentRegistry {
  constructor(baseDir) {
    this.baseDir = baseDir;
    this.experimentsDir = path.join(baseDir, 'experiments');
    this.indexPath = path.join(this.experimentsDir, 'index.json');
    ensureDir(this.experimentsDir);
    if (!fs.existsSync(this.indexPath)) {
      fs.writeFileSync(this.indexPath, JSON.stringify({ experiments: [] }, null, 2));
    }
  }

  readIndex() {
    return JSON.parse(fs.readFileSync(this.indexPath, 'utf8'));
  }

  writeIndex(index) {
    fs.writeFileSync(this.indexPath, JSON.stringify(index, null, 2));
  }

  create(experimentInput) {
    const experiment = normalizeExperiment(experimentInput);
    const experimentDir = path.join(this.experimentsDir, experiment.id);
    ensureDir(experimentDir);

    fs.writeFileSync(path.join(experimentDir, 'experiment.json'), JSON.stringify(experiment, null, 2));

    const index = this.readIndex();
    index.experiments = index.experiments.filter((item) => item.id !== experiment.id);
    index.experiments.push({
      id: experiment.id,
      name: experiment.name,
      category: experiment.category,
      createdAt: experiment.createdAt,
      tags: experiment.tags
    });
    index.experiments.sort((a, b) => b.createdAt - a.createdAt);
    this.writeIndex(index);

    return experiment;
  }

  list() {
    return this.readIndex().experiments;
  }

  getById(id) {
    const filePath = path.join(this.experimentsDir, id, 'experiment.json');
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
}

module.exports = {
  ExperimentRegistry,
  VALID_CATEGORIES,
  createExperimentId,
  normalizeExperiment
};
