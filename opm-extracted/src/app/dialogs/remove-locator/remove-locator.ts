// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/remove-locator/remove-locator.ts
// Extracted by opm-extracted/tools/extract.mjs

const remove_locator_c0 = (a0, a1) => ({
  object: a0,
  process: a1
});
function RemoveLocator_ng_container_11_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 4)(1, "div", 11);
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(3, "div", 12);
    core /* ɵɵlistener */.bIt("click", function RemoveLocator_ng_container_11_div_1_Template_div_click_3_listener() {
      const y_r2 = core /* ɵɵrestoreView */.eBV(_r1).index;
      const element_r3 = core /* ɵɵnextContext */.XpG().$implicit;
      const ctx_r3 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r3.goToOpdById(element_r3.opdElements[y_r2].id, element_r3));
    });
    core /* ɵɵtext */.EFF(4);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const y_r2 = ctx.index;
    const element_r3 = core /* ɵɵnextContext */.XpG().$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngClass", core /* ɵɵpureFunction2 */.l_i(3, remove_locator_c0, element_r3.thing.name === "OpmLogicalObject", element_r3.thing.name === "OpmLogicalProcess"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(element_r3.thing.text);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(element_r3.opdElements[y_r2].name);
  }
}
function RemoveLocator_ng_container_11_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementContainerStart */.qex(0);
    core /* ɵɵtemplate */.DNE(1, RemoveLocator_ng_container_11_div_1_Template, 5, 6, "div", 10);
    core /* ɵɵelementContainerEnd */.bVm();
  }
  if (rf & 2) {
    const element_r3 = ctx.$implicit;
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngForOf", element_r3.opdElements);
  }
}
function RemoveLocator_div_12_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 13)(1, "div");
    core /* ɵɵtext */.EFF(2, "No elements to show");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function RemoveLocator_div_13_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 14)(1, "label");
    core /* ɵɵtext */.EFF(2);
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r3 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(ctx_r3.getToolTipMsg());
  }
}
/**
 * The search component opens up a search box.
 * Once the users enters an input, the dialog box displaying the things and the levels they are located in.
 * The user can click on the wanted "thing" and access the opd where it is located.
 **/
