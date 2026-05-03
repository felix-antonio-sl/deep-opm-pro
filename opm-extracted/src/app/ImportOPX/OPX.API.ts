// Source: decompiled/deobfuscated.js
// Original path: ./src/app/ImportOPX/OPX.API.ts
// Extracted by opm-extracted/tools/extract.mjs

/**
 * OPX API
 * Created by ta2er on 1/04/2018.
 * Helper functions for Import OPX file
 * basically to match OPX file to OPMModel
 */

/**
 *
 * @param treeSet OPX Tree
 * @param parentid
 * @returns {boolean}
 * Check if Parent already Exist In OPD Tree in OPX File
 */
function checkExist(treeSet, parentid) {
  for (let node in treeSet) {
    if (treeSet[node].getParentID() === parentid) {
      return false;
    }
  }
  return true;
}
/**
 *
 * @param opxTree
 * @param {OpmModel} ImportedOpmModel
 * @constructor
 * Create OPMModel OPD's From OPX Tree File
 */
function CreateOPDsModel(opxTree, ImportedOpmModel) {
  for (let tree in opxTree) {
    if (opxTree[tree].children) {
      let children = opxTree[tree].children;
      for (let child = 0; child < children.length; child++) {
        let Name = children[child].$.name.trim();
        let OpmOPD = new OpmOpd(Name);
        let ParentID = ImportedOpmModel.getOpdIDByName(opxTree[tree].parentName.trim());
        OpmOPD.SetParent(ParentID);
        ImportedOpmModel.addOpd(OpmOPD);
      }
    }
  }
  ImportedOpmModel.currentOpd = ImportedOpmModel.getOpdByName("SD");
}
/**
 *
 * @param json
 * @param OPD (Root OPD in OPX file , the first opd Object in OPX Visual Section ,{Inzoom/Unfold})
 * @param InZoomedTree , tree Structure from Loaders
 * @param UnfoldedTree , tree Structure from Loaders
 */
function load_Inzoomed_sections(json, OPD, InZoomedTree, UnfoldedTree) {
  let Root = OPD;
  let Inzoomed = json.OPX.OPMSystem[0].VisualPart[0].OPD[0].InZoomed[0].OPD;
  // Recursive function
  traverseInzoomTree(Root, Inzoomed, InZoomedTree, UnfoldedTree);
}
function load_Unfolded_sections(json, OPD, UnfoldedTree, InzoomedTree) {
  let Root = OPD;
  let Unfolded = json.OPX.OPMSystem[0].VisualPart[0].OPD[0].Unfolded[0];
  // Recursive function
  traverseUnfoldTree(Root, Unfolded, UnfoldedTree, InzoomedTree);
}
/**
 *
 * @param Root (Root OPD in OPX)
 * @param Node  (OPD )
 * @param InZoomedTree  , Tree Structure
 * @param unfoldedTree
 *
 * BFS Recursive traverse over Inzoomed Tree in OPX file
 * call , Unfolded Traverse if there is unfolded opd's in inzoomed opd's
 */
function traverseInzoomTree(Root, Node, InZoomedTree, unfoldedTree) {
  for (let i in Node) {
    if (Node[i]) {
      let children = [];
      for (let child = 0; child < Node.length; child++) {
        children.push(Node[child]);
      }
      if (checkExist(InZoomedTree, Root.$.id)) {
        InZoomedTree.push(new InzoomedTree(Root.$.id, Root.$.name, children));
      }
      let InzoomedNode = Node[i].InZoomed[0].OPD;
      if (InzoomedNode) {
        for (let unfold = 0; unfold < InzoomedNode.length; unfold++) {
          // Check if there is unfolded also
          traverseUnfoldTree(InzoomedNode[unfold], InzoomedNode[unfold].Unfolded[0], unfoldedTree, InzoomedTree);
        }
      }
      // Recursive call , Regular BFS
      traverseInzoomTree(Node[i], Node[i].InZoomed[0].OPD, InZoomedTree, unfoldedTree);
    }
  }
}
/**
 *
 * @param Root (Root OPD in OPX)
 * @param Node  (OPD )
 * @param unfoldedTree
 * @param InzoomedTree
 * BFS Recursive traverse over Unfolded Tree in OPX file
 * call , Inzoomed Traverse if there is Inzoomed opd's in Unfolded opd's
 */
