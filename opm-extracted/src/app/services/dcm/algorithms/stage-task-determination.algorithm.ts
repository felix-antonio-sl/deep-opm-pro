// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/dcm/algorithms/stage-task-determination.algorithm.ts
// Extracted by opm-extracted/tools/extract.mjs

let StageTaskDeterminationAlgorithm = /*#__PURE__*/(() => {
  class StageTaskDeterminationAlgorithm {
    /**
     * Determine stages and tasks from processes
     */
    determineStagesAndTasks(scopedSubgraph, stagePolicy, stageLevelN, canonicalOPM, opmModel) {
      const stages = [];
      const tasks = [];
      scopedSubgraph.processes.forEach(process => {
        const hasChildren = process.childrenProcessIds && process.childrenProcessIds.length > 0;
        let shouldCreateStage = false;
        if (stagePolicy === "refined-process") {
          shouldCreateStage = hasChildren;
        } else if (stagePolicy === "flat-tasks") {
          shouldCreateStage = false; // All become tasks
        } else if (stagePolicy === "level-n" && stageLevelN !== undefined) {
          // For level-n, we'd need to calculate the depth
          // For v1, treat as refined-process
          shouldCreateStage = hasChildren;
        }
        if (shouldCreateStage) {
          const isDiscretionary = opmModel && canonicalOPM ? this.isDiscretionary(process, canonicalOPM, opmModel) : false;
          stages.push({
            id: this.generateId("stage", process.id),
            name: process.name,
            parentStageId: process.parentProcessId ? this.generateId("stage", process.parentProcessId) : undefined,
            sourceProcessId: process.id,
            entryCriteria: [],
            exitCriteria: [],
            isDiscretionary
          });
        } else {
          const taskType = opmModel && canonicalOPM ? this.determineTaskType(process, canonicalOPM, opmModel) : "human";
          const isDiscretionary = opmModel && canonicalOPM ? this.isDiscretionary(process, canonicalOPM, opmModel) : false;
          const roleRefs = opmModel && canonicalOPM ? this.getRoleRefsForTask(process, canonicalOPM, opmModel) : [];
          tasks.push({
            id: this.generateId("task", process.id),
            name: process.name,
            type: taskType,
            sourceProcessId: process.id,
            entryCriteria: [],
            exitCriteria: [],
            isDiscretionary,
            roleRefs
          });
        }
      });
      return {
        stages,
        tasks
      };
    }
    /**
     * Determine task type based on OPM links
     */
    determineTaskType(process, canonicalOPM, opmModel) {
      // Find the OPM logical process
      const logicalProcess = this.findProcessByStableId(process.id, opmModel);
      if (!logicalProcess) {
        return "human"; // Default
      }
      // Check for decision link (DMN decision)
      // This will be checked later when decisions are extracted, but for now default to human
      // TODO: Check if process has decision link when decision extraction is available
      // Check for agent links
      const hasAgentLink = this.hasAgentLinks(logicalProcess, opmModel);
      // Check for instrument links only (no agent)
      const hasInstrumentLinkOnly = this.hasInstrumentLinksOnly(logicalProcess, opmModel);
      if (hasAgentLink) {
        return "human";
      } else if (hasInstrumentLinkOnly) {
        return "process";
      }
      // Default to human
      return "human";
    }
    /**
     * Check if process is discretionary (optional)
     */
    isDiscretionary(process, canonicalOPM, opmModel) {
      const logicalProcess = this.findProcessByStableId(process.id, opmModel);
      if (!logicalProcess) {
        return false;
      }
      // Get incoming links
      const incomingLinks = this.getIncomingLinks(logicalProcess, opmModel);
      return incomingLinks.some(link => {
        // Check probability (if < 1.0, it's optional)
        if (link.probability !== undefined && link.probability < 1) {
          return true;
        }
        // Check for XOR/OR links (which indicate alternatives)
        if (link.sourceLogicalConnection === LinkLogicalConnection.Xor || link.sourceLogicalConnection === LinkLogicalConnection.Or) {
          return true;
        }
        return false;
      });
    }
    /**
     * Get role references for a task based on agent links
     * Enhanced to:
     * - Consider generalization hierarchy (Gap 2: prefer specific roles)
     * - Include inherited roles from parent processes (Gap 5: inzoomed process link propagation)
     */
    getRoleRefsForTask(process, canonicalOPM, opmModel) {
      const logicalProcess = this.findProcessByStableId(process.id, opmModel);
      if (!logicalProcess) {
        return [];
      }
      const roleRefs = [];
      const processedRoleIds = new Set();
      // 1. Get direct agent links to this process
      const directAgentLinks = this.getAgentLinksToProcess(logicalProcess, opmModel);
      directAgentLinks.forEach(link => {
        const agentObject = link.sourceLogicalElement;
        if (agentObject) {
          const agentObjectId = this.getStableIdForLogicalElement(agentObject, canonicalOPM);
          if (agentObjectId) {
            // Gap 2: Get most specific role ID (prefer specializations over generals)
            const roleId = this.getMostSpecificRoleId(agentObjectId, canonicalOPM);
            if (roleId && !processedRoleIds.has(roleId)) {
              roleRefs.push(roleId);
              processedRoleIds.add(roleId);
            }
          }
        }
      });
      // 2. Get inherited agent links from parent processes (Gap 5: inzoomed process link propagation)
      const inheritedRoleRefs = this.getInheritedRoleRefs(process, canonicalOPM, opmModel);
      inheritedRoleRefs.forEach(roleId => {
        if (!processedRoleIds.has(roleId)) {
          roleRefs.push(roleId);
          processedRoleIds.add(roleId);
        }
      });
      return roleRefs;
    }
    /**
     * Get most specific role ID for an agent object
     * Gap 2: If object is a specialization, return its role ID
     * If object is a general, check if any specializations have agent links
     */
    getMostSpecificRoleId(agentObjectId, canonicalOPM) {
      // Check if this object is a specialization (has generalization relation where it's the source)
      // In OPM: sourceId (specific) --Generalization--> targetId (general)
      const isSpecialization = canonicalOPM.relations.some(rel => rel.type === "generalization" && rel.sourceId === agentObjectId);
      // If it's a specialization, use it (it's more specific)
      if (isSpecialization) {
        return this.generateId("role", agentObjectId);
      }
      // If it's a general, check if any specializations exist
      // For now, use the general object itself
      // In future, could check if specializations have agent links and prefer those
      return this.generateId("role", agentObjectId);
    }
    /**
     * Get role references inherited from parent processes (inzoomed process link propagation)
     * Gap 5: Traverse up the process hierarchy to find all ancestor processes with agent links
     */
    getInheritedRoleRefs(process, canonicalOPM, opmModel) {
      const inheritedRoleRefs = [];
      // Traverse up the process hierarchy
      let currentProcess = process;
      let depth = 0;
      const maxDepth = 10; // Prevent infinite loops
      while (currentProcess.parentProcessId && depth < maxDepth) {
        depth++;
        // Find parent process
        const parentProcess = canonicalOPM.processes.find(p => p.id === currentProcess.parentProcessId);
        if (!parentProcess) {
          break;
        }
        // Get agent links to parent process
        const parentLogicalProcess = this.findProcessByStableId(parentProcess.id, opmModel);
        if (parentLogicalProcess) {
          const parentAgentLinks = this.getAgentLinksToProcess(parentLogicalProcess, opmModel);
          parentAgentLinks.forEach(link => {
            const agentObject = link.sourceLogicalElement;
            if (agentObject) {
              const agentObjectId = this.getStableIdForLogicalElement(agentObject, canonicalOPM);
              if (agentObjectId) {
                // Gap 2: Get most specific role ID
                const roleId = this.getMostSpecificRoleId(agentObjectId, canonicalOPM);
                if (roleId) {
                  inheritedRoleRefs.push(roleId);
                }
              }
            }
          });
        }
        // Move up to next parent
        currentProcess = parentProcess;
      }
      return inheritedRoleRefs;
    }
    /**
     * Find OPM process by stable ID
     * Handles both simple IDs (process_<lid>) and hash-based IDs from canonical export
     */
    findProcessByStableId(stableId, opmModel) {
      // First, try simple matching (if stableId is just a lid or process_<lid>)
      let lid = stableId.replace(/^process_/, "");
      let element = opmModel.logicalElements.find(el => el instanceof OpmLogicalProcess && el.lid === stableId);
      if (!element) {
        element = opmModel.logicalElements.find(el => el instanceof OpmLogicalProcess && el.lid === lid);
      }
      // If not found, try hash-based matching (canonical export uses hash IDs)
      if (!element) {
        // Generate hash for each logical process and compare
        const processes = opmModel.logicalElements.filter(el => el instanceof OpmLogicalProcess);
        for (const process of processes) {
          const generatedId = this.generateStableId("process", process.lid);
          if (generatedId === stableId) {
            element = process;
            break;
          }
        }
      }
      return element || null;
    }
    /**
     * Get stable ID for logical element from canonical OPM
     * Uses the same hash algorithm as canonical export to match IDs
     */
    getStableIdForLogicalElement(element, canonicalOPM) {
      if (!element || !element.lid) {
        return null;
      }
      // Generate stable ID using same algorithm as canonical export
      const expectedObjectId = this.generateStableId("object", element.lid);
      const expectedProcessId = this.generateStableId("process", element.lid);
      const expectedStateId = this.generateStableId("state", element.lid);
      // Check objects
      const object = canonicalOPM.objects.find(obj => obj.id === expectedObjectId);
      if (object) {
        return object.id;
      }
      // Check processes
      const process = canonicalOPM.processes.find(proc => proc.id === expectedProcessId);
      if (process) {
        return process.id;
      }
      // Check states
      const state = canonicalOPM.states.find(s => s.id === expectedStateId);
      if (state) {
        return state.id;
      }
      // Fallback: Try to find by matching lid directly (in case IDs don't match)
      // This shouldn't happen if hash algorithm is consistent, but defensive programming
      const objectByLid = canonicalOPM.objects.find(obj => {
        // Try to extract lid from stable ID (not reliable, but fallback)
        return obj.name === (element.getName ? element.getName() : element.text);
      });
      if (objectByLid) {
        return objectByLid.id;
      }
      return null;
    }
    /**
     * Generate stable ID using same algorithm as canonical export
     * This must match the algorithm in CanonicalOPMExportService.generateStableId()
     */
    generateStableId(type, logicalId) {
      const seed = `${type}_${logicalId}`;
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      const hex = Math.abs(hash).toString(16).padStart(8, "0");
      return `${type}_${hex}-${hex.substring(0, 4)}-${hex.substring(4, 8)}-${hex.substring(0, 4)}-${hex.substring(0, 12)}`;
    }
    /**
     * Check if process has agent links
     */
    hasAgentLinks(process, opmModel) {
      const agentLinks = this.getAgentLinksToProcess(process, opmModel);
      return agentLinks.length > 0;
    }
    /**
     * Check if process has instrument links only (no agent links)
     */
    hasInstrumentLinksOnly(process, opmModel) {
      const agentLinks = this.getAgentLinksToProcess(process, opmModel);
      const instrumentLinks = this.getInstrumentLinksToProcess(process, opmModel);
      return instrumentLinks.length > 0 && agentLinks.length === 0;
    }
    /**
     * Get agent links to process
     */
    getAgentLinksToProcess(process, opmModel) {
      const allRelations = this.getProceduralRelations(opmModel);
      return allRelations.filter(rel => rel.linkType === linkType.Agent && rel.targetLogicalElements && rel.targetLogicalElements.some(target => target.lid === process.lid));
    }
    /**
     * Get instrument links to process
     */
    getInstrumentLinksToProcess(process, opmModel) {
      const allRelations = this.getProceduralRelations(opmModel);
      return allRelations.filter(rel => rel.linkType === linkType.Instrument && rel.targetLogicalElements && rel.targetLogicalElements.some(target => target.lid === process.lid));
    }
    /**
     * Get incoming links to process
     */
    getIncomingLinks(process, opmModel) {
      const allRelations = this.getProceduralRelations(opmModel);
      return allRelations.filter(rel => rel.targetLogicalElements && rel.targetLogicalElements.some(target => target.lid === process.lid));
    }
    /**
     * Get all procedural relations from model
     */
    getProceduralRelations(opmModel) {
      const allRelations = opmModel.logicalElements.filter(el => el instanceof OpmRelation);
      return allRelations.filter(rel => rel instanceof OpmProceduralRelation);
    }
    generateId(prefix, baseId) {
      return `${prefix}_${baseId}`;
    }
    static #_ = (() => this.ɵfac = function StageTaskDeterminationAlgorithm_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || StageTaskDeterminationAlgorithm)();
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: StageTaskDeterminationAlgorithm,
      factory: StageTaskDeterminationAlgorithm.ɵfac,
      providedIn: "root"
    }))();
  }
  return StageTaskDeterminationAlgorithm;
})();