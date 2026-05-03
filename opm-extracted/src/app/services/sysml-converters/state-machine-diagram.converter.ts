// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/sysml-converters/state-machine-diagram.converter.ts
// Extracted by opm-extracted/tools/extract.mjs

    let StateMachineDiagramConverter = /*#__PURE__*/(() => {
      class StateMachineDiagramConverter extends BaseDiagramConverter {
        convert(model, progressCallback) {
          var _this = this;
          return (0, default)(function* () {
            const modelElements = [];
            const diagramElements = [];
            const relations = _this.getAllLogicalRelations(model);
            const processed = new Set();
            const objects = _this.getAllLogicalObjects(model);
            // Track created Activities to ensure unique names (prevents R2170 error)
            const createdActivities = new Map(); // Map: process lid -> activity name
            const statefulQueue = objects.filter(obj => (obj.states?.length || 0) > 0);
            const metadata = [];
            for (let i = 0; i < statefulQueue.length; i++) {
              const obj = statefulQueue[i];
              if (processed.has(obj.lid)) {
                continue;
              }
              const result = _this.buildStateMachineForObject(obj, relations, createdActivities);
              if (result) {
                modelElements.push(result.model);
                diagramElements.push(result.diagram);
                metadata.push(result.metadata);
              }
              processed.add(obj.lid);
              const features = _this.getStatefulFeatures(obj);
              features.forEach(feature => {
                if (!processed.has(feature.lid)) {
                  statefulQueue.push(feature);
                }
              });
              if (progressCallback) {
                progressCallback((i + 1) / statefulQueue.length);
              }
            }
            return {
              modelElements: modelElements.join("\n"),
              diagramElements: diagramElements.join("\n"),
              metadata
            };
          })();
        }
        buildStateMachineForObject(object, relations, createdActivities) {
          const states = object.states || [];
          if (!states.length) {
            return null;
          }
          const stateMachineId = this.generateId("statemachine");
          const regionId = this.generateId("region");
          const stateIdMap = new Map();
          const subvertices = [];
          const transitions = [];
          const diagramElementMetadata = [];
          const diagramEdgeMetadata = [];
          diagramElementMetadata.push({
            semanticId: stateMachineId,
            kind: "stateMachine"
          });
          states.forEach(state => {
            const stateId = this.generateId("state");
            stateIdMap.set(state.lid, stateId);
            subvertices.push(this.createStateVertex(state, stateId, relations, object, createdActivities));
            diagramElementMetadata.push({
              semanticId: stateId,
              kind: "state"
            });
          });
          const initialStates = states.filter(st => this.isInitialState(st));
          initialStates.forEach(state => {
            const pseudoId = this.generateId("pseudo");
            const transitionId = this.generateId("transition");
            subvertices.push(`        <subvertex xmi:type="uml:Pseudostate" xmi:id="${pseudoId}" kind="initial"/>`);
            diagramElementMetadata.push({
              semanticId: pseudoId,
              kind: "pseudostate"
            });
            const targetId = stateIdMap.get(state.lid);
            transitions.push(`        <transition xmi:type="uml:Transition" xmi:id="${transitionId}" source="${pseudoId}" target="${targetId}"/>`);
            diagramEdgeMetadata.push({
              semanticId: transitionId,
              kind: "transition",
              sourceSemanticId: pseudoId,
              targetSemanticId: targetId
            });
          });
          const finalStates = states.filter(st => this.isFinalState(st));
          finalStates.forEach(state => {
            const finalId = this.generateId("final");
            const transitionId = this.generateId("transition");
            subvertices.push(`        <subvertex xmi:type="uml:FinalState" xmi:id="${finalId}"/>`);
            diagramElementMetadata.push({
              semanticId: finalId,
              kind: "finalState"
            });
            const sourceId = stateIdMap.get(state.lid);
            transitions.push(`        <transition xmi:type="uml:Transition" xmi:id="${transitionId}" source="${sourceId}" target="${finalId}"/>`);
            diagramEdgeMetadata.push({
              semanticId: transitionId,
              kind: "transition",
              sourceSemanticId: sourceId,
              targetSemanticId: finalId
            });
          });
          this.addProcessDrivenTransitions(object, states, stateIdMap, relations, transitions, diagramEdgeMetadata);
          const regionContent = subvertices.concat(transitions).join("\n");
          const objectName = this.escapeXml(object.getBareName());
          const modelElement = `      <packagedElement xmi:type="uml:StateMachine" xmi:id="${stateMachineId}" name="${objectName} State Machine">
        <region xmi:type="uml:Region" xmi:id="${regionId}">
${regionContent}
        </region>
      </packagedElement>`;
          const diagramId = this.generateId("diagram");
          const diagramElement = `      <ownedDiagram xmi:type="uml:StateMachineDiagram" xmi:id="${diagramId}" name="${objectName} State Machine">
        <element xmi:idref="${stateMachineId}"/>
      </ownedDiagram>`;
          return {
            model: modelElement,
            diagram: diagramElement,
            metadata: {
              id: diagramId,
              name: `${objectName} State Machine`,
              diagramType: "stateMachine",
              contextSemanticId: stateMachineId,
              contextType: "uml:StateMachine",
              regionSemanticId: regionId,
              elements: diagramElementMetadata,
              edges: diagramEdgeMetadata
            }
          };
        }
        createStateVertex(state, stateId, relations, object, createdActivities) {
          const name = this.escapeXml(state.getBareName());
          const entryBehaviors = this.getStateBehaviors(state, relations, true);
          const doBehaviors = this.getStateBehaviors(state, relations, false);
          const behaviors = [];
          entryBehaviors.forEach(process => {
            const entryId = this.generateId("entry");
            const uniqueName = this.ensureUniqueActivityName(process, createdActivities, state, object);
            behaviors.push(`          <entry xmi:type="uml:Activity" xmi:id="${entryId}" name="${uniqueName}"/>`);
          });
          doBehaviors.forEach(process => {
            const doId = this.generateId("doActivity");
            const uniqueName = this.ensureUniqueActivityName(process, createdActivities, state, object);
            behaviors.push(`          <doActivity xmi:type="uml:Activity" xmi:id="${doId}" name="${uniqueName}"/>`);
          });
          const body = behaviors.length ? `\n${behaviors.join("\n")}\n        ` : "";
          return `        <subvertex xmi:type="uml:State" xmi:id="${stateId}" name="${name}">${body}</subvertex>`;
        }
        ensureUniqueActivityName(process, createdActivities, state, object) {
          const baseName = this.escapeXml(process.getBareName());
          // Create a unique key combining process, state, and object to handle same process in different states
          // This ensures Activities in different states get unique names even if they're the same process
          const uniqueKey = `${process.lid}_${state.lid}_${object.lid}`;
          // Check if we've already created an Activity for this specific combination
          const existing = createdActivities.get(uniqueKey);
          if (existing) {
            return existing;
          }
          // Check if another Activity with the same base name already exists
          const nameExists = Array.from(createdActivities.values()).includes(baseName);
          if (nameExists) {
            // Make it unique by including state context
            const stateName = this.escapeXml(state.getBareName());
            const uniqueName = `${baseName} (${stateName})`;
            createdActivities.set(uniqueKey, uniqueName);
            return uniqueName;
          }
          createdActivities.set(uniqueKey, baseName);
          return baseName;
        }
        getStateBehaviors(state, relations, entry) {
          const behaviors = [];
          relations.forEach(rel => {
            if (rel.linkType !== linkType.Instrument) {
              return;
            }
            const involvesState = rel.sourceLogicalElement === state || rel.targetLogicalElements?.some(target => target === state);
            if (!involvesState) {
              return;
            }
            const process = rel.sourceLogicalElement instanceof OpmLogicalProcess ? rel.sourceLogicalElement : rel.targetLogicalElements?.find(target => target instanceof OpmLogicalProcess);
            if (!process) {
              return;
            }
            if (entry && this.hasEventFlag(rel)) {
              behaviors.push(process);
            }
            if (!entry && !this.hasEventFlag(rel)) {
              behaviors.push(process);
            }
          });
          // Remove duplicates by logical ID
          const seen = new Set();
          return behaviors.filter(proc => {
            if (seen.has(proc.lid)) {
              return false;
            }
            seen.add(proc.lid);
            return true;
          });
        }
        addProcessDrivenTransitions(object, states, stateIdMap, relations, transitions, edgeMetadata) {
          const resultLinks = relations.filter(rel => {
            if (rel.linkType !== linkType.Result || !(rel.sourceLogicalElement instanceof OpmLogicalProcess)) {
              return false;
            }
            const targetState = rel.targetLogicalElements?.[0];
            if (!(targetState instanceof OpmLogicalState)) {
              return false;
            }
            return stateIdMap.has(targetState.lid);
          });
          resultLinks.forEach(resultLink => {
            const process = resultLink.sourceLogicalElement;
            const targetState = resultLink.targetLogicalElements?.[0];
            if (!targetState) {
              return;
            }
            const triggerLinks = relations.filter(rel => rel.targetLogicalElements?.some(target => target === process) && rel.sourceLogicalElement instanceof OpmLogicalState && stateIdMap.has(rel.sourceLogicalElement.lid) && this.isTransitionTriggerLink(rel));
            triggerLinks.forEach(trigger => {
              const sourceState = trigger.sourceLogicalElement;
              const transitionId = this.generateId("transition");
              const guardText = this.buildTransitionGuard(process, relations);
              const triggerId = this.generateId("trigger");
              const triggerName = this.escapeXml(process.getBareName());
              const guardFragment = guardText ? `\n          <guard xmi:type="uml:OpaqueExpression" xmi:id="${this.generateId("guard")}" body="${this.escapeXml(guardText)}"/>` : "";
              const sourceId = stateIdMap.get(sourceState.lid);
              const targetId = stateIdMap.get(targetState.lid);
              transitions.push(`        <transition xmi:type="uml:Transition" xmi:id="${transitionId}" source="${sourceId}" target="${targetId}">
          <trigger xmi:type="uml:CallEvent" xmi:id="${triggerId}" name="${triggerName}"/>${guardFragment}
        </transition>`);
              edgeMetadata.push({
                semanticId: transitionId,
                kind: "transition",
                sourceSemanticId: sourceId,
                targetSemanticId: targetId
              });
            });
            const exceptionLinks = relations.filter(rel => rel.targetLogicalElements?.some(target => target === process) && this.isExceptionLink(rel) && rel.sourceLogicalElement instanceof OpmLogicalState && stateIdMap.has(rel.sourceLogicalElement.lid));
            exceptionLinks.forEach(exceptionLink => {
              const sourceState = exceptionLink.sourceLogicalElement;
              const transitionId = this.generateId("transition");
              const sourceId = stateIdMap.get(sourceState.lid);
              const targetId = stateIdMap.get(targetState.lid);
              transitions.push(`        <transition xmi:type="uml:Transition" xmi:id="${transitionId}" source="${sourceId}" target="${targetId}">
          <trigger xmi:type="uml:TimeEvent" xmi:id="${this.generateId("trigger")}" name="timeout"/>
        </transition>`);
              edgeMetadata.push({
                semanticId: transitionId,
                kind: "transition",
                sourceSemanticId: sourceId,
                targetSemanticId: targetId
              });
            });
          });
        }
        isTransitionTriggerLink(relation) {
          if (relation.linkType === linkType.Consumption) {
            return true;
          }
          if (relation.linkType === linkType.Instrument && this.hasEventFlag(relation)) {
            return true;
          }
          return false;
        }
        buildTransitionGuard(process, relations) {
          const conditions = relations.filter(rel => this.hasConditionFlag(rel) && rel.targetLogicalElements?.some(target => target === process)).map(rel => {
            const source = rel.sourceLogicalElement;
            if (source instanceof OpmLogicalState) {
              return `${source.getBareName()}`;
            }
            if (source instanceof OpmLogicalObject) {
              return `${source.getBareName()} available`;
            }
            return "condition";
          });
          return Array.from(new Set(conditions)).join(" OR ");
        }
        getStatefulFeatures(object) {
          const children = object.getChildrenDeepIncludingAggregation("object") || [];
          return Array.from(new Set(children.filter(child => child instanceof OpmLogicalObject && child.states?.length)));
        }
        isInitialState(state) {
          return (state.stateType || "").toLowerCase().includes("initial");
        }
        isFinalState(state) {
          return (state.stateType || "").toLowerCase().includes("final");
        }
        isExceptionLink(relation) {
          return [linkType.UndertimeException, linkType.OvertimeException, linkType.UndertimeOvertimeException].includes(relation.linkType);
        }
        static #_ = (() => this.ɵfac = /*@__PURE__*/(() => {
          let ɵStateMachineDiagramConverter_BaseFactory;
          return function StateMachineDiagramConverter_Factory(__ngFactoryType__) {
            return (ɵStateMachineDiagramConverter_BaseFactory ||= core /* ɵɵgetInheritedFactory */.xGo(StateMachineDiagramConverter))(__ngFactoryType__ || StateMachineDiagramConverter);
          };
        })())();
        static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
          token: StateMachineDiagramConverter,
          factory: StateMachineDiagramConverter.ɵfac,
          providedIn: "root"
        }))();
      }
      return StateMachineDiagramConverter;
    })();