function traverseUnfoldTree(Root, Node, unfoldedTree, InzoomedTree) {
  let unfolding_Properties = Node.UnfoldingProperties;
  for (let i in unfolding_Properties) {
    if (unfolding_Properties[i]) {
      let children = [];
      for (let child = 0; child < unfolding_Properties.length; child++) {
        children.push(unfolding_Properties[child].OPD[0]);
        let UnfoldedNode = unfolding_Properties[child].OPD;
        if (UnfoldedNode) {
          for (let inzoom = 0; inzoom < UnfoldedNode.length; inzoom++) {
            // Check If there is inzoomed also
            traverseInzoomTree(UnfoldedNode[inzoom], UnfoldedNode[inzoom].InZoomed[0].OPD, InzoomedTree, unfoldedTree);
          }
        }
      }
      if (checkExist(unfoldedTree, Root.$.id)) {
        unfoldedTree.push(new UnfoldedTree(Root.$.id, Root.$.name, children));
      }
      //Recursive call , Regular BFS
      traverseUnfoldTree(unfolding_Properties[i].OPD[0], unfolding_Properties[i].OPD[0].Unfolded[0], unfoldedTree, InzoomedTree);
    }
  }
}
/**
 *
 * @param opd_Name
 * @returns {any}
 * OPX File OPD Name is different this Method help to fix String Name
 */
function handleOPDName(opd_Name) {
  opd_Name = opd_Name.substring(opd_Name.indexOf("(") + 1);
  opd_Name = opd_Name.substring(opd_Name.indexOf(":") + 1);
  opd_Name = opd_Name.substring(0, opd_Name.indexOf(")"));
  opd_Name = opd_Name.trim();
  return opd_Name;
}
/**
 *
 * @param linkname in OPX file
 * @returns {string}
 * Match Link Name From OPX File to OPMModel Link Names
 */
function handleLinkname(linkname) {
  linkname = linkname.replace(/[0-9]/g, "");
  linkname = linkname.replace("UniDirectionalRelation", "Unidirectional");
  linkname = linkname.replace("BiDirectionalRelation", "Bidirectional");
  linkname = linkname.replace("Featuring", "Exhibition");
  linkname = linkname.replace("Condition", "ConditionInstrument");
  linkname = linkname.replace("Event", "EventInstrument");
  linkname = linkname.replace("Instantination", "Instantiation");
  linkname = linkname.replace("Exception", "Overtime_exception");
  linkname = linkname.replace("Instrument EventInstrument", "EventConsumption");
  return linkname.toString();
}
/**
 *
 * @param linkname
 * @returns {any}
 * Mapping for Links Name as string to Enum link Type
 */
function handleLinkForStructure(linkname) {
  linkname = handleLinkname(linkname);
  linkname = linkname.trim();
  switch (linkname) {
    case "Agent":
      return linkType.Agent;
    case "Instrument":
      return linkType.Instrument;
    case "ConditionInstrument":
      return linkType.Instrument;
    case "EventInstrument":
      return linkType.Instrument;
    case "Consumption":
      return linkType.Consumption;
    case "EventConsumption":
      return linkType.Consumption;
    case "Result":
      return linkType.Result;
    case "Effect":
      return linkType.Effect;
    case "Invocation":
      return linkType.Invocation;
    case "Overtime_exception":
      return linkType.OvertimeException;
    case "Unidirectional":
      return linkType.Unidirectional;
    case "Bidirectional":
      return linkType.Bidirectional;
    case "Aggregation":
      return linkType.Aggregation;
    case "Exhibition":
      return linkType.Exhibition;
    case "Generalization":
      return linkType.Generalization;
    case "Instantiation":
      return linkType.Instantiation;
  }
}
/**
 *
 * @param id
 * @param {OpmOpd} opd
 * @param ImportedOpmModel
 * @returns {string}
 * @constructor
 * Find the right visual element (src & trg) for the right visual link in the same OPD
 */
