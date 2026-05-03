// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/sysml-xmi-generator.service.ts
// Extracted by opm-extracted/tools/extract.mjs

    let SysMLXmiGeneratorService = /*#__PURE__*/(() => {
      class SysMLXmiGeneratorService {
        constructor(useCaseConverter, blockDefinitionConverter, activityConverter, stateMachineConverter, sequenceConverter, requirementConverter) {
          this.useCaseConverter = useCaseConverter;
          this.blockDefinitionConverter = blockDefinitionConverter;
          this.activityConverter = activityConverter;
          this.stateMachineConverter = stateMachineConverter;
          this.sequenceConverter = sequenceConverter;
          this.requirementConverter = requirementConverter;
        }
        generateXmi(model, selectedDiagrams, targetTool, fileBaseName, progressCallback) {
          var _this = this;
          return (0, default)(function* () {
            let progress = 0;
            const progressStep = 100 / selectedDiagrams.length;
            // Start XMI document
            let xmiContent = _this.generateXmiHeader();
            // Generate model elements for each selected diagram
            const modelElements = [];
            const diagramElements = [];
            const diagramMetadata = [];
            for (const diagramType of selectedDiagrams) {
              try {
                const converter = _this.getConverter(diagramType);
                if (converter) {
                  const result = yield converter.convert(model, progressCallback);
                  if (result.modelElements) {
                    modelElements.push(result.modelElements);
                  }
                  if (result.diagramElements) {
                    diagramElements.push(result.diagramElements);
                  }
                  if (result.metadata?.length) {
                    diagramMetadata.push(...result.metadata);
                  }
                }
                progress += progressStep;
                if (progressCallback) {
                  progressCallback(progress);
                }
              } catch (error) {
                console.error(`Error converting ${diagramType}:`, error);
                // Continue with other diagrams
              }
            }
            const includeOwnedDiagrams = targetTool !== "papyrus";
            const diagramSection = includeOwnedDiagrams ? diagramElements.join("\n") : "";
            // Combine all model elements and nest diagrams within the package
            xmiContent += _this.wrapModelElements(modelElements.join("\n"), diagramSection);
            // Close XMI document
            xmiContent += _this.generateXmiFooter();
            if (targetTool === "papyrus") {
              return yield _this.generatePapyrusBundle(xmiContent, diagramMetadata, fileBaseName);
            }
            const blob = new Blob([xmiContent], {
              type: "application/xml"
            });
            return {
              blob,
              extension: "xmi",
              mimeType: "application/xml"
            };
          })();
        }
        getConverter(diagramType) {
          switch (diagramType) {
            case "useCase":
              return this.useCaseConverter;
            case "blockDefinition":
              return this.blockDefinitionConverter;
            case "activity":
              return this.activityConverter;
            case "stateMachine":
              return this.stateMachineConverter;
            case "sequence":
              return this.sequenceConverter;
            case "requirement":
              return this.requirementConverter;
            default:
              return null;
          }
        }
        generateXmiHeader() {
          return `<?xml version="1.0" encoding="UTF-8"?>
<xmi:XMI xmi:version="2.1" xmlns:xmi="http://www.omg.org/spec/XMI/20110701" 
         xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" 
         xmlns:sysml="http://www.omg.org/spec/SysML/20150701/SysML"
         xmlns:ecore="http://www.eclipse.org/emf/2002/Ecore">
  <xmi:Documentation exporter="OPCloud" exporterVersion="1.0"/>
`;
        }
        wrapModelElements(modelContent, diagramContent = "") {
          // Include diagrams as ownedDiagram within the package - Modelio may require this structure
          const diagramsSection = diagramContent.trim() ? `\n${this.indent(diagramContent, 4)}` : "";
          const primitiveImportId = this.generateNotationId("pkgImport");
          const sysmlImportId = this.generateNotationId("pkgImport");
          // Canonical order for uml:Model: packageImport, packagedElement, profileApplication
          // Profile application will be added by applySysmlProfile before closing tag
          return `  <uml:Model xmi:type="uml:Model" xmi:id="model_root" name="OPM_Model">
    <packageImport xmi:type="uml:PackageImport" xmi:id="${primitiveImportId}">
      <importedPackage xmi:type="uml:Model" href="pathmap://UML_LIBRARIES/UMLPrimitiveTypes.library.uml#_0"/>
    </packageImport>
    <packageImport xmi:type="uml:PackageImport" xmi:id="${sysmlImportId}">
      <importedPackage xmi:type="uml:Package" href="pathmap://SysML16_LIBRARIES/SysML-Standard-Library.uml#SysML.package_packagedElement_Libraries"/>
    </packageImport>
    <packagedElement xmi:type="uml:Package" xmi:id="sysml_package" name="SysML">
${this.indent(modelContent, 6)}${diagramsSection}
    </packagedElement>
  </uml:Model>
`;
        }
        wrapDiagrams(diagramContent) {
          // Return empty - diagrams will be nested in wrapModelElements as ownedDiagram
          return "";
        }
        generatePapyrusBundle(umlContent, diagramMetadata, fileBaseName) {
          var _this2 = this;
          return (0, default)(function* () {
            const umlFileName = `${fileBaseName}.uml`;
            const umlFileNameEscaped = _this2.escapeXml(umlFileName); // Escape for use in XML href attributes
            const papyrusDiagramMetadata = [];
            const diagramFragments = diagramMetadata.map(meta => {
              const fragment = _this2.buildPapyrusDiagram(meta, umlFileNameEscaped);
              if (fragment) {
                papyrusDiagramMetadata.push(meta);
              }
              return fragment;
            }).filter(frag => !!frag);
            if (!diagramFragments.length) {
              const blob = new Blob([umlContent], {
                type: "application/xml"
              });
              return {
                blob,
                extension: "uml",
                mimeType: "application/xml"
              };
            }
            const umlWithProfile = _this2.applySysmlProfile(umlContent);
            const notationContent = _this2.wrapPapyrusNotation(diagramFragments);
            const diContent = _this2.buildPapyrusDi(papyrusDiagramMetadata);
            const projectName = _this2.buildProjectName(fileBaseName);
            const zip = new jszip_min();
            const projectFolder = zip.folder(projectName);
            if (!projectFolder) {
              throw new Error("Failed to create project folder inside export zip");
            }
            projectFolder.file(`${fileBaseName}.uml`, umlWithProfile);
            projectFolder.file(`${fileBaseName}.notation`, notationContent);
            projectFolder.file(`${fileBaseName}.di`, diContent);
            projectFolder.file(".project", _this2.buildEclipseProjectFile(projectName));
            projectFolder.file(".classpath", _this2.buildEclipseClasspathFile());
            const blob = yield zip.generateAsync({
              type: "blob"
            });
            return {
              blob,
              extension: "zip",
              mimeType: "application/zip"
            };
          })();
        }
        buildProjectName(fileBaseName) {
          // Sanitize project name for Eclipse: remove invalid characters
          // Eclipse project names should not contain spaces or special characters
          const sanitized = fileBaseName.replace(/[^A-Za-z0-9_-]/g, "");
          return sanitized || "OPCloudSysMLProject";
        }
        buildEclipseProjectFile(projectName) {
          // Use a minimal .project file without Papyrus-specific nature/builder
          // This avoids "unknown nature" warnings and works with standard Eclipse projects
          return `<?xml version="1.0" encoding="UTF-8"?>
<projectDescription>
  <name>${projectName}</name>
  <comment></comment>
  <projects/>
  <buildSpec/>
  <natures/>
</projectDescription>
`;
        }
        buildEclipseClasspathFile() {
          return `<?xml version="1.0" encoding="UTF-8"?>
<classpath>
  <classpathentry kind="src" path=""/>
  <classpathentry kind="con" path="org.eclipse.jdt.launching.JRE_CONTAINER/org.eclipse.jdt.internal.debug.ui.launcher.StandardVMType/JavaSE-1.8"/>
  <classpathentry kind="output" path=""/>
</classpath>
`;
        }
        buildPapyrusDiagram(diagram, umlFileNameEscaped) {
          switch (diagram.diagramType) {
            case "blockDefinition":
              return this.buildPapyrusBlockDefinitionDiagram(diagram, umlFileNameEscaped);
            case "useCase":
              return this.buildPapyrusUseCaseDiagram(diagram, umlFileNameEscaped);
            case "activity":
              return this.buildPapyrusActivityDiagram(diagram, umlFileNameEscaped);
            case "stateMachine":
              return this.buildPapyrusStateMachineDiagram(diagram, umlFileNameEscaped);
            case "sequence":
              return this.buildPapyrusSequenceDiagram(diagram, umlFileNameEscaped);
            case "requirement":
              return this.buildPapyrusRequirementDiagram(diagram, umlFileNameEscaped);
            default:
              return null;
          }
        }
        buildPapyrusBlockDefinitionDiagram(diagram, umlFileNameEscaped) {
          const diagramId = diagram.id || this.generateNotationId("diagram");
          const header = `<?xml version="1.0" encoding="UTF-8"?>
<notation:Diagram xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:notation="http://www.eclipse.org/gmf/runtime/1.0.3/notation" xmlns:style="http://www.eclipse.org/papyrus/infra/gmfdiag/style" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" xmi:id="${diagramId}" type="PapyrusUMLClassDiagram" name="${diagram.name}" measurementUnit="Pixel">
`;
          const shapeFragments = [];
          const edgeFragments = [];
          const elementPositions = new Map();
          const spacingX = 220;
          const spacingY = 150;
          const width = 160;
          const height = 60;
          const columns = Math.max(1, Math.ceil(Math.sqrt(diagram.elements.length)));
          diagram.elements.forEach((element, index) => {
            const shapeId = this.generateNotationId("shape");
            const row = Math.floor(index / columns);
            const col = index % columns;
            const x = 60 + col * spacingX;
            const y = 60 + row * spacingY;
            elementPositions.set(element.semanticId, {
              shapeId,
              x,
              y,
              width,
              height
            });
            shapeFragments.push(this.createPapyrusClassShape(shapeId, umlFileNameEscaped, element.semanticId, x, y, width, height));
          });
          diagram.edges.forEach(edge => {
            const sourceInfo = elementPositions.get(edge.sourceSemanticId);
            const targetInfo = elementPositions.get(edge.targetSemanticId);
            if (!sourceInfo || !targetInfo) {
              return;
            }
            const connector = this.createPapyrusConnector(edge.kind, umlFileNameEscaped, edge.semanticId, sourceInfo, targetInfo);
            if (connector) {
              edgeFragments.push(connector);
            }
          });
          const diagramStyleId = this.generateNotationId("diagramStyle");
          const papyrusStyleId = this.generateNotationId("papyrusStyle");
          const compatibilityVersionId = this.generateNotationId("compatibilityVersion");
          // For SysML Block Definition Diagrams, Papyrus examples use the SysML blockdefinition kind
          // and use the SysML package as both owner and element
          const diagramKindId = this.getPapyrusDiagramKindId("blockDefinition") || "org.eclipse.papyrus.sysml.diagram.blockdefinition";
          const styles = `  <styles xmi:type="notation:StringValueStyle" xmi:id="${compatibilityVersionId}" name="diagram_compatibility_version" stringValue="1.4.0"/>
  <styles xmi:type="notation:DiagramStyle" xmi:id="${diagramStyleId}"/>
  <styles xmi:type="style:PapyrusDiagramStyle" xmi:id="${papyrusStyleId}" diagramKindId="${diagramKindId}">
    <owner xmi:type="uml:Package" href="${umlFileNameEscaped}#sysml_package"/>
  </styles>`;
          const footer = `  <element xmi:type="uml:Package" href="${umlFileNameEscaped}#sysml_package"/>
</notation:Diagram>`;
          return `${header}${shapeFragments.join("\n")}${edgeFragments.join("\n")}\n${styles}\n${footer}`;
        }
        buildPapyrusStateMachineDiagram(diagram, umlFileNameEscaped) {
          const nodes = diagram.elements.filter(el => ["state", "pseudostate", "finalState"].includes(el.kind));
          if (!nodes.length) {
            return null;
          }
          const diagramId = diagram.id || this.generateNotationId("diagram");
          const header = `<?xml version="1.0" encoding="UTF-8"?>
<notation:Diagram xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:notation="http://www.eclipse.org/gmf/runtime/1.0.3/notation" xmlns:style="http://www.eclipse.org/papyrus/infra/gmfdiag/style" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" xmi:id="${diagramId}" type="PapyrusUMLStateMachineDiagram" name="${diagram.name}" measurementUnit="Pixel">
`;
          const stateMachineShapeId = this.generateNotationId("stateMachineShape");
          const regionShapeId = this.generateNotationId("regionShape");
          const subvertexCompartmentId = this.generateNotationId("subvertexCompartment");
          const stateShapeFragments = [];
          const shapePositions = new Map();
          const columns = Math.max(1, Math.ceil(Math.sqrt(nodes.length)));
          const spacingX = 220;
          const spacingY = 140;
          const baseX = 60;
          const baseY = 80;
          nodes.forEach((element, index) => {
            const row = Math.floor(index / columns);
            const col = index % columns;
            const x = baseX + col * spacingX;
            const y = baseY + row * spacingY;
            const nodeShape = this.createStateMachineNodeShape(element, umlFileNameEscaped, x, y);
            if (nodeShape) {
              stateShapeFragments.push(nodeShape.fragment);
              shapePositions.set(element.semanticId, {
                shapeId: nodeShape.shapeId,
                centerX: nodeShape.centerX,
                centerY: nodeShape.centerY
              });
            }
          });
          const regionShape = `      <children xmi:type="notation:Shape" xmi:id="${regionShapeId}" type="Region_Shape">
        <children xmi:type="notation:BasicCompartment" xmi:id="${subvertexCompartmentId}" type="Region_SubvertexCompartment">
${stateShapeFragments.join("\n")}
        </children>
        <element xmi:type="uml:Region" href="${umlFileNameEscaped}#${diagram.regionSemanticId ?? diagram.contextSemanticId ?? "sysml_package"}"/>
        <layoutConstraint xmi:type="notation:Bounds" xmi:id="${this.generateNotationId("bounds")}" width="${Math.max(600, columns * spacingX + 120)}" height="${Math.max(400, Math.ceil(nodes.length / columns) * spacingY + 120)}"/>
      </children>`;
          const stateMachineShape = `    <children xmi:type="notation:Shape" xmi:id="${stateMachineShapeId}" type="StateMachine_Shape">
      <children xmi:type="notation:DecorationNode" xmi:id="${this.generateNotationId("nameLabel")}" type="StateMachine_NameLabel"/>
      <children xmi:type="notation:BasicCompartment" xmi:id="${this.generateNotationId("regionCompartment")}" type="StateMachine_RegionCompartment">
${regionShape}
      </children>
      <element xmi:type="${diagram.contextType ?? "uml:StateMachine"}" href="${umlFileNameEscaped}#${diagram.contextSemanticId ?? "sysml_package"}"/>
      <layoutConstraint xmi:type="notation:Bounds" xmi:id="${this.generateNotationId("bounds")}" x="20" y="20" width="${Math.max(640, columns * spacingX + 160)}" height="${Math.max(440, Math.ceil(nodes.length / columns) * spacingY + 160)}"/>
    </children>`;
          const connectorFragments = diagram.edges.filter(edge => edge.kind === "transition").map(edge => this.createPapyrusStateMachineConnector(edge, umlFileNameEscaped, shapePositions)).filter(frag => !!frag);
          const diagramStyleId = this.generateNotationId("diagramStyle");
          const papyrusStyleId = this.generateNotationId("papyrusStyle");
          const compatibilityVersionId = this.generateNotationId("compatibilityVersion");
          const contextId = diagram.contextSemanticId ?? "sysml_package";
          const contextType = diagram.contextType ?? "uml:StateMachine";
          const styles = `  <styles xmi:type="notation:StringValueStyle" xmi:id="${compatibilityVersionId}" name="diagram_compatibility_version" stringValue="1.4.0"/>
  <styles xmi:type="notation:DiagramStyle" xmi:id="${diagramStyleId}"/>
  <styles xmi:type="style:PapyrusDiagramStyle" xmi:id="${papyrusStyleId}" diagramKindId="org.eclipse.papyrus.uml.diagram.stateMachine">
    <owner xmi:type="${contextType}" href="${umlFileNameEscaped}#${contextId}"/>
  </styles>`;
          const footer = `  <element xmi:type="${contextType}" href="${umlFileNameEscaped}#${contextId}"/>
</notation:Diagram>`;
          return `${header}${stateMachineShape}\n${connectorFragments.join("\n")}\n${styles}\n${footer}`;
        }
        createStateMachineNodeShape(element, umlFileNameEscaped, x, y) {
          const config = this.getStateMachineNodeShapeConfig(element.kind);
          if (!config) {
            return null;
          }
          const shapeId = this.generateNotationId("stateNodeShape");
          const boundsId = this.generateNotationId("bounds");
          const fragmentParts = [`        <children xmi:type="notation:Shape" xmi:id="${shapeId}" type="${config.shapeType}">`];
          if (config.labelType) {
            const labelId = this.generateNotationId("label");
            fragmentParts.push(`          <children xmi:type="notation:DecorationNode" xmi:id="${labelId}" type="${config.labelType}"/>`);
          }
          fragmentParts.push(`          <element xmi:type="${config.umlType}" href="${umlFileNameEscaped}#${element.semanticId}"/>`, `          <layoutConstraint xmi:type="notation:Bounds" xmi:id="${boundsId}" x="${x}" y="${y}" width="${config.width}" height="${config.height}"/>`, `        </children>`);
          return {
            fragment: fragmentParts.join("\n"),
            shapeId,
            centerX: x + config.width / 2,
            centerY: y + config.height / 2
          };
        }
        getStateMachineNodeShapeConfig(kind) {
          switch (kind) {
            case "state":
              return {
                shapeType: "State_Shape",
                umlType: "uml:State",
                width: 160,
                height: 80,
                labelType: "State_NameLabel"
              };
            case "pseudostate":
              return {
                shapeType: "Pseudostate_InitialShape",
                umlType: "uml:Pseudostate",
                width: 24,
                height: 24
              };
            case "finalState":
              return {
                shapeType: "FinalState_Shape",
                umlType: "uml:FinalState",
                width: 28,
                height: 28
              };
            default:
              return null;
          }
        }
        createPapyrusStateMachineConnector(edge, umlFileNameEscaped, shapePositions) {
          const sourceInfo = shapePositions.get(edge.sourceSemanticId);
          const targetInfo = shapePositions.get(edge.targetSemanticId);
          if (!sourceInfo || !targetInfo) {
            return null;
          }
          const connectorId = this.generateNotationId("transitionConnector");
          const fontStyleId = this.generateNotationId("transitionFont");
          const bendpointsId = this.generateNotationId("transitionBendpoints");
          const points = `[${Math.round(sourceInfo.centerX)}, ${Math.round(sourceInfo.centerY)}, -1, -1]$[${Math.round(targetInfo.centerX)}, ${Math.round(targetInfo.centerY)}, -1, -1]`;
          return `    <edges xmi:type="notation:Connector" xmi:id="${connectorId}" type="Transition_Edge" source="${sourceInfo.shapeId}" target="${targetInfo.shapeId}">
      <styles xmi:type="notation:FontStyle" xmi:id="${fontStyleId}"/>
      <element xmi:type="uml:Transition" href="${umlFileNameEscaped}#${edge.semanticId}"/>
      <bendpoints xmi:type="notation:RelativeBendpoints" xmi:id="${bendpointsId}" points="${points}"/>
    </edges>`;
        }
        buildPapyrusSequenceDiagram(diagram, umlFileNameEscaped) {
          const lifelines = diagram.elements.filter(el => el.kind === "lifeline");
          if (!lifelines.length) {
            return null;
          }
          const diagramId = diagram.id || this.generateNotationId("diagram");
          const header = `<?xml version="1.0" encoding="UTF-8"?>
<notation:Diagram xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:notation="http://www.eclipse.org/gmf/runtime/1.0.3/notation" xmlns:style="http://www.eclipse.org/papyrus/infra/gmfdiag/style" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" xmi:id="${diagramId}" type="PapyrusUMLSequenceDiagram" name="${diagram.name}" measurementUnit="Pixel">
`;
          const interactionShapeId = this.generateNotationId("interactionShape");
          const compartmentId = this.generateNotationId("interactionCompartment");
          const lifelineFragments = [];
          const shapePositions = new Map();
          const spacingX = 160;
          const lifelineWidth = 80;
          const lifelineHeight = 420;
          lifelines.forEach((lifeline, index) => {
            const x = 60 + index * spacingX;
            const y = 60;
            const shapeId = this.generateNotationId("lifelineShape");
            const boundsId = this.generateNotationId("bounds");
            const nameLabelId = this.generateNotationId("lifelineName");
            const floatingLabelId = this.generateNotationId("lifelineFloating");
            lifelineFragments.push(`        <children xmi:type="notation:Shape" xmi:id="${shapeId}" type="Lifeline_Shape">
          <children xmi:type="notation:DecorationNode" xmi:id="${nameLabelId}" type="Lifeline_NameLabel"/>
          <children xmi:type="notation:DecorationNode" xmi:id="${floatingLabelId}" type="Lifeline_FloatingNameLabel">
            <layoutConstraint xmi:type="notation:Location" xmi:id="${this.generateNotationId("loc")}" y="15"/>
          </children>
          <element xmi:type="uml:Lifeline" href="${umlFileNameEscaped}#${lifeline.semanticId}"/>
          <layoutConstraint xmi:type="notation:Bounds" xmi:id="${boundsId}" x="${x}" y="${y}" width="${lifelineWidth}" height="${lifelineHeight}"/>
        </children>`);
            shapePositions.set(lifeline.semanticId, {
              shapeId,
              centerX: x + lifelineWidth / 2,
              yTop: y,
              yBottom: y + lifelineHeight
            });
          });
          const interactionShape = `    <children xmi:type="notation:Shape" xmi:id="${interactionShapeId}" type="Interaction_Shape">
      <children xmi:type="notation:DecorationNode" xmi:id="${this.generateNotationId("interactionName")}" type="Interaction_NameLabel"/>
      <children xmi:type="notation:BasicCompartment" xmi:id="${compartmentId}" type="Interaction_SubfragmentCompartment">
${lifelineFragments.join("\n")}
      </children>
      <element xmi:type="${diagram.contextType ?? "uml:Interaction"}" href="${umlFileNameEscaped}#${diagram.contextSemanticId ?? "sysml_package"}"/>
      <layoutConstraint xmi:type="notation:Bounds" xmi:id="${this.generateNotationId("bounds")}" x="20" y="20" width="${Math.max(640, lifelines.length * spacingX + 120)}" height="${lifelineHeight + 120}"/>
    </children>`;
          const messageEdges = diagram.edges.filter(edge => edge.kind === "message");
          const connectorFragments = messageEdges.map((edge, index) => this.createPapyrusSequenceConnector(edge, umlFileNameEscaped, shapePositions, index)).filter(frag => !!frag);
          const diagramStyleId = this.generateNotationId("diagramStyle");
          const papyrusStyleId = this.generateNotationId("papyrusStyle");
          const compatibilityVersionId = this.generateNotationId("compatibilityVersion");
          const contextId = diagram.contextSemanticId ?? "sysml_package";
          const contextType = diagram.contextType ?? "uml:Interaction";
          const styles = `  <styles xmi:type="notation:StringValueStyle" xmi:id="${compatibilityVersionId}" name="diagram_compatibility_version" stringValue="1.4.0"/>
  <styles xmi:type="notation:DiagramStyle" xmi:id="${diagramStyleId}"/>
  <styles xmi:type="style:PapyrusDiagramStyle" xmi:id="${papyrusStyleId}" diagramKindId="org.eclipse.papyrus.uml.diagram.sequence">
    <owner xmi:type="${contextType}" href="${umlFileNameEscaped}#${contextId}"/>
  </styles>`;
          const footer = `  <element xmi:type="${contextType}" href="${umlFileNameEscaped}#${contextId}"/>
</notation:Diagram>`;
          return `${header}${interactionShape}\n${connectorFragments.join("\n")}\n${styles}\n${footer}`;
        }
        createPapyrusSequenceConnector(edge, umlFileNameEscaped, shapePositions, messageIndex) {
          const sourceInfo = shapePositions.get(edge.sourceSemanticId);
          const targetInfo = shapePositions.get(edge.targetSemanticId);
          if (!sourceInfo || !targetInfo) {
            return null;
          }
          const connectorId = this.generateNotationId("messageConnector");
          const fontStyleId = this.generateNotationId("messageFont");
          const bendpointsId = this.generateNotationId("messageBendpoints");
          const yOffset = sourceInfo.yTop + 80 + messageIndex * 30;
          const startX = Math.round(sourceInfo.centerX);
          const endX = Math.round(targetInfo.centerX);
          const points = `[${startX}, ${Math.round(yOffset)}, -1, -1]$[${endX}, ${Math.round(yOffset)}, -1, -1]`;
          return `    <edges xmi:type="notation:Connector" xmi:id="${connectorId}" type="Message_Edge" source="${sourceInfo.shapeId}" target="${targetInfo.shapeId}">
      <styles xmi:type="notation:FontStyle" xmi:id="${fontStyleId}"/>
      <element xmi:type="uml:Message" href="${umlFileNameEscaped}#${edge.semanticId}"/>
      <bendpoints xmi:type="notation:RelativeBendpoints" xmi:id="${bendpointsId}" points="${points}"/>
    </edges>`;
        }
        buildPapyrusRequirementDiagram(diagram, umlFileNameEscaped) {
          const nodes = diagram.elements.filter(el => ["requirement", "class"].includes(el.kind));
          if (!nodes.length) {
            return null;
          }
          const diagramId = diagram.id || this.generateNotationId("diagram");
          const header = `<?xml version="1.0" encoding="UTF-8"?>
<notation:Diagram xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:notation="http://www.eclipse.org/gmf/runtime/1.0.3/notation" xmlns:style="http://www.eclipse.org/papyrus/infra/gmfdiag/style" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" xmi:id="${diagramId}" type="RequirementDiagram" name="${diagram.name}" measurementUnit="Pixel">
`;
          const spacingX = 240;
          const spacingY = 140;
          const baseX = 40;
          const baseY = 40;
          const columns = Math.max(1, Math.ceil(Math.sqrt(nodes.length)));
          const shapeFragments = [];
          const shapePositions = new Map();
          nodes.forEach((element, index) => {
            const row = Math.floor(index / columns);
            const col = index % columns;
            const x = baseX + col * spacingX;
            const y = baseY + row * spacingY;
            const nodeShape = this.createRequirementNodeShape(element, umlFileNameEscaped, x, y);
            if (nodeShape) {
              shapeFragments.push(nodeShape.fragment);
              shapePositions.set(element.semanticId, {
                shapeId: nodeShape.shapeId,
                centerX: nodeShape.centerX,
                centerY: nodeShape.centerY
              });
            }
          });
          const connectorFragments = diagram.edges.filter(edge => edge.kind === "dependency").map(edge => this.createRequirementConnector(edge, umlFileNameEscaped, shapePositions)).filter(frag => !!frag);
          const diagramStyleId = this.generateNotationId("diagramStyle");
          const papyrusStyleId = this.generateNotationId("papyrusStyle");
          const compatibilityVersionId = this.generateNotationId("compatibilityVersion");
          const contextId = diagram.contextSemanticId ?? "sysml_package";
          const contextType = diagram.contextType ?? "uml:Package";
          const styles = `  <styles xmi:type="notation:StringValueStyle" xmi:id="${compatibilityVersionId}" name="diagram_compatibility_version" stringValue="1.4.0"/>
  <styles xmi:type="notation:DiagramStyle" xmi:id="${diagramStyleId}"/>
  <styles xmi:type="style:PapyrusDiagramStyle" xmi:id="${papyrusStyleId}" diagramKindId="org.eclipse.papyrus.sysml.diagram.requirement">
    <owner xmi:type="${contextType}" href="${umlFileNameEscaped}#${contextId}"/>
  </styles>`;
          const footer = `  <element xmi:type="${contextType}" href="${umlFileNameEscaped}#${contextId}"/>
</notation:Diagram>`;
          return `${header}${shapeFragments.join("\n")}\n${connectorFragments.join("\n")}\n${styles}\n${footer}`;
        }
        createRequirementNodeShape(element, umlFileNameEscaped, x, y) {
          const shapeId = this.generateNotationId("requirementShape");
          const boundsId = this.generateNotationId("bounds");
          let shapeType = "";
          let umlType = "";
          let width = 180;
          let height = 100;
          let labelType = "";
          if (element.kind === "requirement") {
            shapeType = "Requirement_Shape";
            umlType = "sysml:Requirement";
            labelType = "Requirement_NameLabel";
          } else if (element.kind === "class") {
            shapeType = "Class_Shape";
            umlType = "uml:Class";
            labelType = "Class_NameLabel";
            width = 140;
            height = 80;
          } else {
            return null;
          }
          const labelId = this.generateNotationId("label");
          const fragment = `    <children xmi:type="notation:Shape" xmi:id="${shapeId}" type="${shapeType}">
      <children xmi:type="notation:DecorationNode" xmi:id="${labelId}" type="${labelType}"/>
      <element xmi:type="${umlType}" href="${umlFileNameEscaped}#${element.semanticId}"/>
      <layoutConstraint xmi:type="notation:Bounds" xmi:id="${boundsId}" x="${x}" y="${y}" width="${width}" height="${height}"/>
    </children>`;
          return {
            fragment,
            shapeId,
            centerX: x + width / 2,
            centerY: y + height / 2
          };
        }
        createRequirementConnector(edge, umlFileNameEscaped, shapePositions) {
          const sourceInfo = shapePositions.get(edge.sourceSemanticId);
          const targetInfo = shapePositions.get(edge.targetSemanticId);
          if (!sourceInfo || !targetInfo) {
            return null;
          }
          const connectorId = this.generateNotationId("dependencyConnector");
          const fontStyleId = this.generateNotationId("dependencyFont");
          const bendpointsId = this.generateNotationId("dependencyBendpoints");
          const points = `[${Math.round(sourceInfo.centerX)}, ${Math.round(sourceInfo.centerY)}, -1, -1]$[${Math.round(targetInfo.centerX)}, ${Math.round(targetInfo.centerY)}, -1, -1]`;
          const elementType = edge.elementType ?? "uml:Dependency";
          return `    <edges xmi:type="notation:Connector" xmi:id="${connectorId}" type="Dependency_Edge" source="${sourceInfo.shapeId}" target="${targetInfo.shapeId}">
      <styles xmi:type="notation:FontStyle" xmi:id="${fontStyleId}"/>
      <element xmi:type="${elementType}" href="${umlFileNameEscaped}#${edge.semanticId}"/>
      <bendpoints xmi:type="notation:RelativeBendpoints" xmi:id="${bendpointsId}" points="${points}"/>
    </edges>`;
        }
        createPapyrusClassShape(shapeId, umlFileNameEscaped, semanticId, x, y, width, height) {
          const nameLabelId = this.generateNotationId("label");
          const boundsId = this.generateNotationId("bounds");
          return `  <children xmi:type="notation:Shape" xmi:id="${shapeId}" type="Class_Shape">
    <children xmi:type="notation:DecorationNode" xmi:id="${nameLabelId}" type="Class_NameLabel"/>
    <element xmi:type="uml:Class" href="${umlFileNameEscaped}#${semanticId}"/>
    <layoutConstraint xmi:type="notation:Bounds" xmi:id="${boundsId}" x="${x}" y="${y}" width="${width}" height="${height}"/>
  </children>\n`;
        }
        createPapyrusConnector(kind, umlFileNameEscaped, semanticId, sourceInfo, targetInfo) {
          const connectorType = kind === "generalization" ? {
            connector: "Generalization_Edge",
            uml: "Generalization"
          } : kind === "association" ? {
            connector: "Association_Edge",
            uml: "Association"
          } : null;
          if (!connectorType) {
            return null;
          }
          const connectorId = this.generateNotationId("connector");
          const fontStyleId = this.generateNotationId("font");
          const bendpointsId = this.generateNotationId("bendpoints");
          const startX = Math.round(sourceInfo.x + sourceInfo.width / 2);
          const startY = Math.round(sourceInfo.y + sourceInfo.height / 2);
          const endX = Math.round(targetInfo.x + targetInfo.width / 2);
          const endY = Math.round(targetInfo.y + targetInfo.height / 2);
          const points = `[${startX}, ${startY}, -1, -1]$[${endX}, ${endY}, -1, -1]`;
          return `  <edges xmi:type="notation:Connector" xmi:id="${connectorId}" type="${connectorType.connector}" source="${sourceInfo.shapeId}" target="${targetInfo.shapeId}">
    <styles xmi:type="notation:FontStyle" xmi:id="${fontStyleId}"/>
    <element xmi:type="uml:${connectorType.uml}" href="${umlFileNameEscaped}#${semanticId}"/>
    <bendpoints xmi:type="notation:RelativeBendpoints" xmi:id="${bendpointsId}" points="${points}"/>
  </edges>\n`;
        }
        buildPapyrusUseCaseDiagram(diagram, umlFileNameEscaped) {
          const actors = diagram.elements.filter(el => el.kind === "actor");
          const useCases = diagram.elements.filter(el => el.kind === "useCase");
          // Always create diagram, even if empty, so it's registered in .di file
          const diagramId = diagram.id || this.generateNotationId("diagram");
          const header = `<?xml version="1.0" encoding="UTF-8"?>
<notation:Diagram xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:notation="http://www.eclipse.org/gmf/runtime/1.0.3/notation" xmlns:style="http://www.eclipse.org/papyrus/infra/gmfdiag/style" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" xmi:id="${diagramId}" type="UseCase" name="${diagram.name}" measurementUnit="Pixel">
`;
          const actorShapeFragments = [];
          const useCaseShapeFragments = [];
          const edgeFragments = [];
          const actorShapeMap = new Map();
          const useCaseShapeMap = new Map();
          const actorWidth = 60;
          const actorHeight = 120;
          actors.forEach((actor, index) => {
            const shapeId = this.generateNotationId("actorShape");
            const nameLabelId = this.generateNotationId("actorName");
            const stereotypeLabelId = this.generateNotationId("actorStereo");
            const qualifiedLabelId = this.generateNotationId("actorQualified");
            const floatingLabelId = this.generateNotationId("actorFloating");
            const boundsId = this.generateNotationId("bounds");
            const x = 40;
            const y = 60 + index * (actorHeight + 20);
            actorShapeFragments.push(`    <children xmi:type="notation:Shape" xmi:id="${shapeId}" type="Actor_Shape">
      <children xmi:type="notation:DecorationNode" xmi:id="${nameLabelId}" type="Actor_NameLabel">
        <layoutConstraint xmi:type="notation:Location" xmi:id="${this.generateNotationId("loc")}" y="15"/>
      </children>
      <children xmi:type="notation:DecorationNode" xmi:id="${stereotypeLabelId}" type="Actor_StereotypeLabel">
        <layoutConstraint xmi:type="notation:Location" xmi:id="${this.generateNotationId("loc")}" x="20" y="100"/>
      </children>
      <children xmi:type="notation:DecorationNode" xmi:id="${qualifiedLabelId}" type="Actor_QualifiedNameLabel">
        <layoutConstraint xmi:type="notation:Location" xmi:id="${this.generateNotationId("loc")}" x="20" y="80"/>
      </children>
      <children xmi:type="notation:DecorationNode" xmi:id="${floatingLabelId}" type="Actor_FloatingNameLabel">
        <layoutConstraint xmi:type="notation:Location" xmi:id="${this.generateNotationId("loc")}" y="15"/>
      </children>
      <element xmi:type="uml:Actor" href="${umlFileNameEscaped}#${actor.semanticId}"/>
      <layoutConstraint xmi:type="notation:Bounds" xmi:id="${boundsId}" x="${x}" y="${y}" width="${actorWidth}" height="${actorHeight}"/>
    </children>`);
            actorShapeMap.set(actor.semanticId, {
              shapeId,
              centerX: x + actorWidth / 2,
              centerY: y + actorHeight / 2
            });
          });
          const subjectShapeId = this.generateNotationId("subject");
          const subjectNameId = this.generateNotationId("subjectName");
          const subjectFloatingId = this.generateNotationId("subjectFloating");
          const compartmentId = this.generateNotationId("subjectCompartment");
          const subjectX = 220;
          const subjectY = 20;
          const columns = Math.max(1, Math.ceil(Math.sqrt(Math.max(1, useCases.length))));
          const subjectWidth = Math.max(400, columns * 220);
          const subjectRows = Math.max(1, Math.ceil(Math.max(1, useCases.length) / columns));
          const subjectHeight = Math.max(300, subjectRows * 140);
          useCases.forEach((useCase, index) => {
            const shapeId = this.generateNotationId("usecaseShape");
            const nameLabelId = this.generateNotationId("usecaseName");
            const floatingLabelId = this.generateNotationId("usecaseFloating");
            const compartmentBoundsId = this.generateNotationId("bounds");
            const row = Math.floor(index / columns);
            const col = index % columns;
            const localX = 34 + col * 200;
            const localY = 34 + row * 120;
            const width = 161;
            const height = 61;
            useCaseShapeFragments.push(`      <children xmi:type="notation:Shape" xmi:id="${shapeId}" type="UseCase_Shape_CCN">
        <children xmi:type="notation:DecorationNode" xmi:id="${nameLabelId}" type="UseCase_NameLabel_CCN"/>
        <children xmi:type="notation:DecorationNode" xmi:id="${floatingLabelId}" type="UseCase_FloatingNameLabel_CCN">
          <layoutConstraint xmi:type="notation:Location" xmi:id="${this.generateNotationId("loc")}" y="15"/>
        </children>
        <children xmi:type="notation:BasicCompartment" xmi:id="${compartmentBoundsId}" type="UseCase_ExtensionPointCompartment_CCN">
          <styles xmi:type="notation:SortingStyle" xmi:id="${this.generateNotationId("style")}"/>
          <styles xmi:type="notation:FilteringStyle" xmi:id="${this.generateNotationId("style")}"/>
          <layoutConstraint xmi:type="notation:Bounds" xmi:id="${this.generateNotationId("bounds")}"/>
        </children>
        <element xmi:type="uml:UseCase" href="${umlFileNameEscaped}#${useCase.semanticId}"/>
        <layoutConstraint xmi:type="notation:Bounds" xmi:id="${this.generateNotationId("bounds")}" x="${localX}" y="${localY}" width="${width}" height="${height}"/>
      </children>`);
            useCaseShapeMap.set(useCase.semanticId, {
              shapeId,
              centerX: subjectX + localX + width / 2,
              centerY: subjectY + localY + height / 2
            });
          });
          const subjectShape = `    <children xmi:type="notation:Shape" xmi:id="${subjectShapeId}" type="Classifier_SubjectShape">
      <children xmi:type="notation:DecorationNode" xmi:id="${subjectNameId}" type="Classifier_NameLabel"/>
      <children xmi:type="notation:DecorationNode" xmi:id="${subjectFloatingId}" type="Classifier_FloatingNameLabel">
        <layoutConstraint xmi:type="notation:Location" xmi:id="${this.generateNotationId("loc")}" y="15"/>
      </children>
      <children xmi:type="notation:BasicCompartment" xmi:id="${compartmentId}" type="Classifier_UseCaseCompartment">
${useCaseShapeFragments.join("\n")}
      </children>
      <element xmi:type="uml:Package" href="${umlFileNameEscaped}#sysml_package"/>
      <layoutConstraint xmi:type="notation:Bounds" xmi:id="${this.generateNotationId("bounds")}" x="${subjectX}" y="${subjectY}" width="${subjectWidth}" height="${subjectHeight}"/>
    </children>`;
          const connectorFragments = diagram.edges.map(edge => {
            const info = this.buildPapyrusUseCaseConnector(edge, umlFileNameEscaped, actorShapeMap, useCaseShapeMap);
            return info;
          }).filter(frag => !!frag);
          const diagramStyleId = this.generateNotationId("diagramStyle");
          const papyrusStyleId = this.generateNotationId("papyrusStyle");
          const compatibilityVersionId = this.generateNotationId("compatibilityVersion");
          // Papyrus examples use the SysML package as the owner/element context for the main Use Case diagram
          const diagramKindId = this.getPapyrusDiagramKindId("useCase") || "org.eclipse.papyrus.uml.diagram.usecase";
          const styles = `  <styles xmi:type="notation:StringValueStyle" xmi:id="${compatibilityVersionId}" name="diagram_compatibility_version" stringValue="1.4.0"/>
  <styles xmi:type="notation:DiagramStyle" xmi:id="${diagramStyleId}"/>
  <styles xmi:type="style:PapyrusDiagramStyle" xmi:id="${papyrusStyleId}" diagramKindId="${diagramKindId}">
    <owner xmi:type="uml:Package" href="${umlFileNameEscaped}#sysml_package"/>
  </styles>`;
          const footer = `  <element xmi:type="uml:Package" href="${umlFileNameEscaped}#sysml_package"/>
</notation:Diagram>`;
          return `${header}${actorShapeFragments.join("\n")}\n${subjectShape}\n${connectorFragments.join("\n")}\n${styles}\n${footer}`;
        }
        buildPapyrusUseCaseConnector(edge, umlFileNameEscaped, actorShapes, useCaseShapes) {
          let connectorType = null;
          switch (edge.kind) {
            case "association":
              connectorType = "Association_Edge";
              break;
            case "generalization":
              connectorType = "Generalization_Edge";
              break;
            case "include":
              connectorType = "Include_Edge";
              break;
            case "extend":
              connectorType = "Extend_Edge";
              break;
            default:
              connectorType = null;
          }
          if (!connectorType) {
            return null;
          }
          const sourceInfo = actorShapes.get(edge.sourceSemanticId) ?? useCaseShapes.get(edge.sourceSemanticId);
          const targetInfo = actorShapes.get(edge.targetSemanticId) ?? useCaseShapes.get(edge.targetSemanticId);
          if (!sourceInfo || !targetInfo) {
            return null;
          }
          const connectorId = this.generateNotationId("connector");
          const fontStyleId = this.generateNotationId("font");
          const bendpointsId = this.generateNotationId("bendpoints");
          const points = `[${Math.round(sourceInfo.centerX)}, ${Math.round(sourceInfo.centerY)}, -1, -1]$[${Math.round(targetInfo.centerX)}, ${Math.round(targetInfo.centerY)}, -1, -1]`;
          const elementTag = this.getUseCaseConnectorElementTag(edge.kind);
          return `    <edges xmi:type="notation:Connector" xmi:id="${connectorId}" type="${connectorType}" source="${sourceInfo.shapeId}" target="${targetInfo.shapeId}">
      <styles xmi:type="notation:FontStyle" xmi:id="${fontStyleId}"/>
      <element xmi:type="uml:${elementTag}" href="${umlFileNameEscaped}#${edge.semanticId}"/>
      <bendpoints xmi:type="notation:RelativeBendpoints" xmi:id="${bendpointsId}" points="${points}"/>
    </edges>`;
        }
        buildPapyrusActivityDiagram(diagram, umlFileNameEscaped) {
          const activityNodes = diagram.elements.filter(el => ["activityNode", "activityInitial", "activityFinal", "activityDecision", "activityFork", "activityJoin"].includes(el.kind));
          if (!activityNodes.length) {
            return null;
          }
          const diagramId = diagram.id || this.generateNotationId("diagram");
          const header = `<?xml version="1.0" encoding="UTF-8"?>
<notation:Diagram xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:notation="http://www.eclipse.org/gmf/runtime/1.0.3/notation" xmlns:style="http://www.eclipse.org/papyrus/infra/gmfdiag/style" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML" xmi:id="${diagramId}" type="PapyrusUMLActivityDiagram" name="${diagram.name}" measurementUnit="Pixel">
`;
          const activityShapeId = this.generateNotationId("activityShape");
          const nodeCompartmentId = this.generateNotationId("activityNodeCompartment");
          const nameLabelId = this.generateNotationId("activityNameLabel");
          const keywordLabelId = this.generateNotationId("activityKeywordLabel");
          const compartmentFragments = [];
          const shapePositions = new Map();
          const columns = Math.max(1, Math.ceil(Math.sqrt(activityNodes.length)));
          const spacingX = 180;
          const spacingY = 120;
          const baseX = 60;
          const baseY = 80;
          activityNodes.forEach((element, index) => {
            const row = Math.floor(index / columns);
            const col = index % columns;
            const x = baseX + col * spacingX;
            const y = baseY + row * spacingY;
            const nodeShape = this.createPapyrusActivityNodeShape(element, umlFileNameEscaped, x, y);
            if (nodeShape) {
              compartmentFragments.push(nodeShape.fragment);
              shapePositions.set(element.semanticId, {
                shapeId: nodeShape.shapeId,
                centerX: nodeShape.centerX,
                centerY: nodeShape.centerY
              });
            }
          });
          const activityShape = `    <children xmi:type="notation:Shape" xmi:id="${activityShapeId}" type="Activity_Shape">
      <children xmi:type="notation:DecorationNode" xmi:id="${nameLabelId}" type="Activity_NameLabel"/>
      <children xmi:type="notation:DecorationNode" xmi:id="${keywordLabelId}" type="Activity_KeywordLabel"/>
      <children xmi:type="notation:BasicCompartment" xmi:id="${nodeCompartmentId}" type="Activity_ActivityNodeCompartment">
${compartmentFragments.join("\n")}
      </children>
      <element xmi:type="${diagram.contextType ?? "uml:Activity"}" href="${umlFileNameEscaped}#${diagram.contextSemanticId ?? "sysml_package"}"/>
      <layoutConstraint xmi:type="notation:Bounds" xmi:id="${this.generateNotationId("bounds")}" x="20" y="20" width="${Math.max(600, columns * spacingX + 120)}" height="${Math.max(400, Math.ceil(activityNodes.length / columns) * spacingY + 120)}"/>
    </children>`;
          const connectorFragments = diagram.edges.filter(edge => edge.kind === "controlFlow").map(edge => this.createPapyrusActivityConnector(edge, umlFileNameEscaped, shapePositions)).filter(frag => !!frag);
          const diagramStyleId = this.generateNotationId("diagramStyle");
          const papyrusStyleId = this.generateNotationId("papyrusStyle");
          const compatibilityVersionId = this.generateNotationId("compatibilityVersion");
          const contextId = diagram.contextSemanticId ?? "sysml_package";
          const contextType = diagram.contextType ?? "uml:Activity";
          const styles = `  <styles xmi:type="notation:StringValueStyle" xmi:id="${compatibilityVersionId}" name="diagram_compatibility_version" stringValue="1.4.0"/>
  <styles xmi:type="notation:DiagramStyle" xmi:id="${diagramStyleId}"/>
  <styles xmi:type="style:PapyrusDiagramStyle" xmi:id="${papyrusStyleId}" diagramKindId="org.eclipse.papyrus.uml.diagram.activity">
    <owner xmi:type="${contextType}" href="${umlFileNameEscaped}#${contextId}"/>
  </styles>`;
          const footer = `  <element xmi:type="${contextType}" href="${umlFileNameEscaped}#${contextId}"/>
</notation:Diagram>`;
          return `${header}${activityShape}\n${connectorFragments.join("\n")}\n${styles}\n${footer}`;
        }
        createPapyrusActivityNodeShape(element, umlFileNameEscaped, x, y) {
          const config = this.getActivityNodeShapeConfig(element.kind);
          if (!config) {
            return null;
          }
          const shapeId = this.generateNotationId("activityNodeShape");
          const boundsId = this.generateNotationId("bounds");
          const fragmentLines = [`        <children xmi:type="notation:Shape" xmi:id="${shapeId}" type="${config.shapeType}">`];
          if (config.labelType) {
            const labelId = this.generateNotationId("label");
            fragmentLines.push(`          <children xmi:type="notation:DecorationNode" xmi:id="${labelId}" type="${config.labelType}"/>`);
          }
          fragmentLines.push(`          <element xmi:type="${config.umlType}" href="${umlFileNameEscaped}#${element.semanticId}"/>`, `          <layoutConstraint xmi:type="notation:Bounds" xmi:id="${boundsId}" x="${x}" y="${y}" width="${config.width}" height="${config.height}"/>`, `        </children>`);
          return {
            fragment: fragmentLines.join("\n"),
            shapeId,
            centerX: x + config.width / 2,
            centerY: y + config.height / 2
          };
        }
        getActivityNodeShapeConfig(kind) {
          switch (kind) {
            case "activityInitial":
              return {
                shapeType: "InitialNode_Shape",
                umlType: "uml:InitialNode",
                width: 24,
                height: 24
              };
            case "activityFinal":
              return {
                shapeType: "ActivityFinalNode_Shape",
                umlType: "uml:ActivityFinalNode",
                width: 28,
                height: 28
              };
            case "activityDecision":
              return {
                shapeType: "DecisionNode_Shape",
                umlType: "uml:DecisionNode",
                width: 40,
                height: 40
              };
            case "activityFork":
              return {
                shapeType: "ForkNode_Shape",
                umlType: "uml:ForkNode",
                width: 100,
                height: 12
              };
            case "activityJoin":
              return {
                shapeType: "JoinNode_Shape",
                umlType: "uml:JoinNode",
                width: 12,
                height: 100
              };
            case "activityNode":
              return {
                shapeType: "OpaqueAction_Shape",
                umlType: "uml:OpaqueAction",
                width: 140,
                height: 50,
                labelType: "OpaqueAction_NameLabel"
              };
            default:
              return null;
          }
        }
        createPapyrusActivityConnector(edge, umlFileNameEscaped, shapePositions) {
          const sourceInfo = shapePositions.get(edge.sourceSemanticId);
          const targetInfo = shapePositions.get(edge.targetSemanticId);
          if (!sourceInfo || !targetInfo) {
            return null;
          }
          const connectorId = this.generateNotationId("activityConnector");
          const fontStyleId = this.generateNotationId("activityFont");
          const bendpointsId = this.generateNotationId("activityBendpoints");
          const points = `[${Math.round(sourceInfo.centerX)}, ${Math.round(sourceInfo.centerY)}, -1, -1]$[${Math.round(targetInfo.centerX)}, ${Math.round(targetInfo.centerY)}, -1, -1]`;
          return `    <edges xmi:type="notation:Connector" xmi:id="${connectorId}" type="ControlFlow_Edge" source="${sourceInfo.shapeId}" target="${targetInfo.shapeId}">
      <styles xmi:type="notation:FontStyle" xmi:id="${fontStyleId}"/>
      <element xmi:type="uml:ControlFlow" href="${umlFileNameEscaped}#${edge.semanticId}"/>
      <bendpoints xmi:type="notation:RelativeBendpoints" xmi:id="${bendpointsId}" points="${points}"/>
    </edges>`;
        }
        getUseCaseConnectorElementTag(kind) {
          switch (kind) {
            case "association":
              return "Association";
            case "generalization":
              return "Generalization";
            case "include":
              return "Include";
            case "extend":
              return "Extend";
            default:
              return "Dependency";
          }
        }
        wrapPapyrusNotation(diagrams) {
          // Papyrus expects .notation file to start directly with <notation:Diagram>
          // If multiple diagrams, wrap in XMI; if single, add XML declaration and return as-is
          if (diagrams.length === 1) {
            // Single diagram: add XML declaration if not already present
            const diagram = diagrams[0];
            if (diagram.startsWith("<?xml")) {
              return diagram;
            }
            return `<?xml version="1.0" encoding="UTF-8"?>\n${diagram}`;
          }
          // Multiple diagrams need XMI wrapper
          const header = `<?xml version="1.0" encoding="UTF-8"?>
<xmi:XMI xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:notation="http://www.eclipse.org/gmf/runtime/1.0.3/notation" xmlns:style="http://www.eclipse.org/papyrus/infra/gmfdiag/style" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML">
`;
          const footer = "</xmi:XMI>";
          // Remove XML declarations from individual diagrams when wrapping and indent them
          // Note: Keep namespace declarations on <notation:Diagram> tags as in the working examples
          const cleanedDiagrams = diagrams.map(d => {
            // Remove XML declaration if present
            let cleaned = d.trim();
            const xmlStart = cleaned.indexOf("<?xml");
            if (xmlStart === 0) {
              const xmlEnd = cleaned.indexOf("?>");
              if (xmlEnd !== -1) {
                cleaned = cleaned.substring(xmlEnd + 2).trim();
              }
            }
            // Indent the entire diagram content (2 spaces for XMI children)
            return cleaned.split("\n").map(line => line.trim() === "" ? line : `  ${line}`).join("\n");
          });
          return `${header}${cleanedDiagrams.join("\n")}\n${footer}`;
        }
        applySysmlProfile(umlContent) {
          if (umlContent.includes("pathmap://SysML16_PROFILES/SysML.profile.uml")) {
            return umlContent;
          }
          // Canonical order: profileApplication comes after packagedElement, before closing </uml:Model>
          const profileApplication = `    <profileApplication xmi:type="uml:ProfileApplication" xmi:id="${this.generateNotationId("profileApp")}">
      <eAnnotations xmi:type="ecore:EAnnotation" xmi:id="${this.generateNotationId("profileAnn")}" source="http://www.eclipse.org/uml2/2.0.0/UML">
        <references xmi:type="ecore:EPackage" href="http://www.eclipse.org/papyrus/sysml/1.6/SysML#/"/>
      </eAnnotations>
      <appliedProfile xmi:type="uml:Profile" href="pathmap://SysML16_PROFILES/SysML.profile.uml#SysML"/>
    </profileApplication>`;
          const closingTag = "</uml:Model>";
          const index = umlContent.lastIndexOf(closingTag);
          if (index === -1) {
            return umlContent;
          }
          // Insert profileApplication before closing tag, with proper indentation
          return umlContent.slice(0, index) + profileApplication + "\n" + umlContent.slice(index);
        }
        buildPapyrusDi(diagramMetadata) {
          const architectureContext = "org.eclipse.papyrus.sysml.architecture.SysML16";
          // Generate ownedArchitecture with ownedRepresentation entries for each diagram
          // This ensures diagrams are properly registered in Papyrus
          const architectureId = this.generateNotationId("architecture");
          const representations = diagramMetadata.map(meta => {
            const kindId = this.getPapyrusDiagramKindId(meta.diagramType);
            if (!kindId) {
              return null;
            }
            const representationId = this.generateNotationId("representation");
            return `    <ownedRepresentation xmi:id="${representationId}" kindId="${kindId}" representationID="${meta.id}" name="${this.escapeXml(meta.name)}"/>`;
          }).filter(rep => rep !== null);
          if (representations.length === 0) {
            // Fallback to minimal structure if no diagrams
            return `<?xml version="1.0" encoding="UTF-8"?>
<architecture:ArchitectureDescription xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:architecture="http://www.eclipse.org/papyrus/infra/core/architecture" contextId="${architectureContext}"/>
`;
          }
          return `<?xml version="1.0" encoding="UTF-8"?>
<architecture:ArchitectureDescription xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:architecture="http://www.eclipse.org/papyrus/infra/core/architecture" contextId="org.eclipse.papyrus.infra.services.edit.TypeContext">
  <ownedArchitecture xmi:id="${architectureId}" architectureContext="${architectureContext}" name="OPCloud Export">
${representations.join("\n")}
  </ownedArchitecture>
</architecture:ArchitectureDescription>
`;
        }
        getPapyrusDiagramKindId(diagramType) {
          switch (diagramType) {
            case "blockDefinition":
              // Use the SysML16 block definition diagram kind ID
              return "org.eclipse.papyrus.sysml16.diagram.blockdefinition";
            case "useCase":
              return "org.eclipse.papyrus.uml.diagram.usecase";
            case "activity":
              return "org.eclipse.papyrus.uml.diagram.activity";
            case "stateMachine":
              return "org.eclipse.papyrus.uml.diagram.stateMachine";
            case "sequence":
              return "org.eclipse.papyrus.uml.diagram.sequence";
            case "requirement":
              return "org.eclipse.papyrus.sysml.diagram.requirement";
            default:
              return null;
          }
        }
        generateNotationId(prefix = "notation") {
          return `${prefix}_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
        }
        generateXmiFooter() {
          return `</xmi:XMI>`;
        }
        indent(content, spaces) {
          const indent = " ".repeat(spaces);
          return content.split("\n").map(line => line.trim() ? indent + line : "").filter(line => line).join("\n");
        }
        escapeXml(value) {
          if (!value) {
            return "";
          }
          return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
        }
        static #_ = (() => this.ɵfac = function SysMLXmiGeneratorService_Factory(__ngFactoryType__) {
          return new (__ngFactoryType__ || SysMLXmiGeneratorService)(core /* ɵɵinject */.KVO(UseCaseDiagramConverter), core /* ɵɵinject */.KVO(BlockDefinitionDiagramConverter), core /* ɵɵinject */.KVO(ActivityDiagramConverter), core /* ɵɵinject */.KVO(StateMachineDiagramConverter), core /* ɵɵinject */.KVO(SequenceDiagramConverter), core /* ɵɵinject */.KVO(RequirementDiagramConverter));
        })();
        static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
          token: SysMLXmiGeneratorService,
          factory: SysMLXmiGeneratorService.ɵfac,
          providedIn: "root"
        }))();
      }
      return SysMLXmiGeneratorService;
    })();