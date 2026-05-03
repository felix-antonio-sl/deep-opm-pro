// EXPORTS

// EXTERNAL MODULE: ./src/app/models/LogicalPart/OpmLogicalEntity.ts + 1 modules
var OpmLogicalEntity = require("./43894.js");
// EXTERNAL MODULE: ./src/app/models/VisualPart/OpmVisualState.ts + 3 modules
var OpmVisualState = require("./14898.js");
; // CONCATENATED MODULE: ./src/app/models/VisualPart/OpmVisualEllipsis.ts
class OpmVisualEllipsis {
  constructor(params, logicalElement) {
    this.logicalElement = logicalElement;
    if (params) {
      this.id = params.id;
      this.setParams(params);
    }
  }
  setParams(params) {
    this.width = params.width;
    this.height = params.height;
    this.xPos = params.xPos;
    this.yPos = params.yPos;
  }
  express(checked) {
    return this.fatherObject.expressChecked(checked);
  }
  remove() {
    this.logicalElement.remove(this);
    return this;
  }
  getMissingStates() {
    const logStatesNames = this.fatherObject.logicalElement.states.map(s => s.getBareName());
    const visStatesNames = this.fatherObject.states.map(s => s.logicalElement.getBareName());
    return logStatesNames.filter(s => !visStatesNames.includes(s));
  }
  setDefaultPosition() {
    const padding = 10;
    this.xPos = this.fatherObject.xPos + this.fatherObject.width - this.width - padding;
    this.yPos = this.fatherObject.yPos + this.fatherObject.height - this.height - padding;
    const between = function (a, b, c) {
      return a <= b && b <= c;
    };
    const intersect = function (ellipsis, state) {
      return (between(state.xPos, ellipsis.xPos, state.xPos + state.width) || between(state.xPos, ellipsis.xPos + ellipsis.xPos + ellipsis.width, state.xPos + state.width)) && (between(state.yPos, ellipsis.yPos, state.yPos + state.height) || between(state.yPos, ellipsis.yPos + ellipsis.height, state.yPos + state.height));
    };
    const intersect_cell = this.fatherObject.states.find(state => intersect(this, state));
    if (intersect_cell) {
      const padding = 10;
      this.xPos = intersect_cell.xPos + intersect_cell.width + padding;
      this.fatherObject.width += this.width + padding;
    }
    return this;
  }
  getDisplayText() {
    return this.logicalElement.getDisplayText();
  }
}
// EXTERNAL MODULE: ./src/app/models/DrawnPart/EllipsisState.ts
var EllipsisState = require("./81499.js");
// EXTERNAL MODULE: ./src/app/models/DrawnPart/OpmState.ts
var OpmState = require("./14168.js");
// EXTERNAL MODULE: ./src/app/models/LogicalPart/components/TimeDurationModule.ts
var TimeDurationModule = require("./34588.js");
// EXTERNAL MODULE: ./src/app/models/LogicalPart/components/time-duration-units.ts
var time_duration_units = require("./45235.js");
// EXTERNAL MODULE: ./src/app/opl-generation/opl-database.ts
var opl_database = require("./68784.js");
; // CONCATENATED MODULE: ./src/app/models/LogicalPart/OpmLogicalState.ts
export class p extends OpmLogicalEntity /* OpmLogicalEntity */.r {
  constructor(params, model) {
    super(params, model);
    this.duration = new TimeDurationModule /* TimeDurationModule */.E();
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
        units: params.units != null && params.units !== "" ? params.units : time_duration_units /* DEFAULT_TIME_DURATION_UNIT */.SV,
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
        units: params.units != null && params.units !== "" ? params.units : time_duration_units /* DEFAULT_TIME_DURATION_UNIT */.SV,
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
    return new OpmVisualState /* OpmVisualState */.y(param, this);
  }
  createVisualState(parent, param) {
    if (!param) {
      const drawn = new OpmState /* OpmState */.g(this.text);
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
          const displayDigitsNum = this.opmModel.getOplService()?.settings?.numericComputationalDigits !== undefined ? this.opmModel.getOplService()?.settings?.numericComputationalDigits : opl_database /* defaultSettings */.L6.user.numericComputationalDigits;
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
export class u {
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
    const drawn = new EllipsisState /* OpmEllipsis */.U();
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