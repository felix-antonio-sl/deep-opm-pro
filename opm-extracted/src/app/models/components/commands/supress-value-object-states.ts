// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/components/commands/supress-value-object-states.ts
// Extracted by opm-extracted/tools/extract.mjs

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