// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/dcm/algorithms/scope-subgraph.algorithm.ts
// Extracted by opm-extracted/tools/extract.mjs

let ScopeSubgraphAlgorithm = /*#__PURE__*/(() => {
  class ScopeSubgraphAlgorithm {
    /**
     * Scope subgraph for root process P0
     * Returns all processes reachable via refinement under P0,
     * all procedural relations involving those processes,
     * and all objects touched by those relations
     */
    scopeSubgraph(rootProcessId, canonicalOPM, graph) {
      // Step 1: Find all processes reachable via refinement under P0
      let reachableProcessIds = this.getReachableProcesses(rootProcessId, graph.refinementTree);
      // FALLBACK: If root has no children but refinement tree has other processes,
      // include ALL processes in the model (for flat models where root is not the hierarchy root)
      if (reachableProcessIds.size === 1 && graph.refinementTree.size > 0) {
        const allProcessIds = new Set(canonicalOPM.processes.map(p => p.id));
        reachableProcessIds = allProcessIds;
      }
      // Step 2: Get all processes
      const processes = canonicalOPM.processes.filter(p => reachableProcessIds.has(p.id));
      // Step 3: Get all procedural relations involving these processes
      const proceduralRelationTypes = ["agent", "instrument", "consumption", "effect", "result"];
      const relations = canonicalOPM.relations.filter(rel => proceduralRelationTypes.includes(rel.type) && (reachableProcessIds.has(rel.sourceId) || reachableProcessIds.has(rel.targetId)));
      // Step 4: Get all objects touched by these relations
      const objectIds = new Set();
      relations.forEach(rel => {
        // Check if source or target is an object
        const sourceObj = canonicalOPM.objects.find(o => o.id === rel.sourceId);
        const targetObj = canonicalOPM.objects.find(o => o.id === rel.targetId);
        if (sourceObj) {
          objectIds.add(rel.sourceId);
        }
        if (targetObj) {
          objectIds.add(rel.targetId);
        }
        // Also check if source or target is a state (then get parent object)
        const sourceState = canonicalOPM.states.find(s => s.id === rel.sourceId);
        const targetState = canonicalOPM.states.find(s => s.id === rel.targetId);
        if (sourceState) {
          const parentObj = canonicalOPM.objects.find(o => o.id === sourceState.objectId);
          if (parentObj) {
            objectIds.add(parentObj.id);
          }
        }
        if (targetState) {
          const parentObj = canonicalOPM.objects.find(o => o.id === targetState.objectId);
          if (parentObj) {
            objectIds.add(parentObj.id);
          }
        }
      });
      // Step 5: Remove objects only referenced via structural relations
      // (Keep only objects that participate in procedural links)
      const finalObjectIds = Array.from(objectIds).filter(objId => {
        // Check if this object has any procedural relations
        return relations.some(rel => rel.sourceId === objId || rel.targetId === objId || canonicalOPM.states.some(s => s.objectId === objId && (s.id === rel.sourceId || s.id === rel.targetId)));
      });
      return {
        processes,
        objects: finalObjectIds,
        relations
      };
    }
    /**
     * Get all processes reachable via refinement tree from root
     * If root has no children, include ALL processes in the model (fallback for flat models)
     */
    getReachableProcesses(rootProcessId, refinementTree) {
      const reachable = new Set([rootProcessId]);
      const queue = [rootProcessId];
      while (queue.length > 0) {
        const currentId = queue.shift();
        const children = refinementTree.get(currentId) || [];
        children.forEach(childId => {
          if (!reachable.has(childId)) {
            reachable.add(childId);
            queue.push(childId);
          }
        });
      }
      return reachable;
    }
    static #_ = (() => this.ɵfac = function ScopeSubgraphAlgorithm_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ScopeSubgraphAlgorithm)();
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: ScopeSubgraphAlgorithm,
      factory: ScopeSubgraphAlgorithm.ɵfac,
      providedIn: "root"
    }))();
  }
  return ScopeSubgraphAlgorithm;
})();