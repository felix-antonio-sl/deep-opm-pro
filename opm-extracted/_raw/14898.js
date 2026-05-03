// EXPORTS

// EXTERNAL MODULE: ./src/app/models/VisualPart/OpmVisualEntity.ts
var OpmVisualEntity = require("./87602.js");
// EXTERNAL MODULE: ./src/app/models/model/entities.enum.ts
var entities_enum = require("./63877.js");
// EXTERNAL MODULE: ./src/app/models/ConfigurationOptions.ts
var ConfigurationOptions = require("./13641.js");
// EXTERNAL MODULE: ./src/app/models/components/commands/command.ts
var command = require("./8180.js");
// EXTERNAL MODULE: ./src/app/models/components/commands/remove.ts
var remove = require("./14357.js");
// EXTERNAL MODULE: ./src/app/models/components/commands/style.ts
var style = require("./46464.js");
; // CONCATENATED MODULE: ./src/app/models/components/commands/set-state-time-duration.ts
class SetStateTimeDurationCommand {
  constructor(init, state, visual) {
    this.init = init;
    this.state = state;
    this.visual = visual;
  }
  createHaloHandle() {
    return {
      flag: false,
      name: "set-time-duration",
      displayTitle: "Add Time Duration",
      svg: "timeDuration",
      action: new SetStateTimeDurationAction(this.init, this.state, this.visual),
      gif: "assets/gifs/state_set_time_duration.gif"
    };
  }
  createToolbarHandle() {
    return {
      name: "set-time-duration",
      displayTitle: "Add Time Duration",
      svg: "timeDuration",
      action: new SetStateTimeDurationAction(this.init, this.state, this.visual),
      gif: "assets/gifs/state_set_time_duration.gif"
    };
  }
}
class SetStateTimeDurationAction {
  constructor(init, drawn, visual) {
    this.init = init;
    this.drawn = drawn;
    this.visual = visual;
  }
  act() {
    const cell = this.init.graph.getCell(this.drawn.id);
    const vis = this.init.opmModel.getVisualElementById(this.drawn.id);
    if (cell && vis) {
      cell.openTimeDuration(this.init.paper.findViewByModel(cell).el, vis.logicalElement.getDurationManager(), {
        digits: this.init.oplService.settings.timeDurationUnitsDigits
      });
    }
  }
}
; // CONCATENATED MODULE: ./src/app/models/components/commands/suppress-state.ts
class SuppressStateCommand {
  constructor(init, state, visual) {
    this.init = init;
    this.state = state;
    this.visual = visual;
  }
  createHaloHandle() {
    return {
      flag: false,
      name: "suppress",
      displayTitle: "Suppress",
      svg: "supressHalo",
      action: new SupressStateCommandAction(this.init, this.state, this.visual),
      gif: "assets/gifs/suppress_single_state.gif"
    };
  }
  createToolbarHandle() {
    return {
      name: "suppress",
      displayTitle: "Suppress",
      svg: "supressHalo",
      action: new SupressStateCommandAction(this.init, this.state, this.visual),
      gif: "assets/gifs/suppress_single_state.gif"
    };
  }
}
class SupressStateCommandAction {
  constructor(init, drawn, visual) {
    this.init = init;
    this.drawn = drawn;
    this.visual = visual;
  }
  act() {
    const cell = this.init.graph.getCell(this.drawn.id);
    const vis = this.init.opmModel.getVisualElementById(this.drawn.id);
    if (cell && vis) {
      cell.suppressAction(vis, this.init);
    }
  }
}
// EXTERNAL MODULE: ./src/app/models/components/commands/toggle-text-formation.ts
var toggle_text_formation = require("./69727.js");
; // CONCATENATED MODULE: ./src/app/models/components/commands/state-decider.ts

class StateCommandsDecider extends command /* CommandsDecider */.V {
  set(init, drawn, visual) {
    this.init = init;
    this.drawn = drawn;
    this.visual = visual;
    return this;
  }
  remove() {
    return new remove /* RemoveCommand */.Y(this.init);
  }
  style() {
    return new style /* StylingCommand */.K(this.init, this.drawn, this.visual);
  }
  setTimeDuration() {
    return new SetStateTimeDurationCommand(this.init, this.drawn, this.visual);
  }
  suppress() {
    return new SuppressStateCommand(this.init, this.drawn, this.visual);
  }
  toggleTextAutoFormat() {
    return new toggle_text_formation /* ToggleTextAutoFormatCommand */.z(this.init, this.drawn, this.visual);
  }
  getHaloCommands() {
    const commands = new Array();
    if (this.visual.isValueTyped()) {
      return commands;
    }
    if (this.visual.isFatherComputational() == false) {
      commands.push(this.remove(), this.suppress());
    }
    commands.push(this.style(), this.setTimeDuration());
    return commands;
  }
  getToolabarCommands() {
    const commands = new Array();
    if (this.visual.logicalElement.opmModel.currentOpd.requirementViewOf) {
      return commands;
    }
    if (this.visual.isFatherComputational() == false && this.visual.isValueTyped() == false) {
      commands.push(this.remove(), this.setTimeDuration());
    }
    if (this.visual.canModifyText()) {
      commands.push(this.toggleTextAutoFormat());
    }
    if (this.visual.isFatherComputational() === false && !this.visual.isValueTyped()) {
      commands.push(this.remove(), this.suppress());
    }
    return commands;
  }
}
; // CONCATENATED MODULE: ./src/app/models/VisualPart/OpmVisualState.ts

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
export class y extends OpmVisualEntity /* OpmVisualEntity */.e {
  get type() {
    return entities_enum /* EntityType */.c.State;
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
      this.fatherObject.statesArrangement = ConfigurationOptions /* statesArrangement */.vF.Bottom;
    }
    return [].concat(ret).concat(OpmVisualState_remove(this, this.logicalElement));
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
function OpmVisualState_remove(visual, logical) {
  visual.fatherObject.removeState(visual);
  logical.removeVisual(visual);
  return new Array();
}

/***/