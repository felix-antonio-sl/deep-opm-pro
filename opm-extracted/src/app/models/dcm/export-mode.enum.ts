// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/dcm/export-mode.enum.ts
// Extracted by opm-extracted/tools/extract.mjs

/**
 * CMMN Export Mode
 * Controls how associations are handled in the export
 */
var CMMNExportMode = /*#__PURE__*/function (CMMNExportMode) {
  /**
   * FLOWABLE mode: No associations are exported
   * This ensures Flowable 6.7.2 import compatibility
   */
  CMMNExportMode.FLOWABLE = "flowable";
  /**
   * STANDARD mode: Associations are exported with full DI support
   * Each association must have a corresponding CMMNEdge with >=2 waypoints
   */
  CMMNExportMode.STANDARD = "standard";
  return CMMNExportMode;
}(CMMNExportMode || {});