// Source: decompiled/deobfuscated.js
// Original path: ./src/app/ImportOPX/OPX.Elements_Instances.ts
// Extracted by opm-extracted/tools/extract.mjs


//---------------------------------- Things Instances Section --------------------------------------------------------
function handleThingInstances(ImportedOpmModel, InZoomedTree, UnfoldedTree, MainEntities, UnfoldMainEntities, ChildrenContainer, Instances, VThing, id, log, LogicalThing, ThingData) {
  let opd_Name;
  if (Instances) {
    for (let i = 0; i < Instances.length; i++) {
      opd_Name = Instances[i].$.name;
      for (let tree of InZoomedTree) {
        let Layout = tree.getLayout(opd_Name, VThing, id);
        if (Layout) {
          opd_Name = handleOPDName(opd_Name);
          if (opd_Name) {
            const params1 = {
              id: uuid(),
              xPos: parseInt(Layout.data.x),
              yPos: parseInt(Layout.data.y),
              width: parseInt(Layout.data.width),
              height: parseInt(Layout.data.height)
            };
            ImportedOpmModel.currentOpd = ImportedOpmModel.getOpdByName(opd_Name);
            if (LogicalThing && ImportedOpmModel.currentOpd) {
              if (VThing === "VisualObject") {
                let visualObject = ImportedOpmModel.createNewVisualElementInsertToCurrentOpd(params1, LogicalThing);
                LogicalThing.add(visualObject);
                HandleMainEntitiesInzoom(Layout, visualObject, ImportedOpmModel.currentOpd.id, MainEntities, ChildrenContainer);
              } else {
                let visualProcess = ImportedOpmModel.createNewVisualElementInsertToCurrentOpd(params1, LogicalThing);
                LogicalThing.add(visualProcess);
                HandleMainEntitiesInzoom(Layout, visualProcess, ImportedOpmModel.currentOpd.id, MainEntities, ChildrenContainer);
              }
            } else if (ThingData && ImportedOpmModel.currentOpd) {
              let CheckThingExist = ImportedOpmModel.getLogicalElementByVisualId(ThingData.id);
              const params2 = {
                text: ThingData.text,
                affiliation: ThingData.affiliation,
                essence: ThingData.essence,
                id: ThingData.id,
                xPos: parseInt(Layout.data.x),
                yPos: parseInt(Layout.data.y),
                width: parseInt(Layout.data.width),
                height: parseInt(Layout.data.height)
              };
              if (VThing === "VisualObject") {
                if (CheckThingExist) {
                  let visualObject = ImportedOpmModel.createNewVisualElementInsertToCurrentOpd(params1, CheckThingExist);
                  CheckThingExist.add(visualObject);
                  HandleMainEntitiesInzoom(Layout, visualObject, ImportedOpmModel.currentOpd.id, MainEntities, ChildrenContainer);
                } else {
                  let LogicalObject = logicalFactoryInsertCurrentOPD(EntityType.Object, ImportedOpmModel, params2);
                  let visualObject = ImportedOpmModel.getVisualElementById(ThingData.id);
                  HandleMainEntitiesInzoom(Layout, visualObject, ImportedOpmModel.currentOpd.id, MainEntities, ChildrenContainer);
                }
              } else if (CheckThingExist) {
                let visualProcess = ImportedOpmModel.createNewVisualElementInsertToCurrentOpd(params1, CheckThingExist);
                CheckThingExist.add(visualProcess);
                HandleMainEntitiesInzoom(Layout, visualProcess, ImportedOpmModel.currentOpd.id, MainEntities, ChildrenContainer);
              } else {
                let LogicalProcess = logicalFactoryInsertCurrentOPD(EntityType.Process, ImportedOpmModel, params2);
                let visualProcess = ImportedOpmModel.getVisualElementById(ThingData.id);
                HandleMainEntitiesInzoom(Layout, visualProcess, ImportedOpmModel.currentOpd.id, MainEntities, ChildrenContainer);
              }
            }
          }
        }
      }
      for (let tree of UnfoldedTree) {
        let Layout = tree.getLayout(opd_Name, VThing, id);
        if (Layout) {
          opd_Name = handleOPDName(opd_Name);
          const params1 = {
            id: uuid(),
            xPos: parseInt(Layout.data.x),
            yPos: parseInt(Layout.data.y),
            width: parseInt(Layout.data.width),
            height: parseInt(Layout.data.height)
          };
          if (opd_Name) {
            ImportedOpmModel.currentOpd = ImportedOpmModel.getOpdByName(opd_Name);
            if (LogicalThing && ImportedOpmModel.currentOpd) {
              if (VThing === "VisualObject") {
                let visualObject = ImportedOpmModel.createNewVisualElementInsertToCurrentOpd(params1, LogicalThing);
                LogicalThing.add(visualObject);
                HandleMainEntitiesUnfold(Layout, visualObject, ImportedOpmModel.currentOpd.id, UnfoldMainEntities);
              } else {
                let visualProcess = ImportedOpmModel.createNewVisualElementInsertToCurrentOpd(params1, LogicalThing);
                LogicalThing.add(visualProcess);
                HandleMainEntitiesUnfold(Layout, visualProcess, ImportedOpmModel.currentOpd.id, UnfoldMainEntities);
              }
            } else if (ThingData && ImportedOpmModel.currentOpd) {
              let CheckThingExist = ImportedOpmModel.getLogicalElementByVisualId(ThingData.id);
              const params2 = {
                text: ThingData.text,
                affiliation: ThingData.affiliation,
                essence: ThingData.essence,
                id: ThingData.id,
                xPos: parseInt(Layout.data.x),
                yPos: parseInt(Layout.data.y),
                width: parseInt(Layout.data.width),
                height: parseInt(Layout.data.height)
              };
              if (VThing === "VisualObject") {
                if (CheckThingExist) {
                  let visualObject = ImportedOpmModel.createNewVisualElementInsertToCurrentOpd(params1, CheckThingExist);
                  CheckThingExist.add(visualObject);
                  HandleMainEntitiesUnfold(Layout, visualObject, ImportedOpmModel.currentOpd.id, UnfoldMainEntities);
                } else {
                  let LogicalObject = logicalFactoryInsertCurrentOPD(EntityType.Object, ImportedOpmModel, params2);
                  let visualObject = ImportedOpmModel.getVisualElementById(ThingData.id);
                  HandleMainEntitiesUnfold(Layout, visualObject, ImportedOpmModel.currentOpd.id, UnfoldMainEntities);
                }
              } else if (CheckThingExist) {
                let visualProcess = ImportedOpmModel.createNewVisualElementInsertToCurrentOpd(params1, CheckThingExist);
                CheckThingExist.add(visualProcess);
                HandleMainEntitiesUnfold(Layout, visualProcess, ImportedOpmModel.currentOpd.id, UnfoldMainEntities);
              } else {
                let LogicalProcess = logicalFactoryInsertCurrentOPD(EntityType.Process, ImportedOpmModel, params2);
                let visualProcess = ImportedOpmModel.getVisualElementById(ThingData.id);
                HandleMainEntitiesUnfold(Layout, visualProcess, ImportedOpmModel.currentOpd.id, UnfoldMainEntities);
              }
            }
          }
        }
      }
    }
  } else {
    EditLogFile(log, "Info: " + VThing + " " + id, "Check .opx version file , Thing Instances Issue", false);
  }
}
//------------------------------------------------------Link Instances Section ------------------------------------------
/**
 *
 * @param LogiclLink
 * @param SourceID
 * @param TargetID
 * @param id
 * @param OPD
 * @returns {boolean}
 * @constructor
 * Handle Structural Links duplicates in OPX File
 */
