// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/grey-items-dialog/grey-items-dialog.component.ts
// Extracted by opm-extracted/tools/extract.mjs

const grey_items_dialog_component_c0 = (a0, a1) => ({
  object: a0,
  process: a1
});
function GreyItemsDialogComponent_ng_container_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementContainerStart */.qex(0);
    core /* ɵɵelementStart */.j41(1, "div", 13)(2, "div", 22)(3, "input", 23);
    core /* ɵɵtwoWayListener */.mxI("ngModelChange", function GreyItemsDialogComponent_ng_container_28_Template_input_ngModelChange_3_listener($event) {
      const element_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      if (!core /* ɵɵtwoWayBindingSet */.DH7(element_r2.isMarked, $event)) {
        element_r2.isMarked = $event;
      }
      return core /* ɵɵresetView */.Njj($event);
    });
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(4, "div", 24);
    core /* ɵɵlistener */.bIt("click", function GreyItemsDialogComponent_ng_container_28_Template_div_click_4_listener() {
      const element_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      return core /* ɵɵresetView */.Njj(element_r2.isMarked = !element_r2.isMarked);
    });
    core /* ɵɵtext */.EFF(5);
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(6, "div", 25);
    core /* ɵɵlistener */.bIt("click", function GreyItemsDialogComponent_ng_container_28_Template_div_click_6_listener() {
      const element_r2 = core /* ɵɵrestoreView */.eBV(_r1).$implicit;
      return core /* ɵɵresetView */.Njj(element_r2.isMarked = !element_r2.isMarked);
    });
    core /* ɵɵtext */.EFF(7);
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementContainerEnd */.bVm();
  }
  if (rf & 2) {
    const element_r2 = ctx.$implicit;
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$(3);
    core /* ɵɵproperty */.Y8G("disabled", ctx_r2.shouldBeDisabled());
    core /* ɵɵtwoWayProperty */.R50("ngModel", element_r2.isMarked);
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngClass", core /* ɵɵpureFunction2 */.l_i(5, grey_items_dialog_component_c0, element_r2.thing.name === "OpmLogicalObject", element_r2.thing.name === "OpmLogicalProcess"));
    core /* ɵɵadvance */.R7$();
    core /* ɵɵtextInterpolate */.JRh(element_r2.thing._text);
    core /* ɵɵadvance */.R7$(2);
    core /* ɵɵtextInterpolate */.JRh(ctx_r2.getOpdsNamesByElement(element_r2));
  }
}
function GreyItemsDialogComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "div", 8)(1, "div");
    core /* ɵɵtext */.EFF(2, "No elements to show");
    core /* ɵɵelementEnd */.k0s()();
  }
}
function GreyItemsDialogComponent_div_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 26)(1, "div", 27)(2, "h3", 28);
    core /* ɵɵtext */.EFF(3, "Options");
    core /* ɵɵelementEnd */.k0s()();
    core /* ɵɵelementStart */.j41(4, "div", 29)(5, "div", 30);
    core /* ɵɵelement */.nrm(6, "input", 31);
    core /* ɵɵtext */.EFF(7, " Include all visual things instances and their OPD location ");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(8, "div", 32)(9, "mat-button-toggle-group", 33)(10, "mat-button-toggle", 34);
    core /* ɵɵlistener */.bIt("click", function GreyItemsDialogComponent_div_30_Template_mat_button_toggle_click_10_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.selectedExportType = "pdf");
    });
    core /* ɵɵtext */.EFF(11, "Pdf");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(12, "mat-button-toggle", 35);
    core /* ɵɵlistener */.bIt("click", function GreyItemsDialogComponent_div_30_Template_mat_button_toggle_click_12_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.selectedExportType = "csv");
    });
    core /* ɵɵtext */.EFF(13, "CSV");
    core /* ɵɵelementEnd */.k0s()()();
    core /* ɵɵelementStart */.j41(14, "button", 36);
    core /* ɵɵlistener */.bIt("click", function GreyItemsDialogComponent_div_30_Template_button_click_14_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.continueToExport());
    });
    core /* ɵɵtext */.EFF(15, "Continue");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(16, "button", 37);
    core /* ɵɵlistener */.bIt("click", function GreyItemsDialogComponent_div_30_Template_button_click_16_listener() {
      core /* ɵɵrestoreView */.eBV(_r4);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.showExportOptions = false);
    });
    core /* ɵɵtext */.EFF(17, "Cancel");
    core /* ɵɵelementEnd */.k0s()()();
  }
  if (rf & 2) {
    core /* ɵɵadvance */.R7$(6);
    core /* ɵɵattribute */.BMQ("checked", true);
  }
}
function GreyItemsDialogComponent_div_31_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "button", 43);
    core /* ɵɵlistener */.bIt("click", function GreyItemsDialogComponent_div_31_button_1_Template_button_click_0_listener() {
      core /* ɵɵrestoreView */.eBV(_r6);
      const ctx_r2 = core /* ɵɵnextContext */.XpG(2);
      return core /* ɵɵresetView */.Njj(ctx_r2.save());
    });
    core /* ɵɵtext */.EFF(1, "Save");
    core /* ɵɵelementEnd */.k0s();
  }
}
function GreyItemsDialogComponent_div_31_button_2_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "button", 44);
    core /* ɵɵtext */.EFF(1, "Save");
    core /* ɵɵelementEnd */.k0s();
  }
}
function GreyItemsDialogComponent_div_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = core /* ɵɵgetCurrentView */.RV6();
    core /* ɵɵelementStart */.j41(0, "div", 38);
    core /* ɵɵtemplate */.DNE(1, GreyItemsDialogComponent_div_31_button_1_Template, 2, 0, "button", 39)(2, GreyItemsDialogComponent_div_31_button_2_Template, 2, 0, "button", 40);
    core /* ɵɵelementStart */.j41(3, "button", 41);
    core /* ɵɵlistener */.bIt("click", function GreyItemsDialogComponent_div_31_Template_button_click_3_listener() {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.showExportOptions = true);
    });
    core /* ɵɵtext */.EFF(4, "Export List");
    core /* ɵɵelementEnd */.k0s();
    core /* ɵɵelementStart */.j41(5, "button", 42);
    core /* ɵɵlistener */.bIt("click", function GreyItemsDialogComponent_div_31_Template_button_click_5_listener() {
      core /* ɵɵrestoreView */.eBV(_r5);
      const ctx_r2 = core /* ɵɵnextContext */.XpG();
      return core /* ɵɵresetView */.Njj(ctx_r2.cancel());
    });
    core /* ɵɵtext */.EFF(6, "Cancel");
    core /* ɵɵelementEnd */.k0s()();
  }
  if (rf & 2) {
    const ctx_r2 = core /* ɵɵnextContext */.XpG();
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", !ctx_r2.shouldBeDisabled());
    core /* ɵɵadvance */.R7$();
    core /* ɵɵproperty */.Y8G("ngIf", ctx_r2.shouldBeDisabled());
  }
}
let GreyItemsDialogComponent = /*#__PURE__*/(() => {
  class GreyItemsDialogComponent {
    constructor(data, dialogRef, context, treeViewService) {
      this.data = data;
      this.dialogRef = dialogRef;
      this.context = context;
      this.treeViewService = treeViewService;
      this.showTypeIndex = 0;
      this.showType = [OpmLogicalThing, OpmLogicalProcess, OpmLogicalObject];
      this.searchString = "";
      this.showExportOptions = false;
      this.selectedExportType = "pdf";
      this.opmModel = treeViewService.initRappid.opmModel;
      this.graphService = treeViewService.initRappid.graphService;
      this.opd = treeViewService.initRappid.opmModel.opds;
      this.addOpdToConstList();
      this.searchList = [...this.constList];
      if (data && data.element) {
        this.searchString = data.element.text;
        this.search();
      }
    }
    thingSearching(evt) {
      this.showTypeIndex = evt.target.value;
      this.updateSearchList();
    }
    updateSearchList() {
      this.searchList = [...this.constList];
      this.filterList();
    }
    sortFunc(e1, e2) {
      if (e1.name === e2.name) {
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
        this.searchList = this.searchList.filter(e => e.thing.getBareName().toLowerCase().indexOf(this.searchString.toLowerCase()) > -1);
      }
    }
    search() {
      this.updateSearchList();
    }
    addOpdToConstList() {
      const updatedList = [];
      for (const item of this.opmModel.logicalElements.filter(elm => elm instanceof OpmLogicalThing)) {
        const newItem = {
          thing: item,
          opdElements: [],
          isMarked: item.shouldBeGreyed
        };
        for (let i = 0; i < item.visualElements.length; i++) {
          const opd = this.opmModel.getOpdByThingId(item.visualElements[i].id);
          if (opd && !opd.isHidden) {
            newItem.opdElements.push({
              name: opd.getNumberedName() + (opd.getNumberedName() === "SD" ? "" : ": " + opd.getName()),
              id: opd.id
            });
          }
        }
        updatedList.push(newItem);
      }
      this.constList = updatedList;
    }
    goToOpdById(id) {
      this.graphService.changeGraphModel(id, this.treeViewService, "");
      this.dialogRef.close();
    }
    getOpdsNamesByElement(element, seperator = ", ") {
      return (0, removeDuplicationsInArray)(element.opdElements.map(opd => opd.name)).join(seperator);
    }
    cancel() {
      this.dialogRef.close();
    }
    save() {
      for (const item of this.constList) {
        item.thing.setShouldBeGreyed(item.isMarked);
      }
      for (const cell of (0, getInitRappidShared)().graph.getCells().filter(c => c instanceof OpmEntity)) {
        cell.greyOutEntity();
      }
      this.dialogRef.close();
    }
    selectOrUnSelectAll($event) {
      for (const checkBox of $(".cBox")) {
        if (checkBox.checked !== $event.target.checked) {
          checkBox.click();
        }
      }
    }
    exportToPdf() {
      const pdf = new jspdf_es_min({
        orientation: "p",
        unit: "pt",
        format: "a4",
        putOnlyUsedFonts: true
      });
      const pdfProps = createDocumentProperties(pdf, 40, 40);
      const modelName = this.opmModel.name ? this.opmModel.name : "Unsaved Model";
      pdf.setTextColor("#1A3763");
      insertText("Marked Things in the model: " + modelName, pdf, pdfProps, false, "center", "bold", 18);
      insertText("\n", pdf, pdfProps, false, "center", "bold", 8);
      pdf.setTextColor("#000");
      const sortedConstList = this.constList.sort((a, b) => {
        if (a.thing.getBareName() > b.thing.getBareName()) {
          return 1;
        } else {
          return -1;
        }
      });
      for (const item of sortedConstList) {
        const symbol = item.isMarked ? "V" : "X";
        const text = symbol + " ";
        insertText(text, pdf, pdfProps, true, "left", "normal", 11);
        let thingColor = item.thing.constructor.name.includes("Process") ? "#0070c0" : "#00b050";
        if (item.isMarked) {
          thingColor = "#000";
        }
        pdf.setTextColor(thingColor);
        insertText(item.thing.getBareName(), pdf, pdfProps, false, "left", "normal", 11);
        pdf.setTextColor("#000");
      }
      if ($("#fullExport")[0].checked) {
        newPage(pdf, pdfProps);
        pdf.setTextColor("#1A3763");
        insertText("Detailed Marked Things:", pdf, pdfProps, false, "center", "bold", 18);
        insertText("\n", pdf, pdfProps, false, "center", "bold", 8);
        pdf.setTextColor("#000");
        for (const item of sortedConstList.filter(i => i.isMarked)) {
          pdf.setTextColor("#000");
          insertText(item.thing.getBareName(), pdf, pdfProps, true, "left", "normal", 11);
          pdf.setTextColor("#000");
          insertText(", appears at:", pdf, pdfProps, false, "left", "normal", 11);
          for (const locationStr of this.getOpdsNamesByElement(item, "\n").split("\n")) {
            insertText("   - " + locationStr, pdf, pdfProps, true, "left", "normal", 11);
          }
          insertText("", pdf, pdfProps, true, "left", "normal", 11);
        }
      }
      pdf.save(modelName + " marked things.pdf");
    }
    exportToCSV() {
      const modelName = this.opmModel.name ? this.opmModel.name : "Unsaved Model";
      const sortedConstList = this.constList.sort((a, b) => {
        if (a.thing.getBareName() > b.thing.getBareName()) {
          return 1;
        } else {
          return -1;
        }
      });
      let csv = "Is Marked?, Name";
      for (const item of sortedConstList) {
        const symbol = item.isMarked ? "V" : "X";
        csv += "\n" + symbol + "," + item.thing.getBareName() + ",";
      }
      if ($("#fullExport")[0].checked) {
        csv += "\n\n";
        csv += "Name, Location,";
        for (const item of sortedConstList.filter(i => i.isMarked)) {
          const name = item.thing.getBareName();
          const locations = this.getOpdsNamesByElement(item, "\n").split("\n");
          for (const location of locations) {
            csv += "\n" + (locations.indexOf(location) === 0 ? name : " ") + "," + location + ",";
          }
        }
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], {
        type: "text/csv"
      }));
      a.setAttribute("download", modelName + ".csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    isReadOnly() {
      return this.treeViewService.initRappid.modelService.hasToken !== true;
    }
    shouldBeDisabled() {
      return this.context.isReadonly();
    }
    continueToExport() {
      this.save();
      this.showExportOptions = false;
      if (this.selectedExportType === "pdf") {
        this.exportToPdf();
      } else {
        this.exportToCSV();
      }
      this.dialogRef.close();
    }
    static #_ = (() => this.ɵfac = function GreyItemsDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || GreyItemsDialogComponent)(core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(ContextService), core /* ɵɵdirectiveInject */.rXU(TreeViewService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: GreyItemsDialogComponent,
      selectors: [["grey-items-dialog"]],
      decls: 32,
      vars: 6,
      consts: [["id", "content"], ["id", "header", 1, "title", "element_holder"], ["id", "selectSearchDiv"], [1, "select"], [1, "typeselect", 3, "change"], ["value", "0"], ["value", "1"], ["value", "2"], [1, "element_holder"], ["id", "searchString", "type", "text", "placeholder", "Search by name", 3, "ngModelChange", "keyup", "ngModel"], ["id", "all_elements_holder", 1, "wholeTable", 2, "height", "487px", "overflow-y", "auto"], [1, "divTable", "greyGridTable"], [1, "divTableHeading"], [1, "divTableRow"], [1, "divTableHead", 2, "display", "inline-flex"], ["type", "checkbox", 3, "change", "disabled"], [1, "divTableHead"], [1, "divTableBody"], [4, "ngFor", "ngForOf"], ["class", "element_holder", 4, "ngIf"], ["id", "exportOptions", 4, "ngIf"], ["class", "footerButtons", 4, "ngIf"], [1, "divTableCell", 2, "width", "40px"], ["type", "checkbox", 1, "cBox", 3, "ngModelChange", "disabled", "ngModel"], [1, "divTableCell", 3, "click", "ngClass"], [1, "divTableCell", 3, "click"], ["id", "exportOptions"], [2, "height", "55px"], [2, "position", "absolute", "left", "calc(50% - 30px)"], ["id", "exportFooter"], [2, "margin-left", "12px", "padding-bottom", "10px"], ["type", "checkbox", "id", "fullExport", 2, "margin-top", "10px"], [2, "margin-left", "calc(50% - 60px)", "color", "#1A3763"], ["name", "fontStyle", "aria-label", "Font Style", "value", "pdf"], ["value", "pdf", "selected", "", 2, "color", "#1A3763", 3, "click"], ["value", "csv", 2, "color", "#1A3763", 3, "click"], ["mat-button", "", 1, "footerBtn", 2, "margin-left", "180px", 3, "click"], ["mat-button", "", 1, "footerBtn", 3, "click"], [1, "footerButtons"], ["mat-button", "", "id", "markThingsFooterBtn1", 3, "click", 4, "ngIf"], ["mat-button", "", "id", "markThingsFooterBtn2", "matTooltip", "The model is read only", 4, "ngIf"], ["mat-button", "", "id", "markThingsFooterBtn3", 3, "click"], ["mat-button", "", "id", "markThingsFooterBtn4", 3, "click"], ["mat-button", "", "id", "markThingsFooterBtn1", 3, "click"], ["mat-button", "", "id", "markThingsFooterBtn2", "matTooltip", "The model is read only"]],
      template: function GreyItemsDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          core /* ɵɵelementStart */.j41(0, "div", 0)(1, "div", 1);
          core /* ɵɵtext */.EFF(2, "Mark Things");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(3, "br")(4, "br");
          core /* ɵɵelementStart */.j41(5, "div", 2)(6, "span", 3)(7, "select", 4);
          core /* ɵɵlistener */.bIt("change", function GreyItemsDialogComponent_Template_select_change_7_listener($event) {
            return ctx.thingSearching($event);
          });
          core /* ɵɵelementStart */.j41(8, "option", 5);
          core /* ɵɵtext */.EFF(9, "All Elements");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(10, "option", 6);
          core /* ɵɵtext */.EFF(11, "Processes Only");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(12, "option", 7);
          core /* ɵɵtext */.EFF(13, "Objects Only");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(14, "span", 8)(15, "input", 9);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function GreyItemsDialogComponent_Template_input_ngModelChange_15_listener($event) {
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.searchString, $event)) {
              ctx.searchString = $event;
            }
            return $event;
          });
          core /* ɵɵlistener */.bIt("keyup", function GreyItemsDialogComponent_Template_input_keyup_15_listener() {
            return ctx.search();
          });
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(16, "div", 10)(17, "div", 11)(18, "div", 12)(19, "div", 13)(20, "div", 14);
          core /* ɵɵtext */.EFF(21, "Marked ");
          core /* ɵɵelementStart */.j41(22, "input", 15);
          core /* ɵɵlistener */.bIt("change", function GreyItemsDialogComponent_Template_input_change_22_listener($event) {
            return ctx.selectOrUnSelectAll($event);
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(23, "div", 16);
          core /* ɵɵtext */.EFF(24, "Element");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(25, "div", 16);
          core /* ɵɵtext */.EFF(26, "Locations");
          core /* ɵɵelementEnd */.k0s()()();
          core /* ɵɵelementStart */.j41(27, "div", 17);
          core /* ɵɵtemplate */.DNE(28, GreyItemsDialogComponent_ng_container_28_Template, 8, 8, "ng-container", 18);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵtemplate */.DNE(29, GreyItemsDialogComponent_div_29_Template, 3, 0, "div", 19);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵtemplate */.DNE(30, GreyItemsDialogComponent_div_30_Template, 18, 1, "div", 20)(31, GreyItemsDialogComponent_div_31_Template, 7, 2, "div", 21);
          core /* ɵɵelementEnd */.k0s();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(15);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.searchString);
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵproperty */.Y8G("disabled", ctx.shouldBeDisabled());
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵproperty */.Y8G("ngForOf", ctx.searchList);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.searchList.length === 0);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.showExportOptions);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("ngIf", ctx.searchList.length !== 0);
        }
      },
      dependencies: [NgClass, NgForOf, NgIf, MatTooltip, MatButton, MatButtonToggleGroup, MatButtonToggle, NgSelectOption, fesm2022_forms /* ɵNgSelectMultipleOption */.y7, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgModel],
      styles: ["div.greyGridTable[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;border:2px solid #FFFFFF;width:100%;text-align:center;border-collapse:collapse}#header[_ngcontent-%COMP%]{position:relative;font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal;font-weight:500;line-height:normal;font-size:20px;text-align:center;color:#1a3763;margin-bottom:10px}#searchString[_ngcontent-%COMP%]{border:1px solid rgba(88,109,140,.5);border-radius:4px;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%;height:20px;margin-inline:27px}.select[_ngcontent-%COMP%]{display:inline-block;width:114px;height:21px;border:1px solid rgba(88,109,140,.5);border-radius:4px}.typeselect[_ngcontent-%COMP%]{display:block;width:105px;height:20px;background-image:url(/assets/icons/select_arrow.png);background-repeat:no-repeat;background-position:right center;border:none;-webkit-appearance:none;-moz-appearance:none;overflow:hidden;color:#1a3763;font-family:Roboto,Arial,Helvetica,sans-serif;font-weight:400;Opacity:70%;margin-left:5px}#selectSearchDiv[_ngcontent-%COMP%]{position:relative;top:-21px}input[type=text][_ngcontent-%COMP%]{position:relative;left:146px}.object[_ngcontent-%COMP%]{color:#00b050}.process[_ngcontent-%COMP%]{color:#0070c0}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableCell[_ngcontent-%COMP%], .divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHead[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;border:1px solid #FFFFFF;padding:3px 4px}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableBody[_ngcontent-%COMP%]   .divTableCell[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:13px;line-height:26px}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHeading[_ngcontent-%COMP%]{background:#fff;text-align:-webkit-left}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHeading[_ngcontent-%COMP%]   .divTableHead[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:15px;font-weight:700;color:#1a3763;text-align:center}.divTable.greyGridTable[_ngcontent-%COMP%]   .divTableHeading[_ngcontent-%COMP%]   .divTableHead[_ngcontent-%COMP%]:first-child{border-left:none}.greyGridTable[_ngcontent-%COMP%]   .tableFootStyle[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:14px;font-weight:700;color:#333;border-top:4px solid #333333}.greyGridTable[_ngcontent-%COMP%]   .tableFootStyle[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-size:14px}.divTable[_ngcontent-%COMP%]{display:table}.divTableRow[_ngcontent-%COMP%]{display:table-row;border-bottom:4px solid #cccccc}.divTableCell[_ngcontent-%COMP%], .divTableHead[_ngcontent-%COMP%]{display:table-cell}.divTableHeading[_ngcontent-%COMP%]{display:table-header-group}.divTableFoot[_ngcontent-%COMP%]{display:table-footer-group}.divTableBody[_ngcontent-%COMP%]{display:table-row-group}#markThingsFooterBtn3[_ngcontent-%COMP%], #markThingsFooterBtn4[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal!important;font-weight:400!important;letter-spacing:normal!important;font-size:14px;color:#1a3763!important;height:40px}#markThingsFooterBtn1[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal!important;font-weight:400!important;letter-spacing:normal!important;font-size:14px;color:#1a3763!important;height:40px;margin-left:270px}#markThingsFooterBtn2[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal!important;font-weight:400!important;letter-spacing:normal!important;font-size:14px;color:#00000042;height:40px;margin-left:270px}.mat-mdc-button-toggle-label-content[_ngcontent-%COMP%]{line-height:35px!important}#exportOptions[_ngcontent-%COMP%]{position:absolute;color:#1a3763!important;left:calc(50% - 250px);top:calc(50% - 125px);width:500px;height:200px;background-color:#fff;box-shadow:.5px .5px 73.5px -22px;border-radius:10px;display:block}#exportFooter[_ngcontent-%COMP%]{margin-bottom:5px;margin-left:10px;align-items:center}.footerBtn[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif;font-style:normal!important;font-weight:400!important;line-height:normal;font-size:14px;color:#1a3763;padding:5px;margin:5px;letter-spacing:normal}#exportOptionsInnerText[_ngcontent-%COMP%]{margin-top:55px;margin-left:25px;position:absolute}#fullExport[_ngcontent-%COMP%]{margin-bottom:5px}.footerButtons[_ngcontent-%COMP%]{margin-top:30px;align-items:center;display:block}"]
    }))();
  }
  return GreyItemsDialogComponent;
})();