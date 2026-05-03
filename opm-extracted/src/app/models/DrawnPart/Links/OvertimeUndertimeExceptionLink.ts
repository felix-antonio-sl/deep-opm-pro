// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/Links/OvertimeUndertimeExceptionLink.ts
// Extracted by opm-extracted/tools/extract.mjs

class OvertimeUndertimeExceptionLink extends OpmProceduralLink {
  constructor(sourceElement, targetElement, condition, event, id) {
    super(sourceElement, targetElement, condition, event, id);
    // this.attr({'.marker-source' : {d: ''}});
    // this.attr({'.marker-target' : {d: 'M30,46 L46,26 M40,46 L56,26 M60,46 L76,26 M26,36 L80,36'}});
    this.attr("line/targetMarker", {
      type: "polyline",
      // SVG polyline
      fill: "none",
      stroke: "#586D8C",
      strokeWidth: 2,
      points: "4,10 13,-10 8.5,0 17,0 13,10 22,-10 17.5,0 32,0 28,10 37,-10"
    });
    this.attributes.name = "OvertimeUndertime-exception";
  }
  getParams() {
    const params = {
      linkType: linkType.UndertimeOvertimeException
    };
    return {
      ...super.getProceduralLinkParams(),
      ...params
    };
  }
}