// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/components/commands/user-input-command.ts
// Extracted by opm-extracted/tools/extract.mjs

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
      const init = (0, getInitRappidShared)();
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