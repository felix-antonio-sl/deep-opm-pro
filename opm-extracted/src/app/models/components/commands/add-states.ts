// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/components/commands/add-states.ts
// Extracted by opm-extracted/tools/extract.mjs

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
