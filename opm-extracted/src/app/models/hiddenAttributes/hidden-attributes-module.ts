// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/hiddenAttributes/hidden-attributes-module.ts
// Extracted by opm-extracted/tools/extract.mjs

class HiddenAttributesModule {
  constructor(params, model) {
    this.satisfiedRequirementSetModule = new SatisfiedRequirementSetModule(params, model);
  }
  createSatisfiedRequirementSet(owner) {
    return this.satisfiedRequirementSetModule.createSatisfiedRequirementSet(owner);
  }
}