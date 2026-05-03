// EXPORTS

// EXTERNAL MODULE: ./src/app/models/VisualPart/OpmVisualThing.ts + 2 modules
var OpmVisualThing = require("./54695.js");
// EXTERNAL MODULE: ./src/app/models/ConfigurationOptions.ts
var ConfigurationOptions = require("./13641.js");
// EXTERNAL MODULE: ./src/app/models/VisualPart/OpmVisualState.ts + 3 modules
var OpmVisualState = require("./14898.js");
// EXTERNAL MODULE: ./src/app/configuration/elementsFunctionality/textWrapping.ts
var textWrapping = require("./72081.js");
// EXTERNAL MODULE: ./src/app/models/model/entities.enum.ts
var entities_enum = require("./63877.js");
// EXTERNAL MODULE: ./src/app/configuration/rappidEnviromentFunctionality/shared.ts + 1 modules
var shared = require("./1185.js");
// EXTERNAL MODULE: ./src/app/models/components/range-validation/range-validation.ts
var range_validation = require("./12629.js");
; // CONCATENATED MODULE: ./src/app/models/components/commands/add-states.ts
class AddStateCommand {
  constructor(init, object, visual) {
    this.init = init;
    this.object = object;
    this.visual = visual;
  }
  createHaloHandle() {
    return {
      flag: false,
      name: "add-state",
      displayTitle: "Add States",
      svg: "addStates",
      action: new AddStatesAction(this.init, this.object, this.visual),
      gif: "assets/gifs/add_states.gif"
    };
  }
  createToolbarHandle() {
    return {
      name: "add-state",
      displayTitle: "Add States",
      svg: "addStates",
      action: new AddStatesAction(this.init, this.object, this.visual),
      gif: "assets/gifs/add_states.gif"
    };
  }
}
class AddStatesAction {
  constructor(init, object, visual) {
    this.init = init;
    this.object = object;
    this.visual = visual;
  }
  act() {
    const cell = this.init.graph.getCell(this.visual.id);
    const vis = this.init.opmModel.getVisualElementById(this.visual.id);
    if (cell && vis) {
      cell.addStateAction(vis, this.init);
    }
  }
}
// EXTERNAL MODULE: ./src/app/models/components/commands/bring-connected.ts
var bring_connected = require("./1707.js");
// EXTERNAL MODULE: ./src/app/models/components/commands/command.ts
var command = require("./8180.js");
; // CONCATENATED MODULE: ./src/app/models/components/commands/edit-alias.ts
class EditAliasCommand {
  constructor(init, object, visual) {
    this.init = init;
    this.object = object;
    this.visual = visual;
  }
  createHaloHandle() {
    return {
      flag: false,
      name: "edit-alias",
      displayTitle: "Edit Alias",
      svg: "editAlias",
      action: new EditAliasAction(this.init, this.object),
      gif: "assets/gifs/set_units.gif"
    };
  }
  createToolbarHandle() {
    return {
      name: "edit-alias",
      displayTitle: "Edit Alias",
      svg: "editAlias",
      action: new EditAliasAction(this.init, this.object),
      gif: "assets/gifs/set_units.gif"
    };
  }
}
class EditAliasAction {
  constructor(init, object) {
    this.init = init;
    this.object = object;
  }
  act() {
    const cell = this.init.graph.getCell(this.object.id);
    if (cell) {
      cell.editAliasPopup(this.init);
    }
  }
}
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
; // CONCATENATED MODULE: ./src/app/models/components/commands/edit-units.ts
class EditUnitsCommand {
  constructor(init, object, visual) {
    this.init = init;
    this.object = object;
    this.visual = visual;
  }
  createHaloHandle() {
    return {
      flag: false,
      name: "edit-units",
      displayTitle: "Edit Units",
      svg: "editUnits",
      action: new EditUnitsAction(this.init, this.object),
      gif: "assets/gifs/set_units.gif"
    };
  }
  createToolbarHandle() {
    return {
      name: "edit-units",
      displayTitle: "Edit Units",
      svg: "editUnits",
      action: new EditUnitsAction(this.init, this.object),
      gif: "assets/gifs/set_units.gif"
    };
  }
}
class EditUnitsAction {
  constructor(init, object) {
    this.init = init;
    this.object = object;
  }
  act() {
    const cell = this.init.graph.getCell(this.object.id);
    if (cell) {
      cell.editUnitsPopup(this.init);
    }
  }
}
; // CONCATENATED MODULE: ./src/app/models/components/commands/suppress.ts
class SuppressCommand {
  constructor(init, object, visual) {
    this.init = init;
    this.object = object;
    this.visual = visual;
  }
  createHaloHandle() {
    return {
      flag: false,
      name: "Suppress",
      displayTitle: "Suppress States",
      svg: "supressHalo",
      action: new SuppressAction(this.init, this.object, this.visual),
      gif: "assets/gifs/suppress_states.gif"
    };
  }
  createToolbarHandle() {
    return {
      name: "Suppress All",
      displayTitle: "Suppress States",
      svg: "supressHalo",
      action: new SuppressAction(this.init, this.object, this.visual),
      gif: "assets/gifs/suppress_states.gif"
    };
  }
}
class SuppressAction {
  constructor(init, object, visual) {
    this.init = init;
    this.object = object;
    this.visual = visual;
  }
  act() {
    const cell = this.init.graph.getCell(this.object.id);
    const vis = this.init.opmModel.getVisualElementById(this.object.id);
    if (cell && vis) {
      cell.suppressAllAction(vis, this.init);
    }
  }
}
; // CONCATENATED MODULE: ./src/app/models/components/commands/destate.ts
class DestateCommand {
  constructor(init, object, visual) {
    this.init = init;
    this.object = object;
    this.visual = visual;
  }
  createHaloHandle() {
    return {
      flag: false,
      name: "destate",
      displayTitle: "Destate",
      svg: "destate",
      action: new DestateAction(this.init, this.object, this.visual),
      gif: "assets/gifs/destating.gif"
    };
  }
  createToolbarHandle() {
    return {
      name: "destate",
      displayTitle: "Destate",
      svg: "destate",
      action: new DestateAction(this.init, this.object, this.visual),
      gif: "assets/gifs/destating.gif"
    };
  }
}
class DestateAction {
  constructor(init, object, visual) {
    this.init = init;
    this.object = object;
    this.visual = visual;
  }
  act() {
    const cell = this.init.graph.getCell(this.visual.id);
    const vis = this.init.opmModel.getVisualElementById(this.visual.id);
    if (vis && cell) {
      const newVisuals = vis.logicalElement.deStating();
      cell.updateDeStating(newVisuals, this.init);
    }
  }
}
// EXTERNAL MODULE: ./src/app/models/components/commands/toggle-affiliation.ts
var toggle_affiliation = require("./69262.js");
// EXTERNAL MODULE: ./src/app/models/components/commands/toggle-essence.ts
var toggle_essence = require("./92690.js");
// EXTERNAL MODULE: ./src/app/models/components/commands/toggle-text-formation.ts
var toggle_text_formation = require("./69727.js");
; // CONCATENATED MODULE: ./src/app/models/components/commands/hide-type-object.ts
class HideTypeCommand {
  constructor(init, object, visual) {
    this.init = init;
    this.object = object;
    this.visual = visual;
  }
  createHaloHandle() {
    return {
      flag: false,
      name: "hide-type-object",
      displayTitle: "Hide",
      svg: "hide-type-object",
      action: new HideValueAction(this.init, this.object)
    };
  }
  createToolbarHandle() {
    return {
      name: "hide-type-object",
      displayTitle: "Hide",
      svg: "hide-type-object",
      action: new HideValueAction(this.init, this.object),
      gif: "assets/gifs/toggle_range_type.gif"
    };
  }
}
class HideValueAction {
  constructor(init, object) {
    this.init = init;
    this.object = object;
  }
  act() {
    const cell = this.init.graph.getCell(this.object.id);
    if (cell) {
      cell.hideValueObject(this.init);
    }
  }
}
; // CONCATENATED MODULE: ./src/app/models/components/commands/supress-value-object-states.ts
class SupressValueStatesCommand {
  constructor(init, object, visual) {
    this.init = init;
    this.object = object;
    this.visual = visual;
  }
  createHaloHandle() {
    return {
      flag: false,
      name: "suppres-value-states",
      displayTitle: "Suppress",
      svg: "supressHalo",
      action: new SupressValueStatesAction(this.init, this.object)
    };
  }
  createToolbarHandle() {
    return {
      name: "suppres-value-states",
      displayTitle: "Suppress",
      svg: "supressHalo",
      action: new SupressValueStatesAction(this.init, this.object),
      gif: ""
    };
  }
}
class SupressValueStatesAction {
  constructor(init, object) {
    this.init = init;
    this.object = object;
  }
  act() {
    const cell = this.init.graph.getCell(this.object.id);
    if (cell) {
      cell.suppressValueStates(this.init);
    }
  }
}
; // CONCATENATED MODULE: ./src/app/models/components/commands/object-decider.ts

