// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/services/penManager.ts
// Extracted by opm-extracted/tools/extract.mjs

class PenManager {
  constructor() {
    this.isInPenMode = false;
    this.penDrawing = [];
  }
  get isPenMode() {
    return this.isInPenMode;
  }
  set isPenMode(val) {
    this.isInPenMode = val;
  }
  togglePenMode() {
    this.isInPenMode = !this.isInPenMode;
  }
  get penDrawingSvg() {
    return this.penDrawing;
  }
  resetPenDrawing() {
    this.penDrawing = [];
  }
  addDrawingSvg(svg) {
    this.penDrawing.push(svg);
  }
  get lastMovementTime() {
    return this.lastMovement;
  }
  set lastMovementTime(time) {
    this.lastMovement = time;
  }
}