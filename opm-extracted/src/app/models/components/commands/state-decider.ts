// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/components/commands/state-decider.ts
// Extracted by opm-extracted/tools/extract.mjs

class StateCommandsDecider extends CommandsDecider {
  set(init, drawn, visual) {
    this.init = init;
    this.drawn = drawn;
    this.visual = visual;
    return this;
  }
  remove() {
    return new RemoveCommand(this.init);
  }
  style() {
    return new StylingCommand(this.init, this.drawn, this.visual);
  }
  setTimeDuration() {
    return new SetStateTimeDurationCommand(this.init, this.drawn, this.visual);
  }
  suppress() {
    return new SuppressStateCommand(this.init, this.drawn, this.visual);
  }
  toggleTextAutoFormat() {
    return new ToggleTextAutoFormatCommand(this.init, this.drawn, this.visual);
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