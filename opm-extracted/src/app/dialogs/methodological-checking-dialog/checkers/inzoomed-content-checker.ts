// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/methodological-checking-dialog/checkers/inzoomed-content-checker.ts
// Extracted by opm-extracted/tools/extract.mjs

class InzoomedContentChecker extends MethodologicalChecker {
  constructor(model) {
    super(model);
    this.title = "In-zoomed thing content";
  }
  check() {
    this.invalidThings = [];
    for (const opd of this.model.opds.filter(o => !o.isHidden)) {
      for (const vis of opd.visualElements) {
        if (OPCloudUtils.isInstanceOfVisualThing(vis)) {
          const refinee = vis.getRefineeInzoom();
          if (refinee && refinee.children.length < 2) {
            this.addToInvalidThings(refinee.logicalElement);
          }
        }
      }
    }
    this.status = this.invalidThings.length === 0 ? MethodologicalCheckingStatus.VALID : MethodologicalCheckingStatus.INVALID;
  }
  getDescriptionTooltip() {
    return `An in-zoom thing must contain at least two things.`;
  }
}