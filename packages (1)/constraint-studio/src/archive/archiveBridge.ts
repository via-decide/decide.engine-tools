import { ExperimentArchiver } from '../../../living-archive/src/archive/archiveExperiment';

export function archiveVariant(archiveRoot: string, payload: {
  replay: unknown;
  notes: string;
  metadata: Record<string, unknown>;
  constraints: string[];
  parentId?: string;
}) {
  const archiver = new ExperimentArchiver(archiveRoot);
  return archiver.archiveExperiment({
    replay: payload.replay,
    notes: payload.notes,
    metadata: payload.metadata,
    constraints: payload.constraints,
    parentId: payload.parentId,
    screenshots: []
  });
}
