export type ConstraintConfig = {
  rendering?: { monochrome?: boolean; scanlines?: boolean; palette?: string[]; tileSize?: number };
  movement?: { inertia?: number; acceleration?: number; snapToGrid?: boolean; latencyMs?: number };
  audio?: { waveform?: 'square' | 'triangle' | 'noise'; bitDepth?: number; sampleRate?: number };
};

export class ConstraintStudioRuntime {
  private base: ConstraintConfig = {};
  private layers: Array<{ id: string; config: ConstraintConfig }> = [];

  setBase(config: ConstraintConfig) { this.base = config; }
  setConfig(config: ConstraintConfig) { this.base = config; }

  applyLayer(id: string, config: ConstraintConfig) {
    this.layers = this.layers.filter((l) => l.id !== id);
    this.layers.push({ id, config });
  }

  removeLayer(id: string) {
    this.layers = this.layers.filter((l) => l.id !== id);
  }

  resolveConfig(): ConstraintConfig {
    return this.layers.reduce((acc, layer) => mergeConfig(acc, layer.config), this.base);
  }
}

function mergeConfig(a: ConstraintConfig, b: ConstraintConfig): ConstraintConfig {
  return {
    rendering: { ...(a.rendering || {}), ...(b.rendering || {}) },
    movement: { ...(a.movement || {}), ...(b.movement || {}) },
    audio: { ...(a.audio || {}), ...(b.audio || {}) }
  };
}
