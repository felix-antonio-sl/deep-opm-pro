// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/LogicalPart/OpmLogicalThing.ts
// Extracted by opm-extracted/tools/extract.mjs

  class OpmLogicalThing extends OpmLogicalEntity {
    getName() {
      return this.textModule.getName();
    }
    constructor(params, model) {
      super(params, model);
      this.refineable_ = false;
      this.refineeInzooming_ = false;
      this.refineeUnfolding_ = false;
      this.backgroundImageUrl = "";
      this.shouldBeGreyed = false;
      this.isMainThing = false;
      if (params && params.shouldBeGreyed) {
        this.shouldBeGreyed = params.shouldBeGreyed;
      }
      this.text = this.getNumberedName();
      this.stereotypeTextModule = new StereotypeModule(this);
      this.configurationsModule = new ConfigurationsTextModule(this);
      this.belongsToStereotypeTxtModule = new BelongsToStereotypTextModule(this);
      this.textModule.addTextualModules(this.stereotypeTextModule);
      this.textModule.addTextualModules(this.belongsToStereotypeTxtModule);
      this.textModule.addTextualModules(this.configurationsModule);
      if (params && params.sterotypeId) {
        this.stereotype = this.opmModel.stereotypes.getStereotypeById(params.sterotypeId);
      }
      if (params?.equivalentFromStereotypeLID) {
        this.equivalentFromStereotypeLID = params.equivalentFromStereotypeLID;
      }
      this.simulationModule = new SimulationModule(this, params ? params.simulationParams : undefined);
      this.hiddenAttributesModule = new HiddenAttributesModule(params?.satisfiedRequirementsSetParams, this.opmModel);
      this.backgroundImageUrl = params?.backgroundImageUrl || "";
    }
    getSimulationParams() {
      return this.simulationModule.simulationParams;
    }
    isSimulated() {
      return this.simulationModule.simulationParams.simulated;
    }
    resetSimulationParams() {
      this.simulationModule.resetParams();
    }
    getRandomValues(numberOfValues) {
      return this.simulationModule.getRandomValues(numberOfValues);
    }
    setBelongsToStereotyped(element) {
      this.belongsToStereotyped = element;
    }
    getBelongsToStereotyped() {
      return this.belongsToStereotyped;
    }
    setShouldBeGreyed(value) {
      this.shouldBeGreyed = value;
    }
    get essence() {
      return this._essence;
    }
    set essence(essence) {
      this._essence = essence;
    }
    get affiliation() {
      return this._affiliation;
    }
    set affiliation(affiliation) {
      this._affiliation = affiliation;
    }
    get refineable() {
      return this.refineable_;
    }
    get refineeInzooming() {
      return this.refineeInzooming_;
    }
    get refineeUnfolding() {
      return this.refineeUnfolding_;
    }
    cancelRefineable() {
      this.refineable_ = false;
    }
    setRefineable() {
      this.refineable_ = !this.refineable_;
    }
    setRefineeInzooming() {
      this.refineeInzooming_ = !this.refineeInzooming_;
    }
    setRefineeUnfolding() {
      this.refineeUnfolding_ = !this.refineeUnfolding_;
    }
    setStereotype(st) {
      this.stereotype = st;
    }
    getStereotype() {
      return this.stereotype;
    }
    updateParams(params) {
      super.updateParams(params);
      this.essence = params.essence;
      this.affiliation = params.affiliation;
      if (params && params.shouldBeGreyed) {
        this.shouldBeGreyed = params.shouldBeGreyed;
      }
      if (params && params.isMainThing) {
        this.isMainThing = params.isMainThing;
      }
      if (params && params.simulationParams) {
        this.simulationModule.simulationParams = params.simulationParams;
      }
      if (params?.equivalentFromStereotypeLID) {
        this.equivalentFromStereotypeLID = params.equivalentFromStereotypeLID;
      }
    }
    setParams(params) {
      super.setParams(params);
      if (params.sterotypeId) {
        this.stereotype = this.opmModel.stereotypes.getStereotypeById(params.sterotypeId);
      }
      if (params && params.simulationParams) {
        this.simulationModule.simulationParams = params.simulationParams;
      }
      if (params?.equivalentFromStereotypeLID) {
        this.equivalentFromStereotypeLID = params.equivalentFromStereotypeLID;
      }
    }
    getThingParams() {
      const sterotypeId = this.stereotype && this.stereotype.id ? this.stereotype.id : undefined;
      const params = {
        essence: this.essence,
        affiliation: this.affiliation,
        shouldBeGreyed: this.shouldBeGreyed,
        isMainThing: this.isMainThing,
        simulationParams: this.getSimulationParams(),
        equivalentFromStereotypeLID: this.equivalentFromStereotypeLID,
        satisfiedRequirementsSetParams: this.hiddenAttributesModule.satisfiedRequirementSetModule.toJson(),
        backgroundImageUrl: this.backgroundImageUrl
      };
      if (sterotypeId) {
        params.sterotypeId = sterotypeId;
      }
      if (this.getBelongsToStereotyped() && this.getBelongsToStereotyped().visualElements.length > 0) {
        params.belongsToStereotyped = this.getBelongsToStereotyped().visualElements[0].id;
      }
      return {
        ...super.getEntityParams(),
        ...params
      };
    }
    getThingParamsFromJsonElement(jsonElement) {
      const params = {
        essence: jsonElement.essence === 0 ? Essence.Physical : Essence.Informatical,
        affiliation: jsonElement.affiliation === 0 ? Affiliation.Systemic : Affiliation.Environmental,
        shouldBeGreyed: jsonElement.shouldBeGreyed
      };
      return {
        ...super.getEntityParamsFromJsonElement(jsonElement),
        ...params
      };
    }
    getDisplayText() {
      return this.textModule.getDisplayText();
    }
    removeVisual(visual) {
      const visAtHiddenOpd = this.visualElements.find(vis => this.opmModel.getOpdByThingId(vis.id) && this.opmModel.getOpdByThingId(vis.id).isHidden === true);
      super.removeVisual(visual);
      if (this.visualElements.length === 1 && this.getStereotype() && visAtHiddenOpd) {
        const ret = this.opmModel.removeClonedStereotypeAndItsParts(this);
        return {
          removed: ret.removed
        };
      }
    }
    resetVisualsStrokeWidth() {
      for (const vis of this.visualElements) {
        vis.strokeWidth = 2;
      }
    }
    getBackgroundImageUrl() {
      return this.backgroundImageUrl;
    }
    setBackgroundImage(url) {
      this.backgroundImageUrl = url;
    }
    getSatisfiedRequirementSetModule() {
      return this.hiddenAttributesModule.satisfiedRequirementSetModule;
    }
    createSatisfiedRequirementSet(visual) {
      return this.hiddenAttributesModule.createSatisfiedRequirementSet(visual);
    }
    hasRequirements() {
      return !!this.hiddenAttributesModule.satisfiedRequirementSetModule.getRequirementsSet();
    }
    getAllRequirements() {
      return this.hiddenAttributesModule.satisfiedRequirementSetModule.getRequirementsSet()?.getAllRequirements() || [];
    }
    removeSingleRequirement(lidToRemove) {
      const logicalReqObject = this.opmModel.getLogicalElementByLid(lidToRemove);
      const firstVis = logicalReqObject?.visualElements[0];
      if (firstVis.getRefineeUnfold() || firstVis.getRefineeInzoom() || logicalReqObject.getBelongsToStereotyped()) {
        return [];
      }
      const ret = this.hiddenAttributesModule.satisfiedRequirementSetModule.removeSingleRequirement(lidToRemove);
      if (!this.hasRequirements() && this.visualElements.find(v => this.opmModel.getOpdByThingId(v.id)?.requirementsOpd)) {
        this.visualElements.find(v => this.opmModel.getOpdByThingId(v.id)?.requirementsOpd).remove();
      } // removing the visual from the requirements hidden opd because there is no need for it anymore.
      return ret;
    }
  }

  /***/
}),
/***/53449: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    W: () => (/* binding */OpmProceduralRelation)

  });

  class Rate {}
  class OpmProceduralRelation extends OpmRelation /* .OpmRelation */.v {
    constructor(params, model) {
      super(params, model);
      this.duration = new components_TimeDurationModule /* .TimeDurationModule */.E();
      this.duration.setTimeDuration({
        min: null,
        nominal: 1,
        max: null,
        units: components_time_duration_units /* .DEFAULT_TIME_DURATION_UNIT */.SV,
        durationDistributionKind: "none",
        durationDistributionParams: {}
      });
    }
    createVisual(params) {
      return new VisualPart_OpmProceduralLink /* .OpmProceduralLink */.E(params, this);
    }
    setParams(params) {
      super.setParams(params);
      this.center = params.center;
      this.condition = params.condition;
      this.event = params.event;
      this.negation = params.negation;
      this.pathText = params.path;
      if (params.timeDurationStatus || params.min != null || params.nominal != null || params.max != null || params.durationDistributionKind && params.durationDistributionKind !== "none") {
        const durationParams = {
          min: params.min ?? null,
          nominal: params.nominal ?? null,
          max: params.max ?? null,
          units: params.units != null && params.units !== "" ? params.units : components_time_duration_units /* .DEFAULT_TIME_DURATION_UNIT */.SV,
          durationDistributionKind: params.durationDistributionKind || "none",
          durationDistributionParams: params.durationDistributionParams || {}
        };
        this.duration.setTimeDuration(durationParams);
      }
    }
    updateParams(params) {
      super.updateParams(params);
      this.center = params.center;
      this.condition = params.condition;
      this.event = params.event;
      this.negation = params.negation;
      this.pathText = params.path;
      if (params.timeDurationStatus || params.min != null || params.nominal != null || params.max != null || params.durationDistributionKind && params.durationDistributionKind !== "none") {
        const durationParams = {
          min: params.min ?? null,
          nominal: params.nominal ?? null,
          max: params.max ?? null,
          units: params.units != null && params.units !== "" ? params.units : components_time_duration_units /* .DEFAULT_TIME_DURATION_UNIT */.SV,
          durationDistributionKind: params.durationDistributionKind || "none",
          durationDistributionParams: params.durationDistributionParams || {}
        };
        this.duration.setTimeDuration(durationParams);
      }
    }
    getParams() {
      const visualElementsParams = new Array();
      for (let i = 0; i < this.visualElements.length; i++) {
        visualElementsParams.push(this.visualElements[i].getParams());
      }
      const params = {
        condition: this.condition,
        event: this.event,
        negation: this.negation,
        path: this.pathText,
        visualElementsParams: visualElementsParams,
        min: this.duration.getTimeDuration().min,
        nominal: this.duration.getTimeDuration().nominal,
        max: this.duration.getTimeDuration().max,
        units: this.duration.getTimeDuration().units,
        timeDurationStatus: this.duration.getTimeDuration().timeDurationStatus,
        durationDistributionKind: this.duration.getTimeDuration().durationDistributionKind,
        durationDistributionParams: this.duration.getTimeDuration().durationDistributionParams
      };
      return {
        ...super.getRelationParams(),
        ...params
      };
    }
    getParamsFromJsonElement(jsonElement) {
      const params = {
        condition: jsonElement.condition,
        event: jsonElement.event,
        negation: jsonElement.negation
      };
      return {
        ...super.getRelationParamsFromJsonElement(jsonElement),
        ...params
      };
    }
    getDurationManager() {
      return this.duration;
    }
  }

  /***/
}),
/***/15718: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    v: () => (/* binding */OpmRelation)

  });

  class OpmRelation extends OpmLogicalElement /* .OpmLogicalElement */.s {
    get sourceLogicalElement() {
      return this._sourceLogicalElement;
    }
    set sourceLogicalElement(value) {
      this._sourceLogicalElement = value;
    }
    get targetLogicalElements() {
      return this._targetLogicalElements;
    }
    set targetLogicalElements(value) {
      this._targetLogicalElements = value;
    }
    get linkConnectionType() {
      return this._linkConnectionType;
    }
    set linkConnectionType(value) {
      this._linkConnectionType = value;
    }
    get sourceCardinality() {
      return this._sourceCardinality;
    }
    set sourceCardinality(value) {
      this._sourceCardinality = value;
    }
    get targetCardinality() {
      return this._targetCardinality;
    }
    set targetCardinality(value) {
      this._targetCardinality = value;
    }
    get sourceLogicalConnection() {
      return this._sourceLogicalConnection;
    }
    set sourceLogicalConnection(value) {
      this._sourceLogicalConnection = value;
    }
    get targetLogicalConnection() {
      return this._targetLogicalConnection;
    }
    set targetLogicalConnection(value) {
      this._targetLogicalConnection = value;
    }
    get linkType() {
      return this._linkType;
    }
    set linkType(value) {
      this._linkType = value;
    }
    get linkRequirements() {
      return this._linkRequirements;
    }
    set linkRequirements(value) {
      this._linkRequirements = value;
    }
    constructor(params, model) {
      super(params, model);
      this.sourceLogicalConnection = params ? params.sourceLogicalConnection : null;
      this.targetLogicalConnection = params ? params.targetLogicalConnection : null;
      this.linkType = params ? params.linkType : null;
      this.linkRequirements = params?.linkRequirements || "";
    }
    isLink() {
      return true;
    }
    setParams(params) {
      super.setParams(params);
      this.linkConnectionType = params.linkConnectionType;
      this.linkType = params.linkType;
      if (params.hasOwnProperty("linkRequirements")) {
        this.linkRequirements = params.linkRequirements;
      }
    }
    updateParams(params) {
      super.updateParams(params);
      this.targetLogicalElements = new Array();
      const sourceLogicalElement = this.opmModel.getLogicalElementByVisualId(params.sourceElementId);
      this.sourceLogicalElement = sourceLogicalElement ? sourceLogicalElement : params.sourceElementId;
      let targetLogicalElement = this.opmModel.getLogicalElementByVisualId(params.targetElementId);
      targetLogicalElement = targetLogicalElement ? targetLogicalElement : params.targetElementId;
      this.targetLogicalElements.push(this.opmModel.getLogicalElementByVisualId(params.targetElementId));
      this.linkConnectionType = params.linkConnectionType;
      this.linkType = params.linkType;
      if (params.hasOwnProperty("linkRequirements")) {
        this.linkRequirements = params.linkRequirements;
      }
    }
    getRelationParams() {
      const params = {
        linkConnectionType: this.linkConnectionType,
        linkType: this.linkType,
        sourceLogicalConnection: this.sourceLogicalConnection,
        targetLogicalConnection: this.targetLogicalConnection,
        linkRequirements: this.linkRequirements
      };
      return {
        ...super.getElementParams(),
        ...params
      };
    }
    getRelationParamsFromJsonElement(jsonElement) {
      return {
        ...super.getElementParamsFromJsonElement(jsonElement),
        linkConnectionType: jsonElement.linkConnectionType,
        linkType: jsonElement.linkType,
        sourceLogicalConnection: jsonElement.sourceLogicalConnection,
        targetLogicalConnection: jsonElement.targetLogicalConnection,
        linkRequirements: jsonElement.linkRequirements
      };
    }
    updateSourceAndTargetFromJson() {
      if (typeof this.sourceLogicalElement === "string") {
        this.sourceLogicalElement = this.opmModel.getLogicalElementByVisualId(this.sourceLogicalElement);
      }
      for (let i = 0; i < this.targetLogicalElements.length; i++) {
        if (typeof this.targetLogicalElements[i] === "string") {
          this.targetLogicalElements[i] = this.opmModel.getLogicalElementByVisualId(this.targetLogicalElements[i]);
        }
      }
      for (let i = 0; i < this.visualElements.length; i++) {
        this.visualElements[i].updateSourceAndTargetFromJson();
      }
    }
    // in each opd that has a visual link of this and a visual link of relation, update the port
    // of this to be the same as relation in side
    updatePortAndDataToAllVisuals(relation, side) {
      for (let i = 0; i < this.visualElements.length; i++) {
        const opd = this.opmModel.getOpdByThingId(this.visualElements[i].id);
        const link = opd.getVisualElementByLogical(relation);
        if (link) {
          const elementOnLinkSide = side === "source" ? link.sourceVisualElement : link.targetVisualElements[0].targetVisualElement;
          const elementOnCurrentSide = side === "source" ? this.visualElements[i].sourceVisualElement : this.visualElements[i].targetVisualElements[0].targetVisualElement;
          if (elementOnLinkSide === elementOnCurrentSide) {
            let portOnLinkSide = side === "source" ? link.sourceVisualElementPort : link.targetVisualElementPort;
            portOnLinkSide = portOnLinkSide ? portOnLinkSide : 1;
            if (side === "source") {
              this.visualElements[i].sourceVisualElementPort = portOnLinkSide;
              link.sourceVisualElementPort = portOnLinkSide;
              // if link wasn't logically connected to other links yet at the sourec
              if (relation.sourceLogicalConnection === null || relation.sourceLogicalConnection === undefined) {
                // no existing connection. the default is XOR
                relation.sourceLogicalConnection = ConfigurationOptions /* .LinkLogicalConnection */.qK.Xor;
              }
              if (!link.sourceConnectedLinks) {
                // initialize new array
                link.sourceConnectedLinks = new Array();
                link.sourceConnectedLinks.push(link);
              }
              // set source logical connection to be the same as relation
              this.sourceLogicalConnection = relation.sourceLogicalConnection;
              // insert current link to sourceConnectedLinks Array
              link.sourceConnectedLinks.push(this.visualElements[i]);
              // store sourceConnectedLinks array to the current visual link
              this.visualElements[i].sourceConnectedLinks = link.sourceConnectedLinks;
            } else {
              // same as source
              this.visualElements[i].targetVisualElementPort = portOnLinkSide;
              link.targetVisualElementPort = portOnLinkSide;
              // if link wasn't logically connected to other links yet ate the target
              if (relation.targetLogicalConnection === null || relation.targetLogicalConnection === undefined) {
                // no existing connection. the default is XOR
                relation.targetLogicalConnection = ConfigurationOptions /* .LinkLogicalConnection */.qK.Xor;
              }
              if (!link.targetConnectedLinks) {
                // initialize new array
                link.targetConnectedLinks = new Array();
                link.targetConnectedLinks.push(link);
              }
              // set source logical connection to be the same as relation
              this.targetLogicalConnection = relation.targetLogicalConnection;
              // insert current link to targetConnectedLinks Array
              link.targetConnectedLinks.push(this.visualElements[i]);
              // store targetConnectedLinks array to the current visual link
              this.visualElements[i].targetConnectedLinks = link.targetConnectedLinks;
            }
          }
        }
      }
    }
    disconnectSourceLogicalConnectionAllVisuals() {
      this.sourceLogicalConnection = null;
      for (let i = 0; i < this.visualElements.length; i++) {
        this.visualElements[i].sourceVisualElementPort = null;
        // remove current visual element from arrays of its previously connected links
        if (this.visualElements[i].sourceConnectedLinks) {
          this.visualElements[i].sourceConnectedLinks = this.visualElements[i].sourceConnectedLinks.map(link => {
            if (link.constructor.name.includes("String")) {
              return this.opmModel.getVisualElementById(link);
            } else {
              return link;
            }
          }).filter(link => link);
          const updatedArray = this.visualElements[i].sourceConnectedLinks.filter(link => link !== this.visualElements[i] && link !== undefined && !link.constructor.name.includes("String"));
          for (let j = 0; j < updatedArray.length; j++) {
            updatedArray[j].sourceConnectedLinks = updatedArray;
            if (updatedArray.length < 2) {
              // if it was a relation of two links and now one is disconnected
              updatedArray[j].sourceConnectedLinks = null;
              updatedArray[j].logicalElement.sourceLogicalConnection = null;
            }
          }
          this.visualElements[i].sourceConnectedLinks = null;
        }
      }
    }
    disconnectTargetLogicalConnectionAllVisuals() {
      this.targetLogicalConnection = null;
      for (let i = 0; i < this.visualElements.length; i++) {
        this.visualElements[i].targetVisualElementPort = null;
        // remove current visual element from arrays of its previously connected links
        if (this.visualElements[i].targetConnectedLinks) {
          this.visualElements[i].targetConnectedLinks = this.visualElements[i].targetConnectedLinks.map(link => {
            if (link.constructor.name.includes("String")) {
              return this.opmModel.getVisualElementById(link);
            } else {
              return link;
            }
          }).filter(link => link);
          const updatedArray = this.visualElements[i].targetConnectedLinks.filter(link => link !== this.visualElements[i]);
          for (let j = 0; j < updatedArray.length; j++) {
            updatedArray[j].targetConnectedLinks = updatedArray;
            if (updatedArray.length < 2) {
              // if it was a relation of two links and now one is disconnected
              updatedArray[j].targetConnectedLinks = null;
              updatedArray[j].logicalElement.targetLogicalConnection = null;
            }
          }
          this.visualElements[i].targetConnectedLinks = null;
        }
      }
    }
  }

  /***/
}),
/***/71321: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    A: () => (/* binding */OpmStructuralRelation)

  });

  class OpmStructuralRelation extends OpmRelation /* .OpmRelation */.v {
    constructor(params, model) {
      super(params, model);
    }
    updateParams(params) {
      super.updateParams(params);
    }
    getStructuredParams() {
      return super.getRelationParams();
    }
    getStructuralParamsFromJsonElement(jsonElement) {
      return super.getRelationParamsFromJsonElement(jsonElement);
    }
  }

  /***/
}),
/***/34588: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    E: () => (/* binding */TimeDurationModule)

  });

  class TimeDurationModule {
    constructor() {
      this.min = null;
      this.nominal = null;
      this.max = null;
      this.units = time_duration_units /* .DEFAULT_TIME_DURATION_UNIT */.SV;
      this.durationDistributionKind = "none";
      this.durationDistributionParams = {};
      this.display = {
        digitsAfterDot: 2
      };
    }
    setDisplayParams(display) {
      this.display.digitsAfterDot = display.digitsAfterDot;
    }
    getText() {
      const hasScalar = this.min != null && this.min.toString() !== "" && this.min.toString() !== "null" || this.nominal != null && this.nominal.toString() !== "" && this.nominal.toString() !== "null" || this.max != null && this.max.toString() !== "" && this.max.toString() !== "null";
      const distStr = this.getActiveDistributionBracket();
      const hasDist = distStr.length > 0;
      if (!hasScalar && !hasDist) {
        return "";
      }
      const lines = [];
      lines.push("[" + this.units + "]");
      if (hasScalar) {
        const arr = [this.min, this.nominal, this.max];
        const vals = arr.filter(a => a != null && a.toString() !== "" && a.toString() !== "null" && !isNaN(a)).map(a => Number(Number(a).toFixed(this.display.digitsAfterDot)));
        if (vals.length > 0) {
          lines.push("(" + vals.join(",") + ")");
        }
      }
      if (hasDist) {
        lines.push("[" + distStr + "]");
      }
      return lines.join("\n");
    }
    isTextActive() {
      return this.isActive();
    }
    isTimeDuration() {
      return this.timeDurationStatus !== ConfigurationOptions /* .TimeDurationType */.Cq.Unspecified && this.timeDurationStatus !== undefined;
    }
    isActive() {
      return this.isTimeDuration();
    }
    getActiveDistributionBracket() {
      if (!this.durationDistributionKind || this.durationDistributionKind === "none") {
        return "";
      }
      return (0, time_duration_runtime_utils /* .formatDistributionBracket */.Q7)(this.durationDistributionKind, this.durationDistributionParams, this.display.digitsAfterDot);
    }
    validateDistribution(kind, p) {
      if (!kind || kind === "none") {
        return {
          ok: true
        };
      }
      if (kind === "normal") {
        if (p.mean == null || p.sd == null) {
          return {
            ok: false,
            msg: "Normal distribution requires mean and sd."
          };
        }
        if (p.sd < 0) {
          return {
            ok: false,
            msg: "Standard deviation cannot be negative."
          };
        }
        return {
          ok: true
        };
      }
      if (kind === "uniform") {
        if (p.a == null || p.b == null) {
          return {
            ok: false,
            msg: "Uniform distribution requires a and b."
          };
        }
        if (p.a > p.b) {
          return {
            ok: false,
            msg: "Uniform parameter a cannot be greater than b."
          };
        }
        return {
          ok: true
        };
      }
      if (kind === "exponential") {
        if (p.lambda == null || p.lambda <= 0) {
          return {
            ok: false,
            msg: "Exponential distribution requires lambda > 0."
          };
        }
        return {
          ok: true
        };
      }
      return {
        ok: true
      };
    }
    validateDuration(duration) {
      const errorMsgs = [];
      const hasScalar = duration.min != null || duration.nominal != null || duration.max != null;
      const kind = duration.durationDistributionKind || "none";
      const p = duration.durationDistributionParams || {};
      const distOk = this.validateDistribution(kind, p);
      const hasDist = kind !== "none" && distOk.ok && this.getDistributionComplete(kind, p);
      if (!hasScalar && !hasDist) {
        return {
          success: false,
          messages: ["At least one duration value or a probability distribution is required."]
        };
      }
      if (kind !== "none" && !distOk.ok) {
        return {
          success: false,
          messages: [distOk.msg]
        };
      }
      if (kind !== "none" && !this.getDistributionComplete(kind, p)) {
        return {
          success: false,
          messages: ["Incomplete parameters for the selected duration distribution."]
        };
      }
      if (duration.min != null && duration.min < 0) {
        errorMsgs.push("Warning! The minimal duration cannot be negative.");
      }
      if (duration.max != null && duration.max < 0) {
        errorMsgs.push("Warning! The maximal duration cannot be negative.");
      }
      if (duration.nominal != null && duration.nominal < 0) {
        errorMsgs.push("Warning! The nominal duration cannot be negative.");
      }
      if (hasScalar) {
        if (duration.min != null && duration.max != null && Number(duration.min) > Number(duration.max)) {
          errorMsgs.push("Warning! The maximal time cannot be smaller than the minimal");
        }
        if (duration.min != null && duration.nominal != null && Number(duration.min) > Number(duration.nominal)) {
          errorMsgs.push("Warning! The minimal time cannot be larger than the nominal");
        }
        if (duration.nominal != null && duration.max != null && Number(duration.nominal) > Number(duration.max)) {
          errorMsgs.push("Warning! The maximal time cannot be smaller than the nominal");
        }
      }
      return {
        success: errorMsgs.length === 0,
        messages: errorMsgs
      };
    }
    getDistributionComplete(kind, p) {
      if (kind === "none") {
        return false;
      }
      if (kind === "normal") {
        return p.mean != null && p.sd != null;
      }
      if (kind === "uniform") {
        return p.a != null && p.b != null;
      }
      if (kind === "exponential") {
        return p.lambda != null;
      }
      return false;
    }
    setTimeDuration(duration) {
      const kind = duration.durationDistributionKind || "none";
      const params = {
        ...(duration.durationDistributionParams || {})
      };
      const ret = this.validateDuration({
        ...duration,
        durationDistributionKind: kind,
        durationDistributionParams: params
      });
      if (ret.success === false) {
        return ret;
      }
      this.min = duration.min;
      this.nominal = duration.nominal;
      this.max = duration.max;
      this.units = (0, time_duration_units /* .normalizeDurationUnit */.KV)(duration.units != null && String(duration.units).trim() !== "" ? String(duration.units) : undefined);
      this.durationDistributionKind = kind;
      this.durationDistributionParams = params;
      this.timeDurationStatus = ConfigurationOptions /* .TimeDurationType */.Cq.Specified;
      return {
        success: true,
        messages: []
      };
    }
    getTimeDuration() {
      return {
        min: this.min,
        nominal: this.nominal,
        max: this.max,
        units: this.units,
        timeDurationStatus: this.timeDurationStatus,
        durationDistributionKind: this.durationDistributionKind,
        durationDistributionParams: {
          ...this.durationDistributionParams
        }
      };
    }
    editUnits(units) {
      this.units = (0, time_duration_units /* .normalizeDurationUnit */.KV)(units);
    }
    removeTimeDuration() {
      this.min = null;
      this.nominal = null;
      this.max = null;
      this.units = time_duration_units /* .DEFAULT_TIME_DURATION_UNIT */.SV;
      this.durationDistributionKind = "none";
      this.durationDistributionParams = {};
      this.timeDurationStatus = ConfigurationOptions /* .TimeDurationType */.Cq.Unspecified;
      return {
        success: true
      };
    }
    getPriority() {
      return 3;
    }
  }

  /***/
}),
/***/19759: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    Py: () => (/* binding */sampleAnimationDurationMs),
    Q7: () => (/* binding */formatDistributionBracket)

  });

  /** Convert a duration value from model units to milliseconds (for animation). */
  function convertDurationValueToMs(value, units) {
    if (value == null || Number.isNaN(value)) {
      return NaN;
    }
    try {
      return (0, configuration_rappidEnviromentFunctionality_shared /* .convert */.C6)(value).from((0, time_duration_units /* .durationUnitToConvertKey */.Ab)(units)).to("ms");
    } catch {
      return NaN;
    }
  }
  function clamp(n, lo, hi) {
    return Math.min(hi, Math.max(lo, n));
  }
  /** Sample one duration in the same numeric space as model units (not yet converted to ms). */
  function sampleDurationInModelUnits(snap) {
    const kind = snap.durationDistributionKind || "none";
    if (kind !== "none") {
      const p = snap.durationDistributionParams || {};
      if (kind === "normal" && p.mean != null && p.sd != null && p.sd >= 0) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(Math.log(u1) * -2) * Math.cos(Math.PI * 2 * u2);
        return p.mean + z * p.sd;
      }
      if (kind === "uniform" && p.a != null && p.b != null && p.b >= p.a) {
        return p.a + Math.random() * (p.b - p.a);
      }
      if (kind === "exponential" && p.lambda != null && p.lambda > 0) {
        return -Math.log(1 - Math.random()) / p.lambda;
      }
    }
    if (snap.nominal != null) {
      return snap.nominal;
    }
    if (snap.min != null && snap.max != null) {
      return (snap.min + snap.max) / 2;
    }
    if (snap.max != null) {
      return snap.max;
    }
    if (snap.min != null) {
      return snap.min;
    }
    return null;
  }
  /**
   * Animation duration in ms from a process duration snapshot.
   * Clamps to a sensible range; falls back to null if nothing usable.
   */
  function sampleAnimationDurationMs(snap) {
    const raw = sampleDurationInModelUnits(snap);
    if (raw == null || Number.isNaN(raw)) {
      return null;
    }
    const units = snap.units && String(snap.units).trim() !== "" ? snap.units : time_duration_units /* .DEFAULT_TIME_DURATION_UNIT */.SV;
    let ms = convertDurationValueToMs(raw, units);
    if (Number.isNaN(ms)) {
      return null;
    }
    ms = clamp(ms, 150, 120000);
    return ms;
  }
  function formatDistributionBracket(kind, p, digits) {
    if (!p) {
      return "";
    }
    const f = n => Number(Number(n).toFixed(digits));
    switch (kind) {
      case "normal":
        if (p.mean == null || p.sd == null) {
          return "";
        }
        return `normal, mean=${f(p.mean)}, sd=${f(p.sd)}`;
      case "uniform":
        if (p.a == null || p.b == null) {
          return "";
        }
        return `uniform, a=${f(p.a)}, b=${f(p.b)}`;
      case "exponential":
        if (p.lambda == null) {
          return "";
        }
        return `exponential, lambda=${f(p.lambda)}`;
      default:
        return "";
    }
  }

  /***/
}),
/***/45235: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    $c: () => (/* binding */TIME_DURATION_ISO_UNITS),
    Ab: () => (/* binding */durationUnitToConvertKey),
    KV: () => (/* binding */normalizeDurationUnit),
    SV: () => (/* binding */DEFAULT_TIME_DURATION_UNIT),
    vO: () => (/* binding */oplDurationSuffixWord)

  });
  /**
   * ISO-style duration unit tokens (Annex D.7 wording): stored on the model and shown in UI diagrams.
   * convert-units still uses s, h, d — see durationUnitToConvertKey().
   */
  const TIME_DURATION_ISO_UNITS = ["ms", "sec", "min", "hour", "day", "week", "month", "year"];
  const DEFAULT_TIME_DURATION_UNIT = "sec";
  const LEGACY_UNIT_TO_ISO = {
    s: "sec",
    h: "hour",
    d: "day"
  };
  /** Map model unit token to convert-units measure key. */
  function durationUnitToConvertKey(unit) {
    const u = normalizeDurationUnit(unit);
    const ISO_TO_CONVERT = {
      sec: "s",
      hour: "h",
      day: "d"
    };
    return ISO_TO_CONVERT[u] ?? u;
  }
  /** Canonical ISO token; migrate legacy s/h/d from persisted JSON; default when empty. */
  function normalizeDurationUnit(unit) {
    if (unit == null || String(unit).trim() === "") {
      return DEFAULT_TIME_DURATION_UNIT;
    }
    const u = String(unit).trim();
    if (TIME_DURATION_ISO_UNITS.includes(u)) {
      return u;
    }
    if (LEGACY_UNIT_TO_ISO[u]) {
      return LEGACY_UNIT_TO_ISO[u];
    }
    return u;
  }
  /** English OPL suffix after numeric value (space + word), including sec. */
  function oplDurationSuffixWord(unit) {
    const u = normalizeDurationUnit(unit);
    const map = {
      ms: " ms",
      sec: " sec",
      min: " min",
      hour: " hour",
      day: " day",
      week: " week",
      month: " month",
      year: " year"
    };
    return map[u] ?? " " + u;
  }

  /***/
}),
/***/59390: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    s: () => (/* binding */OpmFundamentalLink)

  });

  class OpmFundamentalLink extends OpmStructuralLink /* .OpmStructuralLink */.i {
    constructor(params, logicalElement) {
      super(params, logicalElement);
    }
    updateParams(params) {
      super.updateParams(params);
      this.symbolPos = params.symbolPos;
      this.UpperConnectionVertices = params.UpperConnectionVertices;
      this.upperLinkAnchorPos = params.upperLinkAnchorPos;
      this.targetAnchorPos = params.targetAnchorPos;
    }
    setParams(params) {
      super.setParams(params);
      this.symbolPos = params.symbolPos;
      this.UpperConnectionVertices = params.UpperConnectionVertices;
      this.upperLinkAnchorPos = params.upperLinkAnchorPos;
      this.targetAnchorPos = params.targetAnchorPos;
    }
    isFundamentalLink() {
      return true;
    }
    getParams() {
      const params = {
        symbolPos: this.symbolPos,
        UpperConnectionVertices: this.UpperConnectionVertices,
        upperLinkAnchorPos: this.upperLinkAnchorPos,
        targetAnchorPos: this.targetAnchorPos
      };
      return {
        ...super.getStructuralParams(),
        ...params
      };
    }
    getParamsFromJsonElement(jsonElement) {
      const params = {
        symbolPos: jsonElement.symbolPos,
        UpperConnectionVertices: jsonElement.UpperConnectionVertices,
        upperLinkAnchorPos: jsonElement.upperLinkAnchorPos,
        targetAnchorPos: jsonElement.targetAnchorPos
      };
      return {
        ...super.getStructuralParamsFromJsonElement(jsonElement),
        ...params
      };
    }
    clone() {
      const newLink = new OpmFundamentalLink(this.getParams(), this.logicalElement);
      newLink.setNewUUID();
      return newLink;
    }
    getSymbolPos() {
      return this.symbolPos;
    }
    setSymbolPos(x, y) {
      this.symbolPos = [x, y];
    }
    canBeRemoved() {
      if (this.belongsToFatherModelId) {
        return false;
      }
      if (this.type === ConfigurationOptions /* .linkType */.h6.Aggregation && this.source instanceof OpmVisualThing /* .OpmVisualThing */.J && this.source.getRefineeUnfold() && this.source.getRefineeUnfold() === this.source && this.source.getRefineeInzoom() && this.source.getRefineeInzoom().children.find(child => child.logicalElement === this.target.logicalElement)) {
        return false;
      }
      if (this.logicalElement.opmModel.getOpdByThingId(this.id) && this.logicalElement.opmModel.getOpdByThingId(this.id).isHidden) {
        return false;
      }
      return true;
    }
  }

  /***/
}),
/***/41341: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    g: () => (/* binding */TargetElementData),
    t: () => (/* binding */OpmLink)

  });

  class OpmLink extends OpmVisualElement /* .OpmVisualElement */.p {
    get source() {
      return this.sourceVisualElement;
    }
    get target() {
      return this.targetVisualElements[0].targetVisualElement;
    }
    constructor(params, logicalElement) {
      super(params, logicalElement);
      this.sourceVisualElementPort = params ? params.sourceVisualElementPort : null;
      this.sourceConnectedLinks = params ? params.sourceConnectedLinks : new Array();
      this.targetVisualElementPort = params ? params.targetVisualElementPort : null;
      this.targetConnectedLinks = params ? params.targetConnectedLinks : new Array();
      this.showRequirementsLabel = params?.hasOwnProperty("showRequirementsLabel") ? params.showRequirementsLabel : true;
    }
    get type() {
      return this.logicalElement.linkType;
    }
    isLink() {
      return true;
    }
    isStructuralLink() {
      return false;
    }
    isProceduralLink() {
      return false;
    }
    isFundamentalLink() {
      return false;
    }
    updateParams(params) {
      super.updateParams(params);
      this.targetVisualElements = new Array();
      const sourceVisualElement = this.logicalElement.opmModel.getVisualElementById(params.sourceElementId);
      this.sourceVisualElement = sourceVisualElement ? sourceVisualElement : params.sourceElementId;
      this.sourceVisualElementPort = params.sourceVisualElementPort;
      let targetVisualElement = this.logicalElement.opmModel.getVisualElementById(params.targetElementId);
      targetVisualElement = targetVisualElement ? targetVisualElement : params.targetElementId;
      if (params.targetVisualElements && params.targetVisualElements[0]?.vertices) {
        this.BreakPoints = params.targetVisualElements[0].vertices;
      }
      if (params.vertices) {
        this.BreakPoints = params.vertices;
      }
      this.targetVisualElements.push(new TargetElementData(targetVisualElement, this.BreakPoints));
      this.targetVisualElementPort = params.targetVisualElementPort;
      this.tag = params.tag;
      this.labels = params.labels?.filter(label => !!label);
      this.visible = params.visible;
      this.showRequirementsLabel = params.showRequirementsLabel;
    }
    setParams(params) {
      super.setParams(params);
      this.targetVisualElements[0].vertices = params.vertices;
      this.BreakPoints = params.vertices;
      this.tag = params.tag;
      this.labels = params.labels;
      this.visible = params.visible;
      this.showRequirementsLabel = params.hasOwnProperty("showRequirementsLabel") ? params.showRequirementsLabel : true;
    }
    getLinkParams() {
      const targetVisualElements = new Array();
      for (let i = 0; i < this.targetVisualElements.length; i++) {
        if (this.targetVisualElements[i].targetVisualElement) {
          const targetElementData = new TargetElementData(this.targetVisualElements[i].targetVisualElement.id, this.targetVisualElements[i].vertices);
          targetVisualElements.push(targetElementData);
        }
      }
      const params = {
        sourceVisualElement: this.sourceVisualElement ? this.sourceVisualElement.id : null,
        sourceVisualElementPort: this.sourceVisualElementPort,
        sourceConnectedLinks: this.logicalElement.opmModel.arrayFromElementsToIds(this.sourceConnectedLinks),
        targetVisualElements: targetVisualElements,
        targetVisualElementPort: this.targetVisualElementPort,
        targetConnectedLinks: this.logicalElement.opmModel.arrayFromElementsToIds(this.targetConnectedLinks),
        tag: this.tag,
        labels: this.labels,
        strokeWidth: this.strokeWidth,
        strokeColor: this.strokeColor,
        visible: this.visible,
        showRequirementsLabel: this.showRequirementsLabel
      };
      return {
        ...super.getElementParams(),
        ...params
      };
    }
    getLinkParamsFromJsonElement(jsonElement) {
      const params = {
        sourceElementId: jsonElement.sourceVisualElement,
        sourceVisualElementPort: jsonElement.sourceVisualElementPort,
        sourceConnectedLinks: jsonElement.sourceConnectedLinks,
        targetElementId: jsonElement.targetVisualElements ? jsonElement.targetVisualElements[0].targetVisualElement : null,
        targetVisualElementPort: jsonElement.targetVisualElementPort,
        targetConnectedLinks: jsonElement.targetConnectedLinks,
        vertices: jsonElement.targetVisualElements ? jsonElement.targetVisualElements[0].vertices : null,
        tag: jsonElement.tag,
        labels: jsonElement.labels,
        showRequirementsLabel: jsonElement.showRequirementsLabel,
        strokeWidth: jsonElement.strokeWidth,
        strokeColor: jsonElement.strokeColor
      };
      return {
        ...super.getElementParamsFromJsonElement(jsonElement),
        ...params
      };
    }
    // in case instead of a reference to an object there is a string (representing object's id),
    // replace the id with the reference to object
    updateSourceAndTargetFromJson() {
      if (typeof this.sourceVisualElement === "string") {
        this.sourceVisualElement = this.logicalElement.opmModel.getVisualElementById(this.sourceVisualElement);
      }
      for (let i = 0; i < this.targetVisualElements.length; i++) {
        if (typeof this.targetVisualElements[i].targetVisualElement === "string") {
          this.targetVisualElements[i].targetVisualElement = this.logicalElement.opmModel.getVisualElementById(this.targetVisualElements[i].targetVisualElement);
        }
      }
    }
    /*updateSourceAndTargetConnectedLinksFromJson() {
      if (this.sourceConnectedLinks) {
        const linksArray = this.logicalElement.opmModel.arrayFromIdsToElements(this.sourceConnectedLinks);
        this.sourceConnectedLinks = <OpmLink[]>linksArray;
      }
      if (this.targetConnectedLinks) {
        const linksArray = this.logicalElement.opmModel.arrayFromIdsToElements(this.targetConnectedLinks);
        this.targetConnectedLinks = <OpmLink[]>linksArray;
      }
    }*/
    // Clone current visual and add to (current) opd.
    // Can be changed in the future, without the dependency in OpmOpd, if we will render the graph differently.
    // Attaches both ends.
    copyToOpd(opd, sourceCopy, targetCopy) {
      const copy = this.clone();
      opd.visualElements.push(copy);
      copy.sourceVisualElement = sourceCopy;
      copy.targetVisualElements[0].targetVisualElement = targetCopy;
      return copy;
    }
    canBeRemoved() {
      if (this.belongsToFatherModelId) {
        return false;
      }
      if (this.source.logicalElement.isWaitingProcess || this.target.logicalElement.isWaitingProcess) {
        return false;
      }
      return true;
    }
    remove() {
      let target = this.target;
      const type = this.type;
      const model = this.logicalElement.opmModel;
      const opd = model.getOpdByThingId(this.id);
      const ret = super.remove();
      if (this.logicalElement.visualElements.length === 0) {
        this.logicalElement.opmModel.removeLogicalElement(this.logicalElement);
        if (target.constructor.name.includes("State")) {
          target = target.fatherObject;
        }
        // if fundamental link is removed in opd B and in another opd the relation is folded => remove it.
        if (consistency_links_set /* .fundamental */.gF.contains(type) && (target.constructor.name.includes("Object") || target.constructor.name.includes("Process")) && target.logicalElement.visualElements.find(vis => model.getOpdByThingId(vis.id) !== opd && vis.isFoldedUnderThing().isFolded === true && vis.isFoldedUnderThing().triangleType === this.type)) {
          const semifolded = target.logicalElement.visualElements.find(vis => model.getOpdByThingId(vis.id) !== opd && vis.isFoldedUnderThing().isFolded === true && vis.isFoldedUnderThing().triangleType === this.type);
          const father = semifolded.fatherObject;
          father.removeThingFromSemiFoldedArray(semifolded);
          semifolded.remove();
          father.arrangeInnerSemiFoldedThings();
        }
      }
      return ret;
    }
    setReferencesFromJson(json, map) {
      this.sourceVisualElement = map.get(json.sourceVisualElement);
      this.targetVisualElements[0].targetVisualElement = map.get(json.targetVisualElements[0].targetVisualElement);
    }
    setReferencesOnCreate() {
      this.logicalElement.sourceLogicalElement = this.sourceVisualElement.logicalElement;
      this.logicalElement.targetLogicalElements = [this.targetVisualElements[0].targetVisualElement.logicalElement];
    }
    getHaloCommands() {
      return [];
    }
    getToolbarCommands() {
      return [];
    }
    removeRequirementsLabel() {
      this.labels = this.labels || [];
      for (let i = this.labels.length - 1; i >= 0; i--) {
        if (this.labels[i].attrs.label.text.startsWith("Satisfied: ")) {
          this.labels.splice(i, 1);
          return;
        }
      }
    }
  }
  /*
   TargetElementData contains the target element and an array of vertices on the connection
   that gets to it. In case of fundamental link it will be all the vertices from the
   triangle to the target, in any other case it will be the vertices from the source to the
   target.
   */
  class TargetElementData {
    constructor(targetVisualElement, vertices) {
      this.targetVisualElement = targetVisualElement;
      this.vertices = vertices;
    }
  }

  /***/
}),
/***/21950: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    E: () => (/* binding */OpmProceduralLink)

  });

  class OpmProceduralLink extends OpmLink /* .OpmLink */.t {
    constructor(params, logicalElement) {
      super(params, logicalElement);
    }
    updateParams(params) {
      super.updateParams(params);
      this.path = params.path;
      this.Probability = params.Probability;
      this.rate = params.rate;
      this.rateUnits = params.rateUnits;
      this.sourceMultiplicity = params.sourceMultiplicity;
      this.targetMultiplicity = params.targetMultiplicity;
      this.timeMin = params.timeMin;
      this.timeMax = params.timeMax;
      this.timeMinVal = params.timeMinVal;
      this.timeMaxVal = params.timeMaxVal;
      this.center = params.center;
      this.selfInvocationPeakPoint = params.selfInvocationPeakPoint;
    }
    setParams(params) {
      super.setParams(params);
      this.path = params.path;
      this.Probability = params.Probability;
      this.rate = params.rate;
      this.rateUnits = params.rateUnits;
      this.sourceMultiplicity = params.sourceMultiplicity;
      this.targetMultiplicity = params.targetMultiplicity;
      this.timeMin = params.timeMin;
      this.timeMax = params.timeMax;
      this.timeMinVal = params.timeMinVal;
      this.timeMaxVal = params.timeMaxVal;
      this.center = params.center;
      this.selfInvocationPeakPoint = params.selfInvocationPeakPoint;
    }
    getParams() {
      const params = {
        path: this.path,
        Probability: this.Probability,
        rate: this.rate,
        rateUnits: this.rateUnits,
        sourceMultiplicity: this.sourceMultiplicity,
        targetMultiplicity: this.targetMultiplicity,
        timeMin: this.timeMin,
        timeMax: this.timeMax,
        timeMinVal: this.timeMinVal,
        timeMaxVal: this.timeMaxVal,
        center: this.center,
        selfInvocationPeakPoint: this.selfInvocationPeakPoint
      };
      return {
        ...super.getLinkParams(),
        ...params
      };
    }
    getParamsFromJsonElement(jsonElement) {
      const params = {
        path: jsonElement.path,
        Probability: jsonElement.Probability,
        rate: jsonElement.rate,
        rateUnits: jsonElement.rateUnits,
        sourceMultiplicity: jsonElement.sourceMultiplicity,
        targetMultiplicity: jsonElement.targetMultiplicity,
        timeMin: jsonElement.timeMin,
        timeMax: jsonElement.timeMax,
        timeMinVal: jsonElement.timeMinVal,
        timeMaxVal: jsonElement.timeMaxVal,
        center: jsonElement.center,
        selfInvocationPeakPoin: jsonElement.selfInvocationPeakPoin
      };
      return {
        ...super.getLinkParamsFromJsonElement(jsonElement),
        ...params
      };
    }
    isStructuralLink() {
      return false;
    }
    isProceduralLink() {
      return true;
    }
    getPartner() {
      return this.partner;
    }
    clone() {
      const newLink = new OpmProceduralLink(this.getParams(), this.logicalElement);
      newLink.setNewUUID();
      return newLink;
    }
    setAsPartner(link) {
      this.partner = link;
      link.partner = this;
    }
    setLabels(labels) {
      const links = this.logicalElement.visualElements;
      const ret = new Array().concat(links);
      for (const link of links) {
        link.path = labels.Path;
        link.Probability = labels.Probability;
        link.targetMultiplicity = labels.targetMultiplicity;
        link.sourceMultiplicity = labels.sourceMultiplicity;
        link.rate = labels.rate;
        link.rateUnits = labels.rateUnits;
      }
      return ret;
    }
    remove() {
      const ret = [].concat(super.remove());
      const model = this.logicalElement.opmModel;
      const visSource = this.sourceVisualElement;
      const visTarget = this.targetVisualElements[0].targetVisualElement;
      const visualProcess = visSource instanceof OpmVisualProcess /* .OpmVisualProcess */.o ? visSource : visTarget;
      let visualObject = visSource instanceof OpmVisualProcess /* .OpmVisualProcess */.o ? visTarget : visSource;
      if (visualObject instanceof OpmVisualState /* .OpmVisualState */.y) {
        visualObject = visualObject.fatherObject;
      }
      const isHiddingLinks = model.links.isHavingHiddenInOuts(visualProcess, visualObject).isHaving;
      if (this.type === ConfigurationOptions /* .linkType */.h6.Effect && isHiddingLinks) {
        model.links.switchEffectToInOuts(this);
      } else if (this.type === ConfigurationOptions /* .linkType */.h6.Result || this.type === ConfigurationOptions /* .linkType */.h6.Consumption) {
        const links = [...visualProcess.getLinksWith(visualObject).inGoing, ...visualProcess.getLinksWith(visualObject).outGoing];
        const effect = links.find(l => l.type === ConfigurationOptions /* .linkType */.h6.Effect && l.visible === false);
        const isHavingVisibleInOuts = model.links.isHavingVisibleInOuts(visualProcess, visualObject).isHaving;
        if (effect && !isHavingVisibleInOuts) {
          effect.remove();
        }
      }
      if (this.partner) {
        this.partner.partner = undefined;
        ret.push(...this.partner.remove());
      }
      return ret;
    }
  }

  /***/
}),
/***/93374: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    i: () => (/* binding */OpmStructuralLink)

  });

  class OpmStructuralLink extends OpmLink /* .OpmLink */.t {
    constructor(params, logicalElement) {
      super(params, logicalElement);
    }
    isStructuralLink() {
      return true;
    }
    isProceduralLink() {
      return false;
    }
    updateParams(params) {
      super.updateParams(params);
      this.targetMultiplicity = params.targetMultiplicity;
    }
    setParams(params) {
      super.setParams(params);
      this.targetMultiplicity = params.targetMultiplicity;
      this.sourceVisualElementPort = params.sourceVisualElementPort;
      this.targetVisualElementPort = params.targetVisualElementPort;
      if (params.targetVisualElements && params.targetVisualElements[0]?.vertices) {
        this.BreakPoints = params.targetVisualElements[0].vertices;
      }
      if (params.vertices) {
        this.BreakPoints = params.vertices;
      }
    }
    getStructuralParams() {
      const params = {
        targetMultiplicity: this.targetMultiplicity
      };
      return {
        ...super.getLinkParams(),
        ...params
      };
    }
    getStructuralParamsFromJsonElement(jsonElement) {
      const params = {
        targetMultiplicity: jsonElement.targetMultiplicity
      };
      return {
        ...super.getLinkParamsFromJsonElement(jsonElement),
        ...params
      };
    }
    /**
     * This method returns an array of the missing objects names in the OPD to show in a tooltip near the object numbers.
     */
    getMissingChildrenNames(sameTag = false) {
      // getting the visual link
      const visualLink = this;
      // getting the visual source in the relation
      const visualSource = visualLink.sourceVisualElement;
      // getting all the links attached to the same source from the same link type
      let OutgoingLinksCurrentOpd = visualSource.getLinks().outGoing.filter(link => link.type === visualLink.type);
      if (sameTag) {
        OutgoingLinksCurrentOpd = OutgoingLinksCurrentOpd.filter(link => link.tag === visualLink.tag);
      }
      const LogicalLinksCurrentOpd = new Array(); // an Array for holding the logical links
      // pushing the elements to LogicalLinksCurrentOpd array
      OutgoingLinksCurrentOpd.forEach(link => {
        LogicalLinksCurrentOpd.push(link.logicalElement);
      });
      // An array of all the visual links attached to the source from all OPDs from the same link type
      let arrayOfAllLinks = visualSource.getAllLinks().outGoing.filter(link => link.type === visualLink.type);
      if (sameTag) {
        arrayOfAllLinks = arrayOfAllLinks.filter(link => link.tag === visualLink.tag);
      }
      const arrayOfAllLogicals = new Array(); // An array of all the logical links attached to the source from all OPDs
      // pushing the elements for arrayOfAllLogicals
      arrayOfAllLinks.forEach(link => {
        arrayOfAllLogicals.push(link.logicalElement);
      });
      // remove duplicates from arrayOfAllLogicals
      const arrayOfAllUniqueLogicals = [...new Set(arrayOfAllLogicals)];
      // returning the difference between the length of the two arrays which indicates how many entities are missing
      const logicalChildren = [];
      const existingTargets = [];
      for (const link of arrayOfAllUniqueLogicals) {
        existingTargets.push(link.visualElements[0].target.logicalElement);
      }
      if (visualLink.type === ConfigurationOptions /* .linkType */.h6.Aggregation) {
        for (const vis of visualLink.source.logicalElement.visualElements) {
          if (vis.children) {
            vis.children.forEach(child => {
              if (child.type && child.type === visualLink.source.type && !logicalChildren.includes(child.logicalElement)) {
                existingTargets.push(child.logicalElement);
              }
            });
          }
        }
      }
      for (const link of LogicalLinksCurrentOpd) {
        logicalChildren.push(link.visualElements[0].target.logicalElement);
      }
      const notInOPDNames = [];
      const missing = [];
      existingTargets.filter(trgt => !logicalChildren.includes(trgt)).forEach(entity => {
        notInOPDNames.push(entity.text);
        missing.push(entity);
      });
      return {
        names: notInOPDNames,
        missing
      };
    }
    // Check if we should add a line to the triangle for the current relation and return the number
    // of missing relations from the same source
    CheckAddLine(sameTag = false) {
      // getting the visual link
      const visualLink = this;
      // getting the visual source in the relation
      const visualSource = visualLink.sourceVisualElement;
      if (!visualSource || !visualLink.target) {
        return {
          missingNumber: 0,
          missingProcesses: [],
          missingObjectsAndStates: []
        };
      }
      // getting all the links attached to the same source from the same link type
      let OutgoingLinksCurrentOpd;
      if (sameTag) {
        OutgoingLinksCurrentOpd = visualSource.getLinks().outGoing.filter(link => link.type === visualLink.type && link.tag === this.tag);
      } else {
        OutgoingLinksCurrentOpd = visualSource.getLinks().outGoing.filter(link => link.type === visualLink.type);
      }
      const LogicalLinksCurrentOpd = new Array(); // an Array for holding the logical links
      // pushing the elements to LogicalLinksCurrentOpd array
      OutgoingLinksCurrentOpd.forEach(link => {
        LogicalLinksCurrentOpd.push(link.logicalElement);
      });
      // An array of all the visual links attached to the source from all OPDs from the same link type
      let arrayOfAllLinks;
      if (sameTag) {
        arrayOfAllLinks = visualSource.getAllLinks().outGoing.filter(link => link.type === visualLink.type && link.tag === this.tag);
      } else {
        arrayOfAllLinks = visualSource.getAllLinks().outGoing.filter(link => link.type === visualLink.type);
      }
      const arrayOfAllLogicals = new Array(); // An array of all the logical links attached to the source from all OPDs
      // pushing the elements for arrayOfAllLogicals
      arrayOfAllLinks.forEach(link => {
        arrayOfAllLogicals.push(link.logicalElement);
      });
      // remove duplicates from arrayOfAllLogicals
      const arrayOfAllUniqueLogicals = [...new Set(arrayOfAllLogicals)];
      // returning the difference between the length of the two arrays which indicates how many entities are missing
      const logicalChildren = [];
      const existingTargets = [];
      for (const link of arrayOfAllUniqueLogicals) {
        existingTargets.push(link.visualElements[0].target.logicalElement);
      }
      if (visualLink.type === ConfigurationOptions /* .linkType */.h6.Aggregation) {
        for (const vis of visualLink.source.logicalElement.visualElements) {
          if (vis.children) {
            vis.children.forEach(child => {
              if (child.type && child.type === visualLink.source.type && !logicalChildren.includes(child.logicalElement)) {
                logicalChildren.push(child.logicalElement);
              }
            });
          }
        }
      }
      let existInTotal = arrayOfAllUniqueLogicals.length;
      const existInCurrentOpd = OutgoingLinksCurrentOpd.length;
      for (const child of logicalChildren) {
        if (!existingTargets.find(trgt => trgt === child)) {
          existInTotal += 1;
        }
      }
      const missingData = this.getMissingChildrenNames(sameTag);
      return {
        missingNumber: existInTotal - existInCurrentOpd,
        missingProcesses: missingData.missing.filter(e => configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfLogicalProcess(e)),
        missingObjectsAndStates: missingData.missing.filter(e => !configuration_rappidEnviromentFunctionality_shared /* .OPCloudUtils */.e2.isInstanceOfLogicalProcess(e))
      };
    }
  }

  /***/
}),
/***/91089: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    Z: () => (/* binding */OpmTaggedLink)

  });

  class OpmTaggedLink extends OpmStructuralLink /* .OpmStructuralLink */.i {
    constructor(params, logicalElement) {
      super(params, logicalElement);
    }
    updateParams(params) {
      super.updateParams(params);
      this.tag = params.tag;
      this.backwardTag = params.backwardTag;
    }
    getParams() {
      const params = {
        tag: this.tag,
        backwardTag: this.backwardTag
      };
      return {
        ...super.getStructuralParams(),
        ...params
      };
    }
    getParamsFromJsonElement(jsonElement) {
      const params = {
        tag: jsonElement.tag,
        backwardTag: jsonElement.backwardTag
      };
      return {
        ...super.getStructuralParamsFromJsonElement(jsonElement),
        ...params
      };
    }
    clone() {
      const newLink = new OpmTaggedLink(this.getParams(), this.logicalElement);
      newLink.setNewUUID();
      return newLink;
    }
  }

  /***/
}),
/***/34905: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    p: () => (/* binding */OpmVisualElement)

  });

  var uuid = jointjs__WEBPACK_IMPORTED_MODULE_0__ /* .uuid */.uR;
  class OpmVisualElement {
    constructor(params, logicalElement) {
      this.logicalElement = logicalElement;
      this.setNewUUID();
      if (logicalElement) {
        logicalElement.add(this, false);
      }
      if (params) {
        this.updateParams(params);
      }
    }
    isLink() {
      return false;
    }
    pointToFather(opmLogicalElement) {
      this.logicalElement = opmLogicalElement;
    }
    getElementParams() {
      return {
        textFontWeight: this.textFontWeight,
        textFontSize: this.textFontSize,
        textFontFamily: this.textFontFamily,
        textColor: this.textColor,
        strokeWidth: this.strokeWidth,
        strokeColor: this.strokeColor,
        id: this.id,
        belongsToSubModel: this.belongsToSubModel,
        protectedFromBeingChangedBySubModel: this.protectedFromBeingChangedBySubModel,
        belongsToFatherModelId: this.belongsToFatherModelId
      };
    }
    updateParams(params) {
      if (params.textColor !== "transparent") {
        this.textColor = params.textColor;
      }
      this.textFontSize = params.textFontSize;
      this.textFontFamily = params.textFontFamily;
      this.textFontWeight = params.textFontWeight;
      this.strokeColor = params.strokeColor;
      this.strokeWidth = params.strokeWidth;
      this.id = params.id;
      if (params.hasOwnProperty("belongsToSubModel")) {
        this.belongsToSubModel = params.belongsToSubModel;
      }
      if (params.hasOwnProperty("protectedFromBeingChangedBySubModel")) {
        this.protectedFromBeingChangedBySubModel = params.protectedFromBeingChangedBySubModel;
      }
      if (params.hasOwnProperty("belongsToFatherModelId")) {
        this.belongsToFatherModelId = params.belongsToFatherModelId;
      }
    }
    setParams(params) {
      if (params.textColor !== "transparent") {
        this.textColor = params.textColor;
      }
      this.textFontSize = params.textFontSize;
      this.textFontFamily = params.textFontFamily;
      this.textFontWeight = params.textFontWeight;
      this.strokeColor = params.strokeColor;
      this.strokeWidth = params.strokeWidth;
      this.id = params.id;
      if (params.hasOwnProperty("belongsToSubModel")) {
        this.belongsToSubModel = params.belongsToSubModel;
      }
      if (params.hasOwnProperty("protectedFromBeingChangedBySubModel")) {
        this.protectedFromBeingChangedBySubModel = params.protectedFromBeingChangedBySubModel;
      }
      if (params.hasOwnProperty("belongsToFatherModelId")) {
        this.belongsToFatherModelId = params.belongsToFatherModelId;
      }
    }
    getElementParamsFromJsonElement(jsonElement) {
      return {
        textColor: jsonElement.textColor,
        textFontSize: jsonElement.textFontSize,
        textFontFamily: jsonElement.textFontFamily,
        textFontWeight: jsonElement.textFontWeight,
        strokeColor: jsonElement.strokeColor,
        strokeWidth: jsonElement.strokeWidth,
        id: jsonElement.id,
        belongsToSubModel: jsonElement.belongsToSubModel,
        belongsToFatherModelId: jsonElement.belongsToFatherModelId,
        protectedFromBeingChangedBySubModel: jsonElement.protectedFromBeingChangedBySubModel
      };
    }
    // updateComplexityReferences() { }
    setNewUUID() {
      this.id = uuid();
    }
    clone() {
      return null;
    }
    isInzoomed() {
      return false;
    }
    isUnfolded() {
      return false;
    }
    isComputational() {
      return false;
    }
    deriveProperties() {
      // console.log('derive Properties for ' + this.id);
      // A method to do special processing during unfolding of the element to derive properties from in zoomed version.
    }
    setReferencesFromJson(json, map) {}
    setReferencesOnCreate() {}
    remove() {
      return remove(this, this.logicalElement);
    }
  }
  function remove(visual, logical) {
    const elements = new Array();
    elements.push(visual);
    const ret = logical.removeVisual(visual);
    if (ret && ret.removed && ret.removed.length > 0) {
      elements.push(...ret.removed.filter(v => !elements.includes(v)));
    }
    logical.opmModel.removeFromOpd(visual);
    return elements;
  }

  /***/
}),
/***/87602: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    e: () => (/* binding */OpmVisualEntity)

  });

  const defaultDescriptionStatus = " ";
  class OpmVisualEntity extends OpmVisualElement /* .OpmVisualElement */.p {
    constructor(params, logicalElement) {
      super(params, logicalElement);
    }
    get fatherObject() {
      return this._fatherObject;
    }
    set fatherObject(value) {
      this._fatherObject = value;
    }
    setDescriptionStatus(ds) {
      if (typeof ds === "string") {
        this.descriptionStatus = ds;
      }
    }
    getDescriptionStatus() {
      return this.descriptionStatus || defaultDescriptionStatus;
    }
    getEntityParams() {
      const params = {
        xPos: this.xPos,
        yPos: this.yPos,
        width: this.width,
        height: this.height,
        fill: this.fill,
        refX: this.refX,
        refY: this.refY,
        xAlign: this.xAlign,
        yAlign: this.yAlign,
        textAnchor: this.textAnchor,
        textWidth: this.textWidth,
        textHeight: this.textHeight,
        isManualTextPos: this.isManualTextPos,
        descriptionStatus: this.descriptionStatus || defaultDescriptionStatus,
        fatherObjectId: this.fatherObject ? this.fatherObject.id ? this.fatherObject.id : this.fatherObject : null,
        ports: this.ports,
        patternConfig: this.patternConfig || null,
        predefinedPatternId: this.predefinedPatternId || null,
        baseFillColor: this.baseFillColor || null,
        isCustomPattern: this.isCustomPattern || false
      };
      return {
        ...super.getElementParams(),
        ...params
      };
    }
    getDisplayText() {
      return this.logicalElement.getDisplayText();
    }
    updateParams(params) {
      super.updateParams(params);
      // preventing the hovered color from being saved if error occurs
      if (params.fill && params.fill === "#E1E6EB") {
        params.fill = this.fill ? this.fill : "#FFFFFF";
      }
      this.fill = params.fill;
      this.xPos = params.xPos;
      this.yPos = params.yPos;
      this.width = params.width;
      this.height = params.height;
      this.refX = params.refX;
      this.refY = params.refY;
      this.xAlign = params.xAlign;
      this.yAlign = params.yAlign;
      this.textAnchor = params.textAnchor;
      this.textWidth = params.textWidth;
      this.textHeight = params.textHeight;
      this.ports = params.ports;
      this.isManualTextPos = params.isManualTextPos;
      this.descriptionStatus = params.descriptionStatus || defaultDescriptionStatus;
      // Restore pattern config if present
      if (params.patternConfig) {
        this.patternConfig = params.patternConfig;
      }
      if (params.baseFillColor !== undefined) {
        this.baseFillColor = params.baseFillColor;
      }
      if (params.isCustomPattern !== undefined) {
        this.isCustomPattern = params.isCustomPattern;
      }
      if (params.predefinedPatternId !== undefined) {
        this.predefinedPatternId = params.predefinedPatternId;
      }
      if (this.logicalElement) {
        const father = this.logicalElement.opmModel.getVisualElementById(params.fatherObjectId);
        this.fatherObject = father ? father : params.fatherObjectId;
      }
    }
    setParams(params) {
      super.setParams(params);
      const cc = this.logicalElement.opmModel.getCurrentConfiguration();
      if (cc && cc[this.logicalElement.lid] && cc[this.logicalElement.lid].value !== 0) {
        delete params.fill;
      }
      // preventing the hovered color from being saved if error occurs
      if (params.fill && params.fill === "#E1E6EB") {
        params.fill = this.fill ? this.fill : "#FFFFFF";
      }
      if (params.fill) {
        this.fill = params.fill;
      }
      this.xPos = params.xPos;
      this.yPos = params.yPos;
      this.width = params.width;
      this.height = params.height;
      this.refX = params.refX;
      this.refY = params.refY;
      this.xAlign = params.xAlign;
      this.yAlign = params.yAlign;
      this.textAnchor = params.textAnchor;
      this.textWidth = params.textWidth;
      this.textHeight = params.textHeight;
      this.ports = params.ports;
      this.isManualTextPos = params.isManualTextPos || this.isManualTextPos;
    }
    setDefaultStyleFields() {
      this.fill = "#FFFFFF";
      this.refX = 0.5;
      this.refY = 0.5;
      this.xAlign = "middle";
      this.yAlign = "middle";
      this.textAnchor = "middle";
      this.textWidth = "80%";
      this.textHeight = "80%";
      this.strokeWidth = 2;
      this.textColor = "#000002";
      this.textFontFamily = "Arial";
      this.textFontSize = 14;
      this.textFontWeight = 600;
      this.isManualTextPos = false;
    }
    resetColors() {
      this.fill = "#FFFFFF";
    }
    getEntityParamsFromJsonElement(jsonElement) {
      let descriptionStatus = jsonElement.descriptionStatus;
      if (typeof descriptionStatus !== "string") {
        descriptionStatus = defaultDescriptionStatus; // to cope with old version where this was an object.
      }
      const params = {
        fill: jsonElement.fill,
        xPos: jsonElement.xPos,
        yPos: jsonElement.yPos,
        width: jsonElement.width,
        height: jsonElement.height,
        refX: jsonElement.refX,
        refY: jsonElement.refY,
        xAlign: jsonElement.xAlign,
        yAlign: jsonElement.yAlign,
        ports: jsonElement.ports,
        textAnchor: jsonElement.textAnchor,
        textWidth: jsonElement.textWidth,
        textHeight: jsonElement.textHeight,
        fatherObjectId: jsonElement.fatherObjectId,
        isManualTextPos: jsonElement.isManualTextPos,
        descriptionStatus: descriptionStatus,
        patternConfig: jsonElement.patternConfig || null,
        predefinedPatternId: jsonElement.predefinedPatternId || null,
        baseFillColor: jsonElement.baseFillColor || null,
        isCustomPattern: jsonElement.isCustomPattern || false
      };
      return {
        ...super.getElementParamsFromJsonElement(jsonElement),
        ...params
      };
    }
    setPos(x, y) {
      this.xPos = x;
      this.yPos = y;
    }
    getPosition() {
      return {
        x: this.xPos,
        y: this.yPos
      };
    }
    getPortsInUse() {
      const ret = [];
      const links = this.getLinks();
      for (const link of links.outGoing) {
        if (link.sourceVisualElementPort) {
          ret.push(link.sourceVisualElementPort);
        }
      }
      for (const link of links.inGoing) {
        if (link.targetVisualElementPort) {
          ret.push(link.targetVisualElementPort);
        }
      }
      return ret;
    }
    pasteStyleParams(copiedParams) {
      if (copiedParams.fillColor) {
        this.fill = copiedParams.fillColor;
      }
      if (copiedParams.textColor) {
        this.textColor = copiedParams.textColor;
      }
      if (copiedParams.fontSize) {
        this.textFontSize = copiedParams.fontSize;
      }
      if (copiedParams.font) {
        this.textFontFamily = copiedParams.font;
      }
      if (copiedParams.borderColor) {
        this.strokeColor = copiedParams.borderColor;
      }
      if (copiedParams.textAlign) {
        this.textAnchor = copiedParams.textAlign;
      }
      if (copiedParams.xPosition && copiedParams.yPosition) {
        this.xAlign = copiedParams.xPosition;
        this.yAlign = copiedParams.yPosition;
      }
    }
    getAllLinks() {
      const model = this.logicalElement.opmModel;
      const logical = this.logicalElement;
      const inGoing = new Array();
      let outGoing = new Array();
      let opds = model.getOpds(true);
      opds = [...opds, ...model.stereotypes.getStereoTypes().map(st => st.opd)];
      opds.forEach(opd => {
        const relevantLinks = opd.visualElements.filter(vis => vis instanceof OpmLink /* .OpmLink */.t);
        const outLinks = relevantLinks.filter(vis => vis.sourceVisualElement && vis.sourceVisualElement.logicalElement === logical);
        outGoing = [...outGoing, ...outLinks];
        relevantLinks.forEach(vis => {
          const trgtElmnts = vis.targetVisualElements;
          for (let i = 0; i < trgtElmnts.length; i++) {
            const temp = trgtElmnts[i];
            if (temp.targetVisualElement && temp.targetVisualElement.logicalElement === logical) {
              inGoing.push(vis);
              break;
            }
          }
        });
      });
      return {
        inGoing,
        outGoing
      };
    }
    getAllLinksWith(other) {
      const all = this.getAllLinks();
      let inGoing = all.inGoing;
      const out = all.outGoing;
      const outGoing = new Array();
      inGoing = inGoing.filter(lnk => {
        const current = lnk.logicalElement;
        if (current.sourceLogicalElement.lid === other.logicalElement.lid) {
          return true;
        }
        return false;
      });
      out.forEach(vis => {
        const trgtElmnts = vis.targetVisualElements;
        for (let i = 0; i < trgtElmnts.length; i++) {
          const temp = trgtElmnts[i];
          if (temp.targetVisualElement.logicalElement.lid === other.logicalElement.lid) {
            outGoing.push(vis);
            break;
          }
        }
      });
      return {
        inGoing,
        outGoing
      };
    }
    getLinks() {
      const model = this.logicalElement.opmModel;
      const opd = model.getOpdByElement(this);
      const inGoing = [];
      const outGoing = [];
      if (!opd) {
        return {
          inGoing: [],
          outGoing: []
        };
      }
      for (const element of opd.visualElements) {
        if (element.isLink()) {
          const link = element;
          if (link.source === this) {
            outGoing.push(link);
          }
          if (link.target === this) {
            inGoing.push(link);
          }
        }
      }
      return {
        inGoing,
        outGoing
      };
    }
    getChildrenLinks() {
      const opd = this.logicalElement.opmModel.getOpdByElement(this);
      const inGoing = new Array();
      const outGoing = new Array();
      if (!opd) {
        return {
          inGoing,
          outGoing
        };
      }
      for (const visual of opd.visualElements.filter(v => v instanceof OpmLink /* .OpmLink */.t)) {
        const link = visual;
        if (link.source.fatherObject && link.source.fatherObject === this) {
          outGoing.push(link);
        } else if (link.target.fatherObject && link.target.fatherObject === this) {
          inGoing.push(link);
        }
      }
      return {
        inGoing,
        outGoing
      };
    }
    getLinksWith(other) {
      const opd = this.logicalElement.opmModel.getOpdByElement(this);
      const inGoing = new Array();
      const outGoing = new Array();
      if (!opd) {
        return {
          inGoing,
          outGoing
        };
      }
      for (const visual of opd.visualElements) {
        if (visual instanceof OpmLink /* .OpmLink */.t) {
          if (visual.sourceVisualElement === this && visual.targetVisualElements[0].targetVisualElement === other) {
            outGoing.push(visual);
          } else if (visual.sourceVisualElement === other && visual.targetVisualElements[0].targetVisualElement === this) {
            inGoing.push(visual);
          }
        }
      }
      return {
        inGoing,
        outGoing
      };
    }
    getLinksIncludingChildren() {
      const inGoing = new Array();
      const outGoing = new Array();
      inGoing.push(...this.getLinks().inGoing);
      outGoing.push(...this.getLinks().outGoing);
      for (const child of this.getChildren()) {
        inGoing.push(...child.getLinks().inGoing);
        outGoing.push(...child.getLinks().outGoing);
      }
      return {
        inGoing,
        outGoing
      };
    }
    getLinksWithOtherAndItsChildren(other) {
      const inGoing = new Array();
      const outGoing = new Array();
      inGoing.push(...this.getLinksWith(other).inGoing);
      outGoing.push(...this.getLinksWith(other).outGoing);
      for (const child of other.getChildren()) {
        inGoing.push(...this.getLinksWith(child).inGoing);
        outGoing.push(...this.getLinksWith(child).outGoing);
      }
      return {
        inGoing,
        outGoing
      };
    }
    getChildren() {
      return [];
    }
    canBeRemoved() {
      return canBeRemoved(this, this.logicalElement);
    }
    remove() {
      const ret = super.remove();
      return [].concat(ret).concat(remove(this, this.logicalElement));
    }
    setReferencesFromJson(json, map) {
      this.fatherObject = map.get(json.fatherObjectId);
    }
    bringMissingFundamentals(type) {
      const created = {
        links: [],
        entities: [],
        foldedOutEntities: [],
        foldedOutlinks: []
      };
      const model = this.logicalElement.opmModel;
      const toOpd = model.getOpdByThingId(this.id);
      const that = this;
      if (this.isSemiFolded()) {
        const relationsToFoldOut = that.semiFolded.filter(vis => vis.isFoldedUnderThing().triangleType === type);
        for (const folded of relationsToFoldOut) {
          const ret = model.foldOutFundamentalRelation(folded);
          created.foldedOutlinks.push(...ret.createdLinks);
          created.foldedOutEntities.push(...ret.createdEntities, ...ret.removed);
          if (ret.createdEntities.length === 1 && ret.createdEntities[0].constructor.name.includes("Object")) {
            ret.createdEntities[0].expressAll();
          }
        }
        that.arrangeInnerSemiFoldedThings();
      }
      let linksToBring = (0, configuration_rappidEnviromentFunctionality_shared /* .removeDuplicationsInArray */.vN)(this.getAllLinks().outGoing.filter(l => l.type === type).map(visLink => visLink.logicalElement));
      linksToBring = linksToBring.filter(l => !l.visualElements.find(v => model.getOpdByThingId(v.id) === toOpd));
      for (const link of linksToBring) {
        if (link.visualElements.some(v => v.target.belongsToSubModel)) {
          continue;
        }
        const logicalTarget = link.targetLogicalElements[0];
        let visTargetAtOpd = logicalTarget.visualElements.find(v => model.getOpdByThingId(v.id) === toOpd);
        if (!visTargetAtOpd) {
          if (logicalTarget.constructor.name.includes("State")) {
            const father = model.bringVisualToOpd(logicalTarget.parent, toOpd);
            father.expressAll();
            created.entities.push(father);
            visTargetAtOpd = logicalTarget.visualElements.find(vis => model.getOpdByThingId(vis.id) === toOpd);
          } else {
            visTargetAtOpd = model.bringVisualToOpd(logicalTarget, toOpd);
            created.entities.push(visTargetAtOpd);
            if (visTargetAtOpd.constructor.name.includes("Object")) {
              visTargetAtOpd.expressAll();
            }
          }
        }
        const linkParams = {
          type: link.linkType,
          connection: ConfigurationOptions /* .linkConnectionType */.zv.systemic
        };
        // const ret = model.connect(this, visTargetAtOpd, linkParams);
        // if (ret.success)
        //   created.links.push(...ret.created);
        created.links.push(model.links.connect(this, visTargetAtOpd, linkParams));
      }
      if (type === ConfigurationOptions /* .linkType */.h6.Aggregation) {
        let allChildren = [];
        for (const vis of this.logicalElement.visualElements) {
          allChildren.push(...(vis.children ? vis.children : []));
        }
        allChildren = (0, configuration_rappidEnviromentFunctionality_shared /* .removeDuplicationsInArray */.vN)(allChildren.map(child => child.logicalElement).filter(log => log.constructor.name === this.logicalElement.constructor.name));
        for (const logicalChild of allChildren) {
          let childAtOpd = logicalChild.visualElements.find(v => model.getOpdByThingId(v.id) === toOpd);
          if (childAtOpd && this.getAllLinksWith(childAtOpd).outGoing.find(lnk => lnk.type === ConfigurationOptions /* .linkType */.h6.Aggregation)) {
            continue;
          }
          if (!childAtOpd) {
            childAtOpd = model.bringVisualToOpd(logicalChild, toOpd);
            if (childAtOpd.constructor.name.includes("Object")) {
              childAtOpd.expressAll();
            }
            created.entities.push(childAtOpd);
          }
          const ret = model.connect(this, childAtOpd, {
            type: ConfigurationOptions /* .linkType */.h6.Aggregation,
            connection: ConfigurationOptions /* .linkConnectionType */.zv.systemic
          });
          if (ret.success) {
            created.links.push(...ret.created);
          }
        }
      }
      if (!this.constructor.name.includes("State")) {
        toOpd.beautify(this);
      }
      return created;
    }
    generateHalo() {
      return this.getHaloHandles();
    }
    getHaloHandles() {
      return ["remove"];
    }
    isSemiFolded() {
      return false;
    }
    isTimeDuration() {
      return this.logicalElement.isTimeDuration();
    }
    isInzoomed() {
      return false;
    }
    isInzoomedForTooltip() {
      return false;
    }
    isUnfolded() {
      return false;
    }
    isUnfoldedForTooltip() {
      return false;
    }
    toggleManualTextPos() {
      this.isManualTextPos = !this.isManualTextPos;
    }
    canModifyText() {
      return true;
    }
  }
  function remove(visual, logical) {
    const elements = new Array();
    visual.getAllLinks().inGoing.filter(l => l.targetVisualElements[0].targetVisualElement === visual).forEach(v => elements.push(...v.remove()));
    visual.getAllLinks().outGoing.filter(l => l.sourceVisualElement === visual).forEach(v => elements.push(...v.remove()));
    return elements;
  }
  function canBeRemoved(visual, logical) {
    return true;
  }

  /***/
}),
/***/86922: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    I: () => (/* binding */OpmVisualObject)
  });