function CheckStructuralLinkExist(LogiclLink, SourceID, TargetID, id, OPD) {
  for (let visualInOpd of OPD.visualElements) {
    for (let visualInLogical of LogiclLink.visualElements) {
      if (visualInOpd.id === visualInLogical.id) {
        if (visualInOpd.sourceVisualElement.id === SourceID && visualInOpd.targetVisualElements[0].id === TargetID) {
          return true;
        }
      }
    }
  }
  return false;
}
function OPXStructuralParamsFull(ImportedOpmModel, LinkData, Layout, id) {
  const params = {
    id: uuid(),
    sourceElementId: MatchLinksSourceOrTarget(Layout.dataSource.sourceId, ImportedOpmModel.currentOpd, ImportedOpmModel),
    targetElementId: MatchLinksSourceOrTarget(Layout.dataTarget.destinationId, ImportedOpmModel.currentOpd, ImportedOpmModel),
    linkConnectionType: LinkData.linkConnectionType,
    linkType: LinkData.linkType,
    symbolPos: checkTrianglePosition(VisualFundamentalRelationSection(Layout.dataVisual, id))
  };
  return params;
}
function OPXStructuralParamsPartial(ImportedOpmModel, Layout, id) {
  const params = {
    id: uuid(),
    sourceElementId: MatchLinksSourceOrTarget(Layout.dataSource.sourceId, ImportedOpmModel.currentOpd, ImportedOpmModel),
    targetElementId: MatchLinksSourceOrTarget(Layout.dataTarget.destinationId, ImportedOpmModel.currentOpd, ImportedOpmModel),
    symbolPos: checkTrianglePosition(VisualFundamentalRelationSection(Layout.dataVisual, id))
  };
  return params;
}
function OPXTaggedParamsFull(ImportedOpmModel, LinkData, Layout, id) {
  const params = {
    id: LinkData.id,
    sourceElementId: MatchLinksSourceOrTarget(Layout.dataSource.sourceId, ImportedOpmModel.currentOpd, ImportedOpmModel),
    targetElementId: MatchLinksSourceOrTarget(Layout.dataTarget.destinationId, ImportedOpmModel.currentOpd, ImportedOpmModel),
    linkConnectionType: LinkData.linkConnectionType,
    linkType: LinkData.linkType,
    BreakPoints: VisualGeneralRelationSection(Layout.dataVisual, id),
    tag: LinkData.forwardTag,
    backwardTag: LinkData.backwardTag
  };
  return params;
}
function OPXTaggedParamsPartial(ImportedOpmModel, Layout, id) {
  const params = {
    id: uuid(),
    sourceElementId: MatchLinksSourceOrTarget(Layout.dataSource.sourceId, ImportedOpmModel.currentOpd, ImportedOpmModel),
    targetElementId: MatchLinksSourceOrTarget(Layout.dataTarget.destinationId, ImportedOpmModel.currentOpd, ImportedOpmModel),
    BreakPoints: VisualGeneralRelationSection(Layout.dataVisual, id)
  };
  return params;
}
function OPXProceduralParamsPartial(ImportedOpmModel, Layout, id) {
  const params = {
    id: uuid(),
    sourceElementId: MatchLinksSourceOrTarget(Layout.data.sourceId, ImportedOpmModel.currentOpd, ImportedOpmModel),
    targetElementId: MatchLinksSourceOrTarget(Layout.data.destinationId, ImportedOpmModel.currentOpd, ImportedOpmModel),
    BreakPoints: VisualLinkSection(Layout.dataVisual, id)
  };
  return params;
}
function OPXProceduralParamsFull(ImportedOpmModel, LinkData, Layout, id) {
  const params = {
    id: LinkData.id,
    sourceElementId: MatchLinksSourceOrTarget(Layout.data.sourceId, ImportedOpmModel.currentOpd, ImportedOpmModel),
    targetElementId: MatchLinksSourceOrTarget(Layout.data.destinationId, ImportedOpmModel.currentOpd, ImportedOpmModel),
    linkConnectionType: LinkData.linkConnectionType,
    linkType: LinkData.linkType,
    /* sourceConnectedLinks: LinkData.sourceConnectedLinks,
     targetConnectedLinks: LinkData.targetConnectedLinks,
     targetLogicalConnection: LinkData.targetLogicalConnection,
     sourceLogicalConnection: LinkData.sourceLogicalConnection,*/
    condition: LinkData.condition,
    event: LinkData.event,
    BreakPoints: VisualLinkSection(Layout.dataVisual, id)
  };
  return params;
}
function LinkInstanceTree(ImportedOpmModel, Tree, IsFundamental, opd_Name, id, opmRelation, LinkData, log) {
  for (let tree of Tree) {
    if (IsFundamental) {
      let Layout = tree.getRelationLayout(opd_Name, id);
      if (Layout) {
        opd_Name = handleOPDName(opd_Name);
        if (Layout.type === "Fundamental") {
          if (opd_Name && Layout.dataTarget.visible === "true") {
            ImportedOpmModel.currentOpd = ImportedOpmModel.getOpdByName(opd_Name);
            const params1 = OPXStructuralParamsPartial(ImportedOpmModel, Layout, id);
            if (ImportedOpmModel.currentOpd && opmRelation) {
              if (params1.sourceElementId && params1.targetElementId) {
                let visualLink = ImportedOpmModel.createNewVisualElementInsertToCurrentOpd(params1, opmRelation);
                opmRelation.add(visualLink);
              } else {
                EditLogFile(log, "Info: Link ID: " + id + " source: " + params1.sourceElementId + " target: " + params1.targetElementId, "Check .opx version file , Link source / target issue", false);
              }
            } else if (ImportedOpmModel.currentOpd && LinkData) {
              let CheckLinkExist = ImportedOpmModel.getLogicalElementByVisualId(LinkData.id);
              const params2 = OPXStructuralParamsFull(ImportedOpmModel, LinkData, Layout, id);
              if (CheckLinkExist) {
                if (!CheckStructuralLinkExist(CheckLinkExist, params1.sourceElementId, params1.targetElementId, LinkData.id, ImportedOpmModel.currentOpd)) {
                  if (params2.sourceElementId && params2.targetElementId) {
                    let logicalLink = logicalFactoryInsertCurrentOPD(RelationType.Fundamental, ImportedOpmModel, params2);
                  } else {
                    EditLogFile(log, "Info: Link ID: " + id + " source: " + params2.sourceElementId + " target: " + params2.targetElementId, "Check .opx version file , Link source / target issue", false);
                  }
                }
              } else if (params2.sourceElementId && params2.targetElementId) {
                let logicalLink = logicalFactoryInsertCurrentOPD(RelationType.Fundamental, ImportedOpmModel, params2);
              } else {
                EditLogFile(log, "Info: Link ID: " + id + " source: " + params2.sourceElementId + " target: " + params2.targetElementId, "Check .opx version file , Link source / target issue", false);
              }
            }
          }
        }
        if (Layout.type === "General") {
          if (opd_Name) {
            ImportedOpmModel.currentOpd = ImportedOpmModel.getOpdByName(opd_Name);
            const params1 = OPXTaggedParamsPartial(ImportedOpmModel, Layout, id);
            if (ImportedOpmModel.currentOpd && opmRelation) {
              if (params1.sourceElementId && params1.targetElementId) {
                let visualLink = ImportedOpmModel.createNewVisualElementInsertToCurrentOpd(params1, opmRelation);
                opmRelation.add(visualLink);
              } else {
                EditLogFile(log, "Info: Link ID: " + id + " source: " + params1.sourceElementId + " target: " + params1.targetElementId, "Check .opx version file , Link source / target issue", false);
              }
            } else if (ImportedOpmModel.currentOpd && LinkData) {
              let CheckLinkExist = ImportedOpmModel.getLogicalElementByVisualId(LinkData.id);
              const params2 = OPXTaggedParamsFull(ImportedOpmModel, LinkData, Layout, id);
              if (CheckLinkExist) {
                if (!CheckStructuralLinkExist(CheckLinkExist, params1.sourceElementId, params1.targetElementId, LinkData.id, ImportedOpmModel.currentOpd)) {
                  if (params2.sourceElementId && params2.targetElementId) {
                    let logicalLink = logicalFactoryInsertCurrentOPD(RelationType.Tagged, ImportedOpmModel, params2);
                  } else {
                    EditLogFile(log, "Info: Link ID: " + id + " source: " + params2.sourceElementId + " target: " + params2.targetElementId, "Check .opx version file , Link source / target issue", false);
                  }
                }
              } else if (params2.sourceElementId && params2.targetElementId) {
                let logicalLink = logicalFactoryInsertCurrentOPD(RelationType.Tagged, ImportedOpmModel, params2);
              } else {
                EditLogFile(log, "Info: Link ID: " + id + " source: " + params2.sourceElementId + " target: " + params2.targetElementId, "Check .opx version file , Link source / target issue", false);
              }
            }
          }
        }
      }
    } else {
      let Layout = tree.getLinkLayout(opd_Name, id);
      if (Layout) {
        opd_Name = handleOPDName(opd_Name);
        if (opd_Name) {
          ImportedOpmModel.currentOpd = ImportedOpmModel.getOpdByName(opd_Name);
          const params1 = OPXProceduralParamsPartial(ImportedOpmModel, Layout, id);
          if (ImportedOpmModel.currentOpd && opmRelation) {
            if (params1.sourceElementId && params1.targetElementId) {
              let visualLink = ImportedOpmModel.createNewVisualElementInsertToCurrentOpd(params1, opmRelation);
              opmRelation.add(visualLink);
            } else {
              EditLogFile(log, "Info: Link ID: " + id + " source: " + params1.sourceElementId + " target: " + params1.targetElementId, "Check .opx version file , Link source / target issue", false);
            }
          } else if (ImportedOpmModel.currentOpd && LinkData) {
            let CheckLinkExist = ImportedOpmModel.getLogicalElementByVisualId(LinkData.id);
            const params2 = OPXProceduralParamsFull(ImportedOpmModel, LinkData, Layout, id);
            if (CheckLinkExist) {
              if (params2.sourceElementId && params2.targetElementId) {
                let visualLink = ImportedOpmModel.createNewVisualElementInsertToCurrentOpd(params1, CheckLinkExist);
                CheckLinkExist.add(visualLink);
              } else {
                EditLogFile(log, "Info: Link ID: " + id + " source: " + params2.sourceElementId + " target: " + params2.targetElementId, "Check .opx version file , Link source / target issue", false);
              }
            } else if (params2.sourceElementId && params2.targetElementId) {
              let logicalLink = logicalFactoryInsertCurrentOPD(RelationType.Procedural, ImportedOpmModel, params2);
              if (logicalLink.targetLogicalConnection) {
                logicalLink.visualElements[0].targetLogicalConnection = logicalLink.targetLogicalConnection;
              }
              if (logicalLink.sourceLogicalConnection) {
                logicalLink.visualElements[0].sourceLogicalConnection = logicalLink.sourceLogicalConnection;
              }
            } else {
              EditLogFile(log, "Info: Link ID: " + id + " source: " + params2.sourceElementId + " target: " + params2.targetElementId, "Check .opx version file , Link source / target issue", false);
            }
          }
        }
      }
    }
  }
}
function handleLinkInstances(ImportedOpmModel, InZoomedTree, UnfoldedTree, Instances, id, IsFundamental, log, opmRelation, LinkData) {
  let opd_Name;
  if (Instances) {
    for (let i = 0; i < Instances.length; i++) {
      opd_Name = Instances[i].$.name;
      //For Inzoomed Tree
      LinkInstanceTree(ImportedOpmModel, InZoomedTree, IsFundamental, opd_Name, id, opmRelation, LinkData, log);
      // For Unfolded Tree
      LinkInstanceTree(ImportedOpmModel, UnfoldedTree, IsFundamental, opd_Name, id, opmRelation, LinkData, log);
    }
  } else {
    EditLogFile(log, "Info: Link ID:" + id, "Check .opx version file , Link Instances Issue", false);
  }
}
//---------------------------------------------------State Instances Section ------------------------------------------------
function handleStateInstances(ImportedOpmModel, InZoomedTree, UnfoldedTree, MainEntities, ChildrenContainer, Instances, VThing, Objid, stateID, log, logicalState, StateData) {
  let OPDName;
  if (Instances) {
    for (let inst in Instances) {
      OPDName = Instances[inst].$.name;
      for (let tree of InZoomedTree) {
        let Layout = tree.getLayout(OPDName, VThing, Objid);
        if (Layout) {
          OPDName = handleOPDName(OPDName);
          for (let state in Layout.data) {
            if (Layout.data[state].InstanceAttr[0].$.entityId === stateID) {
              let visual = Layout.data[state].ConnectionEdgeAttr[0].$;
              const params1 = {
                id: uuid(),
                xPos: parseInt(visual.x),
                yPos: parseInt(visual.y),
                width: parseInt(visual.width),
                height: parseInt(visual.height)
              };
              if (Layout.data[state].$.visible === "true" && OPDName) {
                ImportedOpmModel.currentOpd = ImportedOpmModel.getOpdByName(OPDName);
                if (logicalState && ImportedOpmModel.currentOpd) {
                  let visualState = ImportedOpmModel.createNewVisualElementInsertToCurrentOpd(params1, logicalState);
                  logicalState.add(visualState);
                  MatchFatherElements(Objid, visualState, ImportedOpmModel.currentOpd, ImportedOpmModel);
                  HandleMainEntitiesInzoom(Layout, visualState, ImportedOpmModel.currentOpd.id, MainEntities, ChildrenContainer);
                } else if (StateData && ImportedOpmModel.currentOpd) {
                  let checkLogicalExist = ImportedOpmModel.getLogicalElementByVisualId(StateData.id);
                  const params2 = {
                    id: StateData.id,
                    text: StateData.text,
                    stateType: StateData.stateType,
                    xPos: parseInt(visual.x),
                    yPos: parseInt(visual.y),
                    width: parseInt(visual.width),
                    height: parseInt(visual.height)
                  };
                  if (checkLogicalExist) {
                    let visualState = ImportedOpmModel.createNewVisualElementInsertToCurrentOpd(params1, checkLogicalExist);
                    checkLogicalExist.add(visualState);
                    MatchFatherElements(Objid, visualState, ImportedOpmModel.currentOpd, ImportedOpmModel);
                    HandleMainEntitiesInzoom(Layout, visualState, ImportedOpmModel.currentOpd.id, MainEntities, ChildrenContainer);
                  } else {
                    let LogicalState = logicalFactoryInsertCurrentOPD(EntityType.State, ImportedOpmModel, params2);
                    let visualState = ImportedOpmModel.getVisualElementById(StateData.id);
                    MatchFatherElements(Objid, visualState, ImportedOpmModel.currentOpd, ImportedOpmModel);
                    HandleMainEntitiesInzoom(Layout, visualState, ImportedOpmModel.currentOpd.id, MainEntities, ChildrenContainer);
                  }
                }
              }
            }
          }
        }
      }
      for (let tree of UnfoldedTree) {
        let Layout = tree.getLayout(OPDName, VThing, Objid);
        if (Layout) {
          OPDName = handleOPDName(OPDName);
          for (let state in Layout.data) {
            if (Layout.data[state].InstanceAttr[0].$.entityId === stateID) {
              let visual = Layout.data[state].ConnectionEdgeAttr[0].$;
              const params1 = {
                id: uuid(),
                xPos: parseInt(visual.x),
                yPos: parseInt(visual.y),
                width: parseInt(visual.width),
                height: parseInt(visual.height)
              };
              if (Layout.data[state].$.visible === "true" && OPDName) {
                ImportedOpmModel.currentOpd = ImportedOpmModel.getOpdByName(OPDName);
                if (logicalState && ImportedOpmModel.currentOpd) {
                  let visualState = ImportedOpmModel.createNewVisualElementInsertToCurrentOpd(params1, logicalState);
                  logicalState.add(visualState);
                  MatchFatherElements(Objid, visualState, ImportedOpmModel.currentOpd, ImportedOpmModel);
                } else if (StateData && ImportedOpmModel.currentOpd) {
                  let checkLogicalExist = ImportedOpmModel.getLogicalElementByVisualId(StateData.id);
                  const params2 = {
                    id: StateData.id,
                    text: StateData.text,
                    stateType: StateData.stateType,
                    xPos: parseInt(visual.x),
                    yPos: parseInt(visual.y),
                    width: parseInt(visual.width),
                    height: parseInt(visual.height)
                  };
                  if (checkLogicalExist) {
                    let visualState = ImportedOpmModel.createNewVisualElementInsertToCurrentOpd(params1, checkLogicalExist);
                    checkLogicalExist.add(visualState);
                    MatchFatherElements(Objid, visualState, ImportedOpmModel.currentOpd, ImportedOpmModel);
                  } else {
                    let LogicalState = logicalFactoryInsertCurrentOPD(EntityType.State, ImportedOpmModel, params2);
                    let visualState = ImportedOpmModel.getVisualElementById(StateData.id);
                    MatchFatherElements(Objid, visualState, ImportedOpmModel.currentOpd, ImportedOpmModel);
                  }
                }
              }
            }
          }
        }
      }
    }
  } else {
    EditLogFile(log, "Info: State ID:" + stateID + " Object ID: " + Objid, "Check .opx version file , State Instances Issue", false);
  }
}