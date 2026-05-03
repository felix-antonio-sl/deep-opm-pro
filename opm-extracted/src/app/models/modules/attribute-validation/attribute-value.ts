// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/modules/attribute-validation/attribute-value.ts
// Extracted by opm-extracted/tools/extract.mjs

class AttributeValue {
  constructor() {
    this.active = false;
  }
  setRange(type, range, stereotypeValidator) {
    const validator = factory(type);
    const result = validator.setPattern(range);
    if (result.wasSet == false) {
      return false;
    }
    if (stereotypeValidator && !checkIsSubRange(stereotypeValidator, validator)) {
      return false;
    }
    this.active = true;
    this.type = type;
    this.validator = validator;
    return true;
  }
  remove() {
    this.active = false;
    this.type = undefined;
    this.validator = undefined;
  }
  validate(value) {
    if (this.active == false || this.validator == undefined) {
      return false;
    }
    return this.validator.validate(value);
  }
  getDefault() {
    if (this.validator) {
      return this.validator.getDefault();
    }
    return undefined;
  }
  isActive() {
    return this.active;
  }
  getType() {
    return this.type;
  }
  getRange() {
    if (this.validator) {
      return this.validator.getPattern();
    }
    return "";
  }
  getValidator() {
    return this.validator;
  }
}
const factory = function (type) {
  if (type == ValueAttributeType.INTEGER) {
    return new NumericRange("integer");
  } else if (type == ValueAttributeType.FLOAT) {
    return new NumericRange("float");
  } else if (type == ValueAttributeType.STRING) {
    return new StringRange();
  } else if (type == ValueAttributeType.CHAR) {
    return new CharRange();
  } else if (type == ValueAttributeType.BOOLEAN) {
    return new BooleanRange();
  }
  return new NumericRange("integer");
};
function checkIsSubRange(originalValidator, newValidator) {
  if (originalValidator.getType() !== newValidator.getType()) {
    return false;
  }
  return originalValidator.isSubRange(newValidator);
}