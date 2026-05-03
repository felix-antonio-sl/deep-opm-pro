// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/json.model.ts
// Extracted by opm-extracted/tools/extract.mjs


class JsonModel {
  constructor(model) {
    this.model = model;
    this.OPM_OBJECT = "OpmLogicalObject";
    this.OPM_PROCESS = "OpmLogicalProcess";
    this.OPM_STATE = "OpmLogicalState";
    this.OPM_PROCEDURAL_RELATION = "OpmProceduralRelation";
    this.OPM_FUNDAMENTAL_RELATION = "OpmFundamentalRelation";
  }
  toJson(changeIds = false, justForLogs = false, removeSubModelsParts = false) {
    const logicals = new Array();
    if (!this.model.currentOpd) {
      this.model.currentOpd = this.model.opds[0];
    }
    const visualIdsThatBelongsToRequirementsViews = {};
    for (const item of this.model.opds) {
      if (item.requirementViewOf) {
        item.visualElements.forEach(v => visualIdsThatBelongsToRequirementsViews[v.id] = true);
      }
    }
    for (let i = 0; i < this.model.logicalElements.length; i++) {
      const logical = this.model.logicalElements[i];
      if (removeSubModelsParts) {
        const numberOfVisualsFromSubModel = logical.visualElements.filter(v => v.belongsToSubModel).length;
        const atRequirementsViewOpd = logical.visualElements.some(v => visualIdsThatBelongsToRequirementsViews[v.id]);
        if (numberOfVisualsFromSubModel > 0 && numberOfVisualsFromSubModel === logical.visualElements.length && !atRequirementsViewOpd) {
          continue; // not saving the logical if all the visuals came from a sub model. special case: if has visual in requirements opd => keep the logical.
        } else if (logical instanceof OpmLogicalState && logical.parent) {
          const parent = logical.parent;
          const numberOfParentVisualsFromSubModel = parent.visualElements.filter(v => v.belongsToSubModel).length;
          if (numberOfParentVisualsFromSubModel > 0 && numberOfParentVisualsFromSubModel === parent.visualElements.length) {
            continue; // not saving the logical if it is a suppressed states from a sub model.
          }
        }
      }
      let jsonLogicalElement;
      if (logical instanceof OpmLogicalObject) {
        jsonLogicalElement = logical.getParams();
      } else if (logical instanceof OpmLogicalProcess) {
        jsonLogicalElement = logical.getParams();
      } else if (logical instanceof OpmLogicalState) {
        jsonLogicalElement = logical.getParams();
      } else if (logical instanceof OpmTaggedRelation) {
        jsonLogicalElement = logical.getParams();
      } else if (logical instanceof OpmFundamentalRelation) {
        jsonLogicalElement = logical.getParams();
      } else if (logical instanceof OpmProceduralRelation) {
        jsonLogicalElement = logical.getParams();
      }
      // filter our visuals that came from sub model.
      if (removeSubModelsParts) {
        jsonLogicalElement.visualElementsParams = jsonLogicalElement.visualElementsParams.filter(jv => !jv.belongsToSubModel || visualIdsThatBelongsToRequirementsViews[jv.id]);
      }
      logicals.push(jsonLogicalElement);
    }
    let elementIds = new Array();
    for (let i = 0; i < this.model.currentOpd.visualElements.length; i++) {
      elementIds.push(this.model.currentOpd.visualElements[i].id);
    }
    let elementsLabels = new Array();
    for (let i = 0; i < this.model.currentOpd.visualElements.length; i++) {
      elementsLabels.push(this.model.currentOpd.visualElements[i].labels);
    }
    const current = {
      name: this.model.currentOpd.name,
      id: this.model.currentOpd.id,
      parendId: this.model.currentOpd.parendId,
      visualElements: elementIds,
      notes: this.model.currentOpd.notes,
      noteLinks: this.model.currentOpd.noteLinks
    };
    const opds = new Array();
    for (let i = 0; i < this.model.opds.length; i++) {
      if (removeSubModelsParts && this.model.opds[i].belongsToSubModel && !this.model.opds[i].sharedOpdWithSubModelId) {
        continue; // not saving the sub model opds
      }
      elementIds = []; // saving visual elements ids
      for (let j = 0; j < this.model.opds[i].visualElements.length; j++) {
        elementIds.push(this.model.opds[i].visualElements[j].id);
      }
      const childrenIds = []; // saving children opds
      for (let j = 0; j < this.model.opds[i].children.length; j++) {
        childrenIds.push(this.model.opds[i].children[j].id);
      }
      elementsLabels = [];
      for (let j = 0; j < this.model.currentOpd.visualElements.length; j++) {
        elementsLabels.push(this.model.currentOpd.visualElements[j].labels);
      }
      const opd = new OpmOpd(this.model.opds[i].name);
      opd.id = this.model.opds[i].id;
      opd.parendId = this.model.opds[i].parendId;
      opd.visualElements = this.model.opds[i].sharedOpdWithSubModelId && removeSubModelsParts ? [] : elementIds; // no elements on the shared opd - they will be imported from the sub model.
      opd.children = this.model.opds[i].sharedOpdWithSubModelId && removeSubModelsParts ? [] : childrenIds; // no children if children from sub model
      opd.notes = JSON.parse(JSON.stringify(this.model.opds[i].notes));
      opd.noteLinks = this.model.opds[i].noteLinks; // adding note links
      opd.permissions = this.model.permissions;
      opd.isRangesOpd = this.model.opds[i].isRangesOpd;
      opd.isHidden = this.model.opds[i].isHidden;
      opd.isViewOpd = this.model.opds[i].isViewOpd;
      opd.requirementsOpd = this.model.opds[i].requirementsOpd;
      opd.requirementViewOf = this.model.opds[i].requirementViewOf;
      opd.sharedOpdWithSubModelId = this.model.opds[i].sharedOpdWithSubModelId;
      opd.belongsToSubModel = this.model.opds[i].belongsToSubModel;
      if (!removeSubModelsParts) {
        opd.subModelEditDate = this.model.opds[i].subModelEditDate;
      }
      opds.push(opd);
    }
    const stereotypes = [];
    const rawStereotypes = removeSubModelsParts ? this.model.stereotypes.getStereoTypes().filter(s => !s.belongsToSubModel) : this.model.stereotypes.getStereoTypes();
    for (const str of rawStereotypes) {
      stereotypes.push(str.toJson());
    }
    const importedTemplates = Object.keys(this.model.importedTemplates).length > 0 ? this.model.importedTemplates : null;
    const relatedRelations = [];
    for (const sub of this.model.relatedRelations) {
      relatedRelations.push(sub.filter(l => !!l).map(link => link.lid));
    }
    let jsonOpmModel = {
      name: this.model.name,
      description: this.model.description,
      archiveMode: this.model.archiveMode,
      permissions: this.model.permissions,
      currentOpd: current,
      logicalElements: logicals,
      opds: opds,
      stereotypes: stereotypes,
      autoOpdTreeSort: this.model.autoOpdTreeSort,
      importedTemplates: importedTemplates,
      relatedRelations: relatedRelations,
      fatherModelName: this.model.fatherModelName,
      hasUnsavedWork: this.model.hasUnsavedWork,
      systemTimeDurationUnit: (0, normalizeDurationUnit)(this.model.systemTimeDurationUnit ?? undefined)
    };
    if (justForLogs) {
      return jsonOpmModel;
    }
    let jsonOpmModelStr = JSON.stringify(jsonOpmModel, function (key, value) {
      if (value === undefined) {
        return null;
      } else {
        return value;
      }
    });
    if (changeIds) {
      for (const logical of this.model.logicalElements) {
        const newLID = uuid();
        if (logical.lid) {
          jsonOpmModelStr = jsonOpmModelStr.replace(new RegExp(logical.lid, "g"), newLID);
        }
        for (const visual of logical.visualElements) {
          const newVisID = uuid();
          if (visual.id) {
            jsonOpmModelStr = jsonOpmModelStr.replace(new RegExp(visual.id, "g"), newVisID);
          }
        }
      }
    }
    jsonOpmModel = JSON.parse(jsonOpmModelStr);
    return jsonOpmModel;
  }
  fromJson(opmModelJson, validityCheckingMode = false) {
    this.model.logicalElements = [];
    this.model.opds = [];
    this.model.visualsMap = new Map();
    this.model.stereotypes = new StereotypeManager();
    this.model.fatherModelName = opmModelJson.fatherModelName;
    this.model.hasUnsavedWork = opmModelJson.hasUnsavedWork;
    const logicals = new Map();
    const visuals = new Map();
    const elements = new Array();
    // in case of model with notes only.
    if (!opmModelJson.logicalElements) {
      opmModelJson.logicalElements = [];
    }
    if (opmModelJson.stereotypes) {
      for (const str of opmModelJson.stereotypes) {
        const stereotype = new OpmStereotype(str, this);
        this.model.stereotypes.addStereotype(stereotype);
      }
    }
    const belongsToStereotypeFix = [];
    // create all uninstantiate elements
    for (const logicalJson of opmModelJson.logicalElements) {
      const logicalElement = logicals.get(logicalJson?.lid) || this.createNewLogicalElement(logicalJson.name, logicalJson);
      // Daniel: should be inside some "builder"
      if (logicalElement instanceof OpmLogicalObject && logicalJson.statesWithoutVisual) {
        for (let i = 0; i < logicalJson.statesWithoutVisual.length; i++) {
          const jsonstate = logicalJson.statesWithoutVisual[i];
          const state = logicalElement.createState();
          const badvisual = state.visualElements[0];
          state.remove(badvisual.id);
          state.text = jsonstate.text;
          state.stateType = jsonstate.stateType;
          state.parent = logicalElement;
          if (jsonstate.lid) {
            state.lid = jsonstate.lid;
            logicals.set(state.lid, state);
          }
        }
      }
      if (!logicalJson.visualElementsParams) {
        logicalJson.visualElementsParams = [];
      }
      for (const visualJson of logicalJson.visualElementsParams) {
        const visual = this.createNewVisualElement(visualJson, logicalElement);
        visuals.set(visual.id, visual);
        // logicalElement.add(visual); // removed because the visual constructor already adds itself to the logical element visuals array, and because the "fromJson" takes care of adding the visual to its opd.
      }
      elements.push(logicalElement);
      if (logicalJson.belongsToStereotyped) {
        belongsToStereotypeFix.push({
          logical: logicalElement,
          json: logicalJson
        });
      }
      logicals.set(logicalElement.lid, logicalElement);
    }
    const logicalsMap = new ElementsMap(logicals);
    const visualsMap = new ElementsMap(visuals);
    const badVisualsToRemove = [];
    // instantiate - change ids to references
    for (const logicalParam of opmModelJson.logicalElements) {
      try {
        const logical = logicalsMap.get(logicalParam.lid);
        logical.setReferencesFromJson(logicalParam, logicalsMap);
      } catch (err) {
        console.log(err.message);
      }
      for (const visualParam of logicalParam.visualElementsParams) {
        const visual = visualsMap.get(visualParam.id);
        try {
          visual.setReferencesFromJson(visualParam, visualsMap);
          visual.setReferencesOnCreate();
        } catch (e) {
          console.log(e.message);
          badVisualsToRemove.push(visual);
        }
      }
    }
    this.model.importedTemplates = opmModelJson.importedTemplates || {};
    for (const logical of elements) {
      for (const visual of logical.visualElements) {
        if (visual instanceof OpmVisualThing) {
          visual.afterCreatingReferencesFix(visualsMap);
        }
      }
    }
    this.model.logicalElements = elements;
    this.fixOpdsHierarchy(opmModelJson);
    const opds = new Array();
    for (let i = 0; i < opmModelJson.opds.length; i++) {
      opds.push(new OpmOpd(opmModelJson.opds[i].name));
      opds[i].id = opmModelJson.opds[i].id;
      opds[i].parendId = opmModelJson.opds[i].parendId;
      opds[i].isViewOpd = opmModelJson.opds[i].isViewOpd;
      opds[i].requirementsOpd = opmModelJson.opds[i].requirementsOpd;
      opds[i].requirementViewOf = opmModelJson.opds[i].requirementViewOf;
      opds[i].createOpdFromJson(opmModelJson.opds[i], this.model);
      if (!opmModelJson.opds[i].visualElements) {
        opmModelJson.opds[i].visualElements = [];
      }
      for (const visualId of opmModelJson.opds[i].visualElements) {
        try {
          opds[i].add(visualsMap.get(visualId));
        } catch (e) {
          console.log(e.message);
        }
      }
      if (opds[i].id === opmModelJson.currentOpd.id) {
        this.model.currentOpd = opds[i];
      }
    }
    // update children array for each opd
    for (let i = 0; i < opmModelJson.opds.length; i++) {
      if (opmModelJson.opds[i].children) {
        // const children = opds.filter(opd => (opmModelJson.opds[i].children.includes(opd.id)));
        const children = opmModelJson.opds[i].children.map(chId => opds.find(o => o.id === chId));
        opds[i].children = children;
      }
    }
    for (const item of belongsToStereotypeFix) {
      item.logical.belongsToStereotyped = this.model.getLogicalElementByVisualId(item.json.belongsToStereotyped);
    }
    this.model.opds = opds;
    this.model.name = opmModelJson.name;
    this.model.description = opmModelJson.description;
    this.model.archiveMode = opmModelJson.archiveMode;
    this.model.permissions = opmModelJson.permissions;
    this.model.autoOpdTreeSort = opmModelJson.autoOpdTreeSort === null ? undefined : opmModelJson.autoOpdTreeSort;
    this.model.systemTimeDurationUnit = (0, normalizeDurationUnit)(opmModelJson.systemTimeDurationUnit ?? undefined);
    const onload = () => {
      for (const logical of this.model.logicalElements) {
        for (const fix of FIXES) {
          if (logical instanceof OpmLogicalEntity) {
            fix.fix(logical);
          }
        }
      }
    };
    onload();
    const fixOpdsChildren = () => {
      const opdsThatAreNotInParentChildren = this.model.opds.filter(o => o.id !== "SD" && !this.model.getOpd(o.parendId)?.children.includes(o));
      for (const opd of opdsThatAreNotInParentChildren) {
        const parent = this.model.getOpd(opd.parendId);
        if (parent && !parent.children.includes(opd)) {
          parent.children.push(opd);
        }
      }
      const opdsWithChildrenProblem = this.model.opds.filter(o => o.children?.includes(o));
      if (opdsWithChildrenProblem.length > 0) {
        for (const opd of opdsWithChildrenProblem) {
          if (opd.children.includes(opd)) {
            opd.children.splice(opd.children.indexOf(opd), 1);
          }
        }
      }
    };
    fixOpdsChildren();
    if (opmModelJson.relatedRelations) {
      // since end of November 2022 - related relations are being saved and not being concluded on load.
      this.model.relatedRelations = [];
      for (const sub of opmModelJson.relatedRelations) {
        if (sub) {
          this.model.relatedRelations.push(sub.map(lid => logicals.get(lid)));
        }
      }
    } else {
      const allLinks = this.model.logicalElements.filter(l => l instanceof OpmRelation);
      for (const log of allLinks) {
        for (const vis of log.visualElements) {
          const link = vis;
          const source = link.sourceVisualElement;
          const target = link.targetVisualElements[0].targetVisualElement;
          this.model.links.checkForRelatedRelations(source, target, link, false);
        }
      }
      this.model.mergeIntersactingRelatedRelations();
      this.model.filterEmptyRelatedRelations();
    }
    if (badVisualsToRemove.length > 0) {
      let msg = "An error has occurred.<br>";
      badVisualsToRemove.forEach(badVis => {
        const opd = this.model.getOpdByThingId(badVis.id);
        if (opd && opd.visualElements.includes(badVis)) {
          opd.visualElements.splice(opd.visualElements.indexOf(badVis), 1);
        }
        if (badVis.logicalElement && this.model.logicalElements.includes(badVis.logicalElement)) {
          this.model.logicalElements.splice(this.model.logicalElements.indexOf(badVis.logicalElement), 1);
        }
        const type = badVis.constructor.name.includes("Link") ? "A link" : "An element";
        msg += type + " was automatically removed to fix the model.";
        if (opd) {
          msg += "<br>opd: " + opd.getName() + "<br>";
        }
      });
      if (validityCheckingMode) {
        throw {
          badVisualsToRemove
        };
      } else {
        (0, validationAlert)(msg, 10000, "error");
      }
    }
    return this;
  }
  // For "save as stereotype"
  modelToStereotypeJson(stereotypeName, description = "") {
    const regular = this.toJson();
    const jsonStereotype = {
      id: uuid(),
      name: stereotypeName,
      opd: regular.currentOpd,
      logicalElements: regular.logicalElements,
      creationDate: new Date(),
      lastEditDate: new Date(),
      description: description !== "" ? description : regular.description
    };
    return jsonStereotype;
  }
  // convert json element to opmModel element
  // private createNewOpmModelElement(jsonElement) {
  // const pseudoLogical = this.createNewLogicalElement(jsonElement.name, null);
  // let paramsLogical, paramsVisual;
  // let logicalElement;
  // paramsLogical = pseudoLogical.getParamsFromJsonElement(jsonElement);
  // console.log(paramsLogical);
  // paramsVisual = pseudoVisual.getParamsFromJsonElement(jsonElement.visualElementsParams[0]);
  // console.log(paramsVisual);
  // const logicalElement = this.createNewLogicalElement(jsonElement.name, jsonElement);
  // if (!jsonElement.visualElementsParams)
  //   jsonElement.visualElementsParams = [];
  // for (let i = 0; i < jsonElement.visualElementsParams.length; i++) {
  // { const pseudoVisual = this.createNewVisualElement(jsonElement.name, null, logicalElement);
  // console.log(pseudoVisual.getParamsFromJsonElement(jsonElement.visualElementsParams[i])); }
  //   const visual = this.createNewVisualElement(jsonElement.visualElementsParams[i], logicalElement);
  //   this.visuals.set(visual.id, visual);
  //   logicalElement.add(visual);
  // }
  /*if (logicalElement instanceof OpmLogicalObject && jsonElement.statesWithoutVisual) {
    for (let i = 0; i < jsonElement.statesWithoutVisual.length; i++) {
      const jsonstate = jsonElement.statesWithoutVisual[i];
      const state = logicalElement.createState();
      const badvisual = state.visualElements[0];
      state.remove(badvisual.id);
      state.text = jsonstate.text;
      state.stateType = jsonstate.stateType;
    }
  }
     // connect rafineable and refinee elements
  for (let i = 0; i < jsonElement.visualElementsParams.length; i++) {
    const visualElement = jsonElement.visualElementsParams[i];
    let refineable = visualElement.refineableId;  // The id of refineable element
    let refineeInzooming = visualElement.refineeInzoomingId;  // The id of refineeInzooming element
    let refineeUnfolding = visualElement.refineeUnfoldingId;  // The id of refineeUnfolding element
    const current = logicalElement.visualElements.find(e => e.id === visualElement.id);
    refineable = logicalElement.visualElements.find(e => e.id === refineable);
    refineeInzooming = logicalElement.visualElements.find(e => e.id === refineeInzooming);
    refineeUnfolding = logicalElement.visualElements.find(e => e.id === refineeUnfolding);
    current.refineable = refineable;
    current.refineeInzooming = refineeInzooming;
    current.refineeUnfolding = refineeUnfolding;
  }*/
  // return logicalElement;
  // }
  // creates new logical element according to elementType
  createNewLogicalElement(elementType, params) {
    let type;
    switch (elementType) {
      case "OpmLogicalObject":
        type = EntityType.Object;
        break;
      case "OpmLogicalProcess":
        type = EntityType.Process;
        break;
      case "OpmLogicalState":
        type = EntityType.State;
        break;
      case "OpmProceduralRelation":
        type = RelationType.Procedural;
        break;
      case "OpmFundamentalRelation":
        type = RelationType.Fundamental;
        break;
      case "OpmTaggedRelation":
        type = RelationType.Tagged;
        break;
    }
    const logical = logicalFactory(type, this.model, params);
    logical.visualElements = [];
    return logical;
  }
  // creates a visual element and insert a reference to its logical element according to elementLogicalType
  createNewVisualElement(params, logicalElement) {
    return logicalElement.createVisual(params);
  }
  fixOpdsHierarchy(opmModelJson) {
    // auto fix for problematic children field
    for (let i = 0; i < opmModelJson.opds; i++) {
      if (!opmModelJson.opds[i].children) {
        opmModelJson.opds[i].children = [];
      }
      const childrenSayingYouAreFather = opmModelJson.opds.filter(op => op.parendId === opmModelJson.opds[i].id);
      for (const child of childrenSayingYouAreFather) {
        if (!opmModelJson.opds[i].children.includes(child.id)) {
          opmModelJson.opds[i].children.push(child.id);
        }
      }
      if (opmModelJson.opds[i].children.includes(opmModelJson.opds[i].id)) {
        opmModelJson.opds[i].children.splice(opmModelJson.opds[i].children.indexOf(opmModelJson.opds[i].id), 1);
      }
    }
  }
  switchIdsOfJsonModel(jsonOpmModel, existingStereotypes) {
    let jsonOpmModelStr = JSON.stringify(jsonOpmModel, function (key, value) {
      if (value === undefined) {
        return null;
      } else {
        return value;
      }
    });
    for (const stToImport of jsonOpmModel.stereotypes) {
      const sameStereotype = existingStereotypes.find(str => str.id === stToImport.id);
      if (sameStereotype) {
        const strAIds = [];
        const strBIds = [];
        for (const log of stToImport.logicalElements) {
          strAIds.push(...log.visualElementsParams.map(v => v.id));
        }
        for (const log of sameStereotype.logicalElements) {
          strBIds.push(...log.visualElements.map(v => v.id));
        }
        if (strAIds.length !== strBIds.length || strAIds.find(id => !strBIds.includes(id)) || strBIds.find(id => !strAIds.includes(id))) {
          return {
            success: false,
            message: "Unable to to insert the template into the model as the model has a different \"" + stToImport.name + "\" stereotype version. Please align the stereotype versions (by updating the model or the template) and try again."
          };
        }
      }
    }
    for (const logical of jsonOpmModel.logicalElements) {
      const newLID = uuid();
      if (logical.lid) {
        jsonOpmModelStr = jsonOpmModelStr.replace(new RegExp(logical.lid, "g"), newLID);
      }
      for (const visual of logical.visualElementsParams) {
        const newVisID = uuid();
        if (visual.id) {
          jsonOpmModelStr = jsonOpmModelStr.replace(new RegExp(visual.id, "g"), newVisID);
        }
      }
    }
    for (const opd of jsonOpmModel.opds) {
      const newId = uuid();
      if (opd.id) {
        const addition = opd.id === "SD" ? "_SD" : "";
        jsonOpmModelStr = jsonOpmModelStr.replace(new RegExp("\"" + opd.id + "\"", "g"), "\"" + newId + addition + "\"");
      }
    }
    return {
      success: true,
      json: JSON.parse(jsonOpmModelStr)
    };
  }
}
function consistStates(array) {
  // Daniel: to keep consistency with objects and states
  for (let i = 0; i < array.length; i++) {
    const object = array[i];
    //object.visuals = object.visualElements;
    for (let j = 0; j < object.visualElements.length; j++) {
      //object.visualElements[j].states.length = 0;
      object.visualElements[j].children?.forEach(child => {
        if (child instanceof OpmVisualState) {
          //child.parent = child.fatherObject;
          //object.visualElements[j].states.push(child);
          //child.logical.visuals.push(child);
          child.logicalElement.parent = object;
          if (object.states && object.states.find(s => s === child.logicalElement) === undefined) {
            object.states.push(child.logicalElement);
          }
        }
      });
      if (object.visualElements[j].fatherObject) {
        if (!object.visualElements[j].fatherObject.children) {
          object.visualElements[j].fatherObject = object.opmModel.getVisualElementById(object.visualElements[j].fatherObject);
        }
        object.visualElements[j].fatherObject?.children.push(object.visualElements[j]);
      }
    }
  }
}
class AvoidEmptyName {
  fix(logical) {
    if (logical.text.length == 0) {
      logical.text = logical.name;
    }
  }
}
class RefinedThingStrokeWidth {
  fix(logical) {
    if (OPCloudUtils.isInstanceOfLogicalThing(logical) && logical.visualElements.find(vis => vis.getRefineable())) {
      logical.visualElements.forEach(v => v.strokeWidth = 4);
    }
  }
}
const FIXES = [new AvoidEmptyName(), new RefinedThingStrokeWidth()];
class ObjectModelElement {
  constructor(visual, json) {
    this.visual = visual;
    this.json = json;
  }
  instantiate(map) {
    for (const id of this.json.children) {
      this.visual.children.push(map.get(id));
    }
    this.visual.fatherObject = map.get(this.json.fatherObjectId);
    this.visual.refineable = map.get(this.json.refineableId);
    this.visual.refineeInzooming = map.get(this.json.refineeInzoomingId);
    this.visual.refineeUnfolding = map.get(this.json.refineeUnfoldingId);
  }
}
class VisualObjectModelElement {
  constructor(visual, json) {
    this.visual = visual;
    this.json = json;
  }
  instantiate(map) {
    for (const id of this.json.children) {
      this.visual.children.push(map.get(id));
    }
    this.visual.fatherObject = map.get(this.json.fatherObjectId);
    this.visual.refineable = map.get(this.json.refineableId);
    this.visual.refineeInzooming = map.get(this.json.refineeInzoomingId);
    this.visual.refineeUnfolding = map.get(this.json.refineeUnfoldingId);
  }
}
class LinkModelElement {
  constructor(visual, json) {
    this.visual = visual;
    this.json = json;
  }
  instantiate(map) {
    this.visual.sourceVisualElement = map.get(this.json.sourceVisualElement);
    this.visual.targetVisualElements[0].targetVisualElement = map.get(this.json.targetVisualElements[0].targetVisualElement);
  }
}