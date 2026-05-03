// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/Links/AgentLink.ts
// Extracted by opm-extracted/tools/extract.mjs

class AgentLink extends OpmProceduralLink {
  constructor(sourceElement, targetElement, condition, event, negation, id) {
    super(sourceElement, targetElement, condition, event, negation, id);
    // this.attr({'.marker-target' : {fill: 'black', d: 'M 0 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 M 10,0'}});
    this.attr("line/targetMarker", {
      type: "circle",
      // SVG Circle
      fill: "#586D8C",
      stroke: "#586D8C",
      r: 5,
      cx: 5
    });
    if (condition) {
      if (negation) {
        this.attributes.name = "Agent_Condition_Negation";
      } else {
        this.attributes.name = "Agent_Condition";
      }
    } else if (event) {
      this.attributes.name = "Agent_Event";
    } else if (negation) {
      this.attributes.name = "Agent_Negation";
    } else {
      this.attributes.name = "Agent";
    }
  }
  getParams() {
    const params = {
      linkType: linkType.Agent
    };
    return {
      ...super.getProceduralLinkParams(),
      ...params
    };
  }
  clone() {
    return new AgentLink(this.sourceElement, this.targetElement, this.condition, this.event, this.negation);
  }
  updateMarkersColor(color = "#586D8C") {
    super.updateMarkersColor(color);
    this.attr("line/targetMarker/fill", color);
  }
  getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton) {
    return this.getEnablersToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton);
  }
  getSourceMultiplicityPopupTooltipText() {
    return "The integer number or parameter of instances of Object required by the Process, if greater than 1";
  }
}