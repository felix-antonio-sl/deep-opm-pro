// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/services/storage/model-object.class.ts
// Extracted by opm-extracted/tools/extract.mjs

class ModelObject {
  constructor(name = "", modelData = null) {
    this.path = "";
    this.name = name;
    this.modelData = modelData;
    this.tokenFlag = false;
  }
  isModelLoaded() {
    return this.name != undefined && this.path != undefined;
  }
  saveModelParam(newName, newModel, path) {
    this.name = newName;
    this.modelData = newModel;
    this.path = path;
  }
  copyModel() {
    const copyModel = new ModelObject(this.name, this.modelData);
    copyModel.path = "";
    return copyModel;
  }
}
var CurrentModelPermission = /*#__PURE__*/function (CurrentModelPermission) {
  CurrentModelPermission.WRITE = "WRITE";
  CurrentModelPermission.READ = "READ";
  return CurrentModelPermission;
}(CurrentModelPermission || {});
