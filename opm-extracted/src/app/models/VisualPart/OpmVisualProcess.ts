// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/VisualPart/OpmVisualProcess.ts
// Extracted by opm-extracted/tools/extract.mjs

  const uuid = joint.util.uuid;
  class OpmVisualProcess extends OpmVisualThing {
    get type() {
      return EntityType.Process;
    }
    constructor(params, logicalElement) {
      super(params, logicalElement);
      this.hasConcreteSelfInvocations = false;
    }
    updateParams(params) {
      super.updateParams(params);
      this.hasConcreteSelfInvocations = !!params.hasConcreteSelfInvocations;
    }
    setDefaultStyleFields() {
      super.setDefaultStyleFields();
      this.strokeColor = "#3BC3FF";
    }
    setParams(params) {
      super.setParams(params);
      this.hasConcreteSelfInvocations = !!params.hasConcreteSelfInvocations;
    }
    getParams() {
      const params = {
        refineableId: this.refineable ? this.refineable.id : null,
        refineeInzoomingId: this.refineeInzooming ? this.refineeInzooming.id : null,
        refineeUnfoldingId: this.refineeUnfolding ? this.refineeUnfolding.id : null
      };
      return {
        ...super.getThingParams(),
        ...params
      };
    }
    connectRefinementElements(id, type) {
      if (type === "in-zoom") {
        this.logicalElement.findVisualElement(id).refineeInzooming = this;
      } else {
        this.logicalElement.findVisualElement(id).refineeUnfolding = this;
      }
      this.refineable = this.logicalElement.findVisualElement(id);
    }
    getParamsFromJsonElement(jsonElement) {
      const params = {};
      return {
        ...super.getThingParamsFromJsonElement(jsonElement),
        ...params
      };
    }
    // in case instead of a reference to an object there is a string (representing object's id),
    // replace the id with the reference to object
    // updateComplexityReferences() {
    //   if (typeof this.refineable === 'string') {
    //     this.refineable = this.logicalElement.opmModel.getVisualElementById(this.refineable);
    //   }
    //   if (typeof this.refineeInzooming === 'string') {
    //     this.refineeInzooming = this.logicalElement.opmModel.getVisualElementById(this.refineeInzooming);
    //   }
    //   if (typeof this.refineeUnfolding === 'string') {
    //     this.refineeUnfolding = this.logicalElement.opmModel.getVisualElementById(this.refineeUnfolding);
    //   }
    // }
    resetColors() {
      this.strokeColor = "#3BC3FF";
    }
    clone() {
      const params = this.getParams();
      delete params.semiFolded;
      delete params.foldedUnderThing;
      const clonedProcess = this.logicalElement.createVisual(params);
      clonedProcess.setNewUUID();
      return clonedProcess;
    }
    //TODO:Alon
    getHaloHandles() {
      if (!this.isTimeDuration()) {
        return [...super.getHaloHandles(), "styling", "timeDurationFunction"];
      } else {
        return [...super.getHaloHandles(), "styling", "timeDurationFunction"];
        //return [...super.getHaloHandles(), 'styling','timeDurationFunction', 'timeDurationDeleteFunction'];
      }
    }
    calculateMinHeight() {
      const semiItemsLength = this.semiFolded.length;
      const paddingBottom = 10;
      // const paddingTop = Math.max(20, this.height * 0.1) + 20;
      const textBreak = joint.util.breakText;
      const lines = textBreak(this.logicalElement.text, {
        width: this.width - 40
      }).split("\n").length;
      const fontSize = this.textFontSize || 14;
      // let paddingTop = Math.max(20, this.height * 0.1) + 10;
      const paddingTop = 20 + lines * fontSize;
      const semiHeight = 25;
      const paddingBetween = 8;
      return paddingTop + paddingBottom + semiItemsLength * semiHeight + paddingBetween * (semiItemsLength - 1);
    }
    calculateMinWidth() {
      const semiItemsLength = this.semiFolded.length;
      if (semiItemsLength === 0) {
        return 135;
      }
      const paddingleft = 15;
      const paddingRight = 15;
      const semiWidth = Math.max(...this.semiFolded.map(sm => isNaN(sm.width) ? 140 : sm.width));
      return paddingleft + paddingRight + semiWidth;
    }
    arrangeInnerSemiFoldedThings() {
      const model = this.logicalElement.opmModel;
      this.semiFolded = this.semiFolded.sort(model.sortFoldedFundamentalRelations.bind(model));
      const semiItemsLength = this.semiFolded.length;
      const paddingBottom = this.height * 0.07 + 15;
      // const paddingTop = Math.max(20, this.height * 0.1) + 10;
      const textBreak = joint.util.breakText;
      const lines = textBreak(this.logicalElement.text, {
        width: this.width - 40
      }).split("\n").length;
      const fontSize = this.textFontSize || 14;
      // let paddingTop = Math.max(20, this.height * 0.1) + 10;
      let paddingTop = 20 + lines * fontSize;
      const totalSpace = this.height - paddingBottom - paddingTop;
      const semiHeight = 25;
      let paddingBetween = -5;
      if (semiItemsLength > 1) {
        paddingBetween = (totalSpace - semiItemsLength * semiHeight) / semiItemsLength;
      }
      this.refY = Math.max(25, lines * fontSize / 2 + 20);
      // const paddingBetween = 10;
      const maxSemiWidth = Math.max(...this.semiFolded.map(sm => isNaN(sm.width) ? 140 : sm.width));
      const ordered = this.getSemifoldedThingsOrdered();
      for (const semi of ordered) {
        const isFirst = ordered.indexOf(semi) === 0 ? 0 : 1;
        // semi.yPos = paddingTop + (ordered.indexOf(semi) * (semiHeight + paddingBetween * isFirst));
        semi.yPos = paddingTop + paddingBetween + ordered.indexOf(semi) * (semiHeight + paddingBetween * isFirst);
        if (ordered.length === 1) {
          semi.yPos = paddingTop + totalSpace / 2 - 15;
        }
        semi.xPos = (this.width - maxSemiWidth) / 2;
      }
    }
    getPortDataForSelfInvocationInzoomed() {
      const id = uuid();
      const portData = {
        id: id,
        group: "aaa",
        args: {
          x: 0.8,
          y: 0.9
        },
        markup: [{
          tagName: "circle",
          attributes: {
            stroke: "transparent",
            fill: "transparent",
            r: 2,
            width: 2,
            height: 2,
            magnet: "true"
          }
        }]
      };
      return portData;
    }
    getCommandsDecider() {
      return new ProcessCommandsDecider();
    }
    canUseUserInput() {
      return this.getAllLinks().inGoing.find(l => l.type === linkType.Agent);
    }
  }

  /***/
}),
/***/14898: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    y: () => (/* binding */OpmVisualState)
  });
