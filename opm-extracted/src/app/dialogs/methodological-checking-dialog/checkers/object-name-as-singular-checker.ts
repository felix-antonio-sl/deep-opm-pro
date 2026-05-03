// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/methodological-checking-dialog/checkers/object-name-as-singular-checker.ts
// Extracted by opm-extracted/tools/extract.mjs

  class ObjectNameAsSingularChecker extends MethodologicalChecker {
    constructor(model) {
      super(model);
      this.title = "Object name as singular";
    }
    check() {
      this.invalidThings = [];
      for (const thing of this.model.logicalElements) {
        if (OPCloudUtils.isInstanceOfLogicalObject(thing)) {
          const bareName = thing.getBareName();
          const splitted = bareName.split(" ");
          const lastWord = splitted[splitted.length - 1];
          if (bareName.toLowerCase().endsWith("s") && lastWord === pluralize_default()(lastWord)) {
            this.invalidThings.push(thing);
          }
        }
      }
      this.status = this.invalidThings.length === 0 ? MethodologicalCheckingStatus.VALID : MethodologicalCheckingStatus.INVALID;
    }
    getDescriptionTooltip() {
      return `Object name as singular -
An object must be in singular form.
 For plural use a “Set” for inanimate objects and “Group” for humans.`;
    }
  }