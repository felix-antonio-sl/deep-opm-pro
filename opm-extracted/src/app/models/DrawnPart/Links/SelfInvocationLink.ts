// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/Links/SelfInvocationLink.ts
// Extracted by opm-extracted/tools/extract.mjs

class SelfInvocationLinkInZoom extends InvocationLink {
  constructor(subProcessElement, processElement, tPort) {
    super(subProcessElement, processElement, false, false, undefined);
  }
  getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton) {
    return [removeButton, sourceArrowheadTool, targetArrowheadTool];
  }
  rightClickHandle(linkView, event, init) {
    const condition = this.getTargetElement().getVisual().logicalElement.getWaitingProcess();
    if (condition && init.opmModel.getLogicalElementByLid(condition)) {
      const log = init.opmModel.getLogicalElementByLid(condition);
      return (0, openTimeDurationPopup)(linkView.el, undefined, log.getDurationManager(), {
        digits: 2
      });
    }
    const condition2 = this.getTargetElement().getVisual().getAllLinks().inGoing.find(l => l.source == l.target && l.logicalElement.duration && l.logicalElement.duration.nominal);
    if (condition2) {
      return (0, openTimeDurationPopup)(linkView.el, undefined, condition2.logicalElement.duration, {
        digits: 2
      });
    } else {
      return super.rightClickHandle(linkView, event, init);
    }
  }
}
class SelfInvocationLink extends OpmDefaultLink {
  constructor(processElement, graph, id, center) {
    super();
    this.processElement = processElement;
    this.pc = new ConnectionPoint(this);
    this.link1 = new PartInvocation(this, "F");
    this.link2 = new PartInvocation(this, "B");
    this.sourceElement = processElement;
    this.targetElement = processElement;
    this.source(processElement);
    this.target(processElement);
    this.set("name", "Invocation");
    this.link1.set("name", "SelfInvocationPart");
    this.link2.set("name", "SelfInvocationPart");
    const bbox = processElement.getBBox();
    const pc = bbox.clone().scale(1.5, 1.5, bbox.center()).bottomMiddle();
    pc.y += 50;
    this.pc.setPosition({
      x: pc.x,
      y: pc.y
    });
    this.pc.on("change:position", (a, b, c) => {
      if (c.tx != undefined && c.ty != undefined) {
        const bbox = processElement.getBBox();
        const scaled = bbox.clone().scale(2, 3, bbox.center());
        const ellipse = new joint.g.Ellipse.fromRect(scaled);
        const p = ellipse.intersectionWithLineFromCenterToPoint(b);
        this.pc.setPosition({
          x: p.x,
          y: p.y
        });
        this.calc(bbox);
      }
    });
    processElement.on("change:position", (a, b, c) => {
      if (c.tx != undefined && c.ty != undefined) {
        this.pc.updatePosition({
          x: c.tx,
          y: c.ty
        });
        this.calc(processElement.getBBox());
      }
    });
    processElement.on("change:size", (a, b, c) => {
      this.calc(processElement.getBBox());
    });
    this.calc(bbox);
    graph.addCells(this.pc, this.link1, this.link2);
  }
  getLink2() {
    return this.link2;
  }
  calc(bbox) {
    const ellipse = new joint.g.Ellipse.fromRect(bbox);
    const pc = this.pc.getPoint();
    const line = new joint.g.Line(ellipse.center(), pc);
    const l1 = line.clone().scale(2, 2, ellipse.center()).rotate(ellipse.center(), -35);
    const l2 = line.clone().scale(2, 2, ellipse.center()).rotate(ellipse.center(), 35);
    const p1 = ellipse.intersectionWithLine(l1)[0];
    const p2 = ellipse.intersectionWithLine(l2)[0];
    this.link1.source({
      x: p1.x,
      y: p1.y
    });
    this.link1.target(pc);
    this.link1.vertices(makeInvocationLinkVertices({
      x: p1.x,
      y: p1.y
    }, pc));
    this.link2.source(pc);
    this.link2.target({
      x: p2.x,
      y: p2.y
    });
    this.link2.vertices(makeInvocationLinkVertices(pc, {
      x: p2.x,
      y: p2.y
    }));
  }
  isSelfInvocation() {
    return true;
  }
  setPeakPosition(pos) {
    if (pos) {
      this.pc.setPosition({
        x: pos.x,
        y: pos.y
      });
      this.calc(this.processElement.getBBox());
    }
  }
  getParams() {
    return {};
  }
  removeHandle() {
    this.link1.remove();
    this.link2.remove();
    this.pc.remove();
  }
  changeHandle() {}
  addDblClickListenerForLabels() {}
  addHandle(init) {}
  resizePort() {}
  pointerUpHandle() {}
  getSourceArcOnLink() {}
  getTargetArcOnLink() {}
  getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton) {
    return [];
  }
  pointerDownHandle() {}
  rightClickHandlePopoup(target, init) {
    return this.link1.rightClickHandle(init.paper.findViewByModel(this.link1), undefined, init);
  }
}
class PartInvocation extends joint.shapes.standard.Link.define("opc.PartInvocation", {
  attrs: {
    line: {
      connection: true,
      strokeDasharray: "0",
      stroke: "#586D8C",
      strokeWidth: 2,
      strokeLinejoin: "round",
      targetMarker: {
        type: "polygon",
        // SVG polygon
        fill: "white",
        stroke: "#586D8C",
        strokeWidth: 2,
        points: "0,0 23,8 12,0 23,-8 0,0"
      }
    }
  }
}) {
  constructor(original, dir) {
    super();
    this.original = original;
    this.dir = dir;
    this.on("change", (a, b, c) => {
      if (b.ui == true) {
        b.tx = 0;
        b.ty = 0;
      }
    });
  }
  getOriginal() {
    return this.original;
  }
  getTargetElement() {
    return this;
  }
  getSourceElement() {
    return this;
  }
  isProceduralLink() {}
  setLabelsOLinks() {}
  getParams() {
    return {};
  }
  removeHandle() {}
  setLinkTools(linkView) {
    linkView.setInteractivity(false);
    if (this.dir == "F") {
      linkView.addTools(new joint.dia.ToolsView({
        name: "basic-tools",
        tools: [new joint.linkTools.Remove({
          distance: -20,
          rotate: false,
          markup: [{
            tagName: "circle",
            selector: "button",
            attributes: {
              r: 7,
              fill: "#FF1D00",
              cursor: "pointer"
            }
          }, {
            tagName: "path",
            selector: "icon",
            attributes: {
              d: "M -3 -3 3 3 M -3 3 3 -3",
              fill: "none",
              stroke: "#FFFFFF",
              "stroke-width": 2,
              "pointer-events": "none",
              transform: "scale(1)"
            }
          }],
          action: evt => {
            this.original.removeAction();
          }
        })]
      }));
    }
  }
  resizePort() {}
  doubleClickHandle() {}
  rightClickHandle(linkView, event, init) {
    (0, openTimeDurationPopup)(linkView.el, linkView.model.original, linkView.model.original.getVisual().logicalElement.getDurationManager(), {
      digits: 2
    });
  }
  pointerUpHandle() {}
  getSourceArcOnLink() {}
  getTargetArcOnLink() {}
  pointerDownHandle(linkView, init) {
    this.findView(init.paper)?.setInteractivity(false);
  }
  addHandle() {
    this.addTimerIcon();
  }
  addTimerIcon() {
    const nominal = this.original.sourceElement.getVisual().getLinks().inGoing.find(l => l.source === l.target && l.type === linkType.Invocation).logicalElement.duration.getTimeDuration().nominal;
    if (this.dir === "B" && this.labels().length === 0 && Number(nominal) !== 1) {
      const timerIcon = {
        markup: "<svg width=\"10\" height=\"12\" viewBox=\"0 0 10 12\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<circle cx=\"5\" cy=\"7\" r=\"4.5\" stroke=\"#5A6F8F\"/>\n<rect x=\"4\" y=\"2\" width=\"2\" height=\"1\" fill=\"#5A6F8F\"/>\n<path d=\"M3 1C3 0.447715 3.44772 0 4 0H6C6.55228 0 7 0.447715 7 1V2H3V1Z\" fill=\"#5A6F8F\"/>\n<rect width=\"2.52587\" height=\"1.68265\" rx=\"0.3\" transform=\"matrix(0.678067 -0.735 0.727684 0.685913 0 3.54883)\" fill=\"#5A6F8F\"/>\n<rect width=\"2.52587\" height=\"1.68265\" rx=\"0.3\" transform=\"matrix(0.678067 0.735 -0.727684 0.685913 8.28735 1.69238)\" fill=\"#5A6F8F\"/>\n<circle cx=\"5\" cy=\"7\" r=\"1\" fill=\"#5A6F8F\"/>\n</svg>\n",
        position: {
          // distance: number,
          offset: {
            x: 7,
            y: 0
          },
          args: {
            keepGradient: false,
            ensureLegibility: true
          }
        }
      };
      this.appendLabel(timerIcon);
    } else if (this.labels().length > 0 && Number(nominal) === 1) {
      this.removeLabel(0);
    }
  }
  addDblClickListenerForLabels() {}
}
class ConnectionPoint extends joint.shapes.basic.Circle {
  constructor(original) {
    super();
    this.original = original;
    this.p = new joint.g.Point(0, 0);
    this.set("position", {
      x: this.p.x,
      y: this.p.y
    });
    this.set("size", {
      width: 15,
      height: 15
    });
    this.attr({
      circle: {
        fill: "#3BC3FF",
        strokeWidth: 0
      }
    });
    this.setTransparent();
  }
  updatePosition(c) {
    this.p.x += c.x;
    this.p.y += c.y;
    this.set("position", {
      x: this.p.x,
      y: this.p.y
    });
  }
  setPosition(pos) {
    this.p.x = pos.x;
    this.p.y = pos.y;
    this.set("position", {
      x: this.p.x,
      y: this.p.y
    });
  }
  setTransparent() {
    this.attr("circle/opacity", "0");
  }
  getLinkId() {
    return this.original.id;
  }
  getPoint() {
    return this.getBBox().center();
  }
  mouseOverHandle() {
    this.attr("circle/opacity", "0.7");
    this.toFront();
  }
  mouseLeaveHandle() {
    this.setTransparent();
  }
  addHandle() {}
  removeHandle() {}
  changeAttributesHandle() {}
  pointerDownHandle() {}
  pointerUpHandle() {
    this.setTransparent();
  }
  changePositionHandle() {}
  getParams() {
    return {};
  }
  doubleClickHandle() {}
}
