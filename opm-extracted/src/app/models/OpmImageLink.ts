// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/OpmImageLink.ts
// Extracted by opm-extracted/tools/extract.mjs

class OpmImageLink extends joint.shapes.devs.Link.extend({
  defaults: shared._.defaultsDeep({
    type: "opm.image.link",
    attrs: {
      ".connection": {
        "stroke-width": 6,
        opacity: 0.5
      },
      ".marker-target": {
        fill: "darkGrey",
        stroke: "darkGrey",
        d: "M 0 0 L -40 -15 L 0 -30 z",
        opacity: 1,
        transform: "scale(0.5)"
      }
    }
    // labels: [
    //   { position: .5, attrs: { text: { text: '', 'font-weight': 'bold' } } }
    // ]
  }, joint.shapes.devs.Link.prototype.defaults)
}) {
  constructor(obj) {
    super(obj);
  }
  doubleClickHandle(cellView, options) {}
  pointerUpHandle(cellView, options) {}
  changeAttributesHandle(options) {}
  changeSizeHandle(initRappid) {}
  changePositionHandle(initRappid) {}
  removeHandle(options) {}
  rightClickhandle(options) {}
  addHandle(options) {
    const cellView = options.paper.findViewByModel(this);
    cellView.el.firstElementChild.style.stroke = "darkGrey";
    cellView.removeTools();
  }
  pointerDownHandle() {}
  getParams() {}
  setLinkTools(linkView) {
    $(".marker-arrowhead").remove();
    $(".tool-remove").remove();
    $(".marker-vertices").remove();
  }
}