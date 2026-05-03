// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/modules/attribute-validation/boolean-range.ts
// Extracted by opm-extracted/tools/extract.mjs

const TRUE = "true";
const FALSE = "false";
class BooleanRange {
  constructor() {}
  setPattern(value) {
    return {
      wasSet: true
    };
  }
  getDefault() {
    return String(FALSE);
  }
  getPattern() {
    return "BOOLEAN";
  }
  validate(value) {
    return value && (value.toLowerCase() === TRUE || value.toLowerCase() === FALSE);
  }
  getType() {
    return ValueAttributeType.BOOLEAN;
  }
  isSubRange(newRange) {
    return true;
  }
}