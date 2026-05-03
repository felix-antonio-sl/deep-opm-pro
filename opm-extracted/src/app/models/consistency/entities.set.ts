// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/consistency/entities.set.ts
// Extracted by opm-extracted/tools/extract.mjs

class Set {
  constructor(set) {
    this.set = set;
  }
  contains(type) {
    return this.set.includes(type);
  }
}
function createSet(...set) {
  return new Set(set);
}
