// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/OpmModel.ts
// Extracted by opm-extracted/tools/extract.mjs


let OpmModel = /*#__PURE__*/(() => {
  class OpmModel extends BasicOpmModel {
    constructor() {
      super();
      this.json = new JsonModel(this);
      this.complexity = new Complexity(this);
      this.uiArrangement = new UIArrangement();
      this.undoRedo = new UndoRedoOperation();
      this.lastOperations = [];
      this.validation = {
        validation_time: "both",
        enforcment_level: "soft"
      };
      OpmLogicalProcess.resetLogicalCounter();
      OpmLogicalObject.resetLogicalCounter();
      this.tokenRuntimeRatio = 1;
    }
    setOplService(service) {
      this.oplService = service;
    }
    getOplService() {
      return this.oplService;
    }
    createDefaultModelName() {
      let defaultName = this.name;
      if (!defaultName) {
        defaultName = this.getOpd("SD").getDefaultName();
      }
      return defaultName;
    }
    addOpd(opd) {
      this.opds.push(opd);
      this.currentOpd = opd;
    }
    getOrCreateRequirementsOpd() {
      const existing = this.opds.find(opd => opd.requirementsOpd === true && !opd.belongsToSubModel);
      if (existing) {
        return existing;
      }
      return this.createRequirementsOpd();
    }
    createRequirementsOpd() {
      const opd = new OpmOpd("requirementsHiddenOpd");
      opd.isHidden = true;
      opd.id = "requirementsHiddenOpd";
      opd.setAsRequirementsOpd();
      this.addOpd(opd);
      return opd;
    }
    getStereotypeByLogicalElement(logical) {
      return this.stereotypes.getStereoTypes().find(stereo => stereo.logicalElements.includes(logical));
    }
    setCurrentConfiguration(conf) {
      this.currentConfiguration = conf;
    }
    getCurrentConfiguration() {
      return this.currentConfiguration;
    }
    addRequirementStereotypeToRequirement(logical) {
      if (logical.getStereotype()) {
        return {
          success: false,
          reason: "already has stereotype"
        };
      }
      if (!logical.isSatisfiedRequirementObject()) {
        return {
          success: false,
          reason: "not a requirement"
        };
      }
      const stereotype = getRequirementStereotype();
      return this.addStereotypeToThing(stereotype, logical);
    }
    addStereotypeToThing(modelAsJson, logicalThing) {
      if (logicalThing.getStereotype() || logicalThing.getBelongsToStereotyped()) {
        return {
          success: false,
          reason: "already has stereotype"
        };
      }
      if (!logicalThing.isSatisfiedRequirementObject() && logicalThing.states && logicalThing.states.length > 0) {
        return {
          success: false,
          reason: "computational thing cannot have a stereotype"
        };
      }
      const mainThingType = modelAsJson.logicalElements ? modelAsJson.logicalElements.find(log => log.isMainThing) : undefined;
      // pay attention for special case of json containing only id. (it is legal)
      if (!mainThingType && modelAsJson.logicalElements || mainThingType && !logicalThing.name.includes(mainThingType.name)) {
        return {
          success: false,
          reason: "The Stereotype's main thing should match the type of the thing attached to."
        };
      }
      this.logForUndo("set stereotype for " + logicalThing.getBareName());
      this.setShouldLogForUndoRedo(false, "addStereotypeToThing");
      this.isCurrentlyOnStereotypeCreation += 1;
      logicalThing.setBackgroundImage("");
      let stereo = this.stereotypes.getStereoTypes().find(st => st.id === modelAsJson.id);
      if (!stereo && modelAsJson.stereotypes) {
        for (const innerStereotypeJson of modelAsJson.stereotypes) {
          if (!this.stereotypes.getStereotypeById(innerStereotypeJson.id)) {
            const inner = new OpmStereotype(innerStereotypeJson, this.json);
            this.stereotypes.addStereotype(inner);
          }
        }
      }
      if (!stereo) {
        stereo = new OpmStereotype(modelAsJson, this.json);
      }
      stereo = this.stereotypes.addStereotype(stereo);
      logicalThing.setStereotype(stereo);
      const hiddenOpd = new OpmOpd(logicalThing.text + " hiddenStereotypeOpd");
      hiddenOpd.isHidden = true;
      hiddenOpd.parendId = "SD";
      this.opds.push(hiddenOpd);
      const hashT = {};
      const createdVisuals = this.cloneStereotypeToOpd(stereo, hiddenOpd, hashT);
      const mainStereotypeThing = stereo.getMainThing();
      if (mainStereotypeThing) {
        logicalThing.essence = mainStereotypeThing.essence;
        logicalThing.affiliation = mainStereotypeThing.affiliation;
        if (mainStereotypeThing.getBackgroundImageUrl()?.length) {
          logicalThing.setBackgroundImage(mainStereotypeThing.getBackgroundImageUrl());
        }
      }
      const thingToReplaceTo = logicalThing.createVisual(mainStereotypeThing.visualElements[0].getParams());
      thingToReplaceTo.id = uuid();
      hiddenOpd.add(thingToReplaceTo);
      createdVisuals.filter(vis => vis instanceof OpmVisualThing).forEach(v => {
        v.logicalElement.setBelongsToStereotyped(thingToReplaceTo.logicalElement);
      });
      this.replaceClonedStereotypeToActualThing(thingToReplaceTo, hiddenOpd, stereo, hashT);
      logicalThing.visualElements.forEach(vis => vis.strokeWidth = 4);
      logicalThing.visualElements[0].showBackgroundImage = mainStereotypeThing.visualElements[0].showBackgroundImage;
      this.isCurrentlyOnStereotypeCreation -= 1;
      this.setShouldLogForUndoRedo(true, "addStereotypeToThing");
      return {
        success: true
      };
    }
    updateOwnerPermissions(ownerID, orgAdminList) {
      const readIDsWithDuplicates = orgAdminList;
      readIDsWithDuplicates.push(ownerID);
      let readIDs = readIDsWithDuplicates.filter((element, index, list) => index === list.indexOf(element)); // Remove duplicates from the array
      this.permissions.ownerID = ownerID;
      this.permissions.tokenID = ownerID;
      this.permissions.writeIDs = [ownerID];
      this.permissions.readIDs = readIDs;
      this.permissions.writeGroupsIDs = [];
      this.permissions.readGroupsIDs = [];
    }
    toJson(changeIds = false, removeSubModelsParts = false) {
      return this.json.toJson(changeIds, false, removeSubModelsParts);
    }
    removeStereotypeFromModel(stereotype) {
      if (this.logicalElements.find(log => log instanceof OpmLogicalThing && log.getStereotype() === stereotype)) {
        return {
          success: false,
          reason: "The stereotype is still connected to another thing."
        };
      }
      const ret = this.stereotypes.removeStereotype(stereotype);
      return {
        success: ret
      };
    }
    removeClonedStereotypeAndItsParts(logical) {
      this.setShouldLogForUndoRedo(false, "removeStereotype");
      // let visAtHiddenOpd = logical.visualElements.find(vis => this.getOpdByThingId(vis.id) && this.getOpdByThingId(vis.id).isHidden === true && !this.getOpdByThingId(vis.id).isRequirementsOpd());
      // if (!visAtHiddenOpd)
      //   visAtHiddenOpd = logical.visualElements.find(vis => this.getOpdByThingId(vis.id) && this.getOpdByThingId(vis.id).isHidden === true);
      // const hiddenOpd = visAtHiddenOpd ? this.getOpdByThingId(visAtHiddenOpd.id) : undefined;
      const hiddenOpd = this.opds.find(opd => opd.name.startsWith("<<" + logical.getStereotype().getName() + ">>") || opd.name.startsWith("«" + logical.getStereotype().getName() + "»"));
      const stereotype = logical.getStereotype();
      let removed = [];
      if (hiddenOpd && stereotype) {
        const elementsToRemove = hiddenOpd.visualElements.map(vis => vis.logicalElement);
        removed = [].concat(hiddenOpd.visualElements);
        for (const element of elementsToRemove.filter(elm => !!elm)) {
          const ret = this.removeElements(element.visualElements, true);
          if (ret.elements && ret.elements.length > 0) {
            removed.push(...ret.elements);
          }
        }
        elementsToRemove.filter(elm => elm.visualElements.length > 0 && !elm.constructor.name.includes("State")).forEach(elmnt => {
          const ret = this.removeElements(elmnt.visualElements, true);
          if (ret.elements && ret.elements.length > 0) {
            removed.push(...ret.elements);
          }
        });
        if (this.getOpd(hiddenOpd.id)) {
          this.removeOpd(hiddenOpd.id);
        }
        this.removeStereotypeFromModel(stereotype);
      }
      this.setShouldLogForUndoRedo(true, "removeStereotype");
      return {
        removed: removed
      };
    }
    fromJson(opmModelJson, validityCheckingMode = false) {
      this.json.fromJson(opmModelJson, validityCheckingMode);
      return this;
    }
    getOpdWithOneMissingLink(oldLinkId, newLinkId) {
      return undefined;
      // const oldLink = this.getLogicalElementByVisualId(oldLinkId);
      // const newLink = this.getLogicalElementByVisualId(newLinkId);
      // for (let i = 0; i < this.opds.length; i++) {
      //   const link1 = this.opds[i].getVisualElementByLogical(oldLink);
      //   const link2 = this.opds[i].getVisualElementByLogical(newLink);
      //   // if in OPD i only one of the link exist
      //   if ((link1 && !link2) || (!link1 && link2) || (link1 && link2 &&
      //     ((<OpmLink>link1).sourceVisualElement !== (<OpmLink>link2).sourceVisualElement) &&
      //     ((<OpmLink>link1).targetVisualElements[0].targetVisualElement !==
      //       (<OpmLink>link2).targetVisualElements[0].targetVisualElement))) {
      //     return this.opds[i].getName();
      //   }
      // }
    }
    hasSubModels() {
      return this.opds.filter(opd => opd.sharedOpdWithSubModelId).length > 0;
    }
    createStructuralViewOpd(thing, direction) {
      return this.complexity.createStructuralViewOpd(thing, direction);
    }
    showUnfold(visual) {
      const id = visual.refineable ? visual.refineable.id : visual.refineeUnfolding.id;
      const opd = this.getOpdByThingId(id);
      return {
        success: true,
        isNewlyCreated: false,
        opd: opd,
        message: ""
      };
    }
    emptyRedoStack() {
      return this.undoRedo.emptyRedoStack();
    }
    setShouldLogForUndoRedo(value, contextName) {
      this.undoRedo.setShouldLog(value, contextName);
    }
    shouldLogForUndoRedo() {
      return this.undoRedo.shouldLogForUndoRedo();
    }
    removeOpd(id) {
      this.logForUndo("Opd removal: " + (this.getOpd(id)?.getName() || ""));
      const opd = this.getOpd(id);
      if (!opd) {
        return;
      }
      this.foldOutRelationsIfLastVisualsRemained(opd);
      super.removeOpd(id);
    }
    foldOutRelationsIfLastVisualsRemained(removeOpd) {
      const things = removeOpd.visualElements.filter(v => OPCloudUtils.isInstanceOfVisualThing(v));
      const foldedThings = things.filter(v => v.logicalElement.visualElements.find(visual => visual.isFoldedUnderThing().isFolded)).filter(vis => vis.logicalElement.visualElements.length === 2);
      for (const visual of foldedThings) {
        const toFoldOut = visual.logicalElement.visualElements.find(vis => vis !== visual && vis.isFoldedUnderThing().isFolded);
        if (toFoldOut) {
          const opd = toFoldOut.logicalElement.opmModel.getOpdByThingId(toFoldOut.id);
          if (!opd.isHidden) {
            toFoldOut.logicalElement.opmModel.currentOpd = opd; // critical for next line to work correctly.
            this.foldOutFundamentalRelation(toFoldOut);
          }
        }
      }
    }
    isComputational(visualThing) {
      return visualThing.logicalElement.isComputational();
    }
    tryToInzoom(visual, styleParams = null, clean = false) {
      this.logForUndo("inzoom " + visual.logicalElement.text);
      return this.complexity.tryToInzoom(visual, styleParams, clean);
      // this.logForUndo('inzoom ' + (<any>visual.logicalElement).text);
    }
    tryToInzoomInDiagram(visual) {
      this.logForUndo("inzoom in diagram " + visual.logicalElement.text);
      return this.complexity.tryToInzoomInDiagram(visual);
    }
    outzoomNewDiagram(type, visuals, newThingName = "noName", styleParams) {
      this.logForUndo("outzoom");
      return this.complexity.outzoomNewDiagram(type, visuals, newThingName, styleParams);
      // this.logForUndo('outzoom');
    }
    outfoldNewDiagram(visuals, newThingName = "noName", styleParams) {
      this.logForUndo("out-fold");
      return this.complexity.outfoldNewDiagram(visuals, newThingName, styleParams);
    }
    canBeUnfold(visual, styleParams = null, clean = false) {
      this.logForUndo("unfold " + visual.logicalElement.text);
      return this.complexity.tryToUnfold(visual, styleParams, clean);
      // this.logForUndo('unfold' + (<any>visual.logicalElement).text);
    }
    canBeDuplicated(logical) {
      const opd = this.currentOpd;
      if (opd.getInzoomedThing() !== null && OPCloudUtils.isInstanceOfLogicalProcess(logical)) {
        const exist = opd.visualElements.find(vis => vis.logicalElement.lid === logical.lid);
        if (exist) {
          return false;
        }
      }
      return true;
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
    arrangeObjects(visualObjects, direction) {
      return this.uiArrangement.arrangeObjects(visualObjects, direction);
    }
    move(source, target, link) {
      // Check if new source & target are same as old
      // Needs to be moved
      if (link.sourceVisualElement === source && link.targetVisualElements[0].targetVisualElement === target) {
        return {
          success: true,
          link: link
        };
      }
      const result = this.links.canConnect(source, target, link.logicalElement.linkType);
      if (result.success === false) {
        return {
          success: false,
          message: result.message
        };
      }
      const changed = this.links.move(source, target, link);
      this.links.checkForRelatedRelations(source, target, changed);
      return {
        success: true,
        link: changed
      };
    }
    connectMultiple(source, targets, params) {
      // Filter out null targets and validate connection
      const ableToConnect = targets.filter(t => t?.logicalElement && this.links.canConnect(source, t, params.type).success).map(t => t.logicalElement.text);
      // If no valid connections, return failure result
      if (ableToConnect.length === 0) {
        return {
          success: false,
          created: [],
          removed: [],
          message: "Cannot connect to any of the targets."
        };
      }
      // Log for undo
      this.logForUndo("link connection from " + source.logicalElement.text + " to " + ableToConnect.join(", "));
      this.setShouldLogForUndoRedo(false, "OpmModel-connectMultiple");
      // Create connections
      const created = [];
      for (const target of targets) {
        if (target?.logicalElement) {
          // Ensure target is valid
          const canConnect = this.links.canConnect(source, target, params.type);
          if (canConnect.success) {
            created.push(this.links.connect(source, target, params));
          }
        }
      }
      this.setShouldLogForUndoRedo(true, "OpmModel-connectMultiple");
      // Return success if at least one connection was created
      return {
        success: created.length > 0,
        created: created,
        removed: []
      };
    }
    connect(source, target, params, logforUndo = true) {
      if (logforUndo) {
        this.logForUndo("link connection between " + source.logicalElement.text + " and " + target.logicalElement.text);
      }
      this.setShouldLogForUndoRedo(false, "OpmModel-connect");
      const isAlreadyConnected = this.links.isCommutativeConnection(source, target, params);
      if (isAlreadyConnected.connected) {
        this.setShouldLogForUndoRedo(true, "OpmModel-connect");
        if (fundamental.contains(isAlreadyConnected.link.type)) {
          return this.links.replaceTriangle(source, target, isAlreadyConnected.link, params.type);
        }
        return this.links.replace(source, target, isAlreadyConnected.link, params);
      }
      const canConnect = this.links.canConnect(source, target, params.type);
      if (canConnect.success) {
        const created = [this.links.connect(source, target, params)];
        this.setShouldLogForUndoRedo(true, "OpmModel-connect");
        return {
          success: true,
          created: created,
          removed: [],
          warnings: canConnect.warnings
        };
      }
      this.setShouldLogForUndoRedo(true, "OpmModel-connect");
      return {
        success: false,
        message: canConnect.message,
        changeAction: canConnect.changeAction
      };
    }
    replaceTriangle(source, target, link, type) {
      return this.links.replaceTriangle(source, target, link, type);
    }
    connectInOurPair(source, target, type) {
      this.logForUndo("In/Out links connection between " + source.logicalElement.text + " and " + target.logicalElement.text);
      return this.links.connectInOutPair(source, target, type);
    }
    removeElement(visual, operation) {
      switch (operation) {
        case RemoveType.Localy:
          return this.removeElementLocally(visual);
        case RemoveType.InThisOPDOnly:
          return this.removeElementInCurrentOpd(visual);
        case RemoveType.AllOPDs:
          return this.removeElementInModel(visual);
      }
    }
    createToScreen(type) {
      if (type === EntityType.Object) {
        return this.createObject(this.currentOpd);
      } else if (type === EntityType.Process) {
        return this.createProcess(this.currentOpd);
      }
      return undefined;
    }
    copyToScreen(logical) {
      const visual = this.createVisualThing(logical, this.currentOpd);
      return visual;
    }
    createVisualThing(logical, opd) {
      const visual = logical.createVisual(undefined);
      // logical.visualElements.push(visual);
      opd.add(visual);
      return visual;
    }
    bring(visual, opt, styleParams) {
      visual.bring(this, opt, styleParams);
    }
    setRequirementsBroughtEntitiesPositions(requirementObject, opd) {
      return this.complexity.setRequirementsBroughtEntitiesPositions(requirementObject, opd);
    }
    flattening(leafsOnly = true) {
      return new DsmModel(this).flattening(leafsOnly);
    }
    getOPMQueryID() {
      return "OPMqUeRy";
    }
    cloneLogicalEntity(entity) {
      let type;
      if (entity.constructor.name.includes("Object")) {
        type = EntityType.Object;
      } else if (entity.constructor.name.includes("Process")) {
        type = EntityType.Process;
      } else if (entity.constructor.name.includes("State")) {
        type = EntityType.State;
      }
      const params = entity.getParams();
      const equivalentFromStereotypeLID = params.lid;
      delete params.lid;
      delete params.simulationParams;
      const clonedLogical = this.logicalFactory(type, params);
      clonedLogical.equivalentFromStereotypeLID = equivalentFromStereotypeLID;
      const clonedVisual = clonedLogical.visualElements[0];
      clonedVisual.setDefaultStyleFields();
      const bestVisToGetParamsFrom = entity.visualElements.find(v => v.width) || entity.visualElements[0];
      clonedVisual.setParams(bestVisToGetParamsFrom.getParams());
      clonedVisual.id = uuid();
      if (clonedLogical instanceof OpmLogicalObject) {
        const validation = clonedLogical.getValidationModule();
        if (validation.isActive()) {
          const type = validation.getType();
          const pattern = validation.getRange();
          new RangeValidationAccess(this).createFromStereotype(clonedLogical, {
            type,
            pattern
          });
        }
      }
      // pay attention, the visual is not added to an opd automatically.
      return {
        logical: clonedLogical,
        visual: clonedVisual
      };
    }
    instantiateValue(state) {
      if (state.getFather().isComputational() && state.text.includes("dflt=")) {
        state.text = state.text.substring(state.text.indexOf("dflt=") + 5).slice();
      }
    }
    copyLinkLabelsToCopiedLink(original, copy) {
      if (original.hasOwnProperty("labels")) {
        copy.labels = Object.assign([], original.labels);
      }
      if (original.hasOwnProperty("sourceMultiplicity")) {
        copy.sourceMultiplicity = (original.sourceMultiplicity || "") + "";
      }
      if (original.hasOwnProperty("targetMultiplicity")) {
        copy.targetMultiplicity = (original.targetMultiplicity || "") + "";
      }
      if (original.hasOwnProperty("tag")) {
        copy.tag = (original.tag || "") + "";
      }
      if (original.hasOwnProperty("backwardTag")) {
        copy.backwardTag = (original.backwardTag || "") + "";
      }
      if (original.hasOwnProperty("forwardTag")) {
        copy.forwardTag = (original.forwardTag || "") + "";
      }
      if (original.hasOwnProperty("path")) {
        copy.path = (original.path || "") + "";
      }
      if (original.hasOwnProperty("Probability")) {
        copy.Probability = (original.Probability || "") + "";
      }
      if (original.hasOwnProperty("rate")) {
        copy.rate = (original.rate || "") + "";
      }
      if (original.hasOwnProperty("rateUnits")) {
        copy.rateUnits = (original.rateUnits || "") + "";
      }
      if (original.hasOwnProperty("timeMax")) {
        copy.timeMax = (original.timeMax || "") + "";
      }
      if (original.hasOwnProperty("timeMaxVal")) {
        copy.timeMaxVal = (original.timeMaxVal || "") + "";
      }
      if (original.hasOwnProperty("timeMin")) {
        copy.timeMin = (original.timeMin || "") + "";
      }
      if (original.hasOwnProperty("timeMinVal")) {
        copy.timeMinVal = (original.timeMinVal || "") + "";
      }
    }
    cloneStereotypeToOpd(stereotype, newOpd, hashT) {
      const things = stereotype.getOpd().visualElements.filter(vis => vis instanceof OpmVisualThing);
      const links = stereotype.getOpd().visualElements.filter(vis => vis instanceof OpmLink);
      const createdVisuals = [];
      for (const thing of things) {
        if (thing instanceof OpmVisualObject && thing.isValueTyped()) {
          continue;
        }
        const cloned = this.cloneLogicalEntity(thing.logicalElement);
        hashT[thing.logicalElement.lid] = cloned.logical.lid;
        cloned.visual.children = [];
        for (const child of thing.children) {
          if (child.isFoldedUnderThing && child.isFoldedUnderThing().isFolded) {
            continue;
          }
          const clonedChild = this.cloneLogicalEntity(child.logicalElement);
          hashT[child.logicalElement.lid] = clonedChild.logical.lid;
          clonedChild.visual.fatherObject = cloned.visual;
          cloned.visual.children.push(clonedChild.visual);
          createdVisuals.push(clonedChild.visual);
          clonedChild.logical.parent = cloned.logical;
          if (cloned.logical.states && clonedChild.visual instanceof OpmVisualState) {
            cloned.logical.states.push(clonedChild.logical);
            cloned.visual.states.push(clonedChild.visual);
            if (clonedChild.logical.text.includes("dflt=")) {
              this.instantiateValue(clonedChild.logical);
            }
          }
        }
        if (thing.isSemiFolded()) {
          this.foldInAllFundamentalRelations(cloned.visual);
        }
        createdVisuals.push(cloned.visual);
      }
      for (const link of links) {
        const visSrc = createdVisuals.find(vis => vis.logicalElement.equivalentFromStereotypeLID === link.source.logicalElement.lid);
        const visTrgt = createdVisuals.find(vis => vis.logicalElement.equivalentFromStereotypeLID === link.target.logicalElement.lid);
        const linkParams = {
          type: link.type,
          connection: linkConnectionType.systemic
        };
        if (visSrc && visTrgt) {
          const ret = this.links.connect(visSrc, visTrgt, linkParams);
          // const ret = this.connect(visSrc, visTrgt, linkParams);
          if (ret) {
            createdVisuals.push(ret);
            this.copyLinkLabelsToCopiedLink(link, ret);
          }
        }
      }
      newOpd.addElements(createdVisuals);
      const logicals = (0, removeDuplicationsInArray)(createdVisuals.map(v => v.logicalElement));
      for (const log of logicals) {
        if ((log.constructor.name.includes("Object") || log.constructor.name.includes("Process")) && log.getStereotype()) {
          // if an element had stereotype => recreate its stereotype connection to achieve the required hidden opd.
          const str = {
            id: log.getStereotype().id
          };
          log.setStereotype(undefined);
          this.addStereotypeToThing(str, log);
        }
      }
      return createdVisuals;
    }
    replaceClonedStereotypeToActualThing(thingToReplaceTo, hiddenOpd, stereotype, hashT) {
      // const thingToReplaceFrom = hiddenOpd.visualElements.find(vis => (<any>vis.logicalElement).getBareName() === stereotype.getName()) as OpmVisualThing;
      // const thingToReplaceFrom = hiddenOpd.visualElements[0] as OpmVisualThing; // TODO: STEREOTYPE: set somehow.
      let thingToReplaceFrom = hiddenOpd.visualElements.find(vis => vis.logicalElement.getBareName() === stereotype.getMainThing().getBareName() && vis !== thingToReplaceTo);
      if (!thingToReplaceFrom) {
        thingToReplaceFrom = hiddenOpd.visualElements[0];
      }
      for (const link of thingToReplaceFrom.getLinks().inGoing) {
        this.links.move(link.source, thingToReplaceTo, link);
      }
      for (const link of thingToReplaceFrom.getLinks().outGoing) {
        const srcEssence = thingToReplaceTo.logicalElement.essence;
        const trgtEssence = link.target.logicalElement.essence;
        this.links.move(thingToReplaceTo, link.target, link);
        thingToReplaceTo.logicalElement.essence = srcEssence;
        link.target.logicalElement.essence = trgtEssence;
      }
      if (thingToReplaceFrom.logicalElement.getAllRequirements().length) {
        hiddenOpd.requirementsOpd = true;
        const logicalTo = thingToReplaceTo.logicalElement;
        const logicalFrom = thingToReplaceFrom.logicalElement;
        const jsonRequirements = logicalFrom.hiddenAttributesModule.satisfiedRequirementSetModule.toJson();
        logicalTo.hiddenAttributesModule.satisfiedRequirementSetModule.fromJson(jsonRequirements, this);
        const fromModule = logicalFrom.hiddenAttributesModule.satisfiedRequirementSetModule;
        const toModule = logicalTo.hiddenAttributesModule.satisfiedRequirementSetModule;
        toModule.requirementSet.updateSetObjectLID(hashT[fromModule.requirementSet.getSetObjectLID()]);
        toModule.requirementSet.updateModel(this);
        toModule.requirementSet.updateOwnerLID(thingToReplaceTo.logicalElement.lid); // ?????
        for (let i = 0; i < logicalTo.getAllRequirements().length; i++) {
          logicalTo.getAllRequirements()[i].updateModel(this);
          logicalTo.getAllRequirements()[i].setLogicalRequirementObjectLID(hashT[logicalTo.getAllRequirements()[i].getRequirementObjectLID()]);
        }
      }
      thingToReplaceFrom.remove();
    }
    getAllLogicalThings() {
      return this.logicalElements.filter(log => log.constructor.name.includes("Object") || log.constructor.name.includes("Process"));
    }
    splitRequirementsFromText(text) {
      return text.split(";").map(part => part.trim()).filter(part => part.length > 0);
    }
    getAllModelRequirementsNumbers() {
      const arr = [];
      for (const element of this.logicalElements) {
        if (element.linkRequirements) {
          arr.push(...this.splitRequirementsFromText(element.linkRequirements));
        } else if (OPCloudUtils.isInstanceOfLogicalObject(element) && element.isSatisfiedRequirementObject()) {
          arr.push(...this.splitRequirementsFromText(element.value));
        }
      }
      return Array.from(new Set(arr)).sort().filter(t => t !== "Requirement name or ID");
    }
    unLinkStereotype(vis) {
      this.logForUndo("Unlink Stereotype");
      this.setShouldLogForUndoRedo(false, "Unlink Stereotype");
      const stereotype = vis.logicalElement.getStereotype();
      if (stereotype && vis.logicalElement.getBelongsToStereotyped()) {
        return {
          success: false,
          reason: "Can't unlink inner stereotyped thing. first unlink the outer stereotyped thing from its stereotype."
        };
      } // if it is stereotype inside stereotype.
      let hiddenOpd = this.opds.find(opd => opd.isHidden && !opd.requirementsOpd && opd.visualElements.find(v => v.logicalElement.lid === vis.logicalElement.lid));
      if (!hiddenOpd) {
        hiddenOpd = this.opds.find(opd => opd.isHidden && opd.requirementsOpd && opd.visualElements.find(v => v.logicalElement.lid === vis.logicalElement.lid));
      }
      if (!hiddenOpd) {
        return {
          success: false
        };
      }
      const logicalThings = this.getAllLogicalThings().filter(log => log.getBelongsToStereotyped() && log.getBelongsToStereotyped() === vis.logicalElement);
      const entitiesToUpdate = [];
      const requirementsDataToKeep = [vis.logicalElement];
      for (const log of logicalThings) {
        log.setBelongsToStereotyped(undefined);
        log.equivalentFromStereotypeLID = undefined;
        entitiesToUpdate.push(...log.visualElements.filter(v => this.getOpdByThingId(v.id) === this.currentOpd));
        if (log.getAllRequirements().length > 0 || log.isSatisfiedRequirementSetObject() || log.isSatisfiedRequirementObject()) {
          requirementsDataToKeep.push(log);
        }
      }
      vis.logicalElement.setStereotype(undefined);
      if (vis.isSemiFolded()) {
        for (let j = vis.semiFolded.length - 1; j >= 0; j--) {
          this.foldOutFundamentalRelation(vis.semiFolded[j]);
        }
      }
      let requirementsOpd;
      if (requirementsDataToKeep.length > 1) {
        requirementsOpd = this.getOrCreateRequirementsOpd();
        if (requirementsOpd === hiddenOpd) {
          requirementsOpd = this.createRequirementsOpd();
        }
      }
      hiddenOpd.visualElements.sort((a, b) => a.isLink() ? -1 : 1);
      for (let i = hiddenOpd.visualElements.length - 1; i >= 0; i--) {
        const hiddenVis = hiddenOpd.visualElements[i];
        if (hiddenOpd.visualElements.includes(hiddenVis) && hiddenVis.logicalElement !== vis.logicalElement) {
          if (requirementsDataToKeep.includes(hiddenVis.logicalElement) || requirementsDataToKeep.includes(hiddenVis.logicalElement.parent)) {
            requirementsOpd.visualElements.push(...hiddenOpd.visualElements.splice(i, 1));
          } else if (hiddenVis.isLink() && requirementsOpd.visualElements.includes(hiddenVis.source) && requirementsOpd.visualElements.includes(hiddenVis.target)) {
            requirementsOpd.visualElements.push(...hiddenOpd.visualElements.splice(i, 1));
          } else {
            hiddenVis.remove();
          }
        } else if (requirementsDataToKeep.length > 1 && hiddenVis && hiddenVis.logicalElement === vis.logicalElement) {
          requirementsOpd.visualElements.push(...hiddenOpd.visualElements.splice(i, 1));
        }
      }
      this.removeOpd(hiddenOpd.id);
      this.removeStereotypeFromModel(stereotype);
      this.setShouldLogForUndoRedo(true, "Unlink Stereotype");
      return {
        success: true,
        entitiesToUpdate: entitiesToUpdate
      };
    }
    removeStereotype(vis) {
      const stereotype = vis.logicalElement.getStereotype();
      if (stereotype && vis.logicalElement.getBelongsToStereotyped()) {
        return {
          success: false,
          reason: "Can't remove inner stereotype. first remove the outer stereotype."
        };
      } // if it is stereotype inside stereotype.
      let hiddenOpd = this.opds.find(opd => opd.isHidden && !opd.requirementsOpd && opd.visualElements.find(v => v.logicalElement.lid === vis.logicalElement.lid));
      if (!hiddenOpd) {
        hiddenOpd = this.opds.find(opd => opd.isHidden && opd.requirementsOpd && opd.visualElements.find(v => v.logicalElement.lid === vis.logicalElement.lid));
      }
      if (!hiddenOpd) {
        return {
          success: false
        };
      }
      const isRequirementStereotype = stereotype.name === "Requirement";
      for (const visAtOpd of vis.logicalElement.visualElements) {
        if (visAtOpd.isSemiFolded()) {
          for (let y = visAtOpd.semiFolded.length - 1; y >= 0; y--) {
            this.foldOutFundamentalRelation(visAtOpd.semiFolded[y]);
          }
        }
      }
      if (vis.logicalElement.hasRequirements()) {
        const logical = vis.logicalElement;
        for (let e = logical.getAllRequirements().length - 1; e >= 0; e--) {
          const req = logical.getAllRequirements()[e];
          logical.getSatisfiedRequirementSetModule().removeSingleRequirement(req.getRequirementObjectLID());
        }
      }
      let logicalThings = this.getAllLogicalThings().filter(log => log.getBelongsToStereotyped() && log.getBelongsToStereotyped() === vis.logicalElement);
      const linksToRemove = vis.logicalElement.getLinks().outGoing.filter(l => l.targetLogicalElements[0].getStereotype());
      const toResetBelongsToStereotype = logicalThings.filter(log => log.getStereotype());
      logicalThings = logicalThings.filter(log => !log.getStereotype());
      const entitiesToRemain = linksToRemove.map(link => link.targetLogicalElements[0]);
      for (const logLink of linksToRemove) {
        for (let a = logLink.visualElements.length - 1; a >= 0; a--) {
          logLink.visualElements[a].remove();
        }
      }
      for (const log of logicalThings) {
        log.setBelongsToStereotyped(undefined);
        log.equivalentFromStereotypeLID = undefined;
        if (!entitiesToRemain.includes(log)) {
          for (let k = log.visualElements.length - 1; k >= 0; k--) {
            if (OPCloudUtils.isInstanceOfLogicalObject(log) && log.visualElements[k].hasRange()) {
              new RangeValidationAccess(this).removeRange(log.visualElements[k]);
            }
            log.visualElements[k].remove();
          }
        }
      }
      vis.logicalElement.setStereotype(undefined);
      if (vis.isSemiFolded()) {
        for (let j = vis.semiFolded.length - 1; j >= 0; j--) {
          this.foldOutFundamentalRelation(vis.semiFolded[j]);
        }
      }
      for (let i = hiddenOpd.visualElements.length - 1; i >= 0; i--) {
        const hiddenVis = hiddenOpd.visualElements[i];
        if (hiddenOpd.visualElements.includes(hiddenVis) && hiddenVis.logicalElement !== vis.logicalElement) {
          hiddenVis.remove();
        }
      }
      if (!vis.getRefineeInzoom() && !vis.getRefineeUnfold()) {
        vis.logicalElement.visualElements.forEach(v => v.strokeWidth = 2);
      }
      toResetBelongsToStereotype.forEach(log => log.setBelongsToStereotyped(undefined));
      if (this.getOpd(hiddenOpd.id)) {
        this.removeOpd(hiddenOpd.id);
      }
      this.removeHiddenUnusedOpds();
      this.removeStereotypeFromModel(stereotype);
      if (isRequirementStereotype) {
        this.removeUnfoldedOpdOfRemoveRequirementStereotype(vis);
      }
      return {
        success: true
      };
    }
    removeUnfoldedOpdOfRemoveRequirementStereotype(vis) {
      const refineeUnfold = vis.getRefineeUnfold();
      if (refineeUnfold) {
        const unfoldOpd = this.getOpdByThingId(refineeUnfold.id);
        if (unfoldOpd && unfoldOpd.visualElements.length <= 2) {
          const currentOpdId = this.currentOpd.id;
          this.removeOpd(unfoldOpd.id);
          if (currentOpdId === unfoldOpd.id) {
            this.currentOpd = this.opds[0];
          }
        }
      }
    }
    removeHiddenUnusedOpds() {
      for (let i = this.opds.length - 1; i >= 0; i--) {
        if (this.opds[i].isHidden && this.opds[i].visualElements.length === 0) {
          this.removeOpd(this.opds[i].id);
        }
      }
    }
    canChangeArcType(newArcType, visualLinks, side) {
      return this.links.canChangeArcType(newArcType, visualLinks, side);
    }
    validityCheck() {
      // let fixApplied = false;
      // while (!this.testModelValidity()) {
      //   this.undo();
      //   fixApplied = true;
      //   console.log('step');
      // }
      // if (fixApplied)
      //   console.log('fixed!');
    }
    testModelValidity() {
      const thisJson = this.toJson();
      const testModel = new OpmModel();
      try {
        testModel.fromJson(thisJson, true);
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }
    logForUndo(reason = "") {
      this.validityCheck();
      const init = (0, getInitRappidShared)();
      if (this.shouldLogForUndoRedo() === false || this.currentOpd.isStereotypeOpd() || init && init.isDSMClusteredView && init.isDSMClusteredView.value === true) {
        return;
      }
      if (init?.currentlyPastingStyleParams) {
        return;
      }
      const data = {
        json: this.json.toJson(false, true),
        opd: this.currentOpd,
        reason: reason
      };
      if (!reason.includes("computation") && init && init.graph && init.graph.hasActiveBatch("computationAdd")) {
        return;
      }
      this.lastOperations.push(reason);
      this.undoRedo.log(data);
      this.hasUnsavedWork = true;
    }
    lastUndoOpReasonUpdate(reason = "") {
      const len = this.undoRedo.updateReasonetoLastUndoOp(reason);
    }
    getLastUndoOpertaion() {
      return this.undoRedo.getLastUndoOpertaion();
    }
    removeLastUndoOperation() {
      this.undoRedo.removeLastUndoOperation();
    }
    undo() {
      const data = {
        json: this.json.toJson(false, true),
        opd: this.currentOpd
      };
      const item = this.undoRedo.popUndo(data);
      if (item) {
        this.lastOperations.push("undo click (" + (item.reason || "") + ")");
        this.json.fromJson(item.json);
      }
      return item;
    }
    redo() {
      const data = {
        json: this.json.toJson(false, true),
        opd: this.currentOpd
      };
      const item = this.undoRedo.popRedo(data);
      if (item) {
        this.lastOperations.push("redo click (" + (item.reason || "") + ")");
        this.json.fromJson(item.json);
      }
      return item;
    }
    getAllNotesInModel() {
      const notes = [];
      this.opds.forEach(opd => {
        if (opd.notes.length) {
          notes.push(...opd.notes);
        }
      });
      return notes;
    }
    sortFoldedFundamentalRelations(a, b) {
      return this.complexity.sortFoldedFundamentalRelations(a, b);
    }
    foldInAllFundamentalRelations(thing) {
      return this.complexity.foldInAllFundamentalRelations(thing);
    }
    foldInFundamentalRelation(visualLink) {
      return this.complexity.foldInFundamentalRelation(visualLink);
    }
    foldOutFundamentalRelation(folded) {
      return this.complexity.foldOutFundamentalRelation(folded);
    }
    removeSemifolding(visual) {
      for (let i = visual.semiFolded.length - 1; i >= 0; i--) {
        this.foldOutFundamentalRelation(visual.semiFolded[i]);
      }
    }
    getSimulatedData(numberOfSimulations) {
      const logicals = this.logicalElements.filter(item => item instanceof OpmLogicalObject && item.isComputational() && item.getSimulationParams().simulated);
      const ret = [];
      for (let i = 0; i < numberOfSimulations; i++) {
        const temp = {};
        for (const logical of logicals) {
          temp[logical.getBareName()] = logical.getRandomValues(1)[0];
        }
        ret[i] = temp;
      }
      return ret;
    }
    removeOPMQueryOPD() {
      new DsmModel(this).removeOPMQueryOPD();
    }
    addWaitingProcess(visualProcess) {
      const existingId = visualProcess.logicalElement.getWaitingProcess();
      const isInzoomed = visualProcess === visualProcess.getRefineeInzoom();
      const lastChild = visualProcess.getLastChild();
      const refElement = isInzoomed ? visualProcess.getLastChild() : visualProcess;
      if (existingId) {
        const logicalExist = this.logicalElements.find(log => log.lid === existingId);
        const opd = this.getOpdByThingId(visualProcess.id);
        const visualExistInOpd = opd.visualElements.find(vis => vis.logicalElement.lid === existingId);
        if (visualExistInOpd) {
          return {
            isNewlyCreated: false
          };
        }
        const newVisual = this.bringVisualToOpd(logicalExist, opd);
        newVisual.xPos = refElement.xPos;
        newVisual.yPos = refElement.yPos + refElement.height + 70;
        if (isInzoomed) {
          newVisual.fatherObject = visualProcess;
          visualProcess.children.push(newVisual);
        }
        const linkParams = {
          type: linkType.Invocation,
          connection: linkConnectionType.systemic
        };
        const link1 = this.connect(refElement, newVisual, linkParams);
        const link2 = this.connect(newVisual, visualProcess, linkParams);
        const linkToRemove = refElement.getLinks().outGoing.find(l => l.type === linkType.Invocation && l.target === visualProcess);
        if (linkToRemove) {
          linkToRemove.remove();
        }
        return {
          isNewlyCreated: true,
          links: [...link1.created, ...link2.created],
          waitingProcess: newVisual,
          removed: linkToRemove
        };
      }
      const ret = this.createToScreen(EntityType.Process);
      ret.visual.width = 135;
      ret.visual.height = 60;
      ret.visual.setDefaultStyleFields();
      ret.visual.xPos = refElement.xPos;
      ret.visual.yPos = refElement.yPos + refElement.height + (isInzoomed ? 45 : 80);
      ret.logical.text = "waiting";
      ret.logical.setIsWaitingProcess(true);
      ret.logical.getDurationManager().setTimeDuration({
        units: "sec",
        min: null,
        nominal: 1,
        max: null
      });
      let selfInovcation = visualProcess.getAllLinks().inGoing.find(l => l.source === l.target && l.type === linkType.Invocation);
      const timeData = selfInovcation.logicalElement.duration;
      // keeping the duration data
      if (timeData.nominal) {
        ret.logical.getDurationManager().setTimeDuration(timeData);
      }
      if (this.getOpdByThingId(selfInovcation.id).id === this.currentOpd.id) {
        selfInovcation.remove();
      }
      visualProcess.logicalElement.setWaitingProcess(ret.logical.lid);
      const linkParams = {
        type: linkType.Invocation,
        connection: linkConnectionType.systemic
      };
      if (isInzoomed) {
        selfInovcation = visualProcess.getLastChild().getLinks().outGoing.find(l => l.type === linkType.Invocation && l.target === visualProcess);
        if (selfInovcation) {
          selfInovcation.remove();
        }
        ret.visual.fatherObject = visualProcess;
        visualProcess.children.push(ret.visual);
      }
      const correctSource = isInzoomed ? lastChild : visualProcess;
      const link1 = this.connect(correctSource, ret.visual, linkParams);
      const link2 = this.connect(ret.visual, visualProcess, linkParams);
      return {
        isNewlyCreated: true,
        links: [...link1.created, ...link2.created],
        waitingProcess: ret.visual,
        removed: selfInovcation
      };
    }
    removeWaitingProcess(visualProcess) {
      const existingId = visualProcess.logicalElement.getWaitingProcess();
      const logicalExist = this.logicalElements.find(log => log.lid === existingId);
      const opd = this.getOpdByThingId(visualProcess.id);
      const visToRemove = opd.visualElements.find(v => v.logicalElement.lid === existingId);
      let lastSubChild;
      const isInzoomed = visualProcess === visualProcess.getRefineeInzoom();
      if (isInzoomed) {
        lastSubChild = visToRemove.getLinks().inGoing.find(l => l.type === linkType.Invocation).source;
      }
      const timeData = {
        ...logicalExist.getDurationManager().getTimeDuration()
      };
      const ret = visToRemove.remove();
      if (logicalExist.visualElements.length === 0) {
        visualProcess.logicalElement.setWaitingProcess(undefined);
      }
      let link;
      if (!isInzoomed) {
        link = this.connect(visualProcess, visualProcess, {
          type: linkType.Invocation,
          connection: linkConnectionType.systemic
        });
      } else {
        link = this.connect(lastSubChild, visualProcess, {
          type: linkType.Invocation,
          connection: linkConnectionType.systemic
        });
      }
      // keeping the duration data
      if (timeData.nominal) {
        link.created[0].logicalElement.duration.setTimeDuration(timeData);
      }
      return {
        removed: visToRemove,
        link: link
      };
    }
    setAsComputational(visual) {
      const logical = visual.logicalElement;
      if (logical.isComputational()) {
        return;
      }
      // Remove all current states
      for (let i = 0; i < logical.visualElements.length; i++) {
        const children = logical.visualElements[i].children; // get all embedded states
        for (let j = 0; j < children.length; j++) {
          this.removeElementFromOpds(children[j]);
          this.remove(children[j].id);
        }
        logical.visualElements[i].children = [];
      }
      logical.states.length = 0;
      const defaultValue = "value";
      // create one state
      const valueState = visual.createState();
      // set logical as computational
      logical.value = defaultValue;
      logical.valueType = valueType.Number;
      logical.essence = Essence.Informatical;
      // Beutify
      visual.rearrange(statesArrangement.Bottom);
    }
    toggleValueTypeObject(visual) {
      return new RangeValidationAccess(this).toggleValueTypeObject(visual);
    }
    setRange(visual, range) {
      return new RangeValidationAccess(this).setRange(visual, range);
    }
    static #_ = (() => this.ViewOpdPrefixName = "View of ")();
    validateViewOpdName(fatherOpd, name) {
      if (name.length < 2) {
        return {
          valid: false,
          error: "The name should be at least 2 characters long"
        };
      }
      if (fatherOpd.children.find(opd => opd.name === OpmModel.ViewOpdPrefixName + name)) {
        return {
          valid: false,
          error: "This name is already in use"
        };
      }
      return {
        valid: true
      };
    }
    createViewOpd(selected, name) {
      const validation = this.validateViewOpdName(this.currentOpd, name);
      if (validation.valid == false) {
        return {
          created: false,
          errors: [validation.error]
        };
      }
      const currentOpd = this.currentOpd;
      const viewOpd = new OpmOpd(OpmModel.ViewOpdPrefixName + name);
      viewOpd.setAsViewOpd();
      this.addOpd(viewOpd);
      viewOpd.parendId = currentOpd.id;
      currentOpd.children.push(viewOpd);
      const brought = selected.map(vis => this.bringVisualToOpd(vis.logicalElement, viewOpd));
      brought.forEach(br => {
        if (OPCloudUtils.isInstanceOfVisualObject(br)) {
          br.expressAll();
        }
        this.bring(br);
      });
      let fineEntities = selected.map(s => s.logicalElement.visualElements.find(v => this.getOpdByThingId(v.id) === viewOpd)).filter(r => !!r);
      const temp = [];
      for (const vis of fineEntities.filter(it => OPCloudUtils.isInstanceOfVisualThing(it))) {
        if (vis.children) {
          temp.push(...vis.children);
        }
      }
      fineEntities.push(...temp);
      const toRemove = [];
      for (let i = viewOpd.visualElements.length; i > 0; i--) {
        const vis = viewOpd.visualElements[i];
        if (OPCloudUtils.isInstanceOfVisualThing(vis) && !fineEntities.includes(vis)) {
          toRemove.push(vis);
        }
      }
      toRemove.forEach(r => r.remove());
      return {
        created: true,
        viewOpd
      };
    }
    renameViewOpd(view, name) {
      const validation = this.validateViewOpdName(this.getOpd(view.parendId), name);
      if (validation.valid == false) {
        return {
          renamed: false,
          error: validation.error
        };
      }
      view.name = OpmModel.ViewOpdPrefixName + name;
      return {
        renamed: true
      };
    }
    shouldAllowInvalidValueAtDesignTime() {
      if (this.validation.validation_time == "both" || this.validation.validation_time == "design") {
        if (this.validation.enforcment_level == "hard") {
          return false;
        }
      }
      return true;
    }
    shouldAllowInvalidValueAtExecutionTime() {
      if (this.validation.validation_time == "both" || this.validation.validation_time == "execution") {
        if (this.validation.enforcment_level == "hard") {
          return false;
        }
      }
      return true;
    }
    getHighlightValidationStatus() {
      return "off";
    }
    /*
    Gets Enabler link to father process and creates multiple visual links of the same
    type to its sub-processes.
    */
    inzoomSplit(visualUnifiedLink) {
      const model = this;
      const connectionType = visualUnifiedLink.type;
      const sourceVis = visualUnifiedLink.source;
      const targetVis = visualUnifiedLink.target;
      const isCondition = visualUnifiedLink.logicalElement.condition;
      const isEvent = visualUnifiedLink.logicalElement.event;
      let children = targetVis.children.filter(ch => ch.constructor.name === targetVis.constructor.name);
      const linkParams = {
        type: connectionType,
        connection: 0,
        isEvent: isEvent,
        isCondition: isCondition
      };
      if (isEvent && children.length > 1) {
        children = [children[0]];
      }
      const ret = model.connectMultiple(sourceVis, children, linkParams);
      // if links existed before -> need to get their data:
      if (visualUnifiedLink.previousLinksData) {
        for (const link of ret.created) {
          for (const data of visualUnifiedLink.previousLinksData) {
            if (link.target.id === data.targetID) {
              link.setParams(data.params);
              link.BreakPoints = data.BreakPoints;
            }
          }
        }
      }
      for (const link of ret.created) {
        const lk = link;
        lk.previousLinksData = [{
          sourceID: sourceVis.id,
          targetID: targetVis.id,
          BreakPoints: visualUnifiedLink.BreakPoints,
          params: visualUnifiedLink.getParams()
        }];
      }
      visualUnifiedLink.remove();
      if (ret.success) {
        return {
          success: true,
          show: ret.created,
          remove: visualUnifiedLink
        };
      }
      return {
        success: false,
        show: undefined,
        remove: visualUnifiedLink
      };
    }
    /*
    Gets Enabler link to father object/process and creates multiple visual links of the
    same type to its sub-objects/processes
     */
    structuralSplit(visualUnifiedLink, fatherType) {
      const model = this;
      const sourceVis = visualUnifiedLink.source;
      const targetVis = visualUnifiedLink.target;
      const connectionType = visualUnifiedLink.type;
      const isCondition = visualUnifiedLink.logicalElement.condition;
      const isEvent = visualUnifiedLink.logicalElement.event;
      const linkParams = {
        type: connectionType,
        connection: 0,
        isEvent: isEvent,
        isCondition: isCondition
      };
      let structuralLinks;
      if (fatherType === "object") {
        structuralLinks = sourceVis.getLinks().outGoing.filter(link => link.isStructuralLink());
      } else {
        structuralLinks = targetVis.getLinks().outGoing.filter(link => link.isStructuralLink());
      }
      const structuralChildren = [];
      const newLinks = [];
      for (const link of structuralLinks) {
        structuralChildren.push(link.target);
      }
      if (fatherType === "object") {
        for (const child of structuralChildren) {
          newLinks.push(model.links.connect(child, targetVis, linkParams));
        }
      } else {
        for (const child of structuralChildren) {
          newLinks.push(model.links.connect(sourceVis, child, linkParams));
        }
      }
      if (visualUnifiedLink.previousLinksData) {
        for (const link of newLinks) {
          for (const data of visualUnifiedLink.previousLinksData) {
            if (fatherType === "object") {
              if (link.source.id === data.sourceID) {
                link.setParams(data.params);
                link.BreakPoints = data.BreakPoints;
              }
            } else if (link.target.id === data.targetID) {
              link.setParams(data.params);
              link.BreakPoints = data.BreakPoints;
            }
          }
        }
      }
      for (const link of newLinks) {
        link.previousLinksData = [{
          sourceID: sourceVis,
          targetID: targetVis,
          BreakPoints: visualUnifiedLink.BreakPoints,
          params: visualUnifiedLink.getParams()
        }];
      }
      visualUnifiedLink.remove();
      return {
        success: true,
        show: newLinks,
        remove: visualUnifiedLink
      }; // TAL: need to add return value for failure?
    }
    /*
    Gets Enabler link to one of the sub-processes of an inZoomed process, and creates single Enabler link of
    the same type between the inZoomed process and the source object.
     */
    inzoomUnite(visualDistributedLink) {
      const model = visualDistributedLink.logicalElement.opmModel;
      const objectVis = visualDistributedLink.source;
      const processVis = visualDistributedLink.target;
      let unifiedEnablerLink;
      const connectionType = model.getVisualElementById(visualDistributedLink.id).type;
      const father = processVis.fatherObject;
      const links = objectVis.getLinksWithOtherAndItsChildren(father).outGoing.filter(l => l.target !== father);
      const params = {
        type: connectionType,
        connection: linkConnectionType.enviromental
      };
      unifiedEnablerLink = model.links.connect(objectVis, father, params);
      const t = links.find(l => l.previousLinksData);
      if (t) {
        unifiedEnablerLink.setParams(t.previousLinksData[0].params);
        unifiedEnablerLink.BreakPoints = t.previousLinksData[0].BreakPoints;
      }
      unifiedEnablerLink.previousLinksData = [];
      const remove = [];
      const show = [unifiedEnablerLink];
      for (const link of links) {
        unifiedEnablerLink.previousLinksData.push({
          sourceID: link.source.id,
          targetID: link.target.id,
          BreakPoints: link.BreakPoints,
          params: link.getParams()
        });
        remove.push(link);
        link.remove();
      }
      return {
        success: true,
        show: show,
        remove: remove
      };
    }
    /*
      Gets Enabler link to one of the sub-processes/objects of an refined process/object, and creates single Enabler link of
      the same type between the refined process/object and the source/target thing.
     */
    structuralUnite(visualDistributedLink, fatherType) {
      const children = [];
      const links = [];
      const model = this;
      const sourceVis = visualDistributedLink.source;
      const targetVis = visualDistributedLink.target;
      let unifiedEnablerLink;
      const connectionType = model.getVisualElementById(visualDistributedLink.id).type;
      let father;
      if (fatherType === "object") {
        father = sourceVis.getLinks().inGoing.filter(link => link.isStructuralLink())[0].source;
      } else {
        father = targetVis.getLinks().inGoing.filter(link => link.isStructuralLink())[0].source;
      }
      const structuralLinks = father.getLinks().outGoing.filter(link => link.isStructuralLink());
      for (const link of structuralLinks) {
        children.push(link.target);
      }
      for (const child of children) {
        if (fatherType === "object") {
          links.push(...child.getLinks().outGoing.filter(link => link.type === connectionType && link.target === targetVis));
        } else {
          links.push(...child.getLinks().inGoing.filter(link => link.type === connectionType && link.source === sourceVis));
        }
      }
      const params = {
        type: connectionType,
        connection: linkConnectionType.enviromental
      };
      if (fatherType === "object") {
        unifiedEnablerLink = model.links.connect(father, targetVis, params);
      } else {
        unifiedEnablerLink = model.links.connect(sourceVis, father, params);
      }
      for (const link of links) {
        if (link.previousLinksData) {
          unifiedEnablerLink.setParams(link.previousLinksData[0].params);
          unifiedEnablerLink.BreakPoints = link.previousLinksData[0].BreakPoints;
          break;
        }
      }
      unifiedEnablerLink.previousLinksData = [];
      const remove = [];
      const show = [unifiedEnablerLink];
      for (const link of links) {
        unifiedEnablerLink.previousLinksData.push({
          sourceID: link.source.id,
          targetID: link.target.id,
          BreakPoints: link.BreakPoints,
          params: link.getParams()
        });
        remove.push(link);
        link.remove();
      }
      return {
        success: true,
        show: show,
        remove: remove
      };
    }
    getTokenRuntimeRatio() {
      return this.tokenRuntimeRatio;
    }
    setTokenRuntimeRatio(val) {
      this.tokenRuntimeRatio = val;
    }
    getUndoStack() {
      return this.undoRedo.getUndoStack();
    }
    getRedoStack() {
      return this.undoRedo.getRedoStack();
    }
    setUndoStack(stack) {
      this.undoRedo.setUndoStack(stack);
    }
    setRedoStack(stack) {
      this.undoRedo.setRedoStack(stack);
    }
    opdDragMoveUpdate(prevParent, effectedOpd, realParentId) {
      if (prevParent.id !== realParentId && (realParentId.length > 25 || realParentId === "SD")) {
        if (prevParent.children.includes(effectedOpd)) {
          prevParent.children.splice(prevParent.children.indexOf(effectedOpd), 1);
        }
        effectedOpd.parendId = realParentId;
        this.getOpd(realParentId).children.push(effectedOpd);
      }
    }
    mergeOneOpdModel(otherJsonModel) {
      const otherModel = new OpmModel();
      const currentOpd = this.currentOpd;
      const currentOpdId = this.currentOpd.id;
      let indexToPushAfter = this.opds.indexOf(this.currentOpd);
      if (this.currentOpd.children?.length > 0) {
        indexToPushAfter = this.opds.indexOf(this.currentOpd.children[this.currentOpd.children.length - 1]);
      }
      const switchedIdsRet = this.json.switchIdsOfJsonModel(otherJsonModel, this.stereotypes.getStereoTypes());
      if (switchedIdsRet.success === false) {
        return {
          success: false,
          message: switchedIdsRet.message
        };
      }
      const otherJsonAfterIdSwitching = switchedIdsRet.json;
      this.importedTemplates[otherJsonModel.id] = this.importedTemplates.hasOwnProperty(otherJsonModel.id) ? this.importedTemplates[otherJsonModel.id] + 1 : 1;
      const timesAlreadyImported = this.importedTemplates[otherJsonModel.id];
      otherModel.fromJson(otherJsonAfterIdSwitching);
      for (const logicalElementToImport of otherModel.logicalElements) {
        const log = logicalElementToImport;
        let skipNameChange = false;
        if (OPCloudUtils.isInstanceOfLogicalThing(logicalElementToImport)) {
          skipNameChange = log.getLinks().inGoing.filter(l => l.linkType === linkType.Exhibition).length > 0;
          if (log.hasRequirements()) {
            log.hiddenAttributesModule.satisfiedRequirementSetModule.getRequirementsSet().updateModel(this);
            for (const req of log.getAllRequirements()) {
              req.updateModel(this);
            }
          }
        }
        logicalElementToImport.opmModel = this;
        this.add(logicalElementToImport);
        if (timesAlreadyImported > 1 && OPCloudUtils.isInstanceOfLogicalThing(logicalElementToImport)) {
          if (!skipNameChange) {
            log.setText(log.getBareName() + "_" + timesAlreadyImported);
          }
        }
        for (const visualToImport of logicalElementToImport.visualElements) {
          const opdAt = otherModel.getOpdByThingId(visualToImport.id);
          if (!opdAt?.isHidden && opdAt?.id.endsWith("_SD")) {
            this.currentOpd.add(visualToImport);
          }
        }
      }
      for (const stereotypeToImport of otherModel.stereotypes.getStereoTypes()) {
        this.stereotypes.addStereotype(stereotypeToImport);
      }
      for (const opdToImport of otherModel.opds) {
        if (opdToImport.parendId?.endsWith("_SD")) {
          opdToImport.parendId = currentOpdId;
          if (!opdToImport.id.endsWith("_SD")) {
            currentOpd.children.push(opdToImport);
          }
        }
      }
      // adding all the opds from the imported model except the old SD that was already merged to the current opd.
      const insert = (arr, index, ...newItems) => [...arr.slice(0, index + 1), ...newItems, ...arr.slice(index + 1)];
      this.opds = insert(this.opds, indexToPushAfter, ...otherModel.opds.filter(o => !o.id?.endsWith("_SD") || o.requirementsOpd));
      this.currentOpd = currentOpd;
      return {
        success: true
      };
    }
    addRequirement(visual) {
      this.logForUndo("Add Requirement");
      this.setShouldLogForUndoRedo(false, "addRequirement");
      const logical = visual.logicalElement;
      const requirementsModule = logical.getSatisfiedRequirementSetModule();
      if (logical.isSatisfiedRequirementSetObject()) {
        // adds new requirement to existing set of the *OWNER*
        const ownerOfSet = visual.getLinks().inGoing[0]?.source;
        if (!ownerOfSet) {
          this.setShouldLogForUndoRedo(true, "addRequirement");
          return;
        }
        requirementsModule.addRequirement(ownerOfSet);
      } else if (!requirementsModule.getRequirementsSet()) {
        // creates new set
        logical.createSatisfiedRequirementSet(visual);
      } else {
        // adds new requirement to existing set
        logical.getSatisfiedRequirementSetModule().getRequirementsSet().addRequirement();
      }
      this.setShouldLogForUndoRedo(true, "addRequirement");
    }
    toggleAttributesSet(visual, shouldHideSetObject = false) {
      this.logForUndo("Toggle Requirements");
      this.setShouldLogForUndoRedo(false, "toggleAttributesSet");
      const logical = visual.logicalElement;
      if (logical.isSatisfiedRequirementSetObject()) {
        // if it is the set object then we should apply the action on the owner thing.
        const ownerOfSet = visual.getLinks().inGoing[0].source.logicalElement;
        ownerOfSet.getSatisfiedRequirementSetModule().toggleAttribute();
      } else if (logical.getSatisfiedRequirementSetModule().getRequirementsSet()) {
        // if it is the owner thing of the set.
        logical.getSatisfiedRequirementSetModule().toggleAttribute(shouldHideSetObject);
      }
      this.setShouldLogForUndoRedo(true, "toggleAttributesSet");
    }
    hideSingleRequirement(visual) {
      this.logForUndo("Toggle Requirement");
      this.setShouldLogForUndoRedo(false, "hideSingleRequirement");
      const owner = this.getOwnerOfRequirementByRequirementLID(visual.logicalElement.lid);
      if (owner) {
        owner.getSatisfiedRequirementSetModule().hideSingleRequirement(visual);
      }
      this.setShouldLogForUndoRedo(true, "hideSingleRequirement");
    }
    getElementsThatSatisfyRequirement(requirementName) {
      const links = [];
      const things = [];
      for (const element of this.logicalElements) {
        if (element.linkRequirements && this.splitRequirementsFromText(element.linkRequirements).includes(requirementName)) {
          links.push(element);
        } else if (OPCloudUtils.isInstanceOfLogicalThing(element)) {
          const thing = element;
          const reqs = thing.getAllRequirements();
          for (const req of reqs) {
            const reqObject = this.getLogicalElementByLid(req.getRequirementObjectLID());
            if (reqObject && this.splitRequirementsFromText(reqObject.value).includes(requirementName) && !things.includes(thing)) {
              things.push(thing);
            }
          }
        }
      }
      return {
        links,
        things
      };
    }
    createRequirementViewOf(requirementName) {
      this.logForUndo("Create Requirement View");
      this.setShouldLogForUndoRedo(false, "createRequirementViewOf");
      const satisfying = this.getElementsThatSatisfyRequirement(requirementName);
      const opd = new OpmOpd("View of Requirement <" + requirementName + "> Satisfying Model Parts");
      opd.requirementViewOf = requirementName;
      this.addOpd(opd);
      for (const object of satisfying.things) {
        object.visualElements[0].copyToOpd(opd);
      }
      for (const link of satisfying.links) {
        let source = opd.getVisualElementByLogical(link.sourceLogicalElement);
        if (!source) {
          source = link.sourceLogicalElement.visualElements[0].copyToOpd(opd);
        }
        let target = opd.getVisualElementByLogical(link.targetLogicalElements[0]);
        if (!target) {
          target = link.targetLogicalElements[0].visualElements[0].copyToOpd(opd);
        }
        this.links.connect(source, target, {
          type: link.linkType,
          connection: linkConnectionType.systemic
        });
      }
      opd.parendId = "Requirements";
      this.setShouldLogForUndoRedo(true, "createRequirementViewOf");
      return {
        success: true,
        opd: opd
      };
    }
    updateRequirementViewOf(opd) {
      this.logForUndo("Update Requirement View");
      this.setShouldLogForUndoRedo(false, "updateRequirementViewOf");
      const reqName = opd.requirementViewOf;
      const everyLogicalNeeded = [];
      const satisfying = this.getElementsThatSatisfyRequirement(reqName);
      everyLogicalNeeded.push(...satisfying.things, ...satisfying.links);
      for (const thing of satisfying.things) {
        if (!opd.getVisualElementByLogical(thing)) {
          thing.visualElements[0].copyToOpd(opd);
        }
      }
      for (const link of satisfying.links) {
        if (opd.getVisualElementByLogical(link)) {
          everyLogicalNeeded.push(link.sourceLogicalElement, link.targetLogicalElements[0]);
          continue;
        }
        let source = opd.getVisualElementByLogical(link.sourceLogicalElement);
        if (!source) {
          source = link.sourceLogicalElement.visualElements[0].copyToOpd(opd);
        }
        let target = opd.getVisualElementByLogical(link.targetLogicalElements[0]);
        if (!target) {
          target = link.targetLogicalElements[0].visualElements[0].copyToOpd(opd);
        }
        this.links.connect(source, target, {
          type: link.linkType,
          connection: linkConnectionType.systemic
        });
        everyLogicalNeeded.push(source.logicalElement, target.logicalElement);
      }
      for (let i = opd.visualElements.length - 1; i >= 0; i--) {
        const vis = opd.visualElements[i];
        if (!everyLogicalNeeded.includes(vis.logicalElement) && !OPCloudUtils.isInstanceOfVisualState(vis)) {
          vis.remove();
        }
      }
      if (opd.visualElements.length === 0) {
        this.removeOpd(opd.id);
        this.setShouldLogForUndoRedo(true, "updateRequirementViewOf");
        return {
          updated: false,
          removed: true
        };
      }
      this.setShouldLogForUndoRedo(true, "updateRequirementViewOf");
      return {
        updated: true,
        removed: false
      };
    }
    toggleAllOpdRequirements(opd) {
      this.logForUndo("Toggle All Requirements in OPD");
      this.setShouldLogForUndoRedo(false, "toggleAllOpdRequirements");
      const logicalsInOpd = this.getAllLogicalThings().filter(log => log.hasRequirements() && log.visualElements.find(v => this.getOpdByThingId(v.id) === opd));
      let desiredState = "open";
      const allReqs = [];
      for (const log of logicalsInOpd) {
        allReqs.push(...log.getAllRequirements());
      }
      if (allReqs.find(r => !r.getRequirementObject())) {
        desiredState = "open";
      } else if (allReqs.filter(r => r.getRequirementObject()).length === allReqs.length) {
        desiredState = "close";
      }
      if (logicalsInOpd.length === 0) {
        desiredState = this.currentOpd.visualElements.find(v => v.isLink() && v.showRequirementsLabel) ? "close" : "open";
      }
      for (const log of logicalsInOpd) {
        const reqs = log.getAllRequirements();
        for (const req of reqs) {
          if (req.getRequirementObject() && desiredState === "close") {
            this.toggleAttributesSet(log.visualElements.find(v => this.getOpdByThingId(v.id) === opd), true);
            continue;
          } else if (!req.getRequirementObject() && desiredState === "open") {
            this.toggleAttributesSet(log.visualElements.find(v => this.getOpdByThingId(v.id) === opd));
            continue;
          } else if (!req.getRequirementObject() && desiredState === "close") {
            this.toggleAttributesSet(log.visualElements.find(v => this.getOpdByThingId(v.id) === opd), true);
            this.toggleAttributesSet(log.visualElements.find(v => this.getOpdByThingId(v.id) === opd), true);
            continue;
          }
        }
      }
      this.currentOpd.visualElements.filter(v => v.isLink()).forEach(link => {
        link.showRequirementsLabel = desiredState === "open";
        if (desiredState === "close") {
          link.removeRequirementsLabel();
        }
      });
      this.setShouldLogForUndoRedo(true, "toggleAllOpdRequirements");
    }
    removeAllRequirements(logicalSetObject) {
      const owner = this.getOwnerOfRequirementSetObjectByLID(logicalSetObject.lid);
      if (!owner) {
        if (logicalSetObject.getLinks().outGoing.length === 0) {
          this.removeElementInModel(logicalSetObject.visualElements[0], true);
        }
        return;
      }
      const reqs = owner.getAllRequirements();
      for (let i = reqs.length - 1; i >= 0; i--) {
        const logicalReqObject = this.getLogicalElementByLid(reqs[i].getRequirementObjectLID());
        const firstVis = logicalReqObject?.visualElements[0];
        if (!firstVis.getRefineeUnfold() && !firstVis.getRefineeInzoom()) {
          owner.getSatisfiedRequirementSetModule().removeSingleRequirement(reqs[i].getRequirementObjectLID());
        }
        // const logicalReqObject = this.getLogicalElementByLid(reqs[i].getRequirementObjectLID());
        // if (logicalReqObject)
        //   this.removeElementInModel(logicalReqObject.visualElements[0]);
      }
    }
    disconnectSubModel(subModelId) {
      for (let j = this.logicalElements.length - 1; j >= 0; j--) {
        const logical = this.logicalElements[j];
        if (OPCloudUtils.isInstanceOfLogicalEntity(logical) && logical.protectedFromBeingRefinedBySubModel === subModelId) {
          logical.protectedFromBeingRefinedBySubModel = undefined;
        }
        if (logical.visualElements.find(v => v.protectedFromBeingChangedBySubModel === subModelId)) {
          logical.visualElements.forEach(vis => vis.protectedFromBeingChangedBySubModel = undefined);
        }
        for (let i = logical.visualElements.length - 1; i >= 0; i--) {
          if (logical.visualElements[i].belongsToSubModel === subModelId) {
            this.remove(logical.visualElements[i].id);
          }
        }
      }
      const opds = this.opds.filter(o => o.belongsToSubModel === subModelId);
      for (let i = opds.length - 1; i >= 0; i--) {
        if (opds[i].sharedOpdWithSubModelId) {
          this.disconnectSubModel(opds[i].sharedOpdWithSubModelId); // recursive call to delete sub sub models.
        }
        this.removeOpd(opds[i].id);
      }
      const opdToRemove = this.opds.find(opd => opd.sharedOpdWithSubModelId === subModelId);
      if (opdToRemove) {
        this.removeOpd(opdToRemove.id);
      }
      for (let i = this.stereotypes.getStereoTypes().length - 1; i >= 0; i--) {
        const str = this.stereotypes.getStereoTypes()[i];
        if (str.belongsToSubModel === subModelId && !this.getAllLogicalThings().find(l => l.getStereotype() === str)) {
          this.stereotypes.removeStereotype(str); // remove stereotype that came from sub models
        }
      }
      this.undoRedo.resetStacks();
    }
    changeImagesBackgroundStateInCurrentOpd(targetValue) {
      for (const vis of this.currentOpd.visualElements.filter(v => OPCloudUtils.isInstanceOfVisualThing(v))) {
        const visual = vis;
        const logical = vis.logicalElement;
        if (logical.getBackgroundImageUrl()?.length > 0) {
          visual.showBackgroundImage = targetValue;
        }
      }
    }
    bringMissingUnidirectionalLinks(visSource, tag, label) {
      const createdLinks = [];
      const createdEntities = [];
      const allLinks = visSource.getAllLinks().outGoing.filter(l => l.type === linkType.Unidirectional && l.tag === tag);
      const targets = Array.from(new Set(allLinks.map(l => l.target.logicalElement)));
      for (const target of targets) {
        let visAtOpd = this.currentOpd.getVisualElementByLogical(target);
        if (!visAtOpd) {
          if (OPCloudUtils.isInstanceOfLogicalState(target)) {
            const logicalState = target;
            const newVisFather = this.bringVisualToOpd(logicalState.getFather(), this.currentOpd);
            newVisFather.expressAll();
            visAtOpd = this.currentOpd.getVisualElementByLogical(target);
            createdEntities.push(newVisFather);
          } else {
            visAtOpd = this.bringVisualToOpd(target, this.currentOpd);
            createdEntities.push(visAtOpd);
          }
        }
        const existingLink = visSource.getLinksWith(visAtOpd).outGoing.find(l => l.type === linkType.Unidirectional && l.tag === tag);
        if (!existingLink) {
          const params = {
            type: linkType.Unidirectional,
            connection: linkConnectionType.systemic
          };
          const createdLink = this.links.connect(visSource, visAtOpd, params);
          createdLinks.push(createdLink);
          if (!createdLink.labels || createdLink.labels.length === 0) {
            createdLink.labels = [JSON.parse(JSON.stringify(label))];
          }
        }
      }
      return {
        entities: createdEntities,
        links: createdLinks
      };
    }
    disconnectSubModelFromFatherModel() {
      this.fatherModelName = undefined;
      for (const logical of this.logicalElements) {
        logical.belongsToFatherModelId = undefined;
        for (const visual of logical.visualElements) {
          visual.belongsToFatherModelId = undefined;
        }
      }
      this.undoRedo.resetStacks();
    }
    createModelFromWizardParams(params) {
      new ModelFromWizardParamsCreator(this, params).create();
    }
    allStatesInstrumentConnection(visualSource, visualTarget, currentStatesConnectedLinks, params) {
      const removed = currentStatesConnectedLinks.map(l => l.remove()[0]);
      const ret = this.connect(visualSource.fatherObject, visualTarget, params);
      if (ret.removed) {
        ret.removed.push(...removed);
      } else {
        ret.removed = [...removed];
      }
      return {
        result: ret,
        affected: [visualSource, visualTarget]
      };
    }
    allStatesInstrumentConnectionFromFather(visualSource, visualTarget, currentStatesConnectedLinks, params) {
      const removed = currentStatesConnectedLinks.map(l => l.remove()[0]);
      const ret = this.connect(visualSource, visualTarget, params);
      if (ret.removed) {
        ret.removed.push(...removed);
      } else {
        ret.removed = [...removed];
      }
      return {
        result: ret,
        affected: [visualSource, visualTarget]
      };
    }
    checkNameExistence(logical, name) {
      const options = this.logicalElements.filter(log => log !== logical && log.constructor.name === logical.constructor.name && log.getBareName().toLowerCase() === name.toLowerCase());
      for (const log of options) {
        if (!log.visualElements[0].getAllLinks().inGoing.some(l => l.type === linkType.Exhibition)) {
          return {
            value: true,
            exist: log
          };
        }
      }
      return {
        value: false
      };
    }
    moveVisualsBetweenLogicals(sourceLogical, targetLogical) {
      targetLogical.visualElements.push(...sourceLogical.visualElements);
      for (let i = sourceLogical.visualElements.length - 1; i >= 0; i--) {
        sourceLogical.visualElements[i].logicalElement = targetLogical;
        sourceLogical.visualElements.splice(i, 1);
      }
      this.removeLogicalElement(sourceLogical);
    }
    bringLinksBetweenSelected(visuals) {
      this.logForUndo("Bring Links Between Selected Entities");
      this.setShouldLogForUndoRedo(false, "bringLinksBetweenSelected");
      const toBring = [];
      for (const vis1 of visuals) {
        for (const vis2 of visuals) {
          if (vis1 === vis2) {
            continue;
          }
          const links = vis1.getAllLinksWith(vis2);
          for (const link of [...links.inGoing, ...links.outGoing]) {
            if (!link.logicalElement.visualElements.some(visLink => this.currentOpd.visualElements.includes(visLink))) {
              if (!toBring.includes(link.logicalElement)) {
                toBring.push(link.logicalElement);
              }
            }
          }
        }
      }
      for (const link of toBring) {
        const logicalLink = link;
        const sourceAtOpd = logicalLink.sourceLogicalElement.visualElements.find(v => visuals.includes(v));
        const targetAtOpd = logicalLink.targetLogicalElements[0].visualElements.find(v => visuals.includes(v));
        const params = {
          type: logicalLink.linkType,
          connection: linkConnectionType.systemic,
          isCondition: link.condition,
          isEvent: link.event,
          isNegation: link.negation,
          path: link.path,
          linkRequirements: link.linkRequirements
        };
        const bidirectionals = sourceAtOpd.getLinksWith(targetAtOpd).outGoing.filter(l => l.type === linkType.Bidirectional);
        if (logicalLink.linkType === linkType.Unidirectional && bidirectionals.length > 0) {
          continue;
        }
        const unidirectionals = sourceAtOpd.getLinksWith(targetAtOpd).outGoing.filter(l => l.type === linkType.Unidirectional);
        if (logicalLink.linkType === linkType.Bidirectional && unidirectionals.length > 0) {
          for (let i = unidirectionals.length - 1; i >= 0; i--) {
            unidirectionals[i].remove();
          }
        }
        this.connect(sourceAtOpd, targetAtOpd, params, false);
      }
      this.setShouldLogForUndoRedo(true, "bringLinksBetweenSelected");
    }
  }
  return OpmModel;
})();
function consistStates(array) {
  // Daniel: to keep consistency with objects and states
  for (let i = 0; i < array.length; i++) {
    const object = array[i];
    if (object instanceof OpmLogicalObject) {
      // object.visuals = object.visualElements;
      for (let j = 0; j < object.visualElements.length; j++) {
        // object.visualElements[j].states.length = 0;
        object.visualElements[j].children.forEach(child => {
          if (child instanceof OpmVisualState) {
            // child.parent = child.fatherObject;
            // object.visualElements[j].states.push(child);
            //  child.logical.visuals.push(child);
            // child.logical.parent = object;
            if (object.states.find(s => s === child.logicalElement) === undefined) {
              object.states.push(child.logicalElement);
            }
          }
        });
        if (object.visualElements[j].fatherObject) {
          if (!object.visualElements[j].fatherObject.children) {
            object.visualElements[j].fatherObject = object.opmModel.getVisualElementById(object.visualElements[j].fatherObject);
          }
          object.visualElements[j].fatherObject.children.push(object.visualElements[j]);
        }
      }
    }
  }
}
var RemoveType = /*#__PURE__*/function (RemoveType) {
  RemoveType[RemoveType.Localy = 1] = "Localy";
  RemoveType[RemoveType.InThisOPDOnly = 2] = "InThisOPDOnly";
  RemoveType[RemoveType.AllOPDs = 3] = "AllOPDs";
  return RemoveType;
}(RemoveType || {});