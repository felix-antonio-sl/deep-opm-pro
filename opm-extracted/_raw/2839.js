// EXPORTS

// EXTERNAL MODULE: ./src/app/models/LogicalPart/OpmLogicalThing.ts + 4 modules
var OpmLogicalThing = require("./29007.js");
// EXTERNAL MODULE: ./src/app/models/VisualPart/OpmVisualObject.ts + 8 modules
var OpmVisualObject = require("./86922.js");
// EXTERNAL MODULE: ./src/app/models/ConfigurationOptions.ts
var ConfigurationOptions = require("./13641.js");
// EXTERNAL MODULE: ./src/app/models/LogicalPart/OpmLogicalState.ts + 1 modules
var OpmLogicalState = require("./71252.js");
// EXTERNAL MODULE: ./src/app/models/DrawnPart/OpmState.ts
var OpmState = require("./14168.js");
// EXTERNAL MODULE: ./src/app/models/VisualPart/OpmFundamentalLink.ts
var OpmFundamentalLink = require("./59390.js");
// EXTERNAL MODULE: ./node_modules/jointjs/src/util/util.mjs
var util = require("./28258.js");
// EXTERNAL MODULE: ./src/app/models/LogicalPart/OpmFundamentalRelation.ts
var OpmFundamentalRelation = require("./811.js");
// EXTERNAL MODULE: ./src/app/models/model/entities.enum.ts
var entities_enum = require("./63877.js");
// EXTERNAL MODULE: ./src/app/models/modules/attribute-validation/validation-module.ts + 5 modules
var validation_module = require("./26692.js");
; // CONCATENATED MODULE: ./src/app/models/LogicalPart/components/computation-module.ts

// an object indicating if the object is computational or not
class ComputationModule {
  constructor() {
    this.valueType = ConfigurationOptions /* valueType */._x.None;
    this.value = undefined;
    this.validationModule = new validation_module /* ValidationModule */.i();
  }
  isActive() {
    return this.valueType !== "None" && this.valueType !== ConfigurationOptions /* valueType */._x.None && this.valueType !== undefined && this.valueType !== null;
  }
  remove() {
    this.value = undefined;
    this.valueType = ConfigurationOptions /* valueType */._x.None;
  }
  setValue(value) {
    if (this.validationModule.validateValue(value)) {
      this.value = value;
    }
  }
  hasRange() {
    return this.validationModule.isActive();
  }
  setRange(type, range, stereotypeValidator) {
    const ret = this.validationModule.setRange(type, range, stereotypeValidator);
    if (ret.wasSet) {
      return {
        wasSet: true
      };
    }
    return {
      wasSet: false,
      errors: ret.errors
    };
  }
  removeRange() {
    this.validationModule.removeRange();
  }
  getRange() {
    return this.validationModule.getRange();
  }
}
// EXTERNAL MODULE: ./src/app/configuration/rappidEnviromentFunctionality/shared.ts + 1 modules
var shared = require("./1185.js");
; // CONCATENATED MODULE: ./src/app/models/LogicalPart/components/aliasing-module.ts

class AliasingModule {
  constructor(computation) {
    this.computation = computation;
  }
  getText() {
    if (this.isActive()) {
      return "{" + (this.alias || "") + "}";
    } else {
      return "";
    }
  }
  isTextActive() {
    // show alias (even if it is empty) if the object computational, otherwise show only if exists.
    return this.isActive() || this.computation.isActive();
  }
  isActive() {
    const aliasCondition = this.alias !== null && this.alias !== undefined && this.alias !== "None" && this.alias !== "";
    // tslint:disable-next-line:max-line-length
    const userSelectAlias = (0, shared /* getInitRappidShared */.Km)()?.oplService?.settings?.aliasOpt || "Show only when applicable";
    // const aliasSettingsBool = (userSelectAlias === 'Show only when applicable' || userSelectAlias === 'Always show alias');
    const computational = this.computation.isActive();
    const computationalCondition = (userSelectAlias === "Show only when applicable" && aliasCondition || userSelectAlias === "Always show alias") && computational;
    const nonComputationalCondition = !computational && aliasCondition;
    return computationalCondition || nonComputationalCondition;
  }
  getPriority() {
    return 3;
  }
}
; // CONCATENATED MODULE: ./src/app/models/LogicalPart/components/units-text-module.ts

