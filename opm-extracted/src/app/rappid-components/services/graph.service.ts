// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/services/graph.service.ts
// Extracted by opm-extracted/tools/extract.mjs

const rootId = "SD";
let GraphService = /*#__PURE__*/(() => {
  class GraphService {
    constructor(noteService, oplService) {
      this.noteService = noteService;
      this.oplService = oplService;
      this.counter = 0;
      this.fromStencil = false;
      this.graph = new joint.dia.Graph();
      this.currentGraphId = rootId;
      this.type = "";
      // this.initializeDatabase();
      // TODO: change:position emits on mousemove, find a better event - when drag stopped
      this.counter = 0;
    }
    getGraph(name) {
      return this.graph;
    }
    importOpxGraph(opxJson, options) {
      return ImportOpx_LastSong(opxJson, options, this.opxModel);
    }
    // copyThingProperties(target, source) {
    //   if (target instanceof OpmThing) {
    //     let shape = 'rect';
    //     if (target instanceof OpmProcess)
    //       shape = 'ellipse';
    //     target.attr(shape, { 'stroke-dasharray': source.attr(shape)['stroke-dasharray'] });
    //     target.attr(shape + '/filter/args', source.attr(shape + '/filter/args'));
    //   }
    // }
    // private isChecked(graph, link, unfoldingOptions) {
    //   for (const prop in unfoldingOptions) {
    //     if (unfoldingOptions[prop] === true && prop.includes(link.attributes.name))
    //       if (prop.includes('Operations')) {
    //         if (graph.getCell(link.attributes.target.id) instanceof OpmProcess)
    //           return true;
    //       }
    //       else
    //         if (prop.includes('Attributes')) {
    //           if (graph.getCell(link.attributes.target.id) instanceof OpmObject)
    //             return true;
    //         }
    //         else
    //           return true;
    //   }
    //   return false;
    // }
    // redrawing kipas to all the duplications of a Thing
    redrawAllDuplicationMarks(initRappid) {
      const all = initRappid.opmModel.currentOpd.visualElements;
      let cell;
      if (!all) {
        return;
      }
      for (let i = 0; i < all.length; i++) {
        if (all[i] && this.graph.getCell(all[i].id)) {
          cell = initRappid.paper.findViewByModel(all[i].id).model;
        }
        if (cell && cell instanceof OpmThing) {
          if (cell && !cell.get("duplicationMark")) {
            cell.drawDuplicationMarkToAllDuplicatesInSameOPD(initRappid);
          }
        }
      }
    }
    refreshGraph(initRappid) {
      this.renderGraph(initRappid.opmModel.currentOpd, initRappid, null, false, true);
    }
    makeShape(opd) {
      let image;
      const init = (0, getInitRappidShared)();
      const area = init.graph.getCellsBBox(init.graph.getCells()).inflate(15, 15);
      init.paper.toSVG(svgStr => {
        image = "data:image/svg+xml;utf8," + encodeURIComponent(svgStr);
      }, {
        useComputedStyles: false,
        area: area
      });
      const shape = new OpmImage();
      shape.resize(20, 20);
      shape.attr("root/title", opd.name);
      shape.attr("image/xlinkHref", image);
      shape.set("type", "OpmImage");
      shape.opd = opd;
      return shape;
    }
    changeGraphModel(elementId, treeViewService, type, focusedElement = null) {
      const opd = treeViewService.initRappid.opmModel.getOpd(elementId);
      if (!opd) {
        return;
      }
      this.renderGraph(opd, treeViewService.initRappid, focusedElement);
      treeViewService.initRappid.opmModel.setCurrentOpd(elementId);
      // highlighSD(opd.id, treeViewService.initRappid);
      this.redrawAllDuplicationMarks(treeViewService.initRappid);
      // treeViewService.initRappid.treeViewService.treeView.treeModel.getNodeById(opd.id).toggleActivated();
      // treeViewService.initRappid.treeViewService.treeView.treeModel.getNodeById(opd.id).parent.expand();
      // treeViewService.initRappid.setSelectedElementToNull();
    }
    // private copyStructuralConnectedElementsTemp(graph, newGraph, elementId, initRappid, clonedProcess, unfoldingOptions) {
    //   // TODO: delete
    //   linkDrawing.drawLinkSilent(newGraph, null, clonedProcess, null);
    // }
    // saveLinkAttr(){
    //   const linksArray = this.graph.getCells().filter((cell) => cell instanceof OpmDefaultLink);
    //   this.setLinkAttributes(linksArray);
    // }
    // setLinkAttributes(links: Array<OpmDefaultLink>): void {
    //   for ( let link of links) {
    //     // console.log(link.getLabels().length);
    //     // console.log(link.getLabels());
    //     link.extractLabelsPositions();
    //   }
    // }
    disableOplRendering(initRappid) {
      if (initRappid.oplService) {
        initRappid.oplService.oplOpen = false;
      }
    }
    setPaperInteractivity(initRappid, opd) {
      if (initRappid.paper && (opd.isStereotypeOpd() || initRappid.isDSMClusteredView?.value === true || initRappid.Executing && !initRappid.ExecutingPause || opd.sharedOpdWithSubModelId || opd.belongsToSubModel)) {
        initRappid.paper.setInteractivity(false);
      } else if (initRappid.paper && opd.requirementViewOf) {
        initRappid.paper.setInteractivity({
          addLinkFromMagnet: false
        });
      } else if (initRappid.paper) {
        initRappid.paper.setInteractivity({
          labelMove: true
        });
      }
    }
    removeSystemMapTreeNode(initRappid) {
      if (initRappid.getTreeView() && initRappid.getTreeView().nodes.find(nd => nd.id === "SystemMap")) {
        const idx = initRappid.getTreeView().nodes.indexOf(initRappid.getTreeView().nodes.find(nd => nd.id === "SystemMap"));
        initRappid.getTreeView().nodes.splice(idx, 1);
        initRappid.getTreeView().treeView.treeModel.update();
      }
    }
    closeSelectedTextEditorBeforeRendering(initRappid) {
      if (initRappid.selectedElement && OPCloudUtils.isInstanceOfDrawnEntity(initRappid.selectedElement)) {
        initRappid.selectedElement.closeTextEditor(initRappid);
      }
    }
    closeAllPopups() {
      joint.ui.Popup.close();
    }
    prepareTempGraphAsContainer() {
      const graph = new joint.dia.Graph();
      graph.stopListening();
      graph.startBatch("rendering");
      this.graph.startBatch("rendering");
      return graph;
    }
    splitVisualElementsByTypes(initRappid, opd) {
      const unEmbeddedEntities = opd.visualElements.filter(vis => OPCloudUtils.isInstanceOfVisualEntity(vis) && (!vis.fatherObject || OPCloudUtils.isInstanceOfVisualThing(vis) && vis.semiFolded.length > 0));
      let visualEmbedded = opd.visualElements.filter(vis => OPCloudUtils.isInstanceOfVisualEntity(vis) && vis.fatherObject);
      visualEmbedded = visualEmbedded.filter(vis => !OPCloudUtils.isInstanceOfVisualThing(vis) || OPCloudUtils.isInstanceOfVisualThing(vis) && vis.isFoldedUnderThing().isFolded === false);
      const visualLinks = opd.visualElements.filter(vis => vis.isLink());
      return {
        unEmbeddedEntities: unEmbeddedEntities,
        visualEmbedded: visualEmbedded,
        visualLinks: visualLinks
      };
    }
    // first stage insert all entities that are not embedded.
    insertNonEmbeddedEntities(unEmbeddedEntities, graph, initRappid) {
      const semiFoldEmbedding = [];
      for (const visualEntity of unEmbeddedEntities) {
        const drawnElement = createDrawnEntity(visualEntity.logicalElement.name);
        drawnElement.updateParamsFromOpmModel(visualEntity);
        if (!visualEntity.isFoldedUnderThing().isFolded) {
          drawnElement.updateOldPortsToNewPorts();
        }
        drawnElement.createPorts(visualEntity);
        graph.addCell(drawnElement, {
          sort: false
        });
        if (OPCloudUtils.isInstanceOfVisualThing(visualEntity)) {
          const position = drawnElement.get("position");
          if (visualEntity.semiFolded.find(sm => typeof sm === "string")) {
            visualEntity.semiFolded = visualEntity.semiFolded.map(fld => typeof fld === "string" ? initRappid.opmModel.getVisualElementById(fld) : fld);
          }
          const foldedRels = visualEntity.semiFolded;
          for (const folded of foldedRels) {
            const semi = new OpmSemifoldedFundamental(folded.isFoldedUnderThing().triangleType, folded.type);
            semi.id = folded.id;
            semi.set("id", folded.id);
            semi.updateText(folded.logicalElement.getBareName());
            // semi.attr('label/text', folded.logicalElement.text);
            semi.attr("label/fill", (0, getTextColor)(folded));
            semi.set("position", {
              x: position.x + folded.xPos,
              y: position.y + folded.yPos
            });
            graph.addCell(semi, {
              sort: false
            });
            semiFoldEmbedding.push({
              parent: drawnElement,
              child: semi
            });
          }
        }
        changeHandle(initRappid, drawnElement);
      }
      return semiFoldEmbedding;
    }
    // second stage insert embedded entities
    insertEmbeddedEntities(visualEmbedded, graph, initRappid) {
      for (const visual of visualEmbedded) {
        if (OPCloudUtils.isInstanceOfVisualState(visual) && visual.fatherObject.isFoldedUnderThing().isFolded) {
          continue;
        }
        const drawnElement = createDrawnEntity(visual.logicalElement.name);
        drawnElement.updateParamsFromOpmModel(visual);
        if (OPCloudUtils.isInstanceOfDrawnEntity(drawnElement)) {
          drawnElement.createPorts(visual);
          drawnElement.updateOldPortsToNewPorts();
        }
        graph.addCell(drawnElement, {
          sort: false
        });
        changeHandle(initRappid, drawnElement);
      }
    }
    // third stage insert all links
    insertLinks(visualLinks, graph, initRappid) {
      for (const visLink of visualLinks) {
        let sourceVisualElement;
        let targetVisualElement;
        let linkT;
        let condition;
        let event;
        let negation;
        let center;
        let symbolPos;
        let BreakPoints; // converting for getting the link type
        linkT = visLink.logicalElement.linkType;
        sourceVisualElement = visLink.sourceVisualElement;
        targetVisualElement = visLink.targetVisualElements[0].targetVisualElement;
        if (visLink.isProceduralLink()) {
          condition = visLink.logicalElement.condition;
          event = visLink.logicalElement.event;
          negation = visLink.logicalElement.negation;
          center = visLink.center;
        }
        if (!sourceVisualElement || !targetVisualElement) {
          initRappid.opmModel.remove(visLink.id);
          continue;
        }
        const sourceDrawnElement = graph.getCell(sourceVisualElement.id);
        const targetDrawnElement = graph.getCell(targetVisualElement.id);
        if (!sourceDrawnElement || !targetDrawnElement) {
          initRappid.opmModel.remove(visLink.id);
          continue;
        }
        const drawnLink = createDrawnLink(sourceDrawnElement, targetDrawnElement, condition, event, negation, linkType[linkT], graph, center);
        drawnLink.set("id", visLink.id);
        drawnLink.set("previousSourceId", drawnLink.get("source").id); // in case of fundamental link it will be the triangle
        drawnLink.set("previousTargetId", targetDrawnElement.id);
        const tPort = visLink.targetVisualElementPort;
        if (tPort) {
          drawnLink.set("target", {
            id: targetDrawnElement.id,
            port: tPort
          });
        }
        BreakPoints = visLink.BreakPoints;
        if (BreakPoints) {
          const Vertices = [];
          for (const point of BreakPoints) {
            Vertices.push({
              x: point.x,
              y: point.y
            });
          }
          drawnLink.set("vertices", [...Vertices]);
        }
        if (visLink.belongsToSubModel || visLink.logicalElement.visualElements.some(v => v.protectedFromBeingChangedBySubModel || v.belongsToFatherModelId)) {
          drawnLink.attr({
            ".": {
              opacity: 0.6
            }
          });
          if (visLink.isFundamentalLink()) {
            drawnLink.mainUpperLink.attr({
              ".": {
                opacity: 0.6
              }
            });
            drawnLink.getSourceElement()?.attr({
              ".": {
                opacity: 0.6
              }
            }); // opacity of the triangle.
          }
        }
        // UPDATE Symbol Position
        if (visLink.isFundamentalLink()) {
          drawnLink.mainUpperLink.set("source", {
            id: drawnLink.mainUpperLink.get("source").id,
            port: visLink.sourceVisualElementPort
          });
          if (visLink.UpperConnectionVertices) {
            drawnLink.mainUpperLink.vertices(visLink.UpperConnectionVertices);
          }
          symbolPos = visLink.getSymbolPos();
          if (symbolPos) {
            drawnLink.triangle.attributes.position.x = symbolPos[0];
            drawnLink.triangle.attributes.position.y = symbolPos[1];
          }
          // if (visLink.CheckAddLine() > 0) { // check if there is a need to add a line and a number
          //   drawnLink.AddLineAndNumber();
          // }
        } else {
          drawnLink.set("source", {
            id: sourceDrawnElement.id,
            port: visLink.sourceVisualElementPort
          });
        }
        // Update vertices if applicable
        if (typeof drawnLink.UpdateVertices === "function") {
          drawnLink.UpdateVertices();
        }
        if (drawnLink.constructor.name === "SelfInvocationLink") {
          drawnLink.setPeakPosition(visLink.selfInvocationPeakPoint);
        }
        if (visLink.strokeColor) {
          drawnLink.attr({
            line: {
              stroke: visLink.strokeColor
            }
          });
          if (visLink.isFundamentalLink()) {
            drawnLink.mainUpperLink.attr({
              line: {
                stroke: visLink.strokeColor
              }
            });
          } else if (drawnLink.updateMarkersColor) {
            drawnLink.updateMarkersColor(visLink.strokeColor);
          }
        }
        if (visLink.strokeWidth) {
          drawnLink.attr({
            line: {
              strokeWidth: visLink.strokeWidth
            }
          });
          if (visLink.isFundamentalLink()) {
            drawnLink.mainUpperLink.attr({
              line: {
                strokeWidth: visLink.strokeWidth
              }
            });
          }
        }
        if (visLink.isFundamentalLink()) {
          drawnLink.addHandle(initRappid);
          drawnLink.updateTriangle(initRappid);
        }
        this.setTagsOfLink(drawnLink, visLink);
        // if has link requirements property but the label is missing.
        const requirements = visLink.logicalElement.linkRequirements;
        if (visLink.showRequirementsLabel && requirements && requirements.trim() !== "" && !visLink.labels?.find(lbl => lbl.attrs.label.text === "Satisfied: " + visLink.logicalElement.linkRequirements)) {
          visLink.labels = visLink.labels || [];
          visLink.labels.push({
            markup: [{
              tagName: "text",
              selector: "label"
            }],
            attrs: {
              label: {
                event: "label:pointerclick",
                textAnchor: "middle",
                textVerticalAnchor: "middle",
                fill: "black",
                fontSize: 16,
                y: 10,
                text: "Satisfied: " + visLink.logicalElement.linkRequirements
              }
            },
            position: {
              distance: 0.55,
              offset: {
                x: -15,
                y: -5
              },
              args: {
                keepGradient: true,
                ensureLegibility: true
              }
            }
          });
        }
        // UPDATE Link Labels/Tags
        if (visLink.labels && visLink.labels.length > 0) {
          visLink.labels = visLink.labels.filter(lbl => !!lbl);
          visLink.labels.forEach(lb => {
            lb.position.args = lb.position.args || {};
            if (["e", "c"].includes(lb.attrs?.label?.text)) {
              lb.position.args.keepGradient = false;
            } else if (lb.position.args.keepGradient === undefined) {
              lb.position.args.keepGradient = true;
            }
            lb.position.args.ensureLegibility = true;
          });
          if (visLink.tag && visLink.type === linkType.Unidirectional && this.getForkedLinks(visLink).length > 1) {
            if (this.getForkedLinks(visLink).indexOf(visLink) !== 0) {
              const labelToRemove = visLink.labels.find(label => label.attrs?.label?.text === visLink.tag);
              if (labelToRemove) {
                visLink.labels.splice(visLink.labels.indexOf(labelToRemove), 1);
              }
            }
          }
          drawnLink.labels(visLink.labels);
        } else {
          // backward compatibility for old models labels
          this.oldModelsLabelsCompatibility(drawnLink, visLink);
        }
        if (visLink.isFundamentalLink()) {
          if (visLink.upperLinkAnchorPos) {
            drawnLink.mainUpperLink.prop("source/anchor", visLink.upperLinkAnchorPos);
          }
          if (visLink.targetAnchorPos) {
            drawnLink.prop("target/anchor", visLink.targetAnchorPos);
          }
        }
        if (visLink.visible !== false) {
          graph.addCell(drawnLink, {
            sort: false
          });
        }
      }
    }
    // adding notes and their links
    insertNotes(graph, opd, initRappid) {
      if (initRappid.notes) {
        for (let i = 0; i < opd.notes.length; i++) {
          const drawnElement = new Note();
          drawnElement.updateParamsFromOpmModel(opd.notes[i]);
          graph.addCell(drawnElement, {
            sort: false
          });
        }
        for (let i = opd.noteLinks.length - 1; i >= 0; i--) {
          const sourceId = opd.noteLinks[i].source?.id;
          const targetId = opd.noteLinks[i].target?.id;
          if (!sourceId || !targetId) {
            continue;
          }
          if (!graph.getCell(sourceId) || !graph.getCell(targetId)) {
            opd.removeNoteLink(opd.noteLinks[i].id);
            continue;
          }
          const drawnElement = new OpmDefaultLink();
          drawnElement.updateParamsFromOpmModel(opd.noteLinks[i]);
          drawnElement.vertices(opd.noteLinks[i].vertices || []);
          graph.addCell(drawnElement, {
            sort: false
          });
        }
      }
    }
    makeTransparentForGrid(initRappid) {
      const opd = initRappid.opmModel.currentOpd;
      const mode = initRappid.oplService?.settings?.gridSettings?.transparentThingsFill ?? "inZoomedOpd";
      const things = opd.visualElements.filter(v => OPCloudUtils.isInstanceOfVisualThing(v) && this.graph.getCell(v.id));
      for (const vis of things) {
        if (!initRappid.paper) {
          continue;
        }
        const cell = this.graph.getCell(vis.id);
        if (!cell) {
          continue;
        }
        const cellView = initRappid.paper.findViewByModel(cell);
        if (!cellView) {
          continue;
        }
        const fillAtr = OPCloudUtils.isInstanceOfVisualProcess(vis) ? "ellipse/fill" : "rect/fill";
        const inZoomedWithChildren = vis.isInzoomed() && vis.children.length > 0;
        let fill;
        if (!initRappid.showGrid) {
          if (mode === "all") {
            fill = "#fdffff";
          } else if (inZoomedWithChildren) {
            fill = "#fdffff";
          } else {
            continue;
          }
        } else if (mode === "all" || mode === "inZoomedOpd" && inZoomedWithChildren) {
          fill = "transparent";
        } else {
          fill = "#fdffff";
        }
        cellView.model.attr(fillAtr, fill);
      }
    }
    greyOutEntities(initRappid, graph) {
      if (!initRappid.shouldGreyOut) {
        return;
      }
      for (const cell of graph.getCells()) {
        if (OPCloudUtils.isInstanceOfDrawnEntity(cell)) {
          cell.greyOutEntity();
        }
      }
    }
    moveCellsFromTempGraphToMainGraph(tempGraph) {
      // pay attention: this.graph is the main graph.
      const cells = tempGraph.getCells();
      tempGraph.removeCells(cells);
      if (cells) {
        this.graph.resetCells(cells);
      }
    }
    stopGraphsBatches(tempGraph) {
      tempGraph.stopBatch("rendering");
      this.graph.stopBatch("rendering");
    }
    reEmbedEntities(semiFoldEmbedding, opd, initRappid) {
      this.graph.startBatch("ignoreChange");
      reEmbedding(this.graph, opd);
      semiFoldEmbedding.forEach(item => {
        item.parent.embed(item.child);
        // item.parent.attr('text/ref-y', 0.1);
        // (<OpmVisualThing>item.parent.getVisual()).refY = Math.max(25, (<OpmVisualThing>item.parent.getVisual()).height * 0.1);
        item.child.fixRightPortPosition(initRappid);
      });
      this.graph.stopBatch("ignoreChange");
    }
    updateDrawnEntitiesViewsAfterRender(opd) {
      const toUpdate = opd.visualElements.filter(v => OPCloudUtils.isInstanceOfVisualThing(v) && !v.isFoldedUnderThing().isFolded && this.graph.getCell(v.id));
      for (const vis of toUpdate) {
        if (this.graph.getCell(vis.id)) {
          this.graph.getCell(vis.id).updateView(vis);
        }
      }
      opd.visualElements.filter(v => OPCloudUtils.isInstanceOfVisualState(v)).forEach(v => {
        if (this.graph.getCell(v.id)) {
          this.graph.getCell(v.id).updateView(v);
        }
      });
      if (this.oplService?.options) {
        this.graph.getCells().filter(cell => cell.constructor.name.includes("OpmSemifolded")).forEach(cl => cl.addHandle(this.oplService.options));
      }
    }
    scrollPaperToCenterPosition(initRappid) {
      if (initRappid.paper && initRappid.paperScroller) {
        if (this.graph.getCells().length === 0) {
          initRappid.paperScroller.positionPoint(new Point(0, 0), "-99%", "-99%");
        } else {
          initRappid.paperScroller.scrollToContent();
        }
      }
    }
    afterRenderPaperAdjustments(initRappid, opd, focusedElement) {
      if (!initRappid.paper) {
        return;
      }
      const cells = this.graph.getCells();
      const entities = [];
      const things = [];
      const drawnLinks = [];
      const states = [];
      cells.forEach(c => {
        if (OPCloudUtils.isInstanceOfDrawnEntity(c)) {
          entities.push(c);
        }
        if (OPCloudUtils.isInstanceOfDrawnThing(c)) {
          things.push(c);
        }
        if (OPCloudUtils.isInstanceOfDrawnState(c)) {
          states.push(c);
        }
        if (c.isLink()) {
          drawnLinks.push(c);
        }
      });
      entities.forEach(entity => {
        entity.autosize(initRappid);
        entity.addHandle(initRappid, false);
      });
      things.forEach(thing => {
        thing.drawDuplicationMarkToAllDuplicatesInSameOPD(initRappid);
        thing.addDuplicationMarkToThisElement(thing, initRappid);
        if (thing.getVisual().logicalElement.URLarray.length > 0) {
          thing.updateURLArray();
        }
      });
      states.forEach(st => {
        st.findView(initRappid.paper)?.resize();
      });
      this.graph.getCells().filter(c => c.constructor.name.includes("PartInvocation")).forEach(si => si.addHandle());
      joint.ui.FreeTransform.clear(initRappid.paper);
      if (focusedElement) {
        this.showFocusedElement(initRappid, opd, focusedElement);
      }
      drawnLinks.forEach(lnk => {
        lnk.addDblClickListenerForLabels();
        if (lnk instanceof OpmDefaultLink) {
          lnk.afterRender(initRappid);
        }
      });
      this.drawAllArcs(initRappid);
      initRappid.selection.cancelSelection();
      initRappid.setSelectedElementToNull();
      $(".joint-halo").remove();
    }
    activateOplGeneration(initRappid) {
      if (!initRappid.oplService) {
        return;
      }
      initRappid.oplService.oplOpen = true;
      if (initRappid.oplService.oplSwitch) {
        initRappid.oplService.oplSwitch.next("render");
      }
    }
    setOpdTreeActivity(opd) {
      if ($(".opcloud-opd-tree")[0] && opd.isFlatteningOpd) {
        $(".opcloud-opd-tree")[0].style.pointerEvents = "none";
      } else if ($(".opcloud-opd-tree")[0] && !opd.isFlatteningOpd) {
        $(".opcloud-opd-tree")[0].style.pointerEvents = "all";
      }
    }
    renderGraph(opd, initRappid = null, focusedElement = null, forExportOpl = false, keepPosition = false) {
      initRappid = initRappid || (0, getInitRappidShared)();
      const originalGraph = initRappid.graph;
      const sl = Number(initRappid.paperScroller?.$el?.prop("scrollLeft"));
      const st = Number(initRappid.paperScroller?.$el?.prop("scrollTop"));
      initRappid?.navigatorComponentRef?.existingNavigator?.targetPaper?.freeze();
      initRappid.opmModel.currentOpd = opd;
      this.disableOplRendering(initRappid);
      if (!forExportOpl) {
        this.setPaperInteractivity(initRappid, opd);
        this.removeSystemMapTreeNode(initRappid);
      }
      this.closeSelectedTextEditorBeforeRendering(initRappid);
      this.closeAllPopups();
      const tempGraph = this.prepareTempGraphAsContainer();
      if (forExportOpl) {
        this.graph = tempGraph;
        initRappid.graph = tempGraph;
      }
      const ret = this.splitVisualElementsByTypes(initRappid, opd);
      const semiFoldEmbedding = this.insertNonEmbeddedEntities(ret.unEmbeddedEntities, tempGraph, initRappid);
      this.insertEmbeddedEntities(ret.visualEmbedded, tempGraph, initRappid);
      this.insertLinks(ret.visualLinks, tempGraph, initRappid);
      if (!forExportOpl) {
        this.insertNotes(tempGraph, opd, initRappid);
      }
      this.removeAllArcs(initRappid);
      if (!forExportOpl) {
        this.moveCellsFromTempGraphToMainGraph(tempGraph);
      }
      this.reEmbedEntities(semiFoldEmbedding, opd, initRappid);
      if (forExportOpl) {
        const objects = tempGraph.getCells().filter(c => OPCloudUtils.isInstanceOfDrawnObject(c));
        objects.forEach(obj => obj.ellipsisView(obj.getVisual()));
        return tempGraph;
      } else {
        this.updateDrawnEntitiesViewsAfterRender(opd);
        this.scrollPaperToCenterPosition(initRappid);
        this.afterRenderPaperAdjustments(initRappid, opd, focusedElement);
        this.greyOutEntities(initRappid, this.graph);
        this.makeTransparentForGrid(initRappid);
        this.stopGraphsBatches(tempGraph);
        this.setOpdTreeActivity(opd);
        this.resetGraphBatches();
        this.fixStatesSize(initRappid);
        this.applyConfigurationColors(initRappid);
        if (initRappid.treeViewService) {
          (0, highlighSD)(opd.id, initRappid);
        }
      }
      this.activateOplGeneration(initRappid);
      if (keepPosition) {
        initRappid.paperScroller?.$el?.prop("scrollLeft", sl);
        initRappid.paperScroller?.$el?.prop("scrollTop", st);
      }
      setTimeout(() => initRappid?.navigatorComponentRef?.existingNavigator?.targetPaper.unfreeze(), 150);
    }
    fixStatesSize(init) {
      if (init.paper) {
        for (const state of this.graph.getCells().filter(cell => OPCloudUtils.isInstanceOfDrawnState(cell))) {
          state.autosize(init);
        }
      }
    }
    applyConfigurationColors(initRappid) {
      const currentConfig = initRappid.opmModel.getCurrentConfiguration();
      this.graph.startBatch("ignoreChange");
      // Apply configuration colors to entities (things) that are in the current configuration
      if (currentConfig) {
        const entities = this.graph.getCells().filter(cell => OPCloudUtils.isInstanceOfDrawnEntity(cell) && !OPCloudUtils.isInstanceOfDrawnState(cell) && cell.getVisual()?.logicalElement);
        for (const entity of entities) {
          const logicalLid = entity.getVisual().logicalElement.lid;
          const conf = currentConfig[logicalLid];
          if (conf && conf.value !== 0) {
            entity.colorIfInCurrentConfiguration(initRappid);
          }
        }
      }
      // Apply validation colors to states - ensure they're applied after configuration colors
      const states = this.graph.getCells().filter(cell => OPCloudUtils.isInstanceOfDrawnState(cell));
      for (const state of states) {
        const visual = state.getVisual();
        if (visual) {
          // Call updateView to apply validation colors (setValidationView is called inside updateView)
          state.updateView(visual);
        }
      }
      this.graph.stopBatch("ignoreChange");
    }
    resetGraphBatches() {
      const batches = this.graph._batches;
      const keys = Object.keys(batches);
      for (const key of keys) {
        while (batches[key] > 0) {
          this.graph.stopBatch(key);
        }
      }
    }
    isNumeric(str) {
      return !isNaN(str) && !isNaN(parseFloat(str));
    }
    updateComputationalStateDrawnsByLogicalObject(logical) {
      for (const vis of logical.visualElements) {
        const cell = this.graph.getCell(vis.id);
        if (cell && this.graph.getCell(vis.states[0])) {
          let num = logical.value;
          if (this.isNumeric(num)) {
            num = +logical.value;
            if (num.toString().split(".")[1]?.length && num.toString().split(".")[1].length > this.oplService?.settings?.numericComputationalDigits) {
              num = num.toFixed(this.oplService?.settings?.numericComputationalDigits);
            }
          }
          this.graph.getCell(vis.states[0]).attr("text/textWrap/text", num);
        }
      }
    }
    getForkedLinks(visualLink) {
      return visualLink.source.getLinks().outGoing.filter(l => l.type === linkType.Unidirectional && l.tag === visualLink.tag).sort((a, b) => {
        // making sure that the link that has the shared tag of the fork will be first.
        if (a.labels?.find(label => label.attrs?.label?.text === visualLink.tag)) {
          return -1;
        }
        if (b.labels?.find(label => label.attrs?.label?.text === visualLink.tag)) {
          return 1;
        }
        return 0;
      });
    }
    setTagsOfLink(drawnLink, visualLink) {
      if (visualLink.tag) {
        drawnLink.set("tag", visualLink.tag);
      }
      if (visualLink.backwardTag) {
        drawnLink.set("backwardTag", visualLink.backwardTag);
      }
      if (visualLink.sourceMultiplicity) {
        drawnLink.set("sourceMultiplicity", visualLink.sourceMultiplicity);
      }
      if (visualLink.targetMultiplicity) {
        drawnLink.set("targetMultiplicity", visualLink.targetMultiplicity);
      }
      if (visualLink.path) {
        drawnLink.set("Path", visualLink.path);
      }
      if (visualLink.Probability) {
        drawnLink.set("Probability", visualLink.Probability);
      }
      if (visualLink.rate) {
        drawnLink.set("rate", visualLink.rate);
      }
      if (visualLink.rateUnits) {
        drawnLink.set("rateUnits", visualLink.rateUnits);
      }
      if (visualLink.logicalElement.linkRequirements) {
        drawnLink.set("requirements", visualLink.logicalElement.linkRequirements);
      }
      drawnLink.set("showRequirementsLabel", visualLink.showRequirementsLabel);
    }
    // old Alon's code. still here for backward compatibility for old models that doesn't have
    // the labels array saved in the visual.
    // DO NOT DELETE.
    oldModelsLabelsCompatibility(drawnLink, visualLink) {
      const labelsArray = [];
      let tagPosition = 0.5;
      if (visualLink.backwardTag) {
        tagPosition = 0.1;
      }
      const isBidirectional = visualLink.constructor.name === "OpmTaggedLink" && visualLink.backwardTag;
      if (visualLink.tag && visualLink.type === linkType.Unidirectional && this.getForkedLinks(visualLink).length > 1) {
        if (this.getForkedLinks(visualLink).indexOf(visualLink) === 0) {
          drawnLink.setLabelsOLinks(visualLink.tag, 0.2, -20);
        }
      } else {
        drawnLink.setLabelsOLinks(visualLink.tag, 0.2, -20);
      }
      drawnLink.setLabelsOLinks(visualLink.backwardTag, 0.9, -20, isBidirectional ? -40 : 0);
      drawnLink.setLabelsOLinks(visualLink.sourceMultiplicity, 0.9, -20);
      drawnLink.setLabelsOLinks(visualLink.targetMultiplicity, 0.2, -20);
      const textArray = [];
      if (visualLink.path) {
        textArray.push(visualLink.path);
      }
      if (visualLink.Probability) {
        textArray.push("Pr = " + visualLink.Probability);
      }
      if (visualLink.rate) {
        textArray.push("Rate = " + visualLink.rate);
      }
      const linkText = textArray.join("; ").trim();
      if (linkText) {
        labelsArray.push({
          position: 0.5,
          attrs: {
            text: {
              text: linkText
            }
          }
        });
      }
      if (labelsArray.length > 0) {
        drawnLink.setLabelsOLinks(linkText, 0.5, 20);
      }
    }
    showFocusedElement(initRappid, opd, focusedElement) {
      const logical = focusedElement;
      const cellViews = [];
      if (focusedElement.content) {
        const cell = initRappid.graph.getCell(focusedElement.id);
        const cellView = initRappid.paper.findViewByModel(cell);
        cellViews.push(cellView);
        cellView.highlight(cellView.el);
        initRappid.getPaperScroller().scrollToElement(cell, {
          animation: {
            duration: 2000
          }
        });
      } else {
        for (const visual of opd.visualElements) {
          if (initRappid.getOpmModel().getLogicalElementByVisualId(visual.id) === logical) {
            const cell = initRappid.graph.getCell(visual.id);
            const cellView = initRappid.paper.findViewByModel(cell);
            cellViews.push(cellView);
            cellView.highlight(cellView.el);
            if (OPCloudUtils.isInstanceOfVisualEntity(visual)) {
              initRappid.getPaperScroller().scrollToElement(cell, {
                animation: {
                  duration: 2000
                }
              });
            } else {
              const pointToFocus = cellView.getPointAtRatio(0.98);
              initRappid.getPaperScroller().scroll(pointToFocus.x, pointToFocus.y, {
                animation: {
                  duration: 2000
                }
              });
            }
          }
        }
      }
      setTimeout(() => {
        cellViews.forEach(c => c.unhighlight());
      }, cellViews.length * 2000 + 100);
    }
    // Kfir function - after doing import from opcat, rearrange the graph of the OPD so or/xor will show up
    updateOPDAfterImport(opd, initRappid) {
      const init = (0, getInitRappidShared)();
      const cells1 = this.graph.getCells();
      const links = cells1.filter(element => element.attributes.type.includes("Link"));
      const sourceLinkVisiited = {};
      const targetLinkVisiited = {};
      let changedLinksFlag = false;
      links.forEach(link => {
        const theElement = opd.visualElements.filter(element => element.id === link.id)[0];
        if (theElement && theElement.ImportLink) {
          delete theElement.ImportLink;
          changedLinksFlag = true;
          if (link.targetArcOnLink && link.targetArcOnLink.mSide === "target") {
            if (!targetLinkVisiited.hasOwnProperty(link.id)) {
              const listOfLinks = link.targetArcOnLink.linksArray;
              let x = 0;
              let y = 0;
              listOfLinks.forEach(co_link => {
                x = x + co_link.sourceElement.attributes.position.x;
                y = y + co_link.sourceElement.attributes.position.y;
              });
              const target = link.getTargetElement();
              const point = {
                x: x / listOfLinks.length,
                y: y / listOfLinks.length
              };
              const port = target.findClosestEmptyPort(point);
              if (theElement) {
                theElement.targetVisualElementPort = port;
              }
              listOfLinks.forEach(co_link => {
                targetLinkVisiited[co_link.id] = port;
              });
              link.attributes.target.port = port;
              link.targetArcOnLink.port = port;
            } else {
              if (theElement) {
                theElement.targetVisualElementPort = targetLinkVisiited[link.id];
              }
              link.attributes.target.port = targetLinkVisiited[link.id];
              link.targetArcOnLink.port = targetLinkVisiited[link.id];
            }
          }
          if (link.sourceArcOnLink && link.sourceArcOnLink.mSide === "source") {
            if (!sourceLinkVisiited.hasOwnProperty(link.id)) {
              const listOfLinks = link.sourceArcOnLink.linksArray;
              let x = 0;
              let y = 0;
              listOfLinks.forEach(co_link => {
                x = x + co_link.targetElement.attributes.position.x;
                y = y + co_link.targetElement.attributes.position.y;
              });
              const source = link.getSourceElement();
              const point = {
                x: x / listOfLinks.length,
                y: y / listOfLinks.length
              };
              const port = source.findClosestEmptyPort(point);
              if (theElement) {
                theElement.sourceVisualElementPort = port;
              }
              listOfLinks.forEach(co_link => {
                sourceLinkVisiited[co_link.id] = port;
              });
              link.attributes.source.port = port;
              link.sourceArcOnLink.port = port;
            } else {
              if (theElement) {
                theElement.sourceVisualElementPort = sourceLinkVisiited[link.id];
              }
              link.attributes.source.port = sourceLinkVisiited[link.id];
              link.sourceArcOnLink.port = sourceLinkVisiited[link.id];
            }
          }
        }
      });
      if (changedLinksFlag) {
        this.renderGraph(opd, initRappid);
      }
    }
    drawAllArcs(initRappid) {
      if (initRappid) {
        const allCells = this.graph.getCells().filter(element => element instanceof OpmEntity);
        for (let i = 0; i < allCells.length; i++) {
          const currentElement = allCells[i];
          const currentOutboundLinks = this.graph.getConnectedLinks(currentElement, {
            outbound: true
          });
          for (let j = 0; j < currentOutboundLinks.length; j++) {
            const port = currentOutboundLinks[j].get("source").port;
            if (port) {
              currentOutboundLinks[j].drawArc(initRappid, "source", currentElement, port, {
                outbound: true
              });
            }
          }
          const currentInboundLinks = this.graph.getConnectedLinks(currentElement, {
            inbound: true
          });
          for (let k = 0; k < currentInboundLinks.length; k++) {
            const port = currentInboundLinks[k].get("target").port;
            if (port) {
              currentInboundLinks[k].drawArc(initRappid, "target", currentElement, port, {
                inbound: true
              });
            }
          }
        }
      }
    }
    removeAllArcs(initRappid) {
      if (initRappid && initRappid.paper) {
        const allArcs = initRappid.paper.viewport.children;
        for (let i = allArcs.length - 1; i >= 0; i--) {
          if (allArcs[i].nodeName === "path") {
            allArcs[i].remove();
          }
        }
      }
    }
    // dump the content of 'graph' into the active graph ('activeGraph'). A cell cannot belong
    // to more than one graph.
    dumpIntoActiveGraph(newGraph, activeGraph) {
      const cells = newGraph.getCells();
      // remove all notes from active graph. otherwise the component is left on screen and can't be deleted
      const notesCells = activeGraph.getCells();
      for (let i = 0; i < notesCells.length; i++) {
        if (notesCells[i] instanceof NoteCell) {
          notesCells[i].removeFromDb = false;
          notesCells[i].remove();
        }
      }
      activeGraph.resetCells(cells.map(cell => cell.remove()));
    }
    renderGraphSilent(opd) {
      const graph = new joint.dia.Graph();
      // first stage insert all entities
      for (let i = 0; i < opd.visualElements.length; i++) {
        // if it is an entity and it is not an embedded entity. needed for getting the right z value
        if (opd.visualElements[i] instanceof OpmVisualEntity && !opd.visualElements[i].fatherObject) {
          const drawnElement = createDrawnEntity(opd.visualElements[i].logicalElement.name);
          drawnElement.updateEntityFromOpmModel(opd.visualElements[i]);
          graph.addCell(drawnElement);
        }
      }
      // second stage insert embedded entities
      for (let i = 0; i < opd.visualElements.length; i++) {
        // if it is an embedded entity
        if (opd.visualElements[i] instanceof OpmVisualEntity && opd.visualElements[i].fatherObject) {
          const visual = opd.visualElements[i];
          const drawnElement = createDrawnEntity(visual.logicalElement.name);
          drawnElement.updateParamsFromOpmModel(opd.visualElements[i]);
          graph.addCell(drawnElement);
          // drawnElement.updateTextSize(textWrapping.calculateNewTextSize(drawnElement.attr('text/text'), drawnElement));
        }
      }
      // reEmbedding(graph, opd);
      // third stage insert all links
      for (let i = 0; i < opd.visualElements.length; i++) {
        if (opd.visualElements[i] instanceof OpmLink) {
          let sourceVisualElement;
          let targetVisualElement;
          let linkT;
          let condition;
          let event;
          let negation;
          let symbolPos;
          let BreakPoints;
          let tag;
          let backwardTag;
          let path;
          let probability;
          let rate;
          let sourceMultiplicity;
          let targetMultiplicity; // converting for getting the link type
          linkT = opd.visualElements[i].logicalElement.linkType;
          if (opd.visualElements[i] instanceof OpmProceduralLink) {
            sourceVisualElement = opd.visualElements[i].sourceVisualElement;
            targetVisualElement = opd.visualElements[i].targetVisualElements[0].targetVisualElement;
            condition = opd.visualElements[i].logicalElement.condition;
            event = opd.visualElements[i].logicalElement.event;
            negation = opd.visualElements[i].logicalElement.negation;
          } else if (opd.visualElements[i] instanceof OpmStructuralLink) {
            sourceVisualElement = opd.visualElements[i].sourceVisualElement;
            targetVisualElement = opd.visualElements[i].targetVisualElements[0].targetVisualElement;
          }
          const sourceDrawnElement = graph.getCells().filter(element => element.id === sourceVisualElement.id)[0];
          const targetDrawnElement = graph.getCells().filter(element => element.id === targetVisualElement.id)[0];
          if (!sourceDrawnElement || !targetDrawnElement) {
            continue;
          }
          const drawnLink = createDrawnLink(sourceDrawnElement, targetDrawnElement, condition, event, negation, linkType[linkT], graph);
          drawnLink.set("id", opd.visualElements[i].id);
          drawnLink.set("previousSourceId", sourceDrawnElement.id);
          drawnLink.set("previousTargetId", targetDrawnElement.id);
          drawnLink.set("target", {
            id: targetDrawnElement.id,
            port: opd.visualElements[i].targetVisualElementPort
          });
          BreakPoints = opd.visualElements[i].BreakPoints;
          if (BreakPoints) {
            const Vertices = [];
            for (const point of BreakPoints) {
              Vertices.push({
                x: point.x,
                y: point.y
              });
            }
            drawnLink.set("vertices", [...Vertices]);
          }
          // UPDATE Symbol Position
          if (opd.visualElements[i] instanceof OpmFundamentalLink) {
            drawnLink.mainUpperLink.set("source", {
              id: drawnLink.mainUpperLink.get("source").id,
              port: opd.visualElements[i].sourceVisualElementPort
            });
            symbolPos = opd.visualElements[i].getSymbolPos();
            if (symbolPos) {
              drawnLink.triangle.attributes.position.x = symbolPos[0];
              drawnLink.triangle.attributes.position.y = symbolPos[1];
            }
          } else {
            drawnLink.set("source", {
              id: sourceDrawnElement.id,
              port: opd.visualElements[i].sourceVisualElementPort
            });
          }
          // UPDATE Link Labels/Tags
          const labelsArray = [];
          let tagPosition = 0.5;
          if (opd.visualElements[i].backwardTag) {
            tagPosition = 0.1;
          }
          if (opd.visualElements[i].tag) {
            drawnLink.set("tag", opd.visualElements[i].tag);
            labelsArray.push({
              position: tagPosition,
              attrs: {
                text: {
                  text: opd.visualElements[i].tag
                }
              }
            });
          }
          if (opd.visualElements[i].backwardTag) {
            drawnLink.set("backwardTag", opd.visualElements[i].backwardTag);
            labelsArray.push({
              position: 0.9,
              attrs: {
                text: {
                  text: opd.visualElements[i].backwardTag
                }
              }
            });
          }
          if (opd.visualElements[i].sourceMultiplicity) {
            drawnLink.set("sourceMultiplicity", opd.visualElements[i].sourceMultiplicity);
            labelsArray.push({
              position: 0.1,
              attrs: {
                text: {
                  text: opd.visualElements[i].sourceMultiplicity
                }
              }
            });
          }
          if (opd.visualElements[i].targetMultiplicity) {
            drawnLink.set("targetMultiplicity", opd.visualElements[i].targetMultiplicity);
            labelsArray.push({
              position: 0.9,
              attrs: {
                text: {
                  text: opd.visualElements[i].targetMultiplicity
                }
              }
            });
          }
          const textArray = [];
          if (opd.visualElements[i].path) {
            drawnLink.set("path", opd.visualElements[i].path);
            textArray.push(opd.visualElements[i].path);
          }
          if (opd.visualElements[i].probability) {
            drawnLink.set("probability", opd.visualElements[i].probability);
            textArray.push("Pr = " + opd.visualElements[i].probability);
          }
          if (opd.visualElements[i].rate) {
            drawnLink.set("rate", opd.visualElements[i].rate);
            textArray.push("Rate = " + opd.visualElements[i].rate);
          }
          const linkText = textArray.join("; ").trim();
          if (linkText) {
            labelsArray.push({
              position: 0.5,
              attrs: {
                text: {
                  text: linkText
                }
              }
            });
          }
          if (labelsArray.length > 0) {
            drawnLink.set("labels", labelsArray);
          }
          /*
          if(opd.visualElements[i] instanceof OpmTaggedLinkVisual){
            forward = opd.visualElements[i].logicalElement.forwardTag;
            backward = opd.visualElements[i].logicalElement.backwardTag;
            if(forward){
                drawnLink.prop(['labels',0, 'attrs','text','text'],forward);
              }
            if(backward){
                drawnLink.prop(['labels',1, 'attrs','text','text'],backward);
              }
          }
          */
          graph.addCell(drawnLink);
        }
      }
      // reEmbedding(graph, opd);
      // Daniel: For Ellipsis, will be changed.
      /*for (let i = 0; i < opd.visualElements.length; i++) {
        if (opd.visualElements[i] instanceof OpmVisualObject) {
          const ellipsis = opd.visualElements[i].ellipsis;
          if (ellipsis) {
            if (!ellipsis.xPos || !ellipsis.yPos)
              ellipsis.setDefaultPosition();
            const object = graph.getCell(opd.visualElements[i].id);
            object.set('size', { width: opd.visualElements[i].width, height: object.get('size').height });
            const child = new OpmEllipsis();
            child.updateParamsFromOpmModel(ellipsis);
            object.embed(child);
            child.set('father', child.get('parent'));
            graph.addCell(child);
          }
        }
      }*/
      return graph;
      // const options = {};
      // options.graph = graph;
      // options.opmModel = this.optio
      // options.
      // return graph;
    }
    /*public updateScreen(visuals: Array<OpmVisualEntity>) {
      // We get ONLY the top level objects
      // For VisualObject only for now.
      for (let i = 0; i < visuals.length; i++) {
        const visual = visuals[i];
        if (visual instanceof OpmVisualObject) {
          let drawn = this.graph.getCells().find(c => c.id === visual.id);
          if (!drawn) {
            drawn = createDrawnEntity(visual.logicalElement.name);
          }
          drawn.updateParamsFromOpmModel(visual);
          this.graph.addCell(drawn);
          for (let j = 0; j < visual.states.length; j++) {
            const state = visual.states[j];
            let embedded = this.graph.getCells().find(c => c.id === state.id);
            if (!embedded) {
              embedded = createDrawnEntity(state.logicalElement.name);
            }
            embedded.updateParamsFromOpmModel(state);
            this.graph.addCell(embedded);
            drawn.embed(embedded);
            embedded.set('father', embedded.get('parent'));
          }
          const ellipsis = visual.ellipsis;
          if (ellipsis) {
            const embedded = new OpmEllipsis();
            embedded.updateParamsFromOpmModel(ellipsis);
            embedded.ecallback = ellipsis.ecallback;
            this.graph.addCell(embedded);
            drawn.embed(embedded);
            embedded.set('father', embedded.get('parent'));
          }
        }
      }
    }*/
    /**
     * Alon: mapping elements in the model
     */
    displayElements(options) {
      const _options = options;
      const opds = _options.opmModel.opds;
      const elements = [];
      for (let i = 0; i < opds.length; i++) {
        for (let j = 0; j < opds[i].visualElements.length; j++) {
          if (!(opds[i].visualElements[j] instanceof OpmLink)) {
            elements.push(opds[i].visualElements[j]);
          }
        }
      }
      // const liList = elements.map(item => `<li> ${item.logicalElement._text}</li>`);
      // const htmlString = `<ol>${liList.join('')}</ol>`;
      const liList = elements.map(item => item.logicalElement._text);
      return liList;
      // new joint.ui.FlashMessage({
      //   title: 'Elements in model: ',
      //   type: 'success',
      //   closeAnimation: false,
      //   content: ['<div style="overflow:scroll; height:100px">' + htmlString + '</div>'],
      // }).open();
    }
    viewRemove(elements) {
      this.graph.startBatch("ignoreChange");
      this.graph.startBatch("ignoreEvents");
      for (let i = 0; i < elements.length; i++) {
        const drawn = this.graph.getCell(elements[i].id);
        if (drawn) {
          drawn.remove();
        }
      }
      this.graph.stopBatch("ignoreEvents");
      this.graph.stopBatch("ignoreChange");
    }
    viewEntityUpadate(entities) {
      this.graph.startBatch("ignoreChange");
      this.graph.startBatch("ignoreEvents");
      for (const entity of entities) {
        if (entity?.id) {
          // Check if entity and entity.id are valid
          const drawn = this.graph.getCell(entity.id);
          if (drawn) {
            drawn.updateView(entity);
          }
        }
      }
      this.graph.stopBatch("ignoreEvents");
      this.graph.stopBatch("ignoreChange");
    }
    updateLinksView(links) {
      this.graph.startBatch("ignoreChange");
      this.graph.startBatch("ignoreEvents");
      for (const link of links) {
        this.drawLink(link);
      }
      this.graph.stopBatch("ignoreEvents");
      this.graph.stopBatch("ignoreChange");
    }
    drawLink(link) {
      let sourceVisualElement;
      let targetVisualElement;
      let linkT;
      let condition;
      let event;
      let negation;
      let center;
      let strokeWidth;
      let strokeColor;
      let symbolPos;
      let BreakPoints;
      let tag;
      let backwardTag;
      let path;
      let probability;
      let rate;
      let sourceMultiplicity;
      let targetMultiplicity;
      let timeMax;
      let timeMin; // converting for getting the link type
      linkT = link.logicalElement.linkType;
      if (link instanceof OpmProceduralLink) {
        sourceVisualElement = link.sourceVisualElement;
        targetVisualElement = link.targetVisualElements[0].targetVisualElement;
        condition = link.logicalElement.condition;
        event = link.logicalElement.event;
        negation = link.logicalElement.negation;
        center = link.center;
      } else if (link instanceof OpmStructuralLink) {
        sourceVisualElement = link.sourceVisualElement;
        targetVisualElement = link.targetVisualElements[0].targetVisualElement;
      }
      const sourceDrawnElement = this.graph.getCell(sourceVisualElement.id);
      const targetDrawnElement = this.graph.getCell(targetVisualElement.id);
      if (!sourceDrawnElement || !targetDrawnElement) {
        return;
      }
      const drawnLink = createDrawnLink(sourceDrawnElement, targetDrawnElement, condition, event, negation, linkType[linkT], this.graph, center);
      drawnLink.set("id", link.id);
      drawnLink.set("previousSourceId", drawnLink.get("source").id); // in case of fundamental link it will be the triangle
      drawnLink.set("previousTargetId", targetDrawnElement.id);
      // if ((link as OpmLink).visible === false)
      //   drawnLink.hide();
      const tPort = link.targetVisualElementPort;
      if (tPort) {
        drawnLink.set("target", {
          id: targetDrawnElement.id,
          port: tPort
        });
      }
      BreakPoints = link.BreakPoints;
      if (BreakPoints) {
        const Vertices = [];
        for (const point of BreakPoints) {
          Vertices.push({
            x: point.x,
            y: point.y
          });
        }
        drawnLink.set("vertices", [...Vertices]);
      }
      // UPDATE Symbol Position
      if (link instanceof OpmFundamentalLink) {
        drawnLink.mainUpperLink.set("source", {
          id: drawnLink.mainUpperLink.get("source").id,
          port: link.sourceVisualElementPort
        });
        symbolPos = link.getSymbolPos();
        if (symbolPos) {
          drawnLink.triangle.position(symbolPos[0], symbolPos[1]);
        }
        if (link.CheckAddLine().missingNumber > 0) {
          // check if there is a need to add a line and a number
          drawnLink.AddLineAndNumber();
        }
      } else {
        drawnLink.set("source", {
          id: sourceDrawnElement.id,
          port: link.sourceVisualElementPort
        });
      }
      // Update vertices if applicable
      if (typeof drawnLink.UpdateVertices === "function") {
        drawnLink.UpdateVertices();
      }
      if (drawnLink instanceof SelfInvocationLink_SelfInvocationLink) {
        drawnLink.setPeakPosition(link.selfInvocationPeakPoint);
      }
      if (link.strokeColor) {
        drawnLink.attr({
          line: {
            stroke: link.strokeColor
          }
        });
        if (link.constructor.name === "OpmFundamentalLink") {
          drawnLink.mainUpperLink.attr({
            line: {
              stroke: link.strokeColor
            }
          });
        }
      }
      if (link.strokeWidth) {
        drawnLink.attr({
          line: {
            strokeWidth: link.strokeWidth
          }
        });
        if (link.constructor.name === "OpmFundamentalLink") {
          drawnLink.mainUpperLink.attr({
            line: {
              strokeWidth: link.strokeWidth
            }
          });
        }
      }
      if (link.belongsToSubModel || link.logicalElement.visualElements.some(v => v.protectedFromBeingChangedBySubModel || v.belongsToFatherModelId)) {
        drawnLink.attr({
          ".": {
            opacity: 0.6
          }
        });
        if (link.isFundamentalLink()) {
          drawnLink.mainUpperLink.attr({
            ".": {
              opacity: 0.6
            }
          });
          drawnLink.getSourceElement()?.attr({
            ".": {
              opacity: 0.6
            }
          }); // opacity of the triangle.
        }
      }
      this.setTagsOfLink(drawnLink, link);
      // UPDATE Link Labels/Tags
      if (link.labels && link.labels.length > 0) {
        drawnLink.labels(link.labels);
      } else {
        // backward compatibility for old models labels
        this.oldModelsLabelsCompatibility(drawnLink, link);
      }
      if (link.visible !== false) {
        this.graph.addCell(drawnLink);
      }
      if (link.constructor.name === "OpmFundamentalLink" && !OPCloudUtils.isInstanceOfDrawnSemiFoldedFundamental(this.graph.getCell(link.target)) && !OPCloudUtils.isInstanceOfDrawnSemiFoldedFundamental(this.graph.getCell(link.source))) {
        this.graph.getCell(link.source)?.sortStructuralLinks();
        this.graph.getCell(link.target)?.sortStructuralLinks();
      }
    }
    beautifyThings(thingsArr, cellsIdsThatCanBeMoved) {
      let changeMade = false;
      let things = thingsArr.sort((a, b) => a.get("position").x > b.get("position").x ? 1 : -1);
      do {
        changeMade = false;
        for (const cellA of things) {
          for (const cellB of things) {
            const embeddedA = cellA.getEmbeddedCells().filter(c => OPCloudUtils.isInstanceOfDrawnThing(c));
            const embeddedB = cellB.getEmbeddedCells().filter(c => OPCloudUtils.isInstanceOfDrawnThing(c));
            if (cellA === cellB || embeddedA.length > 0 || embeddedB.length > 0) {
              continue;
            }
            const bboxA = cellA.getBBox().inflate(10, 10);
            const bboxB = cellB.getBBox().inflate(10, 10);
            const intersection = bboxA.intersect(bboxB);
            if (intersection && cellsIdsThatCanBeMoved.includes(cellB.id)) {
              changeMade = true;
              if (intersection.width < intersection.height) {
                cellB.translate(intersection.width + 20, 0);
              } else {
                cellB.translate(0, intersection.height + 20);
              }
            }
          }
        }
      } while (changeMade);
    }
    updateEntityViews() {}
    resetModelObject() {
      this.graph.clear();
    }
    renderStereotype(stereotype) {
      this.renderGraph(stereotype.getOpd());
    }
    createSemifoldedDrawn(visual) {
      const position = this.graph.getCell(visual.fatherObject.id).get("position");
      const semi = new OpmSemifoldedFundamental(visual.isFoldedUnderThing().triangleType, visual.type);
      semi.id = visual.id;
      semi.set("id", visual.id);
      semi.updateText(visual.logicalElement.getBareName());
      semi.attr("label/fill", (0, getTextColor)(visual));
      semi.set("position", {
        x: position.x + visual.xPos,
        y: position.y + visual.yPos
      });
      return semi;
    }
    updateEntity(visual) {
      const drawns = new Array();
      const current = visual.logicalElement.opmModel.currentOpd.visualElements.find(v => visual == v);
      let drawn = this.graph.getCell(visual.id);
      if (drawn) {
        if (!current) {
          drawn.remove();
          return [];
        }
      } else {
        // if (!current) {
        //   return [];
        // }
        if (visual instanceof OpmVisualThing && visual.isFoldedUnderThing().isFolded) {
          drawn = this.createSemifoldedDrawn(visual);
        } else {
          drawn = createDrawnEntity(visual.logicalElement.name);
        }
        drawns.push(drawn);
      }
      for (const embedded_drawn of drawn.getEmbeddedCells()) {
        if (visual.getChildren().find(v => v.id == embedded_drawn.id) == undefined) {
          embedded_drawn.remove();
        }
      }
      drawn.updateParamsFromOpmModel(visual);
      this.graph.addCell(drawn);
      drawn.updateView(visual);
      for (const embedded of visual.getChildren()) {
        const embedded_drawns = this.updateEntity(embedded);
        for (const embedded_drawn of embedded_drawns) {
          drawn.embed(embedded_drawn);
          embedded_drawn.set("father", drawn);
        }
        drawns.push(...embedded_drawns);
      }
      if (drawn instanceof OpmThing) {
        drawn.drawDuplicationMarkToAllDuplicatesInSameOPD((0, getInitRappidShared)());
      }
      return drawns;
    }
    createDrawnEntity(type) {
      return createDrawnEntity(type);
    }
    loadLogOfUndoRedo(item) {
      this.graph.startBatch("undoredo");
      const init = (0, getInitRappidShared)();
      const model = init.getOpmModel();
      if (init && init.graph) {
        if (model.currentOpd.id !== item.opd.id || item.reason?.includes("labels") || item.reason?.includes("link style")) {
          init.graphService.renderGraph(model.currentOpd, init, null, false, item.reason?.includes("labels") || item.reason?.includes("link style"));
          return;
        } else {
          const cells = init.graph.getCells();
          for (let i = cells.length - 1; i >= 0; i--) {
            const cell = cells[i];
            if (!model.getVisualElementById(cell.id) || model.getOpdByThingId(cell.id).id !== model.currentOpd.id) {
              if (cell instanceof Note) {
                if (!model.currentOpd.notes.find(n => n.id === cell.id)) {
                  cell.remove();
                }
              } else if (!cell.constructor.name.includes("Default") && !cell.constructor.name.includes("Triangle")) {
                init.graph.startBatch("ignoreChange");
                init.graph.removeCells(cell);
                init.graph.stopBatch("ignoreChange");
              }
            }
          }
          const entities = model.currentOpd.visualElements.filter(vs => vs instanceof OpmVisualEntity);
          for (const vis of entities) {
            init.graph.startBatch("ignoreEvents");
            this.updateEntity(vis);
            init.graph.stopBatch("ignoreEvents");
          }
          for (const vis of model.currentOpd.visualElements.filter(vsl => vsl instanceof OpmLink)) {
            const cell = init.graph.getCell(vis.id);
            if (cell && !(cell instanceof OpmFundamentalLink) && !cell.constructor.name.includes("Default") && !cell.constructor.name.includes("Triangle")) {
              init.graph.startBatch("ignoreChange");
              cell.updateParamsFromOpmModel(vis);
              init.graph.stopBatch("ignoreChange");
            } else if (!cell && vis instanceof OpmLink && vis.visible !== false) {
              init.graphService.drawLink(vis);
            }
          }
          if (init.notes) {
            for (let i = 0; i < init.getOpmModel().currentOpd.notes.length; i++) {
              const drawnElement = init.graph.getCell(init.getOpmModel().currentOpd.notes[i].id) || new Note();
              drawnElement.updateParamsFromOpmModel(init.getOpmModel().currentOpd.notes[i]);
              init.graph.addCell(drawnElement);
            }
            for (let i = 0; i < init.getOpmModel().currentOpd.noteLinks.length; i++) {
              const drawnElement = new OpmDefaultLink();
              drawnElement.updateParamsFromOpmModel(init.getOpmModel().currentOpd.noteLinks[i]);
              init.graph.addCell(drawnElement);
            }
          }
          const drawnEntities = init.graph.getCells().filter(cell => cell instanceof OpmEntity);
          drawnEntities.forEach(ent => ent.autosize(init));
          const drawnStates = init.graph.getCells().filter(cell => cell instanceof OpmState);
          drawnStates.forEach(st => st.set("z", st.getParent().get("z") + 1));
          drawnEntities.forEach(ent => Arc.redrawAllArcs(ent, init, true));
        }
        initRappidShared.getTreeView().init(initRappidShared.getOpmModel());
        setTimeout(function () {
          (0, highlighSD)(model.currentOpd.id, initRappidShared);
        }, 30);
      }
      this.graph.stopBatch("undoredo");
    }
    viewSemiFoldedUpdate(ret) {
      this.graph.startBatch("semifolding");
      for (const vis of ret.created.filter(c => c instanceof OpmVisualEntity)) {
        const semi = new OpmSemifoldedFundamental(vis.isFoldedUnderThing().triangleType, vis.type);
        semi.id = vis.id;
        semi.set("id", vis.id);
        semi.updateText(vis.logicalElement.getBareName());
        // semi.attr('label/text', (<any>vis.logicalElement).text);
        semi.attr("label/fill", (0, getTextColor)(vis));
        const pos = {
          x: ret.thing.xPos + vis.xPos,
          y: ret.thing.yPos + vis.yPos
        };
        semi.set("position", pos);
        this.graph.startBatch("ignoreEvents");
        this.graph.startBatch("ignoreChange");
        this.graph.addCell(semi);
        this.graph.getCell(ret.thing.id).embed(semi);
        this.graph.stopBatch("ignoreChange");
        this.graph.stopBatch("ignoreEvents");
      }
      for (const vis of ret.removed) {
        if (this.graph.getCell(vis.id)) {
          this.graph.getCell(vis.id).remove();
        }
      }
      this.updateLinksView(ret.created.filter(c => c instanceof OpmLink));
      this.graph.getCell(ret.thing.id).updateView(ret.thing);
      for (const semf of ret.thing.semiFolded) {
        const cell = this.graph.getCell(semf.id);
        cell.set("position", {
          x: semf.xPos + ret.thing.xPos,
          y: semf.yPos + ret.thing.yPos
        });
      }
      // this.viewEntityUpadate([ret.thing]);
      this.graph.stopBatch("semifolding");
    }
    arrangeObjects(direction, initRappid, selectionArray) {
      const drawnObjects = selectionArray?.filter(cell => OPCloudUtils.isInstanceOfDrawnObject(cell) && !cell.getParent());
      const drawnProcesses = selectionArray?.filter(cell => OPCloudUtils.isInstanceOfDrawnProcess(cell) && !cell.getParent());
      let cellsToArrange;
      if (drawnObjects.length === 0) {
        cellsToArrange = drawnProcesses;
      } else {
        cellsToArrange = drawnObjects;
      }
      if (!cellsToArrange || cellsToArrange.length === 0) {
        return;
      }
      const drawnObjectsChildren = [];
      cellsToArrange.forEach(obj => {
        if (obj.getEmbeddedCells()?.length > 0) {
          drawnObjectsChildren.push(...obj.getEmbeddedCells());
        }
      });
      const drawnEntitiesWithoutSelectedObjectsAndChildren = initRappid.graph.getCells().filter(entity => !cellsToArrange.includes(entity) && !drawnObjectsChildren.includes(entity)).filter(entity => !entity.isLink());
      const visualObjects = cellsToArrange.map(ob => ob.getVisual());
      const params = initRappid.getOpmModel().arrangeObjects(visualObjects, direction);
      this.updateDrawnPos(visualObjects);
      for (const ent of cellsToArrange.concat(drawnObjectsChildren)) {
        Arc.redrawAllArcs(ent, initRappid, true);
      }
      initRappid.selection.collection.reset(cellsToArrange);
      const shouldChangePositionOfObjects = this.isPositionShiftNeeded(cellsToArrange, drawnEntitiesWithoutSelectedObjectsAndChildren, direction);
      if (shouldChangePositionOfObjects.answer === true) {
        params.shouldUpdateBothAxis = false;
        if (shouldChangePositionOfObjects.ax === "vertical") {
          params.yPos = shouldChangePositionOfObjects.newPos;
        } else {
          params.xPos = shouldChangePositionOfObjects.newPos;
        }
        initRappid.getOpmModel().uiArrangement.updatePosForObjectsArrangement(params);
        this.updateDrawnPos(visualObjects);
        for (const ent of cellsToArrange.concat(drawnObjectsChildren)) {
          Arc.redrawAllArcs(ent, initRappid, true);
        }
        initRappid.selection.collection.reset(cellsToArrange);
      }
    }
    /**
     * @param selectedDrawnObjects
     * @param otherEntities
     * @param direction
     * Amit: Checks if the new position (after first positioning changes) of the selected objects intersects other entity.
     * In case it does, returns new location that will not intersect any other entity.
     */
    isPositionShiftNeeded(selectedDrawnObjects, otherEntities, direction) {
      const that = this;
      const selectedObjectsBBox = (0, getInitRappidShared)().graph.getCellsBBox(selectedDrawnObjects);
      const otherEntitiesBBox = (0, getInitRappidShared)().graph.getCellsBBox(otherEntities);
      if (otherEntities.length > 0) {
        for (let i = 0; i < otherEntities.length; i++) {
          const bBox = otherEntities[i].getBBox();
          const indicators = that.wraperForConditions(selectedObjectsBBox, bBox);
          if ((indicators.objectsXposInBbox || indicators.objectsRightXposInBbox) && (indicators.objectsYposInBbox || indicators.objectsLowerYposInBbox) || (indicators.bBoxXposInObjects || indicators.bBoxRightXposInObjects) && (indicators.bBoxYposInObjects || indicators.bBoxLowerYposInObjects)) {
            switch (direction) {
              case "bottom":
                return {
                  answer: true,
                  newPos: otherEntitiesBBox.y + otherEntitiesBBox.height + selectedObjectsBBox.height,
                  ax: "vertical"
                };
              case "top":
                return {
                  answer: true,
                  newPos: otherEntitiesBBox.y - selectedObjectsBBox.height * 1.5,
                  ax: "vertical"
                };
              case "left":
                return {
                  answer: true,
                  newPos: otherEntitiesBBox.x - selectedObjectsBBox.width * 1.5,
                  ax: "horizontal"
                };
              case "right":
                return {
                  answer: true,
                  newPos: otherEntitiesBBox.x + otherEntitiesBBox.width + selectedObjectsBBox.width,
                  ax: "horizontal"
                };
            }
          }
        }
      }
      return {
        answer: false,
        newPos: undefined,
        ax: undefined
      };
    }
    /**
     * @param selectedObjectsBBox
     * @param bBox
     * Amit: Auxiliary function. Checks if situations of intersection between selected objects and other entities are happening,
     * and returns an object with all boolean results.
     */
    wraperForConditions(selectedObjectsBBox, bBox) {
      const objectsXposInBbox = this.isBetweenValues(selectedObjectsBBox.x, bBox.x, bBox.x + bBox.width);
      const objectsRightXposInBbox = this.isBetweenValues(selectedObjectsBBox.x + selectedObjectsBBox.width, bBox.x, bBox.x + bBox.width);
      const objectsYposInBbox = this.isBetweenValues(selectedObjectsBBox.y, bBox.y, bBox.y + bBox.height);
      const objectsLowerYposInBbox = this.isBetweenValues(selectedObjectsBBox.y + selectedObjectsBBox.height, bBox.y, bBox.y + bBox.height);
      const bBoxYposInObjects = this.isBetweenValues(bBox.y, selectedObjectsBBox.y, selectedObjectsBBox.y + selectedObjectsBBox.height);
      const bBoxLowerYposInObjects = this.isBetweenValues(bBox.y + bBox.height, selectedObjectsBBox.y, selectedObjectsBBox.y + selectedObjectsBBox.height);
      const bBoxXposInObjects = this.isBetweenValues(bBox.x, selectedObjectsBBox.x, selectedObjectsBBox.x + selectedObjectsBBox.width);
      const bBoxRightXposInObjects = this.isBetweenValues(bBox.x + bBox.width, selectedObjectsBBox.x, selectedObjectsBBox.x + selectedObjectsBBox.width);
      return {
        objectsXposInBbox: objectsXposInBbox,
        objectsRightXposInBbox: objectsRightXposInBbox,
        objectsYposInBbox: objectsYposInBbox,
        objectsLowerYposInBbox: objectsLowerYposInBbox,
        bBoxYposInObjects: bBoxYposInObjects,
        bBoxLowerYposInObjects: bBoxLowerYposInObjects,
        bBoxXposInObjects: bBoxXposInObjects,
        bBoxRightXposInObjects: bBoxRightXposInObjects
      };
    }
    isBetweenValues(value, min, max) {
      return value >= min && value <= max;
    }
    /**
     * @param selectedObjects
     * Updates cells positions. Happens after the visual entities of these cells were updated.
     */
    updateDrawnPos(selectedObjects) {
      for (const vis of selectedObjects) {
        const cell = this.graph.getCell(vis.id);
        if (!cell) {
          continue;
        }
        cell.updateView(vis);
        if (cell.getEmbeddedCells()?.length > 0) {
          cell.getEmbeddedCells().forEach(child => {
            if (OPCloudUtils.isInstanceOfDrawnEntity(child)) {
              child.updateView(child.getVisual());
            }
          });
        }
        if (vis.semiFolded?.length > 0) {
          for (const visSemi of vis.semiFolded) {
            const drwn = this.graph.getCell(visSemi.id);
            drwn.set("position", {
              x: visSemi.xPos + vis.xPos,
              y: visSemi.yPos + vis.yPos
            });
          }
        }
      }
    }
    updateGraphAfterUnfoldedTreeViewCreation(initRappid) {
      const trs = initRappid.graph.getCells().filter(c => c.constructor.name.includes("Triangle"));
      for (const tr of trs) {
        const same = trs.filter(t => t.get("position").x === tr.get("position").x).sort((a, b) => {
          const aPos = initRappid.graph.getConnectedLinks(a, {
            outbound: true
          })[0].getTargetElement().get("position").y;
          const bPos = initRappid.graph.getConnectedLinks(b, {
            outbound: true
          })[0].getTargetElement().get("position").y;
          return bPos - aPos;
        });
        same.forEach(t => t.set("position", {
          x: t.get("position").x + same.indexOf(t) * 35,
          y: t.get("position").y
        }));
      }
      initRappid.graph.getCells().forEach(cell => {
        if (OPCloudUtils.isInstanceOfDrawnEntity(cell)) {
          cell.autosize(initRappid);
        }
      });
    }
    updateGraphAfterRemoveSemifolding(init, thing) {
      this.renderGraph(init.opmModel.currentOpd, init);
      this.graph.getCell(thing.id)?.set("size", {
        width: 10,
        height: 10
      }).changeSizeHandle(init);
    }
    resetElementTextPosition(selected) {
      let refX = 0.5;
      let refY = 0.5;
      selected.getVisual().isManualTextPos = false;
      if (selected instanceof OpmState) {
        selected.attr("text/ref-x", refX);
        selected.attr("text/ref-y", refY);
        selected.getVisual().refX = refX;
        selected.getVisual().refY = refY;
        return;
      }
      if (selected.getVisual().getRefineeInzoom() === selected.getVisual()) {
        refX = 0.5;
        refY = 0.1;
        selected.attr({
          text: {
            "y-alignment": "middle"
          }
        });
      } else if (selected.getVisual().isSemiFolded()) {
        refX = 0.5;
        refY = 25;
      } else if (selected.getVisual().states && selected.getVisual().states.length > 0) {
        const arrangement = selected.getVisual().statesArrangement;
        let value;
        if (arrangement === undefined || arrangement === null || arrangement === statesArrangement.Bottom) {
          value = "top";
          refX = 0.5;
          refY = 0.1;
        } else if (arrangement === statesArrangement.Left) {
          value = "middle";
          refX = 0.95;
          refY = 0.5;
        } else if (arrangement === statesArrangement.Right) {
          value = "middle";
          refX = 0.05;
          refY = 0.5;
        } else if (arrangement === statesArrangement.Top) {
          value = "bottom";
          refX = 0.5;
          refY = 0.9;
        }
        selected.attr({
          text: {
            "y-alignment": value
          }
        });
      } else {
        selected.attr({
          text: {
            "y-alignment": "middle"
          }
        });
        refX = 0.5;
        refY = 0.5;
      }
      selected.attr("text/ref-x", refX);
      selected.attr("text/ref-y", refY);
    }
    fixViewOfRequirementObjects(init, visuals) {
      for (const object of visuals.filter(v => OPCloudUtils.isInstanceOfVisualObject(v) && v.logicalElement.isSatisfiedRequirementObject())) {
        const cell = init.graph.getCell(object.id);
        if (cell) {
          cell.shiftEmbeddedToEdge(init);
        }
      }
    }
    static #_ = (() => this.ɵfac = function GraphService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || GraphService)(core /* ɵɵinject */.KVO(NoteService), core /* ɵɵinject */.KVO(OplService));
    })();
    static #_2 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: GraphService,
      factory: GraphService.ɵfac
    }))();
  }
  return GraphService;
})();
function reEmbedding(graph, opd) {
  for (let i = 0; i < opd.visualElements.length; i++) {
    if (opd.visualElements[i] instanceof OpmVisualEntity) {
      const parentObject = opd.visualElements[i].fatherObject;
      if (parentObject) {
        const drawParent = graph.getCell(parentObject.id);
        const child = graph.getCell(opd.visualElements[i].id);
        if (!child) {
          continue;
        }
        if (drawParent) {
          drawParent.embed(child);
        }
        if (child instanceof OpmState || child instanceof OpmObject || child instanceof OpmSemifoldedFundamental) {
          child.set("father", child.get("parent")); // needed for delete handle of state
          // arrangeEmbedded(drawParent, drawParent.attr('statesArrange'));
        }
        if (drawParent instanceof OpmProcess) {
          drawParent.set("padding", 100);
        }
      }
    }
  }
}