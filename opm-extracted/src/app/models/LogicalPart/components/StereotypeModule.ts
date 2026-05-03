// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/LogicalPart/components/StereotypeModule.ts
// Extracted by opm-extracted/tools/extract.mjs

class StereotypeModule {
  constructor(thing) {
    this.thing = thing;
  }
  getText() {
    return "«" + this.thing.getStereotype().getName() + "» ";
  }
  isTextActive() {
    if (this.thing.getStereotype()) {
      return true;
    }
    return false;
  }
  isActive() {
    if (this.thing.getStereotype()) {
      return true;
    }
    return false;
  }
  getPriority() {
    return -1;
  }
}
class BelongsToStereotypTextModule {
  constructor(thing) {
    this.thing = thing;
  }
  getText() {
    return "of " + this.thing.getBelongsToStereotyped().getBareName();
  }
  isTextActive() {
    if (this.thing.getBelongsToStereotyped()) {
      return true;
    }
    return false;
  }
  isActive() {
    if (this.thing.getBelongsToStereotyped()) {
      return true;
    }
    return false;
  }
  getPriority() {
    return 1;
  }
}
