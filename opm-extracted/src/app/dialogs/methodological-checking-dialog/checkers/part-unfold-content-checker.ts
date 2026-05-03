// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/methodological-checking-dialog/checkers/part-unfold-content-checker.ts
// Extracted by opm-extracted/tools/extract.mjs

class PartUnfoldContentChecker extends MethodologicalChecker {
  constructor(model) {
    super(model);
    this.title = "Part-unfolding thing content";
  }
  check() {
    this.invalidThings = [];
    for (const opd of this.model.opds.filter(o => !o.isHidden)) {
      for (const vis of opd.visualElements) {
        if (OPCloudUtils.isInstanceOfVisualThing(vis)) {
          const refinee = vis.getRefineeUnfold();
          if (refinee && refinee.getLinks().outGoing.filter(l => fundamental.contains(l.type)).length < 2) {
            this.addToInvalidThings(refinee.logicalElement);
          }
        }
      }
    }
    this.status = this.invalidThings.length === 0 ? MethodologicalCheckingStatus.VALID : MethodologicalCheckingStatus.INVALID;
  }
  getDescriptionTooltip() {
    return `A Part-unfolded thing must consist of at least two things.`;
  }
}