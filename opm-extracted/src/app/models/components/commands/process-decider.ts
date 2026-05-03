// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/components/commands/process-decider.ts
// Extracted by opm-extracted/tools/extract.mjs

class ProcessCommandsDecider extends CommandsDecider {
  set(init, drawn, visual) {
    this.init = init;
    this.drawn = drawn;
    this.visual = visual;
    return this;
  }
  inzoom() {
    return new InzoomCommand(this.init, this.drawn, this.visual);
  }
  setComputation() {
    return new SetComputationCommand(this.init, this.drawn, this.visual);
  }
  removeComp() {
    return new RemoveComputationCommand(this.init, this.drawn, this.visual);
  }
  updateComp() {
    return new UpdateComputationCommand(this.init, this.drawn, this.visual);
  }
  unfold() {
    return new UnfoldCommand(this.init, this.drawn, this.visual);
  }
  bringConnected() {
    return new BringConnectedCommand(this.init, this.drawn, this.visual);
  }
  remove() {
    return new RemoveCommand(this.init);
  }
  style() {
    return new StylingCommand(this.init, this.drawn, this.visual);
  }
  setTimeDuration() {
    return new SetProcessTimeDurationCommand(this.init, this.drawn, this.visual);
  }
  toggleAffiliation() {
    return new ToggleAffiliationCommand(this.init, this.drawn, this.visual);
  }
  toggleEssence() {
    return new ToggleEssenceCommand(this.init, this.drawn, this.visual);
  }
  toggleTextAutoFormat() {
    return new ToggleTextAutoFormatCommand(this.init, this.drawn, this.visual);
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
