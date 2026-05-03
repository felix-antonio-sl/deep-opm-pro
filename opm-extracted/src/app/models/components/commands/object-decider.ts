// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/components/commands/object-decider.ts
// Extracted by opm-extracted/tools/extract.mjs

class ObjectCommandsDecider extends CommandsDecider {
  set(init, object, visual) {
    this.init = init;
    this.object = object;
    this.visual = visual;
    return this;
  }
  inzoom() {
    return new InzoomCommand(this.init, this.object, this.visual);
  }
  setComputation() {
    return new SetComputationCommand(this.init, this.object, this.visual);
  }
  removeComp() {
    return new RemoveComputationCommand(this.init, this.object, this.visual);
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
    return new UnfoldCommand(this.init, this.object, this.visual);
  }
  bringConnected() {
    return new BringConnectedCommand(this.init, this.object, this.visual);
  }
  remove() {
    return new RemoveCommand(this.init);
  }
  editAlias() {
    return new EditAliasCommand(this.init, this.object, this.visual);
  }
  editUnits() {
    return new EditUnitsCommand(this.init, this.object, this.visual);
  }
  toggleAffiliation() {
    return new ToggleAffiliationCommand(this.init, this.object, this.visual);
  }
  toggleEssence() {
    return new ToggleEssenceCommand(this.init, this.object, this.visual);
  }
  toggleTextAutoFormat() {
    return new ToggleTextAutoFormatCommand(this.init, this.object, this.visual);
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