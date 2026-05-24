import type { ConstraintConfig } from '../runtime/constraintRuntime';
import { generateMutation } from '../mutations/generateMutation';

export type VariantNode = { id: string; parentId?: string; config: ConstraintConfig; mutationNotes: string[] };

export function createVariantTree(base: ConstraintConfig, depth = 2, branchFactor = 2): VariantNode[] {
  const nodes: VariantNode[] = [{ id: 'variant-root', config: base, mutationNotes: ['base'] }];
  let frontier = [nodes[0]];
  for (let d = 0; d < depth; d++) {
    const next: VariantNode[] = [];
    for (const parent of frontier) {
      for (let b = 0; b < branchFactor; b++) {
        const id = `${parent.id}-${d}-${b}`;
        const config = generateMutation(parent.config, 'weighted');
        const node = { id, parentId: parent.id, config, mutationNotes: [`mutation d${d} b${b}`] };
        nodes.push(node);
        next.push(node);
      }
    }
    frontier = next;
  }
  return nodes;
}
