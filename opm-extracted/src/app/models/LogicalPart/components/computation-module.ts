// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/LogicalPart/components/computation-module.ts
// Extracted by opm-extracted/tools/extract.mjs

// an object indicating if the object is computational or not
class ComputationModule {
  constructor() {
    this.valueType = valueType.None;
    this.value = undefined;
    this.validationModule = new ValidationModule();
  }
  isActive() {
    return this.valueType !== "None" && this.valueType !== valueType.None && this.valueType !== undefined && this.valueType !== null;
  }
  remove() {
    this.value = undefined;
    this.valueType = valueType.None;
  }
  setValue(value) {
    if (this.validationModule.validateValue(value)) {
      this.value = value;
    }
  }
  hasRange() {
    return this.validationModule.isActive();
  }
  setRange(type, range, stereotypeValidator) {
    const ret = this.validationModule.setRange(type, range, stereotypeValidator);
    if (ret.wasSet) {
      return {
        wasSet: true
      };
    }
    return {
      wasSet: false,
      errors: ret.errors
    };
  }
  removeRange() {
    this.validationModule.removeRange();
  }
  getRange() {
    return this.validationModule.getRange();
  }
}
