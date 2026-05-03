// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/Links/UndertimeExceptionLink.ts
// Extracted by opm-extracted/tools/extract.mjs

class UndertimeExceptionLink extends OpmProceduralLink {
  constructor(sourceElement, targetElement, condition, event, id) {
    super(sourceElement, targetElement, condition, event, id);
    // this.attr({'.marker-source' : {d: ''}});
    // this.attr({'.marker-target' : {d: 'M30,46 L46,26 M40,46 L56,26 M26,36 L60,36'}});
    this.attr("line/targetMarker", {
      type: "polyline",
      // SVG polyline
      fill: "none",
      stroke: "#586D8C",
      strokeWidth: 2,
      points: "4,10 13,-10 8.5,0 17,0 13,10 22,-10"
    });
    this.attributes.name = "Undertime_exception";
  }
  getParams() {
    const params = {
      linkType: linkType.UndertimeException
    };
    return {
      ...super.getProceduralLinkParams(),
      ...params
    };
  }
}