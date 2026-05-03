// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/components/commands/suppress-state.ts
// Extracted by opm-extracted/tools/extract.mjs

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
