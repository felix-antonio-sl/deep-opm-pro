// Source: decompiled/deobfuscated.js
// Original path: ./src/app/configuration/elementsFunctionality/graphFunctionality.ts
// Extracted by opm-extracted/tools/extract.mjs

function addHandle(initRappidService, cell, opt) {
  if (!initRappidService.opmModel.getVisualElementById(cell.id)) {
    initRappidService.cell$.next(cell);
    // return;
  } else {
    // if (cell instanceof OpmObject || cell instanceof OpmProcess) {
    // Daniel: If I want to add a copy, no need to add a new logical.
    return;
  }
  if (cell instanceof Note) {
    // add handle for note
    initRappidService.opmModel.addNote(cell.getParams());
    return;
  }
  let newLogical;
  if (cell instanceof OpmObject) {
    newLogical = logicalFactory(EntityType.Object, initRappidService.opmModel, cell.getParams());
  } else if (cell instanceof OpmProcess) {
    newLogical = logicalFactory(EntityType.Process, initRappidService.opmModel, cell.getParams());
  } else if (cell instanceof OpmState) {
    newLogical = logicalFactory(EntityType.State, initRappidService.opmModel, cell.getParams());
  } else if (cell instanceof OpmProceduralLink) {
    newLogical = logicalFactory(RelationType.Procedural, initRappidService.opmModel, cell.getParams());
  } else if (cell instanceof OpmTaggedLink) {
    newLogical = logicalFactory(RelationType.Tagged, initRappidService.opmModel, cell.getParams());
  } else if (cell instanceof OpmFundamentalLink) {
    newLogical = logicalFactory(RelationType.Fundamental, initRappidService.opmModel, cell.getParams());
  }
  if (newLogical) {
    if (newLogical instanceof OpmLogicalEntity) {
      const newLogicalText = newLogical.text;
      const oldLogical = initRappidService.opmModel.getLogicalByText(newLogicalText);
      if (oldLogical) {
        newLogical.visualElements[0].logicalElement = oldLogical;
        oldLogical.visualElements.push(newLogical.visualElements[0]);
        initRappidService.opmModel.currentOpd.add(newLogical.visualElements[0]);
        return;
      }
    }
    initRappidService.opmModel.currentOpd.add(newLogical.visualElements[0]);
    initRappidService.opmModel.add(newLogical);
  }
}
function removeHandle(initRappidService, cell) {
  if (cell instanceof Note) {
    // remove handle for note
    initRappidService.opmModel.currentOpd.removeNote(cell.id);
  }
  if (cell instanceof OpmDefaultLink) {
    initRappidService.opmModel.currentOpd.removeNoteLink(cell.id);
  }
}
function changeHandle(initRappidService, cell) {
  if (cell.constructor.name === "TriangleClass") {
    updateFundamentalLinkFromTriengle(cell, initRappidService.opmModel);
  } else if (cell.constructor.name === "ConnectionPoint") {
    UpdateSelfInvocationLinkFromConnectionPoint(cell, initRappidService.opmModel);
  } else if (cell.constructor.name === "OpmDefaultLink") {
    if (cell.getTargetElement() instanceof TriangleClass) {
      updateFundamentalLinkFromTriengle(cell.getTargetElement(), initRappidService.opmModel);
    } else if (cell.isNoteLink(cell.getSourceElement(), cell.getTargetElement())) {
      const modelLink = initRappidService.opmModel.currentOpd.noteLinks?.find(l => l.id === cell.id);
      if (modelLink) {
        modelLink.vertices = cell.vertices();
      }
    }
  } else if (cell.constructor.name === "Note") {
    // changing note handle
    for (let i = 0; i < initRappidService.opmModel.opds.length; i++) {
      for (let j = 0; j < initRappidService.opmModel.opds[i].notes.length; j++) {
        if (initRappidService.opmModel.opds[i].notes[j].id === cell.get("id")) {
          initRappidService.opmModel.opds[i].notes[j] = cell.getParams();
          return;
        }
      }
    }
  } else {
    const params = cell.getParams();
    let visualElement;
    let logicalElement;
    if (cell instanceof OpmEllipsis) {
      const visualFather = initRappidService.opmModel.getVisualElementById(cell.get("father"));
      if (visualFather) {
        visualElement = visualFather.ellipsis;
      }
      if (visualElement) {
        logicalElement = visualElement.logicalElement;
      }
    } else {
      visualElement = initRappidService.opmModel.getVisualElementById(cell.get("id"));
      logicalElement = initRappidService.opmModel.getLogicalElementByVisualId(cell.get("id"));
    }
    if (logicalElement) {
      logicalElement.setParams(params);
    }
    if (visualElement) {
      visualElement.setParams(params);
    }
  }
}
function updateFundamentalLinkFromTriengle(triangleCell, opmModel) {
  const upperLink = triangleCell.graph.getConnectedLinks(triangleCell, {
    inbound: true
  })[0];
  if (triangleCell.graph.hasActiveBatch("arrowhead-move") && !upperLink?.changed?.source?.anchor) {
    return;
  }
  const outboundLinks = triangleCell.graph.getConnectedLinks(triangleCell, {
    outbound: true
  });
  for (let i = 0; i < outboundLinks.length; i++) {
    const params = outboundLinks[i].getParams();
    const visualElement = opmModel.getVisualElementById(outboundLinks[i].get("id"));
    if (visualElement) {
      visualElement.setParams(params);
    }
  }
}
function UpdateSelfInvocationLinkFromConnectionPoint(connectionCell, opmModel) {
  const id = connectionCell.getLinkId();
  const visualElement = opmModel.getVisualElementById(id);
  visualElement.selfInvocationPeakPoint = connectionCell.get("position");
}
function createDrawnEntity(type) {
  if (type.includes("Object")) {
    return new OpmObject();
  } else if (type.includes("Process")) {
    return new OpmProcess();
  } else if (type.includes("State")) {
    return new OpmState();
  } else if (type.includes("Ellipsis")) {
    return new OpmEllipsis();
  }
}
function invocationLink(source, target, linkName, graph, center) {
  const model = (0, getInitRappidShared)().getOpmModel();
  const visualSource = model.getVisualElementById(source.id);
  const visualTarget = model.getVisualElementById(target.id);
  if (source === target) {
    return new SelfInvocationLink_SelfInvocationLink(source, graph, undefined, center);
  }
  if (target.isInZooming() && visualTarget.children.includes(visualSource)) {
    return new SelfInvocationLink_SelfInvocationLinkInZoom(source, target);
  }
  return new InvocationLink(source, target, false, false);
}
function createDrawnLink(source, target, isCondition = null, isEvent = null, isNegation = null, linkName, graph, center) {
  if (linkName.includes("Agent")) {
    return new AgentLink(source, target, isCondition, isEvent, isNegation);
  } else if (linkName.includes("Instrument")) {
    return new InstrumentLink(source, target, isCondition, isEvent, isNegation);
  } else if (linkName.includes("Invocation")) {
    return invocationLink(source, target, linkName, graph, center);
  } else if (linkName.includes("Result")) {
    return new ResultLink_ResultLink(source, target, isCondition, isEvent);
  } else if (linkName.includes("Consumption")) {
    return new ConsumptionLink_ConsumptionLink(source, target, isCondition, isEvent, isNegation);
  } else if (linkName.includes("UndertimeOvertimeException")) {
    return new OvertimeUndertimeExceptionLink(source, target, isCondition, isEvent);
  } else if (linkName.includes("Effect")) {
    return new EffectLink(source, target, isCondition, isEvent, isNegation);
  } else if (linkName.includes("Overtime")) {
    return new OvertimeExceptionLink(source, target, isCondition, isEvent);
  } else if (linkName.includes("Undertime")) {
    return new UndertimeExceptionLink(source, target, isCondition, isEvent);
  } else if (linkName.includes("Unidirectional")) {
    return new UnidirectionalTaggedLink(source, target);
  } else if (linkName.includes("Bidirectional")) {
    return new BiDirectionalTaggedLink(source, target);
  } else if (linkName.includes("Aggregation")) {
    return new AggregationLink(source, target, graph);
  } else if (linkName.includes("Exhibition")) {
    return new ExhibitionLink(source, target, graph);
  } else if (linkName.includes("Generalization")) {
    return new GeneralizationLink(source, target, graph);
  } else if (linkName.includes("Instantiation")) {
    return new InstantiationLink(source, target, graph);
  }
}