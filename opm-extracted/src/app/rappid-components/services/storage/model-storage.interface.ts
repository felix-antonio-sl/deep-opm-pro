// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/services/storage/model-storage.interface.ts
// Extracted by opm-extracted/tools/extract.mjs

class ModelStorageInterface {}
var DisplayModelType = /*#__PURE__*/function (DisplayModelType) {
  DisplayModelType.MAIN = "main";
  DisplayModelType.AUTOSAVE = "autosave";
  DisplayModelType.VERSION = "version";
  return DisplayModelType;
}(DisplayModelType || {});
var DisplayModelPermissionType = /*#__PURE__*/function (DisplayModelPermissionType) {
  DisplayModelPermissionType.READ = "read";
  DisplayModelPermissionType.WRITE = "write";
  return DisplayModelPermissionType;
}(DisplayModelPermissionType || {});
var DisplayFolderType = /*#__PURE__*/function (DisplayFolderType) {
  DisplayFolderType.ORDINARY = "ordinary";
  DisplayFolderType.VERSION = "version";
  return DisplayFolderType;
}(DisplayFolderType || {});