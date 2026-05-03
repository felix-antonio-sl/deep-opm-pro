// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/Links/EffectLink.ts
// Extracted by opm-extracted/tools/extract.mjs

class EffectLink extends OpmProceduralLink {
  constructor(sourceElement, targetElement, condition, event, negation, id) {
    super(sourceElement, targetElement, condition, event, negation, id);
    // this.attr({'.marker-source' : {fill: 'white', d: 'M 20,33 L 0,25 L 20,17 L 12,25 Z M12,25 L20,25'}});
    // this.attr({'.marker-target' : {fill: 'white', d: 'M 20,33 L 0,25 L 20,17 L 12,25 Z M12,25 L20,25'}});
    this.attr("line/sourceMarker", {
      type: "path",
      fill: "white",
      stroke: "#586D8C",
      strokeWidth: 2,
      d: "M0,0 L23,8 L12,0 L23,-8 L0,0"
      // points:'0,0 23,8 12,0 23,-8 0,0'
    });
    this.attr("line/targetMarker", {
      type: "path",
      // SVG polygon
      fill: "white",
      stroke: "#586D8C",
      strokeWidth: 2,
      d: "M0,0 L23,8 L12,0 L23,-8 L0,0"
      // points:'0,0 23,8 12,0 23,-8 0,0 '
    });
    if (condition) {
      if (negation) {
        this.attributes.name = "Effect_Condition_Negation";
      } else {
        this.attributes.name = "Effect_Condition";
      }
    } else if (event) {
      this.attributes.name = "Effect_Event";
    } else if (negation) {
      this.attributes.name = "Effect_Negation";
    } else {
      this.attributes.name = "Effect";
    }
  }
  getParams() {
    const params = {
      linkType: linkType.Effect
    };
    return {
      ...super.getProceduralLinkParams(),
      ...params
    };
  }
  clone() {
    return new EffectLink(this.sourceElement, this.targetElement, this.condition, this.event, this.negation);
  }
  getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton) {
    const that = this;
    const switchInOutButton = this.switchEffectButton();
    switchInOutButton.options.action = () => that.switchToInOutLinkPairs();
    const init = (0, getInitRappidShared)();
    const model = init.getOpmModel();
    const source = init.graph.getCell(this.get("source").id);
    const target = init.graph.getCell(this.get("target").id);
    const object = source instanceof OpmObject ? source : target;
    const process = source instanceof OpmObject ? target : source;
    const visualProcess = model.getVisualElementById(process.id);
    if (source instanceof OpmSemifoldedFundamental || target instanceof OpmSemifoldedFundamental) {
      return super.getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton);
    }
    const shouldShowButton = model.links.isHavingHiddenInOuts(model.getVisualElementById(this.get("source").id), model.getVisualElementById(this.get("target").id));
    const shouldShowButton2 = model.links.isHavingVisibleInOuts(model.getVisualElementById(this.get("source").id), model.getVisualElementById(this.get("target").id));
    const term1 = shouldShowButton.ins.filter(l => l.type !== linkType.Effect).length > 0 && shouldShowButton.outs.filter(l => l.type !== linkType.Effect).length > 0;
    const term2 = shouldShowButton2.ins.filter(l => l.type !== linkType.Effect).length < 1 && shouldShowButton2.outs.filter(l => l.type !== linkType.Effect).length < 1;
    if ((term1 || term2) && (object.getStatesOnly().length > 1 || shouldShowButton.isHaving)) {
      return super.getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton).concat([switchInOutButton]);
    }
    return super.getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton);
  }
  popupContentDbClick() {
    const rate = this.attributes.rate ? this.attributes.rate : "";
    const rateUnits = this.attributes.rateUnits ? this.attributes.rateUnits : "";
    return super.popupContentDbClick().concat(["<div style=\"height: 16px\"><div class=\"textAndInput\">Rate: <input size=\"2\" class=\"PopupInput rate\" value=\"" + rate.trim() + "\"></div><span  class=\"iconSpan\" data-title=\"" + this.getRatePopupTooltipText() + "\"><img class=\"questionMarkForInfo\" src=\"assets/SVG/questionmark.svg\"></span></div><br>", "<div style=\"height: 16px\"><div class=\"textAndInput\">Units: <input size=\"2\" class=\"PopupInput rateUnits\" value=\"" + rateUnits.trim() + "\"></div><span  class=\"iconSpan\" data-title=\"" + this.getRateUnitsPopupTooltipText() + "\"><img class=\"questionMarkForInfo\" src=\"assets/SVG/questionmark.svg\"></span></div><br>", this.getRequirementsPopupContent()]);
  }
  removeHandle(options) {
    super.removeHandle(options);
    const init = (0, getInitRappidShared)();
    const model = init.getOpmModel();
    const show = [];
    const opdLinks = model.currentOpd.visualElements.filter(v => v instanceof OpmLink);
    for (const vis of opdLinks) {
      if (vis.visible === true && !init.graph.getCell(vis.id)) {
        show.push(vis);
      }
    }
    // for fixing rappid's bug the temporary solution is:
    setTimeout(function () {
      init.getGraphService().updateLinksView(show);
    }, 10);
    // instead of:
    // init.getGraphService().updateLinksView(show);
  }
  switchToInOutLinkPairs() {
    const init = (0, getInitRappidShared)();
    const process = this.getSourceElement() instanceof OpmProcess ? this.getSourceElement() : this.getTargetElement();
    const object = this.getSourceElement() instanceof OpmProcess ? this.getTargetElement() : this.getSourceElement();
    const model = init.getOpmModel();
    const visualEffect = model.getVisualElementById(this.id);
    object.expressAllAction(model.getVisualElementById(object.id), init);
    const ret = model.links.switchEffectToInOuts(visualEffect);
    $("[joint-selector=button]").hide();
    $("[data-tool-name=source-arrowhead]").hide();
    $("[data-tool-name=target-arrowhead]").hide();
    init.graphService.updateLinksView(ret.show || []);
    this.remove();
    Arc.redrawAllArcs(process, init, true);
  }
  getRatePopupTooltipText() {
    return "The rate in [units/time units] of affecting  the Affectee by the Process";
  }
}