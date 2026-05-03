// Source: decompiled/deobfuscated.js
// Original path: ./src/app/dialogs/choose-exported-file-name/choose-exported-file-name.ts
// Extracted by opm-extracted/tools/extract.mjs

// Create a component for the dialog box where the user chooses the name of the exported file .
let ChooseExportedFileNameComponent = /*#__PURE__*/(() => {
  class ChooseExportedFileNameComponent {
    // Initialize the component of the dialog box and the field.
    constructor(dialogRef, initRappidService) {
      this.dialogRef = dialogRef;
      this.initRappidService = initRappidService;
    }
    // Creating the component.
    ngOnInit() {}
    getDefaultModelName() {
      return this.initRappidService.opmModel.createDefaultModelName();
    }
    static #_ = (() => this.ɵfac = function ChooseExportedFileNameComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ChooseExportedFileNameComponent)(core /* ɵɵdirectiveInject */.rXU(MatDialogRef, 8), core /* ɵɵdirectiveInject */.rXU(InitRappidService));
    })();
    static #_2 = (() => this.ɵcmp = /*@__PURE__*/core /* ɵɵdefineComponent */.VBU({
      type: ChooseExportedFileNameComponent,
      selectors: [["opcloud-choose-exported-file-name-dialog"]],
      decls: 28,
      vars: 2,
      consts: [["filename", ""], ["numberedOPL", ""], ["includeUnloadedSubModels", ""], [1, "exportOplDiv"], [1, "exportOplTitle"], [2, "text-align", "left", "padding-left", "16px"], ["matInput", "", "placeholder", "File Name:", 3, "value"], ["matTooltip", "Check to numbered OPL sentences", "matTooltipPosition", "right", 2, "float", "left"], ["matTooltip", "Check to include unloaded sub-models", "matTooltipPosition", "right", 2, "float", "left", 3, "checked"], [1, "oplExportButtonsP"], ["mat-raised-button", "", 1, "oplExportButton", 3, "click"]],
      template: function ChooseExportedFileNameComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = core /* ɵɵgetCurrentView */.RV6();
          core /* ɵɵelementStart */.j41(0, "div", 3)(1, "p", 4);
          core /* ɵɵtext */.EFF(2, "Export OPL");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(3, "br");
          core /* ɵɵelementStart */.j41(4, "span")(5, "p", 5);
          core /* ɵɵtext */.EFF(6, "Please choose your file name:");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(7, "mat-form-field")(8, "mat-label");
          core /* ɵɵtext */.EFF(9, "File Name");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(10, "input", 6, 0);
          core /* ɵɵelementEnd */.k0s()();
          core /* ɵɵelementStart */.j41(12, "mat-checkbox", 7, 1);
          core /* ɵɵtext */.EFF(14, "Number OPL sentences");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(15, "br");
          core /* ɵɵelementStart */.j41(16, "mat-checkbox", 8, 2);
          core /* ɵɵtext */.EFF(18, "Include unloaded sub-models");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelement */.nrm(19, "br");
          core /* ɵɵelementStart */.j41(20, "p", 9);
          core /* ɵɵelement */.nrm(21, "br")(22, "br")(23, "br");
          core /* ɵɵelementStart */.j41(24, "button", 10);
          core /* ɵɵlistener */.bIt("click", function ChooseExportedFileNameComponent_Template_button_click_24_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            const filename_r2 = core /* ɵɵreference */.sdS(11);
            const numberedOPL_r3 = core /* ɵɵreference */.sdS(13);
            const includeUnloadedSubModels_r4 = core /* ɵɵreference */.sdS(17);
            return core /* ɵɵresetView */.Njj(ctx.dialogRef.close([filename_r2.value, numberedOPL_r3.checked, includeUnloadedSubModels_r4.checked]));
          });
          core /* ɵɵtext */.EFF(25, "OK");
          core /* ɵɵelementEnd */.k0s();
          core /* ɵɵelementStart */.j41(26, "button", 10);
          core /* ɵɵlistener */.bIt("click", function ChooseExportedFileNameComponent_Template_button_click_26_listener() {
            core /* ɵɵrestoreView */.eBV(_r1);
            return core /* ɵɵresetView */.Njj(ctx.dialogRef.close(["CLOSED"]));
          });
          core /* ɵɵtext */.EFF(27, "CANCEL");
          core /* ɵɵelementEnd */.k0s()()();
        }
        if (rf & 2) {
          core /* ɵɵadvance */.R7$(10);
          core /* ɵɵproperty */.Y8G("value", ctx.getDefaultModelName());
          core /* ɵɵadvance */.R7$(6);
          core /* ɵɵproperty */.Y8G("checked", true);
        }
      },
      dependencies: [MatFormField, MatLabel, MatInput, MatTooltip, MatButton, MatCheckbox],
      styles: [".exportOplDiv[_ngcontent-%COMP%]{overflow:hidden!important;color:#000000de!important;font-family:Roboto,Helvetica Neue,sans-serif!important}.exportOplDiv[_ngcontent-%COMP%]   .exportOplTitle[_ngcontent-%COMP%]{text-align:center}.exportOplDiv[_ngcontent-%COMP%]   .oplExportButtonsP[_ngcontent-%COMP%]{justify-items:center!important;color:#000000de!important;font-family:Roboto,Helvetica Neue,sans-serif!important;text-align:center}.exportOplDiv[_ngcontent-%COMP%]   .oplExportButtonsP[_ngcontent-%COMP%]   .oplExportButton[_ngcontent-%COMP%]{font-family:Roboto,Helvetica Neue,sans-serif!important;color:#000000de!important;align-items:center;-webkit-appearance:auto;appearance:auto;font-weight:500!important;letter-spacing:normal;padding-inline-start:16px;padding-inline-end:16px;padding-left:16px;padding-right:16px}"]
    }))();
  }
  return ChooseExportedFileNameComponent;
})();
