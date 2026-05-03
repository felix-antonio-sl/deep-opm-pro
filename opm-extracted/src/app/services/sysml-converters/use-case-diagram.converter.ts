// Source: decompiled/37084.js
// Original path: ./src/app/services/sysml-converters/use-case-diagram.converter.ts
// Extracted by opm-extracted/tools/extract.mjs

let UseCaseDiagramConverter = /*#__PURE__*/(() => {
  class UseCaseDiagramConverter extends BaseDiagramConverter {
    convert(model, progressCallback) {
      var _this = this;
      return (0, default)(function* () {
        // Based on thesis Section 6.1 - Use Case Diagram
        // Rule 1: Environmental Object -> Actor
        // Rule 2: Systemic Process connected with Environmental Object -> Use Case
        // Rule 3: Generalization-Specialization -> Generalization
        // Rule 4: Exception/Invocation Link -> Use Case «extend»
        // Rule 5: Process In-zooming/Aggregation -> Use Case «include»
        // Rule 6: Procedural Link between actor and use case -> Association
        const modelElements = [];
        const diagramElements = [];
        const useCaseIds = new Map(); // Map logical ID to XMI ID
        const actorIds = new Map(); // Map logical ID to XMI ID
        const diagramElementMetadata = [];
        const diagramEdgeMetadata = [];
        // Get OPDs up to k levels (default k=2 for use cases)
        const k = 2;
        const relevantOpds = _this.getRelevantOpds(model, k);
        // Find actors (environmental objects) - using logical elements
        const actors = _this.findActors(model, relevantOpds);
        const actorLids = new Set(actors.map(actor => actor.lid));
        actors.forEach(actor => {
          const id = _this.generateId("actor");
          actorIds.set(actor.lid, id);
          modelElements.push(`      <packagedElement xmi:type="uml:Actor" xmi:id="${id}" name="${_this.escapeXml(actor.getBareName())}"/>`);
          diagramElementMetadata.push({
            semanticId: id,
            kind: "actor"
          });
        });
        // Find use cases (systemic processes connected to environmental objects) - using logical elements
        const {
          useCases,
          actorUseCasePairs
        } = _this.findUseCases(model, actorLids);
        // Add all subprocesses of found use cases (thesis Rule 2: "and all of his subprocesses")
        const allUseCases = new Set(useCases);
        useCases.forEach(useCase => {
          const subprocesses = _this.getAllSubProcesses(useCase);
          subprocesses.forEach(sub => allUseCases.add(sub));
        });
        Array.from(allUseCases).forEach(useCase => {
          const id = _this.generateId("usecase");
          useCaseIds.set(useCase.lid, id);
          modelElements.push(`      <packagedElement xmi:type="uml:UseCase" xmi:id="${id}" name="${_this.escapeXml(useCase.getBareName())}"/>`);
          diagramElementMetadata.push({
            semanticId: id,
            kind: "useCase"
          });
        });
        // Add associations between actors and use cases
        _this.addActorUseCaseAssociations(actorUseCasePairs, actorIds, useCaseIds, modelElements, diagramEdgeMetadata);
        // Add generalizations - using logical relations
        _this.addGeneralizations(model, actorIds, useCaseIds, modelElements, diagramEdgeMetadata);
        // Add extend/include relationships
        _this.addExtendIncludeRelationships(model, relevantOpds, useCaseIds, modelElements, diagramEdgeMetadata);
        // Add implicit include relationships from in-zooming hierarchy
        _this.addImplicitIncludes(allUseCases, useCaseIds, modelElements, diagramEdgeMetadata);
        // Create diagram
        const diagramId = _this.generateId("diagram");
        diagramElements.push(_this.createUseCaseDiagram(diagramId, actorIds, useCaseIds, model));
        const metadata = {
          id: diagramId,
          name: "Use Case Diagram",
          diagramType: "useCase",
          elements: diagramElementMetadata,
          edges: diagramEdgeMetadata
        };
        return {
          modelElements: modelElements.join("\n"),
          diagramElements: diagramElements.join("\n"),
          metadata: [metadata]
        };
      })();
    }
    getRelevantOpds(model, k) {
      const relevant = [];
      model.opds.forEach(opd => {
        if (!opd.isHidden) {
          const level = this.getOpdLevel(opd, model);
          if (level <= k) {
            relevant.push(opd);
          }
        }
      });
      return relevant;
    }
    findActors(model, opds) {
      const actors = [];
      const allObjects = this.getAllLogicalObjects(model);
      // Filter for environmental objects that appear in relevant OPDs
      const relevantVisualIds = new Set();
      opds.forEach(opd => {
        opd.visualElements.forEach(visual => {
          if (visual.logicalElement) {
            relevantVisualIds.add(visual.logicalElement.lid);
          }
        });
      });
      allObjects.forEach(obj => {
        if (relevantVisualIds.has(obj.lid) && this.isEnvironmentalLogicalObject(obj)) {
          if (!actors.find(a => a.lid === obj.lid)) {
            actors.push(obj);
          }
        }
      });
      return actors;
    }
    findUseCases(model, actorLids) {
      const useCaseMap = new Map();
      const actorUseCasePairs = [];
      const processedPairs = new Set();
      const allProcesses = this.getAllLogicalProcesses(model);
      const allRelations = this.getAllLogicalRelations(model);
      // Find processes connected to actors via any procedural link
      allRelations.forEach(relation => {
        if (relation.linkType === linkType.Agent || relation.linkType === linkType.Instrument || relation.linkType === linkType.Consumption || relation.linkType === linkType.Result || relation.linkType === linkType.Effect) {
          const source = relation.sourceLogicalElement;
          const target = relation.targetLogicalElements?.[0];
          if (!target) {
            return;
          }
          // Check if source is actor and target is process
          if (source instanceof OpmLogicalObject && target instanceof OpmLogicalProcess) {
            if (actorLids.has(source.lid)) {
              useCaseMap.set(target.lid, target);
              const pairKey = `${source.lid}-${target.lid}`;
              if (!processedPairs.has(pairKey)) {
                processedPairs.add(pairKey);
                actorUseCasePairs.push({
                  actorLid: source.lid,
                  useCaseLid: target.lid
                });
              }
            }
          }
          // Check if target is actor and source is process
          if (source instanceof OpmLogicalProcess && target instanceof OpmLogicalObject) {
            if (actorLids.has(target.lid)) {
              useCaseMap.set(source.lid, source);
              const pairKey = `${target.lid}-${source.lid}`;
              if (!processedPairs.has(pairKey)) {
                processedPairs.add(pairKey);
                actorUseCasePairs.push({
                  actorLid: target.lid,
                  useCaseLid: source.lid
                });
              }
            }
          }
        }
      });
      return {
        useCases: Array.from(useCaseMap.values()),
        actorUseCasePairs
      };
    }
    addActorUseCaseAssociations(actorUseCasePairs, actorIds, useCaseIds, modelElements, edgeMetadata) {
      const processed = new Set();
      actorUseCasePairs.forEach(pair => {
        const actorId = actorIds.get(pair.actorLid);
        const useCaseId = useCaseIds.get(pair.useCaseLid);
        if (actorId && useCaseId) {
          const key = `${actorId}-${useCaseId}`;
          if (processed.has(key)) {
            return;
          }
          processed.add(key);
          const assocId = this.generateId("assoc");
          modelElements.push(`      <packagedElement xmi:type="uml:Association" xmi:id="${assocId}">
        <memberEnd xmi:idref="${assocId}_end1"/>
        <memberEnd xmi:idref="${assocId}_end2"/>
        <ownedEnd xmi:type="uml:Property" xmi:id="${assocId}_end1" type="${actorId}"/>
        <ownedEnd xmi:type="uml:Property" xmi:id="${assocId}_end2" type="${useCaseId}"/>
      </packagedElement>`);
          edgeMetadata.push({
            semanticId: assocId,
            kind: "association",
            sourceSemanticId: actorId,
            targetSemanticId: useCaseId
          });
        }
      });
    }
    addGeneralizations(model, actorIds, useCaseIds, modelElements, edgeMetadata) {
      const relations = this.getAllLogicalRelations(model);
      relations.forEach(relation => {
        if (relation.linkType === linkType.Generalization) {
          const source = relation.sourceLogicalElement;
          const target = relation.targetLogicalElements?.[0];
          if (!target) {
            return;
          }
          let sourceId;
          let targetId;
          if (source instanceof OpmLogicalObject && target instanceof OpmLogicalObject) {
            sourceId = actorIds.get(source.lid);
            targetId = actorIds.get(target.lid);
          } else if (source instanceof OpmLogicalProcess && target instanceof OpmLogicalProcess) {
            sourceId = useCaseIds.get(source.lid);
            targetId = useCaseIds.get(target.lid);
          }
          if (sourceId && targetId) {
            const genId = this.generateId("gen");
            modelElements.push(`      <packagedElement xmi:type="uml:Generalization" xmi:id="${genId}" general="${targetId}" specific="${sourceId}"/>`);
            edgeMetadata.push({
              semanticId: genId,
              kind: "generalization",
              sourceSemanticId: sourceId,
              targetSemanticId: targetId
            });
          }
        }
      });
    }
    addExtendIncludeRelationships(model, opds, useCaseIds, modelElements, edgeMetadata) {
      // Implementation based on Rules 4 and 5
      // Rule 4: Exception/Invocation Link -> Use Case «extend»
      // Rule 5: Process In-zooming/Aggregation -> Use Case «include»
      const relations = this.getAllLogicalRelations(model);
      relations.forEach(relation => {
        const source = relation.sourceLogicalElement;
        const target = relation.targetLogicalElements?.[0];
        if (!target) {
          return;
        }
        if (source instanceof OpmLogicalProcess && target instanceof OpmLogicalProcess) {
          const sourceUseCaseId = useCaseIds.get(source.lid);
          const targetUseCaseId = useCaseIds.get(target.lid);
          if (sourceUseCaseId && targetUseCaseId) {
            // Rule 4: Exception/Invocation -> extend
            if (relation.linkType === linkType.Invocation || relation.linkType === linkType.UndertimeException || relation.linkType === linkType.OvertimeException || relation.linkType === linkType.UndertimeOvertimeException) {
              const extendId = this.generateId("extend");
              modelElements.push(`      <packagedElement xmi:type="uml:Extend" xmi:id="${extendId}" extendedCase="${targetUseCaseId}" extension="${sourceUseCaseId}"/>`);
              edgeMetadata.push({
                semanticId: extendId,
                kind: "extend",
                sourceSemanticId: sourceUseCaseId,
                targetSemanticId: targetUseCaseId
              });
            }
            // Rule 5: Aggregation -> include
            if (relation.linkType === linkType.Aggregation) {
              const includeId = this.generateId("include");
              modelElements.push(`      <packagedElement xmi:type="uml:Include" xmi:id="${includeId}" addition="${targetUseCaseId}" includingCase="${sourceUseCaseId}"/>`);
              edgeMetadata.push({
                semanticId: includeId,
                kind: "include",
                sourceSemanticId: sourceUseCaseId,
                targetSemanticId: targetUseCaseId
              });
            }
          }
        }
      });
    }
    addImplicitIncludes(useCases, useCaseIds, modelElements, edgeMetadata) {
      const addedPairs = new Set();
      useCases.forEach(useCase => {
        const parentId = useCaseIds.get(useCase.lid);
        if (!parentId) {
          return;
        }
        const childProcesses = this.getInZoomedProcesses(useCase);
        childProcesses.forEach(child => {
          const childId = useCaseIds.get(child.lid);
          if (!childId || childId === parentId) {
            return;
          }
          const pairKey = `${parentId}-${childId}`;
          if (addedPairs.has(pairKey)) {
            return;
          }
          addedPairs.add(pairKey);
          const includeId = this.generateId("include");
          modelElements.push(`      <packagedElement xmi:type="uml:Include" xmi:id="${includeId}" addition="${childId}" includingCase="${parentId}"/>`);
          edgeMetadata.push({
            semanticId: includeId,
            kind: "include",
            sourceSemanticId: parentId,
            targetSemanticId: childId
          });
        });
      });
    }
    getInZoomedProcesses(process) {
      const directChildren = process.getChildren().filter(child => child instanceof OpmLogicalProcess);
      return directChildren;
    }
    getAllSubProcesses(process) {
      const result = [];
      const traverse = proc => {
        const children = this.getInZoomedProcesses(proc);
        children.forEach(child => {
          result.push(child);
          traverse(child);
        });
      };
      traverse(process);
      return result;
    }
    createUseCaseDiagram(diagramId, actorIds, useCaseIds, model) {
      const elements = [];
      // Add all actors
      actorIds.forEach(actorId => {
        elements.push(`        <element xmi:idref="${actorId}"/>`);
      });
      // Add all use cases
      useCaseIds.forEach(useCaseId => {
        elements.push(`        <element xmi:idref="${useCaseId}"/>`);
      });
      const elementsContent = elements.length > 0 ? `\n${elements.join("\n")}\n      ` : "";
      return `      <ownedDiagram xmi:type="uml:UseCaseDiagram" xmi:id="${diagramId}" name="Use Case Diagram">${elementsContent}
      </ownedDiagram>`;
    }
    static #_ = (() => this.ɵfac = /*@__PURE__*/(() => {
      let ɵUseCaseDiagramConverter_BaseFactory;
      return function UseCaseDiagramConverter_Factory(__ngFactoryType__) {
        return (ɵUseCaseDiagramConverter_BaseFactory ||= core /* ɵɵgetInheritedFactory */.xGo(UseCaseDiagramConverter))(__ngFactoryType__ || UseCaseDiagramConverter);
      };
    })())();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: UseCaseDiagramConverter,
      factory: UseCaseDiagramConverter.ɵfac,
      providedIn: "root"
    }))();
  }
  return UseCaseDiagramConverter;
})();