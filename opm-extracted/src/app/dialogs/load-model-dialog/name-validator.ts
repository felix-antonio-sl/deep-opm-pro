// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/load-model-dialog/name-validator.ts
// Extracted by opm-extracted/tools/extract.mjs

class ModelTitleValidator {
  validateTitle(title) {
    // Does match windows & firebase restriction.
    if (title) {
      return RegExp(/^(?=[\S])[^\\\/:*?"<>|.$[\]#]+$/).test(title);
    }
    return false;
  }
  static create() {
    return new ModelTitleValidator();
  }
}