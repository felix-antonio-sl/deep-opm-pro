// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/Links/InvocationLink.ts
// Extracted by opm-extracted/tools/extract.mjs

function makeInvocationLinkVertices(src, dst, fixSrc, fixDst) {
  const delta = {
    dx: dst.x - src.x,
    dy: dst.y - src.y
  };
  const linkLength = Math.sqrt(delta.dx * delta.dx + delta.dy * delta.dy);
  const displacement = Math.max(5, Math.min(linkLength * 15 / 500, 10));
  const extension = Math.max(1, Math.min(linkLength * 8 / 500, 5));
  let zapRatio = 0.5;
  if (fixSrc || fixDst) {
    zapRatio = (linkLength + fixSrc - fixDst) / (linkLength * 2);
  }
  const partSrc = {
    x: delta.dx * zapRatio + extension * delta.dx / linkLength,
    y: delta.dy * zapRatio + extension * delta.dy / linkLength
  };
  const partDst = {
    x: delta.dx * (1 - zapRatio) + extension * delta.dx / linkLength,
    y: delta.dy * (1 - zapRatio) + extension * delta.dy / linkLength
  };
  const slope = -displacement / linkLength;
  // rotate it by the given slope
  const arc = Math.atan(slope);
  const sin = Math.sin(arc);
  const cos = Math.cos(arc);
  partSrc.x = cos * partSrc.x - sin * partSrc.y;
  partSrc.y = sin * partSrc.x + cos * partSrc.y;
  partDst.x = cos * partDst.x - sin * partDst.y;
  partDst.y = sin * partDst.x + cos * partDst.y;
  // this calculation will help to keep additional break points to be positioned symetrically.
  const partSrcLen = Math.min(Math.sqrt(Math.pow(partSrc.x, 2) + Math.pow(partSrc.y, 2)));
  const partDstLen = Math.sqrt(Math.pow(partDst.x, 2) + Math.pow(partDst.y, 2));
  const breakLen = Math.max(Math.min(partSrcLen, partDstLen) * 0.1, 20);
  const partSrcRatio = 1 - breakLen / partSrcLen;
  const partDstRatio = 1 - breakLen / partDstLen;
  return [{
    x: partSrc.x * partSrcRatio + src.x,
    y: partSrc.y * partSrcRatio + src.y
  }, {
    x: partSrc.x + src.x,
    y: partSrc.y + src.y
  }, {
    x: dst.x - partDst.x,
    y: dst.y - partDst.y
  }, {
    x: dst.x - partDst.x * partDstRatio,
    y: dst.y - partDst.y * partDstRatio
  }];
}
class InvocationLink extends OpmProceduralLink {
  /**
   * Applied vector operation between two vectors having x and y members.
   *
   * @param v1 first vector
   * @param v2 second vector operand. If not an object, than it is a scalar operand for a scalar operation on the
   * first vector v1.
   * @param oper may be '+', '-', '*', or '='. If '='it replaces v1 values with v2 (meaningful if self is true. Default to '+'
   * @param self if true, v1 is changed in-place, otherwise v1 is not changed. Default to false;
   * @returns the result as a vector, or v1 if self is true.
   */
  static operVectors(v1, v2, oper = "+", self = false) {
    if (typeof v2 !== "object") {
      v2 = {
        x: v2,
        y: v2
      };
    }
    let result = v1;
    if (!self) {
      result = {
        x: 0,
        y: 0
      };
    }
    switch (oper) {
      case "-":
        result.x = v1.x - v2.x;
        result.y = v1.y - v2.y;
        break;
      case "*":
        result.x = v1.x * v2.x;
        result.y = v1.y * v2.y;
        break;
      case "=":
        result.x = v2.x;
        result.y = v2.y;
        break;
      case "+":
      default:
        result.x = v1.x + v2.x;
        result.y = v1.y + v2.y;
    }
    return result;
  }
  constructor(sourceElement, targetElement, condition, event, id, sPort, tPort) {
    super(sourceElement, targetElement, condition, event, id);
    // this.attr({ interactive: { vertexAdd: false, vertexMove: false } });
    this.attr("line/targetMarker", {
      type: "polygon",
      // SVG polygon
      fill: "white",
      stroke: "#586D8C",
      strokeWidth: 2,
      points: "0,0 23,8 12,0 23,-8 0,0 "
    });
    this.attributes.name = "Invocation";
    this.on("change:source", (a, b, c) => {
      if (b.x == undefined && b.y == undefined) {
        this.UpdateVertices();
      } else {
        this.UpdateVertices(b);
      }
    });
    this.on("change:target", (a, b, c) => {
      if (b.x == undefined && b.y == undefined) {
        this.UpdateVertices();
      } else {
        this.UpdateVertices(undefined, b);
      }
    });
  }
  // addHandle(initRappid) {
  //   const linkView = this.findView(initRappid.paper);
  //   // linkView.removeTools();
  //   const toolsView = new joint.dia.ToolsView({
  //     name: 'basic-tools',
  //     tools: [new joint.linkTools.Remove({
  //       focusOpacity: 0.5,
  //       rotate: true,
  //       distance: -20,
  //       offset: 20
  //     })]
  //   });
  //   linkView.addTools(toolsView);
  // }
  isSelfInvocation() {
    return this.targetElement.get("id") === this.sourceElement.get("id") || this.sourceElement.get("parent") === this.targetElement.get("id");
  }
  UpdateVertices(src, trg) {
    if (src == undefined) {
      const source = this.graph ? this.graph.getCell(this.get("source").id) : this.sourceElement;
      src = source.getBBox().center();
      if (this.get("source").port && source.getPortsPositions("aaa")[this.get("source").port]) {
        src = source.getPortsPositions("aaa")[this.get("source").port];
        const pos = source.get("position");
        src.x += pos.x;
        src.y += pos.y;
      }
    }
    if (trg == undefined) {
      const target = this.graph ? this.graph.getCell(this.get("target").id) : this.targetElement;
      trg = target.getBBox().center();
      if (this.get("target").port && target.getPortsPositions("aaa")[this.get("target").port]) {
        trg = target.getPortsPositions("aaa")[this.get("target").port];
        const pos = target.get("position");
        trg.x += pos.x;
        trg.y += pos.y;
      }
    }
    this.vertices(makeInvocationLinkVertices(src, trg));
  }
  getParams() {
    const params = {
      linkType: linkType.Invocation
    };
    return {
      ...super.getProceduralLinkParams(),
      ...params
    };
  }
  clone() {
    return new InvocationLink(this.sourceElement, this.targetElement, this.condition, this.event);
  }
  popupContentDbClick() {
    const options = super.popupContentDbClick();
    options.splice(1, 1);
    options.push(this.getRequirementsPopupContent());
    return options;
  }
  addDblClickListenerForLabels() {}
  getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton) {
    return [sourceArrowheadTool, targetArrowheadTool, removeButton];
  }
  registerEvents() {}
  setPrevious() {
    super.setPrevious();
    const source = this.getSourceElement();
    const target = this.getTargetElement();
    if (!this.get("target").port) {
      if (this.isConnectionFromSubtoInzoomedFather()) {
        this.set("target", {
          id: target.id,
          port: 13
        });
      }
    }
  }
  isConnectionFromSubtoInzoomedFather() {
    const source = this.getSourceElement();
    const target = this.getTargetElement();
    return target.getEmbeddedCells().includes(source);
  }
  getSourceMultiplicityPopupTooltipText() {
    return "The integer number or parameter of instances of initiating processes to be completed successfully to invoke the target process, if greater than 1";
  }
}