class ObjectCommandsDecider extends command /* CommandsDecider */.V {
  set(init, object, visual) {
    this.init = init;
    this.object = object;
    this.visual = visual;
    return this;
  }
  inzoom() {
    return new inzoom /* InzoomCommand */.A(this.init, this.object, this.visual);
  }
  setComputation() {
    return new computation /* SetComputationCommand */.x(this.init, this.object, this.visual);
  }
  removeComp() {
    return new remove_comp /* RemoveComputationCommand */.z(this.init, this.object, this.visual);
  }
  addState() {
    return new AddStateCommand(this.init, this.object, this.visual);
  }
  suppress() {
    return new SuppressCommand(this.init, this.object, this.visual);
  }
  destate() {
    return new DestateCommand(this.init, this.object, this.visual);
  }
  unfold() {
    return new unfold /* UnfoldCommand */.s(this.init, this.object, this.visual);
  }
  bringConnected() {
    return new bring_connected /* BringConnectedCommand */.X(this.init, this.object, this.visual);
  }
  remove() {
    return new remove /* RemoveCommand */.Y(this.init);
  }
  editAlias() {
    return new EditAliasCommand(this.init, this.object, this.visual);
  }
  editUnits() {
    return new EditUnitsCommand(this.init, this.object, this.visual);
  }
  toggleAffiliation() {
    return new toggle_affiliation /* ToggleAffiliationCommand */.w(this.init, this.object, this.visual);
  }
  toggleEssence() {
    return new toggle_essence /* ToggleEssenceCommand */.G(this.init, this.object, this.visual);
  }
  toggleTextAutoFormat() {
    return new toggle_text_formation /* ToggleTextAutoFormatCommand */.z(this.init, this.object, this.visual);
  }
  hideValueObject() {
    return new HideTypeCommand(this.init, this.object, this.visual);
  }
  suppressStatesValueObject() {
    return new SupressValueStatesCommand(this.init, this.object, this.visual);
  }
  getHaloCommands() {
    const commands = new Array();
    if (this.visual.isValueTyped()) {
      return [this.hideValueObject(), this.suppressStatesValueObject()];
    }
    const logical = this.visual.logicalElement;
    if (!logical.isSatisfiedRequirementObject() && !logical.isSatisfiedRequirementSetObject()) {
      commands.push(this.remove());
    }
    if ((this.visual.isInzoomed() || this.visual.isUnfolded()) == false && !logical.isSatisfiedRequirementSetObject() && !this.visual.isComputational()) {
      commands.push(this.setComputation());
    }
    if (this.visual.isComputational()) {
      commands.push(this.removeComp(), this.bringConnected(), this.editUnits());
      if (logical.isSatisfiedRequirementObject() && logical.getStereotype()) {
        commands.push(this.unfold());
      }
    } else {
      commands.push(this.inzoom(), this.unfold(), this.bringConnected());
      if (!logical.isSatisfiedRequirementSetObject()) {
        commands.push(this.addState());
      }
    }
    commands.push(this.editAlias());
    if (this.visual.states.length > 0 && this.visual.isComputational() == false) {
      commands.push(this.suppress());
    }
    return commands;
  }
  getToolabarCommands() {
    const commands = new Array();
    if (this.visual.isValueTyped()) {
      return commands;
    }
    if (this.visual.logicalElement.opmModel.currentOpd.requirementViewOf) {
      return commands;
    }
    const logical = this.visual.logicalElement;
    if (!logical.isSatisfiedRequirementObject() && !logical.isSatisfiedRequirementSetObject()) {
      commands.push(this.remove());
    }
    commands.push(this.toggleAffiliation());
    if ((this.visual.isInzoomed() || this.visual.isUnfolded()) == false && !logical.isSatisfiedRequirementSetObject() && !this.visual.isComputational()) {
      commands.push(this.setComputation());
    }
    if ((this.visual.isInzoomed() || this.visual.isUnfolded()) == false && !logical.isSatisfiedRequirementSetObject() && this.visual.isComputational()) {
      commands.push(this.removeComp());
    }
    if (this.visual.isComputational()) {
      commands.push(this.removeComp(), this.bringConnected(), this.editUnits());
      if (logical.isSatisfiedRequirementObject() && logical.getStereotype()) {
        commands.push(this.unfold());
      }
    } else {
      commands.push(this.inzoom(), this.unfold(), this.bringConnected(), this.toggleEssence());
      if (!logical.isSatisfiedRequirementSetObject()) {
        commands.push(this.addState());
      }
    }
    commands.push(this.editAlias());
    if (this.visual.states.length > 0 && this.visual.isComputational() == false) {
      commands.push(this.suppress(), this.destate());
    }
    if (this.visual.canModifyText()) {
      commands.push(this.toggleTextAutoFormat());
    }
    return commands;
  }
}
; // CONCATENATED MODULE: ./src/app/models/VisualPart/OpmVisualObject.ts
export class I extends OpmVisualThing /* OpmVisualThing */.J {
  get type() {
    return entities_enum /* EntityType */.c.Object;
  }
  constructor(params, logicalElement) {
    super(params, logicalElement);
    this.lastStatesOrder = [];
    if (params && params.statesArrangement != null) {
      this.statesArrangement = this.getStateArrangement(params.statesArrangement);
    } else {
      this.statesArrangement = ConfigurationOptions /* statesArrangement */.vF.Bottom;
    }
    if (params && params.digitalTwin != null) {
      this.digitalTwin = params.digitalTwin;
    }
    if (params && params.predigitalTwin != null) {
      this.predigitalTwin = params.predigitalTwin;
    }
    if (params && params.originalObj != null) {
      this.originalObj = params.originalObj;
    }
    if (params && params.preoriginalObj != null) {
      this.preoriginalObj = params.preoriginalObj;
    }
    if (params && params.digitalTwinConnected != null) {
      this.digitalTwinConnected = params.digitalTwinConnected;
    }
    if (params && params.lastStatesOrder) {
      this.lastStatesOrder = params.lastStatesOrder;
    }
  }
  setDefaultStyleFields() {
    super.setDefaultStyleFields();
    this.strokeColor = "#70E483";
  }
  get ellipsis() {
    return this._ellipsis;
  }
  isEllipsisNeeded() {
    return this.logicalElement.states.length > this.states.length;
  }
  createEllipsis() {
    if (this._ellipsis) {
      return this._ellipsis;
    }
    return this._ellipsis = this.logicalElement.ellipsis.createVisual(this);
  }
  removeEllipsis() {
    if (this._ellipsis) {
      this._ellipsis.remove();
      this._ellipsis = undefined;
    }
  }
  remove() {
    let removed = [];
    const prop = new range_validation /* RangeValidationAccess */.P(this.logicalElement.opmModel).getProperties(this);
    if (prop.valueType.visualAtCurrentOpd) {
      removed = removed.concat(prop.valueType.visualAtCurrentOpd.remove());
    }
    const ret = super.remove();
    return ret.concat(removed);
  }
  isDigitallyTwin() {
    if (this.digitalTwin && this.logicalElement.opmModel.getVisualElementById(this.digitalTwin)) {
      return true;
    }
    return false;
  }
  get states() {
    const states = this.children.filter(c => c instanceof OpmVisualState /* OpmVisualState */.y);
    const isVerticalOrder = this.statesArrangement === ConfigurationOptions /* statesArrangement */.vF.Right || this.statesArrangement === ConfigurationOptions /* statesArrangement */.vF.Left;
    if (isVerticalOrder) {
      return states.sort((a, b) => {
        if (a.yPos > b.yPos) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    return states.sort((a, b) => {
      if (a.xPos > b.xPos) {
        return 1;
      } else {
        return -1;
      }
    });
  }
  updateParams(params) {
    super.updateParams(params);
    if (params?.lastStatesOrder) {
      this.lastStatesOrder = params.lastStatesOrder;
    }
  }
  getStateArrangement(statesArrange) {
    switch (statesArrange) {
      case "top":
      case ConfigurationOptions /* statesArrangement */.vF.Top:
        return ConfigurationOptions /* statesArrangement */.vF.Top;
      case "bottom":
      case ConfigurationOptions /* statesArrangement */.vF.Bottom:
        return ConfigurationOptions /* statesArrangement */.vF.Bottom;
      case "left":
      case ConfigurationOptions /* statesArrangement */.vF.Left:
        return ConfigurationOptions /* statesArrangement */.vF.Left;
      case "right":
      case ConfigurationOptions /* statesArrangement */.vF.Right:
        return ConfigurationOptions /* statesArrangement */.vF.Right;
      default:
        return statesArrange;
    }
  }
  getParams() {
    const params = {
      statesArrangement: this.statesArrangement,
      refineableId: this.refineable ? this.refineable.id : null,
      refineeInzoomingId: this.refineeInzooming ? this.refineeInzooming.id : null,
      refineeUnfoldingId: this.refineeUnfolding ? this.refineeUnfolding.id : null,
      digitalTwin: this.digitalTwin,
      predigitalTwin: this.predigitalTwin,
      originalObj: this.originalObj,
      preoriginalObj: this.preoriginalObj,
      digitalTwinConnected: this.digitalTwinConnected,
      lastStatesOrder: this.lastStatesOrder
    };
    return {
      ...super.getThingParams(),
      ...params
    };
  }
  connectRefinementElements(id, type) {
    if (type == "in-zoom") {
      this.logicalElement.findVisualElement(id).refineeInzooming = this;
    } else {
      this.logicalElement.findVisualElement(id).refineeUnfolding = this;
    }
    this.refineable = this.logicalElement.findVisualElement(id);
  }
  getParamsFromJsonElement(jsonElement) {
    const params = {
      statesArrangement: this.getStateArrangement(jsonElement.statesArrangement),
      digitalTwin: jsonElement.digitalTwin,
      predigitalTwin: jsonElement.predigitalTwin,
      preoriginalObj: jsonElement.preoriginalObj,
      originalObj: jsonElement.originalObj,
      digitalTwinConnected: jsonElement.digitalTwinConnected,
      lastStatesOrder: jsonElement.lastStatesOrder
    };
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
    this.strokeColor = "#70E483";
  }
  clone() {
    const params = this.getParams();
    delete params.semiFolded;
    delete params.foldedUnderThing;
    params.children = [];
    const cloned = this.logicalElement.createVisual(params);
    cloned.setNewUUID();
    for (let i = 0; i < this.states.length; i++) {
      const clonedState = this.states[i].clone();
      clonedState.fatherObject = cloned;
      clonedState.parent = cloned;
      cloned.children.push(clonedState);
    }
    return cloned;
  }
  insertState(visual) {
    this.children.push(visual);
    visual.setPos(this.xPos + this.width, this.yPos + this.height);
    return visual;
  }
  createState() {
    return this.insertState(this.logicalElement.createLogicalAndVisualState(this));
  }
  addState() {
    const init = (0, shared /* getInitRappidShared */.Km)();
    if (init) {
      init.opmModel.logForUndo(this.logicalElement.text + " state added");
    }
    const ret = Array();
    /*if ((<OpmLogicalObject>this.logicalElement).value !== 'None')
      return ret;*/
    const logicalObject = this.logicalElement;
    if (logicalObject.protectedFromBeingRefinedBySubModel) {
      return ret;
    }
    if (logicalObject.states.length === 0 && logicalObject.valueType === ConfigurationOptions /* valueType */._x.None && !logicalObject.getBelongsToStereotyped()) {
      ret.push(this.createState());
    }
    if (!logicalObject.getBelongsToStereotyped()) {
      ret.push(this.createState());
    }
    return ret;
  }
  // When we click the X button. Delete both logical and visual.
  deleteState(state) {
    this.removeState(state);
    this.fatherObject.deleteState(state.logicalElement);
  }
  removeState(state) {
    for (let i = this.children.length - 1; i >= 0; i--) {
      if (state === this.children[i]) {
        this.children.splice(i, 1);
        break;
      }
    }
  }
  getStatesToExpress() {
    const union = this.logicalElement.states;
    const states = this.states;
    const ret = [];
    for (let i = 0; i < union.length; i++) {
      let exist = false;
      for (let j = 0; j < states.length; j++) {
        if (states[j].logicalElement === union[i]) {
          // ret.push({ text: union[i].text, exist: exist = true });
          exist = true;
        }
      }
      if (!exist) {
        ret.push({
          text: union[i].text,
          exist: false
        });
      }
    }
    return ret;
  }
  allStatesExpressed() {
    return this.logicalElement.states.length === this.states.length;
  }
  express(state) {
    const expressed = this.states.find(s => s.logicalElement === state);
    if (expressed) {
      return expressed;
    }
    const visual = this.logicalElement.createVisualState(this, state);
    if (!visual) {
      return undefined;
    }
    this.insertState(visual);
    const opd = this.logicalElement.opmModel.getOpdByElement(this);
    opd.add(visual);
    return visual;
  }
  expressChecked(checked) {
    const ret = new Array();
    for (let i = 0; i < checked.length; i++) {
      if (!checked[i].checked) {
        continue;
      }
      const state = this.logicalElement.states.find(s => s.text === checked[i].text);
      if (!state) {
        continue;
      }
      const visual = this.express(state);
      if (visual) {
        ret.push(visual);
      }
    }
    if (ret.length) {
      this.rearrange();
    }
    return ret;
  }
  updateLastStatesOrder() {
    const orderedNewStates = [];
    const currentStatesLids = this.states.map(s => s.logicalElement.lid);
    for (const st of currentStatesLids) {
      if (!this.lastStatesOrder.includes(st)) {
        orderedNewStates.push(st);
      }
    }
    this.lastStatesOrder = [...this.lastStatesOrder, ...orderedNewStates].sort((a, b) => {
      if (currentStatesLids.includes(a) && currentStatesLids.includes(b)) {
        return currentStatesLids.indexOf(a) - currentStatesLids.indexOf(b);
      }
      if (!currentStatesLids.includes(a) && currentStatesLids.includes(b)) {
        if (this.lastStatesOrder.includes(a) && this.lastStatesOrder.includes(b)) {
          return this.lastStatesOrder.indexOf(a) - this.lastStatesOrder.indexOf(b);
        }
        return -1;
      }
      if (currentStatesLids.includes(a) && !currentStatesLids.includes(b)) {
        if (this.lastStatesOrder.includes(a) && this.lastStatesOrder.includes(b)) {
          return this.lastStatesOrder.indexOf(a) - this.lastStatesOrder.indexOf(b);
        }
        return 1;
      }
      if (this.lastStatesOrder.includes(a) && this.lastStatesOrder.includes(b)) {
        return this.lastStatesOrder.indexOf(a) - this.lastStatesOrder.indexOf(b);
      }
      return 0;
    });
    this.lastStatesOrder = this.lastStatesOrder.filter(lid => !!this.logicalElement.opmModel.getLogicalElementByLid(lid));
  }
  suppressAll() {
    const list = new Array();
    const ret = new Array();
    this.updateLastStatesOrder();
    for (let i = 0; i < this.states.length; i++) {
      list.push(this.states[i]);
    }
    for (let i = 0; i < list.length; i++) {
      if (list[i].suppress()) {
        ret.push(list[i]);
      }
    }
    if (this.isEllipsisNeeded() && !this._ellipsis) {
      this.createEllipsis();
    } else if (!this.isEllipsisNeeded()) {
      this.removeEllipsis();
    }
    return ret;
  }
  expressAll(isNewlyCreated = false) {
    const states = this.logicalElement.states;
    for (let i = 0; i < states.length; i++) {
      if (!this.states.find(s => s.logicalElement === states[i])) {
        const createdVisualState = this.express(this.logicalElement.states[i]);
        if (!this.logicalElement.opmModel.logicalElements.includes(createdVisualState.logicalElement)) {
          this.logicalElement.opmModel.add(createdVisualState.logicalElement);
        }
      }
    }
    /*this.states_.sort(function (a, b) {
      return states.indexOf(a.logical) - states.indexOf(b.logical);
    });*/
    for (let i = 0; i < this.states.length; i++) {
      // if it is a new object copy => sort by creation order
      if (isNewlyCreated) {
        const pos = this.logicalElement.states.indexOf(this.states[i].logicalElement);
        this.states[i].setPos(pos, pos);
      } else {
        let pos = this.lastStatesOrder.indexOf(this.states[i].logicalElement.lid);
        if (pos === -1) {
          pos = this.logicalElement.states.indexOf(this.states[i].logicalElement);
        }
        this.states[i].setPos(pos + 3, 5);
      }
    }
    if (this.isEllipsisNeeded() && !this._ellipsis) {
      this.createEllipsis();
    } else if (!this.isEllipsisNeeded()) {
      this.removeEllipsis();
    }
    this.rearrange();
  }
  hasAnyLogicalStates() {
    return this.logicalElement.states.length !== 0;
  }
  rearrange(side) {
    if (!this.children.length) {
      return;
    }
    const previousSide = this.statesArrangement;
    if (side >= 0 && side <= 3) {
      this.statesArrangement = side;
    } else {
      side = this.statesArrangement;
    }
    if (this.children.find(c => c instanceof I)) {
      this.rearrangeInzoomed();
      return;
    }
    const originalXpos = this.xPos + 0;
    const originalYpos = this.yPos + 0;
    const padding = 10;
    let maxStateWidth = 0;
    let maxStateHeight = 0;
    let states;
    let left;
    let top;
    let width = this.width;
    let height = this.height;
    this.children.forEach(state => {
      if (state.height > maxStateHeight) {
        maxStateHeight = state.height;
      }
      if (state.width > maxStateWidth) {
        maxStateWidth = state.width;
      }
    });
    /*
     if the arrangement is to top or bottom then states sorted by x position, starting from
     left reference is left side of the object.
     if the arrangement is to right or left then states sorted by y position, starting from
     top reference is top side of the object..
    */
    if (previousSide === ConfigurationOptions /* statesArrangement */.vF.Top || previousSide === ConfigurationOptions /* statesArrangement */.vF.Bottom) {
      states = this.children.filter(c => c instanceof OpmVisualState /* OpmVisualState */.y).sort(function (a, b) {
        return a.xPos - b.xPos;
      });
    } else {
      states = this.children.filter(c => c instanceof OpmVisualState /* OpmVisualState */.y).sort(function (a, b) {
        return a.yPos - b.yPos;
      });
    }
    if (side === ConfigurationOptions /* statesArrangement */.vF.Top || side === ConfigurationOptions /* statesArrangement */.vF.Bottom) {
      left = this.xPos + padding;
      this.refX = 0.5;
      this.xAlign = "middle";
      this.textHeight = "80%"; //0 - maxStateHeight - 2 * padding;
      this.textWidth = "80%";
      if (side === ConfigurationOptions /* statesArrangement */.vF.Top) {
        top = this.yPos + padding;
        this.refY = 0.9;
        this.yAlign = "bottom";
        if (this._ellipsis) {
          this._ellipsis.yPos = top;
        }
      } else {
        top = this.yPos + this.height - padding - maxStateHeight;
        this.refY = 0.1;
        this.yAlign = "top";
        if (this._ellipsis) {
          this._ellipsis.yPos = top + maxStateHeight - this._ellipsis.height;
        }
      }
      // if moved states  from top to bottom or from bottom to top, no need to calculate
      // x position, only update y position
      if (side === ConfigurationOptions /* statesArrangement */.vF.Bottom && previousSide === ConfigurationOptions /* statesArrangement */.vF.Top || side === ConfigurationOptions /* statesArrangement */.vF.Top && previousSide === ConfigurationOptions /* statesArrangement */.vF.Bottom) {
        states.forEach(state => {
          state.yPos = top;
          left += state.width + padding;
        });
        if (this._ellipsis) {
          left += padding + this._ellipsis.width;
        }
      } else {
        states.forEach(state => {
          state.yPos = top;
          state.xPos = left;
          left += state.width + padding;
        });
        if (this._ellipsis) {
          this._ellipsis.xPos = left;
          left += padding + this._ellipsis.width;
        }
        width = left - this.xPos;
        // save place for text and after resizing will enlarge the size if it will not fit the text
        height = maxStateHeight + padding * 2 + 20;
        if (side === ConfigurationOptions /* statesArrangement */.vF.Bottom && height < this.height) {
          this.yPos = this.yPos + (this.height - height);
        }
      }
    } else {
      // right or left
      top = this.yPos + padding;
      this.refY = 0.5;
      this.yAlign = "middle";
      this.textHeight = "80%";
      this.textWidth = 0 - maxStateWidth - padding * 2;
      if (side === ConfigurationOptions /* statesArrangement */.vF.Left) {
        left = this.xPos + padding;
        this.refX = 0.95;
        this.xAlign = "right";
        if (this.ellipsis) {
          this._ellipsis.xPos = left;
        }
      } else {
        left = this.xPos + this.width - padding - maxStateWidth;
        this.refX = 0.05;
        this.xAlign = "left";
        if (this.ellipsis) {
          this._ellipsis.xPos = left + maxStateWidth - this._ellipsis.width;
        }
      }
      // if moved states from right to left or from left to right, no need to calculate
      // y position, only update x position
      if (side === ConfigurationOptions /* statesArrangement */.vF.Right && previousSide === ConfigurationOptions /* statesArrangement */.vF.Left || side === ConfigurationOptions /* statesArrangement */.vF.Left && previousSide === ConfigurationOptions /* statesArrangement */.vF.Right) {
        states.forEach(state => {
          state.xPos = left;
          top += state.height + padding;
        });
        if (this.ellipsis) {
          top += padding + this._ellipsis.height;
        }
      } else {
        states.forEach(state => {
          state.xPos = left;
          state.yPos = top;
          top += state.height + padding;
        });
        if (this.ellipsis) {
          this._ellipsis.yPos = top;
          top += padding + this._ellipsis.height;
        }
        width = maxStateWidth + padding * 2 + 100;
        height = top - this.yPos;
        if (side === ConfigurationOptions /* statesArrangement */.vF.Right && width < this.width) {
          this.xPos = this.xPos + (this.width - width);
        }
      }
    }
    const newWidth = Math.max(width, this.calculateMinWidth(), this.width);
    const newHeight = Math.max(height, this.calculateMinHeight(), this.height);
    if (newWidth === this.width && newHeight === this.height) {
      this.xPos = originalXpos;
      this.yPos = originalYpos;
    }
    this.width = newWidth;
    this.height = newHeight;
  }
  rearrangeInzoomed() {
    const side = this.statesArrangement;
    const embeddedStates = this.children.filter(c => c instanceof OpmVisualState /* OpmVisualState */.y);
    const embeddedObjects = this.children.filter(child => child instanceof I);
    const x = this.xPos;
    const y = this.yPos;
    const w = this.width;
    const h = this.height;
    const p = 10;
    this.refX = 0.5;
    this.xAlign = "middle";
    this.refY = 0.1;
    this.yAlign = "top";
    if (side === ConfigurationOptions /* statesArrangement */.vF.Top || side === ConfigurationOptions /* statesArrangement */.vF.Bottom) {
      embeddedStates.sort(function (a, b) {
        return a.xPos - b.xPos;
      });
      embeddedObjects.sort(function (a, b) {
        return a.yPos - b.yPos;
      });
      let x_size = 0;
      let maxHstate = embeddedStates.length ? embeddedStates[0] : {
        height: 0,
        yPos: 0
      };
      embeddedStates.forEach(state => {
        x_size += state.width + p;
        if (state.height > maxHstate.height) {
          maxHstate = state;
        }
      });
      x_size += p;
      const x_start = x + (w - x_size) / 2;
      let _object;
      if (side === ConfigurationOptions /* statesArrangement */.vF.Top) {
        _object = embeddedObjects[0];
        this.refY = 0.18;
        this.yAlign = "top";
      } else if (side === ConfigurationOptions /* statesArrangement */.vF.Bottom) {
        _object = embeddedObjects[embeddedObjects.length - 1];
      }
      let left = 0;
      embeddedStates.forEach(state => {
        if (side === ConfigurationOptions /* statesArrangement */.vF.Top) {
          state.setPos(x_start + left + p, y + p);
        } else if (side === ConfigurationOptions /* statesArrangement */.vF.Bottom) {
          state.setPos(x_start + left + p, _object.yPos + _object.height + p);
        }
        left += p + state.width;
      });
      if (embeddedStates.length) {
        if (embeddedStates[0].xPos < this.xPos) {
          this.xPos = embeddedStates[0].xPos - p;
        }
        if (embeddedStates[embeddedStates.length - 1].xPos + embeddedStates[embeddedStates.length - 1].width > this.xPos + this.width) {
          this.width += embeddedStates[embeddedStates.length - 1].xPos + embeddedStates[embeddedStates.length - 1].width - this.xPos + this.width + p;
        }
      }
      if (side === ConfigurationOptions /* statesArrangement */.vF.Bottom) {
        if (this.yPos + this.height < maxHstate.yPos + maxHstate.height) {
          this.height += maxHstate.yPos + maxHstate.height - (this.yPos + this.height) + p;
        }
      }
    } else if (side === ConfigurationOptions /* statesArrangement */.vF.Right || side === ConfigurationOptions /* statesArrangement */.vF.Left) {
      embeddedStates.sort(function (a, b) {
        return a.yPos - b.yPos;
      });
      embeddedObjects.sort(function (a, b) {
        return a.xPos - b.xPos;
      });
      let y_size = 0;
      embeddedStates.forEach(state => {
        y_size += state.height + p;
      });
      y_size += p;
      const y_start = y + (h - y_size) / 2;
      let _object;
      if (side === ConfigurationOptions /* statesArrangement */.vF.Left) {
        _object = embeddedObjects[0];
      } else if (side === ConfigurationOptions /* statesArrangement */.vF.Right) {
        _object = embeddedObjects[embeddedObjects.length - 1];
      }
      let top = 0;
      embeddedStates.forEach(state => {
        if (side === ConfigurationOptions /* statesArrangement */.vF.Left) {
          state.setPos(_object.xPos - state.width - p, y_start + top + p);
        } else if (side === ConfigurationOptions /* statesArrangement */.vF.Right) {
          state.setPos(_object.xPos + _object.width + p, y_start + top + p);
        }
        top += p + state.height;
      });
    }
  }
  getVisualStatesOnly() {
    const onlyStates = this.children.filter(cell => cell instanceof OpmVisualState /* OpmVisualState */.y);
    return onlyStates;
  }
  // Should be moved to base classes.
  getTextWidth() {
    return textWrapping /* textWrapping */._.getParagraphWidthByParams(this.logicalElement.text, this.textFontSize, this.textFontWeight, this.textFontWeight);
  }
  getTextHeight() {
    return textWrapping /* textWrapping */._.getParagraphHeightByParams(this.logicalElement.text, this.textFontSize, this.textFontWeight, this.textFontWeight);
  }
  getHaloHandles() {
    if (this.isValueTyped()) {
      return ["hideValueObject", "suppressValueStates", "suppressValueStates"];
    }
    if (this.isComputational()) {
      return [...super.getHaloHandles(), "editUnits", "editAlias"];
    }
    if (this.getVisualStatesOnly().length === 0) {
      return [...super.getHaloHandles(), "addState", "editAlias"];
    } else {
      return [...super.getHaloHandles(), "addState", "suppress", "editAlias"];
    }
  }
  setReferencesOnCreate() {
    super.setReferencesOnCreate();
    for (const child of this.children) {
      if (child instanceof OpmVisualState /* OpmVisualState */.y) {
        child.logicalElement.parent = this.logicalElement;
        if (this.logicalElement.states.find(s => s === child.logicalElement) === undefined) {
          this.logicalElement.states.push(child.logicalElement);
        }
      }
    }
  }
  calculateMinHeight() {
    const states = this.states;
    const semiItemsLength = this.semiFolded.length;
    let maxStateHeight = 0;
    const paddingBottom = 10;
    // const paddingTop = 20;
    const textBreak = shared /* joint */.FP.util.breakText;
    const lines = textBreak(this.logicalElement.text, {
      width: this.width - 40
    }).split("\n").length;
    const fontSize = this.textFontSize || 14;
    // let paddingTop = Math.max(20, this.height * 0.1) + 10;
    const paddingTop = 20 + lines * fontSize;
    states.forEach(stt => {
      if (stt.height > maxStateHeight) {
        maxStateHeight = stt.height;
      }
    });
    if (maxStateHeight > 0 && semiItemsLength > 0) {
      maxStateHeight += 20;
    }
    const semiHeight = 30;
    const paddingBetween = 5;
    const addition = semiItemsLength === 1 ? 10 : 0;
    return paddingTop + maxStateHeight + paddingBottom + semiItemsLength * semiHeight + addition + paddingBetween * (semiItemsLength - 1);
  }
  calculateMinWidth() {
    const states = this.states;
    const semiItemsLength = this.semiFolded.length;
    if (semiItemsLength === 0) {
      return 135;
    }
    let maxStateWidth = 0;
    let paddingleft = 15;
    const paddingRight = 10;
    if (this.statesArrangement === ConfigurationOptions /* statesArrangement */.vF.Right || this.statesArrangement === ConfigurationOptions /* statesArrangement */.vF.Left) {
      states.forEach(stt => {
        if (stt.width > maxStateWidth) {
          maxStateWidth = stt.width;
        }
      });
      maxStateWidth = states.length > 0 ? maxStateWidth + 30 : maxStateWidth;
    }
    let semiWidth = 80;
    this.semiFolded.forEach(child => {
      paddingleft = 0;
      if (child.width > semiWidth) {
        semiWidth = child.width;
      }
    });
    return paddingleft + maxStateWidth + paddingRight + semiWidth;
  }
  arrangeInnerSemiFoldedThings() {
    const model = this.logicalElement.opmModel;
    this.semiFolded = this.semiFolded.sort(model.sortFoldedFundamentalRelations.bind(model));
    const states = this.states;
    const semiItemsLength = this.semiFolded.length;
    let maxStateHeight = 0;
    const paddingBottom = this.height * 0.07;
    const textBreak = shared /* joint */.FP.util.breakText;
    const lines = textBreak(this.logicalElement.text, {
      width: this.width - 40
    }).split("\n").length;
    const fontSize = this.textFontSize || 14;
    // let paddingTop = Math.max(20, this.height * 0.1) + 10;
    let paddingTop = 10 + lines * fontSize;
    states.forEach(stt => {
      if (stt.height > maxStateHeight) {
        maxStateHeight = stt.height;
      }
    });
    const totalSpace = this.height - maxStateHeight - paddingBottom - paddingTop;
    const semiHeight = 25;
    let paddingBetween = 0;
    if (semiItemsLength > 0) {
      paddingBetween = (totalSpace - semiItemsLength * semiHeight) / (semiItemsLength + 2);
      this.refY = Math.max(25, lines * fontSize / 2 + 10);
    }
    // else if (semiItemsLength === 1) {
    //   this.refY = Math.max(25, this.height * 0.1);
    // }
    const maxSemiWidth = Math.max(...this.semiFolded.map(sm => isNaN(sm.width) ? 160 : sm.width));
    const ordered = this.getSemifoldedThingsOrdered();
    for (const semi of ordered) {
      const isFirst = ordered.indexOf(semi) === 0 ? 0 : 1;
      // semi.yPos = paddingTop + (ordered.indexOf(semi) * (semiHeight + paddingBetween * isFirst));
      semi.yPos = paddingTop + paddingBetween + ordered.indexOf(semi) * (semiHeight + paddingBetween * isFirst);
      semi.xPos = (this.width - maxSemiWidth) / 2;
    }
  }
  hasRange() {
    const logical = this.logicalElement;
    return logical.hasRange();
  }
  isValueTyped() {
    const logical = this.logicalElement;
    return logical.isValueTyped();
  }
  setValueAsDefault() {
    const logical = this.logicalElement;
    const state = logical.states[0];
    if (state) {
      const validation = logical.getValidationModule();
      const value = validation.getDefault();
      state.setText(value);
    }
  }
  getCommandsDecider() {
    return new ObjectCommandsDecider();
  }
  canModifyText() {
    return this.isValueTyped() == false;
  }
}
/***/