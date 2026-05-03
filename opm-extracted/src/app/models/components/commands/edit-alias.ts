// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/components/commands/edit-alias.ts
// Extracted by opm-extracted/tools/extract.mjs

class EditAliasCommand {
  constructor(init, object, visual) {
    this.init = init;
    this.object = object;
    this.visual = visual;
  }
  createHaloHandle() {
    return {
      flag: false,
      name: "edit-alias",
      displayTitle: "Edit Alias",
      svg: "editAlias",
      action: new EditAliasAction(this.init, this.object),
      gif: "assets/gifs/set_units.gif"
    };
  }
  createToolbarHandle() {
    return {
      name: "edit-alias",
      displayTitle: "Edit Alias",
      svg: "editAlias",
      action: new EditAliasAction(this.init, this.object),
      gif: "assets/gifs/set_units.gif"
    };
  }
}
class EditAliasAction {
  constructor(init, object) {
    this.init = init;
    this.object = object;
  }
  act() {
    const cell = this.init.graph.getCell(this.object.id);
    if (cell) {
      cell.editAliasPopup(this.init);
    }
  }
}
