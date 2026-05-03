// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/sysml-converters/activity-diagram.converter.ts
// Extracted by opm-extracted/tools/extract.mjs

    let ActivityDiagramConverter = /*#__PURE__*/(() => {
      class ActivityDiagramConverter extends BaseDiagramConverter {
        convert(model, progressCallback) {
          var _this = this;
          return (0, default)(function* () {
            const modelElements = [];
            const diagramElements = [];
            const relations = _this.getAllLogicalRelations(model);
            const processes = _this.getAllLogicalProcesses(model);
            const candidates = processes.filter(proc => _this.getDirectSubProcesses(proc).length > 0);
            const metadata = [];
            // Track created Activities to ensure unique names (prevents R2170 error)
            const createdActivities = new Map(); // Map: process lid -> activity name
            for (let i = 0; i < candidates.length; i++) {
              const process = candidates[i];
              const result = _this.buildActivityForProcess(process, relations, createdActivities);
              if (result) {
                modelElements.push(result.model);
                diagramElements.push(result.diagram);
                metadata.push(result.metadata);
              }
              if (progressCallback) {
                progressCallback((i + 1) / candidates.length);
              }
            }
            return {
              modelElements: modelElements.join("\n"),
              diagramElements: diagramElements.join("\n"),
              metadata
            };
          })();
        }
        buildActivityForProcess(process, relations, createdActivities) {
          const sequentialChildren = this.getSequentialChildren(process, relations);
          if (!sequentialChildren.length) {
            return null;
          }
          const actionIds = new Map();
          const nodes = [];
          const edges = [];
          const diagramElementMetadata = [];
          const diagramEdgeMetadata = [];
          const initialId = this.generateId("initial");
          nodes.push(this.createInitialNode(initialId));
          diagramElementMetadata.push({
            semanticId: initialId,
            kind: "activityInitial"
          });
          let upstreamIds = [initialId];
          const lanes = this.buildProcessLanes(sequentialChildren);
          lanes.forEach(lane => {
            if (lane.length === 1) {
              const actionId = this.ensureActionNode(lane[0], nodes, actionIds, diagramElementMetadata);
              upstreamIds = upstreamIds.flatMap(upstream => this.connectWithGuards(upstream, lane[0], actionId, relations, nodes, edges, diagramElementMetadata, diagramEdgeMetadata));
            } else {
              const forkId = this.generateId("fork");
              nodes.push(this.createForkNode(forkId));
              diagramElementMetadata.push({
                semanticId: forkId,
                kind: "activityFork"
              });
              upstreamIds.forEach(source => {
                const flow = this.createControlFlow(source, forkId);
                edges.push(flow.xml);
                diagramEdgeMetadata.push({
                  semanticId: flow.id,
                  kind: "controlFlow",
                  sourceSemanticId: source,
                  targetSemanticId: forkId
                });
              });
              const joinId = this.generateId("join");
              nodes.push(this.createJoinNode(joinId));
              diagramElementMetadata.push({
                semanticId: joinId,
                kind: "activityJoin"
              });
              lane.forEach(proc => {
                const actionId = this.ensureActionNode(proc, nodes, actionIds, diagramElementMetadata);
                const downstream = this.connectWithGuards(forkId, proc, actionId, relations, nodes, edges, diagramElementMetadata, diagramEdgeMetadata);
                downstream.forEach(nodeId => {
                  const flow = this.createControlFlow(nodeId, joinId);
                  edges.push(flow.xml);
                  diagramEdgeMetadata.push({
                    semanticId: flow.id,
                    kind: "controlFlow",
                    sourceSemanticId: nodeId,
                    targetSemanticId: joinId
                  });
                });
              });
              upstreamIds = [joinId];
            }
          });
          const finalId = this.generateId("final");
          nodes.push(this.createFinalNode(finalId));
          diagramElementMetadata.push({
            semanticId: finalId,
            kind: "activityFinal"
          });
          upstreamIds.forEach(source => {
            const flow = this.createControlFlow(source, finalId);
            edges.push(flow.xml);
            diagramEdgeMetadata.push({
              semanticId: flow.id,
              kind: "controlFlow",
              sourceSemanticId: source,
              targetSemanticId: finalId
            });
          });
          this.ensureInvocationTargets(process, relations, actionIds, nodes, diagramElementMetadata);
          this.addInvocationEdges(process, relations, actionIds, edges, diagramEdgeMetadata);
          const activityId = this.generateId("activity");
          // Ensure unique activity name by including logical ID if duplicate exists
          // This prevents R2170 error: "The name of a Behavior must be unique in its NameSpace"
          let baseName = process.getBareName();
          let activityName = this.escapeXml(baseName);
          // Check if we've already created an Activity for this logical process
          const existingName = createdActivities.get(process.lid);
          if (existingName) {
            // Use the same name if it's the same logical process
            activityName = existingName;
          } else {
            // Check if another process with the same name already exists
            const nameExists = Array.from(createdActivities.values()).includes(activityName);
            if (nameExists) {
              // Make it unique by appending a short version of the logical ID
              const shortLid = process.lid.substring(0, 8);
              activityName = this.escapeXml(`${baseName} (${shortLid})`);
            }
            createdActivities.set(process.lid, activityName);
          }
          const activityContent = nodes.concat(edges).join("\n");
          const modelElement = `      <packagedElement xmi:type="uml:Activity" xmi:id="${activityId}" name="${activityName} Activity">
${activityContent}
      </packagedElement>`;
          const diagramId = this.generateId("diagram");
          const diagramElement = `      <ownedDiagram xmi:type="uml:ActivityDiagram" xmi:id="${diagramId}" name="${activityName} Activity Diagram">
        <element xmi:idref="${activityId}"/>
      </ownedDiagram>`;
          diagramElementMetadata.push({
            semanticId: activityId,
            kind: "activity"
          });
          return {
            model: modelElement,
            diagram: diagramElement,
            metadata: {
              id: diagramId,
              name: `${activityName} Activity Diagram`,
              diagramType: "activity",
              contextSemanticId: activityId,
              contextType: "uml:Activity",
              elements: diagramElementMetadata,
              edges: diagramEdgeMetadata
            }
          };
        }
        getSequentialChildren(process, relations) {
          const direct = this.getDirectSubProcesses(process);
          const invoked = new Set();
          relations.filter(rel => rel.linkType === linkType.Invocation).forEach(rel => {
            const source = rel.sourceLogicalElement;
            const target = rel.targetLogicalElements?.[0];
            if (source instanceof OpmLogicalProcess && target instanceof OpmLogicalProcess) {
              if (direct.find(child => child.lid === target.lid)) {
                invoked.add(target.lid);
              }
            }
          });
          return direct.filter(child => !invoked.has(child.lid));
        }
        buildProcessLanes(children) {
          const tolerance = 6;
          const sorted = [...children].sort((a, b) => this.getPrimaryVisualY(a) - this.getPrimaryVisualY(b));
          const lanes = [];
          sorted.forEach(proc => {
            let lane = lanes.find(existing => Math.abs(this.getPrimaryVisualY(existing[0]) - this.getPrimaryVisualY(proc)) <= tolerance);
            if (!lane) {
              lane = [];
              lanes.push(lane);
            }
            lane.push(proc);
          });
          return lanes;
        }
        ensureActionNode(process, nodes, actionIds, elementMetadata) {
          const existing = actionIds.get(process.lid);
          if (existing) {
            return existing;
          }
          const actionId = this.generateId("action");
          const name = this.escapeXml(process.getBareName());
          nodes.push(`        <node xmi:type="uml:OpaqueAction" xmi:id="${actionId}" name="${name}"/>`);
          elementMetadata.push({
            semanticId: actionId,
            kind: "activityNode"
          });
          actionIds.set(process.lid, actionId);
          return actionId;
        }
        connectWithGuards(upstreamId, process, actionId, relations, nodes, edges, elementMetadata, edgeMetadata) {
          const incoming = relations.filter(rel => rel.targetLogicalElements && rel.targetLogicalElements.some(target => target === process));
          const conditionLinks = incoming.filter(rel => this.hasConditionFlag(rel));
          const exceptionLinks = incoming.filter(rel => this.isExceptionLink(rel));
          if (!conditionLinks.length && !exceptionLinks.length) {
            const flow = this.createControlFlow(upstreamId, actionId);
            edges.push(flow.xml);
            edgeMetadata.push({
              semanticId: flow.id,
              kind: "controlFlow",
              sourceSemanticId: upstreamId,
              targetSemanticId: actionId
            });
            return [actionId];
          }
          const decisionId = this.generateId("decision");
          nodes.push(`        <node xmi:type="uml:DecisionNode" xmi:id="${decisionId}" name="Decision"/>`);
          elementMetadata.push({
            semanticId: decisionId,
            kind: "activityDecision"
          });
          const entryFlow = this.createControlFlow(upstreamId, decisionId);
          edges.push(entryFlow.xml);
          edgeMetadata.push({
            semanticId: entryFlow.id,
            kind: "controlFlow",
            sourceSemanticId: upstreamId,
            targetSemanticId: decisionId
          });
          conditionLinks.forEach(link => {
            const guardText = this.describeConditionGuard(link);
            const guardedFlow = this.createControlFlow(decisionId, actionId, guardText);
            edges.push(guardedFlow.xml);
            edgeMetadata.push({
              semanticId: guardedFlow.id,
              kind: "controlFlow",
              sourceSemanticId: decisionId,
              targetSemanticId: actionId
            });
          });
          exceptionLinks.forEach(link => {
            const guardText = this.describeExceptionGuard(link);
            const guardedFlow = this.createControlFlow(decisionId, actionId, guardText);
            edges.push(guardedFlow.xml);
            edgeMetadata.push({
              semanticId: guardedFlow.id,
              kind: "controlFlow",
              sourceSemanticId: decisionId,
              targetSemanticId: actionId
            });
          });
          return [actionId];
        }
        ensureInvocationTargets(process, relations, actionIds, nodes, elementMetadata) {
          const invocationTargets = relations.filter(rel => rel.linkType === linkType.Invocation).map(rel => {
            const source = rel.sourceLogicalElement;
            const target = rel.targetLogicalElements?.[0];
            if (source instanceof OpmLogicalProcess && target instanceof OpmLogicalProcess && (source.lid === process.lid || actionIds.has(source.lid))) {
              return target;
            }
            return null;
          }).filter(proc => !!proc);
          invocationTargets.forEach(proc => this.ensureActionNode(proc, nodes, actionIds, elementMetadata));
        }
        addInvocationEdges(process, relations, actionIds, edges, edgeMetadata) {
          relations.filter(rel => rel.linkType === linkType.Invocation).forEach(rel => {
            const source = rel.sourceLogicalElement;
            const target = rel.targetLogicalElements?.[0];
            if (source instanceof OpmLogicalProcess && target instanceof OpmLogicalProcess && actionIds.has(source.lid) && actionIds.has(target.lid) && (source === process || actionIds.has(source.lid))) {
              const flow = this.createControlFlow(actionIds.get(source.lid), actionIds.get(target.lid));
              edges.push(flow.xml);
              edgeMetadata.push({
                semanticId: flow.id,
                kind: "controlFlow",
                sourceSemanticId: actionIds.get(source.lid),
                targetSemanticId: actionIds.get(target.lid)
              });
            }
          });
        }
        isExceptionLink(relation) {
          return [linkType.UndertimeException, linkType.OvertimeException, linkType.UndertimeOvertimeException].includes(relation.linkType);
        }
        describeConditionGuard(relation) {
          const source = relation.sourceLogicalElement;
          if (source instanceof OpmLogicalState) {
            return `State == ${source.getBareName()}`;
          }
          if (source instanceof OpmLogicalObject) {
            return `${source.getBareName()} available`;
          }
          return "Condition met";
        }
        describeExceptionGuard(relation) {
          switch (relation.linkType) {
            case linkType.UndertimeException:
              return "Timeout (undertime)";
            case linkType.OvertimeException:
              return "Timeout (overtime)";
            case linkType.UndertimeOvertimeException:
              return "Timeout (time window)";
            default:
              return "Exception";
          }
        }
        createControlFlow(sourceId, targetId, guardText) {
          const edgeId = this.generateId("edge");
          if (!guardText) {
            return {
              id: edgeId,
              xml: `        <edge xmi:type="uml:ControlFlow" xmi:id="${edgeId}" source="${sourceId}" target="${targetId}"/>`
            };
          }
          const guardId = this.generateId("guard");
          const escapedGuard = this.escapeXml(guardText);
          return {
            id: edgeId,
            xml: `        <edge xmi:type="uml:ControlFlow" xmi:id="${edgeId}" source="${sourceId}" target="${targetId}">
          <guard xmi:type="uml:OpaqueExpression" xmi:id="${guardId}" body="${escapedGuard}"/>
        </edge>`
          };
        }
        createInitialNode(id) {
          return `        <node xmi:type="uml:InitialNode" xmi:id="${id}" name="Initial"/>`;
        }
        createFinalNode(id) {
          return `        <node xmi:type="uml:ActivityFinalNode" xmi:id="${id}" name="Final"/>`;
        }
        createForkNode(id) {
          return `        <node xmi:type="uml:ForkNode" xmi:id="${id}" name="Fork"/>`;
        }
        createJoinNode(id) {
          return `        <node xmi:type="uml:JoinNode" xmi:id="${id}" name="Join"/>`;
        }
        static #_ = (() => this.ɵfac = /*@__PURE__*/(() => {
          let ɵActivityDiagramConverter_BaseFactory;
          return function ActivityDiagramConverter_Factory(__ngFactoryType__) {
            return (ɵActivityDiagramConverter_BaseFactory ||= core /* ɵɵgetInheritedFactory */.xGo(ActivityDiagramConverter))(__ngFactoryType__ || ActivityDiagramConverter);
          };
        })())();
        static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
          token: ActivityDiagramConverter,
          factory: ActivityDiagramConverter.ɵfac,
          providedIn: "root"
        }))();
      }
      return ActivityDiagramConverter;
    })();