import { ExperimentArchiver } from '../../../living-archive/src/archive/archiveExperiment';

export function archiveSignalAsExperiment(archiveRoot: string, payload: {
  replay: unknown;
  notes: string;
  constraints: string[];
  metadata: Record<string, unknown>;
}) {
  const archiver = new ExperimentArchiver(archiveRoot);
  return archiver.archiveExperiment({
    replay: payload.replay,
    notes: payload.notes,
    constraints: payload.constraints,
    metadata: payload.metadata,
    screenshots: []
  });
}
