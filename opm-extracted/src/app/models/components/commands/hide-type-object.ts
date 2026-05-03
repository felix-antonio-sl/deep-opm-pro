// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/components/commands/hide-type-object.ts
// Extracted by opm-extracted/tools/extract.mjs

class HideTypeCommand {
  constructor(init, object, visual) {
    this.init = init;
    this.object = object;
    this.visual = visual;
  }
  createHaloHandle() {
    return {
      flag: false,
      name: "hide-type-object",
      displayTitle: "Hide",
      svg: "hide-type-object",
      action: new HideValueAction(this.init, this.object)
    };
  }
  createToolbarHandle() {
    return {
      name: "hide-type-object",
      displayTitle: "Hide",
      svg: "hide-type-object",
      action: new HideValueAction(this.init, this.object),
      gif: "assets/gifs/toggle_range_type.gif"
    };
  }
}
class HideValueAction {
  constructor(init, object) {
    this.init = init;
    this.object = object;
  }
  act() {
    const cell = this.init.graph.getCell(this.object.id);
    if (cell) {
      cell.hideValueObject(this.init);
    }
  }
}