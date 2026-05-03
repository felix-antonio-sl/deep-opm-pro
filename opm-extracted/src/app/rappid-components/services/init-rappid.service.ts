// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/services/init-rappid.service.ts
// Extracted by opm-extracted/tools/extract.mjs

// treeview imports

// popup imports

// TODO: import specific lodash methods

// TODO: check if needed to be removed on next rappid upgrade.
joint.dia.Paper.prototype.sortViews = function () {
  const $cells = $(this.viewport).children("[model-id]");
  const cells = this.model.get("cells");
  joint.util.sortElements($cells, function (a, b) {
    const cellA = cells.get($(a).attr("model-id"));
    const cellB = cells.get($(b).attr("model-id"));
    if ((cellA?.get("z") || 0) > (cellB?.get("z") || 0)) {
      return 1;
    } else {
      return -1;
    }
  });
};
// TODO: remove on next rappid upgrade. it is a fix for the problem of the navigator becoming unsynced and throws errors.
joint.dia.Paper.prototype.renderView = function (cell, opt) {
  const {
    id
  } = cell;
  const views = this._views;
  let view;
  let flag;
  let create = true;
  if (id in views) {
    view = views[id];
    if (view.model === cell) {
      flag = view.FLAG_INSERT;
      create = false;
    } else {
      // The view for this `id` already exist.
      // The cell is a new instance of the model with identical id
      // We simply remove the existing view and create a new one
      this.removeView(cell);
    }
  }
  if (create) {
    view = views[id] = this.createViewForModel(cell);
    view.paper = this;
    const result = joint.util.result;
    flag = this.registerUnmountedView(view) | view.getFlag(result(view, "initFlag"));
  }
  this.requestViewUpdate(view, flag, view.UPDATE_PRIORITY, opt);
  return view;
};
let InitRappidService = /*#__PURE__*/(() => {
  class InitRappidService {
    get opmModel() {
      return this.modelService.model;
    }
    constructor(graphService,
    // commandManagerService: CommandManagerService,
    treeViewService, service, oplService, modelService, dialogService, userServ, http) {
      this.graphService = graphService;
      this.treeViewService = treeViewService;
      this.service = service;
      this.oplService = oplService;
      this.modelService = modelService;
      this.dialogService = dialogService;
      this.userServ = userServ;
      this.http = http;
      this.cell$ = new BehaviorSubject(null);
      this.dialog$ = new BehaviorSubject(null);
      this.graph = null;
      this.isTesting = false;
      this.isDSMClusteredView = {
        value: false,
        type: undefined
      };
      this.isDCMView = false;
      this.openTreeNodes = new Array();
      this.customColors = [];
      this.customPatterns = [];
      this.selected = new BehaviorSubject(undefined);
      this.selected$ = this.selected.asObservable();
      // a flag which toggles the draggable things autocomplete. If true, the autocomplete will be enabled.
      this.draggableAutocomplete = true;
      // a flag which toggles the visibility of the "opcloud-navigator-component". If true, the navigator will be visible.
      this.showNavigator = true;
      // a flag for the halo default status: opened or closed, default is closed
      this.defaultHalo = false;
      // a flag for showing chat module UI only if it is enabled for the org.
      // this.oplService.orgSettings.chatEnabled;
      // a flag which controls the rendering of the chat module.
      // If true the chat icon will be visible and the chat panel rendered but not visible(I.e ngOnInit will be called).
      this.showChatIcon = false;
      // a flag which toggles the visibility of the "opcloud-chat-component-float". If true, the chat panel will be visible.
      this.showChatPanel = true;
      this.chatUnreadCount = 0;
      this.ChatIsFloating = false;
      // Python execution location, currently can be local or websocket
      this.pythonExecution = "local";
      // ROS
      this.activateROS = false;
      this.activateMQTT = false;
      this.activatePython = false;
      // MySql_START
      this.activateMySQL = false;
      this.ExecuteMode = false;
      this.Executing = false;
      this.ExecutingPause = false;
      this.htmlDocument = null;
      this.isDoubleTouch = false;
      this.isBlankDoubleTouch = false;
      this.longTouchTimer = false;
      this.isRendering = false;
      this.isLoadingModel = false;
      this.elementTextChange = new BehaviorSubject([]);
      this.elementTextChange$ = this.elementTextChange.asObservable();
      this.criticalChanges_ = new ReplaySubject(1);
      this.criticalChanges$ = this.criticalChanges_.asObservable();
      this.defaultModelName = "Model (Not Saved)";
      this.modelName = new BehaviorSubject({
        text: this.defaultModelName
      });
      this.modelName$ = this.modelName.asObservable();
      // this.oplService.options = this;
      this.graph = graphService.getGraph();
      this.oplService.options = this;
      this.oplService.graph = this.graph;
      // this.commandManager = commandManagerService.commandManager;
      joint.setTheme("modern");
      this.initializeDesktop();
      this.htmlDocument = this.paper.$document[0];
      this.initializeEvents(this.graph);
      treeViewService.initRappid = this;
      defineKeyboardShortcuts(this);
      this.currentHoveredElement = null;
      (0, setInitRappidShared)(this);
      this.isTouchLinkCreating = {
        isTouch: false,
        sourceEntity: undefined
      };
      this.opmModel.undoRedo.setLastState(this.opmModel.json.toJson());
      this.penDrawingManager = new PenManager();
      this.idOfModelClickedFrom = null;
      this._automaticResizing = true;
      this.includeSubModelsInExecution = true;
      this.mouseLocation = {
        x: 0,
        y: 0
      };
      this.showGrid = false;
      this.showDraggableThings = true;
      this.userService = userServ;
    }
    /** Model attribute: per-thing override for auto-resize; omit to use OPCloud Settings default (`thingsSizing`). */
    static #_ = (() => this.thingAutoResizeOverrideAttr = "thingAutoResizeOverride")();
    set automaticResizing(value) {
      this._automaticResizing = value;
    }
    /** Global default from OPCloud Settings (not per-thing). */
    get defaultThingsAutomaticResize() {
      const s = this.oplService.settings.thingsSizing;
      if (s === "Manual" || typeof s === "string" && s.toLowerCase() === "manual") {
        return false;
      }
      if (s === "Automatic" || typeof s === "string" && s.toLowerCase() === "automatic") {
        return true;
      }
      return true;
    }
    /** Read per-cell override; supports boolean or serialized forms from JSON. */
    getThingAutoResizeOverride(cell) {
      if (!cell) {
        return undefined;
      }
      const key = InitRappidService.thingAutoResizeOverrideAttr;
      let raw;
      if (typeof cell.get === "function") {
        raw = cell.get(key);
      }
      if (raw === undefined && cell.attributes) {
        raw = cell.attributes[key];
      }
      if (raw === true || raw === "true" || raw === 1) {
        return true;
      }
      if (raw === false || raw === "false" || raw === 0) {
        return false;
      }
      return undefined;
    }
    /** True when this cell must use automatic resizing regardless of settings or per-thing override. */
    isAutomaticResizingForcedForCell(cell) {
      if (!cell) {
        return false;
      }
      if (OPCloudUtils.isInstanceOfDrawnState(cell)) {
        return true;
      }
      if (OPCloudUtils.isInstanceOfDrawnObject(cell) && (cell.getVisual()?.isSemiFolded() || cell.getVisual()?.states.length)) {
        return true;
      }
      if (OPCloudUtils.isInstanceOfDrawnProcess(cell) && cell.getVisual()?.isSemiFolded()) {
        return true;
      }
      return false;
    }
    /** Effective auto-resize for a drawn thing (global default, optional per-cell override, forced cases). */
    getAutomaticResizingForCell(cell) {
      if (!cell) {
        return this.defaultThingsAutomaticResize;
      }
      if (this.isAutomaticResizingForcedForCell(cell)) {
        return true;
      }
      const override = this.getThingAutoResizeOverride(cell);
      if (override === true || override === false) {
        return override;
      }
      return this.defaultThingsAutomaticResize;
    }
    /** Toolbar: effective mode for the primary selected thing (object/process). */
    automaticResizingForSelectedThing() {
      const cell = this.selection?.collection?.models?.[0];
      return this.getAutomaticResizingForCell(cell);
    }
    get shouldGreyOut() {
      return this.oplService.settings.markThings;
    }
    get selectedElement() {
      return this.selected.getValue();
    }
    get logSharingPermission() {
      return this.oplService.settings.logSharingPermission;
    }
    get notes() {
      if (this.oplService.settings.Notes === undefined) {
        return true;
      }
      return this.oplService.settings.Notes;
    }
    get Navigator() {
      return this.oplService.settings.navigatorEnabled;
    }
    get chat() {
      return this.oplService.settings.chatEnabled;
    }
    showLoadingSpinner() {
      var _this = this;
      return (0, default)(function* () {
        _this.isLoadingModel = true;
        return new Promise((res, rej) => {
          setTimeout(() => {
            res();
          }, 300);
        });
      })();
    }
    setModelName(name) {
      this.modelService.setName(name ? name : this.defaultModelName);
    }
    getModelName() {
      return this.modelName$;
    }
    getTreeView() {
      return this.treeViewService;
    }
    hasUnsavedModels() {
      return this.opmModel.hasUnsavedWork || this.service.model?.context?.hasUnsavedModels();
    }
    getOpmModel() {
      return this.opmModel;
    }
    getGraphService() {
      return this.graphService;
    }
    getPaperScroller() {
      return this.paperScroller;
    }
    resetGeneratedSelectedConfigurations() {
      this.generatedSelectedConfigurations = undefined;
    }
    initializeDesktop() {
      this.paper = new joint.dia.Paper({
        // linkConnectionPoint: joint.util.shapePerimeterConnectionPoint,
        defaultConnectionPoint: {
          name: "boundary"
          // args: {
          //   selector: '.joint-port .mainEllipse' // in case of process with background image it points the links to the right ellipse instead of the middle of the shape.
          // }
        },
        defaultAnchor: {
          name: "center"
        },
        width: 1000,
        height: 1000,
        gridSize: 1,
        drawGrid: {
          name: "mesh",
          color: "transparent",
          thickness: 1,
          scaleFactor: 35
        },
        // columnWidth: 100,
        // rowHeight: 100,
        // background: {
        //   color: '#fff'
        // },
        model: this.graph,
        defaultLink: new BlankLink(),
        multiLinks: true,
        interactive: {
          labelMove: true
        }
      });
      this.paperScroller = new joint.ui.PaperScroller({
        paper: this.paper,
        autoResizePaper: true,
        cursor: "grab"
      });
      this.paperScroller.render().center();
      // this.navigator = new joint.ui.Navigator({
      //   width: 240,
      //   height: 115,
      //   paperScroller: this.paperScroller,
      //   zoom: false
      // });
      // // To fix CSS undefined
      // this.navigator.$el.appendTo('#navigator');
      // this.navigator.render();
      this.clipboard = new joint.ui.Clipboard();
      this.selection = new joint.ui.Selection({
        paper: this.paper
      });
      this.selection.removeHandle("rotate");
      this.selection.removeHandle("resize");
      this.selection.removeHandle("remove");
      const tooltip = new joint.ui.Tooltip({
        rootTarget: document.body,
        target: "[data-tooltip]"
      });
      // reset the loading folders paths after new login / refresh.
      localStorage.removeItem("lastPathEntered");
      localStorage.removeItem("dirsPath");
    }
    // making the duplicationMark semi-transparent when the object is hovered
    duplicationMarkMouseOver(element) {
      const curr = element.get("duplicationMark");
      if (curr) {
        curr.node.style.opacity = 0.7;
      }
    }
    // canceling the duplicationMark semi-transparency when the object is hovered out
    duplicationMarkMouseOut(element) {
      const curr = element.get("duplicationMark");
      if (curr) {
        curr.node.style.opacity = 1;
      }
    }
    initializeEvents(graph) {
      const this_ = this;
      document.addEventListener("pointerdown", function (evt) {
        this_.pointerType = evt.pointerType;
      });
      document.addEventListener("pointermove", function (evt) {
        this_.pointerType = evt.pointerType;
      });
      document.addEventListener("pointerup", function (evt) {
        this_.pointerType = evt.pointerType;
      });
      window.addEventListener("mousemove", function (event) {
        this_.mouseLocation.x = event.clientX;
        this_.mouseLocation.y = event.clientY;
      });
      // $('*').bind('touchstart', false);
      // this.paper.on('blank:contextmenu', function(event, x, y){
      //  this_.opmModel.modelMetaData.show();
      // });
      this.paper.on("element:contextmenu", function (cellView) {
        if (cellView.el.style.textDecoration === "underline") {
          cellView.model.openMenu(cellView);
        }
        if (cellView.model.constructor.name.includes("Triangle")) {
          if (cellView.model?.rightClickHandle) {
            cellView.model.rightClickHandle(cellView, this_);
          }
        }
      });
      // this.paper.on('blank:touchstart', function (cellView, e) {
      //   console.log(e);
      //   e.preventDefault();
      //   return;
      // }, { passive: false});
      // this.paper.on('blank:touchmove', function (cellView, e) {
      //   console.log(e);
      //   e.preventDefault();
      //   return;
      // }, { passive: false});
      this.paper.on("missingLineClick", function (cellView, event) {
        event.preventDefault(); // prevents the label from being able to move
        event.stopPropagation(); // prevents the label from being able to move
      });
      this.paper.on("link:contextmenu", function (linkView, event) {
        let targetSelector;
        if (event.originalEvent.target.tagName === "tspan") {
          targetSelector = event.originalEvent.target.parentElement.getAttribute("joint-selector");
        } else {
          targetSelector = event.originalEvent.target.getAttribute("joint-selector");
        }
        if (targetSelector?.includes("missingLine") && linkView.model.constructor.name.includes("Unidirectional")) {
          linkView.model.bringMissingUnidirectionalLinks(this_);
        } else if (linkView.model?.rightClickHandle) {
          linkView.model.rightClickHandle(linkView, event, this_);
        }
      });
      // Noa: adding a note by double clicking on screen
      this.paper.on("blank:pointerdblclick", function (event, x, y) {
        if (this_.notes && !this_.selectedElement && !this_.isReadOnlyOpd()) {
          this_.getOpmModel().logForUndo("note added");
          const note = new Note();
          note.set("position", {
            x: x,
            y: y
          });
          this_.graph.addCell(note);
        }
      }, this);
      this.paper.on("label:pointerclick", function (linkView, $event) {
        if ($event.detail === 2 && linkView.model.rightClickHandle) {
          $event.stopPropagation();
          $event.preventDefault();
          linkView.model.rightClickHandle(linkView, $event, this_);
          for (const inputField of $(".PopupInput")) {
            const inputValue = inputField.value;
            if ($event.currentTarget.textContent === inputValue || $event.currentTarget.textContent.includes("0.") && inputValue.includes("0.")) {
              inputField.focus();
              inputField.select();
              return;
            }
          }
        }
      }, this);
      this.paper.on("cell:pointerdblclick", function (cellView, evt) {
        if (cellView?.model?.doubleClickHandle) {
          cellView.model.doubleClickHandle(cellView, evt, this_);
        }
      }, this);
      this.paper.on("link:pointerdown", function (linkView, evt) {
        // if (this_.penDrawingManager.isInPenMode && this_.pointerType === 'pen') {
        //   blankPointerDown(evt, this_.paper.clientToLocalPoint(evt.clientX,0).x, this_.paper.clientToLocalPoint(0, evt.clientY).y);
        //   return linkView.model.remove();
        // }
        joint.ui.Popup.close();
        if (this_.keyboard.isActive("shift", evt)) {
          this_.selection.startSelecting(evt);
          this_.idOfModelClickedFrom = linkView.sourceView.model.id;
          linkView.model.remove();
        }
        if (evt.type === "touchstart") {
          this_.longTouchTimer = evt.timeStamp;
          evt.stopPropagation();
          linkView.model.setLinkTools(linkView, true);
          linkView.showTools();
        }
      }, this);
      this.paper.on("link:pointermove", function (linkView, evt) {
        // if (this_.penDrawingManager.isInPenMode && this_.pointerType === 'pen') {
        //   // pointerMove(evt, this_.paper.clientToLocalPoint(evt.clientX,0).x, this_.paper.clientToLocalPoint(0, evt.clientY).y);
        //   return linkView.model.remove();
        // }
        if (evt.type === "touchmove") {
          this_.longTouchTimer = evt.timeStamp;
        }
      }, this);
      // this.paper.el.addEventListener('pointermove', function (evt) {
      //   if (this_.penDrawingManager.isInPenMode && this_.pointerType === 'pen') {
      //     pointerMove(evt, this_.paper.pageToLocalPoint(evt.clientX,0).x, this_.paper.pageToLocalPoint(0, evt.clientY).y);
      //     // return linkView.model.remove();
      //   }
      // });
      // When thing or link is pressed we want to make all the arcs on it transparent
      this.paper.on("cell:pointerdown", function (cellView, event) {
        // if (this_.penDrawingManager.isInPenMode && this_.pointerType === 'pen') {
        //   cellView.setInteractivity(false);
        //   if (!this.graph.getCells().find(c => c.constructor.name.includes('Blank')))
        //     blankPointerDown(event, this_.paper.clientToLocalPoint(event.clientX,0).x, this_.paper.clientToLocalPoint(0, event.clientY).y);
        //   return;
        // }
        // if (cellView.model instanceof OpmSemifoldedFundamental === false)
        //   cellView.setInteractivity(true);
        if (event.type === "touchstart") {
          this_.longTouchTimer = event.timeStamp;
        }
        if (cellView.model instanceof BlankLink && event.type === "touchstart") {
          cellView.model.remove();
          return;
        } else if (cellView.model instanceof OpmEntity && event.type === "touchstart" && !this_.isTouchLinkCreating.isTouch) {
          this_.isTouchLinkCreating = {
            isTouch: true,
            sourceEntity: cellView.model
          };
          setTimeout(function () {
            this_.isTouchLinkCreating = {
              isTouch: false,
              sourceEntity: undefined
            };
          }, 1000);
        } else if (cellView.model instanceof OpmEntity && event.type === "touchstart" && this_.isTouchLinkCreating.isTouch && !this_.isDoubleTouch) {
          const newLink = new OpmDefaultLink();
          newLink.source({
            id: this_.isTouchLinkCreating.sourceEntity
          });
          newLink.target({
            id: cellView.model
          });
          newLink.graph = cellView.model.graph;
          this_.selection.collection.reset([]);
          (0, createDialog)(this_, newLink);
          this_.isTouchLinkCreating = {
            isTouch: false,
            sourceEntity: undefined
          };
          this_.clearBrowserSelection();
        }
        selectionConfiguration.cellPointerdown(this, cellView, event);
        if (this_.textEditor) {
          this_.textEditor.cellView.model.closeTextEditor(this_);
        }
        this_.setSelectedElement(cellView.model);
        cellView.model.pointerDownHandle(cellView.model, this_);
      }, this);
      this.paper.on("cell:pointerup", function (cellView, event) {
        $("#draggableThingsSearchInput")[0]?.blur(); // fixes the issue that if you write in the draggable things search input, the keyboard shortcuts not responding (delete selected element)
        if (this_.idOfModelClickedFrom) {
          const elementToRemove = this_.selection.collection.models.find(model => model.id === this_.idOfModelClickedFrom);
          if (elementToRemove) {
            this_.selection.collection.remove(elementToRemove);
          }
          this_.idOfModelClickedFrom = null;
        }
        if (this_.penDrawingManager.isPenMode) {
          return blankPointerUp(event, this_.paper.clientToLocalPoint(event.clientX, 0).x, this_.paper.clientToLocalPoint(0, event.clientY).y);
        }
        let justChanged = false;
        // this.isTouchLinkCreating = { isTouch: false, sourceEntity: undefined};
        if (event.type === "touchend") {
          if (event.timeStamp - this_.longTouchTimer > defaultLongPressTime && !this_.isDoubleTouch && cellView.model.longTouchHandle) {
            $(".joint-popup").remove();
            // temporarily until it is supported
            $(".target-arrowhead, .source-arrowhead, .joint-marker-vertex").remove();
            cellView.model.longTouchHandle(cellView, this_, event);
            this_.clearBrowserSelection();
          }
          this_.longTouchTimer = null;
        }
        if (event.type === "touchend" && !this_.isDoubleTouch) {
          this_.isDoubleTouch = true;
          justChanged = true;
          setTimeout(function () {
            this_.isDoubleTouch = false;
          }, 200);
        }
        if (event.type === "touchend" && this_.isDoubleTouch && !justChanged) {
          if (cellView.model.doubleClickHandle) {
            cellView.model.doubleClickHandle(cellView, event, this_);
          }
          $(".joint-popup").remove();
          return;
        }
        if (event.type === "touchend" && cellView.model.isLink()) {
          return;
        }
        if (this_.graph.getCell(cellView?.model)) {
          cellView.model.pointerUpHandle(cellView, this_, event);
          if (cellView.model instanceof OpmEntity) {
            cellView.model.setHaloPosition(cellView.model);
          }
        } else if (event.shiftKey && cellView.model instanceof BlankLink) {
          const cellsUnder = this.paper.findViewsFromPoint(this.paper.clientToLocalPoint({
            x: event.clientX,
            y: event.clientY
          }));
          const cView = cellsUnder[cellsUnder.length - 1];
          if (cView?.model) {
            cView.model.pointerUpHandle(cView, this);
            this.setSelectedElement(cView.model);
          }
        }
      }, this);
      this.paper.on("element:pointerup link:options", function (cellView, event) {
        if (!this.selection.collection.contains(cellView.model)) {
          if (this_.isReadOnlyOpd()) {
            this_.cell$.next(undefined);
          } else {
            this_.cell$.next(cellView.model);
          }
        }
      }, this);
      this.paper.on("cell:mouseover", function (cellView) {
        if (this_.graphService.fromStencil) {
          this_.graphService.fromStencil = false;
        }
        if (cellView.model.mouseOverHandle) {
          cellView.model.mouseOverHandle(cellView);
        }
      }, this);
      this.paper.on("cell:mouseleave", function (cellView) {
        if (cellView.model.mouseLeaveHandle) {
          cellView.model.mouseLeaveHandle();
        }
      }, this);
      this.paper.on("cell:mousedrop", function (cellView) {
        if (cellView.model.mouseLeaveHandle) {
          cellView.model.mouseLeaveHandle();
        }
      }, this);
      this.paper.on("link:mouseenter", function (linkView) {
        if (this_.isReadOnlyOpd()) {
          return;
        }
        if (!this_.Executing || this_.Executing && this_.ExecutingPause) {
          linkView.model.setLinkTools(linkView);
          linkView.showTools();
        }
      });
      this.paper.on("link:mouseleave", function (linkView) {
        linkView.hideTools();
      });
      this.paper.on("link:disconnect", function (linkView, event, elementViewDisconnected) {
        if (linkView.model.changed.source || linkView.model.source()?.hasOwnProperty("x")) {
          linkView.model.set("previousSourceId", elementViewDisconnected.model.id);
        }
        if (linkView.model.changed.target || linkView.model.target()?.hasOwnProperty("x")) {
          linkView.model.set("previousTargetId", elementViewDisconnected.model.id);
        }
      });
      const blankPointerDown = function (evt, x, y) {
        $("[joint-selector=button]").remove();
        $("[joint-selector=icon]").remove();
        $("[data-tool-name=source-arrowhead]").remove();
        $("[data-tool-name=target-arrowhead]").remove();
        $(".joint-context-toolbar").remove();
        $(".joint-marker-vertex").remove();
        $(".joint-marker-segment").remove();
        $(".joint-popup").remove();
        if (!this_.penDrawingManager.isPenMode) {
          selectionConfiguration.blankPointerdown(this_, evt, x, y);
        } else {
          this_.graph.startBatch("ignoreEvents");
          const newPath = vectorizer.V("path", {
            stroke: "blue",
            "stroke-width": "2",
            fill: "transparent",
            d: "M" + x + "," + y
          });
          this_.penDrawingManager.addDrawingSvg(newPath);
          newPath.appendTo(this_.paper.svg);
        }
        if (this_.textEditor) {
          this_.textEditor.cellView.model.closeTextEditor(this_);
        }
        this_.setSelectedElementToNull(evt.shiftKey);
      };
      this.paper.on("blank:pointerdown", (evt, x, y) => {
        blankPointerDown(evt, x, y);
      }, this);
      const pointerMove = (evt, x, y) => {
        // if (this_.penDrawingManager.isPenMode && this_.penDrawingManager.penDrawingSvg.length > 0 && this_.pointerType === 'pen' && evt.pressure > 0) {
        //   const currentPath = this_.penDrawingManager.penDrawingSvg[this_.penDrawingManager.penDrawingSvg.length - 1].attr('d');
        //   this_.penDrawingManager.penDrawingSvg[this_.penDrawingManager.penDrawingSvg.length - 1].attr('d', currentPath + ' L' + x + ',' + y );
        //   this_.penDrawingManager.lastMovementTime = Date.now();
        // }
      };
      // this.paper.on('blank:pointermove', (evt, x, y) => {
      //   pointerMove(evt, x, y);
      // });
      const blankPointerUp = function (evt, x, y) {
        // if (this_.penDrawingManager.isPenMode && this_.penDrawingManager.penDrawingSvg && this_.pointerType === 'pen') {
        //   // if no new painting in 1.5 seconds => take the drawing and analyze it and remove it.
        //   setTimeout( function() {
        //     if (Date.now() - this_.penDrawingManager.lastMovementTime >= 1000) {
        //       for (let i = this_.penDrawingManager.penDrawingSvg.length - 1 ; i >=0 ; i--) {
        //         const path = this_.penDrawingManager.penDrawingSvg[i];
        //         const elementPosition = path.getBBox();
        //         if (elementPosition.width <= 65 && elementPosition.height <= 60) {
        //           path.remove();
        //           continue;
        //         }
        //         const shape = this_.convertSvgToActualShape(path);
        //         if (shape === 'link') {
        //           this_.createLinkDialogFromPenDrawing(path)
        //         }
        //         else this_.createNewEntityFromShape(shape, elementPosition);
        //         this_.graph.stopBatch('ignoreEvents');
        //         path.remove();
        //       }
        //       this_.penDrawingManager.resetPenDrawing();
        //     }
        //   }, 1000 );
        // }
      };
      this.paper.on("blank:pointerup", function (evt, x, y) {
        blankPointerUp(evt, x, y);
      });
      /**
       * Alon: Removes the boxContent from selection.
       */
      this.paper.on("blank:pointerup", function (evt, x, y) {
        if (evt.type === "touchend" && !this_.isBlankDoubleTouch) {
          this_.isBlankDoubleTouch = true;
          setTimeout(() => {
            this_.isBlankDoubleTouch = false;
          }, 150);
          return;
        } else if (this_.isBlankDoubleTouch === true && this_.notes && !this_.selectedElement && !this_.isReadOnlyOpd()) {
          const note = new Note();
          note.set("position", {
            x: x,
            y: y
          });
          this_.graph.addCell(note);
          this_.isBlankDoubleTouch = false;
        }
        if (this_.selection && this_.selection.collection.models.length > 1) {
          if (document.getElementsByClassName("box")[0]) {
            document.getElementsByClassName("box")[0].remove();
          }
        }
      }, this);
      this.paper.on("element:pointerup", function (evt, x, y) {}, this);
      // Yang: highlighting opl when hovering on OPD
      this.paper.on("cell:mouseover", function (cellView, evt) {
        try {
          cellView.model.attributes.hovered = true;
          this.duplicationMarkMouseOver(cellView.model);
        } catch (e) {}
      }, this);
      this.paper.on("cell:mouseout", function (cellView, evt) {
        try {
          cellView.model.attributes.hovered = false;
          this.duplicationMarkMouseOut(cellView.model);
        } catch (e) {}
      }, this);
      this.selection.on("selection-box:pointerdown", function (cellView, evt) {
        selectionConfiguration.selectionBoxPointerdown(this, cellView, evt);
      }, this);
      this.selection.collection.on("add", function () {
        this.selection.collection.models.forEach(elm => {
          if (elm instanceof OpmLinkRappid || this_.isReadOnlyOpd()) {
            this.selection.collection.remove(elm);
          }
        });
      }, this);
      this.selection.on("selection-box:pointerup", function (cellView, evt) {
        selectionConfiguration.selectionBoxPointerup(this, cellView, evt);
      }, this);
      graph.on("change:attrs", function (cell) {
        if (!this.graph.hasActiveBatch("ignoreEvents")) {
          cell.changeAttributesHandle(this_);
        }
      }, this);
      graph.on("change:size", _.bind(function (cell, value, opt) {
        if (!this.graph.hasActiveBatch("ignoreEvents") && !this.graph.hasActiveBatch("semifolding")) {
          cell.changeSizeHandle(this_, opt.trueDirection);
          // NEW: re-wrap labels on connected links
          this.updateConnectedLinkLabels(cell);
        }
      }, this));
      graph.on("batch:start", opt => {
        if (opt.batchName !== "free-transform") {
          return;
        }
        if (this.selection.collection.models[0]?.sizeChangeStartHandle) {
          this.selection.collection.models[0].sizeChangeStartHandle();
        }
      });
      graph.on("batch:stop", opt => {
        if (opt.batchName !== "free-transform") {
          return;
        }
        if (this.selection.collection.models[0]?.sizeChangeStartHandle) {
          this.selection.collection.models[0].sizeChangeStopHandle();
        }
      });
      graph.on("change:position", _.bind(function (cell, value, opt) {
        if (!this.graph.hasActiveBatch("ignoreEvents")) {
          cell.changePositionHandle(this_, opt.trueDirection);
          // NEW: re-wrap labels on connected links
          this.updateConnectedLinkLabels(cell);
        }
      }, this));
      // When a link is bent (vertices changed), re-wrap its own labels
      graph.on("change:vertices", link => {
        const anyLink = link;
        if (typeof anyLink.updateLabelWrapsFromCurrent === "function") {
          anyLink.updateLabelWrapsFromCurrent();
        }
      });
      graph.on("remove", cell => {
        if (!this_.graph.hasActiveBatch("ignoreRemoveEvent")) {
          cell = cell.model || cell;
          removeHandle(this_, cell);
          cell.removeHandle(this_);
          this_.setSelectedElementToNull();
        }
      });
      graph.on("add", (cell, collection, opt) => {
        if (!this_.graph.hasActiveBatch("ignoreAddEvent")) {
          addHandle(this_, cell, opt);
          cell.addHandle(this_);
          this_.tryToEmbed(cell);
          this.setSelectedElement(cell);
        }
      });
      graph.on("change", function (cell) {
        if (!this.graph.hasActiveBatch("ignoreChange") && !this.graph.hasActiveBatch("rendering")) {
          changeHandle(this_, cell);
        }
      }, this);
      graph.on("change:embeds", function (cell) {
        if (this_.graph.hasActiveBatch("undoRemoveCellOperation")) {
          const visualFather = this_.opmModel.getVisualElementById(cell.id);
          const embeds = cell.get("embeds");
          if (embeds.length > 0 && visualFather) {
            const lastChild = this_.opmModel.getVisualElementById(embeds[embeds.length - 1]);
            visualFather.children.push(lastChild);
            lastChild.fatherObject = visualFather;
            const logicalFather = visualFather.logicalElement;
            const logicalLastChild = lastChild.logicalElement;
            logicalLastChild.parent = logicalFather;
            logicalFather.states.push(logicalLastChild);
            cell.arrangeEmbedded(this_, cell.statesArrangement);
          }
        }
      }, this);
      /**
       * When <Enetr> is pressed stops the text editor - bind to the document element
       * @param evt
       * @returns {boolean}
       * See remarks @ changeTextOfAttribute() -> @ file = OpmEntity.ts, line 305
       */
      this.htmlDocument.onkeydown = function (evt) {
        if (evt.keyCode === 13 && this_.textEditor) {
          if (evt.ctrlKey === true) {
            const cell = this_.textEditor.cellView.model;
            let text = cell.attr("text/textWrap/text");
            const shiftEnterIndex = this_.textEditor.textarea.selectionStart;
            text = text.substr(0, shiftEnterIndex) + "\n" + text.substr(shiftEnterIndex, text.length);
            this_.textEditor.textarea.value = text;
            this_.textEditor.textarea.selectionStart = shiftEnterIndex + 1;
            this_.textEditor.textarea.selectionEnd = shiftEnterIndex + 1;
            cell.graph.startBatch("ignoreEvents");
            cell.attr("text/textWrap/text", text);
            cell.graph.stopBatch("ignoreEvents");
          } else {
            const cell = this_.textEditor.cellView.model;
            const init = this_;
            if (cell instanceof OpmState) {
              // TODO: move to OpmState
              const statesOnly = cell.getParent().getEmbeddedCells().filter(child => child instanceof OpmState);
              const index = statesOnly.indexOf(cell);
              if (index === statesOnly.length - 1) {
                this_.textEditor.cellView.model.closeTextEditor(this_);
                return;
              } else if (statesOnly[index + 1].attr("text/textWrap/text").includes("state")) {
                const cellView = init.paper.findViewByModel(statesOnly[index + 1]);
                cell.getParent().openTextEditor(cellView, this_);
                return;
              }
            }
            this_.textEditor.cellView.model.closeTextEditor(this_);
          }
        }
        if (evt.keyCode === 32 && this_.textEditor) {
          // space pressed
          this_.pressedSpace = true;
        } else {
          this_.pressedSpace = false;
        }
        if (evt.keyCode === 13) {
          if (document.querySelector(".enterHandle")) {
            document.querySelector(".enterHandle").remove();
          }
          return;
        }
      };
    }
    /** Re-wrap labels on all links connected to the given cell (usually an element) */
    updateConnectedLinkLabels(cell) {
      if (!this.graph) {
        return;
      }
      // Only elements have connected links we care about here
      if (cell.isElement && cell.isElement()) {
        const links = this.graph.getConnectedLinks(cell);
        links.forEach(link => {
          const anyLink = link;
          if (typeof anyLink.updateLabelWrapsFromCurrent === "function") {
            anyLink.updateLabelWrapsFromCurrent();
          }
        });
      }
    }
    convertSvgToActualShape(penDrawingSvg) {
      const pointsArray = [];
      const drawingLength = penDrawingSvg.node.getTotalLength();
      for (let i = 0; i <= 1000; i++) {
        pointsArray.push(penDrawingSvg.node.getPointAtLength(drawingLength * (i / 1000)));
      }
      if ((0, distanceBetweenPoints)(pointsArray[0], pointsArray[1000]) > 30) {
        return "link";
      }
      const g = geometry.g;
      const bbox = penDrawingSvg.node.getBBox();
      const padding = 20;
      const largerBbox = {
        x: bbox.x - padding,
        y: bbox.y - padding,
        width: bbox.width + padding,
        height: bbox.height + padding
      };
      let insidePoints = 0;
      const ellipse = new g.Ellipse.fromRect(largerBbox);
      for (const point of pointsArray) {
        if (ellipse.containsPoint(point)) {
          insidePoints += 1;
        }
      }
      if (insidePoints > 660) {
        return "ellipse";
      } else {
        return "rect";
      }
    }
    createNewEntityFromShape(shape, bbox) {
      const type = shape === "rect" ? EntityType.Object : EntityType.Process;
      const ret = this.opmModel.createToScreen(type);
      const visual = ret.visual;
      const drawn = factory(visual.type);
      drawn.attr({
        text: {
          textWrap: {
            text: visual.logicalElement.text
          }
        }
      });
      drawn.lastEnteredText = drawn.attr("text/textWrap/text");
      drawn.set({
        position: {
          x: bbox.x,
          y: bbox.y
        },
        size: {
          width: bbox.width,
          height: bbox.height
        }
      });
      visual.updateParams(drawn.getParams());
      visual.logicalElement.updateParams(drawn.getParams());
      drawn.createPorts();
      const modelsInPoint = this.graph.findModelsFromPoint({
        x: bbox.x,
        y: bbox.y
      });
      this.graphService.graph.addCell(drawn);
      if (modelsInPoint.length > 0 && modelsInPoint.find(cell => OPCloudUtils.isInstanceOfDrawnThing(cell))) {
        const parent = modelsInPoint.find(cell => OPCloudUtils.isInstanceOfDrawnThing(cell));
        drawn.set("z", parent.get("z") + 1);
        if (parent.getVisual().getRefineeInzoom() === parent.getVisual()) {
          parent.getVisual().children.push(visual);
          visual.fatherObject = parent.getVisual();
          parent.embed(drawn);
        } else if (OPCloudUtils.isInstanceOfDrawnObject(parent)) {
          // const pos = {...drawn.get('position')};
          // parent.addStateAction(parent.getVisual(), this);
          // drawn.remove();
        }
      }
    }
    createLinkDialogFromPenDrawing(path) {
      const drawingLength = path.node.getTotalLength();
      const sourceP = path.node.getPointAtLength(0);
      const targetP = path.node.getPointAtLength(drawingLength);
      const sourceRect = {
        x: sourceP.x - 5,
        y: sourceP.y - 5,
        width: 10,
        height: 10
      };
      const targetRect = {
        x: targetP.x - 5,
        y: targetP.y - 5,
        width: 10,
        height: 10
      };
      const sourceElement = this.paper.findViewsInArea(sourceRect)[0];
      const targetElement = this.paper.findViewsInArea(targetRect)[0];
      if (sourceElement && targetElement && sourceElement === targetElement && drawingLength <= 80) {
        return sourceElement.model.openTextEditor(sourceElement, this);
      }
      if (sourceElement && targetElement && OPCloudUtils.isInstanceOfDrawnEntity(sourceElement.model) && OPCloudUtils.isInstanceOfDrawnEntity(targetElement.model)) {
        const newLink = new BlankLink();
        this.selection.collection.reset([]);
        newLink.source({
          id: sourceElement.model.id
        });
        newLink.target({
          id: targetElement.model.id
        });
        newLink.graph = this.graph;
        newLink.selection = this.selection;
        (0, createDialog)(this, newLink);
      }
    }
    clearBrowserSelection() {
      if (window.getSelection && window.getSelection().empty) {
        window.getSelection().empty();
      }
    }
    tryToEmbed(cell) {
      if (!(cell instanceof OpmThing) || this.graphService.fromStencil === false) {
        return;
      }
      const candidateModels = this.graph.findModelsFromPoint(cell.getBBox().center()).filter(candidate => candidate.id !== cell.id && OPCloudUtils.isInstanceOfDrawnThing(candidate) && candidate.getVisual && candidate.getVisual() === candidate.getVisual().getRefineeInzoom()).sort((a, b) => a.get("z") > b.get("z") ? -1 : 1);
      if (candidateModels.length === 0) {
        return;
      }
      const highestModel = candidateModels[0];
      // if the cell close to several models then we need to check only the first one because we are
      // interested only in the inzoomed model which will always be the first
      if (highestModel instanceof OpmProcess) {
        // need to check inside the ellipse and not the bBox
        const rx = highestModel.get("size").width / 2;
        const ry = highestModel.get("size").height / 2;
        const ellipse = new geometry.g.ellipse(highestModel.getBBox().center(), rx, ry);
        if (!ellipse.containsPoint(cell.getBBox().center())) {
          return;
        }
      }
      const visualParent = this.opmModel.getVisualElementById(candidateModels[0].get("id"));
      if (visualParent && visualParent.getRefineeInzoom() === visualParent) {
        highestModel.embed(cell);
        const visualCell = this.opmModel.getVisualElementById(cell.get("id"));
        visualParent.children.push(visualCell);
        visualCell.fatherObject = visualParent;
        // candidateModels[0].updateSizeToFitEmbeded();
      }
    }
    getSelectedElement$() {
      return this.selected;
    }
    setSelectedElement(element) {
      this.selected.next(element);
    }
    setSelectedElementToNull(shiftKey = false) {
      this.selected.next(undefined);
      joint.ui.FreeTransform.clear(this.paper);
      if (!shiftKey) {
        this.selection?.collection?.reset([]);
      }
    }
    clearClipboard() {
      this.clipboard.clear();
      this.clipboard.copied = [];
    }
    save() {
      var _this2 = this;
      return (0, default)(function* () {
        const image = yield _this2.getModelImage();
        _this2.service.save(image);
      })();
    }
    updateDB(details) {
      this.service.updateDB(details);
    }
    // showRemoveOptions(drawn) {
    //   // should be changes to the user's choice
    //   this.onRemoveOptionChosen(drawn, RemoveType.Localy);
    // }
    onRemoveOptionChosen(drawn, operation, visual) {
      joint.ui.Popup.close();
      const model = this.getOpmModel();
      if (!drawn && !visual) {
        return;
      }
      const removeName = drawn?.attr("text/textWrap/text") || "link";
      model.logForUndo(removeName + " removal");
      const numberOfOpds = model.opds.length;
      let ret;
      let ownerOfRequirement;
      if (operation === RemoveType.AllOPDs) {
        const vis = visual || drawn.getVisual();
        if (OPCloudUtils.isInstanceOfVisualObject(vis) && vis.logicalElement.isSatisfiedRequirementObject()) {
          ownerOfRequirement = this.opmModel.getOwnerOfRequirementByRequirementLID(vis.logicalElement.lid);
        }
        if (OPCloudUtils.isInstanceOfVisualObject(vis) && vis.logicalElement.isSatisfiedRequirementObject() && vis.logicalElement.getBelongsToStereotyped()) {
          (0, validationAlert)("Requirements that came from a stereotype cannot be removed.");
          return;
        }
      }
      if (drawn && drawn instanceof OpmDefaultLink && drawn.getTargetElement() instanceof TriangleClass) {
        const fundamentals = this.graph.getConnectedLinks(drawn.getTargetElement(), {
          outbound: true
        });
        ret = model.removeFundamental(fundamentals.map(l => model.getVisualElementById(l.id)));
      } else {
        if (!visual) {
          visual = model.getVisualElementById(drawn?.id);
        }
        if (!visual) {
          return;
        }
        ret = model.removeElement(visual, operation);
      }
      if (ret.removed) {
        for (const removed of ret.elements) {
          const drwn = this.graph.getCell(removed?.id);
          if (drwn) {
            (0, removeCell)(drwn, this, removed.logicalElement.getElementParams());
          }
        }
        if (model.opds.length !== numberOfOpds) {
          this.treeViewService.init(this.getOpmModel());
        }
        if (ownerOfRequirement) {
          for (const req of ownerOfRequirement.getAllRequirements()) {
            this.graph.getCell(req.getRequirementObject()?.id)?.updateView(req.getRequirementObject());
          }
        }
      } else {
        (0, validationAlert)("Cannot Remove");
      }
    }
    showRemoveOptions(elm, removeOnlyLocaly = false) {
      if (this.graph?.hasActiveBatch("pointerDown")) {
        // bug fix: prevents removal of an Entity if pointer is still pressed (because pointer up throws error for non existing cell)
        return;
      }
      if (elm.owner) {
        this.elementToRemove = elm.owner;
      } else {
        this.elementToRemove = elm;
      }
      const model = this.getOpmModel();
      const logical = model.getLogicalElementByVisualId(this.elementToRemove.id);
      let relatedRelations;
      if (logical instanceof OpmRelation) {
        relatedRelations = model.getRelatedRelationsByLogicalLink(logical);
      }
      if (removeOnlyLocaly === false && this.graph.getCell(elm?.id) && (elm.constructor.name.includes("Default") || logical && logical.visualElements.length > 1 || relatedRelations)) {
        if (elm.constructor.name.includes("Default") && elm.getTargetElement().constructor.name.includes("Triangle") && elm.getTargetElement().getBottomLinks().every(l => l.getVisual()?.logicalElement?.visualElements.length === 1)) {
          this.onRemoveOptionChosen(this.elementToRemove, RemoveType.Localy);
        } else {
          this.dialogService.openDialog(RemoveOperationComponent, 400, 860, []);
        }
      } else if (this.graph.getCell(elm?.id)) {
        this.onRemoveOptionChosen(this.elementToRemove, RemoveType.Localy);
      }
    }
    getElementToRemove() {
      return this.elementToRemove;
    }
    setElementToRemoveToNull() {
      this.elementToRemove = null;
      this.setSelectedElementToNull();
    }
    saveWhichTreeNodesAreOpen() {
      this.openTreeNodes = [];
      for (const opd of this.opmModel.opds) {
        const node = this.treeViewService.treeView.treeModel.getNodeById(opd.id);
        if (node) {
          const isExpanded = this.treeViewService.treeView.treeModel.isExpanded(node);
          this.openTreeNodes.push({
            nodeId: node.id,
            status: isExpanded
          });
        }
      }
    }
    toggleNavigator() {
      this.showNavigator = !this.showNavigator;
      const settings = {
        navigatorEnabled: this.showNavigator
      };
      this.oplService.updateUserSettings(settings);
      this.updateDB(settings);
      this.setLeftBarWindowsSizes({});
    }
    // toggleChat turns chat from appearing in the setLeftBarWindowsSizes to not appearing
    toggleChat() {
      // this.chatUnreadCount = 0;
      // do not show chat if model is not saved.
      if (!this.modelService.modelObject.id) {
        return;
      }
      this.showChatPanel = !this.showChatPanel;
      if (this.showChatPanel) {
        this.chatUnreadCount = 0;
      }
      this.setLeftBarWindowsSizes({});
    }
    setLeftBarWindowsSizes(info) {
      const defaultValue = this.showDraggableThings ? 250 : 60;
      let isOplAtBottom;
      if (info && Object.keys(info).includes("oplAtBottom")) {
        isOplAtBottom = info.oplAtBottom;
      } else {
        isOplAtBottom = !!$("#oplFullScreen")[0] && $("#oplFullScreen")[0].getClientRects()[0].left !== 0;
      }
      const draggableThingsList = $("#listLogical")[0];
      if (!draggableThingsList) {
        return;
      }
      const isNavigatorFloating = $("#floatingNavigatorBox")[0] && $("#floatingNavigatorBox")[0].style.visibility !== "hidden";
      if ((!this.showNavigator || isNavigatorFloating) && isOplAtBottom && !this.showChatPanel) {
        const sideNav = $("#sideNavDiv")[0];
        const oldSize = $("#listLogical")[0].getClientRects()[0];
        const newDraggableThingHeight = sideNav.getClientRects()[0].height + sideNav.getClientRects()[0].top - oldSize.top;
        // $('#all_elements_holder')[0].style.height = newDraggableThingHeight - 20 + 'px';
        const defaultValue = this.showDraggableThings ? 150 : 60;
        draggableThingsList.style.height = Math.max(defaultValue, newDraggableThingHeight - 40) + "px";
      } else if (this.showNavigator && isOplAtBottom && !this.showChatPanel) {
        // $('#all_elements_holder')[0].style.height = '150px';
        draggableThingsList.style.height = defaultValue + "px";
      } else if ((isNavigatorFloating || !this.showNavigator) && !isOplAtBottom && !this.showChatPanel) {
        // $('#all_elements_holder')[0].style.height = '150px';
        draggableThingsList.style.height = defaultValue + "px";
      } else if ((!this.showNavigator || isNavigatorFloating) && !isOplAtBottom && this.showChatPanel) {
        const sideNav = $("#sideNavDiv")[0];
        const oldSize = $("#listLogical")[0].getClientRects()[0];
        const newDraggableThingHeight = sideNav.getClientRects()[0].height + sideNav.getClientRects()[0].top - oldSize.top;
      }
    }
    recoverOpenTreeNodes() {
      for (const item of this.openTreeNodes) {
        const node = this.treeViewService.treeView.treeModel.getNodeById(item.nodeId);
        if (node) {
          this.treeViewService.treeView.treeModel.setExpandedNode(node, item.status);
          node.data.expanded = !!item.status;
        }
      }
      setTimeout(() => {
        (0, highlighSD)(this.getOpmModel().currentOpd.id, this);
      }, 1000);
    }
    getLinksByOpl(source, target) {
      return oplFunctions.generateLinksWithOplByElements(source, target);
    }
    openCodeEditor(functionText, visual) {
      return this.dialogService.openDialog(CodeEditorDialog, window.innerHeight * 0.65, window.innerWidth * 0.65, {
        doNotClose: "true",
        code: functionText,
        visual: visual,
        initRappid: this
      });
    }
    openPythonCodeEditor(functionText, visual) {
      return this.dialogService.openDialog(PythonCodeEditorDialog, window.innerHeight * 0.65, window.innerWidth * 0.65, {
        doNotClose: "true",
        code: functionText.code ? functionText.code : functionText,
        executionLocation: functionText.executionLocation ? functionText.executionLocation : this.pythonExecution,
        visual: visual,
        initRappid: this
      });
    }
    openGenAIEditor(functionText, visual) {
      return this.dialogService.openDialog(GenAIComputationalEditorDialog, window.innerHeight * 0.65, window.innerWidth * 0.65, {
        doNotClose: "true",
        code: functionText.code ? functionText.code : functionText,
        visual: visual,
        initRappid: this
      });
    }
    getModelImage() {
      const that = this;
      return new Promise(function (resolve, reject) {
        try {
          that.paper.toSVG(url => resolve(url), {
            useComputedStyles: false,
            width: 500,
            height: 350,
            quality: 0.95,
            padding: 10
          });
        } catch (err) {
          resolve(undefined);
        }
      });
    }
    isReadOnlyOpd() {
      const currentOpd = this.opmModel.currentOpd;
      return currentOpd.isStereotypeOpd() || this.isDSMClusteredView.value === true || currentOpd.belongsToSubModel || currentOpd.sharedOpdWithSubModelId;
    }
    toggleGrid(updateDB = true) {
      this.showGrid = !this.showGrid;
      const settings = {
        gridSettings: {
          state: this.showGrid,
          color: this.oplService.settings.gridSettings.color,
          thickness: this.oplService.settings.gridSettings.thickness,
          scaleFactor: this.oplService.settings.gridSettings.scaleFactor,
          gridSize: this.oplService.settings.gridSettings.gridSize,
          transparentThingsFill: this.oplService.settings.gridSettings.transparentThingsFill ?? "inZoomedOpd"
        }
      };
      this.oplService.settings.gridSettings.state = this.showGrid;
      if (updateDB) {
        this.service.updateDB(settings);
      }
      if (this.showGrid) {
        const gridSize = this.oplService.settings.gridSettings.gridSize;
        const thickness = this.oplService.settings.gridSettings.thickness;
        const color = this.oplService.settings.gridSettings.color;
        const scaleFactor = this.oplService.settings.gridSettings.scaleFactor;
        this.paper.setGridSize(gridSize);
        this.paper.drawGrid({
          name: "mesh",
          color: color,
          thickness: thickness,
          scaleFactor: scaleFactor
        });
      } else {
        this.paper.setGridSize(1);
        this.paper.clearGrid();
      }
      this.graphService.makeTransparentForGrid(this);
    }
    openSearchItemDialog(logical) {
      this.dialogService.openDialog(SearchItemsDialogComponent, 530, 600, {
        element: logical
      });
    }
    openExistingNameDialog(logical, logicalToRename) {
      const data = {
        logical,
        logicalToRename
      };
      return this.dialogService.openDialog(ExistingNameDialogComponent, 530, 600, data).afterClosed().toPromise();
    }
    static #_2 = (() => this.ɵfac = function InitRappidService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || InitRappidService)(core /* ɵɵinject */.KVO(GraphService), core /* ɵɵinject */.KVO(TreeViewService), core /* ɵɵinject */.KVO(AbstractVersionService), core /* ɵɵinject */.KVO(OplService), core /* ɵɵinject */.KVO(ModelService), core /* ɵɵinject */.KVO(DialogService), core /* ɵɵinject */.KVO(UserService), core /* ɵɵinject */.KVO(HttpClient));
    })();
    static #_3 = (() => this.ɵprov = /*@__PURE__*/core /* ɵɵdefineInjectable */.jDH({
      token: InitRappidService,
      factory: InitRappidService.ɵfac
    }))();
  }
  return InitRappidService;
})();