function MatchLinksSourceOrTarget(id, opd, ImportedOpmModel) {
  let rightVisuals = [];
  for (let logicalelement of ImportedOpmModel.logicalElements) {
    for (let visualelement of logicalelement.visualElements) {
      if (visualelement.id === id) {
        rightVisuals = logicalelement.visualElements;
        break;
      }
    }
  }
  for (let element of rightVisuals) {
    if (opd) {
      for (let velement of opd.visualElements) {
        if (element.id === velement.id) {
          return velement.id;
        }
      }
    }
  }
}
/**
 *
 * @param elementID
 * @param Child
 * @param OPD
 * @param ImportedOpmModel
 * @constructor
 *
 * Update FatherObject for Child Entities in Main Entities
 * States in Object and Sub elements in Inzoomed Thing
 * also Fixing Position , OPCAT Paper Coordinates for sun elements inside inzoomed thing related to the thing position
 * in opcloud position related to paper .
 */
function MatchFatherElements(elementID, Child, OPD, ImportedOpmModel) {
  let Logicalparent = ImportedOpmModel.getLogicalElementByVisualId(elementID);
  for (let visualParent of Logicalparent.visualElements) {
    for (let visualElement of OPD.visualElements) {
      if (visualParent.id === visualElement.id) {
        if (!Child.fatherObject) {
          Child.fatherObject = visualElement;
        }
        if (visualParent instanceof OpmVisualThing) {
          Child.xPos = Child.xPos + visualParent.xPos;
          Child.yPos = Child.yPos + visualParent.yPos;
          visualParent.children.push(Child);
          if (Child instanceof OpmVisualState) {
            let logicalState = Child.logicalElement;
            logicalState.parent = ImportedOpmModel.getLogicalElementByVisualId(Child.fatherObject.id);
          }
        }
      }
    }
  }
}
/**
 *
 * @param Layout
 * @param visualEntity
 * @param opdid
 * @param MainEntities
 * @param ChildrenContainer
 * @constructor
 *
 */
function HandleMainEntitiesInzoom(Layout, visualEntity, opdid, MainEntities, ChildrenContainer) {
  if (Layout.MainEntity && opdid) {
    MainEntities.set(opdid, visualEntity);
  }
  if (Layout.child && opdid) {
    if (ChildrenContainer.get(opdid)) {
      ChildrenContainer.get(opdid).push(visualEntity);
    } else {
      let children = [];
      children.push(visualEntity);
      ChildrenContainer.set(opdid, children);
    }
  }
}
function HandleMainEntitiesUnfold(Layout, visualEntity, opdid, MainEntities) {
  if (Layout.MainEntity && opdid) {
    MainEntities.set(opdid, visualEntity);
  }
}
/**
 *
 * @param Dchecked
 * @param Ichecked
 * @param Fchecked
 * @returns {string}
 * @constructor
 * Matching states for Structure
 */
function StateTypeOpx(Dchecked, Ichecked, Fchecked) {
  if (!Dchecked && !Ichecked && !Fchecked) {
    return "none";
  }
  if (!Dchecked && !Ichecked && Fchecked) {
    return "Final";
  }
  if (!Dchecked && Ichecked && !Fchecked) {
    return "Initial";
  }
  if (!Dchecked && Ichecked && Fchecked) {
    return "finInitial";
  }
  if (Dchecked && !Ichecked && !Fchecked) {
    return "Default";
  }
  if (Dchecked && !Ichecked && Fchecked) {
    return "DefFinal";
  }
  if (Dchecked && Ichecked && !Fchecked) {
    return "DefInitial";
  }
  if (Dchecked && Ichecked && Fchecked) {
    return "all";
  }
}
/**
 *
 * @param OPXLogicalState
 * @param Initial
 * @param Final
 * @param Defualt
 * @constructor
 * Check state type in OPX file as string and save it as boolean param
 */
