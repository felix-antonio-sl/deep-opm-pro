// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/components/commands/updateComputationalProcess.ts
// Extracted by opm-extracted/tools/extract.mjs

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