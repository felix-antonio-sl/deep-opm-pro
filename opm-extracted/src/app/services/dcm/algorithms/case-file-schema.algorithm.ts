// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/dcm/algorithms/case-file-schema.algorithm.ts
// Extracted by opm-extracted/tools/extract.mjs

let CaseFileSchemaAlgorithm = /*#__PURE__*/(() => {
  class CaseFileSchemaAlgorithm {
    /**
     * Create case file schema and milestones
     */
    createCaseFileSchema(scopedSubgraph, canonicalOPM, milestonePolicy, agentObjectIds // IDs of objects that are agents (should be roles, not case file items)
    ) {
      const caseFileItems = [];
      const milestones = [];
      // Get objects from scoped subgraph
      const objects = canonicalOPM.objects.filter(obj => scopedSubgraph.objects.includes(obj.id));
      // Identify agent objects (objects with agent links) - these should be roles, NOT case file items
      const agentIds = agentObjectIds || this.getAgentObjectIds(scopedSubgraph, canonicalOPM);
      objects.forEach(obj => {
        // EXCLUDE agent objects from case file items - they are participants/roles, not data
        if (agentIds.includes(obj.id)) {
          return; // Skip this object - it's an agent, should be a role, not a case file item
        }
        // Create CaseFileItem for non-agent objects that participate in procedural links
        // If object has no states, states array is empty []
        const caseFileItem = {
          id: this.generateId("case-item", obj.id),
          objectId: obj.id,
          states: obj.isStateful ? obj.states.map(s => s.name) : [] // Empty array if stateless
        };
        caseFileItems.push(caseFileItem);
        // Create milestones per spec Section 4.4: Only for "decision-relevant" states
        // A state S becomes a Milestone if it is:
        // 1. a post-state (result/output) of some process AND referenced by another process as a precondition, OR
        // 2. an explicit goal/target state in the model, OR
        // 3. explicitly selected by user (wizard options) as "tracked outcome"
        if (obj.isStateful && milestonePolicy !== "none") {
          obj.states.forEach(state => {
            let shouldCreateMilestone = false;
            if (milestonePolicy === "all-states") {
              // User explicitly selected all states as tracked outcomes
              shouldCreateMilestone = true;
            } else if (milestonePolicy === "goal-states") {
              // Per spec Section 4.4: Only create milestones for decision-relevant states
              // Check if state is:
              // 1. Post-state of Result link AND referenced as precondition by another process
              const isPostState = this.isPostStateFromResultLinks(state.id, canonicalOPM);
              const isReferencedAsPrecondition = this.isStateReferencedAsPrecondition(state.id, canonicalOPM);
              const isDecisionRelevant = isPostState && isReferencedAsPrecondition;
              // 2. Explicit goal/target state (name heuristics)
              const matchesNameHeuristic = this.matchesMilestoneNameHeuristic(state.name);
              shouldCreateMilestone = isDecisionRelevant || matchesNameHeuristic;
            }
            if (shouldCreateMilestone) {
              const milestone = {
                id: this.generateId("milestone", state.id),
                name: `${obj.name} in ${state.name}`,
                sourceStateId: state.id,
                entryCriteria: []
              };
              milestones.push(milestone);
            }
          });
        }
      });
      return {
        caseFileItems,
        milestones
      };
    }
    /**
     * Check if state is a post-state (target of Result link)
     */
    isPostStateFromResultLinks(stateId, canonicalOPM) {
      return canonicalOPM.relations.some(rel => rel.type === "result" && rel.targetId === stateId);
    }
    /**
     * Check if state is referenced as a precondition by another process
     * Per spec Section 4.4: State must be referenced in procedural links (effect, consumption, instrument)
     * as a precondition for another process to be considered decision-relevant
     */
    isStateReferencedAsPrecondition(stateId, canonicalOPM) {
      // Check if state appears as source in effect/consumption/instrument links
      // These indicate the state is required as a precondition
      return canonicalOPM.relations.some(rel => (rel.type === "effect" || rel.type === "consumption" || rel.type === "instrument") && rel.sourceId === stateId);
    }
    /**
     * Simple name heuristic for milestone detection
     */
    matchesMilestoneNameHeuristic(stateName) {
      const lowerName = stateName.toLowerCase();
      return lowerName.includes("approved") || lowerName.includes("completed") || lowerName.includes("closed");
    }
    /**
     * Generate milestone name with cleaner pattern
     */
    generateMilestoneName(objectName, stateName) {
      // Use pattern: "ObjectName: stateName" for clarity
      // If object name is generic (like "Status"), just use state name
      const genericNames = ["status", "state", "object"];
      const isGeneric = genericNames.some(gen => objectName.toLowerCase().includes(gen));
      if (isGeneric) {
        return stateName; // Just use state name if object is generic
      }
      return `${objectName}: ${stateName}`;
    }
    /**
     * Get IDs of objects that are agents (have agent links)
     * These should be roles, not case file items
     */
    getAgentObjectIds(scopedSubgraph, canonicalOPM) {
      const agentIds = new Set();
      // Find all objects that are sources of agent links
      scopedSubgraph.relations.filter(rel => rel.type === "agent").forEach(rel => {
        if (rel.sourceId) {
          agentIds.add(rel.sourceId);
        }
      });
      return Array.from(agentIds);
    }
    generateId(prefix, baseId) {
      return `${prefix}_${baseId}`;
    }
    static #_ = (() => this.ɵfac = function CaseFileSchemaAlgorithm_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CaseFileSchemaAlgorithm)();
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: CaseFileSchemaAlgorithm,
      factory: CaseFileSchemaAlgorithm.ɵfac,
      providedIn: "root"
    }))();
  }
  return CaseFileSchemaAlgorithm;
})();