// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/methodological-checking-dialog/checkers/transforming-process-checker.ts
// Extracted by opm-extracted/tools/extract.mjs

class TransformingProcessChecker extends MethodologicalChecker {
  constructor(model) {
    super(model);
    this.title = "Transforming process";
    this.neededLinks = (0, createSet)(linkType.Result, linkType.Consumption, linkType.Effect);
  }
  check() {
    this.invalidThings = [];
    for (const log of this.model.logicalElements.filter(l => OPCloudUtils.isInstanceOfLogicalProcess(l))) {
      const vis = log.visualElements[0];
      const visProcess = vis;
      const links = visProcess.getAllLinks();
      const father = visProcess.fatherObject || visProcess.getAllLinks().inGoing.find(l => fundamental.contains(l.type))?.source;
      const relevantIngoingLinks = links.inGoing.filter(l => this.neededLinks.contains(l.type));
      const relevantOutgoingLinks = links.outGoing.filter(l => this.neededLinks.contains(l.type));
      const fatherIngoingLinks = father?.getAllLinks().inGoing.filter(l => this.neededLinks.contains(l.type)) || [];
      const fatherOutgoingLinks = father?.getAllLinks().outGoing.filter(l => this.neededLinks.contains(l.type)) || [];
      if (!father) {
        if (relevantIngoingLinks.length === 0 && relevantOutgoingLinks.length === 0) {
          this.addToInvalidThings(visProcess.logicalElement);
        }
      } else if (relevantIngoingLinks.length === 0 && relevantOutgoingLinks.length === 0 && fatherIngoingLinks.length === 0 && fatherOutgoingLinks.length === 0) {
        this.addToInvalidThings(visProcess.logicalElement);
      }
    }
    for (let i = this.invalidThings.length - 1; i >= 0; i--) {
      const logical = this.invalidThings[i];
      const children = logical.getChildren().filter(ch => OPCloudUtils.isInstanceOfLogicalProcess(ch));
      // if there is one valid child the father process is valid.
      if (this.invalidThings.filter(inv => children.includes(inv)).length !== children.length) {
        this.invalidThings.splice(i, 1);
      }
    }
    this.status = this.invalidThings.length === 0 ? MethodologicalCheckingStatus.VALID : MethodologicalCheckingStatus.INVALID;
  }
  getDescriptionTooltip() {
    return `A process must transform (create, consume or affect) at least one object.`;
  }
}