// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/dcm/algorithms/event-listener-generation.algorithm.ts
// Extracted by opm-extracted/tools/extract.mjs

let EventListenerGenerationAlgorithm = /*#__PURE__*/(() => {
  class EventListenerGenerationAlgorithm {
    /**
     * Generate Event Listeners from OPM model
     */
    generateEventListeners(tasks, stages, canonicalOPM, opmModel) {
      const listeners = [];
      // Generate Timer Event Listeners from process duration
      tasks.forEach(task => {
        const process = this.findProcessByStableId(task.sourceProcessId, opmModel);
        if (process) {
          // Check if process has time duration enabled
          if (!process.isTimeDuration()) {
            return; // Skip if no time duration
          }
          const duration = process.getDurationManager().getTimeDuration();
          // Max duration → Timer Event Listener for deadline
          if (duration.max != null && duration.timeDurationStatus === TimeDurationType.Specified) {
            listeners.push({
              id: `timer_${task.id}_max`,
              type: "timer",
              name: `Deadline: ${duration.max} ${duration.units}`,
              timerExpression: this.formatTimerExpression(duration.max, duration.units),
              targetPlanItemId: task.id,
              targetPlanItemType: "task",
              sourceProcessId: process.lid
            });
          }
          // Expected duration → Timer Event Listener for follow-up
          if (duration.nominal != null && duration.timeDurationStatus === TimeDurationType.Specified) {
            listeners.push({
              id: `timer_${task.id}_expected`,
              type: "timer",
              name: `Follow-up: ${duration.nominal} ${duration.units}`,
              timerExpression: this.formatTimerExpression(duration.nominal, duration.units),
              targetPlanItemId: task.id,
              targetPlanItemType: "task",
              sourceProcessId: process.lid
            });
          }
        }
      });
      // Generate User Event Listeners from event links
      const eventLinks = this.getEventLinks(opmModel);
      eventLinks.forEach(link => {
        const targetProcess = link.targetLogicalElements?.[0];
        if (targetProcess && targetProcess instanceof OpmLogicalProcess) {
          const task = tasks.find(t => {
            // Match by finding the process that corresponds to the task
            const process = this.findProcessByStableId(t.sourceProcessId, opmModel);
            return process && process.lid === targetProcess.lid;
          });
          if (task) {
            const sourceElement = link.sourceLogicalElement;
            const sourceName = sourceElement?.getName ? sourceElement.getName() : sourceElement?.text || "Unknown";
            listeners.push({
              id: `user_${link.lid}`,
              type: "user",
              name: `${sourceName} Event`,
              eventRef: `event_${link.lid}`,
              targetPlanItemId: task.id,
              targetPlanItemType: "task",
              sourceProcessId: targetProcess.lid,
              sourceLinkId: link.lid
            });
          }
        }
      });
      return listeners;
    }
    /**
     * Find OPM process by stable ID (from canonical export)
     */
    findProcessByStableId(stableId, opmModel) {
      // Extract the lid from stable ID (format: "process_<lid>")
      const lid = stableId.replace(/^process_/, "");
      const element = opmModel.logicalElements.find(el => el instanceof OpmLogicalProcess && el.lid === lid);
      return element || null;
    }
    /**
     * Get all event links from OPM model
     */
    getEventLinks(opmModel) {
      const allRelations = opmModel.logicalElements.filter(el => el instanceof OpmRelation);
      return allRelations.filter(rel => rel instanceof OpmProceduralRelation).filter(rel => rel.event === true);
    }
    /**
     * Format timer expression for CMMN (ISO 8601 duration format)
     * Examples: PT2H (2 hours), PT30M (30 minutes), P1D (1 day)
     */
    formatTimerExpression(value, units) {
      // Normalize units to lowercase
      const normalizedUnits = units.toLowerCase();
      // Map OPM units to ISO 8601 duration format
      if (normalizedUnits === "s" || normalizedUnits === "sec" || normalizedUnits === "second" || normalizedUnits === "seconds") {
        return `PT${value}S`;
      } else if (normalizedUnits === "ms" || normalizedUnits === "millisecond" || normalizedUnits === "milliseconds") {
        // Convert milliseconds to seconds
        return `PT${value / 1000}S`;
      } else if (normalizedUnits === "min" || normalizedUnits === "minute" || normalizedUnits === "minutes") {
        return `PT${value}M`;
      } else if (normalizedUnits === "h" || normalizedUnits === "hr" || normalizedUnits === "hour" || normalizedUnits === "hours") {
        return `PT${value}H`;
      } else if (normalizedUnits === "d" || normalizedUnits === "day" || normalizedUnits === "days") {
        return `P${value}D`;
      } else if (normalizedUnits === "w" || normalizedUnits === "week" || normalizedUnits === "weeks") {
        return `P${value}W`;
      } else if (normalizedUnits === "mo" || normalizedUnits === "month" || normalizedUnits === "months") {
        return `P${value}M`;
      } else if (normalizedUnits === "y" || normalizedUnits === "year" || normalizedUnits === "years") {
        return `P${value}Y`;
      }
      // Default to seconds if unknown unit
      return `PT${value}S`;
    }
    static #_ = (() => this.ɵfac = function EventListenerGenerationAlgorithm_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || EventListenerGenerationAlgorithm)();
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: EventListenerGenerationAlgorithm,
      factory: EventListenerGenerationAlgorithm.ɵfac,
      providedIn: "root"
    }))();
  }
  return EventListenerGenerationAlgorithm;
})();