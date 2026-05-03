// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/VisualPart/OpmVisualState.ts
// Extracted by opm-extracted/tools/extract.mjs

  const params = {
    fatherObjectId: undefined,
    fill: "#ffffff",
    height: 30,
    id: "6b7dfc99-e6b3-4d02-8801-73626a4fe025",
    refX: 0.5,
    refY: 0.5,
    stateType: "none",
    strokeColor: "#808000",
    strokeWidth: undefined,
    text: "state3",
    textColor: "#000000",
    textFontFamily: "Arial, helvetica, sans-serif",
    textFontSize: 14,
    textFontWeight: 300,
    textHeight: "80%",
    textWidth: "80%",
    width: 60,
    xAlign: "middle",
    xPos: 0,
    yAlign: "middle",
    yPos: 0
  };
  class OpmVisualState extends OpmVisualEntity {
    get type() {
      return EntityType.State;
    }
    constructor(params, logicalElement) {
      super(params, logicalElement);
      this.new_val = ""; // For computation show
      if (this.fatherObject && this.fatherObject.children) {
        // need this check for clone(). in case a state already exist in children array it will not be added again
        const sameChild = this.fatherObject.children.filter(element => element.id === this.id)[0];
        if (!sameChild) {
          this.fatherObject.children.push(this);
        }
      }
    }
    getParams() {
      return super.getEntityParams();
    }
    getParamsFromJsonElement(jsonElement) {
      return super.getEntityParamsFromJsonElement(jsonElement);
    }
    setDefaultStyleFields() {
      super.setDefaultStyleFields();
      this.strokeColor = "#808000";
    }
    clone() {
      const clone = this.logicalElement.createVisualState(this.fatherObject, this.getParams());
      clone.updateParams(this.getParams());
      clone.setNewUUID();
      return clone;
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
    isFatherComputational() {
      const father = this.fatherObject;
      return father.isComputational();
    }
    suppress() {
      if (this.canBeSuppressed()) {
        this.fatherObject.updateLastStatesOrder();
        this.fatherObject.removeState(this);
        this.fatherObject.createEllipsis();
        this.logicalElement.removeVisual(this);
        return true;
      }
      return false;
    }
    canBeSuppressed() {
      // Should be: this.attached.length === 0
      return /*!this.logical.valued && */this.logicalElement.opmModel.currentOpd.getThingLinks(this.id).length === 0;
      // return (/*!this.logical.valued && */(<OpmLogicalState>this.logicalElement).opmModel.currentOpd.getThingLinks(this.id)
      //   .filter( l => (l as OpmLink).visible !== false).length === 0);
    }
    getHaloHandles() {
      if (this.isValueTyped()) {
        return [];
      } else if (this.fatherObject.logicalElement.isComputational() && this.isTimeDuration) {
        return ["styling", "timeDurationFunction"];
      } else {
        return [...super.getHaloHandles(), "suppress", "styling", "timeDurationFunction"];
      }
    }
    removeAction() {
      const logical = this.logicalElement;
      const visuals = [].concat(logical.visualElements);
      for (const visual of visuals) {
        if (visual.canBeRemoved() == false) {
          return {
            removed: false
          };
        }
      }
      const elements = new Array();
      for (const visual of visuals) {
        elements.push(...visual.remove());
      }
      logical.parent.removeState(logical);
      logical.opmModel.removeLogicalElement(logical);
      return {
        removed: true,
        elements
      };
    }
    canBeRemoved() {
      return canBeRemoved(this, this.logicalElement);
    }
    remove() {
      const ret = super.remove();
      if (this.fatherObject.states.length === 1) {
        this.fatherObject.statesArrangement = statesArrangement.Bottom;
      }
      return [].concat(ret).concat(remove(this, this.logicalElement));
    }
    setReferencesOnCreate() {}
    isParentComputational() {
      const logical = this.logicalElement;
      const parent = logical.parent;
      return parent && parent.isComputational();
    }
    isFoldedUnderThing() {
      return {
        isFolded: false
      };
    }
    hasRange() {
      const father = this.fatherObject;
      return father.hasRange();
    }
    isValueTyped() {
      const father = this.fatherObject;
      return father.isValueTyped();
    }
    shouldChangeCondition() {
      return this.isParentComputational() == false && this.isValueTyped() == false;
    }
    getHaloCommands() {
      return [];
    }
    getCommandsDecider() {
      return new StateCommandsDecider();
    }
    canModifyText() {
      return this.isValueTyped() == false;
    }
    getValidationView() {
      const logical = this.logicalElement;
      const status = this.getValidationStatus();
      if (logical.opmModel.shouldAllowInvalidValueAtDesignTime()) {
        if (status.status === "value-set-invalid") {
          return {
            color: "#FA8072"
          };
        } // Red
        if (status.status === "value-set-valid") {
          return {
            color: "#90EE90"
          };
        } // Green
        if (status.status === "value-not-set") {
          return {
            color: "#ADD8E6"
          };
        } // Blue
      }
      return {};
    }
    getValidationStatus() {
      const logical = this.logicalElement;
      const father = logical.getFather();
      const validation = father.getValidationModule();
      const range = validation.isActive();
      const set = !!father.value && father.value !== "value";
      const valid = validation.validateValue(father.value);
      if (range == false) {
        return {
          status: "no-range"
        };
      }
      if (set == false) {
        return {
          status: "value-not-set"
        };
      }
      if (valid == false) {
        return {
          status: "value-set-invalid"
        };
      }
      return {
        status: "value-set-valid"
      };
    }
  }
  function canBeRemoved(visual, logical) {
    return !logical.parent.isComputational() && !logical.belongsToFatherModelId && !logical.parent.visualElements.find(v => v.belongsToSubModel || v.belongsToFatherModelId || v.protectedFromBeingChangedBySubModel);
  }
  function remove(visual, logical) {
    visual.fatherObject.removeState(visual);
    logical.removeVisual(visual);
    return new Array();
  }

  /***/
}),
/***/54695: (/***/(__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  "use strict";

  __webpack_require__.d(__webpack_exports__, {
    J: () => (/* binding */OpmVisualThing)
  });
