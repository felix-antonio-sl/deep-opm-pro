// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/LogicalPart/OpmLogicalEntity.ts
// Extracted by opm-extracted/tools/extract.mjs

  class OpmLogicalEntity extends OpmLogicalElement {
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
      return (0, removeDuplicationsInArray)(arr);
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
          const relevantChildren = OPCloudUtils.filterArrayByType(vis.children, onlyProcesses, !onlyProcesses, !onlyProcesses);
          arr.push(...relevantChildren.map(ch => ch.logicalElement));
          for (let child of relevantChildren) {
            arr.push(...child.logicalElement.getChildrenDeepIncludingAggregation(type));
          }
        }
        const aggregationChildren = [];
        vis.getLinks().outGoing.filter(l => l.type === linkType.Aggregation).forEach(link => {
          aggregationChildren.push(link.target);
          if (OPCloudUtils.isInstanceOfVisualState(link.target)) {
            const father = link.target.fatherObject;
            for (const state of father.states || []) {
              if (!aggregationChildren.includes(state) && state.getLinks().outGoing.find(lnk => lnk.type === linkType.Aggregation)) {
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
      return (0, removeDuplicationsInArray)(arr);
    }
    isRefineable() {
      const is = this.visualElements.find(vis => vis.children.filter(c => c instanceof OpmVisualEntity).length > 0);
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
        if (log instanceof OpmRelation) {
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
      const inLinks = this.getLinks().inGoing.filter(l => l.linkType === linkType.Exhibition);
      for (const link of inLinks) {
        const source = link.sourceLogicalElement;
        if (ret.includes(source)) {
          continue;
        }
        ret.push(source);
        if (OPCloudUtils.isInstanceOfLogicalState(source)) {
          ret.push(source.getFather());
          source.getFather().getAncestorExhibitions(ret);
        }
        source.getAncestorExhibitions(ret);
      }
      return ret;
    }
  }

  /***/
}),
/***/2839: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    b: () => (/* binding */OpmLogicalObject)
  });
