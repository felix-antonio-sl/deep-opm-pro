// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/sysml-converters/block-definition-diagram.converter.ts
// Extracted by opm-extracted/tools/extract.mjs

    let BlockDefinitionDiagramConverter = /*#__PURE__*/(() => {
      class BlockDefinitionDiagramConverter extends BaseDiagramConverter {
        convert(model, progressCallback) {
          var _this = this;
          return (0, default)(function* () {
            // Based on thesis Section 6.2 - Block Definition Diagram
            // Rule 1: Informatical/Physical Object (not feature/instance) -> Block
            // Rule 2: Exhibition-Characterization with Object target -> Block Value/Property
            // Rule 3: States in Object -> Property with enumerated Data Type
            // Rule 4: Exhibition-Characterization with Process target -> Operation
            // Rule 5: Object with Instrument Link -> Input Parameter
            // Rule 6: Generalization-Specialization between Objects -> Generalization
            // Rule 7: Aggregation-Participation -> Part Association
            // Rule 8: Unidirectional/Bidirectional relation -> Reference Association
            // Rule 9: In-zooming of Objects -> Part Association
            const modelElements = [];
            const diagramElements = [];
            const diagramElementMetadata = [];
            const diagramEdgeMetadata = [];
            const blockIds = new Map(); // Map logical ID to XMI ID
            const relations = _this.getAllLogicalRelations(model);
            const enumCache = new Map();
            const enumerationDefinitions = [];
            // Find all blocks (Rule 1) - using logical objects
            const allObjects = _this.getAllLogicalObjects(model);
            // Rule 2: Objects that are targets of Exhibition-Characterization links should NOT be blocks
            // They will be properties instead
            const exhibitionTargets = new Set();
            relations.forEach(relation => {
              if (relation.linkType === linkType.Exhibition) {
                relation.targetLogicalElements?.forEach(target => {
                  if (target instanceof OpmLogicalObject) {
                    exhibitionTargets.add(target.lid);
                  }
                });
              }
            });
            let blocks = allObjects.filter(obj => {
              // Filter out environmental objects (they're actors in use case diagrams)
              if (_this.isEnvironmentalLogicalObject(obj)) {
                return false;
              }
              // Filter out objects that are targets of Exhibition links (Rule 2 - they become properties)
              if (exhibitionTargets.has(obj.lid)) {
                return false;
              }
              return true;
            });
            // If no systemic objects, include all objects (except exhibition targets)
            if (!blocks.length) {
              blocks = allObjects.filter(obj => !exhibitionTargets.has(obj.lid));
            }
            // Create blocks
            blocks.forEach(obj => {
              const blockId = _this.generateId("block");
              blockIds.set(obj.lid, blockId);
              diagramElementMetadata.push({
                semanticId: blockId,
                kind: "class"
              });
              const blockName = _this.escapeXml(obj.getBareName());
              const blockContent = [];
              // Add state attribute (Rule 3)
              blockContent.push(..._this.buildStateAttribute(obj, enumCache, enumerationDefinitions));
              // Add properties from exhibition-characterization (Rule 2)
              blockContent.push(..._this.buildExhibitionAttributes(obj, relations, blockIds, enumCache, enumerationDefinitions));
              // Add operations (Rule 4, 5)
              blockContent.push(..._this.buildOperations(obj, relations, blockIds));
              const inner = blockContent.length ? `\n${blockContent.join("\n")}\n      ` : "";
              // Try using uml:Class instead of sysml:Block - Modelio may not recognize sysml:Block without profile
              // Using uml:Class should at least make the elements visible, even if not properly stereotyped
              modelElements.push(`      <packagedElement xmi:type="uml:Class" xmi:id="${blockId}" name="${blockName}">${inner}</packagedElement>`);
            });
            // Add enumerations for state attributes
            modelElements.push(...enumerationDefinitions);
            // Add generalizations (Rule 6) - using logical relations
            _this.addBlockGeneralizations(relations, blockIds, modelElements, diagramEdgeMetadata);
            // Add part associations (Rule 7, 9) - using logical relations
            _this.addPartAssociations(relations, blockIds, modelElements, diagramEdgeMetadata);
            // Add reference associations (Rule 8) - using logical relations
            _this.addReferenceAssociations(relations, blockIds, modelElements, diagramEdgeMetadata);
            // Create diagram
            const diagramId = _this.generateId("diagram");
            diagramElements.push(_this.createBlockDefinitionDiagram(diagramId, blockIds, model));
            const metadata = {
              id: diagramId,
              name: "Block Definition Diagram",
              diagramType: "blockDefinition",
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
        buildStateAttribute(obj, enumCache, enumerationDefinitions) {
          const states = obj.states || [];
          if (!states.length) {
            return [];
          }
          const enumId = this.ensureEnumeration(obj, states, enumCache, enumerationDefinitions);
          const attrId = this.generateId("property");
          return [`        <ownedAttribute xmi:type="uml:Property" xmi:id="${attrId}" name="status" visibility="public" type="${enumId}"/>`];
        }
        buildExhibitionAttributes(obj, relations, blockIds, enumCache, enumerationDefinitions) {
          const attributes = [];
          const addedTargets = new Set();
          relations.forEach(relation => {
            if (relation.linkType !== linkType.Exhibition) {
              return;
            }
            if (relation.sourceLogicalElement !== obj) {
              return;
            }
            const target = relation.targetLogicalElements?.[0];
            if (!(target instanceof OpmLogicalObject)) {
              return;
            }
            if (addedTargets.has(target.lid)) {
              return;
            }
            addedTargets.add(target.lid);
            // Exhibition targets are not blocks, so they won't be in blockIds
            // If they have states, create an enumeration; otherwise use a primitive type
            let typeId;
            const targetStates = target.states || [];
            if (targetStates.length > 0) {
              // Create enumeration for the target object's states
              typeId = this.ensureEnumeration(target, targetStates, enumCache, enumerationDefinitions);
            } else {
              // For objects without states, we could create a simple data type
              // For now, use a generic type - but this might need refinement
              // Actually, according to Rule 2, Exhibition targets should have a Data Type
              // Let's create a simple data type or use a primitive
              const dataTypeId = this.generateId("datatype");
              typeId = dataTypeId;
              // Create a simple data type (we'll add it to enumerationDefinitions for now)
              enumerationDefinitions.push(`      <packagedElement xmi:type="uml:DataType" xmi:id="${dataTypeId}" name="${this.escapeXml(target.getBareName())}"/>`);
            }
            const attrId = this.generateId("property");
            // For Exhibition links: source has property of type target
            // Cardinality: how many of the target (property type) can the source have
            const lower = relation.targetCardinality || "0";
            const upper = relation.targetCardinality || "*";
            const upperValue = upper === "*" ? "*" : upper;
            attributes.push(`        <ownedAttribute xmi:type="uml:Property" xmi:id="${attrId}" name="${this.escapeXml(target.getBareName())}" type="${typeId}">
          <lowerValue xmi:type="uml:LiteralInteger" xmi:id="${attrId}_lower" value="${lower}"/>
          <upperValue xmi:type="uml:LiteralUnlimitedNatural" xmi:id="${attrId}_upper" value="${upperValue}"/>
        </ownedAttribute>`);
          });
          return attributes;
        }
        buildOperations(obj, relations, blockIds) {
          const operations = [];
          const addedProcesses = new Set();
          relations.forEach(relation => {
            if (relation.linkType !== linkType.Exhibition) {
              return;
            }
            if (relation.sourceLogicalElement !== obj) {
              return;
            }
            const target = relation.targetLogicalElements?.[0];
            if (!(target instanceof OpmLogicalProcess)) {
              return;
            }
            if (addedProcesses.has(target.lid)) {
              return;
            }
            addedProcesses.add(target.lid);
            operations.push(this.createOperationElement(target, relations, blockIds));
          });
          return operations;
        }
        createOperationElement(process, relations, blockIds) {
          const opId = this.generateId("op");
          const parameters = [];
          relations.forEach(relation => {
            if (relation.linkType !== linkType.Instrument) {
              return;
            }
            const targetProcess = relation.targetLogicalElements?.[0];
            if (targetProcess !== process) {
              return;
            }
            const instrument = relation.sourceLogicalElement;
            if (!(instrument instanceof OpmLogicalObject)) {
              return;
            }
            const typeId = blockIds.get(instrument.lid);
            if (!typeId) {
              return;
            }
            const paramId = this.generateId("param");
            parameters.push(`          <ownedParameter xmi:id="${paramId}" name="${this.escapeXml(this.toCamelCase(instrument.getBareName()))}" type="${typeId}" direction="in"/>`);
          });
          const paramSection = parameters.length ? `\n${parameters.join("\n")}\n        ` : "";
          return `        <ownedOperation xmi:type="uml:Operation" xmi:id="${opId}" name="${this.escapeXml(process.getBareName())}">${paramSection}</ownedOperation>`;
        }
        ensureEnumeration(obj, states, enumCache, enumerationDefinitions) {
          let enumId = enumCache.get(obj.lid);
          if (enumId) {
            return enumId;
          }
          enumId = this.generateId("enum");
          enumCache.set(obj.lid, enumId);
          const literals = states.map(state => {
            const literalId = this.generateId("literal");
            const literalName = this.escapeXml(state.getBareName ? state.getBareName() : state.name || "");
            return `        <ownedLiteral xmi:id="${literalId}" name="${literalName}"/>`;
          }).join("\n");
          enumerationDefinitions.push(`      <packagedElement xmi:type="uml:Enumeration" xmi:id="${enumId}" name="${this.escapeXml(obj.getBareName())}_State">
${literals}
      </packagedElement>`);
          return enumId;
        }
        toCamelCase(name) {
          if (!name) {
            return "param";
          }
          const result = name.toLowerCase().split(/\s+/).map((part, index) => index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)).join("");
          return result || "param";
        }
        addBlockGeneralizations(relations, blockIds, modelElements, edgeMetadata) {
          const processedPairs = new Set();
          relations.forEach(relation => {
            if (relation.linkType === linkType.Generalization) {
              const source = relation.sourceLogicalElement;
              const target = relation.targetLogicalElements?.[0];
              if (source instanceof OpmLogicalObject && target instanceof OpmLogicalObject) {
                const sourceId = blockIds.get(source.lid);
                const targetId = blockIds.get(target.lid);
                if (sourceId && targetId) {
                  const pairKey = `${sourceId}-${targetId}`;
                  if (!processedPairs.has(pairKey)) {
                    processedPairs.add(pairKey);
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
              }
            }
          });
        }
        addPartAssociations(relations, blockIds, modelElements, edgeMetadata) {
          // Rule 7: Aggregation-Participation
          const processedPairs = new Set();
          relations.forEach(relation => {
            if (relation.linkType === linkType.Aggregation) {
              const source = relation.sourceLogicalElement;
              const target = relation.targetLogicalElements?.[0];
              if (source instanceof OpmLogicalObject && target instanceof OpmLogicalObject) {
                const sourceId = blockIds.get(source.lid);
                const targetId = blockIds.get(target.lid);
                if (sourceId && targetId) {
                  const pairKey = `${sourceId}-${targetId}`;
                  if (!processedPairs.has(pairKey)) {
                    processedPairs.add(pairKey);
                    const assocId = this.generateId("part");
                    const sourceCardinality = relation.sourceCardinality || "1";
                    const targetCardinality = relation.targetCardinality || "1";
                    const lower1Id = this.generateId("lower");
                    const upper1Id = this.generateId("upper");
                    const lower2Id = this.generateId("lower");
                    const upper2Id = this.generateId("upper");
                    modelElements.push(`      <packagedElement xmi:type="uml:Association" xmi:id="${assocId}">
        <memberEnd xmi:idref="${assocId}_end1"/>
        <memberEnd xmi:idref="${assocId}_end2"/>
        <ownedEnd xmi:type="uml:Property" xmi:id="${assocId}_end1" type="${sourceId}" aggregation="composite">
          <lowerValue xmi:type="uml:LiteralInteger" xmi:id="${lower1Id}" value="${sourceCardinality}"/>
          <upperValue xmi:type="uml:LiteralUnlimitedNatural" xmi:id="${upper1Id}" value="${sourceCardinality}"/>
        </ownedEnd>
        <ownedEnd xmi:type="uml:Property" xmi:id="${assocId}_end2" type="${targetId}">
          <lowerValue xmi:type="uml:LiteralInteger" xmi:id="${lower2Id}" value="${targetCardinality}"/>
          <upperValue xmi:type="uml:LiteralUnlimitedNatural" xmi:id="${upper2Id}" value="${targetCardinality}"/>
        </ownedEnd>
      </packagedElement>`);
                    edgeMetadata.push({
                      semanticId: assocId,
                      kind: "association",
                      sourceSemanticId: sourceId,
                      targetSemanticId: targetId
                    });
                  }
                }
              }
            }
          });
        }
        addReferenceAssociations(relations, blockIds, modelElements, edgeMetadata) {
          // Rule 8: Unidirectional/Bidirectional relations -> reference association
          const processedPairs = new Set();
          relations.forEach(relation => {
            if (relation.linkType === linkType.Unidirectional || relation.linkType === linkType.Bidirectional) {
              const source = relation.sourceLogicalElement;
              const target = relation.targetLogicalElements?.[0];
              if (source instanceof OpmLogicalObject && target instanceof OpmLogicalObject) {
                const sourceId = blockIds.get(source.lid);
                const targetId = blockIds.get(target.lid);
                if (sourceId && targetId) {
                  // For bidirectional, use sorted pair to avoid duplicates
                  const pairKey = relation.linkType === linkType.Bidirectional ? [sourceId, targetId].sort().join("-") : `${sourceId}-${targetId}`;
                  if (!processedPairs.has(pairKey)) {
                    processedPairs.add(pairKey);
                    const assocId = this.generateId("ref");
                    const direction = relation.linkType === linkType.Unidirectional ? "none" : "shared";
                    const lower1Id = this.generateId("lower");
                    const upper1Id = this.generateId("upper");
                    const lower2Id = this.generateId("lower");
                    const upper2Id = this.generateId("upper");
                    modelElements.push(`      <packagedElement xmi:type="uml:Association" xmi:id="${assocId}">
        <memberEnd xmi:idref="${assocId}_end1"/>
        <memberEnd xmi:idref="${assocId}_end2"/>
        <ownedEnd xmi:type="uml:Property" xmi:id="${assocId}_end1" type="${sourceId}" aggregation="${direction}">
          <lowerValue xmi:type="uml:LiteralInteger" xmi:id="${lower1Id}" value="1"/>
          <upperValue xmi:type="uml:LiteralUnlimitedNatural" xmi:id="${upper1Id}" value="1"/>
        </ownedEnd>
        <ownedEnd xmi:type="uml:Property" xmi:id="${assocId}_end2" type="${targetId}" aggregation="${direction}">
          <lowerValue xmi:type="uml:LiteralInteger" xmi:id="${lower2Id}" value="1"/>
          <upperValue xmi:type="uml:LiteralUnlimitedNatural" xmi:id="${upper2Id}" value="1"/>
        </ownedEnd>
      </packagedElement>`);
                    edgeMetadata.push({
                      semanticId: assocId,
                      kind: "association",
                      sourceSemanticId: sourceId,
                      targetSemanticId: targetId
                    });
                  }
                }
              }
            }
          });
        }
        createBlockDefinitionDiagram(diagramId, blockIds, model) {
          const elements = [];
          // Add all blocks
          blockIds.forEach(blockId => {
            elements.push(`        <element xmi:idref="${blockId}"/>`);
          });
          const elementsContent = elements.length > 0 ? `\n${elements.join("\n")}\n      ` : "";
          return `      <ownedDiagram xmi:type="sysml:BlockDefinitionDiagram" xmi:id="${diagramId}" name="Block Definition Diagram">${elementsContent}
      </ownedDiagram>`;
        }
        static #_ = (() => this.ɵfac = /*@__PURE__*/(() => {
          let ɵBlockDefinitionDiagramConverter_BaseFactory;
          return function BlockDefinitionDiagramConverter_Factory(__ngFactoryType__) {
            return (ɵBlockDefinitionDiagramConverter_BaseFactory ||= core /* ɵɵgetInheritedFactory */.xGo(BlockDefinitionDiagramConverter))(__ngFactoryType__ || BlockDefinitionDiagramConverter);
          };
        })())();
        static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
          token: BlockDefinitionDiagramConverter,
          factory: BlockDefinitionDiagramConverter.ɵfac,
          providedIn: "root"
        }))();
      }
      return BlockDefinitionDiagramConverter;
    })();