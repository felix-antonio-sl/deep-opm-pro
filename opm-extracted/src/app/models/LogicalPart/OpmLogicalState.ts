// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/LogicalPart/OpmLogicalState.ts
// Extracted by opm-extracted/tools/extract.mjs

  class OpmLogicalState extends OpmLogicalEntity {
    constructor(params, model) {
      super(params, model);
      this.duration = new TimeDurationModule();
      if (params) {
        // if the state is ellipsis state them there are no params
        this.parent = this.opmModel.getLogicalElementByVisualId(params.fatherObjectId);
      }
      //   this.visualElements[0].fatherObject.logicalElement.states.push(this);
      this.textModule.addTextualModules(this.duration);
    }
    // TODO: Created just untill we change the c'tor
    set parent(parent) {
      this._parent = parent;
    }
    get parent() {
      return this._parent;
    }
    get stateType() {
      return this._stateType;
    }
    set stateType(stateType) {
      this._stateType = stateType;
    }
    updateParams(params) {
      super.updateParams(params);
      this.stateType = params.stateType;
      if (params.timeDurationStatus || params.min != null || params.nominal != null || params.max != null || params.durationDistributionKind && params.durationDistributionKind !== "none") {
        const durationParams = {
          min: params.min ?? null,
          nominal: params.nominal ?? null,
          max: params.max ?? null,
          units: params.units != null && params.units !== "" ? params.units : DEFAULT_TIME_DURATION_UNIT,
          durationDistributionKind: params.durationDistributionKind || "none",
          durationDistributionParams: params.durationDistributionParams || {}
        };
        this.duration.setTimeDuration(durationParams);
      }
    }
    setParams(params) {
      super.setParams(params);
      this.stateType = params.stateType;
      if (params.timeDurationStatus || params.min != null || params.nominal != null || params.max != null || params.durationDistributionKind && params.durationDistributionKind !== "none") {
        const durationParams = {
          min: params.min ?? null,
          nominal: params.nominal ?? null,
          max: params.max ?? null,
          units: params.units != null && params.units !== "" ? params.units : DEFAULT_TIME_DURATION_UNIT,
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
        stateType: this.stateType,
        visualElementsParams: visualElementsParams,
        min: this.duration.getTimeDuration().min,
        nominal: this.duration.getTimeDuration().nominal,
        max: this.duration.getTimeDuration().max,
        units: this.duration.getTimeDuration().units,
        //timeDurationStatus:this.duration.isTimeDuration(),
        timeDurationStatus: this.duration.getTimeDuration().timeDurationStatus,
        durationDistributionKind: this.duration.getTimeDuration().durationDistributionKind,
        durationDistributionParams: this.duration.getTimeDuration().durationDistributionParams
      };
      return {
        ...super.getEntityParams(),
        ...params
      };
    }
    getParamsFromJsonElement(jsonElement) {
      const params = {
        stateType: jsonElement.stateType
      };
      return {
        ...super.getEntityParamsFromJsonElement(jsonElement),
        ...params
      };
    }
    createVisual(param) {
      return new OpmVisualState(param, this);
    }
    createVisualState(parent, param) {
      if (!param) {
        const drawn = new OpmState(this.text);
        param = drawn.getParams();
      }
      const visual = this.createVisual(param);
      visual.fatherObject = parent;
      //this.opmModel.currentOpd.visualElements.push(visual);
      return visual;
    }
    removeVisual(visual) {
      for (let i = this.visualElements.length - 1; i >= 0; i--) {
        if (this.visualElements[i] === visual) {
          this.visualElements.splice(i, 1);
          this.opmModel.removeElementFromOpds(visual);
          break;
        }
      }
    }
    removeAllVisuals() {
      const list = Array();
      for (let i = 0; i < this.visualElements.length; i++) {
        list.push(this.visualElements[i]);
      }
      for (let i = 0; i < list.length; i++) {
        this.removeVisual(list[i]);
      }
    }
    removeFromFather() {
      this.parent.removeState(this);
    }
    // TODO: Here just untill we change the c'tor
    removeFirstOnInit() {
      this.visualElements.length = 0;
    }
    // Architecture won't allow this to be any place eles.
    removeThis() {
      this.opmModel.removeLogicalElement(this);
      for (let i = this.visualElements.length - 1; i >= 0; i--) {
        const father = this.visualElements[i].fatherObject;
        father.children.splice(father.children.findIndex(c => c === this.visualElements[i]), 1);
        const opd = this.opmModel.getOpdByThingId(this.visualElements[i].id);
        if (opd) {
          opd.remove(this.visualElements[i].id);
        }
      }
      // this.visualElements.length = 0;
    }
    isRefineable() {
      return false;
    }
    isTimeDuration() {
      return this.duration.isTimeDuration();
    }
    getBareName() {
      return this.textModule.getName();
    }
    getDurationManager() {
      return this.duration;
    }
    getTextFormatter() {
      return t => super.getTextFormatter()(t).toLowerCase();
    }
    isValidName(value) {
      const parent = this.getFather();
      const validation = parent.getValidationModule();
      if (validation.isActive()) {
        if (validation.validateValue(value) == false) {
          return false;
        }
      }
      return true;
    }
    setText(text) {
      const parent = this.getFather();
      if (parent.isComputational()) {
        parent.value = text;
      }
      super.setText(text);
    }
    isNumeric(str) {
      return !isNaN(str) && !isNaN(parseFloat(str));
    }
    getDisplayText() {
      const parent = this.getFather();
      if (parent && parent.isComputational()) {
        const value = parent.value;
        if (value && value !== "value") {
          if (this.isNumeric(value)) {
            const num = +value;
            const displayDigitsNum = this.opmModel.getOplService()?.settings?.numericComputationalDigits !== undefined ? this.opmModel.getOplService()?.settings?.numericComputationalDigits : defaultSettings.user.numericComputationalDigits;
            if (num.toString().split(".")[1]?.length && num.toString().split(".")[1].length > displayDigitsNum) {
              return num.toFixed(displayDigitsNum).toString();
            }
            return num.toString();
          }
          return value;
        }
        const validation = parent.getValidationModule();
        if (validation.isActive()) {
          return parent.getValidationModule().getRange();
        }
        return "value";
      }
      return this.textModule.getDisplayText();
    }
  }
  class OpmLogicalStateEllipsis {
    constructor() {
      this.name = "Opm.StateEllipsis";
      this.text = "...";
      this.visualElements = new Array();
    }
    getDisplayText() {
      return "...";
    }
    setParams(params) {
      // We make no use of it. And remove it evantualy.
    }
    createVisual(parent) {
      const drawn = new OpmEllipsis();
      const visual = new OpmVisualEllipsis(drawn.getParams(), this);
      visual.fatherObject = parent;
      this.visualElements.push(visual);
      return visual;
    }
    remove(visual) {
      this.visualElements.filter(v => v !== visual);
    }
  }

  /***/
}),
/***/29007: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    _: () => (/* binding */OpmLogicalThing)
  });
