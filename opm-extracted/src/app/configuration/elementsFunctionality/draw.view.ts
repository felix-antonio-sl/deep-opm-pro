// Source: decompiled/deobfuscated.js
// Original path: ./src/app/configuration/elementsFunctionality/draw.view.ts
// Extracted by opm-extracted/tools/extract.mjs

function draw(visual) {
  const drawn = factory(visual.type);
  drawn.updateParamsFromOpmModel(visual);
  return drawn;
}
function putToGraph(graph, visual) {
  const drawn = draw(visual);
  graph.addCell(drawn);
  drawn.updateView(visual);
  return drawn;
}
function factory(type) {
  switch (type) {
    case EntityType.Object:
      return new OpmObject();
    case EntityType.Process:
      return new OpmProcess();
    case EntityType.State:
      return new OpmState();
  }
}