function OPXLogicalStateType(OPXLogicalState) {
  let Initial = false;
  let Final = false;
  let Defualt = false;
  if (OPXLogicalState.$) {
    if (OPXLogicalState.$.initial) {
      Initial = OPXLogicalState.$.initial === "true";
    }
    if (OPXLogicalState.$.final) {
      Final = OPXLogicalState.$.final === "true";
    }
    if (OPXLogicalState.$.default) {
      Defualt = OPXLogicalState.$.default === "true";
    }
  }
  return {
    initial: Initial,
    final: Final,
    defualt: Defualt
  };
}
function CheckSize(size) {
  return size > 0;
}
// -----------------------------------------check In Root ---------------------------------------------------
/**
 * For Procedural
 * @param VisualLinkSection
 * @param id
 * @returns {boolean}
 * @constructor
 * Check if Link exist in OPD[0] in OPX file
 */
function VisualLinkInRoot(VisualLinkSection, id) {
  if (VisualLinkSection) {
    let size = parseInt(VisualLinkSection.VisualLink.length);
    for (let i = 0; i < size; i++) {
      if (VisualLinkSection.VisualLink[i].InstanceAttr[0].$.entityId === id) {
        return true;
      }
    }
  }
  return false;
}
/**
 * For Structural
 * @param FundamentalRelationSection
 * @param GeneralRelationSection
 * @param id
 * @returns {boolean}
 * @constructor
 * check if Relation Exist in OPD[0] in OPX file
 */
function VisualRelationInRoot(FundamentalRelationSection, GeneralRelationSection, id) {
  if (FundamentalRelationSection) {
    let size1 = parseInt(FundamentalRelationSection.CommonPart.length);
    for (let i = 0; i < size1; i++) {
      let size3 = parseInt(FundamentalRelationSection.CommonPart[i].VisualFundamentalRelation.length);
      for (let k = 0; k < size3; k++) {
        if (FundamentalRelationSection.CommonPart[i].VisualFundamentalRelation[k].InstanceAttr[0].$.entityId === id) {
          return true;
        }
      }
    }
  } else if (GeneralRelationSection) {
    let size2 = parseInt(GeneralRelationSection.VisualGeneralRelation.length);
    for (let i = 0; i < size2; i++) {
      if (GeneralRelationSection.VisualGeneralRelation[i].InstanceAttr[0].$.entityId === id) {
        return true;
      }
    }
  }
  return false;
}
//------------------------------OPX Things and States Sections Handlers------------------------------------------------------------
/**
 * For Object Section in OPX File
 * @param ThingSection
 * @param id
 * @returns {string} as Object properties
 */
function thingSectionObject(ThingSection, id) {
  let size = parseInt(ThingSection.VisualThing.length);
  for (let i = 0; i < size; i++) {
    if (ThingSection.VisualThing[i].ThingData[0].VisualObject) {
      if (ThingSection.VisualThing[i].ThingData[0].VisualObject[0].InstanceAttr[0].$.entityId === id) {
        return ThingSection.VisualThing[i].ThingData[0].VisualObject[0].ConnectionEdgeAttr[0].$;
      }
    }
  }
  return "";
}
/**
 * For States in OPX File
 * @param ThingSection
 * @param idObj
 * @param id
 * @returns {string} as States properties
 */
function thingSectionState(ThingSection, idObj, id) {
  let size = parseInt(ThingSection.VisualThing.length);
  for (let i = 0; i < size; i++) {
    if (ThingSection.VisualThing[i].ThingData[0].VisualObject) {
      if (ThingSection.VisualThing[i].ThingData[0].VisualObject[0].InstanceAttr[0].$.entityId === idObj) {
        if (ThingSection.VisualThing[i].ThingData[0].VisualObject[0].VisualState) {
          let state_size = parseInt(ThingSection.VisualThing[i].ThingData[0].VisualObject[0].VisualState.length);
          for (let s = 0; s < state_size; s++) {
            if (ThingSection.VisualThing[i].ThingData[0].VisualObject[0].VisualState[s].$.visible === "true" && ThingSection.VisualThing[i].ThingData[0].VisualObject[0].VisualState[s].InstanceAttr[0].$.entityId === id) {
              return ThingSection.VisualThing[i].ThingData[0].VisualObject[0].VisualState[s].ConnectionEdgeAttr[0].$;
            }
          }
        }
      }
    }
  }
  return "";
}
/**
 * For Processes in OPX
 * @param ThingSection
 * @param id
 * @returns {string} as Process properties
 */
