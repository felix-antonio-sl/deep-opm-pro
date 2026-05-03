// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/dcm/canonical-opm-export.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let CanonicalOPMExportService = /*#__PURE__*/(() => {
  class CanonicalOPMExportService {
    /**
     * Export OPM model to canonical format
     */
    exportCanonicalOPM(opmModel) {
      const objects = this.exportObjects(opmModel);
      const states = this.exportStates(opmModel);
      const processes = this.exportProcesses(opmModel);
      const relations = this.exportRelations(opmModel);
      return {
        modelId: this.generateStableId("model", opmModel.name || "OPM_Model"),
        modelName: opmModel.name || "OPM Model",
        objects,
        states,
        processes,
        relations
      };
    }
    /**
     * Export all objects
     */
    exportObjects(opmModel) {
      const objects = [];
      const objectMap = new Map();
      // First pass: create all objects
      opmModel.logicalElements.filter(el => el instanceof OpmLogicalObject).forEach(logicalObj => {
        const obj = logicalObj;
        const canonicalObj = {
          id: this.generateStableId("object", obj.lid),
          name: obj.getName() || obj.text || "Unnamed Object",
          kind: this.mapObjectKind(obj),
          isStateful: obj.states && obj.states.length > 0,
          states: [],
          // Will be populated from states array
          attributes: this.extractAttributes(obj)
        };
        objects.push(canonicalObj);
        objectMap.set(obj.lid, canonicalObj);
      });
      // Second pass: populate states
      opmModel.logicalElements.filter(el => el instanceof OpmLogicalState).forEach(logicalState => {
        const state = logicalState;
        const parentObject = state.parent;
        if (parentObject && objectMap.has(parentObject.lid)) {
          const canonicalObj = objectMap.get(parentObject.lid);
          // Use getBareName() for states to get the actual state name from textModule
          const stateName = state.getBareName ? state.getBareName() : state.getName() || state.text || "Unnamed State";
          canonicalObj.states.push({
            id: this.generateStableId("state", state.lid),
            name: stateName,
            objectId: canonicalObj.id
          });
        }
      });
      return objects;
    }
    /**
     * Export all states (separate array for easy lookup)
     */
    exportStates(opmModel) {
      const states = [];
      opmModel.logicalElements.filter(el => el instanceof OpmLogicalState).forEach(logicalState => {
        const state = logicalState;
        const parentObject = state.parent;
        if (parentObject) {
          // Use getBareName() for states to get the actual state name from textModule
          const stateName = state.getBareName ? state.getBareName() : state.getName() || state.text || "Unnamed State";
          states.push({
            id: this.generateStableId("state", state.lid),
            name: stateName,
            objectId: this.generateStableId("object", parentObject.lid)
          });
        }
      });
      return states;
    }
    /**
     * Export all processes with parent/children hierarchy
     */
    exportProcesses(opmModel) {
      const processes = [];
      const processMap = new Map();
      const processToOpdMap = new Map();
      // Build process -> OPD mapping
      opmModel.opds.forEach(opd => {
        opd.visualElements.forEach(visual => {
          if (visual.logicalElement instanceof OpmLogicalProcess) {
            processToOpdMap.set(visual.logicalElement.lid, opd);
          }
        });
      });
      // First pass: create all processes
      opmModel.logicalElements.filter(el => el instanceof OpmLogicalProcess).forEach(logicalProcess => {
        const proc = logicalProcess;
        const canonicalProc = {
          id: this.generateStableId("process", proc.lid),
          name: proc.getName() || proc.text || "Unnamed Process",
          parentProcessId: undefined,
          // Will be determined from OPD hierarchy
          childrenProcessIds: [] // Will be populated
        };
        processes.push(canonicalProc);
        processMap.set(proc.lid, canonicalProc);
      });
      // Second pass: determine parent/children from OPD hierarchy
      // Use existing OPD refinement hierarchy approach
      // Reuse same pattern as getDirectSubProcesses and OPD parent/children in existing converters
      // Use getChildren() or getDirectSubProcesses() and invert mappings as needed
      // Do NOT introduce a new parent-calculation mechanism
      processMap.forEach((canonicalProc, logicalLid) => {
        const logicalProcess = opmModel.logicalElements.find(el => el instanceof OpmLogicalProcess && el.lid === logicalLid);
        if (logicalProcess) {
          // Get the OPD containing this process (used for both child detection and parent detection)
          const processOpd = processToOpdMap.get(logicalLid);
          // Use the same pattern as BaseDiagramConverter.getDirectSubProcesses()
          // This is the standard way OPCloud determines child processes
          const childProcesses = [];
          // Use getChildren() as the ONLY authoritative method for determining child processes
          // This method correctly handles both inzoom and unfold based on OPM semantics
          // We do NOT check child OPDs directly because:
          // 1. getChildren() already returns the correct children for both inzoom and unfold
          // 2. Child OPDs may contain processes that are NOT children (e.g., siblings, unrelated processes)
          // 3. Adding all processes from child OPDs would incorrectly treat non-children as children
          if (typeof logicalProcess.getChildren === "function") {
            const children = logicalProcess.getChildren() || [];
            const directSubProcesses = children.filter(child => child instanceof OpmLogicalProcess);
            childProcesses.push(...directSubProcesses);
          }
          canonicalProc.childrenProcessIds = childProcesses.map(child => this.generateStableId("process", child.lid));
          // Determine parent from OPD hierarchy
          // Use the same pattern as existing converters: find parent OPD and identify the inzoomed process
          // Reuse processOpd from above (already declared at line 186)
          if (processOpd && processOpd.parendId && processOpd.parendId !== "SD") {
            // Find parent OPD
            const parentOpd = opmModel.opds.find(p => p.id === processOpd.parendId);
            if (parentOpd) {
              // Find the process in the parent OPD that was inzoomed to create this child OPD
              // The parent process is the one that has this process as a child
              let parentProcess = null;
              // Check each process in parent OPD to see if it has this process as a child
              for (const vis of parentOpd.visualElements) {
                if (vis.logicalElement instanceof OpmLogicalProcess) {
                  const candidateProcess = vis.logicalElement;
                  // Check if this candidate process has the current process as a child
                  if (typeof candidateProcess.getChildren === "function") {
                    const children = candidateProcess.getChildren() || [];
                    const hasThisAsChild = children.some(child => child instanceof OpmLogicalProcess && child.lid === logicalLid);
                    if (hasThisAsChild) {
                      parentProcess = candidateProcess;
                      break;
                    }
                  }
                }
              }
              if (parentProcess && parentProcess.lid !== logicalLid) {
                canonicalProc.parentProcessId = this.generateStableId("process", parentProcess.lid);
              }
            }
          }
        }
      });
      // Post-process: Set parents from childrenProcessIds (handles unfolded processes in same OPD)
      // If a process doesn't have a parent set from OPD hierarchy, check if any other process has it as a child
      // This ensures processes that are in the same OPD (unfolded) also get their parents set
      processes.forEach(proc => {
        if (!proc.parentProcessId) {
          // Find which process has this process as a child
          processes.forEach(candidateParent => {
            if (candidateParent.childrenProcessIds && candidateParent.childrenProcessIds.includes(proc.id)) {
              proc.parentProcessId = candidateParent.id;
            }
          });
        }
      });
      return processes;
    }
    /**
     * Export all relations
     */
    exportRelations(opmModel) {
      const relations = [];
      opmModel.logicalElements.filter(el => el instanceof OpmRelation).forEach(logicalRelation => {
        const relation = logicalRelation;
        const source = relation.sourceLogicalElement;
        const targetLogicalElements = relation.targetLogicalElements;
        if (!source || !targetLogicalElements || targetLogicalElements.length === 0) {
          return;
        }
        // Use first target element
        const target = targetLogicalElements[0];
        let relationType = null;
        // Determine relation type
        if (relation instanceof OpmProceduralRelation) {
          relationType = this.mapProceduralLinkType(relation.linkType);
        } else if (relation instanceof OpmStructuralRelation) {
          relationType = this.mapStructuralLinkType(relation.linkType);
        }
        if (relationType) {
          // Determine source and target IDs
          const sourceId = this.getElementId(source);
          const targetId = this.getElementId(target);
          if (sourceId && targetId) {
            relations.push({
              id: this.generateStableId("relation", relation.lid),
              type: relationType,
              sourceId,
              targetId
            });
          }
        }
      });
      return relations;
    }
    /**
     * Map procedural link type to canonical type
     */
    mapProceduralLinkType(linkTypeValue) {
      switch (linkTypeValue) {
        case linkType.Agent:
          return "agent";
        case linkType.Instrument:
          return "instrument";
        case linkType.Consumption:
          return "consumption";
        case linkType.Result:
          return "result";
        case linkType.Effect:
          return "effect";
        default:
          return null;
      }
    }
    /**
     * Map structural link type to canonical type
     */
    mapStructuralLinkType(linkTypeValue) {
      switch (linkTypeValue) {
        case linkType.Aggregation:
          return "aggregation";
        case linkType.Exhibition:
          return "characterization";
        // Exhibition is characterization
        case linkType.Generalization:
          return "generalization";
        default:
          return null;
      }
    }
    /**
     * Map object kind from essence and affiliation
     */
    mapObjectKind(obj) {
      const essence = obj.essence;
      const affiliation = obj.affiliation;
      if (affiliation === Affiliation.Environmental) {
        if (essence === Essence.Physical) {
          return "environmental";
        } else {
          return "environmental";
        }
      }
      if (essence === Essence.Physical) {
        return "physical";
      } else {
        return "informational";
      }
      // System is a special case - could be determined from other properties
      // For now, default to informational
      return "informational";
    }
    /**
     * Extract attributes from object
     */
    extractAttributes(obj) {
      const attributes = [];
      // Extract value-related attributes if they exist
      if (obj.valueType !== undefined) {
        attributes.push({
          id: this.generateStableId("attr", `${obj.lid}_valueType`),
          name: "valueType",
          valueType: "enum",
          value: obj.valueType
        });
      }
      if (obj.value !== undefined && obj.value !== null) {
        attributes.push({
          id: this.generateStableId("attr", `${obj.lid}_value`),
          name: "value",
          valueType: typeof obj.value,
          value: obj.value
        });
      }
      if (obj.units) {
        attributes.push({
          id: this.generateStableId("attr", `${obj.lid}_units`),
          name: "units",
          valueType: "string",
          value: obj.units
        });
      }
      return attributes;
    }
    /**
     * Get element ID (object, process, or state)
     */
    getElementId(element) {
      if (!element || !element.lid) {
        return null;
      }
      if (element instanceof OpmLogicalObject) {
        return this.generateStableId("object", element.lid);
      } else if (element instanceof OpmLogicalProcess) {
        return this.generateStableId("process", element.lid);
      } else if (element instanceof OpmLogicalState) {
        return this.generateStableId("state", element.lid);
      }
      return null;
    }
    /**
     * Generate stable UUID based on type and logical ID
     * This ensures the same logical element always gets the same UUID
     */
    generateStableId(type, logicalId) {
      // Use a deterministic approach: hash the type + logicalId
      // For simplicity, we'll use a prefix-based approach
      // In production, you might want to use a proper hash function
      const seed = `${type}_${logicalId}`;
      // Simple hash function for deterministic IDs
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      // Format as UUID-like string (8-4-4-4-12)
      const hex = Math.abs(hash).toString(16).padStart(8, "0");
      return `${type}_${hex}-${hex.substring(0, 4)}-${hex.substring(4, 8)}-${hex.substring(0, 4)}-${hex.substring(0, 12)}`;
    }
    static #_ = (() => this.ɵfac = function CanonicalOPMExportService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CanonicalOPMExportService)();
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: CanonicalOPMExportService,
      factory: CanonicalOPMExportService.ɵfac,
      providedIn: "root"
    }))();
  }
  return CanonicalOPMExportService;
})();