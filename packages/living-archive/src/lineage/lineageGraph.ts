export type LineageEdge = {
  parentId: string;
  childId: string;
  mutationType?: string;
  constraintDelta?: string[];
};

export class LineageGraph {
  private edges: LineageEdge[] = [];

  addEdge(edge: LineageEdge) {
    this.edges.push(edge);
  }

  getChildren(parentId: string) {
    return this.edges.filter((e) => e.parentId === parentId).map((e) => e.childId);
  }

  getParents(childId: string) {
    return this.edges.filter((e) => e.childId === childId).map((e) => e.parentId);
  }

  listEdges() {
    return [...this.edges];
  }
}
