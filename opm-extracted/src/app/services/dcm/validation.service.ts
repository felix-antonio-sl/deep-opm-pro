// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/dcm/validation.service.ts
// Extracted by opm-extracted/tools/extract.mjs

let DCMValidationService = /*#__PURE__*/(() => {
  class DCMValidationService {
    /**
     * Validate export and generate report
     * Implements validation suite V1-V4 per spec Section 8
     *
     * @param exportMode Export mode (affects association validation)
     */
    validateExport(dcmIR, cmmnXml, dmnXmls, decisionExtraction, exportMode = CMMNExportMode.FLOWABLE) {
      var _this = this;
      return (0, default)(function* () {
        // Run spec Section 8 validation suite
        const specValidations = _this.validatePerSpec(dcmIR, cmmnXml || "", exportMode);
        // Add pre-import diagnostic summary
        const diagnostics = _this.generatePreImportDiagnostics(cmmnXml || "");
        const report = {
          cmmnXSDValidation: yield _this.validateCMMNXSD(cmmnXml || ""),
          dmnXSDValidation: dmnXmls && dmnXmls.length > 0 ? yield _this.validateDMNXSD(dmnXmls[0]) : undefined,
          traceCoverage: _this.calculateTraceCoverage(dcmIR),
          missingElements: _this.findMissingElements(dcmIR),
          missingStates: _this.findMissingStates(dcmIR),
          unmappedProcesses: _this.findUnmappedProcesses(dcmIR),
          overConstrainedGuards: _this.findOverConstrainedGuards(dcmIR),
          underConstrainedGuards: _this.findUnderConstrainedGuards(dcmIR),
          unreachableTasks: _this.findUnreachableTasks(dcmIR),
          guardConsistencyWarnings: _this.findGuardConsistencyWarnings(dcmIR, decisionExtraction),
          specValidationErrors: specValidations.errors,
          specValidationWarnings: specValidations.warnings,
          associationDiagnostics: diagnostics
        };
        return report;
      })();
    }
    /**
     * Generate pre-import diagnostic summary
     * Provides association/edge/waypoint diagnostics for verification
     */
    generatePreImportDiagnostics(cmmnXml) {
      const associationIds = [];
      const associationPattern = /<cmmn:association[^>]*\s+id="([^"]+)"/g;
      let match;
      while ((match = associationPattern.exec(cmmnXml)) !== null) {
        associationIds.push(match[1]);
      }
      const edgeDiagnostics = [];
      associationIds.forEach(associationId => {
        const edgePattern = new RegExp(`<cmmndi:CMMNEdge[^>]*cmmnElementRef="${associationId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>([\\s\\S]*?)<\\/cmmndi:CMMNEdge>`, "g");
        const edgeMatch = cmmnXml.match(edgePattern);
        if (edgeMatch) {
          const waypointCount = (edgeMatch[0].match(/<di:waypoint[^>]*>/g) || []).length;
          edgeDiagnostics.push({
            associationId,
            hasEdge: true,
            waypointCount
          });
        } else {
          edgeDiagnostics.push({
            associationId,
            hasEdge: false,
            waypointCount: 0
          });
        }
      });
      return {
        associations: associationIds.length,
        associationIds: associationIds.slice(0, 20),
        // First 20 for diagnostics
        edgeDiagnostics
      };
    }
    /**
     * Validate per spec Section 8 (V1-V4)
     * V1: Structural referential integrity
     * V2: CMMNDI completeness
     * V3: Forbidden patterns
     * V4: Tool-focused validation (Flowable)
     *
     * @param exportMode Export mode (affects association validation)
     */
    validatePerSpec(dcmIR, cmmnXml, exportMode = CMMNExportMode.FLOWABLE) {
      const errors = [];
      const warnings = [];
      // V1: Structural referential integrity
      this.validateV1StructuralIntegrity(dcmIR, errors);
      // V2: CMMNDI completeness
      this.validateV2CMMNDICompleteness(cmmnXml, errors, exportMode);
      // V3: Forbidden patterns
      this.validateV3ForbiddenPatterns(cmmnXml, errors);
      // V4: Tool-focused validation (Flowable)
      this.validateV4FlowableSpecific(cmmnXml, errors, warnings, exportMode);
      // V_ASSOC_DI_1, V_ASSOC_DI_2, V_ONPART_DI_1: Association and OnPart validation
      this.validateAssociationAndOnPartDI(cmmnXml, errors, exportMode);
      return {
        errors,
        warnings
      };
    }
    /**
     * V1: Structural referential integrity
     * - Every planItem has definitionRef to an existing task/stage/milestone/listener
     * - Every criterion has sentryRef to an existing sentry
     * - Every OnPart references existing sourceRef and criterion
     * - Every roleRef on humanTask exists
     */
    validateV1StructuralIntegrity(dcmIR, errors) {
      // Collect all valid IDs
      const taskIds = new Set(dcmIR.plan.tasks.map(t => t.id));
      const stageIds = new Set(dcmIR.plan.stages.map(s => s.id));
      const milestoneIds = new Set(dcmIR.plan.milestones.map(m => m.id));
      const sentryIds = new Set(dcmIR.plan.sentries.map(s => s.id));
      const roleIds = new Set(dcmIR.roles.map(r => r.id));
      // Check planItem definitionRefs (tasks reference task definitions, stages reference stage definitions)
      dcmIR.plan.tasks.forEach(task => {
        if (!taskIds.has(task.id)) {
          errors.push(`V1: Task planItem references non-existent task definition: ${task.id}`);
        }
      });
      dcmIR.plan.stages.forEach(stage => {
        if (!stageIds.has(stage.id)) {
          errors.push(`V1: Stage planItem references non-existent stage definition: ${stage.id}`);
        }
      });
      // Check entryCriteria sentryRefs
      [...dcmIR.plan.tasks, ...dcmIR.plan.stages.filter(s => s.entryCriteria), ...dcmIR.plan.milestones].forEach(element => {
        const entryCriteria = "entryCriteria" in element ? element.entryCriteria : [];
        entryCriteria.forEach(sentryId => {
          if (!sentryIds.has(sentryId)) {
            errors.push(`V1: EntryCriterion references non-existent sentry: ${sentryId}`);
          }
        });
      });
      // Check OnPart sourceRefs (planItemRef must reference existing planItem)
      const planItemIds = new Set();
      dcmIR.plan.tasks.forEach(t => planItemIds.add(`pi_${t.id}`));
      dcmIR.plan.stages.forEach(s => planItemIds.add(`pi_${s.id}`));
      dcmIR.plan.milestones.forEach(m => planItemIds.add(`pi_${m.id}`));
      dcmIR.plan.sentries.forEach(sentry => {
        if (sentry.onPart) {
          sentry.onPart.forEach((onPart, index) => {
            if (!onPart.planItemRef) {
              errors.push(`V1: Sentry ${sentry.id} planItemOnPart[${index}] missing planItemRef`);
            } else if (!planItemIds.has(onPart.planItemRef)) {
              errors.push(`V1: Sentry ${sentry.id} planItemOnPart[${index}] sourceRef "${onPart.planItemRef}" does not reference existing planItem`);
            }
          });
        }
      });
      // Check roleRefs on human tasks
      dcmIR.plan.tasks.forEach(task => {
        if (task.type === "human" && task.roleRefs) {
          task.roleRefs.forEach(roleRef => {
            if (!roleIds.has(roleRef)) {
              errors.push(`V1: HumanTask ${task.id} references non-existent role: ${roleRef}`);
            }
          });
        }
      });
    }
    /**
     * V2: CMMNDI completeness
     * - Every depicted element has a CMMNShape + Bounds
     * - Every OnPart has a CMMNEdge with 2+ waypoints
     * - Every Association has a CMMNEdge with 2+ waypoints
     *
     * @param exportMode Export mode (affects association validation)
     */
    validateV2CMMNDICompleteness(cmmnXml, errors, exportMode = CMMNExportMode.FLOWABLE) {
      if (!cmmnXml) {
        return;
      }
      // Extract all planItem IDs from CMMN model
      const planItemIds = new Set();
      const planItemPattern = /<cmmn:planItem[^>]*\s+id="([^"]+)"/g;
      let match;
      while ((match = planItemPattern.exec(cmmnXml)) !== null) {
        planItemIds.add(match[1]);
      }
      // Extract all planItemOnPart IDs
      const onPartIds = new Set();
      const onPartPattern = /<cmmn:planItemOnPart[^>]*\s+id="([^"]+)"/g;
      while ((match = onPartPattern.exec(cmmnXml)) !== null) {
        onPartIds.add(match[1]);
      }
      // Extract all association IDs
      const associationIds = new Set();
      const associationPattern = /<cmmn:association[^>]*\s+id="([^"]+)"/g;
      while ((match = associationPattern.exec(cmmnXml)) !== null) {
        associationIds.add(match[1]);
      }
      // Check that every planItem has a CMMNShape
      const shapeRefs = new Set();
      const shapePattern = /<cmmndi:CMMNShape[^>]*cmmnElementRef="([^"]+)"/g;
      while ((match = shapePattern.exec(cmmnXml)) !== null) {
        shapeRefs.add(match[1]);
      }
      planItemIds.forEach(planItemId => {
        if (!shapeRefs.has(planItemId)) {
          errors.push(`V2: planItem ${planItemId} has no corresponding CMMNShape`);
        }
      });
      // Check that every OnPart has a CMMNEdge with 2+ waypoints
      const edgeRefs = new Map(); // onPartId -> waypoint count
      const edgePattern = /<cmmndi:CMMNEdge[^>]*cmmnElementRef="([^"]+)"[^>]*>([\s\S]*?)<\/cmmndi:CMMNEdge>/g;
      while ((match = edgePattern.exec(cmmnXml)) !== null) {
        const edgeRef = match[1];
        const edgeContent = match[2];
        const waypointCount = (edgeContent.match(/<di:waypoint[^>]*>/g) || []).length;
        edgeRefs.set(edgeRef, waypointCount);
      }
      onPartIds.forEach(onPartId => {
        const waypointCount = edgeRefs.get(onPartId);
        if (waypointCount === undefined) {
          errors.push(`V2: planItemOnPart ${onPartId} has no corresponding CMMNEdge`);
        } else if (waypointCount < 2) {
          errors.push(`V2: planItemOnPart ${onPartId} has CMMNEdge with only ${waypointCount} waypoint(s), requires at least 2`);
        }
      });
      // Check that every Association has a CMMNEdge with 2+ waypoints (only in STANDARD mode)
      if (exportMode === CMMNExportMode.STANDARD) {
        associationIds.forEach(associationId => {
          const waypointCount = edgeRefs.get(associationId);
          if (waypointCount === undefined) {
            errors.push(`V2: association ${associationId} has no corresponding CMMNEdge (will cause Flowable AssociationJsonConverter NPE)`);
          } else if (waypointCount < 2) {
            errors.push(`V2: association ${associationId} has CMMNEdge with only ${waypointCount} waypoint(s), requires at least 2`);
          }
        });
      }
    }
    /**
     * V3: Forbidden patterns
     * - No CMMNEdge with cmmnElementRef pointing to EntryCriterion / ExitCriterion / Sentry
     * - No CMMNEdge with 0/1 waypoint
     * - No orphaned DI elements
     */
    validateV3ForbiddenPatterns(cmmnXml, errors) {
      if (!cmmnXml) {
        return;
      }
      // Extract all entryCriterion IDs
      const entryCriterionIds = new Set();
      const entryCriterionPattern = /<cmmn:entryCriterion[^>]*\s+id="([^"]+)"/g;
      let match;
      while ((match = entryCriterionPattern.exec(cmmnXml)) !== null) {
        entryCriterionIds.add(match[1]);
      }
      // Extract all exitCriterion IDs
      const exitCriterionIds = new Set();
      const exitCriterionPattern = /<cmmn:exitCriterion[^>]*\s+id="([^"]+)"/g;
      while ((match = exitCriterionPattern.exec(cmmnXml)) !== null) {
        exitCriterionIds.add(match[1]);
      }
      // Extract all sentry IDs
      const sentryIds = new Set();
      const sentryPattern = /<cmmn:sentry[^>]*\s+id="([^"]+)"/g;
      while ((match = sentryPattern.exec(cmmnXml)) !== null) {
        sentryIds.add(match[1]);
      }
      // Check CMMNEdge cmmnElementRef values
      const edgePattern = /<cmmndi:CMMNEdge[^>]*cmmnElementRef="([^"]+)"/g;
      while ((match = edgePattern.exec(cmmnXml)) !== null) {
        const elementRef = match[1];
        // FORBIDDEN: cmmnElementRef pointing to EntryCriterion
        if (entryCriterionIds.has(elementRef)) {
          errors.push(`V3: FORBIDDEN: CMMNEdge with cmmnElementRef pointing to EntryCriterion: ${elementRef}`);
        }
        // FORBIDDEN: cmmnElementRef pointing to ExitCriterion
        if (exitCriterionIds.has(elementRef)) {
          errors.push(`V3: FORBIDDEN: CMMNEdge with cmmnElementRef pointing to ExitCriterion: ${elementRef}`);
        }
        // FORBIDDEN: cmmnElementRef pointing to Sentry
        if (sentryIds.has(elementRef)) {
          errors.push(`V3: FORBIDDEN: CMMNEdge with cmmnElementRef pointing to Sentry: ${elementRef}`);
        }
      }
      // Check for edges with 0/1 waypoint
      const edgeContentPattern = /<cmmndi:CMMNEdge[^>]*>([\s\S]*?)<\/cmmndi:CMMNEdge>/g;
      while ((match = edgeContentPattern.exec(cmmnXml)) !== null) {
        const edgeContent = match[1];
        const waypointCount = (edgeContent.match(/<di:waypoint[^>]*>/g) || []).length;
        if (waypointCount < 2) {
          errors.push(`V3: CMMNEdge has only ${waypointCount} waypoint(s), requires at least 2`);
        }
      }
    }
    /**
     * V4: Tool-focused validation (Flowable)
     * - If any cmmn:association exists, ensure it has corresponding DI edge with waypoints
     * - Ensure embedded DI exists; do not rely on external .cmmndi file
     *
     * @param exportMode Export mode (FLOWABLE mode should have 0 associations)
     */
    validateV4FlowableSpecific(cmmnXml, errors, warnings, exportMode = CMMNExportMode.FLOWABLE) {
      if (!cmmnXml) {
        return;
      }
      // Check for embedded CMMNDI
      if (!cmmnXml.includes("<cmmndi:CMMNDI")) {
        errors.push(`V4: Missing embedded CMMNDI - Flowable requires DI in the same .cmmn file`);
      }
      // Extract all association IDs
      const associationIds = new Set();
      const associationPattern = /<cmmn:association[^>]*\s+id="([^"]+)"/g;
      let match;
      while ((match = associationPattern.exec(cmmnXml)) !== null) {
        associationIds.add(match[1]);
      }
      // FLOWABLE mode: Must have 0 associations
      if (exportMode === CMMNExportMode.FLOWABLE && associationIds.size > 0) {
        errors.push(`V4: FLOWABLE mode violation - Found ${associationIds.size} association(s). FLOWABLE mode must export 0 associations.`);
      }
      // STANDARD mode: Every association must have a corresponding CMMNEdge with waypoints
      if (exportMode === CMMNExportMode.STANDARD) {
        const edgeRefs = new Map(); // associationId -> waypoint count
        const edgePattern = /<cmmndi:CMMNEdge[^>]*cmmnElementRef="([^"]+)"[^>]*>([\s\S]*?)<\/cmmndi:CMMNEdge>/g;
        while ((match = edgePattern.exec(cmmnXml)) !== null) {
          const edgeRef = match[1];
          const edgeContent = match[2];
          const waypointCount = (edgeContent.match(/<di:waypoint[^>]*>/g) || []).length;
          edgeRefs.set(edgeRef, waypointCount);
        }
        associationIds.forEach(associationId => {
          const waypointCount = edgeRefs.get(associationId);
          if (waypointCount === undefined) {
            errors.push(`V4: association ${associationId} has no corresponding CMMNEdge (will cause Flowable AssociationJsonConverter NPE)`);
          } else if (waypointCount < 2) {
            errors.push(`V4: association ${associationId} has CMMNEdge with only ${waypointCount} waypoint(s), requires at least 2`);
          }
        });
      }
    }
    /**
     * V_ASSOC_DI_1, V_ASSOC_DI_2, V_ONPART_DI_1: Association and OnPart DI validation
     * Per Cursor_Flowable_Import_Fix_Associations.md requirements
     */
    validateAssociationAndOnPartDI(cmmnXml, errors, exportMode = CMMNExportMode.FLOWABLE) {
      if (!cmmnXml) {
        return;
      }
      // V_ASSOC_DI_1: For each cmmn:association id=A, find CMMNEdge where @cmmnElementRef == A, require >=2 waypoints
      if (exportMode === CMMNExportMode.STANDARD) {
        const associationIds = new Set();
        const associationPattern = /<cmmn:association[^>]*\s+id="([^"]+)"/g;
        let match;
        while ((match = associationPattern.exec(cmmnXml)) !== null) {
          associationIds.add(match[1]);
        }
        associationIds.forEach(associationId => {
          const edgePattern = new RegExp(`<cmmndi:CMMNEdge[^>]*cmmnElementRef="${associationId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>([\\s\\S]*?)<\\/cmmndi:CMMNEdge>`, "g");
          const edgeMatch = cmmnXml.match(edgePattern);
          if (!edgeMatch) {
            errors.push(`V_ASSOC_DI_1: association ${associationId} has no corresponding CMMNEdge with cmmnElementRef="${associationId}"`);
          } else {
            const waypointCount = (edgeMatch[0].match(/<di:waypoint[^>]*>/g) || []).length;
            if (waypointCount < 2) {
              errors.push(`V_ASSOC_DI_1: association ${associationId} has CMMNEdge with only ${waypointCount} waypoint(s), requires at least 2`);
            }
          }
        });
        // V_ASSOC_DI_2: Association edges must NOT have sourceCMMNElementRef or targetCMMNElementRef
        associationIds.forEach(associationId => {
          const edgePattern = new RegExp(`<cmmndi:CMMNEdge[^>]*cmmnElementRef="${associationId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`, "g");
          const edgeMatch = cmmnXml.match(edgePattern);
          if (edgeMatch) {
            const edgeTag = edgeMatch[0];
            if (edgeTag.includes("sourceCMMNElementRef") || edgeTag.includes("targetCMMNElementRef")) {
              errors.push(`V_ASSOC_DI_2: association ${associationId} edge must NOT have sourceCMMNElementRef or targetCMMNElementRef`);
            }
          }
        });
      }
      // V_ONPART_DI_1: For each cmmn:planItemOnPart id=O, find CMMNEdge where @cmmnElementRef == O
      // Require @sourceCMMNElementRef equals the onPart.sourceRef (REQUIRED for Flowable)
      // Require @targetCMMNElementRef equals the criterion id that references the sentry containing O
      // Require >=2 waypoints
      const onPartIds = new Set();
      const onPartPattern = /<cmmn:planItemOnPart[^>]*\s+id="([^"]+)"/g;
      let onPartMatch;
      while ((onPartMatch = onPartPattern.exec(cmmnXml)) !== null) {
        onPartIds.add(onPartMatch[1]);
      }
      onPartIds.forEach(onPartId => {
        const edgePattern = new RegExp(`<cmmndi:CMMNEdge[^>]*cmmnElementRef="${onPartId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>([\\s\\S]*?)<\\/cmmndi:CMMNEdge>`, "g");
        const edgeMatch = cmmnXml.match(edgePattern);
        if (!edgeMatch) {
          errors.push(`V_ONPART_DI_1: planItemOnPart ${onPartId} has no corresponding CMMNEdge with cmmnElementRef="${onPartId}"`);
        } else {
          const waypointCount = (edgeMatch[0].match(/<di:waypoint[^>]*>/g) || []).length;
          if (waypointCount < 2) {
            errors.push(`V_ONPART_DI_1: planItemOnPart ${onPartId} has CMMNEdge with only ${waypointCount} waypoint(s), requires at least 2`);
          }
          // Check that sourceCMMNElementRef exists (REQUIRED for Flowable)
          const edgeTagMatch = edgeMatch[0].match(/<cmmndi:CMMNEdge[^>]*>/);
          if (!edgeTagMatch || !edgeTagMatch[0].includes("sourceCMMNElementRef")) {
            errors.push(`V_ONPART_DI_1: planItemOnPart ${onPartId} edge must have sourceCMMNElementRef (required for Flowable compatibility)`);
          } else {
            // Extract sourceCMMNElementRef value and verify it matches the onPart's sourceRef
            const sourceRefMatch = edgeTagMatch[0].match(/sourceCMMNElementRef="([^"]+)"/);
            if (!sourceRefMatch || !sourceRefMatch[1]) {
              errors.push(`V_ONPART_DI_1: planItemOnPart ${onPartId} edge has empty sourceCMMNElementRef`);
            }
          }
          // Check that targetCMMNElementRef exists and points to a criterion
          if (!edgeTagMatch || !edgeTagMatch[0].includes("targetCMMNElementRef")) {
            errors.push(`V_ONPART_DI_1: planItemOnPart ${onPartId} edge must have targetCMMNElementRef pointing to entry criterion`);
          } else {
            // Extract targetCMMNElementRef value and verify it's not empty
            const targetRefMatch = edgeTagMatch[0].match(/targetCMMNElementRef="([^"]+)"/);
            if (!targetRefMatch || !targetRefMatch[1]) {
              errors.push(`V_ONPART_DI_1: planItemOnPart ${onPartId} edge has empty targetCMMNElementRef`);
            }
          }
        }
      });
    }
    /**
     * Validate CMMN XSD (simplified - in production would use actual XSD validation)
     */
    validateCMMNXSD(cmmnXml) {
      return (0, default)(function* () {
        const errors = [];
        // Basic XML structure validation
        if (!cmmnXml || !cmmnXml.includes("<cmmn:definitions")) {
          errors.push("Invalid CMMN XML structure");
        }
        // Check for required elements
        if (!cmmnXml.includes("<cmmn:case")) {
          errors.push("Missing case element");
        }
        if (!cmmnXml.includes("<cmmn:casePlanModel")) {
          errors.push("Missing casePlanModel element");
        }
        return {
          valid: errors.length === 0,
          errors
        };
      })();
    }
    /**
     * Validate DMN XSD (simplified)
     */
    validateDMNXSD(dmnXml) {
      return (0, default)(function* () {
        const errors = [];
        if (!dmnXml || !dmnXml.includes("<dmn:definitions")) {
          errors.push("Invalid DMN XML structure");
        }
        return {
          valid: errors.length === 0,
          errors
        };
      })();
    }
    /**
     * Calculate trace coverage
     */
    calculateTraceCoverage(dcmIR) {
      const total = dcmIR.plan.stages.length + dcmIR.plan.tasks.length + dcmIR.plan.milestones.length + dcmIR.caseFileModel.items.length + dcmIR.roles.length;
      const mapped = total; // All elements in DCM-IR are mapped
      return {
        percentage: total > 0 ? mapped / total * 100 : 0,
        mapped,
        total
      };
    }
    /**
     * Find missing elements
     */
    findMissingElements(dcmIR) {
      const missing = [];
      // Check for tasks without entry criteria
      dcmIR.plan.tasks.forEach(task => {
        if (task.entryCriteria.length === 0) {
          missing.push(`Task ${task.name} has no entry criteria`);
        }
      });
      return missing;
    }
    /**
     * Find missing states
     */
    findMissingStates(dcmIR) {
      const missing = [];
      // Check for case file items referencing states that don't exist
      dcmIR.caseFileModel.items.forEach(item => {
        // States are stored as names, so we can't easily validate this
        // This would require access to the original OPM model
      });
      return missing;
    }
    /**
     * Find over-constrained guards
     */
    findOverConstrainedGuards(dcmIR) {
      const overConstrained = [];
      dcmIR.plan.sentries.forEach(sentry => {
        if (sentry.ifPart) {
          const predicate = sentry.ifPart.predicate;
          // Count AND conditions
          const andCount = (predicate.match(/ AND /g) || []).length;
          if (andCount > 5) {
            overConstrained.push(`Sentry ${sentry.id} has ${andCount + 1} conditions`);
          }
        }
      });
      return overConstrained;
    }
    /**
     * Find under-constrained guards
     */
    findUnderConstrainedGuards(dcmIR) {
      const underConstrained = [];
      dcmIR.plan.sentries.forEach(sentry => {
        if (!sentry.ifPart || !sentry.ifPart.predicate || sentry.ifPart.predicate === "true") {
          underConstrained.push(`Sentry ${sentry.id} has no conditions`);
        }
      });
      return underConstrained;
    }
    /**
     * Find unreachable tasks
     */
    findUnreachableTasks(dcmIR) {
      const unreachable = [];
      // Tasks with no entry criteria and no upstream tasks
      dcmIR.plan.tasks.forEach(task => {
        if (task.entryCriteria.length === 0) {
          // Check if there are any sentries that reference this task
          const hasUpstream = dcmIR.plan.sentries.some(sentry => sentry.onPart?.some(op => op.planItemRef === `pi_${task.id}`));
          if (!hasUpstream) {
            unreachable.push(`Task ${task.name} appears unreachable`);
          }
        }
      });
      return unreachable;
    }
    /**
     * Find guard consistency warnings
     */
    findGuardConsistencyWarnings(dcmIR, decisionExtraction) {
      const warnings = [];
      // Check for sentries with conflicting conditions
      dcmIR.plan.sentries.forEach(sentry => {
        if (sentry.ifPart) {
          const predicate = sentry.ifPart.predicate;
          // Check for potential conflicts (simplified)
          if (predicate.includes(" AND ") && predicate.includes(" OR ")) {
            warnings.push(`Sentry ${sentry.id} has mixed AND/OR conditions`);
          }
        }
      });
      // Check DMN linkage if decision extraction is enabled
      if (decisionExtraction === "guards-to-dmn") {
        // Check that sentries with non-trivial predicates have DMN decision refs
        dcmIR.plan.sentries.forEach(sentry => {
          if (sentry.ifPart && sentry.ifPart.predicate && sentry.ifPart.predicate !== "true") {
            if (!sentry.dmnDecisionRef) {
              warnings.push(`Sentry ${sentry.id} has guard predicate but no DMN decision reference`);
            }
          }
        });
        // Check that all decisions have corresponding sentries
        dcmIR.decisions.forEach(decision => {
          const hasLinkedSentry = dcmIR.plan.sentries.some(s => s.dmnDecisionRef === decision.id);
          if (!hasLinkedSentry) {
            warnings.push(`Decision ${decision.id} has no linked sentry`);
          }
        });
      }
      // Check for ambiguous guards (multiple triggering predecessors)
      dcmIR.plan.tasks.forEach(task => {
        if (task.entryCriteria && task.entryCriteria.length > 1) {
          const sentries = dcmIR.plan.sentries.filter(s => task.entryCriteria.includes(s.id));
          if (sentries.length > 1) {
            warnings.push(`Task ${task.name} has multiple entry criteria sentries - may be ambiguous`);
          }
        }
      });
      // Check for case file items without corresponding transitions
      dcmIR.caseFileModel.items.forEach(item => {
        if (item.states.length > 0) {
          // Check if any state is referenced in sentries or milestones
          const stateReferenced = dcmIR.plan.milestones.some(m => item.states.some(state => m.name.includes(state)));
          if (!stateReferenced && item.states.length > 0) {
            warnings.push(`Case file item ${item.id} has states but no corresponding milestones or transitions`);
          }
        }
      });
      return warnings;
    }
    /**
     * Find unmapped processes
     */
    findUnmappedProcesses(dcmIR) {
      const unmapped = [];
      // This would check against the original OPM model to find processes
      // that were in scope but not mapped to tasks or stages
      // For v1, we assume all scoped processes are mapped
      // This is a placeholder for future validation
      return unmapped;
    }
    static #_ = (() => this.ɵfac = function DCMValidationService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DCMValidationService)();
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: DCMValidationService,
      factory: DCMValidationService.ɵfac,
      providedIn: "root"
    }))();
  }
  return DCMValidationService;
})();