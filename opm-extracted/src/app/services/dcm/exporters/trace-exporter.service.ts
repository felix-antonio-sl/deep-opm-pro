// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/dcm/exporters/trace-exporter.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let TraceExporterService = /*#__PURE__*/(() => {
  class TraceExporterService {
    /**
     * Export trace to JSON
     */
    exportTrace(dcmIR, rootProcessId, modelName) {
      const traces = this.generateTraces(dcmIR);
      const traceExport = {
        traces,
        metadata: {
          exportTimestamp: new Date().toISOString(),
          modelName,
          rootProcessId
        }
      };
      return JSON.stringify(traceExport, null, 2);
    }
    /**
     * Generate traces from DCM-IR
     */
    generateTraces(dcmIR) {
      const traces = [];
      // Trace stages
      dcmIR.plan.stages.forEach(stage => {
        traces.push({
          opmId: stage.sourceProcessId,
          dcmId: stage.id,
          dcmType: "stage",
          rationale: `Stage created from process: ${stage.name}`
        });
      });
      // Trace tasks
      dcmIR.plan.tasks.forEach(task => {
        traces.push({
          opmId: task.sourceProcessId,
          dcmId: task.id,
          dcmType: "task",
          rationale: `Task created from process: ${task.name}`
        });
      });
      // Trace milestones
      dcmIR.plan.milestones.forEach(milestone => {
        traces.push({
          opmId: milestone.sourceStateId,
          dcmId: milestone.id,
          dcmType: "milestone",
          rationale: `Milestone created from state: ${milestone.name}`
        });
      });
      // Trace case file items
      dcmIR.caseFileModel.items.forEach(item => {
        traces.push({
          opmId: item.objectId,
          dcmId: item.id,
          dcmType: "caseFileItem",
          rationale: `Case file item created from object: ${item.objectId}`
        });
      });
      // Trace roles
      dcmIR.roles.forEach(role => {
        if (role.sourceObjectId) {
          traces.push({
            opmId: role.sourceObjectId,
            dcmId: role.id,
            dcmType: "role",
            rationale: `Role created from agent object: ${role.name}`
          });
        }
      });
      // Trace sentries
      dcmIR.plan.sentries.forEach(sentry => {
        // Find the task that uses this sentry
        const usingTask = dcmIR.plan.tasks.find(task => task.entryCriteria.includes(sentry.id));
        if (usingTask) {
          traces.push({
            opmId: usingTask.sourceProcessId,
            // Sentry is derived from task's process
            dcmId: sentry.id,
            dcmType: "sentry",
            rationale: `Sentry for task: ${usingTask.name}, predicate: ${sentry.ifPart?.predicate || "none"}`
          });
        }
      });
      // Trace DMN decisions
      dcmIR.decisions.forEach(decision => {
        traces.push({
          opmId: decision.sourceProcessId || "unknown",
          dcmId: decision.id,
          dcmType: "decision",
          rationale: `DMN decision: ${decision.name}`
        });
      });
      return traces;
    }
    static #_ = (() => this.ɵfac = function TraceExporterService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || TraceExporterService)();
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: TraceExporterService,
      factory: TraceExporterService.ɵfac,
      providedIn: "root"
    }))();
  }
  return TraceExporterService;
})();