// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/components/commands/suppress.ts
// Extracted by opm-extracted/tools/extract.mjs

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
      gif: "assets/gifs/states.gif"
    };
  }
  createToolbarHandle() {
    return {
      name: "Suppress All",
      displayTitle: "Suppress States",
      svg: "supressHalo",
      action: new SuppressAction(this.init, this.object, this.visual),
      gif: "assets/gifs/states.gif"
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