class UnitsTextModule {
  constructor(computation) {
    this.units = undefined;
    this.computation = computation;
  }
  getText() {
    const unitsToWrite = this.units && this.units !== "None" ? this.units : "";
    if (this.isActive()) {
      return "[" + unitsToWrite + "]";
    } else {
      return "";
    }
  }
  isTextActive() {
    return this.isActive();
  }
  isActive() {
    //return (this.units !== undefined && this.units !== null);
    const unitsCondition = this.units !== null && this.units !== undefined && this.units !== "None" && this.units !== "";
    const userSelection = (0, shared /* getInitRappidShared */.Km)()?.oplService?.settings?.unitsOpt || "Show only when applicable";
    const unitsSettingsBool = userSelection === "Show only when applicable" || userSelection === "Always show units";
    const computational = this.computation.isActive();
    return (userSelection === "Always show units" || unitsCondition && userSelection === "Show only when applicable") && computational;
  }
  getPriority() {
    return 2; // to appear before the alias
  }
}
; // CONCATENATED MODULE: ./src/app/models/LogicalPart/OpmLogicalObject.ts

var uuid = util /* uuid */.uR;
export let b = /*#__PURE__*/(() => {
  class OpmLogicalObject extends OpmLogicalThing /* OpmLogicalThing */._ {
    static #_ = (() => this.logicalCounter = 1)();
    static resetLogicalCounter() {
      OpmLogicalObject.logicalCounter = 1;
    }
    constructor(params, model) {
      super(params, model);
      this.computationModule = new ComputationModule();
      this.aliasModule = new AliasingModule(this.computationModule);
      this.unitsModule = new UnitsTextModule(this.computationModule);
      this.states_ = new Array();
      this.ellipsis_ = new OpmLogicalState /* OpmLogicalStateEllipsis */.u();
      OpmLogicalObject.logicalCounter++;
      // this.textModule.addTextualModules(this.computation);
      this.textModule.addTextualModules(this.aliasModule);
      this.textModule.addTextualModules(this.unitsModule);
    }
    removeAllStates() {
      this.states_.length = 0;
      this.ellipsis_.visualElements.length = 0;
    }
    // getters and setters
    get computation() {
      return this.computationModule;
    }
    get valueType() {
      return this.computationModule.valueType;
    }
    set valueType(valueType) {
      this.computationModule.valueType = valueType;
      // this._valueType = valueType;
    }
    get value() {
      return this.computationModule.value;
    }
    set alias(value) {
      this.aliasModule.alias = value;
    }
    setValue(value) {
      const validation = this.getValidationModule();
      if (validation.isActive() && validation.validateValue(value) == false) {
        if (this.opmModel.shouldAllowInvalidValueAtExecutionTime() == false) {
          return false;
        }
      }
      this.value = value;
      return true;
    }
    set value(value) {
      this.computationModule.value = value;
    }
    get units() {
      // TODO: The value NONE should not be special or treted diferently.
      if (this.unitsModule.units == "None") {
        return "";
      } else {
        return this.unitsModule.units;
      }
    }
    set units(units) {
      this.unitsModule.units = units;
      // this._units = units;
    }
    get states() {
      return this.states_.sort((a, b) => this.opmModel.logicalElements.indexOf(a) - this.opmModel.logicalElements.indexOf(b));
    }
    get ellipsis() {
      return this.ellipsis_;
    }
    get alias() {
      let temp = "" + this.text;
      const hasInstance = temp.indexOf("{Instances: ");
      if (hasInstance !== -1) {
        const endInsIdx = temp.indexOf("}", hasInstance);
        const toRemove = temp.slice(hasInstance, endInsIdx + 1);
        temp = temp.replace(toRemove, "");
      }
      const indexOfStartAlias = temp.indexOf("{");
      const indexOfEndAlias = temp.indexOf("}");
      if (indexOfStartAlias > 0 && indexOfEndAlias > 0 && indexOfEndAlias > indexOfStartAlias) {
        return temp.substring(indexOfStartAlias + 1, indexOfEndAlias).trim();
      }
      return this.aliasModule.alias;
    }
    setParams(params) {
      super.setParams(params);
      if (params?.alias) {
        this.alias = params.alias;
      }
    }
    // needed for computational part
    getName() {
      if (this.valueType === ConfigurationOptions /* valueType */._x.None && this.value === "None") {
        return this.text;
      } else {
        let indexOfStartUnits = this.text.lastIndexOf("[");
        if (indexOfStartUnits <= 0) {
          indexOfStartUnits = this.text.length;
        }
        return this.text.substring(0, indexOfStartUnits).trim();
      }
    }
    createVisual(params) {
      return new OpmVisualObject /* OpmVisualObject */.I(params, this);
    }
    createState() {
      const text = "state" + (this.states_.length + 1);
      const drawn = new OpmState /* OpmState */.g(text); // TODO: Should be changed to a const default value.
      const logical = this.opmModel.logicalFactory(entities_enum /* EntityType */.c.State, drawn.getParams());
      logical.text = text;
      logical.parent = this;
      this.states_.push(logical);
      this.opmModel.currentOpd.add(logical.visualElements[0]);
      return logical;
    }
    removeState(state) {
      for (let i = this.states_.length - 1; i >= 0; i--) {
        if (state === this.states_[i]) {
          this.states_.splice(i, 1);
          return;
        }
      }
    }
    updateParams(params) {
      super.updateParams(params);
      this.valueType = params.valueType;
      this.value = params.value;
      this.units = params.units;
      this.alias = params.alias;
      if (params.validation && params.validation.attribute) {
        // TODO: pay attention.
        let stereotypeValidator;
        const stereotypeEquivalentLogical = this.opmModel.getEquivalentLogicalThingFromStereotype(this.equivalentFromStereotypeLID);
        stereotypeValidator = stereotypeEquivalentLogical?.getValidationModule().getValidator();
        this.getValidationModule().setRange(params.validation.attribute.type, params.validation.attribute.range, stereotypeValidator);
      }
      if (params.text) {
        this.extractDataFromText(params.text);
      }
    }
    extractDataFromText(text) {
      // alias
      const start = text.lastIndexOf("{");
      const end = text.lastIndexOf("}");
      if (start > 0 && end > 0) {
        this.alias = text.substring(start + 1, end);
      }
      this.text = text;
      this.getNameModule().setText(text);
    }
    getParams() {
      const visualElementsParams = [];
      for (let i = 0; i < this.visualElements.length; i++) {
        visualElementsParams.push(this.visualElements[i].getParams());
      }
      const states = [];
      for (let i = 0; i < this.states_.length; i++) {
        if (this.states_[i].visualElements.length === 0) {
          states.push(this.states_[i].getParams());
        }
      }
      const params = {
        valueType: this.valueType,
        value: this.value,
        units: this.units,
        visualElementsParams: visualElementsParams,
        statesWithoutVisual: states,
        alias: this.alias,
        validation: this.computationModule.validationModule.toJson(),
        valuedObjectForId: this.valuedObjectFor ? this.valuedObjectFor.lid : undefined
      };
      return {
        ...super.getThingParams(),
        ...params
      };
    }
    getParamsFromJsonElement(jsonElement) {
      const params = {
        valueType: jsonElement.valueType === "None" ? ConfigurationOptions /* valueType */._x.None : jsonElement.valueType,
        value: jsonElement.value,
        units: jsonElement.units,
        alias: jsonElement.alias,
        statesWithoutVisual: jsonElement.statesWithoutVisual ? jsonElement.statesWithoutVisual : []
      };
      return {
        ...super.getThingParamsFromJsonElement(jsonElement),
        ...params
      };
    }
    // TODO: Remove after refactoring OpmModel.
    concatToStates(array) {
      array.forEach(e => this.states_.push(e));
    }
    createLogicalAndVisualState(parent) {
      const state = this.createState();
      //const visual = state.createVisual(parent);
      const visual = state.visualElements[0];
      visual.fatherObject = parent;
      return visual;
    }
    createVisualState(object, state) {
      if (!this.states_.find(s => s === state)) {
        return undefined;
      }
      return state.createVisualState(object);
    }
    get counter() {
      return OpmLogicalObject.logicalCounter;
    }
    getNumberedName() {
      return "Object " + this.counter;
    }
    toggleLetter(letter) {
      return letter.toUpperCase();
    }
    toggleCapitalize(text) {
      for (let i = 0; i < text.length; i++) {
        // capitalize the first letter of the first word and each word after a space or an enter
        if (i === 0) {
          text = this.toggleLetter(text.charAt(i)) + text.substr(i + 1, text.length);
        } else if (text.charAt(i - 1) === " " || text.charAt(i - 1) === "\n") {
          text = text.substr(0, i) + this.toggleLetter(text.charAt(i)) + text.substr(i + 1, text.length);
        }
      }
      return text;
    }
    deStating() {
      this.opmModel.logForUndo("Destate " + this.text);
      const logObjectsofStates = [];
      const logicalFundamentalRelations = [];
      const newVisualsInCurrentOpd = [];
      const cleanParams = this.getParams();
      delete cleanParams.backgroundImageUrl;
      // create new logical object for every logical state
      for (let j = 0; j < this.states.length; j++) {
        const logObjectOfState = this.opmModel.logicalFactory(entities_enum /* EntityType */.c.Object, cleanParams);
        logObjectOfState.lid = uuid();
        logObjectOfState.URLarray = this.states[j].URLarray;
        // delete the automatically created visual object
        logObjectOfState.removeVisual(logObjectOfState.visualElements[0]);
        logObjectOfState.text = this.toggleCapitalize(this.states[j].text) + " " + this.text;
        logObjectsofStates.push(logObjectOfState);
        const par = {
          linkConnectionType: 1,
          linkType: ConfigurationOptions /* linkType */.h6.Generalization
        };
        const newLogicLink = new OpmFundamentalRelation /* OpmFundamentalRelation */.Q(par, this.opmModel, false);
        newLogicLink.removeVisual(newLogicLink.visualElements[0]);
        newLogicLink.sourceLogicalElement = this;
        newLogicLink.targetLogicalElements = [logObjectOfState];
        logicalFundamentalRelations.push(newLogicLink);
        this.opmModel.add(newLogicLink);
      }
      // go over all opds
      for (let i = 0; i < this.opmModel.opds.length; i++) {
        // filter all visual objects related to our logicalObject
        const allVisualElements = this.opmModel.opds[i].visualElements.filter(elm => elm.logicalElement === this);
        for (let k = 0; k < allVisualElements.length; k++) {
          allVisualElements[k].expressAll();
          if (allVisualElements[k].states.length === allVisualElements[k].children.length) {
            allVisualElements[k].height = 60;
            allVisualElements[k].width = 135;
            allVisualElements[k].textHeight = "80%";
            allVisualElements[k].textWidth = "80%";
            allVisualElements[k].refY = 0.5;
            allVisualElements[k].refX = 0.5;
            allVisualElements[k].xAlign = "middle";
            allVisualElements[k].yAlign = "middle";
          }
          for (let n = 0; n < allVisualElements[k].states.length; n++) {
            // create new visual object for every visual state
            const newVisualObjectOfVisualState = logObjectsofStates[n].createVisual(allVisualElements[k].getParams());
            newVisualObjectOfVisualState.height = 60;
            newVisualObjectOfVisualState.width = 135;
            newVisualObjectOfVisualState.id = uuid();
            newVisualObjectOfVisualState.yPos = allVisualElements[k].yPos + allVisualElements[k].height + newVisualObjectOfVisualState.height * n + (n + 1) * 15;
            newVisualObjectOfVisualState.textHeight = "80%";
            newVisualObjectOfVisualState.textWidth = "80%";
            newVisualObjectOfVisualState.refY = 0.5;
            newVisualObjectOfVisualState.refX = 0.5;
            newVisualObjectOfVisualState.xAlign = "middle";
            newVisualObjectOfVisualState.yAlign = "middle";
            newVisualObjectOfVisualState.refineeInzooming = undefined;
            newVisualObjectOfVisualState.refineable = undefined;
            newVisualObjectOfVisualState.refineeUnfolding = undefined;
            newVisualObjectOfVisualState.strokeWidth = 2;
            this.opmModel.opds[i].add(newVisualObjectOfVisualState);
            const par = {
              id: uuid(),
              linkConnectionType: 1,
              linkType: ConfigurationOptions /* linkType */.h6.Generalization,
              sourceElementId: allVisualElements[k].id,
              targetElementId: newVisualObjectOfVisualState.id
            };
            const newLink = new OpmFundamentalLink /* OpmFundamentalLink */.s(par, logicalFundamentalRelations[n]);
            this.opmModel.opds[i].add(newLink);
            // restore all links
            const allLinks = this.opmModel.opds[i].getThingLinks(allVisualElements[k].states[n].id);
            const inboundLinks = allLinks.filter(link => link.targetVisualElements[0].targetVisualElement.id === allVisualElements[k].children[n].id);
            const outboundLinks = allLinks.filter(link => link.sourceVisualElement.id === allVisualElements[k].children[n].id);
            for (let m = 0; m < inboundLinks.length; m++) {
              inboundLinks[m].targetVisualElements[0].targetVisualElement = newVisualObjectOfVisualState;
              inboundLinks[m].logicalElement.targetLogicalElements = [newVisualObjectOfVisualState.logicalElement];
            }
            for (let m = 0; m < outboundLinks.length; m++) {
              outboundLinks[m].sourceVisualElement = newVisualObjectOfVisualState;
              outboundLinks[m].logicalElement.sourceLogicalElement = newVisualObjectOfVisualState.logicalElement;
            }
            if (this.opmModel.opds[i] === this.opmModel.currentOpd) {
              newVisualsInCurrentOpd.push([allVisualElements[k], newVisualObjectOfVisualState, newLink, inboundLinks, outboundLinks]);
            }
          }
          const counter = allVisualElements[k].states.length;
          for (let n = 0; n < counter; n++) {
            this.opmModel.remove(allVisualElements[k].states[0].id);
            if (this.opmModel.opds[i] === this.opmModel.currentOpd) {
              this.opmModel.currentOpd.remove(allVisualElements[k].states[0].id);
            }
            // Following is necessary as the remove above does not delete the VisualState from VisualObject.children
            allVisualElements[k].removeState(allVisualElements[k].states[0]);
          }
        }
      }
      return newVisualsInCurrentOpd;
    }
    isComputational() {
      return this.computationModule.isActive();
    }
    isTimeDuration() {
      return false;
    }
    getComputationModule() {
      return this.computationModule;
    }
    getValidationModule() {
      return this.computationModule.validationModule;
    }
    hasRange() {
      return this.computationModule.hasRange();
    }
    isValueTyped() {
      return this.valuedObjectFor != undefined;
    }
    isBasicThing() {
      if (this.isValueTyped()) {
        return false;
      }
      return true;
    }
    removeComputation() {
      this.computationModule.remove();
    }
    setReferencesFromJson(json, map) {
      if (json.validation && json.validation.valueTypeElementId) {
        this.getValidationModule().setValueTypeElement(map.get(json.validation.valueTypeElementId));
      }
      if (json.valuedObjectForId) {
        this.valuedObjectFor = map.get(json.valuedObjectForId);
      }
    }
    getValidationStatus() {
      const validation = this.getValidationModule();
      const range = validation.isActive();
      const set = this.value !== "value";
      const valid = validation.validateValue(this.value);
      if (range == false) {
        return "no-range";
      }
      if (set == false) {
        return "value-not-set";
      }
      if (valid == false) {
        return "value-set-invalid";
      }
      return "value-set-valid";
    }
    isSatisfiedRequirementSetObject() {
      return this.hiddenAttributesModule.satisfiedRequirementSetModule.isRequirementSetObject;
    }
    isSatisfiedRequirementObject() {
      return this.hiddenAttributesModule.satisfiedRequirementSetModule.isRequirementObject;
    }
    getAncestorExhibitions(ret = []) {
      const inLinks = this.getLinks().inGoing.filter(l => l.linkType === ConfigurationOptions /* linkType */.h6.Exhibition);
      if (this.states.length) {
        for (const state of this.states) {
          inLinks.push(...state.getLinks().inGoing.filter(l => l.linkType === ConfigurationOptions /* linkType */.h6.Exhibition));
        }
      }
      for (const link of inLinks) {
        const source = link.sourceLogicalElement;
        if (ret.includes(source)) {
          continue;
        }
        ret.push(source);
        if (shared /* OPCloudUtils */.e2.isInstanceOfLogicalState(source)) {
          ret.push(source.getFather());
          source.getFather().getAncestorExhibitions(ret);
        }
        source.getAncestorExhibitions(ret);
      }
      return ret;
    }
  }
  return OpmLogicalObject;
})();
/***/