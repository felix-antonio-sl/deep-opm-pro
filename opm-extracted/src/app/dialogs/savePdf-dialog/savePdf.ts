// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/savePdf-dialog/savePdf.ts
// Extracted by opm-extracted/tools/extract.mjs

/*
* This Component enables to export the entire model as a PDF file.
* For further information about the package jsPDF go to: http://raw.githack.com/MrRio/jsPDF/master/docs/
* inputs: open OPM model in the web
* output: single PDF file
*/
/*
  * This is the main function of pdf creation.
  * It calls the functions to create all the different pdf parts and in the end renders again the current opd.
  * Inputs: fileName = user input or default
  * Output: PDF file
  */
let SavePdfComponent = /*#__PURE__*/(() => {
  class SavePdfComponent {
    constructor(data,
    // to get the model name (if saved)
    dialogRef, graphService, initRappidService, contextService, storageService, oplService,
    // Do not delete, it is used in the component! "this" is passed as a parameter to some functions
    groupsService // Do not delete, it is used in the component!
    ) {
      this.data = data;
      this.dialogRef = dialogRef;
      this.graphService = graphService;
      this.initRappidService = initRappidService;
      this.contextService = contextService;
      this.storageService = storageService;
      this.oplService = oplService;
      this.groupsService = groupsService;
      this.spinnerFlag = false; // flag to show a spinner while downloading
      this.showTooltips = false;
      if (data.modelName) {
        // get the model name to set as a default value to the pdf file name
        this.modelName = data.modelName;
      } else {
        // if the model is not saved and thus we have no model name, set 'Unsaved Model' as the default file name
        this.modelName = "Unsaved Model";
      }
      this.originalOpd = this.initRappidService.opmModel.currentOpd;
    }
    setOpdsOrder() {
      this.opdsOrder = [];
      let defaultSelection = false;
      if (!this.selectedOpds) {
        this.selectedOpds = this.initRappidService.opmModel.opds;
        defaultSelection = true;
      }
      const regularOpds = this.selectedOpds.filter(o => !o.requirementViewOf && !o.stereotypeOpd).sort((a, b) => {
        if (a.getNumberedName() > b.getNumberedName()) {
          return 1;
        } else {
          return -1;
        }
      });
      const requirementViews = this.includeRequirementViews ? this.selectedOpds.filter(o => o.requirementViewOf) : [];
      let stereotypesOpds;
      if (defaultSelection) {
        stereotypesOpds = this.initRappidService.opmModel.stereotypes.getStereoTypes().map(str => str.opd);
      } else {
        stereotypesOpds = this.selectedOpds.filter(opd => opd.stereotypeOpd);
      }
      this.opdsOrder = [...regularOpds, ...requirementViews, ...stereotypesOpds].filter(opd => !opd.isHidden);
    }
    openOpdsSelectionDialog(includeUnloadedSubModels) {
      var _this = this;
      return (0, default)(function* () {
        if (includeUnloadedSubModels) {
          if (_this.initRappidService.opmModel.opds.some(opd => opd.sharedOpdWithSubModelId && opd.visualElements.length === 0)) {
            (0, validationAlert)("Loading all sub models");
            yield OPCloudUtils.waitXms(100);
          }
          yield _this.initRappidService.opdHierarchyRef.loadAllSubModels();
        }
        _this.initRappidService.dialogService.openDialog(SelectOpdsTreeDialog, 700, 900, {
          allowMultipleDialogs: true,
          title: "Select OPDs to Export:",
          mode: "export"
        }).afterClosed().toPromise().then(res => {
          _this.selectedOpds = res;
        });
      })();
    }
    // getChildrenOpds(opd) {
    //   if (!opd.children || opd.children.length === 0)
    //     return [];
    //   const ret = [];
    //   for (const child of opd.children)
    //     ret.push(child, ...this.getChildrenOpds(child));
    //   return ret;
    // }
    savePdfMain(fileName, includeURL, includeTooltips, numberedOPL, includeDescription, includeComputational, resolutionCheck, resolutionOPDs, confidentialWatermark, includeElementsDictionary, includeRequirementViews, includeUnloadedSubModels) {
      var _this2 = this;
      return (0, default)(function* () {
        if ($(".mat-mdc-dialog-container")[0]) {
          $(".mat-mdc-dialog-container")[0].style.overflow = "hidden";
        }
        if (includeUnloadedSubModels) {
          yield _this2.initRappidService.opdHierarchyRef.loadAllSubModels();
        }
        // this.initRappidService.treeViewService.expandAllNodes();
        _this2.initRappidService.currentlyExportingPdf = true;
        // this.initRappidService.treeViewService.treeView.treeModel.expandAll();
        _this2.showTooltips = includeTooltips;
        _this2.numberedOPL = numberedOPL;
        _this2.includeEntitiesDescription = includeDescription;
        _this2.includeProcessComputational = includeComputational;
        _this2.resolutionCheck = resolutionCheck;
        _this2.resolutionOPDs = resolutionOPDs;
        _this2.confidentialWatermark = confidentialWatermark;
        _this2.includeRequirementViews = includeRequirementViews;
        _this2.includeDictionary = includeElementsDictionary;
        _this2.setOpdsOrder();
        _this2.spinnerFlag = true; // from here on the spinner will be shown until the downloading ends.
        if ($(".mat-mdc-dialog-container").length > 0) {
          $(".mat-mdc-dialog-container")[0].style.background = "transparent";
          $(".mat-mdc-dialog-surface")[0].style.setProperty("background", "transparent", "important");
          $(".mat-mdc-dialog-inner-container")[0].style.background = "transparent";
          $(".mat-mdc-dialog-container")[0].style.boxShadow = "none";
          // Remove box shadow from mat-mdc-dialog-surface
          $(".mat-mdc-dialog-surface")[0].style.setProperty("box-shadow", "none", "important");
          // Remove box shadow from mat-mdc-dialog-container (parent container)
          $(".mat-mdc-dialog-container")[0].style.setProperty("box-shadow", "none", "important");
          // Remove box shadow from mdc-dialog__surface (MD component)
          $(".mdc-dialog__surface")[0].style.setProperty("box-shadow", "none", "important");
          $(".mat-mdc-dialog-inner-container")[0].style.boxShadow = "none";
        }
        _this2.dialogRef.disableClose = true;
        let treeLevel = 0; // this variable is used later to count the levels(opds) of the module tree
        // and to know when we have reached the last level (opd).
        // pdf is the instance of the document we are going to write to.
        let pdf = new jspdf_es_min({
          orientation: "p",
          unit: "pt",
          format: "a4",
          putOnlyUsedFonts: true
        }); //'a4': [595.28, 841.89],
        let pdfProps = createDocumentProperties(pdf, 40, 40); // structure to keep all the pdf properties
        const currentOpd = _this2.initRappidService.opmModel.currentOpd; // save current open OPD to render after the process has finished
        // start filling the pdf file
        const pdfNodes = pdf.outline.add(null, "Content", null); // Bookmarks main node for all
        yield insertHeader(pdf, pdfProps, fileName, _this2);
        // Adding model URL if checked by the user
        if (includeURL) {
          const urldata = _this2.contextService.makeUrl();
          let url = "URL not defined for unsaved model";
          if (urldata.allowed) {
            url = urldata.url.split("|||")[0];
          }
          insertText("Model URL: ", pdf, pdfProps);
          insertText(url, pdf, pdfProps, false, "left", "italic");
          newLine(pdfProps);
          insertDividingLine(pdf, pdfProps, 2, "#1A3763");
        }
        insertTableOfContents(pdf, pdfProps, _this2.includeDictionary, pdfNodes);
        newPage(pdf, pdfProps);
        insertOpdTree(pdf, pdfProps, _this2.includeRequirementViews, pdfNodes, _this2.initRappidService.treeViewService);
        newPage(pdf, pdfProps);
        insertText("DIAGRAMS & OPL", pdf, pdfProps, true, "center", "bold", 16);
        newLine(pdfProps);
        collectDataWrapper(treeLevel, pdf, pdfProps, fileName, _this2, pdfNodes);
      })();
    }
    static #_ = (() => this.ɵfac = function SavePdfComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SavePdfComponent)(core /* ɵɵdirectiveInject */.rXU(MAT_DIALOG_DATA), core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(GraphService), core /* ɵɵdirectiveInject */.rXU(InitRappidService), core /* ɵɵdirectiveInject */.rXU(ContextService), core /* ɵɵdirectiveInject */.rXU(StorageService), core /* ɵɵdirectiveInject */.rXU(OplService), core /* ɵɵdirectiveInject */.rXU(GroupsService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: SavePdfComponent,
      selectors: [["opcloud-save-pdf-dialog"]],
      decls: 55,
      vars: 18,
      consts: [["filename", ""], ["includeURL", ""], ["includeTooltips", ""], ["includeElementsDictionary", ""], ["includeDescription", ""], ["includeComputational", ""], ["numberedOPL", ""], ["includeRequirementViews", ""], ["confidentialWatermark", ""], ["includeUnloadedSubModels", ""], ["resolutionCheck", ""], ["resolution", ""], [1, "exportPdfDiv", 3, "hidden"], [1, "exportPdfTitle"], [2, "font-size", "13px", "text-align", "center"], [1, "pdfCheckboxDiv"], [2, "width", "95%", "text-align", "start"], ["matInput", "", "placeholder", "File Name:", "matTooltipPosition", "above", 3, "ngModelChange", "ngModel", "matTooltip"], ["matTooltip", "Check to include the model URL in the generated PDF", "matTooltipPosition", "right", 2, "float", "left", 3, "checked"], ["matTooltip", "Check to include computational processes tooltip in the OPDs images", "matTooltipPosition", "right", 2, "float", "left", 3, "checked"], ["matTooltip", "Check to include all model elements dictionary", "matTooltipPosition", "right", 2, "float", "left", 3, "change", "checked"], ["matTooltip", "Check to include the descriptions of the entities in the elements dictionary", "matTooltipPosition", "right", 2, "float", "left", "margin-left", "20px", 3, "checked", "disabled"], ["matTooltip", "Check to include the computational function of the Processes in the elements dictionary", "matTooltipPosition", "right", 2, "float", "left", "margin-left", "20px", 3, "checked", "disabled"], ["matTooltip", "Check to show OPL sentences numbered", "matTooltipPosition", "right", 2, "float", "left", 3, "checked"], ["matTooltip", "Check to include requirement views", "matTooltipPosition", "right", 2, "float", "left", 3, "checked"], ["matTooltip", "Check to add confidential watermark at the bottom of each page", "matTooltipPosition", "right", 2, "float", "left", 3, "checked"], ["matTooltip", "Check to include unloaded sub models", "matTooltipPosition", "right", 2, "float", "left", 3, "checked"], ["matTooltip", "Resolution number represent quality in multiple values. e.g for 300 dpi use '3'", "matTooltipPosition", "right", 2, "float", "left", 3, "checked"], ["matInput", "", "placeholder", "Resolution", "type", "number", "min", "1", "max", "10", "required", "", 2, "text-align", "center", "width", "40px", "border", "none", "outline", "none", "box-shadow", "none", 3, "value"], [1, "pdfExportButtonsP"], ["mat-raised-button", "", 1, "pdfExportButton", 2, "margin-right", "15px", 3, "click"], ["mat-raised-button", "", "id", "Current", 1, "pdfExportButton", 3, "click"], [2, "margin-top", "-150px", 3, "hidden"], ["id", "spinnerWorking", "mode", "indeterminate", 2, "height", "135px", "margin-left", "calc(50% - 65px)"], [2, "position", "absolute", "width", "30px", "left", "calc(50% - 20px)", "top", "calc(50% - 115px)", 3, "hidden"], ["id", "spinnerValue", 2, "color", "#FFFF"]],
      template: function SavePdfComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵelementStart */.j41(0, "div", 12)(1, "div", 13)(2, "p", 13);
          core /* ɵɵtext */.EFF(3, "Export Model to PDF");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(4, "p", 14);
          core /* ɵɵtext */.EFF(5, "Note: Downloading might take few minutes");
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(6, "div", 15)(7, "mat-form-field", 16)(8, "mat-label");
          core /* ɵɵtext */.EFF(9, "File Name");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(10, "input", 17, 0);
          core /* ɵɵtwoWayListener */.mxI("ngModelChange", function SavePdfComponent_Template_input_ngModelChange_10_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            if (!core /* ɵɵtwoWayBindingSet */.DH7(ctx.modelName, $event)) {
              ctx.modelName = $event;
            }
            return core /* ɵɵresetView */.Njj($event);
          });
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(12, "mat-checkbox", 18, 1);
          core /* ɵɵtext */.EFF(14, "Include Model URL");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(15, "mat-checkbox", 19, 2);
          core /* ɵɵtext */.EFF(17, "Include Computational Processes Tooltips");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(18, "mat-checkbox", 20, 3);
          core /* ɵɵlistener */.bIt("change", function SavePdfComponent_Template_mat_checkbox_change_18_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const includeElementsDictionary_r2 = core /* ɵɵreference */.sdS(19);
            const includeDescription_r3 = core /* ɵɵreference */.sdS(22);
            const includeComputational_r4 = core /* ɵɵreference */.sdS(25);
            includeDescription_r3.checked = includeElementsDictionary_r2.checked;
            return core /* ɵɵresetView */.Njj(includeComputational_r4.checked = includeElementsDictionary_r2.checked);
          });
          core /* ɵɵtext */.EFF(20, " Include Elements Dictionary ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(21, "mat-checkbox", 21, 4);
          core /* ɵɵtext */.EFF(23, " Include Entities Description ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(24, "mat-checkbox", 22, 5);
          core /* ɵɵtext */.EFF(26, " Include Computational Functions ");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(27, "mat-checkbox", 23, 6);
          core /* ɵɵtext */.EFF(29, "Show OPL sentences Numbered");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(30, "mat-checkbox", 24, 7);
          core /* ɵɵtext */.EFF(32, "Include Requirement Views");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(33, "mat-checkbox", 25, 8);
          core /* ɵɵtext */.EFF(35, "Add Confidential Watermark");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(36, "mat-checkbox", 26, 9);
          core /* ɵɵtext */.EFF(38, "Include Unloaded Sub-Models");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(39, "mat-checkbox", 27, 10);
          core /* ɵɵtext */.EFF(41, " OPDs Resolution ");
          core /* ɵɵelement */.nrm(42, "input", 28, 11);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(44, "div", 29)(45, "p", 29)(46, "button", 30);
          core /* ɵɵlistener */.bIt("click", function SavePdfComponent_Template_button_click_46_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const includeUnloadedSubModels_r5 = core /* ɵɵreference */.sdS(37);
            return core /* ɵɵresetView */.Njj(ctx.openOpdsSelectionDialog(includeUnloadedSubModels_r5.checked));
          });
          core /* ɵɵtext */.EFF(47, "Select OPDs to Export");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(48, "button", 31);
          core /* ɵɵlistener */.bIt("click", function SavePdfComponent_Template_button_click_48_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const filename_r6 = core /* ɵɵreference */.sdS(11);
            const includeURL_r7 = core /* ɵɵreference */.sdS(13);
            const includeTooltips_r8 = core /* ɵɵreference */.sdS(16);
            const includeElementsDictionary_r2 = core /* ɵɵreference */.sdS(19);
            const includeDescription_r3 = core /* ɵɵreference */.sdS(22);
            const includeComputational_r4 = core /* ɵɵreference */.sdS(25);
            const numberedOPL_r9 = core /* ɵɵreference */.sdS(28);
            const includeRequirementViews_r10 = core /* ɵɵreference */.sdS(31);
            const confidentialWatermark_r11 = core /* ɵɵreference */.sdS(34);
            const includeUnloadedSubModels_r5 = core /* ɵɵreference */.sdS(37);
            const resolutionCheck_r12 = core /* ɵɵreference */.sdS(40);
            const resolution_r13 = core /* ɵɵreference */.sdS(43);
            return core /* ɵɵresetView */.Njj(ctx.savePdfMain(filename_r6.value, includeURL_r7.checked, includeTooltips_r8.checked, numberedOPL_r9.checked, includeDescription_r3.checked, includeComputational_r4.checked, resolutionCheck_r12.checked, resolution_r13.value, confidentialWatermark_r11.checked, includeElementsDictionary_r2.checked, includeRequirementViews_r10.checked, includeUnloadedSubModels_r5.checked));
          });
          core /* ɵɵtext */.EFF(49, "Save");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵelementStart */.j41(50, "div", 32);
          core /* ɵɵelement */.nrm(51, "progress-spinner", 33);
          core /* ɵɵelementStart */.j41(52, "div", 34)(53, "h2", 35);
          core /* ɵɵtext */.EFF(54, "0%");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          const includeElementsDictionary_r2 = core /* ɵɵreference */.sdS(19);
          core /* ɵɵproperty */.Y8G("hidden", ctx.spinnerFlag);
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵpropertyInterpolate */.FS9("matTooltip", ctx.modelName);
          core /* ɵɵtwoWayProperty */.R50("ngModel", ctx.modelName);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("checked", true);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("checked", false);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("checked", true);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("checked", true)("disabled", !includeElementsDictionary_r2.checked);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("checked", true)("disabled", !includeElementsDictionary_r2.checked);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("checked", true);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("checked", true);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("checked", false);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("checked", true);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("checked", true);
          core /* ɵɵadvance */.R7$(3);
          core /* ɵɵproperty */.Y8G("value", 2);
          core /* ɵɵadvance */.R7$(8);
          core /* ɵɵproperty */.Y8G("hidden", !ctx.spinnerFlag);
          core /* ɵɵadvance */.R7$(2);
          core /* ɵɵproperty */.Y8G("hidden", !ctx.spinnerFlag);
        }
      },
      dependencies: [MatFormField, MatLabel, MatInput, MatTooltip, MatButton, MatCheckbox, ProgressSpinner, DefaultValueAccessor, NgControlStatus, NgModel],
      styles: [".exportPdfDiv[_ngcontent-%COMP%]{overflow:hidden!important;color:#000000de!important;font-family:Roboto,Helvetica Neue,sans-serif!important}.exportPdfDiv[_ngcontent-%COMP%]   .exportPdfTitle[_ngcontent-%COMP%]{text-align:center;color:#000000de!important}.exportPdfDiv[_ngcontent-%COMP%]   .pdfCheckboxDiv[_ngcontent-%COMP%]{display:block!important}.exportPdfDiv[_ngcontent-%COMP%]   .pdfCheckboxDiv[_ngcontent-%COMP%]   .mat-mdc-checkbox[_ngcontent-%COMP%]{height:24px!important;line-height:15px!important;padding-top:3px!important;padding-bottom:3px!important}.exportPdfDiv[_ngcontent-%COMP%]   .pdfExportButtonsP[_ngcontent-%COMP%]{display:block!important;justify-items:center!important;text-align:center;font-family:Roboto,Helvetica Neue,sans-serif!important;color:#000000de!important}.exportPdfDiv[_ngcontent-%COMP%]   .pdfExportButtonsP[_ngcontent-%COMP%]   .pdfExportButton[_ngcontent-%COMP%]{margin-top:24px!important;min-width:120px;text-align:center;align-items:center;-webkit-appearance:auto;appearance:auto;font-weight:500!important;font-family:Roboto,Helvetica Neue,sans-serif!important;color:#000000de!important;letter-spacing:normal;padding-inline-start:16px;padding-inline-end:16px;padding-left:16px;padding-right:16px}.mat-mdc-checkbox-checked.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-mdc-checkbox-indeterminate.mat-accent[_ngcontent-%COMP%]   .mat-mdc-checkbox-background[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-accent[_ngcontent-%COMP%]   .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-checked[_ngcontent-%COMP%], .mat-mdc-pseudo-checkbox-indeterminate[_ngcontent-%COMP%]{background-color:#1a3763!important}"]
    }))();
  }
  return SavePdfComponent;
})();
/*
* Insert to the pdf file a header with filename, creator name, description etc.
* inputs:
* @pdf: pdf file; @pdfProps: pdf properties structure; @self: "this" of SavePdfComponent;
* @defaultStr: string to use when the fields are empty (when the model is not saved)
*/
function insertHeader(_x, _x2, _x3, _x4) {
  return _insertHeader.apply(this, arguments);
}
/*
* Insert to the pdf file table of contents.
* inputs:
* @pdf: pdf file; @pdfProps: pdf properties structure;
*/
function _insertHeader() {
  _insertHeader = (0, default)(function* (pdf, pdfProps, filename, self, defaultStr = "---") {
    let model = self.initRappidService.opmModel;
    let creationDate = defaultStr;
    let userName = defaultStr;
    let description = defaultStr;
    if (self.graphService.modelObject.modelData) {
      model = self.graphService.modelObject.modelData;
      if (model?.editBy && model.editBy.date && model.editBy.date !== "") {
        creationDate = typeof model.editBy.date === "number" ? formatDate(new Date(model.editBy.date)) : model.editBy.date;
        // const fullDate = model.editBy['date'].split('_');
        // const time = fullDate[1];
        // // .match() --> from regular expression: makes a list of all the accuracies according to the symbols inside parenthesis
        // const date = fullDate[0].match(/(\d+)/ig)[0]; // '/(\d+)/ig' --> choose sequences of digits: list of: [data, year]
        // const year = fullDate[0].match(/(\d+)/ig)[1];
        // const month = fullDate[0].match(/(\D+)/ig); // '/(\D+)/ig' --> choose sequences of all that is not a digit
        // creationDate = (date + ' ' + month + ' ' + year + ' ' + time);//date + ' ' + time;
      } else {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();
        creationDate = mm + "/" + dd + "/" + yyyy;
      }
      let per;
      if (self.graphService.modelObject.id) {
        per = yield self.storageService.getPermissions(self.graphService.modelObject.id);
      } else {
        per = {};
      }
      userName = self.groupsService.getUserById(per.ownerID)?.Name || "";
      // if user name is in hebrew use its email instead
      if (per.ownerID && userName.search(/[\u0590-\u05FF]/) >= 0 || userName === "") {
        userName = self.groupsService.getUserById(per.ownerID)?.Email || "";
      }
      description = model.description;
    }
    insertText("Last Edited:", pdf, pdfProps, true, "right");
    insertText(creationDate, pdf, pdfProps, true, "right", "italic");
    insertText(self.modelName, pdf, pdfProps, true, "center", "bold", 20);
    newLine(pdfProps);
    insertText("Created by: ", pdf, pdfProps);
    insertText(userName, pdf, pdfProps, false, "left", "italic");
    newLine(pdfProps);
    insertText("Description: ", pdf, pdfProps);
    insertText(description, pdf, pdfProps, true, "left", "italic");
    newLine(pdfProps);
    insertDividingLine(pdf, pdfProps, 2, "#1A3763");
    newLine(pdfProps);
  });
  return _insertHeader.apply(this, arguments);
}
function insertTableOfContents(pdf, pdfProps, includeDictionary, pdfNodes) {
  insertText("Table of contents", pdf, pdfProps, true, "center", "bold", 16);
  newLine(pdfProps);
  insertText("OPD Tree", pdf, pdfProps, true, "left", "bold", 12);
  newLine(pdfProps);
  insertText("DIAGRAMS & OPL", pdf, pdfProps, true, "left", "bold", 12);
  newLine(pdfProps);
  if (includeDictionary) {
    insertText("ELEMENTS DICTIONARY", pdf, pdfProps, true, "left", "bold", 12);
    insertText("Things", pdf, pdfProps, true, "left", "bold", 12, 1);
    insertText("Objects", pdf, pdfProps, true, "left", "normal", 12, 2);
    insertText("Processes", pdf, pdfProps, true, "left", "normal", 12, 2);
    insertText("Relations", pdf, pdfProps, true, "left", "bold", 12, 1);
    insertText("Procedural", pdf, pdfProps, true, "left", "normal", 12, 2);
    insertText("Fundamental", pdf, pdfProps, true, "left", "normal", 12, 2);
    newLine(pdfProps);
  }
  insertDividingLine(pdf, pdfProps, 2, "#1A3763");
  newLine(pdfProps);
  pdf.outline.add(pdfNodes, "Table of contents", {
    pageNumber: pdf.getCurrentPageInfo().pageNumber
  }); // Bookmark of the able of contents (firstpage)
}
function insertOpdTree(pdf, pdfProps, includeRequirementViews, pdfNodes, treeViewService) {
  const ret = new TreeParser(treeViewService).parse();
  const textToWrite = ret.map(item => "   ".repeat(item.depthAsNumber) + item.title);
  pdf.outline.add(pdfNodes, "OPD Tree", {
    pageNumber: pdf.getCurrentPageInfo().pageNumber
  }); // Bookmark of the OPD Tree view
  insertText("OPD Tree:", pdf, pdfProps, true, "center", "bold", 16);
  newLine(pdfProps);
  // pdf.splitTextToSize(textToWrite, pdfProps.maxLineWidth - pdfProps.tabLength);
  for (let i = 0; i < textToWrite.length; i++) {
    insertText(textToWrite[i], pdf, pdfProps, true, "left", "normal", 10, 1);
  }
  newLine(pdfProps);
}
/*
* Collect data of an object or a process, which will be shown in the end of the file
* inputs:
* @pdf: pdf file; @pdfProps: pdf properties structure; @self: "this" of SavePdfComponent;
* @entry: a single object or process entry from the model logical array.
* @thingType: string: 'Process' or 'Object' @thingArray: array to insert the collected data.
*/
function getThingData(pdf, pdfProps, self, entry, thingType, thingArray) {
  let thingMap = new Map(); // temporal map to hold the data of this element
  let thingName = entry.text.replace("\n", " "); //get the name of the current element
  if (entry.URLarray?.length > 0 && entry.URLarray[0].url !== "http://") {
    thingName += " (URLs: " + entry.URLarray.map(item => item.url).join(", ") + ")";
  }
  thingMap.set(thingType.concat(" Name: "), thingName);
  if (self.includeEntitiesDescription && entry.description?.trim() !== "") {
    const desc = entry.description;
    thingMap.set("Description: ", desc);
  }
  if (self.includeProcessComputational && thingType === "Process" && entry.insertedFunction !== "None" && entry.insertedFunction.functionInput) {
    // Currently supports only user defined, AI and python functions
    let func = entry.insertedFunction.functionInput.toString();
    if (entry.insertedFunction.functionInput.code) {
      // If its Python or AI code
      func = entry.insertedFunction.functionInput.code.toString();
    }
    thingMap.set("Process Computational Function: ", func);
  }
  if (entry.getBackgroundImageUrl() !== "" && entry.getBackgroundImageUrl() !== "assets/SVG/redx.png") {
    thingMap.set("Image URL: ", entry.getBackgroundImageUrl());
  }
  thingMap.set(thingType.concat(" Opds: "), Array()); // make array for all the opds in which the element exists
  // loop over the visual instances of the element in order to find all the OPDs in which this element exists
  for (let visual of entry.visualElements) {
    let opdName = self.initRappidService.opmModel.getOpdByThingId(visual.id);
    if (opdName) {
      thingMap.get(thingType.concat(" Opds: ")).push(opdName.getName());
    }
  }
  let states = entry.states; // list of the states of this logical element
  if (states && states.length > 0) {
    // write the "States:" section only if this element has states
    thingMap.set(thingType.concat(" States: "), Array()); // make array for all the states of the element
    for (let state of states) {
      let stateName = state._text;
      if (state.URLarray?.length > 0 && state.URLarray[0].url !== "http://") {
        stateName += " (URLs: " + state.URLarray.map(item => item.url).join(", ") + ")";
      }
      if (self.includeEntitiesDescription && state.description?.trim() !== "") {
        stateName += " (Description: " + state.description + ") ";
      }
      thingMap.get(thingType.concat(" States: ")).push(stateName);
    }
  }
  thingArray.push(thingMap); // push the element and its data to the general array.
}
/*
* Collect data of a procedural or fundamental relation, which will be shown in the end of the file
* inputs:
* @pdf: pdf file; @pdfProps: pdf properties structure; @self: "this" of SavePdfComponent;
* @entry: a single relation entry from the model logical array.
* @relationMap: map to insert the collected data, divided according to the relation sub-type.
*/
function getRelationData(pdf, pdfProps, self, entry, relationMap) {
  let linkArray = Array(); // temporal Array to hold the data of this element
  let sourceObjectName = entry.sourceLogicalElement.text.replace("\n", " ");
  linkArray.push(sourceObjectName); // insert source elements name
  let targetArray = Array(); //make Array to hold all the target elements.
  for (let target of entry.targetLogicalElements) {
    if (target) {
      // check that the target really exist, because of a known bug it sometimes has "null" in the array
      targetArray.push(target.text.replace("\n", " "));
    }
  }
  linkArray.push(targetArray);
  let linkName = linkType[entry.linkType];
  if (!relationMap.has(linkName)) {
    //check if this kind of link already exists in the map or not.
    relationMap.set(linkName, Array()); //if not, create a key for this link
  }
  relationMap.get(linkName).push(linkArray);
}
/*
* Insert to the pdf file the data (in a table-like structure) of an object or a process.
* inputs:
* @pdf: pdf file; @pdfProps: pdf properties structure; @self: "this" of SavePdfComponent;
* @thingType: string: 'Process' or 'Object' @thingArray: array which holds the collected data.
* @thingColor: the color (in hex) used for the process or the object. (As defined in opcloud).
*/
function insertThingData(pdf, pdfProps, self, thingType, thingArray, thingColor) {
  // entry: a map which has keys: thingType+Name, thingType+Opds, thingType+States
  for (let entry of thingArray) {
    newLine(pdfProps);
    insertText(thingType.concat(" Name: "), pdf, pdfProps);
    pdf.setTextColor(thingColor);
    let nameText = entry.get(thingType.concat(" Name: "));
    let urlsText;
    if (nameText.includes(" (URLs: ")) {
      const splited = nameText.split(" (URLs: ");
      nameText = splited[0];
      urlsText = " (URLs: " + splited[1];
    }
    insertText(nameText, pdf, pdfProps, false);
    pdf.setTextColor("#000000");
    if (urlsText) {
      insertText(urlsText, pdf, pdfProps, true);
    }
    if (entry.has("Description: ")) {
      const desc = entry.get("Description: ");
      const decodedDesc = decodeHtmlEntities(desc);
      insertText(" Description: " + decodedDesc, pdf, pdfProps, true, "left", "normal", 12, 2);
    }
    if (entry.has("Process Computational Function: ")) {
      const func = entry.get("Process Computational Function: ");
      insertText("Process Computational Function: \n" + func, pdf, pdfProps, true, "left", "normal", 12, 2);
    }
    if (entry.has("Image URL: ")) {
      const url = entry.get("Image URL: ");
      insertText(" Image URL: ", pdf, pdfProps, true, "left", "normal", 12, 2);
      pdf.setTextColor("#0011ff");
      insertText("  " + url, pdf, pdfProps, true, "left", "normal", 12, 2);
      pdf.setTextColor("#000000");
    }
    insertText(thingType.concat(" Opds: "), pdf, pdfProps, true, "left", "normal", 12, 2);
    // entry[ thingType + Opds ] is an array of opd names
    for (let opd of entry.get(thingType.concat(" Opds: "))) {
      insertText(opd, pdf, pdfProps, true, "left", "italic", 12, 4);
    }
    if (entry.has(thingType.concat(" States: "))) {
      // entry[ thingType + States ] is an array of state names
      insertText(thingType.concat(" States: "), pdf, pdfProps, true, "left", "normal", 12, 2);
      for (let state of entry.get(thingType.concat(" States: "))) {
        pdf.setTextColor("#808000");
        let stateNameText = state;
        let stateUrlsText;
        let stateDescription;
        if (stateNameText.includes(" (Description:") && !stateNameText.includes(" (URLs: ")) {
          const splited = stateNameText.split(" (Description:");
          stateNameText = splited[0];
          stateDescription = " (Description:" + splited[1];
        }
        if (stateNameText.includes(" (URLs: ")) {
          const splited = stateNameText.split(" (URLs: ");
          stateNameText = splited[0];
          stateUrlsText = " (URLs: " + splited[1];
        }
        insertText(stateNameText, pdf, pdfProps, true, "left", "italic", 12, 4);
        pdf.setTextColor("#000000");
        if (stateUrlsText) {
          insertText(stateUrlsText, pdf, pdfProps, true, "left", "italic", 12, 4);
        }
        if (stateDescription) {
          insertText(stateDescription, pdf, pdfProps, true, "left", "italic", 12, 4);
        }
      }
      pdf.setTextColor("#000000");
    }
  }
}
/*
* Insert to the pdf file the data (in a table-like structure) of procedural or fundamental relation.
* inputs:
* @pdf: pdf file; @pdfProps: pdf properties structure; @self: "this" of SavePdfComponent;
* @relationMap: map which holds the collected data, divided according to the relation sub-type.
*/
function insertRelationData(pdf, pdfProps, self, relationMap) {
  // relations = { 0: relation sub-type like 'Agent', 'Aggregation' etc ; 1: array of links}
  for (let relations of Array.from(relationMap.entries())) {
    newLine(pdfProps);
    insertText(relations[0], pdf, pdfProps);
    // link = { 0: source element name ; 1: target elements names array}
    for (let link of relations[1]) {
      newLine(pdfProps);
      insertText("Source Name: ", pdf, pdfProps, true, "left", "normal", 12, 2);
      insertText(link[0], pdf, pdfProps, false, "left", "italic");
      insertText("Target(s) Name: ", pdf, pdfProps, true, "left", "normal", 12, 2);
      // link[1]: array of target elements names
      for (let target of link[1]) {
        insertText(target.concat(" "), pdf, pdfProps, false, "left", "italic");
      }
    }
  }
}
/*
* Loop over all the logicalElements of the model and write the information divided to sections.
* inputs:
* @pdf: pdf file; @pdfProps: pdf properties structure;  @self:  "this" of SavePdfComponent;
*/
function insertElementsDictionary(pdf, pdfProps, self, pdfNodes) {
  pdf.outline.add(pdfNodes, "Elements Dictionary", {
    pageNumber: pdf.getCurrentPageInfo().pageNumber
  }); // Bookmark of the Elements Dictionary
  insertText("ELEMENTS DICTIONARY", pdf, pdfProps, true, "center", "bold", 16);
  newLine(pdfProps);
  let logicArray = self.initRappidService.opmModel.logicalElements;
  let objectsArray = Array();
  let processesArray = Array();
  let proceduralMap = new Map();
  let fundamentalMap = new Map();
  let taggedMap = new Map();
  // loop over all the logical elements array and write element to the relevant array/map with its data.
  for (let entry of logicArray) {
    if (entry.name == "OpmLogicalObject") {
      getThingData(pdf, pdfProps, self, entry, "Object", objectsArray);
    } else if (entry.name == "OpmLogicalProcess") {
      getThingData(pdf, pdfProps, self, entry, "Process", processesArray);
    } else if (entry.name == "OpmProceduralRelation") {
      getRelationData(pdf, pdfProps, self, entry, proceduralMap);
    } else if (entry.name == "OpmFundamentalRelation") {
      getRelationData(pdf, pdfProps, self, entry, fundamentalMap);
    } else if (entry.name == "OpmTaggedRelation") {
      getRelationData(pdf, pdfProps, self, entry, taggedMap);
    }
  }
  insertText("Things", pdf, pdfProps, true, "left", "bold", 14);
  newLine(pdfProps);
  insertText("Objects:", pdf, pdfProps, true, "left", "bold");
  insertThingData(pdf, pdfProps, self, "Object", objectsArray, "#00b050");
  newLine(pdfProps);
  insertText("Processes:", pdf, pdfProps, true, "left", "bold");
  insertThingData(pdf, pdfProps, self, "Process", processesArray, "#0070c0");
  newLine(pdfProps);
  insertText("Relations", pdf, pdfProps, true, "left", "bold", 14);
  newLine(pdfProps);
  insertText("Procedural Relations:", pdf, pdfProps, true, "left", "bold");
  insertRelationData(pdf, pdfProps, self, proceduralMap);
  newLine(pdfProps);
  insertText("Fundamental Relations:", pdf, pdfProps, true, "left", "bold");
  insertRelationData(pdf, pdfProps, self, fundamentalMap);
  newLine(pdfProps);
  insertText("Tagged Relations:", pdf, pdfProps, true, "left", "bold");
  insertRelationData(pdf, pdfProps, self, taggedMap);
  newLine(pdfProps);
  insertDividingLine(pdf, pdfProps, 2, "#1A3763");
  newLine(pdfProps);
}
/*
* This creates an struct which will consists all the needed recurring properties for the pdf document.
* Note that a pdf file does not have "built-in" lines. In order to insert a word, text, line or any object, one needs
* to give the "x and y coordinates" of the location in the page. Also the pdf object, doesn't "know" where in the page
* there is content or where there is empty place. The user needs to keep track of all the information.
* inputs:
* @pdf: pdf file;
* @leftMargin: the size (in point-units) of the space between the left edge of the paper and the beginning of content;
* @topMargin: the size (in point-units) of the space between the upper edge of the paper and the beginning of first line;
* output: pdf properties struct
*/
function createDocumentProperties(pdf, leftMargin, topMargin) {
  let pdfProps = {
    verticalMargin: 0,
    horizontalMargin: 0,
    leftOffset: 0,
    topOffset: 0,
    lineHeight: 0,
    pageHeight: 0,
    pageWidth: 0,
    maxLineWidth: 0,
    maxLineHeight: 0,
    tabLength: 0
  };
  pdf.setFontSize(12); // default font size
  pdfProps.verticalMargin = leftMargin;
  pdfProps.horizontalMargin = topMargin;
  pdfProps.leftOffset = leftMargin; // this will be the counter for vertical (or "x") coordinate
  pdfProps.topOffset = topMargin; // this will be the counter for horizontal (or "y") coordinate
  pdfProps.pageHeight = 841.89; // the size for A4 page
  pdfProps.pageWidth = 595.28; // the size for A4 page
  pdfProps.lineHeight = pdf.getLineHeightFactor() * pdf.getFontSize(); // the height of a text line.
  pdfProps.maxLineHeight = pdfProps.pageHeight - pdfProps.horizontalMargin * 2; // maximum possible height of content
  pdfProps.maxLineWidth = pdfProps.pageWidth - pdfProps.verticalMargin * 2; // maximum possible width of content
  pdfProps.tabLength = pdf.getTextWidth("    "); // the size of a tab (4 spaces) for indenting a text/paragraph
  return pdfProps;
}
/*
* Check if the content fits in the page horizontally in the blank space which is still left in the current page.
* This takes in count the content that is already written in the file ( with the horizontal counter: topOffset)
* inputs:
* @pdf: pdf file; @pdfProps: pdf properties structure;
* @elementHeight: the horizontal size (height) of the element we want to insert.
* output: True if the content has enough place to be inserted, false if not.
*/
function fitsHorizontally(pdf, pdfProps, elementHeight) {
  return pdfProps.pageHeight - pdfProps.horizontalMargin - pdfProps.lineHeight - pdfProps.topOffset - elementHeight >= 0;
}
/*
* Check if the content fits in the page (in the line) vertically in the blank space which is still left in the page.
* This takes in count the content that is already written in the file ( with the vertical counter: leftOffset)
* inputs:
* @pdf: pdf file; @pdfProps: pdf properties structure;
* @elementWidth: the vertical size (width) of the element we want to insert.
* output: True if the content has enough place to be inserted, false if not.
*/
function fitsVertically(pdf, pdfProps, elementWidth) {
  return pdfProps.pageWidth - pdfProps.verticalMargin - pdfProps.leftOffset - elementWidth >= 0;
}
/*
* Insert a new blank line in to the file. Same as pressing enter in Word document.
* In practise, this does not really "write" a blank page but instead moves the horizontal counter (topOffset) down
* according to the height of a text line and nullifies the vertical counter (leftOffset).
* inputs:
* @pdfProps: pdf properties structure;
*/
function newLine(pdfProps) {
  pdfProps.topOffset += pdfProps.lineHeight; // move the horizontal counter down by one line
  pdfProps.leftOffset = pdfProps.verticalMargin; // nullify vertical counter
}
/*
* Insert a new blank page to the pdf file. Also remember to nullify the horizontal counter.
* From now on the "focus" of the pdf object will be on this page and all the elements will be inserted to this page.
* inputs:
* @pdf: pdf file; @pdfProps: pdf properties structure;
*/
function newPage(pdf, pdfProps) {
  pdf.addPage(); // add a new blank page to the pdf file
  pdfProps.topOffset = pdfProps.horizontalMargin; // nullify horizontal margin
}
/*
* Insert a stripe/line "drawing" to the page. Usually used to divide between sections in the page.
* inputs:
* @pdf: pdf file; @pdfProps: pdf properties structure; @lineWidth: the width of the drawing in points unit.
* @color: the color of the line, default: black
*/
function insertDividingLine(pdf, pdfProps, lineWidth = 0.5, color = "#000000") {
  pdf.setLineWidth(lineWidth);
  pdf.setDrawColor(color); // 1A3763
  // if the line is going to be very close to a page break (inside the margin), don't insert it.
  if (pdfProps.topOffset + pdfProps.lineHeight < pdfProps.pageHeight - pdfProps.horizontalMargin * 2) {
    pdf.line(pdfProps.verticalMargin, pdfProps.topOffset + pdfProps.lineHeight, pdfProps.pageWidth - pdfProps.verticalMargin, pdfProps.topOffset + pdfProps.lineHeight);
  }
}
/*
* Wrapping function to insert text to the page. This function takes care of different situations and parameters as
* will be described inside the function.
* inputs:
* @rawText: string of text to be inserted; @pdf: pdf file; @pdfProps: pdf properties structure;
* @textInNewLine: boolean, true if the text should start in a new line, false if it should continue in the current line.
* @textAlignment: left/middle/right. note only in case of 'left', can continue the last line, otherwise has to start in a new line.
* @textFontStyle: normal/bold/italic etc. --> for all the options: console.log(pdf.getFontList());
* @fontSize: size of the font --> same as in word document
* @indentTextFactor: amount of (empty space) tabs to insert before the text. (no effect if alignment is middle)
*/
// Decode basic HTML entities that might appear in text (e.g. descriptions)
function decodeHtmlEntities(text) {
  if (!text) {
    return text;
  }
  return text.replace(/&apos;/g, "'").replace(/&quot;/g, "\"").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
// Helper function to convert Unicode characters to PDF-safe equivalents
// jsPDF's default fonts don't support many Unicode characters, so we need to convert them
function normalizeTextForPdf(text) {
  if (!text) {
    return text;
  }
  // Convert common Unicode superscripts and special characters to plain text equivalents
  // This ensures jsPDF can render them correctly
  const unicodeMap = {
    "⁺": "+",
    // Superscript plus
    "⁻": "-",
    // Superscript minus
    "²": "2",
    // Superscript 2
    "³": "3",
    // Superscript 3
    "¹": "1",
    // Superscript 1
    "⁰": "0",
    // Superscript 0
    "⁴": "4",
    // Superscript 4
    "⁵": "5",
    // Superscript 5
    "⁶": "6",
    // Superscript 6
    "⁷": "7",
    // Superscript 7
    "⁸": "8",
    // Superscript 8
    "⁹": "9",
    // Superscript 9
    "₊": "+",
    // Subscript plus
    "₋": "-",
    // Subscript minus
    "₂": "2",
    // Subscript 2
    "₃": "3",
    // Subscript 3
    "₁": "1",
    // Subscript 1
    "₀": "0",
    // Subscript 0
    "·": ".",
    // Middle dot
    "×": "x",
    // Multiplication sign
    "÷": "/",
    // Division sign
    "±": "+/-",
    // Plus-minus
    "≈": "~",
    // Approximately equal
    "≤": "<=",
    // Less than or equal
    "≥": ">=",
    // Greater than or equal
    "≠": "!=",
    // Not equal
    "°": "deg",
    // Degree symbol
    α: "alpha",
    β: "beta",
    γ: "gamma",
    δ: "delta",
    ε: "epsilon",
    θ: "theta",
    λ: "lambda",
    μ: "mu",
    π: "pi",
    σ: "sigma",
    τ: "tau",
    φ: "phi",
    ω: "omega",
    Δ: "Delta",
    Ω: "Omega",
    "∑": "sum",
    "∏": "prod",
    "∫": "integral",
    "√": "sqrt",
    "∞": "infinity",
    "→": "->",
    "←": "<-",
    "↔": "<->",
    "⇒": "=>",
    "⇐": "<=",
    "⇔": "<=>",
    // Common symbols / emoji-like characters used in descriptions
    "⚡": "[fast]",
    // Lightning bolt
    "✅": "[ok]",
    // Check mark button
    "✔": "[ok]",
    // Heavy check mark
    "✳": "*",
    // Eight-spoked asterisk
    "✴": "*",
    // Eight-pointed star
    "•": "*" // Bullet
  };
  try {
    // Normalize to NFC form first
    text = text.normalize("NFC");
    // Replace Unicode characters with their plain text equivalents
    let result = text;
    for (const [unicode, replacement] of Object.entries(unicodeMap)) {
      result = result.replace(new RegExp(unicode, "g"), replacement);
    }
    // Also handle any remaining problematic Unicode characters
    // Convert other superscripts/subscripts using a more general approach
    // Handle superscript range (U+2070 to U+209F)
    result = result.replace(/[\u2070-\u209F]/g, char => {
      // Superscript range - convert to regular numbers/letters
      const code = char.charCodeAt(0);
      if (code >= 8304 && code <= 8313) {
        // Superscript digits ⁰-⁹ -> 0-9
        return String.fromCharCode(48 + (code - 8304));
      } else if (code === 8314) {
        return "+"; // Superscript plus ⁺
      } else if (code === 8315) {
        return "-"; // Superscript minus ⁻
      } else if (code === 8317) {
        return "("; // Superscript left parenthesis
      } else if (code === 8318) {
        return ")"; // Superscript right parenthesis
      } else if (code === 8305) {
        return "i"; // Superscript i
      } else if (code === 8319) {
        return "n"; // Superscript n
      } else if (code >= 8305 && code <= 8319) {
        // Other superscripts - try to find a reasonable replacement
        return unicodeMap[char] || "+"; // Default to + if unknown
      }
      return char;
    });
    // Handle subscript range (U+2080 to U+209F)
    result = result.replace(/[\u2080-\u209F]/g, char => {
      const code = char.charCodeAt(0);
      if (code >= 8320 && code <= 8329) {
        // Subscript digits ₀-₉ -> 0-9
        return String.fromCharCode(48 + (code - 8320));
      } else if (code === 8330) {
        return "+"; // Subscript plus ₊
      } else if (code === 8331) {
        return "-"; // Subscript minus ₋
      } else if (code === 8333) {
        return "("; // Subscript left parenthesis
      } else if (code === 8334) {
        return ")";
      } // Subscript right parenthesis
      return unicodeMap[char] || "+"; // Default to + if unknown
    });
    // Handle any other problematic Unicode characters that might cause spacing issues
    // Remove zero-width characters and other invisible Unicode that might cause issues
    result = result.replace(/[\u200B-\u200D\uFEFF]/g, ""); // Zero-width spaces, joiners, BOM
    // Remove or neutralize characters that are likely unsupported emoji or surrogate halves
    // Many emojis are represented as surrogate pairs; if the font doesn't support them,
    // jsPDF may render them as � characters. We strip surrogate code units and replacement chars.
    result = result.replace(/[\uD800-\uDFFF]/g, ""); // Remove lone surrogate halves
    result = result.replace(/\uFFFD/g, ""); // Remove replacement character "�"
    return result;
  } catch (e) {
    // If conversion fails, return original text
    return text;
  }
}
// Helper function to split text while preserving Unicode characters
// jsPDF's splitTextToSize can break Unicode characters, so we need a more careful approach
// IMPORTANT: This function should receive text that has already been normalized by normalizeTextForPdf
function splitTextPreservingUnicode(pdf, text, maxWidth) {
  // Always use manual splitting for better control and to avoid jsPDF's Unicode issues
  // jsPDF's splitTextToSize has known issues with Unicode characters and can break them
  // Manual splitting preserves text integrity
  // Manual splitting that preserves Unicode characters
  // Split by word boundaries and reconstruct lines
  const words = [];
  const wordRegex = /(\S+|\s+)/g;
  let match;
  while ((match = wordRegex.exec(text)) !== null) {
    words.push(match[0]);
  }
  const lines = [];
  let currentLine = "";
  for (const word of words) {
    const testLine = currentLine + word;
    let testWidth;
    try {
      // Get text width - but be careful with Unicode
      // If text has been normalized, getTextWidth should work, but we'll validate
      testWidth = pdf.getTextWidth(testLine);
      // Validate the width - if it seems too small, it might be a measurement issue
      // Use a more conservative estimate for width validation
      const minEstimate = testLine.length * pdf.getFontSize() * 0.25;
      if (testWidth < minEstimate && testLine.length > 0) {
        // Width seems incorrect, use estimate based on character count
        // Average character width is roughly 0.6 * font size for most fonts
        testWidth = testLine.length * pdf.getFontSize() * 0.6;
      }
    } catch (e) {
      // If getTextWidth fails, estimate based on character count
      testWidth = testLine.length * pdf.getFontSize() * 0.6; // Rough estimate
    }
    if (testWidth <= maxWidth || currentLine === "") {
      currentLine = testLine;
    } else {
      if (currentLine.trim()) {
        lines.push(currentLine.trimEnd());
      }
      currentLine = word;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine.trimEnd());
  }
  if (lines.length > 0) {
    return lines;
  } else {
    return [text];
  }
}
function insertText(rawText, pdf, pdfProps, textInNewLine = true, textAlignment = "left", textFontStyle = "normal", fontSize = 12, indentTextFactor = 0) {
  // Decode any HTML entities and normalize text for PDF compatibility
  rawText = normalizeTextForPdf(decodeHtmlEntities(rawText));
  // Set text size (like in word document, for example 12/14/36 etc)
  pdf.setFontSize(fontSize);
  // set text font ('normal' / 'bold' etc)
  pdf.setFont(undefined, textFontStyle);
  // For long text, split to multiple lines in the correct width of the page.
  // Use our Unicode-preserving split function
  const maxWidth = pdfProps.maxLineWidth - indentTextFactor * pdfProps.tabLength;
  const lines = splitTextPreservingUnicode(pdf, rawText, maxWidth);
  // Calculate text width - handle potential Unicode issues
  let textWidth;
  try {
    textWidth = pdf.getTextWidth(lines[lines.length - 1]);
    // If width seems incorrect (too small for the text), use a fallback calculation
    if (textWidth < lines[lines.length - 1].length * fontSize * 0.1) {
      // Fallback: estimate width based on character count
      textWidth = lines[lines.length - 1].length * fontSize * 0.6;
    }
  } catch (e) {
    // Fallback if getTextWidth fails
    textWidth = lines[lines.length - 1].length * fontSize * 0.6;
  }
  pdfProps.lineHeight = pdf.getLineHeightFactor() * pdf.getFontSize(); //set the line height according to current font
  // Move to new line if:
  // (1)textInNewLine == true  (2)text is too long for the current line
  // (3)text is more then one line (4) alignment is not left
  if (textInNewLine || lines.length == 1 && !fitsVertically(pdf, pdfProps, textWidth) || lines.length > 1 || textAlignment != "left") {
    if (lines.length == 1) {
      // if the text starts with 'space-character' delete it. (New line should not start with a space)
      if (lines[0].charAt(0) == " ") {
        lines[0] = lines[0].substr(1);
      }
    }
    newLine(pdfProps);
  }
  // Check if current pdf page is too full to add the new text. If yes, add new page.
  if (!fitsHorizontally(pdf, pdfProps, pdfProps.lineHeight * lines.length)) {
    newPage(pdf, pdfProps);
  }
  // Find suitable coordinates according to the alignment
  let x = pdfProps.leftOffset;
  let y = pdfProps.topOffset + pdfProps.lineHeight;
  switch (textAlignment) {
    case "left":
      // consider tab indent
      pdfProps.leftOffset += indentTextFactor * pdfProps.tabLength;
      x = pdfProps.leftOffset;
      break;
    case "center":
      x = pdfProps.pageWidth / 2;
      break;
    case "right":
      // consider tab indent
      x = pdfProps.pageWidth - pdfProps.verticalMargin - indentTextFactor * pdfProps.tabLength;
  }
  // Write text to pdf file.
  // Ensure all lines are normalized (in case any Unicode slipped through)
  const normalizedLines = lines.map(line => normalizeTextForPdf(line));
  pdf.text(normalizedLines, x, y, textAlignment);
  // Update position count from the top and the left of the page.
  if (lines.length > 1) {
    // if the text has multiple lines
    pdfProps.leftOffset = textWidth; // vertical counter should be where the last line stopped
    pdfProps.topOffset += pdfProps.lineHeight * lines.length; // add the amount of lines to horizontal counter
  } else {
    pdfProps.leftOffset += textWidth; // add text width to vertical counter
    // note: don't add "line" to horizontal counter, only this way it is possible to write to the same line afterwards.
  }
}
/*
* Insert the opls of current opd
* inputs:
* @pdf: pdf file; @pdfProps: pdf properties structure; @opd: the current opd from which to take the opls
* @self: "this" of SavePdfComponent;
*/
function insertOpls(_x5, _x6, _x7, _x8) {
  return _insertOpls.apply(this, arguments);
}
/*
* Wrapper recursive function for collecting all the data. There exist some built in a-synchronic functions, which need
* to be called recursively in order to assure all the data will be inserted one after the other in the correct order,
* inputs:
* @treeLevel: the current level in the opm model from which the data is taken in this recursive instance.
* @pdf: pdf file; @pdfProps: pdf properties structure; @fileName: Name of the file that will be saved in the end.
* @self: "this" of SavePdfComponent;
* output: (if reached to the last level / met the end condition)
* pdf file with all the data.
*/
function _insertOpls() {
  _insertOpls = (0, default)(function* (pdf, pdfProps, opd, self) {
    self.graphService.renderGraph(opd, self.initRappidService); // render this opd to get the opls
    const parser = new DOMParser(); // use this to parse the html string and find the element type: object/process/state
    const opls = self.initRappidService.oplService.generateOpl();
    for (let j = 0; j < opls.length; j++) {
      // loop over the opl sentences
      if (opls[j].opl) {
        newLine(pdfProps); // insert a new line to the file (same as pressing enter in word document)
        let innerHTML = "";
        if (self.numberedOPL) {
          innerHTML = String(j + 1) + ". " + opls[j].opl; // get the html of this opl sentence
        } else {
          innerHTML = opls[j].opl;
        }
        while (innerHTML.includes("\n")) {
          innerHTML = innerHTML.indexOf("\n") === innerHTML.length - 1 ? innerHTML.replace("\n", "") : innerHTML.replace("\n", " ");
        }
        const htmlDoc = parser.parseFromString(innerHTML, "text/html").activeElement;
        // Check for parsing errors - if HTML is malformed, parser might create error elements
        const parserError = htmlDoc.querySelector("parsererror");
        if (parserError) {
          // If parsing failed, try to extract text directly by removing HTML tags
          const textOnly = innerHTML.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'");
          pdf.setTextColor("#000000");
          insertText(textOnly, pdf, pdfProps, false);
          continue;
        }
        // loop over different parts (nodes) inside this sentence. Each node can be a regular text or OPM element.
        // Need to get suitable color for each element.
        for (let k = 0; k < htmlDoc.childNodes.length; k++) {
          let node = htmlDoc.childNodes[k];
          if (node.nodeType == Node.ELEMENT_NODE && node.attributes.length > 0) {
            for (let attr_index = 0; attr_index < node.attributes.length; attr_index++) {
              // assuming that each node will have only once the match of (attr.name == 'class') and also
              // attr.value in [object,process,state]
              let attr = node.attributes[attr_index];
              if (attr.name == "class") {
                // set text color according to element type
                // note: don't set default value here! It will override the element color.
                switch (attr.value) {
                  case "object":
                    {
                      pdf.setTextColor("#00b050");
                      break;
                    }
                  case "process":
                    {
                      pdf.setTextColor("#0070c0");
                      break;
                    }
                  case "state":
                    {
                      pdf.setTextColor("#808000");
                      break;
                    }
                }
              } else if (attr.name === "color") {
                pdf.setTextColor(attr.value);
              }
            }
          } else {
            pdf.setTextColor("#000000");
          }
          // Extract text content - use textContent which preserves Unicode characters
          // For text nodes, use nodeValue; for element nodes, use textContent
          let textContent = "";
          if (node.nodeType === Node.TEXT_NODE) {
            textContent = node.nodeValue || "";
          } else {
            textContent = node.textContent || "";
          }
          // Only insert if there's actual text content (not just whitespace)
          if (textContent.trim() || textContent.length > 0) {
            insertText(textContent, pdf, pdfProps, false);
          }
        }
      }
    }
  });
  return _insertOpls.apply(this, arguments);
}
function collectDataWrapper(treeLevel, pdf, pdfProps, fileName, self, pdfNodes) {
  newLine(pdfProps);
  let opd = self.opdsOrder[treeLevel]; // get the opd from which the data will be taken currently
  const precents = String(Math.floor(treeLevel / self.opdsOrder.length * 100)) + "%";
  if ($("#spinnerValue").length > 0) {
    $("#spinnerValue")[0].textContent = precents;
  }
  let treeLength = self.opdsOrder.length; // total model length
  self.graphService.renderGraph(opd, self.initRappidService); // render this opd to get the data
  const paper = self.initRappidService.paper; // get the current 'paper' which consists all the elements
  if (self.showTooltips) {
    for (const proc of self.graphService.graph.getCells().filter(c => OPCloudUtils.isInstanceOfDrawnProcess(c))) {
      proc.showDummyTooltip();
    }
  }
  let imageRes = 3; // Defualt OPD image resolution is 3 if not selected by modeler
  if (self.resolutionCheck) {
    imageRes = self.resolutionOPDs;
  }
  // @imageData is uri string of the image, created by  'toJPEG' function
  paper.toJPEG(function collectData(imageData) {
    $(".dummyTooltip").remove();
    let opdName = opd.getName(); // Get the name of the OPD.
    if (opd.isStereotypeOpd()) {
      opdName = "Stereotype: " + self.initRappidService.opmModel.stereotypes.getStereoTypes().find(s => s.opd === opd).name;
    } else if (opd.requirementViewOf) {
      opdName = opd.name;
    } else {
      const sdNumber = opd.getNumberedName();
      if (sdNumber !== "SD") {
        opdName = sdNumber + ": " + opdName;
      }
    }
    pdf.outline.add(pdfNodes, opdName, {
      pageNumber: pdf.getCurrentPageInfo().pageNumber
    }); // Bookmark of the OPD
    insertImageAndName(pdf, pdfProps, imageData, opdName); //insert image to the pdf and opd name
    insertOpls(pdf, pdfProps, opd, self);
    newLine(pdfProps);
    insertDividingLine(pdf, pdfProps);
    treeLevel += 1; // go to the next "level" in the opm-model-tree
    if (treeLevel < treeLength) {
      // continue recursively until going over all the model opds
      collectDataWrapper(treeLevel, pdf, pdfProps, fileName, self, pdfNodes);
      newPage(pdf, pdfProps);
    } else {
      // if finished with the final opd, continue to next sections, and save the file in the end.
      insertDividingLine(pdf, pdfProps, 2, "#1A3763");
      newLine(pdfProps);
      // call 'insertElementsDictionary' function from here to assure it will be inserted
      // only after the OPDs & OPL are inserted. Only if selected by the modeler.
      if (self.includeDictionary) {
        newPage(pdf, pdfProps);
        insertElementsDictionary(pdf, pdfProps, self, pdfNodes);
      }
      if (self.confidentialWatermark) {
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.addImage(getConfidentialImage(), "JPEG", pdf.internal.pageSize.width / 2 - 42, pdf.internal.pageSize.height - 35, 83, 26, 0.2);
        }
      }
      try {
        pdf.save(fileName); // downloads the pdf file
      } catch (err) {
        (0, validationAlert)("An error has occurred during the export. It seems that the resolution is too high. Please try again with lower resolution.", 8000, "Error");
        self.dialogRef.close();
      }
      self.initRappidService.currentlyExportingPdf = false;
      self.graphService.renderGraph(self.originalOpd, self.initRappidService); // Goes back to the OPD that the user is editing.
      // Also possible to open a new tab with the pdf file, instead of directly downloading it.
      // For new tab opening use code: pdf.output('dataurlnewwindow'); instead of pdf.save(fileName);
      self.dialogRef.close(); // Close the dialog pop up window when finished.
    }
  }, {
    padding: 20,
    // make white borders to the image
    useComputedStyles: false,
    size: imageRes + "x",
    quality: 1
  });
}
function getConfidentialImage() {
  return "data:image/jpeg;base64,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";
}
/*
* This function handles image insertion. Fitting the image while considering width/length and so on.
* Note: the OPD name is written here to assure the name and the image itself will be in the same page, one after the other.
* inputs:
* @pdf: pdf file; @pdfProps: pdf properties structure; @imageData: uri string of the image
* @opdName: name of the relevant opd
*/
function insertImageAndName(pdf, pdfProps, imageData, opdName) {
  const imgProps = pdf.getImageProperties(imageData); // properties of the image
  let divider = 1.6; // The created size of the image is usually too big.
  // This was found as most suitable amount to divide with, after checking different possibilities.
  // check if the image fits to the page. If not, find proportional divider.
  if (imgProps.height > pdfProps.maxLineHeight || imgProps.width > pdfProps.maxLineWidth) {
    divider = Math.max(imgProps.height / pdfProps.maxLineHeight, imgProps.width / pdfProps.maxLineWidth, divider);
  }
  const imgHeight = imgProps.height / divider;
  const imgWidth = imgProps.width / divider;
  // if the image doesn't fit to the page, go to new page.
  if (!fitsHorizontally(pdf, pdfProps, imgHeight + pdfProps.lineHeight)) {
    newPage(pdf, pdfProps);
  }
  // insert the name of the opd just before the image
  insertText(opdName, pdf, pdfProps, true, "left", "bold");
  // get left offset ("x" coordinate) to position the image in the center.
  const imageLeftOffset = Math.max((pdfProps.maxLineWidth - imgWidth) / 2, pdfProps.verticalMargin);
  // insert the image to the pdf
  pdf.addImage(imageData, "JPEG", imageLeftOffset, pdfProps.topOffset + pdfProps.lineHeight * 2, imgWidth, imgHeight);
  pdfProps.topOffset += imgHeight + pdfProps.lineHeight; // add to horizontal counter the size of the image
  newLine(pdfProps); // add blank lne after the image
}