// Source: decompiled/deobfuscated.js
// Original path: ./src/app/models/DrawnPart/Links/UnidirectionalTaggedLink.ts
// Extracted by opm-extracted/tools/extract.mjs

class UnidirectionalTaggedLink extends OpmTaggedLink {
  constructor(sourceElement, targetElement, id) {
    super(sourceElement, targetElement, id);
    // this.attr({'.marker-source' : {d: ''}});
    //  this.attr({'.marker-target' : {fill: 'white', d: 'M 20,34 L 0,25 L 20,16 M0,25 L20,25'}});
    this.attr("line/targetMarker", {
      type: "polyline",
      // SVG polyline
      fill: "none",
      stroke: "#586D8C",
      strokeWidth: 2,
      points: "0,0 20,-10 0,0 20,10"
    });
    this.attributes.name = "Unidirectional_Tagged_Link";
    this.connector("normal");
    this.on("change:vertices", this.forkedLinkHandle);
    this.on("change", function (link) {
      if (link.changed?.source && link.get("previousSourceId") === link.get("source")?.id) {
        link.getForkedLinks().forEach(lnk => lnk.set("source", {
          id: lnk.get("source").id,
          port: link.changed.source.port
        }));
      }
      if (link.changed?.source && link.getForkedLinks().length > 0 && !link.changed.source.x && link.get("previousSourceId") !== link.get("source")?.id) {
        this.setPrevious();
      }
    });
  }
  getParams() {
    const params = {
      sourceMultiplicity: this.get("sourceMultiplicity"),
      targetMultiplicity: this.get("targetMultiplicity"),
      tag: this.get("tag"),
      labels: this.labels().filter(lb => lb && !lb.attrs.missingLine),
      // removing the line label - it should not be save
      linkType: linkType.Unidirectional
    };
    return {
      ...super.getTaggedLinkParams(),
      ...params
    };
  }
  popupContentDbClick() {
    const ordered = this.includedInOrderedTypes();
    const orderedHtml = ordered ? "checked=\"true\"" : "";
    const addition = "Ordered: <span data-title=\"Adding OPD label “ordered” and the OPL reserved phrase “in that sequence” to indicate the order of the linked things\"><input type=\"checkbox\" class=\"ordered\" style=\"vertical-align: middle\" title=\"check to order the subpart top down\" " + orderedHtml + "></span>";
    return super.popupContentDbClick().concat(addition);
  }
  isForkedLink() {
    return this.getForkedLinks().length > 1;
  }
  getForkedLinks() {
    if (!this.graph || !this.getSourceElement()) {
      return [];
    }
    return this.graph.getConnectedLinks(this.getSourceElement(), {
      outbound: true
    }).filter(link => link && link.constructor.name === this.constructor.name && link.get("tag") && this.get("tag") === link.get("tag"));
  }
  getForkedLinksOfRemovedLink(graph) {
    const sourceId = this.source().id;
    if (!sourceId) {
      return [];
    }
    return graph.getConnectedLinks(graph.getCell(sourceId), {
      outbound: true
    }).filter(link => link && link.constructor.name === this.constructor.name && link.get("tag") && this.get("tag") === link.get("tag")).filter(l => l.getVisual());
  }
  popupEventsDbClick(element, init) {
    const this_ = this;
    return {
      "click .urlSvg": function () {
        const dataToRemember = this_.getPopupDataToRemember(this);
        this_.openLinkURLEditing(init).afterClosed().toPromise().then(res => {
          this_.rightClickHandlePopoup(init.paper.findViewByModel(element).el, init);
          this_.restorePopupData(dataToRemember);
        });
        this.remove();
      },
      "click .btnUpdate": function () {
        init.getOpmModel().logForUndo("link labels update");
        const sourceLabel = /\S/.test(this.$(".srce").val()) ? this.$(".srce").val().toLowerCase().trim() : console.log();
        const targtLabel = /\S/.test(this.$(".trgt").val()) ? this.$(".trgt").val().toLowerCase().trim() : console.log();
        const tagLabel = /\S/.test(this.$(".tag").val()) ? this.$(".tag").val().trim() : console.log();
        const currentTargetMult = element.get("targetMultiplicity") || element.getVisual()?.targetMultiplicity || "";
        const currentSourceMult = element.get("sourceMultiplicity") || element.getVisual()?.sourceMultiplicity || "";
        this_.updateTargetMultiplicity(currentTargetMult, targtLabel, element, init);
        this_.updateSourceMultiplicity(currentSourceMult, sourceLabel, element, init);
        this_.updateRequirementsLabel(element.get("requirements"), this.$(".req").val().trim(), this.$(".showReq")[0].checked, element, init);
        element.set("requirements", this.$(".req").val().trim());
        element.set("showRequirementsLabel", this.$(".showReq")[0].checked);
        element.set("sourceMultiplicity", this.$(".srce").val()?.trim());
        element.getVisual().sourceMultiplicity = this.$(".srce").val()?.trim();
        element.set("targetMultiplicity", this.$(".trgt").val()?.trim());
        element.getVisual().targetMultiplicity = this.$(".trgt").val()?.trim();
        const forkedLinksBefore = this_.getForkedLinks();
        element.graph.startBatch("unidirectionalVertexChange");
        if (element.getForkedLinks().length > 1 && element.get("tag") !== this.$(".tag").val()) {
          element.vertices([]);
        }
        element.graph.stopBatch("unidirectionalVertexChange");
        const mid = {
          x: (element.getSourcePoint().x + element.getTargetPoint().x) / 2,
          y: (element.getSourcePoint().y + element.getTargetPoint().y) / 2
        };
        const oldTag = element.get("tag");
        element.set("tag", this.$(".tag").val());
        const forkedLinksAfter = this_.getForkedLinks();
        for (const before of forkedLinksBefore) {
          if (!forkedLinksAfter.includes(before)) {
            before.deleteLabel();
            init.getGraphService().oldModelsLabelsCompatibility(before, before.getVisual());
          }
        }
        element.forkedLinkHandle(element, [mid]);
        element.forkedLinkUpdate(init);
        this_.updateTagLabel(oldTag, tagLabel, element, init, true);
        if (this.$(".ordered")[0].checked) {
          this_.addLinkToOrderedFundamental();
          this_.addLabelOrderedSubpart();
        } else {
          this_.removeLinkFromOrderedFundamental();
        }
        this_.addDblClickListenerForLabels();
        this.remove();
      },
      /**
       * By clicking on the 'Copy Style' button, we keep the style of the source link in the 'linkCopiedStyleParams' dictionary.
       */
      "click .btnStyleCopy": function () {
        this.remove();
        init.linkCopiedStyleParams = {};
        init.linkCopiedStyleParams.strokeWidth = this_.attr("line/strokeWidth");
        init.linkCopiedStyleParams.strokeColor = this_.attr("line/stroke");
      },
      "click .btnStyle": function () {
        this.remove();
        const stylePopupContent = ["Link color: <input type=\"color\" class=\"linkColor PopupColorInput\" value=" + this_.attr("link/fill") + "><br>", "Link width: <input type=\"width\" style=\"width:35px;padding-top: 5px\" class=\"linkwidth PopupInput\" value=" + this_.attr("line/strokeWidth") + "><br>", "<button style=\"margin-left: 6px;padding-top: 5px\" class=\"btnUpdateStyle Popup\">Update Style</button>"];
        const stylePopupEvents = {
          "click .btnUpdateStyle": function () {
            if (this.$(".linkwidth").val() < "1" || this.$(".linkwidth").val() > "6") {
              const errorMessage = "Maximum width is 6";
              (0, validationAlert)(errorMessage, 5000, "Error");
              return;
            }
            init.getOpmModel().logForUndo("link style change");
            this_.attr({
              line: {
                stroke: this.$(".linkColor").val()
              }
            });
            this_.attr({
              line: {
                strokeWidth: this.$(".linkwidth").val()
              }
            });
            this.remove();
          }
        };
        const el = init.paper.findViewByModel(this_).el;
        (0, popupGenerator)(el, stylePopupContent, stylePopupEvents).render();
        (0, stylePopup)();
        $(".linkColor")[0].value = this_.attr("line/stroke");
      }
    };
  }
  addLabelOrderedSubpart() {
    const ordered = this.getSourceElement().getVisual().logicalElement.orderedFundamentalTypes.includes(linkType.Unidirectional);
    const hasLabel = this.getForkedLinks().find(link => link.labels().find(lb => lb.attrs.label?.text === "ordered"));
    if (!hasLabel && ordered) {
      this.setLabelsOLinks("ordered", 90, 0, -20, null, null, true);
    } else if (!ordered) {
      for (const link of this.getForkedLinks()) {
        const idx = link.labels().findIndex(lb => lb.attrs.label?.text === "ordered");
        if (idx >= 0) {
          link.removeLabel(idx);
        }
      }
    }
  }
  removeLinkFromOrderedFundamental() {
    super.removeLinkFromOrderedFundamental();
    const links = this.getForkedLinks();
    for (const link of links) {
      const idx = link.labels().findIndex(lb => lb.attrs.label?.text === "ordered");
      if (idx >= 0) {
        link.removeLabel(idx);
      }
    }
  }
  removeHandle(options) {
    super.removeHandle(options);
    if (!this.get("tag")) {
      return;
    }
    options.graph.getConnectedLinks(this.sourceElement, {
      outbound: true
    }).filter(l => l && l.get("tag") === this.get("tag")).forEach(link => {
      link.deleteLabel();
      if (link.getVisual()) {
        options.getGraphService().oldModelsLabelsCompatibility(link, link.getVisual());
      }
    });
    this.forkedLinkUpdate(options);
  }
  forkedLinkUpdate(init) {
    const forkedLinks = this.getForkedLinksOfRemovedLink(init.graph);
    for (const link of forkedLinks) {
      const label = link.labels().find(lb => lb.attrs.missingLine);
      if (label) {
        const idx = link.labels().indexOf(label);
        link.removeLabel(idx);
      }
    }
    forkedLinks[0]?.addMissingForkedLinksLine();
    forkedLinks[0]?.addLabelOrderedSubpart();
  }
  afterRender(init) {
    this.forkedLinkUpdate(init);
    this.addLabelOrderedSubpart();
  }
  forkedLinkHandle(thisLink, allVertices) {
    const this_ = this;
    if (this_.graph && !this_.graph.hasActiveBatch("unidirectionalVertexChange")) {
      this_.graph.startBatch("unidirectionalVertexChange");
      const commonVertex = allVertices[0];
      const unis = this.getForkedLinks();
      if (unis.length < 2 || !commonVertex) {
        this_.graph.stopBatch("unidirectionalVertexChange");
        return;
      }
      let avgAngle = 0;
      for (const bro of unis) {
        avgAngle += bro.getTargetPoint().theta(bro.getSourcePoint());
      }
      avgAngle = avgAngle / (unis.length || 1);
      for (const bro of unis) {
        const target = bro.getTargetElement();
        const targetPos = target.get("position");
        const targetSize = target.get("size");
        let topVrtx;
        const padding = 30;
        const bias = 45;
        if (avgAngle <= 90 - bias) {
          topVrtx = {
            x: targetPos.x + targetSize.width + padding,
            y: targetPos.y + targetSize.height / 2
          };
        } else if (avgAngle > 90 - bias && avgAngle <= 180 - bias) {
          topVrtx = {
            x: targetPos.x + targetSize.width / 2,
            y: commonVertex.y
          };
        } else if (avgAngle > 180 - bias && avgAngle <= 270 - bias) {
          topVrtx = {
            x: commonVertex.x,
            y: targetPos.y + targetSize.height / 2
          };
        } else {
          topVrtx = {
            x: targetPos.x + targetSize.width / 2,
            y: commonVertex.y
          };
        }
        bro.vertices([commonVertex, topVrtx]);
        const lblIdx = bro.labels().indexOf(bro.labels().find(lb => lb.attrs.label.text === bro.get("tag")));
        if (lblIdx >= 0) {
          bro.removeLabel(lblIdx);
        }
        bro.set("source", {
          id: bro.get("source").id,
          port: this_.get("source").port
        });
      }
      this_.setLabelsOLinks(this_.get("tag"), 70, 0, 20, null, null, true);
      this_.graph.stopBatch("unidirectionalVertexChange");
    }
  }
  getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton) {
    const tools = super.getToolsArray(verticesTool, segmentsTool, sourceArrowheadTool, targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton);
    const idx = tools.indexOf(segmentsTool);
    if (idx > 0) {
      tools.splice(idx, 1);
    }
    return tools;
  }
  addMissingForkedLinksLine() {
    const vis = this.getVisual();
    const unis = this.getForkedLinks();
    if (vis && !unis.some(u => u.labels().some(lb => lb.attrs.missingLine)) && vis.CheckAddLine(true).missingNumber > 0) {
      const missingText = vis.getMissingChildrenNames(true).names;
      this.appendLabel({
        markup: [{
          tagName: "rect",
          selector: "missingLineRect"
        }, {
          tagName: "rect",
          selector: "missingLine"
        }, {
          tagName: "text",
          selector: "missingLineText"
        }],
        attrs: {
          missingLine: {
            fill: "#586D8C",
            strokeWidth: 1,
            width: 26,
            height: 2,
            x: -13,
            y: -1,
            event: "missingLineClick",
            class: "missingLine"
          },
          missingLineRect: {
            fill: "transparent",
            strokeWidth: 1,
            width: 30,
            height: 14,
            x: -15,
            y: -7,
            title: missingText,
            event: "missingLineClick"
          },
          missingLineText: {
            text: missingText.length,
            x: 15 + String(missingText.length).length * 3,
            y: 3,
            event: "missingLineClick"
          },
          ".": {
            "data-tooltip": missingText.join("<br>"),
            "data-tooltip-position": "top"
          },
          label: {
            text: "dummytext"
          }
        },
        position: {
          angle: 90,
          distance: 45,
          offset: {
            x: 0,
            y: 0
          },
          args: {
            keepGradient: true,
            ensureLegibility: true
          }
        }
      });
    }
  }
  bringMissingUnidirectionalLinks(init) {
    const visSource = this.graph.getCell(this.source().id)?.getVisual();
    if (!visSource || init.getOpmModel().currentOpd.isStereotypeOpd() || init.getOpmModel().currentOpd.requirementViewOf || init.isDSMClusteredView.value === true) {
      return;
    }
    init.getOpmModel().logForUndo("Bring missing unidirectional relations");
    init.getOpmModel().setShouldLogForUndoRedo(false, "bringMissingUnidirectionalLinks");
    const tag = this.get("tag");
    const label = this.labels().find(lb => lb.attrs.label?.text === tag);
    const ret = init.getOpmModel().bringMissingUnidirectionalLinks(visSource, tag, label);
    for (const newEntity of ret.entities) {
      init.getGraphService().updateEntity(newEntity);
      const cell = init.graph.getCell(newEntity.id);
      if (cell) {
        newEntity.setParams(cell.getParams());
        if (cell instanceof OpmThing) {
          init.setSelectedElement(cell);
          cell.shiftEmbeddedToEdge(init);
        }
      }
    }
    init.getGraphService().updateEntity(visSource);
    init.getGraphService().updateLinksView(ret.links);
    let vertices = this.vertices();
    if (!vertices || vertices.length === 0) {
      vertices = [{
        x: (this.getSourcePoint().x + this.getTargetPoint().x) / 2,
        y: (this.getSourcePoint().y + this.getTargetPoint().y) / 2
      }];
    }
    this.forkedLinkHandle(this, vertices);
    this.forkedLinkUpdate(init);
    init.getOpmModel().setShouldLogForUndoRedo(true, "bringMissingUnidirectionalLinks");
  }
}