function thingSectionProcess(ThingSection, id) {
  let size = parseInt(ThingSection.VisualThing.length);
  for (let i = 0; i < size; i++) {
    if (ThingSection.VisualThing[i].ThingData[0].VisualProcess) {
      if (ThingSection.VisualThing[i].ThingData[0].VisualProcess[0].InstanceAttr[0].$.entityId === id) {
        return ThingSection.VisualThing[i].ThingData[0].VisualProcess[0].ConnectionEdgeAttr[0].$;
      }
    }
  }
  return "";
}
//---------------------------Handlers For Links Layout(BreakPoints and Triangle Poistion ) -----------------------
/**
 *
 * @param VisualLinkSection
 * @param id
 * @returns {Array<Position>} Break Points Data From OPX file as array Of Positions
 * @constructor
 */
/*export function getOrXor(VisualLinkSection) {
  const linksListWithOrXor = [];
  if (VisualLinkSection && VisualLinkSection.OrXorGroup) {
    const size = parseInt(VisualLinkSection.OrXorGroup.length);
    for (let i = 0; i < size; i++) {
      const group = [];
      VisualLinkSection.OrXorGroup[i].Member.forEach(member => {
        group.push(member.$.memberId);
      });
      let orXorType;
      if (VisualLinkSection.OrXorGroup[i].$.type === '0') orXorType = 0;  // converting type from opcat to opcloud
      if (VisualLinkSection.OrXorGroup[i].$.type === '1') orXorType = 1;
      linksListWithOrXor.push({group: group, type: orXorType, isSourceGroup: VisualLinkSection.OrXorGroup[i].$.isSourceGroup});
    }
  }
  return linksListWithOrXor;
} */
function VisualLinkSection(VisualLinkSection, id) {
  if (VisualLinkSection) {
    let size = parseInt(VisualLinkSection.VisualLink.length);
    let BreakPoints = [];
    for (let i = 0; i < size; i++) {
      if (VisualLinkSection.VisualLink[i].InstanceAttr[0].$.entityId === id) {
        if (VisualLinkSection.VisualLink[i].BreakPoints) {
          let points = VisualLinkSection.VisualLink[i].BreakPoints[0].Point;
          for (let point in points) {
            BreakPoints.push(new Position(parseInt(points[point].$.x), parseInt(points[point].$.y)));
          }
          return BreakPoints;
        }
      }
    }
  }
}
/**
 *
 * @param FundamentalRelationSection
 * @param id
 * @returns {Position} Triangle Position Data  For Fundamental Links From OPX File
 * @constructor
 */
function VisualFundamentalRelationSection(FundamentalRelationSection, id) {
  if (FundamentalRelationSection) {
    let size = parseInt(FundamentalRelationSection.CommonPart.length);
    for (let i = 0; i < size; i++) {
      if (FundamentalRelationSection.CommonPart[i].VisualFundamentalRelation[0].InstanceAttr[0].$.entityId === id) {
        return new Position(parseInt(FundamentalRelationSection.CommonPart[i].$.x), parseInt(FundamentalRelationSection.CommonPart[i].$.y));
      }
    }
  }
}
/**
 *
 * @param GeneralRelationSection
 * @param id
 * @returns {Array<Position>} Break Points For Tagged Links From OPX File
 * @constructor
 */
