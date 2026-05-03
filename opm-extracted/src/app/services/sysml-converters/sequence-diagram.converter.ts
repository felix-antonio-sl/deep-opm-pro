// Source: decompiled/deobfuscated.js
// Original path: ./src/app/services/sysml-converters/sequence-diagram.converter.ts
// Extracted by opm-extracted/tools/extract.mjs

    let SequenceDiagramConverter = /*#__PURE__*/(() => {
      class SequenceDiagramConverter extends BaseDiagramConverter {
        convert(model, progressCallback) {
          var _this = this;
          return (0, default)(function* () {
            _this.model = model; // Store model reference for resolving logical elements
            const modelElements = [];
            const diagramElements = [];
            const relations = _this.getAllLogicalRelations(model);
            const processes = _this.getAllLogicalProcesses(model);
            const candidates = processes.filter(proc => _this.getDirectSubProcesses(proc).length > 0);
            const metadata = [];
            // Track created interactions by logical ID to ensure unique names
            const createdInteractions = new Map(); // Map: process lid -> interaction name
            const processedProcesses = new Set();
            for (let i = 0; i < candidates.length; i++) {
              const process = candidates[i];
              if (processedProcesses.has(process.lid)) {
                continue;
              }
              const result = _this.buildSequenceForProcess(process, relations, createdInteractions);
              if (result) {
                modelElements.push(result.model);
                diagramElements.push(result.diagram);
                metadata.push(result.metadata);
                processedProcesses.add(process.lid);
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
        buildSequenceForProcess(process, relations, createdInteractions) {
          const lifelineObjects = this.collectLifelineObjects(process, relations);
          if (!lifelineObjects.length) {
            return null;
          }
          const lifelineIds = new Map();
          const lifelineRecords = [];
          const diagramElementMetadata = [];
          const diagramEdgeMetadata = [];
          lifelineObjects.forEach(obj => {
            const lifelineId = this.generateId("lifeline");
            lifelineIds.set(obj.lid, lifelineId);
            lifelineRecords.push({
              object: obj,
              id: lifelineId,
              fragment: `        <lifeline xmi:type="uml:Lifeline" xmi:id="${lifelineId}" name="${this.escapeXml(obj.getBareName())}"/>`
            });
          });
          // Find parent process source to use as the main source for this sequence diagram
          // This ensures sub-processes use the parent's source (e.g., Product) rather than finding their own
          const parentProcess = this.getParentProcess(process);
          let parentSource;
          if (parentProcess) {
            // Find source from parent process - collect all possible lifelines from parent first
            const parentLifelineObjects = this.collectLifelineObjects(parentProcess, relations);
            const parentLifelineIds = new Map();
            parentLifelineObjects.forEach(obj => {
              parentLifelineIds.set(obj.lid, "temp"); // Temporary ID, we'll get real one if needed
            });
            // Also add parent's lifelines to current lifelines if not already present
            // This ensures objects like Product (connected to parent) are included
            parentLifelineObjects.forEach(obj => {
              if (!lifelineObjects.find(existing => existing.lid === obj.lid)) {
                lifelineObjects.push(obj);
                const lifelineId = this.generateId("lifeline");
                lifelineIds.set(obj.lid, lifelineId);
                lifelineRecords.push({
                  object: obj,
                  id: lifelineId,
                  fragment: `        <lifeline xmi:type="uml:Lifeline" xmi:id="${lifelineId}" name="${this.escapeXml(obj.getBareName())}"/>`
                });
              }
            });
            // Now find the parent's source using the parent's lifelines
            const parentSourceCandidate = this.findPreferredSource(parentProcess, relations, parentLifelineIds, undefined);
            if (parentSourceCandidate) {
              // Check if parent source is already in lifelines, if not, add it at the beginning
              const parentSourceInLifelines = lifelineObjects.find(obj => obj.lid === parentSourceCandidate.lid);
              if (!parentSourceInLifelines) {
                lifelineObjects.unshift(parentSourceCandidate); // Add at beginning
                const parentLifelineId = this.generateId("lifeline");
                lifelineIds.set(parentSourceCandidate.lid, parentLifelineId);
                lifelineRecords.unshift({
                  object: parentSourceCandidate,
                  id: parentLifelineId,
                  fragment: `        <lifeline xmi:type="uml:Lifeline" xmi:id="${parentLifelineId}" name="${this.escapeXml(parentSourceCandidate.getBareName())}"/>`
                });
                diagramElementMetadata.unshift({
                  semanticId: parentLifelineId,
                  kind: "lifeline"
                });
              } else {
                // Parent source is already in lifelines, get its ID
                const existingRecord = lifelineRecords.find(rec => rec.object.lid === parentSourceCandidate.lid);
                if (existingRecord) {
                  lifelineIds.set(parentSourceCandidate.lid, existingRecord.id);
                }
              }
              parentSource = parentSourceCandidate;
            }
          }
          const messageResult = this.buildMessages(process, relations, lifelineIds, parentSource, true);
          const messages = messageResult.messages;
          if (!messages.length) {
            return null;
          }
          const usedLifelineIds = new Set();
          messages.forEach(message => {
            usedLifelineIds.add(message.sourceLifelineId);
            usedLifelineIds.add(message.targetLifelineId);
          });
          const activeLifelines = lifelineRecords.filter(record => usedLifelineIds.has(record.id));
          if (!activeLifelines.length) {
            return null;
          }
          const lifelineElements = activeLifelines.map(record => record.fragment);
          activeLifelines.forEach(record => {
            diagramElementMetadata.push({
              semanticId: record.id,
              kind: "lifeline"
            });
          });
          // Create occurrence specifications first (they must exist before messages reference them)
          const occurrenceSpecs = messages.flatMap(message => [`        <fragment xmi:type="uml:MessageOccurrenceSpecification" xmi:id="${message.sendEventId}" covered="${message.sourceLifelineId}"/>`, `        <fragment xmi:type="uml:MessageOccurrenceSpecification" xmi:id="${message.receiveEventId}" covered="${message.targetLifelineId}"/>`]);
          // Messages reference the occurrence specs via sendEvent and receiveEvent attributes
          // Modelio may require explicit ownedMessage container
          const messageElements = messages.map(message => {
            diagramEdgeMetadata.push({
              semanticId: message.id,
              kind: "message",
              sourceSemanticId: message.sourceLifelineId,
              targetSemanticId: message.targetLifelineId
            });
            return `        <ownedMessage xmi:type="uml:Message" xmi:id="${message.id}" name="${this.escapeXml(message.name)}" messageSort="${message.sort}" sendEvent="${message.sendEventId}" receiveEvent="${message.receiveEventId}"/>`;
          });
          const interactionId = this.generateId("interaction");
          // Ensure unique interaction name by including logical ID if duplicate exists
          // This prevents R2170 error: "The name of a Behavior must be unique in its NameSpace"
          let baseName = process.getBareName();
          let interactionName = this.escapeXml(baseName);
          // Check if we've already created an interaction with this name
          const existingName = createdInteractions.get(process.lid);
          if (existingName) {
            // Use the same name if it's the same logical process
            interactionName = existingName;
          } else {
            // Check if another process with the same name already exists
            const nameExists = Array.from(createdInteractions.values()).includes(interactionName);
            if (nameExists) {
              // Make it unique by appending a short version of the logical ID
              const shortLid = process.lid.substring(0, 8);
              interactionName = this.escapeXml(`${baseName} (${shortLid})`);
            }
            createdInteractions.set(process.lid, interactionName);
          }
          // Build interaction with proper containment: lifelines, fragments (occurrence specs), then owned messages
          const interactionParts = [];
          interactionParts.push(...lifelineElements);
          interactionParts.push(...occurrenceSpecs);
          // Messages must be explicitly owned by Interaction
          messageElements.forEach(msg => {
            interactionParts.push(msg);
          });
          const modelElement = `      <packagedElement xmi:type="uml:Interaction" xmi:id="${interactionId}" name="${interactionName} Interaction">
${interactionParts.join("\n")}
      </packagedElement>`;
          const diagramId = this.generateId("diagram");
          const diagramElement = `      <ownedDiagram xmi:type="uml:SequenceDiagram" xmi:id="${diagramId}" name="${interactionName} Sequence Diagram">
        <element xmi:idref="${interactionId}"/>
      </ownedDiagram>`;
          diagramElementMetadata.push({
            semanticId: interactionId,
            kind: "interaction"
          });
          return {
            model: modelElement,
            diagram: diagramElement,
            metadata: {
              id: diagramId,
              name: `${interactionName} Sequence Diagram`,
              diagramType: "sequence",
              contextSemanticId: interactionId,
              contextType: "uml:Interaction",
              elements: diagramElementMetadata,
              edges: diagramEdgeMetadata
            }
          };
        }
        collectLifelineObjects(process, relations) {
          const scope = this.collectProcessHierarchy(process);
          const scopeIds = new Set(scope.map(proc => proc.lid));
          const lifelines = new Map();
          // Collect objects from current process and all sub-processes
          relations.forEach(rel => {
            if (!this.isProceduralLink(rel.linkType)) {
              return;
            }
            // Resolve source and target logical elements (they might be strings/visual IDs)
            let sourceLogical = this.resolveLogicalElement(rel.sourceLogicalElement, rel);
            let targetLogicals = (rel.targetLogicalElements || []).map(target => this.resolveLogicalElement(target, rel)).filter(el => !!el);
            // If source/targets are still not resolved, try to get them from visual elements
            if (!sourceLogical && rel.visualElements && rel.visualElements.length > 0) {
              const firstVisual = rel.visualElements[0];
              if (firstVisual && firstVisual.sourceVisualElement) {
                sourceLogical = firstVisual.sourceVisualElement.logicalElement;
              }
            }
            if (targetLogicals.length === 0 && rel.visualElements && rel.visualElements.length > 0) {
              for (const visual of rel.visualElements) {
                for (const target of visual.targetVisualElements || []) {
                  if (target.targetVisualElement && target.targetVisualElement.logicalElement) {
                    const resolved = target.targetVisualElement.logicalElement;
                    if (!targetLogicals.find(t => t.lid === resolved.lid)) {
                      targetLogicals.push(resolved);
                    }
                  }
                }
              }
            }
            // Check if relation involves any process in scope
            const involvesProcess = sourceLogical instanceof OpmLogicalProcess && scopeIds.has(sourceLogical.lid) || targetLogicals.some(target => target instanceof OpmLogicalProcess && scopeIds.has(target.lid));
            if (!involvesProcess) {
              return;
            }
            // Collect all endpoints (source and targets)
            const endpoints = sourceLogical ? [sourceLogical, ...targetLogicals] : targetLogicals;
            endpoints.forEach(endpoint => {
              const obj = this.getOwningObjectFromElement(endpoint);
              if (obj) {
                lifelines.set(obj.lid, obj);
              }
            });
          });
          // For sub-processes, also include objects connected to parent processes
          // This ensures that objects like Product (connected to parent "Product Handling") 
          // are included in sub-process sequence diagrams
          const parentProcess = this.getParentProcess(process);
          if (parentProcess) {
            const parentLid = parentProcess.lid;
            relations.forEach(rel => {
              if (!this.isProceduralLink(rel.linkType)) {
                return;
              }
              // Resolve source and target logical elements (they might be strings/visual IDs)
              let sourceLogical = this.resolveLogicalElement(rel.sourceLogicalElement, rel);
              let targetLogicals = (rel.targetLogicalElements || []).map(target => this.resolveLogicalElement(target, rel)).filter(el => !!el);
              // If source/targets are still not resolved, try to get them from visual elements
              if (!sourceLogical && rel.visualElements && rel.visualElements.length > 0) {
                const firstVisual = rel.visualElements[0];
                if (firstVisual && firstVisual.sourceVisualElement) {
                  sourceLogical = firstVisual.sourceVisualElement.logicalElement;
                }
              }
              if (targetLogicals.length === 0 && rel.visualElements && rel.visualElements.length > 0) {
                for (const visual of rel.visualElements) {
                  for (const target of visual.targetVisualElements || []) {
                    if (target.targetVisualElement && target.targetVisualElement.logicalElement) {
                      const resolved = target.targetVisualElement.logicalElement;
                      if (!targetLogicals.find(t => t.lid === resolved.lid)) {
                        targetLogicals.push(resolved);
                      }
                    }
                  }
                }
              }
              // Use logical ID comparison instead of object reference
              const involvesParent = sourceLogical instanceof OpmLogicalProcess && sourceLogical.lid === parentLid || targetLogicals.some(target => target instanceof OpmLogicalProcess && target.lid === parentLid);
              if (!involvesParent) {
                return;
              }
              const endpoints = sourceLogical ? [sourceLogical, ...targetLogicals] : targetLogicals;
              endpoints.forEach(endpoint => {
                const obj = this.getOwningObjectFromElement(endpoint);
                // Only add if it's an object (not a process) and not already included
                if (obj && !(endpoint instanceof OpmLogicalProcess)) {
                  lifelines.set(obj.lid, obj);
                }
              });
            });
          }
          return Array.from(lifelines.values());
        }
        collectProcessHierarchy(process) {
          const result = [];
          const traverse = proc => {
            result.push(proc);
            this.getDirectSubProcesses(proc).forEach(child => traverse(child));
          };
          traverse(process);
          return result;
        }
        buildMessages(process, relations, lifelineIds, parentSource, isTopLevel = false) {
          const messages = [];
          const handledDestinations = new Set();
          const localMessages = [];
          // If parentSource is provided and exists in lifelines, use it directly
          // This ensures sub-processes use the parent's source (e.g., Product) rather than finding their own
          // Only if parentSource is not available, find the preferred source from the current process
          let sourceObject;
          if (parentSource && lifelineIds.has(parentSource.lid)) {
            // Use parent source directly - this is the correct behavior for sub-processes
            sourceObject = parentSource;
          } else if (!parentSource && isTopLevel) {
            // Only for top-level processes, find source from current process
            sourceObject = this.findPreferredSource(process, relations, lifelineIds, undefined);
          } else {
            // For sub-processes without parent source, still try to find one
            sourceObject = this.findPreferredSource(process, relations, lifelineIds, parentSource);
          }
          const sourceId = sourceObject ? lifelineIds.get(sourceObject.lid) : undefined;
          // First, process child processes to determine which destinations they handle
          // According to thesis: if child has message to same destination as parent, only child message is created (more specific)
          const orderedChildren = this.getDirectSubProcesses(process).sort((a, b) => this.getPrimaryVisualY(a) - this.getPrimaryVisualY(b));
          const childMessages = [];
          orderedChildren.forEach(child => {
            const childResult = this.buildMessages(child, relations, lifelineIds, sourceObject || parentSource, false);
            childResult.messages.forEach(msg => {
              childMessages.push(msg);
              const destinationId = this.getDestinationIdFromMessage(msg, lifelineIds);
              if (destinationId) {
                handledDestinations.add(destinationId);
              }
            });
            childResult.handledDestinations.forEach(id => handledDestinations.add(id));
          });
          // Then process this process's messages
          if (sourceId) {
            const processName = this.escapeXml(process.getBareName());
            // Create self-message only for the top-level process
            if (isTopLevel) {
              const selfMessageId = this.generateId("message");
              const selfSendEventId = this.generateId("send");
              const selfReceiveEventId = this.generateId("receive");
              messages.push({
                id: selfMessageId,
                name: processName,
                sort: "synchCall",
                sourceLifelineId: sourceId,
                targetLifelineId: sourceId,
                sendEventId: selfSendEventId,
                receiveEventId: selfReceiveEventId
              });
            }
            // Create messages from this process to its destinations
            // Skip destinations already handled by children (more specific)
            const destinations = this.findDestinations(process, relations, lifelineIds);
            destinations.forEach(dest => {
              const lifelineId = lifelineIds.get(dest.object.lid);
              if (!lifelineId || lifelineId === sourceId) {
                return;
              }
              // Skip if child already handles this destination
              if (handledDestinations.has(dest.object.lid)) {
                return;
              }
              const messageId = this.generateId("message");
              const sendEventId = this.generateId("send");
              const receiveEventId = this.generateId("receive");
              localMessages.push({
                destinationId: dest.object.lid,
                spec: {
                  id: messageId,
                  name: processName,
                  sort: this.getMessageSort(dest.type),
                  sourceLifelineId: sourceId,
                  targetLifelineId: lifelineId,
                  sendEventId,
                  receiveEventId
                }
              });
              handledDestinations.add(dest.object.lid);
            });
          }
          // Build final message list: parent messages first, then child messages
          // This ensures correct ordering: parent process messages appear before sub-process messages
          localMessages.forEach(entry => {
            messages.push(entry.spec);
          });
          messages.push(...childMessages);
          return {
            messages,
            handledDestinations
          };
        }
        findPreferredSource(process, relations, lifelineIds, fallback) {
          // If fallback (parent source) is provided and exists in lifelines, prioritize it
          if (fallback && lifelineIds.has(fallback.lid)) {
            return fallback;
          }
          const primaryBuckets = [{
            types: [linkType.Agent]
          }, {
            types: [linkType.Instrument],
            event: true
          }, {
            types: [linkType.UndertimeException, linkType.OvertimeException, linkType.UndertimeOvertimeException]
          }, {
            types: [linkType.Consumption],
            event: true
          }];
          const secondaryBuckets = [{
            types: [linkType.Instrument]
          }, {
            types: [linkType.Effect]
          }];
          // First try to find source from current process hierarchy (including sub-processes)
          const fromCurrent = this.pickSourceFromBuckets(process, relations, lifelineIds, primaryBuckets);
          if (fromCurrent) {
            return fromCurrent;
          }
          // If not found, look recursively at ancestors
          const ancestorSource = this.findAncestorSource(process, relations, lifelineIds, new Set());
          if (ancestorSource) {
            return ancestorSource;
          }
          // Try secondary buckets
          const secondary = this.pickSourceFromBuckets(process, relations, lifelineIds, secondaryBuckets);
          if (secondary) {
            return secondary;
          }
          // Last resort: use fallback (parent source) even if not in lifelines yet
          // This handles cases where parent source should be used but wasn't added to lifelines
          return fallback;
        }
        pickSourceFromBuckets(process, relations, lifelineIds, buckets) {
          // Collect all candidates first, then prioritize non-Actor objects
          const candidates = [];
          const scope = this.collectProcessHierarchy(process);
          const scopeIds = new Set(scope.map(proc => proc.lid));
          for (const priority of buckets) {
            // Look for relations where the process (or any sub-process) is the target
            const candidate = relations.find(rel => {
              // Resolve target logical elements (they might be strings/visual IDs)
              let targetLogicals = (rel.targetLogicalElements || []).map(target => this.resolveLogicalElement(target, rel)).filter(el => !!el);
              // If targets are still not resolved, try to get them from visual elements
              if (targetLogicals.length === 0 && rel.visualElements && rel.visualElements.length > 0) {
                for (const visual of rel.visualElements) {
                  for (const target of visual.targetVisualElements || []) {
                    if (target.targetVisualElement && target.targetVisualElement.logicalElement) {
                      const resolved = target.targetVisualElement.logicalElement;
                      if (!targetLogicals.find(t => t.lid === resolved.lid)) {
                        targetLogicals.push(resolved);
                      }
                    }
                  }
                }
              }
              const targetsProcess = targetLogicals.some(target => target instanceof OpmLogicalProcess && scopeIds.has(target.lid));
              return targetsProcess && priority.types.includes(rel.linkType) && (priority.event === undefined || this.hasEventFlag(rel) === priority.event);
            });
            if (candidate) {
              // Resolve source logical element (might be string/visual ID)
              let sourceLogical = this.resolveLogicalElement(candidate.sourceLogicalElement, candidate);
              // If source is still not resolved, try to get it from visual elements
              if (!sourceLogical && candidate.visualElements && candidate.visualElements.length > 0) {
                const firstVisual = candidate.visualElements[0];
                if (firstVisual && firstVisual.sourceVisualElement) {
                  sourceLogical = firstVisual.sourceVisualElement.logicalElement;
                }
              }
              const obj = this.getOwningObjectFromElement(sourceLogical);
              // Include object even if not yet in lifelines - we'll add it if needed
              if (obj) {
                candidates.push(obj);
              }
            }
          }
          // Filter to only objects that are in lifelines (or will be added)
          const availableCandidates = candidates.filter(obj => lifelineIds.has(obj.lid));
          // Prioritize non-Actor objects (non-environmental) over Actors (environmental)
          const nonActors = availableCandidates.filter(obj => !this.isEnvironmentalLogicalObject(obj));
          if (nonActors.length > 0) {
            return nonActors[0];
          }
          // If no non-Actors found, return first candidate (Actor)
          if (availableCandidates.length > 0) {
            return availableCandidates[0];
          } else {
            return undefined;
          }
        }
        resolveLogicalElement(element, relation) {
          if (!element) {
            // If element is undefined/null, try to get it from relation's visual elements
            if (relation && relation.visualElements && relation.visualElements.length > 0) {
              // Try to get source from first visual element
              const firstVisual = relation.visualElements[0];
              if (firstVisual && firstVisual.sourceVisualElement) {
                return firstVisual.sourceVisualElement.logicalElement;
              }
            }
            return undefined;
          }
          // If already a logical element, return it
          if (element instanceof OpmLogicalElement) {
            return element;
          }
          // If it's a string (visual ID or logical ID), try to resolve it
          if (typeof element === "string" && this.model) {
            // First try as logical ID
            const byLid = this.model.logicalElements.find(el => el.lid === element);
            if (byLid) {
              return byLid;
            }
            // Then try as visual ID
            const byVisualId = this.model.getLogicalElementByVisualId(element);
            if (byVisualId) {
              return byVisualId;
            }
            // If still not found and we have a relation, try to find it in visual elements
            if (relation && relation.visualElements) {
              for (const visual of relation.visualElements) {
                if (visual.sourceVisualElement && (visual.sourceVisualElement.id === element || visual.sourceVisualElement.logicalElement?.lid === element)) {
                  return visual.sourceVisualElement.logicalElement;
                }
                for (const target of visual.targetVisualElements || []) {
                  if (target.targetVisualElement && (target.targetVisualElement.id === element || target.targetVisualElement.logicalElement?.lid === element)) {
                    return target.targetVisualElement.logicalElement;
                  }
                }
              }
            }
          }
          return undefined;
        }
        findAncestorSource(process, relations, lifelineIds, visited) {
          if (visited.has(process.lid)) {
            return undefined;
          }
          visited.add(process.lid);
          const parent = this.getParentProcess(process);
          if (!parent) {
            return undefined;
          }
          const candidate = this.pickSourceFromBuckets(parent, relations, lifelineIds, [{
            types: [linkType.Agent]
          }, {
            types: [linkType.Instrument],
            event: true
          }, {
            types: [linkType.UndertimeException, linkType.OvertimeException, linkType.UndertimeOvertimeException]
          }, {
            types: [linkType.Consumption],
            event: true
          }]);
          if (candidate) {
            return candidate;
          }
          return this.findAncestorSource(parent, relations, lifelineIds, visited);
        }
        findDestinations(process, relations, lifelineIds) {
          const allowedTypes = new Set([linkType.Consumption, linkType.Result, linkType.Instrument, linkType.Effect]);
          const destinations = [];
          const processLid = process.lid;
          relations.forEach(rel => {
            // Resolve source logical element (might be string/visual ID)
            let sourceLogical = this.resolveLogicalElement(rel.sourceLogicalElement, rel);
            // If source is still not resolved, try to get it from visual elements
            if (!sourceLogical && rel.visualElements && rel.visualElements.length > 0) {
              const firstVisual = rel.visualElements[0];
              if (firstVisual && firstVisual.sourceVisualElement) {
                sourceLogical = firstVisual.sourceVisualElement.logicalElement;
              }
            }
            // Use logical ID comparison instead of object reference
            if (!(sourceLogical instanceof OpmLogicalProcess) || sourceLogical.lid !== processLid) {
              return;
            }
            if (!allowedTypes.has(rel.linkType)) {
              return;
            }
            // Resolve target logical elements (might be strings/visual IDs)
            let targetLogicals = (rel.targetLogicalElements || []).map(target => this.resolveLogicalElement(target, rel)).filter(el => !!el);
            // If targets are still not resolved, try to get them from visual elements
            if (targetLogicals.length === 0 && rel.visualElements && rel.visualElements.length > 0) {
              for (const visual of rel.visualElements) {
                for (const target of visual.targetVisualElements || []) {
                  if (target.targetVisualElement && target.targetVisualElement.logicalElement) {
                    const resolved = target.targetVisualElement.logicalElement;
                    if (!targetLogicals.find(t => t.lid === resolved.lid)) {
                      targetLogicals.push(resolved);
                    }
                  }
                }
              }
            }
            targetLogicals.forEach(target => {
              const obj = this.getOwningObjectFromElement(target);
              if (obj && lifelineIds.has(obj.lid)) {
                destinations.push({
                  object: obj,
                  type: rel.linkType
                });
              }
            });
          });
          return destinations;
        }
        getParentProcess(process) {
          const parent = process.getFather();
          if (parent instanceof OpmLogicalProcess) {
            return parent;
          } else {
            return undefined;
          }
        }
        isProceduralLink(type) {
          return [linkType.Agent, linkType.Instrument, linkType.Consumption, linkType.Result, linkType.Effect, linkType.UndertimeException, linkType.OvertimeException, linkType.UndertimeOvertimeException].includes(type);
        }
        getMessageSort(type) {
          if (type === linkType.Result) {
            return "createMessage";
          }
          if (type === linkType.Consumption) {
            return "deleteMessage";
          }
          return "synchCall";
        }
        getDestinationIdFromMessage(message, lifelineIds) {
          // Find the object ID that corresponds to the target lifeline ID
          for (const [objLid, lifelineId] of lifelineIds.entries()) {
            if (lifelineId === message.targetLifelineId) {
              return objLid;
            }
          }
          return null;
        }
        static #_ = (() => this.ɵfac = /*@__PURE__*/(() => {
          let ɵSequenceDiagramConverter_BaseFactory;
          return function SequenceDiagramConverter_Factory(__ngFactoryType__) {
            return (ɵSequenceDiagramConverter_BaseFactory ||= core /* ɵɵgetInheritedFactory */.xGo(SequenceDiagramConverter))(__ngFactoryType__ || SequenceDiagramConverter);
          };
        })())();
        static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
          token: SequenceDiagramConverter,
          factory: SequenceDiagramConverter.ɵfac,
          providedIn: "root"
        }))();
      }
      return SequenceDiagramConverter;
    })();