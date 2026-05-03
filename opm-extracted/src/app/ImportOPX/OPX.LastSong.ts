// Source: decompiled/deobfuscated.js
// Original path: ./src/app/ImportOPX/OPX.LastSong.ts
// Extracted by opm-extracted/tools/extract.mjs

function ImportOpx_LastSong(opxJson, options, opxModel) {
  opxModel = new OPXModel(opxJson);
  let log = opxModel.log;
  let checklog = Checker;
  CreateOpmLogModel(log, opxModel.ImportedOpmModel);
  options.modelService.model = opxModel.ImportedOpmModel;
  options.setModelName(log[15].name);
  for (let i = 1; i < options.opmModel.opds.length; i++) {
    options.treeViewService.createNewNode(options.opmModel.opds[i].id, options.opmModel.opds[i].parendId, options.opmModel.opds[i].name);
  }
  //Overlapping(options.opmModel);
  options.treeViewService.treeView.treeModel.getNodeById("SD").toggleActivated();
  options.treeViewService.treeView.treeModel.getNodeById("SD").parent.expand();
  options.graphService.renderGraph(options.opmModel.opds[0], options);
  options.opmModel.setCurrentOpd("SD");
  consistStates(options.opmModel.logicalElements);
  return {
    Log: log,
    CheckLog: checklog,
    data: ""
  };
}
function Overlapping(opmModel) {
  let padding = 2;
  let l1;
  let r1;
  let l2;
  let r2;
  for (let opd of opmModel.opds) {
    for (let index1 = 0; index1 < opd.visualElements.length; index1++) {
      if (opd.visualElements[index1] instanceof OpmVisualThing) {
        let rect1 = opd.visualElements[index1];
        l1 = new API.Position(rect1.xPos, rect1.yPos);
        r1 = new API.Position(rect1.xPos + rect1.width, rect1.yPos + rect1.height);
        for (let index2 = index1 + 1; index2 < opd.visualElements.length; index2++) {
          if (opd.visualElements[index2] instanceof OpmVisualThing) {
            let rect2 = opd.visualElements[index2];
            l2 = new API.Position(rect2.xPos, rect2.yPos);
            r2 = new API.Position(rect2.xPos + rect2.width, rect2.yPos + rect2.height);
            console.log(doOverlap(l1, r1, l2, r2));
          }
        }
      }
    }
  }
}
function OverlappingChildren(parent, children) {
  for (let child of children) {
    child.xPos = child.xPos + parent.xPos;
    child.yPos = child.yPos + parent.yPos;
  }
}
/**
 * l1: Top Left coordinate of first rectangle.
 r1: Bottom Right coordinate of first rectangle.
 l2: Top Left coordinate of second rectangle.
 r2: Bottom Right coordinate of second rectangle.
 * @param {Position} l1
 * @param {Position} r1
 * @param {Position} l2
 * @param {Position} r2
 */
function doOverlap(l1, r1, l2, r2) {
  // If one rectangle is on left side of other
  let padding = 2;
  if (l1.x > r2.x || l2.x > r1.x) {
    return false;
  }
  // If one rectangle is above other
  if (l1.y < r2.y || l2.y < r1.y) {
    return false;
  }
  return true;
}
