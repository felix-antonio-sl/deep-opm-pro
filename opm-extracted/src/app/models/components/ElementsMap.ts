// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/components/ElementsMap.ts
// Extracted by opm-extracted/tools/extract.mjs

class ElementsMap {
  constructor(map) {
    this.map = map;
  }
  get(id) {
    if (!id) {
      return undefined;
    }
    const visual = this.map.get(id);
    if (!visual) {
      throw new Error("element with id " + id + " was not found");
    }
    return visual;
  }
}