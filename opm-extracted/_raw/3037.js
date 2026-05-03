// EXPORTS

// EXTERNAL MODULE: ./src/app/models/VisualPart/OpmVisualThing.ts + 2 modules
var OpmVisualThing = require("./54695.js");
// EXTERNAL MODULE: ./src/app/models/model/entities.enum.ts
var entities_enum = require("./63877.js");
// EXTERNAL MODULE: ./src/app/configuration/rappidEnviromentFunctionality/shared.ts + 1 modules
var shared = require("./1185.js");
// EXTERNAL MODULE: ./src/app/models/components/commands/bring-connected.ts
var bring_connected = require("./1707.js");
// EXTERNAL MODULE: ./src/app/models/components/commands/command.ts
var command = require("./8180.js");
// EXTERNAL MODULE: ./src/app/models/components/commands/inzoom.ts
var inzoom = require("./38949.js");
// EXTERNAL MODULE: ./src/app/models/components/commands/remove.ts
var remove = require("./14357.js");
// EXTERNAL MODULE: ./src/app/models/components/commands/remove-comp.ts
var remove_comp = require("./7849.js");
// EXTERNAL MODULE: ./src/app/models/components/commands/unfold.ts
var unfold = require("./39605.js");
// EXTERNAL MODULE: ./src/app/models/components/commands/computation.ts
var computation = require("./49954.js");
// EXTERNAL MODULE: ./src/app/models/components/commands/style.ts
var style = require("./46464.js");
; // CONCATENATED MODULE: ./src/app/models/components/commands/set-process-time-duration.ts
class SetProcessTimeDurationCommand {
  constructor(init, process, visual) {
    this.init = init;
    this.process = process;
    this.visual = visual;
  }
  createHaloHandle() {
    return {
      flag: false,
      name: "set-time-duration",
      displayTitle: "Add Time Duration",
      svg: "timeDuration",
      action: new SetProcessTimeDurationAction(this.init, this.process, this.visual),
      gif: "assets/gifs/set_time_duration.gif"
    };
  }
  createToolbarHandle() {
    return {
      name: "set-time-duration",
      displayTitle: "Add Time Duration",
      svg: "timeDuration",
      action: new SetProcessTimeDurationAction(this.init, this.process, this.visual),
      gif: "assets/gifs/set_time_duration.gif"
    };
  }
}
class SetProcessTimeDurationAction {
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
// EXTERNAL MODULE: ./src/app/models/components/commands/toggle-affiliation.ts
var toggle_affiliation = require("./69262.js");
// EXTERNAL MODULE: ./src/app/models/components/commands/toggle-essence.ts
var toggle_essence = require("./92690.js");
// EXTERNAL MODULE: ./src/app/models/components/commands/toggle-text-formation.ts
var toggle_text_formation = require("./69727.js");
; // CONCATENATED MODULE: ./src/app/models/components/commands/updateComputationalProcess.ts
class UpdateComputationCommand {
  constructor(init, thing, visual) {
    this.init = init;
    this.thing = thing;
    this.visual = visual;
  }
  createHaloHandle() {
    return {
      flag: true,
      name: "update-computation",
      displayTitle: "Update Computation",
      svg: "updateComputationalProcess",
      action: new UpdateComputationalAction(this.init, this.thing),
      gif: "assets/gifs/update_computation.gif"
    };
  }
  createToolbarHandle() {
    return {
      name: "update-computation",
      displayTitle: "Update Computation",
      svg: "updateComputationalProcess",
      action: new UpdateComputationalAction(this.init, this.thing),
      gif: "assets/gifs/update_computation.gif"
    };
  }
}
class UpdateComputationalAction {
  constructor(init, thing) {
    this.init = init;
    this.thing = thing;
  }
  act() {
    const cell = this.init.graph.getCell(this.thing.id);
    if (cell) {
      cell.updateComputational(this.init);
    }
  }
}
; // CONCATENATED MODULE: ./src/app/models/components/commands/user-input-command.ts

class UserInputCommand {
  constructor(init, entity, visual) {
    this.init = init;
    this.entity = entity;
    this.visual = visual;
  }
  createHaloHandle() {
    const logical = this.visual.logicalElement;
    const state = logical.needUserInput;
    return {
      flag: true,
      name: "",
      displayTitle: "",
      svg: "",
      action: new UserInputCommandAction(this.init, this.visual)
    };
  }
  createToolbarHandle() {
    const logical = this.visual.logicalElement;
    const state = logical.needUserInput;
    return {
      name: "user-input",
      displayTitle: state ? "Currently Asking For User Input" : "Currently Not Asking For User Input",
      svg: state ? "user-input-on" : "user-input-off",
      action: new UserInputCommandAction(this.init, this.visual),
      gif: ""
    };
  }
}
class UserInputCommandAction {
  constructor(init, visual) {
    this.init = init;
    this.visual = visual;
  }
  act() {
    const logical = this.visual.logicalElement;
    const cell = this.init.graph.getCell(this.visual.id);
    if (!cell || typeof cell.openUserInputPrompt !== "function") {
      return;
    }
    if (logical.needUserInput) {
      logical.needUserInput = false;
      cell.updateTextView();
      cell.updateURLArray();
      const init = (0, shared /* getInitRappidShared */.Km)();
      if (init?.elementToolbarReference?.onSelection) {
        init.elementToolbarReference.onSelection();
      }
      return;
    }
    const view = this.init.paper.findViewByModel(cell);
    if (view) {
      cell.openUserInputPrompt(view.el, logical);
    }
  }
}
; // CONCATENATED MODULE: ./src/app/models/components/commands/process-decider.ts

class ProcessCommandsDecider extends command /* CommandsDecider */.V {
  set(init, drawn, visual) {
    this.init = init;
    this.drawn = drawn;
    this.visual = visual;
    return this;
  }
  inzoom() {
    return new inzoom /* InzoomCommand */.A(this.init, this.drawn, this.visual);
  }
  setComputation() {
    return new computation /* SetComputationCommand */.x(this.init, this.drawn, this.visual);
  }
  removeComp() {
    return new remove_comp /* RemoveComputationCommand */.z(this.init, this.drawn, this.visual);
  }
  updateComp() {
    return new UpdateComputationCommand(this.init, this.drawn, this.visual);
  }
  unfold() {
    return new unfold /* UnfoldCommand */.s(this.init, this.drawn, this.visual);
  }
  bringConnected() {
    return new bring_connected /* BringConnectedCommand */.X(this.init, this.drawn, this.visual);
  }
  remove() {
    return new remove /* RemoveCommand */.Y(this.init);
  }
  style() {
    return new style /* StylingCommand */.K(this.init, this.drawn, this.visual);
  }
  setTimeDuration() {
    return new SetProcessTimeDurationCommand(this.init, this.drawn, this.visual);
  }
  toggleAffiliation() {
    return new toggle_affiliation /* ToggleAffiliationCommand */.w(this.init, this.drawn, this.visual);
  }
  toggleEssence() {
    return new toggle_essence /* ToggleEssenceCommand */.G(this.init, this.drawn, this.visual);
  }
  toggleTextAutoFormat() {
    return new toggle_text_formation /* ToggleTextAutoFormatCommand */.z(this.init, this.drawn, this.visual);
  }
  userInput() {
    return new UserInputCommand(this.init, this.drawn, this.visual);
  }
  getHaloCommands() {
    const commands = new Array();
    commands.push(this.remove());
    if ((this.visual.isInzoomed() || this.visual.isUnfolded()) == false) {
      commands.push(this.setComputation());
    }
    if (this.visual.isComputational()) {
      commands.push(this.updateComp(), this.removeComp(), this.bringConnected());
    } else {
      commands.push(this.inzoom(), this.unfold(), this.bringConnected());
    }
    commands.push(this.style(), this.setTimeDuration());
    return commands;
  }
  getToolabarCommands() {
    const commands = new Array();
    if (this.visual.logicalElement.opmModel.currentOpd.requirementViewOf) {
      return commands;
    }
    commands.push(this.remove(), this.toggleAffiliation(), this.setTimeDuration());
    if ((this.visual.isInzoomed() || this.visual.isUnfolded()) == false) {
      commands.push(this.setComputation());
    }
    if (this.visual.isComputational()) {
      commands.push(this.removeComp(), this.bringConnected(), this.updateComp());
    } else {
      commands.push(this.inzoom(), this.unfold(), this.bringConnected(), this.toggleEssence());
    }
    if (this.visual.canModifyText()) {
      commands.push(this.toggleTextAutoFormat());
    }
    if (this.visual.canUseUserInput()) {
      commands.push(this.userInput());
    }
    return commands;
  }
}
// EXTERNAL MODULE: ./src/app/models/ConfigurationOptions.ts
var ConfigurationOptions = require("./13641.js");
; // CONCATENATED MODULE: ./src/app/models/VisualPart/OpmVisualProcess.ts

const uuid = shared /* joint */.FP.util.uuid;
export class o extends OpmVisualThing /* OpmVisualThing */.J {
  get type() {
    return entities_enum /* EntityType */.c.Process;
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
    const textBreak = shared /* joint */.FP.util.breakText;
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
    const textBreak = shared /* joint */.FP.util.breakText;
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
    return this.getAllLinks().inGoing.find(l => l.type === ConfigurationOptions /* linkType */.h6.Agent);
  }
}
/***/