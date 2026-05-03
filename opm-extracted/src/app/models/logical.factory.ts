// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/logical.factory.ts
// Extracted by opm-extracted/tools/extract.mjs

function logicalFactoryInsertCurrentOPD(type, opmModel, params) {
  const logical = opmModel.logicalFactory(type, params);
  opmModel.currentOpd.add(logical.visualElements[0]);
  return logical;
}
function logicalFactory(type, opmModel, params) {
  let logical;
  switch (type) {
    case EntityType.Object:
      logical = new OpmLogicalObject(params, opmModel);
      break;
    case EntityType.Process:
      logical = new OpmLogicalProcess(params, opmModel);
      break;
    case EntityType.State:
      logical = new OpmLogicalState(params, opmModel);
      break;
    case RelationType.Procedural:
      logical = new OpmProceduralRelation(params, opmModel);
      break;
    case RelationType.Tagged:
      logical = new OpmTaggedRelation(params, opmModel);
      break;
    case RelationType.Fundamental:
      logical = new OpmFundamentalRelation(params, opmModel);
      break;
  }
  if (params) {
    logical.updateParams(params);
    logical.visualElements[0]?.updateParams(params);
  }
  if (!logical.lid) {
    logical.generateId();
  }
  return logical;
}
