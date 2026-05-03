// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/SubModelCreator.ts
// Extracted by opm-extracted/tools/extract.mjs


class SubModelCreator {
  constructor(model, contextService = undefined) {
    this.model = model;
    this.contextService = contextService;
  }
  createFirstOpdFromSharedLogicalsParams(subModel, logicalsParams, title) {
    var _this = this;
    return (0, default)(function* () {
      const sharedOpd = _this.createSharedOpd(title.nameForOpd);
      const ret = _this.createSharedVisuals(logicalsParams);
      const newLogicalParams = ret.json;
      const newVisualsIds = ret.newVisualsId;
      _this.createLogicalElementsFromLogicalsParams(subModel, newLogicalParams, newVisualsIds);
      subModel.fatherModelName = _this.contextService.getCurrentContext().properties.name;
      const fatherModelId = _this.contextService.getCurrentContext().properties.id;
      const newModelId = yield _this.contextService.saveSubModel(subModel.toJson(), title.nameForModel, fatherModelId);
      sharedOpd.sharedOpdWithSubModelId = newModelId;
      // now import the model with the shared import subModel mechanism (shared for creation and import).
      _this.importSubModel(subModel, sharedOpd, newModelId);
      return newModelId;
    })();
  }
  lazyLoadSubModel(subModelId, subModel, sharedOpd, subModelEditDate) {
    sharedOpd.sharedOpdWithSubModelId = subModelId;
    sharedOpd.subModelEditDate = subModelEditDate;
    this.importSubModel(subModel, sharedOpd, subModelId);
  }
  importSubModel(subModel, sharedOpd, subModelId) {
    const sharedLogicals = [];
    const notSharedLogicals = [];
    for (let i = subModel.opds.length - 1; i >= 0; i--) {
      if (subModel.opds[i].requirementViewOf) {
        subModel.opds[i].visualElements.forEach(v => v.remove()); // removing sub model's requirements views opds visuals.
      }
    }
    for (const logical of subModel.logicalElements) {
      if (this.model.getLogicalElementByLid(logical.lid)) {
        sharedLogicals.push(logical);
        if (OPCloudUtils.isInstanceOfLogicalEntity(logical)) {
          this.model.getLogicalElementByLid(logical.lid).text = logical.getBareName();
        }
        if (OPCloudUtils.isInstanceOfLogicalObject(logical)) {
          this.model.getLogicalElementByLid(logical.lid).value = logical.value;
          this.model.getLogicalElementByLid(logical.lid).alias = logical.alias;
        } else if (OPCloudUtils.isInstanceOfLogicalProcess(logical)) {
          this.model.getLogicalElementByLid(logical.lid).code = logical.code;
          this.model.getLogicalElementByLid(logical.lid).insertedFunction = logical.insertedFunction;
        }
        continue;
      }
      logical.opmModel = this.model;
      notSharedLogicals.push(logical);
      logical.visualElements.forEach(v => {
        v.belongsToSubModel = subModelId;
      }); // marking all the sub model brought visuals
    }
    this.model.logicalElements.push(...notSharedLogicals);
    for (const logical of sharedLogicals) {
      const logicalInThisModel = this.model.getLogicalElementByLid(logical.lid);
      for (const visual of logical.visualElements) {
        if (!logicalInThisModel.visualElements.find(vis => vis.id === visual.id)) {
          logicalInThisModel.visualElements.push(visual); // moving the visuals of the shared logicals of the sub model to the father model.
          visual.belongsToSubModel = subModelId; // marking all the sub model brought visuals
          visual.logicalElement = logicalInThisModel;
        }
      }
      if (OPCloudUtils.isInstanceOfLogicalThing(logical) && logical.getAllRequirements().length) {
        logicalInThisModel.hiddenAttributesModule.satisfiedRequirementSetModule = new SatisfiedRequirementSetModule(logical.hiddenAttributesModule.satisfiedRequirementSetModule.toJson(), this.model);
      }
    }
    const sharedOpdId = sharedOpd.id;
    const sharedOpdInSubModel = subModel.opds.find(o => o.id === "SD");
    sharedOpd.visualElements = sharedOpdInSubModel.visualElements.map(v => this.model.getVisualElementById(v.id)); // CRITICAL! - puts the correct visuals in the father model opd's visual elements array.
    for (const opd of subModel.opds) {
      if (opd.requirementViewOf) {
        continue;
      }
      if (opd.parendId === "SD") {
        opd.parendId = sharedOpdId;
      }
      if (opd.id !== "SD") {
        this.model.opds.push(opd);
        opd.belongsToSubModel = subModelId;
      }
    }
    sharedOpd.children = sharedOpdInSubModel.children.map(c => c).filter(c => c.id !== sharedOpd.id); // copy array for safety.
    sharedOpd.sharedOpdWithSubModelId = subModelId; // when clicking on this opd on the tree the sub model will be loaded based on this property.
    for (const stereotype of subModel.stereotypes.getStereoTypes()) {
      stereotype.belongsToSubModel = subModelId;
      this.model.stereotypes.addStereotype(stereotype);
    }
  }
  createSharedOpd(title) {
    const sharedOpd = new OpmOpd(title);
    sharedOpd.setAsViewOpd();
    sharedOpd.parendId = this.model.currentOpd.id;
    this.model.currentOpd.children.push(sharedOpd);
    this.model.opds.push(sharedOpd);
    return sharedOpd;
  }
  createSharedVisuals(logicalsParams) {
    // creates the new visuals that will be on the shared opd (by copying the existing and changing their ids).
    const oldVisualsIds = logicalsParams.map(l => l.visualElementsParams[0].id);
    let jsonAsString = JSON.stringify(logicalsParams);
    const newVisualsId = [];
    for (const id of oldVisualsIds) {
      const newId = uuid();
      newVisualsId.push(newId);
      while (jsonAsString.includes(id)) {
        jsonAsString = jsonAsString.replace(id, newId);
      }
    }
    return {
      json: JSON.parse(jsonAsString),
      newVisualsId
    };
  }
  createLogicalElementsFromLogicalsParams(subModel, newLogicalParams, newVisualsIds) {
    const tempModel = new OpmModel();
    tempModel.opds[0].visualElements = newVisualsIds;
    const jsonFormatModel = {
      name: "subModel",
      description: "",
      archiveMode: {
        archiveMode: false,
        date: "",
        user: ""
      },
      permissions: null,
      currentOpd: tempModel.opds[0],
      logicalElements: newLogicalParams,
      opds: tempModel.opds,
      stereotypes: [],
      autoOpdTreeSort: null,
      importedTemplates: null,
      relatedRelations: null
    };
    subModel.fromJson(jsonFormatModel);
    const fatherModelId = this.contextService.getCurrentContext().properties.id;
    for (const logical of subModel.logicalElements) {
      logical.belongsToFatherModelId = fatherModelId;
      for (const vis of logical.visualElements) {
        vis.belongsToFatherModelId = fatherModelId;
      }
    }
  }
  getElementsParamsToCopyToSubModel(opd, visuals) {
    const entities = [];
    const links = [];
    for (const visual of opd.visualElements) {
      if (visual.isLink()) {
        const link = visual;
        if (visuals.includes(link.source) && visuals.includes(link.target)) {
          const params = link.logicalElement.getParams();
          // leaving only one visual for the new sub model (visual id should be changed).
          params.visualElementsParams = params.visualElementsParams.filter(v => v.id === link.id);
          links.push(params);
        }
      }
    }
    for (const visual of visuals) {
      if (!visual.isLink()) {
        const params = visual.logicalElement.getParams();
        // leaving only one visual for the new sub model (visual id should be changed).
        params.visualElementsParams = params.visualElementsParams.filter(v => v.id === visual.id);
        entities.push(params);
        if (OPCloudUtils.isInstanceOfVisualObject(visual)) {
          const states = visual.states || [];
          for (const state of states) {
            if (!visuals.includes(state)) {
              const logStateParams = state.logicalElement.getParams();
              logStateParams.visualElementsParams = logStateParams.visualElementsParams.filter(s => s.id === state.id);
              entities.push(logStateParams);
            }
          }
        }
      }
    }
    return [...entities, ...links];
  }
  createSubModel(visuals, title) {
    const logicalsParams = this.getElementsParamsToCopyToSubModel(this.model.currentOpd, visuals);
    const subModel = new OpmModel(); // or a loaded sub model OpmModel.
    return this.createFirstOpdFromSharedLogicalsParams(subModel, logicalsParams, title);
  }
  switchStereotypesIds(rawSubModel) {
    const fatherModelStereotypes = this.model.stereotypes.getStereoTypes().map(st => {
      return {
        id: st.id,
        date: st.lastEditDate
      };
    });
    const toSwitch = [];
    for (const str of rawSubModel.stereotypes || []) {
      if (fatherModelStereotypes.find(item => str.id === item.id && str.lastEditDate !== item.date)) {
        toSwitch.push({
          oldId: str.id,
          newId: uuid()
        });
      }
    }
    if (toSwitch.length === 0) {
      return rawSubModel;
    }
    let jsonAsString = JSON.stringify(rawSubModel);
    for (const item of toSwitch) {
      while (jsonAsString.includes(item.oldId)) {
        jsonAsString = jsonAsString.replace(item.oldId, item.newId);
      }
    }
    return JSON.parse(jsonAsString);
  }
  protectElementsFromBeingRefined(newModelId, logicals) {
    for (const logical of logicals) {
      logical.protectedFromBeingRefinedBySubModel = newModelId;
    }
  }
  protectElementsFromBeingChanged(newModelId, visuals) {
    for (const vis of visuals) {
      vis.protectedFromBeingChangedBySubModel = newModelId;
      const links = vis.getLinks();
      for (const inLink of links.inGoing) {
        if (inLink.source.logicalElement.protectedFromBeingRefinedBySubModel) {
          inLink.protectedFromBeingChangedBySubModel = newModelId;
        }
      }
      for (const outLink of links.outGoing) {
        if (outLink.target.logicalElement.protectedFromBeingRefinedBySubModel) {
          outLink.protectedFromBeingChangedBySubModel = newModelId;
        }
      }
    }
  }
}