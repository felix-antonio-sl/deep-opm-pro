// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/dcm/algorithms/graph-builder.algorithm.ts
// Extracted by opm-extracted/tools/extract.mjs

let GraphBuilderAlgorithm = /*#__PURE__*/(() => {
  class GraphBuilderAlgorithm {
    /**
     * Build graph structure and refinement tree
     */
    buildGraph(canonicalOPM) {
      const vertices = new Set();
      const edges = new Map();
      const refinementTree = new Map();
      // Add all vertices
      canonicalOPM.objects.forEach(obj => {
        vertices.add(obj.id);
        obj.states.forEach(state => vertices.add(state.id));
      });
      canonicalOPM.processes.forEach(proc => vertices.add(proc.id));
      canonicalOPM.states.forEach(state => vertices.add(state.id));
      // Build edges from relations
      canonicalOPM.relations.forEach(rel => {
        if (!edges.has(rel.sourceId)) {
          edges.set(rel.sourceId, new Set());
        }
        edges.get(rel.sourceId).add(rel.targetId);
      });
      // Build refinement tree from process hierarchy
      canonicalOPM.processes.forEach(proc => {
        if (proc.childrenProcessIds && proc.childrenProcessIds.length > 0) {
          refinementTree.set(proc.id, proc.childrenProcessIds);
        }
      });
      return {
        vertices,
        edges,
        refinementTree
      };
    }
    static #_ = (() => this.ɵfac = function GraphBuilderAlgorithm_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || GraphBuilderAlgorithm)();
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: GraphBuilderAlgorithm,
      factory: GraphBuilderAlgorithm.ɵfac,
      providedIn: "root"
    }))();
  }
  return GraphBuilderAlgorithm;
})();