// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/components/commands/destate.ts
// Extracted by opm-extracted/tools/extract.mjs

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
