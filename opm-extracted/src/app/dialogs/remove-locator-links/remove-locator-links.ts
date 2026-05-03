// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/remove-locator-links/remove-locator-links.ts
// Extracted by opm-extracted/tools/extract.mjs

function RemoveLocatorLinks_div_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 4)(1, "div", 10);
    core /* ɵɵlistener */.bIt("click", function RemoveLocatorLinks_div_16_Template_div_click_1_listener() {
      const vis_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.goToOpdById(vis_r2.opdId, vis_r2.id));
    });
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "div", 10);
    core /* ɵɵlistener */.bIt("click", function RemoveLocatorLinks_div_16_Template_div_click_3_listener() {
      const vis_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.goToOpdById(vis_r2.opdId, vis_r2.id));
    });
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "div", 11);
    core /* ɵɵtext */.EFF(6);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(7, "div", 11);
    core /* ɵɵtext */.EFF(8);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const vis_r2 = ctx.$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(vis_r2.linkType);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(vis_r2.opdName);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("className", ctx_r2.getClassNameByItemId(vis_r2.id, "source"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(vis_r2.sourceName);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("className", ctx_r2.getClassNameByItemId(vis_r2.id, "target"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(vis_r2.targetName);
  }
}
function RemoveLocatorLinks_div_17_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 12)(1, "div");
    core /* ɵɵtext */.EFF(2, "No elements to show");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function RemoveLocatorLinks_div_18_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 13)(1, "label");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.getToolTipMsg());
  }
}
/**
 * The search component opens up a search box.
 * Once the users enters an input, the dialog box displaying the things and the levels they are located in.
 * The user can click on the wanted "thing" and access the opd where it is located.
 **/
