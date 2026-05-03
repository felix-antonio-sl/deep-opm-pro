// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/Links/OvertimeExceptionLink.ts
// Extracted by opm-extracted/tools/extract.mjs

class OvertimeExceptionLink extends OpmProceduralLink {
  constructor(sourceElement, targetElement, condition, event, id) {
    super(sourceElement, targetElement, condition, event, id);
    // this.attr({'.marker-source' : {d: ''}});
    //this.attr({'.marker-target' : {d: 'M30,46 L46,26 M26,36 L50,36'}});
    this.attr("line/targetMarker", {
      type: "polyline",
      // SVG polyline
      fill: "none",
      stroke: "#586D8C",
      strokeWidth: 2,
      points: "4,10 13,-10 "
    });
    this.attributes.name = "Overtime_exception";
  }
  getParams() {
    const params = {
      linkType: linkType.OvertimeException
    };
    return {
      ...super.getProceduralLinkParams(),
      ...params
    };
  }
  getSourceMultiplicityPopupTooltipText() {
    return "The integer number or parameter of instances of initiating processes that didn't complete successfully to invoke the target process, if greater than 1";
  }
  getTargetMultiplicityPopupTooltipText() {
    return "The integer number or parameter of instances of destination processes to be invoked, if greater than 1";
  }
}
