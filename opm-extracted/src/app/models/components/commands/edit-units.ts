// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/components/commands/edit-units.ts
// Extracted by opm-extracted/tools/extract.mjs

class EditUnitsCommand {
  constructor(init, object, visual) {
    this.init = init;
    this.object = object;
    this.visual = visual;
  }
  createHaloHandle() {
    return {
      flag: false,
      name: "edit-units",
      displayTitle: "Edit Units",
      svg: "editUnits",
      action: new EditUnitsAction(this.init, this.object),
      gif: "assets/gifs/set_units.gif"
    };
  }
  createToolbarHandle() {
    return {
      name: "edit-units",
      displayTitle: "Edit Units",
      svg: "editUnits",
      action: new EditUnitsAction(this.init, this.object),
      gif: "assets/gifs/set_units.gif"
    };
  }
}
class EditUnitsAction {
  constructor(init, object) {
    this.init = init;
    this.object = object;
  }
  act() {
    const cell = this.init.graph.getCell(this.object.id);
    if (cell) {
      cell.editUnitsPopup(this.init);
    }
  }
}