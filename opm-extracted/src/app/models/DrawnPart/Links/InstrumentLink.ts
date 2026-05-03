// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/Links/InstrumentLink.ts
// Extracted by opm-extracted/tools/extract.mjs

class InstrumentLink extends OpmProceduralLink {
  constructor(sourceElement, targetElement, condition, event, negation, id) {
    super(sourceElement, targetElement, condition, event, negation, id);
    //  this.attr({'.marker-source' : {d: ''}});
    // this.attr({'.marker-target' : {fill: 'white', d: 'M 0 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 M 10,0'}});
    this.attr("line/targetMarker", {
      type: "circle",
      // SVG Circle
      fill: "white",
      stroke: "#586D8C",
      strokeWidth: 2,
      r: 5,
      cx: 5
    });
    if (condition) {
      if (negation) {
        this.attributes.name = "Instrument_Condition_Negation";
      } else {
        this.attributes.name = "Instrument_Condition";
      }
    } else if (event) {
      this.attributes.name = "Instrument_Event";
    } else if (negation) {
      this.attributes.name = "Instrument_Negation";
    } else {
      this.attributes.name = "Instrument";
    }
  }
  getParams() {
    const params = {
      linkType: linkType.Instrument
    };
    return {
      ...super.getProceduralLinkParams(),
      ...params
    };
  }
  clone() {
    return new InstrumentLink(this.sourceElement, this.targetElement, this.condition, this.event, this.negation);
  }
  getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton) {
    return this.getEnablersToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton);
  }
  getSourceMultiplicityPopupTooltipText() {
    return "The integer number or parameter of instances of Object required by the Process, if greater than 1";
  }
}