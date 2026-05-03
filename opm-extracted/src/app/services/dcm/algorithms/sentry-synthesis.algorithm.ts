// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/dcm/algorithms/sentry-synthesis.algorithm.ts
// Extracted by opm-extracted/tools/extract.mjs

let SentrySynthesisAlgorithm = /*#__PURE__*/(() => {
  class SentrySynthesisAlgorithm {
    /**
     * Synthesize sentries for tasks
     *
     * Enhanced guard synthesis (per spec Section 5.5):
     * - Analyzes OPM relations (instruments, consumptions, effects, results)
     * - Finds required artifacts and upstream processes
     * - Extracts state constraints
     * - Builds AND predicates combining all constraints
     *
     * Fallback behavior:
     * - If no OPM relations found, falls back to simple sequential guards
     * - First task = "true", subsequent = "completed('<PreviousTaskName>')"
     *
     * For root-level tasks (not in any stage), process them all in a single sequential order.
     * For tasks within stages, process each stage's tasks independently.
     */
    synthesizeSentries(tasks, scopedSubgraph, canonicalOPM, stages = [], milestones = [] // Add milestones parameter
    ) {
      const sentries = [];
      const sentryMap = new Map(); // task.id -> sentry
      // Group tasks by stage (or root level)
      const tasksByStage = this.groupTasksByStage(tasks, stages, canonicalOPM);
      // Process root-level tasks first (stageId = null) - these should be in a single sequential chain
      const rootTasks = tasksByStage.get(null) || [];
      if (rootTasks.length > 0) {
        // Order root-level tasks (use array order for now)
        const orderedRootTasks = this.orderTasksInStage(rootTasks);
        orderedRootTasks.forEach((task, index) => {
          const predicate = this.buildEnhancedPredicate(task, orderedRootTasks, index, scopedSubgraph, canonicalOPM);
          if (predicate === "true" && index === 0) {
            // First task with no dependencies: NO sentry, NO entryCriteria (task is immediately available)
            // BUT: Create a "virtual" sentry with predicate="true" for DMN documentation (Option 2)
            // This sentry will NOT be exported to CMMN, but will be used for DMN generation
            const virtualSentry = {
              id: this.generateId("sentry", task.id),
              ifPart: {
                predicate: predicate // Used for DMN documentation only
              }
              // No onPart - this is a virtual sentry for DMN only
            };
            // Store virtual sentry for DMN generation, but don't add to entryCriteria
            sentries.push(virtualSentry);
            // Do NOT add to task.entryCriteria - task has no prerequisites
            return; // Skip adding to entryCriteria
          }
          // Create Sentry with ifPart only (matching working Flowable import structure)
          const sentry = {
            id: this.generateId("sentry", task.id),
            ifPart: {
              predicate: predicate
            }
            // No onPart - working version doesn't use planItemOnPart
          };
          sentries.push(sentry);
          sentryMap.set(task.id, sentry);
          task.entryCriteria.push(sentry.id);
        });
      }
      // Process tasks within stages (each stage independently)
      tasksByStage.forEach((stageTasks, stageId) => {
        // Skip root-level tasks (already processed above)
        if (stageId === null) {
          return;
        }
        // Determine operational sequence (for now, use array order)
        const orderedTasks = this.orderTasksInStage(stageTasks);
        orderedTasks.forEach((task, index) => {
          const predicate = this.buildEnhancedPredicate(task, orderedTasks, index, scopedSubgraph, canonicalOPM);
          if (predicate === "true" && index === 0) {
            // First task in stage with no dependencies: NO sentry, NO entryCriteria (task is immediately available)
            // BUT: Create a "virtual" sentry with predicate="true" for DMN documentation (Option 2)
            const virtualSentry = {
              id: this.generateId("sentry", task.id),
              ifPart: {
                predicate: predicate // Used for DMN documentation only
              }
              // No onPart - this is a virtual sentry for DMN only
            };
            // Store virtual sentry for DMN generation, but don't add to entryCriteria
            sentries.push(virtualSentry);
            // Do NOT add to task.entryCriteria - task has no prerequisites
            return; // Skip adding to entryCriteria
          }
          // Create Sentry with ifPart and onPart (for milestone connections)
          // Find milestones that should trigger this sentry
          const onPart = this.findMilestonesForTask(task, orderedTasks, index, milestones, canonicalOPM, scopedSubgraph);
          const sentry = {
            id: this.generateId("sentry", task.id),
            ifPart: {
              predicate: predicate
            },
            onPart: onPart.length > 0 ? onPart : undefined
          };
          sentries.push(sentry);
          sentryMap.set(task.id, sentry);
          task.entryCriteria.push(sentry.id);
        });
      });
      return sentries;
    }
    /**
     * Build enhanced predicate using OPM relations, with fallback to sequential guards
     *
     * Enhanced synthesis (per spec Section 5.5):
     * 1. Find required artifacts (instruments + consumptions)
     * 2. Find upstream processes (producers of required objects)
     * 3. Extract state constraints (from consumption/effect links targeting states)
     * 4. Build AND predicate: exists(artifacts) AND completed(upstream) AND state(constraints)
     *
     * Fallback:
     * - If no OPM relations found, use simple sequential: first = "true", subsequent = "completed('<Previous>')"
     */
    buildEnhancedPredicate(task, orderedTasks, index, scopedSubgraph, canonicalOPM) {
      // Get the process for this task
      const process = this.getProcessForTask(task, scopedSubgraph);
      if (!process) {
        // Fallback: sequential guard
        if (index === 0) {
          return "true";
        }
        const previousTask = orderedTasks[index - 1];
        const escapedTaskName = previousTask.name.replace(/'/g, "''");
        return `completed('${escapedTaskName}')`;
      }
      // Enhanced guard synthesis: analyze OPM relations
      const requiredObjects = this.getRequiredArtifacts(process, scopedSubgraph, canonicalOPM);
      const upstreamProcesses = this.getProducersOf(requiredObjects, scopedSubgraph, canonicalOPM);
      const requiredStates = this.inferPreconditionsFromRelations(process, scopedSubgraph, canonicalOPM);
      // Build predicate from OPM relations
      const enhancedPredicate = this.buildPredicate(requiredObjects, upstreamProcesses, requiredStates, canonicalOPM);
      // If enhanced predicate is just "true" and we have no dependencies, check if we should use sequential fallback
      // Only use sequential fallback if:
      // 1. Enhanced predicate is "true" (no dependencies found)
      // 2. AND we're not the first task (first task should be "true" anyway)
      // 3. AND there are no OPM relations at all for this process
      const hasAnyRelations = requiredObjects.length > 0 || upstreamProcesses.length > 0 || requiredStates.length > 0;
      if (enhancedPredicate === "true" && !hasAnyRelations && index > 0) {
        // No OPM relations found - fall back to sequential guard
        const previousTask = orderedTasks[index - 1];
        const escapedTaskName = previousTask.name.replace(/'/g, "''");
        return `completed('${escapedTaskName}')`;
      }
      // Use enhanced predicate (or "true" for first task with no dependencies)
      return enhancedPredicate;
    }
    /**
     * Group tasks by their parent stage
     * A task belongs to a stage if its source process is a child of the stage's source process
     */
    groupTasksByStage(tasks, stages, canonicalOPM) {
      const groups = new Map();
      tasks.forEach(task => {
        // Find which stage this task belongs to (if any)
        // A task belongs to a stage if the task's source process is a child of the stage's source process
        const parentStage = stages.find(s => {
          return this.isTaskInStage(task, s, canonicalOPM);
        });
        const stageId = parentStage ? parentStage.id : null;
        if (!groups.has(stageId)) {
          groups.set(stageId, []);
        }
        groups.get(stageId).push(task);
      });
      return groups;
    }
    /**
     * Check if task is in stage by checking process hierarchy
     */
    isTaskInStage(task, stage, canonicalOPM) {
      if (!task.sourceProcessId || !stage.sourceProcessId) {
        return false;
      }
      // Find the task's process and stage's process
      const taskProcess = canonicalOPM.processes.find(p => p.id === task.sourceProcessId);
      const stageProcess = canonicalOPM.processes.find(p => p.id === stage.sourceProcessId);
      if (!taskProcess || !stageProcess) {
        return false;
      }
      // Check if task's process is a child of stage's process
      // A process is a child if its parentProcessId matches the stage's process id
      return taskProcess.parentProcessId === stageProcess.id;
    }
    /**
     * Order tasks within a stage (for now, use array order)
     * In future, could use OPM process order or other heuristics
     */
    orderTasksInStage(tasks) {
      // For v1, maintain the order as provided
      // In future, could sort by process order, dependencies, etc.
      return [...tasks];
    }
    /**
     * Get process for task
     */
    getProcessForTask(task, scopedSubgraph) {
      return scopedSubgraph.processes.find(p => p.id === task.sourceProcessId);
    }
    /**
     * Get required artifacts (instruments and consumptions)
     */
    getRequiredArtifacts(process, scopedSubgraph, canonicalOPM) {
      const requiredObjectIds = new Set();
      scopedSubgraph.relations.filter(rel => {
        const isProcessSource = rel.sourceId === process.id;
        const isInstrumentOrConsumption = rel.type === "instrument" || rel.type === "consumption";
        return isProcessSource && isInstrumentOrConsumption;
      }).forEach(rel => {
        // Check if target is an object or state
        const isObject = canonicalOPM.objects.some(o => o.id === rel.targetId);
        const state = canonicalOPM.states.find(s => s.id === rel.targetId);
        if (isObject) {
          // Target is an object
          requiredObjectIds.add(rel.targetId);
        } else if (state) {
          // Target is a state - use the parent object
          requiredObjectIds.add(state.objectId);
        } else {
          // Unknown target - add as-is (will be handled in buildPredicate)
          requiredObjectIds.add(rel.targetId);
        }
      });
      return Array.from(requiredObjectIds);
    }
    /**
     * Get producers of required objects (processes that produce these objects via Result/Effect)
     */
    getProducersOf(requiredObjects, scopedSubgraph, canonicalOPM) {
      const producerProcessIds = new Set();
      requiredObjects.forEach(targetId => {
        // Check if targetId is an object or a state
        const isObject = canonicalOPM.objects.some(o => o.id === targetId);
        const state = canonicalOPM.states.find(s => s.id === targetId);
        const actualObjectId = isObject ? targetId : state ? state.objectId : targetId;
        scopedSubgraph.relations.filter(rel => {
          const producesObject = rel.type === "result" || rel.type === "effect";
          // Check if target is the object or any of its states
          const targetsObject = rel.targetId === actualObjectId;
          const targetsState = state ? rel.targetId === targetId : false;
          const targetsAnyStateOfObject = canonicalOPM.states.filter(s => s.objectId === actualObjectId).some(s => s.id === rel.targetId);
          return producesObject && (targetsObject || targetsState || targetsAnyStateOfObject);
        }).forEach(rel => {
          // Check if source is a process in scoped subgraph
          const sourceProcess = scopedSubgraph.processes.find(p => p.id === rel.sourceId);
          if (sourceProcess) {
            producerProcessIds.add(rel.sourceId);
          }
        });
      });
      return Array.from(producerProcessIds);
    }
    /**
     * Infer preconditions from procedural relations
     * NO structured preconditions UI exists in OPCloud.
     *
     * For v1: DCM mapping must NOT depend on OPL.
     * OPL parsing is DISABLED - ignore OPL entirely for v1.
     *
     * State transitions: ONLY infer from Result links.
     * Process --Result--> State S (where S belongs to Object O) means:
     * "after this task, the case object's state is S".
     * Do NOT attempt to infer pre-states or transitions beyond this.
     */
    inferPreconditionsFromRelations(process, scopedSubgraph, canonicalOPM) {
      const requiredStates = [];
      // Infer from consumption/effect links that target states
      // These indicate states required before the process can execute
      scopedSubgraph.relations.filter(rel => {
        // Find relations where this process consumes or affects a state
        const isProcessSource = rel.sourceId === process.id;
        const isProcedural = ["consumption", "effect", "instrument"].includes(rel.type);
        const targetIsState = canonicalOPM.states.some(s => s.id === rel.targetId);
        return isProcessSource && isProcedural && targetIsState;
      }).forEach(rel => {
        // The target state is required before the process can execute
        requiredStates.push(rel.targetId);
      });
      // Note: OPL parsing DISABLED for v1 - do not use OPL
      return requiredStates;
    }
    /**
     * Build predicate expression
     * NOTE: This is CONCEPTUAL DSL only, NOT Flowable-executable expressions
     * Flowable import is for visualization only, NOT execution
     * For stateless objects, use "exists(objectName)" only
     */
    buildPredicate(requiredObjects, upstreamProcesses, requiredStates, canonicalOPM) {
      const parts = [];
      // Forall o in requiredObjects: exists(o)
      // For stateless objects, this is the only condition
      requiredObjects.forEach(objId => {
        // Check if it's actually an object or a state
        const obj = canonicalOPM.objects.find(o => o.id === objId);
        const state = canonicalOPM.states.find(s => s.id === objId);
        if (obj) {
          // Use single quotes for object names (will be wrapped in double quotes in DMN)
          const escapedName = obj.name.replace(/'/g, "''");
          parts.push(`exists('${escapedName}')`);
        } else if (state) {
          // If it's a state, reference the parent object by name
          const parentObj = canonicalOPM.objects.find(o => o.id === state.objectId);
          if (parentObj) {
            const escapedName = parentObj.name.replace(/'/g, "''");
            parts.push(`exists('${escapedName}')`);
          } else {
            parts.push(`exists('${state.objectId}')`);
          }
        } else {
          parts.push(`exists('${objId}')`);
        }
      });
      // Forall u in upstreamProcesses: u.completed
      upstreamProcesses.forEach(procId => {
        const process = canonicalOPM.processes.find(p => p.id === procId);
        if (process) {
          // Use single quotes for process names (will be wrapped in double quotes in DMN)
          const escapedName = process.name.replace(/'/g, "''");
          parts.push(`completed('${escapedName}')`);
        } else {
          parts.push(`completed('${procId}')`);
        }
      });
      // Forall s in requiredStates: objectState == s
      requiredStates.forEach(stateId => {
        const state = canonicalOPM.states.find(s => s.id === stateId);
        if (state) {
          const parentObj = canonicalOPM.objects.find(o => o.id === state.objectId);
          if (parentObj) {
            // Use single quotes for object and state names (will be wrapped in double quotes in DMN)
            const escapedObjName = parentObj.name.replace(/'/g, "''");
            const escapedStateName = state.name.replace(/'/g, "''");
            parts.push(`state('${escapedObjName}', '${escapedStateName}')`);
          } else {
            const escapedStateName = state.name.replace(/'/g, "''");
            parts.push(`state('${state.objectId}', '${escapedStateName}')`);
          }
        }
      });
      if (parts.length > 0) {
        return parts.join(" AND ");
      } else {
        return "true";
      }
    }
    /**
     * Find milestones that should trigger this task's sentry
     * Based on:
     * 1. Previous tasks that produce states (Result links) -> milestones
     * 2. Required states (consumption/effect links) -> milestones
     */
    findMilestonesForTask(task, orderedTasks, taskIndex, milestones, canonicalOPM, scopedSubgraph) {
      const onPart = [];
      // 1. Check if previous tasks produce states that become milestones
      if (taskIndex > 0) {
        const previousTask = orderedTasks[taskIndex - 1];
        const previousProcess = scopedSubgraph.processes.find(p => p.id === previousTask.sourceProcessId);
        if (previousProcess) {
          // Find Result links from previous process that produce states
          scopedSubgraph.relations.filter(rel => rel.sourceId === previousProcess.id && rel.type === "result").forEach(rel => {
            // Check if target is a state that has a milestone
            const milestone = milestones.find(m => m.sourceStateId === rel.targetId);
            if (milestone) {
              // Reference milestone: planItemRef format is "pi_<milestoneId>" (matches CMMN exporter)
              onPart.push({
                eventRef: "complete",
                planItemRef: `pi_${milestone.id}`
              });
            }
          });
        }
      }
      // 2. Check if this task requires states (from consumption/effect links) that have milestones
      const taskProcess = scopedSubgraph.processes.find(p => p.id === task.sourceProcessId);
      if (taskProcess) {
        // Find consumption/effect links that target states
        scopedSubgraph.relations.filter(rel => rel.sourceId === taskProcess.id && (rel.type === "consumption" || rel.type === "effect")).forEach(rel => {
          // Check if target is a state that has a milestone
          const milestone = milestones.find(m => m.sourceStateId === rel.targetId);
          if (milestone) {
            // Reference milestone: planItemRef format is "pi_<milestoneId>" (matches CMMN exporter)
            onPart.push({
              eventRef: "complete",
              planItemRef: `pi_${milestone.id}`
            });
          }
        });
      }
      return onPart;
    }
    generateId(prefix, baseId) {
      return `${prefix}_${baseId}`;
    }
    static #_ = (() => this.ɵfac = function SentrySynthesisAlgorithm_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SentrySynthesisAlgorithm)();
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: SentrySynthesisAlgorithm,
      factory: SentrySynthesisAlgorithm.ɵfac,
      providedIn: "root"
    }))();
  }
  return SentrySynthesisAlgorithm;
})();