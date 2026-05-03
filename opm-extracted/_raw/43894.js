// EXPORTS

// EXTERNAL MODULE: ./src/app/models/LogicalPart/OpmLogicalElement.ts
var OpmLogicalElement = require("./31119.js");
// EXTERNAL MODULE: ./src/app/models/VisualPart/OpmVisualEntity.ts
var OpmVisualEntity = require("./87602.js");
; // CONCATENATED MODULE: ./src/app/models/LogicalPart/LogicalTextModule.ts
class BasicNameModule {
  constructor(formatter) {
    this.formatter = formatter;
    this.name = "";
    this.autoFormatting = true;
  }
  shouldAutoFormat(val) {
    this.autoFormatting = val;
  }
  isAutoFormat() {
    return this.autoFormatting;
  }
  formatText(val) {
    return this.formatter(val);
  }
  setText(val) {
    // TODO: Add some validation function
    val = val.trim();
    if (val.length == 0) {
      return;
    }
    if (this.autoFormatting) {
      this.name = this.formatter(val);
      return;
    }
    this.name = val;
  }
  getText() {
    return this.name;
  }
}
class BasicLogicalTextModule {
  constructor(name) {
    this.name = name;
    this.modules = new Array();
  }
  getDisplayText() {
    const ret = [];
    const modules = this.getActiveModules();
    modules.filter(m => m.getPriority() < 0).forEach(mdl => ret.push(mdl.getText()));
    ret.push(this.name.getText());
    modules.filter(m => m.getPriority() > 0).forEach(mdl => ret.push(mdl.getText()));
    return ret.join(" ").trim();
  }
  getName() {
    return this.name.getText();
  }
  // Set name only from input. Other modules are set directly currently.
  updateFromInput(text) {
    this.updateNameFromInput(text);
  }
  addTextualModules(...modules) {
    this.modules.push(...modules);
  }
  updateNameFromInput(text) {
    if (!text) {
      return;
    }
    let name = this.removeSpecialChars(text);
    const addOn = this.getAddOnText();
    if (addOn.length > 0) {
      const addOnIndex = name.indexOf(addOn);
      if (addOnIndex >= 0) {
        name = text.substr(0, addOnIndex - 1).trim();
      }
    }
    this.name.setText(name);
  }
  getAddOnText() {
    return this.modules.filter(m => m.isTextActive()).map(m => m.getText()).join(" ").trim();
  }
  getActiveModules() {
    let ret = this.modules.filter(m => m.isTextActive());
    ret = ret.sort(function (a, b) {
      if (a.getPriority() > b.getPriority()) {
        return 1;
      } else {
        return -1;
      }
    });
    return ret;
  }
  removeSpecialChars(text) {
    return text.split(String.fromCharCode(160)).join(String.fromCharCode(32)).split(String.fromCharCode(10)).join(String.fromCharCode(32));
  }
  getNameModule() {
    return this.name;
  }
}
// EXTERNAL MODULE: ./src/app/models/LogicalPart/OpmRelation.ts
var OpmRelation = require("./15718.js");
// EXTERNAL MODULE: ./src/app/configuration/rappidEnviromentFunctionality/shared.ts + 1 modules
var shared = require("./1185.js");
// EXTERNAL MODULE: ./src/app/models/ConfigurationOptions.ts
var ConfigurationOptions = require("./13641.js");
; // CONCATENATED MODULE: ./src/app/models/LogicalPart/OpmLogicalEntity.ts
export class r extends OpmLogicalElement /* OpmLogicalElement */.s {
  constructor(params, model) {
    super(params, model);
    this.textModule = new BasicLogicalTextModule(new BasicNameModule(this.getTextFormatter()));
    this.orderedFundamentalTypes = [];
    this.description = "";
    if (params && typeof params.description === "string") {
      this.description = params.description;
    }
    this.getNameModule().shouldAutoFormat(this.opmModel.getOplService()?.settings?.autoFormat);
  }
  isValidName(value) {
    return true;
  }
  setDescription(description) {
    if (description !== undefined && description !== null) {
      this.description = description;
    }
  }
  getDescription() {
    return this.description || "";
  }
  updateParams(params) {
    super.updateParams(params);
    this.getNameModule().shouldAutoFormat(params.isAutoFormat == undefined ? this.opmModel.getOplService()?.settings?.autoFormat : params.isAutoFormat);
    this.text = params.text;
    if (params && params.orderedFundamentalTypes) {
      this.orderedFundamentalTypes = params.orderedFundamentalTypes;
    }
    if (params?.hasOwnProperty("protectedFromBeingRefinedBySubModel")) {
      this.protectedFromBeingRefinedBySubModel = params.protectedFromBeingRefinedBySubModel;
    }
    if (!!params && typeof params.description === "string") {
      this.description = params.description;
    }
  }
  setParams(params) {
    super.setParams(params);
    // this.text = params.text;
    if (!!params && typeof params.description === "string") {
      this.description = params.description;
    }
  }
  getEntityParams() {
    const params = {
      text: this.getBareName(),
      isAutoFormat: this.getNameModule().isAutoFormat(),
      description: this.description,
      orderedFundamentalTypes: this.orderedFundamentalTypes,
      protectedFromBeingRefinedBySubModel: this.protectedFromBeingRefinedBySubModel
    };
    return {
      ...super.getElementParams(),
      ...params
    };
  }
  getIsWaitingProcess() {
    return false;
  }
  get _text() {
    return this.textModule.getDisplayText();
  }
  updateTextFromView(text) {
    this.textModule.updateFromInput(text);
  }
  getNameModule() {
    return this.textModule.getNameModule();
  }
  set text(text) {
    this.updateTextFromView(text);
  }
  setText(text) {
    this.textModule.updateFromInput(text);
  }
  getBelongsToStereotyped() {
    return undefined;
  }
  isAutoFormat() {
    return this.textModule.getNameModule().isAutoFormat();
  }
  toggleAutoFormat() {
    const name = this.textModule.getNameModule();
    const auto_format = name.isAutoFormat();
    if (auto_format == true) {
      name.shouldAutoFormat(false);
      return {
        isAutoFormat: false
      };
    }
    const new_text = name.formatText(name.getText());
    name.shouldAutoFormat(true);
    name.setText(new_text);
    return {
      isAutoFormat: true,
      name: new_text
    };
  }
  getTextFormatter() {
    return text => {
      return text.split(/\s+/).map(s => {
        if (s.toLowerCase() == "and" && text.toLowerCase().includes("and ")) {
          return "&";
        }
        return s.charAt(0).toUpperCase() + s.substring(1).toLowerCase();
      }).join(" ");
    };
  }
  getDisplayText() {
    return this.textModule.getDisplayText();
  }
  get text() {
    return this.getDisplayText();
  }
  isSatisfiedRequirementSetObject() {
    return false;
  }
  isSatisfiedRequirementObject() {
    return false;
  }
  getBareName() {
    return this.textModule.getName();
  }
  getEntityParamsFromJsonElement(jsonElement) {
    const params = {
      text: jsonElement.text,
      isAutoFormat: jsonElement.isAutoFormat,
      URLarray: jsonElement.URLarray,
      // from json URL saving
      orderedFundamentalTypes: jsonElement.orderedFundamentalTypes,
      protectedFromBeingRefinedBySubModel: jsonElement.protectedFromBeingRefinedBySubModel
    };
    return {
      ...super.getElementParamsFromJsonElement(jsonElement),
      ...params
    };
  }
  hasFather() {
    for (const vis of this.visualElements) {
      if (vis.fatherObject) {
        return true;
      }
    }
    return false;
  }
  getFather() {
    for (const vis of this.visualElements) {
      if (vis.fatherObject) {
        return vis.fatherObject.logicalElement;
      }
    }
    return undefined;
  }
  getChildren() {
    const arr = [];
    for (const vis of this.visualElements) {
      if (vis.children) {
        arr.push(...vis.children.map(ch => ch.logicalElement));
      }
    }
    return (0, shared /* removeDuplicationsInArray */.vN)(arr);
  }
  getChildrenDeep() {
    const arr = [];
    for (const vis of this.visualElements) {
      if (vis.children) {
        arr.push(...vis.children.map(ch => ch.logicalElement));
        for (const child of vis.children) {
          if (child.logicalElement.lid !== this.lid) {
            arr.push(...child.logicalElement.getChildrenDeep());
          }
        }
      }
    }
    return arr;
  }
  getChildrenDeepIncludingAggregation(type) {
    const arr = [];
    for (const vis of this.visualElements) {
      if (vis.children) {
        const onlyProcesses = type === "process";
        const relevantChildren = shared /* OPCloudUtils */.e2.filterArrayByType(vis.children, onlyProcesses, !onlyProcesses, !onlyProcesses);
        arr.push(...relevantChildren.map(ch => ch.logicalElement));
        for (let child of relevantChildren) {
          arr.push(...child.logicalElement.getChildrenDeepIncludingAggregation(type));
        }
      }
      const aggregationChildren = [];
      vis.getLinks().outGoing.filter(l => l.type === ConfigurationOptions /* linkType */.h6.Aggregation).forEach(link => {
        aggregationChildren.push(link.target);
        if (shared /* OPCloudUtils */.e2.isInstanceOfVisualState(link.target)) {
          const father = link.target.fatherObject;
          for (const state of father.states || []) {
            if (!aggregationChildren.includes(state) && state.getLinks().outGoing.find(lnk => lnk.type === ConfigurationOptions /* linkType */.h6.Aggregation)) {
              aggregationChildren.push(state);
            }
          }
        }
      });
      for (const child of aggregationChildren) {
        arr.push(child.logicalElement);
        arr.push(...child.logicalElement.getChildrenDeepIncludingAggregation(type));
      }
    }
    return (0, shared /* removeDuplicationsInArray */.vN)(arr);
  }
  isRefineable() {
    const is = this.visualElements.find(vis => vis.children.filter(c => c instanceof OpmVisualEntity /* OpmVisualEntity */.e).length > 0);
    return !!is; // ? true : false;
  }
  getLinks() {
    const inGoing = [];
    const outGoing = [];
    for (const log of this.opmModel.logicalElements) {
      if (log.isLink()) {
        if (log.sourceLogicalElement === this) {
          outGoing.push(log);
        }
        if (log.targetLogicalElements[0] === this) {
          inGoing.push(log);
        }
      }
    }
    return {
      inGoing: inGoing,
      outGoing: outGoing
    };
  }
  getLinksWith(other) {
    const inGoing = [];
    const outGoing = [];
    for (const log of this.opmModel.logicalElements) {
      if (log instanceof OpmRelation /* OpmRelation */.v) {
        if (log.sourceLogicalElement === this && log.targetLogicalElements[0] === other) {
          outGoing.push(log);
        }
        if (log.targetLogicalElements[0] === this && log.sourceLogicalElement === other) {
          inGoing.push(log);
        }
      }
    }
    return {
      inGoing: inGoing,
      outGoing: outGoing
    };
  }
  hasRequirements() {
    return false;
  }
  getAncestorExhibitions(ret = []) {
    const inLinks = this.getLinks().inGoing.filter(l => l.linkType === ConfigurationOptions /* linkType */.h6.Exhibition);
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
/***/