// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/BasicOpmModel.ts
// Extracted by opm-extracted/tools/extract.mjs


class BasicOpmModel {
  constructor() {
    this.isCurrentlyOnStereotypeCreation = 0;
    this.links = new LinksModel(this);
    /** ISO 19450 default time unit for the model when processes do not override (stored unit still per element). */
    this.systemTimeDurationUnit = "sec";
    this.logicalElements = new Array();
    this.opds = new Array();
    this.currentOpd = new OpmOpd("SD");
    this.opds.push(this.currentOpd);
    this.description = "";
    this.archiveMode = false;
    this.modelMetaData = new OpmModelMetaData(this);
    this.name = "Model (Not Saved)";
    this.permissions = {
      ownerID: "",
      writeIDs: [],
      readIDs: [],
      tokenID: "",
      writeGroupsIDs: [],
      readGroupsIDs: []
    };
    this.thingsNames = {};
    this.importedTemplates = {};
    this.relatedRelations = [];
    this.stereotypes = new StereotypeManager();
    this.visualsMap = new Map();
    this.hasUnsavedWork = false;
  }
  set autoOpdTreeSort(value) {
    this._autoOpdTreeSort = value;
  }
  get autoOpdTreeSort() {
    return this._autoOpdTreeSort;
  }
  addOpd(opd) {
    this.opds.push(opd);
    this.currentOpd = opd;
  }
  add(opmLogicalElement) {
    this.logicalElements.push(opmLogicalElement);
  }
  getVisualElementById(visualID) {
    if (!visualID) {
      return null;
    }
    let visual = this.visualsMap.get(visualID);
    const stereotypes = this.stereotypes.getStereoTypes();
    // if found - checking that it is still valid (belongs to its logical and the logical still inside the model).
    if (visual && visual.logicalElement.visualElements.includes(visual) && (this.logicalElements.includes(visual.logicalElement) || stereotypes.find(s => s.logicalElements.includes(visual.logicalElement)))) {
      return visual;
    } else if (visual) {
      this.visualsMap.delete(visual.id);
      visual = undefined;
    }
    for (let i = 0; i < this.logicalElements.length; i++) {
      for (let j = 0; j < this.logicalElements[i].visualElements.length; j++) {
        if (visualID === this.logicalElements[i].visualElements[j].id) {
          visual = this.logicalElements[i].visualElements[j];
          this.visualsMap.set(visual.id, visual);
          return visual;
        }
      }
    }
    for (const streot of this.stereotypes.getStereoTypes()) {
      for (const logical of streot.logicalElements) {
        for (const vis of logical.visualElements) {
          if (visualID === vis.id) {
            visual = vis;
            this.visualsMap.set(visual.id, visual);
            return visual;
          }
        }
      }
    }
    return null;
  }
  getLogicalElementByLid(lid) {
    return this.logicalElements.find(l => l.lid === lid);
  }
  getLogicalElementByVisualId(visualID) {
    if (!visualID) {
      return null;
    }
    if (this.visualsMap.get(visualID)) {
      return this.visualsMap.get(visualID).logicalElement;
    }
    for (let i = 0; i < this.logicalElements.length; i++) {
      for (let j = 0; j < this.logicalElements[i].visualElements.length; j++) {
        if (visualID === this.logicalElements[i].visualElements[j].id) {
          return this.logicalElements[i];
        }
      }
    }
    for (const streot of this.stereotypes.getStereoTypes()) {
      for (const logical of streot.logicalElements) {
        for (const vis of logical.visualElements) {
          if (visualID === vis.id) {
            return logical;
          }
        }
      }
    }
    return null;
  }
  getEquivalentLogicalThingFromStereotype(equivalentLID) {
    for (const streot of this.stereotypes.getStereoTypes()) {
      for (const logical of streot.logicalElements) {
        if (logical.lid === equivalentLID) {
          return logical;
        }
      }
    }
    return null;
  }
  getOpds(includeHidden = false) {
    if (includeHidden) {
      return this.opds;
    }
    return this.opds.filter(opd => opd.isHidden === false);
  }
  getOpdByName(Name) {
    for (let opd of this.opds) {
      if (opd.name === Name) {
        return opd;
      }
    }
  }
  getOpdIDByName(name) {
    for (let opd of this.opds) {
      if (opd.name === name) {
        return opd.id;
      }
    }
    return null;
  }
  getOpdNameByID(id) {
    for (let k = 0; k < this.opds.length; k++) {
      if (this.opds[k].id === id) {
        return this.opds[k].name;
      }
    }
    return "";
  }
  // creates a visual element and insert a reference to its logical element according to elementLogicalType
  createNewVisualElement(elementLogicalType, params, logicalElement) {
    return logicalElement.createVisual(params);
    /*
    switch (elementLogicalType) {
      case 'OpmLogicalObject':
        return new OpmVisualObject(params, logicalElement);
      case 'OpmLogicalProcess':
        return new OpmVisualProcess(params, logicalElement);
      case 'OpmLogicalState':
        return new OpmVisualState(params, logicalElement);
      case 'OpmProceduralRelation':
        return new OpmProceduralLink(params, logicalElement);
      case 'OpmFundamentalRelation':
        return new OpmFundamentalLink(params, logicalElement);
      case 'OpmTaggedRelation':
        return new OpmTaggedLink(params, logicalElement);
    }*/
  }
  createNewVisualElementInsertToCurrentOpd(params, logical) {
    const visual = this.createNewVisualElement(undefined, params, logical);
    this.currentOpd.add(visual);
    return visual;
  }
  getCopiedState(visualElement) {
    const vs = visualElement.logicalElement.visualElements;
    for (let k = 0; k < vs.length; k++) {
      if (vs[k].logicalElement.text === visualElement.logicalElement.text && vs[k].id != visualElement.id) {
        return vs[k];
      }
    }
    return null;
  }
  isComputational(visualThing) {
    return visualThing.logicalElement.isComputational();
  }
  getOpd(id) {
    for (let k = 0; k < this.opds.length; k++) {
      if (this.opds[k].id === id) {
        return this.opds[k];
      }
    }
    for (let idx = 0; idx < this.stereotypes.getStereoTypes().length; idx++) {
      if (this.stereotypes.getStereoTypes()[idx].opd.id === id) {
        return this.stereotypes.getStereoTypes()[idx].opd;
      }
    }
    return null;
  }
  setCurrentOpd(id) {
    this.currentOpd = this.getOpd(id);
  }
  getOpdByThingId(id) {
    if (!id) {
      return null;
    }
    for (let k = 0; k < this.opds.length; k++) {
      for (let j = 0; j < this.opds[k].visualElements.length; j++) {
        if (this.opds[k].visualElements[j].id === id) {
          return this.opds[k];
        }
      }
    }
    for (const streot of this.stereotypes.getStereoTypes()) {
      if (streot.opd.visualElements.find(vis => vis.id === id)) {
        return streot.opd;
      }
    }
    return null;
  }
  getOpdByElement(visual) {
    for (let k = 0; k < this.opds.length; k++) {
      for (let j = 0; j < this.opds[k].visualElements.length; j++) {
        if (this.opds[k].visualElements[j] === visual) {
          return this.opds[k];
        }
      }
    }
    for (const streot of this.stereotypes.getStereoTypes()) {
      if (streot.opd.visualElements.find(vis => vis.id === visual.id)) {
        return streot.opd;
      }
    }
    return undefined;
  }
  getRefineeInzoomingID(thingID) {
    let refineable = this.getVisualElementById(thingID);
    return refineable.refineeInzooming.id;
  }
  getRefineeUnfoldingID(thingID) {
    let refineable = this.getVisualElementById(thingID);
    return refineable.refineeUnfolding.id;
  }
  isInzoomed(thingID) {
    const refineable = this.getVisualElementById(thingID);
    if (refineable && refineable instanceof OpmVisualEntity) {
      return refineable.isInzoomed();
    } else {
      return false;
    }
  }
  isUnfolded(thingID) {
    const refineable = this.getVisualElementById(thingID);
    if (refineable && refineable instanceof OpmVisualEntity) {
      return refineable.isUnfolded();
    } else {
      return false;
    }
  }
  isEmpty(opdID) {
    return this.getOpd(opdID).isEmpty();
  }
  getOpdName(opdID) {
    const opd = this.getOpd(opdID);
    if (opd) {
      return this.getOpd(opdID).getName();
    } else {
      return "";
    }
  }
  arrayFromElementsToIds(array) {
    if (!array) {
      return;
    }
    return array.map(item => {
      if (item.constructor.name.includes("String")) {
        return item;
      } else {
        return item.id;
      }
    });
  }
  arrayFromIdsToElements(array) {
    if (!array) {
      return;
    }
    const elementsArray = new Array();
    for (let i = 0; i < array.length; i++) {
      const visual = this.getVisualElementById(array[i]);
      if (visual) {
        elementsArray.push(visual);
      }
    }
    return elementsArray;
  }
  addNote(noteParams) {
    this.currentOpd.addNote(noteParams);
  }
  getLogicalByText(text) {
    for (let i = 0; i < this.logicalElements.length; i++) {
      const currentText = this.logicalElements[i].text;
      if (currentText === text) {
        return this.logicalElements[i];
      }
    }
  }
  removeElementLocally(visual) {
    return this.removeElements([visual]);
  }
  removeElementInCurrentOpd(visual) {
    // Get instances in current opd
    const visuals = this.currentOpd.visualElements.filter(v => v.logicalElement === visual.logicalElement);
    return this.removeElements(visuals);
  }
  removeElementInModel(visual, force = false) {
    // Get all instances in model
    const visuals = [].concat(visual.logicalElement.visualElements);
    return this.removeElements(visuals, force);
  }
  removeFundamental(visuals) {
    return this.removeElements(visuals);
  }
  getOwnerOfRequirementByRequirementLID(lid) {
    for (const log of this.logicalElements) {
      if (!OPCloudUtils.isInstanceOfLogicalThing(log)) {
        continue;
      }
      const logical = log;
      if (logical.hasRequirements() && logical.getAllRequirements()?.find(req => req.getRequirementObjectLID() === lid)) {
        return logical;
      }
    }
    return undefined;
  }
  getOwnerOfRequirementSetObjectByLID(lid) {
    for (const log of this.logicalElements) {
      if (!OPCloudUtils.isInstanceOfLogicalThing(log)) {
        continue;
      }
      const logical = log;
      if (logical.hasRequirements() && logical.getSatisfiedRequirementSetModule().getRequirementsSet()?.getRequirementSetObject()?.logicalElement.lid === lid) {
        return logical;
      }
    }
    return undefined;
  }
  removeElements(visuals, force = false) {
    const logical = visuals[0]?.logicalElement;
    if (!force) {
      visuals = visuals.filter(elmnt => elmnt !== null);
      for (const visual of visuals) {
        if (visual.canBeRemoved() === false) {
          return {
            removed: false
          };
        }
      }
    }
    const elements = new Array();
    if (logical && OPCloudUtils.isInstanceOfLogicalThing(logical)) {
      const log = logical;
      if (log.isSatisfiedRequirementObject()) {
        const lidToRemove = log.lid;
        const owner = this.getOwnerOfRequirementByRequirementLID(lidToRemove);
        if (owner && visuals.length === log.visualElements.length) {
          // only if it is "remove in all model" option and not a local remove.
          const removedVisuals = owner.removeSingleRequirement(lidToRemove);
          elements.push(...removedVisuals);
        }
      } else if (log.isSatisfiedRequirementSetObject()) {
        const owner = this.getOwnerOfRequirementSetObjectByLID(log.lid);
        if (owner) {
          const removed = owner.getSatisfiedRequirementSetModule().toggleAttribute();
          elements.push(...removed);
        }
      } else if (log.hasRequirements()) {
        if (visuals.length === log.visualElements.length) {
          // only if it is "remove in all model" option and not a local remove.
          const requirements = log.getAllRequirements();
          for (let k = requirements.length - 1; k >= 0; k--) {
            const removedVisuals = log.removeSingleRequirement(requirements[k].getRequirementObjectLID());
            elements.push(...removedVisuals);
          }
        } else {
          // if it is a local remove
          const requirements = log.getAllRequirements();
          for (const req of requirements) {
            if (req.getRequirementObject()) {
              elements.push(...req.getRequirementObject().remove());
            }
          }
          const requirementSetObject = log.getSatisfiedRequirementSetModule().getRequirementsSet().getRequirementSetObject();
          if (requirementSetObject) {
            elements.push(...requirementSetObject.remove());
          }
        }
      }
    }
    for (const visual of visuals) {
      elements.push(...visual.remove());
    }
    // if we no longer need the requirements opd because there are no requirements left in the model.
    const requirementsOpdToRemove = this.opds.find(opd => opd.requirementsOpd && opd.visualElements.length === 0);
    if (requirementsOpdToRemove) {
      this.removeOpd(requirementsOpdToRemove.id);
    }
    return {
      removed: true,
      elements
    };
  }
  removeFromOpd(visual) {
    for (let i = this.opds.length - 1; i >= 0; i--) {
      const index = this.opds[i].visualElements.findIndex(v => v === visual);
      if (index > -1) {
        this.opds[i].visualElements.splice(index, 1);
        return;
      }
    }
  }
  remove(opmVisualElementId) {
    const logicalElement = this.getLogicalElementByVisualId(opmVisualElementId);
    if (logicalElement) {
      const visualElement = this.getVisualElementById(opmVisualElementId);
      if (visualElement.refineable) {
        visualElement.disconnectRefinable();
      }
      logicalElement.remove(opmVisualElementId);
      if (logicalElement.visualElements.length === 0) {
        this.removeLogicalElement(logicalElement);
      }
    }
  }
  removeLogicalElement(opmLogicalElement) {
    opmLogicalElement.removeFromFather();
    for (let i = this.logicalElements.length - 1; i >= 0; i--) {
      if (this.logicalElements[i] === opmLogicalElement) {
        this.logicalElements.splice(i, 1);
        break;
      }
    }
    if (opmLogicalElement instanceof OpmRelation && this.getRelatedRelationsByLogicalLink(opmLogicalElement)) {
      this.removeLinkFromRelatedRelation(opmLogicalElement);
    }
    if (opmLogicalElement instanceof OpmLogicalObject && opmLogicalElement.hasRange()) {
      new RangeValidationAccess(this).remove(opmLogicalElement);
    }
  }
  removeOpd(id) {
    const opd = this.getOpd(id);
    let ve;
    opd.disconnectRefineables();
    while (ve = opd.visualElements.pop()) {
      const isLastRealVisual = ve.logicalElement.visualElements.filter(v => this.getOpdByThingId(v.id) && this.getOpdByThingId(v.id).isHidden !== true);
      if (isLastRealVisual.length === 0 && OPCloudUtils.isInstanceOfVisualThing(ve) && ve.logicalElement.getStereotype()) {
        ve.logicalElement.opmModel.unLinkStereotype(ve);
      }
      this.remove(ve.id);
    }
    for (let k = this.opds.length - 1; k >= 0; k--) {
      if (this.opds[k].id === id) {
        // this.opds[k].disconnectRefineables();
        if (id !== "SD") {
          this.opds.splice(k, 1);
        }
      }
    }
    if (opd.parendId && this.opds.find(o => o.id === opd.parendId)) {
      const parentOpd = this.opds.find(o => o.id === opd.parendId);
      if (parentOpd.children.includes(opd)) {
        parentOpd.children.splice(parentOpd.children.indexOf(opd), 1);
      }
    }
  }
  removeElementFromOpds(visual) {
    const opds = this.opds;
    for (let i = 0; i < opds.length; i++) {
      for (let j = opds[i].visualElements.length - 1; j >= 0; j--) {
        if (opds[i].visualElements[j] === visual) {
          opds[i].visualElements.splice(j, 1);
          break;
        }
      }
    }
  }
  createLogicalObject() {
    return this.logicalFactory(EntityType.Object, undefined);
  }
  createLogicalProcess() {
    return this.logicalFactory(EntityType.Process, undefined);
  }
  createLogicalState() {
    return this.logicalFactory(EntityType.State, undefined);
  }
  createVisualThing(logical, opd) {
    const visual = logical.createVisual(undefined);
    opd.add(visual);
    return visual;
  }
  createVisualObject(logical, opd) {
    const visual = logical.createVisual(undefined);
    opd.add(visual);
    return visual;
  }
  createVisualProcess(logical, opd) {
    const visual = logical.createVisual(undefined);
    opd.add(visual);
    return visual;
  }
  createObject(opd) {
    const logical = this.createLogicalObject();
    const visual = logical.visualElements[0];
    opd.add(visual);
    return {
      visual,
      logical
    };
  }
  createProcess(opd) {
    const logical = this.createLogicalProcess();
    const visual = logical.visualElements[0];
    opd.add(visual);
    return {
      visual,
      logical
    };
  }
  // Use for faster tests writing
  createManyThings(opd, processesNumber, objectsNumber) {
    const processes = [];
    const objects = [];
    for (let i = 0; i < objectsNumber; i++) {
      const logical = this.createLogicalObject();
      const visual = logical.visualElements[0];
      opd.add(visual);
      objects.push({
        logical: logical,
        visual: visual
      });
    }
    for (let j = 0; j < processesNumber; j++) {
      const logical = this.createLogicalProcess();
      const visual = logical.visualElements[0];
      opd.add(visual);
      processes.push({
        logical: logical,
        visual: visual
      });
    }
    return {
      processes,
      objects
    };
  }
  bringVisualToOpd(logical, opd) {
    if (logical instanceof OpmLogicalState) {
      const visual = this.bringVisualToOpd(logical.parent, opd);
      visual.expressAll();
      return visual.states.find(s => s.logicalElement === logical);
    }
    let visual = opd.getVisualElementByLogical(logical);
    const firstVisual = logical.visualElements[0];
    const params = {
      id: uuid(),
      xPos: logical.visualElements[0].xPos,
      yPos: logical.visualElements[0].yPos,
      width: logical.visualElements[0].width,
      height: logical.visualElements[0].height,
      strokeWidth: firstVisual.getRefineeInzoom() || firstVisual.getRefineeUnfold() || logical.getStereotype() ? 4 : 2
    };
    if (!visual) {
      visual = logical.createVisual(params);
    }
    opd.add(visual);
    return visual;
  }
  logicalFactory(type, params) {
    const logical = logicalFactory(type, this, params);
    this.add(logical);
    return logical;
  }
  takeCareOfLinkEnds(orgLink, newLink, thingID, inzoomedProcess, inzoomedOPD, thing) {
    let copiedThing;
    let copiedFather;
    let noAdd = false;
    // const isSelfInvocation = (<OpmFundamentalRelation>orgLink.logicalElement).linkType === linkType.SelfInvocation;
    if (orgLink.targetVisualElements[0].targetVisualElement.id === thingID) {
      if (orgLink.sourceVisualElement instanceof OpmVisualState) {
        let copiedState = this.getCopiedState(orgLink.sourceVisualElement);
        if (copiedState == null) {
          copiedFather = orgLink.sourceVisualElement.fatherObject.clone();
          copiedThing = copiedFather.children.filter(child => child.logicalElement === orgLink.sourceVisualElement.logicalElement)[0];
        } else {
          copiedFather = copiedState.fatherObject;
          copiedThing = copiedState;
        }
        copiedFather.fatherObject = null;
      } else if (orgLink.sourceVisualElement === orgLink.targetVisualElements[0].targetVisualElement) {
        copiedThing = inzoomedProcess.children[inzoomedProcess.children.length - 1];
        noAdd = true;
      } else {
        copiedThing = orgLink.sourceVisualElement.clone();
        copiedThing.fatherObject = null;
      }
      newLink.sourceVisualElement = copiedThing;
      newLink.targetVisualElements[0].targetVisualElement = inzoomedProcess;
    } else {
      if (orgLink.targetVisualElements[0].targetVisualElement instanceof OpmVisualState) {
        const copiedState = this.getCopiedState(orgLink.targetVisualElements[0].targetVisualElement);
        if (copiedState == null) {
          copiedFather = orgLink.targetVisualElements[0].targetVisualElement.fatherObject.clone();
          copiedThing = copiedFather.children.filter(child => child.logicalElement === orgLink.targetVisualElements[0].targetVisualElement.logicalElement)[0];
        } else {
          copiedFather = copiedState.fatherObject;
          copiedThing = copiedState;
        }
        copiedFather.fatherObject = null;
      } else {
        copiedThing = orgLink.targetVisualElements[0].targetVisualElement.clone();
        copiedThing.fatherObject = null;
      }
      newLink.sourceVisualElement = inzoomedProcess;
      newLink.targetVisualElements[0].targetVisualElement = copiedThing;
    }
    if (copiedFather) {
      inzoomedOPD.add(copiedFather);
      inzoomedOPD.addElements(copiedFather.children);
    } else if (!noAdd) {
      inzoomedOPD.add(copiedThing);
      // if (copiedThing instanceof OpmVisualObject)
      inzoomedOPD.addElements(copiedThing.children);
    }
  }
  getVisualElementOfLogicalAtOpd(logical, opd) {
    for (const vis of logical.visualElements) {
      if (this.getOpdByElement(vis) === opd) {
        return vis;
      }
    }
    return undefined;
  }
  getRelatedRelationsByLogicalLink(logicalLink) {
    return this.relatedRelations.find(group => group.includes(logicalLink));
  }
  addNewRelatedRelation(group) {
    this.relatedRelations.push(group);
  }
  addLinkToExistingRelatedRelationByOther(linkToAdd, otherLinkThathasRelatedRelation) {
    const grp = this.relatedRelations.find(group => group.includes(otherLinkThathasRelatedRelation));
    if (grp) {
      grp.push(linkToAdd);
      return true;
    }
    return false;
  }
  addLinkToExistingRelatedRelation(link, group) {
    if (!group.includes(link)) {
      group.push(link);
    }
  }
  // removes the group that contains the *logicalLink*
  removeEntireRelatedRelationByLink(logicalLink) {
    const grp = this.relatedRelations.find(group => group.includes(logicalLink));
    const index = this.relatedRelations.indexOf(grp);
    if (index >= 0) {
      this.relatedRelations.splice(index, 1);
      return true;
    }
    return false;
  }
  // removes the array that contains the *logicalLink*
  removeLinkFromRelatedRelation(logicalLink) {
    const grp = this.relatedRelations.find(group => group.includes(logicalLink));
    const index = grp.indexOf(logicalLink);
    if (index >= 0) {
      // removing the item from the relation
      grp.splice(index, 1);
      // if the link removal breaks a chain of connections -> now we will recreate an updated separated chains.
      const idx = this.relatedRelations.indexOf(grp);
      if (grp.length < 2 && idx !== -1) {
        this.relatedRelations.splice(idx, 1);
        for (const log of grp) {
          for (const vis of log.visualElements) {
            const link = vis;
            const source = link.sourceVisualElement;
            const target = link.targetVisualElements[0].targetVisualElement;
            this.links.checkForRelatedRelations(source, target, link);
          }
        }
      }
      this.filterEmptyRelatedRelations();
      this.mergeIntersactingRelatedRelations();
      return true;
    }
    return false;
  }
  filterEmptyRelatedRelations() {
    for (const rel of this.relatedRelations) {
      if (rel.length < 2) {
        this.relatedRelations.splice(this.relatedRelations.indexOf(rel), 1);
      }
    }
  }
  suppressValueObjectStates(valueObject) {
    return new RangeValidationAccess(this).suppressStates(valueObject);
  }
  mergeIntersactingRelatedRelations() {
    const relations = this.relatedRelations;
    for (const log of this.logicalElements) {
      if (log.isLink()) {
        const arraysToMerge = relations.filter(arr => arr.includes(log));
        if (arraysToMerge.length > 1) {
          const temp = [];
          for (const arr of arraysToMerge) {
            temp.push(...arr);
            const idx = this.relatedRelations.indexOf(arr);
            if (idx !== -1) {
              this.relatedRelations.splice(idx, 1);
            }
          }
          this.relatedRelations.push((0, removeDuplicationsInArray)(temp));
        }
      }
    }
  }
  getOrCreateRangesOpd() {
    let opd = this.opds.find(opd => opd.isRangesOpd);
    if (!opd) {
      opd = new OpmOpd("rangesOpd");
      opd.isRangesOpd = true;
      opd.isHidden = true;
      this.addOpd(opd);
    }
    return opd;
  }
  getRangesOpd() {
    return this.opds.find(opd => opd.isRangesOpd);
  }
  getAllBasicThings() {
    return this.logicalElements.filter(l => l.isBasicThing() && !l.visualElements.every(v => v.belongsToSubModel));
  }
  sortOpds() {
    // this.opds = this.opds.sort(function (a, b) {
    //   return a.getOpdDepth() > b.getOpdDepth() ? 1 : -1;
    // });
  }
}