function VisualGeneralRelationSection(GeneralRelationSection, id) {
  if (GeneralRelationSection) {
    let size = parseInt(GeneralRelationSection.VisualGeneralRelation.length);
    let BreakPoints = [];
    for (let i = 0; i < size; i++) {
      if (GeneralRelationSection.VisualGeneralRelation[i].InstanceAttr[0].$.entityId === id) {
        if (GeneralRelationSection.VisualGeneralRelation[i].BreakPoints) {
          let points = GeneralRelationSection.VisualGeneralRelation[i].BreakPoints[0].Point;
          for (let point in points) {
            BreakPoints.push(new Position(parseInt(points[point].$.x), parseInt(points[point].$.y)));
          }
          return BreakPoints;
        }
      }
    }
  }
}
//-----------------------------------------Matching Main Entities and Refinee ------------------------------------------------------------------
/**
 *
 * @param {OpmModel} ImportedOpmModel
 * @param MainEntities Inzoomed Main entities Collections
 * @param ChildrenContainer  Inzoomed Children collections per OPD
 * @constructor
 * connect Child with his parent Entity and Update Father Object
 */
function InzoomedEntitiesMatching(ImportedOpmModel, MainEntities, ChildrenContainer) {
  for (let OPD of ImportedOpmModel.opds) {
    for (let visualElement of OPD.visualElements) {
      if (MainEntities.get(OPD.id)) {
        if (MainEntities.get(OPD.id).id === visualElement.id) {
          let MainThing = HandleRefineableEntities(visualElement, ImportedOpmModel);
          if (MainThing) {
            HandleRefineeEntities(MainThing, ImportedOpmModel, true);
          }
          if (ChildrenContainer.get(OPD.id)) {
            for (let child of ChildrenContainer.get(OPD.id)) {
              MatchFatherElements(visualElement.id, child, OPD, ImportedOpmModel);
            }
          }
        }
      }
    }
  }
}
function UnfoldedEntitiesMatching(ImportedOpmModel, MainEntities) {
  for (let OPD of ImportedOpmModel.opds) {
    for (let visualElement of OPD.visualElements) {
      if (MainEntities.get(OPD.id)) {
        if (MainEntities.get(OPD.id).id === visualElement.id) {
          let MainThing = HandleRefineableEntities(visualElement, ImportedOpmModel);
          if (MainThing) {
            HandleRefineeEntities(MainThing, ImportedOpmModel, false);
          }
        }
      }
    }
  }
}
/**
 *
 * @param CurrentOPDindex
 * @param MainThing
 * @param fromInzoom
 * @param {OpmModel} ImportedOpmModel
 * @constructor
 * Update Connections between OPD's by refineeInzooming/Unfolding
 */
