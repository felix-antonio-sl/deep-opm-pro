// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/Links/ConsumptionLink.ts
// Extracted by opm-extracted/tools/extract.mjs

let ConsumptionLink = /*#__PURE__*/(() => {
  class ConsumptionLink extends OpmProceduralLink {
    static #_ = (() => this.counter = 0)();
    constructor(sourceElement, targetElement, condition, event, negation, id, partner) {
      super(sourceElement, targetElement, condition, event, negation, id);
      // TODO: find and insert
      // this.partner = partner;
      this.attr("line/targetMarker", {
        type: "path",
        fill: "white",
        stroke: "#586D8C",
        strokeWidth: 2,
        d: "M0,0 L23,8 L12,0 L23,-8 L0,0"
      });
      if (condition) {
        if (negation) {
          this.attributes.name = "Consumption_Condition_Negation";
        } else {
          this.attributes.name = "Consumption_Condition";
        }
      } else if (event) {
        this.attributes.name = "Consumption_Event";
      } else if (negation) {
        this.attributes.name = "Consumption_Negation";
      } else {
        this.attributes.name = "Consumption";
      }
    }
    getParams() {
      const params = {
        linkType: linkType.Consumption,
        partner: null
      };
      return {
        ...super.getProceduralLinkParams(),
        ...params
      };
    }
    clone() {
      return new ConsumptionLink(this.sourceElement, this.targetElement, this.condition, this.event, this.negation);
    }
    popupContentDbClick() {
      const rate = this.attributes.rate ? this.attributes.rate : "";
      const rateUnits = this.attributes.rateUnits ? this.attributes.rateUnits : "";
      const content = super.popupContentDbClick().concat(["<div style=\"height: 16px\"><div class=\"textAndInput\">Rate: <input size=\"2\" class=\"PopupInput rate\" value=\"" + rate.trim() + "\"></div><span  class=\"iconSpan\" data-title=\"" + this.getRatePopupTooltipText() + "\"><img class=\"questionMarkForInfo\" src=\"assets/SVG/questionmark.svg\"></span></div><br>", "<div style=\"height: 16px\"><div class=\"textAndInput\">Units: <input size=\"2\" class=\"PopupInput rateUnits\" value=\"" + rateUnits.trim() + "\"></div><span  class=\"iconSpan\" data-title=\"" + this.getRateUnitsPopupTooltipText() + "\"><img class=\"questionMarkForInfo\" src=\"assets/SVG/questionmark.svg\"></span></div><br>"]);
      const remove = content.find(row => row.includes("Target Multiplicity"));
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
        ConsumptionLink.counter = ConsumptionLink.counter % 26;
        return ++ConsumptionLink.counter;
      }
    }
    removeHandle(options) {
      super.removeHandle(options);
      // this.removePath();
    }
    getMates() {
      const process = this.targetElement;
      const state = this.sourceElement;
      const object = state.attributes.father;
      const path = this.attributes.Path;
      if (state.attributes.type !== "opm.State") {
        return [];
      }
      // return process.graph.getConnectedLinks(process, { outbound: true }).filter(l => l.targetElement.attributes.father === object && path === l.attributes.Path && l instanceof ResultLink);
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
      return "The rate in [units/time units] of consuming the Consumee by the Process";
    }
  }
  return ConsumptionLink;
})();