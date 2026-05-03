// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/OpmModelMetaData.ts
// Extracted by opm-extracted/tools/extract.mjs

class OpmModelMetaData {
  constructor(opmModel) {
    this.opmModel = opmModel;
  }
  toJSON() {
    return null;
  }
  getNumberOfModelLogicalThings() {
    return this.opmModel.logicalElements.filter(elm => elm instanceof OpmLogicalThing).length;
  }
  getNumberOfModelVisualThings() {
    const logicalThings = this.opmModel.logicalElements.filter(elm => elm instanceof OpmLogicalThing);
    let counter = 0;
    for (let k = 0; k < logicalThings.length; k++) {
      counter += logicalThings[k].visualElements.length;
    }
    return counter;
  }
  getNumberOfModelLogicalObjects() {
    const logicalObjects = this.opmModel.logicalElements.filter(elm => elm instanceof OpmLogicalObject);
    return logicalObjects.length;
  }
  getNumberOfModelVisualObjects() {
    const logicalObjects = this.opmModel.logicalElements.filter(elm => elm instanceof OpmLogicalObject);
    return logicalObjects.reduce(function (total, logicalObject) {
      return total + logicalObject.visualElements.length;
    }, 0);
  }
  getNumberOfModelLogicalProcesses() {
    const logicalProcesses = this.opmModel.logicalElements.filter(elm => elm instanceof OpmLogicalProcess);
    return logicalProcesses.length;
  }
  getNumberOfModelVisualProcesses() {
    const logicalProcesses = this.opmModel.logicalElements.filter(elm => elm instanceof OpmLogicalProcess);
    return logicalProcesses.reduce(function (total, logicalProcesses) {
      return total + logicalProcesses.visualElements.length;
    }, 0);
  }
  getNumberOfModelStructuralRelations() {
    const logicalRelations = this.opmModel.logicalElements.filter(elm => elm instanceof OpmStructuralRelation);
    return logicalRelations.length;
  }
  getNumberOfModelProceduralRelations() {
    const logicalRelations = this.opmModel.logicalElements.filter(elm => elm instanceof OpmProceduralRelation);
    return logicalRelations.length;
  }
  getNumberOfModelStructuralLinks() {
    const structuralRelations = this.opmModel.logicalElements.filter(elm => elm instanceof OpmStructuralRelation);
    return structuralRelations.reduce(function (total, relation) {
      return total + relation.visualElements.length;
    }, 0);
  }
  getNumberOfModelProceduralLinks() {
    const proceduralRelations = this.opmModel.logicalElements.filter(elm => elm instanceof OpmProceduralRelation);
    return proceduralRelations.reduce(function (total, relation) {
      return total + relation.visualElements.length;
    }, 0);
  }
  getOpdHeight(opd) {
    if (opd.children.length === 0) {
      return 0;
    }
    let h = 0;
    for (let i = 0; i < opd.children.length; i++) {
      let ch = this.getOpdHeight(opd.children[i]);
      if (ch > h) {
        h = ch;
      }
    }
    return h + 1;
  }
  getMaxNestingLevel() {
    return this.getOpdHeight(this.opmModel.opds[0]);
  }
  getOPDsNumber() {
    return this.opmModel.opds.length;
  }
  show() {
    console.log(this.getString());
  }
  getString() {
    const numberOfModelLogicalObjects = this.getNumberOfModelLogicalObjects();
    const numberOfModelVisualObjects = this.getNumberOfModelVisualObjects();
    const numberOfModelLogicalProcesses = this.getNumberOfModelLogicalProcesses();
    const numberOfModelVisualProcesses = this.getNumberOfModelVisualProcesses();
    const numberOfModelLogicalThings = numberOfModelLogicalObjects + numberOfModelLogicalProcesses;
    const numberOfModelVisualThings = numberOfModelVisualObjects + numberOfModelVisualProcesses;
    const numberOfModelStructuralRelations = this.getNumberOfModelStructuralRelations();
    const numberOfModelProceduralRelations = this.getNumberOfModelProceduralRelations();
    const numberOfModelStructuralLinks = this.getNumberOfModelStructuralLinks();
    const numberOfModelProceduralLinks = this.getNumberOfModelProceduralLinks();
    const numberOfModelLogicalElements = numberOfModelStructuralRelations + numberOfModelProceduralRelations + numberOfModelLogicalThings;
    const numberOfModelVisualElements = numberOfModelStructuralLinks + numberOfModelProceduralLinks + numberOfModelVisualThings;
    let content = "";
    content = content + "Logical objects:" + numberOfModelLogicalObjects + "\n";
    content = content + "Visual objects:" + numberOfModelVisualObjects + "\n";
    content = content + "Logical processes:" + numberOfModelLogicalProcesses + "\n";
    content = content + "Visual processes:" + numberOfModelVisualProcesses + "\n";
    content = content + "Logical things:" + numberOfModelLogicalThings + "\n";
    content = content + "Visual things:" + numberOfModelVisualThings + "\n";
    content = content + "Structural relations:" + numberOfModelStructuralRelations + "\n";
    content = content + "Procedural relations:" + numberOfModelProceduralRelations + "\n";
    content = content + "Structural links:" + numberOfModelStructuralLinks + "\n";
    content = content + "Procedural links:" + numberOfModelProceduralLinks + "\n";
    content = content + "Logical elements:" + numberOfModelLogicalElements + "\n";
    content = content + "Visual elements:" + numberOfModelVisualElements + "\n";
    content = content + "OPDs:" + this.getOPDsNumber() + "\n";
    content = content + "Max. nesting level:" + this.getMaxNestingLevel();
    return content;
  }
}
