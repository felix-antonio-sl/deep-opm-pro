// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DSM/dsm.model.ts
// Extracted by opm-extracted/tools/extract.mjs


class CloneRegistry {
  constructor() {
    this.logicalToClone = new Map();
    this.originalToClone = new Map();
  }
  hasLogical(logicalElement) {
    return this.logicalToClone.has(logicalElement);
  }
  getLogical(logicalElement) {
    return this.logicalToClone.get(logicalElement);
  }
  setLogical(logicalElement, cloned) {
    if (logicalElement) {
      this.logicalToClone.set(logicalElement, cloned);
    }
  }
  hasOriginal(original) {
    return this.originalToClone.has(original);
  }
  getOriginal(original) {
    return this.originalToClone.get(original);
  }
  setOriginal(original, cloned) {
    if (original) {
      this.originalToClone.set(original, cloned);
    }
  }
  recordVisualClone(originalVisual, clonedVisual) {
    this.setOriginal(originalVisual, clonedVisual);
    if (originalVisual?.logicalElement) {
      this.setLogical(originalVisual.logicalElement, clonedVisual);
    }
  }
}
class DsmModel {
  constructor(model) {
    this.colorPair = [];
    this.model = model;
  }
  removeOPMQueryOPD() {
    const opm_q_id = this.getOPMQueryID();
    if (!this.model.getOpd(opm_q_id)) {
      return;
    }
    this.model.setShouldLogForUndoRedo(false, "query");
    this.model.removeOpd(opm_q_id);
    this.model.setShouldLogForUndoRedo(true, "query");
  }
  flatLinkIntoInzoomed(sourceElement, targetElement, outboundCache = new Map()) {
    const currentOpd = this.model.getOpdByElement(targetElement);
    if (!currentOpd) {
      return [];
    }
    // const allLinks = currentOpd.visualElements.filter(element => element instanceof OpmLink);
    const currentThings = currentOpd.visualElements.filter(element => element instanceof OpmVisualThing);
    let currentChildrenProcesses = currentThings.filter(element => element.fatherObject === targetElement && element instanceof OpmVisualProcess);
    if (currentChildrenProcesses.length === 0) {
      currentChildrenProcesses = currentThings.filter(element => element.fatherObject === targetElement.id && element instanceof OpmVisualProcess);
    }
    let establishLink = [];
    if (currentChildrenProcesses.length === 0 && targetElement.refineeInzooming !== undefined && targetElement.refineeInzooming !== targetElement && targetElement instanceof OpmVisualProcess) {
      establishLink.push(...this.flatLinkIntoInzoomed(sourceElement, targetElement.refineeInzooming, outboundCache));
    } else {
      const visualsOfSourceElementOfCurrentOpd = currentOpd.visualElements.filter(element => element.logicalElement === sourceElement.logicalElement);
      if (visualsOfSourceElementOfCurrentOpd.length === 0) {
        for (let i = 0; i < currentChildrenProcesses.length; i++) {
          if (currentChildrenProcesses[i].isInzoomed()) {
            establishLink.push(...this.flatLinkIntoInzoomed(sourceElement, currentChildrenProcesses[i].refineeInzooming, outboundCache));
          }
        }
      } else {
        const outboundSet = new Set();
        const getOutbound = thing => {
          if (!outboundCache.has(thing)) {
            outboundCache.set(thing, currentOpd.getOutboundThings(thing));
          }
          return outboundCache.get(thing);
        };
        for (let i = 0; i < currentChildrenProcesses.length; i++) {
          for (let l = 0; l < visualsOfSourceElementOfCurrentOpd.length; l++) {
            const outbound = getOutbound(visualsOfSourceElementOfCurrentOpd[l]);
            for (const outboundThing of outbound) {
              outboundSet.add(outboundThing);
            }
          }
          if ((outboundSet.has(currentChildrenProcesses[i]) || outboundSet.has(targetElement)) && !currentChildrenProcesses[i].isInzoomed()) {
            establishLink.push(currentChildrenProcesses[i]);
          } else if ((outboundSet.has(currentChildrenProcesses[i]) || outboundSet.has(targetElement)) && currentChildrenProcesses[i].isInzoomed()) {
            establishLink.push(...this.flatLinkIntoInzoomed(sourceElement, currentChildrenProcesses[i].refineeInzooming, outboundCache));
          }
        }
      }
    }
    return establishLink;
  }
  flattening(leafsOnly = true) {
    this.removeOPMQueryOPD();
    const flatOPD = new OpmOpd("OPMQuery");
    flatOPD.id = this.getOPMQueryID();
    this.model.currentOpd = flatOPD;
    const cloneRegistry = new CloneRegistry();
    const leaveOut = new Set();
    const allVisualElements = [];
    const outboundCache = new Map();
    for (const opd of this.model.opds) {
      if (opd.isHidden) {
        continue;
      }
      const visualEntities = opd.visualElements.filter(element => element instanceof OpmVisualEntity);
      const allLinks = opd.visualElements.filter(element => element instanceof OpmLink);
      const linksBySource = new Map();
      for (const link of allLinks) {
        const sourceVisual = link.sourceVisualElement;
        if (sourceVisual) {
          if (!linksBySource.has(sourceVisual)) {
            linksBySource.set(sourceVisual, []);
          }
          linksBySource.get(sourceVisual).push(link);
        }
      }
      for (const currentVisual of visualEntities) {
        if (currentVisual.isValueTyped && currentVisual.isValueTyped()) {
          continue;
        }
        if (currentVisual instanceof OpmVisualObject && !cloneRegistry.hasLogical(currentVisual.logicalElement)) {
          if (currentVisual.logicalElement.states.length > 1) {
            const statefulVisuals = this.flatStatefulObj(currentVisual, cloneRegistry);
            allVisualElements.push(...statefulVisuals);
          }
        } else if (currentVisual instanceof OpmVisualState && !cloneRegistry.hasLogical(currentVisual.logicalElement)) {
          const statefulVisuals = this.flatStatefulObj(currentVisual.fatherObject, cloneRegistry);
          allVisualElements.push(...statefulVisuals);
        }
        if (currentVisual.refineeInzooming === undefined && !leaveOut.has(currentVisual.logicalElement)) {
          let clonedVisual = cloneRegistry.getLogical(currentVisual.logicalElement);
          if (!clonedVisual) {
            clonedVisual = currentVisual.clone();
            clonedVisual.fatherObject = undefined;
            allVisualElements.push(clonedVisual);
            cloneRegistry.recordVisualClone(currentVisual, clonedVisual);
          }
          const outgoingLinks = linksBySource.get(currentVisual) || [];
          for (const outgoingLink of outgoingLinks) {
            const targetVisual = outgoingLink.targetVisualElements[0].targetVisualElement;
            if (targetVisual.isValueTyped && targetVisual.isValueTyped()) {
              continue;
            }
            if (targetVisual instanceof OpmVisualObject && !cloneRegistry.hasLogical(targetVisual.logicalElement)) {
              if (targetVisual.logicalElement.states.length > 0) {
                const statefulVisuals = this.flatStatefulObj(targetVisual, cloneRegistry);
                allVisualElements.push(...statefulVisuals);
              }
            } else if (targetVisual instanceof OpmVisualState && !cloneRegistry.hasLogical(targetVisual.logicalElement)) {
              const statefulVisuals = this.flatStatefulObj(targetVisual.fatherObject, cloneRegistry);
              allVisualElements.push(...statefulVisuals);
            }
            if (!targetVisual.isInzoomed()) {
              let clonedTarget = cloneRegistry.getLogical(targetVisual.logicalElement);
              if (!clonedTarget) {
                clonedTarget = targetVisual.clone();
                clonedTarget.fatherObject = undefined;
                allVisualElements.push(clonedTarget);
                cloneRegistry.recordVisualClone(targetVisual, clonedTarget);
              }
              const clonedLink = outgoingLink.clone();
              clonedLink.sourceVisualElement = clonedVisual;
              clonedLink.targetVisualElements[0].targetVisualElement = clonedTarget;
              allVisualElements.push(clonedLink);
            } else {
              let clonedChildren = cloneRegistry.getOriginal(targetVisual);
              if (!clonedChildren) {
                const flatProcessDetails = this.flatInzoomedThing(targetVisual, leafsOnly, cloneRegistry);
                clonedChildren = flatProcessDetails.clonedChildren;
                allVisualElements.push(...flatProcessDetails.visualElements);
              }
              const targets = this.flatLinkIntoInzoomed(currentVisual, targetVisual, outboundCache);
              for (const targetChild of targets) {
                const clonedTarget = cloneRegistry.getOriginal(targetChild);
                if (!clonedTarget) {
                  continue;
                }
                const params = {
                  sourceElementId: clonedVisual.id,
                  targetElementId: clonedTarget.id,
                  linkType: outgoingLink.logicalElement.linkType,
                  id: uuid()
                };
                const newLink = this.model.logicalFactory(RelationType.Procedural, params);
                allVisualElements.push(newLink.visualElements[0]);
              }
            }
          }
        } else if (!leaveOut.has(currentVisual.logicalElement)) {
          if (!cloneRegistry.hasOriginal(currentVisual)) {
            const flatProcessDetails = this.flatInzoomedThing(currentVisual, leafsOnly, cloneRegistry);
            allVisualElements.push(...flatProcessDetails.visualElements);
          }
        }
      }
    }
    flatOPD.visualElements = allVisualElements;
    flatOPD.parendId = this.model.getOpdIDByName("SD");
    this.model.addOpd(flatOPD);
    for (const vis of flatOPD.visualElements) {
      if (vis instanceof OpmVisualThing) {
        flatOPD.beautify(vis);
      }
    }
    return flatOPD;
  }
  flatStatefulObj(statefulObject, cloneRegistry) {
    const visualElements = [];
    let clonedVisual = cloneRegistry.getLogical(statefulObject.logicalElement);
    if (!clonedVisual) {
      const parameters = statefulObject.getParams();
      parameters.id = uuid();
      if (statefulObject.isValueTyped()) {
        clonedVisual = statefulObject.clone();
      } else {
        clonedVisual = statefulObject.logicalElement.createVisual(parameters);
        clonedVisual.children = [];
      }
      clonedVisual.fatherObject = undefined;
      clonedVisual.height = 60;
      clonedVisual.width = 135;
      clonedVisual.textHeight = "80%";
      clonedVisual.textWidth = "80%";
      clonedVisual.refY = 0.5;
      clonedVisual.refX = 0.5;
      clonedVisual.xAlign = "middle";
      clonedVisual.yAlign = "middle";
      clonedVisual.refineeInzooming = undefined;
      clonedVisual.refineable = undefined;
      clonedVisual.refineeUnfolding = undefined;
      clonedVisual.strokeWidth = 2;
      visualElements.push(clonedVisual);
      cloneRegistry.recordVisualClone(statefulObject, clonedVisual);
    }
    if (statefulObject.logicalElement.states.length === 1) {
      cloneRegistry.recordVisualClone(statefulObject.logicalElement.states[0].visualElements[0], clonedVisual);
    } else {
      for (let j = 0; j < statefulObject.logicalElement.states.length; j++) {
        let logObjectOfState;
        if (!cloneRegistry.hasLogical(statefulObject.logicalElement.states[j].logicalElement)) {
          const params = statefulObject.getParams();
          params.id = uuid();
          params.children = [];
          params.fatherObjectId = undefined;
          params.text = statefulObject.logicalElement.toggleCapitalize(statefulObject.logicalElement.states[j].text) + " " + statefulObject.logicalElement.text;
          logObjectOfState = this.model.logicalFactory(EntityType.Object, params);
          // logObjectOfState.text = statefulObject.logicalElement.toggleCapitalize(statefulObject.logicalElement.states[j].text) + ' ' + statefulObject.logicalElement.text;
          logObjectOfState.visualElements[0].height = 60;
          logObjectOfState.visualElements[0].width = 135;
          logObjectOfState.visualElements[0].yPos = statefulObject.yPos + statefulObject.height + logObjectOfState.visualElements[0].height * j + (j + 1) * 15;
          logObjectOfState.visualElements[0].textHeight = "80%";
          logObjectOfState.visualElements[0].textWidth = "80%";
          logObjectOfState.visualElements[0].refY = 0.5;
          logObjectOfState.visualElements[0].refX = 0.5;
          logObjectOfState.visualElements[0].xAlign = "middle";
          logObjectOfState.visualElements[0].yAlign = "middle";
          logObjectOfState.visualElements[0].refineeInzooming = undefined;
          logObjectOfState.visualElements[0].refineable = undefined;
          logObjectOfState.visualElements[0].refineeUnfolding = undefined;
          visualElements.push(logObjectOfState.visualElements[0]);
          cloneRegistry.recordVisualClone(statefulObject.logicalElement.states[j].visualElements[0], logObjectOfState.visualElements[0]);
          cloneRegistry.setLogical(statefulObject.logicalElement.states[j].logicalElement, logObjectOfState.visualElements[0]);
          const par = {
            linkConnectionType: 1
          };
          const newLogicLink = new OpmFundamentalRelation(par, this.model, false);
          newLogicLink.sourceLogicalElement = statefulObject.logicalElement;
          newLogicLink.targetLogicalElements = [logObjectOfState];
          newLogicLink.linkType = linkType.Generalization;
          this.model.add(newLogicLink);
          newLogicLink.visualElements[0].sourceVisualElement = clonedVisual;
          newLogicLink.visualElements[0].targetVisualElements[0].targetVisualElement = logObjectOfState.visualElements[0];
          newLogicLink.visualElements[0].id = uuid();
          visualElements.push(newLogicLink.visualElements[0]);
        } else {
          logObjectOfState = cloneRegistry.getLogical(statefulObject.logicalElement.states[j].logicalElement);
        }
      }
    }
    return visualElements;
  }
  sortChildrenForParallel(unsortedChildren) {
    const children = unsortedChildren.sort((n1, n2) => n1.yPos - n2.yPos);
    const sortedChildren = [];
    let parallel = [];
    for (let i = 0; i < children.length; i++) {
      if (parallel.length === 0) {
        parallel.push(children[i]);
      }
      if (i === children.length - 1) {
        sortedChildren.push(parallel);
        break;
      }
      if (Math.abs(children[i].yPos - children[i + 1].yPos) < 5) {
        parallel.push(children[i + 1]);
      } else {
        sortedChildren.push(parallel);
        parallel = [];
      }
    }
    return sortedChildren;
  }
  getFlatOutgoingOfLayer(arrayLine) {
    const flatOutgoingArrayLine = [];
    for (let i = 0; i < arrayLine.length; i++) {
      if (Array.isArray(arrayLine[i]) && arrayLine[i].length !== 0) {
        flatOutgoingArrayLine.push(...this.getFlatOutgoingOfLayer(arrayLine[i][arrayLine[i].length - 1]));
      } else {
        flatOutgoingArrayLine.push(arrayLine[i]);
      }
    }
    return flatOutgoingArrayLine;
  }
  getFlatIngoingOfLayer(arrayLine) {
    const flatIngoingArrayLine = [];
    for (let i = 0; i < arrayLine.length; i++) {
      if (Array.isArray(arrayLine[i]) && arrayLine[i].length !== 0) {
        flatIngoingArrayLine.push(...this.getFlatIngoingOfLayer(arrayLine[i][0]));
      } else {
        flatIngoingArrayLine.push(arrayLine[i]);
      }
    }
    return flatIngoingArrayLine;
  }
  connectBetweenInzoomedThings(lineNumber, parallelSortedChildren) {
    const visualElements = [];
    const outgoingLayerThings = this.getFlatOutgoingOfLayer(parallelSortedChildren[lineNumber]);
    const ingoingLayerThings = this.getFlatIngoingOfLayer(parallelSortedChildren[lineNumber + 1]);
    for (let e = 0; e < outgoingLayerThings.length; e++) {
      if (outgoingLayerThings[e] instanceof OpmVisualProcess) {
        for (let f = 0; f < ingoingLayerThings.length; f++) {
          const params = {
            sourceElementId: outgoingLayerThings[e].id,
            targetElementId: ingoingLayerThings[f].id,
            linkType: linkType.Invocation,
            id: uuid()
          };
          const newInvocationLink = this.model.logicalFactory(RelationType.Procedural, params);
          this.model.add(newInvocationLink);
          visualElements.push(newInvocationLink.visualElements[0]);
        }
      }
      if (outgoingLayerThings[e] instanceof OpmVisualObject) {
        for (let f = 0; f < ingoingLayerThings.length; f++) {
          const params = {
            sourceElementId: outgoingLayerThings[e].id,
            targetElementId: ingoingLayerThings[f].id,
            linkType: linkType.Unidirectional,
            tag: "precedes",
            id: uuid()
          };
          const newTaggedUnidirectionalLink = this.model.logicalFactory(RelationType.Tagged, params);
          this.model.add(newTaggedUnidirectionalLink);
          visualElements.push(newTaggedUnidirectionalLink.visualElements[0]);
        }
      }
    }
    return visualElements;
  }
  flatInzoomedThing(thing, leafsOnly = false, cloneRegistry) {
    let visualElements = [];
    let clonedChildren = [];
    let currentChildren = [];
    if (currentChildren.length === 0 && thing.refineeInzooming) {
      const currentThings = this.model.getOpdByThingId(thing.refineeInzooming.id).visualElements.filter(element => element instanceof thing.constructor);
      currentChildren = currentThings.filter(element => element.fatherObject === thing.refineeInzooming);
    }
    currentChildren.sort((n1, n2) => n1.yPos - n2.yPos);
    const parallelSortedChildren = this.sortChildrenForParallel(currentChildren);
    const clonedThing = thing.clone();
    if (!leafsOnly) {
      clonedThing.fatherObject = undefined;
      visualElements.push(clonedThing);
      cloneRegistry.recordVisualClone(thing, clonedThing);
    }
    for (let d = 0; d < parallelSortedChildren.length; d++) {
      for (let e = 0; e < parallelSortedChildren[d].length; e++) {
        if (!parallelSortedChildren[d][e].isInzoomed()) {
          const clonedChild = parallelSortedChildren[d][e].clone();
          clonedChild.fatherObject = undefined;
          clonedChildren.push(clonedChild);
          cloneRegistry.recordVisualClone(parallelSortedChildren[d][e], clonedChild);
          visualElements.push(clonedChild);
          if (!leafsOnly) {
            const params = {
              sourceElementId: clonedThing.id,
              targetElementId: clonedChild.id,
              linkType: linkType.Aggregation,
              id: uuid()
            };
            const newExhibitionLink = this.model.logicalFactory(RelationType.Fundamental, params);
            this.model.add(newExhibitionLink);
            visualElements.push(newExhibitionLink.visualElements[0]);
          }
          parallelSortedChildren[d][e] = clonedChild;
        } else {
          const flatProcessDetails = this.flatInzoomedThing(parallelSortedChildren[d][e], leafsOnly, cloneRegistry);
          visualElements.push(...flatProcessDetails.visualElements);
          clonedChildren.push(...flatProcessDetails.clonedChildren);
          const clonedChild = flatProcessDetails.clonedThing;
          const params = {
            sourceElementId: clonedThing.id,
            targetElementId: clonedChild.id,
            linkType: linkType.Aggregation,
            id: uuid()
          };
          const newExhibitionLink = this.model.logicalFactory(RelationType.Fundamental, params);
          this.model.add(newExhibitionLink);
          visualElements.push(newExhibitionLink.visualElements[0]);
          parallelSortedChildren[d][e] = flatProcessDetails.sortedChildren;
        }
      }
    }
    if (thing.refineeInzooming) {
      cloneRegistry.setOriginal(thing.refineeInzooming, clonedChildren);
    }
    cloneRegistry.setOriginal(thing, clonedChildren);
    for (let d = 0; d < parallelSortedChildren.length - 1; d++) {
      visualElements.push(...this.connectBetweenInzoomedThings(d, parallelSortedChildren));
    }
    return {
      visualElements,
      clonedChildren,
      clonedThing,
      sortedChildren: parallelSortedChildren
    };
  }
  getCorrespondingChar(counter) {
    if (counter === -1) {
      return "";
    }
    // in English there are 26 letters
    let prefix = "";
    const lastChar = counter % 26 === 0 ? 26 : counter % 26;
    // decide how many letters will be in the name
    let numberOfChars = 1; // A...Z
    if (counter > 26) {
      numberOfChars++;
    } // AA...ZZ
    if (counter > Math.pow(26, 2) + 26) {
      numberOfChars++;
    } // AAA...ZZZ
    if (numberOfChars === 1) {
      prefix = String.fromCharCode(lastChar + 64);
    }
    if (numberOfChars === 2) {
      prefix = String.fromCharCode(Math.ceil((counter - 26) / 26) + 64) + String.fromCharCode(lastChar + 64);
    }
    if (numberOfChars === 3) {
      const firstDigit = Math.ceil((counter - Math.pow(26, 2) - 26) / Math.pow(26, 2));
      const firstChar = String.fromCharCode(firstDigit + 64);
      const secondDigit = Math.ceil((counter - Math.pow(26, 2) - 26 - (firstDigit - 1) * Math.pow(26, 2)) / 26);
      const secondChar = String.fromCharCode(secondDigit + 64);
      prefix = firstChar + secondChar + String.fromCharCode(lastChar + 64);
    }
    return prefix;
  }
  getRelationType(targetVisualObject, sourceVisualObject, linksBySourceTarget) {
    if (targetVisualObject === sourceVisualObject) {
      return "X";
    }
    const key = `${sourceVisualObject.id}_${targetVisualObject.id}`;
    const connectingLinks = linksBySourceTarget.get(key);
    if (!connectingLinks || connectingLinks.length < 1) {
      return "";
    } else {
      const type = connectingLinks[0].logicalElement.linkType;
      let relation = "";
      if (type === linkType.Consumption) {
        relation = "11";
      }
      if (type === linkType.Result) {
        relation = "12";
      }
      if (type === linkType.Effect) {
        relation = "13";
      }
      if (type === linkType.Invocation) {
        relation = "14";
      }
      if (type === linkType.Agent) {
        relation = "16";
      }
      if (type === linkType.Instrument) {
        relation = "17";
      }
      if (type === linkType.Aggregation) {
        relation = "21";
      }
      if (type === linkType.Generalization) {
        relation = "22";
      }
      if (type === linkType.Exhibition) {
        relation = "23";
      }
      if (type === linkType.Instantiation) {
        relation = "24";
      }
      if (type === linkType.Unidirectional) {
        relation = "25";
      }
      if (type === linkType.Bidirectional) {
        relation = "26";
      }
      if (connectingLinks[0].logicalElement.condition) {
        relation = relation + "1";
      }
      if (connectingLinks[0].logicalElement.event) {
        relation = relation + "2";
      }
      return relation;
    }
  }
  getSecondDegreeRelation(targetVisualObject, sourceVisualObject, linksByTarget, linksBySource) {
    if (sourceVisualObject === targetVisualObject) {
      return "X";
    }
    let secondDegreeRelation = "";
    const allIncomingLinksForTargetElement = linksByTarget.get(targetVisualObject) || [];
    const allOutgoingLinksForSourceElement = linksBySource.get(sourceVisualObject) || [];
    const intermediateSet = new Set();
    for (const incomingLink of allIncomingLinksForTargetElement) {
      intermediateSet.add(incomingLink.sourceVisualElement);
    }
    for (const outgoingLink of allOutgoingLinksForSourceElement) {
      const target = outgoingLink.targetVisualElements[0]?.targetVisualElement;
      if (target && intermediateSet.has(target)) {
        if (targetVisualObject instanceof OpmVisualProcess) {
          secondDegreeRelation = "14";
        }
        if (targetVisualObject instanceof OpmVisualObject) {
          secondDegreeRelation = "25";
        }
        return secondDegreeRelation;
      }
    }
    return secondDegreeRelation;
  }
  checkForCommonTargetWithAgentIntrumentLink(visualThingA, visualThingB, agentInstrumentLinksBySource) {
    if (visualThingA === visualThingB) {
      return false;
    }
    const allOutgoingLinksA = agentInstrumentLinksBySource.get(visualThingA) || [];
    const allOutgoingLinksB = agentInstrumentLinksBySource.get(visualThingB) || [];
    const targetsA = new Set();
    for (const link of allOutgoingLinksA) {
      const target = link.targetVisualElements[0]?.targetVisualElement;
      if (target) {
        targetsA.add(target);
      }
    }
    for (const link of allOutgoingLinksB) {
      const target = link.targetVisualElements[0]?.targetVisualElement;
      if (target && targetsA.has(target)) {
        return true;
      }
    }
    return false;
  }
  createAgentInstrumentDSM(model) {
    const modelToAnalyze = model || this.model;
    const currOpd = modelToAnalyze.currentOpd;
    const flatOpd = modelToAnalyze.getOpd(this.getOPMQueryID()) || this.flattening(true);
    const allLinks = flatOpd.visualElements.filter(link => link.logicalElement.linkType === linkType.Agent || link.logicalElement.linkType === linkType.Instrument);
    const dsmElementsSet = new Set();
    const dsmElements = [];
    const agentInstrumentLinksBySource = new Map();
    for (let a = 0; a < allLinks.length; a++) {
      const sourceElement = allLinks[a].sourceVisualElement;
      if (!dsmElementsSet.has(sourceElement)) {
        dsmElementsSet.add(sourceElement);
        dsmElements.push(sourceElement);
      }
      if (!agentInstrumentLinksBySource.has(sourceElement)) {
        agentInstrumentLinksBySource.set(sourceElement, []);
      }
      agentInstrumentLinksBySource.get(sourceElement).push(allLinks[a]);
    }
    const numberOfDsmElements = dsmElements.length;
    const dsmArray = [];
    for (let i = -1; i < numberOfDsmElements; i++) {
      const currentMatrixLine = [];
      if (i === -1) {
        currentMatrixLine.push("");
        currentMatrixLine.push("");
        for (let j = 0; j < numberOfDsmElements; j++) {
          currentMatrixLine.push(this.getCorrespondingChar(j + 1));
        }
      } else {
        currentMatrixLine.push(dsmElements[i].logicalElement.text);
        currentMatrixLine.push(this.getCorrespondingChar(i + 1));
        for (let j = 0; j < numberOfDsmElements; j++) {
          let relationType = "";
          if (this.checkForCommonTargetWithAgentIntrumentLink(dsmElements[j], dsmElements[i], agentInstrumentLinksBySource)) {
            relationType = "X";
          }
          if (dsmElements[j] === dsmElements[i]) {
            relationType = this.getCorrespondingChar(i + 1);
          }
          currentMatrixLine.push(relationType);
        }
      }
      dsmArray.push(currentMatrixLine);
    }
    this.removeOPMQueryOPD();
    modelToAnalyze.currentOpd = currOpd;
    return dsmArray;
  }
  createDsm(linkTypes, thingTypes, serverModel) {
    const allThings = "All things";
    const onlyProcesses = "Processes only";
    const onlyObjects = "Objects only";
    const allLinks = "All links";
    const onlyProceduralLinks = "Procedural links";
    const onlyStructuralLinks = "Structural links";
    const modelToAnalyze = serverModel || this.model;
    const currOpd = modelToAnalyze.currentOpd;
    const flatOpd = modelToAnalyze.getOpd(this.getOPMQueryID()) || this.flattening(true);
    let dsmElements = [];
    if (thingTypes === onlyProcesses) {
      dsmElements = flatOpd.visualElements.filter(link => link instanceof OpmVisualProcess);
    } else if (thingTypes === onlyObjects) {
      dsmElements = flatOpd.visualElements.filter(link => link instanceof OpmVisualObject);
    } else {
      dsmElements = flatOpd.visualElements.filter(link => link instanceof OpmVisualObject || link instanceof OpmVisualProcess);
    }
    const numberOfDsmElements = dsmElements.length;
    // Pre-index links for O(1) lookups
    const allLinksArray = flatOpd.visualElements.filter(link => link instanceof OpmFundamentalLink || link instanceof OpmProceduralLink);
    const linksBySourceTarget = new Map();
    const linksBySource = new Map();
    const linksByTarget = new Map();
    for (const link of allLinksArray) {
      const source = link.sourceVisualElement;
      const target = link.targetVisualElements[0]?.targetVisualElement;
      if (source && target) {
        const key = `${source.id}_${target.id}`;
        if (!linksBySourceTarget.has(key)) {
          linksBySourceTarget.set(key, []);
        }
        linksBySourceTarget.get(key).push(link);
        if (!linksBySource.has(source)) {
          linksBySource.set(source, []);
        }
        linksBySource.get(source).push(link);
        if (!linksByTarget.has(target)) {
          linksByTarget.set(target, []);
        }
        linksByTarget.get(target).push(link);
      }
    }
    const dsmArray = [];
    for (let i = -1; i < numberOfDsmElements; i++) {
      const currentMatrixLine = [];
      if (i === -1) {
        currentMatrixLine.push("");
        currentMatrixLine.push("");
        for (let j = 0; j < numberOfDsmElements; j++) {
          currentMatrixLine.push(this.getCorrespondingChar(j + 1));
        }
      } else {
        currentMatrixLine.push(dsmElements[i].logicalElement.text);
        currentMatrixLine.push(this.getCorrespondingChar(i + 1));
        for (let j = 0; j < numberOfDsmElements; j++) {
          let relationType = "";
          if (thingTypes === allThings || thingTypes === onlyProcesses && dsmElements[i] instanceof OpmVisualProcess && dsmElements[j] instanceof OpmVisualProcess || thingTypes === onlyObjects && dsmElements[i] instanceof OpmVisualObject && dsmElements[j] instanceof OpmVisualObject) {
            relationType = this.getRelationType(dsmElements[i], dsmElements[j], linksBySourceTarget);
          }
          if (relationType === "" && thingTypes !== allThings) {
            relationType = this.getSecondDegreeRelation(dsmElements[i], dsmElements[j], linksByTarget, linksBySource);
          }
          if (linkTypes === allLinks || linkTypes === onlyProceduralLinks && relationType[0] === "1" || linkTypes === onlyStructuralLinks && relationType[0] === "2" || relationType === "X" || relationType === undefined) {
            if (relationType === "X") {
              relationType = this.getCorrespondingChar(i + 1);
            }
            currentMatrixLine.push(relationType);
          } else {
            currentMatrixLine.push("");
          }
        }
      }
      dsmArray.push(currentMatrixLine);
    }
    this.removeOPMQueryOPD();
    modelToAnalyze.currentOpd = currOpd;
    return dsmArray;
  }
  swapRows(row1, row2, dsmArray) {
    if (row1 >= dsmArray.length || row2 >= dsmArray.length) {
      (0, validationAlert)("One of the rows out of range!", 2500, "warning");
      return;
    }
    if (row1 === row2) {
      return dsmArray;
    }
    const arr = [];
    // swap the columns
    for (let i = 0; i < dsmArray.length; i++) {
      const innerArr = [];
      for (let j = 0; j < dsmArray[i].length; j++) {
        if (j !== row1 + 1 && j !== row2 + 1) {
          innerArr.push(dsmArray[i][j]);
        } else if (j === row2 + 1) {
          innerArr.push(dsmArray[i][row1 + 1]);
        } else {
          innerArr.push(dsmArray[i][row2 + 1]);
        }
      }
      arr.push(innerArr);
    }
    // swap the rows
    const temp = arr[row1];
    arr[row1] = arr[row2];
    arr[row2] = temp;
    return arr;
  }
  partitioning(dsmArray) {
    let partitionedDsm = dsmArray;
    const newOrderSet = new Set();
    const newOrder = [];
    let foundNextElement = true;
    // Upside down, looking for elements that are independent. Repeat the search of next Element dsmArray.length times.
    for (let a = 1; a < dsmArray.length; a++) {
      if (newOrder.length === dsmArray.length - 1) {
        break;
      }
      const topDown = [];
      // Chose an element
      for (let i = 1; i < dsmArray.length; i++) {
        foundNextElement = true;
        if (newOrderSet.has(dsmArray[i][1])) {
          continue;
        }
        // Go through the x-axis relations of this element
        for (let j = 2; j < dsmArray[i].length; j++) {
          if (newOrderSet.has(dsmArray[j - 1][1])) {
            continue;
          }
          // Check if any dependencies on other elements exist
          if (dsmArray[i][j][0] === "1" || dsmArray[i][j][0] === "2") {
            foundNextElement = false;
            break;
          }
        }
        if (foundNextElement) {
          topDown.push(dsmArray[i][1]);
          newOrderSet.add(dsmArray[i][1]);
        }
      }
      newOrder.push(...topDown);
    }
    const bottomUp = [];
    const bottomUpSet = new Set();
    if (newOrder.length !== dsmArray.length - 1) {
      // Search for elements that no other element depends on.
      for (let a = 1; a < dsmArray.length; a++) {
        // Chose an element
        for (let i = 2; i < dsmArray[0].length; i++) {
          foundNextElement = true;
          if (bottomUpSet.has(dsmArray[0][i])) {
            continue;
          }
          // Go through the y- axis relations of this element
          for (let j = 1; j < dsmArray.length; j++) {
            if (bottomUpSet.has(dsmArray[j][1])) {
              continue;
            }
            // Check if any dependencies of other elements exist
            if (dsmArray[j][i][0] === "1" || dsmArray[j][i][0] === "2") {
              foundNextElement = false;
              break;
            }
          }
          if (foundNextElement && !newOrderSet.has(dsmArray[0][i])) {
            bottomUp.push(dsmArray[0][i]);
            bottomUpSet.add(dsmArray[0][i]);
            break;
          }
        }
      }
    }
    // Create Map for O(1) row lookups
    const rowIndexMap = new Map();
    for (let k = 0; k < partitionedDsm.length; k++) {
      rowIndexMap.set(partitionedDsm[k][1], k);
    }
    // Swap rows to new order
    for (let l = 0; l < newOrder.length; l++) {
      const row2 = rowIndexMap.get(newOrder[l]);
      if (row2 !== undefined) {
        partitionedDsm = this.swapRows(l + 1, row2, partitionedDsm);
        // Update map after swap
        rowIndexMap.set(partitionedDsm[l + 1][1], l + 1);
        rowIndexMap.set(partitionedDsm[row2][1], row2);
      }
    }
    for (let m = 0; m < bottomUp.length; m++) {
      const row2 = rowIndexMap.get(bottomUp[m]);
      if (row2 !== undefined) {
        partitionedDsm = this.swapRows(dsmArray.length - 1 - m, row2, partitionedDsm);
        // Update map after swap
        rowIndexMap.set(partitionedDsm[dsmArray.length - 1 - m][1], dsmArray.length - 1 - m);
        rowIndexMap.set(partitionedDsm[row2][1], row2);
      }
    }
    return partitionedDsm;
  }
  clustering(dsmArray) {
    if (dsmArray === undefined) {
      (0, validationAlert)("Please create DSM first.", 2500, "warning");
      return;
    }
    const clusteredDSM = dsmArray;
    let bestClustering = [];
    for (let j = 1; j < dsmArray.length; j++) {
      bestClustering.push([dsmArray[j][1]]);
    }
    // Pre-index DSM for faster lookups
    const dsmIndexedByRow = new Map();
    const dsmIndexedByCol = new Map();
    for (let i = 1; i < dsmArray.length; i++) {
      const rowId = dsmArray[i][1];
      if (!dsmIndexedByRow.has(rowId)) {
        dsmIndexedByRow.set(rowId, []);
      }
      dsmIndexedByRow.get(rowId).push(i);
    }
    for (let a = 2; a < dsmArray[0].length; a++) {
      const colId = dsmArray[0][a];
      if (!dsmIndexedByCol.has(colId)) {
        dsmIndexedByCol.set(colId, []);
      }
      dsmIndexedByCol.get(colId).push(a);
    }
    // Optimized cache with efficient key generation
    const interactionCache = new Map();
    const sortedCache = new Map(); // Cache sorted arrays to avoid re-sorting
    const getSortedKey = cluster => {
      if (sortedCache.has(cluster)) {
        return sortedCache.get(cluster);
      }
      const sorted = cluster.slice().sort().join(",");
      sortedCache.set(cluster, sorted);
      return sorted;
    };
    const getCachedInteraction = (cluster1, cluster2) => {
      // For same clusters (reference equality), use special key
      if (cluster1 === cluster2) {
        const key = `self_${getSortedKey(cluster1)}`;
        if (!interactionCache.has(key)) {
          interactionCache.set(key, this.sumInteractionBetweenClusters(cluster1, cluster2, dsmArray, dsmIndexedByRow, dsmIndexedByCol));
        }
        return interactionCache.get(key);
      }
      // For different clusters, create deterministic key from sorted IDs
      const key1 = getSortedKey(cluster1);
      const key2 = getSortedKey(cluster2);
      const cacheKey = key1 < key2 ? `${key1}|${key2}` : `${key2}|${key1}`;
      if (!interactionCache.has(cacheKey)) {
        interactionCache.set(cacheKey, this.sumInteractionBetweenClusters(cluster1, cluster2, dsmArray, dsmIndexedByRow, dsmIndexedByCol));
      }
      return interactionCache.get(cacheKey);
    };
    // Adaptive iterations: reduce for large models
    const modelSize = dsmArray.length - 1;
    const maxIterations = modelSize > 500 ? 10 : 20; // Reduce iterations for very large models
    const innerIterations = modelSize > 500 ? 250 : 500; // Reduce inner iterations for large models
    for (let d = 0; d < maxIterations; d++) {
      let clusters = [];
      for (let j = 1; j < dsmArray.length; j++) {
        clusters.push([dsmArray[j][1]]);
      }
      let currentCluster;
      let previousTotalCoordinationCost = this.intraClusterCost(clusters, dsmArray, getCachedInteraction) + this.extraClusterCost(clusters, dsmArray, getCachedInteraction);
      let currentTotalCoordinationCost = 0;
      let noImprovementCount = 0;
      const maxNoImprovement = 50; // Stop early if no improvement
      for (let z = 0; z < innerIterations; z++) {
        const num = Math.floor(Math.random() * clusters.length);
        currentCluster = clusters[num];
        if (!currentCluster || currentCluster.length === 0) {
          continue;
        }
        let highestBid = 0;
        let highestCluster;
        for (let i = 0; i < clusters.length; i++) {
          if (i === num) {
            continue;
          }
          const bid = this.getBid(currentCluster, clusters[i], dsmArray, getCachedInteraction);
          if (bid > highestBid) {
            highestBid = bid;
            highestCluster = i;
          }
        }
        if (highestCluster === undefined) {
          continue;
        }
        const tempClusters = [];
        tempClusters.push([...currentCluster, ...clusters[highestCluster]]);
        for (let c = 0; c < clusters.length; c++) {
          if (c !== num && c !== highestCluster) {
            tempClusters.push(clusters[c]);
          }
        }
        currentTotalCoordinationCost = this.intraClusterCost(tempClusters, dsmArray, getCachedInteraction) + this.extraClusterCost(tempClusters, dsmArray, getCachedInteraction);
        if (currentTotalCoordinationCost < previousTotalCoordinationCost) {
          clusters = tempClusters;
          previousTotalCoordinationCost = currentTotalCoordinationCost;
          noImprovementCount = 0;
        } else {
          noImprovementCount++;
          if (noImprovementCount >= maxNoImprovement) {
            break; // Early exit if no improvement
          }
        }
      }
      const clustersCost = this.intraClusterCost(clusters, dsmArray, getCachedInteraction) + this.extraClusterCost(clusters, dsmArray, getCachedInteraction);
      const bestCost = this.intraClusterCost(bestClustering, dsmArray, getCachedInteraction) + this.extraClusterCost(bestClustering, dsmArray, getCachedInteraction);
      if (clustersCost < bestCost) {
        bestClustering = clusters;
      }
    }
    return bestClustering;
  }
  reorganizeDsmForClusters(dsmArray, bestClustering) {
    let clustering;
    let newDsm = dsmArray;
    if (bestClustering === undefined) {
      return;
    }
    clustering = bestClustering;
    const dsmOrder = [];
    for (let i = 0; i < clustering.length; i++) {
      dsmOrder.push(...clustering[i]);
    }
    // Create Map for O(1) row lookups
    const rowIndexMap = new Map();
    for (let n = 0; n < newDsm.length; n++) {
      rowIndexMap.set(newDsm[n][1], n);
    }
    for (let m = 0; m < dsmOrder.length; m++) {
      const row2 = rowIndexMap.get(dsmOrder[m]);
      if (row2 !== undefined) {
        newDsm = this.swapRows(m + 1, row2, newDsm);
        // Update map after swap
        rowIndexMap.set(newDsm[m + 1][1], m + 1);
        rowIndexMap.set(newDsm[row2][1], row2);
      }
    }
    return newDsm;
  }
  getThingNameFromDsmWithRowID(id, dsmArray, nameCache) {
    if (nameCache) {
      return nameCache.get(id);
    }
    for (let i = 1; i < dsmArray.length; i++) {
      if (dsmArray[i][1] === id) {
        return dsmArray[i][0];
      }
    }
  }
  getVisualOfOpdByName(opd, name, visualCache) {
    if (visualCache) {
      return visualCache.get(name);
    }
    for (let i = 0; i < opd.visualElements.length; i++) {
      if (opd.visualElements[i].logicalElement.text === name) {
        return opd.visualElements[i];
      }
    }
  }
  getRandomColor(colorNum, colors) {
    if (colors < 1) {
      colors = 1;
    } // defaults to one color - avoid divide by zero
    return "hsl(" + colorNum * (360 / colors) % 360 + ",100%,50%)";
  }
  colorClustersFlatModel(dsmArray, clusters, serverModel) {
    const modelToAnalyze = serverModel || this.model;
    const flatOpd = modelToAnalyze.getOpd(this.getOPMQueryID()) || this.flattening(true);
    flatOpd.isFlatteningOpd = true;
    // Pre-build caches for O(1) lookups
    const nameCache = new Map();
    for (let i = 1; i < dsmArray.length; i++) {
      nameCache.set(dsmArray[i][1], dsmArray[i][0]);
    }
    const visualCache = new Map();
    for (let i = 0; i < flatOpd.visualElements.length; i++) {
      const element = flatOpd.visualElements[i];
      if (element.logicalElement && element.logicalElement.text) {
        visualCache.set(element.logicalElement.text, element);
      }
    }
    let color;
    for (let j = 0; j < clusters.length; j++) {
      color = this.getRandomColor(j, clusters.length);
      for (let i = 0; i < clusters[j].length; i++) {
        const name = this.getThingNameFromDsmWithRowID(clusters[j][i], dsmArray, nameCache);
        if (name) {
          const visualToBeColored = this.getVisualOfOpdByName(flatOpd, name, visualCache);
          if (visualToBeColored) {
            this.addColorOfVisualThing(visualToBeColored);
            visualToBeColored.fill = color;
          }
        }
      }
    }
    modelToAnalyze.currentOpd = flatOpd;
    return modelToAnalyze;
  }
  colorClustersRegularModel(dsmArray, clusters) {
    let color;
    if (!clusters) {
      return;
    }
    for (let j = 0; j < clusters.length; j++) {
      color = this.getRandomColor(j, clusters.length);
      for (let i = 0; i < clusters[j].length; i++) {
        const name = this.getThingNameFromDsmWithRowID(clusters[j][i], dsmArray);
        const logical = this.model.getLogicalByText(name);
        if (logical !== undefined) {
          for (let b = 0; b < logical.visualElements.length; b++) {
            this.addColorOfVisualThing(logical.visualElements[b]);
            logical.visualElements[b].fill = color;
          }
        }
      }
    }
  }
  /**
   * Identify circuits (feedback loops) in the DSM using Tarjan's Strongly Connected Components algorithm
   * @param dsmArray The DSM matrix array
   * @returns Array of circuits, where each circuit contains element IDs and row indices
   */
  identifyCircuits(dsmArray) {
    if (!dsmArray || dsmArray.length < 2) {
      return [];
    }
    // Build adjacency graph from DSM
    // Graph structure: Map<rowIndex, Set<columnIndex>>
    const graph = new Map();
    const elementIdToRowIndex = new Map(); // Map element ID to row index
    const rowIndexToElementId = new Map(); // Map row index to element ID
    // Initialize graph and mappings
    for (let i = 1; i < dsmArray.length; i++) {
      const elementId = dsmArray[i][1];
      elementIdToRowIndex.set(elementId, i);
      rowIndexToElementId.set(i, elementId);
      graph.set(i, new Set());
    }
    // Build edges: if row i has dependency on column j, add edge i -> j
    // Note: columns start at index 2, so column j corresponds to element at dsmArray[0][j]
    for (let i = 1; i < dsmArray.length; i++) {
      for (let j = 2; j < dsmArray[i].length; j++) {
        const cellValue = dsmArray[i][j];
        if (cellValue && (cellValue[0] === "1" || cellValue[0] === "2")) {
          // Row i depends on column j, which corresponds to row index j-1
          // But we need to find which row has the element ID matching dsmArray[0][j]
          const targetElementId = dsmArray[0][j];
          const targetRowIndex = elementIdToRowIndex.get(targetElementId);
          if (targetRowIndex !== undefined) {
            graph.get(i).add(targetRowIndex);
          }
        }
      }
    }
    // Tarjan's algorithm to find strongly connected components
    const index = new Map();
    const lowlink = new Map();
    const onStack = new Set();
    const stack = [];
    let currentIndex = 0;
    const stronglyConnectedComponents = [];
    const strongConnect = v => {
      index.set(v, currentIndex);
      lowlink.set(v, currentIndex);
      currentIndex++;
      stack.push(v);
      onStack.add(v);
      // Consider successors of v
      const successors = graph.get(v) || new Set();
      for (const w of successors) {
        if (!index.has(w)) {
          // Successor w has not yet been visited; recurse on it
          strongConnect(w);
          lowlink.set(v, Math.min(lowlink.get(v), lowlink.get(w)));
        } else if (onStack.has(w)) {
          // Successor w is in stack and hence in the current SCC
          lowlink.set(v, Math.min(lowlink.get(v), index.get(w)));
        }
      }
      // If v is a root node, pop the stack and generate an SCC
      if (lowlink.get(v) === index.get(v)) {
        const component = [];
        let w;
        do {
          w = stack.pop();
          onStack.delete(w);
          component.push(w);
        } while (w !== v);
        // Only add circuits with 2+ elements (filter out single self-loops if desired)
        if (component.length >= 2) {
          stronglyConnectedComponents.push(component);
        }
      }
    };
    // Run Tarjan's algorithm for all unvisited nodes
    for (let i = 1; i < dsmArray.length; i++) {
      if (!index.has(i)) {
        strongConnect(i);
      }
    }
    // Format results as Circuit objects
    const circuits = [];
    for (let i = 0; i < stronglyConnectedComponents.length; i++) {
      const component = stronglyConnectedComponents[i];
      const elements = [];
      for (const rowIndex of component) {
        const elementId = rowIndexToElementId.get(rowIndex);
        if (elementId !== undefined) {
          elements.push({
            rowIndex: rowIndex,
            elementId: elementId,
            elementName: dsmArray[rowIndex][0] // Element name from first column
          });
        }
      }
      if (elements.length > 0) {
        circuits.push({
          id: i + 1,
          elements: elements,
          size: elements.length
        });
      }
    }
    // Sort circuits by size (largest first) for better visibility
    circuits.sort((a, b) => b.size - a.size);
    return circuits;
  }
  colorCircuitsRegularModel(dsmArray, circuits) {
    if (!circuits || circuits.length === 0) {
      return;
    }
    // Build element ID to name mapping
    const elementIdToName = new Map();
    for (let i = 1; i < dsmArray.length; i++) {
      elementIdToName.set(dsmArray[i][1], dsmArray[i][0]);
    }
    for (let j = 0; j < circuits.length; j++) {
      const circuit = circuits[j];
      const color = this.getRandomColor(j, circuits.length);
      for (const element of circuit.elements) {
        const name = elementIdToName.get(element.elementId) || element.elementName;
        if (name) {
          const logical = this.model.getLogicalByText(name);
          if (logical !== undefined) {
            for (let b = 0; b < logical.visualElements.length; b++) {
              this.addColorOfVisualThing(logical.visualElements[b]);
              logical.visualElements[b].fill = color;
            }
          }
        }
      }
    }
  }
  colorCircuitsFlatModel(dsmArray, circuits, serverModel) {
    const modelToAnalyze = serverModel || this.model;
    const flatOpd = modelToAnalyze.getOpd(this.getOPMQueryID()) || this.flattening(true);
    flatOpd.isFlatteningOpd = true;
    // Pre-build caches for O(1) lookups
    const nameCache = new Map();
    for (let i = 1; i < dsmArray.length; i++) {
      nameCache.set(dsmArray[i][1], dsmArray[i][0]);
    }
    const visualCache = new Map();
    for (let i = 0; i < flatOpd.visualElements.length; i++) {
      const element = flatOpd.visualElements[i];
      if (element.logicalElement && element.logicalElement.text) {
        visualCache.set(element.logicalElement.text, element);
      }
    }
    if (!circuits || circuits.length === 0) {
      modelToAnalyze.currentOpd = flatOpd;
      return modelToAnalyze;
    }
    let color;
    for (let j = 0; j < circuits.length; j++) {
      const circuit = circuits[j];
      color = this.getRandomColor(j, circuits.length);
      for (const element of circuit.elements) {
        const name = nameCache.get(element.elementId) || element.elementName;
        if (name) {
          const visualToBeColored = this.getVisualOfOpdByName(flatOpd, name, visualCache);
          if (visualToBeColored) {
            this.addColorOfVisualThing(visualToBeColored);
            visualToBeColored.fill = color;
          }
        }
      }
    }
    modelToAnalyze.currentOpd = flatOpd;
    return modelToAnalyze;
  }
  addColorOfVisualThing(visualThing) {
    this.colorPair.push([visualThing.id, visualThing.fill]);
  }
  colorBack() {
    for (let i = 0; i < this.colorPair.length; i++) {
      const currentVisual = this.model.getVisualElementById(this.colorPair[i][0]);
      currentVisual.fill = this.colorPair[i][1];
    }
  }
  getBid(cluster1, cluster2, dsmArray, getCachedInteraction, dsmIndexedByRow, dsmIndexedByCol) {
    const sum = getCachedInteraction ? getCachedInteraction(cluster1, cluster2) : this.sumInteractionBetweenClusters(cluster1, cluster2, dsmArray, dsmIndexedByRow, dsmIndexedByCol);
    if (cluster1.length > 0) {
      return sum / cluster1.length;
    } else {
      return 0;
    }
  }
  extraClusterCost(clusters, dsmArray, getCachedInteraction, dsmIndexedByRow, dsmIndexedByCol) {
    let totalExtraClusterCost = 0;
    const clustersLength = clusters.length;
    const clustersLength4 = clustersLength ** 4;
    for (let i = 0; i < clustersLength; i++) {
      for (let j = i + 1; j < clustersLength; j++) {
        const interaction = getCachedInteraction ? getCachedInteraction(clusters[i], clusters[j]) : this.sumInteractionBetweenClusters(clusters[i], clusters[j], dsmArray, dsmIndexedByRow, dsmIndexedByCol);
        totalExtraClusterCost += interaction * clustersLength4;
      }
    }
    return totalExtraClusterCost;
  }
  intraClusterCost(clusters, dsmArray, getCachedInteraction, dsmIndexedByRow, dsmIndexedByCol) {
    let totalIntraClusterCost = 0;
    for (let i = 0; i < clusters.length; i++) {
      const interaction = getCachedInteraction ? getCachedInteraction(clusters[i], clusters[i]) : this.sumInteractionBetweenClusters(clusters[i], clusters[i], dsmArray, dsmIndexedByRow, dsmIndexedByCol);
      const clusterLength = clusters[i].length;
      totalIntraClusterCost += interaction * clusterLength ** 2;
    }
    return totalIntraClusterCost;
  }
  sumInteractionBetweenClusters(cluster1, cluster2, dsmArray, dsmIndexedByRow, dsmIndexedByCol) {
    let sum = 0;
    // if (cluster1 === cluster2) return;
    const cluster1Set = new Set(cluster1);
    const cluster2Set = new Set(cluster2);
    // Use pre-indexed data if available
    if (dsmIndexedByRow && dsmIndexedByCol) {
      for (const cluster1Id of cluster1) {
        const rowIndices = dsmIndexedByRow.get(cluster1Id);
        if (rowIndices) {
          for (const rowIdx of rowIndices) {
            const row = dsmArray[rowIdx];
            if (row) {
              for (let a = 2; a < row.length; a++) {
                const colId = dsmArray[0][a];
                if (cluster2Set.has(colId)) {
                  const cellValue = row[a];
                  if (cellValue && (cellValue[0] === "1" || cellValue[0] === "2" || cellValue === "X")) {
                    sum += 1;
                  }
                }
              }
            }
          }
        }
      }
      for (const cluster2Id of cluster2) {
        const rowIndices = dsmIndexedByRow.get(cluster2Id);
        if (rowIndices) {
          for (const rowIdx of rowIndices) {
            const row = dsmArray[rowIdx];
            if (row) {
              for (let b = 2; b < row.length; b++) {
                const colId = dsmArray[0][b];
                if (cluster1Set.has(colId)) {
                  const cellValue = row[b];
                  if (cellValue && (cellValue[0] === "1" || cellValue[0] === "2" || cellValue === "X")) {
                    sum += 1;
                  }
                }
              }
            }
          }
        }
      }
    } else {
      // Fallback to original algorithm
      for (let i = 1; i < dsmArray.length; i++) {
        const rowId = dsmArray[i][1];
        if (cluster1Set.has(rowId)) {
          const row = dsmArray[i];
          for (let a = 2; a < row.length; a++) {
            const colId = dsmArray[0][a];
            if (cluster2Set.has(colId)) {
              const cellValue = row[a];
              if (cellValue && (cellValue[0] === "1" || cellValue[0] === "2" || cellValue === "X")) {
                sum += 1;
              }
            }
          }
        }
        if (cluster2Set.has(rowId)) {
          const row = dsmArray[i];
          for (let b = 2; b < row.length; b++) {
            const colId = dsmArray[0][b];
            if (cluster1Set.has(colId)) {
              const cellValue = row[b];
              if (cellValue && (cellValue[0] === "1" || cellValue[0] === "2" || cellValue === "X")) {
                sum += 1;
              }
            }
          }
        }
      }
    }
    return sum;
  }
  getOPMQueryID() {
    return "OPMqUeRy";
  }
}