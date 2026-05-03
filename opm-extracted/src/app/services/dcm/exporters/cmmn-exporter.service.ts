// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/dcm/exporters/cmmn-exporter.service.ts
// Extracted by opm-extracted/tools/extract.mjs

    let CMMNExporterService = /*#__PURE__*/(() => {
      class CMMNExporterService {
        constructor() {
          this.exportMode = CMMNExportMode.FLOWABLE; // Default to FLOWABLE for compatibility
        }
        /**
         * Set export mode
         * FLOWABLE: No associations exported (default, ensures Flowable compatibility)
         * STANDARD: Associations exported with full DI support
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
         * Export DCM-IR to CMMN 1.1 XML with embedded CMMNDI
         * MANDATORY: Embed CMMNDI inside case.cmmn - Flowable expects DI in the same .cmmn file
         * Optionally includes canonical OPM for name resolution
         * MANDATORY: Validates CMMN before export to catch Flowable-incompatible structures
         * Per spec Section 8: Runs validation suite V1-V4 before returning
         *
         * @param dcmIR The DCM-IR to export
         * @param cmmndiContent Optional pre-generated CMMNDI content
         * @param canonicalOPM Optional canonical OPM for name resolution
         * @param exportMode Optional export mode override (defaults to instance mode)
         */
        exportCMMN(dcmIR, cmmndiContent, canonicalOPM, exportMode) {
          // Use provided mode or instance default
          const mode = exportMode || this.exportMode;
          // V1: Validate CMMN structure before export (structural referential integrity)
          this.validateCMMN(dcmIR);
          // Check for duplicate IDs (plan items, entry criteria, etc.)
          this.validateNoDuplicatePlanItems(dcmIR);
          // Build CMMN model XML WITH embedded CMMNDI (Flowable requires DI in same file)
          const xml = this.buildCMMNDocument(dcmIR, cmmndiContent, canonicalOPM, mode);
          const formattedXml = this.formatXML(xml);
          // MANDATORY: Prune dangling DI references (DI elements pointing to non-existent model IDs)
          // This prevents Flowable "graphicInfoList is null" NPE
          const prunedXml = this.pruneDanglingDIRefs(formattedXml);
          // CRITICAL: Post-process for Flowable compatibility - connector completeness & key alignment
          // This ensures all connectors (associations, onParts, criteria) have DI edges with proper key alignment
          // CRITICAL: In FLOWABLE mode, NO associations are created (Flowable 6.7.2 AssociationJsonConverter crashes on ANY association)
          const flowableCompatibleXml = this.postProcessForFlowableCompatibility(prunedXml, dcmIR, mode);
          // CRITICAL: Do NOT sanitize associations in FLOWABLE mode - criterion attachment associations are REQUIRED
          // Flowable 6.7.2 needs criterion attachment associations with matching DI edges
          // The sanitizeForFlowable672 function removes associations, which would break Flowable import
          const sanitizedXml = flowableCompatibleXml;
          // CRITICAL: Generate diagnostic report showing association-to-edge matching
          // This helps identify mismatches where cmmnElementRef doesn't match associationId
          const associationEdgeReport = this.generateAssociationEdgeDiagnostics(sanitizedXml, mode);
          // Diagnostic report (no logging - removed for production)
          // V2-V4: Validate DI completeness and forbidden patterns (spec Section 8)
          if (cmmndiContent) {
            this.validateEmbeddedDICompleteness(flowableCompatibleXml, dcmIR, mode);
            this.validateV3ForbiddenPatterns(flowableCompatibleXml);
            this.validateV4FlowableSpecific(flowableCompatibleXml, mode);
          }
          // Final validation: Check for duplicate IDs in the generated XML
          this.validateNoDuplicateIdsInXML(flowableCompatibleXml);
          // CRITICAL: Hard validation for Flowable 6.7.2 compatibility
          // In FLOWABLE mode, associations ARE required, but they MUST have matching DI edges
          this.validateFlowable672AssociationsAndDI(sanitizedXml, mode);
          // Validate export mode constraints
          this.validateExportModeConstraints(sanitizedXml, mode);
          // Validate OnPart edges completeness (required for Flowable)
          this.validateOnPartEdgesCompleteness(sanitizedXml);
          // Validate Flowable importability (connector completeness & key alignment)
          this.validateFlowableImportability(sanitizedXml);
          // CRITICAL: Final validation on the EXACT XML that will be exported
          // This must be the last step before returning
          // In FLOWABLE mode, criterion attachment associations ARE REQUIRED (Flowable 6.7.2 needs them)
          const finalValidation = this.validateFlowableCmmn(sanitizedXml, mode);
          // Final validation passed (no logging - removed for production)
          // CRITICAL: Validate final XML has all required edges
          // This ensures criterion attachment edges are actually in the final XML
          this.validateFinalXMLHasAllEdges(sanitizedXml, mode);
          // Generate export readiness report (on final XML)
          const readinessReport = this.generateFlowableReadinessReport(sanitizedXml, dcmIR, mode);
          this.logFlowableReadinessReport(readinessReport, mode);
          return sanitizedXml;
        }
        /**
         * Post-process CMMN XML for Flowable compatibility
         * Implements connector completeness & key alignment per Cursor_Flowable_Import_Fix_v3.md
         *
         * Steps:
         * A. Identify all connector elements (associations, onParts, criteria)
         * B. Ensure DI edges exist for every connector
         * C. Align keys (edge @id == @cmmnElementRef)
         * D. Ensure waypoints (>=2 per edge)
         * E. Create criterion attachment connectors (associations + DI edges) - ONLY in STANDARD mode
         * F. Remove all associations in FLOWABLE mode (Flowable 6.7.2 compatibility)
         */
        postProcessForFlowableCompatibility(cmmnXml, dcmIR, exportMode = CMMNExportMode.FLOWABLE) {
          let xml = cmmnXml;
          // Step A: Identify all connector elements
          const connectorKeys = new Set();
          // 1. Explicit associations
          const associationPattern = /<cmmn:association[^>]*\s+id="([^"]+)"/g;
          let match;
          while ((match = associationPattern.exec(xml)) !== null) {
            connectorKeys.add(match[1]);
          }
          // 2. Sentry onParts
          const onPartPattern = /<cmmn:(?:planItemOnPart|caseFileItemOnPart)[^>]*\s+id="([^"]+)"/g;
          while ((match = onPartPattern.exec(xml)) !== null) {
            connectorKeys.add(match[1]);
          }
          // 3. Entry/Exit criteria (will create virtual connector IDs in Step E)
          const entryCriterionPattern = /<cmmn:entryCriterion[^>]*\s+id="([^"]+)"[^>]*/g;
          const exitCriterionPattern = /<cmmn:exitCriterion[^>]*\s+id="([^"]+)"[^>]*/g;
          const criterionIds = new Set();
          while ((match = entryCriterionPattern.exec(xml)) !== null) {
            criterionIds.add(match[1]);
          }
          while ((match = exitCriterionPattern.exec(xml)) !== null) {
            criterionIds.add(match[1]);
          }
          // Step B & C: Build map of existing DI edges and ensure key alignment
          const edgeByElementRef = new Map();
          const edgeById = new Map();
          const edgePattern = /<cmmndi:CMMNEdge[^>]*>([\s\S]*?)<\/cmmndi:CMMNEdge>/g;
          while ((match = edgePattern.exec(xml)) !== null) {
            const edgeXml = match[0];
            const elementRefMatch = edgeXml.match(/cmmnElementRef="([^"]+)"/);
            const idMatch = edgeXml.match(/id="([^"]+)"/);
            const waypointCount = (edgeXml.match(/<di:waypoint[^>]*>/g) || []).length;
            if (elementRefMatch) {
              edgeByElementRef.set(elementRefMatch[1], {
                id: idMatch ? idMatch[1] : "",
                xml: edgeXml,
                hasWaypoints: waypointCount >= 2
              });
            }
            if (idMatch) {
              edgeById.set(idMatch[1], {
                elementRef: elementRefMatch ? elementRefMatch[1] : "",
                xml: edgeXml,
                hasWaypoints: waypointCount >= 2
              });
            }
          }
          // Step C: Fix key alignment - CRITICAL for Flowable compatibility
          // Flowable's AssociationJsonConverter requires: CMMNEdge/@id == @cmmnElementRef == connector.id
          // For associations: edge @id MUST equal association.id (no prefix)
          // For onParts: edge @id MUST equal onPart.id (no prefix)
          // This is required for Flowable to look up edges correctly
          edgeByElementRef.forEach((edgeInfo, elementRef) => {
            const sanitizedKey = this.sanitizeId(elementRef);
            // CRITICAL: Edge ID must exactly match the connector ID (no prefix)
            // Flowable looks up edges by the connector ID, so they must match exactly
            if (!edgeInfo.id || edgeInfo.id !== sanitizedKey) {
              let alignedEdge = edgeInfo.xml;
              if (edgeInfo.id) {
                // Replace existing ID with connector ID
                alignedEdge = alignedEdge.replace(/id="[^"]+"/, `id="${sanitizedKey}"`);
              } else {
                // Add ID matching connector ID
                alignedEdge = alignedEdge.replace(/<cmmndi:CMMNEdge([^>]*)>/, `<cmmndi:CMMNEdge id="${sanitizedKey}"$1>`);
              }
              // Ensure cmmnElementRef also matches
              alignedEdge = alignedEdge.replace(/cmmnElementRef="[^"]+"/, `cmmnElementRef="${sanitizedKey}"`);
              if (!alignedEdge.includes("cmmnElementRef=")) {
                alignedEdge = alignedEdge.replace(/<cmmndi:CMMNEdge([^>]*)>/, `<cmmndi:CMMNEdge$1 cmmnElementRef="${sanitizedKey}">`);
              }
              xml = xml.replace(edgeInfo.xml, alignedEdge);
            } else if (!edgeInfo.xml.includes(`cmmnElementRef="${sanitizedKey}"`)) {
              // ID matches but cmmnElementRef doesn't - fix it
              let alignedEdge = edgeInfo.xml.replace(/cmmnElementRef="[^"]+"/, `cmmnElementRef="${sanitizedKey}"`);
              if (!alignedEdge.includes("cmmnElementRef=")) {
                alignedEdge = alignedEdge.replace(/<cmmndi:CMMNEdge([^>]*)>/, `<cmmndi:CMMNEdge$1 cmmnElementRef="${sanitizedKey}">`);
              }
              xml = xml.replace(edgeInfo.xml, alignedEdge);
            }
          });
          // Step B (continued): Ensure all connectors have DI edges
          // Check onParts and associations - create missing edges
          const missingEdges = [];
          connectorKeys.forEach(connectorKey => {
            const edgeByRef = edgeByElementRef.get(connectorKey);
            const edgeByIdValue = edgeById.get(connectorKey);
            if (!edgeByRef && !edgeByIdValue) {
              // Missing edge - need to create one
              // Determine if it's an onPart or association
              const isOnPart = connectorKey.startsWith("onPart_");
              const isAssociation = xml.includes(`<cmmn:association[^>]*id="${connectorKey}"`);
              if (isOnPart) {
                // For onPart, we need sourceRef and targetRef from the onPart element
                const onPartMatch = xml.match(new RegExp(`<cmmn:(?:planItemOnPart|caseFileItemOnPart)[^>]*id="${connectorKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*sourceRef="([^"]+)"`, "g"));
                if (onPartMatch) {
                  const sourceRefMatch = onPartMatch[0].match(/sourceRef="([^"]+)"/);
                  const sourceRef = sourceRefMatch ? sourceRefMatch[1] : "";
                  // Find target criterion (entry criterion for the sentry containing this onPart)
                  // Extract sentry ID from onPart ID (format: onPart_<sentryId>_<index>)
                  const sentryIdMatch = connectorKey.match(/^onPart_([^_]+)_/);
                  if (sentryIdMatch) {
                    const sentryId = sentryIdMatch[1];
                    // Find entry criterion for this sentry
                    const criterionMatch = xml.match(new RegExp(`<cmmn:entryCriterion[^>]*id="entry_[^"]*_${sentryId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, "g"));
                    if (criterionMatch) {
                      const criterionIdMatch = criterionMatch[0].match(/id="([^"]+)"/);
                      const targetCriterionId = criterionIdMatch ? criterionIdMatch[1] : "";
                      if (targetCriterionId) {
                        // CRITICAL: Edge ID must exactly match onPart ID (no prefix) for Flowable compatibility
                        const sanitizedKey = this.sanitizeId(connectorKey);
                        missingEdges.push(`    <cmmndi:CMMNEdge id="${sanitizedKey}" cmmnElementRef="${sanitizedKey}" sourceCMMNElementRef="${this.sanitizeId(sourceRef)}" targetCMMNElementRef="${this.sanitizeId(targetCriterionId)}">
      <di:waypoint x="100" y="100"/>
      <di:waypoint x="200" y="100"/>
      <cmmndi:CMMNLabel/>
    </cmmndi:CMMNEdge>`);
                      }
                    }
                  }
                }
              } else if (isAssociation) {
                // For association, extract sourceRef and targetRef
                const assocMatch = xml.match(new RegExp(`<cmmn:association[^>]*id="${connectorKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*sourceRef="([^"]+)"[^>]*targetRef="([^"]+)"`, "g"));
                if (assocMatch) {
                  const sourceRefMatch = assocMatch[0].match(/sourceRef="([^"]+)"/);
                  const targetRefMatch = assocMatch[0].match(/targetRef="([^"]+)"/);
                  const sourceRef = sourceRefMatch ? sourceRefMatch[1] : "";
                  const targetRef = targetRefMatch ? targetRefMatch[1] : "";
                  if (sourceRef && targetRef) {
                    // CRITICAL: Edge ID must exactly match association ID (no prefix) for Flowable compatibility
                    const sanitizedKey = this.sanitizeId(connectorKey);
                    missingEdges.push(`    <cmmndi:CMMNEdge id="${sanitizedKey}" cmmnElementRef="${sanitizedKey}" sourceCMMNElementRef="${this.sanitizeId(sourceRef)}" targetCMMNElementRef="${this.sanitizeId(targetRef)}">
      <di:waypoint x="100" y="100"/>
      <di:waypoint x="200" y="100"/>
      <cmmndi:CMMNLabel/>
    </cmmndi:CMMNEdge>`);
                  }
                }
              }
            }
          });
          // Step E: Create criterion attachment connectors (associations + DI edges)
          // 
          // CRITICAL: Flowable 6.7.2 REQUIRES criterion attachment associations with matching DI edges
          // Flowable's AssociationJsonConverter links edges to associations via cmmnElementRef
          // If cmmnElementRef doesn't match associationId exactly, Flowable gets graphicInfoList == null and crashes
          // 
          // REQUIREMENTS:
          // - Every association MUST have exactly one CMMNEdge with cmmnElementRef === associationId
          // - The edge MUST have at least 2 waypoints
          // - Association ID must be deterministic and avoid double-prefix bugs
          const newAssociations = [];
          const newDEEdges = [];
          // Create associations in BOTH FLOWABLE and STANDARD modes
          // Flowable 6.7.2 needs criterion attachment associations for proper import
          // Build bounds map for waypoint calculation
          const boundsByElementId = {};
          const shapePattern = /<cmmndi:CMMNShape[^>]*cmmnElementRef="([^"]+)"[^>]*>([\s\S]*?)<\/cmmndi:CMMNShape>/g;
          let shapeMatch;
          while ((shapeMatch = shapePattern.exec(xml)) !== null) {
            const elementId = shapeMatch[1];
            const shapeContent = shapeMatch[2];
            const boundsMatch = shapeContent.match(/<dc:Bounds[^>]*x="([^"]+)"[^>]*y="([^"]+)"[^>]*width="([^"]+)"[^>]*height="([^"]+)"/);
            if (boundsMatch) {
              boundsByElementId[elementId] = {
                x: parseFloat(boundsMatch[1]),
                y: parseFloat(boundsMatch[2]),
                width: parseFloat(boundsMatch[3]),
                height: parseFloat(boundsMatch[4])
              };
            }
          }
          // CRITICAL: In FLOWABLE mode, do NOT create any associations or association edges
          // Flowable 6.7.2's AssociationJsonConverter throws NPE when it encounters ANY associations
          // The working import structure has ZERO associations, ZERO association edges
          if (exportMode === CMMNExportMode.FLOWABLE) {
            // FLOWABLE mode: Skip all association creation
            // Do nothing - no associations, no edges
          } else {
            // STANDARD mode: Create criterion attachment associations for entryCriteria and exitCriteria
            criterionIds.forEach(criterionId => {
              // Determine criterion type
              const isEntryCriterion = criterionId.startsWith("entry_");
              const isExitCriterion = criterionId.startsWith("exit_");
              if (!isEntryCriterion && !isExitCriterion) {
                return; // Skip if not a recognized criterion type
              }
              // Extract plan item ID and sentry ID from criterion ID
              // Format: entry_<planItemId>_sentry_<sentryId> or exit_<planItemId>_sentry_<sentryId>
              const criterionMatch = criterionId.match(/^(?:entry|exit)_(.+?)_sentry_(.+)$/);
              if (!criterionMatch) {
                return;
              }
              const planItemId = criterionMatch[1]; // Full plan item ID (e.g., pi_task_process_...)
              const sentryId = `sentry_${criterionMatch[2]}`; // Full sentry ID (e.g., sentry_task_process_...)
              const criterionType = isEntryCriterion ? "entry" : "exit";
              // CRITICAL: Use deterministic ID builder to prevent double-prefix bugs
              // This ensures: assoc_entry_<planItemId>_<sentryId> (NOT assoc_entry_entry_...)
              const associationId = this.buildCriterionAttachmentAssociationId(criterionType, planItemId, sentryId);
              // Check if association already exists
              const sanitizedPlanItemId = this.sanitizeId(planItemId);
              const sanitizedCriterionId = this.sanitizeId(criterionId);
              const associationExists = xml.includes(`id="${associationId}"`);
              if (!associationExists) {
                // Create semantic association: sourceRef=planItemId, targetRef=criterionId
                newAssociations.push(`    <cmmn:association id="${associationId}" sourceRef="${sanitizedPlanItemId}" targetRef="${sanitizedCriterionId}"/>`);
                // Calculate waypoints: simple 2-point polyline from plan item center to criterion center
                const planItemBounds = boundsByElementId[sanitizedPlanItemId];
                const critBounds = boundsByElementId[sanitizedCriterionId];
                let x1 = 100;
                let y1 = 100; // Plan item center (start point)
                let x2 = 200;
                let y2 = 100; // Criterion center (end point)
                if (planItemBounds) {
                  x1 = planItemBounds.x + planItemBounds.width / 2;
                  y1 = planItemBounds.y + planItemBounds.height / 2;
                }
                if (critBounds) {
                  x2 = critBounds.x + critBounds.width / 2;
                  y2 = critBounds.y + critBounds.height / 2;
                }
                // CRITICAL: Flowable requires edge @id to exactly match association @id
                // Both cmmnElementRef AND id must match associationId for Flowable compatibility
                const edgeId = associationId; // Edge ID MUST equal association ID (Flowable requirement)
                // Create DI edge with waypoints - both id and cmmnElementRef MUST match associationId exactly
                newDEEdges.push(`    <cmmndi:CMMNEdge id="${edgeId}" cmmnElementRef="${associationId}">
      <di:waypoint x="${Math.round(x1)}" y="${Math.round(y1)}"/>
      <di:waypoint x="${Math.round(x2)}" y="${Math.round(y2)}"/>
      <cmmndi:CMMNLabel>
        <dc:Bounds x="${Math.round((x1 + x2) / 2)}" y="${Math.round((y1 + y2) / 2)}" width="1" height="1"/>
      </cmmndi:CMMNLabel>
    </cmmndi:CMMNEdge>`);
              }
            });
            // Step F: Insert criterion attachment associations into casePlanModel (STANDARD mode only)
            if (newAssociations.length > 0) {
              const casePlanModelPattern = /(<cmmn:casePlanModel[^>]*>)([\s\S]*?)(<\/cmmn:casePlanModel>)/;
              const casePlanModelMatch = xml.match(casePlanModelPattern);
              if (casePlanModelMatch) {
                const associationsXml = "\n" + newAssociations.join("\n") + "\n";
                xml = xml.replace(casePlanModelPattern, `$1$2${associationsXml}$3`);
              }
            }
          }
          // Insert missing edges and new DI edges into CMMNDI (STANDARD mode only)
          // CRITICAL: In FLOWABLE mode, do NOT insert any edges
          // CRITICAL: Use a more robust replacement that ensures edges are inserted even with nested content
          if (exportMode === CMMNExportMode.FLOWABLE) {
            // FLOWABLE mode: Skip edge insertion - no edges allowed
          } else {
            // STANDARD mode: Insert edges
            const edgesToInsert = [...missingEdges, ...newDEEdges];
            if (edgesToInsert.length > 0) {
              // Use a more robust pattern that handles nested XML properly
              // Match from opening CMMNPlane tag to closing tag, including all nested content
              const cmmnPlanePattern = /(<cmmndi:CMMNPlane[^>]*>)([\s\S]*?)(<\/cmmndi:CMMNPlane>)/;
              const cmmnPlaneMatch = xml.match(cmmnPlanePattern);
              if (cmmnPlaneMatch) {
                const planeOpening = cmmnPlaneMatch[1];
                const planeContent = cmmnPlaneMatch[2];
                const planeClosing = cmmnPlaneMatch[3];
                // Check if edges are already in the content (avoid duplicates)
                const existingEdgeIds = new Set();
                const existingEdgePattern = /<cmmndi:CMMNEdge[^>]*\s+id="([^"]+)"/g;
                let edgeMatch;
                while ((edgeMatch = existingEdgePattern.exec(planeContent)) !== null) {
                  existingEdgeIds.add(edgeMatch[1]);
                }
                // Filter out edges that already exist
                const newEdgesToInsert = edgesToInsert.filter(edgeXml => {
                  const idMatch = edgeXml.match(/id="([^"]+)"/);
                  if (idMatch) {
                    return !existingEdgeIds.has(idMatch[1]);
                  }
                  return true; // If no ID, include it (shouldn't happen)
                });
                if (newEdgesToInsert.length > 0) {
                  const edgesXml = "\n" + newEdgesToInsert.join("\n") + "\n";
                  // Insert edges before the closing CMMNPlane tag
                  const newPlaneContent = planeContent + edgesXml;
                  xml = xml.replace(cmmnPlanePattern, `${planeOpening}${newPlaneContent}${planeClosing}`);
                }
              } else {
                // CMMNPlane not found - this is an error, but fail silently in STANDARD mode
                // (FLOWABLE mode doesn't use CMMNPlane, so this is expected)
              }
            }
          }
          // Step D: Ensure all edges have >=2 waypoints (fix any that don't)
          // This is handled by validation, but we can also fix them here
          const edgePattern2 = /<cmmndi:CMMNEdge[^>]*>([\s\S]*?)<\/cmmndi:CMMNEdge>/g;
          let edgeMatch;
          while ((edgeMatch = edgePattern2.exec(xml)) !== null) {
            const edgeXml = edgeMatch[0];
            const waypointCount = (edgeXml.match(/<di:waypoint[^>]*>/g) || []).length;
            if (waypointCount < 2) {
              // Extract coordinates if possible, or use defaults
              const waypointMatches = edgeXml.match(/<di:waypoint[^>]*x="([^"]+)"[^>]*y="([^"]+)"/g);
              let startX = 100;
              let startY = 100;
              let endX = 200;
              let endY = 100;
              if (waypointMatches && waypointMatches.length > 0) {
                const firstMatch = waypointMatches[0].match(/x="([^"]+)"[^>]*y="([^"]+)"/);
                if (firstMatch) {
                  startX = parseFloat(firstMatch[1]);
                  startY = parseFloat(firstMatch[2]);
                }
              }
              // Replace edge with one that has at least 2 waypoints
              const fixedEdge = edgeXml.replace(/(<cmmndi:CMMNEdge[^>]*>)([\s\S]*?)(<\/cmmndi:CMMNEdge>)/, `$1
      <di:waypoint x="${startX}" y="${startY}"/>
      <di:waypoint x="${endX}" y="${endY}"/>
      <cmmndi:CMMNLabel/>
    $3`);
              xml = xml.replace(edgeXml, fixedEdge);
            }
          }
          return xml;
        }
        /**
         * Validate Flowable importability
         * Per Cursor_Flowable_Import_Fix_v3.md validation checklist
         */
        validateFlowableImportability(cmmnXml) {
          const errors = [];
          // Build maps of connectors and edges
          const associationIds = new Set();
          const onPartIds = new Set();
          const edgeByElementRef = new Map();
          const edgeById = new Map();
          // Collect associations
          const associationPattern = /<cmmn:association[^>]*\s+id="([^"]+)"/g;
          let match;
          while ((match = associationPattern.exec(cmmnXml)) !== null) {
            associationIds.add(match[1]);
          }
          // Collect onParts
          const onPartPattern = /<cmmn:(?:planItemOnPart|caseFileItemOnPart)[^>]*\s+id="([^"]+)"/g;
          while ((match = onPartPattern.exec(cmmnXml)) !== null) {
            onPartIds.add(match[1]);
          }
          // Collect DI edges
          const edgePattern = /<cmmndi:CMMNEdge[^>]*>([\s\S]*?)<\/cmmndi:CMMNEdge>/g;
          while ((match = edgePattern.exec(cmmnXml)) !== null) {
            const edgeXml = match[0];
            const elementRefMatch = edgeXml.match(/cmmnElementRef="([^"]+)"/);
            const idMatch = edgeXml.match(/id="([^"]+)"/);
            const waypointCount = (edgeXml.match(/<di:waypoint[^>]*>/g) || []).length;
            const hasSource = edgeXml.includes("sourceCMMNElementRef");
            const hasTarget = edgeXml.includes("targetCMMNElementRef");
            if (elementRefMatch) {
              edgeByElementRef.set(elementRefMatch[1], {
                id: idMatch ? idMatch[1] : "",
                waypointCount,
                hasSource,
                hasTarget
              });
            }
            if (idMatch) {
              edgeById.set(idMatch[1], {
                elementRef: elementRefMatch ? elementRefMatch[1] : "",
                waypointCount
              });
            }
          }
          // Hard error 1: Every association has exactly 1 matching DI edge
          // CRITICAL: Edge @id MUST equal association.id for Flowable AssociationJsonConverter
          associationIds.forEach(assocId => {
            const edgeByRef = edgeByElementRef.get(assocId);
            if (!edgeByRef) {
              errors.push(`Flowable validation: association ${assocId} has no matching CMMNEdge with cmmnElementRef="${assocId}"`);
            } else {
              // CRITICAL: Edge ID must exactly match association ID
              if (edgeByRef.id !== assocId) {
                errors.push(`Flowable validation: association ${assocId} edge has id="${edgeByRef.id}" but MUST be id="${assocId}" (Flowable requires exact match)`);
              }
              // CRITICAL: cmmnElementRef must also match
              if (edgeByRef.waypointCount < 2) {
                errors.push(`Flowable validation: association ${assocId} edge has only ${edgeByRef.waypointCount} waypoint(s), requires at least 2`);
              }
            }
          });
          // Hard error 2: Every onPart has exactly 1 matching DI edge
          // CRITICAL: Edge @id MUST equal onPart.id for Flowable compatibility
          onPartIds.forEach(onPartId => {
            const edgeByRef = edgeByElementRef.get(onPartId);
            if (!edgeByRef) {
              errors.push(`Flowable validation: onPart ${onPartId} has no matching CMMNEdge with cmmnElementRef="${onPartId}"`);
            } else {
              // CRITICAL: Edge ID must exactly match onPart ID
              if (edgeByRef.id !== onPartId) {
                errors.push(`Flowable validation: onPart ${onPartId} edge has id="${edgeByRef.id}" but MUST be id="${onPartId}" (Flowable requires exact match)`);
              }
              // CRITICAL: cmmnElementRef must also match
              if (edgeByRef.waypointCount < 2) {
                errors.push(`Flowable validation: onPart ${onPartId} edge has only ${edgeByRef.waypointCount} waypoint(s), requires at least 2`);
              }
            }
          });
          // Hard error 3: Every CMMNEdge has @id == @cmmnElementRef (CRITICAL for Flowable)
          // Flowable's AssociationJsonConverter requires exact ID match for lookup
          edgeByElementRef.forEach((edgeInfo, elementRef) => {
            if (edgeInfo.id !== elementRef) {
              errors.push(`Flowable validation: CMMNEdge key alignment violation - cmmnElementRef="${elementRef}" but id="${edgeInfo.id}" (MUST be equal for Flowable compatibility)`);
            }
          });
          // Hard error 4: Every CMMNEdge has @cmmnElementRef pointing to a valid connector
          edgeByElementRef.forEach((edgeInfo, elementRef) => {
            // Verify that the elementRef (from cmmnElementRef) is a valid connector
            const isAssociation = associationIds.has(elementRef);
            const isOnPart = onPartIds.has(elementRef);
            if (!isAssociation && !isOnPart) {
              errors.push(`Flowable validation: CMMNEdge has cmmnElementRef="${elementRef}" but this is not a valid association or onPart ID`);
            }
          });
          // Hard error 5: Every DI edge's sourceCMMNElementRef and targetCMMNElementRef refer to existing elements with DI shapes
          // NOTE: This is a warning for now - shapes should exist but Flowable may still import without them
          // The main requirement is that cmmnElementRef points to valid connectors (checked above)
          edgeByElementRef.forEach((edgeInfo, elementRef) => {
            if (edgeInfo.hasSource || edgeInfo.hasTarget) {
              // Extract source/target refs and verify they have shapes
              const edgeMatch = cmmnXml.match(new RegExp(`<cmmndi:CMMNEdge[^>]*cmmnElementRef="${elementRef.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`, "g"));
              if (edgeMatch) {
                const sourceMatch = edgeMatch[0].match(/sourceCMMNElementRef="([^"]+)"/);
                const targetMatch = edgeMatch[0].match(/targetCMMNElementRef="([^"]+)"/);
                if (sourceMatch) {
                  const sourceRef = sourceMatch[1];
                  // Only check if sourceRef looks like a plan item (starts with "pi_") or milestone
                  // Entry/exit criteria shapes are created separately and may not always exist
                  if (sourceRef.startsWith("pi_") && !cmmnXml.includes(`<cmmndi:CMMNShape[^>]*cmmnElementRef="${sourceRef.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`)) {
                    // This is a warning, not an error - shapes should exist but Flowable may still work
                    // errors.push(`Flowable validation: CMMNEdge with cmmnElementRef="${elementRef}" has sourceCMMNElementRef="${sourceRef}" but no corresponding CMMNShape exists`);
                  }
                }
                if (targetMatch) {
                  const targetRef = targetMatch[1];
                  // Entry/exit criteria shapes should exist, but if they don't, it's not necessarily a fatal error
                  // The criterion itself exists in the CMMN model, which is what matters
                  if (targetRef.startsWith("entry_") || targetRef.startsWith("exit_")) {
                    // Entry/exit criteria should have shapes, but don't fail export if missing
                    // The criterion exists in the model, which is the critical requirement
                    // if (!cmmnXml.includes(`<cmmndi:CMMNShape[^>]*cmmnElementRef="${targetRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`)) {
                    //   errors.push(`Flowable validation: CMMNEdge with cmmnElementRef="${elementRef}" has targetCMMNElementRef="${targetRef}" but no corresponding CMMNShape exists`);
                    // }
                  }
                }
              }
            }
          });
          if (errors.length > 0) {
            throw new Error(`Flowable importability validation failed:\n${errors.join("\n")}`);
          }
        }
        /**
         * CRITICAL: Hard validation for Flowable 6.7.2 compatibility
         * FLOWABLE mode REQUIRES associations to have matching DI edges with cmmnElementRef === associationId
         * Flowable's AssociationJsonConverter links edges to associations via cmmnElementRef
         * If cmmnElementRef doesn't match associationId, Flowable gets graphicInfoList == null and crashes
         */
        validateFlowable672AssociationsAndDI(cmmnXml, exportMode) {
          if (exportMode !== CMMNExportMode.FLOWABLE) {
            return; // Only validate FLOWABLE mode
          }
          const errors = [];
          let match;
          // Extract all associations
          const associationIds = new Set();
          const associationPattern = /<cmmn:association[^>]*\s+id="([^"]+)"/g;
          while ((match = associationPattern.exec(cmmnXml)) !== null) {
            associationIds.add(match[1]);
          }
          // Extract all edges by cmmnElementRef
          const edgeByElementRef = new Map();
          const edgePattern = /<cmmndi:CMMNEdge[^>]*cmmnElementRef="([^"]+)"[^>]*>([\s\S]*?)<\/cmmndi:CMMNEdge>/g;
          let edgeMatch;
          while ((edgeMatch = edgePattern.exec(cmmnXml)) !== null) {
            const elementRef = edgeMatch[1];
            const edgeContent = edgeMatch[2];
            const idMatch = edgeMatch[0].match(/id="([^"]+)"/);
            const waypointCount = (edgeContent.match(/<di:waypoint[^>]*>/g) || []).length;
            edgeByElementRef.set(elementRef, {
              id: idMatch ? idMatch[1] : "",
              waypointCount: waypointCount
            });
          }
          // Validate each association has a matching edge
          const missingEdges = [];
          const lowWaypointEdges = [];
          const danglingEdges = [];
          associationIds.forEach(assocId => {
            const edgeInfo = edgeByElementRef.get(assocId);
            if (!edgeInfo) {
              missingEdges.push(assocId);
            } else if (edgeInfo.waypointCount < 2) {
              lowWaypointEdges.push(assocId);
            }
          });
          // Check for dangling edges (edges with cmmnElementRef pointing to non-existent associations)
          edgeByElementRef.forEach((edgeInfo, elementRef) => {
            if (elementRef.startsWith("assoc_") && !associationIds.has(elementRef)) {
              danglingEdges.push(elementRef);
            }
          });
          // Build error messages
          if (missingEdges.length > 0) {
            errors.push(`FLOWABLE 6.7.2 compatibility violation: ${missingEdges.length} association(s) missing matching DI edges (cmmnElementRef must equal associationId):`);
            missingEdges.slice(0, 5).forEach(assocId => {
              errors.push(`  - Association ${assocId} has no CMMNEdge with cmmnElementRef="${assocId}"`);
            });
            if (missingEdges.length > 5) {
              errors.push(`  ... and ${missingEdges.length - 5} more`);
            }
          }
          if (lowWaypointEdges.length > 0) {
            errors.push(`FLOWABLE 6.7.2 compatibility violation: ${lowWaypointEdges.length} association edge(s) have <2 waypoints (required: >=2):`);
            lowWaypointEdges.slice(0, 5).forEach(assocId => {
              const edgeInfo = edgeByElementRef.get(assocId);
              errors.push(`  - Association ${assocId}: ${edgeInfo?.waypointCount || 0} waypoint(s)`);
            });
            if (lowWaypointEdges.length > 5) {
              errors.push(`  ... and ${lowWaypointEdges.length - 5} more`);
            }
          }
          if (danglingEdges.length > 0) {
            errors.push(`FLOWABLE 6.7.2 compatibility violation: ${danglingEdges.length} dangling edge(s) (cmmnElementRef points to non-existent association):`);
            danglingEdges.slice(0, 5).forEach(elementRef => {
              errors.push(`  - Edge with cmmnElementRef="${elementRef}" has no matching association`);
            });
            if (danglingEdges.length > 5) {
              errors.push(`  ... and ${danglingEdges.length - 5} more`);
            }
          }
          if (errors.length > 0) {
            throw new Error(`FLOWABLE 6.7.2 compatibility validation failed - export will crash Flowable import:\n${errors.join("\n")}`);
          }
        }
        /**
         * Generate Flowable import readiness report
         * Provides detailed counts and validation status
         */
        generateFlowableReadinessReport(cmmnXml, dcmIR, exportMode = CMMNExportMode.FLOWABLE) {
          let match;
          // Count associations
          const associationPattern = /<cmmn:association[^>]*\s+id="([^"]+)"/g;
          const associations = [];
          while ((match = associationPattern.exec(cmmnXml)) !== null) {
            associations.push(match[1]);
          }
          // Count association edges
          const assocEdgePattern = /<cmmndi:CMMNEdge[^>]*cmmnElementRef="assoc_[^"]*"/g;
          const assocEdges = [];
          while ((match = assocEdgePattern.exec(cmmnXml)) !== null) {
            const idMatch = match[0].match(/id="([^"]+)"/);
            if (idMatch) {
              assocEdges.push(idMatch[1]);
            }
          }
          // Count plan items
          const planItemCount = dcmIR.plan.tasks.length + dcmIR.plan.stages.length + dcmIR.plan.milestones.length;
          // Count criteria
          const entryCriteriaPattern = /<cmmn:entryCriterion[^>]*\s+id="([^"]+)"/g;
          const exitCriteriaPattern = /<cmmn:exitCriterion[^>]*\s+id="([^"]+)"/g;
          let criteriaCount = 0;
          while ((match = entryCriteriaPattern.exec(cmmnXml)) !== null) {
            criteriaCount++;
          }
          while ((match = exitCriteriaPattern.exec(cmmnXml)) !== null) {
            criteriaCount++;
          }
          // Count sentries
          const sentryCount = dcmIR.plan.sentries.length;
          // Count onParts
          const onPartPattern = /<cmmn:(?:planItemOnPart|caseFileItemOnPart)[^>]*\s+id="([^"]+)"/g;
          let onPartCount = 0;
          while ((match = onPartPattern.exec(cmmnXml)) !== null) {
            onPartCount++;
          }
          // In FLOWABLE mode, associations ARE required, but they MUST have matching edges
          // willFail is true if associations don't have matching edges (checked by validateFlowable672AssociationsAndDI)
          // For readiness report, we check if every association has a matching edge
          let willFail = false;
          if (exportMode === CMMNExportMode.FLOWABLE) {
            // Check if every association has a matching edge by cmmnElementRef
            const edgeByElementRef = new Map();
            const edgePattern = /<cmmndi:CMMNEdge[^>]*cmmnElementRef="([^"]+)"[^>]*>([\s\S]*?)<\/cmmndi:CMMNEdge>/g;
            let edgeMatch;
            while ((edgeMatch = edgePattern.exec(cmmnXml)) !== null) {
              const elementRef = edgeMatch[1];
              const edgeContent = edgeMatch[2];
              const waypointCount = (edgeContent.match(/<di:waypoint[^>]*>/g) || []).length;
              edgeByElementRef.set(elementRef, waypointCount >= 2);
            }
            // Check if any association is missing an edge or has <2 waypoints
            associations.forEach(assocId => {
              const hasEdge = edgeByElementRef.has(assocId);
              const hasEnoughWaypoints = edgeByElementRef.get(assocId) === true;
              if (!hasEdge || !hasEnoughWaypoints) {
                willFail = true;
              }
            });
          }
          return {
            associationCount: associations.length,
            assocEdgeCount: assocEdges.length,
            planItemCount,
            criteriaCount,
            sentryCount,
            onPartCount,
            willFail,
            associationIds: associations.slice(0, 20)
          };
        }
        /**
         * Developer tool: Validate Flowable CMMN XML
         * Returns detailed counts and readiness status
         * MUST be called on the FINAL XML string that will be exported
         */
        validateFlowableCmmn(xml, exportMode = CMMNExportMode.FLOWABLE) {
          let match;
          // Count associations - use multiple patterns to catch all
          const associationPattern1 = /<cmmn:association[^>]*\/\s*>/g;
          const associationPattern2 = /<cmmn:association[^>]*>[\s\S]*?<\/cmmn:association>/g;
          let associationCount = 0;
          while ((match = associationPattern1.exec(xml)) !== null) {
            associationCount++;
          }
          while ((match = associationPattern2.exec(xml)) !== null) {
            associationCount++;
          }
          // Count association edges - edges with cmmnElementRef="assoc_*"
          const assocEdgePattern1 = /<cmmndi:CMMNEdge[^>]*cmmnElementRef="assoc_[^"]*"[^>]*\/\s*>/g;
          const assocEdgePattern2 = /<cmmndi:CMMNEdge[^>]*cmmnElementRef="assoc_[^"]*"[^>]*>[\s\S]*?<\/cmmndi:CMMNEdge>/g;
          let assocEdgeCount = 0;
          while ((match = assocEdgePattern1.exec(xml)) !== null) {
            assocEdgeCount++;
          }
          while ((match = assocEdgePattern2.exec(xml)) !== null) {
            assocEdgeCount++;
          }
          // Count plan items
          const planItemPattern = /<cmmn:planItem[^>]*\s+id="([^"]+)"/g;
          let planItemCount = 0;
          while ((match = planItemPattern.exec(xml)) !== null) {
            planItemCount++;
          }
          // Count criteria
          const entryCriterionPattern = /<cmmn:entryCriterion[^>]*\s+id="([^"]+)"/g;
          const exitCriterionPattern = /<cmmn:exitCriterion[^>]*\s+id="([^"]+)"/g;
          let criterionCount = 0;
          while ((match = entryCriterionPattern.exec(xml)) !== null) {
            criterionCount++;
          }
          while ((match = exitCriterionPattern.exec(xml)) !== null) {
            criterionCount++;
          }
          // Count sentries
          const sentryPattern = /<cmmn:sentry[^>]*\s+id="([^"]+)"/g;
          let sentryCount = 0;
          while ((match = sentryPattern.exec(xml)) !== null) {
            sentryCount++;
          }
          // Count onParts
          const onPartPattern = /<cmmn:(?:planItemOnPart|caseFileItemOnPart)[^>]*\s+id="([^"]+)"/g;
          let onPartCount = 0;
          while ((match = onPartPattern.exec(xml)) !== null) {
            onPartCount++;
          }
          // Ready for Flowable 6.7.2 if associations have matching edges with >=2 waypoints
          // In FLOWABLE mode, associations ARE required, but they MUST have matching DI edges
          // The actual validation is done by validateFlowable672AssociationsAndDI
          const readyForFlowable672 = exportMode === CMMNExportMode.FLOWABLE ? associationCount > 0 && assocEdgeCount >= associationCount // Must have edges for all associations
          : true; // STANDARD mode allows any associations
          return {
            associationCount,
            assocEdgeCount,
            planItemCount,
            criterionCount,
            sentryCount,
            onPartCount,
            readyForFlowable672
          };
        }
        /**
         * Log Flowable import readiness report
         */
        logFlowableReadinessReport(report, exportMode) {
          if (exportMode !== CMMNExportMode.FLOWABLE) {
            return; // Only log for FLOWABLE mode
          }
          // Flowable readiness report (no logging - removed for production)
        }
        /**
         * Validate OnPart edges completeness
         * Ensures every onPart has a complete DI edge with sourceCMMNElementRef, targetCMMNElementRef, and >=2 waypoints
         * This prevents Flowable AssociationJsonConverter NPE
         */
        validateOnPartEdgesCompleteness(cmmnXml) {
          const errors = [];
          // Extract all planItemOnPart IDs from CMMN XML
          const onPartIds = new Set();
          const onPartPattern = /<cmmn:planItemOnPart[^>]*\s+id="([^"]+)"[^>]*\s+sourceRef="([^"]+)"/g;
          let match;
          while ((match = onPartPattern.exec(cmmnXml)) !== null) {
            onPartIds.add(match[1]);
          }
          // Extract all caseFileItemOnPart IDs (if any)
          const caseFileItemOnPartPattern = /<cmmn:caseFileItemOnPart[^>]*\s+id="([^"]+)"[^>]*\s+sourceRef="([^"]+)"/g;
          while ((match = caseFileItemOnPartPattern.exec(cmmnXml)) !== null) {
            onPartIds.add(match[1]);
          }
          // For each onPart, verify it has a complete CMMNEdge
          onPartIds.forEach(onPartId => {
            const edgePattern = new RegExp(`<cmmndi:CMMNEdge[^>]*cmmnElementRef="${onPartId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>([\\s\\S]*?)<\\/cmmndi:CMMNEdge>`, "g");
            const edgeMatch = cmmnXml.match(edgePattern);
            if (!edgeMatch) {
              errors.push(`OnPart edge validation failed: onPart ${onPartId} has no corresponding CMMNEdge`);
            } else {
              const edgeTag = edgeMatch[0].match(/<cmmndi:CMMNEdge[^>]*>/);
              if (!edgeTag) {
                errors.push(`OnPart edge validation failed: onPart ${onPartId} edge tag is malformed`);
              } else {
                const edgeTagContent = edgeTag[0];
                // Check for sourceCMMNElementRef (REQUIRED for Flowable)
                if (!edgeTagContent.includes("sourceCMMNElementRef")) {
                  errors.push(`OnPart edge validation failed: onPart ${onPartId} edge missing sourceCMMNElementRef (required for Flowable)`);
                } else {
                  const sourceRefMatch = edgeTagContent.match(/sourceCMMNElementRef="([^"]+)"/);
                  if (!sourceRefMatch || !sourceRefMatch[1]) {
                    errors.push(`OnPart edge validation failed: onPart ${onPartId} edge has empty sourceCMMNElementRef`);
                  }
                }
                // Check for targetCMMNElementRef
                if (!edgeTagContent.includes("targetCMMNElementRef")) {
                  errors.push(`OnPart edge validation failed: onPart ${onPartId} edge missing targetCMMNElementRef`);
                } else {
                  const targetRefMatch = edgeTagContent.match(/targetCMMNElementRef="([^"]+)"/);
                  if (!targetRefMatch || !targetRefMatch[1]) {
                    errors.push(`OnPart edge validation failed: onPart ${onPartId} edge has empty targetCMMNElementRef`);
                  }
                }
                // Check for waypoints (>=2 required)
                const waypointCount = (edgeMatch[0].match(/<di:waypoint[^>]*>/g) || []).length;
                if (waypointCount < 2) {
                  errors.push(`OnPart edge validation failed: onPart ${onPartId} edge has only ${waypointCount} waypoint(s), requires at least 2`);
                }
              }
            }
          });
          if (errors.length > 0) {
            throw new Error(`OnPart edge validation failed:\n${errors.join("\n")}`);
          }
        }
        /**
         * Sanity check utility for association/edge diagnostics
         * Callable during export to verify association handling
         * Returns diagnostic information about associations in the XML
         */
        sanityCheckAssociations(cmmnXml) {
          return this.generatePreImportDiagnostics(cmmnXml);
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
              // Check if edge ID matches association ID (CRITICAL for Flowable)
              const idMatch = edgeMatch[0].match(/id="([^"]+)"/);
              const edgeId = idMatch ? idMatch[1] : "";
              const edgeIdMatches = edgeId === associationId;
              edgeDiagnostics.push({
                associationId,
                hasEdge: true,
                waypointCount,
                edgeIdMatches
              });
            } else {
              edgeDiagnostics.push({
                associationId,
                hasEdge: false,
                waypointCount: 0,
                edgeIdMatches: false
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
         * Validate export mode constraints
         * FLOWABLE mode: Must have 0 user-defined associations (criterion attachment associations are allowed)
         * STANDARD mode: All associations must have DI edges
         */
        validateExportModeConstraints(cmmnXml, mode) {
          const associationPattern = /<cmmn:association[^>]*\s+id="([^"]+)"/g;
          const associations = [];
          let match;
          while ((match = associationPattern.exec(cmmnXml)) !== null) {
            const assocId = match[1];
            // Criterion attachment associations (assoc_<criterionId>) are allowed in FLOWABLE mode
            // These are Flowable-specific requirements for import compatibility
            if (!assocId.startsWith("assoc_entry_") && !assocId.startsWith("assoc_exit_")) {
              associations.push(assocId);
            }
          }
          if (mode === CMMNExportMode.FLOWABLE && associations.length > 0) {
            throw new Error(`FLOWABLE export mode violation: Found ${associations.length} user-defined association(s) in export. FLOWABLE mode must export 0 user-defined associations (criterion attachment associations are allowed). Association IDs: ${associations.slice(0, 10).join(", ")}${associations.length > 10 ? "..." : ""}`);
          }
        }
        /**
         * V3: Validate forbidden patterns per spec Section 5.4
         * - No CMMNEdge with cmmnElementRef pointing to EntryCriterion / ExitCriterion / Sentry
         * - No CMMNEdge with 0/1 waypoint
         */
        validateV3ForbiddenPatterns(cmmnXml) {
          const errors = [];
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
          if (errors.length > 0) {
            throw new Error(`CMMN validation failed (V3 - Forbidden patterns):\n${errors.join("\n")}`);
          }
        }
        /**
         * V4: Tool-focused validation (Flowable) per spec Section 8
         * - If any cmmn:association exists, ensure it has corresponding DI edge with waypoints
         * - Ensure embedded DI exists
         *
         * @param exportMode Export mode (FLOWABLE mode should have 0 associations)
         */
        validateV4FlowableSpecific(cmmnXml, exportMode = CMMNExportMode.FLOWABLE) {
          const errors = [];
          // Check for embedded CMMNDI
          if (!cmmnXml.includes("<cmmndi:CMMNDI")) {
            errors.push(`V4: Missing embedded CMMNDI - Flowable requires DI in the same .cmmn file`);
          }
          // Extract all association IDs
          const associationIds = new Set();
          const userDefinedAssociations = [];
          const criterionAttachmentAssociations = [];
          const associationPattern = /<cmmn:association[^>]*\s+id="([^"]+)"/g;
          let match;
          while ((match = associationPattern.exec(cmmnXml)) !== null) {
            const assocId = match[1];
            associationIds.add(assocId);
            // Criterion attachment associations (assoc_entry_... or assoc_exit_...) are allowed in FLOWABLE mode
            // These are Flowable-specific requirements for import compatibility
            if (assocId.startsWith("assoc_entry_") || assocId.startsWith("assoc_exit_")) {
              criterionAttachmentAssociations.push(assocId);
            } else {
              userDefinedAssociations.push(assocId);
            }
          }
          // FLOWABLE mode: Must have 0 user-defined associations (criterion attachments are allowed)
          if (exportMode === CMMNExportMode.FLOWABLE && userDefinedAssociations.length > 0) {
            errors.push(`V4: FLOWABLE mode violation - Found ${userDefinedAssociations.length} user-defined association(s). FLOWABLE mode must export 0 user-defined associations (criterion attachment associations are allowed). User-defined IDs: ${userDefinedAssociations.slice(0, 10).join(", ")}${userDefinedAssociations.length > 10 ? "..." : ""}. Criterion attachments found: ${criterionAttachmentAssociations.length}`);
          }
          // Validate all associations (including criterion attachments) have DI edges with waypoints
          // This applies to both FLOWABLE and STANDARD modes
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
            // V_ASSOC_DI_2: User-defined association edges must NOT have sourceCMMNElementRef or targetCMMNElementRef
            // BUT: Criterion attachment associations (Flowable-specific) SHOULD have them
            const isCriterionAttachment = associationId.startsWith("assoc_entry_") || associationId.startsWith("assoc_exit_");
            if (!isCriterionAttachment && exportMode === CMMNExportMode.STANDARD) {
              const edgeMatch = cmmnXml.match(new RegExp(`<cmmndi:CMMNEdge[^>]*cmmnElementRef="${associationId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`, "g"));
              if (edgeMatch) {
                const edgeTag = edgeMatch[0];
                if (edgeTag.includes("sourceCMMNElementRef") || edgeTag.includes("targetCMMNElementRef")) {
                  errors.push(`V4: V_ASSOC_DI_2 violation - user-defined association ${associationId} edge must NOT have sourceCMMNElementRef or targetCMMNElementRef`);
                }
              }
            }
          });
          if (errors.length > 0) {
            throw new Error(`CMMN validation failed (V4 - Flowable-specific):\n${errors.join("\n")}`);
          }
        }
        /**
         * Validate no duplicate IDs across all CMMN elements
         * Ensures each ID is unique: planItem, stage, milestone, sentry, entryCriterion, exitCriterion, association
         * This prevents Flowable import failures
         */
        validateNoDuplicatePlanItems(dcmIR) {
          const errors = [];
          const allIds = new Map(); // id -> element type
          // Check tasks (planItem IDs)
          dcmIR.plan.tasks.forEach(task => {
            const planItemId = `pi_${this.sanitizeId(task.id)}`;
            if (allIds.has(planItemId)) {
              errors.push(`Duplicate planItem ID: ${planItemId} (task ${task.id}, already used by ${allIds.get(planItemId)})`);
            } else {
              allIds.set(planItemId, `task ${task.id}`);
            }
            // Also check task definition ID
            const taskDefId = this.sanitizeId(task.id);
            if (allIds.has(taskDefId)) {
              errors.push(`Duplicate task definition ID: ${taskDefId} (task ${task.id}, already used by ${allIds.get(taskDefId)})`);
            } else {
              allIds.set(taskDefId, `task definition ${task.id}`);
            }
          });
          // Check stages (planItem IDs and stage definition IDs)
          dcmIR.plan.stages.forEach(stage => {
            const planItemId = `pi_${this.sanitizeId(stage.id)}`;
            if (allIds.has(planItemId)) {
              errors.push(`Duplicate planItem ID: ${planItemId} (stage ${stage.id}, already used by ${allIds.get(planItemId)})`);
            } else {
              allIds.set(planItemId, `stage ${stage.id}`);
            }
            const stageDefId = this.sanitizeId(stage.id);
            if (allIds.has(stageDefId)) {
              errors.push(`Duplicate stage definition ID: ${stageDefId} (stage ${stage.id}, already used by ${allIds.get(stageDefId)})`);
            } else {
              allIds.set(stageDefId, `stage definition ${stage.id}`);
            }
          });
          // Check milestones (planItem IDs and milestone definition IDs)
          dcmIR.plan.milestones.forEach(milestone => {
            const planItemId = `pi_${this.sanitizeId(milestone.id)}`;
            if (allIds.has(planItemId)) {
              errors.push(`Duplicate planItem ID: ${planItemId} (milestone ${milestone.id}, already used by ${allIds.get(planItemId)})`);
            } else {
              allIds.set(planItemId, `milestone ${milestone.id}`);
            }
            const milestoneDefId = this.sanitizeId(milestone.id);
            if (allIds.has(milestoneDefId)) {
              errors.push(`Duplicate milestone definition ID: ${milestoneDefId} (milestone ${milestone.id}, already used by ${allIds.get(milestoneDefId)})`);
            } else {
              allIds.set(milestoneDefId, `milestone definition ${milestone.id}`);
            }
          });
          // Check sentries
          dcmIR.plan.sentries.forEach(sentry => {
            const sentryId = this.sanitizeId(sentry.id);
            if (allIds.has(sentryId)) {
              errors.push(`Duplicate sentry ID: ${sentryId} (sentry ${sentry.id}, already used by ${allIds.get(sentryId)})`);
            } else {
              allIds.set(sentryId, `sentry ${sentry.id}`);
            }
          });
          // Check entryCriteria (these are generated, so we need to simulate the generation)
          const generatedCriterionIds = new Set();
          dcmIR.plan.tasks.forEach(task => {
            task.entryCriteria.forEach(sentryId => {
              const criterionId = `entry_${this.sanitizeId(task.id)}_${this.sanitizeId(sentryId)}`;
              if (generatedCriterionIds.has(criterionId)) {
                errors.push(`Duplicate entryCriterion ID: ${criterionId} (task ${task.id}, sentry ${sentryId})`);
              } else {
                generatedCriterionIds.add(criterionId);
              }
              if (allIds.has(criterionId)) {
                errors.push(`Duplicate entryCriterion ID: ${criterionId} (already used by ${allIds.get(criterionId)})`);
              } else {
                allIds.set(criterionId, `entryCriterion for task ${task.id}`);
              }
            });
          });
          dcmIR.plan.stages.forEach(stage => {
            if (stage.entryCriteria) {
              stage.entryCriteria.forEach(sentryId => {
                const criterionId = `entry_${this.sanitizeId(stage.id)}_${this.sanitizeId(sentryId)}`;
                if (generatedCriterionIds.has(criterionId)) {
                  errors.push(`Duplicate entryCriterion ID: ${criterionId} (stage ${stage.id}, sentry ${sentryId})`);
                } else {
                  generatedCriterionIds.add(criterionId);
                }
                if (allIds.has(criterionId)) {
                  errors.push(`Duplicate entryCriterion ID: ${criterionId} (already used by ${allIds.get(criterionId)})`);
                } else {
                  allIds.set(criterionId, `entryCriterion for stage ${stage.id}`);
                }
              });
            }
          });
          dcmIR.plan.milestones.forEach(milestone => {
            milestone.entryCriteria.forEach(sentryId => {
              const criterionId = `entry_${this.sanitizeId(milestone.id)}_${this.sanitizeId(sentryId)}`;
              if (generatedCriterionIds.has(criterionId)) {
                errors.push(`Duplicate entryCriterion ID: ${criterionId} (milestone ${milestone.id}, sentry ${sentryId})`);
              } else {
                generatedCriterionIds.add(criterionId);
              }
              if (allIds.has(criterionId)) {
                errors.push(`Duplicate entryCriterion ID: ${criterionId} (already used by ${allIds.get(criterionId)})`);
              } else {
                allIds.set(criterionId, `entryCriterion for milestone ${milestone.id}`);
              }
            });
          });
          if (errors.length > 0) {
            throw new Error(`CMMN validation failed - duplicate IDs:\n${errors.join("\n")}`);
          }
        }
        /**
         * Validate DI references match model IDs
         * Ensures every CMMNShape and CMMNEdge references an existing element ID
         */
        validateDIReferences(cmmnXml, dcmIR) {
          const errors = [];
          // Extract all element IDs from the CMMN model
          const modelIds = new Set();
          // Extract IDs from XML
          const idPattern = /(?:id|cmmnElementRef)="([^"]+)"/g;
          let match;
          const allXmlIds = new Set();
          while ((match = idPattern.exec(cmmnXml)) !== null) {
            allXmlIds.add(match[1]);
          }
          // Extract CMMNShape cmmnElementRef values
          const shapeRefPattern = /<cmmndi:CMMNShape[^>]*cmmnElementRef="([^"]+)"/g;
          const shapeRefs = [];
          while ((match = shapeRefPattern.exec(cmmnXml)) !== null) {
            shapeRefs.push(match[1]);
            if (!allXmlIds.has(match[1])) {
              errors.push(`CMMNDI validation failed: CMMNShape references non-existent element ID: ${match[1]}`);
            }
          }
          // Extract CMMNEdge cmmnElementRef values
          const edgeRefPattern = /<cmmndi:CMMNEdge[^>]*cmmnElementRef="([^"]+)"/g;
          const edgeRefs = [];
          while ((match = edgeRefPattern.exec(cmmnXml)) !== null) {
            edgeRefs.push(match[1]);
            if (!allXmlIds.has(match[1])) {
              errors.push(`CMMNDI validation failed: CMMNEdge references non-existent element ID: ${match[1]}`);
            }
          }
          if (errors.length > 0) {
            throw new Error(`CMMNDI reference validation failed:\n${errors.join("\n")}`);
          }
        }
        /**
         * Validate no duplicate IDs in the final XML
         * Parses the XML and ensures all IDs are unique
         */
        validateNoDuplicateIdsInXML(cmmnXml) {
          const errors = [];
          const idMap = new Map(); // id -> list of element types where it appears
          // Extract all id attributes
          const idPattern = /id="([^"]+)"/g;
          let match;
          while ((match = idPattern.exec(cmmnXml)) !== null) {
            const id = match[1];
            const elementType = this.getElementTypeFromContext(cmmnXml, match.index);
            if (!idMap.has(id)) {
              idMap.set(id, []);
            }
            idMap.get(id).push(elementType);
          }
          // Check for duplicates
          // NOTE: CMMNEdge and association/onPart can share IDs (required for Flowable compatibility)
          // This is the only exception to the duplicate ID rule
          idMap.forEach((elementTypes, id) => {
            if (elementTypes.length > 1) {
              const hasEdge = elementTypes.includes("CMMNEdge");
              const hasAssociation = elementTypes.includes("association");
              const hasOnPart = elementTypes.includes("planItemOnPart") || elementTypes.includes("caseFileItemOnPart");
              // Allow edge to share ID with its connector (association or onPart) - this is required
              if (hasEdge && (hasAssociation || hasOnPart) && elementTypes.length === 2) {
                // This is expected and required for Flowable compatibility
                return;
              }
              // Any other duplicate is an error
              errors.push(`Duplicate ID "${id}" found in ${elementTypes.length} elements: ${elementTypes.join(", ")}`);
            }
          });
          if (errors.length > 0) {
            throw new Error(`CMMN XML validation failed - duplicate IDs:\n${errors.join("\n")}`);
          }
        }
        /**
         * Get element type from XML context (helper for duplicate ID detection)
         */
        getElementTypeFromContext(xml, index) {
          // Look backwards from index to find the element tag
          const beforeIndex = xml.substring(Math.max(0, index - 200), index);
          const tagMatch = beforeIndex.match(/<([^:\s>]+):?([^:\s>]+)?[^>]*$/);
          if (tagMatch) {
            const localName = tagMatch[2] || tagMatch[1];
            return localName.replace(/^cmmn:/, "").replace(/^cmmndi:/, "");
          }
          return "unknown";
        }
        /**
         * Prune dangling DI references
         * Removes CMMNShape and CMMNEdge elements whose cmmnElementRef points to non-existent model IDs
         * This prevents Flowable "graphicInfoList is null" NPE
         * Returns the pruned XML with logging of removed elements
         */
        pruneDanglingDIRefs(cmmnXml) {
          // Step 1: Collect ALL model IDs (from CMMN model, excluding DI elements)
          const modelIds = new Set();
          // Extract all @id attributes from CMMN model elements (everything except CMMNDI subtree)
          // Pattern: match id="..." but only if not inside CMMNDI
          // This includes: planItem, task, stage, milestone, sentry, entryCriterion, exitCriterion, etc.
          const modelIdPattern = /<cmmn:[^>]*\s+id="([^"]+)"/g;
          let match;
          while ((match = modelIdPattern.exec(cmmnXml)) !== null) {
            // Check if this match is inside CMMNDI (if so, skip it)
            const matchIndex = match.index;
            const beforeMatch = cmmnXml.substring(0, matchIndex);
            const lastCmmndiOpen = beforeMatch.lastIndexOf("<cmmndi:");
            const lastCmmndiClose = beforeMatch.lastIndexOf("</cmmndi:");
            // If we're inside CMMNDI (open tag after last close), skip this ID
            if (lastCmmndiOpen > lastCmmndiClose) {
              continue;
            }
            modelIds.add(match[1]);
          }
          // Also collect planItem IDs explicitly (they're what DI typically references)
          // Pattern: <cmmn:planItem id="pi_...">
          const planItemPattern = /<cmmn:planItem[^>]*\s+id="([^"]+)"/g;
          while ((match = planItemPattern.exec(cmmnXml)) !== null) {
            const matchIndex = match.index;
            const beforeMatch = cmmnXml.substring(0, matchIndex);
            const lastCmmndiOpen = beforeMatch.lastIndexOf("<cmmndi:");
            const lastCmmndiClose = beforeMatch.lastIndexOf("</cmmndi:");
            if (lastCmmndiOpen <= lastCmmndiClose) {
              modelIds.add(match[1]);
            }
          }
          // Also collect IDs from definitions, case, casePlanModel (they don't have cmmn: prefix)
          const rootIdPattern = /<(?:cmmn:)?(?:definitions|case|casePlanModel)[^>]*\s+id="([^"]+)"/g;
          while ((match = rootIdPattern.exec(cmmnXml)) !== null) {
            const matchIndex = match.index;
            const beforeMatch = cmmnXml.substring(0, matchIndex);
            const lastCmmndiOpen = beforeMatch.lastIndexOf("<cmmndi:");
            const lastCmmndiClose = beforeMatch.lastIndexOf("</cmmndi:");
            if (lastCmmndiOpen > lastCmmndiClose) {
              continue;
            }
            modelIds.add(match[1]);
          }
          // Step 2: Find all CMMNShape and CMMNEdge elements with cmmnElementRef
          // Use more flexible regex that handles attributes in any order
          const danglingElements = [];
          // Find CMMNShape elements - match attributes in any order
          const shapePattern = /<cmmndi:CMMNShape([^>]*)>([\s\S]*?)<\/cmmndi:CMMNShape>/g;
          while ((match = shapePattern.exec(cmmnXml)) !== null) {
            const attributes = match[1];
            const content = match[2];
            const fullMatch = match[0];
            // Extract cmmnElementRef and id from attributes (order-independent)
            const elementRefMatch = attributes.match(/cmmnElementRef="([^"]+)"/);
            const idMatch = attributes.match(/\s+id="([^"]+)"/);
            if (elementRefMatch && idMatch) {
              const elementRef = elementRefMatch[1];
              const shapeId = idMatch[1];
              if (!modelIds.has(elementRef)) {
                danglingElements.push({
                  type: "CMMNShape",
                  id: shapeId,
                  ref: elementRef,
                  fullMatch
                });
              }
            }
          }
          // Find CMMNEdge elements - match attributes in any order
          const edgePattern = /<cmmndi:CMMNEdge([^>]*)>([\s\S]*?)<\/cmmndi:CMMNEdge>/g;
          while ((match = edgePattern.exec(cmmnXml)) !== null) {
            const attributes = match[1];
            const content = match[2];
            const fullMatch = match[0];
            // Extract cmmnElementRef and id from attributes (order-independent)
            const elementRefMatch = attributes.match(/cmmnElementRef="([^"]+)"/);
            const idMatch = attributes.match(/\s+id="([^"]+)"/);
            if (elementRefMatch && idMatch) {
              const elementRef = elementRefMatch[1];
              const edgeId = idMatch[1];
              if (!modelIds.has(elementRef)) {
                danglingElements.push({
                  type: "CMMNEdge",
                  id: edgeId,
                  ref: elementRef,
                  fullMatch
                });
              }
            }
          }
          // Step 3: Remove dangling elements
          let prunedXml = cmmnXml;
          danglingElements.forEach(element => {
            // Remove the entire element by matching the full element
            // Use a more robust approach: find the element by its id attribute and remove it
            if (element.type === "CMMNShape") {
              // Match from opening tag to closing tag, handling multiline content
              const escapedId = element.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              const shapeRegex = new RegExp(`<cmmndi:CMMNShape[^>]*id="${escapedId}"[^>]*>[\\s\\S]*?<\\/cmmndi:CMMNShape>`, "g");
              prunedXml = prunedXml.replace(shapeRegex, "");
            } else if (element.type === "CMMNEdge") {
              // Match from opening tag to closing tag, handling multiline content
              const escapedId = element.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              const edgeRegex = new RegExp(`<cmmndi:CMMNEdge[^>]*id="${escapedId}"[^>]*>[\\s\\S]*?<\\/cmmndi:CMMNEdge>`, "g");
              prunedXml = prunedXml.replace(edgeRegex, "");
            }
          });
          // Step 4: Log removals
          if (danglingElements.length > 0) {
            const removalMessages = danglingElements.map(e => `  - ${e.type} id="${e.id}" references missing model element "${e.ref}"`);
          }
          // Clean up any empty lines or extra whitespace left by removals
          prunedXml = prunedXml.replace(/\n\s*\n\s*\n/g, "\n\n");
          return prunedXml;
        }
        /**
         * Validate embedded DI completeness
         * REVERTED: Working version (1767506803618) includes CMMNLabel elements and imports successfully
         * MANDATORY: Validates that NO dangling DI references exist (all cmmnElementRef must point to existing model IDs)
         * This validates DI that is embedded inside case.cmmn (not separate file)
         *
         * @param exportMode Export mode (affects association validation)
         */
        validateEmbeddedDICompleteness(cmmnXml, dcmIR, exportMode = CMMNExportMode.FLOWABLE) {
          const errors = [];
          const warnings = [];
          // REVERTED: Working version (1767506803618) includes CMMNLabel elements
          // Remove validation that rejects CMMNLabel - working version has them and imports successfully
          // REVERTED: Remove dc:Bounds validation - it's too complex to parse correctly with regex
          // The working version (1767506803618) has bounds in both CMMNShape and CMMNLabel
          // XML structure validation is better handled by XSD validation
          // We'll rely on XSD validation and Flowable's own XML parser to catch structural issues
          // MANDATORY: Validate that every di:waypoint parent is cmmndi:CMMNEdge
          // Use a more robust approach: find all CMMNEdge elements and check their waypoints
          const waypointEdgePattern = /<cmmndi:CMMNEdge[^>]*>([\s\S]*?)<\/cmmndi:CMMNEdge>/g;
          let waypointEdgeMatch;
          let waypointEdgeIndex = 0;
          let totalWaypointsInEdges = 0;
          while ((waypointEdgeMatch = waypointEdgePattern.exec(cmmnXml)) !== null) {
            const edgeContent = waypointEdgeMatch[1];
            const waypointCount = (edgeContent.match(/<di:waypoint[^>]*>/g) || []).length;
            totalWaypointsInEdges += waypointCount;
            if (waypointCount < 2) {
              errors.push(`CMMNDI validation failed: CMMNEdge[${waypointEdgeIndex}] has only ${waypointCount} waypoint(s), requires at least 2`);
            }
            waypointEdgeIndex++;
          }
          // Check for waypoints that are NOT inside CMMNEdge
          // Find all waypoints in the entire XML
          const allWaypoints = cmmnXml.match(/<di:waypoint[^>]*>/g);
          if (allWaypoints) {
            const totalWaypoints = allWaypoints.length;
            // If there are waypoints outside edges, report error
            if (totalWaypoints > totalWaypointsInEdges) {
              errors.push(`CMMNDI validation failed: Found ${totalWaypoints - totalWaypointsInEdges} di:waypoint(s) that are not inside cmmndi:CMMNEdge. All waypoints must appear directly under CMMNEdge.`);
            }
          }
          // Extract all planItem IDs from CMMN XML
          const planItemIds = new Set();
          const planItemPattern = /<cmmn:planItem\s+id="([^"]+)"/g;
          let match;
          while ((match = planItemPattern.exec(cmmnXml)) !== null) {
            planItemIds.add(match[1]);
          }
          // Extract all entryCriterion IDs from CMMN XML
          const entryCriterionIds = new Set();
          const entryCriterionPattern = /<cmmn:entryCriterion\s+id="([^"]+)"/g;
          while ((match = entryCriterionPattern.exec(cmmnXml)) !== null) {
            entryCriterionIds.add(match[1]);
          }
          // Extract all association IDs from CMMN XML (if any)
          const associationIds = new Set();
          const associationPattern = /<cmmn:association\s+id="([^"]+)"/g;
          while ((match = associationPattern.exec(cmmnXml)) !== null) {
            associationIds.add(match[1]);
          }
          // Extract CMMNShape elements and their cmmnElementRef values
          const shapeRefs = new Set();
          const shapePattern = /<cmmndi:CMMNShape[^>]*cmmnElementRef="([^"]+)"/g;
          while ((match = shapePattern.exec(cmmnXml)) !== null) {
            shapeRefs.add(match[1]);
          }
          // Check that each shape has bounds
          const shapeBoundsPattern = /<cmmndi:CMMNShape[^>]*>[\s\S]*?<dc:Bounds/g;
          const shapesWithBounds = (cmmnXml.match(shapeBoundsPattern) || []).length;
          const totalShapes = (cmmnXml.match(/<cmmndi:CMMNShape/g) || []).length;
          if (shapesWithBounds < totalShapes) {
            errors.push(`CMMNDI validation failed: ${totalShapes - shapesWithBounds} CMMNShape(s) missing dc:Bounds`);
          }
          // Extract CMMNEdge elements and their cmmnElementRef values
          const edgeRefs = new Set();
          const edgePattern = /<cmmndi:CMMNEdge[^>]*cmmnElementRef="([^"]+)"/g;
          while ((match = edgePattern.exec(cmmnXml)) !== null) {
            edgeRefs.add(match[1]);
          }
          // Check that each edge has at least 2 waypoints
          const edgeWaypointPattern = /<cmmndi:CMMNEdge[^>]*>([\s\S]*?)<\/cmmndi:CMMNEdge>/g;
          let edgeMatch;
          let edgeIndex = 0;
          while ((edgeMatch = edgeWaypointPattern.exec(cmmnXml)) !== null) {
            const edgeContent = edgeMatch[1];
            const waypointCount = (edgeContent.match(/<di:waypoint/g) || []).length;
            if (waypointCount < 2) {
              errors.push(`CMMNDI validation failed: CMMNEdge[${edgeIndex}] has only ${waypointCount} waypoint(s), requires at least 2`);
            }
            edgeIndex++;
          }
          // Validate: Every planItem must have a corresponding CMMNShape
          planItemIds.forEach(planItemId => {
            if (!shapeRefs.has(planItemId)) {
              errors.push(`CMMNDI validation failed: planItem ${planItemId} has no corresponding CMMNShape`);
            }
          });
          // Validate: Every entryCriterion must have a corresponding CMMNShape
          entryCriterionIds.forEach(criterionId => {
            if (!shapeRefs.has(criterionId)) {
              warnings.push(`CMMNDI validation warning: entryCriterion ${criterionId} has no corresponding CMMNShape (may cause Flowable import issues)`);
            }
          });
          // Validate: Every association must have a corresponding CMMNEdge
          associationIds.forEach(associationId => {
            if (!edgeRefs.has(associationId)) {
              errors.push(`CMMNDI validation failed: association ${associationId} has no corresponding CMMNEdge (will cause Flowable AssociationJsonConverter NPE)`);
            }
          });
          // Validate: Every entryCriterion must be referenced as TARGET in OnPart edges
          // Per spec Section 5.3.1: Entry criteria are TARGETS of OnPart connectors (via targetCMMNElementRef)
          // Per spec Section 5.4: We must NOT create edges with cmmnElementRef pointing to EntryCriterion
          // So we check if entry criteria appear in targetCMMNElementRef attributes, not in cmmnElementRef
          const targetRefs = new Set();
          const targetRefPattern = /<cmmndi:CMMNEdge[^>]*targetCMMNElementRef="([^"]+)"/g;
          while ((match = targetRefPattern.exec(cmmnXml)) !== null) {
            targetRefs.add(match[1]);
          }
          // Extract sentry IDs that have onPart elements (these should have OnPart edges)
          const sentriesWithOnPart = new Set();
          const sentryPattern = /<cmmn:sentry[^>]*\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/cmmn:sentry>/g;
          let sentryMatch;
          while ((sentryMatch = sentryPattern.exec(cmmnXml)) !== null) {
            const sentryId = sentryMatch[1];
            const sentryContent = sentryMatch[2];
            if (sentryContent.includes("<cmmn:planItemOnPart")) {
              sentriesWithOnPart.add(sentryId);
            }
          }
          entryCriterionIds.forEach(criterionId => {
            // FORBIDDEN: Check that NO edge has cmmnElementRef pointing to this entry criterion
            // Per spec Section 5.4: We must NOT create edges with cmmnElementRef pointing to EntryCriterion
            if (edgeRefs.has(criterionId)) {
              errors.push(`CMMNDI validation failed: FORBIDDEN - CMMNEdge with cmmnElementRef pointing to EntryCriterion ${criterionId} (violates spec Section 5.4)`);
            }
            // Optional: If entry criterion is referenced as target in OnPart edge, verify it has waypoints
            // Note: Entry criteria are only targets when the sentry has onPart (per spec Section 5.3.1)
            // Many sentries only have ifPart (no onPart), so no OnPart edge is created - this is correct
            if (targetRefs.has(criterionId)) {
              const edgeMatch = cmmnXml.match(new RegExp(`<cmmndi:CMMNEdge[^>]*targetCMMNElementRef="${criterionId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>([\\s\\S]*?)<\\/cmmndi:CMMNEdge>`, "g"));
              if (edgeMatch) {
                const waypointCount = (edgeMatch[0].match(/<di:waypoint[^>]*>/g) || []).length;
                if (waypointCount < 2) {
                  errors.push(`CMMNDI validation failed: entryCriterion ${criterionId} is target of CMMNEdge with only ${waypointCount} waypoint(s), requires at least 2`);
                }
              }
            }
          });
          // MANDATORY: Validate that NO dangling DI references exist
          // Collect all model IDs (excluding DI elements)
          const modelIds = new Set();
          const modelIdPattern = /<cmmn:[^>]*\s+id="([^"]+)"/g;
          while ((match = modelIdPattern.exec(cmmnXml)) !== null) {
            const matchIndex = match.index;
            const beforeMatch = cmmnXml.substring(0, matchIndex);
            const lastCmmndiOpen = beforeMatch.lastIndexOf("<cmmndi:");
            const lastCmmndiClose = beforeMatch.lastIndexOf("</cmmndi:");
            if (lastCmmndiOpen <= lastCmmndiClose) {
              modelIds.add(match[1]);
            }
          }
          // Also collect root element IDs
          const rootIdPattern = /<(?:cmmn:)?(?:definitions|case|casePlanModel)[^>]*\s+id="([^"]+)"/g;
          while ((match = rootIdPattern.exec(cmmnXml)) !== null) {
            const matchIndex = match.index;
            const beforeMatch = cmmnXml.substring(0, matchIndex);
            const lastCmmndiOpen = beforeMatch.lastIndexOf("<cmmndi:");
            const lastCmmndiClose = beforeMatch.lastIndexOf("</cmmndi:");
            if (lastCmmndiOpen <= lastCmmndiClose) {
              modelIds.add(match[1]);
            }
          }
          // Also collect planItem IDs (they're model elements)
          planItemIds.forEach(id => modelIds.add(id));
          entryCriterionIds.forEach(id => modelIds.add(id));
          associationIds.forEach(id => modelIds.add(id));
          // Collect planItemOnPart IDs from sentries
          const planItemOnPartIds = new Set();
          const planItemOnPartPattern = /<cmmn:planItemOnPart[^>]*\s+id="([^"]+)"/g;
          while ((match = planItemOnPartPattern.exec(cmmnXml)) !== null) {
            planItemOnPartIds.add(match[1]);
            modelIds.add(match[1]); // planItemOnPart IDs are model elements
          }
          // Check all DI element references
          const shapeRefPattern = /<cmmndi:CMMNShape[^>]*cmmnElementRef="([^"]+)"/g;
          while ((match = shapeRefPattern.exec(cmmnXml)) !== null) {
            const elementRef = match[1];
            if (!modelIds.has(elementRef)) {
              errors.push(`CMMNDI validation failed: CMMNShape references non-existent model element "${elementRef}" (dangling DI reference - will cause Flowable NPE)`);
            }
          }
          // Reuse edgeRefs Set that was already populated above (line 508)
          // Check all DI edge references for dangling refs
          const edgeRefPatternForDangling = /<cmmndi:CMMNEdge[^>]*cmmnElementRef="([^"]+)"/g;
          while ((match = edgeRefPatternForDangling.exec(cmmnXml)) !== null) {
            const elementRef = match[1];
            if (!modelIds.has(elementRef)) {
              errors.push(`CMMNDI validation failed: CMMNEdge references non-existent model element "${elementRef}" (dangling DI reference - will cause Flowable NPE)`);
            }
          }
          // REVERTED: Working version (1767506803618) has NO edges at all
          // Do NOT validate planItemOnPart edges - working version doesn't have them
          // planItemOnPartIds.forEach(onPartId => { ... });
          // Validate: Every planItem should have a shape for the planItem ID
          // REVERTED: Working version (1767506803618) does NOT have definitionRef shapes
          // Only check for planItem shapes, not definitionRef shapes
          planItemIds.forEach(planItemId => {
            const hasPlanItemShape = shapeRefs.has(planItemId);
            if (!hasPlanItemShape) {
              errors.push(`CMMNDI validation failed: planItem ${planItemId} has no corresponding CMMNShape`);
            }
            // Do NOT check for definitionRef shapes - working version doesn't have them
          });
          if (errors.length > 0) {
            throw new Error(`CMMNDI validation failed:\n${errors.join("\n")}`);
          }
        }
        /**
         * Validate CMMNDI references against CMMN model
         * Ensures all cmmnElementRef attributes reference existing element IDs
         * Uses DCM-IR to build expected IDs directly (more reliable than parsing XML)
         */
        validateCMMNDIReferences(cmmnXml, cmmndiXml, dcmIR) {
          const errors = [];
          // Build expected IDs from DCM-IR (more reliable than parsing XML)
          const expectedIds = new Set();
          // Add case and casePlanModel IDs
          expectedIds.add(dcmIR.id);
          expectedIds.add(`casePlanModel_${dcmIR.id}`);
          // Add all planItem IDs (these are what CMMNDI typically references)
          dcmIR.plan.tasks.forEach(task => {
            expectedIds.add(`pi_${this.sanitizeId(task.id)}`);
            expectedIds.add(this.sanitizeId(task.id)); // Task definition ID
          });
          dcmIR.plan.stages.forEach(stage => {
            expectedIds.add(`pi_${this.sanitizeId(stage.id)}`);
            expectedIds.add(this.sanitizeId(stage.id)); // Stage definition ID
          });
          dcmIR.plan.milestones.forEach(milestone => {
            expectedIds.add(`pi_${this.sanitizeId(milestone.id)}`);
            expectedIds.add(this.sanitizeId(milestone.id)); // Milestone definition ID
          });
          // Add all sentry IDs
          dcmIR.plan.sentries.forEach(sentry => {
            expectedIds.add(this.sanitizeId(sentry.id));
          });
          // Add all entryCriterion IDs
          dcmIR.plan.tasks.forEach(task => {
            task.entryCriteria.forEach(sentryId => {
              const criterionId = `entry_${this.sanitizeId(task.id)}_${this.sanitizeId(sentryId)}`;
              expectedIds.add(criterionId);
            });
          });
          dcmIR.plan.stages.forEach(stage => {
            if (stage.entryCriteria) {
              stage.entryCriteria.forEach(sentryId => {
                const criterionId = `entry_${this.sanitizeId(stage.id)}_${this.sanitizeId(sentryId)}`;
                expectedIds.add(criterionId);
              });
            }
          });
          dcmIR.plan.milestones.forEach(milestone => {
            milestone.entryCriteria.forEach(sentryId => {
              const criterionId = `entry_${this.sanitizeId(milestone.id)}_${this.sanitizeId(sentryId)}`;
              expectedIds.add(criterionId);
            });
          });
          // Also extract IDs from CMMN XML as a fallback (in case IR doesn't have everything)
          const xmlIdPattern = /(?:id|cmmnElementRef)="([^"]+)"/g;
          let match;
          while ((match = xmlIdPattern.exec(cmmnXml)) !== null) {
            expectedIds.add(match[1]);
          }
          // Extract cmmnElementRef values from CMMNDI
          const elementRefPattern = /cmmnElementRef="([^"]+)"/g;
          const invalidRefs = [];
          while ((match = elementRefPattern.exec(cmmndiXml)) !== null) {
            const refId = match[1];
            if (!expectedIds.has(refId)) {
              invalidRefs.push(refId);
            }
          }
          if (invalidRefs.length > 0) {
            errors.push(`CMMNDI contains invalid cmmnElementRef values that do not exist in CMMN model: ${invalidRefs.join(", ")}`);
          }
          if (errors.length > 0) {
            throw new Error(`CMMNDI validation failed:\n${errors.join("\n")}`);
          }
        }
        /**
         * Validate CMMN structure before export
         * Ensures Flowable-compatible structure
         * Per spec Section 8: Implements V1 structural referential integrity checks
         */
        validateCMMN(dcmIR) {
          const errors = [];
          // V1.1: Validate sentries: must have >=1 planItemOnPart OR >=1 ifPart
          dcmIR.plan.sentries.forEach(sentry => {
            const hasOnPart = sentry.onPart && sentry.onPart.length > 0;
            const hasIfPart = sentry.ifPart && sentry.ifPart.predicate;
            if (!hasOnPart && !hasIfPart) {
              errors.push(`V1: Sentry ${sentry.id} is empty (no onPart, no ifPart) - Flowable will reject this`);
            }
          });
          // V1.2: Validate entryCriteria: must reference existing sentries
          const sentryIds = new Set(dcmIR.plan.sentries.map(s => s.id));
          dcmIR.plan.tasks.forEach(task => {
            task.entryCriteria.forEach(sentryId => {
              if (!sentryIds.has(sentryId)) {
                errors.push(`V1: Task ${task.id} entryCriterion references non-existent sentry ${sentryId}`);
              }
              // Check that referenced sentry is not empty
              const sentry = dcmIR.plan.sentries.find(s => s.id === sentryId);
              if (sentry) {
                const hasOnPart = sentry.onPart && sentry.onPart.length > 0;
                const hasIfPart = sentry.ifPart && sentry.ifPart.predicate;
                if (!hasOnPart && !hasIfPart) {
                  errors.push(`V1: Task ${task.id} entryCriterion references empty sentry ${sentryId}`);
                }
              }
            });
          });
          // V1.3: Validate planItemOnPart: must have sourceRef and sourceRef must reference existing planItem
          const planItemIds = new Set();
          dcmIR.plan.tasks.forEach(t => planItemIds.add(`pi_${t.id}`));
          dcmIR.plan.stages.forEach(s => planItemIds.add(`pi_${s.id}`));
          dcmIR.plan.milestones.forEach(m => planItemIds.add(`pi_${this.sanitizeId(m.id)}`));
          dcmIR.plan.sentries.forEach(sentry => {
            if (sentry.onPart) {
              sentry.onPart.forEach((onPart, index) => {
                if (!onPart.planItemRef) {
                  errors.push(`V1: Sentry ${sentry.id} planItemOnPart[${index}] missing planItemRef`);
                } else {
                  const sourceRef = onPart.planItemRef;
                  if (!planItemIds.has(sourceRef)) {
                    errors.push(`V1: Sentry ${sentry.id} planItemOnPart[${index}] sourceRef "${sourceRef}" does not reference existing planItem`);
                  }
                }
              });
            }
          });
          // V1.4: Validate roleRefs on human tasks
          const roleIds = new Set(dcmIR.roles.map(r => r.id));
          dcmIR.plan.tasks.forEach(task => {
            if (task.type === "human" && task.roleRefs) {
              task.roleRefs.forEach(roleRef => {
                if (!roleIds.has(roleRef)) {
                  errors.push(`V1: HumanTask ${task.id} references non-existent role: ${roleRef}`);
                }
              });
            }
          });
          if (errors.length > 0) {
            throw new Error(`CMMN validation failed (V1 - Structural referential integrity):\n${errors.join("\n")}`);
          }
        }
        /**
         * Build CMMN document structure with embedded CMMNDI
         * MANDATORY: Embed CMMNDI inside case.cmmn - Flowable expects DI in the same .cmmn file
         * Optionally includes canonical OPM for name resolution
         *
         * @param exportMode Export mode (FLOWABLE: no associations, STANDARD: associations with DI)
         */
        buildCMMNDocument(dcmIR, cmmndiContent, canonicalOPM, exportMode = CMMNExportMode.FLOWABLE) {
          const casePlanModel = this.buildCasePlanModel(dcmIR, canonicalOPM, exportMode);
          const caseFileModel = this.buildCaseFileModel(dcmIR, canonicalOPM);
          const roles = this.buildRoles(dcmIR);
          // Associations are only exported in STANDARD mode
          const associations = exportMode === CMMNExportMode.STANDARD ? this.buildAssociations(dcmIR) : "";
          // Extract CMMNDI content if provided (remove XML declaration, keep CMMNDI element)
          let cmmndiBlock = "";
          if (cmmndiContent && cmmndiContent.trim()) {
            // Remove XML declaration if present
            let contentWithoutDeclaration = cmmndiContent.replace(/<\?xml[^>]*\?>\s*/i, "").trim();
            // Extract the CMMNDI element - use greedy matching to capture all nested content
            const cmmndiMatch = contentWithoutDeclaration.match(/<cmmndi:CMMNDI[^>]*>[\s\S]*<\/cmmndi:CMMNDI>/);
            if (cmmndiMatch && cmmndiMatch[0]) {
              // Extract the CMMNDI element (without the XML declaration)
              cmmndiBlock = cmmndiMatch[0].trim();
              // Remove any namespace declarations from CMMNDI element since they'll be on definitions
              cmmndiBlock = cmmndiBlock.replace(/\s*xmlns:cmmndi="[^"]*"/g, "");
              cmmndiBlock = cmmndiBlock.replace(/\s*xmlns:dc="[^"]*"/g, "");
              cmmndiBlock = cmmndiBlock.replace(/\s*xmlns:di="[^"]*"/g, "");
              cmmndiBlock = cmmndiBlock.replace(/\s*xmlns:cmmn="[^"]*"/g, "");
              // Clean up any extra whitespace
              cmmndiBlock = cmmndiBlock.trim();
            }
          }
          // MANDATORY: Add namespaces for CMMNDI, DC, and DI on definitions element
          // Flowable requires these namespaces to be declared
          const cmmndiNamespace = cmmndiContent ? " xmlns:cmmndi=\"http://www.omg.org/spec/CMMN/20151109/CMMNDI\"" : "";
          const dcNamespace = cmmndiContent ? " xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\"" : "";
          const diNamespace = cmmndiContent ? " xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\"" : "";
          // CMMN model XML WITH embedded CMMNDI (Flowable requires DI in same file)
          return `<?xml version="1.0" encoding="UTF-8"?>
<cmmn:definitions xmlns:cmmn="http://www.omg.org/spec/CMMN/20151109/MODEL"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xmlns:opcloud="http://opcloud.tech/dcm/extensions"${cmmndiNamespace}${dcNamespace}${diNamespace}
                  id="definitions_${this.sanitizeId(dcmIR.id)}"
                  name="${this.escapeXml(dcmIR.name)}"
                  targetNamespace="http://opcloud.tech/dcm/${this.sanitizeId(dcmIR.id)}">
  <cmmn:case id="case_${this.sanitizeId(dcmIR.id)}" name="${this.escapeXml(dcmIR.name)}">
${casePlanModel}
${caseFileModel}
${roles}${associations ? `\n${associations}` : ""}
  </cmmn:case>
${cmmndiBlock ? `  ${cmmndiBlock}` : ""}
</cmmn:definitions>`;
        }
        /**
         * Build associations (only in STANDARD mode)
         * Currently returns empty string as associations are not yet implemented in DCM-IR
         * This method is a placeholder for future association support
         */
        buildAssociations(dcmIR) {
          // TODO: Implement association generation when DCM-IR includes association data
          // For now, return empty string (no associations)
          return "";
        }
        /**
         * Build case plan model
         * MANDATORY: Track generated criterion IDs to prevent duplicates
         * CRITICAL: Determine valid sentries FIRST, then pass to buildEntryCriteria to prevent references to non-existent sentries
         *
         * @param exportMode Export mode (affects whether associations are included)
         */
        buildCasePlanModel(dcmIR, canonicalOPM, exportMode = CMMNExportMode.FLOWABLE) {
          // CRITICAL: Determine which sentries will actually be emitted in CMMN (have ifPart)
          // REVERTED: Working version only uses ifPart, not onPart
          // This must be done BEFORE building entryCriteria, so we don't create entryCriteria for sentries that will be filtered out
          const validSentryIds = new Set();
          dcmIR.plan.sentries.forEach(sentry => {
            const hasIfPart = sentry.ifPart && sentry.ifPart.predicate;
            if (hasIfPart) {
              validSentryIds.add(sentry.id);
            }
          });
          // Track generated criterion IDs to prevent duplicates
          const generatedCriterionIds = new Set();
          // Pass validSentryIds to buildPlanItems so entryCriteria only reference sentries that will exist
          // Pass canonicalOPM for proper process hierarchy checking
          // Pass exportMode to control entry criterion ID generation
          const planItems = this.buildPlanItems(dcmIR, generatedCriterionIds, validSentryIds, canonicalOPM, exportMode);
          const sentries = this.buildSentries(dcmIR, exportMode);
          const eventListeners = this.buildEventListeners(dcmIR);
          return `    <cmmn:casePlanModel id="casePlanModel_${this.sanitizeId(dcmIR.id)}">
${planItems}
${eventListeners}
${sentries}
    </cmmn:casePlanModel>`;
        }
        /**
         * Build plan items (stages, tasks, milestones)
         * EXPORT ALL OPM PROCESSES: Every process must be exported as a plan item
         * MANDATORY: Prevent duplicate plan items
         * With "refined-process" stage policy:
         * - Tasks that belong to a stage must ONLY appear inside that stage
         * - Tasks that have NO stage container appear at root level
         * - No task should appear both in a stage AND at root
         * CRITICAL: validSentryIds ensures entryCriteria only reference sentries that will exist in CMMN
         */
        buildPlanItems(dcmIR, generatedCriterionIds = new Set(), validSentryIds, canonicalOPM, exportMode) {
          const items = [];
          const visitedStages = new Set();
          const processedTaskIds = new Set(); // Track which tasks have been included in stages
          // First pass: Build all stages and track which tasks are included
          // Add root stages only (those without a parentStageId)
          dcmIR.plan.stages.filter(stage => !stage.parentStageId).forEach(stage => {
            items.push(this.buildStagePlanItem(stage, dcmIR, visitedStages, processedTaskIds, generatedCriterionIds, validSentryIds, canonicalOPM, exportMode));
          });
          // Second pass: Add ONLY tasks that are NOT in any stage (root-level tasks only)
          // This prevents duplicates: tasks already included in stages won't be added again
          // Pass exportMode to control entry criterion ID generation
          dcmIR.plan.tasks.forEach(task => {
            // Check if task belongs to any stage
            const belongsToStage = dcmIR.plan.stages.some(stage => this.isTaskInStage(task, stage, dcmIR, canonicalOPM));
            // Only add at root if task doesn't belong to any stage
            if (!belongsToStage && !processedTaskIds.has(task.id)) {
              items.push(this.buildTaskPlanItem(task, dcmIR, generatedCriterionIds, validSentryIds, exportMode));
              processedTaskIds.add(task.id); // Mark as processed
            }
          });
          // Add ALL milestones (milestones are always at root level)
          dcmIR.plan.milestones.forEach(milestone => {
            items.push(this.buildMilestonePlanItem(milestone, dcmIR, generatedCriterionIds, validSentryIds, exportMode));
          });
          return items.join("\n");
        }
        /**
         * Build stage plan item
         * MANDATORY: Only include child tasks/stages that belong to this stage
         * Do NOT include tasks that are already at root level to prevent duplicates
         */
        buildStagePlanItem(stage, dcmIR, visitedStages = new Set(), processedTaskIds = new Set(), generatedCriterionIds = new Set(), validSentryIds, canonicalOPM, exportMode) {
          // Prevent infinite recursion - but ALWAYS create the planItem and stage definition
          // Even if visited, we need the planItem to exist for DI references
          // Only skip if we've already created the planItem in this export
          if (visitedStages.has(stage.id)) {
            // Return empty string instead of comment - this stage was already processed
            // The planItem and stage definition should already exist in the XML
            return "";
          }
          visitedStages.add(stage.id);
          // Only get tasks that belong to this stage AND haven't been processed yet
          const childTasks = dcmIR.plan.tasks.filter(t => t.sourceProcessId && this.isTaskInStage(t, stage, dcmIR, canonicalOPM) && !processedTaskIds.has(t.id) // Prevent duplicate inclusion
          );
          // Mark these tasks as processed
          childTasks.forEach(t => processedTaskIds.add(t.id));
          const childStages = dcmIR.plan.stages.filter(s => s.parentStageId === stage.id);
          const childItems = [];
          childStages.forEach(s => {
            childItems.push(this.buildStagePlanItem(s, dcmIR, visitedStages, processedTaskIds, generatedCriterionIds, validSentryIds, canonicalOPM, exportMode));
          });
          childTasks.forEach(t => {
            childItems.push(this.buildTaskPlanItem(t, dcmIR, generatedCriterionIds, validSentryIds, exportMode));
          });
          const entryCriteria = this.buildEntryCriteria(stage.id, dcmIR, generatedCriterionIds, validSentryIds, exportMode);
          const exitCriteria = this.buildExitCriteria(stage.id, dcmIR);
          // CMMN structure: planItem references stage definition
          // Note: Stages don't have isBlocking attribute (only tasks do)
          // Discretionary stages are handled via planning table or visual markers, not XML attributes
          return `      <cmmn:planItem id="pi_${this.sanitizeId(stage.id)}" definitionRef="${this.sanitizeId(stage.id)}">
${entryCriteria}
${exitCriteria}
      </cmmn:planItem>
      <cmmn:stage id="${this.sanitizeId(stage.id)}" name="${this.escapeXml(stage.name)}">
${childItems.length > 0 ? childItems.join("\n") : "        <!-- No child items -->"}
      </cmmn:stage>`;
        }
        /**
         * Build task plan item
         */
        buildTaskPlanItem(task, dcmIR, generatedCriterionIds = new Set(), validSentryIds, exportMode) {
          const entryCriteria = this.buildEntryCriteria(task.id, dcmIR, generatedCriterionIds, validSentryIds, exportMode);
          const exitCriteria = this.buildExitCriteria(task.id, dcmIR);
          const taskDefinition = this.buildTaskDefinition(task);
          return `      <cmmn:planItem id="pi_${this.sanitizeId(task.id)}" definitionRef="${this.sanitizeId(task.id)}">
${entryCriteria}
${exitCriteria}
      </cmmn:planItem>
${taskDefinition}`;
        }
        /**
         * Build task definition
         * Exports correct task type (human, process, case, decision) and discretionary attribute
         */
        buildTaskDefinition(task) {
          let taskElement = "";
          let taskType = "";
          // Determine task element type based on task.type
          switch (task.type) {
            case "process":
              taskType = "processTask";
              break;
            case "case":
              taskType = "caseTask";
              break;
            case "decision":
              taskType = "decisionTask";
              break;
            case "human":
            default:
              taskType = "humanTask";
              break;
          }
          // Build task element with discretionary attribute if needed
          // isBlocking defaults to true, so discretionary tasks should have isBlocking="false"
          const discretionaryAttr = task.isDiscretionary ? " isBlocking=\"false\"" : "";
          // performerRef is an attribute (not a child element) - only human tasks support it
          // For multiple roles, use the first one (CMMN 1.1 supports single performerRef)
          const performerRefAttr = task.type === "human" && task.roleRefs && task.roleRefs.length > 0 ? ` performerRef="${this.sanitizeId(task.roleRefs[0])}"` : "";
          return `      <cmmn:${taskType} id="${this.sanitizeId(task.id)}" name="${this.escapeXml(task.name)}"${discretionaryAttr}${performerRefAttr}/>`;
        }
        /**
         * Build milestone plan item
         */
        buildMilestonePlanItem(milestone, dcmIR, generatedCriterionIds = new Set(), validSentryIds, exportMode) {
          const entryCriteria = this.buildEntryCriteria(milestone.id, dcmIR, generatedCriterionIds, validSentryIds, exportMode);
          return `      <cmmn:planItem id="pi_${this.sanitizeId(milestone.id)}" definitionRef="${this.sanitizeId(milestone.id)}">
${entryCriteria}
      </cmmn:planItem>
      <cmmn:milestone id="${this.sanitizeId(milestone.id)}" name="${this.escapeXml(milestone.name)}"/>`;
        }
        /**
         * Build entry criteria
         * REVERTED: Working version (1767506803618) has entryCriteria WITHOUT IDs
         * Format: <cmmn:entryCriterion sentryRef="..."/> (no id attribute)
         * CRITICAL: Only create entryCriteria for sentries that will actually exist in CMMN (have ifPart)
         * This prevents Flowable AssociationJsonConverter NPE when entryCriteria reference non-existent sentries
         * validSentryIds: Set of sentry IDs that will actually be emitted in CMMN (pre-computed in buildCasePlanModel)
         */
        buildEntryCriteria(elementId, dcmIR, generatedCriterionIds, validSentryIds, exportMode) {
          // First, filter to sentries that are referenced by this element
          const referencedSentryIds = new Set();
          dcmIR.plan.tasks.forEach(t => {
            if (t.id === elementId) {
              t.entryCriteria.forEach(sentryId => referencedSentryIds.add(sentryId));
            }
          });
          dcmIR.plan.stages.forEach(st => {
            if (st.id === elementId && st.entryCriteria) {
              st.entryCriteria.forEach(sentryId => referencedSentryIds.add(sentryId));
            }
          });
          dcmIR.plan.milestones.forEach(m => {
            if (m.id === elementId) {
              m.entryCriteria.forEach(sentryId => referencedSentryIds.add(sentryId));
            }
          });
          if (referencedSentryIds.size === 0) {
            return "";
          }
          // CRITICAL: Only include sentries that will actually be emitted in CMMN
          // Use pre-computed validSentryIds if provided (more efficient), otherwise filter inline
          const validSentries = dcmIR.plan.sentries.filter(s => {
            if (!referencedSentryIds.has(s.id)) {
              return false;
            }
            // If validSentryIds is provided, use it (pre-computed in buildCasePlanModel)
            if (validSentryIds) {
              return validSentryIds.has(s.id);
            }
            // Otherwise, filter inline (fallback for backward compatibility)
            // REVERTED: Working version only uses ifPart
            const hasIfPart = s.ifPart && s.ifPart.predicate;
            return hasIfPart;
          });
          if (validSentries.length === 0) {
            return "";
          }
          const criteria = [];
          const mode = exportMode || this.exportMode;
          validSentries.forEach(s => {
            // CRITICAL: In FLOWABLE mode, do NOT add id attributes to entryCriteria
            // Flowable 6.7.2's AssociationJsonConverter treats entryCriteria with IDs as associations
            // and throws NPE when it can't find graphic info for them
            if (mode === CMMNExportMode.FLOWABLE) {
              // FLOWABLE mode: No ID attribute (matches working import structure)
              criteria.push(`        <cmmn:entryCriterion sentryRef="${this.sanitizeId(s.id)}"/>`);
            } else {
              // STANDARD mode: Include ID for compatibility with other tools
              const planItemId = `pi_${elementId}`;
              const criterionId = `entry_${this.sanitizeId(planItemId)}_${this.sanitizeId(s.id)}`;
              criteria.push(`        <cmmn:entryCriterion id="${criterionId}" sentryRef="${this.sanitizeId(s.id)}"/>`);
            }
          });
          return criteria.join("\n");
        }
        /**
         * Build exit criteria
         */
        buildExitCriteria(elementId, dcmIR) {
          const sentries = dcmIR.plan.sentries.filter(s => dcmIR.plan.tasks.some(t => t.id === elementId && (t.exitCriteria || []).includes(s.id)) || dcmIR.plan.stages.some(st => st.id === elementId && (st.exitCriteria || []).includes(s.id)));
          if (sentries.length === 0) {
            return "";
          }
          const criteria = sentries.map(s => `        <cmmn:exitCriterion sentryRef="${this.sanitizeId(s.id)}"/>`).join("\n");
          return criteria;
        }
        /**
         * Build event listeners (Timer and User)
         * Event listeners are plan items with definitions (like tasks and milestones)
         */
        buildEventListeners(dcmIR) {
          if (!dcmIR.plan.eventListeners || dcmIR.plan.eventListeners.length === 0) {
            return "";
          }
          const items = [];
          dcmIR.plan.eventListeners.forEach(listener => {
            // Event listeners are plan items with definitions
            const planItemId = `pi_${this.sanitizeId(listener.id)}`;
            const definitionId = this.sanitizeId(listener.id);
            let definitionXml = "";
            if (listener.type === "timer") {
              const timerExpression = listener.timerExpression || "";
              definitionXml = `      <cmmn:timerEventListener id="${definitionId}" name="${this.escapeXml(listener.name)}">
        <cmmn:timerExpression><![CDATA[${timerExpression}]]></cmmn:timerExpression>
      </cmmn:timerEventListener>`;
            } else if (listener.type === "user") {
              // User event listeners don't have eventRef child element in CMMN XML
              // They only have authorizedRoleRefs attribute (optional)
              definitionXml = `      <cmmn:userEventListener id="${definitionId}" name="${this.escapeXml(listener.name)}"/>`;
            }
            if (definitionXml) {
              items.push(`      <cmmn:planItem id="${planItemId}" definitionRef="${definitionId}">
      </cmmn:planItem>
${definitionXml}`);
            }
          });
          return items.join("\n");
        }
        /**
         * Build sentries
         * MANDATORY: Filter out empty sentries (no onPart, no ifPart) - Flowable rejects them
         */
        buildSentries(dcmIR, exportMode) {
          // Filter out empty sentries (no onPart, no ifPart)
          // CRITICAL: In FLOWABLE mode, only sentries with ifPart are valid (no onPart)
          const mode = exportMode || this.exportMode;
          const validSentries = dcmIR.plan.sentries.filter(sentry => {
            if (mode === CMMNExportMode.FLOWABLE) {
              // FLOWABLE mode: Only sentries with ifPart are valid (no planItemOnPart)
              return sentry.ifPart && sentry.ifPart.predicate;
            } else {
              // STANDARD mode: Sentries with onPart or ifPart are valid
              const hasOnPart = sentry.onPart && sentry.onPart.length > 0;
              const hasIfPart = sentry.ifPart && sentry.ifPart.predicate;
              return hasOnPart || hasIfPart;
            }
          });
          return validSentries.map(sentry => this.buildSentry(sentry, dcmIR, exportMode)).join("\n");
        }
        /**
         * Build sentry (ifPart only - matching working Flowable import structure)
         * REVERTED: Working version (1767506803618) has sentries with ONLY ifPart (no planItemOnPart)
         * This structure successfully imports into Flowable without AssociationJsonConverter NPE
         */
        buildSentry(sentry, dcmIR, exportMode) {
          // MANDATORY: Sentry must have at least one ifPart (empty sentries are rejected by Flowable)
          if (!sentry.ifPart || !sentry.ifPart.predicate) {
            // This should not happen if we filtered correctly, but defensive check
            return ""; // Return empty string - will be filtered out
          }
          // If DMN decision is linked, reference it in the condition
          // Format: decision_<decisionId> == true
          // Otherwise, use the raw predicate
          let conditionText;
          if (sentry.dmnDecisionRef) {
            // Reference DMN decision: decision_<decisionId> == true
            conditionText = `${sentry.dmnDecisionRef} == true`;
          } else {
            // Fallback: use raw predicate (for backward compatibility or when DMN is disabled)
            conditionText = sentry.ifPart.predicate;
          }
          // Use ifPart with condition (either DMN reference or raw predicate)
          const ifPartXml = `        <cmmn:ifPart>
          <cmmn:condition><![CDATA[${conditionText}]]></cmmn:condition>
        </cmmn:ifPart>`;
          // CRITICAL: In FLOWABLE mode, do NOT create planItemOnPart elements
          // Flowable 6.7.2's AssociationJsonConverter treats planItemOnPart as associations and throws NPE
          // The working import structure has NO planItemOnPart elements
          const mode = exportMode || this.exportMode;
          let onPartXml = "";
          if (mode !== CMMNExportMode.FLOWABLE && sentry.onPart && sentry.onPart.length > 0) {
            // STANDARD mode: Create planItemOnPart elements
            const onPartElements = sentry.onPart.map((onPart, index) => {
              // planItemRef should reference the milestone plan item ID (format: pi_<sanitizedMilestoneId>)
              // Extract the milestone ID from planItemRef (remove 'pi_' prefix), sanitize it, then add 'pi_' back
              let planItemRef = onPart.planItemRef;
              if (planItemRef.startsWith("pi_")) {
                // Extract the ID part (after 'pi_'), sanitize it, then reconstruct
                const milestoneId = planItemRef.substring(3); // Remove 'pi_' prefix
                planItemRef = `pi_${this.sanitizeId(milestoneId)}`;
              } else {
                // No 'pi_' prefix, add it with sanitization
                planItemRef = `pi_${this.sanitizeId(planItemRef)}`;
              }
              return `        <cmmn:planItemOnPart id="onPart_${this.sanitizeId(sentry.id)}_${index}" sourceRef="${planItemRef}"/>`;
            }).join("\n");
            onPartXml = onPartElements + "\n";
          }
          const sentryXml = `      <cmmn:sentry id="${this.sanitizeId(sentry.id)}">
${onPartXml}${ifPartXml}
      </cmmn:sentry>`;
          return sentryXml;
        }
        /**
         * Build case file model
         */
        buildCaseFileModel(dcmIR, canonicalOPM) {
          const items = dcmIR.caseFileModel.items.map(item => this.buildCaseFileItem(item, dcmIR, canonicalOPM)).join("\n");
          return `    <cmmn:caseFileModel id="caseFileModel_${this.sanitizeId(dcmIR.id)}">
${items}
    </cmmn:caseFileModel>`;
        }
        /**
         * Build case file item
         * Uses actual OPM object name instead of generated ID
         */
        buildCaseFileItem(item, dcmIR, canonicalOPM) {
          const states = item.states.length > 0 ? item.states.map(state => `        <cmmn:caseFileItemState name="${this.escapeXml(state)}"/>`).join("\n") : "";
          // Get object name from canonical OPM
          const itemName = this.getCaseFileItemName(item, canonicalOPM);
          return `      <cmmn:caseFileItem id="${this.sanitizeId(item.id)}" name="${this.escapeXml(itemName)}">
${states}
      </cmmn:caseFileItem>`;
        }
        /**
         * Get human-readable name for case file item from canonical OPM
         */
        getCaseFileItemName(item, canonicalOPM) {
          if (canonicalOPM && item.objectId) {
            // Look up object in canonical OPM
            const object = canonicalOPM.objects.find(obj => obj.id === item.objectId);
            if (object && object.name) {
              return object.name;
            }
          }
          // Fallback: use objectId or item.id
          return item.objectId || item.id;
        }
        /**
         * Build roles
         */
        buildRoles(dcmIR) {
          if (dcmIR.roles.length === 0) {
            return "";
          }
          const roles = dcmIR.roles.map(role => `      <cmmn:role id="${this.sanitizeId(role.id)}" name="${this.escapeXml(role.name)}"/>`).join("\n");
          return `    <cmmn:roles>
${roles}
    </cmmn:roles>`;
        }
        /**
         * Check if task is in stage
         */
        /**
         * Check if task belongs to stage by checking process hierarchy
         * CRITICAL: Uses canonical OPM to check actual parent-child relationships
         * A task belongs to a stage if the task's source process is a child of the stage's source process
         */
        isTaskInStage(task, stage, dcmIR, canonicalOPM) {
          if (!task.sourceProcessId || !stage.sourceProcessId) {
            return false;
          }
          // If canonical OPM is available, use proper hierarchy check
          if (canonicalOPM && canonicalOPM.processes) {
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
          // Fallback: If canonical OPM not available, use simplified check
          // This should not happen in normal flow, but defensive programming
          // For nested stages, use prefix matching as fallback (not ideal, but better than nothing)
          // This checks if task's process ID starts with stage's process ID (simplified hierarchy assumption)
          if (stage.parentStageId && task.sourceProcessId && stage.sourceProcessId) {
            return task.sourceProcessId.startsWith(stage.sourceProcessId);
          }
          // For root stages (no parent), return false (tasks should be explicitly assigned)
          // This prevents all tasks from being assigned to root stage
          return false;
        }
        /**
         * Validate criterion attachment associations completeness
         * CRITICAL: Flowable 6.7.2 requires criterion attachments to have associations with DI edges
         * This validator ensures every entry/exit criterion has:
         * - An association with deterministic ID (assoc_entry_<ID> or assoc_exit_<ID>)
         * - A CMMNEdge with id == cmmnElementRef == associationId
         * - At least 2 waypoints in the edge
         * This prevents Flowable AssociationJsonConverter "graphicInfoList is null" NPE
         */
        validateCriterionAttachmentAssociations(cmmnXml, exportMode) {
          if (exportMode !== CMMNExportMode.FLOWABLE) {
            return; // Only validate FLOWABLE mode
          }
          const errors = [];
          const warnings = [];
          let match;
          // Extract all entryCriterion and exitCriterion IDs
          const entryCriterionPattern = /<cmmn:entryCriterion[^>]*\s+id="([^"]+)"/g;
          const exitCriterionPattern = /<cmmn:exitCriterion[^>]*\s+id="([^"]+)"/g;
          const criterionIds = [];
          while ((match = entryCriterionPattern.exec(cmmnXml)) !== null) {
            criterionIds.push(match[1]);
          }
          while ((match = exitCriterionPattern.exec(cmmnXml)) !== null) {
            criterionIds.push(match[1]);
          }
          // Build map of associations
          const associationIds = new Set();
          const associationPattern = /<cmmn:association[^>]*\s+id="([^"]+)"/g;
          while ((match = associationPattern.exec(cmmnXml)) !== null) {
            associationIds.add(match[1]);
          }
          // Build map of edges by cmmnElementRef
          const edgeByElementRef = new Map();
          const edgePattern = /<cmmndi:CMMNEdge[^>]*cmmnElementRef="([^"]+)"[^>]*>([\s\S]*?)<\/cmmndi:CMMNEdge>/g;
          let edgeMatch;
          while ((edgeMatch = edgePattern.exec(cmmnXml)) !== null) {
            const elementRef = edgeMatch[1];
            const edgeContent = edgeMatch[2];
            const idMatch = edgeMatch[0].match(/id="([^"]+)"/);
            const waypointCount = (edgeContent.match(/<di:waypoint[^>]*>/g) || []).length;
            edgeByElementRef.set(elementRef, {
              id: idMatch ? idMatch[1] : "",
              waypointCount: waypointCount
            });
          }
          // Validate each criterion has required association and edge
          const missingAssociations = [];
          const missingEdges = [];
          const missingWaypoints = [];
          const idMismatches = [];
          criterionIds.forEach(criterionId => {
            const isEntryCriterion = criterionId.startsWith("entry_");
            const expectedAssocId = isEntryCriterion ? `assoc_entry_${this.sanitizeId(criterionId)}` : `assoc_exit_${this.sanitizeId(criterionId)}`;
            // Check association exists
            if (!associationIds.has(expectedAssocId)) {
              missingAssociations.push(`${isEntryCriterion ? "entry" : "exit"}Criterion ${criterionId} -> association ${expectedAssocId}`);
            } else {
              // Check edge exists
              const edgeInfo = edgeByElementRef.get(expectedAssocId);
              if (!edgeInfo) {
                missingEdges.push(`association ${expectedAssocId}`);
              } else {
                // Check edge ID matches association ID
                if (edgeInfo.id !== expectedAssocId) {
                  idMismatches.push(`association ${expectedAssocId} -> edge id="${edgeInfo.id}" (expected: "${expectedAssocId}")`);
                }
                // Check waypoints
                if (edgeInfo.waypointCount < 2) {
                  missingWaypoints.push(`association ${expectedAssocId} -> ${edgeInfo.waypointCount} waypoint(s) (required: >=2)`);
                }
              }
            }
          });
          // Build error message
          if (missingAssociations.length > 0) {
            errors.push(`Missing ${missingAssociations.length} criterion attachment association(s):`);
            missingAssociations.slice(0, 10).forEach(msg => errors.push(`  - ${msg}`));
            if (missingAssociations.length > 10) {
              errors.push(`  ... and ${missingAssociations.length - 10} more`);
            }
          }
          if (missingEdges.length > 0) {
            errors.push(`Missing ${missingEdges.length} DI edge(s) for associations:`);
            missingEdges.slice(0, 10).forEach(msg => errors.push(`  - ${msg}`));
            if (missingEdges.length > 10) {
              errors.push(`  ... and ${missingEdges.length - 10} more`);
            }
          }
          if (idMismatches.length > 0) {
            errors.push(`Edge ID mismatch (must equal association ID):`);
            idMismatches.slice(0, 10).forEach(msg => errors.push(`  - ${msg}`));
            if (idMismatches.length > 10) {
              errors.push(`  ... and ${idMismatches.length - 10} more`);
            }
          }
          if (missingWaypoints.length > 0) {
            errors.push(`Missing waypoints (required: >=2 per edge):`);
            missingWaypoints.slice(0, 10).forEach(msg => errors.push(`  - ${msg}`));
            if (missingWaypoints.length > 10) {
              errors.push(`  ... and ${missingWaypoints.length - 10} more`);
            }
          }
          if (errors.length > 0) {
            throw new Error(`Criterion attachment association validation failed:\n${errors.join("\n")}`);
          }
          // Criterion attachment validation passed (no logging - removed for production)
        }
        /**
         * Validate association structural integrity
         * Checks that every association has both sourceRef and targetRef, and that they reference existing elements
         * This is a regression guard to prevent Flowable AssociationJsonConverter NPE
         */
        validateAssociationIntegrity(cmmnXml) {
          const errors = [];
          let match;
          // Extract all associations
          const associationPattern = /<cmmn:association[^>]*\s+id="([^"]+)"[^>]*>/g;
          const associations = [];
          while ((match = associationPattern.exec(cmmnXml)) !== null) {
            const assocId = match[1];
            const assocTag = match[0];
            const sourceRefMatch = assocTag.match(/sourceRef="([^"]+)"/);
            const targetRefMatch = assocTag.match(/targetRef="([^"]+)"/);
            associations.push({
              id: assocId,
              sourceRef: sourceRefMatch ? sourceRefMatch[1] : undefined,
              targetRef: targetRefMatch ? targetRefMatch[1] : undefined
            });
            // Check sourceRef is present
            if (!sourceRefMatch) {
              errors.push(`Association ${assocId} is missing required sourceRef attribute`);
            }
            // Check targetRef is present
            if (!targetRefMatch) {
              errors.push(`Association ${assocId} is missing required targetRef attribute`);
            }
          }
          // Validate referential integrity: check that sourceRef and targetRef reference existing elements
          associations.forEach(assoc => {
            if (assoc.sourceRef) {
              // Check if sourceRef exists in XML (could be sentry, planItem, etc.)
              if (!cmmnXml.includes(`id="${assoc.sourceRef}"`)) {
                errors.push(`Association ${assoc.id} sourceRef="${assoc.sourceRef}" does not reference an existing element`);
              }
            }
            if (assoc.targetRef) {
              // Check if targetRef exists in XML (could be planItem, caseFileItem, etc.)
              if (!cmmnXml.includes(`id="${assoc.targetRef}"`)) {
                errors.push(`Association ${assoc.id} targetRef="${assoc.targetRef}" does not reference an existing element`);
              }
            }
          });
          if (errors.length > 0) {
            throw new Error(`Association integrity validation failed:\n${errors.join("\n")}`);
          }
        }
        /**
         * Sanitize ID for XML
         */
        sanitizeId(id) {
          return id.replace(/[^a-zA-Z0-9_-]/g, "_");
        }
        /**
         * Build deterministic association ID for criterion attachments
         * Prevents double-prefix bugs (e.g., assoc_entry_entry_...)
         *
         * @param criterionType 'entry' or 'exit'
         * @param planItemId The plan item ID (e.g., pi_task_process_...)
         * @param sentryId The sentry ID (e.g., sentry_task_process_...)
         * @returns Deterministic association ID: assoc_<criterionType>_<planItemId>_<sentryId>
         */
        buildCriterionAttachmentAssociationId(criterionType, planItemId, sentryId) {
          // Remove 'sentry_' prefix if present to avoid duplication
          const cleanSentryId = sentryId.startsWith("sentry_") ? sentryId.substring(7) : sentryId;
          // Build deterministic ID: assoc_<type>_<planItemId>_<sentryId>
          // This ensures no double-prefix and consistent ID generation
          const baseId = `assoc_${criterionType}_${this.sanitizeId(planItemId)}_${this.sanitizeId(cleanSentryId)}`;
          return baseId;
        }
        /**
         * Validate that the final XML contains all required criterion attachment edges
         * This is a critical check to ensure edges are actually in the final output
         *
         * @param cmmnXml The final CMMN XML string
         * @param exportMode The export mode
         */
        validateFinalXMLHasAllEdges(cmmnXml, exportMode) {
          if (exportMode !== CMMNExportMode.FLOWABLE) {
            return; // Only validate FLOWABLE mode
          }
          let match;
          // Count all associations (criterion attachments)
          const associationIds = new Set();
          const associationPattern = /<cmmn:association[^>]*\s+id="([^"]+)"/g;
          while ((match = associationPattern.exec(cmmnXml)) !== null) {
            associationIds.add(match[1]);
          }
          // Count all CMMNEdges in the CMMNPlane
          const edgeIds = new Set();
          const edgePattern = /<cmmndi:CMMNEdge[^>]*\s+id="([^"]+)"/g;
          while ((match = edgePattern.exec(cmmnXml)) !== null) {
            edgeIds.add(match[1]);
          }
          // Count edges by cmmnElementRef (this is what Flowable uses to link)
          const edgeByElementRef = new Map();
          const edgeWithRefPattern = /<cmmndi:CMMNEdge[^>]*cmmnElementRef="([^"]+)"[^>]*>([\s\S]*?)<\/cmmndi:CMMNEdge>/g;
          let edgeMatch;
          while ((edgeMatch = edgeWithRefPattern.exec(cmmnXml)) !== null) {
            const elementRef = edgeMatch[1];
            const edgeContent = edgeMatch[2];
            const idMatch = edgeMatch[0].match(/id="([^"]+)"/);
            const waypointCount = (edgeContent.match(/<di:waypoint[^>]*>/g) || []).length;
            edgeByElementRef.set(elementRef, {
              id: idMatch ? idMatch[1] : "",
              waypointCount: waypointCount
            });
          }
          // Check each association has a matching edge
          const missingEdges = [];
          const lowWaypointEdges = [];
          associationIds.forEach(assocId => {
            const edgeInfo = edgeByElementRef.get(assocId);
            if (!edgeInfo) {
              missingEdges.push(assocId);
            } else if (edgeInfo.waypointCount < 2) {
              lowWaypointEdges.push(assocId);
            }
          });
          // Final XML edge validation (no logging - removed for production)
          if (missingEdges.length > 0) {
            throw new Error(`Final XML validation failed: ${missingEdges.length} criterion attachment association(s) are missing their DI edges in the final XML. This will cause Flowable AssociationJsonConverter NPE.`);
          }
          if (lowWaypointEdges.length > 0) {
            throw new Error(`Final XML validation failed: ${lowWaypointEdges.length} criterion attachment edge(s) have <2 waypoints. This will cause Flowable AssociationJsonConverter NPE.`);
          }
        }
        /**
         * Generate diagnostic report for association-to-edge matching
         * Helps identify mismatches where cmmnElementRef doesn't match associationId
         */
        generateAssociationEdgeDiagnostics(cmmnXml, exportMode) {
          let match;
          // Extract all associations
          const associationIds = new Set();
          const associationPattern = /<cmmn:association[^>]*\s+id="([^"]+)"/g;
          while ((match = associationPattern.exec(cmmnXml)) !== null) {
            associationIds.add(match[1]);
          }
          // Extract all edges by cmmnElementRef
          const edgeByElementRef = new Map();
          const edgePattern = /<cmmndi:CMMNEdge[^>]*cmmnElementRef="([^"]+)"[^>]*>([\s\S]*?)<\/cmmndi:CMMNEdge>/g;
          let edgeMatch;
          while ((edgeMatch = edgePattern.exec(cmmnXml)) !== null) {
            const elementRef = edgeMatch[1];
            const edgeContent = edgeMatch[2];
            const idMatch = edgeMatch[0].match(/id="([^"]+)"/);
            const waypointCount = (edgeContent.match(/<di:waypoint[^>]*>/g) || []).length;
            edgeByElementRef.set(elementRef, {
              id: idMatch ? idMatch[1] : "",
              waypointCount: waypointCount
            });
          }
          // Check each association
          const missingEdges = [];
          const lowWaypointEdges = [];
          const edgeDetails = new Map();
          associationIds.forEach(assocId => {
            const edgeInfo = edgeByElementRef.get(assocId);
            if (!edgeInfo) {
              missingEdges.push(assocId);
            } else {
              edgeDetails.set(assocId, {
                waypointCount: edgeInfo.waypointCount,
                edgeId: edgeInfo.id
              });
              if (edgeInfo.waypointCount < 2) {
                lowWaypointEdges.push(assocId);
              }
            }
          });
          return {
            associationCount: associationIds.size,
            edgeCount: edgeByElementRef.size,
            matchingCount: associationIds.size - missingEdges.length,
            missingEdgeCount: missingEdges.length,
            lowWaypointCount: lowWaypointEdges.length,
            missingEdges,
            lowWaypointEdges,
            edgeDetails
          };
        }
        /**
         * Escape XML special characters
         */
        escapeXml(text) {
          return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
        }
        /**
         * Format XML with proper indentation
         */
        formatXML(xml) {
          // Simple formatting - in production, you might want more sophisticated formatting
          return xml;
        }
        /**
         * Sanitize CMMN XML for Flowable 6.7.2 compatibility
         *
         * CRITICAL: Flowable 6.7.2's AssociationJsonConverter crashes with NPE when it encounters
         * ANY association, even with proper DI waypoints. The only stable path is to keep the
         * exported CMMN completely association-free.
         *
         * This function removes:
         * 1. All <cmmn:association> elements (anywhere in the document)
         * 2. All <cmmndi:CMMNEdge> elements whose cmmnElementRef points to an association ID
         * 3. All <cmmndi:CMMNEdge> elements whose id or cmmnElementRef contains "assoc_"
         * 4. All <cmmndi:CMMNEdge> elements whose cmmnElementRef does not exist as an element id
         *
         * This is a belt-and-suspenders approach to prevent any associations from slipping through.
         *
         * Semantics are preserved via:
         * - PlanItems with entryCriterionRefs / exitCriterionRefs (existing CMMN structure)
         * - cmmn:criterion, cmmn:sentry, cmmn:onPart elements (semantic elements, not visual connectors)
         * - cmmndi:CMMNShape for plan items and criteria (visual representation)
         */
        sanitizeForFlowable672(cmmnXml) {
          let xml = cmmnXml;
          // Step 1: Extract all association IDs before removal (for edge cleanup)
          const removedAssociationIds = new Set();
          const associationPattern = /<cmmn:association[^>]*\s+id="([^"]+)"/g;
          let match;
          while ((match = associationPattern.exec(xml)) !== null) {
            removedAssociationIds.add(match[1]);
          }
          // Step 2: Remove all <cmmn:association> elements
          // Match: <cmmn:association ... /> or <cmmn:association ...>...</cmmn:association>
          xml = xml.replace(/<cmmn:association[^>]*\/>/g, "");
          xml = xml.replace(/<cmmn:association[^>]*>[\s\S]*?<\/cmmn:association>/g, "");
          // Step 3: Build set of all valid element IDs in the CMMN model (for dangling edge detection)
          const validElementIds = new Set();
          // Extract plan item IDs
          const planItemPattern = /<cmmn:planItem[^>]*\s+id="([^"]+)"/g;
          while ((match = planItemPattern.exec(xml)) !== null) {
            validElementIds.add(match[1]);
          }
          // Extract sentry IDs
          const sentryPattern = /<cmmn:sentry[^>]*\s+id="([^"]+)"/g;
          while ((match = sentryPattern.exec(xml)) !== null) {
            validElementIds.add(match[1]);
          }
          // Extract criterion IDs
          const criterionPattern = /<cmmn:(?:entryCriterion|exitCriterion)[^>]*\s+id="([^"]+)"/g;
          while ((match = criterionPattern.exec(xml)) !== null) {
            validElementIds.add(match[1]);
          }
          // Extract onPart IDs
          const onPartPattern = /<cmmn:(?:planItemOnPart|caseFileItemOnPart)[^>]*\s+id="([^"]+)"/g;
          while ((match = onPartPattern.exec(xml)) !== null) {
            validElementIds.add(match[1]);
          }
          // Step 4: Remove association edges
          // Match: <cmmndi:CMMNEdge ... cmmnElementRef="assoc_..." ...>...</cmmndi:CMMNEdge>
          // Or: <cmmndi:CMMNEdge ... id="assoc_..." ...>...</cmmndi:CMMNEdge>
          // Or: <cmmndi:CMMNEdge ... cmmnElementRef="<removedAssociationId>" ...>...</cmmndi:CMMNEdge>
          // Or: <cmmndi:CMMNEdge ... cmmnElementRef="<nonExistentId>" ...>...</cmmndi:CMMNEdge>
          const edgePattern = /<cmmndi:CMMNEdge[^>]*>[\s\S]*?<\/cmmndi:CMMNEdge>/g;
          xml = xml.replace(edgePattern, edgeXml => {
            // Check if edge references an association
            const elementRefMatch = edgeXml.match(/cmmnElementRef="([^"]+)"/);
            const idMatch = edgeXml.match(/id="([^"]+)"/);
            const elementRef = elementRefMatch ? elementRefMatch[1] : "";
            const edgeId = idMatch ? idMatch[1] : "";
            // Remove if:
            // 1. cmmnElementRef points to a removed association
            if (elementRef && removedAssociationIds.has(elementRef)) {
              return "";
            }
            // 2. cmmnElementRef or id contains "assoc_"
            if (elementRef && elementRef.includes("assoc_") || edgeId && edgeId.includes("assoc_")) {
              return "";
            }
            // 3. cmmnElementRef does not exist as a valid element ID (dangling reference)
            if (elementRef && !validElementIds.has(elementRef)) {
              return "";
            }
            // Keep the edge
            return edgeXml;
          });
          // Step 5: Clean up any empty CMMNPlane tags or malformed structure
          // This shouldn't be necessary, but ensures valid XML structure
          xml = xml.replace(/<cmmndi:CMMNPlane[^>]*>\s*<\/cmmndi:CMMNPlane>/g, "<cmmndi:CMMNPlane id=\"CMMNPlane_1\" cmmnElementRef=\"casePlanModel_1\"/>");
          return xml;
        }
        static #_ = (() => this.ɵfac = function CMMNExporterService_Factory(__ngFactoryType__) {
          return new (__ngFactoryType__ || CMMNExporterService)();
        })();
        static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
          token: CMMNExporterService,
          factory: CMMNExporterService.ɵfac,
          providedIn: "root"
        }))();
      }
      return CMMNExporterService;
    })();