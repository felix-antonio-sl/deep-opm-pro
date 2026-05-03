// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/load-model-dialog/load-model-dialog-interfaces.ts
// Extracted by opm-extracted/tools/extract.mjs

class DeepSearchModel {
  constructor(archiveMode, description, directory_id, editBy, id, permissions, title) {
    this.archiveMode = archiveMode;
    this.description = description;
    this.directory_id = directory_id;
    this.editBy = editBy;
    this.id = id;
    this.permissions = permissions;
    this.title = title;
    this.path = "";
    this.type = DisplayModelType.MAIN;
  }
}
class DeepSearchFolder {
  constructor(father, id, title) {
    this.father = father;
    this.id = id;
    this.title = title;
  }
  get name() {
    return this.title;
  }
}