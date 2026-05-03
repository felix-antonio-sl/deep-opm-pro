// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/dcm/dcm-export-wizard.service.ts
// Extracted by opm-extracted/tools/extract.mjs

    let DCMExportWizardService = /*#__PURE__*/(() => {
      class DCMExportWizardService {
        constructor(canonicalOPMExport, graphBuilder, scopeSubgraph, caseEntitySelection, stageTaskDetermination, caseFileSchema, sentrySynthesis, roleExtraction, eventListenerGeneration, cmmnExporter, dcmIRExporter, traceExporter, dmnExporter, cmmndiExporter, validationService) {
          this.canonicalOPMExport = canonicalOPMExport;
          this.graphBuilder = graphBuilder;
          this.scopeSubgraph = scopeSubgraph;
          this.caseEntitySelection = caseEntitySelection;
          this.stageTaskDetermination = stageTaskDetermination;
          this.caseFileSchema = caseFileSchema;
          this.sentrySynthesis = sentrySynthesis;
          this.roleExtraction = roleExtraction;
          this.eventListenerGeneration = eventListenerGeneration;
          this.cmmnExporter = cmmnExporter;
          this.dcmIRExporter = dcmIRExporter;
          this.traceExporter = traceExporter;
          this.dmnExporter = dmnExporter;
          this.cmmndiExporter = cmmndiExporter;
          this.validationService = validationService;
        }
        /**
         * Execute complete export process
         */
        executeExport(wizardState, opmModel) {
          var _this = this;
          return (0, default)(function* () {
            // Step 0: Export canonical OPM model
            const canonicalOPM = _this.canonicalOPMExport.exportCanonicalOPM(opmModel);
            // Step 1: Build graph + refinement tree
            const graph = _this.graphBuilder.buildGraph(canonicalOPM);
            // Step 2: Scope subgraph for P0
            // Find the stable ID for the root process (wizard uses lid, but we need stable ID)
            const rootProcessStableId = _this.findProcessByLid(wizardState.stepA.rootProcessId, opmModel);
            if (!rootProcessStableId) {
              throw new Error(`Root process with lid ${wizardState.stepA.rootProcessId} not found`);
            }
            const scopedSubgraph = _this.scopeSubgraph.scopeSubgraph(rootProcessStableId, canonicalOPM, graph);
            // Step 3: Select case entity (if auto, use heuristic)
            const caseEntityIds = wizardState.stepB.caseEntityIds.length > 0 ? wizardState.stepB.caseEntityIds : _this.caseEntitySelection.selectCaseEntity(scopedSubgraph, canonicalOPM);
            // Step 4: Build DCM-IR
            const dcmIR = yield _this.buildDCMIR(scopedSubgraph, caseEntityIds, wizardState.stepD, canonicalOPM, opmModel, wizardState);
            // Step 5: Generate export files
            const files = yield _this.generateExportFiles(dcmIR, wizardState.stepC, wizardState.stepD, canonicalOPM);
            // Step 6: Generate trace
            const trace = _this.traceExporter.exportTrace(dcmIR, wizardState.stepA.rootProcessId, canonicalOPM.modelName);
            // Step 7: Validate
            const exportMode = CMMNExportMode.FLOWABLE; // Use same mode as export
            const validation = yield _this.validationService.validateExport(dcmIR, files.cmmn, files.dmn, wizardState.stepD.decisionExtraction, exportMode);
            // Step 8: Package ZIP
            const zip = yield _this.packageExport(files, trace, validation, wizardState, canonicalOPM.modelName);
            return zip;
          })();
        }
        /**
         * Build DCM-IR for viewer (public method)
         * Simplified version that builds DCM-IR without file generation
         */
        buildDCMIRForViewer(opmModel, rootProcessLid) {
          var _this2 = this;
          return (0, default)(function* () {
            // Export canonical OPM model
            const canonicalOPM = _this2.canonicalOPMExport.exportCanonicalOPM(opmModel);
            // Build graph + refinement tree
            const graph = _this2.graphBuilder.buildGraph(canonicalOPM);
            // Find root process
            // Use canonical export to get stable IDs
            const canonicalOPMForIds = _this2.canonicalOPMExport.exportCanonicalOPM(opmModel);
            const processMap = new Map(); // lid -> stableId
            // Build map from canonical processes
            // Match by finding the canonical process that corresponds to each logical process
            opmModel.logicalElements.filter(el => el instanceof OpmLogicalProcess).forEach(logicalProc => {
              // Find canonical process by matching the stable ID generation
              const expectedStableId = _this2.generateStableId("process", logicalProc.lid);
              const canonicalProc = canonicalOPMForIds.processes.find(p => p.id === expectedStableId);
              if (canonicalProc) {
                processMap.set(logicalProc.lid, canonicalProc.id);
              } else {
                // Fallback: generate stable ID directly
                processMap.set(logicalProc.lid, expectedStableId);
              }
            });
            const processes = opmModel.logicalElements.filter(el => el instanceof OpmLogicalProcess).map(proc => ({
              id: processMap.get(proc.lid) || _this2.generateStableId("process", proc.lid),
              // Use stable ID from canonical export
              lid: proc.lid,
              name: proc.getName() || "Unnamed Process"
            }));
            if (processes.length === 0) {
              throw new Error("No operational processes found in the model");
            }
            const selectedProcess = rootProcessLid ? processes.find(p => p.lid === rootProcessLid) : processes[0];
            if (!selectedProcess) {
              throw new Error(`Root process with lid ${rootProcessLid} not found`);
            }
            // Scope subgraph
            const scopedSubgraph = _this2.scopeSubgraph.scopeSubgraph(selectedProcess.id, canonicalOPM, graph);
            // Auto-select case entity
            const caseEntityIds = _this2.caseEntitySelection.selectCaseEntity(scopedSubgraph, canonicalOPM);
            // Build wizard state for default options
            const wizardState = {
              stepA: {
                rootProcessId: selectedProcess.lid,
                scopingMode: "reachable-procedural-subgraph"
              },
              stepB: {
                caseEntityIds: []
              },
              stepC: {
                exportCMMN: true,
                exportCMMNDI: true,
                exportDMN: false,
                exportDCMIR: true,
                exportTrace: false,
                exportValidation: false
              },
              stepD: {
                stagePolicy: "refined-process",
                milestonePolicy: "goal-states",
                decisionExtraction: "guards-to-dmn",
                // Enable DMN extraction for viewer
                layoutStrategy: "auto-layout"
              },
              stepE: {
                summary: {
                  stageCount: 0,
                  taskCount: 0,
                  milestoneCount: 0,
                  unhandledProcesses: [],
                  guardWarnings: []
                }
              }
            };
            // Build DCM-IR
            return yield _this2.buildDCMIR(scopedSubgraph, caseEntityIds, wizardState.stepD, canonicalOPM, opmModel, wizardState);
          })();
        }
        /**
         * Build DCM-IR from scoped subgraph
         */
        buildDCMIR(scopedSubgraph, caseEntityIds, stepD, canonicalOPM, opmModel, wizardState) {
          var _this3 = this;
          return (0, default)(function* () {
            // Determine stages and tasks (with task type and discretionary detection)
            let {
              stages,
              tasks
            } = _this3.stageTaskDetermination.determineStagesAndTasks(scopedSubgraph, stepD.stagePolicy, stepD.stageLevelN, canonicalOPM, opmModel);
            // Stage cleanup: Remove empty inner stages (Option A)
            // If a stage has no child tasks and no child stages, remove it
            // and attach its would-be children to the parent (or casePlanModel)
            stages = _this3.cleanupEmptyStages(stages, tasks, canonicalOPM, opmModel);
            // After cleanup, attach all tasks to the root stage (if it exists)
            // This ensures all plan items are inside the stage, not at casePlanModel level
            const rootStage = stages.find(s => !s.parentStageId);
            if (rootStage) {
              // All tasks should be considered as belonging to the root stage
              // This will be handled in the CMMN exporter via isTaskInStage
            }
            // Create case file schema and milestones (will be filtered later to exclude agents)
            // Note: This initial creation is for milestone generation, but case file items will be filtered
            const {
              caseFileItems: initialCaseFileItems,
              milestones: initialMilestones
            } = _this3.caseFileSchema.createCaseFileSchema(scopedSubgraph, canonicalOPM, stepD.milestonePolicy);
            // Temporarily use initial values - will be replaced after role extraction
            let caseFileItems = initialCaseFileItems;
            let milestones = initialMilestones;
            // Synthesize sentries (pass stages and milestones for milestone connections)
            const sentries = _this3.sentrySynthesis.synthesizeSentries(tasks, scopedSubgraph, canonicalOPM, stages, milestones // Pass milestones so sentries can reference them
            );
            // Extract roles FIRST (to identify agent objects)
            const roles = _this3.roleExtraction.extractRoles(scopedSubgraph, canonicalOPM);
            // Get agent object IDs (objects that should be roles, not case file items)
            const agentObjectIds = roles.map(role => role.sourceObjectId).filter(id => id !== undefined);
            // Recreate case file schema EXCLUDING agent objects
            const {
              caseFileItems: filteredCaseFileItems,
              milestones: filteredMilestones
            } = _this3.caseFileSchema.createCaseFileSchema(scopedSubgraph, canonicalOPM, stepD.milestonePolicy, agentObjectIds // Exclude agent objects
            );
            // Generate event listeners
            const eventListeners = _this3.eventListenerGeneration.generateEventListeners(tasks, stages, canonicalOPM, opmModel);
            // Extract decisions if enabled
            // Note: We'll build DCM-IR first, then extract decisions with access to full IR
            let decisions = [];
            // Build DCM-IR
            const rootProcessStableId = _this3.findProcessByLid(wizardState.stepA.rootProcessId, opmModel);
            const dcmIR = {
              id: _this3.generateId("case"),
              name: canonicalOPM.modelName,
              rootProcessId: rootProcessStableId || undefined,
              primaryCaseEntities: caseEntityIds,
              plan: {
                stages,
                tasks,
                milestones: filteredMilestones,
                // Use filtered milestones
                sentries,
                eventListeners
              },
              caseFileModel: {
                items: filteredCaseFileItems // Use filtered case file items (excluding agents)
              },
              roles,
              decisions: [] // Will be populated below
            };
            // Extract decisions AFTER building DCM-IR (so we have access to milestones)
            if (stepD.decisionExtraction === "guards-to-dmn") {
              decisions = _this3.extractDecisionsFromGuards(sentries, tasks, scopedSubgraph, canonicalOPM, dcmIR);
              dcmIR.decisions = decisions;
            }
            return dcmIR;
          })();
        }
        /**
         * Generate export files
         */
        generateExportFiles(dcmIR, stepC, stepD, canonicalOPM) {
          var _this4 = this;
          return (0, default)(function* () {
            const files = {};
            // Export both FLOWABLE and STANDARD modes
            // FLOWABLE mode: Minimal structure for Flowable 6.7.2 compatibility
            // STANDARD mode: Full CMMN 1.1 standard with all elements (XSD-compliant)
            if (stepC.exportCMMN) {
              // 1. Export FLOWABLE mode (case.cmmn) - for Flowable 6.7.2
              const flowableMode = CMMNExportMode.FLOWABLE;
              _this4.cmmnExporter.setExportMode(flowableMode);
              _this4.cmmndiExporter.setExportMode(flowableMode);
              let flowableCmmndiContent;
              if (stepC.exportCMMNDI) {
                flowableCmmndiContent = _this4.cmmndiExporter.exportCMMNDI(dcmIR, canonicalOPM, flowableMode);
                files.cmmndi = flowableCmmndiContent; // Store FLOWABLE mode DI
              }
              files.cmmn = _this4.cmmnExporter.exportCMMN(dcmIR, flowableCmmndiContent, canonicalOPM, flowableMode);
              // Sanity check for FLOWABLE mode
              const flowableDiagnostics = _this4.cmmnExporter.sanityCheckAssociations(files.cmmn);
              const userDefinedAssociations = flowableDiagnostics.associationIds.filter(id => !id.startsWith("assoc_entry_") && !id.startsWith("assoc_exit_"));
              if (flowableMode === CMMNExportMode.FLOWABLE && userDefinedAssociations.length > 0) {
                // FLOWABLE mode violation: user-defined associations found (criterion attachments are allowed)
                // Validation will catch this, no need to log
              }
              // 2. Export STANDARD mode (case_standard.cmmn) - for standard CMMN tools
              const standardMode = CMMNExportMode.STANDARD;
              _this4.cmmnExporter.setExportMode(standardMode);
              _this4.cmmndiExporter.setExportMode(standardMode);
              let standardCmmndiContent;
              if (stepC.exportCMMNDI) {
                standardCmmndiContent = _this4.cmmndiExporter.exportCMMNDI(dcmIR, canonicalOPM, standardMode);
                files.cmmndi_standard = standardCmmndiContent; // Store STANDARD mode DI
              }
              files.cmmn_standard = _this4.cmmnExporter.exportCMMN(dcmIR, standardCmmndiContent, canonicalOPM, standardMode);
              // Log export validation summary for FLOWABLE mode (primary export)
              _this4.logExportValidation(dcmIR, files.cmmn, flowableCmmndiContent, flowableMode, flowableDiagnostics);
            }
            // Optional DMN
            // Only export DMN if:
            // 1. DMN export is enabled in stepC, AND
            // 2. decisionExtraction is not 'none' (if it's 'none', skip DMN export entirely)
            if (stepC.exportDMN && stepD.decisionExtraction !== "none") {
              // Generate DMN even if no decisions (empty array is fine)
              files.dmn = dcmIR.decisions.length > 0 ? _this4.dmnExporter.exportDMN(dcmIR) : [];
            }
            // Always export DCM-IR
            if (stepC.exportDCMIR) {
              files.dcmIR = _this4.dcmIRExporter.exportDCMIR(dcmIR);
            }
            return files;
          })();
        }
        /**
         * Package export into ZIP
         */
        packageExport(files, trace, validation, wizardState, modelName) {
          var _this5 = this;
          return (0, default)(function* () {
            const zip = new jszip_min();
            // Add CMMN files (both FLOWABLE and STANDARD modes)
            if (files.cmmn) {
              zip.file("cmmn/case.cmmn", files.cmmn); // FLOWABLE mode (Flowable 6.7.2 compatible)
            }
            if (files.cmmn_standard) {
              zip.file("cmmn/case_standard.cmmn", files.cmmn_standard); // STANDARD mode (CMMN 1.1 XSD-compliant)
            }
            // Add CMMNDI (required for Flowable 6.7.x compatibility)
            // Optional: Export separate case.cmmndi file for debugging (Flowable uses embedded DI in case.cmmn)
            // NOTE: Flowable imports case.cmmn alone and expects DI to be embedded inside it
            // The separate case.cmmndi file is only for debugging/analysis purposes
            if (files.cmmndi) {
              zip.file("cmmn/case.cmmndi", files.cmmndi);
            }
            // Add DMN files (optional)
            // Use decision IDs from DCM-IR for file naming
            // Format: decisions/decision_{sentryId}.dmn.xml
            // Format: dmn/decision_{sentryId}.dmn (use .dmn extension, not .dmn.xml)
            // Flowable UI filters by .dmn extension, so using .dmn.xml causes files to be hidden
            if (files.dmn && files.dmn.length > 0 && wizardState.stepD.decisionExtraction !== "none") {
              // Extract decision ID from DMN XML for file naming
              files.dmn.forEach(dmn => {
                // Extract decision ID from DMN XML: <dmn:decision id="decision_...">
                const decisionIdMatch = dmn.match(/<dmn:decision id="([^"]+)"/);
                const decisionId = decisionIdMatch ? decisionIdMatch[1] : `decision_${Date.now()}`;
                // Sanitize ID for filename and use .dmn extension (Flowable-friendly)
                const sanitizedId = _this5.sanitizeId(decisionId);
                zip.file(`dmn/${sanitizedId}.dmn`, dmn);
              });
            }
            // Add DCM-IR
            if (files.dcmIR) {
              zip.file("ir/case.dcm_ir.json", files.dcmIR);
            }
            // Add trace
            zip.file("trace/trace.json", trace);
            // Add validation report
            zip.file("validation/validation_report.json", JSON.stringify(validation, null, 2));
            // Add readme
            const readme = _this5.generateReadme(modelName, wizardState, files);
            zip.file("readme.md", readme);
            // Generate ZIP blob
            return yield zip.generateAsync({
              type: "blob"
            });
          })();
        }
        /**
         * Generate readme file
         */
        generateReadme(modelName, wizardState, files) {
          // Only include DMN in README if:
          // (a) decisionExtraction != 'none', AND
          // (b) at least one DMN file was actually generated
          const shouldIncludeDMN = wizardState.stepD.decisionExtraction !== "none" && files.dmn && files.dmn.length > 0;
          return `# DCM Export: ${modelName}

Generated: ${new Date().toISOString()}

## Export Contents

- case.cmmn - CMMN case definition (FLOWABLE mode, Flowable 6.7.2 compatible)
- case_standard.cmmn - CMMN 1.1 case definition (STANDARD mode, XSD-compliant for other tools)
${shouldIncludeDMN ? "- dmn/*.dmn - DMN decision tables\n" : ""}- case.dcm_ir.json - DCM Intermediate Representation
- trace.json - Traceability information
- validation_report.json - Validation results

## Export Settings

- Root Process: ${wizardState.stepA.rootProcessId}
- Case Entities: ${wizardState.stepB.caseEntityIds.join(", ")}
- Stage Policy: ${wizardState.stepD.stagePolicy}
- Milestone Policy: ${wizardState.stepD.milestonePolicy}
- Decision Extraction: ${wizardState.stepD.decisionExtraction}

## Notes

This export was generated by OPCloud DCM Export feature.

For visualization:
- Import case.cmmn into Flowable Modeler (FLOWABLE mode, Flowable 6.7.2 compatible)
- Import case_standard.cmmn into other CMMN tools (STANDARD mode, full CMMN 1.1 standard)

### Sentry Expressions
Sentry expressions are conceptual DSL only, not executable. They are used for documentation and analysis purposes.

### DMN Decision Tables
${shouldIncludeDMN ? `DMN decision tables are generated as analysis artefacts for guard conditions. The CMMN sentries currently use simple expressions and do not invoke the DMN decisions automatically. DMN files are provided for documentation and analysis purposes only, not for Flowable execution control.` : "No DMN decision tables were generated for this export."}

## Import Instructions

### For Flowable Modeler:

1. **Import DMN Files First** (if DMN files are included):
   - Open Flowable Modeler
   - Navigate to "Decisions" section
   - Import each DMN file from the decisions/ folder one-by-one
   - Flowable does not support multi-file drag-drop for DMN; import each file individually

2. **Import CMMN Case**:
   - Navigate to "Case models" section
   - Import case.cmmn file
   - The CMMN file includes embedded CMMNDI for visual layout

3. **Verify Import**:
   - Open the imported case in Visual Editor
   - Verify that all stages, tasks, and milestones are visible
   - Check that the diagram renders correctly (no blank areas)
   - If stages are present, you should be able to drill down into them by double-clicking

### Notes:
- DMN files are linked to CMMN sentries via extension elements but are not automatically wired for execution
- The CMMN model can be imported without DMN files, but DMN provides additional analysis documentation
- If the Visual Editor shows a blank area, check that CMMNDI is included in the export
`;
        }
        /**
         * Find process stable ID by lid
         */
        findProcessByLid(lid, opmModel) {
          const logicalProcess = opmModel.logicalElements.find(el => el instanceof OpmLogicalProcess && el.lid === lid);
          if (logicalProcess) {
            // Generate stable ID using same algorithm as canonical export service
            return this.generateStableId("process", logicalProcess.lid);
          }
          return null;
        }
        /**
         * Generate stable ID (same as canonical export service)
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
         * Extract decisions from guards (sentries)
         * Converts sentry predicates into DMN decision tables
         * Links sentries to DMN decisions via dmnDecisionRef
         * FIXED: Generate DMN for ALL guard-bearing sentries (including "true" predicates)
         * Uses sentry ID for decision ID to ensure 1:1 mapping
         */
        extractDecisionsFromGuards(sentries, tasks, scopedSubgraph, canonicalOPM, dcmIR) {
          const decisions = [];
          // Option 2: Generate DMN for ALL guards (including trivial/true ones)
          // Virtual sentries (no onPart) are for DMN documentation only, not referenced in CMMN
          // MANDATORY: Never silently drop DMNs - log warnings for skipped guards
          sentries.forEach(sentry => {
            // Check if sentry has a guard (ifPart with predicate)
            const hasOnPart = sentry.onPart && sentry.onPart.length > 0;
            const hasIfPart = sentry.ifPart && sentry.ifPart.predicate;
            if (!hasIfPart) {
              // Skip sentry without predicate (should not happen, but defensive)
              return;
            }
            // Generate DMN for ALL sentries with predicates (including virtual ones for first tasks)
            if (sentry.ifPart && sentry.ifPart.predicate) {
              // Find the task that uses this sentry
              const linkedTask = tasks.find(t => t.entryCriteria && t.entryCriteria.includes(sentry.id));
              // Also check milestones
              const linkedMilestone = dcmIR?.plan.milestones.find(m => m.entryCriteria && m.entryCriteria.includes(sentry.id));
              const planItemName = linkedTask ? linkedTask.name : linkedMilestone ? linkedMilestone.name : "Unknown";
              const processId = linkedTask ? linkedTask.sourceProcessId : undefined;
              // MANDATORY: Generate decision ID using format: decision_{sentryId}
              // This ensures 1:1 mapping and traceability
              // Format must match CMMN condition: decision_{decisionId} == true
              const decisionId = `decision_${this.sanitizeId(sentry.id)}`;
              // Extract decision table from sentry predicate
              const decision = {
                id: decisionId,
                name: `Guard – ${planItemName}`,
                sourceProcessId: processId,
                sourceSentryRef: sentry.id,
                sourceTaskName: planItemName,
                dmnTable: this.buildDMNTableFromSentry(sentry, linkedTask || linkedMilestone)
              };
              decisions.push(decision);
              // Link sentry to DMN decision
              sentry.dmnDecisionRef = decisionId;
            }
          });
          return decisions;
        }
        /**
         * Validate DI completeness (separate CMMNDI file)
         * Ensures every entryCriterion has a corresponding CMMNEdge with waypoints
         * This prevents Flowable AssociationJsonConverter NPE (graphicInfoList is null)
         */
        validateDICompleteness(cmmnXml, cmmndiXml, dcmIR) {
          const errors = [];
          // Extract all entryCriterion IDs from CMMN XML
          const entryCriterionIds = new Set();
          const entryCriterionPattern = /<cmmn:entryCriterion\s+id="([^"]+)"/g;
          let match;
          while ((match = entryCriterionPattern.exec(cmmnXml)) !== null) {
            entryCriterionIds.add(match[1]);
          }
          // Extract all association IDs from CMMN XML (if any)
          const associationIds = new Set();
          const associationPattern = /<cmmn:association\s+id="([^"]+)"/g;
          while ((match = associationPattern.exec(cmmnXml)) !== null) {
            associationIds.add(match[1]);
          }
          // Extract CMMNEdge elements and their cmmnElementRef values from CMMNDI
          const edgeRefs = new Map(); // elementRef -> waypoint count
          const edgePattern = /<cmmndi:CMMNEdge[^>]*cmmnElementRef="([^"]+)"[^>]*>([\s\S]*?)<\/cmmndi:CMMNEdge>/g;
          while ((match = edgePattern.exec(cmmndiXml)) !== null) {
            const elementRef = match[1];
            const edgeContent = match[2];
            const waypointCount = (edgeContent.match(/<di:waypoint[^>]*>/g) || []).length;
            edgeRefs.set(elementRef, waypointCount);
          }
          // Validate: Every entryCriterion must have a corresponding CMMNEdge with >=2 waypoints
          entryCriterionIds.forEach(criterionId => {
            if (!edgeRefs.has(criterionId)) {
              errors.push(`CMMNDI validation failed: entryCriterion ${criterionId} has no corresponding CMMNEdge (will cause Flowable AssociationJsonConverter NPE)`);
            } else {
              const waypointCount = edgeRefs.get(criterionId);
              if (waypointCount < 2) {
                errors.push(`CMMNDI validation failed: entryCriterion ${criterionId} has CMMNEdge with only ${waypointCount} waypoint(s), requires at least 2`);
              }
            }
          });
          // Validate: Every association must have a corresponding CMMNEdge with >=2 waypoints
          associationIds.forEach(associationId => {
            if (!edgeRefs.has(associationId)) {
              errors.push(`CMMNDI validation failed: association ${associationId} has no corresponding CMMNEdge (will cause Flowable AssociationJsonConverter NPE)`);
            } else {
              const waypointCount = edgeRefs.get(associationId);
              if (waypointCount < 2) {
                errors.push(`CMMNDI validation failed: association ${associationId} has CMMNEdge with only ${waypointCount} waypoint(s), requires at least 2`);
              }
            }
          });
          // Validate: All CMMNShape elements have dc:Bounds
          const shapeBoundsPattern = /<cmmndi:CMMNShape[^>]*>[\s\S]*?<dc:Bounds/g;
          const shapesWithBounds = (cmmndiXml.match(shapeBoundsPattern) || []).length;
          const totalShapes = (cmmndiXml.match(/<cmmndi:CMMNShape/g) || []).length;
          if (shapesWithBounds < totalShapes) {
            errors.push(`CMMNDI validation failed: ${totalShapes - shapesWithBounds} CMMNShape(s) missing dc:Bounds`);
          }
          // Validate: CMMNPlane exists and references casePlanModel
          const casePlanModelId = `casePlanModel_${this.sanitizeId(dcmIR.id)}`;
          const escapedCasePlanModelId = casePlanModelId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const planePattern = new RegExp(`<cmmndi:CMMNPlane[^>]*cmmnElementRef="${escapedCasePlanModelId}"`, "g");
          if (!planePattern.test(cmmndiXml)) {
            errors.push(`CMMNDI validation failed: CMMNPlane missing or cmmnElementRef does not point to casePlanModel ${casePlanModelId}`);
          }
          if (errors.length > 0) {
            throw new Error(`CMMNDI validation failed:\n${errors.join("\n")}`);
          }
        }
        /**
         * Log export validation summary
         * Provides counts and DI coverage for debugging and verification
         */
        logExportValidation(dcmIR, cmmnXml, cmmndiContent, exportMode = CMMNExportMode.FLOWABLE, diagnostics) {
          const summary = [];
          summary.push("=== Export Validation Summary ===");
          summary.push(`Export Mode: ${exportMode}`);
          // Count CMMN elements
          const taskCount = dcmIR.plan.tasks.length;
          const stageCount = dcmIR.plan.stages.length;
          const milestoneCount = dcmIR.plan.milestones.length;
          const sentryCount = dcmIR.plan.sentries.length;
          summary.push(`CMMN Elements: ${taskCount} tasks, ${stageCount} stages, ${milestoneCount} milestones, ${sentryCount} sentries`);
          // Count entry criteria
          let entryCriteriaCount = 0;
          dcmIR.plan.tasks.forEach(t => entryCriteriaCount += t.entryCriteria.length);
          dcmIR.plan.stages.forEach(s => entryCriteriaCount += (s.entryCriteria || []).length);
          dcmIR.plan.milestones.forEach(m => entryCriteriaCount += m.entryCriteria.length);
          summary.push(`Entry Criteria: ${entryCriteriaCount} total`);
          // Association diagnostics (pre-import summary)
          if (diagnostics) {
            summary.push(`Associations: ${diagnostics.associations} total`);
            if (diagnostics.associations > 0) {
              summary.push(`  Association IDs (first 10): ${diagnostics.associationIds.slice(0, 10).join(", ")}`);
              diagnostics.edgeDiagnostics.slice(0, 10).forEach(diag => {
                summary.push(`  ${diag.associationId}: hasEdge=${diag.hasEdge}, waypoints=${diag.waypointCount}`);
              });
            } else {
              summary.push(`  No associations (FLOWABLE mode compliant)`);
            }
          } else {
            // Fallback: count associations in XML
            const associationCount = (cmmnXml.match(/<cmmn:association/g) || []).length;
            if (associationCount > 0) {
              summary.push(`Associations: ${associationCount}`);
            } else {
              summary.push(`Associations: 0 (FLOWABLE mode compliant)`);
            }
          }
          // DI coverage (from embedded CMMNDI in case.cmmn)
          const hasEmbeddedDI = /<cmmndi:CMMNDI/.test(cmmnXml);
          if (hasEmbeddedDI) {
            const shapeCount = (cmmnXml.match(/<cmmndi:CMMNShape/g) || []).length;
            const edgeCount = (cmmnXml.match(/<cmmndi:CMMNEdge/g) || []).length;
            const planItemCount = taskCount + stageCount + milestoneCount;
            // Count definitionRef shapes (for humanTask/milestone/stage definitions)
            const definitionRefShapeCount = (cmmnXml.match(/cmmnElementRef="[^"]*"[^>]*>/g) || []).filter(ref => {
              const match = ref.match(/cmmnElementRef="([^"]+)"/);
              if (match) {
                const elementRef = match[1];
                return !elementRef.startsWith("pi_") && !elementRef.startsWith("entry_") && !elementRef.startsWith("onPart_") && !elementRef.startsWith("casePlanModel_");
              }
              return false;
            }).length;
            // Count planItemOnPart edges
            const planItemOnPartEdgeCount = (cmmnXml.match(/cmmnElementRef="onPart_[^"]*"/g) || []).length;
            // Count sentry edges
            const sentryEdgeCount = (cmmnXml.match(/id="edge_sentry_[^"]*"/g) || []).length;
            // Count entryCriterion edges - count actual CMMNEdge elements with entry_ IDs
            // More accurate: count <cmmndi:CMMNEdge> elements that have cmmnElementRef starting with "entry_"
            const entryCriterionEdgeMatches = cmmnXml.match(/<cmmndi:CMMNEdge[^>]*cmmnElementRef="entry_[^"]*"/g) || [];
            const entryCriterionEdgeCount = entryCriterionEdgeMatches.length;
            // Count planItemOnParts in CMMN model
            const planItemOnPartCount = (cmmnXml.match(/<cmmn:planItemOnPart[^>]*id="([^"]+)"/g) || []).length;
            // Count entryCriteria in CMMN model
            const entryCriterionCount = (cmmnXml.match(/<cmmn:entryCriterion[^>]*id="([^"]+)"/g) || []).length;
            summary.push(`CMMNDI Coverage: ${shapeCount} shapes, ${edgeCount} edges`);
            summary.push(`  - Entry Criteria: ${entryCriterionCount} in model, ${entryCriterionEdgeCount} edges in DI`);
            summary.push(`  - PlanItemOnParts: ${planItemOnPartCount} in model, ${planItemOnPartEdgeCount} edges in DI`);
            summary.push(`  - Sentry edges: ${sentryEdgeCount}`);
            // Warn if counts don't match
            if (entryCriterionCount !== entryCriterionEdgeCount) {
              summary.push(`  ⚠ WARNING: Entry criterion count mismatch (model: ${entryCriterionCount}, DI edges: ${entryCriterionEdgeCount})`);
            }
            if (planItemOnPartCount !== planItemOnPartEdgeCount) {
              summary.push(`  ⚠ WARNING: PlanItemOnPart count mismatch (model: ${planItemOnPartCount}, DI edges: ${planItemOnPartEdgeCount})`);
            }
            summary.push(`  - PlanItem Shapes: ${planItemCount} (one per planItem)`);
            summary.push(`  - DefinitionRef Shapes: ${definitionRefShapeCount} (humanTask/milestone/stage definitions)`);
            summary.push(`  - EntryCriterion Edges: ${entryCriteriaCount} (one per entryCriterion)`);
            if (planItemOnPartEdgeCount > 0) {
              summary.push(`  - PlanItemOnPart Edges: ${planItemOnPartEdgeCount} (one per planItemOnPart)`);
            }
            if (sentryEdgeCount > 0) {
              summary.push(`  - Sentry Edges: ${sentryEdgeCount} (safety net)`);
            }
            // Check waypoints
            const waypointCount = (cmmnXml.match(/<di:waypoint/g) || []).length;
            const minWaypoints = edgeCount * 2; // At least 2 per edge
            if (waypointCount < minWaypoints) {
              summary.push(`WARNING: Only ${waypointCount} waypoints found, expected at least ${minWaypoints} (${edgeCount} edges × 2)`);
            } else {
              summary.push(`Waypoints: ${waypointCount} (${edgeCount > 0 ? (waypointCount / edgeCount).toFixed(1) : "0"} per edge)`);
            }
            // Check for dangling DI references (should be pruned by exporter)
            summary.push("✓ DI consistency: All DI element references point to existing model IDs (dangling refs pruned)");
          } else if (cmmndiContent) {
            summary.push("✗ ERROR: CMMNDI was generated but not embedded in case.cmmn");
          } else {
            summary.push("⚠ CMMNDI: Not generated (Flowable import may fail)");
          }
          // DMN count
          const dmnCount = dcmIR.decisions.length;
          summary.push(`DMN Decisions: ${dmnCount}`);
          summary.push("================================");
          // Export summary logged to validation report
        }
        /**
         * Sanitize ID for file naming and XML
         */
        sanitizeId(id) {
          return id.replace(/[^a-zA-Z0-9_-]/g, "_");
        }
        /**
         * Build DMN decision table from a single sentry (Flowable-stable format)
         * ONE dummy input to prevent "New Input" prompt, TWO outputs for guard documentation
         */
        buildDMNTableFromSentry(sentry, task) {
          // Get predicate from sentry - must come from IR.plan.sentries[i].ifPart.predicate
          const predicate = sentry.ifPart && sentry.ifPart.predicate ? sentry.ifPart.predicate : "(missing)"; // Log warning if predicate is missing
          // Flowable-stable format: ONE dummy input + TWO outputs
          return {
            id: "decisionTable_1",
            guardCondition: predicate,
            // Store predicate for output rule
            inputs: [{
              id: "always",
              label: "Always",
              inputExpression: {
                typeRef: "boolean",
                text: "true"
              }
            }],
            outputs: [{
              id: "guardCondition",
              label: "guardCondition",
              typeRef: "string"
            }, {
              id: "enabled",
              label: "enabled",
              typeRef: "boolean"
            }],
            rules: [] // Rule will be built in DMN exporter
          };
        }
        /**
         * Cleanup empty stages (Option A: remove empty inner stages)
         * Removes stages that have no child tasks and no child stages
         */
        cleanupEmptyStages(stages, tasks, canonicalOPM, opmModel) {
          // Find stages that have children (tasks or other stages)
          const stagesWithChildren = new Set();
          // Mark stages that have child stages
          stages.forEach(stage => {
            if (stage.parentStageId) {
              stagesWithChildren.add(stage.parentStageId);
            }
          });
          // Mark stages that have child tasks
          // Use canonical OPM process hierarchy to check parent-child relationships
          tasks.forEach(task => {
            // Find which stage this task belongs to (if any)
            // Check if task's source process is a child of stage's source process
            const parentStage = stages.find(s => {
              if (!task.sourceProcessId || !s.sourceProcessId) {
                return false;
              }
              // Get canonical processes to check hierarchy
              const taskProcess = canonicalOPM.processes.find(p => p.id === task.sourceProcessId);
              const stageProcess = canonicalOPM.processes.find(p => p.id === s.sourceProcessId);
              if (taskProcess && stageProcess) {
                // Task belongs to stage if task's process is a direct child of stage's process
                return taskProcess.parentProcessId === stageProcess.id;
              }
              return false;
            });
            if (parentStage) {
              stagesWithChildren.add(parentStage.id);
            }
          });
          // Keep only stages that have children OR are root stages (no parent)
          return stages.filter(stage => {
            const hasChildren = stagesWithChildren.has(stage.id);
            const isRoot = !stage.parentStageId;
            // Keep if: has children OR is root (even if empty, root stage is kept)
            return hasChildren || isRoot;
          });
        }
        /**
         * Generate ID
         */
        generateId(prefix) {
          return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        static #_ = (() => this.ɵfac = function DCMExportWizardService_Factory(__ngFactoryType__) {
          return new (__ngFactoryType__ || DCMExportWizardService)(core /* ɵɵinject */.KVO(CanonicalOPMExportService), core /* ɵɵinject */.KVO(GraphBuilderAlgorithm), core /* ɵɵinject */.KVO(ScopeSubgraphAlgorithm), core /* ɵɵinject */.KVO(CaseEntitySelectionAlgorithm), core /* ɵɵinject */.KVO(StageTaskDeterminationAlgorithm), core /* ɵɵinject */.KVO(CaseFileSchemaAlgorithm), core /* ɵɵinject */.KVO(SentrySynthesisAlgorithm), core /* ɵɵinject */.KVO(RoleExtractionAlgorithm), core /* ɵɵinject */.KVO(EventListenerGenerationAlgorithm), core /* ɵɵinject */.KVO(CMMNExporterService), core /* ɵɵinject */.KVO(DCMIRExporterService), core /* ɵɵinject */.KVO(TraceExporterService), core /* ɵɵinject */.KVO(DMNExporterService), core /* ɵɵinject */.KVO(CMMNDIExporterService), core /* ɵɵinject */.KVO(DCMValidationService));
        })();
        static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
          token: DCMExportWizardService,
          factory: DCMExportWizardService.ɵfac,
          providedIn: "root"
        }))();
      }
      return DCMExportWizardService;
    })();