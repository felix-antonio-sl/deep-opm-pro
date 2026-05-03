// Source: decompiled/deobfuscated.js
// Original path: ./src/app/configuration/elementsFunctionality/linkDrawing.ts
// Extracted by opm-extracted/tools/extract.mjs

const linkDrawing = {
  drawLink(link, linkName, multipleTargetsSelected) {
    // const src = link.getSourceElement();
    // const dst = link.getTargetElement();
    // link.resizePort();
    // const s = link.get('source');
    // const sp = s.port;
    // const t = link.get('target');
    // const tp = t.port;
    // const graph = link.graph;
    // const source = link.getSourceElement();
    // const target = link.getTargetElement();
    // const linkGetName = link.get('name');
    // const linkTarget = link.get('target');
    // link.remove();
    // const isCondition = linkName.includes('Condition');
    // const isEvent = linkName.includes('Event');
    // const newLink = [];
    // if (linkName.includes('Agent')) {
    //   newLink.push(new AgentLink(source, target, isCondition, isEvent));
    // } else if (linkName.includes('Instrument')) {
    //   newLink.push(new InstrumentLink(source, target, isCondition, isEvent));
    // } else if (linkName.includes('Invocation')) {
    //   if (source !== target &&
    //     source.get('parent') !== target.get('id')) {
    //     newLink.push(new InvocationLink(source, target, isCondition, isEvent, undefined, sp, tp).init());
    //   } else {
    //     const error = selfInvocationLink(source, target, linkTarget && linkTarget.port, newLink, graph);
    //     if (error) {
    //       validationAlert(error, 2500, undefined, true);
    //       return;
    //     }
    //   }
    //   if (newLink[1]) {
    //     newLink[1].set('previousTargetId', newLink[1].get('target').id);
    //     newLink[1].set('previousSourceId', newLink[1].get('source').id);
    //   }
    // } else if (linkName.includes('Result')) {
    //   newLink.push(new ResultLink(source, target, isCondition, isEvent));
    // } else if (linkName.includes('Consumption')) {
    //   newLink.push(new ConsumptionLink(source, target, isCondition, isEvent));
    // } else if (linkName.includes('Effect')) {
    //   newLink.push(new EffectLink(source, target, isCondition, isEvent));
    // } else if (linkName.includes('Overtime_exception')) {
    //   newLink.push(new OvertimeExceptionLink(source, target, isCondition, isEvent));
    // } else if (linkName.includes('Undertime_exception')) {
    //   newLink.push(new UndertimeExceptionLink(source, target, isCondition, isEvent));
    // } else if (linkName.includes('OvertimeUndertime-exception')) {
    //   newLink.push(new OvertimeUndertimeExceptionLink(source, target, isCondition, isEvent));
    // } else if (linkName.includes('Unidirectional')) {
    //   newLink.push(new UnidirectionalTaggedLink(source, target));
    // } else if (linkName.includes('Bidirectional')) {
    //   newLink.push(new BiDirectionalTaggedLink(source, target));
    // } else if (linkName.includes('Aggregation')) {
    //   newLink.push(new AggregationLink(source, target, graph));
    // } else if (linkName.includes('Exhibition')) {
    //   newLink.push(new ExhibitionLink(source, target, graph));
    // } else if (linkName.includes('Generalization')) {
    //   newLink.push(new GeneralizationLink(source, target, graph));
    // } else if (linkName.includes('Instantiation')) {
    //   newLink.push(new InstantiationLink(source, target, graph));
    // } else if (linkName.includes('In-out_Link_Pair')) {
    //   InOutLinkpair(source, target, newLink, graph, isCondition, isEvent);
    //   // Saving the source and target to previous of the second link
    //   // so will have history (history for first link will be saved below, outside the if)
    //   if (newLink[1]) {
    //     newLink[1].set('previousTargetId', newLink[1].get('target').id);
    //     newLink[1].set('previousSourceId', newLink[1].get('source').id);
    //   }
    // }
    // if (newLink[0]) {
    //   newLink[0].set('previousTargetId', newLink[0].get('target').id);
    //   newLink[0].set('previousSourceId', newLink[0].get('source').id);
    //   if (!linkName.includes('In-out_Link_Pair') && !newLink[0].get('name').includes('selfInvocation')) {
    //     newLink[0].set('name', linkGetName);
    //   }
    //   graph.addCells(newLink);
    //   if (multipleTargetsSelected) {
    //     if (dst instanceof OpmState) {
    //       newLink[0].remove();
    //     }
    //   }
    // }
    // link.remove();
    // remove previous link if exist
    /*
    this.deletePredefinedLinks(newLink, graph, isCondition, isEvent);
    let parentIdEqualtargetId = (graph.getCell(s) && graph.getCell(s).getParent() && graph.getCell(s).getParent().id === t.id);// Alon: checks if the target is also the parent
    let isParentEmbedded = ((graph.getCell(s) && graph.getCell(s) instanceof OpmState) && (graph.getCell(s).getParent().getParent() && graph.getCell(s).getParent().getParent().id === t.id)); // checks if state and is father object is embedded
    let isEventInstrumentLink = !!(newLink[0].get('name').includes('Instrument_Event'));// checks if event Instrument
    let isEventConsumptionLink = !!newLink[0].get('name').includes('Consumption_Event');// checks if event consumption
    let isSelfInvocation = (newLink[0].get('name').includes('selfInvocation'));
    let isInvocation = (newLink[0].get('name').includes('Invocation'));
         if (!isInvocation && !isEventInstrumentLink && !isEventConsumptionLink && !newLink[0].get('target').port) {
      newLink[0].set({ 'target': (t.port) ? { 'id': t.id, port: t.port } : { 'id': t.id } });
    }
         if (parentIdEqualtargetId && isEventInstrumentLink || parentIdEqualtargetId && isEventConsumptionLink || parentIdEqualtargetId && isInvocation || isParentEmbedded && isEventInstrumentLink || isParentEmbedded && isEventConsumptionLink) {
      newLink[0].set({ 'target': { 'id': t.id, port: (isInvocation) ? (t.port) ? t.port : 10 : 20 } });
    } else if (parentIdEqualtargetId && !isEventInstrumentLink && !isEventConsumptionLink || isParentEmbedded && !isEventInstrumentLink && !isEventConsumptionLink) {
      newLink[0].remove();
      let erroMsg = 'This type of link is not permitted in this case';
      validationAlert(erroMsg, 2500, '', false);
    }*/
    // if (linkName.includes('Result'))
    //   uniteResults(newLink);
    // const init = getInitRappidShared();
    // newLink[0].pointerUpHandle(init.paper.findViewByModel(newLink[0].id), init);
    //  return newLink[0];
  },
  getPreviousPort(graph, link) {
    const upperLink = graph.getConnectedLinks(link.triangle, {
      inbound: true
    })[0];
    return upperLink.get("source").port;
  },
  deletePredefinedLinks(newLink, graph, isCondition, isEvent) {
    for (let i = 0; i < newLink.length; i++) {
      // SLAYER: I'm so sorry - Alon: Not forgiven
      newLink[i].attributes.Path = false;
    }
    for (let i = 0; i < newLink.length; i++) {
      let source;
      if (newLink[i] instanceof OpmFundamentalLink) {
        // if a fundamental link type, need to take the source from the main upper link
        source = newLink[i].mainUpperLink.getSourceElement();
      } else {
        source = newLink[i].getSourceElement();
      }
      const target = newLink[i].getTargetElement();
      if (source && target) {
        let outLinks = source.graph.getConnectedLinks(source, {
          outbound: true
        });
        let inLinks = target.graph.getConnectedLinks(target, {
          inbound: true
        });
        const previousLinks = inLinks.filter(link => (outLinks.includes(link) || outLinks.includes(link.mainUpperLink)) && link !== newLink[i]);
        outLinks = target.graph.getConnectedLinks(target, {
          outbound: true
        });
        inLinks = source.graph.getConnectedLinks(source, {
          inbound: true
        });
        const reverseDirectionpreviousLinks = inLinks.filter(link => (outLinks.includes(link) || outLinks.includes(link.mainUpperLink)) && link !== newLink[i]);
        for (let j = 0; j < (previousLinks ? previousLinks.length : 0); j++) {
          // if (previousLinks[j] && !previousLinks[j].partner) {  // not input-output link pair
          if (newLink[i] instanceof OpmProceduralLink && previousLinks[j] instanceof OpmProceduralLink || newLink[i] instanceof OpmStructuralLink && previousLinks[j] instanceof OpmStructuralLink || source instanceof Note || target instanceof Note) {
            if (newLink[i] instanceof OpmFundamentalLink) {
              const prevPort = this.getPreviousPort(graph, previousLinks[j]);
              const prevTrianglePos = previousLinks[j].triangle.get("position");
              prevTrianglePos.x += 5;
              newLink[i].triangle.set("position", prevTrianglePos);
              // this.restorePrevPorts(graph, previousLinks[j]);
              const prevTargPort = previousLinks[j].get("target").port;
              if (prevTargPort) {
                newLink[i].set({
                  target: prevTargPort ? {
                    id: target.id,
                    port: prevTargPort
                  } : {
                    id: target.id
                  }
                });
              }
              if (prevPort) {
                const defLink = graph.getConnectedLinks(newLink[i].triangle, {
                  inbound: true
                })[0];
                defLink.set({
                  source: prevPort ? {
                    id: source.id,
                    port: prevPort
                  } : {
                    id: source.id
                  }
                });
              }
            }
            const init = (0, getInitRappidShared)();
            const prevLogical = init.opmModel.getLogicalElementByVisualId(previousLinks[j].id);
            const newLogical = init.opmModel.getLogicalElementByVisualId(newLink[0].id);
            prevLogical.linkType = newLogical.linkType;
            prevLogical.event = newLogical.event;
            prevLogical.condition = newLogical.condition;
            prevLogical.linkConnectionType = newLogical.linkConnectionType;
            previousLinks[j].remove();
            if (!areBothPaths(newLink[i], previousLinks[j])) {
              previousLinks[j].remove();
            }
            // }
          }
        }
        for (let j = 0; j < (reverseDirectionpreviousLinks ? reverseDirectionpreviousLinks.length : 0); j++) {
          // if (reverseDirectionpreviousLinks[j] && !newLink.includes(reverseDirectionpreviousLinks[j])) {
          // if the new and previous links are consumption & result
          // if (((reverseDirectionpreviousLinks[j] instanceof ResultLink) && (newLink[0] instanceof ConsumptionLink)) ||
          //   ((reverseDirectionpreviousLinks[j] instanceof ConsumptionLink) && (newLink[0] instanceof ResultLink))) {
          //   // remove the consumption\result link and add an effect link to replace the consumption & result links
          //   graph.removeCells(newLink.pop());
          //   newLink.push(new EffectLink(source, target, isCondition, isEvent));
          //   newLink[0].set('previousTargetId', target.id);
          //   newLink[0].set('previousSourceId', source.id);
          //   newLink[0].set('name', 'Effect');
          //   graph.addCells(newLink); // add the new link to the graph
          // }
          if (newLink[i] instanceof OpmProceduralLink && reverseDirectionpreviousLinks[j] instanceof OpmProceduralLink || newLink[i] instanceof OpmStructuralLink && reverseDirectionpreviousLinks[j] instanceof OpmStructuralLink || source instanceof Note || target instanceof Note) {
            if (!areBothPaths(newLink[i], reverseDirectionpreviousLinks[j])) {
              reverseDirectionpreviousLinks[j].remove();
            }
          }
          // }
        }
      }
    }
    for (let i = 0; i < newLink.length; i++) {
      // SLAYER: I'm so sorry - Alon: Not forgiven
      newLink[i].attributes.Path = undefined;
    }
  }
  /*
  drawLinkSilent(graph, linkName, source, target, id?: string) {
    const isCondition = linkName.includes('Condition');
    const isEvent = linkName.includes('Event');
    let newLink;
    if (linkName.includes('Agent')) {
      newLink = new AgentLink(source, target, isCondition, isEvent, id);
    } else if (linkName.includes('Instrument')) {
      newLink = new InstrumentLink(source, target, isCondition, isEvent, id);
    } else if (linkName.includes('Invocation')) {
      newLink = new InvocationLink(source, target, isCondition, isEvent, id);
    } else if (linkName.includes('Result')) {
      newLink = new ResultLink(source, target, isCondition, isEvent, id);
    } else if (linkName.includes('Consumption')) {
      newLink = new ConsumptionLink(source, target, isCondition, isEvent, id);
    } else if (linkName.includes('Effect')) {
      newLink = new EffectLink(source, target, isCondition, isEvent, id);
    } else if (linkName.includes('Overtime_exception')) {
      newLink = new OvertimeExceptionLink(source, target, isCondition, isEvent, id);
    } else if (linkName.includes('Undertime_exception')) {
      newLink = new UndertimeExceptionLink(source, target, isCondition, isEvent, id);
    } else if (linkName.includes('OvertimeUndertime-exception')) {
      newLink = new OvertimeUndertimeExceptionLink(source, target, isCondition, isEvent, id);
    } else if (linkName.includes('Unidirectional')) {
      newLink = new UnidirectionalTaggedLink(source, target, id);
    } else if (linkName.includes('Bidirectional')) {
      newLink = new BiDirectionalTaggedLink(source, target, id);
    } else if (linkName.includes('Aggregation')) {
      newLink = new AggregationLink(source, target, graph, id);
    } else if (linkName.includes('Exhibition')) {
      newLink = new ExhibitionLink(source, target, graph, id);
    } else if (linkName.includes('Generalization')) {
      newLink = new GeneralizationLink(source, target, graph, id);
    } else if (linkName.includes('Instantiation')) {
      newLink = new InstantiationLink(source, target, graph, id);
    }

    graph.addCell(newLink);
     } */
};
function uniteResults(newLink) {
  const src = newLink[0].getSourceElement();
  const trgt = newLink[0].getTargetElement();
  const parentId = trgt.get("parent");
  const parentCell = newLink[0].graph.getCell(parentId);
  if (trgt instanceof OpmState) {
    let allLinks = newLink[0].graph.getConnectedLinks(src, {
      outbound: true
    });
    allLinks = allLinks.filter(item => item.constructor.name === newLink[0].constructor.name && item.graph.getCell(item.get("target").id).get("parent") && !item.get("Path") && item.graph.getCell(item.get("target").id).get("parent") === parentId);
    if (allLinks.length > 1) {
      const point = {
        x: 0,
        y: 0
      };
      const parentPos = parentCell.get("position");
      point.x += parentPos.x + parentCell.get("size").width / 2;
      point.y += parentPos.y + parentCell.get("size").height;
      const closestPort = src.findClosestEmptyPort(point);
      allLinks.forEach(link => {
        link.set("source", {
          id: link.get("source").id,
          port: closestPort !== -1 ? closestPort : 0
        });
        link.getVisual().sourceVisualElementPort = closestPort;
      });
      newLink[0].repositionPort("source", src, {
        outbound: true
      }, (0, getInitRappidShared)(), true);
    }
  } else if (OPCloudUtils.isInstanceOfDrawnProcess(src) && OPCloudUtils.isInstanceOfDrawnObject(trgt)) {
    const allLinks = trgt.getVisual().getLinks().inGoing.filter(l => l.type === linkType.Result).map(v => trgt.graph.getCell(v.id)).filter(c => c);
    if (allLinks.length > 1) {
      const point = {
        x: 0,
        y: 0
      };
      const pos = src.get("position");
      point.x += pos.x + src.get("size").width / 2;
      point.y += pos.y + src.get("size").height;
      const closestPort = trgt.findClosestEmptyPort(point);
      allLinks.forEach(link => {
        link.set("target", {
          id: link.get("target").id,
          port: closestPort
        });
        link.getVisual().targetVisualElementPort = closestPort;
      });
      newLink[0].repositionPort("target", trgt, {
        inbound: true
      }, (0, getInitRappidShared)(), false);
    }
  }
}
function uniteConsumptions(newLink) {
  const src = newLink[0].getSourceElement();
  const trgt = newLink[0].getTargetElement();
  const parentId = src.get("parent");
  const parentCell = newLink[0].graph.getCell(parentId);
  if (!(src instanceof OpmState)) {
    return;
  }
  let allLinks = newLink[0].graph.getConnectedLinks(trgt, {
    inbound: true
  });
  allLinks = allLinks.filter(item => item.constructor.name === newLink[0].constructor.name && item.graph.getCell(item.get("source").id).get("parent") && !item.get("Path") && item.graph.getCell(item.get("source").id).get("parent") === parentId);
  if (allLinks.length > 1) {
    const point = {
      x: 0,
      y: 0
    };
    const parentPos = parentCell.get("position");
    point.x += parentPos.x + parentCell.get("size").width / 2;
    point.y += parentPos.y + parentCell.get("size").height;
    const closestPort = trgt.findClosestEmptyPort(point);
    allLinks.forEach(link => {
      link.set("target", {
        id: link.get("target").id,
        port: closestPort !== -1 ? closestPort : 0
      });
      link.getVisual().targetVisualElementPort = closestPort;
    });
    newLink[0].repositionPort("target", trgt, {
      inbound: true
    }, (0, getInitRappidShared)(), false);
  }
}
function uniteAgentsAndInstruments(newLink) {
  const src = newLink[0].getSourceElement();
  const trgt = newLink[0].getTargetElement();
  const parentId = src.get("parent");
  const parentCell = newLink[0].graph.getCell(parentId);
  if (OPCloudUtils.isInstanceOfDrawnState(src) === false) {
    return;
  }
  let allLinks = newLink[0].graph.getConnectedLinks(trgt, {
    inbound: true
  });
  allLinks = allLinks.filter(item => (item.constructor.name.includes("Instrument") || item.constructor.name.includes("Agent")) && item.graph.getCell(item.get("source").id).get("parent") && !item.get("Path") && item.graph.getCell(item.get("source").id).get("parent") === parentId);
  if (allLinks.length > 1) {
    const point = {
      x: 0,
      y: 0
    };
    const parentPos = parentCell.get("position");
    point.x += parentPos.x + parentCell.get("size").width / 2;
    point.y += parentPos.y + parentCell.get("size").height;
    const closestPort = trgt.findClosestEmptyPort(point);
    for (const link of allLinks) {
      link.set("target", {
        id: link.get("target").id,
        port: closestPort
      });
      link.getVisual().targetVisualElementPort = closestPort;
    }
    newLink[0].repositionPort("target", trgt, {
      inbound: true
    }, (0, getInitRappidShared)(), false);
  }
}
function InOutLinkpair(source, target, newLink, graph, isCondition, isEvent, isNegation) {
  // for (let i = 0; i < numOfconnectedLinks; i++) {
  //   if (connectedLinks[i].get('name') === 'Consumption' && connectedLinks[i].attributes.fromObject) {
  //     connectedLinks[i].set({
  //       source: {id: graph.getCell(source.attributes.father).getEmbeddedCells()[1].id}
  //     });
  //   } else if (connectedLinks[i].get('name') === 'Result' && connectedLinks[i].attributes.fromState) {
  //     connectedLinks[i].set({
  //       target: {id: graph.getCell(source.attributes.father).getEmbeddedCells()[1].id}
  //     });
  //   }
  //   return;
  // }
  const source_is_state = source instanceof OpmState;
  const state = source_is_state ? source : target;
  const process = source_is_state ? target : source;
  const children = graph.getCell(state.attributes.father).getEmbeddedCells().filter(cell => !(cell instanceof OpmEllipsis));
  for (let child = 0; child < children.length; child++) {
    if (children[child].attributes.id !== state.attributes.id) {
      continue;
    }
    let next = children[child + 1] ? graph.getCell(children[child + 1].attributes.id) : undefined;
    if (!next) {
      next = child > 0 ? graph.getCell(children[0].attributes.id) : undefined;
    }
    if (!next) {
      return;
    }
    newLink.push(source_is_state ? new ConsumptionLink(state, process, isCondition, isEvent, isNegation) : new ResultLink(process, state, false, false));
    newLink.push(source_is_state ? new ResultLink(process, next, false, false) : new ConsumptionLink(next, process, isCondition, isEvent, isNegation));
  }
}
function areBothPaths(newLink, prevLink) {
  return !!prevLink.attributes.Path && (newLink instanceof ConsumptionLink_ConsumptionLink && prevLink instanceof ResultLink_ResultLink || newLink instanceof ResultLink_ResultLink && prevLink instanceof ConsumptionLink_ConsumptionLink);
}
function removePreviousSplitPairs(source, target, graph) {
  // if (checkIfNeedToRemovePair(source, target, graph)) {
  //   let linkArr = (graph.getConnectedLinks(source).length > 1) ? graph.getConnectedLinks(source) : graph.getConnectedLinks(target);
  //   for (let i = 0; i < linkArr.length; i++) {
  //     if(linkArr[i].partner) {
  //       console.log('oh man');
  //       linkArr[i].remove();
  //       break;
  //     }
  //   }
  // }
}
function checkIfNeedToRemovePair(source, target, graph) {
  let shouldEraseLinkPair = false;
  let father = graph.getCell(source) instanceof OpmObject ? graph.getCell(source).getParent() : graph.getCell(target).getParent();
  if (father instanceof OpmObject && father.hasStates()) {
    const embeddedStates = father.getEmbeddedCells().filter(child => child instanceof OpmState);
    for (let embeddedState = 0; embeddedState <= embeddedStates.length - 1; embeddedState++) {
      if (graph.getCell(source) instanceof OpmState && source.id === embeddedStates[embeddedState].id && embeddedStates[embeddedState + 1] === undefined) {
        shouldEraseLinkPair = true;
      }
    }
    return shouldEraseLinkPair;
  }
}
/*function connectedWithPathable(source, target): ConsumptionLink | ResultLink {
  const graph = source.graph;
  const links = graph.getConnectedLinks(source, { outbound: true });
  for (let i = 0; i < (links ? links.length : 0); i++)
    if (links[i].targetElement === target && (links[i] instanceof ConsumptionLink || links[i] instanceof ResultLink))
      return links[i];
  return undefined;
}*/
function lastSubProcess(processElement, graph) {
  const embeds = processElement.get("embeds").filter(id => graph.getCell(id).get("type") === "opm.Process");
  const lastEmbedId = embeds[embeds.length - 1];
  return graph.getCell(lastEmbedId);
}
function selfInvocationLink(sourceElement, processCell, tPort, newLink, graph) {
  // const processCell = link.getTargetElement();
  // const sourceElement = link.getSourceElement();
  const existingLink = processCell.hasSelfInvocation();
  tPort = tPort || "13";
  if (existingLink) {
    // set destination to a port if one is picked.
    // return 'Self Invocation already defined for this process';
    if (processCell.isInZooming()) {
      const ctPort = existingLink.get("target") && existingLink.get("target").port;
      if (tPort && tPort !== ctPort) {
        existingLink.set("target", {
          id: processCell.get("id"),
          port: tPort
        });
        existingLink.UpdateVertices();
      }
    }
    return "Self Invocation already defined for this process";
  }
  if (processCell.isInZooming()) {
    newLink.push(new SelfInvocationLinkInZoom(lastSubProcess(processCell, graph), processCell, tPort));
  } else if (sourceElement === processCell) {
    // self invocation
    newLink.push(new SelfInvocationLink(processCell, graph));
  }
  return "";
}