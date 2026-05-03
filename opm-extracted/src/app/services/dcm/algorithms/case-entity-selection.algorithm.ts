// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/dcm/algorithms/case-entity-selection.algorithm.ts
// Extracted by opm-extracted/tools/extract.mjs

let CaseEntitySelectionAlgorithm = /*#__PURE__*/(() => {
  class CaseEntitySelectionAlgorithm {
    /**
     * Select case entity using simplified scoring
     * score(o) = w1*proceduralDegree(o) + w2*stateCount(o)
     * Default weights: w1 = 1.0, w2 = 0.5
     */
    selectCaseEntity(scopedSubgraph, canonicalOPM, weights = {
      w1: 1,
      w2: 0.5
    }) {
      const candidateObjects = canonicalOPM.objects.filter(obj => scopedSubgraph.objects.includes(obj.id));
      if (candidateObjects.length === 0) {
        return [];
      }
      // Calculate scores
      const scores = candidateObjects.map(obj => ({
        objectId: obj.id,
        score: this.calculateScore(obj, scopedSubgraph, canonicalOPM, weights)
      }));
      // Sort by score (descending)
      scores.sort((a, b) => b.score - a.score);
      // Return top-ranked object (only one case type per export)
      return [scores[0].objectId];
    }
    /**
     * Calculate score for an object
     */
    calculateScore(obj, scopedSubgraph, canonicalOPM, weights) {
      const proceduralDegree = this.getProceduralDegree(obj.id, scopedSubgraph);
      const stateCount = obj.states.length;
      return weights.w1 * proceduralDegree + weights.w2 * stateCount;
    }
    /**
     * Get procedural degree (number of procedural relations involving this object)
     */
    getProceduralDegree(objectId, scopedSubgraph) {
      let count = 0;
      scopedSubgraph.relations.forEach(rel => {
        // Check if relation involves this object directly
        if (rel.sourceId === objectId || rel.targetId === objectId) {
          count++;
        }
      });
      return count;
    }
    static #_ = (() => this.ɵfac = function CaseEntitySelectionAlgorithm_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CaseEntitySelectionAlgorithm)();
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: CaseEntitySelectionAlgorithm,
      factory: CaseEntitySelectionAlgorithm.ɵfac,
      providedIn: "root"
    }))();
  }
  return CaseEntitySelectionAlgorithm;
})();