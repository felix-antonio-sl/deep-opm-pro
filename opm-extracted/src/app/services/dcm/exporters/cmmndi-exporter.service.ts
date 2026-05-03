// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/dcm/exporters/cmmndi-exporter.service.ts
// Extracted by opm-extracted/tools/extract.mjs

    let CMMNDIExporterService = /*#__PURE__*/(() => {
      class CMMNDIExporterService {
        constructor() {
          this.exportMode = CMMNExportMode.FLOWABLE; // Default to FLOWABLE
          /**
           * Store plan item positions for criterion placement
           */
          this.planItemPositions = new Map();
        }
        /**
         * Set export mode
         */
        setExportMode(mode) {
          this.exportMode = mode;
        }
        /**
         * Get current export mode
         */
        getExportMode() {
          return this.exportMode;
        }
        /**
         * Export DCM-IR to CMMNDI XML (separate file for Flowable 6.7.x compatibility)
         * Uses simple hierarchical layout (top-down DAG)
         * MANDATORY: Includes shapes and edges for entryCriteria to prevent Flowable AssociationJsonConverter NPE
         * MANDATORY: Includes CMMNPlane with cmmnElementRef pointing to casePlanModel
         *
         * @param exportMode Optional export mode override (defaults to instance mode)
         */
        exportCMMNDI(dcmIR, canonicalOPM, exportMode) {
          const mode = exportMode || this.exportMode;
          // Compute valid sentry IDs the same way as CMMN exporter
          // Only sentries with ifPart are exported to CMMN
          const validSentryIds = new Set();
          dcmIR.plan.sentries.forEach(sentry => {
            const hasIfPart = sentry.ifPart && sentry.ifPart.predicate;
            if (hasIfPart) {
              validSentryIds.add(sentry.id);
            }
          });
          const diagram = this.buildCMMNDIDiagram(dcmIR, canonicalOPM, validSentryIds, mode);
          return this.formatXML(diagram);
        }
        /**
         * Build CMMNDI diagram structure
         * CRITICAL: NEVER emit <dc:Bounds> directly under <cmmndi:CMMNDiagram>
         * Flowable throws NPE if bounds are at diagram level - they must be inside CMMNShape only
         * MANDATORY: Include shapes and edges for entryCriteria to prevent AssociationJsonConverter NPE
         * MANDATORY: Include CMMNPlane with cmmnElementRef pointing to casePlanModel
         *
         * @param exportMode Export mode (STANDARD mode includes association edges)
         */
        buildCMMNDIDiagram(dcmIR, canonicalOPM, validSentryIds, exportMode = CMMNExportMode.FLOWABLE) {
          const shapes = this.buildShapes(dcmIR, canonicalOPM, exportMode);
          // CRITICAL: In FLOWABLE mode, do NOT create CMMNPlane or edges
          // Flowable 6.7.2 requires shapes directly under CMMNDiagram, no plane, no edges
          if (exportMode === CMMNExportMode.FLOWABLE) {
            // FLOWABLE mode: Shapes directly under CMMNDiagram, no plane, no edges
            let xml = `<?xml version="1.0" encoding="UTF-8"?>
<cmmndi:CMMNDI xmlns:cmmndi="http://www.omg.org/spec/CMMN/20151109/CMMNDI"
               xmlns:cmmn="http://www.omg.org/spec/CMMN/20151109/MODEL"
               xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
               xmlns:di="http://www.omg.org/spec/DD/20100524/DI">
  <cmmndi:CMMNDiagram id="diagram_${this.sanitizeId(dcmIR.id)}">
${shapes}
  </cmmndi:CMMNDiagram>
</cmmndi:CMMNDI>`;
            // Sanitize: Remove any stray <dc:Bounds> that might be outside CMMNShape
            xml = this.sanitizeCMMNDI(xml);
            return xml;
          } else {
            // STANDARD mode: Include CMMNPlane and edges
            const edges = this.buildEdges(dcmIR, validSentryIds, exportMode);
            const casePlanModelId = `casePlanModel_${this.sanitizeId(dcmIR.id)}`;
            let xml = `<?xml version="1.0" encoding="UTF-8"?>
<cmmndi:CMMNDI xmlns:cmmndi="http://www.omg.org/spec/CMMN/20151109/CMMNDI"
               xmlns:cmmn="http://www.omg.org/spec/CMMN/20151109/MODEL"
               xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
               xmlns:di="http://www.omg.org/spec/DD/20100524/DI">
  <cmmndi:CMMNDiagram id="diagram_${this.sanitizeId(dcmIR.id)}">
    <cmmndi:CMMNPlane id="plane_${this.sanitizeId(dcmIR.id)}" cmmnElementRef="${casePlanModelId}">
${shapes}
${edges}
    </cmmndi:CMMNPlane>
  </cmmndi:CMMNDiagram>
</cmmndi:CMMNDI>`;
            // Sanitize: Remove any stray <dc:Bounds> that might be outside CMMNShape
            xml = this.sanitizeCMMNDI(xml);
            return xml;
          }
        }
        /**
         * Sanitize CMMNDI XML to ensure Flowable compatibility
         * REVERTED: Working version (1767506803618) includes CMMNLabel elements - do NOT remove them
         * Only remove stray <dc:Bounds> that are NOT inside <cmmndi:CMMNShape>
         */
        sanitizeCMMNDI(xml) {
          // REVERTED: Do NOT remove CMMNLabel - working version has them and imports successfully
          // Remove any <dc:Bounds> that are directly under CMMNDiagram (not inside CMMNShape)
          // Pattern: <cmmndi:CMMNDiagram[^>]*>\s*<dc:Bounds[^>]*/>
          let sanitized = xml.replace(/<cmmndi:CMMNDiagram[^>]*>\s*<dc:Bounds[^>]*\/>/gi, match => {
            // Remove the bounds, keep only the diagram opening tag
            return match.replace(/<dc:Bounds[^>]*\/>/gi, "").trim();
          });
          // Also check for bounds with closing tag format
          sanitized = sanitized.replace(/<cmmndi:CMMNDiagram[^>]*>\s*<dc:Bounds[^>]*>[\s\S]*?<\/dc:Bounds>/gi, match => {
            return match.replace(/<dc:Bounds[^>]*>[\s\S]*?<\/dc:Bounds>/gi, "").trim();
          });
          return sanitized;
        }
        /**
         * Build shapes for all plan items
         * Improved layout: Tasks grouped by stage, milestones in multiple rows, proper bounds
         * Ensures all elements are visible and properly arranged
         */
        buildShapes(dcmIR, canonicalOPM, exportMode = CMMNExportMode.FLOWABLE) {
          const shapes = [];
          // Initialize planItemPositions map
          this.planItemPositions = new Map();
          // Collect ALL elements to layout (preserve order from DCM-IR)
          const tasks = [...dcmIR.plan.tasks]; // All human tasks (preserve order)
          const milestones = [...dcmIR.plan.milestones]; // All milestones (preserve order)
          const stages = [...dcmIR.plan.stages]; // All stages (preserve order)
          // Layout constants
          const gridColumns = 3; // 3 columns for tasks
          const taskWidth = 120;
          const taskHeight = 60;
          const milestoneWidth = 60;
          const milestoneHeight = 60;
          const stagePadding = 20; // Padding inside stage
          const horizontalSpacing = 150; // Space between columns
          const verticalSpacing = 100; // Space between rows
          const milestoneVerticalSpacing = 80; // Space between milestone rows
          const leftMargin = 50;
          const topMargin = 50;
          // Separate tasks by stage
          const tasksByStage = new Map();
          const rootTasks = [];
          tasks.forEach(task => {
            // Check if task belongs to any stage
            let belongsToStage = false;
            for (const stage of stages) {
              if (this.isTaskInStage(task, stage, dcmIR, canonicalOPM)) {
                if (!tasksByStage.has(stage.id)) {
                  tasksByStage.set(stage.id, []);
                }
                tasksByStage.get(stage.id).push(task);
                belongsToStage = true;
                break;
              }
            }
            if (!belongsToStage) {
              rootTasks.push(task);
            }
          });
          // Compute stage sizes based on their tasks
          // CRITICAL: Position tasks FIRST, then calculate stage bounds to contain them
          const stageBounds = new Map();
          let currentY = topMargin;
          // Layout stages with their tasks inside (recursively for nested stages)
          // CRITICAL: Layout ALL stages, including nested ones
          const rootStagesForLayout = stages.filter(stage => !stage.parentStageId);
          // Recursive function to layout a stage and its nested stages
          const layoutStageRecursive = (stage, parentX, parentY, parentWidth, parentHeight) => {
            const stageHeaderHeight = 40;
            const stagePadding = 20;
            // Get tasks that belong to this stage (direct children, not in nested stages)
            const directStageTasks = (tasksByStage.get(stage.id) || []).filter(task => {
              // Check if task belongs to a nested stage (if so, it's not a direct child)
              const belongsToNestedStage = stages.some(nestedStage => nestedStage.parentStageId === stage.id && this.isTaskInStage(task, nestedStage, dcmIR, canonicalOPM));
              return !belongsToNestedStage;
            });
            // Get nested stages
            const nestedStages = stages.filter(s => s.parentStageId === stage.id);
            // Position direct tasks
            const taskPositions = [];
            directStageTasks.forEach((task, taskIndex) => {
              const col = taskIndex % gridColumns;
              const row = Math.floor(taskIndex / gridColumns);
              const taskX = parentX + stagePadding + col * horizontalSpacing;
              const taskY = parentY + stageHeaderHeight + stagePadding + row * (taskHeight + 20);
              const pos = {
                x: taskX,
                y: taskY,
                width: taskWidth,
                height: taskHeight
              };
              taskPositions.push(pos);
              this.planItemPositions.set(`pi_${task.id}`, pos);
            });
            // Position nested stages
            let nestedY = parentY + stageHeaderHeight + stagePadding;
            if (directStageTasks.length > 0) {
              const maxTaskY = Math.max(...taskPositions.map(p => p.y + p.height));
              nestedY = maxTaskY + 20; // Below tasks
            }
            const nestedStageBounds = [];
            nestedStages.forEach((nestedStage, nestedIndex) => {
              const nestedX = parentX + stagePadding;
              const nestedStageBounds_result = layoutStageRecursive(nestedStage, nestedX, nestedY, parentWidth - stagePadding * 2, 0);
              nestedStageBounds.push(nestedStageBounds_result);
              nestedY = nestedStageBounds_result.y + nestedStageBounds_result.height + 20;
            });
            // Calculate stage bounds to contain all direct tasks and nested stages
            let minX = parentX;
            let minY = parentY;
            let maxX = parentX + 200; // Minimum width
            let maxY = parentY + stageHeaderHeight + 40; // Minimum height
            if (taskPositions.length > 0) {
              minX = Math.min(minX, ...taskPositions.map(p => p.x));
              minY = Math.min(minY, ...taskPositions.map(p => p.y));
              maxX = Math.max(maxX, ...taskPositions.map(p => p.x + p.width));
              maxY = Math.max(maxY, ...taskPositions.map(p => p.y + p.height));
            }
            if (nestedStageBounds.length > 0) {
              minX = Math.min(minX, ...nestedStageBounds.map(b => b.x));
              minY = Math.min(minY, ...nestedStageBounds.map(b => b.y));
              maxX = Math.max(maxX, ...nestedStageBounds.map(b => b.x + b.width));
              maxY = Math.max(maxY, ...nestedStageBounds.map(b => b.y + b.height));
            }
            const stageWidth = Math.max(200, maxX - parentX + stagePadding);
            const stageHeight = Math.max(stageHeaderHeight + 40, maxY - parentY + stagePadding);
            const bounds = {
              x: parentX,
              y: parentY,
              width: stageWidth,
              height: stageHeight
            };
            stageBounds.set(stage.id, bounds);
            return bounds;
          };
          // Layout root stages
          rootStagesForLayout.forEach(stage => {
            const stageX = leftMargin;
            const stageY = currentY;
            const bounds = layoutStageRecursive(stage, stageX, stageY, 1000, 0);
            currentY += bounds.height + verticalSpacing;
          });
          // Layout root-level tasks (not in any stage)
          rootTasks.forEach((task, index) => {
            const col = index % gridColumns;
            const row = Math.floor(index / gridColumns);
            const x = leftMargin + col * horizontalSpacing;
            const y = currentY + row * verticalSpacing;
            this.planItemPositions.set(`pi_${task.id}`, {
              x,
              y,
              width: taskWidth,
              height: taskHeight
            });
          });
          const rootTaskRows = Math.ceil(rootTasks.length / gridColumns);
          if (rootTasks.length > 0) {
            currentY += rootTaskRows * verticalSpacing + 20;
          }
          // Layout milestones in multiple rows (3 columns, multiple rows)
          const milestoneRows = Math.ceil(milestones.length / gridColumns);
          milestones.forEach((milestone, index) => {
            const col = index % gridColumns;
            const row = Math.floor(index / gridColumns);
            const x = leftMargin + col * horizontalSpacing;
            const y = currentY + row * milestoneVerticalSpacing;
            this.planItemPositions.set(`pi_${milestone.id}`, {
              x,
              y,
              width: milestoneWidth,
              height: milestoneHeight
            });
          });
          if (milestones.length > 0) {
            currentY += milestoneRows * milestoneVerticalSpacing + 20;
          }
          // Compute casePlanModel bounds to fit all content
          let minX = leftMargin;
          let minY = topMargin;
          let maxX = leftMargin + gridColumns * horizontalSpacing;
          let maxY = currentY;
          // Check all positions to find actual bounds
          this.planItemPositions.forEach(pos => {
            minX = Math.min(minX, pos.x);
            minY = Math.min(minY, pos.y);
            maxX = Math.max(maxX, pos.x + pos.width);
            maxY = Math.max(maxY, pos.y + pos.height);
          });
          stageBounds.forEach(bounds => {
            minX = Math.min(minX, bounds.x);
            minY = Math.min(minY, bounds.y);
            maxX = Math.max(maxX, bounds.x + bounds.width);
            maxY = Math.max(maxY, bounds.y + bounds.height);
          });
          // Add padding around content
          const padding = 40;
          const planX = Math.max(0, minX - padding);
          const planY = Math.max(0, minY - padding);
          const planWidth = maxX - minX + padding * 2;
          const planHeight = maxY - minY + padding * 2;
          // Build shapes for ALL stages (including nested stages)
          // CRITICAL: ALL stages need shapes, not just root stages
          // The recursive layout function should have positioned all stages
          stages.forEach(stage => {
            const bounds = stageBounds.get(stage.id);
            if (bounds) {
              shapes.push(this.buildStageShape(stage, bounds.x, bounds.y, bounds.width, bounds.height));
            } else {
              // Fallback: create shape with default bounds if not found (shouldn't happen, but defensive)
              const defaultBounds = {
                x: leftMargin,
                y: topMargin,
                width: 200,
                height: 150
              };
              stageBounds.set(stage.id, defaultBounds);
              this.planItemPositions.set(`pi_${stage.id}`, defaultBounds);
              shapes.push(this.buildStageShape(stage, defaultBounds.x, defaultBounds.y, defaultBounds.width, defaultBounds.height));
            }
          });
          // Build shapes for ALL tasks (including those in nested stages)
          // CRITICAL: ALL tasks need shapes, even if they're in nested stages
          tasks.forEach(task => {
            const pos = this.planItemPositions.get(`pi_${task.id}`);
            if (pos) {
              shapes.push(this.buildTaskShape(task, pos.x, pos.y, pos.width, pos.height));
            } else {
              // Fallback: create shape with default position if not found
              // This handles tasks in nested stages that weren't positioned
              const defaultPos = {
                x: leftMargin,
                y: topMargin,
                width: taskWidth,
                height: taskHeight
              };
              shapes.push(this.buildTaskShape(task, defaultPos.x, defaultPos.y, defaultPos.width, defaultPos.height));
              this.planItemPositions.set(`pi_${task.id}`, defaultPos);
            }
          });
          // Milestones
          milestones.forEach(milestone => {
            const pos = this.planItemPositions.get(`pi_${milestone.id}`);
            if (pos) {
              shapes.push(this.buildMilestoneShape(milestone, pos.x, pos.y, pos.width, pos.height));
            }
          });
          // Add casePlanModel shape with computed bounds (must be first)
          shapes.unshift(this.buildCasePlanModelShape(dcmIR, {
            x: planX,
            y: planY,
            width: planWidth,
            height: planHeight
          }));
          // MANDATORY: Add shapes for entry criteria to prevent Flowable convertCriteria NPE
          // CRITICAL: In FLOWABLE mode, do NOT create entry criterion shapes
          // Flowable 6.7.2's AssociationJsonConverter treats criterion shapes as associations and throws NPE
          // The working import structure has NO criterion shapes
          if (exportMode !== CMMNExportMode.FLOWABLE) {
            // STANDARD mode: Create criterion shapes for other tools
            const criterionShapes = this.buildCriterionShapesForSentries(dcmIR);
            shapes.push(...criterionShapes);
          }
          return shapes.join("\n");
        }
        /**
         * Build CMMNShape for each entryCriterion
         * MANDATORY: Flowable expects shapes for entryCriteria to prevent AssociationJsonConverter NPE
         * NOTE: This method is for entry criteria WITH IDs (not currently used)
         */
        buildCriterionShapes(dcmIR) {
          const shapes = [];
          // Collect all entryCriteria from tasks, stages, and milestones
          const allEntryCriteria = [];
          dcmIR.plan.tasks.forEach(task => {
            task.entryCriteria.forEach(sentryId => {
              const criterionId = `entry_${this.sanitizeId(task.id)}_${this.sanitizeId(sentryId)}`;
              allEntryCriteria.push({
                criterionId,
                planItemId: `pi_${task.id}`
              });
            });
          });
          dcmIR.plan.stages.forEach(stage => {
            if (stage.entryCriteria) {
              stage.entryCriteria.forEach(sentryId => {
                const criterionId = `entry_${this.sanitizeId(stage.id)}_${this.sanitizeId(sentryId)}`;
                allEntryCriteria.push({
                  criterionId,
                  planItemId: `pi_${stage.id}`
                });
              });
            }
          });
          dcmIR.plan.milestones.forEach(milestone => {
            milestone.entryCriteria.forEach(sentryId => {
              const criterionId = `entry_${this.sanitizeId(milestone.id)}_${this.sanitizeId(sentryId)}`;
              allEntryCriteria.push({
                criterionId,
                planItemId: `pi_${milestone.id}`
              });
            });
          });
          // Build shapes for each criterion
          allEntryCriteria.forEach(criterion => {
            const planItemPos = this.planItemPositions.get(criterion.planItemId);
            if (planItemPos) {
              // Place criterion at left edge center of plan item
              const criterionX = planItemPos.x - 10;
              const criterionY = planItemPos.y + planItemPos.height / 2 - 8; // Center vertically, offset for 16x16 shape
              shapes.push(this.buildCriterionShape(criterion.criterionId, criterionX, criterionY));
            }
          });
          return shapes;
        }
        /**
         * Build CMMNShape for entry criteria
         * MANDATORY: Flowable's convertCriteria expects GraphicInfo for entry criteria
         * Entry criteria now have IDs in CMMN (format: entry_${planItemId}_${sentryId})
         * We create shapes using these IDs so Flowable can find graphic info
         */
        buildCriterionShapesForSentries(dcmIR) {
          const shapes = [];
          // Collect all entry criteria with their IDs and plan item positions
          const criterionInfo = [];
          dcmIR.plan.tasks.forEach(task => {
            const planItemId = `pi_${task.id}`;
            const planItemPos = this.planItemPositions.get(planItemId);
            // CRITICAL: Create shapes for ALL tasks, even if position is missing (use fallback)
            const pos = planItemPos || {
              x: 50,
              y: 50,
              width: 120,
              height: 60
            };
            task.entryCriteria.forEach(sentryId => {
              // Format matches CMMN exporter: entry_${planItemId}_${sentryId} where planItemId = pi_${elementId}
              const planItemId = `pi_${task.id}`;
              const criterionId = `entry_${this.sanitizeId(planItemId)}_${this.sanitizeId(sentryId)}`;
              criterionInfo.push({
                criterionId,
                planItemPos: pos
              });
            });
            // Ensure position is set even if it wasn't before
            if (!planItemPos) {
              this.planItemPositions.set(planItemId, pos);
            }
          });
          dcmIR.plan.stages.forEach(stage => {
            const planItemId = `pi_${stage.id}`;
            const planItemPos = this.planItemPositions.get(planItemId);
            // CRITICAL: Create shapes for ALL stages, even if position is missing (use fallback)
            const pos = planItemPos || {
              x: 50,
              y: 50,
              width: 200,
              height: 150
            };
            if (stage.entryCriteria) {
              stage.entryCriteria.forEach(sentryId => {
                // Format matches CMMN exporter: entry_${planItemId}_${sentryId} where planItemId = pi_${elementId}
                const planItemId = `pi_${stage.id}`;
                const criterionId = `entry_${this.sanitizeId(planItemId)}_${this.sanitizeId(sentryId)}`;
                criterionInfo.push({
                  criterionId,
                  planItemPos: pos
                });
              });
            }
            // Ensure position is set even if it wasn't before
            if (!planItemPos) {
              this.planItemPositions.set(planItemId, pos);
            }
          });
          dcmIR.plan.milestones.forEach(milestone => {
            const planItemId = `pi_${milestone.id}`;
            const planItemPos = this.planItemPositions.get(planItemId);
            // CRITICAL: Create shapes for ALL milestones, even if position is missing (use fallback)
            const pos = planItemPos || {
              x: 50,
              y: 50,
              width: 60,
              height: 60
            };
            milestone.entryCriteria.forEach(sentryId => {
              // Format matches CMMN exporter: entry_${planItemId}_${sentryId} where planItemId = pi_${elementId}
              const planItemId = `pi_${milestone.id}`;
              const criterionId = `entry_${this.sanitizeId(planItemId)}_${this.sanitizeId(sentryId)}`;
              criterionInfo.push({
                criterionId,
                planItemPos: pos
              });
            });
            // Ensure position is set even if it wasn't before
            if (!planItemPos) {
              this.planItemPositions.set(planItemId, pos);
            }
          });
          // Create a shape for each entry criterion (Flowable looks up graphic info by entry criterion ID)
          criterionInfo.forEach(criterion => {
            // Place shape at left edge center of plan item (where entry criterion would be)
            const criterionX = criterion.planItemPos.x - 10;
            const criterionY = criterion.planItemPos.y + criterion.planItemPos.height / 2 - 8;
            // Use entry criterion ID as cmmnElementRef - Flowable looks up graphic info by this ID
            shapes.push(`    <cmmndi:CMMNShape id="shape_${this.sanitizeId(criterion.criterionId)}" cmmnElementRef="${this.sanitizeId(criterion.criterionId)}">
      <dc:Bounds x="${criterionX}" y="${criterionY}" width="16" height="16"/>
    </cmmndi:CMMNShape>`);
          });
          return shapes;
        }
        /**
         * Build CMMNShape for entryCriterion
         */
        buildCriterionShape(criterionId, x, y) {
          return `    <cmmndi:CMMNShape id="shape_${this.sanitizeId(criterionId)}" cmmnElementRef="${this.sanitizeId(criterionId)}">
      <dc:Bounds x="${x}" y="${y}" width="16" height="16"/>
    </cmmndi:CMMNShape>`;
        }
        /**
         * Build edges per CMMN 1.1 DI specification (Section 5.3)
         * CRITICAL: Only three valid semantic uses of CMMNEdge:
         * 1) OnPart connectors (cmmnElementRef = OnPart.id, targetCMMNElementRef = EntryCriterion.id, NO sourceCMMNElementRef)
         * 2) Associations (cmmnElementRef = association.id, NO source/targetCMMNElementRef)
         * 3) Discretionary associations (NO cmmnElementRef, both source/targetCMMNElementRef required)
         *
         * FORBIDDEN patterns (Section 5.4):
         * - NO CMMNEdge with cmmnElementRef pointing to EntryCriterion, ExitCriterion, or Sentry
         *
         * @param validSentryIds Set of sentry IDs that will actually be exported to CMMN (pre-computed in CMMN exporter)
         * @param exportMode Export mode (STANDARD mode includes association edges)
         */
        buildEdges(dcmIR, validSentryIds, exportMode = CMMNExportMode.FLOWABLE) {
          const edges = [];
          // Helper to check if sentry will be in CMMN
          const willBeInCMMN = sentryId => {
            if (validSentryIds) {
              return validSentryIds.has(sentryId);
            }
            const sentry = dcmIR.plan.sentries.find(s => s.id === sentryId);
            if (sentry) {
              return !!sentry.ifPart && !!sentry.ifPart.predicate;
            } else {
              return false;
            }
          };
          // Helper to find entry criterion ID for a sentry
          const findEntryCriterionId = (sentryId, planItemId) => {
            return `entry_${this.sanitizeId(planItemId)}_${this.sanitizeId(sentryId)}`;
          };
          // 1. OnPart connectors (Section 5.3.1)
          // For every planItemOnPart, create exactly one CMMNEdge:
          // - cmmnElementRef = OnPart.id
          // - sourceCMMNElementRef = OnPart.sourceRef (REQUIRED for Flowable compatibility)
          // - targetCMMNElementRef = EntryCriterion.id
          dcmIR.plan.sentries.forEach(sentry => {
            if (sentry.onPart && sentry.onPart.length > 0 && willBeInCMMN(sentry.id)) {
              sentry.onPart.forEach((onPart, onPartIndex) => {
                const planItemOnPartId = `onPart_${this.sanitizeId(sentry.id)}_${onPartIndex}`;
                // Get source plan item position (the milestone referenced by planItemRef)
                const sourceRef = onPart.planItemRef;
                const sourcePos = this.planItemPositions.get(sourceRef) || {
                  x: 50,
                  y: 50,
                  width: 60,
                  height: 60
                };
                // Find target entry criterion for this sentry
                let targetCriterionId = null;
                let targetPos = {
                  x: 100,
                  y: 100,
                  width: 16,
                  height: 16
                };
                // Check tasks
                for (const task of dcmIR.plan.tasks) {
                  if (task.entryCriteria.includes(sentry.id)) {
                    const taskPlanItemId = `pi_${task.id}`;
                    targetCriterionId = findEntryCriterionId(sentry.id, taskPlanItemId);
                    const taskPos = this.planItemPositions.get(taskPlanItemId) || {
                      x: 50,
                      y: 50,
                      width: 120,
                      height: 60
                    };
                    targetPos = {
                      x: taskPos.x - 10,
                      y: taskPos.y + taskPos.height / 2 - 8,
                      width: 16,
                      height: 16
                    };
                    break;
                  }
                }
                // Check stages if not found
                if (!targetCriterionId) {
                  for (const stage of dcmIR.plan.stages) {
                    if (stage.entryCriteria && stage.entryCriteria.includes(sentry.id)) {
                      const stagePlanItemId = `pi_${stage.id}`;
                      targetCriterionId = findEntryCriterionId(sentry.id, stagePlanItemId);
                      const stagePos = this.planItemPositions.get(stagePlanItemId) || {
                        x: 50,
                        y: 50,
                        width: 200,
                        height: 150
                      };
                      targetPos = {
                        x: stagePos.x - 10,
                        y: stagePos.y + stagePos.height / 2 - 8,
                        width: 16,
                        height: 16
                      };
                      break;
                    }
                  }
                }
                // Check milestones if not found
                if (!targetCriterionId) {
                  for (const milestone of dcmIR.plan.milestones) {
                    if (milestone.entryCriteria.includes(sentry.id)) {
                      const milestonePlanItemId = `pi_${milestone.id}`;
                      targetCriterionId = findEntryCriterionId(sentry.id, milestonePlanItemId);
                      const milestonePos = this.planItemPositions.get(milestonePlanItemId) || {
                        x: 50,
                        y: 50,
                        width: 60,
                        height: 60
                      };
                      targetPos = {
                        x: milestonePos.x - 10,
                        y: milestonePos.y + milestonePos.height / 2 - 8,
                        width: 16,
                        height: 16
                      };
                      break;
                    }
                  }
                }
                // Only create edge if we found a target criterion
                if (targetCriterionId) {
                  // Waypoints: from source element border to criterion diamond
                  const startX = sourcePos.x + sourcePos.width / 2;
                  const startY = sourcePos.y + sourcePos.height / 2;
                  const endX = targetPos.x;
                  const endY = targetPos.y;
                  // CRITICAL: Edge ID must exactly match onPart ID (no prefix) for Flowable compatibility
                  // Flowable looks up edges by connector ID, so @id must equal @cmmnElementRef must equal onPart.id
                  const sanitizedOnPartId = this.sanitizeId(planItemOnPartId);
                  const sanitizedSourceRef = this.sanitizeId(sourceRef);
                  edges.push(`    <cmmndi:CMMNEdge id="${sanitizedOnPartId}" cmmnElementRef="${sanitizedOnPartId}" sourceCMMNElementRef="${sanitizedSourceRef}" targetCMMNElementRef="${this.sanitizeId(targetCriterionId)}">
      <di:waypoint x="${startX}" y="${startY}"/>
      <di:waypoint x="${endX}" y="${endY}"/>
      <cmmndi:CMMNLabel/>
    </cmmndi:CMMNEdge>`);
                }
              });
            }
          });
          // 2. Associations (Section 5.3.2) - Only in STANDARD mode
          // Per spec: cmmnElementRef = association.id, NO source/targetCMMNElementRef
          if (exportMode === CMMNExportMode.STANDARD) {
            const associationEdges = this.buildAssociationEdges(dcmIR);
            edges.push(...associationEdges);
          }
          // 3. Discretionary associations (Section 5.3.3) - Not yet implemented
          return edges.join("\n");
        }
        /**
         * Build association edges (STANDARD mode only)
         * Per spec Section 5.3.2:
         * - cmmnElementRef = association.id
         * - NO sourceCMMNElementRef or targetCMMNElementRef
         * - >=2 waypoints
         *
         * Currently returns empty array as associations are not yet implemented in DCM-IR
         * This method is a placeholder for future association support
         */
        buildAssociationEdges(dcmIR) {
          const edges = [];
          // TODO: When DCM-IR includes association data, iterate through associations and create edges
          // For each association:
          // 1. Find source and target shapes
          // 2. Calculate waypoints (center to center, minimum 2 points)
          // 3. Create CMMNEdge with cmmnElementRef = association.id
          // 4. Do NOT add sourceCMMNElementRef or targetCMMNElementRef
          return edges;
        }
        /**
         * REMOVED: buildCriterionEdge - FORBIDDEN per spec Section 5.4
         * Do NOT create CMMNEdge with cmmnElementRef pointing to EntryCriterion
         * OnPart connectors should be used instead (see buildEdges)
         */
        /**
         * REMOVED: buildPlanItemOnPartEdges - Replaced by inline implementation in buildEdges
         * OnPart connector logic is now directly in buildEdges per spec Section 5.3.1
         */
        /**
         * REMOVED: buildPlanItemOnPartEdge - Replaced by inline implementation in buildEdges
         * Per spec Section 5.3.1: OnPart connectors use cmmnElementRef=OnPart.id, targetCMMNElementRef=criterion.id, NO sourceCMMNElementRef
         */
        /**
         * REMOVED: buildSentryEdges - FORBIDDEN per spec Section 5.4
         * Do NOT create CMMNEdge with cmmnElementRef pointing to Sentry
         * OnPart connectors should be used instead (see buildEdges)
         */
        /**
         * Build casePlanModel shape (required by Flowable)
         * Fixed bounds: x=50, y=50, width=1200, height=1600
         */
        buildCasePlanModelShape(dcmIR, plan) {
          const casePlanModelId = `casePlanModel_${this.sanitizeId(dcmIR.id)}`;
          return `    <cmmndi:CMMNShape id="shape_${casePlanModelId}" cmmnElementRef="${casePlanModelId}">
      <dc:Bounds x="${plan.x}" y="${plan.y}" width="${plan.width}" height="${plan.height}"/>
    </cmmndi:CMMNShape>`;
        }
        /**
         * Build stage shape
         * REVERTED: Working version (1767506803618) includes CMMNLabel
         */
        buildStageShape(stage, x, y, width, height) {
          // Stage label should be at the TOP of the stage, not in the middle
          // Position it in the header area (top 40px of the stage)
          const labelY = y + 10; // Top of stage + small padding
          return `    <cmmndi:CMMNShape id="shape_${this.sanitizeId(stage.id)}" cmmnElementRef="pi_${this.sanitizeId(stage.id)}">
      <dc:Bounds x="${x}" y="${y}" width="${width}" height="${height}"/>
      <cmmndi:CMMNLabel>
        <dc:Bounds x="${x + 5}" y="${labelY}" width="${width - 10}" height="20"/>
      </cmmndi:CMMNLabel>
    </cmmndi:CMMNShape>`;
        }
        /**
         * Build task shape
         * REVERTED: Working version (1767506803618) includes CMMNLabel
         */
        buildTaskShape(task, x, y, width, height) {
          return `    <cmmndi:CMMNShape id="shape_${this.sanitizeId(task.id)}" cmmnElementRef="pi_${this.sanitizeId(task.id)}">
      <dc:Bounds x="${x}" y="${y}" width="${width}" height="${height}"/>
      <cmmndi:CMMNLabel>
        <dc:Bounds x="${x + 5}" y="${y + height / 2 - 10}" width="${width - 10}" height="20"/>
      </cmmndi:CMMNLabel>
    </cmmndi:CMMNShape>`;
        }
        /**
         * Build milestone shape (circle style)
         * REVERTED: Working version (1767506803618) includes CMMNLabel
         */
        buildMilestoneShape(milestone, x, y, width, height) {
          return `    <cmmndi:CMMNShape id="shape_${this.sanitizeId(milestone.id)}" cmmnElementRef="pi_${this.sanitizeId(milestone.id)}">
      <dc:Bounds x="${x}" y="${y}" width="${width}" height="${height}"/>
      <cmmndi:CMMNLabel>
        <dc:Bounds x="${x - 20}" y="${y + height / 2 + 5}" width="${width + 40}" height="20"/>
      </cmmndi:CMMNLabel>
    </cmmndi:CMMNShape>`;
        }
        /**
         * Build shape for definitionRef ID (humanTask/milestone/stage definition)
         * MANDATORY: Flowable queries DI by definitionRef IDs, not just planItem IDs
         * Uses same bounds as the planItem shape
         */
        buildDefinitionRefShape(definitionId, x, y, width, height) {
          const sanitizedId = this.sanitizeId(definitionId);
          return `    <cmmndi:CMMNShape id="shape_def_${sanitizedId}" cmmnElementRef="${sanitizedId}">
      <dc:Bounds x="${x}" y="${y}" width="${width}" height="${height}"/>
    </cmmndi:CMMNShape>`;
        }
        /**
         * Build case file item shape
         * MANDATORY: Do NOT include CMMNLabel - Flowable throws NPE when processing label bounds
         */
        buildCaseFileItemShape(item, x, y, width, height) {
          return `    <cmmndi:CMMNShape id="shape_${this.sanitizeId(item.id)}" cmmnElementRef="${this.sanitizeId(item.id)}">
      <dc:Bounds x="${x}" y="${y}" width="${width}" height="${height}"/>
    </cmmndi:CMMNShape>`;
        }
        /**
         * Check if task is in stage
         */
        isTaskInStage(task, stage, dcmIR, canonicalOPM) {
          // Use the same logic as CMMN exporter to determine task-stage relationships
          if (!task.sourceProcessId || !stage.sourceProcessId) {
            return false;
          }
          // If canonicalOPM is available, use proper hierarchy check (same as CMMN exporter)
          if (canonicalOPM && canonicalOPM.processes) {
            const taskProcess = canonicalOPM.processes.find(p => p.id === task.sourceProcessId);
            const stageProcess = canonicalOPM.processes.find(p => p.id === stage.sourceProcessId);
            if (!taskProcess || !stageProcess) {
              return false;
            }
            // Check if task's process is a direct child of stage's process
            // This matches the CMMN exporter logic exactly
            const isChild = taskProcess.parentProcessId === stageProcess.id;
            // SPECIAL CASE: If task has no parentProcessId AND stage is the root stage (matches rootProcessId),
            // then the task likely belongs to the root stage (it's a direct child of the root process)
            // This handles cases where canonicalOPM doesn't set parentProcessId for direct children of root
            const isRootStage = !stage.parentStageId && dcmIR.rootProcessId === stage.sourceProcessId;
            const isRootChild = isRootStage && !taskProcess.parentProcessId;
            if (isChild || isRootChild) {
              return true;
            } else {
              return false;
            }
          }
          // Fallback: prefix matching (simplified - matches CMMN exporter's fallback logic)
          return task.sourceProcessId.startsWith(stage.sourceProcessId) && task.sourceProcessId !== stage.sourceProcessId; // Exclude the stage itself
        }
        /**
         * Sanitize ID for XML
         */
        sanitizeId(id) {
          return id.replace(/[^a-zA-Z0-9_-]/g, "_");
        }
        /**
         * Format XML with proper indentation
         */
        formatXML(xml) {
          // Apply sanitization before returning
          return this.sanitizeCMMNDI(xml);
        }
        static #_ = (() => this.ɵfac = function CMMNDIExporterService_Factory(__ngFactoryType__) {
          return new (__ngFactoryType__ || CMMNDIExporterService)();
        })();
        static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
          token: CMMNDIExporterService,
          factory: CMMNDIExporterService.ɵfac,
          providedIn: "root"
        }))();
      }
      return CMMNDIExporterService;
    })();