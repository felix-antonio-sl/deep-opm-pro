// Source: decompiled/deobfuscated.js
// Original path: ./src/app/rappid-components/rappid-opl/rappid-opl.component.ts
// Extracted by opm-extracted/tools/extract.mjs

const rappid_opl_component_c0 = a0 => ({
  oplHighlight: a0
});
function RappidOplComponent_ng_container_2_span_1_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span");
    core /* ɵɵtext */.EFF(1);
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const idx_r2 = core /* ɵɵnextContext */.XpG().index;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(idx_r2 + 1 + ". ");
  }
}
function RappidOplComponent_ng_container_2_span_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "span", 5);
    core /* ɵɵlistener */.bIt("mouseover", function RappidOplComponent_ng_container_2_span_2_Template_span_mouseover_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const opl_r4 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r4 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r4.highlightCells(opl_r4.cells));
    })("mouseleave", function RappidOplComponent_ng_container_2_span_2_Template_span_mouseleave_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r3);
      const opl_r4 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r4 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r4.unhighlightCells(opl_r4.cells));
    })("dblclick", function RappidOplComponent_ng_container_2_span_2_Template_span_dblclick_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const opl_r4 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r4 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r4.handleDblClicking($event, opl_r4.cells));
    })("click", function RappidOplComponent_ng_container_2_span_2_Template_span_click_0_listener($event) {
      core /* ɵɵrestoreView */.eBV(_r3);
      const ctx_r4 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r4.handleClicking($event));
    });
    core /* ɵɵelementEnd */.k0s();
  }
  if (rf & 2) {
    const opl_r4 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵproperty */.Y8G("innerHTML", opl_r4.opl, core /* ɵɵsanitizeHtml */.npT)("ngClass", core /* ɵɵpureFunction1 */.eq3(2, rappid_opl_component_c0, opl_r4.highlighted));
  }
}
function RappidOplComponent_ng_container_2_br_3_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelement */.nrm(0, "br");
  }
}
function RappidOplComponent_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementContainerStart */.qex(0);
    core /* ɵɵtemplate */.DNE(1, RappidOplComponent_ng_container_2_span_1_Template, 2, 1, "span", 3)(2, RappidOplComponent_ng_container_2_span_2_Template, 1, 4, "span", 4)(3, RappidOplComponent_ng_container_2_br_3_Template, 1, 0, "br", 3);
    core /* ɵɵelementContainerEnd */.bVm();
  }
  if (rf & 2) {
    const opl_r4 = ctx.$implicit;
    const ctx_r4 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r4.oplService.settings.oplNumbering && (opl_r4.showAll || opl_r4.highlighted));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", opl_r4.opl && (opl_r4.showAll || opl_r4.highlighted));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", opl_r4.opl && (opl_r4.showAll || opl_r4.highlighted));
  }
}
let RappidOplComponent = /*#__PURE__*/(() => {
  class RappidOplComponent {
    constructor(treeViewService, graphService, options, graphDB, oplService) {
      this.treeViewService = treeViewService;
      this.graphService = graphService;
      this.options = options;
      this.graphDB = graphDB;
      this.oplService = oplService;
      this.hoverOnOpl = false;
      this.opls = [];
      this.highlightColor = "#E1E6EB";
      this.ignoreEvent = false;
      this.prev_colors = {};
      this.shouldUpdateOpl = true;
      this.oplService.oplSwitch.subscribe(message => {
        if (message === "urgent opl refresh") {
          this.updateOpl();
        }
      });
      this.options.currentOpl = this.opls;
      this.oplService.oplSwitch.next("opl widget initialized");
      this.graph = this.options.graph;
      this.paper = this.options.paper;
      const this_ = this;
      setInterval(function () {
        if (this_.shouldUpdateOpl && this_.oplService.oplOpen && !this_.options.graph.hasActiveBatch("pointerdown") && !this_.options.graph.hasActiveBatch("linkCreation") && !this_.options.graph.hasActiveBatch("arrowhead-move")) {
          this_.updateOpl();
          this_.shouldUpdateOpl = false;
        }
      }, 800);
      this.graph.on("change", cell => {
        this.oplService.oplSwitch.next("graph change");
        this.shouldUpdateOpl = true;
      });
      this.graph.on("add", cell => {
        this.oplService.oplSwitch.next("graph add");
        this.shouldUpdateOpl = true;
      });
      this.graph.on("remove", cell => {
        this.oplService.oplSwitch.next("graph remove");
        this.shouldUpdateOpl = true;
      });
      this.graph.on("reset", cell => {
        this.oplService.oplSwitch.next("graph reset");
        this.shouldUpdateOpl = true;
      });
      this.graph.on("clear", cell => {
        this.opls = [];
      });
      this.paper.on("cell:mouseover", function (cellView, evt) {
        try {
          if (oplDefaultSettings.highlightOpl && (!this_.options.selectedElement || !OPCloudUtils.isInstanceOfDrawnEntity(this_.options.selectedElement))) {
            for (const opl of this.opls) {
              opl.highlighted = !!opl.cells.find(c => c.id && c.id === cellView.model.id);
              if (cellView.model.constructor.name.includes("Default") || cellView.model.constructor.name.includes("Triangle")) {
                opl.showAll = true;
              } else {
                opl.showAll = false;
              }
            }
          }
        } catch (e) {}
      }, this);
      this.paper.on("cell:mouseout", function (cellView, evt) {
        try {
          if (oplDefaultSettings.highlightOpl && (!this_.options.selectedElement || !OPCloudUtils.isInstanceOfDrawnEntity(this_.options.selectedElement))) {
            for (const opl of this.opls) {
              opl.highlighted = false;
              opl.showAll = true;
            }
          }
        } catch (e) {}
      }, this);
      this.paper.on("blank:pointerup", () => {
        for (const opl of this.opls) {
          opl.highlighted = false;
          opl.showAll = true;
        }
      });
      this.options.selected$.subscribe(element => {
        if (element) {
          for (const opl of this.opls) {
            opl.showAll = false;
            opl.highlighted = opl.cells.includes(element);
          }
        } else {
          for (const opl of this.opls) {
            opl.highlighted = false;
            opl.showAll = true;
          }
        }
      });
    }
    updateOpl() {
      if (this.oplService.oplOpen) {
        this.oplService.queryResultLabel.next(false);
        let opls = this.oplService.generateOpl();
        let changeOpl = false;
        if (this.opls.length !== opls.length) {
          changeOpl = true;
        } else {
          for (let i = 0; i < opls.length; i++) {
            if (!this.opls[i] || this.opls[i].opl !== opls[i].opl) {
              changeOpl = true;
              break;
            }
          }
        }
        if (this.options.opmModel.currentOpd.id === this.options.opmModel.getOPMQueryID() && this.graphDB.ResultOPLs) {
          opls = this.graphDB.ResultOPLs;
          changeOpl = true;
          this.oplService.queryResultLabel.next(true);
        }
        if (changeOpl) {
          this.opls = opls;
          for (const opl of this.opls) {
            opl.highlighted = false;
            opl.showAll = true;
          }
        }
        this.options.currentOpl = this.opls;
      }
    }
    delay(ms) {
      return (0, default)(function* () {
        yield new Promise(resolve => setTimeout(() => resolve(null), ms)).then(() => console.log("fired"));
      })();
    }
    test() {
      this.graph.on("change", cell => {});
    }
    HoverOnCells() {
      this.paper.on("link:mouseenter", function (cellView, evt) {}, this);
    }
    highlightObject(cell) {
      if (cell.constructor.name.includes("Semi")) {
        return;
      }
      const cellView = this.paper.findViewByModel(cell);
      if (!cellView) {
        return;
      }
      if (!(Object.keys(this.prev_colors).indexOf(cell.id) > -1)) {
        this.prev_colors[cell.id] = cellView.model.attr("rect/fill");
      }
      cellView.model.attr("rect/fill", this.highlightColor);
    }
    unhighlightObject(cell) {
      if (cell.constructor.name.includes("Semi")) {
        return;
      }
      let color = "white";
      const cellView = this.paper.findViewByModel(cell);
      if (!cellView) {
        return;
      }
      if (Object.keys(this.prev_colors).indexOf(cell.id) > -1) {
        color = this.prev_colors[cell.id];
        delete this.prev_colors[cell.id];
      }
      const mc = this.options.opmModel.getCurrentConfiguration();
      if (mc && mc[cellView.model.getVisual().logicalElement.lid] && mc[cellView.model.getVisual().logicalElement.lid].value !== 0) {
        cellView.model.colorIfInCurrentConfiguration(this.options);
        return;
      }
      const shouldBeGreyed = cell && cell.getVisual() && cell.getVisual().logicalElement.shouldBeGreyed && this.options.shouldGreyOut;
      if (cellView.model.getVisual() && cellView.model.getVisual().fill) {
        cellView.model.attr("rect/fill", shouldBeGreyed ? "lightgrey" : cellView.model.getVisual().fill);
      } else {
        cellView.model.attr("rect/fill", color);
      }
    }
    highlightProcess(cell) {
      const cellView = this.paper.findViewByModel(cell);
      if (!cellView) {
        return;
      }
      if (!(Object.keys(this.prev_colors).indexOf(cell.id) > -1)) {
        this.prev_colors[cell.id] = cellView.model.attr("ellipse/fill");
      }
      cellView.model.attr("ellipse/fill", this.highlightColor);
    }
    unhighlightProcess(cell) {
      let color = "white";
      const cellView = this.paper.findViewByModel(cell);
      if (!cellView) {
        return;
      }
      if (Object.keys(this.prev_colors).indexOf(cell.id) > -1) {
        color = this.prev_colors[cell.id];
        delete this.prev_colors[cell.id];
      }
      const mc = this.options.opmModel.getCurrentConfiguration();
      if (mc && mc[cellView.model.getVisual().logicalElement.lid] && mc[cellView.model.getVisual().logicalElement.lid].value !== 0) {
        cellView.model.colorIfInCurrentConfiguration(this.options);
        return;
      }
      const shouldBeGreyed = cell && cell.getVisual() && cell.getVisual().logicalElement.shouldBeGreyed && this.options.shouldGreyOut;
      if (cellView.model.getVisual() && cellView.model.getVisual().fill) {
        cellView.model.attr("ellipse/fill", shouldBeGreyed ? "lightgrey" : cellView.model.getVisual().fill);
      } else {
        cellView.model.attr("ellipse/fill", color);
      }
    }
    highlightLink(cell) {
      const cellView = this.paper.findViewByModel(cell);
      if (cellView?.model) {
        cellView.model.attr(".connection/stroke", this.highlightColor);
      }
    }
    unhighlightLink(cell) {
      const cellView = this.paper.findViewByModel(cell);
      if (cellView && cellView.model) {
        cellView.model.removeAttr(".connection/stroke");
      }
    }
    highlightStates(cell) {
      const parent = cell.getParent();
      if (parent.getEmbeddedCells()) {
        const states = parent.getEmbeddedCells();
        for (const state of states) {
          this.highlightSingleState(state);
        }
      }
    }
    unhighlightStates(cell) {
      const parent = cell.getParent();
      if (parent.getEmbeddedCells()) {
        const states = parent.getEmbeddedCells();
        for (const state of states) {
          this.unhighlightSingleState(state);
        }
      }
    }
    highlightSingleState(state) {
      const cellView = this.paper.findViewByModel(state);
      if (!cellView) {
        return;
      }
      // Store the current fill (which might be a pattern URL) before highlighting
      if (!(Object.keys(this.prev_colors).indexOf(state.id) > -1)) {
        const currentFill = cellView.model.attr("rect/fill");
        this.prev_colors[state.id] = currentFill === undefined ? "white" : currentFill;
      }
      cellView.model.attr(".inner/fill", this.highlightColor);
      cellView.model.attr(".outer/fill", this.highlightColor);
      cellView.model.attr("rect/fill", this.highlightColor);
    }
    unhighlightSingleState(state) {
      let fillValue = "white";
      const cellView = this.paper.findViewByModel(state);
      if (!cellView) {
        return;
      }
      // Restore the previous fill (which might be a pattern URL)
      if (Object.keys(this.prev_colors).indexOf(state.id) > -1) {
        fillValue = this.prev_colors[state.id];
        delete this.prev_colors[state.id];
      } else {
        // If not stored, get from visual element
        const visual = cellView.model.getVisual();
        if (visual && visual.fill) {
          fillValue = visual.fill;
        }
      }
      const shouldBeGreyed = state && state.getVisual() && state.getVisual().fatherObject.logicalElement.shouldBeGreyed && this.options.shouldGreyOut;
      if (shouldBeGreyed) {
        fillValue = "lightgrey";
      }
      // Apply the fill value (which might be a pattern URL) to all state elements
      cellView.model.attr(".inner/fill", fillValue);
      cellView.model.attr(".outer/fill", fillValue);
      cellView.model.attr("rect/fill", fillValue);
      const validationColor = state.getVisual()?.getValidationView().color;
      if (validationColor) {
        cellView.model.attr(".inner/fill", validationColor);
        cellView.model.attr(".outer/fill", validationColor);
        cellView.model.attr("rect/fill", validationColor);
      }
    }
    handlePopupLocation($event) {
      // handle location of popup based on:
      // 1. top - the height of the event place:
      // default behaviour is to be opened on the bottom side of the sentence
      // and in case the height is not sufficient enough we will move it to the top of the sentence.
      // 2. left - making sure the popup is not passing the screen's width
      // will mostly be used in the side view of the OPL
      const element = $(".joint-popup")[0];
      if (element !== undefined) {
        // activate only if there is a popup on the screen
        const popup = element;
        if (window.innerHeight - $event.clientY < element.getClientRects()[0].height + 30) {
          const height = element.getClientRects()[0].height;
          const top = $event.clientY - height - 30;
          popup.style.top = top.toString() + "px";
        }
        if (element.getClientRects()[0].left < 0) {
          popup.style.left = "0px";
        }
      }
    }
    createPopupDiv(cellList) {
      let popupContent = "<div style=\"padding-top: 8px\">";
      for (let i = 0; i < cellList.length; i++) {
        let first = cellList[i].sourceElement.lastEnteredText;
        if (first.length > 10) {
          first = first.substring(0, 9) + "...";
        }
        let second = cellList[i].targetElement.lastEnteredText;
        if (second.length > 10) {
          second = second.substring(0, 9) + "...";
        }
        popupContent += "<button title=\"" + cellList[i].sourceElement.lastEnteredText + "->" + cellList[i].targetElement.lastEnteredText + "\" class=\"Popup PopupOPL\" style=\"margin: 0 5px 5px 5px;\" value=\"" + i.toString() + "\">" + first + " -> " + second + "</button>";
      }
      popupContent += "</div>";
      return popupContent;
    }
    handleClicking($event) {
      // single clicking on an OPL sentence
      // triggers copying to clipboard of the OPL text
      const text = $event.target.innerText;
      const el = document.createElement("textarea");
      el.value = text;
      // appending and then removing element so we can copy to clipboard
      document.body.appendChild(el); // adding as an element
      el.select();
      document.execCommand("copy"); // copied to clipboard
      document.body.removeChild(el); // removing the element
    }
    handleDblClicking($event, cells) {
      // double clicking in an OPL sentence:
      // clicking on object/process/state - triggers opening of this entity editor
      // clicking on other parts of the sentence - triggers opening of the link's editor.
      // if more than one link is in the sentence than first another popup is opened
      // allowing the user to decide which link they want to edit.
      // handle process/object/state
      if ($event.target.tagName === "B") {
        const className = $event.target.className;
        if (className) {
          let cellId = className;
          if (className.startsWith("state")) {
            cellId = className.split(" ")[1];
          }
          // let cell = cells.find(c => c.id === cellId); // find the right cell
          let cell = this.options.graph.getCell(cellId);
          // if cell wasn't found, look for it in cells' parents.
          // this is needed when an entity has states because than the entity is not in "cells".
          if (!cell) {
            cell = cells.find(c => c.getParent()?.id === cellId);
            cell = cell?.getParent();
          }
          if (cell) {
            // if cell was found, open its text editor
            cell.openTextEditor($event.target, (0, getInitRappidShared)());
          }
        }
        // handle links
      } else if ($event.target.className === "oplText ng-star-inserted") {
        const cellList = cells.filter(c => c.attributes.type === "opm.Link");
        if (cellList.length !== 0) {
          // handle single link -> open the editor popup
          if (cellList.length === 1) {
            cellList[0].rightClickHandlePopoup($event.target, (0, getInitRappidShared)());
            // handle multiple links -> open selection popup
          } else {
            // create a new popup to decide which link to open
            const popupContent = this.createPopupDiv(cellList);
            const _this = this; // used for the inner function in stylePopupEvents
            // handle selection of the user -> open the chosen link's editor popup
            const stylePopupEvents = {
              "click .PopupOPL": function (el) {
                cellList[el.target.value].rightClickHandlePopoup($event.target, (0, getInitRappidShared)());
                _this.handlePopupLocation($event);
              }
            };
            // generate the new popup to the screen
            (0, popupGenerator)($event.target, popupContent, stylePopupEvents).render(); // create the popup
            (0, stylePopup)(false, true, false); // style it according to the system
          }
        }
      }
      // handle location of popup
      // default location is to the bottom of the sentence
      // if the popup is too high, than location will change to the top of the sentence
      this.handlePopupLocation($event);
    }
    highlightCells(cells) {
      this.hoverOnOpl = true;
      if (oplDefaultSettings.highlightOpd) {
        for (const cell of cells) {
          this.ignoreEvent = true;
          this.highlightCell(cell);
          this.ignoreEvent = false;
        }
      }
    }
    unhighlightCells(cells) {
      this.hoverOnOpl = false;
      if (oplDefaultSettings.highlightOpd) {
        for (const cell of cells) {
          this.ignoreEvent = true;
          this.unhighlightCell(cell);
          this.ignoreEvent = false;
        }
      }
    }
    highlightCell(cell) {
      this.options.graph.startBatch("ignoreEvents");
      this.options.graph.startBatch("ignoreChange");
      switch (cell.attributes.type) {
        case "opm.Object":
          this.highlightObject(cell);
          break;
        case "opm.Process":
          this.highlightProcess(cell);
          break;
        case "opm.Link":
          this.highlightLink(cell);
          break;
        case "opm.State":
          this.highlightSingleState(cell);
          break;
      }
      this.options.graph.stopBatch("ignoreEvents");
      this.options.graph.stopBatch("ignoreChange");
    }
    unhighlightCell(cell) {
      this.options.graph.startBatch("ignoreEvents");
      this.options.graph.startBatch("ignoreChange");
      switch (cell.attributes.type) {
        case "opm.Object":
          this.unhighlightObject(cell);
          break;
        case "opm.Process":
          this.unhighlightProcess(cell);
          break;
        case "opm.Link":
          this.unhighlightLink(cell);
          break;
        case "opm.State":
          this.unhighlightSingleState(cell);
          break;
      }
      this.options.graph.stopBatch("ignoreEvents");
      this.options.graph.stopBatch("ignoreChange");
    }
    unHighlightAllCells($event) {
      if ($event.type === "mouseleave" || $event.type === "mousemove" && $event.target.className === "opl-container") {
        const cells = this.options.graph.getCells().filter(cell => cell instanceof OpmEntity);
        this.unhighlightCells(cells);
      }
    }
    static #_ = (() => this.ɵfac = function RappidOplComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || RappidOplComponent)(core /* ɵɵdirectiveInject */.rXU(TreeViewService), core /* ɵɵdirectiveInject */.rXU(GraphService), core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(GraphDBService), core /* ɵɵdirectiveInject */.rXU(OplService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: RappidOplComponent,
      selectors: [["opcloud-rappid-opl"]],
      decls: 3,
      vars: 1,
      consts: [["oplContainer", ""], [1, "opl-container", 3, "mouseleave", "mousemove"], [4, "ngFor", "ngForOf"], [4, "ngIf"], ["class", "oplText", 3, "innerHTML", "ngClass", "mouseover", "mouseleave", "dblclick", "click", 4, "ngIf"], [1, "oplText", 3, "mouseover", "mouseleave", "dblclick", "click", "innerHTML", "ngClass"]],
      template: function RappidOplComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵelementStart */.j41(0, "div", 1, 0);
          core /* ɵɵlistener */.bIt("mouseleave", function RappidOplComponent_Template_div_mouseleave_0_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.unHighlightAllCells($event));
          })("mousemove", function RappidOplComponent_Template_div_mousemove_0_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.unHighlightAllCells($event));
          });
          core /* ɵɵtemplate */.DNE(2, RappidOplComponent_ng_container_2_Template, 4, 3, "ng-container", 2);
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.opls);
        }
      },
      dependencies: [NgClass, NgForOf, NgIf],
      styles: [".opl-container[_ngcontent-%COMP%]{padding:5px;overflow:auto;font-size:14px}p[_ngcontent-%COMP%]{margin:5px 0}.oplText[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500}[_nghost-%COMP%] > .object[_ngcontent-%COMP%]{color:#00b050}[_nghost-%COMP%] > .process[_ngcontent-%COMP%]{color:#0070c0}[_nghost-%COMP%] > .state[_ngcontent-%COMP%]{color:olive}.highlighted[_ngcontent-%COMP%]   rect[_ngcontent-%COMP%]{fill:red;stroke-width:3px;stroke:red}.highlighted[_ngcontent-%COMP%]   ellipse[_ngcontent-%COMP%]{fill:red;stroke-width:3px;stroke:red}.oplHighlight[_ngcontent-%COMP%], span[_ngcontent-%COMP%]:hover{background-color:#e1e6eb}p[_ngcontent-%COMP%]{display:inline-block}"]
    }))();
  }
  return RappidOplComponent;
})();