// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/LogicalPart/components/configurationsTextModule.ts
// Extracted by opm-extracted/tools/extract.mjs

class ConfigurationsTextModule {
  constructor(thing) {
    this.thing = thing;
  }
  getText() {
    const cc = this.thing.opmModel.getCurrentConfiguration();
    return "{Instances: " + cc[this.thing.lid].value + "}";
  }
  isTextActive() {
    const cc = this.thing.opmModel.getCurrentConfiguration();
    if (cc && cc[this.thing.lid] && cc[this.thing.lid].value !== 0) {
      return true;
    }
    return false;
  }
  getPriority() {
    return 4;
  }
}
