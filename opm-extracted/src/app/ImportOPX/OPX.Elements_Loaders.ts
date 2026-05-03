// Source: decompiled/deobfuscated.js
// Original path: ./src/app/ImportOPX/OPX.Elements_Loaders.ts
// Extracted by opm-extracted/tools/extract.mjs

/**
 * Created by ta2er on 1/04/2018.
 * Loaders for All Elements in OPX File
 * Load Elements and Create Imported OPM Model From OPX File
 */

class OPXModel {
  constructor(json_opx) {
    this._InZoomedTree = [];
    this._UnfoldedTree = [];
    this.MainEntitiesInzoom = new Map();
    this.MainEntitiesUnfold = new Map();
    this.ChildrenContainer = new Map();
    this.size = 0;
    this.states_size = 0;
    this.ImportedOpmModel = new OpmModel();
    json_opx = JSON.stringify(json_opx);
    let json = JSON.parse(json_opx);
    this.system = json.OPX.OPMSystem[0].$;
    this.LogicalStructure = json.OPX.OPMSystem[0].LogicalStructure;
    this.VisualPart = json.OPX.OPMSystem[0].VisualPart[0];
    this.OPD = json.OPX.OPMSystem[0].VisualPart[0].OPD[0];
    this.OPD.$.name = "SD";
    this.ThingSection = json.OPX.OPMSystem[0].VisualPart[0].OPD[0].ThingSection[0];
    this.LinkSection = json.OPX.OPMSystem[0].VisualPart[0].OPD[0].VisualLinkSection[0];
    this.FundamentalRelationSection = json.OPX.OPMSystem[0].VisualPart[0].OPD[0].FundamentalRelationSection[0];
    this.GeneralRelationSection = json.OPX.OPMSystem[0].VisualPart[0].OPD[0].GeneralRelationSection[0];
    this.firstChild_inzoomed = json.OPX.OPMSystem[0].VisualPart[0].OPD[0].InZoomed[0];
    this.firstChild_Unfolded = json.OPX.OPMSystem[0].VisualPart[0].OPD[0].Unfolded[0];
    this.log = new Array();
    loadLogInfo(this.system, this.log);
    load_Inzoomed_sections(json, this.OPD, this.InZoomedTree, this.UnfoldedTree);
    load_Unfolded_sections(json, this.OPD, this.UnfoldedTree, this.InZoomedTree);
    if (this.firstChild_inzoomed) {
      CreateOPDsModel(this._InZoomedTree, this.ImportedOpmModel);
      CreateOPDsModel(this._UnfoldedTree, this.ImportedOpmModel);
    } else if (this.firstChild_Unfolded) {
      CreateOPDsModel(this._UnfoldedTree, this.ImportedOpmModel);
      CreateOPDsModel(this._InZoomedTree, this.ImportedOpmModel);
    }
    const orXorGroups = this.getOPDOrXorGroup(json.OPX.OPMSystem[0].VisualPart[0].OPD[0]);
    this.load_object_section(this.LogicalStructure);
    this.load_Process_section(this.LogicalStructure);
    this.load_Link_section(this.LogicalStructure);
    this.updateOrXorToModel(orXorGroups);
    this.load_Relation_section(this.LogicalStructure);
    InzoomedEntitiesMatching(this.ImportedOpmModel, this.MainEntitiesInzoom, this.ChildrenContainer);
    UnfoldedEntitiesMatching(this.ImportedOpmModel, this.MainEntitiesUnfold);
    this.CheckModel();
  }
  getOPDOrXorGroup(opd) {
    let group = new Array();
    const firstChild_inzoomed = opd.InZoomed[0];
    const firstChild_Unfolded = opd.Unfolded[0];
    if (firstChild_inzoomed !== "") {
      group = group.concat(this.getOPDOrXorGroup(firstChild_inzoomed.OPD[0]));
    }
    if (firstChild_Unfolded !== "") {
      firstChild_Unfolded.UnfoldingProperties.forEach(unfols => {
        group = group.concat(this.getOPDOrXorGroup(firstChild_Unfolded.UnfoldingProperties[0].OPD[0]));
      });
    }
    if (opd.VisualLinkSection[0].OrXorGroup) {
      return group.concat(opd.VisualLinkSection[0].OrXorGroup);
    }
    return group;
  }
  /**
   *
   * @param LogicalStructure OPX
   * Load Objects
   */
  load_object_section(LogicalStructure) {
    let EntityAttr;
    let EntityInstance;
    let OPMProperties;
    let visualprobs;
    let state_EntityAttr;
    let state_OPMProperties;
    let state_visualprobs;
    let state_Instances;
    if (LogicalStructure[0].ObjectSection[0].LogicalObject) {
      this.size = parseInt(LogicalStructure[0].ObjectSection[0].LogicalObject.length);
      if (CheckSize(this.size)) {
        for (let i = 0; i < this.size; i++) {
          EntityAttr = LogicalStructure[0].ObjectSection[0].LogicalObject[i].EntityAttr[0].$;
          if (LogicalStructure[0].ObjectSection[0].LogicalObject[i].EntityAttr[0].EntityInstances) {
            EntityInstance = LogicalStructure[0].ObjectSection[0].LogicalObject[i].EntityAttr[0].EntityInstances[0].instance;
          } else {
            EditLogFile(this.log, "Info: Object ID:" + EntityAttr.id, "Check .opx version file , LogicalStructure_Object_EntityInstance Issue", false);
          }
          if (LogicalStructure[0].ObjectSection[0].LogicalObject[i].EntityAttr[0].OPMProperties) {
            OPMProperties = LogicalStructure[0].ObjectSection[0].LogicalObject[i].EntityAttr[0].OPMProperties[0].Property;
            visualprobs = thingSectionObject(this.ThingSection, EntityAttr.id);
            if (OPMProperties[0] && OPMProperties[1] && OPMProperties[2]) {
              const params = OPXThingParams(EntityAttr, OPMProperties[0], OPMProperties[1], OPMProperties[2], visualprobs);
              if (params.xPos) {
                this.ImportedOpmModel.currentOpd = this.ImportedOpmModel.getOpdByName("SD");
                let LogicalObject = logicalFactoryInsertCurrentOPD(EntityType.Object, this.ImportedOpmModel, params);
                handleThingInstances(this.ImportedOpmModel, this.InZoomedTree, this.UnfoldedTree, this.MainEntitiesInzoom, this.MainEntitiesUnfold, this.ChildrenContainer, EntityInstance, "VisualObject", EntityAttr.id, this.log, LogicalObject, null);
              } else {
                const params = OPXThingParams(EntityAttr, OPMProperties[0], OPMProperties[1], OPMProperties[2], null);
                handleThingInstances(this.ImportedOpmModel, this.InZoomedTree, this.UnfoldedTree, this.MainEntitiesInzoom, this.MainEntitiesUnfold, this.ChildrenContainer, EntityInstance, "VisualObject", EntityAttr.id, this.log, null, params);
              }
            } else {
              EditLogFile(this.log, "Object ID: " + EntityAttr.id, "Check .opx version file", false);
            }
            if (LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState) {
              this.states_size = parseInt(LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState.length);
              for (let j = 0; j < this.states_size; j++) {
                let Initial = OPXLogicalStateType(LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState[j]).initial;
                let Final = OPXLogicalStateType(LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState[j]).final;
                let Defualt = OPXLogicalStateType(LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState[j]).defualt;
                state_EntityAttr = LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState[j].EntityAttr[0].$;
                if (LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState[j].EntityAttr[0].EntityInstances) {
                  state_Instances = LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState[j].EntityAttr[0].EntityInstances[0].instance;
                } else {
                  EditLogFile(this.log, "Info: State ID:" + state_EntityAttr.id, "Check .opx version file , LogicalStructure_state_Instances Issue", false);
                }
                if (LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState[j].EntityAttr[0].OPMProperties) {
                  state_OPMProperties = LogicalStructure[0].ObjectSection[0].LogicalObject[i].LogicalState[j].EntityAttr[0].OPMProperties[0].Property;
                  state_visualprobs = thingSectionState(this.ThingSection, EntityAttr.id, state_EntityAttr.id);
                  if (state_OPMProperties[0] && state_OPMProperties[1] && state_OPMProperties[2] && state_OPMProperties[0].$.value !== "Exsistent" && state_OPMProperties[0].$.value !== "Non-Exsistent") {
                    const params = OPXStateParams(state_EntityAttr, state_OPMProperties[0], Defualt, Final, Initial, state_visualprobs);
                    if (params.xPos) {
                      this.ImportedOpmModel.currentOpd = this.ImportedOpmModel.getOpdByName("SD");
                      let logicalState = logicalFactoryInsertCurrentOPD(EntityType.State, this.ImportedOpmModel, params);
                      let parent = this.ImportedOpmModel.getVisualElementById(EntityAttr.id);
                      if (parent) {
                        logicalState.parent = parent.logicalElement;
                        let visualState = this.ImportedOpmModel.getVisualElementById(state_EntityAttr.id);
                        visualState.fatherObject = parent;
                        visualState.xPos = visualState.xPos + parent.xPos;
                        visualState.yPos = visualState.yPos + parent.yPos;
                        parent.children.push(visualState);
                        handleStateInstances(this.ImportedOpmModel, this.InZoomedTree, this.UnfoldedTree, this.MainEntitiesInzoom, this.ChildrenContainer, state_Instances, "VisualState", EntityAttr.id, state_EntityAttr.id, this.log, logicalState, null);
                      }
                    } else {
                      const params = OPXStateParams(state_EntityAttr, state_OPMProperties[0], Defualt, Final, Initial, null);
                      handleStateInstances(this.ImportedOpmModel, this.InZoomedTree, this.UnfoldedTree, this.MainEntitiesInzoom, this.ChildrenContainer, state_Instances, "VisualState", EntityAttr.id, state_EntityAttr.id, this.log, null, params);
                    }
                  } else {
                    EditLogFile(this.log, "State ID: " + state_EntityAttr.id, "Check .opx version file  || Non-Exsistent State ", false);
                  }
                } else {
                  EditLogFile(this.log, "Info: State ID:" + state_EntityAttr.id, "Check .opx version file , LogicalStructure_state_OPMProperties Issue", false);
                }
              }
            }
          } else {
            EditLogFile(this.log, "Info: Object ID:" + EntityAttr.id, "Check .opx version file , LogicalStructure_Object_OPMProperties Issue", false);
          }
        }
      }
    }
    // else {
    //   Log.EditLogFile(this.log, 'Info : Failed to load LogicalStructure.ObjectSection.LogicalObject', 'Check .opx version file',false)
    // }
  }
  /**
   *
   * @param LogicalStructure OPX
   * Process Section
   */
  load_Process_section(LogicalStructure) {
    let EntityInstance;
    let EntityAttr;
    let OPMProperties;
    let visualprobs;
    if (LogicalStructure[0].ProcessSection[0].LogicalProcess) {
      this.size = parseInt(LogicalStructure[0].ProcessSection[0].LogicalProcess.length);
      if (CheckSize(this.size)) {
        for (let i = 0; i < this.size; i++) {
          EntityAttr = LogicalStructure[0].ProcessSection[0].LogicalProcess[i].EntityAttr[0].$;
          if (LogicalStructure[0].ProcessSection[0].LogicalProcess[i].EntityAttr[0].EntityInstances) {
            EntityInstance = LogicalStructure[0].ProcessSection[0].LogicalProcess[i].EntityAttr[0].EntityInstances[0].instance;
          } else {
            EditLogFile(this.log, "Info: Process ID:" + EntityAttr.id, "Check .opx version file , LogicalStructure_Process_EntityInstance Issue", false);
          }
          if (LogicalStructure[0].ProcessSection[0].LogicalProcess[i].EntityAttr[0].OPMProperties) {
            OPMProperties = LogicalStructure[0].ProcessSection[0].LogicalProcess[i].EntityAttr[0].OPMProperties[0].Property;
            visualprobs = thingSectionProcess(this.ThingSection, EntityAttr.id);
            if (OPMProperties[1] && OPMProperties[3] && OPMProperties[4]) {
              const params = OPXThingParams(EntityAttr, OPMProperties[1], OPMProperties[3], OPMProperties[4], visualprobs);
              if (params.xPos) {
                this.ImportedOpmModel.currentOpd = this.ImportedOpmModel.getOpdByName("SD");
                let LogicalProcess = logicalFactoryInsertCurrentOPD(EntityType.Process, this.ImportedOpmModel, params);
                handleThingInstances(this.ImportedOpmModel, this.InZoomedTree, this.UnfoldedTree, this.MainEntitiesInzoom, this.MainEntitiesUnfold, this.ChildrenContainer, EntityInstance, "VisualProcess", EntityAttr.id, this.log, LogicalProcess, null);
              } else {
                const params = OPXThingParams(EntityAttr, OPMProperties[1], OPMProperties[3], OPMProperties[4], null);
                handleThingInstances(this.ImportedOpmModel, this.InZoomedTree, this.UnfoldedTree, this.MainEntitiesInzoom, this.MainEntitiesUnfold, this.ChildrenContainer, EntityInstance, "VisualProcess", EntityAttr.id, this.log, null, params);
              }
            } else {
              EditLogFile(this.log, "Process ID: " + EntityAttr.id, "Check .opx version file", false);
            }
          } else {
            EditLogFile(this.log, "Info: Process ID" + EntityAttr.id, "Check .opx version file , LogicalStructure_Process_OPMProperties Issue", false);
          }
        }
      }
    }
    // else {
    //   Log.EditLogFile(this.log, 'Info : Failed to load LogicalStructure.ProcessSection.LogicalProcess', 'Check .opx version file',false)
    // }
  }
  /**
   * Procedural Links Section
   * @param LogicalStructure OPX
   */
  load_Link_section(LogicalStructure) {
    let LogicRelations;
    let EntityAttr;
    let OPMProperties;
    let EntityInstance;
    if (LogicalStructure[0].LinkSection[0].LogicalLink) {
      this.size = parseInt(LogicalStructure[0].LinkSection[0].LogicalLink.length);
      if (CheckSize(this.size)) {
        for (let i = 0; i < this.size; i++) {
          LogicRelations = LogicalStructure[0].LinkSection[0].LogicalLink[i].$;
          EntityAttr = LogicalStructure[0].LinkSection[0].LogicalLink[i].EntityAttr[0].$;
          if (LogicalStructure[0].LinkSection[0].LogicalLink[i].EntityAttr[0].OPMProperties) {
            OPMProperties = LogicalStructure[0].LinkSection[0].LogicalLink[i].EntityAttr[0].OPMProperties[0].Property;
            if (LogicalStructure[0].LinkSection[0].LogicalLink[i].EntityAttr[0].EntityInstances) {
              EntityInstance = LogicalStructure[0].LinkSection[0].LogicalLink[i].EntityAttr[0].EntityInstances[0].instance;
              if (OPMProperties[0] && LogicRelations.sourceId && LogicRelations.destinationId) {
                if (VisualLinkInRoot(this.LinkSection, EntityAttr.id)) {
                  const params = OPXLinkParams(EntityAttr, LogicRelations, OPMProperties[0], this.LinkSection);
                  this.ImportedOpmModel.currentOpd = this.ImportedOpmModel.getOpdByName("SD");
                  let LogicalProceduralLink = logicalFactoryInsertCurrentOPD(RelationType.Procedural, this.ImportedOpmModel, params);
                  handleLinkInstances(this.ImportedOpmModel, this.InZoomedTree, this.UnfoldedTree, EntityInstance, EntityAttr.id, false, this.log, LogicalProceduralLink, null);
                } else {
                  const params = OPXLinkParams(EntityAttr, null, OPMProperties[0], this.LinkSection);
                  handleLinkInstances(this.ImportedOpmModel, this.InZoomedTree, this.UnfoldedTree, EntityInstance, EntityAttr.id, false, this.log, null, params);
                }
              } else {
                EditLogFile(this.log, "Logical Link ID: " + EntityAttr.id, "Check .opx version file", false);
              }
            } else {
              EditLogFile(this.log, "Info: Logical Link ID" + EntityAttr.id, "Check .opx version file , LogicalStructure_Logical Link_EntityInstance Issue", false);
            }
          } else {
            EditLogFile(this.log, "Info: Logical Link ID" + EntityAttr.id, "Check .opx version file , LogicalStructure_Logical Link_OPMProperties Issue", false);
          }
        }
      }
    }
    // else {
    //   Log.EditLogFile(this.log, 'Info : Failed to load LogicalStructure.LinkSection.LogicalLink', 'Check .opx version file',false)
    // }
  }
  /**
   * Fundamental Links Section
   * @param LogicalStructure OPX
   */
  load_Relation_section(LogicalStructure) {
    let LogicRelations;
    let EntityAttr;
    let OPMProperties;
    let EntityInstance;
    if (LogicalStructure[0].RelationSection[0].LogicalRelation) {
      this.size = parseInt(LogicalStructure[0].RelationSection[0].LogicalRelation.length);
      if (CheckSize(this.size)) {
        for (let i = 0; i < this.size; i++) {
          LogicRelations = LogicalStructure[0].RelationSection[0].LogicalRelation[i].$;
          EntityAttr = LogicalStructure[0].RelationSection[0].LogicalRelation[i].EntityAttr[0].$;
          if (LogicalStructure[0].RelationSection[0].LogicalRelation[i].EntityAttr[0].OPMProperties) {
            OPMProperties = LogicalStructure[0].RelationSection[0].LogicalRelation[i].EntityAttr[0].OPMProperties[0].Property;
            if (LogicalStructure[0].RelationSection[0].LogicalRelation[i].EntityAttr[0].EntityInstances) {
              EntityInstance = LogicalStructure[0].RelationSection[0].LogicalRelation[i].EntityAttr[0].EntityInstances[0].instance;
              if (OPMProperties[0] && LogicRelations.sourceId && LogicRelations.destinationId) {
                if (VisualRelationInRoot(this.FundamentalRelationSection, null, EntityAttr.id)) {
                  const params = OPXStructuralParams(EntityAttr, LogicRelations, OPMProperties[0], this.FundamentalRelationSection);
                  this.ImportedOpmModel.currentOpd = this.ImportedOpmModel.getOpdByName("SD");
                  let LogicalFundamentalLink = logicalFactoryInsertCurrentOPD(RelationType.Fundamental, this.ImportedOpmModel, params);
                  handleLinkInstances(this.ImportedOpmModel, this.InZoomedTree, this.UnfoldedTree, EntityInstance, EntityAttr.id, true, this.log, LogicalFundamentalLink, null);
                } else {
                  const params = OPXStructuralParams(EntityAttr, null, OPMProperties[0], null);
                  handleLinkInstances(this.ImportedOpmModel, this.InZoomedTree, this.UnfoldedTree, EntityInstance, EntityAttr.id, true, this.log, null, params);
                }
                if (VisualRelationInRoot(null, this.GeneralRelationSection, EntityAttr.id)) {
                  const params = OPXTaggedParams(EntityAttr, LogicRelations, OPMProperties[0], this.GeneralRelationSection);
                  this.ImportedOpmModel.currentOpd = this.ImportedOpmModel.getOpdByName("SD");
                  let LogicalTaggedLink = logicalFactoryInsertCurrentOPD(RelationType.Tagged, this.ImportedOpmModel, params);
                  handleLinkInstances(this.ImportedOpmModel, this.InZoomedTree, this.UnfoldedTree, EntityInstance, EntityAttr.id, true, this.log, LogicalTaggedLink, null);
                } else {
                  const params = OPXTaggedParams(EntityAttr, LogicRelations, OPMProperties[0], null);
                  handleLinkInstances(this.ImportedOpmModel, this.InZoomedTree, this.UnfoldedTree, EntityInstance, EntityAttr.id, true, this.log, null, params);
                }
              } else {
                EditLogFile(this.log, "Relation Link ID: " + EntityAttr.id, "Check .opx version file", false);
              }
            } else {
              EditLogFile(this.log, "Info: Relation Link ID" + EntityAttr.id, "Check .opx version file , LogicalStructure_Relation Link_EntityInstance Issue", false);
            }
          } else {
            EditLogFile(this.log, "Info: Relation Link ID" + EntityAttr.id, "Check .opx version file , LogicalStructure_Relation Link_OPMProperties Issue", false);
          }
        }
      }
    }
    // else {
    //   Log.EditLogFile(this.log, 'Info : Failed to load LogicalStructure.RelationSection.LogicalRelation', 'Check .opx version file',false)
    // }
  }
  //---------------------------getters/setters-------------------------------------------------------------------
  get InZoomedTree() {
    return this._InZoomedTree;
  }
  get UnfoldedTree() {
    return this._UnfoldedTree;
  }
  get ImportedOpmModel() {
    return this._ImportedOpmModel;
  }
  set ImportedOpmModel(value) {
    this._ImportedOpmModel = value;
  }
  updateOrXorToModel(orXorGroups) {
    const elementArray = {};
    this.ImportedOpmModel.logicalElements.forEach(element => {
      elementArray[element.visualElements[0].id] = element.visualElements[0];
    });
    const targetConnectedDict = {};
    const sourceConnectedDict = {};
    const targetTypeDict = {};
    const sourceTypeDict = {};
    orXorGroups.forEach(group => {
      const membersArray = [];
      group.Member.forEach(member => {
        membersArray.push(member.$.memberId);
      });
      membersArray.forEach(member => {
        const element = this.ImportedOpmModel.logicalElements.filter(elem => elem.visualElements[0].id === member)[0];
        if (group.$.isSourceGroup === "false") {
          if (typeof element.sourceLogicalElement === "object") {
            element.sourceLogicalElement = [element.sourceLogicalElement];
          }
          targetConnectedDict[member] = membersArray;
          targetTypeDict[member] = Number(group.$.type);
        } else {
          sourceConnectedDict[member] = membersArray;
          sourceTypeDict[member] = Number(group.$.type);
        }
      });
    });
    this.ImportedOpmModel.logicalElements.forEach(element => {
      const targetConnectedLinksAfter = [];
      const sourceConnectedLinksAfter = [];
      const targetConnectedLinksBefore = targetConnectedDict[element.visualElements[0].id];
      if (targetConnectedLinksBefore && targetConnectedLinksBefore !== null) {
        let i = 0;
        targetConnectedLinksBefore.forEach(target => {
          if (target in elementArray) {
            targetConnectedLinksAfter[i] = elementArray[target];
          }
          i += 1;
        });
        element.visualElements[0].targetConnectedLinks = targetConnectedLinksAfter;
        element.visualElements[0].ImportLink = 1;
        element.targetLogicalConnection = targetTypeDict[element.visualElements[0].id];
        element.visualElements[0].sourceVisualElementPort = null;
      }
      const sourceConnectedLinksBefore = sourceConnectedDict[element.visualElements[0].id];
      if (sourceConnectedLinksBefore && sourceConnectedLinksBefore !== null) {
        let i = 0;
        sourceConnectedLinksBefore.forEach(source => {
          sourceConnectedLinksAfter[i] = elementArray[source];
          i += 1;
        });
        element.visualElements[0].sourceConnectedLinks = sourceConnectedLinksAfter;
        element.visualElements[0].ImportLink = 1;
        element.sourceLogicalConnection = sourceTypeDict[element.visualElements[0].id];
        element.visualElements[0].targetVisualElementPort = null;
      }
    });
  }
  CheckModel() {
    for (let logic of this.ImportedOpmModel.logicalElements) {
      for (let v of logic.visualElements) {
        if (v instanceof OpmLink) {
          if (!v.targetVisualElements) {
            console.log("trg not exist");
            console.log(v);
          }
          if (!v.sourceVisualElement) {
            console.log("src not exist");
            console.log(v);
          }
        }
      }
    }
  }
}