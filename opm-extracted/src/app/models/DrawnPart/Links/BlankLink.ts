// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/Links/BlankLink.ts
// Extracted by opm-extracted/tools/extract.mjs

class BlankLink extends OpmLinkRappid {
  constructor(id) {
    super();
    this.set(this.linkAttributes());
    this.attr(this.linkAttrs());
    this.IDSetter(id);
  }
  IDSetter(id) {
    if (id) {
      this.set("id", id);
    }
  }
  linkAttrs() {
    return {
      line: {
        strokeWidth: "2",
        strokeDasharray: "8 5",
        stroke: "#586D8C"
      }
    };
  }
  linkAttributes() {
    return {
      type: "opm.Link",
      name: "defaultLink",
      connector: {
        name: "jumpover"
      }
    };
  }
  resizePort() {}
  pointerDownHandle(cellView, options) {
    if (this.getSourceElement() && this.getSourceElement().constructor.name.includes("Semi")) {
      this.getSourceElement().attr("body/stroke", "rgb(252,182,99)");
      this.getSourceElement().attr("body/strokeDasharray", "8 5");
    }
  }
  isNoteLink(source, target) {
    if (source && source.constructor.name.includes("Note") || target && target.constructor.name.includes("Note")) {
      return true;
    }
    return false;
  }
  deletePreviousNoteLinks(initRappid) {
    const source = initRappid.graph.getCell(this.source().id);
    const target = initRappid.graph.getCell(this.target().id);
    const noteElement = source.constructor.name.includes("Note") ? source : target;
    const connectedLinks = initRappid.graph.getConnectedLinks(noteElement);
    connectedLinks.forEach(lnk => {
      if (lnk.getSourceElement().id === source.id && lnk.getTargetElement().id === target.id || lnk.getSourceElement().id === target.id && lnk.getTargetElement().id === source.id) {
        lnk.remove();
      }
    });
  }
  replaceBlankLinkWithdefaultForNote(initRappid) {
    if (this.source().id === this.target().id) {
      this.remove();
      return;
    }
    const noteLink = new OpmDefaultLink();
    noteLink.source(this.source());
    noteLink.target(this.target());
    this.deletePreviousNoteLinks(initRappid);
    initRappid.opmModel.currentOpd.addNoteLink(noteLink.attributes);
    initRappid.graph.addCell(noteLink);
    this.remove();
  }
  isProceduralLink() {
    return false;
  }
  pointerUpHandle(cellView, options, $event) {
    if (!options.paper.findViewByModel(this)) {
      return;
    }
    if (this.getSourceElement() && this.getSourceElement().constructor.name.includes("Semi")) {
      this.getSourceElement().removeAttr("body/stroke");
    }
    if (!this.isNoteLink(this.getSourceElement(), this.getTargetElement()) && this.getSourceElement() && this.target().x && this.target().y) {
      const clientPoint = options.paper.localToClientPoint(this.target().x, this.target().y);
      const elements = document.elementsFromPoint(clientPoint.x, clientPoint.y);
      const htmlLinks = elements.filter(el => el.parentElement && el.parentElement.classList.value.includes("joint-link"));
      const jointLinks = htmlLinks.map(htmlLink => options.graph.getCell(htmlLink.parentElement.getAttribute("model-id"))).filter(l => l.constructor.name !== this.constructor.name && l instanceof OpmProceduralLink);
      let bestPort = jointLinks.length > 0 ? jointLinks[0].target().port : undefined;
      if (!bestPort && jointLinks.length > 0) {
        bestPort = jointLinks[0].getTargetElement().findClosestEmptyPort(this.target());
      }
      if (jointLinks.length > 0 && bestPort !== -1) {
        this.target({
          id: jointLinks[0].target().id,
          port: bestPort
        });
        const params = {
          type: jointLinks[0].getVisual().type,
          connection: linkConnectionType.systemic,
          isCondition: jointLinks[0].getVisual().logicalElement.condition,
          isEvent: jointLinks[0].getVisual().logicalElement.event,
          isNegation: jointLinks[0].getVisual().logicalElement.negation
        };
        let swapped = false;
        let source = this.getSourceElement().getVisual();
        let target = jointLinks[0].getTargetElement().getVisual();
        let canConnect = options.getOpmModel().links.canConnect(source, target, jointLinks[0].getVisual().type).success;
        if (canConnect === false) {
          canConnect = options.getOpmModel().links.canConnect(jointLinks[0].getVisual().source, source, jointLinks[0].getVisual().type).success;
          if (canConnect) {
            target = source;
            source = jointLinks[0].getVisual().source;
            const midPoint = {
              x: (jointLinks[0].getVisual().target.xPos + target.xPos) / 2,
              y: (jointLinks[0].getVisual().target.yPos + target.yPos) / 2
            };
            bestPort = jointLinks[0].getSourceElement().findClosestEmptyPort(midPoint) - 1;
            swapped = true;
          }
        }
        const retLink = options.getOpmModel().connect(source, target, params);
        if (retLink.success) {
          retLink.removed?.forEach(rem => options.graph.getCell(rem.id)?.remove());
          const createdToDraw = retLink.created.filter(l => options.opmModel.getOpdByThingId(l.id) === options.opmModel.currentOpd);
          options.graphService.updateLinksView(createdToDraw);
          const linkView = options.paper.findViewByModel(retLink.created[0].id);
          if (linkView && swapped) {
            linkView.model.set("source", {
              id: jointLinks[0].source().id,
              port: bestPort
            });
            jointLinks[0].set("source", {
              id: jointLinks[0].source().id,
              port: bestPort
            });
            retLink.created[0].sourceVisualElementPort = bestPort;
            options.graphService.updateLinksView([...retLink.created, jointLinks[0].getVisual()]);
          } else if (linkView) {
            linkView.model.set("target", {
              id: jointLinks[0].target().id,
              port: bestPort
            });
            if (!jointLinks[0].target().port && options.graph.getCell(jointLinks[0].id)) {
              jointLinks[0].set("target", {
                id: jointLinks[0].target().id,
                port: bestPort
              });
              jointLinks[0].getVisual().targetVisualElementPort = bestPort;
            }
          }
          this.remove();
          if (linkView) {
            options.graph.getCell(retLink.created[0].id)?.pointerUpHandle(linkView, options);
          }
          if (swapped && jointLinks[0].getSourceArcOnLink()) {
            const sourceDrawn = options.graph.getCell(jointLinks[0].getVisual().source.id);
            for (const lnk of sourceDrawn.getVisual().getLinks().outGoing) {
              const lnkCell = options.graph.getCell(lnk.id);
              if (lnkCell) {
                lnkCell.updateParamsFromOpmModel(lnkCell.getVisual());
              }
            }
            sourceDrawn.pointerUpHandle(options.paper.findViewByModel(sourceDrawn), options);
          }
          return;
        }
      }
    }
    if (!this.getSourceElement() || !this.getTargetElement()) {
      const selection = options.selection.collection.models;
      if (this.getSourceElement() && !this.getTargetElement() && selection.length > 1) {
        const trgt = options.graph.findModelsFromPoint(this.target()).filter(el => el instanceof OpmEntity);
        if (trgt[0]) {
          this.target({
            id: trgt[0].id
          });
        } else {
          this.target({
            id: options.selection.collection.models[0].id
          });
        }
      } else {
        if (!(options.graph.getCell(this.source().id) instanceof OpmSemifoldedFundamental)) {
          (0, validationAlert)("A link must have a source and target");
        }
        this.remove();
        return;
      }
    }
    if (this.isNoteLink(this.getSourceElement(), this.getTargetElement())) {
      if (this.getSourceElement() === this.getTargetElement()) {
        this.remove();
      }
      this.replaceBlankLinkWithdefaultForNote(options);
      return;
    }
    if (this.getTargetElement() instanceof OpmSemifoldedFundamental) {
      const semiEntityType = this.getTargetElement().getVisual().type.includes("Process") ? "opm.Process" : "opm.Object";
      this.getTargetElement().set("type", semiEntityType);
      this.getTargetElement().attr("text/textWrap/text", this.getTargetElement().getVisual().logicalElement.text);
    }
    const model = options.getOpmModel();
    const visualSource = model.getVisualElementById(this.getSourceElement().id);
    const visualTarget = model.getVisualElementById(this.getTargetElement().id);
    // TODO: we should join the dialog with isLegal
    const isLegalConnection = model.links.isLegal(visualSource, visualTarget);
    if (isLegalConnection.success) {
      (0, createDialog)(options, this);
      return;
    }
    (0, validationAlert)(isLegalConnection.message, 5000);
    this.remove();
    // createDialog(options, this);
  }
  removeHandle(options) {
    options.graph.stopBatch("linkCreation");
    this.remove();
  }
  addHandle(options) {
    options.graph.startBatch("linkCreation");
  }
  getParams() {}
  setLinkTools() {}
  getTargetArcOnLink() {}
  getSourceArcOnLink() {}
}