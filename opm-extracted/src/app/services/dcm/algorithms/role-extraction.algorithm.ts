// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/dcm/algorithms/role-extraction.algorithm.ts
// Extracted by opm-extracted/tools/extract.mjs

let RoleExtractionAlgorithm = /*#__PURE__*/(() => {
  class RoleExtractionAlgorithm {
    /**
     * Extract roles from Agent links
     * Derive roles ONLY from Agent links.
     * If no Agent links exist, leave roles empty.
     * No stereotype-based role mapping.
     *
     * Enhanced to traverse generalization hierarchy (Gap 1 fix)
     */
    extractRoles(scopedSubgraph, canonicalOPM) {
      const roles = [];
      const roleMap = new Map(); // Map by object ID to avoid duplicates
      const processedObjectIds = new Set();
      // Find all agent links
      const agentRelations = scopedSubgraph.relations.filter(rel => rel.type === "agent");
      // DEBUG: Log agent relations found
      agentRelations.forEach(rel => {
        // Process agent links
      });
      // Group by agent object
      const agentObjectIds = new Set();
      agentRelations.forEach(rel => {
        agentObjectIds.add(rel.sourceId);
      });
      // For each agent object, get its generalization hierarchy
      agentObjectIds.forEach(agentObjectId => {
        const hierarchy = this.getGeneralizationHierarchy(agentObjectId, canonicalOPM);
        // Extract roles for all objects in hierarchy that have agent links
        hierarchy.forEach(objectId => {
          if (processedObjectIds.has(objectId)) {
            return;
          }
          // Check if this object has agent links (in scoped subgraph OR in full canonical OPM)
          // This ensures we find agent objects even if the relation is to an inzoomed process
          const hasAgentLinksInScope = agentRelations.some(rel => rel.sourceId === objectId);
          const hasAgentLinksInCanonical = canonicalOPM.relations.some(rel => rel.type === "agent" && rel.sourceId === objectId);
          const hasAgentLinks = hasAgentLinksInScope || hasAgentLinksInCanonical;
          if (hasAgentLinks) {
            const agentObject = canonicalOPM.objects.find(obj => obj.id === objectId);
            if (agentObject && !roleMap.has(agentObject.id)) {
              const role = {
                id: this.generateId("role", agentObject.id),
                name: agentObject.name,
                sourceObjectId: agentObject.id
              };
              roles.push(role);
              roleMap.set(agentObject.id, role);
              processedObjectIds.add(objectId);
            }
          }
        });
      });
      return roles;
    }
    /**
     * Get all objects in generalization hierarchy (parents and children)
     * Gap 1: Traverse generalization hierarchy to find all related objects
     */
    getGeneralizationHierarchy(objectId, canonicalOPM, visited = new Set()) {
      if (visited.has(objectId)) {
        return []; // Already visited, prevent infinite loops
      }
      visited.add(objectId);
      const hierarchy = [objectId];
      // Find parents (generals) - sourceId is specific, targetId is general
      const parents = canonicalOPM.relations.filter(rel => rel.type === "generalization" && rel.sourceId === objectId).map(rel => rel.targetId);
      parents.forEach(parentId => {
        if (!visited.has(parentId)) {
          // Recursively get parent's parents
          const parentHierarchy = this.getGeneralizationHierarchy(parentId, canonicalOPM, visited);
          hierarchy.push(...parentHierarchy);
        }
      });
      // Find children (specializations) - sourceId is specific, targetId is general
      const children = canonicalOPM.relations.filter(rel => rel.type === "generalization" && rel.targetId === objectId).map(rel => rel.sourceId);
      children.forEach(childId => {
        if (!visited.has(childId)) {
          // Recursively get child's children
          const childHierarchy = this.getGeneralizationHierarchy(childId, canonicalOPM, visited);
          hierarchy.push(...childHierarchy);
        }
      });
      return hierarchy;
    }
    generateId(prefix, baseId) {
      return `${prefix}_${baseId}`;
    }
    static #_ = (() => this.ɵfac = function RoleExtractionAlgorithm_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || RoleExtractionAlgorithm)();
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: RoleExtractionAlgorithm,
      factory: RoleExtractionAlgorithm.ɵfac,
      providedIn: "root"
    }))();
  }
  return RoleExtractionAlgorithm;
})();