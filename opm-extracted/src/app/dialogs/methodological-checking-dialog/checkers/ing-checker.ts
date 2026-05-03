// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/methodological-checking-dialog/checkers/ing-checker.ts
// Extracted by opm-extracted/tools/extract.mjs

class IngProcessesNamesChecker extends MethodologicalChecker {
  constructor(model) {
    super(model);
    this.title = "\"ing\" processes suffix (Gerund)";
  }
  check() {
    this.invalidThings = [];
    for (const thing of this.model.logicalElements) {
      if (OPCloudUtils.isInstanceOfLogicalProcess(thing)) {
        const bareName = thing.getBareName();
        if (!bareName.toLowerCase().endsWith("ing")) {
          this.invalidThings.push(thing);
        }
      }
    }
    this.status = this.invalidThings.length === 0 ? MethodologicalCheckingStatus.VALID : MethodologicalCheckingStatus.INVALID;
  }
  getDescriptionTooltip() {
    return `“ing” process suffix (Gerund) -
  If possible, a process should end with “ing”.`;
  }
}

var pluralize_default = /*#__PURE__*/__webpack_require__.n(pluralize);