// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/Links/ResultLink.ts
// Extracted by opm-extracted/tools/extract.mjs

let ResultLink = /*#__PURE__*/(() => {
  class ResultLink extends OpmProceduralLink {
    static #_ = (() => this.counter = 0)();
    constructor(sourceElement, targetElement, condition, event, id, partner) {
      super(sourceElement, targetElement, condition, event, id);
      this.partner = partner;
      // this.attr({'.marker-source' : {d: ''}});
      //  this.attr({'.marker-target' : {fill: 'white', d: 'M 20,33 L 0,25 L 20,17 L 12,25 Z M12,25 L20,25'}});
      this.attr("line/targetMarker", {
        type: "path",
        fill: "white",
        stroke: "#586D8C",
        strokeWidth: 2,
        d: "M0,0 L23,8 L12,0 L23,-8 L0,0"
      });
      if (condition) {
        this.attributes.name = "Condition_Result";
      } else if (event) {
        this.attributes.name = "Event_Result";
      } else {
        this.attributes.name = "Result";
      }
    }
    getParams() {
      const params = {
        linkType: linkType.Result
      };
      return {
        ...super.getProceduralLinkParams(),
        ...params
      };
    }
    clone() {
      return new ResultLink(this.sourceElement, this.targetElement, this.condition, this.event);
    }
    popupContentDbClick() {
      const rate = this.attributes.rate ? this.attributes.rate : "";
      const rateUnits = this.attributes.rateUnits ? this.attributes.rateUnits : "";
      const content = super.popupContentDbClick().concat(["<div style=\"height: 16px\"><div class=\"textAndInput\">Rate: <input size=\"2\" class=\"PopupInput rate\" value=\"" + rate.trim() + "\"></div><span  class=\"iconSpan\" data-title=\"" + this.getRatePopupTooltipText() + "\"><img class=\"questionMarkForInfo\" src=\"assets/SVG/questionmark.svg\"></span></div><br>", "<div style=\"height: 16px\"><div class=\"textAndInput\">Units: <input size=\"2\" class=\"PopupInput rateUnits\" value=\"" + rateUnits.trim() + "\"></div><span  class=\"iconSpan\" data-title=\"" + this.getRateUnitsPopupTooltipText() + "\"><img class=\"questionMarkForInfo\" src=\"assets/SVG/questionmark.svg\"></span></div><br>"]);
      const remove = content.find(row => row.includes("Source Multiplicity"));
      for (let index = content.length - 1; index >= 0; index--) {
        if (content[index] === remove) {
          content.splice(index, 1);
        }
      }
      content.push(this.getRequirementsPopupContent());
      return content;
    }
    getCounter() {
      if (this.partner) {
        ResultLink.counter = ResultLink.counter % 26;
        return ++ResultLink.counter;
      }
    }
    removeHandle(options) {
      super.removeHandle(options);
      // this.removePath();
    }
    getMates() {
      const process = this.sourceElement;
      const state = this.targetElement;
      const object = state.attributes.father;
      const path = this.attributes.Path;
      if (state.attributes.type !== "opm.State") {
        return [];
      }
      // return process.graph.getConnectedLinks(process, { inbound: true }).filter(l => l.sourceElement.attributes.father === object && path === l.attributes.Path && l instanceof ConsumptionLink);
    }
    getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton) {
      const that = this;
      const switchInOutButton = this.switchEffectButton();
      switchInOutButton.options.action = () => that.switchToEffectLink();
      const model = (0, getInitRappidShared)().getOpmModel();
      const visLink = model.getVisualElementById(this.id);
      if (!visLink) {
        return [];
      }
      const shouldShow = model.links.isHavingVisibleInOuts(visLink.sourceVisualElement, visLink.targetVisualElements[0].targetVisualElement);
      if (shouldShow.isHaving) {
        return super.getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton).concat([switchInOutButton]);
      } else {
        return super.getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton);
      }
    }
    switchToEffectLink() {
      const init = (0, getInitRappidShared)();
      const model = init.getOpmModel();
      const ret = model.links.switchInOutsToEffect(model.getVisualElementById(this.id));
      if (ret.success === true) {
        init.graphService.updateLinksView(ret.show || []);
        for (const link of ret.hide) {
          const linkCell = init.graph.getCell(link.id);
          // removing from the graph but not from the model!
          if (linkCell) {
            linkCell.remove();
          }
        }
      }
    }
    getRatePopupTooltipText() {
      return "The rate in [units/time units] of creating the Resultee by the Process";
    }
  }
  return ResultLink;
})();