let RemoveLocatorLinks = /*#__PURE__*/(() => {
  class RemoveLocatorLinks {
    constructor(dialogRef, treeViewService) {
      this.dialogRef = dialogRef;
      this.treeViewService = treeViewService;
      this.showTypeIndex = 0;
      this.showType = [OpmLogicalThing, OpmLogicalProcess, OpmLogicalObject];
      this.searchString = "";
      this.searchID = "";
      this.listOfVisuals = new Array();
      this.opmModel = treeViewService.initRappid.opmModel;
      this.graphService = treeViewService.initRappid.graphService;
      this.opd = treeViewService.initRappid.opmModel.opds;
      this.addOpdToConstList();
      this.searchList = [...this.constList];
      if ((0, getInitRappidShared)().getElementToRemove()) {
        this.searchID = (0, getInitRappidShared)().getElementToRemove().id;
        this.createList();
        // this.search();
      }
    }
    updateSearchList() {
      this.searchList = [...this.constList];
      this.filterList();
    }
    sortFunc(e1, e2) {
      if (e1.name == e2.name) {
        if (e1.text < e2.text) {
          return -1;
        } else {
          return 1;
        }
      }
      if (e1.name === "OpmLogicalObject") {
        return -1;
      } else {
        return 1;
      }
    }
    filterList() {
      this.searchList = this.searchList.filter(e => e.thing instanceof this.showType[this.showTypeIndex]).sort((e1, e2) => this.sortFunc(e1, e2));
      if (this.searchString.length > 0) {
        this.searchList = this.searchList.filter(e => e.thing.text.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1);
      }
    }
    search() {
      this.updateSearchList();
    }
    addOpdToConstList() {
      const updatedList = [];
      for (const item of this.opmModel.logicalElements) {
        if (!(item instanceof OpmLogicalThing)) {
          continue;
        }
        const newItem = {
          thing: item,
          opdElements: []
        };
        // const itemVisualElementIdsList = item.getAllVisualElementIdsByLogical();
        for (let i = 0; i < item.visualElements.length; i++) {
          const opd = this.opmModel.getOpdByThingId(item.visualElements[i].id);
          if (opd) {
            newItem.opdElements.push({
              name: opd.getName(),
              id: opd.id
            });
          }
        }
        updatedList.push(newItem);
      }
      this.constList = updatedList;
    }
    goToOpdById(opdID, visID) {
      const logical = (0, getInitRappidShared)().getOpmModel().getLogicalElementByVisualId(visID);
      this.graphService.changeGraphModel(opdID, this.treeViewService, "", logical);
      this.dialogRef.close();
    }
    createList() {
      const initRappid = (0, getInitRappidShared)();
      const model = initRappid.getOpmModel();
      const elementToRemove = initRappid.getElementToRemove();
      let logicals = [];
      if (elementToRemove.constructor.name.includes("Default")) {
        const triangle = elementToRemove.getTargetElement();
        const linksToRemove = initRappid.graphService.getGraph().getConnectedLinks(triangle, {
          outbound: true
        });
        for (const lnk of linksToRemove) {
          const lg = model.getLogicalElementByVisualId(lnk.id);
          logicals.push(lg);
          const rr = model.getRelatedRelationsByLogicalLink(lg);
          if (rr) {
            logicals.push(...rr.filter(l => !logicals.includes(l)));
          }
        }
      } else {
        logicals.push(model.getLogicalElementByVisualId(this.searchID));
      }
      const logicalLinkToRemove = model.getLogicalElementByVisualId(elementToRemove.id);
      if (initRappid.getOpmModel().getRelatedRelationsByLogicalLink(logicalLinkToRemove)) {
        const related = initRappid.getOpmModel().getRelatedRelationsByLogicalLink(logicalLinkToRemove);
        logicals = [...logicals, ...related];
      }
      logicals = (0, removeDuplicationsInArray)(logicals);
      for (const log of logicals) {
        log.visualElements.forEach(vis => {
          if (vis.visible === false) {
            return;
          }
          const opd = model.getOpdByThingId(vis.id);
          if (opd.isHidden) {
            return;
          }
          const opdSubTitle = this.treeViewService.treeView.treeModel.getNodeById(opd.id).data.subTitle;
          const isRootSD = opd.getName().endsWith("SD") ? "" : ": " + opd.getName();
          const name = "SD" + opdSubTitle + isRootSD;
          this.listOfVisuals.push({
            id: vis.id,
            opdId: opd.id,
            opdName: name,
            sourceName: vis.sourceVisualElement.logicalElement.text,
            targetName: vis.targetVisualElements[0].targetVisualElement.logicalElement.text,
            linkType: linkType[vis.logicalElement.linkType]
          });
        });
      }
      this.listOfVisuals.sort((e1, e2) => {
        const node1 = initRappid.treeViewService.getNodeById(e1.opdId);
        const node2 = initRappid.treeViewService.getNodeById(e2.opdId);
        if (node1 && node2) {
          const first = initRappid.treeViewService.getNodeDepth(node1);
          const second = initRappid.treeViewService.getNodeDepth(node2);
          if (first > second) {
            return 1;
          } else {
            return -1;
          }
        }
        return 1;
      });
    }
    getClassNameByItemId(itemId, sourceOrTarget) {
      const init = (0, getInitRappidShared)();
      let visual;
      const item = init.getOpmModel().getVisualElementById(itemId);
      if (!item) {
        return "divTableCell";
      }
      if (sourceOrTarget === "source") {
        visual = item.sourceVisualElement;
      } else if (item && item.targetVisualElements[0]) {
        visual = item.targetVisualElements[0].targetVisualElement;
      }
      if (!visual) {
        return "divTableCell";
      }
      if (visual.constructor.name.includes("State")) {
        return "divTableCell state";
      }
      if (visual.constructor.name.includes("Object")) {
        return "divTableCell object";
      }
      if (visual.constructor.name.includes("Process")) {
        return "divTableCell process";
      }
      return "divTableCell";
    }
    getToolTipMsg() {
      const that = this;
      const element = this.listOfVisuals.find(item => this.opmModel.getVisualElementById(item.id) && this.opmModel.getVisualElementById(item.id).logicalElement.visualElements.find(v => that.opmModel.getOpdByThingId(v.id).isHidden));
      if (element) {
        return "The logical link belongs to a stereotype. Hence, it will be removed visually only.";
      }
      return "";
    }
    static #_ = (() => this.ɵfac = function RemoveLocatorLinks_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || RemoveLocatorLinks)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(TreeViewService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: RemoveLocatorLinks,
      selectors: [["remove-locator-links"]],
      decls: 19,
      vars: 3,
      consts: [["id", "content", 2, "overflow-y", "scroll", "overflow-x", "hidden", "height", "180px"], ["id", "all_elements_holder"], [1, "divTable", "greyGridTable"], [1, "divTableHeading"], [1, "divTableRow"], [1, "divTableHead", 2, "text-align", "center"], [1, "divTableBody"], ["class", "divTableRow", 4, "ngFor", "ngForOf"], ["class", "element_holder", 4, "ngIf"], ["style", "color: red; margin-bottom: -22px; margin-top: 14px; font-size: 13px;", 4, "ngIf"], [1, "divTableCell", 3, "click"], [3, "className"], [1, "element_holder"], [2, "color", "red", "margin-bottom", "-22px", "margin-top", "14px", "font-size", "13px"]],
      template: function RemoveLocatorLinks_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0);
          core /* ɵɵelement */.nrm(1, "br");
          core /* ɵɵelementStart */.j41(2, "div", 1)(3, "div", 2)(4, "div", 3)(5, "div", 4)(6, "div", 5);
          core /* ɵɵtext */.EFF(7, "Link");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(8, "div", 5);
          core /* ɵɵtext */.EFF(9, "Location (Click To Focus)");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(10, "div", 5);
          core /* ɵɵtext */.EFF(11, "Source");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(12, "div", 5);
          core /* ɵɵtext */.EFF(13, "Target");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(14, "div", 6);
          core /* ɵɵelementContainerStart */.qex(15);
          core /* ɵɵtemplate */.DNE(16, RemoveLocatorLinks_div_16_Template, 9, 6, "div", 7);
          core /* ɵɵelementContainerEnd */.bVm();
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(17, RemoveLocatorLinks_div_17_Template, 3, 0, "div", 8);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(18, RemoveLocatorLinks_div_18_Template, 3, 1, "div", 9);
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(16);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.listOfVisuals);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.listOfVisuals.length === 0);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.getToolTipMsg() !== "");
        }
      },
      dependencies: [NgForOf, NgIf],
      styles: ["div.greyGridTable[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;border:2px solid #FFFFFF;width:100%;text-align:center;border-collapse:collapse}#header[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:16px;font-weight:700;color:#fff;background:#1a3763;padding:5px;border-radius:6px}#selectSearchDiv[_ngcontent-%COMP%]{position:relative;top:-21px}input[type=text][_ngcontent-%COMP%]{position:relative;left:146px}.object[_ngcontent-%COMP%]{color:#00b050}.process[_ngcontent-%COMP%]{color:#0070c0}.state[_ngcontent-%COMP%]{color:olive}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableCell[_ngcontent-%COMP%], .divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHead[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;border:1px solid #FFFFFF;padding:3px 4px}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableBody[_ngcontent-%COMP%]   .divTableCell[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:13px;line-height:26px}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableCell[_ngcontent-%COMP%]:hover{background:#1a3763;color:#fff}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHeading[_ngcontent-%COMP%]{background:#fff;text-align:-webkit-center}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHeading[_ngcontent-%COMP%]   .divTableHead[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:15px;font-weight:700;color:#1a3763;text-align:left}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHeading[_ngcontent-%COMP%]   .divTableHead[_ngcontent-%COMP%]:first-child{border-left:none}.greyGridTable[_ngcontent-%COMP%]   .tableFootStyle[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:14px;font-weight:700;color:#333;border-top:4px solid #333333}.greyGridTable[_ngcontent-%COMP%]   .tableFootStyle[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:14px}.divTable[_ngcontent-%COMP%]{display:table}.divTableRow[_ngcontent-%COMP%]{display:table-row;border-bottom:4px solid #cccccc}.divTableCell[_ngcontent-%COMP%], .divTableHead[_ngcontent-%COMP%]{display:table-cell}.divTableHeading[_ngcontent-%COMP%]{display:table-header-group}.divTableFoot[_ngcontent-%COMP%]{display:table-footer-group}.divTableBody[_ngcontent-%COMP%]{display:table-row-group}"]
    }))();
  }
  return RemoveLocatorLinks;
})();