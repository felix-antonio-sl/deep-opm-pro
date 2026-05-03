// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/sysml-converters/requirement-diagram.converter.ts
// Extracted by opm-extracted/tools/extract.mjs

let RequirementDiagramConverter = /*#__PURE__*/(() => {
  class RequirementDiagramConverter extends BaseDiagramConverter {
    convert(model, progressCallback) {
      var _this = this;
      return (0, default)(function* () {
        const requirements = _this.getAllLogicalObjects(model).filter(obj => obj.isSatisfiedRequirementObject());
        if (!requirements.length) {
          return {
            modelElements: "",
            diagramElements: ""
          };
        }
        const relations = _this.getAllLogicalRelations(model);
        const requirementElements = [];
        const hierarchyElements = [];
        const satisfyElements = [];
        const clientElements = [];
        const requirementByNumber = new Map();
        const requirementByLid = new Map();
        const hierarchyPairs = new Set();
        const satisfyPairs = new Set();
        const diagramElementMetadata = [];
        const diagramEdgeMetadata = [];
        requirements.forEach(obj => {
          const identifiers = _this.extractRequirementIdentifiers(obj, model);
          const xmiId = _this.generateId("requirement");
          const name = _this.escapeXml(obj.getBareName());
          const textValue = _this.escapeXml(obj.value || obj.getBareName());
          const reqNumber = identifiers[0] || obj.lid;
          requirementElements.push(`      <packagedElement xmi:type="sysml:Requirement" xmi:id="${xmiId}" name="${name}">
    <text>${textValue}</text>
    <id>${_this.escapeXml(reqNumber)}</id>
  </packagedElement>`);
          diagramElementMetadata.push({
            semanticId: xmiId,
            kind: "requirement"
          });
          const info = {
            xmiId,
            identifiers,
            object: obj
          };
          requirementByLid.set(obj.lid, info);
          identifiers.forEach(identifier => {
            requirementByNumber.set(identifier, info);
          });
        });
        requirementByNumber.forEach(info => {
          info.identifiers.forEach(identifier => {
            const parent = _this.getParentIdentifier(identifier);
            if (parent && requirementByNumber.has(parent)) {
              const parentId = requirementByNumber.get(parent).xmiId;
              const key = `${info.xmiId}->${parentId}`;
              if (!hierarchyPairs.has(key)) {
                hierarchyPairs.add(key);
                const dependencyId = _this.generateId("dependency");
                hierarchyElements.push(`      <packagedElement xmi:type="uml:Dependency" xmi:id="${dependencyId}" client="${info.xmiId}" supplier="${parentId}" name="RequirementHierarchy"/>`);
                diagramEdgeMetadata.push({
                  semanticId: dependencyId,
                  kind: "dependency",
                  sourceSemanticId: info.xmiId,
                  targetSemanticId: parentId,
                  elementType: "uml:Dependency"
                });
              }
            }
          });
        });
        const clientMap = new Map();
        requirementByLid.forEach(info => {
          const owner = model.getOwnerOfRequirementByRequirementLID?.(info.object.lid);
          if (owner) {
            const clientId = _this.ensureClientElement(owner, clientMap, clientElements, diagramElementMetadata);
            if (clientId) {
              const key = `${clientId}->${info.xmiId}`;
              if (!satisfyPairs.has(key)) {
                satisfyPairs.add(key);
                const satisfy = _this.createSatisfyDependency(clientId, info.xmiId);
                satisfyElements.push(satisfy.xml);
                diagramEdgeMetadata.push({
                  semanticId: satisfy.id,
                  kind: "dependency",
                  sourceSemanticId: clientId,
                  targetSemanticId: info.xmiId,
                  elementType: "sysml:Satisfy"
                });
              }
            }
          }
        });
        relations.forEach(relation => {
          const requirementTokens = model.splitRequirementsFromText(relation.linkRequirements || "");
          if (!requirementTokens.length) {
            return;
          }
          requirementTokens.forEach(token => {
            const requirement = requirementByNumber.get(token);
            if (!requirement) {
              return;
            }
            const participants = [relation.sourceLogicalElement, ...(relation.targetLogicalElements || [])];
            participants.forEach(participant => {
              const entity = _this.getOwningObjectFromElement(participant) || (participant instanceof OpmLogicalProcess ? participant : null);
              if (!entity) {
                return;
              }
              const clientId = _this.ensureClientElement(entity, clientMap, clientElements, diagramElementMetadata);
              if (!clientId) {
                return;
              }
              const key = `${clientId}->${requirement.xmiId}`;
              if (!satisfyPairs.has(key)) {
                satisfyPairs.add(key);
                const satisfy = _this.createSatisfyDependency(clientId, requirement.xmiId);
                satisfyElements.push(satisfy.xml);
                diagramEdgeMetadata.push({
                  semanticId: satisfy.id,
                  kind: "dependency",
                  sourceSemanticId: clientId,
                  targetSemanticId: requirement.xmiId,
                  elementType: "sysml:Satisfy"
                });
              }
            });
          });
        });
        const modelContent = requirementElements.concat(clientElements).concat(hierarchyElements).concat(satisfyElements).join("\n");
        const diagramId = _this.generateId("diagram");
        const diagramElements = [];
        // Add all requirements
        requirementByLid.forEach(info => {
          diagramElements.push(`        <element xmi:idref="${info.xmiId}"/>`);
        });
        // Add all client elements
        clientMap.forEach(clientId => {
          diagramElements.push(`        <element xmi:idref="${clientId}"/>`);
        });
        // Add all dependencies (hierarchy and satisfy)
        hierarchyElements.forEach(hierarchy => {
          const match = hierarchy.match(/xmi:id="([^"]+)"/);
          if (match) {
            diagramElements.push(`        <element xmi:idref="${match[1]}"/>`);
          }
        });
        satisfyElements.forEach(satisfy => {
          const match = satisfy.match(/xmi:id="([^"]+)"/);
          if (match) {
            diagramElements.push(`        <element xmi:idref="${match[1]}"/>`);
          }
        });
        const elementsContent = diagramElements.length > 0 ? `\n${diagramElements.join("\n")}\n      ` : "";
        const diagramElement = `      <ownedDiagram xmi:type="sysml:RequirementDiagram" xmi:id="${diagramId}" name="Requirement Diagram">${elementsContent}
  </ownedDiagram>`;
        const metadata = {
          id: diagramId,
          name: "Requirement Diagram",
          diagramType: "requirement",
          contextSemanticId: "sysml_package",
          contextType: "uml:Package",
          elements: diagramElementMetadata,
          edges: diagramEdgeMetadata
        };
        return {
          modelElements: modelContent,
          diagramElements: diagramElement,
          metadata: [metadata]
        };
      })();
    }
    extractRequirementIdentifiers(object, model) {
      const candidates = model.splitRequirementsFromText(object.value || "");
      if (candidates.length) {
        return candidates;
      }
      return [object.getBareName()];
    }
    getParentIdentifier(identifier) {
      if (!identifier.includes(".")) {
        return null;
      }
      return identifier.substring(0, identifier.lastIndexOf("."));
    }
    ensureClientElement(entity, clientMap, clientElements, elementMetadata) {
      if (entity.isSatisfiedRequirementObject?.()) {
        return null;
      }
      const existing = clientMap.get(entity.lid);
      if (existing) {
        return existing;
      }
      const clientId = this.generateId("participant");
      const name = this.escapeXml(entity.getBareName());
      const type = entity instanceof OpmLogicalProcess ? "uml:Behavior" : "uml:Class";
      clientElements.push(`      <packagedElement xmi:type="${type}" xmi:id="${clientId}" name="${name}"/>`);
      clientMap.set(entity.lid, clientId);
      elementMetadata.push({
        semanticId: clientId,
        kind: "class"
      });
      return clientId;
    }
    createSatisfyDependency(clientId, requirementId) {
      const dependencyId = this.generateId("satisfy");
      return {
        id: dependencyId,
        xml: `      <packagedElement xmi:type="sysml:Satisfy" xmi:id="${dependencyId}" client="${clientId}" supplier="${requirementId}"/>`
      };
    }
    static #_ = (() => this.ɵfac = /*@__PURE__*/(() => {
      let ɵRequirementDiagramConverter_BaseFactory;
      return function RequirementDiagramConverter_Factory(__ngFactoryType__) {
        return (ɵRequirementDiagramConverter_BaseFactory ||= core /* ɵɵgetInheritedFactory */.xGo(RequirementDiagramConverter))(__ngFactoryType__ || RequirementDiagramConverter);
      };
    })())();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: RequirementDiagramConverter,
      factory: RequirementDiagramConverter.ɵfac,
      providedIn: "root"
    }))();
  }
  return RequirementDiagramConverter;
})();
