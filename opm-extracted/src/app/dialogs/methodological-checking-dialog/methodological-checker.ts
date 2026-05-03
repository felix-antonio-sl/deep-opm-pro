// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/methodological-checking-dialog/methodological-checker.ts
// Extracted by opm-extracted/tools/extract.mjs

class MethodologicalChecker {
  constructor(model) {
    this.model = model;
    this.status = MethodologicalCheckingStatus.UNCHECKED;
    this.invalidThings = [];
  }
  /** Shown under the title in the Invalid Things details dialog; override for ISO-specific wording. */
  getInvalidThingsDetailsSubtitle() {
    return this.getDescriptionTooltip();
  }
  getInvalidThings() {
    return this.invalidThings;
  }
  addToInvalidThings(logical) {
    if (!this.invalidThings.includes(logical)) {
      this.invalidThings.push(logical);
    }
  }
}
var MethodologicalCheckingStatus = /*#__PURE__*/function (MethodologicalCheckingStatus) {
  MethodologicalCheckingStatus[MethodologicalCheckingStatus.UNCHECKED = 1] = "UNCHECKED";
  MethodologicalCheckingStatus[MethodologicalCheckingStatus.INVALID = 2] = "INVALID";
  MethodologicalCheckingStatus[MethodologicalCheckingStatus.VALID = 3] = "VALID";
  return MethodologicalCheckingStatus;
}(MethodologicalCheckingStatus || {});