// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/stereotypeManager.ts
// Extracted by opm-extracted/tools/extract.mjs

class StereotypeManager {
  constructor() {
    this.stereotypes = new Array();
  }
  addStereotype(stereo) {
    if (!this.stereotypes.find(stro => stro.id === stereo.id)) {
      this.stereotypes.push(stereo);
      return stereo;
    }
    return this.stereotypes.find(stro => stro.id === stereo.id);
  }
  removeStereotype(stereo) {
    if (!this.stereotypes.includes(stereo)) {
      return false;
    }
    this.stereotypes.splice(this.stereotypes.indexOf(stereo), 1);
    return true;
  }
  getStereoTypes() {
    return this.stereotypes;
  }
  getStereotypeById(sterotypeId) {
    return this.stereotypes.find(s => s.id === sterotypeId);
  }
}
