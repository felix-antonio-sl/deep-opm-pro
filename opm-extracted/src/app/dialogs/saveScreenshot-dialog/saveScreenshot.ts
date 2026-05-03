// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/saveScreenshot-dialog/saveScreenshot.ts
// Extracted by opm-extracted/tools/extract.mjs

function SaveScreenshotComponent_span_30_Template(rf, ctx) {
  if (rf & 1) {
    core /* ɵɵelementStart */.j41(0, "span", 21);
    core /* ɵɵtext */.EFF(1, "*When exporting OPDs that contains things with background images use the SVG option.");
    core /* ɵɵelementEnd */.k0s();
  }
}
/*
* This Component enables to save screenshots of the OPD model as jpeg files.
* inputs: open OPM model in the web
* output: jpeg files of requested OPDs
*/
let SaveScreenshotComponent = /*#__PURE__*/(() => {
  class SaveScreenshotComponent {
    constructor(dialogRef, graphService, initRappidService) {
      this.dialogRef = dialogRef;
      this.graphService = graphService;
      this.initRappidService = initRappidService;
      this.includeTooltips = false;
      this.format = "jpeg";
      this.shouldShowMessageAboutBackgroundImages = !!this.initRappidService.opmModel.getAllLogicalThings().find(l => l.getBackgroundImageUrl()?.length);
    }
    /*
    * This is the main function of screenshot saving.
    * It checks which OPDs to capture, and then calls to 'createJpegAndDownload' function for each.
    * Inputs: fileName = user input or default, saveOption: {'Current' , 'SD', 'Tree'} according to user's choice
    * Output(s): jpeg file(s)
    */
    screenshotMain(fileName, saveOption, resolution, includeTooltips, includeSubModels = false) {
      var _this = this;
      return (0, default)(function* () {
        _this.includeTooltips = includeTooltips;
        if (fileName === "download" || fileName === "") {
          // if no user input
          fileName = _this.initRappidService.opmModel.getOpd("SD").getDefaultName();
        }
        if (saveOption === "Current") {
          _this.createImageAndDownload(fileName, resolution);
        } else {
          // SD 0 or Tree
          const currentOpd = _this.initRappidService.opmModel.currentOpd; // save current open OPD to render after the process has finished
          if (includeSubModels) {
            yield _this.initRappidService.opdHierarchyRef.loadAllSubModels();
          }
          const tree = _this.initRappidService.opmModel.opds.filter(o => !o.isHidden);
          let length = tree.length;
          if (saveOption === "SD") {
            // to save only SD-0 the loop should finish after first OPD in the tree
            length = 1;
          }
          for (let i = 0; i < length; i++) {
            if (tree[i].sharedOpdWithSubModelId && tree[i].visualElements.length === 0) {
              continue;
            }
            _this.graphService.renderGraph(tree[i], _this.initRappidService); // Goes to the next OPD in the tree
            const nameOfOpd = tree[i].getNumberedName() + " " + tree[i].name; // Get the name of the OPD.
            _this.createImageAndDownload(fileName + " - " + nameOfOpd, resolution);
          }
          _this.graphService.renderGraph(currentOpd, _this.initRappidService); // Goes back to the OPD that the user is editing.
        }
        _this.dialogRef.close();
      })();
    }
    /*
    * Capture the components of currently open Opd paper and turn them to jpeg data URI string (with toJPEG function).
    */
    createImageAndDownload(fileName = "Sd", resolution = "1") {
      const paper = this.initRappidService.paper; // get the current open OPD
      if (this.includeTooltips) {
        for (const proc of this.initRappidService.graph.getCells().filter(c => OPCloudUtils.isInstanceOfDrawnProcess(c))) {
          proc.showDummyTooltip();
        }
      }
      try {
        if (this.format === "jpeg") {
          paper.toJPEG(function (imageData) {
            downloadJpeg(imageData, fileName + ".jpeg");
          }, {
            padding: 40,
            useComputedStyles: false,
            size: resolution + "x",
            quality: 1 // make wide borders in order to capture also the shades
          });
        } else {
          paper.toSVG(function (imageData) {
            downloadSVG(imageData, fileName + ".svg");
          }, {
            useComputedStyles: false,
            convertImagesToDataUris: true
          });
        }
        $(".dummyTooltip").remove();
      } catch (err) {
        (0, validationAlert)("Cannot export images. It seems the resolution is too high. Set a lower resolution and try again.", 3500, "Error");
      }
    }
    getDefaultModelName() {
      return this.initRappidService.opmModel.createDefaultModelName();
    }
    getCurrentOPDName() {
      return " " + this.initRappidService.opmModel.currentOpd.getNumberedName() + " " + this.initRappidService.opmModel.currentOpd.name;
    }
    formatChange($event) {
      this.format = $event.value;
    }
    static #_ = (() => this.ɵfac = function SaveScreenshotComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SaveScreenshotComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(GraphService), core /* ɵɵdirectiveInject */.rXU(InitRappidService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: SaveScreenshotComponent,
      selectors: [["opcloud-save-screenshot-dialog"]],
      decls: 47,
      vars: 6,
      consts: [["filename", ""], ["includeTooltips", ""], ["includeSubModels", ""], ["resolution", ""], [1, "exportOpdDiv"], [1, "exportOpdTitle"], [2, "font-size", "13px", "text-align", "center"], ["matInput", "", "placeholder", "File Name:", 3, "value"], ["matTooltip", "Check to include computational processes tooltip", "matTooltipPosition", "right", 2, "float", "left", "margin-left", "4px"], ["matTooltip", "Check to include sub-models when exporting the whole tree", "matTooltipPosition", "right", 2, "float", "left", "margin-left", "4px", 3, "checked"], [2, "padding-left", "16px"], ["hideSingleSelectionIndicator", "", 3, "change"], ["value", "jpeg", 3, "checked"], ["value", "svg"], ["style", "color: red; font-size: 11px;", 4, "ngIf"], [2, "padding-left", "16px", 3, "hidden"], ["title", "Resolution number represent quality in multiple values. e.g for 300 dpi use '3'", "matInput", "", "placeholder", "Resolution:", "type", "number", "min", "1", "max", "10", "ng-pattern", "integerval", "required", "", 2, "text-align", "center", "width", "40px", 3, "value"], [1, "opdExportButtonsP"], ["mat-raised-button", "", "id", "Current", 1, "opdExportButton", 3, "click"], ["mat-raised-button", "", "id", "Tree", 1, "opdExportButton", 3, "click"], ["mat-raised-button", "", "id", "SD", 1, "opdExportButton", 3, "click"], [2, "color", "red", "font-size", "11px"]],
      template: function SaveScreenshotComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵelementStart */.j41(0, "div", 4)(1, "p", 5);
          core /* ɵɵtext */.EFF(2, "Export Model Diagrams");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(3, "p", 6);
          core /* ɵɵtext */.EFF(4, "Note: Downloading might take few minutes");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(5, "p")(6, "mat-form-field")(7, "mat-label");
          core /* ɵɵtext */.EFF(8, "File Name");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(9, "input", 7, 0);
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(11, "br");
          core /* ɵɵelementStart */.j41(12, "mat-checkbox", 8, 1);
          core /* ɵɵtext */.EFF(14, "Include Computational Processes Tooltips");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(15, "br");
          core /* ɵɵelementStart */.j41(16, "mat-checkbox", 9, 2);
          core /* ɵɵtext */.EFF(18, "Include Sub-Models");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(19, "br")(20, "br")(21, "br");
          core /* ɵɵelementStart */.j41(22, "span")(23, "p", 10);
          core /* ɵɵtext */.EFF(24, "Exported Images Format: ");
          core /* ɵɵelementStart */.j41(25, "mat-button-toggle-group", 11);
          core /* ɵɵlistener */.bIt("change", function SaveScreenshotComponent_Template_mat_button_toggle_group_change_25_listener($event) {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.formatChange($event));
          });
          core /* ɵɵelementStart */.j41(26, "mat-button-toggle", 12);
          core /* ɵɵtext */.EFF(27, "JPEG");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(28, "mat-button-toggle", 13);
          core /* ɵɵtext */.EFF(29, "SVG");
          core /* ɵɵelementEnd */.k0s()()()();
          core /* ɵɵtemplate */.DNE(30, SaveScreenshotComponent_span_30_Template, 2, 0, "span", 14);
          core /* ɵɵelementStart */.j41(31, "span", 15);
          core /* ɵɵtext */.EFF(32, " OPDs Image Resolution: ");
          core /* ɵɵelementStart */.j41(33, "mat-form-field")(34, "mat-label");
          core /* ɵɵtext */.EFF(35, "Resolution");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(36, "input", 16, 3);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelement */.nrm(38, "br");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(39, "p", 17)(40, "button", 18);
          core /* ɵɵlistener */.bIt("click", function SaveScreenshotComponent_Template_button_click_40_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const filename_r2 = core /* ɵɵreference */.sdS(10);
            const includeTooltips_r3 = core /* ɵɵreference */.sdS(13);
            const resolution_r4 = core /* ɵɵreference */.sdS(37);
            return core /* ɵɵresetView */.Njj(ctx.screenshotMain(filename_r2.value + ctx.getCurrentOPDName(), "Current", resolution_r4.value, includeTooltips_r3.checked));
          });
          core /* ɵɵtext */.EFF(41, "Current OPD");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(42, "button", 19);
          core /* ɵɵlistener */.bIt("click", function SaveScreenshotComponent_Template_button_click_42_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const filename_r2 = core /* ɵɵreference */.sdS(10);
            const includeTooltips_r3 = core /* ɵɵreference */.sdS(13);
            const includeSubModels_r5 = core /* ɵɵreference */.sdS(17);
            const resolution_r4 = core /* ɵɵreference */.sdS(37);
            return core /* ɵɵresetView */.Njj(ctx.screenshotMain(filename_r2.value, "Tree", resolution_r4.value, includeTooltips_r3.checked, includeSubModels_r5.checked));
          });
          core /* ɵɵtext */.EFF(43, "OPD Tree");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(44, "button", 20);
          core /* ɵɵlistener */.bIt("click", function SaveScreenshotComponent_Template_button_click_44_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const filename_r2 = core /* ɵɵreference */.sdS(10);
            const includeTooltips_r3 = core /* ɵɵreference */.sdS(13);
            const resolution_r4 = core /* ɵɵreference */.sdS(37);
            return core /* ɵɵresetView */.Njj(ctx.screenshotMain(filename_r2.value, "SD", resolution_r4.value, includeTooltips_r3.checked));
          });
          core /* ɵɵtext */.EFF(45, "SD");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(46, "br");
          core /* ɵɵelementEnd */.k0s()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(9);
          core /* ɵɵproperty */.Y8G("value", ctx.getDefaultModelName());
          core /* ɵɵadvance */.R7$(7);
          core /* ɵɵproperty */.Y8G("checked", true);
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵproperty */.Y8G("checked", true);
          core /* ɵɵadvance */.R7$(4);
          core /* ɵɵproperty */.Y8G("ngIf", ctx.shouldShowMessageAboutBackgroundImages);
          core /* ɵɵadvance */.R7$();
          core /* ɵɵproperty */.Y8G("hidden", ctx.format !== "jpeg");
          core /* ɵɵadvance */.R7$(5);
          core /* ɵɵproperty */.Y8G("value", 2);
        }
      },
      dependencies: [NgIf, MatFormField, MatLabel, MatInput, MatTooltip, MatButton, MatCheckbox, MatButtonToggleGroup, MatButtonToggle],
      styles: [".exportOpdDiv[_ngcontent-%COMP%]{overflow:hidden!important;color:#000000de!important;font-family:Roboto,Helvetica Neue,sans-serif!important}.exportOpdDiv[_ngcontent-%COMP%]   .exportOpdTitle[_ngcontent-%COMP%]{text-align:center;color:#000000de!important}.exportOpdDiv[_ngcontent-%COMP%]   .opdExportButtonsP[_ngcontent-%COMP%]{justify-items:center!important;text-align:center;font-family:Roboto,Helvetica Neue,sans-serif!important;color:#000000de!important}.exportOpdDiv[_ngcontent-%COMP%]   .opdExportButtonsP[_ngcontent-%COMP%]   .opdExportButton[_ngcontent-%COMP%]{width:120px;text-align:center;align-items:center;-webkit-appearance:auto;appearance:auto;font-weight:500!important;font-family:Roboto,Helvetica Neue,sans-serif!important;color:#000000de!important;letter-spacing:normal;padding-inline-start:16px;padding-inline-end:16px;padding-left:16px;padding-right:16px}"]
    }))();
  }
  return SaveScreenshotComponent;
})();
/*
* Convert from jpeg data URI (base64-encoded) string, to blob, in order to download as jpeg file
*/
function downloadJpeg(imageData, fileName) {
  const byteCharacters = atob(imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, ""));
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {
    type: "image/jpeg"
  });
  FileSaver_min.saveAs(blob, fileName.replace(/\./g, "_"));
}
function downloadSVG(imageData, fileName) {
  const blob = new Blob([imageData], {
    type: "image/svg+xml"
  });
  FileSaver_min.saveAs(blob, fileName.replace(/\./g, "_"));
}