let RemoveLocator = /*#__PURE__*/(() => {
  class RemoveLocator {
    constructor(dialogRef, treeViewService) {
      this.dialogRef = dialogRef;
      this.treeViewService = treeViewService;
      this.showTypeIndex = 0;
      this.showType = [OpmLogicalThing, OpmLogicalProcess, OpmLogicalObject];
      this.searchString = "";
      this.opmModel = treeViewService.initRappid.opmModel;
      this.graphService = treeViewService.initRappid.graphService;
      this.opd = treeViewService.initRappid.opmModel.opds;
      this.searchList = [];
      const initRappid = (0, getInitRappidShared)();
      const toRemove = initRappid.getElementToRemove();
      if (toRemove && OPCloudUtils.isInstanceOfDrawnThing(toRemove)) {
        this.search();
      }
    }
    search() {
      const model = this.treeViewService.initRappid.opmModel;
      const logical = this.treeViewService.initRappid.getElementToRemove().getVisual().logicalElement;
      const visuals = logical.visualElements.filter(v => model.getOpdByThingId(v.id) && !model.getOpdByThingId(v.id)?.isHidden);
      const that = this;
      this.searchList = [{
        thing: logical,
        opdElements: visuals.map(vis => {
          return {
            name: that.getOpdName(vis.id),
            id: model.getOpdByThingId(vis.id).id
          };
        }).sort((a, b) => {
          if (model.opds.indexOf(model.getOpd(a.id)) > model.opds.indexOf(model.getOpd(b.id))) {
            return 1;
          } else {
            return -1;
          }
        })
      }];
    }
    getOpdName(visualId) {
      const opd = this.opmModel.getOpdByThingId(visualId);
      if (opd) {
        const opdSubTitle = this.treeViewService.treeView.treeModel.getNodeById(opd.id)?.data.subTitle || "";
        const isRootSD = opd.getName().endsWith("SD") ? "" : ": " + opd.getName();
        return "SD" + opdSubTitle + isRootSD;
      } else {
        return "Unknown";
      }
    }
    goToOpdById(id, element) {
      this.graphService.changeGraphModel(id, this.treeViewService, "", element.thing);
      this.dialogRef.close();
    }
    getToolTipMsg() {
      const element = this.searchList.find(item => (item.thing.constructor.name.includes("Object") || item.thing.constructor.name.includes("Process")) && item.thing.getBelongsToStereotyped());
      if (element) {
        return "*" + element.thing.getBareName() + " belongs to a stereotype. Hence, it will be removed visually only.";
      }
      return "";
    }
    static #_ = (() => this.ɵfac = function RemoveLocator_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || RemoveLocator)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(TreeViewService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: RemoveLocator,
      selectors: [["remove-locator"]],
      decls: 14,
      vars: 3,
      consts: [["id", "content", 2, "overflow-y", "scroll", "overflow-x", "hidden", "height", "180px"], ["id", "all_elements_holder"], [1, "divTable", "greyGridTable"], [1, "divTableHeading"], [1, "divTableRow"], [1, "divTableHead", 2, "text-align", "center"], [1, "divTableBody"], [4, "ngFor", "ngForOf"], ["class", "element_holder", 4, "ngIf"], ["style", "color: red; margin-bottom: -22px; margin-top: 14px; font-size: 13px;", 4, "ngIf"], ["class", "divTableRow", 4, "ngFor", "ngForOf"], [1, "divTableCell", 2, "text-align", "center", 3, "ngClass"], [1, "divTableCell", 2, "text-align", "center", 3, "click"], [1, "element_holder"], [2, "color", "red", "margin-bottom", "-22px", "margin-top", "14px", "font-size", "13px"]],
      template: function RemoveLocator_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0);
          core /* ɵɵelement */.nrm(1, "br");
          core /* ɵɵelementStart */.j41(2, "div", 1)(3, "div", 2)(4, "div", 3)(5, "div", 4)(6, "div", 5);
          core /* ɵɵtext */.EFF(7, "Element");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(8, "div", 5);
          core /* ɵɵtext */.EFF(9, "Location (Click To Focus)");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(10, "div", 6);
          core /* ɵɵtemplate */.DNE(11, RemoveLocator_ng_container_11_Template, 2, 1, "ng-container", 7);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(12, RemoveLocator_div_12_Template, 3, 0, "div", 8);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(13, RemoveLocator_div_13_Template, 3, 1, "div", 9);
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(11);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.searchList);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.searchList.length === 0);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.getToolTipMsg() !== "");
        }
      },
      dependencies: [NgClass, NgForOf, NgIf],
      styles: ["div.greyGridTable[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;border:2px solid #FFFFFF;width:100%;text-align:center;border-collapse:collapse}#header[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:16px;font-weight:700;color:#fff;background:#1a3763;padding:5px;border-radius:6px}#selectSearchDiv[_ngcontent-%COMP%]{position:relative;top:-21px}input[type=text][_ngcontent-%COMP%]{position:relative;left:146px}.object[_ngcontent-%COMP%]{color:#00b050}.process[_ngcontent-%COMP%]{color:#0070c0}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableCell[_ngcontent-%COMP%], .divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHead[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;border:1px solid #FFFFFF;padding:3px 4px}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableBody[_ngcontent-%COMP%]   .divTableCell[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:13px;line-height:26px}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableCell[_ngcontent-%COMP%]:hover{background:#1a3763;color:#fff}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHeading[_ngcontent-%COMP%]{background:#fff;text-align:-webkit-left}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHeading[_ngcontent-%COMP%]   .divTableHead[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:15px;font-weight:700;color:#1a3763;text-align:left}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHeading[_ngcontent-%COMP%]   .divTableHead[_ngcontent-%COMP%]:first-child{border-left:none}.greyGridTable[_ngcontent-%COMP%]   .tableFootStyle[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:14px;font-weight:700;color:#333;border-top:4px solid #333333}.greyGridTable[_ngcontent-%COMP%]   .tableFootStyle[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:14px}.divTable[_ngcontent-%COMP%]{display:table}.divTableRow[_ngcontent-%COMP%]{display:table-row;border-bottom:4px solid #cccccc}.divTableCell[_ngcontent-%COMP%], .divTableHead[_ngcontent-%COMP%]{display:table-cell}.divTableHeading[_ngcontent-%COMP%]{display:table-header-group}.divTableFoot[_ngcontent-%COMP%]{display:table-footer-group}.divTableBody[_ngcontent-%COMP%]{display:table-row-group}"]
    }))();
  }
  return RemoveLocator;
})();