function HandleRefineableEntities(MainThing, ImportedOpmModel) {
  let logicalThing = ImportedOpmModel.getLogicalElementByVisualId(MainThing.id);
  for (let itr = 0; itr < ImportedOpmModel.opds.length; itr++) {
    for (let visualInOPD of ImportedOpmModel.opds[itr].visualElements) {
      for (let visualInLogical of logicalThing.visualElements) {
        if (visualInLogical.id === visualInOPD.id && visualInOPD.id != MainThing.id) {
          MainThing.refineable = visualInOPD;
          return MainThing;
        }
      }
    }
  }
}
function HandleRefineeEntities(MainThing, ImportedOpmModel, fromInzoom) {
  for (let opd of ImportedOpmModel.opds) {
    for (let visualInOPD of opd.visualElements) {
      if (visualInOPD instanceof OpmVisualThing) {
        if (visualInOPD.refineable && visualInOPD.id === MainThing.id) {
          let MainThing = visualInOPD;
          let LogicalThing = ImportedOpmModel.getLogicalElementByVisualId(MainThing.id);
          for (let visualInLogical of LogicalThing.visualElements) {
            if (visualInLogical.id != MainThing.id && visualInLogical instanceof OpmVisualThing) {
              if (fromInzoom) {
                visualInLogical.refineeInzooming = MainThing;
              } else {
                visualInLogical.refineeUnfolding = MainThing;
              }
            }
          }
        }
      }
    }
  }
}
//-----------------------Params Handling , From OPX data to OPM Model Data -------------------------------------------
function OPXThingParams(EntityAttr, Properties_text, Properties_affiliation, Properties_essence, visualprobs) {
  const params = {
    text: Properties_text.$.value,
    affiliation: Properties_affiliation.$.value === "true" ? Affiliation.Environmental : Affiliation.Systemic,
    essence: Properties_essence.$.value === "true" ? Essence.Physical : Essence.Informatical,
    xPos: visualprobs ? parseInt(visualprobs.x) : null,
    yPos: visualprobs ? parseInt(visualprobs.y) : null,
    width: visualprobs ? parseInt(visualprobs.width) : null,
    height: visualprobs ? parseInt(visualprobs.height) : null,
    id: EntityAttr.id
  };
  return params;
}
function OPXStateParams(state_EntityAttr, OPMProperties_text, Defualt, Final, Initial, state_visualprobs) {
  const params = {
    id: state_EntityAttr.id,
    text: OPMProperties_text.$.value,
    stateType: StateTypeOpx(Defualt, Final, Initial),
    xPos: state_visualprobs ? parseInt(state_visualprobs.x) : null,
    yPos: state_visualprobs ? parseInt(state_visualprobs.y) : null,
    width: state_visualprobs ? parseInt(state_visualprobs.width) : null,
    height: state_visualprobs ? parseInt(state_visualprobs.height) : null
  };
  return params;
}
function OPXLinkParams(EntityAttr, LogicRelations, OPMProperties, LinkSection) {
  // const orXorParams = getOrXor(LinkSection);
  let sourceType = null;
  let targetType = null;
  let targetConnectedLinks = null;
  let sourceConnectedLinks = null;
  /* orXorParams.forEach(group =>{
    if (group.group.includes(EntityAttr.id)) {
      if (group.isSourceGroup === 'true') {
        sourceType = group.type;
        sourceConnectedLinks = group.group;
      }
      else {
        targetType = group.type;
        targetConnectedLinks = group.group;
      }
    }
  });*/
  const params = {
    id: EntityAttr.id,
    sourceElementId: LogicRelations ? LogicRelations.sourceId : null,
    targetElementId: LogicRelations ? LogicRelations.destinationId : null,
    linkConnectionType: linkConnectionType.systemic,
    linkType: handleLinkForStructure(OPMProperties.$.value),
    condition: handleLinkname(OPMProperties.$.value).trim() === "ConditionInstrument",
    event: handleLinkname(OPMProperties.$.value).trim() === "EventInstrument" || handleLinkname(OPMProperties.$.value).trim() === "EventConsumption",
    BreakPoints: LinkSection ? VisualLinkSection(LinkSection, EntityAttr.id) : null
  };
  return params;
}
function OPXStructuralParams(EntityAttr, LogicRelations, OPMProperties, FundamentalRelationSection) {
  const params = {
    id: EntityAttr.id,
    sourceElementId: LogicRelations ? LogicRelations.sourceId : null,
    targetElementId: LogicRelations ? LogicRelations.destinationId : null,
    linkConnectionType: linkConnectionType.systemic,
    linkType: handleLinkForStructure(OPMProperties.$.value),
    symbolPos: FundamentalRelationSection ? checkTrianglePosition(VisualFundamentalRelationSection(FundamentalRelationSection, EntityAttr.id)) : null
  };
  return params;
}
function OPXTaggedParams(EntityAttr, LogicRelations, OPMProperties, GeneralRelationSection) {
  const params = {
    id: EntityAttr.id,
    sourceElementId: LogicRelations ? LogicRelations.sourceId : null,
    targetElementId: LogicRelations ? LogicRelations.destinationId : null,
    linkConnectionType: linkConnectionType.systemic,
    linkType: handleLinkForStructure(OPMProperties.$.value),
    tag: LogicRelations ? LogicRelations.forwardRelationMeaning : null,
    backwardTag: LogicRelations ? LogicRelations.backwardRelationMeaning : null,
    BreakPoints: GeneralRelationSection ? VisualGeneralRelationSection(GeneralRelationSection, EntityAttr.id) : null
  };
  return params;
}
//------------------------ Position handling Method for symbol Postion and helper class --------------------------------
function checkTrianglePosition(position) {
  if (position) {
    return [position.x, position.y];
  }
}
class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}