// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/modules/attribute-validation/char-range.ts
// Extracted by opm-extracted/tools/extract.mjs

class CharRange {
  constructor() {}
  setPattern(value) {
    return {
      wasSet: true
    };
  }
  getDefault() {
    return "a";
  }
  getPattern() {
    return "CHAR";
  }
  validate(value) {
    if (!value) {
      return false;
    }
    return value.length == 1;
  }
  getType() {
    return ValueAttributeType.CHAR;
  }
  isSubRange(newRange) {
    return true;
  }
}