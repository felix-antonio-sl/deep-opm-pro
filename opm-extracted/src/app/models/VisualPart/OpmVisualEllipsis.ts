// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/VisualPart/OpmVisualEllipsis.ts
// Extracted by opm-extracted/tools/extract.mjs

class OpmVisualEllipsis {
  constructor(params, logicalElement) {
    this.logicalElement = logicalElement;
    if (params) {
      this.id = params.id;
      this.setParams(params);
    }
  }
  setParams(params) {
    this.width = params.width;
    this.height = params.height;
    this.xPos = params.xPos;
    this.yPos = params.yPos;
  }
  express(checked) {
    return this.fatherObject.expressChecked(checked);
  }
  remove() {
    this.logicalElement.remove(this);
    return this;
  }
  getMissingStates() {
    const logStatesNames = this.fatherObject.logicalElement.states.map(s => s.getBareName());
    const visStatesNames = this.fatherObject.states.map(s => s.logicalElement.getBareName());
    return logStatesNames.filter(s => !visStatesNames.includes(s));
  }
  setDefaultPosition() {
    const padding = 10;
    this.xPos = this.fatherObject.xPos + this.fatherObject.width - this.width - padding;
    this.yPos = this.fatherObject.yPos + this.fatherObject.height - this.height - padding;
    const between = function (a, b, c) {
      return a <= b && b <= c;
    };
    const intersect = function (ellipsis, state) {
      return (between(state.xPos, ellipsis.xPos, state.xPos + state.width) || between(state.xPos, ellipsis.xPos + ellipsis.xPos + ellipsis.width, state.xPos + state.width)) && (between(state.yPos, ellipsis.yPos, state.yPos + state.height) || between(state.yPos, ellipsis.yPos + ellipsis.height, state.yPos + state.height));
    };
    const intersect_cell = this.fatherObject.states.find(state => intersect(this, state));
    if (intersect_cell) {
      const padding = 10;
      this.xPos = intersect_cell.xPos + intersect_cell.width + padding;
      this.fatherObject.width += this.width + padding;
    }
    return this;
  }
  getDisplayText() {
    return this.logicalElement.getDisplayText();
  }
}
