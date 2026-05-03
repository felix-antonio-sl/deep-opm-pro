// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/stereotypes-dialog/StereotypesRelatedInterface.ts
// Extracted by opm-extracted/tools/extract.mjs

/*enum representing the options of a actions */
var StereotypeStorageMode = /*#__PURE__*/function (StereotypeStorageMode) {
  StereotypeStorageMode[StereotypeStorageMode.LOAD = 0] = "LOAD";
  StereotypeStorageMode[StereotypeStorageMode.SAVE = 1] = "SAVE";
  StereotypeStorageMode[StereotypeStorageMode.SET = 2] = "SET";
  return StereotypeStorageMode;
}(StereotypeStorageMode || {});
/*enum representing the options of a stereotype type */
var StereotypeType = /*#__PURE__*/function (StereotypeType) {
  StereotypeType.System = "SYS";
  StereotypeType.Organization = "ORG";
  return StereotypeType;
}(StereotypeType || {});